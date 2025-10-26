# مشروع قاعدة بيانات للخدمات والكنائس (React +typescript+ Node.js/Express + PostgreSQL)

> وثيقة تصميم مبدئية قابلة للتطوير والتعديل.

---

## 🎯 الأهداف

1. تخزين البيانات الأساسية لكل فرد.
2. رفع تقارير من (لجنة/مجموعة/فريق/فرد).
3. قياس الأداء والتقدم للخدمة والفرق واللجان.
4. وضع نظام تقييم واقتراح خطط جديدة بناءً على البيانات.
5. إظهار إحصائيات تفصيلية داخل الخدمة وداخل كل فريق/لجنة/مجموعة.
6. دعم نطاق انتشار واسع (كنيسة/خدمة > بلد > محافظة > قطاع …).

---

## 🏗️ هيكل الدومين (النطاق) و الـ ERD (وصف نصّي)

**كيانات رئيسية:**

* **Tenant**: المالك/المؤسسة (للدعم متعدد الكنائس/الخدمات) – اختيارية لو أردت SaaS.
* **Church/Service**: الكنيسة/الخدمة الأساسية.
* **Location**: بلد، محافظة، قطاع (هرمي).
* **Person (Member)**: الأفراد.
* **Role**: الأدوار السبعة الأساسية + أدوار إدارية لاحقًا.
* **Assignment**: إسناد الأدوار للأفراد داخل نطاق (كنيسة/موقع/كيان).
* **Committee**: اللجان (مثل اللجنة التنفيذية، لجنة الشباب…).
* **Team**: الفرق (تسبيح، صلاة، ميديا…).
* **DiscipleshipGroup**: مجموعات التلمذة.
* **Pastor**: يمكن تمثيل الراعي كـ Role + Assignment أو ككيان فرعي، نستخدم Role.
* **Membership**: ربط الشخص بالكنيسة مع حالة العضوية.
* **Report**: تقارير دورية من لجنة/فريق/مجموعة/فرد.
* **ReportItem**: عناصر التقرير (قابلة للتخصيص).
* **Evaluation**: تقييمات (KPIs/Scoring) للكيانات.
* **KPI**: تعريف مؤشرات الأداء.
* **Attendance**: حضور الاجتماعات/الفعاليات.
* **Event/Meeting**: حدث أو اجتماع مرتبط بكيان (فريق/مجموعة/لجنة).
* **User**: حسابات الدخول (Auth).
* **AuditLog**: تتبع العمليات.

**العلاقات المختصرة:**

* Church ↔ Location (Many-to-One)
* Person ↔ Membership ↔ Church (Many-to-Many مع حقول حالة)
* Role ↔ Assignment ↔ Person (Many-to-Many) مع نطاق (scope) قد يكون Church/Location/Committee/Team/Group
* Committee/Team/DiscipleshipGroup ↔ Church (Many-to-One)
* Report ↔ (Committee|Team|Group|Person) باستخدام polymorphic reference
* Evaluation ↔ (Committee|Team|Group|Church|Person)
* KPI ↔ Evaluation (One-to-Many)
* Event ↔ (Committee|Team|Group|Church)
* Attendance ↔ Event ↔ Person

> **ملحوظة**: لدعم التعددية والمرونة، سنستخدم "Polymorphic Targets" عبر أعمدة (target_type, target_id).

---

## 🗃️ مخطط قاعدة البيانات (PostgreSQL) — نواة

