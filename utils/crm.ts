import { adminPeriodBounds, AdminRange } from './adminOverview';
import { getSupabase } from './supabase';

export type CrmAccount = {id:string; role:'student'|'company'|'individual'; name:string; created_at:string; stage:string; note:string; follow_up_date:string|null; updated_at:string|null};
export type CrmItem = {id:string; title:string; type?:string; category?:string; province?:string; created_at:string};
export type CrmSnapshot = { counts:Record<string,number>; accounts:CrmAccount[]; jobs:CrmItem[]; projects:CrmItem[] };
export type CrmMember = {id:string; email:string; created_at:string};
export type CrmAuditEntry = {id:number; action:string; actor:string; created_at:string};
export const CRM_STAGES = [
  {value:'new',label:'À suivre'}, {value:'contacted',label:'Contacté'}, {value:'in_progress',label:'En cours'},
  {value:'follow_up',label:'À relancer'}, {value:'closed',label:'Clôturé'}
] as const;
export function crmRangeParameters(range: AdminRange, now=Date.now()) {
  const bounds=adminPeriodBounds(range,now);
  if (!bounds) return null;
  return {p_start:Number.isFinite(bounds.start)?new Date(bounds.start).toISOString():null,p_end:Number.isFinite(bounds.end)?new Date(bounds.end).toISOString():null};
}
export function crmMessage(error:any):string {
  if(error?.code==='40001') return 'Cette fiche a été modifiée ailleurs. Actualisez les données avant de réessayer.';
  if(error?.code==='42501' || error?.status===401 || error?.status===403) return 'Accès refusé ou session expirée. Reconnectez-vous ou contactez un administrateur.';
  if(error?.code==='22023') return 'Données invalides, compte introuvable ou action non autorisée. Vérifiez et réessayez.';
  return 'Connexion au CRM impossible. Vérifiez votre connexion puis réessayez.';
}
export async function crmHasAccess():Promise<boolean> {
  const {data,error}=await getSupabase().rpc('crm_has_access');
  if(error) throw error;
  if(typeof data !== 'boolean') throw new Error('Réponse CRM invalide.');
  return data;
}
export async function crmSnapshot(range:AdminRange, query:string, page:number):Promise<CrmSnapshot> {
  const params=crmRangeParameters(range); if(!params) throw new Error('Période invalide.');
  const {data,error}=await getSupabase().rpc('crm_snapshot',{...params,p_query:query.trim(),p_limit:50,p_offset:page*50});
  if(error) throw error;
  if(!data || typeof data!=='object' || !data.counts || typeof data.counts!=='object' || !Array.isArray(data.accounts) || !Array.isArray(data.jobs) || !Array.isArray(data.projects)) throw new Error('Réponse CRM invalide.');
  return data as CrmSnapshot;
}
export async function crmFollowups(range:AdminRange,page:number):Promise<CrmAccount[]> {
  const params=crmRangeParameters(range); if(!params) throw new Error('Période invalide.');
  const {data,error}=await getSupabase().rpc('crm_followup_queue',{...params,p_limit:50,p_offset:page*50});
  if(error)throw error; if(!Array.isArray(data))throw new Error('Réponse CRM invalide.'); return data as CrmAccount[];
}
export async function crmTeam():Promise<CrmMember[]> {
  const {data,error}=await getSupabase().rpc('crm_team_list'); if(error)throw error;
  if(!Array.isArray(data))throw new Error('Réponse CRM invalide.'); return data as CrmMember[];
}
export async function crmAudit():Promise<CrmAuditEntry[]> {
  const {data,error}=await getSupabase().rpc('crm_audit_list'); if(error)throw error;
  if(!Array.isArray(data))throw new Error('Réponse CRM invalide.'); return data as CrmAuditEntry[];
}
export async function crmTeamAdd(email:string):Promise<void> {
  const {error}=await getSupabase().rpc('crm_team_add',{p_email:email.trim()});if(error)throw error;
}
export async function crmTeamRemove(id:string):Promise<void> {
  const {error}=await getSupabase().rpc('crm_team_remove',{p_user:id});if(error)throw error;
}
export async function crmSaveFollowup(account:CrmAccount,stage:string,note:string,followUp:string):Promise<void> {
  const {error}=await getSupabase().rpc('crm_save_followup',{p_account:account.id,p_stage:stage,p_note:note,p_follow_up_date:followUp || null,p_expected:account.updated_at || null});
  if(error)throw error;
}
