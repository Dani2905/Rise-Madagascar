import React from 'react';
import { Briefcase, AlertCircle, Megaphone } from 'lucide-react';
import { Job } from '../../types';
import JobCard from '../JobCard';

interface CompanyJobsProps {
  company: any;
  jobs: Job[];
}

const CompanyJobs: React.FC<CompanyJobsProps> = ({ company, jobs }) => {
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';
  return (
    <div id="offres" className="space-y-6 animate-fade-in delay-200 scroll-mt-28">
      <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
        {isIndividual ? <Megaphone className="text-green-600" /> : <Briefcase className="text-primary" />}
        {isIndividual ? 'Annonces actives' : 'Nos offres du moment'}
      </h2>
      {jobs.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map(job => <JobCard key={job.id} job={job} layout="grid" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><AlertCircle size={32} /></div>
          <h3 className="text-lg font-bold text-slate-900">Aucune offre active</h3>
          <p className="text-gray-500 mt-2">{isIndividual ? "Ce particulier n'a pas d'annonces en cours." : "Cette entreprise n'a pas d'offres actives pour le moment."}<br />Revenez plus tard !</p>
        </div>
      )}
    </div>
  );
};
export default CompanyJobs;
