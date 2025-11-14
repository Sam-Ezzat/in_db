import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BarChart3, Search, Filter, Edit2, Trash2, Calendar } from 'lucide-react'
import { kpiService, Evaluation, KPI } from '../../services/kpiService'
import { useAccessControl } from '../../contexts/AccessControlContext'

export default function KPIEvaluations() {
  const { can } = useAccessControl()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [kpis, setKPIs] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [kpiFilter, setKPIFilter] = useState('')
  const [targetTypeFilter, setTargetTypeFilter] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const [evaluationsData, kpisData] = await Promise.all([
        kpiService.getEvaluations({
          kpiId: kpiFilter || undefined,
          targetType: targetTypeFilter as any || undefined,
          search: searchTerm || undefined
        }),
        kpiService.getKPIs()
      ])
      setEvaluations(evaluationsData)
      setKPIs(kpisData)
    } catch (error) {
      console.error('Failed to load evaluations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [searchTerm, kpiFilter, targetTypeFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this evaluation?')) {
      return
    }

    try {
      await kpiService.deleteEvaluation(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete evaluation:', error)
      alert('Failed to delete evaluation')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setKPIFilter('')
    setTargetTypeFilter('')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KPI Evaluations</h1>
            <p className="text-sm text-gray-500">Track and measure performance over time</p>
          </div>
        </div>

        {can('evaluations', 'create') && (
          <Link
            to="/kpi-evaluations/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Evaluation
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search evaluations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={kpiFilter}
              onChange={(e) => setKPIFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All KPIs</option>
              {kpis.map(kpi => (
                <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Target Types</option>
              <option value="church">Church</option>
              <option value="committee">Committee</option>
              <option value="team">Team</option>
              <option value="group">Group</option>
              <option value="person">Person</option>
            </select>
          </div>
        </div>

        {(searchTerm || kpiFilter || targetTypeFilter) && (
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Evaluations List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading evaluations...</div>
        ) : evaluations.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluations Found</h3>
            <p className="text-gray-500 mb-4">Start tracking KPIs by creating your first evaluation</p>
            {can('evaluations', 'create') && (
              <Link
                to="/kpi-evaluations/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                  KPI
                </th>
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
              {evaluations.map((evaluation) => {
                const achievementPct = getAchievementPercentage(evaluation.score, evaluation.targetValue)
                return (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/kpis/${evaluation.kpiId}`}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {evaluation.kpi?.name || 'Unknown KPI'}
                        </Link>
                        {evaluation.kpi?.category && (
                          <div className="text-xs text-gray-500 mt-1">
                            {evaluation.kpi.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{evaluation.targetName || 'Unknown'}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTargetTypeBadgeColor(evaluation.targetType)}`}>
                          {evaluation.targetType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(evaluation.periodStart).toLocaleDateString()} - {new Date(evaluation.periodEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={`text-2xl font-bold ${getAchievementColor(evaluation.score, evaluation.targetValue)}`}>
                            {evaluation.score}
                            {evaluation.kpi?.unit && <span className="text-sm text-gray-500 ml-1">{evaluation.kpi.unit}</span>}
                          </div>
                          {evaluation.targetValue && (
                            <div className="text-xs text-gray-500">
                              Target: {evaluation.targetValue} {evaluation.kpi?.unit}
                            </div>
                          )}
                        </div>
                        {achievementPct !== null && (
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getAchievementColor(evaluation.score, evaluation.targetValue)}`}>
                              {achievementPct}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/kpi-evaluations/${evaluation.id}`}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-900"
                      >
                        <BarChart3 className="w-4 h-4" />
                        View
                      </Link>
                      {can('evaluations', 'update') && (
                        <Link
                          to={`/kpi-evaluations/${evaluation.id}/edit`}
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                      )}
                      {can('evaluations', 'delete') && (
                        <button
                          onClick={() => handleDelete(evaluation.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
