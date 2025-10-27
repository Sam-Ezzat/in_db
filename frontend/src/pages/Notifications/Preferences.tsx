import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Mail, 
  Smartphone, 
  Bell, 
  Monitor, 
  Save,
  Volume,
  VolumeX
} from 'lucide-react'
import { notificationService, type NotificationPreferences } from '../../services/notificationService'

const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    setLoading(true)
    try {
      const prefs = await notificationService.getUserPreferences('current-user')
      setPreferences(prefs)
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!preferences) return
    
    setSaving(true)
    try {
      await notificationService.updateUserPreferences('current-user', preferences)
      // Show success message
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateChannelPreferences = (channel: keyof NotificationPreferences, updates: any) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [channel]: { ...(preferences[channel] as any), ...updates }
      })
    }
  }

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'event', label: 'Events' },
    { id: 'member', label: 'Members' },
    { id: 'financial', label: 'Financial' },
    { id: 'system', label: 'System' },
    { id: 'ministry', label: 'Ministry' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load preferences</h3>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
            <p className="text-sm text-gray-600">Manage how you receive notifications</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Email Preferences */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email.enabled}
                  onChange={(e) => updateChannelPreferences('email', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {preferences.email.enabled && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Frequency</label>
              <select
                value={preferences.email.frequency}
                onChange={(e) => updateChannelPreferences('email', { frequency: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.email.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...preferences.email.categories, category.id]
                          : preferences.email.categories.filter(c => c !== category.id)
                        updateChannelPreferences('email', { categories: newCategories })
                      }}
                      className="mr-2"
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SMS Preferences */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via text message</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.sms.enabled}
                  onChange={(e) => updateChannelPreferences('sms', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {preferences.sms.enabled && (
          <div className="p-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.sms.urgentOnly}
                onChange={(e) => updateChannelPreferences('sms', { urgentOnly: e.target.checked })}
                className="mr-2"
              />
              Only urgent notifications
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">SMS Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.sms.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...preferences.sms.categories, category.id]
                          : preferences.sms.categories.filter(c => c !== category.id)
                        updateChannelPreferences('sms', { categories: newCategories })
                      }}
                      className="mr-2"
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.push.enabled}
                  onChange={(e) => updateChannelPreferences('push', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {preferences.push.enabled && (
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Push Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.push.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...preferences.push.categories, category.id]
                          : preferences.push.categories.filter(c => c !== category.id)
                        updateChannelPreferences('push', { categories: newCategories })
                      }}
                      className="mr-2"
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* In-App Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Monitor className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">In-App Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications within the application</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.app.enabled}
                  onChange={(e) => updateChannelPreferences('app', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {preferences.app.enabled && (
          <div className="p-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.app.showPreview}
                onChange={(e) => updateChannelPreferences('app', { showPreview: e.target.checked })}
                className="mr-2"
              />
              Show notification preview
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">In-App Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.app.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...preferences.app.categories, category.id]
                          : preferences.app.categories.filter(c => c !== category.id)
                        updateChannelPreferences('app', { categories: newCategories })
                      }}
                      className="mr-2"
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {preferences.quietHours.enabled ? (
              <VolumeX className="w-6 h-6 text-red-600" />
            ) : (
              <Volume className="w-6 h-6 text-gray-600" />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quiet Hours</h3>
              <p className="text-sm text-gray-600">Pause non-urgent notifications during specific hours</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) => updateChannelPreferences('quietHours', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {preferences.quietHours.enabled && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.startTime}
                  onChange={(e) => updateChannelPreferences('quietHours', { startTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.endTime}
                  onChange={(e) => updateChannelPreferences('quietHours', { endTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPreferences