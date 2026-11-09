import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedSection from '../components/home/FeaturedSection';
import CompaniesSection from '../components/home/CompaniesSection';
import SolutionsSection from '../components/home/SolutionsSection';
import HowItWorks from '../components/home/HowItWorks';

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <FeaturedSection />
      <CompaniesSection />
      <SolutionsSection />
      <HowItWorks />
    </div>
  );
};

export default Home;