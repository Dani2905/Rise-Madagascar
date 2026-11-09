import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth, User } from '../context/AuthContext';
import { createPasswordCredential, DEMO_EMAIL_ROLES, normalizeEmail, publicSessionUser, readLocalUsers, returnPathForRole } from '../utils/localAuth';
import { RegistrationFormData, RegistrationRole, validateRegistration, buildRegistrationProfile } from '../utils/registration';

declare global {
  interface Window {
    Toastify: any;
  }
}

export type AccountType = RegistrationRole;

const isValidAccountType = (value: string | null): value is AccountType =>
  value === 'student' || value === 'company' || value === 'individual';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();
  const initialTypeParam = searchParams.get('type');
  const [accountType, setAccountType] = useState<AccountType>(
    isValidAccountType(initialTypeParam) ? initialTypeParam : 'student'
  );

  useEffect(() => {
    const typeParam = searchParams.get('type');
    setAccountType(isValidAccountType(typeParam) ? typeParam : 'student');
  }, [searchParams]);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  // Conserver les champs communs et le brouillon ; seul le profil choisi sera enregistré.
  const handleAccountTypeChange = (type: AccountType) => {
    if (submitting.current || type === accountType) return;
    setAccountType(type);
    setError('');
    const next = new URLSearchParams(searchParams);
    next.set('type', type);
    setSearchParams(next, { replace: true, state: location.state });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (submitting.current) return;
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitting.current) return;
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.pdf') || selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError('Sélectionnez un PDF de 5 Mo maximum.');
      e.target.value = '';
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setError('');
    const email = normalizeEmail(formData.email);
    const validationError = validateRegistration(formData, accountType);
    if (validationError) { setError(validationError); return; }
    if (DEMO_EMAIL_ROLES[email]) { setError('Cette adresse est réservée à un compte de démonstration. Utilisez une autre adresse.'); return; }
    submitting.current = true; setIsSubmitting(true);
    let accountCreated = false;
    try {
      let users = readLocalUsers();
      if (users.some(u => typeof u?.email === 'string' && normalizeEmail(u.email) === email)) throw new Error('Un compte local utilise déjà cette adresse. Connectez-vous plutôt.');
      const credential = await createPasswordCredential(formData.password);
      users = readLocalUsers();
      if (users.some(u => typeof u?.email === 'string' && normalizeEmail(u.email) === email)) throw new Error('Un compte local utilise déjà cette adresse. Connectez-vous plutôt.');
      let id = Date.now();
      while (users.some(u => u?.id != null && String(u.id) === String(id))) id++;
      const profileData = buildRegistrationProfile(formData, accountType, accountType === 'student' ? file?.name : undefined);
      const newUser: User = { ...profileData, registeredAt: new Date().toISOString(), id, passwordCredential: credential };
      localStorage.setItem('rise_db_users', JSON.stringify([...users, newUser]));
      accountCreated = true;
      login(publicSessionUser(newUser), `demo-${Date.now()}`);
      navigate(returnPathForRole(location.state?.returnTo, accountType), { replace: true, state: location.state?.returnState });
    } catch (err) {
      setError(accountCreated ? 'Le compte local a été créé, mais la connexion a échoué. Essayez de vous connecter.' : err instanceof Error ? err.message : 'Impossible de créer le compte dans ce navigateur.');
    } finally {
      submitting.current = false; setIsSubmitting(false);
    }
  };

  return {
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
  };
};