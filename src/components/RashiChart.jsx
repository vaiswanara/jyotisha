import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrischika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];

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

export function RashiChart({
  planets = {},
  navamsa = {},
  d2 = {},
  d3 = {},
  d4 = {},
  d7 = {},
  d10 = {},
  d12 = {},
  d16 = {},
  d20 = {},
  d24 = {},
  d27 = {},
  d30 = {},
  d60 = {},
  d1Footer = null,
  d9Footer = null,
  hideD1Settings = false,
  hideDivisionalSelector = false,
  defaultShowDivisional = true,
  d1Size = 320,
}) {
  const { t } = useTranslation();

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

  const renderHousePlanets = (planetList, cx, cy, isD1 = false) => {
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
            const color = isRetro ? "#2980b9" : isCombust ? "#c0392b" : "#2c3e50";
            const weight = "800";
            const text = t(planet.label);
            
            return (
              <tspan
                key={planet.name}
                fill={color}
                fontWeight={weight}
                dx={idx > 0 ? "4px" : "0px"}
              >
                {text}
                {isD1 && showD1Degrees && planet.degree !== undefined && `${Math.floor(planet.degree)}°`}
                {isRetro && "R"}
                {isCombust && "c"}
              </tspan>
            );
          })}
        </text>
      );
    });
  };

  const renderNorthIndianChart = (chartPlanets, title, subtitle, isD1 = false) => {
    const lagnaRashi = chartPlanets["Ascendant"]?.rashi ?? 1;

    const houses = [];
    for (let h = 1; h <= 12; h++) {
      const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
      const planetList = getPlanetsForRashi(chartPlanets, houseRashi);
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
          maxWidth: isD1 ? `${d1Size}px` : "320px",
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
            border: "2px solid #8e44ad",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          {/* Outer Border */}
          <rect x="0" y="0" width="320" height="320" fill="none" stroke="#8e44ad" strokeWidth="2" />
          
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
                {renderHousePlanets(planetList, pos.planets.x, pos.planets.y, isD1)}
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
              fill="#f9f0ff"
              stroke="#8e44ad"
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
                fill: "#8e44ad",
                fontFamily: "sans-serif",
              }}
            >
              {t(title)}
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
  };

  const renderEastIndianChart = (chartPlanets, title, subtitle, isD1 = false) => {
    const lagnaRashi = chartPlanets["Ascendant"]?.rashi ?? 1;

    const cells = [];
    for (let r = 1; r <= 12; r++) {
      const planetList = getPlanetsForRashi(chartPlanets, r);
      const pos = EAST_INDIAN_LAYOUT[r];
      const isLagna = r === lagnaRashi;
      cells.push({
        rashiNum: r,
        planetList,
        pos,
        isLagna,
      });
    }

    return (
      <div
        className="east-chart"
        aria-label={`East Indian ${title}`}
        style={{
          width: "100%",
          maxWidth: isD1 ? `${d1Size}px` : "320px",
          aspectRatio: "1 / 1",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <svg
          viewBox="0 0 300 300"
          width="100%"
          height="100%"
          style={{
            display: "block",
            background: "#ffffff",
            border: "2px solid #8e44ad",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          {/* Main Grid Polygons */}
          {cells.map(({ rashiNum, planetList, pos, isLagna }) => {
            const fill = isLagna ? "rgba(142, 68, 173, 0.08)" : "#ffffff";
            return (
              <g key={rashiNum}>
                {/* Cell Area */}
                <polygon
                  points={pos.polygon}
                  fill={fill}
                  stroke="#ccc"
                  strokeWidth="1.2"
                  style={{ transition: "fill 0.3s ease" }}
                />

                {/* Lagna marker line (double slanting lines in top right of cell) */}
                {isLagna && (
                  <g stroke="#8e44ad" strokeWidth="1.5" opacity="0.6">
                    <line x1={pos.rashi.x + 8} y1={pos.rashi.y - 12} x2={pos.rashi.x + 18} y2={pos.rashi.y - 2} />
                    <line x1={pos.rashi.x + 12} y1={pos.rashi.y - 12} x2={pos.rashi.x + 22} y2={pos.rashi.y - 2} />
                  </g>
                )}

                {/* Rashi Number */}
                <text
                  x={pos.rashi.x}
                  y={pos.rashi.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    fill: isLagna ? "#8e44ad" : "#7f8c8d",
                    fontFamily: "sans-serif",
                    userSelect: "none",
                  }}
                >
                  {rashiNum}
                </text>

                {/* Planets inside the house */}
                {renderHousePlanets(planetList, pos.planets.x, pos.planets.y, isD1)}
              </g>
            );
          })}

          {/* Center cell - Grid Square & Overlay Title */}
          <rect
            x="100"
            y="100"
            width="100"
            height="100"
            fill="#f9f0ff"
            stroke="#ccc"
            strokeWidth="1.2"
          />
          <g transform="translate(150, 150)">
            <text
              x="0"
              y="-6"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                fill: "#8e44ad",
                fontFamily: "sans-serif",
              }}
            >
              {t(title)}
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
  };

  const renderChart = (chartPlanets, title, subtitle, isD1 = false) => {
    if (chartStyle === "north") {
      return renderNorthIndianChart(chartPlanets, title, subtitle, isD1);
    }
    if (chartStyle === "east") {
      return renderEastIndianChart(chartPlanets, title, subtitle, isD1);
    }
    return (
      <div
        className="south-chart"
        aria-label={`South Indian ${title}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "repeat(4, minmax(0, 1fr))",
          width: "100%",
          maxWidth: isD1 ? `${d1Size}px` : "320px",
          aspectRatio: "1 / 1",
          margin: "0 auto",
          border: "2px solid #8e44ad",
          boxSizing: "border-box",
        }}
      >
        {SOUTH_INDIAN_GRID.flatMap((row, rowIndex) =>
          row.map((rashiNumber, columnIndex) => {
            if (rashiNumber === null) {
              return null;
            }

            const planetList = getPlanetsForRashi(chartPlanets, rashiNumber);
            const pCount = planetList.length;

            const scaleRatio = isD1 && d1Size ? d1Size / 320 : 1;
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

            if (scaleRatio !== 1) {
              if (pCount === 4) {
                fSize = `clamp(${11.5 * scaleRatio}px, ${3.5 * scaleRatio}vw, ${16 * scaleRatio}px)`;
              } else if (pCount === 5) {
                fSize = `clamp(${10 * scaleRatio}px, ${3 * scaleRatio}vw, ${14 * scaleRatio}px)`;
              } else if (pCount >= 6) {
                fSize = `clamp(${9 * scaleRatio}px, ${2.5 * scaleRatio}vw, ${12 * scaleRatio}px)`;
              } else {
                fSize = `clamp(${13 * scaleRatio}px, ${4.5 * scaleRatio}vw, ${19 * scaleRatio}px)`;
              }
            }

            return (
              <div
                className="south-chart-cell"
                key={`${rowIndex}-${columnIndex}`}
                style={{
                  gridColumn: columnIndex + 1,
                  gridRow: rowIndex + 1,
                  border: "1px solid #ccc",
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
                      }}
                    >
                      {t(planet.label)}
                      {isD1 && showD1Degrees && planet.degree !== undefined && (
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: "0.85em",
                            marginLeft: "2px",
                            color: "#555",
                          }}
                        >
                          {Math.floor(planet.degree)}°
                        </span>
                      )}
                      {planet.retrograde && (
                        <sup
                          style={{
                            fontSize: "0.65em",
                            color: "#2980b9",
                            marginLeft: "1px",
                          }}
                        >
                          R
                        </sup>
                      )}
                      {planet.combust && (
                        <sub
                          style={{
                            fontSize: "0.65em",
                            color: "#c0392b",
                            marginLeft: "1px",
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
            background: "#f9f0ff",
            padding: "4px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <strong
            style={{
              fontSize: isD1 && d1Size !== 320 ? `clamp(${12 * (d1Size/320)}px, ${3.5 * (d1Size/320)}vw, ${17 * (d1Size/320)}px)` : "clamp(12px, 3.5vw, 17px)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
              width: "100%",
              lineHeight: "1.15",
            }}
          >
            {t(title)}
          </strong>
          <span
            style={{
              fontSize: isD1 && d1Size !== 320 ? `clamp(${9 * (d1Size/320)}px, ${2.5 * (d1Size/320)}vw, ${13 * (d1Size/320)}px)` : "clamp(9px, 2.5vw, 13px)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
              width: "100%",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    );
  };

  const [activeDiv, setActiveDiv] = useState("D9");
  const [showMenu, setShowMenu] = useState(false);
  const [showD1Menu, setShowD1Menu] = useState(false);
  const [showD1Degrees, setShowD1Degrees] = useState(false);
  const [showDivisional, setShowDivisional] = useState(defaultShowDivisional);

  useEffect(() => {
    setShowDivisional(defaultShowDivisional);
  }, [defaultShowDivisional]);

  const divNameKeys = {
    D2: "Hora",
    D3: "Drekkana",
    D4: "Chaturthamsha",
    D7: "Saptamsha",
    D9: "Navamsha",
    D10: "Dasamsha",
    D12: "Dwadashamsha",
    D16: "Shodashamsha",
    D20: "Vimshamsha",
    D24: "Chaturvimshamsha",
    D27: "Saptavimshamsha",
    D30: "Trimshamsha",
    D60: "Shashtiamsha",
  };

  let activeChartData = navamsa || {};
  let activeTitle = "Navamsha";
  let activeSubtitle = "(D9)";

  if (activeDiv === "D2") {
    activeChartData = d2 || {};
    activeTitle = "Hora";
    activeSubtitle = "(D2)";
  } else if (activeDiv === "D3") {
    activeChartData = d3 || {};
    activeTitle = "Drekkana";
    activeSubtitle = "(D3)";
  } else if (activeDiv === "D4") {
    activeChartData = d4 || {};
    activeTitle = "Chaturthamsha";
    activeSubtitle = "(D4)";
  } else if (activeDiv === "D7") {
    activeChartData = d7 || {};
    activeTitle = "Saptamsha";
    activeSubtitle = "(D7)";
  } else if (activeDiv === "D10") {
    activeChartData = d10 || {};
    activeTitle = "Dasamsha";
    activeSubtitle = "(D10)";
  } else if (activeDiv === "D12") {
    activeChartData = d12 || {};
    activeTitle = "Dwadashamsha";
    activeSubtitle = "(D12)";
  } else if (activeDiv === "D16") {
    activeChartData = d16 || {};
    activeTitle = "Shodashamsha";
    activeSubtitle = "(D16)";
  } else if (activeDiv === "D20") {
    activeChartData = d20 || {};
    activeTitle = "Vimshamsha";
    activeSubtitle = "(D20)";
  } else if (activeDiv === "D24") {
    activeChartData = d24 || {};
    activeTitle = "Chaturvimshamsha";
    activeSubtitle = "(D24)";
  } else if (activeDiv === "D27") {
    activeChartData = d27 || {};
    activeTitle = "Saptavimshamsha";
    activeSubtitle = "(D27)";
  } else if (activeDiv === "D30") {
    activeChartData = d30 || {};
    activeTitle = "Trimshamsha";
    activeSubtitle = "(D30)";
  } else if (activeDiv === "D60") {
    activeChartData = d60 || {};
    activeTitle = "Shashtiamsha";
    activeSubtitle = "(D60)";
  }

  return (
    <section
      className="chart-panel"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px",
        width: "100%",
      }}
    >
      <div
        style={{
          flex: "1 1 280px",
          width: "100%",
          maxWidth: d1Size ? `${d1Size + 30}px` : "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Controls Row */}
        {!hideD1Settings && (
          <div
            style={{
              width: "100%",
              maxWidth: "320px",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "2px",
              position: "relative",
            }}
          >
            {/* D1 Gear Icon button */}
            <button
              style={{
                background: "transparent",
                border: "none",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onClick={() => setShowD1Menu(!showD1Menu)}
              title="D1 Chart Settings"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(30deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              ⚙️
            </button>

            {/* D1 Dropdown Menu */}
            {showD1Menu && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 11,
                  }}
                  onClick={() => setShowD1Menu(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    right: "0px",
                    background: "#ffffff",
                    border: "1px solid #eaecee",
                    borderRadius: "10px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    zIndex: 12,
                    minWidth: "150px",
                    boxSizing: "border-box",
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  <style>{`
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(-8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#2c3e50",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      width: "auto",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={showD1Degrees}
                      onChange={(e) => setShowD1Degrees(e.target.checked)}
                      style={{
                        cursor: "pointer",
                        accentColor: "#8e44ad",
                        width: "15px",
                        height: "15px",
                        minHeight: "initial",
                        display: "inline-block",
                        margin: 0,
                      }}
                    />
                    <span>{t("Degrees", "Degrees")}</span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#2c3e50",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      width: "auto",
                      marginTop: "4px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={showDivisional}
                      onChange={(e) => setShowDivisional(e.target.checked)}
                      style={{
                        cursor: "pointer",
                        accentColor: "#8e44ad",
                        width: "15px",
                        height: "15px",
                        minHeight: "initial",
                        display: "inline-block",
                        margin: 0,
                      }}
                    />
                    <span>{t("Divisional Chart", "Divisional Chart")}</span>
                  </label>

                </div>
              </>
            )}
          </div>
        )}

        {renderChart(planets, "Rasi Chakra", "(D1)", true)}
        {d1Footer}
      </div>

      {showDivisional && (
        <div
          style={{
            width: "100%",
            maxWidth: "350px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Controls Row */}
          {!hideDivisionalSelector && (
            <div
              style={{
                width: "100%",
                maxWidth: "320px",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "2px",
                position: "relative",
              }}
            >
              {/* Gear Icon button */}
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setShowMenu(!showMenu)}
                title="Select Divisional Chart"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(30deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                ⚙️
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 11,
                    }}
                    onClick={() => setShowMenu(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "36px",
                      right: "0px",
                      background: "#ffffff",
                      border: "1px solid #eaecee",
                      borderRadius: "10px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      padding: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      zIndex: 12,
                      minWidth: "180px",
                      maxHeight: "260px",
                      overflowY: "auto",
                      boxSizing: "border-box",
                      animation: "fadeIn 0.15s ease-out",
                    }}
                  >
                    <style>{`
                      @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>
                    {["D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D60"].map((div) => (
                      <button
                        key={div}
                        style={{
                          background: activeDiv === div ? "#8e44ad" : "transparent",
                          color: activeDiv === div ? "#ffffff" : "#2c3e50",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          fontSize: "13px",
                          fontWeight: "600",
                          textAlign: "left",
                          cursor: "pointer",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                        onClick={() => {
                          setActiveDiv(div);
                          setShowMenu(false);
                        }}
                        onMouseEnter={(e) => {
                          if (activeDiv !== div) {
                            e.currentTarget.style.background = "#f5e6ff";
                            e.currentTarget.style.color = "#8e44ad";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeDiv !== div) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#2c3e50";
                          }
                        }}
                      >
                        <span>{t(divNameKeys[div])}</span>
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>{div}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {renderChart(activeChartData, activeTitle, activeSubtitle)}

          {Object.keys(activeChartData).length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#c0392b",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {t("divisionalChartUnavailable", "⚠️ Divisional chart data is not available. Please recalculate.")}
            </div>
          )}
          {d9Footer}
        </div>
      )}
    </section>
  );
}

function getPlanetsForRashi(planets, rashiNumber) {
  return Object.entries(planets)
    .filter(([name, planet]) => Number(planet?.rashi) === rashiNumber)
    .map(([name, planet]) => ({
      name,
      label: PLANET_ABBR[name] || name,
      retrograde: Boolean(planet.retrograde),
      combust: Boolean(planet.combust),
      degree: planet?.degree,
    }));
}
