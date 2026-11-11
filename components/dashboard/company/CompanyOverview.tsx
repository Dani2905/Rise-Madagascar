import React from 'react';
import { ArrowRight, BriefcaseBusiness, Check, Circle, ClipboardList, ExternalLink, Plus, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  user: any;
  activeJobsList: any[];
  candidatesList: any[];
  dataAvailable: boolean;
  changeTab: (tab: string) => void;
  setSelectedJobFilter: (id: string | null) => void;
  onCreateJob: () => void;
  onOpenCandidate: (candidate: any) => void;
  onChooseLogo: () => void;
  onChooseCover: () => void;
}
const hasText = (v: unknown) => typeof v === 'string' && !!v.trim();
const statusInfo: Record<string, { label: string; style: string }> = {
  pending: { label: 'Reçue', style: 'bg-blue-50 text-blue-700' },
  interview: { label: 'Entretien', style: 'bg-violet-50 text-violet-700' },
  accepted: { label: 'Acceptée', style: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Refusée', style: 'bg-red-50 text-red-700' },
  completed: { label: 'Terminée', style: 'bg-slate-100 text-slate-600' }
};
const timestamp = (v: any) => { const n = Date.parse(v?.appliedAt || ''); return Number.isFinite(n) ? n : 0; };

const CompanyOverview: React.FC<Props> = ({ user, activeJobsList, candidatesList, dataAvailable, changeTab, setSelectedJobFilter, onCreateJob, onOpenCandidate, onChooseLogo, onChooseCover }) => {
  const checklist = [
    { label: 'Ajouter un logo', done: hasText(user.logoUrl || user.avatarUrl), action: onChooseLogo },
    { label: 'Ajouter une couverture', done: hasText(user.coverUrl), action: onChooseCover },
    { label: 'Présenter votre entreprise', done: hasText(user.description) && hasText(user.bio), action: () => changeTab('settings') },
    { label: 'Préciser secteur et localisation', done: hasText(user.industry) && hasText(user.location || user.city), action: () => changeTab('settings') },
    { label: 'Ajouter des avantages', done: Array.isArray(user.perks) && user.perks.some(hasText), action: () => changeTab('settings') }
  ];
  const complete = checklist.filter(item => item.done).length;
  const recent = [...candidatesList].sort((a, b) => timestamp(b) - timestamp(a)).slice(0, 4);
  const jobs = [...activeJobsList].sort((a, b) => (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0)).slice(0, 4);
  const pending = candidatesList.filter(c => !c.status || c.status === 'pending').length;
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-sm">
      <div aria-hidden="true" className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-400">Espace recrutement</p><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-black">Bienvenue{hasText(user.firstName) ? `, ${user.firstName}` : ''}.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">Présentez votre entreprise et retrouvez au même endroit vos offres et les candidatures des étudiants.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={onCreateJob} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-300"><Plus size={17} /> Publier une offre</button><Link to={`/companies/${encodeURIComponent(String(user.id))}`} state={{ fromDashboard: true }} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">Voir mon profil <ExternalLink size={15} /></Link></div>
      </div>
    </section>

    <div className="grid xl:grid-cols-5 gap-6">
      <section className="xl:col-span-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Vos prochaines étapes</p><h3 className="mt-1 text-lg font-bold text-slate-900">Un profil qui vous ressemble</h3></div><span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-800">{complete} / {checklist.length} éléments</span></div>
        <p className="mt-2 text-sm text-slate-500">Ces éléments facultatifs aident les étudiants à mieux connaître votre entreprise.</p>
        <div className="mt-5 h-1.5 rounded-full bg-slate-100" aria-hidden="true"><div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${complete / checklist.length * 100}%` }} /></div>
        <ul className="mt-4 divide-y divide-slate-100">{checklist.map(item => <li key={item.label}><button type="button" onClick={item.action} className="w-full flex items-center gap-3 py-3 text-left text-sm hover:text-yellow-700"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{item.done ? <Check size={15} /> : <Circle size={13} />}</span><span className="flex-1 font-medium">{item.label}</span><span className="text-xs text-slate-400">{item.done ? 'Renseigné' : 'À compléter'}</span><ArrowRight size={15} className="text-slate-400" /></button></li>)}</ul>
      </section>
      <section className="xl:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Sparkles size={19} /></div><div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">En un clic</p><h3 className="font-bold text-slate-900">Accès rapides</h3></div></div>
        <div className="mt-5 space-y-2"><button type="button" onClick={() => changeTab('jobs')} className="w-full flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700 hover:bg-yellow-50"><BriefcaseBusiness size={18} /> Gérer mes offres <ArrowRight size={15} className="ml-auto" /></button><button type="button" onClick={() => { setSelectedJobFilter(null); changeTab('candidates'); }} className="w-full flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700 hover:bg-yellow-50"><Users size={18} /> Voir les candidatures <ArrowRight size={15} className="ml-auto" /></button><button type="button" onClick={() => changeTab('settings')} className="w-full flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700 hover:bg-yellow-50"><ClipboardList size={18} /> Modifier mon profil <ArrowRight size={15} className="ml-auto" /></button></div>
        {dataAvailable && <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-sm font-bold text-blue-900">{pending} candidature{pending !== 1 ? 's' : ''} reçue{pending !== 1 ? 's' : ''} à examiner</p><p className="mt-1 text-xs leading-relaxed text-blue-700">Candidatures au statut « reçue », toutes offres confondues.</p></div>}
      </section>
    </div>

    {dataAvailable && <>
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6"><div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Votre activité</p><h3 className="mt-1 text-lg font-bold text-slate-900">Candidatures récentes</h3></div><button type="button" onClick={() => { setSelectedJobFilter(null); changeTab('candidates'); }} className="text-sm font-bold text-yellow-700 hover:text-slate-900">Tout voir →</button></div>
        {recent.length ? <ul className="divide-y divide-slate-100">{recent.map(c => { const info = statusInfo[c.status || 'pending'] || { label: 'Statut inconnu', style: 'bg-slate-100 text-slate-600' }; return <li key={c.id}><button type="button" onClick={() => onOpenCandidate(c)} className="w-full flex flex-wrap items-center gap-3 p-5 sm:px-6 text-left hover:bg-slate-50"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">{(typeof c.name === 'string' && c.name.trim() ? c.name.trim() : '?').slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-900">{c.name || 'Candidat'}</span><span className="block truncate text-xs text-slate-500">{c.jobTitle || activeJobsList.find(j => String(j.id) === String(c.jobId))?.title || 'Offre'}</span></span><span className={`rounded-full px-3 py-1 text-xs font-bold ${info.style}`}>{info.label}</span><ArrowRight size={16} className="text-slate-400" /></button></li>; })}</ul> : <div className="p-8 text-center"><Users className="mx-auto text-slate-300" size={27} /><p className="mt-3 text-sm font-bold text-slate-700">Aucune candidature pour le moment</p><p className="mt-1 text-xs text-slate-500">Les candidatures reçues apparaîtront ici.</p></div>}
      </section>
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6"><div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Vos publications</p><h3 className="mt-1 text-lg font-bold text-slate-900">Offres récentes</h3></div><button type="button" onClick={() => changeTab('jobs')} className="text-sm font-bold text-yellow-700 hover:text-slate-900">Gérer mes offres →</button></div>
        {jobs.length ? <ul className="divide-y divide-slate-100">{jobs.map(j => <li key={j.id} className="flex flex-wrap items-center gap-3 p-5 sm:px-6"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{j.title || 'Offre sans titre'}</p><p className="mt-1 text-xs text-slate-500">{j.candidates || 0} candidature{j.candidates === 1 ? '' : 's'} · {j.status || 'Actif'}</p></div><button type="button" onClick={() => { setSelectedJobFilter(String(j.id)); changeTab('candidates'); }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-yellow-400">Voir les candidatures</button></li>)}</ul> : <div className="p-8 text-center"><BriefcaseBusiness className="mx-auto text-slate-300" size={27} /><p className="mt-3 text-sm font-bold text-slate-700">Aucune offre publiée</p><p className="mt-1 text-xs text-slate-500">Vos offres apparaîtront ici dès leur publication.</p><button type="button" onClick={onCreateJob} className="mt-4 text-sm font-bold text-yellow-700">Créer une offre →</button></div>}
      </section>
    </>}
  </div>;
};
export default CompanyOverview;
