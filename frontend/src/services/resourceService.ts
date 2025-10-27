// Resource management service for facilities, equipment, and materials
export interface Resource {
  id: string
  name: string
  description?: string
  category: 'facility' | 'equipment' | 'material' | 'vehicle' | 'technology' | 'other'
  subcategory?: string
  type: 'physical_space' | 'movable_equipment' | 'consumable' | 'digital_resource'
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order' | 'retired'
  location: string
  capacity?: number // For rooms/facilities
  quantity?: number // For materials/equipment
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair'
  purchaseDate?: Date
  purchasePrice?: number
  currentValue?: number
  warrantyExpiry?: Date
  maintenanceSchedule?: MaintenanceSchedule[]
  specifications?: Record<string, any>
  imageUrl?: string
  tags: string[]
  churchId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceSchedule {
  id: string
  resourceId: string
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'as_needed'
  title: string
  description?: string
  frequency: number // For recurring maintenance
  lastCompleted?: Date
  nextDue: Date
  assignedTo?: string
  estimatedDuration: number // in minutes
  cost?: number
  isOverdue: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface ResourceBooking {
  id: string
  resourceId: string
  title: string
  description?: string
  bookedBy: string
  bookedFor?: string // Person/group the booking is for
  startDateTime: Date
  endDateTime: Date
  purpose: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  attendeeCount?: number
  setupRequirements?: string[]
  specialInstructions?: string
  cost?: number
  recurring?: RecurringBooking
  approvedBy?: string
  approvedAt?: Date
  contactInfo: {
    name: string
    email?: string
    phone?: string
  }
  conflictsWith?: string[] // Other booking IDs
  createdAt: Date
  updatedAt: Date
}

export interface RecurringBooking {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // Every X days/weeks/months
  daysOfWeek?: number[] // For weekly recurring (0 = Sunday)
  endDate?: Date
  occurrences?: number
}

export interface ResourceAvailability {
  resourceId: string
  date: Date
  timeSlots: TimeSlot[]
  isFullyBooked: boolean
  conflictingBookings: string[]
}

export interface TimeSlot {
  startTime: string // HH:MM format
  endTime: string
  isAvailable: boolean
  bookingId?: string
  blockReason?: string
}

export interface ResourceUsageStats {
  resourceId: string
  totalBookings: number
  totalHours: number
  utilizationRate: number // Percentage
  popularTimeSlots: { time: string; count: number }[]
  averageBookingDuration: number
  revenue?: number
  maintenanceCost?: number
  bookingsByMonth: { month: string; count: number; hours: number }[]
}

export interface ResourceSummary {
  totalResources: number
  resourcesByCategory: { category: string; count: number }[]
  resourcesByStatus: { status: string; count: number }[]
  totalBookings: number
  upcomingBookings: number
  overdueMaintenance: number
  totalValue: number
  utilizationRate: number
  revenueThisMonth: number
  maintenanceAlerts: MaintenanceAlert[]
}

export interface MaintenanceAlert {
  id: string
  resourceId: string
  resourceName: string
  type: 'overdue' | 'due_soon' | 'inspection_required' | 'repair_needed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  message: string
  dueDate?: Date
  estimatedCost?: number
}

class ResourceService {
  private resources: Resource[] = []
  private bookings: ResourceBooking[] = []
  private maintenanceSchedules: MaintenanceSchedule[] = []

  // Resource management methods
  async getResources(filters?: {
    category?: string
    status?: string
    location?: string
    churchId?: string
    searchTerm?: string
    limit?: number
    offset?: number
  }): Promise<{ resources: Resource[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = [...this.resources]

      if (filters) {
        if (filters.category) {
          filtered = filtered.filter(r => r.category === filters.category)
        }
        if (filters.status) {
          filtered = filtered.filter(r => r.status === filters.status)
        }
        if (filters.location) {
          filtered = filtered.filter(r => r.location.toLowerCase().includes(filters.location!.toLowerCase()))
        }
        if (filters.churchId) {
          filtered = filtered.filter(r => r.churchId === filters.churchId)
        }
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase()
          filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(term) ||
            r.description?.toLowerCase().includes(term) ||
            r.tags.some(tag => tag.toLowerCase().includes(term))
          )
        }
      }

      // Sort by name
      filtered.sort((a, b) => a.name.localeCompare(b.name))

      const total = filtered.length
      const offset = filters?.offset || 0
      const limit = filters?.limit || 50

      const resources = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ resources, total }), 100)
    })
  }

  async createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    return new Promise((resolve) => {
      const newResource: Resource = {
        ...resource,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.resources.unshift(newResource)
      setTimeout(() => resolve(newResource), 100)
    })
  }

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource> {
    return new Promise((resolve, reject) => {
      const resource = this.resources.find(r => r.id === id)
      if (!resource) {
        setTimeout(() => reject(new Error('Resource not found')), 50)
        return
      }

      Object.assign(resource, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(resource), 100)
    })
  }

  async deleteResource(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.resources = this.resources.filter(r => r.id !== id)
      // Also remove related bookings and maintenance schedules
      this.bookings = this.bookings.filter(b => b.resourceId !== id)
      this.maintenanceSchedules = this.maintenanceSchedules.filter(m => m.resourceId !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Booking management methods
  async getBookings(filters?: {
    resourceId?: string
    startDate?: Date
    endDate?: Date
    status?: string
    bookedBy?: string
    churchId?: string
    limit?: number
    offset?: number
  }): Promise<{ bookings: ResourceBooking[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = [...this.bookings]

      if (filters) {
        if (filters.resourceId) {
          filtered = filtered.filter(b => b.resourceId === filters.resourceId)
        }
        if (filters.startDate) {
          filtered = filtered.filter(b => new Date(b.startDateTime) >= filters.startDate!)
        }
        if (filters.endDate) {
          filtered = filtered.filter(b => new Date(b.endDateTime) <= filters.endDate!)
        }
        if (filters.status) {
          filtered = filtered.filter(b => b.status === filters.status)
        }
        if (filters.bookedBy) {
          filtered = filtered.filter(b => b.bookedBy === filters.bookedBy)
        }
      }

      // Sort by start date
      filtered.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())

      const total = filtered.length
      const offset = filters?.offset || 0
      const limit = filters?.limit || 50

      const bookings = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ bookings, total }), 100)
    })
  }

  async createBooking(booking: Omit<ResourceBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResourceBooking> {
    return new Promise((resolve, reject) => {
      // Check for conflicts
      const conflicts = this.checkBookingConflicts(
        booking.resourceId,
        booking.startDateTime,
        booking.endDateTime
      )

      const newBooking: ResourceBooking = {
        ...booking,
        id: this.generateId(),
        conflictsWith: conflicts.length > 0 ? conflicts.map(c => c.id) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.bookings.unshift(newBooking)
      setTimeout(() => resolve(newBooking), 100)
    })
  }

  async updateBooking(id: string, updates: Partial<ResourceBooking>): Promise<ResourceBooking> {
    return new Promise((resolve, reject) => {
      const booking = this.bookings.find(b => b.id === id)
      if (!booking) {
        setTimeout(() => reject(new Error('Booking not found')), 50)
        return
      }

      Object.assign(booking, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(booking), 100)
    })
  }

  async deleteBooking(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.bookings = this.bookings.filter(b => b.id !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Availability checking
  async getResourceAvailability(resourceId: string, date: Date): Promise<ResourceAvailability> {
    return new Promise((resolve) => {
      const dayBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.startDateTime)
        return booking.resourceId === resourceId &&
               bookingDate.toDateString() === date.toDateString() &&
               booking.status !== 'cancelled'
      })

      const timeSlots: TimeSlot[] = []
      
      // Generate hourly slots from 6 AM to 10 PM
      for (let hour = 6; hour <= 22; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
        
        const conflictingBooking = dayBookings.find(booking => {
          const bookingStart = new Date(booking.startDateTime)
          const bookingEnd = new Date(booking.endDateTime)
          const slotStart = new Date(date)
          slotStart.setHours(hour, 0, 0, 0)
          const slotEnd = new Date(date)
          slotEnd.setHours(hour + 1, 0, 0, 0)
          
          return (bookingStart < slotEnd && bookingEnd > slotStart)
        })

        timeSlots.push({
          startTime,
          endTime,
          isAvailable: !conflictingBooking,
          bookingId: conflictingBooking?.id
        })
      }

      const availability: ResourceAvailability = {
        resourceId,
        date,
        timeSlots,
        isFullyBooked: timeSlots.every(slot => !slot.isAvailable),
        conflictingBookings: dayBookings.map(b => b.id)
      }

      setTimeout(() => resolve(availability), 100)
    })
  }

  private checkBookingConflicts(resourceId: string, startDateTime: Date, endDateTime: Date, excludeBookingId?: string): ResourceBooking[] {
    return this.bookings.filter(booking => {
      if (booking.id === excludeBookingId) return false
      if (booking.resourceId !== resourceId) return false
      if (booking.status === 'cancelled') return false

      const bookingStart = new Date(booking.startDateTime)
      const bookingEnd = new Date(booking.endDateTime)
      
      return (startDateTime < bookingEnd && endDateTime > bookingStart)
    })
  }

  // Maintenance management
  async getMaintenanceSchedules(resourceId?: string): Promise<MaintenanceSchedule[]> {
    return new Promise((resolve) => {
      let schedules = [...this.maintenanceSchedules]
      
      if (resourceId) {
        schedules = schedules.filter(s => s.resourceId === resourceId)
      }

      // Update overdue status
      const now = new Date()
      schedules.forEach(schedule => {
        schedule.isOverdue = schedule.nextDue < now
      })

      // Sort by next due date
      schedules.sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())

      setTimeout(() => resolve(schedules), 100)
    })
  }

  async createMaintenanceSchedule(schedule: Omit<MaintenanceSchedule, 'id' | 'isOverdue'>): Promise<MaintenanceSchedule> {
    return new Promise((resolve) => {
      const newSchedule: MaintenanceSchedule = {
        ...schedule,
        id: this.generateId(),
        isOverdue: schedule.nextDue < new Date()
      }

      this.maintenanceSchedules.push(newSchedule)
      setTimeout(() => resolve(newSchedule), 100)
    })
  }

  // Statistics and reporting
  async getResourceSummary(churchId: string): Promise<ResourceSummary> {
    return new Promise((resolve) => {
      const churchResources = this.resources.filter(r => r.churchId === churchId)
      const churchBookings = this.bookings.filter(b => {
        const resource = this.resources.find(r => r.id === b.resourceId)
        return resource?.churchId === churchId
      })

      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const resourcesByCategory = this.groupByCategory(churchResources, 'category')
      const resourcesByStatus = this.groupByCategory(churchResources, 'status')

      const upcomingBookings = churchBookings.filter(b => 
        new Date(b.startDateTime) > now && b.status !== 'cancelled'
      ).length

      const overdueMaintenance = this.maintenanceSchedules.filter(s => {
        const resource = this.resources.find(r => r.id === s.resourceId)
        return resource?.churchId === churchId && s.isOverdue
      }).length

      const totalValue = churchResources.reduce((sum, r) => sum + (r.currentValue || r.purchasePrice || 0), 0)

      const thisMonthBookings = churchBookings.filter(b => 
        new Date(b.startDateTime) >= thisMonth && b.status !== 'cancelled'
      )
      const revenueThisMonth = thisMonthBookings.reduce((sum, b) => sum + (b.cost || 0), 0)

      const maintenanceAlerts = this.generateMaintenanceAlerts(churchId)

      const summary: ResourceSummary = {
        totalResources: churchResources.length,
        resourcesByCategory,
        resourcesByStatus,
        totalBookings: churchBookings.length,
        upcomingBookings,
        overdueMaintenance,
        totalValue,
        utilizationRate: this.calculateUtilizationRate(churchResources, churchBookings),
        revenueThisMonth,
        maintenanceAlerts
      }

      setTimeout(() => resolve(summary), 150)
    })
  }

  private groupByCategory(items: any[], field: string) {
    const grouped = items.reduce((acc, item) => {
      const value = item[field]
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    return Object.entries(grouped).map(([key, count]) => ({
      [field.replace(/([A-Z])/g, '_$1').toLowerCase()]: key,
      count: count as number
    }))
  }

  private calculateUtilizationRate(resources: Resource[], bookings: ResourceBooking[]): number {
    if (resources.length === 0) return 0

    const totalPossibleHours = resources.length * 16 * 30 // 16 hours per day, 30 days
    const actualBookedHours = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => {
        const duration = (new Date(b.endDateTime).getTime() - new Date(b.startDateTime).getTime()) / (1000 * 60 * 60)
        return sum + duration
      }, 0)

    return Math.round((actualBookedHours / totalPossibleHours) * 100)
  }

  private generateMaintenanceAlerts(churchId: string): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = []
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    this.maintenanceSchedules.forEach(schedule => {
      const resource = this.resources.find(r => r.id === schedule.resourceId && r.churchId === churchId)
      if (!resource) return

      if (schedule.isOverdue) {
        alerts.push({
          id: this.generateId(),
          resourceId: resource.id,
          resourceName: resource.name,
          type: 'overdue',
          priority: schedule.priority,
          message: `${schedule.title} is overdue`,
          dueDate: schedule.nextDue,
          estimatedCost: schedule.cost
        })
      } else if (schedule.nextDue <= nextWeek) {
        alerts.push({
          id: this.generateId(),
          resourceId: resource.id,
          resourceName: resource.name,
          type: 'due_soon',
          priority: schedule.priority,
          message: `${schedule.title} is due soon`,
          dueDate: schedule.nextDue,
          estimatedCost: schedule.cost
        })
      }
    })

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}

// Initialize service with mock data
const service = new ResourceService()

// Mock resources
const mockResources: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Main Sanctuary',
    description: 'Primary worship space with 500 person capacity',
    category: 'facility',
    subcategory: 'worship_space',
    type: 'physical_space',
    status: 'available',
    location: 'Building A, Ground Floor',
    capacity: 500,
    condition: 'excellent',
    purchaseDate: new Date('2020-01-15'),
    purchasePrice: 150000,
    currentValue: 140000,
    specifications: {
      seating: 500,
      sound_system: 'Professional grade',
      lighting: 'LED stage lighting',
      av_equipment: 'Projectors, screens, cameras'
    },
    tags: ['worship', 'main', 'large capacity', 'av equipped'],
    churchId: '1',
    createdBy: 'admin_001'
  },
  {
    name: 'Fellowship Hall',
    description: 'Multi-purpose hall for events and gatherings',
    category: 'facility',
    subcategory: 'event_space',
    type: 'physical_space',
    status: 'available',
    location: 'Building B, Ground Floor',
    capacity: 200,
    condition: 'good',
    purchaseDate: new Date('2018-06-01'),
    purchasePrice: 80000,
    currentValue: 75000,
    specifications: {
      seating: 200,
      kitchen_access: true,
      tables: 20,
      chairs: 200
    },
    tags: ['fellowship', 'events', 'kitchen access', 'flexible seating'],
    churchId: '1',
    createdBy: 'admin_001'
  },
  {
    name: 'Sound System - Main',
    description: 'Professional sound mixing board and speakers',
    category: 'equipment',
    subcategory: 'audio_visual',
    type: 'movable_equipment',
    status: 'available',
    location: 'Main Sanctuary',
    quantity: 1,
    condition: 'excellent',
    purchaseDate: new Date('2021-03-15'),
    purchasePrice: 25000,
    currentValue: 20000,
    warrantyExpiry: new Date('2024-03-15'),
    specifications: {
      brand: 'Yamaha',
      model: 'TF5',
      channels: 32,
      wireless_mics: 8
    },
    tags: ['sound', 'mixing', 'wireless', 'professional'],
    churchId: '1',
    createdBy: 'admin_001'
  },
  {
    name: 'Folding Chairs',
    description: 'Stackable folding chairs for events',
    category: 'equipment',
    subcategory: 'furniture',
    type: 'movable_equipment',
    status: 'available',
    location: 'Storage Room C',
    quantity: 100,
    condition: 'good',
    purchaseDate: new Date('2019-08-01'),
    purchasePrice: 5000,
    currentValue: 3500,
    specifications: {
      material: 'Metal frame with fabric seat',
      weight_capacity: '250 lbs',
      stackable: true
    },
    tags: ['chairs', 'folding', 'stackable', 'portable'],
    churchId: '1',
    createdBy: 'admin_001'
  },
  {
    name: 'Church Van',
    description: '15-passenger van for transportation',
    category: 'vehicle',
    subcategory: 'passenger_transport',
    type: 'movable_equipment',
    status: 'available',
    location: 'Parking Lot',
    capacity: 15,
    condition: 'good',
    purchaseDate: new Date('2020-09-01'),
    purchasePrice: 35000,
    currentValue: 28000,
    specifications: {
      make: 'Ford',
      model: 'Transit 350',
      year: 2020,
      mileage: 45000,
      fuel_type: 'Gasoline'
    },
    tags: ['transportation', 'van', 'passenger', 'trips'],
    churchId: '1',
    createdBy: 'admin_001'
  }
]

