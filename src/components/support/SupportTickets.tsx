// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Search, Filter, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';

// interface Ticket {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   priority: 'low' | 'medium' | 'high';
//   status: 'new' | 'accepted' | 'in-progress' | 'resolved';
//   submittedBy: string;
//   submittedAt: string;
//   aiSummary: string;
//   aiSeverity: string;
// }

// const SupportTickets: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [priorityFilter, setPriorityFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Mock ticket data
//   const tickets: Ticket[] = [
//     {
//       id: 'INC-2024-015',
//       title: 'Email server downtime',
//       description: 'Unable to send or receive emails since morning. Getting connection timeout errors.',
//       category: 'IT Support',
//       priority: 'high',
//       status: 'new',
//       submittedBy: 'john.doe@company.com',
//       submittedAt: '2024-01-18T09:30:00Z',
//       aiSummary: 'Critical email infrastructure issue affecting multiple users. Requires immediate attention.',
//       aiSeverity: 'High'
//     },
//     {
//       id: 'INC-2024-014',
//       title: 'Software installation request',
//       description: 'Need Adobe Creative Suite installed on my workstation for new project.',
//       category: 'IT Support',
//       priority: 'medium',
//       status: 'accepted',
//       submittedBy: 'jane.smith@company.com',
//       submittedAt: '2024-01-18T08:15:00Z',
//       aiSummary: 'Standard software installation request. Can be scheduled within normal business hours.',
//       aiSeverity: 'Medium'
//     },
//     {
//       id: 'INC-2024-013',
//       title: 'Password reset assistance',
//       description: 'Forgot my network password and cannot access shared drives.',
//       category: 'IT Support',
//       priority: 'low',
//       status: 'in-progress',
//       submittedBy: 'mike.johnson@company.com',
//       submittedAt: '2024-01-18T07:45:00Z',
//       aiSummary: 'Routine password reset request. Standard security protocol applies.',
//       aiSeverity: 'Low'
//     }
//   ];

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'new': return 'bg-blue-100 text-blue-800';
//       case 'accepted': return 'bg-purple-100 text-purple-800';
//       case 'in-progress': return 'bg-yellow-100 text-yellow-800';
//       case 'resolved': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'new': return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
//       case 'accepted': return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
//       case 'in-progress': return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
//       case 'resolved': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
//       default: return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
//     const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
//     return matchesSearch && matchesPriority && matchesStatus;
//   });

//   return (
//     <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Assigned Tickets</h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Review and manage incident tickets assigned to your team</p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search tickets..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex items-center space-x-2">
//                 <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
//                 <select
//                   value={priorityFilter}
//                   onChange={(e) => setPriorityFilter(e.target.value)}
//                   className="px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="all">All Priorities</option>
//                   <option value="high">High</option>
//                   <option value="medium">Medium</option>
//                   <option value="low">Low</option>
//                 </select>
//               </div>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="new">New</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="resolved">Resolved</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Tickets List */}
//         <div className="space-y-4">
//           {filteredTickets.map((ticket) => (
//             <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
//                 <div className="flex-1">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{ticket.title}</h3>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
//                         {ticket.priority.toUpperCase()}
//                       </span>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
//                         {getStatusIcon(ticket.status)}
//                         <span className="ml-1">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}</span>
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">{ticket.id}</p>
//                   <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">{ticket.description}</p>
//                 </div>
//                 <Link
//                   to={`/support/ticket/${ticket.id}`}
//                   className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//                 >
//                   <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
//                   <span>View Details</span>
//                 </Link>
//               </div>

//               {/* AI Analysis */}
//               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4 mb-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded">
//                     <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">AI Analysis</h4>
//                     <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">{ticket.aiSummary}</p>
//                     <div className="mt-2">
//                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
//                         Predicted Severity: {ticket.aiSeverity}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Ticket Meta */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
//                   <span>Submitted by: <span className="font-medium">{ticket.submittedBy}</span></span>
//                   <span>Category: <span className="font-medium">{ticket.category}</span></span>
//                 </div>
//                 <span>{new Date(ticket.submittedAt).toLocaleString()}</span>
//               </div>
//             </div>
//           ))}

//           {filteredTickets.length === 0 && (
//             <div className="text-center py-8 sm:py-12">
//               <div className="flex justify-center mb-4">
//                 <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-full">
//                   <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
//                 </div>
//               </div>
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
//               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupportTickets;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, AlertCircle, CheckCircle, Eye, RefreshCw, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchIncidents } from '../../api/supportApi';

interface Incident {
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

const SupportTickets: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Function to fetch incidents
  const loadIncidents = async () => {
    console.log('Loading incidents for tickets page...');
    
    if (!user?.id) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchIncidents({ userId:  "9a451891-e322-411b-9fb1-f93264bc29bb" });
      console.log('Tickets API response:', response);
      
      const incidentsArray = Array.isArray(response) ? response : [response];
      setIncidents(incidentsArray);
    } catch (err) {
      console.error('Error loading incidents:', err);
      setError(`Failed to load incidents: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Load incidents on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      loadIncidents();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user?.id]);

  // Get unique departments for filter
  const departments = [...new Set(incidents.map(incident => incident.Department).filter(Boolean))];

  const getPriorityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
      case 'open':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'accepted':
      case 'assigned':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
      case 'in progress':
      case 'in-progress':
        return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300';
      case 'resolved':
      case 'closed':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
      case 'open':
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'accepted':
      case 'assigned':
        return <Users className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'in progress':
      case 'in-progress':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.Summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.IncidentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.ReporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.ReporterEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || incident.Severity?.toLowerCase() === priorityFilter;
    const matchesStatus = statusFilter === 'all' || incident.Status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment = departmentFilter === 'all' || incident.Department === departmentFilter;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={loadIncidents}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Assigned Tickets ({incidents.length})
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                Review and manage incident tickets assigned to your team
              </p>
            </div>
            <button
              onClick={loadIncidents}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tickets by title, ID, reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="accepted">Accepted</option>
                <option value="assigned">Assigned</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              {departments.length > 0 && (
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div key={incident.IncidentID} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {incident.Title || incident.Summary || 'Untitled Incident'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {incident.Severity && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(incident.Severity)}`}>
                          {incident.Severity.toUpperCase()}
                        </span>
                      )}
                      {incident.Status && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.Status)}`}>
                          {getStatusIcon(incident.Status)}
                          <span className="ml-1">{incident.Status}</span>
                        </span>
                      )}
                      {incident.Department && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {incident.Department}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">
                    {incident.IncidentID}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
                    {incident.Summary || 'No description available'}
                  </p>
                </div>
                <Link
                  to={`/support/ticket/${incident.IncidentID}`}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>View Details</span>
                </Link>
              </div>

              {/* AI Analysis - Enhanced with real data */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Incident Analysis
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                      {incident.Summary || 'Detailed analysis pending...'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {incident.Severity && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          Severity: {incident.Severity}
                        </span>
                      )}
                      {incident.Department && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          Department: {incident.Department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                  <span>
                    Reported by: <span className="font-medium">{incident.ReporterName}</span>
                  </span>
                  <span>
                    Email: <span className="font-medium">{incident.ReporterEmail}</span>
                  </span>
                  {incident.Department && (
                    <span>
                      Department: <span className="font-medium">{incident.Department}</span>
                    </span>
                  )}
                </div>
                <span>{formatDate(incident.ReportedOn)}</span>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && !loading && (
            <div className="text-center py-8 sm:py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-full">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tickets found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {incidents.length === 0 
                  ? "No incidents available for your user" 
                  : "Try adjusting your search criteria or filters"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;