import React from 'react';
import { Award, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AboutCTA: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <section className="py-24 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <Award size={48} className="mx-auto text-primary mb-6" />
              <h2 className="text-4xl font-heading font-bold text-slate-900 mb-6">Rejoignez le mouvement</h2>
              <p className="text-xl text-gray-500 mb-10">
                  Que vous soyez étudiant, recruteur ou simple particulier, vous avez votre place ici.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!isLoggedIn ? (
                      <button onClick={() => navigate('/register')} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">
                          Créer un compte
                      </button>
                  ) : (
                      <button onClick={() => navigate('/profile')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1">
                          <LayoutDashboard size={20} /> Mon Espace
                      </button>
                  )}
                  
                  <button onClick={() => navigate('/search')} className="px-8 py-4 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
                      Voir les offres
                  </button>
              </div>
          </div>
    </section>
  );
};

export default AboutCTA;