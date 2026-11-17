import { createClient, SupabaseClient } from '@supabase/supabase-js';

// L'authentification locale reste disponible uniquement en mode démonstration explicite.
export const cloudAuthEnabled = import.meta.env?.VITE_AUTH_MODE === 'supabase';
let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!cloudAuthEnabled || !url || !key) throw new Error('La configuration Supabase est indisponible.');
  client = createClient(url, key, { auth: { flowType: 'pkce', storageKey: 'rise-supabase-auth', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}
export function authError(error: any): string {
  if (error?.code === 'email_not_confirmed') return 'Confirmez votre adresse e-mail avant de vous connecter.';
  if (error?.code === 'email_address_not_authorized') return 'En mode développement, seuls les membres de l’organisation Supabase peuvent recevoir les e-mails. Un serveur SMTP personnalisé est nécessaire pour les autres adresses.';
  if (error?.status === 429 || error?.code?.includes('rate_limit')) return 'Trop de tentatives ou d’e-mails. Veuillez patienter avant de réessayer.';
  if (error?.code === 'invalid_credentials') return 'Adresse e-mail ou mot de passe incorrect.';
  return 'Impossible de contacter ou d’utiliser le service de connexion. Réessayez dans quelques instants.';
}
