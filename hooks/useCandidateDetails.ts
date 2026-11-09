
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useCandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [candidate, setCandidate] = useState<any>(null);
  const [status, setStatus] = useState<'pending' | 'interview' | 'rejected' | 'accepted' | null>(null);
  const [isLiveProfile, setIsLiveProfile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const idParam = id; // string from URL

    // 1. Tenter de trouver une APPLICATION correspondante (Snapshot)
    const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
    const appSnapshot = allApps.find((app: any) => app.id.toString() === idParam);

    // 2. Tenter de trouver un UTILISATEUR correspondant (Live User)
    const allUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    let liveUser = null;

    if (appSnapshot) {
        liveUser = allUsers.find((u: any) => 
            (appSnapshot.applicantId && u.id && u.id.toString() === appSnapshot.applicantId.toString()) ||
            u.email === appSnapshot.email
        );
        setStatus(appSnapshot.status);
    } else {
        liveUser = allUsers.find((u: any) => u.id.toString() === idParam);
    }

    if (liveUser) {
        setCandidate({
            ...appSnapshot, 
            ...liveUser,    
            role: liveUser.title || liveUser.role || appSnapshot?.role,
            location: liveUser.location || appSnapshot?.location,
            name: `${liveUser.firstName} ${liveUser.lastName}`,
            avatarUrl: liveUser.avatarUrl || appSnapshot?.avatarUrl,
            // Important pour la messagerie : garder l'ID réel de l'utilisateur
            realUserId: liveUser.id 
        });
        setIsLiveProfile(true);
    } else if (appSnapshot) {
        setCandidate(appSnapshot);
        setIsLiveProfile(false);
    } else {
        setCandidate(null);
    }

  }, [id]);

  const handleContact = () => {
      if (!isLoggedIn || !candidate) return;
      
      const targetId = candidate.realUserId || candidate.applicantId;
      
      if(targetId) {
          navigate(`/messages?partner=${targetId}`);
      } else {
          window.Toastify({ text: "Impossible de contacter ce profil (compte supprimé).", style: { background: "#ef4444" } }).showToast();
      }
  };

  const handleStatusChange = (newStatus: 'pending' | 'interview' | 'rejected' | 'accepted', label: string) => {
      setStatus(newStatus);
      if (candidate.jobId) {
          const allApps = JSON.parse(localStorage.getItem('rise_applications') || '[]');
          const updatedApps = allApps.map((app: any) => 
              (app.id === candidate.id) ? { ...app, status: newStatus } : app
          );
          localStorage.setItem('rise_applications', JSON.stringify(updatedApps));
      }
      window.Toastify({ text: `Statut mis à jour : ${label}`, style: { background: "#334155" } }).showToast();
  };

  return {
      candidate,
      status,
      isLiveProfile,
      handleContact,
      handleStatusChange,
      navigate,
      isLoggedIn
  };
};
