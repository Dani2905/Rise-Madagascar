import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Message } from '../types';
import { readLocalArray } from '../utils/recruiterDashboard';
import { getCurrentLocalSession } from '../utils/subscription';
import { isDemoRecruiter } from '../utils/demoRecruiter';
import { getPublicProjects } from '../utils/projects';
import { getPublicStudent, PublicStudent } from '../utils/publicStudent';
import { canStudentContactRecruiter } from '../utils/recruiterMessaging';

export interface MailContact { id: string; name: string; role: string; isDemo: boolean; }
type MailResult = { ok: true; id: string } | { ok: false; error: string };
export type PrivacyMode = 'everyone' | 'projects' | 'nobody';
export interface MailPrivacy { ownerId: string; mode: PrivacyMode; blocked: string[]; discoverable?: boolean; discoverableByRecruiters?: boolean; }
export interface StudentDirectoryEntry { profile: PublicStudent; mode: PrivacyMode; }
const readPrivacy = (): MailPrivacy[] => {
  const entries = readLocalArray('rise_mail_privacy'); const ids = new Set<string>();
  for (const e of entries) { if (!e || typeof e.ownerId !== 'string' || !e.ownerId || !['everyone','projects','nobody'].includes(e.mode) || !Array.isArray(e.blocked) || e.blocked.some((x: unknown) => typeof x !== 'string' || !x) || (e.discoverable != null && typeof e.discoverable !== 'boolean') || (e.discoverableByRecruiters != null && typeof e.discoverableByRecruiters !== 'boolean') || ids.has(e.ownerId)) throw new Error(); ids.add(e.ownerId); }
  return entries;
};
const privacyFor = (entries: MailPrivacy[], id: string | number): MailPrivacy => entries.find(e => e.ownerId === String(id)) || { ownerId: String(id), mode: 'everyone', blocked: [] };
type ReadResult = { ok: true } | { ok: false; error: string };
interface MessagingContextType {
  messages: Message[];
  contacts: MailContact[];
  studentDirectory: StudentDirectoryEntry[];
  unreadTotal: number;
  error: string;
  privacy: MailPrivacy;
  setPrivacy: (mode: PrivacyMode) => ReadResult;
  setDiscoverable: (visible: boolean) => ReadResult;
  setDiscoverableByRecruiters: (visible: boolean) => ReadResult;
  setBlocked: (id: string, blocked: boolean) => ReadResult;
  decideRequest: (id: string | number, accept: boolean) => ReadResult;
  reportMessage: (id: string | number) => ReadResult;
  sendMail: (receiverId: string, subject: string, content: string, replyTo?: string | number, projectId?: string) => MailResult;
  markMessageAsRead: (id: string | number) => ReadResult;
  refreshMessages: () => void;
}
const MessagingContext = createContext<MessagingContextType | undefined>(undefined);
const readMessages = (): Message[] => {
  const messages = readLocalArray('rise_messages');
  const validId = (v: unknown) => (typeof v === 'string' && !!v.trim()) || (typeof v === 'number' && Number.isFinite(v));
  const ids = new Set<string>();
  for (const m of messages) {
    if (!m || !validId(m.id) || !validId(m.senderId) || !validId(m.receiverId) || typeof m.content !== 'string' || typeof m.timestamp !== 'string' || (m.subject != null && typeof m.subject !== 'string') || (m.requestStatus != null && !['pending', 'accepted', 'declined'].includes(m.requestStatus)) || (m.projectId != null && typeof m.projectId !== 'string') || ids.has(String(m.id))) throw new Error();
    ids.add(String(m.id));
  }
  return messages;
};
const displayName = (u: any) => u.role === 'company' && typeof u.companyName === 'string' && u.companyName.trim() ? u.companyName.trim() : [u.firstName, u.lastName].filter(v => typeof v === 'string' && v.trim()).map(v => v.trim()).join(' ') || 'Compte local';
export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<MailContact[]>([]);
  const [studentDirectory, setStudentDirectory] = useState<StudentDirectoryEntry[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [error, setError] = useState('');
  const [privacy, setPrivacyState] = useState<MailPrivacy>({ownerId: '', mode: 'everyone', blocked: []});
  const refreshMessages = () => {
    if (!user) { setMessages([]); setContacts([]); setStudentDirectory([]); setUnreadTotal(0); setError(''); return; }
    try {
      const stored = readMessages(), dbUsers = readLocalArray('rise_db_users'), privacyEntries = readPrivacy();
      setPrivacyState(privacyFor(privacyEntries, user.id));
      const idCounts = new Map<string, number>();
      dbUsers.forEach(u => { if (u?.id != null) idCounts.set(String(u.id), (idCounts.get(String(u.id)) || 0) + 1); });
      const visible = stored.filter(m => String(m.senderId) === String(user.id) || String(m.receiverId) === String(user.id));
      const people = dbUsers.filter(u => u?.id != null && String(u.id).trim() && String(u.id) !== String(user.id) && idCounts.get(String(u.id)) === 1 && ['student', 'company', 'individual'].includes(u.role)).map(u => ({ id: String(u.id), name: displayName(u), role: u.role, isDemo: isDemoRecruiter(u) || (u.role === 'student' && typeof u.email === 'string' && u.email.trim().toLowerCase() === 'etudiant@rise.mg') }));
      const myPrivacy = privacyFor(privacyEntries,user.id);
      const viewer = dbUsers.filter(u => u?.id != null && String(u.id) === String(user.id));
      const maySearch = ['student','company','individual'].includes(user.role) && !!getCurrentLocalSession(user) && viewer.length === 1 && viewer[0].role === user.role;
      const directory: StudentDirectoryEntry[] = maySearch ? people.filter(p => p.role === 'student').flatMap(p => {
        const policy = privacyFor(privacyEntries,p.id);
        if ((user.role === 'student' ? policy.discoverable !== true : policy.discoverableByRecruiters !== true) || myPrivacy.blocked.includes(p.id) || policy.blocked.includes(String(user.id))) return [];
        const profile = getPublicStudent(p.id);
        return profile ? [{profile, mode: policy.mode}] : [];
      }) : [];
      setStudentDirectory(directory);
      people.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      setMessages(visible); setContacts(people);
      setUnreadTotal(visible.filter(m => String(m.receiverId) === String(user.id) && !m.read).length);
      setError('');
    } catch { setMessages([]); setContacts([]); setStudentDirectory([]); setUnreadTotal(0); setError('Les messages ou les comptes locaux sont illisibles. Aucune donnée n’a été modifiée.'); }
  };
  useEffect(() => {
    refreshMessages();
    const interval = window.setInterval(refreshMessages, 2000);
    window.addEventListener('storage', refreshMessages); window.addEventListener('focus', refreshMessages);
    return () => { window.clearInterval(interval); window.removeEventListener('storage', refreshMessages); window.removeEventListener('focus', refreshMessages); };
  }, [user]);
  const sendMail = (receiverId: string, subject: string, content: string, replyTo?: string | number, projectId?: string): MailResult => {
    try {
      if (!user || !getCurrentLocalSession(user)) return { ok: false, error: 'Votre session a changé. Reconnectez-vous avant d’enregistrer.' };
      if (!receiverId || String(receiverId) === String(user.id)) return { ok: false, error: 'Choisissez un autre compte local comme destinataire.' };
      if (!subject.trim() || subject.trim().length > 200) return { ok: false, error: 'Renseignez un objet de 200 caractères maximum.' };
      if (!content.trim() || content.length > 10000) return { ok: false, error: 'Rédigez un message de 10 000 caractères maximum.' };
      const users = readLocalArray('rise_db_users');
      const senders = users.filter(u => u?.id != null && String(u.id) === String(user.id));
      if (senders.length !== 1 || senders[0].role !== user.role) return { ok: false, error: 'Votre compte local est introuvable ou ambigu.' };
      const receivers = users.filter(u => u?.id != null && String(u.id) === String(receiverId));
      if (receivers.length !== 1 || !['student', 'company', 'individual'].includes(receivers[0].role)) return { ok: false, error: 'Ce destinataire local est introuvable ou ambigu.' };
      const all = readMessages(), policies = readPrivacy();
      const mine = privacyFor(policies, user.id), theirs = privacyFor(policies, receiverId);
      if (mine.blocked.includes(String(receiverId)) || theirs.blocked.includes(String(user.id))) return { ok: false, error: 'Cet échange est indisponible : un blocage est actif.' };
      const pair = all.filter(m => (String(m.senderId) === String(user.id) && String(m.receiverId) === String(receiverId)) || (String(m.senderId) === String(receiverId) && String(m.receiverId) === String(user.id)));
      const accepted = pair.some(m => m.requestStatus === 'accepted');
      if (['company','individual'].includes(receivers[0].role)) {
        if (user.role !== 'student') return {ok:false,error:'Les entreprises et particuliers ne peuvent être contactés que par un étudiant autorisé.'};
        if (!canStudentContactRecruiter(senders[0],receivers[0],users,pair)) return {ok:false,error:'Vous pouvez contacter ce recruteur si votre candidature chez lui a été acceptée, ou s’il vous a contacté en premier (notamment pour votre projet).'};
      }
      if (!accepted) {
        if (pair.some(m => m.requestStatus === 'pending')) return { ok: false, error: 'Une demande est déjà en attente entre ces comptes.' };
        if (pair.some(m => m.requestStatus === 'declined' && String(m.senderId) === String(user.id))) return { ok: false, error: 'Votre précédente demande a été refusée ; vous ne pouvez pas en envoyer une nouvelle.' };
        if (theirs.mode === 'nobody') return { ok: false, error: 'Ce compte ne reçoit pas de demandes de contact.' };
        if (theirs.mode === 'projects') {
          const rawProjects = readLocalArray('rise_custom_projects').filter(p => p && String(p.id) === String(projectId));
          const projects = getPublicProjects().filter(p => String(p.id) === String(projectId) && String(p.ownerId) === String(receiverId) && !p.isDemo);
          if (receivers[0].role !== 'student' || !projectId || rawProjects.length !== 1 || projects.length !== 1) return { ok: false, error: 'Ce compte accepte uniquement les demandes depuis la page d’un de ses projets.' };
        }
      }
      if (replyTo != null) {
        const matches = all.filter(m => String(m.id) === String(replyTo));
        if (matches.length !== 1) return { ok: false, error: 'Le message auquel vous répondez n’est plus disponible.' };
        const original = matches[0];
        const ownerIsSender = String(original.senderId) === String(user.id), ownerIsReceiver = String(original.receiverId) === String(user.id);
        const partner = ownerIsSender ? original.receiverId : original.senderId;
        if ((!ownerIsSender && !ownerIsReceiver) || String(partner) !== String(receiverId)) return { ok: false, error: 'Impossible de répondre à ce message.' };
      }
      let id = Date.now(); while (all.some(m => String(m.id) === String(id))) id++;
      const mail: Message = { id: String(id), senderId: user.id, receiverId, subject: subject.trim(), content: content.trim(), timestamp: new Date().toISOString(), read: false, ...(replyTo != null ? { replyTo } : {}), ...(!accepted ? { requestStatus: 'pending' as const } : {}), ...(projectId ? { projectId } : {}) };
      localStorage.setItem('rise_messages', JSON.stringify([...all, mail]));
      refreshMessages(); return { ok: true, id: String(id) };
    } catch { return { ok: false, error: 'Impossible d’enregistrer ce message : données locales illisibles ou stockage indisponible.' }; }
  };
  const updatePolicy = (change: (p: MailPrivacy) => MailPrivacy): ReadResult => {
    try {
      if (!user || !getCurrentLocalSession(user)) return {ok:false,error:'Votre session a changé. Reconnectez-vous.'};
      const entries = readPrivacy(), existing = privacyFor(entries, user.id), updated = change(existing);
      localStorage.setItem('rise_mail_privacy', JSON.stringify([...entries.filter(e => e.ownerId !== String(user.id)), updated]));
      refreshMessages(); return {ok:true};
    } catch { return {ok:false,error:'Impossible de modifier les réglages locaux.'}; }
  };
  const setPrivacy = (mode: PrivacyMode): ReadResult => {
    if (!['everyone','projects','nobody'].includes(mode) || (mode === 'projects' && user?.role !== 'student')) return {ok:false,error:'Réglage invalide.'};
    return updatePolicy(p => ({...p,mode}));
  };
  const setDiscoverable = (visible: boolean): ReadResult => {
    if (user?.role !== 'student' || typeof visible !== 'boolean') return {ok:false,error:'Réglage invalide.'};
    return updatePolicy(p => ({...p,discoverable:visible}));
  };
  const setDiscoverableByRecruiters = (visible: boolean): ReadResult => {
    if (user?.role !== 'student' || typeof visible !== 'boolean') return {ok:false,error:'Réglage invalide.'};
    return updatePolicy(p => ({...p,discoverableByRecruiters:visible}));
  };
  const setBlocked = (id: string, blocked: boolean): ReadResult => {
    if (!id || String(user?.id) === id) return {ok:false,error:'Compte invalide.'};
    return updatePolicy(p => ({...p, blocked: blocked ? [...new Set([...p.blocked,id])] : p.blocked.filter(x => x !== id)}));
  };
  const decideRequest = (id: string | number, accept: boolean): ReadResult => {
    try {
      if (!user || !getCurrentLocalSession(user)) return {ok:false,error:'Votre session a changé. Reconnectez-vous.'};
      const all = readMessages(), policies = readPrivacy(), matches = all.filter(m => String(m.id) === String(id));
      if (matches.length !== 1 || String(matches[0].receiverId) !== String(user.id) || matches[0].requestStatus !== 'pending') return {ok:false,error:'Cette demande ne peut plus être traitée.'};
      const m = matches[0];
      if (privacyFor(policies,user.id).blocked.includes(String(m.senderId)) || privacyFor(policies,m.senderId).blocked.includes(String(user.id))) return {ok:false,error:'Cet échange est bloqué.'};
      localStorage.setItem('rise_messages',JSON.stringify(all.map(item => item === m ? {...item, requestStatus: accept ? 'accepted' : 'declined'} : item)));
      refreshMessages(); return {ok:true};
    } catch {return {ok:false,error:'Impossible de traiter cette demande dans ce navigateur.'};}
  };
  const reportMessage = (id: string | number): ReadResult => {
    try {
      if (!user || !getCurrentLocalSession(user)) return {ok:false,error:'Votre session a changé. Reconnectez-vous.'};
      const all = readMessages(), matches = all.filter(m => String(m.id) === String(id));
      if (matches.length !== 1 || String(matches[0].receiverId) !== String(user.id)) return {ok:false,error:'Seul un message reçu peut être signalé.'};
      const reports = readLocalArray('rise_mail_reports');
      if (reports.some(r => !r || typeof r.reporterId !== 'string' || typeof r.messageId !== 'string' || typeof r.timestamp !== 'string')) throw new Error();
      if (reports.some(r => r.reporterId === String(user.id) && r.messageId === String(id))) return {ok:false,error:'Ce message est déjà signalé localement.'};
      localStorage.setItem('rise_mail_reports',JSON.stringify([...reports,{reporterId:String(user.id),messageId:String(id),timestamp:new Date().toISOString()}]));
      return {ok:true};
    } catch {return {ok:false,error:'Impossible d’enregistrer ce signalement local.'};}
  };
  const markMessageAsRead = (id: string | number): ReadResult => {
    try {
      if (!user || !getCurrentLocalSession(user)) return { ok: false, error: 'Votre session a changé. Reconnectez-vous.' };
      const all = readMessages(), matches = all.filter(m => String(m.id) === String(id));
      if (matches.length !== 1 || String(matches[0].receiverId) !== String(user.id)) return { ok: false, error: 'Ce message est introuvable ou ne vous est pas destiné.' };
      if (!matches[0].read) localStorage.setItem('rise_messages', JSON.stringify(all.map(m => m === matches[0] ? { ...m, read: true } : m)));
      refreshMessages(); return { ok: true };
    } catch { return { ok: false, error: 'Impossible de marquer ce message comme lu dans ce navigateur.' }; }
  };
  return <MessagingContext.Provider value={{ messages, contacts, studentDirectory, unreadTotal, error, privacy, setPrivacy, setDiscoverable, setDiscoverableByRecruiters, setBlocked, decideRequest, reportMessage, sendMail, markMessageAsRead, refreshMessages }}>{children}</MessagingContext.Provider>;
};
export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) throw new Error('useMessaging must be used within a MessagingProvider');
  return context;
};
