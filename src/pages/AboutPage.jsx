import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "te", label: "తెలుగు" },
  { key: "kn", label: "ಕನ್ನಡ" },
];

const CONTENT = {
  en: {
    heroTitle: "Ancient Jyotisha, shaped for modern learners",
    heroText:
      "e-JYOTISHA brings traditional Vedic astrology calculations into a simple, respectful, and easy-to-use learning platform.",
    purposeTitle: "Our Purpose",
    purpose:
      "This app is created for students, practitioners, and sincere learners who want reliable astrological tools without the friction of outdated software. It helps you study charts, Panchanga, Muhurtha, compatibility, Sankalpa, and planetary movements in one place.",
    promiseTitle: "What We Care About",
    promise:
      "We focus on clarity, traditional calculation methods, practical usability, and privacy-conscious design. Birth details and profiles are intended to remain on your device, while calculations are presented in a format that is readable and useful.",
    featureTitle: "Core Tools",
    features: [
      {
        title: "e-Jataka",
        text: "Generate birth charts, divisional charts, Vimshottari Dasha, Shadabala, Ashtakavarga, and other classical outputs.",
      },
      {
        title: "e-Match",
        text: "Review marriage compatibility using the traditional Ashtakuta framework with clear score and dosha details.",
      },
      {
        title: "e-Panchanga",
        text: "View Tithi, Vaara, Nakshatra, Yoga, Karana, and useful daily Panchanga details.",
      },
      {
        title: "Muhurtha",
        text: "Find auspicious time windows by filtering important classical considerations in a practical workflow.",
      },
      {
        title: "e-Sankalpa",
        text: "Prepare daily Sankalpa text from current Panchanga details for prayer and ritual use.",
      },
      {
        title: "Astro Clock",
        text: "Observe live Lagna, Moon position, and planetary movement in a real-time astrology clock.",
      },
    ],
    values: ["Traditional methods", "Readable reports", "Local-first profiles"],
    footer:
      "This application is offered for educational purposes only and is not a substitute for personal guidance from a qualified teacher or practitioner.",
  },
  te: {
    heroTitle: "ఆధునిక అభ్యాసకుల కోసం సాంప్రదాయ జ్యోతిషం",
    heroText:
      "e-JYOTISHA వేద జ్యోతిష గణనలను సరళమైన, గౌరవప్రదమైన, ఉపయోగించడానికి సులభమైన అభ్యాస వేదికగా అందిస్తుంది.",
    purposeTitle: "మా ఉద్దేశ్యం",
    purpose:
      "విశ్వసనీయమైన జ్యోతిష సాధనాలు కావాలనుకునే విద్యార్థులు, అభ్యాసకులు, నిజమైన జిజ్ఞాసువుల కోసం ఈ యాప్ రూపొందించబడింది. జాతకం, పంచాంగం, ముహూర్తం, వివాహ పొంతన, సంకల్పం, గ్రహ చలనాలను ఒకే చోట అధ్యయనం చేయడానికి ఇది సహాయపడుతుంది.",
    promiseTitle: "మేము ప్రాధాన్యం ఇచ్చేవి",
    promise:
      "స్పష్టత, సాంప్రదాయ గణన పద్ధతులు, ఉపయోగకరమైన రూపకల్పన, గోప్యతకు అనుకూలమైన విధానం మా ప్రధాన దృష్టి. జనన వివరాలు మరియు ప్రొఫైళ్లు మీ పరికరంలోనే ఉండేలా ఉద్దేశించబడ్డాయి; గణనలు చదవడానికి సులభమైన రూపంలో చూపబడతాయి.",
    featureTitle: "ప్రధాన సాధనాలు",
    features: [
      {
        title: "ఈ-జాతకం",
        text: "జనన చక్రాలు, విభాగ చక్రాలు, వింశోత్తరి దశ, షడ్బలం, అష్టకవర్గం వంటి సాంప్రదాయ వివరాలను రూపొందించండి.",
      },
      {
        title: "ఈ-పొంతన",
        text: "సాంప్రదాయ అష్టకూట విధానంతో వివాహ పొంతనను స్కోరు మరియు దోష వివరాలతో పరిశీలించండి.",
      },
      {
        title: "ఈ-పంచాంగం",
        text: "తిథి, వారం, నక్షత్రం, యోగం, కరణం మరియు రోజువారీ పంచాంగ వివరాలను చూడండి.",
      },
      {
        title: "ముహూర్తం",
        text: "ప్రయోజనకరమైన విధానంలో ముఖ్యమైన సాంప్రదాయ అంశాలను పరిశీలించి శుభ సమయాలను కనుగొనండి.",
      },
      {
        title: "ఈ-సంకల్పం",
        text: "ప్రస్తుత పంచాంగ వివరాల ఆధారంగా పూజ మరియు నిత్యకర్మల కోసం సంకల్ప పాఠాన్ని సిద్ధం చేయండి.",
      },
      {
        title: "ఆస్ట్రో క్లాక్",
        text: "ప్రస్తుత లగ్నం, చంద్ర స్థానం, గ్రహ చలనాలను ప్రత్యక్ష జ్యోతిష గడియారంలో గమనించండి.",
      },
    ],
    values: ["సాంప్రదాయ పద్ధతులు", "సులభమైన నివేదికలు", "స్థానిక ప్రొఫైళ్లు"],
    footer:
      "ఈ అప్లికేషన్ విద్యాపరమైన ఉపయోగం కోసం మాత్రమే. అర్హత కలిగిన గురువు లేదా నిపుణుని వ్యక్తిగత మార్గదర్శకానికి ఇది ప్రత్యామ్నాయం కాదు.",
  },
  kn: {
    heroTitle: "ಆಧುನಿಕ ಕಲಿಯುವವರಿಗಾಗಿ ಪಾರಂಪರಿಕ ಜ್ಯೋತಿಷ್ಯ",
    heroText:
      "e-JYOTISHA ವೇದಿಕ ಜ್ಯೋತಿಷ್ಯದ ಗಣನೆಗಳನ್ನು ಸರಳ, ಗೌರವಪೂರ್ಣ ಮತ್ತು ಬಳಸಲು ಸುಲಭವಾದ ಕಲಿಕಾ ವೇದಿಕೆಯಾಗಿ ಒದಗಿಸುತ್ತದೆ.",
    purposeTitle: "ನಮ್ಮ ಉದ್ದೇಶ",
    purpose:
      "ವಿಶ್ವಾಸಾರ್ಹ ಜ್ಯೋತಿಷ್ಯ ಸಾಧನಗಳನ್ನು ಬಯಸುವ ವಿದ್ಯಾರ್ಥಿಗಳು, ಅಭ್ಯಾಸಕರು ಮತ್ತು ನಿಜವಾದ ಕಲಿಯುವವರಿಗಾಗಿ ಈ ಆಪ್ ನಿರ್ಮಿಸಲಾಗಿದೆ. ಜಾತಕ, ಪಂಚಾಂಗ, ಮುಹೂರ್ತ, ವಿವಾಹ ಹೊಂದಾಣಿಕೆ, ಸಂಕಲ್ಪ ಮತ್ತು ಗ್ರಹ ಚಲನೆಯನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಅಧ್ಯಯನ ಮಾಡಲು ಇದು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    promiseTitle: "ನಾವು ಮಹತ್ವ ನೀಡುವವು",
    promise:
      "ಸ್ಪಷ್ಟತೆ, ಪಾರಂಪರಿಕ ಗಣನಾ ವಿಧಾನಗಳು, ಬಳಕೆಸ್ನೇಹಿ ವಿನ್ಯಾಸ ಮತ್ತು ಗೌಪ್ಯತೆಯನ್ನು ಗಮನದಲ್ಲಿಟ್ಟ ಕೆಲಸ ನಮ್ಮ ಮುಖ್ಯ ದಿಕ್ಕು. ಜನನ ವಿವರಗಳು ಮತ್ತು ಪ್ರೊಫೈಲ್‌ಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿಯೇ ಉಳಿಯುವಂತೆ ಉದ್ದೇಶಿಸಲಾಗಿದೆ; ಗಣನೆಗಳನ್ನು ಓದಲು ಸುಲಭವಾದ ರೂಪದಲ್ಲಿ ನೀಡಲಾಗುತ್ತದೆ.",
    featureTitle: "ಮುಖ್ಯ ಸಾಧನಗಳು",
    features: [
      {
        title: "ಇ-ಜಾತಕ",
        text: "ಜನನ ಚಕ್ರಗಳು, ವಿಭಾಗ ಚಕ್ರಗಳು, ವಿಂಶೋತ್ತರಿ ದಶಾ, ಷಡ್ಬಲ, ಅಷ್ಟಕವರ್ಗ ಮುಂತಾದ ಪಾರಂಪರಿಕ ವಿವರಗಳನ್ನು ರಚಿಸಿ.",
      },
      {
        title: "ಇ-ಹೊಂದಾಣಿಕೆ",
        text: "ಪಾರಂಪರಿಕ ಅಷ್ಟಕೂಟ ವಿಧಾನದಿಂದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆಯನ್ನು ಅಂಕ ಮತ್ತು ದೋಷ ವಿವರಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.",
      },
      {
        title: "ಇ-ಪಂಚಾಂಗ",
        text: "ತಿಥಿ, ವಾರ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ ಮತ್ತು ದಿನನಿತ್ಯದ ಪಂಚಾಂಗ ವಿವರಗಳನ್ನು ನೋಡಿ.",
      },
      {
        title: "ಮುಹೂರ್ತ",
        text: "ಪ್ರಯೋಗಾತ್ಮಕ ವಿಧಾನದಲ್ಲಿ ಪ್ರಮುಖ ಪಾರಂಪರಿಕ ಅಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಶುಭ ಸಮಯಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
      },
      {
        title: "ಇ-ಸಂಕಲ್ಪ",
        text: "ಪ್ರಸ್ತುತ ಪಂಚಾಂಗ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಪೂಜೆ ಮತ್ತು ನಿತ್ಯಕರ್ಮಗಳಿಗಾಗಿ ಸಂಕಲ್ಪ ಪಠ್ಯವನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
      },
      {
        title: "ಆಸ್ಟ್ರೋ ಕ್ಲಾಕ್",
        text: "ಪ್ರಸ್ತುತ ಲಗ್ನ, ಚಂದ್ರ ಸ್ಥಿತಿ ಮತ್ತು ಗ್ರಹ ಚಲನೆಯನ್ನು ನೇರ ಜ್ಯೋತಿಷ್ಯ ಗಡಿಯಾರದಲ್ಲಿ ಗಮನಿಸಿ.",
      },
    ],
    values: ["ಪಾರಂಪರಿಕ ವಿಧಾನಗಳು", "ಓದಲು ಸುಲಭ ವರದಿಗಳು", "ಸ್ಥಳೀಯ ಪ್ರೊಫೈಲ್‌ಗಳು"],
    footer:
      "ಈ ಅಪ್ಲಿಕೇಶನ್ ಶಿಕ್ಷಣ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ. ಅರ್ಹ ಗುರು ಅಥವಾ ನಿಪುಣರ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಇದು ಪರ್ಯಾಯವಲ್ಲ.",
  },
};

