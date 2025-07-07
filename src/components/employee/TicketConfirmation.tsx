import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, Users, Zap, ArrowRight, Star, Shield, Target } from 'lucide-react';

interface LocationState {
  formData: {
    title: string;
    description: string;
    category: string;
  };
  ticketId: string;
}

const TicketConfirmation: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  // Mock AI predictions
  const aiPredictions = {
    severity: 'Medium',
    summary: 'System performance issue affecting productivity. Requires IT investigation within 24 hours.',
    assignedTeam: state?.formData.category === 'it-support' ? 'IT Support Team' : 
                   state?.formData.category === 'hr' ? 'HR Department' : 'Facilities Management',
    estimatedResolution: '2-3 business days',
    confidence: 94
  };

  const categoryInfo = {
    'it-support': { icon: '💻', color: 'from-blue-500 to-blue-600' },
    'hr': { icon: '👥', color: 'from-green-500 to-green-600' },
    'facilities': { icon: '🏢', color: 'from-purple-500 to-purple-600' }
  };

  const currentCategory = state?.formData.category || 'it-support';
  const categoryData = categoryInfo[currentCategory as keyof typeof categoryInfo];

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Ticket Created Successfully!</h1>
            <p className="text-base sm:text-lg text-gray-600">Your incident has been processed and assigned for resolution</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Ticket Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${categoryData.color} p-4 sm:p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-2xl sm:text-3xl">{categoryData.icon}</div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Ticket #{ticketId}</h2>
                      <p className="text-white/90 text-sm sm:text-base">{state?.formData.title}</p>
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
                    <div className="bg-blue-50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Assigned Team</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{aiPredictions.assignedTeam}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Est. Resolution</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{aiPredictions.estimatedResolution}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 p-2.5 sm:p-3 rounded-xl inline-flex mb-2">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Priority</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{aiPredictions.severity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 sm:p-3 rounded-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Analysis Complete</h2>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{aiPredictions.confidence}% confidence</span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">Advanced machine learning has analyzed your ticket</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-100 mb-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Analysis Summary</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{aiPredictions.summary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-100 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">Auto</div>
                    <div className="text-xs sm:text-sm text-gray-600">Routing</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-100 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">Smart</div>
                    <div className="text-xs sm:text-sm text-gray-600">Priority</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-100 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">Fast</div>
                    <div className="text-xs sm:text-sm text-gray-600">Response</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">What Happens Next?</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Immediate Review</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Your ticket will be reviewed by the {aiPredictions.assignedTeam} within 4 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 rounded-xl">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Real-time Updates</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Receive email notifications and track progress through your dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-purple-50 rounded-xl">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Expert Resolution</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Our specialists will work to resolve your issue within the estimated timeframe</p>
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
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 text-center font-semibold text-sm sm:text-base"
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