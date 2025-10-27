import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  ArrowLeft, Building, MapPin, Phone, Mail, Globe, Users, 
  Calendar, Clock, Edit, Star
} from 'lucide-react'
import { useState } from 'react'

interface Church {
  id: number
  name: string
  denomination: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  pastor: string
  established: string
  members: number
  status: 'Active' | 'Inactive'
  description: string
  services: Service[]
  staff: StaffMember[]
  ministries: Ministry[]
  facilities: string[]
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

interface Service {
  id: number
  name: string
  day: string
  time: string
  description: string
  attendance: number
}

interface StaffMember {
  id: number
  name: string
  position: string
  email: string
  phone: string
  startDate: string
  bio: string
}

interface Ministry {
  id: number
  name: string
  description: string
  leader: string
  members: number
  meetingSchedule: string
}

const ChurchDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'staff' | 'ministries'>('overview')

  // Mock data - replace with API call
  const church: Church = {
    id: parseInt(id || '1'),
    name: 'Grace Community Church',
    denomination: 'Baptist',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phone: '+1 (555) 123-4567',
    email: 'info@gracecommunity.org',
    website: 'https://gracecommunity.org',
    pastor: 'John Smith',
    established: '1995',
    members: 450,
    status: 'Active',
    description: 'Grace Community Church has been serving the Springfield community for over 25 years. We are a vibrant, growing congregation committed to worship, fellowship, discipleship, and service. Our mission is to love God, love people, and make disciples.',
    services: [
      { id: 1, name: 'Sunday Morning Worship', day: 'Sunday', time: '10:00 AM', description: 'Main worship service with contemporary music and expository preaching', attendance: 320 },
      { id: 2, name: 'Sunday Evening Service', day: 'Sunday', time: '6:00 PM', description: 'Intimate worship and prayer service', attendance: 150 },
      { id: 3, name: 'Wednesday Bible Study', day: 'Wednesday', time: '7:00 PM', description: 'Midweek Bible study and prayer meeting', attendance: 85 },
      { id: 4, name: 'Saturday Youth Service', day: 'Saturday', time: '7:00 PM', description: 'High-energy worship service for teens and young adults', attendance: 75 }
    ],
    staff: [
      { id: 1, name: 'John Smith', position: 'Lead Pastor', email: 'john@gracecommunity.org', phone: '+1 (555) 123-4567', startDate: '2015-03-01', bio: 'Pastor John has been leading our congregation for over 8 years with passion and dedication.' },
      { id: 2, name: 'Sarah Johnson', position: 'Associate Pastor', email: 'sarah@gracecommunity.org', phone: '+1 (555) 123-4568', startDate: '2018-06-15', bio: 'Pastor Sarah oversees our youth ministry and outreach programs.' },
      { id: 3, name: 'Michael Brown', position: 'Worship Leader', email: 'michael@gracecommunity.org', phone: '+1 (555) 123-4569', startDate: '2017-09-01', bio: 'Michael leads our worship team and coordinates all musical aspects of our services.' },
      { id: 4, name: 'Emily Davis', position: 'Children\'s Director', email: 'emily@gracecommunity.org', phone: '+1 (555) 123-4570', startDate: '2019-01-10', bio: 'Emily develops and oversees programs for children from nursery through elementary age.' }
    ],
    ministries: [
      { id: 1, name: 'Youth Ministry', description: 'Programs for middle school and high school students', leader: 'Sarah Johnson', members: 65, meetingSchedule: 'Fridays 7:00 PM' },
      { id: 2, name: 'Children\'s Ministry', description: 'Sunday school and programs for children ages 2-12', leader: 'Emily Davis', members: 85, meetingSchedule: 'Sundays 9:00 AM' },
      { id: 3, name: 'Men\'s Ministry', description: 'Fellowship and Bible study for men', leader: 'David Wilson', members: 45, meetingSchedule: 'Saturdays 8:00 AM' },
      { id: 4, name: 'Women\'s Ministry', description: 'Fellowship and Bible study for women', leader: 'Lisa Anderson', members: 60, meetingSchedule: 'Tuesdays 10:00 AM' },
      { id: 5, name: 'Senior Ministry', description: 'Programs and activities for seniors', leader: 'Robert Johnson', members: 35, meetingSchedule: 'Thursdays 2:00 PM' }
    ],
    facilities: ['Main Sanctuary (400 seats)', 'Fellowship Hall', 'Children\'s Wing', 'Youth Room', 'Prayer Chapel', 'Kitchen', 'Nursery', 'Parking (150 spaces)'],
    socialMedia: {
      facebook: 'https://facebook.com/gracecommunity',
      instagram: 'https://instagram.com/gracecommunity',
      youtube: 'https://youtube.com/gracecommunity'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' ? '#10B981' : '#EF4444'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/churches')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Churches
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
              {church.name}
            </h1>
            <p className="mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {church.denomination} • Established {church.established}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/churches/${church.id}/edit`)}
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Edit size={20} className="mr-2" />
          Edit Church
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Church Info Card */}
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
              <Building size={40} style={{ color: themeConfig.colors.primary }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: themeConfig.colors.text }}>
              {church.name}
            </h2>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {church.denomination}
            </p>
            <div className="flex justify-center mt-2">
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: getStatusColor(church.status) + '20',
                  color: getStatusColor(church.status)
                }}
              >
                {church.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin size={16} className="mr-3 mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <div className="text-sm" style={{ color: themeConfig.colors.text }}>
                <p>{church.address}</p>
                <p>{church.city}, {church.state} {church.zipCode}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                {church.phone}
              </span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                {church.email}
              </span>
            </div>
            <div className="flex items-center">
              <Globe size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <a 
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: themeConfig.colors.primary }}
              >
                {church.website}
              </a>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                Lead Pastor: {church.pastor}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
              <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                Established: {church.established}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
            <h3 className="font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
                  {church.members}
                </div>
                <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Members
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: themeConfig.colors.accent }}>
                  {church.services.length}
                </div>
                <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Services
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
                  {church.staff.length}
                </div>
                <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Staff
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: themeConfig.colors.accent }}>
                  {church.ministries.length}
                </div>
                <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Ministries
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
              { key: 'overview', label: 'Overview', icon: Building },
              { key: 'services', label: 'Services', icon: Clock },
              { key: 'staff', label: 'Staff', icon: Users },
              { key: 'ministries', label: 'Ministries', icon: Star }
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
              {/* Description */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  About Our Church
                </h3>
                <p style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {church.description}
                </p>
              </div>

              {/* Facilities */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {church.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 rounded"
                      style={{ backgroundColor: themeConfig.colors.background }}
                    >
                      <Building size={16} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                      <span className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {church.socialMedia.facebook && (
                    <a
                      href={church.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#1877F2', color: 'white' }}
                    >
                      Facebook
                    </a>
                  )}
                  {church.socialMedia.instagram && (
                    <a
                      href={church.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#E4405F', color: 'white' }}
                    >
                      Instagram
                    </a>
                  )}
                  {church.socialMedia.youtube && (
                    <a
                      href={church.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#FF0000', color: 'white' }}
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {church.services.map((service) => (
                  <div key={service.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                        {service.name}
                      </h4>
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.primary + '20',
                          color: themeConfig.colors.primary
                        }}
                      >
                        {service.attendance} attendees
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                      <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                        {service.day}s at {service.time}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {church.staff.map((staff) => (
                  <div key={staff.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                        >
                          <Users size={24} style={{ color: themeConfig.colors.primary }} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                            {staff.name}
                          </h4>
                          <p className="text-sm font-medium" style={{ color: themeConfig.colors.primary }}>
                            {staff.position}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                              <Mail size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {staff.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Phone size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                {staff.phone}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                              <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                                Started: {new Date(staff.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm mt-3" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                            {staff.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ministries' && (
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {church.ministries.map((ministry) => (
                  <div key={ministry.id} className="p-6 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                        {ministry.name}
                      </h4>
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent
                        }}
                      >
                        {ministry.members} members
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Users size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                      <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                        Led by {ministry.leader}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Clock size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }} />
                      <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                        {ministry.meetingSchedule}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                      {ministry.description}
                    </p>
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

export default ChurchDetail