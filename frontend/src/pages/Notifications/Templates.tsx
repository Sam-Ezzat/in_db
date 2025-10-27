import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Save,
  X,
  Mail,
  Smartphone,
  Bell,
  Monitor
} from 'lucide-react'
import { notificationService, type NotificationTemplate } from '../../services/notificationService'

const NotificationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error' | 'announcement',
    category: 'general',
    variables: [] as string[],
    channels: [] as ('app' | 'email' | 'sms' | 'push')[],
    isActive: true
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const templatesData = await notificationService.getTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingTemplate) {
        await notificationService.updateTemplate(editingTemplate.id, formData)
      } else {
        await notificationService.createTemplate(formData)
      }
      loadTemplates()
      handleCancel()
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTemplate(null)
    setFormData({
      name: '',
      title: '',
      content: '',
      type: 'info',
      category: 'general',
      variables: [],
      channels: [],
      isActive: true
    })
  }

  const handleEdit = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      title: template.title,
      content: template.content,
      type: template.type,
      category: template.category,
      variables: template.variables,
      channels: template.channels,
      isActive: template.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await notificationService.deleteTemplate(id)
        loadTemplates()
      } catch (error) {
        console.error('Error deleting template:', error)
      }
    }
  }

  const handleDuplicate = (template: NotificationTemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      title: template.title,
      content: template.content,
      type: template.type,
      category: template.category,
      variables: template.variables,
      channels: template.channels,
      isActive: template.isActive
    })
    setShowForm(true)
  }

  const extractVariables = (text: string): string[] => {
    const regex = /{{(\w+)}}/g
    const variables: string[] = []
    let match
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }
    return variables
  }

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    
    // Auto-extract variables when title or content changes
    if (field === 'title' || field === 'content') {
      const titleVars = extractVariables(newData.title)
      const contentVars = extractVariables(newData.content)
      newData.variables = [...new Set([...titleVars, ...contentVars])]
    }
    
    setFormData(newData)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'announcement': return '📢'
      default: return 'ℹ️'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'sms': return <Smartphone className="w-4 h-4" />
      case 'push': return <Bell className="w-4 h-4" />
      case 'app': return <Monitor className="w-4 h-4" />
      default: return null
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
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Templates</h1>
            <p className="text-sm text-gray-600">Create and manage reusable notification templates</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(template.type)}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Title</h4>
                  <p className="text-sm text-gray-600 truncate">{template.title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Content Preview</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                </div>
                
                {template.variables.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Variables</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable) => (
                        <span key={variable} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Channels</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {template.channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-1 text-gray-600">
                        {getChannelIcon(channel)}
                        <span className="text-xs capitalize">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">Create your first notification template to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Template
          </button>
        </div>
      )}

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormData('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="event">Events</option>
                    <option value="member">Members</option>
                    <option value="financial">Financial</option>
                    <option value="system">System</option>
                    <option value="ministry">Ministry</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification title (use {{variable}} for dynamic content)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateFormData('content', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification content (use {{variable}} for dynamic content)"
                />
              </div>
              
              {formData.variables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variables (Auto-detected)</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.variables.map((variable) => (
                      <span key={variable} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'app', label: 'In-App', icon: <Monitor className="w-4 h-4" /> },
                    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
                    { id: 'sms', label: 'SMS', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'push', label: 'Push', icon: <Bell className="w-4 h-4" /> }
                  ].map((channel) => (
                    <label key={channel.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.channels.includes(channel.id as any)}
                        onChange={(e) => {
                          const newChannels = e.target.checked
                            ? [...formData.channels, channel.id as any]
                            : formData.channels.filter(c => c !== channel.id)
                          updateFormData('channels', newChannels)
                        }}
                        className="mr-2"
                      />
                      <div className="flex items-center space-x-2">
                        {channel.icon}
                        <span>{channel.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => updateFormData('isActive', e.target.checked)}
                    className="mr-2"
                  />
                  Template is active
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? 'Update' : 'Create'} Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Template Preview</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getTypeIcon(previewTemplate.type)}</span>
                  <h4 className="font-medium text-gray-900">{previewTemplate.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{previewTemplate.content}</p>
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>Category:</strong> {previewTemplate.category}</p>
                <p><strong>Channels:</strong> {previewTemplate.channels.join(', ')}</p>
                {previewTemplate.variables.length > 0 && (
                  <p><strong>Variables:</strong> {previewTemplate.variables.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationTemplates