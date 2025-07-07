import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, MessageSquare, CheckCircle, Play, FileText } from 'lucide-react';

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('new');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  // Mock ticket data
  const ticket = {
    id: ticketId,
    title: 'Email server downtime',
    description: 'Unable to send or receive emails since morning. Getting connection timeout errors when trying to connect to the mail server. This is affecting our entire sales team and we cannot communicate with clients.',
    category: 'IT Support',
    priority: 'high',
    status: status,
    submittedBy: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Sales'
    },
    submittedAt: '2024-01-18T09:30:00Z',
    aiSummary: 'Critical email infrastructure issue affecting multiple users. Requires immediate attention from system administrators.',
    aiSeverity: 'High',
    assignedTeam: 'IT Support Team',
    timeline: [
      { id: 1, action: 'Ticket created', user: 'John Doe', timestamp: '2024-01-18T09:30:00Z' },
      { id: 2, action: 'Assigned to IT Support Team', user: 'System', timestamp: '2024-01-18T09:31:00Z' },
    ]
  };

  const handleAcceptTicket = () => {
    setStatus('accepted');
  };

  const handleStartProgress = () => {
    setStatus('in-progress');
  };

  const handleResolveTicket = () => {
    if (resolutionNotes.trim()) {
      setStatus('resolved');
      setShowResolutionForm(false);
      // In a real app, this would update the backend
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/support/tickets')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{ticket.title}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Ticket #{ticket.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Ticket Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Ticket Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{ticket.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {ticket.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Summary</h3>
                  <p className="text-sm sm:text-base text-gray-900">{ticket.aiSummary}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Predicted Severity</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.aiSeverity}
                  </span>
                </div>
              </div>
            </div>

            {/* Resolution Form */}
            {showResolutionForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Add Resolution Notes</h2>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe how the issue was resolved..."
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button
                    onClick={() => setShowResolutionForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveTicket}
                    disabled={!resolutionNotes.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Status & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Status & Actions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </span>
                </div>

                <div className="space-y-2">
                  {status === 'new' && (
                    <button
                      onClick={handleAcceptTicket}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Accept Ticket
                    </button>
                  )}
                  
                  {status === 'accepted' && (
                    <button
                      onClick={handleStartProgress}
                      className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Start Progress
                    </button>
                  )}
                  
                  {status === 'in-progress' && (
                    <button
                      onClick={() => setShowResolutionForm(true)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Employee Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{ticket.submittedBy.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{ticket.submittedBy.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{ticket.submittedBy.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{new Date(ticket.submittedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                {ticket.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500">by {event.user}</p>
                      <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;