import React from 'react';
import { ArrowRight, Building2, GraduationCap, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pathways = [
  {
    key: 'student',
    title: 'Étudiants',
    icon: GraduationCap,
    intro: 'Pour trouver une opportunité ou faire avancer un projet.',
    steps: [
      { title: 'Créez votre compte étudiant', description: 'Complétez votre profil pour présenter votre parcours.' },
      { title: 'Cherchez et postulez', description: 'Consultez les stages, jobs et missions proposés par les entreprises et les particuliers.' },
      { title: 'Publiez votre projet', description: 'Présentez votre idée et vos besoins pour chercher des investisseurs ou des collaborateurs.' }
    ],
    note: 'Les étapes 2 et 3 sont indépendantes : choisissez selon vos objectifs.'
  },
  {
    key: 'company',
    title: 'Entreprises',
    icon: Building2,
    intro: 'Pour recruter des étudiants et découvrir leurs projets.',
    steps: [
      { title: 'Créez votre compte entreprise', description: 'Renseignez les informations de votre organisation.' },
      { title: 'Publiez une offre', description: 'Décrivez le poste, le lieu et les conditions proposés aux étudiants.' },
      { title: 'Consultez les candidatures', description: 'Examinez les candidatures d’étudiants reçues pour votre offre.' }
    ],
    note: 'Vous pouvez aussi découvrir et proposer un soutien aux projets étudiants, sans publier d’offre.'
  },
  {
    key: 'individual',
    title: 'Particuliers',
    icon: UserRound,
    intro: 'Pour trouver un étudiant pour un besoin ponctuel.',
    steps: [
      { title: 'Créez votre compte particulier', description: 'Renseignez votre profil pour accéder à votre espace.' },
      { title: 'Déposez une annonce', description: 'Expliquez votre besoin, le lieu et la rémunération prévue.' },
      { title: 'Consultez les candidatures', description: 'Examinez les réponses des étudiants à votre annonce.' }
    ],
    note: 'Vous pouvez aussi découvrir et proposer un soutien aux projets étudiants, sans déposer d’annonce.'
  }
];

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Trois profils, des parcours adaptés : découvrez ce que vous pouvez faire sur Rise Madagascar.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pathways.map(pathway => (
            <div key={pathway.key} className="flex flex-col p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-yellow-100 text-slate-900"><pathway.icon size={24} /></div>
                <h3 className="text-xl font-heading font-bold text-slate-900">{pathway.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">{pathway.intro}</p>
              <ol className="space-y-5">
                {pathway.steps.map((step, index) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-white border border-yellow-200 text-sm font-bold text-slate-900">{index + 1}</span>
                    <div><h4 className="font-bold text-slate-900 text-sm">{step.title}</h4><p className="text-sm text-slate-600 leading-relaxed mt-1">{step.description}</p></div>
                  </li>
                ))}
              </ol>
              {pathway.note && <p className="mt-6 text-xs text-slate-500 leading-relaxed">{pathway.note}</p>}
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-6 text-center text-sm text-slate-600 leading-relaxed">
          Seuls les étudiants peuvent postuler aux offres et publier des projets. La consultation est accessible avec un compte gratuit. Un abonnement actif est requis pour postuler, publier un projet ou publier une offre.
          <p className="text-xs text-slate-500 mt-2">Version de démonstration : les données sont enregistrées dans ce navigateur et l’activation de l’abonnement est simulée.</p>
        </div>

        <div className="relative mt-16 rounded-3xl overflow-hidden bg-primary px-6 py-14 md:px-16 text-center shadow-xl shadow-primary/20 max-w-4xl mx-auto">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 mb-4">Prêt à démarrer ?</h2>
            <p className="text-slate-800 text-lg mb-8 max-w-xl mx-auto font-medium">Choisissez l’action qui correspond à votre profil.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {!user && <>
                <button type="button" onClick={() => navigate('/register?type=student')} className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm">Compte étudiant</button>
                <button type="button" onClick={() => navigate('/register?type=company')} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-sm">Compte entreprise</button>
                <button type="button" onClick={() => navigate('/register?type=individual')} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-sm">Compte particulier</button>
              </>}
              {user?.role === 'student' && <>
                <button type="button" onClick={() => navigate('/search')} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-sm">Voir les offres</button>
                <button type="button" onClick={() => navigate('/profile?tab=projects&action=new')} className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm">Publier un projet</button>
              </>}
              {(user?.role === 'company' || user?.role === 'individual') && <>
                <button type="button" onClick={() => navigate('/dashboard?tab=post-job')} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-sm">{user.role === 'company' ? 'Publier une offre' : 'Déposer une annonce'} <ArrowRight size={17} /></button>
                <button type="button" onClick={() => navigate('/resources')} className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm">Découvrir les projets</button>
              </>}
            </div>
          </div>
          <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
