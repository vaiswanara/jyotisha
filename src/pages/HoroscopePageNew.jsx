import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { fetchBirthChart } from "../services/astrologyApi.js";
import { RashiChart } from "../components/RashiChart.jsx";
import { PredictionPanel } from "../components/PredictionPanel.jsx";
import { GrahaTable } from "../components/GrahaTable.jsx";
import { DashaTree } from "../components/DashaTree.jsx";
import { ShadabalaTable } from "../components/ShadabalaTable.jsx";
import { AshtakavargaTable } from "../components/AshtakavargaTable.jsx";
import { TransitTab } from "../components/TransitTab.jsx";
import { formatDegree } from "../utils/formatters.js";

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatPanchanga(panchanga = {}, t) {
  const keyMap = { Makha: "Magha", Garija: "Gara", Garaja: "Gara" };

  const formatTithi = (tithi) => {
    if (!tithi) return null;
    return String(tithi)
      .replace(/S[-.]\s*/gi, "Shukla ")
      .replace(/K[-.]\s*/gi, "Krishna ")
      .split(" ")
      .map((word) => t(keyMap[word] || word))
      .join(" ");
  };

  const formatGeneral = (val) => {
    if (!val) return null;
    return t(keyMap[val] || val);
  };

  const parts = [
    formatTithi(panchanga.tithi),
    formatGeneral(panchanga.vara),
    formatGeneral(panchanga.moon_nakshatra),
    formatGeneral(panchanga.yoga),
    formatGeneral(panchanga.karana),
  ].filter(Boolean);

  return parts.length
    ? parts.join(" · ")
    : t(
        "panchangaDetailsWait",
        "Panchanga details will appear here after calculation.",
      );
}

function buildPrintNorthSvg(planets, navamsa, title, subtitle, t) {
  const W = 280;
  const shortNames = {
    Sun: "Su",
    Moon: "Ch",
    Mars: "Ku",
    Mercury: "Bu",
    Jupiter: "Gu",
    Venus: "Sk",
    Saturn: "Sa",
    Rahu: "Ra",
    Ketu: "Ke",
    Ascendant: "Lg",
  };

  const activePlanets = {};
  for (const [name, pd] of Object.entries(planets)) {
    const rashi = navamsa ? (navamsa[name]?.rashi ?? pd.rashi) : pd.rashi;
    activePlanets[name] = {
      rashi,
      retrograde: pd.retrograde,
      combust: pd.combust,
    };
  }

  const lagnaRashi = activePlanets["Ascendant"]?.rashi ?? 1;

  let s = `<svg width="${W}px" height="${W}px" viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff;">
    <rect width="${W}" height="${W}" fill="white" stroke="#8e44ad" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="${W}" y2="${W}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${W}" x2="${W}" y2="0" stroke="#ccc" stroke-width="1"/>
    <line x1="${W/2}" y1="0" x2="0" y2="${W/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${W/2}" x2="${W/2}" y2="${W}" stroke="#ccc" stroke-width="1"/>
    <line x1="${W/2}" y1="${W}" x2="${W}" y2="${W/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="${W}" y1="${W/2}" x2="${W/2}" y2="0" stroke="#ccc" stroke-width="1"/>`;

  const layout = {
    1: { rashi: { x: 140, y: 30 }, planets: { x: 140, y: 80 } },
    2: { rashi: { x: 70, y: 22 }, planets: { x: 70, y: 48 } },
    3: { rashi: { x: 22, y: 70 }, planets: { x: 48, y: 70 } },
    4: { rashi: { x: 30, y: 140 }, planets: { x: 80, y: 140 } },
    5: { rashi: { x: 22, y: 210 }, planets: { x: 48, y: 210 } },
    6: { rashi: { x: 70, y: 258 }, planets: { x: 70, y: 232 } },
    7: { rashi: { x: 140, y: 250 }, planets: { x: 140, y: 200 } },
    8: { rashi: { x: 210, y: 258 }, planets: { x: 210, y: 232 } },
    9: { rashi: { x: 258, y: 210 }, planets: { x: 232, y: 210 } },
    10: { rashi: { x: 250, y: 140 }, planets: { x: 200, y: 140 } },
    11: { rashi: { x: 258, y: 70 }, planets: { x: 232, y: 70 } },
    12: { rashi: { x: 210, y: 22 }, planets: { x: 210, y: 48 } },
  };

  for (let h = 1; h <= 12; h++) {
    const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
    const pos = layout[h];

    s += `<text x="${pos.rashi.x}" y="${pos.rashi.y}" font-size="10.5" font-weight="bold" fill="#7f8c8d" text-anchor="middle" dominant-baseline="middle">${houseRashi}</text>`;

    const housePlanets = Object.entries(activePlanets)
      .filter(([name, p]) => p.rashi === houseRashi)
      .map(([name, p]) => ({
        name,
        label: shortNames[name] || name,
        retrograde: p.retrograde,
        combust: p.combust,
      }));

    if (housePlanets.length > 0) {
      const rows = [];
      const itemsPerRow = 3;
      for (let i = 0; i < housePlanets.length; i += itemsPerRow) {
        rows.push(housePlanets.slice(i, i + itemsPerRow));
      }

      rows.forEach((row, rowIdx) => {
        let y = pos.planets.y;
        if (rows.length === 2) {
          y = pos.planets.y - 5 + rowIdx * 10;
        } else if (rows.length === 3) {
          y = pos.planets.y - 10 + rowIdx * 10;
        } else if (rows.length > 3) {
          y = pos.planets.y - 15 + rowIdx * 10;
        }

        row.forEach((planet, idx) => {
          const color = planet.retrograde ? "#2980b9" : planet.combust ? "#c0392b" : "#2c3e50";
          const text = t(planet.label);
          let x = pos.planets.x;
          if (row.length === 2) {
            x = idx === 0 ? pos.planets.x - 12 : pos.planets.x + 12;
          } else if (row.length === 3) {
            x = idx === 0 ? pos.planets.x - 18 : idx === 1 ? pos.planets.x : pos.planets.x + 18;
          }
          s += `<text x="${x}" y="${y}" font-size="10.5" font-weight="900" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}`;
          if (planet.retrograde) s += "R";
          if (planet.combust) s += "c";
          s += `</text>`;
        });
      });
    }
  }

  s += `<rect x="95" y="102" width="90" height="36" rx="4" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="140" y="116" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${t(title)}</text>
  <text x="140" y="128" font-size="9" fill="#666" text-anchor="middle">${subtitle}</text>`;

  s += `</svg>`;
  return s;
}

