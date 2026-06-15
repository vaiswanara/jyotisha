import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";

// Explanation tooltips for students
const CONTACT_EXPLANATIONS = {
  solar: {
    C1: "Partial eclipse begins. The Moon's edge first touches the Sun's disk.",
    C2: "Totality/Annularity begins. For total/annular eclipses, the Sun is fully covered (total) or forms a ring of fire (annular).",
    C3: "Totality/Annularity ends. The Sun begins to emerge from behind the Moon.",
    C4: "Partial eclipse ends. The Moon's disk completely leaves the Sun's disk.",
    Maximum: "The instant when the Moon covers the maximum area of the Sun's disk.",
    Sunrise: "The time when the Sun rises above the horizon at this location.",
    Sunset: "The time when the Sun sets below the horizon at this location."
  },
  lunar: {
    P1: "Penumbral eclipse begins. The Moon enters Earth's outer shadow (penumbra) and starts to dim.",
    U1: "Partial eclipse begins. The Moon enters Earth's inner shadow (umbra); a dark bite appears.",
    U2: "Totality begins. The Moon is completely inside the Earth's umbral shadow, turning blood-red.",
    U3: "Totality ends. The Moon starts to exit the Earth's umbral shadow.",
    U4: "Partial eclipse ends. The Moon is fully out of the Earth's umbra.",
    P4: "Penumbral eclipse ends. The Moon exits the Earth's penumbra, returning to normal brightness.",
    Maximum: "The instant when the Moon is closest to the center of the Earth's shadow.",
    Moonrise: "The time when the Moon rises above the horizon at this location.",
    Moonset: "The time when the Moon sets below the horizon at this location."
  }
};

