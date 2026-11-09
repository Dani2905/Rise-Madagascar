
import React, { useState } from 'react';
import { Flag, Mail, Users, Lock, LogIn, Phone, X, Copy, Check, Edit3, ArrowRight, Rocket } from 'lucide-react';
import { Project } from '../../data/resourcesData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SupportModal from './SupportModal';
import { ProjectSupport } from '../../types';

interface ProjectSidebarProps {
  project: Project | any; // Accept custom project type
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isOwner = user && project.ownerId && user.id === project.ownerId;
  const isRecruiter = user?.role === 'company' || user?.role === 'individual';

  // Récupération des données de contact (Dynamique ou Mock)
  const contactEmail = project.studentEmail || (project.student ? `${project.student.split(' ')[0].toLowerCase()}.pro@gmail.com` : "contact@rise.mg");
  const contactPhone = project.studentPhone || "+261 34 00 000 00";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    window.Toastify({
        text: "Copié !",
        duration: 1000,
        gravity: "bottom",
        position: "center",
        style: { background: "#334155" }
    }).showToast();
  };

  const handleEditProject = () => {
      navigate('/profile?tab=projects'); // Redirige vers le dashboard pour éditer
  };

  const handleSupportConfirm = (data: { type: 'financing' | 'mentoring' | 'partnership', message: string, amount?: string }) => {
      if (!user) return;

      const newSupport: ProjectSupport = {
          id: Date.now().toString(),
          projectId: project.id,
          projectTitle: project.title,
          supporterId: user.id,
          supporterName: user.companyName || `${user.firstName} ${user.lastName}`,
          type: data.type,
          message: data.message,
          amount: data.amount,
          date: new Date().toLocaleDateString('fr-FR'),
          status: 'pending'
      };

      // Sauvegarde dans le localStorage (Simule DB)
      const existingSupports = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      localStorage.setItem('rise_project_supports', JSON.stringify([...existingSupports, newSupport]));

      window.Toastify({
          text: "Proposition envoyée au porteur de projet !",
          style: { background: "linear-gradient(to right, #10B981, #059669)" }
      }).showToast();
  };

  return (
    <div className="space-y-6 animate-fade-in delay-200">
        
        {/* Progress Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Progression</h3>
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 uppercase">
                    {project.stage}
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
                <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${project.progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 text-right font-medium">{project.progress}% complété</p>
        </div>

        {/* Action / Needs Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-primary/5">
            
            {/* Owner View */}
            {isOwner ? (
                <div className="text-center">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">C'est votre projet</h3>
                    <p className="text-sm text-gray-500 mb-6">Gérez votre visibilité et vos mises à jour.</p>
                    <button 
                        onClick={handleEditProject}
                        className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mb-3"
                    >
                        <Edit3 size={18} /> Modifier le projet
                    </button>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-700 text-xs font-bold border border-blue-100">
                        Votre projet est visible dans l'incubateur.
                    </div>
                </div>
            ) : (
                /* Public / Recruiter View */
                <>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Ils ont besoin de vous</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border bg-green-50 text-green-700 border-green-100`}>
                            Besoin : {project.need}
                        </span>
                        {project.tags && project.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {isLoggedIn ? (
                        <>
                            {/* BOUTON SPECIFIQUE POUR RECRUTEURS/PARTICULIERS */}
                            {isRecruiter ? (
                                <button 
                                    onClick={() => setShowSupportModal(true)}
                                    className="w-full py-4 rounded-xl bg-primary text-slate-900 font-bold text-lg shadow-xl hover:bg-yellow-400 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-3"
                                >
                                    <Rocket size={18} /> Propulser ce projet
                                </button>
                            ) : (
                                !showContact && (
                                    <button 
                                        onClick={() => setShowContact(true)}
                                        className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-3"
                                    >
                                        Contacter l'équipe <ArrowRight size={18} />
                                    </button>
                                )
                            )}

                            {showContact && (
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 animate-fade-in relative">
                                    <button 
                                        onClick={() => setShowContact(false)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-slate-900 transition-colors p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                    <h4 className="font-bold text-slate-900 text-sm mb-3">Contacter le porteur</h4>
                                    
                                    <div className="space-y-3">
                                        {/* Email */}
                                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm group">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <Mail size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-medium">Email</p>
                                                <p className="text-sm font-bold text-slate-900 truncate select-all">{contactEmail}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCopy(contactEmail, 'email')}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {copiedField === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm group">
                                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                                <Phone size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-medium">Téléphone</p>
                                                <p className="text-sm font-bold text-slate-900 truncate select-all">{contactPhone}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCopy(contactPhone, 'phone')}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {copiedField === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-3 text-center italic">
                                        Mentionnez "Vu sur Rise" lors de votre prise de contact.
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full py-4 rounded-xl bg-gray-100 text-slate-500 font-bold text-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <LogIn size={16} /> Se connecter pour contacter
                        </button>
                    )}
                </>
            )}
        </div>

        {/* Team Card */}
        {project.team && project.team.length > 0 && (
             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-gray-400" /> L'Équipe
                </h3>
                <div className="space-y-4">
                    {project.team.map((member: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                 <p className="font-bold text-sm text-slate-900">{member.name}</p>
                                 <p className="text-xs text-gray-500">{member.role}</p>
                             </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {!isOwner && (
            <div className="text-center">
                <button className="text-xs text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors">
                    <Flag size={12} /> Signaler ce projet
                </button>
            </div>
        )}

        {/* Modal de Support */}
        <SupportModal 
            isOpen={showSupportModal} 
            onClose={() => setShowSupportModal(false)}
            projectTitle={project.title}
            onConfirm={handleSupportConfirm}
        />

    </div>
  );
};

export default ProjectSidebar;
