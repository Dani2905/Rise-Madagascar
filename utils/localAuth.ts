/** Authentification de démonstration uniquement : tout est modifiable dans ce navigateur. */
export interface LocalPasswordCredential {
  algorithm: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  hash: string;
}
export const DEMO_PASSWORD = 'password123';
export const DEMO_EMAIL_ROLES: Record<string, 'student' | 'company' | 'individual'> = {
  'etudiant@rise.mg': 'student', 'pro@rise.mg': 'company', 'perso@rise.mg': 'individual'
};
export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export function readLocalUsers(): any[] {
  const raw = localStorage.getItem('rise_db_users');
  if (!raw) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error('Les données de comptes locaux sont illisibles. Elles n’ont pas été modifiées.'); }
  if (!Array.isArray(parsed)) throw new Error('Les données de comptes locaux sont illisibles. Elles n’ont pas été modifiées.');
  return parsed;
}
const toBase64 = (bytes: Uint8Array) => btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
const fromBase64 = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));
const derive = async (password: string, salt: Uint8Array, iterations: number) => {
  if (!globalThis.crypto?.subtle) throw new Error('La vérification locale nécessite un navigateur compatible et une connexion sécurisée (HTTPS).');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
  return new Uint8Array(bits);
};
export async function createPasswordCredential(password: string): Promise<LocalPasswordCredential> {
  if (!globalThis.crypto?.getRandomValues || !crypto.subtle) throw new Error('La création du compte nécessite un navigateur compatible et une connexion sécurisée (HTTPS).');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 210000;
  return { algorithm: 'PBKDF2-SHA256', iterations, salt: toBase64(salt), hash: toBase64(await derive(password, salt, iterations)) };
}
export async function verifyLocalPassword(user: any, password: string): Promise<boolean> {
  if (typeof password !== 'string' || !password || password.length > 1024) return false;
  if (user?.passwordCredential != null) {
    const c = user.passwordCredential;
    if (c.algorithm !== 'PBKDF2-SHA256' || !Number.isInteger(c.iterations) || c.iterations < 10000 || c.iterations > 1000000 || typeof c.salt !== 'string' || typeof c.hash !== 'string') return false;
    try {
      const salt = fromBase64(c.salt), expected = fromBase64(c.hash);
      if (salt.length !== 16 || expected.length !== 32) return false;
      const actual = await derive(password, salt, c.iterations);
      return actual.reduce((diff, byte, i) => diff | (byte ^ expected[i]), 0) === 0;
    } catch (error) {
      if (!globalThis.crypto?.subtle) throw error;
      return false;
    }
  }
  if (typeof user?.password === 'string' && user.password.length > 0) return user.password === password;
  const email = typeof user?.email === 'string' ? normalizeEmail(user.email) : '';
  return Boolean(DEMO_EMAIL_ROLES[email] && user?.role === DEMO_EMAIL_ROLES[email] && password === DEMO_PASSWORD);
}
export function publicSessionUser(user: any): any {
  const { password, confirmPassword, passwordCredential, ...profile } = user;
  return profile;
}
export function isValidSessionUser(user: any): boolean {
  return !!user && typeof user === 'object' && ['student', 'company', 'individual'].includes(user.role) && (typeof user.id === 'string' || typeof user.id === 'number') && String(user.id).trim().length > 0;
}
/** Retour interne seulement ; jamais de redirection vers un hôte externe. */
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\u0000-\u001f\\]/.test(value) || /^\/(?:login|register)(?:[/?#]|$)/i.test(value)) return '/profile';
  return value;
}
export function returnPathForRole(value: unknown, role: string): string {
  const path = safeReturnPath(value);
  if (path.startsWith('/profile?') && path.includes('tab=projects') && role !== 'student') return '/profile';
  if (path.startsWith('/dashboard?') && path.includes('tab=post-job') && role === 'student') return '/profile';
  return path;
}
