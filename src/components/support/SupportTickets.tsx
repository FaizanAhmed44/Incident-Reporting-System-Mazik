import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'accepted' | 'in-progress' | 'resolved';
  submittedBy: string;
  submittedAt: string;
  aiSummary: string;
  aiSeverity: string;
}

const SupportTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock ticket data
  const tickets: Ticket[] = [
    {
      id: 'INC-2024-015',
      title: 'Email server downtime',
      description: 'Unable to send or receive emails since morning. Getting connection timeout errors.',
      category: 'IT Support',
      priority: 'high',
      status: 'new',
      submittedBy: 'john.doe@company.com',
      submittedAt: '2024-01-18T09:30:00Z',
      aiSummary: 'Critical email infrastructure issue affecting multiple users. Requires immediate attention.',
      aiSeverity: 'High'
    },
    {
      id: 'INC-2024-014',
      title: 'Software installation request',
      description: 'Need Adobe Creative Suite installed on my workstation for new project.',
      category: 'IT Support',
      priority: 'medium',
      status: 'accepted',
      submittedBy: 'jane.smith@company.com',
      submittedAt: '2024-01-18T08:15:00Z',
      aiSummary: 'Standard software installation request. Can be scheduled within normal business hours.',
      aiSeverity: 'Medium'
    },
    {
      id: 'INC-2024-013',
      title: 'Password reset assistance',
      description: 'Forgot my network password and cannot access shared drives.',
      category: 'IT Support',
      priority: 'low',
      status: 'in-progress',
      submittedBy: 'mike.johnson@company.com',
      submittedAt: '2024-01-18T07:45:00Z',
      aiSummary: 'Routine password reset request. Standard security protocol applies.',
      aiSeverity: 'Low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'accepted': return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'in-progress': return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'resolved': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assigned Tickets</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Review and manage incident tickets assigned to your team</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="accepted">Accepted</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-mono mb-2">{ticket.id}</p>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">{ticket.description}</p>
                </div>
                <Link
                  to={`/support/ticket/${ticket.id}`}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>View Details</span>
                </Link>
              </div>

              {/* AI Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-blue-900 mb-1">AI Analysis</h4>
                    <p className="text-xs sm:text-sm text-blue-800">{ticket.aiSummary}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Predicted Severity: {ticket.aiSeverity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                  <span>Submitted by: <span className="font-medium">{ticket.submittedBy}</span></span>
                  <span>Category: <span className="font-medium">{ticket.category}</span></span>
                </div>
                <span>{new Date(ticket.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;