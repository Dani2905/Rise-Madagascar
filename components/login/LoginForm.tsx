
import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { FloatingInput } from '../FloatingInput';

interface LoginFormProps {
  formData: { email: string; password: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleInputChange, handleSubmit, isSubmitting, error }) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <FloatingInput
                id="email"
                type="email"
                autoComplete="username"
                label="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
            />
            
            <div className="relative">
                <FloatingInput
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    label="Mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <p className="text-xs text-slate-500">La récupération de mot de passe n’est pas disponible dans cette version locale.</p>
            </div>
        </div>

        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
        <p className="text-xs text-slate-500">La session reste ouverte dans ce navigateur jusqu’à votre déconnexion.</p>

        <button
            type="submit"
            disabled={isSubmitting}
            className={`group w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
            {isSubmitting ? (
            <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-900" />
                Connexion...
            </>
            ) : (
            <>
                Se connecter
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
            )}
        </button>
    </form>
  );
};

export default LoginForm;
