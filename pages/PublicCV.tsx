import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, Phone, Globe, Download, ArrowLeft, Printer, Linkedin, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWebsiteUrl } from '../utils/website';

const PublicCV: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true, state: { returnTo: '/cv/preview' } });
    }
    if (!isLoading && user && user.role !== 'student') navigate('/profile', { replace: true });
  }, [user, isLoading, navigate]);

  if (!user || user.role !== 'student') return null;

  const handlePrint = () => {
    window.print();
  };

  // Fallback data if fields are empty
  const avatarUrl = user.avatarUrl;
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || '?';
  const websiteUrl = getWebsiteUrl(user.website);
  const title = user.title || (user.studyField ? `Étudiant en ${user.studyField}` : "Étudiant");
  const educationList = Array.isArray(user.education) ? [...user.education] : [];

  // If no education listed but school field exists (from registration)
  if (educationList.length === 0 && user.school) {
     educationList.push({
        id: 'default',
        degree: user.studyLevel ? `Niveau ${user.studyLevel}` : 'Formation',
        school: user.school,
        date: 'En cours',
        mention: user.studyField
     });
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 font-sans print:bg-white print:py-0">
      
      {/* Navigation & Actions (Hidden when printing) */}
      <div className="max-w-[210mm] mx-auto mb-6 px-4 md:px-0 flex flex-wrap gap-4 justify-between items-center print:hidden">
         <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
         >
            <ArrowLeft size={20} /> Retour
         </button>
         
         <div className="flex flex-wrap gap-3">
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
             >
                <Printer size={18} /> Imprimer
             </button>
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg"
             >
                <Download size={18} /> Imprimer / enregistrer en PDF
             </button>
         </div>
      </div>

      <p className="max-w-[210mm] mx-auto px-4 mb-4 text-sm text-slate-600 print:hidden">Aperçu local : ce CV n’est pas publié sur Internet. Pour obtenir un PDF, choisissez « Enregistrer en PDF » dans la fenêtre d’impression.</p>
      {/* CV A4 Container */}
      <div ref={cvRef} className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden rounded-none md:rounded-xl min-h-[297mm] flex flex-col md:flex-row">
          
          {/* LEFT COLUMN (Dark Sidebar) */}
          <div className="w-full md:w-[35%] bg-slate-900 text-white p-8 print:w-[35%] print:bg-slate-900 print:text-white print-color-adjust">
               <div className="flex flex-col items-center text-center mb-10">
                   <div className="w-32 h-32 rounded-full border-4 border-white/20 mb-4 overflow-hidden bg-slate-800">
                       {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-3xl font-bold">{initials}</span>}
                   </div>
                   <h1 className="text-2xl font-heading font-bold uppercase tracking-wide mb-2">{user.firstName} <br/> {user.lastName}</h1>
                   <p className="text-primary font-medium text-sm">{title}</p>
               </div>

               <div className="space-y-8">
                   {/* Contact */}
                   <div>
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Contact</h3>
                       <ul className="space-y-3 text-sm text-gray-300">
                           <li className="flex items-center gap-3">
                               <Mail size={16} className="text-primary shrink-0" /> 
                               <span className="truncate">{user.email}</span>
                           </li>
                           {user.phone && (
                               <li className="flex items-center gap-3">
                                   <Phone size={16} className="text-primary shrink-0" /> 
                                   <span>{user.phone}</span>
                               </li>
                           )}
                           {user.location && <li className="flex items-center gap-3">
                               <MapPin size={16} className="text-primary shrink-0" /> 
                               <span>{user.location}</span>
                           </li>}
                           {websiteUrl && (
                               <li className="flex items-center gap-3">
                                   <Globe size={16} className="text-primary shrink-0" /> 
                                   <a href={websiteUrl} target="_blank" rel="noreferrer" className="hover:text-white underline decoration-gray-600 underline-offset-4">Site Web</a>
                               </li>
                           )}
                       </ul>
                   </div>

                   {/* Skills */}
                   {user.skills && user.skills.length > 0 && (
                       <div>
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Compétences</h3>
                           <div className="flex flex-wrap gap-2">
                               {user.skills.map((skill: string, idx: number) => (
                                   <span key={idx} className="px-2 py-1 bg-slate-800 text-gray-200 text-xs rounded border border-slate-700">
                                       {skill}
                                   </span>
                               ))}
                           </div>
                       </div>
                   )}

                   {/* Languages */}
                   {user.languages && user.languages.length > 0 && (
                       <div>
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Langues</h3>
                           <ul className="space-y-2 text-sm text-gray-300">
                               {user.languages.map((lang: string, idx: number) => (
                                   <li key={idx} className="flex items-center gap-2">
                                       <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {lang}
                                   </li>
                               ))}
                           </ul>
                       </div>
                   )}
               </div>
          </div>

          {/* RIGHT COLUMN (White Content) */}
          <div className="w-full md:w-[65%] p-8 md:p-12 print:w-[65%]">
              
              {/* Profile / Bio */}
              {user.bio && (
                  <div className="mb-10">
                      <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 border-b-2 border-primary inline-block pb-1">Profil</h2>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                          {user.bio}
                      </p>
                  </div>
              )}

              {/* Experience */}
              <div className="mb-10">
                   <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 border-b-2 border-primary inline-block pb-1">Expériences</h2>
                   
                   {user.experiences && user.experiences.length > 0 ? (
                       <div className="space-y-6">
                           {user.experiences.map((exp: any, idx: number) => (
                               <div key={idx} className="relative pl-4 border-l-2 border-gray-100">
                                   <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                   <h3 className="font-bold text-slate-900">{exp.role}</h3>
                                   <div className="flex justify-between items-center mb-2">
                                       <span className="text-sm font-semibold text-primary">{exp.company}</span>
                                       <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                           <Calendar size={12} /> {exp.date}
                                       </span>
                                   </div>
                                   <p className="text-sm text-gray-500 leading-relaxed">
                                       {exp.description}
                                   </p>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <p className="text-sm text-gray-400 italic">Aucune expérience renseignée.</p>
                   )}
              </div>

              {/* Education */}
              <div>
                   <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 border-b-2 border-primary inline-block pb-1">Formation</h2>
                   
                   {educationList.length > 0 ? (
                       <div className="space-y-6">
                           {educationList.map((edu: any, idx: number) => (
                               <div key={idx} className="flex gap-4">
                                   <div className="mt-1">
                                       <Building2 size={20} className="text-gray-300" />
                                   </div>
                                   <div>
                                       <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                                       <p className="text-sm text-gray-600">{edu.school}</p>
                                       <p className="text-xs text-gray-400 mt-1">{edu.date} {edu.mention && `• ${edu.mention}`}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <p className="text-sm text-gray-400 italic">Aucune formation renseignée.</p>
                   )}
              </div>

          </div>

      </div>
      
      {/* Footer / Branding for Print */}
      <div className="text-center mt-8 text-xs text-gray-400 print:block hidden">
          CV généré via Rise Madagascar
      </div>

    </div>
  );
};

export default PublicCV;