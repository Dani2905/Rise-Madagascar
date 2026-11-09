import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { FEATURED_PROJECTS } from '../../data/resourcesData';
import ProjectCard from './ProjectCard';

interface ProjectsFeedProps {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

const ProjectsFeed: React.FC<ProjectsFeedProps> = ({ filterCategory, setFilterCategory }) => {
  const [displayProjects, setDisplayProjects] = useState(FEATURED_PROJECTS);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['Tous']);

  useEffect(() => {
      // 1. Charger les projets personnalisés depuis le LocalStorage (Source de vérité "Live")
      const customProjects = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
      
      // 2. Fusionner avec les projets statiques (éviter doublons ID)
      // On donne priorité aux Custom Projects (pour l'édition)
      const staticProjectsFiltered = FEATURED_PROJECTS.filter(sp => !customProjects.some((cp: any) => cp.id.toString() === sp.id.toString()));
      
      // Le tableau final : Custom en premier (nouveautés), puis Mocks
      const allProjects = [...customProjects, ...staticProjectsFiltered];
      
      setDisplayProjects(allProjects);

      // 3. Extraire les catégories uniques dynamiquement
      const uniqueCategories = Array.from(new Set(allProjects.map((p: any) => p.category))).filter(Boolean);
      setAvailableCategories(['Tous', ...uniqueCategories]);

  }, []);

  const filteredProjects = displayProjects.filter(p => 
      filterCategory === 'Tous' || p.category === filterCategory
  );

  return (
    <div className="lg:col-span-8 space-y-6">
        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            
            {/* Dynamic Categories Scrollable List */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-hide mask-fade-right">
                {availableCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            filterCategory === cat 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-slate-900'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 shrink-0">
                <span className="hidden md:inline font-medium">{filteredProjects.length} résultats</span>
                <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900">
                    <Filter size={16} /> <span className="font-bold">Récent</span>
                </div>
            </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                    <Grid size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucun projet trouvé</h3>
                <p className="text-gray-500 mt-2 text-sm">Essayez de sélectionner une autre catégorie.</p>
                <button 
                    onClick={() => setFilterCategory('Tous')}
                    className="mt-6 px-6 py-2 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                    Réinitialiser les filtres
                </button>
            </div>
        )}
        
        {filteredProjects.length > 6 && (
            <button className="w-full py-4 text-sm font-bold text-gray-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-dashed border-gray-200 shadow-sm">
                Charger plus de projets
            </button>
        )}
    </div>
  );
};

export default ProjectsFeed;