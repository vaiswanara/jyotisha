import React from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

const FAQ_CONTENT = {
  en: {
    title: "User Guide & FAQ",
    subtitle: "Learn how to use e-JYOTISHA effectively.",
    faqs: [
      {
        q: "1. How do I generate a Birth Chart (Horoscope)?",
        a: "Go to the <b>e-Jataka</b> page. Enter the Name, Date of Birth, Time of Birth, and Location. Then click 'Generate Horoscope'. You can also save the profile for quick access later.",
      },
      {
        q: "2. How does Marriage Compatibility (e-Match) work?",
        a: "Navigate to <b>e-Match</b>. Enter the birth details of both the Boy and the Girl (or load from saved profiles). Click 'Calculate Ashtakuta Match' to get the compatibility score, doshas, and combined charts.",
      },
      {
        q: "3. What is the Astro Clock?",
        a: "The <b>Astro Clock</b> shows the real-time planetary positions (Transits) and the current Lagna for your default location. You can use the 'Time Machine' to go forward or backward in time.",
      },
      {
        q: "4. Where is my data saved? Is it secure?",
        a: "Yes, 100% secure. All your saved profiles and generated charts are stored <b>locally on your device</b>. We do not upload your personal birth details to our servers.",
      },
      {
        q: "5. How to use Panchanga & Muhurtha?",
        a: "Go to <b>e-Panchanga</b>. By default, it shows today's Panchanga. You can search for auspicious days (like a specific Tithi or Nakshatra) using the Search button. In the 'Muhurtha' tab, you can find the best times for events.",
      },
    ],
  },
  te: {
    title: "యూజర్ గైడ్ & FAQ",
    subtitle: "e-JYOTISHA యాప్‌ను ఎలా ఉపయోగించాలో తెలుసుకోండి.",
    faqs: [
      {
        q: "1. జాతకం (Birth Chart) ఎలా వేయాలి?",
        a: "<b>ఈ-జాతకం</b> పేజీకి వెళ్లి, పేరు, పుట్టిన తేదీ, సమయం మరియు ఊరు నమోదు చేయండి. ఆ తర్వాత 'జాతక చక్రాలను గణించు' బటన్ పై క్లిక్ చేయండి. తర్వాతి అవసరాల కోసం మీరు ప్రొఫైల్‌ను సేవ్ చేసుకోవచ్చు.",
      },
      {
        q: "2. అష్టకూట వివాహ పొంతన (e-Match) ఎలా చూడాలి?",
        a: "<b>ఈ-పొంతన</b> పేజీకి వెళ్ళండి. వధూవరుల వివరాలను నమోదు చేయండి (లేదా సేవ్ చేసిన ప్రొఫైల్స్ నుండి తీసుకోండి). 'అష్టకూట పొంతన గణించు' పై క్లిక్ చేస్తే గుణమేళనం మరియు దోషాల వివరాలు వస్తాయి.",
      },
      {
        q: "3. ఆస్ట్రో క్లాక్ అంటే ఏమిటి?",
        a: "<b>ఆస్ట్రో క్లాక్</b> ప్రస్తుత సమయానికి ఆకాశంలో గ్రహాల స్థితి (గోచారం) మరియు లగ్నాన్ని చూపిస్తుంది. టైమ్ మెషిన్ (Time Machine) ఉపయోగించి మీరు సమయాన్ని ముందుకు లేదా వెనక్కి మార్చి కూడా గ్రహస్థితులను చూడవచ్చు.",
      },
      {
        q: "4. నా డేటా ఎక్కడ సేవ్ అవుతుంది? ఇది సురక్షితమేనా?",
        a: "100% సురక్షితం. మీరు సేవ్ చేసిన ప్రొఫైల్స్ అన్నీ <b>మీ ఫోన్/కంప్యూటర్ లో మాత్రమే</b> సేవ్ అవుతాయి. మేము మీ వ్యక్తిగత వివరాలను మా సర్వర్‌కు పంపము.",
      },
      {
        q: "5. పంచాంగం & ముహూర్తాలను ఎలా వాడాలి?",
        a: "<b>ఈ-పంచాంగం</b> పేజీలో ఈరోజు పంచాంగం కనిపిస్తుంది. పైన ఉన్న సెర్చ్ బటన్ ద్వారా మీకు కావలసిన తిథి లేదా నక్షత్రం ఎప్పుడు వస్తుందో వెతకవచ్చు. అలాగే ముహూర్తాల కోసం ముహూర్తం ట్యాబ్ వాడండి.",
      },
    ],
  },
  kn: {
    title: "ಬಳಕೆದಾರರ ಕೈಪಿಡಿ & FAQ",
    subtitle: "e-JYOTISHA ಆ್ಯಪ್ ಅನ್ನು ಹೇಗೆ ಬಳಸಬೇಕೆಂದು ತಿಳಿಯಿರಿ.",
    faqs: [
      {
        q: "1. ಜಾತಕವನ್ನು (Birth Chart) ಹೇಗೆ ರಚಿಸುವುದು?",
        a: "<b>ಇ-ಜಾತಕ</b> ಪುಟಕ್ಕೆ ಹೋಗಿ, ಹೆಸರು, ಜನನ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ. ನಂತರ 'ಜಾತಕ ಚಕ್ರಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ' ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ. ಮುಂದಿನ ಬಳಕೆಗಾಗಿ ನೀವು ಪ್ರೊಫೈಲ್ ಅನ್ನು ಸೇವ್ ಮಾಡಬಹುದು.",
      },
      {
        q: "2. ಅಷ್ಟಕೂಟ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ (e-Match) ಹೇಗೆ ಮಾಡುವುದು?",
        a: "<b>ಇ-ಹೊಂದಾಣಿಕೆ</b> ಪುಟಕ್ಕೆ ಹೋಗಿ. ವಧು-ವರರ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ (ಅಥವಾ ಸೇವ್ ಮಾಡಿದ ಪ್ರೊಫೈಲ್‌ಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ). 'ಅಷ್ಟಕೂಟ ಹೊಂದಾಣಿಕೆ ಲೆಕ್ಕಹಾಕಿ' ಕ್ಲಿಕ್ ಮಾಡಿದರೆ ಹೊಂದಾಣಿಕೆ ಅಂಕಗಳು ಮತ್ತು ದೋಷಗಳ ವಿವರ ಬರುತ್ತದೆ.",
      },
      {
        q: "3. ಆಸ್ಟ್ರೋ ಕ್ಲಾಕ್ (Astro Clock) ಎಂದರೇನು?",
        a: "<b>ಆಸ್ಟ್ರೋ ಕ್ಲಾಕ್</b> ಪ್ರಸ್ತುತ ಸಮಯಕ್ಕೆ ಆಕಾಶದಲ್ಲಿನ ಗ್ರಹಗಳ ಸ್ಥಿತಿ (ಗೋಚಾರ) ಮತ್ತು ಲಗ್ನವನ್ನು ತೋರಿಸುತ್ತದೆ. ಟೈಮ್ ಮೆಷಿನ್ (Time Machine) ಬಳಸಿ ನೀವು ಸಮಯವನ್ನು ಮುಂದೆ ಅಥವಾ ಹಿಂದಕ್ಕೆ ಬದಲಾಯಿಸಿ ಗ್ರಹಸ್ಥಿತಿಗಳನ್ನು ನೋಡಬಹುದು.",
      },
      {
        q: "4. ನನ್ನ ಡೇಟಾ ಎಲ್ಲಿ ಸೇವ್ ಆಗುತ್ತದೆ? ಇದು ಸುರಕ್ಷಿತವೇ?",
        a: "100% ಸುರಕ್ಷಿತ. ನೀವು ಸೇವ್ ಮಾಡಿದ ಎಲ್ಲಾ ಪ್ರೊಫೈಲ್‌ಗಳು <b>ನಿಮ್ಮ ಫೋನ್/ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಮಾತ್ರ</b> ಸೇವ್ ಆಗುತ್ತವೆ. ನಾವು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ನಮ್ಮ ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸುವುದಿಲ್ಲ.",
      },
      {
        q: "5. ಪಂಚಾಂಗ ಮತ್ತು ಮುಹೂರ್ತಗಳನ್ನು ಹೇಗೆ ಬಳಸುವುದು?",
        a: "<b>ಇ-ಪಂಚಾಂಗ</b> ಪುಟದಲ್ಲಿ ಇಂದಿನ ಪಂಚಾಂಗ ಕಾಣಿಸುತ್ತದೆ. ಮೇಲಿರುವ ಸರ್ಚ್ ಬಟನ್ ಮೂಲಕ ನಿಮಗೆ ಬೇಕಾದ ತಿಥಿ ಅಥವಾ ನಕ್ಷತ್ರ ಯಾವಾಗ ಬರುತ್ತದೆ ಎಂದು ಹುಡುಕಬಹುದು. ಹಾಗೆಯೇ ಮುಹೂರ್ತಗಳಿಗಾಗಿ ಮುಹೂರ್ತ ಟ್ಯಾಬ್ ಬಳಸಿ.",
      },
    ],
  },
};

