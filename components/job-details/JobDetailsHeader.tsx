import React from 'react';
import { Clock, Building2, MapPin, Banknote } from 'lucide-react';

interface JobDetailsHeaderProps {
  job: {
    title: string;
    company: string;
    location: string;
    type: string;
    duration?: string;
    salary?: string;
    postedAt: string;
    logoUrl: string;
    isDemo?: boolean;
  };
}

const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-white p-1">
            {job.logoUrl ? <img src={job.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : <span className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-600">{(job.company || 'R').slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {job.type}
                </span>
                {job.isDemo && <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Exemple de démonstration</span>}
                {job.duration && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {job.duration}
                    </span>
                )}
                <span className="flex items-center text-xs font-medium text-gray-500">
                    <Clock size={14} className="mr-1" /> Publié {job.postedAt}
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 mb-2">
                {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1.5">
                    <Building2 size={16} className="text-gray-400" /> {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" /> {job.location}
                </span>
                {job.salary && <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    <Banknote size={16} /> {job.salary}
                </span>}
            </div>
        </div>
        </div>
    </div>
  );
};

export default JobDetailsHeader;