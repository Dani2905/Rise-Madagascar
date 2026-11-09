import React, { useState, useEffect } from 'react';
import { getJobRelevance, getJobTimestamp } from '../../utils/jobSearch';
import { RefreshCcw, FilterX } from 'lucide-react';
import JobCard from '../JobCard';
import { Job } from '../../types';

interface JobListProps {
  jobs: Job[];
  onReset: () => void;
  query: string;
  resetKey: string;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onReset, query, resetKey }) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'recent'>('relevance');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => { setVisibleCount(10); }, [resetKey, sortBy]);

  const sortedJobs = [...jobs].sort((a, b) => {
    const byDate = getJobTimestamp(b) - getJobTimestamp(a);
    return sortBy === 'recent' ? byDate : getJobRelevance(b, query) - getJobRelevance(a, query) || byDate;
  });

  const visibleJobs = sortedJobs.slice(0, visibleCount);

  return (
    <main className="flex-1 min-w-0">
      
      {/* Top Bar Info & Sorting Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-semibold text-sm">
          Résultats : <span className="font-extrabold text-slate-900 bg-primary/20 p-1 px-2 rounded-lg">{jobs.length}</span> {jobs.length === 1 ? "opportunité correspondante" : "opportunités correspondantes"}
        </p>
        
        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-end">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Trier par :</span>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setSortBy('relevance')}
              aria-pressed={sortBy === 'relevance'}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'relevance' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pertinence
            </button>
            <button 
              onClick={() => setSortBy('recent')}
              aria-pressed={sortBy === 'recent'}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'recent' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Plus récentes
            </button>
          </div>
        </div>
      </div>

      {sortBy === 'recent' && <p className="text-xs text-slate-500 -mt-5 mb-5">Les offres sans date de publication vérifiable apparaissent en dernier.</p>}
      {/* Main Results Grid */}
      {sortedJobs.length > 0 ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-slate-100 animate-fade-in flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100 shadow-inner">
            <FilterX className="text-rose-500" size={38} />
          </div>
          <h3 className="text-2xl font-heading font-black text-slate-900 mb-3 tracking-tight">Aucun résultat trouvé</h3>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm max-w-md">
            Il n'y a pas d'offres ou de missions actives correspondant exactement à vos critères de recherche pour le moment. Essayez d'élargir votre sélection ou réinitialisez les filtres.
          </p>
          <button 
            onClick={onReset}
            className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Réinitialiser tous les filtres
          </button>
        </div>
      )}
      
      {sortedJobs.length > 0 && (
        <div className="mt-14 text-center border-t border-slate-200/50 pt-10">
          {visibleJobs.length < sortedJobs.length ? (
            <>
              <p className="text-xs text-slate-400 font-bold mb-4">{visibleJobs.length} offres affichées sur {sortedJobs.length}</p>
              <button type="button" onClick={() => setVisibleCount(count => count + 10)}
                className="px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 text-xs font-black rounded-2xl transition-all shadow-md uppercase tracking-widest">
                Charger plus d'opportunités
              </button>
            </>
          ) : <p className="text-xs text-slate-400 font-bold">Vous êtes arrivé à la fin des résultats.</p>}
        </div>
      )}
    </main>
  );
};
