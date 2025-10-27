import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, Clock } from 'lucide-react'

interface ChurchFormData {
  name: string
  denomination: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  pastor: string
  established: string
  status: 'Active' | 'Inactive'
  description: string
  facebook: string
  instagram: string
  youtube: string
  facilities: string[]
}

interface Service {
  name: string
  day: string
  time: string
  description: string
}

const ChurchForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditing = Boolean(id)

  // Mock data for editing - replace with API call
  const initialData: ChurchFormData = isEditing ? {
    name: 'Grace Community Church',
    denomination: 'Baptist',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phone: '+1 (555) 123-4567',
    email: 'info@gracecommunity.org',
    website: 'https://gracecommunity.org',
    pastor: 'John Smith',
    established: '1995',
    status: 'Active',
    description: 'Grace Community Church has been serving the Springfield community for over 25 years.',
    facebook: 'https://facebook.com/gracecommunity',
    instagram: 'https://instagram.com/gracecommunity',
    youtube: 'https://youtube.com/gracecommunity',
    facilities: ['Main Sanctuary (400 seats)', 'Fellowship Hall', 'Children\'s Wing', 'Youth Room']
  } : {
    name: '',
    denomination: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    pastor: '',
    established: '',
    status: 'Active',
    description: '',
    facebook: '',
    instagram: '',
    youtube: '',
    facilities: []
  }

  const [formData, setFormData] = useState<ChurchFormData>(initialData)
  const [services, setServices] = useState<Service[]>(isEditing ? [
    { name: 'Sunday Morning Worship', day: 'Sunday', time: '10:00 AM', description: 'Main worship service' },
    { name: 'Wednesday Bible Study', day: 'Wednesday', time: '7:00 PM', description: 'Midweek Bible study' }
  ] : [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newFacility, setNewFacility] = useState('')

  const denominations = [
    'Baptist', 'Methodist', 'Presbyterian', 'Lutheran', 'Catholic', 
    'Pentecostal', 'Episcopal', 'Assembly of God', 'Non-denominational', 'Other'
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleInputChange = (field: keyof ChurchFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        facilities: [...prev.facilities, newFacility.trim()] 
      }))
      setNewFacility('')
    }
  }

  const removeFacility = (facilityToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      facilities: prev.facilities.filter(facility => facility !== facilityToRemove) 
    }))
  }

  const addService = () => {
    setServices(prev => [...prev, { name: '', day: 'Sunday', time: '', description: '' }])
  }

  const updateService = (index: number, field: keyof Service, value: string) => {
    setServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ))
  }

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Church name is required'
    if (!formData.denomination.trim()) newErrors.denomination = 'Denomination is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.pastor.trim()) newErrors.pastor = 'Pastor name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would make API call to save the church
      console.log('Saving church:', formData, 'Services:', services)
      navigate('/churches')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/churches')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Churches
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {isEditing ? 'Edit Church' : 'Add New Church'}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {isEditing ? 'Update church information' : 'Create a new church profile'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Building size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Church Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.name ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.name ? '2px' : '1px'
                    }}
                    placeholder="Enter church name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Denomination *
                  </label>
                  <select
                    value={formData.denomination}
                    onChange={(e) => handleInputChange('denomination', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.denomination ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.denomination ? '2px' : '1px'
                    }}
                  >
                    <option value="">Select denomination</option>
                    {denominations.map(denom => (
                      <option key={denom} value={denom}>{denom}</option>
                    ))}
                  </select>
                  {errors.denomination && (
                    <p className="text-red-500 text-xs mt-1">{errors.denomination}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Lead Pastor *
                  </label>
                  <input
                    type="text"
                    value={formData.pastor}
                    onChange={(e) => handleInputChange('pastor', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.pastor ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.pastor ? '2px' : '1px'
                    }}
                    placeholder="Enter pastor name"
                  />
                  {errors.pastor && (
                    <p className="text-red-500 text-xs mt-1">{errors.pastor}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={formData.established}
                    onChange={(e) => handleInputChange('established', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="e.g., 1995"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Tell us about this church..."
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <MapPin size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.address ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.address ? '2px' : '1px'
                    }}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.city ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.city ? '2px' : '1px'
                    }}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.state ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.state ? '2px' : '1px'
                    }}
                  >
                    <option value="">Select state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.zipCode ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.zipCode ? '2px' : '1px'
                    }}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Phone size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.email ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.email ? '2px' : '1px'
                    }}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                  <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                    Services
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addService}
                  className="px-3 py-1 text-sm text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider 
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <select
                        value={service.day}
                        onChange={(e) => updateService(index, 'day', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      >
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={service.time}
                        onChange={(e) => updateService(index, 'time', e.target.value)}
                        placeholder="Time (e.g., 10:00 AM)"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Service description"
                      className="w-full mt-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: themeConfig.colors.secondary,
                        borderColor: themeConfig.colors.divider,
                        color: themeConfig.colors.text
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            {/* Status */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Status
              </h3>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'Active' | 'Inactive')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Facilities */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Facilities
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Add a facility"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded border"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider 
                      }}
                    >
                      <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {facility}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFacility(facility)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Globe size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Social Media
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
          <button
            type="button"
            onClick={() => navigate('/churches')}
            className="px-6 py-2 border rounded-lg font-medium hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <Save size={20} className="mr-2" />
            {isEditing ? 'Update Church' : 'Create Church'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChurchForm