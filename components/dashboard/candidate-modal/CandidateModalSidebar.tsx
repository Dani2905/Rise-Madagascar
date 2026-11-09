
import React from 'react';
import { MapPin, Star, CheckCircle, XCircle, Clock, MessageSquare, Mail, Phone, Download } from 'lucide-react';

interface CandidateModalSidebarProps {
  profile: any;
  status: string;
  onStatusUpdate: (status: 'pending' | 'interview' | 'rejected' | 'accepted') => void;
}

const CandidateModalSidebar: React.FC<CandidateModalSidebarProps> = ({ profile, status, onStatusUpdate }) => {
  const rating = profile.rating || 0;
  const reviewCount = profile.reviewCount || 0;

  return (
    <div className="w-full md:w-[350px] bg-slate-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 md:p-8 flex flex-col h-auto md:h-full md:overflow-y-auto shrink-0 z-10 relative">
        <div className="text-center mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white mb-4 relative group">
                <img src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=random&size=128`} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {status === 'accepted' && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]"><CheckCircle className="text-white drop-shadow-md" size={40} /></div>}
                {status === 'rejected' && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]"><XCircle className="text-white drop-shadow-md" size={40} /></div>}
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-900 leading-tight mb-1">{profile.name}</h2>
            <p className="text-primary font-bold text-sm mb-3">{profile.role}</p>
            
            {rating > 0 && (
                <div className="flex items-center justify-center gap-1.5 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                size={14} 
                                className={`${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{rating}</span>
                    <span className="text-[10px] text-gray-400">({reviewCount})</span>
                </div>
            )}

            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 bg-white/50 py-1 px-3 rounded-full inline-flex border border-gray-100">
                <MapPin size={12} /> {profile.location}
            </div>
        </div>

        <div className="space-y-4">
            
            {/* Actions Recruteur (Status) */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Décision Recrutement</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <button 
                        onClick={() => onStatusUpdate('rejected')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${status === 'rejected' ? 'bg-red-50 border-red-200 text-red-600 ring-1 ring-red-500' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
                        title="Refuser"
                    >
                        <XCircle size={20} className="mb-1" />
                        <span className="text-[9px] font-bold">Refuser</span>
                    </button>
                    <button 
                        onClick={() => onStatusUpdate('interview')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${status === 'interview' ? 'bg-purple-50 border-purple-200 text-purple-600 ring-1 ring-purple-500' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-purple-50 hover:text-purple-500'}`}
                        title="Entretien"
                    >
                        <Clock size={20} className="mb-1" />
                        <span className="text-[9px] font-bold">Entretien</span>
                    </button>
                    <button 
                        onClick={() => onStatusUpdate('accepted')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${status === 'accepted' ? 'bg-green-50 border-green-200 text-green-600 ring-1 ring-green-500' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-green-50 hover:text-green-500'}`}
                        title="Accepter"
                    >
                        <CheckCircle size={20} className="mb-1" />
                        <span className="text-[9px] font-bold">Valider</span>
                    </button>
                </div>
                <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> Envoyer un message
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hidden md:block">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Coordonnées</h3>
                <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3 text-slate-700 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Mail size={14} />
                        </div>
                        <span className="truncate font-medium">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Phone size={14} />
                        </div>
                        <span className="font-medium">{profile.phone}</span>
                    </div>
                </div>
            </div>

            <div className="hidden md:block">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Top Compétences</h3>
                <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg shadow-sm hover:border-primary/50 transition-colors cursor-default">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-auto pt-6 hidden md:block">
            <button 
                onClick={() => { window.Toastify({ text: "CV téléchargé", style: { background: "#64748b" } }).showToast(); }}
                className="w-full py-3 bg-white border-2 border-dashed border-gray-300 text-slate-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 text-sm group"
            >
                <Download size={16} className="group-hover:text-primary transition-colors" /> Télécharger le CV
            </button>
        </div>
    </div>
  );
};

export default CandidateModalSidebar;
