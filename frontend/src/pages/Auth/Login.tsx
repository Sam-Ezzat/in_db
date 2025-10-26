import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const { themeConfig } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      
      // Get redirect location from navigation state or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: themeConfig.colors.background }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div 
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <h2 
            className="text-3xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            Sign in to your account
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: themeConfig.colors.text, opacity: 0.7 }}
          >
            Welcome back to the Church Management System
          </p>
          
          {/* Demo Credentials */}
          <div 
            className="mt-4 p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 
              className="text-sm font-semibold mb-2"
              style={{ color: themeConfig.colors.text }}
            >
              Demo Credentials:
            </h3>
            <div className="space-y-1 text-xs" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              <p><strong>Admin:</strong> admin@church.com / admin123</p>
              <p><strong>Pastor:</strong> pastor@church.com / pastor123</p>
              <p><strong>Member:</strong> Any email / Any password</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <div 
              className="rounded-md p-4 border-l-4"
              style={{ 
                backgroundColor: '#FEF2F2',
                borderColor: '#EF4444',
                color: '#DC2626'
              }}
            >
              <p className="text-sm font-medium">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon 
                    className="h-5 w-5"
                    style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.email ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon 
                    className="h-5 w-5"
                    style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.password ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon 
                      className="h-5 w-5"
                      style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                    />
                  ) : (
                    <EyeIcon 
                      className="h-5 w-5"
                      style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-2"
                style={{ 
                  accentColor: themeConfig.colors.primary,
                  borderColor: themeConfig.colors.divider
                }}
              />
              <label 
                htmlFor="rememberMe" 
                className="ml-2 block text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                Remember me
              </label>
            </div>

            <Link
              to="/auth/forgot-password"
              className="text-sm hover:underline"
              style={{ color: themeConfig.colors.primary }}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: themeConfig.colors.primary
            }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p 
              className="text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium hover:underline"
                style={{ color: themeConfig.colors.primary }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;