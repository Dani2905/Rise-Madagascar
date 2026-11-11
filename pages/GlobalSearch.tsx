import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Briefcase, Search as SearchIcon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';
import { getAvailableJobs, getJobRelevance, matchesJobQuery, normalizeSearchText } from '../utils/jobSearch';
import { getRegisteredRecruiters } from '../utils/registeredCompanies';
import { readLocalArray } from '../utils/recruiterDashboard';
import { PROVINCES, matchesLocation } from '../utils/provinces';

type Category = 'all' | 'jobs' | 'students' | 'companies' | 'individuals';
const categories: {value: Category; label: string}[] = [
  {value:'all',label:'Tout'}, {value:'jobs',label:'Offres'}, {value:'students',label:'Étudiants'},
  {value:'companies',label:'Entreprises'}, {value:'individuals',label:'Particuliers'}
];
const matchWords = (query: string, fields: string[]) => {
  const terms = normalizeSearchText(query.trim()).split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText(fields.join(' '));
  return terms.every(term => haystack.includes(term));
};
const GlobalSearch: React.FC = () => {
  const { user } = useAuth();
  const { studentDirectory, messages, error: messagingError } = useMessaging();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const q = params.get('q') || '';
  const requested = params.get('type');
  const category: Category = categories.some(c => c.value === requested) ? requested as Category : 'all';
  const from = `${location.pathname}${location.search}`;
  const province = params.get('loc') || '';
  const contract = category === 'jobs' ? (params.get('contract') || '') : '';
  const school = category === 'students' ? (params.get('school') || '') : '';
  const skill = category === 'students' ? (params.get('skill') || '') : '';
  const availability = category === 'companies' || category === 'individuals' ? (params.get('availability') || '') : '';
  const sector = category === 'companies' ? (params.get('sector') || '') : '';
  useEffect(() => {
    const refresh = () => setRevision(v => v + 1);
    window.addEventListener('focus', refresh); window.addEventListener('storage', refresh);
    return () => {window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh);};
  }, []);
  const jobs = useMemo(() => getAvailableJobs(), [revision]);
  const recruiters = useMemo(() => {
    try {
      const users = readLocalArray('rise_db_users'), counts = new Map<string,number>();
      for (const person of users) if (person?.id != null) counts.set(String(person.id), (counts.get(String(person.id)) || 0) + 1);
      return getRegisteredRecruiters().filter(r => counts.get(r.id) === 1);
    } catch { return []; }
  }, [revision]);
  const uniqueSorted = (values: string[]) => [...new Set(values.map(v => v.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  const contracts = uniqueSorted(jobs.map(j => j.type || ''));
  const schools = uniqueSorted(studentDirectory.flatMap(({profile:p}) => [p.school, ...p.education.map(e=>e.school)]));
  const skills = uniqueSorted(studentDirectory.flatMap(({profile:p}) => p.skills));
  const sectors = uniqueSorted(recruiters.filter(p => p.role === 'company').map(p=>p.sector));
  const inProvince = (location: string, explicit?: string) => !province || matchesLocation(location,explicit,province);
  const filteredJobs = jobs.filter(j => matchesJobQuery(j,q) && inProvince(j.location || '',j.province) && (!contract || j.type === contract)).sort((a,b) => getJobRelevance(b,q)-getJobRelevance(a,q));
  const canSearchStudents = !!user && ['student','company','individual'].includes(user.role);
  const filteredStudents = canSearchStudents ? studentDirectory.filter(({profile:p}) => matchWords(q,[p.firstName,p.lastName,p.title,p.school,p.studyField,p.studyLevel,...p.skills,...p.education.flatMap(e=>[e.degree,e.school,e.mention])]) && inProvince(p.location) && (!school || p.school === school || p.education.some(e=>e.school === school)) && (!skill || p.skills.includes(skill))) : [];
  const filteredRecruiters = recruiters.filter(p => matchWords(q,[p.name,p.sector,p.location,...p.offerTitles]) && inProvince(p.location) && (!availability || (availability === 'active' ? p.jobs > 0 : availability === 'none' ? p.jobs === 0 : true)) && (!sector || p.sector === sector));
  const companies = filteredRecruiters.filter(p => p.role === 'company');
  const individuals = filteredRecruiters.filter(p => p.role === 'individual');
  const advancedParams = new URLSearchParams();
  if (q) advancedParams.set('q',q);
  if (province) advancedParams.set('loc',province);
  if (contract) advancedParams.set('type',contract);
  const advancedUrl = `/search${advancedParams.toString() ? `?${advancedParams}` : ''}`;
  const show = (value: Category) => category === 'all' || category === value;
  const update = (key:string,value:string) => {const next=new URLSearchParams(params); if (value && !(key === 'type' && value === 'all')) next.set(key,value); else next.delete(key);setParams(next,{replace:true});};
  const selectCategory = (value: Category) => { if (value === category) return; const next = new URLSearchParams(params); if (value === 'all') next.delete('type'); else next.set('type',value); ['contract','school','skill','availability','sector'].forEach(k=>next.delete(k)); setParams(next,{replace:true}); };
  const resetFilters = () => {const next = new URLSearchParams(params); ['loc','contract','school','skill','availability','sector'].forEach(k=>next.delete(k)); setParams(next,{replace:true});};
  const hasFilters = !!(province || contract || school || skill || availability || sector);
  const optionValues = (values: string[], selected: string) => selected && !values.includes(selected) ? [selected,...values] : values;
  const recruiterSection = (list: typeof companies, heading:string, role:'company'|'individual') => <section className="mt-8" aria-label={heading}>
    <h2 className="text-xl font-bold text-slate-900">{heading} <span className="text-sm font-medium text-slate-400">({list.length})</span></h2>
    {list.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{list.map(person => <li key={person.id} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold text-slate-900 break-words">{person.name}</p><p className="mt-1 text-sm text-slate-500">{role === 'company' ? person.sector : 'Particulier'} · {person.location}</p><p className="mt-2 text-xs text-slate-500">{person.jobs} offre{person.jobs !== 1 ? 's' : ''} active{person.jobs !== 1 ? 's' : ''}</p><Link to={`/companies/${encodeURIComponent(person.id)}`} state={{fromDirectory:from}} className="mt-4 inline-block text-sm font-bold text-amber-700 hover:underline">Voir le profil →</Link></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">Aucun résultat dans cette catégorie.</p>}
  </section>;
  return <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <div className="mb-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">Rise Madagascar</p><h1 className="mt-2 text-3xl font-heading font-black text-slate-900">Rechercher sur Rise</h1><p className="mt-2 text-sm text-slate-600">Trouvez une offre ou découvrez des membres de la communauté.</p></div>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Démonstration : les comptes et offres locales ne sont visibles que dans ce navigateur. Les offres fictives sont signalées.</div>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><label htmlFor="global-search" className="block text-sm font-bold text-slate-700">Rechercher une offre ou une personne</label><div className="relative mt-2"><SearchIcon size={20} className="pointer-events-none absolute left-4 top-3.5 text-slate-400"/><input id="global-search" type="search" value={q} onChange={e=>update('q',e.target.value)} placeholder="Métier, nom, formation, compétence…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none focus:border-amber-400" /></div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Catégorie de recherche">{categories.map(c=><button key={c.value} type="button" onClick={()=>selectCategory(c.value)} aria-pressed={category===c.value} className={`rounded-xl px-4 py-2 text-sm font-bold ${category===c.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.label}</button>)}</div>
      <div className="mt-5 border-t border-slate-100 pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-800">Affiner les résultats</p>{hasFilters && <button type="button" onClick={resetFilters} className="text-xs font-bold text-amber-700 underline">Effacer les filtres</button>}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div><label htmlFor="global-province" className="block text-xs font-bold text-slate-600">Province</label><select id="global-province" value={province} onChange={e=>update('loc',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Toute l’île</option>{PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}{province && !PROVINCES.some(p=>p===province) && <option value={province}>{province}</option>}</select></div>
        {category === 'jobs' && <div><label htmlFor="global-contract" className="block text-xs font-bold text-slate-600">Type d’offre</label><select id="global-contract" value={contract} onChange={e=>update('contract',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Tous les types</option>{optionValues(contracts,contract).map(t=><option key={t} value={t}>{t}</option>)}</select></div>}
        {category === 'students' && canSearchStudents && <><div><label htmlFor="global-school" className="block text-xs font-bold text-slate-600">Établissement</label><select id="global-school" value={school} onChange={e=>update('school',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Tous les établissements</option>{optionValues(schools,school).map(t=><option key={t} value={t}>{t}</option>)}</select></div><div><label htmlFor="global-skill" className="block text-xs font-bold text-slate-600">Compétence</label><select id="global-skill" value={skill} onChange={e=>update('skill',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Toutes les compétences</option>{optionValues(skills,skill).map(t=><option key={t} value={t}>{t}</option>)}</select></div></>}
        {(category === 'companies' || category === 'individuals') && <div><label htmlFor="global-availability" className="block text-xs font-bold text-slate-600">Offres actives</label><select id="global-availability" value={availability} onChange={e=>update('availability',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Tous les inscrits</option><option value="active">Au moins une offre active</option><option value="none">Aucune offre active</option></select></div>}
        {category === 'companies' && <div><label htmlFor="global-sector" className="block text-xs font-bold text-slate-600">Secteur</label><select id="global-sector" value={sector} onChange={e=>update('sector',e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Tous les secteurs</option>{optionValues(sectors,sector).map(t=><option key={t} value={t}>{t}</option>)}</select></div>}
      </div><p className="mt-3 text-xs text-slate-500">La province s’applique à tous les résultats ; les profils sans localisation reconnaissable sont exclus lorsqu’elle est sélectionnée. Choisissez une catégorie pour afficher ses filtres spécifiques. Changer de catégorie réinitialise ces filtres, mais conserve la province et les mots recherchés.</p></div>
    </div>
    {show('jobs') && <section className="mt-8" aria-label="Offres"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><Briefcase size={20} /> Offres <span className="text-sm font-medium text-slate-400">({filteredJobs.length})</span></h2><Link to={advancedUrl} className="text-sm font-bold text-amber-700 hover:underline">Filtres avancés des offres →</Link></div>{filteredJobs.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{filteredJobs.map(j=><li key={String(j.id)} className="rounded-2xl border border-slate-200 bg-white p-5"><Link to={`/jobs/${encodeURIComponent(String(j.id))}`} state={{fromSearch:from}} className="font-bold text-slate-900 hover:text-amber-700">{j.title}</Link>{j.isDemo && <span className="ml-2 text-xs font-semibold text-amber-700">Offre fictive</span>}<p className="mt-2 text-sm text-slate-500">{[j.company,j.location,j.type].filter(Boolean).join(' · ')}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">Aucune offre trouvée.</p>}</section>}
    {show('students') && <section className="mt-8" aria-label="Étudiants"><h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><Users size={20} /> Étudiants {canSearchStudents && <span className="text-sm font-medium text-slate-400">({filteredStudents.length})</span>}</h2>
      {!canSearchStudents ? <p className="mt-3 text-sm text-slate-500">Connectez-vous avec un compte étudiant, entreprise ou particulier pour rechercher des étudiants.</p> : <><p className="mt-2 text-xs text-slate-500">Seuls les étudiants ayant choisi d’apparaître dans la recherche {user?.role === 'student' ? 'entre étudiants' : 'des recruteurs'} sont affichés. Les champs e-mail et téléphone ne sont pas affichés ; les textes publics peuvent contenir des informations librement saisies. {user?.role === 'student' && <Link to="/profile?tab=settings" className="font-bold text-amber-700 underline">Gérer ma visibilité</Link>}</p>{messagingError ? <p role="alert" className="mt-3 text-sm text-red-700">Recherche d’étudiants indisponible : les données locales ne peuvent pas être lues.</p> : filteredStudents.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{filteredStudents.map(({profile:p,mode})=>{const id=String(p.id), name=[p.firstName,p.lastName].filter(Boolean).join(' ') || 'Étudiant'; const pair=messages.filter(m => (String(m.senderId) === id && String(m.receiverId) === String(user.id)) || (String(m.receiverId) === id && String(m.senderId) === String(user.id))); const accepted=pair.some(m=>m.requestStatus==='accepted'), pending=pair.some(m=>m.requestStatus==='pending'), declined=pair.some(m=>m.requestStatus==='declined' && String(m.senderId)===String(user.id)); const label=accepted ? 'Contact accepté' : pending ? 'Demande en attente' : declined ? 'Demande refusée' : mode === 'nobody' ? 'Ne reçoit pas de demandes' : mode === 'projects' ? 'Demandes depuis ses projets uniquement' : 'Demande de contact possible';return <li key={id} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold text-slate-900 break-words">{name}{p.isDemo && <span className="ml-2 text-xs text-amber-700">Démonstration</span>}</p><p className="mt-1 text-sm text-slate-500">{[p.studyField || p.title,p.school].filter(Boolean).join(' · ') || 'Formation non renseignée'}</p>{p.skills.length > 0 && <p className="mt-1 text-xs text-slate-500 break-words">{p.skills.join(' · ')}</p>}<p className="mt-2 text-xs font-semibold text-slate-500">{label}</p><div className="mt-4 flex flex-wrap gap-4"><Link to={`/students/${encodeURIComponent(id)}`} state={{fromGlobalSearch:from}} className="text-sm font-bold text-amber-700 hover:underline">Voir le profil<span className="sr-only"> de {name}</span> →</Link>{(accepted || (mode==='everyone' && !pending && !declined)) && <Link to={`/messages?partner=${encodeURIComponent(id)}`} className="text-sm font-bold text-slate-700 underline">{accepted ? 'Écrire' : 'Demander le contact'}<span className="sr-only"> à {name}</span></Link>}</div></li>})}</ul> : <p className="mt-3 text-sm text-slate-500">{q.trim() || hasFilters ? 'Aucun étudiant trouvé.' : 'Aucun autre étudiant visible pour le moment.'}</p>}</>}
    </section>}
    {show('companies') && recruiterSection(companies,'Entreprises inscrites','company')}
    {show('individuals') && recruiterSection(individuals,'Particuliers inscrits','individual')}
  </div></div>;
};
export default GlobalSearch;
