import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../config/httpClient'
import { API_ENDPOINTS, LoginRequest, LoginResponse, User } from '../config/api'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!localStorage.getItem('accessToken')

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      
      setUser(response.user)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    // Optional: Call logout endpoint
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(console.error)
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.get<User>(API_ENDPOINTS.SETTINGS.GET_PROFILE)
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  // Check if user is authenticated on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (token) {
        try {
          await refreshUser()
        } catch (error) {
          console.error('Token validation failed:', error)
          logout()
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext