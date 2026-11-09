import { MOCK_JOBS } from '../data/jobsData';
import { Job } from '../types';
import { inferProvince, matchesLocation } from './provinces';
import { isDemoRecruiter } from './demoRecruiter';

export const normalizeSearchText = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

// Source commune aux suggestions et aux résultats de recherche.
export function getAvailableJobs(): Job[] {
  let customJobs: Job[] = [];
  let demoOwnerIds = new Set<string>();
  try {
    const users = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    if (Array.isArray(users)) demoOwnerIds = new Set(users.filter(isDemoRecruiter).filter(u => u.id != null).map(u => String(u.id)));
  } catch { /* Les offres restent accessibles si les profils sont illisibles. */ }
  try {
    const parsed = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
    customJobs = Array.isArray(parsed) ? parsed.filter(j => j && typeof j === 'object').map(j => ({
      ...j, title: typeof j.title === 'string' ? j.title : 'Offre sans titre',
      company: typeof j.company === 'string' ? j.company : 'Recruteur',
      location: typeof j.location === 'string' ? j.location : '',
      province: typeof j.province === 'string' ? j.province : undefined,
      type: typeof j.type === 'string' ? j.type : '',
      description: typeof j.description === 'string' ? j.description : '',
      tags: Array.isArray(j.tags) ? j.tags.filter((tag: unknown) => typeof tag === 'string') : [],
      logoUrl: typeof j.logoUrl === 'string' ? j.logoUrl : '',
      salary: typeof j.salary === 'string' ? j.salary : '',
      postedAt: typeof j.postedAt === 'string' ? j.postedAt : '',
      duration: typeof j.duration === 'string' ? j.duration : undefined,
      remote: j.remote === true,
      isUrgent: j.isUrgent === true,
      isDemo: j.isDemo === true || (j.ownerId != null && demoOwnerIds.has(String(j.ownerId)))
    })) : [];
  } catch (error) {
    console.error('Erreur lecture offres', error);
  }
  // Une offre locale remplace la démo portant le même ID, même si elle est inactive.
  // En cas de doublon local, seule la première entrée est prise en compte.
  const customIds = new Set<string>();
  const activeJobs = customJobs.filter(job => {
    if (job.id == null || !String(job.id).trim()) return false;
    const id = String(job.id);
    if (customIds.has(id)) return false;
    customIds.add(id);
    return !job.status || job.status === 'Actif';
  });
  return [...activeJobs, ...MOCK_JOBS.filter(job => !customIds.has(String(job.id))).map(job => ({ ...job, isDemo: true }))];
}


// Les compteurs, la vitrine et les profils utilisent les mêmes offres actives.
export function getActiveJobsForOwner(ownerId: string | number): Job[] {
  const seen = new Set<string>();
  return getAvailableJobs().filter(job => {
    if (job.ownerId == null || String(job.ownerId) !== String(ownerId) || job.id == null || !String(job.id).trim()) return false;
    const id = String(job.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

const STOP_WORDS = new Set(['a', 'au', 'aux', 'de', 'des', 'du', 'en', 'et', 'la', 'le', 'les', 'un', 'une', 'pour', 'dans', 'sur', 'ou']);

function searchableText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return normalizeSearchText(value.replace(/<[^>]*>/g, ' '))
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function getSearchTokens(query: string): string[] {
  return searchableText(query).split(/\s+/).filter(word => word && !STOP_WORDS.has(word));
}

export function matchesJobQuery(job: Job, query: string): boolean {
  const tokens = getSearchTokens(query);
  if (!tokens.length) return true;
  const fields = [job.title, job.company, job.description, job.type, job.location, job.province || inferProvince(job.location || '')];
  if (Array.isArray(job.tags)) fields.push(...job.tags);
  const text = fields.map(searchableText).join(' ');
  return tokens.every(token => text.includes(token));
}

// Les correspondances dans le titre et les compétences sont plus pertinentes
// que celles présentes uniquement dans une description ou une adresse.
export function getJobRelevance(job: Job, query: string): number {
  const tokens = getSearchTokens(query);
  if (!tokens.length) return 0;
  const title = searchableText(job.title);
  const tags = Array.isArray(job.tags) ? job.tags.map(searchableText).join(' ') : '';
  const company = searchableText(job.company);
  const type = searchableText(job.type);
  const location = searchableText(`${job.location || ''} ${job.province || inferProvince(job.location || '') || ''}`);
  const description = searchableText(job.description);
  return tokens.reduce((score, token) => score +
    (title.includes(token) ? 8 : 0) + (tags.includes(token) ? 5 : 0) +
    (type.includes(token) ? 4 : 0) + (company.includes(token) ? 3 : 0) +
    (location.includes(token) ? 2 : 0) + (description.includes(token) ? 1 : 0), 0);
}

// Suggestions éditoriales classées par nombre d'offres correspondantes, pas par recherches utilisateurs.
const SUGGESTED_TERMS = ['Stage', 'Job étudiant', 'Mission', 'Freelance', 'Marketing', 'Développeur', 'Comptable', 'Design', 'Cours'];
export function getJobSuggestions(jobs: Job[], province?: string): { term: string; count: number }[] {
  const eligibleJobs = province
    ? jobs.filter(job => matchesLocation(job.location || '', job.province, province))
    : jobs;
  return SUGGESTED_TERMS.map(term => ({
    term,
    count: eligibleJobs.filter(job => matchesJobQuery(job, term)).length
  })).filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

// Les dates inconnues restent en fin de liste, sans inventer de chronologie.
export function getJobTimestamp(job: Job): number {
  const parsed = job.createdAt ? Date.parse(job.createdAt) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}
