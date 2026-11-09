import React, { useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FloatingInput } from '../FloatingInput';
import { createPasswordCredential, normalizeEmail, readLocalUsers, verifyLocalPassword } from '../../utils/localAuth';

const PasswordCard: React.FC = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState({ current: '', next: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || busy.current) return;
    setMessage(''); setError('');
    if (fields.next.length < 8 || fields.next.length > 1024) { setError('Le nouveau mot de passe doit contenir entre 8 et 1024 caractères.'); return; }
    if (fields.next !== fields.confirm) { setError('Les nouveaux mots de passe ne correspondent pas.'); return; }
    busy.current = true; setSaving(true);
    try {
      let users = readLocalUsers();
      const matches = users.filter(u => u?.id != null && String(u.id) === String(user.id) && typeof u.email === 'string' && !!user.email && normalizeEmail(u.email) === normalizeEmail(user.email));
      if (matches.length !== 1 || !(await verifyLocalPassword(matches[0], fields.current))) throw new Error('Mot de passe actuel incorrect ou compte local introuvable.');
      const original = JSON.stringify({ credential: matches[0].passwordCredential, password: matches[0].password });
      const credential = await createPasswordCredential(fields.next);
      users = readLocalUsers();
      const index = users.findIndex(u => u?.id != null && String(u.id) === String(user.id) && typeof u.email === 'string' && !!user.email && normalizeEmail(u.email) === normalizeEmail(user.email));
      if (index < 0 || JSON.stringify({ credential: users[index].passwordCredential, password: users[index].password }) !== original) throw new Error('Le compte a changé. Réessayez.');
      const session = JSON.parse(localStorage.getItem('rise_user_data') || 'null');
      if (!localStorage.getItem('rise_session_token') || !session || String(session.id) !== String(user.id)) throw new Error('Votre session a changé. Reconnectez-vous.');
      const updated = { ...users[index], passwordCredential: credential };
      delete updated.password; delete updated.confirmPassword;
      users[index] = updated;
      localStorage.setItem('rise_db_users', JSON.stringify(users));
      setFields({ current: '', next: '', confirm: '' });
      setMessage('Mot de passe local mis à jour pour ce navigateur.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Modification impossible.'); }
    finally { busy.current = false; setSaving(false); }
  };
  return <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
    <h3 className="font-heading font-bold text-lg text-slate-900 mb-3 flex items-center gap-2"><Lock className="text-primary" size={20} /> Mot de passe local</h3>
    <p className="text-xs text-slate-500 mb-5">Démonstration uniquement : aucune sécurité serveur ni récupération par e-mail. N’utilisez pas de mot de passe réel ou réutilisé.</p>
    <form onSubmit={submit} className="max-w-md">
      <FloatingInput id="local-current-password" label="Mot de passe actuel" type="password" autoComplete="current-password" required value={fields.current} onChange={e => setFields({ ...fields, current: e.target.value })} />
      <FloatingInput id="local-new-password" label="Nouveau mot de passe" type="password" autoComplete="new-password" minLength={8} maxLength={1024} required value={fields.next} onChange={e => setFields({ ...fields, next: e.target.value })} />
      <FloatingInput id="local-confirm-password" label="Confirmer le nouveau mot de passe" type="password" autoComplete="new-password" minLength={8} maxLength={1024} required value={fields.confirm} onChange={e => setFields({ ...fields, confirm: e.target.value })} />
      {error && <p role="alert" className="text-sm text-red-700 mb-3">{error}</p>}{message && <p role="status" className="text-sm text-green-700 mb-3">{message}</p>}
      <button type="submit" disabled={saving} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm disabled:opacity-50">{saving ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}</button>
    </form>
  </section>;
};
export default PasswordCard;
