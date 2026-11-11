import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { readLocalArray } from '../utils/recruiterDashboard';
import { getCurrentLocalSession } from '../utils/subscription';
import { getActiveJobsForOwner } from '../utils/jobSearch';
import { isDemoRecruiter } from '../utils/demoRecruiter';

type Follow = { studentId: string; recruiterId: string };
export interface FollowedRecruiter { id: string; name: string; role: 'company'|'individual'; jobs: number; isDemo: boolean; available: boolean; }
type Result = {ok:true} | {ok:false;error:string};
const readFollows = (): Follow[] => {
  const all = readLocalArray('rise_recruiter_follows'), seen = new Set<string>();
  for (const item of all) {
    if (!item || typeof item.studentId !== 'string' || !item.studentId.trim() || typeof item.recruiterId !== 'string' || !item.recruiterId.trim()) throw new Error();
    const key=JSON.stringify([item.studentId,item.recruiterId]); if (seen.has(key)) throw new Error(); seen.add(key);
  }
  return all;
};
const nameOf = (u:any) => u.role === 'company' ? (typeof u.companyName === 'string' && u.companyName.trim()) || 'Entreprise' : [u.firstName,u.lastName].filter(v=>typeof v === 'string' && v.trim()).map(v=>v.trim()).join(' ') || 'Particulier';
export function useFollowedRecruiters() {
  const {user} = useAuth();
  const [follows,setFollows]=useState<FollowedRecruiter[]>([]), [availableIds,setAvailableIds]=useState<string[]>([]), [error,setError]=useState('');
  const refresh = useCallback(() => {
    if (!user || user.role !== 'student' || !getCurrentLocalSession(user)) {setFollows([]);setAvailableIds([]);setError('');return;}
    try {
      const stored=readFollows(), users=readLocalArray('rise_db_users');
      const counts=new Map<string,number>();users.forEach(u=>{if(u?.id != null) counts.set(String(u.id),(counts.get(String(u.id))||0)+1)});
      const ownAccounts=users.filter(u=>u?.id != null && String(u.id)===String(user.id));
      if (ownAccounts.length !== 1 || ownAccounts[0].role !== 'student') throw new Error();
      const recruiterUsers=users.filter(u=>u?.id != null && counts.get(String(u.id))===1 && ['company','individual'].includes(u.role));
      setAvailableIds(recruiterUsers.map(u=>String(u.id)));
      const own=stored.filter(f=>f.studentId===String(user.id)).map(f=>{
        const found=recruiterUsers.find(u=>String(u.id)===f.recruiterId);
        if(!found) return {id:f.recruiterId,name:'Compte indisponible',role:'company' as const,jobs:0,isDemo:false,available:false};
        return {id:f.recruiterId,name:nameOf(found),role:found.role as 'company'|'individual',jobs:getActiveJobsForOwner(found.id).length,isDemo:isDemoRecruiter(found),available:true};
      });
      setFollows(own);setError('');
    } catch {setFollows([]);setAvailableIds([]);setError('Les suivis ou les comptes locaux sont illisibles. Aucune donnée n’a été modifiée.');}
  },[user?.id,user?.role]);
  useEffect(()=>{refresh();window.addEventListener('storage',refresh);window.addEventListener('focus',refresh);window.addEventListener('rise:follow-change',refresh);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('focus',refresh);window.removeEventListener('rise:follow-change',refresh)}},[refresh]);
  const setFollowing = (recruiterId:string, following:boolean):Result => {
    try {
      if (!user || user.role !== 'student' || !getCurrentLocalSession(user)) return {ok:false,error:'Votre session étudiante a changé. Reconnectez-vous.'};
      if (!recruiterId || typeof following !== 'boolean') return {ok:false,error:'Compte invalide.'};
      const users=readLocalArray('rise_db_users'), own=users.filter(u=>u?.id != null && String(u.id)===String(user.id)), targets=users.filter(u=>u?.id != null && String(u.id)===recruiterId);
      if (own.length !== 1 || own[0].role !== 'student') return {ok:false,error:'Votre compte étudiant est introuvable ou ambigu.'};
      if (following && (targets.length !== 1 || !['company','individual'].includes(targets[0].role))) return {ok:false,error:'Ce recruteur local est introuvable ou ambigu.'};
      const all=readFollows(), match=(f:Follow)=>f.studentId===String(user.id) && f.recruiterId===recruiterId;
      const next=following ? (all.some(match) ? all : [...all,{studentId:String(user.id),recruiterId}]) : all.filter(f=>!match(f));
      if (next !== all) localStorage.setItem('rise_recruiter_follows',JSON.stringify(next));
      window.dispatchEvent(new window.Event('rise:follow-change'));
      return {ok:true};
    } catch {return {ok:false,error:'Impossible d’enregistrer ce suivi dans ce navigateur.'};}
  };
  return {follows,availableIds,error,setFollowing,refresh};
}
