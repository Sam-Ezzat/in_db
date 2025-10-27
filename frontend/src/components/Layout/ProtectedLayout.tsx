import React, { ReactNode } from 'react'
import { AccessControlProvider } from '../../contexts/AccessControlContext'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedLayoutProps {
  children: ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { user } = useAuth()

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AccessControlProvider>
      {children}
    </AccessControlProvider>
  )
}

export default ProtectedLayout