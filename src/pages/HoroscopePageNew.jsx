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
  const keyMap = {
    Makha: "Magha",
    Garija: "Gara",
    Garaja: "Gara",
    Pratipada: "Prathama",
    Pratipath: "Prathama",
    Dwadashi: "Dvadashi",
    Shasthi: "Shashthi",
    Pournami: "Purnima",
    Pournima: "Purnima",
    Amavasai: "Amavasya",
  };

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

function buildPrintEastSvg(planets, navamsa, title, subtitle, t) {
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

  const EAST_INDIAN_LAYOUT = {
    1: { rashi: { x: 150, y: 25 }, planets: { x: 150, y: 60 }, polygon: "100,0 200,0 200,100 100,100" },
    2: { rashi: { x: 75, y: 25 }, planets: { x: 65, y: 50 }, polygon: "0,0 100,0 100,100" },
    3: { rashi: { x: 25, y: 75 }, planets: { x: 45, y: 65 }, polygon: "0,0 0,100 100,100" },
    4: { rashi: { x: 50, y: 125 }, planets: { x: 50, y: 160 }, polygon: "0,100 100,100 100,200 0,200" },
    5: { rashi: { x: 25, y: 225 }, planets: { x: 45, y: 245 }, polygon: "0,200 100,200 0,300" },
    6: { rashi: { x: 75, y: 275 }, planets: { x: 65, y: 250 }, polygon: "100,200 0,300 100,300" },
    7: { rashi: { x: 150, y: 275 }, planets: { x: 150, y: 240 }, polygon: "100,200 200,200 200,300 100,300" },
    8: { rashi: { x: 225, y: 275 }, planets: { x: 235, y: 250 }, polygon: "200,200 200,300 300,300" },
    9: { rashi: { x: 275, y: 225 }, planets: { x: 255, y: 245 }, polygon: "200,200 300,200 300,300" },
    10: { rashi: { x: 250, y: 125 }, planets: { x: 250, y: 160 }, polygon: "200,100 300,100 300,200 200,200" },
    11: { rashi: { x: 275, y: 75 }, planets: { x: 255, y: 65 }, polygon: "200,100 300,100 300,0" },
    12: { rashi: { x: 225, y: 25 }, planets: { x: 235, y: 50 }, polygon: "200,0 200,100 300,0" }
  };

  let s = `<svg width="${W}px" height="${W}px" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff;">
    <rect width="300" height="300" fill="white" stroke="#8e44ad" stroke-width="1.5"/>`;

  for (let r = 1; r <= 12; r++) {
    const pos = EAST_INDIAN_LAYOUT[r];
    const isLagna = r === lagnaRashi;
    const fill = isLagna ? "rgba(142, 68, 173, 0.08)" : "none";

    s += `<polygon points="${pos.polygon}" fill="${fill}" stroke="#ccc" stroke-width="1"/>`;

    if (isLagna) {
      s += `<line x1="${pos.rashi.x + 8}" y1="${pos.rashi.y - 12}" x2="${pos.rashi.x + 18}" y2="${pos.rashi.y - 2}" stroke="#8e44ad" stroke-width="1.5" opacity="0.6"/>`;
      s += `<line x1="${pos.rashi.x + 12}" y1="${pos.rashi.y - 12}" x2="${pos.rashi.x + 22}" y2="${pos.rashi.y - 2}" stroke="#8e44ad" stroke-width="1.5" opacity="0.6"/>`;
    }

    s += `<text x="${pos.rashi.x}" y="${pos.rashi.y}" font-size="10" font-weight="bold" fill="${isLagna ? "#8e44ad" : "#7f8c8d"}" text-anchor="middle" dominant-baseline="middle">${r}</text>`;

    const housePlanets = Object.entries(activePlanets)
      .filter(([name, p]) => p.rashi === r)
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
          s += `<text x="${x}" y="${y}" font-size="10" font-weight="900" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}`;
          if (planet.retrograde) s += "R";
          if (planet.combust) s += "c";
          s += `</text>`;
        });
      });
    }
  }

  s += `<rect x="100" y="100" width="100" height="100" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="150" y="145" font-size="10.5" font-weight="bold" fill="#8e44ad" text-anchor="middle">${t(title)}</text>
  <text x="150" y="160" font-size="9.5" fill="#666" text-anchor="middle">${subtitle}</text>`;

  s += `</svg>`;
  return s;
}

