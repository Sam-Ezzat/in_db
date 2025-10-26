<<<<<<< HEAD
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
=======
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
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
<<<<<<< HEAD
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
=======
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
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<<<<<<< HEAD
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider
=======
        {groups.map((group) => (
          <div 
            key={group.id}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
            }}
          >
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
<<<<<<< HEAD
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
=======
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
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
                  {group.progress}%
                </span>
              </div>
              <div 
<<<<<<< HEAD
                className="w-full bg-gray-200 rounded-full h-2"
=======
                className="w-full h-2 rounded-full"
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
                style={{ backgroundColor: themeConfig.colors.divider }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
<<<<<<< HEAD
                    width: `${group.progress}%`,
                    backgroundColor: getProgressColor(group.progress)
=======
                    backgroundColor: getProgressColor(group.progress),
                    width: `${group.progress}%`
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
                  }}
                />
              </div>
            </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> eb9079ebdd07e7bd7c74f88104c8628306d9a084
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groups