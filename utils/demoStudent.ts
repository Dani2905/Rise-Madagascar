/** Complète une seule fois le profil de démonstration, sans écraser les champs déjà renseignés. */
const DEMO_EMAIL = 'etudiant@rise.mg';
const defaults: Record<string, unknown> = {
  title: 'Étudiant en informatique',
  school: 'Établissement supérieur fictif d’Antananarivo',
  studyField: 'Informatique',
  studyLevel: 'L3',
  location: 'Antananarivo, Madagascar',
  bio: 'Profil de démonstration fictif. Étudiant en informatique, je m’intéresse à la création d’applications web utiles et accessibles. Je recherche des occasions d’apprendre, de collaborer et de développer des solutions adaptées aux besoins locaux.',
  skills: ['HTML et CSS', 'JavaScript', 'React', 'Git', 'Travail en équipe'],
  languages: ['Malagasy', 'Français', 'Anglais (intermédiaire)'],
  education: [{ id: 'demo-formation-rary', degree: 'Licence en informatique (exemple fictif)', school: 'Établissement supérieur fictif d’Antananarivo', date: 'En cours', mention: 'Développement web' }],
  experiences: [{ id: 'demo-experience-rary', role: 'Développeur web étudiant (exemple fictif)', company: 'Atelier pédagogique fictif', date: 'Projet académique', description: 'Conception en équipe d’une interface web responsive et présentation d’un prototype. Cette expérience est un exemple de démonstration.' }]
};
const empty = (value: unknown) => value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0);
const isDemoStudent = (user: any) => user?.role === 'student' && typeof user.email === 'string' && user.email.trim().toLowerCase() === DEMO_EMAIL && user.isDemo !== false;

/** Le compte enregistré est la référence ; les champs non vides de la session restent prioritaires. */
export function prepareDemoStudentSession(session: any): any {
  if (!isDemoStudent(session) || session.demoProfileCompleted === true) return session;
  try {
    const raw = localStorage.getItem('rise_db_users');
    const users = JSON.parse(raw || '[]');
    if (!Array.isArray(users)) return session;
    const matching = users.map((user: any, i: number) => ({ user, i })).filter(({ user }: any) => isDemoStudent(user) && user.id != null && String(user.id) === String(session.id));
    if (matching.length !== 1) return session;
    const { user: original, i } = matching[0];
    const dbUser = { ...original }, result = { ...session };
    for (const [key, fallback] of Object.entries(defaults)) {
      const value = !empty(session[key]) ? session[key] : !empty(original[key]) ? original[key] : original.demoProfileCompleted === true ? original[key] : fallback;
      if (empty(dbUser[key]) && !empty(value)) dbUser[key] = value;
      if (empty(result[key]) && !empty(value)) result[key] = value;
    }
    dbUser.demoProfileCompleted = true;
    result.demoProfileCompleted = true;
    if (JSON.stringify(dbUser) !== JSON.stringify(original)) {
      users[i] = dbUser;
      localStorage.setItem('rise_db_users', JSON.stringify(users));
    }
    return result;
  } catch {
    // Les données corrompues ou un stockage plein ne doivent jamais être écrasés.
    return session;
  }
}
