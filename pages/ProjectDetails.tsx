import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/resourcesData';
import ProjectHeader from '../components/project-details/ProjectHeader';
import ProjectContent from '../components/project-details/ProjectContent';
import ProjectSidebar from '../components/project-details/ProjectSidebar';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 1. Rechercher dans les données statiques (Mock)
    let foundProject = FEATURED_PROJECTS.find(p => p.id === Number(id));

    // 2. Si pas trouvé, rechercher dans les données dynamiques (LocalStorage)
    if (!foundProject) {
        const customProjects = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
        foundProject = customProjects.find((p: any) => p.id === Number(id));
    }

    // 3. Cas particulier : Les projets du Mock User (Hery) qui ont des ID 1 et 2 dans le code mais peuvent être édités.
    // Si on a un custom project qui a le même ID, il prend la priorité (version éditée)
    const customProjects = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
    const overrideProject = customProjects.find((p: any) => p.id === Number(id));
    
    setProject(overrideProject || foundProject);

  }, [id]);

  if (!project) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Projet introuvable</h1>
            <p className="text-gray-500 mb-8">Le projet que vous cherchez n'existe pas ou a été supprimé.</p>
            <Link to="/resources" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
                Retour aux ressources
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
            <Link to="/resources" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Retour aux projets
            </Link>
        </div>

        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <ProjectContent project={project} />
            </div>
            <div className="lg:col-span-4">
                <div className="sticky top-24">
                    <ProjectSidebar project={project} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;