import gotraMasterData from "./gotra_master_v1.1.0.json" with { type: "json" };

/**
 * Normalizes a Rishi name to a clean, lowercase form for basic comparison.
 * 
 * @param {string} name - Raw Rishi name
 * @returns {string} Normalized name
 */
export function getCanonicalRishiName(name) {
  if (!name) return "";
  return name.toString().trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Generates a unique key for a pravara variant to allow deduplication of equivalent pravaras.
 * 
 * @param {Object} pravara - Pravara object containing type and rishis
 * @param {string[]} types - Fallback types for the gotra
 * @returns {string} Unique pravara key
 */
export function getPravaraKey(pravara, types = []) {
  const type = (pravara.type || types[0] || "Trayarsheya").toLowerCase().trim();
  const rishis = (pravara.rishis || []).map(getCanonicalRishiName).sort().join("|");
  return `${type}:${rishis}`;
}

/**
 * Returns the full flat list of adapted gotra UI models, deduplicating equivalent pravaras.
 * 
 * @returns {Object[]} Flat array of transformed UI gotra objects
 */
export function getUIAdaptedGotras() {
  const result = [];
  
  gotraMasterData.forEach((entry) => {
    const { gotra, aliases = [], types = [], pravaras = [] } = entry;
    const baseSlug = gotra.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    
    const seenPravaraKeys = new Set();
    let variantCount = 0;

    pravaras.forEach((pravara) => {
      const pravaraKey = getPravaraKey(pravara, types);
      
      // If we've already seen this pravara key for this gotra, skip it to avoid duplication!
      if (seenPravaraKeys.has(pravaraKey)) {
        return;
      }
      seenPravaraKeys.add(pravaraKey);
      
      variantCount++;
      const id = `${baseSlug}_${variantCount}`;
      const lineage = (pravara.rishis && pravara.rishis[0]) || "Canonical";
      const pravaraType = pravara.type || (types[0] || "Trayarsheya");
      const rishis = pravara.rishis || [];
      const sources = pravara.sources || [];
      
      // Build the search index once: Gotra, Aliases, Lineage, Type, then every Rishi.
      // We join as a plain lowercase string. Because .includes() just needs the substring
      // to appear once, we do NOT deduplicate rishis against the gotra name — a rishi
      // named the same as the gotra (e.g. Kaundinya) must also appear via the rishis list.
      const baseTerms = [
        gotra,
        ...aliases,
        lineage,
        `${lineage} lineage`,
        pravaraType
      ];

      // Deduplicate base terms (gotra + aliases + lineage + type) among themselves
      const uniqueBaseTerms = Array.from(
        new Set(baseTerms.map(t => t ? t.trim().toLowerCase() : "").filter(Boolean))
      );

      // Always append every rishi name (do NOT filter against base terms)
      const rishiTerms = rishis.map(r => r ? r.trim().toLowerCase() : "").filter(Boolean);

      const searchText = [...uniqueBaseTerms, ...rishiTerms].join(" ");
      
      result.push({
        id,
        gotra,
        lineage,
        pravaraType,
        rishis,
        aliases,
        searchText,
        sources,
        
        // Compatibility fields
        name: gotra,
        type: pravaraType,
        name_en: gotra,
        name_te: gotra,
        name_kn: gotra,
        root_en: lineage,
        root_te: lineage,
        root_kn: lineage
      });
    });

    // If there were no pravaras, add a fallback
    if (variantCount === 0) {
      const baseTerms = [
        gotra,
        ...aliases,
        "Canonical",
        "Canonical lineage",
        types[0] || "Trayarsheya"
      ];
      const uniqueBaseTerms = Array.from(
        new Set(baseTerms.map(t => t ? t.trim().toLowerCase() : "").filter(Boolean))
      );
      const searchText = uniqueBaseTerms.join(" ");

      
      result.push({
        id: `${baseSlug}_1`,
        gotra,
        lineage: "Canonical",
        pravaraType: types[0] || "Trayarsheya",
        rishis: [],
        aliases,
        searchText,
        sources: [],
        
        // Compatibility fields
        name: gotra,
        type: types[0] || "Trayarsheya",
        name_en: gotra,
        name_te: gotra,
        name_kn: gotra,
        root_en: "Canonical",
        root_te: "Canonical",
        root_kn: "Canonical"
      });
    }
  });
  
  return result;
}

/**
 * Scores and ranks a list of gotra variants against a search query.
 *
 * Priority (lower = more relevant):
 *   1 — Exact Gotra name match
 *   2 — Alias match
 *   3 — Root Lineage match
 *   4 — Pravara Rishi match
 *   5 — Pravara Type match
 *
 * Returns items with an added `matchReason` string and `matchScore` number,
 * sorted by score ascending. When query is empty, returns all items unchanged
 * (no matchReason, no sorting) so the full unranked list is shown.
 *
 * @param {string} query - Raw user input
 * @param {Object[]} gotras - Flat list from getUIAdaptedGotras()
 * @returns {Object[]} Filtered and ranked results
 */
export function scoreAndRankGotras(query, gotras) {
  const cleanQuery = query.trim().toLowerCase();

  // Empty query → return full list without ranking
  if (!cleanQuery) return gotras;

  const results = [];

  for (const g of gotras) {
    const gotraLower    = g.gotra.toLowerCase();
    const lineageLower  = g.lineage.toLowerCase();
    const typeLower     = g.pravaraType.toLowerCase();
    const aliasesLower  = (g.aliases || []).map(a => a.toLowerCase());
    const rishisLower   = (g.rishis  || []).map(r => r.toLowerCase());

    let score  = Infinity;
    let reason = null;

    // Priority 1 — Exact Gotra name match
    if (gotraLower.includes(cleanQuery)) {
      score  = 1;
      reason = "Gotra";
    }

    // Priority 2 — Alias match (skip if already scored better)
    if (score > 2) {
      const matchedAlias = aliasesLower.find(
        a => a !== gotraLower && a.includes(cleanQuery)
      );
      if (matchedAlias) {
        score  = 2;
        reason = "Alias";
      }
    }

    // Priority 3 — Root Lineage match
    if (score > 3 && lineageLower.includes(cleanQuery)) {
      score  = 3;
      reason = "Root Lineage";
    }

    // Priority 4 — Pravara Rishi match (find first matching rishi)
    if (score > 4) {
      const matchedRishi = g.rishis.find(r => r.toLowerCase().includes(cleanQuery));
      if (matchedRishi) {
        score  = 4;
        reason = `Pravara Rishi (${matchedRishi})`;
      }
    }

    // Priority 5 — Pravara Type match
    if (score > 5 && typeLower.includes(cleanQuery)) {
      score  = 5;
      reason = "Pravara Type";
    }

    // Only include if we found a match
    if (reason !== null) {
      results.push({ ...g, matchScore: score, matchReason: reason });
    }
  }

  // Sort by score ascending (lower = more relevant), then alphabetically
  results.sort((a, b) => {
    if (a.matchScore !== b.matchScore) return a.matchScore - b.matchScore;
    return a.gotra.localeCompare(b.gotra);
  });

  return results;
}
