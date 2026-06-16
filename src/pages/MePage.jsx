import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchBirthChart,
  API_URL,
  API_TOKEN,
  saveUserData
} from "../services/astrologyApi.js";
import Sankalpa from "../components/Sankalpa.jsx";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { getLocalDateStr } from "../utils/formatters.js";


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

export function MePage({ onNavigate }) {
  const { t } = useTranslation();
  const [meProfile, setMeProfile] = useState(null);
  const [transitChart, setTransitChart] = useState(null);
  const [natalChart, setNatalChart] = useState(null);
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
  });

  // Load Profile on Mount
  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("me_page_profile") || "null",
    );
    if (savedProfile) {
      setMeProfile(savedProfile);
    }
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
        const transitCacheKey = `me_transit_v3_${selectedDate}_${selectedTime}_${transitLat}_${transitLon}_${ayanamsha}`;

        let natal = null;
        let transit = null;

        // 1. Try Loading Cached Data First
        try {
          const cachedNatal = JSON.parse(localStorage.getItem(natalCacheKey));
          if (cachedNatal && cachedNatal.planets) {
            natal = cachedNatal;
          }
        } catch (e) {}
        try {
          const cachedTransit = JSON.parse(localStorage.getItem(transitCacheKey));
          if (cachedTransit && cachedTransit.planets && cachedTransit.meta && cachedTransit.meta.sunrise) {
            transit = cachedTransit;
          }
        } catch (e) {}

        // Instantly display cached data if available
        if (natal) setNatalChart(natal);
        if (transit) setTransitChart(transit);

        // 2. Background Revalidation (Parallel for speed)
        const needsNatal = !natal;
        const needsTransit = !transit;

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
                    localStorage.setItem(natalCacheKey, JSON.stringify(res));
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
                    localStorage.setItem(transitCacheKey, JSON.stringify(res));
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
    };

    localStorage.setItem("me_page_profile", JSON.stringify(finalProfile));
    setMeProfile(finalProfile);
    setShowProfilePopup(false);
    setIsProfileMenuOpen(false);
    window.dispatchEvent(new Event("vaiswanara_profile_updated"));

    // Background Sync Data to users_data.json
    try {
      let deviceId = localStorage.getItem("vaiswanara_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID
          ? crypto.randomUUID()
          : "dev-" + Date.now();
        localStorage.setItem("vaiswanara_device_id", deviceId);
      }
      const userInfo = {
        name: finalProfile.name.trim() || t("Me", "My Profile"),
        dob: finalProfile.dob,
        tob: finalProfile.tob,
        city: finalProfile.city,
        deviceId: deviceId,
        timestamp: new Date().toISOString(),
      };

      fetch(`${import.meta.env.BASE_URL}static/preferences.json`)
        .then((r) => r.json())
        .then((prefs) => {
          if (prefs.enable_local_sync !== false) {
                // Direct ga Node JS API కి డేటా పంపుతున్నాం
                saveUserData(userInfo);
          }
        })
        .catch((e) => console.error(e));
    } catch (err) {}
  };

  const handleDeleteProfile = () => {
    if (
      window.confirm(t("confirmDeleteProfile", "Are you sure you want to delete your personal profile?"))
    ) {
      localStorage.removeItem("me_page_profile");
      setMeProfile(null);
      setTodayPanchanga(null);
      setNatalChart(null);
      setTransitChart(null);
      setIsProfileMenuOpen(false);
      window.dispatchEvent(new Event("vaiswanara_profile_updated"));
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
    if (cleanTithi === "Pratipada" || cleanTithi === "Prathama") cleanTithi = "Pratipath";
    
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

    return {
      name: isGood ? t("Guru Balam Present", "Guru Balam Present") : t("No Guru Balam", "No Guru Balam"),
      isGood: isGood,
      desc: t("jupiterInHouse", "Jupiter in House {{house}}", { house: guruDist }),
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

    return {
      name: t(statusKey, statusDefault),
      isGood: isGood,
      desc: t("saturnInHouse", "Saturn in House {{house}}", { house: shaniDist }),
    };
  };

  const tarabalam = getTarabalam();
  const chandraBalam = getChandraBalam();
  const guruBalam = getGuruBalam();
  const shaniBalam = getShaniBalam();

  const cardStyle = (isGood) => {
    let background = "#eafaf1";
    let borderLeftColor = "#27ae60";

    if (isGood === "medium") {
      background = "#fef9e7";
      borderLeftColor = "#f39c12";
    } else if (!isGood) {
      background = "#fdedec";
      borderLeftColor = "#e74c3c";
    }

    return {
      background,
      borderLeft: `5px solid ${borderLeftColor}`,
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      height: "100%",
      boxSizing: "border-box",
    };
  };

  return (
    <main className="page">
      <section
        className="workspace"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
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
                  if (meProfile) {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  } else {
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
                  }
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
                        setEditFormData(meProfile);
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
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#ebf5fb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      ✏️ {t("editProfile", "Edit Profile")}
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
                      🗑️ {t("deleteProfile", "Delete Profile")}
                    </div>
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
            </div>

            {/* Single Line Panchanga Banner */}
            {transitChart && transitChart.panchanga && (
              <>
                <div
                  style={{
                    background: "linear-gradient(135deg, #8e44ad, #3498db)",
                    color: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    fontWeight: "bold",
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(14px, 3vw, 17px)",
                      opacity: 0.95,
                      lineHeight: "1.5",
                    }}
                  >
                    {parseAndLocalizeTithiRealtime(transitChart.panchanga.tithi, transitChart.panchanga.paksha) || t("tithi", "Tithi")} •{" "}
                    {t(normalizeNakshatraForTranslation(transitChart.panchanga.moon_nakshatra || transitChart.planets?.Moon?.nakshatra))}{" "}
                    • {t(transitChart.panchanga.yoga)} • {t(transitChart.panchanga.karana)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.9,
                      marginTop: "4px",
                    }}
                  >
                    🌅 {t("SunriseLabel", "Sunrise")}: {transitChart.meta?.sunrise || "--:--"}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.8,
                      marginTop: "2px",
                      fontStyle: "italic",
                    }}
                  >
                    {t("calculatedAtRealtime", "(Calculated at Realtime)")}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#7f8c8d",
                    textAlign: "center",
                    marginTop: "6px",
                    fontStyle: "italic",
                    maxWidth: "800px",
                    margin: "6px auto 0 auto",
                    width: "100%",
                  }}
                >
                  {t("calculatedForLocation", "Calculated for:")} {defaultLocCity}
                </div>
              </>
            )}

            {/* Balams Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "15px",
                width: "100%",
              }}
            >
              {/* Tarabalam Card */}
              {tarabalam && (
                <div style={cardStyle(tarabalam.isGood)}>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "14px" }}>
                    ⭐ {t("tarabalamCard", "Tarabalam")}
                  </h3>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: tarabalam.isGood ? "#27ae60" : "#c0392b",
                    }}
                  >
                    {tarabalam.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>
                    {tarabalam.desc}
                  </div>
                </div>
              )}

              {/* Chandra Balam Card */}
              {chandraBalam && (
                <div style={cardStyle(chandraBalam.isGood)}>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "14px" }}>
                    🌙 {t("chandraBalamCard", "Chandra Balam")}
                  </h3>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: chandraBalam.isGood ? "#27ae60" : "#c0392b",
                    }}
                  >
                    {chandraBalam.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>
                    {chandraBalam.desc}
                  </div>
                </div>
              )}

              {/* Guru Balam Card */}
              {guruBalam && (
                <div style={cardStyle(guruBalam.isGood)}>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "14px" }}>
                    🟡 {t("guruBalamCard", "Guru Balam")}
                  </h3>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: guruBalam.isGood ? "#27ae60" : "#c0392b",
                    }}
                  >
                    {guruBalam.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>
                    {guruBalam.desc}
                  </div>
                </div>
              )}

              {/* Shani Balam Card */}
              {shaniBalam && (
                <div style={cardStyle(shaniBalam.isGood)}>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "14px" }}>
                    🪐 {t("shaniBalamCard", "Shani Balam")}
                  </h3>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color:
                        shaniBalam.isGood === "medium"
                          ? "#e67e22"
                          : shaniBalam.isGood
                          ? "#27ae60"
                          : "#c0392b",
                    }}
                  >
                    {shaniBalam.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>
                    {shaniBalam.desc}
                  </div>
                </div>
              )}
            </div>

            {/* Nitya Sankalpam Section */}
            <div
              style={{
                marginTop: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%", maxWidth: "1000px" }}>
                {transitChart && <Sankalpa onNavigate={onNavigate} transitChart={transitChart} />}
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
              }}
            >
              {meProfile ? `✏️ ${t("editMyProfile", "Edit My Profile")}` : `👤 ${t("setupMyProfilePopup", "Setup My Profile")}`}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {t("nameOptional", "Name (Optional):")}
                <input
                  type="text"
                  value={editFormData.name}
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
                  }}
                />
              </label>

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
                    value={editFormData.dob}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, dob: e.target.value })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "15px",
                      outline: "none",
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
                    value={editFormData.tob}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, tob: e.target.value })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "15px",
                      outline: "none",
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
                  {t("saveProfile", "Save Profile")}
                </button>
                <button
                  onClick={() => setShowProfilePopup(false)}
                  style={{
                    flex: 1,
                    background: "#e74c3c",
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
                  {t("cancel", "Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
