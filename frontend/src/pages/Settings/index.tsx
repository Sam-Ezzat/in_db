import { useTheme } from '../../contexts/ThemeContext'
import { 
  Settings as SettingsIcon, User, Bell, Shield, Database, 
  Palette, Save, RefreshCw 
} from 'lucide-react'
import { useState } from 'react'

const Settings = () => {
  const { themeConfig, theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reports: false,
    events: true
  })

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Privacy', icon: Database },
  ]

  const themeOptions = [
    { key: 'light-grace' as const, name: 'Light Grace', color: '#8B5CF6', description: 'Clean and bright interface' },
    { key: 'warm-faith' as const, name: 'Warm Faith', color: '#F59E0B', description: 'Warm and welcoming colors' },
    { key: 'nature-hope' as const, name: 'Nature Hope', color: '#10B981', description: 'Fresh and natural tones' },
    { key: 'midnight-prayer' as const, name: 'Midnight Prayer', color: '#3B82F6', description: 'Calm and peaceful dark theme' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                General Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Language
                  </label>
                  <select 
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Time Zone
                  </label>
                  <select 
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-6 (Central Time)</option>
                    <option>UTC-7 (Mountain Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    defaultValue="John Doe"
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    defaultValue="john.doe@church.com"
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize" style={{ color: themeConfig.colors.text }}>
                        {key} Notifications
                      </p>
                      <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        Receive {key} notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className="sr-only peer"
                      />
                      <div 
                        className={`w-11 h-6 rounded-full peer transition-colors ${
                          value ? '' : 'bg-gray-300'
                        }`}
                        style={{ backgroundColor: value ? themeConfig.colors.primary : undefined }}
                      >
                        <div 
                          className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                            value ? 'translate-x-5' : ''
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                Security Settings
              </h3>
              <div className="space-y-4">
                <button
                  className="w-full flex items-center justify-between p-4 rounded-lg border hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <div className="flex items-center">
                    <Shield size={20} className="mr-3" style={{ color: themeConfig.colors.primary }} />
                    <div className="text-left">
                      <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                        Change Password
                      </p>
                      <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        Update your password for better security
                      </p>
                    </div>
                  </div>
                  <span style={{ color: themeConfig.colors.text, opacity: 0.5 }}>›</span>
                </button>
                
                <button
                  className="w-full flex items-center justify-between p-4 rounded-lg border hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <div className="flex items-center">
                    <RefreshCw size={20} className="mr-3" style={{ color: themeConfig.colors.primary }} />
                    <div className="text-left">
                      <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <span 
                    className="px-2 py-1 text-xs rounded-full text-red-800"
                    style={{ backgroundColor: '#FEE2E2' }}
                  >
                    Disabled
                  </span>
                </button>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                Theme Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themeOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      theme === option.key ? 'ring-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: themeConfig.colors.secondary,
                      borderColor: theme === option.key ? option.color : themeConfig.colors.divider,
                      ...(theme === option.key && {
                        boxShadow: `0 0 0 2px ${option.color}20`
                      })
                    }}
                    onClick={() => setTheme(option.key)}
                  >
                    <div className="flex items-center mb-3">
                      <div 
                        className="w-6 h-6 rounded-full mr-3"
                        style={{ backgroundColor: option.color }}
                      />
                      <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                        {option.name}
                      </h4>
                      {theme === option.key && (
                        <span className="ml-auto text-sm" style={{ color: option.color }}>
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
                Data & Privacy
              </h3>
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <h4 className="font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Export Data
                  </h4>
                  <p className="text-sm mb-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Download a copy of your personal data
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  >
                    Export Data
                  </button>
                </div>
                
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: '#FEE2E2',
                    borderColor: '#F87171' 
                  }}
                >
                  <h4 className="font-medium mb-2 text-red-800">
                    Delete Account
                  </h4>
                  <p className="text-sm mb-3 text-red-700">
                    Permanently delete your account and all associated data
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Settings
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage your account settings and preferences
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Save size={20} className="mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id ? 'text-white shadow-md' : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent',
                      color: activeTab === tab.id ? '#ffffff' : themeConfig.colors.text,
                    }}
                  >
                    <Icon size={16} className="mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings