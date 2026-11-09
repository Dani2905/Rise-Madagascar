
import React from 'react';
import { Briefcase, X, CheckCircle, Medal, Eye, XCircle, Clock, Star, Users } from 'lucide-react';

interface CompanyCandidatesTabProps {
  selectedJobFilter: string | null;
  activeJobsList: any[];
  setSelectedJobFilter: (id: string | null) => void;
  displayedCandidates: any[];
  openCandidateModal: (candidate: any) => void;
  handleCandidateDecision: (id: number, status: 'rejected' | 'interview' | 'accepted' | 'pending') => void;
  handleOpenReview: (candidate: any) => void;
}

const CompanyCandidatesTab: React.FC<CompanyCandidatesTabProps> = ({
  selectedJobFilter,
  activeJobsList,
  setSelectedJobFilter,
  displayedCandidates,
  openCandidateModal,
  handleCandidateDecision,
  handleOpenReview
}) => {
  return (
    <div className="space-y-6">
      {selectedJobFilter && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-yellow-700">
               <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-0.5">Filtre Actif</p>
              <p className="font-bold text-slate-900 text-sm">Candidats pour : "{activeJobsList.find(j => j.id.toString() === selectedJobFilter.toString())?.title || 'Offre sélectionnée'}"</p>
            </div>
          </div>
          <button onClick={() => setSelectedJobFilter(null)} className="p-2 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 transition-colors shadow-sm bg-yellow-100/50"><X size={18}/></button>
        </div>
      )}
      
      {displayedCandidates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
        {displayedCandidates.map(candidate => (
          <div key={candidate.id} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            {candidate.status === 'completed' && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rotate-45 translate-x-10 -translate-y-10 shadow-md"></div>}
            {candidate.status === 'accepted' && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rotate-45 translate-x-10 -translate-y-10 shadow-md"></div>}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 flex-1">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 shrink-0 relative shadow-sm border border-gray-200/50">
                <img src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.name}`} className="w-full h-full rounded-2xl object-cover" alt="" />
                {candidate.status === 'accepted' && <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 border-4 border-white shadow-sm"><CheckCircle size={14} /></div>}
                {candidate.status === 'completed' && <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full p-1.5 border-4 border-white shadow-sm"><Medal size={14} /></div>}
              </div>
              <div className="text-center md:text-left flex-1 min-w-0 mt-1">
                <h4 className="text-xl font-heading font-black text-slate-900 truncate tracking-tight">{candidate.name}</h4>
                <p className="text-yellow-700 font-bold text-sm truncate mt-0.5">{candidate.role}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">{candidate.school}</p>
                
                {candidate.status === 'completed' && (
                  <span className="inline-flex mt-3 items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black tracking-wide bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border border-yellow-200/60 shadow-sm">
                    <Medal size={12} className="text-yellow-600"/> Mission Terminée & Notée
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-48 border-t md:border-t-0 md:border-l border-gray-100/60 pt-5 md:pt-0 md:pl-8">
              <button 
                onClick={() => openCandidateModal(candidate)} 
                className="w-full py-2.5 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-gray-50 flex justify-center items-center gap-2 transition-all"
              >
                <Eye size={16} className="text-gray-400" /> Voir Profil
              </button>
              
              {candidate.status !== 'completed' && (
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleCandidateDecision(candidate.id, 'rejected')} className={`p-2.5 rounded-xl border flex justify-center items-center transition-all ${candidate.status === 'rejected' ? 'bg-red-500 border-red-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`} title="Refuser"><XCircle size={18}/></button>
                  <button onClick={() => handleCandidateDecision(candidate.id, 'interview')} className={`p-2.5 rounded-xl border flex justify-center items-center transition-all ${candidate.status === 'interview' ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'}`} title="Entretien"><Clock size={18}/></button>
                  <button onClick={() => handleCandidateDecision(candidate.id, 'accepted')} className={`p-2.5 rounded-xl border flex justify-center items-center transition-all ${candidate.status === 'accepted' ? 'bg-green-500 border-green-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200'}`} title="Accepter"><CheckCircle size={18}/></button>
                </div>
              )}

              {candidate.status === 'accepted' && (
                <button 
                  onClick={() => handleOpenReview(candidate)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:from-yellow-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-yellow-500/20 mt-1"
                >
                  <Star size={16} className="fill-white" /> Terminer & Noter
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Aucun candidat</h3>
            <p className="text-sm text-gray-500 font-medium">Il n'y a pas encore de candidatures pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyCandidatesTab;
