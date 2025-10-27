// Financial management service for donations, expenses, budgets, and reporting
export interface Donation {
  id: string
  amount: number
  currency: string
  donorId?: string
  donorName: string
  donorEmail?: string
  donorPhone?: string
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online' | 'other'
  category: 'tithe' | 'offering' | 'building_fund' | 'missions' | 'special_project' | 'other'
  purpose?: string
  notes?: string
  date: Date
  receivedBy: string
  churchId: string
  isRecurring: boolean
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  nextDonationDate?: Date
  taxDeductible: boolean
  receiptNumber?: string
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  amount: number
  currency: string
  vendor: string
  vendorContact?: string
  category: 'utilities' | 'maintenance' | 'supplies' | 'staff' | 'ministries' | 'events' | 'missions' | 'other'
  subcategory?: string
  description: string
  date: Date
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online'
  checkNumber?: string
  invoiceNumber?: string
  approvedBy: string
  paidBy: string
  churchId: string
  budgetCategoryId?: string
  isRecurring: boolean
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  nextPaymentDate?: Date
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  receiptUrl?: string
  attachments: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  name: string
  description?: string
  fiscalYear: number
  startDate: Date
  endDate: Date
  churchId: string
  categories: BudgetCategory[]
  totalBudget: number
  totalAllocated: number
  totalSpent: number
  totalRemaining: number
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BudgetCategory {
  id: string
  name: string
  description?: string
  budgetedAmount: number
  spentAmount: number
  remainingAmount: number
  percentUsed: number
  parentCategoryId?: string
  subcategories: BudgetCategory[]
  expenses: string[] // expense IDs
  isActive: boolean
}

export interface FinancialReport {
  id: string
  title: string
  type: 'income' | 'expense' | 'budget_vs_actual' | 'donor_summary' | 'category_analysis' | 'custom'
  period: {
    startDate: Date
    endDate: Date
    type: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  }
  churchId: string
  data: any
  generatedBy: string
  generatedAt: Date
  format: 'json' | 'pdf' | 'excel' | 'csv'
  status: 'generating' | 'completed' | 'failed'
  downloadUrl?: string
}

export interface FinancialSummary {
  totalDonations: number
  totalExpenses: number
  netIncome: number
  budgetVariance: number
  donationsThisMonth: number
  expensesThisMonth: number
  topDonationCategories: { category: string; amount: number; percentage: number }[]
  topExpenseCategories: { category: string; amount: number; percentage: number }[]
  monthlyTrends: { month: string; donations: number; expenses: number; net: number }[]
  donorCount: number
  averageDonation: number
  recurringDonorCount: number
}

class FinancialService {
  private donations: Donation[] = []
  private expenses: Expense[] = []
  private budgets: Budget[] = []
  private reports: FinancialReport[] = []

