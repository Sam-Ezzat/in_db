// Authentication utility functions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  churchId?: string;
  churchName?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Get current user data from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Set user data in localStorage
export const setCurrentUser = (user: User): void => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth data (logout)
export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userEmail');
};

// Get user's full name
export const getUserFullName = (user?: User | null): string => {
  if (!user) {
    user = getCurrentUser();
  }
  if (!user) return 'Guest';
  return `${user.firstName} ${user.lastName}`.trim();
};

// Get user's initials for avatar
export const getUserInitials = (user?: User | null): string => {
  if (!user) {
    user = getCurrentUser();
  }
  if (!user) return 'G';
  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}` || 'U';
};

// Check if user has specific role
export const hasRole = (requiredRole: string, user?: User | null): boolean => {
  if (!user) {
    user = getCurrentUser();
  }
  if (!user) return false;
  return user.role === requiredRole;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles: string[], user?: User | null): boolean => {
  if (!user) {
    user = getCurrentUser();
  }
  if (!user) return false;
  return roles.includes(user.role);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format auth error messages
export const getAuthErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Auto-logout on token expiry
export const setupTokenExpirationCheck = (): void => {
  const checkInterval = 60000; // Check every minute
  
  setInterval(() => {
    const token = getAuthToken();
    if (token) {
      try {
        // In a real app, you'd decode the JWT to check expiration
        // For demo purposes, we'll just check if token exists
        const userData = getCurrentUser();
        if (!userData) {
          clearAuthData();
          window.location.href = '/auth/login';
        }
      } catch (error) {
        clearAuthData();
        window.location.href = '/auth/login';
      }
    }
  }, checkInterval);
};

// Generate demo user data for testing
export const generateDemoUser = (email: string): User => {
  const [firstName] = email.split('@');
  return {
    id: `user_${Date.now()}`,
    email,
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    lastName: 'Demo',
    role: 'member',
    avatar: `https://ui-avatars.com/api/?name=${firstName}&background=3B82F6&color=fff`
  };
};