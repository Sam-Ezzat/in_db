import { useState, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  X, Upload, CheckCircle, AlertCircle, 
  FileText, Eye,
  RefreshCw, Check, AlertTriangle
} from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  entityType: string
}

interface ImportError {
  row: number
  field: string
  message: string
  value: string
}

interface ImportPreview {
  fileName: string
  fileSize: string
  totalRows: number
  validRows: number
  invalidRows: number
  columns: string[]
  sampleData: Record<string, any>[]
  errors: ImportError[]
  mapping: Record<string, string>
}

const ImportModal = ({ isOpen, onClose, entityType }: ImportModalProps) => {
  const { themeConfig } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'processing' | 'complete'>('upload')
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Mock field mappings for different entity types
  const getExpectedFields = (type: string): string[] => {
    switch (type) {
      case 'people':
        return ['first_name', 'last_name', 'email', 'phone', 'church_id', 'status']
      case 'churches':
        return ['name', 'address', 'city', 'state', 'zip_code', 'phone', 'email']
      case 'events':
        return ['title', 'description', 'start_date', 'end_date', 'location', 'church_id']
      default:
        return ['name', 'description', 'status']
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0]
      
      // Simulate file processing
      setTimeout(() => {
        const mockPreview: ImportPreview = {
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          totalRows: 150,
          validRows: 145,
          invalidRows: 5,
          columns: ['First Name', 'Last Name', 'Email', 'Phone', 'Church', 'Status'],
          sampleData: [
            { 'First Name': 'John', 'Last Name': 'Doe', 'Email': 'john.doe@email.com', 'Phone': '555-0123', 'Church': 'Main Church', 'Status': 'Active' },
            { 'First Name': 'Jane', 'Last Name': 'Smith', 'Email': 'jane.smith@email.com', 'Phone': '555-0124', 'Church': 'Branch East', 'Status': 'Active' },
            { 'First Name': 'Mike', 'Last Name': 'Johnson', 'Email': 'invalid-email', 'Phone': '555-0125', 'Church': '', 'Status': 'Active' }
          ],
          errors: [
            { row: 3, field: 'Email', message: 'Invalid email format', value: 'invalid-email' },
            { row: 3, field: 'Church', message: 'Required field is empty', value: '' },
            { row: 15, field: 'Phone', message: 'Invalid phone format', value: '123' },
            { row: 32, field: 'Email', message: 'Duplicate email address', value: 'duplicate@email.com' },
            { row: 67, field: 'Status', message: 'Invalid status value', value: 'Unknown' }
          ],
          mapping: {
            'First Name': 'first_name',
            'Last Name': 'last_name',
            'Email': 'email',
            'Phone': 'phone',
            'Church': 'church_id',
            'Status': 'status'
          }
        }
        
        setImportPreview(mockPreview)
        setStep('preview')
      }, 1000)
    }
  }

  const handleImport = () => {
    setStep('processing')
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep('complete')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const renderUploadStep = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
          Import {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
        </h2>
        <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Upload a CSV or Excel file to import data
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-12 text-center mb-6"
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
          Supported formats: CSV, Excel (.xlsx, .xls) • Max size: 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Upload size={16} className="mr-2" />
          Choose File
        </button>
      </div>

      <div 
        className="p-4 rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <h3 className="font-medium mb-2" style={{ color: themeConfig.colors.text }}>
          Expected Columns
        </h3>
        <div className="flex flex-wrap gap-2">
          {getExpectedFields(entityType).map(field => (
            <span
              key={field}
              className="px-2 py-1 text-xs rounded-full"
              style={{ 
                backgroundColor: themeConfig.colors.primary + '20',
                color: themeConfig.colors.primary 
              }}
            >
              {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPreviewStep = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
            Preview Import Data
          </h2>
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Review your data before importing
          </p>
        </div>
        <button
          onClick={() => setStep('upload')}
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: themeConfig.colors.primary }}
        >
          Choose Different File
        </button>
      </div>

      {importPreview && (
        <div className="space-y-6">
          {/* File Info */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <FileText size={16} className="mr-1" style={{ color: themeConfig.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    File
                  </span>
                </div>
                <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                  {importPreview.fileName}
                </p>
                <p className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                  {importPreview.fileSize}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <CheckCircle size={16} className="mr-1 text-green-600" />
                  <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Valid Records
                  </span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {importPreview.validRows}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <AlertCircle size={16} className="mr-1 text-red-600" />
                  <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Invalid Records
                  </span>
                </div>
                <p className="text-lg font-bold text-red-600">
                  {importPreview.invalidRows}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Eye size={16} className="mr-1" style={{ color: themeConfig.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Total Rows
                  </span>
                </div>
                <p className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
                  {importPreview.totalRows}
                </p>
              </div>
            </div>
          </div>

          {/* Sample Data */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
              Data Preview (First 3 rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: themeConfig.colors.divider }}>
                    {importPreview.columns.map(column => (
                      <th 
                        key={column}
                        className="text-left py-2 px-3 font-medium"
                        style={{ color: themeConfig.colors.text }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importPreview.sampleData.map((row, index) => (
                    <tr 
                      key={index}
                      className="border-b"
                      style={{ borderColor: themeConfig.colors.divider }}
                    >
                      {importPreview.columns.map(column => {
                        const hasError = importPreview.errors.some(
                          error => error.row === index + 1 && error.field === column
                        )
                        return (
                          <td 
                            key={column}
                            className={`py-2 px-3 ${hasError ? 'bg-red-50' : ''}`}
                            style={{ 
                              color: hasError ? '#EF4444' : themeConfig.colors.text,
                              backgroundColor: hasError ? '#FEF2F2' : 'transparent'
                            }}
                          >
                            {row[column] || '-'}
                            {hasError && (
                              <AlertTriangle size={12} className="inline ml-1 text-red-500" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Errors */}
          {importPreview.errors.length > 0 && (
            <div 
              className="p-4 rounded-lg border border-red-200"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <div className="flex items-center mb-3">
                <AlertCircle size={16} className="mr-2 text-red-600" />
                <h3 className="font-medium text-red-800">
                  Data Validation Errors ({importPreview.errors.length})
                </h3>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {importPreview.errors.map((error, index) => (
                  <div 
                    key={index}
                    className="text-sm p-2 rounded border"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      borderColor: '#FCA5A5'
                    }}
                  >
                    <span className="font-medium text-red-700">
                      Row {error.row}, {error.field}:
                    </span>
                    <span className="text-red-600 ml-1">
                      {error.message}
                    </span>
                    {error.value && (
                      <code className="ml-2 px-1 bg-red-100 text-red-800 text-xs rounded">
                        "{error.value}"
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {importPreview.invalidRows > 0 ? (
                <span className="text-amber-600">
                  ⚠️ {importPreview.invalidRows} rows have errors and will be skipped
                </span>
              ) : (
                <span className="text-green-600">
                  ✅ All rows are valid and ready to import
                </span>
              )}
            </div>
            <button
              onClick={handleImport}
              disabled={importPreview.validRows === 0}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Upload size={16} className="mr-2" />
              Import {importPreview.validRows} Records
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderProcessingStep = () => (
    <div className="p-6 text-center">
      <div className="mb-6">
        <RefreshCw 
          size={48} 
          className="mx-auto mb-4 animate-spin" 
          style={{ color: themeConfig.colors.primary }} 
        />
        <h2 className="text-xl font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
          Processing Import
        </h2>
        <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Please wait while we import your data...
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div 
          className="w-full bg-gray-200 rounded-full h-2 mb-4"
          style={{ backgroundColor: themeConfig.colors.divider }}
        >
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${processingProgress}%`,
              backgroundColor: themeConfig.colors.primary 
            }}
          />
        </div>
        <p className="text-sm" style={{ color: themeConfig.colors.text }}>
          {processingProgress}% complete
        </p>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="p-6 text-center">
      <div className="mb-6">
        <CheckCircle 
          size={48} 
          className="mx-auto mb-4 text-green-600" 
        />
        <h2 className="text-xl font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
          Import Complete!
        </h2>
        <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Your data has been successfully imported.
        </p>
      </div>

      <div 
        className="p-4 rounded-lg border max-w-md mx-auto mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: themeConfig.colors.text }}>Records processed:</span>
            <span className="font-medium" style={{ color: themeConfig.colors.text }}>
              {importPreview?.totalRows}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: themeConfig.colors.text }}>Successfully imported:</span>
            <span className="font-medium text-green-600">
              {importPreview?.validRows}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: themeConfig.colors.text }}>Skipped (errors):</span>
            <span className="font-medium text-red-600">
              {importPreview?.invalidRows}
            </span>
          </div>
        </div>
      </div>

      <div className="space-x-3">
        <button
          onClick={() => {
            setStep('upload')
            setImportPreview(null)
            setProcessingProgress(0)
          }}
          className="px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
          style={{ 
            borderColor: themeConfig.colors.divider,
            color: themeConfig.colors.text 
          }}
        >
          Import More Data
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          Close
        </button>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: themeConfig.colors.divider }}
        >
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {['upload', 'preview', 'processing', 'complete'].map((stepName, index) => {
                const isActive = step === stepName
                const isCompleted = ['upload', 'preview', 'processing', 'complete'].indexOf(step) > index
                
                return (
                  <div key={stepName} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isActive || isCompleted ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: isActive || isCompleted 
                          ? themeConfig.colors.primary 
                          : themeConfig.colors.divider,
                        color: isActive || isCompleted ? '#FFFFFF' : themeConfig.colors.text
                      }}
                    >
                      {isCompleted && stepName !== step ? (
                        <Check size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 3 && (
                      <div 
                        className="w-8 h-0.5 mx-1"
                        style={{ 
                          backgroundColor: isCompleted 
                            ? themeConfig.colors.primary 
                            : themeConfig.colors.divider 
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:opacity-70 transition-opacity"
            style={{ color: themeConfig.colors.text }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {step === 'upload' && renderUploadStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'processing' && renderProcessingStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>
      </div>
    </div>
  )
}

export default ImportModal