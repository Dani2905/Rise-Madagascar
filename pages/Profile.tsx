import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import CompanyDashboard from '../components/dashboard/CompanyDashboard';
import IndividualDashboard from '../components/dashboard/IndividualDashboard';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isLoading } = useAuth();

  // Protect Route
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
        navigate('/login', { replace: true, state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } });
    }
  }, [isLoading, isLoggedIn, navigate, location.pathname, location.search, location.state]);

  if (isLoading || !user) return null;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

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