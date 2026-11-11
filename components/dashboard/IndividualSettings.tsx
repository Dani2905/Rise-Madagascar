import PrivacySettings from '../messaging/PrivacySettings';
import React, { useRef, useState } from 'react';
import { Bell, Camera, Save, UserRound } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';
import SubscriptionCard from '../subscription/SubscriptionCard';
import PasswordCard from '../account/PasswordCard';

interface Props { data: any; onUpdate: (newData: any) => void; }
const IndividualSettings: React.FC<Props> = ({ data, onUpdate }) => {
  const [form, setForm] = useState({ firstName: data?.firstName || '', lastName: data?.lastName || '', location: data?.location || '', bio: data?.bio || '', phone: data?.phone || '' });
  const [error, setError] = useState(''), [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const busy = useRef(false), input = useRef<HTMLInputElement>(null);
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm(prev => ({ ...prev, [e.target.id]: e.target.value })); setError(''); setMessage(''); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setMessage('');
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('Renseignez votre prénom et votre nom.'); return; }
    try { onUpdate({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), location: form.location.trim(), bio: form.bio.trim(), phone: form.phone.trim() }); setMessage('Profil enregistré dans ce navigateur.'); }
    catch { setError('Impossible d’enregistrer le profil dans ce navigateur.'); }
  };
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file || busy.current) return;
    setError(''); setMessage('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError('Choisissez une image JPG, PNG ou WebP de 2 Mo maximum.'); return; }
    busy.current = true; setUploading(true);
    const reader = new FileReader();
    const end = () => { busy.current = false; setUploading(false); };
    reader.onerror = () => { setError('Impossible de lire cette image.'); end(); };
    reader.onload = () => { try { if (typeof reader.result !== 'string') throw new Error(); onUpdate({ avatarUrl: reader.result }); setMessage('Photo enregistrée dans ce navigateur.'); } catch { setError('Impossible d’enregistrer cette photo.'); } finally { end(); } };
    try { reader.readAsDataURL(file); } catch { setError('Impossible de lire cette image.'); end(); }
  };
  const remove = () => { try { onUpdate({ avatarUrl: '' }); setMessage('Photo retirée.'); setError(''); } catch { setError('Impossible de retirer cette photo.'); } };
  return <div className="space-y-6">
    <SubscriptionCard data={data} onUpdate={onUpdate} />
    <PrivacySettings />
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm"><h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900"><UserRound size={21} className="text-green-600" /> Profil particulier</h3>
        <p className="mb-5 text-xs text-slate-500">Vos informations sont enregistrées dans ce navigateur ; cette démonstration ne fournit pas de confidentialité serveur.</p>
        <div className="mb-6 flex flex-wrap items-center gap-4"><input ref={input} type="file" className="hidden" aria-label="Choisir une photo" accept="image/jpeg,image/png,image/webp" onChange={upload} /><div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">{data?.avatarUrl ? <img src={data.avatarUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-600">{(data?.firstName || '?').slice(0, 2).toUpperCase()}</span>}</div><div className="flex flex-wrap gap-3"><button type="button" disabled={uploading} onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"><Camera size={16} /> Modifier la photo</button>{data?.avatarUrl && <button type="button" disabled={uploading} onClick={remove} className="text-sm font-bold text-slate-500 underline">Retirer</button>}</div><p className="w-full text-xs text-slate-500">JPG, PNG ou WebP, 2 Mo maximum.</p></div>
        <div className="grid md:grid-cols-2 gap-4"><FloatingInput id="firstName" label="Prénom" required value={form.firstName} onChange={change} /><FloatingInput id="lastName" label="Nom" required value={form.lastName} onChange={change} /><FloatingInput id="location" label="Adresse / quartier" value={form.location} onChange={change} /><FloatingInput id="phone" label="Téléphone" type="tel" value={form.phone} onChange={change} /><FloatingInput id="individual-email" label="Email de connexion (lecture seule)" value={data?.email || ''} disabled /></div>
        <FloatingTextArea id="bio" label="À propos de vos besoins" value={form.bio} onChange={change} />
      </section>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-green-700">{message}</p>}
      <div className="flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"><Save size={18} /> Enregistrer</button></div>
    </form>
    <section className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm"><h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900"><Bell size={20} className="text-yellow-600" /> Notifications</h3><p className="text-sm text-slate-600">Les notifications par e-mail et leurs réglages ne sont pas disponibles dans cette démonstration.</p></section>
    <PasswordCard />
  </div>;
};
export default IndividualSettings;
