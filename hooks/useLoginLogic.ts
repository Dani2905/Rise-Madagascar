import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, User } from '../context/AuthContext';
import { MOCK_STUDENT_PROFILE } from '../data/studentData';
import { createPasswordCredential, DEMO_EMAIL_ROLES, DEMO_PASSWORD, isValidSessionUser, normalizeEmail, publicSessionUser, readLocalUsers, returnPathForRole, verifyLocalPassword } from '../utils/localAuth';

const DEMO_IDENTITIES = {
  student: { id: 999, email: 'etudiant@rise.mg', firstName: 'Rary', lastName: 'Rakoto', role: 'student', title: 'Étudiant en Informatique', avatarUrl: 'https://ui-avatars.com/api/?name=Rary+Rakoto&background=0f172a&color=fff' },
  company: { id: 1, email: 'pro@rise.mg', firstName: 'Sarah', lastName: 'Andria', role: 'company', companyName: 'TechMada Solutions', industry: 'Tech', companySize: '51-200', location: 'Antananarivo', description: 'Profil d’entreprise de démonstration.' },
  individual: { id: 102, email: 'perso@rise.mg', firstName: 'Mme', lastName: 'Ravaka', role: 'individual', companyName: 'Famille Ravaka', location: 'Ambatobe, Antananarivo', bio: 'Profil particulier de démonstration.' }
} as const;

export const useLoginLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };
  const fillDemoCredentials = (role: 'student' | 'company' | 'individual') => {
    setFormData({ email: DEMO_IDENTITIES[role].email, password: DEMO_PASSWORD });
    setError('');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setIsSubmitting(true); setError('');
    try {
      const email = normalizeEmail(formData.email);
      const password = formData.password;
      if (!email || !password || password.length > 1024) throw new Error('Adresse e-mail ou mot de passe incorrect.');
      let users = readLocalUsers();
      const matching = users.filter(u => typeof u?.email === 'string' && normalizeEmail(u.email) === email);
      if (matching.length > 1) throw new Error('Plusieurs comptes locaux utilisent cette adresse. Connexion interrompue pour éviter de choisir le mauvais compte.');
      let account: any = matching[0];
      if (!account && DEMO_EMAIL_ROLES[email]) {
        if (password !== DEMO_PASSWORD) throw new Error('Adresse e-mail ou mot de passe incorrect.');
        const role = DEMO_EMAIL_ROLES[email];
        const identity = DEMO_IDENTITIES[role];
        const idTaken = users.some(u => u?.id != null && String(u.id) === String(identity.id));
        const uniqueId = idTaken ? `demo-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : identity.id;
        account = { ...(role === 'student' ? MOCK_STUDENT_PROFILE : {}), ...identity, id: uniqueId, isDemo: true };
        users.push(account);
        localStorage.setItem('rise_db_users', JSON.stringify(users));
        // Offres fictives pour illustrer le tableau de bord entreprise ; ne jamais écraser une liste illisible.
        if (role === 'company') {
          try {
            const raw = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
            if (Array.isArray(raw) && !raw.some((j: any) => j?.ownerId != null && String(j.ownerId) === String(uniqueId))) {
              const base = { ownerId: uniqueId, company: account.companyName, location: 'Antananarivo', province: 'Antananarivo', status: 'Actif', candidates: 0, isDemo: true, remote: false, isUrgent: false, postedAt: 'Exemple', logoUrl: '', salary: 'À discuter' };
              const seeds = [
                { ...base, id: `demo-${uniqueId}-job-1`, title: 'Développeur Fullstack React/Node', type: 'CDI', description: 'Exemple de mission de développement logiciel.', tags: ['Tech', 'React'] },
                { ...base, id: `demo-${uniqueId}-job-2`, title: 'Stagiaire assistant RH', type: 'Stage', description: 'Exemple de stage en ressources humaines.', tags: ['RH', 'Stage'] }
              ];
              localStorage.setItem('rise_jobs', JSON.stringify([...seeds, ...raw]));
            }
          } catch { /* le compte reste utilisable si les offres locales sont illisibles */ }
        }
      }
      if (!account || !isValidSessionUser(account) || !(await verifyLocalPassword(account, password))) throw new Error('Adresse e-mail ou mot de passe incorrect.');
      // Les anciens comptes locaux en clair sont migrés uniquement après une vérification réussie.
      if (typeof account.password === 'string' && account.password && !account.passwordCredential) {
        const credential = await createPasswordCredential(password);
        users = readLocalUsers();
        const index = users.findIndex(u => u?.id != null && String(u.id) === String(account.id) && typeof u.email === 'string' && normalizeEmail(u.email) === email);
        if (index < 0 || users[index].password !== account.password) throw new Error('Ce compte a changé pendant la connexion. Réessayez.');
        account = { ...users[index], passwordCredential: credential };
        delete account.password; delete account.confirmPassword;
        users[index] = account;
        localStorage.setItem('rise_db_users', JSON.stringify(users));
      }
      login(publicSessionUser(account) as User, `demo-${Date.now()}`);
      navigate(returnPathForRole(location.state?.returnTo, account.role), { replace: true, state: location.state?.returnState });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion locale impossible. Veuillez réessayer.');
    } finally {
      submitting.current = false; setIsSubmitting(false);
    }
  };
  return { formData, isSubmitting, error, handleInputChange, fillDemoCredentials, handleSubmit };
};