// Mock bookings
const mockBookings: Omit<ResourceBooking, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    resourceId: '', // Will be set after resources are created
    title: 'Sunday Morning Service',
    description: 'Regular weekly worship service',
    bookedBy: 'pastor_001',
    bookedFor: 'Main Congregation',
    startDateTime: new Date('2024-11-03T09:00:00'),
    endDateTime: new Date('2024-11-03T11:00:00'),
    purpose: 'Worship Service',
    status: 'confirmed',
    attendeeCount: 350,
    setupRequirements: ['Sound system', 'Lighting', 'Projector'],
    contactInfo: {
      name: 'Pastor Johnson',
      email: 'pastor@church.com',
      phone: '555-0123'
    },
    recurring: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [0] // Sunday
    }
  },
  {
    resourceId: '', // Will be set after resources are created
    title: 'Youth Fellowship Dinner',
    description: 'Monthly youth group gathering with dinner',
    bookedBy: 'youth_leader_001',
    bookedFor: 'Youth Group',
    startDateTime: new Date('2024-11-05T18:00:00'),
    endDateTime: new Date('2024-11-05T21:00:00'),
    purpose: 'Youth Ministry',
    status: 'confirmed',
    attendeeCount: 45,
    setupRequirements: ['Tables for 8', 'Kitchen access', 'Sound system'],
    specialInstructions: 'Need access to kitchen for meal preparation',
    contactInfo: {
      name: 'Sarah Wilson',
      email: 'youth@church.com',
      phone: '555-0456'
    }
  }
]

