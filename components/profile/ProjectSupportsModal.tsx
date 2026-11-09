
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Lightbulb, Handshake, CheckCircle, XCircle, MessageSquare, Calendar, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectSupport } from '../../types';

interface ProjectSupportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectTitle: string;
}

const ProjectSupportsModal: React.FC<ProjectSupportsModalProps> = ({ isOpen, onClose, projectId, projectTitle }) => {
  const navigate = useNavigate();
  const [supports, setSupports] = useState<ProjectSupport[]>([]);

  useEffect(() => {
    if (isOpen) {
        const allSupports = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
        // Filtrer les supports pour ce projet spécifique
        const projectSupports = allSupports.filter((s: ProjectSupport) => s.projectId.toString() === projectId.toString());
        setSupports(projectSupports.reverse()); // Les plus récents en premier
    }
  }, [isOpen, projectId]);

  const handleDecision = (supportId: string, status: 'accepted' | 'rejected') => {
      // 1. Mise à jour locale
      setSupports(prev => prev.map(s => s.id === supportId ? { ...s, status } : s));

      // 2. Mise à jour Database
      const allSupports = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      const updatedAll = allSupports.map((s: ProjectSupport) => s.id === supportId ? { ...s, status } : s);
      localStorage.setItem('rise_project_supports', JSON.stringify(updatedAll));

      window.Toastify({
          text: status === 'accepted' ? "Proposition acceptée ! Contactez le partenaire." : "Proposition refusée.",
          style: { background: status === 'accepted' ? "#10B981" : "#64748b" }
      }).showToast();
  };

  const handleContact = (supporterId: string | number) => {
      navigate(`/messages?partner=${supporterId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in flex flex-col">
        
        {/* Header Deal Room */}
        <div className="bg-slate-900 p-6 relative flex-shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex items-center gap-2 mb-1 relative z-10">
                <span className="px-2 py-0.5 bg-primary text-slate-900 rounded text-[10px] font-bold uppercase tracking-wider">Incubateur</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Espace Partenaires</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-1 flex items-center gap-3 relative z-10">
                Deal Room
            </h2>
            <p className="text-slate-400 text-sm relative z-10 flex items-center gap-2">
                Projet : <span className="text-white font-bold">{projectTitle}</span>
            </p>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20 bg-white/10 p-2 rounded-full">
                <X size={20} />
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
            {supports.length > 0 ? (
                supports.map(support => (
                    <div key={support.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            support.status === 'accepted' ? 'bg-green-500' : 
                            support.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Icon Type */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                support.type === 'financing' ? 'bg-green-100 text-green-600' :
                                support.type === 'mentoring' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {support.type === 'financing' && <TrendingUp size={24} />}
                                {support.type === 'mentoring' && <Lightbulb size={24} />}
                                {support.type === 'partnership' && <Handshake size={24} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                            {support.supporterName}
                                            <span className="text-[10px] font-normal text-gray-400 px-1.5 py-0.5 border border-gray-200 rounded bg-gray-50">Investisseur</span>
                                        </h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Calendar size={10} /> {support.date}
                                        </p>
                                    </div>
                                    {support.status === 'pending' ? (
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">En attente</span>
                                    ) : support.status === 'accepted' ? (
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100">Accepté</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase rounded border border-red-100">Refusé</span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                    "{support.message}"
                                </p>

                                {support.type === 'financing' && support.amount && (
                                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                        <TrendingUp size={16} /> Proposition : {support.amount}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                                    {support.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleDecision(support.id, 'accepted')}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-2 transition-colors shadow-sm"
                                            >
                                                <CheckCircle size={14} /> Accepter l'offre
                                            </button>
                                            <button 
                                                onClick={() => handleDecision(support.id, 'rejected')}
                                                className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 flex items-center gap-2 transition-colors"
                                            >
                                                <XCircle size={14} /> Refuser
                                            </button>
                                        </>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleContact(support.supporterId)}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-2 transition-colors ml-auto"
                                    >
                                        <MessageSquare size={14} /> Discuter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 px-8 bg-white rounded-3xl border border-dashed border-gray-200 h-full flex flex-col justify-center items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <Briefcase size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Deal Room Vide</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                        C'est ici que s'afficheront les propositions de financement, de mentorat ou de partenariat venant des entreprises et particuliers.
                    </p>
                    <div className="mt-6 flex gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Business Angels</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100">Mentors</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSupportsModal;
