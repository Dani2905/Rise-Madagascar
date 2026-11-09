import React from 'react';
import { User, ShieldCheck, MapPin, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Individual } from '../../data/companiesData';
import { useAuth } from '../../context/AuthContext';

interface IndividualCardProps {
  individual: Individual;
}

const IndividualCard: React.FC<IndividualCardProps> = ({ individual }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleContact = () => {
      window.Toastify({
          text: "Fonctionnalité de messagerie à venir !",
          style: { background: "#3b82f6" }
      }).showToast();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        {individual.name}
                        {individual.verified && <ShieldCheck size={14} className="text-green-500" />}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                        <MapPin size={12} className="mr-1" /> {individual.location}
                    </div>
                </div>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg border border-green-100">
                {individual.activeOffers} offre(s)
            </span>
        </div>
        
        <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
                {individual.needs.map(need => (
                    <span key={need} className="text-xs font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                        {need}
                    </span>
                ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed italic bg-yellow-50/50 p-3 rounded-xl border border-yellow-50">
                "{individual.description}"
            </p>
        </div>
        
        {isLoggedIn ? (
            <button 
                onClick={handleContact}
                className="mt-auto w-full py-2.5 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
            >
                Contacter
            </button>
        ) : (
            <button 
                onClick={() => navigate('/login')}
                className="mt-auto w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2"
            >
                <Lock size={14} /> Se connecter pour contacter
            </button>
        )}
    </div>
  );
};

export default IndividualCard;