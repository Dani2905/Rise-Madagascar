import React from 'react';
import { MapPin, Clock, Banknote } from 'lucide-react';
import { Job } from '../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  layout?: 'list' | 'grid';
}

const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

const stripHtml = (text: string): string =>
  text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const JobCard: React.FC<JobCardProps> = ({ job, layout = 'list' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGrid = layout === 'grid';

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Stage':
        return 'bg-amber-50 text-amber-800 border-amber-200/60';
      case 'Alternance':
        return 'bg-purple-50 text-purple-800 border-purple-200/60';
      case 'Job étudiant':
        return 'bg-blue-50 text-blue-800 border-blue-200/60';
      case 'Mission':
        return 'bg-rose-50 text-rose-800 border-rose-200/60';
      case 'Freelance':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
    }
  };

  const postedLabel = job.createdAt && Number.isFinite(Date.parse(job.createdAt)) ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: 'Indian/Antananarivo' }).format(new Date(job.createdAt)) : job.postedAt || (job as any).posted || 'Date non renseignée';
  const cleanDescription = job.description ? stripHtml(job.description) : '';
  const filteredTags = (job.tags || [])
    .filter((tag) => tag && tag.toLowerCase() !== (job.type || '').toLowerCase())
    .slice(0, 3);

  const jobPath = `/jobs/${encodeURIComponent(String(job.id))}`;
  const origin = location.pathname === '/search'
    ? { fromSearch: `${location.pathname}${location.search}` }
    : /^\/companies\/[^/]+$/.test(location.pathname)
      ? { fromCompany: `${location.pathname}${location.search}`, fromDirectory: location.state?.fromDirectory }
      : undefined;
  const openJob = () => navigate(jobPath, { state: origin });

  if (isGrid) {
    return (
      <div className="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
        {/* Decorative tiny accent stripe */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Header: Logo + Title + Badges */}
        <div className="flex items-start gap-3.5 mb-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 p-0.5">
            <img
              src={job.logoUrl || DEFAULT_LOGO}
              alt={job.company}
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_LOGO;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {job.isDemo && <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">Exemple de démonstration</span>}
              {job.isUrgent && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                  Urgent
                </span>
              )}
              {job.remote && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-700 uppercase tracking-wide">
                  Télétravail
                </span>
              )}
            </div>

            <Link to={jobPath} state={origin}
              className="font-heading font-black text-slate-900 leading-snug group-hover:text-yellow-600 cursor-pointer transition-colors text-base tracking-tight break-words line-clamp-2"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {/* Metadata (Company • Location • Salary) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 text-xs sm:text-sm text-slate-600 min-w-0">
          <span className="font-bold text-slate-800 inline-flex items-center gap-1 max-w-full truncate">
            <span className="truncate">{job.company}</span>

          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 min-w-0 max-w-full">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          {job.salary && (
            <>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 shrink-0">
                <Banknote size={13} className="shrink-0" />
                {job.salary}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {cleanDescription ||
            "Une opportunité unique pour développer vos compétences. Postulez dès maintenant et contactez directement l'annonceur pour en savoir plus."}
        </p>

        {/* Badges / Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeStyle(job.type)}`}
          >
            {job.type}
          </span>
          {job.duration && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-purple-50 text-purple-700 border-purple-200">
              {job.duration}
            </span>
          )}
          {filteredTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Date + CTA */}
        <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center text-xs text-slate-500 font-medium whitespace-nowrap">
            <Clock size={14} className="mr-1.5 shrink-0" />
            {postedLabel}
          </div>

          <button
            type="button"
            onClick={openJob}
            className="px-4 py-2 rounded-lg text-slate-900 font-bold bg-white border border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0"
          >
            Voir l'offre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 overflow-hidden">
      {/* Decorative tiny glass ambient stripe */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Corporate Info Left Side */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 p-0.5">
          <img
            src={job.logoUrl || DEFAULT_LOGO}
            alt={job.company}
            className="w-full h-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_LOGO;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link to={jobPath} state={origin}
              className="font-heading font-black text-slate-900 leading-tight group-hover:text-yellow-600 cursor-pointer transition-colors text-base md:text-lg tracking-tight break-words"
            >
              {job.title}
            </Link>
            {job.isDemo && <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">Exemple de démonstration</span>}
            {job.isUrgent && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                Urgent
              </span>
            )}
            {job.remote && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-700 uppercase tracking-wide">
                Télétravail
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 text-sm text-slate-600">
            <span className="font-bold text-slate-800 inline-flex items-center gap-1.5">
              <span>{job.company}</span>

            </span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            {job.salary && (
              <>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 font-semibold text-emerald-600 shrink-0">
                  <Banknote size={14} className="shrink-0" />
                  {job.salary}
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {cleanDescription ||
              "Une opportunité unique pour développer vos compétences. Postulez dès maintenant et contactez directement l'annonceur pour en savoir plus."}
          </p>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeStyle(job.type)}`}
            >
              {job.type}
            </span>
            {job.duration && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-purple-50 text-purple-700 border-purple-200">
                {job.duration}
              </span>
            )}
            {filteredTags.map((tag) => (
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
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 md:w-32 shrink-0 md:bg-transparent bg-slate-50 md:p-0 p-3 -mx-5 -mb-5 md:mx-0 md:mb-0 border-t md:border-t-0 border-slate-100">
        <div className="flex items-center text-xs text-slate-500 font-medium whitespace-nowrap">
          <Clock size={14} className="mr-1.5 shrink-0" />
          {postedLabel}
        </div>

        <button
          type="button"
          onClick={openJob}
          className="px-4 py-2 md:mt-auto rounded-lg text-slate-900 font-bold bg-white border border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all text-sm whitespace-nowrap"
        >
          Voir l'offre
        </button>
      </div>
    </div>
  );
};

export default JobCard;
