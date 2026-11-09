import React from 'react';
import { Building2, Home, Briefcase, GraduationCap, Lightbulb, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RecruiterUniverse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <section className="py-24 bg-slate-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Pour les recruteurs</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">Entreprises et particuliers</h3>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">Les entreprises et les particuliers peuvent présenter leurs besoins aux étudiants et découvrir leurs projets.</p>
          <div className="space-y-5">
            <Link to="/companies" className="flex gap-5 group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900">
              <span className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-gray-100 shrink-0"><Building2 size={28} /></span>
              <span><span className="block text-xl font-bold text-slate-900 mb-2 group-hover:text-yellow-700">Entreprises</span><span className="text-gray-500 text-sm">Présentez votre organisation, publiez une offre et consultez les candidatures étudiantes reçues.</span><span className="block mt-2 text-sm font-bold text-slate-800 underline">Voir les entreprises inscrites</span></span>
            </Link>
            <Link to="/companies?tab=individuals" className="flex gap-5 group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900">
              <span className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600 border border-gray-100 shrink-0"><Home size={28} /></span>
              <span><span className="block text-xl font-bold text-slate-900 mb-2 group-hover:text-yellow-700">Particuliers</span><span className="text-gray-500 text-sm">Décrivez un besoin ponctuel et consultez les candidatures d’étudiants à votre annonce.</span><span className="block mt-2 text-sm font-bold text-slate-800 underline">Voir les particuliers inscrits</span></span>
            </Link>
          </div>
        </div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-heading font-bold text-slate-900 mb-5">Ce que vous pouvez faire</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><Briefcase className="text-blue-600 shrink-0" /><span className="text-sm text-slate-700"><strong>Publier une annonce</strong><br />Un abonnement actif est nécessaire pour publier ou modifier une offre.</span></div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><GraduationCap className="text-yellow-700 shrink-0" /><span className="text-sm text-slate-700"><strong>Consulter les candidatures</strong><br />Seuls les étudiants peuvent postuler.</span></div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><Lightbulb className="text-green-600 shrink-0" /><span className="text-sm text-slate-700"><strong>Découvrir les projets</strong><br />Explorez les idées présentées par les étudiants.</span></div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-5">Dans cette démonstration, les annonces, candidatures et propositions sont stockées dans ce navigateur ; elles ne sont pas transmises à d’autres utilisateurs.</p>
          {!user && <div className="grid sm:grid-cols-2 gap-3 mt-6"><button type="button" onClick={() => navigate('/register?type=company')} className="py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Compte entreprise</button><button type="button" onClick={() => navigate('/register?type=individual')} className="py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400">Compte particulier</button></div>}
          {(user?.role === 'company' || user?.role === 'individual') && <button type="button" onClick={() => navigate('/dashboard?tab=post-job')} className="w-full mt-6 py-3 bg-primary text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400">{user.role === 'company' ? 'Publier une offre' : 'Déposer une annonce'} <ArrowRight size={16} /></button>}
          {user?.role === 'student' && <Link to="/companies" className="mt-6 flex justify-center py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Découvrir les recruteurs inscrits</Link>}
        </div>
      </div>
    </section>
  );
};
export default RecruiterUniverse;
