import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { locationService, Location } from '../../services/locationService'
import { useTheme } from '../../contexts/ThemeContext'

type LocationType = 'country' | 'governorate' | 'sector'

export default function LocationForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: '',
    type: 'country' as LocationType,
    parentId: undefined as string | undefined
  })
  
  const [parentLocations, setParentLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditMode) {
      loadLocation()
    }
    loadParentLocations()
  }, [id])

  useEffect(() => {
    // When type changes, update available parent locations
    loadParentLocations()
  }, [formData.type])

  const loadLocation = async () => {
    if (!id) return
    
    try {
      const data = await locationService.getLocationById(id)
      if (!data) {
        alert('Location not found')
        navigate('/locations')
        return
      }
      setFormData({
        name: data.name,
        type: data.type,
        parentId: data.parentId
      })
    } catch (error) {
      console.error('Failed to load location:', error)
      alert('Failed to load location')
    }
  }

  const loadParentLocations = async () => {
    try {
      // Get parent type based on current type
      let parentType: LocationType | undefined
      if (formData.type === 'governorate') parentType = 'country'
      if (formData.type === 'sector') parentType = 'governorate'
      
      if (parentType) {
        const locations = await locationService.getLocations({ type: parentType })
        setParentLocations(locations)
      } else {
        setParentLocations([])
      }
    } catch (error) {
      console.error('Failed to load parent locations:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    // Validate parentId requirement
    if (formData.type === 'governorate' && !formData.parentId) {
      newErrors.parentId = 'Parent country is required for governorate'
    }
    if (formData.type === 'sector' && !formData.parentId) {
      newErrors.parentId = 'Parent governorate is required for sector'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const submitData = {
        name: formData.name,
        type: formData.type,
        parentId: formData.parentId
      }

      if (isEditMode && id) {
        await locationService.updateLocation(id, submitData)
      } else {
        await locationService.createLocation(submitData)
      }
      
      navigate('/locations')
    } catch (error: any) {
      console.error('Failed to save location:', error)
      alert(error.message || 'Failed to save location')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'parent_id' ? (value ? parseInt(value) : null) : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Location' : 'New Location'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update location information' : 'Create a new location in the hierarchy'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isEditMode} // Don't allow changing type in edit mode
          >
            <option value="country">Country</option>
            <option value="governorate">Governorate</option>
            <option value="sector">Sector</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          <p className="text-gray-500 text-sm mt-1">
            Hierarchy: Country → Governorate → Sector
          </p>
        </div>

        {/* Parent Location */}
        {formData.type !== 'country' && (
          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
              Parent {formData.type === 'governorate' ? 'Country' : 'Governorate'} <span className="text-red-500">*</span>
            </label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.parentId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select parent location</option>
              {parentLocations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter location name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/locations"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Location' : 'Create Location'}
          </button>
        </div>
      </form>
    </div>
  )
}
