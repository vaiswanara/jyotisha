import { useState } from "react";
import { useTranslation } from "react-i18next";

const PLANET_NAMES = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Kuja",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
};

const PLANET_ABBREVIATIONS = {
  Sun: "Su",
  Moon: "Ch",
  Mars: "Ku",
  Mercury: "Bu",
  Jupiter: "Gu",
  Venus: "Sk",
  Saturn: "Sh",
};

const SOUTH_INDIAN_GRID = [
  [12, 1, 2, 3],
  [11, null, null, 4],
  [10, null, null, 5],
  [9, 8, 7, 6],
];

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

import { useEffect } from "react";

export function AshtakavargaTable({ ashtakavarga, lagnaRashi = 1 }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Sarva");
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

  if (!ashtakavarga) return null;

  const { prastarashtakavarga: pras, sarvashtakavarga: sarva } = ashtakavarga;
  const planets = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];

  const renderGrid = (data, isSarva) => {
    const title = isSarva ? "SAV" : `${t(activeTab)} BAV`;
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
          margin: "1rem auto 0 auto",
          border: "2px solid #8e44ad",
          boxSizing: "border-box",
        }}
      >
        {SOUTH_INDIAN_GRID.flatMap((row, rowIndex) =>
          row.map((rashiNumber, columnIndex) => {
            if (rashiNumber === null) return null;

            const pts = isSarva
              ? (data[rashiNumber]?.points ?? 0)
              : (data[rashiNumber] ?? 0);
            let cls = "";
            if (isSarva) cls = pts >= 28 ? "high" : pts < 20 ? "low" : "";
            else cls = pts >= 5 ? "high" : pts <= 2 ? "low" : "";

            return (
              <div
                className="south-chart-cell"
                key={`${rowIndex}-${columnIndex}`}
                style={{
                  gridColumn: columnIndex + 1,
                  gridRow: rowIndex + 1,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <strong
                    className={`akv-pts ${cls}`}
                    style={{ fontSize: "1.4rem" }}
                  >
                    {pts}
                  </strong>
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
          }}
        >
          <strong style={{ fontSize: "clamp(14px, 4vw, 20px)" }}>
            {title}
          </strong>
          <span
            style={{
              fontSize: "clamp(10px, 3vw, 14px)",
              marginTop: "4px",
              color: "#7a6e60",
            }}
          >
            {isSarva
              ? t("sarvashtakavarga", "(Sarvashtakavarga)")
              : t("bhinnashtakavarga", "(Bhinnashtakavarga)")}
          </span>
        </div>
      </div>
    );
  };

  const renderNorthIndianGrid = (data, isSarva) => {
    const title = isSarva ? "SAV" : `${t(activeTab)} BAV`;
    const lagna = lagnaRashi || 1;

    const houses = [];
    for (let h = 1; h <= 12; h++) {
      const houseRashi = ((lagna + h - 2) % 12) + 1;
      const pts = isSarva
        ? (data[houseRashi]?.points ?? 0)
        : (data[houseRashi] ?? 0);
      let cls = "";
      if (isSarva) cls = pts >= 28 ? "high" : pts < 20 ? "low" : "";
      else cls = pts >= 5 ? "high" : pts <= 2 ? "low" : "";

      const pos = NORTH_INDIAN_LAYOUT[h];
      houses.push({
        houseNum: h,
        rashiNum: houseRashi,
        pts,
        cls,
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
          margin: "1rem auto 0 auto",
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
          {houses.map(({ houseNum, rashiNum, pts, cls, pos }) => {
            let color = "#2c3e50";
            if (cls === "high") color = "#27ae60";
            else if (cls === "low") color = "#c0392b";

            return (
              <g key={houseNum}>
                {/* Rashi Number */}
                <text
                  x={pos.rashi.x}
                  y={pos.rashi.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    fill: "#7f8c8d",
                    fontFamily: "sans-serif",
                    userSelect: "none",
                  }}
                >
                  {rashiNum}
                </text>
                
                {/* Points inside the house */}
                <text
                  x={pos.planets.x}
                  y={pos.planets.y + 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fill: color,
                    fontFamily: "sans-serif",
                  }}
                >
                  {pts}
                </text>
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
              {title}
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
              {isSarva
                ? t("sarvashtakavarga", "(Sarvashtakavarga)")
                : t("bhinnashtakavarga", "(Bhinnashtakavarga)")}
            </text>
          </g>
        </svg>
      </div>
    );
  };

  const renderEastIndianGrid = (data, isSarva) => {
    const title = isSarva ? "SAV" : `${t(activeTab)} BAV`;
    const lagna = lagnaRashi || 1;

    const cells = [];
    for (let r = 1; r <= 12; r++) {
      const pts = isSarva ? (data[r]?.points ?? 0) : (data[r] ?? 0);
      let cls = "";
      if (isSarva) cls = pts >= 28 ? "high" : pts < 20 ? "low" : "";
      else cls = pts >= 5 ? "high" : pts <= 2 ? "low" : "";

      const pos = EAST_INDIAN_LAYOUT[r];
      const isLagna = r === lagna;
      cells.push({
        rashiNum: r,
        pts,
        cls,
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
          maxWidth: "320px",
          aspectRatio: "1 / 1",
          margin: "1rem auto 0 auto",
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
          {cells.map(({ rashiNum, pts, cls, pos, isLagna }) => {
            let color = "#2c3e50";
            if (cls === "high") color = "#27ae60";
            else if (cls === "low") color = "#c0392b";

            const fill = isLagna ? "rgba(142, 68, 173, 0.08)" : "#ffffff";

            return (
              <g key={rashiNum}>
                {/* Cell Area */}
                <polygon
                  points={pos.polygon}
                  fill={fill}
                  stroke="#ccc"
                  strokeWidth="1.2"
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

                {/* Points inside the cell */}
                <text
                  x={pos.planets.x}
                  y={pos.planets.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    fill: color,
                    fontFamily: "sans-serif",
                  }}
                >
                  {pts}
                </text>
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
              {title}
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
              {isSarva
                ? t("sarvashtakavarga", "(Sarvashtakavarga)")
                : t("bhinnashtakavarga", "(Bhinnashtakavarga)")}
            </text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <section className="table-panel">
      <h2>{t("ashtakavarga", "Ashtakavarga")}</h2>

      <div
        className="akv-planet-tabs"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "15px",
        }}
      >
        {/* Sarva (Total) - Full Width Button */}
        <button
          type="button"
          className={`akv-tab akv-sarva-btn ${activeTab === "Sarva" ? "active" : ""}`}
          onClick={() => setActiveTab("Sarva")}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            background: activeTab === "Sarva" ? "#8e44ad" : "#f9f0ff",
            color: activeTab === "Sarva" ? "#fff" : "#8e44ad",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {t("sarvaTotal", "Sarva (Total)")}
        </button>

        {/* Planet Buttons - Compact Horizontal Layout */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {planets.map((p) => (
            <button
              type="button"
              key={p}
              className={`akv-tab akv-planet-btn ${activeTab === p ? "active" : ""}`}
              onClick={() => setActiveTab(p)}
              style={{
                width: "42px",
                height: "40px",
                padding: "0",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                background: activeTab === p ? "#8e44ad" : "#fff",
                color: activeTab === p ? "#fff" : "#8e44ad",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "42px",
              }}
              title={t(p)}
            >
              {PLANET_ABBREVIATIONS[p]}
            </button>
          ))}
        </div>
      </div>

      <div id="akv-tables">
        {activeTab === "Sarva"
          ? (chartStyle === "north"
              ? renderNorthIndianGrid(sarva, true)
              : chartStyle === "east"
                ? renderEastIndianGrid(sarva, true)
                : renderGrid(sarva, true))
          : (chartStyle === "north"
              ? renderNorthIndianGrid(pras[activeTab] || {}, false)
              : chartStyle === "east"
                ? renderEastIndianGrid(pras[activeTab] || {}, false)
                : renderGrid(pras[activeTab] || {}, false))}
      </div>
    </section>
  );
}
