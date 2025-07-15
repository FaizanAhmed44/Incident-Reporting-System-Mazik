import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, Users, Zap, ArrowRight, Star, Shield, Target } from 'lucide-react';

interface LocationState {
  formData: {
    description: string;
    reportedBy: {
      email: string;
      name: string;
      id: string;
    };
  };
  ticketId: string;
  processedData: {
    staffId: string;
    staffName: string;
    email: string;
    department: string;
    category: string;
    description: string;
    summary: string;
    priority: string;
    staffEmail: string;
    staffSkillset: string;
    reportedByEmail: string;
    reportedByName: string;
    reportedById: string;
  };
  confirmationUrl: string;
}

const TicketConfirmation: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  // Fallback if no state is provided
  if (!state?.processedData) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No confirmation data available</p>
          <Link
            to="/employee/submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const { processedData, ticketId: ticket, confirmationUrl } = state;

  // Map category to icon and color (aligned with SubmitIncident.tsx categories)
  const categoryInfo = {
    'Hardware Issue': { icon: '💻', color: 'from-blue-500 to-blue-600' },
    'Human Resources': { icon: '👥', color: 'from-green-500 to-green-600' },
    'Facilities': { icon: '🏢', color: 'from-purple-500 to-purple-600' },
    'Security': { icon: '🔒', color: 'from-red-500 to-red-600' },
    'Finance': { icon: '💰', color: 'from-yellow-500 to-yellow-600' },
    'Health & Safety': { icon: '🩺', color: 'from-pink-500 to-pink-600' },
    'Legal': { icon: '⚖️', color: 'from-gray-500 to-gray-600' },
    'Other': { icon: '❓', color: 'from-indigo-500 to-indigo-600' },
  };

  const categoryData = categoryInfo[processedData.category as keyof typeof categoryInfo] || {
    icon: '❓',
    color: 'from-indigo-500 to-indigo-600',
  };

  // Estimate resolution time based on priority
  const estimatedResolution = processedData.priority === 'High' ? '1-2 business days' : 
                             processedData.priority === 'Medium' ? '2-3 business days' : '3-5 business days';

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-full shadow-2xl">
                  <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 sm:p-2 rounded-full shadow-lg animate-pulse">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Ticket Created Successfully!
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Your incident has been processed and assigned for resolution
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Ticket Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className={`bg-gradient-to-r ${categoryData.color} p-4 sm:p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-2xl sm:text-3xl">{categoryData.icon}</div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Ticket #{ticket}</h2>
                      <p className="text-white/90 text-sm sm:text-base">{processedData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      New
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Assigned Staff</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{processedData.staffName} ({processedData.staffEmail})</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 dark:bg-green-900/50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Est. Resolution</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{estimatedResolution}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 dark:bg-purple-900/50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Priority</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{processedData.priority}</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 sm:p-3 rounded-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Analysis Complete</h2>
                      
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Advanced machine learning has analyzed your ticket</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-blue-100 dark:border-blue-700 mb-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Analysis Email</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{processedData.email}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-blue-100 dark:border-blue-700 mb-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Analysis Summary</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{processedData.summary}</p>
                </div>

              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">What Happens Next?</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Immediate Review</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Your ticket will be reviewed by {processedData.staffName} ({processedData.department}) within 4 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Real-time Updates</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Receive email notifications and track progress through your dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Expert Resolution</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Our specialists will work to resolve your issue within the estimated timeframe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/employee/track"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center font-semibold flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg text-sm sm:text-base"
              >
                <span>Track This Ticket</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                to="/employee"
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-center font-semibold text-sm sm:text-base"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmation;