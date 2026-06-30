import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchBirthChart,
  API_URL,
  API_TOKEN
} from "../services/astrologyApi.js";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { getLocalDateStr } from "../utils/formatters.js";

const formatTimeValue = (val, type = "danger") => {
  if (!val) {
    return (
      <div className="panchanga-value-container">
        <span className={`timing-badge ${type}`}>--:--</span>
      </div>
    );
  }
  const badgeClass = `timing-badge ${type}`;
  if (val.includes(",")) {
    return (
      <div className="panchanga-value-container">
        {val.split(", ").map((part, index) => (
          <span key={index} className={badgeClass}>
            {part}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="panchanga-value-container">
      <span className={badgeClass}>{val}</span>
    </div>
  );
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

const RASHI_NAMES = [
  "",
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karkataka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrischika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
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
const BAD_TARAS = ["Janma", "Vipat", "Pratyak", "Naidhana"];

const normalizeNakshatraForIndex = (name) => {
  if (!name) return "";
  if (name === "Ardra") return "Arudra";
  if (name === "Dhanishtha") return "Dhanishta";
  return name;
};

const normalizeNakshatraForTranslation = (name) => {
  if (!name) return "";
  if (name === "Arudra") return "Ardra";
  if (name === "Dhanishtha") return "Dhanishta";
  return name;
};

const SANSKRIT_VAARAS = {
  te: {
    Sunday: "భాను",
    Monday: "సోమ",
    Tuesday: "మంగళ",
    Wednesday: "బుధ",
    Thursday: "గురు",
    Friday: "శుక్ర",
    Saturday: "శని",
    Ravivara: "భాను",
    Somavara: "సోమ",
    Mangalavara: "మంగళ",
    Budhavara: "బుధ",
    Guruvara: "గురు",
    Shukravara: "శుక్ర",
    Shanivara: "శని",
  },
  kn: {
    Sunday: "ಭಾನು",
    Monday: "ಸೋಮ",
    Tuesday: "ಮಂಗಳ",
    Wednesday: "ಬುಧ",
    Thursday: "ಗುರು",
    Friday: "ಶುಕ್ರ",
    Saturday: "ಶನಿ",
    Ravivara: "ಭಾನು",
    Somavara: "ಸೋಮ",
    Mangalavara: "ಮಂಗಳ",
    Budhavara: "ಬುಧ",
    Guruvara: "ಗುರು",
    Shukravara: "ಶುಕ್ರ",
    Shanivara: "ಶನಿ",
  },
  en: {
    Sunday: "Bhaanu",
    Monday: "Soma",
    Tuesday: "Mangala",
    Wednesday: "Budha",
    Thursday: "Guru",
    Friday: "Shukra",
    Saturday: "Shani",
    Ravivara: "Bhaanu",
    Somavara: "Soma",
    Mangalavara: "Mangala",
    Budhavara: "Budha",
    Guruvara: "Guru",
    Shukravara: "Shukra",
    Shanivara: "Shani",
  },
};

const formatDateStr = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
      console.warn("Storage quota exceeded. Pruning old cached charts...");
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith("me_transit_") || k.startsWith("me_natal_"))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(key, value);
      } catch (retryErr) {
        console.error("Failed to save to localStorage even after pruning:", retryErr);
      }
    } else {
      console.error("Failed to save to localStorage:", e);
    }
  }
};

export function MePage({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const [meProfile, setMeProfile] = useState(null);
  const [transitChart, setTransitChart] = useState(null);
  const [natalChart, setNatalChart] = useState(null);
  const [jupiterTransits, setJupiterTransits] = useState([]);
  const [saturnTransits, setSaturnTransits] = useState([]);
  const [isPanchangaExpanded, setIsPanchangaExpanded] = useState(true);
  const [isTimingsExpanded, setIsTimingsExpanded] = useState(true);
  const [isBalamsExpanded, setIsBalamsExpanded] = useState(true);

  // Fetch transits on mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}static/jupiter_transits.json`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load jupiter transits");
      })
      .then((data) => setJupiterTransits(data))
      .catch((err) => console.error(err));

    fetch(`${import.meta.env.BASE_URL}static/saturn_transits.json`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load saturn transits");
      })
      .then((data) => setSaturnTransits(data))
      .catch((err) => console.error(err));
  }, []);
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

  const handleResetToNow = () => {
    const defLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null"
    );
    const tz = defLoc?.timezone || 5.5;
    setSelectedDate(getLocalDateStr(tz));
    const now = new Date();
    setSelectedTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [defaultLocCity, setDefaultLocCity] = useState("Bengaluru, Karnataka");
  const [editFormData, setEditFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    city: "",
    latitude: "",
    longitude: "",
    timezone: "5.5",
    gender: "male",
  });
  const [popupTab, setPopupTab] = useState("input");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProfiles, setSavedProfiles] = useState({});

  // Load Profile on Mount
  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("me_page_profile") || "null",
    );
    if (savedProfile) {
      setMeProfile(savedProfile);
    }
    const storedProfiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    setSavedProfiles(storedProfiles);
  }, []);

  // Fetch Today's Data and Natal Chart whenever Profile, Selected Date or Time changes
  useEffect(() => {
    if (!meProfile) return;

    const loadDailyData = async () => {
      if (!natalChart || !transitChart) {
        setIsLoading(true);
      }
      try {
        const profile = meProfile;

        // Birth coordinates for Natal Chart
        const natalLat = profile.latitude || 12.9716;
        const natalLon = profile.longitude || 77.5946;
        const natalTz = profile.timezone || 5.5;

        // Default location coordinates for today's Transit Chart
        const defLoc = JSON.parse(
          localStorage.getItem("vaiswanara_default_location") || "null"
        );
        const transitLat = defLoc?.latitude || 12.9716;
        const transitLon = defLoc?.longitude || 77.5946;
        const transitTz = defLoc?.timezone || 5.5;
        const transitCity = defLoc?.city || "Bengaluru, Karnataka, India";

        setDefaultLocCity(transitCity);

        const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
        const ayanamsha = prefs.ayanamsha_val || "lahiri";

        // Cache Keys (SWR pattern for background syncing)
        const natalCacheKey = `me_natal_${profile.dob}_${profile.tob || "12:00"}_${natalLat}_${natalLon}_${ayanamsha}`;
        const transitCacheKey = `me_transit_v5_${selectedDate}_${selectedTime}_${transitLat}_${transitLon}_${ayanamsha}`;

        let natal = null;
        let transit = null;

        // 1. Try Loading Cached Data First
        try {
          const cachedNatal = JSON.parse(localStorage.getItem(natalCacheKey));
          if (cachedNatal && cachedNatal.planets) {
            natal = cachedNatal;
          }
        } catch (e) { }
        try {
          const cachedTransit = JSON.parse(localStorage.getItem(transitCacheKey));
          if (cachedTransit && cachedTransit.planets && cachedTransit.meta && cachedTransit.meta.sunrise) {
            transit = cachedTransit;
          }
        } catch (e) { }

        // Instantly display cached data if available
        if (natal) setNatalChart(natal);
        if (transit) setTransitChart(transit);

        // 2. Background Revalidation (Parallel for speed)
        const needsNatal = !natal;
        const needsTransit = !transit || !transit.panchanga?.gulika_kalam;

        if (needsNatal || needsTransit) {
          setIsSyncing(true);
          try {
            const tasks = [];

            if (needsNatal) {
              tasks.push(
                fetchBirthChart({
                  dob: profile.dob,
                  tob: profile.tob || "12:00",
                  latitude: natalLat,
                  longitude: natalLon,
                  timezone: natalTz,
                  ayanamsha: ayanamsha,
                }).then((res) => {
                  if (res && res.planets) {
                    safeSetLocalStorage(natalCacheKey, JSON.stringify(res));
                    setNatalChart(res);
                  }
                })
              );
            }

            if (needsTransit) {
              tasks.push(
                fetchBirthChart({
                  dob: selectedDate,
                  tob: selectedTime + ":00",
                  latitude: transitLat,
                  longitude: transitLon,
                  timezone: transitTz,
                  ayanamsha: ayanamsha,
                }).then((res) => {
                  if (res && res.planets) {
                    safeSetLocalStorage(transitCacheKey, JSON.stringify(res));
                    setTransitChart(res);
                  }
                })
              );
            }

            if (tasks.length > 0) {
              await Promise.all(tasks);
            }
          } catch (e) {
            console.error("Background sync error:", e);
          } finally {
            setIsSyncing(false);
          }
        }
      } catch (err) {
        console.error("Error loading daily dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyData();
  }, [meProfile, selectedDate, selectedTime]);

  const handleSaveProfile = () => {
    if (!editFormData.name) {
      alert(t("enterNameSaveAlert", "Please enter a name to save the profile."));
      return;
    }
    if (!editFormData.dob || !editFormData.tob) {
      alert(t("fillDobTobAlert", "Please fill in Date of Birth and Time of Birth!"));
      return;
    }

    const finalProfile = {
      ...editFormData,
      latitude: editFormData.latitude || 12.9716,
      longitude: editFormData.longitude || 77.5946,
      timezone: editFormData.timezone || 5.5,
      city: editFormData.city || "Bengaluru, Karnataka, India",
      gender: editFormData.gender || "male",
    };

    const saved = JSON.parse(localStorage.getItem("vaiswanara_profiles") || "{}");
    const updated = {
      ...saved,
      [editFormData.name]: finalProfile,
    };
    localStorage.setItem("vaiswanara_profiles", JSON.stringify(updated));
    setSavedProfiles(updated);
    setPopupTab("profiles");
    alert(t("profileSavedMsg", `Profile "${editFormData.name}" saved!`));
  };

  const handleApplyProfile = () => {
    if (!editFormData.dob || !editFormData.tob) {
      alert(t("fillDobTobAlert", "Please fill in Date of Birth and Time of Birth!"));
      return;
    }

    const finalProfile = {
      ...editFormData,
      latitude: editFormData.latitude || 12.9716,
      longitude: editFormData.longitude || 77.5946,
      timezone: editFormData.timezone || 5.5,
      city: editFormData.city || "Bengaluru, Karnataka, India",
      gender: editFormData.gender || "male",
    };

    localStorage.setItem("me_page_profile", JSON.stringify(finalProfile));
    setMeProfile(finalProfile);
    setShowProfilePopup(false);
    setIsProfileMenuOpen(false);
    window.dispatchEvent(new Event("vaiswanara_profile_updated"));
  };

  const handleDeleteProfile = () => {
    if (
      window.confirm(t("confirmDeleteProfile", "Are you sure you want to delete your personal profile?"))
    ) {
      localStorage.removeItem("me_page_profile");
      setMeProfile(null);
      setNatalChart(null);
      setTransitChart(null);
      setIsProfileMenuOpen(false);
      window.dispatchEvent(new Event("vaiswanara_profile_updated"));
    }
  };

  const handleProfileSelect = (name) => {
    const profile = savedProfiles[name];
    if (profile) {
      setEditFormData({
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

  const handleProfileDelete = (name, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        t("confirmDeleteSavedProfile", `Are you sure you want to delete the profile "${name}"?`)
      )
    ) {
      const updated = { ...savedProfiles };
      delete updated[name];
      setSavedProfiles(updated);
      localStorage.setItem("vaiswanara_profiles", JSON.stringify(updated));
    }
  };

  // --- Calculators ---

  const parseAndLocalizeTithiRealtime = (tithiStr, pakshaStr) => {
    if (!tithiStr) return "";
    let cleanTithi = tithiStr
      .replace("K.", "")
      .replace("S.", "")
      .replace("Shukla ", "")
      .replace("Krishna ", "")
      .trim();
    if (cleanTithi === "Pratipada" || cleanTithi === "Pratipath") cleanTithi = "Prathama";
    if (cleanTithi === "Dwadashi") cleanTithi = "Dvadashi";
    if (cleanTithi === "Shasthi") cleanTithi = "Shashthi";
    if (cleanTithi === "Pournami" || cleanTithi === "Pournima") cleanTithi = "Purnima";
    if (cleanTithi === "Amavasai") cleanTithi = "Amavasya";

    const isKrishna = pakshaStr?.includes("Krishna") || tithiStr.includes("K.");
    const paksha = isKrishna ? "Krishna" : "Shukla";
    return `${t(paksha)}-${t(cleanTithi, cleanTithi)}`;
  };

  const getTarabalam = () => {
    if (!natalChart || !transitChart) return null;
    const natalNakshatra = normalizeNakshatraForIndex(natalChart.planets?.Moon?.nakshatra);
    const todayNakshatra = normalizeNakshatraForIndex(
      transitChart.panchanga?.moon_nakshatra || transitChart.planets?.Moon?.nakshatra
    );
    if (!natalNakshatra || !todayNakshatra) return null;

    const nNakIdx = NAKSHATRAS.indexOf(natalNakshatra);
    const tNakIdx = NAKSHATRAS.indexOf(todayNakshatra);
    if (nNakIdx === -1 || tNakIdx === -1) return null;

    const taraDist = ((tNakIdx - nNakIdx + 27) % 27) + 1;
    const taraName = TARA_NAMES[taraDist % 9];
    const isGood = !BAD_TARAS.includes(taraName);

    return {
      name: t(taraName, taraName),
      isGood,
      desc: `${t(normalizeNakshatraForTranslation(natalChart.planets?.Moon?.nakshatra))} → ${t(normalizeNakshatraForTranslation(transitChart.panchanga?.moon_nakshatra || transitChart.planets?.Moon?.nakshatra))}`,
    };
  };

  const getChandraBalam = () => {
    if (!natalChart || !transitChart) return null;
    const natalMoonRasi = natalChart.planets?.Moon?.rashi;
    const todayMoonRasi = transitChart.planets?.Moon?.rashi;
    if (!natalMoonRasi || !todayMoonRasi) return null;

    const moonDist = ((todayMoonRasi - natalMoonRasi + 12) % 12) + 1;
    const isAshtama = moonDist === 8;

    return {
      name: isAshtama ? t("Ashtama Chandra", "Ashtama Chandra") : t("Shubham", "Shubham"),
      isGood: !isAshtama,
      desc: t("moonInHouse", "Moon in House {{house}}", { house: moonDist }),
    };
  };

  const getGuruBalam = () => {
    if (!natalChart || !transitChart) return null;
    const natalMoonRasi = natalChart.planets?.Moon?.rashi;
    const transitJupiterRasi = transitChart.planets?.Jupiter?.rashi;
    if (!natalMoonRasi || !transitJupiterRasi) return null;

    const guruDist = ((transitJupiterRasi - natalMoonRasi + 12) % 12) + 1;
    const isGood = [2, 5, 7, 9, 11].includes(guruDist);

    let transitInfo = "";
    let nextStableInfo = "";

    const getDurationInDays = (startStr, endStr) => {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    if (jupiterTransits && jupiterTransits.length > 0) {
      const activeRashis = [2, 5, 7, 9, 11].map(
        (h) => ((natalMoonRasi + h - 2) % 12) + 1
      );

      const currentSegment = jupiterTransits.find(
        (t) => selectedDate >= t.start && selectedDate <= t.end
      );

      if (isGood) {
        if (currentSegment) {
          const duration = getDurationInDays(currentSegment.start, currentSegment.end);
          const isTemp = duration < 90;
          const formattedEnd = formatDateStr(currentSegment.end);

          if (isTemp) {
            transitInfo = t("currentTempEnds", { date: formattedEnd });
            const futureTransits = jupiterTransits.filter((t) => t.start > selectedDate);
            const nextStableSegment = futureTransits.find(
              (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) >= 90
            );
            if (nextStableSegment) {
              nextStableInfo = t("nextStableStarts", { date: formatDateStr(nextStableSegment.start) });
            }
          } else {
            transitInfo = t("currentStableEnds", { date: formattedEnd });
          }
        }
      } else {
        const futureTransits = jupiterTransits.filter((t) => t.start > selectedDate);
        const nextStableSegment = futureTransits.find(
          (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) >= 90
        );
        const nextTempSegment = futureTransits.find(
          (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) < 90
        );

        if (nextTempSegment && (!nextStableSegment || nextTempSegment.start < nextStableSegment.start)) {
          const tempDuration = getDurationInDays(nextTempSegment.start, nextTempSegment.end);
          transitInfo = t("nextTempStarts", { date: formatDateStr(nextTempSegment.start), duration: tempDuration });
          if (nextStableSegment) {
            nextStableInfo = t("nextStableStarts", { date: formatDateStr(nextStableSegment.start) });
          }
        } else if (nextStableSegment) {
          transitInfo = t("nextStableStarts", { date: formatDateStr(nextStableSegment.start) });
        }
      }
    }

    return {
      name: isGood ? t("Guru Balam Present", "Guru Balam Present") : t("No Guru Balam", "No Guru Balam"),
      isGood: isGood,
      desc: t("jupiterInHouse", "Jupiter in House {{house}}", { house: guruDist }),
      transitInfo: transitInfo,
      nextStableInfo: nextStableInfo,
    };
  };

  const getShaniBalam = () => {
    if (!natalChart || !transitChart) return null;
    const natalMoonRasi = natalChart.planets?.Moon?.rashi;
    const transitSaturnRasi = transitChart.planets?.Saturn?.rashi;
    if (!natalMoonRasi || !transitSaturnRasi) return null;

    const shaniDist = ((transitSaturnRasi - natalMoonRasi + 12) % 12) + 1;
    let statusKey = "Anukulam";
    let statusDefault = "Anukulam";
    let isGood = true;

    if ([12, 1, 2].includes(shaniDist)) {
      statusKey = "Sade Sati (Elinaati Shani)";
      statusDefault = "Sade Sati (Elinaati Shani)";
      isGood = false;
    } else if (shaniDist === 8) {
      statusKey = "Ashtama Shani";
      statusDefault = "Ashtama Shani";
      isGood = false;
    } else if (shaniDist === 4) {
      statusKey = "Ardhastama Shani";
      statusDefault = "Ardhastama Shani";
      isGood = false;
    } else if ([5, 7, 9, 10].includes(shaniDist)) {
      statusKey = "Madhyamam";
      statusDefault = "Madhyamam";
      isGood = "medium";
    }

    let transitInfo = "";
    let nextStableInfo = "";

    const getDurationInDays = (startStr, endStr) => {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    if (saturnTransits && saturnTransits.length > 0) {
      const activeRashis = [3, 6, 11].map(
        (h) => ((natalMoonRasi + h - 2) % 12) + 1
      );

      const currentSegment = saturnTransits.find(
        (t) => selectedDate >= t.start && selectedDate <= t.end
      );

      const hasShaniBalam = isGood === true;

      if (hasShaniBalam) {
        if (currentSegment) {
          const duration = getDurationInDays(currentSegment.start, currentSegment.end);
          const isTemp = duration < 90;
          const formattedEnd = formatDateStr(currentSegment.end);

          if (isTemp) {
            transitInfo = t("currentTempShaniEnds", { date: formattedEnd });
            const futureTransits = saturnTransits.filter((t) => t.start > selectedDate);
            const nextStableSegment = futureTransits.find(
              (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) >= 90
            );
            if (nextStableSegment) {
              nextStableInfo = t("nextStableShaniStarts", { date: formatDateStr(nextStableSegment.start) });
            }
          } else {
            transitInfo = t("currentStableShaniEnds", { date: formattedEnd });
          }
        }
      } else {
        const futureTransits = saturnTransits.filter((t) => t.start > selectedDate);
        const nextStableSegment = futureTransits.find(
          (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) >= 90
        );
        const nextTempSegment = futureTransits.find(
          (t) => activeRashis.includes(t.rashi) && getDurationInDays(t.start, t.end) < 90
        );

        if (nextTempSegment && (!nextStableSegment || nextTempSegment.start < nextStableSegment.start)) {
          const tempDuration = getDurationInDays(nextTempSegment.start, nextTempSegment.end);
          transitInfo = t("nextTempShaniStarts", { date: formatDateStr(nextTempSegment.start), duration: tempDuration });
          if (nextStableSegment) {
            nextStableInfo = t("nextStableShaniStarts", { date: formatDateStr(nextStableSegment.start) });
          }
        } else if (nextStableSegment) {
          transitInfo = t("nextStableShaniStarts", { date: formatDateStr(nextStableSegment.start) });
        }
      }
    }

    return {
      name: t(statusKey, statusDefault),
      isGood: isGood,
      desc: t("saturnInHouse", "Saturn in House {{house}}", { house: shaniDist }),
      transitInfo: transitInfo,
      nextStableInfo: nextStableInfo,
    };
  };

  const tarabalam = getTarabalam();
  const chandraBalam = getChandraBalam();
  const guruBalam = getGuruBalam();
  const shaniBalam = getShaniBalam();


  return (
    <main className="page">
      <section
        className="workspace"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "0px",
        }}
      >
        {/* Header - Profile Selection */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          {/* Left Side: Name and Nakshatra */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#8e44ad",
                fontSize: "1.5rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {meProfile?.name || t("myDashboard", "My Dashboard")}
            </h2>
            <span
              style={{
                color: "#7f8c8d",
                fontSize: "1rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {natalChart?.planets?.Moon?.nakshatra
                ? `${t(normalizeNakshatraForTranslation(natalChart.planets.Moon.nakshatra))}-${natalChart.planets.Moon.pada}(${t(RASHI_NAMES[natalChart.planets.Moon.rashi])})`
                : t("processingWait", "Loading...")}
            </span>
          </div>

          {/* Right Side: Syncing & Profile Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {isSyncing && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#e67e22",
                  fontWeight: "normal",
                  background: "#fef5e7",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  border: "1px solid #f39c12",
                }}
              >
                🔄 {t("updatingDashboard", "Updating...")}
              </span>
            )}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                style={{
                  background: "#f1f2f6",
                  border: "1px solid #dcdde1",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
                title={t("profileNotSetup", "Profile Menu")}
              >
                👤
              </button>
              {isProfileMenuOpen && (
                <>
                  {/* Click outside to close overlay */}
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 9,
                    }}
                    onClick={() => setIsProfileMenuOpen(false)}
                  />

                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "55px",
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      padding: "10px",
                      zIndex: 10,
                      minWidth: "220px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div
                      onClick={() => {
                        setEditFormData({
                          name: "",
                          dob: "",
                          tob: "",
                          city: "",
                          latitude: "",
                          longitude: "",
                          timezone: "5.5",
                          gender: "male",
                        });
                        setPopupTab("input");
                        setIsProfileMenuOpen(false);
                        setShowProfilePopup(true);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        color: "#2ecc71",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#eafaf1")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      ➕ {t("Add", "Add")}
                    </div>

                    <div
                      onClick={() => {
                        setPopupTab("profiles");
                        setIsProfileMenuOpen(false);
                        setShowProfilePopup(true);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        color: "#9b59b6",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#f5eef8")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      👥 {t("Switch", "Switch")}
                    </div>

                    {meProfile && (
                      <>
                        <div
                          onClick={() => {
                            setEditFormData(meProfile);
                            setPopupTab("input");
                            setIsProfileMenuOpen(false);
                            setShowProfilePopup(true);
                          }}
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            color: "#2980b9",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#ebf5fb")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          ✏️ {t("Edit", "Edit")}
                        </div>

                        <div
                          onClick={handleDeleteProfile}
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            color: "#e74c3c",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#fdedec")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          🗑️ {t("Clear", "Clear")}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {!meProfile ? (
          <div
            className="form-panel"
            style={{ textAlign: "center", padding: "50px 20px" }}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>👤</div>
            <h3 style={{ color: "#e74c3c", margin: "0 0 10px 0" }}>
              {t("profileNotSetup", "Profile Not Setup")}
            </h3>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "15px",
                lineHeight: "1.5",
              }}
            >
              {t("profileSetupDesc", "Create a profile to view your personalized daily astrological details.")}
            </p>
            <p
              style={{
                color: "#95a5a6",
                fontSize: "0.9rem",
                marginBottom: "25px",
                fontStyle: "italic",
                lineHeight: "1.5",
              }}
            >
              {t("profileSetupNote", "Please note: The initial calculations might take a few moments, but subsequent visits will load instantly!")}
            </p>
            <button
              onClick={() => {
                setEditFormData({
                  name: "",
                  dob: "",
                  tob: "",
                  city: "",
                  latitude: "",
                  longitude: "",
                  timezone: "5.5",
                });
                setShowProfilePopup(true);
              }}
              style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ➕ {t("setupMyProfile", "Setup My Profile")}
            </button>
          </div>
        ) : isLoading ? (
          <div className="message">
            {t("calculatingBalams", "Please wait! Calculating Tarabala, Chandrabala, Guru bhala ...")}
          </div>
        ) : (
          <>
            {/* Interactive Date & Time Selection Panel */}
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
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "0.9rem", minWidth: "120px" }}
              />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "0.9rem", minWidth: "90px" }}
              />
              <button
                onClick={handleResetToNow}
                title={t("resetToNow", "Reset to Current Time")}
                style={{
                  width: "37px",
                  height: "37px",
                  border: "none",
                  background: "transparent",
                  color: "#2d3436",
                  fontSize: "1.65rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  padding: 0,
                }}
              >
                🔄
              </button>
            </div>

            {/* Split Panchanga and Timings Cards */}
            {transitChart && transitChart.panchanga && (
              <>
                <div className="panchanga-container-grid">
                  {/* Card 1: Panchanga Card */}
                  <div className="panchanga-info-card" style={{ alignSelf: isPanchangaExpanded ? undefined : "start" }}>
                    <h3
                      onClick={() => setIsPanchangaExpanded(!isPanchangaExpanded)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        userSelect: "none",
                        borderBottom: isPanchangaExpanded ? undefined : "none",
                        paddingBottom: isPanchangaExpanded ? undefined : "0px",
                      }}
                      className="panchanga-card-header"
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        📅 {t("panchangaCardTitle", "Panchanga Details")}
                      </span>
                      <span
                        style={{
                          transform: isPanchangaExpanded ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                          fontSize: "14px",
                        }}
                      >
                        ▲
                      </span>
                    </h3>
                    {isPanchangaExpanded && (
                      <div className="panchanga-list">
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("tithi", "Tithi")}:</span>
                          <span className="panchanga-value">
                            {parseAndLocalizeTithiRealtime(transitChart.panchanga.tithi, transitChart.panchanga.paksha) || t("tithi", "Tithi")}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("vaaramu", "Vaara")}:</span>
                          <span className="panchanga-value">
                            {transitChart.panchanga.vaara || transitChart.panchanga.vara ? ((SANSKRIT_VAARAS[lang] || SANSKRIT_VAARAS.en)[transitChart.panchanga.vaara || transitChart.panchanga.vara] || (transitChart.panchanga.vaara || transitChart.panchanga.vara)) : ""}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("nakshatramu", "Nakshatram")}:</span>
                          <span className="panchanga-value">
                            {t(normalizeNakshatraForTranslation(transitChart.panchanga.moon_nakshatra || transitChart.planets?.Moon?.nakshatra))}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("yogamu", "Yogam")}:</span>
                          <span className="panchanga-value">
                            {t(transitChart.panchanga.yoga)}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("karanamu", "Karanam")}:</span>
                          <span className="panchanga-value">
                            {t(transitChart.panchanga.karana)}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("SunriseLabel", "Sunrise")}:</span>
                          <span className="panchanga-value" style={{ color: "#27ae60" }}>
                            {transitChart.meta?.sunrise || "--:--"}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("SunsetLabel", "Sunset")}:</span>
                          <span className="panchanga-value" style={{ color: "#e67e22" }}>
                            {transitChart.meta?.sunset || "--:--"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 2: Timings Card */}
                  <div className="panchanga-info-card timings" style={{ alignSelf: isTimingsExpanded ? undefined : "start" }}>
                    <h3
                      onClick={() => setIsTimingsExpanded(!isTimingsExpanded)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        userSelect: "none",
                        borderBottom: isTimingsExpanded ? undefined : "none",
                        paddingBottom: isTimingsExpanded ? undefined : "0px",
                      }}
                      className="panchanga-card-header"
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        ⏰ {t("timingsCardTitle", "Inauspicious Times")}
                      </span>
                      <span
                        style={{
                          transform: isTimingsExpanded ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                          fontSize: "14px",
                        }}
                      >
                        ▲
                      </span>
                    </h3>
                    {isTimingsExpanded && (
                      <div className="panchanga-list">
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("rahuKalam", "Rahu Kalam")}:</span>
                          <span className="panchanga-value" style={{ color: "#c0392b" }}>
                            {transitChart.panchanga?.rahu_kalam || "--:--"}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("yamagandam", "Yamagandam")}:</span>
                          <span className="panchanga-value" style={{ color: "#c0392b" }}>
                            {transitChart.panchanga?.yamagandam || "--:--"}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("gulikaKalam", "Gulika Kalam")}:</span>
                          <span className="panchanga-value" style={{ color: "#c0392b" }}>
                            {transitChart.panchanga?.gulika_kalam || "--:--"}
                          </span>
                        </div>
                        <div className="panchanga-item">
                          <span className="panchanga-label">{t("varjyam", "Varjyam")}:</span>
                          <span className="panchanga-value" style={{ color: "#c0392b" }}>
                            {transitChart.panchanga?.varjyam || "--:--"}
                          </span>
                        </div>
                        <div
                          className="panchanga-item"
                          style={
                            transitChart.panchanga?.durmuhurtham &&
                              (transitChart.panchanga.durmuhurtham.includes(",") ||
                                transitChart.panchanga.durmuhurtham.length > 15)
                              ? { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }
                              : undefined
                          }
                        >
                          <span className="panchanga-label">{t("durmuhurtham", "Durmuhurtham")}:</span>
                          <span
                            className="panchanga-value"
                            style={{
                              color: "#c0392b",
                              display: "flex",
                              flexDirection: "column",
                              alignItems:
                                transitChart.panchanga?.durmuhurtham &&
                                  (transitChart.panchanga.durmuhurtham.includes(",") ||
                                    transitChart.panchanga.durmuhurtham.length > 15)
                                  ? "flex-end"
                                  : "initial",
                              gap: "2px",
                            }}
                          >
                            {transitChart.panchanga?.durmuhurtham
                              ? transitChart.panchanga.durmuhurtham.split(/,\s*/).map((item, idx) => (
                                <span key={idx}>{item}</span>
                              ))
                              : "--:--"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Balams & Strengths Card */}
                  <div className="panchanga-info-card" style={{ alignSelf: isBalamsExpanded ? undefined : "start" }}>
                    <h3
                      onClick={() => setIsBalamsExpanded(!isBalamsExpanded)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        userSelect: "none",
                        borderBottom: isBalamsExpanded ? undefined : "none",
                        paddingBottom: isBalamsExpanded ? undefined : "0px",
                      }}
                      className="panchanga-card-header"
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        💪 {t("jyotishaCardTitle", "Strength")}
                      </span>
                      <span
                        style={{
                          transform: isBalamsExpanded ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                          fontSize: "14px",
                        }}
                      >
                        ▲
                      </span>
                    </h3>
                    {isBalamsExpanded && (
                      <div className="panchanga-list">
                        {/* Tarabalam */}
                        {tarabalam && (
                          <div className="panchanga-item" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className="panchanga-label">⭐ {t("tarabalamCard", "Tarabalam")}:</span>
                              <span className="panchanga-value" style={{ color: tarabalam.isGood ? "#27ae60" : "#c0392b" }}>
                                {tarabalam.name}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#7f8c8d", textAlign: "right" }}>
                              {tarabalam.desc}
                            </div>
                          </div>
                        )}

                        {/* Chandra Balam */}
                        {chandraBalam && (
                          <div className="panchanga-item" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className="panchanga-label">🌙 {t("chandraBalamCard", "Chandra Balam")}:</span>
                              <span className="panchanga-value" style={{ color: chandraBalam.isGood ? "#27ae60" : "#c0392b" }}>
                                {chandraBalam.name}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#7f8c8d", textAlign: "right" }}>
                              {chandraBalam.desc}
                            </div>
                          </div>
                        )}

                        {/* Guru Balam */}
                        {guruBalam && (
                          <div className="panchanga-item" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className="panchanga-label">🟡 {t("guruBalamCard", "Guru Balam")}:</span>
                              <span className="panchanga-value" style={{ color: guruBalam.isGood ? "#27ae60" : "#c0392b" }}>
                                {guruBalam.name}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#7f8c8d", textAlign: "right" }}>
                              {guruBalam.desc}
                            </div>
                            {(guruBalam.transitInfo || guruBalam.nextStableInfo) && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end", marginTop: "2px", borderTop: "1px dashed rgba(0, 0, 0, 0.04)", paddingTop: "4px" }}>
                                {guruBalam.transitInfo && (
                                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#8e44ad", textAlign: "right" }}>
                                    {guruBalam.transitInfo}
                                  </div>
                                )}
                                {guruBalam.nextStableInfo && (
                                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#8e44ad", textAlign: "right" }}>
                                    {guruBalam.nextStableInfo}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Shani Balam */}
                        {shaniBalam && (
                          <div className="panchanga-item" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className="panchanga-label">🪐 {t("shaniBalamCard", "Shani Balam")}:</span>
                              <span className="panchanga-value" style={{ color: shaniBalam.isGood === "medium" ? "#e67e22" : shaniBalam.isGood ? "#27ae60" : "#c0392b" }}>
                                {shaniBalam.name}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#7f8c8d", textAlign: "right" }}>
                              {shaniBalam.desc}
                            </div>
                            {(shaniBalam.transitInfo || shaniBalam.nextStableInfo) && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end", marginTop: "2px", borderTop: "1px dashed rgba(0, 0, 0, 0.04)", paddingTop: "4px" }}>
                                {shaniBalam.transitInfo && (
                                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#8e44ad", textAlign: "right" }}>
                                    {shaniBalam.transitInfo}
                                  </div>
                                )}
                                {shaniBalam.nextStableInfo && (
                                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#8e44ad", textAlign: "right" }}>
                                    {shaniBalam.nextStableInfo}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#7f8c8d",
                    textAlign: "center",
                    marginTop: "6px",
                    fontStyle: "italic",
                    maxWidth: "1000px",
                    margin: "6px auto 0 auto",
                    width: "100%",
                  }}
                >
                  {t("calculatedForLocation", "Calculated for:")} {defaultLocCity}
                </div>
              </>
            )}

            {/* Profile Management Quick Guide */}
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#f8f9fa",
                borderLeft: "5px solid #8e44ad",
                borderRadius: "8px",
                fontSize: "14.5px",
                color: "#2c3e50",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                width: "100%",
                boxSizing: "border-box",
                lineHeight: "1.6",
                textAlign: "left",
              }}
            >
              <h3 style={{ margin: "0 0 12px 0", color: "#8e44ad", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                ⚙️ {t("dashboardProfileGuideTitle", "Dashboard Profile Guide")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <strong>➕ {t("Add", "Add")}:</strong> {t("addProfileGuideDesc", "Create and save a new birth chart profile in your browser's local database.")}
                </div>
                <div>
                  <strong>👥 {t("Switch", "Switch")}:</strong> {t("switchProfileGuideDesc", "Switch the dashboard to show details of another saved profile.")}
                </div>
                <div>
                  <strong>✏️ {t("Edit", "Edit")}:</strong> {t("editProfileGuideDesc", "Modify the birth chart details of the current dashboard profile.")}
                </div>
                <div>
                  <strong>🗑️ {t("Clear", "Clear")}:</strong> {t("clearDashboardGuideDesc", "Remove the profile details from the dashboard (your saved profile list remains safe).")}
                </div>
              </div>
              <div style={{ borderTop: "1px dashed #dcdde1", marginTop: "15px", paddingTop: "12px", fontSize: "13px", color: "#7f8c8d", display: "flex", alignItems: "center", gap: "6px" }}>
                💾 <span>{t("exportProfilesGuideNote", "Tip: You can export your saved profiles as a JSON backup or import them from the Settings or Profiles page to ensure you never lose your data.")}</span>
              </div>
            </div>
          </>
        )}
      </section>

      <footer
        className="no-print"
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "13px",
          color: "#7f8c8d",
          marginTop: "auto",
        }}
      >
        <button
          onClick={() => onNavigate("Privacy")}
          style={{
            background: "none",
            border: "none",
            color: "#3498db",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "13px",
            padding: 0,
          }}
        >
          {t("Privacy", "Privacy Policy")}
        </button>
      </footer>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "450px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#8e44ad",
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>✏️ {t("changeProfileDetails", "Change Profile Details")}</span>
              <span
                style={{
                  cursor: "pointer",
                  background: "#f8f9fa",
                  padding: "4px 8px",
                  borderRadius: "50%",
                  fontSize: "14px",
                }}
                onClick={() => setShowProfilePopup(false)}
              >
                ❌
              </span>
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
                style={{
                  padding: "10px 15px",
                  border: "none",
                  background: "none",
                  borderBottom: popupTab === "input" ? "2px solid #8e44ad" : "none",
                  color: popupTab === "input" ? "#8e44ad" : "#7f8c8d",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {t("manualEntry", "Manual Entry")}
              </button>
              <button
                className={`popup-tab ${popupTab === "profiles" ? "active" : ""}`}
                onClick={() => setPopupTab("profiles")}
                style={{
                  padding: "10px 15px",
                  border: "none",
                  background: "none",
                  borderBottom: popupTab === "profiles" ? "2px solid #8e44ad" : "none",
                  color: popupTab === "profiles" ? "#8e44ad" : "#7f8c8d",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {t("savedProfiles", "Saved Profiles")}
              </button>
            </div>

            {popupTab === "input" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 2,
                    }}
                  >
                    {t("name", "Name")}:
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      placeholder={t("yourNamePlaceholder", "Your Name")}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outline: "none",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    {t("gender", "Gender")}:
                    <select
                      value={editFormData.gender || "male"}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, gender: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outline: "none",
                        height: "41px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="male">{t("male", "Male")}</option>
                      <option value="female">{t("female", "Female")}</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    {t("dateOfBirth", "Date of Birth")}:
                    <input
                      type="date"
                      value={editFormData.dob || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, dob: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outline: "none",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                      required
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      flex: 1,
                    }}
                  >
                    {t("timeOfBirth", "Time of Birth")}:
                    <input
                      type="time"
                      value={editFormData.tob || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, tob: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outline: "none",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                      required
                    />
                  </label>
                </div>

                <LocationAutocomplete
                  city={editFormData.city || ""}
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
                    marginTop: "-5px",
                    fontSize: "13px",
                    background: "#f9f9f9",
                    padding: "10px",
                    borderRadius: "6px",
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
                    {t("manualCoordinates", "Manual Coordinates (Lat / Lon / Tz)")}
                  </summary>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <label style={{ flex: 1, fontSize: "0.85rem", color: "#636e72" }}>
                      Lat:
                      <input
                        type="text"
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
                          setEditFormData({ ...editFormData, latitude: e.target.value })
                        }
                      />
                    </label>
                    <label style={{ flex: 1, fontSize: "0.85rem", color: "#636e72" }}>
                      Lon:
                      <input
                        type="text"
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
                          setEditFormData({ ...editFormData, longitude: e.target.value })
                        }
                      />
                    </label>
                    <label style={{ flex: 1, fontSize: "0.85rem", color: "#636e72" }}>
                      Tz:
                      <input
                        type="text"
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
                          setEditFormData({ ...editFormData, timezone: e.target.value })
                        }
                      />
                    </label>
                  </div>
                </details>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "15px",
                    borderTop: "1px solid #eee",
                    paddingTop: "20px",
                  }}
                >
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1,
                      background: "#27ae60",
                      color: "#fff",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {t("saveProfileBtn", "Save Profile")}
                  </button>
                  <button
                    onClick={handleApplyProfile}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #8e44ad, #9b59b6)",
                      color: "#fff",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {t("applyBtn", "Apply")}
                  </button>
                </div>
              </div>
            )}

            {popupTab === "profiles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                <input
                  type="text"
                  placeholder={t("searchProfiles", "Search profiles...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
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
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "5px 0",
                  }}
                >
                  {Object.keys(savedProfiles).filter((name) => {
                    const q = searchQuery.trim().toLowerCase();
                    return q === "" ||
                      name.toLowerCase().includes(q) ||
                      (savedProfiles[name].city || "").toLowerCase().includes(q);
                  }).length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#7f8c8d",
                        padding: "20px 0",
                        fontSize: "14px",
                      }}
                    >
                      {t("noSavedProfilesFound", "No saved profiles found.")}
                    </p>
                  ) : (
                    Object.keys(savedProfiles)
                      .filter((name) => {
                        const q = searchQuery.trim().toLowerCase();
                        return q === "" ||
                          name.toLowerCase().includes(q) ||
                          (savedProfiles[name].city || "").toLowerCase().includes(q);
                      })
                      .map((name) => (
                        <div
                          key={name}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            background: "#fdfefe",
                            boxSizing: "border-box",
                            gap: "10px",
                          }}
                        >
                          <div
                            onClick={() => handleProfileSelect(name)}
                            style={{ flex: 1, cursor: "pointer", textAlign: "left" }}
                          >
                            <strong style={{ color: "#2c3e50", fontSize: "14px", display: "block", marginBottom: "3px" }}>
                              {name}
                            </strong>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#7f8c8d",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                              }}
                            >
                              <span>📅 {savedProfiles[name].dob ? savedProfiles[name].dob.split('-').reverse().join('-') : ''}</span>
                              <span>⏰ {savedProfiles[name].tob || ''}</span>
                              <span>📍 {savedProfiles[name].city ? savedProfiles[name].city.split(',')[0].trim() : ''}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProfileSelect(name);
                              }}
                              title={t("edit", "Edit")}
                              style={{
                                background: "#ebf5fb",
                                border: "1px solid #3498db",
                                color: "#3498db",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                minHeight: "auto",
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => handleProfileDelete(name, e)}
                              title={t("delete", "Delete")}
                              style={{
                                background: "#fdedec",
                                border: "1px solid #e74c3c",
                                color: "#e74c3c",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                minHeight: "auto",
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
