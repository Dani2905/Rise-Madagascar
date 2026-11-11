import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResourcesHero from '../components/resources/ResourcesHero';
import ProcessSteps from '../components/resources/ProcessSteps';
import ProjectsFeed from '../components/resources/ProjectsFeed';
import ProjectSubmissionForm from '../components/resources/ProjectSubmissionForm';
import FaqSection from '../components/resources/FaqSection';

const Resources: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const filterCategory = params.get('category') || 'Tous';

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

  return (
    <div className="min-h-screen bg-slate-50">
      <ResourcesHero />
      <ProcessSteps />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-6">Projets étudiants</h2>
        <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
          <ProjectsFeed filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
          <ProjectSubmissionForm />
        </div>
        <FaqSection />
      </div>
    </div>
  );
};

export default Resources;