```sql
-- امتدادات مفيدة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- 1) المالك/المستأجر (اختياري)
CREATE TABLE IF NOT EXISTS tenant (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) الموقع الهرمي
CREATE TABLE IF NOT EXISTS location (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('country','governorate','sector')),
  parent_id UUID REFERENCES location(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_location_parent ON location(parent_id);

-- 3) الكنيسة/الخدمة
CREATE TABLE IF NOT EXISTS church (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  location_id UUID REFERENCES location(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_church_location ON church(location_id);

-- 4) الأشخاص
CREATE TABLE IF NOT EXISTS person (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  gender TEXT CHECK (gender IN ('male','female')),
  birth_date DATE,
  phone TEXT,
  email CITEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_person_tenant_email ON person(tenant_id, email) WHERE email IS NOT NULL;

-- 5) العضوية داخل كنيسة
CREATE TABLE IF NOT EXISTS membership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES church(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active','inactive','visitor')),
  joined_at DATE,
  UNIQUE (church_id, person_id)
);

-- 6) الأدوار
CREATE TABLE IF NOT EXISTS role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);
-- أدوار مقترحة: PASTOR, COUNTRY_LEAD, GOVERNORATE_LEAD, SECTOR_LEAD, TEAM_LEAD, DISCIPLESHIP_LEAD, COMMITTEE_LEAD, MEMBER

-- 7) إسناد الأدوار بنطاقات متعددة
CREATE TABLE IF NOT EXISTS assignment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES role(id),
  scope_type TEXT NOT NULL CHECK (scope_type IN ('church','location','committee','team','group')),
  scope_id UUID NOT NULL,
  starts_at DATE,
  ends_at DATE,
  CHECK (starts_at IS NULL OR ends_at IS NULL OR starts_at <= ends_at)
);
CREATE INDEX IF NOT EXISTS idx_assignment_scope ON assignment(scope_type, scope_id);

-- 8) اللجان
CREATE TABLE IF NOT EXISTS committee (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES church(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9) الفرق
CREATE TABLE IF NOT EXISTS team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES church(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT, -- worship, prayer, media, ...
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10) مجموعات التلمذة
CREATE TABLE IF NOT EXISTS discipleship_group (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES church(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11) ربط الأعضاء بالكيانات (عضوية فرق/لجان/مجموعات)
CREATE TABLE IF NOT EXISTS entity_membership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('committee','team','group')),
  entity_id UUID NOT NULL,
  person_id UUID NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  role_in_entity TEXT, -- leader, member, coordinator
  UNIQUE(entity_type, entity_id, person_id)
);
CREATE INDEX IF NOT EXISTS idx_entity_membership ON entity_membership(entity_type, entity_id);

-- 12) الأحداث/الاجتماعات
CREATE TABLE IF NOT EXISTS event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  target_type TEXT NOT NULL CHECK (target_type IN ('church','committee','team','group')),
  target_id UUID NOT NULL,
  location TEXT,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_event_target ON event(target_type, target_id);

-- 13) الحضور
CREATE TABLE IF NOT EXISTS attendance (
  event_id UUID REFERENCES event(id) ON DELETE CASCADE,
  person_id UUID REFERENCES person(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late')),
  PRIMARY KEY (event_id, person_id)
);

-- 14) التقارير (رأس التقرير)
CREATE TABLE IF NOT EXISTS report (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_person_id UUID REFERENCES person(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('church','committee','team','group','person')),
  target_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  title TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  CHECK (period_start <= period_end)
);
CREATE INDEX IF NOT EXISTS idx_report_target_period ON report(target_type, target_id, period_start, period_end);

-- 15) عناصر التقرير (قابلة للتخصيص)
CREATE TABLE IF NOT EXISTS report_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES report(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL, -- مثل: new_members, visits_count, activities, notes
  item_type TEXT NOT NULL CHECK (item_type IN ('number','text','json')),
  value_number NUMERIC,
  value_text TEXT,
  value_json JSONB
);
CREATE INDEX IF NOT EXISTS idx_report_item_key ON report_item(report_id, item_key);

-- 16) تعريف مؤشرات الأداء
CREATE TABLE IF NOT EXISTS kpi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

-- 17) تقييمات/قياسات مرتبطة بكيان
CREATE TABLE IF NOT EXISTS evaluation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID NOT NULL REFERENCES kpi(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('church','committee','team','group','person')),
  target_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  score NUMERIC NOT NULL CHECK (score >= 0),
  notes TEXT,
  UNIQUE(kpi_id, target_type, target_id, period_start, period_end)
);
CREATE INDEX IF NOT EXISTS idx_eval_target_period ON evaluation(target_type, target_id, period_start, period_end);

-- 18) المستخدمون (حسابات الدخول)
CREATE TABLE IF NOT EXISTS app_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE SET NULL,
  person_id UUID REFERENCES person(id) ON DELETE SET NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19) صلاحيات مبنية على الأدوار (RBAC) — تبسيط
CREATE TABLE IF NOT EXISTS permission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS role_permission (
  role_id UUID REFERENCES role(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permission(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 20) سجل تدقيق
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta JSONB
);
```

