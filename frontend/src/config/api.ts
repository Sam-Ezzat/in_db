// ================================
// API CONFIGURATION - CENTRALIZED BACKEND INTEGRATION
// ================================
// This file contains ALL API endpoints, types, and configurations
// to seamlessly connect frontend with backend without conflicts

// Base API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// ================================
// API ENDPOINTS - Organized by Feature
// ================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // People Management
  PEOPLE: {
    LIST: '/people',
    CREATE: '/people',
    GET_BY_ID: (id: string) => `/people/${id}`,
    UPDATE: (id: string) => `/people/${id}`,
    DELETE: (id: string) => `/people/${id}`,
    SEARCH: '/people/search',
  },

  // Churches & Locations
  CHURCHES: {
    LIST: '/churches',
    CREATE: '/churches',
    GET_BY_ID: (id: string) => `/churches/${id}`,
    UPDATE: (id: string) => `/churches/${id}`,
    DELETE: (id: string) => `/churches/${id}`,
  },
  
  LOCATIONS: {
    LIST: '/locations',
    CREATE: '/locations',
    GET_BY_ID: (id: string) => `/locations/${id}`,
    GET_BY_TYPE: (type: string) => `/locations?type=${type}`,
    GET_BY_PARENT: (parentId: string) => `/locations?parent=${parentId}`,
  },

  // Committees
  COMMITTEES: {
    LIST: '/committees',
    CREATE: '/committees',
    GET_BY_ID: (id: string) => `/committees/${id}`,
    UPDATE: (id: string) => `/committees/${id}`,
    DELETE: (id: string) => `/committees/${id}`,
    GET_MEMBERS: (id: string) => `/committees/${id}/members`,
    ADD_MEMBER: (id: string) => `/committees/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) => `/committees/${id}/members/${memberId}`,
  },

  // Teams
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
    GET_BY_ID: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    GET_MEMBERS: (id: string) => `/teams/${id}/members`,
    ADD_MEMBER: (id: string) => `/teams/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) => `/teams/${id}/members/${memberId}`,
  },

  // Discipleship Groups
  DISCIPLESHIP_GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    GET_BY_ID: (id: string) => `/groups/${id}`,
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    GET_MEMBERS: (id: string) => `/groups/${id}/members`,
    ADD_MEMBER: (id: string) => `/groups/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) => `/groups/${id}/members/${memberId}`,
  },

  // Assignments & Roles
  ASSIGNMENTS: {
    LIST: '/assignments',
    CREATE: '/assignments',
    GET_BY_ID: (id: string) => `/assignments/${id}`,
    UPDATE: (id: string) => `/assignments/${id}`,
    DELETE: (id: string) => `/assignments/${id}`,
    GET_BY_PERSON: (personId: string) => `/assignments?personId=${personId}`,
    GET_BY_SCOPE: (scopeType: string, scopeId: string) => `/assignments?scopeType=${scopeType}&scopeId=${scopeId}`,
  },

  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    GET_BY_ID: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
  },

  // Memberships
  MEMBERSHIPS: {
    LIST: '/memberships',
    CREATE: '/memberships',
    GET_BY_ID: (id: string) => `/memberships/${id}`,
    UPDATE: (id: string) => `/memberships/${id}`,
    DELETE: (id: string) => `/memberships/${id}`,
    GET_BY_CHURCH: (churchId: string) => `/memberships?churchId=${churchId}`,
    GET_BY_PERSON: (personId: string) => `/memberships?personId=${personId}`,
  },

  // Events & Attendance
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET_BY_ID: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    GET_BY_TARGET: (targetType: string, targetId: string) => `/events?targetType=${targetType}&targetId=${targetId}`,
    GET_BY_DATE_RANGE: (from: string, to: string) => `/events?from=${from}&to=${to}`,
  },

  ATTENDANCE: {
    LIST: '/attendance',
    CREATE: '/attendance',
    BULK_CREATE: '/attendance/bulk',
    GET_BY_EVENT: (eventId: string) => `/attendance?eventId=${eventId}`,
    GET_BY_PERSON: (personId: string) => `/attendance?personId=${personId}`,
    UPDATE: (eventId: string, personId: string) => `/attendance/${eventId}/${personId}`,
  },

  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET_BY_ID: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    GET_BY_TARGET: (targetType: string, targetId: string) => `/reports?targetType=${targetType}&targetId=${targetId}`,
    GET_BY_PERIOD: (from: string, to: string) => `/reports?from=${from}&to=${to}`,
    GET_ITEMS: (id: string) => `/reports/${id}/items`,
  },

  // Evaluations & KPIs
  EVALUATIONS: {
    LIST: '/evaluations',
    CREATE: '/evaluations',
    GET_BY_ID: (id: string) => `/evaluations/${id}`,
    UPDATE: (id: string) => `/evaluations/${id}`,
    DELETE: (id: string) => `/evaluations/${id}`,
    GET_BY_TARGET: (targetType: string, targetId: string) => `/evaluations?targetType=${targetType}&targetId=${targetId}`,
    GET_BY_KPI: (kpiId: string) => `/evaluations?kpiId=${kpiId}`,
  },

  KPIS: {
    LIST: '/kpis',
    CREATE: '/kpis',
    GET_BY_ID: (id: string) => `/kpis/${id}`,
    UPDATE: (id: string) => `/kpis/${id}`,
    DELETE: (id: string) => `/kpis/${id}`,
  },

  // Analytics & Dashboard
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    ATTENDANCE_STATS: '/analytics/attendance',
    GROWTH_STATS: '/analytics/growth',
    KPI_TRENDS: '/analytics/kpi-trends',
    CUSTOM_REPORT: '/analytics/custom',
  },

  // Settings & Admin
  SETTINGS: {
    GET_PROFILE: '/settings/profile',
    UPDATE_PROFILE: '/settings/profile',
    CHANGE_PASSWORD: '/settings/password',
    GET_PERMISSIONS: '/settings/permissions',
    UPDATE_PREFERENCES: '/settings/preferences',
  },

  // Audit & Logs
  AUDIT: {
    LIST: '/audit',
    GET_BY_USER: (userId: string) => `/audit?userId=${userId}`,
    GET_BY_ENTITY: (entityType: string, entityId: string) => `/audit?entityType=${entityType}&entityId=${entityId}`,
  },
} as const;

// ================================
// TYPESCRIPT TYPES - Database Entities
// ================================

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TenantEntity extends BaseEntity {
  tenantId?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  personId?: string;
}

// User & Person Types
export interface User extends TenantEntity {
  email: string;
  isActive: boolean;
  personId?: string;
  person?: Person;
}

export interface Person extends TenantEntity {
  firstName: string;
  lastName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  // Church membership fields
  churchId?: string;
  church?: Church;
  membershipStatus?: 'active' | 'inactive' | 'visitor';
  membershipType?: string; // e.g., 'Regular Member', 'Servant', 'Deacon', etc.
  joinedDate?: string;
  leftDate?: string;
  membershipRole?: string; // Role within the church
}

// Location & Church Types
export interface Location extends TenantEntity {
  name: string;
  type: 'country' | 'governorate' | 'sector';
  parentId?: string;
  parent?: Location;
  children?: Location[];
}

export interface Church extends TenantEntity {
  name: string;
  locationId?: string;
  location?: Location;
}

// Role & Assignment Types
export interface Role extends BaseEntity {
  code: string;
  name: string;
}

export interface Assignment extends BaseEntity {
  personId: string;
  roleId: string;
  scopeType: 'church' | 'location' | 'committee' | 'team' | 'group';
  scopeId: string;
  startsAt?: string;
  endsAt?: string;
  person?: Person;
  role?: Role;
}

// Membership Types
export interface Membership extends BaseEntity {
  churchId: string;
  personId: string;
  status: 'active' | 'inactive' | 'visitor';
  joinedAt?: string;
  church?: Church;
  person?: Person;
}

// Entity Types (Committee, Team, Group)
export interface Committee extends BaseEntity {
  churchId: string;
  name: string;
  church?: Church;
}

export interface Team extends BaseEntity {
  churchId: string;
  name: string;
  category?: string;
  church?: Church;
}

export interface DiscipleshipGroup extends BaseEntity {
  churchId: string;
  name: string;
  church?: Church;
}

export interface EntityMembership extends BaseEntity {
  entityType: 'committee' | 'team' | 'group';
  entityId: string;
  personId: string;
  roleInEntity?: string;
  person?: Person;
}

// Event & Attendance Types
export interface Event extends BaseEntity {
  title: string;
  startsAt: string;
  endsAt?: string;
  targetType: 'church' | 'committee' | 'team' | 'group';
  targetId: string;
  location?: string;
  notes?: string;
}

export interface Attendance {
  eventId: string;
  personId: string;
  status: 'present' | 'absent' | 'late';
  event?: Event;
  person?: Person;
}

// Report Types
export interface Report extends BaseEntity {
  reporterPersonId?: string;
  targetType: 'church' | 'committee' | 'team' | 'group' | 'person';
  targetId: string;
  periodStart: string;
  periodEnd: string;
  title?: string;
  submittedAt?: string;
  reporter?: Person;
  items?: ReportItem[];
}

export interface ReportItem extends BaseEntity {
  reportId: string;
  itemKey: string;
  itemType: 'number' | 'text' | 'json';
  valueNumber?: number;
  valueText?: string;
  valueJson?: any;
}

// KPI & Evaluation Types
export interface KPI extends BaseEntity {
  code: string;
  name: string;
  description?: string;
}

export interface Evaluation extends BaseEntity {
  kpiId: string;
  targetType: 'church' | 'committee' | 'team' | 'group' | 'person';
  targetId: string;
  periodStart: string;
  periodEnd: string;
  score: number;
  notes?: string;
  kpi?: KPI;
}

// Analytics Types
export interface DashboardStats {
  totalMembers: number;
  activeTeams: number;
  attendanceRate: number;
  reportsSubmitted: number;
  avgEvaluationScore: number;
}

export interface AttendanceStats {
  eventId: string;
  eventTitle: string;
  totalInvited: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}

export interface GrowthStats {
  period: string;
  newMembers: number;
  totalMembers: number;
  growthRate: number;
}

// ================================
// API REQUEST/RESPONSE TYPES
// ================================

// List Response Type
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// ================================
// FORM VALIDATION SCHEMAS (for Zod)
// ================================

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  NAME: {
    minLength: 2,
    maxLength: 50,
  },
} as const;

// ================================
// ERROR HANDLING
// ================================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Server error occurred',
        code: error.response.data?.code,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'Network error - unable to reach server',
        code: 'NETWORK_ERROR',
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }
}

// ================================
// THEME CONFIGURATION
// ================================

export type ThemeType = 'light-grace' | 'warm-faith' | 'nature-hope' | 'midnight-prayer';

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    divider: string;
  };
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  'light-grace': {
    name: 'light-grace',
    displayName: 'Light Grace',
    colors: {
      primary: '#3B82F6', // blue-500
      secondary: '#F1F5F9', // slate-100
      background: '#FFFFFF', // white
      text: '#1E293B', // slate-800
      accent: '#F59E0B', // amber-500
      divider: '#E2E8F0', // slate-200
    },
  },
  'warm-faith': {
    name: 'warm-faith',
    displayName: 'Warm Faith',
    colors: {
      primary: '#DC2626', // red-600
      secondary: '#FEF2F2', // red-50
      background: '#FFFBEB', // amber-50
      text: '#7C2D12', // amber-900
      accent: '#16A34A', // green-600
      divider: '#FED7AA', // orange-200
    },
  },
  'nature-hope': {
    name: 'nature-hope',
    displayName: 'Nature Hope',
    colors: {
      primary: '#059669', // emerald-600
      secondary: '#ECFDF5', // green-50
      background: '#F0FDF4', // green-50
      text: '#064E3B', // emerald-900
      accent: '#EAB308', // yellow-500
      divider: '#BBF7D0', // green-200
    },
  },
  'midnight-prayer': {
    name: 'midnight-prayer',
    displayName: 'Midnight Prayer',
    colors: {
      primary: '#6366F1', // indigo-500
      secondary: '#374151', // gray-700
      background: '#111827', // gray-900
      text: '#F9FAFB', // gray-50
      accent: '#F59E0B', // amber-500
      divider: '#4B5563', // gray-600
    },
  },
} as const;

// ================================
// PERMISSIONS & ROLES
// ================================

export const ROLE_CODES = {
  PASTOR: 'PASTOR',
  COUNTRY_LEAD: 'COUNTRY_LEAD',
  GOVERNORATE_LEAD: 'GOVERNORATE_LEAD',
  SECTOR_LEAD: 'SECTOR_LEAD',
  TEAM_LEAD: 'TEAM_LEAD',
  DISCIPLESHIP_LEAD: 'DISCIPLESHIP_LEAD',
  COMMITTEE_LEAD: 'COMMITTEE_LEAD',
  MEMBER: 'MEMBER',
} as const;

export const PERMISSION_CODES = {
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  PERSON_VIEW: 'PERSON_VIEW',
  PERSON_CREATE: 'PERSON_CREATE',
  PERSON_EDIT: 'PERSON_EDIT',
  ENTITY_MANAGE: 'ENTITY_MANAGE',
  REPORT_CREATE: 'REPORT_CREATE',
  REPORT_VIEW: 'REPORT_VIEW',
  REPORT_APPROVE: 'REPORT_APPROVE',
  EVAL_CREATE: 'EVAL_CREATE',
  EVAL_VIEW: 'EVAL_VIEW',
  ATTENDANCE_MARK: 'ATTENDANCE_MARK',
  ATTENDANCE_VIEW: 'ATTENDANCE_VIEW',
} as const;

// ================================
// CONSTANTS
// ================================

export const APP_CONSTANTS = {
  APP_NAME: 'Church Management System',
  APP_DESCRIPTION: 'Comprehensive management system for churches and religious services',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '30d',
  SUPPORTED_LOCALES: ['en'], // Simplified to English only for now
  DEFAULT_LOCALE: 'en', // Changed from 'ar' to 'en'
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
} as const;

// Export everything as default for easy importing
export default {
  API_CONFIG,
  API_ENDPOINTS,
  VALIDATION_RULES,
  THEMES,
  ROLE_CODES,
  PERMISSION_CODES,
  APP_CONSTANTS,
  ApiErrorHandler,
};