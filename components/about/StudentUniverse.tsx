import React from 'react';
import { Briefcase, CheckCircle2, ArrowRight, Rocket, Users, Lightbulb, Zap, BookOpen, Globe, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentUniverse: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const isRecruiter = user?.role === 'company' || user?.role === 'individual';

  return (
    <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Pour les Talents</h2>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">Tout pour lancer votre carrière</h3>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                    Nous avons analysé les besoins des étudiants de Tana et d'ailleurs. Voici ce que Rise vous offre concrètement.
                </p>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Offres Classiques */}
                <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-primary/30 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Briefcase size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 mb-6">
                            <Briefcase size={24} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-3">Le Hub des Opportunités</h4>
                        <p className="text-gray-600 mb-6 max-w-lg">
                            Accédez à la section <strong className="text-slate-900">"Offres & Missions"</strong> pour filtrer parmi des centaines d'annonces vérifiées.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-primary shrink-0 mt-1" size={18} />
                                <div>
                                    <strong className="block text-slate-900 text-sm">Stages & Alternances</strong>
                                    <span className="text-xs text-gray-500">Pour valider votre cursus (Telma, Axian...)</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-secondary shrink-0 mt-1" size={18} />
                                <div>
                                    <strong className="block text-slate-900 text-sm">Jobs Étudiants</strong>
                                    <span className="text-xs text-gray-500">Missions ponctuelles (Hôtessariat, cours...)</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => navigate('/search')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                            Explorer les offres <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Card 2: L'Incubateur */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary mb-6 backdrop-blur-sm border border-white/10">
                            <Rocket size={24} />
                        </div>
                        <h4 className="text-xl font-bold mb-3">L'Incubateur Rise</h4>
                        
                        {isRecruiter ? (
                             <>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Découvrez les innovations de demain. La section <strong className="text-white">"Ressources"</strong> regorge de talents qui n'attendent que vous.
                                </p>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex gap-2"><Lightbulb size={16} className="text-primary" /> Identifier les pépites</li>
                                    <li className="flex gap-2"><Users size={16} className="text-primary" /> Mentorer des étudiants</li>
                                    <li className="flex gap-2"><Zap size={16} className="text-primary" /> Soutenir l'entrepreneuriat</li>
                                </ul>
                                <button onClick={() => navigate('/resources')} className="mt-8 w-full py-3 bg-primary text-slate-900 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                    Explorer l'incubateur <Search size={16} />
                                </button>
                             </>
                        ) : (
                             <>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Vous avez une idée ? Ne la gardez pas pour vous. La section <strong className="text-white">"Ressources"</strong> vous permet de :
                                </p>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex gap-2"><Lightbulb size={16} className="text-primary" /> Publier votre projet</li>
                                    <li className="flex gap-2"><Users size={16} className="text-primary" /> Trouver des co-fondateurs</li>
                                    <li className="flex gap-2"><Zap size={16} className="text-primary" /> Attirer des Business Angels</li>
                                </ul>
                                <button onClick={() => navigate('/resources')} className="mt-8 w-full py-3 bg-primary text-slate-900 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors">
                                    Soumettre un projet
                                </button>
                             </>
                        )}
                    </div>
                </div>

                {/* Card 3: Boîte à outils (Full Width on mobile, 1/3 on Desktop) */}
                <div className="bg-yellow-50 rounded-3xl p-8 border border-yellow-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-yellow-600 mb-6">
                        <BookOpen size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Guides & Outils</h4>
                    <p className="text-gray-600 text-sm mb-4">
                        On ne vous laisse pas seul. Téléchargez des modèles de CV adaptés au marché local et lisez nos guides carrière.
                    </p>
                    <button onClick={() => navigate('/resources')} className="text-sm font-bold text-slate-900 underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-700 bg-transparent border-none p-0 cursor-pointer">
                        Voir la librairie
                    </button>
                </div>

                {/* Card 4: Freelance & Remote */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold mb-4 border border-green-100">
                            <Globe size={12} /> Nouveau
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-3">Freelance & Remote</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Le monde change. Rise permet aux étudiants en Tech, Design ou Rédaction de trouver des missions <strong>100% en ligne</strong>, payées à la tâche. Idéal pour compléter ses revenus sans sacrifier ses études.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">Dév Web</span>
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">Community Management</span>
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">Design</span>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-6 text-center border border-gray-100 border-dashed">
                        <p className="text-3xl font-heading font-bold text-slate-900 mb-1">100%</p>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Gratuit pour les étudiants</p>
                        {!isLoggedIn && (
                            <button onClick={() => navigate('/register')} className="mt-4 w-full py-2 bg-white border border-gray-200 text-slate-900 text-xs font-bold rounded-lg hover:border-slate-900 transition-colors">
                                S'inscrire
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </section>
  );
};

export default StudentUniverse;