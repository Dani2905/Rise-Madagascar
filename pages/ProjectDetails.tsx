import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getPublicProjects } from '../utils/projects';
import ProjectHeader from '../components/project-details/ProjectHeader';
import ProjectContent from '../components/project-details/ProjectContent';
import ProjectSidebar from '../components/project-details/ProjectSidebar';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromStudent = typeof location.state?.fromStudent === 'string' && /^\/students\/[^/?#]+$/.test(location.state.fromStudent) ? location.state.fromStudent : null;
  const returnPath = fromStudent || (typeof location.state?.fromResources === 'string' && /^\/resources(?:\?|$)/.test(location.state.fromResources) ? location.state.fromResources : '/resources');
  const returnLabel = fromStudent ? 'Retour au profil étudiant' : 'Retour aux projets';
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const refresh = () => { setProject(getPublicProjects().find(item => String(item.id) === id) || null); setIsLoading(false); };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement du projet…</div>;

  if (!project) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Projet introuvable</h1>
            <p className="text-gray-500 mb-8">Le projet que vous cherchez n'existe pas ou a été supprimé.</p>
            <Link to={returnPath} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
                {returnLabel}
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
            <Link to={returnPath} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-2" /> {returnLabel}
            </Link>
        </div>

        {project.isDemo && <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">Projet fictif présenté à titre d’exemple. Il ne correspond pas à une demande de soutien réelle.</p>}
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