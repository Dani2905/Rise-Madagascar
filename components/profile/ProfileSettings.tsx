import SubscriptionCard from '../subscription/SubscriptionCard';
import PasswordCard from '../account/PasswordCard';
import React, { useState } from 'react';
import { Bell, Eye, Trash2, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [notifications, setNotifications] = useState({ jobs: true, apps: true, news: false });
  const [isPublic, setIsPublic] = useState(true);


  return (
    <div className="space-y-6 animate-fade-in delay-100">
        
        <SubscriptionCard data={user} onUpdate={updateUser} />

        <PasswordCard />

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