import React from 'react';
import { User, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Individual } from '../../data/companiesData';
import { useAuth } from '../../context/AuthContext';

const IndividualCard: React.FC<{ individual: Individual; fromDirectory?: string; followAction?: React.ReactNode }> = ({ individual, fromDirectory, followAction }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = encodeURIComponent(String(individual.id));
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all flex flex-col">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><User size={24} /></div>
          <div className="min-w-0"><h3 className="font-bold text-slate-900 truncate">{individual.name}</h3><div className="flex items-center text-xs text-gray-500"><MapPin size={12} className="mr-1" />{individual.location}</div></div>
        </div>
        <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg border border-green-100 whitespace-nowrap">{individual.activeOffers} {individual.activeOffers > 1 ? 'annonces actives' : 'annonce active'}</span>
      </div>
      <div className="mb-4 flex-grow">
        {individual.needs.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{individual.needs.map(need => <span key={need} className="text-xs font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">{need}</span>)}</div>}
        <p className="text-sm text-gray-600 leading-relaxed bg-yellow-50/50 p-3 rounded-xl border border-yellow-50">{individual.description}</p>
      </div>
      <p className="text-xs text-slate-500 mb-3">Contact réservé aux candidats acceptés ou aux étudiants contactés en premier par ce particulier. Échanges simulés dans ce navigateur.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Link to={`/companies/${id}${individual.activeOffers ? '?view=offers' : ''}`} state={fromDirectory ? { fromDirectory } : undefined} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-sm">{individual.activeOffers ? 'Voir les annonces' : 'Voir le profil'} <ArrowRight size={15} /></Link>
        {(!isLoggedIn || user?.role === 'student') && String(user?.id) !== String(individual.id) && <button type="button" onClick={() => isLoggedIn ? navigate(`/messages?partner=${id}`) : navigate('/login', { state: { returnTo: `/companies/${id}`, returnState: { fromDirectory: fromDirectory || `${location.pathname}${location.search}` } } })} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-slate-50 text-sm"><MessageCircle size={15} /> {isLoggedIn ? 'Contacter' : 'Se connecter'}</button>}
      </div>
      <div className="mt-2">{followAction}</div>
    </div>
  );
};
export default IndividualCard;
