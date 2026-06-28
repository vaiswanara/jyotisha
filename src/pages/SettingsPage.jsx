import React, { useState, useEffect, useRef } from "react";
import { LocationAutocomplete } from "../components/LocationAutocomplete.jsx";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

const MASTER_LISTS = {
  maasa: [
    "Chaitra",
    "Vaisakha",
    "Jyeshtha",
    "Ashadha",
    "Shravana",
    "Bhadrapada",
    "Ashwayuja",
    "Kartika",
    "Margashirsha",
    "Pausha",
    "Magha",
    "Phalguna",
    "Adhika",
  ],
  vaara: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  tithi: [
    "S-Prathama",
    "S-Dvitiya",
    "S-Tritiya",
    "S-Chaturthi",
    "S-Panchami",
    "S-Shashthi",
    "S-Saptami",
    "S-Ashtami",
    "S-Navami",
    "S-Dashami",
    "S-Ekadashi",
    "S-Dvadashi",
    "S-Trayodashi",
    "S-Chaturdashi",
    "Purnima",
    "K-Prathama",
    "K-Dvitiya",
    "K-Tritiya",
    "K-Chaturthi",
    "K-Panchami",
    "K-Shashthi",
    "K-Saptami",
    "K-Ashtami",
    "K-Navami",
    "K-Dashami",
    "K-Ekadashi",
    "K-Dvadashi",
    "K-Trayodashi",
    "K-Chaturdashi",
    "Amavasya",
  ],
  nakshatra: [
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
  ],
  yoga: [
    "Vishkambha",
    "Priti",
    "Ayushman",
    "Saubhagya",
    "Shobhana",
    "Atiganda",
    "Sukarma",
    "Dhriti",
    "Shula",
    "Ganda",
    "Vriddhi",
    "Dhruva",
    "Vyaghata",
    "Harshana",
    "Vajra",
    "Siddhi",
    "Vyatipata",
    "Variyan",
    "Parigha",
    "Shiva",
    "Siddha",
    "Sadhya",
    "Shubha",
    "Shukla",
    "Brahma",
    "Indra",
    "Vaidhriti",
  ],
  karana: [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Gara",
    "Vanija",
    "Vishti",
    "Kimstughna",
    "Shakuni",
    "Chatushpada",
    "Naga",
  ],
  tarabalam: [
    "Janma",
    "Sampat",
    "Vipat",
    "Kshema",
    "Pratyak",
    "Sadhana",
    "Naidhana",
    "Mitra",
    "Parama Mitra",
  ],
  panchanga_columns: [
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
  ],
  muhurtha_ui_columns: [
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
  ],
  active_doshas: [
    "Saptamastha Graha",
    "Bhrigu Shatka",
    "Ashtamastha Kuja",
    "Sankranti Dosha",
    "Asthangatha",
    "Grahanam (Eclipse)",
    "Grahana Utpata Dosha",
    "Rahu Kalam",
  ],
  active_panchakas: ["Mrityu", "Agni", "Raja", "Chora", "Roga"],
  export_columns: [
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
  ],
  sidebar_pages: [
    "Sankalpa",
    "e-Jataka",
    "e-Match",
    "e-Panchanga",
    "echakra",
    "e-Clock",
    "Profiles",
    "e-PATA",
    "e-Library",
    "PrecisionTest",
    "Help",
    "Privacy",
    "e-Install",
    "Feedback",
  ],
};

