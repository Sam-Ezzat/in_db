import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  ArrowLeft, Users, User, Calendar, Clock, Edit, MapPin, Phone, Mail,
  Activity, MessageSquare, FileText, Target, Award, CheckCircle
} from 'lucide-react'
import { useState } from 'react'

interface Team {
  id: number
  name: string
  description: string
  leader: string
  leaderId: string
  leaderEmail: string
  leaderPhone: string
  members: TeamMember[]
  church: string
  churchId: number
  status: 'Active' | 'Inactive'
  createdDate: string
  lastActivity: string
  meetingSchedule: string
  meetingLocation: string
  purpose: string
  goals: string[]
  responsibilities: string[]
  resources: TeamResource[]
  upcomingEvents: TeamEvent[]
}

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  joinDate: string
  status: 'Active' | 'Inactive'
  attendance: number
  skills: string[]
}

interface TeamResource {
  id: number
  name: string
  type: 'Document' | 'Equipment' | 'Facility' | 'Training'
  description: string
  location?: string
  availability: 'Available' | 'In Use' | 'Maintenance'
}

interface TeamEvent {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: 'Meeting' | 'Training' | 'Service' | 'Social'
  attendees: number
}

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'schedule' | 'resources'>('overview')

  // Mock data - replace with API call
  const team: Team = {
    id: parseInt(id || '1'),
    name: 'Youth Ministry Team',
    description: 'Engaging and discipling young people ages 13-25 through dynamic programs, events, and mentorship opportunities.',
    leader: 'Sarah Johnson',
    leaderId: '2',
    leaderEmail: 'sarah.johnson@gracechurch.org',
    leaderPhone: '+1 (555) 123-4568',
    church: 'Grace Community Church',
    churchId: 1,
    status: 'Active',
    createdDate: '2020-03-15',
    lastActivity: '2 days ago',
    meetingSchedule: 'Fridays 7:00 PM',
    meetingLocation: 'Youth Room, Main Building',
    purpose: 'To create a welcoming community where young people can grow in their faith, develop meaningful relationships, and discover their God-given purpose.',
    goals: [
      'Increase youth engagement by 30% this year',
      'Launch 3 new discipleship groups',
      'Organize 6 community service projects',
      'Establish mentorship program'
    ],
    responsibilities: [
      'Plan and execute weekly youth gatherings',
      'Coordinate youth camps and retreats',
      'Provide pastoral care and counseling',
      'Manage youth ministry budget and resources',
      'Develop and implement discipleship curriculum',
      'Organize community outreach events'
    ],
    members: [
      { id: 1, name: 'Sarah Johnson', email: 'sarah@church.org', role: 'Team Leader', joinDate: '2020-03-15', status: 'Active', attendance: 95, skills: ['Leadership', 'Teaching', 'Event Planning'] },
      { id: 2, name: 'Mike Wilson', email: 'mike@church.org', role: 'Assistant Leader', joinDate: '2020-06-01', status: 'Active', attendance: 88, skills: ['Music', 'Technology', 'Mentoring'] },
      { id: 3, name: 'Jessica Chen', email: 'jessica@church.org', role: 'Small Group Leader', joinDate: '2021-01-10', status: 'Active', attendance: 92, skills: ['Counseling', 'Teaching', 'Prayer'] },
      { id: 4, name: 'David Rodriguez', email: 'david@church.org', role: 'Events Coordinator', joinDate: '2021-09-05', status: 'Active', attendance: 85, skills: ['Event Planning', 'Photography', 'Sports'] },
      { id: 5, name: 'Emma Thompson', email: 'emma@church.org', role: 'Volunteer', joinDate: '2022-02-20', status: 'Active', attendance: 78, skills: ['Creative Arts', 'Social Media', 'Drama'] }
    ],
    resources: [
      { id: 1, name: 'Youth Ministry Curriculum', type: 'Document', description: 'Complete teaching materials for weekly sessions', availability: 'Available' },
      { id: 2, name: 'Sound System', type: 'Equipment', description: 'Portable PA system for events', location: 'Youth Room Storage', availability: 'Available' },
      { id: 3, name: 'Youth Room', type: 'Facility', description: 'Main meeting space with capacity for 80 people', location: 'Main Building, Second Floor', availability: 'In Use' },
      { id: 4, name: 'Leadership Training Videos', type: 'Training', description: 'Online course for team member development', availability: 'Available' },
      { id: 5, name: 'Games Equipment', type: 'Equipment', description: 'Sports equipment and board games', location: 'Youth Room Storage', availability: 'Available' }
    ],
    upcomingEvents: [
      { id: 1, title: 'Weekly Youth Night', date: '2024-01-26', time: '7:00 PM', location: 'Youth Room', type: 'Meeting', attendees: 45 },
      { id: 2, title: 'Team Planning Meeting', date: '2024-01-28', time: '2:00 PM', location: 'Conference Room A', type: 'Meeting', attendees: 5 },
      { id: 3, title: 'Community Service Project', date: '2024-02-03', time: '9:00 AM', location: 'Local Food Bank', type: 'Service', attendees: 25 },
      { id: 4, title: 'Leadership Training', date: '2024-02-10', time: '10:00 AM', location: 'Main Sanctuary', type: 'Training', attendees: 15 }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
        return '#10B981'
      case 'Inactive':
      case 'Maintenance':
        return '#EF4444'
      case 'In Use':
        return '#F59E0B'
      default:
        return themeConfig.colors.text
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'Meeting': return <MessageSquare size={16} />
      case 'Training': return <Award size={16} />
      case 'Service': return <Activity size={16} />
      case 'Social': return <Users size={16} />
      default: return <Calendar size={16} />
    }
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileText size={16} />
      case 'Equipment': return <Activity size={16} />
      case 'Facility': return <MapPin size={16} />
      case 'Training': return <Award size={16} />
      default: return <FileText size={16} />
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/teams')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Teams
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {team.name}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {team.church} • Led by {team.leader}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/teams/${team.id}/edit`)}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Edit size={20} className="mr-2" />
          Edit Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Info Card */}
        <div 
          className="lg:col-span-1 p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-center mb-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeConfig.colors.primary + '20' }}
            >
              <Users size={40} style={{ color: themeConfig.colors.primary }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: themeConfig.colors.text }}>
              {team.name}
            </h2>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {team.church}
            </p>
            <div className="flex justify-center mt-2">
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: getStatusColor(team.status) + '20',
                  color: getStatusColor(team.status)
                }}
              >
                {team.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                Team Leader
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                  <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    {team.leader}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                    {team.leaderEmail}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                    {team.leaderPhone}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                Meeting Schedule
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                    {team.meetingSchedule}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                    {team.meetingLocation}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                Team Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
                    {team.members.length}
                  </div>
                  <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: themeConfig.colors.accent }}>
                    {Math.round(team.members.reduce((sum, member) => sum + member.attendance, 0) / team.members.length)}%
                  </div>
                  <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Avg Attendance
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
                    {team.resources.length}
                  </div>
                  <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Resources
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: themeConfig.colors.accent }}>
                    {team.upcomingEvents.length}
                  </div>
                  <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Upcoming Events
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: themeConfig.colors.divider }}>
            {[
              { key: 'overview', label: 'Overview', icon: Users },
              { key: 'members', label: 'Members', icon: User },
              { key: 'schedule', label: 'Schedule', icon: Calendar },
              { key: 'resources', label: 'Resources', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key ? 'border-current' : 'border-transparent'
                }`}
                style={{ 
                  color: activeTab === key ? themeConfig.colors.primary : themeConfig.colors.text + '80'
                }}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Purpose */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  Purpose & Mission
                </h3>
                <p style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {team.purpose}
                </p>
              </div>

              {/* Goals */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  Team Goals
                </h3>
                <div className="space-y-2">
                  {team.goals.map((goal, index) => (
                    <div key={index} className="flex items-start">
                      <Target size={16} className="mr-3 mt-1" style={{ color: themeConfig.colors.primary }} />
                      <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                        {goal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  Key Responsibilities
                </h3>
                <div className="space-y-2">
                  {team.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={16} className="mr-3 mt-1" style={{ color: themeConfig.colors.accent }} />
                      <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                        {responsibility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {team.members.map((member) => (
                  <div key={member.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                        >
                          <User size={24} style={{ color: themeConfig.colors.primary }} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                            {member.name}
                          </h4>
                          <p className="text-sm font-medium" style={{ color: themeConfig.colors.primary }}>
                            {member.role}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                              <Mail size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {member.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                Joined: {new Date(member.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-1" style={{ color: themeConfig.colors.text }}>
                              Skills:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full"
                                  style={{ 
                                    backgroundColor: themeConfig.colors.accent + '20',
                                    color: themeConfig.colors.accent
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span 
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: getStatusColor(member.status) + '20',
                            color: getStatusColor(member.status)
                          }}
                        >
                          {member.status}
                        </span>
                        <p className="text-sm mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          Attendance: {member.attendance}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: themeConfig.colors.divider }}>
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Upcoming Events
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {team.upcomingEvents.map((event) => (
                  <div key={event.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                        >
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                            {event.title}
                          </h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {new Date(event.date).toLocaleDateString()} at {event.time}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {event.attendees} expected attendees
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span 
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {team.resources.map((resource) => (
                  <div key={resource.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: themeConfig.colors.accent + '20' }}
                        >
                          {getResourceTypeIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                            {resource.name}
                          </h4>
                          <p className="text-sm mt-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                            {resource.description}
                          </p>
                          {resource.location && (
                            <div className="flex items-center mt-2">
                              <MapPin size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                                {resource.location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span 
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: themeConfig.colors.primary + '20',
                            color: themeConfig.colors.primary
                          }}
                        >
                          {resource.type}
                        </span>
                        <div className="mt-2">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: getStatusColor(resource.availability) + '20',
                              color: getStatusColor(resource.availability)
                            }}
                          >
                            {resource.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamDetail