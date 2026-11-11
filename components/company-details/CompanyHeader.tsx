import React from 'react';
import { ArrowDown, BriefcaseBusiness, CalendarDays, Globe, MapPin, Users, Clock } from 'lucide-react';
import { Company } from '../../data/companiesData';
import { getWebsiteUrl } from '../../utils/website';

interface Props { company: Company & { role?: string; registeredAt?: string }; followAction?: React.ReactNode; }
const CompanyHeader: React.FC<Props> = ({ company, followAction }) => {
  const website = getWebsiteUrl(company.website);
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';
  const socials = Array.isArray(company.socials) ? company.socials.filter(s => s && (['linkedin', 'facebook'].includes(s.type) || (s.type === 'globe' && !website)) && getWebsiteUrl(s.url)) : [];
  const hasFounded = !!company.founded && company.founded !== 'N/A';
  const hasEmployees = !!company.employees && company.employees !== 'N/A';
  const employeeLabel = company.employees && /^\d+(?:\s*-\s*\d+|\+)?$/.test(company.employees.trim()) ? `${company.employees} employés` : company.employees;
  const memberYear = company.registeredAt && !Number.isNaN(Date.parse(company.registeredAt)) ? new Date(company.registeredAt).getFullYear() : null;
  return <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm mb-8">
    <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden bg-slate-900">
      {company.coverUrl ? <img src={company.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"><div aria-hidden="true" className="absolute -top-24 right-0 h-72 w-72 rounded-full border border-white/10" /><div aria-hidden="true" className="absolute -bottom-40 right-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" /></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
    </div>
    <div className="px-5 sm:px-8 lg:px-10 pb-8">
      <div className="relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-7">
        <div className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">{company.logoUrl ? <img src={company.logoUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-black text-slate-700">{(company.name || 'E').slice(0, 2).toUpperCase()}</span>}</div>
        <div className="flex-1 min-w-0 sm:pb-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${isIndividual ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'}`}>{isIndividual ? 'Particulier' : 'Entreprise'}</span>{!isIndividual && company.sector && <span className="text-xs font-semibold text-slate-500">{company.sector}</span>}</div><h1 className="mt-2 break-words text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900">{company.name}</h1>{company.description && company.longDescription && company.description !== company.longDescription && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{company.description}</p>}</div>
        <div className="flex w-full shrink-0 flex-wrap items-start gap-3 sm:w-auto">{followAction}<button type="button" onClick={() => document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">Voir les {isIndividual ? 'annonces' : 'offres'} <ArrowDown size={16} /></button></div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
        {company.location && <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-slate-400" />{company.location}</span>}
        {website && <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-yellow-700"><Globe size={16} className="text-slate-400" /> Site web</a>}
        {socials.map((s, i) => <a key={`${s.type}-${i}`} href={getWebsiteUrl(s.url)!} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-700 hover:text-yellow-700">{s.type === 'linkedin' ? 'LinkedIn' : s.type === 'facebook' ? 'Facebook' : 'Site web'} <span aria-hidden="true">↗</span><span className="sr-only"> (nouvel onglet)</span></a>)}
      </div>
      <div className="mt-7 flex flex-wrap gap-x-12 gap-y-5 border-t border-slate-100 pt-6">
        {!isIndividual && hasFounded && <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Création</p><p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarDays size={16} className="text-yellow-600" />{company.founded}</p></div>}
        {!isIndividual && hasEmployees && <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Équipe</p><p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800"><Users size={16} className="text-yellow-600" />{employeeLabel}</p></div>}
        {isIndividual && memberYear && <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Membre depuis</p><p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800"><Clock size={16} className="text-green-600" />{memberYear}</p></div>}
        <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isIndividual ? 'Annonces actives' : 'Offres actives'}</p><p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800"><BriefcaseBusiness size={16} className={isIndividual ? 'text-green-600' : 'text-yellow-600'} />{company.jobs}</p></div>
      </div>
    </div>
  </div>;
};
export default CompanyHeader;
