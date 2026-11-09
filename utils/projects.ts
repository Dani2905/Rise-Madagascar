import { FEATURED_PROJECTS, Project } from '../data/resourcesData';
import { isDemoRecruiter } from './demoRecruiter';

/** Source commune du catalogue et des fiches. Les publications locales priment sur les exemples. */
export function getPublicProjects(): Project[] {
  let custom: any[] = [], users: any[] = [];
  try { const value = JSON.parse(localStorage.getItem('rise_custom_projects') || '[]'); if (Array.isArray(value)) custom = value; } catch { /* données illisibles */ }
  try { const value = JSON.parse(localStorage.getItem('rise_db_users') || '[]'); if (Array.isArray(value)) users = value; } catch { /* aucun profil */ }
  const demoIds = new Set(users.filter(u => isDemoRecruiter(u) || (u?.role === 'student' && typeof u.email === 'string' && u.email.trim().toLowerCase() === 'etudiant@rise.mg')).filter(u => u?.id != null).map(u => String(u.id)));
  const seen = new Set<string>();
  const projects: Project[] = [];
  for (const item of custom) {
    if (!item || (typeof item.id !== 'number' && typeof item.id !== 'string') || !String(item.id).trim() || seen.has(String(item.id))) continue;
    seen.add(String(item.id));
    const text = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value : fallback;
    const progress = Number(item.progress), likes = Number(item.likes);
    projects.push({
      ...item,
      title: text(item.title, 'Projet sans titre'), student: text(item.student, 'Étudiant'),
      category: text(item.category, 'Autre'), need: text(item.need, 'Non précisé'),
      description: text(item.description), problem: text(item.problem), solution: text(item.solution), school: text(item.school), stage: text(item.stage, 'Non précisé'),
      progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0,
      likes: Number.isFinite(likes) ? Math.max(0, likes) : 0,
      imageColor: text(item.imageColor, 'bg-blue-50 text-blue-600'),
      tags: Array.isArray(item.tags) ? item.tags.filter((v: unknown) => typeof v === 'string') : [],
      team: Array.isArray(item.team) ? item.team.filter((v: any) => v && typeof v.name === 'string' && typeof v.role === 'string') : [],
      roadmap: Array.isArray(item.roadmap) ? item.roadmap.filter((v: any) => v && typeof v.title === 'string' && typeof v.date === 'string') : [],
      isDemo: item.isDemo === true || (item.ownerId != null && demoIds.has(String(item.ownerId)))
    });
  }
  return [...projects, ...FEATURED_PROJECTS.filter(project => !seen.has(String(project.id))).map(project => ({ ...project, isDemo: true }))];
}
