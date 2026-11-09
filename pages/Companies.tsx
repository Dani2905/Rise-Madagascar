
import React, { useState, useEffect } from 'react';
import { Filter, Building2, Home, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRegisteredRecruiters } from '../utils/registeredCompanies';
import { matchesRecruiterQuery } from '../utils/recruiterSearch';

import CompaniesHero from '../components/companies/CompaniesHero';
import CompanyCard from '../components/companies/CompanyCard';
import IndividualCard from '../components/companies/IndividualCard';
import RecruiterFeatures from '../components/companies/RecruiterFeatures';

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const publish = (type: 'company' | 'individual') => navigate(user && user.role !== 'student' ? '/dashboard?tab=post-job' : `/register?type=${type}`);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'individuals' ? 'individuals' : 'companies';
  const searchTerm = searchParams.get('q') || '';
  const selectedSector = searchParams.get('sector') || 'Tous';
  const onlyRecruiting = searchParams.get('recruiting') === 'true';
  const [recruiters, setRecruiters] = useState(getRegisteredRecruiters);
  const updateParam = (key: string, value: string, replace = false) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params, { replace });
  };
  const setActiveTab = (tab: 'companies' | 'individuals') => updateParam('tab', tab === 'companies' ? '' : tab);
  const setSearchTerm = (value: string) => updateParam('q', value, true);
  const setSelectedSector = (value: string) => updateParam('sector', value === 'Tous' ? '' : value);
  const setOnlyRecruiting = (value: boolean) => updateParam('recruiting', value ? 'true' : '');
  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['q', 'sector', 'recruiting'].forEach(key => params.delete(key));
    setSearchParams(params);
  };

  useEffect(() => {
    const refresh = () => setRecruiters(getRegisteredRecruiters());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, []);

  const companies = recruiters.filter(r => r.role === 'company');
  const individuals = recruiters.filter(r => r.role === 'individual');
  const availableSectors = ['Tous', ...Array.from(new Set<string>(companies.map(c => c.sector).filter(s => s && s !== 'Tous'))).sort((a, b) => a.localeCompare(b, 'fr'))];
  // Un ancien lien peut contenir un secteur qui n'existe plus : il reste visible et effaçable.
  if (selectedSector !== 'Tous' && !availableSectors.includes(selectedSector)) availableSectors.push(selectedSector);
  const filteredCompanies = companies.filter(c => matchesRecruiterQuery(c, searchTerm) &&
    (selectedSector === 'Tous' || c.sector === selectedSector) && (!onlyRecruiting || c.jobs > 0));
  const filteredIndividuals = individuals.filter(r => matchesRecruiterQuery(r, searchTerm) && (!onlyRecruiting || r.jobs > 0));
  const hasFilters = Boolean(searchTerm || selectedSector !== 'Tous' || onlyRecruiting);
  const fromDirectory = `/companies${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO & FILTERS */}
      <CompaniesHero 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        availableSectors={availableSectors}
      />

      {/* 2. LIST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <p className="mb-6 text-xs text-slate-500">Annuaire de démonstration : seuls les comptes enregistrés dans ce navigateur sont affichés. Un profil inscrit ne recrute pas nécessairement en ce moment.</p>
         <div className="flex flex-wrap gap-3 justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-gray-900">
                 {activeTab === 'companies' 
                    ? `${filteredCompanies.length} ${filteredCompanies.length === 1 ? 'entreprise trouvée' : 'entreprises trouvées'}`
                    : `${filteredIndividuals.length} ${filteredIndividuals.length === 1 ? 'particulier trouvé' : 'particuliers trouvés'}`
                 }
             </h2>
             {
                <button type="button" aria-pressed={onlyRecruiting} onClick={() => setOnlyRecruiting(!onlyRecruiting)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${onlyRecruiting ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}>
                    <Filter size={16} /> Recrutent actuellement
                </button>
             }
         </div>

         {/* COMPANIES LIST */}
         {activeTab === 'companies' && (
             filteredCompanies.length > 0 ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                    {filteredCompanies.map(company => (
                        <CompanyCard key={company.id} company={{ ...company, logoUrl: company.logoUrl || '' }} fromDirectory={fromDirectory} />
                    ))}
                </div>
             ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <Building2 size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{companies.length === 0 ? 'Aucune entreprise inscrite dans ce navigateur' : 'Aucune entreprise trouvée pour ces critères'}</h3>
                    {hasFilters && <button type="button"
                        onClick={resetFilters}
                        className="mt-4 text-primary font-bold hover:underline"
                    >
                        Réinitialiser les filtres
                    </button>}
                </div>
             )
         )}

         {/* INDIVIDUALS LIST */}
         {activeTab === 'individuals' && (
             <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                {filteredIndividuals.length === 0 && <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-slate-500"><p>{individuals.length === 0 ? 'Aucun particulier inscrit dans ce navigateur.' : 'Aucun particulier trouvé pour ces critères.'}</p>{hasFilters && <button type="button" onClick={resetFilters} className="mt-4 font-bold text-slate-900 underline">Réinitialiser les filtres</button>}</div>}
                {filteredIndividuals.map(ind => (
                    <IndividualCard key={ind.id} individual={{ ...ind, activeOffers: ind.jobs, verified: false }} fromDirectory={fromDirectory} />
                ))}
                
                {/* CTA Card for new individuals */}
                <div className="bg-gradient-to-br from-primary/10 to-yellow-50 rounded-2xl p-6 border border-primary/20 flex flex-col items-center justify-center text-center border-dashed">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-3 shadow-sm">
                        <Home size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">C'est votre tour ?</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Vous avez besoin d'un étudiant pour une tâche ponctuelle ?
                    </p>
                    {(!user || user.role === 'individual') && <button type="button" onClick={() => publish('individual')} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                        Déposer une annonce
                    </button>}
                </div>
             </div>
         )}

      </section>

      {/* 3. B2B & C2C INCENTIVE */}
      <RecruiterFeatures />

      {/* 4. FINAL CTA (B2B Footer) */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <div className="flex justify-center mb-6">
                 <div className="bg-slate-800 p-3 rounded-2xl">
                    <Star className="text-primary fill-primary" size={32} />
                 </div>
              </div>
              <h2 className="text-4xl font-heading font-extrabold text-white mb-6">Trouvez la perle rare</h2>
              <p className="text-slate-300 mb-10 text-xl font-light">
                  Rejoignez la communauté Rise pour dénicher les pépites de demain ou simplement obtenir de l'aide au quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user?.role !== 'student' && <button type="button" onClick={() => publish(user?.role === 'individual' ? 'individual' : 'company')} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1">
                      {user?.role === 'individual' ? 'Déposer une annonce' : 'Publier une offre'}
                  </button>}
                  <button type="button" onClick={() => navigate('/about')} className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
                      Comment ça marche ?
                  </button>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Companies;
