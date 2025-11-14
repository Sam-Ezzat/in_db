import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { attendanceService } from '../../services/attendanceService'
import { useTheme } from '../../contexts/ThemeContext'

// Mock data - in production, import from services
const mockEvents = [
  { id: 'event-1', name: 'Sunday Service', date: '2024-01-14' },
  { id: 'event-2', name: 'Bible Study', date: '2024-01-12' },
  { id: 'event-3', name: 'Prayer Meeting', date: '2024-01-10' },
  { id: 'event-4', name: 'Youth Group', date: '2024-01-15' }
]

const mockPeople = [
  { id: 'person-1', name: 'John Smith' },
  { id: 'person-2', name: 'Sarah Johnson' },
  { id: 'person-3', name: 'Michael Brown' },
  { id: 'person-4', name: 'Emily Davis' }
]

export default function AttendanceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    eventId: '',
    personId: '',
    status: 'present' as 'present' | 'absent' | 'excused' | 'late',
    checkInTime: '',
    checkOutTime: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditMode && id) {
      loadAttendance()
    }
  }, [id])

  const loadAttendance = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await attendanceService.getAttendanceById(id)
      if (!data) {
        alert('Attendance record not found')
        navigate('/attendance')
        return
      }

      setFormData({
        eventId: data.eventId,
        personId: data.personId,
        status: data.status,
        checkInTime: data.checkInTime ? new Date(data.checkInTime).toISOString().slice(0, 16) : '',
        checkOutTime: data.checkOutTime ? new Date(data.checkOutTime).toISOString().slice(0, 16) : '',
        notes: data.notes || ''
      })
    } catch (err) {
      console.error('Failed to load attendance:', err)
      setError('Failed to load attendance record')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.eventId || !formData.personId) {
      setError('Please select both event and person')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const submitData = {
        ...formData,
        checkInTime: formData.checkInTime ? new Date(formData.checkInTime) : undefined,
        checkOutTime: formData.checkOutTime ? new Date(formData.checkOutTime) : undefined
      }

      if (isEditMode && id) {
        await attendanceService.updateAttendance(id, submitData)
      } else {
        await attendanceService.createAttendance(submitData)
      }

      navigate('/attendance')
    } catch (err) {
      console.error('Failed to save attendance:', err)
      setError('Failed to save attendance record')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
        Loading attendance record...
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
          style={{ color: themeConfig.colors.primary }}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Attendance
        </button>
        <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
          {isEditMode ? 'Edit Attendance Record' : 'Mark Attendance'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error}
        </div>
      )}

      {/* Form */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Event <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                required
                disabled={isEditMode}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              >
                <option value="">Select Event</option>
                {mockEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {isEditMode && (
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Event cannot be changed in edit mode
                </p>
              )}
            </div>

            {/* Person Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Person <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={formData.personId}
                onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                required
                disabled={isEditMode}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              >
                <option value="">Select Person</option>
                {mockPeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              {isEditMode && (
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Person cannot be changed in edit mode
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Status <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
                <option value="late">Late</option>
              </select>
            </div>

            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Check-in Time
              </label>
              <input
                type="datetime-local"
                value={formData.checkInTime}
                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>

            {/* Check-out Time */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Check-out Time
              </label>
              <input
                type="datetime-local"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
                placeholder="Add any notes or comments..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text 
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Save size={20} className="mr-2" />
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
