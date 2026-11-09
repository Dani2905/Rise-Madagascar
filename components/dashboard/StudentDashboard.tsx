import React, { useState, useEffect } from 'react';
import { User, FileText, Settings, LogOut, Rocket } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileHeader from '../profile/ProfileHeader';
import ProfileStats from '../profile/ProfileStats';
import ProfileOverview from '../profile/ProfileOverview';
import ProfileApplications from '../profile/ProfileApplications';
import ProfileProjects from '../profile/ProfileProjects';
import ProfileSettings from '../profile/ProfileSettings';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'projects' | 'settings'>('overview');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const action = searchParams.get('action'); // Capture l'action 'new' si présente

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'applications', 'projects', 'settings'].includes(tab)) {
        setActiveTab(tab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'overview' | 'applications' | 'projects' | 'settings') => {
      setActiveTab(tab);
      // Clean URL params when switching tabs manually
      navigate(`/profile?tab=${tab}`); 
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Header Section */}
        <ProfileHeader profile={user} />

        {/* Stats Row */}
        <ProfileStats stats={user.stats} />

        {/* MOBILE NAVIGATION (Horizontal Scroll) */}
        <div className="lg:hidden sticky top-[64px] z-30 bg-gray-50/95 backdrop-blur-sm pt-2 pb-4 -mx-4 px-4 mb-4 overflow-x-auto scrollbar-hide border-b border-gray-200/50">
            <div className="flex gap-2 min-w-max">
                <button
                    onClick={() => handleTabChange('overview')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeTab === 'overview' 
                        ? 'bg-primary text-slate-900 border-primary shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                    <User size={16} /> Mon Profil
                </button>
                <button
                    onClick={() => handleTabChange('applications')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeTab === 'applications' 
                        ? 'bg-primary text-slate-900 border-primary shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                    <FileText size={16} /> Candidatures
                </button>
                <button
                    onClick={() => handleTabChange('projects')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeTab === 'projects' 
                        ? 'bg-primary text-slate-900 border-primary shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                    <Rocket size={16} /> Projets
                </button>
                <button
                    onClick={() => handleTabChange('settings')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeTab === 'settings' 
                        ? 'bg-primary text-slate-900 border-primary shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                    <Settings size={16} /> Paramètres
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* DESKTOP SIDEBAR NAVIGATION */}
            <div className="hidden lg:block lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-2">
                        <button
                            onClick={() => handleTabChange('overview')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'overview' 
                                ? 'bg-primary text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                            }`}
                        >
                            <User size={18} /> Mon Profil
                        </button>
                        <button
                            onClick={() => handleTabChange('applications')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'applications' 
                                ? 'bg-primary text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                            }`}
                        >
                            <FileText size={18} /> Candidatures
                        </button>
                        <button
                            onClick={() => handleTabChange('projects')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'projects' 
                                ? 'bg-primary text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                            }`}
                        >
                            <Rocket size={18} /> Mes Projets
                        </button>
                        <button
                            onClick={() => handleTabChange('settings')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'settings' 
                                ? 'bg-primary text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                            }`}
                        >
                            <Settings size={18} /> Paramètres
                        </button>
                    </nav>
                    <div className="border-t border-gray-100 p-2 mt-2">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                        >
                            <LogOut size={18} /> Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
                {activeTab === 'overview' && <ProfileOverview profile={user} />}
                {activeTab === 'applications' && <ProfileApplications applications={user.applications} />}
                {activeTab === 'projects' && <ProfileProjects projects={user.myProjects} initialCreateMode={action === 'new'} />}
                {activeTab === 'settings' && <ProfileSettings />}
            </div>

            {/* Mobile Logout Button (Bottom of page) */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
                >
                    <LogOut size={18} /> Se déconnecter
                </button>
            </div>

        </div>
      </div>
  );
};

export default StudentDashboard;