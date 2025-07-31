import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Building, AlertCircle, CheckCircle, XCircle, Star } from 'lucide-react';
import IncidentChat from './IncidentChat';

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tickets = location.state?.ticket;

  // Feedback state
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Mock feedback submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setFeedbackError('Please select a rating');
      return;
    }
    setFeedbackError(null);
    try {
      // Simulate API call
      console.log('Submitting feedback:', { ticketId, rating, review });
      // await submitFeedback({ ticketId, rating, review });
      setIsFeedbackSubmitted(true);
      setRating(0);
      setReview('');
    } catch (err) {
      setFeedbackError('Failed to submit feedback. Please try again.');
    }
  };

  if (!tickets) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The ticket you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/employee/track')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
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
        return 'bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'accepted':
        return 'bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'in-progress':
        return 'bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'resolved':
        return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
                        : 'bg-green-500 text-white'
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
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
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
      <div className="min-h-full bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900/20 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/employee/track')}
              className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
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

                  {/* Feedback Form for Resolved Tickets */}
                  {tickets.status === 'resolved' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Feedback</h3>
                      {isFeedbackSubmitted ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                          <p className="text-sm text-green-800 dark:text-green-300">
                            Thank you for your feedback!
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Rating</label>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-6 w-6 cursor-pointer transition-colors ${
                                    star <= rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300 dark:text-gray-500'
                                  }`}
                                  onClick={() => setRating(star)}
                                />
                              ))}
                            </div>
                            {feedbackError && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{feedbackError}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Review (Optional)</label>
                            <textarea
                              value={review}
                              onChange={(e) => setReview(e.target.value.slice(0, 500))}
                              placeholder="Share your feedback about the resolution..."
                              className="w-full p-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              rows={4}
                              maxLength={500}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {review.length}/500 characters
                            </p>
                          </div>
                          <button
                            type="submit"
                            disabled={rating === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Progress</h2>
                <ProgressIndicator status={tickets.status} />
              </div>

              {/* Assignment Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-lg">
                      <Building className="h-4 w-4 text-teal-600" />
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