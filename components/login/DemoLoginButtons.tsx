
import React from 'react';
import { Info } from 'lucide-react';

interface DemoLoginButtonsProps {
  fillDemoCredentials: (role: 'student' | 'company' | 'individual') => void;
}

const DemoLoginButtons: React.FC<DemoLoginButtonsProps> = ({ fillDemoCredentials }) => {
  return (
    <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <Info size={14} /> Remplir avec un compte de démonstration
        </div>
        <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => fillDemoCredentials('student')} className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors">
                Étudiant
            </button>
            <button type="button" onClick={() => fillDemoCredentials('company')} className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors">
                Entreprise
            </button>
            <button type="button" onClick={() => fillDemoCredentials('individual')} className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors">
                Particulier
            </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Ces boutons remplissent le formulaire avec le mot de passe initial « password123 ». Si vous l’avez changé, saisissez votre nouveau mot de passe.</p>
    </div>
  );
};

export default DemoLoginButtons;