**ملاحظات تصميمية:**

* استخدام `target_type/target_id` يمنحنا مرونة لربط التقارير والتقييمات والأحداث بأي كيان.
* يمكن لاحقًا تطبيق **Row-Level Security** على PostgreSQL للحماية حسب `tenant_id` و/أو النطاق.
* فهارس على الأعمدة الأكثر استعلامًا (target, period, foreign keys).

---

## 🔐 الأدوار والصلاحيات (مطابقة للمتطلبات)

**الأدوار الأساسية:**

1. راعي الكنيسة/الخدمة (PASTOR)
2. قائد بلد (COUNTRY_LEAD)
3. قائد محافظة (GOVERNORATE_LEAD)
4. قائد قطاع داخل المحافظة (SECTOR_LEAD)
5. قائد فريق (TEAM_LEAD)
6. قائد مجموعة تلمذة (DISCIPLESHIP_LEAD)
7. قائد لجنة (COMMITTEE_LEAD)
8. عضو (MEMBER)

**نموذج صلاحيات مقترح (أمثلة):**

* `REPORT_CREATE`, `REPORT_VIEW`, `REPORT_APPROVE`
* `EVAL_CREATE`, `EVAL_VIEW`
* `PERSON_CREATE`, `PERSON_VIEW`, `PERSON_EDIT`
* `ENTITY_MANAGE` (لإنشاء/تعديل لجان/فرق/مجموعات ضمن النطاق)
* `ATTENDANCE_MARK`, `ATTENDANCE_VIEW`
* `DASHBOARD_VIEW`

نربط الأذونات بالأدوار عبر `role_permission`، ثم نُسند الأدوار للأشخاص ضمن نطاق معيّن عبر `assignment`.

---

## 🌐 واجهات API (Express) — عيّنة تصميم

**المبدأ:** REST + JWT Auth، مع `tenantId` مستمد من الـ token/الـ subdomain.

* **Auth**

  * `POST /api/auth/register` — إنشاء مستخدم (مسؤول فقط)
  * `POST /api/auth/login` — تسجيل الدخول (JWT)
  * `POST /api/auth/logout`

* **People**

  * `GET /api/people` (بحث/ترشيح)
  * `POST /api/people`
  * `GET /api/people/:id`
  * `PATCH /api/people/:id`

* **Churches & Locations**

  * `GET /api/churches`
  * `POST /api/churches`
  * `GET /api/locations?type=governorate&parent=...`

* **Committees/Teams/Groups**

  * `POST /api/committees` | `GET /api/committees` | `GET /api/committees/:id`
  * نفس الشئ لـ `teams` و `groups`

* **Assignments & Memberships**

  * `POST /api/assignments`
  * `GET /api/assignments?personId=&scopeType=&scopeId=`
  * `POST /api/memberships`

* **Events & Attendance**

  * `POST /api/events`
  * `GET /api/events?targetType=&targetId=&from=&to=`
  * `POST /api/events/:id/attendance` (bulk)

* **Reports**

  * `POST /api/reports` + عناصر التقرير
  * `GET /api/reports?targetType=&targetId=&from=&to=`
  * `GET /api/reports/:id`

* **Evaluations/KPIs**

  * `POST /api/kpis`
  * `POST /api/evaluations`
  * `GET /api/evaluations?targetType=&targetId=&from=&to=`

* **Dashboards/Analytics**

  * `GET /api/analytics/overview?level=church|committee|team|group&id=...&from=&to=`
  * يعيد مؤشرات: (عدد الأعضاء النشطين، حضور، متوسط تقييم، نمو …)

**استجابة نموذجية للتقرير (POST /api/reports):**

```json
{
  "reporterPersonId": "...",
  "targetType": "team",
  "targetId": "...",
  "periodStart": "2025-10-01",
  "periodEnd": "2025-10-15",
  "title": "تقرير فريق التسبيح النصف شهري",
  "items": [
    {"itemKey": "rehearsals_count", "itemType": "number", "valueNumber": 4},
    {"itemKey": "new_members", "itemType": "number", "valueNumber": 2},
    {"itemKey": "notes", "itemType": "text", "valueText": "احتياج لمعدات صوت إضافية"}
  ]
}
```

---

## 📈 KPIs واقتراحات قياس الأداء

**أمثلة KPIs:**

* **Attendance Rate**: (الحضور الفعلي / إجمالي الأعضاء الفعّالين في الكيان) خلال فترة.
* **Engagement Growth**: نمو الأعضاء النشطين شهر-بشهر.
* **Report Timeliness**: نسبة التقارير المقدمة قبل/بعد الموعد.
* **Discipleship Progress**: متوسط حضور/إنهاء مراحل التلمذة.
* **Volunteer Hours**: ساعات خدمة الفرق.

**مثال استعلام الحضور لفريق:**

```sql
SELECT e.target_id AS team_id,
       DATE_TRUNC('month', e.starts_at) AS month,
       AVG(CASE WHEN a.status='present' THEN 1 ELSE 0 END) AS attendance_rate
FROM event e
JOIN attendance a ON a.event_id = e.id
WHERE e.target_type='team' AND e.target_id=$1
GROUP BY 1,2
ORDER BY 2;
```

---

## 🔧 البنية التقنية

* **الفرونت (React):**

  * State/Data: TanStack Query + Context للأذونات.
  * Forms: React Hook Form + Zod.
  * UI: Tailwind أو MUI. دعم اتجاه RTL للعربية.
  * Routing: React Router.
  * i18n: react-i18next (عربي/إنجليزي).
  * Charts: Recharts أو Chart.js.

* **الخلفية (Node/Express):**

  * Auth: JWT + Refresh + Bcrypt.
  * Validation: Zod/Joi.
  * ORM: Prisma أو Knex (Prisma يسرّع الإنتاجية).
  * Logging: pino + morgan.
  * Testing: Jest + Supertest.

* **قاعدة البيانات (Postgres):**

  * فهارس مدروسة + قيود.
  * إمكانية RLS لاحقًا.
  * نسخ احتياطي وجدولة صيانة.

* **البنية:**

  * Monorepo (اختياري) أو فصل واجهة/خادم.
  * CI/CD (GitHub Actions): lint, test, deploy.

---

## 🧪 التحقق والجودة

* أدوار اختبارية (Seed): إنشاء عينات بيانات لأدوار مختلفة.
* تغطية وحدات (Unit) وتكامل (Integration) للـ API.
* حماية Endpoints بالأذونات.

---

## 🔒 الأمان

* سياسة كلمات مرور قوية + قفل مؤقت بعد محاولات فاشلة.
* JWT قصيرة العمر + Refresh Tokens + تدوير.
* CORS مضبوط حسب الدومين.
* تسجيل كل العمليات الحساسة في `audit_log`.

---

## 🚀 خارطة طريق MVP (3 أسابيع كمثال)

**الأسبوع 1**: إعداد المشروع، Auth، People، Churches/Locations، الأدوار والإسناد.

**الأسبوع 2**: كيانات (Committees/Teams/Groups)، Events/Attendance، Memberships.

**الأسبوع 3**: Reports/Evaluations/KPIs، لوحات معلومات بسيطة، نشر أولي.

---

## 🧩 ملفات بيئة التشغيل

```
# server/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/churchdb
JWT_SECRET=change_me
TENANCY_MODE=single   # أو multi
```

---

## 📦 سكريبتات Seed (مقتطف Prisma/SQL مبسّط)

```sql
INSERT INTO role (id, code, name) VALUES
  (uuid_generate_v4(),'PASTOR','راعي'),
  (uuid_generate_v4(),'COUNTRY_LEAD','قائد بلد'),
  (uuid_generate_v4(),'GOVERNORATE_LEAD','قائد محافظة'),
  (uuid_generate_v4(),'SECTOR_LEAD','قائد قطاع'),
  (uuid_generate_v4(),'TEAM_LEAD','قائد فريق'),
  (uuid_generate_v4(),'DISCIPLESHIP_LEAD','قائد مجموعة تلمذة'),
  (uuid_generate_v4(),'COMMITTEE_LEAD','قائد لجنة'),
  (uuid_generate_v4(),'MEMBER','عضو');

INSERT INTO permission (id, code, description) VALUES
  (uuid_generate_v4(),'DASHBOARD_VIEW','رؤية لوحة التحكم'),
  (uuid_generate_v4(),'PERSON_VIEW','عرض الأفراد'),
  (uuid_generate_v4(),'PERSON_CREATE','إضافة الأفراد'),
  (uuid_generate_v4(),'PERSON_EDIT','تعديل الأفراد'),
  (uuid_generate_v4(),'ENTITY_MANAGE','إدارة الكيانات'),
  (uuid_generate_v4(),'REPORT_CREATE','إنشاء تقارير'),
  (uuid_generate_v4(),'REPORT_VIEW','عرض تقارير'),
  (uuid_generate_v4(),'REPORT_APPROVE','اعتماد تقارير'),
  (uuid_generate_v4(),'EVAL_CREATE','إنشاء تقييمات'),
  (uuid_generate_v4(),'EVAL_VIEW','عرض تقييمات'),
  (uuid_generate_v4(),'ATTENDANCE_MARK','تسجيل حضور'),
  (uuid_generate_v4(),'ATTENDANCE_VIEW','عرض حضور');
```

