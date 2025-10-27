import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { Search, Clock, TrendingUp } from 'lucide-react'

interface QuickSearchProps {
  className?: string
}

const QuickSearch = ({ className = '' }: QuickSearchProps) => {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches] = useState([
    'John Smith',
    'Youth Ministry',
    'Grace Community Church',
    'Finance Committee',
    'Christmas Service'
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsOpen(false)
    }
  }

  const handleRecentSearch = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    setIsOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: themeConfig.colors.text, opacity: 0.5 }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyPress}
          placeholder="Search... (Ctrl+K)"
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{ 
            backgroundColor: themeConfig.colors.background,
            borderColor: isOpen ? themeConfig.colors.primary : themeConfig.colors.divider,
            color: themeConfig.colors.text,
            boxShadow: isOpen ? `0 0 0 2px ${themeConfig.colors.primary}20` : 'none'
          }}
        />
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 py-2 rounded-lg border shadow-lg z-50 max-h-80 overflow-y-auto"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          {query.trim() ? (
            <div>
              {/* Search Action */}
              <button
                onClick={handleSearch}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                style={{ 
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeConfig.colors.background
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Search size={16} className="mr-3" style={{ color: themeConfig.colors.primary }} />
                <div>
                  <div className="font-medium" style={{ color: themeConfig.colors.text }}>
                    Search for "{query}"
                  </div>
                  <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Press Enter or click to search
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    <Clock size={14} className="inline mr-2" />
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      style={{ 
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeConfig.colors.background
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span style={{ color: themeConfig.colors.text }}>{search}</span>
                      <TrendingUp size={14} style={{ color: themeConfig.colors.text, opacity: 0.4 }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="border-t mt-2 pt-2" style={{ borderColor: themeConfig.colors.divider }}>
                <div className="px-4 py-2 text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    navigate('/search')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeConfig.colors.background
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span style={{ color: themeConfig.colors.text }}>Advanced Search</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuickSearch