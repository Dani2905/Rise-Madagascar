import React from 'react';
import { Search as SearchIcon, Filter, X, MapPin } from 'lucide-react';

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onMobileFilterClick: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ searchTerm, setSearchTerm, onMobileFilterClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-grow flex items-center bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
            <div className="pl-4 text-gray-400">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              className="w-full pl-3 pr-10 py-3.5 bg-transparent border-0 focus:ring-0 text-slate-900 placeholder-slate-500 font-medium text-base outline-none"
              placeholder="Rechercher un stage, métier, mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                title="Effacer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Location / Action (Optional Desktop View) */}
          <div className="hidden md:flex relative items-center bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-colors">
             <div className="pl-4 text-gray-400">
               <MapPin size={20} />
             </div>
             <input 
               type="text" 
               className="w-48 pl-3 pr-4 py-3.5 bg-transparent border-0 focus:ring-0 text-slate-900 placeholder-slate-500 font-medium text-base outline-none cursor-not-allowed opacity-60"
               placeholder="Tout Madagascar"
               disabled
             />
          </div>

          {/* Search Button (Desktop) */}
          <button 
            className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap items-center gap-2"
          >
            Rechercher
          </button>

          {/* Mobile Filter Button */}
          <button 
            className="lg:hidden flex items-center justify-center p-3.5 bg-primary text-slate-900 rounded-2xl font-bold shadow-sm transition-all active:scale-95 shrink-0"
            onClick={onMobileFilterClick}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
