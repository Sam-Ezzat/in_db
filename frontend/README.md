# Church Management System - Frontend Setup Guide

## 🎯 Project Overview

This is the frontend part of a comprehensive Church/Service Management System built with **React**, **TypeScript**, and **Tailwind CSS**. The system includes people management, committee/team organization, event scheduling, attendance tracking, reporting, and performance evaluation features.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Layout components
│   │   ├── UI/              # Basic UI components
│   │   └── PlaceholderComponents.tsx  # Temporary placeholder components
│   ├── pages/               # Page components
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── People/          # People management pages
│   │   └── Auth/            # Authentication pages
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.tsx      # Authentication hook
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx # Theme management
│   ├── config/              # Configuration files
│   │   ├── api.ts           # 🔥 CENTRAL API CONFIG (Most Important!)
│   │   └── httpClient.ts    # HTTP client setup
│   ├── i18n/                # Internationalization
│   │   └── index.ts         # Arabic/English translations
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with theme system
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── .env                    # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🎨 Theme System

The application includes **4 beautiful themes**:

1. **Light Grace** (Default) - Clean and minimal
2. **Warm Faith** - Warm and welcoming
3. **Nature Hope** - Nature-inspired and calm
4. **Midnight Prayer** - Dark mode for evening use

Themes are configured in `tailwind.config.js` and managed via `ThemeContext.tsx`.

## 🔗 Backend Integration

### 🔥 MOST IMPORTANT FILE: `src/config/api.ts`

This file contains **EVERYTHING** needed to connect with the backend:

#### ✅ Complete API Endpoints
- All REST endpoints organized by feature
- Dynamic URL generation with parameters
- Ready for backend implementation

#### ✅ TypeScript Types
- Complete database entity types
- Request/response interfaces
- Form validation schemas

#### ✅ Configuration
- Base URL configuration
- HTTP headers and timeout settings
- Error handling patterns

#### ✅ Constants
- Role codes and permissions
- Validation rules
- Application constants

### Example Usage:

```typescript
import { API_ENDPOINTS, Person, apiClient } from '@/config/api'

// Get all people
const people = await apiClient.get<Person[]>(API_ENDPOINTS.PEOPLE.LIST)

// Create new person
const newPerson = await apiClient.post<Person>(API_ENDPOINTS.PEOPLE.CREATE, personData)

// Update person
const updated = await apiClient.patch<Person>(API_ENDPOINTS.PEOPLE.UPDATE(id), data)
```

## 📱 Features Implemented

### ✅ Core Infrastructure
- React Router with lazy loading
- Theme system with 4 color schemes
- Internationalization (Arabic/English)
- TypeScript configuration
- Tailwind CSS with custom design tokens

### ✅ Authentication System
- Login/Register/Forgot Password pages
- JWT token management
- Route protection (structure ready)
- User context management

### ✅ Page Structure
- Dashboard with KPI cards
- People management (list/detail/form)
- Churches and locations
- Committees, teams, discipleship groups
- Events and attendance
- Reports and evaluations
- Settings and profile

### ✅ API Integration Ready
- Centralized endpoint management
- HTTP client with interceptors
- Error handling
- Request/response types

## 🎯 Backend Requirements

When implementing the backend, use these endpoints from `api.ts`:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`

### People Management
- `GET /api/people` - List people with filtering
- `POST /api/people` - Create person
- `GET /api/people/:id` - Get person details
- `PATCH /api/people/:id` - Update person

### Churches & Locations
- `GET /api/churches` - List churches
- `GET /api/locations` - List locations with hierarchy

### Entity Management
- `GET /api/committees` - List committees
- `GET /api/teams` - List teams
- `GET /api/groups` - List discipleship groups

### Reports & Analytics
- `GET /api/reports` - List reports
- `GET /api/analytics/overview` - Dashboard statistics

## 📋 Database Schema

The complete PostgreSQL schema is documented in the main project documentation. Key tables:

- `person` - Individual people
- `church` - Churches/services
- `location` - Geographic hierarchy
- `role` - System roles
- `assignment` - Role assignments
- `committee`, `team`, `discipleship_group` - Organizational entities
- `event`, `attendance` - Events and attendance
- `report`, `evaluation` - Reporting and KPIs

## 🌐 Internationalization

The app supports Arabic (RTL) and English:

```typescript
// Usage in components
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
return <h1>{t('dashboard.title')}</h1>
```

## 🔒 Security Features

- JWT token management with refresh
- Route protection system
- Role-based access control (RBAC) ready
- Input validation with Zod schemas
- CORS configuration ready

## 📊 State Management

- **React Query** for server state
- **Context API** for global state (auth, theme)
- **React Hook Form** for form management
- **Zod** for validation

## 🎨 UI Components

The design system includes:

- Responsive layout with sidebar navigation
- Custom buttons, inputs, cards
- Loading states and error handling
- RTL (Right-to-Left) support for Arabic
- Dark/light theme variants

## 🚀 Next Steps

1. **Install dependencies** and run the development server
2. **Implement backend** using the API endpoints in `api.ts`
3. **Enhance UI components** as needed
4. **Add authentication logic** to `useAuth.tsx`
5. **Implement page-specific functionality**

## 🛠️ Development Tips

1. **Use the API configuration**: Always import endpoints from `src/config/api.ts`
2. **Follow the theme system**: Use CSS custom properties for colors
3. **Maintain TypeScript types**: Update `api.ts` when changing database schema
4. **Test responsiveness**: The design works on mobile, tablet, and desktop
5. **Use Arabic text**: The app is primarily designed for Arabic users

## 📞 Support

For questions about the frontend implementation:
1. Check `src/config/api.ts` for API documentation
2. Review component structure in `src/components/`
3. Examine routing in `src/App.tsx`
4. Look at theme configuration in `tailwind.config.js`

---

**Happy Coding! 🎉**

The frontend is ready for backend integration. Focus on implementing the API endpoints defined in `src/config/api.ts` and you'll have a fully functional Church Management System!