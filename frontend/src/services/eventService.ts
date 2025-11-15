import { BaseService } from './base/BaseService'

// ================================
// INTERFACES
// ================================

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate?: Date
  allDay: boolean
  location: string
  category: 'service' | 'meeting' | 'social' | 'outreach' | 'youth' | 'conference' | 'workshop' | 'other'
  organizer: string
  organizerId: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  maxAttendees?: number
  currentAttendees: number
  registrationRequired: boolean
  registrationDeadline?: Date
  registrationFee?: number
  isRecurring: boolean
  recurrence?: EventRecurrence
  location_details?: {
    address?: string
    room?: string
    capacity?: number
    equipment?: string[]
  }
  tags: string[]
  visibility: 'public' | 'members_only' | 'private'
  notifications: {
    email: boolean
    sms: boolean
    reminder_hours: number[]
  }
  customRegistrationFields?: CustomRegistrationField[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CustomRegistrationField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: string[] // For select, radio
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  order: number
}

export interface EventRecurrence {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // Every X days/weeks/months/years
  daysOfWeek?: number[] // For weekly: 0=Sunday, 1=Monday, etc.
  dayOfMonth?: number // For monthly
  endDate?: Date
  occurrences?: number
}

export interface EventRegistration {
  id: string
  eventId: string
  personId: string
  personName: string
  personEmail: string
  personPhone?: string
  registrationDate: Date
  status: 'registered' | 'waitlist' | 'cancelled' | 'attended' | 'no_show'
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'waived'
  paymentAmount?: number
  notes?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  dietary_restrictions?: string[]
  special_needs?: string
  customFieldValues?: { [fieldId: string]: any }
}

export interface EventAttendance {
  id: string
  eventId: string
  personId: string
  personName: string
  checkInTime?: Date
  checkOutTime?: Date
  status: 'present' | 'absent' | 'late'
  notes?: string
  recordedBy: string
  recordedAt: Date
}

export interface EventSummary {
  total_events: number
  upcoming_events: number
  completed_events: number
  cancelled_events: number
  total_registrations: number
  total_attendees: number
  average_attendance_rate: number
  popular_categories: { category: string; count: number }[]
  monthly_stats: {
    month: string
    events: number
    attendees: number
    attendance_rate: number
  }[]
}

export interface EventFilters {
  startDate?: Date
  endDate?: Date
  category?: string
  status?: string
  organizer?: string
  location?: string
  tags?: string[]
  visibility?: string
  registrationRequired?: boolean
  hasAvailableSpots?: boolean
}

export interface RegistrationFilters {
  eventId?: string
  status?: string
  paymentStatus?: string
  registrationDateFrom?: Date
  registrationDateTo?: Date
}

// ================================
// SERVICE CLASS
// ================================

export class EventService extends BaseService {
  private events: Event[] = []
  private registrations: EventRegistration[] = []
  private attendance: EventAttendance[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  // ================================
  // EVENT CRUD OPERATIONS
  // ================================

  async getEvents(filters?: EventFilters): Promise<Event[]> {
    let filteredEvents = [...this.events]

    if (filters) {
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          event.startDate >= filters.startDate!
        )
      }

      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          event.startDate <= filters.endDate!
        )
      }

      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category === filters.category
        )
      }

      if (filters.status) {
        filteredEvents = filteredEvents.filter(event => 
          event.status === filters.status
        )
      }

      if (filters.organizer) {
        filteredEvents = filteredEvents.filter(event => 
          event.organizer.toLowerCase().includes(filters.organizer!.toLowerCase())
        )
      }

      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filters.tags!.some(tag => event.tags.includes(tag))
        )
      }

      if (filters.visibility) {
        filteredEvents = filteredEvents.filter(event => 
          event.visibility === filters.visibility
        )
      }

      if (filters.registrationRequired !== undefined) {
        filteredEvents = filteredEvents.filter(event => 
          event.registrationRequired === filters.registrationRequired
        )
      }

      if (filters.hasAvailableSpots) {
        filteredEvents = filteredEvents.filter(event => 
          !event.maxAttendees || event.currentAttendees < event.maxAttendees
        )
      }
    }

    return filteredEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.events.find(event => event.id === id) || null
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<Event> {
    const newEvent: Event = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentAttendees: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.events.push(newEvent)

    // If recurring, generate future occurrences
    if (newEvent.isRecurring && newEvent.recurrence) {
      await this.generateRecurringEvents(newEvent)
    }

    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const eventIndex = this.events.findIndex(event => event.id === id)
    if (eventIndex === -1) return null

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date()
    }

    return this.events[eventIndex]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const eventIndex = this.events.findIndex(event => event.id === id)
    if (eventIndex === -1) return false

    // Remove associated registrations and attendance
    this.registrations = this.registrations.filter(reg => reg.eventId !== id)
    this.attendance = this.attendance.filter(att => att.eventId !== id)
    this.events.splice(eventIndex, 1)

    return true
  }

  async duplicateEvent(id: string): Promise<Event | null> {
    const originalEvent = await this.getEventById(id)
    if (!originalEvent) return null

    const duplicatedEvent = await this.createEvent({
      ...originalEvent,
      title: `${originalEvent.title} (Copy)`,
      startDate: new Date(originalEvent.startDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Add 1 week
      endDate: originalEvent.endDate ? new Date(originalEvent.endDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
      isRecurring: false, // Don't duplicate recurrence
      recurrence: undefined,
      status: 'upcoming',
      createdBy: originalEvent.createdBy
    })

    return duplicatedEvent
  }

  // ================================
  // REGISTRATION MANAGEMENT
  // ================================

  async getEventRegistrations(eventId: string, filters?: RegistrationFilters): Promise<EventRegistration[]> {
    let registrations = this.registrations.filter(reg => reg.eventId === eventId)

    if (filters) {
      if (filters.status) {
        registrations = registrations.filter(reg => reg.status === filters.status)
      }

      if (filters.paymentStatus) {
        registrations = registrations.filter(reg => reg.paymentStatus === filters.paymentStatus)
      }

      if (filters.registrationDateFrom) {
        registrations = registrations.filter(reg => 
          reg.registrationDate >= filters.registrationDateFrom!
        )
      }

      if (filters.registrationDateTo) {
        registrations = registrations.filter(reg => 
          reg.registrationDate <= filters.registrationDateTo!
        )
      }
    }

    return registrations.sort((a, b) => a.registrationDate.getTime() - b.registrationDate.getTime())
  }

  async registerForEvent(
    eventId: string, 
    registrationData: Omit<EventRegistration, 'id' | 'registrationDate'>
  ): Promise<EventRegistration | { error: string }> {
    const event = await this.getEventById(eventId)
    if (!event) {
      return { error: 'Event not found' }
    }

    // Check if registration is still open
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return { error: 'Registration deadline has passed' }
    }

    // Check if person is already registered
    const existingRegistration = this.registrations.find(
      reg => reg.eventId === eventId && reg.personId === registrationData.personId
    )
    if (existingRegistration) {
      return { error: 'Person is already registered for this event' }
    }

    // Check capacity
    const currentRegistrations = this.registrations.filter(
      reg => reg.eventId === eventId && reg.status === 'registered'
    ).length

    let status: EventRegistration['status'] = 'registered'
    if (event.maxAttendees && currentRegistrations >= event.maxAttendees) {
      status = 'waitlist'
    }

    const newRegistration: EventRegistration = {
      ...registrationData,
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: new Date(),
      status
    }

    this.registrations.push(newRegistration)

    // Update event attendee count
    if (status === 'registered') {
      await this.updateEvent(eventId, {
        currentAttendees: event.currentAttendees + 1
      })
    }

    return newRegistration
  }

  async updateRegistration(
    registrationId: string, 
    updates: Partial<EventRegistration>
  ): Promise<EventRegistration | null> {
    const regIndex = this.registrations.findIndex(reg => reg.id === registrationId)
    if (regIndex === -1) return null

    const oldRegistration = this.registrations[regIndex]
    this.registrations[regIndex] = {
      ...oldRegistration,
      ...updates
    }

    // Update event attendee count if status changed
    if (updates.status && updates.status !== oldRegistration.status) {
      const event = await this.getEventById(oldRegistration.eventId)
      if (event) {
        let attendeeChange = 0
        if (oldRegistration.status === 'registered' && updates.status !== 'registered') {
          attendeeChange = -1
        } else if (oldRegistration.status !== 'registered' && updates.status === 'registered') {
          attendeeChange = 1
        }

        if (attendeeChange !== 0) {
          await this.updateEvent(event.id, {
            currentAttendees: Math.max(0, event.currentAttendees + attendeeChange)
          })
        }
      }
    }

    return this.registrations[regIndex]
  }

  async cancelRegistration(registrationId: string): Promise<boolean> {
    return await this.updateRegistration(registrationId, { status: 'cancelled' }) !== null
  }

  // ================================
  // ATTENDANCE MANAGEMENT
  // ================================

  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    return this.attendance.filter(att => att.eventId === eventId)
      .sort((a, b) => a.personName.localeCompare(b.personName))
  }

  async recordAttendance(attendanceData: Omit<EventAttendance, 'id' | 'recordedAt'>): Promise<EventAttendance> {
    const newAttendance: EventAttendance = {
      ...attendanceData,
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recordedAt: new Date()
    }

    this.attendance.push(newAttendance)
    return newAttendance
  }

  async updateAttendance(
    attendanceId: string, 
    updates: Partial<EventAttendance>
  ): Promise<EventAttendance | null> {
    const attIndex = this.attendance.findIndex(att => att.id === attendanceId)
    if (attIndex === -1) return null

    this.attendance[attIndex] = {
      ...this.attendance[attIndex],
      ...updates,
      recordedAt: new Date()
    }

    return this.attendance[attIndex]
  }

  async bulkRecordAttendance(
    eventId: string, 
    attendanceRecords: Omit<EventAttendance, 'id' | 'eventId' | 'recordedAt'>[]
  ): Promise<EventAttendance[]> {
    const records = attendanceRecords.map(record => ({
      ...record,
      eventId,
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recordedAt: new Date()
    }))

    this.attendance.push(...records)
    return records
  }

  // ================================
  // RECURRING EVENTS
  // ================================

  async generateRecurringEvents(baseEvent: Event): Promise<Event[]> {
    if (!baseEvent.recurrence) return []

    const generatedEvents: Event[] = []
    const { pattern, interval, daysOfWeek, dayOfMonth, endDate, occurrences } = baseEvent.recurrence

    let currentDate = new Date(baseEvent.startDate)
    let count = 0
    const maxOccurrences = occurrences || 52 // Default to 1 year

    while (count < maxOccurrences && (!endDate || currentDate <= endDate)) {
      // Calculate next occurrence
      switch (pattern) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval)
          break
        case 'weekly':
          if (daysOfWeek && daysOfWeek.length > 0) {
            // Find next occurrence in the week
            let nextDay = currentDate.getDay()
            let found = false
            
            for (let i = 1; i <= 7; i++) {
              nextDay = (nextDay + 1) % 7
              if (daysOfWeek.includes(nextDay)) {
                currentDate.setDate(currentDate.getDate() + i)
                found = true
                break
              }
            }
            
            if (!found) {
              currentDate.setDate(currentDate.getDate() + 7 * interval)
            }
          } else {
            currentDate.setDate(currentDate.getDate() + 7 * interval)
          }
          break
        case 'monthly':
          if (dayOfMonth) {
            currentDate.setMonth(currentDate.getMonth() + interval)
            currentDate.setDate(dayOfMonth)
          } else {
            currentDate.setMonth(currentDate.getMonth() + interval)
          }
          break
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval)
          break
      }

      if (endDate && currentDate > endDate) break

      // Create new event
      const newEvent: Event = {
        ...baseEvent,
        id: `event_${Date.now()}_${count}_${Math.random().toString(36).substr(2, 9)}`,
        startDate: new Date(currentDate),
        endDate: baseEvent.endDate ? new Date(currentDate.getTime() + (baseEvent.endDate.getTime() - baseEvent.startDate.getTime())) : undefined,
        currentAttendees: 0,
        isRecurring: false, // Individual occurrences are not recurring
        recurrence: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.events.push(newEvent)
      generatedEvents.push(newEvent)
      count++
    }

    return generatedEvents
  }

  // ================================
  // ANALYTICS & REPORTING
  // ================================

  async getEventSummary(filters?: EventFilters): Promise<EventSummary> {
    const events = await this.getEvents(filters)
    const registrations = this.registrations
    const attendance = this.attendance

    const total_events = events.length
    const upcoming_events = events.filter(e => e.status === 'upcoming').length
    const completed_events = events.filter(e => e.status === 'completed').length
    const cancelled_events = events.filter(e => e.status === 'cancelled').length

    const total_registrations = registrations.filter(r => r.status === 'registered').length
    const total_attendees = attendance.filter(a => a.status === 'present').length

    const completedEventsWithAttendance = events.filter(e => e.status === 'completed')
    const average_attendance_rate = completedEventsWithAttendance.length > 0
      ? completedEventsWithAttendance.reduce((sum, event) => {
          const eventAttendance = attendance.filter(a => a.eventId === event.id && a.status === 'present').length
          const eventRegistrations = registrations.filter(r => r.eventId === event.id && r.status === 'registered').length
          return sum + (eventRegistrations > 0 ? (eventAttendance / eventRegistrations) * 100 : 0)
        }, 0) / completedEventsWithAttendance.length
      : 0

    // Popular categories
    const categoryCount: { [key: string]: number } = {}
    events.forEach(event => {
      categoryCount[event.category] = (categoryCount[event.category] || 0) + 1
    })
    const popular_categories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Monthly stats (last 12 months)
    const monthly_stats = this.generateMonthlyStats(events, attendance, registrations)

    return {
      total_events,
      upcoming_events,
      completed_events,
      cancelled_events,
      total_registrations,
      total_attendees,
      average_attendance_rate,
      popular_categories,
      monthly_stats
    }
  }

  private generateMonthlyStats(events: Event[], attendance: EventAttendance[], registrations: EventRegistration[]) {
    const months: { [key: string]: { events: number; attendees: number; registrations: number } } = {}
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months[monthKey] = { events: 0, attendees: 0, registrations: 0 }
    }

    // Count events
    events.forEach(event => {
      const monthKey = `${event.startDate.getFullYear()}-${String(event.startDate.getMonth() + 1).padStart(2, '0')}`
      if (months[monthKey]) {
        months[monthKey].events++
      }
    })

    // Count attendance
    attendance.forEach(att => {
      if (att.status === 'present') {
        const event = events.find(e => e.id === att.eventId)
        if (event) {
          const monthKey = `${event.startDate.getFullYear()}-${String(event.startDate.getMonth() + 1).padStart(2, '0')}`
          if (months[monthKey]) {
            months[monthKey].attendees++
          }
        }
      }
    })

    // Count registrations
    registrations.forEach(reg => {
      if (reg.status === 'registered') {
        const monthKey = `${reg.registrationDate.getFullYear()}-${String(reg.registrationDate.getMonth() + 1).padStart(2, '0')}`
        if (months[monthKey]) {
          months[monthKey].registrations++
        }
      }
    })

    return Object.entries(months).map(([month, stats]) => ({
      month,
      events: stats.events,
      attendees: stats.attendees,
      attendance_rate: stats.registrations > 0 ? (stats.attendees / stats.registrations) * 100 : 0
    }))
  }

  // ================================
  // MOCK DATA INITIALIZATION
  // ================================

  private initializeMockData() {
    // Sample events
    this.events = [
      {
        id: 'event_1',
        title: 'Sunday Morning Service',
        description: 'Weekly worship service with communion and fellowship',
        startDate: new Date('2024-01-14T10:00:00'),
        endDate: new Date('2024-01-14T11:30:00'),
        allDay: false,
        location: 'Main Sanctuary',
        category: 'service',
        organizer: 'Pastor John Smith',
        organizerId: 'user_1',
        status: 'upcoming',
        maxAttendees: 300,
        currentAttendees: 245,
        registrationRequired: false,
        isRecurring: true,
        recurrence: {
          pattern: 'weekly',
          interval: 1,
          daysOfWeek: [0] // Sunday
        },
        location_details: {
          address: '123 Church St, City, State',
          room: 'Main Sanctuary',
          capacity: 300,
          equipment: ['Sound System', 'Projector', 'Piano']
        },
        tags: ['worship', 'communion', 'weekly'],
        visibility: 'public',
        notifications: {
          email: true,
          sms: false,
          reminder_hours: [24, 2]
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'user_1'
      },
      {
        id: 'event_2',
        title: 'Youth Bible Study',
        description: 'Interactive Bible study for young adults (18-35)',
        startDate: new Date('2025-11-25T19:00:00'),
        endDate: new Date('2025-11-25T20:30:00'),
        allDay: false,
        location: 'Youth Center',
        category: 'youth',
        organizer: 'Sarah Johnson',
        organizerId: 'user_2',
        status: 'upcoming',
        maxAttendees: 50,
        currentAttendees: 32,
        registrationRequired: true,
        registrationDeadline: new Date('2025-11-24T12:00:00'),
        registrationFee: 10,
        isRecurring: true,
        recurrence: {
          pattern: 'weekly',
          interval: 1,
          daysOfWeek: [1] // Monday
        },
        location_details: {
          room: 'Youth Center',
          capacity: 50,
          equipment: ['Whiteboard', 'Chairs', 'Coffee Station']
        },
        tags: ['youth', 'bible-study', 'weekly'],
        visibility: 'public',
        notifications: {
          email: true,
          sms: true,
          reminder_hours: [24, 4]
        },
        customRegistrationFields: [
          {
            id: 'field_1',
            label: 'T-Shirt Size',
            type: 'select',
            required: true,
            options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            order: 1
          },
          {
            id: 'field_2',
            label: 'Previous Bible Study Experience',
            type: 'radio',
            required: true,
            options: ['Beginner', 'Intermediate', 'Advanced'],
            order: 2
          },
          {
            id: 'field_3',
            label: 'Topics of Interest',
            type: 'textarea',
            required: false,
            placeholder: 'What topics would you like to study?',
            order: 3
          },
          {
            id: 'field_4',
            label: 'Can you help with setup?',
            type: 'checkbox',
            required: false,
            order: 4
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'user_2'
      },
      {
        id: 'event_3',
        title: 'Community Outreach - Food Drive',
        description: 'Monthly food distribution to local families in need',
        startDate: new Date('2024-01-16T14:00:00'),
        endDate: new Date('2024-01-16T17:00:00'),
        allDay: false,
        location: 'Community Center',
        category: 'outreach',
        organizer: 'Mary Wilson',
        organizerId: 'user_3',
        status: 'upcoming',
        maxAttendees: 25,
        currentAttendees: 18,
        registrationRequired: true,
        registrationDeadline: new Date('2024-01-15T23:59:00'),
        isRecurring: true,
        recurrence: {
          pattern: 'monthly',
          interval: 1,
          dayOfMonth: 16
        },
        location_details: {
          address: '456 Community Ave, City, State',
          capacity: 25
        },
        tags: ['outreach', 'food-drive', 'community', 'monthly'],
        visibility: 'public',
        notifications: {
          email: true,
          sms: false,
          reminder_hours: [48, 24]
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'user_3'
      }
    ]

    // Sample registrations
    this.registrations = [
      {
        id: 'reg_1',
        eventId: 'event_2',
        personId: 'person_1',
        personName: 'John Doe',
        personEmail: 'john.doe@email.com',
        personPhone: '+1234567890',
        registrationDate: new Date('2024-01-10'),
        status: 'registered',
        notes: 'First time attending'
      },
      {
        id: 'reg_2',
        eventId: 'event_3',
        personId: 'person_2',
        personName: 'Jane Smith',
        personEmail: 'jane.smith@email.com',
        registrationDate: new Date('2024-01-12'),
        status: 'registered',
        dietary_restrictions: ['vegetarian']
      }
    ]

    // Sample attendance
    this.attendance = [
      {
        id: 'att_1',
        eventId: 'event_1',
        personId: 'person_1',
        personName: 'John Doe',
        checkInTime: new Date('2024-01-07T09:55:00'),
        status: 'present',
        recordedBy: 'user_1',
        recordedAt: new Date('2024-01-07T09:55:00')
      }
    ]
  }
}

// Export singleton instance
export const eventService = new EventService()
