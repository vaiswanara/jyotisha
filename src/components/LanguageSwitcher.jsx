import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  // i18n.language ద్వారా ప్రస్తుత భాష ఎంపిక అవుతుంది (e.g., 'en', 'te', 'kn')
  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  return (
    <select value={currentLang} onChange={changeLanguage} className="lang-switcher">
      <option value="en">English</option>
      <option value="te">తెలుగు</option>
      <option value="kn">ಕನ್ನಡ</option>
    </select>
  );
};

export default LanguageSwitcher;