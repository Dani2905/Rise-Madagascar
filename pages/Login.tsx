
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { returnPathForRole } from '../utils/localAuth';

// Sub-components
import LoginHeader from '../components/login/LoginHeader';
import DemoLoginButtons from '../components/login/DemoLoginButtons';
import LoginForm from '../components/login/LoginForm';
import LoginVisuals from '../components/login/LoginVisuals';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Custom Hook for Logic
  const { 
    formData, 
    isSubmitting,
    error,
    handleInputChange, 
    fillDemoCredentials, 
    handleSubmit 
  } = useLoginLogic();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate(returnPathForRole(location.state?.returnTo, user?.role || ''), { replace: true, state: location.state?.returnState });
    }
  }, [isLoading, isLoggedIn, navigate, location.state, user?.role]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 border-r border-gray-100">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            
            <LoginHeader />

            <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><strong>Démonstration locale :</strong> les comptes et la session restent dans ce navigateur. Il n’y a pas de sécurité serveur ni de récupération par e-mail. N’utilisez pas un mot de passe réel ou réutilisé.</p>
            <DemoLoginButtons fillDemoCredentials={fillDemoCredentials} />

            <LoginForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                error={error}
            />

            
            <p className="text-center text-sm text-gray-500 mt-8">
                Pas encore de compte ? <Link to="/register" state={location.state} className="font-bold text-primary hover:text-yellow-600 transition-colors">S'inscrire gratuitement</Link>
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <LoginVisuals />

    </div>
  );
};

export default Login;
