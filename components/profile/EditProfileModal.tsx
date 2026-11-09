import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2, GraduationCap, Briefcase, Globe, Code2 } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    title: '',
    school: '',
    studyField: '',
    studyLevel: '',
    location: '',
    phone: '',
    bio: '',
    skills: [] as string[],
    languages: [] as string[],
    education: [] as any[],
    experiences: [] as any[]
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser le formulaire avec les données actuelles à l'ouverture
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        birthDate: profile.birthDate || '',
        title: profile.title || '',
        school: profile.school || '',
        studyField: profile.studyField || '',
        studyLevel: profile.studyLevel || '',
        location: profile.location || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        languages: profile.languages || [],
        education: profile.education || [],
        experiences: profile.experiences || []
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // --- SKILLS MANAGEMENT ---
  const handleAddSkill = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput('');
    }
  };
  const handleRemoveSkill = (item: string) => {
      setFormData(prev => ({ ...prev, skills: prev.skills.filter(i => i !== item) }));
  };

  // --- LANGUAGES MANAGEMENT ---
  const handleAddLang = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = langInput.trim();
    if (trimmed && !formData.languages.includes(trimmed)) {
        setFormData(prev => ({ ...prev, languages: [...prev.languages, trimmed] }));
        setLangInput('');
    }
  };
  const handleRemoveLang = (item: string) => {
      setFormData(prev => ({ ...prev, languages: prev.languages.filter(i => i !== item) }));
  };

  // --- EDUCATION MANAGEMENT ---
  const addEducation = () => {
      setFormData(prev => ({
          ...prev,
          education: [...prev.education, { id: Date.now(), degree: '', school: '', date: '', mention: '' }]
      }));
  };
  const removeEducation = (index: number) => {
      setFormData(prev => ({
          ...prev,
          education: prev.education.filter((_, i) => i !== index)
      }));
  };
  const updateEducation = (index: number, field: string, value: string) => {
      const newEdu = [...formData.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      setFormData(prev => ({ ...prev, education: newEdu }));
  };

  // --- EXPERIENCE MANAGEMENT ---
  const addExperience = () => {
      setFormData(prev => ({
          ...prev,
          experiences: [...prev.experiences, { id: Date.now(), role: '', company: '', date: '', description: '' }]
      }));
  };
  const removeExperience = (index: number) => {
      setFormData(prev => ({
          ...prev,
          experiences: prev.experiences.filter((_, i) => i !== index)
      }));
  };
  const updateExperience = (index: number, field: string, value: string) => {
      const newExp = [...formData.experiences];
      newExp[index] = { ...newExp[index], [field]: value };
      setFormData(prev => ({ ...prev, experiences: newExp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content - Full screen on mobile, limited on desktop */}
      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl md:max-w-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-4 py-4 md:px-8 md:py-5 border-b border-gray-100 flex justify-between items-center shadow-sm flex-shrink-0">
            <h2 className="text-lg md:text-xl font-heading font-bold text-slate-900">Modifier mon profil</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Form Container with Scroll */}
        <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8 pb-24 md:pb-8">
                
                {/* 1. Informations Personnelles */}
                <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Informations Personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput id="firstName" label="Prénom" value={formData.firstName} onChange={handleChange} required />
                        <FloatingInput id="lastName" label="Nom" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput id="email" label="Email (Lecture seule)" value={formData.email} disabled className="bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed" />
                        <FloatingInput id="birthDate" type="date" label="Date de naissance" value={formData.birthDate} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput id="phone" label="Téléphone" value={formData.phone} onChange={handleChange} />
                        <FloatingInput id="location" label="Ville / Quartier" value={formData.location} onChange={handleChange} />
                    </div>
                    <FloatingTextArea id="bio" label="Bio / À propos de moi" value={formData.bio} onChange={handleChange} rows={3} />
                </section>

                {/* 2. Cursus Actuel */}
                <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Cursus Actuel</h3>
                    <FloatingInput id="title" label="Titre du profil (ex: Étudiant en Marketing)" value={formData.title} onChange={handleChange} className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput id="school" label="École / Université actuelle" value={formData.school} onChange={handleChange} />
                        <div className="relative mb-6">
                            <select
                                id="studyLevel"
                                value={formData.studyLevel}
                                onChange={handleChange}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                            >
                                <option value="" disabled hidden></option>
                                <option value="L1">L1</option>
                                <option value="L2">L2</option>
                                <option value="L3">L3</option>
                                <option value="M1">M1</option>
                                <option value="M2">M2</option>
                                <option value="PhD">Doctorat</option>
                            </select>
                            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none">Niveau</label>
                        </div>
                    </div>
                    <FloatingInput id="studyField" label="Filière / Domaine (ex: Informatique)" value={formData.studyField} onChange={handleChange} />
                </section>

                {/* 3. Compétences & Langues */}
                <section className="grid md:grid-cols-2 gap-8">
                    {/* Compétences */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <Code2 size={16} /> Compétences
                        </h3>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-0 peer"
                                placeholder=" "
                            />
                            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">Ajouter (ex: React, SEO...)</label>
                            <button type="button" onClick={() => handleAddSkill()} className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700">
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Langues */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <Globe size={16} /> Langues
                        </h3>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={langInput}
                                onChange={(e) => setLangInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLang())}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-0 peer"
                                placeholder=" "
                            />
                            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">Ajouter (ex: Anglais B2...)</label>
                            <button type="button" onClick={() => handleAddLang()} className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700">
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.languages.map((lang, index) => (
                                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                    {lang}
                                    <button type="button" onClick={() => handleRemoveLang(lang)} className="hover:text-red-500"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Formation (Education) */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <GraduationCap size={16} /> Formation
                        </h3>
                        <button type="button" onClick={addEducation} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-yellow-600 transition-colors">
                            <Plus size={14} /> Ajouter
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                                <button 
                                    type="button" 
                                    onClick={() => removeEducation(index)}
                                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                    <input 
                                        type="text" 
                                        placeholder="Diplôme (ex: Baccalauréat)"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="École (ex: Lycée Saint Michel)"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Année / Période (ex: 2021-2024)"
                                        value={edu.date}
                                        onChange={(e) => updateEducation(index, 'date', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Mention / Détails"
                                        value={edu.mention}
                                        onChange={(e) => updateEducation(index, 'mention', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                </div>
                            </div>
                        ))}
                        {formData.education.length === 0 && (
                            <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                Aucune formation ajoutée.
                            </p>
                        )}
                    </div>
                </section>

                {/* 5. Expériences */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Briefcase size={16} /> Expériences
                        </h3>
                        <button type="button" onClick={addExperience} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-yellow-600 transition-colors">
                            <Plus size={14} /> Ajouter
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.experiences.map((exp, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                                 <button 
                                    type="button" 
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                    <input 
                                        type="text" 
                                        placeholder="Poste (ex: Stagiaire Web)"
                                        value={exp.role}
                                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Entreprise (ex: Orange)"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Période (ex: Jan 2023 - Juin 2023)"
                                        value={exp.date}
                                        onChange={(e) => updateExperience(index, 'date', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    />
                                </div>
                                <div>
                                    <textarea 
                                        placeholder="Description des tâches..."
                                        value={exp.description}
                                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 resize-none h-20"
                                    />
                                </div>
                            </div>
                        ))}
                        {formData.experiences.length === 0 && (
                            <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                Aucune expérience ajoutée.
                            </p>
                        )}
                    </div>
                </section>
            </form>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="bg-white p-4 md:px-8 md:py-5 border-t border-gray-100 flex justify-end gap-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
            <button 
                type="button" 
                onClick={onClose}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-gray-50 transition-colors"
            >
                Annuler
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={isSaving}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Enregistrer
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;