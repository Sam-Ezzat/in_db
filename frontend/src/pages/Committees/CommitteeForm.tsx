import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Save, Users, User, Calendar, Target, Plus, X } from 'lucide-react'

interface CommitteeFormData {
  name: string
  description: string
  chair: string
  chairId: string
  chairEmail: string
  chairPhone: string
  church: string
  churchId: number
  status: 'Active' | 'Inactive'
  meetingSchedule: string
  meetingLocation: string
  purpose: string
  authority: string
  formed: string
}

interface CommitteeMember {
  name: string
  email: string
  role: string
  expertise: string
}

const CommitteeForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditing = Boolean(id)

  // Mock data for editing - replace with API call
  const initialData: CommitteeFormData = isEditing ? {
    name: 'Finance Committee',
    description: 'Oversees church financial planning, budgeting, and fiscal responsibility to ensure good stewardship of resources.',
    chair: 'Robert Anderson',
    chairId: '5',
    chairEmail: 'robert.anderson@gracechurch.org',
    chairPhone: '+1 (555) 123-4571',
    church: 'Grace Community Church',
    churchId: 1,
    status: 'Active',
    meetingSchedule: 'First Monday of each month, 7:00 PM',
    meetingLocation: 'Conference Room B',
    purpose: 'To provide oversight and guidance for all financial matters of the church, ensuring transparency, accountability, and biblical stewardship principles.',
    authority: 'Budget approval up to $50,000, financial policy recommendations, audit oversight',
    formed: '2020-01'
  } : {
    name: '',
    description: '',
    chair: '',
    chairId: '',
    chairEmail: '',
    chairPhone: '',
    church: '',
    churchId: 0,
    status: 'Active',
    meetingSchedule: '',
    meetingLocation: '',
    purpose: '',
    authority: '',
    formed: ''
  }

  const [formData, setFormData] = useState<CommitteeFormData>(initialData)
  const [members, setMembers] = useState<CommitteeMember[]>(isEditing ? [
    { 
      name: 'Margaret Chen', 
      email: 'margaret.chen@gracechurch.org', 
      role: 'Secretary',
      expertise: 'Accounting, Financial Reporting'
    },
    { 
      name: 'David Thompson', 
      email: 'david.thompson@gracechurch.org', 
      role: 'Treasurer Liaison',
      expertise: 'Investment Management'
    }
  ] : [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock data
  const churches = [
    { id: 1, name: 'Grace Community Church' },
    { id: 2, name: 'First Methodist Church' },
    { id: 3, name: 'St. Mary\'s Catholic Church' },
    { id: 4, name: 'New Life Assembly' }
  ]

  const availableChairs = [
    { id: '1', name: 'John Smith', email: 'john@church.org', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@church.org', phone: '+1 (555) 123-4568' },
    { id: '3', name: 'Michael Brown', email: 'michael@church.org', phone: '+1 (555) 123-4569' },
    { id: '4', name: 'Emily Davis', email: 'emily@church.org', phone: '+1 (555) 123-4570' },
    { id: '5', name: 'Robert Anderson', email: 'robert.anderson@gracechurch.org', phone: '+1 (555) 123-4571' }
  ]

  const committeeTypes = [
    'Finance Committee',
    'Board of Directors',
    'Personnel Committee',
    'Building & Grounds Committee',
    'Worship Committee',
    'Outreach Committee',
    'Education Committee',
    'Stewardship Committee',
    'Nominating Committee',
    'Policy Committee'
  ]

  const memberRoles = [
    'Secretary',
    'Vice Chair',
    'Treasurer Liaison',
    'Member',
    'Subject Matter Expert',
    'Representative',
    'Advisor'
  ]

  const handleInputChange = (field: keyof CommitteeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleChairChange = (chairId: string) => {
    const chair = availableChairs.find(c => c.id === chairId)
    if (chair) {
      setFormData(prev => ({
        ...prev,
        chairId,
        chair: chair.name,
        chairEmail: chair.email,
        chairPhone: chair.phone
      }))
    }
  }

  const addMember = () => {
    setMembers(prev => [...prev, { name: '', email: '', role: '', expertise: '' }])
  }

  const updateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    setMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ))
  }

  const removeMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Committee name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.chairId) newErrors.chair = 'Committee chair is required'
    if (!formData.churchId) newErrors.church = 'Church is required'
    if (!formData.meetingSchedule.trim()) newErrors.meetingSchedule = 'Meeting schedule is required'
    if (!formData.meetingLocation.trim()) newErrors.meetingLocation = 'Meeting location is required'
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose statement is required'
    if (!formData.formed.trim()) newErrors.formed = 'Formation date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would make API call to save the committee
      console.log('Saving committee:', formData, 'Members:', members)
      navigate('/committees')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/committees')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Committees
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {isEditing ? 'Edit Committee' : 'Create New Committee'}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {isEditing ? 'Update committee information and settings' : 'Set up a new committee or board'}
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
                <Users size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Committee Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Committee Name *
                  </label>
                  <input
                    list="committee-types"
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
                    placeholder="Enter committee name"
                  />
                  <datalist id="committee-types">
                    {committeeTypes.map(type => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

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
                      <option key={church.id} value={church.id}>{church.name}</option>
                    ))}
                  </select>
                  {errors.church && (
                    <p className="text-red-500 text-xs mt-1">{errors.church}</p>
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

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Formation Date *
                  </label>
                  <input
                    type="month"
                    value={formData.formed}
                    onChange={(e) => handleInputChange('formed', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.formed ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.formed ? '2px' : '1px'
                    }}
                  />
                  {errors.formed && (
                    <p className="text-red-500 text-xs mt-1">{errors.formed}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.description ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.description ? '2px' : '1px'
                    }}
                    placeholder="Describe the committee's purpose and activities"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Purpose Statement *
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.purpose ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.purpose ? '2px' : '1px'
                    }}
                    placeholder="What is the committee's mission and purpose?"
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Authority & Decision-Making Power
                  </label>
                  <textarea
                    value={formData.authority}
                    onChange={(e) => handleInputChange('authority', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="What authority does this committee have? What decisions can they make?"
                  />
                </div>
              </div>
            </div>

            {/* Leadership */}
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
                  Committee Leadership
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Committee Chair *
                  </label>
                  <select
                    value={formData.chairId}
                    onChange={(e) => handleChairChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.chair ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.chair ? '2px' : '1px'
                    }}
                  >
                    <option value="">Select committee chair</option>
                    {availableChairs.map(chair => (
                      <option key={chair.id} value={chair.id}>{chair.name}</option>
                    ))}
                  </select>
                  {errors.chair && (
                    <p className="text-red-500 text-xs mt-1">{errors.chair}</p>
                  )}
                </div>

                {formData.chairId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                        Chair Email
                      </label>
                      <input
                        type="email"
                        value={formData.chairEmail}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        style={{ 
                          backgroundColor: themeConfig.colors.background + '50',
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text,
                          opacity: 0.7
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                        Chair Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.chairPhone}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        style={{ 
                          backgroundColor: themeConfig.colors.background + '50',
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text,
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Meeting Details */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Calendar size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Meeting Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Meeting Schedule *
                  </label>
                  <input
                    type="text"
                    value={formData.meetingSchedule}
                    onChange={(e) => handleInputChange('meetingSchedule', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.meetingSchedule ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.meetingSchedule ? '2px' : '1px'
                    }}
                    placeholder="e.g., First Monday of each month, 7:00 PM"
                  />
                  {errors.meetingSchedule && (
                    <p className="text-red-500 text-xs mt-1">{errors.meetingSchedule}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Meeting Location *
                  </label>
                  <input
                    type="text"
                    value={formData.meetingLocation}
                    onChange={(e) => handleInputChange('meetingLocation', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.meetingLocation ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.meetingLocation ? '2px' : '1px'
                    }}
                    placeholder="e.g., Conference Room B"
                  />
                  {errors.meetingLocation && (
                    <p className="text-red-500 text-xs mt-1">{errors.meetingLocation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Committee Members */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                  <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                    Committee Members
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center px-3 py-1 text-sm text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  <Plus size={16} className="mr-1" />
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider 
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                        Member {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        placeholder="Member name"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        placeholder="Email address"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <select
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">Select role</option>
                        {memberRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={member.expertise}
                        onChange={(e) => updateMember(index, 'expertise', e.target.value)}
                        placeholder="Area of expertise"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Committee Guidelines */}
          <div className="space-y-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Target size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Committee Guidelines
                </h3>
              </div>

              <div className="space-y-4 text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                <div>
                  <h4 className="font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Recommended Committee Practices:
                  </h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Hold regular meetings as scheduled</li>
                    <li>Maintain accurate meeting minutes</li>
                    <li>Establish clear voting procedures</li>
                    <li>Document all decisions and actions</li>
                    <li>Report to the board or congregation as required</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Member Responsibilities:
                  </h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Attend meetings regularly</li>
                    <li>Participate actively in discussions</li>
                    <li>Complete assigned tasks on time</li>
                    <li>Maintain confidentiality when required</li>
                    <li>Act in the best interest of the church</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
          <button
            type="button"
            onClick={() => navigate('/committees')}
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
            {isEditing ? 'Update Committee' : 'Create Committee'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommitteeForm