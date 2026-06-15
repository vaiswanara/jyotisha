import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const parseCustomDate = (dateStr) => {
  if (!dateStr) return 0;
  let ts = Date.parse(dateStr);
  if (!isNaN(ts)) return ts;
  ts = Date.parse(dateStr.replace(" - ", " "));
  if (!isNaN(ts)) return ts;
  return 0;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return dateStr;
  }
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const getLunarPhaseEmoji = (phasePct) => {
  if (phasePct < 0.125) return "🌑";
  if (phasePct < 0.25) return "🌒";
  if (phasePct < 0.375) return "🌓";
  if (phasePct < 0.5) return "🌔";
  if (phasePct < 0.625) return "🌕";
  if (phasePct < 0.75) return "🌖";
  if (phasePct < 0.875) return "🌗";
  return "🌘";
};

function calculateExactInterval(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return "-";
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start) || isNaN(end)) return "-";
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const parts = [];
  if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);
  return parts.join(" • ");
}

export function AdhikaMasaExplorer() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("adhika");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Trigger calculate on mount or mode change
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line
  }, [mode]);

  const handleCalculate = async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const file =
        mode === "adhika" ? "adhika_masa_data.json" : "kshaya_masa_data.json";
      const baseUrl = import.meta.env.BASE_URL;
      const res = await fetch(`${baseUrl}static/${file}`);
      if (!res.ok) throw new Error("Failed to fetch data.");
      const allData = await res.json();
      const dataList = allData.events || [];

      const selectedTs = new Date(date).getTime();
      const upcomingIndex = dataList.findIndex(
        (ev) => parseCustomDate(ev.start_datetime) >= selectedTs,
      );

      if (upcomingIndex === -1) {
        setError(
          `No upcoming ${mode === "adhika" ? "Adhika" : "Kṣhaya"} Māsa found after the selected date in our records.`,
        );
        setLoading(false);
        return;
      }

      const ev = dataList[upcomingIndex];
      const prevEv = upcomingIndex > 0 ? dataList[upcomingIndex - 1] : null;
      const prevStartStr = prevEv ? prevEv.start_datetime : null;
      const nextStartStr = ev.start_datetime;

      const threshold = ev.duration_days || 29.53;
      const previousTs = prevStartStr ? parseCustomDate(prevStartStr) : null;
      const nextTs = parseCustomDate(nextStartStr);
      const cycleStartTs = previousTs || selectedTs;
      const cycleEndTs = nextTs;

      let progress = 0;
      if (cycleEndTs && cycleEndTs > cycleStartTs) {
        progress = Math.max(
          0,
          Math.min(
            1,
            (selectedTs - cycleStartTs) / (cycleEndTs - cycleStartTs),
          ),
        );
      }
      const driftDays = progress * threshold;
      const driftMonth = driftDays / threshold;

      const events = (ev.timeline || [])
        .map((t) => ({
          name: t.event,
          datetime: t.datetime,
          type: t.type,
          lon: t.sun_longitude,
          timestamp: parseCustomDate(t.datetime),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setResult({
        masaName: ev.masa_name,
        start: ev.start_datetime,
        end: ev.end_datetime,
        duration: ev.duration_days,
        remaining: Math.max(
          0,
          Math.ceil(
            (parseCustomDate(ev.start_datetime) - selectedTs) /
              (1000 * 3600 * 24),
          ),
        ),
        events,
        prevStart: prevStartStr,
        nextStart: nextStartStr,
        driftDays,
        driftMonth,
        progress,
        threshold,
      });
    } catch (err) {
      console.error(err);
      setError(
        "Error fetching astronomical data. Please ensure JSON files are available.",
      );
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };
  const btnStyle = {
    background: mode === "adhika" ? "#8e44ad" : "#3498db",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  };

  return (
    <div className="form-panel" style={{ animation: "fadeIn 0.5s" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: mode === "adhika" ? "#8e44ad" : "#2980b9",
          }}
        >
          {mode === "adhika"
            ? "☀️ Adhika Māsa Explorer"
            : "🌑 Kṣhaya Māsa Explorer"}
        </h2>
        <div
          style={{
            display: "flex",
            gap: "5px",
            background: "#f1f2f6",
            padding: "4px",
            borderRadius: "8px",
          }}
        >
          <button
            onClick={() => setMode("adhika")}
            style={{
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              background: mode === "adhika" ? "#8e44ad" : "transparent",
              color: mode === "adhika" ? "#fff" : "#555",
            }}
          >
            Adhika
          </button>
          <button
            onClick={() => setMode("kshaya")}
            style={{
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              background: mode === "kshaya" ? "#3498db" : "transparent",
              color: mode === "kshaya" ? "#fff" : "#555",
            }}
          >
            Kṣhaya
          </button>
        </div>
      </div>

      <p style={{ color: "#636e72", marginBottom: "20px", lineHeight: "1.5" }}>
        Understand the rare astronomical synchronization between the Solar and
        Lunar calendars based on ancient Vedic calculations.
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginBottom: "30px",
          background: "#fdfefe",
          padding: "15px",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
              color: "#2d3436",
            }}
          >
            Select Reference Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button onClick={handleCalculate} style={btnStyle} disabled={loading}>
          {loading
            ? "⏳ Calculating..."
            : `✨ Find Next ${mode === "adhika" ? "Adhika" : "Kṣhaya"} Māsa`}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fdedec",
            color: "#c0392b",
            padding: "15px",
            borderRadius: "8px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {result && !loading && (
        <div style={{ animation: "fadeIn 0.5s" }}>
          {/* Hero Stats */}
          <div
            style={{
              background: mode === "adhika" ? "#fef9e7" : "#ebf5fb",
              borderLeft: `5px solid ${mode === "adhika" ? "#f39c12" : "#3498db"}`,
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.8rem",
                  color: mode === "adhika" ? "#d35400" : "#2980b9",
                }}
              >
                {result.masaName}
              </h3>
              <div
                style={{
                  color: "#2c3e50",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                }}
              >
                <strong>Starts:</strong> {formatDisplayDate(result.start)}{" "}
                <br />
                <strong>Ends:</strong> {formatDisplayDate(result.end)} <br />
                <strong>Duration:</strong> {result.duration} Lunar Days
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                background: "#fff",
                padding: "15px 25px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: mode === "adhika" ? "#e67e22" : "#3498db",
                }}
              >
                {result.remaining}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#7f8c8d",
                  textTransform: "uppercase",
                }}
              >
                Days to go
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "25px",
            }}
          >
            {/* Timeline */}
            <div>
              <h4
                style={{
                  margin: "0 0 15px 0",
                  color: "#2d3436",
                  fontSize: "1.2rem",
                  borderBottom: "2px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                🌌 Synchronization Timeline
              </h4>
              <div
                style={{
                  position: "relative",
                  marginLeft: "15px",
                  borderLeft: "2px solid #e2e8f0",
                  paddingBottom: "10px",
                }}
              >
                {result.events.map((ev, idx) => {
                  let icon = "✨";
                  let bgColor = "#f1f5f9";
                  let iconColor = "#64748b";

                  if (
                    ev.type === "amavasya_start" ||
                    ev.name.includes("Begins")
                  ) {
                    icon = "🌑";
                  } else if (
                    ev.type === "amavasya_end" ||
                    ev.name.includes("Completes")
                  ) {
                    icon = "🌑";
                  } else if (
                    ev.type === "sankranti" ||
                    ev.type === "solar" ||
                    ev.name.includes("Sankranti")
                  ) {
                    icon = "☀️";
                    bgColor = mode === "adhika" ? "#fef3c7" : "#e0e7ff";
                    iconColor = mode === "adhika" ? "#f59e0b" : "#6366f1";
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        paddingLeft: "25px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-17px",
                          top: "0",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: bgColor,
                          border: `2px solid ${iconColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          zIndex: 2,
                        }}
                      >
                        {icon}
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          border: "1px solid #f1f5f9",
                          padding: "12px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 5px 0",
                            color: "#1e293b",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {ev.name}
                          {ev.type === "sankranti" && mode === "adhika" && (
                            <span
                              style={{
                                color: "#c0392b",
                                background: "#fdedec",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "bold",
                              }}
                            >
                              ❌ Outside Lunar Month
                            </span>
                          )}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          {formatDisplayDate(ev.datetime)}
                        </p>
                        {ev.lon && (
                          <p
                            style={{
                              margin: "5px 0 0 0",
                              color: iconColor,
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            Sun: {ev.lon}
                          </p>
                        )}
                        {ev.type === "amavasya_end" && (
                          <div
                            style={{
                              marginTop: "10px",
                              display: "inline-block",
                              background: "#eafaf1",
                              border: "1px solid #2ecc71",
                              color: "#27ae60",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "bold",
                            }}
                          >
                            ✨ {mode === "adhika" ? "Adhika" : "Kṣhaya"} Māsa
                            Formed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Educational Insight & Interval */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    color: "#2d3436",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💡 Educational Insight
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    color: "#475569",
                    lineHeight: "1.6",
                  }}
                >
                  {mode === "adhika"
                    ? "Because the Sun did not change zodiac signs before the lunar month ended, no Sankranti occurred within the lunar cycle. Therefore, an extra month (Adhika Māsa) was formed naturally to synchronize the calendars."
                    : "During this lunar cycle, the Sun crossed two zodiac boundaries before the next Amavasya occurred. Because two Sankrantis occurred within one lunar cycle, one lunar month was skipped (Kṣhaya Māsa)."}
                </p>
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
                }}
              >
                <h4 style={{ margin: "0 0 15px 0", color: "#2d3436" }}>
                  🔄 Actual Interval Cycle
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px dashed #e2e8f0",
                      paddingBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Previous Occurrence:
                    </span>
                    <strong style={{ color: "#2c3e50", fontSize: "0.9rem" }}>
                      {result.prevStart
                        ? formatDisplayDate(result.prevStart).split(" - ")[0]
                        : "-"}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px dashed #e2e8f0",
                      paddingBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Upcoming Occurrence:
                    </span>
                    <strong style={{ color: "#2c3e50", fontSize: "0.9rem" }}>
                      {result.nextStart
                        ? formatDisplayDate(result.nextStart).split(" - ")[0]
                        : "-"}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "5px",
                    }}
                  >
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Exact Astronomical Gap:
                    </span>
                    <strong
                      style={{
                        color: mode === "adhika" ? "#d35400" : "#2980b9",
                        fontSize: "0.9rem",
                      }}
                    >
                      {result.prevStart && result.nextStart
                        ? calculateExactInterval(
                            result.prevStart,
                            result.nextStart,
                          )
                        : "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {mode === "kshaya" && (
                <div
                  style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: "0 0 5px 0", fontSize: "1.5rem" }}>☄️</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "#64748b",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>Extremely Rare:</strong> Kṣhaya Māsa occurs at
                    irregular intervals (often 19 to 141 years) when Earth is
                    near perihelion, causing the Sun's apparent motion to
                    accelerate.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drift Display Section */}
          {mode === "adhika" && (
            <div
              style={{
                background: "#1e293b",
                padding: "30px",
                borderRadius: "12px",
                color: "#fff",
                marginTop: "30px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px 0",
                  color: "#f39c12",
                  fontSize: "1.3rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                🌊 Solar–Lunar Drift Since Last Synchronization
              </h3>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.95rem",
                  marginBottom: "25px",
                  lineHeight: "1.6",
                }}
              >
                Adhika Māsa occurs when Solar–Lunar drift approaches one lunar
                month. After synchronization, the drift cycle begins again.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      color: "#fff",
                      lineHeight: "1",
                    }}
                  >
                    {result.driftDays.toFixed(2)} Days
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#f39c12",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginTop: "8px",
                    }}
                  >
                    Accumulated Drift
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      marginBottom: "5px",
                      filter: "grayscale(100%)",
                      opacity: 0.7,
                    }}
                  >
                    {getLunarPhaseEmoji(result.driftMonth)}
                  </span>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#e2e8f0",
                      lineHeight: "1",
                    }}
                  >
                    {result.driftMonth.toFixed(2)} Mo
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginTop: "8px",
                    }}
                  >
                    Lunar Month Equivalent
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "20px",
                  height: "12px",
                  width: "100%",
                  marginBottom: "10px",
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, #3498db, #9b59b6, #f39c12)",
                    height: "100%",
                    width: `${(result.progress * 100).toFixed(1)}%`,
                    transition: "width 1s ease-in-out",
                    borderRadius: "20px",
                  }}
                ></div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                <span>
                  0 Days
                  <br />
                  (Perfect Sync)
                </span>
                {result.progress >= 0.98 && (
                  <span style={{ color: "#f39c12" }}>
                    ✨ Adhika Māsa Triggered
                  </span>
                )}
                <span style={{ textAlign: "right" }}>
                  ~{result.threshold.toFixed(2)} Days
                  <br />
                  (Current Threshold)
                </span>
              </div>

              {/* Vedic Astronomy Insight */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(243, 156, 18, 0.3)",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "25px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: "#f39c12",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ✨ Vedic Astronomy Insight
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                  }}
                >
                  <strong style={{ color: "#fff" }}>
                    Indian Panchanga does not depend on fixed arithmetic
                    assumptions. It follows real-time celestial motion.
                  </strong>
                  <br />
                  <br />
                  Average lunar month ≈ 29.53 days, but actual synchronization
                  thresholds vary slightly because real Sun–Moon motion is
                  dynamic.
                  <strong
                    style={{
                      color: "rgba(243, 156, 18, 0.9)",
                      display: "block",
                      marginTop: "10px",
                    }}
                  >
                    For the selected date, the drift is calculated within the{" "}
                    {formatShortDate(result.prevStart)} to{" "}
                    {formatShortDate(result.nextStart)} Adhika Māsa cycle. This
                    cycle reaches its synchronization threshold at about{" "}
                    {result.threshold.toFixed(2)} days.
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Math Behind the Magic */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "2px dashed #f1f5f9",
            }}
          >
            <h3
              style={{
                margin: "0 0 25px 0",
                color: "#2d3436",
                fontSize: "1.5rem",
                textAlign: "center",
                fontWeight: "800",
              }}
            >
              The Math Behind the Magic
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                {
                  title: "Solar Year",
                  value: "365.24 Days",
                  desc: "Time taken by Earth to orbit the Sun.",
                },
                {
                  title: "Lunar Year",
                  value: "354.36 Days",
                  desc: "12 Synodic lunar months.",
                },
                {
                  title: "Mismatch",
                  value: "~11 Days/Yr",
                  desc: "The gap between Solar and Lunar cycles.",
                },
                {
                  title: "Typical Interval",
                  value: "~32–34 Months",
                  desc: "Actual occurrence varies dynamically based on real Solar–Lunar motion.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 10px 0",
                      color: "#64748b",
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      color: "#d35400",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.value}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
