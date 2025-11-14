import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { reportService, ReportItem } from '../../services/reportService'
import { useTheme } from '../../contexts/ThemeContext'

export default function ReportForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    reporterPersonId: 'person-1', // Mock - should come from auth
    targetType: 'team' as 'church' | 'committee' | 'team' | 'group' | 'person',
    targetId: '',
    periodStart: '',
    periodEnd: '',
    title: ''
  })

  const [items, setItems] = useState<Partial<ReportItem>[]>([
    { itemKey: '', itemType: 'text', valueText: '' }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditMode && id) {
      loadReport()
    }
  }, [id])

  const loadReport = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await reportService.getReportById(id)
      if (!data) {
        alert('Report not found')
        navigate('/reports')
        return
      }

      setFormData({
        reporterPersonId: data.reporterPersonId || 'person-1',
        targetType: data.targetType,
        targetId: data.targetId,
        periodStart: new Date(data.periodStart).toISOString().slice(0, 10),
        periodEnd: new Date(data.periodEnd).toISOString().slice(0, 10),
        title: data.title
      })

      if (data.items && data.items.length > 0) {
        setItems(data.items)
      }
    } catch (err) {
      console.error('Failed to load report:', err)
      setError('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.targetId || !formData.periodStart || !formData.periodEnd || !formData.title) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const submitData = {
        ...formData,
        periodStart: new Date(formData.periodStart),
        periodEnd: new Date(formData.periodEnd),
        items: items.filter(item => item.itemKey && item.itemKey.trim())
      }

      if (isEditMode && id) {
        await reportService.updateReport(id, submitData as any)
      } else {
        await reportService.createReport(submitData as any)
      }

      navigate('/reports')
    } catch (err) {
      console.error('Failed to save report:', err)
      setError('Failed to save report')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { itemKey: '', itemType: 'text', valueText: '' }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  if (loading && isEditMode) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
        Loading report...
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center text-sm hover:opacity-80 transition-opacity mr-4"
          style={{ color: themeConfig.colors.primary }}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Reports
        </button>
        <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
          {isEditMode ? 'Edit Report' : 'Create New Report'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Report Title <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="e.g., Monthly Ministry Report - January 2024"
                  />
                </div>

                {/* Target Type */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Report For <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={formData.targetType}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  >
                    <option value="church">Church</option>
                    <option value="committee">Committee</option>
                    <option value="team">Team</option>
                    <option value="group">Group</option>
                    <option value="person">Person</option>
                  </select>
                </div>

                {/* Target ID - In production, this would be a dropdown based on targetType */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Target <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetId}
                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                    placeholder="Target ID"
                  />
                </div>

                {/* Period Start */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Period Start <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>

                {/* Period End */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Period End <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.divider,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>
              </div>

              {/* Report Items */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold" style={{ color: themeConfig.colors.text }}>
                    Report Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center px-3 py-1 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ 
                      backgroundColor: themeConfig.colors.primary,
                      color: '#FFFFFF'
                    }}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: themeConfig.colors.background,
                        borderColor: themeConfig.colors.divider
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Item Key */}
                          <div>
                            <input
                              type="text"
                              value={item.itemKey || ''}
                              onChange={(e) => updateItem(index, 'itemKey', e.target.value)}
                              placeholder="Key (e.g., attendance_count)"
                              className="w-full px-3 py-2 border rounded text-sm"
                              style={{ 
                                backgroundColor: themeConfig.colors.secondary,
                                borderColor: themeConfig.colors.divider,
                                color: themeConfig.colors.text
                              }}
                            />
                          </div>

                          {/* Item Type */}
                          <div>
                            <select
                              value={item.itemType || 'text'}
                              onChange={(e) => updateItem(index, 'itemType', e.target.value)}
                              className="w-full px-3 py-2 border rounded text-sm"
                              style={{ 
                                backgroundColor: themeConfig.colors.secondary,
                                borderColor: themeConfig.colors.divider,
                                color: themeConfig.colors.text
                              }}
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="json">JSON</option>
                            </select>
                          </div>

                          {/* Value */}
                          <div>
                            {item.itemType === 'number' ? (
                              <input
                                type="number"
                                value={item.valueNumber || ''}
                                onChange={(e) => updateItem(index, 'valueNumber', parseFloat(e.target.value))}
                                placeholder="Value"
                                className="w-full px-3 py-2 border rounded text-sm"
                                style={{ 
                                  backgroundColor: themeConfig.colors.secondary,
                                  borderColor: themeConfig.colors.divider,
                                  color: themeConfig.colors.text
                                }}
                              />
                            ) : item.itemType === 'json' ? (
                              <textarea
                                value={item.valueJson ? JSON.stringify(item.valueJson) : ''}
                                onChange={(e) => {
                                  try {
                                    updateItem(index, 'valueJson', JSON.parse(e.target.value))
                                  } catch {
                                    updateItem(index, 'valueJson', e.target.value)
                                  }
                                }}
                                placeholder="JSON value"
                                rows={2}
                                className="w-full px-3 py-2 border rounded text-sm"
                                style={{ 
                                  backgroundColor: themeConfig.colors.secondary,
                                  borderColor: themeConfig.colors.divider,
                                  color: themeConfig.colors.text
                                }}
                              />
                            ) : (
                              <input
                                type="text"
                                value={item.valueText || ''}
                                onChange={(e) => updateItem(index, 'valueText', e.target.value)}
                                placeholder="Value"
                                className="w-full px-3 py-2 border rounded text-sm"
                                style={{ 
                                  backgroundColor: themeConfig.colors.secondary,
                                  borderColor: themeConfig.colors.divider,
                                  color: themeConfig.colors.text
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 hover:opacity-80 transition-opacity"
                          style={{ color: '#EF4444' }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                Actions
              </h2>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  <Save size={20} className="mr-2" />
                  {loading ? 'Saving...' : isEditMode ? 'Update Report' : 'Create Report'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/reports')}
                  className="w-full px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
                  style={{ 
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text 
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
