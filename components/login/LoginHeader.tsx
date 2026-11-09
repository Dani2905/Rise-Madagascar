
import React from 'react';
import { Rocket } from 'lucide-react';

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-10">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-900 mb-6 shadow-lg shadow-primary/20">
            <Rocket size={24} />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-slate-900">
            Bon retour !
        </h2>
        <p className="mt-2 text-sm text-gray-500">
            Connectez-vous pour accéder à votre espace Rise.
        </p>
    </div>
  );
};

export default LoginHeader;
