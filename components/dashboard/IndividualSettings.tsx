
import React, { useState, useRef } from 'react';
import { Save, Loader2, User, MapPin, Bell, Lock, Camera, Mail, Phone, Home, Star } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';
import { Link } from 'react-router-dom';

interface IndividualSettingsProps {
  data: any;
  onUpdate: (newData: any) => void;
}

const IndividualSettings: React.FC<IndividualSettingsProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: data.companyName || `${data.firstName} ${data.lastName}`,
    location: data.location || '',
    bio: data.bio || '',
    email: data.email || '',
    phone: data.phone || '',
    notifications: {
      applications: true,
      messages: true,
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleToggle = (key: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              window.Toastify({ text: "Image trop lourde (Max 2MB)", style: { background: "#ef4444" } }).showToast();
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdate({ avatarUrl: reader.result as string }); // For individuals we map to avatarUrl
              window.Toastify({ text: "Photo mise à jour temporairement (Sauvegardez pour confirmer)", style: { background: "#3b82f6" } }).showToast();
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulation API
    setTimeout(() => {
      onUpdate({
        companyName: formData.name, // Display name for consistency
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' '),
        location: formData.location,
        bio: formData.bio,
        phone: formData.phone
      });
      setIsSaving(false);
      window.Toastify({
        text: "Profil mis à jour avec succès !",
        style: { background: "linear-gradient(to right, #10B981, #059669)" }
      }).showToast();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">

      {/* Subscription Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          {data?.hasSubscription && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10" />
          )}
          <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <Star className={data?.hasSubscription ? "text-green-500" : "text-primary"} size={20} /> 
              Abonnement Premium
          </h3>
          
          {data?.hasSubscription ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                      <h4 className="font-bold text-green-900 text-lg">Abonnement Actif</h4>
                      <p className="text-green-700 text-sm mt-1">Vous bénéficiez de toutes les fonctionnalités premium (publications illimitées).</p>
                      <button 
                          onClick={(e) => { e.preventDefault(); onUpdate({ hasSubscription: false }); }}
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
                      <p className="text-gray-600 text-sm mt-1">Passez à la version premium pour pouvoir publier des annonces.</p>
                  </div>
                  <Link to="/pricing" className="px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shrink-0 shadow-lg shadow-slate-900/10">
                      Découvrir Premium
                  </Link>
              </div>
          )}
      </div>
      
      {/* 1. Profil Public */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Home className="text-green-600" size={20} /> Profil Public
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 mb-6 items-center md:items-start">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-sm"
                >
                    <img src={data.logoUrl || data.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Camera className="text-white drop-shadow-md" />
                    </div>
                </div>
                <span onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-green-600 cursor-pointer hover:underline">Modifier la photo</span>
            </div>

            <div className="flex-1 w-full space-y-4">
                <FloatingInput 
                    id="name" 
                    label="Nom complet (affiché aux candidats)" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
                <FloatingInput 
                    id="location" 
                    label="Adresse / Quartier" 
                    value={formData.location} 
                    onChange={handleChange} 
                />
            </div>
        </div>

        <FloatingTextArea 
            id="bio"
            label="À propos de vos besoins (ex: Famille cherche soutien scolaire...)"
            value={formData.bio}
            onChange={handleChange}
            className="h-32"
        />
      </div>

      {/* 2. Coordonnées & Sécurité */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="text-blue-500" size={20} /> Coordonnées & Sécurité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput 
                id="email" 
                label="Email" 
                value={formData.email} 
                onChange={handleChange} 
                type="email"
                disabled
                className="bg-gray-50 text-gray-500"
            />
            <FloatingInput 
                id="phone" 
                label="Téléphone" 
                value={formData.phone} 
                onChange={handleChange} 
                type="tel"
            />
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Lock size={18} /> Mot de passe
            </div>
            <button type="button" className="text-sm font-bold text-green-600 hover:underline">
                Changer le mot de passe
            </button>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Bell className="text-yellow-500" size={20} /> Préférences
        </h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-slate-900">Réponses aux annonces</p>
                    <p className="text-sm text-gray-500">Être notifié par email quand un étudiant postule</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.notifications.applications} onChange={() => handleToggle('applications')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-slate-900">Messages</p>
                    <p className="text-sm text-gray-500">Notifications pour les messages directs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.notifications.messages} onChange={() => handleToggle('messages')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
            type="submit" 
            disabled={isSaving}
            className="px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20"
        >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Enregistrer
        </button>
      </div>

    </form>
  );
};

export default IndividualSettings;
