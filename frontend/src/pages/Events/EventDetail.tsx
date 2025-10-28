import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { 
  CalendarIcon, ClockIcon, MapPinIcon, UserIcon, UsersIcon,
  PencilIcon, TrashIcon, ArrowLeftIcon, ShareIcon,
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
  DocumentDuplicateIcon, BellIcon, CurrencyDollarIcon,
  ChartBarIcon, QrCodeIcon, PrinterIcon, EnvelopeIcon,
  PhoneIcon, UserPlusIcon, ClipboardDocumentListIcon,
  TagIcon, EyeIcon, CogIcon, UserGroupIcon
} from '@heroicons/react/24/outline'
import { 
  eventService, 
  type Event, 
  type EventRegistration, 
  type EventAttendance 
} from '../../services/eventService'

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [attendance, setAttendance] = useState<EventAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'attendance' | 'analytics'>('overview')

  useEffect(() => {
    loadEventData()
  }, [id])

  const loadEventData = async () => {
    if (!id) return

    try {
      setLoading(true)
      const [eventData, registrationsData, attendanceData] = await Promise.all([
        eventService.getEventById(id),
        eventService.getEventRegistrations(id),
        eventService.getEventAttendance(id)
      ])

      setEvent(eventData)
      setRegistrations(registrationsData)
      setAttendance(attendanceData)
    } catch (error) {
      console.error('Error loading event data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!event) return

    if (confirm(`Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`)) {
      try {
        await eventService.deleteEvent(event.id)
        navigate('/events')
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
      }
    }
  }

  const handleDuplicateEvent = async () => {
    if (!event) return

    try {
      const duplicatedEvent = await eventService.duplicateEvent(event.id)
      if (duplicatedEvent) {
        navigate(`/events/${duplicatedEvent.id}/edit`)
      }
    } catch (error) {
      console.error('Error duplicating event:', error)
      alert('Failed to duplicate event. Please try again.')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      service: 'bg-blue-100 text-blue-800',
      meeting: 'bg-purple-100 text-purple-800',
      social: 'bg-green-100 text-green-800',
      outreach: 'bg-orange-100 text-orange-800',
      youth: 'bg-pink-100 text-pink-800',
      conference: 'bg-indigo-100 text-indigo-800',
      workshop: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  const getRegistrationStatusColor = (status: string) => {
    const colors = {
      registered: 'bg-green-100 text-green-800',
      waitlist: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      attended: 'bg-blue-100 text-blue-800',
      no_show: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.registered
  }

  const getAttendanceStatusColor = (status: string) => {
    const colors = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as keyof typeof colors] || colors.present
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDuration = (startDate: Date, endDate?: Date) => {
    if (!endDate) return ''
    
    const diffMs = endDate.getTime() - startDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`
    }
    return `${diffMinutes}m`
  }

  const calculateAttendanceRate = () => {
    if (registrations.length === 0) return 0
    const attendedCount = attendance.filter(a => a.status === 'present').length
    return (attendedCount / registrations.length) * 100
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: EyeIcon },
    { key: 'registrations', label: 'Registrations', icon: UserGroupIcon },
    { key: 'attendance', label: 'Attendance', icon: ClipboardDocumentListIcon },
    { key: 'analytics', label: 'Analytics', icon: ChartBarIcon }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: themeConfig.colors.primary }}></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
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
                {event.title}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                {event.isRecurring && (
                  <span className="px-2 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    Recurring
                  </span>
                )}
                {event.registrationRequired && (
                  <span className="px-2 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                    Registration Required
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <RequirePermission resource="events" action="update">
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: themeConfig.colors.primary }}
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
            </RequirePermission>

            <button
              onClick={handleDuplicateEvent}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ focusRingColor: themeConfig.colors.primary }}
            >
              <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
              Duplicate
            </button>

            <button
              onClick={() => alert('Share functionality coming soon!')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ focusRingColor: themeConfig.colors.primary }}
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </button>

            <RequirePermission resource="events" action="delete">
              <button
                onClick={handleDeleteEvent}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </RequirePermission>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: themeConfig.colors.divider }}>
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Registered</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'registered').length}
                {event.maxAttendees && `/${event.maxAttendees}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: themeConfig.colors.divider }}>
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Attended</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendance.filter(a => a.status === 'present').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: themeConfig.colors.divider }}>
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{calculateAttendanceRate().toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: themeConfig.colors.divider }}>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Waitlist</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'waitlist').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date & Time</p>
                    <p className="text-sm text-gray-600">{formatDateTime(event.startDate)}</p>
                    {event.endDate && (
                      <p className="text-sm text-gray-500">
                        Duration: {formatDuration(event.startDate, event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    {event.location_details?.address && (
                      <p className="text-sm text-gray-500">{event.location_details.address}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organizer</p>
                    <p className="text-sm text-gray-600">{event.organizer}</p>
                  </div>
                </div>

                {event.registrationFee && (
                  <div className="flex items-start space-x-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Registration Fee</p>
                      <p className="text-sm text-gray-600">${event.registrationFee}</p>
                    </div>
                  </div>
                )}

                {event.registrationDeadline && (
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Registration Deadline</p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(event.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {event.description && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              )}

              {event.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Recurrence Information */}
              {event.isRecurring && event.recurrence && (
                <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurrence</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Pattern:</span> {event.recurrence.pattern}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Interval:</span> Every {event.recurrence.interval} {event.recurrence.pattern}(s)
                    </p>
                    {event.recurrence.endDate && (
                      <p className="text-sm">
                        <span className="font-medium">End Date:</span> {formatDateTime(event.recurrence.endDate)}
                      </p>
                    )}
                    {event.recurrence.occurrences && (
                      <p className="text-sm">
                        <span className="font-medium">Occurrences:</span> {event.recurrence.occurrences}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Location Details */}
              {event.location_details && (
                <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                  <div className="space-y-2">
                    {event.location_details.room && (
                      <p className="text-sm">
                        <span className="font-medium">Room:</span> {event.location_details.room}
                      </p>
                    )}
                    {event.location_details.capacity && (
                      <p className="text-sm">
                        <span className="font-medium">Capacity:</span> {event.location_details.capacity} people
                      </p>
                    )}
                    {event.location_details.equipment && event.location_details.equipment.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Available Equipment:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.location_details.equipment.map((item, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Email notifications: {event.notifications.email ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">SMS notifications: {event.notifications.sms ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  {event.notifications.reminder_hours.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <BellIcon className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <span className="text-sm font-medium">Reminders:</span>
                        <div className="text-sm text-gray-600">
                          {event.notifications.reminder_hours.map(hours => 
                            hours >= 24 ? `${hours / 24} day${hours / 24 > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`
                          ).join(', ')} before event
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Event Registrations</h3>
              <RequirePermission resource="events" action="update">
                <button
                  onClick={() => alert('Add registration functionality coming soon!')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Registration
                </button>
              </RequirePermission>
            </div>

            <div className="bg-white rounded-lg border" style={{ borderColor: themeConfig.colors.divider }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registration.personName}
                            </div>
                            {registration.notes && (
                              <div className="text-sm text-gray-500">{registration.notes}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{registration.personEmail}</div>
                          {registration.personPhone && (
                            <div className="text-sm text-gray-500">{registration.personPhone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registration.registrationDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRegistrationStatusColor(registration.status)}`}>
                            {registration.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {registration.paymentStatus ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              registration.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              registration.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {registration.paymentStatus}
                              {registration.paymentAmount && ` ($${registration.paymentAmount})`}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => alert('Edit registration functionality coming soon!')}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => alert('Cancel registration functionality coming soon!')}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {registrations.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No one has registered for this event yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Event Attendance</h3>
              <div className="flex items-center space-x-2">
                <RequirePermission resource="events" action="update">
                  <button
                    onClick={() => alert('Mark attendance functionality coming soon!')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </button>
                </RequirePermission>
                <button
                  onClick={() => alert('Print attendance functionality coming soon!')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border" style={{ borderColor: themeConfig.colors.divider }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.personName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.checkInTime ? record.checkInTime.toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.checkOutTime ? record.checkOutTime.toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => alert('Edit attendance functionality coming soon!')}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {attendance.length === 0 && (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Attendance has not been recorded for this event yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Event Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Registration Analytics */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Registration Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Registered:</span>
                    <span className="text-sm font-medium">{registrations.filter(r => r.status === 'registered').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Waitlist:</span>
                    <span className="text-sm font-medium">{registrations.filter(r => r.status === 'waitlist').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cancelled:</span>
                    <span className="text-sm font-medium">{registrations.filter(r => r.status === 'cancelled').length}</span>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacity Used:</span>
                      <span className="text-sm font-medium">
                        {((registrations.filter(r => r.status === 'registered').length / event.maxAttendees) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Analytics */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Attendance Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Present:</span>
                    <span className="text-sm font-medium">{attendance.filter(a => a.status === 'present').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Absent:</span>
                    <span className="text-sm font-medium">{attendance.filter(a => a.status === 'absent').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Late:</span>
                    <span className="text-sm font-medium">{attendance.filter(a => a.status === 'late').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Attendance Rate:</span>
                    <span className="text-sm font-medium">{calculateAttendanceRate().toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              {event.registrationFee && (
                <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Financial Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Registration Fee:</span>
                      <span className="text-sm font-medium">${event.registrationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Collected:</span>
                      <span className="text-sm font-medium">
                        ${(registrations.filter(r => r.paymentStatus === 'paid').length * event.registrationFee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending Payments:</span>
                      <span className="text-sm font-medium">
                        {registrations.filter(r => r.paymentStatus === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Timeline */}
            <div className="bg-white rounded-lg p-6 border" style={{ borderColor: themeConfig.colors.divider }}>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Registration Timeline</h4>
              <p className="text-sm text-gray-500">Registration timeline visualization coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail