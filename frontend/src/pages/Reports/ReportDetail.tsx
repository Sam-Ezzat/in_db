import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar, User, FileText } from 'lucide-react'
import { reportService, Report } from '../../services/reportService'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { can } = useAccess()

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadReport()
    }
  }, [id])

  const loadReport = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await reportService.getReportById(id)
      if (!data) {
        setError('Report not found')
        return
      }
      setReport(data)
    } catch (err) {
      console.error('Failed to load report:', err)
      setError('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !report) return

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the report "${report.title}"?`
    )
    if (!confirmDelete) return

    try {
      setLoading(true)
      await reportService.deleteReport(id)
      navigate('/reports')
    } catch (err) {
      console.error('Failed to delete report:', err)
      setError('Failed to delete report')
      setLoading(false)
    }
  }

  const getTargetTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'church': return { bg: '#3B82F620', text: '#3B82F6' }
      case 'committee': return { bg: '#8B5CF620', text: '#8B5CF6' }
      case 'team': return { bg: '#10B98120', text: '#10B981' }
      case 'group': return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'person': return { bg: '#EF444420', text: '#EF4444' }
      default: return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
        Loading report...
      </div>
    )
  }

  if (error || !report) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error || 'Report not found'}
        </div>
        <button
          onClick={() => navigate('/reports')}
          className="mt-4 flex items-center text-sm hover:opacity-80 transition-opacity"
          style={{ color: themeConfig.colors.primary }}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Reports
        </button>
      </div>
    )
  }

  const targetColor = getTargetTypeBadgeColor(report.targetType)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
            style={{ color: themeConfig.colors.primary }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Report Details
          </h1>
        </div>

        <div className="flex gap-2">
          {can('reports', 'update') && (
            <button
              onClick={() => navigate(`/reports/${id}/edit`)}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Edit size={20} className="mr-2" />
              Edit
            </button>
          )}
          {can('reports', 'delete') && (
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EF4444' }}
            >
              <Trash2 size={20} className="mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Target */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>
              {report.title}
            </h2>
            
            <div className="flex items-center gap-2 mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: targetColor.bg,
                  color: targetColor.text
                }}
              >
                {report.targetType.charAt(0).toUpperCase() + report.targetType.slice(1)}
              </span>
              {report.targetName && (
                <span style={{ color: '#6B7280', fontSize: '14px' }}>
                  {report.targetName}
                </span>
              )}
            </div>
          </div>

          {/* Report Items */}
          {report.items && report.items.length > 0 && (
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <FileText size={20} style={{ color: themeConfig.colors.primary }} />
                <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Report Items
                </h2>
              </div>

              <div className="space-y-4">
                {report.items.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: themeConfig.colors.background }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                        {item.itemKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: themeConfig.colors.primary + '20',
                          color: themeConfig.colors.primary
                        }}
                      >
                        {item.itemType}
                      </span>
                    </div>

                    <div style={{ color: themeConfig.colors.text }}>
                      {item.itemType === 'number' && (
                        <p className="text-2xl font-bold">{item.valueNumber}</p>
                      )}
                      {item.itemType === 'text' && (
                        <p className="whitespace-pre-wrap">{item.valueText}</p>
                      )}
                      {item.itemType === 'json' && (
                        <pre 
                          className="p-3 rounded text-sm overflow-x-auto"
                          style={{ 
                            backgroundColor: themeConfig.colors.secondary,
                            color: themeConfig.colors.text
                          }}
                        >
                          {JSON.stringify(item.valueJson, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!report.items || report.items.length === 0) && (
            <div 
              className="p-6 rounded-lg border text-center"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <p style={{ color: '#6B7280' }}>No report items available</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Period Information */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="flex items-center mb-4">
              <Calendar size={20} style={{ color: themeConfig.colors.primary }} />
              <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                Reporting Period
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Start Date
                </p>
                <p style={{ color: themeConfig.colors.text }}>
                  {new Date(report.periodStart).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  End Date
                </p>
                <p style={{ color: themeConfig.colors.text }}>
                  {new Date(report.periodEnd).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Reporter Information */}
          {report.reporterPerson && (
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center mb-4">
                <User size={20} style={{ color: themeConfig.colors.primary }} />
                <h2 className="ml-2 text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Submitted By
                </h2>
              </div>

              <div>
                <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                  {report.reporterPerson.firstName} {report.reporterPerson.lastName}
                </p>
                {report.reporterPerson.email && (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>
                    {report.reporterPerson.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Report Information
            </h2>

            <div className="space-y-3">
              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Submitted At
                </p>
                <p style={{ color: themeConfig.colors.text }}>
                  {new Date(report.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Report ID
                </p>
                <p style={{ 
                  color: themeConfig.colors.text,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all'
                }}>
                  {report.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
