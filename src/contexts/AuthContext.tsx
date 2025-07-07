import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'support' | 'admin';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate Azure AD authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    let mockUser: User;
    if (email.includes('admin')) {
      mockUser = {
        id: '1',
        name: 'Admin User',
        email,
        role: 'admin'
      };
    } else if (email.includes('support')) {
      mockUser = {
        id: '2',
        name: 'Support Agent',
        email,
        role: 'support',
        department: 'IT Support'
      };
    } else {
      mockUser = {
        id: '3',
        name: 'John Employee',
        email,
        role: 'employee',
        department: 'Sales'
      };
    }
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};