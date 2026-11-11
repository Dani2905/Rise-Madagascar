import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2 } from 'lucide-react';
import { useFollowedRecruiters } from '../../hooks/useFollowedRecruiters';

const FollowedRecruiters: React.FC = () => {
  const { follows, error, setFollowing }=useFollowedRecruiters();
  const [failure,setFailure]=useState(''),[notice,setNotice]=useState('');
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-center gap-3"><span className="rounded-xl bg-amber-50 p-3 text-amber-700"><Bookmark size={21}/></span><div><h2 className="text-xl font-bold text-slate-900">Recruteurs suivis</h2><p className="mt-1 text-sm text-slate-500">Entreprises et particuliers enregistrés pour les retrouver facilement.</p></div></div>
    <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Suivi local et gratuit : aucune notification ni synchronisation entre appareils. Suivre un recruteur ne donne pas automatiquement le droit de lui envoyer un message.</p>
    {(failure || error) && <p role="alert" className="mt-4 text-sm text-red-700">{failure || error}</p>}{notice && <p role="status" className="mt-4 text-sm text-green-700">{notice}</p>}
    {follows.length ? <ul className="mt-5 divide-y divide-slate-100">{follows.map(p=><li key={p.id} className="flex flex-wrap items-center gap-3 py-4"><span className="rounded-xl bg-slate-100 p-3 text-slate-500"><Building2 size={18}/></span><div className="min-w-0 flex-1"><p className="break-words font-bold text-slate-900">{p.name} {p.isDemo && <span className="text-xs text-amber-700">Démonstration</span>}</p><p className="mt-1 text-xs text-slate-500">{p.available ? `${p.role === 'company' ? 'Entreprise' : 'Particulier'} · ${p.jobs} offre${p.jobs !== 1 ? 's' : ''} active${p.jobs !== 1 ? 's' : ''}` : 'Ce compte ne peut plus être identifié dans ce navigateur.'}</p></div><div className="flex flex-wrap gap-3">{p.available && <Link to={`/companies/${encodeURIComponent(p.id)}`} state={{fromFollowing:true}} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">Voir le profil<span className="sr-only"> de {p.name}</span></Link>}<button type="button" onClick={()=>{const result=setFollowing(p.id,false);if('error' in result){setFailure(result.error);setNotice('')}else{setFailure('');setNotice('Suivi retiré dans ce navigateur.')}}} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">Ne plus suivre<span className="sr-only"> {p.name}</span></button></div></li>)}</ul> : !error && <div className="py-12 text-center"><p className="font-bold text-slate-700">Vous ne suivez encore aucun recruteur.</p><Link to="/companies" className="mt-3 inline-block text-sm font-bold text-amber-700 underline">Découvrir les entreprises et particuliers</Link></div>}
  </section>;
};
export default FollowedRecruiters;
