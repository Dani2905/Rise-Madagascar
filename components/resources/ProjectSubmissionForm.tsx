import React from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Point d'entrée compact ; l'autorisation et l'abonnement sont vérifiés à la création. */
const ProjectSubmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  if (isLoading || (user && user.role !== 'student')) return null;
  const start = () => {
    const target = '/profile?tab=projects&action=new';
    if (user) navigate(target);
    else navigate('/register?type=student', {state:{returnTo:target}});
  };
  return <div className="shrink-0 sm:text-right">
    <button type="button" onClick={start} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-700 sm:w-auto"><Plus size={17} /> Publier un projet <ArrowUpRight size={15}/></button>
    <p className="mt-2 text-xs text-slate-500">Réservé aux étudiants abonnés</p>
  </div>;
};
export default ProjectSubmissionForm;
