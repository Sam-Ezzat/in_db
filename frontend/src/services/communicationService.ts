import { BaseService } from './base/BaseService'

// ================================
// INTERFACES
// ================================

export interface Message {
  id: string
  conversationId?: string
  subject: string
  content: string
  senderId: string
  senderName: string
  senderEmail: string
  recipientIds: string[]
  recipients: MessageRecipient[]
  messageType: 'direct' | 'group' | 'broadcast' | 'announcement'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed'
  attachments: MessageAttachment[]
  tags: string[]
  isStarred: boolean
  isArchived: boolean
  parentMessageId?: string // For replies
  createdAt: Date
  sentAt?: Date
  readAt?: Date
  updatedAt: Date
}

export interface MessageRecipient {
  id: string
  messageId: string
  personId: string
  personName: string
  personEmail: string
  personPhone?: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  readAt?: Date
  deliveredAt?: Date
  failureReason?: string
}

export interface MessageAttachment {
  id: string
  messageId: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadedAt: Date
}

export interface Conversation {
  id: string
  subject: string
  participantIds: string[]
  participants: ConversationParticipant[]
  lastMessageId?: string
  lastMessageAt: Date
  messageCount: number
  unreadCount: number
  isArchived: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ConversationParticipant {
  id: string
  conversationId: string
  personId: string
  personName: string
  personEmail: string
  role: 'admin' | 'member'
  joinedAt: Date
  lastReadMessageId?: string
  lastReadAt?: Date
  isActive: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder'
  category: 'system' | 'event' | 'group' | 'financial' | 'general'
  recipientIds: string[]
  recipients: NotificationRecipient[]
  channels: NotificationChannel[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  scheduledFor?: Date
  expiresAt?: Date
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  isRead: boolean
  createdBy: string
  createdAt: Date
  sentAt?: Date
  updatedAt: Date
}

export interface NotificationRecipient {
  id: string
  notificationId: string
  personId: string
  personName: string
  personEmail: string
  personPhone?: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  readAt?: Date
  deliveredAt?: Date
  failureReason?: string
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app'
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sentAt?: Date
  deliveredAt?: Date
  failureReason?: string
  metadata?: Record<string, any>
}

export interface Campaign {
  id: string
  name: string
  description: string
  type: 'email' | 'sms' | 'whatsapp' | 'mixed'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled' | 'completed'
  templateId?: string
  subject: string
  content: string
  audienceType: 'all_members' | 'groups' | 'custom' | 'roles'
  audienceIds: string[] // Group IDs, role IDs, or custom list
  targetCount: number
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  failedCount: number
  scheduledFor?: Date
  startedAt?: Date
  completedAt?: Date
  settings: CampaignSettings
  analytics: CampaignAnalytics
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CampaignSettings {
  sendImmediately: boolean
  timezone: string
  throttleRate?: number // Messages per minute
  retryFailures: boolean
  trackOpens: boolean
  trackClicks: boolean
  unsubscribeLink: boolean
  replyToEmail?: string
  senderName?: string
}

export interface CampaignAnalytics {
  deliveryRate: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  bounceRate: number
  engagementScore: number
  hourlyStats: HourlyStats[]
  deviceStats: DeviceStats[]
  locationStats: LocationStats[]
}

export interface HourlyStats {
  hour: string
  sent: number
  delivered: number
  opened: number
  clicked: number
}

export interface DeviceStats {
  device: string
  count: number
  percentage: number
}

export interface LocationStats {
  location: string
  count: number
  percentage: number
}

export interface Template {
  id: string
  name: string
  description: string
  type: 'email' | 'sms' | 'whatsapp' | 'notification'
  category: 'announcement' | 'event' | 'newsletter' | 'reminder' | 'welcome' | 'custom'
  subject?: string
  content: string
  variables: TemplateVariable[]
  isActive: boolean
  isDefault: boolean
  usageCount: number
  previewUrl?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TemplateVariable {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean'
  defaultValue?: string
  isRequired: boolean
  description: string
}

export interface CommunicationPreferences {
  id: string
  personId: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  marketingEmails: boolean
  eventReminders: boolean
  groupUpdates: boolean
  financialUpdates: boolean
  systemAlerts: boolean
  frequencyLimit: 'immediate' | 'daily' | 'weekly' | 'monthly'
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
    timezone: string
  }
  unsubscribedFrom: string[]
  updatedAt: Date
}

export interface CommunicationSummary {
  totalMessages: number
  unreadMessages: number
  totalNotifications: number
  unreadNotifications: number
  activeCampaigns: number
  completedCampaigns: number
  totalTemplates: number
  deliveryRate: number
  openRate: number
  clickRate: number
  monthlyStats: {
    month: string
    messagesSent: number
    notificationsSent: number
    campaignsSent: number
    averageDeliveryRate: number
  }[]
}

export interface MessageFilters {
  conversationId?: string
  senderId?: string
  recipientId?: string
  messageType?: string
  priority?: string
  status?: string
  startDate?: Date
  endDate?: Date
  tags?: string[]
  isStarred?: boolean
  isArchived?: boolean
  hasAttachments?: boolean
}

export interface NotificationFilters {
  recipientId?: string
  type?: string
  category?: string
  priority?: string
  isRead?: boolean
  startDate?: Date
  endDate?: Date
}

export interface CampaignFilters {
  type?: string
  status?: string
  createdBy?: string
  startDate?: Date
  endDate?: Date
}

// WhatsApp and Email specific interfaces
export interface WhatsAppMessage {
  id: string
  recipientPhone: string
  recipientName: string
  content: string
  mediaType?: 'text' | 'image' | 'document' | 'video' | 'audio'
  mediaUrl?: string
  templateName?: string
  templateVariables?: Record<string, string>
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
  failureReason?: string
  createdAt: Date
}

export interface EmailMessage {
  id: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  from: string
  fromName?: string
  replyTo?: string
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: EmailAttachment[]
  templateId?: string
  templateVariables?: Record<string, string>
  priority: 'low' | 'normal' | 'high'
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced'
  scheduledAt?: Date
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  failureReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface EmailAttachment {
  filename: string
  content: string // base64 encoded
  contentType: string
  size: number
}

export interface WhatsAppTemplate {
  id: string
  name: string
  language: string
  category: 'marketing' | 'utility' | 'authentication'
  components: WhatsAppTemplateComponent[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

export interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons'
  format?: 'text' | 'image' | 'video' | 'document'
  text?: string
  variables?: WhatsAppTemplateVariable[]
}

export interface WhatsAppTemplateVariable {
  name: string
  example: string
}

// ================================
// SERVICE CLASS
// ================================

export class CommunicationService extends BaseService {
  private messages: Message[] = []
  private conversations: Conversation[] = []
  private notifications: Notification[] = []
  private campaigns: Campaign[] = []
  private templates: Template[] = []
  private preferences: CommunicationPreferences[] = []
  private whatsappMessages: WhatsAppMessage[] = []
  private emailMessages: EmailMessage[] = []
  private whatsappTemplates: WhatsAppTemplate[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  // ================================
  // MESSAGE MANAGEMENT
  // ================================

  async getMessages(filters?: MessageFilters): Promise<Message[]> {
    let filteredMessages = [...this.messages]

    if (filters) {
      if (filters.conversationId) {
        filteredMessages = filteredMessages.filter(msg => msg.conversationId === filters.conversationId)
      }

      if (filters.senderId) {
        filteredMessages = filteredMessages.filter(msg => msg.senderId === filters.senderId)
      }

      if (filters.recipientId) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.recipientIds.includes(filters.recipientId!)
        )
      }

      if (filters.messageType) {
        filteredMessages = filteredMessages.filter(msg => msg.messageType === filters.messageType)
      }

      if (filters.priority) {
        filteredMessages = filteredMessages.filter(msg => msg.priority === filters.priority)
      }

      if (filters.status) {
        filteredMessages = filteredMessages.filter(msg => msg.status === filters.status)
      }

      if (filters.startDate) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.createdAt >= filters.startDate!
        )
      }

      if (filters.endDate) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.createdAt <= filters.endDate!
        )
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredMessages = filteredMessages.filter(msg => 
          filters.tags!.some(tag => msg.tags.includes(tag))
        )
      }

      if (filters.isStarred !== undefined) {
        filteredMessages = filteredMessages.filter(msg => msg.isStarred === filters.isStarred)
      }

      if (filters.isArchived !== undefined) {
        filteredMessages = filteredMessages.filter(msg => msg.isArchived === filters.isArchived)
      }

      if (filters.hasAttachments !== undefined) {
        filteredMessages = filteredMessages.filter(msg => 
          filters.hasAttachments ? msg.attachments.length > 0 : msg.attachments.length === 0
        )
      }
    }

    return filteredMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getMessageById(id: string): Promise<Message | null> {
    return this.messages.find(message => message.id === id) || null
  }

  async sendMessage(messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'recipients'>): Promise<Message> {
    const newMessage: Message = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipients: messageData.recipientIds.map(recipientId => ({
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        messageId: '',
        personId: recipientId,
        personName: `Person ${recipientId}`,
        personEmail: `person${recipientId}@email.com`,
        status: 'pending'
      })),
      status: 'sent',
      sentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update recipient message IDs
    newMessage.recipients.forEach(recipient => {
      recipient.messageId = newMessage.id
    })

    this.messages.push(newMessage)

    // Simulate delivery and reading
    setTimeout(() => {
      this.updateMessageStatus(newMessage.id, 'delivered')
    }, 1000)

    return newMessage
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | null> {
    const messageIndex = this.messages.findIndex(message => message.id === id)
    if (messageIndex === -1) return null

    this.messages[messageIndex] = {
      ...this.messages[messageIndex],
      ...updates,
      updatedAt: new Date()
    }

    return this.messages[messageIndex]
  }

  async deleteMessage(id: string): Promise<boolean> {
    const messageIndex = this.messages.findIndex(message => message.id === id)
    if (messageIndex === -1) return false

    this.messages.splice(messageIndex, 1)
    return true
  }

  async starMessage(id: string): Promise<boolean> {
    const message = await this.getMessageById(id)
    if (!message) return false

    await this.updateMessage(id, { isStarred: !message.isStarred })
    return true
  }

  async archiveMessage(id: string): Promise<boolean> {
    const message = await this.getMessageById(id)
    if (!message) return false

    await this.updateMessage(id, { isArchived: !message.isArchived })
    return true
  }

  async markMessageAsRead(id: string, recipientId: string): Promise<boolean> {
    const message = await this.getMessageById(id)
    if (!message) return false

    const recipient = message.recipients.find(r => r.personId === recipientId)
    if (!recipient) return false

    recipient.status = 'read'
    recipient.readAt = new Date()

    await this.updateMessage(id, { 
      recipients: message.recipients,
      readAt: new Date()
    })

    return true
  }

  async updateMessageStatus(id: string, status: Message['status']): Promise<boolean> {
    const message = await this.getMessageById(id)
    if (!message) return false

    // Update message status
    await this.updateMessage(id, { status })

    // Update recipient statuses
    message.recipients.forEach(recipient => {
      if (status === 'delivered') {
        recipient.status = 'delivered'
        recipient.deliveredAt = new Date()
      }
    })

    return true
  }

  // ================================
  // CONVERSATION MANAGEMENT
  // ================================

  async getConversations(participantId?: string): Promise<Conversation[]> {
    let conversations = [...this.conversations]

    if (participantId) {
      conversations = conversations.filter(conv => 
        conv.participantIds.includes(participantId)
      )
    }

    return conversations.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    return this.conversations.find(conversation => conversation.id === id) || null
  }

  async createConversation(participantIds: string[], subject: string): Promise<Conversation> {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subject,
      participantIds,
      participants: participantIds.map((participantId, index) => ({
        id: `part_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId: '',
        personId: participantId,
        personName: `Person ${participantId}`,
        personEmail: `person${participantId}@email.com`,
        role: index === 0 ? 'admin' : 'member',
        joinedAt: new Date(),
        isActive: true
      })),
      lastMessageAt: new Date(),
      messageCount: 0,
      unreadCount: 0,
      isArchived: false,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update participant conversation IDs
    newConversation.participants.forEach(participant => {
      participant.conversationId = newConversation.id
    })

    this.conversations.push(newConversation)
    return newConversation
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.getMessages({ conversationId })
  }

  // ================================
  // NOTIFICATION MANAGEMENT
  // ================================

  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    let filteredNotifications = [...this.notifications]

    if (filters) {
      if (filters.recipientId) {
        filteredNotifications = filteredNotifications.filter(notif => 
          notif.recipientIds.includes(filters.recipientId!)
        )
      }

      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(notif => notif.type === filters.type)
      }

      if (filters.category) {
        filteredNotifications = filteredNotifications.filter(notif => notif.category === filters.category)
      }

      if (filters.priority) {
        filteredNotifications = filteredNotifications.filter(notif => notif.priority === filters.priority)
      }

      if (filters.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(notif => notif.isRead === filters.isRead)
      }

      if (filters.startDate) {
        filteredNotifications = filteredNotifications.filter(notif => 
          notif.createdAt >= filters.startDate!
        )
      }

      if (filters.endDate) {
        filteredNotifications = filteredNotifications.filter(notif => 
          notif.createdAt <= filters.endDate!
        )
      }
    }

    return filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'recipients'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipients: notificationData.recipientIds.map(recipientId => ({
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notificationId: '',
        personId: recipientId,
        personName: `Person ${recipientId}`,
        personEmail: `person${recipientId}@email.com`,
        status: 'pending'
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update recipient notification IDs
    newNotification.recipients.forEach(recipient => {
      recipient.notificationId = newNotification.id
    })

    this.notifications.push(newNotification)

    // Auto-send if not scheduled
    if (!newNotification.scheduledFor || newNotification.scheduledFor <= new Date()) {
      setTimeout(() => {
        this.sendNotification(newNotification.id)
      }, 100)
    }

    return newNotification
  }

  async sendNotification(id: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === id)
    if (!notification) return false

    // Update notification as sent
    notification.sentAt = new Date()
    notification.updatedAt = new Date()

    // Update recipient statuses and channels
    notification.recipients.forEach(recipient => {
      recipient.status = 'sent'
    })

    notification.channels.forEach(channel => {
      channel.status = 'sent'
      channel.sentAt = new Date()
      
      // Simulate delivery
      setTimeout(() => {
        channel.status = 'delivered'
        channel.deliveredAt = new Date()
      }, 500)
    })

    return true
  }

  async markNotificationAsRead(id: string, recipientId?: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === id)
    if (!notification) return false

    if (recipientId) {
      const recipient = notification.recipients.find(r => r.personId === recipientId)
      if (recipient) {
        recipient.status = 'read'
        recipient.readAt = new Date()
      }
    } else {
      notification.isRead = true
    }

    notification.updatedAt = new Date()
    return true
  }

  // ================================
  // CAMPAIGN MANAGEMENT
  // ================================

  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    let filteredCampaigns = [...this.campaigns]

    if (filters) {
      if (filters.type) {
        filteredCampaigns = filteredCampaigns.filter(campaign => campaign.type === filters.type)
      }

      if (filters.status) {
        filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === filters.status)
      }

      if (filters.createdBy) {
        filteredCampaigns = filteredCampaigns.filter(campaign => campaign.createdBy === filters.createdBy)
      }

      if (filters.startDate) {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          campaign.createdAt >= filters.startDate!
        )
      }

      if (filters.endDate) {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          campaign.createdAt <= filters.endDate!
        )
      }
    }

    return filteredCampaigns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return this.campaigns.find(campaign => campaign.id === id) || null
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'sentCount' | 'deliveredCount' | 'openedCount' | 'clickedCount' | 'failedCount' | 'analytics'>): Promise<Campaign> {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      failedCount: 0,
      analytics: {
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        unsubscribeRate: 0,
        bounceRate: 0,
        engagementScore: 0,
        hourlyStats: [],
        deviceStats: [],
        locationStats: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.campaigns.push(newCampaign)
    return newCampaign
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const campaignIndex = this.campaigns.findIndex(campaign => campaign.id === id)
    if (campaignIndex === -1) return null

    this.campaigns[campaignIndex] = {
      ...this.campaigns[campaignIndex],
      ...updates,
      updatedAt: new Date()
    }

    return this.campaigns[campaignIndex]
  }

  async sendCampaign(id: string): Promise<boolean> {
    const campaign = await this.getCampaignById(id)
    if (!campaign || campaign.status !== 'draft' && campaign.status !== 'scheduled') return false

    // Update campaign status
    await this.updateCampaign(id, {
      status: 'sending',
      startedAt: new Date()
    })

    // Simulate sending process
    setTimeout(async () => {
      const successRate = 0.85 + Math.random() * 0.1 // 85-95% success rate
      const sentCount = Math.floor(campaign.targetCount * successRate)
      const failedCount = campaign.targetCount - sentCount
      const deliveredCount = Math.floor(sentCount * 0.98)
      const openedCount = Math.floor(deliveredCount * (0.15 + Math.random() * 0.25)) // 15-40% open rate
      const clickedCount = Math.floor(openedCount * (0.05 + Math.random() * 0.15)) // 5-20% click rate

      await this.updateCampaign(id, {
        status: 'completed',
        completedAt: new Date(),
        sentCount,
        deliveredCount,
        openedCount,
        clickedCount,
        failedCount,
        analytics: {
          ...campaign.analytics,
          deliveryRate: (deliveredCount / sentCount) * 100,
          openRate: (openedCount / deliveredCount) * 100,
          clickRate: (clickedCount / openedCount) * 100,
          unsubscribeRate: Math.random() * 2, // 0-2%
          bounceRate: ((sentCount - deliveredCount) / sentCount) * 100,
          engagementScore: ((openedCount + clickedCount * 2) / deliveredCount) * 100
        }
      })
    }, 2000)

    return true
  }

  async pauseCampaign(id: string): Promise<boolean> {
    return await this.updateCampaign(id, { status: 'paused' }) !== null
  }

  async cancelCampaign(id: string): Promise<boolean> {
    return await this.updateCampaign(id, { status: 'cancelled' }) !== null
  }

  // ================================
  // TEMPLATE MANAGEMENT
  // ================================

  async getTemplates(type?: Template['type']): Promise<Template[]> {
    let templates = [...this.templates]

    if (type) {
      templates = templates.filter(template => template.type === type)
    }

    return templates.filter(t => t.isActive).sort((a, b) => b.usageCount - a.usageCount)
  }

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templates.find(template => template.id === id) || null
  }

  async createTemplate(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<Template> {
    const newTemplate: Template = {
      ...templateData,
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.templates.push(newTemplate)
    return newTemplate
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | null> {
    const templateIndex = this.templates.findIndex(template => template.id === id)
    if (templateIndex === -1) return null

    this.templates[templateIndex] = {
      ...this.templates[templateIndex],
      ...updates,
      updatedAt: new Date()
    }

    return this.templates[templateIndex]
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const templateIndex = this.templates.findIndex(template => template.id === id)
    if (templateIndex === -1) return false

    this.templates.splice(templateIndex, 1)
    return true
  }

  async useTemplate(id: string): Promise<Template | null> {
    const template = await this.getTemplateById(id)
    if (!template) return null

    await this.updateTemplate(id, { usageCount: template.usageCount + 1 })
    return template
  }

  // ================================
  // PREFERENCES MANAGEMENT
  // ================================

  async getPreferences(personId: string): Promise<CommunicationPreferences | null> {
    return this.preferences.find(pref => pref.personId === personId) || null
  }

  async updatePreferences(personId: string, updates: Partial<CommunicationPreferences>): Promise<CommunicationPreferences> {
    const existingIndex = this.preferences.findIndex(pref => pref.personId === personId)

    if (existingIndex >= 0) {
      this.preferences[existingIndex] = {
        ...this.preferences[existingIndex],
        ...updates,
        updatedAt: new Date()
      }
      return this.preferences[existingIndex]
    } else {
      const newPreferences: CommunicationPreferences = {
        id: `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        personId,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        marketingEmails: true,
        eventReminders: true,
        groupUpdates: true,
        financialUpdates: true,
        systemAlerts: true,
        frequencyLimit: 'immediate',
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'UTC'
        },
        unsubscribedFrom: [],
        ...updates,
        updatedAt: new Date()
      }

      this.preferences.push(newPreferences)
      return newPreferences
    }
  }

  // ================================
  // ANALYTICS & REPORTING
  // ================================

  async getCommunicationSummary(): Promise<CommunicationSummary> {
    const totalMessages = this.messages.length
    const unreadMessages = this.messages.filter(m => m.status !== 'read').length
    const totalNotifications = this.notifications.length
    const unreadNotifications = this.notifications.filter(n => !n.isRead).length
    const activeCampaigns = this.campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length
    const completedCampaigns = this.campaigns.filter(c => c.status === 'completed').length
    const totalTemplates = this.templates.filter(t => t.isActive).length

    const completedCampaignsData = this.campaigns.filter(c => c.status === 'completed')
    const deliveryRate = completedCampaignsData.length > 0
      ? completedCampaignsData.reduce((sum, c) => sum + c.analytics.deliveryRate, 0) / completedCampaignsData.length
      : 0

    const openRate = completedCampaignsData.length > 0
      ? completedCampaignsData.reduce((sum, c) => sum + c.analytics.openRate, 0) / completedCampaignsData.length
      : 0

    const clickRate = completedCampaignsData.length > 0
      ? completedCampaignsData.reduce((sum, c) => sum + c.analytics.clickRate, 0) / completedCampaignsData.length
      : 0

    // Generate monthly stats for last 12 months
    const monthlyStats = this.generateMonthlyStats()

    return {
      totalMessages,
      unreadMessages,
      totalNotifications,
      unreadNotifications,
      activeCampaigns,
      completedCampaigns,
      totalTemplates,
      deliveryRate,
      openRate,
      clickRate,
      monthlyStats
    }
  }

  private generateMonthlyStats() {
    const months: { [key: string]: { messagesSent: number; notificationsSent: number; campaignsSent: number; deliveryRates: number[] } } = {}
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months[monthKey] = { messagesSent: 0, notificationsSent: 0, campaignsSent: 0, deliveryRates: [] }
    }

    // Count messages
    this.messages.forEach(message => {
      if (message.sentAt) {
        const monthKey = `${message.sentAt.getFullYear()}-${String(message.sentAt.getMonth() + 1).padStart(2, '0')}`
        if (months[monthKey]) {
          months[monthKey].messagesSent++
        }
      }
    })

    // Count notifications
    this.notifications.forEach(notification => {
      if (notification.sentAt) {
        const monthKey = `${notification.sentAt.getFullYear()}-${String(notification.sentAt.getMonth() + 1).padStart(2, '0')}`
        if (months[monthKey]) {
          months[monthKey].notificationsSent++
        }
      }
    })

    // Count campaigns and delivery rates
    this.campaigns.forEach(campaign => {
      if (campaign.completedAt) {
        const monthKey = `${campaign.completedAt.getFullYear()}-${String(campaign.completedAt.getMonth() + 1).padStart(2, '0')}`
        if (months[monthKey]) {
          months[monthKey].campaignsSent++
          months[monthKey].deliveryRates.push(campaign.analytics.deliveryRate)
        }
      }
    })

    return Object.entries(months).map(([month, stats]) => ({
      month,
      messagesSent: stats.messagesSent,
      notificationsSent: stats.notificationsSent,
      campaignsSent: stats.campaignsSent,
      averageDeliveryRate: stats.deliveryRates.length > 0
        ? stats.deliveryRates.reduce((sum, rate) => sum + rate, 0) / stats.deliveryRates.length
        : 0
    }))
  }

  // ================================
  // MOCK DATA INITIALIZATION
  // ================================

  private initializeMockData() {
    // Sample templates
    this.templates = [
      {
        id: 'tmpl_1',
        name: 'Welcome Message',
        description: 'Welcome message for new members',
        type: 'email',
        category: 'welcome',
        subject: 'Welcome to {{church_name}}!',
        content: 'Dear {{member_name}},\n\nWelcome to {{church_name}}! We are excited to have you join our community.\n\nBlessings,\n{{pastor_name}}',
        variables: [
          { name: 'church_name', label: 'Church Name', type: 'text', defaultValue: 'Our Church', isRequired: true, description: 'Name of the church' },
          { name: 'member_name', label: 'Member Name', type: 'text', defaultValue: '', isRequired: true, description: 'Name of the new member' },
          { name: 'pastor_name', label: 'Pastor Name', type: 'text', defaultValue: 'Pastor John', isRequired: true, description: 'Name of the pastor' }
        ],
        isActive: true,
        isDefault: true,
        usageCount: 45,
        createdBy: 'user_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'tmpl_2',
        name: 'Event Reminder',
        description: 'Reminder for upcoming events',
        type: 'notification',
        category: 'reminder',
        content: 'Don\'t forget about {{event_name}} happening on {{event_date}} at {{event_time}}. See you there!',
        variables: [
          { name: 'event_name', label: 'Event Name', type: 'text', defaultValue: '', isRequired: true, description: 'Name of the event' },
          { name: 'event_date', label: 'Event Date', type: 'date', defaultValue: '', isRequired: true, description: 'Date of the event' },
          { name: 'event_time', label: 'Event Time', type: 'text', defaultValue: '', isRequired: true, description: 'Time of the event' }
        ],
        isActive: true,
        isDefault: true,
        usageCount: 78,
        createdBy: 'user_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]

    // Sample messages
    this.messages = [
      {
        id: 'msg_1',
        subject: 'Welcome to Sunday Service Planning',
        content: 'Dear team, we need to discuss the upcoming Sunday service arrangements. Please review the attached document and let me know your thoughts.',
        senderId: 'user_1',
        senderName: 'Pastor John Smith',
        senderEmail: 'pastor@church.com',
        recipientIds: ['user_2', 'user_3'],
        recipients: [
          {
            id: 'rec_1',
            messageId: 'msg_1',
            personId: 'user_2',
            personName: 'Sarah Johnson',
            personEmail: 'sarah@church.com',
            status: 'read',
            readAt: new Date('2024-01-10T14:30:00')
          },
          {
            id: 'rec_2',
            messageId: 'msg_1',
            personId: 'user_3',
            personName: 'Mike Wilson',
            personEmail: 'mike@church.com',
            status: 'delivered',
            deliveredAt: new Date('2024-01-10T10:05:00')
          }
        ],
        messageType: 'group',
        priority: 'normal',
        status: 'delivered',
        attachments: [],
        tags: ['ministry', 'planning'],
        isStarred: true,
        isArchived: false,
        createdAt: new Date('2024-01-10T10:00:00'),
        sentAt: new Date('2024-01-10T10:00:00'),
        updatedAt: new Date('2024-01-10T14:30:00')
      }
    ]

    // Sample notifications
    this.notifications = [
      {
        id: 'notif_1',
        title: 'New Event: Youth Bible Study',
        message: 'A new Youth Bible Study event has been scheduled for next Wednesday at 7 PM.',
        type: 'info',
        category: 'event',
        recipientIds: ['user_2', 'user_3', 'user_4'],
        recipients: [
          {
            id: 'nrec_1',
            notificationId: 'notif_1',
            personId: 'user_2',
            personName: 'Sarah Johnson',
            personEmail: 'sarah@church.com',
            status: 'read',
            readAt: new Date('2024-01-09T16:00:00')
          }
        ],
        channels: [
          {
            type: 'email',
            status: 'delivered',
            sentAt: new Date('2024-01-09T15:00:00'),
            deliveredAt: new Date('2024-01-09T15:01:00')
          },
          {
            type: 'in_app',
            status: 'delivered',
            sentAt: new Date('2024-01-09T15:00:00'),
            deliveredAt: new Date('2024-01-09T15:00:00')
          }
        ],
        priority: 'normal',
        actionUrl: '/events/event_2',
        actionLabel: 'View Event',
        isRead: false,
        createdBy: 'user_1',
        createdAt: new Date('2024-01-09T15:00:00'),
        sentAt: new Date('2024-01-09T15:00:00'),
        updatedAt: new Date('2024-01-09T16:00:00')
      }
    ]

    // Sample campaigns
    this.campaigns = [
      {
        id: 'camp_1',
        name: 'Christmas Service Invitation',
        description: 'Invite community to Christmas service',
        type: 'email',
        status: 'completed',
        subject: 'Join Us for Christmas Service',
        content: 'Dear friends, you are invited to join us for our special Christmas service on December 24th at 7 PM.',
        audienceType: 'all_members',
        audienceIds: [],
        targetCount: 450,
        sentCount: 445,
        deliveredCount: 440,
        openedCount: 132,
        clickedCount: 28,
        failedCount: 5,
        startedAt: new Date('2023-12-20T09:00:00'),
        completedAt: new Date('2023-12-20T09:30:00'),
        settings: {
          sendImmediately: true,
          timezone: 'UTC',
          trackOpens: true,
          trackClicks: true,
          unsubscribeLink: true,
          retryFailures: true,
          senderName: 'Our Church'
        },
        analytics: {
          deliveryRate: 98.9,
          openRate: 30.0,
          clickRate: 21.2,
          unsubscribeRate: 0.5,
          bounceRate: 1.1,
          engagementScore: 42.4,
          hourlyStats: [],
          deviceStats: [],
          locationStats: []
        },
        createdBy: 'user_1',
        createdAt: new Date('2023-12-19'),
        updatedAt: new Date('2023-12-20T09:30:00')
      }
    ]

    // Sample conversations
    this.conversations = [
      {
        id: 'conv_1',
        subject: 'Sunday Service Planning',
        participantIds: ['user_1', 'user_2', 'user_3'],
        participants: [
          {
            id: 'part_1',
            conversationId: 'conv_1',
            personId: 'user_1',
            personName: 'Pastor John Smith',
            personEmail: 'pastor@church.com',
            role: 'admin',
            joinedAt: new Date('2024-01-10T09:00:00'),
            isActive: true
          },
          {
            id: 'part_2',
            conversationId: 'conv_1',
            personId: 'user_2',
            personName: 'Sarah Johnson',
            personEmail: 'sarah@church.com',
            role: 'member',
            joinedAt: new Date('2024-01-10T09:00:00'),
            lastReadMessageId: 'msg_1',
            lastReadAt: new Date('2024-01-10T14:30:00'),
            isActive: true
          }
        ],
        lastMessageId: 'msg_1',
        lastMessageAt: new Date('2024-01-10T10:00:00'),
        messageCount: 1,
        unreadCount: 1,
        isArchived: false,
        tags: ['ministry'],
        createdAt: new Date('2024-01-10T09:00:00'),
        updatedAt: new Date('2024-01-10T14:30:00')
      }
    ]

    // Sample preferences
    this.preferences = [
      {
        id: 'pref_1',
        personId: 'user_2',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        inAppNotifications: true,
        marketingEmails: true,
        eventReminders: true,
        groupUpdates: true,
        financialUpdates: false,
        systemAlerts: true,
        frequencyLimit: 'daily',
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'UTC'
        },
        unsubscribedFrom: [],
        updatedAt: new Date('2024-01-05')
      }
    ]

    // Initialize sample WhatsApp messages
    this.whatsappMessages = [
      {
        id: 'wa_1',
        recipientPhone: '+1234567890',
        recipientName: 'John Doe',
        content: 'Welcome to our church community! We\'re excited to have you join us.',
        mediaType: 'text',
        status: 'delivered',
        sentAt: new Date('2024-01-10T10:00:00Z'),
        deliveredAt: new Date('2024-01-10T10:01:00Z'),
        createdAt: new Date('2024-01-10T09:59:00Z')
      }
    ]

    // Initialize sample email messages
    this.emailMessages = [
      {
        id: 'email_1',
        to: ['john.doe@email.com'],
        from: 'church@example.com',
        fromName: 'Grace Community Church',
        subject: 'Welcome to Our Church Family',
        htmlContent: '<h1>Welcome!</h1><p>We are thrilled to welcome you to our church community.</p>',
        textContent: 'Welcome! We are thrilled to welcome you to our church community.',
        priority: 'normal',
        status: 'delivered',
        sentAt: new Date('2024-01-10T09:00:00Z'),
        deliveredAt: new Date('2024-01-10T09:01:00Z'),
        createdAt: new Date('2024-01-10T08:59:00Z'),
        updatedAt: new Date('2024-01-10T09:01:00Z')
      }
    ]

    // Initialize sample WhatsApp templates
    this.whatsappTemplates = [
      {
        id: 'wat_1',
        name: 'welcome_message',
        language: 'en',
        category: 'utility',
        components: [
          {
            type: 'body',
            text: 'Welcome to {{church_name}}! We\'re excited to have you join us for {{event_name}} on {{event_date}}.',
            variables: [
              { name: 'church_name', example: 'Grace Community Church' },
              { name: 'event_name', example: 'Sunday Service' },
              { name: 'event_date', example: 'January 15th' }
            ]
          }
        ],
        status: 'approved',
        createdAt: new Date('2024-01-01')
      }
    ]
  }

  // ================================
  // WHATSAPP METHODS
  // ================================

  async sendWhatsAppMessage(messageData: {
    recipientPhone: string
    recipientName: string
    content: string
    mediaType?: 'text' | 'image' | 'document' | 'video' | 'audio'
    mediaUrl?: string
    templateName?: string
    templateVariables?: Record<string, string>
  }): Promise<WhatsAppMessage> {
    return new Promise((resolve) => {
      const message: WhatsAppMessage = {
        id: `wa_${Date.now()}`,
        ...messageData,
        mediaType: messageData.mediaType || 'text',
        status: 'pending',
        createdAt: new Date()
      }

      this.whatsappMessages.push(message)

      // Simulate sending
      setTimeout(() => {
        message.status = 'sent'
        message.sentAt = new Date()
        
        // Simulate delivery
        setTimeout(() => {
          message.status = 'delivered'
          message.deliveredAt = new Date()
        }, 1000)
      }, 500)

      resolve(message)
    })
  }

  async getWhatsAppMessages(filters?: {
    recipientPhone?: string
    status?: string
    startDate?: Date
    endDate?: Date
  }): Promise<WhatsAppMessage[]> {
    return new Promise((resolve) => {
      let filtered = [...this.whatsappMessages]

      if (filters) {
        if (filters.recipientPhone) {
          filtered = filtered.filter(msg => msg.recipientPhone.includes(filters.recipientPhone!))
        }
        if (filters.status) {
          filtered = filtered.filter(msg => msg.status === filters.status)
        }
        if (filters.startDate) {
          filtered = filtered.filter(msg => msg.createdAt >= filters.startDate!)
        }
        if (filters.endDate) {
          filtered = filtered.filter(msg => msg.createdAt <= filters.endDate!)
        }
      }

      setTimeout(() => resolve(filtered), 100)
    })
  }

  async getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.whatsappTemplates]), 100)
    })
  }

  // ================================
  // EMAIL METHODS
  // ================================

  async sendEmail(emailData: {
    to: string[]
    cc?: string[]
    bcc?: string[]
    subject: string
    htmlContent: string
    textContent?: string
    attachments?: EmailAttachment[]
    templateId?: string
    templateVariables?: Record<string, string>
    priority?: 'low' | 'normal' | 'high'
    scheduledAt?: Date
  }): Promise<EmailMessage> {
    return new Promise((resolve) => {
      const email: EmailMessage = {
        id: `email_${Date.now()}`,
        from: 'church@example.com',
        fromName: 'Grace Community Church',
        priority: emailData.priority || 'normal',
        status: emailData.scheduledAt ? 'queued' : 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...emailData
      }

      this.emailMessages.push(email)

      // Simulate sending
      if (!emailData.scheduledAt) {
        setTimeout(() => {
          email.status = 'sent'
          email.sentAt = new Date()
          
          // Simulate delivery
          setTimeout(() => {
            email.status = 'delivered'
            email.deliveredAt = new Date()
          }, 1000)
        }, 500)
      }

      resolve(email)
    })
  }

  async getEmails(filters?: {
    to?: string
    status?: string
    startDate?: Date
    endDate?: Date
  }): Promise<EmailMessage[]> {
    return new Promise((resolve) => {
      let filtered = [...this.emailMessages]

      if (filters) {
        if (filters.to) {
          filtered = filtered.filter(email => email.to.some(recipient => recipient.includes(filters.to!)))
        }
        if (filters.status) {
          filtered = filtered.filter(email => email.status === filters.status)
        }
        if (filters.startDate) {
          filtered = filtered.filter(email => email.createdAt >= filters.startDate!)
        }
        if (filters.endDate) {
          filtered = filtered.filter(email => email.createdAt <= filters.endDate!)
        }
      }

      setTimeout(() => resolve(filtered), 100)
    })
  }

  async scheduleEmail(emailData: {
    to: string[]
    subject: string
    htmlContent: string
    scheduledAt: Date
  }): Promise<EmailMessage> {
    return this.sendEmail({
      ...emailData,
      scheduledAt: emailData.scheduledAt
    })
  }

  async bulkSendEmails(emails: {
    to: string
    subject: string
    htmlContent: string
    templateVariables?: Record<string, string>
  }[]): Promise<EmailMessage[]> {
    const promises = emails.map(emailData => 
      this.sendEmail({
        to: [emailData.to],
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        templateVariables: emailData.templateVariables
      })
    )
    
    return Promise.all(promises)
  }

  async bulkSendWhatsApp(messages: {
    recipientPhone: string
    recipientName: string
    content: string
    templateVariables?: Record<string, string>
  }[]): Promise<WhatsAppMessage[]> {
    const promises = messages.map(messageData => 
      this.sendWhatsAppMessage(messageData)
    )
    
    return Promise.all(promises)
  }
}

// Export singleton instance
export const communicationService = new CommunicationService()