
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogIn, UserPlus, ChevronDown, MessageSquare, Settings, LogOut } from 'lucide-react';
import RoleBasedLinks from './RoleBasedLinks';

interface UserMenuProps {
  isLoggedIn: boolean;
  user: any;
  isProfileOpen: boolean;
  profileRef: React.RefObject<HTMLDivElement>;
  unreadTotal: number;
  toggleProfileMenu: () => void;
  closeProfileMenu: () => void;
  handleLogout: () => void;
  getInitials: () => string;
  getSettingsLink: () => string;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
    isLoggedIn, 
    user, 
    isProfileOpen, 
    profileRef, 
    unreadTotal, 
    toggleProfileMenu, 
    closeProfileMenu, 
    handleLogout, 
    getInitials, 
    getSettingsLink 
}) => {

  if (!isLoggedIn || !user) {
      return (
        <div className="flex items-center gap-4">
            <NavLink to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                <LogIn size={18} /> Connexion
            </NavLink>
            <NavLink
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
                <UserPlus size={18} /> S'inscrire
            </NavLink>
        </div>
      );
  }

  return (
    <div className="flex items-center gap-3">
        {/* MESSAGING ICON */}
        <NavLink to="/messages" className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-slate-900 transition-colors" title="Messagerie">
            <MessageSquare size={20} />
            {unreadTotal > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
        </NavLink>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
            <button 
                onClick={toggleProfileMenu}
                className="flex items-center gap-3 focus:outline-none group p-1 pr-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-sm border-2 border-white shadow-md overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        getInitials()
                    )}
                </div>
                <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-primary transition-colors max-w-[100px] truncate">{user.firstName}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5 tracking-wide">
                        {user.role === 'company' ? 'Recruteur' : user.role === 'individual' ? 'Particulier' : 'Étudiant'}
                    </p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in origin-top-right ring-1 ring-black/5">
                    <div className="px-5 py-4 border-b border-gray-50 mb-2 bg-gradient-to-r from-gray-50 to-white">
                        <p className="text-base font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate font-medium">{user.email || 'membre@rise.mg'}</p>
                    </div>
                    
                    <div className="px-2">
                        <RoleBasedLinks role={user.role} onLinkClick={closeProfileMenu} />
                        
                        <NavLink to="/messages" onClick={closeProfileMenu} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-slate-900 rounded-xl transition-colors">
                            <MessageSquare size={16} className="mr-3 text-gray-400" /> Messagerie
                            {unreadTotal > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadTotal}</span>}
                        </NavLink>

                        <NavLink to={getSettingsLink()} onClick={closeProfileMenu} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-slate-900 rounded-xl transition-colors">
                            <Settings size={16} className="mr-3 text-gray-400" /> Paramètres
                        </NavLink>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2 px-2 pb-1">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
                        >
                            <LogOut size={16} className="mr-3" /> Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default UserMenu;
