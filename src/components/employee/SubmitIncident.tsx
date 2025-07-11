// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Send, AlertCircle, Zap, Clock, Users, FileText } from 'lucide-react';

// const SubmitIncident: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const categories = [
//     { 
//       value: 'it-support', 
//       label: 'IT Support',
//       description: 'Hardware, software, network issues',
//       icon: '💻',
//       color: 'bg-blue-50 border-blue-200 text-blue-700'
//     },
//     { 
//       value: 'hr', 
//       label: 'Human Resources',
//       description: 'Policy, benefits, workplace issues',
//       icon: '👥',
//       color: 'bg-green-50 border-green-200 text-green-700'
//     },
//     { 
//       value: 'facilities', 
//       label: 'Facilities',
//       description: 'Building, equipment, maintenance',
//       icon: '🏢',
//       color: 'bg-purple-50 border-purple-200 text-purple-700'
//     },
//     { 
//       value: 'security', 
//       label: 'Security',
//       description: 'Unauthorized access, theft, threats',
//       icon: '🔒',
//       color: 'bg-red-50 border-red-200 text-red-700'
//     },
//     { 
//       value: 'finance', 
//       label: 'Finance',
//       description: 'Budget issues, reimbursements, fraud',
//       icon: '💰',
//       color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
//     },
//     { 
//       value: 'health-safety', 
//       label: 'Health & Safety',
//       description: 'Injuries, hazards, compliance concerns',
//       icon: '🩺',
//       color: 'bg-pink-50 border-pink-200 text-pink-700'
//     },
//     { 
//       value: 'legal', 
//       label: 'Legal',
//       description: 'Compliance, legal risks, disputes',
//       icon: '⚖️',
//       color: 'bg-gray-50 border-gray-200 text-gray-700'
//     },
//     { 
//       value: 'other', 
//       label: 'Other',
//       description: 'Anything not covered above',
//       icon: '❓',
//       color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
//     }
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate brief validation
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     setIsSubmitting(false);
//     navigate('/employee/incident-confirmation', { 
//       state: { formData } 
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const selectedCategory = categories.find(cat => cat.value === formData.category);

//   return (
//     <div className="flex-1 overflow-auto">
//       <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-2xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-6 sm:mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 rounded-2xl shadow-lg">
//                 <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
//               </div>
//             </div>
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Submit Incident</h1>
//             <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Report an issue and get expert assistance</p>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//             {/* Progress Indicator */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-white/20 p-2 rounded-lg">
//                     <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm sm:text-base font-semibold">AI-Powered Processing</h3>
//                     <p className="text-xs sm:text-sm text-blue-100">Intelligent routing and priority assignment</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">             


//                 {/* Description Field */}
//               <div>
//                 <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                   Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   rows={6}
//                   required
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//                   placeholder="Please provide detailed information about the issue including:
// • What happened?
// • When did it occur?
// • Steps to reproduce
// • Error messages (if any)
// • Impact on your work"
//                 />
//                 <div className="mt-2 text-xs sm:text-sm text-gray-500">
//                   {formData.description.length}/500 characters
//                 </div>
//               </div>


//               {/* Category Display (Horizontally Scrollable, Themed Scrollbar) */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                   Available Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2
//                             scrollbar-thin 
//                             scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-600 
//                             scrollbar-track-gray-100 dark:scrollbar-track-gray-100
//                           ">
//                   {categories.map(category => (
//                     <div
//                       key={category.value}
//                       className={`relative min-w-[220px] sm:min-w-[240px] rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500`}
//                     >
//                       <div className="text-center">
//                         <div className="text-xl sm:text-2xl mb-2">{category.icon}</div>
//                         <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{category.label}</h3>
//                         <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>



//               {/* AI Features Info */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
//                 <div className="flex items-start space-x-3 sm:space-x-4">
//                   <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 sm:p-3 rounded-xl">
//                     <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">AI-Enhanced Processing</h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
//                       <div className="flex items-center space-x-2">
//                         <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                         <span className="text-gray-700 dark:text-gray-300">Automatic priority detection</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                         <span className="text-gray-700 dark:text-gray-300">Smart team assignment</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                         <span className="text-gray-700 dark:text-gray-300">Issue categorization</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                         <span className="text-gray-700 dark:text-gray-300">Solution suggestions</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/employee')}
//                   className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting ||  !formData.description }
//                   className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 font-medium shadow-lg text-sm sm:text-base"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
//                       <span>Processing with AI...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 sm:h-5 sm:w-5" />
//                       <span>Continue</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitIncident;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, Zap, Clock, Users, FileText } from 'lucide-react';
import { submitIncident } from '../../api/incidentApi';
import { useAuth } from '../../contexts/AuthContext';

const SubmitIncident: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    },
    { 
      value: 'security', 
      label: 'Security',
      description: 'Unauthorized access, theft, threats',
      icon: '🔒',
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    { 
      value: 'finance', 
      label: 'Finance',
      description: 'Budget issues, reimbursements, fraud',
      icon: '💰',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    },
    { 
      value: 'health-safety', 
      label: 'Health & Safety',
      description: 'Injuries, hazards, compliance concerns',
      icon: '🩺',
      color: 'bg-pink-50 border-pink-200 text-pink-700'
    },
    { 
      value: 'legal', 
      label: 'Legal',
      description: 'Compliance, legal risks, disputes',
      icon: '⚖️',
      color: 'bg-gray-50 border-gray-200 text-gray-700'
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'Anything not covered above',
      icon: '❓',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
  ];
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitIncident({ description: formData.description });
      console.log('Incident submitted successfully:', response); // Debugging log
      navigate('/employee/incident-confirmation', {
        state: {
          formData: {
            description: formData.description,
            reportedBy: {
              email: user?.email,
              name: user?.name,
              id: user?.id,
            },
            apiResponse: response,
          },
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit incident. Please try again.');
      console.error('Submit incident error:', err); // Debugging log
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 rounded-2xl shadow-lg">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Submit Incident</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Report an issue and get expert assistance</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
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
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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

{/* Category Display (Horizontally Scrollable, No Selection) */}
<div>
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
    Available Category <span className="text-red-500">*</span>
  </label>
  <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
    {categories.map(category => (
      <div
        key={category.value}
        className={`relative min-w-[220px] sm:min-w-[240px] rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500`}
      >
        <div className="text-center">
          <div className="text-xl sm:text-2xl mb-2">{category.icon}</div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{category.label}</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>


              {/* AI Features Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 sm:p-3 rounded-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">AI-Enhanced Processing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Automatic priority detection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Smart team assignment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Issue categorization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Solution suggestions</span>
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
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.description}
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
                      <span>Continue</span>
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