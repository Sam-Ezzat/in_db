import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  X, Download, Filter, 
  CheckSquare, Square, Minus, Eye
} from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  entityType: string
  entityCount: number
}

interface ExportField {
  key: string
  label: string
  description?: string
  required?: boolean
  selected: boolean
}

const ExportModal = ({ isOpen, onClose, entityType, entityCount }: ExportModalProps) => {
  const { themeConfig } = useTheme()
  const [exportSettings, setExportSettings] = useState({
    format: 'csv',
    includeHeaders: true,
    includeInactive: false,
    dateFormat: 'ISO',
    encoding: 'UTF-8'
  })

  // Mock field mappings for different entity types
  const getFieldsForEntity = (type: string): ExportField[] => {
    const commonFields = [
      { key: 'id', label: 'ID', description: 'Unique identifier', required: true, selected: true },
      { key: 'created_at', label: 'Created Date', description: 'Record creation timestamp', selected: true },
      { key: 'updated_at', label: 'Last Modified', description: 'Last update timestamp', selected: false },
      { key: 'status', label: 'Status', description: 'Active/Inactive status', selected: true }
    ]

    switch (type) {
      case 'people':
        return [
          ...commonFields,
          { key: 'first_name', label: 'First Name', required: true, selected: true },
          { key: 'last_name', label: 'Last Name', required: true, selected: true },
          { key: 'email', label: 'Email Address', selected: true },
          { key: 'phone', label: 'Phone Number', selected: true },
          { key: 'address', label: 'Address', selected: false },
          { key: 'city', label: 'City', selected: false },
          { key: 'state', label: 'State', selected: false },
          { key: 'zip_code', label: 'ZIP Code', selected: false },
          { key: 'date_of_birth', label: 'Date of Birth', selected: false },
          { key: 'church_id', label: 'Church', selected: true },
          { key: 'skills', label: 'Skills', description: 'Comma-separated list', selected: false },
          { key: 'interests', label: 'Interests', description: 'Comma-separated list', selected: false },
          { key: 'emergency_contact', label: 'Emergency Contact', selected: false }
        ]
      
      case 'churches':
        return [
          ...commonFields,
          { key: 'name', label: 'Church Name', required: true, selected: true },
          { key: 'description', label: 'Description', selected: true },
          { key: 'address', label: 'Address', selected: true },
          { key: 'city', label: 'City', selected: true },
          { key: 'state', label: 'State', selected: true },
          { key: 'zip_code', label: 'ZIP Code', selected: true },
          { key: 'phone', label: 'Phone Number', selected: true },
          { key: 'email', label: 'Email Address', selected: true },
          { key: 'website', label: 'Website', selected: false },
          { key: 'pastor_name', label: 'Pastor Name', selected: true },
          { key: 'denomination', label: 'Denomination', selected: false },
          { key: 'capacity', label: 'Capacity', selected: false },
          { key: 'founded_date', label: 'Founded Date', selected: false }
        ]
      
      case 'events':
        return [
          ...commonFields,
          { key: 'title', label: 'Event Title', required: true, selected: true },
          { key: 'description', label: 'Description', selected: true },
          { key: 'start_date', label: 'Start Date', selected: true },
          { key: 'end_date', label: 'End Date', selected: true },
          { key: 'location', label: 'Location', selected: true },
          { key: 'church_id', label: 'Church', selected: true },
          { key: 'category', label: 'Category', selected: true },
          { key: 'max_attendees', label: 'Max Attendees', selected: false },
          { key: 'registration_required', label: 'Registration Required', selected: false },
          { key: 'cost', label: 'Cost', selected: false },
          { key: 'organizer', label: 'Organizer', selected: true }
        ]
      
      default:
        return commonFields
    }
  }

  const [selectedFields, setSelectedFields] = useState<ExportField[]>(
    getFieldsForEntity(entityType)
  )

  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    church: 'all',
    status: 'all',
    customFilters: []
  })

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.map(field => 
        field.key === fieldKey 
          ? { ...field, selected: !field.selected }
          : field
      )
    )
  }

  const toggleAllFields = () => {
    const allSelected = selectedFields.every(field => field.selected || field.required)
    setSelectedFields(prev => 
      prev.map(field => ({
        ...field,
        selected: field.required || !allSelected
      }))
    )
  }

  const getSelectAllState = () => {
    const selectableFields = selectedFields.filter(field => !field.required)
    const selectedCount = selectableFields.filter(field => field.selected).length
    
    if (selectedCount === 0) return 'none'
    if (selectedCount === selectableFields.length) return 'all'
    return 'some'
  }

  const selectedCount = selectedFields.filter(field => field.selected).length
  const totalCount = selectedFields.length

  const handleExport = () => {
    const exportData = {
      entityType,
      format: exportSettings.format,
      fields: selectedFields.filter(field => field.selected).map(field => field.key),
      filters,
      settings: exportSettings,
      estimatedRecords: entityCount
    }
    
    console.log('Exporting with configuration:', exportData)
    // In real implementation, this would trigger the export process
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: themeConfig.colors.divider }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: themeConfig.colors.text }}>
                Export {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
              </h2>
              <p className="text-sm mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                Configure export settings and select fields to include
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:opacity-70 transition-opacity"
              style={{ color: themeConfig.colors.text }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field Selection */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                  Select Fields ({selectedCount}/{totalCount})
                </h3>
                <button
                  onClick={toggleAllFields}
                  className="flex items-center text-sm hover:opacity-80 transition-opacity"
                  style={{ color: themeConfig.colors.primary }}
                >
                  {getSelectAllState() === 'all' ? (
                    <CheckSquare size={16} className="mr-1" />
                  ) : getSelectAllState() === 'some' ? (
                    <Minus size={16} className="mr-1" />
                  ) : (
                    <Square size={16} className="mr-1" />
                  )}
                  Select All
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedFields.map(field => (
                  <div
                    key={field.key}
                    className={`p-3 rounded-lg border transition-colors ${
                      field.selected ? 'ring-1' : ''
                    }`}
                    style={{ 
                      backgroundColor: field.selected 
                        ? themeConfig.colors.primary + '10' 
                        : themeConfig.colors.secondary,
                      borderColor: field.selected 
                        ? themeConfig.colors.primary 
                        : themeConfig.colors.divider
                    }}
                  >
                    <div className="flex items-start">
                      <button
                        onClick={() => !field.required && toggleField(field.key)}
                        disabled={field.required}
                        className={`mr-3 mt-0.5 ${field.required ? 'opacity-50' : 'hover:opacity-80'}`}
                      >
                        {field.selected ? (
                          <CheckSquare 
                            size={18} 
                            style={{ color: themeConfig.colors.primary }} 
                          />
                        ) : (
                          <Square 
                            size={18} 
                            style={{ color: themeConfig.colors.text, opacity: 0.5 }} 
                          />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span 
                            className="font-medium"
                            style={{ color: themeConfig.colors.text }}
                          >
                            {field.label}
                          </span>
                          {field.required && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <p 
                            className="text-sm mt-1"
                            style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                          >
                            {field.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Settings */}
            <div className="space-y-6">
              {/* Format Settings */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                  Export Format
                </h4>
                <div className="space-y-2">
                  {['csv', 'excel', 'json', 'pdf'].map(format => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={exportSettings.format === format}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value }))}
                        className="mr-2"
                        style={{ accentColor: themeConfig.colors.primary }}
                      />
                      <span 
                        className="text-sm"
                        style={{ color: themeConfig.colors.text }}
                      >
                        {format.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Settings */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <h4 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
                  Settings
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportSettings.includeHeaders}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                      className="mr-2"
                      style={{ accentColor: themeConfig.colors.primary }}
                    />
                    <span 
                      className="text-sm"
                      style={{ color: themeConfig.colors.text }}
                    >
                      Include column headers
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportSettings.includeInactive}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, includeInactive: e.target.checked }))}
                      className="mr-2"
                      style={{ accentColor: themeConfig.colors.primary }}
                    />
                    <span 
                      className="text-sm"
                      style={{ color: themeConfig.colors.text }}
                    >
                      Include inactive records
                    </span>
                  </label>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeConfig.colors.text }}
                    >
                      Date Format
                    </label>
                    <select
                      value={exportSettings.dateFormat}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full px-2 py-1 border rounded text-sm"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="ISO">ISO (2024-10-27)</option>
                      <option value="US">US (10/27/2024)</option>
                      <option value="EU">EU (27/10/2024)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeConfig.colors.text }}
                    >
                      Encoding
                    </label>
                    <select
                      value={exportSettings.encoding}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, encoding: e.target.value }))}
                      className="w-full px-2 py-1 border rounded text-sm"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider,
                        color: themeConfig.colors.text
                      }}
                    >
                      <option value="UTF-8">UTF-8</option>
                      <option value="ISO-8859-1">ISO-8859-1</option>
                      <option value="Windows-1252">Windows-1252</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <div className="flex items-center mb-3">
                  <Filter size={16} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                  <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                    Filters
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeConfig.colors.text }}
                    >
                      Date Range
                    </label>
                    <div className="space-y-1">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        style={{ 
                          backgroundColor: themeConfig.colors.background,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        style={{ 
                          backgroundColor: themeConfig.colors.background,
                          borderColor: themeConfig.colors.divider,
                          color: themeConfig.colors.text
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Summary */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: themeConfig.colors.accent + '20',
                  borderColor: themeConfig.colors.accent 
                }}
              >
                <div className="flex items-center mb-2">
                  <Eye size={16} className="mr-2" style={{ color: themeConfig.colors.accent }} />
                  <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                    Export Summary
                  </h4>
                </div>
                <div className="text-sm space-y-1" style={{ color: themeConfig.colors.text }}>
                  <div>Format: {exportSettings.format.toUpperCase()}</div>
                  <div>Fields: {selectedCount} selected</div>
                  <div>Estimated records: {entityCount.toLocaleString()}</div>
                  <div>Estimated size: ~{Math.round(entityCount * selectedCount * 0.05)} KB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t"
          style={{ borderColor: themeConfig.colors.divider }}
        >
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text 
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedCount === 0}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Download size={16} className="mr-2" />
              Start Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal