import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { 
  UsersIcon, AcademicCapIcon, CalendarIcon, 
  PlusIcon, MagnifyingGlassIcon, ClockIcon,
  MapPinIcon, UserIcon, EllipsisVerticalIcon,
  PencilIcon, TrashIcon, ChartBarIcon, EyeIcon,
  FunnelIcon, ArrowsUpDownIcon
} from '@heroicons/react/24/outline'
import { groupService, type Group, type GroupSummary } from '../../services/groupService'

const Groups: React.FC = () => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  
  const [groups, setGroups] = useState<Group[]>([])
  const [summary, setSummary] = useState<GroupSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'status' | 'progress'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [groupsData, summaryData] = await Promise.all([
        groupService.getGroups({ churchId: '1' }),
        groupService.getGroupSummary('1')
      ])
      setGroups(groupsData.groups)
      setSummary(summaryData)
    } catch (error) {
      console.error('Error loading groups data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      try {
        await groupService.deleteGroup(groupId)
        await loadData() // Refresh data
      } catch (error) {
        console.error('Error deleting group:', error)
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bible-study': return 'text-blue-600 bg-blue-100'
      case 'discipleship': return 'text-green-600 bg-green-100'
      case 'youth': return 'text-orange-600 bg-orange-100'
      case 'seniors': return 'text-purple-600 bg-purple-100'
      case 'small-group': return 'text-indigo-600 bg-indigo-100'
      case 'ministry': return 'text-red-600 bg-red-100'
      case 'fellowship': return 'text-pink-600 bg-pink-100'
      case 'prayer': return 'text-teal-600 bg-teal-100'
      case 'service': return 'text-amber-600 bg-amber-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Filter and sort groups
  const filteredAndSortedGroups = groups
    .filter(group => {
      const matchesSearch = !searchTerm || 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || group.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'members':
          aValue = a.currentSize
          bValue = b.currentSize
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'progress':
          aValue = a.progress.completionRate
          bValue = b.progress.completionRate
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'bible-study', label: 'Bible Study' },
    { value: 'discipleship', label: 'Discipleship' },
    { value: 'youth', label: 'Youth' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'small-group', label: 'Small Group' },
    { value: 'ministry', label: 'Ministry' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'prayer', label: 'Prayer' },
    { value: 'service', label: 'Service' }
  ]

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'planning', label: 'Planning' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'inactive', label: 'Inactive' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500">Manage discipleship groups and ministry teams</p>
        </div>
        <RequirePermission resource="groups" action="create">
          <button
            onClick={() => navigate('/groups/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Group</span>
          </button>
        </RequirePermission>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${themeConfig.cardBackground} rounded-lg p-4`}>
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalGroups}</p>
              </div>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBackground} rounded-lg p-4`}>
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Groups</p>
                <p className="text-2xl font-bold text-gray-900">{summary.activeGroups}</p>
              </div>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBackground} rounded-lg p-4`}>
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalMembers}</p>
              </div>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBackground} rounded-lg p-4`}>
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{summary.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={`${themeConfig.cardBackground} rounded-lg p-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Members</option>
              <option value="status">Sort by Status</option>
              <option value="progress">Sort by Progress</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowsUpDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedGroups.map((group) => (
          <div key={group.id} className={`${themeConfig.cardBackground} rounded-lg p-6 hover:shadow-lg transition-shadow`}>
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
              </div>
              <div className="ml-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Group Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(group.category)}`}>
                  {group.category.charAt(0).toUpperCase() + group.category.slice(1).replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(group.status)}`}>
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>{group.leaderName}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>{group.currentSize}/{group.maxMembers} members</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][group.schedule.dayOfWeek]} at {group.schedule.time}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>{group.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{group.schedule.duration} minutes</span>
              </div>
            </div>

            {/* Progress Bar */}
            {group.curriculum && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Progress</span>
                  <span className="text-xs text-gray-500">{group.progress.completionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${group.progress.completionRate}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Session {group.progress.currentSession} of {group.progress.totalSessions}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Details</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <RequirePermission resource="groups" action="update">
                  <button
                    onClick={() => navigate(`/groups/${group.id}/edit`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </RequirePermission>
                
                <RequirePermission resource="groups" action="delete">
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </RequirePermission>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedGroups.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
              ? 'No groups found' 
              : 'No groups yet'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first group.'
            }
          </p>
          {(!searchTerm && selectedCategory === 'all' && selectedStatus === 'all') && (
            <RequirePermission resource="groups" action="create">
              <button
                onClick={() => navigate('/groups/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create First Group
              </button>
            </RequirePermission>
          )}
        </div>
      )}
    </div>
  )
}

export default Groups