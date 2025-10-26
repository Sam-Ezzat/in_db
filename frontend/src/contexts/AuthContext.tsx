import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  isAuthenticated, 
  getCurrentUser, 
  clearAuthData, 
  setCurrentUser, 
  setAuthToken,
  User 
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a user based on email
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: 'User',
        role: 'member'
      };
      
      // Set auth data
      setAuthToken('demo-token-12345');
      setCurrentUser(userData);
      setUser(userData);
      
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    // Redirect to login page
    window.location.href = '/auth/login';
  };

  const updateUser = (userData: User) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;