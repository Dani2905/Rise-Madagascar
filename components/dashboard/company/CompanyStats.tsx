
import React from 'react';
import { Briefcase, Users } from 'lucide-react';

interface CompanyStatsProps {
  stats: { activeJobs: number; totalCandidates: number; newMessages: number };
  changeTab: (tab: any) => void;
}

const CompanyStats: React.FC<CompanyStatsProps> = ({ stats, changeTab }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div onClick={() => changeTab('jobs')} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-yellow-200 transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 w-fit group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Briefcase size={22} strokeWidth={2.5} />
            </div>
            <p className="text-4xl font-heading font-black text-slate-900 tracking-tight">{stats.activeJobs}</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Offres Actives</p>
          </div>
        </div>
      </div>
      
      <div onClick={() => changeTab('candidates')} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-yellow-200 transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="p-2.5 bg-yellow-50 rounded-xl text-yellow-600 w-fit group-hover:bg-yellow-500 group-hover:text-white transition-colors">
              <Users size={22} strokeWidth={2.5} />
            </div>
            <p className="text-4xl font-heading font-black text-slate-900 tracking-tight">{stats.totalCandidates}</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Candidatures</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStats;
