/**
 * This file contains the core constants and static data structures
 * for the Vedic Astrology Engine, migrated from astro_engine.php.
 */

// Using an enum for planets provides type safety and autocompletion.
export enum Planet {
  Sun = "Sun",
  Moon = "Moon",
  Mars = "Mars",
  Mercury = "Mercury",
  Jupiter = "Jupiter",
  Venus = "Venus",
  Saturn = "Saturn",
  Rahu = "Rahu",
  Ketu = "Ketu",
  Ascendant = "Ascendant",
}

// A mapping of planets to their Swiss Ephemeris codes.
// Using a Partial<Record> type since not all planets (e.g. Ketu) have a code.
export const SWE_CODE: Partial<Record<Planet, string>> = {
  [Planet.Sun]: "0",
  [Planet.Moon]: "1",
  [Planet.Mercury]: "2",
  [Planet.Venus]: "3",
  [Planet.Mars]: "4",
  [Planet.Jupiter]: "5",
  [Planet.Saturn]: "6",
  [Planet.Rahu]: "t",
};

// Interface for defining the structure of Rashi information.
export interface RashiInfo {
  en: string;
  sa: string;
  sym: string;
}

// An array of Rashi information. Array index = Rashi ID - 1.
// e.g., RASHI_NAMES[0] is for Aries (Rashi 1).
export const RASHI_NAMES: RashiInfo[] = [
  { en: "Aries", sa: "Mesha", sym: "Ar" },
  { en: "Taurus", sa: "Vrishabha", sym: "Ta" },
  { en: "Gemini", sa: "Mithuna", sym: "Ge" },
  { en: "Cancer", sa: "Karka", sym: "Cn" },
  { en: "Leo", sa: "Simha", sym: "Le" },
  { en: "Virgo", sa: "Kanya", sym: "Vi" },
  { en: "Libra", sa: "Tula", sym: "Li" },
  { en: "Scorpio", sa: "Vrischika", sym: "Sc" },
  { en: "Sagittarius", sa: "Dhanu", sym: "Sg" },
  { en: "Capricorn", sa: "Makara", sym: "Cp" },
  { en: "Aquarius", sa: "Kumbha", sym: "Aq" },
  { en: "Pisces", sa: "Meena", sym: "Pi" },
];

// Interface for Nakshatra information. The lord is typed to the Planet enum.
export interface NakshatraInfo {
  name: string;
  lord: Planet;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { name: "Ashwini", lord: Planet.Ketu },
  { name: "Bharani", lord: Planet.Venus },
  { name: "Krittika", lord: Planet.Sun },
  { name: "Rohini", lord: Planet.Moon },
  { name: "Mrigashira", lord: Planet.Mars },
  { name: "Ardra", lord: Planet.Rahu },
  { name: "Punarvasu", lord: Planet.Jupiter },
  { name: "Pushya", lord: Planet.Saturn },
  { name: "Ashlesha", lord: Planet.Mercury },
  { name: "Magha", lord: Planet.Ketu },
  { name: "Purva Phalguni", lord: Planet.Venus },
  { name: "Uttara Phalguni", lord: Planet.Sun },
  { name: "Hasta", lord: Planet.Moon },
  { name: "Chitra", lord: Planet.Mars },
  { name: "Swati", lord: Planet.Rahu },
  { name: "Vishakha", lord: Planet.Jupiter },
  { name: "Anuradha", lord: Planet.Saturn },
  { name: "Jyeshtha", lord: Planet.Mercury },
  { name: "Mula", lord: Planet.Ketu },
  { name: "Purva Ashadha", lord: Planet.Venus },
  { name: "Uttara Ashadha", lord: Planet.Sun },
  { name: "Shravana", lord: Planet.Moon },
  { name: "Dhanishtha", lord: Planet.Mars },
  { name: "Shatabhisha", lord: Planet.Rahu },
  { name: "Purva Bhadrapada", lord: Planet.Jupiter },
  { name: "Uttara Bhadrapada", lord: Planet.Saturn },
  { name: "Revati", lord: Planet.Mercury },
];

// Dasha years, with keys typed to the Planet enum for safety.
export const DASHA_YEARS: Record<Planet, number> = {
  [Planet.Ketu]: 7,
  [Planet.Venus]: 20,
  [Planet.Sun]: 6,
  [Planet.Moon]: 10,
  [Planet.Mars]: 7,
  [Planet.Rahu]: 18,
  [Planet.Jupiter]: 16,
  [Planet.Saturn]: 19,
  [Planet.Mercury]: 17,
  [Planet.Ascendant]: 0,
};

// The fixed order of Vimshottari Dasha lords.
export const DASHA_ORDER: Planet[] = [
  Planet.Ketu,
  Planet.Venus,
  Planet.Sun,
  Planet.Moon,
  Planet.Mars,
  Planet.Rahu,
  Planet.Jupiter,
  Planet.Saturn,
  Planet.Mercury,
];

// Interface for Ayanamsha information.
export interface AyanamshaInfo {
  code: string;
  label: string;
}

// A record of supported Ayanamshas and their swetest codes.
export const AYANAMSHA_LIST: Record<string, AyanamshaInfo> = {
  lahiri: { code: "1", label: "Lahiri (Chitrapaksha)" },
  raman: { code: "3", label: "B.V. Raman" },
  krishnamurti: { code: "5", label: "Krishnamurti (KP)" },
  fagan_bradley: { code: "0", label: "Fagan-Bradley" },
  yukteshwar: { code: "7", label: "Sri Yukteshwar" },
  jn_bhasin: { code: "9", label: "J.N. Bhasin" },
  sassanian: { code: "16", label: "Sassanian" },
  true_chitra: { code: "27", label: "True Chitra" },
};
