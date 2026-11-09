import React from 'react';
import { Briefcase, Zap, Lightbulb } from 'lucide-react';

const SolutionsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Une plateforme, trois solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Rise s'adapte à vos besoins pour gagner du temps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Stage */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <Briefcase size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Stages & Alternance</h3>
            <p className="text-gray-600">Pour valider votre année. Connectez-vous avec les grandes entreprises (Telma, Axian, etc.) et PME.</p>
          </div>

          {/* Petits Boulots */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Jobs & Missions</h3>
            <p className="text-gray-600">Offres de particuliers et d'agences : soutien scolaire, garde d'enfants, distribution, freelance ponctuel.</p>
          </div>

          {/* Projets */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Lightbulb size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Projets & Financement</h3>
            <p className="text-gray-600">Vous avez une idée ? Soumettez votre projet pour trouver des financements ou des mentors.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;