import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Helper function to estimate Timezone from Longitude and Latitude
function estimateTzFromLon(lon, lat) {
  if (lat !== undefined && lon >= 68 && lon <= 97 && lat >= 6 && lat <= 37)
    return 5.5;
  if (lat !== undefined && lon >= 80 && lon <= 88 && lat >= 26 && lat <= 30)
    return 5.75;
  if (lat !== undefined && lon >= 92 && lon <= 102 && lat >= 10 && lat <= 28)
    return 6.5;
  if (lat !== undefined && lon >= 79 && lon <= 82 && lat >= 5 && lat <= 10)
    return 5.5;
  if (
    lat !== undefined &&
    lon >= 112 &&
    lon <= 154 &&
    lat >= -44 &&
    lat <= -10
  ) {
    return lon < 130 ? 9.5 : 10;
  }
  return Math.round((lon / 15) * 2) / 2;
}

export function LocationAutocomplete({ city, onLocationSelect }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(city || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    setQuery(city || "");
  }, [city]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);
    setActiveIndex(-1);

    if (val.length < 3) {
      setSuggestions([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&addressdetails=1`,
          {
            signal: abortControllerRef.current.signal,
            headers: { "Accept-Language": "en" },
          },
        );
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("Location fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Tab") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]); // సగం టైప్ చేసి Tab నొక్కితే మొదటిది సెలెక్ట్ అవుతుంది
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat).toFixed(4);
    const lon = parseFloat(place.lon).toFixed(4);
    const tz = estimateTzFromLon(parseFloat(lon), parseFloat(lat));

    setQuery(place.display_name);
    setShowDropdown(false);
    onLocationSelect({
      city: place.display_name,
      latitude: lat,
      longitude: lon,
      timezone: tz.toString(),
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
      <label
        style={{
          fontWeight: "bold",
          color: "#2c3e50",
          fontSize: "13.5px",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {t("place", "Place")}:
      </label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.target.select()}
        onClick={(e) => e.target.select()}
        placeholder={t("typeCityName", "Type city name...")}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />

      {showDropdown && (suggestions.length > 0 || loading) && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginTop: "4px",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "10px",
                color: "#666",
                fontStyle: "italic",
                fontSize: "14px",
              }}
            >
              {t("searchingPlaces", "Searching places...")}
            </div>
          ) : (
            suggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(s)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  background: idx === activeIndex ? "#f0fdf4" : "white",
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {s.display_name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
