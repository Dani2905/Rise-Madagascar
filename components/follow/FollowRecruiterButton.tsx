import React, { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFollowedRecruiters } from '../../hooks/useFollowedRecruiters';

interface Props {
  id: string;
  name: string;
  isLocalProfile: boolean;
  followState: ReturnType<typeof useFollowedRecruiters>;
  compact?: boolean;
}
const FollowRecruiterButton: React.FC<Props> = ({id,name,isLocalProfile,followState,compact=false}) => {
  const {user,isLoading} = useAuth();
  const navigate=useNavigate(), location=useLocation();
  const [failure,setFailure]=useState(''),[notice,setNotice]=useState('');
  const following=followState.follows.some(f=>f.id===id);
  const unavailable=!isLocalProfile || (!!user && user.role === 'student' && !followState.availableIds.includes(id));
  const text=following ? 'Suivi' : 'Suivre';
  const click=()=>{
    if (!user) {navigate('/login',{state:{returnTo:`/companies/${encodeURIComponent(id)}`,returnState:{fromDirectory:`${location.pathname}${location.search}`}}});return;}
    const result=followState.setFollowing(id,!following);
    if ('error' in result) {setFailure(result.error);setNotice('');}
    else {setFailure('');setNotice(following ? 'Suivi retiré dans ce navigateur.' : 'Suivi enregistré dans ce navigateur.');}
  };
  const disabled=isLoading || !!followState.error || unavailable || (!!user && user.role !== 'student');
  return <div className={compact ? 'min-w-0' : 'min-w-0 sm:min-w-[155px]'}>
    <button type="button" disabled={disabled} aria-pressed={user?.role === 'student' ? following : undefined} aria-label={`${following ? 'Ne plus suivre' : 'Suivre'} ${name}`} onClick={click} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${following ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-amber-300 bg-amber-400 text-slate-900 hover:bg-amber-300'}`}>
      {following ? <Check size={16}/> : <Bookmark size={16}/>} {text}
    </button>
    {user && user.role !== 'student' && <p className="mt-1 text-xs text-slate-500">Réservé aux étudiants</p>}
    {!user && !isLoading && !unavailable && <p className="mt-1 text-xs text-slate-500">Connexion étudiante requise</p>}
    {unavailable && !followState.error && <p className="mt-1 text-xs text-slate-500">Profil indisponible pour le suivi local</p>}
    {(failure || followState.error) && <p role="alert" className="mt-1 text-xs text-red-700">{failure || followState.error}</p>}
    {notice && <p role="status" className="mt-1 text-xs text-green-700">{notice}</p>}
  </div>;
};
export default FollowRecruiterButton;
