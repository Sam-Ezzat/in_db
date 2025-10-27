import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Search, Filter, SortAsc, SortDesc, Calendar, 
  User, Users, Building, FileText, Target, AlertCircle,
  ChevronRight, Mail, Phone
} from 'lucide-react'

interface SearchResult {
  id: string
  type: 'person' | 'church' | 'team' | 'committee' | 'group' | 'event'
  title: string
  subtitle?: string
  description: string
  metadata: Record<string, any>
  relevance: number
  url: string
}

interface SearchFilters {
  types: string[]
  churches: string[]
  dateRange: {
    start: string
    end: string
  }
  status: string[]
  sortBy: 'relevance' | 'date' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

const AdvancedSearch = () => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)

  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    churches: [],
    dateRange: { start: '', end: '' },
    status: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  })

  // Mock search results - replace with actual API calls
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'person',
      title: 'John Smith',
      subtitle: 'Senior Pastor',
      description: 'Senior Pastor at Grace Community Church with 15 years of ministry experience.',
      metadata: {
        church: 'Grace Community Church',
        email: 'john.smith@gracechurch.org',
        phone: '+1 (555) 123-4567',
        joinDate: '2010-03-15',
        status: 'Active'
      },
      relevance: 95,
      url: '/people/1'
    },
    {
      id: '1',
      type: 'church',
      title: 'Grace Community Church',
      subtitle: 'Main Campus',
      description: 'A vibrant community church focused on worship, fellowship, and outreach.',
      metadata: {
        address: '123 Main Street, Hometown, ST 12345',
        pastor: 'John Smith',
        founded: '1995',
        members: 1250,
        status: 'Active'
      },
      relevance: 90,
      url: '/churches/1'
    },
    {
      id: '1',
      type: 'team',
      title: 'Youth Ministry Team',
      subtitle: 'Ministry Team',
      description: 'Engaging and discipling young people ages 13-25 through dynamic programs.',
      metadata: {
        leader: 'Sarah Johnson',
        members: 28,
        church: 'Grace Community Church',
        meetingTime: 'Fridays 7:00 PM',
        status: 'Active'
      },
      relevance: 85,
      url: '/teams/1'
    },
    {
      id: '1',
      type: 'committee',
      title: 'Finance Committee',
      subtitle: 'Committee',
      description: 'Oversees church financial planning, budgeting, and fiscal responsibility.',
      metadata: {
        chair: 'Robert Anderson',
        members: 7,
        meetingSchedule: 'First Monday of each month',
        formed: '2020-01',
        status: 'Active'
      },
      relevance: 80,
      url: '/committees/1'
    },
    {
      id: '1',
      type: 'event',
      title: 'Christmas Eve Service',
      subtitle: 'Special Service',
      description: 'Traditional Christmas Eve candlelight service with carols and communion.',
      metadata: {
        date: '2024-12-24',
        time: '7:00 PM',
        location: 'Main Sanctuary',
        expectedAttendees: 300,
        status: 'Scheduled'
      },
      relevance: 75,
      url: '/events/1'
    },
    {
      id: '2',
      type: 'group',
      title: 'Men\'s Bible Study',
      subtitle: 'Small Group',
      description: 'Weekly Bible study focused on spiritual growth and fellowship.',
      metadata: {
        leader: 'Michael Brown',
        members: 12,
        meetingTime: 'Saturdays 8:00 AM',
        location: 'Room 101',
        status: 'Active'
      },
      relevance: 70,
      url: '/groups/2'
    }
  ]

  const entityTypes = [
    { value: 'person', label: 'People', icon: User, color: themeConfig.colors.primary },
    { value: 'church', label: 'Churches', icon: Building, color: themeConfig.colors.accent },
    { value: 'team', label: 'Teams', icon: Users, color: themeConfig.colors.primary },
    { value: 'committee', label: 'Committees', icon: FileText, color: themeConfig.colors.accent },
    { value: 'group', label: 'Groups', icon: Target, color: themeConfig.colors.primary },
    { value: 'event', label: 'Events', icon: Calendar, color: themeConfig.colors.accent }
  ]

  const churches = [
    'Grace Community Church',
    'First Methodist Church',
    'St. Mary\'s Catholic Church',
    'New Life Assembly'
  ]

  const statusOptions = ['Active', 'Inactive', 'Pending', 'Completed', 'Scheduled']

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let filtered = mockResults

    // Apply type filters
    if (filters.types.length > 0) {
      filtered = filtered.filter(result => filters.types.includes(result.type))
    }

    // Apply church filters
    if (filters.churches.length > 0) {
      filtered = filtered.filter(result => 
        filters.churches.some(church => 
          result.metadata.church === church || result.title === church
        )
      )
    }

    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(result => 
        filters.status.includes(result.metadata.status)
      )
    }

    // Apply date range filters
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(result => {
        const resultDate = result.metadata.date || result.metadata.joinDate || result.metadata.formed
        if (!resultDate) return true
        
        const date = new Date(resultDate)
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null
        
        if (start && date < start) return false
        if (end && date > end) return false
        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'relevance':
          comparison = b.relevance - a.relevance
          break
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          const dateA = new Date(a.metadata.date || a.metadata.joinDate || a.metadata.formed || '1900-01-01')
          const dateB = new Date(b.metadata.date || b.metadata.joinDate || b.metadata.formed || '1900-01-01')
          comparison = dateB.getTime() - dateA.getTime()
          break
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [filters])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }

    setIsSearching(true)
    const startTime = Date.now()

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock search logic - filter results based on query
    const searchResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(result.metadata).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

    setResults(searchResults)
    setTotalResults(searchResults.length)
    setSearchTime(Date.now() - startTime)
    setIsSearching(false)
  }

  const handleSearch = () => {
    setSearchParams({ q: query })
    performSearch(query)
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const toggleFilter = (filterType: 'types' | 'churches' | 'status', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }))
  }

  const toggleSelectAll = (filterType: 'types' | 'churches' | 'status') => {
    const allOptions = {
      types: entityTypes.map(type => type.value),
      churches: churches,
      status: statusOptions
    }
    
    const currentSelection = filters[filterType]
    const allItems = allOptions[filterType]
    const isAllSelected = allItems.every(item => currentSelection.includes(item))
    
    setFilters(prev => ({
      ...prev,
      [filterType]: isAllSelected ? [] : allItems
    }))
  }

  const isAllSelected = (filterType: 'types' | 'churches' | 'status') => {
    const allOptions = {
      types: entityTypes.map(type => type.value),
      churches: churches,
      status: statusOptions
    }
    
    const currentSelection = filters[filterType]
    const allItems = allOptions[filterType]
    return allItems.every(item => currentSelection.includes(item))
  }

  const isSomeSelected = (filterType: 'types' | 'churches' | 'status') => {
    const currentSelection = filters[filterType]
    return currentSelection.length > 0 && !isAllSelected(filterType)
  }

  const clearFilters = () => {
    setFilters({
      types: [],
      churches: [],
      dateRange: { start: '', end: '' },
      status: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
  }

  const getTypeIcon = (type: string) => {
    const entityType = entityTypes.find(t => t.value === type)
    return entityType ? entityType.icon : AlertCircle
  }

  const getTypeColor = (type: string) => {
    const entityType = entityTypes.find(t => t.value === type)
    return entityType ? entityType.color : themeConfig.colors.text
  }

  useEffect(() => {
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
      performSearch(searchQuery)
    }
  }, [searchParams])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>
          Advanced Search
        </h1>
        <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Search across all people, churches, teams, committees, groups, and events
        </p>
      </div>

      {/* Search Bar */}
      <div 
        className="p-6 rounded-lg border mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: themeConfig.colors.text, opacity: 0.5 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for people, churches, teams, committees, groups, events..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-lg"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border font-medium transition-colors ${
              showFilters ? 'text-white' : 'hover:opacity-80'
            }`}
            style={{ 
              backgroundColor: showFilters ? themeConfig.colors.primary : themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider,
              color: showFilters ? '#FFFFFF' : themeConfig.colors.text
            }}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div 
          className="p-6 rounded-lg border mb-6"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
              Search Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm hover:opacity-80"
              style={{ color: themeConfig.colors.primary }}
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entity Types */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                Entity Types
              </h4>
              <div className="space-y-2">
                {/* Select All Option */}
                <label className="flex items-center cursor-pointer border-b pb-2 mb-2" style={{ borderColor: themeConfig.colors.divider }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected('types')}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected('types')
                    }}
                    onChange={() => toggleSelectAll('types')}
                    className="mr-3"
                  />
                  <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                    Select All Types
                  </span>
                </label>

                {entityTypes.map(type => {
                  const IconComponent = type.icon
                  return (
                    <label key={type.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type.value)}
                        onChange={() => toggleFilter('types', type.value)}
                        className="mr-3"
                      />
                      <IconComponent size={16} className="mr-2" style={{ color: type.color }} />
                      <span style={{ color: themeConfig.colors.text }}>{type.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Churches */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                Churches
              </h4>
              <div className="space-y-2">
                {/* Select All Option */}
                <label className="flex items-center cursor-pointer border-b pb-2 mb-2" style={{ borderColor: themeConfig.colors.divider }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected('churches')}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected('churches')
                    }}
                    onChange={() => toggleSelectAll('churches')}
                    className="mr-3"
                  />
                  <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                    Select All Churches
                  </span>
                </label>

                {churches.map(church => (
                  <label key={church} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.churches.includes(church)}
                      onChange={() => toggleFilter('churches', church)}
                      className="mr-3"
                    />
                    <span style={{ color: themeConfig.colors.text }}>{church}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status & Sorting */}
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                  Status
                </h4>
                <div className="space-y-2">
                  {/* Select All Option */}
                  <label className="flex items-center cursor-pointer border-b pb-2 mb-2" style={{ borderColor: themeConfig.colors.divider }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected('status')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected('status')
                      }}
                      onChange={() => toggleSelectAll('status')}
                      className="mr-3"
                    />
                    <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                      Select All Status
                    </span>
                  </label>

                  {statusOptions.map(status => (
                    <label key={status} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => toggleFilter('status', status)}
                        className="mr-3"
                      />
                      <span style={{ color: themeConfig.colors.text }}>{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                  Sort By
                </h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="date">Date</option>
                </select>
                
                <div className="flex items-center">
                  <button
                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center text-sm hover:opacity-80"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    {filters.sortOrder === 'asc' ? <SortAsc size={16} className="mr-1" /> : <SortDesc size={16} className="mr-1" />}
                    {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: themeConfig.colors.divider }}>
            <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
              Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: themeConfig.colors.text }}>
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: themeConfig.colors.text }}>
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Stats */}
      {(results.length > 0 || query) && (
        <div className="mb-6 flex items-center justify-between">
          <div style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            {totalResults > 0 ? (
              <>
                Found <strong>{filteredResults.length}</strong> of <strong>{totalResults}</strong> results 
                {query && <> for "<strong>{query}</strong>"</>}
                <span className="ml-2">({searchTime}ms)</span>
              </>
            ) : query ? (
              <>No results found {query && <>for "<strong>{query}</strong>"</>}</>
            ) : null}
          </div>
          
          {filteredResults.length !== totalResults && (
            <div className="text-sm" style={{ color: themeConfig.colors.accent }}>
              {totalResults - filteredResults.length} results filtered out
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {filteredResults.map((result, index) => {
          const IconComponent = getTypeIcon(result.type)
          return (
            <div 
              key={`${result.type}-${result.id}-${index}`}
              onClick={() => navigate(result.url)}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(result.type) + '20' }}
                  >
                    <IconComponent size={20} style={{ color: getTypeColor(result.type) }} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold mr-2" style={{ color: themeConfig.colors.text }}>
                        {result.title}
                      </h3>
                      {result.subtitle && (
                        <span 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: getTypeColor(result.type) + '20',
                            color: getTypeColor(result.type)
                          }}
                        >
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                      {result.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      {result.metadata.church && (
                        <div className="flex items-center">
                          <Building size={14} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {result.metadata.church}
                          </span>
                        </div>
                      )}
                      
                      {result.metadata.email && (
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {result.metadata.email}
                          </span>
                        </div>
                      )}
                      
                      {result.metadata.phone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {result.metadata.phone}
                          </span>
                        </div>
                      )}
                      
                      {result.metadata.date && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {new Date(result.metadata.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {result.metadata.members && (
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                          <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                            {result.metadata.members} members
                          </span>
                        </div>
                      )}
                      
                      {result.metadata.status && (
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: result.metadata.status === 'Active' ? '#10B98120' : '#6B728020',
                            color: result.metadata.status === 'Active' ? '#10B981' : '#6B7280'
                          }}
                        >
                          {result.metadata.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-sm text-right">
                    <div style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                      {result.relevance}% match
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: themeConfig.colors.text, opacity: 0.4 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {query && filteredResults.length === 0 && !isSearching && (
        <div 
          className="text-center py-12 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
            No results found
          </h3>
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Getting Started */}
      {!query && results.length === 0 && (
        <div 
          className="p-8 rounded-lg border text-center"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <Search size={48} className="mx-auto mb-4" style={{ color: themeConfig.colors.primary }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
            Start your search
          </h3>
          <p className="mb-6" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Search across all your church data including people, churches, teams, committees, groups, and events.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {entityTypes.map(type => {
              const IconComponent = type.icon
              return (
                <div
                  key={type.value}
                  className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                  style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}
                  onClick={() => {
                    handleFilterChange('types', [type.value])
                    setShowFilters(true)
                  }}
                >
                  <IconComponent size={24} className="mx-auto mb-2" style={{ color: type.color }} />
                  <div className="text-sm text-center" style={{ color: themeConfig.colors.text }}>
                    {type.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch