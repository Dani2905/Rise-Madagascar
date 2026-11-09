import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../JobCard';
import { Job } from '../../types';
import { MOCK_JOBS } from '../../data/jobsData';

const FeaturedSection: React.FC = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  useEffect(() => {
      // 1. Récupérer les jobs dynamiques (localStorage)
      const customJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      
      // 2. Fusionner avec les mocks
      // On met les customJobs en premier car ce sont les plus récents "utilisateur"
      const allJobs = [...customJobs, ...MOCK_JOBS];

      // 3. Garder les 3 premiers (ou 6 selon design)
      setFeaturedJobs(allJobs.slice(0, 3));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                  <h2 className="text-3xl font-heading font-bold text-gray-900">Opportunités Récentes</h2>
                  <p className="text-gray-500 mt-2">
                      Dernières offres publiées : Stages entreprises, missions ponctuelles et offres de particuliers.
                  </p>
              </div>
              <button onClick={() => navigate('/search')} className="text-primary font-medium hover:text-yellow-700 flex items-center gap-1 transition-colors whitespace-nowrap">
                  Tout voir <ArrowRight size={18} />
              </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs.length > 0 ? (
                  featuredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                  ))
              ) : (
                  <p>Chargement des offres...</p>
              )}
          </div>
      </div>
    </section>
  );
};

export default FeaturedSection;