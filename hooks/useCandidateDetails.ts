import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOwnedCandidate, readLocalArray } from '../utils/recruiterDashboard';
import { getCurrentLocalSession } from '../utils/subscription';

export const useCandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading, user } = useAuth();
  const [candidate, setCandidate] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLiveProfile, setIsLiveProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) { navigate('/login', { replace: true, state: { returnTo: `${location.pathname}${location.search}` } }); return; }
    const refresh = () => {
      try {
        if (!getCurrentLocalSession(user)) throw new Error();
        const apps = readLocalArray('rise_applications'), users = readLocalArray('rise_db_users'), jobs = readLocalArray('rise_jobs');
        const app = id != null ? getOwnedCandidate(user, id, apps, jobs, users) : null;
        if (!app) { setCandidate(null); setError('Cette candidature est introuvable ou ne correspond pas à une de vos offres.'); setLoading(false); return; }
        const students = users.filter(u => u?.role === 'student' && (app.applicantId != null ? u.id != null && String(u.id) === String(app.applicantId) : typeof app.email === 'string' && typeof u.email === 'string' && u.email.toLowerCase() === app.email.toLowerCase()));
        const live = students.length === 1 ? students[0] : null;
        // Ne jamais recopier les identifiants ni les données de compte dans la fiche.
        setCandidate({ id: app.id, jobId: app.jobId, applicantId: app.applicantId, realUserId: live?.id, name: live ? `${live.firstName || ''} ${live.lastName || ''}`.trim() : app.name || 'Candidat', role: live?.title || app.role || 'Étudiant', location: live?.location || app.location || '', avatarUrl: live?.avatarUrl || app.avatarUrl || '', email: live?.email || app.email || '', phone: live?.phone || app.phone || '', school: live?.school || app.school || '', bio: live?.bio || app.bio || '', skills: Array.isArray(live?.skills) ? live.skills : Array.isArray(app.skills) ? app.skills : [], experiences: Array.isArray(live?.experiences) ? live.experiences : Array.isArray(app.experiences) ? app.experiences : [], reviews: Array.isArray(live?.reviews) ? live.reviews : [], rating: live?.rating || 0, reviewCount: live?.reviewCount || 0 });
        setStatus(app.status || 'pending'); setIsLiveProfile(!!live); setError(''); setLoading(false);
      } catch { setCandidate(null); setLoading(false); setError('Les données locales de candidature sont illisibles.'); }
    };
    refresh(); window.addEventListener('storage', refresh); window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, [id, isLoading, isLoggedIn, user, navigate, location.pathname, location.search]);

  const handleContact = () => {
    if (!isLoggedIn || !getCurrentLocalSession(user) || !candidate?.realUserId) { setError('Le compte local du candidat est introuvable.'); return; }
    navigate(`/messages?partner=${encodeURIComponent(String(candidate.realUserId))}`);
  };
  const handleStatusChange = (newStatus: 'pending' | 'interview' | 'rejected' | 'accepted', _label: string) => {
    try {
      if (!getCurrentLocalSession(user)) throw new Error();
      const apps = readLocalArray('rise_applications'), jobs = readLocalArray('rise_jobs'), users = readLocalArray('rise_db_users');
      const app = id != null ? getOwnedCandidate(user, id, apps, jobs, users) : null;
      if (!app || app.status === 'completed') throw new Error();
      localStorage.setItem('rise_applications', JSON.stringify(apps.map(a => a === app ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a)));
      setStatus(newStatus); setError('');
    } catch { setError('Impossible de modifier cette candidature dans ce navigateur.'); }
  };
  return { candidate, status, isLiveProfile, handleContact, handleStatusChange, navigate, isLoggedIn, loading, error };
};
