import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  ChartBarIcon, UsersIcon, CurrencyDollarIcon, CalendarIcon,
  ArrowDownTrayIcon, FunnelIcon, ChartPieIcon,
  TrendingUpIcon, TrendingDownIcon, UserGroupIcon,
  BuildingOffice2Icon, ClockIcon
} from '@heroicons/react/24/outline'

interface ReportData {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  period: string
  icon: React.ComponentType<any>
  color: string
}

interface AttendanceRecord {
  date: string
  service: string
  attendance: number
  capacity: number
  weather?: string
}

interface FinancialRecord {
  month: string
  donations: number
  expenses: number
  net: number
}

const Reports: React.FC = () => {
  const { themeConfig } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [selectedReport, setSelectedReport] = useState<string>('overview')
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' })

  // Mock data for key metrics
  const keyMetrics: ReportData[] = [
    {
      id: '1',
      title: 'Total Members',
      value: 1247,
      change: 8.2,
      changeType: 'increase',
      period: 'vs last month',
      icon: UsersIcon,
      color: '#3B82F6'
    },
    {
      id: '2',
      title: 'Average Attendance',
      value: '89%',
      change: 5.1,
      changeType: 'increase',
      period: 'vs last month',
      icon: UserGroupIcon,
      color: '#10B981'
    },
    {
      id: '3',
      title: 'Monthly Donations',
      value: '$45,620',
      change: -2.3,
      changeType: 'decrease',
      period: 'vs last month',
      icon: CurrencyDollarIcon,
      color: '#F59E0B'
    },
    {
      id: '4',
      title: 'Active Groups',
      value: 24,
      change: 12.5,
      changeType: 'increase',
      period: 'vs last month',
      icon: BuildingOffice2Icon,
      color: '#8B5CF6'
    },
    {
      id: '5',
      title: 'Events This Month',
      value: 18,
      change: 0,
      changeType: 'neutral',
      period: 'vs last month',
      icon: CalendarIcon,
      color: '#06B6D4'
    },
    {
      id: '6',
      title: 'Volunteer Hours',
      value: 342,
      change: 15.8,
      changeType: 'increase',
      period: 'vs last month',
      icon: ClockIcon,
      color: '#EF4444'
    }
  ]

  // Mock attendance data
  const attendanceData: AttendanceRecord[] = [
    { date: '2024-01-07', service: 'Sunday Morning', attendance: 245, capacity: 300, weather: 'Sunny' },
    { date: '2024-01-14', service: 'Sunday Morning', attendance: 267, capacity: 300, weather: 'Cloudy' },
    { date: '2024-01-21', service: 'Sunday Morning', attendance: 234, capacity: 300, weather: 'Rainy' },
    { date: '2024-01-28', service: 'Sunday Morning', attendance: 289, capacity: 300, weather: 'Sunny' },
    { date: '2024-02-04', service: 'Sunday Morning', attendance: 256, capacity: 300, weather: 'Sunny' },
    { date: '2024-02-11', service: 'Sunday Morning', attendance: 278, capacity: 300, weather: 'Cloudy' },
    { date: '2024-02-18', service: 'Sunday Morning', attendance: 245, capacity: 300, weather: 'Rainy' },
    { date: '2024-02-25', service: 'Sunday Morning', attendance: 295, capacity: 300, weather: 'Sunny' }
  ]

  // Mock financial data
  const financialData: FinancialRecord[] = [
    { month: 'Jan 2024', donations: 42500, expenses: 38200, net: 4300 },
    { month: 'Feb 2024', donations: 45600, expenses: 39100, net: 6500 },
    { month: 'Mar 2024', donations: 48200, expenses: 41500, net: 6700 },
    { month: 'Apr 2024', donations: 44800, expenses: 40200, net: 4600 },
    { month: 'May 2024', donations: 47300, expenses: 42100, net: 5200 },
    { month: 'Jun 2024', donations: 51200, expenses: 43800, net: 7400 }
  ]

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'financial', label: 'Financial' },
    { value: 'membership', label: 'Membership' },
    { value: 'events', label: 'Events' },
    { value: 'groups', label: 'Groups' }
  ]

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'increase') return TrendingUpIcon
    if (changeType === 'decrease') return TrendingDownIcon
    return () => null
  }

  const getChangeColor = (changeType: string) => {
    if (changeType === 'increase') return 'text-green-600'
    if (changeType === 'decrease') return 'text-red-600'
    return 'text-gray-500'
  }

  const calculateAttendancePercentage = (attendance: number, capacity: number) => {
    return Math.round((attendance / capacity) * 100)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              Reports Dashboard
            </h1>
            <p 
              className="mt-2"
              style={{ color: themeConfig.colors.text, opacity: 0.7 }}
            >
              Comprehensive analytics and insights for church management
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                backgroundColor: themeConfig.colors.primary,
                boxShadow: `0 0 0 3px ${themeConfig.colors.primary}20`
              }}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: themeConfig.colors.text }}
          >
            Report Type
          </label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-1 sm:text-sm rounded-md"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: themeConfig.colors.text }}
          >
            Time Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-1 sm:text-sm rounded-md"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            {periodOptions.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        {selectedPeriod === 'custom' && (
          <div className="flex gap-2">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 sm:text-sm"
                style={{
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeConfig.colors.text }}
              >
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 sm:text-sm"
                style={{
                  backgroundColor: themeConfig.colors.secondary,
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon
          const ChangeIcon = getChangeIcon(metric.changeType)
          
          return (
            <div
              key={metric.id}
              className="rounded-lg border p-6 hover:shadow-md transition-shadow"
              style={{
                backgroundColor: themeConfig.colors.secondary,
                borderColor: themeConfig.colors.divider
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p 
                    className="text-sm font-medium"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    {metric.title}
                  </p>
                  <p 
                    className="text-2xl font-bold mt-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  {metric.change !== 0 && (
                    <div className="flex items-center mt-2">
                      <ChangeIcon 
                        className={`h-4 w-4 mr-1 ${getChangeColor(metric.changeType)}`}
                      />
                      <span 
                        className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}
                      >
                        {Math.abs(metric.change)}%
                      </span>
                      <span 
                        className="text-sm ml-1"
                        style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                      >
                        {metric.period}
                      </span>
                    </div>
                  )}
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: metric.color + '20' }}
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ color: metric.color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Report Content Based on Selection */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Attendance Chart Placeholder */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-lg font-semibold"
                style={{ color: themeConfig.colors.text }}
              >
                Attendance Trend
              </h3>
              <ChartBarIcon 
                className="h-5 w-5"
                style={{ color: themeConfig.colors.primary }}
              />
            </div>
            <div 
              className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg"
              style={{ borderColor: themeConfig.colors.divider }}
            >
              <div className="text-center">
                <ChartBarIcon 
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: themeConfig.colors.text, opacity: 0.3 }}
                />
                <p 
                  className="text-sm"
                  style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                >
                  Chart visualization will be implemented with charting library
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary Chart Placeholder */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-lg font-semibold"
                style={{ color: themeConfig.colors.text }}
              >
                Financial Overview
              </h3>
              <ChartPieIcon 
                className="h-5 w-5"
                style={{ color: themeConfig.colors.primary }}
              />
            </div>
            <div 
              className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg"
              style={{ borderColor: themeConfig.colors.divider }}
            >
              <div className="text-center">
                <ChartPieIcon 
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: themeConfig.colors.text, opacity: 0.3 }}
                />
                <p 
                  className="text-sm"
                  style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                >
                  Pie chart for donations vs expenses breakdown
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'attendance' && (
        <div 
          className="rounded-lg border"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="p-6">
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: themeConfig.colors.text }}
            >
              Attendance Records
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                <thead style={{ backgroundColor: themeConfig.colors.background }}>
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Date
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Service
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Attendance
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Capacity
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Percentage
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Weather
                    </th>
                  </tr>
                </thead>
                <tbody 
                  className="divide-y"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  {attendanceData.map((record, index) => {
                    const percentage = calculateAttendancePercentage(record.attendance, record.capacity)
                    return (
                      <tr key={index} className="hover:opacity-90">
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {record.service}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {record.attendance}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {record.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-16 bg-gray-200 rounded-full h-2 mr-2"
                              style={{ backgroundColor: themeConfig.colors.divider }}
                            >
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: percentage >= 80 ? '#10B981' : percentage >= 60 ? '#F59E0B' : '#EF4444'
                                }}
                              />
                            </div>
                            <span 
                              className="text-sm font-medium"
                              style={{ color: themeConfig.colors.text }}
                            >
                              {percentage}%
                            </span>
                          </div>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                        >
                          {record.weather}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'financial' && (
        <div 
          className="rounded-lg border"
          style={{
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider
          }}
        >
          <div className="p-6">
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: themeConfig.colors.text }}
            >
              Financial Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                <thead style={{ backgroundColor: themeConfig.colors.background }}>
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Month
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Donations
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Expenses
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody 
                  className="divide-y"
                  style={{ 
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider 
                  }}
                >
                  {financialData.map((record, index) => (
                    <tr key={index} className="hover:opacity-90">
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        style={{ color: themeConfig.colors.text }}
                      >
                        {record.month}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm text-green-600"
                      >
                        {formatCurrency(record.donations)}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm text-red-600"
                      >
                        {formatCurrency(record.expenses)}
                      </td>
                      <td 
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          record.net >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(record.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports