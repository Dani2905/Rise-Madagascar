import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProjectsFeed from '../components/resources/ProjectsFeed';
import ProjectSubmissionForm from '../components/resources/ProjectSubmissionForm';
import FaqSection from '../components/resources/FaqSection';

const Resources: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const filterCategory = params.get('category') || 'Tous';
  const searchTerm = params.get('q') || '';
  const filterNeed = params.get('need') || '';

  // Les anciens liens vers l'onglet guides restent valides et ouvrent les projets.
  useEffect(() => {
    if (!params.has('tab')) return;
    const next = new URLSearchParams(params);
    next.delete('tab');
    setParams(next, { replace: true });
  }, [params, setParams]);

  const setFilterCategory = (category: string) => {
    const next = new URLSearchParams(params);
    next.delete('tab');
    if (category === 'Tous') next.delete('category'); else next.set('category', category);
    setParams(next);
  };

  const setSearchTerm = (value: string) => {const next=new URLSearchParams(params); if(value) next.set('q',value);else next.delete('q');setParams(next,{replace:true});};
  const setFilterNeed = (value: string) => {const next=new URLSearchParams(params); if(value) next.set('need',value);else next.delete('need');setParams(next);};
  const resetProjectFilters = () => {const next=new URLSearchParams(params);['q','category','need'].forEach(key=>next.delete(key));setParams(next);};

  return (
    <div className="min-h-screen bg-[#f6f7f4]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-9 sm:px-6 sm:pt-12 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-700">La communauté Rise</p><h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Projets étudiants</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">Découvrez les idées des étudiants et les soutiens qu’ils recherchent.</p></div>
          <div className="flex flex-wrap items-center gap-3"><Link to="/projects/exemple-projet" state={{fromResources: `/resources${params.toString() ? `?${params.toString()}` : ''}`}} className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-amber-400">Voir un exemple complet</Link><ProjectSubmissionForm /></div>
        </header>
        <ProjectsFeed filterCategory={filterCategory} setFilterCategory={setFilterCategory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterNeed={filterNeed} setFilterNeed={setFilterNeed} resetFilters={resetProjectFilters} />
        <details className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 py-5"><summary className="cursor-pointer text-sm font-bold text-slate-700">Questions sur les projets</summary><FaqSection /></details>
      </div>
    </div>
  );
};

export default Resources;
