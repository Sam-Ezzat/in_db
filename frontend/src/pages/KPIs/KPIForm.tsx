import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, TrendingUp } from 'lucide-react'
import { kpiService, KPI } from '../../services/kpiService'

export default function KPIForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    targetValue: ''
  })

  useEffect(() => {
    if (isEditMode && id) {
      loadKPI()
    }
  }, [id])

  const loadKPI = async () => {
    try {
      setLoading(true)
      const kpi = await kpiService.getKPIById(id!)
      if (kpi) {
        setFormData({
          code: kpi.code,
          name: kpi.name,
          description: kpi.description || '',
          category: kpi.category || '',
          unit: kpi.unit || '',
          targetValue: kpi.targetValue !== undefined ? String(kpi.targetValue) : ''
        })
      }
    } catch (error) {
      console.error('Failed to load KPI:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.name) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      const submitData = {
        code: formData.code.toUpperCase().replace(/\s+/g, '_'),
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        unit: formData.unit || undefined,
        targetValue: formData.targetValue ? Number(formData.targetValue) : undefined
      }

      if (isEditMode) {
        await kpiService.updateKPI(id!, submitData)
      } else {
        await kpiService.createKPI(submitData)
      }

      navigate('/kpis')
    } catch (error) {
      console.error('Failed to save KPI:', error)
      alert('Failed to save KPI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit KPI' : 'New KPI'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode ? 'Update KPI definition' : 'Create a new performance indicator'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              required
              disabled={isEditMode}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., ATTENDANCE_RATE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              {isEditMode ? 'Code cannot be changed after creation' : 'Unique identifier (use UPPERCASE_WITH_UNDERSCORES)'}
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Attendance Rate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Attendance, Growth, Service"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <input
              type="text"
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., %, count, hours"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Target Value */}
          <div>
            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-2">
              Target Value
            </label>
            <input
              type="number"
              id="targetValue"
              step="0.01"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              placeholder="e.g., 80"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Default target value for this KPI
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this KPI measures and how it should be calculated..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/kpis"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : isEditMode ? 'Update KPI' : 'Create KPI'}
          </button>
        </div>
      </form>
    </div>
  )
}
