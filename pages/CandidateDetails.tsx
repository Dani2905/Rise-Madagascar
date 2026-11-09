
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
      isLoggedIn 
  } = useCandidateDetails();

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <ArrowLeft size={18} className="mr-2" /> Retour
                </button>
            </div>

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
