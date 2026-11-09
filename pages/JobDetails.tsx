
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { MOCK_JOBS } from '../data/jobsData';
import { ALL_COMPANIES } from '../data/companiesData';
import LoginWall from '../components/job-details/LoginWall';
import JobDetailsHeader from '../components/job-details/JobDetailsHeader';
import JobDescription from '../components/job-details/JobDescription';
import JobSidebar from '../components/job-details/JobSidebar';
import { useAuth } from '../context/AuthContext';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  // 1. Charger le job et hydrater avec les données du propriétaire
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // A. Chercher l'offre (MOCK ou LIVE)
    let foundJob: any = MOCK_JOBS.find(j => j.id === id);

    if (!foundJob) {
        const customJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
        foundJob = customJobs.find((j: any) => j.id.toString() === id);
    }

    if (foundJob) {
        // B. HYDRATATION : Récupérer les infos fraîches du propriétaire
        // Si l'offre a un ownerId, on va chercher le profil dans rise_db_users
        // pour être sûr d'afficher le logo/nom actuel (au cas où le profil a été modifié après la publication de l'offre)
        if (foundJob.ownerId) {
            const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
            const owner = dbUsers.find((u: any) => u.id.toString() === foundJob.ownerId.toString());

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
                        industry: isIndividual ? 'Particulier' : (owner.industry || 'Autre'),
                        website: owner.website || 'Non renseigné'
                    }
                };
            }
        } 
        // Cas MOCK ou sans ownerId : on s'assure que companyInfo existe
        else if (!foundJob.companyInfo) {
             // Essayer de trouver une correspondance dans les entreprises MOCK pour avoir l'ID
             const mockCompany = ALL_COMPANIES.find((c: any) => c.name === foundJob.company);
             
             foundJob.companyInfo = {
                id: mockCompany?.id,
                size: 'N/A',
                industry: 'N/A',
                website: 'Non renseigné'
            };
        }

        // C. Normalisation finale
        const normalizedJob = {
            ...foundJob,
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
    if (!user) {
        navigate('/login');
        return;
    }
    if (user.role !== 'student') {
        window.Toastify({
            text: "Seuls les étudiants peuvent postuler.",
            style: { background: "#f59e0b" }
        }).showToast();
        return;
    }

    if (!user.hasSubscription) {
        window.Toastify({
            text: "Un abonnement est requis pour postuler.",
            style: { background: "#ef4444" }
        }).showToast();
        navigate('/pricing');
        return;
    }

    // --- 1. VERIFICATION DOUBLONS (Source de vérité : rise_applications) ---
    const globalApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
    
    // On vérifie si CET utilisateur a déjà postulé à CE job
    const alreadyApplied = globalApps.some((app: any) => 
        (app.jobId.toString() === job.id.toString() && app.applicantId === user.id) ||
        (app.jobId.toString() === job.id.toString() && app.email === user.email) // Fallback email
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
    const customJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
    const jobIndex = customJobs.findIndex((j: any) => j.id.toString() === job.id.toString());
    
    if (jobIndex !== -1) {
        const currentCandidates = parseInt(customJobs[jobIndex].candidates || 0);
        customJobs[jobIndex].candidates = currentCandidates + 1;
        localStorage.setItem('rise_jobs', JSON.stringify(customJobs));
        
        // Mise à jour de l'état local pour reflet immédiat (optionnel)
        setJob((prev: any) => ({ ...prev, candidates: (prev.candidates || 0) + 1 }));
    }

    // Feedback Succès
    window.Toastify({
        text: "Candidature envoyée avec succès !",
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
            <Link to="/search" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
                Retour aux offres
            </Link>
        </div>
      );
  }

  if (!isLoggedIn) {
    return <LoginWall jobTitle={job.title} companyName={job.company} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8">
            <Link to="/search" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Retour aux offres
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (Main Content) */}
            <div className="lg:col-span-8">
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
