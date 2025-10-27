import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { getUserFullName, getUserInitials } from '../../utils/auth'
import QuickSearch from '../Search/QuickSearch'
import { 
  LayoutDashboard, Users, Building, Users2, UserCheck, 
  Calendar, FileText, TrendingUp, Settings, User, 
  LogOut, Palette, Menu, X, ChevronDown, Bell, Search, Download, Shield, DollarSign, Building2
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Churches', href: '/churches', icon: Building },
  { name: 'Committees', href: '/committees', icon: Users2 },
  { name: 'Teams', href: '/teams', icon: UserCheck },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Financial', href: '/financial', icon: DollarSign },
  { name: 'Resources', href: '/resources', icon: Building2 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Evaluations', href: '/evaluations', icon: TrendingUp },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Export/Import', href: '/export-import', icon: Download },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Role Management', href: '/role-management', icon: Shield },
]

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme, toggleTheme, themeConfig, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => location.pathname === href

  // Theme options
  const themeOptions = [
    { key: 'light-grace' as const, name: 'Light Grace', color: '#8B5CF6' },
    { key: 'warm-faith' as const, name: 'Warm Faith', color: '#F59E0B' },
    { key: 'nature-hope' as const, name: 'Nature Hope', color: '#10B981' },
    { key: 'midnight-prayer' as const, name: 'Midnight Prayer', color: '#3B82F6' },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ backgroundColor: themeConfig.colors.secondary }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b" style={{ borderColor: themeConfig.colors.divider }}>
            <h2 className="text-xl font-bold" style={{ color: themeConfig.colors.text }}>
              Church Management
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded"
              style={{ color: themeConfig.colors.text }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${active 
                      ? 'text-white shadow-md' 
                      : 'hover:opacity-80'
                    }
                  `}
                  style={{
                    backgroundColor: active ? themeConfig.colors.primary : 'transparent',
                    color: active ? '#ffffff' : themeConfig.colors.text,
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Theme selector and user menu */}
          <div className="p-4 border-t space-y-2" style={{ borderColor: themeConfig.colors.divider }}>
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
              style={{ color: themeConfig.colors.text }}
            >
              <Palette size={18} className="mr-3" />
              {themeConfig.displayName}
            </button>
            
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
              style={{ color: themeConfig.colors.text }}
            >
              <User size={18} className="mr-3" />
              Profile
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
              style={{ color: themeConfig.colors.text }}
            >
              <Settings size={18} className="mr-3" />
              Settings
            </Link>
            
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
              style={{ color: themeConfig.colors.text }}
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-16 px-6 border-b" style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}>
          {/* Mobile menu button and title */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded lg:hidden mr-3"
              style={{ color: themeConfig.colors.text }}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold lg:hidden" style={{ color: themeConfig.colors.text }}>
              Church Management
            </h1>
          </div>

          {/* Center - Search Bar (hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <QuickSearch />
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:opacity-80 transition-opacity relative"
              style={{ color: themeConfig.colors.text }}
            >
              <Bell size={20} />
              <span 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center text-white"
                style={{ backgroundColor: '#EF4444', fontSize: '10px' }}
              >
                3
              </span>
            </button>

            {/* Theme Selector */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="flex items-center p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ color: themeConfig.colors.text }}
              >
                <Palette size={20} />
                <ChevronDown size={16} className="ml-1" />
              </button>

              {/* Theme Dropdown */}
              {themeMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-50"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      Choose Theme
                    </div>
                    {themeOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setTheme(option.key)
                          setThemeMenuOpen(false)
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg hover:opacity-80 transition-opacity ${
                          theme === option.key ? 'ring-2' : ''
                        }`}
                        style={{ 
                          color: themeConfig.colors.text,
                          ...(theme === option.key && {
                            backgroundColor: themeConfig.colors.primary + '20',
                            borderColor: themeConfig.colors.primary
                          })
                        }}
                      >
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.name}
                        {theme === option.key && (
                          <span className="ml-auto text-xs" style={{ color: themeConfig.colors.primary }}>
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ color: themeConfig.colors.text }}
              >
                {/* Avatar */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  {getUserInitials(user)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{getUserFullName(user)}</div>
                  <div className="text-xs opacity-70">{user?.role || 'Member'}</div>
                </div>
                <ChevronDown size={16} />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-50"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  <div className="p-2">
                    {/* User Info */}
                    <div className="px-3 py-2 border-b" style={{ borderColor: themeConfig.colors.divider }}>
                      <div className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                        {getUserFullName(user)}
                      </div>
                      <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                        {user?.email || 'user@church.com'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-2 text-sm rounded-lg hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.text }}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-3 py-2 text-sm rounded-lg hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.text }}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Settings
                      </Link>
                      
                      <div className="border-t my-2" style={{ borderColor: themeConfig.colors.divider }}></div>
                      
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:opacity-80 transition-opacity"
                        style={{ color: '#EF4444' }}
                        onClick={() => {
                          setProfileMenuOpen(false)
                          logout()
                        }}
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6" style={{ color: themeConfig.colors.text }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout