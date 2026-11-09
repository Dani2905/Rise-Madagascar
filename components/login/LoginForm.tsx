
import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { FloatingInput } from '../FloatingInput';

interface LoginFormProps {
  formData: { email: string; password: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleInputChange, handleSubmit, isSubmitting }) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <FloatingInput
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
            />
            
            <div className="relative">
                <FloatingInput
                    id="password"
                    type="password"
                    label="Mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <div className="flex justify-end mt-1">
                     <a href="#" className="text-xs font-bold text-primary hover:text-yellow-600 transition-colors">
                        Mot de passe oublié ?
                    </a>
                </div>
            </div>
        </div>

        <div className="flex items-center text-sm mb-6">
            <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" />
                <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">Se souvenir de moi</span>
            </label>
        </div>

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
