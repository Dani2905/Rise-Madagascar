
import React, { useState, useRef } from 'react';
import { Save, Loader2, Building2, User, Bell, Lock, Camera, Gift, Plus, X, Briefcase, Users as UsersIcon, Star } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    Toastify: any;
  }
}

interface CompanySettingsProps {
  data: any;
  onUpdate: (newData: any) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: data?.companyName || '',
    website: data?.website || '',
    location: data?.location || '',
    industry: data?.industry || '',
    companySize: data?.companySize || '',
    founded: data?.founded || '',
    description: data?.description || "Description courte...",
    bio: data?.bio || "",
    perks: Array.isArray(data?.perks) ? data.perks : [],
    contactName: (data?.firstName && data?.lastName) ? `${data.firstName} ${data.lastName}` : (data?.firstName || 'Recruteur'),
    // Ensure we read correct position or fallback
    contactRole: data?.position || data?.contactRole || 'RH',
    email: data?.email || '',
    notifications: {
      applications: true,
      messages: true,
      newsletter: false
    }
  });

  const [perkInput, setPerkInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleAddPerk = (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) e.preventDefault();
      const trimmed = perkInput.trim();
      if (trimmed && Array.isArray(formData.perks) && !formData.perks.includes(trimmed)) {
          setFormData(prev => ({ ...prev, perks: [...(prev.perks || []), trimmed] }));
          setPerkInput('');
      }
  };

  const handleRemovePerk = (perkToRemove: string) => {
      setFormData(prev => ({ ...prev, perks: (prev.perks || []).filter((p: string) => p !== perkToRemove) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              if (window.Toastify) window.Toastify({ text: "Image trop lourde (Max 2MB)", style: { background: "#ef4444" } }).showToast();
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdate({ logoUrl: reader.result as string });
              if (window.Toastify) window.Toastify({ text: "Logo mis à jour temporairement (Sauvegardez pour confirmer)", style: { background: "#3b82f6" } }).showToast();
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      try {
          const fullName = String(formData.contactName || '');
          const names = fullName.trim().split(' ');
          const firstName = names[0] || 'Prénom';
          const lastName = names.slice(1).join(' ') || '';

          onUpdate({
            companyName: formData.companyName || 'Mon Entreprise',
            website: formData.website,
            location: formData.location,
            industry: formData.industry,
            companySize: formData.companySize,
            founded: formData.founded,
            description: formData.description,
            bio: formData.bio,
            perks: formData.perks || [],
            // Securely update position without touching 'role'
            position: formData.contactRole,
            firstName: firstName,
            lastName: lastName,
          });
          
          if (window.Toastify) {
              window.Toastify({
                text: "Paramètres enregistrés !",
                style: { background: "linear-gradient(to right, #10B981, #059669)" }
              }).showToast();
          }
      } catch (error) {
          console.error("Save error:", error);
          if (window.Toastify) window.Toastify({ text: "Erreur lors de la sauvegarde", style: { background: "#ef4444" } }).showToast();
      } finally {
          setIsSaving(false);
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      
      {/* Subscription Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          {data?.hasSubscription && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10" />
          )}
          <h3 className="font-heading font-black text-xl text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
              <div className={`p-2 rounded-xl ${data?.hasSubscription ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                  <Star size={20} />
              </div>
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

      {/* 1. Informations Entreprise */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-black text-xl text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Building2 size={20} />
            </div>
            Profil Public
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-4">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-28 h-28 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-sm hover:border-blue-300 transition-all"
                >
                    <img src={data?.logoUrl || data?.avatarUrl || "https://via.placeholder.com/150"} alt="Logo" className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                        <Camera className="text-white drop-shadow-md" size={28} />
                    </div>
                </div>
                <span onClick={() => fileInputRef.current?.click()} className="text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-900 hover:underline">Changer le logo</span>
            </div>

            <div className="flex-1 space-y-5">
                <FloatingInput 
                    id="companyName" 
                    label="Nom de l'entreprise" 
                    value={formData.companyName} 
                    onChange={handleChange} 
                    required 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput 
                        id="website" 
                        label="Site Web" 
                        value={formData.website} 
                        onChange={handleChange} 
                    />
                    <FloatingInput 
                        id="location" 
                        label="Siège Social (Ville)" 
                        value={formData.location} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
        </div>

        {/* Détails Structurels (New) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
                <select
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                >
                    <option value="" disabled hidden></option>
                    <option value="Tech">Informatique / Tech</option>
                    <option value="Finance">Banque / Finance</option>
                    <option value="Telecom">Télécoms</option>
                    <option value="Marketing">Marketing / Com</option>
                    <option value="Industry">Industrie / BTP</option>
                    <option value="Services">Services</option>
                    <option value="Other">Autre</option>
                </select>
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1 flex items-center gap-1">
                    <Briefcase size={14} /> Secteur
                </label>
            </div>

            <div className="relative">
                <select
                    id="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                >
                    <option value="" disabled hidden></option>
                    <option value="1-10">1 - 10 employés</option>
                    <option value="11-50">11 - 50 employés</option>
                    <option value="51-200">51 - 200 employés</option>
                    <option value="200+">200+ employés</option>
                    <option value="1000+">1000+ employés</option>
                </select>
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1 flex items-center gap-1">
                    <UsersIcon size={14} /> Taille
                </label>
            </div>

            <FloatingInput 
                id="founded" 
                label="Année de création" 
                value={formData.founded} 
                onChange={handleChange} 
                type="text"
                placeholder="Ex: 2015"
            />
        </div>

        <FloatingInput 
            id="description" 
            label="Slogan / Description courte (apparaîtra sur vos offres)" 
            value={formData.description} 
            onChange={handleChange}
        />

        <FloatingTextArea 
            id="bio" 
            label="Histoire de l'entreprise & Culture (Section À Propos)" 
            value={formData.bio} 
            onChange={handleChange}
            className="h-40"
        />
      </div>

      {/* 2. Pourquoi nous rejoindre ? (Perks) */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-black text-xl text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                    <Gift size={20} />
                </div>
                Pourquoi nous rejoindre ?
            </h3>
            
            <div className="relative mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={perkInput}
                        onChange={(e) => setPerkInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPerk(e)}
                        className="flex-1 block px-5 py-4 w-full text-[15px] bg-slate-50 border border-gray-200/60 rounded-2xl focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:bg-white transition-all outline-none font-medium text-slate-900"
                        placeholder="Ex: Télétravail, Cantine, Mutuelle..."
                    />
                    <button 
                        type="button" 
                        onClick={handleAddPerk}
                        className="bg-slate-900 text-white px-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-md active:scale-95"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {Array.isArray(formData.perks) && formData.perks.length > 0 ? (
                    formData.perks.map((perk: string, index: number) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-bold border border-green-100 animate-fade-in">
                            {perk}
                            <button type="button" onClick={() => handleRemovePerk(perk)} className="hover:text-green-900 bg-green-100 rounded-full p-0.5 transition-colors">
                                <X size={12} />
                            </button>
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 w-full text-center">
                        Aucun avantage listé pour le moment.
                    </p>
                )}
            </div>
      </div>

      {/* 3. Contact Recruteur */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-black text-xl text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                <User size={20} />
            </div>
            Contact Recruteur (Privé)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput 
                id="contactName" 
                label="Nom du responsable" 
                value={formData.contactName} 
                onChange={handleChange} 
            />
            <FloatingInput 
                id="contactRole" 
                label="Intitulé du poste" 
                value={formData.contactRole} 
                onChange={handleChange} 
            />
            <FloatingInput 
                id="email" 
                label="Email de connexion" 
                value={formData.email} 
                onChange={handleChange} 
                type="email"
                disabled
                className="bg-gray-50 text-gray-500"
            />
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 text-sm">
                <Lock size={16} className="mr-2" /> Mot de passe <span className="ml-auto text-primary font-bold cursor-pointer hover:underline">Modifier</span>
            </div>
        </div>
      </div>

      {/* 4. Notifications & Préférences */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-black text-xl text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-yellow-50 text-yellow-500 rounded-xl">
                <Bell size={20} />
            </div>
            Notifications
        </h3>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-slate-900">Nouvelles candidatures</p>
                    <p className="text-sm text-gray-500">Recevoir un email à chaque postulation</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.notifications.applications} onChange={() => handleToggle('applications')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-slate-900">Messages directs</p>
                    <p className="text-sm text-gray-500">Recevoir une notif quand un candidat répond</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.notifications.messages} onChange={() => handleToggle('messages')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
            type="submit" 
            disabled={isSaving}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
        >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Enregistrer les modifications
        </button>
      </div>

    </form>
  );
};

export default CompanySettings;
