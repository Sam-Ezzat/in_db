import React, { useState } from 'react';
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
    'Program': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
    'Event': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
    'Service': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
    'Ministry': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300' },
    'Leadership': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
  };
  return colors[type as keyof typeof colors] || { bg: 'bg-gray-50 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' };
};

const getStatusColor = (status: string) => {
  const colors = {
    'Active': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
    'Draft': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
    'Completed': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
    'Archived': { bg: 'bg-gray-50 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' },
  };
  return colors[status as keyof typeof colors] || { bg: 'bg-gray-50 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' };
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Create and manage evaluation forms for programs, events, and services
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Evaluation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Evaluations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Evaluations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Responses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalResponses.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.averageRating.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search evaluations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredEvaluations.map((evaluation) => {
              const typeColor = getTypeColor(evaluation.type);
              const statusColor = getStatusColor(evaluation.status);
              
              return (
                <div
                  key={evaluation.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {evaluation.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor.bg} ${typeColor.text}`}>
                          {evaluation.type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                          {evaluation.status}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {evaluation.description}
                      </p>
                      
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Target: {evaluation.targetAudience} • Category: {evaluation.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600">
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Create New Evaluation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Evaluation form builder will be implemented here with drag-and-drop question types, 
                conditional logic, and response analytics.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
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