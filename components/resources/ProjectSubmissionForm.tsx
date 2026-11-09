import React from 'react';
import { Zap, Target, Users, Rocket, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canPerformAction } from '../../utils/subscription';

const ProjectSubmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const isRecruiter = user?.role === 'company' || user?.role === 'individual';

  const handleStart = () => {
      if (isLoggedIn) {
          // Redirection vers le profil avec un paramètre d'action pour ouvrir le formulaire
          navigate('/profile?tab=projects&action=new');
      } else {
          navigate('/register?type=student', { state: { returnTo: '/profile?tab=projects&action=new' } });
      }
  };

  return (
    <div className="lg:col-span-4 space-y-8">
        
        {/* Launchpad Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-24 group">
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary mb-6 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Rocket size={28} />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-2">
                        {isRecruiter ? "Innovation Étudiante" : "Espace Création"}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        {isRecruiter 
                            ? "Découvrez les pépites de demain. Ces étudiants cherchent des mentors et des financements."
                            : "Vous avez une idée qui peut changer les choses ? C'est le moment de la partager avec la communauté Rise."
                        }
                    </p>
                </div>
            </div>

            <div className="p-8">
                <div className="space-y-6 mb-8">
                    <div className="flex gap-4 group/item">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 group-hover/item:bg-green-100 transition-colors">
                            <Target size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Visibilité Ciblée</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                {isRecruiter ? "Identifiez les talents proactifs avant leurs diplômes." : "Votre projet pourra être consulté par les visiteurs de cet espace."}
                            </p>
                        </div>
                    </div>
                    
                    {!isRecruiter && (
                        <div className="flex gap-4 group/item">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover/item:bg-blue-100 transition-colors">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Co-fondateurs</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                    Indiquez les compétences recherchées pour faire avancer votre projet.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 group/item">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0 group-hover/item:bg-yellow-100 transition-colors">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Mentorat</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                {isRecruiter ? "Partagez votre expertise et aidez un jeune projet à décoller." : "Indiquez si vous recherchez des conseils ou des collaborateurs."}
                            </p>
                        </div>
                    </div>
                </div>

                {isRecruiter ? (
                    <div className="w-full py-4 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-2 text-center px-4 cursor-default">
                        <div className="flex items-center gap-2">
                            <Lock size={16} /> <span>Création désactivée</span>
                        </div>
                        <span className="text-xs font-normal opacity-80">Seuls les profils étudiants peuvent publier des projets.</span>
                    </div>
                ) : (
                    <button 
                        onClick={handleStart}
                        className="w-full py-4 bg-primary text-slate-900 rounded-xl font-bold text-base hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        {isLoggedIn ? "Créer un nouveau projet" : "Créer un compte"}
                        <ArrowRight size={20} />
                    </button>
                )}
                
                {!isRecruiter && (!user || !canPerformAction(user, 'publishProject')) && (
                    <p className="text-center text-xs text-gray-500 mt-4">Un abonnement étudiant actif est nécessaire pour publier un projet.</p>
                )}
                {!isLoggedIn && (
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Déjà membre ? <button onClick={() => navigate('/login', { state: { returnTo: '/profile?tab=projects&action=new' } })} className="text-slate-900 font-bold hover:underline">Se connecter</button>
                    </p>
                )}
            </div>
        </div>

    </div>
  );
};

export default ProjectSubmissionForm;