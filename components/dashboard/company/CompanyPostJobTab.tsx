import React, { useState, useEffect } from 'react';
import { Save, Loader2, Briefcase, Zap, User } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../../FloatingInput';
import { useAuth } from '../../../context/AuthContext';
import { useSubscription } from '../../../context/SubscriptionContext';
import { canPerformAction } from '../../../utils/subscription';
import { PROVINCES, inferProvince } from '../../../utils/provinces';


interface CompanyPostJobTabProps {
  onSave: (jobData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const CompanyPostJobTab: React.FC<CompanyPostJobTabProps> = ({ onSave, onCancel, initialData }) => {
  const { user } = useAuth();
  const { openSubscription } = useSubscription();
  const isIndividual = user?.role === 'individual';

  const [formData, setFormData] = useState({
    title: '',
    type: isIndividual ? 'Job étudiant' : '',
    location: user?.location || 'Antananarivo',
    province: user?.location ? inferProvince(user.location) || '' : '',
    salary: '',
    remote: false,
    isUrgent: false,
    duration: '',
    description: '',
    experienceLevel: '',
    requirements: '',
    benefits: '',
    candidates: 0,
    status: 'Actif',
    posted: 'À l\'instant'
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
        setFormData({
            title: initialData.title || '',
            type: initialData.type || (isIndividual ? 'Job étudiant' : 'Stage'),
            location: initialData.location || user?.location || 'Antananarivo',
            province: initialData.province || inferProvince(initialData.location || '') || '',
            salary: initialData.salary || '',
            remote: initialData.remote === true,
            isUrgent: initialData.isUrgent === true,
            duration: initialData.duration || '',
            description: initialData.description || '',
            experienceLevel: initialData.experienceLevel || '',
            requirements: initialData.requirements || '',
            benefits: initialData.benefits || '',
            candidates: initialData.candidates || 0,
            status: initialData.status || 'Actif',
            posted: initialData.posted || 'À l\'instant'
        });
    } else {
        setFormData({
            title: '',
            type: isIndividual ? 'Job étudiant' : '',
            location: user?.location || 'Antananarivo',
            province: user?.location ? inferProvince(user.location) || '' : '',
            salary: '',
            remote: false,
            isUrgent: false,
            duration: '',
            description: '',
            experienceLevel: '',
            requirements: '',
            benefits: '',
            candidates: 0,
            status: 'Actif',
            posted: 'À l\'instant'
        });
    }
  }, [initialData, user?.location, isIndividual]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.role !== 'company' && user.role !== 'individual') return;
    if (!canPerformAction(user, 'publishOffer')) {
        if (window.Toastify) {
            window.Toastify({
                text: `Un abonnement ${user.role === 'company' ? 'entreprise' : 'particulier'} actif est nécessaire pour publier une annonce.`,
                style: { background: "#ef4444" }
            }).showToast();
        }
        openSubscription();
        return;
    }

    setIsSaving(true);
    
    // Construction de l'objet Job complet avec les métadonnées du recruteur
    const jobPayload = {
        ...formData,
        // --- CLÉS DE PROPRIÉTÉ (HIERARCHIE DE FIABILITÉ) ---
        ownerId: user.id,       // NIVEAU 1: L'ID unique (Le plus fiable)
        ownerEmail: user.email, // NIVEAU 2: L'email (Secondaire)
        
        // Données d'affichage (instantané au moment de la publication)
        company: user.companyName || `${user.firstName} ${user.lastName}`, 
        logoUrl: user.logoUrl || user.avatarUrl, 
        
        // Métadonnées par défaut
        isUrgent: formData.isUrgent,
        remote: formData.remote,
        tags: [formData.type, isIndividual ? "Particulier" : "Entreprise"],
        postedAt: initialData?.postedAt || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    onSave(jobPayload);
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-fade-in">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-center">
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className={`p-2 rounded-xl flex items-center justify-center ${isIndividual ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    {isIndividual ? <User size={20} /> : <Briefcase size={20} />}
                </div>
                {initialData ? "Modifier l'annonce" : (isIndividual ? "Nouvelle Annonce Perso" : "Nouvelle Offre Pro")}
            </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {isIndividual && (
                <div className="bg-green-50 text-green-800 text-sm p-4 rounded-2xl flex items-start gap-4 border border-green-200/60 shadow-sm">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-green-600">
                      <Zap size={18} />
                    </div>
                    <div className="pt-1.5">
                        <strong className="block mb-1">Besoin d'aide ?</strong>
                        Décrivez simplement votre besoin (ex: "Besoin de 2 étudiants pour un déménagement ce samedi").
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <FloatingInput 
                    id="title" 
                    label={isIndividual ? "Titre (ex: Soutien scolaire Maths)" : "Titre du poste"} 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <select
                            id="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-2xl appearance-none focus:outline-none focus:border-slate-900 peer border border-gray-200 h-[60px]"
                        >
                            <option value="" disabled hidden></option>
                            {isIndividual ? (
                                <>
                                    <option value="Job étudiant">Job étudiant (Régulier)</option>
                                    <option value="Mission">Mission (Ponctuel)</option>
                                    <option value="Freelance">Freelance (Projet)</option>
                                </>
                            ) : (
                                <>
                                    <option value="Stage">Stage</option>
                                    <option value="Alternance">Alternance</option>
                                    <option value="CDD">CDD</option>
                                    <option value="CDI">CDI</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Job étudiant">Job étudiant</option>
                                    <option value="Mission">Mission ponctuelle</option>
                                </>
                            )}
                        </select>
                        <label className="absolute text-[11px] font-bold text-gray-400 uppercase tracking-widest duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white px-2 pointer-events-none left-3">
                            Type de contrat
                        </label>
                    </div>
                    
                    <FloatingInput 
                        id="location" 
                        label="Lieu (Quartier/Ville)" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="relative">
                    <select
                        id="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-2xl focus:outline-none focus:border-slate-900 border border-gray-200 h-[60px]"
                    >
                        <option value="" disabled>Choisir une province</option>
                        {PROVINCES.map(province => <option key={province} value={province}>{province}</option>)}
                    </select>
                    <label htmlFor="province" className="absolute text-[11px] font-bold text-gray-400 uppercase tracking-widest -translate-y-3 scale-75 top-3 origin-[0] bg-white px-2 left-3">
                        Province de l'offre
                    </label>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-700">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.remote} onChange={e => setFormData(prev => ({ ...prev, remote: e.target.checked }))} /> 100 % en télétravail</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isUrgent} onChange={e => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))} /> Offre urgente</label>
                </div>

                <FloatingInput 
                    id="salary" 
                    label={isIndividual ? "Budget / Rémunération (ex: 50.000 Ar)" : "Salaire / Indemnité (ex: 500.000 Ar)"} 
                    value={formData.salary} 
                    onChange={handleChange} 
                />

                <div className="relative">
                    <select
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-2xl appearance-none focus:outline-none focus:border-slate-900 peer border border-gray-200 h-[60px]"
                    >
                        <option value="" disabled hidden></option>
                        <option value="Débutant">Débutant (0-1 an)</option>
                        <option value="Junior">Junior (1-3 ans)</option>
                        <option value="Confirmé">Confirmé (3-5 ans)</option>
                        <option value="Senior">Senior (5+ ans)</option>
                    </select>
                    <label className="absolute text-[11px] font-bold text-gray-400 uppercase tracking-widest duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white px-2 pointer-events-none left-3">
                        Niveau d'expérience
                    </label>
                </div>

                {['Stage', 'Alternance', 'Job étudiant'].includes(formData.type) && (
                    <FloatingInput 
                        id="duration" 
                        label="Durée (ex: 3 mois, 1 an)" 
                        value={formData.duration} 
                        onChange={handleChange} 
                    />
                )}

                <FloatingTextArea 
                    id="description" 
                    label="Description détaillée du poste" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required
                    className="min-h-[150px]"
                />

                <FloatingTextArea 
                    id="requirements" 
                    label="Compétences et Profil recherché" 
                    value={formData.requirements} 
                    onChange={handleChange} 
                    className="min-h-[100px]"
                />

                <FloatingTextArea 
                    id="benefits" 
                    label="Avantages (Tickets resto, mutuelle, etc.)" 
                    value={formData.benefits} 
                    onChange={handleChange} 
                    className="min-h-[100px]"
                />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-6 py-3.5 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`px-8 py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${isIndividual ? 'bg-green-500 shadow-green-500/20' : 'bg-slate-900 shadow-slate-900/20'}`}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Enregistrer les modifications" : "Publier l'annonce"}
                </button>
            </div>
        </form>
    </div>
  );
};

export default CompanyPostJobTab;
