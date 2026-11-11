
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../utils/subscription';
import { isValidSessionUser, publicSessionUser } from '../utils/localAuth';
import { prepareDemoStudentSession } from '../utils/demoStudent';
import { prepareDemoCompanySession } from '../utils/demoCompany';

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
          const safe = publicSessionUser(prepareDemoCompanySession(prepareDemoStudentSession(parsed)));
          if (JSON.stringify(safe) !== JSON.stringify(parsed)) {
            try { localStorage.setItem('rise_user_data', JSON.stringify(safe)); }
            catch { /* Le profil peut être affiché même si la session ne peut pas être mise à jour. */ }
          }
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
    const safeUser = publicSessionUser(prepareDemoCompanySession(prepareDemoStudentSession(userData)));
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

    const sessionRaw = localStorage.getItem('rise_user_data');
    const databaseRaw = localStorage.getItem('rise_db_users');
    let session: any, dbUsers: any[] | null = null;
    try {
      session = JSON.parse(sessionRaw || 'null');
      if (!localStorage.getItem('rise_session_token') || !session || String(session.id) !== String(user.id)) throw new Error('La session a changé. Reconnectez-vous.');
      if (databaseRaw !== null) {
        dbUsers = JSON.parse(databaseRaw);
        if (!Array.isArray(dbUsers)) throw new Error('Les comptes locaux sont illisibles.');
      }
    } catch { throw new Error('Impossible de modifier le profil : session ou comptes locaux indisponibles.'); }
    const index = dbUsers ? dbUsers.findIndex((u: User) => {
      if (!u) return false;
      if (u.id != null && user.id != null) return String(u.id) === String(user.id);
      return Boolean(u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase());
    }) : -1;
    const updatedUser = publicSessionUser({ ...session, ...(index >= 0 ? dbUsers![index] : {}), ...updates });
    if (dbUsers && index >= 0) dbUsers[index] = { ...dbUsers[index], ...updates };
    try {
      if (dbUsers && index >= 0) localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
      localStorage.setItem('rise_user_data', JSON.stringify(updatedUser));
    } catch (error) {
      // Restaurer le premier enregistrement si le second a échoué, dans la mesure du possible.
      try { if (databaseRaw !== null) localStorage.setItem('rise_db_users', databaseRaw); } catch { /* stockage indisponible */ }
      throw error;
    }
    setUser(updatedUser);
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
