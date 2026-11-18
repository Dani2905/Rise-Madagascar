/** Seuls ces champs de formulaire peuvent être synchronisés ; jamais l'identité,
 * le rôle, l'abonnement, les médias ou les données des autres modules. */
const common = ['firstName','lastName','location','phone','bio'];
const roleFields: Record<string,string[]> = {
  student: ['title','school','studyField','studyLevel','birthDate','skills','languages','education','experiences'],
  company: ['companyName','website','industry','companySize','founded','description','activities','values','position','city','perks','socials'],
  individual: []
};
export function cloudProfileFields(role: string, value: unknown): Record<string,unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !(role in roleFields)) return {};
  const source = value as Record<string,unknown>, allowed = [...common,...roleFields[role]];
  return Object.fromEntries(allowed.filter(key => Object.prototype.hasOwnProperty.call(source,key)).map(key => [key,source[key]]));
}
