import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, User, Building, FileText, ChevronRight } from 'lucide-react'

const Committees = () => {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()

  // Mock data - replace with real API call
  const committees = [
    { 
      id: 1, 
      name: 'Finance Committee', 
      description: 'Oversees church finances, budgets, and financial planning',
      chairperson: 'David Wilson',
      members: 6,
      church: 'Main Church',
      meetingFrequency: 'Monthly',
      nextMeeting: '2024-02-15',
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Missions Committee', 
      description: 'Plans and coordinates local and international mission work',
      chairperson: 'Linda Martinez',
      members: 8,
      church: 'Main Church',
      meetingFrequency: 'Bi-weekly',
      nextMeeting: '2024-02-08',
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Building & Grounds', 
      description: 'Maintains church facilities and oversees property matters',
      chairperson: 'Robert Taylor',
      members: 5,
      church: 'Branch Church East',
      meetingFrequency: 'Monthly',
      nextMeeting: '2024-02-20',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Nominating Committee', 
      description: 'Identifies and recommends candidates for church leadership',
      chairperson: 'Mary Anderson',
      members: 4,
      church: 'Main Church',
      meetingFrequency: 'Quarterly',
      nextMeeting: '2024-03-01',
      status: 'Active'
    },
  ]

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return '#10B981'
      case 'Bi-weekly': return '#3B82F6'
      case 'Monthly': return '#F59E0B'
      case 'Quarterly': return '#8B5CF6'
      default: return themeConfig.colors.primary
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Committees Management
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Organize and track church committees and their activities
          </p>
        </div>
        <button
          onClick={() => navigate('/committees/new')}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Plus size={20} className="mr-2" />
          Create Committee
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
              placeholder="Search committees..."
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
            <option>All Frequencies</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
          </select>
        </div>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {committees.map((committee) => (
          <div 
            key={committee.id}
            onClick={() => navigate(`/committees/${committee.id}`)}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {/* Committee Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                >
                  <FileText size={24} style={{ color: themeConfig.colors.primary }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
                    {committee.name}
                  </h3>
                  <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    {committee.church}
                  </p>
                </div>
              </div>
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full text-green-800"
                style={{ backgroundColor: '#10B98120' }}
              >
                {committee.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm mb-4" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.description}
            </p>

            {/* Committee Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Chairperson
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  {committee.chairperson}
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
                  {committee.members}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Frequency
                  </span>
                </div>
                <span 
                  className="px-2 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: getFrequencyColor(committee.meetingFrequency) }}
                >
                  {committee.meetingFrequency}
                </span>
              </div>
            </div>

            {/* Next Meeting */}
            <div 
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Next Meeting
                </span>
                <span className="text-sm" style={{ color: themeConfig.colors.primary }}>
                  {new Date(committee.nextMeeting).toLocaleDateString()}
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
                  View Minutes
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
            {committees.length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Active Committees
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
            {committees.reduce((sum, committee) => sum + committee.members, 0)}
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
            {committees.filter(c => c.nextMeeting && new Date(c.nextMeeting) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Meetings This Week
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
            {Math.round(committees.reduce((sum, committee) => sum + committee.members, 0) / committees.length)}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Avg Committee Size
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: themeConfig.colors.text }}>
          Upcoming Meetings
        </h2>
        <div 
          className="rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
            {committees
              .sort((a, b) => new Date(a.nextMeeting).getTime() - new Date(b.nextMeeting).getTime())
              .slice(0, 3)
              .map((committee) => (
                <div key={committee.id} className="p-4 flex items-center justify-between hover:opacity-80 transition-opacity">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                    >
                      <FileText size={20} style={{ color: themeConfig.colors.primary }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                        {committee.name}
                      </p>
                      <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        {committee.church} • {committee.meetingFrequency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium" style={{ color: themeConfig.colors.primary }}>
                      {new Date(committee.nextMeeting).toLocaleDateString()}
                    </p>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {Math.ceil((new Date(committee.nextMeeting).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Committees