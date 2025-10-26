import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Church {
  id: string;
  name: string;
  location: string;
  denomination: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  churchId: string;
  agreeToTerms: boolean;
}

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  churchId?: string;
  agreeToTerms?: string;
  general?: string;
}

const Register: React.FC = () => {
  const { themeConfig } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    churchId: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [churchSearch, setChurchSearch] = useState('');
  const [isChurchDropdownOpen, setIsChurchDropdownOpen] = useState(false);
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([]);
  const [selectedChurchIndex, setSelectedChurchIndex] = useState(-1);
  const churchDropdownRef = useRef<HTMLDivElement>(null);

  // Mock churches data - in real app, this would come from API
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockChurches: Church[] = [
          { id: '1', name: 'Grace Community Church', location: 'Downtown', denomination: 'Baptist' },
          { id: '2', name: 'Faith Baptist Church', location: 'North District', denomination: 'Baptist' },
          { id: '3', name: 'Hope Methodist Church', location: 'West Side', denomination: 'Methodist' },
          { id: '4', name: 'Trinity Presbyterian', location: 'East Valley', denomination: 'Presbyterian' },
          { id: '5', name: 'New Life Pentecostal', location: 'South End', denomination: 'Pentecostal' },
          { id: '6', name: 'St. Paul Lutheran Church', location: 'Central', denomination: 'Lutheran' },
          { id: '7', name: 'Riverside Community Church', location: 'Riverside', denomination: 'Non-denominational' },
          { id: '8', name: 'Mount Zion AME Church', location: 'Historic District', denomination: 'AME' },
          { id: '9', name: 'First Assembly of God', location: 'Midtown', denomination: 'Assembly of God' },
          { id: '10', name: 'St. Mary Catholic Church', location: 'Oak Hill', denomination: 'Catholic' },
          { id: '11', name: 'Calvary Chapel', location: 'Sunset Boulevard', denomination: 'Calvary Chapel' },
          { id: '12', name: 'Unity Fellowship Church', location: 'Garden District', denomination: 'Unity' },
          { id: '13', name: 'Bethel Episcopal Church', location: 'University Area', denomination: 'Episcopal' },
          { id: '14', name: 'Living Waters Church', location: 'Industrial Park', denomination: 'Charismatic' },
          { id: '15', name: 'First Christian Church', location: 'Old Town', denomination: 'Christian' },
        ];
        
        setChurches(mockChurches);
        setFilteredChurches(mockChurches);
      } catch (error) {
        console.error('Error fetching churches:', error);
      } finally {
        setLoadingChurches(false);
      }
    };

    fetchChurches();
  }, []);

  // Filter churches based on search
  useEffect(() => {
    if (!churchSearch.trim()) {
      setFilteredChurches(churches);
    } else {
      const searchTerm = churchSearch.toLowerCase().trim();
      const filtered = churches.filter(church => {
        const searchableText = `${church.name} ${church.location} ${church.denomination}`.toLowerCase();
        
        // Check if search term matches any part of the combined text
        return searchableText.includes(searchTerm) ||
               // Also check individual words in the search term
               searchTerm.split(' ').every(word => 
                 word.length > 0 && searchableText.includes(word)
               );
      });
      setFilteredChurches(filtered);
      setSelectedChurchIndex(-1); // Reset keyboard selection when results change
    }
  }, [churches, churchSearch]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (churchDropdownRef.current && !churchDropdownRef.current.contains(event.target as Node)) {
        setIsChurchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Church validation
    if (!formData.churchId) {
      newErrors.churchId = 'Please select a church';
    }

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

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      
      // For demo purposes, simulate successful registration
      // In real app, this would call the registration API
      const selectedChurch = churches.find(church => church.id === formData.churchId);
      console.log('Registration data:', {
        ...formData,
        selectedChurch: selectedChurch ? {
          id: selectedChurch.id,
          name: selectedChurch.name,
          location: selectedChurch.location,
          denomination: selectedChurch.denomination
        } : null
      });
      
      // Redirect to login with success message
      navigate('/auth/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your new account.' 
        } 
      });
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing/selecting
    if (errors[name as keyof RegisterErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChurchSelect = (church: Church) => {
    setFormData(prev => ({ ...prev, churchId: church.id }));
    setChurchSearch(`${church.name} (${church.denomination}) - ${church.location}`);
    setIsChurchDropdownOpen(false);
    
    // Clear church error if it exists
    if (errors.churchId) {
      setErrors(prev => ({ ...prev, churchId: undefined }));
    }
  };

  const handleChurchSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChurchSearch(value);
    setIsChurchDropdownOpen(true);
    setSelectedChurchIndex(-1); // Reset selection when typing
    
    // Clear selection if user is typing
    if (formData.churchId) {
      setFormData(prev => ({ ...prev, churchId: '' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isChurchDropdownOpen || filteredChurches.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedChurchIndex(prev => 
          prev < filteredChurches.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedChurchIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedChurchIndex >= 0 && selectedChurchIndex < filteredChurches.length) {
          handleChurchSelect(filteredChurches[selectedChurchIndex]);
        }
        break;
      case 'Escape':
        setIsChurchDropdownOpen(false);
        setSelectedChurchIndex(-1);
        break;
    }
  };

  const getSelectedChurchName = () => {
    if (!formData.churchId) return '';
    const selectedChurch = churches.find(c => c.id === formData.churchId);
    return selectedChurch ? `${selectedChurch.name} (${selectedChurch.denomination}) - ${selectedChurch.location}` : '';
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
            Create your account
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: themeConfig.colors.text, opacity: 0.7 }}
          >
            Join the Church Management System
          </p>
        </div>

        {/* Registration Form */}
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.colors.text }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.firstName ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.colors.text }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.lastName ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon 
                    className="h-5 w-5"
                    style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                  />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.phone ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Church Selection Field */}
            <div>
              <label 
                htmlFor="churchSearch" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Church
              </label>
              <div className="relative" ref={churchDropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon 
                    className="h-5 w-5"
                    style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                  />
                </div>
                <input
                  id="churchSearch"
                  name="churchSearch"
                  type="text"
                  value={formData.churchId ? getSelectedChurchName() : churchSearch}
                  onChange={handleChurchSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsChurchDropdownOpen(true)}
                  onBlur={() => {
                    // Let the click outside handler manage closing
                  }}
                  disabled={loadingChurches}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.churchId ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder={loadingChurches ? 'Loading churches...' : 'Search for your church...'}
                  autoComplete="off"
                />
                {/* Search/Dropdown arrow */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: themeConfig.colors.text, opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Dropdown Options */}
                {isChurchDropdownOpen && !loadingChurches && (
                  <div 
                    className="absolute z-50 w-full mt-1 max-h-60 overflow-auto border rounded-lg shadow-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider 
                    }}
                  >
                    {filteredChurches.length > 0 ? (
                      filteredChurches.map((church, index) => (
                        <button
                          key={church.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:opacity-80 transition-opacity border-b last:border-b-0"
                          style={{ 
                            color: themeConfig.colors.text,
                            borderColor: themeConfig.colors.divider,
                            backgroundColor: formData.churchId === church.id 
                              ? themeConfig.colors.primary + '20'
                              : index === selectedChurchIndex 
                                ? themeConfig.colors.secondary 
                                : 'transparent'
                          }}
                          onClick={() => handleChurchSelect(church)}
                          onMouseEnter={() => setSelectedChurchIndex(index)}
                        >
                          <div className="font-medium">{church.name}</div>
                          <div className="text-sm opacity-70">
                            {church.denomination} • {church.location}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div 
                        className="px-4 py-3 text-sm"
                        style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                      >
                        {churchSearch.trim() ? 'No churches found matching your search.' : 'Start typing to search for churches...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.churchId && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.churchId}
                </p>
              )}
              {!loadingChurches && churches.length === 0 && (
                <p className="mt-1 text-sm" style={{ color: '#F59E0B' }}>
                  No churches available. Please contact support.
                </p>
              )}
              {!loadingChurches && churches.length > 0 && !formData.churchId && !isChurchDropdownOpen && (
                <p className="mt-1 text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                  Search and select the church you belong to or wish to join. If your church is not listed, please contact an administrator.
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: errors.password ? '#EF4444' : themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Create a password"
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
                Confirm Password
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
                  placeholder="Confirm your password"
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

          {/* Terms Agreement */}
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 mt-0.5 rounded border-gray-300 focus:ring-2 focus:ring-offset-2"
              style={{ 
                accentColor: themeConfig.colors.primary,
                borderColor: themeConfig.colors.divider
              }}
            />
            <div className="ml-3">
              <label 
                htmlFor="agreeToTerms" 
                className="text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="underline hover:no-underline"
                  style={{ color: themeConfig.colors.primary }}
                >
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link
                  to="/privacy"
                  className="underline hover:no-underline"
                  style={{ color: themeConfig.colors.primary }}
                >
                  Privacy Policy
                </Link>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
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
                Creating account...
              </div>
            ) : (
              'Create account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p 
              className="text-sm"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-medium hover:underline"
                style={{ color: themeConfig.colors.primary }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;