export function SettingsPage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  // బ్రౌజర్ లాంగ్వేజ్ "en-US" లాగా ఉంటే, "en" ని మాత్రమే తీసుకునేందుకు
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  const [defaultLocation, setDefaultLocation] = useState({
    city: "",
    latitude: "13.13",
    longitude: "78.8",
    timezone: "5.5",
  });

  const [landingPage, setLandingPage] = useState(() => {
    const saved = localStorage.getItem("vaiswanara_landing_page");
    return saved === "Dashboard" ? "Home" : saved || "Home";
  });

  const [rahuMode, setRahuMode] = useState(() => {
    return localStorage.getItem("rahu_mode") || "mean";
  });

  const [chartStyle, setChartStyle] = useState(() => {
    return localStorage.getItem("vaiswanara_chart_style") || "south";
  });

  const [activeTab, setActiveTab] = useState("general");
  const [prefs, setPrefs] = useState(MASTER_LISTS);

  const profilesFileRef = useRef(null);
  const panchangaFileRef = useRef(null);
  const notesFileRef = useRef(null);
  const prefsFileRef = useRef(null);
  const masterFileRef = useRef(null);
  const epataFileRef = useRef(null);
  const customEventsFileRef = useRef(null);

  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [gdriveLastBackup, setGdriveLastBackup] = useState("Checking...");
  const [isGdriveLoading, setIsGdriveLoading] = useState(false);
  const tokenClientRef = useRef(null);
  const BACKUP_FILE_NAME = "e_jyotisha_profiles.json";

  useEffect(() => {
    const initializePrefs = async () => {
      let savedPrefs = JSON.parse(
        localStorage.getItem("eclock_prefs") || "null",
      );
      if (!savedPrefs || !savedPrefs.panchanga_columns || !savedPrefs.active_doshas) {
        try {
          const res = await fetch(
            `${import.meta.env.BASE_URL}static/preferences.json`,
          );
          if (res.ok) {
            const defaultData = await res.json();
            savedPrefs = { ...defaultData, ...(savedPrefs || {}) };
            localStorage.setItem("eclock_prefs", JSON.stringify(savedPrefs));
          } else {
            savedPrefs = savedPrefs || {};
          }
        } catch (e) {
          console.error("Failed to load default preferences", e);
          savedPrefs = savedPrefs || {};
        }
      }
      setPrefs(savedPrefs);
    };
    initializePrefs();

    const saved = localStorage.getItem("vaiswanara_default_location");
    if (saved) {
      setDefaultLocation(JSON.parse(saved));
    }

    let isMounted = true;
    const initGoogleAuth = async () => {
      const loadScript = (src, checkGlobal) => {
        return new Promise((resolve) => {
          if (
            window[checkGlobal] ||
            (checkGlobal === "google" && window.google?.accounts)
          ) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          document.body.appendChild(script);
        });
      };

      await Promise.all([
        loadScript("https://apis.google.com/js/api.js", "gapi"),
        loadScript("https://accounts.google.com/gsi/client", "google"),
      ]);

      if (!isMounted) return;

      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
            ],
          });
          const tokenStr = localStorage.getItem("gdrive_token_data");
          if (tokenStr) {
            try {
              const tokenData = JSON.parse(tokenStr);
              if (Date.now() < tokenData.expires_at) {
                window.gapi.client.setToken({
                  access_token: tokenData.access_token,
                });
                setGdriveConnected(true);
                checkLastBackup();
              } else {
                localStorage.removeItem("gdrive_token_data");
              }
            } catch (e) {}
          }

          tokenClientRef.current =
            window.google.accounts.oauth2.initTokenClient({
              client_id:
                "40696538208-tland4jg7uije6t2phs3h0rqh5qgsbmf.apps.googleusercontent.com",
              scope: "https://www.googleapis.com/auth/drive.file",
              callback: async (response) => {
                if (response.error !== undefined) {
                  alert("Sign in failed or cancelled");
                  return;
                }
                const tokenData = {
                  access_token: response.access_token,
                  expires_at: Date.now() + response.expires_in * 1000 - 60000,
                };
                localStorage.setItem(
                  "gdrive_token_data",
                  JSON.stringify(tokenData),
                );
                setGdriveConnected(true);
                await checkLastBackup();
              },
            });
        } catch (err) {
          console.error("GAPI Init Error:", err);
        }
      });
    };
    initGoogleAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(field, value) {
    setDefaultLocation({ ...defaultLocation, [field]: value });
  }

  function handleSaveSettings() {
    localStorage.setItem(
      "vaiswanara_default_location",
      JSON.stringify(defaultLocation),
    );
    localStorage.setItem("eclock_prefs", JSON.stringify(prefs));
    localStorage.setItem("vaiswanara_landing_page", landingPage);
    localStorage.setItem("rahu_mode", rahuMode);
    localStorage.setItem("vaiswanara_chart_style", chartStyle);
    window.dispatchEvent(new Event("vaiswanara_chart_style_changed"));
    alert(t("SettingsSaved", "Settings saved successfully!"));
  }

  // ==== Google Drive Sync Logic ====
  const getBackupFileId = async () => {
    const response = await window.gapi.client.drive.files.list({
      q: `name='${BACKUP_FILE_NAME}' and trashed=false`,
      spaces: "drive",
      fields: "files(id, modifiedTime)",
    });
    const files = response.result.files;
    return files && files.length > 0 ? files[0] : null;
  };

  const checkLastBackup = async () => {
    try {
      const file = await getBackupFileId();
      if (file && file.modifiedTime) {
        const d = new Date(file.modifiedTime);
        setGdriveLastBackup(d.toLocaleString());
        localStorage.setItem("gdrive_last_backup", d.getTime().toString());
      } else {
        setGdriveLastBackup("Never");
      }
    } catch (e) {
      const localTs = localStorage.getItem("gdrive_last_backup");
      setGdriveLastBackup(
        localTs
          ? new Date(parseInt(localTs, 10)).toLocaleString() + " (Local sync)"
          : "Unknown",
      );
    }
  };

  const handleGdriveLogin = () => {
    if (tokenClientRef.current)
      tokenClientRef.current.requestAccessToken({ prompt: "" });
  };

  const handleGdriveLogout = () => {
    const token = window.gapi.client.getToken();
    const clearLocal = () => {
      window.gapi.client.setToken("");
      localStorage.removeItem("gdrive_token_data");
      setGdriveConnected(false);
    };
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, clearLocal);
    } else {
      clearLocal();
    }
  };
  const handleGdriveBackup = async () => {
    const profilesStr = localStorage.getItem("vaiswanara_profiles");
    const epataProgressStr = localStorage.getItem("epata_progress");
    const epataBookmarksStr = localStorage.getItem("epata_bookmarks");
    const epataLastPlaylist = localStorage.getItem("epata_last_playlist") || "";
    const customEventsStr = localStorage.getItem("jyotisha_custom_events");

    const profiles = profilesStr ? JSON.parse(profilesStr) : {};
    const epataProgress = epataProgressStr ? JSON.parse(epataProgressStr) : {};
    const epataBookmarks = epataBookmarksStr ? JSON.parse(epataBookmarksStr) : {};
    const customEvents = customEventsStr ? JSON.parse(customEventsStr) : [];

    const hasProfiles = Object.keys(profiles).length > 0;
    const hasEpata =
      Object.keys(epataProgress).length > 0 ||
      Object.keys(epataBookmarks).length > 0 ||
      epataLastPlaylist !== "";
    const hasCustomEvents = customEvents.length > 0;

    if (!hasProfiles && !hasEpata && !hasCustomEvents) {
      alert("No profiles, e-PATA data, or custom events found to backup!");
      return;
    }

    setIsGdriveLoading(true);
    try {
      const exportContent = JSON.stringify({
        version: "3.0",
        exported: new Date().toISOString(),
        profiles: profiles,
        epata_progress: epataProgress,
        epata_bookmarks: epataBookmarks,
        epata_last_playlist: epataLastPlaylist,
        jyotisha_custom_events: customEvents,
      });

      const existingFile = await getBackupFileId();
      const token = window.gapi.client.getToken().access_token;
      const metadata = { name: BACKUP_FILE_NAME, mimeType: "application/json" };
      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const multipartRequestBody =
        delimiter +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        exportContent +
        close_delim;

      let url =
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
      let method = "POST";
      if (existingFile) {
        url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method: method,
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": 'multipart/related; boundary="' + boundary + '"',
        }),
        body: multipartRequestBody,
      });

      if (response.ok) {
        alert("Profiles and e-PATA data backed up to Google Drive successfully!");
        localStorage.setItem("gdrive_last_backup", Date.now().toString());
        await checkLastBackup();
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Drive Backup Failed!");
    } finally {
      setIsGdriveLoading(false);
    }
  };

  const handleGdriveRestore = async () => {
    if (
      !window.confirm(
        "Restore profiles and e-PATA progress from Google Drive? Your local profiles and e-PATA data will be merged/overwritten.",
      )
    )
      return;
    setIsGdriveLoading(true);
    try {
      const existingFile = await getBackupFileId();
      if (existingFile) {
        const response = await window.gapi.client.drive.files.get({
          fileId: existingFile.id,
          alt: "media",
        });
        const cloudData = response.result;
        const parsedData =
          typeof cloudData === "string" ? JSON.parse(cloudData) : cloudData;

        let incomingProfiles = parsedData.profiles || parsedData;
        const clean = {};
        if (incomingProfiles) {
          for (const [k, val] of Object.entries(incomingProfiles)) {
            if (typeof val === "object" && val) {
              const { tab, ...rest } = val;
              clean[k] = rest;
            }
          }
        }

        const existingProfiles = JSON.parse(
          localStorage.getItem("vaiswanara_profiles") || "{}",
        );
        localStorage.setItem(
          "vaiswanara_profiles",
          JSON.stringify({ ...existingProfiles, ...clean }),
        );

        if (parsedData.epata_progress) {
          const existingProgress = JSON.parse(
            localStorage.getItem("epata_progress") || "{}",
          );
          localStorage.setItem(
            "epata_progress",
            JSON.stringify({ ...existingProgress, ...parsedData.epata_progress }),
          );
        }
        if (parsedData.epata_bookmarks) {
          const existingBookmarks = JSON.parse(
            localStorage.getItem("epata_bookmarks") || "{}",
          );
          localStorage.setItem(
            "epata_bookmarks",
            JSON.stringify({ ...existingBookmarks, ...parsedData.epata_bookmarks }),
          );
        }
        if (parsedData.epata_last_playlist !== undefined) {
          localStorage.setItem("epata_last_playlist", parsedData.epata_last_playlist);
        }
        if (parsedData.jyotisha_custom_events) {
          const existingEvents = JSON.parse(
            localStorage.getItem("jyotisha_custom_events") || "[]"
          );
          const incomingEvents = parsedData.jyotisha_custom_events || [];
          const merged = [...existingEvents];
          incomingEvents.forEach((pe) => {
            if (!merged.some((ue) => ue.date === pe.date && ue.title.toLowerCase() === pe.title.toLowerCase())) {
              merged.push(pe);
            }
          });
          localStorage.setItem("jyotisha_custom_events", JSON.stringify(merged));
        }

        alert("Drive Restore Successful! Profiles and e-PATA progress updated.");
      } else {
        alert("No Drive backup found!");
      }
    } catch (err) {
      console.error(err);
      alert("Drive Restore Failed!");
    } finally {
      setIsGdriveLoading(false);
    }
  };

  const handleClearGlobalNotes = () => {
    const confirmBackup = window.confirm(
      "Warning: This will delete ALL saved Global Notes permanently. Please make sure you have exported/backed up your notes or tables if needed before proceeding.\n\nDo you want to continue?"
    );
    if (!confirmBackup) return;

    const finalConfirm = window.confirm(
      "Are you absolutely sure you want to delete all Global Notes? This action cannot be undone."
    );
    if (!finalConfirm) return;

    localStorage.removeItem("muhurtha_global_notes");
    alert("All Global Notes have been cleared successfully.");
  };

  // ==== Backup & Restore Logic ====
  const getTimestamp = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  };

  const triggerDownload = (content, filename) => {
    const blob = new Blob([content], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleBackupData = (storageKey, filenamePrefix) => {
    if (storageKey === "epata") {
      const epataProgress = localStorage.getItem("epata_progress");
      const epataBookmarks = localStorage.getItem("epata_bookmarks");
      const epataLastPlaylist = localStorage.getItem("epata_last_playlist");

      const hasData =
        (epataProgress && epataProgress !== "{}") ||
        (epataBookmarks && epataBookmarks !== "{}") ||
        epataLastPlaylist;

      if (!hasData) {
        alert(t("noDataToBackup", "No data found to backup!"));
        return;
      }

      const exportData = {
        epata_progress: epataProgress ? JSON.parse(epataProgress) : {},
        epata_bookmarks: epataBookmarks ? JSON.parse(epataBookmarks) : {},
        epata_last_playlist: epataLastPlaylist || "",
      };

      triggerDownload(
        JSON.stringify(exportData, null, 2),
        `${filenamePrefix}_backup_${getTimestamp()}.json`,
      );
      return;
    }

    const data = localStorage.getItem(storageKey);
    if (!data || data === "{}" || data === "[]") {
      alert(t("noDataToBackup", "No data found to backup!"));
      return;
    }
    let exportContent = data;
    if (storageKey === "vaiswanara_profiles") {
      try {
        const parsed = JSON.parse(data);
        exportContent = JSON.stringify(
          {
            version: "2.0",
            exported: new Date().toISOString(),
            profiles: parsed,
          },
          null,
          2,
        );
      } catch (e) {}
    } else {
      try {
        let parsedData = JSON.parse(data);
        if (storageKey === "eclock_prefs") {
          const locStr = localStorage.getItem("vaiswanara_default_location");
          if (locStr) {
            parsedData._default_location = JSON.parse(locStr);
            // పాత, అనవసరమైన కీలను తొలగించడం
            delete parsedData.default_location;
            delete parsedData.default_lat;
            delete parsedData.default_lon;
            delete parsedData.default_tz;
          }
        }
        exportContent = JSON.stringify(parsedData, null, 4);
      } catch (e) {}
    }
    triggerDownload(
      exportContent,
      `${filenamePrefix}_backup_${getTimestamp()}.json`,
    );
  };

  const handleRestoreData = (event, storageKey, successMsg) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (storageKey === "jyotisha_custom_events") {
          const existingEvents = JSON.parse(
            localStorage.getItem("jyotisha_custom_events") || "[]"
          );
          const incomingEvents = Array.isArray(parsed) ? parsed : (parsed.jyotisha_custom_events || []);
          const merged = [...existingEvents];
          incomingEvents.forEach((pe) => {
            if (!merged.some((ue) => ue.date === pe.date && ue.title.toLowerCase() === pe.title.toLowerCase())) {
              merged.push(pe);
            }
          });
          localStorage.setItem("jyotisha_custom_events", JSON.stringify(merged));
          alert(t("restoreSuccess", successMsg));
          event.target.value = "";
          return;
        }
        if (storageKey === "epata") {
          if (parsed.epata_progress) {
            localStorage.setItem(
              "epata_progress",
              JSON.stringify(parsed.epata_progress),
            );
          }
          if (parsed.epata_bookmarks) {
            localStorage.setItem(
              "epata_bookmarks",
              JSON.stringify(parsed.epata_bookmarks),
            );
          }
          if (parsed.epata_last_playlist !== undefined) {
            localStorage.setItem(
              "epata_last_playlist",
              parsed.epata_last_playlist,
            );
          }
          alert(t("restoreSuccess", successMsg));
          event.target.value = "";
          return;
        }

        let incoming =
          storageKey === "vaiswanara_profiles" && parsed.profiles
            ? parsed.profiles
            : parsed;
        if (storageKey === "vaiswanara_profiles") {
          const clean = {};
          for (const [k, val] of Object.entries(incoming)) {
            if (typeof val === "object" && val) {
              const { tab, ...rest } = val;
              clean[k] = rest;
            }
          }
          incoming = clean;
        } else if (storageKey === "panchanga_profiles") {
          // Check if it's a single profile export containing rows and location, or just raw array of rows
          if (parsed && (Array.isArray(parsed) || (parsed.rows && Array.isArray(parsed.rows)))) {
            const profileName = file.name.replace(/\.[^/.]+$/, "") || "Restored Table";
            incoming = {
              [profileName]: Array.isArray(parsed) ? { rows: parsed, location: {} } : parsed
            };
          }
        }
        const existingData = JSON.parse(
          localStorage.getItem(storageKey) || "{}",
        );
        const mergedData = { ...existingData, ...incoming };

        if (storageKey === "eclock_prefs" && mergedData._default_location) {
          localStorage.setItem(
            "vaiswanara_default_location",
            JSON.stringify(mergedData._default_location),
          );
          setDefaultLocation(mergedData._default_location);
          delete mergedData._default_location;
        }

        localStorage.setItem(storageKey, JSON.stringify(mergedData));

        if (storageKey === "eclock_prefs") {
          setPrefs({ ...MASTER_LISTS, ...mergedData });
        }
        alert(t("restoreSuccess", successMsg));
      } catch (err) {
        alert(t("restoreError", "Invalid JSON file. Cannot restore."));
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleMasterBackup = () => {
    const keys = [
      "eclock_prefs",
      "vaiswanara_default_location",
      "vaiswanara_profiles",
      "panchanga_profiles",
      "muhurtha_global_notes",
      "epata_progress",
      "epata_bookmarks",
      "epata_last_playlist",
      "jyotisha_custom_events",
    ];
    let masterData = {};
    let hasData = false;
    keys.forEach((key) => {
      const dataStr = localStorage.getItem(key);
      if (dataStr !== null && dataStr !== undefined && dataStr !== "{}" && dataStr !== "[]") {
        if (key === "epata_last_playlist") {
          masterData[key] = dataStr;
          hasData = true;
        } else {
          try {
            let data = JSON.parse(dataStr);
            // అనవసరమైన లొకేషన్ డేటాను ప్రిఫరెన్సుల నుండి తొలగించడం
            if (key === "eclock_prefs") {
              delete data.default_location;
              delete data.default_lat;
              delete data.default_lon;
              delete data.default_tz;
              delete data._default_location; // తాత్కాలిక ఫీల్డ్‌ను కూడా తొలగించడం
            }
            masterData[key] = data;
            hasData = true;
          } catch (e) {}
        }
      }
    });
    if (!hasData) {
      alert(t("noDataToBackup", "No data found to backup!"));
      return;
    }
    const exportObj = {
      type: "jataka_master_backup",
      version: "1.0",
      exported: new Date().toISOString(),
      data: masterData,
    };
    triggerDownload(
      JSON.stringify(exportObj, null, 4),
      `jataka_master_backup_${getTimestamp()}.json`,
    );
  };

  const handleMasterRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.type !== "jataka_master_backup" || !parsed.data) {
          alert(t("invalidMasterBackup", "Invalid Master Backup file!"));
          event.target.value = "";
          return;
        }
        if (
          !window.confirm(
            "Restore all data? Existing data will be merged/overwritten.",
          )
        ) {
          event.target.value = "";
          return;
        }
        const incomingData = parsed.data;
        const keys = [
          "eclock_prefs",
          "vaiswanara_default_location",
          "vaiswanara_profiles",
          "panchanga_profiles",
          "muhurtha_global_notes",
          "epata_progress",
          "epata_bookmarks",
          "epata_last_playlist",
          "jyotisha_custom_events",
        ];
        keys.forEach((key) => {
          if (incomingData[key] !== undefined) {
            if (key === "eclock_prefs") {
              const mergedPrefs = { ...prefs, ...incomingData[key] };
              setPrefs(mergedPrefs);
              localStorage.setItem("eclock_prefs", JSON.stringify(mergedPrefs));
            } else if (key === "vaiswanara_default_location") {
              setDefaultLocation(incomingData[key]);
              localStorage.setItem(key, JSON.stringify(incomingData[key]));
            } else if (key === "epata_last_playlist") {
              localStorage.setItem(key, incomingData[key]);
            } else if (key === "jyotisha_custom_events") {
              const existingEvents = JSON.parse(
                localStorage.getItem("jyotisha_custom_events") || "[]"
              );
              const incomingEvents = incomingData[key] || [];
              const merged = [...existingEvents];
              incomingEvents.forEach((pe) => {
                if (!merged.some((ue) => ue.date === pe.date && ue.title.toLowerCase() === pe.title.toLowerCase())) {
                  merged.push(pe);
                }
              });
              localStorage.setItem(key, JSON.stringify(merged));
            } else {
              const existingData = JSON.parse(
                localStorage.getItem(key) || "{}",
              );
              let incoming = incomingData[key];
              if (key === "vaiswanara_profiles") {
                const clean = {};
                for (const [k, val] of Object.entries(incoming)) {
                  if (typeof val === "object" && val) {
                    const { tab, ...rest } = val;
                    clean[k] = rest;
                  }
                }
                incoming = clean;
              }
              localStorage.setItem(
                key,
                JSON.stringify({ ...existingData, ...incoming }),
              );
            }
          }
        });
        alert(
          t("masterRestoreSuccess", "Master Restore completed successfully!"),
        );
      } catch (err) {
        alert(t("restoreError", "Invalid JSON file. Cannot restore."));
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  const resetPreferences = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to their default values?",
      )
    ) {
      try {
        const res = await fetch(
          `${import.meta.env.BASE_URL}static/preferences.json`,
        );
        if (res.ok) {
          const defaultData = await res.json();
          setPrefs(defaultData);
          localStorage.setItem("eclock_prefs", JSON.stringify(defaultData));

          const defLoc = {
            city: defaultData.default_location || "Bengaluru",
            latitude: defaultData.default_lat || 12.9716,
            longitude: defaultData.default_lon || 77.5946,
            timezone: defaultData.default_tz || 5.5,
          };
          setDefaultLocation(defLoc);
          localStorage.setItem(
            "vaiswanara_default_location",
            JSON.stringify(defLoc),
          );

          alert("Preferences reset to defaults!");
        } else {
          throw new Error("Failed to fetch defaults");
        }
      } catch (e) {
        console.error(e);
        alert("Failed to load defaults from preferences.json");
      }
    }
  };

  const styles = {
    tabWrapper: {
      display: "flex",
      gap: "10px",
      marginBottom: "25px",
      borderBottom: "2px solid #eaeaea",
      overflowX: "auto",
      paddingBottom: "10px",
    },
    tab: {
      padding: "12px 24px",
      cursor: "pointer",
      borderRadius: "8px",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      transition: "0.3s",
      border: "none",
      fontSize: "15px",
    },
    activeTab: {
      background: "linear-gradient(135deg, #8e44ad, #732d91)",
      color: "#fff",
      boxShadow: "0 4px 15px rgba(142, 68, 173, 0.2)",
    },
    inactiveTab: { background: "#f1f2f6", color: "#555" },
    details: {
      background: "#fff",
      border: "1px solid #e2e6ea",
      borderRadius: "12px",
      marginBottom: "20px",
      padding: "10px 20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    },
    summary: {
      fontSize: "16px",
      color: "#732d91",
      fontWeight: "bold",
      cursor: "pointer",
      outline: "none",
      padding: "12px 0",
      borderBottom: "1px dashed #e2e6ea",
      marginBottom: "15px",
    },
    checkboxGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "12px",
      padding: "5px 0 20px 0",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "#f8f9fa",
      padding: "12px 14px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
      cursor: "pointer",
      transition: "0.2s",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      accentColor: "#8e44ad",
      cursor: "pointer",
      flexShrink: 0,
    },
  };

  const SECTION_COLORS = {
    // General Tab
    sidebar_pages: "#16a085", // Teal
    
    // Panchanga Tab
    panchanga_columns: "#2980b9", // Blue
    maasa: "#8e44ad", // Purple
    vaara: "#d35400", // Orange
    tithi: "#27ae60", // Green
    nakshatra: "#2c3e50", // Dark Slate
    yoga: "#e74c3c", // Red
    karana: "#7f8c8d", // Gray
    tarabalam: "#f39c12", // Gold

    // Muhurtha Tab
    muhurtha_ui_columns: "#2980b9", // Blue
    active_doshas: "#c0392b", // Crimson
    active_panchakas: "#e67e22", // Pumpkin
    export_columns: "#27ae60", // Emerald Green
  };

  const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const renderCheckboxGroup = (key, title, list) => {
    let selected = prefs[key];
    if (selected === undefined) {
      selected = MASTER_LISTS[key] || [];
    }

    const themeColor = SECTION_COLORS[key] || "#8e44ad";
    const lightBg = hexToRGBA(themeColor, 0.05);

    const handleToggle = (val) => {
      setPrefs((prev) => {
        let current = prev[key];
        if (current === undefined) {
          current = MASTER_LISTS[key] || [];
        }
        if (current.includes(val)) {
          return { ...prev, [key]: current.filter((item) => item !== val) };
        } else {
          return { ...prev, [key]: [...current, val] };
        }
      });
    };

    return (
      <details className="settings-group" style={{ ...styles.details, borderTop: `4px solid ${themeColor}` }}>
        <summary style={{ ...styles.summary, color: themeColor }}>{title}</summary>
        <div style={styles.checkboxGrid}>
          {list.map((item) => {
            const isChecked = selected.includes(item);
            return (
              <div
                key={item}
                onClick={() => handleToggle(item)}
                style={{
                  ...styles.checkboxLabel,
                  border: isChecked ? `1px solid ${themeColor}` : "1px solid #e9ecef",
                  background: isChecked ? lightBg : "#ffffff",
                  boxShadow: isChecked ? `0 2px 8px ${hexToRGBA(themeColor, 0.12)}` : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  userSelect: "none"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    borderRadius: "5px",
                    border: isChecked ? `2px solid ${themeColor}` : "2px solid #bdc3c7",
                    background: isChecked ? themeColor : "transparent",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  {isChecked && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: "11px", height: "11px" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "13.5px",
                    color: isChecked ? themeColor : "#2c3e50",
                    fontWeight: isChecked ? "700" : "600",
                    transition: "color 0.2s ease"
                  }}
                >
                  {item.replace(/_/g, " ")}
                </span>
              </div>
            );
          })}
        </div>
      </details>
    );
  };

  return (
    <main
      className="new-horo-page"
      style={{
        background: "transparent",
        minHeight: "100vh",
      }}
    >
      <style>{`
        /* Settings overrides */
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
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        @media (max-width: 768px) {
          .new-horo-page { 
            width: 100% !important; 
            padding: 10px !important; 
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        .new-horo-page .workspace {
          padding: 0 !important;
          margin: 0 !important;
          gap: 15px !important;
          width: 100% !important;
        }
        
        .new-horo-page .form-panel {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 24px !important;
          border-radius: 14px !important;
          margin-bottom: 20px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .new-horo-page h2 {
          font-weight: 600 !important;
          font-size: 18px !important;
          color: #2c3e50 !important;
          margin: 0 0 12px 0 !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding-bottom: 12px !important;
          text-align: left !important;
        }
        
        .new-horo-page select,
        .new-horo-page input {
          width: 100% !important;
          padding: 10px !important;
          border: 1px solid #dcdde1 !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          outline: none !important;
          background: #fdfefe !important;
          box-sizing: border-box !important;
          transition: all 0.2s ease !important;
        }
        .new-horo-page select:focus,
        .new-horo-page input:focus {
          border-color: #8e44ad !important;
          box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1) !important;
        }
        
        .checkbox-hover:hover {
          background: #f5f6f8 !important;
          border-color: #cbd5e1 !important;
        }
        
        details.settings-group > summary::-webkit-details-marker { display: none !important; }
        details.settings-group > summary::-moz-list-bullet { display: none !important; }
        details.settings-group > summary::marker { display: none !important; }
        details.settings-group > summary {
          list-style: none !important;
          list-style-type: none !important;
        }
        details.settings-group > summary::before { 
          content: '▸ '; 
          font-size: 14px; 
          display: inline-block; 
          transition: transform 0.2s ease; 
          margin-right: 8px; 
          color: currentColor; 
        }
        details.settings-group[open] > summary::before { 
          transform: rotate(90deg); 
        }
        
        .btn-action {
          padding: 10px 18px !important;
          font-size: 14px !important;
          font-weight: bold !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
          transition: transform 0.2s !important;
          width: auto !important;
        }
        .btn-action:active { transform: scale(0.96) !important; }
        .btn-blue { background: #3498db !important; }
        .btn-orange { background: #f39c12 !important; }
        .btn-red { background: #e74c3c !important; }
        .btn-purple { background: linear-gradient(135deg, #8e44ad, #9b59b6) !important; }
        
        /* Modern details cards style */
        .new-horo-page details.settings-group {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }
        .new-horo-page details.settings-group > summary {
          font-size: 16px !important;
          font-weight: bold !important;
          cursor: pointer !important;
          outline: none !important;
          padding: 6px 0 !important;
          border-bottom: 1px dashed #eaecee !important;
          margin-bottom: 15px !important;
        }
        .settings-tab-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
          align-items: start;
        }
        @media (min-width: 768px) {
          .settings-tab-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .settings-masonry {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .settings-masonry > * {
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>

      <section className="workspace" style={{ gridTemplateColumns: "1fr" }}>
        <div style={styles.tabWrapper}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "general"
                ? styles.activeTab
                : styles.inactiveTab),
            }}
            onClick={() => setActiveTab("general")}
          >
            {t("General", "General")}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "shudhi"
                ? styles.activeTab
                : styles.inactiveTab),
            }}
            onClick={() => setActiveTab("shudhi")}
          >
            {t("Panchanga", "Panchanga")}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "muhurtha"
                ? styles.activeTab
                : styles.inactiveTab),
            }}
            onClick={() => setActiveTab("muhurtha")}
          >
            {t("Muhurtha", "Muhurtha")}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "backup"
                ? styles.activeTab
                : styles.inactiveTab),
            }}
            onClick={() => setActiveTab("backup")}
          >
            {t("Backup & Restore", "Backup & Restore")}
          </button>
        </div>

        {activeTab === "general" && (
          <div className="settings-tab-grid">
            {/* Left Column: Dropdowns & Default Location */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* App Preferences Card */}
              <div className="form-panel" style={{ margin: 0, position: "static" }}>
                <h2>⚙️ {t("appPreferencesTitle", "App Preferences")}</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "15px",
                    marginTop: "10px"
                  }}
                >
                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" }}>
                      Language
                    </label>
                    <select
                      value={currentLanguage}
                      onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="te">Telugu</option>
                      <option value="kn">Kannada</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" }}>
                      Default Landing Page
                    </label>
                    <select
                      value={landingPage}
                      onChange={(e) => setLandingPage(e.target.value)}
                    >
                      <option value="Home">{t("Home", "Home")}</option>
                      <option value="Me">{t("Me", "Me (My Profile)")}</option>
                      <option value="Sankalpa">{t("Sankalpa", "Sankalpa")}</option>
                      <option value="e-Jataka">{t("e-Jataka", "e-Jataka")}</option>
                      <option value="e-Match">{t("e-Match", "e-Match")}</option>
                      <option value="e-Panchanga">{t("e-Panchanga", "e-Panchanga")}</option>
                      <option value="echakra">{t("Prashna", "e-Prashna")}</option>
                      <option value="e-Clock">{t("AstroClock", "e-Clock")}</option>
                      <option value="e-PATA">{t("e-PATA", "e-PATA")}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" }}>
                      Rahu Calculation Mode
                    </label>
                    <select
                      value={rahuMode}
                      onChange={(e) => setRahuMode(e.target.value)}
                    >
                      <option value="mean">{t("MeanRahuOption", "Mean Node (Recommended)")}</option>
                      <option value="true">{t("TrueRahuOption", "True Node")}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" }}>
                      Chart Render Style
                    </label>
                    <select
                      value={chartStyle}
                      onChange={(e) => setChartStyle(e.target.value)}
                    >
                      <option value="south">South Indian Chart</option>
                      <option value="north">North Indian Chart</option>
                      <option value="east">East Indian Chart</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" }}>
                      Default Ayanamsha Type
                    </label>
                    <select
                      value={prefs.ayanamsha_type || "lahiri"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPrefs({ 
                          ...prefs, 
                          ayanamsha_type: val, 
                          ayanamsha_val: val === "custom" ? (prefs.ayanamsha_val === "custom" ? "" : prefs.ayanamsha_val) : val 
                        });
                      }}
                    >
                      <option value="lahiri">Lahiri (Chitra Paksha)</option>
                      <option value="raman">Raman</option>
                      <option value="krishnamurti">Krishnamurti (KP)</option>
                      <option value="yukteshwar">Sri Yukteshwar</option>
                      <option value="true_citra">True Citra</option>
                      <option value="fagan_bradley">Fagan/Bradley</option>
                      <option value="custom">Custom (User Defined)</option>
                    </select>

                    {prefs.ayanamsha_type === "custom" && (
                      <div style={{ marginTop: "10px" }}>
                        <input
                          type="number"
                          step="any"
                          value={prefs.ayanamsha_val !== "custom" ? prefs.ayanamsha_val : ""}
                          onChange={(e) => setPrefs({ ...prefs, ayanamsha_val: e.target.value })}
                          placeholder="Custom value in degrees (e.g. 24.5)"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Default Location Card */}
              <div className="form-panel" style={{ margin: 0, position: "static" }}>
                <h2>📍 {t("defaultLocationTitle", "Default Location")}</h2>
                <p style={{ color: "#7f8c8d", fontSize: "0.85rem", margin: "0 0 15px 0" }}>
                  Set a default location so you don't have to enter it every time you generate a new horoscope.
                </p>
                <LocationAutocomplete
                  city={defaultLocation.city}
                  onLocationSelect={(locData) => {
                    setDefaultLocation({
                      ...defaultLocation,
                      city: locData.city,
                      latitude: locData.latitude,
                      longitude: locData.longitude,
                      timezone: locData.timezone,
                    });
                  }}
                />
                <details
                  style={{
                    marginTop: "15px",
                    fontSize: "14px",
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "10px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#2980b9",
                      fontWeight: "bold",
                      outline: "none",
                      listStyle: "none",
                      marginBottom: "5px",
                    }}
                  >
                    🛠️ Manual Coordinates (Lat / Lon / Tz)
                  </summary>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#636e72", fontWeight: "bold" }}>
                      Latitude
                      <input
                        required
                        inputMode="decimal"
                        value={defaultLocation.latitude}
                        onChange={(e) => updateField("latitude", e.target.value)}
                        style={{ marginTop: "4px" }}
                      />
                    </label>
                    <label style={{ fontSize: "12px", color: "#636e72", fontWeight: "bold" }}>
                      Longitude
                      <input
                        required
                        inputMode="decimal"
                        value={defaultLocation.longitude}
                        onChange={(e) => updateField("longitude", e.target.value)}
                        style={{ marginTop: "4px" }}
                      />
                    </label>
                  </div>
                  <label style={{ fontSize: "12px", color: "#636e72", fontWeight: "bold", display: "block", marginTop: "10px" }}>
                    Timezone
                    <input
                      required
                      inputMode="decimal"
                      value={defaultLocation.timezone}
                      onChange={(e) => updateField("timezone", e.target.value)}
                      style={{ marginTop: "4px" }}
                    />
                  </label>
                </details>
              </div>
            </div>

            {/* Right Column: Pages Visibility Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {renderCheckboxGroup(
                "sidebar_pages",
                "Visibility of Sidebar Pages",
                MASTER_LISTS.sidebar_pages,
              )}

              <button
                type="button"
                className="btn-action btn-purple"
                onClick={handleSaveSettings}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "20px",
                  fontSize: "15px",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(142,68,173,0.2)"
                }}
              >
                Save General Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === "shudhi" && (
          <div
            className="form-panel"
            style={{ padding: "30px", borderRadius: "16px" }}
          >
            <h2 style={{ marginBottom: "10px", color: "#2c3e50" }}>
              Panchanga Shudhi Settings
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "25px",
                lineHeight: "1.6",
                margin: 0
              }}
            >
              Select the elements you consider as <b>Good/Auspicious</b>. The selected ones will be highlighted dynamically in the main Panchanga search table.
            </p>

            <div className="settings-masonry" style={{ marginTop: "20px" }}>
              {renderCheckboxGroup(
                "panchanga_columns",
                "📊 Display Columns (Panchanga Table)",
                MASTER_LISTS.panchanga_columns,
              )}
              {renderCheckboxGroup(
                "maasa",
                "🌙 Maasa (Lunar Month)",
                MASTER_LISTS.maasa,
              )}
              {renderCheckboxGroup(
                "vaara",
                "📅 Vaara (Weekday)",
                MASTER_LISTS.vaara,
              )}
              {renderCheckboxGroup("tithi", "☀️ Tithi", MASTER_LISTS.tithi)}
              {renderCheckboxGroup(
                "nakshatra",
                "✨ Nakshatra",
                MASTER_LISTS.nakshatra,
              )}
              {renderCheckboxGroup("yoga", "💎 Yoga", MASTER_LISTS.yoga)}
              {renderCheckboxGroup("karana", "🌀 Karana", MASTER_LISTS.karana)}
              {renderCheckboxGroup(
                "tarabalam",
                "🛡️ Tarabalam",
                MASTER_LISTS.tarabalam,
              )}
            </div>

            <button
              type="button"
              className="btn-action btn-purple"
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "25px",
                fontSize: "16px",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(142,68,173,0.2)"
              }}
            >
              Save Panchanga Shudhi
            </button>
          </div>
        )}

        {activeTab === "muhurtha" && (
          <div
            className="form-panel"
            style={{ padding: "30px", borderRadius: "16px" }}
          >
            <h2 style={{ marginBottom: "10px", color: "#2c3e50" }}>
              Muhurtha Settings
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "25px",
                lineHeight: "1.6",
                margin: 0
              }}
            >
              Customize columns for Display and Exporting the Muhurtha table, and select the Mahadoshas to evaluate.
            </p>

            <div className="settings-masonry" style={{ marginTop: "20px" }}>
              {renderCheckboxGroup(
                "muhurtha_ui_columns",
                "📊 Display Columns (Muhurtha UI)",
                MASTER_LISTS.muhurtha_ui_columns,
              )}
              {renderCheckboxGroup(
                "active_doshas",
                "⚠️ Active Mahadoshas (21 Doshas)",
                [
                  "Saptamastha Graha",
                  "Shashtashta Chandra",
                  "Sagraha Chandra Dosha",
                  "Bhrigu Shatka",
                  "Ashtamastha Kuja",
                  "Gandanta (Moon)",
                  "Sankranti Dosha",
                  "Asthangatha",
                  "Bad Panchakam",
                  "Krura Muhurtha",
                  "Dagdha Tithi Dosha",
                  "Grahanam (Eclipse)",
                  "Grahana Utpata Dosha",
                  "Rahu Kalam",
                  "Yamagandam",
                  "Varjyam",
                  "Durmuhurtham",
                  "Lagna Tyajyam",
                ]
              )}
              {renderCheckboxGroup(
                "active_panchakas",
                "⚡ Active Bad Panchakas",
                MASTER_LISTS.active_panchakas,
              )}
              {renderCheckboxGroup(
                "export_columns",
                "📤 Export Columns (PDF/CSV)",
                MASTER_LISTS.export_columns,
              )}
            </div>

            <button
              type="button"
              className="btn-action btn-purple"
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "25px",
                fontSize: "16px",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(142,68,173,0.2)"
              }}
            >
              Save Muhurtha Settings
            </button>
          </div>
        )}

        {activeTab === "backup" && (
          <div
            className="form-panel"
            style={{ padding: "30px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <style>{`
              .backup-dashboard-layout {
                display: grid;
                grid-template-columns: 1fr;
                gap: 25px;
                width: 100%;
                box-sizing: border-box;
                margin-top: 15px;
              }
              @media (min-width: 992px) {
                .backup-dashboard-layout {
                  grid-template-columns: 2fr 1.2fr;
                }
              }
              .backup-modules-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
              }
              @media (min-width: 640px) {
                .backup-modules-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              .backup-card {
                background: #ffffff;
                border: 1px solid #eef2f5;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                transition: all 0.2s ease-in-out;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .backup-card:hover {
                box-shadow: 0 6px 15px rgba(0,0,0,0.05);
                transform: translateY(-2px);
              }
              .backup-card-title {
                font-weight: 700;
                color: #2c3e50;
                font-size: 0.95rem;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
              }
              .backup-card-buttons {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 12px;
              }
              .backup-card-buttons .btn-action {
                flex: 1;
                min-width: 100px;
                justify-content: center;
                font-size: 0.8rem;
                padding: 8px 12px;
              }
              .backup-right-column {
                display: flex;
                flex-direction: column;
                gap: 20px;
              }
              .settings-group-card {
                background: #ffffff;
                border: 1px solid #eef2f5;
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.02);
              }
              .settings-group-card h3 {
                margin-top: 0;
                margin-bottom: 12px;
                font-size: 1.1rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 8px;
              }
            `}</style>

            <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              Backup & Restore
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "15px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Manage your application data by exporting backups and restoring them across devices.
            </p>

            <div className="backup-dashboard-layout">
              {/* Left Column: Individual Module Backups */}
              <div className="settings-group-card" style={{ borderTop: "4px solid #16a085" }}>
                <h3 style={{ color: "#16a085" }}>
                  🧩 Individual Module Backups
                </h3>
                <p style={{ color: "#7f8c8d", fontSize: "0.85rem", marginTop: 0, marginBottom: "15px" }}>
                  Backup or restore specific modules independently.
                </p>

                <div className="backup-modules-grid">
                  {/* Card 1: Saved Profiles */}
                  <div className="backup-card">
                    <div>
                      <div className="backup-card-title">👥 Saved Profiles</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        Saved birth charts and matching profiles.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData(
                            "vaiswanara_profiles",
                            "ejataka_profiles",
                          )
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => profilesFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <input
                        type="file"
                        ref={profilesFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "vaiswanara_profiles",
                            "Profiles restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Card 2: Tables */}
                  <div className="backup-card">
                    <div>
                      <div className="backup-card-title">📅 Muhurtha Tables</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        Saved Panchanga & Muhurtha tables.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData(
                            "panchanga_profiles",
                            "muhurtha_tables",
                          )
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => panchangaFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <input
                        type="file"
                        ref={panchangaFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "panchanga_profiles",
                            "Muhurtha tables restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Card 3: Notes */}
                  <div className="backup-card" style={{ borderLeft: "3px solid #e74c3c" }}>
                    <div>
                      <div className="backup-card-title">📝 Global Notes</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        Custom notes and date reminders.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData(
                            "muhurtha_global_notes",
                            "muhurtha_notes",
                          )
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => notesFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <button
                        className="btn-action btn-red"
                        onClick={handleClearGlobalNotes}
                        style={{ flex: "1 1 100%" }}
                      >
                        🗑️ Clear Global Notes
                      </button>
                      <input
                        type="file"
                        ref={notesFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "muhurtha_global_notes",
                            "Global Notes restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Card 4: Preferences */}
                  <div className="backup-card" style={{ borderLeft: "3px solid #8e44ad" }}>
                    <div>
                      <div className="backup-card-title">⚙️ App Settings</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        App preferences & location defaults.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData("eclock_prefs", "preference")
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => prefsFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <button
                        className="btn-action btn-red"
                        onClick={resetPreferences}
                        style={{ flex: "1 1 100%" }}
                      >
                        🔄 Reset to Defaults
                      </button>
                      <input
                        type="file"
                        ref={prefsFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "eclock_prefs",
                            "Settings restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Card 5: e-PATA */}
                  <div className="backup-card">
                    <div>
                      <div className="backup-card-title">🎧 e-PATA Progress</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        Audio bookmarks and listening logs.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData("epata", "epata")
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => epataFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <input
                        type="file"
                        ref={epataFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "epata",
                            "e-PATA progress restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Card 6: Custom Events */}
                  <div className="backup-card">
                    <div>
                      <div className="backup-card-title">🔔 Custom Events</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#7f8c8d" }}>
                        User-defined reminders & custom dates.
                      </p>
                    </div>
                    <div className="backup-card-buttons">
                      <button
                        className="btn-action btn-blue"
                        onClick={() =>
                          handleBackupData(
                            "jyotisha_custom_events",
                            "jyotisha_custom_events",
                          )
                        }
                      >
                        📥 Backup
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={() => customEventsFileRef.current.click()}
                      >
                        📤 Restore
                      </button>
                      <input
                        type="file"
                        ref={customEventsFileRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={(e) =>
                          handleRestoreData(
                            e,
                            "jyotisha_custom_events",
                            "Custom events restored successfully!",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Master Actions & Cloud Backup */}
              <div className="backup-right-column">
                {/* Master Backup Card */}
                <div className="settings-group-card" style={{ borderTop: "4px solid #8e44ad" }}>
                  <h3 style={{ color: "#8e44ad" }}>
                    🔮 Master Backup & Restore
                  </h3>
                  <p style={{ color: "#7f8c8d", fontSize: "0.85rem", marginTop: 0, marginBottom: "15px" }}>
                    Backup or restore everything at once: Settings, Profiles, Tables, and Notes.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn-action btn-purple"
                      onClick={handleMasterBackup}
                      style={{ flex: 1, padding: "10px 15px", fontSize: "14px", justifyContent: "center" }}
                    >
                      📥 Master Backup
                    </button>
                    <button
                      className="btn-action"
                      style={{
                        background: "#d35400",
                        padding: "10px 15px",
                        fontSize: "14px",
                        color: "#fff",
                        flex: 1,
                        justifyContent: "center",
                      }}
                      onClick={() => masterFileRef.current.click()}
                    >
                      📤 Master Restore
                    </button>
                    <input
                      type="file"
                      ref={masterFileRef}
                      style={{ display: "none" }}
                      accept=".json"
                      onChange={handleMasterRestore}
                    />
                  </div>
                </div>

                {/* Cloud Sync Card */}
                <div className="settings-group-card" style={{ borderTop: "4px solid #2980b9" }}>
                  <h3 style={{ color: "#2980b9" }}>
                    ☁️ Cloud Sync (Google Drive)
                  </h3>
                  <p style={{ color: "#7f8c8d", fontSize: "0.85rem", marginTop: 0, marginBottom: "15px" }}>
                    Securely backup and restore profiles and progress directly on your drive.
                  </p>

                  {!gdriveConnected ? (
                    <button
                      className="btn-action"
                      style={{
                        background: "#4285f4",
                        padding: "12px 20px",
                        fontSize: "15px",
                        width: "100%",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                      onClick={handleGdriveLogin}
                    >
                      🔒 Sign in with Google
                    </button>
                  ) : (
                    <div>
                      <div
                        style={{
                          background: "#f4f9fd",
                          border: "1px solid #d6eaf8",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "13px",
                              color: "#2c3e50",
                            }}
                          >
                            Status: <strong style={{ color: "#27ae60" }}>Connected</strong>
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "#7f8c8d",
                            }}
                          >
                            Last: <strong>{gdriveLastBackup}</strong>
                          </p>
                        </div>
                        <button
                          onClick={handleGdriveLogout}
                          style={{
                            background: "transparent",
                            border: "1px solid #e74c3c",
                            color: "#e74c3c",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                      <div
                        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                      >
                        <button
                          className="btn-action btn-blue"
                          onClick={handleGdriveBackup}
                          disabled={isGdriveLoading}
                          style={{ padding: "10px 15px", fontSize: "13.5px", justifyContent: "center" }}
                        >
                          {isGdriveLoading
                            ? "⏳ Processing..."
                            : "📥 Drive Backup"}
                        </button>
                        <button
                          className="btn-action btn-orange"
                          onClick={handleGdriveRestore}
                          disabled={isGdriveLoading}
                          style={{ padding: "10px 15px", fontSize: "13.5px", justifyContent: "center" }}
                        >
                          {isGdriveLoading
                            ? "⏳ Processing..."
                            : "📤 Drive Restore"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
        <span
          onClick={() => onNavigate("Admin")}
          style={{ marginLeft: "8px", cursor: "default", userSelect: "none" }}
        >
          🙏
        </span>
      </footer>
    </main>
  );
}
