
import React from 'react';
import { Trash2, Briefcase, Users } from 'lucide-react';

interface CompanyJobsTabProps {
  activeJobsList: any[];
  setEditingJob: (job: any) => void;
  setSelectedJobFilter: (id: string) => void;
  changeTab: (tab: any) => void;
  handleDeleteJob: (id: string | number) => void;
  handleCreateJob: () => void;
}

const CompanyJobsTab: React.FC<CompanyJobsTabProps> = ({ 
  activeJobsList, 
  setEditingJob, 
  setSelectedJobFilter, 
  changeTab, 
  handleDeleteJob,
  handleCreateJob
}) => {
  return (
    <div className="space-y-4">
      {activeJobsList.length > 0 ? activeJobsList.map(job => (
        <div key={job.id} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
               <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">{job.title}</h3>
               {job.status === 'Actif' && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-widest">Actif</span>}
            </div>
            <p className="text-[13px] text-gray-500 font-medium flex items-center gap-3">
               <span>Publié {job.postedAt || job.posted}</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="inline-flex items-center gap-1.5 text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                   <Users size={14} className="text-slate-400" />
                   {job.candidates || 0} candidat(s)
               </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={() => { setEditingJob(job); changeTab('post-job'); }} className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-gray-50/50 transition-all">Modifier</button>
            <button onClick={() => { setSelectedJobFilter(job.id.toString()); changeTab('candidates'); }} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all">Voir Candidats</button>
            <button type="button" aria-label={`Supprimer ${job.title}`} onClick={() => handleDeleteJob(job.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20}/></button>
          </div>
        </div>
      )) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
            <Briefcase size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Aucune offre publiée</h3>
          <p className="text-sm text-gray-500 mb-6 font-medium">Vous n'avez pas encore publié d'offres.</p>
          <button onClick={handleCreateJob} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
            Publier ma première offre
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyJobsTab;
