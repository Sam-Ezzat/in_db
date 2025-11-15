import { BaseService } from './base/BaseService'

export interface Evaluation {
  id: string
  tenantId?: string
  title: string
  description: string
  type: 'Program' | 'Event' | 'Service' | 'Ministry' | 'Leadership'
  status: 'Active' | 'Draft' | 'Completed' | 'Archived'
  category: string
  targetAudience: string
  questions: Question[]
  responses: Response[]
  createdDate: Date
  deadline?: Date
  createdBy: string
  updatedAt: Date
}

export interface Question {
  id: string
  evaluationId: string
  type: 'multiple_choice' | 'rating' | 'text' | 'yes_no' | 'scale'
  text: string
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  order: number
}

export interface Response {
  id: string
  evaluationId: string
  respondentId: string
  respondentName: string
  respondentEmail?: string
  answers: Answer[]
  submittedAt: Date
  ipAddress?: string
  isAnonymous: boolean
}

export interface Answer {
  questionId: string
  value: string | number | boolean
  textValue?: string
}

export interface EvaluationFilters {
  type?: 'Program' | 'Event' | 'Service' | 'Ministry' | 'Leadership'
  status?: 'Active' | 'Draft' | 'Completed' | 'Archived'
  category?: string
  search?: string
  tenantId?: string
}

export interface EvaluationStatistics {
  total: number
  active: number
  completed: number
  draft: number
  totalResponses: number
  averageRating: number
  responsesByType: { type: string; count: number }[]
  recentResponses: number
}

class EvaluationService extends BaseService {
  private evaluations: Evaluation[] = []
  private questions: Question[] = []
  private responses: Response[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  private initializeMockData() {
    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Mock Evaluations
    this.evaluations = [
      {
        id: 'eval-1',
        tenantId: 'tenant-1',
        title: 'Sunday Service Experience',
        description: 'Weekly evaluation of Sunday worship service experience and feedback',
        type: 'Service',
        status: 'Active',
        category: 'Worship',
        targetAudience: 'All Congregants',
        questions: [],
        responses: [],
        createdDate: twoMonthsAgo,
        deadline: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        createdBy: 'user-1',
        updatedAt: now
      },
      {
        id: 'eval-2',
        tenantId: 'tenant-1',
        title: 'Youth Ministry Program Assessment',
        description: 'Quarterly evaluation of youth ministry programs and activities',
        type: 'Program',
        status: 'Active',
        category: 'Youth Ministry',
        targetAudience: 'Youth & Parents',
        questions: [],
        responses: [],
        createdDate: twoMonthsAgo,
        deadline: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        createdBy: 'user-1',
        updatedAt: now
      },
      {
        id: 'eval-3',
        tenantId: 'tenant-1',
        title: 'Leadership Training Effectiveness',
        description: 'Assessment of leadership development program effectiveness',
        type: 'Leadership',
        status: 'Completed',
        category: 'Leadership Development',
        targetAudience: 'Ministry Leaders',
        questions: [],
        responses: [],
        createdDate: twoMonthsAgo,
        createdBy: 'user-1',
        updatedAt: oneMonthAgo
      },
      {
        id: 'eval-4',
        tenantId: 'tenant-1',
        title: 'Small Groups Effectiveness',
        description: 'Evaluation of small group ministry impact and satisfaction',
        type: 'Ministry',
        status: 'Draft',
        category: 'Discipleship',
        targetAudience: 'Small Group Members',
        questions: [],
        responses: [],
        createdDate: oneMonthAgo,
        deadline: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
        createdBy: 'user-1',
        updatedAt: oneMonthAgo
      },
      {
        id: 'eval-5',
        tenantId: 'tenant-1',
        title: 'Christmas Service Feedback',
        description: 'Special evaluation for Christmas service experience',
        type: 'Event',
        status: 'Completed',
        category: 'Special Events',
        targetAudience: 'All Attendees',
        questions: [],
        responses: [],
        createdDate: new Date(now.getFullYear() - 1, 11, 26),
        createdBy: 'user-1',
        updatedAt: new Date(now.getFullYear() - 1, 11, 27)
      }
    ]

    // Mock Questions
    this.questions = [
      {
        id: 'q-1',
        evaluationId: 'eval-1',
        type: 'rating',
        text: 'How would you rate the overall worship experience?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        order: 1
      },
      {
        id: 'q-2',
        evaluationId: 'eval-1',
        type: 'multiple_choice',
        text: 'Which part of the service was most meaningful to you?',
        required: true,
        options: ['Worship Music', 'Sermon', 'Prayer Time', 'Fellowship', 'Communion'],
        order: 2
      },
      {
        id: 'q-3',
        evaluationId: 'eval-1',
        type: 'text',
        text: 'What suggestions do you have for improvement?',
        required: false,
        order: 3
      },
      {
        id: 'q-4',
        evaluationId: 'eval-2',
        type: 'rating',
        text: 'How engaging are the youth programs?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        order: 1
      },
      {
        id: 'q-5',
        evaluationId: 'eval-2',
        type: 'yes_no',
        text: 'Would you recommend these programs to others?',
        required: true,
        order: 2
      }
    ]

    // Mock Responses
    this.responses = [
      {
        id: 'resp-1',
        evaluationId: 'eval-1',
        respondentId: 'person-1',
        respondentName: 'John Doe',
        respondentEmail: 'john@example.com',
        answers: [
          { questionId: 'q-1', value: 5 },
          { questionId: 'q-2', value: 'Sermon' },
          { questionId: 'q-3', value: 'Great service, keep it up!', textValue: 'Great service, keep it up!' }
        ],
        submittedAt: oneMonthAgo,
        isAnonymous: false
      },
      {
        id: 'resp-2',
        evaluationId: 'eval-1',
        respondentId: 'person-2',
        respondentName: 'Jane Smith',
        answers: [
          { questionId: 'q-1', value: 4 },
          { questionId: 'q-2', value: 'Worship Music' }
        ],
        submittedAt: oneMonthAgo,
        isAnonymous: false
      }
    ]
  }

  // Evaluation CRUD
  async getEvaluations(filters?: EvaluationFilters): Promise<Evaluation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.evaluations]

        if (filters?.type) {
          filtered = filtered.filter(e => e.type === filters.type)
        }

        if (filters?.status) {
          filtered = filtered.filter(e => e.status === filters.status)
        }

        if (filters?.category) {
          filtered = filtered.filter(e => e.category === filters.category)
        }

        if (filters?.search) {
          const search = filters.search.toLowerCase()
          filtered = filtered.filter(e =>
            e.title.toLowerCase().includes(search) ||
            e.description.toLowerCase().includes(search) ||
            e.category.toLowerCase().includes(search)
          )
        }

        // Populate questions and response counts
        const withDetails = filtered.map(evaluation => ({
          ...evaluation,
          questions: this.questions.filter(q => q.evaluationId === evaluation.id),
          responses: this.responses.filter(r => r.evaluationId === evaluation.id)
        }))

        resolve(withDetails.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()))
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

        const questions = this.questions.filter(q => q.evaluationId === id)
        const responses = this.responses.filter(r => r.evaluationId === id)

        resolve({
          ...evaluation,
          questions,
          responses
        })
      }, 200)
    })
  }

  async createEvaluation(data: Partial<Evaluation>): Promise<Evaluation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvaluation: Evaluation = {
          id: `eval-${Date.now()}`,
          tenantId: data.tenantId,
          title: data.title!,
          description: data.description || '',
          type: data.type!,
          status: data.status || 'Draft',
          category: data.category!,
          targetAudience: data.targetAudience!,
          questions: [],
          responses: [],
          createdDate: new Date(),
          deadline: data.deadline,
          createdBy: data.createdBy || 'current-user',
          updatedAt: new Date()
        }

        this.evaluations.unshift(newEvaluation)
        resolve(newEvaluation)
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

        const questions = this.questions.filter(q => q.evaluationId === id)
        const responses = this.responses.filter(r => r.evaluationId === id)

        resolve({
          ...this.evaluations[index],
          questions,
          responses
        })
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
        // Delete associated questions and responses
        this.questions = this.questions.filter(q => q.evaluationId !== id)
        this.responses = this.responses.filter(r => r.evaluationId !== id)
        resolve()
      }, 200)
    })
  }

  // Question CRUD
  async createQuestion(evaluationId: string, data: Partial<Question>): Promise<Question> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuestion: Question = {
          id: `q-${Date.now()}`,
          evaluationId,
          type: data.type!,
          text: data.text!,
          required: data.required || false,
          options: data.options,
          scaleMin: data.scaleMin,
          scaleMax: data.scaleMax,
          order: data.order || this.questions.filter(q => q.evaluationId === evaluationId).length + 1
        }

        this.questions.push(newQuestion)
        resolve(newQuestion)
      }, 200)
    })
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.questions.findIndex(q => q.id === id)
        if (index === -1) {
          reject(new Error('Question not found'))
          return
        }

        this.questions[index] = {
          ...this.questions[index],
          ...updates,
          id
        }

        resolve(this.questions[index])
      }, 200)
    })
  }

  async deleteQuestion(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.questions.findIndex(q => q.id === id)
        if (index === -1) {
          reject(new Error('Question not found'))
          return
        }

        this.questions.splice(index, 1)
        resolve()
      }, 200)
    })
  }

  // Response CRUD
  async submitResponse(data: Partial<Response>): Promise<Response> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResponse: Response = {
          id: `resp-${Date.now()}`,
          evaluationId: data.evaluationId!,
          respondentId: data.respondentId!,
          respondentName: data.respondentName!,
          respondentEmail: data.respondentEmail,
          answers: data.answers || [],
          submittedAt: new Date(),
          ipAddress: data.ipAddress,
          isAnonymous: data.isAnonymous || false
        }

        this.responses.push(newResponse)
        resolve(newResponse)
      }, 300)
    })
  }

  async getResponses(evaluationId: string): Promise<Response[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = this.responses.filter(r => r.evaluationId === evaluationId)
        resolve(responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()))
      }, 200)
    })
  }

  async deleteResponse(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.responses.findIndex(r => r.id === id)
        if (index === -1) {
          reject(new Error('Response not found'))
          return
        }

        this.responses.splice(index, 1)
        resolve()
      }, 200)
    })
  }

  // Statistics
  async getStatistics(filters?: EvaluationFilters): Promise<EvaluationStatistics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let evaluations = [...this.evaluations]

        if (filters?.type) {
          evaluations = evaluations.filter(e => e.type === filters.type)
        }

        if (filters?.status) {
          evaluations = evaluations.filter(e => e.status === filters.status)
        }

        // Calculate statistics
        const total = evaluations.length
        const active = evaluations.filter(e => e.status === 'Active').length
        const completed = evaluations.filter(e => e.status === 'Completed').length
        const draft = evaluations.filter(e => e.status === 'Draft').length

        const totalResponses = evaluations.reduce((sum, e) => {
          const evalResponses = this.responses.filter(r => r.evaluationId === e.id)
          return sum + evalResponses.length
        }, 0)

        // Calculate average rating from all rating questions
        let totalRatings = 0
        let ratingCount = 0
        this.responses.forEach(response => {
          response.answers.forEach(answer => {
            const question = this.questions.find(q => q.id === answer.questionId)
            if (question?.type === 'rating' && typeof answer.value === 'number') {
              totalRatings += answer.value
              ratingCount++
            }
          })
        })
        const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0

        // Responses by type
        const typeMap = new Map<string, number>()
        evaluations.forEach(evaluation => {
          const count = this.responses.filter(r => r.evaluationId === evaluation.id).length
          typeMap.set(evaluation.type, (typeMap.get(evaluation.type) || 0) + count)
        })
        const responsesByType = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }))

        // Recent responses (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentResponses = this.responses.filter(r => new Date(r.submittedAt) >= thirtyDaysAgo).length

        resolve({
          total,
          active,
          completed,
          draft,
          totalResponses,
          averageRating: Math.round(averageRating * 100) / 100,
          responsesByType,
          recentResponses
        })
      }, 200)
    })
  }
}

export const evaluationService = new EvaluationService()
