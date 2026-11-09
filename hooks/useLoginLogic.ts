
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '../context/AuthContext';
import { MOCK_STUDENT_PROFILE } from '../data/studentData';
import { COMPANY_DASHBOARD_DATA } from '../data/dashboardData';

export const useLoginLogic = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const fillDemoCredentials = (role: 'student' | 'company' | 'individual') => {
      if (role === 'student') setFormData({ email: 'etudiant@rise.mg', password: 'password123' });
      if (role === 'company') setFormData({ email: 'pro@rise.mg', password: 'password123' });
      if (role === 'individual') setFormData({ email: 'perso@rise.mg', password: 'password123' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let userData: User | null = null;

      // Charger la "DB" locale avec sécurité
      const dbUsersStr = localStorage.getItem('rise_db_users');
      let dbUsers = [];
      try {
          dbUsers = dbUsersStr ? JSON.parse(dbUsersStr) : [];
          if (!Array.isArray(dbUsers)) dbUsers = [];
      } catch (e) {
          dbUsers = [];
          localStorage.setItem('rise_db_users', '[]');
      }
      
      const findUser = (email: string) => dbUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      // 1. Gestion des comptes DÉMO (avec persistance)
      if (formData.email === 'etudiant@rise.mg') {
          userData = findUser('etudiant@rise.mg');
          if (!userData) {
             userData = { 
                ...MOCK_STUDENT_PROFILE, 
                id: 999, 
                role: 'student',
                email: 'etudiant@rise.mg',
                firstName: 'Rary',
                lastName: 'Rakoto',
                title: 'Étudiant en Informatique',
                avatarUrl: "https://ui-avatars.com/api/?name=Rary+Rakoto&background=0f172a&color=fff"
             };
             dbUsers.push(userData);
             localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
          }
      } else if (formData.email === 'pro@rise.mg') {
          userData = findUser('pro@rise.mg');
          if (!userData) {
             // Création initiale du compte démo Entreprise (RICHE EN DONNÉES)
             userData = { 
                 id: 1, 
                 firstName: 'Sarah', 
                 lastName: 'Andria', 
                 role: 'company', 
                 email: 'pro@rise.mg',
                 companyName: 'TechMada Solutions', 
                 logoUrl: "https://ui-avatars.com/api/?name=TechMada&background=2563eb&color=fff&size=128",
                 coverUrl: "", // Pas de cover par défaut
                 industry: "Tech",
                 companySize: "51-200",
                 founded: "2018",
                 website: "www.techmada.mg",
                 location: "Antananarivo, Galaxy Andraharo",
                 description: "Accélérateur de transformation digitale à Madagascar.",
                 bio: "Chez TechMada, nous développons des solutions logicielles innovantes pour les entreprises de l'Océan Indien. Notre équipe de 80 passionnés travaille sur des projets web, mobile et IA. Nous valorisons l'apprentissage continu et l'esprit d'initiative.",
                 perks: ["Télétravail hybride", "Formations certifiantes", "Assurance santé", "Salle de sport", "Team Building trimestriel"],
                 position: "DRH",
                 contactRole: "DRH" // Fallback pour compatibilité
             };
             dbUsers.push(userData);
             localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));

             // --- SEED JOBS FOR DEMO ---
             // On ajoute des jobs par défaut pour ce recruteur s'ils n'existent pas
             let existingJobs = [];
             try {
                 existingJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
                 if(!Array.isArray(existingJobs)) existingJobs = [];
             } catch { existingJobs = []; }

             const hasUserJobs = existingJobs.some((j: any) => j.ownerId === 1);
             
             if (!hasUserJobs) {
                 const seedJobs = [
                    {
                        id: Date.now() + 1,
                        ownerId: 1,
                        title: 'Développeur Fullstack React/Node',
                        type: 'CDI',
                        location: 'Antananarivo',
                        company: 'TechMada Solutions',
                        logoUrl: "https://ui-avatars.com/api/?name=TechMada&background=2563eb&color=fff",
                        salary: 'À discuter',
                        description: "<p>Nous cherchons un développeur passionné pour rejoindre notre squad produit.</p><ul><li>React.js / Next.js</li><li>Node.js / NestJS</li><li>PostgreSQL</li></ul>",
                        candidates: 5,
                        status: 'Actif',
                        postedAt: "Il y a 2 jours",
                        tags: ['Tech', 'Dev', 'Fullstack'],
                        isUrgent: true,
                        remote: false
                    },
                    {
                        id: Date.now() + 2,
                        ownerId: 1,
                        title: 'Stagiaire Assistant RH',
                        type: 'Stage',
                        location: 'Antananarivo',
                        company: 'TechMada Solutions',
                        logoUrl: "https://ui-avatars.com/api/?name=TechMada&background=2563eb&color=fff",
                        salary: 'Indemnité de stage',
                        description: "<p>Assister la DRH dans le recrutement et la gestion administrative du personnel.</p>",
                        candidates: 12,
                        status: 'Actif',
                        postedAt: "Il y a 1 semaine",
                        tags: ['RH', 'Admin', 'Stage'],
                        isUrgent: false,
                        remote: false
                    }
                 ];
                 localStorage.setItem('rise_jobs', JSON.stringify([...seedJobs, ...existingJobs]));
             }
          }
      } else if (formData.email === 'perso@rise.mg') {
          userData = findUser('perso@rise.mg');
          if (!userData) {
             userData = { 
                 id: 102, 
                 firstName: 'Mme', 
                 lastName: 'Ravaka', 
                 companyName: 'Famille Ravaka', // Nom d'affichage
                 role: 'individual', 
                 email: 'perso@rise.mg', 
                 location: 'Ambatobe, Tana',
                 avatarUrl: "https://ui-avatars.com/api/?name=Ravaka&background=f472b6&color=fff",
                 bio: "Mère de famille cherchant ponctuellement de l'aide pour le soutien scolaire de mes enfants et la gestion de la maison.",
                 needs: ["Soutien Scolaire", "Aide à domicile"]
             };
             dbUsers.push(userData);
             localStorage.setItem('rise_db_users', JSON.stringify(dbUsers));
          }
      } else {
          userData = findUser(formData.email);
      }

      setIsSubmitting(false);

      if (userData) {
          login(userData, 'token-' + Date.now());
          window.Toastify({
            text: `Bon retour ${userData.firstName ? userData.firstName : ''} !`,
            duration: 2000,
            gravity: "top", 
            position: "center", 
            style: { background: "linear-gradient(to right, #10B981, #059669)", borderRadius: "8px", fontWeight: "600" },
          }).showToast();
          navigate('/profile');
      } else {
          window.Toastify({
            text: "Email inconnu. Utilisez un compte de démo ou inscrivez-vous.",
            duration: 3000,
            gravity: "top", 
            position: "center", 
            style: { background: "#ef4444", borderRadius: "8px" },
          }).showToast();
      }
    }, 1000);
  };

  return { formData, isSubmitting, handleInputChange, fillDemoCredentials, handleSubmit };
};
