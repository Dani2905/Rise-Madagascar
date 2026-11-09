
import React from 'react';

interface CompanyOverviewProps {
  activeJobsList: any[];
  changeTab: (tab: any) => void;
  setSelectedJobFilter: (id: string) => void;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ activeJobsList, changeTab, setSelectedJobFilter }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
        <div className="p-6 border-b border-gray-100/60 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-lg text-slate-900 tracking-tight">Offres Récentes</h3>
          <button className="text-sm text-yellow-600 font-bold hover:text-yellow-700 transition-colors" onClick={() => changeTab('jobs')}>Voir tout &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] uppercase tracking-widest text-gray-400 font-extrabold">
              <tr>
                <th className="px-6 py-5 border-b border-gray-100/60">Titre de l'offre</th>
                <th className="px-6 py-5 border-b border-gray-100/60">Candidats</th>
                <th className="px-6 py-5 border-b border-gray-100/60">Statut</th>
                <th className="px-6 py-5 border-b border-gray-100/60"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {activeJobsList.length > 0 ? activeJobsList.slice(0, 5).map(job => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-800">{job.title}</td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        {job.candidates || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-[11px] font-extrabold uppercase tracking-wide">
                          {job.status}
                      </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                        onClick={() => { setSelectedJobFilter(job.id.toString()); changeTab('candidates'); }} 
                        className="text-[13px] px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        Voir
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm font-medium">Aucune offre publiée pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
