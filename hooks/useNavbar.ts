
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { unreadTotal } = useMessaging();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  // Fermer les menus lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Fermer le menu profil si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const getInitials = () => {
     if (user && user.firstName) {
         return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase();
     }
     return 'ME';
  };

  const getSettingsLink = () => {
      if (user?.role === 'student') return "/profile?tab=settings";
      return "/dashboard?tab=settings";
  };

  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setIsOpen(false);
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);
  const closeProfileMenu = () => setIsProfileOpen(false);

  return {
    isOpen,
    isProfileOpen,
    profileRef,
    isLoggedIn,
    user,
    unreadTotal,
    handleLogout,
    getInitials,
    getSettingsLink,
    toggleMobileMenu,
    closeMobileMenu,
    toggleProfileMenu,
    closeProfileMenu
  };
};
