import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RequirePermission from '../../components/Auth/RequirePermission'
import { 
  UsersIcon, CalendarIcon, MapPinIcon, ClockIcon,
  AcademicCapIcon, ChartBarIcon, PlusIcon, PencilIcon,
  UserPlusIcon, EnvelopeIcon, PhoneIcon, CheckCircleIcon,
  XCircleIcon, ArrowLeftIcon, UserMinusIcon,
  DocumentTextIcon, PhotoIcon, LinkIcon, BookOpenIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { groupService, type Group, type GroupMember, type GroupActivity, type GroupAttendance } from '../../services/groupService'

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [group, setGroup] = useState<Group | null>(null)
  const [activities, setActivities] = useState<GroupActivity[]>([])
  const [attendance, setAttendance] = useState<GroupAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activities' | 'attendance' | 'resources'>('overview')

  useEffect(() => {
    loadGroupData()
  }, [id])

  const loadGroupData = async () => {
    if (!id) return

    try {
      setLoading(true)
      const [groupData, activitiesData, attendanceData] = await Promise.all([
        groupService.getGroupById(id),
        groupService.getGroupActivities(id, { limit: 10 }),
        groupService.getGroupAttendance(id, { limit: 10 })
      ])

      setGroup(groupData)
      setActivities(activitiesData)
      setAttendance(attendanceData)
    } catch (error) {
      console.error('Error loading group data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!group) return

    if (confirm('Are you sure you want to remove this member from the group?')) {
      try {
        await groupService.removeMemberFromGroup(group.id, memberId)
        await loadGroupData() // Refresh data
      } catch (error) {
        console.error('Error removing member:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'planning': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getMemberRoleColor = (role: string) => {
    switch (role) {
      case 'leader': return 'text-purple-600 bg-purple-100'
      case 'co-leader': return 'text-blue-600 bg-blue-100'
      case 'member': return 'text-green-600 bg-green-100'
      case 'visitor': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: ChartBarIcon },
    { key: 'members', label: 'Members', icon: UsersIcon },
    { key: 'activities', label: 'Activities', icon: CalendarIcon },
    { key: 'attendance', label: 'Attendance', icon: CheckCircleIcon },
    { key: 'resources', label: 'Resources', icon: BookOpenIcon }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Group not found</h3>
        <p className="text-gray-500 mb-4">The group you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/groups')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Groups
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-500">{group.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group.status)}`}>
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </span>
          <RequirePermission resource="groups" action="update">
            <button
              onClick={() => navigate(`/groups/${group.id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Group</span>
            </button>
          </RequirePermission>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">{group.currentSize}/{group.maxMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{group.stats.averageAttendance.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{group.progress.completionRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Session</p>
              <p className="text-2xl font-bold text-gray-900">{group.progress.currentSession}/{group.progress.totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Group Information */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Leader:</span>
                  <span className="text-sm font-medium">{group.leaderName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Schedule:</span>
                  <span className="text-sm font-medium">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][group.schedule.dayOfWeek]} at {group.schedule.time}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{group.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">{group.schedule.duration} minutes</span>
                </div>
                {group.contactInfo.email && (
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{group.contactInfo.email}</span>
                  </div>
                )}
                {group.contactInfo.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{group.contactInfo.phone}</span>
                  </div>
                )}
              </div>
              
              {group.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button
                  onClick={() => setActiveTab('activities')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 py-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'meeting' ? 'bg-blue-500' :
                      activity.type === 'study' ? 'bg-green-500' :
                      activity.type === 'service' ? 'bg-purple-500' :
                      activity.type === 'social' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.date.toLocaleDateString()} • {activity.attendance} attendees
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
                )}
              </div>
            </div>

            {/* Curriculum Progress */}
            {group.curriculum && (
              <div className="bg-white rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Progress</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{group.curriculum.name}</span>
                    <span className="text-sm text-gray-500">{group.progress.completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${group.progress.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {group.curriculum.sessions.slice(0, 8).map((session, index) => (
                    <div 
                      key={session.sessionNumber}
                      className={`p-3 rounded-lg border ${
                        index < group.progress.currentSession 
                          ? 'bg-green-50 border-green-200' 
                          : index === group.progress.currentSession 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {index < group.progress.currentSession ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        ) : index === group.progress.currentSession ? (
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-xs font-medium">Session {session.sessionNumber}</span>
                      </div>
                      <p className="text-xs text-gray-600">{session.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
              <RequirePermission resource="groups" action="update">
                <button
                  onClick={() => alert('Add member functionality coming soon!')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </RequirePermission>
            </div>

            <div className="bg-white rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.personName}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMemberRoleColor(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.attendanceRate.toFixed(1)}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-green-600 h-1 rounded-full" 
                              style={{ width: `${member.attendanceRate}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.joinedAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.status === 'active' ? 'text-green-800 bg-green-100' :
                            member.status === 'inactive' ? 'text-red-800 bg-red-100' :
                            'text-yellow-800 bg-yellow-100'
                          }`}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <RequirePermission resource="groups" action="update">
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              <UserMinusIcon className="h-4 w-4" />
                            </button>
                          </RequirePermission>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Group Activities</h3>
              <RequirePermission resource="groups" action="update">
                <button
                  onClick={() => alert('Add activity functionality coming soon!')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Activity</span>
                </button>
              </RequirePermission>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{activity.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.type === 'meeting' ? 'text-blue-800 bg-blue-100' :
                          activity.type === 'study' ? 'text-green-800 bg-green-100' :
                          activity.type === 'service' ? 'text-purple-800 bg-purple-100' :
                          activity.type === 'social' ? 'text-orange-800 bg-orange-100' :
                          'text-gray-800 bg-gray-100'
                        }`}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{activity.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{activity.duration} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{activity.attendance} attendees</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      {activity.notes && (
                        <p className="text-sm text-gray-600 mt-3 italic">"{activity.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                  <p className="text-gray-500">Activities and meetings will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
            
            <div className="space-y-4">
              {attendance.map((record) => (
                <div key={record.id} className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {record.date.toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {record.totalPresent} of {record.totalMembers} members present ({record.attendanceRate.toFixed(1)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{record.attendanceRate.toFixed(0)}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${record.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {record.memberAttendance.map((ma) => (
                      <div key={ma.memberId} className={`p-3 rounded-lg ${
                        ma.present ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {ma.present ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">{ma.memberName}</span>
                        </div>
                        {ma.lateMinutes && (
                          <p className="text-xs text-orange-600 mt-1">Late by {ma.lateMinutes} minutes</p>
                        )}
                        {ma.notes && (
                          <p className="text-xs text-gray-600 mt-1">{ma.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {record.specialNotes && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{record.specialNotes}</p>
                    </div>
                  )}
                </div>
              ))}
              {attendance.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
                  <p className="text-gray-500">Attendance records will appear here once you start tracking.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Group Resources</h3>
              <RequirePermission resource="groups" action="update">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Resource</span>
                </button>
              </RequirePermission>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {resource.type === 'book' && <BookOpenIcon className="h-6 w-6 text-blue-600" />}
                      {resource.type === 'video' && <PhotoIcon className="h-6 w-6 text-red-600" />}
                      {resource.type === 'document' && <DocumentTextIcon className="h-6 w-6 text-green-600" />}
                      {resource.type === 'link' && <LinkIcon className="h-6 w-6 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{resource.name}</h4>
                      {resource.description && (
                        <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                      )}
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {group.resources.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
                  <p className="text-gray-500">Add study materials, books, or other resources for your group.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetail