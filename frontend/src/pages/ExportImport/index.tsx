import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import ExportModal from './ExportModal'
import ImportModal from './ImportModal'
import { exportImportService } from '../../services/exportImportService'
import { 
  Download, Upload, FileText, FileSpreadsheet, 
  Calendar, Users, Building, UserCheck, Target,
  CheckCircle, AlertCircle, Clock, Settings,
  Filter, Eye, Trash2, RefreshCw
} from 'lucide-react'

interface ExportJob {
  id: string
  type: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  fileName?: string
  fileSize?: string
  recordCount?: number
  downloadUrl?: string
  filters?: Record<string, any>
}

interface ImportJob {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reviewing'
  createdAt: string
  completedAt?: string
  fileName: string
  fileSize: string
  totalRecords: number
  processedRecords?: number
  validRecords?: number
  invalidRecords?: number
  errors?: string[]
  preview?: any[]
}

const ExportImport = () => {
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'history'>('export')
  const [selectedEntityType, setSelectedEntityType] = useState('people')
  const [selectedFormat, setSelectedFormat] = useState('csv')
  const [exportFilters, setExportFilters] = useState({
    dateRange: { start: '', end: '' },
    status: 'all',
    church: 'all'
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // Mock data
  const entityTypes = [
    { value: 'people', label: 'People', icon: Users, count: 1250 },
    { value: 'churches', label: 'Churches', icon: Building, count: 4 },
    { value: 'teams', label: 'Teams', icon: UserCheck, count: 12 },
    { value: 'committees', label: 'Committees', icon: FileText, count: 8 },
    { value: 'groups', label: 'Groups', icon: Target, count: 25 },
    { value: 'events', label: 'Events', icon: Calendar, count: 156 }
  ]

  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheets' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel workbook format' },
    { value: 'pdf', label: 'PDF', description: 'Formatted document for printing' },
    { value: 'json', label: 'JSON', description: 'Structured data format for developers' }
  ]

  const recentExports: ExportJob[] = [
    {
      id: '1',
      type: 'people',
      format: 'csv',
      status: 'completed',
      createdAt: '2024-10-27T10:30:00Z',
      completedAt: '2024-10-27T10:31:15Z',
      fileName: 'people_export_20241027.csv',
      fileSize: '2.4 MB',
      recordCount: 1250,
      downloadUrl: '/downloads/people_export_20241027.csv'
    },
    {
      id: '2',
      type: 'events',
      format: 'excel',
      status: 'processing',
      createdAt: '2024-10-27T10:25:00Z',
      recordCount: 156
    },
    {
      id: '3',
      type: 'committees',
      format: 'pdf',
      status: 'failed',
      createdAt: '2024-10-27T09:45:00Z',
      recordCount: 8
    }
  ]

  const recentImports: ImportJob[] = [
    {
      id: '1',
      type: 'people',
      status: 'completed',
      createdAt: '2024-10-26T14:30:00Z',
      completedAt: '2024-10-26T14:35:20Z',
      fileName: 'new_members.csv',
      fileSize: '1.2 MB',
      totalRecords: 85,
      processedRecords: 85,
      validRecords: 82,
      invalidRecords: 3,
      errors: ['Row 15: Invalid email format', 'Row 32: Missing required field: phone', 'Row 67: Duplicate record']
    },
    {
      id: '2',
      type: 'events',
      status: 'reviewing',
      createdAt: '2024-10-26T11:15:00Z',
      fileName: 'quarterly_events.xlsx',
      fileSize: '456 KB',
      totalRecords: 24,
      validRecords: 24,
      invalidRecords: 0
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />
      case 'processing': return <RefreshCw size={16} className="text-blue-600 animate-spin" />
      case 'pending': return <Clock size={16} className="text-yellow-600" />
      case 'failed': return <AlertCircle size={16} className="text-red-600" />
      case 'reviewing': return <Eye size={16} className="text-purple-600" />
      default: return <Clock size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981'
      case 'processing': return '#3B82F6'
      case 'pending': return '#F59E0B'
      case 'failed': return '#EF4444'
      case 'reviewing': return '#8B5CF6'
      default: return '#6B7280'
    }
  }

  const handleExport = () => {
    setShowExportModal(true)
  }

  const handleImport = (files: FileList | null) => {
    if (files && files.length > 0) {
      setShowImportModal(true)
    }
  }

  const handleTemplateDownload = (entityType: string, format: 'csv' | 'excel') => {
    try {
      exportImportService.downloadTemplate(entityType, format)
    } catch (error) {
      console.error('Error downloading template:', error)
      // In a real app, you'd show a toast notification here
    }
  }

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* Entity Type Selection */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Select Data to Export
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entityTypes.map(entity => {
            const IconComponent = entity.icon
            return (
              <div
                key={entity.value}
                onClick={() => setSelectedEntityType(entity.value)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedEntityType === entity.value ? 'ring-2' : 'hover:shadow-md'
                }`}
                style={{ 
                  backgroundColor: selectedEntityType === entity.value 
                    ? themeConfig.colors.primary + '10' 
                    : themeConfig.colors.background,
                  borderColor: selectedEntityType === entity.value 
                    ? themeConfig.colors.primary 
                    : themeConfig.colors.divider
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent 
                    size={24} 
                    style={{ 
                      color: selectedEntityType === entity.value 
                        ? themeConfig.colors.primary 
                        : themeConfig.colors.text 
                    }} 
                  />
                  <span 
                    className="text-2xl font-bold"
                    style={{ 
                      color: selectedEntityType === entity.value 
                        ? themeConfig.colors.primary 
                        : themeConfig.colors.text 
                    }}
                  >
                    {entity.count}
                  </span>
                </div>
                <h4 
                  className="font-medium"
                  style={{ 
                    color: selectedEntityType === entity.value 
                      ? themeConfig.colors.primary 
                      : themeConfig.colors.text 
                  }}
                >
                  {entity.label}
                </h4>
              </div>
            )
          })}
        </div>
      </div>

      {/* Export Format Selection */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Choose Export Format
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map(format => (
            <div
              key={format.value}
              onClick={() => setSelectedFormat(format.value)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedFormat === format.value ? 'ring-2' : 'hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: selectedFormat === format.value 
                  ? themeConfig.colors.accent + '10' 
                  : themeConfig.colors.background,
                borderColor: selectedFormat === format.value 
                  ? themeConfig.colors.accent 
                  : themeConfig.colors.divider
              }}
            >
              <div className="flex items-center mb-2">
                <FileText 
                  size={20} 
                  className="mr-2"
                  style={{ 
                    color: selectedFormat === format.value 
                      ? themeConfig.colors.accent 
                      : themeConfig.colors.text 
                  }} 
                />
                <h4 
                  className="font-medium"
                  style={{ 
                    color: selectedFormat === format.value 
                      ? themeConfig.colors.accent 
                      : themeConfig.colors.text 
                  }}
                >
                  {format.label}
                </h4>
              </div>
              <p 
                className="text-sm"
                style={{ 
                  color: themeConfig.colors.text, 
                  opacity: 0.7 
                }}
              >
                {format.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Filters */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="flex items-center mb-4">
          <Filter size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
          <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
            Export Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={exportFilters.dateRange.start}
                onChange={(e) => setExportFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
              <input
                type="date"
                value={exportFilters.dateRange.end}
                onChange={(e) => setExportFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Status Filter
            </label>
            <select
              value={exportFilters.status}
              onChange={(e) => setExportFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
              Church Filter
            </label>
            <select
              value={exportFilters.church}
              onChange={(e) => setExportFilters(prev => ({ ...prev, church: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            >
              <option value="all">All Churches</option>
              <option value="main">Main Church</option>
              <option value="branch-east">Branch Church East</option>
              <option value="community">Community Chapel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Download size={20} className="mr-2" />
          Export {entityTypes.find(e => e.value === selectedEntityType)?.label}
        </button>
      </div>
    </div>
  )

  const renderImportTab = () => (
    <div className="space-y-6">
      {/* Import Instructions */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Import Data
        </h3>
        
        <div className="mb-4">
          <p className="text-sm mb-2" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
            Upload a file to import data into the system. Supported formats: CSV, Excel (.xlsx)
          </p>
          <ul className="text-sm list-disc list-inside space-y-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            <li>Maximum file size: 10MB</li>
            <li>Files will be validated before import</li>
            <li>You can preview and review data before final import</li>
            <li>Download templates for proper formatting</li>
          </ul>
        </div>

        {/* File Upload */}
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center"
          style={{ borderColor: themeConfig.colors.divider }}
        >
          <Upload 
            size={48} 
            className="mx-auto mb-4" 
            style={{ color: themeConfig.colors.text, opacity: 0.5 }} 
          />
          <p className="text-lg font-medium mb-2" style={{ color: themeConfig.colors.text }}>
            Drop your file here or click to browse
          </p>
          <p className="text-sm mb-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Supported formats: CSV, Excel (.xlsx)
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => handleImport(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            <Upload size={16} className="mr-2" />
            Choose File
          </label>
          <div className="mt-4">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg border font-medium hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.primary,
                color: themeConfig.colors.primary 
              }}
            >
              <Upload size={16} className="mr-2" />
              Advanced Import
            </button>
          </div>
        </div>
      </div>

      {/* Template Downloads */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Download Templates
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entityTypes.map(entity => {
            const IconComponent = entity.icon
            return (
              <div
                key={entity.value}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider
                }}
              >
                <div className="flex items-center mb-3">
                  <IconComponent size={20} className="mr-2" style={{ color: themeConfig.colors.primary }} />
                  <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                    {entity.label} Template
                  </h4>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleTemplateDownload(entity.value, 'csv')}
                    className="w-full text-left text-sm hover:opacity-80 transition-opacity"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    <FileSpreadsheet size={14} className="inline mr-1" />
                    Download CSV Template
                  </button>
                  <button 
                    onClick={() => handleTemplateDownload(entity.value, 'excel')}
                    className="w-full text-left text-sm hover:opacity-80 transition-opacity"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    <FileText size={14} className="inline mr-1" />
                    Download Excel Template
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {/* Recent Exports */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Exports
        </h3>
        
        <div className="space-y-3">
          {recentExports.map(job => (
            <div 
              key={job.id}
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                      {entityTypes.find(e => e.value === job.type)?.label} Export
                    </h4>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {job.format.toUpperCase()} • {job.recordCount} records
                      {job.fileSize && ` • ${job.fileSize}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: getStatusColor(job.status) }}
                  >
                    {job.status}
                  </span>
                  {job.downloadUrl && (
                    <button
                      className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ color: themeConfig.colors.primary }}
                    >
                      <Download size={16} />
                    </button>
                  )}
                  <button
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Imports */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
          Recent Imports
        </h3>
        
        <div className="space-y-3">
          {recentImports.map(job => (
            <div 
              key={job.id}
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: themeConfig.colors.text }}>
                      {job.fileName}
                    </h4>
                    <p className="text-sm mb-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                      {entityTypes.find(e => e.value === job.type)?.label} • {job.fileSize}
                    </p>
                    
                    {job.status === 'completed' && (
                      <div className="text-sm space-y-1">
                        <div style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                          ✅ {job.validRecords} valid records imported
                        </div>
                        {job.invalidRecords && job.invalidRecords > 0 && (
                          <div style={{ color: '#EF4444' }}>
                            ❌ {job.invalidRecords} records failed
                          </div>
                        )}
                      </div>
                    )}
                    
                    {job.errors && job.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer" style={{ color: '#EF4444' }}>
                          View errors ({job.errors.length})
                        </summary>
                        <ul className="mt-1 text-xs space-y-1 ml-4">
                          {job.errors.map((error, index) => (
                            <li key={index} style={{ color: '#EF4444' }}>• {error}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: getStatusColor(job.status) }}
                  >
                    {job.status}
                  </span>
                  {job.status === 'reviewing' && (
                    <button
                      className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ color: themeConfig.colors.primary }}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'import', label: 'Import Data', icon: Upload },
    { id: 'history', label: 'History', icon: Settings }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>
          Export/Import System
        </h1>
        <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Export data for backup and reporting, or import data from external sources
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: activeTab === tab.id 
                  ? themeConfig.colors.primary 
                  : themeConfig.colors.secondary,
                color: activeTab === tab.id 
                  ? '#FFFFFF' 
                  : themeConfig.colors.text
              }}
            >
              <IconComponent size={16} className="mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'export' && renderExportTab()}
        {activeTab === 'import' && renderImportTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entityType={selectedEntityType}
        entityCount={entityTypes.find(e => e.value === selectedEntityType)?.count || 0}
      />
      
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        entityType={selectedEntityType}
      />
    </div>
  )
}

export default ExportImport