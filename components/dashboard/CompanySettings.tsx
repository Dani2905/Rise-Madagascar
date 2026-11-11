import PrivacySettings from '../messaging/PrivacySettings';
import React, { useState } from 'react';
import { Bell, Building2, Gift, Globe, Plus, Save, User, X } from 'lucide-react';
import { FloatingInput, FloatingTextArea } from '../FloatingInput';
import SubscriptionCard from '../subscription/SubscriptionCard';
import PasswordCard from '../account/PasswordCard';
import { getWebsiteUrl } from '../../utils/website';

interface Props { data: any; onUpdate: (updates: any) => void; }
const CompanySettings: React.FC<Props> = ({ data, onUpdate }) => {
  const [form, setForm] = useState({
    companyName: data?.companyName || '', website: data?.website || '', location: data?.location || data?.city || '',
    industry: data?.industry || '', companySize: data?.companySize || '', founded: data?.founded != null ? String(data.founded) : '',
    description: data?.description || '', bio: data?.bio || '', activities: data?.activities || '', values: data?.values || '',
    linkedinUrl: (Array.isArray(data?.socials) ? data.socials.find((s: any) => s?.type === 'linkedin')?.url : '') || '',
    facebookUrl: (Array.isArray(data?.socials) ? data.socials.find((s: any) => s?.type === 'facebook')?.url : '') || '',
    perks: Array.isArray(data?.perks) ? [...data.perks] : [],
    firstName: data?.firstName || '', lastName: data?.lastName || '', position: data?.position || data?.contactRole || '', phone: data?.phone || ''
  });
  const [perk, setPerk] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setForm(prev => ({ ...prev, [e.target.id]: e.target.value })); setError(''); setMessage(''); };
  const addPerk = () => { const value = perk.trim(); if (value && !form.perks.includes(value)) setForm(prev => ({ ...prev, perks: [...prev.perks, value] })); setPerk(''); };
  const save = (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setMessage('');
    if (!form.companyName.trim() || !form.firstName.trim() || !form.lastName.trim()) { setError('Renseignez le nom de l’entreprise, le prénom et le nom du responsable.'); return; }
    if (form.website.trim() && !getWebsiteUrl(form.website)) { setError('Renseignez une adresse de site web valide ou laissez le champ vide.'); return; }
    if ([form.linkedinUrl, form.facebookUrl].some(link => link.trim() && !getWebsiteUrl(link))) { setError('Renseignez des liens de réseaux sociaux valides ou laissez-les vides.'); return; }
    if (form.founded.trim() && (!/^\d{4}$/.test(form.founded.trim()) || +form.founded > new Date().getFullYear() || +form.founded < 1800)) { setError('Renseignez une année de création valide ou laissez le champ vide.'); return; }
    try {
      const { linkedinUrl, facebookUrl, ...fields } = form;
      const otherSocials = Array.isArray(data?.socials) ? data.socials.filter((s: any) => s && s.type !== 'linkedin' && s.type !== 'facebook') : [];
      const socials = [...otherSocials, ...(linkedinUrl.trim() ? [{ type: 'linkedin', url: linkedinUrl.trim() }] : []), ...(facebookUrl.trim() ? [{ type: 'facebook', url: facebookUrl.trim() }] : [])];
      onUpdate({ ...fields, socials, companyName: form.companyName.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), location: form.location.trim(), city: form.location.trim(), website: form.website.trim(), position: form.position.trim(), phone: form.phone.trim(), founded: form.founded.trim(), description: form.description.trim(), bio: form.bio.trim(), activities: form.activities.trim(), values: form.values.trim() });
      setMessage('Informations enregistrées dans ce navigateur.');
    } catch { setError('Impossible d’enregistrer les informations dans ce navigateur.'); }
  };
  return <div className="space-y-6">
    <SubscriptionCard data={data} onUpdate={onUpdate} />
    <PrivacySettings />
    <form onSubmit={save} className="space-y-6 animate-fade-in">
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-black text-xl text-slate-900 mb-6 flex items-center gap-3"><Building2 className="text-blue-600" size={22} /> Profil de l’entreprise</h3>
        <p className="text-xs text-slate-500 mb-5">Les informations de l’entreprise sont visibles dans son aperçu local. Modifiez le logo et la couverture depuis l’en-tête.</p>
        <FloatingInput id="companyName" label="Nom de l'entreprise" value={form.companyName} onChange={change} required />
        <div className="grid md:grid-cols-2 gap-4"><FloatingInput id="website" label="Site Web (facultatif)" value={form.website} onChange={change} /><FloatingInput id="location" label="Siège social (ville)" value={form.location} onChange={change} /></div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div><label htmlFor="industry" className="text-xs font-bold text-slate-600">Secteur</label><select id="industry" value={form.industry} onChange={change} className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"><option value="">Non renseigné</option>{form.industry && !['Tech', 'Finance', 'Telecom', 'Marketing', 'Industry', 'Services', 'Other'].includes(form.industry) && <option value={form.industry}>{form.industry}</option>}<option value="Tech">Informatique / Tech</option><option value="Finance">Banque / Finance</option><option value="Telecom">Télécoms</option><option value="Marketing">Marketing / Com</option><option value="Industry">Industrie / BTP</option><option value="Services">Services</option><option value="Other">Autre</option></select></div>
          <div><label htmlFor="companySize" className="text-xs font-bold text-slate-600">Taille</label><select id="companySize" value={form.companySize} onChange={change} className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"><option value="">Non renseignée</option>{form.companySize && !['1-10', '11-50', '51-200', '200+', '1000+'].includes(form.companySize) && <option value={form.companySize}>{form.companySize}</option>}<option value="1-10">1 - 10 employés</option><option value="11-50">11 - 50 employés</option><option value="51-200">51 - 200 employés</option><option value="200+">200+ employés</option><option value="1000+">1000+ employés</option></select></div>
          <FloatingInput id="founded" label="Année de création" inputMode="numeric" maxLength={4} value={form.founded} onChange={change} />
        </div>
        <FloatingInput id="description" label="Description courte" value={form.description} onChange={change} />
        <FloatingTextArea id="bio" label="Histoire de l'entreprise et culture" value={form.bio} onChange={change} rows={5} />
        <FloatingTextArea id="activities" label="Nos activités (facultatif)" value={form.activities} onChange={change} rows={4} />
        <FloatingTextArea id="values" label="Nos valeurs (facultatif)" value={form.values} onChange={change} rows={4} />
      </section>
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"><h3 className="font-heading font-black text-xl text-slate-900 mb-5 flex items-center gap-3"><Gift className="text-green-600" size={22} /> Pourquoi nous rejoindre ?</h3>
        <div className="flex gap-2"><input aria-label="Ajouter un avantage" value={perk} onChange={e => setPerk(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPerk(); } }} placeholder="Ex. : télétravail, formation…" className="flex-1 min-w-0 border rounded-xl p-3 text-sm" /><button type="button" onClick={addPerk} aria-label="Ajouter cet avantage" className="bg-slate-900 text-white rounded-xl px-4"><Plus size={20} /></button></div>
        <div className="flex flex-wrap gap-2 mt-4">{form.perks.length ? form.perks.map((item: string, i: number) => <span key={i} className="inline-flex gap-2 items-center rounded-lg bg-green-50 border border-green-100 text-green-800 px-3 py-2 text-sm">{item}<button type="button" onClick={() => setForm(prev => ({ ...prev, perks: prev.perks.filter((p: string) => p !== item) }))} aria-label={`Retirer ${item}`}><X size={14} /></button></span>) : <p className="text-sm text-slate-500">Aucun avantage renseigné.</p>}</div>
      </section>
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"><h3 className="font-heading font-black text-xl text-slate-900 mb-3 flex items-center gap-3"><Globe className="text-blue-600" size={22} /> Présence en ligne</h3><p className="text-xs text-slate-500 mb-5">Liens facultatifs affichés sur la vitrine. Utilisez des adresses web valides.</p><div className="grid md:grid-cols-2 gap-4"><FloatingInput id="linkedinUrl" label="Page LinkedIn" value={form.linkedinUrl} onChange={change} /><FloatingInput id="facebookUrl" label="Page Facebook" value={form.facebookUrl} onChange={change} /></div></section>
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"><h3 className="font-heading font-black text-xl text-slate-900 mb-6 flex items-center gap-3"><User className="text-blue-600" size={22} /> Contact recruteur</h3>
        <p className="text-xs text-slate-500 mb-5">Ces données sont enregistrées localement ; cette démonstration ne fournit pas de confidentialité serveur.</p>
        <div className="grid md:grid-cols-2 gap-4"><FloatingInput id="firstName" label="Prénom du responsable" value={form.firstName} onChange={change} required /><FloatingInput id="lastName" label="Nom du responsable" value={form.lastName} onChange={change} required /><FloatingInput id="position" label="Intitulé du poste" value={form.position} onChange={change} /><FloatingInput id="phone" label="Téléphone" type="tel" value={form.phone} onChange={change} /><FloatingInput id="company-email" label="Email de connexion (lecture seule)" value={data?.email || ''} disabled /></div>
      </section>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-green-700">{message}</p>}
      <div className="flex justify-end"><button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Save size={18} /> Enregistrer les modifications</button></div>
    </form>
    <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"><h3 className="font-heading font-bold text-lg text-slate-900 mb-3 flex items-center gap-2"><Bell className="text-yellow-600" size={20} /> Notifications</h3><p className="text-sm text-slate-600">Les notifications par e-mail et leurs réglages ne sont pas disponibles dans cette démonstration.</p></section>
    <PasswordCard />
  </div>;
};
export default CompanySettings;
