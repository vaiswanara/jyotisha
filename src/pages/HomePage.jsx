import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTicker } from "../services/astrologyApi.js";

const CONTENT = {
  en: {
    app_title: "e-JYOTISHA",
    app_subtitle: "A toolkit for Vedic Astrology Students.",
    e_jataka: "e-Jataka",
    desc_jataka:
      "Instantly generate personal birth charts (D1 & D9), planetary longitudes, and Vimshottari Dasha.",
    e_match: "e-Match",
    desc_match:
      "Comprehensive Ashtakuta compatibility check, Doshas, and Navamsha evaluation for marriage.",
    e_panchanga: "e-Panchanga",
    desc_panchanga:
      "Generate daily Panchangam, search for auspicious dates, and calculate precision Muhurthams.",
    e_prashna: "e-Prashna",
    desc_echakra:
      "Sri Prashna Chakra to find answers to your questions through traditional spinning wheel.",
    e_sankalpa: "e-Sankalpa",
    desc_quick_panchanga:
      "Instantly generate daily Nitya Sankalpam based on current time and location.",
    astro_clock: "e-Clock",
    desc_clock:
      "Live planetary wall clock showing current Lagna, Moon, and Navamsha.",
    learn_epata: "e-PATA",
    desc_epata:
      "Explore our comprehensive Vedic Astrology learning platform and courses.",
    support: "Support",
    desc_support: "Support the continuous learning journey of Vedic Astrology.",
    whats_new: "What's New",
    desc_whats_new:
      "Check out the latest features, updates, and improvements added to the app.",
    notifications: "Messages",
    desc_notifications:
      "Check your messages, notifications, and important app updates.",
    youtube_channel: "YouTube Channel",
    desc_youtube:
      "Watch our latest videos and learn more about Vedic Astrology.",
    settings: "Settings",
    desc_settings:
      "Customize global preferences, default locations, Ayanamsa, and Pan Shudhi rules.",
    help_guide: "FAQ",
    desc_help: "Learn how to use the app with our step-by-step FAQ guide.",
    disclaimer_prefix: "Disclaimer:",
    disclaimer_text:
      "This application is purely for Educational Purposes Only — Not for Commercial Use.",
    feedback: "Feedback",
    desc_feedback:
      "Share your thoughts, report issues, or suggest new features to help us improve.",
    hard_refresh: "Hard Refresh",
    desc_hard_refresh:
      "Reload the app and clear cache to fetch the latest updates.",
    e_eclipse: "e-Eclipse",
    desc_eclipse:
      "Find upcoming solar and lunar eclipses for any location, with local timings and visibility information.",
    e_library: "e-Library",
    desc_library:
      "Access digital PDF library for Vedic scriptures, spiritual, and educational resources.",
  },
  te: {
    app_title: "e-జ్యోతిషం",
    app_subtitle: "పంచాంగం, ముహూర్తం మరియు జాతక గణనల కోసం పూర్తి సాధనం.",
    e_jataka: "ఈ-జాతకం",
    desc_jataka:
      "జనన చక్రాలు (D1 & D9), గ్రహ స్ఫుటాలు మరియు వింశోత్తరి దశలను తక్షణమే రూపొందించండి.",
    e_match: "ఈ-పొంతన",
    desc_match:
      "వివాహం కోసం సాంప్రదాయ అష్టకూట పొంతన, దోషాలు మరియు నవాంశ విశ్లేషణ.",
    e_panchanga: "ఈ-పంచాంగం",
    desc_panchanga:
      "రోజువారీ పంచాంగాన్ని చూడండి, శుభ తేదీలను వెతకండి మరియు ముహూర్తాలను గణించండి.",
    e_prashna: "ఈ-ప్రశ్న",
    desc_echakra:
      "సాంప్రదాయ స్పిన్నింగ్ వీల్ ద్వారా మీ ప్రశ్నలకు సమాధానాలు కనుగొనడానికి శ్రీ ప్రశ్నా చక్రం.",
    e_sankalpa: "ఈ-సంకల్పం",
    desc_quick_panchanga:
      "ప్రస్తుత సమయం మరియు ప్రదేశం ఆధారంగా రోజువారీ నిత్య సంకల్పాన్ని తక్షణమే రూపొందించండి.",
    astro_clock: "ఈ-క్లాక్",
    desc_clock:
      "ప్రస్తుత లగ్నం, చంద్రుడు మరియు నవాంశలను చూపించే లైవ్ గ్రహ గడియారం.",
    learn_epata: "ఈ-పాఠాలు",
    desc_epata:
      "మా సమగ్ర వేద జ్యోతిష అభ్యాస వేదిక మరియు కోర్సులను అన్వేషించండి.",
    support: "సహకారం",
    desc_support: "వేద జ్యోతిష నిరంతర అభ్యాస యాత్రకు మద్దతు ఇవ్వండి.",
    whats_new: "కొత్త ఫీచర్లు",
    desc_whats_new:
      "యాప్‌లో చేర్చబడిన తాజా ఫీచర్లు, అప్‌డేట్‌లు మరియు మార్పులను చూడండి.",
    notifications: "సందేశాలు",
    desc_notifications:
      "మీ సందేశాలు, నోటిఫికేషన్లు మరియు ముఖ్యమైన యాప్ అప్‌డేట్‌లను తనిఖీ చేయండి.",
    youtube_channel: "YouTube ఛానల్",
    desc_youtube:
      "మా తాజా వీడియోలను చూడండి మరియు వేద జ్యోతిషం గురించి మరింత తెలుసుకోండి.",
    settings: "సెట్టింగ్స్",
    desc_settings:
      "గ్లోబల్ ప్రిఫరెన్సెస్, డిఫాల్ట్ లొకేషన్లు, అయనాంశ మరియు పంచాంగ శుద్ధి నియమాలను అనుకూలీకరించండి.",
    help_guide: "FAQ",
    desc_help: "తరచుగా అడిగే ప్రశ్నలు (FAQs) మరియు సహాయ సమాచారం.",
    disclaimer_prefix: "గమనిక:",
    disclaimer_text:
      "ఈ అప్లికేషన్ విద్యాపరమైన ఉపయోగం కోసం మాత్రమే — వ్యాపార నిమిత్తం కాదు.",
    feedback: "అభిప్రాయం",
    desc_feedback:
      "యాప్ మెరుగుదల కోసం మీ విలువైన అభిప్రాయాలను మరియు సూచనలను మాతో పంచుకోండి.",
    hard_refresh: "హార్డ్ రిఫ్రెష్",
    desc_hard_refresh:
      "తాజా మార్పులు మరియు అప్‌డేట్‌లను పొందడానికి యాప్‌ను రిఫ్రెష్ చేయండి.",
    e_eclipse: "ఈ-గ్రహణం",
    desc_eclipse:
      "ఏ ప్రదేశానికైనా రాబోయే సూర్య మరియు చంద్ర గ్రహణాల తేదీలు, సమయాలు మరియు దృశ్యమానత వివరాలను చూడండి.",
    e_library: "ఈ-లైబ్రరీ",
    desc_library:
      "వైదిక, శాస్త్ర, ఆధ్యాత్మిక మరియు విద్యా గ్రంథాల డిజిటల్ లైబ్రరీని సందర్శించండి.",
  },
  kn: {
    app_title: "e-ಜ್ಯೋತಿಷ",
    app_subtitle: "ಪಂಚಾಂಗ, ಮುಹೂರ್ತ ಮತ್ತು ಜಾತಕ ಗಣನೆಗಳಿಗಾಗಿ ಸಂಪೂರ್ಣ ಸಾಧನ.",
    e_jataka: "ಇ-ಜಾತಕ",
    desc_jataka:
      "ಜನನ ಚಕ್ರಗಳು (D1 & D9), ಗ್ರಹ ಸ್ಫುಟಗಳು ಮತ್ತು ವಿಂಶೋತ್ತರಿ ದಶೆಗಳನ್ನು ತಕ್ಷಣವೇ ರಚಿಸಿ.",
    e_match: "ಇ-ಹೊಂದಾಣಿಕೆ",
    desc_match:
      "ವಿವಾಹಕ್ಕಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ಅಷ್ಟಕೂಟ ಹೊಂದಾಣಿಕೆ, ದೋಷಗಳು ಮತ್ತು ನವಾಂಶ ವಿಶ್ಲೇಷಣೆ.",
    e_panchanga: "ಇ-ಪಂಚಾಂಗ",
    desc_panchanga:
      "ದೈನಂದಿನ ಪಂಚಾಂಗವನ್ನು ನೋಡಿ, ಶುಭ ದಿನಾಂಕಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಮುಹೂರ್ತಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ.",
    e_prashna: "ಇ-ಪ್ರಶ್ನೆ",
    desc_echakra:
      "ಸಾಂಪ್ರದಾಯಿಕ ತಿರುಗುವ ಚಕ್ರದ ಮೂಲಕ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳನ್ನು ಹುಡುಕಲು ಶ್ರೀ ಪ್ರಶ್ನಾ ಚಕ್ರ.",
    e_sankalpa: "ಇ-ಸಂಕಲ್ಪ",
    desc_quick_panchanga:
      "ಪ್ರಸ್ತುತ ಸಮಯ ಮತ್ತು ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ದೈನಂದಿನ ನಿತ್ಯ ಸಂಕಲ್ಪವನ್ನು ತಕ್ಷಣವೇ ರಚಿಸಿ.",
    astro_clock: "ಇ-ಕ್ಲಾಕ್",
    desc_clock:
      "ಪ್ರಸ್ತುತ ಲಗ್ನ, ಚಂದ್ರ ಮತ್ತು ನವಾಂಶಗಳನ್ನು ತೋರಿಸುವ ಲೈವ್ ಗ್ರಹ ಗಡಿಯಾರ.",
    learn_epata: "ಇ-ಪಾಠಗಳು",
    desc_epata:
      "ನಮ್ಮ ಸಮಗ್ರ ವೇದ ಜ್ಯೋತಿಷ್ಯ ಕಲಿಕಾ ವೇದಿಕೆ ಮತ್ತು ಕೋರ್ಸ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    support: "ಬೆಂಬಲ",
    desc_support: "ವೇದ ಜ್ಯೋತಿಷ್ಯದ ನಿರಂತರ ಕಲಿಕಾ ಪ್ರಯಾಣವನ್ನು ಬೆಂಬಲಿಸಿ.",
    whats_new: "ಹೊಸದೇನಿದೆ",
    desc_whats_new:
      "ಆ್ಯಪ್‌ಗೆ ಸೇರಿಸಲಾದ ಇತ್ತೀಚಿನ ಫೀಚರ್‌ಗಳು, ಅಪ್‌ಡೇಟ್‌ಗಳು ಮತ್ತು ಬದಲಾವಣೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    notifications: "ಸಂದೇಶಗಳು",
    desc_notifications:
      "ನಿಮ್ಮ ಸಂದೇಶಗಳು, ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಪ್ರಮುಖ ಅಪ್ಲಿಕೇಶನ್ ನವೀಕರಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    youtube_channel: "YouTube ಚಾನೆಲ್",
    desc_youtube:
      "ನಮ್ಮ ಇತ್ತೀಚಿನ ವೀಡಿಯೊಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ವೇದ ಜ್ಯೋತಿಷ್ಯದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ.",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    desc_settings:
      "ಗ್ಲೋಬಲ್ ಪ್ರಿಫರೆನ್ಸಸ್, ಡಿಫಾಲ್ಟ್ ಸ್ಥಳಗಳು, ಅಯನಾಂಶ ಮತ್ತು ಪಂಚಾಂಗ ಶುದ್ಧಿ ನಿಯಮಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.",
    help_guide: "FAQ",
    desc_help: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQs) ಮತ್ತು ಕಲಿಕಾ ಮಾಹಿತಿ.",
    disclaimer_prefix: "ಸೂಚನೆ:",
    disclaimer_text:
      "ಈ ಅಪ್ಲಿಕೇಶನ್ ಶಿಕ್ಷಣ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ — ವ್ಯಾಪಾರ ಉದ್ದೇಶಕ್ಕಾಗಿ ಅಲ್ಲ.",
    feedback: "ಅಭಿಪ್ರಾಯ",
    desc_feedback:
      "ಆ್ಯಪ್ ಸುಧಾರಣೆಗಾಗಿ ನಿಮ್ಮ ಅಮೂಲ್ಯವಾದ ಅನಿಸಿಕೆಗಳನ್ನು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ನಮ್ಮೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.",
    hard_refresh: "ಹಾರ್ಡ್ ರಿಫ್ರೆಶ್",
    desc_hard_refresh:
      "ಇತ್ತೀಚಿನ ಬದಲಾವಣೆಗಳನ್ನು ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಲು ಆ್ಯಪ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ.",
    e_eclipse: "ಇ-ಗ್ರಹಣ",
    desc_eclipse:
      "ಯಾವುದೇ ಸ್ಥಳಕ್ಕಾಗಿ ಮುಂಬರುವ ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರ ಗ್ರಹಣಗಳ ಮಾಹಿತಿ ಮತ್ತು ಸಮಯವನ್ನು ನೋಡಿ.",
    e_library: "ಇ-ಲೈಬ್ರರಿ",
    desc_library:
      "ವೈದಿಕ, ಧರ್ಮಶಾಸ್ತ್ರ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳ ಡಿಜಿಟಲ್ ಲೈಬ್ರರಿ ವೀಕ್ಷಿಸಿ.",
  },
};

