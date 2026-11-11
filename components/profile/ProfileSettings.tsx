import PrivacySettings from '../messaging/PrivacySettings';
import React from 'react';
import { Bell, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SubscriptionCard from '../subscription/SubscriptionCard';
import PasswordCard from '../account/PasswordCard';

const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  return <div className="space-y-6 animate-fade-in delay-100">
    <SubscriptionCard data={user} onUpdate={updateUser} />
    <PrivacySettings />
    <PasswordCard />
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Bell className="text-blue-500" size={20} /> Notifications</h3>
        <p className="text-sm text-gray-600">Les alertes et la newsletter ne sont pas disponibles dans cette démonstration. Aucun e-mail de notification n’est envoyé.</p>
      </section>
      <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Eye className="text-green-600" size={20} /> Confidentialité</h3>
        <p className="text-sm text-gray-600">Cette démonstration conserve vos données dans ce navigateur. Votre aperçu public simulé ne fonctionne que dans ce navigateur et masque vos coordonnées et candidatures. La CVthèque et les réglages de visibilité du profil ne sont pas encore disponibles. Ne saisissez pas de données sensibles.</p>
      </section>
    </div>
    <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
      <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 flex items-center gap-2"><Trash2 size={20} /> Suppression du compte</h3>
      <p className="text-sm text-gray-600">La suppression complète du compte n’est pas encore disponible depuis cette interface. Les données de démonstration restent propres à ce navigateur.</p>
    </section>
  </div>;
};
export default ProfileSettings;
