import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, FileText, LogOut, User, Users, Clock, TrendingUp, Menu, X, Moon, Sun, UserCog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import StaffManagement from './admin/StaffManagement';
import TicketsManagement from './admin/TicketManagement';
import { get_all_data, ApiResponse, Incident } from '../api/dashboard_admin';

// Utility function to calculate time difference in hours
const calculateResolutionTime = (created: string, modified: string) => {
  const createdDate = new Date(created);
  const modifiedDate = new Date(modified);
  const diffMs = modifiedDate.getTime() - createdDate.getTime();
  return (diffMs / (1000 * 60 * 60)).toFixed(1); // Convert to hours
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
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
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_all_data();
        setApiData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">Failed to load data</div>
      </div>
    );
  }

  const incidents = apiData.incident_table;
  const staff = apiData.staff_table;

  // Calculate stats
  const totalTickets = incidents.length;
  const activeStaff = staff.filter(s => s.cr6dd_availability === 'Available').length;
  const resolutionTimes = incidents
    .filter(i => i.statuscode === 2) // Resolved incidents
    .map(i => parseFloat(calculateResolutionTime(i.createdon, i.modifiedon)));
  const avgResolutionTime = resolutionTimes.length > 0
    ? (resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length).toFixed(1)
    : '0.0';

  // Mock customer satisfaction (not in API data, using static value)
  const customerSatisfaction = '94%';

  const stats = [
    { name: 'Total Tickets', value: totalTickets.toString(), change: '+12%', changeType: 'increase', icon: FileText },
    { name: 'Active Support Staff', value: activeStaff.toString(), change: '+2', changeType: 'increase', icon: Users },
    { name: 'Avg Resolution Time', value: `${avgResolutionTime}h`, change: '-0.8h', changeType: 'decrease', icon: Clock },
    { name: 'Customer Satisfaction', value: customerSatisfaction, change: '+3%', changeType: 'increase', icon: TrendingUp },
  ];

  // Department performance
  const departments = Array.from(new Set(incidents.map(i => i.cr6dd_departmenttype)));
  const departmentStats = departments.map(dept => {
    const deptIncidents = incidents.filter(i => i.cr6dd_departmenttype === dept);
    const resolved = deptIncidents.filter(i => i.statuscode === 2).length;
    const pending = deptIncidents.filter(i => i.statuscode === 1).length;
    const percentage = deptIncidents.length > 0 ? Math.round((resolved / deptIncidents.length) * 100) : 0;
    return {
      name: dept,
      tickets: deptIncidents.length,
      resolved,
      pending,
      percentage,
    };
  });

  // Monthly ticket volume
  const monthlyTickets = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    const monthIncidents = incidents.filter(i => {
      const created = new Date(i.createdon); // Convert string to Date
      return created.getFullYear() === 2025; // && created.getMonth() === i;
    });
    return {
      month,
      tickets: monthIncidents.length,
      resolved: monthIncidents.filter(i => i.statuscode === 2).length,
    };
  });

  // Resolution time trend
  const resolutionTimeData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    const monthIncidents = incidents.filter(i => {
      const created = new Date(i.createdon); // Convert string to Date
      return created.getFullYear() === 2025; // && created.getMonth() === i && i.statuscode === 2;
    });
    const times = monthIncidents.map(i => parseFloat(calculateResolutionTime(i.createdon, i.modifiedon)));
    const avgTime = times.length > 0 ? (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(1) : '0.0';
    return { month, time: parseFloat(avgTime) };
  });

  // Severity distribution
  const severityData = [
    { severity: 'High', count: incidents.filter(i => i.cr6dd_severity === 'High').length, color: 'bg-red-500' },
    { severity: 'Medium', count: incidents.filter(i => i.cr6dd_severity === 'Medium').length, color: 'bg-yellow-500' },
    { severity: 'Low', count: incidents.filter(i => i.cr6dd_severity === 'Low').length, color: 'bg-green-500' },
  ];

  // Top performing agents
  const topAgents = staff
    .map(s => {
      const agentIncidents = incidents.filter(i => i._cr6dd_assignedresolver_value === s._cr6dd_userid_value);
      const resolved = agentIncidents.filter(i => i.statuscode === 2).length;
      return {
        name: s._cr6dd_userid_value ? apiData.user_table.find(u => u.cr6dd_userid === s._cr6dd_userid_value)?.cr6dd_name || 'Unknown' : 'Unknown',
        tickets: agentIncidents.length,
        satisfaction: 4.5 + Math.random() * 0.4, // Mock satisfaction score
        department: s.cr6dd_departmentname,
      };
    })
    .filter(a => a.tickets > 0)
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 5);

  // Severity distribution over time (new chart data)
  const severityOverTime = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    const monthIncidents = incidents.filter(i => {
      const created = new Date(i.createdon); // Convert string to Date
      return created.getFullYear() === 2025; // && created.getMonth() === i;
    });
    return {
      month,
      high: monthIncidents.filter(i => i.cr6dd_severity === 'High').length,
      medium: monthIncidents.filter(i => i.cr6dd_severity === 'Medium').length,
      low: monthIncidents.filter(i => i.cr6dd_severity === 'Low').length,
    };
  });

  const getMaxValue = (data: any[], key: string) => Math.max(...data.map(item => item[key])) || 1;

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
                    points={resolutionTimeData.map((data, index) => {
                      const x = 40 + (index * 28);
                      const y = 180 - (data.time * 25);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Area fill */}
                  <polygon
                    fill="url(#resolutionGradient)"
                    points={`40,180 ${resolutionTimeData.map((data, index) => {
                      const x = 40 + (index * 28);
                      const y = 180 - (data.time * 25);
                      return `${x},${y}`;
                    }).join(' ')} 368,180`}
                  />
                  
                  {/* Data points */}
                  {resolutionTimeData.map((data, index) => {
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
                  {resolutionTimeData.map((data, index) => (
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

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

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
                      <span className="text-xs text-gray-500 dark:text-gray-400">{agent.satisfaction.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 sm:gap-8">
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
        </div>

          {/* New Severity Distribution Over Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Severity Distribution Over Time</h3>
              <div className="flex items-center space-x-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">High</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Low</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <div className="flex items-end justify-between h-full space-x-1 sm:space-x-2">
                {severityOverTime.map((data, index) => {
                  const maxTickets = Math.max(...severityOverTime.map(d => d.high + d.medium + d.low));
                  const highHeight = (data.high / maxTickets) * 100;
                  const mediumHeight = (data.medium / maxTickets) * 100;
                  const lowHeight = (data.low / maxTickets) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-full flex items-end space-x-1 h-48">
                        <div 
                          className="bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600 flex-1"
                          style={{ height: `${highHeight}%` }}
                          title={`${data.high} high severity tickets`}
                        ></div>
                        <div 
                          className="bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-600 flex-1"
                          style={{ height: `${mediumHeight}%` }}
                          title={`${data.medium} medium severity tickets`}
                        ></div>
                        <div 
                          className="bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600 flex-1"
                          style={{ height: `${lowHeight}%` }}
                          title={`${data.low} low severity tickets`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {incidents
                .sort((a, b) => new Date(b.modifiedon).getTime() - new Date(a.modifiedon).getTime())
                .slice(0, 4)
                .map((activity, index) => {
                  const actionType = activity.statuscode === 2 ? 'resolution' : activity.statuscode === 1 ? 'assignment' : 'system';
                  const actionText = activity.statuscode === 2 ? 'Ticket resolved' : activity.statuscode === 1 ? 'Ticket assigned' : 'Ticket updated';
                  const timeAgo = ((new Date().getTime() - new Date(activity.modifiedon).getTime()) / (1000 * 60)).toFixed(0) + ' minutes ago';
                  return (
                    <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        actionType === 'assignment' ? 'bg-blue-500' :
                        actionType === 'resolution' ? 'bg-green-500' :
                        actionType === 'alert' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{actionText}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.cr6dd_departmenttype} • {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;