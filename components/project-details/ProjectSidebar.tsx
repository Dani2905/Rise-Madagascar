import React, { useState } from 'react';
import { Users, LogIn, Edit3, Rocket, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPublicProjects } from '../../utils/projects';
import SupportModal from './SupportModal';
import { ProjectSupport } from '../../types';
import { getCurrentLocalSession } from '../../utils/subscription';
import { readLocalArray } from '../../utils/recruiterDashboard';
import { projectSupportAllowed } from '../../context/MessagingContext';

const ProjectSidebar: React.FC<{ project: any }> = ({ project }) => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const isOwner = !!user && project.ownerId != null && String(user.id) === String(project.ownerId);
  const isRecruiter = user?.role === 'company' || user?.role === 'individual';
  const canContact = (() => {
    if (project.ownerId == null || project.isDemo) return false;
    try {const users=readLocalArray('rise_db_users'), owners=users.filter(u=>u?.id != null && String(u.id) === String(project.ownerId));return owners.length === 1 && owners[0].role === 'student';} catch {return false;}
  })();
  const handleSupportConfirm = (data: { type: 'financing' | 'mentoring' | 'partnership'; message: string; amount?: string }): boolean => {
    const current = getPublicProjects().find(p => String(p.id) === String(project.id));
    if (!user || !getCurrentLocalSession(user) || !isRecruiter || isOwner || !current || current.isDemo || current.ownerId == null || String(current.ownerId) !== String(project.ownerId) || !data.message.trim()) {
      if (window.Toastify) window.Toastify({ text: 'Impossible de proposer un soutien à ce projet.', style: { background: '#ef4444' } }).showToast();
      return false;
    }
    try {
      const users = readLocalArray('rise_db_users'), projects = readLocalArray('rise_custom_projects');
      const sender = users.filter(u => u?.id != null && String(u.id) === String(user.id)), owners = users.filter(u => u?.id != null && String(u.id) === String(current.ownerId));
      const originals = projects.filter(p => p?.id != null && String(p.id) === String(current.id));
      if (sender.length !== 1 || sender[0].role !== user.role || owners.length !== 1 || owners[0].role !== 'student' || originals.length !== 1 || String(originals[0].ownerId) !== String(current.ownerId) || !projectSupportAllowed(user.id,current.ownerId)) throw new Error();
      const stored = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      if (!Array.isArray(stored)) throw new Error('invalid supports');
      const support: ProjectSupport = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, projectId: current.id, projectTitle: current.title, supporterId: user.id, supporterName: user.companyName || `${user.firstName} ${user.lastName}`, type: data.type, message: data.message.trim(), amount: data.type === 'financing' ? data.amount?.trim() : undefined, date: new Date().toLocaleDateString('fr-FR'), status: 'pending' };
      localStorage.setItem('rise_project_supports', JSON.stringify([...stored, support]));
      setSupportMessage('Proposition simulée enregistrée dans ce navigateur, sans envoi réel.');
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
      {supportMessage && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{supportMessage}</p>}
      {isOwner ? <><h3 className="font-bold text-slate-900 mb-3">C’est votre projet</h3><button type="button" onClick={() => navigate('/profile?tab=projects')} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex justify-center items-center gap-2"><Edit3 size={18} /> Gérer mon projet</button></> : <>
        <h3 className="font-bold text-lg text-slate-900 mb-4">Besoin : {project.need}</h3>
        {project.isDemo ? <p className="text-sm text-slate-500">Ce projet est un exemple fictif ; aucun contact ou soutien réel n’est possible.</p>
          : !canContact ? <p className="text-sm text-slate-500">Le porteur de ce projet n’est pas disponible pour être contacté.</p>
          : isLoading ? <p className="text-sm text-slate-500">Vérification de la session…</p>
          : !isLoggedIn ? <div className="space-y-3"><p className="text-sm leading-relaxed text-slate-600">Vous pouvez consulter ce projet sans compte. Pour contacter son porteur ou lui envoyer une proposition de soutien, connectez-vous ou créez un compte gratuit.</p><button type="button" onClick={() => navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } })} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex justify-center items-center gap-2"><LogIn size={18} /> Se connecter</button><button type="button" onClick={() => navigate('/register', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } })} className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold">Créer un compte gratuit</button><p className="text-xs text-slate-500">Entreprises et particuliers peuvent proposer un soutien ; les étudiants peuvent demander à contacter le porteur.</p></div>
          : isRecruiter ? <button type="button" onClick={() => setShowSupportModal(true)} className="w-full py-3 rounded-xl bg-primary text-slate-900 font-bold flex justify-center items-center gap-2"><Rocket size={18} /> Proposer un soutien</button>
          : <button type="button" onClick={() => navigate(`/messages?partner=${encodeURIComponent(String(project.ownerId))}&project=${encodeURIComponent(String(project.id))}`)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex justify-center items-center gap-2"><MessageCircle size={18} /> Contacter le porteur</button>}
        {canContact && <p className="text-xs text-slate-500 mt-4">Démonstration : les messages et propositions restent dans ce navigateur ; aucun financement ou envoi réel n’est effectué.</p>}
      </>}
    </div>
    {project.team?.length > 0 && <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"><h3 className="font-bold text-slate-900 mb-4 flex gap-2"><Users size={18} /> L’équipe</h3><ul className="space-y-3">{project.team.map((member: any, idx: number) => <li key={idx}><p className="font-bold text-sm text-slate-900">{member.name}</p><p className="text-xs text-gray-500">{member.role}</p></li>)}</ul></div>}
    <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} projectTitle={project.title} onConfirm={handleSupportConfirm} />
  </div>;
};
export default ProjectSidebar;
