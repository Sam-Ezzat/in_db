// Role-Based Access Control service for managing permissions and roles
export interface Permission {
  id: string
  name: string
  description: string
  resource: string // e.g., 'people', 'churches', 'events', 'reports'
  action: string // e.g., 'create', 'read', 'update', 'delete', 'export', 'manage'
  scope: 'global' | 'church' | 'team' | 'self' // Scope of the permission
  category: string // e.g., 'core', 'admin', 'ministry', 'financial'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Role {
  id: string
  name: string
  description: string
  level: number // Hierarchy level (higher = more permissions)
  type: 'system' | 'custom' // System roles can't be deleted
  permissions: string[] // Array of permission IDs
  restrictions: {
    maxUsers?: number
    churchSpecific?: boolean
    requiresApproval?: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  scope?: {
    churchIds?: string[]
    teamIds?: string[]
    groupIds?: string[]
  }
  isActive: boolean
  metadata?: Record<string, any>
}

export interface RoleRequest {
  id: string
  userId: string
  requestedRoleId: string
  requestedBy: string
  approvedBy?: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: Date
  reviewedAt?: Date
  reviewNotes?: string
  expiresAt?: Date
}

export interface AccessAuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  permission: string
  granted: boolean
  reason?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface RoleTemplate {
  id: string
  name: string
  description: string
  category: string
  permissions: string[]
  isDefault: boolean
  churchType?: string[] // Types of churches this template is suitable for
  createdAt: Date
  updatedAt: Date
}

class RoleBasedAccessService {
  private permissions: Permission[] = []
  private roles: Role[] = []
  private userRoles: UserRole[] = []
  private roleRequests: RoleRequest[] = []
  private auditLogs: AccessAuditLog[] = []
  private roleTemplates: RoleTemplate[] = []

  // Permission Management
  async getPermissions(filter?: {
    resource?: string
    category?: string
    scope?: string
  }): Promise<Permission[]> {
    return new Promise((resolve) => {
      let filtered = [...this.permissions]

      if (filter) {
        if (filter.resource) {
          filtered = filtered.filter(p => p.resource === filter.resource)
        }
        if (filter.category) {
          filtered = filtered.filter(p => p.category === filter.category)
        }
        if (filter.scope) {
          filtered = filtered.filter(p => p.scope === filter.scope)
        }
      }

      setTimeout(() => resolve(filtered), 100)
    })
  }

  async createPermission(permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Permission> {
    return new Promise((resolve) => {
      const newPermission: Permission = {
        ...permission,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.permissions.push(newPermission)
      setTimeout(() => resolve(newPermission), 100)
    })
  }

  // Role Management
  async getRoles(includeInactive = false): Promise<Role[]> {
    return new Promise((resolve) => {
      const filtered = includeInactive 
        ? this.roles 
        : this.roles.filter(r => r.isActive)
      
      setTimeout(() => resolve([...filtered]), 100)
    })
  }

  async createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    return new Promise((resolve) => {
      const newRole: Role = {
        ...role,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.roles.push(newRole)
      setTimeout(() => resolve(newRole), 100)
    })
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    return new Promise((resolve, reject) => {
      const role = this.roles.find(r => r.id === id)
      if (!role) {
        setTimeout(() => reject(new Error('Role not found')), 50)
        return
      }

      if (role.type === 'system' && updates.permissions) {
        setTimeout(() => reject(new Error('Cannot modify permissions of system roles')), 50)
        return
      }

      Object.assign(role, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(role), 100)
    })
  }

  async deleteRole(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const role = this.roles.find(r => r.id === id)
      if (!role) {
        setTimeout(() => reject(new Error('Role not found')), 50)
        return
      }

      if (role.type === 'system') {
        setTimeout(() => reject(new Error('Cannot delete system roles')), 50)
        return
      }

      // Check if role is assigned to any users
      const assignedUsers = this.userRoles.filter(ur => ur.roleId === id && ur.isActive)
      if (assignedUsers.length > 0) {
        setTimeout(() => reject(new Error(`Cannot delete role assigned to ${assignedUsers.length} user(s)`)), 50)
        return
      }

      this.roles = this.roles.filter(r => r.id !== id)
      setTimeout(() => resolve(), 100)
    })
  }

  // User Role Assignment
  async getUserRoles(userId: string): Promise<{ roles: Role[], userRoles: UserRole[] }> {
    return new Promise((resolve) => {
      const userRoleAssignments = this.userRoles.filter(ur => ur.userId === userId && ur.isActive)
      const roles = this.roles.filter(r => userRoleAssignments.some(ur => ur.roleId === r.id))
      
      setTimeout(() => resolve({ roles, userRoles: userRoleAssignments }), 100)
    })
  }

  async assignRole(assignment: Omit<UserRole, 'id' | 'assignedAt'>): Promise<UserRole> {
    return new Promise((resolve, reject) => {
      const role = this.roles.find(r => r.id === assignment.roleId)
      if (!role || !role.isActive) {
        setTimeout(() => reject(new Error('Role not found or inactive')), 50)
        return
      }

      // Check if user already has this role
      const existingAssignment = this.userRoles.find(ur => 
        ur.userId === assignment.userId && 
        ur.roleId === assignment.roleId && 
        ur.isActive
      )

      if (existingAssignment) {
        setTimeout(() => reject(new Error('User already has this role')), 50)
        return
      }

      const newAssignment: UserRole = {
        ...assignment,
        id: Date.now().toString(),
        assignedAt: new Date()
      }

      this.userRoles.push(newAssignment)
      setTimeout(() => resolve(newAssignment), 100)
    })
  }

  async revokeRole(userId: string, roleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const assignment = this.userRoles.find(ur => 
        ur.userId === userId && 
        ur.roleId === roleId && 
        ur.isActive
      )

      if (!assignment) {
        setTimeout(() => reject(new Error('Role assignment not found')), 50)
        return
      }

      assignment.isActive = false
      setTimeout(() => resolve(), 100)
    })
  }

  // Permission Checking
  async hasPermission(
    userId: string, 
    resource: string, 
    action: string, 
    scope?: { churchId?: string, teamId?: string }
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const { roles } = await this.getUserRoles(userId)
        
        for (const role of roles) {
          const rolePermissions = this.permissions.filter(p => 
            role.permissions.includes(p.id) && 
            p.resource === resource && 
            p.action === action &&
            p.isActive
          )

          for (const permission of rolePermissions) {
            // Check scope-based permissions
            if (permission.scope === 'global') {
              this.logAccess(userId, action, resource, undefined, permission.id, true)
              resolve(true)
              return
            }

            if (permission.scope === 'church' && scope?.churchId) {
              // Check if user has church-specific access
              const userRole = this.userRoles.find(ur => 
                ur.userId === userId && 
                ur.roleId === role.id && 
                ur.isActive &&
                ur.scope?.churchIds?.includes(scope.churchId!)
              )
              if (userRole) {
                this.logAccess(userId, action, resource, undefined, permission.id, true)
                resolve(true)
                return
              }
            }

            if (permission.scope === 'team' && scope?.teamId) {
              // Check if user has team-specific access
              const userRole = this.userRoles.find(ur => 
                ur.userId === userId && 
                ur.roleId === role.id && 
                ur.isActive &&
                ur.scope?.teamIds?.includes(scope.teamId!)
              )
              if (userRole) {
                this.logAccess(userId, action, resource, undefined, permission.id, true)
                resolve(true)
                return
              }
            }
          }
        }

        this.logAccess(userId, action, resource, undefined, '', false, 'Insufficient permissions')
        resolve(false)
      } catch (error) {
        this.logAccess(userId, action, resource, undefined, '', false, 'Error checking permissions')
        resolve(false)
      }
    })
  }

  // Role Requests
  async createRoleRequest(request: Omit<RoleRequest, 'id' | 'requestedAt' | 'status'>): Promise<RoleRequest> {
    return new Promise((resolve) => {
      const newRequest: RoleRequest = {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        requestedAt: new Date()
      }

      this.roleRequests.push(newRequest)
      setTimeout(() => resolve(newRequest), 100)
    })
  }

  async getRoleRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<RoleRequest[]> {
    return new Promise((resolve) => {
      const filtered = status 
        ? this.roleRequests.filter(r => r.status === status)
        : this.roleRequests

      setTimeout(() => resolve([...filtered]), 100)
    })
  }

  async reviewRoleRequest(
    requestId: string, 
    reviewerId: string, 
    decision: 'approved' | 'rejected', 
    notes?: string
  ): Promise<RoleRequest> {
    return new Promise(async (resolve, reject) => {
      const request = this.roleRequests.find(r => r.id === requestId)
      if (!request) {
        setTimeout(() => reject(new Error('Request not found')), 50)
        return
      }

      if (request.status !== 'pending') {
        setTimeout(() => reject(new Error('Request already reviewed')), 50)
        return
      }

      request.status = decision
      request.approvedBy = reviewerId
      request.reviewedAt = new Date()
      request.reviewNotes = notes

      // If approved, assign the role
      if (decision === 'approved') {
        try {
          await this.assignRole({
            userId: request.userId,
            roleId: request.requestedRoleId,
            assignedBy: reviewerId,
            isActive: true,
            expiresAt: request.expiresAt
          })
        } catch (error) {
          request.status = 'rejected'
          request.reviewNotes = `Auto-rejected: ${error}`
        }
      }

      setTimeout(() => resolve(request), 100)
    })
  }

  // Audit Logging
  private logAccess(
    userId: string,
    action: string,
    resource: string,
    resourceId: string | undefined,
    permission: string,
    granted: boolean,
    reason?: string
  ): void {
    const log: AccessAuditLog = {
      id: Date.now().toString(),
      userId,
      action,
      resource,
      resourceId,
      permission,
      granted,
      reason,
      timestamp: new Date()
    }

    this.auditLogs.push(log)
  }

  async getAuditLogs(filter?: {
    userId?: string
    resource?: string
    dateRange?: { from: Date; to: Date }
    granted?: boolean
  }): Promise<AccessAuditLog[]> {
    return new Promise((resolve) => {
      let filtered = [...this.auditLogs]

      if (filter) {
        if (filter.userId) {
          filtered = filtered.filter(l => l.userId === filter.userId)
        }
        if (filter.resource) {
          filtered = filtered.filter(l => l.resource === filter.resource)
        }
        if (filter.granted !== undefined) {
          filtered = filtered.filter(l => l.granted === filter.granted)
        }
        if (filter.dateRange) {
          filtered = filtered.filter(l => 
            l.timestamp >= filter.dateRange!.from && 
            l.timestamp <= filter.dateRange!.to
          )
        }
      }

      // Sort by timestamp (newest first)
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setTimeout(() => resolve(filtered), 100)
    })
  }

  // Role Templates
  async getRoleTemplates(): Promise<RoleTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.roleTemplates]), 100)
    })
  }

  async createRoleFromTemplate(templateId: string, customizations?: {
    name?: string
    description?: string
    additionalPermissions?: string[]
    removedPermissions?: string[]
  }): Promise<Role> {
    return new Promise(async (resolve, reject) => {
      const template = this.roleTemplates.find(t => t.id === templateId)
      if (!template) {
        setTimeout(() => reject(new Error('Template not found')), 50)
        return
      }

      let permissions = [...template.permissions]
      
      if (customizations?.additionalPermissions) {
        permissions = [...permissions, ...customizations.additionalPermissions]
      }
      
      if (customizations?.removedPermissions) {
        permissions = permissions.filter(p => !customizations.removedPermissions!.includes(p))
      }

      const role = await this.createRole({
        name: customizations?.name || template.name,
        description: customizations?.description || template.description,
        level: 5, // Default level for template-based roles
        type: 'custom',
        permissions: [...new Set(permissions)], // Remove duplicates
        restrictions: {},
        isActive: true,
        createdBy: 'system'
      })

      resolve(role)
    })
  }

  // Utility Methods
  async getRoleHierarchy(): Promise<{ role: Role, level: number, children: Role[] }[]> {
    return new Promise((resolve) => {
      const hierarchy = this.roles
        .filter(r => r.isActive)
        .sort((a, b) => b.level - a.level)
        .map(role => ({
          role,
          level: role.level,
          children: this.roles.filter(r => r.level < role.level && r.isActive)
        }))

      setTimeout(() => resolve(hierarchy), 100)
    })
  }

  async getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
    return new Promise((resolve) => {
      const grouped = this.permissions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      }, {} as Record<string, Permission[]>)

      setTimeout(() => resolve(grouped), 100)
    })
  }
}

// Initialize service with mock data
const service = new RoleBasedAccessService()

