import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, UserCheck, Search, Filter, X, Plus, Download } from 'lucide-react'
import { attendanceService, Attendance, AttendanceStatistics } from '../../services/attendanceService'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'excused' | 'late'>('all')
  const [filterEvent, setFilterEvent] = useState<string>('all')

  const { themeConfig } = useTheme()
  const { can } = useAccess()
  const navigate = useNavigate()

  useEffect(() => {
    loadAttendances()
    loadStatistics()
  }, [searchTerm, filterStatus, filterEvent])

  const loadAttendances = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      if (searchTerm) filters.search = searchTerm
      if (filterStatus !== 'all') filters.status = filterStatus
      if (filterEvent !== 'all') filters.eventId = filterEvent

      const data = await attendanceService.getAttendances(filters)
      setAttendances(data)
      setError(null)
    } catch (err) {
      setError('Failed to load attendance records')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await attendanceService.getStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  const handleDelete = async (id: string, personName: string) => {
    if (!can('attendance', 'delete')) {
      setError('You do not have permission to delete attendance records')
      return
    }

    if (!window.confirm(`Are you sure you want to delete attendance record for ${personName}?`)) {
      return
    }

    try {
      await attendanceService.deleteAttendance(id)
      loadAttendances()
      loadStatistics()
    } catch (err) {
      setError('Failed to delete attendance record')
      console.error(err)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterEvent('all')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return { bg: '#10B98120', text: '#10B981' }
      case 'absent':
        return { bg: '#EF444420', text: '#EF4444' }
      case 'excused':
        return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'late':
        return { bg: '#8B5CF620', text: '#8B5CF6' }
      default:
        return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Attendance Tracking
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Track and manage event attendance
          </p>
        </div>
        {can('attendance', 'create') && (
          <button
            onClick={() => navigate('/attendance/new')}
            className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <Plus size={20} className="mr-2" />
            Mark Attendance
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Total Records</p>
            <p className="text-2xl font-bold mt-1" style={{ color: themeConfig.colors.text }}>
              {statistics.totalRecords}
            </p>
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Present</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#10B981' }}>
              {statistics.present}
            </p>
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Absent</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#EF4444' }}>
              {statistics.absent}
            </p>
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Excused</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#F59E0B' }}>
              {statistics.excused}
            </p>
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Attendance Rate</p>
            <p className="text-2xl font-bold mt-1" style={{ color: themeConfig.colors.primary }}>
              {statistics.attendanceRate.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
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
              placeholder="Search by person or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="excused">Excused</option>
            <option value="late">Late</option>
          </select>

          {(searchTerm || filterStatus !== 'all' || filterEvent !== 'all') && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text 
              }}
            >
              <X size={20} className="mr-2" />
              Clear
            </button>
          )}

          {can('attendance', 'export') && (
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text 
              }}
            >
              <Download size={20} className="mr-2" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div 
          className="p-8 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>Loading attendance records...</p>
        </div>
      ) : attendances.length === 0 ? (
        <div 
          className="p-8 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <UserCheck size={48} className="mx-auto mb-3" style={{ color: themeConfig.colors.text, opacity: 0.3 }} />
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>No attendance records found</p>
          {can('attendance', 'create') && (
            <button
              onClick={() => navigate('/attendance/new')}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Plus size={16} className="mr-2" />
              Mark First Attendance
            </button>
          )}
        </div>
      ) : (
        <div 
          className="rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: themeConfig.colors.background }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {attendances.map((attendance) => {
                  const statusColors = getStatusColor(attendance.status)
                  return (
                    <tr key={attendance.id} className="hover:opacity-80 transition-opacity">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                          {attendance.person ? 
                            `${attendance.person.firstName} ${attendance.person.lastName || ''}` : 
                            'Unknown'}
                        </div>
                        {attendance.person?.email && (
                          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {attendance.person.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                          {attendance.event?.name || 'Unknown Event'}
                        </div>
                        {attendance.event?.date && (
                          <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {new Date(attendance.event.date).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: statusColors.bg,
                            color: statusColors.text
                          }}
                        >
                          {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        {attendance.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        {attendance.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/attendance/${attendance.id}`}
                          className="hover:opacity-80 transition-opacity mr-3"
                          style={{ color: themeConfig.colors.primary }}
                        >
                          View
                        </Link>
                        {can('attendance', 'update') && (
                          <Link
                            to={`/attendance/${attendance.id}/edit`}
                            className="hover:opacity-80 transition-opacity mr-3"
                            style={{ color: themeConfig.colors.accent }}
                          >
                            Edit
                          </Link>
                        )}
                        {can('attendance', 'delete') && (
                          <button
                            onClick={() => handleDelete(
                              attendance.id, 
                              attendance.person ? `${attendance.person.firstName} ${attendance.person.lastName || ''}` : 'Unknown'
                            )}
                            className="hover:opacity-80 transition-opacity"
                            style={{ color: '#EF4444' }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
