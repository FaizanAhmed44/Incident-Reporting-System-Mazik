import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, CheckCircle, Play, Loader2 } from 'lucide-react';
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
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

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
      if (newStatus === 'resolved') {
        setShowResolutionForm(false);
        setResolutionNotes('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAcceptTicket = () => handleStatusUpdate('accepted');
  const handleStartProgress = () => handleStatusUpdate('in-progress');
  const handleResolveTicket = () => {
    if (resolutionNotes.trim()) {
      handleStatusUpdate('resolved');
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (severity: string | undefined) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error || 'Ticket not found'}
                </p>
                <button
                  onClick={() => navigate('/support/tickets')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/support/tickets')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
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
              </div>
            </div>

            {/* Resolution Form */}
            {showResolutionForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Resolution Notes</h2>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Describe how the issue was resolved (not sent to API)..."
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button
                    onClick={() => setShowResolutionForm(false)}
                    disabled={updating}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveTicket}
                    disabled={!resolutionNotes.trim() || updating}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex items-center"
                  >
                    {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}

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
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base disabled:opacity-50"
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
                      className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base disabled:opacity-50"
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
                      onClick={() => setShowResolutionForm(true)}
                      disabled={updating}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {ticket.ReporterName || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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