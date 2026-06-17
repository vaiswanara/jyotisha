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
    "Papakartari Lagna",
    "Papa Lagna",
    "Saptamastha Graha",
    "Ashtamastha Graha",
    "Shashtashta Chandra",
    "Bhrigu Shatka",
    "Ashtamastha Kuja",
    "Riktha Tithi",
    "Amavasya Tithi",
    "Vishti Karana",
    "Malefic Yoga",
    "Gandanta (Moon)",
    "Gandanta (Lagna)",
    "Asthangatha",
    "Bad Panchakam",
    "Krura Muhurtha",
    "Grahanam (Eclipse)",
    "Kendra Papa",
    "Trikona Papa",
    "Kuja Dosha",
    "Udayasta Shuddhi",
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
    "e-Jataka",
    "e-Match",
    "e-Panchanga",
    "echakra",
    "e-Clock",
    "Profiles",
    "Me",
    "e-PATA",
    "Privacy",
    "e-Install",
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

    const profiles = profilesStr ? JSON.parse(profilesStr) : {};
    const epataProgress = epataProgressStr ? JSON.parse(epataProgressStr) : {};
    const epataBookmarks = epataBookmarksStr ? JSON.parse(epataBookmarksStr) : {};

    const hasProfiles = Object.keys(profiles).length > 0;
    const hasEpata =
      Object.keys(epataProgress).length > 0 ||
      Object.keys(epataBookmarks).length > 0 ||
      epataLastPlaylist !== "";

    if (!hasProfiles && !hasEpata) {
      alert("No profiles or e-PATA data found to backup!");
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

  const renderCheckboxGroup = (key, title, list) => {
    let selected = prefs[key];
    if (selected === undefined) {
      selected = MASTER_LISTS[key] || [];
    }

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
      <details className="settings-group" style={styles.details}>
        <summary style={styles.summary}>{title}</summary>
        <div style={styles.checkboxGrid}>
          {list.map((item) => (
            <label
              key={item}
              style={styles.checkboxLabel}
              className="checkbox-hover"
            >
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => handleToggle(item)}
                style={styles.checkbox}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "#2c3e50",
                  fontWeight: "600",
                }}
              >
                {item.replace(/_/g, " ")}
              </span>
            </label>
          ))}
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
        
        details.settings-group > summary::-webkit-details-marker { display: none; }
        details.settings-group > summary::before { content: '▶ '; font-size: 12px; display: inline-block; transition: 0.2s; margin-right: 8px; color: #8e44ad; }
        details.settings-group[open] > summary::before { transform: rotate(90deg); }
        
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
          color: #8e44ad !important;
          font-weight: bold !important;
          cursor: pointer !important;
          outline: none !important;
          padding: 6px 0 !important;
          border-bottom: 1px dashed #eaecee !important;
          margin-bottom: 15px !important;
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
          <>
            <div
              className="form-panel"
              style={{ marginBottom: "20px", position: "static" }}
            >
              <h2>Language</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                Select your preferred language for the application interface.
              </p>
              <select
                value={currentLanguage}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="en">English</option>
                <option value="te">Telugu</option>
                <option value="kn">Kannada</option>
              </select>
            </div>

            <div
              className="form-panel"
              style={{ marginBottom: "20px", position: "static" }}
            >
              <h2>Landing Page</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                Select which page should open by default when you launch the
                application.
              </p>
              <select
                value={landingPage}
                onChange={(e) => setLandingPage(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="Home">{t("Home", "Home")}</option>
                <option value="Me">{t("Me", "Me (My Profile)")}</option>
                <option value="Sankalpa">{t("Sankalpa", "Sankalpa")}</option>
                <option value="e-Jataka">{t("e-Jataka", "e-Jataka")}</option>
                <option value="e-Match">{t("e-Match", "e-Match")}</option>
                <option value="e-Panchanga">
                  {t("e-Panchanga", "e-Panchanga")}
                </option>
                <option value="echakra">{t("Prashna", "e-Prashna")}</option>
                <option value="e-Clock">{t("AstroClock", "e-Clock")}</option>
                <option value="e-PATA">{t("e-PATA", "e-PATA")}</option>
              </select>
            </div>

            <div
              className="form-panel"
              style={{ marginBottom: "20px", position: "static" }}
            >
              <h2>Rahu Calculation Mode</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                {t("RahuModeDesc", "Select whether to use Mean Node (traditional/average) or True Node (precise/actual) for Rahu & Ketu calculations.")}
              </p>
              <select
                value={rahuMode}
                onChange={(e) => setRahuMode(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="mean">{t("MeanRahuOption", "Mean Node (Recommended)")}</option>
                <option value="true">{t("TrueRahuOption", "True Node")}</option>
              </select>
            </div>

            <div
              className="form-panel"
              style={{ marginBottom: "20px", position: "static" }}
            >
              <h2>Chart Style</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                Choose your preferred chart rendering style (South Indian or North Indian). This style will be applied globally across the application.
              </p>
              <select
                value={chartStyle}
                onChange={(e) => {
                  setChartStyle(e.target.value);
                }}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="south">South Indian Chart</option>
                <option value="north">North Indian Chart</option>
              </select>
            </div>

            <div
              className="form-panel"
              style={{ marginBottom: "20px", position: "static" }}
            >
              <h2>Pages Visibility</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                Select the pages you want to display in the sidebar menu.
              </p>
              {renderCheckboxGroup(
                "sidebar_pages",
                "Sidebar Menu Items",
                MASTER_LISTS.sidebar_pages,
              )}
            </div>

            <div className="form-panel" style={{ position: "static" }}>
              <h2>General Settings (Default Location)</h2>
              <p
                style={{
                  color: "#857869",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                Set a default location so you don't have to enter it every time
                you generate a new horoscope.
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
                  background: "#fdfefe",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  marginBottom: "15px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#3498db",
                    fontWeight: "bold",
                    outline: "none",
                    listStyle: "none",
                    marginBottom: "5px",
                  }}
                >
                  Manual Coordinates (Lat / Lon / Tz)
                </summary>
                <div className="form-grid" style={{ marginTop: "10px" }}>
                  <label>
                    Latitude
                    <input
                      required
                      inputMode="decimal"
                      value={defaultLocation.latitude}
                      onChange={(e) => updateField("latitude", e.target.value)}
                    />
                  </label>
                  <label style={{ marginTop: "10px" }}>
                    Longitude
                    <input
                      required
                      inputMode="decimal"
                      value={defaultLocation.longitude}
                      onChange={(e) => updateField("longitude", e.target.value)}
                    />
                  </label>
                </div>
                <label style={{ marginTop: "10px", display: "block" }}>
                  Timezone
                  <input
                    required
                    inputMode="decimal"
                    value={defaultLocation.timezone}
                    onChange={(e) => updateField("timezone", e.target.value)}
                  />
                </label>
              </details>
            </div>

            <div className="form-panel" style={{ position: "static", marginBottom: "20px" }}>
              <h2>Ayanamsha</h2>
              <p style={{ color: "#857869", fontSize: "0.9rem", marginBottom: "15px" }}>
                Select the Ayanamsha to be used across all astrological calculations.
              </p>
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
                style={{ width: "100%", maxWidth: "300px" }}
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
                <div style={{ marginTop: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                    Custom Ayanamsha Value (Degrees):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={prefs.ayanamsha_val !== "custom" ? prefs.ayanamsha_val : ""}
                    onChange={(e) => setPrefs({ ...prefs, ayanamsha_val: e.target.value })}
                    placeholder="e.g., 24.5"
                    style={{ width: "100%", maxWidth: "300px", marginTop: "5px" }}
                  />
                </div>
              )}
            </div>

            {/* General Settings Save button at the end of General Tab */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "10px", marginBottom: "20px" }}>
              <button
                type="button"
                className="btn-action btn-purple"
                onClick={handleSaveSettings}
                style={{ width: "fit-content" }}
              >
                Save General Settings
              </button>
            </div>
          </>
        )}

        {activeTab === "shudhi" && (
          <div
            className="form-panel"
            style={{ padding: "30px", borderRadius: "16px" }}
          >
            <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              Panchanga Shudhi Settings
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "25px",
                lineHeight: "1.6",
              }}
            >
              Select the elements you consider as <b>Good/Auspicious</b>. The
              selected ones will be highlighted dynamically in the main
              Panchanga search table.
            </p>
            {renderCheckboxGroup(
              "panchanga_columns",
              "Display Columns (Panchanga Table)",
              MASTER_LISTS.panchanga_columns,
            )}
            {renderCheckboxGroup(
              "maasa",
              "Maasa (Lunar Month)",
              MASTER_LISTS.maasa,
            )}
            {renderCheckboxGroup(
              "vaara",
              "Vaara (Weekday)",
              MASTER_LISTS.vaara,
            )}
            {renderCheckboxGroup("tithi", "Tithi", MASTER_LISTS.tithi)}
            {renderCheckboxGroup(
              "nakshatra",
              "Nakshatra",
              MASTER_LISTS.nakshatra,
            )}
            {renderCheckboxGroup("yoga", "Yoga", MASTER_LISTS.yoga)}
            {renderCheckboxGroup("karana", "Karana", MASTER_LISTS.karana)}
            {renderCheckboxGroup(
              "tarabalam",
              "Tarabalam",
              MASTER_LISTS.tarabalam,
            )}
            <button
              type="button"
              className="btn-action btn-purple"
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "15px",
                fontSize: "16px",
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
            <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              Muhurtha Settings
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "25px",
                lineHeight: "1.6",
              }}
            >
              Customize columns for Display and Exporting the Muhurtha table,
              and select the Mahadoshas to evaluate.
            </p>
            {renderCheckboxGroup(
              "muhurtha_ui_columns",
              "Display Columns (Muhurtha UI)",
              MASTER_LISTS.muhurtha_ui_columns,
            )}
            {renderCheckboxGroup(
              "active_doshas",
              "Active Mahadoshas (21 Doshas)",
              MASTER_LISTS.active_doshas,
            )}
            {renderCheckboxGroup(
              "active_panchakas",
              "Active Bad Panchakas",
              MASTER_LISTS.active_panchakas,
            )}
            {renderCheckboxGroup(
              "export_columns",
              "Export Columns (PDF/CSV)",
              MASTER_LISTS.export_columns,
            )}
            <button
              type="button"
              className="btn-action btn-purple"
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "15px",
                fontSize: "16px",
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
            <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              Backup & Restore
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "25px",
                lineHeight: "1.6",
              }}
            >
              Manage your application data by exporting backups and restoring
              them across devices.
            </p>

            <details
              className="settings-group"
              open
              style={{
                border: "1px solid #eaecee",
                background: "#ffffff",
              }}
            >
              <summary
                style={{
                  color: "#16a085",
                  borderBottom: "1px dashed #eaecee",
                }}
              >
                Individual Module Backups (Local)
              </summary>
              <div style={{ padding: "10px 0" }}>
                <p
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    marginTop: 0,
                    marginBottom: "20px",
                  }}
                >
                  Backup or restore specific modules independently.
                </p>

                <div
                  style={{
                    marginBottom: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px dashed #eaecee",
                  }}
                >
                  <strong
                    style={{
                      color: "#2c3e50",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    1. Saved Profiles (e-Jataka & e-Match)
                  </strong>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-action btn-blue"
                      onClick={() =>
                        handleBackupData(
                          "vaiswanara_profiles",
                          "ejataka_profiles",
                        )
                      }
                    >
                      📥 Backup Profiles
                    </button>
                    <button
                      className="btn-action btn-orange"
                      onClick={() => profilesFileRef.current.click()}
                    >
                      📤 Restore Profiles
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

                <div
                  style={{
                    marginBottom: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px dashed #eaecee",
                  }}
                >
                  <strong
                    style={{
                      color: "#2c3e50",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    2. Panchanga / Muhurtha Tables
                  </strong>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-action btn-blue"
                      onClick={() =>
                        handleBackupData(
                          "panchanga_profiles",
                          "muhurtha_tables",
                        )
                      }
                    >
                      📥 Backup Tables
                    </button>
                    <button
                      className="btn-action btn-orange"
                      onClick={() => panchangaFileRef.current.click()}
                    >
                      📤 Restore Tables
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

                <div
                  style={{
                    marginBottom: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px dashed #eaecee",
                  }}
                >
                  <strong
                    style={{
                      color: "#2c3e50",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    3. Muhurtha Global Notes
                  </strong>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-action btn-blue"
                      onClick={() =>
                        handleBackupData(
                          "muhurtha_global_notes",
                          "muhurtha_notes",
                        )
                      }
                    >
                      📥 Backup Notes
                    </button>
                    <button
                      className="btn-action btn-orange"
                      onClick={() => notesFileRef.current.click()}
                    >
                      📤 Restore Notes
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

                <div>
                  <strong
                    style={{
                      color: "#2c3e50",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    4. App Settings & Preferences
                  </strong>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-action btn-blue"
                      onClick={() =>
                        handleBackupData("eclock_prefs", "preference")
                      }
                    >
                      📥 Backup Settings
                    </button>
                    <button
                      className="btn-action btn-orange"
                      onClick={() => prefsFileRef.current.click()}
                    >
                      📤 Restore Settings
                    </button>
                    <button
                      className="btn-action btn-red"
                      onClick={resetPreferences}
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

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px dashed #eaecee",
                  }}
                >
                  <strong
                    style={{
                      color: "#2c3e50",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    5. e-PATA Progress & Bookmarks
                  </strong>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-action btn-blue"
                      onClick={() =>
                        handleBackupData("epata", "epata")
                      }
                    >
                      📥 Backup e-PATA
                    </button>
                    <button
                      className="btn-action btn-orange"
                      onClick={() => epataFileRef.current.click()}
                    >
                      📤 Restore e-PATA
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
              </div>
            </details>

            <details
              className="settings-group"
              open
              style={{
                border: "1px solid #eaecee",
                background: "#ffffff",
              }}
            >
              <summary
                style={{
                  color: "#8e44ad",
                  borderBottom: "1px dashed #eaecee",
                }}
              >
                Master Backup & Restore (Local)
              </summary>
              <p style={{ color: "#555", fontSize: "14px", marginTop: 0 }}>
                Backup or restore everything at once: Settings, Profiles,
                Tables, and Notes.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <button
                  className="btn-action btn-purple"
                  onClick={handleMasterBackup}
                  style={{ padding: "12px 20px", fontSize: "16px" }}
                >
                  📥 Master Backup
                </button>
                <button
                  className="btn-action"
                  style={{
                    background: "#d35400",
                    padding: "12px 20px",
                    fontSize: "16px",
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
            </details>

            <details
              className="settings-group"
              open
              style={{
                border: "1px solid #eaecee",
                background: "#ffffff",
              }}
            >
              <summary
                style={{
                  color: "#2980b9",
                  borderBottom: "1px dashed #eaecee",
                }}
              >
                Cloud Sync (Google Drive)
              </summary>
              <div style={{ padding: "10px 0" }}>
                <p
                  style={{
                    marginTop: 0,
                    fontSize: "14px",
                    color: "#555",
                    marginBottom: "15px",
                  }}
                >
                  Securely backup and restore <b>Saved Profiles and e-PATA Progress</b>{" "}
                  directly to your Google Drive account.
                </p>

                {!gdriveConnected ? (
                  <button
                    className="btn-action"
                    style={{
                      background: "#4285f4",
                      padding: "12px 20px",
                      fontSize: "15px",
                    }}
                    onClick={handleGdriveLogin}
                  >
                    🔒 Sign in with Google
                  </button>
                ) : (
                  <div>
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #d6eaf8",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "14px",
                            color: "#2c3e50",
                          }}
                        >
                          Status:{" "}
                          <strong style={{ color: "#27ae60" }}>
                            Connected to Google Drive
                          </strong>
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#7f8c8d",
                          }}
                        >
                          Last Backup: <strong>{gdriveLastBackup}</strong>
                        </p>
                      </div>
                      <button
                        onClick={handleGdriveLogout}
                        style={{
                          background: "transparent",
                          border: "1px solid #e74c3c",
                          color: "#e74c3c",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                    <div
                      style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
                    >
                      <button
                        className="btn-action btn-blue"
                        onClick={handleGdriveBackup}
                        disabled={isGdriveLoading}
                        style={{ padding: "12px 20px", fontSize: "15px" }}
                      >
                        {isGdriveLoading
                          ? "⏳ Processing..."
                          : "📥 Backup Profiles & e-PATA to Drive"}
                      </button>
                      <button
                        className="btn-action btn-orange"
                        onClick={handleGdriveRestore}
                        disabled={isGdriveLoading}
                        style={{ padding: "12px 20px", fontSize: "15px" }}
                      >
                        {isGdriveLoading
                          ? "⏳ Processing..."
                          : "📤 Restore Profiles & e-PATA from Drive"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </details>
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
