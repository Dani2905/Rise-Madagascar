import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedSection from '../components/home/FeaturedSection';
import CompaniesSection from '../components/home/CompaniesSection';
import StatsSection from '../components/home/StatsSection';
import SolutionsSection from '../components/home/SolutionsSection';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <FeaturedSection />
      <CompaniesSection />
      <SolutionsSection />
      <StatsSection />
      <Testimonials />
      <HowItWorks />
    </div>
  );
};

export default Home;