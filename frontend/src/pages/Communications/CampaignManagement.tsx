import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MegaphoneIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { communicationService, Campaign, CampaignFilters, Template } from '../../services/communicationService'

// Mock theme context for now
const theme = 'light'

// Mock permission component for now
const RequirePermission: React.FC<{ permission: string; children: React.ReactNode }> = ({ children }) => <>{children}</>

interface CampaignManagementProps {}

const CampaignManagement: React.FC<CampaignManagementProps> = () => {
  const navigate = useNavigate()
  const { id: selectedCampaignId } = useParams()

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<'all' | 'draft' | 'scheduled' | 'sending' | 'completed' | 'analytics'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'email' as Campaign['type'],
    subject: '',
    content: '',
    audienceType: 'all_members' as Campaign['audienceType'],
    audienceIds: [] as string[],
    targetCount: 0,
    templateId: '',
    scheduledFor: '',
    settings: {
      sendImmediately: true,
      timezone: 'UTC',
      trackOpens: true,
      trackClicks: true,
      unsubscribeLink: true,
      retryFailures: true,
      senderName: 'Church Communications'
    }
  })

  useEffect(() => {
    loadData()
    loadTemplates()
  }, [currentTab])

  useEffect(() => {
    if (selectedCampaignId) {
      loadCampaign(selectedCampaignId)
    }
  }, [selectedCampaignId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      let viewFilters: CampaignFilters = {}
      
      if (currentTab !== 'all' && currentTab !== 'analytics') {
        viewFilters = { status: currentTab }
      }

      const campaignsData = await communicationService.getCampaigns(viewFilters)
      setCampaigns(campaignsData)
    } catch (err) {
      setError('Failed to load campaigns')
      console.error('Error loading campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const templatesData = await communicationService.getTemplates('email')
      setTemplates(templatesData)
    } catch (err) {
      console.error('Error loading templates:', err)
    }
  }

  const loadCampaign = async (campaignId: string) => {
    try {
      const campaign = await communicationService.getCampaignById(campaignId)
      setSelectedCampaign(campaign)
    } catch (err) {
      console.error('Error loading campaign:', err)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      if (!newCampaign.name.trim() || !newCampaign.content.trim()) {
        setError('Please fill in all required fields')
        return
      }

      const campaignData = {
        ...newCampaign,
        status: newCampaign.settings.sendImmediately ? 'sending' : 'draft' as Campaign['status'],
        scheduledFor: newCampaign.scheduledFor ? new Date(newCampaign.scheduledFor) : undefined,
        createdBy: 'current_user'
      }

      const createdCampaign = await communicationService.createCampaign(campaignData)
      
      if (newCampaign.settings.sendImmediately) {
        await communicationService.sendCampaign(createdCampaign.id)
      }

      setShowCreateModal(false)
      setNewCampaign({
        name: '',
        description: '',
        type: 'email',
        subject: '',
        content: '',
        audienceType: 'all_members',
        audienceIds: [],
        targetCount: 0,
        templateId: '',
        scheduledFor: '',
        settings: {
          sendImmediately: true,
          timezone: 'UTC',
          trackOpens: true,
          trackClicks: true,
          unsubscribeLink: true,
          retryFailures: true,
          senderName: 'Church Communications'
        }
      })
      loadData()
    } catch (err) {
      setError('Failed to create campaign')
      console.error('Error creating campaign:', err)
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await communicationService.sendCampaign(campaignId)
      loadData()
      if (selectedCampaign?.id === campaignId) {
        loadCampaign(campaignId)
      }
    } catch (err) {
      console.error('Error sending campaign:', err)
    }
  }

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await communicationService.pauseCampaign(campaignId)
      loadData()
      if (selectedCampaign?.id === campaignId) {
        loadCampaign(campaignId)
      }
    } catch (err) {
      console.error('Error pausing campaign:', err)
    }
  }

  const handleCancelCampaign = async (campaignId: string) => {
    try {
      if (window.confirm('Are you sure you want to cancel this campaign?')) {
        await communicationService.cancelCampaign(campaignId)
        loadData()
        if (selectedCampaign?.id === campaignId) {
          loadCampaign(campaignId)
        }
      }
    } catch (err) {
      console.error('Error cancelling campaign:', err)
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    try {
      const template = await communicationService.useTemplate(templateId)
      if (template) {
        setNewCampaign(prev => ({
          ...prev,
          templateId: template.id,
          subject: template.subject || '',
          content: template.content
        }))
      }
    } catch (err) {
      console.error('Error using template:', err)
    }
  }

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return <PencilIcon className="h-5 w-5 text-gray-500" />
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'sending':
        return <PlayIcon className="h-5 w-5 text-yellow-500" />
      case 'sent':
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'paused':
        return <PauseIcon className="h-5 w-5 text-orange-500" />
      case 'cancelled':
        return <StopIcon className="h-5 w-5 text-red-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'sending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'sent':
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MegaphoneIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Campaign Management</h1>
            </div>
            <RequirePermission permission="campaigns:create">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </RequirePermission>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'all', label: 'All Campaigns', count: campaigns.length },
              { key: 'draft', label: 'Drafts', count: campaigns.filter(c => c.status === 'draft').length },
              { key: 'scheduled', label: 'Scheduled', count: campaigns.filter(c => c.status === 'scheduled').length },
              { key: 'sending', label: 'Sending', count: campaigns.filter(c => c.status === 'sending').length },
              { key: 'completed', label: 'Completed', count: campaigns.filter(c => c.status === 'completed').length },
              { key: 'analytics', label: 'Analytics', count: 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {currentTab === 'analytics' ? (
          /* Analytics Section */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Campaigns */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MegaphoneIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                  </div>
                </div>
              </div>

              {/* Active Campaigns */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PlayIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Open Rate */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EyeIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg. Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(
                        campaigns.filter(c => c.status === 'completed').length > 0
                          ? campaigns.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.analytics.openRate, 0) / campaigns.filter(c => c.status === 'completed').length
                          : 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Click Rate */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg. Click Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(
                        campaigns.filter(c => c.status === 'completed').length > 0
                          ? campaigns.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.analytics.clickRate, 0) / campaigns.filter(c => c.status === 'completed').length
                          : 0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Campaigns Performance */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Campaign Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Open Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Click Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.filter(c => c.status === 'completed').slice(0, 5).map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{formatDate(campaign.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {campaign.type === 'email' ? (
                                <EnvelopeIcon className="h-4 w-4 text-blue-500 mr-2" />
                              ) : (
                                <DevicePhoneMobileIcon className="h-4 w-4 text-green-500 mr-2" />
                              )}
                              <span className="text-sm text-gray-900 capitalize">{campaign.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.sentCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(campaign.analytics.deliveryRate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(campaign.analytics.openRate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(campaign.analytics.clickRate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Campaigns List */
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <MegaphoneIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No campaigns found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Get started by creating your first email or SMS campaign.
                    </p>
                    <RequirePermission permission="campaigns:create">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Campaign
                      </button>
                    </RequirePermission>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(campaign.status)}
                            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              {campaign.type === 'email' ? (
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                              ) : (
                                <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                              )}
                              {campaign.type.toUpperCase()}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{campaign.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Target Audience</p>
                              <div className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-900">{campaign.targetCount.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            {campaign.status === 'completed' && (
                              <>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Delivery Rate</p>
                                  <p className="text-sm text-gray-900">{formatPercentage(campaign.analytics.deliveryRate)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Open Rate</p>
                                  <p className="text-sm text-gray-900">{formatPercentage(campaign.analytics.openRate)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Click Rate</p>
                                  <p className="text-sm text-gray-900">{formatPercentage(campaign.analytics.clickRate)}</p>
                                </div>
                              </>
                            )}
                            
                            {campaign.scheduledFor && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">Scheduled For</p>
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-900">{formatDate(campaign.scheduledFor)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Created {formatDate(campaign.createdAt)} by {campaign.createdBy}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {campaign.status === 'draft' && (
                            <RequirePermission permission="campaigns:send">
                              <button
                                onClick={() => handleSendCampaign(campaign.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                title="Send Campaign"
                              >
                                <PlayIcon className="h-5 w-5" />
                              </button>
                            </RequirePermission>
                          )}
                          
                          {campaign.status === 'sending' && (
                            <RequirePermission permission="campaigns:update">
                              <button
                                onClick={() => handlePauseCampaign(campaign.id)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
                                title="Pause Campaign"
                              >
                                <PauseIcon className="h-5 w-5" />
                              </button>
                            </RequirePermission>
                          )}
                          
                          {(campaign.status === 'draft' || campaign.status === 'scheduled' || campaign.status === 'sending') && (
                            <RequirePermission permission="campaigns:update">
                              <button
                                onClick={() => handleCancelCampaign(campaign.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                title="Cancel Campaign"
                              >
                                <StopIcon className="h-5 w-5" />
                              </button>
                            </RequirePermission>
                          )}
                          
                          <RequirePermission permission="campaigns:update">
                            <button
                              onClick={() => navigate(`/communications/campaigns/${campaign.id}/edit`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                              title="Edit Campaign"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                          </RequirePermission>
                          
                          <RequirePermission permission="campaigns:create">
                            <button
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                              title="Duplicate Campaign"
                            >
                              <DocumentDuplicateIcon className="h-5 w-5" />
                            </button>
                          </RequirePermission>
                          
                          <RequirePermission permission="campaigns:delete">
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              title="Delete Campaign"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </RequirePermission>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl mx-4 rounded-lg shadow-xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create New Campaign</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                      <input
                        type="text"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter campaign name..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as Campaign['type'] }))}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="email">Email Campaign</option>
                        <option value="sms">SMS Campaign</option>
                        <option value="mixed">Mixed Campaign</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter campaign description..."
                    />
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Template (Optional)</h3>
                  <select
                    value={newCampaign.templateId}
                    onChange={(e) => {
                      setNewCampaign(prev => ({ ...prev, templateId: e.target.value }))
                      if (e.target.value) {
                        handleUseTemplate(e.target.value)
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a template...</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Content</h3>
                  <div className="space-y-4">
                    {newCampaign.type === 'email' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject Line</label>
                        <input
                          type="text"
                          value={newCampaign.subject}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-md"
                          placeholder="Enter email subject..."
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-2">Message Content *</label>
                      <textarea
                        value={newCampaign.content}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Enter your message content..."
                      />
                    </div>
                  </div>
                </div>

                {/* Audience */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Audience</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Audience</label>
                      <select
                        value={newCampaign.audienceType}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, audienceType: e.target.value as Campaign['audienceType'] }))}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="all_members">All Members</option>
                        <option value="groups">Specific Groups</option>
                        <option value="roles">Specific Roles</option>
                        <option value="custom">Custom List</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Recipients</label>
                      <input
                        type="number"
                        value={newCampaign.targetCount}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Scheduling</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sendImmediately"
                        checked={newCampaign.settings.sendImmediately}
                        onChange={(e) => setNewCampaign(prev => ({
                          ...prev,
                          settings: { ...prev.settings, sendImmediately: e.target.checked }
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sendImmediately" className="text-sm font-medium">
                        Send immediately
                      </label>
                    </div>
                    {!newCampaign.settings.sendImmediately && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Schedule For</label>
                        <input
                          type="datetime-local"
                          value={newCampaign.scheduledFor}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledFor: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCampaign}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {newCampaign.settings.sendImmediately ? 'Create & Send' : 'Create Campaign'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignManagement