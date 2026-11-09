import React, { useEffect } from 'react';
import { ArrowRight, Loader2, GraduationCap, Building2, User, Rocket, Quote, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormFields } from '../components/register/RegisterFormFields';
import { FileUpload } from '../components/register/FileUpload';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();
  
  const {
    accountType,
    handleAccountTypeChange,
    formData,
    file,
    status,
    uploadProgress,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit
  } = useRegisterForm();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate('/profile');
      // Optionnel : Afficher un toast pour expliquer pourquoi
      // window.Toastify(...).showToast(); 
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) return null; // Évite le flash du formulaire pendant le chargement

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 border-r border-gray-100">
        <div className="mx-auto w-full max-w-md">
            
            <div className="mb-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-900 mb-6 shadow-lg shadow-primary/20">
                    <Rocket size={24} />
                </div>
                <h2 className="text-3xl font-heading font-extrabold text-slate-900">
                    Rejoignez l'aventure
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Créez votre profil et accédez aux meilleures opportunités à Madagascar.
                </p>
            </div>

            {/* Account Type Selector - Highlighted Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => handleAccountTypeChange('student')}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                        accountType === 'student' 
                        ? 'border-primary bg-yellow-50/50 text-slate-900 shadow-lg shadow-primary/10 scale-105 z-10' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {accountType === 'student' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check size={10} className="text-slate-900" />
                        </div>
                    )}
                    <div className={`p-2.5 rounded-xl mb-2 transition-colors ${accountType === 'student' ? 'bg-primary text-slate-900' : 'bg-gray-100 text-gray-500'}`}>
                        <GraduationCap size={20} />
                    </div>
                    <span className="text-xs font-bold">Étudiant</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleAccountTypeChange('company')}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                        accountType === 'company' 
                        ? 'border-primary bg-yellow-50/50 text-slate-900 shadow-lg shadow-primary/10 scale-105 z-10' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                     {accountType === 'company' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check size={10} className="text-slate-900" />
                        </div>
                    )}
                    <div className={`p-2.5 rounded-xl mb-2 transition-colors ${accountType === 'company' ? 'bg-primary text-slate-900' : 'bg-gray-100 text-gray-500'}`}>
                        <Building2 size={20} />
                    </div>
                    <span className="text-xs font-bold">Recruteur</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleAccountTypeChange('individual')}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                        accountType === 'individual' 
                        ? 'border-primary bg-yellow-50/50 text-slate-900 shadow-lg shadow-primary/10 scale-105 z-10' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                     {accountType === 'individual' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check size={10} className="text-slate-900" />
                        </div>
                    )}
                    <div className={`p-2.5 rounded-xl mb-2 transition-colors ${accountType === 'individual' ? 'bg-primary text-slate-900' : 'bg-gray-100 text-gray-500'}`}>
                        <User size={20} />
                    </div>
                    <span className="text-xs font-bold">Perso</span>
                </button>
            </div>
            
            <div className="mb-8 text-center animate-fade-in">
                 <p className="text-xs font-medium text-gray-500 bg-gray-50 py-2.5 px-4 rounded-xl inline-block border border-gray-100">
                    {accountType === 'student' && "🎓 Trouvez un stage ET publiez vos projets innovants."}
                    {accountType === 'company' && "🏢 Publiez vos offres et accédez à la CVthèque."}
                    {accountType === 'individual' && "🏠 Trouvez de l'aide ponctuelle (cours, baby-sitting...)."}
                 </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                
                <RegisterFormFields 
                    accountType={accountType}
                    formData={formData} 
                    onChange={handleInputChange} 
                />

                {accountType === 'student' && (
                    <FileUpload 
                        file={file}
                        status={status}
                        progress={uploadProgress}
                        onFileChange={handleFileChange}
                        onRemove={removeFile}
                    />
                )}

                {/* Terms Checkbox */}
                <div className="flex items-center">
                    <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    J'accepte les <a href="#" className="text-primary hover:underline font-bold">conditions d'utilisation</a>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-900" />
                        Traitement en cours...
                    </>
                    ) : (
                    <>
                        {accountType === 'student' ? 'Créer mon compte Étudiant' : accountType === 'company' ? 'Créer un compte Recruteur' : 'Créer un compte Perso'}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 mt-8">
                Déjà inscrit ? <Link to="/login" className="font-bold text-primary hover:text-yellow-600 transition-colors">Se connecter</Link>
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900 overflow-hidden">
         <img 
            className="absolute inset-0 h-full w-full object-cover opacity-80" 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop" 
            alt="Team working" 
         />
         {/* Overlay Gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-primary/10 mix-blend-multiply"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

         <div className="absolute bottom-0 left-0 p-16 text-white z-10 max-w-2xl">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 text-primary border border-white/20">
                <Quote size={20} className="fill-current" />
            </div>
            <blockquote className="text-2xl font-heading font-bold leading-relaxed mb-6">
                "Grâce à Rise, nous avons recruté 5 stagiaires talentueux de l'ESPA en moins d'une semaine. Une efficacité redoutable pour notre startup."
            </blockquote>
            <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Sarah+Rakoto&background=random" alt="User" className="w-12 h-12 rounded-full border-2 border-primary" />
                <div>
                    <div className="font-bold text-white">Sarah Rakoto</div>
                    <div className="text-slate-400 text-sm">DRH chez TechMada</div>
                </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Register;