
import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Plus, Edit2, Trash2, Heart, Lightbulb, Eye, Handshake, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../dashboard/ProjectForm';
import ProjectSupportsModal from './ProjectSupportsModal';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { ProjectSupport } from '../../types';
import { canPerformAction, getCurrentLocalSession } from '../../utils/subscription';

interface ProfileProjectsProps {
    projects?: any[];
    initialCreateMode?: boolean;
}

const EMPTY_PROJECTS: any[] = [];
const ownsStoredProject = (project: any, user: any) => project?.ownerId != null ? String(project.ownerId) === String(user?.id) : typeof project?.studentEmail === 'string' && typeof user?.email === 'string' && project.studentEmail.trim().toLowerCase() === user.email.trim().toLowerCase();

const ProfileProjects: React.FC<ProfileProjectsProps> = ({ projects = EMPTY_PROJECTS, initialCreateMode = false }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { openSubscription } = useSubscription();
  const [localProjects, setLocalProjects] = useState(projects);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showSubscriptionNotice, setShowSubscriptionNotice] = useState(false);
  const [storageError, setStorageError] = useState('');
  const directCreateHandled = useRef(false);
  const directCreatePending = useRef(false);

  // States pour les fonctionnalités avancées
  const [projectLikes, setProjectLikes] = useState<Record<string, number>>({});
  const [supportsMap, setSupportsMap] = useState<Record<string, ProjectSupport[]>>({}); // Map projectId -> Supports[]
  
  // Modal State
  const [isSupportsModalOpen, setIsSupportsModalOpen] = useState(false);
  const [selectedProjectForSupport, setSelectedProjectForSupport] = useState<{id: number, title: string} | null>(null);

  useEffect(() => {
      setLocalProjects(projects);

      // 1. Charger les likes
      try { const counts = JSON.parse(localStorage.getItem('rise_project_likes_counts') || '{}'); setProjectLikes(counts && typeof counts === 'object' && !Array.isArray(counts) ? counts : {}); }
      catch { setProjectLikes({}); }

      // 2. Charger les Supports (Propositions)
      let allSupports: ProjectSupport[] = [];
      try { const parsed = JSON.parse(localStorage.getItem('rise_project_supports') || '[]'); if (Array.isArray(parsed)) allSupports = parsed.filter(s => s && s.projectId != null); } catch { /* ne pas écraser des données illisibles */ }
      
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
      if (!initialCreateMode) {
          directCreateHandled.current = false;
          directCreatePending.current = false;
          return;
      }
      if (!directCreateHandled.current) {
          directCreateHandled.current = true;
          if (canPerformAction(user, 'publishProject')) {
              setEditingProject(null);
              setView('form');
              setShowSubscriptionNotice(false);
          } else {
              directCreatePending.current = true;
              setShowSubscriptionNotice(true);
              openSubscription();
          }
      } else if (directCreatePending.current && canPerformAction(user, 'publishProject')) {
          directCreatePending.current = false;
          setEditingProject(null);
          setView('form');
          setShowSubscriptionNotice(false);
      }
  }, [initialCreateMode, user, openSubscription]);

  const handleSave = (projectData: any) => {
      setStorageError('');
      const current = getCurrentLocalSession(user);
      if (!current) { setStorageError('Votre session a changé. Reconnectez-vous avant d’enregistrer le projet.'); return; }
      if (!canPerformAction(current, 'publishProject')) {
          window.dispatchEvent(new StorageEvent('storage', { key: 'rise_user_data' }));
          setShowSubscriptionNotice(true);
          openSubscription();
          return;
      }
      if (!user) return;

      let updatedList;
      let projectToSave;
      let publicProjects: any[];
      try {
          const parsed = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
          if (!Array.isArray(parsed)) throw new Error('invalid projects');
          publicProjects = parsed;
      } catch {
          setStorageError('Les projets locaux sont illisibles ; la sauvegarde a été interrompue.');
          return;
      }

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
          if (editingProject.ownerId != null && String(editingProject.ownerId) !== String(user.id)) {
              setStorageError('Ce projet appartient à un autre compte.');
              return;
          }
          projectToSave = { 
              ...editingProject, 
              ...projectData, 
              ownerId: user.id,
              studentEmail: user.email,
              student: commonMetadata.student,
              school: commonMetadata.school
          };
          updatedList = localProjects.map(p => p.id === editingProject.id ? projectToSave : p);
          
          const matches = publicProjects.filter((p: any) => p?.id != null && String(p.id) === String(editingProject.id));
          if (matches.length > 1) { setStorageError('Ce projet comporte des identifiants en double.'); return; }
          const existingPublicIndex = publicProjects.findIndex((p: any) => p?.id != null && String(p.id) === String(editingProject.id));
          if (existingPublicIndex >= 0) {
              const existing = publicProjects[existingPublicIndex];
              if (!ownsStoredProject(existing, user)) {
                  setStorageError('Ce projet appartient à un autre compte.');
                  return;
              }
              publicProjects[existingPublicIndex] = projectToSave;
          } else {
              publicProjects.unshift({ ...projectToSave, ownerId: user.id, studentEmail: user.email });
          }

      } else {
          let newId = Date.now();
          while (publicProjects.some(p => p?.id != null && String(p.id) === String(newId)) || localProjects.some(p => p?.id != null && String(p.id) === String(newId))) newId++;
          projectToSave = { id: newId, ...commonMetadata, ...projectData, createdAt: new Date().toISOString() };
          updatedList = [projectToSave, ...localProjects];
          publicProjects.unshift(projectToSave);

      }

      const previousProjects = localStorage.getItem('rise_custom_projects');
      try {
          localStorage.setItem('rise_custom_projects', JSON.stringify(publicProjects));
          try { updateUser({ myProjects: updatedList }); }
          catch (error) { if (previousProjects === null) localStorage.removeItem('rise_custom_projects'); else localStorage.setItem('rise_custom_projects', previousProjects); throw error; }
      } catch {
          setStorageError('Impossible de sauvegarder le projet dans ce navigateur.');
          return;
      }
      setLocalProjects(updatedList);
      if (window.Toastify) window.Toastify({ text: editingProject ? 'Projet mis à jour dans ce navigateur.' : 'Projet publié dans ce navigateur.', style: { background: '#2563eb' } }).showToast();
      setView('list');
      setEditingProject(null);
      navigate('/profile?tab=projects');
  };

  const openForm = (project: any = null) => {
      if (!canPerformAction(user, 'publishProject')) {
          setShowSubscriptionNotice(true);
          openSubscription();
          return;
      }
      setShowSubscriptionNotice(false);
      setEditingProject(project);
      setView('form');
  };

  const handleEdit = (project: any) => openForm(project);
  const subscriptionNotice = showSubscriptionNotice && (
      <div role="status" className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-950 mb-5">
          Un abonnement étudiant actif est nécessaire pour publier ou modifier un projet. Vous pouvez toujours consulter et supprimer vos projets.
          <button type="button" onClick={openSubscription} className="ml-2 font-bold underline underline-offset-2">Choisir mon abonnement</button>
      </div>
  );

  const handleDelete = (id: number) => {
      if (!user || !window.confirm("Supprimer ce projet ?")) return;
      setStorageError('');
      try {
          if (!getCurrentLocalSession(user)) throw new Error('session');
          const parsed = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]');
          if (!Array.isArray(parsed)) throw new Error('invalid projects');
          const matches = parsed.filter((p: any) => p?.id != null && String(p.id) === String(id));
          if (matches.length > 1 || (matches.length === 1 && !ownsStoredProject(matches[0], user))) throw new Error('ownership');
          const updatedPublic = parsed.filter((p: any) => p !== matches[0]);
          const updatedList = localProjects.filter(p => String(p.id) !== String(id));
          const previousProjects = localStorage.getItem('rise_custom_projects');
          localStorage.setItem('rise_custom_projects', JSON.stringify(updatedPublic));
          try { updateUser({ myProjects: updatedList }); }
          catch (error) { if (previousProjects === null) localStorage.removeItem('rise_custom_projects'); else localStorage.setItem('rise_custom_projects', previousProjects); throw error; }
          setLocalProjects(updatedList);
          if (window.Toastify) window.Toastify({ text: "Projet supprimé.", style: { background: "#64748b" } }).showToast();
      } catch {
          setStorageError('Impossible de supprimer le projet : données locales illisibles.');
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
              {subscriptionNotice}
              {storageError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{storageError}</p>}
              <ProjectForm initialData={editingProject} onSave={handleSave} onCancel={() => { setView('list'); setEditingProject(null); navigate('/profile?tab=projects'); }} />
          </div>
      );
  }

  // --- RENDER LIST ---
  return (
    <div className="space-y-6 animate-fade-in delay-100">
        {subscriptionNotice}
        {storageError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{storageError}</p>}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
            <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Rocket className="text-primary" size={20} /> Mes Projets
                </h3>
                <p className="text-sm text-gray-500 mt-1">Gérez votre portfolio d'innovation.</p>
            </div>
            <button 
                onClick={() => openForm()}
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
                                    <Handshake size={12} /> {supports.length} proposition(s) de soutien
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
                    onClick={() => openForm()}
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
