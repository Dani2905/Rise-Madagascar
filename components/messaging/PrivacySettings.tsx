import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PrivacyMode, useMessaging } from '../../context/MessagingContext';

const PrivacySettings: React.FC = () => {
  const { user } = useAuth();
  const { privacy, contacts, setPrivacy, setDiscoverable, setDiscoverableByRecruiters, setBlocked, error } = useMessaging();
  const [notice, setNotice] = useState(''), [failure, setFailure] = useState('');
  const apply = (result: {ok: true} | {ok: false; error: string}) => {
    setFailure('error' in result ? result.error : ''); setNotice(result.ok ? 'Réglage enregistré dans ce navigateur.' : '');
  };
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900">Confidentialité de la messagerie</h3>
    <p className="mt-2 text-sm text-slate-600">Les nouvelles demandes nécessitent votre accord. Ces réglages locaux ne protègent pas les données contre une personne ayant accès au navigateur.</p>
    <label htmlFor="contact-privacy" className="mt-4 block text-sm font-bold text-slate-700">Qui peut m’envoyer une nouvelle demande ?</label>
    <select id="contact-privacy" disabled={!!error} value={privacy.mode} onChange={e => apply(setPrivacy(e.target.value as PrivacyMode))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <option value="everyone">Tous les comptes locaux</option>
      {user?.role === 'student' && <option value="projects">Uniquement depuis mes projets</option>}
      <option value="nobody">Personne</option>
    </select>
    {user?.role !== 'student' && <p className="mt-2 text-xs text-slate-500">En plus de ce réglage, seuls les candidats acceptés ou les étudiants que vous avez contactés en premier peuvent vous écrire. Une proposition de soutien à leur projet compte comme prise de contact.</p>}
    <p className="mt-2 text-xs text-slate-500">Ce choix concerne les nouvelles demandes, pas les échanges déjà acceptés. Les coordonnées ne sont pas insérées automatiquement dans les messages.</p>
    {user?.role === 'student' && <div className="mt-5 rounded-xl bg-slate-50 p-4"><label className="flex items-start gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={privacy.discoverable === true} disabled={!!error} onChange={e => apply(setDiscoverable(e.target.checked))} className="mt-1" /> Apparaître dans la recherche entre étudiants</label><p className="mt-2 text-xs leading-relaxed text-slate-500">Désactivé par défaut. Les autres étudiants de ce navigateur pourront trouver votre nom, formation et compétences et ouvrir votre aperçu public. Les champs e-mail, téléphone et candidatures ne sont pas affichés, mais évitez d’inscrire des coordonnées dans vos textes publics. Ce réglage ne masque pas les liens publics existants ni la liste des destinataires de la messagerie ; il ne constitue pas une protection sécurisée.</p></div>}
    {user?.role === 'student' && <div className="mt-3 rounded-xl bg-slate-50 p-4"><label className="flex items-start gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={privacy.discoverableByRecruiters === true} disabled={!!error} onChange={e => apply(setDiscoverableByRecruiters(e.target.checked))} className="mt-1" /> Apparaître dans la recherche des entreprises et particuliers</label><p className="mt-2 text-xs leading-relaxed text-slate-500">Désactivé par défaut, indépendamment de la recherche entre étudiants. Les recruteurs connectés dans ce navigateur pourront trouver votre nom, formation et compétences et consulter votre aperçu public. L’e-mail, le téléphone et les candidatures ne sont pas affichés automatiquement ; vérifiez aussi les informations saisies librement dans votre profil. Ce réglage ne masque pas les liens directs existants et ne sécurise pas les données locales.</p></div>}
    <h4 className="mt-5 text-sm font-bold text-slate-700">Comptes bloqués</h4>
    {privacy.blocked.length ? <ul className="mt-2 space-y-2">{privacy.blocked.map(id => <li key={id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{contacts.find(c => c.id === id)?.name || `Compte local ${id}`}</span><button type="button" onClick={() => apply(setBlocked(id,false))} className="font-bold text-amber-700 underline">Débloquer</button></li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Aucun compte bloqué.</p>}
    <p className="mt-2 text-xs text-slate-500">Un blocage empêche les nouveaux échanges dans les deux sens. Débloquer rétablit les échanges précédemment acceptés.</p>
    {failure && <p role="alert" className="mt-3 text-sm text-red-700">{failure}</p>}{notice && <p role="status" className="mt-3 text-sm text-green-700">{notice}</p>}
  </section>;
};
export default PrivacySettings;
