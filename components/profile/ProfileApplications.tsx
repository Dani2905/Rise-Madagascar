
import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, ArrowRight, FileText, Eye, Trash2, Calendar, Building2, Search, Briefcase, Zap, Clock, CheckCircle, XCircle, AlertCircle, Star, Quote, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCivilDate, hasTrackingData, trackingDraft } from '../../utils/missionTracking';

interface ProfileApplicationsProps {
    applications?: any[];
}

const EMPTY_APPLICATIONS: any[] = [];
const ProfileApplications: React.FC<ProfileApplicationsProps> = ({ applications = EMPTY_APPLICATIONS }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [syncedApplications, setSyncedApplications] = useState<any[]>([]);
  const [storageError, setStorageError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Synchroniser les réponses recruteurs sans écraser les données locales illisibles.
  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      let globalApps: any[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('rise_applications') || '[]');
        if (!Array.isArray(parsed)) throw new Error();
        globalApps = parsed;
        setStorageError('');
      } catch { setStorageError('Les candidatures locales sont illisibles ; les statuts ne peuvent pas être synchronisés.'); }
      const own = (app: any) => app?.applicantId != null ? String(app.applicantId) === String(user.id) : Boolean(app?.email && user.email && app.email.toLowerCase() === user.email.toLowerCase());
      const source = Array.isArray(applications) ? applications.filter(app => app && typeof app === 'object') : [];
      const updated = source.map(localApp => {
        const remote = globalApps.find((app: any) => own(app) && (localApp.id != null ? app.id != null && String(app.id) === String(localApp.id) : app.jobId != null && localApp.jobId != null && String(app.jobId) === String(localApp.jobId)));
        const status = remote?.status || localApp.status;
        const statuses: Record<string, { text: string; color: string; Icon: any }> = {
          accepted: { text: 'Acceptée', color: 'text-green-700 bg-green-50 border-green-200', Icon: CheckCircle },
          rejected: { text: 'Refusée', color: 'text-red-700 bg-red-50 border-red-200', Icon: XCircle },
          interview: { text: 'Entretien', color: 'text-purple-700 bg-purple-50 border-purple-200', Icon: Calendar },
          completed: { text: 'Terminée', color: 'text-amber-700 bg-amber-50 border-amber-200', Icon: CheckCircle },
          pending: { text: 'En cours', color: 'text-blue-600 bg-blue-50 border-blue-100', Icon: Clock }
        };
        const info = statuses[status];
        return { ...localApp, company: typeof localApp.company === 'string' && localApp.company ? localApp.company : 'Recruteur', jobTitle: localApp.jobTitle || 'Offre', status: info?.text || status || 'En cours', statusColor: info?.color || localApp.statusColor || 'text-blue-600 bg-blue-50 border-blue-100', StatusIcon: info?.Icon || Clock, tracking: remote?.tracking || localApp.tracking };
      });
      updated.sort((a, b) => (Date.parse(b.appliedAt) || 0) - (Date.parse(a.appliedAt) || 0));
      setSyncedApplications(updated);
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
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
      if (!user || !window.confirm('Retirer définitivement cette candidature dans ce navigateur ? Elle sera également retirée de la liste du recruteur.')) return;
      const raw = localStorage.getItem('rise_applications');
      const jobsRaw = localStorage.getItem('rise_jobs');
      try {
          const globalApps = JSON.parse(raw || '[]');
          const jobs = JSON.parse(jobsRaw || '[]');
          if (!Array.isArray(globalApps) || !Array.isArray(jobs)) throw new Error();
          const own = (app: any) => app?.applicantId != null ? String(app.applicantId) === String(user.id) : Boolean(app?.email && user.email && app.email.toLowerCase() === user.email.toLowerCase());
          const removed = globalApps.filter((app: any) => own(app) && app?.id != null && String(app.id) === String(id));
          const filtered = globalApps.filter((app: any) => !removed.includes(app));
          const affectedJobs = new Set(removed.filter((app: any) => app.jobId != null).map((app: any) => String(app.jobId)));
          const updatedJobs = jobs.map((job: any) => job?.id != null && affectedJobs.has(String(job.id)) ? { ...job, candidates: filtered.filter((app: any) => app?.jobId != null && String(app.jobId) === String(job.id)).length } : job);
          try {
              localStorage.setItem('rise_applications', JSON.stringify(filtered));
              if (jobsRaw !== null && affectedJobs.size) localStorage.setItem('rise_jobs', JSON.stringify(updatedJobs));
              updateUser({ applications: applications.filter(app => String(app.id) !== String(id)) });
          } catch (error) {
              try { if (raw === null) localStorage.removeItem('rise_applications'); else localStorage.setItem('rise_applications', raw); if (jobsRaw === null) localStorage.removeItem('rise_jobs'); else localStorage.setItem('rise_jobs', jobsRaw); } catch { /* stockage indisponible */ }
              throw error;
          }
          setStorageError('');
      } catch { setStorageError('Impossible de retirer la candidature sans risque de modifier des données illisibles.'); }
      setOpenMenuId(null);
  };

  const handleViewJob = (id: string | number) => {
      navigate(`/jobs/${id}`);
      setOpenMenuId(null);
  };

  const getContractBadgeStyle = (type: string) => {
    if (typeof type !== 'string' || !type) return 'bg-gray-100 text-gray-600 border-gray-200';
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
              {storageError && <p role="alert" className="text-sm text-red-700 mb-3">{storageError}</p>}
              <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">Votre historique est vide.</p>
              <button onClick={() => navigate('/search')} className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg text-sm">
                  Voir les offres
              </button>
          </div>
      );
  }

  return (
    <div className="space-y-6">
        {storageError && <p role="alert" className="text-sm text-red-700">{storageError}</p>}
        <p className="text-xs text-slate-500">Candidatures et réponses simulées dans ce navigateur.</p>
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
                                            <button type="button" className="font-bold text-left text-slate-900 text-sm md:text-base hover:text-yellow-700 transition-colors line-clamp-1" onClick={() => handleViewJob(app.jobId ?? app.id)}>
                                                {app.jobTitle}
                                            </button>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Building2 size={12} /> {app.company}
                                                <span className={`px-2 py-0.5 rounded border ${getContractBadgeStyle(app.contractType)}`}>
                                                    {app.contractType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile Menu Trigger */}
                                    <button type="button" aria-label={`Actions pour ${app.jobTitle}`} aria-expanded={openMenuId === app.id} onClick={(e) => handleToggleMenu(app.id, e)} className="md:hidden text-gray-400 p-1">
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
                                <div className="hidden md:flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                    <button onClick={() => handleViewJob(app.jobId ?? app.id)} className="p-2 text-gray-400 hover:text-slate-900 rounded-lg hover:bg-white" title="Voir">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white" title="Retirer la candidature">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Context Menu */}
                            {openMenuId === app.id && (
                                <div ref={menuRef} className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-fade-in md:hidden">
                                    <button onClick={() => handleViewJob(app.jobId ?? app.id)} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2 font-medium rounded-t-xl">
                                        <Eye size={16} /> Voir l'offre
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium rounded-b-xl border-t border-gray-50">
                                        <Trash2 size={16} /> Retirer la candidature
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bilan partagé par le recruteur, même sans note. */}
                        {hasTrackingData(app.tracking) && (() => {
                            const data = trackingDraft(app.tracking);
                            return <div className="px-5 pb-5 md:px-6 md:pb-6"><section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold text-slate-900">Suivi partagé par le recruteur</h4><span className="text-xs text-slate-500">Visible dans ce navigateur</span></div>
                                {(data.startDate || data.endDate) && <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Calendar size={15} /> {data.startDate ? formatCivilDate(data.startDate) : 'Début non renseigné'} — {data.endDate ? formatCivilDate(data.endDate) : 'Fin non renseignée'}</p>}
                                {data.evaluation > 0 && <div className="mt-3 flex items-center gap-2 text-sm text-slate-700"><span className="flex gap-1" aria-label={`Évaluation : ${data.evaluation} sur 5`}>{[1,2,3,4,5].map(star => <Star key={star} aria-hidden="true" size={16} className={star <= data.evaluation ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />)}</span><span className="font-bold">{data.evaluation}/5</span></div>}
                                {data.feedback && <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{data.feedback}</p>}
                                <p className="mt-3 text-xs text-slate-500">Suivi enregistré localement, sans notification réelle.</p>
                            </section></div>;
                        })()}

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
