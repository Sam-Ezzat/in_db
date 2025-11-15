import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
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
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import KPIEvaluations from '../KPIs/KPIEvaluations';
import { evaluationService, Evaluation, EvaluationStatistics } from '../../services/evaluationService';

const Evaluations: React.FC = () => {
  const { themeConfig, theme } = useTheme();
  
  // Theme-aware color functions
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
  
  const [activeTab, setActiveTab] = useState<'surveys' | 'kpis'>('surveys');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [statistics, setStatistics] = useState<EvaluationStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, [searchTerm, selectedType, selectedStatus]);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const [evalData, statsData] = await Promise.all([
        evaluationService.getEvaluations({
          type: selectedType !== 'All' ? selectedType as any : undefined,
          status: selectedStatus !== 'All' ? selectedStatus as any : undefined,
          search: searchTerm || undefined
        }),
        evaluationService.getStatistics()
      ]);
      setEvaluations(evalData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this evaluation? All questions and responses will be deleted.')) {
      return;
    }

    try {
      await evaluationService.deleteEvaluation(id);
      loadEvaluations();
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      alert('Failed to delete evaluation');
    }
  };

  const filteredEvaluations = evaluations;

  const statsData = statistics ? [
    { 
      title: 'Total Evaluations', 
      value: statistics.totalEvaluations, 
      icon: DocumentTextIcon,
      color: '#3b82f6',
      darkColor: '#60a5fa'
    },
    { 
      title: 'Active Surveys', 
      value: statistics.activeEvaluations, 
      icon: CheckCircleIcon,
      color: '#10b981',
      darkColor: '#34d399'
    },
    { 
      title: 'Total Responses', 
      value: statistics.totalResponses, 
      icon: UserGroupIcon,
      color: '#8b5cf6',
      darkColor: '#a78bfa'
    },
    { 
      title: 'Average Rating', 
      value: statistics.averageRating.toFixed(1), 
      icon: ChartBarIcon,
      color: '#f59e0b',
      darkColor: '#fbbf24',
      suffix: '/5'
    }
  ] : [];

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
          <Link 
            to="/evaluations/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Evaluation
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="border-b"
        style={{ borderColor: themeConfig.colors.divider }}
      >
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('surveys')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'surveys'
                ? 'border-indigo-500'
                : 'border-transparent'
            }`}
            style={{
              color: activeTab === 'surveys' ? themeConfig.colors.primary : themeConfig.colors.text,
              opacity: activeTab === 'surveys' ? 1 : 0.6
            }}
          >
            <DocumentTextIcon className="w-5 h-5 inline-block mr-2 -mt-1" />
            Survey Evaluations
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'kpis'
                ? 'border-indigo-500'
                : 'border-transparent'
            }`}
            style={{
              color: activeTab === 'kpis' ? themeConfig.colors.primary : themeConfig.colors.text,
              opacity: activeTab === 'kpis' ? 1 : 0.6
            }}
          >
            <ChartBarIcon className="w-5 h-5 inline-block mr-2 -mt-1" />
            KPI Evaluations
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'kpis' ? (
        <KPIEvaluations />
      ) : (
        <>
      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-8" style={{ color: themeConfig.colors.text }}>
          Loading...
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className="overflow-hidden shadow rounded-lg"
            style={{ backgroundColor: themeConfig.colors.secondary }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon 
                    className="h-6 w-6" 
                    style={{ color: theme === 'dark' ? stat.darkColor : stat.color }}
                    aria-hidden="true" 
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt 
                      className="text-sm font-medium truncate"
                      style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                    >
                      {stat.title}
                    </dt>
                    <dd 
                      className="text-lg font-medium"
                      style={{ color: themeConfig.colors.text }}
                    >
                      {stat.value}{stat.suffix || ''}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

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
                          {evaluation.responses.length} responses
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          {evaluation.questions.length} questions
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {(() => {
                            const ratingQuestions = evaluation.questions.filter(q => q.type === 'rating');
                            if (ratingQuestions.length === 0 || evaluation.responses.length === 0) return 'No ratings';
                            let total = 0, count = 0;
                            evaluation.responses.forEach(r => {
                              r.answers.forEach(a => {
                                if (ratingQuestions.find(q => q.id === a.questionId) && typeof a.value === 'number') {
                                  total += a.value;
                                  count++;
                                }
                              });
                            });
                            return count > 0 ? (total / count).toFixed(1) : 'No ratings';
                          })()}
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
                      <Link 
                        to={`/evaluations/${evaluation.id}`}
                        className="p-2 hover:opacity-70"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link 
                        to={`/evaluations/${evaluation.id}/edit`}
                        className="p-2 hover:opacity-70"
                        style={{ color: themeConfig.colors.text, opacity: 0.6 }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(evaluation.id)}
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
        </>
      )}
    </div>
  );
};

export default Evaluations;