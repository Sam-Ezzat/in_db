import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  UserMinus,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Award,
  Lock,
  Unlock,
  History,
  Settings as SettingsIcon
} from 'lucide-react'
import { 
  roleBasedAccessService, 
  type Role, 
  type Permission, 
  type UserRole, 
  type RoleRequest 
} from '../../services/roleBasedAccessService'

const RoleManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'requests' | 'audit'>('roles')
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showUserAssignment, setShowUserAssignment] = useState(false)
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    type: '',
    status: 'active'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [rolesData, permissionsData, requestsData] = await Promise.all([
        roleBasedAccessService.getRoles(true),
        roleBasedAccessService.getPermissions(),
        roleBasedAccessService.getRoleRequests()
      ])
      
      setRoles(rolesData)
      setPermissions(permissionsData)
      setRoleRequests(requestsData)
    } catch (error) {
      console.error('Error loading role data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleBasedAccessService.deleteRole(roleId)
        loadData()
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Error deleting role. It may be assigned to users.')
      }
    }
  }

  const handleToggleRoleStatus = async (roleId: string, isActive: boolean) => {
    try {
      await roleBasedAccessService.updateRole(roleId, { isActive: !isActive })
      loadData()
    } catch (error) {
      console.error('Error updating role status:', error)
    }
  }

  const filteredRoles = roles.filter(role => {
    if (filter.search && !role.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !role.description.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.type && role.type !== filter.type) return false
    if (filter.status === 'active' && !role.isActive) return false
    if (filter.status === 'inactive' && role.isActive) return false
    return true
  })

  const filteredPermissions = permissions.filter(permission => {
    if (filter.search && !permission.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !permission.description.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.category && permission.category !== filter.category) return false
    return true
  })

  const pendingRequests = roleRequests.filter(r => r.status === 'pending')

  const getRoleIcon = (role: Role) => {
    if (role.level >= 9) return <Shield className="w-5 h-5 text-red-600" />
    if (role.level >= 7) return <Award className="w-5 h-5 text-purple-600" />
    if (role.level >= 5) return <Key className="w-5 h-5 text-blue-600" />
    return <Users className="w-5 h-5 text-green-600" />
  }

  const getPermissionScopeColor = (scope: string) => {
    switch (scope) {
      case 'global': return 'bg-red-100 text-red-800'
      case 'church': return 'bg-blue-100 text-blue-800'
      case 'team': return 'bg-green-100 text-green-800'
      case 'self': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
            <p className="text-sm text-gray-600">Manage roles, permissions, and access control</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {pendingRequests.length > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''}</span>
            </div>
          )}
          <button
            onClick={() => setShowRoleForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Role
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Key className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.filter(r => r.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'roles', label: 'Roles', icon: Shield },
            { id: 'permissions', label: 'Permissions', icon: Key },
            { id: 'requests', label: 'Requests', icon: Clock, badge: pendingRequests.length },
            { id: 'audit', label: 'Audit Log', icon: History }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {activeTab === 'roles' && (
            <>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select>

              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </>
          )}

          {activeTab === 'permissions' && (
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="core">Core</option>
              <option value="admin">Admin</option>
              <option value="ministry">Ministry</option>
              <option value="financial">Financial</option>
            </select>
          )}
        </div>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {filteredRoles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">Create your first role to get started.</p>
              <button
                onClick={() => setShowRoleForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRoles.map((role) => (
                <div key={role.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(role)}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedRole(role)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {role.type === 'custom' && (
                          <>
                            <button
                              onClick={() => {
                                setEditingRole(role)
                                setShowRoleForm(true)
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleToggleRoleStatus(role.id, role.isActive)}
                          className={`p-1 ${role.isActive ? 'text-green-600 hover:text-red-600' : 'text-gray-400 hover:text-green-600'}`}
                          title={role.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {role.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{role.level}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          role.type === 'system' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {role.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Permissions:</span>
                        <span className="font-medium">{role.permissions.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          role.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {role.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Created {new Date(role.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedRole(role)
                            setShowUserAssignment(true)
                          }}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Assign Users
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Permissions</h3>
            <div className="space-y-4">
              {Object.entries(
                filteredPermissions.reduce((acc, permission) => {
                  if (!acc[permission.category]) acc[permission.category] = []
                  acc[permission.category].push(permission)
                  return acc
                }, {} as Record<string, Permission[]>)
              ).map(([category, categoryPermissions]) => (
                <div key={category} className="border rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-medium text-gray-900 capitalize">{category} Permissions</h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-sm text-gray-900">{permission.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded ${getPermissionScopeColor(permission.scope)}`}>
                              {permission.scope}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{permission.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{permission.resource}:{permission.action}</span>
                            <span className={permission.isActive ? 'text-green-600' : 'text-red-600'}>
                              {permission.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role Requests</h3>
            {roleRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No role requests found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {roleRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">User ID: {request.userId}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Requested Role: {roles.find(r => r.id === request.requestedRoleId)?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">Reason: {request.reason}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Access Audit Log</h3>
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Audit log functionality coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals would be implemented here */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            <p className="text-gray-500 mb-4">Role form implementation coming soon...</p>
            <button
              onClick={() => {
                setShowRoleForm(false)
                setEditingRole(null)
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagementPage