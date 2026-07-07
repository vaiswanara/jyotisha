import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_URL, API_TOKEN } from "../services/astrologyApi.js";

const SANKALPA_DICT = {
  en: {
    sri: "Sri",
    samvatsare: "Naama Samvatsare,",
    ayane: " Aayane,",
    rutou: "Rutou,",
    maase: "Maase,",
    pakshe: "Pakshe,",
    tithou: "Tithou,",
    vaasare: "Vaasare,",
    nakshatra: "Nakshatra Yuktaayaam,",
    yoga: "Yoge,",
    karana: "Karane...",
    evam: "evam guna visheshana vishishthaayaam shubha tithou...",
    uttara: "Uttara",
    dakshina: "Dakshina",
    vasantha: "Vasantha",
    greeshma: "Greeshma",
    varsha: "Varsha",
    sharad: "Sharad",
    hemanta: "Hemanta",
    shishira: "Shishira",
    adhika: "Adhika ",
    nija: "Nija ",
  },
  te: {
    sri: "శ్రీ",
    samvatsare: "నామ సంవత్సరే,",
    ayane: " ఆయనే,",
    rutou: "ఋతౌ,",
    maase: "మాసే,",
    pakshe: "పక్షే,",
    tithou: "తిథౌ,",
    vaasare: "వాసరే,",
    nakshatra: "నక్షత్ర యుక్తాయాం,",
    yoga: "యోగే,",
    karana: "కరణే...",
    evam: "ఏవం గుణ విశేషణ విశిష్ఠాయాం శుభ తిథౌ...",
    uttara: "ఉత్తర",
    dakshina: "దక్షిణ",
    vasantha: "వసంత",
    greeshma: "గ్రీష్మ",
    varsha: "వర్ష",
    sharad: "శరద్",
    hemanta: "హేమంత",
    shishira: "శిశిర",
    adhika: "అధిక ",
    nija: "నిజ ",
  },
  kn: {
    sri: "ಶ್ರೀ",
    samvatsare: "ನಾಮ ಸಂವತ್ಸರೇ,",
    ayane: " ಆಯನೇ,",
    rutou: "ಋತೌ,",
    maase: "ಮಾಸೇ,",
    pakshe: "ಪಕ್ಷೇ,",
    tithou: "ತಿಥೌ,",
    vaasare: "ವಾಸರೇ,",
    nakshatra: "ನಕ್ಷತ್ರ ಯುಕ್ತಾಯಾಂ,",
    yoga: "ಯೋಗೇ,",
    karana: "ಕರಣೇ...",
    evam: "ಏವಂ ಗುಣ ವಿಶೇಷಣ ವಿಶಿಷ್ಠಾಯಾಂ ಶುಭ ತಿಥೌ...",
    uttara: "ಉತ್ತರ",
    dakshina: "ದಕ್ಷಿಣ",
    vasantha: "ವಸಂತ",
    greeshma: "ಗ್ರೀಷ್ಮ",
    varsha: "ವರ್ಷ",
    sharad: "ಶರದ್",
    hemanta: "ಹೇಮಂತ",
    shishira: "ಶಿಶಿರ",
    adhika: "ಅಧಿಕ ",
    nija: "ನಿಜ ",
  },
  sa: {
    sri: "श्री",
    samvatsare: "नाम संवत्सरे,",
    ayane: " आयने,",
    rutou: "ऋतौ,",
    maase: "मासे,",
    pakshe: "पक्षे,",
    tithou: "तिथौ,",
    vaasare: "वासरे,",
    nakshatra: "नक्षत्र युक्तायां,",
    yoga: "योगे,",
    karana: "करणे...",
    evam: "एवं गुण विशेषण विशिष्टायां शुभ तिथौ...",
    uttara: "उत्तर",
    dakshina: "दक्षिण",
    vasantha: "वसन्त",
    greeshma: "ग्रीष्म",
    varsha: "वर्षा",
    sharad: "शरद्",
    hemanta: "हेमन्त",
    shishira: "शिशिर",
    adhika: "अधिक ",
    nija: "निज ",
  },
};

const LANG_DATA = {
  en: {
    samvatsaras: [
      "Prabhava",
      "Vibhava",
      "Shukla",
      "Pramodoota",
      "Prajotpatti",
      "Aangeerasa",
      "Sreemukha",
      "Bhaava",
      "Yuva",
      "Dhaata",
      "Eeshvara",
      "Bahudhaanya",
      "Pramaadhi",
      "Vikrama",
      "Vrisha",
      "Chitrabhaanu",
      "Svabhaanu",
      "Taarana",
      "Paarthiva",
      "Vyaya",
      "Sarvajit",
      "Sarvadhaari",
      "Virodhi",
      "Vikruti",
      "Khara",
      "Nandana",
      "Vijaya",
      "Jaya",
      "Manmatha",
      "Durmukhi",
      "Hevilambi",
      "Vilambi",
      "Vikaari",
      "Shaarvari",
      "Plava",
      "Shubhakrut",
      "Shobhakrut",
      "Krodhi",
      "Vishvaavasu",
      "Paraabhava",
      "Plavanga",
      "Keelaka",
      "Saumya",
      "Saadhaarana",
      "Virodhikrut",
      "Paridhaavi",
      "Pramaadeecha",
      "Aananda",
      "Raakshasa",
      "Nala",
      "Pingala",
      "Kaalayukti",
      "Siddhaarthi",
      "Raudri",
      "Durmati",
      "Dundubhi",
      "Rudhirodgaari",
      "Raktaakshi",
      "Krodhana",
      "Akshaya",
    ],
    maasas: {
      Chaitra: "Chaitra",
      Vaishakha: "Vaishakha",
      Jyeshtha: "Jyeshtha",
      Ashadha: "Ashadha",
      Shravana: "Shravana",
      Bhadrapada: "Bhadrapada",
      Ashwayuja: "Ashwayuja",
      Karthika: "Karthika",
      Margashira: "Margashira",
      Pausha: "Pausha",
      Magha: "Maaga",
      Maaga: "Maaga",
      Phalguna: "Phalguna",
    },
    pakshas: { Shukla: "Shukla", Krishna: "Krishna" },
    tithis: {
      Pratipath: "Pratipath",
      Dvitiya: "Dvitiya",
      Tritiya: "Tritiya",
      Chaturthi: "Chaturthi",
      Panchami: "Panchami",
      Shashthi: "Shashthi",
      Saptami: "Saptami",
      Ashtami: "Ashtami",
      Navami: "Navami",
      Dashami: "Dashami",
      Ekadashi: "Ekadashi",
      Dwadashi: "Dwadashi",
      Trayodashi: "Trayodashi",
      Chaturdashi: "Chaturdashi",
      Purnima: "Purnima",
      Amavasya: "Amavasya",
    },
    vaaras: {
      Bhaanu: "Bhaanu",
      Indu: "Indu",
      Bhauma: "Bhauma",
      Soumya: "Soumya",
      Guru: "Guru",
      Bhrugu: "Bhrugu",
      Sthira: "Sthira",
    },
    nakshatras: {
      Ashwini: "Ashwini",
      Bharani: "Bharani",
      Krittika: "Krittika",
      Rohini: "Rohini",
      Mrigashira: "Mrigashira",
      Ardra: "Ardra",
      Punarvasu: "Punarvasu",
      Pushya: "Pushya",
      Ashlesha: "Ashlesha",
      Magha: "Magha",
      "Purva Phalguni": "Purva Phalguni",
      "Uttara Phalguni": "Uttara Phalguni",
      Hasta: "Hasta",
      Chitra: "Chitra",
      Swati: "Swati",
      Vishakha: "Vishakha",
      Anuradha: "Anuradha",
      Jyeshtha: "Jyeshtha",
      Mula: "Mula",
      "Purva Ashadha": "Purva Ashadha",
      "Uttara Ashadha": "Uttara Ashadha",
      Shravana: "Shravana",
      Dhanishtha: "Dhanishtha",
      Shatabhisha: "Shatabhisha",
      "Purva Bhadrapada": "Purva Bhadrapada",
      "Uttara Bhadrapada": "Uttara Bhadrapada",
      Revati: "Revati",
    },
    yogas: {
      Vishkambha: "Vishkambha",
      Priti: "Priti",
      Ayushman: "Ayushman",
      Saubhagya: "Saubhagya",
      Shobhana: "Shobhana",
      Atiganda: "Atiganda",
      Sukarman: "Sukarman",
      Dhriti: "Dhriti",
      Shula: "Shula",
      Ganda: "Ganda",
      Vriddhi: "Vriddhi",
      Dhruva: "Dhruva",
      Vyaghata: "Vyaghata",
      Harshana: "Harshana",
      Vajra: "Vajra",
      Siddhi: "Siddhi",
      Vyatipata: "Vyatipata",
      Variyan: "Variyan",
      Parigha: "Parigha",
      Shiva: "Shiva",
      Siddha: "Siddha",
      Sadhya: "Sadhya",
      Shubha: "Shubha",
      Shukla: "Shukla",
      Brahma: "Brahma",
      Indra: "Indra",
      Vaidhriti: "Vaidhriti",
    },
    karanas: {
      Bava: "Bava",
      Balava: "Balava",
      Kaulava: "Kaulava",
      Taitila: "Taitila",
      Gara: "Gara",
      Vanija: "Vanija",
      Vishti: "Vishti",
      Shakuni: "Shakuni",
      Chatushpada: "Chatushpada",
      Naga: "Naga",
      Kimstughna: "Kimstughna",
    },
  },
  te: {
    samvatsaras: [
      "ప్రభవ",
      "విభవ",
      "శుక్ల",
      "ప్రమోదూత",
      "ప్రజోత్పత్తి",
      "ఆంగీరస",
      "శ్రీముఖ",
      "భావ",
      "యువ",
      "ధాత",
      "ఈశ్వర",
      "బహుధాన్య",
      "ప్రమాది",
      "విక్రమ",
      "వృష",
      "చిత్రభాను",
      "స్వభాను",
      "తారణ",
      "పార్థివ",
      "వ్యయ",
      "సర్వజిత్",
      "సర్వధారి",
      "విరోధి",
      "వికృతి",
      "ఖర",
      "నందన",
      "విజయ",
      "జయ",
      "మన్మథ",
      "దుర్ముఖి",
      "హేవిలంబి",
      "విలంబి",
      "వికారి",
      "శార్వరి",
      "ప్లవ",
      "శుభకృత్",
      "శోభకృత్",
      "క్రోధి",
      "విశ్వావసు",
      "పరాభవ",
      "ప్లవంగ",
      "కీలక",
      "సౌమ్య",
      "సాధారణ",
      "విరోధికృత్",
      "పరిధావి",
      "ప్రమాదీచ",
      "ఆనంద",
      "రాక్షస",
      "నల",
      "పింగళ",
      "కాళయుక్తి",
      "సిద్ధార్థి",
      "రౌద్రి",
      "దుర్మతి",
      "దుందుభి",
      "రుధిరోద్గారి",
      "రక్తాక్షి",
      "క్రోధన",
      "అక్షయ",
    ],
    maasas: {
      Chaitra: "చైత్ర",
      Vaishakha: "వైశాఖ",
      Jyeshtha: "జ్యేష్ఠ",
      Ashadha: "ఆషాఢ",
      Shravana: "శ్రావణ",
      Bhadrapada: "భాద్రపద",
      Ashwayuja: "ఆశ్వయుజ",
      Karthika: "కార్తీక",
      Margashira: "మార్గశిర",
      Pausha: "పుష్య",
      Magha: "మాఘ",
      Maaga: "మాఘ",
      Phalguna: "ఫాల్గుణ",
    },
    pakshas: { Shukla: "శుక్ల", Krishna: "కృష్ణ" },
    tithis: {
      Pratipath: "ప్రతిపత్",
      Dvitiya: "విదియ",
      Tritiya: "తృతీయ",
      Chaturthi: "చతుర్థి",
      Panchami: "పంచమి",
      Shashthi: "షష్ఠి",
      Saptami: "సప్తమి",
      Ashtami: "అష్టమి",
      Navami: "నవమి",
      Dashami: "దశమి",
      Ekadashi: "ఏకాదశి",
      Dwadashi: "ద్వాదశి",
      Trayodashi: "త్రయోదశి",
      Chaturdashi: "చతుర్దశి",
      Purnima: "పౌర్ణమి",
      Amavasya: "అమావాస్య",
    },
    vaaras: {
      Bhaanu: "భాను",
      Indu: "ఇందు",
      Bhauma: "భౌమ",
      Soumya: "సౌమ్య",
      Guru: "గురు",
      Bhrugu: "భృగు",
      Sthira: "స్థిర",
    },
    nakshatras: {
      Ashwini: "అశ్విని",
      Bharani: "భరణి",
      Krittika: "కృత్తిక",
      Rohini: "రోహిణి",
      Mrigashira: "మృగశిర",
      Ardra: "ఆర్ద్ర",
      Punarvasu: "పునర్వసు",
      Pushya: "పుష్య",
      Ashlesha: "ఆశ్లేష",
      Magha: "మఖ",
      "Purva Phalguni": "పుబ్బ",
      "Uttara Phalguni": "ఉత్తర",
      Hasta: "హస్త",
      Chitra: "చిత్త",
      Swati: "స్వాతి",
      Vishakha: "విశాఖ",
      Anuradha: "అనూరాధ",
      Jyeshtha: "జ్యేష్ఠ",
      Mula: "మూల",
      "Purva Ashadha": "పూర్వాషాఢ",
      "Uttara Ashadha": "ఉత్తరాషాఢ",
      Shravana: "శ్రవణ",
      Dhanishtha: "ధనిష్ఠ",
      Shatabhisha: "శతభిష",
      "Purva Bhadrapada": "పూర్వాభాద్ర",
      "Uttara Bhadrapada": "ఉత్తరాభాద్ర",
      Revati: "రేవతి",
    },
    yogas: {
      Vishkambha: "విష్కంభ",
      Priti: "ప్రీతి",
      Ayushman: "ఆయుష్మాన్",
      Saubhagya: "సౌభాగ్య",
      Shobhana: "శోభన",
      Atiganda: "అతిగండ",
      Sukarman: "సుకర్మ",
      Dhriti: "ధృతి",
      Shula: "శూల",
      Ganda: "గండ",
      Vriddhi: "వృద్ధి",
      Dhruva: "ధ్రువ",
      Vyaghata: "వ్యాఘాత",
      Harshana: "హర్షణ",
      Vajra: "వజ్ర",
      Siddhi: "సిద్ధి",
      Vyatipata: "వ్యతీపాత",
      Variyan: "వరీయాన్",
      Parigha: "పరిఘ",
      Shiva: "శివ",
      Siddha: "సిద్ధ",
      Sadhya: "సాధ్య",
      Shubha: "శుభ",
      Shukla: "శుక్ల",
      Brahma: "బ్రహ్మ",
      Indra: "ఐంద్ర",
      Vaidhriti: "వైధృతి",
    },
    karanas: {
      Bava: "బవ",
      Balava: "బాలవ",
      Kaulava: "కౌలవ",
      Taitila: "తైతుల",
      Gara: "గరిజ",
      Vanija: "వణిజ",
      Vishti: "విష్టి",
      Shakuni: "శకుని",
      Chatushpada: "చతుష్పాద",
      Naga: "నాగ",
      Kimstughna: "కింస్తుఘ్న",
    },
  },
  kn: {
    samvatsaras: [
      "ಪ್ರಭವ",
      "ವಿಭವ",
      "ಶುಕ್ಲ",
      "ಪ್ರಮೋದೂತ",
      "ಪ್ರಜೋತ್ಪತ್ತಿ",
      "ಆಂಗೀರಸ",
      "ಶ್ರೀಮುಖ",
      "ಭಾವ",
      "ಯುವ",
      "ಧಾತ",
      "ಈಶ್ವರ",
      "ಬಹುಧಾನ್ಯ",
      "ಪ್ರಮಾದಿ",
      "ವಿಕ್ರಮ",
      "ವೃಷ",
      "ಚಿತ್ರಭಾನು",
      "ಸ್ವಭಾನು",
      "ತಾರಣ",
      "ಪಾರ್ಥಿವ",
      "ವ್ಯಯ",
      "ಸರ್ವಜಿತ್",
      "ಸರ್ವಧಾರಿ",
      "ವಿರೋಧಿ",
      "ವಿಕೃತಿ",
      "ಖರ",
      "ನಂದನ",
      "ವಿಜಯ",
      "ಜಯ",
      "ಮನ್ಮಥ",
      "ದುರ್ಮುಖಿ",
      "ಹೇವಿಲಂಬಿ",
      "ವಿಲಂಬಿ",
      "ವಿಕಾರಿ",
      "ಶಾರ್ವರಿ",
      "ಪ್ಲವ",
      "ಶುಭಕೃತ್",
      "ಶೋಭಕೃತ್",
      "ಕ್ರೋಧಿ",
      "ವಿಶ್ವಾವಸು",
      "ಪರಾಭವ",
      "ಪ್ಲವಂಗ",
      "ಕೀಲಕ",
      "ಸೌಮ್ಯ",
      "ಸಾಧಾರಣ",
      "ವಿರೋಧಿಕೃತ್",
      "ಪರಿಧಾವಿ",
      "ಪ್ರಮಾದೀಚ",
      "ಆನಂದ",
      "ರಾಕ್ಷಸ",
      "ನಲ",
      "ಪಿಂಗಳ",
      "ಕಾಳಯುಕ್ತಿ",
      "ಸಿದ್ಧಾರ್ಥಿ",
      "ರೌದ್ರಿ",
      "ದುರ್ಮತಿ",
      "ದುಂದುಭಿ",
      "ರುಧಿರೋದ್ಗಾರಿ",
      "ರಕ್ತಾಕ್ಷಿ",
      "ಕ್ರೋಧನ",
      "ಅಕ್ಷಯ",
    ],
    maasas: {
      Chaitra: "ಚೈತ್ರ",
      Vaishakha: "ವೈಶಾಖ",
      Jyeshtha: "ಜ್ಯೇಷ್ಠ",
      Ashadha: "ಆಷಾಢ",
      Shravana: "ಶ್ರಾವಣ",
      Bhadrapada: "ಭಾದ್ರಪದ",
      Ashwayuja: "ಆಶ್ವಯುಜ",
      Karthika: "ಕಾರ್ತಿಕ",
      Margashira: "ಮಾರ್ಗಶಿರ",
      Pausha: "ಪುಷ್ಯ",
      Magha: "ಮಾಘ",
      Maaga: "ಮಾಘ",
      Phalguna: "ಫಾಲ್ಗುಣ",
    },
    pakshas: { Shukla: "ಶುಕ್ಲ", Krishna: "ಕೃಷ್ಣ" },
    tithis: {
      Pratipath: "ಪ್ರತಿಪತ್",
      Dvitiya: "ದ್ವಿತೀಯ",
      Tritiya: "ತೃತೀಯ",
      Chaturthi: "ಚತುರ್ಥಿ",
      Panchami: "ಪಂಚಮಿ",
      Shashthi: "ಷಷ್ಠಿ",
      Saptami: "ಸಪ್ತಮಿ",
      Ashtami: "ಅಷ್ಟಮಿ",
      Navami: "ನವಮಿ",
      Dashami: "ದಶಮಿ",
      Ekadashi: "ಏಕಾದಶಿ",
      Dwadashi: "ದ್ವಾದಶಿ",
      Trayodashi: "ತ್ರಯೋದಶಿ",
      Chaturdashi: "ಚತುರ್ದಶಿ",
      Purnima: "ಹುಣ್ಣಿಮೆ",
      Amavasya: "ಅಮಾವಾಸ್ಯೆ",
    },
    vaaras: {
      Bhaanu: "ಭಾನು",
      Indu: "ಇಂದು",
      Bhauma: "ಭೌಮ",
      Soumya: "ಸೌಮ್ಯ",
      Guru: "ಗುರು",
      Bhrugu: "ಭೃಗು",
      Sthira: "ಸ್ಥಿರ",
    },
    nakshatras: {
      Ashwini: "ಅಶ್ವಿನಿ",
      Bharani: "ಭರಣಿ",
      Krittika: "ಕೃತ್ತಿಕಾ",
      Rohini: "ರೋಹಿಣಿ",
      Mrigashira: "ಮೃಗಶಿರ",
      Ardra: "ಆರ್ದ್ರಾ",
      Punarvasu: "ಪುನರ್ವಸು",
      Pushya: "ಪುಷ್ಯ",
      Ashlesha: "ಆಶ್ಲೇಷ",
      Magha: "ಮಖ",
      "Purva Phalguni": "ಪೂ.ಫಲ್ಗುಣಿ",
      "Uttara Phalguni": "ಉ.ಫಲ್ಗುಣಿ",
      Hasta: "ಹಸ್ತ",
      Chitra: "ಚಿತ್ರಾ",
      Swati: "ಸ್ವಾತಿ",
      Vishakha: "ವಿಶಾಖ",
      Anuradha: "ಅನುರಾಧ",
      Jyeshtha: "ಜ್ಯೇಷ್ಠ",
      Mula: "ಮೂಲ",
      "Purva Ashadha": "ಪೂ.ಆಷಾಢ",
      "Uttara Ashadha": "ಉ.ಆಷಾಢ",
      Shravana: "ಶ್ರವಣ",
      Dhanishtha: "ಧನಿಷ್ಠ",
      Shatabhisha: "ಶತಭಿಷ",
      "Purva Bhadrapada": "ಪೂ.ಭಾದ್ರ",
      "Uttara Bhadrapada": "ಉ.ಭಾದ್ರ",
      Revati: "ರೇವತಿ",
    },
    yogas: {
      Vishkambha: "ವಿಷ್ಕಂಭ",
      Priti: "ಪ್ರೀತಿ",
      Ayushman: "ಆಯುಷ್ಮಾನ್",
      Saubhagya: "ಸೌಭಾಗ್ಯ",
      Shobhana: "ಶೋಭನ",
      Atiganda: "ಅತಿಗಂಡ",
      Sukarman: "ಸುಕರ್ಮ",
      Dhriti: "ಧೃತಿ",
      Shula: "ಶೂಲ",
      Ganda: "ಗಂಡ",
      Vriddhi: "ವೃದ್ಧಿ",
      Dhruva: "ಧ್ರುವ",
      Vyaghata: "ವ್ಯಾಘಾತ",
      Harshana: "ಹರ್ಷಣ",
      Vajra: "ವಜ್ರ",
      Siddhi: "ಸಿದ್ಧಿ",
      Vyatipata: "ವ್ಯತಿಪಾತ",
      Variyan: "ವರೀಯಾನ್",
      Parigha: "ಪರಿಘ",
      Shiva: "ಶಿವ",
      Siddha: "ಸಿದ್ಧ",
      Sadhya: "ಸಾಧ್ಯ",
      Shubha: "ಶುಭ",
      Shukla: "ಶುಕ್ಲ",
      Brahma: "ಬ್ರಹ್ಮ",
      Indra: "ಐಂದ್ರ",
      Vaidhriti: "ವೈಧೃತಿ",
    },
    karanas: {
      Bava: "ಬವ",
      Balava: "ಬಾಲವ",
      Kaulava: "ಕೌಲವ",
      Taitila: "ತೈತುಲ",
      Gara: "ಗರಿಜ",
      Vanija: "ವಣಿಜ",
      Vishti: "ವಿಷ್ಟಿ",
      Shakuni: "ಶಕುನಿ",
      Chatushpada: "ಚತುಷ್ಪಾದ",
      Naga: "ನಾಗ",
      Kimstughna: "ಕಿಂಸ್ತುಘ್ನ",
    },
  },
  sa: {
    samvatsaras: [
      "प्रभव",
      "विभव",
      "शुक्ल",
      "प्रमोदूत",
      "प्रजोत्पत्ति",
      "आङ्गीरस",
      "श्रीमुख",
      "भाव",
      "युव",
      "धात",
      "ईश्वर",
      "बहुधान्य",
      "प्रमादि",
      "विक्रम",
      "वृष",
      "चित्रभानु",
      "स्वभानु",
      "तारण",
      "पार्थिव",
      "व्यय",
      "सर्वजित्",
      "सर्वधारि",
      "विरोधि",
      "विकृति",
      "खर",
      "नन्दन",
      "विजय",
      "जय",
      "मन्मथ",
      "दुर्मुखि",
      "हेविलम्बि",
      "विलम्बि",
      "विकारि",
      "शार्वरि",
      "प्लव",
      "शुभकृत्",
      "शोभकृत्",
      "क्रोधि",
      "विश्वावसु",
      "पराभव",
      "प्लवङ्ग",
      "कीलक",
      "सौम्य",
      "साधारण",
      "विरोधकृत्",
      "परिधावि",
      "प्रमादीच",
      "आनन्द",
      "राक्षस",
      "नल",
      "पिङ्गल",
      "कालयुक्ति",
      "सिद्धार्थि",
      "रौद्रि",
      "दुर्मति",
      "दुन्दुभि",
      "रुधिरोद्गारि",
      "रक्ताक्षि",
      "क्रोधन",
      "अक्षय",
    ],
    maasas: {
      Chaitra: "चैत्र",
      Vaishakha: "वैशाख",
      Jyeshtha: "ज्येष्ठ",
      Ashadha: "आषाढ",
      Shravana: "श्रावण",
      Bhadrapada: "भाद्रपद",
      Ashwayuja: "आश्वयुज",
      Karthika: "कार्तिक",
      Margashira: "मार्गशिर",
      Pausha: "पौष",
      Magha: "माघ",
      Maaga: "माघ",
      Phalguna: "फाल्गुन",
    },
    pakshas: { Shukla: "शुक्ल", Krishna: "कृष्ण" },
    tithis: {
      Pratipath: "प्रतिपदा",
      Dvitiya: "द्वितीया",
      Tritiya: "तृतीया",
      Chaturthi: "चतुर्थी",
      Panchami: "पञ्चमी",
      Shashthi: "षष्ठी",
      Saptami: "सप्तमी",
      Ashtami: "अष्टमी",
      Navami: "नवमी",
      Dashami: "दशमी",
      Ekadashi: "एकादशी",
      Dwadashi: "द्वादशी",
      Trayodashi: "त्रयोदशी",
      Chaturdashi: "चतुर्दशी",
      Purnima: "पूर्णिमा",
      Amavasya: "अमावास्या",
    },
    vaaras: {
      Bhaanu: "भानु",
      Indu: "इन्दु",
      Bhauma: "भौम",
      Soumya: "सौम्य",
      Guru: "गुरु",
      Bhrugu: "भृगु",
      Sthira: "स्थिर",
    },
    nakshatras: {
      Ashwini: "अश्विनी",
      Bharani: "भरणी",
      Krittika: "कृत्तिका",
      Rohini: "रोहिणी",
      Mrigashira: "मृगशीर्ष",
      Ardra: "आर्द्रा",
      Punarvasu: "पुनर्वसु",
      Pushya: "पुष्य",
      Ashlesha: "आश्लेषा",
      Magha: "मघा",
      "Purva Phalguni": "पू.फाल्गुनी",
      "Uttara Phalguni": "उ.फाल्गुनी",
      Hasta: "हस्त",
      Chitra: "चित्रा",
      Swati: "स्वाति",
      Vishakha: "विशाखा",
      Anuradha: "अनुराधा",
      Jyeshtha: "ज्येष्ठा",
      Mula: "मूल",
      "Purva Ashadha": "पू.आषाढा",
      "Uttara Ashadha": "उ.आषाढा",
      Shravana: "श्रवण",
      Dhanishtha: "धनिष्ठा",
      Shatabhisha: "शतभिषा",
      "Purva Bhadrapada": "पू.भाद्रपद",
      "Uttara Bhadrapada": "उ.भाद्रपद",
      Revati: "रेवती",
    },
    yogas: {
      Vishkambha: "विष्कम्भ",
      Priti: "प्रीति",
      Ayushman: "आयुष्मान्",
      Saubhagya: "सौभाग्य",
      Shobhana: "शोभन",
      Atiganda: "अतिगण्ड",
      Sukarman: "सुकर्म",
      Dhriti: "धृति",
      Shula: "शूल",
      Ganda: "गण्ड",
      Vriddhi: "वृद्धि",
      Dhruva: "ध्रुव",
      Vyaghata: "व्याघात",
      Harshana: "हर्षण",
      Vajra: "वज्र",
      Siddhi: "सिद्धि",
      Vyatipata: "व्यतीपात",
      Variyan: "वरीयान्",
      Parigha: "परिघ",
      Shiva: "शिव",
      Siddha: "सिद्ध",
      Sadhya: "साध्य",
      Shubha: "शुभ",
      Shukla: "शुक्ल",
      Brahma: "ब्रह्म",
      Indra: "ऐन्द्र",
      Vaidhriti: "वैधृति",
    },
    karanas: {
      Bava: "बव",
      Balava: "बालव",
      Kaulava: "कौलव",
      Taitila: "तैतुल",
      Gara: "गरिज",
      Vanija: "वणिज",
      Vishti: "विष्टि",
      Shakuni: "शकुनि",
      Chatushpada: "चतुष्पाद",
      Naga: "नाग",
      Kimstughna: "किंस्तुघ्न",
    },
  },
};

const VARA_SANKALPA = {
  Ravivara: "Bhaanu",
  Somavara: "Indu",
  Mangalavara: "Bhauma",
  Budhavara: "Soumya",
  Guruvara: "Guru",
  Shukravara: "Bhrugu",
  Shanivara: "Sthira",
  Sunday: "Bhaanu",
  Monday: "Indu",
  Tuesday: "Bhauma",
  Wednesday: "Soumya",
  Thursday: "Guru",
  Friday: "Bhrugu",
  Saturday: "Sthira",
};

export default function Sankalpa({ onNavigate, transitChart, hideTitle = false, overrideLang = null }) {
  const [sankalpaData, setSankalpaData] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adhikaMaasaList, setAdhikaMaasaList] = useState([]);
  const [lunarMonthsList, setLunarMonthsList] = useState([]);
  const { t, i18n } = useTranslation();

  const lang = overrideLang || i18n.language?.split("-")[0] || "te";

  useEffect(() => {
    fetchAdhikaMaasa();
    fetchLunarMonths();
  }, []);

  useEffect(() => {
    if (transitChart) {
      setApiData({ data: transitChart, dateVal: transitChart.meta?.dob || "" });
    } else {
      fetchPanchangaData();
    }
  }, [transitChart]);

  const fetchAdhikaMaasa = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL;

      const fetchJsonSafely = async (url) => {
        try {
          const r = await fetch(url);
          const t = await r.text();
          return JSON.parse(t);
        } catch (e) {
          return null;
        }
      };

      let data = await fetchJsonSafely(
        `${baseUrl}static/adhika_masa_data.json`,
      );
      if (!data) {
        data = await fetchJsonSafely(
          `${baseUrl}jataka/static/adhika_masa_data.json`,
        );
      }
      if (data) {
        const arr = Array.isArray(data) ? data : data.events || data.data || [];
        setAdhikaMaasaList(arr);
      }
    } catch (e) {
      console.warn("Failed to load Adhika Maasa JSON", e);
    }
  };

  const fetchLunarMonths = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL;

      const fetchJsonSafely = async (url) => {
        try {
          const r = await fetch(url);
          const t = await r.text();
          return JSON.parse(t);
        } catch (e) {
          return null;
        }
      };

      let data = await fetchJsonSafely(
        `${baseUrl}static/masa.json`,
      );
      if (!data) {
        data = await fetchJsonSafely(
          `${baseUrl}jataka/static/masa.json`,
        );
      }
      if (data) {
        const arr = Array.isArray(data) ? data : data.events || data.data || [];
        setLunarMonthsList(arr);
      }
    } catch (e) {
      console.warn("Failed to load masa.json", e);
    }
  };

  function getMaasa(sunLon, moonLon, sunSpeed = 0.9856, moonSpeed = 13.176) {
    const lunarMonths = [
      "Chaitra",
      "Vaishakha",
      "Jyeshtha",
      "Ashadha",
      "Shravana",
      "Bhadrapada",
      "Ashwayuja",
      "Karthika",
      "Margashira",
      "Pausha",
      "Maaga",
      "Phalguna",
    ];
    let relSpeed = Math.max(0.1, moonSpeed - sunSpeed);
    let diff = (moonLon - sunLon + 360) % 360;

    let daysSinceAmavasya = diff / relSpeed;
    let sunLonAtAmavasya = (sunLon - daysSinceAmavasya * sunSpeed + 360) % 360;
    let amavasyaRashi = Math.floor(sunLonAtAmavasya / 30);

    let daysToNextAmavasya = (360 - diff) / relSpeed;
    let sunLonAtNextAmavasya = (sunLon + daysToNextAmavasya * sunSpeed) % 360;
    let nextAmavasyaRashi = Math.floor(sunLonAtNextAmavasya / 30);

    let isAdhika = amavasyaRashi === nextAmavasyaRashi;
    return (isAdhika ? "Adhika " : "") + lunarMonths[(amavasyaRashi + 1) % 12];
  }

  function getTranslatedTerm(type, englishTerm, langCode) {
    if (!englishTerm) return "";
    if (
      LANG_DATA[langCode] &&
      LANG_DATA[langCode][type] &&
      LANG_DATA[langCode][type][englishTerm]
    ) {
      return LANG_DATA[langCode][type][englishTerm];
    }
    return englishTerm;
  }

  function getSamvatsaraIndex(dateStr, maasa) {
    const d = new Date(dateStr);
    let year = d.getFullYear();
    let month = d.getMonth();

    const lateMonths = [
      "Pushya",
      "Magha",
      "Maaga",
      "Phalguna",
      "Margashira",
      "Pausha",
    ];
    let cleanMaasa = (maasa || "")
      .replace("Adhika ", "")
      .replace("Nija ", "")
      .trim();

    let sakaYear = year - 78;
    if (month <= 3 && lateMonths.some((m) => cleanMaasa.includes(m))) {
      sakaYear -= 1;
    }

    let index = (sakaYear + 11) % 60;
    if (index < 0) index += 60;
    return index;
  }

  function getAyana(sunRashi) {
    if (sunRashi >= 10 || sunRashi <= 3) return "Uttara";
    return "Dakshina";
  }

  function getRitu(maasa) {
    let cleanMaasa = (maasa || "")
      .replace("Adhika ", "")
      .replace("Nija ", "")
      .trim();
    if (cleanMaasa === "Chaitra" || cleanMaasa === "Vaishakha")
      return "Vasantha";
    if (cleanMaasa === "Jyeshtha" || cleanMaasa === "Ashadha")
      return "Greeshma";
    if (cleanMaasa === "Shravana" || cleanMaasa === "Bhadrapada")
      return "Varsha";
    if (
      cleanMaasa === "Ashwayuja" ||
      cleanMaasa === "Ashvina" ||
      cleanMaasa === "Karthika"
    )
      return "Sharad";
    if (
      cleanMaasa === "Margashira" ||
      cleanMaasa === "Pushya" ||
      cleanMaasa === "Pausha"
    )
      return "Hemanta";
    if (
      cleanMaasa === "Magha" ||
      cleanMaasa === "Maaga" ||
      cleanMaasa === "Phalguna"
    )
      return "Shishira";
    return "Rutu";
  }

  const fetchPanchangaData = async () => {
    setLoading(true);
    setError("");
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateVal = `${year}-${month}-${day}`;
      const timeVal = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      let defaultLat = 12.9716;
      let defaultLon = 77.5946;
      let defaultTz = 5.5;

      try {
        const defLoc = JSON.parse(
          localStorage.getItem("vaiswanara_default_location") || "null"
        );
        if (defLoc) {
          if (defLoc.latitude !== undefined) defaultLat = Number(defLoc.latitude);
          if (defLoc.longitude !== undefined) defaultLon = Number(defLoc.longitude);
          if (defLoc.timezone !== undefined) defaultTz = Number(defLoc.timezone);
        } else {
          const prefsData = JSON.parse(
            localStorage.getItem("eclock_prefs") || "{}",
          );
          if (prefsData.default_lat !== undefined)
            defaultLat = Number(prefsData.default_lat);
          if (prefsData.default_lon !== undefined)
            defaultLon = Number(prefsData.default_lon);
          if (prefsData.default_tz !== undefined)
            defaultTz = Number(prefsData.default_tz);
        }
      } catch (e) { }

      const params = new URLSearchParams({
        endpoint: "birthchart",
        dob: dateVal,
        tob: timeVal,
        latitude: defaultLat,
        longitude: defaultLon,
        timezone: defaultTz,
        _t: Date.now(),
      });

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: { "x-api-token": API_TOKEN }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error (${res.status}): ${text}`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setApiData({ data, dateVal });
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch Panchanga data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiData) return;
    try {
      const { data, dateVal } = apiData;
      const p = data.panchanga;
      const sunRashi = data.planets.Sun.rashi;
      const sunLon = data.planets.Sun.longitude;
      const moonLon = data.planets.Moon.longitude;
      const sunSpeed = data.planets.Sun.speed || 0.9856;
      const moonSpeed = data.planets.Moon.speed || 13.176;

      const meta = data.meta || {};
      const dob = meta.dob || dateVal;
      const tob = meta.tob || "00:00";
      const tz = meta.timezone !== undefined ? meta.timezone : 5.5;

      const parseDateTimeToDate = (dobStr, tobStr, timezoneVal) => {
        if (!dobStr) return new Date();
        const [year, month, day] = dobStr.split("-").map(Number);
        const [hour, minute, second = 0] = (tobStr || "00:00").split(":").map(Number);
        const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        const offsetMs = timezoneVal * 3600 * 1000;
        return new Date(utcDate.getTime() - offsetMs);
      };

      const getAdhikaDateBound = (item, isEnd = false) => {
        const dtStr = isEnd
          ? (item.end_datetime || item.end)
          : (item.start_datetime || item.start);
        if (dtStr) {
          const d = new Date(dtStr);
          if (!isNaN(d.getTime())) return d;
        }
        const dStr = isEnd ? item.end_date : item.start_date;
        if (dStr) {
          const [y, m, d] = dStr.split("-").map(Number);
          if (isEnd) {
            return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
          } else {
            return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
          }
        }
        return null;
      };

      const currentChartTime = parseDateTimeToDate(dob, tob, tz);

      let maasaClean = "";
      let matchedMasa = null;

      if (lunarMonthsList && lunarMonthsList.length > 0) {
        matchedMasa = lunarMonthsList.find((item) => {
          const startStr = item.start || item.Start_Date;
          const endStr = item.end || item.End_Date;
          if (!startStr || !endStr) return false;
          const start = new Date(startStr);
          const end = new Date(endStr);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
          return currentChartTime >= start && currentChartTime < end;
        });
      }

      if (matchedMasa) {
        maasaClean = matchedMasa.masa || matchedMasa.Masa_Name || "";
      } else {
        const activeAdhikaData = adhikaMaasaList.find((item) => {
          const start = getAdhikaDateBound(item, false);
          const end = getAdhikaDateBound(item, true);
          if (!start || !end) return false;
          return currentChartTime >= start && currentChartTime <= end;
        });

        if (activeAdhikaData) {
          let mName =
            activeAdhikaData.maasa_name ||
            activeAdhikaData.masa_name ||
            activeAdhikaData.maasa;
          if (mName && (mName.includes("Adhika") || mName.includes("Nija"))) {
            maasaClean = mName;
          } else {
            let prefix = "";
            if (activeAdhikaData.type === "Adhika") prefix = "Adhika ";
            else if (activeAdhikaData.type === "Nija") prefix = "Nija ";
            maasaClean = prefix + (mName || "Unknown");
          }
        } else {
          const maasaCalc = getMaasa(sunLon, moonLon, sunSpeed, moonSpeed);
          const baseMaasa = (p.maasa || maasaCalc)
            .replace("Adhika ", "")
            .replace("Nija ", "")
            .trim();

          const recentAdhikaData = adhikaMaasaList.find((item) => {
            const end = getAdhikaDateBound(item, true);
            if (!end) return false;

            let itemMasaName = (item.maasa_name || item.masa_name || item.maasa || "")
              .replace("Adhika ", "")
              .replace("Nija ", "")
              .trim();

            const diffTime = currentChartTime.getTime() - end.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            return itemMasaName === baseMaasa && diffDays >= 0 && diffDays <= 30;
          });

          if (recentAdhikaData) {
            maasaClean = "Nija " + baseMaasa;
          } else {
            maasaClean = baseMaasa;
          }
        }
      }

      // నక్షత్రంతో క్రాష్ అవ్వకుండా కేవలం మాసం పేరును మారుస్తున్నాము
      maasaClean = maasaClean.replace("Magha", "Maaga");

      let langCode = lang;
      if (!SANKALPA_DICT[langCode]) langCode = "en";
      const dict = SANKALPA_DICT[langCode];

      const samvatsaraIdx = getSamvatsaraIndex(dateVal, maasaClean);
      const samvatsaraTrans = LANG_DATA[langCode].samvatsaras[samvatsaraIdx];
      const ayanaEn = getAyana(sunRashi);
      const ayanaTrans = dict[ayanaEn.toLowerCase()];
      const rituEn = getRitu(maasaClean);
      const rituTrans = dict[rituEn.toLowerCase()];

      let tithiClean = (p.tithi || "")
        .replace("Shukla ", "")
        .replace("Krishna ", "")
        .replace(" (Waning)", "")
        .replace(" (Waxing)", "")
        .replace("K.", "")
        .replace("S.", "")
        .trim();
      if (tithiClean.includes("Pratipada") || tithiClean.includes("Prathama"))
        tithiClean = "Pratipath";

      const vaaraClean = VARA_SANKALPA[p.vara] || p.vara;
      let pakshaClean = (p.paksha || "").split(" ")[0];
      if (!pakshaClean && p.tithi) {
        pakshaClean =
          p.tithi.includes("K.") || p.tithi.includes("Krishna")
            ? "Krishna"
            : "Shukla";
      }
      const nakshatraClean = p.moon_nakshatra || p.nakshatra || "";
      const yogaClean = p.yoga || "";
      const karanaClean = p.karana || "";

      let isAdhika = maasaClean.includes("Adhika");
      let isNija = maasaClean.includes("Nija");
      let baseMaasa = maasaClean
        .replace("Adhika ", "")
        .replace("Nija ", "")
        .trim();
      let prefixTrans = isAdhika ? dict.adhika : isNija ? dict.nija : "";
      let maasaTrans =
        prefixTrans + getTranslatedTerm("maasas", baseMaasa, langCode);

      let pakshaTrans = getTranslatedTerm("pakshas", pakshaClean, langCode);
      let tithiTrans = getTranslatedTerm("tithis", tithiClean, langCode);
      let vaaraTrans = getTranslatedTerm("vaaras", vaaraClean, langCode);
      let nakshatraTrans = getTranslatedTerm(
        "nakshatras",
        nakshatraClean,
        langCode,
      );
      let yogaTrans = getTranslatedTerm("yogas", yogaClean, langCode);
      let karanaTrans = getTranslatedTerm("karanas", karanaClean, langCode);

      let text = `${dict.sri} <b class="sankalpa-highlight">${samvatsaraTrans}</b> ${dict.samvatsare}<br>`;
      text += `<b class="sankalpa-highlight">${ayanaTrans}</b>${dict.ayane} <b class="sankalpa-highlight">${rituTrans}</b> ${dict.rutou}<br>`;
      text += `<b class="sankalpa-highlight">${maasaTrans}</b> ${dict.maase} <b class="sankalpa-highlight">${pakshaTrans}</b> ${dict.pakshe}<br>`;
      text += `<b class="sankalpa-highlight">${tithiTrans}</b> ${dict.tithou} <b class="sankalpa-highlight">${vaaraTrans}</b> ${dict.vaasare}<br>`;
      text += `<b class="sankalpa-highlight">${nakshatraTrans}</b> ${dict.nakshatra}<br>`;
      text += `<b class="sankalpa-highlight">${yogaTrans}</b> ${dict.yoga} <b class="sankalpa-highlight">${karanaTrans}</b> ${dict.karana}<br>`;
      text += `<span style="font-size: 0.85em; color:#7f8c8d; display:block; margin-top:15px;">${dict.evam}</span>`;

      setSankalpaData(text);
    } catch (e) {
      console.error(e);
    }
  }, [apiData, lang, adhikaMaasaList, lunarMonthsList]);

  const fontMap = {
    en: "'Crimson Pro', serif",
    te: "'Mallanna', sans-serif",
    kn: "'Noto Sans Kannada', sans-serif",
    sa: "'Noto Sans Devanagari', serif",
  };

  return (
    <div
      className="prediction-panel"
      style={{
        textAlign: "center",
        padding: "30px 20px",
        background: "#fffdf8",
        border: "2px dashed #f39c12",
        margin: "0 auto 20px auto",
        width: "100%",
        maxWidth: "1000px",
        boxSizing: "border-box",
      }}
    >
      {!hideTitle && (
        <>
          <h2
            style={{
              color: "#d35400",
              fontFamily: "'Crimson Pro', serif",
              fontSize: "28px",
              marginTop: "0",
            }}
          >
            ॥ {t("Nitya Sankalpam", "Nitya Sankalpam")} ॥
          </h2>

          <div
            style={{
              fontSize: "0.85rem",
              color: "#7f8c8d",
              fontStyle: "italic",
              marginBottom: "15px",
            }}
          >
            {t("calculatedAtRealtime", "(Calculated at Realtime)")}
          </div>
        </>
      )}

      {loading && <p>Calculating Nitya Sankalpam...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {sankalpaData && !loading && (
        <>
          <p
            style={{
              fontSize: "1.4rem",
              lineHeight: "2.2",
              color: "#2c3e50",
              fontFamily: fontMap[lang] || "Arial",
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: sankalpaData }}
          ></p>
          {hideTitle && (
            <div
              style={{
                fontSize: "0.85rem",
                color: "#7f8c8d",
                fontStyle: "italic",
                marginTop: "20px",
              }}
            >
              {t("calculatedAtRealtime", "(Calculated at Realtime)")}
            </div>
          )}
        </>
      )}
    </div>
  );
}
