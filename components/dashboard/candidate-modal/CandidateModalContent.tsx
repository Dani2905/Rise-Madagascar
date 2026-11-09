
import React from 'react';
import { AlertCircle, User, Briefcase, Building2, GraduationCap, Award, ExternalLink } from 'lucide-react';

interface CandidateModalContentProps {
  profile: any;
  isLiveProfile: boolean;
}

const CandidateModalContent: React.FC<CandidateModalContentProps> = ({ profile, isLiveProfile }) => {
  return (
    <div className="flex-1 p-6 md:p-10 flex-col overflow-y-auto bg-white relative">
            
        {!isLiveProfile && (
            <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-xs font-bold rounded-xl border border-yellow-100 flex items-center gap-2">
                <AlertCircle size={16} />
                Ce profil est une archive (candidat désinscrit). Affichage des données au moment de la candidature.
            </div>
        )}

        <div className="space-y-10 max-w-3xl mx-auto pb-10">
            
            {/* Bio */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="text-primary" size={20} /> À propos
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                        {profile.bio || "Aucune description disponible."}
                    </p>
                </div>
            </section>

            {/* Expériences */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Briefcase className="text-blue-500" size={20} /> Expériences
                </h3>
                <div className="space-y-8 relative border-l-2 border-gray-100 ml-3 pl-8 md:pl-10">
                    {profile.experiences && profile.experiences.length > 0 ? (
                        profile.experiences.map((exp: any, index: number) => (
                            <div key={exp.id || index} className="relative group">
                                <span className="absolute -left-[41px] md:-left-[49px] top-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-sm group-hover:scale-125 transition-transform"></span>
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                    <h4 className="text-lg font-bold text-slate-900 text-base">{exp.role}</h4>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded mt-1 sm:mt-0 w-fit">{exp.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                                    <Building2 size={14} /> {exp.company}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                                    {exp.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">Aucune expérience renseignée.</p>
                    )}
                </div>
            </section>

            {/* Formation */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="text-yellow-500" size={20} /> Formation
                </h3>
                <div className="grid gap-4">
                    {profile.education && profile.education.length > 0 ? (
                        profile.education.map((edu: any, index: number) => (
                            <div key={edu.id || index} className="flex gap-5 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group">
                                <div className="mt-1 text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 h-fit group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base mb-1">{edu.degree}</h4>
                                    <p className="text-primary font-semibold text-sm mb-1">{edu.school}</p>
                                    <p className="text-gray-400 text-xs font-medium bg-gray-50 inline-block px-2 py-0.5 rounded">{edu.date}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">Aucune formation renseignée.</p>
                    )}
                </div>
            </section>

            {/* Portfolio / Links */}
            <section>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ExternalLink className="text-purple-500" size={20} /> Liens & Portfolio
                </h3>
                <div className="flex flex-wrap gap-3">
                    <a href="#" className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:border-slate-900 hover:shadow-md transition-all flex items-center gap-2 group">
                        LinkedIn <ExternalLink size={14} className="text-gray-400 group-hover:text-slate-900" />
                    </a>
                    <a href="#" className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:border-slate-900 hover:shadow-md transition-all flex items-center gap-2 group">
                        Behance <ExternalLink size={14} className="text-gray-400 group-hover:text-slate-900" />
                    </a>
                    <a href="#" className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:border-slate-900 hover:shadow-md transition-all flex items-center gap-2 group">
                        GitHub <ExternalLink size={14} className="text-gray-400 group-hover:text-slate-900" />
                    </a>
                </div>
            </section>

        </div>
    </div>
  );
};

export default CandidateModalContent;
