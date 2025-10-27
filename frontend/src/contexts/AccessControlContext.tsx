// Access Control types and context for role-based permissions
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { roleService, type RoleDef } from '../services/roleService'

export type PermissionAction = 
  | 'view' | 'create' | 'read' | 'update' | 'delete' 
  | 'export' | 'import' | 'send' | 'manage_templates' | 'manage'

export interface AccessControlContextValue {
  can: (resource: string, action: PermissionAction) => boolean
  roles: RoleDef[]
  userRoles: string[]
  loading: boolean
  refreshPermissions: () => void
}

const AccessControlContext = createContext<AccessControlContextValue | undefined>(undefined)

interface AccessControlProviderProps {
  children: ReactNode
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [roles, setRoles] = useState<RoleDef[]>([])
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadRolesAndPermissions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Load all role definitions
      const rolesData = await roleService.getRoles()
      setRoles(rolesData)
      
      // Load user's assigned roles
      const userRolesData = await roleService.getUserRoles(user.id)
      setUserRoles(userRolesData)
    } catch (error) {
      console.error('Error loading roles and permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRolesAndPermissions()
  }, [user])

  const can = (resource: string, action: PermissionAction): boolean => {
    if (!user || userRoles.length === 0) {
      return false
    }

    // Check if user has any role that grants this permission
    return userRoles.some(roleId => {
      const role = roles.find(r => r.id === roleId)
      if (!role) return false
      
      const resourcePermissions = role.permissions[resource] || []
      return resourcePermissions.includes(action)
    })
  }

  const refreshPermissions = () => {
    loadRolesAndPermissions()
  }

  const value: AccessControlContextValue = {
    can,
    roles,
    userRoles,
    loading,
    refreshPermissions
  }

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  )
}

export const useAccessControl = (): AccessControlContextValue => {
  const context = useContext(AccessControlContext)
  if (context === undefined) {
    throw new Error('useAccessControl must be used within an AccessControlProvider')
  }
  return context
}

// Convenience hook with shorter name
export const useAccess = (): { can: (resource: string, action: PermissionAction) => boolean } => {
  const { can } = useAccessControl()
  return { can }
}