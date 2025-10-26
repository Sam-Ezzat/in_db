import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  CalendarIcon, ClockIcon, MapPinIcon, UserIcon, 
  PlusIcon, MagnifyingGlassIcon,
  EllipsisVerticalIcon, PencilIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: 'service' | 'meeting' | 'social' | 'outreach' | 'youth' | 'other'
  attendees: number
  maxAttendees?: number
  organizer: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isRecurring: boolean
  rsvpRequired: boolean
}

const Events: React.FC = () => {
  const { themeConfig } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      title: 'Sunday Morning Service',
      description: 'Weekly worship service with communion',
      date: '2024-01-14',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      category: 'service',
      attendees: 245,
      maxAttendees: 300,
      organizer: 'Pastor John Smith',
      status: 'upcoming',
      isRecurring: true,
      rsvpRequired: false
    },
    {
      id: '2',
      title: 'Youth Bible Study',
      description: 'Weekly Bible study for young adults',
      date: '2024-01-15',
      time: '7:00 PM',
      location: 'Youth Center',
      category: 'youth',
      attendees: 32,
      maxAttendees: 50,
      organizer: 'Sarah Johnson',
      status: 'upcoming',
      isRecurring: true,
      rsvpRequired: true
    },
    {
      id: '3',
      title: 'Community Outreach',
      description: 'Food distribution to local families',
      date: '2024-01-16',
      time: '2:00 PM',
      location: 'Community Center',
      category: 'outreach',
      attendees: 18,
      maxAttendees: 25,
      organizer: 'Mary Wilson',
      status: 'upcoming',
      isRecurring: false,
      rsvpRequired: true
    }
  ]

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'service', label: 'Services' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'social', label: 'Social' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'youth', label: 'Youth' },
    { value: 'other', label: 'Other' }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      service: { bg: '#3B82F6', text: '#FFFFFF' },
      meeting: { bg: '#8B5CF6', text: '#FFFFFF' },
      social: { bg: '#10B981', text: '#FFFFFF' },
      outreach: { bg: '#F59E0B', text: '#FFFFFF' },
      youth: { bg: '#EC4899', text: '#FFFFFF' },
      other: { bg: '#6B7280', text: '#FFFFFF' }
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: { bg: '#3B82F6', text: '#FFFFFF' },
      ongoing: { bg: '#10B981', text: '#FFFFFF' },
      completed: { bg: '#6B7280', text: '#FFFFFF' },
      cancelled: { bg: '#EF4444', text: '#FFFFFF' }
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  const getRecurringBadgeStyle = () => {
    return {
      backgroundColor: themeConfig.colors.accent + '20',
      color: themeConfig.colors.text,
      border: `1px solid ${themeConfig.colors.divider}`
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              Events Management
            </h1>
            <p 
              className="mt-2"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Manage church events, services, and activities
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              backgroundColor: themeConfig.colors.primary,
              boxShadow: `0 0 0 3px ${themeConfig.colors.primary}20`
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: themeConfig.colors.primary + '20' }}
            >
              <CalendarIcon 
                className="h-6 w-6" 
                style={{ color: themeConfig.colors.primary }} 
              />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                This Month
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                24
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500 bg-opacity-10">
              <UsersIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Total Attendees
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                1,245
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10">
              <ClockIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Upcoming
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                8
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-500 bg-opacity-10">
              <CalendarIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Recurring
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                12
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div 
        className="rounded-lg border"
        style={{
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider
        }}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon 
                  className="h-5 w-5" 
                  style={{ color: themeConfig.colors.text, opacity: 0.5 }} 
                />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-1 sm:text-sm"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-1 sm:text-sm rounded-md"
              style={{
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: themeConfig.colors.text }}
                      >
                        {event.title}
                      </h3>
                      <span 
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(event.category).bg,
                          color: getCategoryColor(event.category).text
                        }}
                      >
                        {event.category}
                      </span>
                      {event.isRecurring && (
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={getRecurringBadgeStyle()}
                        >
                          Recurring
                        </span>
                      )}
                    </div>
                    <p 
                      className="text-sm mb-2"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                        <span style={{ color: themeConfig.colors.text }}>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                        <span style={{ color: themeConfig.colors.text }}>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                        <span style={{ color: themeConfig.colors.text }}>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                        <span style={{ color: themeConfig.colors.text }}>
                          {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} attendees
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: getStatusColor(event.status).bg,
                        color: getStatusColor(event.status).text
                      }}
                    >
                      {event.status}
                    </span>
                    <button
                      className="p-2 hover:opacity-70"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                      title="Edit Event"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 hover:opacity-70"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                      title="More Options"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events