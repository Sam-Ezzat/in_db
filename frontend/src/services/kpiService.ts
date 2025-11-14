import { BaseService } from './base/BaseService'

export interface KPI {
  id: string
  tenantId?: string
  code: string
  name: string
  description?: string
  category?: string
  unit?: string // e.g., '%', 'count', 'hours'
  targetValue?: number
  createdAt: Date
  updatedAt: Date
}

export interface Evaluation {
  id: string
  kpiId: string
  kpi?: KPI
  targetType: 'church' | 'committee' | 'team' | 'group' | 'person'
  targetId: string
  targetName?: string
  periodStart: Date
  periodEnd: Date
  score: number
  actualValue?: number
  targetValue?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface KPIFilters {
  category?: string
  search?: string
  tenantId?: string
}

export interface EvaluationFilters {
  kpiId?: string
  targetType?: 'church' | 'committee' | 'team' | 'group' | 'person'
  targetId?: string
  periodStart?: Date
  periodEnd?: Date
  search?: string
  tenantId?: string
}

export interface KPIStatistics {
  totalKPIs: number
  totalEvaluations: number
  averageScore: number
  kpisByCategory: { category: string; count: number }[]
  recentEvaluations: number
}

class KPIService extends BaseService {
  private kpis: KPI[] = []
  private evaluations: Evaluation[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  private initializeMockData() {
    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Mock KPIs
    this.kpis = [
      {
        id: 'kpi-1',
        code: 'ATTENDANCE_RATE',
        name: 'Attendance Rate',
        description: 'Percentage of members attending events',
        category: 'Attendance',
        unit: '%',
        targetValue: 80,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      },
      {
        id: 'kpi-2',
        code: 'ENGAGEMENT_GROWTH',
        name: 'Engagement Growth',
        description: 'Month-over-month growth in active members',
        category: 'Growth',
        unit: '%',
        targetValue: 5,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      },
      {
        id: 'kpi-3',
        code: 'REPORT_TIMELINESS',
        name: 'Report Timeliness',
        description: 'Percentage of reports submitted on time',
        category: 'Compliance',
        unit: '%',
        targetValue: 90,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      },
      {
        id: 'kpi-4',
        code: 'VOLUNTEER_HOURS',
        name: 'Volunteer Hours',
        description: 'Total volunteer hours contributed',
        category: 'Service',
        unit: 'hours',
        targetValue: 100,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      },
      {
        id: 'kpi-5',
        code: 'DISCIPLESHIP_PROGRESS',
        name: 'Discipleship Progress',
        description: 'Average completion rate of discipleship programs',
        category: 'Spiritual Growth',
        unit: '%',
        targetValue: 75,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      }
    ]

    // Mock Evaluations
    this.evaluations = [
      {
        id: 'eval-1',
        kpiId: 'kpi-1',
        targetType: 'team',
        targetId: 'team-1',
        targetName: 'Worship Team',
        periodStart: oneMonthAgo,
        periodEnd: now,
        score: 85,
        actualValue: 85,
        targetValue: 80,
        notes: 'Exceeded target. Good attendance overall.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'eval-2',
        kpiId: 'kpi-2',
        targetType: 'team',
        targetId: 'team-1',
        targetName: 'Worship Team',
        periodStart: oneMonthAgo,
        periodEnd: now,
        score: 7,
        actualValue: 7,
        targetValue: 5,
        notes: 'Strong growth this month with 3 new active members.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'eval-3',
        kpiId: 'kpi-3',
        targetType: 'committee',
        targetId: 'committee-1',
        targetName: 'Youth Committee',
        periodStart: oneMonthAgo,
        periodEnd: now,
        score: 95,
        actualValue: 95,
        targetValue: 90,
        notes: 'All reports submitted on time.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'eval-4',
        kpiId: 'kpi-4',
        targetType: 'team',
        targetId: 'team-2',
        targetName: 'Media Team',
        periodStart: oneMonthAgo,
        periodEnd: now,
        score: 120,
        actualValue: 120,
        targetValue: 100,
        notes: 'Exceeded expectations with extra service hours.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'eval-5',
        kpiId: 'kpi-5',
        targetType: 'group',
        targetId: 'group-1',
        targetName: 'Bible Study Group',
        periodStart: oneMonthAgo,
        periodEnd: now,
        score: 78,
        actualValue: 78,
        targetValue: 75,
        notes: 'Good progress on discipleship curriculum.',
        createdAt: now,
        updatedAt: now
      }
    ]
  }

  // KPI CRUD Operations
  async getKPIs(filters?: KPIFilters): Promise<KPI[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.kpis]

        if (filters?.category) {
          filtered = filtered.filter(k => k.category === filters.category)
        }

        if (filters?.search) {
          const search = filters.search.toLowerCase()
          filtered = filtered.filter(k =>
            k.name.toLowerCase().includes(search) ||
            k.code.toLowerCase().includes(search) ||
            k.description?.toLowerCase().includes(search)
          )
        }

        filtered.sort((a, b) => a.name.localeCompare(b.name))
        resolve(filtered)
      }, 300)
    })
  }

  async getKPIById(id: string): Promise<KPI | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const kpi = this.kpis.find(k => k.id === id)
        resolve(kpi || null)
      }, 200)
    })
  }

  async createKPI(data: Partial<KPI>): Promise<KPI> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newKPI: KPI = {
          id: `kpi-${Date.now()}`,
          tenantId: data.tenantId,
          code: data.code!,
          name: data.name!,
          description: data.description,
          category: data.category,
          unit: data.unit,
          targetValue: data.targetValue,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        this.kpis.unshift(newKPI)
        resolve(newKPI)
      }, 300)
    })
  }

  async updateKPI(id: string, updates: Partial<KPI>): Promise<KPI> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.kpis.findIndex(k => k.id === id)
        if (index === -1) {
          reject(new Error('KPI not found'))
          return
        }

        this.kpis[index] = {
          ...this.kpis[index],
          ...updates,
          id,
          updatedAt: new Date()
        }

        resolve(this.kpis[index])
      }, 300)
    })
  }

  async deleteKPI(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.kpis.findIndex(k => k.id === id)
        if (index === -1) {
          reject(new Error('KPI not found'))
          return
        }

        this.kpis.splice(index, 1)
        // Delete associated evaluations
        this.evaluations = this.evaluations.filter(e => e.kpiId !== id)
        resolve()
      }, 200)
    })
  }

  // Evaluation CRUD Operations
  async getEvaluations(filters?: EvaluationFilters): Promise<Evaluation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.evaluations]

        if (filters?.kpiId) {
          filtered = filtered.filter(e => e.kpiId === filters.kpiId)
        }

        if (filters?.targetType) {
          filtered = filtered.filter(e => e.targetType === filters.targetType)
        }

        if (filters?.targetId) {
          filtered = filtered.filter(e => e.targetId === filters.targetId)
        }

        if (filters?.periodStart) {
          filtered = filtered.filter(e => new Date(e.periodEnd) >= filters.periodStart!)
        }

        if (filters?.periodEnd) {
          filtered = filtered.filter(e => new Date(e.periodStart) <= filters.periodEnd!)
        }

        if (filters?.search) {
          const search = filters.search.toLowerCase()
          filtered = filtered.filter(e =>
            e.targetName?.toLowerCase().includes(search) ||
            e.notes?.toLowerCase().includes(search)
          )
        }

        // Sort by period end (newest first)
        filtered.sort((a, b) => new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime())

        // Populate KPI data
        const withKPI = filtered.map(evaluation => ({
          ...evaluation,
          kpi: this.kpis.find(k => k.id === evaluation.kpiId)
        }))

        resolve(withKPI)
      }, 300)
    })
  }

  async getEvaluationById(id: string): Promise<Evaluation | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluation = this.evaluations.find(e => e.id === id)
        if (!evaluation) {
          resolve(null)
          return
        }

        const kpi = this.kpis.find(k => k.id === evaluation.kpiId)
        resolve({ ...evaluation, kpi })
      }, 200)
    })
  }

  async createEvaluation(data: Partial<Evaluation>): Promise<Evaluation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvaluation: Evaluation = {
          id: `eval-${Date.now()}`,
          kpiId: data.kpiId!,
          targetType: data.targetType!,
          targetId: data.targetId!,
          targetName: data.targetName,
          periodStart: data.periodStart!,
          periodEnd: data.periodEnd!,
          score: data.score!,
          actualValue: data.actualValue,
          targetValue: data.targetValue,
          notes: data.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const kpi = this.kpis.find(k => k.id === data.kpiId)
        this.evaluations.unshift(newEvaluation)
        resolve({ ...newEvaluation, kpi })
      }, 300)
    })
  }

  async updateEvaluation(id: string, updates: Partial<Evaluation>): Promise<Evaluation> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.evaluations.findIndex(e => e.id === id)
        if (index === -1) {
          reject(new Error('Evaluation not found'))
          return
        }

        this.evaluations[index] = {
          ...this.evaluations[index],
          ...updates,
          id,
          updatedAt: new Date()
        }

        const kpi = this.kpis.find(k => k.id === this.evaluations[index].kpiId)
        resolve({ ...this.evaluations[index], kpi })
      }, 300)
    })
  }

  async deleteEvaluation(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.evaluations.findIndex(e => e.id === id)
        if (index === -1) {
          reject(new Error('Evaluation not found'))
          return
        }

        this.evaluations.splice(index, 1)
        resolve()
      }, 200)
    })
  }

  async getStatistics(filters?: EvaluationFilters): Promise<KPIStatistics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let evaluations = [...this.evaluations]

        if (filters?.targetType) {
          evaluations = evaluations.filter(e => e.targetType === filters.targetType)
        }

        if (filters?.targetId) {
          evaluations = evaluations.filter(e => e.targetId === filters.targetId)
        }

        // KPIs by category
        const categoryMap = new Map<string, number>()
        this.kpis.forEach(kpi => {
          const category = kpi.category || 'Uncategorized'
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
        })
        const kpisByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))

        // Average score
        const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
        const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0

        // Recent evaluations (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentEvaluations = evaluations.filter(e => new Date(e.createdAt) >= thirtyDaysAgo).length

        resolve({
          totalKPIs: this.kpis.length,
          totalEvaluations: evaluations.length,
          averageScore: Math.round(averageScore * 100) / 100,
          kpisByCategory,
          recentEvaluations
        })
      }, 200)
    })
  }
}

export const kpiService = new KPIService()
