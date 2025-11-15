import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { evaluationService, Evaluation, Question } from '../../services/evaluationService';
import { 
  PlusIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const EvaluationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeConfig } = useTheme();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Program' as Evaluation['type'],
    status: 'Draft' as Evaluation['status'],
    category: '',
    targetAudience: '',
    deadline: ''
  });

  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadEvaluation(id);
    }
  }, [id, isEdit]);

  const loadEvaluation = async (evaluationId: string) => {
    try {
      setLoading(true);
      console.log('Loading evaluation for edit with ID:', evaluationId);
      const evaluation = await evaluationService.getEvaluationById(evaluationId);
      console.log('Loaded evaluation for edit:', evaluation);
      
      if (evaluation) {
        setFormData({
          title: evaluation.title,
          description: evaluation.description,
          type: evaluation.type,
          status: evaluation.status,
          category: evaluation.category,
          targetAudience: evaluation.targetAudience,
          deadline: evaluation.deadline ? (typeof evaluation.deadline === 'string' ? evaluation.deadline : evaluation.deadline.toISOString().split('T')[0]) : ''
        });
        setQuestions(evaluation.questions || []);
        setError(null);
      } else {
        setError('Evaluation not found');
      }
    } catch (err) {
      setError('Failed to load evaluation');
      console.error('Error loading evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const evaluationData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined
      };

      if (isEdit && id) {
        await evaluationService.updateEvaluation(id, evaluationData);
        
        // Update questions
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          if (question.id) {
            await evaluationService.updateQuestion(question.id, {
              ...question as Question,
              order: i + 1
            });
          } else {
            await evaluationService.createQuestion(id, {
              ...question as Omit<Question, 'id'>,
              evaluationId: id,
              order: i + 1
            });
          }
        }
      } else {
        const newEvaluation = await evaluationService.createEvaluation(evaluationData);
        
        // Create questions
        for (let i = 0; i < questions.length; i++) {
          await evaluationService.createQuestion(newEvaluation.id, {
            ...questions[i] as Omit<Question, 'id'>,
            evaluationId: newEvaluation.id,
            order: i + 1
          });
        }
      }

      navigate('/evaluations');
    } catch (err) {
      setError('Failed to save evaluation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'text',
        text: '',
        required: false,
        order: questions.length + 1
      }
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setQuestions(updated);
  };

  const questionTypes: Question['type'][] = [
    'text',
    'multiple_choice',
    'rating',
    'yes_no',
    'scale'
  ];

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: themeConfig.colors.text }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: themeConfig.colors.text }}>
          {isEdit ? 'Edit Evaluation' : 'Create Evaluation'}
        </h1>
        <p className="mt-2 text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          {isEdit ? 'Update evaluation details and questions' : 'Create a new evaluation form'}
        </p>
      </div>

      {error && (
        <div 
          className="rounded-md p-4 border" 
          style={{ 
            backgroundColor: '#fee2e2', 
            borderColor: '#ef4444',
            color: '#991b1b' 
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div 
          className="shadow rounded-lg p-6"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <h2 
            className="text-lg font-medium mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Evaluation['type'] })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                required
              >
                <option value="Program">Program</option>
                <option value="Event">Event</option>
                <option value="Service">Service</option>
                <option value="Ministry">Ministry</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>

            <div>
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Evaluation['status'] })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                placeholder="e.g., Worship, Youth Ministry"
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Target Audience *
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
                placeholder="e.g., All Congregants"
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium"
                style={{ color: themeConfig.colors.text }}
              >
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="mt-1 block w-full rounded-md shadow-sm px-3 py-2 border"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  borderColor: themeConfig.colors.divider
                }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div 
          className="shadow rounded-lg p-6"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-medium"
              style={{ color: themeConfig.colors.text }}
            >
              Questions
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <p 
              className="text-center py-8"
              style={{ color: themeConfig.colors.text, opacity: 0.6 }}
            >
              No questions yet. Click "Add Question" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4"
                  style={{ borderColor: themeConfig.colors.divider }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: themeConfig.colors.text }}
                      >
                        Question {index + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                          style={{ color: themeConfig.colors.text }}
                        >
                          <ChevronUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                          style={{ color: themeConfig.colors.text }}
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(index)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label 
                        className="block text-sm font-medium mb-1"
                        style={{ color: themeConfig.colors.text }}
                      >
                        Question Text *
                      </label>
                      <input
                        type="text"
                        value={question.text || ''}
                        onChange={(e) => updateQuestion(index, { text: e.target.value })}
                        className="block w-full rounded-md shadow-sm px-3 py-2 border"
                        style={{
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text,
                          borderColor: themeConfig.colors.divider
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1"
                        style={{ color: themeConfig.colors.text }}
                      >
                        Question Type *
                      </label>
                      <select
                        value={question.type || 'text'}
                        onChange={(e) => updateQuestion(index, { 
                          type: e.target.value as Question['type'],
                          options: e.target.value === 'multiple_choice' ? [''] : undefined,
                          scaleMin: e.target.value === 'scale' ? 1 : undefined,
                          scaleMax: e.target.value === 'scale' ? 5 : undefined
                        })}
                        className="block w-full rounded-md shadow-sm px-3 py-2 border"
                        style={{
                          backgroundColor: themeConfig.colors.background,
                          color: themeConfig.colors.text,
                          borderColor: themeConfig.colors.divider
                        }}
                        required
                      >
                        {questionTypes.map(type => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={question.required || false}
                        onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                        className="h-4 w-4 rounded"
                      />
                      <label 
                        className="ml-2 text-sm"
                        style={{ color: themeConfig.colors.text }}
                      >
                        Required
                      </label>
                    </div>

                    {/* Multiple Choice Options */}
                    {question.type === 'multiple_choice' && (
                      <div className="sm:col-span-2">
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: themeConfig.colors.text }}
                        >
                          Options
                        </label>
                        <div className="space-y-2">
                          {(question.options || ['']).map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [''])];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(index, { options: newOptions });
                                }}
                                className="flex-1 rounded-md shadow-sm px-3 py-2 border"
                                style={{
                                  backgroundColor: themeConfig.colors.background,
                                  color: themeConfig.colors.text,
                                  borderColor: themeConfig.colors.divider
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              {optIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = question.options?.filter((_, i) => i !== optIndex);
                                    updateQuestion(index, { options: newOptions });
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              updateQuestion(index, { 
                                options: [...(question.options || ['']), ''] 
                              });
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Scale Min/Max */}
                    {question.type === 'scale' && (
                      <>
                        <div>
                          <label 
                            className="block text-sm font-medium mb-1"
                            style={{ color: themeConfig.colors.text }}
                          >
                            Min Value
                          </label>
                          <input
                            type="number"
                            value={question.scaleMin || 1}
                            onChange={(e) => updateQuestion(index, { scaleMin: parseInt(e.target.value) })}
                            className="block w-full rounded-md shadow-sm px-3 py-2 border"
                            style={{
                              backgroundColor: themeConfig.colors.background,
                              color: themeConfig.colors.text,
                              borderColor: themeConfig.colors.divider
                            }}
                          />
                        </div>
                        <div>
                          <label 
                            className="block text-sm font-medium mb-1"
                            style={{ color: themeConfig.colors.text }}
                          >
                            Max Value
                          </label>
                          <input
                            type="number"
                            value={question.scaleMax || 5}
                            onChange={(e) => updateQuestion(index, { scaleMax: parseInt(e.target.value) })}
                            className="block w-full rounded-md shadow-sm px-3 py-2 border"
                            style={{
                              backgroundColor: themeConfig.colors.background,
                              color: themeConfig.colors.text,
                              borderColor: themeConfig.colors.divider
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/evaluations')}
            className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium"
            style={{
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text,
              backgroundColor: themeConfig.colors.secondary
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Evaluation' : 'Create Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
