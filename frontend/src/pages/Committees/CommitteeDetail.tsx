import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  ArrowLeft, Edit, Users, FileText, Calendar, 
  CheckCircle, Clock, User, Mail, Phone, 
  TrendingUp, Activity, AlertCircle, Target,
  Folder, Download, Eye
} from 'lucide-react'

const CommitteeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with API call
  const committee = {
    id: id || '1',
    name: 'Finance Committee',
    description: 'Oversees church financial planning, budgeting, and fiscal responsibility to ensure good stewardship of resources.',
    chair: 'Robert Anderson',
    chairId: '5',
    chairEmail: 'robert.anderson@gracechurch.org',
    chairPhone: '+1 (555) 123-4571',
    church: 'Grace Community Church',
    churchId: 1,
    status: 'Active',
    meetingSchedule: 'First Monday of each month, 7:00 PM',
    meetingLocation: 'Conference Room B',
    formed: 'January 2020',
    purpose: 'To provide oversight and guidance for all financial matters of the church, ensuring transparency, accountability, and biblical stewardship principles.',
    authority: 'Budget approval up to $50,000, financial policy recommendations, audit oversight',
    nextMeeting: '2024-11-04',
    lastMeeting: '2024-10-07',
    totalMembers: 7
  }

  const members = [
    {
      id: '5',
      name: 'Robert Anderson',
      role: 'Committee Chair',
      email: 'robert.anderson@gracechurch.org',
      phone: '+1 (555) 123-4571',
      joinDate: '2020-01-15',
      attendance: '95%',
      expertise: 'Corporate Finance, CPA',
      status: 'Active'
    },
    {
      id: '6',
      name: 'Margaret Chen',
      role: 'Secretary',
      email: 'margaret.chen@gracechurch.org',
      phone: '+1 (555) 123-4572',
      joinDate: '2020-03-10',
      attendance: '92%',
      expertise: 'Accounting, Financial Reporting',
      status: 'Active'
    },
    {
      id: '7',
      name: 'David Thompson',
      role: 'Treasurer Liaison',
      email: 'david.thompson@gracechurch.org',
      phone: '+1 (555) 123-4573',
      joinDate: '2020-01-15',
      attendance: '88%',
      expertise: 'Investment Management',
      status: 'Active'
    },
    {
      id: '8',
      name: 'Linda Martinez',
      role: 'Member',
      email: 'linda.martinez@gracechurch.org',
      phone: '+1 (555) 123-4574',
      joinDate: '2021-06-20',
      attendance: '90%',
      expertise: 'Budget Planning',
      status: 'Active'
    },
    {
      id: '9',
      name: 'James Wilson',
      role: 'Member',
      email: 'james.wilson@gracechurch.org',
      phone: '+1 (555) 123-4575',
      joinDate: '2022-01-15',
      attendance: '85%',
      expertise: 'Risk Management',
      status: 'Active'
    }
  ]

  const meetings = [
    {
      id: '1',
      date: '2024-11-04',
      time: '7:00 PM',
      status: 'Scheduled',
      agenda: 'Q4 Budget Review, Capital Expenditure Proposals, Investment Performance',
      location: 'Conference Room B',
      attendees: 7,
      type: 'Regular Meeting'
    },
    {
      id: '2',
      date: '2024-10-07',
      time: '7:00 PM',
      status: 'Completed',
      agenda: 'Monthly Financial Review, Ministry Budget Requests, Facility Maintenance Costs',
      location: 'Conference Room B',
      attendees: 6,
      type: 'Regular Meeting',
      minutes: true,
      decisions: 3
    },
    {
      id: '3',
      date: '2024-09-02',
      time: '7:00 PM',
      status: 'Completed',
      agenda: 'Annual Budget Planning, Stewardship Campaign Review, Financial Policies Update',
      location: 'Conference Room B',
      attendees: 7,
      type: 'Regular Meeting',
      minutes: true,
      decisions: 5
    }
  ]

  const projects = [
    {
      id: '1',
      title: '2025 Annual Budget',
      description: 'Preparation and approval of the comprehensive annual budget for 2025',
      status: 'In Progress',
      priority: 'High',
      startDate: '2024-09-01',
      dueDate: '2024-12-15',
      progress: 65,
      assignedTo: 'Margaret Chen',
      lastUpdate: '2024-10-25'
    },
    {
      id: '2',
      title: 'Investment Policy Review',
      description: 'Comprehensive review and update of church investment policies and guidelines',
      status: 'In Progress',
      priority: 'Medium',
      startDate: '2024-10-01',
      dueDate: '2024-11-30',
      progress: 40,
      assignedTo: 'David Thompson',
      lastUpdate: '2024-10-20'
    },
    {
      id: '3',
      title: 'Financial Controls Audit',
      description: 'Annual review of internal financial controls and procedures',
      status: 'Completed',
      priority: 'High',
      startDate: '2024-07-01',
      dueDate: '2024-09-30',
      progress: 100,
      assignedTo: 'Robert Anderson',
      lastUpdate: '2024-09-28'
    }
  ]

  const decisions = [
    {
      id: '1',
      title: 'Approve Kitchen Renovation Budget',
      description: 'Approved $25,000 budget for kitchen renovation project',
      date: '2024-10-07',
      status: 'Approved',
      votedFor: 5,
      votedAgainst: 1,
      abstained: 0,
      impact: 'High',
      followUp: 'Project management committee formation'
    },
    {
      id: '2',
      title: 'Investment Portfolio Rebalancing',
      description: 'Approved rebalancing of investment portfolio to reduce risk exposure',
      date: '2024-10-07',
      status: 'Approved',
      votedFor: 6,
      votedAgainst: 0,
      abstained: 0,
      impact: 'Medium',
      followUp: 'Implementation by December 2024'
    },
    {
      id: '3',
      title: 'Update Expense Approval Limits',
      description: 'Increased departmental expense approval limits to $2,500',
      date: '2024-09-02',
      status: 'Approved',
      votedFor: 7,
      votedAgainst: 0,
      abstained: 0,
      impact: 'Low',
      followUp: 'Policy update distributed'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': case 'approved': case 'completed': return '#10B981'
      case 'in progress': case 'scheduled': return '#F59E0B'
      case 'inactive': case 'rejected': return '#EF4444'
      default: return themeConfig.colors.text
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      case 'low': return '#10B981'
      default: return themeConfig.colors.text
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'decisions', label: 'Decisions', icon: CheckCircle }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Committee Info */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Committee Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Purpose
            </label>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.purpose}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Authority Level
            </label>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.authority}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Meeting Schedule
            </label>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.meetingSchedule}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Meeting Location
            </label>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.meetingLocation}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Committee Formed
            </label>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {committee.formed}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Current Status
            </label>
            <span 
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: getStatusColor(committee.status) }}
            >
              {committee.status}
            </span>
          </div>
        </div>
      </div>

      {/* Chair Information */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Committee Leadership
        </h3>
        
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: themeConfig.colors.primary + '20' }}
          >
            <User size={24} style={{ color: themeConfig.colors.primary }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: themeConfig.colors.text }}>
              {committee.chair}
            </h4>
            <p className="text-sm mb-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Committee Chair
            </p>
            <div className="flex items-center text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
              <Mail size={14} className="mr-1" />
              {committee.chairEmail}
              <span className="mx-2">•</span>
              <Phone size={14} className="mr-1" />
              {committee.chairPhone}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: themeConfig.colors.primary }}>
            {committee.totalMembers}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Active Members
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
            {meetings.filter(m => m.status === 'Completed').length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Meetings Held
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
            {projects.filter(p => p.status === 'In Progress').length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Active Projects
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
            {decisions.filter(d => d.status === 'Approved').length}
          </div>
          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Decisions Made
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: themeConfig.colors.primary + '20' }}
            >
              <CheckCircle size={16} style={{ color: themeConfig.colors.primary }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                Kitchen renovation budget approved ($25,000)
              </p>
              <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                October 7, 2024
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: themeConfig.colors.accent + '20' }}
            >
              <TrendingUp size={16} style={{ color: themeConfig.colors.accent }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                2025 Annual Budget planning 65% complete
              </p>
              <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                October 25, 2024
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: themeConfig.colors.primary + '20' }}
            >
              <Calendar size={16} style={{ color: themeConfig.colors.primary }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                Next meeting scheduled for November 4, 2024
              </p>
              <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                October 20, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMembers = () => (
    <div className="space-y-4">
      {members.map((member) => (
        <div 
          key={member.id}
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: themeConfig.colors.primary + '20' }}
              >
                <User size={24} style={{ color: themeConfig.colors.primary }} />
              </div>
              <div>
                <h4 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                  {member.name}
                </h4>
                <p className="text-sm mb-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  {member.role}
                </p>
                <div className="flex items-center text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                  <Mail size={14} className="mr-1" />
                  {member.email}
                  <span className="mx-2">•</span>
                  <Phone size={14} className="mr-1" />
                  {member.phone}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white mb-2"
                style={{ backgroundColor: getStatusColor(member.status) }}
              >
                {member.status}
              </span>
              <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                Attendance: {member.attendance}
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Expertise:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {member.expertise}
              </span>
            </div>
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Joined:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {new Date(member.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Status:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {member.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMeetings = () => (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div 
          key={meeting.id}
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
                {meeting.type} - {new Date(meeting.date).toLocaleDateString()}
              </h4>
              <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                {meeting.time} • {meeting.location}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: getStatusColor(meeting.status) }}
              >
                {meeting.status}
              </span>
              {meeting.minutes && (
                <button className="p-1 hover:opacity-80">
                  <Download size={16} style={{ color: themeConfig.colors.primary }} />
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Agenda
            </h5>
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
              {meeting.agenda}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              <Users size={16} className="mr-1" />
              {meeting.attendees} attendees
              {meeting.decisions && (
                <>
                  <span className="mx-2">•</span>
                  <CheckCircle size={16} className="mr-1" />
                  {meeting.decisions} decisions made
                </>
              )}
            </div>
            
            {meeting.minutes && (
              <button 
                className="text-sm hover:opacity-80"
                style={{ color: themeConfig.colors.primary }}
              >
                View Meeting Minutes
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-4">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
                {project.title}
              </h4>
              <p className="text-sm mb-2" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {project.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {project.status}
              </span>
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: getPriorityColor(project.priority) }}
              >
                {project.priority}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: themeConfig.colors.text }}>Progress</span>
              <span style={{ color: themeConfig.colors.text }}>{project.progress}%</span>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-2"
              style={{ backgroundColor: themeConfig.colors.divider }}
            >
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${project.progress}%`,
                  backgroundColor: project.progress === 100 ? '#10B981' : themeConfig.colors.primary
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Assigned to:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {project.assignedTo}
              </span>
            </div>
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Due Date:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {new Date(project.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium" style={{ color: themeConfig.colors.text }}>Last Update:</span>
              <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {new Date(project.lastUpdate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderDecisions = () => (
    <div className="space-y-4">
      {decisions.map((decision) => (
        <div 
          key={decision.id}
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
                {decision.title}
              </h4>
              <p className="text-sm mb-2" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                {decision.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: getStatusColor(decision.status) }}
              >
                {decision.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Voting Results
              </h5>
              <div className="flex items-center space-x-4 text-sm">
                <span style={{ color: '#10B981' }}>For: {decision.votedFor}</span>
                <span style={{ color: '#EF4444' }}>Against: {decision.votedAgainst}</span>
                <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Abstained: {decision.abstained}
                </span>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Impact Level
              </h5>
              <span 
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: getPriorityColor(decision.impact) }}
              >
                {decision.impact}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Decision Date: {new Date(decision.date).toLocaleDateString()}
            </div>
            
            {decision.followUp && (
              <div>
                <span className="font-medium" style={{ color: themeConfig.colors.text }}>Follow-up:</span>
                <span className="ml-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {decision.followUp}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/committees')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Committees
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {committee.name}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {committee.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/committees/${id}/edit`)}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Edit size={20} className="mr-2" />
          Edit Committee
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: activeTab === tab.id 
                  ? themeConfig.colors.primary 
                  : themeConfig.colors.secondary,
                color: activeTab === tab.id 
                  ? '#FFFFFF' 
                  : themeConfig.colors.text
              }}
            >
              <IconComponent size={16} className="mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'meetings' && renderMeetings()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'decisions' && renderDecisions()}
      </div>
    </div>
  )
}

export default CommitteeDetail