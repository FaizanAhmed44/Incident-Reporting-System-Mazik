import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import SupportDashboard from './components/SupportDashboard';
import AdminDashboard from './components/AdminDashboard';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
      <Route path="/employee/*" element={user.role === 'employee' ? <EmployeeDashboard /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/support/*" element={user.role === 'support' ? <SupportDashboard /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/admin/*" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to={`/${user.role}`} />} />
    </Routes>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AppRoutes />
    </div>
  );
}

export default App;