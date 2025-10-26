import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, 
  Activity, Users, MessageSquare, Edit,
  UserCheck, Award, Heart, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface Person {
  id: number
  name: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  joinDate: string
  role: string
  status: 'Active' | 'Inactive'
  church: string
  churchId: number
  bio: string
  profileImage?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  baptismDate?: string
  membershipLevel: 'Member' | 'Leader' | 'Pastor' | 'Visitor'
  skills: string[]
  interests: string[]
}

interface Activity {
  id: number
  type: 'Event' | 'Group' | 'Service' | 'Meeting'
  title: string
  date: string
  status: 'Attended' | 'Missed' | 'Upcoming'
  description?: string
}

interface GroupParticipation {
  id: number
  groupName: string
  role: string
  joinDate: string
  status: 'Active' | 'Inactive'
  attendance: number
}

interface CommunicationLog {
  id: number
  type: 'Email' | 'Phone' | 'Visit' | 'Message'
  date: string
  subject: string
  notes: string
  contactedBy: string
}

const PersonDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'groups' | 'communications'>('overview')

  // Mock data - replace with API call
  const person: Person = {
    id: parseInt(id || '1'),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    dateOfBirth: '1985-06-15',
    joinDate: '2020-03-10',
    role: 'Pastor',
    status: 'Active',
    church: 'Grace Community Church',
    churchId: 1,
    bio: 'John has been serving our community for over 4 years. He is passionate about discipleship and youth ministry. His heart for people and dedication to God\'s word make him an invaluable part of our church family.',
    emergencyContact: {
      name: 'Mary Smith',
      phone: '+1 (555) 123-4568',
      relationship: 'Spouse'
    },
    baptismDate: '2019-12-25',
    membershipLevel: 'Pastor',
    skills: ['Leadership', 'Teaching', 'Counseling', 'Youth Ministry'],
    interests: ['Reading', 'Music', 'Sports', 'Community Service']
  }

  const activities: Activity[] = [
    { id: 1, type: 'Event', title: 'Sunday Morning Service', date: '2024-01-14', status: 'Attended', description: 'Led worship service' },
    { id: 2, type: 'Group', title: 'Men\'s Bible Study', date: '2024-01-12', status: 'Attended', description: 'Discussion on Romans 8' },
    { id: 3, type: 'Service', title: 'Community Outreach', date: '2024-01-10', status: 'Attended', description: 'Food bank volunteer' },
    { id: 4, type: 'Meeting', title: 'Leadership Meeting', date: '2024-01-08', status: 'Attended', description: 'Monthly planning session' },
    { id: 5, type: 'Event', title: 'Youth Group', date: '2024-01-21', status: 'Upcoming', description: 'Teaching session' }
  ]

  const groupParticipations: GroupParticipation[] = [
    { id: 1, groupName: 'Leadership Team', role: 'Lead Pastor', joinDate: '2020-03-10', status: 'Active', attendance: 95 },
    { id: 2, groupName: 'Men\'s Ministry', role: 'Member', joinDate: '2020-04-15', status: 'Active', attendance: 88 },
    { id: 3, groupName: 'Worship Team', role: 'Advisor', joinDate: '2020-06-01', status: 'Active', attendance: 92 }
  ]

  const communications: CommunicationLog[] = [
    { id: 1, type: 'Email', date: '2024-01-14', subject: 'Weekly Update', notes: 'Sent weekly newsletter and updates', contactedBy: 'System' },
    { id: 2, type: 'Phone', date: '2024-01-12', subject: 'Prayer Request Follow-up', notes: 'Checked on family situation, offered support', contactedBy: 'Sarah Johnson' },
    { id: 3, type: 'Visit', date: '2024-01-10', subject: 'Home Visit', notes: 'Visited for fellowship and prayer', contactedBy: 'Michael Brown' },
    { id: 4, type: 'Message', date: '2024-01-08', subject: 'Ministry Discussion', notes: 'Discussed upcoming youth ministry plans', contactedBy: 'Emily Davis' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Attended':
        return '#10B981'
      case 'Inactive':
      case 'Missed':
        return '#EF4444'
      case 'Upcoming':
        return '#F59E0B'
      default:
        return themeConfig.colors.text
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Event': return <Calendar size={16} />
      case 'Group': return <Users size={16} />
      case 'Service': return <Heart size={16} />
      case 'Meeting': return <MessageSquare size={16} />
      case 'Email': return <Mail size={16} />
      case 'Phone': return <Phone size={16} />
      case 'Visit': return <User size={16} />
      case 'Message': return <MessageSquare size={16} />
      default: return <Activity size={16} />
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/people')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to People
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {person.name}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {person.role} • {person.church}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/people/${person.id}/edit`)}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Edit size={20} className="mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
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
              <User size={40} style={{ color: themeConfig.colors.primary }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: themeConfig.colors.text }}>
              {person.name}
            </h2>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {person.role}
            </p>
            <div className="flex justify-center mt-2">
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: getStatusColor(person.status) + '20',
                  color: getStatusColor(person.status)
                }}
              >
                {person.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Mail size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                {person.email}
              </span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                {person.phone}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                {person.address}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                Born: {new Date(person.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <UserCheck size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                Joined: {new Date(person.joinDate).toLocaleDateString()}
              </span>
            </div>
            {person.baptismDate && (
              <div className="flex items-center">
                <Award size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                  Baptized: {new Date(person.baptismDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
            <h3 className="font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
              Emergency Contact
            </h3>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: themeConfig.colors.text }}>
                <strong>{person.emergencyContact.name}</strong>
              </p>
              <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                {person.emergencyContact.relationship}
              </p>
              <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                {person.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: themeConfig.colors.divider }}>
            {[
              { key: 'overview', label: 'Overview', icon: User },
              { key: 'activity', label: 'Activity History', icon: Activity },
              { key: 'groups', label: 'Group Participation', icon: Users },
              { key: 'communications', label: 'Communications', icon: MessageSquare }
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
              {/* Bio */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  About
                </h3>
                <p style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {person.bio}
                </p>
              </div>

              {/* Skills & Interests */}
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.primary + '20',
                          color: themeConfig.colors.primary
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {person.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                        >
                          {getTypeIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                            {activity.title}
                          </p>
                          <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {activity.type} • {new Date(activity.date).toLocaleDateString()}
                          </p>
                          {activity.description && (
                            <p className="text-sm mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: getStatusColor(activity.status) + '20',
                          color: getStatusColor(activity.status)
                        }}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {groupParticipations.map((group) => (
                  <div key={group.id} className="p-4 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: themeConfig.colors.accent + '20' }}
                        >
                          <Users size={16} style={{ color: themeConfig.colors.accent }} />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                            {group.groupName}
                          </p>
                          <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {group.role} • Joined {new Date(group.joinDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            Attendance: {group.attendance}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full mr-2"
                          style={{ 
                            backgroundColor: getStatusColor(group.status) + '20',
                            color: getStatusColor(group.status)
                          }}
                        >
                          {group.status}
                        </span>
                        <ChevronRight size={16} style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {communications.map((comm) => (
                  <div key={comm.id} className="p-4 hover:opacity-80 transition-opacity">
                    <div className="flex items-start">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1"
                        style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                      >
                        {getTypeIcon(comm.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                            {comm.subject}
                          </p>
                          <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {new Date(comm.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          {comm.type} • By {comm.contactedBy}
                        </p>
                        <p className="text-sm mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                          {comm.notes}
                        </p>
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

export default PersonDetail