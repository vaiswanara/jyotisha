/**
 * Normalizes a Rishi name to enable robust, spelling-insensitive comparisons.
 * Trims whitespace, removes Unicode combining accents, collapses spaces, and lowercases.
 *
 * @param {string} name - The original Rishi name
 * @returns {string} The normalized canonical Rishi name
 */
export function normalizeRishi(name) {
  if (!name) return "";
  return name
    .toString()
    .normalize("NFD")                  // Decompose unicode characters to isolate combining marks
    .replace(/[\u0300-\u036f]/g, "")   // Remove diacritical marks (accents, macrons, etc.)
    .trim()                            // Trim leading/trailing whitespace
    .toLowerCase()                     // Convert to lowercase for case insensitivity
    .replace(/\s+/g, " ");             // Collapse multiple spaces into a single space
}

/**
 * Calculates gotra matching observations based on canonical IDs and gotra database lookup map.
 * This separate utility separates business rules from UI display logic.
 *
 * @param {Object} params
 * @param {string[]} params.groomGotraIds - Array of Groom's Gotra string IDs (primary, adopted, etc.)
 * @param {string[]} params.brideGotraIds - Array of Bride's Gotra string IDs (primary, adopted, etc.)
 * @param {string|null} params.brideMotherGotraId - Optional Bride's Mother's Birth Gotra string ID
 * @param {Object} params.gotraMap - Fast lookup map mapping Gotra ID string to full Gotra object
 * @returns {Object} Matching observations results
 */
export function calculateGotraMatch({
  groomGotraIds,
  brideGotraIds,
  brideMotherGotraId,
  gotraMap
}) {
  const groomGotrasList = groomGotraIds.map(id => gotraMap[id]).filter(Boolean);
  const brideGotrasList = brideGotraIds.map(id => gotraMap[id]).filter(Boolean);
  const brideMotherGotra = brideMotherGotraId ? gotraMap[brideMotherGotraId] : null;

  let isSagotra = false;
  let sagotraConflictingPair = null;

  let isSapravara = false;
  let sapravaraConflictingPair = null;
  let sharedRishis = [];

  let isMaternalGotraMatch = false;

  // 1. Check Sagotra by comparing canonical IDs
  for (const g of groomGotrasList) {
    for (const b of brideGotrasList) {
      if (g.id === b.id) {
        isSagotra = true;
        sagotraConflictingPair = { groom: g, bride: b };
      }
    }
  }

  // 2. Check Sapravara using Set-based comparison with normalized Rishi names
  if (!isSagotra) {
    for (const g of groomGotrasList) {
      for (const b of brideGotrasList) {
        const groomRishis = Array.isArray(g.rishis) ? g.rishis : [];
        const brideRishis = Array.isArray(b.rishis) ? b.rishis : [];

        const groomRishisSet = new Set(groomRishis.map(normalizeRishi));
        const common = brideRishis.filter(r => groomRishisSet.has(normalizeRishi(r)));

        if (common.length > 0) {
          isSapravara = true;
          sapravaraConflictingPair = { groom: g, bride: b };
          sharedRishis = [...new Set([...sharedRishis, ...common])];
        }
      }
    }
  }

  // 3. Check Maternal Gotra
  if (brideMotherGotra) {
    for (const g of groomGotrasList) {
      if (g.id === brideMotherGotra.id) {
        isMaternalGotraMatch = true;
      }
    }
  }

  // Determine Result Type: "different" | "same_gotra" | "same_pravara" | "maternal_reference"
  let resultType = "different";
  if (isSagotra) {
    resultType = "same_gotra";
  } else if (isSapravara) {
    resultType = "same_pravara";
  } else if (isMaternalGotraMatch) {
    resultType = "maternal_reference";
  }

  return {
    resultType,
    isSagotra,
    sagotraConflictingPair,
    isSapravara,
    sapravaraConflictingPair,
    sharedRishis,
    isMaternalGotraMatch,
    brideMotherGotra
  };
}
