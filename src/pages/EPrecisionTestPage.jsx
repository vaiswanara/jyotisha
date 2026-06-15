import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";

// Helper to format timestamps to HH:MM:SS
function formatTimestamp(ts, timezoneOffset) {
  if (!ts) return "-";
  const date = new Date((ts + timezoneOffset * 3600) * 1000);
  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

// Helper to calculate difference between two timestamps in MMm SSs
function formatDifference(ts1, ts2) {
  if (!ts1 || !ts2) return null;
  const diffSecs = Math.abs(ts1 - ts2);
  const mins = Math.floor(diffSecs / 60);
  const secs = diffSecs % 60;
  if (mins === 0 && secs === 0) return "0s (Identical)";
  return `${mins > 0 ? `${mins}m ` : ""}${secs}s`;
}

// Explanation Tooltips content
const EXPLANATIONS = {
  ayanamsa: "Fallback Lahiri uses a simplified linear formula (22.46° + rate * T). Swiss Ephemeris calculates precise Chitrapaksha definitions using exact physical planetary perturbations.",
  riseset: "SunCalc uses a simplified 2-body geometry. Swiss Ephemeris calculates exact atmospheric refraction, pressure, temperature, and high-precision solar/lunar coordinates.",
  panchanga: "The Moon's orbit is highly complex and perturbed by the gravity of the Earth, Sun, and Jupiter. Fallback JS calculations use simplified orbits (up to 15-20 min error), while Swiss Ephemeris uses modern JPL DE431 ephemerides with seconds accuracy."
};

export function EPrecisionTestPage({ logoUrl }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(() => {
    const defLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null"
    );
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    return {
      date: todayStr,
      time: timeStr,
      city: defLoc?.city || "Bengaluru, Karnataka",
      latitude: defLoc?.latitude || 12.9716,
      longitude: defLoc?.longitude || 77.5946,
      timezone: defLoc?.timezone || 5.5,
      ayanamsha: "lahiri"
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        endpoint: "precision_test",
        dob: formData.date,
        tob: formData.time,
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
        ayanamsha: formData.ayanamsha,
        _t: Date.now()
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          "x-api-token": API_TOKEN,
        },
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load comparison data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        paddingTop: "env(safe-area-inset-top)",
        color: "#2d2419",
      }}
    >
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("PrecisionTestTitle", "Astro-Precision Comparison")}
        eyebrow="e-JYOTISHA"
        subtitle={t(
          "PrecisionTestSubtitle",
          "Compare calculations side-by-side: Fallback JS math vs. Native Swiss Ephemeris (swetest) precision."
        )}
      />

      <section
        className="workspace"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        {/* Form Controls Card */}
        <div
          style={{
            background: "rgba(255, 253, 248, 0.88)",
            border: "1px solid rgba(122, 83, 48, 0.16)",
            borderRadius: "8px",
            boxShadow: "0 18px 45px rgba(63, 43, 24, 0.08)",
            padding: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "end"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Date", "Date")}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Time", "Time (HH:MM:SS)")}</label>
            <input
              type="text"
              name="time"
              placeholder="06:00:00"
              value={formData.time}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Latitude", "Latitude")}</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Longitude", "Longitude")}</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Timezone", "Timezone Offset")}</label>
            <input
              type="number"
              step="any"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px" }}>
            <label style={{ fontSize: "0.85rem", color: "#51483d", fontWeight: 700 }}>{t("Ayanamsha", "Ayanamsa")}</label>
            <select
              name="ayanamsha"
              value={formData.ayanamsha}
              onChange={handleInputChange}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d9cdbc",
                background: "#fffdf8",
                color: "#2d2419",
                outline: "none"
              }}
            >
              <option value="lahiri">Lahiri (Chitrapaksha)</option>
              <option value="raman">Raman</option>
              <option value="krishnamurti">Krishnamurti (KP)</option>
              <option value="yukteshwar">Sri Yukteshwar</option>
              <option value="fagan_bradley">Fagan Bradley</option>
              <option value="sayana">Tropical (Sayana)</option>
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={isLoading}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#8a3b24",
              color: "#fffaf2",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
              opacity: isLoading ? 0.7 : 1,
              height: "44px",
              flex: "1 1 auto"
            }}
            onMouseOver={(e) => e.target.style.background = "#732f1c"}
            onMouseOut={(e) => e.target.style.background = "#8a3b24"}
          >
            {isLoading ? t("Calculating", "Calculating...") : t("Compare", "Compare Accuracy")}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              padding: "16px",
              color: "#fca5a5",
              fontWeight: 500
            }}
          >
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Meta and Ayanamsha Card */}
            <div
              style={{
                background: "rgba(255, 253, 248, 0.88)",
                border: "1px solid rgba(122, 83, 48, 0.16)",
                borderRadius: "8px",
                boxShadow: "0 18px 45px rgba(63, 43, 24, 0.08)",
                padding: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "#8a3b24", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Georgia, serif", fontWeight: 700 }}>
                  ⚙️ {t("AyanamshaComparison", "Ayanamsa Precision")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.meta.engine && (
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(122, 83, 48, 0.1)", paddingBottom: "6px", marginBottom: "6px" }}>
                      <span style={{ color: "#857869", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Calculated Via:</span>
                      <span style={{ fontWeight: 700, color: "#8a3b24" }}>{result.meta.engine}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.8 }}>Fallback Ayanamsa:</span>
                    <span style={{ fontWeight: 600 }}>{result.panchanga.fallback.ayanamsha_name} ({result.panchanga.fallback.ayanamsha.toFixed(6)}°)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.8 }}>Swiss Ephemeris Ayanamsa:</span>
                    <span style={{ fontWeight: 600, color: "#2f7d42" }}>{result.panchanga.precise.ayanamsha_name} ({result.panchanga.precise.ayanamsha.toFixed(6)}°)</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(122, 83, 48, 0.16)", marginTop: "6px", paddingTop: "6px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>Deviation:</span>
                    <span style={{ fontWeight: 700, color: "#9a3725" }}>
                      {Math.abs(result.panchanga.fallback.ayanamsha - result.panchanga.precise.ayanamsha).toFixed(6)}° 
                      ({((Math.abs(result.panchanga.fallback.ayanamsha - result.panchanga.precise.ayanamsha)) * 60).toFixed(2)} arcminutes)
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ borderLeft: "1px solid rgba(122, 83, 48, 0.16)", paddingLeft: "20px" }}>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#8a3b24", fontWeight: 800, marginBottom: "8px" }}>
                  🔬 Explanation
                </span>
                <p style={{ fontSize: "0.9rem", color: "#51483d", lineHeight: 1.5, margin: 0 }}>
                  {EXPLANATIONS.ayanamsa}
                </p>
              </div>
            </div>

            {/* Side-by-side Tables */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              
              {/* Rise / Set Comparison Card */}
              <div
                style={{
                  background: "rgba(255, 253, 248, 0.88)",
                  border: "1px solid rgba(122, 83, 48, 0.16)",
                  borderRadius: "8px",
                  boxShadow: "0 18px 45px rgba(63, 43, 24, 0.08)",
                  padding: "24px"
                }}
              >
                <h3 style={{ fontSize: "1.1rem", color: "#8a3b24", marginBottom: "16px", borderBottom: "1px solid #eadfce", paddingBottom: "10px", fontFamily: "Georgia, serif", fontWeight: 700 }}>
                  🌅 Sun & Moon Rise/Set
                </h3>
                
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #eadfce" }}>
                      <th style={{ textAlign: "left", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Event</th>
                      <th style={{ textAlign: "center", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Fallback</th>
                      <th style={{ textAlign: "center", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Swiss Eph</th>
                      <th style={{ textAlign: "right", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>Sunrise</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.riseSet.fallback.sunrise, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.riseSet.precise.sunrise, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.riseSet.fallback.sunrise, result.riseSet.precise.sunrise) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>Sunset</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.riseSet.fallback.sunset, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.riseSet.precise.sunset, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.riseSet.fallback.sunset, result.riseSet.precise.sunset) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>Moonrise</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.riseSet.fallback.moonrise, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.riseSet.precise.moonrise, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.riseSet.fallback.moonrise, result.riseSet.precise.moonrise) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>Moonset</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.riseSet.fallback.moonset, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.riseSet.precise.moonset, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.riseSet.fallback.moonset, result.riseSet.precise.moonset) || "-"}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: "16px", padding: "12px", background: "rgba(138, 59, 36, 0.06)", border: "1px solid rgba(138, 59, 36, 0.12)", borderRadius: "8px", fontSize: "0.85rem", color: "#51483d", lineHeight: 1.4 }}>
                  <span style={{ color: "#8a3b24", fontWeight: 700 }}>Note:</span> {EXPLANATIONS.riseset}
                </div>
              </div>

              {/* Panchanga End Times Comparison Card */}
              <div
                style={{
                  background: "rgba(255, 253, 248, 0.88)",
                  border: "1px solid rgba(122, 83, 48, 0.16)",
                  borderRadius: "8px",
                  boxShadow: "0 18px 45px rgba(63, 43, 24, 0.08)",
                  padding: "24px"
                }}
              >
                <h3 style={{ fontSize: "1.1rem", color: "#8a3b24", marginBottom: "16px", borderBottom: "1px solid #eadfce", paddingBottom: "10px", fontFamily: "Georgia, serif", fontWeight: 700 }}>
                  🕉️ Panchanga Element End Times
                </h3>
                
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #eadfce" }}>
                      <th style={{ textAlign: "left", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Element</th>
                      <th style={{ textAlign: "center", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Fallback End</th>
                      <th style={{ textAlign: "center", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Swiss Eph End</th>
                      <th style={{ textAlign: "right", padding: "8px", color: "#7a3a27", fontSize: "0.78rem", fontWeight: 700 }}>Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>
                        Tithi<br/><span style={{ fontSize: "0.75rem", color: "#857869" }}>{result.panchanga.precise.tithi}</span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.panchanga.fallback.tithi_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.panchanga.precise.tithi_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.panchanga.fallback.tithi_end, result.panchanga.precise.tithi_end) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>
                        Nakshatra<br/><span style={{ fontSize: "0.75rem", color: "#857869" }}>{result.panchanga.precise.nakshatra}</span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.panchanga.fallback.nakshatra_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.panchanga.precise.nakshatra_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.panchanga.fallback.nakshatra_end, result.panchanga.precise.nakshatra_end) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>
                        Yoga<br/><span style={{ fontSize: "0.75rem", color: "#857869" }}>{result.panchanga.precise.yoga}</span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.panchanga.fallback.yoga_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.panchanga.precise.yoga_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.panchanga.fallback.yoga_end, result.panchanga.precise.yoga_end) || "-"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(122, 83, 48, 0.08)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "#2d2419" }}>
                        Karana<br/><span style={{ fontSize: "0.75rem", color: "#857869" }}>{result.panchanga.precise.karana}</span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2d2419" }}>{formatTimestamp(result.panchanga.fallback.karana_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#2f7d42", fontWeight: 700 }}>{formatTimestamp(result.panchanga.precise.karana_end, formData.timezone)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#9a3725", fontWeight: 700 }}>{formatDifference(result.panchanga.fallback.karana_end, result.panchanga.precise.karana_end) || "-"}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: "16px", padding: "12px", background: "rgba(138, 59, 36, 0.06)", border: "1px solid rgba(138, 59, 36, 0.12)", borderRadius: "8px", fontSize: "0.85rem", color: "#51483d", lineHeight: 1.4 }}>
                  <span style={{ color: "#8a3b24", fontWeight: 700 }}>Note:</span> {EXPLANATIONS.panchanga}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>
    </main>
  );
}
