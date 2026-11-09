/** Les six anciennes provinces, utilisées comme regroupements géographiques. */
export const PROVINCES = [
  'Antananarivo', 'Antsiranana', 'Fianarantsoa', 'Mahajanga', 'Toamasina', 'Toliara'
] as const;

export type Province = typeof PROVINCES[number];

export const normalizeLocation = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// Correspondances indicatives pour les anciennes annonces sans province explicite.
// Une adresse libre ne permet pas d'identifier toutes les localités de Madagascar.
const aliases: Record<Province, string[]> = {
  Antananarivo: ['Antananarivo', 'Tana', 'Analamanga', 'Vakinankaratra', 'Itasy', 'Bongolava', 'Antsirabe', 'Tanjombato', 'Ivato', 'Itaosy', 'Ambatobe', 'Ankorondrano', 'Ivandry', 'Ambanidia', 'Isoraka', 'Antaninarenina'],
  Antsiranana: ['Antsiranana', 'Diego Suarez', 'Diana', 'Sava', 'Nosy Be', 'Ambanja', 'Ambilobe', 'Sambava', 'Antalaha', 'Andapa', 'Vohemar'],
  Fianarantsoa: ['Fianarantsoa', 'Haute Matsiatra', 'Amoron i Mania', 'Vatovavy', 'Fitovinany', 'Atsimo Atsinanana', 'Ihorombe', 'Ambositra', 'Mananjary', 'Manakara', 'Farafangana', 'Ihosy'],
  Mahajanga: ['Mahajanga', 'Majunga', 'Boeny', 'Betsiboka', 'Sofia', 'Melaky', 'Maevatanana', 'Antsohihy', 'Maintirano', 'Marovoay'],
  Toamasina: ['Toamasina', 'Tamatave', 'Atsinanana', 'Analanjirofo', 'Alaotra Mangoro', 'Moramanga', 'Ambatondrazaka', 'Fenerive Est', 'Sainte Marie'],
  Toliara: ['Toliara', 'Tulear', 'Atsimo Andrefana', 'Androy', 'Anosy', 'Menabe', 'Morondava', 'Fort Dauphin', 'Taolagnaro', 'Ambovombe', 'Beloha']
};

const containsPlace = (location: string, place: string) =>
  (` ${normalizeLocation(location)} `).includes(` ${normalizeLocation(place)} `);

export function inferProvince(location: string): Province | undefined {
  const matches = PROVINCES.filter(province => aliases[province].some(place => containsPlace(location, place)));
  return matches.length === 1 ? matches[0] : undefined;
}

export function matchesLocation(location: string, province: string | undefined, selected: string): boolean {
  const selectedProvince = PROVINCES.find(p => normalizeLocation(p) === normalizeLocation(selected));
  if (!selectedProvince) return containsPlace(location, selected); // anciens liens vers une ville
  // Une province explicitement renseignée prévaut sur l'adresse libre.
  if (province && PROVINCES.some(p => normalizeLocation(p) === normalizeLocation(province))) {
    return normalizeLocation(province) === normalizeLocation(selectedProvince);
  }
  return aliases[selectedProvince].some(place => containsPlace(location, place));
}
