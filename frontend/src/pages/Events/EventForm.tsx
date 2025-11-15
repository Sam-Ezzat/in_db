import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { 
  CalendarIcon, ClockIcon, MapPinIcon,
  PlusIcon, MinusIcon, ArrowLeftIcon,
  InformationCircleIcon,
  BellIcon, UsersIcon,
  TagIcon, CheckIcon
} from '@heroicons/react/24/outline'
import { 
  eventService, 
  type Event, 
  type EventRecurrence,
  type CustomRegistrationField
} from '../../services/eventService'

interface EventFormData {
  title: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  allDay: boolean
  location: string
  category: 'service' | 'meeting' | 'social' | 'outreach' | 'youth' | 'conference' | 'workshop' | 'other'
  organizer: string
  organizerId: string
  maxAttendees: string
  registrationRequired: boolean
  registrationDeadline: string
  registrationFee: string
  isRecurring: boolean
  recurrence: EventRecurrence | null
  location_details: {
    address: string
    room: string
    capacity: string
    equipment: string[]
  }
  tags: string[]
  visibility: 'public' | 'members_only' | 'private'
  notifications: {
    email: boolean
    sms: boolean
    reminder_hours: number[]
  }
}

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditing = !!id

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    location: '',
    category: 'other',
    organizer: '',
    organizerId: '',
    maxAttendees: '',
    registrationRequired: false,
    registrationDeadline: '',
    registrationFee: '',
    isRecurring: false,
    recurrence: null,
    location_details: {
      address: '',
      room: '',
      capacity: '',
      equipment: []
    },
    tags: [],
    visibility: 'public',
    notifications: {
      email: true,
      sms: false,
      reminder_hours: [24, 2]
    }
  })

  const [errors, setErrors] = useState<Partial<EventFormData>>({})
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newEquipment, setNewEquipment] = useState('')
  const [customFields, setCustomFields] = useState<CustomRegistrationField[]>([])
  const [activeSection, setActiveSection] = useState<'basic' | 'schedule' | 'registration' | 'location' | 'recurrence' | 'notifications' | 'custom-fields'>('basic')

  useEffect(() => {
    if (isEditing) {
      loadEventData()
    }
  }, [id, isEditing])

  const loadEventData = async () => {
    if (!id) return

    try {
      setLoading(true)
      const event = await eventService.getEventById(id)
      if (event) {
        setFormData({
          title: event.title,
          description: event.description,
          startDate: event.startDate.toISOString().split('T')[0],
          startTime: event.startDate.toISOString().split('T')[1].slice(0, 5),
          endDate: event.endDate ? event.endDate.toISOString().split('T')[0] : '',
          endTime: event.endDate ? event.endDate.toISOString().split('T')[1].slice(0, 5) : '',
          allDay: event.allDay,
          location: event.location,
          category: event.category,
          organizer: event.organizer,
          organizerId: event.organizerId,
          maxAttendees: event.maxAttendees?.toString() || '',
          registrationRequired: event.registrationRequired,
          registrationDeadline: event.registrationDeadline ? event.registrationDeadline.toISOString().split('T')[0] : '',
          registrationFee: event.registrationFee?.toString() || '',
          isRecurring: event.isRecurring,
          recurrence: event.recurrence || null,
          location_details: {
            address: event.location_details?.address || '',
            room: event.location_details?.room || '',
            capacity: event.location_details?.capacity?.toString() || '',
            equipment: event.location_details?.equipment || []
          },
          tags: event.tags,
          visibility: event.visibility,
          notifications: event.notifications
        })
        if (event.customRegistrationFields) {
          setCustomFields(event.customRegistrationFields)
        }
      }
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.allDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required when not all-day'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required'
    }

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date'
    }

    if (formData.registrationRequired && formData.registrationDeadline) {
      const deadlineDate = new Date(formData.registrationDeadline)
      const startDate = new Date(formData.startDate)
      if (deadlineDate > startDate) {
        newErrors.registrationDeadline = 'Registration deadline must be before event start date'
      }
    }

    if (formData.maxAttendees && parseInt(formData.maxAttendees) <= 0) {
      newErrors.maxAttendees = 'Max attendees must be greater than 0'
    }

    if (formData.registrationFee && parseFloat(formData.registrationFee) < 0) {
      newErrors.registrationFee = 'Registration fee cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Prepare event data
      const startDateTime = formData.allDay 
        ? new Date(formData.startDate)
        : new Date(`${formData.startDate}T${formData.startTime}`)

      const endDateTime = formData.endDate
        ? formData.allDay
          ? new Date(formData.endDate)
          : new Date(`${formData.endDate}T${formData.endTime || formData.startTime}`)
        : undefined

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: startDateTime,
        endDate: endDateTime,
        allDay: formData.allDay,
        location: formData.location.trim(),
        category: formData.category,
        organizer: formData.organizer.trim(),
        organizerId: formData.organizerId || 'current-user-id', // Should get from auth context
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        registrationRequired: formData.registrationRequired,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline) : undefined,
        registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : undefined,
        isRecurring: formData.isRecurring,
        recurrence: formData.isRecurring && formData.recurrence ? formData.recurrence : undefined,
        location_details: {
          address: formData.location_details.address.trim() || undefined,
          room: formData.location_details.room.trim() || undefined,
          capacity: formData.location_details.capacity ? parseInt(formData.location_details.capacity) : undefined,
          equipment: formData.location_details.equipment.length > 0 ? formData.location_details.equipment : undefined
        },
        tags: formData.tags,
        visibility: formData.visibility,
        notifications: formData.notifications,
        customRegistrationFields: customFields.length > 0 ? customFields : undefined,
        status: 'upcoming' as const,
        createdBy: 'current-user-id' // Should get from auth context
      }

      let savedEvent: Event
      if (isEditing) {
        const updated = await eventService.updateEvent(id!, eventData)
        if (!updated) throw new Error('Failed to update event')
        savedEvent = updated
      } else {
        savedEvent = await eventService.createEvent(eventData)
      }

      navigate(`/events/${savedEvent.id}`)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !formData.location_details.equipment.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        location_details: {
          ...prev.location_details,
          equipment: [...prev.location_details.equipment, newEquipment.trim()]
        }
      }))
      setNewEquipment('')
    }
  }

  const handleRemoveEquipment = (equipmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      location_details: {
        ...prev.location_details,
        equipment: prev.location_details.equipment.filter(eq => eq !== equipmentToRemove)
      }
    }))
  }

  const handleRecurrenceChange = (field: keyof EventRecurrence, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence!,
        [field]: value
      }
    }))
  }

  const toggleReminderHour = (hour: number) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        reminder_hours: prev.notifications.reminder_hours.includes(hour)
          ? prev.notifications.reminder_hours.filter(h => h !== hour)
          : [...prev.notifications.reminder_hours, hour].sort((a, b) => b - a)
      }
    }))
  }

  const handleAddCustomField = () => {
    const newField: CustomRegistrationField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      order: customFields.length + 1
    }
    setCustomFields([...customFields, newField])
  }

  const handleUpdateCustomField = (fieldId: string, updates: Partial<CustomRegistrationField>) => {
    setCustomFields(customFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }

  const handleRemoveCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter(field => field.id !== fieldId))
  }

  const moveCustomField = (fieldId: string, direction: 'up' | 'down') => {
    const index = customFields.findIndex(f => f.id === fieldId)
    if (index === -1) return
    
    const newFields = [...customFields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newFields.length) return
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
    
    // Update order numbers
    newFields.forEach((field, idx) => {
      field.order = idx + 1
    })
    
    setCustomFields(newFields)
  }

  const sections = [
    { key: 'basic', label: 'Basic Information', icon: InformationCircleIcon },
    { key: 'schedule', label: 'Schedule & Duration', icon: CalendarIcon },
    { key: 'registration', label: 'Registration', icon: UsersIcon },
    { key: 'custom-fields', label: 'Custom Fields', icon: TagIcon },
    { key: 'location', label: 'Location Details', icon: MapPinIcon },
    { key: 'recurrence', label: 'Recurrence', icon: ClockIcon },
    { key: 'notifications', label: 'Notifications', icon: BellIcon }
  ]

  const categories = [
    { value: 'service', label: 'Service' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'social', label: 'Social' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'youth', label: 'Youth' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ]

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to everyone' },
    { value: 'members_only', label: 'Members Only', description: 'Visible to church members only' },
    { value: 'private', label: 'Private', description: 'Visible to organizers only' }
  ]

  const reminderOptions = [
    { value: 1, label: '1 hour before' },
    { value: 2, label: '2 hours before' },
    { value: 4, label: '4 hours before' },
    { value: 24, label: '1 day before' },
    { value: 48, label: '2 days before' },
    { value: 168, label: '1 week before' }
  ]

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: themeConfig.colors.primary }}></div>
      </div>
    )
  }

  return (
    <RequirePermission resource="events" action={isEditing ? "update" : "create"}>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
              </button>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
                  {isEditing ? 'Edit Event' : 'Create New Event'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Update event details and settings' : 'Fill in the details to create a new event'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActiveSection(section.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                      activeSection === section.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Basic Information */}
          {activeSection === 'basic' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter organizer name"
                  />
                  {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    {visibilityOptions.map(option => (
                      <label key={option.value} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule & Duration */}
          {activeSection === 'schedule' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Schedule & Duration</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">All-day event</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  {!formData.allDay && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>

                  {!formData.allDay && formData.endDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Registration */}
          {activeSection === 'registration' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Registration Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.registrationRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationRequired: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Require registration</label>
                </div>

                {formData.registrationRequired && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Attendees (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter maximum number of attendees"
                      />
                      {errors.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Deadline (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Fee (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.registrationFee}
                          onChange={(e) => setFormData(prev => ({ ...prev, registrationFee: e.target.value }))}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.registrationFee && <p className="text-red-500 text-sm mt-1">{errors.registrationFee}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Registration Fields */}
          {activeSection === 'custom-fields' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Custom Registration Fields</h3>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Field
                </button>
              </div>

              {customFields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No custom fields added yet. Click "Add Field" to create custom registration questions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Label
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleUpdateCustomField(field.id, { label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter field label"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateCustomField(field.id, { type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Text Area</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="date">Date</option>
                            <option value="select">Dropdown</option>
                            <option value="radio">Radio Buttons</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>

                        {(field.type === 'text' || field.type === 'textarea') && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Placeholder Text
                            </label>
                            <input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={(e) => handleUpdateCustomField(field.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter placeholder text"
                            />
                          </div>
                        )}

                        {(field.type === 'select' || field.type === 'radio') && (
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Options (comma separated)
                            </label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => handleUpdateCustomField(field.id, { 
                                options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                        )}

                        <div className="md:col-span-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleUpdateCustomField(field.id, { required: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Required</span>
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => moveCustomField(field.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Move up"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCustomField(field.id, 'down')}
                              disabled={index === customFields.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Move down"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomField(field.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Remove field"
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Details */}
          {activeSection === 'location' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Location Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location name"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room/Space
                  </label>
                  <input
                    type="text"
                    value={formData.location_details.room}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location_details: { ...prev.location_details, room: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter specific room or area"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.location_details.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location_details: { ...prev.location_details, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.location_details.capacity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location_details: { ...prev.location_details, capacity: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Maximum capacity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Equipment
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipment())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add equipment"
                    />
                    <button
                      type="button"
                      onClick={handleAddEquipment}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.location_details.equipment.map((equipment, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {equipment}
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipment(equipment)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recurrence */}
          {activeSection === 'recurrence' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recurrence Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        isRecurring: e.target.checked,
                        recurrence: e.target.checked ? {
                          pattern: 'weekly',
                          interval: 1
                        } : null
                      }))
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Make this a recurring event</label>
                </div>

                {formData.isRecurring && formData.recurrence && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat Pattern
                      </label>
                      <select
                        value={formData.recurrence.pattern}
                        onChange={(e) => handleRecurrenceChange('pattern', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat Every
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={formData.recurrence.interval}
                          onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          {formData.recurrence.pattern}(s)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.recurrence.endDate ? formData.recurrence.endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleRecurrenceChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Occurrences (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.recurrence.occurrences || ''}
                        onChange={(e) => handleRecurrenceChange('occurrences', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Send email notifications</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.notifications.sms}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Send SMS notifications</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Reminder Schedule
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {reminderOptions.map(option => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.notifications.reminder_hours.includes(option.value)}
                          onChange={() => toggleReminderHour(option.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </RequirePermission>
  )
}

export default EventForm