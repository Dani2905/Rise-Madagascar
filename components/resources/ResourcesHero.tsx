import React from 'react';
import { Rocket, Lightbulb, BookOpen, Handshake, Search, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ResourcesHeroProps {
  activeTab: 'projects' | 'guides';
  setActiveTab: (tab: 'projects' | 'guides') => void;
}

const ResourcesHero: React.FC<ResourcesHeroProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'company' || user?.role === 'individual';

  // Contenu dynamique selon le rôle
  const content = isRecruiter ? {
      badge: "Vivier de Talents",
      titleLine1: "Détectez les pépites",
      titleLine2: "Avant les autres",
      boxTitle: "Pourquoi",
      boxTitleHighlight: "explorer ?",
      item1Icon: Search,
      item1Title: "Sourcez autrement",
      item1Desc: "Au-delà du CV, évaluez les compétences réelles (Soft skills, Initiative) à travers des projets concrets.",
      item2Icon: Users,
      item2Title: "Marque Employeur",
      item2Desc: "Soutenez l'entrepreneuriat étudiant via le mentorat et gagnez en visibilité auprès des futurs diplômés."
  } : {
      badge: "Innovation Étudiante",
      titleLine1: "Publiez vos idées",
      titleLine2: "Réalisez vos projets",
      boxTitle: "Faites vous",
      boxTitleHighlight: "remarquer",
      item1Icon: Lightbulb,
      item1Title: "Exposez votre projet",
      item1Desc: "N'attendez pas d'être diplômé. Présentez vos innovations scolaires ou personnelles à la communauté dès maintenant.",
      item2Icon: Handshake,
      item2Title: "Trouvez des soutiens",
      item2Desc: "Présentez vos besoins et recherchez des investisseurs ou des collaborateurs."
  };

  return (
    <section className="bg-slate-900 text-white py-16 lg:py-20 relative overflow-hidden">
          {/* Abstract BG */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary opacity-10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* LEFT COL: Titles & Tabs */}
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10 shadow-lg">
                        <Rocket className="text-primary mr-2" size={16} />
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-200">{content.badge}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 leading-tight">
                        {content.titleLine1} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">{content.titleLine2}</span>
                    </h1>
                    
                    {/* Tab Navigation */}
                    <div className="flex justify-center lg:justify-start mt-8">
                        <div className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-full inline-flex shadow-xl border border-slate-700">
                        <button
                            type="button" aria-pressed={activeTab === 'projects'}
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'projects' 
                                ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Lightbulb size={18} />
                            Projets étudiants
                        </button>
                        <button
                            type="button" aria-pressed={activeTab === 'guides'}
                            onClick={() => setActiveTab('guides')}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'guides' 
                                ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <BookOpen size={18} />
                            Outils & Guides
                        </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: Detailed Description Box - Solid Style */}
                <div className="relative">
                    {/* Decoration bg behind */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2rem] opacity-50 blur-lg -z-10"></div>
                    
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative hover:border-slate-600 transition-colors shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <Rocket size={120} className="text-white transform rotate-45" />
                        </div>

                        <h3 className="text-2xl font-heading font-bold text-white mb-8 relative z-10">
                            {content.boxTitle} <span className="text-primary underline decoration-4 decoration-primary/30 underline-offset-4">{content.boxTitleHighlight}</span>
                        </h3>
                        
                        <ul className="space-y-8 relative z-10">
                            <li className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-yellow-400 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-300 shadow-lg shadow-black/20">
                                    <content.item1Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg mb-2 group-hover:text-primary transition-colors">
                                        {content.item1Title}
                                    </h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {content.item1Desc}
                                    </p>
                                </div>
                            </li>
                            
                            <li className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-black/20">
                                    <content.item2Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg mb-2 group-hover:text-green-400 transition-colors">
                                        {content.item2Title}
                                    </h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {content.item2Desc}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

             </div>
          </div>
       </section>
  );
};

export default ResourcesHero;