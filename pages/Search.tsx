import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAvailableJobs, matchesJobQuery } from '../utils/jobSearch';
import { matchesLocation } from '../utils/provinces';
import { SearchHeader } from '../components/search/SearchHeader';
import { FilterSidebar, SearchFiltersState } from '../components/search/FilterSidebar';
import { MobileFilterDrawer } from '../components/search/MobileFilterDrawer';
import { JobList } from '../components/search/JobList';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [allJobs, setAllJobs] = useState(getAvailableJobs);
  const closeMobileFilters = useCallback(() => setIsMobileFilterOpen(false), []);

  // L'URL est la source de vérité : actualisation, partage et retour navigateur
  // conservent la recherche et tous les filtres, y compris les sélections multiples.
  const searchTerm = searchParams.get('q') || '';
  const filters: SearchFiltersState = {
    locations: searchParams.getAll('loc').filter(Boolean),
    types: searchParams.getAll('type').filter(Boolean),
    sectors: [],
    remote: searchParams.get('remote') === 'true',
    urgent: searchParams.get('urgent') === 'true'
  };

  useEffect(() => {
    const refreshJobs = () => setAllJobs(getAvailableJobs());
    window.addEventListener('storage', refreshJobs);
    window.addEventListener('focus', refreshJobs);
    return () => {
      window.removeEventListener('storage', refreshJobs);
      window.removeEventListener('focus', refreshJobs);
    };
  }, []);

  const updateParams = (update: (params: URLSearchParams) => void, replace = false) => {
    const params = new URLSearchParams(searchParams);
    update(params);
    setSearchParams(params, { replace });
  };

  const setSearchTerm = (value: string) => updateParams(params => {
    if (value) params.set('q', value);
    else params.delete('q');
  }, true);

  const handleCheckboxChange = (category: keyof SearchFiltersState, value: string) => {
    if (category !== 'locations' && category !== 'types') return;
    const key = category === 'locations' ? 'loc' : 'type';
    updateParams(params => {
      const existing = params.getAll(key);
      const updated = existing.includes(value) ? existing.filter(item => item !== value) : [...existing, value];
      params.delete(key);
      updated.forEach(item => params.append(key, item));
    });
  };

  const setProvince = (value: string) => updateParams(params => {
    params.delete('loc');
    if (value) params.append('loc', value);
  });

  const toggleBooleanFilter = (category: 'remote' | 'urgent') => updateParams(params => {
    if (params.get(category) === 'true') params.delete(category);
    else params.set(category, 'true');
  });

  const resetFilters = () => updateParams(params => {
    ['loc', 'type', 'remote', 'urgent'].forEach(key => params.delete(key));
  });
  const resetAll = () => setSearchParams({});

  const filteredJobs = allJobs.filter(job =>
    matchesJobQuery(job, searchTerm) &&
    (filters.locations.length === 0 || filters.locations.some(loc => matchesLocation(job.location || '', job.province, loc))) &&
    (filters.types.length === 0 || filters.types.includes(job.type)) &&
    (!filters.remote || Boolean(job.remote)) &&
    (!filters.urgent || Boolean(job.isUrgent))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SearchHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        locations={filters.locations} setProvince={setProvince}
        onMobileFilterClick={() => setIsMobileFilterOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="mb-5 text-xs text-slate-500">Version de démonstration : les annonces et candidatures locales restent dans ce navigateur. Les offres fictives sont signalées.</p>
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} handleCheckboxChange={handleCheckboxChange}
            toggleBooleanFilter={toggleBooleanFilter} resetFilters={resetFilters} />
          <MobileFilterDrawer isOpen={isMobileFilterOpen} onClose={closeMobileFilters}
            filters={filters} handleCheckboxChange={handleCheckboxChange}
            toggleBooleanFilter={toggleBooleanFilter} resetFilters={resetFilters} />
          <JobList jobs={filteredJobs} onReset={resetAll} query={searchTerm} resetKey={searchParams.toString()} />
        </div>
      </div>
    </div>
  );
};

export default Search;