export function AboutPage({ logoUrl }) {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(
    i18n.language?.split("-")[0] || "en",
  );

  useEffect(() => {
    const current = i18n.language?.split("-")[0] || "en";
    setActiveLang(CONTENT[current] ? current : "en");
  }, [i18n.language]);

  const copy = CONTENT[activeLang] || CONTENT.en;

  return (
    <main className="page about-page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("About", "About")}
        eyebrow="e-JYOTISHA"
      />

      <style>{`
        .about-page {
          padding-top: env(safe-area-inset-top);
        }
        .about-page {
          max-width: 1180px;
          width: 100%;
        }

        .about-shell {
          display: grid;
          gap: 1rem;
        }

        .about-hero,
        .about-panel,
        .about-feature,
        .about-note {
          background: rgba(255, 253, 248, 0.9);
          border: 1px solid rgba(122, 83, 48, 0.16);
          border-radius: 8px;
          box-shadow: 0 18px 45px rgba(63, 43, 24, 0.08);
        }

        .about-hero {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: minmax(0, 1fr) auto;
          overflow: hidden;
          padding: 1.5rem;
          position: relative;
        }

        .about-hero::before {
          background: linear-gradient(180deg, #8a3b24, #d6b99d);
          content: "";
          inset: 0 auto 0 0;
          position: absolute;
          width: 5px;
        }

        .about-hero h1 {
          color: #2d2419;
          font-size: clamp(1.85rem, 4vw, 3.1rem);
          max-width: 820px;
        }

        .about-hero p {
          color: #6b6255;
          font-size: 1.04rem;
          margin-bottom: 0;
          max-width: 760px;
        }

        .about-tabs {
          align-self: start;
          background: #f8f1e8;
          border: 1px solid #eadfce;
          border-radius: 8px;
          display: inline-flex;
          gap: 0.3rem;
          padding: 0.3rem;
        }

        .about-tab {
          background: transparent;
          border-radius: 6px;
          color: #6b6255;
          min-height: 38px;
          padding: 0.55rem 0.8rem;
          white-space: nowrap;
          width: auto;
        }

        .about-tab.active {
          background: #8a3b24;
          color: #fffaf2;
          box-shadow: 0 8px 18px rgba(138, 59, 36, 0.18);
        }

        .about-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
        }

        .about-panel {
          padding: 1.25rem;
        }

        .about-panel h2,
        .about-tools h2 {
          color: #7a3a27;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .about-panel p {
          color: #51483d;
          line-height: 1.75;
          margin-bottom: 0;
        }

        .about-values {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-top: 1rem;
        }

        .about-value {
          background: #fff7df;
          border: 1px solid #ead79e;
          border-radius: 999px;
          color: #5f4a19;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.38rem 0.7rem;
        }

        .about-tools {
          display: grid;
          gap: 0.85rem;
        }

        .about-feature-grid {
          display: grid;
          gap: 0.85rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .about-feature {
          display: grid;
          gap: 0.6rem;
          min-width: 0;
          padding: 1rem;
        }

        .about-feature-index {
          align-items: center;
          background: #f7eadf;
          border: 1px solid #eadfce;
          border-radius: 8px;
          color: #8a3b24;
          display: inline-flex;
          font-size: 0.8rem;
          font-weight: 900;
          height: 34px;
          justify-content: center;
          width: 34px;
        }

        .about-feature h3 {
          color: #2d2419;
          font-size: 1rem;
          margin: 0;
        }

        .about-feature p {
          color: #6b6255;
          font-size: 0.92rem;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .about-note {
          color: #6b6255;
          font-size: 0.9rem;
          margin-bottom: 0;
          padding: 1rem 1.25rem;
          text-align: center;
        }

        @media (max-width: 900px) {
          .about-hero,
          .about-grid,
          .about-feature-grid {
            grid-template-columns: 1fr;
          }

          .about-tabs {
            grid-row: 1;
            justify-self: center;
            max-width: 100%;
            overflow-x: auto;
          }
        }

        @media (max-width: 560px) {
          .about-hero,
          .about-panel,
          .about-feature,
          .about-note {
            padding: 1rem;
          }

          .about-hero h1 {
            font-size: 1.55rem;
          }

          .about-tab {
            min-height: 36px;
            padding: 0.48rem 0.65rem;
          }
        }
      `}</style>

      <section className="about-shell">
        <div className="about-hero">
          <div>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroText}</p>
          </div>

          <div className="about-tabs" aria-label="About language">
            {LANGUAGES.map((language) => (
              <button
                className={`about-tab ${
                  activeLang === language.key ? "active" : ""
                }`}
                key={language.key}
                onClick={() => setActiveLang(language.key)}
                type="button"
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>

        <div className="about-grid">
          <article className="about-panel">
            <h2>{copy.purposeTitle}</h2>
            <p>{copy.purpose}</p>
          </article>

          <article className="about-panel">
            <h2>{copy.promiseTitle}</h2>
            <p>{copy.promise}</p>
            <div className="about-values">
              {copy.values.map((value) => (
                <span className="about-value" key={value}>
                  {value}
                </span>
              ))}
            </div>
          </article>
        </div>

        <section className="about-tools" aria-labelledby="about-tools-title">
          <h2 id="about-tools-title">{copy.featureTitle}</h2>
          <div className="about-feature-grid">
            {copy.features.map((feature, index) => (
              <article className="about-feature" key={feature.title}>
                <span className="about-feature-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <p className="about-note">{copy.footer}</p>
      </section>
    </main>
  );
}
