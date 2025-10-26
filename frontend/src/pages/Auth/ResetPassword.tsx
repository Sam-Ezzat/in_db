import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const ResetPassword: React.FC = () => {
  const { themeConfig } = useTheme();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate reset token on component mount
    const validateToken = async () => {
      if (!token || !email) {
        setIsValidToken(false);
        return;
      }

      try {
        // Simulate token validation API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, consider token valid if it exists
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token, email]);

  const validateForm = (): boolean => {
    const newErrors: ResetPasswordErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always show success
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ResetPasswordErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent mx-auto mb-4" style={{ color: themeConfig.colors.primary }}></div>
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Validating reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div 
              className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#EF4444' }}
            >
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h2 
              className="text-3xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              Invalid reset link
            </h2>
            <p 
              className="mt-4 text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/auth/forgot-password"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              Request new reset link
            </Link>
            
            <Link
              to="/auth/login"
              className="w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: themeConfig.colors.secondary,
                color: themeConfig.colors.text,
                borderColor: themeConfig.colors.divider
              }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div 
              className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#10B981' }}
            >
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h2 
              className="text-3xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              Password reset successful
            </h2>
            <p 
              className="mt-4 text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <Link
            to="/auth/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    );
  }

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
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 
            className="text-3xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            Reset your password
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: themeConfig.colors.text, opacity: 0.7 }}
          >
            Enter your new password below
          </p>
          {email && (
            <p 
              className="mt-1 text-sm font-medium"
              style={{ color: themeConfig.colors.text, opacity: 0.8 }}
            >
              for {email}
            </p>
          )}
        </div>

        {/* Reset Password Form */}
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
            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                New Password
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.password ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter your new password"
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

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon 
                    className="h-5 w-5"
                    style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                  />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.confirmPassword ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: themeConfig.colors.primary
            }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Resetting password...
              </div>
            ) : (
              'Reset password'
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm font-medium hover:underline"
              style={{ color: themeConfig.colors.primary }}
            >
              Remember your password? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;