import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginWallProps {
  jobTitle: string;
  companyName: string;
  backTo: string;
  backState?: { fromDirectory: string };
}

const LoginWall: React.FC<LoginWallProps> = ({ jobTitle, companyName, backTo, backState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnState = { returnTo: `${location.pathname}${location.search}`, returnState: location.state };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500 opacity-5 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 text-center shadow-xl border border-gray-100 relative z-10 animate-fade-in">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary ring-8 ring-yellow-50/50">
            <Lock size={36} />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">
            Offre réservée aux membres
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
            Pour consulter les détails de l'offre <span className="font-semibold text-slate-900">"{jobTitle}"</span> chez <span className="font-semibold text-slate-900">{companyName}</span> et postuler, vous devez être connecté.
        </p>
        
        <div className="space-y-4">
            <button 
                onClick={() => navigate('/login', { state: returnState })} 
                className="w-full py-4 bg-primary text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Se connecter
                <ArrowRight size={18} />
            </button>
            
            <button 
                onClick={() => navigate('/register?type=student', { state: returnState })} 
                className="w-full py-4 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 hover:text-slate-900 transition-colors"
            >
                Créer un compte gratuit
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50">
            <Link to={backTo} state={backState} className="text-sm font-medium text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Retour
            </Link>
        </div>
    </div>
</div>
  );
};

export default LoginWall;