export function HomePage({
  logoUrl,
  onNavigate,
  pushEnabled,
  pushLoading,
  onEnablePush,
  needRefresh,
  updateServiceWorker,
  isInstallable,
  isStandalone,
  isIosEligible,
  profileName,
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const copy = CONTENT[lang] || CONTENT.en;
  const showInstallBtn = (isInstallable || isIosEligible) && !isStandalone;
  const [userName, setUserName] = useState(() => {
    try {
      const meProfile = JSON.parse(
        localStorage.getItem("me_page_profile") || "null",
      );
      if (meProfile && meProfile.name) {
        return meProfile.name;
      }
      const profiles = JSON.parse(
        localStorage.getItem("vaiswanara_profiles") || "{}",
      );
      const keys = Object.keys(profiles);
      return keys.length > 0 ? profiles[keys[0]].name : "";
    } catch (e) {
      return "";
    }
  });

  const [visiblePages, setVisiblePages] = useState(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
      return prefs.sidebar_pages || null;
    } catch (e) {
      console.error("Could not load preferences", e);
    }
    return null;
  });

  const isPageVisible = (pageId) => {
    const mandatoryPages = ["Home", "Me", "e-Support", "Settings"];
    if (mandatoryPages.includes(pageId)) return true;
    if (!visiblePages) return true;
    return visiblePages.includes(pageId);
  };

  const [tickerData, setTickerData] = useState(() => {
    try {
      const cached = localStorage.getItem("vaiswanara_ticker_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.tickers)) return parsed;
      }
    } catch (_) {}
    return { speed: "normal", tickers: [] };
  });

  const fetchTickerData = async () => {
    try {
      const data = await getTicker();
      if (data && Array.isArray(data.tickers)) {
        setTickerData(data);
        localStorage.setItem("vaiswanara_ticker_cache", JSON.stringify(data));
        return;
      }
    } catch (_) {}
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}static/ticker.json?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.tickers)) {
          setTickerData(data);
          localStorage.setItem("vaiswanara_ticker_cache", JSON.stringify(data));
        }
      }
    } catch (_) {}
  };

  // Fetch ticker on mount and listen for admin save updates event
  useEffect(() => {
    fetchTickerData();

    const handleUpdateEvent = () => {
      fetchTickerData();
    };
    window.addEventListener("vaiswanara_ticker_updated", handleUpdateEvent);
    return () => {
      window.removeEventListener("vaiswanara_ticker_updated", handleUpdateEvent);
    };
  }, []);

  // Get active updates today based on IST date
  const combinedUpdates = (() => {
    const list = tickerData.tickers || [];
    if (list.length === 0) return [];
    
    // Get current date in IST (Asia/Kolkata)
    let today = "";
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      const parts = formatter.formatToParts(new Date());
      const year = parts.find(p => p.type === 'year').value;
      const month = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      today = `${year}-${month}-${day}`;
    } catch (e) {
      today = new Date().toISOString().split("T")[0];
    }

    const updates = [];
    list.forEach(entry => {
      if (!entry || !Array.isArray(entry.updates)) return;
      const start = entry.startDate || "";
      const end = entry.endDate || "";
      if (start && today < start) return;
      if (end && today > end) return;
      updates.push(...entry.updates);
    });
    return updates;
  })();

  const isTickerVisible = combinedUpdates.length > 0;
  
  // Calculate dynamic duration based on speed factor
  const tickerDuration = (() => {
    const len = combinedUpdates.length;
    const speed = tickerData.speed || "normal";
    if (speed === "fast") {
      return Math.max(10, len * 4.5);
    } else if (speed === "slow") {
      return Math.max(25, len * 12);
    } else {
      return Math.max(15, len * 7);
    }
  })();

  return (
    <main
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        .content-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          flex: 1;
        }
        .home-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        .logo-img {
          width: 130px;
          margin-bottom: 15px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border: 4px solid #fff;
        }
        .home-wrapper h1 {
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: 800;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
        }
        .home-wrapper .subtitle {
          color: #7f8c8d;
          margin-bottom: 50px;
          font-size: 1.2em;
        }
        .grid-home {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 10px;
        }
        .card-home {
          background: #fff;
          padding: 24px 15px;
          border-radius: 12px;
          text-decoration: none;
          color: #333;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 4px solid #8e44ad;
          cursor: pointer;
        }
        .card-home:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .card-home .icon {
          font-size: 53px;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }
        .card-home:hover .icon {
          transform: scale(1.1);
        }
        .card-home h2 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #2c3e50;
          font-weight: 700;
        }
        .card-home .desc {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
        @media (max-width: 800px) {
          .content-container {
            padding: 15px;
          }
        }
        @media (max-width: 600px) {
          .content-container {
            padding: 0;
            max-width: 100%;
          }
          .home-wrapper {
            padding: calc(env(safe-area-inset-top, 24px) + 70px) 0 10px 0;
            max-width: 100%;
          }
          .home-wrapper h1 {
            font-size: 1.8rem;
          }
          .home-wrapper .subtitle {
            margin-bottom: 20px;
            font-size: 1rem;
            padding: 0 10px;
          }
          .grid-home {
          grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            padding: 0;
          }
          .card-home {
            min-height: 80px;
            padding: 8px 0;
            background: transparent;
            box-shadow: none;
            border-top: none !important;
          }
          .card-home:hover {
            transform: scale(1.08);
            box-shadow: none;
          }
          .card-home .icon {
            font-size: 46px;
            margin-bottom: 6px;
          }
          .card-home:hover .icon {
            transform: scale(1.15);
          }
          .card-home h2 {
            font-size: 11px;
            letter-spacing: -0.2px;
            margin: 0;
            text-align: center;
          }
          .card-home .desc {
            display: none;
          }
          .card-home.hide-mobile {
            display: none !important;
          }
        }

        .mobile-bell-btn,
        .mobile-install-btn,
        .mobile-update-btn {
          display: none !important;
        }
        @media (max-width: 860px) {
          .mobile-bell-btn,
          .mobile-install-btn,
          .mobile-update-btn {
            display: flex !important;
          }
        }
        @keyframes spin-update {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-15deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          75% { transform: rotate(4deg); }
          85% { transform: rotate(-4deg); }
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-bar {
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #8e44ad, #6c3483);
          border-radius: 8px;
          padding: 8px 0;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(142,68,173,0.18);
        }
        .ticker-bell {
          font-size: 16px;
          margin: 0 10px 0 14px;
          flex-shrink: 0;
          line-height: 1;
        }
        .ticker-track {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .ticker-content {
          display: inline-block;
          white-space: nowrap;
          color: #fff;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }
        .ticker-content:hover {
          animation-play-state: paused;
        }
        .ticker-sep {
          margin: 0 22px;
          color: #f1c40f;
          opacity: 0.6;
          font-size: 14px;
        }
      `}</style>

      {showInstallBtn && (
        <button
          className="mobile-install-btn"
          onClick={() => onNavigate("e-Install")}
          title={t("installApp", "Install App")}
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 20px)",
            left: "20px",
            background: "none",
            border: "none",
            color: "#3498db",
            fontSize: "22px",
            width: "52px",
            height: "auto",
            minHeight: "52px",
            borderRadius: "14px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2px",
            cursor: "pointer",
            zIndex: 10,
            padding: "6px 4px",
            boxShadow: "none",
          }}
        >
          📲
          <span style={{ fontSize: "8px", fontWeight: 700, lineHeight: 1, opacity: 0.8, letterSpacing: "0.2px", whiteSpace: "nowrap" }}>
            {t("installLabel", "Install")}
          </span>
        </button>
      )}

      {needRefresh && (
        <button
          className="mobile-update-btn"
          onClick={() => updateServiceWorker(true)}
          title="Update Available"
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 20px)",
            left: showInstallBtn ? "80px" : "20px",
            background: "none",
            border: "none",
            color: "#2ecc71",
            fontSize: "22px",
            width: "52px",
            height: "auto",
            minHeight: "52px",
            borderRadius: "14px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2px",
            cursor: "pointer",
            zIndex: 10,
            padding: "6px 4px",
            boxShadow: "none",
          }}
        >
          <span style={{ display: "inline-block", animation: "spin-update 3s infinite linear" }}>🔄</span>
          <span style={{ fontSize: "8px", fontWeight: 700, lineHeight: 1, opacity: 0.85, letterSpacing: "0.2px", whiteSpace: "nowrap" }}>
            {t("updateLabel", "Update")}
          </span>
        </button>
      )}

      {!pushEnabled && (
        <button
          className="mobile-bell-btn"
          onClick={onEnablePush}
          disabled={pushLoading}
          title={t("enableAlerts", "Enable Alerts")}
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 20px)",
            right: "20px",
            background: "none",
            border: "none",
            color: "#f1c40f",
            fontSize: "22px",
            width: "52px",
            height: "auto",
            minHeight: "52px",
            borderRadius: "14px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2px",
            cursor: pushLoading ? "wait" : "pointer",
            zIndex: 10,
            padding: "6px 4px",
            boxShadow: "none",
          }}
        >
          <span style={{ display: "inline-block", animation: pushLoading ? "none" : "bell-shake 2s infinite ease-in-out" }}>
            🔔
          </span>
          <span style={{ fontSize: "8px", fontWeight: 700, lineHeight: 1, opacity: 0.85, letterSpacing: "0.2px", whiteSpace: "nowrap", color: "#8a5a00" }}>
            {t("alertsLabel", "Alerts")}
          </span>
        </button>
      )}

      <div className="content-container">
        <div className="home-wrapper">
          <img
            src={logoUrl || "logo.png"}
            alt="Logo"
            className="logo-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          {userName && (
            <h2
              style={{
                color: "#d35400",
                margin: "0 0 5px 0",
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              🙏 {userName}! Welcome to
            </h2>
          )}
          <h1>{copy.app_title}</h1>
          <p className="subtitle">{copy.app_subtitle}</p>

          {/* ── Important Updates Ticker ── */}
          {isTickerVisible && (
            <div className="ticker-bar">
              <span className="ticker-bell">🔔</span>
              <div className="ticker-track">
                <span className="ticker-content" style={{ animation: `ticker-scroll ${tickerDuration}s linear infinite` }}>
                  {/* Set 1 */}
                  {combinedUpdates.map((item, i) => (
                    <React.Fragment key={`s1-${i}`}>
                      {item}
                      <span className="ticker-sep">✦</span>
                    </React.Fragment>
                  ))}
                  {/* Set 2 (duplication for seamless loop) */}
                  {combinedUpdates.map((item, i) => (
                    <React.Fragment key={`s2-${i}`}>
                      {item}
                      <span className="ticker-sep">✦</span>
                    </React.Fragment>
                  ))}
                </span>
              </div>
            </div>
          )}

          <div className="grid-home">
            {isPageVisible("Me") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#9b59b6" }}
                onClick={() => onNavigate("Me")}
              >
                <div className="icon">👤</div>
                <h2>{profileName || t("Me", "Me").replace(/\s*\(.*?\)/, "")}</h2>
                <div className="desc">
                  {t(
                    "desc_me_page",
                    "View and manage your personal astrological profile.",
                  )}
                </div>
              </div>
            )}
            {isPageVisible("Sankalpa") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#f39c12" }}
                onClick={() => onNavigate("Sankalpa")}
              >
                <div className="icon">☀️</div>
                <h2>{copy.e_sankalpa}</h2>
                <div className="desc">{copy.desc_quick_panchanga}</div>
              </div>
            )}
            {isPageVisible("e-Jataka") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#8e44ad" }}
                onClick={() => onNavigate("e-Jataka")}
              >
                <div className="icon">📜</div>
                <h2>{copy.e_jataka}</h2>
                <div className="desc">{copy.desc_jataka}</div>
              </div>
            )}
            {isPageVisible("e-Match") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#e74c3c" }}
                onClick={() => onNavigate("e-Match")}
              >
                <div className="icon">💞</div>
                <h2>{copy.e_match}</h2>
                <div className="desc">{copy.desc_match}</div>
              </div>
            )}
            {isPageVisible("e-Panchanga") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#27ae60" }}
                onClick={() => onNavigate("e-Panchanga")}
              >
                <div className="icon">&#128467;&#65039;</div>
                <h2>{copy.e_panchanga}</h2>
                <div className="desc">{copy.desc_panchanga}</div>
              </div>
            )}
            {isPageVisible("echakra") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#f1c40f" }}
                onClick={() => onNavigate("echakra")}
              >
                <div className="icon">☸️</div>
                <h2>{copy.e_prashna}</h2>
                <div className="desc">{copy.desc_echakra}</div>
              </div>
            )}
            {isPageVisible("Profiles") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#2980b9" }}
                onClick={() => onNavigate("Profiles")}
              >
                <div className="icon">👥</div>
                <h2>{t("profiles", "e-Profiles")}</h2>
                <div className="desc">
                  {t(
                    "manageProfilesDesc",
                    "Manage your saved horoscopes, backup, and restore data here.",
                  )}
                </div>
              </div>
            )}
            {isPageVisible("e-Clock") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#f39c12" }}
                onClick={() => onNavigate("e-Clock")}
              >
                <div className="icon">&#128336;&#65039;</div>
                <h2>{copy.astro_clock}</h2>
                <div className="desc">{copy.desc_clock}</div>
              </div>
            )}
            {isPageVisible("e-PATA") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#2980b9" }}
                onClick={() => onNavigate("e-PATA")}
              >
                <div className="icon">📖</div>
                <h2>{copy.learn_epata}</h2>
                <div className="desc">{copy.desc_epata}</div>
              </div>
            )}
            {isPageVisible("e-Library") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#8e44ad" }}
                onClick={() => onNavigate("e-Library")}
              >
                <div className="icon">📚</div>
                <h2>{copy.e_library}</h2>
                <div className="desc">{copy.desc_library}</div>
              </div>
            )}
            <div
              className="card-home"
              style={{ borderTopColor: "#c0392b" }}
              onClick={() =>
                window.open("https://www.youtube.com/@epata18", "_blank")
              }
            >
              <div className="icon">&#9654;&#65039;</div>
              <h2>{copy.youtube_channel}</h2>
              <div className="desc">{copy.desc_youtube}</div>
            </div>
            {isPageVisible("e-Support") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#d35400" }}
                onClick={() => onNavigate("e-Support")}
              >
                <div className="icon">&#129309;</div>
                <h2>{copy.support}</h2>
                <div className="desc">{copy.desc_support}</div>
              </div>
            )}
            <div
              className="card-home"
              style={{ borderTopColor: "#1abc9c" }}
              onClick={() => onNavigate("changelog")}
            >
              <div className="icon">&#128227;</div>
              <h2>{copy.whats_new}</h2>
              <div className="desc">{copy.desc_whats_new}</div>
            </div>
            <div
              className="card-home"
              style={{ borderTopColor: "#1f8b4d" }}
              onClick={() => onNavigate("Messages")}
            >
              <div className="icon">&#128172;</div>
              <h2>{copy.notifications}</h2>
              <div className="desc">{copy.desc_notifications}</div>
            </div>
            {isPageVisible("Help") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#3498db" }}
                onClick={() => onNavigate("Help")}
              >
                <div className="icon">📖</div>
                <h2>{copy.help_guide}</h2>
                <div className="desc">{copy.desc_help}</div>
              </div>
            )}
            {isPageVisible("Feedback") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#e67e22" }}
                onClick={() => onNavigate("Feedback")}
              >
                <div className="icon">&#128221;</div>
                <h2>{copy.feedback}</h2>
                <div className="desc">{copy.desc_feedback}</div>
              </div>
            )}
            {isPageVisible("Settings") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#34495e" }}
                onClick={() => onNavigate("Settings")}
              >
                <div className="icon">&#9881;&#65039;</div>
                <h2>{copy.settings}</h2>
                <div className="desc">{copy.desc_settings}</div>
              </div>
            )}
            <div
              className="card-home"
              style={{ borderTopColor: "#7f8c8d" }}
              onClick={() => {
                if ("caches" in window) {
                  caches.keys().then((names) => {
                    names.forEach((name) => caches.delete(name));
                  });
                }
                window.location.reload();
              }}
            >
              <div className="icon">&#128260;</div>
              <h2>{copy.hard_refresh}</h2>
              <div className="desc">{copy.desc_hard_refresh}</div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="no-print"
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "13px",
          color: "#7f8c8d",
          borderTop: "1px solid #eee",
          marginTop: "auto",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontWeight: "bold", color: "#e74c3c" }}>
            {copy.disclaimer_prefix}
          </span>{" "}
          {copy.disclaimer_text}
        </div>
        <div>
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
        </div>
      </footer>
    </main>
  );
}
