
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ArrowLeft, ExternalLink, Camera } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';

// Modales
import CompanyPostJobTab from './company/CompanyPostJobTab';
import CompanySettings from './CompanySettings';
import InternshipTracker from './InternshipTracker';
import ReviewModal from './ReviewModal';

// Sous-Composants Factorisés
import CompanyStats from './company/CompanyStats';
import CompanySidebar from './company/CompanySidebar';
import CompanyOverview from './company/CompanyOverview';
import CompanyJobsTab from './company/CompanyJobsTab';
import CompanyCandidatesTab from './company/CompanyCandidatesTab';

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'candidates' | 'mentoring' | 'settings' | 'post-job'>('dashboard');
  const [editingJob, setEditingJob] = useState<any>(null);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string | null>(null);

  // Modal d'avis (Review)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [candidateToReview, setCandidateToReview] = useState<any>(null);
  
  // -- UPLOAD REFS --
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // -- STATE DYNAMIQUE --
  const [activeJobsList, setActiveJobsList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeJobs: 0, totalCandidates: 0, newMessages: 0 });

  // --- COEUR DU SYSTÈME : CHARGEMENT DES DONNÉES ---
  useEffect(() => {
      if (!user) return;

      // 1. Charger TOUTES les offres avec sécurité
      let allJobs = [];
      try {
          const jobsStr = localStorage.getItem('rise_jobs');
          allJobs = jobsStr ? JSON.parse(jobsStr) : [];
          if (!Array.isArray(allJobs)) allJobs = [];
      } catch (e) { console.error(e); allJobs = []; }
      
      // 2. FILTRAGE ROBUSTE : Trouver les offres appartenant à l'utilisateur connecté
      const myJobs = allJobs.filter((j: any) => {
          if (j.ownerId && user.id) return j.ownerId.toString() === user.id.toString();
          return j.company === user.companyName || j.company === `${user.firstName} ${user.lastName}`;
      });
      
      setActiveJobsList(myJobs);

      // 3. Charger TOUTES les candidatures avec sécurité
      let allApplications = [];
      try {
          const appsStr = localStorage.getItem('rise_applications');
          allApplications = appsStr ? JSON.parse(appsStr) : [];
          if (!Array.isArray(allApplications)) allApplications = [];
      } catch (e) { console.error(e); allApplications = []; }
      
      // 4. RECUPERER LES CANDIDATS pour MES offres
      const myJobIds = myJobs.map((j: any) => j.id.toString());
      const myCandidates = allApplications.filter((app: any) => 
          myJobIds.includes(app.jobId.toString())
      );
      
      setCandidatesList(myCandidates);

      // 5. Calculer les statistiques
      setStats({
          activeJobs: myJobs.filter((j: any) => j.status === 'Actif').length,
          totalCandidates: myCandidates.length,
          newMessages: 0 
      });

  }, [user, activeTab]);

  useEffect(() => {
      const tabParam = searchParams.get('tab');
      if (tabParam && ['dashboard', 'jobs', 'candidates', 'mentoring', 'settings', 'post-job'].includes(tabParam)) {
          setActiveTab(tabParam as any);
      }
  }, [searchParams]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) {
              if (window.Toastify) window.Toastify({ text: "Image trop lourde (Max 5MB)", style: { background: "#ef4444" } }).showToast();
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              updateUser({ coverUrl: reader.result as string });
              if (window.Toastify) window.Toastify({ text: "Couverture mise à jour !", style: { background: "#10B981" } }).showToast();
          };
          reader.readAsDataURL(file);
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              if (window.Toastify) window.Toastify({ text: "Image trop lourde (Max 2MB)", style: { background: "#ef4444" } }).showToast();
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              updateUser({ logoUrl: reader.result as string, avatarUrl: reader.result as string });
              if (window.Toastify) window.Toastify({ text: "Logo mis à jour !", style: { background: "#10B981" } }).showToast();
          };
          reader.readAsDataURL(file);
      }
  };

  const changeTab = (tab: any) => {
      setActiveTab(tab);
      if (tab !== 'candidates') setSelectedJobFilter(null);
      navigate(`/dashboard?tab=${tab}`);
  };

  const handleCreateJob = () => {
      setEditingJob(null);
      changeTab('post-job');
  };

  const handleSaveJob = (jobData: any) => {
      const allLocalJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      
      if (editingJob) {
          const updatedJob = { ...editingJob, ...jobData };
          const updatedAllJobs = allLocalJobs.map((j: any) => j.id === editingJob.id ? updatedJob : j);
          
          localStorage.setItem('rise_jobs', JSON.stringify(updatedAllJobs));
          setActiveJobsList(prev => prev.map(j => j.id === editingJob.id ? updatedJob : j));
          window.Toastify({ text: "Offre mise à jour !", style: { background: "#2563EB" } }).showToast();
      } else {
          const newJob = {
              id: Date.now().toString(),
              ...jobData,
              candidates: 0
          };
          localStorage.setItem('rise_jobs', JSON.stringify([newJob, ...allLocalJobs]));
          setActiveJobsList(prev => [newJob, ...prev]);
          setStats(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
          window.Toastify({ text: "Offre publiée !", style: { background: "#10B981" } }).showToast();
          changeTab('jobs');
      }
      setEditingJob(null);
  };

  const handleDeleteJob = (id: string | number) => {
      if(window.confirm("Supprimer cette offre ?")) {
          const allLocalJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
          const filteredJobs = allLocalJobs.filter((j: any) => j.id.toString() !== id.toString());
          localStorage.setItem('rise_jobs', JSON.stringify(filteredJobs));
          
          setActiveJobsList(prev => prev.filter(j => j.id.toString() !== id.toString()));
          setStats(prev => ({ ...prev, activeJobs: Math.max(0, prev.activeJobs - 1) }));
          window.Toastify({ text: "Offre supprimée", style: { background: "#64748b" } }).showToast();
      }
  };

  const handleCandidateDecision = (candidateId: number, status: 'rejected' | 'interview' | 'accepted' | 'pending') => {
      setCandidatesList(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));

      const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      const updatedApps = allApps.map((app: any) => {
          if (app.id === candidateId) {
              return { 
                  ...app, 
                  status: status,
                  updatedAt: new Date().toISOString()
              };
          }
          return app;
      });
      localStorage.setItem('rise_applications', JSON.stringify(updatedApps));

      const colors: any = { rejected: '#ef4444', interview: '#8b5cf6', accepted: '#10b981', pending: '#64748b' };
      const labels: any = { rejected: 'Refusé', interview: 'Entretien', accepted: 'Accepté', pending: 'En attente' };
      
      window.Toastify({ 
          text: `Candidat ${labels[status]}`, 
          style: { background: colors[status] } 
      }).showToast();
  };

  const handleTrackingUpdate = (candidateId: number, trackingData: any) => {
      setCandidatesList(prev => prev.map(c => c.id === candidateId ? { ...c, tracking: trackingData } : c));

      const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      const updatedApps = allApps.map((app: any) => {
          if (app.id === candidateId) {
              return { ...app, tracking: trackingData };
          }
          return app;
      });
      localStorage.setItem('rise_applications', JSON.stringify(updatedApps));
  };

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
              reviewerName: user.companyName || `${user.firstName} ${user.lastName}`,
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

      setCandidatesList(prev => prev.map(c => c.id === candidateToReview.id ? { ...c, status: 'completed' } : c));
      const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
      const updatedApps = allApps.map((app: any) => app.id === candidateToReview.id ? { ...app, status: 'completed' } : app);
      localStorage.setItem('rise_applications', JSON.stringify(updatedApps));

      window.Toastify({ 
          text: "Contrat clôturé et étudiant noté !", 
          style: { background: "linear-gradient(to right, #fbbf24, #d97706)" } 
      }).showToast();
  };

  const openCandidateModal = (candidate: any) => {
      navigate(`/candidates/${candidate.id}`);
  };

  const displayedCandidates = selectedJobFilter 
    ? candidatesList.filter(c => c.jobId.toString() === selectedJobFilter.toString())
    : candidatesList;

  if (!user) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Navigation Top */}
        <div className="mb-6 flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-yellow-600 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
            </Link>
            <Link to={`/companies/${user.id}`} className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                Voir ma page publique <ExternalLink size={16} className="ml-2" />
            </Link>
        </div>

        {/* Dynamic Header with Cover & Profile */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="h-48 md:h-64 bg-slate-900 relative group">
                 {/* Hidden inputs */}
                 <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                 <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />

                 {user.coverUrl ? (
                     <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                 ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    </div>
                 )}
                 <div className="absolute top-4 right-4 md:opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => coverInputRef.current?.click()} className="px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-2">
                        <Camera size={16} /> Modifier la couverture
                     </button>
                 </div>
            </div>
            
            <div className="px-6 md:px-10 pb-6 relative text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 flex-1">
                        <div 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden relative z-10 shrink-0 group/logo cursor-pointer"
                            onClick={() => logoInputRef.current?.click()}
                        >
                            <img src={user.logoUrl || user.avatarUrl || 'https://via.placeholder.com/150'} alt="Logo" className="w-full h-full object-cover group-hover/logo:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                                <Camera className="text-white drop-shadow-md" size={32} />
                            </div>
                        </div>
                        <div className="pb-2 md:pb-4 w-full">
                            <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 tracking-tight mb-2">
                                {user.companyName || `${user.firstName} ${user.lastName}`}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-extrabold uppercase tracking-widest">
                                    {user.role === 'company' ? 'Entreprise' : 'Recruteur'}
                                </span>
                                <span className="text-sm font-medium text-gray-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    {user.location || 'Madagascar'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleCreateJob} className="mb-2 md:mb-4 w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 shrink-0">
                        <Plus size={20} /> Publier une offre
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Section */}
        <CompanyStats stats={stats} changeTab={changeTab} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
                <CompanySidebar activeTab={activeTab} changeTab={changeTab} onLogout={() => { logout(); navigate('/login'); }} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
                {activeTab === 'dashboard' && (
                    <CompanyOverview 
                        activeJobsList={activeJobsList} 
                        changeTab={changeTab} 
                        setSelectedJobFilter={setSelectedJobFilter} 
                    />
                )}

                {activeTab === 'jobs' && (
                    <CompanyJobsTab 
                        activeJobsList={activeJobsList}
                        setEditingJob={setEditingJob}
                        setSelectedJobFilter={setSelectedJobFilter}
                        changeTab={changeTab}
                        handleDeleteJob={handleDeleteJob}
                        handleCreateJob={handleCreateJob}
                    />
                )}

                {activeTab === 'candidates' && (
                    <CompanyCandidatesTab 
                        selectedJobFilter={selectedJobFilter}
                        activeJobsList={activeJobsList}
                        setSelectedJobFilter={setSelectedJobFilter}
                        displayedCandidates={displayedCandidates}
                        openCandidateModal={openCandidateModal}
                        handleCandidateDecision={handleCandidateDecision}
                        handleOpenReview={handleOpenReview}
                    />
                )}

                {/* --- MENTORING / TRACKING SECTION --- */}
                {activeTab === 'mentoring' && (
                    <InternshipTracker 
                        candidates={candidatesList} 
                        jobs={activeJobsList} 
                        onUpdate={handleTrackingUpdate} 
                    />
                )}

                {activeTab === 'post-job' && (
                    <CompanyPostJobTab 
                        onSave={handleSaveJob} 
                        onCancel={() => changeTab('jobs')} 
                        initialData={editingJob} 
                    />
                )}

                {activeTab === 'settings' && <CompanySettings data={user} onUpdate={(updates) => updateUser(updates)} />}
            </div>
        </div>
        
        {/* Review Modal for Company */}
        <ReviewModal 
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            candidateName={candidateToReview?.name || 'le candidat'}
            jobTitle={candidateToReview?.jobTitle || 'le stage'}
            onSave={handleSaveReview}
        />
    </div>
  );
};

export default CompanyDashboard;
