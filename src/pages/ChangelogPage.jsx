import React from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

export function ChangelogPage({ logoUrl }) {
  const { t } = useTranslation();

  const changelogData = [
    {
      date: "07-07-2026",
      color: "#2ecc71",
      items: [
        {
          title: "Sankalpa Lunar Month Fix",
          desc: "Integrated masa.json lookup in Sankalpa.jsx to correctly identify lunar months (e.g., Nija Jyeshtha showing as Ashadha due to linear approximation errors) with standard calculation fallback."
        },
        {
          title: "Nadi & Bhakoot Compatibility Rules Fixes",
          desc: "Corrected Nakshatra Nadi assignments in matchCalculator.js to use the standard Vedic snake-like cyclic pattern. Updated getAmshaNadi to lookup based on actual Nakshatra Nadi. Removed all fall-through cancellation logic to enforce 0 score for same Janma Nadi and bad Rashi relations (5/9, 6/8, 2/12)."
        }
      ]
    },
    {
      date: "29-06-2026",
      color: "#8e44ad",
      items: [
        {
          title: "Dashboard Profile Management Upgrade",
          desc: "Upgraded the profile management on the Me Dashboard to support the same saved profiles list as the other pages."
        },
        {
          title: "Interactive Profile Dropdown",
          desc: "Shortened and simplified the dashboard profile menu options to ➕ Add, 👥 Switch, ✏️ Edit, and 🗑️ Clear for a cleaner dropdown layout."
        },
        {
          title: "Quick Profile Actions",
          desc: "Users can now add new local profiles, switch between existing saved profiles in the local database, edit active profile details, or clear dashboard selections directly."
        }
      ]
    },
    {
      date: "28-06-2026",
      color: "#3498db",
      items: [
        {
          title: "Panchanga Page Layout Redesign",
          desc: "Redesigned the Panchanga page desktop layout, removing unnecessary margins and resizing the D1 chart by 20% (including planetary text)."
        },
        {
          title: "Reminders & Custom Events Tab",
          desc: "Implemented a separate \"Add Events\" tab between Muhurtha and Adhika Masa tabs to save custom events, holidays, or festivals."
        },
        {
          title: "Advanced Reminder Settings",
          desc: "Added JSON/CSV export and import with flexible date format parsing, inline edit/update controls, and clear data buttons."
        },
        {
          title: "Backup & Sync Integration",
          desc: "Integrated custom events into local individual backups, Master Backups, and Google Drive Sync on the Settings page."
        },
        {
          title: "Dhanishtha Nakshatra Translation Fix",
          desc: "Added localizations for the spelling \"Dhanishtha\" across Telugu, Kannada, and English translation files to fix unlocalized displays in the Horoscope UI and generated PDF tables."
        }
      ]
    },
    {
      date: "27-06-2026",
      color: "#8e44ad",
      items: [
        {
          title: "Eka-Vimshathi Dosha Engine",
          desc: "Implemented a practical filtered subset of the 21 Mahadoshas (Eka-Vimshathi) displayed under the Muhurtha tab. The active doshas list is now configurable from the Settings page — users can enable or disable individual doshas as required."
        },
        {
          title: "New Doshas Added",
          desc: "Implemented Sankranti Dosha (checks if the Sun is within 3 days of transitioning to a new sign), Lagna Tyajyamu (calculates the inauspicious discarded portion of the current rising Lagna based on Rashi-specific Ghati rules, 12-minute window), and Sagraha Chandra Dosha (Moon conjunct another planet within 3°)."
        },
        {
          title: "Grahanam (Eclipse) via JSON",
          desc: "Uses a precomputed jyotisha_api/eclipses_data.json database of eclipse dates and Nakshatra names. The backend checks if the Muhurtha date is an eclipse day, and also triggers Grahana Utpata Dosha if the Moon's current Nakshatra matches any eclipse Nakshatra within the past 6 months."
        },
        {
          title: "Lagna Tyajyam Dosha Trigger",
          desc: "If the selected Muhurtha time falls inside the Lagna Tyajyamu window, a Lagna Tyajyam dosha chip is dynamically triggered in the Doshas section."
        },
        {
          title: "Muhurtha Details Panel Redesign",
          desc: "Split the right-hand Muhurtha details card into two separate cards — Muhurtha Details (Lagna, Pushkaraamsha, Muhurtha, Panchakam) and Inauspicious Timings (Rahu Kalam, Yamagandam, Varjyam, Durmuhurtham). Lagna Tyajyamu is now displayed directly below Lagna Mid for visual grouping."
        },
        {
          title: "Inauspicious Timing Triggers",
          desc: "Rahu Kalam, Yamagandam, Varjyam, and Durmuhurtham now trigger as dosha chips in the Doshas section when the selected Muhurtha time overlaps with those intervals."
        },
        {
          title: "Saved Muhurtha Table UI Cleanup",
          desc: "Moved the \"Custom message for PDF export\" text field to a separate full-width row below the action buttons. Removed emoji symbols from all action button labels for a cleaner desktop layout."
        },
        {
          title: "Default Doshas Configuration",
          desc: "Reduced the default active (checked) doshas to a lean practical set — Saptamastha Graha, Bhrigu Shatka, Ashtamastha Kuja, Sankranti Dosha, Asthangatha, Grahanam, Grahana Utpata Dosha, and Rahu Kalam. All other doshas are unchecked by default but can be enabled from Settings."
        }
      ]
    },
    {
      date: "22-06-2026",
      color: "#3498db",
      items: [
        {
          title: "PAV Tab (Time Machine)",
          desc: "Added a new PAV tab in the Time Machine section of the e-Clock page, displaying an animated Prastara Ashtakavarga chart that updates dynamically with the selected time."
        }
      ]
    },
    {
      date: "17-06-2026",
      color: "#8e44ad",
      items: [
        {
          title: "Rename Table",
          desc: "Added a \"Rename Table\" button in the results action panel of both the Panchanga and Muhurtha tabs in PanchangaPage.jsx, allowing users to rename already saved tables with overwrite warnings and automatic dropdown lists/form states updates."
        },
        {
          title: "Masa Sync",
          desc: "Integrated custom user-extracted public/static/masa.json data, converting the custom keys (Masa_Name, Start_Date, End_Date) and IST-formatted timestamps to standard UTC ISO strings (masa, start, end) for seamless timezone-independent client formatting. Corrected Pausha to Pushya naming."
        },
        {
          title: "Location Info",
          desc: "Added location details (place, longitude, latitude, and timezone) under the search results table in both Panchanga tab and PanchangaSearch.jsx."
        },
        {
          title: "JSON Export Metadata",
          desc: "Modified the JSON export Table feature to include location metadata (city, lat, lon, tz) inside the exported JSON object."
        },
        {
          title: "Lagna Precision",
          desc: "Implemented precise Lagna and Pushkaraamsha calculation window calculations using Julian days and binary search in the Node API."
        },
        {
          title: "Cache Ayanamsha",
          desc: "Implemented backend caching of ayanamsha value to optimize performance of binary search calculation."
        },
        {
          title: "Ascendant Fix",
          desc: "Fixed a sign inversion error in ascendant calculation logic."
        }
      ]
    },
    {
      date: "16-06-2026",
      color: "#3498db",
      items: [
        {
          title: "Sunrise Logic Change",
          desc: "Panchanga at sunrise logic removed and displayed panchanga as per realtime."
        },
        {
          title: "Nitya Sankalpa",
          desc: "Nitya Sankalpa moved to a separate page."
        },
        {
          title: "Sankalpa Date Selection",
          desc: "Added date and time selection to Sankalpa page."
        },
        {
          title: "Auto Update",
          desc: "Enabled PWA auto-update mode to automatically download and apply new web app builds/updates immediately without manual hard refreshes or clicks."
        },
        {
          title: "Guru Balam Transits",
          desc: "Implemented next Guru Balam prediction calculation and display on the Me Profile page, utilizing a static JSON database of Jupiter (Guru) transits from 2024 to 2040 for instant offline client-side calculation."
        },
        {
          title: "Shani Balam Transits",
          desc: "Extended prediction feature to Shani Balam (calculates and displays next/ending transit dates for Shani Balam under Option 3 style utilizing a static database of Saturn transits from 2023 to 2041)."
        }
      ]
    },
    {
      date: "15-06-2026",
      color: "#8e44ad",
      items: [
        {
          title: "Nija Jyeshtha Masa Transition Fix",
          desc: "Resolved a bug where the lunar month display failed to transition from Adhika to Nija Jyeshtha on schedule."
        },
        {
          title: "Default Location Fix",
          desc: "Resolved an issue in the Astro Clock (e-Clock) page where the default location was not loaded correctly from preferences."
        },
        {
          title: "Push Notification Scrolling Fix",
          desc: "Fixed a bug where long push messages overflowed and blocked action buttons, preventing the popup from being scrolled."
        },
        {
          title: "Chart Layout Enhancements",
          desc: "Repositioned the D1 and D9 settings gear icons above the charts with a subtle 2px gap to prevent them from overlapping chart cells."
        },
        {
          title: "Visual Clean-up",
          desc: "Made the gear buttons transparent by removing their background shadows, borders, and circular background elements."
        },
        {
          title: "Icon Size Adjustment",
          desc: "Increased the settings gear icon size by 20% for improved accessibility and touch interaction."
        },
        {
          title: "North Indian Chart Type",
          desc: "Added support for North Indian style diamond charts, selectable under General Settings (defaults to South Indian)."
        },
        {
          title: "Global North Indian Layout Support",
          desc: "Implemented North Indian chart layout rendering across Horoscope, Gochara (Transit), Ashtakavarga, Match Making (e-Match), Muhurtha Chakra, Astro Clock (e-Clock), and PDF exports, utilizing bold planet names for high readability."
        },
        {
          title: "Reactive Styling Updates",
          desc: "Ensured that modifying the global chart style instantly synchronizes all open chart views reactively without requiring page refreshes."
        },
        {
          title: "Settings Simplification",
          desc: "Removed the redundant chart style selection from the D1 chart settings gear menu, consolidating it under the main Settings page."
        }
      ]
    },
    {
      date: "14-06-2026",
      color: "#3498db",
      items: [
        {
          title: "Manual Coordinates Support",
          desc: "Added input fields below the place/city autocomplete to allow manual coordinate entry (Latitude, Longitude, Timezone) for custom locations."
        },
        {
          title: "Planet Degrees Control",
          desc: "Added a settings gear button above the birth chart to easily toggle the visibility of planetary degrees."
        },
        {
          title: "Divisional Charts (Vargas) Selector",
          desc: "Added a settings gear menu to the D9 chart, enabling users to easily switch the view between various divisional charts (D2, D3, D4, D7, D10, D12, etc.)."
        }
      ]
    }
  ];

  return (
    <main className="page" style={{ paddingBottom: "100px" }}>
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("whatsNew", "What's New")}
        eyebrow="e-JYOTISHA"
        subtitle={t("changelogDesc", "Latest updates and features added to the app.")}
      />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          padding: "10px 5px",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {changelogData.map((release, index) => (
          <div
            key={index}
            style={{
              background: "#fffdf8",
              border: "1px solid rgba(122, 83, 48, 0.15)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(63, 43, 24, 0.05)",
              padding: "24px 20px",
              borderLeft: `5px solid ${release.color}`,
              width: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <h2
              style={{
                color: "#2d2419",
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: "800",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              📅 {release.date}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                paddingLeft: "4px"
              }}
            >
              {release.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    lineHeight: "1.6",
                    fontSize: "0.96rem",
                    color: "#4e4030"
                  }}
                >
                  <span
                    style={{
                      color: release.color,
                      fontSize: "1.2rem",
                      lineHeight: "1",
                      marginTop: "-2px",
                      userSelect: "none"
                    }}
                  >
                    •
                  </span>
                  <div style={{ flex: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
                    <strong style={{ color: "#2d2419", fontWeight: "700" }}>
                      {item.title}:
                    </strong>{" "}
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}