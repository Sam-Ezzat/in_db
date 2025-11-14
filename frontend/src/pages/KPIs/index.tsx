import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Search, Filter, Edit2, Trash2, BarChart3 } from 'lucide-react'
import { kpiService, KPI, KPIStatistics } from '../../services/kpiService'
import { useAccessControl } from '../../contexts/AccessControlContext'

export default function KPIs() {
  const { can } = useAccessControl()
  const [kpis, setKPIs] = useState<KPI[]>([])
  const [statistics, setStatistics] = useState<KPIStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const loadKPIs = async () => {
    try {
      setLoading(true)
      const [kpisData, statsData] = await Promise.all([
        kpiService.getKPIs({ search: searchTerm, category: categoryFilter || undefined }),
        kpiService.getStatistics()
      ])
      setKPIs(kpisData)
      setStatistics(statsData)
    } catch (error) {
      console.error('Failed to load KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKPIs()
  }, [searchTerm, categoryFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this KPI? All associated evaluations will also be deleted.')) {
      return
    }

    try {
      await kpiService.deleteKPI(id)
      loadKPIs()
    } catch (error) {
      console.error('Failed to delete KPI:', error)
      alert('Failed to delete KPI')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
  }

  const categories = statistics?.kpisByCategory.map(c => c.category) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KPI Management</h1>
            <p className="text-sm text-gray-500">Define and manage performance indicators</p>
          </div>
        </div>

        {can('kpis', 'create') && (
          <Link
            to="/kpis/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New KPI
          </Link>
        )}
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total KPIs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalKPIs}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalEvaluations}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.averageScore}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recent (30 days)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.recentEvaluations}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {(searchTerm || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* KPI List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading KPIs...</div>
        ) : kpis.length === 0 ? (
          <div className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No KPIs Found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first KPI</p>
            {can('kpis', 'create') && (
              <Link
                to="/kpis/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First KPI
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        to={`/kpis/${kpi.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {kpi.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        Code: {kpi.code}
                      </div>
                      {kpi.description && (
                        <div className="text-sm text-gray-400 mt-1">{kpi.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {kpi.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {kpi.targetValue !== undefined ? kpi.targetValue : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {kpi.unit || '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/kpis/${kpi.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View
                    </Link>
                    {can('kpis', 'update') && (
                      <Link
                        to={`/kpis/${kpi.id}/edit`}
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Link>
                    )}
                    {can('kpis', 'delete') && (
                      <button
                        onClick={() => handleDelete(kpi.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
