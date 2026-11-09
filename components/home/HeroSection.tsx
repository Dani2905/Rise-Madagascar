import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ArrowRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROVINCES } from '../../utils/provinces';
import { getAvailableJobs, getJobSuggestions } from '../../utils/jobSearch';
import { Job } from '../../types';
import RegisteredCompaniesStrip from './RegisteredCompaniesStrip';

const PLACEHOLDERS = [
  "Marketing à Antananarivo...",
  "Stage Informatique...",
  "Job d'été...",
  "Freelance Design...",
  "Cours de Maths à domicile..."
];

const HERO_SLIDES = [
  {
    audience: "Étudiants",
    line1Prefix: "Trouvez un ",
    line1Highlight: "stage",
    line1Suffix: " ou job",
    line2Prefix: "et publiez ",
    line2Highlight: "votre projet"
  },
  {
    audience: "Entreprises",
    line1Prefix: "Recrutez des ",
    line1Highlight: "étudiants",
    line1Suffix: "",
    line2Prefix: "et soutenez ",
    line2Highlight: "un projet"
  },
  {
    audience: "Particuliers",
    line1Prefix: "Trouvez un ",
    line1Highlight: "coup de main",
    line1Suffix: "",
    line2Prefix: "étudiant ",
    line2Highlight: "fiable"
  }
];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState("Toute l'île");
  const [activePlaceholder, setActivePlaceholder] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeadlineHovered, setIsHeadlineHovered] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);

  useEffect(() => {
    const refreshJobs = () => setAvailableJobs(getAvailableJobs());
    refreshJobs();
    window.addEventListener('storage', refreshJobs);
    window.addEventListener('focus', refreshJobs);
    return () => {
      window.removeEventListener('storage', refreshJobs);
      window.removeEventListener('focus', refreshJobs);
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'company') {
      setActiveSlide(1);
    } else if (user?.role === 'individual') {
      setActiveSlide(2);
    } else {
      setActiveSlide(0);
    }
  }, [user?.role]);

  // Rotation automatique du placeholder pour inspirer l'utilisateur
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlaceholder((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotation automatique du titre pour s'adresser aux 3 cibles (Étudiants, Entreprises, Particuliers)
  useEffect(() => {
    if (isHeadlineHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHeadlineHovered]);

  const navigateToSearch = (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedLocation && selectedLocation !== "Toute l'île") {
      params.set('loc', selectedLocation);
    }
    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : '/search');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch(searchQuery);
  };

  const suggestions = getJobSuggestions(
    availableJobs,
    selectedLocation === "Toute l'île" ? undefined : selectedLocation
  );

  const handleProjectCta = () => {
    if (user?.role === 'student') {
      navigate('/profile?tab=projects&action=new');
    } else {
      navigate('/resources');
    }
  };

  const handlePublishOfferCta = () => {
    if (user && (user.role === 'company' || user.role === 'individual')) {
      navigate('/dashboard?tab=post-job');
    } else {
      navigate('/register?type=company');
    }
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden bg-white">
      {/* Abstract Grid Background - Modern SaaS look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Blobs - Solid colors with blur instead of gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-3xl opacity-60 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-yellow-50 border border-yellow-100 text-sm font-semibold mb-4 text-yellow-800 hover:bg-yellow-100 transition-colors cursor-default animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            #1 Écosystème Jeunes Talents à Madagascar
        </div>

        {/* Audience Selector Pills (synced with rotating headline) */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-4"
          onMouseEnter={() => setIsHeadlineHovered(true)}
          onMouseLeave={() => setIsHeadlineHovered(false)}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.audience}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all border ${
                activeSlide === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white/80 text-slate-500 border-gray-200 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {slide.audience}
            </button>
          ))}
        </div>

        {/* Main Rotating Title */}
        <div
          className="min-h-[108px] md:min-h-[156px] flex items-center justify-center mb-4"
          onMouseEnter={() => setIsHeadlineHovered(true)}
          onMouseLeave={() => setIsHeadlineHovered(false)}
        >
          <h1
            key={activeSlide}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight animate-[fadeIn_0.45s_ease-out_forwards]"
          >
            {currentSlide.line1Prefix}
            <span className="text-yellow-600">{currentSlide.line1Highlight}</span>
            {currentSlide.line1Suffix}
            <br />
            {currentSlide.line2Prefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
              {currentSlide.line2Highlight}
            </span>
            .
          </h1>
        </div>
        
        <p className="mt-2 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-8 leading-relaxed animate-fade-in delay-100">
          Connectez les étudiants de Madagascar aux entreprises et particuliers pour leurs stages et missions — et trouvez des investisseurs ou collaborateurs pour vos projets.
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
                    aria-label="Rechercher une offre, un métier ou une ville"
                    placeholder={PLACEHOLDERS[activePlaceholder]}
                    className="w-full p-4 text-gray-800 bg-transparent text-lg placeholder-gray-400 focus:outline-none truncate font-medium"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               {/* Location Input */}
               <div className="flex items-center w-full md:w-1/3 px-2 border-t md:border-t-0 md:border-l border-gray-50 bg-gray-50/50 h-full py-1">
                   <MapPin className="ml-4 text-gray-400 w-5 h-5 shrink-0" />
                   <select
                     value={selectedLocation}
                     onChange={(e) => setSelectedLocation(e.target.value)}
                     aria-label="Localisation"
                     className="w-full p-4 text-gray-700 bg-transparent text-base focus:outline-none cursor-pointer appearance-none bg-none font-medium hover:text-yellow-600 transition-colors"
                   >
                       <option value="Toute l'île">Toute l'île</option>
                       {PROVINCES.map(province => <option key={province} value={province}>{province}</option>)}
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
          
          {/* Popular Searches + Double CTA (Option 3) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-6 animate-fade-in delay-200">
            {suggestions.length > 0 && (
              <div className="text-sm text-gray-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                <span>Suggestions d'offres :</span>
                {suggestions.map(({ term }) => (
                  <button key={term} type="button" onClick={() => navigateToSearch(term)} className="hover:text-yellow-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-600 rounded">
                    {term}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleProjectCta}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-white border border-gray-200 px-5 py-3 rounded-xl hover:border-primary hover:shadow-md transition-all group"
              >
                <Lightbulb size={17} className="text-yellow-600 group-hover:scale-110 transition-transform" />
                {user && user.role !== 'student' ? 'Découvrir les projets étudiants' : 'Publier un projet'}
              </button>

              {user?.role !== 'student' ? (
                <button
                  type="button"
                  onClick={handlePublishOfferCta}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 px-5 py-3 rounded-xl hover:bg-slate-800 hover:shadow-md transition-all group"
                >
                  <Building2 size={17} className="text-primary" />
                  Publier une offre (Pro / Perso)
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 px-5 py-3 rounded-xl hover:bg-slate-800 hover:shadow-md transition-all group"
                >
                  Voir toutes les offres
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
      
      <RegisteredCompaniesStrip />
    </section>
  );
};

export default HeroSection;