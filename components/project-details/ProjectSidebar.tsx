import React, { useState } from 'react';
import { Users, LogIn, Edit3, Rocket, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPublicProjects } from '../../utils/projects';
import SupportModal from './SupportModal';
import { ProjectSupport } from '../../types';

const ProjectSidebar: React.FC<{ project: any }> = ({ project }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const isOwner = !!user && project.ownerId != null && String(user.id) === String(project.ownerId);
  const isRecruiter = user?.role === 'company' || user?.role === 'individual';
  const canContact = project.ownerId != null && !project.isDemo;
  const handleSupportConfirm = (data: { type: 'financing' | 'mentoring' | 'partnership'; message: string; amount?: string }): boolean => {
    const current = getPublicProjects().find(p => String(p.id) === String(project.id));
    if (!user || !isRecruiter || isOwner || !current || current.isDemo || current.ownerId == null || String(current.ownerId) !== String(project.ownerId) || !data.message.trim()) {
      if (window.Toastify) window.Toastify({ text: 'Impossible de proposer un soutien à ce projet.', style: { background: '#ef4444' } }).showToast();
      return false;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      if (!Array.isArray(stored)) throw new Error('invalid supports');
      const support: ProjectSupport = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, projectId: current.id, projectTitle: current.title, supporterId: user.id, supporterName: user.companyName || `${user.firstName} ${user.lastName}`, type: data.type, message: data.message.trim(), amount: data.type === 'financing' ? data.amount?.trim() : undefined, date: new Date().toLocaleDateString('fr-FR'), status: 'pending' };
      localStorage.setItem('rise_project_supports', JSON.stringify([...stored, support]));
      if (window.Toastify) window.Toastify({ text: 'Proposition de démonstration enregistrée dans ce navigateur.', style: { background: '#2563eb' } }).showToast();
      return true;
    } catch {
      if (window.Toastify) window.Toastify({ text: 'Impossible de sauvegarder la proposition locale.', style: { background: '#ef4444' } }).showToast();
      return false;
    }
  };
  return <div className="space-y-6">
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-900">Progression</h3><span className="text-xs font-bold text-green-700">{project.stage}</span></div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"><div className="bg-primary h-full" style={{ width: `${project.progress}%` }} /></div>
      <p className="text-xs text-gray-500 text-right mt-2">{project.progress}% complété</p>
    </div>
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      {isOwner ? <><h3 className="font-bold text-slate-900 mb-3">C’est votre projet</h3><button type="button" onClick={() => navigate('/profile?tab=projects')} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex justify-center items-center gap-2"><Edit3 size={18} /> Gérer mon projet</button></> : <>
        <h3 className="font-bold text-lg text-slate-900 mb-4">Besoin : {project.need}</h3>
        {project.isDemo ? <p className="text-sm text-slate-500">Ce projet est un exemple fictif ; aucun contact ou soutien réel n’est possible.</p>
          : !canContact ? <p className="text-sm text-slate-500">Le porteur de ce projet n’est pas disponible pour être contacté.</p>
          : !isLoggedIn ? <button type="button" onClick={() => navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } })} className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold flex justify-center items-center gap-2"><LogIn size={18} /> Se connecter</button>
          : isRecruiter ? <button type="button" onClick={() => setShowSupportModal(true)} className="w-full py-3 rounded-xl bg-primary text-slate-900 font-bold flex justify-center items-center gap-2"><Rocket size={18} /> Proposer un soutien</button>
          : <button type="button" onClick={() => navigate(`/messages?partner=${encodeURIComponent(String(project.ownerId))}`)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex justify-center items-center gap-2"><MessageCircle size={18} /> Contacter le porteur</button>}
        {canContact && <p className="text-xs text-slate-500 mt-4">Démonstration : les messages et propositions restent dans ce navigateur ; aucun financement ou envoi réel n’est effectué.</p>}
      </>}
    </div>
    {project.team?.length > 0 && <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"><h3 className="font-bold text-slate-900 mb-4 flex gap-2"><Users size={18} /> L’équipe</h3><ul className="space-y-3">{project.team.map((member: any, idx: number) => <li key={idx}><p className="font-bold text-sm text-slate-900">{member.name}</p><p className="text-xs text-gray-500">{member.role}</p></li>)}</ul></div>}
    <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} projectTitle={project.title} onConfirm={handleSupportConfirm} />
  </div>;
};
export default ProjectSidebar;
