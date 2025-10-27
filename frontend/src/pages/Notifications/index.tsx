import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  Send, 
  Settings, 
  Filter, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Archive, 
  Trash2, 
  Plus,
  Users,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Upload,
  Megaphone,
  BarChart3
} from 'lucide-react'
import { 
  notificationService, 
  type Notification, 
  type NotificationStats, 
  type BulkNotificationOptions 
} from '../../services/notificationService'
import NotificationPreferences from './Preferences'
import NotificationTemplates from './Templates'

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<{
    category: string
    type: string
    priority: string
    unreadOnly: boolean
    search: string
  }>({
    category: '',
    type: '',
    priority: '',
    unreadOnly: false,
    search: ''
  })
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [showNewNotification, setShowNewNotification] = useState(false)
  const [showBulkNotification, setShowBulkNotification] = useState(false)
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'preferences' | 'analytics'>('notifications')

  useEffect(() => {
    loadNotifications()
    loadStats()
  }, [filter])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const result = await notificationService.getUserNotifications('current-user', {
        unreadOnly: filter.unreadOnly,
        category: filter.category || undefined,
        type: filter.type || undefined,
        priority: filter.priority || undefined
      })
      
      let filtered = result.notifications
      if (filter.search) {
        filtered = filtered.filter(n => 
          n.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          n.message.toLowerCase().includes(filter.search.toLowerCase())
        )
      }
      
      setNotifications(filtered)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await notificationService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId, 'current-user')
      loadNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead('current-user')
      loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleArchive = async (notificationId: string) => {
    try {
      await notificationService.archiveNotification(notificationId)
      loadNotifications()
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      loadNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleBulkAction = async (action: 'read' | 'archive' | 'delete') => {
    try {
      for (const id of selectedNotifications) {
        switch (action) {
          case 'read':
            await notificationService.markAsRead(id, 'current-user')
            break
          case 'archive':
            await notificationService.archiveNotification(id)
            break
          case 'delete':
            await notificationService.deleteNotification(id)
            break
        }
      }
      setSelectedNotifications([])
      loadNotifications()
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'announcement': return <Megaphone className="w-5 h-5 text-blue-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-orange-500 bg-orange-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const unreadCount = notifications.filter(n => !n.readBy.includes('current-user')).length

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Bell className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewNotification(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </button>
          <button
            onClick={() => setShowBulkNotification(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Bulk Send
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'templates', label: 'Templates', icon: MessageSquare },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="event">Events</option>
                <option value="member">Members</option>
                <option value="financial">Financial</option>
                <option value="system">System</option>
                <option value="ministry">Ministry</option>
              </select>

              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="announcement">Announcement</option>
              </select>

              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.unreadOnly}
                  onChange={(e) => setFilter({ ...filter, unreadOnly: e.target.checked })}
                  className="mr-2"
                />
                Unread only
              </label>

              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('read')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! No new notifications to show.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
                    getPriorityColor(notification.priority)
                  } ${!notification.readBy.includes('current-user') ? 'ring-1 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications([...selectedNotifications, notification.id])
                          } else {
                            setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id))
                          }
                        }}
                        className="mt-1"
                      />
                      
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-medium ${
                            !notification.readBy.includes('current-user') ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.readBy.includes('current-user') && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>From: {notification.senderName}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(new Date(notification.createdAt))}</span>
                          <span>•</span>
                          <span className="capitalize">{notification.category}</span>
                          <span>•</span>
                          <span className="capitalize">{notification.priority}</span>
                          <div className="flex items-center space-x-1 ml-2">
                            {notification.channels.includes('email') && <Mail className="w-3 h-3" />}
                            {notification.channels.includes('sms') && <Smartphone className="w-3 h-3" />}
                            {notification.channels.includes('push') && <Bell className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      {!notification.readBy.includes('current-user') && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Other tabs would be implemented here */}
      {activeTab === 'templates' && <NotificationTemplates />}

      {activeTab === 'preferences' && <NotificationPreferences />}

      {activeTab === 'analytics' && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-500">Notification analytics and reporting coming soon...</p>
        </div>
      )}

      {/* Modals would be implemented here */}
      {showNewNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Send New Notification</h3>
            <p className="text-gray-500 mb-4">New notification form coming soon...</p>
            <button
              onClick={() => setShowNewNotification(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBulkNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Send Bulk Notification</h3>
            <p className="text-gray-500 mb-4">Bulk notification form coming soon...</p>
            <button
              onClick={() => setShowBulkNotification(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage