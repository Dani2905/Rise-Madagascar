
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const NavbarLogo: React.FC = () => {
  return (
    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
        <NavLink to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-slate-900">
            <Rocket size={20} />
        </div>
        <span className="font-heading font-bold text-xl text-slate-900">
            Rise
        </span>
    </NavLink>
    </div>
  );
};

export default NavbarLogo;
