import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import {
  BellIcon,
  CheckIcon,
  EyeIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'
import { communicationService, Notification, NotificationFilters, CommunicationPreferences } from '../../services/communicationService'

interface NotificationSystemProps {}

const NotificationSystem: React.FC<NotificationSystemProps> = () => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<CommunicationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<NotificationFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [currentTab, setCurrentTab] = useState<'all' | 'unread' | 'settings'>('all')

  useEffect(() => {
    loadData()
    loadPreferences()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      let viewFilters: NotificationFilters = { ...filters }
      
      if (currentTab === 'unread') {
        viewFilters = { ...viewFilters, isRead: false }
      }

      viewFilters.recipientId = 'current_user'

      const notificationsData = await communicationService.getNotifications(viewFilters)
      
      // Filter by search term if provided
      let filteredNotifications = notificationsData
      if (searchTerm.trim()) {
        filteredNotifications = notificationsData.filter(notification =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setNotifications(filteredNotifications)
    } catch (err) {
      setError('Failed to load notifications')
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPreferences = async () => {
    try {
      const preferencesData = await communicationService.getPreferences('current_user')
      setPreferences(preferencesData)
    } catch (err) {
      console.error('Error loading preferences:', err)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await communicationService.markNotificationAsRead(notificationId, 'current_user')
      loadData()
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(
        unreadNotifications.map(notification =>
          communicationService.markNotificationAsRead(notification.id, 'current_user')
        )
      )
      loadData()
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const handleUpdatePreferences = async (updates: Partial<CommunicationPreferences>) => {
    try {
      const updatedPreferences = await communicationService.updatePreferences('current_user', updates)
      setPreferences(updatedPreferences)
    } catch (err) {
      console.error('Error updating preferences:', err)
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-6 w-6"
    switch (type) {
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-500`} />
      case 'reminder':
        return <ClockIcon className={`${iconClass} text-purple-500`} />
      default:
        return <BellIcon className={`${iconClass} text-gray-500`} />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'normal': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'low': return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20'
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    } else {
      return notificationDate.toLocaleDateString()
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

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
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellSolidIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text,
                    backgroundColor: themeConfig.colors.background
                  }}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Mark All Read
                </button>
              )}
              <button
                onClick={() => setCurrentTab('settings')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'all', label: 'All Notifications', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'settings', label: 'Settings', count: 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key as any)}
                className="py-2 px-1 border-b-2 font-medium text-sm"
                style={{
                  borderColor: currentTab === tab.key ? themeConfig.colors.primary : 'transparent',
                  color: currentTab === tab.key ? themeConfig.colors.primary : themeConfig.colors.text + '80'
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {currentTab === 'settings' ? (
          /* Preferences Section */
          <div 
            className="rounded-lg shadow border"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              
              {preferences && (
                <div className="space-y-6">
                  {/* Notification Types */}
                  <div>
                    <h3 className="text-md font-medium mb-4">Notification Types</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                        { key: 'inAppNotifications', label: 'In-App Notifications', description: 'Show notifications within the application' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{item.label}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[item.key as keyof CommunicationPreferences] as boolean}
                              onChange={(e) => handleUpdatePreferences({ [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Categories */}
                  <div>
                    <h3 className="text-md font-medium mb-4">Content Categories</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'eventReminders', label: 'Event Reminders', description: 'Notifications about upcoming events' },
                        { key: 'groupUpdates', label: 'Group Updates', description: 'Updates from groups you belong to' },
                        { key: 'financialUpdates', label: 'Financial Updates', description: 'Donation receipts and financial information' },
                        { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional and newsletter content' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{item.label}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[item.key as keyof CommunicationPreferences] as boolean}
                              onChange={(e) => handleUpdatePreferences({ [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Limit */}
                  <div>
                    <h3 className="text-md font-medium mb-4">Notification Frequency</h3>
                    <select
                      value={preferences.frequencyLimit}
                      onChange={(e) => handleUpdatePreferences({ frequencyLimit: e.target.value as any })}
                      className="w-full max-w-xs p-2 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                      <option value="monthly">Monthly Digest</option>
                    </select>
                  </div>

                  {/* Quiet Hours */}
                  <div>
                    <h3 className="text-md font-medium mb-4">Quiet Hours</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable quiet hours</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.quietHours.enabled}
                            onChange={(e) => handleUpdatePreferences({ 
                              quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {preferences.quietHours.enabled && (
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input
                              type="time"
                              value={preferences.quietHours.startTime}
                              onChange={(e) => handleUpdatePreferences({ 
                                quietHours: { ...preferences.quietHours, startTime: e.target.value }
                              })}
                              className="w-full p-2 border rounded-md"
                              style={{
                                borderColor: themeConfig.colors.divider,
                                backgroundColor: themeConfig.colors.background,
                                color: themeConfig.colors.text
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <input
                              type="time"
                              value={preferences.quietHours.endTime}
                              onChange={(e) => handleUpdatePreferences({ 
                                quietHours: { ...preferences.quietHours, endTime: e.target.value }
                              })}
                              className="w-full p-2 border rounded-md"
                              style={{
                                borderColor: themeConfig.colors.divider,
                                backgroundColor: themeConfig.colors.background,
                                color: themeConfig.colors.text
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded-md"
                style={{
                  borderColor: themeConfig.colors.divider,
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text
                }}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div 
                className="mb-6 p-4 rounded-lg border"
                style={{
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value || undefined }))}
                      className="w-full p-2 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="">All Types</option>
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                      className="w-full p-2 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="">All Categories</option>
                      <option value="system">System</option>
                      <option value="event">Event</option>
                      <option value="group">Group</option>
                      <option value="financial">Financial</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={filters.priority || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
                      className="w-full p-2 border rounded-md"
                      style={{
                        borderColor: themeConfig.colors.divider,
                        backgroundColor: themeConfig.colors.background,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div 
                  className="text-center py-12 rounded-lg border"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider
                  }}
                >
                  <BellIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {currentTab === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications at this time.'}
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-4 rounded-lg shadow-sm border ${getPriorityColor(notification.priority)} ${
                      !notification.isRead ? 'ring-2 ring-blue-200' : ''
                    }`}
                    style={{
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.category === 'system' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                              notification.category === 'event' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              notification.category === 'group' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              notification.category === 'financial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            }`}>
                              {notification.category}
                            </span>
                          </div>
                          {notification.actionUrl && (
                            <div className="mt-3">
                              <button
                                onClick={() => navigate(notification.actionUrl!)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              >
                                {notification.actionLabel || 'View Details'} →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Mark as read"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationSystem