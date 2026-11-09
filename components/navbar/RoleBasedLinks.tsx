
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, ClipboardList, Megaphone, User, FileText, Rocket, FileCheck } from 'lucide-react';

interface RoleBasedLinksProps {
  role?: string;
  isMobile?: boolean;
  onLinkClick: () => void;
}

const RoleBasedLinks: React.FC<RoleBasedLinksProps> = ({ role, isMobile = false, onLinkClick }) => {
    
    const linkStyle = isMobile 
        ? ({ isActive }: { isActive: boolean }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-700'}`
        : ({ isActive }: { isActive: boolean }) => `flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 transition-colors ${isActive ? 'bg-yellow-50 text-yellow-800' : ''}`;

    const iconClass = isMobile ? "mr-3" : "mr-3 text-gray-400";
    const containerClass = isMobile ? "" : "py-1";

    const ContentWrapper = ({ children, icon: Icon }: { children?: React.ReactNode, icon: any }) => (
        isMobile ? <span className="flex items-center gap-2"><Icon size={18} /> {children}</span> : <><Icon size={16} className={iconClass} /> {children}</>
    );

    if (role === 'company') {
        return (
            <div className={containerClass}>
                <NavLink to="/dashboard?tab=dashboard" className={linkStyle} onClick={onLinkClick} end>
                    <ContentWrapper icon={LayoutDashboard}>Tableau de bord</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=jobs" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={Briefcase}>Mes Offres</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=candidates" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={Users}>CVthèque</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=mentoring" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={ClipboardList}>Suivi</ContentWrapper>
                </NavLink>
            </div>
        );
    } 
    
    if (role === 'individual') {
        return (
            <div className={containerClass}>
                <NavLink to="/dashboard?tab=dashboard" className={linkStyle} onClick={onLinkClick} end>
                    <ContentWrapper icon={LayoutDashboard}>Tableau de bord</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=ads" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={Megaphone}>Mes Annonces</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=candidates" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={Users}>Réponses</ContentWrapper>
                </NavLink>
                <NavLink to="/dashboard?tab=mentoring" className={linkStyle} onClick={onLinkClick}>
                    <ContentWrapper icon={ClipboardList}>Suivi</ContentWrapper>
                </NavLink>
            </div>
        );
    } 
    
    // Default: Student
    return (
        <div className={containerClass}>
            <NavLink to="/profile?tab=overview" className={linkStyle} onClick={onLinkClick} end>
                <ContentWrapper icon={User}>Mon Profil</ContentWrapper>
            </NavLink>
            <NavLink to="/profile?tab=applications" className={linkStyle} onClick={onLinkClick}>
                <ContentWrapper icon={FileText}>Mes Candidatures</ContentWrapper>
            </NavLink>
            <NavLink to="/profile?tab=projects" className={linkStyle} onClick={onLinkClick}>
                <ContentWrapper icon={Rocket}>Mes Projets</ContentWrapper>
            </NavLink>
            <NavLink to="/cv/preview" className={linkStyle} onClick={onLinkClick}>
                <ContentWrapper icon={FileCheck}>Mon CV Public</ContentWrapper>
            </NavLink>
        </div>
    );
};

export default RoleBasedLinks;