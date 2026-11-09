
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getAvailableJobs } from '../utils/jobSearch';
import { industryLabel } from '../utils/industry';
import LoginWall from '../components/job-details/LoginWall';
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
  const fromSearch = typeof location.state?.fromSearch === 'string' && /^\/search(?:\?|$)/.test(location.state.fromSearch) ? location.state.fromSearch : '/search';
  const fromCompany = typeof location.state?.fromCompany === 'string' && /^\/companies\/[^/?]+(?:\?|$)/.test(location.state.fromCompany) ? location.state.fromCompany : null;
  const returnPath = fromCompany || fromSearch;
  const returnState = fromCompany && typeof location.state?.fromDirectory === 'string' ? { fromDirectory: location.state.fromDirectory } : undefined;
  const { user, isLoggedIn, updateUser } = useAuth();
  const { openSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

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
                language: 'Français'
            }
        };
        setJob(normalizedJob);
    }
    
    setIsLoading(false);
  }, [id]);

  const handleApply = () => {
    if (!job || !getAvailableJobs().some(item => String(item.id) === String(job.id))) {
        setJob(null);
        if (window.Toastify) window.Toastify({ text: "Cette offre n'est plus disponible.", style: { background: '#ef4444' } }).showToast();
        return;
    }
    if (!user) {
        navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } });
        return;
    }
    if (user.role !== 'student') {
        window.Toastify({
            text: "Seuls les étudiants peuvent postuler.",
            style: { background: "#f59e0b" }
        }).showToast();
        return;
    }

    if (!canPerformAction(user, 'apply')) {
        window.Toastify({
            text: "Un abonnement étudiant actif est nécessaire pour postuler.",
            style: { background: "#ef4444" }
        }).showToast();
        openSubscription();
        return;
    }

    // --- 1. VERIFICATION DOUBLONS (Source de vérité : rise_applications) ---
    let globalApps: any[];
    try {
        const parsed = JSON.parse(localStorage.getItem('rise_applications') || '[]');
        if (!Array.isArray(parsed)) throw new Error('invalid applications');
        globalApps = parsed;
    } catch {
        if (window.Toastify) window.Toastify({ text: "Les candidatures enregistrées sont illisibles ; impossible de poursuivre sans risque de les écraser.", style: { background: '#ef4444' } }).showToast();
        return;
    }
    
    // On vérifie si CET utilisateur a déjà postulé à CE job
    const alreadyApplied = globalApps.some((app: any) => 
        (app?.jobId != null && String(app.jobId) === String(job.id) && app.applicantId != null && String(app.applicantId) === String(user.id)) ||
        (app?.jobId != null && String(app.jobId) === String(job.id) && user.email && app.email === user.email) // Fallback email
    );

    if (alreadyApplied) {
        window.Toastify({
            text: "Vous avez déjà candidaté à cette offre.",
            style: { background: "#f59e0b" } // Orange warning
        }).showToast();
        return;
    }

    // --- 2. CRÉATION DE L'OBJET CANDIDATURE (SNAPSHOT) ---
    // On fige les données de l'étudiant à l'instant T
    const newApplication = {
        id: Date.now(), // ID unique de la candidature
        jobId: job.id,  // Lien vers l'offre
        applicantId: user.id || user.email, // Lien vers l'étudiant
        
        // Données Job (pour affichage rapide côté étudiant)
        jobTitle: job.title,
        company: job.company,
        contractType: job.type,
        
        // Données Étudiant (Snapshot pour le recruteur)
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "Non renseigné",
        location: user.location || "Madagascar",
        role: user.title || (user.studyField ? `Étudiant en ${user.studyField}` : "Candidat"),
        school: user.school || "Non renseigné",
        avatarUrl: user.avatarUrl,
        bio: user.bio || "Je suis très motivé par cette opportunité.",
        skills: user.skills || [],
        experiences: user.experiences || [],
        education: user.education || [],
        
        // Métadonnées
        status: 'pending', // pending, interview, accepted, rejected
        date: new Date().toLocaleDateString('fr-FR'), // Format français
        appliedAt: new Date().toISOString(),
        statusColor: "text-blue-600 bg-blue-50 border-blue-100" // Défaut visuel
    };

    // --- 3. SAUVEGARDE GLOBALE ---
    globalApps.push(newApplication);
    localStorage.setItem('rise_applications', JSON.stringify(globalApps));

    // --- 4. SAUVEGARDE LOCALE (Côté User Context pour UI immédiate) ---
    // C'est optionnel si le dashboard étudiant lit directement globalApps, 
    // mais utile pour garder l'objet user cohérent dans la session.
    const currentUserApps = user.applications || [];
    updateUser({ applications: [newApplication, ...currentUserApps] });

    // --- 5. MISE À JOUR DU COMPTEUR DE L'OFFRE ---
    // Si c'est un job dynamique (dans localStorage), on incrémente son compteur
    let customJobs: any[] = [];
    try {
        const parsed = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
        customJobs = Array.isArray(parsed) ? parsed : [];
    } catch { /* Pas de compteur local lisible. */ }
    const jobIndex = customJobs.findIndex((j: any) => j?.id != null && String(j.id) === String(job.id));
    
    if (jobIndex !== -1) {
        const currentCandidates = parseInt(customJobs[jobIndex].candidates || 0);
        customJobs[jobIndex].candidates = currentCandidates + 1;
        localStorage.setItem('rise_jobs', JSON.stringify(customJobs));
        
        // Mise à jour de l'état local pour reflet immédiat (optionnel)
        setJob((prev: any) => ({ ...prev, candidates: (prev.candidates || 0) + 1 }));
    }

    // Feedback Succès
    window.Toastify({
        text: "Candidature enregistrée dans ce navigateur (démonstration).",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #10B981, #059669)" }
    }).showToast();

    // Redirection
    setTimeout(() => {
        navigate('/profile?tab=applications');
    }, 1500);
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

  if (!isLoggedIn) {
    return <LoginWall jobTitle={job.title} companyName={job.company} backTo={returnPath} backState={returnState} />;
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
