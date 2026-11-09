
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../utils/subscription';
import { isValidSessionUser, publicSessionUser } from '../utils/localAuth';

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
  subscription?: Subscription | null;
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
    const syncSession = () => {
      const token = localStorage.getItem('rise_session_token');
      const userData = localStorage.getItem('rise_user_data');
      if (token && userData) {
        try {
          const parsed = JSON.parse(userData);
          if (!isValidSessionUser(parsed)) throw new Error('Invalid local session');
          const safe = publicSessionUser(parsed);
          if ('password' in parsed || 'confirmPassword' in parsed || 'passwordCredential' in parsed) localStorage.setItem('rise_user_data', JSON.stringify(safe));
          setUser(safe);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Failed to parse user data', e);
          localStorage.removeItem('rise_session_token');
          localStorage.removeItem('rise_user_data');
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'rise_session_token' || event.key === 'rise_user_data') syncSession();
    };
    syncSession();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (userData: User, token: string) => {
    if (!isValidSessionUser(userData)) throw new Error('Compte local invalide.');
    const safeUser = publicSessionUser(userData);
    localStorage.setItem('rise_user_data', JSON.stringify(safeUser));
    localStorage.setItem('rise_session_token', token);
    setUser(safeUser);
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
    const updatedUser = publicSessionUser({ ...user, ...updates });
    setUser(updatedUser);
    localStorage.setItem('rise_user_data', JSON.stringify(updatedUser));
    
    // 2. Mise à jour de la "Base de Données" (rise_db_users)
    const dbUsersStr = localStorage.getItem('rise_db_users');
    if (dbUsersStr) {
        try {
            const dbUsers = JSON.parse(dbUsersStr);
            if (!Array.isArray(dbUsers)) return;
            // Ne jamais faire correspondre deux adresses absentes ni deux IDs différents.
            const userIndex = dbUsers.findIndex((u: User) => {
                if (!u) return false;
                if (u.id != null && user.id != null) return String(u.id) === String(user.id);
                return Boolean(u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase());
            });
            if (userIndex !== -1) {
                dbUsers[userIndex] = { ...dbUsers[userIndex], ...updates };
                localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
            }
        } catch (error) {
            console.error('Impossible de mettre à jour les données locales du compte', error);
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
