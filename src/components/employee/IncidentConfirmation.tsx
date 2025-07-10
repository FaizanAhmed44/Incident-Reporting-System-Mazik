// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Edit3, RefreshCw, CheckCircle, User, Mail, Building, FileText, Zap, ArrowLeft, Save, X } from 'lucide-react';

// interface LocationState {
//   formData: {
//     title: string;
//     description: string;
//     category: string;
//   };
// }

// interface ProcessedData {
//   staffId: string;
//   staffName: string;
//   email: string;
//   department: string;
//   category: string;
//   title: string;
//   description: string;
//   summary: string;
//   priority: string;
//   estimatedResolution: string;
// }

// const IncidentConfirmation: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const state = location.state as LocationState;
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
//   const [editableData, setEditableData] = useState<Partial<ProcessedData>>({});

//   // Simulate AI processing on component mount
//   useEffect(() => {
//     if (state?.formData) {
//       processIncidentData();
//     }
//   }, [state]);

//   const processIncidentData = async () => {
//     setIsProcessing(true);
    
//     // Simulate AI processing delay
//     await new Promise(resolve => setTimeout(resolve, 2500));
    
//     // Mock AI-processed data
//     const mockProcessedData: ProcessedData = {
//       staffId: 'EMP-2024-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
//       staffName: 'John Employee',
//       email: 'john.employee@company.com',
//       department: getDepartmentFromCategory(state.formData.category),
//       category: getCategoryLabel(state.formData.category),
//       title: state.formData.title,
//       description: state.formData.description,
//       summary: generateAISummary(state.formData),
//       priority: generatePriority(state.formData),
//       estimatedResolution: generateEstimatedResolution(state.formData.category)
//     };
    
//     setProcessedData(mockProcessedData);
//     setEditableData(mockProcessedData);
//     setIsProcessing(false);
//   };

//   const getDepartmentFromCategory = (category: string) => {
//     const departments = {
//       'it-support': 'Information Technology',
//       'hr': 'Human Resources',
//       'facilities': 'Facilities Management'
//     };
//     return departments[category as keyof typeof departments] || 'General';
//   };

//   const getCategoryLabel = (category: string) => {
//     const labels = {
//       'it-support': 'IT Support',
//       'hr': 'Human Resources',
//       'facilities': 'Facilities'
//     };
//     return labels[category as keyof typeof labels] || category;
//   };

//   const generateAISummary = (formData: any) => {
//     const summaries = {
//       'it-support': `Technical issue requiring IT intervention. System analysis indicates ${formData.title.toLowerCase()} affecting user productivity. Recommended for immediate technical review.`,
//       'hr': `Human resources matter requiring policy review and guidance. Issue categorized as ${formData.title.toLowerCase()} with potential impact on employee relations.`,
//       'facilities': `Facilities management request for ${formData.title.toLowerCase()}. Physical infrastructure assessment required for optimal workplace environment.`
//     };
//     return summaries[formData.category as keyof typeof summaries] || 'General incident requiring departmental review and resolution.';
//   };

//   const generatePriority = (formData: any) => {
//     const keywords = formData.title.toLowerCase() + ' ' + formData.description.toLowerCase();
//     if (keywords.includes('urgent') || keywords.includes('critical') || keywords.includes('down') || keywords.includes('emergency')) {
//       return 'High';
//     } else if (keywords.includes('slow') || keywords.includes('issue') || keywords.includes('problem')) {
//       return 'Medium';
//     }
//     return 'Low';
//   };

