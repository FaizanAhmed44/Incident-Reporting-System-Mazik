import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, Zap, Clock, Users, FileText } from 'lucide-react';

const SubmitIncident: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { 
      value: 'it-support', 
      label: 'IT Support',
      description: 'Hardware, software, network issues',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    { 
      value: 'hr', 
      label: 'Human Resources',
      description: 'Policy, benefits, workplace issues',
      icon: '👥',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    { 
      value: 'facilities', 
      label: 'Facilities',
      description: 'Building, equipment, maintenance',
      icon: '🏢',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock ticket ID
    const ticketId = `INC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    setIsSubmitting(false);
    navigate(`/employee/confirmation/${ticketId}`, { 
      state: { formData, ticketId } 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 rounded-2xl shadow-lg">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Submit Incident</h1>
            <p className="text-base sm:text-lg text-gray-600">Report an issue and get expert assistance</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Progress Indicator */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">AI-Powered Processing</h3>
                    <p className="text-xs sm:text-sm text-blue-100">Intelligent routing and priority assignment</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description of the issue"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {categories.map(category => (
                    <label
                      key={category.value}
                      className={`relative cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${
                        formData.category === category.value
                          ? category.color
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl mb-2">{category.icon}</div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{category.label}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                      </div>
                      {formData.category === category.value && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-blue-600 rounded-full p-1">
                            <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Please provide detailed information about the issue including:
• What happened?
• When did it occur?
• Steps to reproduce
• Error messages (if any)
• Impact on your work"
                />
                <div className="mt-2 text-xs sm:text-sm text-gray-500">
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* AI Features Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-100 p-2.5 sm:p-3 rounded-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">AI-Enhanced Processing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700">Automatic priority detection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700">Smart team assignment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700">Issue categorization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700">Solution suggestions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/employee')}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 font-medium shadow-lg text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Generate Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitIncident;