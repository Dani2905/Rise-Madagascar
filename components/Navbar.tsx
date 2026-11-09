
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { useNavbar } from '../hooks/useNavbar';

// Sub-components
import NavbarLogo from './navbar/NavbarLogo';
import NavLinks from './navbar/NavLinks';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';

const Navbar: React.FC = () => {
  const { 
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
  } = useNavbar();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <NavbarLogo />

          {/* Desktop Menu - Visible only on LG and up */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLinks />
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200/60"></div>
            
            {/* AUTH SECTION DESKTOP */}
            <UserMenu 
                isLoggedIn={isLoggedIn}
                user={user}
                isProfileOpen={isProfileOpen}
                profileRef={profileRef}
                unreadTotal={unreadTotal}
                toggleProfileMenu={toggleProfileMenu}
                closeProfileMenu={closeProfileMenu}
                handleLogout={handleLogout}
                getInitials={getInitials}
                getSettingsLink={getSettingsLink}
            />
          </div>

          {/* Mobile Menu Button - Visible up to LG */}
          <div className="flex items-center lg:hidden gap-3">
            {isLoggedIn && (
                <NavLink to="/messages" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <MessageSquare size={22} />
                    {unreadTotal > 0 && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                </NavLink>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-500 hover:text-slate-900 hover:bg-gray-100 focus:outline-none transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isOpen}
        isLoggedIn={isLoggedIn}
        user={user}
        unreadTotal={unreadTotal}
        onClose={closeMobileMenu}
        handleLogout={handleLogout}
        getInitials={getInitials}
        getSettingsLink={getSettingsLink}
      />
    </nav>
  );
};

export default Navbar;
