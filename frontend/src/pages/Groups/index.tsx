import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  UsersIcon, AcademicCapIcon, CalendarIcon, 
  PlusIcon, MagnifyingGlassIcon, ClockIcon,
  MapPinIcon, UserIcon, EllipsisVerticalIcon,
  PencilIcon, TrashIcon, ChartBarIcon
} from '@heroicons/react/24/outline'

interface Group {
  id: string
  name: string
  description: string
  category: 'bible-study' | 'discipleship' | 'youth' | 'seniors' | 'small-group' | 'ministry'
  leader: string
  members: number
  maxMembers: number
  meetingDay: string
  meetingTime: string
  location: string
  status: 'active' | 'inactive' | 'paused'
  progress: number
  curriculum?: string
  nextMeeting: string
}

const Groups: React.FC = () => {
  const { themeConfig } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock data for groups
  const groups: Group[] = [
    {
      id: '1',
      name: 'New Believers Class',
      description: 'Foundation course for new Christians covering basic beliefs and practices',
      category: 'discipleship',
      leader: 'Pastor John Smith',
      members: 12,
      maxMembers: 15,
      meetingDay: 'Sunday',
      meetingTime: '11:30 AM',
      location: 'Room 101',
      status: 'active',
      progress: 65,
      curriculum: 'Starting Point Series',
      nextMeeting: '2024-01-14'
    },
    {
      id: '2',
      name: 'Young Adults Fellowship',
      description: 'Community group for ages 18-30 focusing on life application and fellowship',
      category: 'youth',
      leader: 'Sarah Johnson',
      members: 24,
      maxMembers: 30,
      meetingDay: 'Friday',
      meetingTime: '7:00 PM',
      location: 'Youth Center',
      status: 'active',
      progress: 40,
      curriculum: 'Life Together Study',
      nextMeeting: '2024-01-12'
    },
    {
      id: '3',
      name: 'Men\'s Bible Study',
      description: 'Weekly study for men focusing on leadership and spiritual growth',
      category: 'bible-study',
      leader: 'David Brown',
      members: 18,
      maxMembers: 25,
      meetingDay: 'Wednesday',
      meetingTime: '6:30 AM',
      location: 'Conference Room',
      status: 'active',
      progress: 80,
      curriculum: 'Iron Sharpens Iron',
      nextMeeting: '2024-01-10'
    },
    {
      id: '4',
      name: 'Women\'s Ministry',
      description: 'Supportive community for women with childcare and fellowship',
      category: 'ministry',
      leader: 'Mary Wilson',
      members: 32,
      maxMembers: 40,
      meetingDay: 'Thursday',
      meetingTime: '10:00 AM',
      location: 'Fellowship Hall',
      status: 'active',
      progress: 25,
      curriculum: 'Proverbs 31 Study',
      nextMeeting: '2024-01-11'
    },
    {
      id: '5',
      name: 'Senior Saints',
      description: 'Fellowship and study group for members 65 and older',
      category: 'seniors',
      leader: 'Elder Robert Davis',
      members: 16,
      maxMembers: 20,
      meetingDay: 'Tuesday',
      meetingTime: '2:00 PM',
      location: 'Senior Center',
      status: 'active',
      progress: 90,
      curriculum: 'Psalms Study',
      nextMeeting: '2024-01-09'
    },
    {
      id: '6',
      name: 'Marriage Enrichment',
      description: 'Support group for married couples focusing on relationship building',
      category: 'small-group',
      leader: 'Tom & Lisa Anderson',
      members: 8,
      maxMembers: 12,
      meetingDay: 'Saturday',
      meetingTime: '7:00 PM',
      location: 'Room 203',
      status: 'paused',
      progress: 45,
      curriculum: 'Love & Respect Series',
      nextMeeting: '2024-01-20'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Groups' },
    { value: 'bible-study', label: 'Bible Study' },
    { value: 'discipleship', label: 'Discipleship' },
    { value: 'youth', label: 'Youth' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'small-group', label: 'Small Groups' },
    { value: 'ministry', label: 'Ministry' }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      'bible-study': { bg: '#3B82F6', text: '#FFFFFF' },
      'discipleship': { bg: '#10B981', text: '#FFFFFF' },
      'youth': { bg: '#8B5CF6', text: '#FFFFFF' },
      'seniors': { bg: '#F59E0B', text: '#FFFFFF' },
      'small-group': { bg: '#EC4899', text: '#FFFFFF' },
      'ministry': { bg: '#6366F1', text: '#FFFFFF' }
    }
    return colors[category as keyof typeof colors] || { bg: '#6B7280', text: '#FFFFFF' }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: { bg: '#10B981', text: '#FFFFFF' },
      inactive: { bg: '#6B7280', text: '#FFFFFF' },
      paused: { bg: '#F59E0B', text: '#FFFFFF' }
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981' // Green
    if (progress >= 60) return '#3B82F6' // Blue
    if (progress >= 40) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalMembers = groups.reduce((sum, group) => sum + group.members, 0)
  const activeGroups = groups.filter(group => group.status === 'active').length
  const averageProgress = Math.round(groups.reduce((sum, group) => sum + group.progress, 0) / groups.length)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              Groups & Discipleship
            </h1>
            <p 
              className="mt-2"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Manage discipleship groups, small groups, and ministry teams
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              backgroundColor: themeConfig.colors.primary,
              boxShadow: `0 0 0 3px ${themeConfig.colors.primary}20`
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Group
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: themeConfig.colors.primary + '20' }}
            >
              <UsersIcon 
                className="h-6 w-6" 
                style={{ color: themeConfig.colors.primary }} 
              />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Total Groups
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                {groups.length}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500 bg-opacity-10">
              <UserIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Total Members
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                {totalMembers}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10">
              <AcademicCapIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Active Groups
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                {activeGroups}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-500 bg-opacity-10">
              <ChartBarIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Avg Progress
              </p>
              <p 
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                {averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon 
              className="h-5 w-5" 
              style={{ color: themeConfig.colors.text, opacity: 0.5 }} 
            />
          </div>
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-1 sm:text-sm"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-1 sm:text-sm rounded-md"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider
            }}
          >
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {group.name}
                  </h3>
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(group.category).bg,
                      color: getCategoryColor(group.category).text
                    }}
                  >
                    {group.category.replace('-', ' ')}
                  </span>
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: getStatusColor(group.status).bg,
                      color: getStatusColor(group.status).text
                    }}
                  >
                    {group.status}
                  </span>
                </div>
                <p 
                  className="text-sm mb-3"
                  style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                >
                  {group.description}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  className="p-2 hover:opacity-70"
                  style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  title="Edit Group"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-2 hover:opacity-70"
                  style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  title="More Options"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="text-sm font-medium"
                  style={{ color: themeConfig.colors.text }}
                >
                  {group.curriculum || 'Curriculum Progress'}
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: themeConfig.colors.text }}
                >
                  {group.progress}%
                </span>
              </div>
              <div 
                className="w-full bg-gray-200 rounded-full h-2"
                style={{ backgroundColor: themeConfig.colors.divider }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${group.progress}%`,
                    backgroundColor: getProgressColor(group.progress)
                  }}
                />
              </div>
            </div>

            {/* Group Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon 
                    className="h-4 w-4" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  />
                  <span style={{ color: themeConfig.colors.text }}>
                    Leader: {group.leader}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon 
                    className="h-4 w-4" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  />
                  <span style={{ color: themeConfig.colors.text }}>
                    {group.members}/{group.maxMembers} members
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ClockIcon 
                    className="h-4 w-4" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  />
                  <span style={{ color: themeConfig.colors.text }}>
                    {group.meetingDay} {group.meetingTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon 
                    className="h-4 w-4" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  />
                  <span style={{ color: themeConfig.colors.text }}>
                    {group.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Meeting */}
            <div 
              className="mt-4 pt-4 border-t"
              style={{ borderColor: themeConfig.colors.divider }}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon 
                  className="h-4 w-4" 
                  style={{ color: themeConfig.colors.primary }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: themeConfig.colors.text }}
                >
                  Next Meeting: {new Date(group.nextMeeting).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed Section */}
      <div 
        className="mt-8 rounded-lg border p-6"
        style={{
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: themeConfig.colors.text }}
        >
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div 
              className="w-2 h-2 rounded-full mt-2"
              style={{ backgroundColor: themeConfig.colors.primary }}
            />
            <div>
              <p 
                className="text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                <span className="font-medium">New Believers Class</span> completed Chapter 3: Prayer Fundamentals
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                2 hours ago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div 
              className="w-2 h-2 rounded-full mt-2"
              style={{ backgroundColor: '#10B981' }}
            />
            <div>
              <p 
                className="text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                <span className="font-medium">John Doe</span> joined Young Adults Fellowship
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                1 day ago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div 
              className="w-2 h-2 rounded-full mt-2"
              style={{ backgroundColor: '#F59E0B' }}
            />
            <div>
              <p 
                className="text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                <span className="font-medium">Men's Bible Study</span> reached 80% curriculum completion
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                3 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groups