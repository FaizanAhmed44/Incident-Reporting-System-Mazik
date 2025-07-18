import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, FileText, LogOut, User, Menu, X, Moon, Sun, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchIncidents } from '../api/supportApi'; // Your API function
import SupportTickets from './support/SupportTickets';
import TicketDetails from './support/TicketDetails';
import { CustomLoader } from './ui/CustomLoader';


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

const SupportDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/support', icon: Home },
    { name: 'Assigned Tickets', href: '/support/tickets', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/support') {
      return location.pathname === '/support' || location.pathname === '/support/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Support Portal</h1>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Support Team</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Support Portal</h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<SupportHome />} />
          <Route path="/tickets" element={<SupportTickets />} />
          <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        </Routes>
      </div>
    </div>
  );
};

const SupportHome: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch incidents
  const loadIncidents = async () => {
    console.log('loadIncidents called');
    console.log('User object:', user);
    
    if (!user?.id) {
      console.error('No user ID found');
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    console.log('Fetching incidents for user ID:', user.id);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchIncidents({ userId: user.id });
      console.log('API response:', response);
      
      // Handle both single incident and array of incidents
      const incidentsArray = Array.isArray(response) ? response : [response];
      console.log('Processed incidents array:', incidentsArray);
      
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
    console.log('useEffect triggered, user:', user);
    
    // Add a small delay to ensure user is loaded
    const timer = setTimeout(() => {
      loadIncidents();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user?.id]);

  // Calculate dynamic statistics
  const calculateStats = () => {
    const totalIncidents = incidents.length;
    const openTickets = incidents.filter(incident => 
      incident.Status && !['Resolved', 'Closed', 'Completed'].includes(incident.Status)
    ).length;
    
    const resolvedToday = incidents.filter(incident => {
      const today = new Date().toISOString().split('T')[0];
      return incident.Status === 'Resolved' && 
             incident.ReportedOn && 
             incident.ReportedOn.startsWith(today);
    }).length;

    const highPriorityCount = incidents.filter(incident => 
      incident.Severity === 'High' || incident.Severity === 'Critical'
    ).length;

    return {
      openTickets,
      resolvedToday,
      totalIncidents,
      highPriorityCount
    };
  };

  const stats = calculateStats();

  const statsData = [
    { 
      name: 'Open Tickets', 
      value: stats.openTickets.toString(), 
      change: stats.highPriorityCount > 0 ? `${stats.highPriorityCount} high priority` : 'All normal',
      changeType: stats.highPriorityCount > 0 ? 'increase' : 'normal'
    },
    { 
      name: 'Resolved Today', 
      value: stats.resolvedToday.toString(), 
      change: stats.resolvedToday > 0 ? '+' + stats.resolvedToday : '0',
      changeType: 'increase' 
    },
    { 
      name: 'Total Incidents', 
      value: stats.totalIncidents.toString(), 
      change: `${stats.totalIncidents} total`,
      changeType: 'normal' 
    },
    { 
      name: 'Departments', 
      value: new Set(incidents.map(i => i.Department).filter(Boolean)).size.toString(),
      change: 'Active',
      changeType: 'normal' 
    },
  ];

  // Get priority color
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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'new':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'in progress':
      case 'assigned':
        return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300';
      case 'resolved':
      case 'closed':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <CustomLoader />
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading Your Details...
          </h2>
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
                Welcome back, {user?.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                Here's what's happening with your support tickets today
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

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`text-xs sm:text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 
                  stat.changeType === 'normal' ? 'text-blue-600 dark:text-blue-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Recent Incidents ({incidents.length})
            </h3>
            <Link
              to="/support/tickets"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
            </Link>
          </div>
          
          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No incidents found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.slice(0, 3).map((incident) => (
                <div key={incident.IncidentID} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {incident.Title || incident.Summary || 'Untitled Incident'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {incident.IncidentID}
                      </p>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(incident.ReportedOn)}
                      </p>
                      {incident.Department && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {incident.Department}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {incident.Status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.Status)}`}>
                        {incident.Status}
                      </span>
                    )}
                    {incident.Severity && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(incident.Severity)}`}>
                        {incident.Severity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;