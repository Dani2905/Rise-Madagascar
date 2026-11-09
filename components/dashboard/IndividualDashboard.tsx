
import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Megaphone, Users, Settings, LogOut, Plus, Search, MoreVertical, Filter, Download, Edit, Trash2, Eye, MessageSquare, ArrowLeft, X, CheckCircle, XCircle, ClipboardList, Clock, HelpCircle, Star, Medal, TrendingUp, Lightbulb, ExternalLink, Camera } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { canPerformAction } from '../../utils/subscription';
import { useMessaging } from '../../context/MessagingContext';
import CompanyPostJobTab from './company/CompanyPostJobTab';
import IndividualSettings from './IndividualSettings';
import InternshipTracker from './InternshipTracker';
import ReviewModal from './ReviewModal';
import { Review, ProjectSupport } from '../../types';

const IndividualDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, user, updateUser } = useAuth();
  const { openSubscription } = useSubscription();
  const { sendMessage } = useMessaging();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'ads' | 'candidates' | 'mentoring' | 'supports' | 'settings' | 'post-job'>('dashboard');
  const [editingAd, setEditingAd] = useState<any>(null);
  const [selectedAdFilter, setSelectedAdFilter] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [candidateToReview, setCandidateToReview] = useState<any>(null);

  const [activeJobsList, setActiveJobsList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [mySupports, setMySupports] = useState<ProjectSupport[]>([]); // New State for supports
  const [stats, setStats] = useState({ activeJobs: 0, totalCandidates: 0, totalInvestments: 0 });

  // -- UPLOAD REF --
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (!user) return;

      // 1. Load Ads (rise_jobs)
      const allJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      const myAds = allJobs.filter((j: any) => 
          (j.ownerId && user?.id && j.ownerId.toString() === user.id.toString()) ||
          j.company === `${user?.firstName} ${user?.lastName}` || 
          j.company === user?.companyName
      );
      setActiveJobsList(myAds);

      // 2. Load Responses (rise_applications)
      const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      const myAdIds = myAds.map((j: any) => j.id.toString());
      const myResponses = allApps.filter((app: any) => myAdIds.includes(app.jobId.toString()));
      setCandidatesList(myResponses);

      // 3. Load Project Supports (Investments)
      const allSupports = JSON.parse(localStorage.getItem('rise_project_supports') || '[]');
      const supports = allSupports.filter((s: ProjectSupport) => s.supporterId.toString() === user.id.toString());
      setMySupports(supports);

      setStats({
          activeJobs: myAds.length,
          totalCandidates: myResponses.length,
          totalInvestments: supports.length
      });
  }, [user, activeTab]);

  useEffect(() => {
      const tabParam = searchParams.get('tab');
      if (tabParam && ['dashboard', 'ads', 'candidates', 'mentoring', 'supports', 'settings', 'post-job'].includes(tabParam)) {
          setActiveTab(tabParam as any);
      }
  }, [searchParams]);

  const changeTab = (tab: any) => {
      setActiveTab(tab);
      if (tab !== 'candidates') setSelectedAdFilter(null);
      navigate(`/dashboard?tab=${tab}`);
  };

  const handleCreateAd = () => {
      setEditingAd(null);
      changeTab('post-job');
  };

  const handleSaveAd = (adData: any) => {
      // Contrôle au moment de l'enregistrement, même en cas d'expiration pendant la saisie.
      if (!canPerformAction(user, 'publishOffer')) {
          if (window.Toastify) window.Toastify({ text: 'Un abonnement actif est nécessaire pour publier cette annonce.', style: { background: '#ef4444' } }).showToast();
          openSubscription();
          return;
      }

      const allJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      const userName = `${user?.firstName} ${user?.lastName}`;

      if (editingAd) {
          const updatedAd = { ...editingAd, ...adData };
          const updatedAll = allJobs.map((j: any) => j.id === editingAd.id ? updatedAd : j);
          localStorage.setItem('rise_jobs', JSON.stringify(updatedAll));
          setActiveJobsList(prev => prev.map(j => j.id === editingAd.id ? updatedAd : j));
          window.Toastify({ text: "Annonce mise à jour !", style: { background: "#10B981" } }).showToast();
      } else {
          const newAd = {
              id: Date.now().toString(),
              ...adData,
              createdAt: new Date().toISOString(),
              company: userName,
              ownerId: user?.id,
              logoUrl: user?.avatarUrl,
              candidates: 0,
              postedAt: "À l'instant",
              status: 'Actif'
          };
          localStorage.setItem('rise_jobs', JSON.stringify([newAd, ...allJobs]));
          setActiveJobsList(prev => [newAd, ...prev]);
          setStats(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
          window.Toastify({ text: "Annonce publiée !", style: { background: "#10B981" } }).showToast();
          changeTab('ads');
      }
      setEditingAd(null);
  };

  const handleDeleteAd = (id: number) => {
      if(window.confirm("Supprimer cette annonce ?")) {
          const allJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
          const filtered = allJobs.filter((j: any) => j.id !== id);
          localStorage.setItem('rise_jobs', JSON.stringify(filtered));
          setActiveJobsList(prev => prev.filter(j => j.id !== id));
          setStats(prev => ({ ...prev, activeJobs: Math.max(0, prev.activeJobs - 1) }));
          window.Toastify({ text: "Supprimé", style: { background: "#64748b" } }).showToast();
      }
      setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCandidateStatus = (candidateId: number, status: string) => {
      setCandidatesList(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
      const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      const updatedApps = allApps.map((app: any) => app.id === candidateId ? { ...app, status } : app);
      localStorage.setItem('rise_applications', JSON.stringify(updatedApps));
  };

  const handleContactCandidate = (candidate: any) => {
      const targetId = candidate.applicantId;
      if (targetId) {
          updateCandidateStatus(candidate.id, 'interview');
          navigate(`/messages?partner=${targetId}`);
      } else {
          window.Toastify({ text: "Erreur: Profil étudiant introuvable.", style: { background: "#ef4444" } }).showToast();
      }
  };

  const handleValidation = (candidateId: number, accepted: boolean) => {
      const status = accepted ? 'accepted' : 'rejected';
      updateCandidateStatus(candidateId, status);
      window.Toastify({ 
          text: accepted ? "Mission validée !" : "Candidature refusée.", 
          style: { background: accepted ? "#10B981" : "#64748b" } 
      }).showToast();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              if (window.Toastify) window.Toastify({ text: "Image trop lourde (Max 2MB)", style: { background: "#ef4444" } }).showToast();
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              updateUser({ avatarUrl: reader.result as string });
              if (window.Toastify) window.Toastify({ text: "Photo de profil mise à jour !", style: { background: "#10B981" } }).showToast();
          };
          reader.readAsDataURL(file);
      }
  };

  // --- REVIEW LOGIC ---
  const handleOpenReview = (candidate: any) => {
      setCandidateToReview(candidate);
      setIsReviewModalOpen(true);
  };

  const handleSaveReview = (rating: number, comment: string) => {
      if (!candidateToReview || !user) return;

      const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
      const studentIndex = dbUsers.findIndex((u: any) => 
          u.id.toString() === candidateToReview.applicantId?.toString() || 
          u.email === candidateToReview.email
      );

      if (studentIndex !== -1) {
          const student = dbUsers[studentIndex];
          const newReview: Review = {
              id: Date.now().toString(),
              reviewerName: `${user.firstName} ${user.lastName}`,
              reviewerId: user.id,
              rating,
              comment,
              date: new Date().toLocaleDateString('fr-FR'),
              jobTitle: candidateToReview.jobTitle
          };

          const currentReviews = student.reviews || [];
          const updatedReviews = [...currentReviews, newReview];
          const totalRating = updatedReviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
          const newAverage = (totalRating / updatedReviews.length).toFixed(1);

          dbUsers[studentIndex] = {
              ...student,
              reviews: updatedReviews,
              rating: parseFloat(newAverage),
              reviewCount: updatedReviews.length
          };
          localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
      }

      updateCandidateStatus(candidateToReview.id, 'completed');

      window.Toastify({ 
          text: "Avis publié ! Le profil de l'étudiant a été mis à jour.", 
          style: { background: "linear-gradient(to right, #fbbf24, #d97706)" } 
      }).showToast();
  };

  const displayedCandidates = selectedAdFilter 
    ? candidatesList.filter(c => c.jobId.toString() === selectedAdFilter.toString())
    : candidatesList;

  const selectedAdTitle = selectedAdFilter
    ? activeJobsList.find((j) => j.id.toString() === selectedAdFilter.toString())?.title || 'Annonce'
    : '';

  if (!user) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-6 flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
            </Link>
            <Link to={`/companies/${user.id}`} className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-green-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                Voir mon profil public <ExternalLink size={16} className="ml-2" />
            </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                <div 
                    className="w-16 h-16 rounded-xl border border-gray-200 p-1 bg-white shadow-sm relative group cursor-pointer overflow-hidden shrink-0"
                    onClick={() => avatarInputRef.current?.click()}
                >
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm rounded-lg">
                        <Camera className="text-white drop-shadow-md" size={20} />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">Espace Particulier</h1>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 border border-green-200 rounded text-xs font-bold uppercase">
                            {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-gray-500">{user.location || 'Antananarivo'}</span>
                    </div>
                </div>
            </div>
            <button onClick={handleCreateAd} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20 transform hover:-translate-y-0.5">
                <Plus size={18} /> Nouvelle Annonce
            </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div onClick={() => changeTab('ads')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-green-200 transition-all group">
                <div className="flex justify-between items-start">
                    <div><p className="text-xs text-gray-500 font-bold uppercase mb-1">Mes Annonces</p><p className="text-3xl font-heading font-bold text-slate-900">{stats.activeJobs}</p></div>
                    <div className="p-3 bg-green-50 rounded-xl text-green-600"><Megaphone size={20} /></div>
                </div>
            </div>
            <div onClick={() => changeTab('candidates')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-green-200 transition-all group">
                <div className="flex justify-between items-start">
                    <div><p className="text-xs text-gray-500 font-bold uppercase mb-1">Réponses</p><p className="text-3xl font-heading font-bold text-slate-900">{stats.totalCandidates}</p></div>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Users size={20} /></div>
                </div>
            </div>
            <div onClick={() => changeTab('supports')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-green-200 transition-all group">
                <div className="flex justify-between items-start">
                    <div><p className="text-xs text-gray-500 font-bold uppercase mb-1">Investissements</p><p className="text-3xl font-heading font-bold text-slate-900">{stats.totalInvestments}</p></div>
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><TrendingUp size={20} /></div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-2">
                        {['dashboard', 'ads', 'candidates', 'supports', 'mentoring', 'settings'].map(tab => (
                            <button key={tab} onClick={() => changeTab(tab)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-green-50 text-green-800' : 'text-gray-500 hover:bg-gray-50'}`}>
                                {tab === 'dashboard' && <LayoutDashboard size={18} />}
                                {tab === 'ads' && <Megaphone size={18} />}
                                {tab === 'candidates' && <Users size={18} />}
                                {tab === 'supports' && <TrendingUp size={18} />}
                                {tab === 'mentoring' && <ClipboardList size={18} />}
                                {tab === 'settings' && <Settings size={18} />}
                                {tab === 'dashboard' ? "Vue d'ensemble" : tab === 'ads' ? "Mes Annonces" : tab === 'candidates' ? "Réponses" : tab === 'supports' ? "Investissements" : tab === 'mentoring' ? "Suivi" : "Paramètres"}
                            </button>
                        ))}
                    </nav>
                    <div className="border-t border-gray-100 p-2 mt-2">
                        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50"><LogOut size={18} /> Déconnexion</button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-9">
                
                {/* --- DASHBOARD OVERVIEW --- */}
                {activeTab === 'dashboard' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-900">Activité Récente</h3>
                            <button onClick={() => changeTab('ads')} className="text-sm font-bold text-green-600 hover:underline">Voir tout</button>
                        </div>
                        {activeJobsList.length > 0 ? (
                            <div className="space-y-4">
                                {activeJobsList.slice(0, 3).map(ad => (
                                    <div key={ad.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{ad.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{ad.postedAt || 'Récemment'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-green-600 text-lg">{ad.candidates || 0}</span>
                                            <span className="text-xs text-gray-500">réponses</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 italic mb-4">Vous n'avez pas encore publié d'annonce.</p>
                                <button onClick={handleCreateAd} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Créer ma première annonce</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- MES ANNONCES --- */}
                {activeTab === 'ads' && (
                    <div className="space-y-6">
                        {activeJobsList.length > 0 ? activeJobsList.map(ad => (
                            <div key={ad.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{ad.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{ad.type}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{ad.postedAt}</span>
                                    </div>
                                    {ad.candidates > 0 && (
                                        <div className="mt-3 flex items-center gap-2 text-green-700 font-bold text-sm bg-green-50 w-fit px-3 py-1 rounded-full">
                                            <Users size={14} /> {ad.candidates} candidat(s)
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingAd(ad); changeTab('post-job'); }} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Modifier</button>
                                    <button onClick={() => { setSelectedAdFilter(ad.id.toString()); changeTab('candidates'); }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">Voir les candidats</button>
                                    <button onClick={() => handleDeleteAd(ad.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Megaphone size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">Aucune annonce active.</p>
                                <button onClick={handleCreateAd} className="mt-4 text-green-600 font-bold hover:underline">Publier maintenant</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- REPONSES / CANDIDATS --- */}
                {activeTab === 'candidates' && (
                    <div className="space-y-6">
                        {selectedAdFilter && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-green-800">
                                    <Filter size={18} />
                                    <span className="font-bold">Filtre activé : </span>
                                    <span>{selectedAdTitle}</span>
                                </div>
                                <button onClick={() => setSelectedAdFilter(null)} className="p-1 hover:bg-white rounded-full text-green-700 transition-colors"><X size={18}/></button>
                            </div>
                        )}
                        
                        {displayedCandidates.length > 0 ? (
                            displayedCandidates.map(c => (
                            <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                                {c.status === 'accepted' && <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 rotate-45 translate-x-8 -translate-y-8"></div>}
                                {c.status === 'completed' && <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 rotate-45 translate-x-8 -translate-y-8"></div>}
                                
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 shrink-0 border border-gray-200">
                                        <img src={c.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900">{c.name}</h4>
                                        <p className="text-sm text-gray-500 mb-1">{c.role || 'Étudiant'}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{c.school}</span>
                                            <span>•</span>
                                            <span>{c.location}</span>
                                        </div>
                                        
                                        {/* Status Badge */}
                                        <div className="mt-3">
                                            {c.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold"><Clock size={12}/> En attente</span>}
                                            {c.status === 'interview' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold"><MessageSquare size={12}/> Contacté</span>}
                                            {c.status === 'accepted' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold"><CheckCircle size={12}/> En cours</span>}
                                            {c.status === 'completed' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-bold"><Medal size={12}/> Mission Terminée</span>}
                                            {c.status === 'rejected' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold"><XCircle size={12}/> Refusé</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                                    <button 
                                        onClick={() => navigate(`/candidates/${c.id}`)}
                                        className="w-full py-2 px-3 border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye size={14} /> Voir Profil
                                    </button>
                                    
                                    {/* Action Buttons based on status */}
                                    {c.status === 'accepted' && (
                                        <button 
                                            onClick={() => handleOpenReview(c)}
                                            className="w-full py-2 px-3 bg-yellow-500 text-white rounded-lg text-xs font-bold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-sm animate-pulse-slow"
                                        >
                                            <Star size={14} className="fill-white" /> Terminer & Noter
                                        </button>
                                    )}

                                    {c.status !== 'accepted' && c.status !== 'completed' && c.status !== 'rejected' && (
                                        <>
                                            <button 
                                                onClick={() => handleContactCandidate(c)}
                                                className="w-full py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <MessageSquare size={14} /> Discuter
                                            </button>
                                            
                                            {c.status === 'interview' && (
                                                <div className="flex gap-2 mt-1">
                                                    <button onClick={() => handleValidation(c.id, true)} className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Valider la mission"><CheckCircle size={16} className="mx-auto" /></button>
                                                    <button onClick={() => handleValidation(c.id, false)} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" title="Refuser"><XCircle size={16} className="mx-auto" /></button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {c.status === 'completed' && (
                                        <div className="text-center text-[10px] text-green-600 font-bold bg-green-50 py-1 rounded">
                                            Avis publié
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Users size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">Aucune réponse pour le moment.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- NOUVEL ONGLET : INVESTISSEMENTS / SOUTIENS --- */}
                {activeTab === 'supports' && (
                    <div className="space-y-6">
                        {mySupports.length > 0 ? (
                            mySupports.map(support => (
                                <div key={support.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                                        support.type === 'financing' ? 'bg-green-100 text-green-600' :
                                        support.type === 'mentoring' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {support.type === 'financing' && <TrendingUp size={24} />}
                                        {support.type === 'mentoring' && <Lightbulb size={24} />}
                                        {support.type === 'partnership' && <Medal size={24} />}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg cursor-pointer hover:underline" onClick={() => navigate(`/projects/${support.projectId}`)}>
                                                    Projet : {support.projectTitle}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Proposé le {support.date}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                support.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                                                support.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {support.status === 'pending' ? 'En attente' : support.status === 'accepted' ? 'Accepté' : 'Refusé'}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100 mb-3">
                                            "{support.message}"
                                        </div>

                                        {support.type === 'financing' && support.amount && (
                                            <div className="inline-flex items-center gap-2 text-green-700 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">
                                                <span>Montant proposé :</span> {support.amount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <TrendingUp size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500 mb-4">Vous n'avez pas encore soutenu de projet.</p>
                                <button onClick={() => navigate('/resources')} className="text-primary font-bold hover:underline">
                                    Explorer l'incubateur
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'mentoring' && <InternshipTracker candidates={candidatesList} jobs={activeJobsList} onUpdate={() => {}} />}
                {activeTab === 'settings' && <IndividualSettings data={user} onUpdate={(u) => updateUser(u)} />}
                {activeTab === 'post-job' && (
                    <CompanyPostJobTab onSave={handleSaveAd} onCancel={() => changeTab('ads')} initialData={editingAd} />
                )}
            </div>
        </div>

        {/* Review Modal for Individual */}
        <ReviewModal 
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            candidateName={candidateToReview?.name || 'l\'étudiant'}
            jobTitle={candidateToReview?.jobTitle || 'la mission'}
            onSave={handleSaveReview}
        />
    </div>
  );
};

export default IndividualDashboard;
