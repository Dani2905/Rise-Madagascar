
import React from 'react';
import { Quote } from 'lucide-react';

const LoginVisuals: React.FC = () => {
  return (
    <div className="hidden lg:block relative w-0 flex-1 bg-slate-900 overflow-hidden">
         <img 
            className="absolute inset-0 h-full w-full object-cover opacity-80" 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
            alt="Students collaborating" 
         />
         {/* Overlay Gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-primary/10 mix-blend-multiply"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

         <div className="absolute bottom-0 left-0 p-16 text-white z-10 max-w-2xl">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 text-primary border border-white/20">
                <Quote size={20} className="fill-current" />
            </div>
            <blockquote className="text-2xl font-heading font-bold leading-relaxed mb-6">
                "Rise m'a permis de décrocher mon premier contrat freelance avec une entreprise internationale, tout en poursuivant mes études à Tana."
            </blockquote>
            <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Hery+Rajaonarivelo&background=random" alt="User" className="w-12 h-12 rounded-full border-2 border-primary" />
                <div>
                    <div className="font-bold text-white">Hery Rajaonarivelo</div>
                    <div className="text-slate-400 text-sm">Développeur Fullstack (Freelance)</div>
                </div>
            </div>
         </div>
      </div>
  );
};

export default LoginVisuals;
