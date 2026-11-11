
import React from 'react';
import { LayoutDashboard, Briefcase, Users, ClipboardList, Settings, LogOut } from 'lucide-react';

interface CompanySidebarProps {
  activeTab: string;
  changeTab: (tab: any) => void;
  onLogout: () => void;
}

const CompanySidebar: React.FC<CompanySidebarProps> = ({ activeTab, changeTab, onLogout }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 pb-2">
      <div className="px-6 py-4 border-b border-gray-100/60 mb-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Menu Principal</h3>
      </div>
      <nav className="flex flex-col px-3 gap-1">
        {['dashboard', 'jobs', 'candidates', 'mentoring', 'settings'].map((tab) => (
          <button
            key={tab} type="button" aria-current={activeTab === tab ? 'page' : undefined}
            onClick={() => changeTab(tab)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all capitalize group ${activeTab === tab ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'}`}
          >
            {tab === 'dashboard' && <LayoutDashboard size={18} className={activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'} />}
            {tab === 'jobs' && <Briefcase size={18} className={activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'} />}
            {tab === 'candidates' && <Users size={18} className={activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'} />}
            {tab === 'mentoring' && <ClipboardList size={18} className={activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'} />}
            {tab === 'settings' && <Settings size={18} className={activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'} />}
            {tab === 'dashboard' ? "Vue d'ensemble" : tab === 'jobs' ? "Mes Offres" : tab === 'candidates' ? "Candidatures" : tab === 'mentoring' ? "Suivi" : "Paramètres"}
          </button>
        ))}
      </nav>
      <div className="px-3 mt-4 pt-4 border-t border-gray-100/60">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
