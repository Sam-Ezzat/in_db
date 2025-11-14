import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, Eye, Edit, Trash2, X, FileText, Filter } from 'lucide-react'
import { reportService, Report, ReportStatistics } from '../../services/reportService'
import { useTheme } from '../../contexts/ThemeContext'
import { useAccess } from '../../contexts/AccessControlContext'

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [statistics, setStatistics] = useState<ReportStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'church' | 'committee' | 'team' | 'group' | 'person'>('all')

  const { themeConfig } = useTheme()
  const { can } = useAccess()
  const navigate = useNavigate()

  useEffect(() => {
    loadReports()
    loadStatistics()
  }, [searchTerm, filterType])

  const loadReports = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      if (searchTerm) filters.search = searchTerm
      if (filterType !== 'all') filters.targetType = filterType

      const data = await reportService.getReports(filters)
      setReports(data)
      setError(null)
    } catch (err) {
      setError('Failed to load reports')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await reportService.getStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}"?`)) {
      return
    }

    try {
      await reportService.deleteReport(id)
      await loadReports()
      await loadStatistics()
    } catch (err) {
      setError('Failed to delete report')
      console.error(err)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterType('all')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'church': return { bg: '#3B82F620', text: '#3B82F6' }
      case 'committee': return { bg: '#8B5CF620', text: '#8B5CF6' }
      case 'team': return { bg: '#10B98120', text: '#10B981' }
      case 'group': return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'person': return { bg: '#EF444420', text: '#EF4444' }
      default: return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Report Management
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Create and manage reports from teams, committees, groups, and individuals
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/reports/dashboard')}
            className="flex items-center px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              color: themeConfig.colors.primary,
              border: `2px solid ${themeConfig.colors.primary}`
            }}
          >
            <FileText size={20} className="mr-2" />
            Dashboard
          </button>
          {can('reports', 'create') && (
            <button
              onClick={() => navigate('/reports/new')}
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Plus size={20} className="mr-2" />
              Create Report
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '14px' }}>
              Total Reports
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: themeConfig.colors.text }}>
              {statistics.totalReports}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '14px' }}>
              Recent Reports (30d)
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: '#10B981' }}>
              {statistics.recentReports}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '14px' }}>
              Report Types
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: themeConfig.colors.primary }}>
              {statistics.reportsByType.length}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <p style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '14px' }}>
              This Month
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: '#F59E0B' }}>
              {statistics.reportsByMonth[0]?.count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: themeConfig.colors.text, opacity: 0.5 }}
              />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option value="all">All Types</option>
            <option value="church">Church</option>
            <option value="committee">Committee</option>
            <option value="team">Team</option>
            <option value="group">Group</option>
            <option value="person">Person</option>
          </select>

          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                color: themeConfig.colors.text,
                border: `1px solid ${themeConfig.colors.divider}`
              }}
            >
              <X size={16} className="mr-2" />
              Clear
            </button>
          )}

          {can('reports', 'export') && (
            <button
              className="flex items-center px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                color: themeConfig.colors.primary,
                border: `1px solid ${themeConfig.colors.primary}`
              }}
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-12" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div 
          className="text-center py-12 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <FileText size={48} className="mx-auto mb-4" style={{ color: themeConfig.colors.text, opacity: 0.3 }} />
          <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            No reports found
          </p>
          {can('reports', 'create') && (
            <button
              onClick={() => navigate('/reports/new')}
              className="mt-4 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              Create First Report
            </button>
          )}
        </div>
      ) : (
        <div 
          className="rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: themeConfig.colors.divider }}>
              <thead style={{ backgroundColor: themeConfig.colors.background }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Type & Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Items
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {reports.map((report) => {
                  const typeColor = getTypeColor(report.targetType)
                  return (
                    <tr key={report.id} className="hover:opacity-90">
                      <td className="px-6 py-4">
                        <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                          {report.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium w-fit"
                            style={{
                              backgroundColor: typeColor.bg,
                              color: typeColor.text
                            }}
                          >
                            {report.targetType.charAt(0).toUpperCase() + report.targetType.slice(1)}
                          </span>
                          {report.targetName && (
                            <span style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '14px' }}>
                              {report.targetName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {report.reporterPerson && (
                          <div>
                            <p style={{ color: themeConfig.colors.text }}>
                              {report.reporterPerson.firstName} {report.reporterPerson.lastName}
                            </p>
                            {report.reporterPerson.email && (
                              <p style={{ color: themeConfig.colors.text, opacity: 0.7, fontSize: '12px' }}>
                                {report.reporterPerson.email}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ color: themeConfig.colors.text, fontSize: '14px' }}>
                          <p>{new Date(report.periodStart).toLocaleDateString()}</p>
                          <p style={{ opacity: 0.7 }}>to</p>
                          <p>{new Date(report.periodEnd).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p style={{ color: themeConfig.colors.text, fontSize: '14px' }}>
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: themeConfig.colors.primary + '20',
                            color: themeConfig.colors.primary
                          }}
                        >
                          {report.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/reports/${report.id}`)}
                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: themeConfig.colors.background,
                              color: themeConfig.colors.primary
                            }}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          {can('reports', 'update') && (
                            <button
                              onClick={() => navigate(`/reports/${report.id}/edit`)}
                              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                              style={{ 
                                backgroundColor: themeConfig.colors.background,
                                color: themeConfig.colors.primary
                              }}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {can('reports', 'delete') && (
                            <button
                              onClick={() => handleDelete(report.id, report.title)}
                              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                              style={{ 
                                backgroundColor: '#FEE2E2',
                                color: '#EF4444'
                              }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
