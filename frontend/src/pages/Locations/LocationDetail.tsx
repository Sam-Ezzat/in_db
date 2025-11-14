import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { locationService, Location } from '../../services/locationService'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { can } = useAccess()
  const [location, setLocation] = useState<Location | null>(null)
  const [children, setChildren] = useState<Location[]>([])
  const [churches, setChurches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'children' | 'churches' | 'statistics'>('details')

  useEffect(() => {
    loadLocationData()
  }, [id])

  const loadLocationData = async () => {
    if (!id) return
    
    setLoading(true)
    try {
      const [locationData, childrenData] = await Promise.all([
        locationService.getLocationById(id),
        locationService.getLocations({ parentId: id })
      ])
      
      setLocation(locationData)
      setChildren(childrenData)
      
      // Mock churches data - replace with actual API call
      setChurches([
        { id: 1, name: 'First Church', status: 'active', memberCount: 150 },
        { id: 2, name: 'Second Church', status: 'active', memberCount: 200 }
      ])
    } catch (error) {
      console.error('Failed to load location:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!location || !window.confirm(`Are you sure you want to delete ${location.name}?`)) return
    
    try {
      await locationService.deleteLocation(location.id)
      navigate('/locations')
    } catch (error) {
      console.error('Failed to delete location:', error)
      alert('Failed to delete location')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Location not found</h2>
        <Link to="/locations" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Locations
        </Link>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'country': return 'bg-purple-100 text-purple-800'
      case 'governorate': return 'bg-blue-100 text-blue-800'
      case 'sector': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(location.type)}`}>
              {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/locations"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          {can('locations', 'update') && (
            <Link
              to={`/locations/${location.id}/edit`}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              Edit
            </Link>
          )}
          {can('locations', 'delete') && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {['details', 'children', 'churches', 'statistics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{location.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <p className="text-gray-900">{location.type}</p>
            </div>
            
            
            {location.parentId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Location</label>
                <Link 
                  to={`/locations/${location.parentId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {location.parent?.name || 'View Parent'}
                </Link>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <p className="text-gray-900">{new Date(location.createdAt).toLocaleString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
              <p className="text-gray-900">{new Date(location.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Child Locations ({children.length})</h3>
            {children.length === 0 ? (
              <p className="text-gray-500">No child locations found</p>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/locations/${child.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(child.type)}`}>
                        {child.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'churches' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Churches ({churches.length})</h3>
            {churches.length === 0 ? (
              <p className="text-gray-500">No churches found in this location</p>
            ) : (
              <div className="space-y-3">
                {churches.map((church) => (
                  <Link
                    key={church.id}
                    to={`/churches/${church.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{church.name}</h4>
                        <p className="text-sm text-gray-500">Members: {church.memberCount}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {church.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Child Locations</h4>
              <p className="text-3xl font-bold text-blue-600">{children.length}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-1">Churches</h4>
              <p className="text-3xl font-bold text-green-600">{churches.length}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900 mb-1">Total Members</h4>
              <p className="text-3xl font-bold text-purple-600">
                {churches.reduce((sum, c) => sum + c.memberCount, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