---

## 🖥️ واجهة المستخدم (صفحات مقترحة)

* تسجيل الدخول/إنشاء حساب.
* لوحة تحكم مُجمّعة (حسب الدور).
* إدارة الأشخاص.
* إدارة الكنائس والمواقع.
* إدارة اللجان/الفرق/المجموعات.
* الأحداث والحضور.
* إنشاء/استعراض التقارير.
* التقييمات والمؤشرات.

**مكونات UI:**

* جداول مع فرز/بحث/تصفية.
* نماذج ديناميكية لعناصر التقرير.
* بطاقات KPI ورسوم بيانية.

---

## ✅ الخطوة التالية

* أختر: **Single-tenant** (مشروع واحد لكنيسة واحدة) أو **Multi-tenant** (خدمة متعددة الكنائس) لنشغّل RLS لاحقًا.
* إن رغبت: أُضيف لك **ملفات Prisma + Express boilerplate** وواجهات React أساسية (CRUD) وفق هذا المخطط.

Church Management System — UI/UX Structure (Wireframe in Markdown)

Framework: React + typescript + Tailwind
Target: Web Dashboard (Admin & Leaders)

🏠 Main Layout

Global Layout:

Top Navbar: App logo | Notifications 🔔 | User Profile (dropdown)

Sidebar (collapsible):

Dashboard

People

Churches / Locations

Committees

Teams

Discipleship Groups

Events & Attendance

Reports

Evaluations / KPIs

Settings

1️⃣ Dashboard

Purpose: Overview of service performance.

Sections:

📊 Summary Cards: Total Members | Active Teams | Attendance Rate | Reports Submitted | Avg Evaluation Score

📅 Activity Timeline: Recent reports, meetings, and evaluations

📈 Charts:

Attendance trend by month

KPI performance per team

🔍 Quick Actions:

Add Member

Create Report

Schedule Event

2️⃣ People Management

Route: /people

Purpose: Manage all individuals.

Views:

List View:

Search 🔍, Filter (Active/Inactive), Sort by Name

Table Columns: Name | Role | Church | Contact | Status | Actions (View/Edit/Delete)

Detail View:

Basic Info (Name, Age, Contact)

Role Assignments

Memberships (Church, Team, Group)

Attendance summary

Reports contributed

Form View (Add/Edit):

Personal Info (Name, Gender, DOB, Phone, Email)

Assign Role

Select Church / Team / Group

Notes

3️⃣ Churches / Locations

Route: /churches

Purpose: Manage hierarchy of churches and their geographical structure.

Views:

Map or Hierarchy Tree View

Country > Governorate > Sector > Church

Church Detail View:

Info: Name, Location, Pastors

Members count

Committees / Teams summary

Reports overview

Form: Add / Edit Church

4️⃣ Committees

Route: /committees

Views:

List: Committee Name | Leader | Members | Reports Count

Detail: Info + Members + Reports + KPI overview

Form: Add / Edit Committee

5️⃣ Teams

Route: /teams

Views:

List: Team Name | Category | Leader | Members | Performance Score

Detail:

Info: Name, Type (Worship, Prayer, Media...)

Members list

Attendance Summary Chart

Recent Reports

KPIs

Form: Add / Edit Team

6️⃣ Discipleship Groups

Route: /groups

Views:

List: Group Name | Leader | Members | Progress

Detail:

Info + Disciples

Attendance logs

