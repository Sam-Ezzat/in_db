import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

// Enhanced color functions with theme integration
const getTypeColor = (type: string) => {
  const colors = {
    'Program': { bg: '#dbeafe', text: '#1e40af', darkBg: '#1e3a8a20', darkText: '#93c5fd' },
    'Event': { bg: '#dcfce7', text: '#166534', darkBg: '#16553420', darkText: '#86efac' },
    'Service': { bg: '#f3e8ff', text: '#7c2d12', darkBg: '#7c2d1220', darkText: '#c4b5fd' },
    'Ministry': { bg: '#fed7aa', text: '#c2410c', darkBg: '#c2410c20', darkText: '#fdba74' },
    'Leadership': { bg: '#fecaca', text: '#dc2626', darkBg: '#dc262620', darkText: '#fca5a5' },
  };
  return colors[type as keyof typeof colors] || { bg: '#f3f4f6', text: '#4b5563', darkBg: '#4b556320', darkText: '#d1d5db' };
};

const getStatusColor = (status: string) => {
  const colors = {
    'Active': { bg: '#dcfce7', text: '#166534', darkBg: '#16553420', darkText: '#86efac' },
    'Draft': { bg: '#fef3c7', text: '#d97706', darkBg: '#d9770620', darkText: '#fcd34d' },
    'Completed': { bg: '#dbeafe', text: '#1e40af', darkBg: '#1e3a8a20', darkText: '#93c5fd' },
    'Archived': { bg: '#f3f4f6', text: '#4b5563', darkBg: '#4b556320', darkText: '#d1d5db' },
  };
  return colors[status as keyof typeof colors] || { bg: '#f3f4f6', text: '#4b5563', darkBg: '#4b556320', darkText: '#d1d5db' };
};

interface Evaluation {
  id: string;
  title: string;
  description: string;
  type: 'Program' | 'Event' | 'Service' | 'Ministry' | 'Leadership';
  status: 'Active' | 'Draft' | 'Completed' | 'Archived';
  createdDate: string;
  responses: number;
  averageRating: number;
  questions: number;
  targetAudience: string;
  deadline?: string;
  category: string;
}

const Evaluations: React.FC = () => {
  const { themeConfig, theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for evaluations
  const evaluations: Evaluation[] = [
    {
      id: '1',
      title: 'Sunday Service Experience',
      description: 'Weekly evaluation of Sunday worship service experience and feedback',
      type: 'Service',
      status: 'Active',
      createdDate: '2024-01-15',
      responses: 143,
      averageRating: 4.7,
      questions: 12,
      targetAudience: 'All Congregants',
      deadline: '2024-12-31',
      category: 'Worship'
    },
    {
      id: '2',
      title: 'Youth Ministry Program Assessment',
      description: 'Quarterly evaluation of youth ministry programs and activities',
      type: 'Program',
      status: 'Active',
      createdDate: '2024-01-10',
      responses: 87,
      averageRating: 4.5,
      questions: 15,
      targetAudience: 'Youth & Parents',
      deadline: '2024-03-31',
      category: 'Youth Ministry'
    },
    {
      id: '3',
      title: 'Leadership Training Effectiveness',
      description: 'Assessment of leadership development program effectiveness',
      type: 'Leadership',
      status: 'Completed',
      createdDate: '2024-01-05',
      responses: 24,
      averageRating: 4.2,
      questions: 18,
      targetAudience: 'Ministry Leaders',
      category: 'Leadership Development'
    },
    {
      id: '4',
      title: 'Christmas Service Feedback',
      description: 'Special evaluation for Christmas service experience',
      type: 'Event',
      status: 'Completed',
      createdDate: '2023-12-26',
      responses: 298,
      averageRating: 4.9,
      questions: 8,
      targetAudience: 'All Attendees',
      category: 'Special Events'
    },
    {
      id: '5',
      title: 'Small Groups Effectiveness',
      description: 'Evaluation of small group ministry impact and satisfaction',
      type: 'Ministry',
      status: 'Draft',
      createdDate: '2024-01-20',
      responses: 0,
      averageRating: 0,
      questions: 14,
      targetAudience: 'Small Group Members',
      deadline: '2024-04-15',
      category: 'Discipleship'
    }
  ];

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || evaluation.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || evaluation.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: evaluations.length,
    active: evaluations.filter(e => e.status === 'Active').length,
    totalResponses: evaluations.reduce((sum, e) => sum + e.responses, 0),
    averageRating: evaluations.reduce((sum, e) => sum + e.averageRating, 0) / evaluations.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            Evaluations
          </h1>
          <p 
            className="mt-2 text-sm"
            style={{ color: themeConfig.colors.text, opacity: 0.7 }}
          >
            Create and manage evaluation forms for programs, events, and services
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              backgroundColor: themeConfig.colors.primary,
              borderColor: themeConfig.colors.primary
            }}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Evaluation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          className="overflow-hidden shadow rounded-lg"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon 
                  className="h-6 w-6" 
                  style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                  aria-hidden="true" 
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt 
                    className="text-sm font-medium truncate"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Total Evaluations
                  </dt>
                  <dd 
                    className="text-lg font-medium"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="overflow-hidden shadow rounded-lg"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt 
                    className="text-sm font-medium truncate"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Active Evaluations
                  </dt>
                  <dd 
                    className="text-lg font-medium"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {stats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="overflow-hidden shadow rounded-lg"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt 
                    className="text-sm font-medium truncate"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Total Responses
                  </dt>
                  <dd 
                    className="text-lg font-medium"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {stats.totalResponses.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="overflow-hidden shadow rounded-lg"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt 
                    className="text-sm font-medium truncate"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Average Rating
                  </dt>
                  <dd 
                    className="text-lg font-medium"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {stats.averageRating.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div 
        className="shadow rounded-lg p-6"
        style={{ backgroundColor: themeConfig.colors.secondary }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon 
                className="h-5 w-5"
                style={{ color: themeConfig.colors.text, opacity: 0.5 }}
                aria-hidden="true" 
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search evaluations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            style={{
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option value="All">All Types</option>
            <option value="Program">Program</option>
            <option value="Event">Event</option>
            <option value="Service">Service</option>
            <option value="Ministry">Ministry</option>
            <option value="Leadership">Leadership</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            style={{
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Evaluations List */}
      <div 
        className="shadow rounded-lg"
        style={{ backgroundColor: themeConfig.colors.secondary }}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredEvaluations.map((evaluation) => {
              const typeColor = getTypeColor(evaluation.type);
              const statusColor = getStatusColor(evaluation.status);
              
              return (
                <div
                  key={evaluation.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ 
                    borderColor: themeConfig.colors.divider,
                    backgroundColor: themeConfig.colors.background
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 
                          className="text-lg font-medium"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {evaluation.title}
                        </h3>
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: theme === 'midnight-prayer' ? typeColor.darkBg : typeColor.bg,
                            color: theme === 'midnight-prayer' ? typeColor.darkText : typeColor.text
                          }}
                        >
                          {evaluation.type}
                        </span>
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: theme === 'midnight-prayer' ? statusColor.darkBg : statusColor.bg,
                            color: theme === 'midnight-prayer' ? statusColor.darkText : statusColor.text
                          }}
                        >
                          {evaluation.status}
                        </span>
                      </div>
                      
                      <p 
                        className="mt-2 text-sm"
                        style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                      >
                        {evaluation.description}
                      </p>
                      
                      <div 
                        className="mt-3 flex flex-wrap gap-4 text-sm"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          Created: {new Date(evaluation.createdDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {evaluation.responses} responses
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          {evaluation.questions} questions
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {evaluation.averageRating > 0 ? evaluation.averageRating.toFixed(1) : 'No ratings'}
                        </div>
                        {evaluation.deadline && (
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            Deadline: {new Date(evaluation.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <span 
                          className="text-xs"
                          style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                        >
                          Target: {evaluation.targetAudience} • Category: {evaluation.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        className="p-2 hover:opacity-70"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-2 hover:opacity-70"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-2 hover:opacity-70"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-2 hover:opacity-70"
                        style={{ color: '#ef4444' }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Evaluation Modal placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div 
            className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider
            }}
          >
            <div className="mt-3">
              <h3 
                className="text-lg font-medium mb-4"
                style={{ color: themeConfig.colors.text }}
              >
                Create New Evaluation
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: themeConfig.colors.text, opacity: 0.7 }}
              >
                Evaluation form builder will be implemented here with drag-and-drop question types, 
                conditional logic, and response analytics.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-80"
                  style={{
                    color: themeConfig.colors.text,
                    backgroundColor: themeConfig.colors.divider
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                >
                  Create Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations;