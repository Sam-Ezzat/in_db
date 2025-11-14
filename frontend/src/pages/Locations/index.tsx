import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'
import {
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { locationService, Location } from '../../services/locationService'

interface LocationsProps {}

const Locations: React.FC<LocationsProps> = () => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { can } = useAccess()

  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'country' | 'governorate' | 'sector'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('')
  const [countries, setCountries] = useState<Location[]>([])
  const [governorates, setGovernorates] = useState<Location[]>([])

  useEffect(() => {
    loadData()
    loadCountries()
  }, [filterType, selectedCountry, selectedGovernorate])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      let filters: any = {}

      if (filterType !== 'all') {
        filters.type = filterType
      }

      if (selectedCountry) {
        if (filterType === 'governorate') {
          filters.parentId = selectedCountry
        }
      }

      if (selectedGovernorate) {
        if (filterType === 'sector') {
          filters.parentId = selectedGovernorate
        }
      }

      if (searchTerm) {
        filters.searchTerm = searchTerm
      }

      const data = await locationService.getLocations(filters)
      setLocations(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load locations')
      console.error('Error loading locations:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    const countriesData = await locationService.getCountries()
    setCountries(countriesData)
  }

  const loadGovernorates = async (countryId: string) => {
    const governoratesData = await locationService.getGovernorates(countryId)
    setGovernorates(governoratesData)
  }

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId)
    setSelectedGovernorate('')
    if (countryId) {
      loadGovernorates(countryId)
    }
  }

  const handleSearch = () => {
    loadData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!can('locations', 'delete')) {
      setError('You do not have permission to delete locations')
      return
    }

    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await locationService.deleteLocation(id)
        loadData()
      } catch (err: any) {
        setError(err.message || 'Failed to delete location')
      }
    }
  }

  const getTypeIcon = (type: Location['type']) => {
    switch (type) {
      case 'country':
        return <GlobeAltIcon className="h-5 w-5" style={{ color: themeConfig.colors.primary }} />
      case 'governorate':
        return <BuildingOfficeIcon className="h-5 w-5" style={{ color: themeConfig.colors.primary }} />
      case 'sector':
        return <MapPinIcon className="h-5 w-5" style={{ color: themeConfig.colors.primary }} />
    }
  }

  const getTypeBadgeColor = (type: Location['type']) => {
    switch (type) {
      case 'country':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'governorate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'sector':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    }
  }

  if (loading && locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeConfig.colors.primary }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>
            Location Management
          </h1>
          <p style={{ color: themeConfig.colors.text + '80' }}>
            Manage geographic hierarchy: Countries, Governorates, and Sectors
          </p>
        </div>
        {can('locations', 'create') && (
          <button
            onClick={() => navigate('/locations/new')}
            className="flex items-center px-4 py-2 rounded-md font-medium transition-colors"
            style={{ backgroundColor: themeConfig.colors.primary, color: 'white' }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Location
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Countries', value: countries.length, icon: GlobeAltIcon, color: '#3B82F6' },
          { label: 'Governorates', value: governorates.length, icon: BuildingOfficeIcon, color: '#10B981' },
          { label: 'Total Locations', value: locations.length, icon: MapPinIcon, color: '#8B5CF6' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="p-6 rounded-lg border"
              style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text + '80' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: themeConfig.colors.text }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <Icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              style={{
                borderColor: themeConfig.colors.divider,
                backgroundColor: themeConfig.colors.background,
                color: themeConfig.colors.text
              }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border rounded-md"
            style={{
              borderColor: themeConfig.colors.divider,
              backgroundColor: themeConfig.colors.background,
              color: themeConfig.colors.text
            }}
          >
            <option value="all">All Types</option>
            <option value="country">Countries</option>
            <option value="governorate">Governorates</option>
            <option value="sector">Sectors</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border rounded-md"
            style={{
              borderColor: themeConfig.colors.divider,
              backgroundColor: showFilters ? themeConfig.colors.secondary : themeConfig.colors.background,
              color: themeConfig.colors.text
            }}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: themeConfig.colors.divider }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  borderColor: themeConfig.colors.divider,
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text
                }}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>

            {selectedCountry && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Governorate
                </label>
                <select
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                >
                  <option value="">All Governorates</option>
                  {governorates.map(gov => (
                    <option key={gov.id} value={gov.id}>{gov.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Locations Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b" style={{ borderColor: themeConfig.colors.divider, backgroundColor: themeConfig.colors.secondary }}>
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Location Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Parent
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Children
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center" style={{ color: themeConfig.colors.text + '60' }}>
                    <MapPinIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No locations found</p>
                  </td>
                </tr>
              ) : (
                locations.map((location) => (
                  <tr
                    key={location.id}
                    className="hover:bg-opacity-50 cursor-pointer"
                    style={{ backgroundColor: themeConfig.colors.background }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeConfig.colors.secondary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = themeConfig.colors.background
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getTypeIcon(location.type)}
                        <span className="ml-3 font-medium" style={{ color: themeConfig.colors.text }}>
                          {location.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(location.type)}`}>
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: themeConfig.colors.text + '80' }}>
                      {location.parent ? location.parent.name : '—'}
                    </td>
                    <td className="px-6 py-4" style={{ color: themeConfig.colors.text + '80' }}>
                      {location.children && location.children.length > 0 ? (
                        <span className="flex items-center">
                          {location.children.length}
                          <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {can('locations', 'read') && (
                          <button
                            onClick={() => navigate(`/locations/${location.id}`)}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{ color: themeConfig.colors.primary }}
                            title="View Details"
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        )}
                        {can('locations', 'update') && (
                          <button
                            onClick={() => navigate(`/locations/${location.id}/edit`)}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{ color: themeConfig.colors.primary }}
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {can('locations', 'delete') && (
                          <button
                            onClick={() => handleDelete(location.id, location.name)}
                            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900"
                            style={{ color: '#EF4444' }}
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Locations
