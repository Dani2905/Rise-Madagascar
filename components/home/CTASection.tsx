import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl shadow-primary/30">
              <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Étudiant ou Entreprise ?</h2>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Rejoignez la communauté Rise. C'est gratuit pour les étudiants.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {!isLoggedIn && (
                          <button onClick={() => navigate('/register')} className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">
                              Créer un profil Étudiant
                          </button>
                      )}
                      
                      {user?.role !== 'student' && (
                          <button className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors">
                              Publier une offre
                          </button>
                      )}
                  </div>
              </div>
              {/* Decorative circles - Solid low opacity */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-black opacity-10 rounded-full blur-2xl"></div>
          </div>
      </div>
    </section>
  );
};

export default CTASection;