function buildPrintSVG(planets, navamsa, title, subtitle, t) {
  const chartStyle = localStorage.getItem("vaiswanara_chart_style") || "south";
  if (chartStyle === "north") {
    return buildPrintNorthSvg(planets, navamsa, title, subtitle, t);
  }

  const W = 280,
    cell = 70;
  const siGrid = [
    [12, 1, 2, 3],
    [11, null, null, 4],
    [10, null, null, 5],
    [9, 8, 7, 6],
  ];

  const rashiPlanets = {};
  for (let r = 1; r <= 12; r++) rashiPlanets[r] = [];
  let lagnaRashi = planets["Ascendant"]?.rashi ?? 1;
  if (navamsa && navamsa["Ascendant"]) lagnaRashi = navamsa["Ascendant"].rashi;

  for (const [name, pd] of Object.entries(planets)) {
    const rashi = navamsa ? (navamsa[name]?.rashi ?? pd.rashi) : pd.rashi;
    if (!rashiPlanets[rashi]) rashiPlanets[rashi] = [];
    rashiPlanets[rashi].push(name);
  }

  let s = `<svg width="${W}px" height="${W}px" viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;">
    <rect width="${W}" height="${W}" fill="white" stroke="#111" stroke-width="1.5"/>`;

  for (let i = 0; i <= 4; i++) {
    s += `<line x1="${i * cell}" y1="0" x2="${i * cell}" y2="${W}" stroke="#333" stroke-width="0.8"/>`;
    s += `<line x1="0" y1="${i * cell}" x2="${W}" y2="${i * cell}" stroke="#333" stroke-width="0.8"/>`;
  }
  s += `<rect x="${cell}" y="${cell}" width="${2 * cell}" height="${2 * cell}" fill="#fdfcf8" stroke="#111" stroke-width="1.2"/>`;

  if (title) {
    if (subtitle) {
      s += `<text x="${W / 2}" y="${W / 2 - 8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${title}</text>`;
      s += `<text x="${W / 2}" y="${W / 2 + 12}" font-size="12" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${subtitle}</text>`;
    } else {
      s += `<text x="${W / 2}" y="${W / 2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${title}</text>`;
    }
  }

  const shortNames = {
    Sun: "Su",
    Moon: "Ch",
    Mars: "Ku",
    Mercury: "Bu",
    Jupiter: "Gu",
    Venus: "Sk",
    Saturn: "Sa",
    Rahu: "Ra",
    Ketu: "Ke",
    Ascendant: "Lg",
  };

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const rashi = siGrid[row][col];
      if (rashi === null) continue;
      const cx = col * cell,
        cy = row * cell;
      const isLagna = rashi === lagnaRashi;

      if (isLagna)
        s += `<rect x="${cx + 1}" y="${cy + 1}" width="${cell - 2}" height="${cell - 2}" fill="rgba(108, 92, 231, 0.1)"/>`;
      if (isLagna)
        s += `<text x="${cx + 3}" y="${cy + cell - 4}" font-weight="bold" font-size="14" fill="#6c5ce7">${t("Lg")}</text>`;

      const plist = rashiPlanets[rashi].filter((p) => p !== "Ascendant");
      if (plist.length > 0) {
        const rowHeight = 17;
        const rows = [];
        for (let i = 0; i < plist.length; i += 2)
          rows.push(plist.slice(i, i + 2));
        const startY = cy + cell / 2 - ((rows.length - 1) * rowHeight) / 2 + 5;

        rows.forEach((rGroup, rowIdx) => {
          const y = startY + rowIdx * rowHeight;
          rGroup.forEach((p, colIdx) => {
            const retro = planets[p]?.retrograde;
            const combust = planets[p]?.combust;
            const text = t(shortNames[p] || p);
            const color = retro ? "#d35400" : combust ? "#8e44ad" : "#2d3436";
            const weight = combust || retro ? "bold" : "normal";
            let x = cx + cell / 2;
            if (rGroup.length === 2)
              x = colIdx === 0 ? cx + cell / 2 - 16 : cx + cell / 2 + 16;
            s += `<text x="${x}" y="${y}" font-size="14" font-weight="${weight}" text-anchor="middle" fill="${color}">${text}</text>`;
            if (retro)
              s += `<text x="${x + 10}" y="${y - 5}" font-size="6.5" font-weight="bold" fill="#d35400">R</text>`;
            if (combust)
              s += `<text x="${x + 10}" y="${y + 6}" font-size="6.5" font-weight="bold" fill="#8e44ad">C</text>`;
          });
        });
      }
    }
  }
  s += "</svg>";
  return s;
}

function buildAkvPrintSVG(data, title, subtitle, t, isSav = false) {
  if (!data) return "";
  const W = 280, cell = 70;
  const siGrid = [
    [12, 1, 2, 3],
    [11, null, null, 4],
    [10, null, null, 5],
    [9, 8, 7, 6],
  ];

  let s = `<svg viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif; width: 100%; height: auto;">
    <rect width="${W}" height="${W}" fill="white" stroke="#111" stroke-width="1.5"/>`;

  for (let i = 0; i <= 4; i++) {
    s += `<line x1="${i * cell}" y1="0" x2="${i * cell}" y2="${W}" stroke="#333" stroke-width="0.8"/>`;
    s += `<line x1="0" y1="${i * cell}" x2="${W}" y2="${i * cell}" stroke="#333" stroke-width="0.8"/>`;
  }
  s += `<rect x="${cell}" y="${cell}" width="${2 * cell}" height="${2 * cell}" fill="#f9f0ff" stroke="#111" stroke-width="1.2"/>`;

  s += `<text x="${W / 2}" y="${W / 2 - 8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${title}</text>`;
  s += `<text x="${W / 2}" y="${W / 2 + 12}" font-size="10" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${subtitle}</text>`;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const rashi = siGrid[row][col];
      if (rashi === null) continue;
      const cx = col * cell, cy = row * cell;
      const pts = isSav ? (data[rashi]?.points ?? 0) : (data[rashi] ?? 0);
      let color = "#2d3436";
      let weight = "bold";
      if (isSav) {
        if (pts >= 28) color = "#27ae60";
        else if (pts < 20) color = "#c0392b";
      } else {
        if (pts >= 5) color = "#27ae60";
        else if (pts <= 2) color = "#c0392b";
      }
      s += `<text x="${cx + cell / 2}" y="${cy + cell / 2 + 5}" font-size="20" font-weight="${weight}" text-anchor="middle" fill="${color}">${pts}</text>`;
    }
  }
  s += `</svg>`;
  return s;
}

