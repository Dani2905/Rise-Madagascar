
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getAvailableJobs } from '../utils/jobSearch';
import { industryLabel } from '../utils/industry';
import JobDetailsHeader from '../components/job-details/JobDetailsHeader';
import JobDescription from '../components/job-details/JobDescription';
import JobSidebar from '../components/job-details/JobSidebar';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { canPerformAction } from '../utils/subscription';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSearch = typeof location.state?.fromSearch === 'string' && /^\/(?:search|discover)(?:\?|$)/.test(location.state.fromSearch) ? location.state.fromSearch : '/search';
  const fromCompany = typeof location.state?.fromCompany === 'string' && /^\/companies\/[^/?]+(?:\?|$)/.test(location.state.fromCompany) ? location.state.fromCompany : null;
  const returnPath = fromCompany || fromSearch;
  const returnState = fromCompany && typeof location.state?.fromDirectory === 'string' ? { fromDirectory: location.state.fromDirectory } : undefined;
  const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
  const { openSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  // 1. Charger le job et hydrater avec les données du propriétaire
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Même source et même règle d'activité que la liste de résultats.
    let foundJob: any = getAvailableJobs().find(j => String(j.id) === id);
    setJob(null);

    if (foundJob) {
        // B. HYDRATATION : Récupérer les infos fraîches du propriétaire
        // Si l'offre a un ownerId, on va chercher le profil dans rise_db_users
        // pour être sûr d'afficher le logo/nom actuel (au cas où le profil a été modifié après la publication de l'offre)
        if (foundJob.ownerId) {
            let dbUsers: any[] = [];
            try {
                const parsed = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
                dbUsers = Array.isArray(parsed) ? parsed : [];
            } catch { /* Aucun profil local lisible. */ }
            const owner = dbUsers.find((u: any) => u?.id != null && String(u.id) === String(foundJob.ownerId));

            if (owner) {
                const isIndividual = owner.role === 'individual';

                // On surcharge les données de l'offre avec celles du profil
                foundJob = {
                    ...foundJob,
                    company: owner.companyName || `${owner.firstName} ${owner.lastName}`,
                    logoUrl: owner.logoUrl || owner.avatarUrl || foundJob.logoUrl,
                    location: foundJob.location || owner.location, // Garder la loc du job si spécifique, sinon celle du owner
                    
                    // On structure les infos pour la Sidebar
                    companyInfo: {
                        id: owner.id, // Important pour la navigation vers le profil
                        size: owner.companySize || 'N/A',
                        // Si c'est un particulier, on force le tag 'Particulier' pour l'UI de la Sidebar
                        industry: isIndividual ? 'Particulier' : industryLabel(owner.industry),
                        website: owner.website || ''
                    }
                };
            }
        } 
        // Les exemples ne correspondent pas à des recruteurs inscrits.
        else if (!foundJob.companyInfo) {
             foundJob = { ...foundJob, companyInfo: { size: 'N/A', industry: 'N/A', website: '' } };
        }

        // C. Normalisation finale
        const normalizedJob = {
            ...foundJob,
            logoUrl: foundJob.logoUrl || '',
            tags: Array.isArray(foundJob.tags) ? foundJob.tags : [],
            companyInfo: foundJob.companyInfo || { size: 'N/A', industry: 'N/A', website: '' },
            requirementsText: typeof foundJob.requirements === 'string' ? foundJob.requirements : undefined,
            requirements: (typeof foundJob.requirements === 'object' && foundJob.requirements !== null) ? foundJob.requirements : {
                education: 'Non spécifié',
                experience: (foundJob as any).experienceLevel || 'Non spécifié',
                language: 'Non spécifié'
            }
        };
        setJob(normalizedJob);
    }
    
    setIsLoading(false);
  }, [id]);

  const handleApply = () => {
    setFeedback(null);
    if (authLoading) return;
    if (!job || !getAvailableJobs().some(item => String(item.id) === String(job.id))) {
      setJob(null); return;
    }
    if (!user || !isLoggedIn) { navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } }); return; }
    if (user.role !== 'student') { setFeedback({ kind: 'error', text: 'Seuls les étudiants peuvent postuler.' }); return; }
    // Contrôler la session et l’abonnement les plus récents, pas seulement l’état React.
    let current: any;
    try {
      current = JSON.parse(localStorage.getItem('rise_user_data') || 'null');
      if (!localStorage.getItem('rise_session_token') || !current || String(current.id) !== String(user.id) || current.role !== 'student') throw new Error();
    } catch { setFeedback({ kind: 'error', text: 'Votre session a changé. Reconnectez-vous avant de postuler.' }); return; }
    if (!canPerformAction(current, 'apply')) {
      setFeedback({ kind: 'error', text: 'Un abonnement étudiant actif est nécessaire pour postuler.' });
      window.dispatchEvent(new StorageEvent('storage', { key: 'rise_user_data' }));
      openSubscription(); return;
    }

    const applicationsRaw = localStorage.getItem('rise_applications');
    const jobsRaw = localStorage.getItem('rise_jobs');
    try {
      const apps = JSON.parse(applicationsRaw || '[]'), jobs = JSON.parse(jobsRaw || '[]');
      if (!Array.isArray(apps) || !Array.isArray(jobs) || (current.applications != null && !Array.isArray(current.applications))) throw new Error('invalid');
      const own = (a: any) => a?.applicantId != null ? String(a.applicantId) === String(current.id) : typeof a?.email === 'string' && typeof current.email === 'string' && a.email.trim().toLowerCase() === current.email.trim().toLowerCase();
      if (apps.some(a => a?.jobId != null && String(a.jobId) === String(job.id) && own(a))) { setFeedback({ kind: 'error', text: 'Vous avez déjà candidaté à cette offre.' }); return; }
      const matches = jobs.filter(j => j?.id != null && String(j.id) === String(job.id));
      if (matches.length > 1 || (matches.length === 1 && matches[0].status && matches[0].status !== 'Actif')) throw new Error('invalid');
      let appId = Date.now(); while (apps.some(a => a?.id != null && String(a.id) === String(appId))) appId++;
      const application = {
        id: appId, jobId: job.id, applicantId: current.id, jobTitle: job.title, company: job.company, contractType: job.type,
        name: `${current.firstName || ''} ${current.lastName || ''}`.trim(), email: current.email || '', phone: current.phone || '',
        location: current.location || '', role: current.title || (current.studyField ? `Étudiant en ${current.studyField}` : 'Étudiant'),
        school: current.school || '', avatarUrl: current.avatarUrl || '', bio: current.bio || '', skills: Array.isArray(current.skills) ? current.skills : [],
        experiences: Array.isArray(current.experiences) ? current.experiences : [], education: Array.isArray(current.education) ? current.education : [],
        status: 'pending', date: new Date().toLocaleDateString('fr-FR'), appliedAt: new Date().toISOString(), statusColor: 'text-blue-600 bg-blue-50 border-blue-100'
      };
      const nextApps = [...apps, application];
      const nextJobs = jobs.map(j => j === matches[0] ? { ...j, candidates: nextApps.filter(a => a?.jobId != null && String(a.jobId) === String(job.id)).length } : j);
      try {
        localStorage.setItem('rise_applications', JSON.stringify(nextApps));
        if (matches.length) localStorage.setItem('rise_jobs', JSON.stringify(nextJobs));
        updateUser({ applications: [application, ...(current.applications || [])] });
      } catch (e) {
        try { if (applicationsRaw === null) localStorage.removeItem('rise_applications'); else localStorage.setItem('rise_applications', applicationsRaw); if (jobsRaw === null) localStorage.removeItem('rise_jobs'); else localStorage.setItem('rise_jobs', jobsRaw); } catch { /* stockage indisponible */ }
        throw e;
      }
      setFeedback({ kind: 'success', text: 'Candidature enregistrée dans ce navigateur. Aucun envoi réel n’a été effectué.' });
    } catch { setFeedback({ kind: 'error', text: 'Impossible d’enregistrer la candidature : données locales illisibles ou stockage indisponible.' }); }
  };

  if (isLoading) return null;

  if (!job) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Offre introuvable</h1>
            <p className="text-gray-500 mb-8">Cette offre a peut-être expiré ou a été supprimée.</p>
            <Link to={returnPath} state={returnState} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
                Retour aux offres
            </Link>
        </div>
      );
  }


  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8">
            <Link to={returnPath} state={returnState} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-2" /> {fromCompany ? 'Retour au profil' : 'Retour aux offres'}
            </Link>
        </div>

        {feedback && <div role={feedback.kind === 'error' ? 'alert' : 'status'} className={`mb-5 rounded-xl border p-4 text-sm ${feedback.kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'}`}><p>{feedback.text}</p>{feedback.kind === 'success' && <Link className="mt-2 inline-block font-bold underline" to="/profile?tab=applications">Voir mes candidatures</Link>}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (Main Content) */}
            <div className="lg:col-span-8">
                {job.isDemo && <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">Cette offre est un exemple fictif. Toute candidature est une simulation enregistrée uniquement dans ce navigateur.</p>}
                <JobDetailsHeader job={job} />
                <JobDescription 
                    description={job.description} 
                    tags={job.tags} 
                    requirements={job.requirementsText}
                    benefits={job.benefits}
                />
            </div>

            {/* RIGHT COLUMN (Sidebar) */}
            <div className="lg:col-span-4">
                <JobSidebar job={job} onApply={handleApply} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
