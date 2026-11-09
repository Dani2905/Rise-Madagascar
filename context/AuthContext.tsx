
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  firstName: string;
  lastName: string;
  role: 'student' | 'company' | 'individual';
  email?: string;
  avatarUrl?: string;
  companyName?: string;
  logoUrl?: string;
  location?: string;
  hasSubscription?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rise_session_token');
    const userData = localStorage.getItem('rise_user_data');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('rise_session_token');
        localStorage.removeItem('rise_user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('rise_session_token', token);
    localStorage.setItem('rise_user_data', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('rise_session_token');
    localStorage.removeItem('rise_user_data');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    // 1. Mise à jour de l'état local et session
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('rise_user_data', JSON.stringify(updatedUser));
    
    // 2. Mise à jour de la "Base de Données" (rise_db_users)
    const dbUsersStr = localStorage.getItem('rise_db_users');
    if (dbUsersStr) {
        const dbUsers = JSON.parse(dbUsersStr);
        // On cherche par ID (plus fiable) ou par Email (fallback)
        const userIndex = dbUsers.findIndex((u: User) => 
            (u.id && user.id && u.id.toString() === user.id.toString()) || 
            (u.email === user.email)
        );

        if (userIndex !== -1) {
            // Fusionner les données existantes en DB avec les nouvelles mises à jour
            dbUsers[userIndex] = { ...dbUsers[userIndex], ...updates };
            localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
        }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
