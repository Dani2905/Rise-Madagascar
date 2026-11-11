
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ArrowLeft, ExternalLink, Camera } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { canPerformAction, getCurrentLocalSession } from '../../utils/subscription';
import { Review } from '../../types';
import { saveMissionTracking, MissionTrackingDraft } from '../../utils/missionTracking';
import { isDemoRecruiter } from '../../utils/demoRecruiter';
import { readLocalArray, ownsRecruiterJob, getOwnedCandidate } from '../../utils/recruiterDashboard';

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
  const { openSubscription } = useSubscription();

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
  const [dataVersion, setDataVersion] = useState(0);
  const [error, setError] = useState('');
  const [dataAvailable, setDataAvailable] = useState(true);
  const [imageMessage, setImageMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const uploadBusy = useRef(false);
  const tab = searchParams.get('tab');
  const activeTab = ['dashboard', 'jobs', 'candidates', 'mentoring', 'settings', 'post-job'].includes(tab || '') ? tab! : 'dashboard';

  const updateCompany = (updates: any) => {
    const users = readLocalArray('rise_db_users');
    if (!user || users.filter(u => u?.id != null && String(u.id) === String(user.id) && u.role === 'company').length !== 1) throw new Error('Compte entreprise introuvable.');
    updateUser(updates);
  };

  // Charger les données de ce recruteur et actualiser les compteurs depuis les candidatures.
  useEffect(() => {
      if (!user) return;
      const refresh = () => {
        try {
          const users = readLocalArray('rise_db_users');
          const allJobs = readLocalArray('rise_jobs');
          const allApps = readLocalArray('rise_applications');
          const counts = new Map<string, number>();
          allJobs.forEach(j => { if (j?.id != null) counts.set(String(j.id), (counts.get(String(j.id)) || 0) + 1); });
          const myJobs = allJobs.filter(j => j?.id != null && counts.get(String(j.id)) === 1 && ownsRecruiterJob(user, j, users));
          const candidates = allApps.filter(a => a?.id != null && getOwnedCandidate(user, a.id, allApps, allJobs, users) === a);
          setActiveJobsList(myJobs.map(j => ({ ...j, candidates: candidates.filter(a => String(a.jobId) === String(j.id)).length })));
          setCandidatesList(candidates);
          setStats({ activeJobs: myJobs.filter(j => !j.status || j.status === 'Actif').length, totalCandidates: candidates.length, newMessages: 0 });
          setDataAvailable(true); setError('');
        } catch { setDataAvailable(false); setActiveJobsList([]); setCandidatesList([]); setError('Les données locales des offres ou candidatures sont illisibles. Aucune donnée n’a été modifiée.'); }
      };
      refresh();
      window.addEventListener('storage', refresh); window.addEventListener('focus', refresh);
      return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, [user, activeTab, dataVersion]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'coverUrl' | 'logoUrl') => {
      const file = event.target.files?.[0]; event.target.value = '';
      if (!file || uploadBusy.current) return;
      setError(''); setImageMessage('');
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError('Choisissez une image JPG, PNG ou WebP de 2 Mo maximum.'); return; }
      uploadBusy.current = true; setUploading(true);
      const reader = new FileReader();
      reader.onerror = () => { uploadBusy.current = false; setUploading(false); setError('Impossible de lire cette image.'); };
      reader.onload = () => {
          try {
            if (typeof reader.result !== 'string') throw new Error();
            updateCompany(field === 'logoUrl' ? { logoUrl: reader.result, avatarUrl: reader.result } : { coverUrl: reader.result });
            setImageMessage(field === 'logoUrl' ? 'Logo enregistré dans ce navigateur.' : 'Couverture enregistrée dans ce navigateur.');
          } catch { setError('Impossible d’enregistrer cette image dans ce navigateur.'); }
          finally { uploadBusy.current = false; setUploading(false); }
      };
      try { reader.readAsDataURL(file); } catch { uploadBusy.current = false; setUploading(false); setError('Impossible de lire cette image.'); }
  };
  const removeImage = (field: 'coverUrl' | 'logoUrl') => {
      try { updateCompany(field === 'logoUrl' ? { logoUrl: '', avatarUrl: '' } : { coverUrl: '' }); setImageMessage('Image retirée.'); setError(''); }
      catch { setError('Impossible de retirer cette image dans ce navigateur.'); }
  };

  const changeTab = (tab: any) => {
      if (tab !== 'candidates') setSelectedJobFilter(null);
      navigate(`/dashboard?tab=${tab}`);
  };

  const handleCreateJob = () => {
      setEditingJob(null);
      changeTab('post-job');
  };

  const handleSaveJob = (jobData: any) => {
      const current = getCurrentLocalSession(user);
      if (!current) { setError('Votre session a changé. Reconnectez-vous avant de publier.'); return; }
      if (!canPerformAction(current, 'publishOffer')) { setError('Un abonnement entreprise actif est nécessaire pour publier ou modifier une offre.'); window.dispatchEvent(new StorageEvent('storage', { key: 'rise_user_data' })); openSubscription(); return; }
      try {
        const users = readLocalArray('rise_db_users');
        const jobs = readLocalArray('rise_jobs');
        if (editingJob) {
          const matches = jobs.filter(j => j?.id != null && String(j.id) === String(editingJob.id));
          if (matches.length !== 1 || !ownsRecruiterJob(user, matches[0], users)) throw new Error('Offre introuvable ou appartenant à un autre compte.');
          const existing = matches[0];
          const updated = { ...existing, ...jobData, id: existing.id, ownerId: user.id, ownerEmail: user.email, candidates: existing.candidates || 0, createdAt: existing.createdAt };
          localStorage.setItem('rise_jobs', JSON.stringify(jobs.map(j => j === existing ? updated : j)));
        } else {
          let id = Date.now(); while (jobs.some(j => j?.id != null && String(j.id) === String(id))) id++;
          localStorage.setItem('rise_jobs', JSON.stringify([{ ...jobData, id: String(id), ownerId: user.id, ownerEmail: user.email, createdAt: new Date().toISOString(), candidates: 0, ...(isDemoRecruiter(user) ? { isDemo: true } : {}) }, ...jobs]));
        }
        setError(''); setEditingJob(null); setDataVersion(v => v + 1); changeTab('jobs');
      } catch (e) { setError(e instanceof Error && e.message.includes('Offre introuvable') ? e.message : 'Impossible d’enregistrer l’offre : données locales illisibles ou stockage indisponible.'); }
  };

  const handleDeleteJob = (id: string | number) => {
      if (!user || !window.confirm('Supprimer cette offre dans ce navigateur ? Les candidatures associées resteront dans les historiques étudiants mais ne seront plus accessibles depuis cette offre.')) return;
      try {
        if (!getCurrentLocalSession(user)) throw new Error();
        const users = readLocalArray('rise_db_users'), jobs = readLocalArray('rise_jobs');
        const matches = jobs.filter(j => j?.id != null && String(j.id) === String(id));
        if (matches.length !== 1 || !ownsRecruiterJob(user, matches[0], users)) throw new Error();
        localStorage.setItem('rise_jobs', JSON.stringify(jobs.filter(j => j !== matches[0])));
        setError(''); setDataVersion(v => v + 1);
      } catch { setError('Impossible de supprimer cette offre : données illisibles ou propriété non vérifiée.'); }
  };

  const handleCandidateDecision = (candidateId: number, status: 'rejected' | 'interview' | 'accepted' | 'pending') => {
      try {
        if (!getCurrentLocalSession(user)) throw new Error();
        const apps = readLocalArray('rise_applications'), jobs = readLocalArray('rise_jobs'), users = readLocalArray('rise_db_users');
        const app = getOwnedCandidate(user, candidateId, apps, jobs, users);
        if (!app || app.status === 'completed') throw new Error();
        localStorage.setItem('rise_applications', JSON.stringify(apps.map(a => a === app ? { ...a, status, updatedAt: new Date().toISOString() } : a)));
        setError(''); setDataVersion(v => v + 1);
      } catch { setError('Impossible de modifier cette candidature : données illisibles ou propriété non vérifiée.'); }
  };

  const handleTrackingUpdate = (candidateId: string | number, trackingData: MissionTrackingDraft, expected: string) => {
      const result = saveMissionTracking(user, candidateId, trackingData, expected);
      if (result.ok) { setError(''); setDataVersion(v => v + 1); }
      return result;
  };

  const handleOpenReview = (candidate: any) => { setCandidateToReview(candidate); setIsReviewModalOpen(true); };
  const handleSaveReview = (rating: number, comment: string) => {
      if (!candidateToReview || !user || !getCurrentLocalSession(user) || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment.trim()) throw new Error('Avis invalide.');
      const appsRaw = localStorage.getItem('rise_applications'), usersRaw = localStorage.getItem('rise_db_users');
      const apps = readLocalArray('rise_applications'), jobs = readLocalArray('rise_jobs'), users = readLocalArray('rise_db_users');
      const app = getOwnedCandidate(user, candidateToReview.id, apps, jobs, users);
      if (!app || app.status !== 'accepted') throw new Error('Candidature introuvable ou déjà clôturée.');
      const matches = users.filter(u => u?.role === 'student' && (app.applicantId != null ? u.id != null && String(u.id) === String(app.applicantId) : typeof u.email === 'string' && typeof app.email === 'string' && u.email.toLowerCase() === app.email.toLowerCase()));
      if (matches.length !== 1) throw new Error('Compte étudiant introuvable.');
      const student = matches[0], reviews = Array.isArray(student.reviews) ? student.reviews : [];
      const review: Review = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, reviewerName: user.companyName || `${user.firstName} ${user.lastName}`, reviewerId: user.id, rating, comment: comment.trim(), date: new Date().toLocaleDateString('fr-FR'), jobTitle: app.jobTitle };
      const nextReviews = [...reviews, review];
      const validRatings = nextReviews.map((r: any) => Number(r.rating)).filter((n: number) => Number.isFinite(n) && n >= 1 && n <= 5);
      try {
        localStorage.setItem('rise_db_users', JSON.stringify(users.map(u => u === student ? { ...student, reviews: nextReviews, rating: Math.round(validRatings.reduce((a: number, n: number) => a + n, 0) / validRatings.length * 10) / 10, reviewCount: validRatings.length } : u)));
        localStorage.setItem('rise_applications', JSON.stringify(apps.map(a => a === app ? { ...a, status: 'completed' } : a)));
      } catch (e) {
        try { if (usersRaw === null) localStorage.removeItem('rise_db_users'); else localStorage.setItem('rise_db_users', usersRaw); if (appsRaw === null) localStorage.removeItem('rise_applications'); else localStorage.setItem('rise_applications', appsRaw); } catch { /* stockage indisponible */ }
        throw e;
      }
      setError(''); setDataVersion(v => v + 1);
  };

  const openCandidateModal = (candidate: any) => {
      navigate(`/candidates/${encodeURIComponent(String(candidate.id))}`);
  };

  const displayedCandidates = selectedJobFilter 
    ? candidatesList.filter(c => c.jobId != null && String(c.jobId) === String(selectedJobFilter))
    : candidatesList;

  if (!user) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Navigation Top */}
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-yellow-600 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
            </Link>
            <Link to={`/companies/${encodeURIComponent(String(user.id))}`} state={{ fromDashboard: true }} className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                Aperçu de mon profil <ExternalLink size={16} className="ml-2" />
            </Link>
        </div>

        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{isDemoRecruiter(user) ? 'Entreprise de démonstration : ses informations et ses offres d’exemple sont fictives. ' : ''}Les profils, offres et candidatures restent dans ce navigateur ; aucun envoi réel n’est effectué.</p>
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</p>}
        {imageMessage && <p role="status" className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{imageMessage}</p>}
        {/* Dynamic Header with Cover & Profile */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="h-48 md:h-64 bg-slate-900 relative group">
                 {/* Hidden inputs */}
                 <input type="file" ref={coverInputRef} aria-label="Choisir une couverture entreprise" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={e => handleImageUpload(e, 'coverUrl')} />
                 <input type="file" ref={logoInputRef} aria-label="Choisir un logo entreprise" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={e => handleImageUpload(e, 'logoUrl')} />

                 {user.coverUrl ? (
                     <img src={user.coverUrl} alt="" className="w-full h-full object-cover" />
                 ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">

                    </div>
                 )}
                 <div className="absolute top-4 right-4 flex gap-2">
                     {user.coverUrl && <button type="button" disabled={uploading} onClick={() => removeImage('coverUrl')} className="px-3 py-2 bg-black/60 text-white text-xs font-bold rounded-xl">Retirer la couverture</button>}
                     <button type="button" disabled={uploading} onClick={() => coverInputRef.current?.click()} className="px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-2">
                        <Camera size={16} /> Modifier la couverture
                     </button>
                 </div>
            </div>
            
            <div className="px-6 md:px-10 pb-6 relative text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 flex-1">
                        <button type="button" aria-label="Modifier le logo" disabled={uploading}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden relative z-10 shrink-0 group/logo cursor-pointer"
                            onClick={() => logoInputRef.current?.click()}
                        >
                            {user.logoUrl || user.avatarUrl ? <img src={user.logoUrl || user.avatarUrl} alt="" className="w-full h-full object-cover group-hover/logo:opacity-75 transition-opacity" /> : <span className="h-full w-full flex items-center justify-center text-4xl font-bold bg-slate-100 text-slate-700">{(user.companyName || 'E').slice(0, 2).toUpperCase()}</span>}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                                <Camera className="text-white drop-shadow-md" size={32} />
                            </div>
                        </button>
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
                                    {user.location || 'Localisation non renseignée'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleCreateJob} className="mb-2 md:mb-4 w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 shrink-0">
                        <Plus size={20} /> Publier une offre
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">Logo et couverture : JPG, PNG ou WebP, 2 Mo maximum chacun, stockés localement.</p>
                {(user.logoUrl || user.avatarUrl) && <button type="button" disabled={uploading} onClick={() => removeImage('logoUrl')} className="mt-2 text-xs font-bold underline text-slate-600">Retirer le logo</button>}
            </div>
        </div>

        {/* Stats Section */}
        {dataAvailable && <CompanyStats stats={stats} changeTab={changeTab} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
                <CompanySidebar activeTab={activeTab} changeTab={changeTab} onLogout={() => { logout(); navigate('/login'); }} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
                {activeTab === 'dashboard' && (
                    <CompanyOverview 
                        user={user}
                        activeJobsList={activeJobsList}
                        candidatesList={candidatesList}
                        dataAvailable={dataAvailable}
                        changeTab={changeTab}
                        setSelectedJobFilter={setSelectedJobFilter}
                        onCreateJob={handleCreateJob}
                        onOpenCandidate={openCandidateModal}
                        onChooseLogo={() => logoInputRef.current?.click()}
                        onChooseCover={() => coverInputRef.current?.click()}
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
                {activeTab === 'mentoring' && (dataAvailable ? (
                    <InternshipTracker 
                        candidates={candidatesList} 
                        jobs={activeJobsList} 
                        onUpdate={handleTrackingUpdate}
                        onOpenReview={handleOpenReview}
                        onViewCandidate={openCandidateModal}
                        onViewCandidates={() => changeTab('candidates')}
                    />
                ) : <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Le suivi est indisponible tant que les données locales sont illisibles.</p>)}

                {activeTab === 'post-job' && (
                    <CompanyPostJobTab 
                        onSave={handleSaveJob} 
                        onCancel={() => changeTab('jobs')} 
                        initialData={editingJob} 
                    />
                )}

                {activeTab === 'settings' && <CompanySettings data={user} onUpdate={updateCompany} />}
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
