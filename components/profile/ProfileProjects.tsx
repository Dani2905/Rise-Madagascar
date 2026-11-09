
import React, { useState, useEffect } from 'react';
import { Rocket, Plus, Edit2, Trash2, Heart, Lightbulb, Eye, Handshake, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../dashboard/ProjectForm';
import ProjectSupportsModal from './ProjectSupportsModal';
import { useAuth } from '../../context/AuthContext';
import { ProjectSupport } from '../../types';

interface ProfileProjectsProps {
    projects?: any[];
    initialCreateMode?: boolean;
}

const ProfileProjects: React.FC<ProfileProjectsProps> = ({ projects = [], initialCreateMode = false }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [localProjects, setLocalProjects] = useState(projects);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<any>(null);

  // States pour les fonctionnalités avancées
  const [projectLikes, setProjectLikes] = useState<Record<string, number>>({});
  const [supportsMap, setSupportsMap] = useState<Record<string, ProjectSupport[]>>({}); // Map projectId -> Supports[]
  
  // Modal State
  const [isSupportsModalOpen, setIsSupportsModalOpen] = useState(false);
  const [selectedProjectForSupport, setSelectedProjectForSupport] = useState<{id: number, title: string} | null>(null);

  useEffect(() => {
      setLocalProjects(projects);

      // 1. Charger les likes
      const storedCounts = JSON.parse(localStorage.getItem('rise_project_likes_counts') || '{}');
      setProjectLikes(storedCounts);

      // 2. Charger les Supports (Propositions)
      const allSupports = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      
      // Grouper par Project ID pour un accès rapide
      const mappedSupports: Record<string, ProjectSupport[]> = {};
      allSupports.forEach((s: ProjectSupport) => {
          if (!mappedSupports[s.projectId]) {
              mappedSupports[s.projectId] = [];
          }
          mappedSupports[s.projectId].push(s);
      });
      setSupportsMap(mappedSupports);

  }, [projects, isSupportsModalOpen]); // Re-fetch quand le modal se ferme pour mettre à jour les statuts

  useEffect(() => {
      if (initialCreateMode) {
          setView('form');
          setEditingProject(null);
      }
  }, [initialCreateMode]);

  const handleSave = (projectData: any) => {
      if (!user) return;

      let updatedList;
      let projectToSave;
      const publicProjects = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');

      const commonMetadata = {
          student: `${user.firstName} ${user.lastName}`,
          studentEmail: user.email,
          ownerId: user.id,
          school: user.school || 'École non renseignée',
          avatar: user.avatarUrl,
          date: new Date().toLocaleDateString('fr-FR'),
          likes: 0,
          imageColor: 'bg-blue-50 text-blue-600'
      };

      if (editingProject) {
          projectToSave = { 
              ...editingProject, 
              ...projectData, 
              student: commonMetadata.student,
              school: commonMetadata.school
          };
          updatedList = localProjects.map(p => p.id === editingProject.id ? projectToSave : p);
          
          const existingPublicIndex = publicProjects.findIndex((p: any) => p.id === editingProject.id);
          if (existingPublicIndex >= 0) {
              publicProjects[existingPublicIndex] = projectToSave;
          }
          window.Toastify({ text: "Projet mis à jour !", style: { background: "#2563EB" } }).showToast();
      } else {
          const newId = Date.now();
          projectToSave = { id: newId, ...commonMetadata, ...projectData };
          updatedList = [projectToSave, ...localProjects];
          publicProjects.unshift(projectToSave);
          window.Toastify({ text: "Projet publié !", style: { background: "#10B981" } }).showToast();
      }

      setLocalProjects(updatedList);
      updateUser({ myProjects: updatedList });
      localStorage.setItem('rise_custom_projects', JSON.stringify(publicProjects));
      setView('list');
      setEditingProject(null);
      navigate('/profile?tab=projects');
  };

  const handleEdit = (project: any) => {
      setEditingProject(project);
      setView('form');
  };

  const handleDelete = (id: number) => {
      if (window.confirm("Supprimer ce projet ?")) {
          const updatedList = localProjects.filter(p => p.id !== id);
          setLocalProjects(updatedList);
          updateUser({ myProjects: updatedList });

          const publicProjects = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
          const updatedPublic = publicProjects.filter((p: any) => p.id !== id);
          localStorage.setItem('rise_custom_projects', JSON.stringify(updatedPublic));

          window.Toastify({ text: "Projet supprimé.", style: { background: "#64748b" } }).showToast();
      }
  };

  const openSupportsModal = (project: any) => {
      setSelectedProjectForSupport({ id: project.id, title: project.title });
      setIsSupportsModalOpen(true);
  };

  // --- RENDER FORM ---
  if (view === 'form') {
      return (
          <div className="animate-fade-in">
              <ProjectForm initialData={editingProject} onSave={handleSave} onCancel={() => { setView('list'); setEditingProject(null); navigate('/profile?tab=projects'); }} />
          </div>
      );
  }

  // --- RENDER LIST ---
  return (
    <div className="space-y-6 animate-fade-in delay-100">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
            <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Rocket className="text-primary" size={20} /> Mes Projets
                </h3>
                <p className="text-sm text-gray-500 mt-1">Gérez votre portfolio d'innovation.</p>
            </div>
            <button 
                onClick={() => { setEditingProject(null); setView('form'); }}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
                <Plus size={16} /> Nouveau Projet
            </button>
        </div>

        {localProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localProjects.map(project => {
                    const currentLikes = projectLikes[project.id] !== undefined ? projectLikes[project.id] : project.likes;
                    const supports = supportsMap[project.id] || [];
                    const pendingSupports = supports.filter(s => s.status === 'pending').length;
                    const hasSupports = supports.length > 0;
                    
                    return (
                    <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
                        
                        {/* Status Bar */}
                        {hasSupports && (
                            <div className="bg-yellow-50 px-6 py-2 flex justify-between items-center border-b border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => openSupportsModal(project)}>
                                <span className="text-xs font-bold text-yellow-800 flex items-center gap-1">
                                    <Handshake size={12} /> {supports.length} investisseur(s) intéressé(s)
                                </span>
                                {pendingSupports > 0 && (
                                    <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        {pendingSupports} nouveau(x)
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="p-6 flex-1">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.imageColor || 'bg-gray-100 text-gray-500'}`}>
                                    <Lightbulb size={24} />
                                </div>
                                <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold border border-slate-100">
                                    <Heart size={12} className="fill-current text-slate-400" /> {currentLikes || 0}
                                </div>
                            </div>
                            
                            <h4 className="font-heading font-bold text-lg text-slate-900 mb-1">{project.title}</h4>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">{project.category}</span>
                                <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{project.stage}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                    <span>Avancement</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                            
                            {/* Bouton Deal Room Mis en avant */}
                            <button 
                                onClick={() => openSupportsModal(project)}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                                    hasSupports 
                                    ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-transparent hover:ring-primary/50' 
                                    : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                                }`}
                            >
                                <Handshake size={14} className={hasSupports ? 'text-primary' : 'text-gray-400'} /> 
                                Deal Room
                                {pendingSupports > 0 && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                            </button>

                            <div className="flex gap-1 w-full sm:w-auto justify-end">
                                <button onClick={() => navigate(`/projects/${project.id}`)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors" title="Voir la page publique">
                                    <Eye size={16} />
                                </button>
                                <button onClick={() => handleEdit(project)} className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors" title="Modifier">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-white rounded-lg transition-colors" title="Supprimer">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                    <Lightbulb size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Vous n'avez pas encore de projet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Partagez vos idées innovantes avec la communauté pour trouver des financements, des mentors ou des co-fondateurs.
                </p>
                <button 
                    onClick={() => { setEditingProject(null); setView('form'); }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
                >
                    Publier mon premier projet
                </button>
            </div>
        )}

        {/* Modal des soutiens */}
        {selectedProjectForSupport && (
            <ProjectSupportsModal 
                isOpen={isSupportsModalOpen}
                onClose={() => setIsSupportsModalOpen(false)}
                projectId={selectedProjectForSupport.id}
                projectTitle={selectedProjectForSupport.title}
            />
        )}
    </div>
  );
};

export default ProfileProjects;
