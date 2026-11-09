import React from 'react';
import { Layout, Home, ShieldCheck, GraduationCap, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RecruiterUniverse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="py-24 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Text Content */}
                <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Pour les Recruteurs</h2>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">Deux façons de recruter</h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Rise innove en ouvrant sa plateforme non seulement aux entreprises formelles, mais aussi aux particuliers. Tout le monde a besoin d'aide, et chaque étudiant a besoin d'expérience.
                    </p>

                    <div className="space-y-6">
                        {/* Option A: Entreprise */}
                        <div className="flex gap-5 group cursor-pointer" onClick={() => navigate('/companies')}>
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                                <Layout size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Espace Entreprise (B2C)</h4>
                                <p className="text-gray-500 text-sm">
                                    Pour les sociétés (SA, SARL, Startups). Publiez des offres de stage structurées, accédez à une CVthèque filtrable par école, et boostez votre marque employeur.
                                </p>
                            </div>
                        </div>

                        {/* Option B: Particulier */}
                        <div className="flex gap-5 group cursor-pointer" onClick={() => navigate('/companies')}>
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600 border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                                <Home size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Espace Particulier (C2C)</h4>
                                <p className="text-gray-500 text-sm">
                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs mr-2">Unique à Rise</span>
                                    Vous êtes un particulier ? Trouvez un étudiant pour du soutien scolaire, du jardinage, de l'aide informatique ou un déménagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Representation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[80px]"></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Candidats actifs</p>
                                <p className="text-4xl font-heading font-bold text-slate-900">2,450+</p>
                            </div>
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+2k</div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-green-500" />
                                    <span className="font-bold text-slate-700">Identités vérifiées</span>
                                </div>
                                <CheckCircle2 className="text-green-500" size={18} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="text-blue-500" />
                                    <span className="font-bold text-slate-700">Filtre par École</span>
                                </div>
                                <CheckCircle2 className="text-green-500" size={18} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-yellow-500" />
                                    <span className="font-bold text-slate-700">Mise en relation directe</span>
                                </div>
                                <CheckCircle2 className="text-green-500" size={18} />
                            </div>
                        </div>

                        {user?.role !== 'student' && (
                            <button onClick={() => navigate('/companies')} className="w-full mt-8 py-4 bg-primary text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-yellow-400 transition-colors">
                                Commencer à recruter
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default RecruiterUniverse;