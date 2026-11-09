const labels: Record<string, string> = { Tech: 'Informatique / Tech', Finance: 'Banque / Finance', Telecom: 'Télécoms', Marketing: 'Marketing / Com', Industry: 'Industrie / BTP', Services: 'Services', Other: 'Autre' };
export function industryLabel(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return 'Autre';
  const clean = value.trim();
  return labels[clean] || clean;
}
