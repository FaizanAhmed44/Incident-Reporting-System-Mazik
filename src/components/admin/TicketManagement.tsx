import React, { useState } from 'react';
import { Search, Filter, Edit3, Trash2, Eye, EyeOff, X, FileText, User, Calendar, AlertCircle, Zap, Mail, Building } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  departmentType: string;
  status: 'new' | 'accepted' | 'in-progress' | 'resolved' | 'rejected';
  reportedBy: string;
  reportedOn: string;
  assignedResolver: string;
  aiSuggestedDescription: string;
  aiSeverity: 'low' | 'medium' | 'high';
  aiDraftEmail: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const TicketsManagement: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'INC-2024-001',
      title: 'Email server downtime affecting productivity',
      description: 'Unable to send or receive emails since morning. Getting connection timeout errors when trying to connect to the mail server.',
      departmentType: 'IT Support',
      status: 'in-progress',
      reportedBy: 'John Doe',
      reportedOn: '2024-01-18',
      assignedResolver: 'Sarah Johnson',
      aiSuggestedDescription: 'Critical email infrastructure issue affecting multiple users. Requires immediate server diagnostics and potential failover to backup systems.',
      aiSeverity: 'high',
      aiDraftEmail: 'Dear John, We have received your email server issue report and our IT team is actively working on resolving this critical infrastructure problem. We expect to have service restored within 2-3 hours. We apologize for any inconvenience caused.',
      priority: 'high',
      category: 'Infrastructure'
    },
    {
      id: 'INC-2024-002',
      title: 'Software installation request for Adobe Creative Suite',
      description: 'Need Adobe Creative Suite installed on my workstation for new marketing project. Current software is outdated.',
      departmentType: 'IT Support',
      status: 'accepted',
      reportedBy: 'Jane Smith',
      reportedOn: '2024-01-17',
      assignedResolver: 'Mike Chen',
      aiSuggestedDescription: 'Standard software installation request. Verify license availability and schedule installation during business hours.',
      aiSeverity: 'medium',
      aiDraftEmail: 'Dear Jane, Your Adobe Creative Suite installation request has been approved. Our IT team will schedule the installation within the next 24-48 hours. Please ensure your workstation is available during business hours.',
      priority: 'medium',
      category: 'Software'
    },
    {
      id: 'INC-2024-003',
      title: 'Office temperature too cold in conference room',
      description: 'Conference room B-301 is extremely cold, making it uncomfortable for meetings. Temperature seems much lower than other areas.',
      departmentType: 'Facilities',
      status: 'resolved',
      reportedBy: 'Alex Rivera',
      reportedOn: '2024-01-15',
      assignedResolver: 'Tom Wilson',
      aiSuggestedDescription: 'HVAC system adjustment required for conference room B-301. Check thermostat settings and air circulation.',
      aiSeverity: 'low',
      aiDraftEmail: 'Dear Alex, The temperature issue in conference room B-301 has been resolved. Our facilities team has adjusted the HVAC system and the room should now maintain a comfortable temperature.',
      priority: 'low',
      category: 'Environment'
    },
    {
      id: 'INC-2024-004',
      title: 'Password reset request for network access',
      description: 'Forgot my network password and cannot access shared drives or company resources. Need immediate assistance.',
      departmentType: 'IT Support',
      status: 'new',
      reportedBy: 'Emily Davis',
      reportedOn: '2024-01-18',
      assignedResolver: 'Alex Rivera',
      aiSuggestedDescription: 'Routine password reset request. Follow standard security protocols for identity verification before resetting credentials.',
      aiSeverity: 'medium',
      aiDraftEmail: 'Dear Emily, We have received your password reset request. For security purposes, please contact our IT helpdesk with your employee ID for identity verification. We will reset your password promptly after verification.',
      priority: 'high',
      category: 'Security'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const departments = ['IT Support', 'HR', 'Facilities', 'Finance', 'Marketing'];
  const statuses = ['new', 'accepted', 'in-progress', 'resolved', 'rejected'];
  const severities = ['low', 'medium', 'high'];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || ticket.departmentType === departmentFilter;
    const matchesSeverity = severityFilter === 'all' || ticket.aiSeverity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesSeverity;
  });

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket({ ...ticket });
  };

  const handleSaveEdit = () => {
    if (editingTicket) {
      setTickets(tickets.map(ticket => 
        ticket.id === editingTicket.id ? editingTicket : ticket
      ));
      setEditingTicket(null);
    }
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleInputChange = (field: keyof Ticket, value: string) => {
    if (editingTicket) {
      setEditingTicket({ ...editingTicket, [field]: value });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'accepted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const toggleExpanded = (ticketId: string) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tickets Management</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Monitor and manage all incident tickets</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total: {filteredTickets.length} tickets
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Severities</option>
              {severities.map(severity => (
                <option key={severity} value={severity}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Filters</span>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Incident Details</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department & Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reporter & Resolver</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI Analysis</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredTickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {/* Incident Details */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{ticket.id}</span>
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{ticket.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {ticket.description}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(ticket.reportedOn).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department & Status */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-900 dark:text-white">{ticket.departmentType}</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Category: {ticket.category}
                          </div>
                        </div>
                      </td>

                      {/* Reporter & Resolver */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.reportedBy}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Reporter</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.assignedResolver}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Assigned Resolver</div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Analysis */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-purple-600" />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(ticket.aiSeverity)}`}>
                              {ticket.aiSeverity.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                            {ticket.aiSuggestedDescription}
                          </div>
                          <button
                            onClick={() => toggleExpanded(ticket.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center space-x-1"
                          >
                            {expandedTicket === ticket.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            <span>{expandedTicket === ticket.id ? 'Hide' : 'View'} Details</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTicket(ticket)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(ticket.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedTicket === ticket.id && (
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <td colSpan={5} className="px-4 sm:px-6 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Full Description */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Description</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                {ticket.description}
                              </p>
                            </div>

                            {/* AI Draft Email */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span>AI Draft Email</span>
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                {ticket.aiDraftEmail}
                              </p>
                            </div>

                            {/* AI Suggested Description */}
                            <div className="lg:col-span-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-purple-600" />
                                <span>AI Suggested Description</span>
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                {ticket.aiSuggestedDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
                  <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Edit Ticket Modal */}
        {editingTicket && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setEditingTicket(null)} />
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Ticket</h3>
                  <button
                    onClick={() => setEditingTicket(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingTicket.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={editingTicket.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                    <select
                      value={editingTicket.departmentType}
                      onChange={(e) => handleInputChange('departmentType', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Resolver</label>
                    <input
                      type="text"
                      value={editingTicket.assignedResolver}
                      onChange={(e) => handleInputChange('assignedResolver', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editingTicket.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Suggested Description</label>
                    <textarea
                      value={editingTicket.aiSuggestedDescription}
                      onChange={(e) => handleInputChange('aiSuggestedDescription', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setEditingTicket(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setShowDeleteConfirm(null)} />
              
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Ticket</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(showDeleteConfirm)}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsManagement;