import React, { useState, useEffect } from 'react';
import { Rocket, UserPlus, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../../data/resourcesData';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [likes, setLikes] = useState(project.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'utilisateur a déjà liké ce projet
    const userLikes = JSON.parse(localStorage.getItem('rise_user_likes') || '[]');
    if (userLikes.includes(project.id)) {
        setIsLiked(true);
    }

    // 2. Récupérer le nombre de likes à jour (si stocké localement)
    const storedCounts = JSON.parse(localStorage.getItem('rise_project_likes_counts') || '{}');
    if (storedCounts[project.id]) {
        setLikes(storedCounts[project.id]);
    }
  }, [project.id]);

  const handleLike = (e: React.MouseEvent) => {
      e.preventDefault(); // Empêcher la navigation si cliqué dans un lien
      e.stopPropagation();

      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : likes - 1;

      setIsLiked(newIsLiked);
      setLikes(newLikes);
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 300);

      // Mise à jour du localStorage (User Likes)
      const userLikes = JSON.parse(localStorage.getItem('rise_user_likes') || '[]');
      let updatedUserLikes;
      if (newIsLiked) {
          updatedUserLikes = [...userLikes, project.id];
          window.Toastify({
            text: "Vous aimez ce projet !",
            duration: 2000,
            style: { background: "#ef4444", boxShadow: "none" },
            position: "center",
            gravity: "bottom"
          }).showToast();
      } else {
          updatedUserLikes = userLikes.filter((id: number) => id !== project.id);
      }
      localStorage.setItem('rise_user_likes', JSON.stringify(updatedUserLikes));

      // Mise à jour du localStorage (Global Counts)
      const storedCounts = JSON.parse(localStorage.getItem('rise_project_likes_counts') || '{}');
      storedCounts[project.id] = newLikes;
      localStorage.setItem('rise_project_likes_counts', JSON.stringify(storedCounts));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden h-full flex flex-col relative">
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 min-w-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${project.imageColor}`}>
                        <Rocket size={32} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-xl font-heading font-bold text-slate-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                                {project.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase whitespace-nowrap">
                                {project.category}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <UserPlus size={14} /> {project.student}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button 
                        onClick={handleLike}
                        className={`p-2 rounded-full transition-all flex items-center gap-1 border ${
                            isLiked 
                            ? 'text-red-500 bg-red-50 border-red-100' 
                            : 'text-gray-400 border-gray-100 hover:text-red-500 hover:bg-red-50 hover:border-red-100'
                        }`}
                    >
                        <span className={`text-xs font-bold ${isLiked ? 'text-red-600' : 'text-gray-500 group-hover:text-red-500'}`}>
                            {likes}
                        </span>
                        <Heart 
                            size={20} 
                            className={`transition-transform duration-300 ${isLiked ? 'fill-current' : ''} ${animateHeart ? 'scale-125' : 'scale-100'}`} 
                        />
                    </button>
                </div>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm line-clamp-2 flex-grow">
                {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700">Progression : {project.stage}</span>
                    <span className="text-yellow-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                    {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                        project.need.includes('Financement') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                        Besoin : {project.need}
                    </span>
                    <Link to={`/projects/${project.id}`} className="text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors flex items-center">
                        Voir <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectCard;