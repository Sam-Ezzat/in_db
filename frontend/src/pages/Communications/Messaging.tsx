import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import {
  PaperAirplaneIcon,
  InboxIcon,
  PencilIcon,
  ArchiveBoxIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperClipIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ArrowUturnLeftIcon,
  ForwardIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { communicationService, Message, MessageFilters } from '../../services/communicationService'

// Mock theme context for now
const theme = 'light'

// Mock permission component for now
const RequirePermission: React.FC<{ permission: string; children: React.ReactNode }> = ({ children }) => <>{children}</>

interface MessagingProps {}

const Messaging: React.FC<MessagingProps> = () => {
  const navigate = useNavigate()
  const { id: selectedMessageId } = useParams()
  const { themeConfig } = useTheme()

  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentView, setCurrentView] = useState<'inbox' | 'sent' | 'starred' | 'archived' | 'drafts'>('inbox')
  const [showCompose, setShowCompose] = useState(false)
  const [composeData, setComposeData] = useState({
    subject: '',
    content: '',
    recipientIds: [] as string[],
    messageType: 'direct' as Message['messageType'],
    priority: 'normal' as Message['priority'],
    tags: [] as string[]
  })

  // Sample recipient options (in real app, this would come from user service)
  const [availableRecipients] = useState([
    { id: 'user_1', name: 'Pastor John Smith', email: 'pastor@church.com' },
    { id: 'user_2', name: 'Sarah Johnson', email: 'sarah@church.com' },
    { id: 'user_3', name: 'Mike Wilson', email: 'mike@church.com' },
    { id: 'user_4', name: 'Emily Davis', email: 'emily@church.com' },
    { id: 'user_5', name: 'David Brown', email: 'david@church.com' }
  ])

  useEffect(() => {
    loadData()
  }, [currentView])

  useEffect(() => {
    if (selectedMessageId) {
      loadMessage(selectedMessageId)
    }
  }, [selectedMessageId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Apply view-based filters
      let viewFilters: MessageFilters = {}
      
      switch (currentView) {
        case 'inbox':
          // Show received messages (not sent by current user)
          viewFilters = { recipientId: 'current_user' }
          break
        case 'sent':
          viewFilters = { senderId: 'current_user' }
          break
        case 'starred':
          viewFilters = { isStarred: true }
          break
        case 'archived':
          viewFilters = { isArchived: true }
          break
        case 'drafts':
          viewFilters = { status: 'draft' }
          break
      }

      const messagesData = await communicationService.getMessages(viewFilters)
      setMessages(messagesData)
    } catch (err) {
      setError('Failed to load messages')
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMessage = async (messageId: string) => {
    try {
      const message = await communicationService.getMessageById(messageId)
      if (message) {
        setSelectedMessage(message)
        // Mark as read if it's not already
        if (message.status !== 'read') {
          await communicationService.markMessageAsRead(messageId, 'current_user')
          loadData() // Refresh to show updated status
        }
      }
    } catch (err) {
      console.error('Error loading message:', err)
    }
  }

  const handleSendMessage = async () => {
    try {
      if (!composeData.subject.trim() || !composeData.content.trim() || composeData.recipientIds.length === 0) {
        setError('Please fill in all required fields')
        return
      }

      await communicationService.sendMessage({
        subject: composeData.subject,
        content: composeData.content,
        senderId: 'current_user',
        senderName: 'Current User',
        senderEmail: 'current@church.com',
        recipientIds: composeData.recipientIds,
        messageType: composeData.messageType,
        priority: composeData.priority,
        status: 'sent',
        attachments: [],
        tags: composeData.tags,
        isStarred: false,
        isArchived: false
      })

      // Reset compose form
      setComposeData({
        subject: '',
        content: '',
        recipientIds: [],
        messageType: 'direct',
        priority: 'normal',
        tags: []
      })
      setShowCompose(false)
      loadData()
    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
    }
  }

  const handleStarMessage = async (messageId: string) => {
    try {
      await communicationService.starMessage(messageId)
      loadData()
      if (selectedMessage?.id === messageId) {
        const updatedMessage = await communicationService.getMessageById(messageId)
        setSelectedMessage(updatedMessage)
      }
    } catch (err) {
      console.error('Error starring message:', err)
    }
  }

  const handleArchiveMessage = async (messageId: string) => {
    try {
      await communicationService.archiveMessage(messageId)
      loadData()
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
        navigate('/communications/messages')
      }
    } catch (err) {
      console.error('Error archiving message:', err)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this message?')) {
        await communicationService.deleteMessage(messageId)
        loadData()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
          navigate('/communications/messages')
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'normal': return 'text-gray-600 dark:text-gray-400'
      case 'low': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <PaperAirplaneIcon className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'read':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' })
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
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
      className="h-full"
      style={{ backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`w-80 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Messages</h1>
              <RequirePermission permission="messages:create">
                <button
                  onClick={() => setShowCompose(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Compose
                </button>
              </RequirePermission>
            </div>

            {/* Search */}
            <div className="mt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <nav className="space-y-1">
              {[
                { key: 'inbox', label: 'Inbox', icon: InboxIcon, count: messages.filter(m => m.status !== 'read').length },
                { key: 'sent', label: 'Sent', icon: PaperAirplaneIcon },
                { key: 'starred', label: 'Starred', icon: StarIcon },
                { key: 'archived', label: 'Archived', icon: ArchiveBoxIcon },
                { key: 'drafts', label: 'Drafts', icon: PencilIcon }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => setCurrentView(item.key as any)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                      currentView === item.key
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </div>
                    {item.count && item.count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className={`w-1/3 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium capitalize">{currentView}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <InboxIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages in {currentView}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message)
                      navigate(`/communications/messages/${message.id}`)
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            message.status === 'read' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {currentView === 'sent' ? `To: ${message.recipients[0]?.personName}` : message.senderName}
                          </p>
                          <div className="flex items-center space-x-1">
                            {message.isStarred && (
                              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                            )}
                            {message.attachments.length > 0 && (
                              <PaperClipIcon className="h-4 w-4 text-gray-400" />
                            )}
                            {getStatusIcon(message.status)}
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${
                          message.status === 'read' ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                        } truncate`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)} bg-gray-100 dark:bg-gray-700`}>
                              {message.priority}
                            </span>
                            {message.messageType === 'group' && (
                              <UserGroupIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        From: {selectedMessage.senderName} &lt;{selectedMessage.senderEmail}&gt;
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        To: {selectedMessage.recipients.map(r => r.personName).join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RequirePermission permission="messages:update">
                      <button
                        onClick={() => handleStarMessage(selectedMessage.id)}
                        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedMessage.isStarred ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      >
                        {selectedMessage.isStarred ? (
                          <StarSolidIcon className="h-5 w-5" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>
                    </RequirePermission>
                    <RequirePermission permission="messages:update">
                      <button
                        onClick={() => handleArchiveMessage(selectedMessage.id)}
                        className="p-2 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ArchiveBoxIcon className="h-5 w-5" />
                      </button>
                    </RequirePermission>
                    <RequirePermission permission="messages:delete">
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2 rounded-md text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </RequirePermission>
                    <div className="relative">
                      <button className="p-2 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                </div>

                {selectedMessage.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Attachments ({selectedMessage.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                        >
                          <PaperClipIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{attachment.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMessage.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Actions */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex space-x-2">
                  <RequirePermission permission="messages:create">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                      Reply
                    </button>
                  </RequirePermission>
                  <RequirePermission permission="messages:create">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <ForwardIcon className="h-4 w-4 mr-2" />
                      Forward
                    </button>
                  </RequirePermission>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a message
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a message from the list to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Compose Message</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <select
                    multiple
                    value={composeData.recipientIds}
                    onChange={(e) => setComposeData(prev => ({
                      ...prev,
                      recipientIds: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                    className={`w-full p-2 border rounded-md ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}`}
                    size={4}
                  >
                    {availableRecipients.map(recipient => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name} ({recipient.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                    className={`w-full p-2 border rounded-md ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Enter subject..."
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value as Message['priority'] }))}
                    className={`w-full p-2 border rounded-md ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className={`w-full p-2 border rounded-md ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Enter your message..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messaging