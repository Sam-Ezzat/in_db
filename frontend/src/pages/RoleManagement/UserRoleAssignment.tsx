import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  Calendar,
  Clock,
  Award,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { 
  roleBasedAccessService, 
  type Role, 
  type UserRole, 
  type RoleRequest 
} from '../../services/roleBasedAccessService'

interface UserRoleAssignmentProps {
  selectedRole?: Role | null
  onClose?: () => void
}

const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({ selectedRole, onClose }) => {
  const [assignments, setAssignments] = useState<UserRole[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [assignmentScope, setAssignmentScope] = useState({
    churchIds: [] as string[],
    teamIds: [] as string[],
    groupIds: [] as string[]
  })
  const [expiryDate, setExpiryDate] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedRole])

  const loadData = async () => {
    setLoading(true)
    try {
      // In a real app, you'd load actual user data and role assignments
      // For now, we'll use mock data
      setAvailableUsers([
        { id: 'user1', name: 'John Smith', email: 'john@church.org', status: 'active' },
        { id: 'user2', name: 'Mary Johnson', email: 'mary@church.org', status: 'active' },
        { id: 'user3', name: 'David Wilson', email: 'david@church.org', status: 'active' },
        { id: 'user4', name: 'Sarah Brown', email: 'sarah@church.org', status: 'inactive' }
      ])

      setAssignments([
        {
          id: '1',
          userId: 'user1',
          roleId: selectedRole?.id || '',
          assignedBy: 'admin',
          assignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          scope: { churchIds: ['church1'] }
        },
        {
          id: '2',
          userId: 'user2',
          roleId: selectedRole?.id || '',
          assignedBy: 'admin',
          assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          isActive: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      ])
    } catch (error) {
      console.error('Error loading role assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return

    try {
      await roleBasedAccessService.assignRole({
        userId: selectedUser,
        roleId: selectedRole.id,
        assignedBy: 'current-user',
        isActive: true,
        expiresAt: expiryDate ? new Date(expiryDate) : undefined,
        scope: Object.keys(assignmentScope).some(key => assignmentScope[key as keyof typeof assignmentScope].length > 0) 
          ? assignmentScope 
          : undefined
      })

      loadData()
      setShowAssignForm(false)
      setSelectedUser('')
      setExpiryDate('')
      setAssignmentScope({ churchIds: [], teamIds: [], groupIds: [] })
    } catch (error) {
      console.error('Error assigning role:', error)
      alert('Error assigning role. User may already have this role.')
    }
  }

  const handleRevokeRole = async (userId: string) => {
    if (!selectedRole) return
    
    if (window.confirm('Are you sure you want to revoke this role assignment?')) {
      try {
        await roleBasedAccessService.revokeRole(userId, selectedRole.id)
        loadData()
      } catch (error) {
        console.error('Error revoking role:', error)
        alert('Error revoking role assignment.')
      }
    }
  }

  const getUserName = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    return user ? user.name : `User ${userId}`
  }

  const getUserEmail = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    return user ? user.email : ''
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days} days ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  const formatExpiryStatus = (expiresAt?: Date) => {
    if (!expiresAt) return null

    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { status: 'expired', text: 'Expired', color: 'text-red-600' }
    if (days <= 7) return { status: 'expiring', text: `Expires in ${days} days`, color: 'text-yellow-600' }
    return { status: 'active', text: `Expires in ${days} days`, color: 'text-green-600' }
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
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedRole ? `Users with "${selectedRole.name}" Role` : 'Role Assignments'}
            </h2>
            <p className="text-sm text-gray-600">Manage user role assignments and permissions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAssignForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Role
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Role Info */}
      {selectedRole && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {selectedRole.level >= 9 ? <Shield className="w-8 h-8 text-red-600" /> :
               selectedRole.level >= 7 ? <Award className="w-8 h-8 text-purple-600" /> :
               <Users className="w-8 h-8 text-blue-600" />}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{selectedRole.name}</h3>
              <p className="text-sm text-gray-600">{selectedRole.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Level: {selectedRole.level}</span>
                <span>•</span>
                <span>Permissions: {selectedRole.permissions.length}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedRole.type === 'system' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedRole.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Assignments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Assignments</h3>
          <p className="text-sm text-gray-600">Users currently assigned to this role</p>
        </div>
        
        <div className="p-6">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No assignments</h4>
              <p className="text-gray-500 mb-4">No users are currently assigned to this role.</p>
              <button
                onClick={() => setShowAssignForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign First User
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const expiryStatus = formatExpiryStatus(assignment.expiresAt)
                return (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{getUserName(assignment.userId)}</h4>
                          <p className="text-sm text-gray-600">{getUserEmail(assignment.userId)}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>Assigned {formatTimeAgo(assignment.assignedAt)}</span>
                            {assignment.expiresAt && expiryStatus && (
                              <>
                                <span>•</span>
                                <span className={expiryStatus.color}>{expiryStatus.text}</span>
                              </>
                            )}
                            {assignment.scope && (
                              <>
                                <span>•</span>
                                <span>Scoped</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded text-xs ${
                          assignment.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {assignment.isActive ? 'Active' : 'Inactive'}
                        </div>
                        
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-1 text-gray-400 hover:text-yellow-600"
                          title="Edit Assignment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRevokeRole(assignment.userId)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Revoke Role"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {assignment.scope && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Scope: </span>
                          {assignment.scope.churchIds && assignment.scope.churchIds.length > 0 && (
                            <span>Churches: {assignment.scope.churchIds.join(', ')} </span>
                          )}
                          {assignment.scope.teamIds && assignment.scope.teamIds.length > 0 && (
                            <span>Teams: {assignment.scope.teamIds.join(', ')} </span>
                          )}
                          {assignment.scope.groupIds && assignment.scope.groupIds.length > 0 && (
                            <span>Groups: {assignment.scope.groupIds.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assign Role Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Assign Role to User</h3>
              <button
                onClick={() => setShowAssignForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a user...</option>
                  {availableUsers
                    .filter(user => !assignments.some(a => a.userId === user.id && a.isActive))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedRole?.restrictions?.churchSpecific && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Church Scope (Required for this role)
                  </label>
                  <select
                    multiple
                    value={assignmentScope.churchIds}
                    onChange={(e) => setAssignmentScope({
                      ...assignmentScope,
                      churchIds: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="church1">Main Church</option>
                    <option value="church2">North Campus</option>
                    <option value="church3">South Campus</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple churches
                  </p>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Assignment Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This will grant the user all permissions associated with the "{selectedRole?.name}" role.
                      {selectedRole?.restrictions?.requiresApproval && ' This role requires approval before activation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRole}
                disabled={!selectedUser}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRoleAssignment