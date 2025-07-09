// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import SplashScreen from './components/SplashScreen';
// import Login from './components/Login';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import SupportDashboard from './components/SupportDashboard';
// import AdminDashboard from './components/AdminDashboard';

// function AppRoutes() {
//   const { user } = useAuth();

//   if (!user) {
//     return <Login />;
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
//       <Route path="/employee/*" element={user.role === 'employee' ? <EmployeeDashboard /> : <Navigate to={`/${user.role}`} />} />
//       <Route path="/support/*" element={user.role === 'support' ? <SupportDashboard /> : <Navigate to={`/${user.role}`} />} />
//       <Route path="/admin/*" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to={`/${user.role}`} />} />
//     </Routes>
//   );
// }

// function App() {
//   const [showSplash, setShowSplash] = useState(true);

//   const handleSplashComplete = () => {
//     setShowSplash(false);
//   };

//   if (showSplash) {
//     return <SplashScreen onComplete={handleSplashComplete} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//       <AppRoutes />
//     </div>
//   );
// }

// export default App;



// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import SplashScreen from './components/SplashScreen';
// import Login from './components/Login';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import SupportDashboard from './components/SupportDashboard';
// import AdminDashboard from './components/AdminDashboard';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user } = useAuth();
//   console.log('ProtectedRoute user:', user); // Debugging log
//   return user ? <>{children}</> : <Navigate to="/login" replace />;
// };

// const AppRoutes: React.FC = () => {
//   const { user } = useAuth();
//   console.log('AppRoutes user:', user); // Debugging log

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/employee/*"
//         element={
//           <ProtectedRoute>
//             {user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" replace />}
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/support/*"
//         element={
//           <ProtectedRoute>
//             {user?.role === 'support' ? <SupportDashboard /> : <Navigate to="/login" replace />}
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/*"
//         element={
//           <ProtectedRoute>
//             {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
//     </Routes>
//   );
// };

// const App: React.FC = () => {
//   const { user } = useAuth();
//   const [showSplash, setShowSplash] = useState(!user); // Skip splash if user is logged in

//   const handleSplashComplete = () => {
//     console.log('Splash screen complete, rendering AppRoutes'); // Debugging log
//     setShowSplash(false);
//   };

//   useEffect(() => {
//     console.log('App user state:', user); // Debugging log
//     if (user) {
//       setShowSplash(false); // Hide splash screen if user is logged in
//     }
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//       {showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <AppRoutes />}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import SupportDashboard from './components/SupportDashboard';
import AdminDashboard from './components/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  console.log('ProtectedRoute user:', user); // Debugging log
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  console.log('AppRoutes user:', user); // Debugging log
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute>
            {user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" replace />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/*"
        element={
          <ProtectedRoute>
            {user?.role === 'support' ? <SupportDashboard /> : <Navigate to="/login" replace />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(!user); // Skip splash if user is logged in

  const handleSplashComplete = () => {
    console.log('Splash screen complete, rendering AppRoutes'); // Debugging log
    setShowSplash(false);
  };

  useEffect(() => {
    console.log('App user state:', user); // Debugging log
    if (user) {
      setShowSplash(false); // Hide splash screen if user is logged in
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <AppRoutes />}
    </div>
  );
};

export default App;