// Initialize with system permissions
const systemPermissions: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // People Management
  { name: 'View People', description: 'View member profiles and information', resource: 'people', action: 'read', scope: 'global', category: 'core', isActive: true },
  { name: 'Create People', description: 'Add new members to the system', resource: 'people', action: 'create', scope: 'global', category: 'core', isActive: true },
  { name: 'Edit People', description: 'Modify member information', resource: 'people', action: 'update', scope: 'global', category: 'core', isActive: true },
  { name: 'Delete People', description: 'Remove members from the system', resource: 'people', action: 'delete', scope: 'global', category: 'admin', isActive: true },
  
  // Church Management
  { name: 'View Churches', description: 'View church information', resource: 'churches', action: 'read', scope: 'global', category: 'core', isActive: true },
  { name: 'Manage Churches', description: 'Create and modify church information', resource: 'churches', action: 'manage', scope: 'global', category: 'admin', isActive: true },
  
  // Events
  { name: 'View Events', description: 'View event information', resource: 'events', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Events', description: 'Create new events', resource: 'events', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Events', description: 'Update event information', resource: 'events', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Events', description: 'Delete events', resource: 'events', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  { name: 'Manage Event Registrations', description: 'Manage event registrations and attendees', resource: 'events', action: 'manage_registrations', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Record Event Attendance', description: 'Record and manage event attendance', resource: 'events', action: 'record_attendance', scope: 'church', category: 'ministry', isActive: true },
  { name: 'View Event Analytics', description: 'View event analytics and reports', resource: 'events', action: 'view_analytics', scope: 'church', category: 'ministry', isActive: true },
  
  // Reports
  { name: 'View Reports', description: 'Access basic reports', resource: 'reports', action: 'read', scope: 'church', category: 'core', isActive: true },
  { name: 'Advanced Reports', description: 'Access advanced analytics and reports', resource: 'reports', action: 'manage', scope: 'global', category: 'admin', isActive: true },
  
  // Financial
  { name: 'View Financial', description: 'View financial information', resource: 'financial', action: 'read', scope: 'church', category: 'financial', isActive: true },
  { name: 'Manage Financial', description: 'Full financial management', resource: 'financial', action: 'manage', scope: 'global', category: 'financial', isActive: true },
  
  // Resources
  { name: 'View Resources', description: 'View resource information', resource: 'resources', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Resources', description: 'Create new resources', resource: 'resources', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Resources', description: 'Update resource information', resource: 'resources', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Resources', description: 'Delete resources', resource: 'resources', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  { name: 'Manage Resource Bookings', description: 'Manage resource bookings and schedules', resource: 'resources', action: 'book', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Manage Resource Maintenance', description: 'Manage resource maintenance and repairs', resource: 'resources', action: 'maintain', scope: 'church', category: 'admin', isActive: true },
  
  // Groups
  { name: 'View Groups', description: 'View group information', resource: 'groups', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Groups', description: 'Create new groups', resource: 'groups', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Groups', description: 'Update group information', resource: 'groups', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Groups', description: 'Delete groups', resource: 'groups', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  { name: 'Manage Group Members', description: 'Add and remove group members', resource: 'groups', action: 'manage_members', scope: 'church', category: 'ministry', isActive: true },
  
  // Communication Management
  { name: 'View Messages', description: 'View messages and conversations', resource: 'messages', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Messages', description: 'Send messages and start conversations', resource: 'messages', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Messages', description: 'Edit and manage messages', resource: 'messages', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Messages', description: 'Delete messages and conversations', resource: 'messages', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  
  { name: 'View Notifications', description: 'View notifications', resource: 'notifications', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Notifications', description: 'Send notifications to users', resource: 'notifications', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Notifications', description: 'Update notification preferences', resource: 'notifications', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Manage Notifications', description: 'Full notification system management', resource: 'notifications', action: 'manage', scope: 'global', category: 'admin', isActive: true },
  
  { name: 'View Campaigns', description: 'View email and SMS campaigns', resource: 'campaigns', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Campaigns', description: 'Create email and SMS campaigns', resource: 'campaigns', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Send Campaigns', description: 'Send and schedule campaigns', resource: 'campaigns', action: 'send', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Campaigns', description: 'Update campaign information', resource: 'campaigns', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Campaigns', description: 'Delete campaigns', resource: 'campaigns', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  { name: 'View Campaign Analytics', description: 'View campaign performance analytics', resource: 'campaigns', action: 'view_analytics', scope: 'church', category: 'ministry', isActive: true },
  
  { name: 'View Templates', description: 'View communication templates', resource: 'templates', action: 'view', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Create Templates', description: 'Create communication templates', resource: 'templates', action: 'create', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Update Templates', description: 'Update communication templates', resource: 'templates', action: 'update', scope: 'church', category: 'ministry', isActive: true },
  { name: 'Delete Templates', description: 'Delete communication templates', resource: 'templates', action: 'delete', scope: 'church', category: 'admin', isActive: true },
  
  // System Administration
  { name: 'User Management', description: 'Manage user accounts and roles', resource: 'users', action: 'manage', scope: 'global', category: 'admin', isActive: true },
  { name: 'System Settings', description: 'Modify system configuration', resource: 'system', action: 'manage', scope: 'global', category: 'admin', isActive: true }
]

// Add system permissions
systemPermissions.forEach(permission => {
  service.createPermission(permission)
})

// System roles
const systemRoles: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    level: 10,
    type: 'system',
    permissions: [], // Will be populated with all permission IDs
    restrictions: {},
    isActive: true,
    createdBy: 'system'
  },
  {
    name: 'Church Administrator',
    description: 'Full church management access',
    level: 8,
    type: 'system',
    permissions: [], // Will be populated with church-level permissions
    restrictions: { churchSpecific: true },
    isActive: true,
    createdBy: 'system'
  },
  {
    name: 'Pastor',
    description: 'Church leadership with ministry permissions',
    level: 7,
    type: 'system',
    permissions: [], // Will be populated with ministry permissions
    restrictions: { churchSpecific: true },
    isActive: true,
    createdBy: 'system'
  },
  {
    name: 'Ministry Leader',
    description: 'Team and event management permissions',
    level: 5,
    type: 'system',
    permissions: [], // Will be populated with team/event permissions
    restrictions: { churchSpecific: true },
    isActive: true,
    createdBy: 'system'
  },
  {
    name: 'Member',
    description: 'Basic member access permissions',
    level: 2,
    type: 'system',
    permissions: [], // Will be populated with basic permissions
    restrictions: {},
    isActive: true,
    createdBy: 'system'
  },
  {
    name: 'Guest',
    description: 'Limited read-only access',
    level: 1,
    type: 'system',
    permissions: [], // Will be populated with read-only permissions
    restrictions: {},
    isActive: true,
    createdBy: 'system'
  }
]

// Add system roles (permissions will be assigned after all permissions are created)
setTimeout(async () => {
  const permissions = await service.getPermissions()
  
  // Super Administrator gets all permissions
  const superAdminRole = await service.createRole({
    ...systemRoles[0],
    permissions: permissions.map(p => p.id)
  })

  // Church Administrator gets admin and core permissions
  const churchAdminRole = await service.createRole({
    ...systemRoles[1],
    permissions: permissions.filter(p => 
      p.category === 'admin' || 
      p.category === 'core' || 
      p.category === 'ministry'
    ).map(p => p.id)
  })

  // Pastor gets ministry and core permissions
  const pastorRole = await service.createRole({
    ...systemRoles[2],
    permissions: permissions.filter(p => 
      p.category === 'core' || 
      p.category === 'ministry' ||
      (p.category === 'financial' && p.action === 'read')
    ).map(p => p.id)
  })

  // Ministry Leader gets team/event permissions
  const ministryLeaderRole = await service.createRole({
    ...systemRoles[3],
    permissions: permissions.filter(p => 
      p.category === 'core' || 
      (p.category === 'ministry' && p.resource !== 'financial')
    ).map(p => p.id)
  })

  // Member gets basic read permissions
  const memberRole = await service.createRole({
    ...systemRoles[4],
    permissions: permissions.filter(p => 
      p.action === 'read' && 
      p.category === 'core'
    ).map(p => p.id)
  })

  // Guest gets very limited read permissions
  const guestRole = await service.createRole({
    ...systemRoles[5],
    permissions: permissions.filter(p => 
      p.action === 'read' && 
      p.resource === 'events'
    ).map(p => p.id)
  })
}, 200)

export const roleBasedAccessService = service
export default roleBasedAccessService