import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import {
  ChatBubbleLeftRightIcon,
  BellIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

interface CommunicationsProps {}

const Communications: React.FC<CommunicationsProps> = () => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()

  const features = [
    {
      title: 'Messages',
      description: 'Send messages, manage conversations, and communicate with members',
      icon: ChatBubbleLeftRightIcon,
      color: 'blue',
      path: '/communications/messages',
      features: ['Direct messaging', 'Group conversations', 'File attachments', 'Message search']
    },
    {
      title: 'Notifications',
      description: 'Send notifications and manage preferences',
      icon: BellIcon,
      color: 'purple',
      path: '/communications/notifications',
      features: ['Real-time alerts', 'Preference management', 'Delivery tracking', 'Multi-channel']
    },
    {
      title: 'Campaigns',
      description: 'Create and manage email and SMS campaigns',
      icon: MegaphoneIcon,
      color: 'green',
      path: '/communications/campaigns',
      features: ['Email campaigns', 'SMS campaigns', 'Analytics', 'Scheduling']
    }
  ]

  const stats = [
    {
      label: 'Active Conversations',
      value: '24',
      icon: ChatBubbleLeftRightIcon,
      color: 'blue'
    },
    {
      label: 'Unread Notifications',
      value: '8',
      icon: BellIcon,
      color: 'red'
    },
    {
      label: 'Active Campaigns',
      value: '3',
      icon: MegaphoneIcon,
      color: 'green'
    },
    {
      label: 'Email Templates',
      value: '12',
      icon: DocumentTextIcon,
      color: 'yellow'
    }
  ]

  const getColorClasses = (color: string) => {
    // Use theme colors instead of hardcoded classes
    const isColorType = ['blue', 'purple', 'green', 'yellow', 'red'].includes(color)
    if (isColorType) {
      return {
        bg: 'bg-white dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-300',
        hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
        border: 'border-gray-200 dark:border-gray-600'
      }
    }
    return {
      bg: 'bg-white dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-300',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
      border: 'border-gray-200 dark:border-gray-600'
    }
  }

  const getIconColor = (color: string) => {
    // Use theme's primary color for icons
    return {
      backgroundColor: themeConfig.colors.primary,
      color: '#FFFFFF'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>Communications</h1>
        <p style={{ color: themeConfig.colors.text + '80' }}>
          Manage messages, notifications, and campaigns to stay connected with your community
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colors = getColorClasses(stat.color)
          const iconColors = getIconColor(stat.color)
          return (
            <div
              key={index}
              className={`p-6 rounded-lg border ${colors.bg} ${colors.border}`}
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <div className="flex items-center">
                <div 
                  className="flex-shrink-0 p-3 rounded-lg"
                  style={iconColors}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text + '80' }}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const iconColors = getIconColor(feature.color)
          return (
            <div
              key={index}
              className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md`}
              style={{ 
                backgroundColor: themeConfig.colors.background, 
                borderColor: themeConfig.colors.divider 
              }}
              onClick={() => navigate(feature.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeConfig.colors.background
              }}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="flex-shrink-0 p-3 rounded-lg"
                  style={iconColors}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>{feature.title}</h3>
                </div>
              </div>
              
              <p className="mb-4" style={{ color: themeConfig.colors.text + '80' }}>{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.features.map((featureItem, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm" style={{ color: themeConfig.colors.text + '60' }}>
                    <div 
                      className="w-1.5 h-1.5 rounded-full mr-2"
                      style={{ backgroundColor: themeConfig.colors.primary }}
                    ></div>
                    {featureItem}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${themeConfig.colors.divider}` }}>
                <button 
                  className="text-sm font-medium hover:underline"
                  style={{ color: themeConfig.colors.primary }}
                >
                  Open {feature.title} →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-lg border p-6"
        style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <button
            onClick={() => navigate('/communications/messages')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" style={{ color: themeConfig.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>New Message</span>
          </button>
          
          <button
            onClick={() => navigate('/communications/notifications')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <BellIcon className="h-5 w-5 mr-3" style={{ color: themeConfig.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>Send Notification</span>
          </button>
          
          <button
            onClick={() => navigate('/communications/campaigns')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <EnvelopeIcon className="h-5 w-5 mr-3" style={{ color: themeConfig.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>Email Campaign</span>
          </button>
          
          <button
            onClick={() => navigate('/communications/campaigns')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <DevicePhoneMobileIcon className="h-5 w-5 mr-3" style={{ color: themeConfig.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>SMS Campaign</span>
          </button>

          <button
            onClick={() => navigate('/communications/whatsapp')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <PhoneIcon className="h-5 w-5 mr-3" style={{ color: '#25D366' }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>WhatsApp</span>
          </button>

          <button
            onClick={() => navigate('/communications/email')}
            className="flex items-center p-4 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeConfig.colors.background
            }}
          >
            <EnvelopeIcon className="h-5 w-5 mr-3" style={{ color: '#EA4335' }} />
            <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>Send Email</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="rounded-lg border p-6"
        style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>Recent Activity</h3>
          <button 
            className="text-sm hover:underline"
            style={{ color: themeConfig.colors.primary }}
          >
            View All Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { type: 'message', title: 'New message from Sarah Johnson', time: '2 minutes ago', icon: ChatBubbleLeftRightIcon, color: 'blue' },
            { type: 'campaign', title: 'Christmas Service campaign completed', time: '1 hour ago', icon: MegaphoneIcon, color: 'green' },
            { type: 'notification', title: 'Event reminder sent to 245 members', time: '3 hours ago', icon: BellIcon, color: 'purple' },
            { type: 'template', title: 'Welcome email template updated', time: '1 day ago', icon: DocumentTextIcon, color: 'yellow' }
          ].map((activity, index) => {
            const Icon = activity.icon
            return (
              <div 
                key={index} 
                className="flex items-center p-3 rounded-lg transition-colors cursor-pointer"
                style={{ backgroundColor: themeConfig.colors.background }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeConfig.colors.background
                }}
              >
                <div 
                  className="flex-shrink-0 p-2 rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.primary + '20',
                    color: themeConfig.colors.primary 
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>{activity.title}</p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Communications