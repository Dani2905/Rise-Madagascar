import React, { useState, useEffect } from 'react';
import { ArrowRight, Building2, Briefcase, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRegisteredRecruiters, RegisteredRecruiter } from '../../utils/registeredCompanies';

const CompaniesSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<RegisteredRecruiter[]>(getRegisteredRecruiters);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const refresh = () => setCompanies(getRegisteredRecruiters());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, [user]);

  const recruiting = companies.filter(company => company.jobs > 0);
  const totalPages = Math.max(1, Math.ceil(recruiting.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages - 1);
  const currentCompanies = recruiting.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleRecruiterSpaceClick = () => {
    if (!user) navigate('/companies');
    else if (user.role === 'individual') navigate('/dashboard?tab=ads');
    else navigate('/dashboard?tab=jobs');
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Ils recrutent en ce moment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les entreprises et particuliers inscrits qui proposent des offres ou missions actives aux étudiants.</p>
        </div>
        {recruiting.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentCompanies.map(company => (
                <Link key={company.id} to={`/companies/${encodeURIComponent(company.id)}?view=offers`}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col items-center text-center h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-600">
                  <div className="relative w-20 h-20 mb-5 rounded-2xl overflow-hidden bg-yellow-50 flex items-center justify-center text-yellow-700">
                    {company.role === 'company' ? <Building2 size={32} /> : <UserRound size={32} />}
                    {company.logoUrl && <img src={company.logoUrl} alt="" className="absolute inset-0 w-full h-full object-contain bg-white" onError={e => { e.currentTarget.style.display = 'none'; }} />}
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-xl mb-1 group-hover:text-yellow-700 line-clamp-1">{company.name}</h3><span className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">{company.role === 'company' ? 'Entreprise' : 'Particulier'}</span>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3 flex-grow">{company.description}</p>
                  <div className="mt-auto w-full pt-4 border-t border-gray-50">
                    <span className="inline-flex items-center text-sm font-bold text-slate-800">{company.jobs} {company.role === 'individual' ? (company.jobs > 1 ? 'annonces actives' : 'annonce active') : (company.jobs > 1 ? 'offres actives' : 'offre active')} <ArrowRight size={16} className="ml-2" /></span>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && <div className="flex justify-center mt-10 gap-2">{Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} type="button" onClick={() => setCurrentPage(idx)} aria-label={`Page ${idx + 1}`} aria-current={page === idx ? 'page' : undefined}
                className={`h-2 rounded-full transition-all ${page === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
            ))}</div>}
          </>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center text-slate-500">Aucun recruteur inscrit ne propose d'offre ou de mission active pour le moment.</div>
        )}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto relative overflow-hidden">
          <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Vous recherchez un étudiant ?</h3>
            <p className="text-gray-600">Entreprise ou particulier : rejoignez le réseau et publiez vos offres pour rencontrer des étudiants.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button type="button" onClick={() => navigate('/companies')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 border border-gray-200"><Building2 size={18} /> Voir l'annuaire</button>
            {user?.role !== 'student' && <button type="button" onClick={handleRecruiterSpaceClick} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg"><Briefcase size={18} /> Espace Recruteur</button>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CompaniesSection;
