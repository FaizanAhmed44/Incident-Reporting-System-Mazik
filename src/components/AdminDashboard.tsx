import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home,  FileText, LogOut, User, Users, Clock, TrendingUp, Menu, X, Moon, Sun, UserCog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import StaffManagement from './admin/StaffManagement';
import TicketsManagement from './admin/TicketManagement';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Tickets Management', href: '/admin/tickets', icon: FileText },
    { name: 'Employee Management', href: '/admin/employees', icon: UserCog },    
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
          <Route path="/tickets" element={<TicketsManagement />} />
          <Route path="/employees" element={<StaffManagement />} />          
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
    { name: 'Customer Satisfaction', value: '94%', change: '+3%', changeType: 'increase', icon: TrendingUp },
  ];

  const departmentStats = [
    { name: 'IT Support', tickets: 156, resolved: 142, pending: 14, percentage: 91 },
    { name: 'HR', tickets: 64, resolved: 58, pending: 6, percentage: 91 },
    { name: 'Facilities', tickets: 27, resolved: 24, pending: 3, percentage: 89 },
  ];

  // Analytics Data
  const monthlyTickets = [
    { month: 'Jan', tickets: 45, resolved: 42 },
    { month: 'Feb', tickets: 52, resolved: 48 },
    { month: 'Mar', tickets: 38, resolved: 36 },
    { month: 'Apr', tickets: 61, resolved: 58 },
    { month: 'May', tickets: 49, resolved: 47 },
    { month: 'Jun', tickets: 67, resolved: 63 },
    { month: 'Jul', tickets: 58, resolved: 55 },
    { month: 'Aug', tickets: 72, resolved: 68 },
    { month: 'Sep', tickets: 64, resolved: 61 },
    { month: 'Oct', tickets: 78, resolved: 74 },
    { month: 'Nov', tickets: 69, resolved: 66 },
    { month: 'Dec', tickets: 83, resolved: 79 }
  ];

  const resolutionTimes = [
    { month: 'Jan', time: 6.2 },
    { month: 'Feb', time: 5.8 },
    { month: 'Mar', time: 5.4 },
    { month: 'Apr', time: 5.1 },
    { month: 'May', time: 4.9 },
    { month: 'Jun', time: 4.6 },
    { month: 'Jul', time: 4.4 },
    { month: 'Aug', time: 4.3 },
    { month: 'Sep', time: 4.2 },
    { month: 'Oct', time: 4.1 },
    { month: 'Nov', time: 4.0 },
    { month: 'Dec', time: 4.2 }
  ];

  const severityData = [
    { severity: 'High', count: 89, color: 'bg-red-500' },
    { severity: 'Medium', count: 134, color: 'bg-yellow-500' },
    { severity: 'Low', count: 24, color: 'bg-green-500' }
  ];

  const topAgents = [
    { name: 'Sarah Johnson', tickets: 45, satisfaction: 4.9, department: 'IT Support' },
    { name: 'Mike Chen', tickets: 38, satisfaction: 4.8, department: 'Facilities' },
    { name: 'Alex Rivera', tickets: 42, satisfaction: 4.7, department: 'IT Support' },
    { name: 'Emily Davis', tickets: 31, satisfaction: 4.6, department: 'HR' },
    { name: 'Tom Wilson', tickets: 29, satisfaction: 4.5, department: 'Facilities' }
  ];

  const getMaxValue = (data: any[], key: string) => Math.max(...data.map(item => item[key]));
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Here's your incident management overview and analytics</p>
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

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Monthly Ticket Volume Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Monthly Ticket Volume</h3>
              <div className="flex items-center space-x-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Created</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Resolved</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <div className="flex items-end justify-between h-full space-x-1 sm:space-x-2">
                {monthlyTickets.map((data, index) => {
                  const maxTickets = getMaxValue(monthlyTickets, 'tickets');
                  const ticketHeight = (data.tickets / maxTickets) * 100;
                  const resolvedHeight = (data.resolved / maxTickets) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-full flex items-end space-x-1 h-48">
                        <div 
                          className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 flex-1"
                          style={{ height: `${ticketHeight}%` }}
                          title={`${data.tickets} tickets created`}
                        ></div>
                        <div 
                          className="bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600 flex-1"
                          style={{ height: `${resolvedHeight}%` }}
                          title={`${data.resolved} tickets resolved`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resolution Time Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Average Resolution Time (Hours)</h3>
            <div className="h-64">
              <div className="relative h-full">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="resolutionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5, 6].map((line) => (
                    <line
                      key={line}
                      x1="40"
                      y1={30 + (line * 25)}
                      x2="380"
                      y2={30 + (line * 25)}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      className="text-gray-400"
                    />
                  ))}
                  
                  {/* Line chart */}
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={resolutionTimes.map((data, index) => {
                      const x = 40 + (index * 28);
                      const y = 180 - (data.time * 25);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Area fill */}
                  <polygon
                    fill="url(#resolutionGradient)"
                    points={`40,180 ${resolutionTimes.map((data, index) => {
                      const x = 40 + (index * 28);
                      const y = 180 - (data.time * 25);
                      return `${x},${y}`;
                    }).join(' ')} 368,180`}
                  />
                  
                  {/* Data points */}
                  {resolutionTimes.map((data, index) => {
                    const x = 40 + (index * 28);
                    const y = 180 - (data.time * 25);
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3B82F6"
                        className="hover:r-6 transition-all duration-200"
                      >
                        <title>{data.month}: {data.time}h</title>
                      </circle>
                    );
                  })}
                  
                  {/* Y-axis labels */}
                  {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                    <text
                      key={value}
                      x="35"
                      y={185 - (value * 25)}
                      textAnchor="end"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {value}h
                    </text>
                  ))}
                  
                  {/* X-axis labels */}
                  {resolutionTimes.map((data, index) => (
                    <text
                      key={index}
                      x={40 + (index * 28)}
                      y="195"
                      textAnchor="middle"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {data.month}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Tickets by Severity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Tickets by Severity</h3>
            <div className="space-y-4">
              {severityData.map((item) => {
                const total = severityData.reduce((sum, data) => sum + data.count, 0);
                const percentage = Math.round((item.count / total) * 100);
                
                return (
                  <div key={item.severity}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.severity}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Agents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Top Performing Agents</h3>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div key={agent.name} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.tickets}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{agent.satisfaction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">SLA Compliance</h3>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-600"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.92)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">92%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Overall Compliance</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Response Time</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">95%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Resolution Time</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">89%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Escalation Rate</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">8%</span>
                </div>
              </div>
            </div>
          </div>
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


// const AdminTickets: React.FC = () => {
//   const [tickets, setTickets] = React.useState<Incident[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const data = await tickets_to_admin();
//         setTickets(data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load tickets');
//         setLoading(false);
//       }
//     };
//     fetchTickets();
//   }, []);

//   return (
//     <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">All Tickets</h1>
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//           {loading ? (
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading tickets...</p>
//           ) : error ? (
//             <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{error}</p>
//           ) : tickets.length === 0 ? (
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">No tickets found</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Incident ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reported By</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assigned Resolver</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {tickets.map((ticket) => (
//                     <tr key={ticket.cr6dd_incidentsid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_incidentid}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_title || 'N/A'}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_departmenttype}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_status}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_ReportedBy.cr6dd_name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{ticket.cr6dd_AssignedResolver.cr6dd_staffid}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminSettings: React.FC = () => {
//   return (
//     <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">System Settings</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Management</h3>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Configure support teams and role assignments.</p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">SLA Configuration</h3>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Set up service level agreements and escalation rules.</p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Settings</h3>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Configure AI-powered ticket analysis and routing.</p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Integration Settings</h3>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage external system integrations and APIs.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default AdminDashboard;