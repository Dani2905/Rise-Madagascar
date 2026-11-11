/** Données fictives du compte entreprise de démonstration uniquement. */
const defaults: Record<string, unknown> = {
  companyName: 'TechMada Solutions', industry: 'Tech', companySize: '11-50', location: 'Antananarivo, Madagascar', city: 'Antananarivo, Madagascar', position: 'Responsable recrutement (exemple fictif)', founded: '2021',
  description: 'Entreprise technologique fictive dédiée aux projets numériques et à la découverte des talents étudiants.',
  bio: 'TechMada Solutions est une entreprise fictive créée pour illustrer le fonctionnement de Rise Madagascar. Son équipe imagine des applications web et accompagne des projets pédagogiques. Les informations de cette page sont des exemples et ne décrivent pas une entreprise réelle.',
  perks: ['Accompagnement pédagogique (exemple)', 'Travail en équipe (exemple)', 'Horaires flexibles (exemple)']
};
const empty = (value: unknown) => value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0);
const demo = (u: any) => u?.role === 'company' && typeof u.email === 'string' && u.email.trim().toLowerCase() === 'pro@rise.mg' && u.isDemo !== false;
export function prepareDemoCompanySession(session: any): any {
  if (!demo(session) || session.demoCompanyCompleted === true) return session;
  try {
    const users = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
    if (!Array.isArray(users)) return session;
    const matches = users.map((user: any, i: number) => ({ user, i })).filter(({ user }: any) => demo(user) && user.id != null && String(user.id) === String(session.id));
    if (matches.length !== 1) return session;
    const { user: original, i } = matches[0], dbUser = { ...original }, result = { ...session };
    for (const [key, fallback] of Object.entries(defaults)) {
      const blank = (value: unknown) => empty(value);
      const value = !blank(session[key]) ? session[key] : !blank(original[key]) ? original[key] : original.demoCompanyCompleted === true ? original[key] : fallback;
      if (blank(dbUser[key]) && !blank(value)) dbUser[key] = value;
      if (blank(result[key]) && !blank(value)) result[key] = value;
    }
    dbUser.demoCompanyCompleted = true; result.demoCompanyCompleted = true;
    if (JSON.stringify(dbUser) !== JSON.stringify(original)) { users[i] = dbUser; localStorage.setItem('rise_db_users', JSON.stringify(users)); }
    return result;
  } catch { return session; }
}
