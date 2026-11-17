import { getAvailableJobs } from './jobSearch';
import { getPublicProjects } from './projects';
import { isDemoRecruiter } from './demoRecruiter';
import { resolveRecruiterJobOwner } from './recruiterDashboard';
import { getSubscriptionStatus, isSubscriptionActive } from './subscription';

export type AdminPeriod = 'all'|'today'|'7days'|'30days'|'month'|'year'|'custom';
export type AdminRange = { period: AdminPeriod; start?: string; end?: string };
const DAY = 86400000, OFFSET = 3 * 3600000;
/** Bornes calendaires Madagascar, début inclus et fin exclue. */
export function adminPeriodBounds(range: AdminRange, now = Date.now()): {start:number; end:number} | null {
  if (range.period === 'all') return {start:-Infinity,end:Infinity};
  const shifted = new Date(now + OFFSET);
  const today = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - OFFSET;
  const end = today + DAY;
  if (range.period === 'today') return {start:today,end};
  if (range.period === '7days') return {start:today-6*DAY,end};
  if (range.period === '30days') return {start:today-29*DAY,end};
  if (range.period === 'month') return {start:Date.UTC(shifted.getUTCFullYear(),shifted.getUTCMonth(),1)-OFFSET,end};
  if (range.period === 'year') return {start:Date.UTC(shifted.getUTCFullYear(),0,1)-OFFSET,end};
  const parseDay = (value: string | undefined) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const parsed = Date.parse(`${value}T00:00:00Z`);
    if (!Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0,10) !== value) return NaN;
    return parsed - OFFSET;
  };
  const start = parseDay(range.start), last = parseDay(range.end);
  return Number.isFinite(start) && Number.isFinite(last) && start <= last ? {start,end:last+DAY} : null;
}
function readArray(key: string): any[] | null { try { const parsed=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(parsed)?parsed:null; } catch {return null;} }
const isDemo = (u: any) => isDemoRecruiter(u) || u?.isDemo === true || (u?.role === 'student' && typeof u.email === 'string' && u.email.trim().toLowerCase() === 'etudiant@rise.mg');
/** Dates ISO horodatées uniquement. Les libellés comme « Récemment » ne sont pas des dates fiables. */
function timestamp(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const n=Date.parse(value); return Number.isFinite(n) ? n : null;
}
export function getAdminOverview(range: AdminRange = {period:'all'}, now = Date.now()) {
  const bounds=adminPeriodBounds(range,now), all=range.period==='all';
  const isInPeriod = (date: unknown) => { if (all) return true; const time=timestamp(date); return !!bounds && time !== null && time >= bounds.start && time < bounds.end; };
  const missing = (rows: any[], getDate: (row:any)=>unknown) => rows.filter(row=>timestamp(getDate(row))===null).length;
  const storedUsers=readArray('rise_db_users'), storedJobs=readArray('rise_jobs'), storedProjects=readArray('rise_custom_projects'), reports=readArray('rise_mail_reports');
  let accounts: {student:number;company:number;individual:number;active:number;activeByRole:Record<'student'|'company'|'individual',number>;expiringSoon:number;expired:number;nextBoundary:number|null;activations:number;activationsByRole:Record<'student'|'company'|'individual',number>}|null=null;
  let usersMissing: number|null=null, activationsMissing: number|null=null;
  let accountIds: string[] | null = null;
  if (storedUsers) {
    const counts=new Map<string,number>();
    for (const u of storedUsers) if (u?.id != null && String(u.id).trim()) counts.set(String(u.id),(counts.get(String(u.id))||0)+1);
    const users=storedUsers.filter(u=>u && ['student','company','individual'].includes(u.role) && u.id!=null && String(u.id).trim() && counts.get(String(u.id))===1 && !isDemo(u));
    const joined=users.filter(u=>isInPeriod(u.registeredAt));
    accountIds=joined.map(u=>String(u.id));
    const active=users.filter(u=>isSubscriptionActive(u,now));
    const withSubscription=users.filter(u=>u.subscription?.mode==='demo' && u.subscription?.role===u.role);
    const activations=withSubscription.filter(u=>isInPeriod(u.subscription.startsAt));
    const byRole=(list:any[])=>({student:list.filter(u=>u.role==='student').length,company:list.filter(u=>u.role==='company').length,individual:list.filter(u=>u.role==='individual').length});
    const expiringSoon=active.filter(u => Date.parse(u.subscription.expiresAt) - now <= 7 * DAY).length;
    const expired=users.filter(u => getSubscriptionStatus(u,now)==='expired').length;
    const boundaries=users.flatMap(u => { const status=getSubscriptionStatus(u,now); return status==='active' ? [Date.parse(u.subscription.expiresAt)] : status==='scheduled' ? [Date.parse(u.subscription.startsAt)] : []; }).filter(Number.isFinite);
    const nextBoundary=boundaries.length ? Math.min(...boundaries) : null;
    accounts={...byRole(joined),active:active.length,activeByRole:byRole(active),expiringSoon,expired,nextBoundary,activations:activations.length,activationsByRole:byRole(activations)};
    usersMissing=missing(users,u=>u.registeredAt); activationsMissing=missing(withSubscription,u=>u.subscription.startsAt);
  }
  let jobs: {id:string;title:string;company:string;type:string;active:boolean}[]|null=null, jobsMissing:number|null=null;
  if (storedJobs && storedUsers) {
    const seen=new Set<string>(); const activeIds=new Set(getAvailableJobs().filter(j=>!j.isDemo).map(j=>String(j.id)));
    const source=storedJobs.filter(j=>{
      if (!j || j.id==null || !String(j.id).trim() || seen.has(String(j.id))) return false;
      seen.add(String(j.id)); const owner=resolveRecruiterJobOwner(j,storedUsers);
      return j.isDemo!==true && !(owner && isDemoRecruiter(owner));
    });
    jobsMissing=missing(source,j=>j.createdAt);
    jobs=source.filter(j=>isInPeriod(j.createdAt)).map(j=>({id:String(j.id),title:typeof j.title==='string'?j.title:'Offre sans titre',company:typeof j.company==='string'?j.company:'Recruteur',type:typeof j.type==='string'?j.type:'',active:activeIds.has(String(j.id))}));
  }
  let projects: {id:string;title:string;student:string;need:string}[]|null=null, projectsMissing:number|null=null;
  if (storedProjects && storedUsers) {
    const source=getPublicProjects().filter(p=>!p.isDemo);
    projectsMissing=missing(source,p=>p.createdAt);
    projects=source.filter(p=>isInPeriod(p.createdAt)).map(p=>({id:String(p.id),title:p.title,student:p.student,need:p.need}));
  }
  const reportList=reports?.filter(r=>r && typeof r==='object');
  return {accounts,accountIds,jobs,projects,reports:reportList ? reportList.filter(r=>isInPeriod(r.timestamp)).length:null,rangeInvalid:!bounds,missing:{users:usersMissing,jobs:jobsMissing,projects:projectsMissing,reports:reportList?missing(reportList,r=>r.timestamp):null,activations:activationsMissing}};
}