export function HoroscopePageNew({ logoUrl, onNavigate }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(() => {
    const loadProfileStr = sessionStorage.getItem("vaiswanara_load_profile");
    if (loadProfileStr) {
      try {
        const profile = JSON.parse(loadProfileStr);
        if (profile && profile.dob) {
          return {
            name: profile.name || "",
            dob: profile.dob,
            tob: profile.tob || "12:00",
            city: profile.city || "",
            latitude: profile.latitude || "",
            longitude: profile.longitude || "",
            timezone: profile.timezone || "5.5",
            gender: profile.gender || "male",
          };
        }
      } catch (e) {
        console.error("Failed to parse loaded profile", e);
      }
    }

    const savedLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null",
    );
    return {
      name: "",
      dob: getTodayDate(),
      tob: getCurrentTime(),
      city: savedLoc?.city || "Bengaluru, India",
      latitude: savedLoc?.latitude || "12.9716",
      longitude: savedLoc?.longitude || "77.5946",
      timezone: savedLoc?.timezone || "5.5",
      gender: "male",
    };
  });

  const [showPopup, setShowPopup] = useState(false);
  const [editFormData, setEditFormData] = useState(formData);
  const [profiles, setProfiles] = useState({});
  const [popupTab, setPopupTab] = useState("input");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("natal");

  const [chartData, setChartData] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "" });
  const cacheRef = useRef({});

  const handlePdfAction = async (action = "download") => {
    if (!chartData) return;
    setStatus({ loading: true, error: "" });

    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error("Failed to load html2canvas"));
          document.head.appendChild(script);
        });
      }
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load jspdf"));
          document.head.appendChild(script);
        });
      }

      // Generate SVGs
      const d1Svg = buildPrintSVG(
        chartData.planets,
        null,
        t("Rasi Chakra"),
        "(D1)",
        t
      );
      const d9Svg = buildPrintSVG(
        chartData.planets,
        chartData.navamsa_d9,
        t("Navamsha"),
        "(D9)",
        t
      );

      // Generate Graha Table Rows
      const grahaRows = Object.entries(chartData.planets)
        .filter(([, planet]) => planet && planet.rashi)
        .map(([name, planet]) => {
          const retro = planet.retrograde ? ` <span style="color:#d35400; font-weight:bold;">R</span>` : "";
          const combust = planet.combust ? ` <span style="color:#8e44ad; font-weight:bold;">C</span>` : "";
          return `
            <tr style="border-bottom: 1px solid #dfe6e9;">
              <td style="padding: 5px 8px; text-align: left; font-weight: bold; color: #2d3436;">${t(name)}${retro}${combust}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${formatDegree(planet.degree)}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${planet.nakshatra ? t(planet.nakshatra) : "-"}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${planet.pada || "-"}</td>
            </tr>
          `;
        })
        .join("");

      // Generate Shadbala Table Rows
      const shadbalaOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
      const shadbalaRows = chartData.shadabala ? shadbalaOrder.map((p) => {
        if (!chartData.shadabala[p]) return "";
        const d = chartData.shadabala[p];
        return `
          <tr style="border-bottom: 1px solid #dfe6e9;">
            <td style="padding: 6px 10px; font-weight: bold; color: #2d3436;">${t(p)}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.sthana_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.dig_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.kala_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.chesta_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.naisargika_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${d.drig_bala}</td>
            <td style="padding: 6px 10px; font-weight: bold; color: #8e44ad; text-align: center;">${d.total_rupas}</td>
          </tr>
        `;
      }).join("") : "";

      // Generate Dasha 3x3 Grid
      let dashaGridHtml = "";
      if (chartData.dashas) {
        const gridItems = chartData.dashas.map(md => {
          const mdLord = md.planet || md.lord || md.name || "-";
          const mdEnd = md.end || md.end_date || "-";
          
          const adRows = (md.antardashas || []).map((ad, idx, arr) => {
            const adLord = ad.planet || ad.lord || ad.name || "-";
            const adEnd = ad.end || ad.end_date || "-";
            const isLast = idx === arr.length - 1;
            return `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: ${isLast ? 'none' : '1px dashed #f1f2f6'};">
                <span>${t(adLord)}</span>
                <span style="color: #7f8c8d;">${adEnd}</span>
              </div>
            `;
          }).join("");

          return `
            <div style="border: 1px solid #dfe6e9; border-radius: 6px; overflow: hidden; background: #fff; font-size: 8.5pt; display: flex; flex-direction: column;">
              <div style="background: #f1f2f6; padding: 6px 10px; display: flex; justify-content: space-between; font-weight: bold; color: #2d3436; border-bottom: 1px solid #dfe6e9;">
                <span>${t(mdLord)}</span>
                <span>${mdEnd}</span>
              </div>
              <div style="padding: 4px 10px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                ${adRows}
              </div>
            </div>
          `;
        }).join("");
        
        dashaGridHtml = `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            ${gridItems}
          </div>
        `;
      }

      // Generate Ashtakavarga SVG Charts
      let akvGridHtml = "";
      if (chartData.ashtakavarga) {
        const savData = chartData.ashtakavarga.sarvashtakavarga || {};
        const bavData = chartData.ashtakavarga.prastarashtakavarga || {};
        
        const savSvg = buildAkvPrintSVG(savData, "SAV", t("sarvashtakavarga", "(Sarvashtakavarga)"), t, true);
        const suBavSvg = buildAkvPrintSVG(bavData.Sun || {}, "Su BAV", t("Sun"), t, false);
        const moBavSvg = buildAkvPrintSVG(bavData.Moon || {}, "Ch BAV", t("Moon"), t, false);
        const maBavSvg = buildAkvPrintSVG(bavData.Mars || {}, "Ku BAV", t("Mars"), t, false);
        const meBavSvg = buildAkvPrintSVG(bavData.Mercury || {}, "Bu BAV", t("Mercury"), t, false);
        const juBavSvg = buildAkvPrintSVG(bavData.Jupiter || {}, "Gu BAV", t("Jupiter"), t, false);
        const veBavSvg = buildAkvPrintSVG(bavData.Venus || {}, "Sk BAV", t("Venus"), t, false);
        const saBavSvg = buildAkvPrintSVG(bavData.Saturn || {}, "Sa BAV", t("Saturn"), t, false);

        akvGridHtml = `
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;">
            <div>${savSvg}</div>
            <div>${suBavSvg}</div>
            <div>${moBavSvg}</div>
            <div>${maBavSvg}</div>
            <div>${meBavSvg}</div>
            <div>${juBavSvg}</div>
            <div>${veBavSvg}</div>
            <div>${saBavSvg}</div>
          </div>
        `;
      }

      const htmlContent = `
      <style>
        * { box-sizing: border-box; }
        .pdf-page { width: 794px; height: 1122px; padding: 40px; box-sizing: border-box; background: #fff; position: relative; font-family: 'Poppins', sans-serif; color: #2d3436; -webkit-text-size-adjust: none; }
        .header { text-align: center; border-bottom: 2px solid #2d3436; padding-bottom: 15px; margin-bottom: 20px; }
        .header img { height: 60px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 19pt; color: #2d3436; text-transform: uppercase; }
        .header h2 { margin: 5px 0; font-size: 14pt; color: #8e44ad; font-weight: 600; }
        .charts-row { display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; width: 100%; }
        .chart-col { width: 280px; display: flex; flex-direction: column; align-items: center; }
        .chart-col svg { width: 280px !important; height: 280px !important; display: block; }
        .pdf-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
        .pdf-table th { background: #f1f2f6; padding: 8px 12px; font-weight: bold; text-align: left; color: #2d3436; border-bottom: 1.5px solid #2d3436; }
        .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #dcdde1; padding-top: 8px; font-size: 8pt; color: #b2bec3; display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
      </style>
      <div id="pdf-render-wrapper" style="position: absolute; top: 0; left: 0; width: 794px; z-index: -9999; background: #fff;">
      
      <!-- PAGE 1: CHARTS & BIRTH DETAILS -->
      <div class="pdf-page">
        <div class="header" style="padding-bottom: 10px; margin-bottom: 15px;">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="height: 50px; margin-bottom: 5px;">` : ""}
          <h1 style="font-size: 18pt;">${t("personalHoroscope", "Personal Horoscope")}</h1>
          <h2 style="font-size: 13pt; margin: 2px 0;">${t("natalChart", "Natal Chart")}</h2>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px; font-size: 12pt; color: #2d3436;">
          <div style="font-weight: bold; margin-bottom: 6px;">
            ${formData.dob ? formData.dob.split('-').reverse().join('-') : '-'} &nbsp;&nbsp;&nbsp; ${formData.tob} &nbsp;&nbsp;&nbsp; ${formData.city ? formData.city.split(',')[0].trim() : '-'}
          </div>
          <div style="font-size: 11pt; color: #34495e;">
            ${formatPanchanga(chartData.panchanga, t)}
          </div>
          ${chartData.meta?.ayanamsha_name ? `<div style="font-size: 10pt; color: #7f8c8d; margin-top: 5px;"><strong>Ayanamsha:</strong> ${chartData.meta.ayanamsha_name} (${chartData.meta.ayanamsha}°)</div>` : ""}
        </div>
        
        <div class="charts-row" style="margin-bottom: 25px; gap: 20px;">
          <div class="chart-col">${d1Svg}</div>
          <div class="chart-col">${d9Svg}</div>
        </div>

        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:10px; font-size:12pt; text-transform:uppercase; text-align: center;">${t("grahaPositions", "Graha Positions")}</h2>
        <table class="pdf-table">
          <thead>
            <tr>
              <th style="width: 25%; padding: 6px 8px;">${t("Planet")}</th>
              <th style="width: 25%; text-align: center; padding: 6px 8px;">${t("Degree")}</th>
              <th style="width: 30%; text-align: center; padding: 6px 8px;">${t("Nakshatra")}</th>
              <th style="width: 20%; text-align: center; padding: 6px 8px;">${t("Pada")}</th>
            </tr>
          </thead>
          <tbody>
            ${grahaRows}
          </tbody>
        </table>

        <div class="footer">
          <span>${t("generatedBy", "e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page", "Page")} 1</span>
        </div>
      </div>

      <!-- PAGE 2: VIMSHOTTARI DASHA -->
      <div class="pdf-page">
        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:15px; font-size:12pt; text-transform:uppercase; text-align: center;">${t("vimshottariDasha", "Vimshottari Dasha (MD & AD)")}</h2>
        
        ${dashaGridHtml}
        
        <div class="footer">
          <span>${t("generatedBy", "e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page", "Page")} 2</span>
        </div>
      </div>

      <!-- PAGE 3: PLANETARY STRENGTH & ASHTAKAVARGA -->
      <div class="pdf-page">
        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:15px; font-size:12pt; text-transform:uppercase; text-align: center;">${t("planetaryStrengthAndAshtakavarga", "Planetary Strength & Ashtakavarga")}</h2>
        
        ${chartData.shadabala ? `
        <h3 style="color:#2d3436; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; text-align: center;">${t("Shadabala", "Shadabala Strength")}</h3>
        <table class="pdf-table" style="font-size: 8.5pt; margin-bottom: 45px;">
          <thead>
            <tr>
              <th>${t("Planet")}</th>
              <th style="text-align: center;">${t("Sthana")}</th>
              <th style="text-align: center;">${t("Dig")}</th>
              <th style="text-align: center;">${t("Kala")}</th>
              <th style="text-align: center;">${t("Chesta")}</th>
              <th style="text-align: center;">${t("Naisargika")}</th>
              <th style="text-align: center;">${t("Drig")}</th>
              <th style="text-align: center;">${t("Total")}</th>
            </tr>
          </thead>
          <tbody>
            ${shadbalaRows}
          </tbody>
        </table>
        ` : ""}

        ${chartData.ashtakavarga ? `
        <h3 style="color:#2d3436; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 15px 0; text-align: center;">${t("ashtakavarga", "Ashtakavarga Charts")}</h3>
        ${akvGridHtml}
        ` : ""}

        <div class="footer">
          <span>${t("generatedBy", "e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page", "Page")} 3</span>
        </div>
      </div>

      </div>`;

      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      const printContainer = document.createElement("div");
      printContainer.innerHTML = htmlContent;
      printContainer.style.position = "absolute";
      printContainer.style.top = "0";
      printContainer.style.left = "0";
      printContainer.style.width = "794px";
      document.body.appendChild(printContainer);

      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const pages = printContainer.querySelectorAll(".pdf-page");
        const pdf = new window.jspdf.jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        for (let i = 0; i < pages.length; i++) {
          const canvas = await window.html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 794,
            width: 794,
            height: 1122,
          });
          if (i > 0) pdf.addPage();
          const imgData = canvas.toDataURL("image/jpeg", 0.98);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        }

        const cleanName = (formData.name || "Horoscope").replace(/[^a-zA-Z0-9_.-]/g, "");
        const fName = `${cleanName}_Horoscope.pdf`;

        if (action === "share" && navigator.canShare) {
          const pdfBlob = pdf.output("blob");
          const file = new File([pdfBlob], fName, { type: "application/pdf" });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: "Personal Horoscope",
                text: `Here is the Personal Horoscope report for ${formData.name || "myself"} generated via e-Jyotisha.`,
                files: [file],
              });
            } catch (shareErr) {
              if (shareErr.name !== "AbortError") pdf.save(fName);
            }
          } else {
            alert(
              t(
                "shareNotSupported",
                "Share feature is not supported on your browser. Downloading instead...",
              )
            );
            pdf.save(fName);
          }
        } else {
          pdf.save(fName);
        }
      } finally {
        document.body.removeChild(printContainer);
        window.scrollTo(0, originalScrollY);
      }
      setStatus({ loading: false, error: "" });
    } catch (err) {
      console.error("PDF Error:", err);
      setStatus({ loading: false, error: "Failed to generate PDF." });
    }
  };

  const loadChart = async (dataToFetch) => {
    const cacheKey = JSON.stringify(dataToFetch);
    if (cacheRef.current[cacheKey]) {
      setChartData(cacheRef.current[cacheKey]);
      return;
    }

    setStatus({ loading: true, error: "" });
    try {
      const result = await fetchBirthChart(dataToFetch);
      if (result?.planets) {
        if (result.planets["Rahu"]) result.planets["Rahu"].retrograde = false;
        if (result.planets["Ketu"]) result.planets["Ketu"].retrograde = false;
      }
      const divs = ["navamsa_d9", "d2", "d3", "d4", "d7", "d10", "d12", "d16", "d20", "d24", "d27", "d30", "d60"];
      divs.forEach((div) => {
        if (result?.[div]) {
          if (result[div]["Rahu"]) result[div]["Rahu"].retrograde = false;
          if (result[div]["Ketu"]) result[div]["Ketu"].retrograde = false;
        }
      });
      cacheRef.current[cacheKey] = result;
      setChartData(result);
      setStatus({ loading: false, error: "" });
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    loadChart(formData);
  }, []);

  const handleOpenPopup = () => {
    const savedProfiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    setProfiles(savedProfiles);
    setEditFormData(formData);
    setPopupTab("input");
    setSearchQuery("");
    setShowPopup(true);
  };

  const handleProfileSelect = (name) => {
    const profile = profiles[name];
    if (profile) {
      setEditFormData({
        ...editFormData,
        name: name,
        dob: profile.dob,
        tob: profile.tob,
        city: profile.city,
        latitude: profile.latitude,
        longitude: profile.longitude,
        timezone: profile.timezone,
        gender: profile.gender || "male",
      });
      setPopupTab("input");
    }
  };

  const handleSave = () => {
    setFormData(editFormData);
    setShowPopup(false);
    loadChart(editFormData);
  };

  const handleNewDetails = () => {
    sessionStorage.removeItem("vaiswanara_load_profile");
    const savedLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null",
    );
    setEditFormData({
      name: "",
      dob: getTodayDate(),
      tob: getCurrentTime(),
      city: savedLoc?.city || "Bengaluru, India",
      latitude: savedLoc?.latitude || "12.9716",
      longitude: savedLoc?.longitude || "77.5946",
      timezone: savedLoc?.timezone || "5.5",
      gender: "male",
    });
    setPopupTab("input");
  };

  const handleSaveProfile = () => {
    const profileName = editFormData.name?.trim();
    if (!profileName) {
      alert("Please enter a Name to save this profile.");
      return;
    }
    const currentProfiles = { ...profiles };
    const { ...profileDataToSave } = editFormData;
    currentProfiles[profileName] = profileDataToSave;

    localStorage.setItem(
      "vaiswanara_profiles",
      JSON.stringify(currentProfiles),
    );
    setProfiles(currentProfiles); // Update the list in the 'Saved Profiles' tab
    alert(`Profile "${profileName}" saved successfully!`);
  };

  return (
    <main
      className="new-horo-page"
      style={{
        background: "transparent",
        minHeight: "100vh",
      }}
    >
      <style>{`
        /* Flat layout overrides for new horoscope page */
        html, body, #root, .app-shell {
          background: #f5f6f8 !important;
        }
        .new-horo-page {
          padding: 15px !important;
          margin: 0 auto !important;
          width: 100% !important;
          max-width: 1200px !important;
          box-sizing: border-box !important;
        }
        @media (max-width: 1024px) {
          .new-horo-page { width: 95% !important; }
        }
        @media (max-width: 860px) {
          .new-horo-page { 
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        @media (max-width: 768px) {
          .new-horo-page { 
            width: 100% !important; 
            padding: 10px !important; 
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        .new-horo-page .workspace {
          padding: 0 !important;
          margin: 0 !important;
          gap: 15px !important;
          width: 100% !important;
        }

        /* Responsive Layout for Charts & Tables */
        .new-horo-page .charts-table-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
          align-items: start !important;
        }
        
        .new-horo-page .shadbala-akv-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
        }
        
        /* Unwrap RashiChart to make D1 and D9 direct grid items */
        .new-horo-page .charts-table-row > .chart-panel {
          display: contents !important;
        }
        .new-horo-page .charts-table-row > .chart-panel > div {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 10px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          max-width: none !important;
          box-sizing: border-box !important;
        }
        
        .new-horo-page .charts-table-row .table-panel {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }
        
        .new-horo-page .charts-table-row .table-panel .table-scroll {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow-y: auto !important;
        }
        
        .new-horo-page .charts-table-row .table-panel table {
          height: 100% !important;
        }
        
        @media (max-width: 1024px) {
          .new-horo-page .charts-table-row,
          .new-horo-page .shadbala-akv-row {
            grid-template-columns: 1fr !important;
          }
          .new-horo-page .charts-table-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .new-horo-page .charts-table-row > .table-panel {
            grid-column: 1 / -1 !important;
          }
          .new-horo-page .charts-table-row .table-panel {
            height: auto !important;
          }
          .new-horo-page .charts-table-row .table-panel .table-scroll {
            flex: initial !important;
            overflow-y: initial !important;
          }
          .new-horo-page .charts-table-row .table-panel table {
            height: auto !important;
          }
        }
        
        @media (max-width: 768px) {
          .new-horo-page .charts-table-row {
            grid-template-columns: 1fr !important;
          }
          .new-horo-page .charts-table-row > .table-panel {
            grid-column: auto !important;
          }
          .new-horo-page th {
            padding: 6px 8px !important;
            font-size: 12px !important;
          }
          .new-horo-page td {
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
        }

        /* CARD STYLES */
        .new-horo-page .table-panel,
        .new-horo-page .prediction-panel,
        .new-horo-page .chart-panel {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 10px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        .new-horo-page .prediction-panel {
          padding: 16px 10px !important;
        }

        /* Dasha panel specific overrides to remove card styling */
        .new-horo-page .dasha-panel {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* TYPOGRAPHY */
        .new-horo-page h2, .new-horo-page h3 {
          font-weight: 600 !important;
          font-size: 18px !important;
          color: #2c3e50 !important;
          background: transparent !important;
          padding: 0 0 12px 0 !important;
          margin: 0 !important;
          margin-bottom: 15px !important;
          text-align: left !important;
          text-transform: none !important;
          border-bottom: 1px solid #f1f2f6 !important;
        }

        .new-horo-page .prediction-panel {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 8px !important;
        }
        .new-horo-page .prediction-panel h2 {
          min-width: fit-content !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          border-bottom: none !important;
          white-space: nowrap !important;
          flex-shrink: 0 !important;
        }
        .new-horo-page .prediction-panel p {
          font-size: 14px !important;
          padding: 0 !important;
          margin: 0 !important;
          text-align: left !important;
          border-bottom: none !important;
          color: #34495e !important;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .new-horo-page .prediction-panel {
            flex-direction: column !important;
          }
          .new-horo-page .prediction-panel h2 {
            margin-bottom: 12px !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #f1f2f6 !important;
          }
        }
        .new-horo-page .dasha-panel .section-heading p.eyebrow,
        .new-horo-page .dasha-panel .section-heading span {
          display: none !important;
        }
        .new-horo-page .dasha-panel .section-heading {
          margin-bottom: 0 !important;
          display: block !important;
        }
        .new-horo-page .dasha-panel .section-heading h2 {
          border-bottom: 1px solid #f1f2f6 !important;
        }
        
        /* Charts spacing */
        .new-horo-page .chart-panel {
          gap: 12px !important;
          padding: 16px 10px !important;
        }
        .new-horo-page .south-chart {
          margin: 0 auto !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .new-horo-page .akv-planet-tabs {
          margin: 8px 0 15px 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .new-horo-page .akv-sarva-btn {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
          border: 2px solid #e0e0e0 !important;
          background: #f9f0ff !important;
          color: #8e44ad !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        .new-horo-page .akv-sarva-btn.active {
          background: #8e44ad !important;
          color: #fff !important;
          border-color: #8e44ad !important;
        }
        .new-horo-page .akv-sarva-btn:hover {
          border-color: #8e44ad !important;
          background: #f5e6ff !important;
        }
        .new-horo-page .akv-sarva-btn.active:hover {
          background: #7a3a92 !important;
        }
        .new-horo-page .akv-planet-tabs > div {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          justify-content: center !important;
        }
        .new-horo-page .akv-planet-btn {
          width: 42px !important;
          height: 40px !important;
          min-width: 42px !important;
          padding: 0 !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          border: 2px solid #e0e0e0 !important;
          background: #fff !important;
          color: #8e44ad !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .new-horo-page .akv-planet-btn.active {
          background: #8e44ad !important;
          color: #fff !important;
          border-color: #8e44ad !important;
        }
        .new-horo-page .akv-planet-btn:hover {
          border-color: #8e44ad !important;
          background: #f5e6ff !important;
        }
        .new-horo-page .akv-planet-btn.active:hover {
          background: #7a3a92 !important;
        }
        @media (max-width: 500px) {
          .new-horo-page .akv-planet-btn {
            width: 38px !important;
            height: 36px !important;
            min-width: 38px !important;
            font-size: 12px !important;
          }
        }

        /* TABLES */
        .new-horo-page .table-scroll {
          overflow-x: auto !important; 
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .new-horo-page table {
          width: auto !important;
          table-layout: auto !important;
          border-collapse: collapse !important;
          margin: 0 !important;
          min-width: unset !important;
          display: table !important;
        }
        .new-horo-page th {
          font-size: 13px !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 6px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: none !important;
          border-left: none !important;
          border-top: none !important;
          background: #fdfefe !important;
          white-space: nowrap !important;
          width: auto !important;
          display: table-cell !important;
        }
        .new-horo-page td {
          font-size: 13px !important;
          color: #2c3e50 !important;
          padding: 4px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: none !important;
          border-left: none !important;
          border-top: none !important;
          text-align: left !important;
          white-space: nowrap !important;
          width: auto !important;
          display: table-cell !important;
        }
        
        /* Shadbala visual bar */
        .new-horo-page .strength-bar {
          display: block !important;
          height: 6px !important;
          background: #ecf0f1 !important;
          border-radius: 4px !important;
          margin-bottom: 4px !important;
        }
        .new-horo-page .strength-bar-fill {
          height: 100% !important;
          background: #8e44ad !important;
          border-radius: 4px !important;
        }
        .new-horo-page .strength-val {
          font-weight: 600 !important;
          font-size: 13px !important;
          color: #2c3e50 !important;
        }

        /* Top Bar Card */
        .new-horo-page .top-bar-card {
          background: #ffffff !important;
          padding: 12px 16px !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
          margin-bottom: 15px;
          width: 100% !important;
          box-sizing: border-box !important;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .new-horo-page .top-bar-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          cursor: pointer;
          min-width: 0;
          transition: transform 0.1s ease-in-out;
        }
        .new-horo-page .top-bar-details:active {
          transform: scale(0.98);
        }

        @media (max-width: 600px) {
          .new-horo-page .top-bar-card {
            padding: 8px 12px !important;
            margin-bottom: 12px !important;
          }
          .new-horo-page .view-toggle-btn {
            height: 20px !important;
            padding: 0 8px !important;
            font-size: 9px !important;
            border-radius: 10px !important;
          }
        }

        /* STATUS BADGES for Graha */
        .new-horo-page td span[title="Retrograde"] {
          background: #e74c3c !important;
          color: #fff !important;
          padding: 2px 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          text-decoration: none !important;
          margin-left: 6px !important;
        }
        .new-horo-page td span[title="Combust"] {
          background: #f39c12 !important;
          color: #fff !important;
          padding: 2px 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          text-decoration: none !important;
          margin-left: 6px !important;
        }

        /* Popup Styles */
        .new-horo-page .popup-container {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); z-index: 1000;
          display: flex; justify-content: center; align-items: center;
          padding: 20px; backdrop-filter: blur(4px);
        }
        .new-horo-page .popup-content {
          background: #fff; padding: 30px; border-radius: 16px;
          width: 100%; max-width: 650px; max-height: 90vh;
          overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          .new-horo-page .popup-container { padding: 15px; }
          .new-horo-page .popup-content { padding: 20px; max-width: 100%; }
        }
        .new-horo-page .popup-tab {
          flex: 1;
          padding: 12px 10px;
          border: none;
          background: transparent;
          font-weight: 600;
          font-size: 15px;
          color: #7f8c8d;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .new-horo-page .popup-tab.active {
          color: #8e44ad;
          border-bottom: 2px solid #8e44ad;
        }
        .new-horo-page .profile-card {
          padding: 12px;
          border: 1px solid #eaecee;
          border-radius: 10px;
          cursor: pointer;
          background: #fdfefe;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .new-horo-page .profile-card:hover {
          background: #f5f6f8;
        }

        /* View Toggle Switch */
        .new-horo-page .view-toggle-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
          margin-top: 5px;
          width: 100%;
        }
        .new-horo-page .view-toggle {
          display: inline-flex;
          background: #f1f2f6;
          border-radius: 14px;
          padding: 2px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
        }
        .new-horo-page .view-toggle-btn {
          height: 24px !important;
          padding: 0 12px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7f8c8d;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .new-horo-page .view-toggle-btn.active {
          background: #ffffff;
          color: #8e44ad;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          transform: scale(1.02);
        }

        /* PDF and Share Buttons styling */
        .new-horo-page .export-panel {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-top: 15px !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .btn-pdf,
        .new-horo-page .btn-share {
          color: #fff !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          width: auto !important;
          transition: all 0.2s ease !important;
        }
        .new-horo-page .btn-pdf {
          background: #d63031 !important;
        }
        .new-horo-page .btn-pdf:hover {
          background: #c0392b !important;
        }
        .new-horo-page .btn-share {
          background: #27ae60 !important;
        }
        .new-horo-page .btn-share:hover {
          background: #219653 !important;
        }
        @media (max-width: 768px) {
          .new-horo-page .export-panel {
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          .new-horo-page .btn-pdf,
          .new-horo-page .btn-share {
            flex: 0 1 auto !important;
            width: auto !important;
            min-width: unset !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Top Bar showing Date, Time, Location */}
      <div className="top-bar-card">
        <div className="top-bar-details" onClick={handleOpenPopup}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#2c3e50",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span>📅 {formData.dob ? formData.dob.split('-').reverse().join('-') : ''}</span>
            <span>⏰ {formData.tob}</span>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#7f8c8d",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              marginTop: "3px",
            }}
          >
            📍 {formData.city}
          </div>
        </div>
        {chartData && !status.loading && (
          <div
            className="view-toggle-container"
            onClick={(e) => e.stopPropagation()}
            style={{ margin: 0, width: "auto" }}
          >
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${activeView === "natal" ? "active" : ""}`}
                onClick={() => setActiveView("natal")}
              >
                {t("Natal", "Natal")}
              </button>
              <button
                className={`view-toggle-btn ${activeView === "transit" ? "active" : ""}`}
                onClick={() => setActiveView("transit")}
              >
                {t("Transit", "Transit")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#7f8c8d", marginTop: "-8px", marginBottom: "12px" }}>
        ℹ️ Click on the card above to change date, time, or location details.
      </div>

      {/* Workspace Area for Chart Details */}
      <section
        className="workspace"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {status.error && (
          <div
            className="message error"
            style={{
              background: "#fdedec",
              color: "#c0392b",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #f5b7b1",
              textAlign: "center",
            }}
          >
            {status.error}
          </div>
        )}
        {status.loading && (
          <div
            className="message"
            style={{
              background: "#ffffff",
              color: "#2c3e50",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              textAlign: "center",
              border: "1px solid #eaecee",
              margin: "0 15px",
            }}
          >
            ⏳ {t("processingWait", "Processing...")}
          </div>
        )}

        {chartData && !status.loading && (
          <>

            {activeView === "natal" && (
              <>
                {/* 1. D1, D9 Charts and Graha Table - All in one row on Desktop */}
                <div className="charts-table-row">
                  <RashiChart
                    planets={chartData.planets}
                    navamsa={chartData.navamsa_d9}
                    d2={chartData.d2}
                    d3={chartData.d3}
                    d4={chartData.d4}
                    d7={chartData.d7}
                    d10={chartData.d10}
                    d12={chartData.d12}
                    d16={chartData.d16}
                    d20={chartData.d20}
                    d24={chartData.d24}
                    d27={chartData.d27}
                    d30={chartData.d30}
                    d60={chartData.d60}
                    d1Footer={
                      <div style={{ textAlign: "center", fontSize: "12px", color: "#7f8c8d", marginTop: "10px" }}>
                        <strong>Ayanamsha:</strong> {chartData?.meta?.ayanamsha_name ? `${chartData.meta.ayanamsha_name} (${chartData.meta.ayanamsha}°)` : (() => {
                          const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
                          const ayanamshaNames = {
                            lahiri: "Lahiri (Chitra Paksha)",
                            raman: "Raman",
                            krishnamurti: "Krishnamurti (KP)",
                            yukteshwar: "Sri Yukteshwar",
                            true_citra: "True Citra",
                            fagan_bradley: "Fagan/Bradley",
                            custom: `Custom (${prefs.ayanamsha_val}°)`,
                          };
                          return ayanamshaNames[prefs.ayanamsha_type || "lahiri"] || "Lahiri";
                        })()}
                      </div>
                    }
                    d9Footer={
                      <div className="export-panel">
                        <button
                          className="btn-pdf"
                          onClick={() => handlePdfAction("download")}
                          title={t("downloadPdf", "Download PDF Report")}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          {t("pdf", "PDF")}
                        </button>
                        <button
                          className="btn-share"
                          onClick={() => handlePdfAction("share")}
                          title={t("sharePdf", "Share PDF Report")}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          {t("share", "Share")}
                        </button>
                      </div>
                    }
                  />
                  <GrahaTable planets={chartData.planets} hideTitle={true} />
                </div>

                {/* 2. Panchanga Section */}
                <PredictionPanel
                  title={t("Panchanga", "Panchanga")}
                  text={formatPanchanga(chartData.panchanga, t)}
                />

                {/* 3. Vimshottari Dasa */}
                <DashaTree dashas={chartData.dashas} />

                {/* 4. Shadbala and Ashtakavarga - Side by Side on Desktop */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    width: "100%",
                  }}
                  className="shadbala-akv-row"
                >
                  <ShadabalaTable shadabala={chartData.shadabala} />
                  <AshtakavargaTable
                    ashtakavarga={chartData.ashtakavarga}
                    lagnaRashi={chartData.planets?.Ascendant?.rashi ?? 1}
                  />
                </div>
              </>
            )}

            {activeView === "transit" && (
              <TransitTab natalData={chartData} formData={formData} />
            )}
          </>
        )}
      </section>

      {/* Popup Modal for editing details */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <h3
              style={{
                marginTop: 0,
                color: "#8e44ad",
                borderBottom: "2px solid #f1f2f6",
                paddingBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>✏️ Change Details</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleNewDetails}
                  style={{
                    background: "#ebf5fb",
                    border: "1px solid #3498db",
                    color: "#3498db",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    minHeight: "auto",
                    lineHeight: "1",
                  }}
                >
                  {t("new", "New")}
                </button>
                <span
                  style={{
                    cursor: "pointer",
                    background: "#f8f9fa",
                    padding: "4px 8px",
                    borderRadius: "50%",
                    fontSize: "14px",
                  }}
                  onClick={() => setShowPopup(false)}
                >
                  ❌
                </span>
              </div>
            </h3>

            {/* Tabs Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #eaecee",
                marginBottom: "15px",
              }}
            >
              <button
                className={`popup-tab ${popupTab === "input" ? "active" : ""}`}
                onClick={() => setPopupTab("input")}
              >
                Manual Entry
              </button>
              <button
                className={`popup-tab ${popupTab === "profiles" ? "active" : ""}`}
                onClick={() => setPopupTab("profiles")}
              >
                Saved Profiles
              </button>
            </div>

            {popupTab === "input" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 2,
                    }}
                  >
                    Name (to Save Profile):
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      placeholder="Enter name here..."
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dcdde1",
                        fontSize: "15px",
                        outline: "none",
                        background: "#fdfefe",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    Gender:
                    <select
                      value={editFormData.gender || "male"}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          gender: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dcdde1",
                        fontSize: "15px",
                        outline: "none",
                        background: "#fdfefe",
                        height: "41px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    Date:
                    <input
                      type="date"
                      value={editFormData.dob}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dob: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dcdde1",
                        fontSize: "15px",
                        outline: "none",
                        background: "#fdfefe",
                      }}
                      required
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    Time:
                    <input
                      type="time"
                      value={editFormData.tob}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          tob: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dcdde1",
                        fontSize: "15px",
                        outline: "none",
                        background: "#fdfefe",
                      }}
                      required
                    />
                  </label>
                </div>

                <LocationAutocomplete
                  city={editFormData.city}
                  onLocationSelect={(loc) =>
                    setEditFormData({
                      ...editFormData,
                      city: loc.city,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      timezone: loc.timezone,
                    })
                  }
                />

                <details
                  style={{
                    marginTop: "-10px",
                    fontSize: "14px",
                    background: "#fdfefe",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#3498db",
                      fontWeight: "bold",
                      outline: "none",
                      listStyle: "none",
                    }}
                  >
                    Manual Coordinates (Lat / Lon / Tz)
                  </summary>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <label
                      style={{
                        flex: 1,
                        fontSize: "0.85rem",
                        color: "#636e72",
                      }}
                    >
                      Lat:
                      <input
                        type="text"
                        name="latitude"
                        style={{
                          width: "100%",
                          padding: "8px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                        value={editFormData.latitude || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            latitude: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label
                      style={{
                        flex: 1,
                        fontSize: "0.85rem",
                        color: "#636e72",
                      }}
                    >
                      Lon:
                      <input
                        type="text"
                        name="longitude"
                        style={{
                          width: "100%",
                          padding: "8px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                        value={editFormData.longitude || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            longitude: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label
                      style={{
                        flex: 1,
                        fontSize: "0.85rem",
                        color: "#636e72",
                      }}
                    >
                      Tz:
                      <input
                        type="text"
                        name="timezone"
                        style={{
                          width: "100%",
                          padding: "8px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                        value={editFormData.timezone || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            timezone: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                </details>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1,
                      background: "#27ae60",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(39, 174, 96, 0.2)",
                    }}
                    title="Save the current details as a new profile"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #8e44ad, #9b59b6)",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(142, 68, 173, 0.3)",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {popupTab === "profiles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder={t("searchProfiles", "Search profiles...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #8e44ad",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "#fdfefe",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    padding: "5px 0",
                  }}
                >
                  {Object.keys(profiles).filter((name) => {
                    const q = searchQuery.trim().toLowerCase();
                    return q === "" ||
                      name.toLowerCase().includes(q) ||
                      (profiles[name].city || "").toLowerCase().includes(q);
                  }).length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#7f8c8d",
                        padding: "20px 0",
                      }}
                    >
                      No saved profiles found.
                    </p>
                  ) : (
                    Object.keys(profiles)
                      .filter((name) => {
                        const q = searchQuery.trim().toLowerCase();
                        return q === "" ||
                          name.toLowerCase().includes(q) ||
                          (profiles[name].city || "").toLowerCase().includes(q);
                      })
                      .map((name) => (
                        <div
                          key={name}
                          className="profile-card"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "left",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        >
                          <div
                            onClick={() => handleProfileSelect(name)}
                            style={{ flex: 1, cursor: "pointer", padding: "4px 0", textAlign: "left" }}
                          >
                            <strong style={{ color: "#2c3e50", fontSize: "15px", display: "block", marginBottom: "4px", textAlign: "left" }}>
                              {name}
                            </strong>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#7f8c8d",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                textAlign: "left",
                              }}
                            >
                              <span>📅 {profiles[name].dob ? profiles[name].dob.split('-').reverse().join('-') : ''}</span>
                              <span>⏰ {profiles[name].tob || ''}</span>
                              <span>📍 {profiles[name].city ? profiles[name].city.split(',')[0].trim() : ''}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProfileSelect(name);
                              }}
                              title="Edit"
                              style={{
                                background: "#ebf5fb",
                                border: "1px solid #3498db",
                                color: "#3498db",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "auto",
                                padding: 0,
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete the profile "${name}"?`,
                                  )
                                ) {
                                  const currentProfiles = { ...profiles };
                                  delete currentProfiles[name];
                                  setProfiles(currentProfiles);
                                  localStorage.setItem(
                                    "vaiswanara_profiles",
                                    JSON.stringify(currentProfiles),
                                  );
                                }
                              }}
                              title="Delete"
                              style={{
                                background: "#fdedec",
                                border: "1px solid #e74c3c",
                                color: "#e74c3c",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "auto",
                                padding: 0,
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
