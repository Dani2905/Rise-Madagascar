import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionProps {
  description: string;
  tags: string[];
  requirements?: string;
  benefits?: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description, tags, requirements, benefits }) => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="text-primary" /> Description du poste
        </h2>
        
        <div 
            className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-li:marker:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: description }}
        />

        {requirements && (
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Profil recherché</h3>
                <div 
                    className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-li:marker:text-primary prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: requirements }}
                />
            </div>
        )}

        {benefits && (
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Avantages</h3>
                <div 
                    className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-li:marker:text-primary prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: benefits }}
                />
            </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Compétences clés</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-100">
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    </div>
  );
};

export default JobDescription;