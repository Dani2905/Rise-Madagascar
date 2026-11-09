import React from 'react';
import { MapPin, Clock, ArrowRight, Banknote, Sparkles, Globe, Shield } from 'lucide-react';
import { Job } from '../types';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  
  const getBadgeStyle = (type: string) => {
    switch (type) {
        case 'Stage': return 'bg-amber-50 text-amber-800 border-amber-200/60';
        case 'Alternance': return 'bg-purple-50 text-purple-800 border-purple-200/60';
        case 'Job étudiant': return 'bg-blue-50 text-blue-800 border-blue-200/60';
        case 'Mission': return 'bg-rose-50 text-rose-800 border-rose-200/60';
        case 'Freelance': return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
        default: return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
    }
  };

  const isVerifiedOwner = job.ownerId ? true : false;

  return (    <div className="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 overflow-hidden">
      
      {/* Decorative tiny glass ambient stripe */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Corporate Info Left Side */}
      <div className="flex items-start gap-4 flex-grow">
        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 p-0.5">
           <img 
             src={job.logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"} 
             alt={job.company} 
             className="w-full h-full object-cover rounded-lg" 
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-1">
             <h3 
               onClick={() => navigate(`/jobs/${job.id}`)}
               className="font-heading font-black text-slate-900 leading-tight group-hover:text-primary cursor-pointer transition-colors text-base md:text-lg tracking-tight"
             >
               {job.title}
             </h3>
             {job.isUrgent && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                    Urgent
                </span>
             )}
             {job.remote && (
                 <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-700 uppercase tracking-wide">
                    Remote
                </span>
             )}
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
            <span className="font-bold text-slate-800">{job.company}</span>
            {isVerifiedOwner && (
              <Shield size={14} className="text-emerald-500" title="Annonceur vérifié" />
            )}
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
               <MapPin size={14} className="text-slate-400" />
               <span className="truncate">{job.location}</span>
            </div>
            {job.salary && (
               <>
                 <span className="text-slate-300">•</span>
                 <div className="flex items-center gap-1 font-semibold text-emerald-600">
                   <Banknote size={14} />
                   {job.salary}
                 </div>
               </>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {job.description || "Une opportunité unique pour développer vos compétences. Postulez dès maintenant et contactez directement l'annonceur pour en savoir plus."}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeStyle(job.type)}`}>
              {job.type}
            </span>
            {job.duration && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-purple-50 text-purple-700 border-purple-200">
                {job.duration}
              </span>
            )}
            {job.tags && job.tags.filter(tag => tag !== job.type).slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Actions & Time */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:w-32 shrink-0 md:bg-transparent bg-slate-50 md:p-0 p-3 -mx-5 -mb-5 md:mx-0 md:mb-0">
        <div className="flex items-center text-xs text-slate-500 font-medium whitespace-nowrap hidden md:flex">
          <Clock size={14} className="mr-1.5" />
          {job.postedAt}
        </div>
        
        <button 
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="flex-grow md:flex-grow-0 px-4 py-2 mt-auto rounded-lg text-slate-900 font-bold bg-white border border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all text-sm w-full md:w-auto text-center"
        >
          Voir l'offre
        </button>
      </div>
    </div>
  );
};

export default JobCard;
