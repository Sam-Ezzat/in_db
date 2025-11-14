import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, TrendingUp, BarChart3, Plus } from 'lucide-react'
import { kpiService, KPI, Evaluation } from '../../services/kpiService'
import { useAccessControl } from '../../contexts/AccessControlContext'

export default function KPIDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { can } = useAccessControl()
  const [kpi, setKPI] = useState<KPI | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [kpiData, evaluationsData] = await Promise.all([
        kpiService.getKPIById(id!),
        kpiService.getEvaluations({ kpiId: id })
      ])
      setKPI(kpiData)
      setEvaluations(evaluationsData)
    } catch (error) {
      console.error('Failed to load KPI:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this KPI? All associated evaluations will also be deleted.')) {
      return
    }

    try {
      await kpiService.deleteKPI(id!)
      navigate('/kpis')
    } catch (error) {
      console.error('Failed to delete KPI:', error)
      alert('Failed to delete KPI')
    }
  }

  const getTargetTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      church: 'bg-purple-100 text-purple-800',
      committee: 'bg-blue-100 text-blue-800',
      team: 'bg-green-100 text-green-800',
      group: 'bg-yellow-100 text-yellow-800',
      person: 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getAchievementColor = (score: number, target?: number) => {
    if (!target) return 'text-gray-600'
    const percentage = (score / target) * 100
    if (percentage >= 100) return 'text-green-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!kpi) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">KPI not found</h3>
        <Link to="/kpis" className="text-indigo-600 hover:text-indigo-900">
          Back to KPIs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/kpis"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{kpi.name}</h1>
              <p className="text-sm text-gray-500">Code: {kpi.code}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {can('evaluations', 'create') && (
            <Link
              to={`/evaluations/new?kpiId=${kpi.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Evaluation
            </Link>
          )}
          {can('kpis', 'update') && (
            <Link
              to={`/kpis/${kpi.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </Link>
          )}
          {can('kpis', 'delete') && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Details</h2>
            
            {kpi.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-900">{kpi.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {kpi.category || 'Uncategorized'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Unit</h3>
                <p className="text-gray-900">{kpi.unit || '-'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Target Value</h3>
                <p className="text-gray-900">
                  {kpi.targetValue !== undefined ? kpi.targetValue : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Evaluations */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Evaluations</h2>
                <span className="text-sm text-gray-500">{evaluations.length} total</span>
              </div>
            </div>

            {evaluations.length === 0 ? (
              <div className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluations Yet</h3>
                <p className="text-gray-500 mb-4">Start tracking this KPI by creating an evaluation</p>
                {can('evaluations', 'create') && (
                  <Link
                    to={`/evaluations/new?kpiId=${kpi.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Evaluation
                  </Link>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{evaluation.targetName || 'Unknown'}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTargetTypeBadgeColor(evaluation.targetType)}`}>
                            {evaluation.targetType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(evaluation.periodStart).toLocaleDateString()} - {new Date(evaluation.periodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getAchievementColor(evaluation.score, evaluation.targetValue)}`}>
                            {evaluation.score}
                          </span>
                          {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
                          {evaluation.targetValue && (
                            <span className="text-xs text-gray-400">/ {evaluation.targetValue}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/evaluations/${evaluation.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Total Evaluations</span>
                  <span className="text-lg font-bold text-gray-900">{evaluations.length}</span>
                </div>
              </div>

              {evaluations.length > 0 && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Average Score</span>
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round((evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length) * 100) / 100}
                        {kpi.unit && <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Highest Score</span>
                      <span className="text-lg font-bold text-green-600">
                        {Math.max(...evaluations.map(e => e.score))}
                        {kpi.unit && <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Lowest Score</span>
                      <span className="text-lg font-bold text-red-600">
                        {Math.min(...evaluations.map(e => e.score))}
                        {kpi.unit && <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-900">
                  {new Date(kpi.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {new Date(kpi.updatedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">KPI ID</div>
                <div className="text-xs text-gray-600 font-mono">{kpi.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