//   const generateEstimatedResolution = (category: string) => {
//     const resolutions = {
//       'it-support': '2-4 business hours',
//       'hr': '1-2 business days',
//       'facilities': '4-8 business hours'
//     };
//     return resolutions[category as keyof typeof resolutions] || '1-3 business days';
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     if (processedData) {
//       setProcessedData({ ...processedData, ...editableData });
//     }
//     setIsEditing(false);
//   };

//   const handleCancelEdit = () => {
//     if (processedData) {
//       setEditableData(processedData);
//     }
//     setIsEditing(false);
//   };

//   const handleRegenerate = () => {
//     processIncidentData();
//   };

//   const handleConfirm = () => {
//     if (processedData) {
//       const ticketId = `INC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
//       navigate(`/employee/confirmation/${ticketId}`, { 
//         state: { 
//           formData: {
//             title: processedData.title,
//             description: processedData.description,
//             category: state.formData.category
//           }, 
//           ticketId,
//           processedData 
//         } 
//       });
//     }
//   };

//   const handleInputChange = (field: keyof ProcessedData, value: string) => {
//     setEditableData(prev => ({ ...prev, [field]: value }));
//   };

//   if (isProcessing) {
//     return (
//       <div className="flex-1 overflow-auto">
//         <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
//           <div className="text-center max-w-md">
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl shadow-2xl">
//                   <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-pulse" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 p-1.5 rounded-full shadow-lg animate-spin">
//                   <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
//                 </div>
//               </div>
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Your Incident</h2>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">AI is analyzing your request and generating details...</p>
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
//             </div>
//             <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">This may take a few moments...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!processedData) {
//     return (
//       <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 dark:text-gray-300">No incident data available</p>
//           <button
//             onClick={() => navigate('/employee/submit')}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-auto">
//       <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center space-x-4 mb-6 sm:mb-8">
//             <button
//               onClick={() => navigate('/employee/submit')}
//               className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
//             </button>
//             <div>
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Confirm Incident Details</h1>
//               <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Review AI-processed information before submission</p>
//             </div>
//           </div>

//           <div className="space-y-6 sm:space-y-8">
//             {/* AI Processing Status */}
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 sm:p-6">
//               <div className="flex items-center space-x-3 sm:space-x-4">
//                 <div className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl">
//                   <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">AI Processing Complete</h3>
//                   <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Your incident has been analyzed and categorized</p>
//                 </div>
//               </div>
//             </div>

//             {/* Staff Information */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3 sm:space-x-4">
//                     <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
//                       <User className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </div>
//                     <div>
//                       <h2 className="text-lg sm:text-xl font-bold">Staff Information</h2>
//                       <p className="text-blue-100 text-sm sm:text-base">Verified employee details</p>
//                     </div>
//                   </div>
//                   {!isEditing && (
//                     <button
//                       onClick={handleEdit}
//                       className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
//                     >
//                       <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
//                       <span>Edit</span>
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4 sm:p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Staff ID</label>
//                       <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                         <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.staffId}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Staff Name</label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={editableData.staffName || ''}
//                           onChange={(e) => handleInputChange('staffName', e.target.value)}
//                           className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                           <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                           <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.staffName}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
//                       {isEditing ? (
//                         <input
//                           type="email"
//                           value={editableData.email || ''}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                           className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                           <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                           <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.email}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department</label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={editableData.department || ''}
//                           onChange={(e) => handleInputChange('department', e.target.value)}
//                           className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                           <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                           <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.department}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</label>
//                       <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                         <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.category}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Priority</label>
//                       <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <div className={`w-3 h-3 rounded-full ${
//                           processedData.priority === 'High' ? 'bg-red-500' :
//                           processedData.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
//                         }`}></div>
//                         <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{processedData.priority}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {isEditing && (
//                   <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//                     <button
//                       onClick={handleCancelEdit}
//                       className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
//                     >
//                       <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                       <span>Cancel</span>
//                     </button>
//                     <button
//                       onClick={handleSaveEdit}
//                       className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//                     >
//                       <Save className="h-3 w-3 sm:h-4 sm:w-4" />
//                       <span>Save Changes</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* AI Summary */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
//               <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
//                 <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2.5 sm:p-3 rounded-xl">
//                   <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">AI-Generated Summary</h3>
//                   <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Intelligent analysis of your incident</p>
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
//                 <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">{processedData.summary}</p>
//                 <div className="mt-3 flex items-center justify-between">
//                   <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
//                     Estimated Resolution: {processedData.estimatedResolution}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <button
//                 onClick={handleRegenerate}
//                 disabled={isProcessing}
//                 className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base"
//               >
//                 <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isProcessing ? 'animate-spin' : ''}`} />
//                 <span>Regenerate</span>
//               </button>
              
//               <button
//                 onClick={handleConfirm}
//                 className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base"
//               >
//                 <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
//                 <span>Confirm & Submit</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncidentConfirmation;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Edit3,
  RefreshCw,
  CheckCircle,
  User,
  Mail,
  Building,
  FileText,
  Zap,
  ArrowLeft,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
// NEW: Import the API function and payload type from your api file
import {
  confirmIncident,
  IncidentConfirmationPayload,
} from "../../api/incidentApi";

interface LocationState {
  formData: {
    title: string;
    description: string;
    category: string;
  };
}

interface ProcessedData {
  staffId: string;
  staffName: string;
  email: string;
  department: string;
  category: string;
  title: string;
  description: string;
  summary: string;
  priority: string;
  estimatedResolution: string;
}

const IncidentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [editableData, setEditableData] = useState<Partial<ProcessedData>>({});

  // --- NEW STATE for submission handling ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Simulate AI processing on component mount (No changes here)
  useEffect(() => {
    if (state?.formData) {
      processIncidentData();
    }
  }, [state]);

  const processIncidentData = async () => {
    // ... (no changes in this function)
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const mockProcessedData: ProcessedData = {
      staffId:
        "EMP-2024-" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0"),
      staffName: "John Employee",
      email: "john.employee@company.com",
      department: getDepartmentFromCategory(state.formData.category), //hardcoded for demo
      category: getCategoryLabel(state.formData.category),
      title: state.formData.title,
      description: state.formData.description,
      summary: generateAISummary(state.formData),
      priority: generatePriority(state.formData),
      estimatedResolution: generateEstimatedResolution(state.formData.category),
    };
    setProcessedData(mockProcessedData);
    setEditableData(mockProcessedData);
    setIsProcessing(false);
  };

  // --- All helper functions (getDepartmentFromCategory, etc.) remain the same ---
  const getDepartmentFromCategory = (category: string) => {
    /* ... no changes ... */ return (
      {
        "it-support": "Information Technology",
        hr: "Human Resources",
        facilities: "Facilities Management",
      }[category as "it-support"] || "General"
    );
  };
  const getCategoryLabel = (category: string) => {
    /* ... no changes ... */ return (
      {
        "it-support": "IT Support",
        hr: "Human Resources",
        facilities: "Facilities",
      }[category as "it-support"] || category
    );
  };
  const generateAISummary = (formData: any) => {
    /* ... no changes ... */ return (
      {
        "it-support": `Technical issue requiring IT intervention. System analysis indicates ${formData.title.toLowerCase()} affecting user productivity. Recommended for immediate technical review.,
        hr: Human resources matter requiring policy review and guidance. Issue categorized as ${formData.title.toLowerCase()} with potential impact on employee relations.,
        facilities: Facilities management request for ${formData.title.toLowerCase()}. Physical infrastructure assessment required for optimal workplace environment.`,
      }[formData.category as "it-support"] ||
      "General incident requiring departmental review and resolution."
    );
  };
  const generatePriority = (formData: any) => {
    /* ... no changes ... */ const keywords =
      formData.title.toLowerCase() + " " + formData.description.toLowerCase();
    if (
      keywords.includes("urgent") ||
      keywords.includes("critical") ||
      keywords.includes("down") ||
      keywords.includes("emergency")
    ) {
      return "High";
    } else if (
      keywords.includes("slow") ||
      keywords.includes("issue") ||
      keywords.includes("problem")
    ) {
      return "Medium";
    }
    return "Low";
  };
  const generateEstimatedResolution = (category: string) => {
    /* ... no changes ... */ return (
      {
        "it-support": "2-4 business hours",
        hr: "1-2 business days",
        facilities: "4-8 business hours",
      }[category as "it-support"] || "1-3 business days"
    );
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSaveEdit = () => {
    if (processedData) {
      setProcessedData({ ...processedData, ...editableData });
    }
    setIsEditing(false);
  };
  const handleCancelEdit = () => {
    if (processedData) {
      setEditableData(processedData);
    }
    setIsEditing(false);
  };
  const handleRegenerate = () => {
    processIncidentData();
  };
  const handleInputChange = (field: keyof ProcessedData, value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // --- MODIFIED: This is the main change ---
  const handleConfirm = async () => {
    if (!processedData) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    // 1. Construct the payload from the data on screen
    // NOTE: Some values are placeholders as they are not in your 'processedData'
    const payload: IncidentConfirmationPayload = {
      incident: {
        Description: processedData.description,
        Status: "New", // A more appropriate status for a new incident
        DepartmentType: processedData.department,
        // These GUIDs would ideally come from user context or AI response
        AssignedResolverGUID: "848cea09-9c37-4f3f-96fc-9f0e892a4143", // Placeholder
        ReportedByGUID: "da6cee8a-855b-4dee-a068-130428417297", // Placeholder, should be the logged-in user's ID
      },
      ai_response: {
        SuggestedDesc: processedData.summary,
        // Generating a mock email since it's not in processedData
        SuggestedEmail: `Dear Team,\n\nThe incident regarding "${processedData.title}" has been submitted. The issue is classified as ${processedData.priority} priority and assigned to the ${processedData.department} department.\n\nBest regards,\nIncident Management System`,
        SuggestedResolverGUID: "848cea09-9c37-4f3f-96fc-9f0e892a4143", // Placeholder
        SuggestionSeverity: processedData.priority,
      },
    };

    try {
      // 2. Call the API
      const response = await confirmIncident(payload);
      const ticketId = `INC-${Date.now().toString().slice(-5)}`;

      // 3. On success, navigate to the next page, passing the URL from the API response
      navigate(`/employee/confirmation/${ticketId}`, {
        state: {
          formData: {
            title: processedData.title,
            description: processedData.description,
            category: state.formData.category,
          },
          ticketId,
          processedData,
          confirmationUrl: response.url, // Pass the new URL to the next screen
        },
      });
    } catch (err: any) {
      // 4. On failure, set the error state to display a message
      setSubmissionError(
        err.message || "Failed to submit incident. Please try again."
      );
    } finally {
      // 5. Stop the loading indicator
      setIsSubmitting(false);
    }
  };

  // --- No changes to the JSX rendering for loading/empty states ---
  if (isProcessing) {
    /* ... no changes ... */ return (
      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl shadow-2xl">
                  <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 p-1.5 rounded-full shadow-lg animate-spin">
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Processing Your Incident
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
              AI is analyzing your request and generating details...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!processedData) {
    /* ... no changes ... */ return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No incident data available
          </p>
          <button
            onClick={() => navigate("/employee/submit")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- JSX with minor modifications for button state and error display ---
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* ... Header and other sections have no changes ... */}
          <div className="flex items-center space-x-4 mb-6 sm:mb-8">
            {" "}
            <button
              onClick={() => navigate("/employee/submit")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {" "}
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />{" "}
            </button>{" "}
            <div>
              {" "}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Confirm Incident Details
              </h1>{" "}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Review AI-processed information before submission
              </p>{" "}
            </div>{" "}
          </div>
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 sm:p-6">
              {" "}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {" "}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl">
                  {" "}
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    AI Processing Complete
                  </h3>{" "}
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Your incident has been analyzed and categorized
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {" "}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {" "}
                    <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
                      {" "}
                      <User className="h-5 w-5 sm:h-6 sm:w-6" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h2 className="text-lg sm:text-xl font-bold">
                        Staff Information
                      </h2>{" "}
                      <p className="text-blue-100 text-sm sm:text-base">
                        Verified employee details
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      {" "}
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      <span>Edit</span>{" "}
                    </button>
                  )}{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-4 sm:p-6">
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {" "}
                  <div className="space-y-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Staff ID
                      </label>{" "}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {" "}
                        <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {processedData.staffId}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Staff Name
                      </label>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableData.staffName || ""}
                          onChange={(e) =>
                            handleInputChange("staffName", e.target.value)
                          }
                          className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {" "}
                          <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                            {processedData.staffName}
                          </span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Email Address
                      </label>{" "}
                      {isEditing ? (
                        <input
                          type="email"
                          value={editableData.email || ""}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {" "}
                          <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                            {processedData.email}
                          </span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="space-y-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Department
                      </label>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableData.department || ""}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {" "}
                          <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                            {processedData.department}
                          </span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Category
                      </label>{" "}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {" "}
                        <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {processedData.category}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Priority
                      </label>{" "}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {" "}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            processedData.priority === "High"
                              ? "bg-red-500"
                              : processedData.priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>{" "}
                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {processedData.priority}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    {" "}
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      {" "}
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      <span>Cancel</span>{" "}
                    </button>{" "}
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      {" "}
                      <Save className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      <span>Save Changes</span>{" "}
                    </button>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              {" "}
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                {" "}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2.5 sm:p-3 rounded-xl">
                  {" "}
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Generated Summary
                  </h3>{" "}
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Intelligent analysis of your incident
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                {" "}
                <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                  {processedData.summary}
                </p>{" "}
                <div className="mt-3 flex items-center justify-between">
                  {" "}
                  <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
                    {" "}
                    Estimated Resolution: {
                      processedData.estimatedResolution
                    }{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>

            {/* --- NEW: Error message display --- */}
            {submissionError && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center"
                role="alert"
              >
                <AlertTriangle className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-bold">Submission Failed</p>
                  <p>{submissionError}</p>
                </div>
              </div>
            )}

            {/* --- MODIFIED: Action Buttons with loading/disabled state --- */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleRegenerate}
                disabled={isProcessing || isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base"
              >
                <RefreshCw
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isProcessing ? "animate-spin" : ""
                  }`}
                />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>
                  {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentConfirmation;