import React from 'react';
import { AlertCircle, Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';
import { Project } from '../../data/resourcesData';

interface ProjectContentProps {
  project: Project;
}

const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  return (
    <div className="space-y-8 animate-fade-in delay-100">
        
        {/* The Problem */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" /> Le Problème
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
                {project.problem || "Information non renseignée."}
            </p>
        </section>

        {/* The Solution */}
        <section className="bg-white rounded-3xl p-8 border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                <Lightbulb className="text-primary fill-primary" /> La Solution
            </h3>
            <p className="text-slate-800 leading-relaxed text-lg relative z-10">
                {project.solution || project.description}
            </p>
            

        </section>

        {/* Roadmap */}
        {project.roadmap && project.roadmap.length > 0 && (
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-green-500" /> Roadmap
                </h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                    {project.roadmap.map((step, idx) => (
                        <div key={idx} className="relative pl-8">
                            <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></span>
                            <h4 className={`text-base font-bold ${step.done ? 'text-slate-900' : 'text-gray-500'}`}>
                                {step.title}
                            </h4>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">{step.date}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
  );
};

export default ProjectContent;