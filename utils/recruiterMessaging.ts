import { Message } from '../types';
import { getOwnedCandidate, readLocalArray } from './recruiterDashboard';

/** Règle de démonstration locale, pas une autorisation de production. */
export function canStudentContactRecruiter(student: any, recruiter: any, users: any[], messages: Message[]): boolean {
  const studentId = String(student.id), recruiterId = String(recruiter.id);
  // Un message non refusé du recruteur autorise l'étudiant à lui répondre.
  if (messages.some(m => String(m.senderId) === recruiterId && String(m.receiverId) === studentId && m.requestStatus !== 'declined')) return true;

  // La décision doit provenir d'une candidature et d'une offre attribuées sans ambiguïté.
  const apps = readLocalArray('rise_applications'), jobs = readLocalArray('rise_jobs');
  const email = typeof student.email === 'string' ? student.email.trim().toLowerCase() : '';
  const uniqueEmail = !!email && users.filter(u => u?.role === 'student' && typeof u.email === 'string' && u.email.trim().toLowerCase() === email).length === 1;
  const accepted = apps.some(a => {
    if (!a || a.id == null || !['accepted','completed'].includes(a.status)) return false;
    const isStudent = a.applicantId != null ? String(a.applicantId) === studentId : uniqueEmail && typeof a.email === 'string' && a.email.trim().toLowerCase() === email;
    return isStudent && getOwnedCandidate(recruiter, a.id, apps, jobs, users) === a;
  });
  if (accepted) return true;

  // Une proposition de soutien enregistrée par ce recruteur est également une prise de contact préalable.
  const projects = readLocalArray('rise_custom_projects'), supports = readLocalArray('rise_project_supports');
  return supports.some(s => {
    if (!s || s.id == null || s.projectId == null || s.supporterId == null || String(s.supporterId) !== recruiterId || !['pending','accepted','rejected'].includes(s.status)) return false;
    if (supports.filter(other => other?.id != null && String(other.id) === String(s.id)).length !== 1) return false;
    const candidates = projects.filter(p => p?.id != null && String(p.id) === String(s.projectId));
    if (candidates.length !== 1) return false;
    const project = candidates[0];
    return project.ownerId != null ? String(project.ownerId) === studentId : uniqueEmail && typeof project.studentEmail === 'string' && project.studentEmail.trim().toLowerCase() === email;
  });
}
