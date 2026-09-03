import { useState, useRef, useEffect } from "react";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { PredictionPanel } from "../components/PredictionPanel.jsx";
import { RashiChart } from "../components/RashiChart.jsx";
import { calculateAshtakuta, NAKSHATRAS } from "../utils/matchCalculator.js";
import { useTranslation } from "react-i18next";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";

function getDefaultLocation() {
  try {
    const savedLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location"),
    );
    if (savedLoc) return savedLoc;
  } catch (e) {}
  return { latitude: "13.13", longitude: "78.8", timezone: "5.5", city: "" };
}

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

export function MatchPage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  const [boyData, setBoyData] = useState(() => ({
    name: t("groom"),
    dob: getTodayDate(),
    tob: getCurrentTime(),
    ...getDefaultLocation(),
  }));
  const [girlData, setGirlData] = useState(() => ({
    name: t("bride"),
    dob: getTodayDate(),
    tob: getCurrentTime(),
    ...getDefaultLocation(),
  }));
  const [matchData, setMatchData] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "" });
  const resultsRef = useRef(null);
  // API కాలింగ్ తగ్గించడానికి Cache Ref
  const cacheRef = useRef({});

  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    type: "boy",
  });
  const [popupTab, setPopupTab] = useState("input");

  const [matchMode, setMatchMode] = useState("birth");
  const [nakPopupOpen, setNakPopupOpen] = useState(false);
  const [nakshatraFormData, setNakshatraFormData] = useState({
    boyNak: "Ashwini",
    boyPada: 1,
    girlNak: "Ashwini",
    girlPada: 1,
  });
  const [editFormData, setEditFormData] = useState({});
  const [profiles, setProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Listen to Voice Assistant Birth Input event for Groom / Bride
  useEffect(() => {
    const handleVoiceBirthInput = (e) => {
      const { target, data } = e.detail || {};
      if (!data) return;

      const isGroomTarget = target === "groom" || (target === "jataka" && popupConfig.isOpen && popupConfig.type === "boy");
      const isBrideTarget = target === "bride" || (target === "jataka" && popupConfig.isOpen && popupConfig.type === "girl");

      if (isGroomTarget || target === "groom") {
        setBoyData((prev) => ({
          ...prev,
          ...(data.dob ? { dob: data.dob } : {}),
          ...(data.tob ? { tob: data.tob } : {}),
          ...(data.city ? { city: data.city } : {}),
          ...(data.latitude ? { latitude: data.latitude } : {}),
          ...(data.longitude ? { longitude: data.longitude } : {}),
          ...(data.timezone ? { timezone: data.timezone } : {}),
        }));
        if (popupConfig.isOpen && popupConfig.type === "boy") {
          setEditFormData((prev) => ({
            ...prev,
            ...(data.dob ? { dob: data.dob } : {}),
            ...(data.tob ? { tob: data.tob } : {}),
            ...(data.city ? { city: data.city } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(data.timezone ? { timezone: data.timezone } : {}),
          }));
        }
      } else if (isBrideTarget || target === "bride") {
        setGirlData((prev) => ({
          ...prev,
          ...(data.dob ? { dob: data.dob } : {}),
          ...(data.tob ? { tob: data.tob } : {}),
          ...(data.city ? { city: data.city } : {}),
          ...(data.latitude ? { latitude: data.latitude } : {}),
          ...(data.longitude ? { longitude: data.longitude } : {}),
          ...(data.timezone ? { timezone: data.timezone } : {}),
        }));
        if (popupConfig.isOpen && popupConfig.type === "girl") {
          setEditFormData((prev) => ({
            ...prev,
            ...(data.dob ? { dob: data.dob } : {}),
            ...(data.tob ? { tob: data.tob } : {}),
            ...(data.city ? { city: data.city } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(data.timezone ? { timezone: data.timezone } : {}),
          }));
        }
      } else if (target === "jataka") {
        // If unspecified on Match page, default to updating groom or currently open popup
        if (popupConfig.isOpen && popupConfig.type === "girl") {
          setGirlData((prev) => ({
            ...prev,
            ...(data.dob ? { dob: data.dob } : {}),
            ...(data.tob ? { tob: data.tob } : {}),
            ...(data.city ? { city: data.city } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(data.timezone ? { timezone: data.timezone } : {}),
          }));
          setEditFormData((prev) => ({
            ...prev,
            ...(data.dob ? { dob: data.dob } : {}),
            ...(data.tob ? { tob: data.tob } : {}),
            ...(data.city ? { city: data.city } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(data.timezone ? { timezone: data.timezone } : {}),
          }));
        } else {
          setBoyData((prev) => ({
            ...prev,
            ...(data.dob ? { dob: data.dob } : {}),
            ...(data.tob ? { tob: data.tob } : {}),
            ...(data.city ? { city: data.city } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(data.timezone ? { timezone: data.timezone } : {}),
          }));
        }
      }
    };

    window.addEventListener("vaiswanara_voice_birth_input", handleVoiceBirthInput);
    return () => {
      window.removeEventListener("vaiswanara_voice_birth_input", handleVoiceBirthInput);
    };
  }, [popupConfig]);

  const handleOpenPopup = (type) => {
    const savedProfiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    setProfiles(savedProfiles);
    setEditFormData(type === "boy" ? boyData : girlData);
    setPopupTab("input");
    setSearchQuery("");
    setPopupConfig({ isOpen: true, type });
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
      });
      setPopupTab("input");
    }
  };

  const handleSavePopup = () => {
    if (popupConfig.type === "boy") setBoyData(editFormData);
    else setGirlData(editFormData);
    setPopupConfig({ isOpen: false, type: "boy" });
  };

  const handleNewDetails = () => {
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
    });
    setPopupTab("input");
  };

  const handleSaveProfile = () => {
    const profileName = editFormData.name?.trim();
    if (
      !profileName ||
      profileName === t("groom") ||
      profileName === t("bride")
    ) {
      return alert("Please enter a specific Name to save this profile.");
    }
    const currentProfiles = { ...profiles };
    currentProfiles[profileName] = {
      ...editFormData,
      gender: popupConfig.type === "boy" ? "male" : "female",
    };
    localStorage.setItem(
      "vaiswanara_profiles",
      JSON.stringify(currentProfiles),
    );
    setProfiles(currentProfiles);
    alert(`Profile "${profileName}" saved successfully!`);
  };

  const locAmsha = (str) => {
    if (!str) return str;
    let translatedAmsha = t("Amsha");
    // Fallback if translation is missing for non-english languages
    if (translatedAmsha === "Amsha" && !i18n.language.startsWith("en")) {
      const lang = i18n.language.split("-")[0];
      if (lang === "te") {
        translatedAmsha = "అంశ";
      } else if (lang === "kn") {
        translatedAmsha = "ಅಂಶ";
      }
    }
    return String(str).replace(/\bAmsha\b/gi, translatedAmsha);
  };

  async function handleGenerateMatch() {
    // ఫామ్ డేటా ఆధారంగా Cache కీ క్రియేట్ చేయడం
    const cacheKey = JSON.stringify({ boyData, girlData });
    if (cacheRef.current[cacheKey]) {
      setMatchData(cacheRef.current[cacheKey]);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return; // క్షణాల్లో రిజల్ట్!
    }

    const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
    const ayanamsha = prefs.ayanamsha_val || "lahiri";

    setStatus({ loading: true, error: "" });

    try {
      const params = new URLSearchParams({
        endpoint: "match",
        boy_dob: boyData.dob,
        boy_tob: boyData.tob,
        boy_latitude: boyData.latitude,
        boy_longitude: boyData.longitude,
        boy_timezone: boyData.timezone,
        girl_dob: girlData.dob,
        girl_tob: girlData.tob,
        girl_latitude: girlData.latitude,
        girl_longitude: girlData.longitude,
        girl_timezone: girlData.timezone,
        ayanamsha: ayanamsha,
        rahu_mode: localStorage.getItem("rahu_mode") || "mean",
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: "GET",
        headers: { "x-api-token": API_TOKEN },
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const matchResult = calculateAshtakuta(data, t);
      if (!matchResult) {
        throw new Error(
          "Unable to parse Nakshatra/Moon data from API response.",
        );
      }

      // ఫ్యూచర్ కోసం క్యాచ్ లో సేవ్ చేయడం
      const finalMatchData = { raw: data, match: matchResult };
      cacheRef.current[cacheKey] = finalMatchData;
      setMatchData(finalMatchData);
      setStatus({ loading: false, error: "" });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  }

  const handleModeChange = (mode) => {
    setMatchMode(mode);
    setMatchData(null);
    if (mode === "nakshatra") {
      setNakPopupOpen(true);
    }
  };

  function handleGenerateNakshatraMatch(bNak, bPada, gNak, gPada) {
    setStatus({ loading: true, error: "" });
    try {
      const mockApiData = {
        boy: {
          moon: {
            nakshatra: bNak,
            pada: parseInt(bPada, 10),
          },
          chart: null,
        },
        girl: {
          moon: {
            nakshatra: gNak,
            pada: parseInt(gPada, 10),
          },
          chart: null,
        },
      };

      const matchResult = calculateAshtakuta(mockApiData, t);
      if (!matchResult) {
        throw new Error("Unable to calculate compatibility for selected Nakshatras.");
      }

      setMatchData({
        raw: mockApiData,
        match: matchResult,
        isNakshatraOnly: true,
      });
      setStatus({ loading: false, error: "" });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  }

  async function handlePdfAction(action = "download") {
    if (!matchData) return;
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
      let boyD1Svg = "", boyD9Svg = "", girlD1Svg = "", girlD9Svg = "";
      if (!matchData.isNakshatraOnly) {
        boyD1Svg = buildPrintSVG(
          matchData.raw.boy.chart.planets,
          null,
          t("Rasi Chakra"),
          "(D1)",
          t,
        );
        boyD9Svg = buildPrintSVG(
          matchData.raw.boy.chart.planets,
          matchData.raw.boy.chart.navamsa_d9,
          t("Navamsha"),
          "(D9)",
          t,
        );
        girlD1Svg = buildPrintSVG(
          matchData.raw.girl.chart.planets,
          null,
          t("Rasi Chakra"),
          "(D1)",
          t,
        );
        girlD9Svg = buildPrintSVG(
          matchData.raw.girl.chart.planets,
          matchData.raw.girl.chart.navamsa_d9,
          t("Navamsha"),
          "(D9)",
          t,
        );
      }

      // Generate Table Rows using Flexbox (Fixes html2canvas table rendering bug)
      const kutaRows = matchData.match.kutas
        .map(
          (k, idx) => `
        <div style="display: flex; align-items: stretch; border-bottom: ${idx === matchData.match.kutas.length - 1 ? "none" : "1px solid #dfe6e9"}; background: ${k.score === 0 ? "#fdedec" : "transparent"};">
          <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; flex-direction: column; justify-content: center;">
            <strong style="color: #2d3436;">${t(k.name)}</strong>
          </div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${locAmsha(k.boyVal)}</div></div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${locAmsha(k.girlVal)}</div></div>
          <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; align-items: center; justify-content: center; color: #2d3436;">${k.max}</div>
          <div style="flex: 1; padding: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10.5pt; text-align: center; color: ${k.score === 0 ? "#c0392b" : k.score > k.max / 2 ? "#27ae60" : "#f39c12"};"><div>${locAmsha(k.scoreDisplay) || k.score}</div></div>
        </div>
      `,
        )
        .join("");

      const exceptionsHtml =
        (matchData.match.exceptions.length > 0 || matchData.isNakshatraOnly)
          ? `<div style="background: ${matchData.match.exceptions.length > 0 ? "#fffbeb" : "#f8f9fa"}; border-left: 5px solid ${matchData.match.exceptions.length > 0 ? "#f59e0b" : "#bdc3c7"}; padding:15px; border-radius:4px; margin-bottom:20px;">
            <h4 style="color: ${matchData.match.exceptions.length > 0 ? "#b45309" : "#7f8c8d"}; margin:0 0 8px 0; font-size:11pt">${t("exceptionsNoted")}</h4>
            ${matchData.match.exceptions.length > 0 ? `
            <ul style="color:#92400e; margin:0; padding-left:20px; font-size:9pt; line-height:1.5; word-wrap:break-word; word-break:break-word;">
              ${matchData.match.exceptions.map((e) => `<li>${locAmsha(e)}</li>`).join("")}
            </ul>
            ` : `
            <div style="color:#7f8c8d; font-size:9pt; font-style:italic; padding-left:5px;">${t("noExceptionsNoted", "No exceptions or special rules noted for this match.")}</div>
            `}
           </div>`
          : "";

      const htmlContent = `
      <style>
        * { box-sizing: border-box; }
        .pdf-page { width: 794px; height: 1122px; padding: 40px; box-sizing: border-box; background: #fff; position: relative; font-family: 'Poppins', sans-serif; color: #2d3436; -webkit-text-size-adjust: none; }
        .header { text-align: center; border-bottom: 2px solid #2d3436; padding-bottom: 15px; margin-bottom: 20px; }
        .header img { height: 60px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 19pt; color: #2d3436; text-transform: uppercase; }
        .header h2 { margin: 5px 0; font-size: 14pt; color: #6c5ce7; font-weight: 600; }
        .details-grid { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
        .details-box { flex: 1; padding: 15px; border: 1px solid #dcdde1; border-radius: 8px; background: #f8f9fa; font-size: 10pt; line-height: 1.6; word-wrap: break-word; word-break: break-word; }
        .details-box h3 { margin: 0 0 10px 0; color: #2d3436; font-size: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 5px; text-transform: uppercase; }
        .flex-table-wrapper { border: 1.5px solid #2d3436; border-radius: 8px; overflow: hidden; margin-bottom: 20px; font-size: 9pt; width: 100%; display: flex; flex-direction: column; }
        .charts-row { display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; width: 100%; }
        .chart-col { width: 280px; display: flex; flex-direction: column; align-items: center; }
        .chart-col svg { width: 280px !important; height: 280px !important; display: block; }
        .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #dcdde1; padding-top: 8px; font-size: 8pt; color: #b2bec3; display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
      </style>
      <div id="pdf-render-wrapper" style="position: absolute; top: 0; left: 0; width: 794px; z-index: -9999; background: #fff;">
      
      <!-- PAGE 1: MATCH RESULTS -->
      <div class="pdf-page">
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo">` : ""}
          <h1>${t("marriageCompatibility")}</h1>
          <h2>${t("ashtakutaResults")}</h2>
          ${!matchData.isNakshatraOnly && matchData.raw?.ayanamsha ? `<div style="font-size:10pt; color:#7f8c8d; margin-top:5px;">Ayanamsha: ${matchData.raw.ayanamsha}</div>` : ""}
        </div>
        <div class="details-grid">
          <div class="details-box" style="border-top: 4px solid #3498db;">
            <h3 style="color:#2980b9;"> ${t("boy")}: ${boyData.name || t("groom")}</h3>
            ${!matchData.isNakshatraOnly ? `
            <div><strong>${t("dateOfBirth")}:</strong> ${boyData.dob ? boyData.dob.split('-').reverse().join('-') : '-'} &middot; ${boyData.tob}</div>
            <div><strong>${t("place", "Place")}:</strong> ${boyData.city ? boyData.city.split(",")[0] : "-"}</div>
            ` : `
            <div><strong>${t("nakshatraDataMode", "Nakshatra Mode")}</strong></div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${t(matchData.raw.boy?.moon?.nakshatra || "-")}-${locAmsha(matchData.raw.boy?.moon?.pada) || "-"}, ${locAmsha(matchData.match.kutas.find((k) => k.name === "Bhakoot")?.boyVal) || "-"}
            </div>
          </div>
          <div class="details-box" style="border-top: 4px solid #e74c3c;">
            <h3 style="color:#c0392b;"> ${t("girl")}: ${girlData.name || t("bride")}</h3>
            ${!matchData.isNakshatraOnly ? `
            <div><strong>${t("dateOfBirth")}:</strong> ${girlData.dob ? girlData.dob.split('-').reverse().join('-') : '-'} &middot; ${girlData.tob}</div>
            <div><strong>${t("place", "Place")}:</strong> ${girlData.city ? girlData.city.split(",")[0] : "-"}</div>
            ` : `
            <div><strong>${t("nakshatraDataMode", "Nakshatra Mode")}</strong></div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${t(matchData.raw.girl?.moon?.nakshatra || "-")}-${locAmsha(matchData.raw.girl?.moon?.pada) || "-"}, ${locAmsha(matchData.match.kutas.find((k) => k.name === "Bhakoot")?.girlVal) || "-"}
            </div>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-around; align-items:center; padding:10px 15px; background:#f8f9fa; border:1px solid #dcdde1; border-radius:6px; margin-bottom:15px;">
          <div style="font-size:11pt; color:#2d3436; font-weight:600;">${t("totalAshtakutaScore")}</div>
          <div style="font-size:16pt; font-weight:bold; color:${matchData.match.totalScore >= 18 ? "#27ae60" : "#c0392b"}">
            ${matchData.match.totalScore} <span style="font-size:11pt; color:#7f8c8d">/ 36</span>
          </div>
          <div style="font-size:11pt; font-weight:600; color:${matchData.match.totalScore >= 18 ? "#27ae60" : "#c0392b"};">
            ${t("compatibility")} ${t(matchData.match.compatibility)} (${matchData.match.percentage}%)
          </div>
        </div>

        <div class="flex-table-wrapper">
          <div style="display: flex; align-items: stretch; background: #f1f2f6; border-bottom: 1.5px solid #2d3436; font-weight: 700; font-size: 8.5pt; text-transform: uppercase; color: #2d3436;">
            <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9;">${t("kootaFactor")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("boy")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("girl")}</div>
            <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("max")}</div>
            <div style="flex: 1; padding: 8px; text-align: center;">${t("score")}</div>
          </div>
          ${kutaRows}
        </div>
        ${exceptionsHtml}

        <div class="footer">
          <span>${t("generatedBy", "e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page", "Page")} 1</span>
        </div>
      </div>
      
      ${!matchData.isNakshatraOnly ? `
      <!-- PAGE 2: CHARTS -->
      <div class="pdf-page">
        <div style="text-align:center; font-size:16pt; font-weight:bold; margin-bottom:25px; text-transform:uppercase; color:#2d3436; border-bottom:2px solid #2d3436; padding-bottom:10px;">${t("horoscopeCharts", "Horoscope Charts")}</div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#2980b9; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;"> ${boyData.name || t("groom")}</div>
        <div class="charts-row">
          <div class="chart-col">${boyD1Svg}</div>
          <div class="chart-col">${boyD9Svg}</div>
        </div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#c0392b; margin-top:25px; margin-bottom:15px; border-top:1px dashed #ccc; padding-top:25px; text-transform:uppercase; letter-spacing:1px;"> ${girlData.name || t("bride")}</div>
        <div class="charts-row">
          <div class="chart-col">${girlD1Svg}</div>
          <div class="chart-col">${girlD9Svg}</div>
        </div>
        
        <div class="footer">
          <span>${t("generatedBy", "e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page", "Page")} 2</span>
        </div>
      </div>
      ` : ""}
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

        const fName =
          `${boyData.name || "Boy"}_${girlData.name || "Girl"}_Match.pdf`.replace(
            /[^a-zA-Z0-9_.-]/g,
            "",
          );
        if (action === "share" && navigator.canShare) {
          const pdfBlob = pdf.output("blob");
          const file = new File([pdfBlob], fName, { type: "application/pdf" });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: "Marriage Compatibility",
                text: "Here is the Ashtakuta Match report generated via e-Jyotisha.",
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
              ),
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
  }

  return (
    <main
      className="new-horo-page"
      style={{
        background: "transparent",
        minHeight: "100vh",
      }}
    >
      <style>{`
  
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

        /* Layout overrides for new Match page */
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
        @media (max-width: 860px) {
          .new-horo-page { 
            padding-top: calc(env(safe-area-inset-top, 0px) + 8px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        @media (max-width: 768px) {
          .new-horo-page { 
            width: 100% !important; 
            padding: 10px !important; 
            padding-top: calc(env(safe-area-inset-top, 0px) + 8px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        
        /* Modern Cards */
        .new-horo-page .score-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 24px !important;
          margin-bottom: 20px !important;
          text-align: center !important;
        }
        .new-horo-page .exceptions-card {
          background: #fffbeb !important;
          border-left: 5px solid #f59e0b !important;
          padding: 16px !important;
          border-radius: 10px !important;
          margin-bottom: 20px !important;
          text-align: left !important;
        }
        .new-horo-page .table-panel {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }
        
        .new-horo-page .match-info-summary {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          gap: 15px !important;
          margin-bottom: 20px !important;
          width: 100% !important;
        }
        .new-horo-page .match-info-card {
          flex: 1 !important;
          background: #fdfefe !important;
          border: 1px solid #eaecee !important;
          border-radius: 12px !important;
          padding: 15px !important;
          text-align: center !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .new-horo-page .match-info-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }
        .new-horo-page .match-info-card.boy {
          border-top: 3px solid #3498db !important;
        }
        .new-horo-page .match-info-card.girl {
          border-top: 3px solid #e74c3c !important;
        }
        .new-horo-page .match-info-title {
          font-size: 13px !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin-bottom: 8px !important;
        }
        .new-horo-page .match-info-title.boy {
          color: #3498db !important;
        }
        .new-horo-page .match-info-title.girl {
          color: #e74c3c !important;
        }
        .new-horo-page .match-info-value {
          font-size: 18px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          line-height: 1.3 !important;
        }
        .new-horo-page .match-info-sub {
          font-size: 15px !important;
          color: #7f8c8d !important;
          margin-top: 4px !important;
          font-weight: 600 !important;
        }
        @media (max-width: 600px) {
          .new-horo-page .match-info-summary {
            gap: 8px !important;
          }
          .new-horo-page .match-info-card {
            padding: 10px 5px !important;
          }
          .new-horo-page .match-info-title {
            font-size: 11px !important;
            margin-bottom: 4px !important;
          }
          .new-horo-page .match-info-value {
            font-size: 14px !important;
          }
          .new-horo-page .match-info-sub {
            font-size: 12px !important;
          }
        }
        .new-horo-page .chart-card {
          flex: 1;
          min-width: 300px;
          border: 1px solid #eaecee !important;
          padding: 20px !important;
          border-radius: 14px !important;
          background: #ffffff !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .chart-card.boy {
          border-top: 4px solid #3498db !important;
        }
        .new-horo-page .chart-card.girl {
          border-top: 4px solid #e74c3c !important;
        }
        
        .new-horo-page .match-charts-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 10px;
          width: 100%;
        }

        /* Santana Sphuta Styling */
        .new-horo-page .santana-container {
          margin-top: 25px !important;
          width: 100% !important;
        }
        .new-horo-page .santana-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 15px;
          width: 100%;
        }
        .new-horo-page .santana-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 20px !important;
          box-sizing: border-box !important;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }
        .new-horo-page .santana-card.boy {
          border-top: 4px solid #3498db !important;
        }
        .new-horo-page .santana-card.girl {
          border-top: 4px solid #e74c3c !important;
        }
        
        /* Typography */
        .new-horo-page h2 {
          font-weight: 600 !important;
          font-size: 18px !important;
          color: #2c3e50 !important;
          margin: 0 0 15px 0 !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding-bottom: 12px !important;
          text-align: left !important;
        }
        .new-horo-page h3 {
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #2c3e50 !important;
          margin: 0 0 15px 0 !important;
        }

        /* Results table */
        .new-horo-page .table-scroll {
          overflow-x: auto !important; 
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
          border-radius: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .new-horo-page table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 0 !important;
        }
        .new-horo-page th {
          font-size: 13px !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 10px 14px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          background: #fdfefe !important;
          white-space: nowrap !important;
        }
        .new-horo-page td {
          font-size: 13px !important;
          color: #2c3e50 !important;
          padding: 8px 14px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          text-align: left !important;
          white-space: nowrap !important;
        }

                /* Ashtakuta Table Mobile Fix */

        .new-horo-page .table-scroll {
          width: 100%;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch;
        }
       .new-horo-page .ashtakuta-table {
          width: 100% !important;
          table-layout: auto !important;
        }

        .new-horo-page .ashtakuta-table th:nth-child(4),
        .new-horo-page .ashtakuta-table td:nth-child(4),
        .new-horo-page .ashtakuta-table th:nth-child(5),
        .new-horo-page .ashtakuta-table td:nth-child(5) {
          text-align: center !important;
          width: 50px;
        }

        .ashtakuta-table {
          min-width: 0 !important;
          width: 100% !important;
        } 

        
          


       .new-horo-page .ashtakuta-table th,
        .new-horo-page .ashtakuta-table td {
          white-space: nowrap;
        }

        .new-horo-page .ashtakuta-table th:first-child,
        .new-horo-page .ashtakuta-table td:first-child {
          width: 90px;
        } 
        
        .new-horo-page .ashtakuta-table .text-center {
          text-align: center !important;
        }
        
        /* Buttons */
        .new-horo-page .export-panel {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-bottom: 5px !important;
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

        /* Mobile Responsive Adjustments for Match Page */
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
          .new-horo-page .table-panel {
            padding: 15px 10px !important;
            border-radius: 12px !important;
          }
          .new-horo-page th {
            padding: 8px 6px !important;
            font-size: 12px !important;
          }
          .new-horo-page td {
            padding: 8px 6px !important;
            font-size: 12px !important;
          }
          .new-horo-page .ashtakuta-table th:first-child,
          .new-horo-page .ashtakuta-table td:first-child {
            width: 75px !important;
          }
          .new-horo-page .ashtakuta-table th:nth-child(4),
          .new-horo-page .ashtakuta-table td:nth-child(4),
          .new-horo-page .ashtakuta-table th:nth-child(5),
          .new-horo-page .ashtakuta-table td:nth-child(5) {
            width: 40px !important;
          }
          
          
          .new-horo-page .chart-card {
            padding: 15px 10px !important;
            min-width: 100% !important;
            border-radius: 12px !important;
            margin-bottom: 5px !important;
          }
          .new-horo-page .chart-card h3 {
            font-size: 16px !important;
            margin-bottom: 15px !important;
          }
          .new-horo-page .score-card {
            padding: 20px 15px !important;
          }
          .new-horo-page .score-card > div:nth-child(2) {
            font-size: 2.8rem !important;
          }
          .new-horo-page .match-charts-container {
            grid-template-columns: 1fr !important;
          }
          .new-horo-page .santana-grid {
            grid-template-columns: 1fr !important;
          }
        
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
          }
          .new-horo-page .top-bar-details {
            display: flex;
            flex-direction: column;
            flex: 1;
            cursor: pointer;
            min-width: 0;
            transition: transform 0.1s ease-in-out;
            padding: 8px;
            border-radius: 8px;
          }
          .new-horo-page .top-bar-details:hover {
            background: #f8f9fa;
          }
          .new-horo-page .top-bar-details:active {
            transform: scale(0.98);
          }
          .new-horo-page .top-bar-divider {
            width: 1px;
            background: #eaecee;
            align-self: stretch;
            margin: 0 5px;
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

          .kuta-description {
            font-size: 0.75rem;
            color: #7f8c8d;
            line-height: 1.3;
          }

          

          @media (max-width: 1024px) {
            .kuta-description {
            display: none;
          }
        } 
      `}</style>

      <section
        className="workspace"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {matchMode === "birth" ? (
          <div className="top-bar-card">
            <div
              className="top-bar-details"
              onClick={() => handleOpenPopup("boy")}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#3498db",
                  marginBottom: "4px",
                }}
              >
                 {boyData.name || t("groom")}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <span>📅 {boyData.dob ? boyData.dob.split('-').reverse().join('-') : ''}</span>
                <span>⏰ {boyData.tob}</span>
              </div>
            </div>

            <div className="top-bar-divider"></div>

            <div
              className="top-bar-details"
              onClick={() => handleOpenPopup("girl")}
              style={{ alignItems: "flex-end", textAlign: "right" }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                  marginBottom: "4px",
                }}
              >
                 {girlData.name || t("bride")}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  alignItems: "flex-end",
                }}
              >
                <span>📅 {girlData.dob ? girlData.dob.split('-').reverse().join('-') : ''}</span>
                <span>⏰ {girlData.tob}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="top-bar-card" onClick={() => setNakPopupOpen(true)}>
            <div className="top-bar-details">
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#3498db",
                  marginBottom: "4px",
                }}
              >
                 {boyData.name || t("groom")}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <span>🌸 {t(nakshatraFormData.boyNak)}-{nakshatraFormData.boyPada}</span>
              </div>
            </div>

            <div className="top-bar-divider"></div>

            <div
              className="top-bar-details"
              style={{ alignItems: "flex-end", textAlign: "right" }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                  marginBottom: "4px",
                }}
              >
                 {girlData.name || t("bride")}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  alignItems: "flex-end",
                }}
              >
                <span>🌸 {t(nakshatraFormData.girlNak)}-{nakshatraFormData.girlPada}</span>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {/* Left: info text */}
          <div style={{ fontSize: "12px", color: "#7f8c8d", flex: 1 }}>
            {matchMode === "birth"
              ? "ℹ️ Click on the Groom's or Bride's card above to change their birth date, time, or location details."
              : "ℹ️ Click on the card above to change Nakshatra details."}
          </div>

          {/* Right: mode toggle icons */}
          <div
            className="match-mode-toggle"
            style={{
              display: "flex",
              background: "#eaecee",
              padding: "3px",
              borderRadius: "8px",
              gap: "2px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => handleModeChange("birth")}
              title={t("birthDataMode", "Date Mode")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                background: matchMode === "birth" ? "#ffffff" : "transparent",
                fontSize: "19px",
                cursor: "pointer",
                boxShadow: matchMode === "birth" ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                minHeight: "auto",
              }}
            >
              📅
            </button>
            <button
              onClick={() => handleModeChange("nakshatra")}
              title={t("nakshatraDataMode", "Nakshatra Mode")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                background: matchMode === "nakshatra" ? "#ffffff" : "transparent",
                fontSize: "19px",
                cursor: "pointer",
                boxShadow: matchMode === "nakshatra" ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                minHeight: "auto",
              }}
            >
              ⭐
            </button>
          </div>
        </div>

        {matchMode === "birth" && (
          <div style={{ textAlign: "center", fontSize: "12px", color: "#7f8c8d", marginTop: "-8px", marginBottom: "10px" }}>
            <strong>Ayanamsha:</strong> {matchData?.raw?.ayanamsha || (() => {
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
        )}

        {matchMode === "birth" ? (
          <button
            onClick={handleGenerateMatch}
            disabled={status.loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8e44ad, #9b59b6)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: status.loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 10px rgba(142, 68, 173, 0.3)",
              marginBottom: "5px",
              opacity: status.loading ? 0.8 : 1,
              transition: "transform 0.2s ease",
            }}
          >
            {status.loading
              ? "⏳ " + t("processingMatch", "Processing Match...")
              : "✨ " + t("calcAshtakutaMatch", "Calculate Compatibility Match")}
          </button>
        ) : (
          <button
            onClick={() => setNakPopupOpen(true)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8e44ad, #9b59b6)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(142, 68, 173, 0.3)",
              marginBottom: "5px",
              transition: "transform 0.2s ease",
            }}
          >
            {"✨ " + t("selectNakshatrasAndCalc", "Select Nakshatras & Calculate")}
          </button>
        )}

        <div
          className="results-area"
          ref={resultsRef}
          style={{
            marginTop: "10px",
            height: "auto",
            overflow: "visible",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
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
              }}
            >
              ⏳ {t("processingMatch", "Processing Match Compatibility...")}
            </div>
          )}

          {!matchData && !status.loading && (
            <PredictionPanel
              title={t("readyForMatch", "Ready for Compatibility Check")}
              text={t(
                "enterMatchDetailsDesc",
                "Enter birth details for both Boy and Girl to generate the Ashtakuta Marriage Compatibility report.",
              )}
            />
          )}

          {matchData && (
            <>
              {/* Export Panel */}
              <div className="export-panel">
                <button
                  className="btn-pdf"
                  onClick={() => handlePdfAction("download")}
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

              {/* Score Display Card */}
              <div className="score-card">
                <h3 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>
                  {t("totalAshtakutaScore", "Total Ashtakuta Score")}
                </h3>
                <div
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "bold",
                    color:
                      matchData.match.totalScore >= 18 ? "#27ae60" : "#c0392b",
                    lineHeight: "1.1",
                  }}
                >
                  {matchData.match.totalScore}{" "}
                  <span style={{ fontSize: "1.5rem", color: "#bdc3c7" }}>
                    / 36
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginTop: "10px",
                    color:
                      matchData.match.totalScore >= 18 ? "#27ae60" : "#c0392b",
                  }}
                >
                  {t("compatibility", "Compatibility:")}{" "}
                  {t(matchData.match.compatibility)} (
                  {matchData.match.percentage}%)
                </div>
              </div>

              {/* Ashtakuta Results Table Panel */}
              <section className="table-panel">
                {/* Rashi, Nakshatra, Pada display */}
                <div className="match-info-summary" style={{ marginTop: "5px" }}>
                  {/* Boy Info */}
                  <div className="match-info-card boy">
                    <div className="match-info-title boy">
                       {boyData.name || t("groom", "Groom")}
                    </div>
                    <div className="match-info-value">
                      {t(matchData.raw.boy?.moon?.nakshatra || "-")}-{locAmsha(matchData.raw.boy?.moon?.pada) || "-"}
                    </div>
                    <div className="match-info-sub">
                      {locAmsha(matchData.match.kutas.find((k) => k.name === "Bhakoot")?.boyVal) || "-"}
                    </div>
                  </div>

                  {/* Girl Info */}
                  <div className="match-info-card girl">
                    <div className="match-info-title girl">
                       {girlData.name || t("bride", "Bride")}
                    </div>
                    <div className="match-info-value">
                      {t(matchData.raw.girl?.moon?.nakshatra || "-")}-{locAmsha(matchData.raw.girl?.moon?.pada) || "-"}
                    </div>
                    <div className="match-info-sub">
                      {locAmsha(matchData.match.kutas.find((k) => k.name === "Bhakoot")?.girlVal) || "-"}
                    </div>
                  </div>
                </div>

                <h2>{t("ashtakutaResults", "Ashtakuta Results")}</h2>

                <div className="table-scroll">
                  <table className="ashtakuta-table">
                    <thead>
                      <tr>
                        <th>Koota</th>

                        <th style={{ color: "#3498db", textAlign: "center" }}>
                          Boy
                        </th>

                        <th style={{ color: "#e74c3c", textAlign: "center" }}>
                          Girl
                        </th>

                        <th className="text-center">Max</th>
                        <th className="text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData.match.kutas.map((k) => (
                        <tr
                          key={k.name}
                          style={{
                            backgroundColor:
                              k.score === 0 ? "#fdedec" : "transparent",
                          }}
                        >
                          <td data-label={t("kootaFactor", "Koota (Factor)")}>
                            <strong style={{ color: "#2c3e50" }}>
                              {t(k.name)}
                            </strong>
                          </td>
                          <td
                            style={{ textAlign: "center", fontWeight: "600" }}
                            dangerouslySetInnerHTML={{
                              __html: locAmsha(k.boyVal)?.replace(/\bAmsha:\s*/gi, ""),
                            }}
                          ></td>
                          <td
                            style={{ textAlign: "center", fontWeight: "600" }}
                            dangerouslySetInnerHTML={{
                              __html: locAmsha(k.girlVal)?.replace(/\bAmsha:\s*/gi, ""),
                            }}
                          ></td>
                          <td style={{ color: "#7f8c8d", textAlign: "center" }}>{k.max}</td>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              textAlign: "center",
                              color:
                                k.score > k.max / 2
                                  ? "#27ae60"
                                  : k.score === 0
                                    ? "#c0392b"
                                    : "#f39c12",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: locAmsha(k.scoreDisplay)?.replace(/\bAmsha:\s*/gi, "") || k.score,
                            }}
                          ></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Exceptions Noted Panel */}
              {(matchData.match.exceptions.length > 0 || matchData.isNakshatraOnly) && (
                <div 
                  className="exceptions-card" 
                  style={{ 
                    background: matchData.match.exceptions.length > 0 ? "#fffbeb" : "#f8f9fa", 
                    borderLeft: matchData.match.exceptions.length > 0 ? "5px solid #f59e0b" : "5px solid #bdc3c7",
                    padding: "16px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    textAlign: "left"
                  }}
                >
                  <h4
                    style={{
                      color: matchData.match.exceptions.length > 0 ? "#b45309" : "#7f8c8d",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    ⚠️{" "}
                    {t("exceptionsNoted", "Exceptions / Special Rules Noted")}
                  </h4>
                  {matchData.match.exceptions.length > 0 ? (
                    <ul
                      style={{
                        color: "#92400e",
                        margin: 0,
                        paddingLeft: "20px",
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {matchData.match.exceptions.map((ex, i) => (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{ __html: locAmsha(ex) }}
                        ></li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#7f8c8d", fontSize: "0.9rem", fontStyle: "italic", paddingLeft: "5px" }}>
                      {t("noExceptionsNoted", "No exceptions or special rules noted for this match.")}
                    </div>
                  )}
                </div>
              )}
              
                        
              {/* Rashi Charts Panel */}
              {!matchData.isNakshatraOnly && (() => {
                const boyPlanets = matchData.raw?.boy?.chart?.planets || matchData.raw?.boy?.planets;
                const girlPlanets = matchData.raw?.girl?.chart?.planets || matchData.raw?.girl?.planets;
                const boyBeejaData = calculateBeejaSphutaData(boyPlanets);
                const girlKshetraData = calculateKshetraSphutaData(girlPlanets);

                return (
                  <div className="match-charts-container">
                    {matchData.raw.boy?.chart?.planets && (
                      <div className="chart-card boy">
                        <h3
                          style={{
                            textAlign: "center",
                            color: "#3498db",
                            margin: "0 0 20px 0",
                          }}
                        >
                           {boyData.name || t("groom", "Groom")} -{" "}
                          {t("Charts", "Charts")}
                        </h3>
                        <RashiChart
                          planets={matchData.raw.boy.chart.planets}
                          navamsa={matchData.raw.boy.chart.navamsa_d9 || {}}
                          hideD1Settings={true}
                          hideDivisionalSelector={true}
                          d1HighlightRashi={boyBeejaData ? {
                            rashi: boyBeejaData.sphutaInfo.rashiNum,
                            badge: "🌱",
                          } : null}
                          d9HighlightRashi={boyBeejaData ? {
                            rashi: boyBeejaData.navamsaInfo.navamsaRashiNum,
                            badge: "🌱",
                          } : null}
                        />
                      </div>
                    )}

                    {matchData.raw.girl?.chart?.planets && (
                      <div className="chart-card girl">
                        <h3
                          style={{
                            textAlign: "center",
                            color: "#e74c3c",
                            margin: "0 0 20px 0",
                          }}
                        >
                           {girlData.name || t("bride", "Bride")} -{" "}
                          {t("Charts", "Charts")}
                        </h3>
                        <RashiChart
                          planets={matchData.raw.girl.chart.planets}
                          navamsa={matchData.raw.girl.chart.navamsa_d9 || {}}
                          hideD1Settings={true}
                          hideDivisionalSelector={true}
                          d1HighlightRashi={girlKshetraData ? {
                            rashi: girlKshetraData.sphutaInfo.rashiNum,
                            badge: "🌸",
                          } : null}
                          d9HighlightRashi={girlKshetraData ? {
                            rashi: girlKshetraData.navamsaInfo.navamsaRashiNum,
                            badge: "🌸",
                          } : null}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ================================================== */}
              {/* BEEJA & KSHETRA SPHUTA — SANTANA */}
              {/* ================================================== */}
              <section className="santana-container">
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #eaecee",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1.5px solid #f1f2f6",
                      paddingBottom: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        border: "none",
                        padding: 0,
                        fontSize: "18px",
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>🌱</span>
                      <span>Santāna — Beeja &amp; Kṣetra Sphuṭa</span>
                    </h2>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#7f8c8d",
                        background: "#f8f9fa",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        border: "1px solid #eee",
                      }}
                    >
                      Traditional Jyotiṣa
                    </span>
                  </div>

                  {matchData.isNakshatraOnly ? (
                    <div
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #fef3c7",
                        borderLeft: "4px solid #f59e0b",
                        padding: "16px",
                        borderRadius: "8px",
                        color: "#92400e",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      ℹ️ <strong>Note:</strong> Beeja Sphuṭa &amp; Kṣetra Sphuṭa calculations require complete birth chart longitudes (Sun, Moon, Mars, Venus, Jupiter). Please generate the match using the <strong>Birth Details (Date, Time, Place)</strong> mode to view these calculations.
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const boyPlanets = matchData.raw?.boy?.chart?.planets || matchData.raw?.boy?.planets;
                        const girlPlanets = matchData.raw?.girl?.chart?.planets || matchData.raw?.girl?.planets;
                        const beejaData = calculateBeejaSphutaData(boyPlanets);
                        const kshetraData = calculateKshetraSphutaData(girlPlanets);

                        return (
                          <>
                            <div className="santana-grid">
                              {/* CARD 1: Male Horoscope — Beeja Sphuta */}
                              <div className="santana-card boy">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    borderBottom: "1.5px solid #ebf5fb",
                                    paddingBottom: "10px",
                                  }}
                                >
                                  <span style={{ fontSize: "20px" }}>👨</span>
                                  <div>
                                    <h3
                                      style={{
                                        margin: 0,
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#2980b9",
                                      }}
                                    >
                                      {boyData.name || t("groom", "Groom")} — Beeja Sphuṭa
                                    </h3>
                                    <span style={{ fontSize: "11px", color: "#7f8c8d" }}>
                                      Male Horoscope · Sūrya + Śukra + Guru
                                    </span>
                                  </div>
                                </div>

                                {beejaData ? (
                                  <>
                                    {/* Planetary Table */}
                                    <div className="table-scroll" style={{ border: "1px solid #f1f2f6", borderRadius: "8px" }}>
                                      <table style={{ width: "100%", margin: 0 }}>
                                        <thead>
                                          <tr style={{ background: "#f8f9fa" }}>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72" }}>Planet</th>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72" }}>Rashi Position</th>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72", textAlign: "right" }}>Absolute Longitude</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {beejaData.planets.map((p) => (
                                            <tr key={p.name} style={{ borderBottom: "1px solid #f1f2f6" }}>
                                              <td style={{ padding: "8px 10px", fontWeight: "600", color: "#2c3e50" }}>
                                                {t(p.name)}
                                              </td>
                                              <td style={{ padding: "8px 10px", color: "#2980b9", fontWeight: "500" }}>
                                                {t(p.info.rashiName)} {formatSphutaDMS(p.info.degInRashi)}
                                              </td>
                                              <td style={{ padding: "8px 10px", color: "#2c3e50", textAlign: "right", fontFamily: "monospace" }}>
                                                {p.info.absLonStr}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Total and 360 Adjustment */}
                                    <div
                                      style={{
                                        background: "#fcfdfe",
                                        border: "1px solid #eef2f5",
                                        borderRadius: "8px",
                                        padding: "10px 14px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <div style={{ display: "flex", justifyContent: "space-between", color: "#2c3e50" }}>
                                        <span>Total (Surya + Shukra + Guru):</span>
                                        <strong style={{ fontFamily: "monospace" }}>{beejaData.totalDms}</strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", color: "#7f8c8d" }}>
                                        <span>360° Adjustment:</span>
                                        <span style={{ fontFamily: "monospace" }}>{beejaData.adjustmentStr}</span>
                                      </div>
                                    </div>

                                    {/* Result Box */}
                                    <div
                                      style={{
                                        background: "#ebf5fb",
                                        border: "1.5px solid #bee3f8",
                                        borderRadius: "10px",
                                        padding: "14px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2980b9" }}>
                                          Beeja Sphuṭa:
                                        </span>
                                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#1a365d", fontFamily: "monospace" }}>
                                          {beejaData.sphutaDms}
                                        </span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #bee3f8", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Rashi:</span>
                                        <strong style={{ fontSize: "14px", color: "#2b6cb0" }}>
                                          {t(beejaData.sphutaInfo.rashiName)} ({beejaData.sphutaInfo.rashiPositionStr})
                                        </strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #bee3f8", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Rashi Type:</span>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            background: beejaData.sphutaInfo.isOja ? "#e6fffa" : "#faf5ff",
                                            color: beejaData.sphutaInfo.isOja ? "#234e52" : "#44337a",
                                            border: `1px solid ${beejaData.sphutaInfo.isOja ? "#81e6d9" : "#d6bcfa"}`,
                                          }}
                                        >
                                          Rashi Type: {beejaData.sphutaInfo.rashiType}
                                        </span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #bee3f8", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Navāṁśa:</span>
                                        <strong style={{ fontSize: "14px", color: "#2b6cb0" }}>
                                          {t(beejaData.navamsaInfo.navamsa)} ({beejaData.navamsaInfo.navamsaNumber}th Navāṁśa)
                                        </strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #bee3f8", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Navāṁśa Type:</span>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            background: beejaData.navamsaInfo.isNavamsaOja ? "#e6fffa" : "#faf5ff",
                                            color: beejaData.navamsaInfo.isNavamsaOja ? "#234e52" : "#44337a",
                                            border: `1px solid ${beejaData.navamsaInfo.isNavamsaOja ? "#81e6d9" : "#d6bcfa"}`,
                                          }}
                                        >
                                          Navāṁśa Type: {beejaData.navamsaInfo.navamsaType}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Expandable Calculation Steps */}
                                    <details
                                      style={{
                                        background: "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        padding: "10px 12px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <summary
                                        style={{
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          color: "#3182ce",
                                          outline: "none",
                                        }}
                                      >
                                        🔍 How is this calculated?
                                      </summary>
                                      <div
                                        style={{
                                          marginTop: "10px",
                                          padding: "10px",
                                          background: "#f7fafc",
                                          borderRadius: "6px",
                                          fontFamily: "monospace",
                                          fontSize: "12px",
                                          lineHeight: "1.7",
                                          color: "#2d3748",
                                        }}
                                      >
                                        <div style={{ color: "#718096", marginBottom: "4px" }}>Formula: Surya + Shukra + Guru</div>
                                        <div>
                                          {beejaData.planets[0].info.absLonStr} (Surya) + {beejaData.planets[1].info.absLonStr} (Shukra) + {beejaData.planets[2].info.absLonStr} (Guru)
                                        </div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>Total Longitude = {beejaData.totalDms}</div>
                                        {beejaData.turns > 0 && (
                                          <>
                                            <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                            <div>{beejaData.totalDms} − {beejaData.turns * 360}° (360° Normalization)</div>
                                          </>
                                        )}
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>Final Beeja Sphuṭa = {beejaData.sphutaDms}</div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          Rāśi Position = {beejaData.sphutaInfo.rashiPositionStr} ({beejaData.sphutaInfo.rashiType})
                                        </div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          Position in Rāśi = {formatSphutaDMS(beejaData.sphutaInfo.degInRashi)}
                                        </div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          3°20′ Division = {formatSphutaDMS(beejaData.sphutaInfo.degInRashi)} ÷ 3°20′ → {beejaData.navamsaInfo.navamsaNumber}th Navāṁśa
                                        </div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          {beejaData.navamsaInfo.signModality} sign ({beejaData.sphutaInfo.rashiName}) → Starts from {beejaData.navamsaInfo.startSignName}
                                        </div>
                                        <div style={{ color: "#3182ce", fontWeight: "bold" }}>↓</div>
                                        <div style={{ fontWeight: "bold", color: "#2b6cb0" }}>
                                          Navāṁśa Rāśi = {beejaData.navamsaInfo.navamsa} (Navāṁśa Type: {beejaData.navamsaInfo.navamsaType})
                                        </div>
                                      </div>
                                    </details>
                                  </>
                                ) : (
                                  <div style={{ color: "#7f8c8d", fontSize: "13px" }}>Planetary longitudes unavailable.</div>
                                )}
                              </div>

                              {/* CARD 2: Female Horoscope — Kshetra Sphuta */}
                              <div className="santana-card girl">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    borderBottom: "1.5px solid #fdedec",
                                    paddingBottom: "10px",
                                  }}
                                >
                                  <span style={{ fontSize: "20px" }}>👩</span>
                                  <div>
                                    <h3
                                      style={{
                                        margin: 0,
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#c0392b",
                                      }}
                                    >
                                      {girlData.name || t("bride", "Bride")} — Kṣetra Sphuṭa
                                    </h3>
                                    <span style={{ fontSize: "11px", color: "#7f8c8d" }}>
                                      Female Horoscope · Moon + Mars + Jupiter
                                    </span>
                                  </div>
                                </div>

                                {kshetraData ? (
                                  <>
                                    {/* Planetary Table */}
                                    <div className="table-scroll" style={{ border: "1px solid #f1f2f6", borderRadius: "8px" }}>
                                      <table style={{ width: "100%", margin: 0 }}>
                                        <thead>
                                          <tr style={{ background: "#f8f9fa" }}>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72" }}>Planet</th>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72" }}>Rashi Position</th>
                                            <th style={{ padding: "8px 10px", fontSize: "12px", color: "#636e72", textAlign: "right" }}>Absolute Longitude</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {kshetraData.planets.map((p) => (
                                            <tr key={p.name} style={{ borderBottom: "1px solid #f1f2f6" }}>
                                              <td style={{ padding: "8px 10px", fontWeight: "600", color: "#2c3e50" }}>
                                                {t(p.name)}
                                              </td>
                                              <td style={{ padding: "8px 10px", color: "#c0392b", fontWeight: "500" }}>
                                                {t(p.info.rashiName)} {formatSphutaDMS(p.info.degInRashi)}
                                              </td>
                                              <td style={{ padding: "8px 10px", color: "#2c3e50", textAlign: "right", fontFamily: "monospace" }}>
                                                {p.info.absLonStr}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Total and 360 Adjustment */}
                                    <div
                                      style={{
                                        background: "#fcfdfe",
                                        border: "1px solid #eef2f5",
                                        borderRadius: "8px",
                                        padding: "10px 14px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <div style={{ display: "flex", justifyContent: "space-between", color: "#2c3e50" }}>
                                        <span>Total (Chandra + Kuja + Guru):</span>
                                        <strong style={{ fontFamily: "monospace" }}>{kshetraData.totalDms}</strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", color: "#7f8c8d" }}>
                                        <span>360° Adjustment:</span>
                                        <span style={{ fontFamily: "monospace" }}>{kshetraData.adjustmentStr}</span>
                                      </div>
                                    </div>

                                    {/* Result Box */}
                                    <div
                                      style={{
                                        background: "#fdf2f2",
                                        border: "1.5px solid #fecaca",
                                        borderRadius: "10px",
                                        padding: "14px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#c0392b" }}>
                                          Kṣetra Sphuṭa:
                                        </span>
                                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#771d1d", fontFamily: "monospace" }}>
                                          {kshetraData.sphutaDms}
                                        </span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #fecaca", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Rashi:</span>
                                        <strong style={{ fontSize: "14px", color: "#c53030" }}>
                                          {t(kshetraData.sphutaInfo.rashiName)} ({kshetraData.sphutaInfo.rashiPositionStr})
                                        </strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #fecaca", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Rashi Type:</span>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            background: kshetraData.sphutaInfo.isOja ? "#e6fffa" : "#faf5ff",
                                            color: kshetraData.sphutaInfo.isOja ? "#234e52" : "#44337a",
                                            border: `1px solid ${kshetraData.sphutaInfo.isOja ? "#81e6d9" : "#d6bcfa"}`,
                                          }}
                                        >
                                          Rashi Type: {kshetraData.sphutaInfo.rashiType}
                                        </span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #fecaca", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Navāṁśa:</span>
                                        <strong style={{ fontSize: "14px", color: "#c53030" }}>
                                          {t(kshetraData.navamsaInfo.navamsa)} ({kshetraData.navamsaInfo.navamsaNumber}th Navāṁśa)
                                        </strong>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #fecaca", paddingTop: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#4a5568" }}>Navāṁśa Type:</span>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            background: kshetraData.navamsaInfo.isNavamsaOja ? "#e6fffa" : "#faf5ff",
                                            color: kshetraData.navamsaInfo.isNavamsaOja ? "#234e52" : "#44337a",
                                            border: `1px solid ${kshetraData.navamsaInfo.isNavamsaOja ? "#81e6d9" : "#d6bcfa"}`,
                                          }}
                                        >
                                          Navāṁśa Type: {kshetraData.navamsaInfo.navamsaType}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Expandable Calculation Steps */}
                                    <details
                                      style={{
                                        background: "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        padding: "10px 12px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <summary
                                        style={{
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          color: "#e53e3e",
                                          outline: "none",
                                        }}
                                      >
                                        🔍 How is this calculated?
                                      </summary>
                                      <div
                                        style={{
                                          marginTop: "10px",
                                          padding: "10px",
                                          background: "#f7fafc",
                                          borderRadius: "6px",
                                          fontFamily: "monospace",
                                          fontSize: "12px",
                                          lineHeight: "1.7",
                                          color: "#2d3748",
                                        }}
                                      >
                                        <div style={{ color: "#718096", marginBottom: "4px" }}>Formula: Chandra + Kuja + Guru</div>
                                        <div>
                                          {kshetraData.planets[0].info.absLonStr} (Chandra) + {kshetraData.planets[1].info.absLonStr} (Kuja) + {kshetraData.planets[2].info.absLonStr} (Guru)
                                        </div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>Total Longitude = {kshetraData.totalDms}</div>
                                        {kshetraData.turns > 0 && (
                                          <>
                                            <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                            <div>{kshetraData.totalDms} − {kshetraData.turns * 360}° (360° Normalization)</div>
                                          </>
                                        )}
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>Final Kṣetra Sphuṭa = {kshetraData.sphutaDms}</div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          Rāśi Position = {kshetraData.sphutaInfo.rashiPositionStr} ({kshetraData.sphutaInfo.rashiType})
                                        </div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          Position in Rāśi = {formatSphutaDMS(kshetraData.sphutaInfo.degInRashi)}
                                        </div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          3°20′ Division = {formatSphutaDMS(kshetraData.sphutaInfo.degInRashi)} ÷ 3°20′ → {kshetraData.navamsaInfo.navamsaNumber}th Navāṁśa
                                        </div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div>
                                          {kshetraData.navamsaInfo.signModality} sign ({kshetraData.sphutaInfo.rashiName}) → Starts from {kshetraData.navamsaInfo.startSignName}
                                        </div>
                                        <div style={{ color: "#e53e3e", fontWeight: "bold" }}>↓</div>
                                        <div style={{ fontWeight: "bold", color: "#c53030" }}>
                                          Navāṁśa Rāśi = {kshetraData.navamsaInfo.navamsa} (Navāṁśa Type: {kshetraData.navamsaInfo.navamsaType})
                                        </div>
                                      </div>
                                    </details>
                                  </>
                                ) : (
                                  <div style={{ color: "#7f8c8d", fontSize: "13px" }}>Planetary longitudes unavailable.</div>
                                )}
                              </div>
                            </div>

                            {/* Educational Reference Section — How to Study Beeja & Kṣetra Sphuṭa */}
                            <details
                              style={{
                                marginTop: "20px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderLeft: "4px solid #8e44ad",
                                borderRadius: "10px",
                                padding: "12px 18px",
                                fontSize: "13px",
                                lineHeight: "1.6",
                                color: "#4a5568",
                              }}
                            >
                              <summary
                                style={{
                                  cursor: "pointer",
                                  fontWeight: "700",
                                  color: "#2d3748",
                                  fontSize: "14px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  outline: "none",
                                  userSelect: "none",
                                }}
                              >
                                <span>📖</span>
                                <span>How to Study Beeja & Kṣetra Sphuṭa</span>
                              </summary>

                              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                                {/* 1. Beeja Sphuṭa — Male Horoscope */}
                                <div style={{ marginBottom: "18px" }}>
                                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13.5px", fontWeight: "700", color: "#2b6cb0" }}>
                                    1. Beeja Sphuṭa — Male Horoscope
                                  </h4>
                                  <p style={{ margin: "0 0 6px 0", color: "#4a5568" }}>Traditionally, students may examine:</p>
                                  <ul style={{ margin: "0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <li>The Rāśi occupied by Beeja Sphuṭa.</li>
                                    <li>Whether the Rāśi is Oja (Odd) or Yugma (Even).</li>
                                    <li>The Navāṁśa occupied by Beeja Sphuṭa.</li>
                                    <li>Whether the Navāṁśa is Oja (Odd) or Yugma (Even).</li>
                                    <li>Benefic, malefic and neutral planetary influences on the Sphuṭa.</li>
                                    <li>The 5th house from Beeja Sphuṭa.</li>
                                    <li>The condition of the relevant Rāśi and Navāṁśa lords.</li>
                                  </ul>
                                </div>

                                <hr style={{ border: "none", borderTop: "1px dashed #e2e8f0", margin: "16px 0" }} />

                                {/* 2. Kṣetra Sphuṭa — Female Horoscope */}
                                <div style={{ marginBottom: "18px" }}>
                                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13.5px", fontWeight: "700", color: "#c53030" }}>
                                    2. Kṣetra Sphuṭa — Female Horoscope
                                  </h4>
                                  <p style={{ margin: "0 0 6px 0", color: "#4a5568" }}>Traditionally, students may examine:</p>
                                  <ul style={{ margin: "0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <li>The Rāśi occupied by Kṣetra Sphuṭa.</li>
                                    <li>Whether the Rāśi is Oja (Odd) or Yugma (Even).</li>
                                    <li>The Navāṁśa occupied by Kṣetra Sphuṭa.</li>
                                    <li>Whether the Navāṁśa is Oja (Odd) or Yugma (Even).</li>
                                    <li>Benefic, malefic and neutral planetary influences on the Sphuṭa.</li>
                                    <li>The 9th house from Kṣetra Sphuṭa.</li>
                                    <li>The condition of the relevant Rāśi and Navāṁśa lords.</li>
                                  </ul>
                                </div>

                                <hr style={{ border: "none", borderTop: "1px dashed #e2e8f0", margin: "16px 0" }} />

                                {/* 3. Broader Santāna Assessment */}
                                <div style={{ marginBottom: "18px" }}>
                                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13.5px", fontWeight: "700", color: "#2d3748" }}>
                                    3. Broader Santāna Assessment
                                  </h4>
                                  <p style={{ margin: "0 0 6px 0", color: "#4a5568" }}>
                                    Beeja and Kṣetra Sphuṭa should not be studied in isolation.
                                  </p>
                                  <p style={{ margin: "0 0 6px 0", color: "#4a5568" }}>
                                    A broader Jyotiṣa assessment may consider:
                                  </p>
                                  <ul style={{ margin: "0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <li>5th Bhāva</li>
                                    <li>5th Lord</li>
                                    <li>Guru (Jupiter)</li>
                                    <li>Relevant planetary influences</li>
                                    <li>Other supporting Santāna factors</li>
                                    <li>Daśā and timing factors, when appropriate</li>
                                  </ul>
                                </div>

                                <hr style={{ border: "none", borderTop: "1px dashed #e2e8f0", margin: "16px 0" }} />

                                {/* 4. Important Educational Note */}
                                <div style={{ marginBottom: "16px" }}>
                                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13.5px", fontWeight: "700", color: "#2d3748" }}>
                                    4. Important Educational Note
                                  </h4>
                                  <p style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
                                    Beeja and Kṣetra Sphuṭa are traditional Jyotiṣa indicators used as part of Santāna-related analysis.
                                  </p>
                                  <p style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
                                    They should not be treated as a standalone method for making definitive statements about fertility or infertility.
                                  </p>
                                  <p style={{ margin: "0", color: "#4a5568" }}>
                                    Students should study these factors together with the complete horoscope and the relevant classical principles.
                                  </p>
                                </div>

                                {/* Footer inside expanded section */}
                                <div
                                  style={{
                                    marginTop: "16px",
                                    padding: "10px 14px",
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    color: "#718096",
                                  }}
                                >
                                  Purpose: This section provides reference information for Jyotiṣa students. The application displays the calculations; interpretation is left to the student's study and judgement.
                                </div>
                              </div>
                            </details>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      {/* Nakshatra Selection Popup Modal */}
      {nakPopupOpen && (
        <div className="popup-container">
          <div className="popup-content" style={{ maxWidth: "500px" }}>
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
              <span>🌸 {t("selectNakshatraPada", "Select Nakshatra & Pada")}</span>
              <span
                style={{
                  cursor: "pointer",
                  background: "#f8f9fa",
                  padding: "4px 8px",
                  borderRadius: "50%",
                  fontSize: "14px",
                }}
                onClick={() => setNakPopupOpen(false)}
              >
                ❌
              </span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Groom's details */}
              <div
                style={{
                  padding: "12px",
                  border: "1px solid #eaecee",
                  borderRadius: "10px",
                  background: "#f8f9fa",
                  borderLeft: "4px solid #3498db",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#3498db", marginBottom: "10px" }}>
                   {boyData.name || t("groom", "Groom")}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: "12px", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>
                      Nakshatra:
                    </label>
                    <select
                      value={nakshatraFormData.boyNak}
                      onChange={(e) =>
                        setNakshatraFormData({
                          ...nakshatraFormData,
                          boyNak: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #dcdde1",
                        background: "#fff",
                      }}
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak.n} value={nak.name}>
                          {nak.n}. {t(nak.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "12px", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>
                      Pada:
                    </label>
                    <select
                      value={nakshatraFormData.boyPada}
                      onChange={(e) =>
                        setNakshatraFormData({
                          ...nakshatraFormData,
                          boyPada: parseInt(e.target.value, 10),
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #dcdde1",
                        background: "#fff",
                      }}
                    >
                      {[1, 2, 3, 4].map((pada) => (
                        <option key={pada} value={pada}>
                          {pada}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bride's details */}
              <div
                style={{
                  padding: "12px",
                  border: "1px solid #eaecee",
                  borderRadius: "10px",
                  background: "#f8f9fa",
                  borderLeft: "4px solid #e74c3c",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#e74c3c", marginBottom: "10px" }}>
                   {girlData.name || t("bride", "Bride")}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: "12px", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>
                      Nakshatra:
                    </label>
                    <select
                      value={nakshatraFormData.girlNak}
                      onChange={(e) =>
                        setNakshatraFormData({
                          ...nakshatraFormData,
                          girlNak: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #dcdde1",
                        background: "#fff",
                      }}
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak.n} value={nak.name}>
                          {nak.n}. {t(nak.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "12px", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>
                      Pada:
                    </label>
                    <select
                      value={nakshatraFormData.girlPada}
                      onChange={(e) =>
                        setNakshatraFormData({
                          ...nakshatraFormData,
                          girlPada: parseInt(e.target.value, 10),
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #dcdde1",
                        background: "#fff",
                      }}
                    >
                      {[1, 2, 3, 4].map((pada) => (
                        <option key={pada} value={pada}>
                          {pada}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button
                  onClick={() => setNakPopupOpen(false)}
                  style={{
                    flex: 1,
                    background: "#bdc3c7",
                    color: "#fff",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleGenerateNakshatraMatch(
                      nakshatraFormData.boyNak,
                      nakshatraFormData.boyPada,
                      nakshatraFormData.girlNak,
                      nakshatraFormData.girlPada
                    );
                    setNakPopupOpen(false);
                  }}
                  style={{
                    flex: 1,
                    background: "#8e44ad",
                    color: "#fff",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(142, 68, 173, 0.2)",
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal for editing details */}
      {popupConfig.isOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <h3
              style={{
                marginTop: 0,
                color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                borderBottom: "2px solid #f1f2f6",
                paddingBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                ✏️{" "}
                {popupConfig.type === "boy"
                  ? t("boyDetails", "Boy Details")
                  : t("girlDetails", "Girl Details")}
              </span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleNewDetails}
                  style={{
                    background: "#ebf5fb",
                    border: `1px solid ${popupConfig.type === "boy" ? "#3498db" : "#e74c3c"}`,
                    color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
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
                  onClick={() =>
                    setPopupConfig({ ...popupConfig, isOpen: false })
                  }
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
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#2c3e50",
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
                    }}
                  />
                </label>
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
                      value={editFormData.dob || ""}
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
                      value={editFormData.tob || ""}
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
                    onClick={handleSavePopup}
                    style={{
                      flex: 1,
                      background:
                        popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow:
                        popupConfig.type === "boy"
                          ? "0 4px 10px rgba(52, 152, 219, 0.3)"
                          : "0 4px 10px rgba(231, 76, 60, 0.3)",
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
                    border: `1px solid ${popupConfig.type === "boy" ? "#3498db" : "#e74c3c"}`,
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
                    const matchesGender = popupConfig.type === "boy"
                      ? profiles[name].gender !== "female"
                      : profiles[name].gender === "female";
                    const matchesSearch = searchQuery.trim() === "" ||
                      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (profiles[name].city || "").toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesGender && matchesSearch;
                  }).length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#7f8c8d",
                        padding: "20px 0",
                      }}
                    >
                      No saved profiles found for{" "}
                      {popupConfig.type === "boy" ? "Boy" : "Girl"}.
                    </p>
                  ) : (
                    Object.keys(profiles)
                      .filter((name) => {
                        const matchesGender = popupConfig.type === "boy"
                          ? profiles[name].gender !== "female"
                          : profiles[name].gender === "female";
                        const matchesSearch = searchQuery.trim() === "" ||
                          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (profiles[name].city || "").toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesGender && matchesSearch;
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
                            <strong
                              style={{
                                color:
                                  popupConfig.type === "boy"
                                    ? "#3498db"
                                    : "#e74c3c",
                                fontSize: "15px",
                                display: "block",
                                marginBottom: "4px",
                                textAlign: "left",
                              }}
                            >
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
                              <span>📍 {profiles[name].city ? profiles[name].city.split(',')[0].trim() : (profiles[name].city || t("manualCoords", "Manual Coords"))}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProfileSelect(name);
                              }}
                              title="Edit"
                              style={{
                                background: "#ebf5fb",
                                border: `1px solid ${popupConfig.type === "boy" ? "#3498db" : "#e74c3c"}`,
                                color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
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

// ==================================================
// BEEJA & KSHETRA SPHUTA — SANTANA
// ==================================================

const SPHUTA_RASHI_NAMES = [
  "",
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

function formatSphutaDMS(degFloat, includeSeconds = true) {
  if (degFloat === null || degFloat === undefined || isNaN(degFloat)) return "-";
  let totalSec = Math.round(Number(degFloat) * 3600);
  if (totalSec < 0) totalSec = (totalSec % (360 * 3600)) + 360 * 3600;

  const d = Math.floor(totalSec / 3600);
  const remSec = totalSec % 3600;
  const m = Math.floor(remSec / 60);
  const s = remSec % 60;

  if (!includeSeconds || s === 0) {
    return `${d}° ${String(m).padStart(2, "0")}′`;
  }
  return `${d}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
}

function getPlanetAbsoluteLongitude(planet) {
  if (!planet) return 0;
  if (planet.longitude !== undefined && planet.longitude !== null && !isNaN(Number(planet.longitude))) {
    return Number(planet.longitude);
  }
  if (planet.degree !== undefined && planet.degree !== null && planet.rashi !== undefined && planet.rashi !== null) {
    const deg = Number(planet.degree);
    const rashi = Number(planet.rashi);
    if (!isNaN(deg) && !isNaN(rashi) && rashi >= 1 && rashi <= 12) {
      return (rashi - 1) * 30 + deg;
    }
  }
  return 0;
}

function findPlanetObject(planets, names) {
  if (!planets) return null;
  if (Array.isArray(planets)) {
    return planets.find((p) => names.some((n) => p?.name?.toLowerCase() === n.toLowerCase() || p?.label?.toLowerCase() === n.toLowerCase()));
  }
  for (const name of names) {
    if (planets[name]) return planets[name];
    const matchKey = Object.keys(planets).find((k) => k.toLowerCase() === name.toLowerCase());
    if (matchKey && planets[matchKey]) return planets[matchKey];
  }
  return null;
}

function getSphutaRashiInfo(absLon) {
  const norm = ((Number(absLon) % 360) + 360) % 360;
  const rashiNum = Math.floor(norm / 30) + 1; // 1 to 12
  const degInRashi = norm - (rashiNum - 1) * 30; // 0 to 30
  const rashiName = SPHUTA_RASHI_NAMES[rashiNum] || "";
  const isOja = rashiNum % 2 !== 0; // 1, 3, 5, 7, 9, 11 (Odd)
  const rashiType = isOja ? "Oja / Odd" : "Yugma / Even";

  return {
    norm,
    rashiNum,
    rashiName,
    degInRashi,
    rashiPositionStr: `${rashiName} ${formatSphutaDMS(degInRashi)}`,
    absLonStr: formatSphutaDMS(norm),
    isOja,
    rashiType,
  };
}

export function getNavamsaFromLongitude(longitude) {
  const norm = ((Number(longitude) % 360) + 360) % 360;
  const totalSec = Math.round(norm * 3600);
  const rashiNum = Math.floor(totalSec / 108000) + 1; // 1 to 12
  const secInRashi = totalSec % 108000;
  const degInRashi = secInRashi / 3600;
  const navamsaNumber = Math.floor(secInRashi / 12000) + 1; // 1 to 9
  const totalNavamsaIdx = Math.floor(totalSec / 12000); // 0 to 107
  const navamsaRashiNum = (totalNavamsaIdx % 12) + 1; // 1 to 12
  const navamsaRashiName = SPHUTA_RASHI_NAMES[navamsaRashiNum] || "";
  const isNavamsaOja = navamsaRashiNum % 2 !== 0;
  const navamsaType = isNavamsaOja ? "Oja / Odd" : "Yugma / Even";

  // Sign modality for educational display:
  // Chara (Movable): 1, 4, 7, 10 -> Starts from same sign
  // Sthira (Fixed): 2, 5, 8, 11 -> Starts from 9th sign
  // Dvisvabhava (Dual): 3, 6, 9, 12 -> Starts from 5th sign
  let signModality = "";
  let startSignNum = 1;
  if ([1, 4, 7, 10].includes(rashiNum)) {
    signModality = "Movable (Chara)";
    startSignNum = rashiNum;
  } else if ([2, 5, 8, 11].includes(rashiNum)) {
    signModality = "Fixed (Sthira)";
    startSignNum = ((rashiNum - 1 + 8) % 12) + 1;
  } else {
    signModality = "Dual (Dvisvabhāva)";
    startSignNum = ((rashiNum - 1 + 4) % 12) + 1;
  }
  const startSignName = SPHUTA_RASHI_NAMES[startSignNum];

  return {
    rashi: SPHUTA_RASHI_NAMES[rashiNum] || "",
    rashiNum,
    rashiDegree: degInRashi,
    rashiPositionStr: `${SPHUTA_RASHI_NAMES[rashiNum]} ${formatSphutaDMS(degInRashi)}`,
    navamsa: navamsaRashiName,
    navamsaRashiNum,
    navamsaNumber,
    navamsaType,
    isNavamsaOja,
    signModality,
    startSignName,
  };
}

function calculateBeejaSphutaData(planets) {
  if (!planets) return null;

  const sunObj = findPlanetObject(planets, ["Sun", "Su", "Surya", "సూర్యుడు"]);
  const venusObj = findPlanetObject(planets, ["Venus", "Ve", "Sk", "Sukra", "Shukra", "శుక్రుడు"]);
  const jupObj = findPlanetObject(planets, ["Jupiter", "Ju", "Gu", "Guru", "గురువు"]);

  if (!sunObj || !venusObj || !jupObj) return null;

  const sunLon = getPlanetAbsoluteLongitude(sunObj);
  const venusLon = getPlanetAbsoluteLongitude(venusObj);
  const jupLon = getPlanetAbsoluteLongitude(jupObj);

  const total = sunLon + venusLon + jupLon;
  const normalized = ((total % 360) + 360) % 360;
  const turns = Math.floor(total / 360);

  const sunInfo = getSphutaRashiInfo(sunLon);
  const venusInfo = getSphutaRashiInfo(venusLon);
  const jupInfo = getSphutaRashiInfo(jupLon);
  const sphutaInfo = getSphutaRashiInfo(normalized);
  const navamsaInfo = getNavamsaFromLongitude(normalized);

  return {
    planets: [
      { name: "Sun", sanskrit: "Surya", eng: "Surya", tel: "సూర్యుడు", lon: sunLon, info: sunInfo },
      { name: "Venus", sanskrit: "Shukra", eng: "Shukra", tel: "శుక్రుడు", lon: venusLon, info: venusInfo },
      { name: "Jupiter", sanskrit: "Guru", eng: "Guru", tel: "గురువు", lon: jupLon, info: jupInfo },
    ],
    total,
    totalDms: formatSphutaDMS(total),
    turns,
    adjustmentStr: turns > 0 ? `- ${turns * 360}° (${formatSphutaDMS(turns * 360)})` : "0° (No Adjustment)",
    sphutaLon: normalized,
    sphutaDms: formatSphutaDMS(normalized),
    sphutaInfo,
    navamsaInfo,
  };
}

function calculateKshetraSphutaData(planets) {
  if (!planets) return null;

  const moonObj = findPlanetObject(planets, ["Moon", "Mo", "Ch", "Chandra", "చంద్రుడు"]);
  const marsObj = findPlanetObject(planets, ["Mars", "Ma", "Ku", "Kuja", "కుజుడు"]);
  const jupObj = findPlanetObject(planets, ["Jupiter", "Ju", "Gu", "Guru", "గురువు"]);

  if (!moonObj || !marsObj || !jupObj) return null;

  const moonLon = getPlanetAbsoluteLongitude(moonObj);
  const marsLon = getPlanetAbsoluteLongitude(marsObj);
  const jupLon = getPlanetAbsoluteLongitude(jupObj);

  const total = moonLon + marsLon + jupLon;
  const normalized = ((total % 360) + 360) % 360;
  const turns = Math.floor(total / 360);

  const moonInfo = getSphutaRashiInfo(moonLon);
  const marsInfo = getSphutaRashiInfo(marsLon);
  const jupInfo = getSphutaRashiInfo(jupLon);
  const sphutaInfo = getSphutaRashiInfo(normalized);
  const navamsaInfo = getNavamsaFromLongitude(normalized);

  return {
    planets: [
      { name: "Moon", sanskrit: "Chandra", eng: "Chandra", tel: "చంద్రుడు", lon: moonLon, info: moonInfo },
      { name: "Mars", sanskrit: "Kuja", eng: "Kuja", tel: "కుజుడు", lon: marsLon, info: marsInfo },
      { name: "Jupiter", sanskrit: "Guru", eng: "Guru", tel: "గురువు", lon: jupLon, info: jupInfo },
    ],
    total,
    totalDms: formatSphutaDMS(total),
    turns,
    adjustmentStr: turns > 0 ? `- ${turns * 360}° (${formatSphutaDMS(turns * 360)})` : "0° (No Adjustment)",
    sphutaLon: normalized,
    sphutaDms: formatSphutaDMS(normalized),
    sphutaInfo,
    navamsaInfo,
  };
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

// Local SVG builder function reusing the Horoscope 14pt responsive adjustments
function buildPrintSVG(planets, navamsa, title, subtitle, t) {
  const chartStyle = localStorage.getItem("vaiswanara_chart_style") || "south";
  if (chartStyle === "north") {
    return buildPrintNorthSvg(planets, navamsa, title, subtitle, t);
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
