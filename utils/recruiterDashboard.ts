/** Données locales uniquement : ces contrôles ne remplacent pas une autorisation serveur. */
export function readLocalArray(key: string): any[] {
  const value = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(value)) throw new Error('Données locales illisibles.');
  return value;
}
const norm = (v: unknown) => typeof v === 'string' ? v.trim().toLowerCase() : '';
/** Résout une offre uniquement si son propriétaire est identifiable sans ambiguïté. */
export function resolveRecruiterJobOwner(job: any, users: any[]): any | null {
  if (!job || !Array.isArray(users)) return null;
  const recruiters = users.filter(u => u && ['company', 'individual'].includes(u.role) && u.id != null && String(u.id).trim());
  let matches: any[];
  if (job.ownerId != null && String(job.ownerId).trim()) matches = recruiters.filter(u => String(u.id) === String(job.ownerId));
  else if (norm(job.ownerEmail)) matches = recruiters.filter(u => norm(u.email) === norm(job.ownerEmail));
  else {
    const name = norm(job.company);
    if (!name) return null;
    matches = recruiters.filter(u => u.role === 'company' ? norm(u.companyName) === name : norm(`${u.firstName || ''} ${u.lastName || ''}`) === name || norm(u.companyName) === name);
  }
  return matches.length === 1 ? matches[0] : null;
}
export function ownsRecruiterJob(user: any, job: any, users: any[]): boolean {
  if (!user || !['company', 'individual'].includes(user.role) || user.id == null) return false;
  const owner = resolveRecruiterJobOwner(job, users);
  return !!owner && String(owner.id) === String(user.id) && owner.role === user.role;
}
export function getOwnedCandidate(user: any, id: string | number, apps: any[], jobs: any[], users: any[]): any | null {
  const matching = apps.filter(app => app?.id != null && String(app.id) === String(id));
  if (matching.length !== 1 || matching[0].jobId == null) return null;
  const relevantJobs = jobs.filter(job => job?.id != null && String(job.id) === String(matching[0].jobId));
  return relevantJobs.length === 1 && ownsRecruiterJob(user, relevantJobs[0], users) ? matching[0] : null;
}
