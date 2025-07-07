import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SupportTickets from './support/SupportTickets';
import TicketDetails from './support/TicketDetails';

const SupportDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/support', icon: Home },
    { name: 'Assigned Tickets', href: '/support/tickets', icon: FileText },
    { name: 'Settings', href: '/support/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/support') {
      return location.pathname === '/support' || location.pathname === '/support/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-gray-900">Support Portal</h1>
              <p className="text-xs lg:text-sm text-gray-600">Support Team</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
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
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Support Portal</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <Routes>
          <Route path="/" element={<SupportHome />} />
          <Route path="/tickets" element={<SupportTickets />} />
          <Route path="/ticket/:ticketId" element={<TicketDetails />} />
          <Route path="/settings" element={<SupportSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const SupportHome: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Open Tickets', value: '12', change: '+2', changeType: 'increase' },
    { name: 'Resolved Today', value: '8', change: '+4', changeType: 'increase' },
    { name: 'Average Response', value: '2.4h', change: '-0.3h', changeType: 'decrease' },
    { name: 'Customer Rating', value: '4.8', change: '+0.1', changeType: 'increase' },
  ];

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Here's what's happening with your support tickets today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-xs sm:text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
          <div className="space-y-4">
            {[
              { id: 'INC-2024-015', title: 'Email server downtime', priority: 'high', time: '2 min ago' },
              { id: 'INC-2024-014', title: 'Software installation request', priority: 'medium', time: '1 hour ago' },
              { id: 'INC-2024-013', title: 'Password reset assistance', priority: 'low', time: '3 hours ago' },
            ].map((ticket) => (
              <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0 space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{ticket.id} • {ticket.time}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start sm:self-center ${
                  ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SupportSettings: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Settings</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600">Support team settings will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;