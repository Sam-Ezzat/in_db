import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Plus,
  Download,
  Calendar,
  Users,
  CreditCard,
  Receipt,
  Target,
  AlertCircle
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import RequirePermission from '../../components/Auth/RequirePermission'
import { financialService, FinancialSummary } from '../../services/financialService'

const FinancialManagement: React.FC = () => {
  const { themeConfig } = useTheme()
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadFinancialSummary()
  }, [])

  const loadFinancialSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current year summary
      const currentYear = new Date().getFullYear()
      const startDate = new Date(currentYear, 0, 1)
      const endDate = new Date(currentYear, 11, 31)
      
      const summaryData = await financialService.getFinancialSummary('1', { startDate, endDate })
      setSummary(summaryData)
    } catch (err) {
      setError('Failed to load financial summary')
      console.error('Error loading financial summary:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'donations', label: 'Donations', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'reports', label: 'Reports', icon: Receipt }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div 
          className="flex items-center p-4 rounded-lg border"
          style={{ 
            backgroundColor: '#fee2e2',
            borderColor: '#fecaca',
            color: '#991b1b'
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Track donations, expenses, budgets, and financial reports
          </p>
        </div>
        <div className="flex gap-2">
          <RequirePermission resource="financial" action="export">
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text 
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </RequirePermission>
          <RequirePermission resource="financial" action="create">
            <button
              className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Entry
            </button>
          </RequirePermission>
        </div>
      </div>

      {/* Tab Navigation */}
      <div 
        className="border-b"
        style={{ borderColor: themeConfig.colors.divider }}
      >
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{
                  color: activeTab === tab.id ? themeConfig.colors.primary : themeConfig.colors.text,
                  borderBottomColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent'
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Total Donations
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(summary?.totalDonations || 0)}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                This month: {formatCurrency(summary?.donationsThisMonth || 0)}
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Total Expenses
                </div>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(summary?.totalExpenses || 0)}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                This month: {formatCurrency(summary?.expensesThisMonth || 0)}
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Net Income
                </div>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className={`text-2xl font-bold mt-2 ${
                (summary?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(summary?.netIncome || 0)}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Year to date
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Active Donors
                </div>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                {summary?.donorCount || 0}
              </div>
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                Avg: {formatCurrency(summary?.averageDonation || 0)}
              </p>
            </div>
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Donation Categories */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Top Donation Categories
                </h3>
              </div>
              <div className="space-y-3">
                {summary?.topDonationCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}></div>
                      <span className="capitalize text-sm" style={{ color: themeConfig.colors.text }}>
                        {category.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: themeConfig.colors.text }}>
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.5 }}>
                        {formatPercentage(category.percentage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Expense Categories */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
                <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                  Top Expense Categories
                </h3>
              </div>
              <div className="space-y-3">
                {summary?.topExpenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        index === 2 ? 'bg-amber-500' : 
                        index === 3 ? 'bg-yellow-500' : 'bg-lime-500'
                      }`}></div>
                      <span className="capitalize text-sm" style={{ color: themeConfig.colors.text }}>
                        {category.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: themeConfig.colors.text }}>
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs" style={{ color: themeConfig.colors.text, opacity: 0.5 }}>
                        {formatPercentage(category.percentage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5" style={{ color: themeConfig.colors.text }} />
              <h3 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                Monthly Trends
              </h3>
            </div>
            <div className="space-y-4">
              {summary?.monthlyTrends.slice(-6).map((trend, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: themeConfig.colors.background }}
                >
                  <div className="font-medium" style={{ color: themeConfig.colors.text }}>
                    {trend.month}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-green-600">
                      +{formatCurrency(trend.donations)}
                    </div>
                    <div className="text-red-600">
                      -{formatCurrency(trend.expenses)}
                    </div>
                    <div className={`font-semibold ${
                      trend.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(trend.net)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RequirePermission resource="financial" action="create">
              <div 
                className="p-6 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      Record Donation
                    </h3>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                      Add new donation entry
                    </p>
                  </div>
                  <Plus className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </RequirePermission>

            <RequirePermission resource="financial" action="create">
              <div 
                className="p-6 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      Add Expense
                    </h3>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                      Record new expense
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </RequirePermission>

            <RequirePermission resource="financial" action="view">
              <div 
                className="p-6 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider 
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      Generate Report
                    </h3>
                    <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                      Create financial report
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </RequirePermission>
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <RequirePermission resource="financial" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Donations Management
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Donations tracking functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'expenses' && (
        <RequirePermission resource="financial" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Expenses Management
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Expense tracking functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'budgets' && (
        <RequirePermission resource="financial" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Budget Management
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Budget planning functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}

      {activeTab === 'reports' && (
        <RequirePermission resource="financial" action="view">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
              Financial Reports
            </h3>
            <p style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Financial reporting functionality will be implemented here.
            </p>
          </div>
        </RequirePermission>
      )}
    </div>
  )
}

export default FinancialManagement