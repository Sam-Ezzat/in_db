import { useTheme } from '../../contexts/ThemeContext'
import { Users, UserCheck, TrendingUp, FileText, Calendar, UserPlus } from 'lucide-react'

const Dashboard = () => {
  const { themeConfig } = useTheme()

  const stats = [
    { name: 'Total Members', value: '1,234', icon: Users, color: '#3B82F6' },
    { name: 'Active Teams', value: '12', icon: UserCheck, color: '#10B981' },
    { name: 'Attendance Rate', value: '85%', icon: TrendingUp, color: '#8B5CF6' },
    { name: 'Reports Submitted', value: '45', icon: FileText, color: '#F59E0B' },
  ]

  const quickActions = [
    { name: 'Add Member', icon: UserPlus, href: '/people/new', color: themeConfig.colors.primary },
    { name: 'Create Report', icon: FileText, href: '/reports/new', color: themeConfig.colors.accent },
    { name: 'Schedule Event', icon: Calendar, href: '/events/new', color: '#10B981' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
          Dashboard
        </h1>
        <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Welcome back! Here's what's happening in your church.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="p-6 rounded-lg shadow-sm border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: stat.color + '20' }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.name}
                className="p-4 rounded-lg border text-left hover:shadow-md transition-shadow"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: action.color + '20' }}>
                    <Icon size={20} style={{ color: action.color }} />
                  </div>
                  <span className="ml-3 font-medium" style={{ color: themeConfig.colors.text }}>
                    {action.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Activity
        </h2>
        <div 
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center py-2">
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: themeConfig.colors.primary }}></div>
              <div>
                <p style={{ color: themeConfig.colors.text }}>John Smith joined Youth Committee</p>
                <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: themeConfig.colors.accent }}></div>
              <div>
                <p style={{ color: themeConfig.colors.text }}>Worship Team submitted monthly report</p>
                <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#10B981' }}></div>
              <div>
                <p style={{ color: themeConfig.colors.text }}>Sunday Service event created</p>
                <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard