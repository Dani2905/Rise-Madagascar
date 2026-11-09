import { PROVINCES } from '../../utils/provinces';
import React, { useState } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, Briefcase, MapPin, RefreshCw, Globe, Sparkles } from 'lucide-react';

export interface SearchFiltersState {
  locations: string[];
  types: string[];
  sectors: string[];
  remote: boolean;
  urgent: boolean;
}

interface FilterSidebarProps {
  filters: SearchFiltersState;
  handleCheckboxChange: (category: keyof SearchFiltersState, value: string) => void;
  toggleBooleanFilter?: (category: 'remote' | 'urgent') => void;
  resetFilters: () => void;
}

const FilterSection = ({ 
  title, 
  icon: Icon,
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: any;
  isOpen: boolean; 
  onToggle: () => void; 
  children?: React.ReactNode 
}) => (
  <div className="py-5 border-b border-slate-100 last:border-0">
    <button 
      type="button"
      aria-expanded={isOpen}
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left mb-4 group"
    >
      <div className="flex items-center gap-2.5 text-slate-800">
        <div className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded-md group-hover:bg-primary/10 group-hover:text-amber-500 transition-colors">
          <Icon size={16} />
        </div>
        <span className="font-bold text-xs uppercase tracking-wider text-slate-700 font-heading group-hover:text-slate-900 transition-colors">{title}</span>
      </div>
      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
    </button>
    {isOpen && <div>{children}</div>}
  </div>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  handleCheckboxChange, 
  toggleBooleanFilter, 
  resetFilters 
}) => {
  const [openSections, setOpenSections] = useState({
    contract: true,
    location: true,
    options: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = 
    filters.locations.length > 0 || 
    filters.types.length > 0 || 
    filters.remote || 
    filters.urgent;

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-[170px] space-y-6">
        
        {/* Main Filter Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-heading font-black text-sm text-slate-800 flex items-center gap-2.5 uppercase tracking-wider">
              <SlidersHorizontal size={16} className="text-slate-600" /> Filtres
            </h2>
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="text-xs font-bold text-red-500 hover:text-white flex items-center gap-1.5 hover:bg-red-500 border border-transparent hover:border-red-500 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <RefreshCw size={11} className="animate-spin-once" /> Effacer ({
                  (filters.locations.length) + 
                  (filters.types.length) + 
                  (filters.remote ? 1 : 0) + 
                  (filters.urgent ? 1 : 0)
                })
              </button>
            )}
          </div>

          <div className="px-5">
            {/* Options binaires (Remote & Urgent) */}
            <FilterSection 
              title="Préférences d'offres" 
              icon={Sparkles}
              isOpen={openSections.options} 
              onToggle={() => toggleSection('options')}
            >
              <div className="space-y-4 pt-1 pb-2">
                {/* Switch 1: Remote */}
                <div className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${filters.remote ? 'bg-primary/10 border-primary/20 text-yellow-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Globe size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">Télétravail</div>
                      <div className="text-[10px] text-slate-400 font-semibold">100% à distance</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch" aria-label="Télétravail à 100 %" aria-checked={filters.remote}
                    onClick={() => toggleBooleanFilter?.('remote')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      filters.remote ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        filters.remote ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Urgent */}
                <div className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${filters.urgent ? 'bg-red-50 border-red-100 text-red-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">Urgentes</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Besoins immédiats</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch" aria-label="Offres urgentes" aria-checked={filters.urgent}
                    onClick={() => toggleBooleanFilter?.('urgent')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      filters.urgent ? 'bg-red-500' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        filters.urgent ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </FilterSection>

            {/* Contrat - Pill Style */}
            <FilterSection 
              title="Type de contrat" 
              icon={Briefcase}
              isOpen={openSections.contract} 
              onToggle={() => toggleSection('contract')}
            >
              <div className="flex flex-wrap gap-2 pt-1 pb-2">
                {['Stage', 'Alternance', 'Job étudiant', 'Mission', 'Freelance', 'CDD', 'CDI'].map(type => {
                  const isSelected = filters.types.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleCheckboxChange('types', type)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-black' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Location - Icon List */}
            <FilterSection 
              title="Province" 
              icon={MapPin}
              isOpen={openSections.location} 
              onToggle={() => toggleSection('location')}
            >
              <div className="space-y-1 pt-1">
                {PROVINCES.map(city => {
                  const isSelected = filters.locations.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleCheckboxChange('locations', city)}
                      className={`flex items-center justify-between w-full p-2.5 rounded-xl cursor-pointer transition-all border text-left ${
                        isSelected 
                          ? 'bg-primary/5 border-primary/30 text-slate-900' 
                          : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} className={isSelected ? 'text-amber-500' : 'text-slate-400'} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{city}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-primary bg-primary text-slate-950' : 'border-slate-200 bg-white'
                      }`}>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </FilterSection>
            
            {/* Extra padding */}
            <div className="pb-5"></div>
          </div>
        </div>

        {/* Dynamic promotional visual card inside sidebar */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-6 translate-x-6 pointer-events-none"></div>
          <p className="text-[10px] font-black tracking-widest text-primary uppercase mb-2">Rise Booster</p>
          <h3 className="text-sm font-heading font-black tracking-tight leading-snug mb-2">Prêt à attirer les meilleurs candidats ?</h3>
          <p className="text-[11px] text-slate-300 mb-4 font-medium leading-relaxed">Publiez votre offre en moins de 2 minutes et recevez des candidatures qualifiées directement sur votre tableau de bord.</p>
          <a href="#/profile?tab=post-job" className="inline-flex items-center justify-center w-full py-2.5 bg-primary hover:bg-yellow-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0">
            Publier une offre
          </a>
        </div>
      </div>
    </aside>
  );
};
