import React from 'react';
import { Lightbulb, Target, Handshake, Download, BookOpen, Rocket } from 'lucide-react';

interface ProcessStepsProps {
  activeTab: 'projects' | 'guides';
}

const StepCard = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} />
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-slate-200 z-10">
            {number}
        </div>
        <h4 className="font-heading font-bold text-gray-900 text-lg mb-2 z-10">{title}</h4>
        <p className="text-sm text-gray-500 z-10">{desc}</p>
    </div>
);

const ProcessSteps: React.FC<ProcessStepsProps> = ({ activeTab }) => {
  return (
    <section className="bg-slate-50 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {activeTab === 'projects' ? 'Votre parcours entrepreneur' : 'Boostez votre carrière'}
                </span>
                <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {activeTab === 'projects' ? (
                <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                    <StepCard 
                        number="1" 
                        title="Publiez votre idée" 
                        desc="Remplissez le formulaire à droite. C'est gratuit et ça prend 2 minutes. Pitch court et impactant."
                        icon={Lightbulb}
                    />
                    <StepCard 
                        number="2" 
                        title="Gagnez en visibilité" 
                        desc="La communauté vote pour les meilleures idées. Votre projet remonte dans le classement."
                        icon={Target}
                    />
                    <StepCard 
                        number="3" 
                        title="Trouvez des partenaires" 
                        desc="Investisseurs et entreprises parcourent le catalogue. Recevez des offres de mentorat."
                        icon={Handshake}
                    />
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                    <StepCard 
                        number="1" 
                        title="Téléchargez les outils" 
                        desc="CV, Lettres de motivation, Pitch Deck... Des modèles adaptés au marché malgache."
                        icon={Download}
                    />
                    <StepCard 
                        number="2" 
                        title="Apprenez les codes" 
                        desc="Lisez nos guides pratiques pour comprendre ce que les recruteurs attendent vraiment."
                        icon={BookOpen}
                    />
                    <StepCard 
                        number="3" 
                        title="Postulez efficacement" 
                        desc="Utilisez vos nouvelles connaissances pour décrocher le job de vos rêves."
                        icon={Rocket}
                    />
                </div>
            )}
        </div>
    </section>
  );
};

export default ProcessSteps;