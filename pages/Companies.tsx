
import React, { useState, useEffect } from 'react';
import { Filter, Building2, Home, Star } from 'lucide-react';
import { ALL_COMPANIES, INDIVIDUALS, Company, Individual } from '../data/companiesData';

import CompaniesHero from '../components/companies/CompaniesHero';
import CompanyCard from '../components/companies/CompanyCard';
import IndividualCard from '../components/companies/IndividualCard';
import RecruiterFeatures from '../components/companies/RecruiterFeatures';

const Companies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'individuals'>('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('Tous');

  // État pour les données dynamiques
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [displayIndividuals, setDisplayIndividuals] = useState<Individual[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>(['Tous']);

  useEffect(() => {
      // 1. Charger la "Base de Données" avec sécurité
      let dbUsers = [];
      let allJobs = [];

      try {
          const dbUsersStr = localStorage.getItem('rise_db_users');
          dbUsers = dbUsersStr ? JSON.parse(dbUsersStr) : [];
          if(!Array.isArray(dbUsers)) dbUsers = [];
      } catch (e) { console.error(e); dbUsers = []; }

      try {
          const allJobsStr = localStorage.getItem('rise_jobs');
          allJobs = allJobsStr ? JSON.parse(allJobsStr) : [];
          if(!Array.isArray(allJobs)) allJobs = [];
      } catch (e) { console.error(e); allJobs = []; }

      // 2. Traiter les Entreprises (MOCK + DB)
      
      // A. Convertir les utilisateurs DB en format Company
      const dbCompanies: Company[] = dbUsers
          .filter((u: any) => u.role === 'company')
          .map((u: any) => {
              const activeJobsCount = allJobs.filter((j: any) => 
                  (j.ownerId && j.ownerId.toString() === u.id.toString()) && j.status === 'Actif'
              ).length;

              return {
                  id: u.id,
                  name: u.companyName || `${u.firstName} ${u.lastName}`,
                  description: u.description || "Entreprise membre de l'écosystème Rise.",
                  logoUrl: u.logoUrl || u.avatarUrl || `https://ui-avatars.com/api/?name=${u.companyName || 'C'}&background=random&color=fff`,
                  jobs: activeJobsCount,
                  sector: u.industry || 'Autre',
                  location: u.city || u.location || 'Madagascar',
                  website: u.website || '',
                  employees: u.companySize,
                  founded: "2024"
              };
          });

      // B. Filtrer les mocks pour ne pas doubler si l'ID existe déjà en DB (ex: ID 1 Telma)
      const dbIds = new Set(dbCompanies.map(c => c.id.toString()));
      const filteredMocks = ALL_COMPANIES.filter(mock => !dbIds.has(mock.id.toString()));

      // C. Fusionner (DB d'abord pour la priorité aux inscrits récents et mises à jour)
      const mergedCompanies = [...dbCompanies, ...filteredMocks];
      setDisplayCompanies(mergedCompanies);


      // 3. Traiter les Particuliers (MOCK + DB)
      const dbIndividuals: Individual[] = dbUsers
          .filter((u: any) => u.role === 'individual')
          .map((u: any) => {
               const activeAdsCount = allJobs.filter((j: any) => 
                  (j.ownerId && j.ownerId.toString() === u.id.toString()) && j.status === 'Actif'
              ).length;

              return {
                  id: u.id,
                  name: `${u.firstName} ${u.lastName}`,
                  needs: ['Aide ponctuelle'],
                  location: u.address ? `${u.address}, ${u.city}` : (u.city || u.location || 'Antananarivo'),
                  description: u.bio || "Membre de la communauté Rise.",
                  activeOffers: activeAdsCount,
                  verified: true
              };
          });
      
      // Filtrer les mocks particuliers aussi
      const dbIndIds = new Set(dbIndividuals.map(i => i.id.toString()));
      const filteredIndMocks = INDIVIDUALS.filter(mock => !dbIndIds.has(mock.id.toString()));

      setDisplayIndividuals([...dbIndividuals, ...filteredIndMocks]);

      // 4. Calculer dynamiquement les secteurs disponibles pour le filtre
      const uniqueSectors = Array.from(new Set(mergedCompanies.map(c => c.sector))).filter(Boolean);
      setAvailableSectors(['Tous', ...uniqueSectors.sort()]);

  }, []);

  const filteredCompanies = displayCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'Tous' || company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const filteredIndividuals = displayIndividuals.filter(ind => {
      return ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             ind.needs.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
         <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-gray-900">
                 {activeTab === 'companies' 
                    ? `${filteredCompanies.length} entreprise(s) trouvée(s)`
                    : `${filteredIndividuals.length} particulier(s) recrutent actuellement`
                 }
             </h2>
             {activeTab === 'companies' && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                    <Filter size={16} /> Trier par : <span className="font-semibold text-gray-900 cursor-pointer">Pertinence</span>
                </div>
             )}
         </div>

         {/* COMPANIES LIST */}
         {activeTab === 'companies' && (
             filteredCompanies.length > 0 ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                    {filteredCompanies.map(company => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
             ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <Building2 size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Aucune entreprise trouvée</h3>
                    <button 
                        onClick={() => { setSearchTerm(''); setSelectedSector('Tous'); }}
                        className="mt-4 text-primary font-bold hover:underline"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
             )
         )}

         {/* INDIVIDUALS LIST */}
         {activeTab === 'individuals' && (
             <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                {filteredIndividuals.map(ind => (
                    <IndividualCard key={ind.id} individual={ind} />
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
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                        Déposer une annonce
                    </button>
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
                  <button className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1">
                      Publier une offre (Gratuit)
                  </button>
                  <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
                      Comment ça marche ?
                  </button>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Companies;