export function HelpPage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const content = FAQ_CONTENT[lang] || FAQ_CONTENT.en;

  return (
    <main
      className="page"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={content.title}
        eyebrow="e-JYOTISHA"
        subtitle={content.subtitle}
      />
      <section
        style={{
          padding: "20px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
          flex: 1,
          display: "block",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="form-panel"
          style={{ position: "static", width: "100%", boxSizing: "border-box" }}
        >
          <style>{`
            .faq-details {
              background: #fff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              margin-bottom: 15px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.02);
              overflow: hidden;
            }
            .faq-summary {
              padding: 15px 20px;
              font-size: 1.1rem;
              font-weight: bold;
              color: #8e44ad;
              cursor: pointer;
              background: #fdfefe;
              outline: none;
              list-style: none;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .faq-summary::-webkit-details-marker {
              display: none;
            }
            .faq-summary::after {
              content: '▼';
              font-size: 0.8rem;
              color: #7f8c8d;
              transition: transform 0.3s ease;
            }
            .faq-details[open] .faq-summary::after {
              transform: rotate(180deg);
            }
            .faq-content {
              padding: 15px 20px;
              border-top: 1px solid #e0e0e0;
              color: #34495e;
              line-height: 1.6;
              font-size: 1rem;
              background: #fff;
            }
          `}</style>

          {content.faqs.map((faq, index) => (
            <details className="faq-details" key={index} open={index === 0}>
              <summary className="faq-summary">{faq.q}</summary>
              <div
                className="faq-content"
                dangerouslySetInnerHTML={{ __html: faq.a }}
              ></div>
            </details>
          ))}
        </div>
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
    </main>
  );
}
