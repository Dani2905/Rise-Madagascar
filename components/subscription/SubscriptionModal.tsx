import React, { useEffect, useRef, useState } from 'react';
import { X, GraduationCap, Building2, UserRound, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SUBSCRIPTION_PLANS, SubscriptionRole, createDemoSubscription, formatAriary, formatSubscriptionDate, isSubscriptionActive } from '../../utils/subscription';

const roles: SubscriptionRole[] = ['student', 'company', 'individual'];
const icons = { student: GraduationCap, company: Building2, individual: UserRound };

const SubscriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, isLoggedIn, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<SubscriptionRole | null>(user?.role || null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = isSubscriptionActive(user);
  // Si un compte est connecté, il ne peut pas activer le tarif d'un autre profil.
  const role = user?.role || selectedRole;
  const plan = role ? SUBSCRIPTION_PLANS[role] : null;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const activate = () => {
    if (!user || !isLoggedIn || !role || user.role !== role || isSubscriptionActive(user)) return;
    updateUser({ hasSubscription: true, subscription: createDemoSubscription(role) });
    onClose();
    if (window.Toastify) window.Toastify({ text: 'Abonnement de démonstration activé. Vous pouvez reprendre votre action.', style: { background: '#2563eb' } }).showToast();
  };

  const goToAccount = (path: string) => { onClose(); navigate(path, { state: { returnTo: `${location.pathname}${location.search}`, returnState: location.state } }); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="subscription-modal-title" aria-describedby="subscription-modal-description" className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
        <button ref={closeRef} type="button" aria-label="Fermer" onClick={onClose} className="absolute top-5 right-5 rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={22} /></button>
        <h2 id="subscription-modal-title" className="text-2xl font-heading font-black text-slate-900 pr-10">Votre abonnement Rise</h2>
        <p id="subscription-modal-description" className="text-sm text-slate-600 mt-3 leading-relaxed">La consultation reste accessible gratuitement. Un abonnement actif est nécessaire pour postuler ou publier.</p>
        {isLoading ? <p className="mt-6 text-sm text-slate-500">Chargement du compte…</p> : !role ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-bold text-slate-800">Choisissez votre profil pour découvrir son abonnement :</p>
            {roles.map(item => { const Icon = icons[item]; return <button key={item} type="button" onClick={() => setSelectedRole(item)} className="w-full flex items-center gap-3 text-left border border-slate-200 rounded-xl p-4 hover:border-yellow-400 hover:bg-yellow-50 font-bold text-slate-800"><Icon size={20} className="text-yellow-700" /> {SUBSCRIPTION_PLANS[item].label}</button>; })}
          </div>
        ) : plan && (
          <>
            {!isLoggedIn && <button type="button" onClick={() => setSelectedRole(null)} className="mt-5 text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"><ArrowLeft size={15} /> Changer de profil</button>}
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <p className="text-sm font-bold text-slate-600">Abonnement {plan.label.toLowerCase()}</p>
              <p className="mt-2"><span className="text-3xl font-black text-slate-900">{formatAriary(plan.amount)}</span><span className="text-slate-500"> / mois</span></p>
              <p className="text-sm text-slate-600 mt-3">Pour {plan.action}.</p>
              {active && user?.subscription && <p className="mt-3 text-sm text-green-700 font-bold">Démonstration active jusqu’au {formatSubscriptionDate(user.subscription.expiresAt)} (heure de Madagascar).</p>}
            </div>
            <p className="mt-4 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed"><strong>Démonstration :</strong> aucun paiement réel n’est encaissé. L’activation simule un mois d’accès dans ce navigateur, sans renouvellement automatique.</p>
            <div className="mt-5 space-y-3">
              {!isLoggedIn ? <>
                <button type="button" onClick={() => goToAccount(`/register?type=${role}`)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">Créer un compte {plan.label.toLowerCase()}</button>
                <button type="button" onClick={() => goToAccount('/login')} className="w-full py-3 rounded-xl border border-slate-200 text-slate-800 font-bold hover:bg-slate-50">Déjà inscrit ? Se connecter</button>
                <p className="text-xs text-slate-500 text-center">Connectez-vous pour activer votre abonnement de démonstration.</p>
              </> : active ? <button type="button" onClick={onClose} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">Continuer</button>
                : <button type="button" onClick={activate} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">Activer la démonstration</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SubscriptionModal;
