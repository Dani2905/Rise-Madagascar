import React, { useState } from 'react';
import { Calendar, Star, Save, UserCheck, MessageSquare, Briefcase, X, Edit3, Check } from 'lucide-react';

interface InternshipTrackerProps {
  candidates: any[];
  jobs: any[];
  onUpdate: (candidateId: number, trackingData: any) => void;
}

const InternshipTracker: React.FC<InternshipTrackerProps> = ({ candidates, jobs, onUpdate }) => {
  const activeCandidates = candidates.filter(c => c.status === 'accepted');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Local state for edits before save
  const [formData, setFormData] = useState<{
      startDate: string;
      endDate: string;
      evaluation: number;
      feedback: string;
  }>({ startDate: '', endDate: '', evaluation: 0, feedback: '' });

  // Group candidates by Job ID
  const groupedCandidates = activeCandidates.reduce((acc, candidate) => {
      const jobId = candidate.jobId;
      if (!acc[jobId]) {
          acc[jobId] = [];
      }
      acc[jobId].push(candidate);
      return acc;
  }, {} as Record<string, any[]>);

  const handleEditClick = (candidate: any) => {
      setEditingId(candidate.id);
      // Pré-remplir le formulaire avec les données existantes si elles existent
      setFormData({
          startDate: candidate.tracking?.startDate || '',
          endDate: candidate.tracking?.endDate || '',
          evaluation: candidate.tracking?.evaluation || 0,
          feedback: candidate.tracking?.feedback || ''
      });
  };

  const handleSave = (id: number) => {
      onUpdate(id, formData);
      setEditingId(null);
      window.Toastify({
          text: "Suivi mis à jour et envoyé au candidat !",
          style: { background: "linear-gradient(to right, #10B981, #059669)" }
      }).showToast();
  };

  const renderStars = (currentRating: number, isInteractive: boolean = false) => {
      return (
          <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                      key={star}
                      type="button"
                      disabled={!isInteractive}
                      onClick={() => isInteractive && setFormData({ ...formData, evaluation: star })}
                      className={`transition-transform ${isInteractive ? 'hover:scale-110 cursor-pointer p-0.5' : 'cursor-default'}`}
                  >
                      <Star 
                          size={isInteractive ? 18 : 14} 
                          className={`${star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                  </button>
              ))}
          </div>
      );
  };

  if (activeCandidates.length === 0) {
      return (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun candidat actif</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                  Validez des candidatures pour commencer à suivre le travail, les dates et l'évaluation de vos candidats par activité.
              </p>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <h2 className="text-xl font-heading font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-yellow-100/50 text-yellow-600 rounded-xl">
                <Briefcase size={20} />
            </div>
            Suivi des Candidats par Activité
        </h2>

        {Object.entries(groupedCandidates).map(([jobId, group]) => {
            const candidatesGroup = group as any[];
            const job = jobs.find(j => j.id === Number(jobId) || j.id.toString() === jobId);
            const jobTitle = job ? job.title : "Activité inconnue";

            return (
                <div key={jobId} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {/* Activity Header */}
                    <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-yellow-600 shadow-sm">
                                <Briefcase size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 tracking-tight">{jobTitle}</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{candidatesGroup.length} candidat(s) actif(s)</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Layout */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white text-[11px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 w-[25%]">Candidat</th>
                                    <th className="px-6 py-5 w-[20%]">Période</th>
                                    <th className="px-6 py-5 w-[20%]">Performance</th>
                                    <th className="px-6 py-5 w-[25%]">Dernier Feedback</th>
                                    <th className="px-6 py-5 w-[10%] text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {candidatesGroup.map((candidate: any) => {
                                    const isEditing = editingId === candidate.id;

                                    return (
                                        <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Column 1: Candidate Info */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200/60 shadow-sm shrink-0">
                                                        <img src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.name}`} alt={candidate.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 tracking-tight">{candidate.name}</div>
                                                        <div className="text-xs font-medium text-gray-500 mb-1">{candidate.school}</div>
                                                        <span className="inline-flex mt-0.5 items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-200/60">
                                                            En poste
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Period */}
                                            <td className="px-6 py-6 align-top">
                                                {isEditing ? (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col">
                                                            <label className="text-[10px] font-bold text-gray-400">Début</label>
                                                            <input 
                                                                type="date" 
                                                                value={formData.startDate}
                                                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="text-[10px] font-bold text-gray-400">Fin</label>
                                                            <input 
                                                                type="date" 
                                                                value={formData.endDate}
                                                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-700">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs text-gray-400 w-8">Début:</span>
                                                            <span className="font-medium text-xs">{candidate.tracking?.startDate ? new Date(candidate.tracking.startDate).toLocaleDateString() : '-'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-400 w-8">Fin:</span>
                                                            <span className="font-medium text-xs">{candidate.tracking?.endDate ? new Date(candidate.tracking.endDate).toLocaleDateString() : '-'}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Column 3: Performance */}
                                            <td className="px-6 py-4 align-top">
                                                {isEditing ? (
                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block">
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1">Évaluation globale</p>
                                                        {renderStars(formData.evaluation, true)}
                                                        <div className="text-center text-xs font-bold text-slate-500 mt-1">{formData.evaluation}/5</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {candidate.tracking?.evaluation ? (
                                                            <>
                                                                {renderStars(candidate.tracking.evaluation)}
                                                                <div className="text-xs font-medium text-slate-500 mt-1">
                                                                    Note: <span className="text-slate-900 font-bold">{candidate.tracking.evaluation}/5</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Non évalué</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Column 4: Feedback */}
                                            <td className="px-6 py-4 align-top">
                                                {isEditing ? (
                                                    <textarea 
                                                        value={formData.feedback}
                                                        onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                                                        placeholder="Note sur le travail, points forts, axes d'amélioration..."
                                                        className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none h-24 bg-white"
                                                    />
                                                ) : (
                                                    candidate.tracking?.feedback ? (
                                                        <div className="flex gap-2 items-start bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                                                            <MessageSquare size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                                                            <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3">
                                                                "{candidate.tracking.feedback}"
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Aucun feedback enregistré.</span>
                                                    )
                                                )}
                                            </td>

                                            {/* Column 5: Actions */}
                                            <td className="px-6 py-4 align-top text-right">
                                                {isEditing ? (
                                                    <div className="flex flex-col gap-2 items-end">
                                                        <button 
                                                            onClick={() => handleSave(candidate.id)}
                                                            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                                            title="Enregistrer"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 bg-white border border-gray-200 text-slate-500 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors"
                                                            title="Annuler"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEditClick(candidate)}
                                                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                                                        title="Modifier le suivi"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default InternshipTracker;