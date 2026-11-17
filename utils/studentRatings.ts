import { readLocalArray } from './recruiterDashboard';
import { getCurrentLocalSession } from './subscription';
import { recruiterCanRateStudent } from '../context/MessagingContext';

const KEY='rise_student_star_ratings';
export const RATING_EVENT='rise:student-ratings-changed';
type Rating={studentId:string; recruiterId:string; score:number; updatedAt:string};
function readRatings():Rating[] {
  const rows=readLocalArray(KEY), seen=new Set<string>();
  for(const row of rows){
    if(!row || typeof row.studentId!=='string' || !row.studentId.trim() || typeof row.recruiterId!=='string' || !row.recruiterId.trim() || !Number.isInteger(row.score) || row.score<1 || row.score>5 || typeof row.updatedAt!=='string' || !Number.isFinite(Date.parse(row.updatedAt))) throw new Error('Les évaluations locales sont illisibles.');
    const key=JSON.stringify([row.studentId,row.recruiterId]); if(seen.has(key)) throw new Error('Évaluations locales en double.'); seen.add(key);
  }
  return rows;
}
export function getStudentRating(studentId:string|number, viewer:any=null){
  const ratings=readRatings().filter(row=>row.studentId===String(studentId));
  const sum=ratings.reduce((n,row)=>n+row.score,0);
  const mine=viewer && ['company','individual'].includes(viewer.role) && getCurrentLocalSession(viewer) ? ratings.find(row=>row.recruiterId===String(viewer.id))?.score || null : null;
  return {count:ratings.length,average:ratings.length ? sum/ratings.length : null,mine};
}
export function saveStudentRating(studentId:string|number, viewer:any, score:number|null):void {
  if(!recruiterCanRateStudent(viewer,studentId)) throw new Error('Impossible de noter ce profil : session, compte ou blocage indisponible.');
  if(score!==null && (!Number.isInteger(score) || score<1 || score>5)) throw new Error('Choisissez une note de 1 à 5 étoiles.');
  const rows=readRatings(), sid=String(studentId), rid=String(viewer.id);
  const index=rows.findIndex(r=>r.studentId===sid && r.recruiterId===rid);
  if(score===null){if(index>=0) rows.splice(index,1);} else {
    const rating={studentId:sid,recruiterId:rid,score,updatedAt:new Date().toISOString()};
    if(index>=0) rows[index]=rating; else rows.push(rating);
  }
  try {localStorage.setItem(KEY,JSON.stringify(rows));} catch {throw new Error('Impossible de sauvegarder la note dans ce navigateur.');}
  window.dispatchEvent(new window.Event(RATING_EVENT));
}
export const formatStudentAverage=(n:number)=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
