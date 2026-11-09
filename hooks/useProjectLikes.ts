import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EVENT = 'rise-project-likes-changed';
const readObject = (key: string): Record<string, any> => {
  try { const v = JSON.parse(localStorage.getItem(key) || '{}'); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch { return {}; }
};

/** Les réactions sont simulées dans le navigateur et identifiées par compte local. */
export function useProjectLikes(projectId: string | number, initialLikes: number) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const key = String(projectId);
  const userId = user?.id != null ? String(user.id) : '';
  const read = useCallback(() => {
    const counts = readObject('rise_project_likes_counts');
    const accounts = readObject('rise_project_likes_by_user');
    const likes = Number(counts[key]);
    return { liked: !!userId && Array.isArray(accounts[userId]) && accounts[userId].some((id: unknown) => String(id) === key), count: Number.isFinite(likes) && counts[key] != null ? Math.max(0, likes) : Math.max(0, Number(initialLikes) || 0) };
  }, [key, userId, initialLikes]);
  const [state, setState] = useState(read);
  useEffect(() => {
    const refresh = () => setState(read());
    refresh(); window.addEventListener('storage', refresh); window.addEventListener(EVENT, refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener(EVENT, refresh); };
  }, [read]);
  const toggle = () => {
    if (!userId) { navigate('/login', { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } }); return; }
    const current = read();
    const accounts = readObject('rise_project_likes_by_user');
    const selected = Array.isArray(accounts[userId]) ? accounts[userId].map(String) : [];
    accounts[userId] = current.liked ? selected.filter((id: string) => id !== key) : [...selected.filter((id: string) => id !== key), key];
    const counts = readObject('rise_project_likes_counts');
    counts[key] = Math.max(0, current.count + (current.liked ? -1 : 1));
    try {
      localStorage.setItem('rise_project_likes_by_user', JSON.stringify(accounts));
      localStorage.setItem('rise_project_likes_counts', JSON.stringify(counts));
      window.dispatchEvent(new Event(EVENT));
    } catch {
      if (window.Toastify) window.Toastify({ text: 'Impossible d’enregistrer cette réaction dans le navigateur.', style: { background: '#ef4444' } }).showToast();
    }
  };
  return { ...state, toggle };
}
