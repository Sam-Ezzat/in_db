import { ReactNode } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { themeConfig } = useTheme()

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: themeConfig.colors.background }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Church Management System
          </h2>
          <p className="mt-2 text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage your church community with ease
          </p>
        </div>
        
        <div 
          className="bg-white p-8 rounded-lg shadow-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout