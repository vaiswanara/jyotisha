import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";

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

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
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
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const BENEFIC_POSITIONS = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 4, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
  Lagna: {
    Sun: [3, 4, 6, 10, 11, 12],
    Moon: [3, 6, 10, 11],
    Mars: [1, 3, 6, 10, 11],
    Mercury: [1, 2, 4, 6, 8, 10, 11],
    Jupiter: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 3, 4, 6, 10, 11],
    Lagna: [3, 6, 10, 11]
  }
};

const SUBJECT_COLORS = {
  Su: "#f39c12",
  Ch: "#2980b9",
  Ku: "#e74c3c",
  Bu: "#27ae60",
  Gu: "#d35400",
  Sk: "#8e44ad",
  Sa: "#34495e",
  Lg: "#c0392b",
};

const PAV_SUBJECTS = [
  { key: "Sun", label: "Su", translationKey: "Su" },
  { key: "Moon", label: "Ch", translationKey: "Ch" },
  { key: "Mars", label: "Ku", translationKey: "Ku" },
  { key: "Mercury", label: "Bu", translationKey: "Bu" },
  { key: "Jupiter", label: "Gu", translationKey: "Gu" },
  { key: "Venus", label: "Sk", translationKey: "Sk" },
  { key: "Saturn", label: "Sa", translationKey: "Sa" },
  { key: "Lagna", label: "Lg", translationKey: "Lg" },
];

const baseClockSize = 615;

