
import { useState, useEffect } from 'react';

export const useCandidateProfile = (candidate: any, onStatusChange?: (id: number, status: any) => void) => {
  const [status, setStatus] = useState<'pending' | 'interview' | 'rejected' | 'accepted'>('pending');
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [isLiveProfile, setIsLiveProfile] = useState(false);

  useEffect(() => {
      if (candidate) {
          setStatus(candidate.status || 'pending');
          
          // --- LIVE DATA HYDRATION ---
          // 1. On commence avec les données de la candidature (Snapshot)
          let mergedProfile = { ...candidate };

          // 2. On cherche si l'utilisateur existe toujours dans la base "Live"
          const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
          
          // Recherche par ID (ApplicantId) ou Email
          const liveUser = dbUsers.find((u: any) => 
              (candidate.applicantId && u.id && u.id.toString() === candidate.applicantId.toString()) ||
              (u.email === candidate.email)
          );

          if (liveUser) {
              // 3. On surcharge avec les données fraîches
              mergedProfile = {
                  ...mergedProfile, // Garde les infos de candidature (id, status, jobId...)
                  ...liveUser,      // Ecrase avec le profil à jour (bio, skills, avatar...)
                  role: liveUser.title || liveUser.role || candidate.role, // Priorité au titre actuel
                  location: liveUser.location || candidate.location
              };
              setIsLiveProfile(true);
          } else {
              setIsLiveProfile(false);
          }

          setFullProfile(mergedProfile);
      }
  }, [candidate]);

  const handleStatusUpdate = (newStatus: 'pending' | 'interview' | 'rejected' | 'accepted') => {
      setStatus(newStatus);
      if (onStatusChange) {
          onStatusChange(candidate.id, newStatus);
      }
  };

  return {
      fullProfile,
      status,
      isLiveProfile,
      handleStatusUpdate
  };
};
