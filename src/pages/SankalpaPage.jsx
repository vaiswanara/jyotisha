import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchBirthChart } from "../services/astrologyApi.js";
import Sankalpa from "../components/Sankalpa.jsx";
import { getLocalDateStr } from "../utils/formatters.js";

export function SankalpaPage({ onNavigate }) {
  const { t } = useTranslation();
  const [transitChart, setTransitChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const defLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null"
    );
    const tz = defLoc?.timezone || 5.5;
    return getLocalDateStr(tz);
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  const [isPickerOpen, setIsPickerOpen] = useState(true);

  useEffect(() => {
    const loadTransitChart = async () => {
      setIsLoading(true);
      try {
        const defLoc = JSON.parse(
          localStorage.getItem("vaiswanara_default_location") || "null"
        );
        const transitLat = defLoc?.latitude || 12.9716;
        const transitLon = defLoc?.longitude || 77.5946;
        const transitTz = defLoc?.timezone || 5.5;

        const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
        const ayanamsha = prefs.ayanamsha_val || "lahiri";

        const transitCacheKey = `sankalpa_transit_${selectedDate}_${selectedTime}_${transitLat}_${transitLon}_${ayanamsha}`;

        let cachedTransit = null;
        try {
          cachedTransit = JSON.parse(localStorage.getItem(transitCacheKey));
        } catch (e) {}

        if (cachedTransit && cachedTransit.planets) {
          setTransitChart(cachedTransit);
        } else {
          const res = await fetchBirthChart({
            dob: selectedDate,
            tob: selectedTime + ":00",
            latitude: transitLat,
            longitude: transitLon,
            timezone: transitTz,
            ayanamsha: ayanamsha,
          });
          if (res && res.planets) {
            localStorage.setItem(transitCacheKey, JSON.stringify(res));
            setTransitChart(res);
          }
        }
      } catch (err) {
        console.error("Error loading transit chart for Sankalpa:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransitChart();
  }, [selectedDate, selectedTime]);

  return (
    <main className="page">
      <section
        className="workspace"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0px",
          paddingTop: "0px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 10px auto",
            padding: "0 15px",
            boxSizing: "border-box",
            alignSelf: "stretch",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#d35400",
              fontSize: "1.8rem",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {t("Sankalpa", "Sankalpa")}
          </h2>
          <button
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            style={{
              background: "none",
              border: "none",
              padding: "5px 0",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#7f8c8d",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
              width: "auto",
              minHeight: "unset",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#333";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#7f8c8d";
            }}
          >
            🗓️ {t("editDateLabel", "Edit Date")} {isPickerOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Date & Time Selection (Collapsable) */}
        {isPickerOpen && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "400px",
              margin: "0 auto 10px auto",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "0.95rem",
                minWidth: "120px",
              }}
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "0.95rem",
                minWidth: "90px",
              }}
            />
          </div>
        )}

        {/* Sankalpa Component */}
        <div
          style={{
            marginTop: "0px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1000px" }}>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "50px 0", color: "#d35400", fontWeight: "bold" }}>
                {t("processingWait", "Loading...")}
              </div>
            ) : (
              transitChart && (
                <Sankalpa onNavigate={onNavigate} transitChart={transitChart} hideTitle={true} />
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
