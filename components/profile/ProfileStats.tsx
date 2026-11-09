import React from 'react';
import { Eye, Send, Rocket, TrendingUp, Clock, Star } from 'lucide-react';

interface ProfileStatsProps {
    stats?: {
        views: number;
        viewsTrend?: string;
        applications: number;
        applicationsTrend?: string;
        projects: number;
        projectsTrend?: string;
    }
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const displayStats = stats || { views: 0, applications: 0, projects: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Vues du profil */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors group cursor-default">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Eye size={24} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Vues du profil</p>
                <p className="text-2xl font-heading font-bold text-slate-900">{displayStats.views}</p>
            </div>
            {displayStats.viewsTrend && (
                <div className="ml-auto flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    <TrendingUp size={12} className="mr-1" /> {displayStats.viewsTrend}
                </div>
            )}
        </div>

        {/* Candidatures */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-yellow-200 transition-colors group cursor-default">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Send size={24} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Candidatures</p>
                <p className="text-2xl font-heading font-bold text-slate-900">{displayStats.applications}</p>
            </div>
            {displayStats.applicationsTrend && (
                <div className="ml-auto flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                    <Clock size={12} className="mr-1" /> {displayStats.applicationsTrend}
                </div>
            )}
        </div>

        {/* Projets */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-colors group cursor-default">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Rocket size={24} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Projets Publiés</p>
                <p className="text-2xl font-heading font-bold text-slate-900">{displayStats.projects}</p>
            </div>
            {displayStats.projectsTrend && (
                <div className="ml-auto flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
                    <Star size={12} className="mr-1" /> {displayStats.projectsTrend}
                </div>
            )}
        </div>

    </div>
  );
};

export default ProfileStats;