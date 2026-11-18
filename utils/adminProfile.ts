import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from './supabase';

const AVATAR_PREFIX = 'data:image/jpeg;base64,/9j/';
export const ADMIN_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

/** Redimensionne et réencode localement : ne transmet ni métadonnées EXIF ni original. */
export async function prepareAdminPhoto(file: File): Promise<string> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choisissez une image JPEG, PNG ou WebP.');
  if (!file.size || file.size > ADMIN_PHOTO_MAX_BYTES) throw new Error('La photo doit faire 5 Mo maximum.');
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve,reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Impossible de lire cette image.'));
      img.src = url;
    });
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40000000) throw new Error('Les dimensions de cette image ne sont pas prises en charge.');
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('La préparation de l’image est indisponible sur ce navigateur.');
    const side = Math.min(image.naturalWidth,image.naturalHeight);
    ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,256,256);
    let result = canvas.toDataURL('image/jpeg',0.82);
    if (result.length > 180000) result = canvas.toDataURL('image/jpeg',0.55);
    if (!result.startsWith(AVATAR_PREFIX) || result.length > 180000) throw new Error('Impossible de préparer une photo compatible.');
    return result;
  } finally { URL.revokeObjectURL(url); }
}
export async function getAdminAvatar(userId:string):Promise<string|null> {
  const {data,error} = await getSupabase().rpc('crm_get_own_avatar',{p_expected_uid:userId});
  if (error) throw error;
  if (data !== null && (typeof data !== 'string' || !data.startsWith(AVATAR_PREFIX) || data.length > 180000)) throw new Error('Photo de profil invalide.');
  return data;
}
export async function setAdminAvatar(userId:string,value:string|null):Promise<void> {
  const {error} = await getSupabase().rpc('crm_set_own_avatar',{p_data_url:value,p_expected_uid:userId});
  if (error) throw error;
}

/** Un client isolé et non persistant ne remplace jamais la session de l'application. */
let verifierClient:SupabaseClient|null=null;
let passwordRequestActive=false;
export async function changeAdminPassword(userId:string,email:string,current:string,next:string):Promise<void> {
  if (!userId || !email || !current) throw new Error('Saisissez votre mot de passe actuel.');
  if (passwordRequestActive) throw new Error('Une modification est déjà en cours.');
  passwordRequestActive=true;
  try {
    const sb = getSupabase();
    const before = await sb.auth.getUser();
    if (before.error || before.data.user?.id !== userId) throw new Error('Votre session a changé. Reconnectez-vous.');
    const url = import.meta.env?.VITE_SUPABASE_URL, key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error('La configuration Supabase est indisponible.');
    if (!verifierClient) verifierClient = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'rise-password-verification'}});
    const verifier=verifierClient;
    try {
      const result = await verifier.auth.signInWithPassword({email,password:current});
      if (result.error) {
        if (result.error.code === 'invalid_credentials') throw new Error('Le mot de passe actuel est incorrect.');
        if (result.error.status === 429) throw new Error('Trop de tentatives. Réessayez plus tard.');
        throw new Error('Impossible de vérifier le mot de passe actuel. Réessayez.');
      }
      if (!result.data.user || result.data.user.id !== userId) throw new Error('Le compte vérifié ne correspond pas à votre session.');
      const after = await sb.auth.getUser();
      if (after.error || after.data.user?.id !== userId) throw new Error('Votre session a changé. Reconnectez-vous.');
      const changed = await verifier.auth.updateUser({password:next});
      if (changed.error) {
        if (!changed.error.status || changed.error.status >= 500) throw new Error('Connexion interrompue : la modification a peut-être été enregistrée. Vérifiez votre connexion avant de réessayer.');
        throw new Error('Modification impossible. Vérifiez les règles de mot de passe et réessayez.');
      }
    } finally { await verifier.auth.signOut({scope:'local'}).catch(()=>{}); }
  } finally { passwordRequestActive=false; }
}
