import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, FileText, LogOut, User, Home, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SubmitIncident from './employee/SubmitIncident';
import TrackTickets from './employee/TrackTickets';
import TicketConfirmation from './employee/TicketConfirmation';
import IncidentConfirmation from './employee/IncidentConfirmation';

const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/employee', icon: Home },
    { name: 'Submit Incident', href: '/employee/submit', icon: Plus },
    { name: 'Track Tickets', href: '/employee/track', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/employee') {
      return location.pathname === '/employee' || location.pathname === '/employee/';
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
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Incident Portal</h1>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Employee</p>
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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Incident Portal</h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<EmployeeHome />} />
          <Route path="/submit" element={<SubmitIncident />} />
          <Route path="/incident-confirmation" element={<IncidentConfirmation />} />
          <Route path="/track" element={<TrackTickets />} />
          <Route path="/confirmation/:ticketId" element={<TicketConfirmation />} />
        </Routes>
      </div>
    </div>
  );
};

const EmployeeHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Submit and track your incident tickets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link
            to="/employee/submit"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 sm:p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/70 transition-colors">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Submit New Incident</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Report IT issues, HR concerns, or facility problems</p>
          </Link>

          <Link
            to="/employee/track"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 dark:bg-green-900/50 p-2.5 sm:p-3 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/70 transition-colors">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Track My Tickets</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Monitor the progress of your submitted tickets</p>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Laptop performance issue</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Ticket #INC-2024-001 • In Progress</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 self-start sm:self-center">
                In Progress
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Office temperature complaint</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Ticket #INC-2024-002 • Resolved</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 self-start sm:self-center">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;