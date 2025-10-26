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
      
      // Admin credentials
      if (email === 'admin@church.com' && password === 'admin123') {
        const adminData: User = {
          id: 'admin_001',
          email,
          firstName: 'Church',
          lastName: 'Administrator',
          role: 'admin',
          churchId: '1',
          churchName: 'Grace Community Church'
        };
        
        setAuthToken('admin-token-12345');
        setCurrentUser(adminData);
        setUser(adminData);
        return;
      }
      
      // Pastor credentials
      if (email === 'pastor@church.com' && password === 'pastor123') {
        const pastorData: User = {
          id: 'pastor_001',
          email,
          firstName: 'John',
          lastName: 'Smith',
          role: 'pastor',
          churchId: '1',
          churchName: 'Grace Community Church'
        };
        
        setAuthToken('pastor-token-12345');
        setCurrentUser(pastorData);
        setUser(pastorData);
        return;
      }
      
      // Default demo user for any other credentials
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: 'User',
        role: 'member',
        churchId: '1',
        churchName: 'Grace Community Church'
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