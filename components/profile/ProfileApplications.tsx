
import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, ArrowRight, FileText, Eye, Trash2, Calendar, Building2, Search, Briefcase, Zap, Clock, CheckCircle, XCircle, AlertCircle, Star, Quote, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProfileApplicationsProps {
    applications?: any[];
}

const ProfileApplications: React.FC<ProfileApplicationsProps> = ({ applications = [] }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [syncedApplications, setSyncedApplications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE DE SYNCHRONISATION (STATUS SYNC) ---
  useEffect(() => {
      if (!user) return;

      const globalApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      
      const updatedList = applications.map(localApp => {
          const remoteApp = globalApps.find((ga: any) => 
              (ga.id && localApp.id && ga.id.toString() === localApp.id.toString()) || 
              (ga.jobId === localApp.jobId && ga.applicantId === user.id)
          );

          if (remoteApp) {
              let statusText = 'En attente';
              let statusColor = 'text-blue-600 bg-blue-50 border-blue-100';
              let Icon = Clock;

              switch (remoteApp.status) {
                  case 'accepted':
                      statusText = 'Accepté';
                      statusColor = 'text-green-700 bg-green-50 border-green-200';
                      Icon = CheckCircle;
                      break;
                  case 'rejected':
                      statusText = 'Refusé';
                      statusColor = 'text-red-700 bg-red-50 border-red-200';
                      Icon = XCircle;
                      break;
                  case 'interview':
                      statusText = 'Entretien';
                      statusColor = 'text-purple-700 bg-purple-50 border-purple-200';
                      Icon = Calendar;
                      break;
                  case 'pending':
                  default:
                      statusText = 'En cours';
                      statusColor = 'text-blue-600 bg-blue-50 border-blue-100';
                      Icon = Clock;
                      break;
              }

              return { 
                  ...localApp, 
                  status: statusText, 
                  statusColor: statusColor,
                  StatusIcon: Icon,
                  tracking: remoteApp.tracking // On récupère les données de suivi/mentorat
              };
          }
          return { ...localApp, StatusIcon: Clock };
      });

      setSyncedApplications(updatedList.reverse());
  }, [applications, user]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (id: number) => {
      if(window.confirm("Retirer cette candidature ?")) {
          // 1. Mise à jour Locale (User Profile)
          const updatedApps = applications.filter(app => app.id !== id);
          updateUser({ applications: updatedApps });

          // 2. Mise à jour Globale (Database) - Important pour la cohérence
          const globalApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
          const filteredGlobalApps = globalApps.filter((app: any) => app.id !== id);
          localStorage.setItem('rise_applications', JSON.stringify(filteredGlobalApps));

          window.Toastify({ text: "Archivé", style: { background: "#64748b" } }).showToast();
      }
      setOpenMenuId(null);
  };

  const handleViewJob = (id: string | number) => {
      navigate(`/jobs/${id}`);
      setOpenMenuId(null);
  };

  const getContractBadgeStyle = (type: string) => {
    if (!type) return 'bg-gray-100 text-gray-600 border-gray-200';
    switch (type.toLowerCase()) {
        case 'stage': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'alternance': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'cdd': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'freelance': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (!syncedApplications || syncedApplications.length === 0) {
      return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-400">
                  <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune candidature</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">Votre historique est vide.</p>
              <button onClick={() => navigate('/search')} className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg text-sm">
                  Voir les offres
              </button>
          </div>
      );
  }

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Briefcase className="text-primary" size={20} /> Suivi des candidatures
                </h3>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{syncedApplications.length}</span>
            </div>
            
            {/* --- LISTE DES CANDIDATURES (MIXTE MOBILE/DESKTOP) --- */}
            <div className="divide-y divide-gray-50">
                {syncedApplications.map((app) => (
                    <div key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                        
                        {/* Main Row */}
                        <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center relative">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                                            {app.company.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm md:text-base cursor-pointer hover:text-primary transition-colors line-clamp-1" onClick={() => handleViewJob(app.jobId || app.id)}>
                                                {app.jobTitle}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Building2 size={12} /> {app.company}
                                                <span className={`px-2 py-0.5 rounded border ${getContractBadgeStyle(app.contractType)}`}>
                                                    {app.contractType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile Menu Trigger */}
                                    <button onClick={(e) => handleToggleMenu(app.id, e)} className="md:hidden text-gray-400 p-1">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1"><Calendar size={12}/> {app.date}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${app.statusColor} whitespace-nowrap`}>
                                    {app.StatusIcon && <app.StatusIcon size={14} />}
                                    {app.status}
                                </span>
                                <div className="hidden md:flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleViewJob(app.jobId || app.id)} className="p-2 text-gray-400 hover:text-slate-900 rounded-lg hover:bg-white" title="Voir">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white" title="Archiver">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Context Menu */}
                            {openMenuId === app.id && (
                                <div ref={menuRef} className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-fade-in md:hidden">
                                    <button onClick={() => handleViewJob(app.jobId || app.id)} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2 font-medium rounded-t-xl">
                                        <Eye size={16} /> Voir l'offre
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium rounded-b-xl border-t border-gray-50">
                                        <Trash2 size={16} /> Archiver
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* --- TRACKING REPORT CARD (If Recruiter Added Feedback) --- */}
                        {app.tracking && app.tracking.evaluation > 0 && (
                            <div className="px-5 pb-5 md:px-6 md:pb-6 animate-fade-in">
                                <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    
                                    <div className="flex flex-col items-center justify-center min-w-[120px] border-b md:border-b-0 md:border-r border-yellow-200 pb-4 md:pb-0 md:pr-6">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[1,2,3,4,5].map(star => (
                                                <Star key={star} size={16} className={`${star <= app.tracking.evaluation ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Bilan de stage</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {app.tracking.startDate && new Date(app.tracking.startDate).toLocaleDateString()} - {app.tracking.endDate && new Date(app.tracking.endDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex-1 relative">
                                        <Quote size={20} className="text-yellow-300 absolute -top-2 -left-2 fill-current opacity-50" />
                                        <p className="text-sm text-gray-700 italic leading-relaxed pl-4">
                                            "{app.tracking.feedback}"
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 pl-4">
                                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                                                {app.company.charAt(0)}
                                            </div>
                                            <p className="text-xs font-bold text-slate-900">Validé par le recruteur</p>
                                            <Award size={14} className="text-primary ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                <button onClick={() => navigate('/search')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center justify-center gap-2 w-full">
                    <Search size={16} /> Trouver d'autres opportunités
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProfileApplications;
