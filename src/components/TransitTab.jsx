import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchBirthChart } from "../services/astrologyApi.js";
import { PredictionPanel } from "./PredictionPanel.jsx";
import { normalizeDashas } from "./DashaTree.jsx";

const planetsList = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];
const pNames = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Kuja",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Sukra",
  Saturn: "Shani",
  Rahu: "Rahu",
  Ketu: "Ketu",
};
const rasiLords = {
  1: "Mars",
  2: "Venus",
  3: "Mercury",
  4: "Moon",
  5: "Sun",
  6: "Mercury",
  7: "Venus",
  8: "Mars",
  9: "Jupiter",
  10: "Saturn",
  11: "Saturn",
  12: "Jupiter",
};

function getLordships(planetId, lagnaRasi) {
  if (planetId === "Rahu" || planetId === "Ketu") return "-";
  let ownedRasis = [];
  for (let r = 1; r <= 12; r++) {
    if (rasiLords[r] === planetId) ownedRasis.push(r);
  }
  if (ownedRasis.length === 0) return "-";
  let houses = ownedRasis.map((r) => ((r - lagnaRasi + 12) % 12) + 1);
  return houses.join(", ");
}

function getTransitStatus(planetId, house, statusData) {
  const pNameShort = pNames[planetId];
  if (statusData) {
    let data = statusData[pNameShort] || statusData[planetId];
    if (Array.isArray(data)) return data.includes(house) ? "Shubha" : "Ashubha";
    else if (data && typeof data === "object")
      return data[house.toString()] || "Unknown";
  }
  const stdShubha = {
    Sun: [3, 6, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [3, 6, 11],
    Mercury: [2, 4, 6, 8, 10, 11],
    Jupiter: [2, 5, 7, 9, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Saturn: [3, 6, 11],
    Rahu: [3, 6, 11],
    Ketu: [3, 6, 11],
  };
  if (stdShubha[planetId])
    return stdShubha[planetId].includes(house) ? "Shubha" : "Ashubha";
  return "-";
}

function getPhala(planetId, house, lang, phalaData) {
  if (!phalaData) return "-";
  const pNameShort = pNames[planetId];
  let row = phalaData.find((r) => {
    let grahaKey = Object.keys(r).find(
      (k) => k.replace(/^\uFEFF/, "") === "Graha",
    );
    if (!grahaKey) return false;
    return r[grahaKey] === pNameShort && String(r["Gochara"]) === String(house);
  });
  return row ? row[lang] || "-" : "-";
}

function getVedhaInfo(
  planetId,
  transitPosNM,
  transitPlanetsMap,
  natalMoonRasi,
  t,
) {
  const vedhaMap = {
    Sun: { 3: 9, 6: 12, 10: 4, 11: 5 },
    Moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
    Mars: { 3: 12, 6: 9, 11: 5 },
    Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
    Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
    Venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
    Saturn: { 3: 12, 6: 9, 11: 5 },
    Rahu: { 3: 12, 6: 9, 11: 5 },
    Ketu: { 3: 12, 6: 9, 11: 5 },
  };
  const vamaVedhaMap = {};
  for (let p in vedhaMap) {
    vamaVedhaMap[p] = {};
    for (let h in vedhaMap[p]) {
      vamaVedhaMap[p][vedhaMap[p][h]] = parseInt(h);
    }
  }
  const vedhaExceptions = {
    Sun: ["Saturn"],
    Saturn: ["Sun"],
    Moon: ["Mercury"],
    Mercury: ["Moon"],
  };

  let vHouse = vedhaMap[planetId] && vedhaMap[planetId][transitPosNM];
  let isVama = false;
  if (!vHouse) {
    vHouse = vamaVedhaMap[planetId] && vamaVedhaMap[planetId][transitPosNM];
    if (vHouse) isVama = true;
  }
  if (!vHouse) return { text: "-", color: "#333", hasVedha: false };

  let vedhaRasi = ((natalMoonRasi + vHouse - 2) % 12) + 1;
  let obstructingPlanets = [];
  let exceptions = vedhaExceptions[planetId] || [];

  Object.entries(transitPlanetsMap).forEach(([pId, rasi]) => {
    if (
      rasi === vedhaRasi &&
      pId !== planetId &&
      pId !== "Ascendant" &&
      !exceptions.includes(pId)
    ) {
      obstructingPlanets.push(t(pId, pNames[pId] || pId));
    }
  });

  if (obstructingPlanets.length > 0) {
    const planetsStr = obstructingPlanets.join(", ");
    if (isVama)
      return {
        text: t("vamaVedhaBy", "Vama Vedha by {{planets}}", {
          planets: planetsStr,
        }),
        color: "#27ae60",
        hasVedha: true,
        isVama: true,
      };
    else
      return {
        text: t("vedhaBy", "Vedha by {{planets}}", { planets: planetsStr }),
        color: "#e74c3c",
        hasVedha: true,
        isVama: false,
      };
  }
  return { text: "-", color: "#333", hasVedha: false };
}

const SOUTH_INDIAN_GRID = [
  [12, 1, 2, 3],
  [11, null, null, 4],
  [10, null, null, 5],
  [9, 8, 7, 6],
];

const PLANET_ABBR = {
  Ascendant: "Lg",
  Sun: "Su",
  Moon: "Ch",
  Mars: "Ku",
  Mercury: "Bu",
  Jupiter: "Gu",
  Venus: "Sk",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

const NORTH_INDIAN_LAYOUT = {
  1: { rashi: { x: 160, y: 35 }, planets: { x: 160, y: 90 } },
  2: { rashi: { x: 80, y: 25 }, planets: { x: 80, y: 55 } },
  3: { rashi: { x: 25, y: 80 }, planets: { x: 55, y: 80 } },
  4: { rashi: { x: 35, y: 160 }, planets: { x: 90, y: 160 } },
  5: { rashi: { x: 25, y: 240 }, planets: { x: 55, y: 240 } },
  6: { rashi: { x: 80, y: 295 }, planets: { x: 80, y: 265 } },
  7: { rashi: { x: 160, y: 285 }, planets: { x: 160, y: 230 } },
  8: { rashi: { x: 240, y: 295 }, planets: { x: 240, y: 265 } },
  9: { rashi: { x: 295, y: 240 }, planets: { x: 265, y: 240 } },
  10: { rashi: { x: 285, y: 160 }, planets: { x: 230, y: 160 } },
  11: { rashi: { x: 295, y: 80 }, planets: { x: 265, y: 80 } },
  12: { rashi: { x: 240, y: 25 }, planets: { x: 240, y: 55 } },
};

function getPlanetsForRashi(planets, rashiNumber) {
  return Object.entries(planets || {})
    .filter(([name, planet]) => Number(planet?.rashi) === rashiNumber)
    .map(([name, planet]) => ({
      name,
      label: PLANET_ABBR[name] || name,
      retrograde: Boolean(planet.retrograde),
      combust: Boolean(planet.combust),
    }));
}

function SingleRashiChart({
  planets,
  title,
  subtitle,
  t,
  borderColor,
  centerBg,
}) {
  const [chartStyle, setChartStyle] = useState(() => {
    return localStorage.getItem("vaiswanara_chart_style") || "south";
  });

  useEffect(() => {
    const handleStyleChange = () => {
      setChartStyle(localStorage.getItem("vaiswanara_chart_style") || "south");
    };
    window.addEventListener("vaiswanara_chart_style_changed", handleStyleChange);
    return () => {
      window.removeEventListener("vaiswanara_chart_style_changed", handleStyleChange);
    };
  }, []);

  const renderHousePlanets = (planetList, cx, cy) => {
    const rows = [];
    const itemsPerRow = 3;
    for (let i = 0; i < planetList.length; i += itemsPerRow) {
      rows.push(planetList.slice(i, i + itemsPerRow));
    }

    return rows.map((row, rowIdx) => {
      let y = cy;
      if (rows.length === 2) {
        y = cy - 6 + rowIdx * 12;
      } else if (rows.length === 3) {
        y = cy - 12 + rowIdx * 12;
      } else if (rows.length > 3) {
        y = cy - 18 + rowIdx * 12;
      }

      return (
        <text
          key={rowIdx}
          x={cx}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "12px", fontFamily: "sans-serif" }}
        >
          {row.map((planet, idx) => {
            const isRetro = planet.retrograde;
            const isCombust = planet.combust;
            const color = isRetro ? "#d35400" : isCombust ? "#8e44ad" : "#2d3436";
            const weight = "800";
            const text = t(planet.label, planet.label);
            
            return (
              <tspan
                key={planet.name}
                fill={color}
                fontWeight={weight}
                dx={idx > 0 ? "4px" : "0px"}
              >
                {text}
                {isRetro && "R"}
                {isCombust && "c"}
              </tspan>
            );
          })}
        </text>
      );
    });
  };

  if (chartStyle === "north") {
    const lagnaRashi = planets["Ascendant"]?.rashi ?? 1;
    const houses = [];
    for (let h = 1; h <= 12; h++) {
      const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
      const planetList = getPlanetsForRashi(planets, houseRashi);
      const pos = NORTH_INDIAN_LAYOUT[h];
      houses.push({
        houseNum: h,
        rashiNum: houseRashi,
        planetList,
        pos,
      });
    }

    return (
      <div
        className="north-chart"
        aria-label={`North Indian ${title}`}
        style={{
          width: "100%",
          maxWidth: "320px",
          aspectRatio: "1 / 1",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <svg
          viewBox="0 0 320 320"
          width="100%"
          height="100%"
          style={{
            display: "block",
            background: "#ffffff",
            border: `2px solid ${borderColor}`,
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          {/* Outer Border */}
          <rect x="0" y="0" width="320" height="320" fill="none" stroke={borderColor} strokeWidth="2" />
          
          {/* Diagonals */}
          <line x1="0" y1="0" x2="320" y2="320" stroke="#ccc" strokeWidth="1.5" />
          <line x1="0" y1="320" x2="320" y2="0" stroke="#ccc" strokeWidth="1.5" />
          
          {/* Inner Diamond */}
          <line x1="160" y1="0" x2="0" y2="160" stroke="#ccc" strokeWidth="1.5" />
          <line x1="0" y1="160" x2="160" y2="320" stroke="#ccc" strokeWidth="1.5" />
          <line x1="160" y1="320" x2="320" y2="160" stroke="#ccc" strokeWidth="1.5" />
          <line x1="320" y1="160" x2="160" y2="0" stroke="#ccc" strokeWidth="1.5" />

          {/* Render Houses Content */}
          {houses.map(({ houseNum, rashiNum, planetList, pos }) => {
            return (
              <g key={houseNum}>
                {/* Rashi Number */}
                <text
                  x={pos.rashi.x}
                  y={pos.rashi.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    fill: "#7f8c8d",
                    fontFamily: "sans-serif",
                    userSelect: "none",
                  }}
                >
                  {rashiNum}
                </text>
                
                {/* Planets inside the house */}
                {renderHousePlanets(planetList, pos.planets.x, pos.planets.y)}
              </g>
            );
          })}

          {/* Centered Chart Title and Subtitle Overlay */}
          <g transform="translate(160, 160)">
            <rect
              x="-45"
              y="-18"
              width="90"
              height="36"
              rx="4"
              fill={centerBg}
              stroke={borderColor}
              strokeWidth="1"
            />
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                fill: borderColor,
                fontFamily: "sans-serif",
              }}
            >
              {t(title, title)}
            </text>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "9px",
                fill: "#666",
                fontFamily: "sans-serif",
              }}
            >
              {subtitle}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      className="south-chart"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gridTemplateRows: "repeat(4, minmax(0, 1fr))",
        width: "100%",
        maxWidth: "320px",
        aspectRatio: "1 / 1",
        margin: "0 auto",
        border: `2px solid ${borderColor}`,
        boxSizing: "border-box",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        borderRadius: "4px",
      }}
    >
      {SOUTH_INDIAN_GRID.flatMap((row, rowIndex) =>
        row.map((rashiNumber, columnIndex) => {
          if (rashiNumber === null) return null;

          const planetList = getPlanetsForRashi(planets, rashiNumber);
          const pCount = planetList.length;

          let fSize = "clamp(13px, 4.5vw, 19px)";
          let gap = "4px";
          if (pCount === 4) {
            fSize = "clamp(11.5px, 3.5vw, 16px)";
            gap = "3px";
          } else if (pCount === 5) {
            fSize = "clamp(10px, 3vw, 14px)";
            gap = "2px";
          } else if (pCount >= 6) {
            fSize = "clamp(9px, 2.5vw, 12px)";
            gap = "1px";
          }

          return (
            <div
              className="south-chart-cell"
              key={`${rowIndex}-${columnIndex}`}
              style={{
                gridColumn: columnIndex + 1,
                gridRow: rowIndex + 1,
                border: "1px solid #e0e0e0",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              <div
                className="planet-cluster"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                  justifyContent: "center",
                  gap: gap,
                  width: "100%",
                  height: "100%",
                }}
              >
                {planetList.map((planet) => (
                  <span
                    className={`planet-token${planet.retrograde ? " is-retrograde" : ""}${planet.combust ? " is-combust" : ""}`}
                    key={planet.name}
                    style={{
                      fontSize: fSize,
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: pCount >= 4 ? "45%" : "auto",
                      color: planet.retrograde
                        ? "#d35400"
                        : planet.combust
                          ? "#8e44ad"
                          : "#2d3436",
                    }}
                  >
                    {t(planet.label, planet.label)}
                    {planet.retrograde && (
                      <sup
                        style={{
                          fontSize: "0.65em",
                          color: "#d35400",
                          marginLeft: "1px",
                          fontWeight: "bold",
                        }}
                      >
                        R
                      </sup>
                    )}
                    {planet.combust && (
                      <sub
                        style={{
                          fontSize: "0.65em",
                          color: "#8e44ad",
                          marginLeft: "1px",
                          fontWeight: "bold",
                        }}
                      >
                        c
                      </sub>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        }),
      )}
      <div
        className="south-chart-center"
        style={{
          gridColumn: "2 / 4",
          gridRow: "2 / 4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: centerBg,
          border: `1px solid ${borderColor}20`,
        }}
      >
        <strong
          style={{ fontSize: "clamp(14px, 4vw, 20px)", color: borderColor }}
        >
          {t(title, title)}
        </strong>
        <span
          style={{
            fontSize: "clamp(10px, 3vw, 14px)",
            color: "#666",
            marginTop: "4px",
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export function TransitTab({ natalData, formData }) {
  const { t, i18n } = useTranslation();

  const [transitDate, setTransitDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [transitTime, setTransitTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  const LANG_MAP = {
    en: "english",
    te: "telugu",
    kn: "kannada",
    sa: "sanskrit",
  };
  const [language, setLanguage] = useState(
    () => LANG_MAP[i18n.language?.split("-")[0]] || "telugu",
  );

  useEffect(() => {
    const newLang = LANG_MAP[i18n.language?.split("-")[0]];
    if (newLang) setLanguage(newLang);
  }, [i18n.language]);

  const [transitChart, setTransitChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [gocharaPhalaData, setGocharaPhalaData] = useState(null);
  const [transitStatusData, setTransitStatusData] = useState(null);
  const [activePlanetTab, setActivePlanetTab] = useState(planetsList[0]);

  // 1. JSON ఫైల్స్ ని లోడ్ చేయడం
  useEffect(() => {
    async function fetchJsonSafely(url) {
      try {
        const res = await fetch(url);
        const text = await res.text();
        return JSON.parse(text); // JSON కాకపోతే క్యాచ్ బ్లాక్ కి వెళ్తుంది
      } catch (e) {
        return null;
      }
    }

    async function loadJsonData() {
      try {
        const baseUrl = import.meta.env.BASE_URL;

        let phalaJson = await fetchJsonSafely(
          `${baseUrl}static/Gochara_phala_All_languages.json`,
        );
        if (!phalaJson) {
          phalaJson = await fetchJsonSafely(
            `${baseUrl}jataka/static/Gochara_phala_All_languages.json`,
          );
        }
        if (!phalaJson)
          throw new Error("Gochara_phala_All_languages.json file not found.");
        setGocharaPhalaData(phalaJson);

        const statusUrls = [
          `${baseUrl}static/planet-transit-results.json`,
          `${baseUrl}jataka/static/planet-transit-results.json`,
          `${baseUrl}static/planet_transit_results.json`,
          `${baseUrl}planet-transit-results.json`,
        ];

        let statusJson = null;
        for (let url of statusUrls) {
          statusJson = await fetchJsonSafely(url);
          if (statusJson) break;
        }

        // ఫైల్ దొరకకపోతే క్రాష్ అవ్వకుండా null పాస్ చేస్తాము. కోడ్ లోని default rules వాడుకుంటుంది.
        setTransitStatusData(statusJson || null);
      } catch (err) {
        console.error("Failed to load transit JSON files:", err);
        setError("Failed to load Transit Data: " + err.message);
      }
    }
    loadJsonData();
  }, []);

  // 2. తేదీ, సమయం మారినప్పుడు ట్రాన్సిట్ గ్రహాల స్థానాలు తెచ్చుకోవడం
  useEffect(() => {
    async function getTransitChart() {
      if (!transitDate || !transitTime) return;
      setLoading(true);
      setError("");
      try {
        // పాత ఫారమ్ డేటానే (లొకేషన్) వాడుతూ, తేదీ సమయం మారుస్తున్నాము
        const result = await fetchBirthChart({
          ...formData,
          dob: transitDate,
          tob: transitTime,
        });
        setTransitChart(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      getTransitChart();
    }, 50); // Reduced debounce for instant feedback
    return () => clearTimeout(timer);
  }, [transitDate, transitTime, formData]);

  let specialAlerts = [];
  let tableRows = [];

  if (!error && transitChart && natalData) {
    const lagnaRasi = natalData?.planets?.Ascendant?.rashi;
    const natalMoonRasi = natalData?.planets?.Moon?.rashi;
    const transitPlanetsMap = {};
    Object.entries(transitChart.planets || {}).forEach(([p, d]) => {
      transitPlanetsMap[p] = d.rashi;
    });

    if (transitPlanetsMap["Saturn"] && natalMoonRasi) {
      let st = ((transitPlanetsMap["Saturn"] - natalMoonRasi + 12) % 12) + 1;
      if ([12, 1, 2].includes(st))
        specialAlerts.push(
          t(
            "sadeSatiAlert",
            `⚠️ Sade Sati (Elinaati Shani) is active! (Shani transiting ${st}H from Natal Moon).`,
            { st },
          ),
        );
      else if (st === 8)
        specialAlerts.push(
          t(
            "ashtamaShaniAlert",
            `⚠️ Ashtama Shani is active! (Shani transiting 8H from Natal Moon).`,
          ),
        );
      else if (st === 4)
        specialAlerts.push(
          t(
            "ardhastamaShaniAlert",
            `⚠️ Ardhastama Shani is active! (Shani transiting 4H from Natal Moon).`,
          ),
        );
    }
    if (transitPlanetsMap["Jupiter"] && natalMoonRasi) {
      let gt = ((transitPlanetsMap["Jupiter"] - natalMoonRasi + 12) % 12) + 1;
      if ([2, 5, 7, 9, 11].includes(gt))
        specialAlerts.push(
          t(
            "guruBalamAlert",
            `✨ Guru Balam is present! (Guru transiting ${gt}H from Natal Moon).`,
            { gt },
          ),
        );
    }

    tableRows = planetsList.map((pId) => {
      const pName = pNames[pId];
      const lordships = getLordships(pId, lagnaRasi);
      const nRasi = natalData?.planets?.[pId]?.rashi;
      const tRasi = transitChart?.planets?.[pId]?.rashi;
      const nPos = nRasi ? ((nRasi - lagnaRasi + 12) % 12) + 1 : "-";
      const tPosNM =
        tRasi && natalMoonRasi ? ((tRasi - natalMoonRasi + 12) % 12) + 1 : "-";
      const status =
        tPosNM !== "-" ? getTransitStatus(pId, tPosNM, transitStatusData) : "-";

      let bavBindus = "-";
      if (pId !== "Rahu" && pId !== "Ketu" && tRasi) {
        bavBindus =
          natalData?.ashtakavarga?.prastarashtakavarga?.[pId]?.[tRasi] ||
          natalData?.ashtakavarga?.bav?.[pId]?.[tRasi] ||
          "-";
      }

      const vedhaInfo =
        tPosNM !== "-"
          ? getVedhaInfo(pId, tPosNM, transitPlanetsMap, natalMoonRasi, t)
          : { text: "-", color: "#333", hasVedha: false };
      const phala =
        tPosNM !== "-"
          ? getPhala(pId, tPosNM, language, gocharaPhalaData)
          : "-";

      return {
        pId,
        pName,
        lordships,
        nPos,
        tPosNM,
        status,
        bavBindus,
        vedhaInfo,
        phala,
      };
    });
  }

  const visibleRows = tableRows.filter((r) => r.pId === activePlanetTab);

  return (
    <div className="transit-tab-container" style={{ minWidth: 0 }}>
      <style>{`
        .transit-controls-bar {
          position: -webkit-sticky;
          position: sticky;
          top: calc(env(safe-area-inset-top, 0px) + 48px);
          z-index: 95;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .transit-controls-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .transit-input-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8f9fa;
          padding: 2px 4px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }
        .transit-input-group:focus-within {
          border-color: #8e44ad;
          box-shadow: 0 0 0 2px rgba(142,68,173,0.15);
          background: #fff;
        }
        .transit-input {
          border: none;
          background: transparent;
          font-size: 14px;
          color: #2c3e50;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          width: 100%;
        }
        .transit-input[type="date"], .transit-input[type="time"] {
          font-family: monospace;
          font-size: 13px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .transit-controls-bar {
            padding: 4px;
            gap: 8px;
            justify-content: center;
          }
          .transit-controls-group {
            width: 100%;
            justify-content: space-between;
            gap: 6px;
          }
          .transit-input-group {
            flex: 1;
            min-width: calc(50% - 3px);
            justify-content: center;
            padding: 2px;
          }
          .transit-input-group.lang-group {
            min-width: 100%;
          }
        }

        /* Header corrections inside sticky control bar */
        .new-horo-page .transit-controls-bar h3 {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          color: #8e44ad !important;
          font-size: 16px !important;
        }

        /* Transit Dual Charts Grid and Card Layout */
        .new-horo-page .transit-charts-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
          align-items: start !important;
          box-sizing: border-box !important;
          margin-bottom: 25px !important;
        }
        .new-horo-page .transit-chart-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 15px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }
        .new-horo-page .transit-chart-card h3.natal-header {
          color: #8e44ad !important;
        }
        .new-horo-page .transit-chart-card h3.transit-header {
          color: #27ae60 !important;
        }
        @media (max-width: 768px) {
          .new-horo-page .transit-charts-row {
            grid-template-columns: 1fr !important;
          }
        }

        /* Accordion Zone Cards */
        .new-horo-page .zone-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          margin-bottom: 25px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .zone-card summary {
          padding: 16px 20px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #2c3e50 !important;
          cursor: pointer !important;
          outline: none !important;
          list-style: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          user-select: none !important;
          white-space: normal !important;
          word-break: break-word !important;
        }
        .new-horo-page .zone-card summary::-webkit-details-marker {
          display: none !important;
        }
        .new-horo-page .zone-card summary::after {
          content: '▼' !important;
          font-size: 10px !important;
          color: #7f8c8d !important;
          transition: transform 0.2s ease !important;
        }
        .new-horo-page .zone-card[open] summary::after {
          transform: rotate(180deg) !important;
        }

        /* Planet selection tabs container */
        .new-horo-page .transit-planet-tabs {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          justify-content: safe center !important;
          gap: 6px !important;
          padding: 5px 0 !important;
          width: 100% !important;
          margin-bottom: 15px !important;
          scrollbar-width: none !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .new-horo-page .transit-planet-tabs::-webkit-scrollbar {
          display: none !important;
        }

        /* Small circular buttons for Planet selection */
        .new-horo-page .transit-planet-btn {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          padding: 0 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          border-radius: 50% !important;
          border: 1px solid #eaecee !important;
          background: #f8f9fa !important;
          color: #4a5568 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          flex-shrink: 0 !important;
        }
        .new-horo-page .transit-planet-btn:hover {
          border-color: #8e44ad !important;
          background: #f9f0ff !important;
          color: #8e44ad !important;
        }
        .new-horo-page .transit-planet-btn.active {
          background: #8e44ad !important;
          color: #ffffff !important;
          border-color: #8e44ad !important;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.25) !important;
        }

        /* Card Layout for Transit Results table on all screens */
        .new-horo-page .transit-results-table, 
        .new-horo-page .transit-results-table tbody, 
        .new-horo-page .transit-results-table tr {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .transit-results-table thead {
          display: none !important;
        }
        .new-horo-page .transit-results-table tr {
          margin-bottom: 20px !important;
          border: 1px solid #eaecee !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          overflow: hidden !important;
          background: #fff !important;
        }
        .new-horo-page .transit-results-table td {
          display: grid !important;
          grid-template-columns: 140px 1fr !important;
          gap: 15px !important;
          align-items: center !important;
          border: none !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding: 10px 15px !important;
          text-align: left !important;
          width: 100% !important;
          box-sizing: border-box !important;
          white-space: normal !important;
        }
        .new-horo-page .transit-results-table td::before {
          content: attr(data-label) !important;
          display: block !important;
          font-weight: 600 !important;
          color: #7f8c8d !important;
          font-size: 13px !important;
          word-break: break-word !important;
        }
        .new-horo-page .transit-results-table td > span {
          display: block !important;
          word-break: break-word !important;
          color: #2c3e50 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }
        .new-horo-page .transit-results-table td:first-child {
          background: #fdfefe !important;
          border-bottom: 1px solid #f1f2f6 !important;
        }
        .new-horo-page .transit-results-table td:first-child > span {
          font-size: 15px !important;
          color: #8e44ad !important;
          font-weight: 700 !important;
        }
        .new-horo-page .transit-results-table td:last-child {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          border-bottom: none !important;
          background: #fdfefe !important;
          padding: 15px !important;
          gap: 8px !important;
        }
        .new-horo-page .transit-results-table td:last-child::before {
          content: attr(data-label) !important;
          color: #8e44ad !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding-bottom: 6px !important;
          width: 100% !important;
        }
        .new-horo-page .transit-results-table td:last-child > span {
          text-align: justify !important;
          line-height: 1.6 !important;
          font-weight: normal !important;
          width: 100% !important;
        }
        @media (max-width: 600px) {
          .new-horo-page .transit-results-table td {
            grid-template-columns: 120px 1fr !important;
            gap: 10px !important;
            padding: 10px 12px !important;
          }
          .new-horo-page .transit-results-table td::before {
            font-size: 12px !important;
          }
          .new-horo-page .transit-results-table td > span {
            font-size: 13px !important;
          }
        }

        /* Double Transit and Dasha Support Tables */
        .new-horo-page .double-transit-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-bottom: 25px !important;
          background: #fff !important;
          border: 1px solid #eaecee !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .new-horo-page .double-transit-table th {
          background: #fdfefe !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          padding: 10px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: 1px solid #f1f2f6 !important;
          font-size: 13px !important;
        }
        .new-horo-page .double-transit-table th:last-child {
          border-right: none !important;
        }
        .new-horo-page .double-transit-table td {
          padding: 10px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: 1px solid #f1f2f6 !important;
          font-size: 13px !important;
          color: #2c3e50 !important;
          white-space: normal !important;
        }
        .new-horo-page .double-transit-table td:last-child {
          border-right: none !important;
        }
        .new-horo-page .double-transit-table tr:last-child td {
          border-bottom: none !important;
        }
        .new-horo-page .double-transit-table th.center-col,
        .new-horo-page .double-transit-table td.center-col {
          text-align: center !important;
          width: 80px !important;
        }
      `}</style>

      {/* Top Control Bar */}
      <div className="transit-controls-bar">
        <h3
          style={{
            margin: 0,
            color: "#8e44ad",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {t("gocharaTransit", "Gochara (Transit)")}
          {loading && (
            <span
              style={{
                fontSize: "14px",
                color: "#e67e22",
                fontWeight: "normal",
                fontStyle: "italic",
              }}
            >
              {t("updating", "Updating...")}
            </span>
          )}
        </h3>

        <div className="transit-controls-group">
          <div className="transit-input-group">
            <input
              type="date"
              className="transit-input"
              value={transitDate}
              onChange={(e) => setTransitDate(e.target.value)}
              title={t("date", "Date")}
            />
          </div>

          <div className="transit-input-group">
            <input
              type="time"
              className="transit-input"
              value={transitTime}
              onChange={(e) => setTransitTime(e.target.value)}
              title={t("time", "Time")}
            />
          </div>

          {/* Language field temporarily hidden */}
          <div
            className="transit-input-group lang-group"
            style={{ display: "none" }}
          >
            <select
              className="transit-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              title={t("Language", "Language")}
            >
              <option value="english">{t("english", "English")}</option>
              <option value="sanskrit">{t("sanskrit", "Sanskrit")}</option>
              <option value="telugu">{t("telugu", "Telugu")}</option>
              <option value="kannada">{t("kannada", "Kannada")}</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      {!error && transitChart && (
        <div
          style={{
            marginTop: "20px",
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.2s ease",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          {/* Dual Charts Section */}
          <div className="transit-charts-row">
            <div className="transit-chart-card">
              <h3 className="natal-header">
                {t("natalD1", "Natal (D1)")}
              </h3>
              <SingleRashiChart
                planets={natalData.planets}
                title={t("natalChart", "Natal Chart")}
                subtitle="(D1)"
                borderColor="#8e44ad"
                centerBg="#f9f0ff"
                t={t}
              />
            </div>
            <div className="transit-chart-card">
              <h3 className="transit-header">
                {t("transitD1", "Transit (D1)")}
              </h3>
              <SingleRashiChart
                planets={transitChart.planets}
                title={t("transitChart", "Transit Chart")}
                subtitle={`(D1 on ${transitDate})`}
                borderColor="#27ae60"
                centerBg="#f0fdf4"
                t={t}
              />
            </div>
          </div>

          {/* Special Transit Alerts (Sade Sati, Guru Balam etc.) */}
          {specialAlerts.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              {specialAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    background: alert.includes("Guru") ? "#eafaf1" : "#fcf3cf",
                    borderLeft: `5px solid ${alert.includes("Guru") ? "#27ae60" : "#f39c12"}`,
                    padding: "12px 15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    color: alert.includes("Guru") ? "#27ae60" : "#d35400",
                    fontSize: "15px",
                  }}
                >
                  {alert}
                </div>
              ))}
            </div>
          )}

          {/* Gochara Phala Results Section */}
          <details open className="zone-card">
            <summary>
              <span>🪐 {t("transitResults", "Transit Results")}</span>
            </summary>
            <div style={{ padding: "20px" }}>
              <div className="transit-planet-tabs">
                {planetsList.map((pId) => (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => setActivePlanetTab(pId)}
                    className={`transit-planet-btn ${activePlanetTab === pId ? "active" : ""}`}
                    title={t(pNames[pId] || pId)}
                  >
                    {t(PLANET_ABBR[pId] || pId, PLANET_ABBR[pId] || pId)}
                  </button>
                ))}
              </div>

              <div className="transit-table-container" style={{ marginTop: "20px" }}>
                <table className="data-table transit-results-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("Planet", "Planet")}
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("Lordship", "Lordship")}
                        <br />
                        <span
                          style={{
                            fontSize: "0.8em",
                            fontWeight: "normal",
                            opacity: 0.8,
                          }}
                        >
                          ({t("natalD1", "Natal D1")})
                        </span>
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("natalPos", "Natal Pos")}
                        <br />
                        <span
                          style={{
                            fontSize: "0.8em",
                            fontWeight: "normal",
                            opacity: 0.8,
                          }}
                        >
                          ({t("fromLagna", "from Lagna")})
                        </span>
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("transitPos", "Transit Pos")}
                        <br />
                        <span
                          style={{
                            fontSize: "0.8em",
                            fontWeight: "normal",
                            opacity: 0.8,
                          }}
                        >
                          ({t("fromNatalMoon", "from Natal Moon")})
                        </span>
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("bavBindus", "BAV Bindus")}
                        <br />
                        <span
                          style={{
                            fontSize: "0.8em",
                            fontWeight: "normal",
                            opacity: 0.8,
                          }}
                        >
                          ({t("inTransitSign", "in Transit Sign")})
                        </span>
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("transitStatus", "Transit Status")}
                      </th>
                      <th style={{ textAlign: "center", fontSize: "15px" }}>
                        {t("vedha", "Vedha")}
                        <br />
                        <span
                          style={{
                            fontSize: "0.8em",
                            fontWeight: "normal",
                            opacity: 0.8,
                          }}
                        >
                          ({t("obstruction", "Obstruction")})
                        </span>
                      </th>
                      <th style={{ textAlign: "left", fontSize: "15px" }}>
                        {t("transitResults", "Transit Results")} (
                        {t(
                          language,
                          language.charAt(0).toUpperCase() + language.slice(1),
                        )}
                        )
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row, idx) => {
                      const statusColor =
                        row.status === "Shubha"
                          ? "#27ae60"
                          : row.status === "Ashubha"
                            ? "#e74c3c"
                            : "#555";
                      let bavColor = "#333";
                      if (row.bavBindus !== "-") {
                        if (row.bavBindus >= 5) {
                          bavColor = "#27ae60";
                        } else if (row.bavBindus <= 3) {
                          bavColor = "#e74c3c";
                        } else {
                          bavColor = "#d35400";
                        }
                      }

                      let statusText =
                        row.status === "Shubha"
                          ? t("Shubham", "Shubham")
                          : row.status === "Ashubha"
                            ? t("Ashubham", "Ashubham")
                            : t(row.status, row.status);
                      let statusDisplay = statusText;
                      let finalStatusColor = statusColor;
                      if (row.vedhaInfo.hasVedha) {
                        if (!row.vedhaInfo.isVama && row.status === "Shubha") {
                          statusDisplay = (
                            <>
                              <span style={{ textDecoration: "line-through" }}>
                                {statusText}
                              </span>
                              <br />
                              <span
                                style={{ fontSize: "0.85em", color: "#e74c3c" }}
                              >
                                ({t("obstructed", "Obstructed")})
                              </span>
                            </>
                          );
                          finalStatusColor = "#7f8c8d";
                        } else if (
                          row.vedhaInfo.isVama &&
                          row.status === "Ashubha"
                        ) {
                          statusDisplay = (
                            <>
                              <span style={{ textDecoration: "line-through" }}>
                                {statusText}
                              </span>
                              <br />
                              <span
                                style={{ fontSize: "0.85em", color: "#27ae60" }}
                              >
                                ({t("obstructed", "Obstructed")})
                              </span>
                            </>
                          );
                          finalStatusColor = "#7f8c8d";
                        }
                      }

                      return (
                        <tr key={idx}>
                          <td data-label={t("Planet", "Planet")}>
                            <span>{t(row.pId, row.pName)}</span>
                          </td>
                          <td data-label={t("Lordship", "Lordship")}>
                            <span>{row.lordships}</span>
                          </td>
                          <td data-label={t("natalPos", "Natal Pos")}>
                            <span>{row.nPos}</span>
                          </td>
                          <td data-label={t("transitPos", "Transit Pos")}>
                            <span>{row.tPosNM}</span>
                          </td>
                          <td data-label={t("bavBindus", "BAV Bindus")}>
                            <span
                              style={{ color: bavColor, fontWeight: "bold" }}
                            >
                              {row.bavBindus}
                            </span>
                          </td>
                          <td data-label={t("transitStatus", "Transit Status")}>
                            <span
                              style={{
                                color: finalStatusColor,
                                fontWeight: "bold",
                              }}
                            >
                              {statusDisplay}
                            </span>
                          </td>
                          <td data-label={t("vedha", "Vedha")}>
                            <span
                              style={{
                                color: row.vedhaInfo.color,
                                fontWeight: "bold",
                              }}
                            >
                              {row.vedhaInfo.text}
                            </span>
                          </td>
                          <td
                            data-label={`${t("transitResults", "Transit Results")} (${t(language, language.charAt(0).toUpperCase() + language.slice(1))})`}
                          >
                            <span>{row.phala}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <DoubleTransitAnalysis
            natalData={natalData}
            transitChart={transitChart}
            transitDate={transitDate}
            t={t}
          />
        </div>
      )}
    </div>
  );
}

function DoubleTransitAnalysis({ natalData, transitChart, transitDate, t }) {
  if (!natalData || !transitChart || !transitDate) return null;

  const addSignDT = (sign, step) => ((sign - 1 + step) % 12) + 1;
  const getLordDT = (sign) => {
    const lords = {
      1: "Mars",
      2: "Venus",
      3: "Mercury",
      4: "Moon",
      5: "Sun",
      6: "Mercury",
      7: "Venus",
      8: "Mars",
      9: "Jupiter",
      10: "Saturn",
      11: "Saturn",
      12: "Jupiter",
    };
    return lords[sign];
  };
  const aspectTargetsDT = (planetCode, sign) => {
    if (!sign) return [];
    if (planetCode === "Jupiter")
      return [addSignDT(sign, 4), addSignDT(sign, 6), addSignDT(sign, 8)];
    if (planetCode === "Saturn")
      return [addSignDT(sign, 2), addSignDT(sign, 6), addSignDT(sign, 9)];
    return [];
  };
  const isPositedDT = (transitSign, targetSign) =>
    !!(transitSign && targetSign && transitSign === targetSign);
  const isAspectingDT = (planetCode, transitSign, targetSign) => {
    if (!transitSign || !targetSign) return false;
    return aspectTargetsDT(planetCode, transitSign).includes(targetSign);
  };

  const lagna = natalData.planets?.Ascendant?.rashi;
  const janmaRashi = natalData.planets?.Moon?.rashi;
  const guruSign = transitChart.planets?.Jupiter?.rashi;
  const shaniSign = transitChart.planets?.Saturn?.rashi;

  if (!lagna || !janmaRashi || !guruSign || !shaniSign) {
    return (
      <div style={{ color: "#7f8c8d", fontStyle: "italic", marginTop: "20px" }}>
        Data not available for Double Transit analysis.
      </div>
    );
  }

  const seventhHouse = addSignDT(lagna, 6);
  const seventhLord = getLordDT(seventhHouse);
  const seventhLordSign = natalData.planets[seventhLord]?.rashi;
  const lagnaLord = getLordDT(lagna);
  const lagnaLordSign = natalData.planets[lagnaLord]?.rashi;
  const secondHouse = addSignDT(lagna, 1);
  const eleventhHouse = addSignDT(lagna, 10);
  const natalSecondLord = getLordDT(secondHouse);
  const natalEleventhLord = getLordDT(eleventhHouse);

  const planetKeys = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
  ];
  const natalSeventhHousePlanets = planetKeys.filter(
    (p) => natalData.planets[p]?.rashi === seventhHouse,
  );

  const rows = [
    {
      label: t("dt_pos_7", "Posited in 7th House"),
      guru: isPositedDT(guruSign, seventhHouse),
      shani: isPositedDT(shaniSign, seventhHouse),
    },
    {
      label: t("dt_asp_7", "Aspecting 7th House"),
      guru: isAspectingDT("Jupiter", guruSign, seventhHouse),
      shani: isAspectingDT("Saturn", shaniSign, seventhHouse),
    },
    {
      label: t("dt_conj_7_lord", "Conjunction with 7th Lord"),
      guru: isPositedDT(guruSign, seventhLordSign),
      shani: isPositedDT(shaniSign, seventhLordSign),
    },
    {
      label: t("dt_asp_7_lord", "Aspecting 7th Lord"),
      guru: isAspectingDT("Jupiter", guruSign, seventhLordSign),
      shani: isAspectingDT("Saturn", shaniSign, seventhLordSign),
    },
    {
      label: t("dt_pos_lagna", "Posited in Lagna"),
      guru: isPositedDT(guruSign, lagna),
      shani: isPositedDT(shaniSign, lagna),
    },
    {
      label: t("dt_asp_lagna", "Aspecting Lagna"),
      guru: isAspectingDT("Jupiter", guruSign, lagna),
      shani: isAspectingDT("Saturn", shaniSign, lagna),
    },
    {
      label: t("dt_conj_lagna_lord", "Conjoined with Lagna Lord"),
      guru: isPositedDT(guruSign, lagnaLordSign),
      shani: isPositedDT(shaniSign, lagnaLordSign),
    },
    {
      label: t("dt_asp_lagna_lord", "Aspecting Lagna Lord"),
      guru: isAspectingDT("Jupiter", guruSign, lagnaLordSign),
      shani: isAspectingDT("Saturn", shaniSign, lagnaLordSign),
    },
    {
      label: t("dt_pos_moon", "Posited in Janma Rashi"),
      guru: isPositedDT(guruSign, janmaRashi),
      shani: isPositedDT(shaniSign, janmaRashi),
    },
    {
      label: t("dt_asp_moon", "Aspecting Janma Rashi"),
      guru: isAspectingDT("Jupiter", guruSign, janmaRashi),
      shani: isAspectingDT("Saturn", shaniSign, janmaRashi),
    },
  ];

  // Dasha Support
  const normalizedDashas = normalizeDashas(natalData.dashas || []);
  const transitDateObj = new Date(`${transitDate}T12:00:00Z`);
  const parseDateSafe = (dStr) => new Date(`${dStr}T00:00:00Z`);

  let activeMDId = null,
    activeADId = null,
    activePDId = null;
  for (let md of normalizedDashas) {
    if (
      transitDateObj >= parseDateSafe(md.start) &&
      transitDateObj < parseDateSafe(md.end)
    ) {
      activeMDId = md.planet;
      for (let ad of md.antardashas) {
        if (
          transitDateObj >= parseDateSafe(ad.start) &&
          transitDateObj < parseDateSafe(ad.end)
        ) {
          activeADId = ad.planet;
          for (let pd of ad.pratyantaraDashas) {
            if (
              transitDateObj >= parseDateSafe(pd.start) &&
              transitDateObj < parseDateSafe(pd.end)
            ) {
              activePDId = pd.planet;
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  const matchesDasha = (planets, targetId) =>
    !!(planets && targetId && planets.includes(targetId));
  const dashaSupportRows = [
    { label: t("ds_7_lord", "7th Lord Dasha"), planets: [seventhLord] },
    {
      label: t("ds_7_house", "Planets in Natal 7th House Dasha"),
      planets: natalSeventhHousePlanets,
    },
    { label: t("ds_venus", "Venus (Shukra) Dasha"), planets: ["Venus"] },
    { label: t("ds_2_lord", "2nd Lord Dasha"), planets: [natalSecondLord] },
    { label: t("ds_11_lord", "11th Lord Dasha"), planets: [natalEleventhLord] },
  ];

  return (
    <details open className="zone-card">
      <summary>
        <span>
          {t(
            "double_transit_title",
            "💞 Double Transit (Marriage Yoga Analysis)",
          )}
        </span>
      </summary>
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            color: "#2c3e50",
            marginTop: 0,
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {t("transit_activation_title", "Transit Activation for Marriage")}
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table className="double-transit-table">
            <thead>
              <tr>
                <th>{t("parameter", "Parameter")}</th>
                <th className="center-col">{t("guru", "Guru")}</th>
                <th className="center-col">{t("shani", "Shani")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.label}</td>
                  <td className="center-col">
                    {r.guru ? (
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {t("yes", "Yes")} ✓
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>-</span>
                    )}
                  </td>
                  <td className="center-col">
                    {r.shani ? (
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {t("yes", "Yes")} ✓
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3
          style={{
            color: "#2c3e50",
            marginTop: 0,
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {t("dasha_support_title", "Dasha Support for Marriage")}
        </h3>
        <div
          style={{
            background: "#f9f0ff",
            padding: "12px 15px",
            borderLeft: "5px solid #8e44ad",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#7f8c8d" }}>
            {t("current_dasha_on", `Current Dasha (on {0}):`).replace(
              "{0}",
              transitDate,
            )}
          </span>
          <br />
          <span style={{ color: "#c0392b", fontWeight: "bold" }}>
            {activeMDId ? t(activeMDId) : "-"}
          </span>{" "}
          (MD) &rarr;{" "}
          <span style={{ color: "#d35400", fontWeight: "bold" }}>
            {activeADId ? t(activeADId) : "-"}
          </span>{" "}
          (AD) &rarr;{" "}
          <span style={{ color: "#e67e22", fontWeight: "bold" }}>
            {activePDId ? t(activePDId) : "-"}
          </span>{" "}
          (PD)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="double-transit-table">
            <thead>
              <tr>
                <th>{t("dasha_parameter", "Dasha Parameter")}</th>
                <th className="center-col">{t("maha", "Maha")}</th>
                <th className="center-col">{t("antar", "Antar")}</th>
                <th className="center-col">{t("praty", "Praty")}</th>
              </tr>
            </thead>
            <tbody>
              {dashaSupportRows.map((r, i) => (
                <tr key={i}>
                  <td>
                    {r.label}
                    {r.planets && r.planets.length > 0 && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#8e44ad",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        ({r.planets.map((p) => t(p)).join(", ")})
                      </span>
                    )}
                  </td>
                  <td className="center-col">
                    {matchesDasha(r.planets, activeMDId) ? (
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {t("yes", "Yes")} ✓
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>-</span>
                    )}
                  </td>
                  <td className="center-col">
                    {matchesDasha(r.planets, activeADId) ? (
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {t("yes", "Yes")} ✓
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>-</span>
                    )}
                  </td>
                  <td className="center-col">
                    {matchesDasha(r.planets, activePDId) ? (
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {t("yes", "Yes")} ✓
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
