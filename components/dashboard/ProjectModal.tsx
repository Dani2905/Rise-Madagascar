import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Lightbulb } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: any) => void;
  initialData?: any;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    need: '',
    stage: 'Idée',
    description: '',
    progress: 0
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                category: initialData.category || '',
                need: initialData.need || '',
                stage: initialData.stage || 'Idée',
                description: initialData.description || '',
                progress: initialData.progress || 0
            });
        } else {
            setFormData({
                title: '',
                category: '',
                need: '',
                stage: 'Idée',
                description: '',
                progress: 0
            });
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-8 py-5 border-b border-gray-100 flex justify-between items-center shadow-sm">
            <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="text-primary" /> {initialData ? "Modifier le projet" : "Nouveau Projet"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
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
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
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
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
                        Besoin principal
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none left-1">
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

            <FloatingTextArea 
                id="description" 
                label="Pitch du projet (Description courte)" 
                value={formData.description} 
                onChange={handleChange} 
                required
                className="min-h-[120px]"
            />

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onClose}
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
                    {initialData ? "Mettre à jour" : "Créer le projet"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;