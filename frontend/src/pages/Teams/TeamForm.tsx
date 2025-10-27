import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Save, Users, User, Clock, Target, Plus } from 'lucide-react'

interface TeamFormData {
  name: string
  description: string
  leader: string
  leaderId: string
  leaderEmail: string
  leaderPhone: string
  church: string
  churchId: number
  status: 'Active' | 'Inactive'
  meetingSchedule: string
  meetingLocation: string
  purpose: string
  goals: string[]
  responsibilities: string[]
}

interface TeamMember {
  name: string
  email: string
  role: string
}

const TeamForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditing = Boolean(id)

  // Mock data for editing - replace with API call
  const initialData: TeamFormData = isEditing ? {
    name: 'Youth Ministry Team',
    description: 'Engaging and discipling young people ages 13-25 through dynamic programs, events, and mentorship opportunities.',
    leader: 'Sarah Johnson',
    leaderId: '2',
    leaderEmail: 'sarah.johnson@gracechurch.org',
    leaderPhone: '+1 (555) 123-4568',
    church: 'Grace Community Church',
    churchId: 1,
    status: 'Active',
    meetingSchedule: 'Fridays 7:00 PM',
    meetingLocation: 'Youth Room, Main Building',
    purpose: 'To create a welcoming community where young people can grow in their faith, develop meaningful relationships, and discover their God-given purpose.',
    goals: ['Increase youth engagement by 30% this year', 'Launch 3 new discipleship groups'],
    responsibilities: ['Plan and execute weekly youth gatherings', 'Coordinate youth camps and retreats']
  } : {
    name: '',
    description: '',
    leader: '',
    leaderId: '',
    leaderEmail: '',
    leaderPhone: '',
    church: '',
    churchId: 0,
    status: 'Active',
    meetingSchedule: '',
    meetingLocation: '',
    purpose: '',
    goals: [],
    responsibilities: []
  }

  const [formData, setFormData] = useState<TeamFormData>(initialData)
  const [members, setMembers] = useState<TeamMember[]>(isEditing ? [
    { name: 'Mike Wilson', email: 'mike@church.org', role: 'Assistant Leader' },
    { name: 'Jessica Chen', email: 'jessica@church.org', role: 'Small Group Leader' }
  ] : [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newGoal, setNewGoal] = useState('')
  const [newResponsibility, setNewResponsibility] = useState('')

  // Mock data
  const churches = [
    { id: 1, name: 'Grace Community Church' },
    { id: 2, name: 'First Methodist Church' },
    { id: 3, name: 'St. Mary\'s Catholic Church' },
    { id: 4, name: 'New Life Assembly' }
  ]

  const availableLeaders = [
    { id: '1', name: 'John Smith', email: 'john@church.org', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@church.org', phone: '+1 (555) 123-4568' },
    { id: '3', name: 'Michael Brown', email: 'michael@church.org', phone: '+1 (555) 123-4569' },
    { id: '4', name: 'Emily Davis', email: 'emily@church.org', phone: '+1 (555) 123-4570' }
  ]

  const handleInputChange = (field: keyof TeamFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleLeaderChange = (leaderId: string) => {
    const leader = availableLeaders.find(l => l.id === leaderId)
    if (leader) {
      setFormData(prev => ({
        ...prev,
        leaderId,
        leader: leader.name,
        leaderEmail: leader.email,
        leaderPhone: leader.phone
      }))
    }
  }

  const addGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        goals: [...prev.goals, newGoal.trim()] 
      }))
      setNewGoal('')
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      goals: prev.goals.filter(goal => goal !== goalToRemove) 
    }))
  }

  const addResponsibility = () => {
    if (newResponsibility.trim() && !formData.responsibilities.includes(newResponsibility.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        responsibilities: [...prev.responsibilities, newResponsibility.trim()] 
      }))
      setNewResponsibility('')
    }
  }

  const removeResponsibility = (responsibilityToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      responsibilities: prev.responsibilities.filter(resp => resp !== responsibilityToRemove) 
    }))
  }

  const addMember = () => {
    setMembers(prev => [...prev, { name: '', email: '', role: '' }])
  }

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ))
  }

  const removeMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Team name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.leaderId) newErrors.leader = 'Team leader is required'
    if (!formData.churchId) newErrors.church = 'Church is required'
    if (!formData.meetingSchedule.trim()) newErrors.meetingSchedule = 'Meeting schedule is required'
    if (!formData.meetingLocation.trim()) newErrors.meetingLocation = 'Meeting location is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would make API call to save the team
      console.log('Saving team:', formData, 'Members:', members)
      navigate('/teams')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/teams')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Teams
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {isEditing ? 'Edit Team' : 'Create New Team'}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {isEditing ? 'Update team information and settings' : 'Set up a new ministry team'}
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
                  Team Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Team Name *
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
                    placeholder="Enter team name"
                  />
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
                    placeholder="Describe the team's purpose and activities"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Purpose Statement
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="What is the team's mission and purpose?"
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
                  Team Leadership
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                    Team Leader *
                  </label>
                  <select
                    value={formData.leaderId}
                    onChange={(e) => handleLeaderChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: errors.leader ? '#EF4444' : themeConfig.colors.divider,
                      color: themeConfig.colors.text,
                      borderWidth: errors.leader ? '2px' : '1px'
                    }}
                  >
                    <option value="">Select team leader</option>
                    {availableLeaders.map(leader => (
                      <option key={leader.id} value={leader.id}>{leader.name}</option>
                    ))}
                  </select>
                  {errors.leader && (
                    <p className="text-red-500 text-xs mt-1">{errors.leader}</p>
                  )}
                </div>

                {formData.leaderId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                        Leader Email
                      </label>
                      <input
                        type="email"
                        value={formData.leaderEmail}
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
                        Leader Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.leaderPhone}
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

            {/* Schedule & Location */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Clock size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
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
                    placeholder="e.g., Fridays 7:00 PM"
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
                    placeholder="e.g., Youth Room, Main Building"
                  />
                  {errors.meetingLocation && (
                    <p className="text-red-500 text-xs mt-1">{errors.meetingLocation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
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
                    Team Members
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        placeholder="Role/Position"
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.secondary,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goals & Responsibilities */}
          <div className="space-y-6">
            {/* Goals */}
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
                  Team Goals
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Add a team goal"
                  />
                  <button
                    type="button"
                    onClick={addGoal}
                    className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded border"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider 
                      }}
                    >
                      <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {goal}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGoal(goal)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <Target size={20} className="mr-2" style={{ color: themeConfig.colors.accent }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Key Responsibilities
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Add a responsibility"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90"
                    style={{ backgroundColor: themeConfig.colors.accent }}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded border"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider 
                      }}
                    >
                      <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {responsibility}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(responsibility)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
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
            onClick={() => navigate('/teams')}
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
            {isEditing ? 'Update Team' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TeamForm