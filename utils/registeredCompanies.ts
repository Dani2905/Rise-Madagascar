import { getAvailableJobs } from './jobSearch';
import { isDemoRecruiter } from './demoRecruiter';
import { industryLabel } from './industry';

export interface RegisteredRecruiter {
  id: string;
  role: 'company' | 'individual';
  name: string;
  logoUrl?: string;
  description: string;
  sector: string;
  location: string;
  website: string;
  jobs: number;
  needs: string[];
  offerTitles: string[];
}
export type RegisteredCompany = RegisteredRecruiter;

/** Les comptes et offres sont pour l'instant stockés localement dans le navigateur. */
export function getRegisteredRecruiters(): RegisteredRecruiter[] {
  try {
    const parsed = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    if (!Array.isArray(parsed)) return [];
    const recruiters: RegisteredRecruiter[] = [];
    const jobsByOwner = new Map<string, Map<string, string>>();
    for (const job of getAvailableJobs()) {
      if (job.ownerId == null || job.id == null || !String(job.id).trim()) continue;
      const ownerId = String(job.ownerId);
      if (!jobsByOwner.has(ownerId)) jobsByOwner.set(ownerId, new Map());
      jobsByOwner.get(ownerId)!.set(String(job.id), typeof job.title === 'string' ? job.title.trim() : '');
    }
    const ids = new Set<string>();
    for (const user of parsed) {
      if (!user || (user.role !== 'company' && user.role !== 'individual') || isDemoRecruiter(user)) continue;
      if ((typeof user.id !== 'string' && typeof user.id !== 'number') || !String(user.id).trim()) continue;
      const fullName = [user.firstName, user.lastName].filter(part => typeof part === 'string' && part.trim()).map(part => part.trim()).join(' ');
      const companyName = typeof user.companyName === 'string' ? user.companyName.trim() : '';
      const name = user.role === 'company' ? companyName : (fullName || companyName);
      if (!name) continue;
      const id = String(user.id);
      if (ids.has(id)) continue;
      ids.add(id);
      const activeJobs = jobsByOwner.get(id);
      const picture = user.role === 'company' ? user.logoUrl : user.avatarUrl;
      const description = user.role === 'company' ? user.description : (user.bio || user.description);
      recruiters.push({
        id, role: user.role, name,
        logoUrl: typeof picture === 'string' ? picture.trim() || undefined : undefined,
        description: typeof description === 'string' && description.trim() ? description : (user.role === 'company' ? 'Entreprise inscrite sur Rise.' : 'Particulier inscrit sur Rise.'),
        sector: user.role === 'individual' ? 'Particulier' : industryLabel(user.industry),
        location: (typeof user.location === 'string' && user.location.trim()) || (typeof user.city === 'string' && user.city.trim()) || 'Madagascar',
        website: typeof user.website === 'string' ? user.website : '',
        jobs: activeJobs?.size || 0,
        offerTitles: [...new Set([...(activeJobs?.values() || [])].filter(Boolean))],
        needs: user.role === 'individual' ? [...new Set([...(activeJobs?.values() || [])].filter(Boolean))].slice(0, 3) : []
      });
    }
    return recruiters;
  } catch (error) {
    console.error('Erreur lecture recruteurs inscrits', error);
    return [];
  }
}
export function getRegisteredCompanies(): RegisteredCompany[] {
  return getRegisteredRecruiters().filter(recruiter => recruiter.role === 'company');
}
