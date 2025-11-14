import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, FileText } from 'lucide-react'
import { attendanceService } from '../../services/attendanceService'
import type { Attendance } from '../../services/attendanceService'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../hooks/useAccess'

export default function AttendanceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { can } = useAccess()

  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadAttendance()
    }
  }, [id])

  const loadAttendance = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await attendanceService.getAttendanceById(id)
      if (!data) {
        setError('Attendance record not found')
        return
      }
      setAttendance(data)
    } catch (err) {
      console.error('Failed to load attendance:', err)
      setError('Failed to load attendance record')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !attendance) return

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this attendance record for ${attendance.person?.firstName} ${attendance.person?.lastName}?`
    )
    if (!confirmDelete) return

    try {
      setLoading(true)
      await attendanceService.deleteAttendance(id)
      navigate('/attendance')
    } catch (err) {
      console.error('Failed to delete attendance:', err)
      setError('Failed to delete attendance record')
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return { bg: '#10B98120', text: '#10B981', label: 'Present' }
      case 'absent':
        return { bg: '#EF444420', text: '#EF4444', label: 'Absent' }
      case 'excused':
        return { bg: '#F59E0B20', text: '#F59E0B', label: 'Excused' }
      case 'late':
        return { bg: '#8B5CF620', text: '#8B5CF6', label: 'Late' }
      default:
        return { bg: '#6B728020', text: '#6B7280', label: status }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
        Loading attendance record...
      </div>
    )
  }

  if (error || !attendance) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error || 'Attendance record not found'}
        </div>
        <button
          onClick={() => navigate('/attendance')}
          className="mt-4 flex items-center text-sm hover:opacity-80 transition-opacity"
          style={{ color: themeConfig.colors.primary }}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Attendance
        </button>
      </div>
    )
  }

  const statusColor = getStatusColor(attendance.status)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Attendance
          </button>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Attendance Record
          </h1>
        </div>

        <div className="flex gap-2">
          {can('attendance', 'update') && (
            <button
              onClick={() => navigate(`/attendance/${id}/edit`)}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Edit size={20} className="mr-2" />
              Edit
            </button>
          )}
          {can('attendance', 'delete') && (
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EF4444' }}
            >
              <Trash2 size={20} className="mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {/* Status Badge */}
            <div className="mb-6">
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: statusColor.bg,
                  color: statusColor.text
                }}
              >
                {statusColor.label}
              </span>
            </div>

            {/* Person Information */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <User size={20} style={{ color: themeConfig.colors.primary }} />
                <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Person
                </h2>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: themeConfig.colors.background }}
              >
                <p className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                  {attendance.person?.firstName} {attendance.person?.lastName}
                </p>
                {attendance.person?.email && (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>
                    {attendance.person.email}
                  </p>
                )}
              </div>
            </div>

            {/* Event Information */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Calendar size={20} style={{ color: themeConfig.colors.primary }} />
                <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Event
                </h2>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: themeConfig.colors.background }}
              >
                <p className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                  {attendance.event?.name}
                </p>
                {attendance.event?.date && (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>
                    {new Date(attendance.event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                {attendance.event?.type && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2"
                    style={{
                      backgroundColor: themeConfig.colors.primary + '20',
                      color: themeConfig.colors.primary
                    }}
                  >
                    {attendance.event.type}
                  </span>
                )}
              </div>
            </div>

            {/* Time Information */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Clock size={20} style={{ color: themeConfig.colors.primary }} />
                <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Time
                </h2>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: themeConfig.colors.background }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                      Check-in
                    </p>
                    <p style={{ color: themeConfig.colors.text }}>
                      {attendance.checkInTime 
                        ? new Date(attendance.checkInTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                      Check-out
                    </p>
                    <p style={{ color: themeConfig.colors.text }}>
                      {attendance.checkOutTime 
                        ? new Date(attendance.checkOutTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {attendance.notes && (
              <div>
                <div className="flex items-center mb-2">
                  <FileText size={20} style={{ color: themeConfig.colors.primary }} />
                  <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                    Notes
                  </h2>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: themeConfig.colors.background }}
                >
                  <p style={{ color: themeConfig.colors.text }}>
                    {attendance.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Record Information
            </h2>
            
            <div className="space-y-4">
              {attendance.markedBy && (
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                    Marked By
                  </p>
                  <p style={{ color: themeConfig.colors.text }}>
                    {attendance.markedBy}
                  </p>
                </div>
              )}

              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Created
                </p>
                <p style={{ color: themeConfig.colors.text }}>
                  {new Date(attendance.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Last Updated
                </p>
                <p style={{ color: themeConfig.colors.text }}>
                  {new Date(attendance.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Record ID
                </p>
                <p style={{ 
                  color: themeConfig.colors.text,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all'
                }}>
                  {attendance.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
