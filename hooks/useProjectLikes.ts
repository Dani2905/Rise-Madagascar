import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocalSession } from '../utils/subscription';
import { readLocalArray } from '../utils/recruiterDashboard';
import { getPublicProjects } from '../utils/projects';

const EVENT = 'rise-project-likes-changed';
const readObject = (key: string): Record<string, any> => {
  const raw = localStorage.getItem(key);
  const value = JSON.parse(raw || '{}');
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
  return value;
};
const readState = (key: string, userId: string, initialLikes: number) => {
  const counts = readObject('rise_project_likes_counts'), accounts = readObject('rise_project_likes_by_user');
  if (Object.values(accounts).some(v => !Array.isArray(v) || v.some(x => (typeof x !== 'string' && typeof x !== 'number') || !String(x).trim()))) throw new Error();
  if (Object.values(counts).some(v => typeof v !== 'number' || !Number.isFinite(v) || v < 0)) throw new Error();
  const likes = counts[key];
  return {liked: !!userId && Array.isArray(accounts[userId]) && accounts[userId].some((id:unknown) => String(id) === key),count: likes == null ? Math.max(0, Number(initialLikes) || 0) : likes};
};

/** Réactions de démonstration, liées à un compte dans ce navigateur uniquement. */
export function useProjectLikes(projectId: string | number, initialLikes: number) {
  const { user } = useAuth();
  const navigate = useNavigate(), location = useLocation();
  const key = String(projectId), userId = user?.id != null ? String(user.id) : '';
  const read = useCallback(() => {
    try {return readState(key,userId,initialLikes);} catch {return {liked:false,count:Math.max(0,Number(initialLikes) || 0)};}
  }, [key,userId,initialLikes]);
  const [state,setState]=useState(read), [error,setError]=useState('');
  useEffect(()=>{const refresh=()=>setState(read());refresh();window.addEventListener('storage',refresh);window.addEventListener(EVENT,refresh);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener(EVENT,refresh)}},[read]);
  const toggle = () => {
    setError('');
    if (!userId) {navigate('/login',{state:{returnTo:`${location.pathname}${location.search}`,returnState:location.state}});return;}
    try {
      if (!getCurrentLocalSession(user)) {setError('Votre session a changé. Reconnectez-vous pour réagir.');return;}
      const users=readLocalArray('rise_db_users'), matches=users.filter(u=>u?.id != null && String(u.id)===userId);
      if (matches.length !== 1 || matches[0].role !== user?.role) throw new Error();
      const currentProjects=getPublicProjects().filter(p=>String(p.id)===key);
      if (currentProjects.length !== 1) {setError('Ce projet n’est plus disponible.');return;}
      const current=readState(key,userId,initialLikes), accounts=readObject('rise_project_likes_by_user'), counts=readObject('rise_project_likes_counts');
      const selected: string[]=Array.isArray(accounts[userId]) ? accounts[userId].map(String) : [];
      accounts[userId]=current.liked ? selected.filter(id=>id!==key) : [...selected.filter(id=>id!==key),key];
      counts[key]=Math.max(0,current.count+(current.liked ? -1 : 1));
      const oldAccounts=localStorage.getItem('rise_project_likes_by_user'), oldCounts=localStorage.getItem('rise_project_likes_counts');
      try {localStorage.setItem('rise_project_likes_by_user',JSON.stringify(accounts));localStorage.setItem('rise_project_likes_counts',JSON.stringify(counts));}
      catch(e) {try {if(oldAccounts===null)localStorage.removeItem('rise_project_likes_by_user');else localStorage.setItem('rise_project_likes_by_user',oldAccounts);if(oldCounts===null)localStorage.removeItem('rise_project_likes_counts');else localStorage.setItem('rise_project_likes_counts',oldCounts);}catch{} throw e;}
      window.dispatchEvent(new window.Event(EVENT));
    } catch {setError('Impossible d’enregistrer la réaction : vérifiez les données locales ou l’espace de stockage.');}
  };
  return {...state,toggle,error};
}
