import React from 'react';
import { UserPlus, Search, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    {
      icon: UserPlus,
      title: "1. Inscrivez-vous",
      desc: "Créez votre profil gratuitement."
    },
    {
      icon: Search,
      title: "2. Postulez",
      desc: "Trouvez le stage ou la mission idéale."
    },
    {
      icon: Rocket,
      title: "3. Lancez-vous",
      desc: "Démarrez votre expérience pro."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header + Steps Combined Layout */}
        <div className="mb-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
                <p className="text-gray-500">Simple, rapide et efficace.</p>
             </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all hover:shadow-lg group">
                        <div className="mb-4 p-3 bg-white rounded-xl text-slate-900 border border-primary/20 bg-primary/20 group-hover:scale-110 transition-transform">
                            <step.icon size={28} />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-500 text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Combined CTA Block */}
        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 text-center shadow-xl shadow-primary/20 max-w-4xl mx-auto">
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 mb-4">Prêt à démarrer ?</h2>
                <p className="text-slate-800 text-lg mb-8 max-w-xl mx-auto font-medium">
                    Rejoignez les milliers d'étudiants et entreprises sur Rise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!user && (
                        <button onClick={() => navigate('/register')} className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-sm">
                            Créer un compte Étudiant
                        </button>
                    )}
                    
                    {user?.role !== 'student' && (
                        <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-sm">
                            Publier une offre
                        </button>
                    )}
                </div>
            </div>
            
            {/* Flat decorative circles */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;