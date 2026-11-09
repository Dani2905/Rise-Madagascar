import React, { useState } from 'react';
import { Lock, Bell, Eye, Trash2, Star } from 'lucide-react';
import { FloatingInput } from '../FloatingInput';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ jobs: true, apps: true, news: false });
  const [isPublic, setIsPublic] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
       window.Toastify({ text: "Les mots de passe ne correspondent pas", style: { background: "#ef4444" } }).showToast();
       return;
    }
    // Simulation d'appel API
    window.Toastify({ text: "Mot de passe mis à jour avec succès !", style: { background: "linear-gradient(to right, #10B981, #059669)" } }).showToast();
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in delay-100">
        
        {/* Subscription Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            {user?.hasSubscription && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10" />
            )}
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Star className={user?.hasSubscription ? "text-green-500" : "text-primary"} size={20} /> 
                Abonnement Premium
            </h3>
            
            {user?.hasSubscription ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-green-900 text-lg">Abonnement Actif</h4>
                        <p className="text-green-700 text-sm mt-1">Vous bénéficiez de toutes les fonctionnalités premium (candidatures illimitées).</p>
                        <button 
                            onClick={() => updateUser({ hasSubscription: false })}
                            className="mt-3 text-red-600 font-bold text-sm hover:underline"
                        >
                            Résilier l'abonnement
                        </button>
                    </div>
                    <span className="px-4 py-2 bg-white text-green-700 font-bold text-sm rounded-lg border border-green-200 shrink-0">
                        Renouvellement auto
                    </span>
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Compte Gratuit</h4>
                        <p className="text-gray-600 text-sm mt-1">Passez à la version premium pour pouvoir postuler aux offres.</p>
                    </div>
                    <Link to="/pricing" className="px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shrink-0 shadow-lg shadow-slate-900/10">
                        Découvrir Premium
                    </Link>
                </div>
            )}
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="text-primary" size={20} /> Sécurité
            </h3>
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-2">
                <FloatingInput 
                    id="current" type="password" label="Mot de passe actuel" required
                    value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} 
                />
                <FloatingInput 
                    id="new" type="password" label="Nouveau mot de passe" required
                    value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} 
                />
                <FloatingInput 
                    id="confirm" type="password" label="Confirmer le nouveau mot de passe" required
                    value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                />
                <button type="submit" className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    Mettre à jour le mot de passe
                </button>
            </form>
        </div>

        {/* Notifications & Privacy Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Notifications */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
                 <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                    <Bell className="text-blue-500" size={20} /> Notifications
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-900 font-bold text-sm block">Alertes Emploi</span>
                            <span className="text-xs text-gray-500">Nouvelles offres correspondant à votre profil</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notifications.jobs} onChange={() => setNotifications({...notifications, jobs: !notifications.jobs})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-900 font-bold text-sm block">Suivi Candidatures</span>
                            <span className="text-xs text-gray-500">Mises à jour sur vos postulations</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notifications.apps} onChange={() => setNotifications({...notifications, apps: !notifications.apps})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-900 font-bold text-sm block">Newsletter Rise</span>
                            <span className="text-xs text-gray-500">Conseils carrière et actualités</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notifications.news} onChange={() => setNotifications({...notifications, news: !notifications.news})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Confidentialité */}
             <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                 <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                    <Eye className="text-green-500" size={20} /> Confidentialité
                </h3>
                 <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-gray-900 font-bold text-sm block">Profil Public</span>
                            <span className="text-xs text-gray-500">Votre profil est visible dans la CVthèque</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                 </div>
                 <div className="p-4 bg-green-50 rounded-xl text-xs text-green-800 border border-green-100 mt-auto">
                    <p className="font-bold mb-1">💡 Le saviez-vous ?</p>
                    <p>En rendant votre profil public, vous augmentez vos chances d'être contacté directement par des recruteurs de 50%.</p>
                 </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100 mt-8">
             <h3 className="font-heading font-bold text-lg text-red-700 mb-2 flex items-center gap-2">
                <Trash2 size={20} /> Zone de danger
            </h3>
            <p className="text-sm text-red-600/80 mb-6 max-w-2xl">
                La suppression de votre compte est irréversible. Toutes vos données (candidatures, profil, historique, CV) seront définitivement effacées de nos serveurs.
            </p>
            <button 
                onClick={() => window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.") && window.Toastify({ text: "Action impossible en mode démo", style: { background: "#64748b" } }).showToast()}
                className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors"
            >
                Supprimer mon compte
            </button>
        </div>
    </div>
  );
};

export default ProfileSettings;