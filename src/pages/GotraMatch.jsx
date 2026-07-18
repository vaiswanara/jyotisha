import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getUIAdaptedGotras, scoreAndRankGotras } from "../data/gotraAdapter";
import rulesData from "../data/rules.json";
import { calculateGotraMatch } from "../utils/gotraMatcher";
import "./GotraMatch.css";

// Helper to filter and rank gotras by relevance using the adapter's scoring function
const filterGotras = (query, searchableList) => scoreAndRankGotras(query, searchableList);

// Generic localization helper to fetch field based on active language suffix
const getLocalizedField = (object, field, currentLang) => {
  if (!object) return "";
  const suffix = currentLang === "te" ? "te" : (currentLang === "kn" ? "kn" : "en");
  const key = `${field}_${suffix}`;
  if (object[key]) return object[key];
  return object[`${field}_en`] || "";
};

// Helper to dynamically replace placeholders in rule descriptions
const formatDescription = (desc, data = {}) => {
  if (!desc) return "";
  let result = desc;
  Object.entries(data).forEach(([key, val]) => {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), val || "");
  });
  return result;
};

// Reusable Autocomplete dropdown element with autonomous outside-click handling
function GotraAutocomplete({
  placeholder,
  searchValue,
  onSearchChange,
  dropdownOpen,
  setDropdownOpen,
  filteredGotras,
  onSelect,
  getField,
  currentLang,
  currentLangSuffix
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropdownOpen]);

  return (
    <div className="input-group" ref={containerRef}>
      <input 
        type="text" 
        className="text-input" 
        placeholder={placeholder} 
        value={searchValue}
        onChange={(e) => {
          onSearchChange(e.target.value);
          setDropdownOpen(true);
        }}
        onFocus={() => setDropdownOpen(true)}
      />
      {dropdownOpen && filteredGotras.length > 0 && (
        <div className="autocomplete-dropdown">
          {filteredGotras.map(g => (
            <div 
              key={g.id} 
              className="dropdown-item-variant"
              onClick={() => {
                onSelect(g);
                setDropdownOpen(false);
              }}
            >
              <div className="variant-gotra-name">{getField(g, "name")}</div>
              <div className="variant-lineage">{g.lineage} Lineage</div>
              <div className="variant-type">{g.pravaraType}</div>
              <div className="variant-rishis">
                {g.rishis && g.rishis.join(" • ")}
              </div>
              {g.matchReason && (
                <div className="variant-match-reason">Matched: {g.matchReason}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable details panel card component for selected gotra info
function GotraDetailsBox({ gotra, titleKey, defaultTitle, emoji, getField, t }) {
  if (!gotra) return null;
  return (
    <div className="gotra-info-box">
      <h4 className="gotra-info-box-title">{emoji} {t(titleKey, defaultTitle)}</h4>

      <div className="info-row">
        <span className="info-label">{t("detailsGotramLabel", "Gotram")}</span>
        <span className="info-value info-value-primary">{getField(gotra, "name")}</span>
      </div>

      <div className="info-row">
        <span className="info-label">{t("detailsRootLabel", "Root Lineage")}</span>
        <span className="info-value">{getField(gotra, "root")}</span>
      </div>

      <div className="info-row">
        <span className="info-label">{t("detailsPravaraTypeLabel", "Pravara Type")}</span>
        <span className="info-value">{gotra.type}</span>
      </div>

      <div className="gotra-info-pravara-wrapper">
        <span className="info-label">{t("detailsPravaraRishisLabel", "Pravara Rishis")}</span>
        <div className="badge-list">
          {gotra.rishis && gotra.rishis.map(r => (
            <span key={r} className="rishi-badge">🌸 {r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GotraMatch({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  // Force English-only for Version 1 gotra matching data & rules (Requirement 1)
  const currentLang = "en";

  const gotrasData = useMemo(() => getUIAdaptedGotras(), []);

  // Fast Lookup Maps mapped via useMemo
  const gotraMap = useMemo(() => Object.fromEntries(gotrasData.map(g => [g.id, g])), [gotrasData]);
  const rulesMap = useMemo(() => Object.fromEntries(rulesData.map(r => [r.id, r])), []);

  // Precompiled search index for fast multi-language autocomplete searching from the adapter
  const searchableGotras = gotrasData;

  // Wrap generic localization helper scoped to active language
  const getField = (obj, field) => getLocalizedField(obj, field, currentLang);

  // Form State: Storing string IDs only in React state
  const [groomGotraId, setGroomGotraId] = useState("");
  const [groomIsAdopted, setGroomIsAdopted] = useState(false);
  const [groomAdoptedGotraId, setGroomAdoptedGotraId] = useState("");

  const [brideGotraId, setBrideGotraId] = useState("");
  const [brideIsAdopted, setBrideIsAdopted] = useState(false);
  const [brideAdoptedGotraId, setBrideAdoptedGotraId] = useState("");
  const [brideMotherGotraId, setBrideMotherGotraId] = useState("");

  // Search/Autocomplete Dropdown filter queries
  const [groomSearch, setGroomSearch] = useState("");
  const [groomDropdownOpen, setGroomDropdownOpen] = useState(false);

  const [groomAdoptedSearch, setGroomAdoptedSearch] = useState("");
  const [groomAdoptedDropdownOpen, setGroomAdoptedDropdownOpen] = useState(false);

  const [brideSearch, setBrideSearch] = useState("");
  const [brideDropdownOpen, setBrideDropdownOpen] = useState(false);

  const [brideAdoptedSearch, setBrideAdoptedSearch] = useState("");
  const [brideAdoptedDropdownOpen, setBrideAdoptedDropdownOpen] = useState(false);

  const [brideMotherSearch, setBrideMotherSearch] = useState("");
  const [brideMotherDropdownOpen, setBrideMotherDropdownOpen] = useState(false);

  // Match Calculation Results State
  const [matchResult, setMatchResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const resultsRef = useRef(null);

  // Reusable filtering for autocomplete lists
  const filteredGroomGotras = useMemo(() => filterGotras(groomSearch, searchableGotras), [groomSearch, searchableGotras]);
  const filteredGroomAdoptedGotras = useMemo(() => filterGotras(groomAdoptedSearch, searchableGotras), [groomAdoptedSearch, searchableGotras]);
  const filteredBrideGotras = useMemo(() => filterGotras(brideSearch, searchableGotras), [brideSearch, searchableGotras]);
  const filteredBrideAdoptedGotras = useMemo(() => filterGotras(brideAdoptedSearch, searchableGotras), [brideAdoptedSearch, searchableGotras]);
  const filteredBrideMotherGotras = useMemo(() => filterGotras(brideMotherSearch, searchableGotras), [brideMotherSearch, searchableGotras]);

  // Compatibility Calculation
  const handleCheckCompatibility = () => {
    if (!groomGotraId || !brideGotraId) {
      alert(t("pleaseSelectGotram", "Please select Gotram for both Groom and Bride."));
      return;
    }

    setCalculating(true);
    setMatchResult(null);

    // Simulate short loader for premium experience
    setTimeout(() => {
      const groomGotraIds = [groomGotraId];
      if (groomIsAdopted && groomAdoptedGotraId) {
        groomGotraIds.push(groomAdoptedGotraId);
      }

      const brideGotraIds = [brideGotraId];
      if (brideIsAdopted && brideAdoptedGotraId) {
        brideGotraIds.push(brideAdoptedGotraId);
      }

      const result = calculateGotraMatch({
        groomGotraIds,
        brideGotraIds,
        brideMotherGotraId: brideMotherGotraId || null,
        gotraMap
      });

      setMatchResult({
        ...result,
        calculatedAt: new Date().toLocaleTimeString()
      });

      setCalculating(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  };

  const handleReset = () => {
    setGroomGotraId("");
    setGroomSearch("");
    setGroomIsAdopted(false);
    setGroomAdoptedGotraId("");
    setGroomAdoptedSearch("");
    setBrideGotraId("");
    setBrideSearch("");
    setBrideIsAdopted(false);
    setBrideAdoptedGotraId("");
    setBrideAdoptedSearch("");
    setBrideMotherGotraId("");
    setBrideMotherSearch("");
    setMatchResult(null);
  };

  // Full objects retrieved on demand via lookup map
  const groomGotra = gotraMap[groomGotraId];
  const brideGotra = gotraMap[brideGotraId];
  const brideMotherGotra = gotraMap[brideMotherGotraId];

  // Resolve dynamic rules from rules database based on result status
  const activeRule = matchResult ? rulesMap[matchResult.resultType] : null;
  const maternalRule = rulesMap["maternal_reference"];
  const isCompatible = matchResult ? (matchResult.resultType === "different" || matchResult.resultType === "maternal_reference") : false;

  // Resolve language suffix suffix label
  const currentLangSuffix = currentLang === "te" ? "వంశం" : (currentLang === "kn" ? "ವಂಶ" : "lineage");

  return (
    <div className="workspace gotra-workspace">
      {/* Header Banner - Small header layout */}
      <div className="gotra-card gotra-card-header">
        <h2 className="gotra-header-title">
          🧬 {t("gotraMatchTitle", "Gotra & Pravara Matching")}
        </h2>
        <p className="gotra-header-subtitle">
          {t("gotraMatchSubtitle", "Check Sagotra, Sapravara, and maternal gotra compatibility for marriage.")}
        </p>
      </div>

      {/* Entry Form - Next Row: Groom and Bride inputs grouped side-by-side on desktop */}
      <div className="gotra-card">
        <div className="gotra-grid">
          
          {/* Groom Section */}
          <div>
            <div className="gotra-section-title">
              <span>🤵</span> {t("groomDetailsTitle", "Groom's Details")}
            </div>

            <div className="input-group">
              <div className="input-group-header">
                <label className="input-label input-label-no-margin">{t("gotramLabel", "Gotram")}</label>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={groomIsAdopted}
                    onChange={(e) => {
                      setGroomIsAdopted(e.target.checked);
                      if (!e.target.checked) setGroomAdoptedGotraId("");
                    }}
                  />
                  <span>{t("adoptedLabel", "Adopted? (Dvigotra)")}</span>
                </label>
              </div>
              
              <GotraAutocomplete 
                placeholder={t("searchGotramPlaceholder", "Search Gotram...")}
                searchValue={groomSearch}
                onSearchChange={(val) => {
                  setGroomSearch(val);
                  if (!val) setGroomGotraId("");
                }}
                dropdownOpen={groomDropdownOpen}
                setDropdownOpen={setGroomDropdownOpen}
                filteredGotras={filteredGroomGotras}
                onSelect={(g) => {
                  setGroomGotraId(g.id);
                  setGroomSearch(getField(g, "name"));
                }}
                getField={getField}
                currentLang={currentLang}
                currentLangSuffix={currentLangSuffix}
              />
            </div>

            {groomIsAdopted && (
              <div className="input-group input-group-adopted">
                <label className="input-label">{t("adoptedGotramLabel", "Adopted Gotram")}</label>
                <GotraAutocomplete 
                  placeholder={t("searchAdoptedGotramPlaceholder", "Search Adopted Gotram...")}
                  searchValue={groomAdoptedSearch}
                  onSearchChange={(val) => {
                    setGroomAdoptedSearch(val);
                    if (!val) setGroomAdoptedGotraId("");
                  }}
                  dropdownOpen={groomAdoptedDropdownOpen}
                  setDropdownOpen={setGroomAdoptedDropdownOpen}
                  filteredGotras={filteredGroomAdoptedGotras}
                  onSelect={(g) => {
                    setGroomAdoptedGotraId(g.id);
                    setGroomAdoptedSearch(getField(g, "name"));
                  }}
                  getField={getField}
                  currentLang={currentLang}
                  currentLangSuffix={currentLangSuffix}
                />
              </div>
            )}
          </div>

          {/* Bride Section */}
          <div>
            <div className="gotra-section-title">
              <span>👰</span> {t("brideDetailsTitle", "Bride's Details")}
            </div>

            <div className="input-group">
              <div className="input-group-header">
                <label className="input-label input-label-no-margin">{t("gotramLabel", "Gotram")}</label>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={brideIsAdopted}
                    onChange={(e) => {
                      setBrideIsAdopted(e.target.checked);
                      if (!e.target.checked) setBrideAdoptedGotraId("");
                    }}
                  />
                  <span>{t("adoptedLabel", "Adopted? (Dvigotra)")}</span>
                </label>
              </div>

              <GotraAutocomplete 
                placeholder={t("searchGotramPlaceholder", "Search Gotram...")}
                searchValue={brideSearch}
                onSearchChange={(val) => {
                  setBrideSearch(val);
                  if (!val) setBrideGotraId("");
                }}
                dropdownOpen={brideDropdownOpen}
                setDropdownOpen={setBrideDropdownOpen}
                filteredGotras={filteredBrideGotras}
                onSelect={(g) => {
                  setBrideGotraId(g.id);
                  setBrideSearch(getField(g, "name"));
                }}
                getField={getField}
                currentLang={currentLang}
                currentLangSuffix={currentLangSuffix}
              />
            </div>

            {brideIsAdopted && (
              <div className="input-group input-group-adopted">
                <label className="input-label">{t("adoptedGotramLabel", "Adopted Gotram")}</label>
                <GotraAutocomplete 
                  placeholder={t("searchAdoptedGotramPlaceholder", "Search Adopted Gotram...")}
                  searchValue={brideAdoptedSearch}
                  onSearchChange={(val) => {
                    setBrideAdoptedSearch(val);
                    if (!val) setBrideAdoptedGotraId("");
                  }}
                  dropdownOpen={brideAdoptedDropdownOpen}
                  setDropdownOpen={setBrideAdoptedDropdownOpen}
                  filteredGotras={filteredBrideAdoptedGotras}
                  onSelect={(g) => {
                    setBrideAdoptedGotraId(g.id);
                    setBrideAdoptedSearch(getField(g, "name"));
                  }}
                  getField={getField}
                  currentLang={currentLang}
                  currentLangSuffix={currentLangSuffix}
                />
              </div>
            )}

            <div className="input-group input-group-margin-top">
              <label className="input-label">
                {t("brideMotherGotramLabel", "Bride's Mother's Birth Gotram (Optional)")}
              </label>
              <GotraAutocomplete 
                placeholder={t("searchMotherGotramPlaceholder", "Search Mother's Gotram...")}
                searchValue={brideMotherSearch}
                onSearchChange={(val) => {
                  setBrideMotherSearch(val);
                  if (!val) setBrideMotherGotraId("");
                }}
                dropdownOpen={brideMotherDropdownOpen}
                setDropdownOpen={setBrideMotherDropdownOpen}
                filteredGotras={filteredBrideMotherGotras}
                onSelect={(g) => {
                  setBrideMotherGotraId(g.id);
                  setBrideMotherSearch(getField(g, "name"));
                }}
                getField={getField}
                currentLang={currentLang}
                currentLangSuffix={currentLangSuffix}
              />
            </div>

          </div>
        </div>

        {/* Action Button Panel */}
        <div className="button-group">
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            disabled={calculating}
          >
            {t("resetButton", "Reset")}
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleCheckCompatibility}
            disabled={calculating}
          >
            {calculating ? (
              <>
                <div className="spinner"></div>
                <span>{t("calculatingText", "Calculating...")}</span>
              </>
            ) : (
              <span>{t("matchButton", "Match")}</span>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {matchResult && (
        <div ref={resultsRef}>
          {isCompatible ? (
            <div className="result-card result-card-compatible">
              <h2 className="result-title">
                <span>✅</span> {getField(activeRule, "title")}
              </h2>
              <p className="result-description">
                {formatDescription(getField(activeRule, "description"), {
                  groom: getField(groomGotra, "name"),
                  bride: getField(brideGotra, "name")
                })}
              </p>
              {activeRule && activeRule.references && activeRule.references.length > 0 && (
                <div className="result-references">
                  <span className="result-references-label">{t("traditionalReferencesLabel", "Traditional References")}</span>
                  <div className="reference-badge-list">
                    {activeRule.references.map(ref => (
                      <span key={ref} className="reference-badge">{ref}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="result-card result-card-incompatible">
              <h2 className="result-title">
                <span>❌</span> {getField(activeRule, "title")}
              </h2>
              <p className="result-description-margin-bottom">
                {formatDescription(getField(activeRule, "description"), {
                  gotra: matchResult.isSagotra ? getField(matchResult.sagotraConflictingPair.groom, "name") : ""
                })}
              </p>
              {matchResult.sharedRishis.length > 0 && (
                <div className="shared-rishis-block">
                  <span className="shared-rishis-label">{t("commonPravaraRishisLabel", "Common Pravara Rishis:")}</span>
                  <div className="badge-list">
                    {matchResult.sharedRishis.map(rishi => (
                      <span key={rishi} className="conflict-badge">🔹 {rishi}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeRule && activeRule.references && activeRule.references.length > 0 && (
                <div className="result-references">
                  <span className="result-references-label">{t("traditionalReferencesLabel", "Traditional References")}</span>
                  <div className="reference-badge-list">
                    {activeRule.references.map(ref => (
                      <span key={ref} className="reference-badge">{ref}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Maternal Gotra Match warning card */}
          {matchResult.isMaternalGotraMatch && (
            <div className="result-card result-card-maternal">
              <h2 className="maternal-title">
                <span>⚠️</span> {getField(maternalRule, "title")}
              </h2>
              <p className="maternal-description">
                {formatDescription(getField(maternalRule, "description"), {
                  gotra: getField(brideMotherGotra, "name")
                })}
              </p>
              {maternalRule && maternalRule.references && maternalRule.references.length > 0 && (
                <div className="result-references-maternal">
                  <span className="result-references-label">{t("traditionalReferencesLabel", "Traditional References")}</span>
                  <div className="reference-badge-list">
                    {maternalRule.references.map(ref => (
                      <span key={ref} className="reference-badge reference-badge-maternal">{ref}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detailed Informational Panels for Selected Gotras */}
          <div className="gotra-card detailed-info-card">
            <h3 className="detailed-info-title">
              📊 {t("detailedGotraInfoTitle", "Detailed Gotra & Pravara Info")}
            </h3>

            <div className="gotra-grid">
              <GotraDetailsBox 
                gotra={groomGotra}
                titleKey="groomDetailsTitle"
                defaultTitle="Groom's Details"
                emoji="🤵"
                getField={getField}
                t={t}
              />
              <GotraDetailsBox 
                gotra={brideGotra}
                titleKey="brideDetailsTitle"
                defaultTitle="Bride's Details"
                emoji="👰"
                getField={getField}
                t={t}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
