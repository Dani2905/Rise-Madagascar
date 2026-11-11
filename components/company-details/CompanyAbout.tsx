import React from 'react';
import { Gift, CheckCircle2, Target, Compass, HeartHandshake } from 'lucide-react';
import { Company } from '../../data/companiesData';

interface Props { company: Company & { role?: string; needs?: string[]; activities?: string; values?: string }; }
const CompanyAbout: React.FC<Props> = ({ company }) => {
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';
  const description = company.longDescription || company.description;
  return <div className="space-y-5 animate-fade-in">
    {description && <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-widest text-yellow-700">Découvrir</p><h2 className="mt-2 text-2xl font-heading font-bold text-slate-900">À propos</h2><p className="mt-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600">{description}</p></section>}
    {!isIndividual && company.activities && <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm"><h2 className="flex items-center gap-3 text-lg font-bold text-slate-900"><Compass size={20} className="text-yellow-600" /> Nos activités</h2><p className="mt-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600">{company.activities}</p></section>}
    {!isIndividual && company.values && <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm"><h2 className="flex items-center gap-3 text-lg font-bold text-slate-900"><HeartHandshake size={20} className="text-yellow-600" /> Nos valeurs</h2><p className="mt-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600">{company.values}</p></section>}
    {isIndividual && Array.isArray(company.needs) && company.needs.length > 0 && <section className="rounded-3xl border border-green-100 bg-green-50 p-6 sm:p-8"><h2 className="flex items-center gap-3 text-lg font-bold text-slate-900"><Target size={20} className="text-green-700" /> Ce que je recherche</h2><div className="mt-5 flex flex-wrap gap-2">{company.needs.map((need, i) => <span key={i} className="rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800">{need}</span>)}</div></section>}
    {!isIndividual && Array.isArray(company.perks) && company.perks.length > 0 && <section className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 sm:p-8"><h2 className="flex items-center gap-3 text-lg font-bold text-slate-900"><Gift size={20} className="text-yellow-700" /> Pourquoi nous rejoindre ?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{company.perks.map((perk, i) => <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-white p-4"><CheckCircle2 className="shrink-0 text-emerald-600" size={19} /><span className="text-sm font-medium text-slate-700">{perk}</span></div>)}</div></section>}
  </div>;
};
export default CompanyAbout;
