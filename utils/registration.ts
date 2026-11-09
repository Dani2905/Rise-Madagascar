import { normalizeEmail } from './localAuth';

export type RegistrationRole = 'student' | 'company' | 'individual';
export interface RegistrationFormData {
  firstName: string; lastName: string; email: string; password: string; confirmPassword: string;
  school: string; studyField: string; studyLevel: string; birthDate: string;
  companyName: string; website: string; industry: string; companySize: string; position: string;
  phone: string; city: string; address: string;
}

/** Date locale malgache au format ISO, sans dépendre du fuseau du navigateur. */
export function madagascarToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Indian/Antananarivo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const read = (part: string) => parts.find(p => p.type === part)?.value || '';
  return `${read('year')}-${read('month')}-${read('day')}`;
}
export function validateRegistration(data: RegistrationFormData, role: RegistrationRole, now = new Date()): string | null {
  if (!data.firstName.trim() || !data.lastName.trim()) return 'Veuillez renseigner votre prénom et votre nom.';
  const email = normalizeEmail(data.email);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(email)) return 'Veuillez renseigner une adresse e-mail valide.';
  if (!data.phone.trim()) return 'Veuillez renseigner un numéro de téléphone.';
  if (role === 'student') {
    const day = data.birthDate;
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(day) ? new Date(`${day}T00:00:00Z`) : new Date(NaN);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day || day > madagascarToday(now)) return 'Veuillez renseigner une date de naissance valide, qui ne soit pas dans le futur.';
    if (!data.school.trim() || !data.studyField.trim() || !['L1', 'L2', 'L3', 'M1', 'M2', 'PhD', 'Bacc'].includes(data.studyLevel)) return 'Veuillez renseigner votre établissement, votre niveau et votre filière.';
  } else {
    if (!data.city.trim()) return 'Veuillez renseigner votre ville.';
    if (role === 'company' && (!data.companyName.trim() || !data.position.trim() || !['Tech','Finance','Telecom','Marketing','Industry','Services','Other'].includes(data.industry) || !['1-10','11-50','51-200','200+'].includes(data.companySize))) return 'Veuillez renseigner les informations de votre entreprise et votre poste.';
    if (role === 'individual' && !data.address.trim()) return 'Veuillez renseigner votre quartier ou adresse.';
  }
  if (data.password.length < 8 || data.password.length > 1024) return 'Le mot de passe doit contenir entre 8 et 1024 caractères.';
  if (data.password !== data.confirmPassword) return 'Les mots de passe ne correspondent pas.';
  return null;
}

/** Ne conserver que les informations du profil effectivement choisi. */
export function buildRegistrationProfile(data: RegistrationFormData, role: RegistrationRole, cvName?: string) {
  const common = { firstName: data.firstName.trim(), lastName: data.lastName.trim(), email: normalizeEmail(data.email), phone: data.phone.trim(), role, hasSubscription: false, subscription: null };
  if (role === 'student') return { ...common, birthDate: data.birthDate, school: data.school.trim(), studyField: data.studyField.trim(), studyLevel: data.studyLevel, ...(cvName ? { cvName } : {}) };
  if (role === 'company') return { ...common, companyName: data.companyName.trim(), website: data.website.trim(), industry: data.industry, companySize: data.companySize, position: data.position.trim(), city: data.city.trim(), location: data.city.trim() };
  const city = data.city.trim(), address = data.address.trim();
  return { ...common, city, address, location: [address, city].filter(Boolean).join(', ') };
}
