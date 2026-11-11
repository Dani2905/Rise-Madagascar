import React from 'react';
import { Users, Building2, User, Search, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CompaniesHeroProps {
  activeTab: 'companies' | 'individuals';
  setActiveTab: (tab: 'companies' | 'individuals') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  availableSectors: string[];
}

const CompaniesHero: React.FC<CompaniesHeroProps> = ({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  availableSectors
}) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const registerPath = `/register?type=${activeTab === 'companies' ? 'company' : 'individual'}`;
  const matchingRole = activeTab === 'companies' ? 'company' : 'individual';
  const publish = () => navigate(user ? '/dashboard?tab=post-job' : registerPath);

  return (
    <section className="bg-white border-b border-gray-200 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                
                {/* LEFT: Intro + Search + Filters */}
                <div className="lg:col-span-7 space-y-8">
                    <div>
                        <div className="inline-flex items-center justify-center p-2 bg-yellow-50 text-yellow-700 rounded-lg mb-4 text-sm font-bold border border-yellow-100">
                            <Users size={18} className="mr-2" /> 
                            Espace Recruteurs
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
                            L'écosystème <span className="text-yellow-600">Rise Madagascar</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Connectez-vous aux recruteurs qui façonnent l'avenir. 
                            Des grandes multinationales aux particuliers à la recherche de talents ponctuels.
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex bg-slate-100 p-1 rounded-xl max-w-md">
                        <button 
                            type="button" aria-pressed={activeTab === 'companies'}
                            onClick={() => setActiveTab('companies')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                activeTab === 'companies' 
                                ? 'bg-white text-slate-900 shadow-md' 
                                : 'text-gray-500 hover:text-slate-900'
                            }`}
                        >
                            <Building2 size={16} /> Entreprises
                        </button>
                        <button 
                            type="button" aria-pressed={activeTab === 'individuals'}
                            onClick={() => setActiveTab('individuals')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                activeTab === 'individuals' 
                                ? 'bg-white text-slate-900 shadow-md' 
                                : 'text-gray-500 hover:text-slate-900'
                            }`}
                        >
                            <User size={16} /> Particuliers
                        </button>
                    </div>

                    {/* Styled Search Bar */}
                    <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex items-center transform transition-all focus-within:ring-2 focus-within:ring-primary/50">
                        <Search className="ml-4 text-gray-400 w-6 h-6 shrink-0" />
                        <input
                            type="search"
                            aria-label={activeTab === 'companies' ? 'Rechercher une entreprise' : 'Rechercher un particulier'}
                            placeholder={activeTab === 'companies' ? "Rechercher une entreprise ou un secteur..." : "Rechercher (ex: Soutien scolaire, Aide...)"}
                            className="w-full p-3 text-gray-800 bg-transparent text-base placeholder-gray-400 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Dynamic Filter Pills (Companies Only) */}
                    {activeTab === 'companies' && (
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                            {availableSectors.map(sector => (
                                <button
                                    key={sector}
                                    type="button" aria-pressed={selectedSector === sector}
                                    onClick={() => setSelectedSector(sector)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                                        selectedSector === sector 
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-slate-900'
                                    }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Company CTA Card */}
                <div className="lg:col-span-5 lg:mt-0 mt-8">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                                <Briefcase className="text-primary" size={24} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold mb-3">
                                {activeTab === 'companies' ? "Vous êtes une entreprise ?" : "Besoin d'aide perso ?"}
                            </h2>
                            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                                {activeTab === 'companies' 
                                    ? "Rejoignez l'écosystème Rise Madagascar et publiez vos offres pour les étudiants de Madagascar."
                                    : "Présentez votre besoin pour recevoir des candidatures d'étudiants."
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                {(!user || user.role === matchingRole) && (
                                    <button type="button" onClick={publish} className="w-full py-3.5 bg-primary text-slate-900 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                        {activeTab === 'companies' ? 'Publier une offre' : 'Déposer une annonce'}
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                                {!isLoggedIn && (
                                    <button type="button" onClick={() => navigate(registerPath)} className="w-full py-3.5 bg-transparent border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                        {activeTab === 'companies' ? "Créer un compte Recruteur" : "Créer un compte Particulier"}
                                    </button>
                                )}
                                {user && user.role !== 'student' && user.role !== matchingRole && <p className="text-center text-xs text-slate-400">Votre compte est un compte {user.role === 'company' ? 'entreprise' : 'particulier'}. Retrouvez vos annonces dans votre espace.</p>}
                                {user?.role === 'student' && (
                                    <div className="w-full py-3 text-center bg-white/5 rounded-xl border border-white/10 text-slate-400 text-xs">
                                        Connecté en tant qu'étudiant
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default CompaniesHero;