// Add mock data
mockResources.forEach(async (resource) => {
  const createdResource = await service.createResource(resource)
  
  // Link bookings to resources
  if (resource.name === 'Main Sanctuary') {
    mockBookings[0].resourceId = createdResource.id
    await service.createBooking(mockBookings[0])
  } else if (resource.name === 'Fellowship Hall') {
    mockBookings[1].resourceId = createdResource.id
    await service.createBooking(mockBookings[1])
  }
})

// Add mock maintenance schedules
setTimeout(async () => {
  const resources = await service.getResources({ churchId: '1' })
  
  if (resources.resources.length > 0) {
    await service.createMaintenanceSchedule({
      resourceId: resources.resources[0].id,
      type: 'monthly',
      title: 'HVAC System Check',
      description: 'Monthly inspection and filter replacement',
      frequency: 1,
      nextDue: new Date('2024-11-15'),
      estimatedDuration: 120,
      cost: 150,
      priority: 'medium'
    })

    await service.createMaintenanceSchedule({
      resourceId: resources.resources[2].id, // Sound system
      type: 'quarterly',
      title: 'Audio Equipment Calibration',
      description: 'Professional sound system tuning and maintenance',
      frequency: 1,
      nextDue: new Date('2024-12-01'),
      estimatedDuration: 240,
      cost: 300,
      priority: 'high'
    })
  }
}, 500)

export const resourceService = service
export default resourceService