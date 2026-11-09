import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ArrowRight, Sparkles, UserCircle2, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaceholder, setActivePlaceholder] = useState(0);

  const placeholders = [
    "Marketing à Antananarivo...",
    "Stage Informatique...",
    "Job d'été...",
    "Freelance Design...",
    "Cours de Maths à domicile..."
  ];

  const INITIAL_PARTNERS = [
    { name: "TELMA", color: "text-slate-800" },
    { name: "ORANGE", color: "text-orange-600" },
    { name: "AXIAN", color: "text-red-600" },
    { name: "SOCIETE GENERALE", color: "text-red-500" },
    { name: "BOLLORÉ", color: "text-blue-800" },
    { name: "RAVINALA AIRPORTS", color: "text-green-600" },
    { name: "VIVETIC", color: "text-purple-600" },
    { name: "JIRAMA", color: "text-blue-500" }
  ];

  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  // Charger les partenaires dynamiques (entreprises inscrites)
  useEffect(() => {
      const dbUsersStr = localStorage.getItem('rise_db_users');
      if (dbUsersStr) {
          const dbUsers = JSON.parse(dbUsersStr);
          const newPartners = dbUsers
              .filter((u: any) => u.role === 'company' && u.companyName)
              .map((u: any) => ({
                  name: u.companyName.toUpperCase(),
                  color: "text-slate-700" // Couleur neutre pour les nouveaux
              }));
          
          // On évite les doublons simples basés sur le nom
          const uniqueNewPartners = newPartners.filter((np: any) => 
              !INITIAL_PARTNERS.some(ip => ip.name === np.name)
          );

          if (uniqueNewPartners.length > 0) {
              setPartners([...INITIAL_PARTNERS, ...uniqueNewPartners]);
          }
      }
  }, []);

  // Rotation automatique du placeholder pour inspirer l'utilisateur
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Abstract Grid Background - Modern SaaS look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Blobs - Solid colors with blur instead of gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-3xl opacity-60 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-yellow-50 border border-yellow-100 text-sm font-semibold mb-8 text-yellow-800 hover:bg-yellow-100 transition-colors cursor-default animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            #1 Plateforme Étudiante à Madagascar
        </div>

        {/* Main Title - Solid Color */}
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-slate-900 tracking-tight mb-8 leading-tight animate-fade-in">
           Trouvez un <span className="text-yellow-600">stage</span> ou<br className="hidden md:block" />
           publiez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">projet</span>.
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed animate-fade-in delay-100">
          La plateforme tout-en-un pour les étudiants : consultez des milliers d'offres de stage et donnez de la visibilité à vos projets innovants.
        </p>

        {/* Enhanced Search Bar Container */}
        <div className={`max-w-4xl mx-auto transform transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`} style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSearch} className="relative group z-20">
             {/* Solid shadow/glow effect instead of gradient */}
            <div className={`absolute -inset-1 bg-primary rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500 ${isSearchFocused ? 'opacity-40' : ''}`}></div>
            
            <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               {/* Keyword Input */}
               <div className="flex-1 flex items-center w-full md:border-r border-gray-100 px-2 py-1">
                  <Search className="ml-4 text-gray-400 w-5 h-5 shrink-0" />
                  <input
                    type="text"
                    placeholder={placeholders[activePlaceholder]}
                    className="w-full p-4 text-gray-800 bg-transparent text-lg placeholder-gray-400 focus:outline-none truncate font-medium"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               {/* Location Input (Fake dropdown for visual) */}
               <div className="hidden md:flex items-center w-1/3 px-2 border-l border-gray-50 bg-gray-50/50 h-full py-1">
                   <MapPin className="ml-4 text-gray-400 w-5 h-5 shrink-0" />
                   <select className="w-full p-4 text-gray-700 bg-transparent text-base focus:outline-none cursor-pointer appearance-none bg-none font-medium hover:text-yellow-600 transition-colors">
                       <option>Toute l'île</option>
                       <option>Antananarivo</option>
                       <option>Toamasina</option>
                       <option>Antsirabe</option>
                       <option>Remote</option>
                   </select>
               </div>

               {/* Button - Solid Color */}
               <div className="p-2 w-full md:w-auto">
                 <button
                    type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl hover:bg-slate-800 hover:scale-[1.02] transition-all font-semibold shadow-lg text-lg"
                 >
                   Rechercher
                 </button>
               </div>
            </div>
          </form>
          
          {/* Action Links */}
           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-200">
             <div className="text-sm text-gray-500 flex items-center gap-2">
                 <span>Populaire :</span>
                 <button onClick={() => navigate('/search?q=Marketing')} className="hover:text-yellow-600 hover:underline">Marketing</button>
                 <button onClick={() => navigate('/search?q=Informatique')} className="hover:text-yellow-600 hover:underline">Dev</button>
             </div>
             
             {/* Only show "Publier un projet" link if user is student or not logged in */}
             {(!user || user.role === 'student') && (
                 <>
                    <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>

                    <button 
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-2 text-sm font-bold text-slate-900 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-primary hover:shadow-md transition-all group"
                    >
                        <Lightbulb size={16} className="text-yellow-600 group-hover:scale-110 transition-transform" />
                        Vous avez une idée ? Publiez un projet
                    </button>
                 </>
             )}
          </div>
        </div>

        {/* Business & Private Individual CTA Block - HIDDEN IF STUDENT */}
        {user?.role !== 'student' && (
            <div className="mt-12 flex justify-center animate-fade-in delay-300">
                <div 
                    className="group cursor-pointer bg-white/60 backdrop-blur-md border border-gray-200 p-2 pr-6 rounded-full shadow-sm hover:shadow-lg hover:border-primary/40 transition-all flex items-center gap-4 max-w-xl"
                    onClick={() => navigate('/companies')}
                >
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-slate-900 transition-all shadow-md">
                        <div className="flex -space-x-1">
                            <Building2 size={16} />
                            <UserCircle2 size={16} className="-ml-1 text-white group-hover:text-slate-900" />
                        </div>
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            Recruteurs (Pro & Particuliers) <Sparkles size={10} className="text-yellow-500" />
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-tight">
                            Entreprise ou Besoin perso ? Publiez une offre facilement.
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        )}

      </div>
      
      {/* Logos Strip with Infinite Scroll */}
      <div className="mt-20 border-y border-gray-100 bg-slate-50/50 backdrop-blur-sm overflow-hidden py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Ils font confiance à Rise</p>
        </div>
        
        <div className="relative flex overflow-x-hidden group">
             {/* Fade Gradients at edges */}
             <div className="absolute top-0 bottom-0 left-0 w-32 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
             <div className="absolute top-0 bottom-0 right-0 w-32 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>

             {/* Scrolling Track - Duplicated content for seamless loop */}
             <div className="flex animate-scroll whitespace-nowrap hover:[animation-play-state:paused]">
                
                {/* First Set */}
                <div className="flex items-center gap-16 mx-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                   {partners.map((partner, idx) => (
                      <span key={`1-${idx}`} className={`font-heading font-extrabold text-2xl tracking-tight ${partner.color}`}>
                          {partner.name}
                      </span>
                   ))}
                </div>

                {/* Second Set (Duplicate) */}
                <div className="flex items-center gap-16 mx-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                   {partners.map((partner, idx) => (
                      <span key={`2-${idx}`} className={`font-heading font-extrabold text-2xl tracking-tight ${partner.color}`}>
                          {partner.name}
                      </span>
                   ))}
                </div>
                 {/* Third Set (Duplicate for extra width safety on large screens) */}
                 <div className="flex items-center gap-16 mx-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                   {partners.map((partner, idx) => (
                      <span key={`3-${idx}`} className={`font-heading font-extrabold text-2xl tracking-tight ${partner.color}`}>
                          {partner.name}
                      </span>
                   ))}
                </div>

             </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;