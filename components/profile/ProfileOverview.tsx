
import React from 'react';
import { User, Briefcase, Award, Code2, Globe, Plus, Star, Quote } from 'lucide-react';

interface ProfileOverviewProps {
    profile: any;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
  const hasSkills = profile.skills && profile.skills.length > 0;
  const hasLanguages = profile.languages && profile.languages.length > 0;
  
  // Normaliser l'éducation : soit du tableau education, soit des champs simples d'inscription
  let educationList = profile.education || [];
  if (educationList.length === 0 && profile.school) {
      educationList.push({
          id: 'default',
          degree: profile.studyLevel ? `Niveau ${profile.studyLevel}` : 'Étudiant',
          school: profile.school,
          date: new Date().getFullYear().toString(),
          mention: profile.studyField
      });
  }

  const hasExperience = profile.experiences && profile.experiences.length > 0;
  const reviews = profile.reviews || [];
  const rating = profile.rating || 0;

  return (
    <div className="space-y-6 animate-fade-in delay-100">
        
        {/* About */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <User className="text-primary" size={20} /> À propos
            </h3>
            {profile.bio ? (
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{profile.bio}</p>
            ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-gray-400 text-sm mb-2">Vous n'avez pas encore ajouté de bio.</p>
                    <button className="text-primary font-bold text-sm hover:underline">Ajouter une description</button>
                </div>
            )}
        </div>

        {/* Reputation & Avis (Nouveau) */}
        {reviews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500" size={20} /> Réputation & Avis
                    </h3>
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                        <span className="text-xl font-bold text-slate-900">{rating}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={`${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                    {reviews.map((review: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                        {review.reviewerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{review.reviewerName}</p>
                                        <p className="text-[10px] text-gray-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={10} className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Quote size={14} className="text-gray-300 shrink-0 fill-gray-100 mt-1" />
                                <p className="text-xs text-gray-600 italic leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills & Languages */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="mb-6">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <Code2 className="text-blue-500" size={20} /> Compétences
                    </h3>
                    {hasSkills ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold border border-slate-100">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <button className="w-full py-3 border border-dashed border-gray-200 text-gray-400 rounded-xl text-sm hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                            <Plus size={16} /> Ajouter des compétences
                        </button>
                    )}
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <Globe className="text-green-500" size={20} /> Langues
                    </h3>
                    {hasLanguages ? (
                        <div className="space-y-2">
                            {profile.languages.map((lang: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                    {lang}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-gray-400 italic">Français (par défaut)</p>
                    )}
                </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="text-yellow-500" size={20} /> Formation
                </h3>
                {educationList.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:w-0.5 before:-translate-x-1/2 before:bg-gray-100 before:h-full before:content-['']">
                        {educationList.map((edu: any) => (
                            <div key={edu.id} className="relative pl-8">
                                <span className="absolute left-0 top-1.5 -ml-[3.5px] h-2 w-2 rounded-full border-2 border-white bg-slate-300 ring-2 ring-white"></span>
                                <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                                <p className="text-xs font-semibold text-primary">{edu.school}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{edu.date} {edu.mention && `• ${edu.mention}`}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <button className="w-full py-3 border border-dashed border-gray-200 text-gray-400 rounded-xl text-sm hover:border-yellow-500 hover:text-yellow-500 transition-colors flex items-center justify-center gap-2">
                        <Plus size={16} /> Ajouter une formation
                    </button>
                )}
            </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-purple-500" size={20} /> Expériences
            </h3>
            {hasExperience ? (
                <div className="space-y-6">
                    {profile.experiences.map((exp: any) => (
                        <div key={exp.id} className="flex flex-col sm:flex-row gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                                <p className="text-xs text-gray-400 mb-2">{exp.date}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <Briefcase className="mx-auto text-gray-300 mb-3" size={32} />
                    <p className="text-gray-500 font-medium mb-1">Aucune expérience renseignée</p>
                    <p className="text-xs text-gray-400 mb-4">Ajoutez vos stages, jobs d'été ou projets freelance.</p>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                        Ajouter une expérience
                    </button>
                </div>
            )}
        </div>

    </div>
  );
};

export default ProfileOverview;
