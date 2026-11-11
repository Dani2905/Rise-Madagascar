
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCandidateDetails } from '../hooks/useCandidateDetails';
import CandidateSidebar from '../components/candidate-details/CandidateSidebar';
import CandidateMainContent from '../components/candidate-details/CandidateMainContent';

const CandidateDetails: React.FC = () => {
  const { 
      candidate, 
      status, 
      isLiveProfile, 
      handleContact, 
      handleStatusChange, 
      navigate, 
      isLoggedIn, loading, error
  } = useCandidateDetails();

  if (loading) return <p className="p-12 text-center text-slate-500">Chargement de la candidature…</p>;
  if (!candidate) return <div className="p-12 text-center"><h1 className="text-xl font-bold text-slate-900">Candidature indisponible</h1><p className="text-sm text-slate-600 mt-3">{error}</p><button type="button" onClick={() => navigate('/dashboard?tab=candidates')} className="mt-5 font-bold underline">Retour aux candidatures</button></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <ArrowLeft size={18} className="mr-2" /> Retour
                </button>
            </div>

            {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            <p className="mb-5 text-xs text-slate-500">Candidature et échanges simulés dans ce navigateur, sans protection serveur.</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- SIDEBAR GAUCHE --- */}
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                    <CandidateSidebar 
                        candidate={candidate}
                        status={status}
                        isLoggedIn={isLoggedIn}
                        handleContact={handleContact}
                        handleStatusChange={handleStatusChange}
                    />
                </div>

                {/* --- CONTENU PRINCIPAL --- */}
                <div className="lg:col-span-8">
                    <CandidateMainContent 
                        candidate={candidate}
                        isLiveProfile={isLiveProfile}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default CandidateDetails;
