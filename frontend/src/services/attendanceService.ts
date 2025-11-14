import { BaseService } from './base/BaseService'

export interface Attendance {
  id: string
  tenantId?: string
  eventId: string
  personId: string
  status: 'present' | 'absent' | 'excused' | 'late'
  checkInTime?: Date
  checkOutTime?: Date
  notes?: string
  markedBy?: string
  // Populated fields
  event?: {
    id: string
    name: string
    date: Date
    type: string
  }
  person?: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface AttendanceFilters {
  eventId?: string
  personId?: string
  status?: 'present' | 'absent' | 'excused' | 'late'
  dateFrom?: Date
  dateTo?: Date
  tenantId?: string
  search?: string
}

export interface AttendanceStatistics {
  totalRecords: number
  present: number
  absent: number
  excused: number
  late: number
  attendanceRate: number
  byEvent: {
    eventId: string
    eventName: string
    total: number
    present: number
    rate: number
  }[]
  byPerson: {
    personId: string
    personName: string
    total: number
    present: number
    rate: number
  }[]
}

export interface BulkAttendanceUpdate {
  eventId: string
  personIds: string[]
  status: 'present' | 'absent' | 'excused' | 'late'
  checkInTime?: Date
  notes?: string
}

class AttendanceService extends BaseService {
  private attendances: Attendance[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  async getAttendances(filters?: AttendanceFilters): Promise<Attendance[]> {
    let results = [...this.attendances]

    if (filters) {
      if (filters.eventId) {
        results = results.filter(a => a.eventId === filters.eventId)
      }
      if (filters.personId) {
        results = results.filter(a => a.personId === filters.personId)
      }
      if (filters.status) {
        results = results.filter(a => a.status === filters.status)
      }
      if (filters.dateFrom && filters.dateTo) {
        results = results.filter(a => {
          if (!a.event?.date) return false
          const eventDate = new Date(a.event.date)
          return eventDate >= filters.dateFrom! && eventDate <= filters.dateTo!
        })
      }
      if (filters.tenantId) {
        results = results.filter(a => a.tenantId === filters.tenantId)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        results = results.filter(a => 
          a.person?.firstName.toLowerCase().includes(searchLower) ||
          a.person?.lastName?.toLowerCase().includes(searchLower) ||
          a.event?.name.toLowerCase().includes(searchLower)
        )
      }
    }

    return results
  }

  async getAttendanceById(id: string): Promise<Attendance | null> {
    return this.attendances.find(a => a.id === id) || null
  }

  async createAttendance(data: Partial<Attendance>): Promise<Attendance> {
    const attendance: Attendance = {
      id: `attendance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tenantId: data.tenantId || 'default-tenant',
      eventId: data.eventId!,
      personId: data.personId!,
      status: data.status || 'present',
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      notes: data.notes,
      markedBy: data.markedBy,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Populate event and person data
    attendance.event = this.getEventMockData(attendance.eventId)
    attendance.person = this.getPersonMockData(attendance.personId)

    this.attendances.push(attendance)
    return attendance
  }

  async updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance> {
    const index = this.attendances.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }

    this.attendances[index] = {
      ...this.attendances[index],
      ...updates,
      updatedAt: new Date()
    }

    return this.attendances[index]
  }

  async deleteAttendance(id: string): Promise<void> {
    const index = this.attendances.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }

    this.attendances.splice(index, 1)
  }

  async bulkMarkAttendance(data: BulkAttendanceUpdate): Promise<Attendance[]> {
    const results: Attendance[] = []

    for (const personId of data.personIds) {
      // Check if attendance already exists
      const existing = this.attendances.find(
        a => a.eventId === data.eventId && a.personId === personId
      )

      if (existing) {
        // Update existing
        const updated = await this.updateAttendance(existing.id, {
          status: data.status,
          checkInTime: data.checkInTime,
          notes: data.notes
        })
        results.push(updated)
      } else {
        // Create new
        const created = await this.createAttendance({
          eventId: data.eventId,
          personId: personId,
          status: data.status,
          checkInTime: data.checkInTime,
          notes: data.notes
        })
        results.push(created)
      }
    }

    return results
  }

  async getStatistics(filters?: AttendanceFilters): Promise<AttendanceStatistics> {
    const attendances = await this.getAttendances(filters)

    const totalRecords = attendances.length
    const present = attendances.filter(a => a.status === 'present').length
    const absent = attendances.filter(a => a.status === 'absent').length
    const excused = attendances.filter(a => a.status === 'excused').length
    const late = attendances.filter(a => a.status === 'late').length
    const attendanceRate = totalRecords > 0 ? (present / totalRecords) * 100 : 0

    // Group by event
    const eventMap = new Map<string, { name: string; total: number; present: number }>()
    attendances.forEach(a => {
      if (!a.event) return
      const existing = eventMap.get(a.eventId) || { name: a.event.name, total: 0, present: 0 }
      existing.total++
      if (a.status === 'present') existing.present++
      eventMap.set(a.eventId, existing)
    })

    const byEvent = Array.from(eventMap.entries()).map(([eventId, data]) => ({
      eventId,
      eventName: data.name,
      total: data.total,
      present: data.present,
      rate: (data.present / data.total) * 100
    }))

    // Group by person
    const personMap = new Map<string, { name: string; total: number; present: number }>()
    attendances.forEach(a => {
      if (!a.person) return
      const existing = personMap.get(a.personId) || { 
        name: `${a.person.firstName} ${a.person.lastName || ''}`.trim(), 
        total: 0, 
        present: 0 
      }
      existing.total++
      if (a.status === 'present') existing.present++
      personMap.set(a.personId, existing)
    })

    const byPerson = Array.from(personMap.entries()).map(([personId, data]) => ({
      personId,
      personName: data.name,
      total: data.total,
      present: data.present,
      rate: (data.present / data.total) * 100
    }))

    return {
      totalRecords,
      present,
      absent,
      excused,
      late,
      attendanceRate,
      byEvent,
      byPerson
    }
  }

  private getEventMockData(eventId: string) {
    const events = [
      { id: 'event-1', name: 'Sunday Service', date: new Date('2024-01-14'), type: 'Service' },
      { id: 'event-2', name: 'Bible Study', date: new Date('2024-01-12'), type: 'Study' },
      { id: 'event-3', name: 'Prayer Meeting', date: new Date('2024-01-10'), type: 'Prayer' },
      { id: 'event-4', name: 'Youth Group', date: new Date('2024-01-15'), type: 'Youth' }
    ]
    return events.find(e => e.id === eventId)
  }

  private getPersonMockData(personId: string) {
    const people = [
      { id: 'person-1', firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
      { id: 'person-2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' },
      { id: 'person-3', firstName: 'Michael', lastName: 'Brown', email: 'michael@example.com' },
      { id: 'person-4', firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com' }
    ]
    return people.find(p => p.id === personId)
  }

  private initializeMockData() {
    this.attendances = [
      {
        id: 'att-1',
        eventId: 'event-1',
        personId: 'person-1',
        status: 'present',
        checkInTime: new Date('2024-01-14T10:00:00'),
        event: this.getEventMockData('event-1'),
        person: this.getPersonMockData('person-1'),
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'att-2',
        eventId: 'event-1',
        personId: 'person-2',
        status: 'present',
        checkInTime: new Date('2024-01-14T10:05:00'),
        event: this.getEventMockData('event-1'),
        person: this.getPersonMockData('person-2'),
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'att-3',
        eventId: 'event-1',
        personId: 'person-3',
        status: 'absent',
        event: this.getEventMockData('event-1'),
        person: this.getPersonMockData('person-3'),
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'att-4',
        eventId: 'event-2',
        personId: 'person-1',
        status: 'present',
        checkInTime: new Date('2024-01-12T19:00:00'),
        event: this.getEventMockData('event-2'),
        person: this.getPersonMockData('person-1'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: 'att-5',
        eventId: 'event-2',
        personId: 'person-4',
        status: 'excused',
        notes: 'Family emergency',
        event: this.getEventMockData('event-2'),
        person: this.getPersonMockData('person-4'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ]
  }
}

export const attendanceService = new AttendanceService()
