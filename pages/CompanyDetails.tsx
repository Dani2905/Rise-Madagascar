
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Lock } from 'lucide-react';
import { ALL_COMPANIES, INDIVIDUALS } from '../data/companiesData';
import CompanyHeader from '../components/company-details/CompanyHeader';
import CompanyAbout from '../components/company-details/CompanyAbout';
import CompanyJobs from '../components/company-details/CompanyJobs';
import { useAuth } from '../context/AuthContext';

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    const targetId = id.toString();

    // --- 1. CHARGEMENT DES JOBS (Nécessaire pour compter et générer les tags) ---
    const allJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
    
    // Filtrer les jobs appartenant à ce profil
    const ownerJobs = allJobs.filter((j: any) => 
        (j.ownerId && j.ownerId.toString() === targetId) && j.status === 'Actif'
    );

    // --- 2. RECHERCHE DU PROFIL DANS LA "DB" LOCALE (Prioritaire) ---
    const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    const userProfile = dbUsers.find((u: any) => u.id.toString() === targetId);

    let finalProfile: any = null;

    if (userProfile) {
        // --- CAS A : UTILISATEUR RÉEL OU DÉMO PERSISTÉ ---
        const isIndividual = userProfile.role === 'individual';
        
        // Génération dynamique des tags "Besoins" pour les particuliers
        let dynamicNeeds = userProfile.needs || [];
        if (isIndividual && dynamicNeeds.length === 0) {
            if (ownerJobs.length > 0) {
                dynamicNeeds = ownerJobs.map((j: any) => j.title.split(' ')[0] + '...'); // Extrait court
            } else {
                dynamicNeeds = ['Aide diverse'];
            }
        }

        finalProfile = {
            id: userProfile.id,
            // Nom : Priorité au nom d'entreprise/Affichage, sinon Prénom Nom
            name: userProfile.companyName || `${userProfile.firstName} ${userProfile.lastName}`,
            
            // Slogan / Description courte
            description: userProfile.description || (isIndividual ? "Membre de la communauté Rise" : "Entreprise membre"),
            
            // Corps de texte (Bio / Histoire)
            longDescription: userProfile.bio || userProfile.longDescription || (isIndividual ? "Ce membre n'a pas encore ajouté de description détaillée." : "Cette entreprise n'a pas encore rempli sa présentation."),
            
            // Visuels
            logoUrl: userProfile.logoUrl || userProfile.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile.firstName || 'U'}&background=random`,
            coverUrl: userProfile.coverUrl || null,
            
            // Métadonnées
            jobs: ownerJobs.length,
            sector: userProfile.industry || (isIndividual ? "Particulier" : "Autre"),
            location: userProfile.location || userProfile.city || "Madagascar",
            website: userProfile.website || "",
            
            // Champs spécifiques Entreprise
            founded: userProfile.founded || "2024",
            employees: userProfile.companySize || "N/A",
            perks: userProfile.perks || (userProfile.role === 'company' ? ["Recrutement actif"] : []),
            
            // Champs spécifiques Particulier
            needs: dynamicNeeds,
            
            // Technique
            role: userProfile.role,
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
            finalProfile = {
                ...mockData,
                longDescription: mockData.longDescription || mockData.description, // Fallback pour les mocks
                role: role,
                // Pour les mocks, on garde les jobs statiques définis dans le fichier data
                jobs: mockData.jobs || mockData.activeOffers || 0
            };
        }
    }

    setCompany(finalProfile);
  }, [id]);

  if (!company) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="text-gray-300" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Profil introuvable</h2>
            <p className="text-gray-500 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
            <Link to="/companies" className="text-primary font-bold hover:underline">Retour à l'annuaire</Link>
        </div>
      );
  }

  const handleContact = () => {
      // Convention : IDs > 1000 ou ID courts connus (1, 102) = Utilisateurs "connectables"
      if (company.id) { 
          navigate(`/messages?partner=${company.id}`);
      } else {
          window.Toastify({
              text: "Messagerie indisponible pour ce profil.",
              style: { background: "#64748b" }
          }).showToast();
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
             <div className="mb-6">
                <Link to="/companies" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
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
                <CompanyJobs company={company} />
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-primary/5 sticky top-24">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Contacter {company.name}</h3>
                    {isLoggedIn ? (
                        <>
                            <button 
                                onClick={handleContact}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors mb-3"
                            >
                                Envoyer un message
                            </button>
                            {company.website && (
                                <button 
                                    onClick={() => window.open(company.website.startsWith('http') ? company.website : `https://${company.website}`, '_blank')}
                                    className="w-full py-3 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Visiter le site web
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <Lock className="mx-auto text-gray-400 mb-2" size={24} />
                            <p className="text-xs text-gray-500 mb-3">Connectez-vous pour accéder aux options de contact.</p>
                            <button onClick={() => navigate('/login')} className="w-full py-2.5 bg-primary text-slate-900 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">Se connecter</button>
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
