import React, { useState, useEffect } from 'react';
import ResourcesHero from '../components/resources/ResourcesHero';
import ProcessSteps from '../components/resources/ProcessSteps';
import ProjectsFeed from '../components/resources/ProjectsFeed';
import ProjectSubmissionForm from '../components/resources/ProjectSubmissionForm';
import GuidesTab from '../components/resources/GuidesTab';
import FaqSection from '../components/resources/FaqSection';

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'guides'>('projects');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Tous');

  useEffect(() => {
    // Vérification basique de "session" via localStorage
    const userData = localStorage.getItem('rise_user_data');
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
       {/* 1. Hero Section */}
       <ResourcesHero activeTab={activeTab} setActiveTab={setActiveTab} />

       {/* 2. Process Steps */}
       <ProcessSteps activeTab={activeTab} />

       {/* 3. Main Content Area */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* TAB 1: PROJECTS HUB */}
          {activeTab === 'projects' && (
             <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
                
                {/* Left Col: Projects Feed */}
                <ProjectsFeed 
                    filterCategory={filterCategory} 
                    setFilterCategory={setFilterCategory} 
                />

                {/* Right Col: Submission Form */}
                <ProjectSubmissionForm isLoggedIn={isLoggedIn} />
             </div>
          )}

          {/* TAB 2: GUIDES & RESOURCES */}
          {activeTab === 'guides' && (
             <GuidesTab />
          )}

           {/* 4. FAQ Section */}
           <FaqSection />

       </div>
    </div>
  );
};

export default Resources;