
import React from 'react';
import { MapPin, Globe, Calendar, Users, Building2, ShieldCheck, User, Clock } from 'lucide-react';
import { Company } from '../../data/companiesData';
import { getWebsiteUrl } from '../../utils/website';

interface CompanyHeaderProps {
  company: Company & { role?: string; registeredAt?: string };
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const website = getWebsiteUrl(company.website);
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';

  return (
    <div className="bg-white rounded-t-3xl border border-gray-100 overflow-hidden mb-8 shadow-sm">
        {/* Cover Image Section */}
        <div className="h-48 md:h-64 bg-slate-900 relative">
             {company.coverUrl ? (
                 <img src={company.coverUrl} alt="Cover" className="w-full h-full object-cover" />
             ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                </div>
             )}
        </div>

        {/* Info Bar */}
        <div className="px-6 md:px-10 pb-10 relative text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-16 md:-mt-20 mb-8 z-10 w-full relative">
                
                {/* Logo / Avatar Box */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden relative shrink-0">
                    <img 
                        src={company.logoUrl} 
                        alt={company.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Name & Quick Stats */}
                <div className="flex-1 w-full pb-2 md:pb-4">
                     <h1 className="text-3xl md:text-5xl font-heading font-black mb-3 flex flex-col md:flex-row items-center md:items-center gap-3 text-slate-900 tracking-tight leading-tight justify-center md:justify-start">
                        {company.name}

                     </h1>
                     
                     <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-500 font-medium">
                         <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${isIndividual ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {isIndividual ? 'Particulier' : company.sector}
                         </span>
                         
                         <span className="flex items-center gap-1.5">
                             <MapPin size={16} className="text-gray-400" /> {company.location}
                         </span>
                         
                         {website && !isIndividual && (
                             <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors ml-2">
                                 <Globe size={16} className="text-gray-400" /> {company.website}
                             </a>
                         )}
                     </div>
                </div>

                {/* Social Actions (Right Side) */}
                {!isIndividual && (
                    <div className="flex gap-2 mb-2 justify-center w-full md:w-auto shrink-0">
                        {company.socials?.filter(social => getWebsiteUrl(social.url)).map((social, idx) => (
                            <a 
                                key={idx} 
                                href={getWebsiteUrl(social.url)!} 
                                className="p-3 rounded-2xl bg-white border border-gray-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm transition-all"
                            >
                                {social.type === 'linkedin' && <span className="font-bold text-xs uppercase tracking-wide">in</span>}
                                {social.type === 'facebook' && <span className="font-bold text-xs uppercase tracking-wide">fb</span>}
                                {social.type === 'globe' && <Globe size={18} />}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Meta Data Grid - Conditionnel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100/60 bg-gray-50/50 -mx-6 md:-mx-10 px-6 md:px-10 pb-2">
                 {isIndividual ? (
                     // --- AFFICHAGE PARTICULIER ---
                     <>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Membre depuis</p>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={18} className="text-green-600" /> {company.registeredAt && !Number.isNaN(new Date(company.registeredAt).getTime()) ? new Date(company.registeredAt).getFullYear() : 'Non renseigné'}
                            </p>
                        </div>
                     </>
                 ) : (
                     // --- AFFICHAGE ENTREPRISE ---
                     <>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Fondation</p>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                <Calendar size={18} className="text-primary" /> {company.founded || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Taille</p>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                <Users size={18} className="text-primary" /> {company.employees || 'N/A'}
                            </p>
                        </div>
                     </>
                 )}
                 
                 {/* Commun : Compteur d'offres */}
                 <div>
                     <p className="text-xs text-gray-400 font-bold uppercase mb-1">Annonces actives</p>
                     <p className={`font-bold inline-flex px-3 py-1 rounded-lg ${isIndividual ? 'text-green-700 bg-green-50' : 'text-blue-700 bg-blue-50'}`}>
                        {company.jobs} {isIndividual ? 'besoins' : 'postes'}
                     </p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default CompanyHeader;
