// Role service for managing roles and permissions
export interface RoleDef {
  id: string
  name: string
  description?: string
  permissions: Record<string, string[]> // resource -> actions
  isSystem?: boolean // Cannot be deleted
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  userId: string
  roleIds: string[]
  assignedBy: string
  assignedAt: Date
}

class RoleService {
  private roles: RoleDef[] = []
  private userRoles: Record<string, string[]> = {}
  // IDs are generated deterministically in createRole for predictable mocks

  // Get all available roles
  async getRoles(): Promise<RoleDef[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.roles]), 100)
    })
  }

  // Synchronously seed roles (useful for app initialization / mocks)
  seedRoles(roles: Omit<RoleDef, 'id' | 'createdAt' | 'updatedAt'>[]) {
    roles.forEach(role => {
      const newRole: RoleDef = {
        ...role,
        id: (this.roles.length + 1).toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.roles.push(newRole)
    })
  }

  // Get roles for a specific user
  async getUserRoles(userId: string): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.userRoles[userId] || []), 50)
    })
  }

  // Create a new role
  async createRole(role: Omit<RoleDef, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoleDef> {
    return new Promise((resolve) => {
      const newRole: RoleDef = {
        ...role,
        // Use incremental deterministic ids for easier testing/mocks ("1", "2", ...)
        id: (this.roles.length + 1).toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.roles.push(newRole)
      setTimeout(() => resolve(newRole), 100)
    })
  }

  // Update an existing role
  async updateRole(id: string, updates: Partial<RoleDef>): Promise<RoleDef> {
    return new Promise((resolve, reject) => {
      const role = this.roles.find(r => r.id === id)
      if (!role) {
        setTimeout(() => reject(new Error('Role not found')), 50)
        return
      }

      Object.assign(role, updates, { updatedAt: new Date() })
      setTimeout(() => resolve(role), 100)
    })
  }

  // Delete a role
  async deleteRole(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const role = this.roles.find(r => r.id === id)
      if (!role) {
        setTimeout(() => reject(new Error('Role not found')), 50)
        return
      }

      if (role.isSystem) {
        setTimeout(() => reject(new Error('Cannot delete system role')), 50)
        return
      }

      this.roles = this.roles.filter(r => r.id !== id)
      
      // Remove role from all users
      Object.keys(this.userRoles).forEach(userId => {
        this.userRoles[userId] = this.userRoles[userId].filter(roleId => roleId !== id)
      })

      setTimeout(() => resolve(), 100)
    })
  }

  // Assign roles to a user
  async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
    return new Promise((resolve) => {
      this.userRoles[userId] = roleIds
      setTimeout(() => resolve(), 100)
    })
  }

  // Add a role to a user (append to existing)
  async addRoleToUser(userId: string, roleId: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.userRoles[userId]) {
        this.userRoles[userId] = []
      }
      if (!this.userRoles[userId].includes(roleId)) {
        this.userRoles[userId].push(roleId)
      }
      setTimeout(() => resolve(), 100)
    })
  }

  // Remove a role from a user
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.userRoles[userId]) {
        this.userRoles[userId] = this.userRoles[userId].filter(id => id !== roleId)
      }
      setTimeout(() => resolve(), 100)
    })
  }

  // Get all users with their roles
  async getUsersWithRoles(): Promise<Record<string, string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.userRoles }), 100)
    })
  }

  // Check if a specific user has a permission
  async userCan(userId: string, resource: string, action: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const userRoleIds = await this.getUserRoles(userId)
      const userRoles = this.roles.filter(role => userRoleIds.includes(role.id))
      
      const hasPermission = userRoles.some(role => {
        const resourcePermissions = role.permissions[resource] || []
        return resourcePermissions.includes(action)
      })
      
      setTimeout(() => resolve(hasPermission), 50)
    })
  }
}

// Initialize with mock data
const service = new RoleService()

// Mock system roles
const systemRoles: Omit<RoleDef, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Super Administrator',
    description: 'Full system access - can manage everything',
    isSystem: true,
    permissions: {
      'people': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'churches': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'locations': ['view', 'create', 'read', 'update', 'delete', 'export', 'import'],
      'committees': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'teams': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'groups': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'events': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'attendance': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'financial': ['view', 'create', 'update', 'delete', 'export', 'import'],
      'reports': ['view', 'create', 'export'],
      'evaluations': ['view', 'create', 'update', 'delete'],
      'notifications': ['view', 'send', 'manage_templates'],
      'settings': ['view', 'manage'],
      'roles': ['view', 'create', 'update', 'delete', 'manage'],
      // Resources management
      'resources': ['view', 'create', 'update', 'delete', 'export', 'import']
    }
  },
  {
    name: 'Church Administrator',
    description: 'Manage church operations and members',
    isSystem: true,
    permissions: {
      'people': ['view', 'create', 'update', 'delete', 'export'],
      'churches': ['view', 'update'],
      'locations': ['view', 'read', 'update'],
      'committees': ['view', 'create', 'update', 'delete'],
      'teams': ['view', 'create', 'update', 'delete'],
      'groups': ['view', 'create', 'update', 'delete'],
      'events': ['view', 'create', 'update', 'delete'],
      'attendance': ['view', 'create', 'update', 'delete', 'export'],
      'financial': ['view', 'create', 'update', 'export'],
      'reports': ['view', 'create'],
      'evaluations': ['view', 'create', 'update'],
      'notifications': ['view', 'send'],
      'settings': ['view']
      ,
      // Resources for Church Administrator
      'resources': ['view', 'create', 'update', 'delete']
    }
  },
  {
    name: 'Ministry Leader',
    description: 'Manage specific ministries and groups',
    isSystem: true,
    permissions: {
      'people': ['view', 'export'],
      'churches': ['view'],
      'locations': ['view', 'read'],
      'committees': ['view'],
      'teams': ['view', 'update'],
      'groups': ['view', 'create', 'update', 'delete'],
      'events': ['view', 'create', 'update'],
      'attendance': ['view', 'create', 'update'],
      'financial': ['view'],
      'reports': ['view'],
      'evaluations': ['view', 'create'],
      'notifications': ['view']
      ,
      // Resources for Ministry Leader
      'resources': ['view', 'create', 'update']
    }
  },
  {
    name: 'Member',
    description: 'Basic member access - view own information',
    isSystem: true,
    permissions: {
      'people': ['view'],
      'churches': ['view'],
      'locations': ['view', 'read'],
      'committees': ['view'],
      'teams': ['view'],
      'groups': ['view'],
      'events': ['view'],
      'attendance': ['view'],
      'financial': ['view'],
      'reports': ['view'],
      'evaluations': ['view'],
      'notifications': ['view']
      ,
      // Members can view resources
      'resources': ['view']
    }
  },
  {
    name: 'Volunteer',
    description: 'Limited access for volunteers',
    isSystem: true,
    permissions: {
      'people': ['view'],
      'churches': ['view'],
      'locations': ['view', 'read'],
      'events': ['view'],
      'attendance': ['view'],
      'groups': ['view'],
      'notifications': ['view']
    }
  }
]

// Create system roles synchronously so IDs are deterministic immediately
service.seedRoles(systemRoles)

// Mock user role assignments
const mockUserRoles = {
  'admin_001': ['1'], // Super Administrator for Church Administrator
  'pastor_001': ['2'], // Church Administrator for Pastor
  'current-user': ['1'], // Super Administrator (fallback)
  'user-2': ['2'], // Church Administrator
  'user-3': ['3'], // Ministry Leader
  'user-4': ['4'], // Member
  'user-5': ['5']  // Volunteer
}

// Assign mock roles to users
Object.entries(mockUserRoles).forEach(([userId, roleIds]) => {
  service.assignRolesToUser(userId, roleIds)
})

export const roleService = service
export default roleService