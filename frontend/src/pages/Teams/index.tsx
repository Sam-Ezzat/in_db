import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, User, Calendar, ChevronRight } from 'lucide-react'

const Teams = () => {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()

  // Mock data - replace with real API call
  const teams = [
    { 
      id: 1, 
      name: 'Youth Ministry', 
      description: 'Engaging and discipling young people ages 13-25',
      leader: 'Sarah Johnson',
      members: 28,
      church: 'Main Church',
      status: 'Active',
      lastActivity: '2 days ago'
    },
    { 
      id: 2, 
      name: 'Worship Team', 
      description: 'Leading the congregation in worship through music',
      leader: 'Michael Brown',
      members: 12,
      church: 'Main Church',
      status: 'Active',
      lastActivity: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Children\'s Ministry', 
      description: 'Teaching and caring for children during services',
      leader: 'Emily Davis',
      members: 15,
      church: 'Branch Church East',
      status: 'Active',
      lastActivity: '3 days ago'
    },
    { 
      id: 4, 
      name: 'Prayer Team', 
      description: 'Interceding for the church and community needs',
      leader: 'John Smith',
      members: 8,
      church: 'Main Church',
      status: 'Active',
      lastActivity: '1 week ago'
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Teams Management
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Organize and manage ministry teams across all churches
          </p>
        </div>
        <button
          onClick={() => navigate('/teams/new')}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Plus size={20} className="mr-2" />
          Create Team
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
              placeholder="Search teams..."
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
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-4">
        {teams.map((team) => (
          <div 
            key={team.id}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                  >
                    <Users size={20} style={{ color: themeConfig.colors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: themeConfig.colors.text }}>
                      {team.name}
                    </h3>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {team.church}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm mb-4" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {team.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                    <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      Leader: <span className="font-medium">{team.leader}</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                    <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {team.members} members
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                    <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      Active {team.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full text-green-800"
                  style={{ backgroundColor: '#10B98120' }}
                >
                  {team.status}
                </span>
                <ChevronRight size={20} style={{ color: themeConfig.colors.text, opacity: 0.4 }} />
              </div>
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
            {teams.length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Active Teams
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
            {teams.reduce((sum, team) => sum + team.members, 0)}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Total Members
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
            {Math.round(teams.reduce((sum, team) => sum + team.members, 0) / teams.length)}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Avg Team Size
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
            3
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Churches Covered
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Team Activity
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
                  <Users size={16} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    New member joined Worship Team
                  </p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    2 hours ago
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
                  <Calendar size={16} style={{ color: themeConfig.colors.accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Youth Ministry scheduled new event
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
                  style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                >
                  <User size={16} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Prayer Team leader updated
                  </p>
                  <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    3 days ago
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

export default Teams