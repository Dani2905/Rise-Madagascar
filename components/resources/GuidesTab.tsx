import React from 'react';
import { Briefcase, Download, BookOpen } from 'lucide-react';
import { TOOLS, GUIDES } from '../../data/resourcesData';

const GuidesTab: React.FC = () => (
  <div className="animate-fade-in space-y-16">
    <section className="bg-slate-900 rounded-3xl p-8 md:p-12">
      <h2 className="text-2xl font-heading font-bold text-white mb-2 flex items-center gap-2"><Briefcase className="text-secondary" /> Boîte à outils</h2>
      <p className="text-slate-400 mb-8">Modèles simples à personnaliser, disponibles au format texte.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {TOOLS.map(tool => <a key={tool.filename} href={`data:text/plain;charset=utf-8,${encodeURIComponent(tool.content)}`} download={tool.filename} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col gap-4">
          <tool.icon size={24} className="text-white" /><h3 className="font-bold text-white text-lg">{tool.title}</h3><span className="text-sm text-yellow-300 font-bold flex gap-2 items-center"><Download size={16} /> Télécharger le modèle (.txt)</span>
        </a>)}
      </div>
    </section>
    <section>
      <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3 flex items-center gap-2"><BookOpen className="text-slate-400" /> Guides pratiques</h2>
      <p className="text-sm text-slate-500 mb-8">Ouvrez un guide pour consulter ses conseils.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {GUIDES.map(guide => <details key={guide.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <summary className="cursor-pointer font-bold text-slate-900"><span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mr-3 ${guide.color}`}><guide.icon size={20} /></span>{guide.title}</summary>
          <p className="text-gray-500 text-sm mt-4">{guide.desc}</p><ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-slate-700">{guide.tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
        </details>)}
      </div>
    </section>
  </div>
);
export default GuidesTab;
