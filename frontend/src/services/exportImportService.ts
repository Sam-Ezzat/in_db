import * as XLSX from 'xlsx'

// Export/Import service for handling data operations
export interface ExportOptions {
  entityType: string
  format: 'csv' | 'excel' | 'json' | 'pdf'
  fields: string[]
  filters: Record<string, any>
  settings: {
    includeHeaders: boolean
    includeInactive: boolean
    dateFormat: 'ISO' | 'US' | 'EU'
    encoding: string
  }
}

export interface ImportResult {
  success: boolean
  totalRecords: number
  validRecords: number
  invalidRecords: number
  errors: Array<{
    row: number
    field: string
    message: string
    value: string
  }>
}

class ExportImportService {
  // Generate CSV template for entity type
  generateTemplate(entityType: string, format: 'csv' | 'excel' = 'csv'): string | ArrayBuffer {
    const templates = {
      people: {
        headers: ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip_code', 'date_of_birth', 'church_id', 'status'],
        sample: ['John', 'Doe', 'john.doe@email.com', '555-0123', '123 Main St', 'Springfield', 'IL', '62701', '1985-01-15', 'main-church', 'Active']
      },
      churches: {
        headers: ['name', 'description', 'address', 'city', 'state', 'zip_code', 'phone', 'email', 'website', 'pastor_name', 'denomination', 'capacity', 'founded_date', 'status'],
        sample: ['Grace Community Church', 'A welcoming church for all', '456 Church Ave', 'Springfield', 'IL', '62702', '555-0456', 'info@grace.org', 'https://grace.org', 'Pastor Smith', 'Baptist', '300', '1985-03-15', 'Active']
      },
      events: {
        headers: ['title', 'description', 'start_date', 'end_date', 'location', 'church_id', 'category', 'max_attendees', 'registration_required', 'cost', 'organizer', 'status'],
        sample: ['Sunday Service', 'Weekly worship service', '2024-11-03 10:00:00', '2024-11-03 11:30:00', 'Main Sanctuary', 'main-church', 'Worship', '300', 'false', '0', 'Pastor Smith', 'Active']
      },
      teams: {
        headers: ['name', 'description', 'church_id', 'leader_id', 'category', 'meeting_schedule', 'status'],
        sample: ['Worship Team', 'Music ministry team', 'main-church', 'john-doe', 'Ministry', 'Sundays 9:00 AM', 'Active']
      },
      committees: {
        headers: ['name', 'description', 'church_id', 'chair_id', 'purpose', 'meeting_frequency', 'status'],
        sample: ['Finance Committee', 'Oversees church finances', 'main-church', 'jane-smith', 'Financial oversight', 'Monthly', 'Active']
      },
      groups: {
        headers: ['name', 'description', 'church_id', 'leader_id', 'category', 'meeting_day', 'meeting_time', 'status'],
        sample: ['Young Adults', 'Bible study for young adults', 'main-church', 'mike-johnson', 'Bible Study', 'Wednesday', '7:00 PM', 'Active']
      }
    }

    const template = templates[entityType as keyof typeof templates]
    if (!template) {
      throw new Error(`Template not found for entity type: ${entityType}`)
    }

    if (format === 'csv') {
      const csvContent = [
        template.headers.join(','),
        template.sample.join(',')
      ].join('\n')
      
      return csvContent
    }

    // For Excel format, create proper Excel file
    if (format === 'excel') {
      const worksheet = XLSX.utils.aoa_to_sheet([
        template.headers,
        template.sample
      ])
      
      // Set column widths for better readability
      const colWidths = template.headers.map(() => ({ wch: 20 }))
      worksheet['!cols'] = colWidths
      
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, entityType.charAt(0).toUpperCase() + entityType.slice(1))
      
      // Generate Excel file as ArrayBuffer
      return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
    }

