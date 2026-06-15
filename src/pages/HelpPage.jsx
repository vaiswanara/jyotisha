import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

const GUIDE_SECTIONS = {
  en: {
    title: "FAQ & Learning Center",
    subtitle: "Frequently Asked Questions, documentation, and tutorials for e-JYOTISHA.",
    searchPlaceholder: "Search FAQs and manual...",
    noResults: "No matching FAQ or guide topics found.",
    categories: [
      {
        id: "getting-started",
        title: "📱 Getting Started",
        items: [
          {
            q: "What is e-Jyotisha?",
            a: "<b>e-Jyotisha</b> is a free, ad-free educational Web Application designed for students of Vedic Astrology. Key aspects:<br/>" +
               "• <b>Unified App</b>: Integrates <b>e-Paatha</b> (lessons, offline videos, notes) and <b>Jataka</b> (horoscope analysis & compatibility tools) into one single platform.<br/>" +
               "• <b>Access Link</b>: Available globally at <a href='https://vaiswanara.com/jyotisha' target='_blank'>vaiswanara.com/jyotisha</a>."
          },
          {
            q: "Which platforms and devices are supported?",
            a: "e-Jyotisha is highly responsive and runs on almost all modern devices:<br/>" +
               "• <b>Mobile & Tablets</b>: Fully optimized for Android, iOS (iPhone/iPad), and tablets.<br/>" +
               "• <b>Computers</b>: Runs smoothly on Windows, macOS, and Linux.<br/>" +
               "• <b>Smart TVs</b>: Fully supported on Smart TVs via web browsers (e.g., Chrome). No APK or store download required."
          },
          {
            q: "How to install e-Jyotisha on Android?",
            a: "Follow these steps to install the app on Android:<br/>" +
               "1. Open the <b>Chrome Browser</b> on your phone.<br/>" +
               "2. Visit <a href='https://vaiswanara.com/jyotisha'>vaiswanara.com/jyotisha</a>.<br/>" +
               "3. Tap the <b>'Install'</b> button visible at the top-left of the screen, OR tap Chrome's 3-dot menu and select <b>'Install app'</b> (or <b>'Add to Home screen'</b>).<br/>" +
               "4. This adds a clean, native-feeling app shortcut on your home screen."
          },
          {
            q: "How to install e-Jyotisha on iPhone / iPad (iOS)?",
            a: "Follow these steps to install on Apple devices:<br/>" +
               "1. Open the <b>Safari Browser</b> on your iOS device.<br/>" +
               "2. Visit <a href='https://vaiswanara.com/jyotisha'>vaiswanara.com/jyotisha</a>.<br/>" +
               "3. Tap the <b>'Share'</b> button (the square with an arrow icon) at the bottom toolbar.<br/>" +
               "4. Scroll down and select <b>'Add to Home Screen'</b>.<br/>" +
               "5. Tap <b>'Add'</b> in the top-right corner to complete."
          },
          {
            q: "How to run e-Jyotisha on a Smart TV?",
            a: "Follow these steps to use the app on your TV:<br/>" +
               "1. Open your Smart TV's built-in web browser (e.g., Chrome, WebOS browser, or Silk).<br/>" +
               "2. Enter <b>vaiswanara.com/jyotisha</b> in the address bar.<br/>" +
               "3. Connect a wireless keyboard and mouse to easily input birth details and view large-screen charts."
          }
        ]
      },
      {
        id: "dashboard",
        title: "👤 Personal Dashboard",
        items: [
          {
            q: "How do I set up my personal profile?",
            a: "Follow these steps to create your profile:<br/>" +
               "1. Go to the <b>Me</b> tab in the menu.<br/>" +
               "2. Click on the <b>'Set up my profile'</b> button (no email, phone, or login required).<br/>" +
               "3. Enter your Name, Gender, Date of Birth, Time of Birth, and Birth Location (select from the autocomplete dropdown list).<br/>" +
               "4. Click <b>'Save Profile'</b> to store it locally on your device."
          },
          {
            q: "What daily information do I get on the Dashboard?",
            a: "Once configured, your dashboard displays personalized daily parameters calculated at sunrise:<br/>" +
               "• <b>Birth Details</b>: Your Birth Nakshatra and Rashi.<br/>" +
               "• <b>Daily Strengths</b>: Your personalized <b>Tarabala</b> (strength of the day), <b>Chandrabala</b> (moon strength), <b>Gurubala</b> (jupiter transit strength), and <b>Shanibala</b> (saturn transit strength and Sade Sati alert).<br/>" +
               "• <b>Daily Panchanga</b>: Tithi, Vara, Nakshatra, Yoga, and Karana at sunrise.<br/>" +
               "• <b>Daily Vedic Sankalpa</b>: Customized Sankalpa text configured with your birth details for daily prayers."
          }
        ]
      },
      {
        id: "horoscope",
        title: "🌌 Horoscope & Transits",
        items: [
          {
            q: "How to generate and analyze a Birth Chart (Horoscope)?",
            a: "Follow these steps to cast a horoscope:<br/>" +
               "1. Navigate to the <b>e-Jataka</b> page.<br/>" +
               "2. Enter Name, Date of Birth, Time, and Birth Location (or expand the <b>'Manual Coordinates'</b> details to manually enter Lat/Lon/Tz).<br/>" +
               "3. Click <b>'Generate Horoscope'</b>.<br/>" +
               "4. Access the following calculated parameters:<br/>" +
               "   - <b>Rashi & Navamsha Charts</b>: Displays your chart in the style chosen in Settings (South Indian or North Indian layout).<br/>" +
               "   - <b>D1 / Birth Chart Settings</b>: Click the **gear icon** above the D1 chart to enable/disable the display of planetary degrees directly on the chart cells.<br/>" +
               "   - <b>Navamsha (D9) Chart Settings</b>: Click the **gear icon** above the D9 chart to toggle between various Divisional Charts (e.g., D2 Hora, D3 Drekkana, D4 Chaturthamsha, D7 Saptamsha, D10 Dasamsha, D12 Dwadashamsha, D16 Shodashamsha, D20 Vimshamsha, D24 Chaturvimshamsha, D27 Saptavimshamsha, D30 Trimshamsha, D60 Shashtiamsha).<br/>" +
               "   - <b>Planetary Positions</b>: Degrees, Nakshatras, Padas, Nakshatra Lords, speeds, and retrograde (R) / combust (c) markers.<br/>" +
               "   - <b>Vimshottari Dasha</b>: Vimshottari Dashas down to three levels (Mahadasha, Antardasha, and Pratyantardasha).<br/>" +
               "   - <b>Shadbala Strengths</b>: Detailed planetary strengths.<br/>" +
               "   - <b>Ashtakavarga Tables</b>: Prastarashtakavarga and Sarvashtakavarga points.<br/>" +
               "5. Click <b>'Export PDF'</b> to save or print the full report."
          },
          {
            q: "How does the Gochara (Transit) module work?",
            a: "Select the <b>Transit</b> tab on the e-Jataka page to analyze current planetary transits. It calculates:<br/>" +
               "• <b>Gurubala</b>: Jupiter transit favorability based on moon sign.<br/>" +
               "• <b>Shanibala</b>: Saturn transit status (Sade Sati/Elinaati Shani, or Ashtama Shani).<br/>" +
               "• <b>Double Transit</b>: Simultaneous transits of Jupiter and Saturn influencing specific houses/rashis.<br/>" +
               "• Transit analysis based on Ashtakavarga points."
          }
        ]
      },
      {
        id: "matching",
        title: "💑 Horoscope Matching",
        items: [
          {
            q: "How to match horoscopes for marriage?",
            a: "Follow these steps to perform horoscope matching:<br/>" +
               "1. Navigate to <b>e-Match</b>.<br/>" +
               "2. Choose one of the two matching modes:<br/>" +
               "   - <b>Birth Details Mode</b>: Enter Date, Time, and Place of both the Boy and the Girl (or load from saved profiles).<br/>" +
               "   - <b>Nakshatra Mode</b>: Select Nakshatra and Pada of the boy and girl directly if birth times are unknown.<br/>" +
               "3. Click <b>'Calculate Ashtakuta Match'</b>."
          },
          {
            q: "What matching details are generated?",
            a: "The matching report generates:<br/>" +
               "• <b>Ashtakoota score</b>: Compatibility score out of 36.<br/>" +
               "• <b>Side-by-Side Charts</b>: Compare Rashi and Navamsa charts directly.<br/>" +
               "• <b>Dosha checks</b>: Automated checks for Kuja Dosha (Manglik) and exception rules."
          }
        ]
      },
      {
        id: "panchanga",
        title: "📅 Panchanga & Muhurtha",
        items: [
          {
            q: "How to generate a Panchanga Table?",
            a: "Follow these steps to generate a multi-day Panchanga:<br/>" +
               "1. Go to the <b>e-Panchanga</b> page.<br/>" +
               "2. Enter the Start Date, Location, and Range (from 30 to 90 days).<br/>" +
               "3. Click <b>'Calculate'</b>.<br/>" +
               "4. Use the following advanced tools:<br/>" +
               "   - <b>Pan Shudhi Filter</b>: Filter the table to display only highly auspicious dates.<br/>" +
               "   - <b>Export</b>: Download the table in CSV or JSON format.<br/>" +
               "   - <b>Save Profile</b>: Save the configuration to local profiles."
          },
          {
            q: "How to find Muhurthas and analyze timings?",
            a: "Follow these steps to check Muhurtha timings:<br/>" +
               "1. On the <b>e-Panchanga</b> page, select the <b>Muhurtha</b> tab.<br/>" +
               "2. The app evaluates the selected date for:<br/>" +
               "   - <b>Lagna & Pushkaramsha</b>: Dynamic auspicious time windows.<br/>" +
               "   - <b>Inauspicious Times</b>: Rahukala, Yamagandam, Durmuhurtha, and Varjyam.<br/>" +
               "   - <b>Panchaka Status</b>: Checks for Mrityu, Agni, Raja, Chora, or Roga panchakas.<br/>" +
               "   - <b>Ekavimsati Doshas</b>: Scans for the 21 major structural doshas (Papakartari, Papa Lagna, Kendra/Trikona Papa, bad panchaka, etc.)."
          }
        ]
      },
      {
        id: "utilities",
        title: "🔭 Astronomy Utilities",
        items: [
          {
            q: "How to check Adhika Masa & Kshaya Masa?",
            a: "Follow these steps to check leap/decayed months:<br/>" +
               "• <b>Adhika Masa</b>: Go to the Adhika Masa page to check when the next leap month occurs, how many days remain, and read an astronomical description.<br/>" +
               "• <b>Kshaya Masa</b>: Explore historical data and future predictions of rare decayed/decaying months."
          },
          {
            q: "How to check Eclipse (Grahana) timings?",
            a: "Follow these steps to analyze eclipses:<br/>" +
               "1. Navigate to the Eclipse page.<br/>" +
               "2. View upcoming Solar and Lunar eclipses.<br/>" +
               "3. Check contact times (start, maximum, end) in local time.<br/>" +
               "4. Verify local visibility at your coordinates."
          },
          {
            q: "What is the Prashna module?",
            a: "Follow these steps to use Hanuman Prashna:<br/>" +
               "1. Navigate to the **Hanumath Prashna** module.<br/>" +
               "2. Think of your question and select a number from the Prashna Chakra.<br/>" +
               "3. Get answers and guidance for marriage, exams, or other questions, accompanied by a Prashna chart."
          }
        ]
      },
      {
        id: "data-settings",
        title: "💾 Data & Settings",
        items: [
          {
            q: "How to manage profiles and back up my data?",
            a: "Follow these steps to backup and restore profiles:<br/>" +
               "1. Go to the <b>Profiles</b> page.<br/>" +
               "2. Manage your saved birth profiles, matching combinations, or search criteria.<br/>" +
               "3. Click <b>'Export JSON'</b> to download a backup file of all your data.<br/>" +
               "4. Use <b>'Import'</b> to upload a backup file and restore it on any device."
          },
          {
            q: "What is the Astro Clock & Time Machine?",
            a: "Follow these steps to use the clock and time travel:<br/>" +
               "1. Navigate to the **Astro Clock**.<br/>" +
               "2. View real-time planetary transits and Vedic Time units (Ghati, Pala, Vighati).<br/>" +
               "3. Use the **Time Machine** buttons to step forward or backward in time (minutes, hours, days, years) and see the charts update instantly."
          },
          {
            q: "How to change calculation and display settings?",
            a: "Follow these steps to adjust settings:<br/>" +
               "1. Navigate to the **Settings** page.<br/>" +
               "2. Configure these parameters:<br/>" +
               "   - <b>Language</b>: Choose English, Telugu, or Kannada.<br/>" +
               "   - <b>Chart Style</b>: Select **South Indian** or **North Indian** layout. Saving this setting instantly updates all open charts globally across Horoscope (D1/D9/divisionals), Gochara, Ashtakavarga, Match Page, Muhurtha Tab, Astro Clock, and PDF exports. Planet names are bolded in North Indian layout for better readability.<br/>" +
               "   - <b>Rahu Mode</b>: Choose Mean or True Rahu calculations.<br/>" +
               "   - <b>Default Coordinates</b>: Save your default location coordinates. If your city is not in the autocomplete list, you can expand the **'Manual Coordinates'** details to enter Latitude, Longitude, and Timezone manually."
          }
        ]
      },
      {
        id: "learning",
        title: "📚 Learning Center",
        items: [
          {
            q: "How to access e-Paatha and the Library?",
            a: "Follow these steps to learn:<br/>" +
               "• <b>e-Paatha</b>: Access video lessons, structured playlists, and notes directly inside the app.<br/>" +
               "• <b>Library</b>: A future repository for traditional astrology books, reference PDFs, and study materials."
          },
          {
            q: "How to subscribe to app updates and notifications?",
            a: "Follow these steps to subscribe to notifications:<br/>" +
               "1. Click the notification bell icon at the top-right of the dashboard.<br/>" +
               "2. Allow browser notifications to receive push updates on new features, lessons, and schedules."
          }
        ]
      },
      {
        id: "support",
        title: "💖 Voluntary Support",
        items: [
          {
            q: "Is e-Jyotisha free to use?",
            a: "Yes.<br/>" +
               "• e-Jyotisha is <b>freely available</b> for all sincere learners of Vedic Astrology.<br/>" +
               "• No payment, subscription, or registration is required to access the features."
          },
          {
            q: "Why is there a Support page if the app is free?",
            a: "• The Support page exists for those who feel the project has been helpful and wish to contribute voluntarily.<br/>" +
               "• Contributions are entirely voluntary, and support is <b>never expected, requested, or required</b>."
          },
          {
            q: "Is support mandatory to access any feature?",
            a: "No.<br/>" +
               "• All tools, calculations, and learning resources remain <b>fully accessible</b> to everyone, regardless of whether they choose to contribute."
          },
          {
            q: "What does my contribution support?",
            a: "Your voluntary contribution helps sustain:<br/>" +
               "• <b>Platform Maintenance</b>: Server, hosting, internet, and utilities.<br/>" +
               "• <b>Development & Upgrades</b>: Creation of new tools, features, and learning modules.<br/>" +
               "• <b>Research Resources</b>: Access to texts, studies, and testing libraries.<br/>" +
               "• <b>Sustaining the Family</b>: Supporting the basic needs of the family while continuing this educational work."
          },
          {
            q: "Is this a commercial project?",
            a: "No.<br/>" +
               "• e-Jyotisha is primarily an <b>educational initiative</b> to preserve traditional Jyotisha knowledge.<br/>" +
               "• It is not run as a commercial business or a profit-making enterprise."
          },
          {
            q: "Why do you describe support as a voluntary offering?",
            a: "• The platform follows the spirit of <b>Amrita Vritti</b> — receiving only what is willingly and joyfully offered.<br/>" +
               "• We do not ask, expect, or try to influence anyone to donate. Support is accepted with deep gratitude."
          },
          {
            q: "Will I receive special access if I contribute?",
            a: "No.<br/>" +
               "• A contribution does not buy special privileges, prediction services, personalized consultations, or priority support.<br/>" +
               "• It remains a pure, voluntary gesture of goodwill."
          },
          {
            q: "Will my name be displayed publicly?",
            a: "No.<br/>" +
               "• All contributions are treated <b>respectfully and privately</b>.<br/>" +
               "• Your details will never be displayed publicly unless you explicitly request it."
          },
          {
            q: "Can I support anonymously?",
            a: "Yes.<br/>" +
               "• Anonymous contributions are welcome and supported by most payment channels."
          },
          {
            q: "I cannot contribute financially. Can I still support the project?",
            a: "Absolutely! You can support the project in several meaningful ways:<br/>" +
               "1. **Sincere Use**: Use the application for your study and practice.<br/>" +
               "2. **Feedback**: Report bugs, suggest improvements, and share constructive ideas.<br/>" +
               "3. **Peer Support**: Help other students learn and use the platform.<br/>" +
               "4. **Responsible Sharing**: Share knowledge with others in a respectful and helpful manner."
          },
          {
            q: "How much should I contribute?",
            a: "• There is <b>no suggested or recommended amount</b>.<br/>" +
               "• Any offering should arise purely from your own inner wishes, appreciation, and personal circumstances."
          },
          {
            q: "What if I choose not to contribute?",
            a: "• That is perfectly fine!<br/>" +
               "• You are completely welcome to use all features of the application freely and without any hesitation."
          },
          {
            q: "Do you store my payment information?",
            a: "No.<br/>" +
               "• e-Jyotisha <b>does not store or handle</b> any banking, credit card, or payment details.<br/>" +
               "• All transactions are securely processed by the third-party payment provider of your choice."
          },
          {
            q: "What is the intention behind this project?",
            a: "• The core intention is to make <b>traditional Jyotisha learning accessible</b>, practical, and completely free for sincere students.<br/>" +
               "• Contributions simply help sustain the effort required to build and keep the platform running."
          }
        ]
      },
      {
        id: "faqs",
        title: "❓ General FAQs",
        items: [
          {
            q: "Is e-Jyotisha commercial?",
            a: "No. Key principles:<br/>" +
               "• <b>Free Education</b>: e-Jyotisha is a 100% free, non-commercial educational service.<br/>" +
               "• <b>No Ads</b>: Created to help students learn without ads, subscriptions, or pop-ups."
          },
          {
            q: "Where is my personal data saved?",
            a: "To ensure absolute privacy, data storage follows these rules:<br/>" +
               "• <b>Local Storage</b>: All personal details, saved profiles, and generated charts are stored locally on your device's browser.<br/>" +
               "• <b>No Servers</b>: We do not upload your data to any server.<br/>" +
               "• <b>Important Note</b>: Clearing your browser's history or cache may delete your data, so downloading JSON backups regularly is highly recommended."
          }
        ]
      }
    ]
  },
  te: {
    title: "FAQ & లెర్నింగ్ సెంటర్",
    subtitle: "తరచుగా అడిగే ప్రశ్నలు (FAQs) మరియు ఉపయోగకరమైన సమాచారం.",
    searchPlaceholder: "శోధించండి...",
    noResults: "సరిపోయే సమాచారం లభించలేదు.",
    categories: [
      {
        id: "getting-started",
        title: "📱 పరిచయం & ఇన్‌స్టాలేషన్",
        items: [
          {
            q: "e-Jyotisha అంటే ఏమిటి?",
            a: "<b>e-Jyotisha</b> అనేది జ్యోతిష్య విద్యార్థుల కోసం రూపొందించిన ఉచిత వెబ్ యాప్. ఇందులో పాత <b>ఈ-పాఠాలు</b> మరియు <b>ఈ-జాతకం</b> ఫీచర్‌లను కలిపి ఒకే ప్లాట్‌ఫారమ్‌గా అందించడం జరిగింది."
          },
          {
            q: "యాప్‌ను ఇన్‌స్టాల్ చేయడం ఎలా?",
            a: "• **ఆండ్రాయిడ్**: క్రోమ్ బ్రౌజర్‌లో ఓపెన్ చేసి పైన ఉన్న **'Install'** బటన్ క్లిక్ చేయండి.<br/>• **ఐఫోన్**: సఫారీ బ్రౌజర్‌లో ఓపెన్ చేసి **'Share'** బటన్ నొక్కి **'Add to Home Screen'** ఎంచుకోండి.<br/>• **స్మార్ట్ టీవీ**: టీవీ బ్రౌజర్‌లో <b>vaiswanara.com/jyotisha</b> అని టైప్ చేసి వాడవచ్చు."
          }
        ]
      },
      {
        id: "dashboard",
        title: "👤 పర్సనల్ డ్యాష్‌బోర్డ్",
        items: [
          {
            q: "డ్యాష్‌బోర్డ్ (Me) ఎలా సెట్ చేయాలి?",
            a: "యాప్‌లో <b>Me</b> మెనూకు వెళ్లి మీ పేరు, జనన వివరాలు నమోదు చేసి సేవ్ చేయండి. దీని ద్వారా ప్రతిరోజూ మీకు తారాబలం, చంద్రబలం, గురుబలం, శనిబలం మరియు నిత్య సంకల్పం లభిస్తాయి."
          }
        ]
      },
      {
        id: "support",
        title: "💖 స్వచ్ఛంద సహకారం (Support)",
        items: [
          {
            q: "e-Jyotisha ఉచితంగా లభిస్తుందా?",
            a: "అవును.<br/>" +
               "• e-Jyotisha వేద జ్యోతిష్యాన్ని అభ్యసించే విద్యార్థులందరికీ <b>ఉచితంగా</b> లభిస్తుంది.<br/>" +
               "• యాప్ ఫీచర్లను ఉపయోగించుకోవడానికి ఎటువంటి రిజిస్ట్రేషన్ లేదా రుసుము అవసరం లేదు."
          },
          {
            q: "యాప్ ఉచితం అయినప్పుడు స్వచ్ఛంద సహకారం (Support) పేజీ ఎందుకు ఉంది?",
            a: "• ఈ ప్రాజెక్ట్ ఉపయోగకరంగా ఉందని భావించి, స్వచ్ఛందంగా సహాయం చేయాలనుకునే వారి కోసం ఈ పేజీ అందించబడింది.<br/>" +
               "• ఇది కేవలం మీ ఇష్టపూర్వక సహకారం మాత్రమే, విరాళాలు ఇవ్వాలని ఎటువంటి <b>బలవంతం కానీ నియమం కానీ లేదు</b>."
          },
          {
            q: "యాప్ ఫీచర్లను వాడటానికి విరాళం ఇవ్వడం తప్పనిసరియా?",
            a: "కాదు.<br/>" +
               "• ఎటువంటి విరాళం ఇవ్వకపోయినా యాప్ లోని అన్ని జాతక చక్రాలు, పాఠాలు మరియు సాధనాలు అందరికీ <b>పూర్తిగా అందుబాటులో ఉంటాయి</b>."
          },
          {
            q: "నా సహాయం దేనికి ఉపయోగపడుతుంది?",
            a: "మీ స్వచ్ఛంద సహకారం కింది వాటికి ఉపయోగపడుతుంది:<br/>" +
               "• <b>ప్లాట్‌ఫారమ్ నిర్వహణ</b>: సర్వర్, హోస్టింగ్, ఇంటర్నెట్ మరియు సాంకేతిక ఖర్చులు.<br/>" +
               "• <b>అభివృద్ధి & నవీకరణలు</b>: కొత్త పరికరాలు, ఫీచర్లు మరియు విద్యా విభాగాల నిర్మాణం.<br/>" +
               "• <b>పరిశోధన వనరులు</b>: ప్రాచీన గ్రంథాలు మరియు పరిశోధనా సామగ్రి సముపార్జన.<br/>" +
               "• <b>కుటుంబ కనీస అవసరాలు</b>: కుటుంబ కనీస అవసరాలను తీరుస్తూ ఈ విద్యా సేవను నిరంతరాయంగా కొనసాగించడం."
          },
          {
            q: "ఇది వాణిజ్యపరమైన (Commercial) ప్రాజెక్టా?",
            a: "కాదు.<br/>" +
               "• e-Jyotisha ప్రధానంగా సాంప్రదాయ జ్యోతిష్య జ్ఞానాన్ని విద్యార్థులకు అందించడం కోసం నిర్మించిన <b>విద్యా సేవా ప్రాజెక్ట్</b>.<br/>" +
               "• ఇది ఎటువంటి వాణిజ్య ప్రయోజనాల కోసం లేదా లాభాపేక్షతో నడపబడటం లేదు."
          },
          {
            q: "విరాళాన్ని 'స్వచ్ఛంద సమర్పణ' అని ఎందుకు అంటారు?",
            a: "• ఈ ప్రాజెక్ట్ <b>'అమృత వృత్తి'</b> స్ఫూర్తితో నడుస్తుంది - అంటే అడగకుండా, ఆశించకుండా ఇచ్చే స్వచ్ఛంద సమర్పణలను మాత్రమే స్వీకరిస్తాము.<br/>" +
               "• సహాయం చేయమని మేము ఎవరినీ అడగము, ఆశించము. మీ అంతట మీరు ఇచ్చే సహకారాన్ని కృతజ్ఞతతో స్వీకరిస్తాము."
          },
          {
            q: "విరాళం ఇస్తే నాకు ప్రత్యేక సదుపాయాలు ఏమైనా లభిస్తాయా?",
            a: "లేదు.<br/>" +
               "• విరాళం ఇవ్వడం వల్ల ఎటువంటి ప్రత్యేక హక్కులు, వ్యక్తిగత జాతక విశ్లేషణలు లేదా ప్రాధాన్యత సహాయం లభించవు.<br/>" +
               "• ఇది కేవలం మీ సద్భావనకు ప్రతీక మాత్రమే."
          },
          {
            q: "నా పేరు బహిరంగంగా ప్రదర్శించబడుతుందా?",
            a: "లేదు.<br/>" +
               "• మీ విరాళాల వివరాలు అత్యంత <b>గౌరవప్రదంగా మరియు గోప్యంగా</b> ఉంచబడతాయి.<br/>" +
               "• మీరు ప్రత్యేకంగా కోరితే తప్ప మీ పేరు ఎక్కడా ప్రదర్శించబడదు."
          },
          {
            q: "నేను అనామకంగా (Anonymously) సహాయం చేయవచ్చా?",
            a: "అవును.<br/>" +
               "• చాలా పేమెంట్ పద్ధతులు అనామకంగా సహాయం చేయడానికి అనుకూలంగా ఉంటాయి."
          },
          {
            q: "నేను ఆర్థికంగా సహాయం చేయలేను, మరి ఇతర మార్గాలలో సహాయపడగలనా?",
            a: "తప్పకుండా! మీరు కింది మార్గాలలో సహాయం చేయవచ్చు:<br/>" +
               "1. **నిజాయితీ గల ఉపయోగం**: మీ అధ్యయనం మరియు సాధన కోసం యాప్‌ను క్రమం తప్పకుండా ఉపయోగించడం.<br/>" +
               "2. **అభిప్రాయాలు**: లోపాలను నివేదించడం మరియు మెరుగుదలల కోసం సూచనలు ఇవ్వడం.<br/>" +
               "3. **సహాయం**: ఇతర జ్యోతిష్య విద్యార్థులకు ఈ ప్లాట్‌ఫారమ్ గురించి తెలియజేసి సహాయపడటం.<br/>" +
               "4. **బాధ్యతాయుతమైన భాగస్వామ్యం**: జ్ఞానాన్ని ఇతరులతో గౌరవప్రదంగా పంచుకోవడం."
          },
          {
            q: "నేను ఎంత సహాయం చేయాలి?",
            a: "• దీనికి ఎటువంటి <b>నిర్ణీత రుసుము లేదు</b>.<br/>" +
               "• సహాయం అనేది కేవలం మీ మనస్ఫూర్తిగా, మీ వీలును బట్టి మాత్రమే ఉండాలి."
          },
          {
            q: "నేను సహాయం చేయకపోతే ఏమవుతుంది?",
            a: "• ఏమీ కాదు!<br/>" +
               "• ఎటువంటి సంకోచం లేకుండా మీరు యాప్ ఫీచర్లన్నింటినీ ఎల్లప్పుడూ ఉచితంగా ఉపయోగించుకోవచ్చు."
          },
          {
            q: "నా పేమెంట్ సమాచారాన్ని మీరు భద్రపరుస్తారా?",
            a: "లేదు.<br/>" +
               "• e-Jyotisha మీ బ్యాంకింగ్, కార్డ్ లేదా పేమెంట్ వివరాలను <b>సేకరించదు లేదా నిల్వ చేయదు</b>.<br/>" +
               "• పేమెంట్స్ అన్నీ మీరు ఎంచుకున్న పేమెంట్ గేట్‌వే ద్వారానే సురక్షితంగా జరుగుతాయి."
          },
          {
            q: "ఈ ప్రాజెక్ట్ వెనుక ఉన్న ముఖ్య ఉద్దేశం ఏమిటి?",
            a: "• సాంప్రదాయ జ్యోతిష్య విద్యను సులభంగా, ఉచితంగా విద్యార్థులందరికీ అందుబాటులో ఉంచడమే ఈ ప్రాజెక్ట్ యొక్క ముఖ్య ఉద్దేశం.<br/>" +
               "• మీ సహాయాలు ఈ సేవను నిరంతరాయంగా కొనసాగించడానికి మాత్రమే తోడ్పడతాయి."
          }
        ]
      },
      {
        id: "faqs",
        title: "❓ సాధారణ ప్రశ్నలు (FAQs)",
        items: [
          {
            q: "1. జాతకం (Birth Chart) ఎలా వేయాలి?",
            a: "<b>ఈ-జాతకం</b> పేజీకి వెళ్లి, పేరు, పుట్టిన తేదీ, సమయం మరియు ఊరు నమోదు చేయండి. ఆ తర్వాత 'జాతక చక్రాలను గణించు' బటన్ పై క్లిక్ చేయండి. తర్వాతి అవసరాల కోసం ప్రొఫైల్‌ను సేవ్ చేసుకోవచ్చు."
          },
          {
            q: "2. అష్టకూట వివాహ పొంతన (e-Match) ఎలా చూడాలి?",
            a: "<b>ఈ-పొంతన</b> పేజీకి వెళ్ళండి. వధూవరుల వివరాలను నమోదు చేయండి. 'అష్టకూట పొంతన గణించు' పై క్లిక్ చేస్తే గుణమేళనం మరియు దోషాల వివరాలు వస్తాయి."
          },
          {
            q: "3. నా డేటా భద్రమేనా?",
            a: "అవును, 100% సురక్షితం. మీ డేటా అంతా <b>మీ బ్రౌజర్/పరికరంలోనే నిల్వ ఉంటుంది</b>. సర్వర్‌కు ఏ సమాచారమూ పంపబడదు, కాబట్టి బ్యాకప్ తీసుకోవడం మరువకండి."
          }
        ]
      }
    ]
  },
  kn: {
    title: "FAQ & ಲರ್ನಿಂಗ್ ಸೆಂಟರ್",
    subtitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQs) ಮತ್ತು ಕಲಿಕಾ ಮಾಹಿತಿ.",
    searchPlaceholder: "ಹುಡುಕಿ...",
    noResults: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    categories: [
      {
        id: "getting-started",
        title: "📱 ಪರಿಚಯ & ಇನ್‌ಸ್ಟಾಲೇಶನ್",
        items: [
          {
            q: "e-Jyotisha ಎಂದರೇನು?",
            a: "<b>e-Jyotisha</b> ಜ್ಯೋತಿಷ್ಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಉಚಿತವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ವೆಬ್ ಆಪ್ ಆಗಿದೆ. ಹಿಂದೆ ಇದ್ದ <b>ಇ-ಪಾಠ</b> ಮತ್ತು <b>ಇ-ಜಾತಕ</b> ಆಪ್‌ಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ ಇದನ್ನು ನಿರ್ಮಿಸಲಾಗಿದೆ."
          },
          {
            q: "ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವುದು ಹೇಗೆ?",
            a: "• **ಆಂಡ್ರಾಯ್ಡ್**: ಕ್ರೋಮ್ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ತೆರೆದು ಮೇಲಿರುವ **'Install'** ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.<br/>• **ಐಫೋನ್**: ಸಫಾರಿ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ತೆರೆದು **'Share'** ಒತ್ತಿ **'Add to Home Screen'** ಆಯ್ಕೆಮಾಡಿ."
          }
        ]
      },
      {
        id: "dashboard",
        title: "👤 ಪರ್ಸನಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        items: [
          {
            q: "ನನ್ನ ಪ್ರೊಫೈಲ್ ಸೆಟ್ ಮಾಡುವುದು ಹೇಗೆ?",
            a: "ಆಪ್‌ನಲ್ಲಿ <b>Me</b> ಮೆನುವಿಗೆ ಹೋಗಿ ನಿಮ್ಮ ಹೆಸರು, ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಸೇವ್ ಮಾಡಿ. ಇದರಿಂದ ಪ್ರತಿದಿನ ನಿಮಗೆ ತಾರಾಬಲ, ಚಂದ್ರಬಲ, ಗುರುಬಲ, ಶನಿಬಲ ಮತ್ತು ದಿನನಿತ್ಯದ ಸಂಕಲ್ಪ ಲಭಿಸುತ್ತದೆ."
          }
        ]
      },
      {
        id: "support",
        title: "💖 ಸ್ವಯಂಪ್ರೇರಿತ ಬೆಂಬಲ (Support)",
        items: [
          {
            q: "e-Jyotisha ಬಳಸಲು ಉಚಿತವೇ?",
            a: "ಹೌದು.<br/>" +
               "• ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಕಲಿಯುವ ಜಿಜ್ಞಾಸುಗಳಿಗಾಗಿ e-Jyotisha ಸಂಪೂರ್ಣವಾಗಿ <b>ಉಚಿತವಾಗಿ</b> ಲಭ್ಯವಿದೆ.<br/>" +
               "• ಆಪ್ ಬಳಸಲು ಯಾವುದೇ ನೋಂದಣಿ ಅಥವಾ ಶುಲ್ಕದ ಅಗತ್ಯವಿರುವುದಿಲ್ಲ."
          },
          {
            q: "ಆಪ್ ಉಚಿತವಾಗಿದ್ದರೆ ಬೆಂಬಲ (Support) ಪುಟ ಏಕೆ ಇದೆ?",
            a: "• ಈ ಯೋಜನೆಯು ತಮಗೆ ಉಪಯುಕ್ತವಾಗಿದೆ ಎಂದು ಭಾವಿಸಿ ಸ್ವಯಂಪ್ರೇರಿತವಾಗಿ ಸಹಾಯ ಮಾಡಲು ಬಯಸುವವರಿಗಾಗಿ ಈ ಪುಟವಿದೆ.<br/>" +
               "• ಇದು ಸಂಪೂರ್ಣವಾಗಿ ಐಚ್ಛಿಕವಾಗಿದ್ದು, ಕೊಡುಗೆ ನೀಡಲು ಯಾವುದೇ <b>ನಿರೀಕ್ಷೆ ಅಥವಾ ಒತ್ತಾಯ ಇರುವುದಿಲ್ಲ</b>."
          },
          {
            q: "ಆಪ್ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಬಳಸಲು ಕೊಡುಗೆ ನೀಡುವುದು ಕಡ್ಡಾಯವೇ?",
            a: "ಇಲ್ಲ.<br/>" +
               "• ಕೊಡುಗೆ ನೀಡಲಿ ಅಥವಾ ನೀಡದಿರಲಿ, ಎಲ್ಲಾ ಪರಿಕರಗಳು ಮತ್ತು ಪಾಠಗಳು ಎಲ್ಲರಿಗೂ <b>ಸಂಪೂರ್ಣವಾಗಿ ಮುಕ್ತವಾಗಿ ಲಭ್ಯವಿರುತ್ತವೆ</b>."
          },
          {
            q: "ನನ್ನ ಕೊಡುಗೆ ಯಾವುದಕ್ಕೆ ಬಳಕೆಯಾಗುತ್ತದೆ?",
            a: "ನಿಮ್ಮ ಸ್ವಯಂಪ್ರೇರಿತ ಕೊಡುಗೆಯು ಈ ಕೆಳಗಿನವುಗಳಿಗೆ ಸಹಕಾರಿಯಾಗುತ್ತದೆ:<br/>" +
               "• <b>ತಾಂತ್ರಿಕ ನಿರ್ವಹಣೆ</b>: ಸರ್ವರ್, ಹೋಸ್ಟಿಂಗ್, ಇಂಟರ್ನೆಟ್ ಮತ್ತು ನಿರ್ವಹಣಾ ವೆಚ್ಚಗಳು.<br/>" +
               "• <b>ಅಭಿವೃದ್ಧಿ ಮತ್ತು ವೈಶಿಷ್ಟ್ಯಗಳು</b>: ಹೊಸ ಉಪಕರಣಗಳು, ವೈಶಿಷ್ಟ್ಯಗಳು ಮತ್ತು ಕಲಿಕಾ ವಿಷಯಗಳ ಅಭಿವೃದ್ಧಿ.<br/>" +
               "• <b>ಸಂಶೋಧನೆ</b>: ಸಾಂಪ್ರದಾಯಿಕ ಗ್ರಂಥಗಳು ಮತ್ತು ಸಂಶೋಧನಾ ಸಂಪನ್ಮೂಲಗಳ ಕ್ರೋಢೀಕರಣ.<br/>" +
               "• <b>ಕುಟುಂಬದ ಮೂಲಭೂತ ಅಗತ್ಯಗಳು</b>: ಕುಟುಂಬದ ಮೂಲಭೂತ ಅಗತ್ಯಗಳನ್ನು ಪೂರೈಸುತ್ತಾ ಈ ಶೈಕ್ಷಣಿಕ ಸೇವೆಯನ್ನು ಮುಂದುವರಿಸಲು."
          },
          {
            q: "ಇದು ವಾಣಿಜ್ಯ (Commercial) ಯೋಜನೆಯೇ?",
            a: "ಇಲ್ಲ.<br/>" +
               "• e-Jyotisha ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಯೋತಿಷ್ಯ ಜ್ಞಾನವನ್ನು ಸಂರಕ್ಷಿಸಲು ಮತ್ತು ಹಂಚಿಕೊಳ್ಳಲು ರೂಪಿಸಲಾದ <b>ಶೈಕ್ಷಣಿಕ ಸೇವೆಯಾಗಿದೆ</b>.<br/>" +
               "• ಇದನ್ನು ವಾಣಿಜ್ಯ ಉದ್ದೇಶಕ್ಕಾಗಿ ಅಥವಾ ಲಾಭ ಗಳಿಕೆಗಾಗಿ ನಡೆಸಲಾಗುತ್ತಿಲ್ಲ."
          },
          {
            q: "ಕೊಡುಗೆಯನ್ನು ಸ್ವಯಂಪ್ರೇರಿತ ಸಮರ್ಪಣೆ ಎಂದು ಏಕೆ ಕರೆಯುತ್ತೀರಿ?",
            a: "• ಈ ಯೋಜನೆಯು <b>'ಅಮೃತ ವೃತ್ತಿ'</b>ಯ ತತ್ವದಂತೆ ನಡೆಯುತ್ತದೆ - ಅಂದರೆ ಕೇಳದೆ, ಆಶೇಕ್ಷಿಸದೆ ಕೊಡುವ ಸ್ವಯಂಪ್ರೇರಿತ ಸಮರ್ಪಣೆಯನ್ನು ಮಾತ್ರ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.<br/>" +
               "• ನಾವು ಯಾರಿಂದಲೂ ಸಹಾಯವನ್ನು ಅಪೇಕ್ಷಿಸುವುದಿಲ್ಲ, ಕೇವಲ ನಿಮ್ಮ ಇಚ್ಛೆಯ ಕೊಡುಗೆಯನ್ನು ಅತ್ಯಂತ ಕೃತಜ್ಞತೆಯಿಂದ ಸ್ವೀಕರಿಸುತ್ತೇವೆ."
          },
          {
            q: "ಕೊಡುಗೆ ನೀಡಿದರೆ ನನಗೆ ವಿಶೇಷ ಸೌಲಭ್ಯಗಳು ಸಿಗುತ್ತವೆಯೆ?",
            a: "ಇಲ್ಲ.<br/>" +
               "• ಕೊಡುಗೆ ನೀಡುವುದರಿಂದ ಯಾವುದೇ ವಿಶೇಷ ಸೌಲಭ್ಯಗಳು, ವೈಯಕ್ತಿಕ ಭವಿಷ್ಯ ನುಡಿಗಳು ಅಥವಾ ಜಾತಕ ವಿಶ್ಲೇಷಣೆ ಸೇವೆಗಳು ದೊರೆಯುವುದಿಲ್ಲ.<br/>" +
               "• ಇದು ಕೇವಲ ನಿಮ್ಮ ಅಭಿಮಾನದ ಪ್ರತೀಕವಾಗಿದೆ."
          },
          {
            q: "ನನ್ನ ಹೆಸರನ್ನು ಸಾರ್ವಜನಿಕವಾಗಿ ಪ್ರದರ್ಶಿಸಲಾಗುತ್ತದೆಯೇ?",
            a: "ಇಲ್ಲ.<br/>" +
               "• ಎಲ್ಲಾ ಕೊಡುಗೆಗಳ ವಿವರಗಳನ್ನು <b>ಗೌಪ್ಯವಾಗಿ ಮತ್ತು ಗೌರವಯುತವಾಗಿ</b> ಇಡಲಾಗುತ್ತದೆ.<br/>" +
               "• ನೀವು ವಿಶೇಷವಾಗಿ ವಿನಂತಿಸಿದ ಹೊರತು ನಿಮ್ಮ ಹೆಸರನ್ನು ಎಲ್ಲೂ ಪ್ರದರ್ಶಿಸುವುದಿಲ್ಲ."
          },
          {
            q: "ನಾನು ಅನಾಮಧೇಯವಾಗಿ (Anonymously) ಬೆಂಬಲಿಸಬಹುದೇ?",
            a: "ಹೌದು.<br/>" +
               "• ಅನೇಕ ಪಾವತಿ ವಿಧಾನಗಳು ಅನಾಮಧೇಯವಾಗಿ ಬೆಂಬಲಿಸಲು ಅನುಕೂಲ ಮಾಡಿಕೊಡುತ್ತವೆ."
          },
          {
            q: "ನಾನು ಆರ್ಥಿಕವಾಗಿ ಕೊಡುಗೆ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಬೆಂಬಲಿಸಬಹುದೇ?",
            a: "ಖಂಡಿತವಾಗಿ! ನೀವು ಈ ಕೆಳಗಿನ ವಿಧಾನಗಳಲ್ಲಿ ಬೆಂಬಲಿಸಬಹುದು:<br/>" +
               "1. **ಪ್ರಾಮಾಣಿಕ ಬಳಕೆ**: ನಿಮ್ಮ ಸ್ವಂತ ಜ್ಞಾನಾರ್ಜನೆಗಾಗಿ ಆಪ್ ಅನ್ನು ಬಳಸಬಹುದು.<br/>" +
               "2. **ಪ್ರತಿಕ್ರಿಯೆಗಳು**: ದೋಷಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ ನಮಗೆ ತಿಳಿಸುವುದು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ನೀಡುವುದು.<br/>" +
               "3. **ಸಹಪಾಠಿಗಳಿಗೆ ಸಹಾಯ**: ಇತರ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಈ ಆಪ್ ಪರಿಚಯಿಸಿ ಸಹಾಯ ಮಾಡುವುದು.<br/>" +
               "4. **ಜ್ಞಾನ ಹಂಚಿಕೆ**: ಪಡೆದ ಜ್ಞಾನವನ್ನು ಜವಾಬ್ದಾರಿಯುತವಾಗಿ ಇತರರಿಗೆ ಹಂಚುವುದು."
          },
          {
            q: "ನಾನು ಎಷ್ಟು ಕೊಡುಗೆ ನೀಡಬೇಕು?",
            a: "• ಯಾವುದೇ <b>ನಿಗದಿತ ಮೊತ್ತವಿಲ್ಲ</b>.<br/>" +
               "• ನಿಮ್ಮ ಆರ್ಥಿಕ ಸ್ಥಿತಿ ಮತ್ತು ಇಚ್ಛೆಯನುಸಾರ ಎಷ್ಟು ಬೇಕಾದರೂ ಸಮರ್ಪಿಸಬಹುದು."
          },
          {
            q: "ಕೊಡುಗೆ ನೀಡದಿದ್ದರೆ ಏನಾಗುತ್ತದೆ?",
            a: "• ಯಾವುದೇ ತೊಂದರೆಯಿಲ್ಲ!<br/>" +
               "• ಯಾವುದೇ ಹಿಂಜರಿಕೆಯಿಲ್ಲದೆ ನೀವು ಯಾವಾಗಲೂ ಆಪ್ ಅನ್ನು ಮುಕ್ತವಾಗಿ ಬಳಸಬಹುದು."
          },
          {
            q: "ನನ್ನ ಪಾವತಿ ಮಾಹಿತಿಯನ್ನು ನೀವು ಸಂಗ್ರಹಿಸುತ್ತೀರಾ?",
            a: "ಇಲ್ಲ.<br/>" +
               "• e-Jyotisha ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು <b>ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ</b>.<br/>" +
               "• ಎಲ್ಲಾ ವಹಿವಾಟುಗಳು ನೀವು ಆರಿಸಿದ ಪಾವತಿ ಗೇಟ್‌ವೇ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ನಡೆಯುತ್ತವೆ."
          },
          {
            q: "ಈ ಯೋಜನೆಯ ಹಿಂದಿನ ಉದ್ದೇಶವೇನು?",
            a: "• ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಯೋತಿಷ್ಯ ಶಿಕ್ಷಣವನ್ನು ಸರಳವಾಗಿ ಮತ್ತು ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿ ಎಲ್ಲರಿಗೂ ತಲುಪಿಸುವುದೇ ಈ ಯೋಜನೆಯ ಮುಖ್ಯ ಉದ್ದೇಶವಾಗಿದೆ.<br/>" +
               "• ನಿಮ್ಮ ಬೆಂಬಲವು ಈ ಶೈಕ್ಷಣಿಕ ಸೇವೆಯನ್ನು ಮುಂದುವರಿಸಲು ಮಾತ್ರ ಸಹಾಯ ಮಾಡುತ್ತದೆ."
          }
        ]
      },
      {
        id: "faqs",
        title: "❓ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQs)",
        items: [
          {
            q: "1. ಜಾತಕವನ್ನು (Birth Chart) ಹೇಗೆ ರಚಿಸುವುದು?",
            a: "<b>ಇ-ಜಾತಕ</b> ಪುಟಕ್ಕೆ ಹೋಗಿ, ಹೆಸರು, ಜನನ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ 'ಜಾತಕ ಚಕ್ರಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ' ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ."
          },
          {
            q: "2. ಹೊಂದಾಣಿಕೆ (e-Match) ಹೇಗೆ ಮಾಡುವುದು?",
            a: "<b>ಇ-ಹೊಂದಾಣಿಕೆ</b> ಪುಟಕ್ಕೆ ಹೋಗಿ ವಧು-ವರರ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ 'ಅಷ್ಟಕೂಟ ಹೊಂದಾಣಿಕೆ ಲೆಕ್ಕಹಾಕಿ' ಕ್ಲಿಕ್ ಮಾಡಿ."
          },
          {
            q: "3. ನನ್ನ ಡೇಟಾ ಸುರಕ್ಷಿತವೇ?",
            a: "ಹೌದು, ನಿಮ್ಮ ಡೇಟಾ <b>ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ ಸೇವ್ ಆಗುತ್ತದೆ</b>. ನಾವು ಯಾವುದೇ ಮಾಹಿತಿಯನ್ನು ನಮ್ಮ ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸುವುದಿಲ್ಲ."
          }
        ]
      }
    ]
  }
};

export function HelpPage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const content = GUIDE_SECTIONS[lang] || GUIDE_SECTIONS.en;

  const [activeTab, setActiveTab] = useState(content.categories[0]?.id || "getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on search query
  const getAllFilteredItems = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return null;

    const filtered = [];
    content.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (
          item.q.toLowerCase().includes(query) ||
          item.a.toLowerCase().includes(query)
        ) {
          filtered.push({ ...item, categoryTitle: cat.title });
        }
      });
    });
    return filtered;
  };

  const filteredSearchItems = getAllFilteredItems();
  const activeCategory = content.categories.find((c) => c.id === activeTab) || content.categories[0];

  return (
    <main
      className="page help-page"
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
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: "20px", position: "relative", width: "100%" }}>
          <input
            type="text"
            placeholder={content.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 40px 12px 16px",
              border: "2px solid #eadfce",
              borderRadius: "8px",
              fontSize: "1rem",
              background: "#fffdf8",
              color: "#333",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "1.1rem",
                color: "#95a5a6",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>

        <style>{`
          .help-container {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 24px;
            width: 100%;
            align-items: start;
          }
          .help-sidebar {
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: #fffdf8;
            border: 1px solid #eadfce;
            border-radius: 8px;
            padding: 10px;
          }
          .help-tab-btn {
            background: none;
            border: none;
            text-align: left;
            padding: 10px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.95rem;
            color: #5d5c58;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          .help-tab-btn:hover {
            background: #fbf8f0;
            color: #8e44ad;
          }
          .help-tab-btn.active {
            background: #8e44ad;
            color: #fff;
            font-weight: bold;
          }
          .help-content {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          }
          .faq-details {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.01);
            overflow: hidden;
            transition: border-color 0.2s ease;
          }
          .faq-details:hover {
            border-color: #8e44ad;
          }
          .faq-summary {
            padding: 15px 20px;
            font-size: 1.05rem;
            font-weight: 700;
            color: #2c3e50;
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
            font-size: 0.75rem;
            color: #7f8c8d;
            transition: transform 0.2s ease;
          }
          .faq-details[open] .faq-summary::after {
            transform: rotate(180deg);
          }
          .faq-content {
            padding: 15px 20px;
            border-top: 1px solid #e0e0e0;
            color: #34495e;
            line-height: 1.6;
            font-size: 0.95rem;
            background: #fffdfa;
          }
          .faq-content a {
            color: #8e44ad;
            text-decoration: underline;
          }
          .search-tag {
            display: inline-block;
            font-size: 0.75rem;
            background: #f1f2f6;
            color: #57606f;
            padding: 2px 6px;
            border-radius: 4px;
            margin-bottom: 8px;
            font-weight: bold;
          }

          @media (max-width: 768px) {
            .help-container {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            .help-sidebar {
              flex-direction: row;
              overflow-x: auto;
              white-space: nowrap;
              padding: 8px;
              gap: 8px;
            }
            .help-tab-btn {
              padding: 6px 12px;
              font-size: 0.85rem;
            }
          }
        `}</style>

        {filteredSearchItems !== null ? (
          /* Search Results View */
          <div className="help-content">
            <h3 style={{ marginTop: 0, color: "#8e44ad" }}>
              Search Results ({filteredSearchItems.length})
            </h3>
            {filteredSearchItems.length === 0 ? (
              <p style={{ color: "#7f8c8d" }}>{content.noResults}</p>
            ) : (
              filteredSearchItems.map((item, index) => (
                <details className="faq-details" key={index} open>
                  <summary className="faq-summary">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span className="search-tag">{item.categoryTitle}</span>
                      <span>{item.q}</span>
                    </div>
                  </summary>
                  <div
                    className="faq-content"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  ></div>
                </details>
              ))
            )}
          </div>
        ) : (
          /* Category / Tab View */
          <div className="help-container">
            {/* Sidebar navigation */}
            <div className="help-sidebar">
              {content.categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`help-tab-btn ${activeTab === cat.id ? "active" : ""}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Main documentation content */}
            <div className="help-content">
              <h3 style={{ marginTop: 0, color: "#8e44ad", borderBottom: "1.5px solid #eee", paddingBottom: "10px" }}>
                {activeCategory.title}
              </h3>
              <div style={{ marginTop: "15px" }}>
                {activeCategory.items.map((item, index) => (
                  <details className="faq-details" key={index} open={index === 0}>
                    <summary className="faq-summary">{item.q}</summary>
                    <div
                      className="faq-content"
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    ></div>
                  </details>
                ))}
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
      </footer>
    </main>
  );
}

