export type SubscriptionRole = 'student' | 'company' | 'individual';

export const SUBSCRIPTION_PLANS: Record<SubscriptionRole, { label: string; amount: number; action: string }> = {
  student: { label: 'Étudiant', amount: 1000, action: 'postuler aux offres et publier des projets' },
  company: { label: 'Entreprise', amount: 10000, action: 'publier des offres' },
  individual: { label: 'Particulier', amount: 5000, action: 'publier des annonces' }
};

export interface Subscription {
  role: SubscriptionRole;
  priceAr: number;
  startsAt: string;
  expiresAt: string;
  mode: 'demo';
}

export const formatAriary = (amount: number) => `${new Intl.NumberFormat('fr-FR').format(amount)} Ar`;

/** Un mois calendaire à l'heure de Madagascar (UTC+3), borné au dernier jour du mois. */
export function addCalendarMonth(date: Date): Date {
  const offset = 3 * 60 * 60 * 1000;
  const result = new Date(date.getTime() + offset);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return new Date(result.getTime() - offset);
}

export function createDemoSubscription(role: SubscriptionRole, now = new Date()): Subscription {
  return { role, priceAr: SUBSCRIPTION_PLANS[role].amount, startsAt: now.toISOString(), expiresAt: addCalendarMonth(now).toISOString(), mode: 'demo' };
}

export function isSubscriptionActive(user: { role?: string; hasSubscription?: boolean; subscription?: Subscription | null } | null | undefined, now = Date.now()): boolean {
  const sub = user?.subscription;
  if (!sub || !user?.hasSubscription || sub.mode !== 'demo' || sub.role !== user.role) return false;
  const start = Date.parse(sub.startsAt);
  const end = Date.parse(sub.expiresAt);
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end && end > start;
}

export type RestrictedAction = 'apply' | 'publishProject' | 'publishOffer';

/** La consultation est libre ; seules les actions de publication et candidature sont contrôlées. */
export function canPerformAction(user: { role?: string; hasSubscription?: boolean; subscription?: Subscription | null } | null | undefined, action: RestrictedAction, now = Date.now()): boolean {
  if (!user || !isSubscriptionActive(user, now)) return false;
  if (action === 'apply' || action === 'publishProject') return user.role === 'student';
  return user.role === 'company' || user.role === 'individual';
}

export function formatSubscriptionDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 'date inconnue' : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Indian/Antananarivo' }).format(date);
}
