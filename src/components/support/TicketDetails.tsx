import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, CheckCircle, Play, Loader2, Star } from 'lucide-react';
import IncidentChat from '../employee/IncidentChat';
import apiClient from '../../api/axios';
import { CustomLoader } from '../ui/CustomLoader';

interface FetchIncidentPayload {
  incidentid: string;
}

interface UserResponse {
  IncidentID: string;
  ReporterName: string;
  Status: string;
  Department: string;
  Severity: string;
  Summary: string;
  Title: string;
  ReporterEmail: string;
  ReportedOn: string;
  Attachment: string;
}

interface UpdateStatusPayload {
  incidentid: string;
  status: string;
}

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Fetch incident data
  const fetchIncident = async (incidentid: string) => {
    try {
      const apiUrl = import.meta.env.VITE_FETCH_SINGLE_INCIDENT_API_URL;
      if (!apiUrl) {
        throw new Error('VITE_FETCH_SINGLE_INCIDENT_API_URL is not defined');
      }

      console.log('Fetching incident from:', apiUrl);
      console.log('Request payload:', { incidentid });
      const payload: FetchIncidentPayload = { incidentid };
      const response = await apiClient.post<UserResponse[]>(apiUrl, payload);
      console.log('Fetch incident response:', JSON.stringify(response.data, null, 2));

      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          console.log('Incident found:', response.data[0]);
          return response.data[0];
        } else {
          throw new Error(`No incident found for ID: ${incidentid}`);
        }
      } else {
        throw new Error('Unexpected response format: Expected an array');
      }
    } catch (error: any) {
      console.error('Failed to fetch incident:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  };

  // Update incident status
  const updateIncidentStatus = async (incidentid: string, status: string) => {
    try {
      const updateUrl = import.meta.env.VITE_UPDATE_STATUS_API_URL;
      if (!updateUrl) {
        throw new Error('VITE_UPDATE_STATUS_API_URL is not defined');
      }

      const payload: UpdateStatusPayload = { incidentid, status };
      console.log('Updating incident status:', payload);
      const response = await apiClient.post(updateUrl, payload);
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update incident status:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  };

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

  // Load incident data on component mount
  useEffect(() => {
    const loadIncident = async () => {
      if (!ticketId) {
        setError('No ticket ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const incidentData = await fetchIncident(ticketId);
        console.log('Setting ticket data:', incidentData);
        setTicket(incidentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [ticketId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!ticket) return;

    try {
      setUpdating(true);
      await updateIncidentStatus(ticket.IncidentID, newStatus);
      setTicket(prev => (prev ? { ...prev, Status: newStatus } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAcceptTicket = () => handleStatusUpdate('accepted');
  const handleStartProgress = () => handleStatusUpdate('in-progress');
  const handleResolveTicket = () => handleStatusUpdate('resolved');

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'accepted': return 'bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'in-progress': return 'bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'resolved': return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (severity: string | undefined) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Debugging: Log ticket state
  console.log('Current ticket state:', ticket);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <CustomLoader />
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading Tickets Details...
          </h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ticket) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error || 'Ticket not found'}
                </p>
                <button
                  onClick={() => navigate('/support/tickets')}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
                >
                  Back to Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/support/tickets')}
            className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
              {ticket.Title || 'Untitled Incident'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Ticket #{ticket.IncidentID}
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Ticket Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                    {ticket.Summary || 'No description available'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attachment</h3>
                  {ticket.Attachment !== "" ? (
                    <a
                      href={ticket.Attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      View Attachment
                    </a>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No attachment provided</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {ticket.Department || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Severity</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.Severity)}`}>
                      {ticket.Severity ? ticket.Severity.toUpperCase() : 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.Status)}`}>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {ticket.Status ? ticket.Status.charAt(0).toUpperCase() + ticket.Status.slice(1).replace('-', ' ') : 'N/A'}
                  </span>
                </div>
                {/* Feedback Form for Resolved Tickets */}
                {(ticket.Status === 'Resolved' || ticket.Status=="resolved") && (
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
                            className="w-full p-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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

            {/* Chat Section */}
            <div>
              <IncidentChat ticketId={ticket.IncidentID} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Status & Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Status & Actions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.Status)}`}>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {ticket.Status ? ticket.Status.charAt(0).toUpperCase() + ticket.Status.slice(1).replace('-', ' ') : 'N/A'}
                  </span>
                </div>
                <div className="space-y-2">
                  {ticket.Status?.toLowerCase() === 'new' && (
                    <button
                      onClick={handleAcceptTicket}
                      disabled={updating}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      )}
                      Accept Ticket
                    </button>
                  )}
                  {ticket.Status?.toLowerCase() === 'accepted' && (
                    <button
                      onClick={handleStartProgress}
                      disabled={updating}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      )}
                      Start Progress
                    </button>
                  )}
                  {ticket.Status?.toLowerCase() === 'in-progress' && (
                    <button
                      onClick={handleResolveTicket}
                      disabled={updating}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      )}
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Reporter Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {ticket.ReporterName || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {ticket.ReporterEmail || 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {ticket.Department || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reported On</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(ticket.ReportedOn)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;