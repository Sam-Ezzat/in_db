import React, { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'
import {
  PhoneIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  UserGroupIcon,
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FunnelIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { communicationService, WhatsAppMessage } from '../../services/communicationService'

interface BulkRecipient {
  id: string
  phoneNumber: string
  name?: string
  email?: string
  church?: string
  role?: string
}

interface BulkMessageResult {
  successful: BulkRecipient[]
  failed: Array<BulkRecipient & { reason: string }>
  totalSent: number
  totalFailed: number
}

interface RecipientFilter {
  type: 'all' | 'manual' | 'event' | 'group' | 'role' | 'church' | 'region'
  eventId?: string
  groupId?: string
  groupType?: 'team' | 'committee' | 'group'
  roleType?: 'leader' | 'co-leader' | 'member'
  churchId?: string
  region?: string
  area?: string
  country?: string
}

interface WhatsAppMessengerProps {}

const WhatsAppMessenger: React.FC<WhatsAppMessengerProps> = () => {
  const { themeConfig } = useTheme()
  const { userRole } = useAccess()
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'send' | 'bulk' | 'history'>('send')
  
  // Single message state
  const [newMessage, setNewMessage] = useState({
    recipientPhone: '',
    recipientName: '',
    content: ''
  })
  const [sending, setSending] = useState(false)
  
  // Media upload state
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  
  // Bulk messaging state
  const [recipients, setRecipients] = useState<BulkRecipient[]>([])
  const [bulkMessage, setBulkMessage] = useState('')
  const [bulkResults, setBulkResults] = useState<BulkMessageResult | null>(null)
  const [newRecipientPhone, setNewRecipientPhone] = useState('')
  const [newRecipientName, setNewRecipientName] = useState('')
  const [bulkSending, setBulkSending] = useState(false)
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>({ type: 'manual' })
  const [filteredResults, setFilteredResults] = useState<BulkRecipient[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await communicationService.getWhatsAppMessages()
      setMessages(data)
    } catch (error) {
      console.error('Error loading WhatsApp messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Media handling functions
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedMedia(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setSelectedMedia(null)
    setMediaPreview('')
  }

  // Bulk recipient management
  const addRecipient = () => {
    if (!newRecipientPhone) return
    
    const newRecipient: BulkRecipient = {
      id: Date.now().toString(),
      phoneNumber: newRecipientPhone,
      name: newRecipientName || undefined
    }
    
    setRecipients(prev => [...prev, newRecipient])
    setNewRecipientPhone('')
    setNewRecipientName('')
  }

  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id))
  }

  // Advanced recipient filtering
  const applyRecipientFilter = async () => {
    try {
      let results: BulkRecipient[] = []

      switch (recipientFilter.type) {
        case 'all':
          // Fetch all users (Super Admin only)
          results = await fetchAllUsers()
          break
        case 'event':
          // Fetch event attendees
          if (recipientFilter.eventId) {
            results = await fetchEventAttendees(recipientFilter.eventId)
          }
          break
        case 'group':
          // Fetch group members (teams, committees, groups)
          if (recipientFilter.groupId) {
            results = await fetchGroupMembers(recipientFilter.groupId, recipientFilter.roleType)
          }
          break
        case 'role':
          // Fetch users by role (leaders, co-leaders, members)
          if (recipientFilter.roleType) {
            results = await fetchUsersByRole(recipientFilter.roleType, recipientFilter.groupType)
          }
          break
        case 'church':
          // Fetch church members
          if (recipientFilter.churchId) {
            results = await fetchChurchMembers(recipientFilter.churchId)
          }
          break
        case 'region':
          // Fetch by geographic region
          results = await fetchByRegion(recipientFilter.region, recipientFilter.area, recipientFilter.country)
          break
        case 'manual':
        default:
          results = []
      }

      setFilteredResults(results)
      setSelectedRecipients(new Set()) // Reset selection
    } catch (error) {
      console.error('Error applying filter:', error)
    }
  }

  // Mock data fetching functions (replace with actual API calls)
  const fetchAllUsers = async (): Promise<BulkRecipient[]> => {
    // Simulate API call
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe', email: 'john@church.org', church: 'Main Church', role: 'Leader' },
      { id: '2', phoneNumber: '+1234567891', name: 'Jane Smith', email: 'jane@church.org', church: 'Main Church', role: 'Member' },
      { id: '3', phoneNumber: '+1234567892', name: 'Mike Johnson', email: 'mike@church.org', church: 'Branch Church', role: 'Co-Leader' },
    ]
  }

  const fetchEventAttendees = async (eventId: string): Promise<BulkRecipient[]> => {
    // Simulate fetching event attendees
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe', email: 'john@church.org' },
      { id: '2', phoneNumber: '+1234567891', name: 'Jane Smith', email: 'jane@church.org' },
    ]
  }

  const fetchGroupMembers = async (groupId: string, roleType?: string): Promise<BulkRecipient[]> => {
    // Simulate fetching group members filtered by role
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe', role: 'Leader' },
      { id: '2', phoneNumber: '+1234567891', name: 'Jane Smith', role: 'Member' },
    ]
  }

  const fetchUsersByRole = async (roleType: string, groupType?: string): Promise<BulkRecipient[]> => {
    // Simulate fetching users by role across all groups
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe', role: roleType },
    ]
  }

  const fetchChurchMembers = async (churchId: string): Promise<BulkRecipient[]> => {
    // Simulate fetching church members
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe', church: 'Main Church' },
      { id: '2', phoneNumber: '+1234567891', name: 'Jane Smith', church: 'Main Church' },
    ]
  }

  const fetchByRegion = async (region?: string, area?: string, country?: string): Promise<BulkRecipient[]> => {
    // Simulate fetching by geographic location
    return [
      { id: '1', phoneNumber: '+1234567890', name: 'John Doe' },
    ]
  }

  // Handle selection/deselection
  const toggleRecipientSelection = (recipientId: string) => {
    const newSelection = new Set(selectedRecipients)
    if (newSelection.has(recipientId)) {
      newSelection.delete(recipientId)
    } else {
      newSelection.add(recipientId)
    }
    setSelectedRecipients(newSelection)
  }

  const selectAllFiltered = () => {
    const allIds = new Set(filteredResults.map(r => r.id))
    setSelectedRecipients(allIds)
  }

  const deselectAll = () => {
    setSelectedRecipients(new Set())
  }

  const addSelectedToRecipients = () => {
    const selected = filteredResults.filter(r => selectedRecipients.has(r.id))
    const existingIds = new Set(recipients.map(r => r.id))
    const newRecipients = selected.filter(r => !existingIds.has(r.id))
    setRecipients(prev => [...prev, ...newRecipients])
    setShowFilterPanel(false)
  }

  // Single message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.recipientPhone || !newMessage.content) return

    try {
      setSending(true)
      await communicationService.sendWhatsAppMessage({
        recipientPhone: newMessage.recipientPhone,
        recipientName: newMessage.recipientName || 'Unknown',
        content: newMessage.content,
        mediaUrl: selectedMedia ? URL.createObjectURL(selectedMedia) : undefined,
        mediaType: selectedMedia ? getMediaType(selectedMedia) : undefined
      })
      
      setNewMessage({ recipientPhone: '', recipientName: '', content: '' })
      removeMedia()
      await loadMessages()
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
    } finally {
      setSending(false)
    }
  }

  // Bulk message sending
  const handleBulkSend = async () => {
    if (recipients.length === 0 || !bulkMessage) return

    try {
      setBulkSending(true)
      const successful: BulkRecipient[] = []
      const failed: Array<BulkRecipient & { reason: string }> = []

      // Simulate sending to each recipient
      for (const recipient of recipients) {
        try {
          await communicationService.sendWhatsAppMessage({
            recipientPhone: recipient.phoneNumber,
            recipientName: recipient.name || 'Unknown',
            content: bulkMessage,
            mediaUrl: selectedMedia ? URL.createObjectURL(selectedMedia) : undefined,
            mediaType: selectedMedia ? getMediaType(selectedMedia) : undefined
          })
          successful.push(recipient)
        } catch (error) {
          failed.push({
            ...recipient,
            reason: 'Invalid phone number or network error'
          })
        }
      }

      setBulkResults({
        successful,
        failed,
        totalSent: successful.length,
        totalFailed: failed.length
      })

      setBulkMessage('')
      removeMedia()
      await loadMessages()
    } catch (error) {
      console.error('Error sending bulk messages:', error)
    } finally {
      setBulkSending(false)
    }
  }

  const getMediaType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return 'document'
  }

  const getStatusIcon = (status: WhatsAppMessage['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      case 'sent':
        return <CheckIcon className="h-4 w-4 text-gray-500" />
      case 'delivered':
        return <CheckIcon className="h-4 w-4" style={{ color: '#25D366' }} />
      case 'read':
        return <CheckIcon className="h-4 w-4" style={{ color: '#25D366' }} />
      case 'failed':
        return <XMarkIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getFilteredMessages = () => {
    if (statusFilter === 'all') return messages
    return messages.filter(msg => msg.status === statusFilter)
  }

  const retryFailedMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    try {
      await communicationService.sendWhatsAppMessage({
        recipientPhone: message.recipientPhone,
        recipientName: message.recipientName || 'Unknown',
        content: message.content
      })
      await loadMessages()
    } catch (error) {
      console.error('Error retrying message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div 
      className="h-full max-w-6xl mx-auto p-6"
      style={{ backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <PhoneIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>WhatsApp Messenger</h1>
            <p style={{ color: themeConfig.colors.text + '80' }}>
              Send messages with media support and bulk messaging
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: themeConfig.colors.secondary }}>
        {[
          { id: 'send', label: 'Send Message', icon: PaperAirplaneIcon },
          { id: 'bulk', label: 'Bulk Messages', icon: UserGroupIcon },
          { id: 'history', label: 'Message History', icon: ClockIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent',
              color: activeTab === tab.id ? 'white' : themeConfig.colors.text
            }}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Single Message Tab */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            className="p-6 rounded-lg border"
            style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>Send New Message</h2>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newMessage.recipientPhone}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipientPhone: e.target.value }))}
                  placeholder="+1234567890"
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={newMessage.recipientName}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipientName: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                  required
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Attach Media (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleMediaSelect}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="flex items-center px-4 py-2 border rounded-md cursor-pointer transition-colors"
                    style={{
                      borderColor: themeConfig.colors.divider,
                      backgroundColor: themeConfig.colors.secondary,
                      color: themeConfig.colors.text
                    }}
                  >
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  {selectedMedia && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {selectedMedia.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="p-1 rounded-md hover:bg-red-100"
                        style={{ color: '#ff4444' }}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {mediaPreview && (
                  <div className="mt-2">
                    {selectedMedia?.type.startsWith('image/') ? (
                      <img src={mediaPreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                    ) : (
                      <div className="flex items-center p-2 border rounded-md w-fit" style={{ borderColor: themeConfig.colors.divider }}>
                        <DocumentIcon className="h-6 w-6 mr-2" style={{ color: themeConfig.colors.text }} />
                        <span className="text-sm" style={{ color: themeConfig.colors.text }}>{selectedMedia?.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={sending || !newMessage.recipientPhone || !newMessage.content}
                className="w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: '#25D366',
                  color: 'white'
                }}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>Message Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#25D366' }}>
                    {messages.filter(m => m.status === 'delivered').length}
                  </div>
                  <div className="text-sm" style={{ color: themeConfig.colors.text + '80' }}>Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#ff4444' }}>
                    {messages.filter(m => m.status === 'failed').length}
                  </div>
                  <div className="text-sm" style={{ color: themeConfig.colors.text + '80' }}>Failed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Messages Tab */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* Filter Panel Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: themeConfig.colors.text }}>
              Bulk Messaging ({recipients.length} recipients)
            </h2>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center px-4 py-2 rounded-md border transition-colors"
              style={{
                borderColor: themeConfig.colors.divider,
                backgroundColor: showFilterPanel ? themeConfig.colors.primary : themeConfig.colors.background,
                color: showFilterPanel ? 'white' : themeConfig.colors.text
              }}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Advanced Filter Panel */}
          {showFilterPanel && (
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.secondary, borderColor: themeConfig.colors.divider }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Select Recipients By:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filter Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Filter Type
                  </label>
                  <select
                    value={recipientFilter.type}
                    onChange={(e) => setRecipientFilter({ type: e.target.value as any })}
                    className="w-full p-3 border rounded-md"
                    style={{
                      borderColor: themeConfig.colors.divider,
                      backgroundColor: themeConfig.colors.background,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option value="manual">Manual Entry</option>
                    {userRole === 'super_admin' && <option value="all">All Users</option>}
                    <option value="event">Event Attendees</option>
                    <option value="group">Group/Team/Committee Members</option>
                    <option value="role">By Role (Leaders/Members)</option>
                    <option value="church">Church Members</option>
                    <option value="region">By Region/Area/Country</option>
                  </select>
                </div>

                {/* Event Selection */}
                {recipientFilter.type === 'event' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Select Event
                    </label>
                    <select
                      value={recipientFilter.eventId || ''}
                      onChange={(e) => setRecipientFilter({ ...recipientFilter, eventId: e.target.value })}
                      className="w-full p-3 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="">Select an event...</option>
                      <option value="event1">Youth Conference 2025</option>
                      <option value="event2">Leadership Summit</option>
                      <option value="event3">Christmas Service</option>
                      <option value="event4">Bible Study Workshop</option>
                    </select>
                  </div>
                )}

                {/* Group Selection */}
                {recipientFilter.type === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        <UsersIcon className="h-4 w-4 inline mr-1" />
                        Group Type
                      </label>
                      <select
                        value={recipientFilter.groupType || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, groupType: e.target.value as any })}
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">All Types</option>
                        <option value="team">Teams</option>
                        <option value="committee">Committees</option>
                        <option value="group">Small Groups</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        Select Group
                      </label>
                      <select
                        value={recipientFilter.groupId || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, groupId: e.target.value })}
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">Select a group...</option>
                        <option value="group1">Worship Team</option>
                        <option value="group2">Youth Ministry</option>
                        <option value="group3">Finance Committee</option>
                        <option value="group4">Outreach Team</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Role Selection */}
                {recipientFilter.type === 'role' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        Role Type
                      </label>
                      <select
                        value={recipientFilter.roleType || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, roleType: e.target.value as any })}
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">Select role...</option>
                        <option value="leader">All Leaders</option>
                        <option value="co-leader">All Co-Leaders</option>
                        <option value="member">All Members</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        Within Group Type (Optional)
                      </label>
                      <select
                        value={recipientFilter.groupType || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, groupType: e.target.value as any })}
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">All Groups</option>
                        <option value="team">Teams Only</option>
                        <option value="committee">Committees Only</option>
                        <option value="group">Small Groups Only</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Church Selection */}
                {recipientFilter.type === 'church' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                      <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                      Select Church
                    </label>
                    <select
                      value={recipientFilter.churchId || ''}
                      onChange={(e) => setRecipientFilter({ ...recipientFilter, churchId: e.target.value })}
                      className="w-full p-3 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="">Select a church...</option>
                      <option value="church1">Main Church</option>
                      <option value="church2">Branch Church - Downtown</option>
                      <option value="church3">Branch Church - Suburbs</option>
                      <option value="church4">Mission Church</option>
                    </select>
                  </div>
                )}

                {/* Region Selection */}
                {recipientFilter.type === 'region' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        <MapPinIcon className="h-4 w-4 inline mr-1" />
                        Country
                      </label>
                      <select
                        value={recipientFilter.country || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, country: e.target.value })}
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      >
                        <option value="">All Countries</option>
                        <option value="usa">United States</option>
                        <option value="canada">Canada</option>
                        <option value="uk">United Kingdom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                        Region/Area
                      </label>
                      <input
                        type="text"
                        value={recipientFilter.region || ''}
                        onChange={(e) => setRecipientFilter({ ...recipientFilter, region: e.target.value })}
                        placeholder="e.g., California, Ontario"
                        className="w-full p-3 border rounded-md"
                        style={{
                          borderColor: themeConfig.colors.divider,
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Apply Filter Button */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={applyRecipientFilter}
                  className="px-6 py-3 rounded-md font-medium transition-colors"
                  style={{
                    backgroundColor: themeConfig.colors.primary,
                    color: 'white'
                  }}
                >
                  Apply Filter
                </button>
                <span className="text-sm" style={{ color: themeConfig.colors.text + '80' }}>
                  {filteredResults.length} results found
                </span>
              </div>

              {/* Filtered Results */}
              {filteredResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                      Filtered Results ({selectedRecipients.size} selected)
                    </h4>
                    <div className="space-x-2">
                      <button
                        onClick={selectAllFiltered}
                        className="text-sm px-3 py-1 rounded-md"
                        style={{
                          backgroundColor: themeConfig.colors.secondary,
                          color: themeConfig.colors.text
                        }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAll}
                        className="text-sm px-3 py-1 rounded-md"
                        style={{
                          backgroundColor: themeConfig.colors.secondary,
                          color: themeConfig.colors.text
                        }}
                      >
                        Deselect All
                      </button>
                      <button
                        onClick={addSelectedToRecipients}
                        disabled={selectedRecipients.size === 0}
                        className="text-sm px-3 py-1 rounded-md disabled:opacity-50"
                        style={{
                          backgroundColor: '#25D366',
                          color: 'white'
                        }}
                      >
                        Add Selected ({selectedRecipients.size})
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredResults.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => toggleRecipientSelection(person.id)}
                        className="flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors"
                        style={{
                          backgroundColor: selectedRecipients.has(person.id) ? themeConfig.colors.primary + '20' : themeConfig.colors.background,
                          borderColor: selectedRecipients.has(person.id) ? themeConfig.colors.primary : themeConfig.colors.divider
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedRecipients.has(person.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                            style={{ accentColor: themeConfig.colors.primary }}
                          />
                          <div>
                            <div className="font-medium text-sm" style={{ color: themeConfig.colors.text }}>
                              {person.name}
                            </div>
                            <div className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>
                              {person.phoneNumber} {person.email && `• ${person.email}`}
                            </div>
                            {(person.church || person.role) && (
                              <div className="text-xs mt-1" style={{ color: themeConfig.colors.text + '60' }}>
                                {person.church && `📍 ${person.church}`} {person.role && `• ${person.role}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipients Management */}
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Manage Recipients ({recipients.length})
              </h2>
              
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="p-2 border rounded-md text-sm"
                    style={{
                      borderColor: themeConfig.colors.divider,
                      backgroundColor: themeConfig.colors.background,
                      color: themeConfig.colors.text
                    }}
                  />
                  <input
                    type="text"
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    placeholder="Name (Optional)"
                    className="p-2 border rounded-md text-sm"
                    style={{
                      borderColor: themeConfig.colors.divider,
                      backgroundColor: themeConfig.colors.background,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>
                <button
                  onClick={addRecipient}
                  disabled={!newRecipientPhone}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: themeConfig.colors.primary,
                    color: 'white'
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Recipient
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between p-3 rounded-md border"
                    style={{
                      backgroundColor: themeConfig.colors.secondary,
                      borderColor: themeConfig.colors.divider
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm" style={{ color: themeConfig.colors.text }}>
                        {recipient.name || 'Unknown'}
                      </div>
                      <div className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>
                        {recipient.phoneNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => removeRecipient(recipient.id)}
                      className="p-1 rounded-md hover:bg-red-100"
                      style={{ color: '#ff4444' }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {recipients.length === 0 && (
                  <div className="text-center py-4" style={{ color: themeConfig.colors.text + '60' }}>
                    No recipients added yet
                  </div>
                )}
              </div>
            </div>

            {/* Bulk Message Composer */}
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>Compose Bulk Message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Message Content
                  </label>
                  <textarea
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Type your bulk message here..."
                    rows={6}
                    className="w-full p-3 border rounded-md"
                    style={{
                      borderColor: themeConfig.colors.divider,
                      backgroundColor: themeConfig.colors.background,
                      color: themeConfig.colors.text
                    }}
                    required
                  />
                </div>

                {/* Media Upload for Bulk */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Attach Media (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleMediaSelect}
                      className="hidden"
                      id="bulk-media-upload"
                    />
                    <label
                      htmlFor="bulk-media-upload"
                      className="flex items-center px-4 py-2 border rounded-md cursor-pointer transition-colors"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.secondary,
                        color: themeConfig.colors.text
                      }}
                    >
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                    {selectedMedia && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                          {selectedMedia.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeMedia}
                          className="p-1 rounded-md hover:bg-red-100"
                          style={{ color: '#ff4444' }}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleBulkSend}
                  disabled={bulkSending || recipients.length === 0 || !bulkMessage}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: '#25D366',
                    color: 'white'
                  }}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {bulkSending ? 'Sending...' : `Send to ${recipients.length} Recipients`}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Results */}
          {bulkResults && (
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Bulk Send Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Successful */}
                <div>
                  <h4 className="text-md font-medium mb-2 flex items-center" style={{ color: '#25D366' }}>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Successful ({bulkResults.totalSent})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {bulkResults.successful.map((recipient) => (
                      <div key={recipient.id} className="text-sm p-2 rounded-md" style={{ backgroundColor: themeConfig.colors.secondary }}>
                        <div style={{ color: themeConfig.colors.text }}>{recipient.name || 'Unknown'}</div>
                        <div style={{ color: themeConfig.colors.text + '60' }}>{recipient.phoneNumber}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failed */}
                <div>
                  <h4 className="text-md font-medium mb-2 flex items-center" style={{ color: '#ff4444' }}>
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    Failed ({bulkResults.totalFailed})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {bulkResults.failed.map((recipient) => (
                      <div key={recipient.id} className="text-sm p-2 rounded-md" style={{ backgroundColor: themeConfig.colors.secondary }}>
                        <div style={{ color: themeConfig.colors.text }}>{recipient.name || 'Unknown'}</div>
                        <div style={{ color: themeConfig.colors.text + '60' }}>{recipient.phoneNumber}</div>
                        <div className="text-xs" style={{ color: '#ff4444' }}>{recipient.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>Message History</h2>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
              style={{
                borderColor: themeConfig.colors.divider,
                backgroundColor: themeConfig.colors.background,
                color: themeConfig.colors.text
              }}
            >
              <option value="all">All Messages</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {getFilteredMessages().length === 0 ? (
              <div className="text-center py-8">
                <PhoneIcon className="h-12 w-12 mx-auto mb-4" style={{ color: themeConfig.colors.text + '40' }} />
                <p style={{ color: themeConfig.colors.text + '60' }}>No messages found</p>
              </div>
            ) : (
              getFilteredMessages().map((message) => (
                <div
                  key={message.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" style={{ color: themeConfig.colors.text }} />
                      <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                        {message.recipientName}
                      </span>
                      <span className="text-sm" style={{ color: themeConfig.colors.text + '60' }}>
                        {message.recipientPhone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(message.status)}
                      <span className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>
                        {formatTime(message.createdAt)}
                      </span>
                      {message.status === 'failed' && (
                        <button
                          onClick={() => retryFailedMessage(message.id)}
                          className="p-1 rounded-md hover:bg-blue-100"
                          style={{ color: themeConfig.colors.primary }}
                          title="Retry sending"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2" style={{ color: themeConfig.colors.text + '80' }}>
                    {message.content}
                  </p>

                  {/* Media attachment indicator */}
                  {message.mediaUrl && (
                    <div className="flex items-center space-x-2 mb-2">
                      {message.mediaType === 'image' && <PhotoIcon className="h-4 w-4" style={{ color: themeConfig.colors.text + '60' }} />}
                      {message.mediaType === 'video' && <VideoCameraIcon className="h-4 w-4" style={{ color: themeConfig.colors.text + '60' }} />}
                      {message.mediaType === 'document' && <DocumentIcon className="h-4 w-4" style={{ color: themeConfig.colors.text + '60' }} />}
                      <span className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>
                        {message.mediaType?.charAt(0).toUpperCase() + message.mediaType?.slice(1)} attached
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: message.status === 'delivered' ? '#25D366' : 
                                       message.status === 'failed' ? '#ff4444' : themeConfig.colors.primary,
                        color: 'white'
                      }}
                    >
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                    
                    {message.status === 'failed' && message.failureReason && (
                      <span className="text-xs" style={{ color: '#ff4444' }}>
                        {message.failureReason}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppMessenger