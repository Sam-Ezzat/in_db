import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { evaluationService, Evaluation, Response } from '../../services/evaluationService';
import { 
  PencilIcon, 
  TrashIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const EvaluationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { themeConfig } = useTheme();
  
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEvaluation();
      loadResponses();
    }
  }, [id]);

  const loadEvaluation = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('Loading evaluation with ID:', id);
      const data = await evaluationService.getEvaluationById(id);
      console.log('Loaded evaluation:', data);
      
      if (!data) {
        setError('Evaluation not found');
        setEvaluation(null);
      } else {
        setEvaluation(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load evaluation');
      console.error('Error loading evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async () => {
    if (!id) return;
    
    try {
      const data = await evaluationService.getResponses(id);
      setResponses(data);
    } catch (err) {
      console.error('Failed to load responses:', err);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this evaluation? All questions and responses will be deleted.')) {
      return;
    }

    try {
      await evaluationService.deleteEvaluation(id);
      navigate('/evaluations');
    } catch (err) {
      alert('Failed to delete evaluation');
      console.error(err);
    }
  };

  const getStatusColor = (status: Evaluation['status']) => {
    const colors = {
      Active: { bg: '#10b981', text: '#fff' },
      Draft: { bg: '#6b7280', text: '#fff' },
      Completed: { bg: '#3b82f6', text: '#fff' },
      Archived: { bg: '#8b5cf6', text: '#fff' }
    };
    return colors[status];
  };

  const calculateAverageRating = () => {
    if (responses.length === 0) return 0;

    const ratingQuestions = evaluation?.questions.filter(q => q.type === 'rating') || [];
    if (ratingQuestions.length === 0) return 0;

    let totalRating = 0;
    let ratingCount = 0;

    responses.forEach(response => {
      response.answers.forEach(answer => {
        const question = ratingQuestions.find(q => q.id === answer.questionId);
        if (question && typeof answer.value === 'number') {
          totalRating += answer.value;
          ratingCount++;
        }
      });
    });

    return ratingCount > 0 ? totalRating / ratingCount : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: themeConfig.colors.text }}>Loading...</div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="text-center py-12">
        <p style={{ color: themeConfig.colors.text }}>{error || 'Evaluation not found'}</p>
        <Link
          to="/evaluations"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Evaluations
        </Link>
      </div>
    );
  }

  const statusColor = getStatusColor(evaluation.status);
  const averageRating = calculateAverageRating();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>
              {evaluation.title}
            </h1>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: statusColor.bg,
                color: statusColor.text
              }}
            >
              {evaluation.status}
            </span>
          </div>
          <p className="mt-2 text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            {evaluation.description}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to={`/evaluations/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
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
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Questions
                  </dt>
                  <dd className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                    {evaluation.questions.length}
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
                <UserGroupIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Responses
                  </dt>
                  <dd className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                    {responses.length}
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
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Avg Rating
                  </dt>
                  <dd className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                    {averageRating.toFixed(1)} / 5
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
                <CheckCircleIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    Required
                  </dt>
                  <dd className="text-lg font-medium" style={{ color: themeConfig.colors.text }}>
                    {evaluation.questions.filter(q => q.required).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Info */}
      <div 
        className="shadow rounded-lg p-6"
        style={{ backgroundColor: themeConfig.colors.secondary }}
      >
        <h2 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
          Details
        </h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              <TagIcon className="h-5 w-5 mr-2" />
              Type
            </dt>
            <dd className="mt-1 text-sm" style={{ color: themeConfig.colors.text }}>
              {evaluation.type}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              <TagIcon className="h-5 w-5 mr-2" />
              Category
            </dt>
            <dd className="mt-1 text-sm" style={{ color: themeConfig.colors.text }}>
              {evaluation.category}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Target Audience
            </dt>
            <dd className="mt-1 text-sm" style={{ color: themeConfig.colors.text }}>
              {evaluation.targetAudience}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              <CalendarIcon className="h-5 w-5 mr-2" />
              Created Date
            </dt>
            <dd className="mt-1 text-sm" style={{ color: themeConfig.colors.text }}>
              {new Date(evaluation.createdDate).toLocaleDateString()}
            </dd>
          </div>
          {evaluation.deadline && (
            <div>
              <dt className="text-sm font-medium flex items-center" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                <CalendarIcon className="h-5 w-5 mr-2" />
                Deadline
              </dt>
              <dd className="mt-1 text-sm" style={{ color: themeConfig.colors.text }}>
                {new Date(evaluation.deadline).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Questions */}
      <div 
        className="shadow rounded-lg p-6"
        style={{ backgroundColor: themeConfig.colors.secondary }}
      >
        <h2 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
          Questions ({evaluation.questions.length})
        </h2>
        <div className="space-y-4">
          {evaluation.questions.map((question, index) => (
            <div
              key={question.id}
              className="border-l-4 pl-4 py-2"
              style={{ borderColor: question.required ? '#3b82f6' : themeConfig.colors.divider }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    {index + 1}. {question.text}
                    {question.required && (
                      <span className="ml-2 text-red-500">*</span>
                    )}
                  </p>
                  <p className="text-xs mt-1" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
                    Type: {question.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  
                  {question.type === 'multiple_choice' && question.options && (
                    <ul className="mt-2 space-y-1">
                      {question.options.map((option, i) => (
                        <li key={i} className="text-sm ml-4" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                          • {option}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {question.type === 'scale' && (
                    <p className="text-sm mt-1" style={{ color: themeConfig.colors.text, opacity: 0.8 }}>
                      Scale: {question.scaleMin} - {question.scaleMax}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responses */}
      <div 
        className="shadow rounded-lg p-6"
        style={{ backgroundColor: themeConfig.colors.secondary }}
      >
        <h2 className="text-lg font-medium mb-4" style={{ color: themeConfig.colors.text }}>
          Responses ({responses.length})
        </h2>
        {responses.length === 0 ? (
          <p className="text-center py-8" style={{ color: themeConfig.colors.text, opacity: 0.6 }}>
            No responses yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: themeConfig.colors.divider }}>
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Respondent
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Submitted
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}
                  >
                    Answers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
                {responses.map((response) => (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {response.isAnonymous ? 'Anonymous' : response.respondentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {new Date(response.submittedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: themeConfig.colors.text }}>
                        {response.answers.length} answers
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDetail;
