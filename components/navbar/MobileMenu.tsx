
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Settings, LogOut } from 'lucide-react';
import RoleBasedLinks from './RoleBasedLinks';
import NavLinks from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  user: any;
  unreadTotal: number;
  onClose: () => void;
  handleLogout: () => void;
  getInitials: () => string;
  getSettingsLink: () => string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
    isOpen, 
    isLoggedIn, 
    user, 
    unreadTotal, 
    onClose, 
    handleLogout, 
    getInitials, 
    getSettingsLink 
}) => {
  
  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 px-4 py-6 overflow-y-auto max-h-[85vh]">
        {/* Mobile User Header */}
        {isLoggedIn && user && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-2 border-primary shadow-sm shrink-0">
                    {getInitials()}
                </div>
                <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 text-lg truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                        {user.role === 'company' ? 'Recruteur' : user.role === 'individual' ? 'Particulier' : 'Étudiant'}
                    </p>
                </div>
            </div>
        )}

        <div className="space-y-6">
            <NavLinks mobile onLinkClick={onClose} />
            
            <div className="border-t border-gray-100 pt-6">
                {isLoggedIn ? (
                    <div className="space-y-2">
                        <RoleBasedLinks role={user.role} isMobile onLinkClick={onClose} />
                        
                        <NavLink to="/messages" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-700" onClick={onClose}>
                            <span className="flex items-center gap-3">
                                <Mail size={20} /> Messagerie
                                {unreadTotal > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">{unreadTotal}</span>}
                            </span>
                        </NavLink>
                        <NavLink to={getSettingsLink()} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-700" onClick={onClose}>
                            <span className="flex items-center gap-3"><Settings size={20} /> Paramètres</span>
                        </NavLink>
                        <button 
                            onClick={handleLogout} 
                            className="w-full text-left block px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            <span className="flex items-center gap-3"><LogOut size={20} /> Déconnexion</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <NavLink 
                            to="/login" 
                            className="flex items-center justify-center w-full py-4 border border-gray-200 rounded-xl text-slate-700 font-bold hover:bg-gray-50 transition-colors"
                            onClick={onClose}
                        >
                            Se connecter
                        </NavLink>
                        <NavLink 
                            to="/register" 
                            className="flex items-center justify-center w-full py-4 bg-primary text-slate-900 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-yellow-400 transition-colors"
                            onClick={onClose}
                        >
                            S'inscrire
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MobileMenu;
