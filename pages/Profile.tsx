import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import CompanyDashboard from '../components/dashboard/CompanyDashboard';
import IndividualDashboard from '../components/dashboard/IndividualDashboard';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();

  // Protect Route
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
        navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'company' && <CompanyDashboard />}
      {user.role === 'individual' && <IndividualDashboard />}
      {/* Fallback default */}
      {!user.role && <StudentDashboard />}
    </div>
  );
};

export default Profile;