import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Save, User, Phone, Users, Award } from 'lucide-react'

interface PersonFormData {
  name: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  role: string
  status: 'Active' | 'Inactive'
  church: string
  churchId: number
  bio: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  baptismDate: string
  membershipLevel: 'Member' | 'Leader' | 'Pastor' | 'Visitor'
  skills: string[]
  interests: string[]
}

const PersonForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditing = Boolean(id)

  // Mock data for editing - replace with API call
  const initialData: PersonFormData = isEditing ? {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    dateOfBirth: '1985-06-15',
    role: 'Pastor',
    status: 'Active',
    church: 'Grace Community Church',
    churchId: 1,
    bio: 'John has been serving our community for over 4 years. He is passionate about discipleship and youth ministry.',
    emergencyContactName: 'Mary Smith',
    emergencyContactPhone: '+1 (555) 123-4568',
    emergencyContactRelationship: 'Spouse',
    baptismDate: '2019-12-25',
    membershipLevel: 'Pastor',
    skills: ['Leadership', 'Teaching', 'Counseling', 'Youth Ministry'],
    interests: ['Reading', 'Music', 'Sports', 'Community Service']
  } : {
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    role: '',
    status: 'Active',
    church: '',
    churchId: 0,
    bio: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    baptismDate: '',
    membershipLevel: 'Member',
    skills: [],
    interests: []
  }

  const [formData, setFormData] = useState<PersonFormData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  // Mock churches data
  const churches = [
    { id: 1, name: 'Grace Community Church', denomination: 'Baptist', location: 'Springfield, IL' },
    { id: 2, name: 'First Methodist Church', denomination: 'Methodist', location: 'Springfield, IL' },
    { id: 3, name: 'St. Mary\'s Catholic Church', denomination: 'Catholic', location: 'Springfield, IL' },
    { id: 4, name: 'New Life Assembly', denomination: 'Pentecostal', location: 'Springfield, IL' }
  ]

  const handleInputChange = (field: keyof PersonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, newSkill.trim()] 
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(skill => skill !== skillToRemove) 
    }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        interests: [...prev.interests, newInterest.trim()] 
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      interests: prev.interests.filter(interest => interest !== interestToRemove) 
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.role.trim()) newErrors.role = 'Role is required'
    if (!formData.church.trim()) newErrors.church = 'Church is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would make API call to save the person
      console.log('Saving person:', formData)
      navigate('/people')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/people')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to People
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {isEditing ? 'Edit Person' : 'Add New Person'}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {isEditing ? 'Update person information' : 'Create a new person profile'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
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
                <User size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Full Name *
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
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
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
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.role ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.role ? '2px' : '1px'
                    }}
                  >
                    <option value="">Select role</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Associate Pastor">Associate Pastor</option>
                    <option value="Elder">Elder</option>
                    <option value="Deacon">Deacon</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Committee Lead">Committee Lead</option>
                    <option value="Member">Member</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Status
                  </label>
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
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter full address"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Tell us about this person..."
                />
              </div>
            </div>

            {/* Church Information */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Users size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Church Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Church *
                  </label>
                  <select
                    value={formData.churchId}
                    onChange={(e) => {
                      const churchId = parseInt(e.target.value)
                      const church = churches.find(c => c.id === churchId)
                      handleInputChange('churchId', churchId)
                      handleInputChange('church', church?.name || '')
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.church ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.church ? '2px' : '1px'
                    }}
                  >
                    <option value={0}>Select church</option>
                    {churches.map(church => (
                      <option key={church.id} value={church.id}>
                        {church.name} - {church.denomination}
                      </option>
                    ))}
                  </select>
                  {errors.church && (
                    <p className="text-red-500 text-xs mt-1">{errors.church}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Membership Level
                  </label>
                  <select
                    value={formData.membershipLevel}
                    onChange={(e) => handleInputChange('membershipLevel', e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option value="Visitor">Visitor</option>
                    <option value="Member">Member</option>
                    <option value="Leader">Leader</option>
                    <option value="Pastor">Pastor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Baptism Date
                  </label>
                  <input
                    type="date"
                    value={formData.baptismDate}
                    onChange={(e) => handleInputChange('baptismDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
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
                  Emergency Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Enter contact phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Relationship
                  </label>
                  <select
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Award size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Skills
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full group cursor-pointer"
                      style={{ 
                        backgroundColor: themeConfig.colors.primary + '20',
                        color: themeConfig.colors.primary
                      }}
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <span className="ml-1 group-hover:text-red-500">×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Award size={20} className="mr-2" style={{ color: themeConfig.colors.accent }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Interests
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Add an interest"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90"
                    style={{ backgroundColor: themeConfig.colors.accent }}
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full group cursor-pointer"
                      style={{ 
                        backgroundColor: themeConfig.colors.accent + '20',
                        color: themeConfig.colors.accent
                      }}
                      onClick={() => removeInterest(interest)}
                    >
                      {interest}
                      <span className="ml-1 group-hover:text-red-500">×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
          <button
            type="button"
            onClick={() => navigate('/people')}
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
            {isEditing ? 'Update Person' : 'Create Person'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm