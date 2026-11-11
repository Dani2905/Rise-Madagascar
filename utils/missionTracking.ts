import { getCurrentLocalSession } from './subscription';
import { getOwnedCandidate, readLocalArray } from './recruiterDashboard';

export type MissionTrackingDraft = { startDate: string; endDate: string; evaluation: number; feedback: string };
export type TrackingUpdateResult = { ok: true } | { ok: false; error: string };

/** Les dates de mission sont des dates civiles, sans décalage de fuseau horaire. */
export const isValidCivilDate = (value: unknown): boolean => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 9999) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};
export const formatCivilDate = (value: unknown): string => {
  if (!isValidCivilDate(value)) return '';
  const [year, month, day] = (value as string).split('-');
  return `${day}/${month}/${year}`;
};
export const trackingDraft = (value: any): MissionTrackingDraft => ({
  startDate: isValidCivilDate(value?.startDate) ? value.startDate : '',
  endDate: isValidCivilDate(value?.endDate) ? value.endDate : '',
  evaluation: Number.isInteger(value?.evaluation) && value.evaluation >= 0 && value.evaluation <= 5 ? value.evaluation : 0,
  feedback: typeof value?.feedback === 'string' ? value.feedback : ''
});
export const hasTrackingData = (value: any): boolean => {
  const data = trackingDraft(value);
  return Boolean(data.startDate || data.endDate || data.evaluation || data.feedback.trim());
};
export function validateTrackingDraft(value: MissionTrackingDraft): string | null {
  if (!value || typeof value.startDate !== 'string' || typeof value.endDate !== 'string' || typeof value.feedback !== 'string') return 'Le suivi est invalide.';
  if ((value.startDate && !isValidCivilDate(value.startDate)) || (value.endDate && !isValidCivilDate(value.endDate))) return 'Renseignez des dates valides.';
  if (value.startDate && value.endDate && value.endDate < value.startDate) return 'La date de fin doit être postérieure ou égale à la date de début.';
  if (!Number.isInteger(value.evaluation) || value.evaluation < 0 || value.evaluation > 5) return 'Choisissez une note comprise entre 1 et 5, ou aucune note.';
  if (value.feedback.length > 2000) return 'Le commentaire ne doit pas dépasser 2 000 caractères.';
  return null;
}
export const trackingSnapshot = (value: unknown): string => JSON.stringify(value ?? null);

/** Vérification locale à chaque sauvegarde ; ne constitue pas une autorisation serveur. */
export function saveMissionTracking(user: any, candidateId: string | number, draft: MissionTrackingDraft, expected: string): TrackingUpdateResult {
  const validation = validateTrackingDraft(draft);
  if (validation) return { ok: false, error: validation };
  try {
    if (!getCurrentLocalSession(user)) return { ok: false, error: 'Votre session a changé. Reconnectez-vous avant d’enregistrer.' };
    const apps = readLocalArray('rise_applications'), jobs = readLocalArray('rise_jobs'), users = readLocalArray('rise_db_users');
    const app = getOwnedCandidate(user, candidateId, apps, jobs, users);
    if (!app || app.status !== 'accepted') return { ok: false, error: 'Cette mission n’est plus active ou ne correspond pas à votre compte.' };
    if (trackingSnapshot(app.tracking) !== expected) return { ok: false, error: 'Ce suivi a été modifié ailleurs. Annulez puis rouvrez-le pour voir la dernière version.' };
    const previous = app.tracking && typeof app.tracking === 'object' && !Array.isArray(app.tracking) ? app.tracking : {};
    const tracking = { ...previous, ...draft, feedback: draft.feedback.trim(), updatedAt: new Date().toISOString() };
    localStorage.setItem('rise_applications', JSON.stringify(apps.map(a => a === app ? { ...a, tracking } : a)));
    return { ok: true };
  } catch { return { ok: false, error: 'Impossible d’enregistrer le suivi : données illisibles ou stockage indisponible.' }; }
}
