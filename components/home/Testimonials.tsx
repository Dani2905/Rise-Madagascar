import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Andry R.",
      role: "Étudiant à l'INSCAE",
      content: "Grâce à Rise Madagascar, j'ai trouvé mon stage de fin d'études chez Telma en moins de 2 semaines. La plateforme est super intuitive !",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
      name: "Mialy T.",
      role: "Étudiante en Droit à l'UCM",
      content: "Je cherchais un job pour le week-end. J'ai trouvé une mission d'hôtesse pour un salon pro. Paiement rapide et expérience top.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
      name: "Toky A.",
      role: "Autodidacte Développeur",
      content: "J'ai pu proposer mes services de création de site web à des petites entreprises locales. Rise Madagascar m'a aidé à lancer mon activité freelance.",
      image: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
    }
  ];

  return (
    <section className="py-24 bg-yellow-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900">Ce qu'en pensent les étudiants</h2>
          <p className="text-gray-500 mt-2">Ils ont trouvé leur voie avec Rise Madagascar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="mb-6 text-primary/30">
                <Quote size={40} className="fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed flex-grow">"{t.content}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-secondary font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;