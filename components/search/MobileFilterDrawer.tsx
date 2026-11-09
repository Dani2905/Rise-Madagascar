import React from 'react';
import { X, Briefcase, MapPin, Globe, Sparkles } from 'lucide-react';
import { SearchFiltersState } from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFiltersState;
  handleCheckboxChange: (category: keyof SearchFiltersState, value: string) => void;
  toggleBooleanFilter?: (category: 'remote' | 'urgent') => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  handleCheckboxChange,
  toggleBooleanFilter
}) => {
  if (!isOpen) return null;

  const hasActiveFilters = 
    filters.locations.length > 0 || 
    filters.types.length > 0 || 
    filters.remote || 
    filters.urgent;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white z-10 shrink-0">
          <div>
            <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">Filtres de recherche</h2>
            {hasActiveFilters && (
              <p className="text-[11px] text-slate-500 font-bold">
                Certains filtres sont actifs
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Options binaires (Remote & Urgent) */}
          <div>
            <h3 className="font-heading font-black mb-3 text-xs uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Sparkles size={14} /> Préférences d'offres
            </h3>
            <div className="space-y-4 pt-1">
              {/* Télétravail */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Globe size={16} className={filters.remote ? 'text-yellow-600' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">Télétravail</div>
                    <div className="text-[10px] text-slate-400 font-semibold">100% à distance</div>
                  </div>
                </div>
                <button
                  type="button"
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

              {/* Urgentes */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className={filters.urgent ? 'text-red-500' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">Urgentes</div>
                    <div className="text-[10px] text-slate-400 font-semibold font-medium">Besoins immédiats</div>
                  </div>
                </div>
                <button
                  type="button"
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
          </div>

          {/* Contrats */}
          <div>
            <h3 className="font-heading font-black mb-3 text-xs uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Briefcase size={14} /> Contrats
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Stage', 'Alternance', 'Job étudiant', 'Mission', 'Freelance', 'CDD', 'CDI'].map(type => {
                const isSelected = filters.types.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleCheckboxChange('types', type)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-250 ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-102' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Localisation */}
          <div>
            <h3 className="font-heading font-black mb-3 text-xs uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <MapPin size={14} /> Localisation
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara'].map(city => {
                const isSelected = filters.locations.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCheckboxChange('locations', city)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left truncate ${
                      isSelected 
                        ? 'bg-primary/10 text-slate-900 border-primary/30 font-black' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin size={12} className={isSelected ? 'text-amber-500' : 'text-slate-400'} />
                    <span className="truncate">{city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white shadow-xl shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-primary hover:bg-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Appliquer les Filtres
          </button>
        </div>
      </div>
    </div>
  );
};
