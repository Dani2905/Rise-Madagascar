/** Sélection explicite des données montrées dans l'aperçu, jamais des identifiants ou des coordonnées. */
export interface PublicStudent {
  id: string | number;
  firstName: string; lastName: string; title: string; school: string; studyLevel: string;
  studyField: string; location: string; bio: string; avatarUrl: string; coverUrl: string;
  skills: string[]; languages: string[];
  education: { degree: string; school: string; date: string; mention: string }[];
  experiences: { role: string; company: string; date: string; description: string }[];
  isDemo: boolean;
}
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const texts = (value: unknown) => Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && !!v.trim()) : [];
const image = (value: unknown) => {
  const url = text(value);
  return /^(data:image\/(png|jpeg|webp);base64,|https?:\/\/)/i.test(url) ? url : '';
};
export function getPublicStudent(id: string): PublicStudent | null {
  if (!id) return null;
  try {
    const users = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    if (!Array.isArray(users)) return null;
    const matches = users.filter(u => u?.id != null && String(u.id) === id && u.role === 'student');
    if (matches.length !== 1) return null;
    const u = matches[0];
    const education = Array.isArray(u.education) ? u.education.filter((item: any) => item && typeof item === 'object').map((e: any) => ({ degree: text(e.degree), school: text(e.school), date: text(e.date), mention: text(e.mention) })).filter((e: any) => e.degree || e.school) : [];
    const experiences = Array.isArray(u.experiences) ? u.experiences.filter((item: any) => item && typeof item === 'object').map((e: any) => ({ role: text(e.role), company: text(e.company), date: text(e.date), description: text(e.description) })).filter((e: any) => e.role || e.company) : [];
    return { id: u.id, firstName: text(u.firstName), lastName: text(u.lastName), title: text(u.title), school: text(u.school), studyLevel: text(u.studyLevel), studyField: text(u.studyField), location: text(u.location), bio: text(u.bio), avatarUrl: image(u.avatarUrl), coverUrl: image(u.coverUrl), skills: texts(u.skills), languages: texts(u.languages), education, experiences, isDemo: u.isDemo === true || text(u.email).toLowerCase() === 'etudiant@rise.mg' };
  } catch { return null; }
}