// Solar Eclipse SVG Visualizer — light-theme friendly
function SolarEclipseVisualizer({ type, magnitude }) {
  const isTotal = type.toLowerCase().includes("total");
  const isAnnular = type.toLowerCase().includes("annular");
  const offset = (1 - Math.min(1, magnitude)) * 80;

  return (
    <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto" }}>
      <svg width="120" height="120" viewBox="0 0 150 150">
        <defs>
          <radialGradient id="sunGlowL" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8e7" />
            <stop offset="60%" stopColor="#ffd35c" />
            <stop offset="90%" stopColor="#ff9a00" />
            <stop offset="100%" stopColor="#ff4500" />
          </radialGradient>
          <radialGradient id="coronaGlowL" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="rgba(255,255,255,1)" />
            <stop offset="70%" stopColor="rgba(255,220,150,0.8)" />
            <stop offset="85%" stopColor="rgba(255,140,0,0.4)" />
            <stop offset="100%" stopColor="rgba(255,69,0,0)" />
          </radialGradient>
        </defs>
        {isTotal && (
          <circle cx="75" cy="75" r="65" fill="url(#coronaGlowL)"
            style={{ animation: "eclipsePulse 3s infinite ease-in-out" }} />
        )}
        <circle cx="75" cy="75" r="45" fill="url(#sunGlowL)" />
        {isTotal ? (
          <circle cx="75" cy="75" r="45.5" fill="#3a3540" />
        ) : isAnnular ? (
          <circle cx="75" cy="75" r="40" fill="#3a3540" />
        ) : (
          <circle cx={75 + offset} cy="75" r="45" fill="#3a3540" />
        )}
      </svg>
      <style>{`
        @keyframes eclipsePulse {
          0% { transform: scale(0.97); opacity: 0.85; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(0.97); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

// Lunar Eclipse SVG Visualizer — light-theme friendly
function LunarEclipseVisualizer({ type, magnitude }) {
  const isTotal = type.toLowerCase().includes("total");
  const isPartial = type.toLowerCase().includes("partial");
  const isPenumbral = type.toLowerCase().includes("penumb");
  const offset = (1 - Math.min(1, magnitude)) * 80;

  return (
    <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto" }}>
      <svg width="120" height="120" viewBox="0 0 150 150">
        <defs>
          <radialGradient id="moonBrightL" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <radialGradient id="bloodMoonL" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7c5c" />
            <stop offset="70%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
          <radialGradient id="earthUmbraL" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(30,10,10,0.95)" />
            <stop offset="90%" stopColor="rgba(75,10,10,0.75)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <circle cx="75" cy="75" r="45" fill="url(#moonBrightL)" />
        {isTotal && <circle cx="75" cy="75" r="45" fill="url(#bloodMoonL)" opacity="0.9" />}
        {isTotal ? (
          <circle cx="75" cy="75" r="48" fill="url(#earthUmbraL)" opacity="0.85" />
        ) : isPartial ? (
          <>
            <circle cx="75" cy="75" r="45" fill="url(#bloodMoonL)" opacity={Math.min(1, magnitude) * 0.8} />
            <circle cx={75 - offset} cy="75" r="48" fill="url(#earthUmbraL)" opacity="0.9" />
          </>
        ) : isPenumbral ? (
          <circle cx="75" cy="75" r="45" fill="#000" opacity={Math.min(0.35, magnitude * 0.35)} />
        ) : null}
        <circle cx="50" cy="55" r="6" fill="#000" opacity="0.08" />
        <circle cx="95" cy="65" r="8" fill="#000" opacity="0.06" />
        <circle cx="65" cy="95" r="10" fill="#000" opacity="0.07" />
        <circle cx="80" cy="45" r="4" fill="#000" opacity="0.08" />
      </svg>
    </div>
  );
}

export function EclipsePage({ logoUrl, embedded = false }) {
  const { t } = useTranslation();

  const getLocalizedEclipseType = (type, eventType) => {
    const key = type.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (key === "partial" && eventType === "solar") return t("PartialSolarEclipse", "Partial Solar Eclipse");
    if (key === "total" && eventType === "solar") return t("TotalSolarEclipse", "Total Solar Eclipse");
    if (key === "annular" && eventType === "solar") return t("AnnularSolarEclipse", "Annular Solar Eclipse");
    
    const translations = {
      partiallunareclipse: t("PartialLunarEclipse", "Partial Lunar Eclipse"),
      penumblunareclipse: t("PenumbralLunarEclipse", "Penumbral Lunar Eclipse"),
      totallunareclipse: t("TotalLunarEclipse", "Total Lunar Eclipse"),
      totalannular: t("TotalAnnularSolarEclipse", "Total/Annular Solar Eclipse"),
      annulartotal: t("AnnularTotalSolarEclipse", "Annular/Total Solar Eclipse"),
      noncentral: t("NonCentralSolarEclipse", "Non-Central Solar Eclipse")
    };
    return translations[key] || type;
  };

  const getLocalizedContactLabel = (label) => {
    const cleanLabel = label.trim();
    if (cleanLabel.startsWith("P1")) return t("P1Label", "P1 (Penumbral Begins)");
    if (cleanLabel.startsWith("U1")) return t("U1Label", "U1 (Partial Begins)");
    if (cleanLabel.startsWith("U2")) return t("U2Label", "U2 (Totality Begins)");
    if (cleanLabel.startsWith("U3")) return t("U3Label", "U3 (Totality Ends)");
    if (cleanLabel.startsWith("U4")) return t("U4Label", "U4 (Partial Ends)");
    if (cleanLabel.startsWith("P4")) return t("P4Label", "P4 (Penumbral Ends)");
    if (cleanLabel.startsWith("C1")) return t("C1Label", "C1 (Partial Begins)");
    if (cleanLabel.startsWith("C2")) return t("C2Label", "C2 (Totality Begins)");
    if (cleanLabel.startsWith("C3")) return t("C3Label", "C3 (Totality Ends)");
    if (cleanLabel.startsWith("C4")) return t("C4Label", "C4 (Partial Ends)");
    if (cleanLabel === "Maximum") return t("MaximumLabel", "Maximum");
    if (cleanLabel === "Moonrise") return t("MoonriseLabel", "Moonrise");
    if (cleanLabel === "Moonset") return t("MoonsetLabel", "Moonset");
    if (cleanLabel === "Sunrise") return t("SunriseLabel", "Sunrise");
    if (cleanLabel === "Sunset") return t("SunsetLabel", "Sunset");
    return label;
  };

  const [formData, setFormData] = useState(() => {
    const defLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null"
    );
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return {
      date: todayStr,
      city: defLoc?.city || "Bengaluru, Karnataka",
      latitude: defLoc?.latitude || 12.9716,
      longitude: defLoc?.longitude || 77.5946,
      timezone: defLoc?.timezone || 5.5,
      count: 6
    };
  });

  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [eclipsesData, setEclipsesData] = useState(null);
  const [error, setError] = useState(null);

  const handleLocationSelect = (loc) => {
    setFormData((prev) => ({
      ...prev,
      city: loc.city,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone
    }));
  };

  const handleFetchEclipses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        endpoint: "eclipses",
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
        date: formData.date,
        count: formData.count,
        _t: Date.now()
      });
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          "x-api-token": API_TOKEN,
        },
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setEclipsesData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load eclipse calculations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchEclipses();
  }, [formData.latitude, formData.longitude, formData.date, formData.count]);

  const filteredEclipses = () => {
    if (!eclipsesData) return [];
    if (activeTab === "solar") return eclipsesData.solar || [];
    if (activeTab === "lunar") return eclipsesData.lunar || [];
    return eclipsesData.all || [];
  };

  // Determine if an eclipse is visible locally.
  // Only count actual eclipse phases (P1, U1, U2…, C1, C2…, Maximum).
  // Moonrise/Moonset/Sunrise/Sunset are auxiliary sky events — they don't
  // mean the eclipse itself is visible at this location.
  const RISE_SET_LABELS = ["Moonrise", "Moonset", "Sunrise", "Sunset"];
  const isVisibleLocally = (eclipse) =>
    eclipse.contactTimes.some(
      (c) =>
        c.localTime !== "-" &&
        !RISE_SET_LABELS.some((rs) => c.label.startsWith(rs))
    );

  const tabs = [
    { id: "all",    label: t("AllEclipses", "All Eclipses") },
    { id: "solar",  label: t("SolarEclipsesOnly", "Solar Eclipses") },
    { id: "lunar",  label: t("LunarEclipsesOnly", "Lunar Eclipses") }
  ];

  return (
    <main
      className="eclipse-page"
      style={{
        minHeight: "100vh",
        background: "transparent",
      }}
    >
      {/* Scoped styles — light theme matching the app */}
      <style>{`
        .eclipse-page {
          padding: 0;
          margin: 0;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Page Header ────────────────────────────── */
        .ecl-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(122, 83, 48, 0.14);
          background: rgba(255, 253, 248, 0.9);
        }
        .ecl-header-logo {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .ecl-header-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.1rem, 2.4vw, 1.6rem);
          font-weight: 700;
          color: #2d2419;
          margin: 0 0 0.2rem;
        }
        .ecl-header-sub {
          font-size: 0.82rem;
          color: #6b6255;
          margin: 0;
        }
        .ecl-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a3b24;
          margin: 0 0 0.3rem;
        }

        /* ── Workspace ──────────────────────────────── */
        .ecl-workspace {
          padding: 1.25rem 1.5rem;
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        /* When inside PanchangaPage tab — use full width, no outer limit */
        .ecl-workspace.ecl-embedded {
          max-width: 100%;
          padding: 0.85rem 0.5rem;
        }

        /* ── Controls panel ─────────────────────────── */
        .ecl-controls {
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(122, 83, 48, 0.16);
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(63, 43, 24, 0.07);
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .ecl-controls-row {
          display: grid;
          grid-template-columns: 1fr 180px 160px;
          gap: 1rem;
          align-items: end;
        }
        /* Place field: let LocationAutocomplete fill its column */
        .ecl-field-place {
          display: flex;
          flex-direction: column;
        }
        /* On tablet / mobile, stack into two columns then one */
        @media (max-width: 700px) {
          .ecl-controls-row {
            grid-template-columns: 1fr 1fr;
          }
          .ecl-field-place {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 440px) {
          .ecl-controls-row {
            grid-template-columns: 1fr;
          }
        }
        .ecl-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .ecl-field label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #51483d;
        }
        .ecl-meta-row {
          font-size: 0.78rem;
          color: #857869;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 0.25rem;
        }

        /* ── Tab bar ────────────────────────────────── */
        .ecl-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid rgba(138, 59, 36, 0.12);
          padding-bottom: 0;
        }
        .ecl-tab {
          padding: 0.5rem 1.1rem;
          border-radius: 8px 8px 0 0;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          background: transparent;
          color: #857869;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          min-height: auto;
          width: auto;
        }
        .ecl-tab.active {
          background: rgba(138, 59, 36, 0.08);
          color: #8a3b24;
          border-bottom: 2px solid #8a3b24;
        }
        .ecl-tab:hover:not(.active) {
          background: rgba(138, 59, 36, 0.05);
          color: #6b4030;
        }

        /* ── Cards grid ─────────────────────────────── */
        .ecl-grid {
          display: grid;
          /* 3 columns on desktop, shrinks on smaller screens */
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
        }
        @media (max-width: 1100px) {
          .ecl-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .ecl-grid { grid-template-columns: 1fr; }
        }

        /* ── Individual card ────────────────────────── */
        .ecl-card {
          background: rgba(255, 253, 248, 0.92);
          border: 1px solid rgba(122, 83, 48, 0.16);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(63, 43, 24, 0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ecl-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(63, 43, 24, 0.12);
        }
        .ecl-card-stripe {
          height: 4px;
          flex-shrink: 0;
        }
        .ecl-card-body {
          padding: 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1;
        }

        /* ── Card top row: info + badge ─────────────── */
        .ecl-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ecl-card-type-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 0.25rem;
        }
        .ecl-card-name {
          font-size: 1rem;
          font-weight: 700;
          color: #2d2419;
          margin: 0 0 0.2rem;
        }
        .ecl-card-saros {
          font-size: 0.75rem;
          color: #857869;
        }
        .ecl-card-date {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2d2419;
          text-align: right;
          white-space: nowrap;
        }

        /* ── Visibility badge ───────────────────────── */
        .ecl-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.28rem 0.65rem;
          border-radius: 20px;
          margin-top: 0.3rem;
          white-space: nowrap;
        }
        .ecl-badge.visible {
          background: rgba(47, 125, 66, 0.12);
          color: #2f7d42;
          border: 1px solid rgba(47, 125, 66, 0.28);
        }
        .ecl-badge.not-visible {
          background: rgba(122, 83, 48, 0.1);
          color: #857869;
          border: 1px solid rgba(122, 83, 48, 0.2);
        }

        /* ── SVG visualizer box ─────────────────────── */
        .ecl-visual-box {
          background: rgba(247, 242, 232, 0.7);
          border: 1px solid rgba(122, 83, 48, 0.12);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ecl-visual-type-text {
          font-size: 0.8rem;
          color: #6b6255;
          font-weight: 600;
          text-align: center;
        }

        /* ── Timeline section ───────────────────────── */
        .ecl-timeline-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #8a3b24;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.5rem;
        }
        .ecl-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .ecl-timeline-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          padding: 0.4rem 0.6rem;
          background: rgba(247, 242, 232, 0.5);
          border-radius: 6px;
          border: 1px solid rgba(122, 83, 48, 0.08);
          cursor: help;
          transition: background 0.12s ease;
        }
        .ecl-timeline-row:hover {
          background: rgba(138, 59, 36, 0.06);
        }
        .ecl-timeline-phase {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #51483d;
          font-weight: 600;
        }
        .ecl-phase-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ecl-timeline-time {
          font-weight: 700;
          color: #2d2419;
          white-space: nowrap;
        }
        .ecl-timeline-time.dim {
          color: #b0a090;
          font-weight: 600;
        }

        /* ── Notice boxes ───────────────────────────── */
        .ecl-notice {
          font-size: 0.76rem;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          line-height: 1.45;
        }
        .ecl-notice.warning {
          background: #fff7df;
          border: 1px solid #ead79e;
          color: #5f4a19;
        }
        .ecl-notice.success {
          background: rgba(47, 125, 66, 0.07);
          border: 1px solid rgba(47, 125, 66, 0.2);
          color: #2f5e38;
        }

        /* ── Loading ────────────────────────────────── */
        .ecl-loading {
          text-align: center;
          padding: 3rem 1rem;
          color: #8a3b24;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .ecl-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(138, 59, 36, 0.15);
          border-top-color: #8a3b24;
          border-radius: 50%;
          animation: eclSpin 0.9s infinite linear;
        }
        @keyframes eclSpin { to { transform: rotate(360deg); } }

        /* ── Error ──────────────────────────────────── */
        .ecl-error {
          background: #fff0ed;
          border: 1px solid #edb7ab;
          color: #8a2f21;
          border-radius: 10px;
          padding: 0.9rem 1.1rem;
          font-size: 0.88rem;
        }

        /* ── Empty state ────────────────────────────── */
        .ecl-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2.5rem;
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(122, 83, 48, 0.14);
          border-radius: 10px;
          color: #857869;
          font-size: 0.9rem;
        }

        /* ── Mobile ─────────────────────────────────── */
        @media (max-width: 860px) {
          .ecl-workspace {
            padding: 0.85rem;
            padding-bottom: calc(5.5rem + env(safe-area-inset-bottom));
          }
          .ecl-workspace.ecl-embedded {
            padding-bottom: 1rem;
          }
          .ecl-header {
            padding: 1rem 0.85rem;
          }
        }
        @media (max-width: 560px) {
          .ecl-controls-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* ── Page Header — hidden when embedded in another page ─── */}
      {!embedded && (
        <header className="ecl-header">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="ecl-header-logo" />
          )}
          <div>
            <p className="ecl-eyebrow">e-Jyotisha</p>
            <h1 className="ecl-header-title">
              {t("EclipseCentralTitle", "Eclipse Central")}
            </h1>
            <p className="ecl-header-sub">
              {t("EclipseCentralSubtitle", "Upcoming solar & lunar eclipses with precise local timings.")}
            </p>
          </div>
        </header>
      )}

      <div className={`ecl-workspace${embedded ? " ecl-embedded" : ""}`}>

        {/* ── Controls — all three fields in one row ──────── */}
        <div className="ecl-controls">
          <div className="ecl-controls-row">
            {/* Place — grows to fill available space */}
            <div className="ecl-field ecl-field-place">
              <LocationAutocomplete
                city={formData.city}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            {/* Search Date */}
            <div className="ecl-field">
              <label>{t("SearchStartDate", "Search From Date")}</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
              />
            </div>
            {/* Number of Eclipses */}
            <div className="ecl-field">
              <label>{t("EclipseCount", "Number of Eclipses")}</label>
              <select
                value={formData.count}
                onChange={(e) => setFormData(p => ({ ...p, count: parseInt(e.target.value) }))}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>
          </div>
          <div className="ecl-meta-row">
            <span>Lat: {formData.latitude}°</span>
            <span>•</span>
            <span>Lon: {formData.longitude}°</span>
            <span>•</span>
            <span>UTC +{formData.timezone}</span>
          </div>
        </div>

        {/* ── Tab Filters ───────────────────────────────── */}
        <div className="ecl-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`ecl-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Error ─────────────────────────────────────── */}
        {error && (
          <div className="ecl-error">❌ {error}</div>
        )}

        {/* ── Loading / Cards ───────────────────────────── */}
        {isLoading ? (
          <div className="ecl-loading">
            <div className="ecl-spinner" />
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
              {t("CalculatingEclipses", "Calculating upcoming eclipses…")}
            </p>
          </div>
        ) : (
          <div className="ecl-grid">
            {filteredEclipses().length === 0 ? (
              <div className="ecl-empty">
                {t("NoEclipsesFound", "No upcoming eclipses found for the selected options.")}
              </div>
            ) : (
              filteredEclipses().map((eclipse, idx) => {
                const isSolar = eclipse.eventType === "solar";
                const visibleLocally = isVisibleLocally(eclipse);
                const stripeColor = isSolar
                  ? "linear-gradient(90deg, #ffd35c, #ff9a00)"
                  : "linear-gradient(90deg, #c0392b, #8a3b24)";
                const typeColor = isSolar ? "#c07000" : "#8a3b24";

                return (
                  <div key={idx} className="ecl-card">
                    {/* Coloured stripe at top */}
                    <div
                      className="ecl-card-stripe"
                      style={{ background: stripeColor }}
                    />

                    <div className="ecl-card-body">
                      {/* ── Top info row ── */}
                      <div className="ecl-card-top">
                        <div style={{ flex: 1 }}>
                          <p className="ecl-card-type-label" style={{ color: typeColor }}>
                            {isSolar ? t("SolarEclipseLabel", "☀️ Solar Eclipse") : t("LunarEclipseLabel", "🌑 Lunar Eclipse")}
                          </p>
                          <p className="ecl-card-name">
                            {getLocalizedEclipseType(eclipse.type, eclipse.eventType)}
                          </p>
                          <p className="ecl-card-saros">
                            {t("SarosSeries", "Saros {{saros}}", { saros: eclipse.saros })}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div className="ecl-card-date">{eclipse.localDate}</div>
                          {/* Visible / Not Visible badge */}
                          <span className={`ecl-badge ${visibleLocally ? "visible" : "not-visible"}`}>
                            {visibleLocally ? t("VisibleLabel", "✓ Visible") : t("NotVisibleLabel", "✗ Not Visible")}
                          </span>
                        </div>
                      </div>

                      {/* ── Eclipse visualizer ── */}
                      <div className="ecl-visual-box">
                        {isSolar ? (
                          <SolarEclipseVisualizer type={eclipse.type} magnitude={eclipse.magnitude} />
                        ) : (
                          <LunarEclipseVisualizer type={eclipse.type} magnitude={eclipse.magnitude} />
                        )}
                        <div className="ecl-visual-type-text">
                          {getLocalizedEclipseType(eclipse.type, eclipse.eventType)}<br />
                          <span style={{ fontSize: "0.72rem", color: "#b0a090" }}>
                            {t("MagnitudePercent", "{{percent}}% magnitude", { percent: Math.round(eclipse.magnitude * 100) })}
                          </span>
                        </div>
                      </div>

                      {/* ── Contact times timeline ── */}
                      <div>
                        <p className="ecl-timeline-label">
                          ⏱ {t("EclipseTimeline", "Visibility Timeline")}
                        </p>
                        <div className="ecl-timeline-list">
                          {eclipse.contactTimes.map((c, cIdx) => {
                            const phaseKey = c.label.split(" ")[0];
                            const tooltipText =
                              CONTACT_EXPLANATIONS[eclipse.eventType]?.[phaseKey] || c.label;
                            const hasTime = c.localTime !== "-";
                            const localizedTooltip = t(`${eclipse.eventType}_${phaseKey}_explanation`, tooltipText);

                            return (
                              <div
                                key={cIdx}
                                className="ecl-timeline-row"
                                title={localizedTooltip}
                              >
                                <span className="ecl-timeline-phase">
                                  <span
                                    className="ecl-phase-dot"
                                    style={{
                                      background: hasTime ? "#2f7d42" : "#d6c4b0"
                                    }}
                                  />
                                  {getLocalizedContactLabel(c.label)}
                                </span>
                                <span className={`ecl-timeline-time${hasTime ? "" : " dim"}`}>
                                  {hasTime
                                    ? c.localTime.replace(/:\d{2}\s/, " ")
                                    : t("NotVisibleLabel", "✗ Not Visible")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── Almost eclipse notice ── */}
                      {eclipse.eventType === "lunar" &&
                        eclipse.type.toLowerCase().includes("penumb") &&
                        eclipse.magnitude < 0.01 && (
                        <div className="ecl-notice warning">
                          ⚠️ <strong>{t("AlmostLunarEclipseTitle", "Almost Lunar Eclipse:")}</strong> {t("AlmostLunarEclipseDesc", "The Moon barely grazes Earth's outer shadow. The effect is invisible to the naked eye — some sources list this as a near-miss.")}
                        </div>
                      )}

                      {/* ── Solar totality duration ── */}
                      {eclipse.eventType === "solar" &&
                        eclipse.duration &&
                        eclipse.duration !== "0 min 0.00 sec" && (
                        <div className="ecl-notice success">
                          ⏳ {t("TotalityDuration", "Totality Duration:")} <strong>{eclipse.duration}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
