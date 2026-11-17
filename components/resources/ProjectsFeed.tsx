import React, { useEffect, useState } from 'react';
import { Grid, Search, SlidersHorizontal, X } from 'lucide-react';
import { matchesProjectQuery } from '../../utils/projectSearch';
import { getPublicProjects } from '../../utils/projects';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from './ProjectCard';

interface ProjectsFeedProps { filterCategory: string; setFilterCategory: (category: string) => void; searchTerm: string; setSearchTerm: (value: string) => void; filterNeed: string; setFilterNeed: (value: string) => void; resetFilters: () => void; }
const ProjectsFeed: React.FC<ProjectsFeedProps> = ({ filterCategory, setFilterCategory, searchTerm, setSearchTerm, filterNeed, setFilterNeed, resetFilters }) => {
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState(getPublicProjects);
  const [visibleCount, setVisibleCount] = useState(6);
  useEffect(() => {
    const refresh = () => setProjects(getPublicProjects());
    window.addEventListener('focus', refresh); window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh); };
  }, []);
  useEffect(() => setVisibleCount(6), [filterCategory, searchTerm, filterNeed]);
  const categories = ['Tous', ...Array.from(new Set<string>(projects.map(p => p.category).filter(c => c && c !== 'Tous'))).sort((a, b) => a.localeCompare(b, 'fr'))];
  if (filterCategory !== 'Tous' && !categories.includes(filterCategory)) categories.push(filterCategory);
  const needs = [...new Set<string>(projects.map(p=>p.need).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  if (filterNeed && !needs.includes(filterNeed)) needs.push(filterNeed);
  const filtered = projects.filter(p => (filterCategory === 'Tous' || p.category === filterCategory) && (!filterNeed || p.need === filterNeed) && matchesProjectQuery(p,searchTerm));
  const hasFilters = !!searchTerm.trim() || filterCategory !== 'Tous' || !!filterNeed;
  return <section aria-label="Catalogue des projets" className="space-y-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div><label htmlFor="projects-search" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Rechercher un projet</label><div className="relative"><Search size={19} className="pointer-events-none absolute left-4 top-3.5 text-slate-400" /><input id="projects-search" type="search" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Nom, thème, compétence, porteur…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-amber-400 focus:bg-white" /></div></div>
        <div><label htmlFor="projects-need" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Besoin</label><div className="relative"><SlidersHorizontal size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" /><select id="projects-need" value={filterNeed} onChange={e=>setFilterNeed(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-amber-400"><option value="">Tous les besoins</option>{needs.map(need=><option key={need} value={need}>{need}</option>)}</select></div></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4" role="group" aria-label="Catégories de projets">
        {categories.map(category => <button key={category} type="button" aria-pressed={filterCategory === category} onClick={() => setFilterCategory(category)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${filterCategory === category ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-400'}`}>{category}</button>)}
        {hasFilters && <button type="button" onClick={resetFilters} className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"><X size={14}/> Effacer les filtres</button>}
      </div>
    </div>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">À découvrir</h2><p className="mt-1 text-sm text-slate-500" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'projet trouvé' : 'projets trouvés'}</p></div><p className="text-xs text-slate-500">Les exemples fictifs sont signalés.</p></div>
    {filtered.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, visibleCount).map(project => <ProjectCard key={project.id} project={project} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center"><Grid size={30} className="mx-auto text-slate-300" /><h3 className="mt-4 text-lg font-bold text-slate-900">Aucun projet trouvé</h3><p className="mt-2 text-sm text-slate-500">Essayez d’autres mots-clés ou filtres.</p><button type="button" onClick={resetFilters} className="mt-5 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Réinitialiser les filtres</button></div>}
    {visibleCount < filtered.length && <div className="text-center"><p className="mb-3 text-xs text-slate-500">{Math.min(visibleCount, filtered.length)} projets affichés sur {filtered.length}</p><button type="button" onClick={() => setVisibleCount(n => n + 6)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:border-slate-400">Charger plus de projets</button></div>}
    <div className="border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-500">
      {!isLoading && !user && <p className="mb-1">Vous pouvez consulter les projets et leurs fiches sans compte. Pour réagir ou contacter un porteur, connectez-vous ou créez un compte gratuit.</p>}
      <p>Version de démonstration : les projets publiés et les soutiens sont enregistrés dans ce navigateur, sans synchronisation entre appareils.</p>
    </div>
  </section>;
};
export default ProjectsFeed;
