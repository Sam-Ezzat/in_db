import { useTheme } from '../../contexts/ThemeContext'
import { Search, Plus, Users, User, Calendar, Book, ChevronRight, Target } from 'lucide-react'

const Groups = () => {
  const { themeConfig } = useTheme()

  // Mock data - replace with real API call
  const groups = [
    { 
      id: 1, 
      name: 'Young Adults Discipleship', 
      description: 'Spiritual growth and mentorship for ages 18-30',
      leader: 'Sarah Johnson',
      members: 12,
      church: 'Main Church',
      meetingDay: 'Wednesdays',
      meetingTime: '7:00 PM',
      status: 'Active',
      startDate: '2024-01-15',
      curriculum: 'The Purpose Driven Life',
      progress: 65
    },
    { 
      id: 2, 
      name: 'Men\'s Bible Study', 
      description: 'Brotherhood and biblical study for men of all ages',
      leader: 'Michael Brown',
      members: 8,
      church: 'Main Church',
      meetingDay: 'Saturdays',
      meetingTime: '8:00 AM',
      status: 'Active',
      startDate: '2024-02-01',
      curriculum: 'Wild at Heart',
      progress: 40
    },
    { 
      id: 3, 
      name: 'Women\'s Fellowship', 
      description: 'Sisterhood, prayer, and spiritual encouragement',
      leader: 'Emily Davis',
      members: 15,
      church: 'Branch Church East',
      meetingDay: 'Tuesdays',
      meetingTime: '10:00 AM',
      status: 'Active',
      startDate: '2024-01-08',
      curriculum: 'Proverbs 31 Woman',
      progress: 80
    },
    { 
      id: 4, 
      name: 'New Believers Course', 
      description: 'Foundation course for new Christians',
      leader: 'John Smith',
      members: 6,
      church: 'Main Church',
      meetingDay: 'Sundays',
      meetingTime: '2:00 PM',
      status: 'Active',
      startDate: '2024-02-10',
      curriculum: 'Basic Christianity',
      progress: 25
    },
  ]

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981'
    if (progress >= 60) return '#3B82F6'
    if (progress >= 40) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Discipleship Groups
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage discipleship groups and spiritual growth programs
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Plus size={20} className="mr-2" />
          Create Group
        </button>
      </div>

      {/* Search and Filter */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: themeConfig.colors.text, opacity: 0.5 }}
            />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option>All Churches</option>
            <option>Main Church</option>
            <option>Branch Church East</option>
            <option>Community Chapel</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Paused</option>
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div 
            key={group.id}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                >
                  <Book size={24} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
                    {group.name}
                  </h3>
                  <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    {group.church}
                  </p>
                </div>
              </div>
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full text-green-800"
                style={{ backgroundColor: '#10B98120' }}
              >
                {group.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm mb-4" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {group.description}
            </p>

            {/* Group Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Leader
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  {group.leader}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Members
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  {group.members}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Meetings
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  {group.meetingDay}s {group.meetingTime}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Curriculum
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  {group.curriculum}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Progress
                </span>
                <span className="text-sm font-medium" style={{ color: getProgressColor(group.progress) }}>
                  {group.progress}%
                </span>
              </div>
              <div 
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: themeConfig.colors.divider }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: getProgressColor(group.progress),
                    width: `${group.progress}%`
                  }}
                />
              </div>
            </div>

            {/* Start Date */}
            <div 
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Started
                </span>
                <span className="text-sm" style={{ color: themeConfig.colors.primary }}>
                  {new Date(group.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 rounded-lg border hover:opacity-80 transition-opacity text-sm"
                  style={{ 
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text 
                  }}
                >
                  View Attendance
                </button>
                <button 
                  className="px-3 py-1 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeConfig.colors.accent }}
                >
                  Manage
                </button>
              </div>
              <ChevronRight size={20} style={{ color: themeConfig.colors.text, opacity: 0.4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: themeConfig.colors.primary }}>
            {groups.length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Active Groups
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: themeConfig.colors.accent }}>
            {groups.reduce((sum, group) => sum + group.members, 0)}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Total Disciples
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: themeConfig.colors.primary }}>
            {Math.round(groups.reduce((sum, group) => sum + group.progress, 0) / groups.length)}%
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Avg Progress
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: themeConfig.colors.accent }}>
            {groups.filter(g => g.progress >= 80).length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Near Completion
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Group Activity
        </h2>
        <div 
          className="rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                >
                  <Target size={16} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Women's Fellowship completed Chapter 8
                  </p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: themeConfig.colors.accent + '20' }}
                >
                  <Users size={16} style={{ color: themeConfig.colors.accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    New member joined Young Adults Discipleship
                  </p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                >
                  <Book size={16} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    New Believers Course started new curriculum
                  </p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    1 week ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groups