  // Donation methods
  async getDonations(filters?: {
    startDate?: Date
    endDate?: Date
    category?: string
    method?: string
    donorId?: string
    churchId?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ donations: Donation[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = [...this.donations]

      if (filters) {
        if (filters.startDate) {
          filtered = filtered.filter(d => new Date(d.date) >= filters.startDate!)
        }
        if (filters.endDate) {
          filtered = filtered.filter(d => new Date(d.date) <= filters.endDate!)
        }
        if (filters.category) {
          filtered = filtered.filter(d => d.category === filters.category)
        }
        if (filters.method) {
          filtered = filtered.filter(d => d.method === filters.method)
        }
        if (filters.donorId) {
          filtered = filtered.filter(d => d.donorId === filters.donorId)
        }
        if (filters.churchId) {
          filtered = filtered.filter(d => d.churchId === filters.churchId)
        }
        if (filters.status) {
          filtered = filtered.filter(d => d.status === filters.status)
        }
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const total = filtered.length
      const offset = filters?.offset || 0
      const limit = filters?.limit || 50

      const donations = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ donations, total }), 100)
    })
  }

  async createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> {
    return new Promise((resolve) => {
      const newDonation: Donation = {
        ...donation,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.donations.unshift(newDonation)
      setTimeout(() => resolve(newDonation), 100)
    })
  }

  async updateDonation(id: string, updates: Partial<Donation>): Promise<Donation> {
    return new Promise((resolve, reject) => {
      const donation = this.donations.find(d => d.id === id)
      if (!donation) {
        setTimeout(() => reject(new Error('Donation not found')), 50)
        return
      }

      Object.assign(donation, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(donation), 100)
    })
  }

  async deleteDonation(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.donations = this.donations.filter(d => d.id !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Expense methods
  async getExpenses(filters?: {
    startDate?: Date
    endDate?: Date
    category?: string
    vendor?: string
    churchId?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ expenses: Expense[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = [...this.expenses]

      if (filters) {
        if (filters.startDate) {
          filtered = filtered.filter(e => new Date(e.date) >= filters.startDate!)
        }
        if (filters.endDate) {
          filtered = filtered.filter(e => new Date(e.date) <= filters.endDate!)
        }
        if (filters.category) {
          filtered = filtered.filter(e => e.category === filters.category)
        }
        if (filters.vendor) {
          filtered = filtered.filter(e => e.vendor.toLowerCase().includes(filters.vendor!.toLowerCase()))
        }
        if (filters.churchId) {
          filtered = filtered.filter(e => e.churchId === filters.churchId)
        }
        if (filters.status) {
          filtered = filtered.filter(e => e.status === filters.status)
        }
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const total = filtered.length
      const offset = filters?.offset || 0
      const limit = filters?.limit || 50

      const expenses = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ expenses, total }), 100)
    })
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return new Promise((resolve) => {
      const newExpense: Expense = {
        ...expense,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.expenses.unshift(newExpense)
      setTimeout(() => resolve(newExpense), 100)
    })
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    return new Promise((resolve, reject) => {
      const expense = this.expenses.find(e => e.id === id)
      if (!expense) {
        setTimeout(() => reject(new Error('Expense not found')), 50)
        return
      }

      Object.assign(expense, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(expense), 100)
    })
  }

  async deleteExpense(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.expenses = this.expenses.filter(e => e.id !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Budget methods
  async getBudgets(churchId?: string): Promise<Budget[]> {
    return new Promise((resolve) => {
      let filtered = [...this.budgets]
      if (churchId) {
        filtered = filtered.filter(b => b.churchId === churchId)
      }
      
      // Sort by fiscal year (newest first)
      filtered.sort((a, b) => b.fiscalYear - a.fiscalYear)
      
      setTimeout(() => resolve(filtered), 100)
    })
  }

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'totalAllocated' | 'totalSpent' | 'totalRemaining'>): Promise<Budget> {
    return new Promise((resolve) => {
      const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
      
      const newBudget: Budget = {
        ...budget,
        id: this.generateId(),
        totalAllocated,
        totalSpent: 0,
        totalRemaining: totalAllocated,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.budgets.unshift(newBudget)
      setTimeout(() => resolve(newBudget), 100)
    })
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    return new Promise((resolve, reject) => {
      const budget = this.budgets.find(b => b.id === id)
      if (!budget) {
        setTimeout(() => reject(new Error('Budget not found')), 50)
        return
      }

      Object.assign(budget, updates, { updatedAt: new Date() })
      
      // Recalculate totals if categories changed
      if (updates.categories) {
        budget.totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
        budget.totalRemaining = budget.totalAllocated - budget.totalSpent
      }

      setTimeout(() => resolve(budget), 100)
    })
  }

  async deleteBudget(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.budgets = this.budgets.filter(b => b.id !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Financial summary and reporting
  async getFinancialSummary(churchId: string, period?: { startDate: Date; endDate: Date }): Promise<FinancialSummary> {
    return new Promise((resolve) => {
      const now = new Date()
      const startDate = period?.startDate || new Date(now.getFullYear(), 0, 1) // Start of year
      const endDate = period?.endDate || now

      // Filter donations and expenses by period and church
      const periodDonations = this.donations.filter(d => 
        d.churchId === churchId && 
        new Date(d.date) >= startDate && 
        new Date(d.date) <= endDate &&
        d.status === 'completed'
      )
      
      const periodExpenses = this.expenses.filter(e => 
        e.churchId === churchId && 
        new Date(e.date) >= startDate && 
        new Date(e.date) <= endDate &&
        e.status === 'paid'
      )

      // Calculate totals
      const totalDonations = periodDonations.reduce((sum, d) => sum + d.amount, 0)
      const totalExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0)
      const netIncome = totalDonations - totalExpenses

      // This month calculations
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisMonthDonations = periodDonations
        .filter(d => new Date(d.date) >= thisMonthStart)
        .reduce((sum, d) => sum + d.amount, 0)
      const thisMonthExpenses = periodExpenses
        .filter(e => new Date(e.date) >= thisMonthStart)
        .reduce((sum, e) => sum + e.amount, 0)

      // Category analysis
      const donationsByCategory = this.groupByCategory(periodDonations, 'category', 'amount')
      const expensesByCategory = this.groupByCategory(periodExpenses, 'category', 'amount')

      // Donor statistics
      const uniqueDonors = new Set(periodDonations.map(d => d.donorId).filter(Boolean))
      const donorCount = uniqueDonors.size
      const averageDonation = donorCount > 0 ? totalDonations / periodDonations.length : 0
      const recurringDonorCount = periodDonations.filter(d => d.isRecurring).length

      // Monthly trends (last 12 months)
      const monthlyTrends = this.generateMonthlyTrends(churchId, 12)

      const summary: FinancialSummary = {
        totalDonations,
        totalExpenses,
        netIncome,
        budgetVariance: 0, // Calculate based on active budget
        donationsThisMonth: thisMonthDonations,
        expensesThisMonth: thisMonthExpenses,
        topDonationCategories: donationsByCategory,
        topExpenseCategories: expensesByCategory,
        monthlyTrends,
        donorCount,
        averageDonation,
        recurringDonorCount
      }

      setTimeout(() => resolve(summary), 150)
    })
  }

  async generateReport(type: FinancialReport['type'], period: FinancialReport['period'], churchId: string): Promise<FinancialReport> {
    return new Promise((resolve) => {
      const report: FinancialReport = {
        id: this.generateId(),
        title: this.getReportTitle(type, period),
        type,
        period,
        churchId,
        data: this.generateReportData(type, period, churchId),
        generatedBy: 'current-user',
        generatedAt: new Date(),
        format: 'json',
        status: 'completed'
      }

      this.reports.unshift(report)
      setTimeout(() => resolve(report), 200)
    })
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private groupByCategory(items: any[], categoryField: string, amountField: string) {
    const grouped = items.reduce((acc, item) => {
      const category = item[categoryField]
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += item[amountField]
      return acc
    }, {})

    const total = Object.values(grouped).reduce((sum: number, amount: any) => sum + amount, 0)
    
    return Object.entries(grouped)
      .map(([category, amount]: [string, any]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  private generateMonthlyTrends(churchId: string, months: number) {
    const trends = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthDonations = this.donations
        .filter(d => d.churchId === churchId && d.status === 'completed')
        .filter(d => new Date(d.date) >= date && new Date(d.date) < nextMonth)
        .reduce((sum, d) => sum + d.amount, 0)

      const monthExpenses = this.expenses
        .filter(e => e.churchId === churchId && e.status === 'paid')
        .filter(e => new Date(e.date) >= date && new Date(e.date) < nextMonth)
        .reduce((sum, e) => sum + e.amount, 0)

      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        donations: monthDonations,
        expenses: monthExpenses,
        net: monthDonations - monthExpenses
      })
    }

    return trends
  }

  private getReportTitle(type: string, period: any): string {
    const periodStr = `${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()}`
    switch (type) {
      case 'income': return `Income Report (${periodStr})`
      case 'expense': return `Expense Report (${periodStr})`
      case 'budget_vs_actual': return `Budget vs Actual Report (${periodStr})`
      case 'donor_summary': return `Donor Summary Report (${periodStr})`
      case 'category_analysis': return `Category Analysis Report (${periodStr})`
      default: return `Financial Report (${periodStr})`
    }
  }

  private generateReportData(type: string, period: any, churchId: string) {
    // Generate mock report data based on type
    return {
      type,
      period,
      churchId,
      generatedAt: new Date(),
      summary: 'Mock report data would be generated here'
    }
  }
}

// Initialize service with mock data
const service = new FinancialService()

// Mock donations
const mockDonations: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    amount: 500.00,
    currency: 'USD',
    donorName: 'John Smith',
    donorEmail: 'john.smith@email.com',
    method: 'online',
    category: 'tithe',
    date: new Date('2024-10-27'),
    receivedBy: 'admin_001',
    churchId: '1',
    isRecurring: true,
    recurringFrequency: 'monthly',
    nextDonationDate: new Date('2024-11-27'),
    taxDeductible: true,
    receiptNumber: 'RCP-2024-001',
    status: 'completed',
    tags: ['monthly', 'online']
  },
  {
    amount: 1000.00,
    currency: 'USD',
    donorName: 'Sarah Johnson',
    donorEmail: 'sarah.johnson@email.com',
    method: 'check',
    category: 'building_fund',
    purpose: 'New sanctuary construction',
    date: new Date('2024-10-25'),
    receivedBy: 'admin_001',
    churchId: '1',
    isRecurring: false,
    taxDeductible: true,
    receiptNumber: 'RCP-2024-002',
    status: 'completed',
    tags: ['building', 'special']
  },
  {
    amount: 250.00,
    currency: 'USD',
    donorName: 'Michael Brown',
    method: 'cash',
    category: 'offering',
    date: new Date('2024-10-26'),
    receivedBy: 'pastor_001',
    churchId: '1',
    isRecurring: false,
    taxDeductible: true,
    status: 'completed',
    tags: ['sunday', 'cash']
  }
]

// Mock expenses
const mockExpenses: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    amount: 800.00,
    currency: 'USD',
    vendor: 'City Electric Company',
    vendorContact: 'billing@cityelectric.com',
    category: 'utilities',
    subcategory: 'electricity',
    description: 'Monthly electricity bill',
    date: new Date('2024-10-20'),
    paymentMethod: 'bank_transfer',
    approvedBy: 'admin_001',
    paidBy: 'admin_001',
    churchId: '1',
    isRecurring: true,
    recurringFrequency: 'monthly',
    nextPaymentDate: new Date('2024-11-20'),
    status: 'paid',
    attachments: [],
    tags: ['utilities', 'monthly']
  },
  {
    amount: 150.00,
    currency: 'USD',
    vendor: 'Office Supply Store',
    category: 'supplies',
    subcategory: 'office',
    description: 'Printer paper, pens, and folders',
    date: new Date('2024-10-22'),
    paymentMethod: 'credit_card',
    invoiceNumber: 'INV-2024-456',
    approvedBy: 'admin_001',
    paidBy: 'admin_001',
    churchId: '1',
    isRecurring: false,
    status: 'paid',
    attachments: [],
    tags: ['supplies', 'office']
  }
]

// Add mock data
mockDonations.forEach(donation => {
  service.createDonation(donation)
})

mockExpenses.forEach(expense => {
  service.createExpense(expense)
})

export const financialService = service
export default financialService