import React, { useEffect } from 'react';
import { ArrowRight, Loader2, GraduationCap, Building2, User, Rocket, Check } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RegisterFormFields } from '../components/register/RegisterFormFields';
import { FileUpload } from '../components/register/FileUpload';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { useAuth } from '../context/AuthContext';
import { returnPathForRole } from '../utils/localAuth';
import LoginVisuals from '../components/login/LoginVisuals';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();
  
  const {
    accountType,
    handleAccountTypeChange,
    formData,
    file,
    isSubmitting,
    error,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit
  } = useRegisterForm();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate(returnPathForRole(location.state?.returnTo, user?.role || ''), { replace: true, state: location.state?.returnState });
      // Optionnel : Afficher un toast pour expliquer pourquoi
      // window.Toastify(...).showToast(); 
    }
  }, [isLoading, isLoggedIn, navigate, location.state, user?.role]);

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
                <h1 className="text-3xl font-heading font-extrabold text-slate-900">
                    Rejoignez l'aventure
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Créez votre profil pour découvrir Rise Madagascar.
                </p>
            </div>

            <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><strong>Démonstration locale :</strong> ce compte n’existe que dans ce navigateur, sans serveur ni récupération par e-mail. Utilisez des informations fictives et un mot de passe non réutilisé : ces données ne sont pas sécurisées.</p>
            <p className="text-sm font-bold text-slate-800 mb-3" id="register-role-label">Choisissez votre profil</p>
            {/* Account Type Selector - Highlighted Cards */}
            <div role="group" aria-labelledby="register-role-label" className="grid grid-cols-3 gap-3 mb-6">
                <button
                    type="button"
                    aria-pressed={accountType === 'student'} disabled={isSubmitting}
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
                    aria-pressed={accountType === 'company'} disabled={isSubmitting}
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
                    <span className="text-xs font-bold">Entreprise</span>
                </button>

                <button
                    type="button"
                    aria-pressed={accountType === 'individual'} disabled={isSubmitting}
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
                    <span className="text-xs font-bold">Particulier</span>
                </button>
            </div>
            
            <div className="mb-8 text-center animate-fade-in">
                 <p className="text-xs font-medium text-gray-500 bg-gray-50 py-2.5 px-4 rounded-xl inline-block border border-gray-100">
                    {accountType === 'student' && "🎓 Trouvez un stage ET publiez vos projets innovants."}
                    {accountType === 'company' && "🏢 Publiez des offres et consultez les candidatures reçues."}
                    {accountType === 'individual' && "🏠 Trouvez de l'aide ponctuelle (cours, baby-sitting...)."}
                 </p>
            </div>

            <p className="text-xs text-slate-500 mb-6">L’inscription et la consultation sont gratuites. Un abonnement actif est nécessaire pour postuler ou publier, selon votre profil.</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <fieldset disabled={isSubmitting} className="space-y-6">
                <RegisterFormFields 
                    accountType={accountType}
                    formData={formData} 
                    onChange={handleInputChange} 
                />

                {accountType === 'student' && (
                    <FileUpload 
                        file={file}
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
                    Je comprends que ce compte est une démonstration locale non sécurisée.
                    </label>
                </div>

                </fieldset>
                {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
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
                        {accountType === 'student' ? 'Créer mon compte Étudiant' : accountType === 'company' ? 'Créer un compte Entreprise' : 'Créer un compte Particulier'}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 mt-8">
                Déjà inscrit ? <Link to="/login" state={location.state} className="font-bold text-primary hover:text-yellow-600 transition-colors">Se connecter</Link>
            </p>
        </div>
      </div>

      <LoginVisuals />
    </div>
  );
};

export default Register;