export const INSTITUTION_TYPES = [
  "retail",
  "wholesale",
  "restaurant",
  "pharmacy",
  "school",
  "ngo",
  // "salon",  // temporarily removed — will be added back later
  "hotel",
  "professional_services",
  "manufacturer",
  "cooperative",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];

export function isValidInstitutionType(value: unknown): value is InstitutionType {
  return INSTITUTION_TYPES.includes(value as InstitutionType);
}
