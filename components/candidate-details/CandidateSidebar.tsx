
import React from 'react';
import { Star, Mail, Phone, Lock, XCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';

interface CandidateSidebarProps {
  candidate: any;
  status: string | null;
  isLoggedIn: boolean;
  handleContact: () => void;
  handleStatusChange: (status: any, label: string) => void;
}

const CandidateSidebar: React.FC<CandidateSidebarProps> = ({ 
  candidate, 
  status, 
  isLoggedIn, 
  handleContact, 
  handleStatusChange 
}) => {
  const rating = candidate.rating || 0;
  const reviewCount = candidate.reviewCount || 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-b from-white to-slate-50/50">
            <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white mb-6 relative group">
                {candidate.avatarUrl ? <img src={candidate.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-3xl font-bold">{(candidate.name || '?').slice(0, 2).toUpperCase()}</span>}
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">{candidate.name}</h1>
            <p className="text-primary font-bold text-sm mb-3 bg-yellow-50 inline-block px-3 py-1 rounded-full border border-yellow-100">{candidate.role}</p>
            
            {/* Rating Badge */}
            {rating > 0 && (
                <div className="flex justify-center items-center gap-1.5 mb-6">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className={`${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="font-bold text-slate-900">{rating}</span>
                    <span className="text-xs text-gray-500">({reviewCount} avis)</span>
                </div>
            )}

            {/* Contact Actions */}
            {isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 mb-2">
                    {candidate.email && candidate.email.includes('@') && <a href={`mailto:${candidate.email}`} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all">
                        <Mail size={14} /> Email
                    </a>}
                    {candidate.phone && /^[+0-9\s().-]+$/.test(candidate.phone) && <a href={`tel:${candidate.phone}`} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all">
                        <Phone size={14} /> Appeler
                    </a>}
                </div>
            ) : (
                <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center"><p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Lock size={12} /> Contact masqué</p></div>
            )}
        </div>

        {/* Decision Panel (Only for current recruiter who owns the job) */}
        {isLoggedIn && candidate.jobId && status !== 'completed' && (
            <div className="p-6 bg-slate-900 text-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Action Recruteur</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <button onClick={() => handleStatusChange('rejected', 'Refusé')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${status === 'rejected' ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}><XCircle size={20} /><span className="text-[10px] font-bold">Refuser</span></button>
                    <button onClick={() => handleStatusChange('interview', 'Entretien')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${status === 'interview' ? 'bg-purple-900/50 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}><Clock size={20} /><span className="text-[10px] font-bold">Contact</span></button>
                    <button onClick={() => handleStatusChange('accepted', 'Accepté')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${status === 'accepted' ? 'bg-green-900/50 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}><CheckCircle size={20} /><span className="text-[10px] font-bold">Valider</span></button>
                </div>
                <button onClick={handleContact} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Envoyer un message
                </button>
            </div>
        )}
    </div>
  );
};

export default CandidateSidebar;
