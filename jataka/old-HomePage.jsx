import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CONTENT = {
  en: {
    app_title: "Vedic Astrology Suite",
    app_subtitle:
      "A complete toolkit for Panchangam, Muhurtham, and Horoscope generation.",
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
    astro_clock: "Astro Clock",
    desc_clock:
      "Live planetary wall clock showing current Lagna, Moon, and Navamsha.",
    learn_epata: "Learn e-PATA",
    desc_epata:
      "Explore our comprehensive Vedic Astrology learning platform and courses.",
    support: "Support",
    desc_support: "Support the continuous learning journey of Vedic Astrology.",
    whats_new: "What's New",
    desc_whats_new:
      "Check out the latest features, updates, and improvements added to the app.",
    notifications: "Notifications",
    desc_notifications:
      "Check your push subscription status and enable app update alerts.",
    youtube_channel: "YouTube Channel",
    desc_youtube:
      "Watch our latest videos and learn more about Vedic Astrology.",
    settings: "Settings",
    desc_settings:
      "Customize global preferences, default locations, Ayanamsa, and Pan Shudhi rules.",
    help_guide: "User Guide",
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
  },
  te: {
    app_title: "వేద జ్యోతిష వేదిక",
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
    astro_clock: "ఆస్ట్రో క్లాక్",
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
    notifications: "నోటిఫికేషన్లు",
    desc_notifications:
      "మీ పుష్ సబ్‌స్క్రిప్షన్ స్థితిని తనిఖీ చేయండి మరియు యాప్ అప్‌డేట్ అలర్ట్‌లను ఆన్ చేయండి.",
    youtube_channel: "YouTube ఛానల్",
    desc_youtube:
      "మా తాజా వీడియోలను చూడండి మరియు వేద జ్యోతిషం గురించి మరింత తెలుసుకోండి.",
    settings: "సెట్టింగ్స్",
    desc_settings:
      "గ్లోబల్ ప్రిఫరెన్సెస్, డిఫాల్ట్ లొకేషన్లు, అయనాంశ మరియు పంచాంగ శుద్ధి నియమాలను అనుకూలీకరించండి.",
    help_guide: "యూజర్ గైడ్",
    desc_help: "యాప్‌లోని ఫీచర్లను సులభంగా ఎలా వాడాలో తెలుసుకోండి.",
    disclaimer_prefix: "గమనిక:",
    disclaimer_text:
      "ఈ అప్లికేషన్ విద్యాపరమైన ఉపయోగం కోసం మాత్రమే — వ్యాపార నిమిత్తం కాదు.",
    feedback: "అభిప్రాయం",
    desc_feedback:
      "యాప్ మెరుగుదల కోసం మీ విలువైన అభిప్రాయాలను మరియు సూచనలను మాతో పంచుకోండి.",
    hard_refresh: "హార్డ్ రిఫ్రెష్",
    desc_hard_refresh:
      "తాజా మార్పులు మరియు అప్‌డేట్‌లను పొందడానికి యాప్‌ను రిఫ్రెష్ చేయండి.",
  },
  kn: {
    app_title: "ವೇದ ಜ್ಯೋತಿಷ್ಯ ವೇದಿಕೆ",
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
    astro_clock: "ಆಸ್ಟ್ರೋ ಕ್ಲಾಕ್",
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
    notifications: "ನೋಟಿಫಿಕೇಶನ್‌ಗಳು",
    desc_notifications:
      "ನಿಮ್ಮ ಪುಶ್ ಸಬ್‌ಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಆ್ಯಪ್ ಅಪ್‌ಡೇಟ್ ಅಲರ್ಟ್‌ಗಳನ್ನು ಆನ್ ಮಾಡಿ.",
    youtube_channel: "YouTube ಚಾನೆಲ್",
    desc_youtube:
      "ನಮ್ಮ ಇತ್ತೀಚಿನ ವೀಡಿಯೊಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ವೇದ ಜ್ಯೋತಿಷ್ಯದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ.",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    desc_settings:
      "ಗ್ಲೋಬಲ್ ಪ್ರಿಫರೆನ್ಸಸ್, ಡಿಫಾಲ್ಟ್ ಸ್ಥಳಗಳು, ಅಯನಾಂಶ ಮತ್ತು ಪಂಚಾಂಗ ಶುದ್ಧಿ ನಿಯಮಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.",
    help_guide: "ಬಳಕೆದಾರರ ಕೈಪಿಡಿ",
    desc_help: "ಆ್ಯಪ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಹೇಗೆ ಬಳಸಬೇಕೆಂದು ತಿಳಿಯಿರಿ.",
    disclaimer_prefix: "ಸೂಚನೆ:",
    disclaimer_text:
      "ಈ ಅಪ್ಲಿಕೇಶನ್ ಶಿಕ್ಷಣ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ — ವ್ಯಾಪಾರ ಉದ್ದೇಶಕ್ಕಾಗಿ ಅಲ್ಲ.",
    feedback: "ಅಭಿಪ್ರಾಯ",
    desc_feedback:
      "ಆ್ಯಪ್ ಸುಧಾರಣೆಗಾಗಿ ನಿಮ್ಮ ಅಮೂಲ್ಯವಾದ ಅನಿಸಿಕೆಗಳನ್ನು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ನಮ್ಮೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.",
    hard_refresh: "ಹಾರ್ಡ್ ರಿಫ್ರೆಶ್",
    desc_hard_refresh:
      "ಇತ್ತೀಚಿನ ಬದಲಾವಣೆಗಳನ್ನು ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಲು ಆ್ಯಪ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ.",
  },
};