    return template.headers.join(',') + '\n' + template.sample.join(',')
  }

  // Download template file
  downloadTemplate(entityType: string, format: 'csv' | 'excel' = 'csv'): void {
    try {
      const content = this.generateTemplate(entityType, format)
      
      // Handle different content types
      let blob: Blob
      if (format === 'excel') {
        // Content is ArrayBuffer for Excel
        blob = new Blob([content as ArrayBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      } else {
        // Content is string for CSV
        blob = new Blob([content as string], { 
          type: 'text/csv'
        })
      }
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // Fix the file extension for Excel files
      const fileExtension = format === 'excel' ? 'xlsx' : format
      link.download = `${entityType}_template.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading template:', error)
      throw error
    }
  }

  // Simulate export process
  async exportData(options: ExportOptions): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock data based on options
      const mockData = this.generateMockExportData(options)
      
      // Create downloadable file
      const blob = new Blob([mockData], { 
        type: this.getContentType(options.format)
      })
      
      const url = URL.createObjectURL(blob)
      
      return {
        success: true,
        downloadUrl: url
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      }
    }
  }

  // Simulate import validation
  async validateImport(file: File, _entityType: string): Promise<ImportResult> {
    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation results
      const totalRecords = Math.floor(Math.random() * 200) + 50
      const invalidRecords = Math.floor(Math.random() * 10)
      const validRecords = totalRecords - invalidRecords
      
      const errors = Array.from({ length: invalidRecords }, (_, _i) => ({
        row: Math.floor(Math.random() * totalRecords) + 1,
        field: ['email', 'phone', 'name', 'status'][Math.floor(Math.random() * 4)],
        message: [
          'Invalid email format',
          'Missing required field',
          'Duplicate record found',
          'Invalid phone number format',
          'Invalid status value'
        ][Math.floor(Math.random() * 5)],
        value: 'invalid-value'
      }))

      return {
        success: true,
        totalRecords,
        validRecords,
        invalidRecords,
        errors
      }
    } catch (error) {
      return {
        success: false,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        errors: [{
          row: 0,
          field: 'file',
          message: error instanceof Error ? error.message : 'File processing failed',
          value: file.name
        }]
      }
    }
  }

  // Simulate import process
  async processImport(file: File, _entityType: string, validationResult: ImportResult): Promise<ImportResult> {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      return {
        ...validationResult,
        success: true
      }
    } catch (error) {
      return {
        success: false,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        errors: [{
          row: 0,
          field: 'process',
          message: error instanceof Error ? error.message : 'Import processing failed',
          value: file.name
        }]
      }
    }
  }

  private generateMockExportData(options: ExportOptions): string {
    const { format, fields, settings } = options
    
    // Generate mock records
    const records = Array.from({ length: 50 }, (_, i) => {
      const record: Record<string, any> = {}
      fields.forEach(field => {
        record[field] = this.generateMockFieldValue(field, i)
      })
      return record
    })

    if (format === 'csv') {
      let csv = ''
      if (settings.includeHeaders) {
        csv += fields.join(',') + '\n'
      }
      
      records.forEach(record => {
        const values = fields.map(field => {
          const value = record[field]
          // Escape CSV values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        csv += values.join(',') + '\n'
      })
      
      return csv
    }

    if (format === 'json') {
      return JSON.stringify(records, null, 2)
    }

    // For other formats, return CSV for now
    return this.generateMockExportData({ ...options, format: 'csv' })
  }

  private generateMockFieldValue(field: string, index: number): any {
    const mockData: Record<string, any> = {
      id: `record_${index + 1}`,
      first_name: ['John', 'Jane', 'Mike', 'Sarah', 'David'][index % 5],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][index % 5],
      email: `user${index + 1}@example.com`,
      phone: `555-${String(index + 1).padStart(4, '0')}`,
      name: `Entity ${index + 1}`,
      description: `Description for entity ${index + 1}`,
      status: ['Active', 'Inactive'][index % 2],
      created_at: new Date(2024, 0, index + 1).toISOString(),
      updated_at: new Date().toISOString()
    }

    return mockData[field] || `Value ${index + 1}`
  }

  private getContentType(format: string): string {
    const contentTypes = {
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      json: 'application/json',
      pdf: 'application/pdf'
    }
    return contentTypes[format as keyof typeof contentTypes] || 'text/plain'
  }
}

export const exportImportService = new ExportImportService()
export default exportImportService