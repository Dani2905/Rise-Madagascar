import React from 'react';
import { Send, Rocket } from 'lucide-react';

interface Props { applications?: unknown; projects?: unknown; }
const ProfileStats: React.FC<Props> = ({ applications, projects }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    {[{ label: 'Candidatures', count: Array.isArray(applications) ? applications.length : 0, Icon: Send }, { label: 'Projets publiés', count: Array.isArray(projects) ? projects.length : 0, Icon: Rocket }].map(({ label, count, Icon }) => (
      <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center"><Icon size={24} /></div>
        <div><p className="text-xs font-bold text-gray-500 uppercase">{label}</p><p className="text-2xl font-heading font-bold text-slate-900">{count}</p></div>
      </div>
    ))}
  </div>
);
export default ProfileStats;
