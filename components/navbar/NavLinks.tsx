
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavLinksProps {
  className?: string;
  mobile?: boolean;
  onLinkClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ className, mobile = false, onLinkClick }) => {
  
  // Container style : Flex row on desktop, Stack on mobile
  const containerClass = mobile 
    ? "space-y-1" 
    : "flex items-center space-x-8"; 

  // Link base style
  const baseLinkClass = mobile 
    ? "block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200" 
    : "text-sm font-bold transition-all duration-200 relative group py-2";

  // Active state style
  const getActiveClass = (isActive: boolean) => {
      if (mobile) {
          return isActive 
            ? 'bg-primary/10 text-slate-900 border border-primary/20' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900';
      }
      // Desktop: Simple highlight + underline effect
      return isActive 
        ? 'text-slate-900' 
        : 'text-gray-500 hover:text-slate-900';
  };

  const links = [
      { to: "/", label: "Accueil", end: true },
      { to: "/search", label: "Offres & Missions" },
      { to: "/companies", label: "Entreprises" },
      { to: "/resources", label: "Projets" },
      { to: "/about", label: "À Propos" },
  ];

  return (
    <div className={`${containerClass} ${className || ''}`}>
        {links.map((link) => (
            <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => `${baseLinkClass} ${getActiveClass(isActive)}`}
                onClick={onLinkClick}
                end={link.end}
            >
                {({ isActive }) => (
                    <>
                        {link.label}
                        {/* Desktop Underline Animation */}
                        {!mobile && (
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out rounded-full ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        )}
                    </>
                )}
            </NavLink>
        ))}
    </div>
  );
};

export default NavLinks;
