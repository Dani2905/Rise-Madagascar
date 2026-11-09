import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationStatus } from '../types';
import { useAuth, User } from '../context/AuthContext';

declare global {
  interface Window {
    Toastify: any;
  }
}

export type AccountType = 'student' | 'company' | 'individual';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>('student');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', 
    // Student fields
    school: '',
    studyField: '',
    studyLevel: '', 
    birthDate: '',  
    // Recruiter fields
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    position: '',   
    // Individual fields
    phone: '',      
    city: '',
    address: '' // Quartier/Adresse for individuals
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<ApplicationStatus>(ApplicationStatus.IDLE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when switching account type
  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    setFile(null);
    setStatus(ApplicationStatus.IDLE);
    setUploadProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        window.Toastify({
          text: "Le fichier est trop volumineux (Max 5MB)",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#ef4444" }
        }).showToast();
        return;
      }

      setFile(selectedFile);
      setStatus(ApplicationStatus.UPLOADING);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(ApplicationStatus.IDLE);
    setUploadProgress(0);
  };

  // Simulation de l'upload
  useEffect(() => {
    if (status === ApplicationStatus.UPLOADING) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus(ApplicationStatus.SUCCESS);
            window.Toastify({
              text: "CV téléchargé avec succès !",
              duration: 2000,
              gravity: "top",
              position: "right",
              style: { background: "linear-gradient(to right, #10B981, #059669)" }
            }).showToast();
            return 100;
          }
          return Math.min(prev + (Math.random() * 15 + 5), 100);
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation Mot de passe
    if (formData.password !== formData.confirmPassword) {
        window.Toastify({
            text: "Les mots de passe ne correspondent pas.",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: { background: "#ef4444" }
          }).showToast();
          return;
    }
    
    // Validation spécifique pour les étudiants (CV obligatoire)
    if (accountType === 'student' && !file && status !== ApplicationStatus.SUCCESS) {
       window.Toastify({
          text: "Veuillez télécharger votre CV.",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#ef4444" }
        }).showToast();
        return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Création de l'objet utilisateur complet
      const newUser: User = {
        ...formData,
        role: accountType,
        cvName: file?.name,
        registeredAt: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      };

      // 2. Sauvegarde dans une "Base de données" simulée (localStorage)
      const existingUsersStr = localStorage.getItem('rise_db_users');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      existingUsers.push(newUser);
      localStorage.setItem('rise_db_users', JSON.stringify(existingUsers));

      // 3. Login immédiat via le contexte
      login(newUser, `token-${Date.now()}`);

      setIsSubmitting(false);

      window.Toastify({
        text: `Bienvenue ${formData.firstName} ! Redirection vers votre espace...`,
        duration: 2000,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #3B82F6, #10B981)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          fontWeight: "500"
        },
      }).showToast();

      // 4. Redirection vers le profil
      setTimeout(() => {
          navigate('/profile');
      }, 1000);

    }, 1500);
  };

  return {
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
  };
};