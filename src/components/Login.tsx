import React, { useState } from 'react';
import { Building2, Loader2, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (type: string) => {
    setIsLoading(true);
    const credentials = {
      employee: { email: 'employee@company.com', password: 'password' },
      support: { email: 'support@company.com', password: 'password' },
      admin: { email: 'admin@company.com', password: 'password' }
    };
    
    const cred = credentials[type as keyof typeof credentials];
    login(cred.email, cred.password).finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-24 h-24 xl:w-32 xl:h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-16 h-16 xl:w-24 xl:h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-32 h-32 xl:w-40 xl:h-40 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6 xl:mb-8">
            <div className="bg-white/20 p-2.5 xl:p-3 rounded-xl backdrop-blur-sm">
              <Building2 className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl xl:text-2xl font-bold text-white">Incident Portal</h1>
              <p className="text-sm xl:text-base text-blue-100">Enterprise Solution</p>
            </div>
          </div>

          <div className="space-y-4 xl:space-y-6">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Streamline Your<br />
              Incident Management
            </h2>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              AI-powered ticket routing, real-time collaboration, and intelligent analytics 
              for modern enterprise support teams.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 xl:gap-6">
          <div className="flex items-center space-x-3 xl:space-x-4 text-white">
            <div className="bg-white/20 p-1.5 xl:p-2 rounded-lg backdrop-blur-sm">
              <Zap className="h-4 w-4 xl:h-5 xl:w-5" />
            </div>
            <div>
              <h3 className="text-sm xl:text-base font-semibold">AI-Powered Analysis</h3>
              <p className="text-xs xl:text-sm text-blue-100">Intelligent ticket classification and routing</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 xl:space-x-4 text-white">
            <div className="bg-white/20 p-1.5 xl:p-2 rounded-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 xl:h-5 xl:w-5" />
            </div>
            <div>
              <h3 className="text-sm xl:text-base font-semibold">Enterprise Security</h3>
              <p className="text-xs xl:text-sm text-blue-100">Azure AD integration with SSO</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 xl:space-x-4 text-white">
            <div className="bg-white/20 p-1.5 xl:p-2 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4 xl:h-5 xl:w-5" />
            </div>
            <div>
              <h3 className="text-sm xl:text-base font-semibold">Team Collaboration</h3>
              <p className="text-xs xl:text-sm text-blue-100">Real-time updates and notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-2.5 sm:p-3 rounded-xl">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Incident Portal</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="hidden lg:flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-2.5 sm:p-3 rounded-xl">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Azure AD Branding */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Secured by Microsoft Azure AD</span>
              </div>
            </div>

            {/* Demo Quick Login */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">Demo Access:</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => quickLogin('employee')}
                  disabled={isLoading}
                  className="w-full text-xs sm:text-sm py-2 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  Employee Portal
                </button>
                <button
                  onClick={() => quickLogin('support')}
                  disabled={isLoading}
                  className="w-full text-xs sm:text-sm py-2 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  Support Team
                </button>
                <button
                  onClick={() => quickLogin('admin')}
                  disabled={isLoading}
                  className="w-full text-xs sm:text-sm py-2 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  Administrator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;