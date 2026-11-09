import React from 'react';
import { Building2, ShieldCheck, Users, Zap, Home, GraduationCap, Star } from 'lucide-react';

const RecruiterFeatures: React.FC = () => {
  return (
    <section className="bg-white border-t border-gray-100 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-slate-900 font-bold text-sm mb-4">
                  Pour Tous
               </span>
               <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Pourquoi recruter sur Rise ?</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">
                  Que vous soyez DRH d'un grand groupe ou un parent cherchant un prof de maths, Rise vous aide à présenter vos besoins aux étudiants.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Corporate Side */}
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><Building2 className="text-blue-600" /></div>
                      <h3 className="text-xl font-bold text-slate-900">Pour les Entreprises</h3>
                  </div>
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <ShieldCheck className="text-green-500 shrink-0" size={18} />
                          <span><strong>Candidatures étudiantes :</strong> Consultez les réponses aux offres que vous publiez.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <Users className="text-blue-500 shrink-0" size={18} />
                          <span><strong>Parcours et compétences :</strong> Découvrez les informations partagées par les candidats.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <Zap className="text-yellow-500 shrink-0" size={18} />
                          <span><strong>Marque employeur :</strong> Mettez en avant votre culture d'entreprise.</span>
                      </li>
                  </ul>
               </div>

               {/* Individual Side */}
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><Home className="text-orange-600" /></div>
                      <h3 className="text-xl font-bold text-slate-900">Pour les Particuliers</h3>
                  </div>
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <GraduationCap className="text-slate-700 shrink-0" size={18} />
                          <span><strong>Étudiants sérieux :</strong> Idéal pour le soutien scolaire ou l'aide aux devoirs.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <ShieldCheck className="text-green-500 shrink-0" size={18} />
                          <span><strong>Échange :</strong> Consultez les candidatures reçues pour votre annonce.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                          <Star className="text-yellow-500 shrink-0" size={18} />
                          <span><strong>Simplicité :</strong> Décrivez votre besoin et publiez une annonce.</span>
                      </li>
                  </ul>
               </div>
            </div>
         </div>
    </section>
  );
};

export default RecruiterFeatures;