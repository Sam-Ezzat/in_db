// Notification service for handling all notification operations
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'general' | 'event' | 'member' | 'financial' | 'system' | 'ministry'
  recipientType: 'individual' | 'group' | 'church' | 'all'
  recipientIds: string[]
  senderId: string
  senderName: string
  channels: ('app' | 'email' | 'sms' | 'push')[]
  scheduledFor?: Date
  sentAt?: Date
  readBy: string[]
  isRead: boolean
  isArchived: boolean
  attachments?: {
    id: string
    name: string
    url: string
    type: string
  }[]
  actions?: {
    id: string
    label: string
    action: string
    url?: string
  }[]
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  tags: string[]
  metadata?: Record<string, any>
}

export interface NotificationTemplate {
  id: string
  name: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  category: string
  variables: string[]
  channels: ('app' | 'email' | 'sms' | 'push')[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationPreferences {
  userId: string
  email: {
    enabled: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
    categories: string[]
  }
  sms: {
    enabled: boolean
    urgentOnly: boolean
    categories: string[]
  }
  push: {
    enabled: boolean
    categories: string[]
  }
  app: {
    enabled: boolean
    showPreview: boolean
    categories: string[]
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

export interface BulkNotificationOptions {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  channels: ('app' | 'email' | 'sms' | 'push')[]
  scheduledFor?: Date
  recipientFilters: {
    churches?: string[]
    teams?: string[]
    committees?: string[]
    groups?: string[]
    roles?: string[]
    status?: string[]
    ageRange?: { min: number; max: number }
    tags?: string[]
  }
  attachments?: File[]
  template?: string
  variables?: Record<string, string>
}

export interface NotificationStats {
  total: number
  sent: number
  delivered: number
  read: number
  failed: number
  byChannel: {
    app: number
    email: number
    sms: number
    push: number
  }
  byType: {
    info: number
    success: number
    warning: number
    error: number
    announcement: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

class NotificationService {
  private notifications: Notification[] = []
  private templates: NotificationTemplate[] = []
  private preferences: Record<string, NotificationPreferences> = {}
  private idCounter = 1

  // Generate unique ID
  private generateId(): string {
    return `notification-${this.idCounter++}`
  }

  // Get all notifications for a user
  getUserNotifications(userId: string, options?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
    category?: string
    type?: string
    priority?: string
  }): Promise<{ notifications: Notification[]; total: number }> {
    return new Promise((resolve) => {
      let filtered = this.notifications.filter(notification => 
        notification.recipientIds.includes(userId) ||
        notification.recipientType === 'all'
      )

      if (options?.unreadOnly) {
        filtered = filtered.filter(n => !n.readBy.includes(userId))
      }

      if (options?.category) {
        filtered = filtered.filter(n => n.category === options.category)
      }

      if (options?.type) {
        filtered = filtered.filter(n => n.type === options.type)
      }

      if (options?.priority) {
        filtered = filtered.filter(n => n.priority === options.priority)
      }

      // Sort by creation date (newest first)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const total = filtered.length
      const offset = options?.offset || 0
      const limit = options?.limit || 50

      const notifications = filtered.slice(offset, offset + limit)

      setTimeout(() => resolve({ notifications, total }), 100)
    })
  }

  // Send a new notification
  sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'readBy' | 'isRead'>): Promise<Notification> {
    return new Promise((resolve) => {
      const newNotification: Notification = {
        ...notification,
        id: this.generateId(),
        readBy: [],
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.notifications.unshift(newNotification)
      setTimeout(() => resolve(newNotification), 100)
    })
  }

  // Send bulk notifications
  sendBulkNotification(options: BulkNotificationOptions): Promise<{ success: number; failed: number; notifications: Notification[] }> {
    return new Promise((resolve) => {
      // Simulate recipient calculation based on filters
      const recipients = this.calculateRecipients(options.recipientFilters)
      const notifications: Notification[] = []
      let success = 0
      let failed = 0

      recipients.forEach(recipientId => {
        try {
          const notification: Notification = {
            id: `${this.generateId()}-${recipientId}`,
            title: this.replaceVariables(options.title, options.variables),
            message: this.replaceVariables(options.message, options.variables),
            type: options.type,
            priority: options.priority,
            category: options.category as 'general' | 'event' | 'member' | 'financial' | 'system' | 'ministry',
            recipientType: 'individual',
            recipientIds: [recipientId],
            senderId: 'system',
            senderName: 'System',
            channels: options.channels,
            scheduledFor: options.scheduledFor,
            sentAt: options.scheduledFor ? undefined : new Date(),
            readBy: [],
            isRead: false,
            isArchived: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: []
          }

          this.notifications.unshift(notification)
          notifications.push(notification)
          success++
        } catch (error) {
          failed++
        }
      })

      setTimeout(() => resolve({ success, failed, notifications }), 200)
    })
  }

  // Mark notification as read
  markAsRead(notificationId: string, userId: string): Promise<void> {
    return new Promise((resolve) => {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.readBy.includes(userId)) {
        notification.readBy.push(userId)
        notification.updatedAt = new Date()
      }
      setTimeout(() => resolve(), 50)
    })
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): Promise<void> {
    return new Promise((resolve) => {
      this.notifications.forEach(notification => {
        if ((notification.recipientIds.includes(userId) || notification.recipientType === 'all') 
            && !notification.readBy.includes(userId)) {
          notification.readBy.push(userId)
          notification.updatedAt = new Date()
        }
      })
      setTimeout(() => resolve(), 100)
    })
  }

  // Archive notification
  archiveNotification(notificationId: string): Promise<void> {
    return new Promise((resolve) => {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.isArchived = true
        notification.updatedAt = new Date()
      }
      setTimeout(() => resolve(), 50)
    })
  }

  // Delete notification
  deleteNotification(notificationId: string): Promise<void> {
    return new Promise((resolve) => {
      this.notifications = this.notifications.filter(n => n.id !== notificationId)
      setTimeout(() => resolve(), 50)
    })
  }

  // Get notification templates
  getTemplates(): Promise<NotificationTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.templates]), 100)
    })
  }

  // Create notification template
  createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    return new Promise((resolve) => {
      const newTemplate: NotificationTemplate = {
        ...template,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.templates.push(newTemplate)
      setTimeout(() => resolve(newTemplate), 100)
    })
  }

  // Update notification template
  updateTemplate(id: string, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    return new Promise((resolve, reject) => {
      const template = this.templates.find(t => t.id === id)
      if (!template) {
        setTimeout(() => reject(new Error('Template not found')), 50)
        return
      }

      Object.assign(template, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(template), 100)
    })
  }

  // Delete notification template
  deleteTemplate(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.templates = this.templates.filter(t => t.id !== id)
      setTimeout(() => resolve(), 50)
    })
  }

  // Get user preferences
  getUserPreferences(userId: string): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      const preferences = this.preferences[userId] || this.getDefaultPreferences(userId)
      setTimeout(() => resolve(preferences), 50)
    })
  }

  // Update user preferences
  updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      const current = this.preferences[userId] || this.getDefaultPreferences(userId)
      this.preferences[userId] = { ...current, ...preferences }
      setTimeout(() => resolve(this.preferences[userId]), 100)
    })
  }

  // Get notification statistics
  getStats(dateRange?: { from: Date; to: Date }): Promise<NotificationStats> {
    return new Promise((resolve) => {
      let filtered = this.notifications

      if (dateRange) {
        filtered = filtered.filter(n => {
          const date = new Date(n.createdAt)
          return date >= dateRange.from && date <= dateRange.to
        })
      }

      const stats: NotificationStats = {
        total: filtered.length,
        sent: filtered.filter(n => n.sentAt).length,
        delivered: filtered.filter(n => n.sentAt && !n.metadata?.failed).length,
        read: filtered.filter(n => n.readBy.length > 0).length,
        failed: filtered.filter(n => n.metadata?.failed).length,
        byChannel: {
          app: filtered.filter(n => n.channels.includes('app')).length,
          email: filtered.filter(n => n.channels.includes('email')).length,
          sms: filtered.filter(n => n.channels.includes('sms')).length,
          push: filtered.filter(n => n.channels.includes('push')).length
        },
        byType: {
          info: filtered.filter(n => n.type === 'info').length,
          success: filtered.filter(n => n.type === 'success').length,
          warning: filtered.filter(n => n.type === 'warning').length,
          error: filtered.filter(n => n.type === 'error').length,
          announcement: filtered.filter(n => n.type === 'announcement').length
        },
        byPriority: {
          low: filtered.filter(n => n.priority === 'low').length,
          medium: filtered.filter(n => n.priority === 'medium').length,
          high: filtered.filter(n => n.priority === 'high').length,
          urgent: filtered.filter(n => n.priority === 'urgent').length
        }
      }

      setTimeout(() => resolve(stats), 100)
    })
  }

  // Private helper methods
  private calculateRecipients(filters: BulkNotificationOptions['recipientFilters']): string[] {
    // Mock recipient calculation - in real app, this would query the database
    const allRecipients = ['user1', 'user2', 'user3', 'user4', 'user5']
    return allRecipients.slice(0, 3) // Return subset for demo
  }

  private replaceVariables(text: string, variables?: Record<string, string>): string {
    if (!variables) return text
    
    let result = text
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return result
  }

  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      email: {
        enabled: true,
        frequency: 'immediate',
        categories: ['general', 'event', 'member', 'financial', 'system', 'ministry']
      },
      sms: {
        enabled: false,
        urgentOnly: true,
        categories: ['general', 'event']
      },
      push: {
        enabled: true,
        categories: ['general', 'event', 'member', 'ministry']
      },
      app: {
        enabled: true,
        showPreview: true,
        categories: ['general', 'event', 'member', 'financial', 'system', 'ministry']
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    }
  }
}

// Initialize with some mock data
const service = new NotificationService()

// Mock notifications
const mockNotifications: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'readBy' | 'isRead'>[] = [
  {
    title: 'Welcome to Church Management System',
    message: 'Thank you for joining our church management platform. Explore the features and stay connected with your church community.',
    type: 'info',
    priority: 'medium',
    category: 'general',
    recipientType: 'all',
    recipientIds: [],
    senderId: 'system',
    senderName: 'System Administrator',
    channels: ['app', 'email'],
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isArchived: false,
    tags: ['welcome', 'onboarding']
  },
  {
    title: 'Sunday Service Reminder',
    message: 'Join us this Sunday at 10:00 AM for our weekly worship service. We look forward to seeing you there!',
    type: 'info',
    priority: 'medium',
    category: 'event',
    recipientType: 'all',
    recipientIds: [],
    senderId: 'pastor-john',
    senderName: 'Pastor John Smith',
    channels: ['app', 'email', 'sms'],
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isArchived: false,
    tags: ['service', 'reminder']
  },
  {
    title: 'New Member Orientation',
    message: 'New member orientation will be held next Saturday at 2:00 PM in the fellowship hall. Please bring this notification as confirmation.',
    type: 'announcement',
    priority: 'high',
    category: 'member',
    recipientType: 'group',
    recipientIds: ['user1', 'user2'],
    senderId: 'admin-mary',
    senderName: 'Mary Johnson',
    channels: ['app', 'email'],
    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isArchived: false,
    tags: ['orientation', 'new-members']
  }
]

// Add mock notifications
mockNotifications.forEach(notification => {
  service.sendNotification(notification)
})

// Mock templates
const mockTemplates: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Event Reminder',
    title: 'Reminder: {{eventName}}',
    content: 'This is a reminder that {{eventName}} is scheduled for {{eventDate}} at {{eventTime}}. Location: {{eventLocation}}',
    type: 'info',
    category: 'event',
    variables: ['eventName', 'eventDate', 'eventTime', 'eventLocation'],
    channels: ['app', 'email', 'sms'],
    isActive: true
  },
  {
    name: 'Welcome New Member',
    title: 'Welcome to {{churchName}}!',
    content: 'Dear {{memberName}}, welcome to our church family at {{churchName}}. We are excited to have you join our community.',
    type: 'success',
    category: 'member',
    variables: ['churchName', 'memberName'],
    channels: ['app', 'email'],
    isActive: true
  },
  {
    name: 'Payment Reminder',
    title: 'Payment Due: {{itemName}}',
    content: 'This is a reminder that your payment for {{itemName}} of ${{amount}} is due on {{dueDate}}.',
    type: 'warning',
    category: 'financial',
    variables: ['itemName', 'amount', 'dueDate'],
    channels: ['app', 'email'],
    isActive: true
  }
]

// Add mock templates
mockTemplates.forEach(template => {
  service.createTemplate(template)
})

export const notificationService = service
export default notificationService