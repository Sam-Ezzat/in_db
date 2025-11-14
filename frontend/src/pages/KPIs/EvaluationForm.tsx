import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, BarChart3, Calendar } from 'lucide-react'
import { kpiService, KPI, Evaluation } from '../../services/kpiService'

export default function EvaluationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [kpis, setKPIs] = useState<KPI[]>([])
  const [formData, setFormData] = useState({
    kpiId: '',
    targetType: '' as '' | 'church' | 'committee' | 'team' | 'group' | 'person',
    targetId: '',
    targetName: '',
    periodStart: '',
    periodEnd: '',
    score: '',
    actualValue: '',
    targetValue: '',
    notes: ''
  })

  useEffect(() => {
    loadKPIs()
    if (isEditMode && id) {
      loadEvaluation()
    }
    
    // Pre-fill KPI from query params
    const params = new URLSearchParams(window.location.search)
    const kpiId = params.get('kpiId')
    if (kpiId) {
      setFormData(prev => ({ ...prev, kpiId }))
    }
  }, [id])

  const loadKPIs = async () => {
    try {
      const data = await kpiService.getKPIs()
      setKPIs(data)
    } catch (error) {
      console.error('Failed to load KPIs:', error)
    }
  }

  const loadEvaluation = async () => {
    try {
      setLoading(true)
      const evaluation = await kpiService.getEvaluationById(id!)
      if (evaluation) {
        setFormData({
          kpiId: evaluation.kpiId,
          targetType: evaluation.targetType,
          targetId: evaluation.targetId,
          targetName: evaluation.targetName || '',
          periodStart: new Date(evaluation.periodStart).toISOString().split('T')[0],
          periodEnd: new Date(evaluation.periodEnd).toISOString().split('T')[0],
          score: String(evaluation.score),
          actualValue: evaluation.actualValue !== undefined ? String(evaluation.actualValue) : '',
          targetValue: evaluation.targetValue !== undefined ? String(evaluation.targetValue) : '',
          notes: evaluation.notes || ''
        })
      }
    } catch (error) {
      console.error('Failed to load evaluation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.kpiId || !formData.targetType || !formData.targetId || !formData.periodStart || !formData.periodEnd || !formData.score) {
      alert('Please fill in all required fields')
      return
    }

    // Validate period
    if (new Date(formData.periodStart) > new Date(formData.periodEnd)) {
      alert('Period start date must be before period end date')
      return
    }

    // Validate score
    if (Number(formData.score) < 0) {
      alert('Score must be greater than or equal to 0')
      return
    }

    try {
      setLoading(true)

      const submitData: any = {
        kpiId: formData.kpiId,
        targetType: formData.targetType,
        targetId: formData.targetId,
        targetName: formData.targetName || undefined,
        periodStart: new Date(formData.periodStart),
        periodEnd: new Date(formData.periodEnd),
        score: Number(formData.score),
        actualValue: formData.actualValue ? Number(formData.actualValue) : undefined,
        targetValue: formData.targetValue ? Number(formData.targetValue) : undefined,
        notes: formData.notes || undefined
      }

      if (isEditMode) {
        await kpiService.updateEvaluation(id!, submitData)
      } else {
        await kpiService.createEvaluation(submitData)
      }

      navigate('/kpi-evaluations')
    } catch (error) {
      console.error('Failed to save evaluation:', error)
      alert('Failed to save evaluation')
    } finally {
      setLoading(false)
    }
  }

  const selectedKPI = kpis.find(k => k.id === formData.kpiId)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Evaluation' : 'New Evaluation'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode ? 'Update KPI evaluation data' : 'Record a new KPI measurement'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* KPI Selection */}
        <div>
          <label htmlFor="kpiId" className="block text-sm font-medium text-gray-700 mb-2">
            KPI <span className="text-red-500">*</span>
          </label>
          <select
            id="kpiId"
            required
            value={formData.kpiId}
            onChange={(e) => {
              const kpi = kpis.find(k => k.id === e.target.value)
              setFormData({
                ...formData,
                kpiId: e.target.value,
                targetValue: kpi?.targetValue ? String(kpi.targetValue) : formData.targetValue
              })
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select a KPI</option>
            {kpis.map(kpi => (
              <option key={kpi.id} value={kpi.id}>
                {kpi.name} ({kpi.code})
              </option>
            ))}
          </select>
          {selectedKPI?.description && (
            <p className="mt-2 text-sm text-gray-500">{selectedKPI.description}</p>
          )}
        </div>

        {/* Target Entity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="targetType" className="block text-sm font-medium text-gray-700 mb-2">
              Target Type <span className="text-red-500">*</span>
            </label>
            <select
              id="targetType"
              required
              value={formData.targetType}
              onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="church">Church</option>
              <option value="committee">Committee</option>
              <option value="team">Team</option>
              <option value="group">Group</option>
              <option value="person">Person</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetId" className="block text-sm font-medium text-gray-700 mb-2">
              Target ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="targetId"
              required
              value={formData.targetId}
              onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
              placeholder="e.g., team-1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="targetName" className="block text-sm font-medium text-gray-700 mb-2">
            Target Name
          </label>
          <input
            type="text"
            id="targetName"
            value={formData.targetName}
            onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
            placeholder="e.g., Worship Team"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="periodStart" className="block text-sm font-medium text-gray-700 mb-2">
              Period Start <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="periodStart"
                required
                value={formData.periodStart}
                onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="periodEnd" className="block text-sm font-medium text-gray-700 mb-2">
              Period End <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="periodEnd"
                required
                value={formData.periodEnd}
                onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Score & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
              Score <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="score"
              required
              step="0.01"
              min="0"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {selectedKPI?.unit && (
              <p className="mt-1 text-xs text-gray-500">Unit: {selectedKPI.unit}</p>
            )}
          </div>

          <div>
            <label htmlFor="actualValue" className="block text-sm font-medium text-gray-700 mb-2">
              Actual Value
            </label>
            <input
              type="number"
              id="actualValue"
              step="0.01"
              value={formData.actualValue}
              onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
              placeholder="Same as score"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

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
              placeholder={selectedKPI?.targetValue ? String(selectedKPI.targetValue) : ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any relevant notes or observations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/kpi-evaluations"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : isEditMode ? 'Update Evaluation' : 'Create Evaluation'}
          </button>
        </div>
      </form>
    </div>
  )
}
