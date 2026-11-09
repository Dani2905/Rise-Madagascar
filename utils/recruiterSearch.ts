import { RegisteredRecruiter } from './registeredCompanies';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** Tous les mots saisis doivent se retrouver dans les informations publiques du profil ou ses annonces actives. */
export function matchesRecruiterQuery(recruiter: RegisteredRecruiter, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  const text = normalize([recruiter.name, recruiter.description, recruiter.sector, recruiter.location, ...recruiter.offerTitles].join(' '));
  return tokens.every(token => text.includes(token));
}
