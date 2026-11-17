import { useEffect, useState } from 'react';

/** Rafraîchit l’affichage chaque minute et à l’instant de la prochaine échéance. */
export function useSubscriptionClock(nextBoundary?: string | number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const boundary = typeof nextBoundary === 'number' ? nextBoundary : typeof nextBoundary === 'string' ? Date.parse(nextBoundary) : NaN;
    const remaining = boundary - Date.now();
    const delay = Number.isFinite(remaining) && remaining > 0 ? Math.max(1, Math.min(60000, remaining)) : 60000;
    const timer = window.setTimeout(refresh, delay);
    return () => { window.clearTimeout(timer); window.removeEventListener('focus',refresh); document.removeEventListener('visibilitychange',refresh); };
  }, [nextBoundary,now]);
  return now;
}
