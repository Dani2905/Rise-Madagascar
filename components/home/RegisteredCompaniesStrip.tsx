import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRegisteredRecruiters, RegisteredRecruiter } from '../../utils/registeredCompanies';

const RegisteredCompaniesStrip: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<RegisteredRecruiter[]>(getRegisteredRecruiters);

  useEffect(() => {
    const refresh = () => setCompanies(getRegisteredRecruiters());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [user]);

  return (
    <div className="mt-20 border-y border-gray-100 bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Recruteurs inscrits sur Rise Madagascar</h2>
        {companies.length > 0 ? (
          <div className="mt-7 overflow-x-auto pb-2" aria-label="Entreprises et particuliers inscrits">
            <div className="flex items-center justify-start sm:justify-center gap-4 w-max min-w-full px-1">
              {companies.map(company => (
                <Link key={company.id} to={`/companies/${encodeURIComponent(company.id)}`}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-600"
                  aria-label={`Voir le profil de ${company.name}`}>
                  <span className="relative flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-yellow-50 text-yellow-700 overflow-hidden" aria-hidden="true">
                    {company.role === 'company' ? <Building2 size={20} /> : <UserRound size={20} />}
                    {company.logoUrl && <img src={company.logoUrl} alt="" className="absolute inset-0 w-full h-full object-contain bg-white" onError={event => { event.currentTarget.style.display = 'none'; }} />}
                  </span>
                  <span className="flex flex-col text-left"><span className="font-heading font-bold text-slate-800 max-w-[200px] truncate">{company.name}</span><span className="text-xs text-slate-500">{company.role === 'company' ? 'Entreprise' : 'Particulier'}</span></span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500 mt-5">Les entreprises et particuliers inscrits apparaîtront ici.</p>
        )}
      </div>
    </div>
  );
};

export default RegisteredCompaniesStrip;
