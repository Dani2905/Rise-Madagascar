import React, { useState, useEffect } from 'react';
import { Save, Loader2, ArrowLeft, Lightbulb, Plus, X, Trash2, Users, TrendingUp, Hash, AlertCircle } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';

interface ProjectFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    need: '',
    stage: 'Idée',
    description: '', // Le pitch court
    problem: '',     // Nouveau
    solution: '',    // Nouveau
    progress: 0,
    tags: [] as string[], // Nouveau
    team: [] as { name: string; role: string }[], // Nouveau
    roadmap: [] as { date: string; title: string; done: boolean }[] // Nouveau
  });
  
  // Temporary states for array inputs
  const [tagInput, setTagInput] = useState('');
  const [memberInput, setMemberInput] = useState({ name: '', role: '' });
  const [roadmapInput, setRoadmapInput] = useState({ date: '', title: '' });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
        setFormData({
            title: initialData.title || '',
            category: initialData.category || '',
            need: initialData.need || '',
            stage: initialData.stage || 'Idée',
            description: initialData.description || '',
            problem: initialData.problem || '',
            solution: initialData.solution || '',
            progress: initialData.progress || 0,
            tags: initialData.tags || [],
            team: initialData.team || [],
            roadmap: initialData.roadmap || []
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // --- Handlers pour les Tags ---
  const addTag = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
          setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
          setTagInput('');
      }
  };
  const removeTag = (tagToRemove: string) => {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  // --- Handlers pour l'Équipe ---
  const addMember = () => {
      if (memberInput.name && memberInput.role) {
          setFormData(prev => ({ ...prev, team: [...prev.team, { ...memberInput }] }));
          setMemberInput({ name: '', role: '' });
      }
  };
  const removeMember = (idx: number) => {
      setFormData(prev => ({ ...prev, team: prev.team.filter((_, i) => i !== idx) }));
  };

  // --- Handlers pour la Roadmap ---
  const addMilestone = () => {
      if (roadmapInput.date && roadmapInput.title) {
          setFormData(prev => ({ ...prev, roadmap: [...prev.roadmap, { ...roadmapInput, done: false }] }));
          setRoadmapInput({ date: '', title: '' });
      }
  };
  const removeMilestone = (idx: number) => {
      setFormData(prev => ({ ...prev, roadmap: prev.roadmap.filter((_, i) => i !== idx) }));
  };
  const toggleMilestone = (idx: number) => {
      setFormData(prev => ({
          ...prev,
          roadmap: prev.roadmap.map((m, i) => i === idx ? { ...m, done: !m.done } : m)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.need) { setError('Renseignez le nom, la catégorie, le besoin et la description du projet.'); return; }
    setError('');
    setIsSaving(true);
    // Le parent vérifie le rôle et l’abonnement au moment de la sauvegarde.
    onSave({ ...formData, title: formData.title.trim(), description: formData.description.trim() });
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
            <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="text-primary" /> 
                {initialData ? "Modifier le projet" : "Nouveau Projet"}
            </h2>
            <button 
                onClick={onCancel}
                className="text-sm font-bold text-gray-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
                <ArrowLeft size={16} /> Retour à la liste
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <div>
                    <strong>Conseil :</strong> Décrivez clairement le problème que vous résolvez. Présentez votre équipe et les prochaines étapes de façon claire.
                </div>
            </div>

            {/* SECTION 1: ESSENTIELS */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">L'Essentiel</h3>
                <div className="space-y-6">
                    <FloatingInput 
                        id="title" 
                        label="Nom du projet" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <select
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                            >
                                <option value="" disabled hidden></option>
                                <option value="Tech">Tech & App</option>
                                <option value="Agritech">Agritech</option>
                                <option value="Écologie">Écologie</option>
                                <option value="Social">Social</option>
                                <option value="Art">Art & Design</option>
                                <option value="Services">Services</option>
                            </select>
                            <label htmlFor="category" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
                                Catégorie
                            </label>
                        </div>
                        
                        <div className="relative">
                            <select
                                id="need"
                                value={formData.need}
                                onChange={handleChange}
                                required
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                            >
                                <option value="" disabled hidden></option>
                                <option value="Financement">Financement</option>
                                <option value="Mentorat">Mentorat</option>
                                <option value="Partenariat">Partenariat</option>
                                <option value="Visibilité">Visibilité</option>
                                <option value="Co-fondateur">Co-fondateur</option>
                            </select>
                            <label htmlFor="need" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
                                Besoin principal
                            </label>
                        </div>
                    </div>

                    <FloatingTextArea 
                        id="description" 
                        label="Pitch du projet (Description courte)" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required
                        className="min-h-[100px]"
                    />
                </div>
            </section>

            {/* SECTION 2: NARRATIF */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Le Narratif</h3>
                <div className="space-y-6">
                    <FloatingTextArea 
                        id="problem" 
                        label="Le Problème (Quel besoin identifiez-vous ?)" 
                        value={formData.problem} 
                        onChange={handleChange} 
                        className="min-h-[120px]"
                    />
                    <FloatingTextArea 
                        id="solution" 
                        label="La Solution (Comment y répondez-vous ?)" 
                        value={formData.solution} 
                        onChange={handleChange} 
                        className="min-h-[120px]"
                    />
                </div>
            </section>

            {/* SECTION 3: STATUS & TAGS */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Détails & Mots-clés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div className="relative">
                        <select
                            id="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[52px]"
                        >
                            <option value="Idée">Idée</option>
                            <option value="Prototype">Prototype</option>
                            <option value="MVP">MVP (Produit Minimum)</option>
                            <option value="En activité">En activité</option>
                        </select>
                        <label htmlFor="stage" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
                            Stade d'avancement
                        </label>
                    </div>

                    <FloatingInput 
                        id="progress" 
                        type="number"
                        min="0"
                        max="100"
                        label="Progression (%)" 
                        value={formData.progress} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Tags Management */}
                <div className="relative">
                    <div className="flex gap-2 items-center mb-2">
                        <Hash size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">Mots-clés</span>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Ajouter un tag (ex: React, Agriculture...)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                        />
                        <button type="button" onClick={() => addTag()} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                #{tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: EQUIPE */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Users size={20} className="text-primary" /> L'Équipe
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input 
                        type="text" 
                        placeholder="Nom du membre"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        value={memberInput.name}
                        onChange={(e) => setMemberInput(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Rôle (ex: Dév, Marketing)"
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            value={memberInput.role}
                            onChange={(e) => setMemberInput(prev => ({ ...prev, role: e.target.value }))}
                        />
                        <button type="button" onClick={addMember} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700">
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {formData.team.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Aucun membre ajouté.</p>
                    ) : (
                        formData.team.map((member, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <span className="font-bold text-slate-900">{member.name}</span>
                                    <span className="text-gray-500 text-xs ml-2">({member.role})</span>
                                </div>
                                <button type="button" onClick={() => removeMember(idx)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* SECTION 5: ROADMAP */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-500" /> Roadmap
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <input 
                        type="text" 
                        placeholder="Date (ex: Jan 2024)"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        value={roadmapInput.date}
                        onChange={(e) => setRoadmapInput(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <div className="md:col-span-2 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Jalon (ex: Lancement Bêta)"
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            value={roadmapInput.title}
                            onChange={(e) => setRoadmapInput(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <button type="button" onClick={addMilestone} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700">
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-2 before:w-0.5 before:bg-gray-100 before:h-full before:content-['']">
                    {formData.roadmap.length === 0 ? (
                        <p className="text-sm text-gray-400 italic pl-6">Aucune étape définie.</p>
                    ) : (
                        formData.roadmap.map((step, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 relative pl-8 ml-2">
                                <span className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-200 ${step.done ? 'bg-green-500' : 'bg-white'}`}></span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase">{step.date}</span>
                                        <span className="font-bold text-slate-900">{step.title}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 mr-4">
                                        <input type="checkbox" checked={step.done} onChange={() => toggleMilestone(idx)} className="rounded text-primary focus:ring-0 cursor-pointer" />
                                        Fait
                                    </label>
                                    <button type="button" onClick={() => removeMilestone(idx)} className="text-gray-400 hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Mettre à jour" : "Publier le projet"}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ProjectForm;