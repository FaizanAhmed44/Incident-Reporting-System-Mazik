import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Building, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import IncidentChat from './IncidentChat';


const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tickets = location.state?.ticket;

  if (!tickets) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The ticket you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/employee/track')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'accepted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const ProgressIndicator: React.FC<{ status: string }> = ({ status }) => {
    const stages = [
      { key: 'new', label: 'New', icon: AlertCircle },
      { key: 'accepted', label: 'Accepted', icon: CheckCircle },
      { key: 'in-progress', label: 'In Progress', icon: Clock },
      { key: 'resolved', label: 'Resolved', icon: CheckCircle }
    ];
    
    const currentIndex = stages.findIndex(stage => stage.key === status);
    
    return (
      <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? isCurrent
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                    index < currentIndex ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/employee/track')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Ticket Details</h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">#{tickets.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Ticket Information */}
            <div className="space-y-6">
              {/* Main Ticket Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Ticket Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Title</h3>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{tickets.title}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">{tickets.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">AI Analysis Summary</h3>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">{tickets.descriptionSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        {tickets.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Priority</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(tickets.severity)}`}>
                        {tickets.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tickets.status)}`}>
                      {getStatusIcon(tickets.status)}
                      <span className="ml-1">{tickets.status.charAt(0).toUpperCase() + tickets.status.slice(1).replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Progress</h2>
                <ProgressIndicator status={tickets.status} />
              </div>

              {/* Assignment Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Team</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{tickets.assignedTeam}</p>
                    </div>
                  </div>
                  {tickets.assignedResolverName && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Agent</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{tickets.assignedResolverName}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{new Date(tickets.reportedOn).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

             
            </div>

            {/* Chat Section */}
            <div>
              <IncidentChat ticketId={tickets.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;