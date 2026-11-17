import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recruiterCanRateStudent } from '../../context/MessagingContext';
import { useStudentRating } from '../../hooks/useStudentRating';
import { formatStudentAverage, saveStudentRating } from '../../utils/studentRatings';

const StudentRating: React.FC<{studentId:string|number}> = ({studentId}) => {
  const {user,isLoading}=useAuth();
  const location=useLocation();
  const rating=useStudentRating(studentId,user);
  const [selected,setSelected]=useState<number>(0);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const recruiter=!!user && ['company','individual'].includes(user.role);
  const allowed=recruiter && recruiterCanRateStudent(user,studentId);
  useEffect(()=>setSelected(rating.mine || 0),[studentId,rating.mine]);
  const save=(score:number|null)=>{
    setError('');setMessage('');
    if(score===0){setError('Choisissez une note de 1 à 5 étoiles.');return;}
    try {saveStudentRating(studentId,user,score); setMessage(score===null?'Votre note locale a été retirée.':'Votre note locale a été enregistrée.');}
    catch(e){setError(e instanceof Error ? e.message : 'Impossible de sauvegarder la note.');}
  };
  return <section aria-label="Évaluation du profil étudiant" className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Star size={20} className="fill-amber-400 text-amber-400"/> Évaluations des recruteurs</h2>
    <p className="mt-2 text-xs leading-5 text-slate-500">Notes déclaratives non vérifiées, pas nécessairement liées à une mission. Dans cette démonstration, elles restent dans ce navigateur et ne sont pas synchronisées.</p>
    {rating.error ? <p role="alert" className="mt-4 text-sm text-red-700">Les évaluations locales sont illisibles ; aucune note n’a été modifiée.</p> : <>
      {rating.count ? <div className="mt-4 flex flex-wrap items-center gap-3"><strong className="text-2xl text-slate-900">{formatStudentAverage(rating.average!)} <span className="text-sm text-slate-500">/ 5</span></strong><span className="flex gap-0.5" aria-hidden="true">{[1,2,3,4,5].map(i=><Star key={i} size={17} className={i<=Math.round(rating.average!)?'fill-amber-400 text-amber-400':'text-slate-300'}/>)}</span><span className="text-sm text-slate-500">{rating.count} {rating.count===1?'évaluation':'évaluations'}</span></div> : <p className="mt-4 text-sm text-slate-500">Pas encore d’évaluation.</p>}
      {allowed && <form onSubmit={e=>{e.preventDefault();save(selected);}} className="mt-5 border-t border-slate-100 pt-4"><fieldset><legend className="text-sm font-bold text-slate-800">{rating.mine ? 'Modifier votre note' : 'Attribuer une note'}</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map(i=><label key={i} className="cursor-pointer rounded-md p-1 focus-within:outline focus-within:outline-2 focus-within:outline-amber-500"><input className="sr-only" type="radio" name={`student-score-${studentId}`} value={i} checked={selected===i} onChange={()=>setSelected(i)} aria-label={`${i} ${i===1?'étoile':'étoiles'}`}/><Star size={25} aria-hidden="true" className={i<=selected?'fill-amber-400 text-amber-400':'text-slate-300'}/></label>)}</div></fieldset><div className="mt-3 flex flex-wrap gap-3"><button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700">Enregistrer ma note</button>{rating.mine && <button type="button" onClick={()=>save(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Retirer ma note</button>}</div><p className="mt-2 text-xs text-slate-500">Une note par recruteur et par étudiant. Aucun abonnement requis.</p></form>}
      {!isLoading && !user && <p className="mt-4 text-sm text-slate-600"><Link to="/login" state={{returnTo:`${location.pathname}${location.search}`,returnState:location.state}} className="font-bold text-amber-700 underline">Connectez-vous</Link> avec un compte entreprise ou particulier pour attribuer une note.</p>}
      {!isLoading && recruiter && !allowed && <p className="mt-4 text-sm text-slate-500">Cette évaluation n’est pas disponible pour votre session.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-green-700">{message}</p>}
    </>}
  </section>;
};
export default StudentRating;
