import React from 'react';
import { Briefcase, Download, BookOpen, ChevronRight } from 'lucide-react';
import { TOOLS, GUIDES } from '../../data/resourcesData';

const GuidesTab: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-16">
        
        {/* Tools Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-white mb-2 flex items-center gap-2">
                            <Briefcase className="text-secondary" /> Boîte à outils
                        </h2>
                        <p className="text-slate-400">Les indispensables pour professionnaliser votre démarche.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TOOLS.map((tool, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-secondary group-hover:text-slate-900 transition-colors text-white">
                                    <tool.icon size={24} />
                                </div>
                                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-slate-300">
                                    {tool.type}
                                </span>
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{tool.title}</h3>
                            <div className="flex items-center text-xs text-slate-400 gap-4 mt-4">
                                <span className="flex items-center gap-1"><Download size={12} /> {tool.downloads}</span>
                                <span className="text-secondary font-bold group-hover:underline">Télécharger</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Guides Grid */}
        <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 flex items-center gap-2">
                <BookOpen className="text-slate-400" /> Guides Pratiques
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
                {GUIDES.map((guide, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${guide.color} group-hover:scale-110 transition-transform`}>
                            <guide.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                            {guide.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                            {guide.desc}
                        </p>
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lecture : 5 min</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Partners Logo Cloud */}
        <div className="border-t border-gray-100 pt-16 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Ils soutiennent l'initiative</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-bold text-slate-800">Orange Digital Center</span>
                <span className="text-xl font-bold text-slate-800">NextA</span>
                <span className="text-xl font-bold text-slate-800">CITE</span>
                <span className="text-xl font-bold text-slate-800">Youth First</span>
                </div>
        </div>
    </div>
  );
};

export default GuidesTab;