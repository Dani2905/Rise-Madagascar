import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useSubscriptionClock } from '../../hooks/useSubscriptionClock';
import { SUBSCRIPTION_PLANS, formatSubscriptionDate, formatSubscriptionRemaining, getSubscriptionStatus, SubscriptionRole } from '../../utils/subscription';

interface Props { data: any; onUpdate: (updates: any) => void }

const SubscriptionCard: React.FC<Props> = ({ data, onUpdate }) => {
  const { openSubscription } = useSubscription();
  const [error, setError] = useState('');
  const startsAt = Date.parse(data?.subscription?.startsAt || '');
  const nextBoundary = Number.isFinite(startsAt) && startsAt > Date.now() ? startsAt : data?.subscription?.expiresAt;
  const now = useSubscriptionClock(nextBoundary);
  const status = getSubscriptionStatus(data,now);
  const active = status === 'active';
  const role = data?.role as SubscriptionRole;
  const plan = SUBSCRIPTION_PLANS[role];
  if (!plan) return null;
  const cancel = () => {
    if (!window.confirm('Désactiver immédiatement cet abonnement de démonstration ?')) return;
    try { onUpdate({ hasSubscription: false, subscription: null }); setError(''); }
    catch { setError('Impossible de modifier l’abonnement dans ce navigateur.'); }
  };
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <h3 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2"><Star className={active ? 'text-green-600' : 'text-primary'} size={20} /> Abonnement {plan.label}</h3>
      {error && <p role="alert" className="text-sm text-red-700 mb-3">{error}</p>}
      <div className={`rounded-xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${active ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
        <div>
          <h4 className="font-bold text-slate-900 text-lg">{active ? 'Démonstration active' : status === 'expired' ? 'Démonstration expirée' : status === 'scheduled' ? 'Démonstration pas encore active' : status === 'invalid' ? 'Période non vérifiable' : 'Aucun abonnement actif'}</h4>
          <p className="text-slate-600 text-sm mt-1">Un abonnement {plan.label.toLowerCase()} actif est nécessaire pour {plan.action}.</p>
          {active ? <>
            <p className="mt-2 text-sm font-bold text-green-800">Temps restant : {formatSubscriptionRemaining(data.subscription.expiresAt,now)}</p>
            <p className="text-slate-600 text-sm mt-1">Actif jusqu’au {formatSubscriptionDate(data.subscription.expiresAt)} (heure de Madagascar). Aucun renouvellement automatique.</p>
            <button type="button" onClick={cancel} className="mt-3 text-red-700 font-bold text-sm hover:underline">Désactiver la démonstration</button>
          </> : <p className="text-slate-500 text-xs mt-2">{status === 'expired' ? `Expirée le ${formatSubscriptionDate(data.subscription.expiresAt)} (heure de Madagascar). ` : status === 'scheduled' ? `Début prévu le ${formatSubscriptionDate(data.subscription.startsAt)} (heure de Madagascar). ` : status === 'invalid' ? 'Dates ou activation invalides : réactivez la démonstration pour obtenir une période définie. ' : ''}Aucun paiement réel n’est effectué.</p>}
        </div>
        <button type="button" onClick={openSubscription} className="px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 shrink-0">{active ? 'Consulter mon abonnement' : 'Choisir mon abonnement'}</button>
      </div>
    </div>
  );
};
export default SubscriptionCard;