function buildPrintSVG(planets, navamsa, title, subtitle, t) {
  const chartStyle = localStorage.getItem("vaiswanara_chart_style") || "south";
  if (chartStyle === "north") {
    return buildPrintNorthSvg(planets, navamsa, title, subtitle, t);
  }
  if (chartStyle === "east") {
    return buildPrintEastSvg(planets, navamsa, title, subtitle, t);
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

function buildAkvPrintNorthSvg(data, title, subtitle, t, isSav = false, lagnaRashi = 1) {
  const W = 280;
  let s = `<svg width="${W}px" height="${W}px" viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff; width: 100%; height: auto;">
    <rect width="${W}" height="${W}" fill="white" stroke="#8e44ad" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="${W}" y2="${W}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${W}" x2="${W}" y2="0" stroke="#ccc" stroke-width="1"/>
    <line x1="${W/2}" y1="0" x2="0" y2="${W/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${W/2}" x2="${W/2}" y2="${W}" stroke="#ccc" stroke-width="1"/>
    <line x1="${W/2}" y1="${W}" x2="${W}" y2="${W/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="${W}" y1="${W/2}" x2="${W/2}" y2="0" stroke="#ccc" stroke-width="1"/>`;

  const layout = {
    1: { rashi: { x: 140, y: 35 }, pts: { x: 140, y: 70 } },
    2: { rashi: { x: 70, y: 22 }, pts: { x: 70, y: 55 } },
    3: { rashi: { x: 22, y: 70 }, pts: { x: 55, y: 70 } },
    4: { rashi: { x: 35, y: 140 }, pts: { x: 70, y: 140 } },
    5: { rashi: { x: 22, y: 210 }, pts: { x: 55, y: 210 } },
    6: { rashi: { x: 70, y: 258 }, pts: { x: 70, y: 225 } },
    7: { rashi: { x: 140, y: 245 }, pts: { x: 140, y: 210 } },
    8: { rashi: { x: 210, y: 258 }, pts: { x: 210, y: 225 } },
    9: { rashi: { x: 258, y: 210 }, pts: { x: 225, y: 210 } },
    10: { rashi: { x: 245, y: 140 }, pts: { x: 210, y: 140 } },
    11: { rashi: { x: 258, y: 70 }, pts: { x: 225, y: 70 } },
    12: { rashi: { x: 210, y: 22 }, pts: { x: 210, y: 55 } },
  };

  for (let h = 1; h <= 12; h++) {
    const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
    const pos = layout[h];

    s += `<text x="${pos.rashi.x}" y="${pos.rashi.y}" font-size="9" font-weight="bold" fill="#7f8c8d" text-anchor="middle" dominant-baseline="middle">${houseRashi}</text>`;

    const pts = isSav ? (data[houseRashi]?.points ?? 0) : (data[houseRashi] ?? 0);
    let color = "#2d3436";
    if (isSav) {
      if (pts >= 28) color = "#27ae60";
      else if (pts < 20) color = "#c0392b";
    } else {
      if (pts >= 5) color = "#27ae60";
      else if (pts <= 2) color = "#c0392b";
    }

    s += `<text x="${pos.pts.x}" y="${pos.pts.y}" font-size="16" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="middle">${pts}</text>`;
  }

  s += `<rect x="95" y="102" width="90" height="36" rx="4" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="140" y="116" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${title}</text>
  <text x="140" y="128" font-size="9" fill="#666" text-anchor="middle">${subtitle}</text>`;

  s += `</svg>`;
  return s;
}

function buildAkvPrintEastSvg(data, title, subtitle, t, isSav = false, lagnaRashi = 1) {
  const W = 280;
  const EAST_INDIAN_LAYOUT = {
    1: { rashi: { x: 150, y: 25 }, planets: { x: 150, y: 65 }, polygon: "100,0 200,0 200,100 100,100" },
    2: { rashi: { x: 75, y: 25 }, planets: { x: 65, y: 55 }, polygon: "0,0 100,0 100,100" },
    3: { rashi: { x: 25, y: 75 }, planets: { x: 45, y: 65 }, polygon: "0,0 0,100 100,100" },
    4: { rashi: { x: 50, y: 125 }, planets: { x: 50, y: 165 }, polygon: "0,100 100,100 100,200 0,200" },
    5: { rashi: { x: 25, y: 225 }, planets: { x: 45, y: 245 }, polygon: "0,200 100,200 0,300" },
    6: { rashi: { x: 75, y: 275 }, planets: { x: 65, y: 255 }, polygon: "100,200 0,300 100,300" },
    7: { rashi: { x: 150, y: 275 }, planets: { x: 150, y: 240 }, polygon: "100,200 200,200 200,300 100,300" },
    8: { rashi: { x: 225, y: 275 }, planets: { x: 235, y: 255 }, polygon: "200,200 200,300 300,300" },
    9: { rashi: { x: 275, y: 225 }, planets: { x: 255, y: 245 }, polygon: "200,200 300,200 300,300" },
    10: { rashi: { x: 250, y: 125 }, planets: { x: 250, y: 165 }, polygon: "200,100 300,100 300,200 200,200" },
    11: { rashi: { x: 275, y: 75 }, planets: { x: 255, y: 65 }, polygon: "200,100 300,100 300,0" },
    12: { rashi: { x: 225, y: 25 }, planets: { x: 235, y: 55 }, polygon: "200,0 200,100 300,0" }
  };

  let s = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif; width: 100%; height: auto;">
    <rect width="300" height="300" fill="white" stroke="#8e44ad" stroke-width="1.5"/>`;

  for (let r = 1; r <= 12; r++) {
    const pos = EAST_INDIAN_LAYOUT[r];
    const isLagna = r === lagnaRashi;
    const fill = isLagna ? "rgba(142, 68, 173, 0.08)" : "none";

    s += `<polygon points="${pos.polygon}" fill="${fill}" stroke="#ccc" stroke-width="1"/>`;

    if (isLagna) {
      s += `<line x1="${pos.rashi.x + 8}" y1="${pos.rashi.y - 12}" x2="${pos.rashi.x + 18}" y2="${pos.rashi.y - 2}" stroke="#8e44ad" stroke-width="1.5" opacity="0.6"/>`;
      s += `<line x1="${pos.rashi.x + 12}" y1="${pos.rashi.y - 12}" x2="${pos.rashi.x + 22}" y2="${pos.rashi.y - 2}" stroke="#8e44ad" stroke-width="1.5" opacity="0.6"/>`;
    }

    s += `<text x="${pos.rashi.x}" y="${pos.rashi.y}" font-size="9" font-weight="bold" fill="${isLagna ? "#8e44ad" : "#7f8c8d"}" text-anchor="middle" dominant-baseline="middle">${r}</text>`;

    const pts = isSav ? (data[r]?.points ?? 0) : (data[r] ?? 0);
    let color = "#2d3436";
    if (isSav) {
      if (pts >= 28) color = "#27ae60";
      else if (pts < 20) color = "#c0392b";
    } else {
      if (pts >= 5) color = "#27ae60";
      else if (pts <= 2) color = "#c0392b";
    }

    s += `<text x="${pos.planets.x}" y="${pos.planets.y}" font-size="16" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="middle">${pts}</text>`;
  }

  s += `<rect x="100" y="100" width="100" height="100" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="150" y="145" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${title}</text>
  <text x="150" y="160" font-size="9" fill="#666" text-anchor="middle">${subtitle}</text>`;

  s += `</svg>`;
  return s;
}

function buildAkvPrintSVG(data, title, subtitle, t, isSav = false, lagnaRashi = 1) {
  if (!data) return "";
  const chartStyle = localStorage.getItem("vaiswanara_chart_style") || "south";
  if (chartStyle === "north") {
    return buildAkvPrintNorthSvg(data, title, subtitle, t, isSav, lagnaRashi);
  }
  if (chartStyle === "east") {
    return buildAkvPrintEastSvg(data, title, subtitle, t, isSav, lagnaRashi);
  }

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

// --- MISC Panel Constants & Helper Functions ---
const planetsOrder = ['Lg', 'Su', 'Ch', 'Ku', 'Bu', 'Gu', 'Sk', 'Sa', 'Ra', 'Ke'];
const rashisOrder = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

const lordshipData = {
  "1": { "Su": "5", "Ch": "4", "Ku": "1,8", "Bu": "3,6", "Gu": "9,12", "Sk": "2,7", "Sa": "10,11" },
  "2": { "Su": "4", "Ch": "3", "Ku": "7,12", "Bu": "2,5", "Gu": "8,11", "Sk": "1,6", "Sa": "9,10" },
  "3": { "Su": "3", "Ch": "2", "Ku": "6,11", "Bu": "1,4", "Gu": "7,10", "Sk": "5,12", "Sa": "8,9" },
  "4": { "Su": "2", "Ch": "1", "Ku": "5,10", "Bu": "3,12", "Gu": "6,9", "Sk": "4,11", "Sa": "7,8" },
  "5": { "Su": "1", "Ch": "12", "Ku": "4,9", "Bu": "2,11", "Gu": "5,8", "Sk": "3,10", "Sa": "6,7" },
  "6": { "Su": "12", "Ch": "11", "Ku": "3,8", "Bu": "1,10", "Gu": "4,7", "Sk": "2,9", "Sa": "5,6" },
  "7": { "Su": "11", "Ch": "10", "Ku": "2,7", "Bu": "9,12", "Gu": "3,6", "Sk": "1,8", "Sa": "4,5" },
  "8": { "Su": "10", "Ch": "9", "Ku": "1,6", "Bu": "8,11", "Gu": "2,5", "Sk": "7,12", "Sa": "3,4" },
  "9": { "Su": "9", "Ch": "8", "Ku": "5,12", "Bu": "7,10", "Gu": "1,4", "Sk": "6,11", "Sa": "2,3" },
  "10": { "Su": "8", "Ch": "7", "Ku": "4,11", "Bu": "6,9", "Gu": "3,12", "Sk": "5,10", "Sa": "1,2" },
  "11": { "Su": "7", "Ch": "6", "Ku": "3,10", "Bu": "5,8", "Gu": "2,11", "Sk": "4,9", "Sa": "12,1" },
  "12": { "Su": "6", "Ch": "5", "Ku": "2,9", "Bu": "4,7", "Gu": "1,10", "Sk": "3,8", "Sa": "11,12" }
};
const rashiLords = { 1: 'Ku', 2: 'Sk', 3: 'Bu', 4: 'Ch', 5: 'Su', 6: 'Bu', 7: 'Sk', 8: 'Ku', 9: 'Gu', 10: 'Sa', 11: 'Sa', 12: 'Gu' };
const naturalRelationships = { 'Su': { friends: ['Ch', 'Ku', 'Gu'], enemies: ['Sk', 'Sa'], neutral: ['Bu'] }, 'Ch': { friends: ['Su', 'Bu'], enemies: [], neutral: ['Gu', 'Sk', 'Sa', 'Ku'] }, 'Ku': { friends: ['Su', 'Ch', 'Gu'], enemies: ['Bu'], neutral: ['Sk', 'Sa'] }, 'Bu': { friends: ['Su', 'Sk'], enemies: ['Ch'], neutral: ['Gu', 'Sa', 'Ku'] }, 'Gu': { friends: ['Su', 'Ch', 'Ku'], enemies: ['Bu', 'Sk'], neutral: ['Sa'] }, 'Sk': { friends: ['Bu', 'Sa'], enemies: ['Su', 'Ch'], neutral: ['Gu', 'Ku'] }, 'Sa': { friends: ['Bu', 'Sk'], enemies: ['Su', 'Ch', 'Ku'], neutral: ['Gu'] }, 'Ra': { friends: ['Sa', 'Sk'], enemies: ['Su', 'Ch', 'Ku'], neutral: ['Bu', 'Gu'] }, 'Ke': { friends: ['Ku', 'Gu'], enemies: ['Su', 'Ch'], neutral: ['Bu', 'Sk', 'Sa'] } };
const planetStrengthFallback = {
  "Su": { "Exaltation": 1, "Deblitation": 7, "Own_house1": 5, "Own_house2": 0 },
  "Ch": { "Exaltation": 2, "Deblitation": 8, "Own_house1": 4, "Own_house2": 0 },
  "Ku": { "Exaltation": 10, "Deblitation": 4, "Own_house1": 1, "Own_house2": 8 },
  "Bu": { "Exaltation": 6, "Deblitation": 12, "Own_house1": 3, "Own_house2": 6 },
  "Gu": { "Exaltation": 4, "Deblitation": 10, "Own_house1": 9, "Own_house2": 12 },
  "Sk": { "Exaltation": 12, "Deblitation": 6, "Own_house1": 2, "Own_house2": 7 },
  "Sa": { "Exaltation": 7, "Deblitation": 1, "Own_house1": 10, "Own_house2": 11 },
  "Ra": { "Exaltation": 3, "Deblitation": 9, "Own_house1": 0, "Own_house2": 0 },
  "Ke": { "Exaltation": 9, "Deblitation": 3, "Own_house1": 0, "Own_house2": 0 }
};

function getLordship(planetName, lagnaRashi) {
  if (!lagnaRashi || planetName === 'Lg' || planetName === 'Ra' || planetName === 'Ke') return '';
  return lordshipData[lagnaRashi]?.[planetName] || '';
}

function calculateHouseNumber(planetRashiNumber, lagnaRashiNumber) {
  if (!planetRashiNumber || !lagnaRashiNumber) return '';
  if (planetRashiNumber === lagnaRashiNumber) return '1';
  let houseNumber = parseInt(planetRashiNumber) - parseInt(lagnaRashiNumber) + 1;
  if (houseNumber <= 0) houseNumber += 12;
  return houseNumber.toString();
}

function calculateAspects(targetRashi, aspectingPlanetName, aspectingRashi) {
  if (!targetRashi || !aspectingRashi) return false;
  const source = parseInt(aspectingRashi);
  const target = parseInt(targetRashi);
  let aspects = [];
  if (aspectingPlanetName !== 'Lg') {
      let seventhHouse = source + 6;
      if (seventhHouse > 12) seventhHouse -= 12;
      if (target === seventhHouse) aspects.push("7th");
  }
  if (aspectingPlanetName === 'Gu') {
      let fifthHouse = source + 4; let ninthHouse = source + 8;
      if (fifthHouse > 12) fifthHouse -= 12; if (ninthHouse > 12) ninthHouse -= 12;
      if (target === fifthHouse) aspects.push("5th");
      if (target === ninthHouse) aspects.push("9th");
  } else if (aspectingPlanetName === 'Sa') {
      let thirdHouse = source + 2; let tenthHouse = source + 9;
      if (thirdHouse > 12) thirdHouse -= 12; if (tenthHouse > 12) tenthHouse -= 12;
      if (target === thirdHouse) aspects.push("3rd");
      if (target === tenthHouse) aspects.push("10th");
  } else if (aspectingPlanetName === 'Ku') {
      let fourthHouse = source + 3; let eighthHouse = source + 7;
      if (fourthHouse > 12) fourthHouse -= 12; if (eighthHouse > 12) eighthHouse -= 12;
      if (target === fourthHouse) aspects.push("4th");
      if (target === eighthHouse) aspects.push("8th");
  }
  return aspects.length > 0 ? aspects.join(",") : false;
}

function determineStrength(planetCode, rashiNumber, t) {
  if (!planetStrengthFallback[planetCode] || !rashiNumber) return '';
  const info = planetStrengthFallback[planetCode];
  const parts = [];
  if (info.Exaltation === parseInt(rashiNumber)) parts.push(t('exaltation', 'Exaltation'));
  if (info.Deblitation === parseInt(rashiNumber)) parts.push(t('debilitation', 'Debilitation'));
  if (info.Own_house1 === parseInt(rashiNumber) || info.Own_house2 === parseInt(rashiNumber)) parts.push(t('own_house', 'Own House'));
  return parts.join(', ') || t('neutral', 'Neutral');
}

function getFinalRelationship(naturalRel, tempRel) {
  const matrix = {
      'friend': {'friend': 'best_friend', 'neutral': 'friend', 'enemy': 'neutral_rel'},
      'neutral': {'friend': 'friend', 'neutral': 'neutral_rel', 'enemy': 'enemy'},
      'enemy': {'friend': 'neutral_rel', 'neutral': 'enemy', 'enemy': 'bitter_enemy'}
  };
  return matrix[naturalRel][tempRel];
}

function MiscPanel({ chartData, t }) {
  const [showReadContext, setShowReadContext] = useState(false);
  const [sthaana, setSthaana] = useState("");
  const [kaaraka, setKaaraka] = useState("");
  const [adhipatya, setAdhipatya] = useState("");

  if (!chartData || !chartData.planets) return null;

  const pMap = { 'Ascendant': 'Lg', 'Sun': 'Su', 'Moon': 'Ch', 'Mars': 'Ku', 'Mercury': 'Bu', 'Jupiter': 'Gu', 'Venus': 'Sk', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke' };
  const planetPositions = {};
  Object.entries(chartData.planets).forEach(([full, p]) => {
      if (pMap[full]) planetPositions[pMap[full]] = String(p.rashi);
  });
  const lagnaRashi = planetPositions['Lg'] || "1";

  const getFormattedPlanetName = (pName, targetRashiNum, isAspect = false) => {
      if (!pName || pName === 'Lg') return pName;
      let formattedName = t(pName, pName);
      if (pName === 'Gu' || pName === 'Sk') return formattedName + '(+)';
      if (['Sa', 'Ku', 'Ra', 'Ke', 'Su'].includes(pName)) return formattedName + '(-)';
      if (pName === 'Bu') {
          let hasGuOrSk = false;
          if (!isAspect) {
              planetsOrder.forEach(innerP => {
                  if (innerP !== 'Bu' && planetPositions[innerP] === String(targetRashiNum)) {
                      if (innerP === 'Gu' || innerP === 'Sk') hasGuOrSk = true;
                  }
              });
          } else {
              planetsOrder.forEach((innerP) => {
                  if (innerP !== 'Bu' && planetPositions[innerP]) {
                      const innerAspect = calculateAspects(targetRashiNum, innerP, planetPositions[innerP]);
                      if (innerAspect && (innerP === 'Gu' || innerP === 'Sk')) hasGuOrSk = true;
                  }
              });
          }
          return formattedName + (hasGuOrSk ? '(+)' : '(-)');
      }
      return formattedName;
  };

  const findConjunctions = (planetCode, rashiNumber, useFormat = false) => {
      let conjunctions = [];
      planetsOrder.forEach((pName) => {
          if (pName !== planetCode && planetPositions[pName] === String(rashiNumber) && rashiNumber && pName !== 'Lg') {
              conjunctions.push(useFormat ? getFormattedPlanetName(pName, parseInt(rashiNumber), false) : t(pName, pName));
          }
      });
      return conjunctions.join(', ');
  };

  const findAspects = (planetCode, rashiNumber, useFormat = false) => {
      let aspects = [];
      planetsOrder.forEach((pName) => {
          if (pName !== planetCode && planetPositions[pName]) {
              const aspectType = calculateAspects(rashiNumber, pName, planetPositions[pName]);
              if (aspectType && pName !== 'Lg') {
                  aspects.push(useFormat ? getFormattedPlanetName(pName, parseInt(rashiNumber), true) : t(pName, pName));
              }
          }
      });
      return aspects.join(', ');
  };

  const rowsData = planetsOrder.map(planet => {
      const rashiNum = planetPositions[planet];
      const rashiName = rashiNum ? rashisOrder[rashiNum - 1] : '-';
      const localizedPlanet = t(planet, planet);
      const localizedRashi = rashiNum ? t(rashiName, rashiName) : '-';

      const adhipathya = getLordship(planet, lagnaRashi);
      const sthaanaNum = calculateHouseNumber(rashiNum, lagnaRashi);
      const samyoga = rashiNum ? findConjunctions(planet, rashiNum) : '';
      const drusti = rashiNum ? findAspects(planet, rashiNum) : '';

      const strength = rashiNum ? determineStrength(planet, rashiNum, t) : '';
      let hSymbol = '';
      if (['1', '4', '5', '7', '9', '10'].includes(sthaanaNum)) hSymbol = '(+)';
      else if (['6', '8', '12'].includes(sthaanaNum)) hSymbol = '(-)';
      else if (['2', '3', '11'].includes(sthaanaNum)) hSymbol = '(N)';
      const sthaanaAnalyze = sthaanaNum ? sthaanaNum + hSymbol : '';

      const samyogaAnalyze = rashiNum ? findConjunctions(planet, rashiNum, true) : '';
      const drustiAnalyze = rashiNum ? findAspects(planet, rashiNum, true) : '';

      let pMaitri = '';
      if (rashiNum && planet !== 'Lg') {
          const rashiLord = rashiLords[parseInt(rashiNum)];
          const rashiLordPos = planetPositions[rashiLord];
          const localizedRashiLord = t(rashiLord, rashiLord);
          if (planet === rashiLord) {
              pMaitri = `${localizedRashiLord}: ${t('own_house', 'Own House')}`;
          } else if (rashiLord && rashiLordPos) {
              const naturalRel = naturalRelationships[planet].friends.includes(rashiLord) ? 'friend' : (naturalRelationships[planet].enemies.includes(rashiLord) ? 'enemy' : 'neutral');
              let distance = Math.abs(parseInt(rashiNum) - parseInt(rashiLordPos));
              if (distance > 6) distance = 12 - distance;
              const housePosition = distance + 1;
              const tempRel = [2, 3, 4, 10, 11, 12].includes(housePosition) ? 'friend' : ([1, 5, 6, 7, 8, 9].includes(housePosition) ? 'enemy' : 'neutral');
              const finalRel = getFinalRelationship(naturalRel, tempRel);
              pMaitri = `${localizedRashiLord}: ${t(finalRel, finalRel)}`;
          }
      }

      return { planet, localizedPlanet, localizedRashi, adhipathya, sthaanaNum, samyoga, drusti, strength, sthaanaAnalyze, samyogaAnalyze, drustiAnalyze, pMaitri };
  });

  const renderContext = () => {
      return rowsData.map(row => {
          if ((row.adhipathya || row.sthaanaNum || row.samyoga || row.drusti) && row.planet !== 'Lg') {
              let infoText = "";
              if (row.adhipathya) infoText += `${row.adhipathya} ${t('lord', 'Lord')} ${row.localizedPlanet}`;
              else infoText += row.localizedPlanet;
              if (row.sthaanaNum) infoText += ` ${t('posited_in', 'posited in')} ${row.sthaanaNum} ${t('house', 'House')}`;
              if (row.samyoga) infoText += `. ${t('samyoga_with', 'Samyoga with')} ${row.samyoga}`;
              if (row.drusti) infoText += `. ${t('aspected_by', 'Aspected by')} ${row.drusti}`;
              infoText += '.';

              return (
                  <div key={"ctx_"+row.planet} style={{ margin: 0, padding: '12px', background: '#fff', borderRadius: '8px', borderLeft: '3px solid #8e44ad', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <h4 style={{ margin: '0 0 6px 0', color: '#8e44ad', fontSize: '15px' }}>{row.localizedPlanet}</h4>
                      <p style={{ margin: 0, color: '#555', lineHeight: 1.5, fontSize: '14px' }}>{infoText}</p>
                  </div>
              );
          }
          return null;
      });
  };

  let sthaanaResult = "";
  if (sthaana) {
      const targetRashi = ((parseInt(lagnaRashi) + parseInt(sthaana) - 2) % 12) + 1;
      const occupants = [];
      planetsOrder.forEach(p => {
          if (p !== 'Lg' && planetPositions[p] === String(targetRashi)) occupants.push(getFormattedPlanetName(p, targetRashi, false));
      });
      const aspectors = [];
      planetsOrder.forEach(p => {
          if (p !== 'Lg' && planetPositions[p]) {
              const a = calculateAspects(targetRashi, p, planetPositions[p]);
              if (a) aspectors.push(getFormattedPlanetName(p, targetRashi, true));
          }
      });
      sthaanaResult = <div><b>{t('occupants', 'Occupants')}:</b> {occupants.length ? occupants.join(', ') : t('none', 'None')}<br/><b>{t('aspects', 'Aspects')}:</b> {aspectors.length ? aspectors.join(', ') : t('none', 'None')}</div>;
  }

  let kaarakaResult = "";
  if (kaaraka) {
      const targetRashi = planetPositions[kaaraka];
      if (!targetRashi) {
          kaarakaResult = t('planet_not_in_chart', 'Planet not in chart.');
      } else {
          const occupants = [];
          planetsOrder.forEach(p => {
              if (p !== kaaraka && p !== 'Lg' && planetPositions[p] === targetRashi) occupants.push(getFormattedPlanetName(p, parseInt(targetRashi), false));
          });
          const aspectors = [];
          planetsOrder.forEach(p => {
              if (p !== kaaraka && p !== 'Lg' && planetPositions[p]) {
                  const a = calculateAspects(targetRashi, p, planetPositions[p]);
                  if (a) aspectors.push(getFormattedPlanetName(p, parseInt(targetRashi), true));
              }
          });
          kaarakaResult = <div><b>{t('conjunctions', 'Conjunctions')}:</b> {occupants.length ? occupants.join(', ') : t('none', 'None')}<br/><b>{t('aspects', 'Aspects')}:</b> {aspectors.length ? aspectors.join(', ') : t('none', 'None')}</div>;
      }
  }

  let adhipatyaResult = "";
  if (adhipatya) {
      const targetHouseRashi = ((parseInt(lagnaRashi) + parseInt(adhipatya) - 2) % 12) + 1;
      const lord = rashiLords[targetHouseRashi];
      if (!lord) {
          adhipatyaResult = t('no_lord_for_this_house', 'No lord for this house.');
      } else {
          const lordRashi = planetPositions[lord];
          if (!lordRashi) {
              adhipatyaResult = `Lord ${t(lord, lord)} not found in chart.`;
          } else {
              const occupants = [];
              planetsOrder.forEach(p => {
                  if (p !== lord && p !== 'Lg' && planetPositions[p] === lordRashi) occupants.push(getFormattedPlanetName(p, parseInt(lordRashi), false));
              });
              const aspectors = [];
              planetsOrder.forEach(p => {
                  if (p !== lord && p !== 'Lg' && planetPositions[p]) {
                      const a = calculateAspects(lordRashi, p, planetPositions[p]);
                      if (a) aspectors.push(getFormattedPlanetName(p, parseInt(lordRashi), true));
                  }
              });
              adhipatyaResult = <div><b>{t('lord', 'Lord')}: {t(lord, lord)}</b><br/><b>{t('occupants', 'Occupants')}:</b> {occupants.length ? occupants.join(', ') : t('none', 'None')}<br/><b>{t('aspects', 'Aspects')}:</b> {aspectors.length ? aspectors.join(', ') : t('none', 'None')}</div>;
          }
      }
  }

  return (
    <div className="misc-panel-modern" style={{ width: "100%", boxSizing: "border-box", marginTop: "20px" }}>
      {showReadContext && (
        <div style={{ marginBottom: "25px", padding: "20px", borderLeft: "4px solid #8e44ad", background: "#f9f0ff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e8daff", paddingBottom: "12px", marginBottom: "15px" }}>
            <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "18px", fontWeight: "bold" }}>{t("planet_details_context", "Planet Details Context")}</h3>
            <button onClick={() => setShowReadContext(false)} style={{ background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#c0392b", padding: "0" }}>&times;</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {renderContext()}
          </div>
        </div>
      )}

      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #f1f2f6", paddingBottom: "10px", marginBottom: "20px", marginTop: "10px", flexWrap: "nowrap" }}>
          <h3 style={{ fontWeight: "800", color: "#2c3e50", fontSize: "20px", margin: 0, flex: "1 1 auto", paddingRight: "10px" }}>
            {t("analyze_horoscope", "Analyze Horoscope")}
          </h3>
          <button 
            onClick={(e) => { e.preventDefault(); setShowReadContext(!showReadContext); }} 
            style={{ background: "linear-gradient(135deg, #8e44ad, #732d91)", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(142,68,173,0.2)", flex: "0 0 auto", width: "fit-content" }}
          >
            {showReadContext ? t("close_context", "Close Context") : t("read_context", "Read Context")}
          </button>
        </div>
        
        <style>{`
          .analyze-horo-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            width: 100%;
          }
          @media (min-width: 600px) {
            .analyze-horo-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .analyze-horo-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          .graha-stat-card {
            background: #ffffff;
            border: 1px solid #eaecee;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            transition: transform 0.2s, box-shadow 0.2s;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          .graha-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          }
          .graha-stat-header {
            font-size: 22px;
            font-weight: 800;
            color: #2980b9;
            border-bottom: 2px solid #f8f9fa;
            padding-bottom: 15px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .graha-stat-header span.adhipathya-badge {
            font-size: 14px;
            background: #fdf2e9;
            color: #e67e22;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #fae5d3;
          }
          .graha-stat-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .g-stat-item {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            gap: 8px;
          }
          .g-stat-label {
            color: #7f8c8d;
            font-size: 14px;
            text-transform: capitalize;
            font-weight: 600;
            white-space: nowrap;
          }
          .g-stat-val {
            font-weight: 800;
            font-size: 17px;
            line-height: 1.4;
          }
          .val-strength { color: #16a085; }
          .val-sthaana { color: #2980b9; }
          .val-pmaitri { color: #8e44ad; }
          .val-samyoga { color: #c0392b; }
          .val-drusti { color: #27ae60; }
          
          /* Bhala Grid Styles */
          .bhala-cards-container {
            display: flex;
            flex-direction: column;
            gap: 25px;
            margin-top: 35px;
            width: 100%;
          }
          @media (min-width: 768px) {
            .bhala-cards-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
            }
          }
          .bhala-card-modern {
            padding: 24px;
            border-radius: 16px;
            background: #fff;
            border: 1px solid #f1f2f6;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
          }
          .bhala-card-modern.sthaana { border-top: 5px solid #e67e22; }
          .bhala-card-modern.kaaraka { border-top: 5px solid #3498db; }
          .bhala-card-modern.adhipatya { border-top: 5px solid #2ecc71; }
          
          .bhala-card-modern h4 {
            margin: 0 0 18px 0;
            font-size: 18px;
            font-weight: 800;
          }
          .bhala-card-modern.sthaana h4 { color: #d35400; }
          .bhala-card-modern.kaaraka h4 { color: #2980b9; }
          .bhala-card-modern.adhipatya h4 { color: #27ae60; }
          
          .bhala-select {
            width: 100%;
            padding: 14px 16px;
            border-radius: 10px;
            border: 2px solid #eaecee;
            background: #fdfefe;
            font-size: 16px;
            color: #2c3e50;
            outline: none;
            cursor: pointer;
            transition: all 0.2s;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%237f8c8d" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position: right 12px center;
            box-sizing: border-box;
            font-weight: 600;
          }
          .bhala-select:focus {
            border-color: #8e44ad;
            box-shadow: 0 0 0 4px rgba(142,68,173,0.1);
          }
          .bhala-result-box {
            margin-top: 20px;
            font-size: 15px;
            color: #34495e;
            line-height: 1.6;
            background: #f8f9fa;
            padding: 16px;
            border-radius: 10px;
            border-left: 4px solid #bdc3c7;
            flex-grow: 1;
            font-weight: 500;
          }
        `}</style>
        
        <div className="analyze-horo-grid" style={{ width: "100%", boxSizing: "border-box" }}>
          {rowsData.filter(r => r.planet !== 'Lg').map((row) => (
            <div key={"analyze_"+row.planet} className="graha-stat-card" style={{ width: "100%", boxSizing: "border-box" }}>
              <div className="graha-stat-header">
                {row.localizedPlanet}
                {row.adhipathya && <span className="adhipathya-badge">Lordship: {row.adhipathya}</span>}
              </div>
              <div className="graha-stat-list">
                <div className="g-stat-item">
                  <span className="g-stat-label">{t("strength", "Strength")} :</span>
                  <span className="g-stat-val val-strength">{row.strength || '-'}</span>
                </div>
                <div className="g-stat-item">
                  <span className="g-stat-label">{t("sthaana", "Sthaana")} :</span>
                  <span className="g-stat-val val-sthaana">{row.sthaanaAnalyze || '-'}</span>
                </div>
                <div className="g-stat-item">
                  <span className="g-stat-label">{t("p_maitri", "P.Maitri")} :</span>
                  <span className="g-stat-val val-pmaitri">{row.pMaitri || '-'}</span>
                </div>
                <div className="g-stat-item">
                  <span className="g-stat-label">{t("samyoga", "Samyoga")} :</span>
                  <span className="g-stat-val val-samyoga">{row.samyogaAnalyze || '-'}</span>
                </div>
                <div className="g-stat-item">
                  <span className="g-stat-label">{t("drusti", "Drusti")} :</span>
                  <span className="g-stat-val val-drusti">{row.drustiAnalyze || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bhala-cards-container">
          <div className="bhala-card-modern sthaana">
            <h4>{t("sthaana_bhala", "Sthaana Bhala")}</h4>
            <select className="bhala-select" value={sthaana} onChange={(e) => setSthaana(e.target.value)}>
              <option value="">{t("select_house", "-- Select House --")}</option>
              {[...Array(12)].map((_, i) => <option key={"s_"+i} value={i+1}>{t("house", "House")} {i+1}</option>)}
            </select>
            {sthaanaResult && <div className="bhala-result-box" style={{ borderLeftColor: '#e67e22' }}>{sthaanaResult}</div>}
          </div>

          <div className="bhala-card-modern kaaraka">
            <h4>{t("kaaraka_bhala", "Kaaraka Bhala")}</h4>
            <select className="bhala-select" value={kaaraka} onChange={(e) => setKaaraka(e.target.value)}>
              <option value="">{t("select_planet", "-- Select Planet --")}</option>
              {planetsOrder.filter(p => p !== 'Lg').map(p => <option key={"k_"+p} value={p}>{t(p, p)}</option>)}
            </select>
            {kaarakaResult && <div className="bhala-result-box" style={{ borderLeftColor: '#3498db' }}>{kaarakaResult}</div>}
          </div>

          <div className="bhala-card-modern adhipatya">
            <h4>{t("adhipatya_bhala", "Adhipatya Bhala")}</h4>
            <select className="bhala-select" value={adhipatya} onChange={(e) => setAdhipatya(e.target.value)}>
              <option value="">{t("select_house", "-- Select House --")}</option>
              {[...Array(12)].map((_, i) => <option key={"a_"+i} value={i+1}>{t("house", "House")} {i+1}</option>)}
            </select>
            {adhipatyaResult && <div className="bhala-result-box" style={{ borderLeftColor: '#2ecc71' }}>{adhipatyaResult}</div>}
          </div>
        </div>
      </div>
    </div>
  );
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
        
        const lagnaRashi = chartData.planets?.Ascendant?.rashi ?? 1;
        const savSvg = buildAkvPrintSVG(savData, "SAV", t("sarvashtakavarga", "(Sarvashtakavarga)"), t, true, lagnaRashi);
        const suBavSvg = buildAkvPrintSVG(bavData.Sun || {}, "Su BAV", t("Sun"), t, false, lagnaRashi);
        const moBavSvg = buildAkvPrintSVG(bavData.Moon || {}, "Ch BAV", t("Moon"), t, false, lagnaRashi);
        const maBavSvg = buildAkvPrintSVG(bavData.Mars || {}, "Ku BAV", t("Mars"), t, false, lagnaRashi);
        const meBavSvg = buildAkvPrintSVG(bavData.Mercury || {}, "Bu BAV", t("Mercury"), t, false, lagnaRashi);
        const juBavSvg = buildAkvPrintSVG(bavData.Jupiter || {}, "Gu BAV", t("Jupiter"), t, false, lagnaRashi);
        const veBavSvg = buildAkvPrintSVG(bavData.Venus || {}, "Sk BAV", t("Venus"), t, false, lagnaRashi);
        const saBavSvg = buildAkvPrintSVG(bavData.Saturn || {}, "Sa BAV", t("Saturn"), t, false, lagnaRashi);

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
        <div class="header" style="padding-bottom: 8px; margin-bottom: 12px;">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="height: 48px; margin-bottom: 4px;">` : ""}
          <h1 style="font-size: 18pt;">${formData.name?.trim() ? formData.name.trim() : t("Horoscope", "Horoscope")}</h1>
          <h2 style="font-size: 13pt; margin: 2px 0;">${t("natalChart", "Natal Chart")}</h2>
        </div>

        <div style="text-align: center; font-style: italic; font-size: 10pt; color: #4a5568; margin-bottom: 12px; font-family: 'Noto Sans', 'Poppins', sans-serif; line-height: 1.5; font-weight: 500;">
          ${t("shlokaLine1", "जननी जन्मसौख्यानां वर्धिनी कुलसम्पदाम् ।")}<br/>
          ${t("shlokaLine2", "पदवी पूर्वपुण्यानां लिख्यते जन्मपत्रिका ॥")}
        </div>
        
        <div style="text-align: center; margin-bottom: 15px; font-size: 11.5pt; color: #2d3436;">
          <div style="font-weight: bold; margin-bottom: 4px;">
            ${formData.dob ? formData.dob.split('-').reverse().join('-') : '-'} &nbsp;&nbsp;&nbsp; ${formData.tob} &nbsp;&nbsp;&nbsp; ${formData.city ? formData.city.split(',')[0].trim() : '-'}
          </div>
          <div style="font-size: 10.5pt; color: #34495e;">
            ${formatPanchanga(chartData.panchanga, t)}
          </div>
          ${chartData.meta?.ayanamsha_name ? `<div style="font-size: 9.5pt; color: #7f8c8d; margin-top: 4px;"><strong>Ayanamsha:</strong> ${chartData.meta.ayanamsha_name} (${chartData.meta.ayanamsha}°)</div>` : ""}
        </div>
        
        <div class="charts-row" style="margin-bottom: 18px; gap: 20px;">
          <div class="chart-col">${d1Svg}</div>
          <div class="chart-col">${d9Svg}</div>
        </div>

        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:4px; margin-bottom:8px; font-size:11.5pt; text-transform:uppercase; text-align: center;">${t("grahaPositions", "Graha Positions")}</h2>
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
          gap: 15px !important;
          width: 100% !important;
          align-items: start !important;
        }
        
        .new-horo-page .shadbala-akv-row {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
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
          display: flex; justify-content: center; align-items: flex-start;
          padding: 20px; backdrop-filter: blur(4px);
          overflow-y: auto;
        }
        .new-horo-page .popup-content {
          background: #fff; padding: 30px; border-radius: 16px;
          width: 100%; max-width: 650px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          margin: 40px auto;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .new-horo-page .popup-container { padding: 15px; }
          .new-horo-page .popup-content { padding: 20px; max-width: 100%; margin: 20px auto; }
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

                {/* 5. MISC Analysis Tab */}
                <div style={{ marginTop: "15px", width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}>
                  <MiscPanel chartData={chartData} t={t} />
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
