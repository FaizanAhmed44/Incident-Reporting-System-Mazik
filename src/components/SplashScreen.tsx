import React, { useEffect, useState } from 'react';
import { Building2, Zap, Shield, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { theme } = useTheme();

  const features = [
    { icon: Zap, text: 'AI-Powered Analysis', color: 'text-blue-600' },
    { icon: Shield, text: 'Secure Authentication', color: 'text-green-600' },
    { icon: Users, text: 'Team Collaboration', color: 'text-purple-600' },
    { icon: Building2, text: 'Enterprise Ready', color: 'text-orange-600' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const featureTimer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(featureTimer);
    };
  }, [onComplete]);

  const CurrentIcon = features[currentFeature].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="text-center max-w-xs sm:max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl shadow-2xl">
              <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-green-400 to-green-500 p-1.5 sm:p-2 rounded-full shadow-lg">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Incident Portal
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          AI-Powered Ticket Management System
        </p>

        {/* Feature Animation */}
        <div className="mb-6 sm:mb-8 h-12 sm:h-16 flex items-center justify-center">
          <div className="flex items-center space-x-2 sm:space-x-3 transition-all duration-500 ease-in-out">
            <div className={`p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-500 ${features[currentFeature].color.replace('text-', 'bg-').replace('-600', '-100')}`}>
              <CurrentIcon className={`h-4 w-4 sm:h-6 sm:w-6 transition-colors duration-500 ${features[currentFeature].color}`} />
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 transition-opacity duration-500">
              {features[currentFeature].text}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-1.5 sm:h-2 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {progress < 30 ? 'Initializing system...' :
           progress < 60 ? 'Loading AI models...' :
           progress < 90 ? 'Preparing workspace...' :
           'Almost ready...'}
        </p>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300 dark:bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 dark:bg-green-300 rounded-full opacity-40 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-300 dark:bg-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-orange-400 dark:bg-orange-300 rounded-full opacity-60 animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;