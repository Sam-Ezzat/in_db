import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X, CheckSquare, Square } from 'lucide-react'
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
  { id: 'person-1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: 'person-2', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
  { id: 'person-3', name: 'Michael Brown', email: 'michael.b@example.com' },
  { id: 'person-4', name: 'Emily Davis', email: 'emily.d@example.com' }
]

export default function BulkAttendanceForm() {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()

  const [eventId, setEventId] = useState('')
  const [status, setStatus] = useState<'present' | 'absent' | 'excused' | 'late'>('present')
  const [checkInTime, setCheckInTime] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize check-in time to now
  useEffect(() => {
    const now = new Date()
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setCheckInTime(localDateTime)
  }, [])

  const filteredPeople = mockPeople.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const togglePerson = (personId: string) => {
    setSelectedPeople(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    )
  }

  const toggleAll = () => {
    if (selectedPeople.length === filteredPeople.length) {
      setSelectedPeople([])
    } else {
      setSelectedPeople(filteredPeople.map(p => p.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventId) {
      setError('Please select an event')
      return
    }

    if (selectedPeople.length === 0) {
      setError('Please select at least one person')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await attendanceService.bulkMarkAttendance({
        eventId,
        personIds: selectedPeople,
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : undefined,
        notes: notes || undefined
      })

      navigate('/attendance')
    } catch (err) {
      console.error('Failed to mark attendance:', err)
      setError('Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'present': return { bg: '#10B98120', text: '#10B981' }
      case 'absent': return { bg: '#EF444420', text: '#EF4444' }
      case 'excused': return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'late': return { bg: '#8B5CF620', text: '#8B5CF6' }
      default: return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  const statusColor = getStatusColor(status)

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
          Bulk Attendance Marking
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Attendance Settings
              </h2>

              {/* Event Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Event <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
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
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Status <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['present', 'absent', 'excused', 'late'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setStatus(statusOption)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: status === statusOption ? getStatusColor(statusOption).bg : themeConfig.colors.background,
                        color: status === statusOption ? getStatusColor(statusOption).text : themeConfig.colors.text,
                        border: `2px solid ${status === statusOption ? getStatusColor(statusOption).text : themeConfig.colors.divider}`
                      }}
                    >
                      {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-in Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Check-in Time
                </label>
                <input
                  type="datetime-local"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                />
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                  placeholder="Add notes for all selected people..."
                />
              </div>

              {/* Summary */}
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: statusColor.bg }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: statusColor.text }}>
                  Selected: {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}
                </p>
                <p className="text-sm" style={{ color: statusColor.text }}>
                  Will be marked as: <span className="font-semibold">{status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - People Selection */}
          <div className="lg:col-span-2">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Select People
                </h2>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="flex items-center text-sm hover:opacity-80 transition-opacity"
                  style={{ color: themeConfig.colors.primary }}
                >
                  {selectedPeople.length === filteredPeople.length ? (
                    <>
                      <CheckSquare size={16} className="mr-1" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square size={16} className="mr-1" />
                      Select All
                    </>
                  )}
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search people by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                />
              </div>

              {/* People List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPeople.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => togglePerson(person.id)}
                    className="flex items-center p-4 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: selectedPeople.includes(person.id) 
                        ? themeConfig.colors.primary + '10' 
                        : themeConfig.colors.background,
                      borderColor: selectedPeople.includes(person.id)
                        ? themeConfig.colors.primary
                        : themeConfig.colors.divider,
                      borderWidth: '2px'
                    }}
                  >
                    <div className="mr-3">
                      {selectedPeople.includes(person.id) ? (
                        <CheckSquare size={20} style={{ color: themeConfig.colors.primary }} />
                      ) : (
                        <Square size={20} style={{ color: themeConfig.colors.text }} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                        {person.name}
                      </p>
                      <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        {person.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPeople.length === 0 && (
                <div className="text-center py-8" style={{ color: '#6B7280' }}>
                  No people found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
          >
            <X size={20} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedPeople.length === 0}
            className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Marking Attendance...' : `Mark ${selectedPeople.length} ${selectedPeople.length === 1 ? 'Person' : 'People'}`}
          </button>
        </div>
      </form>
    </div>
  )
}
