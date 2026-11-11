import React, { useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, ClipboardList, Clock3, FileText, Search, Star, UserRound } from 'lucide-react';
import { formatCivilDate, hasTrackingData, MissionTrackingDraft, trackingDraft, trackingSnapshot, TrackingUpdateResult, validateTrackingDraft } from '../../utils/missionTracking';

interface Props {
  candidates: any[];
  jobs: any[];
  onUpdate: (candidateId: string | number, data: MissionTrackingDraft, expected: string) => TrackingUpdateResult;
  onOpenReview: (candidate: any) => void;
  onViewCandidate: (candidate: any) => void;
  onViewCandidates: () => void;
}
const safeText = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const updatedLabel = (value: unknown): string => {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return '';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Indian/Antananarivo' }).format(new Date(value));
};
const Stars: React.FC<{ value: number }> = ({ value }) => <span className="inline-flex items-center gap-1" aria-label={`Évaluation : ${value} sur 5`}>{[1, 2, 3, 4, 5].map(n => <Star key={n} aria-hidden="true" size={15} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)} <span className="ml-1 text-xs font-bold text-slate-600">{value}/5</span></span>;

const InternshipTracker: React.FC<Props> = ({ candidates, jobs, onUpdate, onOpenReview, onViewCandidate, onViewCandidates }) => {
  const [scope, setScope] = useState<'active' | 'completed' | 'all'>('active');
  const [jobFilter, setJobFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expected, setExpected] = useState('null');
  const [form, setForm] = useState<MissionTrackingDraft>({ startDate: '', endDate: '', evaluation: 0, feedback: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const missions = useMemo(() => candidates.filter(c => c && ['string', 'number'].includes(typeof c.id) && String(c.id).trim() && ['string', 'number'].includes(typeof c.jobId) && String(c.jobId).trim() && (c.status === 'accepted' || c.status === 'completed')), [candidates]);
  const activeCount = missions.filter(c => c.status === 'accepted').length;
  const completedCount = missions.filter(c => c.status === 'completed').length;
  const withTrackingCount = missions.filter(c => hasTrackingData(c.tracking)).length;
  const jobTitle = (candidate: any) => safeText(jobs.find(j => j?.id != null && String(j.id) === String(candidate.jobId))?.title, safeText(candidate.jobTitle, 'Offre sans titre'));
  const availableJobs = useMemo(() => {
    const options = new Map<string, string>();
    missions.forEach(c => options.set(String(c.jobId), safeText(jobs.find(j => j?.id != null && String(j.id) === String(c.jobId))?.title, safeText(c.jobTitle, 'Offre sans titre'))));
    return [...options.entries()].sort((a, b) => a[1].localeCompare(b[1], 'fr'));
  }, [missions, jobs]);
  const term = search.trim().toLocaleLowerCase('fr');
  const filtered = missions.filter(c => (scope === 'all' || (scope === 'active' ? c.status === 'accepted' : c.status === 'completed')) && (jobFilter === '' || String(c.jobId) === jobFilter) && (!term || `${safeText(c.name)} ${jobTitle(c)}`.toLocaleLowerCase('fr').includes(term)));
  const begin = (candidate: any) => {
    if (editingId && editingId !== String(candidate.id) && !window.confirm('Abandonner la modification en cours ?')) return;
    setEditingId(String(candidate.id)); setExpected(trackingSnapshot(candidate.tracking)); setForm(trackingDraft(candidate.tracking)); setError(''); setMessage('');
  };
  const cancel = () => { setEditingId(null); setError(''); };
  const save = (event: React.FormEvent, candidate: any) => {
    event.preventDefault(); setError(''); setMessage('');
    const validation = validateTrackingDraft(form);
    if (validation) { setError(validation); return; }
    const result = onUpdate(candidate.id, form, expected);
    if (!result.ok) { setError(result.error); return; }
    setEditingId(null); setMessage('Suivi enregistré dans ce navigateur. Aucune notification n’a été envoyée.');
  };
  return <div className="space-y-6 animate-fade-in">
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white">
      <div aria-hidden="true" className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-400">Espace recruteur</p><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-black">Suivi des missions</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Retrouvez les candidatures acceptées, renseignez leur période et partagez un bilan avec l’étudiant.</p></div>
      <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black">{activeCount}</p><p className="mt-1 text-xs text-slate-300">Missions acceptées</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black">{completedCount}</p><p className="mt-1 text-xs text-slate-300">Missions terminées</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black">{withTrackingCount}</p><p className="mt-1 text-xs text-slate-300">Avec informations de suivi</p></div></div>
    </section>
    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900"><strong>Démonstration locale :</strong> les dates, notes et commentaires sont visibles par l’étudiant dans ce même navigateur. Ils ne sont ni envoyés par e-mail ni protégés par un serveur.</p>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</p>}
    {missions.length === 0 ? <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><ClipboardList size={25} /></div><h3 className="mt-4 text-lg font-bold text-slate-900">Aucune mission à suivre</h3><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">Les candidatures acceptées apparaîtront ici. Vous pourrez y renseigner une période et un bilan.</p><button type="button" onClick={onViewCandidates} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">Voir les candidatures <ArrowRight size={16} /></button></section> : <>
      <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm"><div className="flex flex-wrap gap-2" role="group" aria-label="Statut des missions">{([['active', 'Acceptées', activeCount], ['completed', 'Terminées', completedCount], ['all', 'Toutes', missions.length]] as const).map(([value, label, count]) => <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${scope === value ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{label} <span className="ml-1 opacity-70">{count}</span></button>)}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="relative"><Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" /><input type="search" aria-label="Rechercher un étudiant ou une offre" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un étudiant ou une offre" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 focus:border-amber-400 focus:outline-none" /></div><select aria-label="Filtrer par offre" value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-400 focus:outline-none"><option value="">Toutes les offres</option>{availableJobs.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></div>
        {editingId && !filtered.some(c => String(c.id) === editingId) && <p className="mt-3 text-xs text-amber-700">Une modification est en cours mais masquée par les filtres ; elle sera conservée tant que vous restez sur cette page.</p>}
      </section>
      {filtered.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center"><Search size={24} className="mx-auto text-slate-300" /><p className="mt-3 font-bold text-slate-700">Aucune mission ne correspond à ces filtres.</p><button type="button" onClick={() => { setSearch(''); setJobFilter(''); setScope('all'); }} className="mt-3 text-sm font-bold text-amber-700 underline">Afficher toutes les missions</button></div> : <div className="space-y-4">{filtered.map(candidate => {
        const isEditing = editingId === String(candidate.id), data = trackingDraft(candidate.tracking), hasData = hasTrackingData(candidate.tracking), updated = updatedLabel(candidate.tracking?.updatedAt), completed = candidate.status === 'completed', name = safeText(candidate.name, 'Étudiant'), school = safeText(candidate.school), avatar = safeText(candidate.avatarUrl);
        return <article key={String(candidate.id)} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="p-5 sm:p-6"><div className="flex flex-col sm:flex-row sm:items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-sm font-bold text-slate-600">{avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-bold text-slate-900">{name}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${completed ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>{completed ? 'Terminée' : 'Acceptée'}</span></div><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><BriefcaseBusiness size={15} className="shrink-0" /> {jobTitle(candidate)}</p>{school && <p className="mt-1 text-xs text-slate-400">{school}</p>}</div><button type="button" onClick={() => onViewCandidate(candidate)} className="self-start text-sm font-bold text-slate-600 hover:text-amber-700">Voir la candidature →</button></div>
            {!isEditing && <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"><div><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><CalendarDays size={14} /> Période</p><p className="mt-2 text-sm font-semibold text-slate-700">{data.startDate || data.endDate ? `${data.startDate ? formatCivilDate(data.startDate) : 'Début non renseigné'} — ${data.endDate ? formatCivilDate(data.endDate) : 'Fin non renseignée'}` : 'Non renseignée'}</p></div><div><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Star size={14} /> Évaluation</p><div className="mt-2">{data.evaluation ? <Stars value={data.evaluation} /> : <span className="text-sm text-slate-500">Non renseignée</span>}</div></div><div><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Clock3 size={14} /> Dernière mise à jour</p><p className="mt-2 text-sm text-slate-600">{updated || 'Non disponible'}</p></div>{data.feedback && <div className="sm:col-span-3 border-t border-slate-200 pt-3"><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><FileText size={14} /> Commentaire partagé</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{data.feedback}</p></div>}</div>}
            {isEditing && !completed && <form onSubmit={e => save(e, candidate)} className="mt-5 space-y-5 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5"><div><h4 className="font-bold text-slate-900">Modifier le suivi</h4><p className="mt-1 text-xs text-slate-600">Tous les champs sont facultatifs et visibles par l’étudiant dans ce navigateur.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Date de début<input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" /></label><label className="text-sm font-semibold text-slate-700">Date de fin<input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" /></label></div><fieldset><legend className="text-sm font-semibold text-slate-700">Évaluation facultative</legend><div className="mt-2 flex flex-wrap items-center gap-1">{[1, 2, 3, 4, 5].map(n => <button type="button" key={n} aria-label={`${n} étoile${n > 1 ? 's' : ''}`} aria-pressed={form.evaluation === n} onClick={() => setForm(f => ({ ...f, evaluation: n }))} className="rounded-lg p-1.5 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"><Star size={22} className={n <= form.evaluation ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} /></button>)}<button type="button" onClick={() => setForm(f => ({ ...f, evaluation: 0 }))} className="ml-2 text-xs font-bold text-slate-500 underline">Sans note</button></div></fieldset><label className="block text-sm font-semibold text-slate-700">Commentaire partagé<textarea aria-label="Commentaire partagé" maxLength={2000} value={form.feedback} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))} placeholder="Note sur le travail, points forts, axes d'amélioration..." rows={4} className="mt-2 block w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal" /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.feedback.length} / 2 000 caractères</span></label><div className="flex flex-wrap gap-2"><button type="submit" title="Enregistrer" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700">Enregistrer le suivi</button><button type="button" onClick={cancel} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">Annuler</button></div></form>}
            {!isEditing && <div className="mt-4 flex flex-wrap items-center gap-3">{completed ? <p className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 size={15} /> Mission clôturée : suivi en lecture seule.</p> : <><button type="button" title="Modifier le suivi" onClick={() => begin(candidate)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700">{hasData ? 'Modifier le suivi' : 'Renseigner le suivi'}</button><button type="button" onClick={() => onOpenReview({ ...candidate, name, jobTitle: jobTitle(candidate) })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-amber-400">Terminer et noter</button></>}</div>}
          </div>
        </article>;
      })}</div>}
    </>}
  </div>;
};
export default InternshipTracker;
