import React from 'react';
import { ShieldCheck, TrendingUp, Heart, Target } from 'lucide-react';

const ValuesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-heading font-bold mb-4 text-slate-900">Nos Piliers</h2>
                  <p className="text-gray-500">Les valeurs qui guident le développement de la plateforme.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { icon: ShieldCheck, title: "Confiance", desc: "Chaque offre est modérée manuellement. Chaque profil étudiant est vérifié pour garantir la sécurité des particuliers." },
                      { icon: TrendingUp, title: "Méritocratie", desc: "Peu importe votre origine ou vos relations. Seules vos compétences et votre motivation comptent sur Rise." },
                      { icon: Heart, title: "Entraide", desc: "Nous encourageons le mentorat. Les anciens aident les nouveaux via la section Communauté." },
                      { icon: Target, title: "Impact Local", desc: "100% Vita Malagasy. Une solution pensée par des jeunes malgaches, pour les jeunes malgaches." }
                  ].map((val, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                              <val.icon size={24} />
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-slate-900">{val.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
    </section>
  );
};

export default ValuesSection;