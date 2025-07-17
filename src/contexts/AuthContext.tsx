// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { loginUser } from '../api/authApi';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'employee' | 'support' | 'admin';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<User>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const storedUser = localStorage.getItem('user');
//     console.log('Initial user from localStorage:', storedUser); // Debugging log
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     console.log('Saving user to localStorage:', user); // Debugging log
//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//     }
//   }, [user]);

//   const login = async (email: string, password: string): Promise<User> => {
//     try {
//       const response = await loginUser({ email, password });
//       console.log('API response:', response); // Debugging log
//       if (response.status === 'success') {
//         const roleMap: { [key: string]: 'employee' | 'support' | 'admin' } = {
//           Employee: 'employee',
//           Staff: 'support',
//           Admin: 'admin',
//         };
//         const mappedRole = roleMap[response.role];
//         if (!mappedRole) {
//           throw new Error(`Invalid role: ${response.role}`);
//         }
//         const userData = {
//           id: response.userid,
//           name: response.username,
//           email,
//           role: mappedRole,
//         };
//         setUser(userData);
//         console.log('User set:', userData); // Debugging log
//         return userData;
//       } else {
//         throw new Error('Login failed: Invalid response status');
//       }
//     } catch (error) {
//       console.error('Login error:', error); // Debugging log
//       throw error;
//     }
//   };

//   const logout = () => {
//     console.log('Logging out, clearing user'); // Debugging log
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginUser } from "../api/authApi";

interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "support" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Initial user from localStorage:", storedUser); // Debugging log
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    console.log("Saving user to localStorage:", user); // Debugging log
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { user: response, id } = await loginUser({ email, password });
      if (response.status === "success") {
        const roleMap: { [key: string]: "employee" | "support" | "admin" } = {
          Employee: "employee",
          Staff: "support",
          Admin: "admin",
        };
        const mappedRole = roleMap[response.role];
        if (!mappedRole) {
          throw new Error(`Invalid role: ${response.role}`);
        }
        const userData = {
          id, // Use the dynamically assigned id (userid for Employee/Admin, staffid for Staff)
          name: response.username,
          email,
          role: mappedRole,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Store user with the correct id
        return userData;
      } else {
        throw new Error("Login failed: Invalid response status");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const logout = () => {
    console.log("Logging out, clearing user"); // Debugging log
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
