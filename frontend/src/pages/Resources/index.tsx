import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Wrench, 
  Calendar, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  TrendingUp,
  Package,
  Car,
  Monitor,
  Home
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { resourceService, ResourceSummary, Resource, ResourceBooking, MaintenanceAlert } from '../../services/resourceService'

const ResourceManagement: React.FC = () => {
  const { themeConfig } = useTheme()
  const [summary, setSummary] = useState<ResourceSummary | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<ResourceBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    loadResourceData()
  }, [])

  const loadResourceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load summary, resources, and upcoming bookings
      const [summaryData, resourcesData, bookingsData] = await Promise.all([
        resourceService.getResourceSummary('1'),
        resourceService.getResources({ 
          churchId: '1',
          category: selectedCategory || undefined,
          status: selectedStatus || undefined,
          searchTerm: searchTerm || undefined,
          limit: 20
        }),
        resourceService.getBookings({ 
          startDate: new Date(),
          limit: 10
        })
      ])
      
      setSummary(summaryData)
      setResources(resourcesData.resources)
      setUpcomingBookings(bookingsData.bookings)
    } catch (err) {
      setError('Failed to load resource data')
      console.error('Error loading resource data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600'
      case 'in_use': return 'text-blue-600'
      case 'maintenance': return 'text-yellow-600'
      case 'out_of_order': return 'text-red-600'
      case 'retired': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-orange-600'
      case 'needs_repair': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'facility': return Building2
      case 'equipment': return Package
      case 'vehicle': return Car
      case 'technology': return Monitor
      default: return Home
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'reports', label: 'Reports', icon: BookOpen }
  ]

  const resourceCategories = [
    { value: '', label: 'All Categories' },
    { value: 'facility', label: 'Facilities' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'material', label: 'Materials' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'technology', label: 'Technology' }
  ]

  const resourceStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out_of_order', label: 'Out of Order' },
    { value: 'retired', label: 'Retired' }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div 
          className="flex items-center p-4 rounded-lg border"
          style={{ 
            backgroundColor: '#fee2e2',
            borderColor: '#fecaca',
            color: '#991b1b'
          }}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Resource Management
          </h1>
          <p className="text-gray-600 mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage facilities, equipment, bookings, and maintenance schedules
          </p>
        </div>
        <div className="flex gap-2">
          <RequirePermission resource="resources" action="create">
            <button
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </button>
          </RequirePermission>
        </div>
      </div>

      {/* Tab Navigation */}
      <div 
        className="border-b"
        style={{ borderColor: themeConfig.colors.divider }}
      >
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{
                  color: activeTab === tab.id ? themeConfig.colors.primary : themeConfig.colors.text,
                  borderBottomColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent'
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Total Resources
                </div>
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {summary?.totalResources || 0}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Active assets
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Total Value
                </div>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(summary?.totalValue || 0)}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Asset value
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Upcoming Bookings
                </div>
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                {summary?.upcomingBookings || 0}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Next 30 days
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Maintenance Alerts
                </div>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600 mt-2">
                {summary?.overdueMaintenance || 0}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Overdue items
              </p>
            </div>
          </div>

          {/* Resource Categories & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Categories */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Resources by Category
                </h3>
              </div>
              <div className="space-y-3">
                {summary?.resourcesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}></div>
                      <span className="capitalize text-sm" style={{ color: themeConfig.colors.text }}>
                        {category.category || 'Unknown'}
                      </span>
                    </div>
                    <div className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      {category.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Status */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Resources by Status
                </h3>
              </div>
              <div className="space-y-3">
                {summary?.resourcesByStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status.status === 'available' ? 'bg-green-500' :
                        status.status === 'in_use' ? 'bg-blue-500' :
                        status.status === 'maintenance' ? 'bg-yellow-500' :
                        status.status === 'out_of_order' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="capitalize text-sm" style={{ color: themeConfig.colors.text }}>
                        {status.status?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                    <div className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      {status.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          {summary?.maintenanceAlerts && summary.maintenanceAlerts.length > 0 && (
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Maintenance Alerts
                </h3>
              </div>
              <div className="space-y-3">
                {summary.maintenanceAlerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{alert.resourceName}</div>
                        <div className="text-sm opacity-75">{alert.message}</div>
                        {alert.dueDate && (
                          <div className="text-xs opacity-60 mt-1">
                            Due: {formatDate(alert.dueDate)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium capitalize">{alert.priority}</div>
                        {alert.estimatedCost && (
                          <div className="text-xs">{formatCurrency(alert.estimatedCost)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Bookings */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
              <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                Upcoming Bookings
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingBookings.slice(0, 5).map((booking) => {
                const resource = resources.find(r => r.id === booking.resourceId)
                return (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: themeConfig.colors.background }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: themeConfig.colors.text }}>
                          {booking.title}
                        </div>
                        <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          {resource?.name} • {formatDateTime(booking.startDateTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        booking.status === 'confirmed' ? 'text-green-600' :
                        booking.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {booking.status}
                      </div>
                      {booking.attendeeCount && (
                        <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                          {booking.attendeeCount} attendees
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <RequirePermission resource="resources" action="view">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div 
              className="p-4 rounded-lg border"
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
                    placeholder="Search resources..."
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                >
                  {resourceCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                >
                  {resourceStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={loadResourceData}
                  className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const CategoryIcon = getCategoryIcon(resource.category)
                return (
                  <div 
                    key={resource.id}
                    className="p-6 rounded-lg border hover:shadow-md transition-shadow"
                    style={{ 
                      backgroundColor: themeConfig.colors.secondary,
                      borderColor: themeConfig.colors.divider 
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: themeConfig.colors.background }}
                        >
                          <CategoryIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                            {resource.name}
                          </h3>
                          <p className="text-sm capitalize" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {resource.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <RequirePermission resource="resources" action="view">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="h-4 w-4" style={{ color: themeConfig.colors.text }} />
                          </button>
                        </RequirePermission>
                        <RequirePermission resource="resources" action="update">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4" style={{ color: themeConfig.colors.text }} />
                          </button>
                        </RequirePermission>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                        <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          {resource.location}
                        </span>
                      </div>
                      
                      {resource.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            Capacity: {resource.capacity}
                          </span>
                        </div>
                      )}

                      {resource.quantity && (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            Quantity: {resource.quantity}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          Status:
                        </span>
                        <span className={`text-sm font-medium capitalize ${getStatusColor(resource.status)}`}>
                          {resource.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          Condition:
                        </span>
                        <span className={`text-sm font-medium capitalize ${getConditionColor(resource.condition)}`}>
                          {resource.condition.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {resource.currentValue && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: themeConfig.colors.divider }}>
                        <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                          Current Value: {formatCurrency(resource.currentValue)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'bookings' && (
        <RequirePermission resource="resources" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Resource Bookings
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Booking management functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'maintenance' && (
        <RequirePermission resource="resources" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Maintenance Schedules
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Maintenance management functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'reports' && (
        <RequirePermission resource="resources" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Resource Reports
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Resource reporting functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}
    </div>
  )
}

export default ResourceManagement