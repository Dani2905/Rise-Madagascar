import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Facebook, Twitter, Linkedin, Instagram, Mail, MapPin } from 'lucide-react';

// Helper Component pour les réseaux sociaux
const SocialIcon = ({ Icon }: { Icon: React.FC<{ className?: string, size?: number }> }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all text-slate-400 group">
        <Icon size={20} className="group-hover:scale-110 transition-transform" />
    </a>
);

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
    <Link to={to} className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200 text-sm font-medium">
        {children}
    </Link>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-white">
                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-primary/20">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-2xl block leading-none">Rise</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Madagascar</span>
                  </div>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                   La plateforme #1 qui connecte la jeunesse malgache aux opportunités professionnelles. Stages, Jobs, Missions & Freelance.
               </p>
               <div className="flex space-x-3 pt-2">
                  <SocialIcon Icon={Facebook} />
                  <SocialIcon Icon={Twitter} />
                  <SocialIcon Icon={Linkedin} />
                  <SocialIcon Icon={Instagram} />
               </div>
            </div>

            {/* Column 2: Candidates */}
            <div>
                <h3 className="text-white font-bold mb-6 font-heading text-lg flex items-center gap-2">
                    Pour les Étudiants
                </h3>
                <ul className="space-y-4">
                    <li><FooterLink to="/search">🔍 Trouver un stage / job</FooterLink></li>
                    <li><FooterLink to="/resources">🚀 Lancer un projet</FooterLink></li>
                    <li><FooterLink to="/register">👤 Créer mon profil gratuit</FooterLink></li>
                </ul>
            </div>

            {/* Column 3: Recruiters (Companies & Individuals) */}
            <div>
                <h3 className="text-white font-bold mb-6 font-heading text-lg flex items-center gap-2">
                    Recruteurs & Particuliers
                </h3>
                <ul className="space-y-4">
                    <li><FooterLink to="/companies">🏢 Espace Entreprise</FooterLink></li>
                    <li><FooterLink to="/companies">🏠 Espace Particulier</FooterLink></li>
                    <li><FooterLink to="/companies">📄 Publier une annonce</FooterLink></li>
                    <li><FooterLink to="/companies">💎 CVthèque (Bientôt)</FooterLink></li>
                </ul>
            </div>

            {/* Column 4: Newsletter/Contact */}
            <div>
                <h3 className="text-white font-bold mb-6 font-heading text-lg">Contact & Infos</h3>
                <div className="space-y-4 text-sm text-slate-400 mb-6">
                    <div className="flex items-start gap-3">
                         <MapPin className="shrink-0 text-primary mt-1" size={16} />
                         <span>Enceinte Tana Water Front, Ambodivona, Antananarivo 101</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <Mail className="shrink-0 text-primary" size={16} />
                         <a href="mailto:hello@rise.mg" className="hover:text-white transition-colors">hello@rise.mg</a>
                    </div>
                </div>
                
                {/* Mini Newsletter */}
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Votre email..." 
                        className="bg-slate-800 border border-slate-700 rounded-lg text-sm pl-4 pr-12 py-3 w-full focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder-slate-500 transition-all outline-none"
                    />
                    <button className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-slate-900 rounded-md font-bold text-xs hover:bg-yellow-400 transition-colors uppercase tracking-wide">
                        Go
                    </button>
                </form>
            </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Rise Madagascar. Fièrement développé à Tana 🇲🇬.</p>
          <div className="flex flex-wrap justify-center gap-8">
              <Link to="/about" className="hover:text-primary transition-colors">À Propos</Link>
              <Link to="#" className="hover:text-primary transition-colors">Mentions Légales</Link>
              <Link to="#" className="hover:text-primary transition-colors">Confidentialité</Link>
              <Link to="#" className="hover:text-primary transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;