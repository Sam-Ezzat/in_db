import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { 
  ArrowLeftIcon, CalendarIcon, MapPinIcon, ClockIcon,
  UserIcon, UsersIcon, TagIcon, EnvelopeIcon, PhoneIcon,
  GlobeAltIcon, ExclamationTriangleIcon, CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { groupService, type Group, type GroupCurriculum } from '../../services/groupService'

interface GroupFormData {
  name: string
  description: string
  category: 'bible-study' | 'discipleship' | 'youth' | 'seniors' | 'small-group' | 'ministry' | 'fellowship' | 'prayer' | 'service'
  type: 'open' | 'closed' | 'by-invitation'
  leaderId: string
  leaderName: string
  maxMembers: number
  ageMin: string
  ageMax: string
  gender: 'mixed' | 'men' | 'women'
  dayOfWeek: number
  time: string
  duration: number
  location: string
  status: 'active' | 'inactive' | 'paused' | 'completed' | 'planning'
  startDate: string
  endDate: string
  curriculumId: string
  meetingFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'irregular'
  childcareAvailable: boolean
  cost: number
  registrationOpen: boolean
  requirements: string
  tags: string
  email: string
  phone: string
  website: string
  facebook: string
  instagram: string
  twitter: string
}

const GroupForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEdit = !!id

  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    category: 'bible-study',
    type: 'open',
    leaderId: '',
    leaderName: '',
    maxMembers: 15,
    ageMin: '',
    ageMax: '',
    gender: 'mixed',
    dayOfWeek: 0,
    time: '19:00',
    duration: 90,
    location: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    curriculumId: '',
    meetingFrequency: 'weekly',
    childcareAvailable: false,
    cost: 0,
    registrationOpen: false,
    requirements: '',
    tags: '',
    email: '',
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: ''
  })

  const [curricula, setCurricula] = useState<GroupCurriculum[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCurricula()
    if (isEdit) {
      loadGroup()
    }
  }, [id])

  const loadCurricula = async () => {
    try {
      const curriculaData = await groupService.getCurricula()
      setCurricula(curriculaData)
    } catch (error) {
      console.error('Error loading curricula:', error)
    }
  }

  const loadGroup = async () => {
    if (!id) return

    try {
      setLoading(true)
      const group = await groupService.getGroupById(id)
      if (group) {
        setFormData({
          name: group.name,
          description: group.description,
          category: group.category,
          type: group.type,
          leaderId: group.leaderId,
          leaderName: group.leaderName,
          maxMembers: group.maxMembers,
          ageMin: group.ageRange.min?.toString() || '',
          ageMax: group.ageRange.max?.toString() || '',
          gender: group.gender,
          dayOfWeek: group.schedule.dayOfWeek,
          time: group.schedule.time,
          duration: group.schedule.duration,
          location: group.location,
          status: group.status,
          startDate: group.startDate.toISOString().split('T')[0],
          endDate: group.endDate?.toISOString().split('T')[0] || '',
          curriculumId: group.curriculumId || '',
          meetingFrequency: group.meetingFrequency,
          childcareAvailable: group.childcareAvailable,
          cost: group.cost,
          registrationOpen: group.registrationOpen,
          requirements: group.requirements?.join('\n') || '',
          tags: group.tags.join(', '),
          email: group.contactInfo.email || '',
          phone: group.contactInfo.phone || '',
          website: group.contactInfo.website || '',
          facebook: group.socialMedia.facebook || '',
          instagram: group.socialMedia.instagram || '',
          twitter: group.socialMedia.twitter || ''
        })
      }
    } catch (error) {
      console.error('Error loading group:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.leaderName.trim()) {
      newErrors.leaderName = 'Leader name is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.maxMembers < 1) {
      newErrors.maxMembers = 'Maximum members must be at least 1'
    }

    if (formData.duration < 30) {
      newErrors.duration = 'Duration must be at least 30 minutes'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (formData.ageMin && formData.ageMax) {
      const minAge = parseInt(formData.ageMin)
      const maxAge = parseInt(formData.ageMax)
      if (minAge >= maxAge) {
        newErrors.ageMax = 'Maximum age must be greater than minimum age'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const groupData = {
        churchId: '1', // Mock church ID
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        leaderId: formData.leaderId || 'current-user',
        leaderName: formData.leaderName,
        coLeaders: [],
        members: [],
        maxMembers: formData.maxMembers,
        ageRange: {
          min: formData.ageMin ? parseInt(formData.ageMin) : undefined,
          max: formData.ageMax ? parseInt(formData.ageMax) : undefined
        },
        gender: formData.gender,
        schedule: {
          id: `schedule_${Date.now()}`,
          groupId: '',
          dayOfWeek: formData.dayOfWeek,
          time: formData.time,
          duration: formData.duration,
          location: formData.location,
          recurring: true
        },
        location: formData.location,
        status: formData.status,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        curriculumId: formData.curriculumId || undefined,
        curriculum: formData.curriculumId ? curricula.find(c => c.id === formData.curriculumId) : undefined,
        progress: {
          currentSession: 0,
          totalSessions: formData.curriculumId ? curricula.find(c => c.id === formData.curriculumId)?.sessions.length || 0 : 0,
          completionRate: 0
        },
        meetingFrequency: formData.meetingFrequency,
        childcareAvailable: formData.childcareAvailable,
        cost: formData.cost,
        registrationOpen: formData.registrationOpen,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        contactInfo: {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          website: formData.website || undefined
        },
        socialMedia: {
          facebook: formData.facebook || undefined,
          instagram: formData.instagram || undefined,
          twitter: formData.twitter || undefined
        },
        resources: [],
        createdBy: 'current-user'
      }

      if (isEdit && id) {
        await groupService.updateGroup(id, groupData as any)
      } else {
        await groupService.createGroup(groupData as any)
      }

      navigate('/groups')
    } catch (error) {
      console.error('Error saving group:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof GroupFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const categories = [
    { value: 'bible-study', label: 'Bible Study' },
    { value: 'discipleship', label: 'Discipleship' },
    { value: 'youth', label: 'Youth' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'small-group', label: 'Small Group' },
    { value: 'ministry', label: 'Ministry' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'prayer', label: 'Prayer' },
    { value: 'service', label: 'Service' }
  ]

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/groups')}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Group' : 'Create New Group'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update group information and settings' : 'Set up a new discipleship or ministry group'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter group name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the group's purpose and focus"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="open">Open (Anyone can join)</option>
                <option value="closed">Closed (Members only)</option>
                <option value="by-invitation">By Invitation Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Members
              </label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 0)}
                min="1"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.maxMembers ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.maxMembers && (
                <p className="mt-1 text-sm text-red-600">{errors.maxMembers}</p>
              )}
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leadership</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Leader *
              </label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={(e) => handleInputChange('leaderName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.leaderName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter leader name"
              />
              {errors.leaderName && (
                <p className="mt-1 text-sm text-red-600">{errors.leaderName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Day
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => handleInputChange('dayOfWeek', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                min="30"
                max="300"
                step="15"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter meeting location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Frequency
              </label>
              <select
                value={formData.meetingFrequency}
                onChange={(e) => handleInputChange('meetingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Age
              </label>
              <input
                type="number"
                value={formData.ageMin}
                onChange={(e) => handleInputChange('ageMin', e.target.value)}
                min="0"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="No minimum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Age
              </label>
              <input
                type="number"
                value={formData.ageMax}
                onChange={(e) => handleInputChange('ageMax', e.target.value)}
                min="0"
                max="120"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ageMax ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="No maximum"
              />
              {errors.ageMax && (
                <p className="mt-1 text-sm text-red-600">{errors.ageMax}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mixed">Mixed</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Study Curriculum (Optional)
            </label>
            <select
              value={formData.curriculumId}
              onChange={(e) => handleInputChange('curriculumId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No specific curriculum</option>
              {curricula.map((curriculum) => (
                <option key={curriculum.id} value={curriculum.id}>
                  {curriculum.name} ({curriculum.duration} weeks)
                </option>
              ))}
            </select>
            {formData.curriculumId && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                {(() => {
                  const curriculum = curricula.find(c => c.id === formData.curriculumId)
                  return curriculum ? (
                    <div>
                      <p className="text-sm text-blue-800 font-medium">{curriculum.description}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {curriculum.sessions.length} sessions • {curriculum.difficulty} level
                      </p>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Additional Settings */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (if applicable)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="childcare"
                    checked={formData.childcareAvailable}
                    onChange={(e) => handleInputChange('childcareAvailable', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="childcare" className="ml-2 text-sm text-gray-700">
                    Childcare available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="registration"
                    checked={formData.registrationOpen}
                    onChange={(e) => handleInputChange('registrationOpen', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="registration" className="ml-2 text-sm text-gray-700">
                    Registration currently open
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List any requirements for joining this group&#10;e.g., Commitment to attend weekly&#10;Completed new member class"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., new-members, foundation, discipleship"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`${themeConfig.cardBackground} rounded-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="group@church.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://church.com/groups/group-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="facebook.com/groupname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@groupname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@groupname"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <RequirePermission resource="groups" action={isEdit ? "update" : "create"}>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{isEdit ? 'Update Group' : 'Create Group'}</span>
                </>
              )}
            </button>
          </RequirePermission>
        </div>
      </form>
    </div>
  )
}

export default GroupForm