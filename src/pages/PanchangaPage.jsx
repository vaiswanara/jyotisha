import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { AdhikaMasaExplorer } from "../components/AdhikaMasaExplorer.jsx";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";
import { EclipsePage } from "./EclipsePage.jsx";
import { getLocalDateStr } from "../utils/formatters.js";
import { RashiChart } from "../components/RashiChart.jsx";
import { triggerDownload } from "../utils/downloadHelper.js";

const renderIntervalList = (valString) => {
  if (!valString || valString === "-") return "-";
  const parts = valString.split(",").map((p) => p.trim());
  if (parts.length === 1) return parts[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {parts.map((p, idx) => (
        <span key={idx}>{p}</span>
      ))}
    </div>
  );
};


const NORTH_INDIAN_LAYOUT_280 = {
  1: { rashi: { x: 140, y: 31 }, planets: { x: 140, y: 79 } },
  2: { rashi: { x: 70, y: 22 }, planets: { x: 70, y: 48 } },
  3: { rashi: { x: 22, y: 70 }, planets: { x: 48, y: 70 } },
  4: { rashi: { x: 31, y: 140 }, planets: { x: 79, y: 140 } },
  5: { rashi: { x: 22, y: 210 }, planets: { x: 48, y: 210 } },
  6: { rashi: { x: 70, y: 258 }, planets: { x: 70, y: 232 } },
  7: { rashi: { x: 140, y: 249 }, planets: { x: 140, y: 201 } },
  8: { rashi: { x: 210, y: 258 }, planets: { x: 210, y: 232 } },
  9: { rashi: { x: 258, y: 210 }, planets: { x: 232, y: 210 } },
  10: { rashi: { x: 249, y: 140 }, planets: { x: 201, y: 140 } },
  11: { rashi: { x: 258, y: 70 }, planets: { x: 232, y: 80 } },
  12: { rashi: { x: 210, y: 22 }, planets: { x: 210, y: 48 } },
};

