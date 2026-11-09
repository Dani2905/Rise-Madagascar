
import React from 'react';
import { Gift, CheckCircle2, Target } from 'lucide-react';
import { Company } from '../../data/companiesData';

interface CompanyAboutProps {
  company: Company & { role?: string; needs?: string[] };
}

const CompanyAbout: React.FC<CompanyAboutProps> = ({ company }) => {
  const isIndividual = company.role === 'individual' || company.sector === 'Particulier';

  return (
    <div className="space-y-8 animate-fade-in delay-100">
        {/* Description */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-slate-900 mb-4">À propos</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
                {company.longDescription || company.description}
            </p>
        </section>

        {/* Needs (For Individuals) */}
        {isIndividual && company.needs && company.needs.length > 0 && (
             <section className="bg-green-50 rounded-2xl p-8 border border-green-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/50 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                    <Target className="text-green-700" /> Ce que je recherche
                </h2>
                <div className="flex flex-wrap gap-3 relative z-10">
                    {company.needs.map((need: string, idx: number) => (
                        <span key={idx} className="px-4 py-2 bg-white text-green-800 rounded-xl font-bold border border-green-200 shadow-sm">
                            {need}
                        </span>
                    ))}
                </div>
            </section>
        )}

        {/* Perks / Benefits (For Companies) - Affichage Conditionnel Strict */}
        {!isIndividual && Array.isArray(company.perks) && company.perks.length > 0 && (
            <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-2xl"></div>
                
                <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                    <Gift className="text-primary" /> Pourquoi nous rejoindre ?
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                    {company.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                            <span className="font-medium text-slate-700">{perk}</span>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
  );
};

export default CompanyAbout;
