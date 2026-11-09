/** Reconnaît les comptes démo actuels et ceux créés avant le marqueur isDemo. */
export function isDemoRecruiter(user: any): boolean {
  if (!user) return false;
  if (user.isDemo === true) return true;
  const email = typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';
  return (user.role === 'company' && email === 'pro@rise.mg') ||
    (user.role === 'individual' && email === 'perso@rise.mg') ||
    (!email && ((user.role === 'company' && String(user.id) === '1') || (user.role === 'individual' && String(user.id) === '102')));
}
