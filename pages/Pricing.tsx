import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
    const { user, updateUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSubscribe = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // Simuler un paiement réussi et mettre à jour le compte
        updateUser({ hasSubscription: true });
        
        if (window.Toastify) {
            window.Toastify({
                text: "Abonnement activé avec succès !",
                style: { background: "#10B981" }
            }).showToast();
        }

        // Rediriger vers le dashboard
        navigate('/profile');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 mb-6">
                    Passez à la vitesse supérieure
                </h1>
                <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                    La création de compte est 100% gratuite. Pour postuler ou publier des annonces, choisissez notre abonnement Premium.
                </p>

                <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-primary/20 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-left">Abonnement Premium</h2>
                    <div className="text-left mb-6">
                        <span className="text-4xl font-black text-slate-900">10 000 Ar</span>
                        <span className="text-gray-500"> / mois</span>
                    </div>

                    <ul className="space-y-4 mb-8 text-left">
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                            <span>Postuler en illimité (Étudiants)</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                            <span>Publier des annonces (Entreprises / Particuliers)</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                            <span>Visibilité accrue sur la plateforme</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                            <span>Accès au support prioritaire</span>
                        </li>
                    </ul>

                    {user?.hasSubscription ? (
                        <div className="w-full py-4 rounded-xl bg-green-50 text-green-600 font-bold border border-green-200">
                            Vous êtes déjà abonné Premium
                        </div>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            S'abonner maintenant
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
