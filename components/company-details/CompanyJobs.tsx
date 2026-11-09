
import React, { useState, useEffect } from 'react';
import { Briefcase, AlertCircle, Megaphone } from 'lucide-react';
import { Job } from '../../types';
import JobCard from '../JobCard';
import { MOCK_JOBS } from '../../data/jobsData';

interface CompanyJobsProps {
  company: any; // On passe l'objet complet de l'entreprise (ou utilisateur)
}

const CompanyJobs: React.FC<CompanyJobsProps> = ({ company }) => {
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';

  useEffect(() => {
      // 1. Récupérer les jobs dynamiques (rise_jobs)
      const customJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      
      // 2. Fusionner avec les mocks (jobs statiques) pour avoir tout le pool
      const allJobs = [...customJobs, ...MOCK_JOBS];

      // 3. Filtrage Strict
      const filtered = allJobs.filter(job => {
          // Cas A : L'entreprise affichée est un utilisateur réel (ID > 1000)
          if (company.id > 1000) {
              // On check strictement l'ownerId
              if ((job as any).ownerId && (job as any).ownerId.toString() === company.id.toString()) {
                  return true;
              }
              // Fallback : check par nom exact si c'est un Mock Job assigné à un User (rare mais possible)
              return false;
          }
          
          // Cas B : L'entreprise affichée est une entreprise Mock (ID < 1000)
          // On filtre par le nom de l'entreprise (ex: "Telma")
          if (job.company && company.name) {
              return job.company.toLowerCase().trim() === company.name.toLowerCase().trim();
          }
          
          return false;
      });

      setCompanyJobs(filtered);
  }, [company]);

  return (
    <div className="space-y-6 animate-fade-in delay-200">
        <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
            {isIndividual ? <Megaphone className="text-green-600" /> : <Briefcase className="text-primary" />}
            {isIndividual ? "Annonces actives" : "Nos offres du moment"}
        </h2>

        {companyJobs.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {companyJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        ) : (
             <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucune offre active</h3>
                <p className="text-gray-500 mt-2">
                    {isIndividual ? "Ce particulier n'a pas d'annonces en cours." : "Cette entreprise n'a pas d'offres publiées pour le moment."}
                    <br /> Revenez plus tard !
                </p>
                <button className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-gray-50">
                    Créer une alerte
                </button>
            </div>
        )}
    </div>
  );
};

export default CompanyJobs;
