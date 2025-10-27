// Component for requiring specific permissions before rendering children
import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAccess, type PermissionAction } from '../../contexts/AccessControlContext'

interface RequirePermissionProps {
  resource: string
  action: PermissionAction
  children: ReactNode
  fallback?: ReactNode | string // What to show if permission denied
  redirect?: string // Where to redirect if permission denied
  showFallback?: boolean // If true, show fallback instead of redirecting
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  resource,
  action,
  children,
  fallback,
  redirect = '/dashboard',
  showFallback = false
}) => {
  const { can } = useAccess()

  if (!can(resource, action)) {
    if (showFallback && fallback) {
      return <>{fallback}</>
    }
    
    if (fallback && typeof fallback !== 'string') {
      return <>{fallback}</>
    }
    
    return <Navigate to={redirect} replace />
  }

  return <>{children}</>
}

// Higher-order component version
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: string,
  action: PermissionAction,
  fallback?: ReactNode
) {
  return function PermissionWrapper(props: P) {
    return (
      <RequirePermission 
        resource={resource} 
        action={action} 
        fallback={fallback}
        showFallback={!!fallback}
      >
        <WrappedComponent {...props} />
      </RequirePermission>
    )
  }
}

// Hook for conditional rendering
export const usePermission = (resource: string, action: PermissionAction) => {
  const { can } = useAccess()
  return can(resource, action)
}

export default RequirePermission