import { createContext, useContext, useState, ReactNode } from 'react'

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

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  setResults: (results: SearchResult[]) => void
  isSearching: boolean
  setIsSearching: (isSearching: boolean) => void
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  totalResults: number
  setTotalResults: (total: number) => void
  searchTime: number
  setSearchTime: (time: number) => void
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

const defaultFilters: SearchFilters = {
  types: [],
  churches: [],
  dateRange: { start: '', end: '' },
  status: [],
  sortBy: 'relevance',
  sortOrder: 'desc'
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const addRecentSearch = (searchQuery: string) => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 9)]) // Keep last 10 searches
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    setResults,
    isSearching,
    setIsSearching,
    filters,
    setFilters,
    totalResults,
    setTotalResults,
    searchTime,
    setSearchTime,
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export default SearchContext