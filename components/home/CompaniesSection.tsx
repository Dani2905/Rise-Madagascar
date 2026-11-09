import React, { useState, useEffect } from 'react';
import { ArrowRight, Building2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ALL_COMPANIES, Company } from '../../data/companiesData';

const CompaniesSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>(ALL_COMPANIES);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);

  // Charger les entreprises dynamiques + statiques
  useEffect(() => {
      // 1. Récupérer les utilisateurs "Company" depuis la DB locale
      const dbUsersStr = localStorage.getItem('rise_db_users');
      const dbUsers = dbUsersStr ? JSON.parse(dbUsersStr) : [];
      
      const newCompanies: Company[] = dbUsers
          .filter((u: any) => u.role === 'company')
          .map((u: any) => ({
              id: u.id,
              name: u.companyName || u.firstName,
              description: u.description || "Nouvelle entreprise sur Rise.",
              logoUrl: u.logoUrl || `https://ui-avatars.com/api/?name=${u.companyName || 'C'}&background=random&color=fff`,
              jobs: 1, // On simule 1 job actif pour l'affichage
              sector: u.industry || 'Autre',
              location: u.city || 'Tana',
              website: u.website || ''
          }));

      // 2. Fusionner (Nouveaux en premier)
      const merged = [...newCompanies, ...ALL_COMPANIES];
      setDisplayCompanies(merged);
      setTotalPages(Math.ceil(merged.length / itemsPerPage));

  }, []);

  // Rotation automatique
  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); 

    return () => clearInterval(interval);
  }, [totalPages]);

  const currentCompanies = displayCompanies.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-100 overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Ils recrutent sur Rise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Des leaders de l'industrie aux startups innovantes, 
                découvrez les entreprises qui s'engagent pour la jeunesse malgache.
            </p>
          </div>

          <div className="relative min-h-[400px]">
              {/* Grid with Animation Key based on Page to trigger reflow/animation */}
              <div key={currentPage} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {currentCompanies.map((company) => (
                    <div 
                        key={company.id} 
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1 h-full"
                        onClick={() => navigate(`/companies/${company.id}`)}
                    >
                        <div className="w-20 h-20 mb-5 rounded-2xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 ring-4 ring-gray-50 group-hover:ring-primary/20">
                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <h3 className="font-heading font-bold text-gray-900 text-xl mb-3 group-hover:text-primary transition-colors line-clamp-1">
                            {company.name}
                        </h3>
                        
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3 flex-grow">
                            {company.description}
                        </p>
                        
                        <div className="mt-auto w-full pt-4 border-t border-gray-50">
                            <span className="inline-flex items-center text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {company.jobs} offres disponibles <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </div>
                ))}
              </div>

              {/* Pagination Dots */}
              {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentPage === idx 
                                ? 'w-8 bg-primary' 
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Page ${idx + 1}`}
                        />
                    ))}
                  </div>
              )}
          </div>
          
           {/* Dual CTA Section */}
           <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex-1 relative z-10">
                 <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Votre entreprise recrute ?</h3>
                 <p className="text-gray-600">
                    Rejoignez le réseau. Publiez vos offres gratuitement et accédez à une CVthèque de +2000 étudiants qualifiés.
                 </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <button 
                    onClick={() => navigate('/companies')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 transition-colors border border-gray-200"
                  >
                     <Building2 size={18} />
                     Voir l'annuaire
                  </button>
                  {user?.role !== 'student' && (
                      <button 
                        onClick={() => navigate(user ? '/dashboard?tab=jobs' : '/register')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                      >
                        <Briefcase size={18} />
                        Espace Recruteur
                      </button>
                  )}
              </div>
           </div>
       </div>
    </section>
  );
};

export default CompaniesSection;