Reports + Notes

Form: Add / Edit Group

7️⃣ Events & Attendance

Route: /events

Views:

Calendar View (Month/Week)

List View:

Title | Date | Target (Team/Committee/Group) | Attendance %

Detail View:

Event Info + Attendance Table

Actions: Mark Attendance, Export CSV

Form: Create / Edit Event

8️⃣ Reports

Route: /reports

Views:

Filters: Target Type, Date Range, Reporter

List: Title | Target | Period | Submitted By | Date

Detail View:

Report Info (Target, Period, Reporter)

Report Items (custom fields)

Charts if numeric

Form: Create / Edit Report

Dynamic Items (number/text/json)

Submit/Save Draft

9️⃣ Evaluations & KPIs

Route: /evaluations

Views:

KPI List: Code | Name | Description

Evaluation Dashboard:

Table: Target | KPI | Period | Score | Notes

Charts: KPI Trends per Team/Committee

Form: Create / Edit Evaluation

🔧 Settings

Route: /settings

Tabs:

Account Settings (User info, password)

Roles & Permissions

Tenancy / Church Configuration

System Logs (Audit)

👤 Profile Page

Route: /profile

Personal Info

Assigned Roles

Activity Summary (Reports, Events attended, Evaluations)

Option to update contact info / change password

⚙️ Authentication Flow

Routes:

/login — Email + Password

/register (Admin only)

/forgot-password — Request reset

/reset-password

🎯 Mobile / Tablet View

Collapsible sidebar → Bottom tab bar

Simplified dashboard cards

Swipe-friendly attendance marking

🧭 Navigation Flow Summary


# 🎨 Church / Service Management System – UI/UX Design Tokens

## 🧭 Overview
This document defines **system-wide themes, typography, buttons, dividers, and icon styles** for the Church / Service Management App built with **React, Node.js, Express, PostgreSQL**.

---

## 🎨 Color Palettes (4 System Themes)

### 🌤️ Light Grace Theme
Clean, minimal, and elegant.
| Role | Color | HEX |
|------|--------|------|
| Primary | Soft Blue | `#3A7CA5` |
| Secondary | Light Beige | `#F2E9E4` |
| Background | Off White | `#FAFAFA` |
| Text | Charcoal | `#2C2C2C` |
| Accent | Warm Gold | `#E8B04C` |
| Divider | Light Gray | `#E0E0E0` |

---

### 🌅 Warm Faith Theme
Warm and welcoming — reflects energy and fellowship.
| Role | Color | HEX |
|------|--------|------|
| Primary | Burnt Orange | `#D77A61` |
| Secondary | Soft Cream | `#FFF3E2` |
| Background | Light Sand | `#F7E7CE` |
| Text | Deep Brown | `#4B2E05` |
| Accent | Olive Green | `#B5C99A` |
| Divider | Cream Gray | `#E6D8C3` |

---

### 🌿 Nature Hope Theme
Nature-inspired — calm and peaceful atmosphere.
| Role | Color | HEX |
|------|--------|------|
| Primary | Forest Green | `#387C6D` |
| Secondary | Misty White | `#F0F5F3` |
| Background | Soft Sage | `#E3EDE6` |
| Text | Dark Moss | `#1E392A` |
| Accent | Light Amber | `#E2C044` |
| Divider | Pale Green | `#D7E2DC` |

---

### 🌌 Midnight Prayer Theme
Dark mode — elegant and meditative.
| Role | Color | HEX |
|------|--------|------|
| Primary | Deep Navy | `#1E2A38` |
| Secondary | Slate Gray | `#2F3E46` |
| Background | Dark Charcoal | `#121212` |
| Text | Silver | `#E0E0E0` |
| Accent | Royal Gold | `#C5A25D` |
| Divider | Steel Gray | `#3E4A52` |

---

## 🔠 Typography
| Element | Font | Size | Weight | Example |
|----------|------|------|---------|----------|
| H1 | Inter / Roboto | 32px | 700 | Church Dashboard |
| H2 | Inter / Roboto | 24px | 600 | Team Overview |
| H3 | Inter / Roboto | 20px | 500 | Reports Summary |
| Body | Inter / Roboto | 16px | 400 | Regular paragraph text |
| Small | Inter / Roboto | 14px | 400 | Note or hint text |

