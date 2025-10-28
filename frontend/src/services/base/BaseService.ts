export abstract class BaseService {
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  protected formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  protected formatDateTime(date: Date): string {
    return date.toISOString()
  }

  protected parseDate(dateString: string): Date {
    return new Date(dateString)
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  protected sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ')
  }

  protected paginate<T>(items: T[], page: number, limit: number): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = items.slice(startIndex, endIndex)
    
    return {
      data,
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit)
    }
  }

  protected sortBy<T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return items.sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  }

  protected filterByDateRange<T extends { [K in keyof T]: T[K] }>(
    items: T[], 
    dateKey: keyof T, 
    startDate?: Date, 
    endDate?: Date
  ): T[] {
    return items.filter(item => {
      const itemDate = item[dateKey] as unknown as Date
      if (!itemDate) return false
      
      if (startDate && itemDate < startDate) return false
      if (endDate && itemDate > endDate) return false
      
      return true
    })
  }
}