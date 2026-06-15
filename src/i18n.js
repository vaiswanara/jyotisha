import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import teTranslation from "./locales/te.json";
import knTranslation from "./locales/kn.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      te: { translation: teTranslation },
      kn: { translation: knTranslation },
    },
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

function applyFontForLanguage(lng) {
  const lang = lng?.split('-')[0] || 'en';
  document.documentElement.lang = lang; // Accessibility కోసం lang అప్డేట్ 
  
  if (lang === 'te') {
    document.body.style.fontFamily = "'Mallanna', sans-serif";
    document.body.style.fontSize = "1.15rem"; // తెలుగుకి కొంచెం పెద్ద సైజు
    document.body.style.lineHeight = "1.6"; // ఒత్తులు కవర్ అవ్వడానికి గ్యాప్
  } else if (lang === 'kn') {
    document.body.style.fontFamily = "'Noto Sans Kannada', sans-serif";
    document.body.style.fontSize = "1.1rem"; // కన్నడకు మీడియం సైజు
    document.body.style.lineHeight = "1.6";
  } else {
    document.body.style.fontFamily = "'Poppins', sans-serif";
    document.body.style.fontSize = "1rem"; // ఇంగ్లీష్ డిఫాల్ట్ సైజు
    document.body.style.lineHeight = "1.5";
  }
}

applyFontForLanguage(i18n.language);
i18n.on('languageChanged', applyFontForLanguage);

export default i18n;
