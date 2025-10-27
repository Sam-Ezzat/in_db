// Groups service for managing discipleship groups and small groups
export interface GroupMember {
  id: string
  personId: string
  personName: string
  email: string
  phone: string
  joinedAt: Date
  role: 'leader' | 'co-leader' | 'member' | 'visitor'
  attendanceRate: number
  lastActivity: Date
  status: 'active' | 'inactive' | 'on-break'
  notes?: string
}

export interface GroupActivity {
  id: string
  groupId: string
  type: 'meeting' | 'study' | 'service' | 'social' | 'prayer' | 'outreach'
  title: string
  description: string
  date: Date
  duration: number // minutes
  attendance: number
  leader: string
  location: string
  resources?: string[]
  notes?: string
  photos?: string[]
}

export interface GroupSchedule {
  id: string
  groupId: string
  dayOfWeek: number // 0-6 (Sunday = 0)
  time: string
  duration: number // minutes
  location: string
  recurring: boolean
  exceptions?: {
    date: Date
    cancelled?: boolean
    newTime?: string
    newLocation?: string
    reason?: string
  }[]
}

export interface GroupCurriculum {
  id: string
  name: string
  description: string
  category: string
  duration: number // weeks
  sessions: {
    sessionNumber: number
    title: string
    description: string
    materials: string[]
    duration: number // minutes
  }[]
  ageGroup: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isActive: boolean
}

export interface Group {
  id: string
  churchId: string
  name: string
  description: string
  category: 'bible-study' | 'discipleship' | 'youth' | 'seniors' | 'small-group' | 'ministry' | 'fellowship' | 'prayer' | 'service'
  type: 'open' | 'closed' | 'by-invitation'
  leaderId: string
  leaderName: string
  coLeaders: string[]
  members: GroupMember[]
  maxMembers: number
  currentSize: number
  ageRange: {
    min?: number
    max?: number
  }
  gender: 'mixed' | 'men' | 'women'
  schedule: GroupSchedule
  location: string
  status: 'active' | 'inactive' | 'paused' | 'completed' | 'planning'
  startDate: Date
  endDate?: Date
  curriculumId?: string
  curriculum?: GroupCurriculum
  progress: {
    currentSession: number
    totalSessions: number
    completionRate: number
  }
  meetingFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'irregular'
  childcareAvailable: boolean
  cost: number
  registrationOpen: boolean
  requirements?: string[]
  tags: string[]
  contactInfo: {
    email?: string
    phone?: string
    website?: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  resources: {
    id: string
    name: string
    type: 'book' | 'video' | 'audio' | 'document' | 'link'
    url?: string
    description?: string
  }[]
  stats: {
    averageAttendance: number
    retentionRate: number
    growthRate: number
    activeSessions: number
    totalActivities: number
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface GroupSummary {
  totalGroups: number
  activeGroups: number
  totalMembers: number
  averageGroupSize: number
  groupsByCategory: { category: string; count: number }[]
  groupsByStatus: { status: string; count: number }[]
  attendanceRate: number
  growthRate: number
  upcomingMeetings: number
  newMembersThisMonth: number
}

export interface GroupAttendance {
  id: string
  groupId: string
  activityId: string
  date: Date
  memberAttendance: {
    memberId: string
    memberName: string
    present: boolean
    lateMinutes?: number
    leftEarlyMinutes?: number
    notes?: string
  }[]
  totalPresent: number
  totalMembers: number
  attendanceRate: number
  weather?: string
  specialNotes?: string
  recordedBy: string
}

class GroupService {
  private groups: Group[] = []
  private curricula: GroupCurriculum[] = []
  private activities: GroupActivity[] = []
  private attendanceRecords: GroupAttendance[] = []

  // Group Management
  async getGroups(filters?: {
    churchId?: string
    category?: string
    status?: string
    leaderId?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<{ groups: Group[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = [...this.groups]

      if (filters) {
        if (filters.churchId) {
          filtered = filtered.filter(g => g.churchId === filters.churchId)
        }
        if (filters.category) {
          filtered = filtered.filter(g => g.category === filters.category)
        }
        if (filters.status) {
          filtered = filtered.filter(g => g.status === filters.status)
        }
        if (filters.leaderId) {
          filtered = filtered.filter(g => g.leaderId === filters.leaderId || g.coLeaders.includes(filters.leaderId!))
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filtered = filtered.filter(g => 
            g.name.toLowerCase().includes(searchLower) ||
            g.description.toLowerCase().includes(searchLower) ||
            g.leaderName.toLowerCase().includes(searchLower)
          )
        }
      }

      const total = filtered.length
      const page = filters?.page || 1
      const limit = filters?.limit || 20
      const offset = (page - 1) * limit
      const groups = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ groups, total }), 100)
    })
  }

  async getGroupById(id: string): Promise<Group | null> {
    return new Promise((resolve) => {
      const group = this.groups.find(g => g.id === id)
      setTimeout(() => resolve(group || null), 50)
    })
  }

  async createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'currentSize' | 'stats'>): Promise<Group> {
    return new Promise((resolve) => {
      const newGroup: Group = {
        ...group,
        id: this.generateId(),
        currentSize: group.members.length,
        stats: {
          averageAttendance: 0,
          retentionRate: 100,
          growthRate: 0,
          activeSessions: 0,
          totalActivities: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.groups.push(newGroup)
      setTimeout(() => resolve(newGroup), 100)
    })
  }

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group> {
    return new Promise((resolve, reject) => {
      const group = this.groups.find(g => g.id === id)
      if (!group) {
        setTimeout(() => reject(new Error('Group not found')), 50)
        return
      }

      Object.assign(group, updates, { 
        updatedAt: new Date(),
        currentSize: updates.members?.length || group.currentSize
      })
      setTimeout(() => resolve(group), 100)
    })
  }

  async deleteGroup(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = this.groups.findIndex(g => g.id === id)
      if (index === -1) {
        setTimeout(() => reject(new Error('Group not found')), 50)
        return
      }

      this.groups.splice(index, 1)
      // Also remove related activities and attendance
      this.activities = this.activities.filter(a => a.groupId !== id)
      this.attendanceRecords = this.attendanceRecords.filter(a => a.groupId !== id)
      
      setTimeout(() => resolve(), 100)
    })
  }

  // Member Management
  async addMemberToGroup(groupId: string, member: Omit<GroupMember, 'id' | 'joinedAt'>): Promise<GroupMember> {
    return new Promise((resolve, reject) => {
      const group = this.groups.find(g => g.id === groupId)
      if (!group) {
        setTimeout(() => reject(new Error('Group not found')), 50)
        return
      }

      if (group.members.length >= group.maxMembers) {
        setTimeout(() => reject(new Error('Group is at maximum capacity')), 50)
        return
      }

      const newMember: GroupMember = {
        ...member,
        id: this.generateId(),
        joinedAt: new Date()
      }

      group.members.push(newMember)
      group.currentSize = group.members.length
      group.updatedAt = new Date()

      setTimeout(() => resolve(newMember), 100)
    })
  }

  async removeMemberFromGroup(groupId: string, memberId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const group = this.groups.find(g => g.id === groupId)
      if (!group) {
        setTimeout(() => reject(new Error('Group not found')), 50)
        return
      }

      const memberIndex = group.members.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        setTimeout(() => reject(new Error('Member not found in group')), 50)
        return
      }

      group.members.splice(memberIndex, 1)
      group.currentSize = group.members.length
      group.updatedAt = new Date()

      setTimeout(() => resolve(), 100)
    })
  }

  async updateMember(groupId: string, memberId: string, updates: Partial<GroupMember>): Promise<GroupMember> {
    return new Promise((resolve, reject) => {
      const group = this.groups.find(g => g.id === groupId)
      if (!group) {
        setTimeout(() => reject(new Error('Group not found')), 50)
        return
      }

      const member = group.members.find(m => m.id === memberId)
      if (!member) {
        setTimeout(() => reject(new Error('Member not found in group')), 50)
        return
      }

      Object.assign(member, updates)
      group.updatedAt = new Date()

      setTimeout(() => resolve(member), 100)
    })
  }

  // Activity Management
  async createActivity(activity: Omit<GroupActivity, 'id'>): Promise<GroupActivity> {
    return new Promise((resolve) => {
      const newActivity: GroupActivity = {
        ...activity,
        id: this.generateId()
      }

      this.activities.push(newActivity)
      
      // Update group stats
      const group = this.groups.find(g => g.id === activity.groupId)
      if (group) {
        group.stats.totalActivities += 1
        group.updatedAt = new Date()
      }

      setTimeout(() => resolve(newActivity), 100)
    })
  }

  async getGroupActivities(groupId: string, filters?: {
    type?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<GroupActivity[]> {
    return new Promise((resolve) => {
      let activities = this.activities.filter(a => a.groupId === groupId)

      if (filters) {
        if (filters.type) {
          activities = activities.filter(a => a.type === filters.type)
        }
        if (filters.startDate) {
          activities = activities.filter(a => a.date >= filters.startDate!)
        }
        if (filters.endDate) {
          activities = activities.filter(a => a.date <= filters.endDate!)
        }
        if (filters.limit) {
          activities = activities.slice(0, filters.limit)
        }
      }

      // Sort by date descending
      activities.sort((a, b) => b.date.getTime() - a.date.getTime())

      setTimeout(() => resolve(activities), 100)
    })
  }

  // Attendance Management
  async recordAttendance(attendance: Omit<GroupAttendance, 'id'>): Promise<GroupAttendance> {
    return new Promise((resolve) => {
      const newAttendance: GroupAttendance = {
        ...attendance,
        id: this.generateId()
      }

      this.attendanceRecords.push(newAttendance)

      // Update member attendance rates
      const group = this.groups.find(g => g.id === attendance.groupId)
      if (group) {
        attendance.memberAttendance.forEach(ma => {
          const member = group.members.find(m => m.id === ma.memberId)
          if (member) {
            // Recalculate attendance rate
            const memberAttendances = this.attendanceRecords
              .filter(ar => ar.groupId === attendance.groupId)
              .flatMap(ar => ar.memberAttendance.filter(ma2 => ma2.memberId === ma.memberId))
            
            const totalSessions = memberAttendances.length
            const presentSessions = memberAttendances.filter(ma2 => ma2.present).length
            member.attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0
            member.lastActivity = attendance.date
          }
        })

        // Update group stats
        this.updateGroupStats(group.id)
      }

      setTimeout(() => resolve(newAttendance), 100)
    })
  }

  async getGroupAttendance(groupId: string, filters?: {
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<GroupAttendance[]> {
    return new Promise((resolve) => {
      let attendances = this.attendanceRecords.filter(a => a.groupId === groupId)

      if (filters) {
        if (filters.startDate) {
          attendances = attendances.filter(a => a.date >= filters.startDate!)
        }
        if (filters.endDate) {
          attendances = attendances.filter(a => a.date <= filters.endDate!)
        }
        if (filters.limit) {
          attendances = attendances.slice(0, filters.limit)
        }
      }

      // Sort by date descending
      attendances.sort((a, b) => b.date.getTime() - a.date.getTime())

      setTimeout(() => resolve(attendances), 100)
    })
  }

  // Curriculum Management
  async getCurricula(): Promise<GroupCurriculum[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.curricula]), 100)
    })
  }

  async createCurriculum(curriculum: Omit<GroupCurriculum, 'id'>): Promise<GroupCurriculum> {
    return new Promise((resolve) => {
      const newCurriculum: GroupCurriculum = {
        ...curriculum,
        id: this.generateId()
      }

      this.curricula.push(newCurriculum)
      setTimeout(() => resolve(newCurriculum), 100)
    })
  }

  // Analytics and Reporting
  async getGroupSummary(churchId: string): Promise<GroupSummary> {
    return new Promise((resolve) => {
      const churchGroups = this.groups.filter(g => g.churchId === churchId)
      
      const groupsByCategory = this.groupByCategory(churchGroups, 'category')
      const groupsByStatus = this.groupByCategory(churchGroups, 'status')
      
      const totalMembers = churchGroups.reduce((sum, g) => sum + g.currentSize, 0)
      const averageGroupSize = churchGroups.length > 0 ? totalMembers / churchGroups.length : 0
      
      const activeGroups = churchGroups.filter(g => g.status === 'active')
      const recentAttendances = this.attendanceRecords.filter(ar => {
        const isChurchGroup = churchGroups.some(g => g.id === ar.groupId)
        const isRecent = (new Date().getTime() - ar.date.getTime()) <= (30 * 24 * 60 * 60 * 1000) // 30 days
        return isChurchGroup && isRecent
      })
      
      const attendanceRate = recentAttendances.length > 0
        ? recentAttendances.reduce((sum, ar) => sum + ar.attendanceRate, 0) / recentAttendances.length
        : 0

      const now = new Date()
      const upcomingMeetings = activeGroups.filter(g => {
        // Simple check for groups that meet this week
        return g.schedule && g.status === 'active'
      }).length

      const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      const newMembersThisMonth = churchGroups.reduce((sum, g) => {
        return sum + g.members.filter(m => m.joinedAt >= oneMonthAgo).length
      }, 0)

      const summary: GroupSummary = {
        totalGroups: churchGroups.length,
        activeGroups: activeGroups.length,
        totalMembers,
        averageGroupSize: Math.round(averageGroupSize * 10) / 10,
        groupsByCategory,
        groupsByStatus,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        growthRate: 5.2, // Mock calculation
        upcomingMeetings,
        newMembersThisMonth
      }

      setTimeout(() => resolve(summary), 100)
    })
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private groupByCategory<T extends Record<string, any>>(items: T[], key: keyof T): { category: string; count: number }[] {
    const grouped = items.reduce((acc, item) => {
      const category = item[key] as string
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([category, count]) => ({ category, count }))
  }

  private updateGroupStats(groupId: string): void {
    const group = this.groups.find(g => g.id === groupId)
    if (!group) return

    const groupAttendances = this.attendanceRecords.filter(ar => ar.groupId === groupId)
    
    if (groupAttendances.length > 0) {
      group.stats.averageAttendance = groupAttendances.reduce((sum, ar) => sum + ar.attendanceRate, 0) / groupAttendances.length
      group.stats.activeSessions = groupAttendances.filter(ar => 
        (new Date().getTime() - ar.date.getTime()) <= (30 * 24 * 60 * 60 * 1000)
      ).length
    }

    // Calculate retention rate (members who joined > 3 months ago and are still active)
    const threeMonthsAgo = new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000))
    const oldMembers = group.members.filter(m => m.joinedAt <= threeMonthsAgo)
    const activeOldMembers = oldMembers.filter(m => m.status === 'active')
    group.stats.retentionRate = oldMembers.length > 0 ? (activeOldMembers.length / oldMembers.length) * 100 : 100

    group.updatedAt = new Date()
  }
}

// Initialize service with mock data
const service = new GroupService()

// Mock curricula
const mockCurricula: Omit<GroupCurriculum, 'id'>[] = [
  {
    name: 'Starting Point Series',
    description: 'Foundation course for new Christians',
    category: 'discipleship',
    duration: 8,
    sessions: [
      { sessionNumber: 1, title: 'Who is God?', description: 'Understanding God\'s nature', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 2, title: 'Who is Jesus?', description: 'The person and work of Christ', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 3, title: 'Who is the Holy Spirit?', description: 'Understanding the Spirit\'s role', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 4, title: 'The Bible', description: 'God\'s word to us', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 5, title: 'Prayer', description: 'Communicating with God', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 6, title: 'Community', description: 'Life in the church', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 7, title: 'Serving', description: 'Using your gifts', materials: ['Bible', 'Workbook'], duration: 60 },
      { sessionNumber: 8, title: 'Sharing', description: 'Telling others about Jesus', materials: ['Bible', 'Workbook'], duration: 60 }
    ],
    ageGroup: 'adult',
    difficulty: 'beginner',
    isActive: true
  },
  {
    name: 'Life Together Study',
    description: 'Building authentic Christian community',
    category: 'fellowship',
    duration: 6,
    sessions: [
      { sessionNumber: 1, title: 'Created for Community', description: 'God\'s design for relationships', materials: ['Study Guide'], duration: 90 },
      { sessionNumber: 2, title: 'Authentic Fellowship', description: 'Being real with each other', materials: ['Study Guide'], duration: 90 },
      { sessionNumber: 3, title: 'Mutual Support', description: 'Bearing one another\'s burdens', materials: ['Study Guide'], duration: 90 },
      { sessionNumber: 4, title: 'Conflict Resolution', description: 'Handling disagreements biblically', materials: ['Study Guide'], duration: 90 },
      { sessionNumber: 5, title: 'Spiritual Growth Together', description: 'Growing in faith as a community', materials: ['Study Guide'], duration: 90 },
      { sessionNumber: 6, title: 'Mission Together', description: 'Serving God as a group', materials: ['Study Guide'], duration: 90 }
    ],
    ageGroup: 'young-adult',
    difficulty: 'intermediate',
    isActive: true
  }
]

mockCurricula.forEach(curriculum => {
  service.createCurriculum(curriculum)
})

// Mock groups
const mockGroups: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'currentSize' | 'stats'>[] = [
  {
    churchId: '1',
    name: 'New Believers Class',
    description: 'Foundation course for new Christians covering basic beliefs and practices',
    category: 'discipleship',
    type: 'open',
    leaderId: 'pastor_001',
    leaderName: 'Pastor John Smith',
    coLeaders: [],
    members: [
      {
        id: '1',
        personId: 'person_1',
        personName: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-0101',
        joinedAt: new Date('2024-01-01'),
        role: 'member',
        attendanceRate: 85,
        lastActivity: new Date(),
        status: 'active'
      },
      {
        id: '2',
        personId: 'person_2',
        personName: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '555-0102',
        joinedAt: new Date('2024-01-15'),
        role: 'member',
        attendanceRate: 92,
        lastActivity: new Date(),
        status: 'active'
      }
    ],
    maxMembers: 15,
    ageRange: { min: 18 },
    gender: 'mixed',
    schedule: {
      id: 'schedule_1',
      groupId: '1',
      dayOfWeek: 0, // Sunday
      time: '11:30',
      duration: 60,
      location: 'Room 101',
      recurring: true
    },
    location: 'Room 101',
    status: 'active',
    startDate: new Date('2024-01-01'),
    curriculumId: '1',
    progress: {
      currentSession: 5,
      totalSessions: 8,
      completionRate: 62.5
    },
    meetingFrequency: 'weekly',
    childcareAvailable: false,
    cost: 0,
    registrationOpen: true,
    requirements: ['Commitment to attend weekly', 'Willingness to participate'],
    tags: ['new-members', 'foundation', 'discipleship'],
    contactInfo: {
      email: 'newbeliever@church.com',
      phone: '555-CHURCH'
    },
    socialMedia: {},
    resources: [
      {
        id: 'resource_1',
        name: 'Starting Point Workbook',
        type: 'book',
        description: 'Study guide for new believers'
      }
    ],
    createdBy: 'pastor_001'
  },
  {
    churchId: '1',
    name: 'Young Adults Fellowship',
    description: 'Community group for ages 18-30 focusing on life application and fellowship',
    category: 'youth',
    type: 'open',
    leaderId: 'leader_002',
    leaderName: 'Sarah Johnson',
    coLeaders: ['coleader_001'],
    members: [
      {
        id: '3',
        personId: 'person_3',
        personName: 'David Brown',
        email: 'david@example.com',
        phone: '555-0103',
        joinedAt: new Date('2023-12-01'),
        role: 'member',
        attendanceRate: 78,
        lastActivity: new Date(),
        status: 'active'
      }
    ],
    maxMembers: 30,
    ageRange: { min: 18, max: 30 },
    gender: 'mixed',
    schedule: {
      id: 'schedule_2',
      groupId: '2',
      dayOfWeek: 5, // Friday
      time: '19:00',
      duration: 120,
      location: 'Youth Center',
      recurring: true
    },
    location: 'Youth Center',
    status: 'active',
    startDate: new Date('2023-09-01'),
    curriculumId: '2',
    progress: {
      currentSession: 3,
      totalSessions: 6,
      completionRate: 50
    },
    meetingFrequency: 'weekly',
    childcareAvailable: true,
    cost: 0,
    registrationOpen: true,
    requirements: ['Ages 18-30'],
    tags: ['young-adults', 'fellowship', 'community'],
    contactInfo: {
      email: 'youngadults@church.com'
    },
    socialMedia: {
      instagram: '@churchyoungadults'
    },
    resources: [
      {
        id: 'resource_2',
        name: 'Life Together Study Guide',
        type: 'book',
        description: 'Community building study'
      }
    ],
    createdBy: 'leader_002'
  }
]

// Create mock groups
mockGroups.forEach(async (group) => {
  await service.createGroup(group)
})

export const groupService = service
export default groupService