import React from 'react';
import { ArrowUpRight, Heart, Lightbulb, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useProjectLikes } from '../../hooks/useProjectLikes';
import { Project } from '../../data/resourcesData';

const ProjectCard: React.FC<{project: Project}> = ({project}) => {
  const {liked, count, toggle, error} = useProjectLikes(project.id, project.likes);
  const location = useLocation();
  const fromResources = `${location.pathname}${location.search}`;
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg">
    <div className="relative flex items-start justify-between gap-3 border-b border-slate-100 bg-[#f9faf7] px-5 py-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200"><Lightbulb size={13} className="text-amber-600" />{project.category}</span>{project.isDemo && <span className="rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">Exemple fictif</span>}</div>
      <button type="button" aria-pressed={liked} aria-label={liked ? 'Retirer ma réaction' : 'Aimer ce projet'} onClick={toggle} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-bold transition ${liked ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-500 hover:text-red-600'}`}><Heart size={15} className={liked ? 'fill-current' : ''}/>{count}</button>
    </div>
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="break-words font-heading text-lg font-bold leading-snug text-slate-900"><Link to={`/projects/${encodeURIComponent(String(project.id))}`} state={{fromResources}} className="hover:text-amber-700">{project.title}</Link></h3>
      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500"><UserRound size={14}/><span className="break-words">{project.student}{project.school ? ` · ${project.school}` : ''}</span></p>
      {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{project.description}</p>
      <div className="mt-5 rounded-xl bg-amber-50 px-3 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700">Recherche</p><p className="mt-1 break-words text-sm font-bold text-slate-800">{project.need}</p></div>
      <div className="mt-4"><div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500"><span className="truncate">{project.stage}</span><span>{project.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{width:`${project.progress}%`}} /></div></div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><div className="flex min-w-0 flex-wrap gap-1.5">{project.tags.slice(0,2).map((tag,i)=><span key={`${tag}-${i}`} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">#{tag}</span>)}</div><Link to={`/projects/${encodeURIComponent(String(project.id))}`} state={{fromResources}} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-slate-900 hover:text-amber-700">Voir le projet <ArrowUpRight size={15}/></Link></div>
    </div>
  </article>;
};
export default ProjectCard;