export function EClockPage() {
  const { t } = useTranslation();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

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

  // Refs for Animation & Canvas
  const canvasRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const pipVideoRef = useRef(null);
  const customDateRef = useRef(null);
  const customTimeRef = useRef(null);

  // Mutable Refs (To avoid stale closures in animation loop)
  const prefsRef = useRef({
    clock_zoom: 1.0,
    clock_canvas_bg: "#ffffff",
    clock_dial_text: "#2c3e50",
    clock_rashi_odd: "#f4f6f9",
    clock_rashi_even: "#ebdef0",
    clock_nak_odd: "#eafaf1",
    clock_nak_even: "#fdfefe",
    clock_pada_odd: "#fcf3cf",
    clock_pada_even: "#fdfefe",
    clock_Lg: "#c0392b",
    clock_Su: "#f39c12",
    clock_Mo: "#2980b9",
    clock_Ku: "#e74c3c",
    clock_Bu: "#27ae60",
    clock_Gu: "#d35400",
    clock_Sk: "#8e44ad",
    clock_Sa: "#34495e",
    clock_Ra: "#7f8c8d",
    clock_Ke: "#95a5a6",
    clock_text_time: "#8e44ad",
    clock_text_date: "#7f8c8d",
    clock_text_brand: "#c0392b",
    clock_text_rashi: "#2c3e50",
    clock_text_nak: "#2c3e50",
    clock_text_pada: "#2c3e50",
    clock_present_bg: "#111111",
    clock_present_timer: "#e74c3c",
    clock_brand_name: "Vaiswanara",
    clock_brand_tag: "e-Jyotisha",
    clock_visible_panels: [
      "panchanga",
      "time_machine",
      "countdown",
      "custom_date",
      "location",
    ],
    clock_visible_elements: ["time_date", "brand"],
  });

  const targetAnglesRef = useRef({
    lagna: 0,
    nav_lagna: 0,
    Su: 0,
    Mo: 0,
    Ku: 0,
    Bu: 0,
    Gu: 0,
    Sk: 0,
    Sa: 0,
    Ra: 0,
    Ke: 0,
    sunrise: 0,
  });
  const currentAnglesRef = useRef(null);
  const dynamicAnglesRef = useRef({
    dt: 270,
    br: 90,
    cd: 180,
    mh: 0,
    isFirst: true,
  });
  const mousePosRef = useRef({ x: -100, y: -100 });
  const hitboxesRef = useRef([]);

  const fixedTimeMsRef = useRef(null);
  const isCountdownActiveRef = useRef(false);
  const countdownTargetRef = useRef(null);
  const countdownLabelRef = useRef("Starts In");
  const isGhatiFormatRef = useRef(false);

  const allCitiesRef = useRef([]);
  const dynamicCitiesRef = useRef([]);
  const locRef = useRef({
    lat: 12.9716,
    lon: 77.5946,
    tz: 5.5,
    city: "Bengaluru, Karnataka",
  });

  // React States for UI
  const [clockZoom, setClockZoom] = useState(1.0);
  const [displayMode, setDisplayMode] = useState("clock");
  const [pavSubject, setPavSubject] = useState("Sun");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPanchanga, setCurrentPanchanga] = useState(null);
  const [isTimeTravel, setIsTimeTravel] = useState(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cdDate, setCdDate] = useState("");
  const [cdTime, setCdTime] = useState("12:00:00");
  const [cdLabel, setCdLabel] = useState("Starts In");
  const [cdFloatMode, setCdFloatMode] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [isGhatiUI, setIsGhatiUI] = useState(false);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalForm, setCustomModalForm] = useState({
    profileName: "",
    dob: "",
    tob: "",
    city: "",
    latitude: "",
    longitude: "",
    timezone: "5.5",
  });
  const [modalCitySearch, setModalCitySearch] = useState("");
  const [chartProfilesList, setChartProfilesList] = useState([]);

  // --- Data Fetching ---
  const fetchAngles = useCallback(async () => {
    const simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
    try {
      const params = new URLSearchParams({
        endpoint: "clock",
        lat: locRef.current.lat,
        lon: locRef.current.lon,
        tz: locRef.current.tz,
        timestamp: Math.floor(simTime / 1000),
      });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: { "x-api-token": API_TOKEN }
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        return; // HTML రెస్పాన్స్ (లేదా తప్పు ఫార్మాట్) వస్తే సైలెంట్ గా ఇగ్నోర్ చేస్తుంది
      }
      if (data.error) return;

      targetAnglesRef.current = data;
      if (data.panchanga) {
        setCurrentPanchanga((prev) =>
          JSON.stringify(prev) === JSON.stringify(data.panchanga)
            ? prev
            : data.panchanga,
        );
      }
      if (!currentAnglesRef.current) {
        currentAnglesRef.current = JSON.parse(JSON.stringify(data));
      }

      setIsOfflineFallback(data.meta && data.meta.engine === "fallback");
      setIsTimeTravel(fixedTimeMsRef.current !== null);
    } catch (e) {
      console.error("Clock fetch error", e);
    }
  }, []);

  // --- Initialization ---
  useEffect(() => {
    // Load preferences
    try {
      const stored = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
      prefsRef.current = { ...prefsRef.current, ...stored };
      setClockZoom(prefsRef.current.clock_zoom || 1.0);
      if (prefsRef.current.default_display_mode)
        setDisplayMode(prefsRef.current.default_display_mode);
    } catch (e) { }

    // Load birth chart profiles list
    try {
      const saved = JSON.parse(
        localStorage.getItem("vaiswanara_profiles") || "{}",
      );
      setChartProfilesList(Object.keys(saved));
    } catch (e) {
      console.error(e);
    }

    // Load cities
    const loadCities = async () => {
      try {
        const r = await fetch(`${import.meta.env.BASE_URL}static/cities.json`);
        const text = await r.text();
        allCitiesRef.current = JSON.parse(text);
      } catch (e) {
        // ఫైల్ లేకపోయినా లేదా HTML వచ్చినా ఎర్రర్ త్రో చేయకుండా సైలెంట్ గా స్కిప్ చేస్తుంది
      }
    };
    loadCities();

    // Load default location
    try {
      const settingsLoc = JSON.parse(
        localStorage.getItem("vaiswanara_default_location") || "null"
      );
      if (settingsLoc && settingsLoc.latitude && settingsLoc.longitude) {
        locRef.current = {
          lat: parseFloat(settingsLoc.latitude),
          lon: parseFloat(settingsLoc.longitude),
          tz: parseFloat(settingsLoc.timezone || 5.5),
          city: settingsLoc.city || "Bengaluru, Karnataka",
        };
        setCitySearch(locRef.current.city);
      } else {
        locRef.current = {
          lat:
            prefsRef.current.default_lat !== undefined
              ? prefsRef.current.default_lat
              : 12.9716,
          lon:
            prefsRef.current.default_lon !== undefined
              ? prefsRef.current.default_lon
              : 77.5946,
          tz:
            prefsRef.current.default_tz !== undefined
              ? prefsRef.current.default_tz
              : 5.5,
          city: prefsRef.current.default_location || "Bengaluru, Karnataka",
        };
        setCitySearch(locRef.current.city);
      }
    } catch (e) { }

    // Init custom dates
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const pad = (n) => n.toString().padStart(2, "0");
    const dStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const tStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setCdDate(dStr);
    setCdTime(tStr);
    if (customDateRef.current) customDateRef.current.value = dStr;
    if (customTimeRef.current) customTimeRef.current.value = tStr;

    fetchAngles();
    const intv = setInterval(fetchAngles, 5000);
    return () => clearInterval(intv);
  }, [fetchAngles]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const updateMobileLayout = () => setIsCompactMobile(media.matches);
    updateMobileLayout();
    media.addEventListener?.("change", updateMobileLayout);
    return () => media.removeEventListener?.("change", updateMobileLayout);
  }, []);

  // --- Helper Functions ---
  const lerpAngle = (a, b, t) => {
    let diff = (b - a) % 360;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    let res = a + diff * t;
    return ((res % 360) + 360) % 360;
  };

  const formatPanchangaTime = (stdttr, targetTs, remPct) => {
    if (!stdttr || stdttr === "-") return stdttr;

    let cleanStr = String(stdttr).trim();
    let isNextDay = cleanStr.startsWith("+");
    if (isNextDay) {
      cleanStr = cleanStr.substring(1).trim();
    } else if (targetTs) {
      const simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
      const simDate = new Date(simTime);
      const tzOffsetHours = parseFloat(locRef.current.tz || 5.5);
      const currentLocal = new Date(simDate.getTime() + tzOffsetHours * 3600000);
      const targetLocal = new Date(targetTs * 1000 + tzOffsetHours * 3600000);
      if (targetLocal.getUTCDate() !== currentLocal.getUTCDate()) {
        isNextDay = true;
      }
    }

    let finalStr = cleanStr;

    if (
      isGhatiFormatRef.current &&
      targetAnglesRef.current &&
      targetAnglesRef.current.sunrise !== undefined
    ) {
      const formatSingle = (tStr, ts) => {
        let diffSeconds = 0;
        if (ts) {
          diffSeconds = ts - targetAnglesRef.current.sunrise;
        } else {
          const m = String(tStr).trim().match(/(\d+):(\d+)(?::(\d+))?/);
          if (!m) return String(tStr).trim();

          let h = parseInt(m[1], 10);
          let min = parseInt(m[2], 10);
          let sec = m[3] ? parseInt(m[3], 10) : 0;

          if (String(tStr).toUpperCase().includes("PM") && h < 12) h += 12;
          if (String(tStr).toUpperCase().includes("AM") && h === 12) h = 0;

          let simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
          let simDate = new Date(simTime);
          let tzOffsetHours = parseFloat(locRef.current.tz || 5.5);
          let locDate = new Date(simDate.getTime() + tzOffsetHours * 3600000);

          let targetLocalEpoch = Date.UTC(
            locDate.getUTCFullYear(),
            locDate.getUTCMonth(),
            locDate.getUTCDate(),
            h,
            min,
            sec,
          );
          if (isNextDay) targetLocalEpoch += 86400000;

          let computedTargetTs =
            (targetLocalEpoch - tzOffsetHours * 3600000) / 1000;
          diffSeconds = computedTargetTs - targetAnglesRef.current.sunrise;
        }

        if (diffSeconds < 0) diffSeconds += 86400;

        let totalGhatis = diffSeconds / 1440.0;
        let prefix = "";
        if (totalGhatis >= 60) {
          prefix = "+";
          totalGhatis = totalGhatis % 60;
        }
        let g = Math.floor(totalGhatis);
        let remV = (totalGhatis - g) * 60;
        let v = Math.floor(remV);
        const pad = (n) => n.toString().padStart(2, "0");
        return `${prefix}${pad(g)}g : ${pad(v)}v`;
      };

      if (cleanStr.includes(" / ")) {
        finalStr = cleanStr
          .split(" / ")
          .map((part) => formatSingle(part, null))
          .join(" / ");
      } else {
        finalStr = formatSingle(cleanStr, targetTs);
      }
    } else {
      if (isNextDay && !finalStr.startsWith("+")) {
        finalStr = "+" + finalStr;
      }
    }

    if (remPct !== undefined && remPct !== null && !isNaN(remPct)) {
      finalStr += ` (${remPct}%)`;
    }

    return finalStr;
  };

  const getTooltipText = (id, deg, isR, isC, isH, tithiNum, paksha) => {
    const tr = tRef.current;
    deg = ((deg % 360) + 360) % 360;
    let rasiIdx = Math.floor(deg / 30) % 12;
    let nakIdx = Math.floor(deg / (360 / 27));
    let pada = (Math.floor(deg / (360 / 108)) % 4) + 1;
    let rem = deg % 30;
    let d = Math.floor(rem);
    let m = Math.floor((rem - d) * 60);

    let extra = [];
    if (isR) extra.push(tr("retro", "Retro"));
    if (isC) extra.push(tr("combust", "Combust"));
    if (isH) extra.push(tr("hora_lord", "Hora Lord"));
    if (id === "Ch" && tithiNum) {
      let pakshaLoc = tr(paksha, paksha);
      extra.push(`${pakshaLoc} ${tr("tithi", "Tithi")}: ${tithiNum}`);
    }
    let extraStr = extra.length > 0 ? ` (${extra.join(", ")})` : "";
    let rasiLoc = tr(RASI_NAMES[rasiIdx], RASI_NAMES[rasiIdx]);
    let nakLoc = tr(NAKSHATRAS[nakIdx], NAKSHATRAS[nakIdx]);
    let pLoc = tr(id, id);
    return `${pLoc}: ${d}°${m.toString().padStart(2, "0")}' ${rasiLoc} | ${nakLoc}-${pada}${extraStr}`;
  };

  // --- Canvas Drawing Logic ---
  const drawClock = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const tr = tRef.current;
    const angles = currentAnglesRef.current;
    const prefs = prefsRef.current;
    const isFull = !!(
      document.fullscreenElement || document.webkitFullscreenElement
    );
    const dMode = isFull ? (["chart", "pav"].includes(displayMode) ? displayMode : (prefs.default_display_mode || "clock")) : displayMode;

    if (!angles || !angles.Su) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isFull) {
      ctx.fillStyle = prefs.clock_present_bg || "#111111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    hitboxesRef.current = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
    let simDate = new Date(simTime);
    let tzOffsetHours = parseFloat(locRef.current.tz || 5.5);
    let locDate = new Date(simDate.getTime() + tzOffsetHours * 3600000);

    let timeStr = "";
    const pad = (n) => n.toString().padStart(2, "0");
    if (!isGhatiFormatRef.current) {
      let h = locDate.getUTCHours();
      let m = locDate.getUTCMinutes();
      let s = locDate.getUTCSeconds();
      let ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      h = h ? h : 12;
      timeStr = `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
    } else {
      let currentTs = simDate.getTime() / 1000.0;
      let sunriseTs = angles.sunrise || currentTs;
      let diffSeconds = currentTs - sunriseTs;
      if (diffSeconds < 0) diffSeconds += 86400;
      let totalGhatis = diffSeconds / 1440.0;
      let g = Math.floor(totalGhatis);
      let remV = (totalGhatis - g) * 60;
      let v = Math.floor(remV);
      let l = Math.floor((remV - v) * 60);
      timeStr = `${pad(g)}g : ${pad(v)}v : ${pad(l)}l`;
    }

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dateStr = `${weekdays[locDate.getUTCDay()]}, ${locDate.getUTCDate()} ${months[locDate.getUTCMonth()]} ${locDate.getUTCFullYear()}`;

    const drawSegment = (
      startDeg,
      endDeg,
      radius,
      thickness,
      text,
      bgColor,
      font,
      textColor,
    ) => {
      const startRad = ((startDeg - 90) * Math.PI) / 180,
        endRad = ((endDeg - 90) * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startRad, endRad);
      ctx.arc(cx, cy, radius - thickness, endRad, startRad, true);
      ctx.closePath();
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.strokeStyle = "#bdc3c7";
      ctx.lineWidth = 1;
      ctx.stroke();
      const midRad = (startRad + endRad) / 2,
        textRad = radius - thickness / 2;
      ctx.save();
      ctx.translate(
        cx + Math.cos(midRad) * textRad,
        cy + Math.sin(midRad) * textRad,
      );
      let rot = midRad + Math.PI / 2;
      if (rot > Math.PI / 2 && rot < (3 * Math.PI) / 2) rot -= Math.PI;
      ctx.rotate(rot);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColor || "#2c3e50";
      ctx.font = font;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const drawNeedle = (
      angleDeg,
      dotDistance,
      color,
      thickness,
      label,
      isH,
      tithiNum,
      paksha,
    ) => {
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad);
      const needleLength = 181;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(needleLength - 12, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(needleLength, 0);
      ctx.lineTo(needleLength - 15, -7);
      ctx.lineTo(needleLength - 15, 7);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotDistance, 0, 15, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.translate(dotDistance, 0);
      ctx.rotate(-angleRad);
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const relDeg = Math.floor((((angleDeg % 360) + 360) % 360) % 30);
      ctx.font = "bold 13px Arial";
      ctx.fillText(tr(label, label), 0, -4);
      ctx.font = "bold 9px Arial";
      ctx.fillText(relDeg + "°", 0, 7);
      ctx.restore();

      const px = cx + Math.cos(angleRad) * dotDistance;
      const py = cy + Math.sin(angleRad) * dotDistance;

      if (isH) {
        let bx = px - 15,
          by = py - 13;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#f1c40f";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H", bx, by + 1);
      }
      if (label === "Ch" && tithiNum) {
        let bx = px + 15,
          by = py + 13;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, 2 * Math.PI);
        if (paksha === "Shukla") {
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#2c3e50";
          ctx.stroke();
          ctx.fillStyle = "#2c3e50";
        } else {
          ctx.fillStyle = "#2c3e50";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
          ctx.fillStyle = "#ffffff";
        }
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tithiNum, bx, by + 1);
      }
      hitboxesRef.current.push({
        id: label,
        x: px,
        y: py,
        r: 21,
        angle: angleDeg,
        isR: false,
        isC: false,
        isH: isH,
        tithiNum,
        paksha,
      });
    };

    const drawTransit = (angleDeg, label, color, radius, isR, isC, isH) => {
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      const px = cx + Math.cos(angleRad) * radius,
        py = cy + Math.sin(angleRad) * radius;
      ctx.beginPath();
      ctx.arc(px, py, 15, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const relDeg = Math.floor((((angleDeg % 360) + 360) % 360) % 30);
      ctx.fillStyle = color;
      ctx.font = "bold 13px Arial";
      ctx.fillText(tr(label, label), px, py - 4);
      ctx.font = "bold 9px Arial";
      ctx.fillText(relDeg + "°", px, py + 7);
      if (isR) {
        let bx = px + 15,
          by = py - 13;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#2980b9";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText("R", bx, by + 1);
      }
      if (isC) {
        let bx = px + 15,
          by = py + 13;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#c0392b";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText("c", bx, by);
      }
      if (isH) {
        let bx = px - 15,
          by = py - 13;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#f1c40f";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText("H", bx, by + 1);
      }
      hitboxesRef.current.push({
        id: label,
        x: px,
        y: py,
        r: 21,
        angle: angleDeg,
        isR,
        isC,
        isH,
      });
    };

    if (dMode === "clock") {
      ctx.beginPath();
      ctx.arc(cx, cy, canvas.width / 2, 0, 2 * Math.PI);
      ctx.fillStyle = prefs.clock_canvas_bg || "#ffffff";
      ctx.fill();
      // Rings
      for (let i = 0; i < 12; i++)
        drawSegment(
          i * 30,
          (i + 1) * 30,
          275,
          40,
          tr(RASI_NAMES[i], RASI_NAMES[i]),
          i % 2 === 0
            ? prefs.clock_rashi_odd || "#f4f6f9"
            : prefs.clock_rashi_even || "#ebdef0",
          "bold 12px Arial",
          prefs.clock_text_rashi || prefs.clock_dial_text || "#2c3e50",
        );
      ctx.beginPath();
      ctx.arc(cx, cy, 275, 0, 2 * Math.PI);
      ctx.strokeStyle = "#8e44ad";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      for (let i = 0; i < 27; i++)
        drawSegment(
          i * (360 / 27),
          (i + 1) * (360 / 27),
          241,
          35,
          tr(NAKSHATRAS[i], NAKSHATRAS[i]).substring(0, 6),
          i % 2 === 0
            ? prefs.clock_nak_odd || "#eafaf1"
            : prefs.clock_nak_even || "#fdfefe",
          "10px Arial",
          prefs.clock_text_nak || prefs.clock_dial_text || "#2c3e50",
        );
      for (let i = 0; i < 108; i++)
        drawSegment(
          i * (360 / 108),
          (i + 1) * (360 / 108),
          206,
          25,
          ((i % 4) + 1).toString(),
          i % 2 === 0
            ? prefs.clock_pada_odd || "#fcf3cf"
            : prefs.clock_pada_even || "#fdfefe",
          "9px Arial",
          prefs.clock_text_pada || prefs.clock_dial_text || "#2c3e50",
        );

      // Needles
      drawNeedle(
        angles.Su.angle,
        75,
        prefs.clock_Su || "#f39c12",
        4,
        "Su",
        angles.Su.isH,
      );
      drawNeedle(
        angles.Mo.angle,
        110,
        prefs.clock_Mo || "#2980b9",
        3.5,
        "Ch",
        angles.Mo.isH,
        angles.Mo.tithi_num,
        angles.Mo.paksha,
      );
      drawNeedle(
        angles.lagna,
        145,
        prefs.clock_Lg || "#c0392b",
        5,
        "Lg",
        false,
      );

      // Transits
      const pColors = {
        Ku: prefs.clock_Ku || "#e74c3c",
        Bu: prefs.clock_Bu || "#27ae60",
        Gu: prefs.clock_Gu || "#d35400",
        Sk: prefs.clock_Sk || "#8e44ad",
        Sa: prefs.clock_Sa || "#34495e",
        Ra: prefs.clock_Ra || "#7f8c8d",
        Ke: prefs.clock_Ke || "#95a5a6",
      };
      let sortedPlanets = Object.keys(pColors)
        .filter((p) => angles[p] !== undefined)
        .map((p) => ({
          id: p,
          angle: angles[p].angle,
          isR: angles[p].isR,
          isC: angles[p].isC,
          isH: angles[p].isH,
        }))
        .sort((a, b) => a.angle - b.angle);
      let lastAngles = [-999, -999, -999];
      sortedPlanets.forEach((p) => {
        let level = 0;
        while (level < 3) {
          let diff = Math.min(
            Math.abs(p.angle - lastAngles[level]),
            360 - Math.abs(p.angle - lastAngles[level]),
          );
          if (diff > 11) break;
          level++;
        }
        if (level > 2) level = 2;
        lastAngles[level] = p.angle;
        drawTransit(
          p.angle,
          p.id,
          pColors[p.id],
          251 + level * 14,
          p.isR,
          p.isC,
          p.isH,
        );
      });

      // Dynamic Texts
      let dyn = dynamicAnglesRef.current;
      let clkElems = prefs.clock_visible_elements || [
        "time_date",
        "brand",
        "muhurtha",
      ];
      let activeNeedles = [angles.Su.angle, angles.Mo.angle, angles.lagna];
      let activeTexts = [];
      const getSafeAngle = (preferred, needles, texts) => {
        let all = [...preferred];
        for (let i = 0; i < 360; i += 15) if (!all.includes(i)) all.push(i);
        for (let c of all) {
          let safe = true;
          for (let n of needles) {
            if (Math.min(Math.abs(n - c), 360 - Math.abs(n - c)) < 38) {
              safe = false;
              break;
            }
          }
          if (!safe) continue;
          for (let t of texts) {
            if (Math.min(Math.abs(t - c), 360 - Math.abs(t - c)) < 45) {
              safe = false;
              break;
            }
          }
          if (safe) return c;
        }
        return preferred[0];
      };

      if (clkElems.includes("time_date")) {
        let tA = getSafeAngle(
          [270, 300, 240, 330, 210, 0, 180, 30, 150],
          activeNeedles,
          activeTexts,
        );
        activeTexts.push(tA);
        dyn.dt = dyn.isFirst ? tA : lerpAngle(dyn.dt, tA, 0.05);
      }
      if (clkElems.includes("brand")) {
        let bA = getSafeAngle(
          [90, 60, 120, 30, 150, 0, 180],
          activeNeedles,
          activeTexts,
        );
        activeTexts.push(bA);
        dyn.br = dyn.isFirst ? bA : lerpAngle(dyn.br, bA, 0.05);
      }
      if (isCountdownActiveRef.current && countdownTargetRef.current) {
        let cA = getSafeAngle(
          [180, 210, 150, 240, 120, 0, 30, 330],
          activeNeedles,
          activeTexts,
        );
        activeTexts.push(cA);
        dyn.cd = dyn.isFirst ? cA : lerpAngle(dyn.cd, cA, 0.05);
      }
      dyn.isFirst = false;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 6;
      if (clkElems.includes("time_date")) {
        let rad = ((dyn.dt - 90) * Math.PI) / 180,
          tx = cx + Math.cos(rad) * 110,
          ty = cy + Math.sin(rad) * 110;
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = prefs.clock_text_time || "#8e44ad";
        ctx.fillText(timeStr, tx, ty - 10);
        ctx.fillText(timeStr, tx, ty - 10);
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
        ctx.fillText(dateStr, tx, ty + 10);
        ctx.fillText(dateStr, tx, ty + 10);
      }
      if (clkElems.includes("brand")) {
        let rad = ((dyn.br - 90) * Math.PI) / 180,
          tx = cx + Math.cos(rad) * 110,
          ty = cy + Math.sin(rad) * 110;
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = prefs.clock_text_brand || "#c0392b";
        ctx.fillText(prefs.clock_brand_name || "Vaiswanara", tx, ty - 10);
        ctx.fillText(prefs.clock_brand_name || "Vaiswanara", tx, ty - 10);
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
        ctx.fillText(prefs.clock_brand_tag || "e-Jyotisha", tx, ty + 10);
        ctx.fillText(prefs.clock_brand_tag || "e-Jyotisha", tx, ty + 10);
      }
      if (isCountdownActiveRef.current && countdownTargetRef.current) {
        let diff = countdownTargetRef.current - Date.now();
        if (diff > 0) {
          let rad = ((dyn.cd - 90) * Math.PI) / 180,
            tx = cx + Math.cos(rad) * 110,
            ty = cy + Math.sin(rad) * 110;
          let hrs = Math.floor(diff / 3600000),
            mins = Math.floor((diff % 3600000) / 60000),
            secs = Math.floor((diff % 60000) / 1000);
          let cdStr =
            hrs > 0
              ? `-${pad(hrs)}:${pad(mins)}:${pad(secs)}`
              : `-${pad(mins)}:${pad(secs)}`;
          ctx.font = "bold 12px Arial";
          ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
          ctx.fillText(countdownLabelRef.current, tx, ty - 18);
          ctx.font = "bold 32px Arial";
          ctx.fillStyle = prefs.clock_present_timer || "#e74c3c";
          ctx.fillText(cdStr, tx, ty + 12);
          ctx.fillText(cdStr, tx, ty + 12);
        } else {
          isCountdownActiveRef.current = false;
        }
      }
      ctx.shadowBlur = 0;

      // Center Pin
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
      ctx.fillStyle = "#ebf5fb";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#3498db";
      ctx.stroke();
      ctx.font = "22px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🌍", cx, cy + 1);
    } else {
      if (chartStyle === "north") {
        ctx.fillStyle = prefs.clock_canvas_bg || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const M = 15;
        const W = canvas.width;
        const H = canvas.height;
        const borderCol = prefs.clock_dial_text || "#8e44ad";
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 2.5;

        // Draw Outer Border
        ctx.strokeRect(M, M, W - 2 * M, H - 2 * M);

        // Draw Diagonals
        ctx.beginPath();
        ctx.moveTo(M, M);
        ctx.lineTo(W - M, H - M);
        ctx.moveTo(M, H - M);
        ctx.lineTo(W - M, M);
        ctx.stroke();

        // Draw Inner Diamond
        const cx = W / 2;
        const cy = H / 2;
        ctx.beginPath();
        ctx.moveTo(cx, M);
        ctx.lineTo(M, cy);
        ctx.lineTo(cx, H - M);
        ctx.lineTo(W - M, cy);
        ctx.closePath();
        ctx.stroke();

        const scale = (W - 2 * M) / 320;

        // Draw a central masking circle to clear diagonal crossings for center text
        ctx.beginPath();
        ctx.arc(cx, cy, 65 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = prefs.clock_canvas_bg || "#ffffff";
        ctx.fill();
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Find lagnaRashi (1-based index)
        let lagnaRashi = 1;
        if (angles.lagna !== undefined) {
          lagnaRashi = (Math.floor(angles.lagna / 30) % 12) + 1;
        }

        // Gather planets
        const pColors = {
          Su: prefs.clock_Su || "#f39c12",
          Mo: prefs.clock_Mo || "#2980b9",
          Ku: prefs.clock_Ku || "#e74c3c",
          Bu: prefs.clock_Bu || "#27ae60",
          Gu: prefs.clock_Gu || "#d35400",
          Sk: prefs.clock_Sk || "#8e44ad",
          Sa: prefs.clock_Sa || "#34495e",
          Ra: prefs.clock_Ra || "#7f8c8d",
          Ke: prefs.clock_Ke || "#95a5a6",
        };
        let planetsToDraw = [];
        if (angles.lagna !== undefined)
          planetsToDraw.push({
            id: "Lg",
            color: prefs.clock_Lg || "#c0392b",
            angle: angles.lagna,
            isR: false,
            isC: false,
            isH: false,
          });
        Object.keys(pColors).forEach((p) => {
          if (angles[p] !== undefined)
            planetsToDraw.push({
              id: p === "Mo" ? "Ch" : p,
              color: pColors[p],
              angle: angles[p].angle,
              isR: angles[p].isR,
              isC: angles[p].isC,
              isH: angles[p].isH,
              tithiNum: p === "Mo" ? angles[p].tithi_num : undefined,
              paksha: p === "Mo" ? angles[p].paksha : undefined,
            });
        });

        // Group planets by rashi sign (0 to 11)
        const rashiPlanets = Array(12).fill(null).map(() => []);
        planetsToDraw.forEach((p) => {
          const rasiIdx = Math.floor(p.angle / 30) % 12;
          rashiPlanets[rasiIdx].push(p);
        });

        // Draw houses and populate hitboxes
        for (let h = 1; h <= 12; h++) {
          const houseRashi = ((lagnaRashi + h - 2) % 12) + 1;
          const pos = NORTH_INDIAN_LAYOUT[h];
          const rx = M + pos.rashi.x * scale;
          const ry = M + pos.rashi.y * scale;
          const px = M + pos.planets.x * scale;
          const py = M + pos.planets.y * scale;

          // Draw rashi number
          ctx.fillStyle = "#7f8c8d";
          ctx.font = `bold ${Math.max(10, Math.floor(13 * scale))}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(houseRashi.toString(), rx, ry);

          // Render planets
          const plist = rashiPlanets[houseRashi - 1] || [];
          const rows = [];
          const itemsPerRow = 3;
          for (let i = 0; i < plist.length; i += itemsPerRow) {
            rows.push(plist.slice(i, i + itemsPerRow));
          }

          rows.forEach((row, rowIdx) => {
            let cyPlanets = py;
            const rowSpacing = 16 * scale;
            if (rows.length === 2) {
              cyPlanets = py - rowSpacing / 2 + rowIdx * rowSpacing;
            } else if (rows.length === 3) {
              cyPlanets = py - rowSpacing + rowIdx * rowSpacing;
            } else if (rows.length > 3) {
              cyPlanets = py - 1.5 * rowSpacing + rowIdx * rowSpacing;
            }

            const itemSpacing = 44 * scale;
            const rowWidth = (row.length - 1) * itemSpacing;
            const startX = px - rowWidth / 2;

            row.forEach((planet, idx) => {
              const itemX = startX + idx * itemSpacing;
              const itemY = cyPlanets;

              const relDeg = Math.floor((((planet.angle % 360) + 360) % 360) % 30);
              const label = tr(planet.id, planet.id) + relDeg + "°" + (planet.isR ? "R" : "") + (planet.isC ? "c" : "");

              ctx.fillStyle = planet.color;
              ctx.font = `800 ${Math.max(10, Math.floor(13 * scale))}px sans-serif`;
              ctx.fillText(label, itemX, itemY);

              // Push to hitboxes
              hitboxesRef.current.push({
                id: planet.id,
                x: itemX,
                y: itemY,
                r: 12 * scale,
                angle: planet.angle,
                isR: planet.isR,
                isC: planet.isC,
                isH: planet.isH,
                tithiNum: planet.tithiNum,
                paksha: planet.paksha,
              });
            });
          });
        }
      } else {
        // --- SQUARE CHART MODE (South Indian layout) ---
        ctx.fillStyle = prefs.clock_canvas_bg || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const M = 15,
          S = (canvas.width - 2 * M) / 4;
        ctx.strokeStyle = prefs.clock_dial_text || "#8e44ad";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(M, M, 4 * S, 4 * S);
        ctx.strokeRect(M + S, M + S, 2 * S, 2 * S);
        ctx.beginPath();
        ctx.moveTo(M + S, M);
        ctx.lineTo(M + S, M + S);
        ctx.moveTo(M + 2 * S, M);
        ctx.lineTo(M + 2 * S, M + S);
        ctx.moveTo(M + 3 * S, M);
        ctx.lineTo(M + 3 * S, M + S);
        ctx.moveTo(M + S, M + 3 * S);
        ctx.lineTo(M + S, M + 4 * S);
        ctx.moveTo(M + 2 * S, M + 3 * S);
        ctx.lineTo(M + 2 * S, M + 4 * S);
        ctx.moveTo(M + 3 * S, M + 3 * S);
        ctx.lineTo(M + 3 * S, M + 4 * S);
        ctx.moveTo(M, M + S);
        ctx.lineTo(M + S, M + S);
        ctx.moveTo(M, M + 2 * S);
        ctx.lineTo(M + S, M + 2 * S);
        ctx.moveTo(M, M + 3 * S);
        ctx.lineTo(M + S, M + 3 * S);
        ctx.moveTo(M + 3 * S, M + S);
        ctx.lineTo(M + 4 * S, M + S);
        ctx.moveTo(M + 3 * S, M + 2 * S);
        ctx.lineTo(M + 4 * S, M + 2 * S);
        ctx.moveTo(M + 3 * S, M + 3 * S);
        ctx.lineTo(M + 4 * S, M + 3 * S);
        ctx.stroke();

        const cellPos = [
          { c: 1, r: 0 },
          { c: 2, r: 0 },
          { c: 3, r: 0 },
          { c: 3, r: 1 },
          { c: 3, r: 2 },
          { c: 3, r: 3 },
          { c: 2, r: 3 },
          { c: 1, r: 3 },
          { c: 0, r: 3 },
          { c: 0, r: 2 },
          { c: 0, r: 1 },
          { c: 0, r: 0 },
        ];
        if (angles.lagna !== undefined) {
          let lagnaRasi = Math.floor(angles.lagna / 30) % 12;
          let pos = cellPos[lagnaRasi];
          ctx.fillStyle = "rgba(192, 57, 43, 0.05)";
          ctx.fillRect(M + pos.c * S, M + pos.r * S, S, S);
        }

        const pColors = {
          Su: prefs.clock_Su || "#f39c12",
          Mo: prefs.clock_Mo || "#2980b9",
          Ku: prefs.clock_Ku || "#e74c3c",
          Bu: prefs.clock_Bu || "#27ae60",
          Gu: prefs.clock_Gu || "#d35400",
          Sk: prefs.clock_Sk || "#8e44ad",
          Sa: prefs.clock_Sa || "#34495e",
          Ra: prefs.clock_Ra || "#7f8c8d",
          Ke: prefs.clock_Ke || "#95a5a6",
        };
        let planetsToDraw = [];

        if (dMode === "pav") {
          const contributors = [
            { key: "Su", name: "Sun", label: "Su", color: prefs.clock_Su || "#f39c12" },
            { key: "Mo", name: "Moon", label: "Ch", color: prefs.clock_Mo || "#2980b9" },
            { key: "Ku", name: "Mars", label: "Ku", color: prefs.clock_Ku || "#e74c3c" },
            { key: "Bu", name: "Mercury", label: "Bu", color: prefs.clock_Bu || "#27ae60" },
            { key: "Gu", name: "Jupiter", label: "Gu", color: prefs.clock_Gu || "#d35400" },
            { key: "Sk", name: "Venus", label: "Sk", color: prefs.clock_Sk || "#8e44ad" },
            { key: "Sa", name: "Saturn", label: "Sa", color: prefs.clock_Sa || "#34495e" },
            { key: "lagna", name: "Lagna", label: "Lg", color: prefs.clock_Lg || "#c0392b" },
          ];

          contributors.forEach((cData) => {
            let angle;
            if (cData.key === "lagna") {
              angle = angles.lagna;
            } else {
              angle = angles[cData.key]?.angle;
            }
            if (angle === undefined) return;

            let rashi = Math.floor(angle / 30) + 1; // 1-based rashi
            const allowedOffsets = BENEFIC_POSITIONS[pavSubject]?.[cData.name] || [];

            for (let H = 1; H <= 12; H++) {
              const offset = ((H - rashi + 12) % 12) + 1;
              if (allowedOffsets.includes(offset)) {
                const virtualAngle = (H - 1) * 30 + (angle % 30);
                planetsToDraw.push({
                  id: cData.label,
                  color: cData.color,
                  angle: virtualAngle,
                  isR: cData.key !== "lagna" ? angles[cData.key]?.isR : false,
                  isC: cData.key !== "lagna" ? angles[cData.key]?.isC : false,
                  isH: cData.key !== "lagna" ? angles[cData.key]?.isH : false,
                  tooltipSubject: pavSubject,
                  tooltipContributor: cData.label,
                  tooltipRashi: H,
                });
              }
            }
          });
        } else {
          if (angles.lagna !== undefined)
            planetsToDraw.push({
              id: "Lg",
              color: prefs.clock_Lg || "#c0392b",
              angle: angles.lagna,
              isR: false,
              isC: false,
              isH: false,
            });
          Object.keys(pColors).forEach((p) => {
            if (angles[p] !== undefined)
              planetsToDraw.push({
                id: p === "Mo" ? "Ch" : p,
                color: pColors[p],
                angle: angles[p].angle,
                isR: angles[p].isR,
                isC: angles[p].isC,
                isH: angles[p].isH,
                tithiNum: p === "Mo" ? angles[p].tithi_num : undefined,
                paksha: p === "Mo" ? angles[p].paksha : undefined,
              });
          });
        }
        planetsToDraw.sort((a, b) => a.angle - b.angle);

        const B = [
          { x: 1.0, y: 0.5 },
          { x: 2.0, y: 0.5 },
          { x: 3.0, y: 0.5 },
          { x: 3.5, y: 1.0 },
          { x: 3.5, y: 2.0 },
          { x: 3.5, y: 3.0 },
          { x: 3.0, y: 3.5 },
          { x: 2.0, y: 3.5 },
          { x: 1.0, y: 3.5 },
          { x: 0.5, y: 3.0 },
          { x: 0.5, y: 2.0 },
          { x: 0.5, y: 1.0 },
          { x: 1.0, y: 0.5 },
        ];
        const C = [
          { x: 1.5, y: 0.5 },
          { x: 2.5, y: 0.5 },
          { x: 3.5, y: 0.5 },
          { x: 3.5, y: 1.5 },
          { x: 3.5, y: 2.5 },
          { x: 3.5, y: 3.5 },
          { x: 2.5, y: 3.5 },
          { x: 1.5, y: 3.5 },
          { x: 0.5, y: 3.5 },
          { x: 0.5, y: 2.5 },
          { x: 0.5, y: 1.5 },
          { x: 0.5, y: 0.5 },
        ];
        const staggerOffsets = dMode === "pav" ? [0, 22, -22, 42, -42, 60, -60, 75] : [0, 28, -28, 56];
        const maxLevels = staggerOffsets.length;
        let lastAngles = Array(maxLevels).fill(-999);

        planetsToDraw.forEach((p) => {
          let level = 0;
          while (level < maxLevels) {
            let diff = 999;
            if (lastAngles[level] !== -999) {
              diff = Math.abs(p.angle - lastAngles[level]);
              if (diff > 180) diff = 360 - diff;
            }
            if (diff > 7.5) break;
            level++;
          }
          if (level >= maxLevels) level = maxLevels - 1;
          lastAngles[level] = p.angle;

          let rasiIdx = Math.floor(p.angle / 30) % 12;
          let f = (p.angle % 30) / 30.0;
          let p0 = B[rasiIdx],
            p1 = C[rasiIdx],
            p2 = B[rasiIdx + 1];
          let baseX =
            Math.pow(1 - f, 2) * p0.x +
            2 * (1 - f) * f * p1.x +
            Math.pow(f, 2) * p2.x;
          let baseY =
            Math.pow(1 - f, 2) * p0.y +
            2 * (1 - f) * f * p1.y +
            Math.pow(f, 2) * p2.y;
          let tx = 2 * (1 - f) * (p1.x - p0.x) + 2 * f * (p2.x - p1.x),
            ty = 2 * (1 - f) * (p1.y - p0.y) + 2 * f * (p2.y - p1.y);
          let len = Math.sqrt(tx * tx + ty * ty);
          let norm = len === 0 ? { x: 0, y: 1 } : { x: -ty / len, y: tx / len };
          let offset = staggerOffsets[level];
          let pt = {
            x: M + baseX * S + norm.x * offset,
            y: M + baseY * S + norm.y * offset,
          };

          let radius = 18;
          if (p.isH) {
            ctx.shadowColor = "#f1c40f";
            ctx.shadowBlur = 15;
          } else if (p.isR) {
            ctx.shadowColor = "#3498db";
            ctx.shadowBlur = 12;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = prefs.clock_canvas_bg || "white";
          ctx.fill();
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = p.color;
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = p.color;
          if (dMode === "pav") {
            ctx.font = `bold ${radius - 2}px Arial`;
            ctx.fillText(tr(p.id, p.id), pt.x, pt.y);
          } else {
            const relDeg = Math.floor((((p.angle % 360) + 360) % 360) % 30);
            ctx.font = `bold ${radius - 4}px Arial`;
            ctx.fillText(tr(p.id, p.id), pt.x, pt.y - 3);
            ctx.font = `bold ${radius - 8}px Arial`;
            ctx.fillText(relDeg + "°", pt.x, pt.y + 7);
          }

          if (p.isR) {
            let bx = pt.x + radius + 1,
              by = pt.y - radius + 2;
            ctx.beginPath();
            ctx.arc(bx, by, radius * 0.45, 0, 2 * Math.PI);
            ctx.fillStyle = "#2980b9";
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = `bold ${radius * 0.6}px Arial`;
            ctx.fillText("R", bx, by + 1);
          }
          if (p.isC) {
            let bx = pt.x + radius + 1,
              by = pt.y + radius - 2;
            ctx.beginPath();
            ctx.arc(bx, by, radius * 0.45, 0, 2 * Math.PI);
            ctx.fillStyle = "#c0392b";
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = `bold ${radius * 0.6}px Arial`;
            ctx.fillText("c", bx, by + 1);
          }
          if (p.isH) {
            let bx = pt.x - radius - 1,
              by = pt.y - radius + 2;
            ctx.beginPath();
            ctx.arc(bx, by, radius * 0.45, 0, 2 * Math.PI);
            ctx.fillStyle = "#f1c40f";
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = `bold ${radius * 0.6}px Arial`;
            ctx.fillText("H", bx, by + 1);
          }

          let tooltipStr = null;
          if (dMode === "pav" && p.tooltipSubject) {
            let contributorName = tr(p.id, p.id);
            let subjectName = tr(p.tooltipSubject, p.tooltipSubject);
            let rashiName = tr(RASI_NAMES[p.tooltipRashi - 1], RASI_NAMES[p.tooltipRashi - 1]);
            tooltipStr = tr("pav_tooltip_format", "${contributor} contributes 1 point to ${subject} in ${rashi}")
              .replace("${contributor}", contributorName)
              .replace("${subject}", subjectName)
              .replace("${rashi}", rashiName);
          }

          hitboxesRef.current.push({
            id: p.id,
            x: pt.x,
            y: pt.y,
            r: radius + 5,
            angle: p.angle,
            isR: p.isR,
            isC: p.isC,
            isH: p.isH,
            tithiNum: p.tithiNum,
            paksha: p.paksha,
            tooltip: tooltipStr,
          });
        });

        if (dMode === "pav") {
          for (let rasiIdx = 0; rasiIdx < 12; rasiIdx++) {
            const pos = cellPos[rasiIdx];
            const cellX = M + pos.c * S;
            const cellY = M + pos.r * S;
            const count = planetsToDraw.filter(
              (p) => Math.floor(p.angle / 30) % 12 === rasiIdx
            ).length;
            ctx.fillStyle = count >= 4 ? "#27ae60" : "#7f8c8d";
            ctx.font = "bold 22px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            ctx.fillText(count.toString(), cellX + S - 12, cellY + 10);
          }
        }
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 6;
      let textElements = [];
      let clkElems = prefs.clock_visible_elements || ["time_date", "brand"];
      if (dMode === "pav") {
        let subjectName = tr(pavSubject, pavSubject);
        textElements.push({
          type: "pavTitle",
          val: tr("pav_center_title", "${subject} PAV").replace("${subject}", subjectName).replace("{{subject}}", subjectName)
        });
      }
      if (clkElems.includes("time_date")) {
        textElements.push({ type: "time", val: timeStr });
        textElements.push({ type: "date", val: dateStr });
      }
      if (isCountdownActiveRef.current && countdownTargetRef.current) {
        let diff = countdownTargetRef.current - Date.now();
        if (diff > 0) {
          let hrs = Math.floor(diff / 3600000),
            mins = Math.floor((diff % 3600000) / 60000),
            secs = Math.floor((diff % 60000) / 1000);
          textElements.push({
            type: "cdLabel",
            val: countdownLabelRef.current,
          });
          textElements.push({
            type: "cdTime",
            val:
              hrs > 0
                ? `-${pad(hrs)}:${pad(mins)}:${pad(secs)}`
                : `-${pad(mins)}:${pad(secs)}`,
          });
        } else {
          isCountdownActiveRef.current = false;
        }
      }
      if (clkElems.includes("brand")) {
        textElements.push({
          type: "brandName",
          val: prefs.clock_brand_name || "Vaiswanara",
        });
        textElements.push({
          type: "brandTag",
          val: prefs.clock_brand_tag || "e-Jyotisha",
        });
      }

      let totalHeight = textElements.reduce((sum, item) => {
        if (item.type === "muhurtha") return sum + 30;
        if (item.type === "time") return sum + 28;
        if (item.type === "date") return sum + 22;
        if (item.type === "cdLabel") return sum + 20;
        if (item.type === "cdTime") return sum + 40;
        if (item.type === "brandName") return sum + 26;
        if (item.type === "brandTag") return sum + 20;
        if (item.type === "pavTitle") return sum + 28;
        return sum;
      }, 0);
      let currentY = cy - totalHeight / 2 + 10;

      textElements.forEach((item) => {
        if (item.type === "time") {
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = prefs.clock_text_time || "#8e44ad";
          ctx.fillText(item.val, cx, currentY);
          ctx.fillText(item.val, cx, currentY);
          currentY += 28;
        } else if (item.type === "date") {
          ctx.font = "bold 14px Arial";
          ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
          ctx.fillText(item.val, cx, currentY);
          currentY += 22;
        } else if (item.type === "brandName") {
          ctx.font = "bold 20px Arial";
          ctx.fillStyle = prefs.clock_text_brand || "#c0392b";
          ctx.fillText(item.val, cx, currentY);
          ctx.fillText(item.val, cx, currentY);
          currentY += 26;
        } else if (item.type === "brandTag") {
          ctx.font = "bold 13px Arial";
          ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
          ctx.fillText(item.val, cx, currentY);
          currentY += 20;
        } else if (item.type === "cdLabel") {
          ctx.font = "bold 14px Arial";
          ctx.fillStyle = prefs.clock_text_date || "#7f8c8d";
          ctx.fillText(item.val, cx, currentY);
          currentY += 20;
        } else if (item.type === "cdTime") {
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = prefs.clock_present_timer || "#e74c3c";
          ctx.fillText(item.val, cx, currentY);
          ctx.fillText(item.val, cx, currentY);
          currentY += 40;
        } else if (item.type === "pavTitle") {
          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "#e67e22";
          ctx.fillText(item.val, cx, currentY);
          currentY += 28;
        }
      });
      ctx.shadowBlur = 0;
    }

    // --- Tooltip Logic ---
    let hovered = null;
    for (let p of hitboxesRef.current) {
      let dx = mousePosRef.current.x - p.x;
      let dy = mousePosRef.current.y - p.y;
      if (dx * dx + dy * dy <= p.r * p.r) {
        hovered = p;
        break;
      }
    }
    let isCenterHovered = false;
    if (dMode === "clock") {
      isCenterHovered =
        (mousePosRef.current.x - cx) * (mousePosRef.current.x - cx) +
        (mousePosRef.current.y - cy) * (mousePosRef.current.y - cy) <=
        900;
    } else {
      const M = 15,
        S = (canvas.width - 2 * M) / 4;
      isCenterHovered =
        mousePosRef.current.x > M + S &&
        mousePosRef.current.x < M + 3 * S &&
        mousePosRef.current.y > M + S &&
        mousePosRef.current.y < M + 3 * S;
    }

    if (hovered) {
      canvas.style.cursor = "pointer";
      let txt = hovered.tooltip
        ? hovered.tooltip
        : getTooltipText(
          hovered.id,
          hovered.angle,
          hovered.isR,
          hovered.isC,
          hovered.isH,
          hovered.tithiNum,
          hovered.paksha,
        );
      ctx.save();
      ctx.font = "bold 13px Arial";
      let w = ctx.measureText(txt).width + 20;
      let h = 28;
      let tx = mousePosRef.current.x + 15,
        ty = mousePosRef.current.y + 15;
      if (tx + w > canvas.width) tx = mousePosRef.current.x - w - 10;
      if (ty + h > canvas.height) ty = mousePosRef.current.y - h - 10;
      ctx.fillStyle = "rgba(44, 62, 80, 0.9)";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(tx, ty, w, h, 6);
      else ctx.rect(tx, ty, w, h);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(txt, tx + 10, ty + h / 2);
      ctx.restore();
    } else if (isCenterHovered) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "default";
    }
  }, [displayMode, chartStyle, pavSubject]); // Include dependencies that affect drawing structure

  // --- Animation Loop ---
  useEffect(() => {
    let animationId;
    const animate = () => {
      if (currentAnglesRef.current && targetAnglesRef.current) {
        const c = currentAnglesRef.current;
        const tTarget = targetAnglesRef.current;
        const pKeys = ["Su", "Mo", "Ku", "Bu", "Gu", "Sk", "Sa", "Ra", "Ke"];

        const lerpAngle = (a, b, t) => {
          let diff = (b - a) % 360;
          if (diff < -180) diff += 360;
          if (diff > 180) diff -= 360;
          let res = a + diff * t;
          return ((res % 360) + 360) % 360;
        };

        pKeys.forEach((k) => {
          if (c[k] !== undefined && tTarget[k] !== undefined) {
            c[k].angle = lerpAngle(c[k].angle, tTarget[k].angle, 0.12);
            c[k].isR = tTarget[k].isR;
            c[k].isC = tTarget[k].isC;
            c[k].isH = tTarget[k].isH;
            if (k === "Mo") {
              c[k].tithi_num = tTarget[k].tithi_num;
              c[k].paksha = tTarget[k].paksha;
            }
          }
        });
        ["lagna", "nav_lagna"].forEach((k) => {
          if (c[k] !== undefined && tTarget[k] !== undefined)
            c[k] = lerpAngle(c[k], tTarget[k], 0.12);
        });
        if (tTarget.sunrise !== undefined) c.sunrise = tTarget.sunrise;

        drawClock();
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [drawClock]);

  // --- Event Handlers ---
  const handleFullscreenChange = useCallback(() => {
    const isFull = !!(
      document.fullscreenElement || document.webkitFullscreenElement
    );
    setIsFullscreen(isFull);
    setTimeout(() => {
      if (isFull) {
        let targetSize = Math.min(window.innerWidth, window.innerHeight) * 0.95;
        setClockZoom(targetSize / baseClockSize);
      } else {
        setClockZoom(prefsRef.current.clock_zoom || 1.0);
      }
    }, 100);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [handleFullscreenChange]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const cx = canvas.width / 2,
      cy = canvas.height / 2;

    let isCenter = false;
    if (displayMode === "clock") {
      isCenter =
        (clickX - cx) * (clickX - cx) + (clickY - cy) * (clickY - cy) <= 900;
    } else {
      const M = 15,
        S = (canvas.width - 2 * M) / 4;
      isCenter =
        clickX > M + S &&
        clickX < M + 3 * S &&
        clickY > M + S &&
        clickY < M + 3 * S;
    }

    if (isCenter) {
      const isFull = !!(
        document.fullscreenElement || document.webkitFullscreenElement
      );
      if (!isFull) {
        const elem = fullscreenContainerRef.current;
        if (elem?.requestFullscreen) {
          elem.requestFullscreen().catch(console.log);
        } else if (elem?.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          const p = document.exitFullscreen();
          if (p) p.catch(console.log);
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const adjustTime = (offsetMs) => {
    if (fixedTimeMsRef.current === null) {
      fixedTimeMsRef.current = Date.now() + offsetMs;
    } else {
      fixedTimeMsRef.current += offsetMs;
    }
    setIsTimeTravel(true);

    // Update Custom Date UI Match
    const tzOffsetHours = parseFloat(locRef.current.tz || 5.5);
    const locDate = new Date(fixedTimeMsRef.current + tzOffsetHours * 3600000);
    const pad = (n) => n.toString().padStart(2, "0");
    if (customDateRef.current) {
      customDateRef.current.value = `${locDate.getUTCFullYear()}-${pad(locDate.getUTCMonth() + 1)}-${pad(locDate.getUTCDate())}`;
    }
    if (customTimeRef.current) {
      customTimeRef.current.value = `${pad(locDate.getUTCHours())}:${pad(locDate.getUTCMinutes())}:${pad(locDate.getUTCSeconds())}`;
    }

    fetchAngles();
  };

  const jumpToCustomTime = () => {
    const dVal = customDateRef.current?.value;
    const tVal = customTimeRef.current?.value;
    if (!dVal) {
      alert(t("error_invalid_date", "Please select a valid date!"));
      return;
    }
    let tStr = tVal || "00:00:00";
    if (tStr.length === 5) tStr += ":00";

    // Parse date and time components (user-entered time is in the selected location's LOCAL time)
    const [year, month, day] = dVal.split("-").map(Number);
    const [hours, minutes, seconds] = tStr.split(":").map(Number);

    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      isNaN(hours) || isNaN(minutes) || isNaN(seconds)
    ) {
      alert("Invalid Date/Time!");
      return;
    }

    // Treat the input as the location's local time and convert to UTC epoch
    const tzOffsetHours = parseFloat(locRef.current.tz || 5.5);
    // Date.UTC treats args as UTC, so subtracting tz offset gives us the true UTC epoch
    const localAsUTCMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
    const targetEpoch = localAsUTCMs - tzOffsetHours * 3600000;

    fixedTimeMsRef.current = targetEpoch;
    setIsTimeTravel(true);

    fetchAngles();
  };

  const startCountdown = async () => {
    if (!cdDate) {
      alert("Please select a valid date!");
      return;
    }
    let tStr = cdTime || "00:00:00";
    if (tStr.length === 5) tStr += ":00";
    const target = new Date(`${cdDate}T${tStr}`);
    if (isNaN(target.getTime()) || target.getTime() <= Date.now()) {
      alert("Please select a future time!");
      return;
    }
    countdownTargetRef.current = target.getTime();
    countdownLabelRef.current = cdLabel || "Starts In";
    isCountdownActiveRef.current = true;

    if (cdFloatMode) {
      if (!document.pictureInPictureEnabled) {
        alert("Floating mode (PiP) is not supported in your browser.");
      } else {
        if (!pipVideoRef.current) {
          const video = document.createElement("video");
          video.muted = true;
          video.autoplay = true;
          video.style.display = "none";
          document.body.appendChild(video);
          pipVideoRef.current = video;
        }
        try {
          if (document.pictureInPictureElement !== pipVideoRef.current) {
            pipVideoRef.current.srcObject = canvasRef.current.captureStream(30);
            await pipVideoRef.current.play();
            await pipVideoRef.current.requestPictureInPicture();
          }
        } catch (e) {
          console.error("PiP error", e);
        }
      }
    }
  };

  const stopCountdown = () => {
    isCountdownActiveRef.current = false;
    countdownTargetRef.current = null;
    if (document.pictureInPictureElement)
      document.exitPictureInPicture().catch(console.log);
  };

  const onCityInput = async (e) => {
    const val = e.target.value;
    setCitySearch(val);
    const match = allCitiesRef.current.find((c) => {
      const label = c.state ? `${c.name}, ${c.state}` : c.name;
      return label === val;
    });
    if (match) {
      locRef.current = {
        lat: parseFloat(match.lat),
        lon: parseFloat(match.lon),
        tz: parseFloat(match.tz || 5.5),
        city: val,
      };
      fetchAngles();
    } else if (val.length >= 3) {
      // Optional: Add Nominatim fallback here if needed.
    }
  };

  const renderTimeModeButtons = (isMobileStyle = false) => {
    return (
      <>
        <button
          onClick={() => {
            fixedTimeMsRef.current = null;
            setIsTimeTravel(false);
            currentAnglesRef.current = null;
            try {
              const settingsLoc = JSON.parse(
                localStorage.getItem("vaiswanara_default_location") || "null"
              );
              if (settingsLoc && settingsLoc.latitude && settingsLoc.longitude) {
                locRef.current = {
                  lat: parseFloat(settingsLoc.latitude),
                  lon: parseFloat(settingsLoc.longitude),
                  tz: parseFloat(settingsLoc.timezone || 5.5),
                  city: settingsLoc.city || "Bengaluru, Karnataka",
                };
              } else {
                locRef.current = {
                  lat: 12.9716,
                  lon: 77.5946,
                  tz: 5.5,
                  city: "Bengaluru, Karnataka",
                };
              }
              setCitySearch(locRef.current.city);
            } catch (e) {
              locRef.current = { lat: 12.9716, lon: 77.5946, tz: 5.5, city: "Bengaluru, Karnataka" };
              setCitySearch("Bengaluru, Karnataka");
            }
            fetchAngles();
          }}
          style={isMobileStyle ? {
            background: !isTimeTravel ? "#27ae60" : "transparent",
            color: !isTimeTravel ? "white" : "#555",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "11px",
            border: "none",
            cursor: "pointer",
            outline: "none",
            fontWeight: "600",
          } : {
            background: !isTimeTravel ? "#27ae60" : "transparent",
            color: !isTimeTravel ? "white" : "#27ae60",
            border: "1px solid #27ae60",
            padding: "6px 14px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.15s ease",
            outline: "none",
          }}
        >
          {isMobileStyle ? t("live", "Live") : t("live_time", "Live Time")}
        </button>
        <button
          onClick={() => {
            const settingsLoc = locRef.current;
            const simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
            const tzOffsetHours = parseFloat(settingsLoc.tz || 5.5);
            const locDate = new Date(simTime + tzOffsetHours * 3600000);
            const pad = (n) => n.toString().padStart(2, "0");
            const dobStr = `${locDate.getUTCFullYear()}-${pad(locDate.getUTCMonth() + 1)}-${pad(locDate.getUTCDate())}`;
            const tobStr = `${pad(locDate.getUTCHours())}:${pad(locDate.getUTCMinutes())}`;

            setCustomModalForm({
              profileName: "",
              dob: dobStr,
              tob: tobStr,
              city: settingsLoc.city,
              latitude: settingsLoc.lat,
              longitude: settingsLoc.lon,
              timezone: settingsLoc.tz,
            });
            setModalCitySearch(settingsLoc.city);
            try {
              const saved = JSON.parse(
                localStorage.getItem("vaiswanara_profiles") || "{}",
              );
              setChartProfilesList(Object.keys(saved));
            } catch (e) {}
            setIsCustomModalOpen(true);
          }}
          style={isMobileStyle ? {
            background: isTimeTravel ? "#2980b9" : "transparent",
            color: isTimeTravel ? "white" : "#555",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "11px",
            border: "none",
            cursor: "pointer",
            outline: "none",
            fontWeight: "600",
          } : {
            background: isTimeTravel ? "#2980b9" : "transparent",
            color: isTimeTravel ? "white" : "#2980b9",
            border: "1px solid #2980b9",
            padding: "6px 14px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.15s ease",
            outline: "none",
          }}
        >
          {isMobileStyle ? t("custom", "Custom") : t("custom_time", "Custom Time")}
        </button>
      </>
    );
  };

  return (
    <main
      className="page eclock-page"
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "none",
        padding: 0,
      }}
    >
      <section
        className="workspace eclock-workspace"
        style={{
          display: "block",
          gridTemplateColumns: "none",
          overflowX: "hidden",
          overflowY: "auto",
          flex: 1,
          padding: "0 24px 90px",
          backgroundColor: isFullscreen
            ? prefsRef.current.clock_present_bg || "#111"
            : "transparent",
        }}
      >
        <style>{`
          .eclock-page {
            background:
              radial-gradient(circle at top left, rgba(249, 211, 112, 0.24), transparent 34%),
              radial-gradient(circle at 82% 8%, rgba(142, 68, 173, 0.14), transparent 30%),
              linear-gradient(135deg, #fffaf0 0%, #f7efe4 46%, #f8f4ec 100%);
          }
          .eclock-header {
            padding: 24px 28px 8px;
            border-bottom: 1px solid rgba(122, 83, 48, 0.12);
            background: linear-gradient(180deg, rgba(255, 253, 248, 0.92), rgba(255, 253, 248, 0.68));
            backdrop-filter: blur(12px);
          }
          .eclock-page .horoscope-header {
            max-width: 1320px;
            margin: 0 auto 14px;
            padding-left: 0;
          }
          .eclock-status-strip {
            max-width: 1320px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .eclock-status-pill,
          .eclock-location-pill {
            display: inline-flex;
            align-items: center;
            min-height: 28px;
            border-radius: 999px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.04em;
          }
          .eclock-status-pill {
            color: #6f2a18;
            background: #fff1d0;
            border: 1px solid rgba(158, 111, 96, 0.22);
          }
          .eclock-location-pill {
            color: #5f5548;
            background: rgba(255, 255, 255, 0.72);
            border: 1px solid rgba(122, 83, 48, 0.14);
            text-transform: none;
            letter-spacing: 0;
          }
          .eclock-zoom-toolbar {
            margin-left: auto;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px;
            border: 1px solid rgba(122, 83, 48, 0.16);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 10px 24px rgba(63, 43, 24, 0.08);
          }
          .eclock-zoom-toolbar button {
            min-width: 30px;
            height: 28px;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: #6f2a18;
            cursor: pointer;
            font-size: 15px;
            font-weight: 800;
          }
          .eclock-zoom-toolbar .eclock-zoom-reset {
            min-width: 48px;
            color: #2c3e50;
            font-size: 12px;
            background: #fff1d0;
          }
          .clock-main-layout {
            display: grid;
            grid-template-columns: minmax(420px, 1fr) minmax(320px, 400px);
            gap: 24px;
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
            align-items: flex-start;
          }
          .clock-left-panel {
            width: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            order: 2;
          }
          .clock-right-panel {
            order: 1;
            min-width: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: sticky;
            top: 18px;
            padding: 22px;
            border: 1px solid rgba(122, 83, 48, 0.12);
            border-radius: 18px;
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(255, 249, 238, 0.74));
            box-shadow: 0 24px 70px rgba(91, 53, 24, 0.12);
            backdrop-filter: blur(10px);
          }
          .eclock-page .box-white {
            background: rgba(255, 255, 255, 0.88) !important;
            border: 1px solid rgba(122, 83, 48, 0.12);
            border-top-width: 4px !important;
            border-radius: 12px !important;
            box-shadow: 0 14px 36px rgba(63, 43, 24, 0.08) !important;
            overflow: hidden;
          }
          .eclock-page summary,
          .eclock-page .box-white > div:first-child {
            letter-spacing: 0.01em;
          }
          .eclock-page input {
            box-sizing: border-box;
            background: rgba(255, 253, 248, 0.9);
          }
          .eclock-page button {
            transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
          }
          .eclock-page button:hover {
            transform: translateY(-1px);
          }
          .eclock-mobile-mode-switch-header {
            display: none !important;
          }
          @media (max-width: 900px) {
            .eclock-mobile-mode-switch-header {
              display: flex !important;
              align-items: center;
              gap: 6px;
            }
            .eclock-header {
              padding: 16px 14px 0;
            }
            .eclock-page .horoscope-header {
              margin-bottom: 0;
            }
            .eclock-workspace {
              padding: calc(env(safe-area-inset-top, 0px) + 20px) 10px calc(90px + env(safe-area-inset-bottom, 0px)) 10px !important;
            }
            .eclock-status-strip {
              display: none;
            }
            .clock-main-layout {
              grid-template-columns: 1fr;
              gap: 8px;
            }
            .clock-left-panel {
              width: 100%;
              order: 2;
            }
            .clock-left-panel > * {
              order: 3;
            }
            .eclock-time-machine-panel {
              order: 1;
              padding: 8px !important;
            }
            .eclock-panchanga-panel {
              order: 2;
            }
            .eclock-time-machine-panel summary {
              font-size: 13px !important;
              gap: 8px;
            }
            .eclock-time-machine-panel summary > span {
              white-space: nowrap;
            }
            .eclock-time-mode-switch {
              display: flex !important;
              gap: 4px;
              min-width: 0;
            }
            .eclock-time-mode-switch button,
            .eclock-mobile-mode-switch-header button {
              width: auto !important;
              min-width: 0 !important;
              min-height: 0 !important;
              padding: 4px 7px !important;
              font-size: 10px !important;
              line-height: 1.1 !important;
            }
            .eclock-time-status {
              display: none !important;
            }
            .eclock-time-nav-row {
              gap: 3px !important;
              margin: 5px 0 !important;
            }
            .eclock-time-nav-row button {
              min-width: 34px !important;
              padding: 6px 2px !important;
              font-size: 11px !important;
              line-height: 1 !important;
            }
            .eclock-time-live-row {
              margin: 3px 0 !important;
            }
            .eclock-time-download {
              display: none !important;
            }
            .clock-right-panel {
              order: -1;
              position: static;
              width: 100%;
              margin-bottom: 0;
              padding: 0;
              border: 0;
              border-radius: 0;
              background: transparent;
              box-shadow: none;
              backdrop-filter: none;
            }
            .clock-right-panel canvas {
              width: min(calc(100vw - 20px), calc(100dvh - 220px)) !important;
              max-width: min(calc(100vw - 20px), calc(100dvh - 220px)) !important;
              border: 0 !important;
              box-shadow: none !important;
            }
          }
          
          .eclock-page .popup-container {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 10000;
            display: flex; justify-content: center; align-items: flex-start;
            padding: 20px; backdrop-filter: blur(4px);
            overflow-y: auto;
          }
          .eclock-page .popup-content {
            background: #fff; padding: 30px; border-radius: 16px;
            width: 100%; max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin: 40px auto;
            box-sizing: border-box;
          }
          @media (max-width: 768px) {
            .eclock-page .popup-container { padding: 15px; }
            .eclock-page .popup-content { padding: 20px; max-width: 100%; margin: 20px auto; }
          }
        `}</style>
        <div className="clock-main-layout">
          {/* Left Panel Controls */}
          {!isFullscreen && (
            <div className="clock-left-panel">
              {/* Time Machine */}
              {prefsRef.current.clock_visible_panels?.includes(
                "time_machine",
              ) && (
                  <details
                    className="box-white eclock-time-machine-panel"
                    open
                    style={{
                      padding: "15px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      borderTop: "4px solid #f39c12",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#2c3e50",
                        fontSize: "16px",
                        outline: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        listStyle: "none",
                      }}
                    >
                      <span>{t("time_machine_expand", "Time Machine")}</span>
                      <div
                        className="eclock-mobile-mode-switch-header"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          gap: "4px",
                          background: "#e8e8e8",
                          borderRadius: "14px",
                          padding: "2px",
                        }}
                      >
                        {renderTimeModeButtons(true)}
                      </div>
                      <div
                        className="eclock-time-mode-switch"
                        style={{
                          display: "flex",
                          gap: "4px",
                          background: "#e8e8e8",
                          borderRadius: "14px",
                          padding: "2px",
                        }}
                        onClick={(e) => e.preventDefault()}
                      >

                        <button
                          onClick={() => setDisplayMode("clock")}
                          style={{
                            background:
                              displayMode === "clock" ? "#e67e22" : "transparent",
                            color: displayMode === "clock" ? "white" : "#555",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {t("clock", "Clock")}
                        </button>
                        <button
                          onClick={() => setDisplayMode("chart")}
                          style={{
                            background:
                              displayMode === "chart" ? "#e67e22" : "transparent",
                            color: displayMode === "chart" ? "white" : "#555",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {t("chart", "Chart")}
                        </button>
                        <button
                          onClick={() => setDisplayMode("pav")}
                          style={{
                            background:
                              displayMode === "pav" ? "#e67e22" : "transparent",
                            color: displayMode === "pav" ? "white" : "#555",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {t("PAV", "PAV")}
                        </button>
                      </div>
                    </summary>
                    {isOfflineFallback && (
                      <div style={{ textAlign: "center", marginBottom: "8px" }}>
                        <span style={{ color: "#c0392b", fontSize: "11px", fontWeight: "bold", padding: "2px 8px", background: "#fdedec", border: "1px solid #e74c3c", borderRadius: "10px" }}>
                          {t("ephemeris_offline", "EPHEMERIS OFFLINE")}
                        </span>
                      </div>
                    )}
                    <div
                      className="eclock-time-status"
                      style={{
                        marginTop: "10px",
                        marginBottom: "15px",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {renderTimeModeButtons(false)}
                    </div>
                    <div
                      className="eclock-time-nav-row"
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <button
                        onClick={() => adjustTime(-60000)}
                        style={{
                          background: "#e67e22",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1M
                      </button>
                      <button
                        onClick={() => adjustTime(-3600000)}
                        style={{
                          background: "#d35400",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1H
                      </button>
                      <button
                        onClick={() => adjustTime(-86400000)}
                        style={{
                          background: "#e74c3c",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1D
                      </button>
                      <button
                        onClick={() => adjustTime(-604800000)}
                        style={{
                          background: "#c0392b",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1W
                      </button>
                      <button
                        onClick={() => adjustTime(-2592000000)}
                        style={{
                          background: "#9b59b6",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1Mo
                      </button>
                      <button
                        onClick={() => adjustTime(-31536000000)}
                        style={{
                          background: "#8e44ad",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        -1Y
                      </button>
                    </div>
                    <div
                      className="eclock-time-live-row"
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "7px 0",
                      }}
                    >
                      <span
                        style={{
                          width: "42px",
                          height: "2px",
                          borderRadius: "999px",
                          background: "rgba(122, 83, 48, 0.22)",
                        }}
                      />
                    </div>
                    <div
                      className="eclock-time-nav-row"
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginTop: "5px",
                      }}
                    >
                      <button
                        onClick={() => adjustTime(60000)}
                        style={{
                          background: "#e67e22",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1M
                      </button>
                      <button
                        onClick={() => adjustTime(3600000)}
                        style={{
                          background: "#d35400",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1H
                      </button>
                      <button
                        onClick={() => adjustTime(86400000)}
                        style={{
                          background: "#e74c3c",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1D
                      </button>
                      <button
                        onClick={() => adjustTime(604800000)}
                        style={{
                          background: "#c0392b",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1W
                      </button>
                      <button
                        onClick={() => adjustTime(2592000000)}
                        style={{
                          background: "#9b59b6",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1Mo
                      </button>
                      <button
                        onClick={() => adjustTime(31536000000)}
                        style={{
                          background: "#8e44ad",
                          color: "white",
                          flex: 1,
                          minWidth: "35px",
                          padding: "8px 2px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +1Y
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        const simTime = fixedTimeMsRef.current !== null ? fixedTimeMsRef.current : Date.now();
                        const simDate = new Date(simTime);
                        const pad = (n) => n.toString().padStart(2, "0");
                        const timestamp = `${simDate.getFullYear()}${pad(simDate.getMonth() + 1)}${pad(simDate.getDate())}_${pad(simDate.getHours())}${pad(simDate.getMinutes())}`;
                        link.download = `AstroClock_${timestamp}.png`;
                        link.href = canvasRef.current.toDataURL("image/png", 1.0);
                        link.click();
                      }}
                      className="eclock-time-download"
                      style={{
                        marginTop: "15px",
                        width: "100%",
                        background: "#2980b9",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {t("download_clock_image", "Download Clock Image")}
                    </button>
                  </details>
                )}

              {/* Panchanga Panel */}
              {prefsRef.current.clock_visible_panels?.includes("panchanga") && (
                <details
                  className="box-white eclock-panchanga-panel"
                  open
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    borderTop: "4px solid #2ecc71",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      fontSize: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px dashed #eee",
                      paddingBottom: "10px",
                      marginBottom: "10px",
                      listStyle: "none",
                    }}
                  >
                    <span>{t("panchanga_details", "Panchanga Details")}</span>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          background: "#e8e8e8",
                          borderRadius: "14px",
                          padding: "2px",
                        }}
                      >
                        <button
                          onClick={() => {
                            isGhatiFormatRef.current = false;
                            setIsGhatiUI(false);
                            drawClock();
                          }}
                          style={{
                            background: !isGhatiUI ? "#3498db" : "transparent",
                            color: !isGhatiUI ? "white" : "#555",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {t("standard_time", "Standard")}
                        </button>
                        <button
                          onClick={() => {
                            isGhatiFormatRef.current = true;
                            setIsGhatiUI(true);
                            drawClock();
                          }}
                          style={{
                            background: isGhatiUI ? "#8e44ad" : "transparent",
                            color: isGhatiUI ? "white" : "#555",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {t("vedic_time", "Vedic")}
                        </button>
                      </div>
                    </div>
                  </summary>
                  {currentPanchanga && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "14px",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("tithi", "Tithi")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {currentPanchanga.tithi?.split(" ")[1]
                            ? `${t(currentPanchanga.tithi.split(" ")[0], currentPanchanga.tithi.split(" ")[0])} ${t(currentPanchanga.tithi.split(" ")[1], currentPanchanga.tithi.split(" ")[1])}`
                            : t(currentPanchanga.tithi, currentPanchanga.tithi)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.tithi_end,
                              currentPanchanga.tithi_end_ts,
                              currentPanchanga.tithi_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("vaara_at_sunrise", "Vaara")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(currentPanchanga.vaara, currentPanchanga.vaara)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.vaara_end,
                              currentPanchanga.vaara_end_ts,
                              currentPanchanga.vaara_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("nakshatra", "Nakshatra")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(
                            currentPanchanga.nakshatra,
                            currentPanchanga.nakshatra,
                          )}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.nakshatra_end,
                              currentPanchanga.nakshatra_end_ts,
                              currentPanchanga.nakshatra_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("yoga", "Yoga")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(currentPanchanga.yoga, currentPanchanga.yoga)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.yoga_end,
                              currentPanchanga.yoga_end_ts,
                              currentPanchanga.yoga_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("karana", "Karana")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(currentPanchanga.karana, currentPanchanga.karana)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.karana_end,
                              currentPanchanga.karana_end_ts,
                              currentPanchanga.karana_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("hora", "Hora")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(currentPanchanga.hora, currentPanchanga.hora)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.hora_end,
                              currentPanchanga.hora_end_ts,
                              currentPanchanga.hora_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("lagna", "Lagna")}
                        </strong>
                        <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                          {t(currentPanchanga.lagna, currentPanchanga.lagna)}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.lagna_end,
                              currentPanchanga.lagna_end_ts,
                              currentPanchanga.lagna_rem
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <strong
                          style={{
                            color: "#7f8c8d",
                            fontSize: "12px",
                            display: "block",
                          }}
                        >
                          {t("muhurtha", "Muhurtha")}
                        </strong>
                        <span
                          style={{
                            color: currentPanchanga.muhurtha_is_good
                              ? "#27ae60"
                              : "#c0392b",
                            fontWeight: "bold",
                          }}
                        >
                          {currentPanchanga.muhurtha}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7f8c8d",
                            marginTop: "3px",
                          }}
                        >
                          {t("ends", "Ends")}:{" "}
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            {formatPanchangaTime(
                              currentPanchanga.muhurtha_end,
                              currentPanchanga.muhurtha_end_ts,
                              currentPanchanga.muhurtha_rem
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </details>
              )}




            </div>
          )}

          {/* Canvas Wrapper */}
          <div
            ref={fullscreenContainerRef}
            className={isFullscreen ? "" : "clock-right-panel"}
            style={{
              background: isFullscreen
                ? prefsRef.current.clock_present_bg || "#111"
                : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              ...(isFullscreen
                ? {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 9999,
                }
                : {}),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflowX: "auto",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width="615"
                  height="615"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={() => {
                    mousePosRef.current = { x: -100, y: -100 };
                  }}
                  style={{
                    width:
                      clockZoom > 1.0 ? `${baseClockSize * clockZoom}px` : "100%",
                    maxWidth:
                      clockZoom > 1.0 ? "none" : `min(100%, calc(100vh - 120px))`,
                    height: "auto",
                    aspectRatio: "1 / 1",
                    display: "block",
                    margin: "0 auto",
                    borderRadius: displayMode === "clock" ? "50%" : "12px",
                    boxShadow: isFullscreen
                      ? "none"
                      : "0 5px 25px rgba(142, 68, 173, 0.15)",
                    border: isFullscreen ? "none" : "1px solid #f4ecf7",
                    transition:
                      "width 0.3s ease, max-width 0.3s ease, border-radius 0.3s ease",
                  }}
                />
              </div>
              {displayMode === "pav" && (
                <div
                  className="pav-subject-selector"
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    boxShadow: "none",
                  }}
                >
                  {PAV_SUBJECTS.map((sub) => {
                    const isActive = pavSubject === sub.key;
                    const cColor = SUBJECT_COLORS[sub.label] || "#34495e";
                    return (
                      <button
                        key={sub.key}
                        onClick={() => setPavSubject(sub.key)}
                        style={{
                          background: "transparent",
                          color: isActive ? cColor : (isFullscreen ? "rgba(255, 255, 255, 0.6)" : "#7f8c8d"),
                          border: "none",
                          borderBottom: `3px solid ${isActive ? cColor : "transparent"}`,
                          padding: "6px 4px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = cColor;
                            e.currentTarget.style.borderBottom = `3px solid ${cColor}80`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = isFullscreen ? "rgba(255, 255, 255, 0.6)" : "#7f8c8d";
                            e.currentTarget.style.borderBottom = "3px solid transparent";
                          }
                        }}
                      >
                        {t(sub.translationKey, sub.label)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isCustomModalOpen && (
        <div
          className="popup-container"
          onClick={() => setIsCustomModalOpen(false)}
        >
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                color: "#2c3e50",
                borderBottom: "2px solid #f4f6f7",
                paddingBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>🕒 {t("custom_profile_time", "Custom Profile / Time")}</span>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#95a5a6",
                  padding: "0 5px",
                }}
              >
                &times;
              </button>
            </h3>

            {/* Profile Selection */}
            {chartProfilesList.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#7f8c8d",
                    marginBottom: "6px",
                  }}
                >
                  👤 {t("select_saved_profile", "Select Saved Profile")}
                </label>
                <select
                  value={customModalForm.profileName}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    if (!selectedName) return;
                    try {
                      const saved = JSON.parse(
                        localStorage.getItem("vaiswanara_profiles") || "{}",
                      );
                      const profile = saved[selectedName];
                      if (profile) {
                        setCustomModalForm({
                          profileName: selectedName,
                          dob: profile.dob || "",
                          tob: profile.tob ? profile.tob.substring(0, 5) : "12:00",
                          city: profile.city || "",
                          latitude: profile.latitude || "",
                          longitude: profile.longitude || "",
                          timezone: profile.timezone || "5.5",
                        });
                        setModalCitySearch(profile.city || "");
                      }
                    } catch (err) {
                      console.error("Error loading profile", err);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#fdfefe",
                    fontSize: "14px",
                    color: "#2c3e50",
                    outline: "none",
                  }}
                >
                  <option value="">-- {t("select_profile", "Select Profile")} --</option>
                  {chartProfilesList.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Manual Date & Time Input */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#7f8c8d",
                    marginBottom: "6px",
                  }}
                >
                  📅 {t("birth_date", "Birth Date")}
                </label>
                <input
                  type="date"
                  value={customModalForm.dob}
                  onChange={(e) =>
                    setCustomModalForm((f) => ({ ...f, dob: e.target.value, profileName: "" }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#7f8c8d",
                    marginBottom: "6px",
                  }}
                >
                  ⏰ {t("birth_time", "Birth Time")}
                </label>
                <input
                  type="time"
                  value={customModalForm.tob}
                  onChange={(e) =>
                    setCustomModalForm((f) => ({ ...f, tob: e.target.value, profileName: "" }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Custom Location Autocomplete */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#7f8c8d",
                  marginBottom: "6px",
                }}
              >
                📍 {t("birth_place", "Birth Place")}
              </label>
              <div style={{ position: "relative" }}>
                <LocationAutocomplete
                  city={modalCitySearch}
                  onLocationSelect={(locData) => {
                    setModalCitySearch(locData.city);
                    setCustomModalForm((f) => ({
                      ...f,
                      profileName: "",
                      city: locData.city,
                      latitude: parseFloat(locData.latitude),
                      longitude: parseFloat(locData.longitude),
                      timezone: parseFloat(locData.timezone || 5.5),
                    }));
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                borderTop: "2px solid #f4f6f7",
                paddingTop: "16px",
              }}
            >
              <button
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  color: "#7f8c8d",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                onClick={() => {
                  const { dob, tob, latitude, longitude, timezone, city } = customModalForm;
                  if (!dob || !tob || !latitude || !longitude) {
                    alert("Please fill in Date, Time, and Location!");
                    return;
                  }
                  
                  // Parse target epoch time
                  const [year, month, day] = dob.split("-").map(Number);
                  let tStr = tob;
                  if (tStr.length === 5) tStr += ":00";
                  const [hours, minutes, seconds] = tStr.split(":").map(Number);
                  const tzOffsetHours = parseFloat(timezone || 5.5);
                  
                  // Treat coordinates local time as UTC, subtract tz offset to get epoch Ms
                  const localAsUTCMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
                  const targetEpoch = localAsUTCMs - tzOffsetHours * 3600000;

                  // Set states
                  fixedTimeMsRef.current = targetEpoch;
                  setIsTimeTravel(true);
                  locRef.current = {
                    lat: parseFloat(latitude),
                    lon: parseFloat(longitude),
                    tz: parseFloat(timezone),
                    city: city,
                  };
                  setCitySearch(city);
                  
                  // Reset animation lerping
                  currentAnglesRef.current = null;
                  
                  // Fetch and close
                  fetchAngles();
                  setIsCustomModalOpen(false);
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2980b9",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {t("apply", "Apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
