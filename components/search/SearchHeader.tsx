import React from 'react';
import { Search as SearchIcon, Filter, X, MapPin } from 'lucide-react';
import { PROVINCES } from '../../utils/provinces';

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  locations: string[];
  setProvince: (province: string) => void;
  onMobileFilterClick: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ searchTerm, setSearchTerm, locations, setProvince, onMobileFilterClick }) => {
  const selected = locations.length > 1 ? '__multiple__' : (locations[0] || '');
  const knownProvince = PROVINCES.some(province => province === selected);
  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-grow flex items-center bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
            <div className="pl-4 text-gray-400"><SearchIcon size={20} /></div>
            <input type="search" aria-label="Rechercher une offre" className="w-full pl-3 pr-10 py-3.5 bg-transparent border-0 focus:ring-0 text-slate-900 placeholder-slate-500 font-medium text-base outline-none"
              placeholder="Stage, métier, entreprise, ville..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} aria-label="Effacer la recherche"
                className="absolute right-3 p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="hidden md:flex relative items-center bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-colors">
            <div className="pl-4 text-gray-400"><MapPin size={20} /></div>
            <select aria-label="Province" value={selected} onChange={(e) => setProvince(e.target.value)}
              className="w-52 pl-3 pr-4 py-3.5 bg-transparent border-0 focus:ring-0 text-slate-900 font-medium text-base outline-none cursor-pointer">
              <option value="">Toute l'île</option>
              {locations.length > 1 && <option value="__multiple__" disabled>Plusieurs provinces</option>}
              {locations.length === 1 && !knownProvince && <option value={selected}>{selected}</option>}
              {PROVINCES.map(province => <option value={province} key={province}>{province}</option>)}
            </select>
          </div>
          <button type="button" aria-label="Ouvrir les filtres" className="lg:hidden flex items-center justify-center p-3.5 bg-primary text-slate-900 rounded-2xl font-bold shadow-sm transition-all active:scale-95 shrink-0" onClick={onMobileFilterClick}>
            <Filter size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Les résultats se mettent à jour pendant votre saisie.</p>
      </div>
    </div>
  );
};
