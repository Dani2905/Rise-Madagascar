
import React from 'react';
import { User, Briefcase, Star, AlertCircle, Quote } from 'lucide-react';

interface CandidateMainContentProps {
  candidate: any;
  isLiveProfile: boolean;
}

const CandidateMainContent: React.FC<CandidateMainContentProps> = ({ candidate, isLiveProfile }) => {
  const reviews = Array.isArray(candidate.reviews) ? candidate.reviews.filter((r: any) => r && typeof r.reviewerName === 'string') : [];

  return (
    <div className="space-y-8">
        
        {!isLiveProfile && (
            <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-xs font-bold rounded-xl border border-yellow-100 flex items-center gap-2">
                <AlertCircle size={16} />
                Ce profil est une archive (candidat désinscrit). Affichage des données au moment de la candidature.
            </div>
        )}

        {/* Bio */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><User size={20} /></div> À propos
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-light text-justify">{candidate.bio || "Aucune description."}</p>
        </section>

        {/* Expérience */}
        {candidate.experiences && candidate.experiences.length > 0 && (
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Briefcase size={20} /></div> Expériences
                </h3>
                <div className="space-y-8 relative border-l-2 border-gray-100 ml-3 pl-8">
                    {candidate.experiences.map((exp: any, idx: number) => (
                        <div key={idx} className="relative">
                            <span className="absolute -left-[41px] top-1.5 h-5 w-5 rounded-full border-4 border-white bg-purple-500 shadow-sm"></span>
                            <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                            <p className="text-primary font-bold text-sm mb-2">{exp.company}</p>
                            <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* REVIEWS SECTION */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Star size={20} /></div> Avis & Réputation
            </h3>

            {reviews.length > 0 ? (
                <div className="grid gap-6 relative z-10">
                    {reviews.map((review: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                        {review.reviewerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{review.reviewerName}</p>
                                        <p className="text-xs text-gray-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex bg-white px-2 py-1 rounded-lg border border-gray-100">
                                    {[1,2,3,4,5].map(star => (
                                        <Star key={star} size={12} className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Quote size={20} className="text-gray-300 shrink-0 fill-gray-100" />
                                <div className="text-sm text-gray-600 italic">
                                    {review.comment}
                                    {review.jobTitle && <p className="text-xs font-bold text-primary mt-2 not-italic">Mission : {review.jobTitle}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-gray-200 relative z-10">
                    <p className="text-gray-500 text-sm">Aucun avis reçu pour le moment.</p>
                </div>
            )}
        </section>
    </div>
  );
};

export default CandidateMainContent;
