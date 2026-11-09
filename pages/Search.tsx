
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_JOBS } from '../data/jobsData';
import { SearchHeader } from '../components/search/SearchHeader';
import { FilterSidebar, SearchFiltersState } from '../components/search/FilterSidebar';
import { MobileFilterDrawer } from '../components/search/MobileFilterDrawer';
import { JobList } from '../components/search/JobList';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [allJobs, setAllJobs] = useState(MOCK_JOBS);
  
  const [filters, setFilters] = useState<SearchFiltersState>({
    locations: [],
    types: [],
    sectors: [],
    remote: false,
    urgent: false
  });

  // 1. Initialiser la recherche si un paramètre d'URL est présent (venant de l'Accueil)
  useEffect(() => {
      const query = searchParams.get('q');
      if (query) {
          setSearchTerm(query);
      }
  }, [searchParams]);

  // 2. Charger les jobs personnalisés (publiés par les recruteurs) au montage
  useEffect(() => {
      let customJobs = [];
      try {
          const storedJobs = localStorage.getItem('rise_jobs');
          customJobs = storedJobs ? JSON.parse(storedJobs) : [];
          if (!Array.isArray(customJobs)) customJobs = [];
      } catch (error) {
          console.error("Erreur lecture jobs", error);
          customJobs = [];
      }

      if (customJobs.length > 0) {
          // Fusionner en évitant les doublons (bien que les IDs soient différents)
          const mergedJobs = [...customJobs, ...MOCK_JOBS];
          setAllJobs(mergedJobs);
      }
  }, []);

  const handleCheckboxChange = (category: keyof SearchFiltersState, value: string) => {
    setFilters(prev => {
      // @ts-ignore
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const toggleBooleanFilter = (category: 'remote' | 'urgent') => {
    setFilters(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const resetFilters = () => {
      setSearchTerm('');
      setFilters({ 
          locations: [], 
          types: [], 
          sectors: [], 
          remote: false, 
          urgent: false 
        });
  };

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filters.locations.length === 0 || filters.locations.some(loc => job.location.includes(loc));
    const matchesType = filters.types.length === 0 || filters.types.some(type => job.type === type);
    
    const matchesRemote = !filters.remote || job.remote;
    const matchesUrgent = !filters.urgent || job.isUrgent;

    return matchesSearch && matchesLocation && matchesType && matchesRemote && matchesUrgent;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HEADER SECTION */}
      <SearchHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onMobileFilterClick={() => setIsMobileFilterOpen(true)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS - DESKTOP */}
          <FilterSidebar 
            filters={filters} 
            handleCheckboxChange={handleCheckboxChange} 
            toggleBooleanFilter={toggleBooleanFilter}
            resetFilters={resetFilters} 
          />

          {/* MOBILE FILTERS DRAWER */}
          <MobileFilterDrawer 
            isOpen={isMobileFilterOpen} 
            onClose={() => setIsMobileFilterOpen(false)} 
            filters={filters} 
            handleCheckboxChange={handleCheckboxChange} 
            toggleBooleanFilter={toggleBooleanFilter}
          />

          {/* MAIN RESULTS CONTENT */}
          <JobList 
            jobs={filteredJobs} 
            onReset={resetFilters} 
          />

        </div>
      </div>
    </div>
  );
};

export default Search;
