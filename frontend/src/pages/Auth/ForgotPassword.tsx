import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
  general?: string;
}

const ForgotPassword: React.FC = () => {
  const { themeConfig } = useTheme();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, always show success
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
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
    if (errors[name as keyof ForgotPasswordErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would trigger another password reset email
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        <div className="max-w-md w-full space-y-8">
          {/* Success State */}
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
              Check your email
            </h2>
            <p 
              className="mt-4 text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              We've sent a password reset link to{' '}
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                {formData.email}
              </span>
            </p>
            <p 
              className="mt-2 text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Please check your email and click the link to reset your password.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: themeConfig.colors.secondary,
                color: themeConfig.colors.text,
                borderColor: themeConfig.colors.divider
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                  Resending...
                </div>
              ) : (
                'Resend email'
              )}
            </button>

            <Link
              to="/auth/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: themeConfig.colors.primary,
                color: 'white'
              }}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p 
              className="text-xs"
              style={{ color: themeConfig.colors.text, opacity: 0.6 }}
            >
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
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
            <EnvelopeIcon className="h-8 w-8 text-white" />
          </div>
          <h2 
            className="text-3xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            Forgot your password?
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: themeConfig.colors.text, opacity: 0.7 }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
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
                <EnvelopeIcon 
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
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                {errors.email}
              </p>
            )}
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
                Sending reset link...
              </div>
            ) : (
              'Send reset link'
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center text-sm font-medium hover:underline"
              style={{ color: themeConfig.colors.primary }}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;