export function HomePage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const copy = CONTENT[lang] || CONTENT.en;
  const [visibleMenus, setVisibleMenus] = useState([
    "jataka",
    "match",
    "panchanga",
    "echakra",
    "clock",
    "epata",
  ]);

  const [userName, setUserName] = useState(() => {
    const profiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    const keys = Object.keys(profiles);
    return keys.length > 0 ? profiles[keys[0]].name : "";
  });

  useEffect(() => {
    const profiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    const keys = Object.keys(profiles);
    if (keys.length > 0) setUserName(profiles[keys[0]].name);
    else setUserName("");
  }, []);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");

      if (
        prefs.visible_menus &&
        !prefs.visible_menus.includes("echakra") &&
        !localStorage.getItem("echakra_restored_v1")
      ) {
        prefs.visible_menus.push("echakra");
        localStorage.setItem("eclock_prefs", JSON.stringify(prefs));
        localStorage.setItem("echakra_restored_v1", "true");
      }

      if (prefs.visible_menus) {
        setVisibleMenus(prefs.visible_menus);
      }
    } catch (e) {
      console.error("Could not load preferences", e);
    }
  }, []);

  return (
    <main
      className="page"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
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
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          font-size: 44px;
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
      `}</style>

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

          <div className="grid-home">
            {visibleMenus.includes("jataka") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#8e44ad" }}
                onClick={() => onNavigate("e-Jataka")}
              >
                <div className="icon">&#128220;</div>
                <h2>{copy.e_jataka}</h2>
                <div className="desc">{copy.desc_jataka}</div>
              </div>
            )}
            {visibleMenus.includes("match") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#e74c3c" }}
                onClick={() => onNavigate("e-Match")}
              >
                <div className="icon">&#128145;</div>
                <h2>{copy.e_match}</h2>
                <div className="desc">{copy.desc_match}</div>
              </div>
            )}
            {visibleMenus.includes("panchanga") && (
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
            {visibleMenus.includes("echakra") && (
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
            {visibleMenus.includes("clock") && (
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

            {visibleMenus.includes("epata") && (
              <div
                className="card-home"
                style={{ borderTopColor: "#2980b9" }}
                onClick={() => onNavigate("e-PATA")}
              >
                <div className="icon">&#128214;</div>
                <h2>{copy.learn_epata}</h2>
                <div className="desc">{copy.desc_epata}</div>
              </div>
            )}

            <div
              className="card-home"
              style={{ borderTopColor: "#3498db" }}
              onClick={() => onNavigate("Help")}
            >
              <div className="icon">&#128214;</div>
              <h2>{copy.help_guide}</h2>
              <div className="desc">{copy.desc_help}</div>
            </div>

            <div
              className="card-home"
              style={{ borderTopColor: "#d35400" }}
              onClick={() => onNavigate("e-Support")}
            >
              <div className="icon">&#129309;</div>
              <h2>{copy.support}</h2>
              <div className="desc">{copy.desc_support}</div>
            </div>
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
              <div className="icon">&#128276;</div>
              <h2>{copy.notifications}</h2>
              <div className="desc">{copy.desc_notifications}</div>
            </div>
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
            <div
              className="card-home"
              style={{ borderTopColor: "#e67e22" }}
              onClick={() => onNavigate("Feedback")}
            >
              <div className="icon">&#128221;</div>
              <h2>{copy.feedback}</h2>
              <div className="desc">{copy.desc_feedback}</div>
            </div>
            <div
              className="card-home"
              style={{ borderTopColor: "#34495e" }}
              onClick={() => onNavigate("Settings")}
            >
              <div className="icon">&#9881;&#65039;</div>
              <h2>{copy.settings}</h2>
              <div className="desc">{copy.desc_settings}</div>
            </div>
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
