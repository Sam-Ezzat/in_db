import React, { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  PaperClipIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { communicationService, EmailMessage } from '../../services/communicationService'

interface EmailComposerProps {}

const EmailComposer: React.FC<EmailComposerProps> = () => {
  const { themeConfig } = useTheme()
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    htmlContent: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  })
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose')

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    try {
      setLoading(true)
      const data = await communicationService.getEmails()
      setEmails(data)
    } catch (error) {
      console.error('Error loading emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.to || !newEmail.subject || !newEmail.htmlContent) return

    try {
      setSending(true)
      await communicationService.sendEmail({
        to: newEmail.to.split(',').map(email => email.trim()),
        cc: newEmail.cc ? newEmail.cc.split(',').map(email => email.trim()) : undefined,
        bcc: newEmail.bcc ? newEmail.bcc.split(',').map(email => email.trim()) : undefined,
        subject: newEmail.subject,
        htmlContent: newEmail.htmlContent,
        textContent: newEmail.htmlContent.replace(/<[^>]*>/g, ''),
        priority: newEmail.priority
      })
      
      setNewEmail({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        htmlContent: '',
        priority: 'normal'
      })
      await loadEmails()
      setActiveTab('history')
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setSending(false)
    }
  }

  const getStatusIcon = (status: EmailMessage['status']) => {
    switch (status) {
      case 'queued':
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      case 'sent':
        return <CheckIcon className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <CheckIcon className="h-4 w-4 text-green-500" />
      case 'opened':
        return <EyeIcon className="h-4 w-4 text-purple-500" />
      case 'failed':
      case 'bounced':
        return <XMarkIcon className="h-4 w-4 text-red-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: EmailMessage['priority']) => {
    switch (priority) {
      case 'high':
        return '#ff4444'
      case 'low':
        return '#888888'
      default:
        return themeConfig.colors.primary
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div 
      className="h-full max-w-6xl mx-auto p-6"
      style={{ backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: '#EA4335' }}
          >
            <EnvelopeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>Email Composer</h1>
            <p style={{ color: themeConfig.colors.text + '80' }}>
              Send emails to individuals and groups
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'compose', label: 'Compose Email' },
            { key: 'history', label: 'Email History' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="py-2 px-1 border-b-2 font-medium text-sm"
              style={{
                borderColor: activeTab === tab.key ? themeConfig.colors.primary : 'transparent',
                color: activeTab === tab.key ? themeConfig.colors.primary : themeConfig.colors.text + '80'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'compose' ? (
        /* Compose Email */
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
        >
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  To (comma-separated emails)
                </label>
                <input
                  type="email"
                  value={newEmail.to}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="john@email.com, mary@email.com"
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  Priority
                </label>
                <select
                  value={newEmail.priority}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  CC (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail.cc}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, cc: e.target.value }))}
                  placeholder="cc@email.com"
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                  BCC (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail.bcc}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, bcc: e.target.value }))}
                  placeholder="bcc@email.com"
                  className="w-full p-3 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background,
                    color: themeConfig.colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Subject
              </label>
              <input
                type="text"
                value={newEmail.subject}
                onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
                className="w-full p-3 border rounded-md"
                style={{
                  borderColor: themeConfig.colors.divider,
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Message
              </label>
              <textarea
                value={newEmail.htmlContent}
                onChange={(e) => setNewEmail(prev => ({ ...prev, htmlContent: e.target.value }))}
                placeholder="Type your message here... (HTML supported)"
                rows={8}
                className="w-full p-3 border rounded-md"
                style={{
                  borderColor: themeConfig.colors.divider,
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text
                }}
                required
              />
              <p className="text-xs mt-1" style={{ color: themeConfig.colors.text + '60' }}>
                You can use HTML tags for formatting
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 border rounded-md"
                  style={{
                    borderColor: themeConfig.colors.divider,
                    color: themeConfig.colors.text
                  }}
                >
                  <PaperClipIcon className="h-4 w-4 mr-2" />
                  Attach Files
                </button>
              </div>

              <button
                type="submit"
                disabled={sending || !newEmail.to || !newEmail.subject || !newEmail.htmlContent}
                className="flex items-center justify-center py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: '#EA4335',
                  color: 'white'
                }}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Email History */
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: themeConfig.colors.background, borderColor: themeConfig.colors.divider }}
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="text-center py-8">
                <EnvelopeIcon className="h-12 w-12 mx-auto mb-4" style={{ color: themeConfig.colors.text + '40' }} />
                <p style={{ color: themeConfig.colors.text + '60' }}>No emails sent yet</p>
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.divider
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getPriorityColor(email.priority) }}
                        ></div>
                        <span className="font-medium" style={{ color: themeConfig.colors.text }}>
                          {email.subject}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm" style={{ color: themeConfig.colors.text + '60' }}>
                        <UserIcon className="h-4 w-4" />
                        <span>To: {email.to.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(email.status)}
                      <span className="text-xs" style={{ color: themeConfig.colors.text + '60' }}>
                        {formatTime(email.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: email.status === 'delivered' ? '#10B981' : 
                                       email.status === 'failed' || email.status === 'bounced' ? '#ff4444' : 
                                       email.status === 'opened' ? '#8B5CF6' : themeConfig.colors.primary,
                        color: 'white'
                      }}
                    >
                      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailComposer