import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { eventService, Event } from '../../services/eventService'
import { 
  CalendarIcon, ClockIcon, MapPinIcon, UserIcon, 
  CheckCircleIcon, XCircleIcon, CurrencyDollarIcon,
  PhoneIcon, EnvelopeIcon
} from '@heroicons/react/24/outline'

const PublicRegistrationForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    personName: '',
    personEmail: '',
    personPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    dietaryRestrictions: '',
    specialNeeds: '',
    notes: ''
  })

  const [customFieldValues, setCustomFieldValues] = useState<{ [fieldId: string]: any }>({})

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    if (!eventId) return
    
    try {
      setLoading(true)
      const data = await eventService.getEventById(eventId)
      if (!data) {
        setError('Event not found')
      } else if (data.visibility === 'private') {
        setError('This event is private and registration is not available')
      } else if (data.status === 'cancelled') {
        setError('This event has been cancelled')
      } else if (data.status === 'completed') {
        setError('This event has already ended')
      } else if (data.registrationDeadline && new Date() > data.registrationDeadline) {
        setError('Registration deadline has passed')
      } else {
        setEvent(data)
      }
    } catch (err) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !eventId) return

    // Validate required custom fields
    if (event.customRegistrationFields) {
      for (const field of event.customRegistrationFields) {
        if (field.required && !customFieldValues[field.id]) {
          setError(`Please fill in the required field: ${field.label}`)
          return
        }
      }
    }

    setSubmitting(true)
    setError(null)

    try {
      const personId = `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const result = await eventService.registerForEvent(eventId, {
        eventId,
        personId,
        personName: formData.personName,
        personEmail: formData.personEmail,
        personPhone: formData.personPhone || undefined,
        status: 'registered',
        paymentStatus: event.registrationFee ? 'pending' : undefined,
        paymentAmount: event.registrationFee || undefined,
        notes: formData.notes || undefined,
        emergencyContact: formData.emergencyContactName ? {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        } : undefined,
        dietary_restrictions: formData.dietaryRestrictions 
          ? formData.dietaryRestrictions.split(',').map(item => item.trim())
          : undefined,
        special_needs: formData.specialNeeds || undefined,
        customFieldValues: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined
      })

      if ('error' in result) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Failed to submit registration')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues({
      ...customFieldValues,
      [fieldId]: value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Event</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering for {event?.title}. 
            {event?.registrationFee && (
              <span className="block mt-2">
                Payment of ${event.registrationFee} is pending. You will receive payment instructions via email.
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {formData.personEmail}
          </p>
        </div>
      </div>
    )
  }

  if (!event) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
  }

  const availableSpots = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const isFull = availableSpots !== null && availableSpots <= 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-indigo-100">{event.description}</p>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(event.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(event.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
              
              {event.registrationFee && (
                <div className="flex items-center gap-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Fee</p>
                    <p className="font-medium text-gray-900">${event.registrationFee}</p>
                  </div>
                </div>
              )}
              
              {availableSpots !== null && (
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Available Spots</p>
                    <p className={`font-medium ${isFull ? 'text-red-600' : 'text-gray-900'}`}>
                      {availableSpots} / {event.maxAttendees}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {isFull ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              This event is currently full. You can still register to be added to the waitlist.
            </p>
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Registration</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="personName"
                    name="personName"
                    required
                    value={formData.personName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="personEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="personEmail"
                      name="personEmail"
                      required
                      value={formData.personEmail}
                      onChange={handleChange}
                      className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="personPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="personPhone"
                      name="personPhone"
                      value={formData.personPhone}
                      onChange={handleChange}
                      className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    placeholder="e.g., Spouse, Parent"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="e.g., Vegetarian, Gluten-free (comma separated)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Needs or Accommodations
                  </label>
                  <textarea
                    id="specialNeeds"
                    name="specialNeeds"
                    rows={3}
                    value={formData.specialNeeds}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {event.customRegistrationFields && event.customRegistrationFields.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event-Specific Information</h3>
                <div className="space-y-4">
                  {event.customRegistrationFields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {field.type === 'text' && (
                          <input
                            type="text"
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'number' && (
                          <input
                            type="number"
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            min={field.validation?.min}
                            max={field.validation?.max}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'email' && (
                          <input
                            type="email"
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'phone' && (
                          <input
                            type="tel"
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}

                        {field.type === 'select' && (
                          <select
                            id={field.id}
                            required={field.required}
                            value={customFieldValues[field.id] || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select an option</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === 'radio' && (
                          <div className="space-y-2">
                            {field.options?.map((option) => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="radio"
                                  name={field.id}
                                  required={field.required}
                                  value={option}
                                  checked={customFieldValues[field.id] === option}
                                  onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'checkbox' && (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              id={field.id}
                              required={field.required}
                              checked={customFieldValues[field.id] || false}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{field.placeholder || 'Yes'}</span>
                          </label>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : isFull ? 'Join Waitlist' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PublicRegistrationForm
