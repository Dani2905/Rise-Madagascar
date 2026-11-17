import { useCallback, useEffect, useState } from 'react';
import { getStudentRating, RATING_EVENT } from '../utils/studentRatings';
export function useStudentRating(studentId:string|number|undefined, viewer:any=null) {
  const [state,setState]=useState<{count:number;average:number|null;mine:number|null;error:boolean}>({count:0,average:null,mine:null,error:false});
  const refresh=useCallback(()=>{try {if(studentId==null) throw new Error();setState({...getStudentRating(studentId,viewer),error:false});}catch{setState({count:0,average:null,mine:null,error:studentId!=null});}},[studentId,viewer?.id,viewer?.role]);
  useEffect(()=>{refresh();window.addEventListener(RATING_EVENT,refresh);window.addEventListener('storage',refresh);window.addEventListener('focus',refresh);return()=>{window.removeEventListener(RATING_EVENT,refresh);window.removeEventListener('storage',refresh);window.removeEventListener('focus',refresh);};},[refresh]);
  return state;
}
