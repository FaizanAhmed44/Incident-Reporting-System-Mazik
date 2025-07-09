import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, FileText, Settings, LogOut, User, Users, Clock,  Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'All Tickets', href: '/admin/tickets', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
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
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Admin Portal</h1>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Administrator</p>
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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Portal</h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/tickets" element={<AdminTickets />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminHome: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Tickets', value: '247', change: '+12%', changeType: 'increase', icon: FileText },
    { name: 'Active Support Staff', value: '18', change: '+2', changeType: 'increase', icon: Users },
    { name: 'Avg Resolution Time', value: '4.2h', change: '-0.8h', changeType: 'decrease', icon: Clock },
  
  ];

  const departmentStats = [
    { name: 'IT Support', tickets: 156, resolved: 142, pending: 14, percentage: 91 },
    { name: 'HR', tickets: 64, resolved: 58, pending: 6, percentage: 91 },
    { name: 'Facilities', tickets: 27, resolved: 24, pending: 3, percentage: 89 },
  ];

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Here's your incident management overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <div className={`text-xs sm:text-sm flex items-center mt-1 ${
                      stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      <span>{stat.change}</span>
                      <span className="ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Department Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Department Performance</h3>
            <div className="space-y-4 sm:space-y-6">
              {departmentStats.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{dept.resolved}/{dept.tickets} resolved</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{dept.percentage}% resolution rate</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{dept.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'High priority ticket assigned', team: 'IT Support', time: '5 minutes ago', type: 'assignment' },
                { action: 'Ticket resolved', team: 'HR', time: '1 hour ago', type: 'resolution' },
                { action: 'New staff member added', team: 'IT Support', time: '2 hours ago', type: 'system' },
                { action: 'SLA breach alert', team: 'Facilities', time: '3 hours ago', type: 'alert' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'assignment' ? 'bg-blue-500' :
                    activity.type === 'resolution' ? 'bg-green-500' :
                    activity.type === 'alert' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.team} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAnalytics: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Analytics & Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Ticket Volume Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Volume by Month</h3>
            <div className="h-48 sm:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
              {[45, 52, 48, 61, 55, 67, 73, 69, 58, 72, 68, 74].map((height, index) => (
                <div key={index} className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-lg flex items-end justify-center">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 hover:bg-blue-700 flex items-end justify-center text-white text-xs font-medium pb-1 sm:pb-2"
                    style={{ height: `${height}%` }}
                  >
                    {index === 11 ? '74' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Jan</span>
              <span className="hidden sm:inline">Feb</span>
              <span className="hidden sm:inline">Mar</span>
              <span className="hidden sm:inline">Apr</span>
              <span className="hidden sm:inline">May</span>
              <span className="hidden sm:inline">Jun</span>
              <span className="hidden sm:inline">Jul</span>
              <span className="hidden sm:inline">Aug</span>
              <span className="hidden sm:inline">Sep</span>
              <span className="hidden sm:inline">Oct</span>
              <span className="hidden sm:inline">Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Resolution Time Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Resolution Time</h3>
            <div className="h-48 sm:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
              {[6.2, 5.8, 5.9, 5.1, 4.8, 4.2, 4.5, 4.1, 4.3, 3.9, 4.2, 3.8].map((time, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">{time}h</div>
                  <div
                    className="w-full bg-green-600 rounded-t-lg transition-all duration-300 hover:bg-green-700"
                    style={{ height: `${(time / 6.2) * 100}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Additional metrics */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Tickets by Severity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">High</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Medium</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Low</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">30%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Agents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">Sarah Johnson</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">98% satisfaction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">Mike Chen</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">96% satisfaction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">Alex Rivera</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">95% satisfaction</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">SLA Compliance</h3>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">92%</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tickets resolved within SLA</p>
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminTickets: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">All Tickets</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Comprehensive ticket management interface would be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">System Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Management</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Configure support teams and role assignments.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">SLA Configuration</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Set up service level agreements and escalation rules.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Settings</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Configure AI-powered ticket analysis and routing.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Integration Settings</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage external system integrations and APIs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;