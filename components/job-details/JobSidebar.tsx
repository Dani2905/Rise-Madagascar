
import React from 'react';
import { CheckCircle2, GraduationCap, Briefcase, Globe, ArrowRight, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface JobSidebarProps {
  job: {
    requirements: {
      education: string;
      experience: string;
      language: string;
    };
    company: string;
    logoUrl: string;
    companyInfo: {
      id?: number | string; // ID pour la navigation
      size: string;
      industry: string;
      website: string;
    };
    ownerId?: number | string;
  };
  onApply: () => void;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job, onApply }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isStudent = user?.role === 'student';
  const isIndividual = job.companyInfo.industry === 'Particulier';

  const handleCompanyClick = () => {
      // Priorité à l'ownerId s'il existe (User réel), sinon l'ID dans companyInfo (Mock ou User)
      const targetId = job.ownerId || job.companyInfo?.id;
      if (targetId) {
          navigate(`/companies/${targetId}`);
      } else {
          // Fallback si pas d'ID (rare)
          window.Toastify({
              text: "Page indisponible pour le moment.",
              style: { background: "#64748b" }
          }).showToast();
      }
  };

  return (
    <div className="space-y-6">
        {/* Action Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-primary/5">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-6">Intéressé(e) ?</h3>
            
            {isStudent ? (
                <button 
                    onClick={onApply}
                    className="w-full py-4 rounded-xl bg-primary text-slate-900 font-bold text-lg shadow-lg shadow-primary/20 hover:bg-yellow-400 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mb-3"
                >
                    {isIndividual ? "Répondre à l'annonce" : "Postuler maintenant"} <CheckCircle2 size={20} />
                </button>
            ) : (
                <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm border border-gray-200 flex flex-col items-center justify-center gap-1 mb-3 cursor-not-allowed text-center px-4">
                    <div className="flex items-center gap-2">
                        <Lock size={16} /> <span>Mode Recruteur</span>
                    </div>
                    <span className="text-xs font-normal opacity-80">Connectez-vous en tant qu'étudiant pour postuler.</span>
                </div>
            )}
            
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <GraduationCap size={20} className="text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Niveau souhaité</p>
                        <p className="text-sm font-semibold text-slate-900">{job.requirements.education}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Briefcase size={20} className="text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Expérience</p>
                        <p className="text-sm font-semibold text-slate-900">{job.requirements.experience}</p>
                    </div>
                </div>
                {!isIndividual && (
                    <div className="flex items-start gap-3">
                        <Globe size={20} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Langues</p>
                            <p className="text-sm font-semibold text-slate-900">{job.requirements.language}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Recruiter / Company Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">
                {isIndividual ? "À propos du recruteur" : "À propos de l'entreprise"}
            </h3>
            
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50">
                        {isIndividual && job.logoUrl.includes('ui-avatars') ? (
                            <User className="text-gray-400" size={24} />
                        ) : (
                            <img src={job.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        )}
                </div>
                <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                        {job.company}

                    </p>
                    {job.companyInfo.website && job.companyInfo.website !== 'Non renseigné' && !isIndividual && (
                        <a href={job.companyInfo.website.startsWith('http') ? job.companyInfo.website : `https://${job.companyInfo.website}`} target="_blank" rel="noreferrer" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                            {job.companyInfo.website.replace(/^https?:\/\//, '')} <ArrowRight size={10} />
                        </a>
                    )}
                    {isIndividual && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Particulier</span>
                    )}
                </div>
            </div>

            {!isIndividual && (
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex justify-between">
                        <span>Secteur :</span> 
                        <span className="font-semibold text-slate-900">{job.companyInfo.industry}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Taille :</span> 
                        <span className="font-semibold text-slate-900">{job.companyInfo.size}</span>
                    </p>
                </div>
            )}

            <button 
                onClick={handleCompanyClick}
                className="w-full py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:text-slate-900 hover:border-gray-300 transition-colors"
            >
                {isIndividual ? "Voir le profil" : "Voir la page entreprise"}
            </button>
        </div>
    </div>
  );
};

export default JobSidebar;