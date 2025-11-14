import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, BarChart3, Calendar, TrendingUp } from 'lucide-react'
import { kpiService, Evaluation } from '../../services/kpiService'
import { useAccessControl } from '../../contexts/AccessControlContext'

export default function EvaluationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { can } = useAccessControl()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadEvaluation()
    }
  }, [id])

  const loadEvaluation = async () => {
    try {
      setLoading(true)
      const data = await kpiService.getEvaluationById(id!)
      setEvaluation(data)
    } catch (error) {
      console.error('Failed to load evaluation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this evaluation?')) {
      return
    }

    try {
      await kpiService.deleteEvaluation(id!)
      navigate('/kpi-evaluations')
    } catch (error) {
      console.error('Failed to delete evaluation:', error)
      alert('Failed to delete evaluation')
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
    if (!target) return 'text-gray-900'
    const percentage = (score / target) * 100
    if (percentage >= 100) return 'text-green-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAchievementPercentage = (score: number, target?: number) => {
    if (!target) return null
    return Math.round((score / target) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluation not found</h3>
        <Link to="/kpi-evaluations" className="text-green-600 hover:text-green-900">
          Back to Evaluations
        </Link>
      </div>
    )
  }

  const achievementPct = getAchievementPercentage(evaluation.score, evaluation.targetValue)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/kpi-evaluations"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluation Details</h1>
              <p className="text-sm text-gray-500">{evaluation.kpi?.name || 'Unknown KPI'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {can('evaluations', 'update') && (
            <Link
              to={`/kpi-evaluations/${evaluation.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </Link>
          )}
          {can('evaluations', 'delete') && (
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
          {/* Score Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-gray-500">Score</div>
              <div className={`text-6xl font-bold mb-2 ${getAchievementColor(evaluation.score, evaluation.targetValue)}`}>
                {evaluation.score}
                {evaluation.kpi?.unit && <span className="text-3xl text-gray-500 ml-2">{evaluation.kpi.unit}</span>}
              </div>
              {evaluation.targetValue && (
                <div className="text-gray-600">
                  Target: {evaluation.targetValue} {evaluation.kpi?.unit}
                  {achievementPct !== null && (
                    <span className={`ml-2 font-bold ${getAchievementColor(evaluation.score, evaluation.targetValue)}`}>
                      ({achievementPct}%)
                    </span>
                  )}
                </div>
              )}
            </div>

            {achievementPct !== null && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      achievementPct >= 100 ? 'bg-green-600' :
                      achievementPct >= 80 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(achievementPct, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* KPI Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <Link
                  to={`/kpis/${evaluation.kpi?.id}`}
                  className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                >
                  {evaluation.kpi?.name || 'Unknown'}
                </Link>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Code</h3>
                <p className="text-gray-900 font-mono">{evaluation.kpi?.code || '-'}</p>
              </div>

              {evaluation.kpi?.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{evaluation.kpi.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {evaluation.kpi?.category || 'Uncategorized'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Unit</h3>
                  <p className="text-gray-900">{evaluation.kpi?.unit || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Entity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Entity</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="text-lg font-medium text-gray-900">{evaluation.targetName || 'Unknown'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTargetTypeBadgeColor(evaluation.targetType)}`}>
                  {evaluation.targetType}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">ID</h3>
                <p className="text-sm text-gray-600 font-mono">{evaluation.targetId}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {evaluation.notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{evaluation.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Period */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Evaluation Period
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Start Date</div>
                <div className="text-sm text-gray-900">
                  {new Date(evaluation.periodStart).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">End Date</div>
                <div className="text-sm text-gray-900">
                  {new Date(evaluation.periodEnd).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="text-sm text-gray-900">
                  {Math.ceil((new Date(evaluation.periodEnd).getTime() - new Date(evaluation.periodStart).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          {(evaluation.actualValue !== undefined || evaluation.targetValue !== undefined) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Values
              </h3>
              
              <div className="space-y-3">
                {evaluation.actualValue !== undefined && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Actual Value</div>
                    <div className="text-lg font-bold text-gray-900">
                      {evaluation.actualValue}
                      {evaluation.kpi?.unit && <span className="text-sm text-gray-500 ml-1">{evaluation.kpi.unit}</span>}
                    </div>
                  </div>
                )}

                {evaluation.targetValue !== undefined && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Target Value</div>
                    <div className="text-lg font-bold text-gray-900">
                      {evaluation.targetValue}
                      {evaluation.kpi?.unit && <span className="text-sm text-gray-500 ml-1">{evaluation.kpi.unit}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-900">
                  {new Date(evaluation.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {new Date(evaluation.updatedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Evaluation ID</div>
                <div className="text-xs text-gray-600 font-mono">{evaluation.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
