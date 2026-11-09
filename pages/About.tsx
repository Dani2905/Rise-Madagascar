import React from 'react';
import AboutHero from '../components/about/AboutHero';
import StudentUniverse from '../components/about/StudentUniverse';
import RecruiterUniverse from '../components/about/RecruiterUniverse';
import ValuesSection from '../components/about/ValuesSection';
import AboutCTA from '../components/about/AboutCTA';

const About: React.FC = () => {
  return (
    <div className="bg-white font-sans">
      <AboutHero />
      <StudentUniverse />
      <RecruiterUniverse />
      <ValuesSection />
      <AboutCTA />
    </div>
  );
};

export default About;