import React from 'react';
import { ArrowRight, MapPin, Globe, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Company } from '../../data/companiesData';
import { getWebsiteUrl } from '../../utils/website';

interface CompanyCardProps {
  company: Company;
  fromDirectory?: string;
  followAction?: React.ReactNode;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, fromDirectory, followAction }) => {
  const profilePath = `/companies/${encodeURIComponent(String(company.id))}`;
  const state = fromDirectory ? { fromDirectory } : undefined;
  const website = getWebsiteUrl(company.website);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo */}
            <Link to={profilePath} state={state} aria-label={`Voir le profil de ${company.name}`}
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border border-gray-100 p-1 bg-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform cursor-pointer"
            >
                <div className="relative w-full h-full flex items-center justify-center bg-yellow-50 text-yellow-700"><Building2 size={26} />{company.logoUrl && <img src={company.logoUrl} alt="" className="absolute inset-0 w-full h-full object-contain bg-white rounded-lg" onError={e => { e.currentTarget.style.display = 'none'; }} />}</div>
            </Link>
            {/* Content */}
            <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-xl font-heading font-bold text-slate-900 group-hover:text-primary transition-colors"><Link to={profilePath} state={state}>{company.name}</Link></h3>
                    <span className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                        {company.sector}
                    </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {company.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-1.5 text-primary" />
                        {company.location}
                    </div>
                    {website && <div className="hidden sm:flex items-center">
                        <Globe size={14} className="mr-1.5 text-primary" />
                        <a href={website} target="_blank" rel="noreferrer" className="hover:text-slate-900 hover:underline">
                            {company.website}
                        </a>
                    </div>}
                </div>
            </div>
            {/* Action */}
            <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
                <Link 
                    to={`${profilePath}${company.jobs > 0 ? "?view=offers" : ""}`}
                    state={state}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                >
                    {company.jobs > 0 ? `Voir ${company.jobs} ${company.jobs > 1 ? 'offres actives' : 'offre active'}` : 'Voir le profil'}
                    <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <div className="mt-2">{followAction}</div>
            </div>
        </div>
    </div>
  );
};

export default CompanyCard;