import React from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

export function ChangelogPage({ logoUrl }) {
  const { t } = useTranslation();

  return (
    <main className="page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("whatsNew", "What's New")}
        eyebrow="e-JYOTISHA"
        subtitle={t("changelogDesc", "Latest updates and features added to the app.")}
      />

      <section
        className="workspace"
        style={{
          gridTemplateColumns: "1fr",
          padding: "20px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
        }}
      >
        <div className="form-panel" style={{ position: "static", padding: "30px", borderRadius: "12px" }}>

          {/* 29-06-2026 */}
          <div style={{ borderLeft: "4px solid #8e44ad", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>29-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>Dashboard Profile Management Upgrade:</strong> Upgraded the profile management on the Me Dashboard to support the same saved profiles list as the other pages.</li>
              <li><strong>Interactive Profile Dropdown:</strong> Shortened and simplified the dashboard profile menu options to ➕ <strong>Add</strong>, 👥 <strong>Switch</strong>, ✏️ <strong>Edit</strong>, and 🗑️ <strong>Clear</strong> for a cleaner dropdown layout.</li>
              <li><strong>Quick Profile Actions:</strong> Users can now add new local profiles, switch between existing saved profiles in the local database, edit active profile details, or clear dashboard selections directly.</li>
            </ul>
          </div>

          {/* 28-06-2026 */}
          <div style={{ borderLeft: "4px solid #3498db", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>28-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>Panchanga Page Layout Redesign:</strong> Redesigned the Panchanga page desktop layout, removing unnecessary margins and resizing the D1 chart by 20% (including planetary text).</li>
              <li><strong>Reminders & Custom Events Tab:</strong> Implemented a separate "Add Events" tab between Muhurtha and Adhika Masa tabs to save custom events, holidays, or festivals.</li>
              <li><strong>Advanced Reminder Settings:</strong> Added JSON/CSV export and import with flexible date format parsing, inline edit/update controls, and clear data buttons.</li>
              <li><strong>Backup & Sync Integration:</strong> Integrated custom events into local individual backups, Master Backups, and Google Drive Sync on the Settings page.</li>
              <li><strong>Dhanishtha Nakshatra Translation Fix:</strong> Added localizations for the spelling "Dhanishtha" across Telugu, Kannada, and English translation files to fix unlocalized displays in the Horoscope UI and generated PDF tables.</li>
            </ul>
          </div>

          {/* 27-06-2026 */}
          <div style={{ borderLeft: "4px solid #8e44ad", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>27-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>Eka-Vimshathi Dosha Engine:</strong> Implemented a practical filtered subset of the 21 Mahadoshas (Eka-Vimshathi) displayed under the Muhurtha tab. The active doshas list is now configurable from the Settings page — users can enable or disable individual doshas as required.</li>
              <li><strong>New Doshas Added:</strong> Implemented Sankranti Dosha (checks if the Sun is within 3 days of transitioning to a new sign), Lagna Tyajyamu (calculates the inauspicious discarded portion of the current rising Lagna based on Rashi-specific Ghati rules, 12-minute window), and Sagraha Chandra Dosha (Moon conjunct another planet within 3°).</li>
              <li><strong>Grahanam (Eclipse) via JSON:</strong> Uses a precomputed <code>jyotisha_api/eclipses_data.json</code> database of eclipse dates and Nakshatra names. The backend checks if the Muhurtha date is an eclipse day, and also triggers <em>Grahana Utpata Dosha</em> if the Moon's current Nakshatra matches any eclipse Nakshatra within the past 6 months.</li>
              <li><strong>Lagna Tyajyam Dosha Trigger:</strong> If the selected Muhurtha time falls inside the Lagna Tyajyamu window, a <em>Lagna Tyajyam</em> dosha chip is dynamically triggered in the Doshas section.</li>
              <li><strong>Muhurtha Details Panel Redesign:</strong> Split the right-hand Muhurtha details card into two separate cards — <em>Muhurtha Details</em> (Lagna, Pushkaraamsha, Muhurtha, Panchakam) and <em>Inauspicious Timings</em> (Rahu Kalam, Yamagandam, Varjyam, Durmuhurtham). Lagna Tyajyamu is now displayed directly below Lagna Mid for visual grouping.</li>
              <li><strong>Inauspicious Timing Triggers:</strong> Rahu Kalam, Yamagandam, Varjyam, and Durmuhurtham now trigger as dosha chips in the Doshas section when the selected Muhurtha time overlaps with those intervals.</li>
              <li><strong>Saved Muhurtha Table UI Cleanup:</strong> Moved the "Custom message for PDF export" text field to a separate full-width row below the action buttons. Removed emoji symbols from all action button labels for a cleaner desktop layout.</li>
              <li><strong>Default Doshas Configuration:</strong> Reduced the default active (checked) doshas to a lean practical set — Saptamastha Graha, Bhrigu Shatka, Ashtamastha Kuja, Sankranti Dosha, Asthangatha, Grahanam, Grahana Utpata Dosha, and Rahu Kalam. All other doshas are unchecked by default but can be enabled from Settings.</li>
            </ul>
          </div>

          {/* 22-06-2026 */}
          <div style={{ borderLeft: "4px solid #3498db", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>22-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>PAV Tab (Time Machine):</strong> Added a new <em>PAV</em> tab in the Time Machine section of the e-Clock page, displaying an animated Prastara Ashtakavarga chart that updates dynamically with the selected time.</li>
            </ul>
          </div>

          {/* 17-06-2026 */}

          <div style={{ borderLeft: "4px solid #8e44ad", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>17-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li>Added a "Rename Table" button in the results action panel of both the Panchanga and Muhurtha tabs in <code>PanchangaPage.jsx</code>, allowing users to rename already saved tables with overwrite warnings and automatic dropdown lists/form states updates.</li>
              <li>Integrated custom user-extracted <code>public/static/masa.json</code> data, converting the custom keys (<code>Masa_Name</code>, <code>Start_Date</code>, <code>End_Date</code>) and IST-formatted timestamps to standard UTC ISO strings (<code>masa</code>, <code>start</code>, <code>end</code>) for seamless timezone-independent client formatting. Corrected Pausha to Pushya naming.</li>
              <li>Added location details (place, longitude, latitude, and timezone) under the search results table in both Panchanga tab and <code>PanchangaSearch.jsx</code>.</li>
              <li>Modified the JSON export Table feature to include location metadata (city, lat, lon, tz) inside the exported JSON object.</li>
              <li>Implemented precise Lagna and Pushkaraamsha calculation window calculations using Julian days and binary search in the Node API.</li>
              <li>Implemented backend caching of ayanamsha value to optimize performance of binary search calculation.</li>
              <li>Fixed a sign inversion error in ascendant calculation logic.</li>
            </ul>
          </div>

          {/* 16-06-2026 */}
          <div style={{ borderLeft: "4px solid #3498db", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>16-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li>Pancahnga at surise logic removed and displayed panchange as per realtime.</li>
              <li>Nitya Sankalpa moved to a separate page.</li>
              <li>Added date and time selection to Sankalpa page.</li>
              <li>Enabled PWA auto-update mode to automatically download and apply new web app builds/updates immediately without manual hard refreshes or clicks.</li>
              <li>Implemented next Guru Balam prediction calculation and display on the Me Profile page, utilizing a static JSON database of Jupiter (Guru) transits from 2024 to 2040 for instant offline client-side calculation.</li>
              <li>Extended prediction feature to Shani Balam (calculates and displays next/ending transit dates for Shani Balam under Option 3 style utilizing a static database of Saturn transits from 2023 to 2041).</li>
            </ul>
          </div>

          {/* 15-06-2026 */}
          <div style={{ borderLeft: "4px solid #8e44ad", paddingLeft: "20px", marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>15-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>Nija Jyeshtha Masa Transition Fix</strong>: Resolved a bug where the lunar month display failed to transition from Adhika to Nija Jyeshtha on schedule.</li>
              <li><strong>Default Location Fix</strong>: Resolved an issue in the Astro Clock (e-Clock) page where the default location was not loaded correctly from preferences.</li>
              <li><strong>Push Notification Scrolling Fix</strong>: Fixed a bug where long push messages overflowed and blocked action buttons, preventing the popup from being scrolled.</li>
              <li><strong>Chart Layout Enhancements</strong>: Repositioned the D1 and D9 settings gear icons above the charts with a subtle 2px gap to prevent them from overlapping chart cells.</li>
              <li><strong>Visual Clean-up</strong>: Made the gear buttons transparent by removing their background shadows, borders, and circular background elements.</li>
              <li><strong>Icon Size Adjustment</strong>: Increased the settings gear icon size by 20% for improved accessibility and touch interaction.</li>
              <li><strong>North Indian Chart Type</strong>: Added support for North Indian style diamond charts, selectable under General Settings (defaults to South Indian).</li>
              <li><strong>Global North Indian Layout Support</strong>: Implemented North Indian chart layout rendering across Horoscope, Gochara (Transit), Ashtakavarga, Match Making (e-Match), Muhurtha Chakra, Astro Clock (e-Clock), and PDF exports, utilizing bold planet names for high readability.</li>
              <li><strong>Reactive Styling Updates</strong>: Ensured that modifying the global chart style instantly synchronizes all open chart views reactively without requiring page refreshes.</li>
              <li><strong>Settings Simplification</strong>: Removed the redundant chart style selection from the D1 chart settings gear menu, consolidating it under the main Settings page.</li>
            </ul>
          </div>

          {/* 14-06-2026 */}
          <div style={{ borderLeft: "4px solid #3498db", paddingLeft: "20px", marginBottom: "10px" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 8px 0", fontSize: "1.4rem" }}>14-06-2026</h2>
            <ul style={{ marginTop: "15px", color: "#34495e", lineHeight: "1.8", fontSize: "1rem" }}>
              <li><strong>Manual Coordinates Support</strong>: Added input fields below the place/city autocomplete to allow manual coordinate entry (Latitude, Longitude, Timezone) for custom locations.</li>
              <li><strong>Planet Degrees Control</strong>: Added a settings gear button above the birth chart to easily toggle the visibility of planetary degrees.</li>
              <li><strong>Divisional Charts (Vargas) Selector</strong>: Added a settings gear menu to the D9 chart, enabling users to easily switch the view between various divisional charts (D2, D3, D4, D7, D10, D12, etc.).</li>
            </ul>
          </div>

        </div>
      </section>
    </main>
  );
}