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