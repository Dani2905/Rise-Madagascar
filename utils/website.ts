/** Ne rend cliquables que les adresses web HTTP(S) valides. */
export function getWebsiteUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const input = value.trim();
  if (/^[a-z][a-z\d+.-]*:/i.test(input) && !/^https?:\/\//i.test(input)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.') && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
