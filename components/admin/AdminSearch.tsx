import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentSearchAllowed, useMessaging } from '../../context/MessagingContext';
import { getRegisteredRecruiters } from '../../utils/registeredCompanies';
import { matchesRecruiterQuery } from '../../utils/recruiterSearch';
import { getAvailableJobs, matchesJobQuery, normalizeSearchText } from '../../utils/jobSearch';
import { getPublicProjects } from '../../utils/projects';
import { matchesProjectQuery } from '../../utils/projectSearch';
import { getAdminOverview } from '../../utils/adminOverview';

const matches = (query:string, fields:string[]) => {
  const haystack=normalizeSearchText(fields.join(' '));
  return normalizeSearchText(query.trim()).split(/\s+/).filter(Boolean).every(word=>haystack.includes(word));
};
const Group: React.FC<{title:string; count:number; children:React.ReactNode; unavailable?:boolean}> = ({title,count,children,unavailable}) => <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">{title} <span className="text-sm font-medium text-slate-400">({unavailable?'—':count})</span></h3>{unavailable ? <p className="mt-3 text-sm text-red-700">Données locales indisponibles.</p> : count ? <ul className="mt-3 divide-y divide-slate-100">{children}</ul> : <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Aucun résultat pour cette recherche et cette période.</p>}</section>;
const Item: React.FC<{title:string; detail:string; to:string}> = ({title,detail,to}) => <li className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="break-words text-sm font-bold text-slate-900">{title}</p><p className="mt-1 break-words text-xs text-slate-500">{detail}</p></div><Link className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-amber-400" to={to} aria-label={`Voir ${title}`}>Voir</Link></li>;

const AdminSearch: React.FC<{query:string; data:ReturnType<typeof getAdminOverview>}> = ({query,data}) => {
  const {user} = useAuth();
  const {studentDirectory,error} = useMessaging();
  const accountIds=new Set(data.accountIds || []);
  const recruiters = data.accountIds ? getRegisteredRecruiters().filter(r=>accountIds.has(r.id) && matchesRecruiterQuery(r,query)) : [];
  const companies=recruiters.filter(r=>r.role==='company'), individuals=recruiters.filter(r=>r.role==='individual');
  const students=data.accountIds && user ? studentDirectory.map(x=>x.profile).filter(p=>accountIds.has(String(p.id)) && studentSearchAllowed(user,p.id) && matches(query,[p.firstName,p.lastName,p.title,p.school,p.studyField,p.studyLevel,...p.skills,...p.education.flatMap(e=>[e.degree,e.school,e.mention])])) : [];
  const jobIds=new Set(data.jobs?.filter(j=>j.active).map(j=>j.id)||[]);
  const projectIds=new Set(data.projects?.map(p=>p.id)||[]);
  const jobs=data.jobs ? getAvailableJobs().filter(j=>jobIds.has(String(j.id)) && !j.isDemo && matchesJobQuery(j,query)) : [];
  const projects=data.projects ? getPublicProjects().filter(p=>projectIds.has(String(p.id)) && !p.isDemo && matchesProjectQuery(p,query)) : [];
  return <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-700">Recherche globale</p><h2 className="mt-1 text-2xl font-bold">Résultats pour « {query.trim()} »</h2><p className="mt-2 text-sm leading-6 text-slate-500">Résultats locaux de la période sélectionnée. Seuls les profils accessibles au visiteur ou à la session courante sont affichés ; les e-mails, téléphones et comptes étudiants non consentants ne sont pas recherchés.</p></div>
    <div className="grid gap-4 xl:grid-cols-2">
      <Group title="Offres actives" count={jobs.length} unavailable={!data.jobs}>{jobs.map(j=><Item key={j.id} title={j.title} detail={`${j.company} · ${j.type}`} to={`/jobs/${encodeURIComponent(String(j.id))}`}/>)}</Group>
      <Group title="Projets" count={projects.length} unavailable={!data.projects}>{projects.map(p=><Item key={p.id} title={p.title} detail={`${p.student} · ${p.need}`} to={`/projects/${encodeURIComponent(String(p.id))}`}/>)}</Group>
      <Group title="Entreprises" count={companies.length} unavailable={!data.accountIds}>{companies.map(r=><Item key={r.id} title={r.name} detail={`${r.sector} · ${r.jobs} offre${r.jobs===1?'':'s'} active${r.jobs===1?'':'s'}`} to={`/companies/${encodeURIComponent(r.id)}`}/>)}</Group>
      <Group title="Particuliers" count={individuals.length} unavailable={!data.accountIds}>{individuals.map(r=><Item key={r.id} title={r.name} detail={`Particulier · ${r.jobs} offre${r.jobs===1?'':'s'} active${r.jobs===1?'':'s'}`} to={`/companies/${encodeURIComponent(r.id)}`}/>)}</Group>
      <Group title="Étudiants visibles" count={students.length} unavailable={!data.accountIds || (!!user && !!error)}>{students.map(p=><Item key={p.id} title={`${p.firstName} ${p.lastName}`.trim() || 'Étudiant'} detail={[p.title,p.school].filter(Boolean).join(' · ') || 'Profil étudiant'} to={`/students/${encodeURIComponent(String(p.id))}`}/>)}</Group>
    </div>
    {!user && <p className="rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">La recherche de profils étudiants nécessite une session étudiante ou recruteur et le consentement correspondant de chaque étudiant. Cet aperçu n’est pas un accès administrateur sécurisé.</p>}
    {user && <p className="text-xs text-slate-500">Les profils étudiants affichés respectent le consentement et les blocages applicables à votre session actuelle.</p>}
  </div>;
};
export default AdminSearch;
