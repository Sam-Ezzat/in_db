import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { roleBasedAccessService, type Role, type Permission, type UserRole } from '../services/roleBasedAccessService'

interface AccessControlContextType {
  userRoles: Role[]
  userPermissions: Permission[]
  loading: boolean
  hasPermission: (resource: string, action: string, scope?: { churchId?: string; teamId?: string }) => boolean
  hasRole: (roleName: string) => boolean
  canAccess: (requiredPermissions: string[]) => boolean
  getUserLevel: () => number
  refreshPermissions: () => Promise<void>
}

const AccessControlContext = createContext<AccessControlContextType | undefined>(undefined)

interface AccessControlProviderProps {
  children: ReactNode
  userId: string
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children, userId }) => {
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  const loadUserPermissions = async () => {
    setLoading(true)
    try {
      const { roles } = await roleBasedAccessService.getUserRoles(userId)
      const allPermissions = await roleBasedAccessService.getPermissions()
      
      // Get all permission IDs from user's roles
      const userPermissionIds = roles.flatMap(role => role.permissions)
      const uniquePermissionIds = [...new Set(userPermissionIds)]
      
      // Filter permissions that user has access to
      const userPermissionsList = allPermissions.filter(permission => 
        uniquePermissionIds.includes(permission.id) && permission.isActive
      )

      setUserRoles(roles.filter(role => role.isActive))
      setUserPermissions(userPermissionsList)
    } catch (error) {
      console.error('Error loading user permissions:', error)
      setUserRoles([])
      setUserPermissions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserPermissions()
    }
  }, [userId])

  const hasPermission = (
    resource: string, 
    action: string, 
    scope?: { churchId?: string; teamId?: string }
  ): boolean => {
    const permission = userPermissions.find(p => 
      p.resource === resource && 
      p.action === action &&
      p.isActive
    )

    if (!permission) return false

    // Check scope-based access
    if (permission.scope === 'global') return true
    
    if (permission.scope === 'church' && scope?.churchId) {
      // In a real app, you'd check if user has church-specific access
      return true // Simplified for demo
    }
    
    if (permission.scope === 'team' && scope?.teamId) {
      // In a real app, you'd check if user has team-specific access
      return true // Simplified for demo
    }

    if (permission.scope === 'self') {
      // Self permissions are always granted
      return true
    }

    return false
  }

  const hasRole = (roleName: string): boolean => {
    return userRoles.some(role => role.name === roleName)
  }

  const canAccess = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => {
      const [resource, action] = permission.split(':')
      return hasPermission(resource, action)
    })
  }

  const getUserLevel = (): number => {
    return Math.max(...userRoles.map(role => role.level), 0)
  }

  const refreshPermissions = async (): Promise<void> => {
    await loadUserPermissions()
  }

  const contextValue: AccessControlContextType = {
    userRoles,
    userPermissions,
    loading,
    hasPermission,
    hasRole,
    canAccess,
    getUserLevel,
    refreshPermissions
  }

  return (
    <AccessControlContext.Provider value={contextValue}>
      {children}
    </AccessControlContext.Provider>
  )
}

export const useAccessControl = (): AccessControlContextType => {
  const context = useContext(AccessControlContext)
  if (context === undefined) {
    throw new Error('useAccessControl must be used within an AccessControlProvider')
  }
  return context
}

// Permission-based component wrapper
interface ProtectedComponentProps {
  children: ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
  resource?: string
  action?: string
  scope?: { churchId?: string; teamId?: string }
  fallback?: ReactNode
  minLevel?: number
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  resource,
  action,
  scope,
  fallback = null,
  minLevel
}) => {
  const { hasPermission, hasRole, canAccess, getUserLevel, loading } = useAccessControl()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
  }

  // Check minimum level requirement
  if (minLevel && getUserLevel() < minLevel) {
    return <>{fallback}</>
  }

  // Check specific permission
  if (resource && action && !hasPermission(resource, action, scope)) {
    return <>{fallback}</>
  }

  // Check required permissions
  if (requiredPermissions.length > 0 && !canAccess(requiredPermissions)) {
    return <>{fallback}</>
  }

  // Check required roles
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook for imperative permission checking
export const usePermissions = () => {
  const { hasPermission, hasRole, canAccess, getUserLevel } = useAccessControl()

  return {
    can: hasPermission,
    hasRole,
    canAccess,
    level: getUserLevel(),
    canCreate: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'create', scope),
    canRead: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'read', scope),
    canUpdate: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'update', scope),
    canDelete: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'delete', scope),
    canManage: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'manage', scope),
    canExport: (resource: string, scope?: { churchId?: string; teamId?: string }) => 
      hasPermission(resource, 'export', scope),
    isAdmin: () => hasRole('Super Administrator') || hasRole('Church Administrator'),
    isPastor: () => hasRole('Pastor'),
    isMinistryLeader: () => hasRole('Ministry Leader'),
    isMember: () => hasRole('Member'),
    isGuest: () => hasRole('Guest')
  }
}

// Utility component for conditional rendering based on permissions
interface ConditionalRenderProps {
  condition: boolean
  children: ReactNode
  fallback?: ReactNode
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  condition,
  children,
  fallback = null
}) => {
  return condition ? <>{children}</> : <>{fallback}</>
}

// Permission-aware button component
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredPermission?: string
  requiredRole?: string
  resource?: string
  action?: string
  scope?: { churchId?: string; teamId?: string }
  minLevel?: number
  children: ReactNode
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  requiredPermission,
  requiredRole,
  resource,
  action,
  scope,
  minLevel,
  children,
  disabled,
  ...props
}) => {
  const { hasPermission, hasRole, getUserLevel } = useAccessControl()

  let hasAccess = true

  if (minLevel && getUserLevel() < minLevel) {
    hasAccess = false
  }

  if (resource && action && !hasPermission(resource, action, scope)) {
    hasAccess = false
  }

  if (requiredPermission) {
    const [res, act] = requiredPermission.split(':')
    if (!hasPermission(res, act, scope)) {
      hasAccess = false
    }
  }

  if (requiredRole && !hasRole(requiredRole)) {
    hasAccess = false
  }

  if (!hasAccess) {
    return null
  }

  return (
    <button
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Permission-aware link component
interface PermissionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  requiredPermission?: string
  requiredRole?: string
  resource?: string
  action?: string
  scope?: { churchId?: string; teamId?: string }
  minLevel?: number
  children: ReactNode
}

export const PermissionLink: React.FC<PermissionLinkProps> = ({
  requiredPermission,
  requiredRole,
  resource,
  action,
  scope,
  minLevel,
  children,
  ...props
}) => {
  const { hasPermission, hasRole, getUserLevel } = useAccessControl()

  let hasAccess = true

  if (minLevel && getUserLevel() < minLevel) {
    hasAccess = false
  }

  if (resource && action && !hasPermission(resource, action, scope)) {
    hasAccess = false
  }

  if (requiredPermission) {
    const [res, act] = requiredPermission.split(':')
    if (!hasPermission(res, act, scope)) {
      hasAccess = false
    }
  }

  if (requiredRole && !hasRole(requiredRole)) {
    hasAccess = false
  }

  if (!hasAccess) {
    return null
  }

  return (
    <a {...props}>
      {children}
    </a>
  )
}