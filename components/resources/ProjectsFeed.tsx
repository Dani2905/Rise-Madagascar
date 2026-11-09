import React, { useEffect, useState } from 'react';
import { Grid } from 'lucide-react';
import { getPublicProjects } from '../../utils/projects';
import ProjectCard from './ProjectCard';

interface ProjectsFeedProps { filterCategory: string; setFilterCategory: (category: string) => void; }
const ProjectsFeed: React.FC<ProjectsFeedProps> = ({ filterCategory, setFilterCategory }) => {
  const [projects, setProjects] = useState(getPublicProjects);
  const [visibleCount, setVisibleCount] = useState(6);
  useEffect(() => {
    const refresh = () => setProjects(getPublicProjects());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh); };
  }, []);
  useEffect(() => setVisibleCount(6), [filterCategory]);
  const categories = ['Tous', ...Array.from(new Set<string>(projects.map(p => p.category).filter(c => c && c !== 'Tous'))).sort((a, b) => a.localeCompare(b, 'fr'))];
  if (filterCategory !== 'Tous' && !categories.includes(filterCategory)) categories.push(filterCategory);
  const filtered = projects.filter(p => filterCategory === 'Tous' || p.category === filterCategory);
  return <div className="lg:col-span-8 space-y-6">
    <p className="text-xs text-slate-500">Version de démonstration : les projets publiés et les soutiens sont enregistrés dans ce navigateur. Les exemples fictifs sont signalés.</p>
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full" aria-label="Catégories de projets">
        {categories.map(category => <button key={category} type="button" aria-pressed={filterCategory === category} onClick={() => setFilterCategory(category)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${filterCategory === category ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}>{category}</button>)}
      </div>
      <span className="text-sm text-gray-500 whitespace-nowrap" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'résultat' : 'résultats'}</span>
    </div>
    {filtered.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filtered.slice(0, visibleCount).map(project => <ProjectCard key={project.id} project={project} />)}</div> : <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
      <Grid size={32} className="mx-auto text-gray-300 mb-4" /><h3 className="text-lg font-bold text-gray-900">Aucun projet trouvé</h3><p className="text-gray-500 mt-2 text-sm">Essayez une autre catégorie.</p><button type="button" onClick={() => setFilterCategory('Tous')} className="mt-6 px-6 py-2 border rounded-xl font-bold text-sm">Réinitialiser le filtre</button>
    </div>}
    {visibleCount < filtered.length && <div className="text-center"><p className="text-xs text-slate-500 mb-3">{Math.min(visibleCount, filtered.length)} projets affichés sur {filtered.length}</p><button type="button" onClick={() => setVisibleCount(n => n + 6)} className="w-full py-4 text-sm font-bold text-gray-600 hover:bg-white rounded-xl border border-dashed border-gray-200">Charger plus de projets</button></div>}
  </div>;
};
export default ProjectsFeed;
