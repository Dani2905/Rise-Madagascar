import React from 'react';
import { GraduationCap, Building2, Lightbulb } from 'lucide-react';
const LoginVisuals: React.FC = () => (
  <div className="hidden lg:flex relative flex-1 bg-slate-900 overflow-hidden items-end">
    <img className="absolute inset-0 h-full w-full object-cover opacity-40" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
    <div className="relative p-16 text-white max-w-2xl">
      <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Rise Madagascar</p>
      <h2 className="text-3xl font-heading font-bold mb-5">Des opportunités et des projets pour les étudiants.</h2>
      <ul className="space-y-3 text-slate-200 text-sm"><li className="flex gap-3"><GraduationCap size={20} /> Explorer les offres étudiantes</li><li className="flex gap-3"><Lightbulb size={20} /> Présenter un projet étudiant</li><li className="flex gap-3"><Building2 size={20} /> Découvrir entreprises et particuliers</li></ul>
    </div>
  </div>
);
export default LoginVisuals;
