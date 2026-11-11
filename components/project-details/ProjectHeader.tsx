import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublicStudent } from '../../utils/publicStudent';
import { Rocket, MapPin, Share2, Heart } from 'lucide-react';
import { Project } from '../../data/resourcesData';
import { useProjectLikes } from '../../hooks/useProjectLikes';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const location = useLocation();
  const student = project.ownerId != null ? getPublicStudent(String(project.ownerId)) : null;
  const { liked: isLiked, count: likes, toggle } = useProjectLikes(project.id, project.likes);
  const handleShare = async () => {
      try {
          if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
          await navigator.clipboard.writeText(window.location.href);
          if (window.Toastify) window.Toastify({ text: 'Lien copié. Les projets locaux ne sont pas partagés entre navigateurs.', style: { background: '#334155' } }).showToast();
      } catch {
          window.prompt('Copiez ce lien :', window.location.href);
      }
  };

  return (
    <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden mb-8 shadow-xl">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary opacity-10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 px-6 py-10 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex gap-6 items-start">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${project.imageColor.replace('text-', 'text-slate-900 ').replace('bg-', 'bg-')}`}>
                         {/* We modify the color class to be brighter on dark bg if needed, or stick to default */}
                         <div className="bg-white/90 p-4 rounded-xl">
                            <Rocket size={40} className="text-slate-900" />
                         </div>
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            {project.isDemo && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">Exemple de démonstration</span>}
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-primary backdrop-blur-md">
                                {project.category}
                            </span>
                            <span className="flex items-center text-xs font-medium text-slate-400">
                                <MapPin size={14} className="mr-1" /> Madagascar
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-3 leading-tight">
                            {project.title}
                        </h1>
                        <p className="text-lg text-slate-300 font-medium max-w-2xl">
                            Porté par {student ? <Link to={`/students/${encodeURIComponent(String(student.id))}`} state={{ fromProject: location.pathname }} className="text-white underline decoration-primary underline-offset-4 hover:text-primary">{project.student}</Link> : <span className="text-white">{project.student}</span>} {project.school && `• ${project.school}`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleShare}
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all group"
                        title="Partager"
                    >
                        <Share2 size={20} className="text-white" />
                    </button>
                    <button 
                        type="button" aria-pressed={isLiked} aria-label={isLiked ? 'Retirer ma réaction' : 'Aimer ce projet'}
                        onClick={toggle}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-md transition-all group ${
                            isLiked 
                            ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                            : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                        }`}
                    >
                         <Heart 
                            size={20} 
                            className={`transition-transform duration-300 ${isLiked ? 'fill-current text-red-500' : 'group-hover:text-red-400'}`} 
                         />
                         <span className={`font-bold ${isLiked ? 'text-white' : ''}`}>{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectHeader;