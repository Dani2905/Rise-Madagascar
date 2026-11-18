
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../utils/subscription';
import { isValidSessionUser, publicSessionUser } from '../utils/localAuth';
import { prepareDemoStudentSession } from '../utils/demoStudent';
import { prepareDemoCompanySession } from '../utils/demoCompany';
import { cloudAuthEnabled, getSupabase, authError } from '../utils/supabase';
import { cloudProfileFields } from '../utils/cloudProfile';

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
  saveProfile: (updates: Partial<User>) => Promise<void>;
  signInCloud?: (email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, updateUser, saveProfile: async (updates) => { updateUser(updates); } }}>
      {children}
    </AuthContext.Provider>
  );
};

// Supabase est l'autorité pour l'identité. Le miroir local ne sert qu'aux anciennes
// fonctionnalités de démonstration ; il ne confère aucun accès à la base distante.
const CloudAuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = React.useRef(0);
  const current = React.useRef<User | null>(null);
  const signingIn = React.useRef(false);
  const savingProfile = React.useRef(false);

  const clear = () => {
    localStorage.removeItem('rise_session_token'); localStorage.removeItem('rise_user_data');
    current.current = null; setUser(null);
  };
  const syncCloud = async (): Promise<User | null> => {
    const serial = ++requestId.current;
    const sb = getSupabase();
    const {data: identity, error: identityError} = await sb.auth.getUser();
    if (serial !== requestId.current) return null;
    if (identityError || !identity.user) { clear(); return null; }
    const {data: profile, error} = await sb.from('profiles').select('id,role,registration_data,profile_data').eq('id', identity.user.id).maybeSingle();
    if (serial !== requestId.current) return null;
    if (error || !profile || !['student','company','individual'].includes(profile.role)) throw new Error('Votre profil sécurisé est indisponible. Réessayez plus tard.');
    let accounts: any[];
    try { accounts = JSON.parse(localStorage.getItem('rise_db_users') || '[]'); if (!Array.isArray(accounts)) throw new Error(); }
    catch { throw new Error('Les données locales sont illisibles. Elles n’ont pas été modifiées.'); }
    const matches = accounts.filter(a => a && String(a.id) === profile.id);
    if (matches.length > 1) throw new Error('Des données locales ambiguës empêchent la connexion.');
    const details = profile.registration_data && typeof profile.registration_data === 'object' && !Array.isArray(profile.registration_data) ? profile.registration_data : {};
    const account: User = publicSessionUser({ ...details, ...(matches[0] || {}), ...cloudProfileFields(profile.role, profile.profile_data), id: profile.id, role: profile.role, email: identity.user.email || '', authProvider: 'supabase' });
    const previousUsers = localStorage.getItem('rise_db_users');
    try {
      if (!matches.length) accounts.push(account); else accounts[accounts.indexOf(matches[0])] = account;
      localStorage.setItem('rise_db_users', JSON.stringify(accounts));
      localStorage.setItem('rise_user_data', JSON.stringify(account));
      localStorage.setItem('rise_session_token', 'supabase-local-mirror');
    } catch {
      try { if (previousUsers === null) localStorage.removeItem('rise_db_users'); else localStorage.setItem('rise_db_users', previousUsers); } catch {}
      throw new Error('Impossible de préparer la session locale sur cet appareil.');
    }
    current.current = account; setUser(account); return account;
  };

  useEffect(() => {
    let alive = true;
    // Ne jamais restaurer une ancienne session locale comme une identité Supabase.
    clear();
    const sb = getSupabase();
    const {data: listener} = sb.auth.onAuthStateChange(() => {
      // Ne pas effectuer d'autres appels Supabase à l'intérieur du callback Auth.
      setTimeout(() => { if (alive && !signingIn.current) syncCloud().catch(() => { if (alive) clear(); }).finally(() => { if (alive) setIsLoading(false); }); }, 0);
    });
    return () => { alive = false; requestId.current++; listener.subscription.unsubscribe(); };
  }, []);

  const signInCloud = async (email: string, password: string): Promise<User> => {
    signingIn.current = true;
    try {
      const {error} = await getSupabase().auth.signInWithPassword({email, password});
      if (error) throw new Error(authError(error));
      const result = await syncCloud();
      if (!result) throw new Error('La session est en cours de vérification. Réessayez si nécessaire.');
      return result;
    } finally { signingIn.current = false; }
  };
  const logout = () => {
    requestId.current++; clear();
    void getSupabase().auth.signOut({scope:'local'}).then(({error}) => {
      if (error) { localStorage.removeItem('rise-supabase-auth'); localStorage.removeItem('rise-supabase-auth-code-verifier'); }
    }).catch(() => { localStorage.removeItem('rise-supabase-auth'); localStorage.removeItem('rise-supabase-auth-code-verifier'); });
  };
  const login = () => { throw new Error('Utilisez la connexion Supabase.'); };
  const updateUser = (updates: Partial<User>) => {
    const u = current.current;
    if (!u) throw new Error('La session a expiré.');
    let accounts: any[];
    try { accounts = JSON.parse(localStorage.getItem('rise_db_users') || '[]'); if (!Array.isArray(accounts)) throw new Error(); }
    catch { throw new Error('Les comptes locaux sont illisibles.'); }
    const i = accounts.findIndex(a => a && String(a.id) === String(u.id));
    const updated = publicSessionUser({ ...u, ...updates, id:u.id, role:u.role, email:u.email, authProvider:'supabase' });
    const raw = localStorage.getItem('rise_db_users');
    try {
      if (i >= 0) { accounts[i] = updated; localStorage.setItem('rise_db_users', JSON.stringify(accounts)); }
      localStorage.setItem('rise_user_data', JSON.stringify(updated));
    } catch (error) { try { if (raw !== null) localStorage.setItem('rise_db_users', raw); } catch {} throw error; }
    current.current = updated; setUser(updated);
  };
  const saveProfile = async (updates: Partial<User>) => {
    const original = current.current;
    if (!original) throw new Error('Votre session a expiré. Reconnectez-vous.');
    if (savingProfile.current) throw new Error('Un enregistrement est déjà en cours.');
    const changes = cloudProfileFields(original.role, updates);
    if (!Object.keys(changes).length) throw new Error('Aucun champ de profil à enregistrer.');
    savingProfile.current = true;
    try {
      let data: any, error: any;
      try { ({data,error} = await getSupabase().rpc('save_own_profile', {changes})); }
      catch { throw new Error('La connexion a été interrompue. Vérifiez votre profil avant de réessayer.'); }
      if (error || !data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Enregistrement impossible. Vérifiez votre connexion et les données saisies, puis réessayez.');
      if (!current.current || current.current.id !== original.id) throw new Error('Votre session a changé pendant l’enregistrement. Reconnectez-vous.');
      // Empêcher une lecture déclenchée avant cet enregistrement de remplacer les données plus récentes.
      requestId.current++;
      const merged = publicSessionUser({...current.current, ...cloudProfileFields(original.role,data), id:original.id, role:original.role, email:original.email, authProvider:'supabase'});
      current.current = merged; setUser(merged);
      // La base est déjà enregistrée ; une copie locale indisponible ne doit pas annuler ce succès.
      try {
        const accounts = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
        if (Array.isArray(accounts)) {
          const i = accounts.findIndex((a:any) => a && String(a.id) === String(original.id));
          if (i >= 0) { accounts[i] = merged; localStorage.setItem('rise_db_users', JSON.stringify(accounts)); }
        }
        localStorage.setItem('rise_user_data', JSON.stringify(merged));
      } catch { /* l'enregistrement serveur reste valide */ }
    } finally { savingProfile.current = false; }
  };
  return <AuthContext.Provider value={{user,isLoggedIn:!!user,isLoading,login,logout,updateUser,saveProfile,signInCloud}}>{children}</AuthContext.Provider>;
};
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => cloudAuthEnabled ? <CloudAuthProvider>{children}</CloudAuthProvider> : <LocalAuthProvider>{children}</LocalAuthProvider>;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
