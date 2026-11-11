
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MessagingProvider } from './context/MessagingContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import GlobalSearch from './pages/GlobalSearch';
import Register from './pages/Register';
import Login from './pages/Login';
import Resources from './pages/Resources';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import JobDetails from './pages/JobDetails';
import ProjectDetails from './pages/ProjectDetails';
import About from './pages/About';
import Profile from './pages/Profile';
import PublicCV from './pages/PublicCV';
import PublicStudentProfile from './pages/PublicStudentProfile';
import CandidateDetails from './pages/CandidateDetails';
import Messages from './pages/Messages';
import Pricing from './pages/Pricing';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout principal avec Navbar et Footer
const MainLayout = ({ children }: { children?: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MessagingProvider>
        <Router>
          <SubscriptionProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
            <Routes>
              {/* Standalone Routes (Pas de Navbar/Footer) */}
              <Route path="/cv/preview" element={<PublicCV />} />

              {/* Routes Principales */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/discover" element={<MainLayout><GlobalSearch /></MainLayout>} />
              <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
              <Route path="/jobs/:id" element={<MainLayout><JobDetails /></MainLayout>} />
              <Route path="/projects/:id" element={<MainLayout><ProjectDetails /></MainLayout>} />
              <Route path="/students/:id" element={<MainLayout><PublicStudentProfile /></MainLayout>} />
              <Route path="/companies" element={<MainLayout><Companies /></MainLayout>} />
              <Route path="/companies/:id" element={<MainLayout><CompanyDetails /></MainLayout>} />
              <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
              <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
              <Route path="/resources" element={<MainLayout><Resources /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
              
              {/* Espace Connecté */}
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
              <Route path="/candidates/:id" element={<MainLayout><CandidateDetails /></MainLayout>} />
              
              {/* Redirections Dashboard Legacy */}
              <Route path="/dashboard" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/my-jobs" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/my-ads" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/candidates" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/applications" element={<MainLayout><Profile /></MainLayout>} />

              {/* 404 Fallback */}
              <Route path="*" element={<MainLayout><Home /></MainLayout>} />
            </Routes>
          </div>
          </SubscriptionProvider>
        </Router>
      </MessagingProvider>
    </AuthProvider>
  );
};

export default App;