const tabStyle = {
  minWidth: 0,
  width: "100%",
  padding: "10px 0px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "clamp(13px, 2.5vw, 14px)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Arudra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const TARA_NAMES = {
  1: "Janma",
  2: "Sampat",
  3: "Vipat",
  4: "Kshema",
  5: "Pratyak",
  6: "Sadhana",
  7: "Naidhana",
  8: "Mitra",
  0: "Parama Mitra",
};
const RASI_NAMES = [
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

const PANCHANGA_ALL_COLUMNS = [
  "Date",
  "Asthg",
  "Maasa",
  "Tithi",
  "Tithi End",
  "Vaara",
  "Nakshatra",
  "Nakshatra End",
  "Yoga",
  "Yoga End",
  "Karana",
  "Karana End",
  "Rahu Kalam",
  "Sunrise",
  "Moon Rasi",
  "Durmuhurtham",
  "Yamagandam",
  "Varjyam",
  "Girl Tarabalam",
  "Girl Chandra Balam",
  "Boy Tarabalam",
  "Boy Chandra Balam"
];

function normalizeRow(row) {
  if (!row) return row;
  const norm = {};
  PANCHANGA_ALL_COLUMNS.forEach((col) => {
    const spaceKey = col;
    const underscoreKey = col.replace(/ /g, "_");
    let val = "";
    if (row[spaceKey] !== undefined && row[spaceKey] !== null) {
      val = String(row[spaceKey]);
    } else if (row[underscoreKey] !== undefined && row[underscoreKey] !== null) {
      val = String(row[underscoreKey]);
    }
    norm[spaceKey] = val;
    norm[underscoreKey] = val;
  });
  Object.keys(row).forEach((k) => {
    if (k.endsWith("_is_good")) {
      norm[k] = row[k];
    }
  });
  return norm;
}

function normalizeMuhurthaRow(row) {
  if (!row) return row;
  const norm = {};
  norm["Priority"] = row["Priority"] !== undefined && row["Priority"] !== null ? String(row["Priority"]) : "";
  norm["Muhurtha_Notes"] = row["Muhurtha_Notes"] !== undefined && row["Muhurtha_Notes"] !== null
    ? String(row["Muhurtha_Notes"])
    : (row["Muhurtha Notes"] !== undefined && row["Muhurtha Notes"] !== null ? String(row["Muhurtha Notes"]) : "");
  norm["Muhurtha Notes"] = norm["Muhurtha_Notes"];

  PANCHANGA_ALL_COLUMNS.forEach((col) => {
    const spaceKey = col;
    const underscoreKey = col.replace(/ /g, "_");
    let val = "";
    if (row[spaceKey] !== undefined && row[spaceKey] !== null) {
      val = String(row[spaceKey]);
    } else if (row[underscoreKey] !== undefined && row[underscoreKey] !== null) {
      val = String(row[underscoreKey]);
    }
    norm[spaceKey] = val;
    norm[underscoreKey] = val;
  });
  Object.keys(row).forEach((k) => {
    if (k.endsWith("_is_good")) {
      norm[k] = row[k];
    }
  });
  return norm;
}
const NAK_TO_RASI = {
  0: [0],
  1: [0],
  2: [0, 1],
  3: [1],
  4: [1, 2],
  5: [2],
  6: [2, 3],
  7: [3],
  8: [3],
  9: [4],
  10: [4],
  11: [4, 5],
  12: [5],
  13: [5, 6],
  14: [6],
  15: [6, 7],
  16: [7],
  17: [7],
  18: [8],
  19: [8],
  20: [8, 9],
  21: [9],
  22: [9, 10],
  23: [10],
  24: [10, 11],
  25: [11],
  26: [11],
};

function convertMuhurthaChartArrayToPlanets(chartArray) {
  const planetsObj = {};
  const planetCodeMap = {
    Lg: "Ascendant",
    Su: "Sun",
    Ch: "Moon",
    Ku: "Mars",
    Bu: "Mercury",
    Gu: "Jupiter",
    Sk: "Venus",
    Sa: "Saturn",
    Ra: "Rahu",
    Ke: "Ketu",
  };

  if (!chartArray || !Array.isArray(chartArray)) return planetsObj;

  chartArray.forEach((rashiPlanets, rashiIndex) => {
    const rashiNum = rashiIndex + 1;
    if (Array.isArray(rashiPlanets)) {
      rashiPlanets.forEach((p) => {
        const id = p.id || p;
        const name = planetCodeMap[id] || id;
        planetsObj[name] = {
          rashi: rashiNum,
          retrograde: Boolean(p.isR || p.retrograde),
          combust: Boolean(p.isC || p.combust),
        };
      });
    }
  });
  return planetsObj;
}

export function PanchangaPage({ logoUrl, onNavigate }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("search");
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isPanShudhiActive, setIsPanShudhiActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [displayColumns, setDisplayColumns] = useState([]);

  const [showLunarMonthsModal, setShowLunarMonthsModal] = useState(false);
  const [lunarMonthsData, setLunarMonthsData] = useState([]);

  const visibleKeys = displayColumns
    .map((k) => k.replace(/_/g, " "))
    .filter((k) => PANCHANGA_ALL_COLUMNS.includes(k));

  // Muhurtha States
  const [savedProfilesList, setSavedProfilesList] = useState([]);
  const [selectedProfileName, setSelectedProfileName] = useState("");
  const [selectedProfileLocation, setSelectedProfileLocation] = useState(null);
  const [muhurthaData, setMuhurthaData] = useState([]);
  const CleanMuhurthaData = Array.isArray(muhurthaData) ? muhurthaData : [];
  const muhurthaDataRef = useRef([]);
  const setMuhurthaDataAndRef = (data) => {
    muhurthaDataRef.current = data;
    setMuhurthaData(data);
  };
  const [muhurthaColumns, setMuhurthaColumns] = useState([]);
  const [muhurthaSelectedRows, setMuhurthaSelectedRows] = useState(new Set());
  const [isMuhurthaTableOpen, setIsMuhurthaTableOpen] = useState(true);
  const [muhurthaForm, setMuhurthaForm] = useState({
    boyCheck: false,
    boyNakshatra: "",
    girlCheck: false,
    girlNakshatra: "",
    pdfMessage: "",
  });

  // Chart States
  const [chartDateSelect, setChartDateSelect] = useState("");
  const [chartDate, setChartDate] = useState("");
  const [chartTime, setChartTime] = useState("06:00:00");
  const [chartSelectedInfo, setChartSelectedInfo] = useState(null);
  const [muhurthaChartData, setMuhurthaChartData] = useState(null);
  const [globalNotes, setGlobalNotes] = useState("");
  const [showDoshaInfo, setShowDoshaInfo] = useState(false);
  const [chartStyle, setChartStyle] = useState(() => {
    return localStorage.getItem("vaiswanara_chart_style") || "south";
  });

  const [customEvents, setCustomEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("jyotisha_custom_events") || "[]");
  });
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const customEventsCsvRef = useRef(null);

  const handleAddCustomEvent = () => {
    if (!newEventTitle.trim() || !newEventDate) return;
    if (editingEventId) {
      const updated = customEvents.map((ev) => {
        if (ev.id === editingEventId) {
          return { ...ev, date: newEventDate, title: newEventTitle.trim() };
        }
        return ev;
      });
      setCustomEvents(updated);
      localStorage.setItem("jyotisha_custom_events", JSON.stringify(updated));
      setEditingEventId(null);
    } else {
      const newEvent = {
        id: Math.random().toString(36).substring(2, 9),
        date: newEventDate,
        title: newEventTitle.trim(),
      };
      const updated = [...customEvents, newEvent];
      setCustomEvents(updated);
      localStorage.setItem("jyotisha_custom_events", JSON.stringify(updated));
    }
    setNewEventTitle("");
    setNewEventDate("");
  };

  const handleDeleteCustomEvent = (id) => {
    const updated = customEvents.filter((ev) => ev.id !== id);
    setCustomEvents(updated);
    localStorage.setItem("jyotisha_custom_events", JSON.stringify(updated));
    if (editingEventId === id) {
      setEditingEventId(null);
      setNewEventTitle("");
      setNewEventDate("");
    }
  };

  const startEditEvent = (ev) => {
    setNewEventTitle(ev.title);
    setNewEventDate(ev.date);
    setEditingEventId(ev.id);
  };

  const handleCancelEdit = () => {
    setNewEventTitle("");
    setNewEventDate("");
    setEditingEventId(null);
  };

  const exportCustomEventsCSV = () => {
    if (customEvents.length === 0) {
      alert("No events to export.");
      return;
    }
    const csvRows = [
      `"Date","Title"`
    ];
    customEvents.forEach((ev) => {
      const row = [
        `"${ev.date}"`,
        `"${ev.title.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });
    downloadFile(
      csvRows.join("\n"),
      "jyotisha_custom_events.csv",
      "text/csv"
    );
  };

  const parseFlexDate = (dateStr) => {
    if (!dateStr) return null;
    const cleaned = dateStr.trim();

    // Check if it matches YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    // Try parsing DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      if (parseInt(month, 10) > 12) {
        // Treat as MM-DD-YYYY
        return `${year}-${day}-${month}`;
      }
      return `${year}-${month}-${day}`;
    }

    // Fallback to standard JS Date parsing
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const d = String(parsed.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    return null;
  };

  const handleImportCustomEventsCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        if (lines.length < 2) {
          alert("CSV file is empty or invalid.");
          return;
        }
        const headers = lines[0]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());

        const dateIdx = headers.indexOf("date");
        const titleIdx = headers.indexOf("title");
        if (dateIdx === -1 || titleIdx === -1) {
          alert("CSV headers must include 'Date' and 'Title'.");
          return;
        }

        const parsedEvents = [];
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"'));

          const rawDate = currentLine[dateIdx];
          const rawTitle = currentLine[titleIdx];
          if (rawDate && rawTitle) {
            const formattedDate = parseFlexDate(rawDate);
            if (formattedDate) {
              parsedEvents.push({
                id: Math.random().toString(36).substring(2, 9),
                date: formattedDate,
                title: rawTitle.trim()
              });
            }
          }
        }

        if (parsedEvents.length === 0) {
          alert("No valid events found to import.");
          return;
        }

        const confirmMerge = window.confirm(
          `Found ${parsedEvents.length} events.\n\nClick OK to MERGE with existing events.\nClick Cancel to REPLACE all existing events.`
        );

        let updated = [];
        if (confirmMerge) {
          updated = [...customEvents];
          parsedEvents.forEach((pe) => {
            if (!updated.some((ue) => ue.date === pe.date && ue.title.toLowerCase() === pe.title.toLowerCase())) {
              updated.push(pe);
            }
          });
        } else {
          updated = parsedEvents;
        }

        setCustomEvents(updated);
        localStorage.setItem("jyotisha_custom_events", JSON.stringify(updated));
        alert("Events imported successfully!");
      } catch (err) {
        alert("Error parsing CSV: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const customEventsJsonRef = useRef(null);

  const exportCustomEventsJSON = () => {
    if (customEvents.length === 0) {
      alert("No events to export.");
      return;
    }
    const exportObj = {
      type: "jyotisha_custom_events_backup",
      version: "1.0",
      exported: new Date().toISOString(),
      jyotisha_custom_events: customEvents
    };
    downloadFile(
      JSON.stringify(exportObj, null, 2),
      `jyotisha_custom_events_${getLocalDateStr(5.5)}.json`,
      "application/json"
    );
  };

  const handleImportCustomEventsJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const incomingEvents = Array.isArray(parsed)
          ? parsed
          : (parsed.jyotisha_custom_events || parsed.data?.jyotisha_custom_events || []);

        if (incomingEvents.length === 0) {
          alert("No valid custom events found in JSON.");
          return;
        }

        const confirmMerge = window.confirm(
          `Found ${incomingEvents.length} events.\n\nClick OK to MERGE with existing events.\nClick Cancel to REPLACE all existing events.`
        );

        let updated = [];
        if (confirmMerge) {
          updated = [...customEvents];
          incomingEvents.forEach((pe) => {
            if (pe.date && pe.title && !updated.some((ue) => ue.date === pe.date && ue.title.toLowerCase() === pe.title.toLowerCase())) {
              updated.push({
                id: pe.id || Math.random().toString(36).substring(2, 9),
                date: pe.date,
                title: pe.title.trim()
              });
            }
          });
        } else {
          updated = incomingEvents.map((pe) => ({
            id: pe.id || Math.random().toString(36).substring(2, 9),
            date: pe.date,
            title: pe.title.trim()
          }));
        }

        setCustomEvents(updated);
        localStorage.setItem("jyotisha_custom_events", JSON.stringify(updated));
        alert("Events imported successfully!");
      } catch (err) {
        alert("Error parsing JSON: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const clearCustomEvents = () => {
    if (window.confirm("Are you sure you want to DELETE ALL saved events? This action cannot be undone.")) {
      setCustomEvents([]);
      localStorage.removeItem("jyotisha_custom_events");
      setEditingEventId(null);
      setNewEventTitle("");
      setNewEventDate("");
      alert("All custom events deleted successfully.");
    }
  };

  useEffect(() => {
    const handleStyleChange = () => {
      setChartStyle(localStorage.getItem("vaiswanara_chart_style") || "south");
    };
    window.addEventListener("vaiswanara_chart_style_changed", handleStyleChange);
    return () => {
      window.removeEventListener("vaiswanara_chart_style_changed", handleStyleChange);
    };
  }, []);

  const searchCsvRef = useRef(null);
  const muhurthaCsvRef = useRef(null);
  const cacheRef = useRef({}); // 🚀 API డేటాను సేవ్ చేసుకోవడానికి క్యాచే
  const [loadProfileName, setLoadProfileName] = useState("");

  const [formData, setFormData] = useState(() => {
    const defLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null",
    );
    const tz = defLoc?.timezone || 5.5;
    return {
      profileName: "Panchanga",
      startDate: getLocalDateStr(tz),
      days: 10,
      city: defLoc?.city || "Bengaluru, Karnataka",
      lat: defLoc?.latitude || 12.9716,
      lon: defLoc?.longitude || 77.5946,
      tz: tz,
      boyCheck: false,
      boyNakshatra: "",
      girlCheck: false,
      girlNakshatra: "",
    };
  });

  const syncPreferences = () => {
    const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");

    const desiredOrder = [
      "Date",
      "Asthg",
      "Maasa",
      "Tithi",
      "Tithi_End",
      "Vaara",
      "Nakshatra",
      "Nakshatra_End",
      "Yoga",
      "Yoga_End",
      "Karana",
      "Karana_End",
      "Rahu_Kalam",
      "Sunrise",
      "Moon_Rasi",
      "Durmuhurtham",
      "Yamagandam",
      "Varjyam",
      "Girl_Tarabalam",
      "Girl_Chandra_Balam",
      "Boy_Tarabalam",
      "Boy_Chandra_Balam",
    ];
    const pCols =
      prefs.panchanga_columns && prefs.panchanga_columns.length > 0
        ? prefs.panchanga_columns
        : desiredOrder;
    const sortedCols = desiredOrder.filter((c) => pCols.includes(c));
    setDisplayColumns(sortedCols);

    const defaultMuhurthaCols = [
      "Priority",
      "Date",
      "Vaara",
      "Asthg",
      "Maasa",
      "Tithi",
      "Sunrise",
      "Nakshatra",
      "Moon_Rasi",
      "Yoga",
      "Karana",
      "Rahu_Kalam",
      "Yamagandam",
      "Durmuhurtham",
      "Varjyam",
      "Boy_Tarabalam",
      "Boy_Chandra_Balam",
      "Girl_Tarabalam",
      "Girl_Chandra_Balam",
      "Muhurtha_Notes",
    ];
    const mCols =
      prefs.muhurtha_ui_columns && prefs.muhurtha_ui_columns.length > 0
        ? prefs.muhurtha_ui_columns
        : defaultMuhurthaCols;
    setMuhurthaColumns(mCols);

    return prefs;
  };

  useEffect(() => {
    syncPreferences();
  }, []);

  useEffect(() => {
    syncPreferences();
    const saved = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    setSavedProfilesList(Object.keys(saved));
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoadPanchangaProfile = () => {
    if (!loadProfileName) {
      return alert("Please select a saved table to load!");
    }
    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (savedProfiles[loadProfileName]) {
      const data = savedProfiles[loadProfileName];
      const rows = Array.isArray(data) ? data : data.rows || [];
      const prefs = syncPreferences();
      evaluatePanShudhiFlags(rows, prefs);
      const normalizedRows = rows.map(normalizeRow);
      setResultData(normalizedRows);
      setOriginalData(JSON.parse(JSON.stringify(normalizedRows)));
      setIsPanShudhiActive(false);
      setSelectedRows(new Set());

      if (data.location && !Array.isArray(data)) {
        setFormData((prev) => ({
          ...prev,
          city: data.location.city || prev.city,
          lat: data.location.lat || prev.lat,
          lon: data.location.lon || prev.lon,
          tz: data.location.tz || prev.tz,
          profileName: loadProfileName,
        }));
      }
      alert(`Loaded table "${loadProfileName}" successfully!`);
    } else {
      alert("Profile not found!");
    }
  };

  const evaluatePanShudhiFlags = (dataArray, prefs) => {
    if (!dataArray || !Array.isArray(dataArray)) return;
    const isGood = (val, arr) =>
      Array.isArray(arr) ? arr.includes(val) : false;

    dataArray.forEach((row) => {
      if (row.Maasa !== undefined)
        row.Maasa_is_good = isGood(row.Maasa, prefs.maasa);
      if (row.Vaara !== undefined)
        row.Vaara_is_good = isGood(row.Vaara, prefs.vaara);
      if (row.Tithi !== undefined) {
        let tCheck = String(row.Tithi)
          .replace("Shukla ", "S-")
          .replace("Krishna ", "K-");
        row.Tithi_is_good =
          isGood(tCheck, prefs.tithi) || isGood(row.Tithi, prefs.tithi);
      }
      if (row.Nakshatra !== undefined)
        row.Nakshatra_is_good = isGood(row.Nakshatra, prefs.nakshatra);
      if (row.Yoga !== undefined)
        row.Yoga_is_good = isGood(row.Yoga, prefs.yoga);
      if (row.Karana !== undefined)
        row.Karana_is_good = isGood(row.Karana, prefs.karana);
      if (row["Girl Tarabalam"])
        row.Girl_Tarabalam_is_good = isGood(
          row["Girl Tarabalam"],
          prefs.tarabalam,
        );
      if (row["Boy Tarabalam"])
        row.Boy_Tarabalam_is_good = isGood(
          row["Boy Tarabalam"],
          prefs.tarabalam,
        );
    });
  };

  const handleCalculate = async () => {
    if (!formData.startDate || !formData.lat) {
      alert("Please select a Start Date and valid Location!");
      return;
    }

    const maxDays = Number(import.meta.env.VITE_MAX_PANCHANGA_DAYS) || 50;
    if (formData.days > maxDays) {
      alert(`Please select ${maxDays} days or less!`);
      return;
    }

    const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
    const ayanamsha = prefs.ayanamsha_val || "lahiri";

    // 🚀 Cache Key తయారు చేయడం (ఈ వివరాలతో ముందే వెతికితే సర్వర్ కి వెళ్లకూడదు)
    const cacheKey = JSON.stringify({
      date: formData.startDate,
      days: formData.days,
      lat: formData.lat,
      lon: formData.lon,
      tz: formData.tz,
      ayanamsha: ayanamsha,
      boyCheck: formData.boyCheck,
      boyNakshatra: formData.boyNakshatra,
      girlCheck: formData.girlCheck,
      girlNakshatra: formData.girlNakshatra
    });

    // ముందే డేటా ఉంటే తక్షణమే లోడ్ చేయడం (No API Call)
    if (cacheRef.current[cacheKey]) {
      const cachedData = cacheRef.current[cacheKey];
      setResultData(cachedData);
      setOriginalData(JSON.parse(JSON.stringify(cachedData)));
      setIsPanShudhiActive(false);
      setSelectedRows(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        endpoint: "panchanga_table",
        date: formData.startDate,
        days: formData.days,
        lat: formData.lat,
        lon: formData.lon,
        tz: formData.tz,
        ayanamsha: ayanamsha,
        rahu_mode: localStorage.getItem("rahu_mode") || "mean",
        _t: Date.now(),
      });
      if (formData.boyCheck && formData.boyNakshatra)
        params.append("boy_nakshatra", formData.boyNakshatra);
      if (formData.girlCheck && formData.girlNakshatra)
        params.append("girl_nakshatra", formData.girlNakshatra);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: { "x-api-token": API_TOKEN }
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      const syncPrefs = syncPreferences();
      evaluatePanShudhiFlags(data, syncPrefs);
      const normalizedData = data.map(normalizeRow);

      // భవిష్యత్తు కోసం రిజల్ట్ ని క్యాచ్ లో సేవ్ చేయడం
      cacheRef.current[cacheKey] = normalizedData;
      setResultData(normalizedData);
      setOriginalData(JSON.parse(JSON.stringify(normalizedData)));
      setIsPanShudhiActive(false);
      setSelectedRows(new Set());
    } catch (err) {
      console.error("Calculation Error:", err);
      alert("Failed to calculate. The server might be busy or offline.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatUtcInTimezone = (utcStr, tzOffsetHours) => {
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return "";
    const utcMs = d.getTime();
    const targetMs = utcMs + parseFloat(tzOffsetHours || 0) * 3600000;
    const targetDate = new Date(targetMs);
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(targetDate.getUTCDate());
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[targetDate.getUTCMonth()];
    const year = targetDate.getUTCFullYear();
    let hr = targetDate.getUTCHours();
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12 || 12;
    const min = pad(targetDate.getUTCMinutes());
    return `${day}-${month}-${year} ${pad(hr)}:${min} ${ampm}`;
  };

  const fetchLunarMonths = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}static/masa.json`);
      if (!res.ok) throw new Error("Failed to load masa.json");
      const allMonths = await res.json();

      const selectedDate = formData.startDate || new Date().toISOString().split("T")[0];
      const chosen = new Date(selectedDate);

      const futureMonths = allMonths.filter((m) => new Date(m.end) > chosen);
      const next12 = futureMonths.slice(0, 12).map((m) => ({
        masa: m.masa,
        startDate: formatUtcInTimezone(m.start, formData.tz),
        endDate: formatUtcInTimezone(m.end, formData.tz),
      }));

      setLunarMonthsData(next12);
      setShowLunarMonthsModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load lunar months: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPanShudhi = () => {
    if (!originalData || originalData.length === 0) return;
    if (isPanShudhiActive) {
      setResultData(JSON.parse(JSON.stringify(originalData)));
      setIsPanShudhiActive(false);
    } else {
      const filtered = originalData.filter(
        (row) =>
          row["Vaara_is_good"] &&
          row["Tithi_is_good"] &&
          row["Nakshatra_is_good"] &&
          row["Yoga_is_good"] &&
          row["Karana_is_good"],
      );
      if (filtered.length === 0) {
        alert(
          "No dates match the strict Pan Shudhi criteria in the selected range!",
        );
        return;
      }
      setResultData(filtered);
      setIsPanShudhiActive(true);
    }
    setSelectedRows(new Set());
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(new Set(resultData.map((_, i) => i)));
    else setSelectedRows(new Set());
  };

  const toggleRowSelect = (index) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedRows(newSet);
  };

  const toggleMuhurthaRowSelect = (index) => {
    const newSet = new Set(muhurthaSelectedRows);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setMuhurthaSelectedRows(newSet);
  };

  const saveSelectedDates = () => {
    if (selectedRows.size === 0)
      return alert("Please select at least one date from the table!");

    let profileName = formData.profileName.trim() || "Panchanga";
    const selectedData = Array.from(selectedRows)
      .sort((a, b) => a - b)
      .map((idx) => resultData[idx]);
    const locationObj = {
      city: formData.city,
      lat: formData.lat,
      lon: formData.lon,
      tz: formData.tz,
    };
    let savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );

    if (savedProfiles[profileName]) {
      const overwrite = window.confirm(
        `Profile "${profileName}" already exists.\n\nClick OK to OVERWRITE entirely.\nClick Cancel to APPEND new records.`,
      );
      if (overwrite) {
        savedProfiles[profileName] = {
          rows: selectedData,
          location: locationObj,
        };
        alert(`Profile "${profileName}" overwritten successfully!`);
      } else {
        const existingData = Array.isArray(savedProfiles[profileName].rows)
          ? savedProfiles[profileName].rows
          : [];
        let addedCount = 0;
        selectedData.forEach((newRow) => {
          if (!existingData.some((row) => row.Date === newRow.Date)) {
            existingData.push(newRow);
            addedCount++;
          }
        });
        existingData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        savedProfiles[profileName] = {
          rows: existingData,
          location: savedProfiles[profileName].location || locationObj,
        };
        alert(`Added ${addedCount} new dates to "${profileName}".`);
      }
    } else {
      savedProfiles[profileName] = {
        rows: selectedData,
        location: locationObj,
      };
      alert(
        `Profile "${profileName}" saved successfully with ${selectedData.length} records!`,
      );
    }
    localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
    setSavedProfilesList(Object.keys(savedProfiles));
  };

  const handleRenameTable = () => {
    const profileName = formData.profileName.trim();
    if (!profileName) {
      return alert("Please enter a profile name to rename.");
    }
    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (!savedProfiles[profileName]) {
      return alert(`Profile "${profileName}" does not exist.`);
    }
    const newName = window.prompt("Enter new name for the profile:", profileName);
    if (newName === null) return;
    const trimmedNewName = newName.trim();
    if (!trimmedNewName) {
      return alert("Profile name cannot be empty.");
    }
    if (trimmedNewName === profileName) return;

    if (savedProfiles[trimmedNewName]) {
      const overwrite = window.confirm(
        `A profile named "${trimmedNewName}" already exists. Do you want to overwrite it?`,
      );
      if (!overwrite) return;
    }

    savedProfiles[trimmedNewName] = savedProfiles[profileName];
    delete savedProfiles[profileName];

    localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
    setSavedProfilesList(Object.keys(savedProfiles));

    setFormData((prev) => ({
      ...prev,
      profileName: trimmedNewName,
    }));
    if (selectedProfileName === profileName) {
      setSelectedProfileName(trimmedNewName);
    }
    if (loadProfileName === profileName) {
      setLoadProfileName(trimmedNewName);
    }

    alert(`Profile "${profileName}" successfully renamed to "${trimmedNewName}"!`);
  };

  const exportPanchangaCSV = () => {
    if (resultData.length === 0) return;
    const csvRows = [
      PANCHANGA_ALL_COLUMNS.map((h) => `"${h}"`).join(","),
    ];
    resultData.forEach((row) => {
      const values = PANCHANGA_ALL_COLUMNS.map((header) => {
        let dataKey = row.hasOwnProperty(header) ? header : header.replace(/ /g, "_");
        return `"${(row[dataKey] !== undefined ? String(row[dataKey]) : "").replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });
    downloadFile(
      csvRows.join("\n"),
      `${formData.profileName || "Panchanga"}.csv`,
      "text/csv",
    );
  };

  const handleImportCSV = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        if (lines.length < 2) {
          alert("CSV file is empty or invalid.");
          return;
        }
        const headers = lines[0]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.replace(/^"|"$/g, "").trim());
        const parsedData = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"'));
          const obj = {};
          headers.forEach((header, j) => {
            obj[header.replace(/ /g, "_")] = currentLine[j];
            obj[header] = currentLine[j];
          });
          parsedData.push(obj);
        }

        if (type === "search") {
          if (resultData.length > 0 && window.confirm("Do you want to MERGE this CSV with the currently displayed table?\n\nClick OK to MERGE.\nClick Cancel to REPLACE.")) {
            const merged = [...resultData];
            let added = 0;
            parsedData.forEach((row) => {
              if (!merged.some((r) => r.Date === row.Date)) {
                merged.push(normalizeRow(row));
                added++;
              }
            });
            merged.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            setResultData(merged);
            setOriginalData(merged);
            setIsPanShudhiActive(false);
            setSelectedRows(new Set());
            alert(`Merged ${added} records from CSV successfully!`);
          } else {
            const normalizedParsed = parsedData.map(normalizeRow);
            setResultData(normalizedParsed);
            setOriginalData(normalizedParsed);
            setIsPanShudhiActive(false);
            setSelectedRows(new Set());
            alert("CSV Imported Successfully!");
          }
        } else if (type === "muhurtha") {
          const currentMuhData = muhurthaDataRef.current;
          if (currentMuhData.length > 0 && window.confirm("Do you want to MERGE this CSV with the existing Muhurtha table?\n\nClick OK to MERGE.\nClick Cancel to REPLACE.")) {
            const merged = [...currentMuhData];
            let added = 0;
            parsedData.forEach((row) => {
              if (!merged.some((r) => r.Date === row.Date)) {
                merged.push(normalizeMuhurthaRow(row));
                added++;
              }
            });
            merged.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            setMuhurthaDataAndRef(merged);
            setMuhurthaSelectedRows(new Set());
            if (selectedProfileName) {
              const saved = JSON.parse(localStorage.getItem("panchanga_profiles") || "{}");
              if (saved[selectedProfileName]) {
                if (Array.isArray(saved[selectedProfileName])) saved[selectedProfileName] = merged;
                else saved[selectedProfileName].rows = merged;
                localStorage.setItem("panchanga_profiles", JSON.stringify(saved));
              }
            }
            alert(`Merged ${added} records from CSV into Muhurtha Table!`);
          } else {
            const normalizedParsed = parsedData.map(normalizeMuhurthaRow);
            setMuhurthaDataAndRef(normalizedParsed);
            setMuhurthaSelectedRows(new Set());
            alert("CSV Imported Successfully into Muhurtha Table!");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Error parsing CSV file!");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  const downloadFile = (content, fileName, contentType) => {
    triggerDownload(content, fileName, contentType);
  };

  // ===== Muhurtha Specific Functions =====
  const loadSelectedProfile = (profileName) => {
    setSelectedProfileName(profileName);
    if (!profileName) {
      setMuhurthaDataAndRef([]);
      setSelectedProfileLocation(null);
      return;
    }

    const saved = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    const data = saved[profileName];
    let rows = [];
    if (Array.isArray(data)) {
      rows = data;
      setSelectedProfileLocation(null);
    } else if (data && Array.isArray(data.rows)) {
      rows = data.rows;
      setSelectedProfileLocation(data.location || null);
    } else {
      setSelectedProfileLocation(null);
    }

    const prefs = syncPreferences();
    evaluatePanShudhiFlags(rows, prefs);
    const normalizedRows = rows.map(normalizeMuhurthaRow);

    setMuhurthaDataAndRef(normalizedRows);
    setMuhurthaSelectedRows(new Set());
    setChartDateSelect("");
    setChartSelectedInfo(null);
    setMuhurthaChartData(null);
  };

  const mergeProfileData = (profileToMerge) => {
    if (!selectedProfileName) return;
    const saved = JSON.parse(localStorage.getItem("panchanga_profiles") || "{}");
    const mergeData = saved[profileToMerge];
    if (!mergeData) return;

    let mergeRows = Array.isArray(mergeData) ? mergeData : mergeData.rows || [];
    const existingData = [...muhurthaDataRef.current];
    let addedCount = 0;

    mergeRows.forEach((newRow) => {
      if (!existingData.some((row) => row.Date === newRow.Date)) {
        existingData.push(newRow);
        addedCount++;
      }
    });

    existingData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    const normalizedMerged = existingData.map(normalizeMuhurthaRow);
    setMuhurthaDataAndRef(normalizedMerged);

    if (Array.isArray(saved[selectedProfileName])) {
      saved[selectedProfileName] = normalizedMerged;
    } else {
      saved[selectedProfileName].rows = normalizedMerged;
    }
    localStorage.setItem("panchanga_profiles", JSON.stringify(saved));
    setMuhurthaSelectedRows(new Set());

    alert(`🔀 Merged ${addedCount} new dates from "${profileToMerge}" into "${selectedProfileName}" successfully!`);
  };

  const applyMuhurthaTarabalam = () => {
    const currentMuhData = muhurthaDataRef.current;
    if (!selectedProfileName || currentMuhData.length === 0)
      return alert("Please select a profile first!");
    const { boyCheck, boyNakshatra, girlCheck, girlNakshatra } = muhurthaForm;
    const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
    const goodTaras = prefs.tarabalam || [];

    const newData = [...currentMuhData];
    newData.forEach((row, index) => {
      if (muhurthaSelectedRows.size > 0 && !muhurthaSelectedRows.has(index))
        return;
      const nakIdx = NAKSHATRAS.indexOf(
        row["Nakshatra"] || row["Nakshatra_End"],
      );
      const moonRasiIdx = RASI_NAMES.indexOf(
        row["Moon_Rasi"] || row["Moon Rasi"],
      );

      if (boyCheck && boyNakshatra) {
        const bNakIdx = NAKSHATRAS.indexOf(boyNakshatra);
        const dist = ((nakIdx - bNakIdx + 27) % 27) + 1;
        const tara = TARA_NAMES[dist % 9];
        row["Boy_Tarabalam"] = tara;
        row["Boy_Tarabalam_is_good"] = goodTaras.includes(tara);

        let isAshtama = false;
        if (moonRasiIdx !== -1)
          isAshtama = NAK_TO_RASI[bNakIdx].some(
            (jr) => moonRasiIdx === (jr + 7) % 12,
          );
        row["Boy_Chandra_Balam"] = isAshtama ? "Ashtama" : "Good";
        row["Boy_Chandra_Balam_is_good"] = !isAshtama;
      }

      if (girlCheck && girlNakshatra) {
        const gNakIdx = NAKSHATRAS.indexOf(girlNakshatra);
        const dist = ((nakIdx - gNakIdx + 27) % 27) + 1;
        const tara = TARA_NAMES[dist % 9];
        row["Girl_Tarabalam"] = tara;
        row["Girl_Tarabalam_is_good"] = goodTaras.includes(tara);

        let isAshtama = false;
        if (moonRasiIdx !== -1)
          isAshtama = NAK_TO_RASI[gNakIdx].some(
            (jr) => moonRasiIdx === (jr + 7) % 12,
          );
        row["Girl_Chandra_Balam"] = isAshtama ? "Ashtama" : "Good";
        row["Girl_Chandra_Balam_is_good"] = !isAshtama;
      }
    });

    setMuhurthaDataAndRef(newData);
    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (savedProfiles[selectedProfileName]) {
      if (Array.isArray(savedProfiles[selectedProfileName]))
        savedProfiles[selectedProfileName] = newData;
      else savedProfiles[selectedProfileName].rows = newData;
      localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
    }
  };

  const saveMuhurthaTable = () => {
    if (!selectedProfileName) {
      alert("Please select a profile first!");
      return;
    }
    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (savedProfiles[selectedProfileName]) {
      if (Array.isArray(savedProfiles[selectedProfileName]))
        savedProfiles[selectedProfileName] = muhurthaDataRef.current;
      else savedProfiles[selectedProfileName].rows = muhurthaDataRef.current;
      localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
      alert("Table data saved successfully!");
    } else {
      alert("Selected profile not found in saved profiles.");
    }
  };

  const handleCellEdit = (index, key, newValue) => {
    const newData = [...muhurthaDataRef.current];
    newData[index][key] = newValue;
    setMuhurthaDataAndRef(newData);
    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (savedProfiles[selectedProfileName]) {
      if (Array.isArray(savedProfiles[selectedProfileName]))
        savedProfiles[selectedProfileName][index][key] = newValue;
      else savedProfiles[selectedProfileName].rows[index][key] = newValue;
      localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
    }
  };

  const handleChartDateSelect = (e) => {
    const val = e.target.value;
    setChartDateSelect(val);
    if (!val) {
      setMuhurthaChartData(null);
      setChartSelectedInfo(null);
      return;
    }

    const info = JSON.parse(val);
    setChartSelectedInfo(info);
    const parts = info.date.split("-");
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const fDate = `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, "0")}`;
    setChartDate(fDate);

    const tMatch = (info.time || "").match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)/i);
    let fTime = "06:00:00";
    if (tMatch) {
      let h = parseInt(tMatch[1]);
      if (tMatch[4].toUpperCase() === "PM" && h < 12) h += 12;
      if (tMatch[4].toUpperCase() === "AM" && h === 12) h = 0;
      fTime = `${h.toString().padStart(2, "0")}:${tMatch[2].padStart(2, "0")}:${(tMatch[3] || "00").padStart(2, "0")}`;
    }
    setChartTime(fTime);

    const gNotes = JSON.parse(
      localStorage.getItem("muhurtha_global_notes") || "{}",
    );
    setGlobalNotes(gNotes[info.date] || "");
  };

  const updateChart = async (reqDate, reqTime) => {
    const cDate = reqDate || chartDate;
    const cTime = reqTime || chartTime;

    let targetLat = formData.lat;
    let targetLon = formData.lon;
    let targetTz = formData.tz;

    if (activeTab === "muhurtha" && selectedProfileLocation) {
      targetLat = selectedProfileLocation.lat || targetLat;
      targetLon = selectedProfileLocation.lon || targetLon;
      targetTz = selectedProfileLocation.tz || targetTz;
    }

    if (!cDate || !cTime || !targetLat) return;

    setIsChartLoading(true);
    try {
      const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
      const ayanamsha = prefs.ayanamsha_val || "lahiri";

      const params = new URLSearchParams({
        endpoint: "muhurtha_chart",
        date: cDate,
        time: cTime,
        lat: targetLat,
        lon: targetLon,
        tz: targetTz,
        ayanamsha: ayanamsha,
        rahu_mode: localStorage.getItem("rahu_mode") || "mean",
        _t: Date.now(),
      });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: { "x-api-token": API_TOKEN }
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMuhurthaChartData(data);
    } catch (err) {
      console.error("Unable to load Muhurtha chart details.", err);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "muhurtha" && chartDate && chartTime) {
      const timer = setTimeout(() => {
        updateChart(chartDate, chartTime);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartDate, chartTime, activeTab]);

  const exportMuhurthaPDF = async () => {
    if (!selectedProfileName || muhurthaSelectedRows.size === 0)
      return alert("Select a profile and at least one row!");
    setIsLoading(true);
    try {
      if (!window.jspdf) {
        await new Promise((res) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload = res;
          document.head.appendChild(s);
        });
      }
      if (!window.jspdf.jsPDF.API.autoTable) {
        await new Promise((res) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          s.onload = res;
          document.head.appendChild(s);
        });
      }

      const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
      const exportCols = prefs.export_columns || muhurthaColumns;
      const currentMuhData = muhurthaDataRef.current;
      const indices = Array.from(muhurthaSelectedRows).sort(
        (a, b) =>
          (parseInt(currentMuhData[a]["Priority"]) || 99) -
          (parseInt(currentMuhData[b]["Priority"]) || 99),
      );

      const headers = [exportCols.map((c) => c.replace(/_/g, " "))];
      const body = indices.map((idx) =>
        exportCols.map((col) => {
          let dataKey = currentMuhData[idx].hasOwnProperty(col)
            ? col
            : col.replace(/ /g, "_");
          return currentMuhData[idx][dataKey] !== undefined
            ? String(currentMuhData[idx][dataKey])
            : "";
        }),
      );

      const doc = new window.jspdf.jsPDF({ orientation: "landscape" });
      doc.setFontSize(16);
      doc.text(
        `Muhurtha - ${selectedProfileName}`,
        doc.internal.pageSize.getWidth() / 2,
        15,
        { align: "center" },
      );

      doc.autoTable({
        head: headers,
        body: body,
        startY: 25,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: "center",
          valign: "middle",
        },
        headStyles: { fillColor: [142, 68, 173], textColor: [255, 255, 255] },
      });

      if (muhurthaForm.pdfMessage) {
        const finalY = doc.lastAutoTable.finalY || 20;
        doc.setFontSize(11);
        doc.setTextColor(51, 51, 51);
        doc.text(
          doc.splitTextToSize(
            muhurthaForm.pdfMessage,
            doc.internal.pageSize.getWidth() - 28,
          ),
          14,
          finalY + 10,
        );
      }
      doc.save(`${selectedProfileName}_Muhurtha.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportMuhurthaCSV = () => {
    const currentMuhData = muhurthaDataRef.current;
    if (!selectedProfileName || muhurthaSelectedRows.size === 0)
      return alert("Select a profile and at least one row!");
    const indices = Array.from(muhurthaSelectedRows).sort(
      (a, b) =>
        (parseInt(currentMuhData[a]["Priority"]) || 99) -
        (parseInt(currentMuhData[b]["Priority"]) || 99),
    );

    const exportCols = muhurthaColumns;

    const csvRows = [
      exportCols.map((c) => `"${c.replace(/_/g, " ")}"`).join(","),
    ];
    indices.forEach((idx) => {
      const row = currentMuhData[idx];
      const values = exportCols.map((col) => {
        let dataKey = row.hasOwnProperty(col) ? col : col.replace(/ /g, "_");
        return `"${(row[dataKey] !== undefined ? String(row[dataKey]) : "").replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });
    downloadFile(
      csvRows.join("\n"),
      `${selectedProfileName}_Muhurtha.csv`,
      "text/csv",
    );
  };

  const saveGlobalNotes = () => {
    if (!chartSelectedInfo?.date)
      return alert("Select a date from chart selector first!");
    const gNotes = JSON.parse(
      localStorage.getItem("muhurtha_global_notes") || "{}",
    );
    if (globalNotes.trim() === "") delete gNotes[chartSelectedInfo.date];
    else gNotes[chartSelectedInfo.date] = globalNotes;
    localStorage.setItem("muhurtha_global_notes", JSON.stringify(gNotes));
    alert("Global Notes saved!");
  };



  const updateTableNotes = () => {
    if (!selectedProfileName) return;
    const gNotes = JSON.parse(
      localStorage.getItem("muhurtha_global_notes") || "{}",
    );
    const newData = [...muhurthaDataRef.current];
    newData.forEach((row, i) => {
      if (muhurthaSelectedRows.size > 0 && !muhurthaSelectedRows.has(i)) return;
      if (gNotes[row.Date]) row["Muhurtha_Notes"] = gNotes[row.Date];
    });
    setMuhurthaDataAndRef(newData);

    const savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );
    if (savedProfiles[selectedProfileName]) {
      if (Array.isArray(savedProfiles[selectedProfileName]))
        savedProfiles[selectedProfileName] = newData;
      else savedProfiles[selectedProfileName].rows = newData;
      localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
    }

    alert("Table updated with Global Notes!");
  };

  const renderMuhurthaGrid = (chartArray, title, isD9 = false) => {
    if (chartStyle === "north") {
      let lagnaRashi = 1;
      for (let r = 0; r < 12; r++) {
        const planetsInRashi = chartArray[r] || [];
        const hasLg = planetsInRashi.some(p => (p.id || p) === "Lg");
        if (hasLg) {
          lagnaRashi = r + 1;
          break;
        }
      }

      const houses = [];
      for (let h = 1; h <= 12; h++) {
        const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
        const planetList = chartArray[houseRashi - 1] || [];
        const pos = NORTH_INDIAN_LAYOUT_280[h];
        houses.push({
          houseNum: h,
          rashiNum: houseRashi,
          planetList,
          pos,
        });
      }

      const borderCol = isD9 ? "#16a085" : "#8e44ad";

      return (
        <div
          style={{
            width: "280px",
            height: "280px",
            boxSizing: "border-box",
          }}
        >
          <svg
            viewBox="0 0 280 280"
            width="100%"
            height="100%"
            style={{
              display: "block",
              background: "#ffffff",
              border: `2px solid ${borderCol}`,
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          >
            <rect x="0" y="0" width="280" height="280" fill="none" stroke={borderCol} strokeWidth="2" />
            <line x1="0" y1="0" x2="280" y2="280" stroke="#ccc" strokeWidth="1.5" />
            <line x1="0" y1="280" x2="280" y2="0" stroke="#ccc" strokeWidth="1.5" />
            <line x1="140" y1="0" x2="0" y2="140" stroke="#ccc" strokeWidth="1.5" />
            <line x1="0" y1="140" x2="140" y2="280" stroke="#ccc" strokeWidth="1.5" />
            <line x1="140" y1="280" x2="280" y2="140" stroke="#ccc" strokeWidth="1.5" />
            <line x1="280" y1="140" x2="140" y2="0" stroke="#ccc" strokeWidth="1.5" />

            <g transform="translate(140, 140)">
              <rect
                x="-45"
                y="-18"
                width="90"
                height="36"
                rx="4"
                fill="#f9f0ff"
                stroke={borderCol}
                strokeWidth="1"
              />
              <text
                x="0"
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  fill: borderCol,
                  fontFamily: "sans-serif",
                }}
              >
                {t(title)}
              </text>
            </g>

            {houses.map(({ houseNum, rashiNum, planetList, pos }) => {
              const rows = [];
              const itemsPerRow = 3;
              for (let i = 0; i < planetList.length; i += itemsPerRow) {
                rows.push(planetList.slice(i, i + itemsPerRow));
              }

              return (
                <g key={houseNum}>
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

                  {rows.map((row, rowIdx) => {
                    let y = pos.planets.y;
                    if (rows.length === 2) {
                      y = pos.planets.y - 6 + rowIdx * 12;
                    } else if (rows.length === 3) {
                      y = pos.planets.y - 12 + rowIdx * 12;
                    } else if (rows.length > 3) {
                      y = pos.planets.y - 18 + rowIdx * 12;
                    }

                    return (
                      <text
                        key={rowIdx}
                        x={pos.planets.x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "11px", fontFamily: "sans-serif" }}
                      >
                        {row.map((planet, idx) => {
                          const name = planet.id || planet;
                          const isRetro = planet.isR;
                          const isCombust = planet.isC;
                          const color = isRetro ? "#2980b9" : isCombust ? "#c0392b" : "#2c3e50";
                          const weight = "800";

                          return (
                            <tspan
                              key={idx}
                              fill={color}
                              fontWeight={weight}
                              dx={idx > 0 ? "4px" : "0px"}
                            >
                              {name}
                              {isRetro && "R"}
                              {isCombust && "c"}
                            </tspan>
                          );
                        })}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    const gridMap = [
      11,
      0,
      1,
      2,
      10,
      null,
      null,
      3,
      9,
      null,
      null,
      4,
      8,
      7,
      6,
      5,
    ];
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          width: "280px",
          height: "280px",
          border: `2px solid ${isD9 ? "#16a085" : "#8e44ad"}`,
          background: "#fff",
        }}
      >
        {gridMap.map((rIndex, i) => {
          if (rIndex === null) {
            if (i === 5)
              return (
                <div
                  key={i}
                  style={{
                    gridColumn: "2 / 4",
                    gridRow: "2 / 4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: isD9 ? "#16a085" : "#8e44ad",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {title}
                </div>
              );
            return null;
          }
          const cellP = chartArray[rIndex] || [];
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isD9 ? "#16a085" : "#ccc"}`,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "2px",
                fontSize: "14px",
              }}
              dangerouslySetInnerHTML={{
                __html: cellP
                  .map(
                    (p) =>
                      `<span>${p.id || p}${p.isR ? `<sup style="color:#2980b9;font-size:0.65em;font-weight:bold;">R</sup>` : ""}${p.isC ? `<sub style="color:#c0392b;font-size:0.65em;font-weight:bold;">c</sub>` : ""}</span>`,
                  )
                  .join(" "),
              }}
            />
          );
        })}
      </div>
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    background: "#fff",
    outline: "none",
  };
  const actionBtnStyle = {
    border: "none",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    whiteSpace: "nowrap",
    transition: "0.2s",
  };

  return (
    <main className="page panchanga-page-layout">
      <style>{`
        /* డెస్క్‌టాప్ వ్యూ కొరకు కార్డ్స్ వెడల్పు మరియు మార్జిన్స్ సర్దుబాటు */
        @media (min-width: 861px) {
          .panchanga-page-layout {
            padding: 0.5in !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .panchanga-page-layout .workspace {
            padding: 0px !important;
            padding-bottom: 40px !important;
            margin: 0px !important;
            max-width: 100% !important;
          }
          .panchanga-page-layout .results-area {
            max-width: 100% !important;
          }
          .panchanga-page-layout .form-panel {
            max-width: 100% !important;
            padding: 20px !important;
          }
          .panchanga-page-layout .table-panel {
            max-width: 100% !important;
          }
        }

        /* టేబుల్ హెడర్ స్క్రోల్ కాకుండా స్థిరంగా (sticky) ఉంచడానికి */
        .panchanga-page-layout .table-scroll th {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #ffffff; /* స్క్రోలింగ్ డేటా వెనుక కనిపించకుండా వైట్ బ్యాక్‌గ్రౌండ్ */
          box-shadow: inset 0 -1px 0 #eadfce; /* బార్డర్ లైన్ స్పష్టంగా కనిపించడానికి */
        }
      `}</style>
      <section
        className="workspace"
        style={{
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          padding: "10px", // for left, right, bottom
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          margin: "0",
          boxSizing: "border-box",
        }}
      >
        {/* Tabs Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
            marginBottom: "15px",
            width: "100%",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveTab("search")}
            style={{
              ...tabStyle,
              background: activeTab === "search" ? "#8e44ad" : "#f1f2f6",
              color: activeTab === "search" ? "#fff" : "#2d3436",
            }}
          >
            {t("ui.panchanga_search", "Panchanga")}
          </button>
          <button
            onClick={() => setActiveTab("muhurtha")}
            style={{
              ...tabStyle,
              background: activeTab === "muhurtha" ? "#8e44ad" : "#f1f2f6",
              color: activeTab === "muhurtha" ? "#fff" : "#2d3436",
            }}
          >
            {t("ui.muhurtha_analysis", "Muhurtha")}
          </button>
          <button
            onClick={() => setActiveTab("add_events")}
            style={{
              ...tabStyle,
              background: activeTab === "add_events" ? "#8e44ad" : "#f1f2f6",
              color: activeTab === "add_events" ? "#fff" : "#2d3436",
            }}
          >
            {t("Add Events", "Add Events")}
          </button>
          <button
            onClick={() => setActiveTab("adhika")}
            style={{
              ...tabStyle,
              background: activeTab === "adhika" ? "#8e44ad" : "#f1f2f6",
              color: activeTab === "adhika" ? "#fff" : "#2d3436",
            }}
          >
            {t("ui.adhika_masa", "Adhika Masa")}
          </button>
          <button
            onClick={() => setActiveTab("eclipse")}
            style={{
              ...tabStyle,
              background: activeTab === "eclipse" ? "#8a3b24" : "#f1f2f6",
              color: activeTab === "eclipse" ? "#fff" : "#2d3436",
            }}
          >
            {t("Eclipse", "Eclipse")}
          </button>
        </div>

        <div
          className="results-area"
          style={{
            height: "auto",
            overflow: "visible",
            flexShrink: 0,
            minWidth: 0,
            padding: 0,
          }}
        >
          {isLoading && (
            <div className="message">
              {t("ui.calculating_wait", "Processing... Please wait")}
            </div>
          )}

          {/* Panchanga Search Tab Content */}
          {activeTab === "search" && !isLoading && (
            <>
              <div className="form-panel" style={{ maxWidth: "100%", margin: "0 auto", padding: "15px", border: "none", boxShadow: "none" }}>
                <h2>{t("ui.panchanga_search", "Panchanga Search")}</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      color: "#2d3436",
                      display: "block",
                    }}
                  >
                    Profile/Export Name:
                    <input
                      type="text"
                      name="profileName"
                      style={{ ...inputStyle, marginTop: "6px" }}
                      value={formData.profileName}
                      onChange={handleChange}
                      placeholder="Enter profile name"
                    />
                  </label>
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      color: "#2d3436",
                      display: "block",
                    }}
                  >
                    Start Date:
                    <input
                      type="date"
                      name="startDate"
                      style={{ ...inputStyle, marginTop: "6px" }}
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </label>
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      color: "#2d3436",
                      display: "block",
                    }}
                  >
                    Number of Days:
                    <input
                      type="number"
                      name="days"
                      style={{ ...inputStyle, marginTop: "6px" }}
                      value={formData.days}
                      onChange={handleChange}
                      min="1"
                      max="30"
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {/* Location Column */}
                  <div>
                    <details
                      style={{
                        fontSize: "14px",
                        background: "#fdfefe",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <summary
                        style={{
                          cursor: "pointer",
                          color: "#2c3e50",
                          fontWeight: "bold",
                          fontSize: "14.5px",
                          outline: "none",
                          listStyle: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        📍 Place ({formData.city || "Not Selected"})
                      </summary>
                      <div style={{ marginTop: "15px" }}>
                        <LocationAutocomplete
                          city={formData.city}
                          onLocationSelect={(locData) => {
                            setFormData((prev) => ({
                              ...prev,
                              city: locData.city,
                              lat: locData.latitude,
                              lon: locData.longitude,
                              tz: locData.timezone,
                            }));
                          }}
                        />
                        <details
                          style={{
                            marginTop: "10px",
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
                                name="lat"
                                style={{
                                  ...inputStyle,
                                  padding: "8px",
                                  marginTop: "4px",
                                }}
                                value={formData.lat}
                                onChange={handleChange}
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
                                name="lon"
                                style={{
                                  ...inputStyle,
                                  padding: "8px",
                                  marginTop: "4px",
                                }}
                                value={formData.lon}
                                onChange={handleChange}
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
                                name="tz"
                                style={{
                                  ...inputStyle,
                                  padding: "8px",
                                  marginTop: "4px",
                                }}
                                value={formData.tz}
                                onChange={handleChange}
                              />
                            </label>
                          </div>
                        </details>
                      </div>
                    </details>
                  </div>

                  {/* Tarabalam Column */}
                  <div>
                    <details
                      style={{
                        background: "#fffdf9",
                        borderLeft: "4px solid #f39c12",
                        padding: "18px",
                        borderRadius: "8px",
                        borderTop: "1px solid #fdf5e6",
                        borderRight: "1px solid #fdf5e6",
                        borderBottom: "1px solid #fdf5e6",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <summary
                        style={{
                          fontWeight: "bold",
                          color: "#2c3e50",
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          outline: "none",
                          listStyle: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        ✨ Tarabalam & Chandra Balam (Optional)
                      </summary>

                      <div style={{ marginTop: "15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "15px",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="boyCheck"
                            checked={formData.boyCheck}
                            onChange={handleChange}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer",
                              accentColor: "#8e44ad",
                            }}
                          />
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#3498db",
                              minWidth: "40px",
                            }}
                          >
                            Boy
                          </span>
                          {formData.boyCheck && (
                            <select
                              name="boyNakshatra"
                              style={{ ...inputStyle, flex: 1, padding: "8px" }}
                              value={formData.boyNakshatra}
                              onChange={handleChange}
                            >
                              <option value="">-- Select Nakshatra --</option>
                              {NAKSHATRAS.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="girlCheck"
                            checked={formData.girlCheck}
                            onChange={handleChange}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer",
                              accentColor: "#8e44ad",
                            }}
                          />
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#e74c3c",
                              minWidth: "40px",
                            }}
                          >
                            Girl
                          </span>
                          {formData.girlCheck && (
                            <select
                              name="girlNakshatra"
                              style={{ ...inputStyle, flex: 1, padding: "8px" }}
                              value={formData.girlNakshatra}
                              onChange={handleChange}
                            >
                              <option value="">-- Select Nakshatra --</option>
                              {NAKSHATRAS.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "25px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={handleCalculate}
                    style={{
                      background: "#8e44ad",
                      color: "#fff",
                      border: "none",
                      padding: "14px 24px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      flex: 2,
                      fontSize: "1.05rem",
                      transition: "0.2s",
                      boxShadow: "0 4px 10px rgba(142,68,173,0.2)",
                    }}
                  >
                    ✨ Calculate Panchanga
                  </button>

                  <button
                    onClick={fetchLunarMonths}
                    style={{
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      padding: "14px 24px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      flex: 1,
                      fontSize: "1.05rem",
                      transition: "0.2s",
                      boxShadow: "0 4px 10px rgba(39,174,96,0.2)",
                    }}
                  >
                    📅 Maasa
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    alignItems: "center",
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #dcdde1",
                    flexWrap: "wrap",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#2d3436" }}>
                    Load Saved Table:
                  </label>
                  <select
                    style={{ ...inputStyle, flex: 1, padding: "8px", minWidth: "200px" }}
                    value={loadProfileName}
                    onChange={(e) => setLoadProfileName(e.target.value)}
                  >
                    <option value="">-- Select Saved Table --</option>
                    {savedProfilesList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    style={{ ...actionBtnStyle, background: "#2980b9" }}
                    onClick={handleLoadPanchangaProfile}
                  >
                    📂 Load Table
                  </button>
                </div>

                {resultData.length > 0 && (
                  <section
                    className="table-panel"
                    style={{ marginTop: "30px", animation: "fadeIn 0.5s" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "15px",
                        padding: "15px 20px",
                        borderBottom: "2px solid #eee",
                        background: "#fdfefe",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.15rem",
                          color: "#2d3436",
                        }}
                      >
                        Results ({resultData.length} days)
                      </h3>
                      <div
                        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                      >
                        <button
                          style={{
                            ...actionBtnStyle,
                            background: isPanShudhiActive ? "#e67e22" : "#9b59b6",
                          }}
                          onClick={filterPanShudhi}
                        >
                          {isPanShudhiActive ? "👁️ Show All" : "✨ Pan Shudhi"}
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#f39c12" }}
                          onClick={handleRenameTable}
                        >
                          ✏️ Rename Table
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#c0392b" }}
                          onClick={() => {
                            const profileName = formData.profileName.trim();
                            if (!profileName)
                              return alert(
                                "Please enter a profile name to delete.",
                              );
                            const savedProfiles = JSON.parse(
                              localStorage.getItem("panchanga_profiles") || "{}",
                            );
                            if (!savedProfiles[profileName]) {
                              return alert(
                                `Profile "${profileName}" does not exist.`,
                              );
                            }
                            if (
                              window.confirm(
                                `Are you sure you want to delete profile "${profileName}"?`,
                              )
                            ) {
                              delete savedProfiles[profileName];
                              localStorage.setItem(
                                "panchanga_profiles",
                                JSON.stringify(savedProfiles),
                              );
                              setSavedProfilesList(Object.keys(savedProfiles));
                              setResultData([]);
                              alert(
                                `Profile "${profileName}" deleted successfully!`,
                              );
                            }
                          }}
                        >
                          🗑️ Delete Table
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#8e44ad" }}
                          onClick={saveSelectedDates}
                        >
                          💾 Save Table
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#3498db" }}
                          onClick={() => {
                            const exportObj = {
                              rows: resultData,
                              location: {
                                city: formData.city || "",
                                lat: formData.lat || "",
                                lon: formData.lon || "",
                                tz: formData.tz || "",
                              },
                            };
                            downloadFile(
                              JSON.stringify(exportObj, null, 2),
                              `${formData.profileName || "Panchanga"}.json`,
                              "application/json",
                            );
                          }}
                        >
                          📥 Export JSON
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#27ae60" }}
                          onClick={exportPanchangaCSV}
                        >
                          📊 Export CSV
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#2ecc71" }}
                          onClick={() => searchCsvRef.current.click()}
                        >
                          📂 Import CSV
                        </button>
                        <input
                          type="file"
                          accept=".csv"
                          ref={searchCsvRef}
                          style={{ display: "none" }}
                          onChange={(e) => handleImportCSV(e, "search")}
                        />
                      </div>
                    </div>
                    <div className="table-scroll" style={{ maxHeight: "450px", overflow: "auto" }}>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "40px", textAlign: "center" }}>
                              <input
                                type="checkbox"
                                onChange={toggleSelectAll}
                                checked={
                                  selectedRows.size === resultData.length &&
                                  resultData.length > 0
                                }
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                }}
                              />
                            </th>
                            {visibleKeys.map((header, i) => (
                              <th key={i} style={{ whiteSpace: "nowrap" }}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {resultData.map((row, rIndex) => {
                            return (
                              <tr
                                key={rIndex}
                                style={{
                                  background:
                                    rIndex % 2 === 0 ? "#fff" : "#fcfcfc",
                                }}
                              >
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.has(rIndex)}
                                    onChange={() => toggleRowSelect(rIndex)}
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                {visibleKeys.map((k, cIndex) => {
                                  let dataKey = row.hasOwnProperty(k)
                                    ? k
                                    : k.replace(/ /g, "_");
                                  let goodKey = k.replace(/ /g, "_") + "_is_good";
                                  let isGood = row[goodKey] === true;
                                  let isBad =
                                    (k === "Asthg" && row[dataKey] !== "-") ||
                                    (k.includes("Chandra Balam") &&
                                      row[dataKey] === "Ashtama");
                                  return (
                                    <td
                                      key={cIndex}
                                      style={{
                                        whiteSpace: "nowrap",
                                        background: isGood
                                          ? "#eafaf1"
                                          : isBad
                                            ? "#fdedec"
                                            : "transparent",
                                        color: isGood
                                          ? "#1e8449"
                                          : isBad
                                            ? "#c0392b"
                                            : "inherit",
                                        fontWeight:
                                          isGood || isBad ? "bold" : "normal",
                                      }}
                                    >
                                      {row[dataKey] !== undefined
                                        ? row[dataKey]
                                        : ""}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Display location details below the generated table */}
                    <div style={{ padding: "10px 20px", fontSize: "11px", color: "#7f8c8d", fontStyle: "italic", borderTop: "1px solid #eee", textAlign: "left" }}>
                      Location: <strong>{formData.city || "N/A"}</strong> (Lat: {formData.lat || "N/A"}, Lon: {formData.lon || "N/A"}, TZ: {formData.tz || "N/A"})
                    </div>
                  </section>
                )}
              </div>
            </>
          )}

          {/* Add Events Tab Content */}
          {activeTab === "add_events" && !isLoading && (
            <div
              className="form-panel"
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                padding: "15px",
                border: "none",
                boxShadow: "none",
              }}
            >
              <h2>{t("ui.reminders_and_events", "Reminders & Custom Events")}</h2>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #dcdde1",
                  borderRadius: "12px",
                  padding: "25px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: "20px",
                }}
              >
                <p style={{ fontSize: "14px", color: "#7f8c8d", margin: "0 0 20px 0" }}>
                  {t("eventReminderInstructions", "Save important custom events, festivals, or personal dates. These will display as warnings in the Muhurtha Doshas tab if your selected muhurtha date matches them.")}
                </p>

                {/* Import / Export Controls */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={exportCustomEventsCSV}
                    style={{ ...actionBtnStyle, background: "#27ae60" }}
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => customEventsCsvRef.current.click()}
                    style={{ ...actionBtnStyle, background: "#2ecc71" }}
                  >
                    📂 Import CSV
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={customEventsCsvRef}
                    style={{ display: "none" }}
                    onChange={handleImportCustomEventsCSV}
                  />

                  <button
                    onClick={exportCustomEventsJSON}
                    style={{ ...actionBtnStyle, background: "#8e44ad" }}
                  >
                    📥 Export JSON
                  </button>
                  <button
                    onClick={() => customEventsJsonRef.current.click()}
                    style={{ ...actionBtnStyle, background: "#3498db" }}
                  >
                    📂 Import JSON
                  </button>
                  <input
                    type="file"
                    accept=".json"
                    ref={customEventsJsonRef}
                    style={{ display: "none" }}
                    onChange={handleImportCustomEventsJSON}
                  />

                  {customEvents.length > 0 && (
                    <button
                      onClick={clearCustomEvents}
                      style={{ ...actionBtnStyle, background: "#c0392b", marginLeft: "auto" }}
                    >
                      🗑️ Delete All Events
                    </button>
                  )}
                </div>

                {/* Add Event Form */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                    alignItems: "flex-end",
                  }}
                >
                  <label style={{ flex: "2 1 250px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "bold", color: "#2d3436" }}>
                    {t("Event Name / Holiday:", "Event Name / Holiday:")}
                    <input
                      type="text"
                      placeholder="e.g. Deepawali, Vijaya Dashami..."
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      style={{ ...inputStyle, width: "100%", padding: "10px" }}
                    />
                  </label>
                  <label style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "bold", color: "#2d3436" }}>
                    {t("Date:", "Date:")}
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      style={{ ...inputStyle, width: "100%", padding: "10px" }}
                    />
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleAddCustomEvent}
                      style={{
                        background: "#8e44ad",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#732d91")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#8e44ad")}
                    >
                      {editingEventId ? `✏️ ${t("Update Event", "Update Event")}` : `➕ ${t("Add Event", "Add Event")}`}
                    </button>
                    {editingEventId && (
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          background: "#7f8c8d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 15px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          height: "40px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#95a5a6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#7f8c8d")}
                      >
                        {t("Cancel", "Cancel")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Events List */}
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fafafa",
                    maxHeight: "450px",
                    overflowY: "auto",
                  }}
                >
                  {customEvents.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#7f8c8d", fontSize: "14px", fontStyle: "italic" }}>
                      {t("noCustomEventsSaved", "No custom events saved yet. Use the form above to add reminders.")}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {customEvents.map((ev, index) => (
                        <div
                          key={ev.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 15px",
                            borderBottom: index === customEvents.length - 1 ? "none" : "1px solid #eee",
                            background: editingEventId === ev.id ? "#fcf9fe" : "#fff",
                            borderLeft: editingEventId === ev.id ? "4px solid #8e44ad" : "none",
                            transition: "background 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (editingEventId !== ev.id) e.currentTarget.style.background = "#fafafa";
                          }}
                          onMouseLeave={(e) => {
                            if (editingEventId !== ev.id) e.currentTarget.style.background = "#fff";
                          }}
                        >
                          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <span
                              style={{
                                background: "#f5e6ff",
                                color: "#8e44ad",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                              }}
                            >
                              {ev.date}
                            </span>
                            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50" }}>
                              {ev.title}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <button
                              onClick={() => startEditEvent(ev)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#3498db",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "4px",
                                transition: "transform 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                              title="Edit Event"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteCustomEvent(ev.id)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#e74c3c",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "4px",
                                transition: "transform 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                              title="Delete Event"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Muhurtha Analysis Tab */}
          {activeTab === "muhurtha" && !isLoading && (
            <div className="form-panel" style={{ maxWidth: "100%", margin: "0 auto", padding: "15px", border: "none", boxShadow: "none" }}>
              <h2>{t("ui.muhurtha_analysis", "Muhurtha Analysis")}</h2>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  background: "#f8f9fa",
                  padding: "18px",
                  borderRadius: "8px",
                  border: "1px solid #dcdde1",
                  marginBottom: "25px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <select
                  style={{ ...inputStyle, flex: 1, minWidth: "250px" }}
                  value={selectedProfileName}
                  onChange={(e) => loadSelectedProfile(e.target.value)}
                >
                  <option value="">-- Select Saved Profile --</option>
                  {savedProfilesList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  style={{ ...inputStyle, flex: 1, minWidth: "250px" }}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) mergeProfileData(e.target.value);
                  }}
                  disabled={!selectedProfileName}
                >
                  <option value="">🔀 Merge with another profile...</option>
                  {savedProfilesList
                    .filter((p) => p !== selectedProfileName)
                    .map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <button
                  style={{ ...actionBtnStyle, background: "#c0392b" }}
                  onClick={() => {
                    if (
                      !selectedProfileName ||
                      !window.confirm(`Delete profile ${selectedProfileName}?`)
                    )
                      return;
                    const saved = JSON.parse(
                      localStorage.getItem("panchanga_profiles") || "{}",
                    );
                    delete saved[selectedProfileName];
                    localStorage.setItem(
                      "panchanga_profiles",
                      JSON.stringify(saved),
                    );
                    setSavedProfilesList(Object.keys(saved));
                    loadSelectedProfile("");
                  }}
                >
                  🗑️ Delete
                </button>
              </div>

              {selectedProfileName && muhurthaData.length > 0 && (
                <>
                  <div
                    style={{
                      background: "#fffdf9",
                      borderLeft: "4px solid #f39c12",
                      padding: "18px",
                      borderRadius: "8px",
                      borderTop: "1px solid #fdf5e6",
                      borderRight: "1px solid #fdf5e6",
                      borderBottom: "1px solid #fdf5e6",
                      marginBottom: "25px",
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      Tarabalam Overrides:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={muhurthaForm.boyCheck}
                        onChange={(e) =>
                          setMuhurthaForm((f) => ({
                            ...f,
                            boyCheck: e.target.checked,
                          }))
                        }
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#8e44ad",
                        }}
                      />
                      <span style={{ color: "#3498db", fontWeight: "bold" }}>
                        Boy
                      </span>
                      {muhurthaForm.boyCheck && (
                        <select
                          style={{
                            ...inputStyle,
                            padding: "8px",
                            width: "auto",
                          }}
                          value={muhurthaForm.boyNakshatra}
                          onChange={(e) =>
                            setMuhurthaForm((f) => ({
                              ...f,
                              boyNakshatra: e.target.value,
                            }))
                          }
                        >
                          <option value="">- Nakshatra -</option>
                          {NAKSHATRAS.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={muhurthaForm.girlCheck}
                        onChange={(e) =>
                          setMuhurthaForm((f) => ({
                            ...f,
                            girlCheck: e.target.checked,
                          }))
                        }
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#8e44ad",
                        }}
                      />
                      <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                        Girl
                      </span>
                      {muhurthaForm.girlCheck && (
                        <select
                          style={{
                            ...inputStyle,
                            padding: "8px",
                            width: "auto",
                          }}
                          value={muhurthaForm.girlNakshatra}
                          onChange={(e) =>
                            setMuhurthaForm((f) => ({
                              ...f,
                              girlNakshatra: e.target.value,
                            }))
                          }
                        >
                          <option value="">- Nakshatra -</option>
                          {NAKSHATRAS.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <button
                      style={{
                        ...actionBtnStyle,
                        background: "#27ae60",
                        marginLeft: "auto",
                      }}
                      onClick={applyMuhurthaTarabalam}
                    >
                      ✨ Apply
                    </button>
                  </div>

                  <details
                    className="table-panel"
                    style={{
                      marginBottom: "25px",
                      background: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #dcdde1",
                      overflow: "hidden"
                    }}
                    open={isMuhurthaTableOpen}
                    onToggle={(e) => setIsMuhurthaTableOpen(e.target.open)}
                  >
                    <summary
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #eee",
                        background: "#fdfefe",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#8e44ad",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      📋 {t("savedMuhurthaTable", "Saved Muhurtha Table")} ({muhurthaData.length} {t("rows", "rows")})
                    </summary>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        padding: "15px 20px",
                        borderBottom: "2px solid #eee",
                        background: "#fdfefe",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{ ...actionBtnStyle, background: "#8e44ad" }}
                          onClick={updateTableNotes}
                        >
                          Global Notes
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#c0392b" }}
                          onClick={() => {
                            if (muhurthaSelectedRows.size === 0) {
                              return alert("Please select at least one row to delete!");
                            }
                            if (!window.confirm("Are you sure you want to delete the selected rows?")) {
                              return;
                            }
                            const newData = muhurthaDataRef.current.filter(
                              (_, i) => !muhurthaSelectedRows.has(i),
                            );
                            setMuhurthaDataAndRef(newData);
                            setMuhurthaSelectedRows(new Set());

                            const savedProfiles = JSON.parse(localStorage.getItem("panchanga_profiles") || "{}");
                            if (savedProfiles[selectedProfileName]) {
                              if (Array.isArray(savedProfiles[selectedProfileName])) savedProfiles[selectedProfileName] = newData;
                              else savedProfiles[selectedProfileName].rows = newData;
                              localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
                            }
                          }}
                        >
                          Delete Rows
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#d35400" }}
                          onClick={exportMuhurthaPDF}
                        >
                          Export PDF
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#f39c12" }}
                          onClick={handleRenameTable}
                        >
                          Rename Table
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#c0392b" }}
                          onClick={() => {
                            const profileName = formData.profileName.trim();
                            if (!profileName)
                              return alert(
                                "Please enter a profile name to delete.",
                              );
                            const savedProfiles = JSON.parse(
                              localStorage.getItem("panchanga_profiles") || "{}",
                            );
                            if (!savedProfiles[profileName]) {
                              return alert(
                                `Profile "${profileName}" does not exist.`,
                              );
                            }
                            if (
                              window.confirm(
                                `Are you sure you want to delete profile "${profileName}"?`,
                              )
                            ) {
                              delete savedProfiles[profileName];
                              localStorage.setItem(
                                "panchanga_profiles",
                                JSON.stringify(savedProfiles),
                              );
                              setSavedProfilesList(Object.keys(savedProfiles));
                              setResultData([]);
                              alert(
                                `Profile "${profileName}" deleted successfully!`,
                              );
                            }
                          }}
                        >
                          Delete Table
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#27ae60" }}
                          onClick={exportMuhurthaCSV}
                        >
                          Export CSV
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#2ecc71" }}
                          onClick={() => muhurthaCsvRef.current.click()}
                        >
                          Import CSV
                        </button>
                        <button
                          style={{ ...actionBtnStyle, background: "#3498db" }}
                          onClick={saveMuhurthaTable}
                        >
                          Save
                        </button>
                        <input
                          type="file"
                          accept=".csv"
                          ref={muhurthaCsvRef}
                          style={{ display: "none" }}
                          onChange={(e) => handleImportCSV(e, "muhurtha")}
                        />
                      </div>

                      <div style={{ display: "flex", width: "100%" }}>
                        <input
                          type="text"
                          placeholder="Custom message for PDF export..."
                          style={{
                            ...inputStyle,
                            width: "100%",
                            padding: "8px 12px",
                            boxSizing: "border-box",
                          }}
                          value={muhurthaForm.pdfMessage}
                          onChange={(e) =>
                            setMuhurthaForm((f) => ({
                              ...f,
                              pdfMessage: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="table-scroll" style={{ maxHeight: "400px", overflow: "auto" }}>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "40px", textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={
                                  muhurthaSelectedRows.size ===
                                  muhurthaData.length &&
                                  muhurthaData.length > 0
                                }
                                onChange={(e) =>
                                  setMuhurthaSelectedRows(
                                    e.target.checked
                                      ? new Set(muhurthaData.map((_, i) => i))
                                      : new Set(),
                                  )
                                }
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                }}
                              />
                            </th>
                            {muhurthaColumns.map((k, i) => (
                              <th key={i} style={{ whiteSpace: "nowrap" }}>
                                {k.replace(/_/g, " ")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {muhurthaData.map((row, rIndex) => (
                            <tr
                              key={rIndex}
                              style={{
                                background:
                                  rIndex % 2 === 0 ? "#fff" : "#fcfcfc",
                              }}
                            >
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={muhurthaSelectedRows.has(rIndex)}
                                  onChange={() =>
                                    toggleMuhurthaRowSelect(rIndex)
                                  }
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              {muhurthaColumns.map((k, cIndex) => {
                                let dataKey = row.hasOwnProperty(k)
                                  ? k
                                  : k.replace(/ /g, "_");
                                let isGood = row[dataKey + "_is_good"] === true;
                                let isBad =
                                  (k === "Asthg" && row[dataKey] !== "-") ||
                                  (k.includes("Chandra Balam") &&
                                    row[dataKey] === "Ashtama");
                                return (
                                  <td
                                    key={cIndex}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                      handleCellEdit(
                                        rIndex,
                                        dataKey,
                                        e.target.innerText,
                                      )
                                    }
                                    style={{
                                      whiteSpace: "nowrap",
                                      outline: "none",
                                      background: isGood
                                        ? "#eafaf1"
                                        : isBad
                                          ? "#fdedec"
                                          : "transparent",
                                      color: isGood
                                        ? "#1e8449"
                                        : isBad
                                          ? "#c0392b"
                                          : "inherit",
                                      fontWeight:
                                        isGood || isBad ? "bold" : "normal",
                                    }}
                                  >
                                    {row[dataKey] !== undefined
                                      ? row[dataKey]
                                      : ""}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {selectedProfileName && (
                      <div
                        style={{
                          padding: "10px 20px",
                          fontSize: "0.85rem",
                          color: "#7f8c8d",
                          fontStyle: "italic",
                          borderTop: "1px solid #eee",
                          textAlign: "left",
                          background: "#fafafa",
                        }}
                      >
                        Saved Location:{" "}
                        {selectedProfileLocation ? (
                          <>
                            <strong>{selectedProfileLocation.city || "N/A"}</strong> (Lat: {selectedProfileLocation.lat || "N/A"}, Lon: {selectedProfileLocation.lon || "N/A"}, TZ: {selectedProfileLocation.tz || "N/A"})
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    )}
                  </details>

                  <section
                    style={{
                      background: "#fff",
                      border: "1px solid #dcdde1",
                      borderRadius: "12px",
                      padding: "25px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "10px"
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 20px 0",
                        color: "#8e44ad",
                        fontSize: "1.2rem",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "10px",
                      }}
                    >
                      ☸️ Muhurtha Chakra (D1, D9 & Notes)
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <select
                        style={{
                          ...inputStyle,
                          padding: "8px",
                          width: "auto",
                          minWidth: "200px",
                        }}
                        value={chartDateSelect}
                        onChange={handleChartDateSelect}
                      >
                        <option value="">-- Custom Date --</option>
                        {muhurthaData.map((r, i) => (
                          <option
                            key={i}
                            value={JSON.stringify({
                              date: r.Date,
                              time: r.Sunrise,
                              vaara: r.Vaara,
                              tithi: r.Tithi,
                              nakshatra: r.Nakshatra,
                              yoga: r.Yoga,
                              karana: r.Karana,
                              varjyam: r.Varjyam,
                              durm: r.Durmuhurtham,
                              rahu: r["Rahu_Kalam"] || r["Rahu Kalam"],
                              yama: r.Yamagandam,
                            })}
                          >
                            {r.Date} (Sunrise: {r.Sunrise})
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        style={{ ...inputStyle, padding: "8px", width: "auto" }}
                        value={chartDate}
                        onChange={(e) => setChartDate(e.target.value)}
                      />
                      <input
                        type="time"
                        step="1"
                        style={{ ...inputStyle, padding: "8px", width: "auto" }}
                        value={chartTime}
                        onChange={(e) => setChartTime(e.target.value)}
                      />
                      {isChartLoading && (
                        <span style={{ color: "#3498db", fontWeight: "bold", fontSize: "14px", marginLeft: "10px" }}>
                          ⏳ Updating...
                        </span>
                      )}
                    </div>

                    {muhurthaChartData && (
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          flexWrap: "wrap",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          opacity: isChartLoading ? 0.5 : 1,
                          pointerEvents: isChartLoading ? "none" : "auto",
                          transition: "opacity 0.3s ease"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            alignItems: "center",
                            flex: "0 0 384px",
                          }}
                        >
                          <RashiChart
                            planets={convertMuhurthaChartArrayToPlanets(muhurthaChartData.chart)}
                            navamsa={convertMuhurthaChartArrayToPlanets(muhurthaChartData.chart_d9)}
                            hideD1Settings={false}
                            hideDivisionalSelector={false}
                            defaultShowDivisional={false}
                            d1Size={384}
                            d1Footer={
                              selectedProfileLocation ? (
                                <div style={{ textAlign: "center", fontSize: "11px", color: "#7f8c8d", marginTop: "10px" }}>
                                  Location: <strong>{selectedProfileLocation.city || "N/A"}</strong> (Lat: {selectedProfileLocation.lat || "N/A"}, Lon: {selectedProfileLocation.lon || "N/A"}, TZ: {selectedProfileLocation.tz || "N/A"})
                                </div>
                              ) : (
                                <div style={{ textAlign: "center", fontSize: "11px", color: "#7f8c8d", marginTop: "10px" }}>
                                  Location: <strong>{formData.city || "N/A"}</strong> (Lat: {formData.lat || "N/A"}, Lon: {formData.lon || "N/A"}, TZ: {formData.tz || "N/A"})
                                </div>
                              )
                            }
                            d9Footer={
                              <div style={{ textAlign: "center", fontSize: "12px", color: "#7f8c8d", marginTop: "10px" }}>
                                <strong>Ayanamsha:</strong> {muhurthaChartData.ayanamsha_name}
                              </div>
                            }
                          />
                        </div>

                        <div
                          style={{
                            flex: "1 1 336px",
                            minWidth: "336px",
                            maxWidth: "480px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              background: "#fff",
                              padding: "20px",
                              borderRadius: "12px",
                              border: "1px solid #eaeaea",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                              boxSizing: "border-box",
                            }}
                          >
                            <h4
                              style={{ margin: "0 0 10px 0", color: "#2c3e50", fontSize: "19.2px" }}
                            >
                              Muhurtha Details
                            </h4>
                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Lagna Pos:</strong>{" "}
                              <span
                                style={{ color: "#c0392b", fontWeight: "bold" }}
                              >
                                {muhurthaChartData.lagna_deg} (
                                {muhurthaChartData.lagna_rem_pct}%)
                              </span>
                            </p>
                            {muhurthaChartData.lagna_name && (
                              <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                                <strong>{t("lagna_span", "Lagna Span")}:</strong>{" "}
                                <span style={{ color: "#e67e22", fontWeight: "bold" }}>
                                  {muhurthaChartData.lagna_start} - {muhurthaChartData.lagna_end}
                                </span>
                              </p>
                            )}

                            <div style={{ height: "8px" }} />

                            {muhurthaChartData.mid_lagna_window && (
                              <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                                <strong>{muhurthaChartData.lagna_name || "Lagna"} Lagna:</strong>{" "}
                                <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                                  {muhurthaChartData.mid_lagna_window}
                                </span>
                              </p>
                            )}
                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Muhurtha:</strong>{" "}
                              <span
                                style={{
                                  color: muhurthaChartData.muhurtha_is_good
                                    ? "#27ae60"
                                    : "#c0392b",
                                  fontWeight: "bold",
                                }}
                              >
                                {muhurthaChartData.current_muhurtha} (
                                {muhurthaChartData.current_muhurtha_start
                                  ? `${muhurthaChartData.current_muhurtha_start} ${t("to", "to")} ${muhurthaChartData.current_muhurtha_end}`
                                  : `Ends: ${muhurthaChartData.current_muhurtha_end}`}
                                )
                              </span>
                            </p>
                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Pushkaraamsha:</strong>{" "}
                              <span style={{ color: "#8e44ad", fontWeight: "bold" }}>
                                {muhurthaChartData.pushkaramsha_time}
                              </span>
                            </p>

                            <div style={{ height: "8px" }} />

                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Pushkara:</strong>{" "}
                              <span
                                style={{
                                  color: muhurthaChartData.is_pushkara
                                    ? "#27ae60"
                                    : "#c0392b",
                                  fontWeight: "bold",
                                }}
                              >
                                {muhurthaChartData.pushkaramsha}
                              </span>
                            </p>
                            {muhurthaChartData.lagna_tyajyam && (
                              <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                                <strong>Lagna Tyajyamu:</strong>{" "}
                                <span style={{ color: "#c0392b", fontWeight: "bold" }}>
                                  {muhurthaChartData.lagna_tyajyam}
                                </span>
                              </p>
                            )}
                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Panchakam:</strong>{" "}
                              <span
                                style={{
                                  color: muhurthaChartData.panchaka_is_good
                                    ? "#27ae60"
                                    : "#c0392b",
                                  fontWeight: "bold",
                                }}
                              >
                                {muhurthaChartData.panchaka}
                              </span>
                            </p>
                          </div>

                          <div
                            style={{
                              background: "#fff",
                              padding: "20px",
                              borderRadius: "12px",
                              border: "1px solid #eaeaea",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                              boxSizing: "border-box",
                            }}
                          >
                            <h4
                              style={{ margin: "0 0 10px 0", color: "#2c3e50", fontSize: "19.2px" }}
                            >
                              Inauspicious Timings
                            </h4>
                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Rahu Kalam:</strong>{" "}
                              <span style={{ color: "#e67e22" }}>
                                {muhurthaChartData.rahu_kalam || "-"}
                              </span>
                            </p>

                            <div style={{ height: "8px" }} />

                            <p style={{ margin: "5px 0", fontSize: "16.8px" }}>
                              <strong>Yamagandam:</strong>{" "}
                              <span style={{ color: "#e67e22" }}>
                                {muhurthaChartData.yamagandam || "-"}
                              </span>
                            </p>

                            <div style={{ height: "8px" }} />

                            <div style={{ margin: "8px 0", fontSize: "16.8px" }}>
                              <strong>Varjyam:</strong>
                              <div style={{ color: "#c0392b", marginTop: "2px", fontWeight: "bold" }}>
                                {renderIntervalList(muhurthaChartData.varjyam)}
                              </div>
                            </div>

                            <div style={{ height: "8px" }} />

                            <div style={{ margin: "8px 0", fontSize: "16.8px" }}>
                              <strong>Durmuhurtham:</strong>
                              <div style={{ color: "#d35400", marginTop: "2px", fontWeight: "bold" }}>
                                {renderIntervalList(muhurthaChartData.durmuhurtham)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            flex: "1 1 320px",
                            minWidth: "300px",
                            maxWidth: "600px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >

                          <div
                            style={{
                              background: "#fef5e7",
                              padding: "20px",
                              borderRadius: "12px",
                              border: "1px solid #f39c12",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 15px 0",
                                color: "#d35400",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span>{t("Doshas", "Doshas")}</span>
                              <span
                                title="Read about Doshas"
                                onClick={() => setShowDoshaInfo(true)}
                                style={{
                                  fontSize: "14px",
                                  cursor: "pointer",
                                  color: "#fff",
                                  background: "#3498db",
                                  borderRadius: "50%",
                                  width: "22px",
                                  height: "22px",
                                  display: "inline-flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontFamily: "serif",
                                  fontStyle: "italic",
                                  border: "2px solid #2980b9",
                                }}
                              >
                                i
                              </span>
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                              }}
                            >
                              {(() => {
                                const prefs = JSON.parse(
                                  localStorage.getItem("eclock_prefs") || "{}",
                                );
                                const activeDoshas = prefs.active_doshas || [
                                  "Saptamastha Graha",
                                  "Bhrigu Shatka",
                                  "Ashtamastha Kuja",
                                  "Sankranti Dosha",
                                  "Asthangatha",
                                  "Grahanam (Eclipse)",
                                  "Grahana Utpata Dosha",
                                  "Rahu Kalam",
                                ];
                                const filteredDoshas = (
                                  muhurthaChartData.doshas || []
                                ).filter((d) => activeDoshas.includes(d));
                                if (filteredDoshas.length === 0)
                                  return (
                                    <div
                                      style={{
                                        background: "#eafaf1",
                                        color: "#27ae60",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        border: "1px solid #2ecc71",
                                        width: "100%",
                                        textAlign: "center",
                                      }}
                                    >
                                      Shubham! No Mahadoshas found.
                                    </div>
                                  );
                                return filteredDoshas.map((d) => (
                                  <div
                                    key={d}
                                    style={{
                                      background: "#fdedec",
                                      color: "#c0392b",
                                      padding: "6px 12px",
                                      borderRadius: "6px",
                                      fontSize: "13px",
                                      fontWeight: "bold",
                                      border: "1px solid #e74c3c",
                                    }}
                                  >
                                    {d === "Shashtashta Chandra"
                                      ? "Ch in 6,8,12"
                                      : d}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "#fff",
                              padding: "20px",
                              borderRadius: "12px",
                              border: "1px solid #eaeaea",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 15px 0",
                                color: "#8e44ad",
                                fontSize: "1.1rem",
                                borderBottom: "1px solid #eee",
                                paddingBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              <span>🔔 {t("Event Reminder", "Event Reminder")}</span>
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              {(() => {
                                const eventsToday = customEvents.filter(ev => ev.date === chartDate);
                                if (eventsToday.length === 0) {
                                  return (
                                    <div
                                      style={{
                                        color: "#7f8c8d",
                                        fontSize: "14px",
                                        fontStyle: "italic",
                                        padding: "10px 0",
                                      }}
                                    >
                                      {t("No events for this date", "No events for this date.")}
                                    </div>
                                  );
                                }
                                return eventsToday.map((ev) => (
                                  <div
                                    key={ev.id}
                                    style={{
                                      background: "#fff9e6",
                                      color: "#d35400",
                                      padding: "10px 15px",
                                      borderRadius: "8px",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                      border: "2px dashed #f39c12",
                                      width: "100%",
                                      boxSizing: "border-box",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      animation: "pulseAlert 2s infinite alternate",
                                    }}
                                  >
                                    <style>{`
                                      @keyframes pulseAlert {
                                        from { border-color: #f39c12; box-shadow: 0 0 2px rgba(243, 156, 18, 0.2); }
                                        to { border-color: #e67e22; box-shadow: 0 0 8px rgba(230, 126, 34, 0.4); }
                                      }
                                    `}</style>
                                    <span style={{ fontSize: "130%" }}>{ev.title}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "#fff",
                              padding: "20px",
                              borderRadius: "12px",
                              border: "1px solid #eaeaea",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                            }}
                          >
                            <h4
                              style={{ margin: "0 0 10px 0", color: "#8e44ad" }}
                            >
                              Global Notes (for {chartDate})
                            </h4>
                            <textarea
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                outline: "none",
                                boxSizing: "border-box",
                                minHeight: "80px",
                                fontSize: "14px",
                                resize: "vertical",
                                fontFamily: "inherit",
                              }}
                              placeholder="Custom notes (rituals, items needed)..."
                              value={globalNotes}
                              onChange={(e) => setGlobalNotes(e.target.value)}
                            />
                            <button
                              style={{
                                ...actionBtnStyle,
                                background: "#27ae60",
                                marginTop: "10px",
                                width: "100%",
                                justifyContent: "center",
                                padding: "12px",
                              }}
                              onClick={saveGlobalNotes}
                            >
                              💾 Save Notes Globally
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          )}

          {/* Adhika Masa Tab */}
          {activeTab === "adhika" && !isLoading && <AdhikaMasaExplorer />}

          {/* Eclipse Tab */}
          {activeTab === "eclipse" && (
            <EclipsePage logoUrl={null} embedded={true} />
          )}
        </div>
      </section>

      {/* Dosha Info Modal */}
      {showDoshaInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 10001,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setShowDoshaInfo(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px 30px",
              borderRadius: "12px",
              maxWidth: "650px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #fadbd8",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ margin: 0, color: "#d35400" }}>
                Ekavimshathi (21) Mahadoshas
              </h3>
              <button
                onClick={() => setShowDoshaInfo(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#c0392b",
                  fontWeight: "bold",
                }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14.5px", color: "#555", lineHeight: "1.6" }}>
              These are 17 major astrological blemishes strictly analyzed in
              Vedic Astrology for selecting an auspicious Muhurtha.
            </p>
            <ol
              style={{
                fontSize: "13.5px",
                color: "#2c3e50",
                lineHeight: "1.7",
                margin: 0,
                paddingLeft: "20px",
              }}
            >
              <li>
                <b>Saptamastha Graha:</b> Any planet situated in the 7th house
                (afflicts marriage & partnerships).
              </li>
              <li>
                <b>Ch in 6,8,12:</b> The Moon placed in the 6th, 8th, or 12th
                house from Lagna.
              </li>
              <li>
                <b>Sagraha Chandra Dosha:</b> Moon conjoined with any other planet in the same Rasi.
              </li>
              <li>
                <b>Bhrigu Shatka:</b> Venus (Shukra) placed in the 6th house
                from Lagna.
              </li>
              <li>
                <b>Ashtamastha Kuja:</b> Mars (Kuja) placed in the 8th house
                from Lagna.
              </li>
              <li>
                <b>Gandanta (Moon):</b> Moon in the junction of Water and Fire
                signs (Ashlesha-Magha, Jyeshtha-Mula, Revati-Ashwini).
              </li>
              <li>
                <b>Sankranti Dosha:</b> Sun transitioning from one Rasi to another (avoid hours around Sankranti).
              </li>
              <li>
                <b>Asthangatha (Combustion):</b> Benefics like Jupiter (Guru) or
                Venus (Shukra) being too close to the Sun.
              </li>
              <li>
                <b>Bad Panchakam:</b> Inauspicious numerical combination
                resulting in Mrityu, Agni, Raja, Chora, or Roga.
              </li>
              <li>
                <b>Krura Muhurtha:</b> Inauspicious 48-minute daily segments
                (e.g., Rudra, Ahi, Pitru).
              </li>
              <li>
                <b>Dagdha Tithi Dosha:</b> Inauspicious combination of weekday and Tithi (burnt days).
              </li>
              <li>
                <b>Grahanam (Eclipse):</b> Muhurtha falling exactly on a Solar or Lunar Eclipse day.
              </li>
              <li>
                <b>Grahana Utpata Dosha:</b> Muhurtha falling in a Nakshatra where an eclipse occurred in the last 6 months.
              </li>
              <li>
                <b>Rahu Kalam:</b> Muhurtha time overlapping with Rahu Kalam (avoided for auspicious works).
              </li>
              <li>
                <b>Yamagandam:</b> Muhurtha time overlapping with Yamagandam (avoided for auspicious works).
              </li>
              <li>
                <b>Varjyam:</b> Muhurtha time overlapping with Varjyam (tyajyam) window.
              </li>
              <li>
                <b>Durmuhurtham:</b> Muhurtha time overlapping with Durmuhurtham window.
              </li>
            </ol>
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={() => setShowDoshaInfo(false)}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "10px 30px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "15px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLunarMonthsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 10002,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setShowLunarMonthsModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px 30px",
              borderRadius: "12px",
              maxWidth: "700px",
              width: "95%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #8e44ad",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ margin: 0, color: "#8e44ad" }}>
                🌙 12 Lunar Months (Maasa) Names & Dates
              </h3>
              <button
                onClick={() => setShowLunarMonthsModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#c0392b",
                  fontWeight: "bold",
                }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              The next 12 lunar months starting from the selected date:
            </p>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left", color: "#8e44ad" }}>#</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left", color: "#8e44ad" }}>Maasa Name</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left", color: "#8e44ad" }}>Start Date & Time</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left", color: "#8e44ad" }}>End Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {lunarMonthsData.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px", fontWeight: "bold", color: "#2c3e50" }}>{item.masa}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.startDate}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
