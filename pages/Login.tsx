
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoginLogic } from '../hooks/useLoginLogic';

// Sub-components
import LoginHeader from '../components/login/LoginHeader';
import DemoLoginButtons from '../components/login/DemoLoginButtons';
import LoginForm from '../components/login/LoginForm';
import SocialLogin from '../components/login/SocialLogin';
import LoginVisuals from '../components/login/LoginVisuals';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();
  
  // Custom Hook for Logic
  const { 
    formData, 
    isSubmitting, 
    handleInputChange, 
    fillDemoCredentials, 
    handleSubmit 
  } = useLoginLogic();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 border-r border-gray-100">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            
            <LoginHeader />

            <DemoLoginButtons fillDemoCredentials={fillDemoCredentials} />

            <LoginForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit} 
                isSubmitting={isSubmitting} 
            />

            <SocialLogin />
            
            <p className="text-center text-sm text-gray-500 mt-8">
                Pas encore de compte ? <Link to="/register" className="font-bold text-primary hover:text-yellow-600 transition-colors">S'inscrire gratuitement</Link>
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <LoginVisuals />

    </div>
  );
};

export default Login;
