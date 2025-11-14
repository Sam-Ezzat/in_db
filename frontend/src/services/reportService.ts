import { BaseService } from './base/BaseService'

export interface ReportItem {
  id: string
  reportId: string
  itemKey: string // e.g., 'new_members', 'visits_count', 'activities', 'notes'
  itemType: 'number' | 'text' | 'json'
  valueNumber?: number
  valueText?: string
  valueJson?: any
}

export interface Report {
  id: string
  tenantId?: string
  reporterPersonId?: string
  reporterPerson?: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
  targetType: 'church' | 'committee' | 'team' | 'group' | 'person'
  targetId: string
  targetName?: string // Populated target name
  periodStart: Date
  periodEnd: Date
  title: string
  submittedAt: Date
  items?: ReportItem[]
  createdAt: Date
  updatedAt: Date
}

export interface ReportFilters {
  targetType?: 'church' | 'committee' | 'team' | 'group' | 'person'
  targetId?: string
  reporterPersonId?: string
  periodStart?: Date
  periodEnd?: Date
  search?: string
  tenantId?: string
}

export interface ReportStatistics {
  totalReports: number
  reportsByType: { type: string; count: number }[]
  reportsByMonth: { month: string; count: number }[]
  recentReports: number
}

class ReportService extends BaseService {
  private reports: Report[] = []
  private reportItems: ReportItem[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  private initializeMockData() {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Mock reports
    this.reports = [
      {
        id: 'report-1',
        reporterPersonId: 'person-1',
        reporterPerson: {
          id: 'person-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com'
        },
        targetType: 'team',
        targetId: 'team-1',
        targetName: 'Worship Team',
        periodStart: oneMonthAgo,
        periodEnd: oneWeekAgo,
        title: 'Monthly Worship Team Report - January',
        submittedAt: oneWeekAgo,
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo
      },
      {
        id: 'report-2',
        reporterPersonId: 'person-2',
        reporterPerson: {
          id: 'person-2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@example.com'
        },
        targetType: 'committee',
        targetId: 'committee-1',
        targetName: 'Youth Committee',
        periodStart: twoWeeksAgo,
        periodEnd: oneWeekAgo,
        title: 'Youth Committee Weekly Report',
        submittedAt: oneWeekAgo,
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo
      },
      {
        id: 'report-3',
        reporterPersonId: 'person-3',
        reporterPerson: {
          id: 'person-3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.b@example.com'
        },
        targetType: 'group',
        targetId: 'group-1',
        targetName: 'Bible Study Group',
        periodStart: oneMonthAgo,
        periodEnd: now,
        title: 'January Bible Study Summary',
        submittedAt: now,
        createdAt: now,
        updatedAt: now
      }
    ]

    // Mock report items
    this.reportItems = [
      // Report 1 items
      {
        id: 'item-1',
        reportId: 'report-1',
        itemKey: 'rehearsals_count',
        itemType: 'number',
        valueNumber: 8
      },
      {
        id: 'item-2',
        reportId: 'report-1',
        itemKey: 'new_songs_learned',
        itemType: 'number',
        valueNumber: 3
      },
      {
        id: 'item-3',
        reportId: 'report-1',
        itemKey: 'team_notes',
        itemType: 'text',
        valueText: 'Great progress this month. Team morale is high and we successfully introduced new worship songs.'
      },
      {
        id: 'item-4',
        reportId: 'report-1',
        itemKey: 'attendance_data',
        itemType: 'json',
        valueJson: {
          averageAttendance: 12,
          totalMembers: 15,
          attendanceRate: 80
        }
      },
      // Report 2 items
      {
        id: 'item-5',
        reportId: 'report-2',
        itemKey: 'youth_attendance',
        itemType: 'number',
        valueNumber: 45
      },
      {
        id: 'item-6',
        reportId: 'report-2',
        itemKey: 'activities_held',
        itemType: 'number',
        valueNumber: 2
      },
      {
        id: 'item-7',
        reportId: 'report-2',
        itemKey: 'activity_summary',
        itemType: 'text',
        valueText: 'Organized game night and outdoor service. Both events were well attended and received positive feedback.'
      },
      // Report 3 items
      {
        id: 'item-8',
        reportId: 'report-3',
        itemKey: 'sessions_held',
        itemType: 'number',
        valueNumber: 4
      },
      {
        id: 'item-9',
        reportId: 'report-3',
        itemKey: 'average_attendance',
        itemType: 'number',
        valueNumber: 18
      },
      {
        id: 'item-10',
        reportId: 'report-3',
        itemKey: 'study_topics',
        itemType: 'json',
        valueJson: [
          'The Book of James - Faith and Works',
          'Prayer and Fasting',
          'Spiritual Gifts',
          'Living as Light in Darkness'
        ]
      }
    ]
  }

  async getReports(filters?: ReportFilters): Promise<Report[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.reports]

        if (filters?.targetType) {
          filtered = filtered.filter(r => r.targetType === filters.targetType)
        }

        if (filters?.targetId) {
          filtered = filtered.filter(r => r.targetId === filters.targetId)
        }

        if (filters?.reporterPersonId) {
          filtered = filtered.filter(r => r.reporterPersonId === filters.reporterPersonId)
        }

        if (filters?.periodStart) {
          filtered = filtered.filter(r => new Date(r.periodEnd) >= filters.periodStart!)
        }

        if (filters?.periodEnd) {
          filtered = filtered.filter(r => new Date(r.periodStart) <= filters.periodEnd!)
        }

        if (filters?.search) {
          const search = filters.search.toLowerCase()
          filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(search) ||
            r.targetName?.toLowerCase().includes(search) ||
            r.reporterPerson?.firstName.toLowerCase().includes(search) ||
            r.reporterPerson?.lastName.toLowerCase().includes(search)
          )
        }

        // Sort by submitted date (newest first)
        filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

        // Populate items for each report
        const withItems = filtered.map(report => ({
          ...report,
          items: this.reportItems.filter(item => item.reportId === report.id)
        }))

        resolve(withItems)
      }, 300)
    })
  }

  async getReportById(id: string): Promise<Report | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = this.reports.find(r => r.id === id)
        if (!report) {
          resolve(null)
          return
        }

        const items = this.reportItems.filter(item => item.reportId === id)
        resolve({ ...report, items })
      }, 200)
    })
  }

  async createReport(data: Partial<Report> & { items?: Partial<ReportItem>[] }): Promise<Report> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport: Report = {
          id: `report-${Date.now()}`,
          tenantId: data.tenantId,
          reporterPersonId: data.reporterPersonId!,
          reporterPerson: data.reporterPerson,
          targetType: data.targetType!,
          targetId: data.targetId!,
          targetName: data.targetName,
          periodStart: data.periodStart!,
          periodEnd: data.periodEnd!,
          title: data.title!,
          submittedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        this.reports.unshift(newReport)

        // Create report items
        const items: ReportItem[] = []
        if (data.items && data.items.length > 0) {
          data.items.forEach(itemData => {
            const newItem: ReportItem = {
              id: `item-${Date.now()}-${Math.random()}`,
              reportId: newReport.id,
              itemKey: itemData.itemKey!,
              itemType: itemData.itemType!,
              valueNumber: itemData.valueNumber,
              valueText: itemData.valueText,
              valueJson: itemData.valueJson
            }
            this.reportItems.push(newItem)
            items.push(newItem)
          })
        }

        resolve({ ...newReport, items })
      }, 300)
    })
  }

  async updateReport(id: string, updates: Partial<Report> & { items?: Partial<ReportItem>[] }): Promise<Report> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.reports.findIndex(r => r.id === id)
        if (index === -1) {
          reject(new Error('Report not found'))
          return
        }

        this.reports[index] = {
          ...this.reports[index],
          ...updates,
          id,
          updatedAt: new Date()
        }

        // Update items if provided
        if (updates.items) {
          // Remove old items
          this.reportItems = this.reportItems.filter(item => item.reportId !== id)

          // Add new items
          updates.items.forEach(itemData => {
            const newItem: ReportItem = {
              id: itemData.id || `item-${Date.now()}-${Math.random()}`,
              reportId: id,
              itemKey: itemData.itemKey!,
              itemType: itemData.itemType!,
              valueNumber: itemData.valueNumber,
              valueText: itemData.valueText,
              valueJson: itemData.valueJson
            }
            this.reportItems.push(newItem)
          })
        }

        const items = this.reportItems.filter(item => item.reportId === id)
        resolve({ ...this.reports[index], items })
      }, 300)
    })
  }

  async deleteReport(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.reports.findIndex(r => r.id === id)
        if (index === -1) {
          reject(new Error('Report not found'))
          return
        }

        this.reports.splice(index, 1)
        // Delete associated items
        this.reportItems = this.reportItems.filter(item => item.reportId !== id)
        resolve()
      }, 200)
    })
  }

  async getStatistics(filters?: ReportFilters): Promise<ReportStatistics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.reports]

        if (filters?.targetType) {
          filtered = filtered.filter(r => r.targetType === filters.targetType)
        }

        if (filters?.targetId) {
          filtered = filtered.filter(r => r.targetId === filters.targetId)
        }

        // Reports by type
        const typeMap = new Map<string, number>()
        filtered.forEach(report => {
          typeMap.set(report.targetType, (typeMap.get(report.targetType) || 0) + 1)
        })
        const reportsByType = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }))

        // Reports by month (last 6 months)
        const monthMap = new Map<string, number>()
        filtered.forEach(report => {
          const month = new Date(report.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          monthMap.set(month, (monthMap.get(month) || 0) + 1)
        })
        const reportsByMonth = Array.from(monthMap.entries()).map(([month, count]) => ({ month, count }))

        // Recent reports (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentReports = filtered.filter(r => new Date(r.submittedAt) >= thirtyDaysAgo).length

        resolve({
          totalReports: filtered.length,
          reportsByType,
          reportsByMonth,
          recentReports
        })
      }, 200)
    })
  }
}

export const reportService = new ReportService()
