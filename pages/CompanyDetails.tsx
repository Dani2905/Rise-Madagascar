
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2, Lock } from 'lucide-react';
import { ALL_COMPANIES, INDIVIDUALS } from '../data/companiesData';
import { getActiveJobsForOwner, getAvailableJobs } from '../utils/jobSearch';
import CompanyHeader from '../components/company-details/CompanyHeader';
import CompanyAbout from '../components/company-details/CompanyAbout';
import CompanyJobs from '../components/company-details/CompanyJobs';
import { useAuth } from '../context/AuthContext';
import { getWebsiteUrl } from '../utils/website';
import { industryLabel } from '../utils/industry';
import { isDemoRecruiter } from '../utils/demoRecruiter';

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState<any>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fromDirectory = typeof location.state?.fromDirectory === 'string' && /^\/companies(?:\?|$)/.test(location.state.fromDirectory) ? location.state.fromDirectory : '/companies';

  useEffect(() => {
    const refresh = () => setDataVersion(version => version + 1);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (!id) return;

    const targetId = id.toString();

    const readArray = (key: string): any[] => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    };

    // Les liens vers les profils doivent rester utilisables même si une donnée locale est invalide.
    const ownerJobs = getActiveJobsForOwner(targetId);

    const dbUsers = readArray('rise_db_users');
    const userProfile = dbUsers.find((u: any) => u?.id != null && String(u.id) === targetId);
    if (userProfile && userProfile.role !== 'company' && userProfile.role !== 'individual') { setCompany(null); setIsLoading(false); return; }

    let finalProfile: any = null;

    if (userProfile) {
        // --- CAS A : UTILISATEUR RÉEL OU DÉMO PERSISTÉ ---
        const isIndividual = userProfile.role === 'individual';
        
        const dynamicNeeds = isIndividual
            ? [...new Set(ownerJobs.map(job => typeof job.title === 'string' ? job.title.trim() : '').filter(Boolean))].slice(0, 3)
            : [];
        const individualName = [userProfile.firstName, userProfile.lastName]
            .filter(part => typeof part === 'string' && part.trim()).map(part => part.trim()).join(' ');

        finalProfile = {
            id: userProfile.id,
            // Nom : Priorité au nom d'entreprise/Affichage, sinon Prénom Nom
            name: isIndividual ? (individualName || userProfile.companyName || 'Particulier') : (userProfile.companyName || individualName || 'Entreprise'),
            
            // Slogan / Description courte
            description: (isIndividual ? userProfile.bio || userProfile.description : userProfile.description) || (isIndividual ? "Membre de la communauté Rise" : "Entreprise membre"),
            
            // Corps de texte (Bio / Histoire)
            longDescription: userProfile.bio || userProfile.longDescription || (isIndividual ? "Ce membre n'a pas encore ajouté de description détaillée." : "Cette entreprise n'a pas encore rempli sa présentation."),
            
            // Visuels
            logoUrl: userProfile.logoUrl || userProfile.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile.firstName || 'U'}&background=random`,
            coverUrl: userProfile.coverUrl || null,
            
            // Métadonnées
            jobs: ownerJobs.length,
            activeJobs: ownerJobs,
            sector: isIndividual ? 'Particulier' : industryLabel(userProfile.industry),
            location: userProfile.location || userProfile.city || "Madagascar",
            website: userProfile.website || "",
            
            // Champs spécifiques Entreprise
            founded: userProfile.founded || "",
            employees: userProfile.companySize || "N/A",
            perks: userProfile.perks || [],
            
            // Champs spécifiques Particulier
            needs: dynamicNeeds,
            
            // Technique
            role: userProfile.role,
            isDemoProfile: isDemoRecruiter(userProfile),
            registeredAt: userProfile.registeredAt
        };

    } else {
        // --- CAS B : DONNÉES STATIQUES (Fallback si pas trouvé en DB) ---
        // Essayer de trouver dans les Mocks Entreprises
        let mockData: any = ALL_COMPANIES.find(c => c.id.toString() === targetId);
        let role = 'company';

        // Sinon chercher dans les Mocks Particuliers
        if (!mockData) {
            mockData = INDIVIDUALS.find(i => i.id.toString() === targetId);
            role = 'individual';
        }

        if (mockData) {
            const demoJobs = getAvailableJobs().filter(job => !job.ownerId && job.company?.trim().toLowerCase() === mockData.name?.trim().toLowerCase());
            finalProfile = {
                ...mockData,
                isDemoProfile: true,
                activeJobs: demoJobs,
                longDescription: mockData.longDescription || mockData.description, // Fallback pour les mocks
                role: role,
                // Pour les mocks, on garde les jobs statiques définis dans le fichier data
                jobs: demoJobs.length
            };
        }
    }

    setCompany(finalProfile);
    setIsLoading(false);
  }, [id, dataVersion]);

  useEffect(() => {
    if (company && new URLSearchParams(location.search).get('view') === 'offers') {
      document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [company?.id, location.search]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement du profil…</div>;

  if (!company) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="text-gray-300" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Profil introuvable</h2>
            <p className="text-gray-500 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
            <Link to={fromDirectory} className="text-primary font-bold hover:underline">Retour à l'annuaire</Link>
        </div>
      );
  }

  const handleContact = () => {
      // Convention : IDs > 1000 ou ID courts connus (1, 102) = Utilisateurs "connectables"
      if (company.id && !company.isDemoProfile && String(user?.id) !== String(company.id)) { 
          navigate(`/messages?partner=${encodeURIComponent(String(company.id))}`);
      } else {
          window.Toastify({
              text: "Messagerie indisponible pour ce profil.",
              style: { background: "#64748b" }
          }).showToast();
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {company.isDemoProfile && <div className="max-w-7xl mx-auto px-4 pt-5"><p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">Profil de démonstration, non répertorié dans l’annuaire des recruteurs inscrits.</p></div>}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
             <div className="mb-6">
                <Link to={fromDirectory} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Retour à l'annuaire
                </Link>
            </div>
            <CompanyHeader company={company} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-10">
                <CompanyAbout company={company} />
                <div className="border-t border-gray-200 my-8"></div>
                <CompanyJobs company={company} jobs={company.activeJobs || []} />
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-primary/5 sticky top-24">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Contacter {company.name}</h3>
                    {company.isDemoProfile ? <p className="text-sm text-slate-500">Le contact n’est pas disponible pour un profil de démonstration.</p> : user && String(user.id) === String(company.id) ? <p className="text-sm text-slate-500">Il s’agit de votre profil.</p> : isLoggedIn ? (
                        <>
                            <p className="text-xs text-slate-500 mb-3">Messagerie de démonstration : les échanges restent dans ce navigateur.</p>
                            <button 
                                onClick={handleContact}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors mb-3"
                            >
                                Envoyer un message
                            </button>
                            {getWebsiteUrl(company.website) && (
                                <a href={getWebsiteUrl(company.website)!} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Visiter le site web</a>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <Lock className="mx-auto text-gray-400 mb-2" size={24} />
                            <p className="text-xs text-gray-500 mb-3">Connectez-vous pour accéder aux options de contact.</p>
                            <button onClick={() => navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } })} className="w-full py-2.5 bg-primary text-slate-900 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">Se connecter</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
