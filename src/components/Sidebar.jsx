import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export function Sidebar({ isOpen, logoUrl, onClose, activePage, onNavigate, profileName }) {
  const { t } = useTranslation();
  const [visiblePages, setVisiblePages] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      try {
        const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
        setVisiblePages(prefs.sidebar_pages || null);
      } catch (e) {}
    }
  }, [isOpen]);

  const allMenuItems = [
    { id: "Home", icon: "🏠", label: t("Home", "Home") },
    { id: "Me", icon: "👤", label: profileName || t("Me", "Me").replace(/\s*\(.*?\)/, "") },
    { id: "Sankalpa", icon: "☀️", label: t("e-Sankalpa", "e-Sankalpa") },
    { id: "e-Jataka", icon: "📜", label: t("e-Jataka", "e-Jataka") },
    { id: "e-Match", icon: "💞", label: t("e-Match", "e-Match") },
    { id: "GotraMatch", icon: "🧬", label: "e-Gotra", subLabel: "(Beta)" },
    { id: "e-Panchanga", icon: "🗓️", label: t("e-Panchanga", "e-Panchanga") },
    { id: "echakra", icon: "☸️", label: t("Prashna", "e-Prashna") },
    { id: "e-Clock", icon: "🕒", label: t("AstroClock", "e-Clock") },
    { id: "Profiles", icon: "👥", label: t("Profiles", "e-Profiles") },
    { id: "e-PATA", icon: "📖", label: t("e-PATA", "e-PATA") },
    { id: "e-Library", icon: "📚", label: t("e-Library", "e-Library") },
    { id: "PrecisionTest", icon: "🔬", label: t("PrecisionTest", "Precision Test") },
    { id: "Help", icon: "📖", label: t("Help", "FAQ") },
    { id: "e-Support", icon: "🤝", label: t("Support", "Donate") },
    { id: "Privacy", icon: "🛡️", label: t("Privacy", "Privacy Policy") },
    { id: "Settings", icon: "⚙️", label: t("Settings", "Settings") },
    { id: "StudentRegistration", icon: "🎓", label: t("StudentRegistration", "Student Registration") },
    { id: "e-Install", icon: "📲", label: t("installApp", "Install App") },
    { id: "Feedback", icon: "📝", label: t("Feedback", "Feedback") },
  ];

  const mandatoryPages = ["Home", "Me", "e-Support", "Settings"];

  const menuItems = visiblePages
    ? allMenuItems.filter(
        (item) =>
          mandatoryPages.includes(item.id) || visiblePages.includes(item.id),
      )
    : allMenuItems;

  // Hard Refresh (Clear PWA Caches & Reload)
  const handleHardRefresh = async () => {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch (e) {
        console.error("Cache clear error", e);
      }
    }
    if ("serviceWorker" in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) await registration.update();
      } catch (e) {}
    }
    window.location.reload();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          style={{ zIndex: 1040 }}
        />
      )}
      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          background: "#ffffff",
          boxShadow: "4px 0 25px rgba(0,0,0,0.1)",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100dvh", // స్క్రీన్ ఎత్తుకి సమానంగా సెట్ చేస్తుంది
          zIndex: 1050,
        }}
      >
        <div
          className="sidebar-header"
          style={{
            background: "linear-gradient(135deg, #eae7e0 0%, #efdab8 100%)",
            color: "#fff",
            padding: "45px 20px 5px 30px",
            textAlign: "center",
            borderBottom: "none",
            position: "relative",
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="e-JYOTISHA Logo"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "3px solid #fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                marginBottom: "10px",
                marginLeft: "-15px",
                background: "#fff",
                padding: "2px",
              }}
            />
          )}
          <h2
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: "800",
              letterSpacing: "1px",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              color: "#8a3b24",
            }}
          >
            e-JYOTISHA
          </h2>
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close Menu"
            style={{
              position: "absolute",
              top: "1px",
              right: "15px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav
          className="sidebar-nav"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Flexbox లోపల స్క్రోలింగ్ సరిగ్గా పనిచేయడానికి ఇది తప్పనిసరి
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => {
                if (item.url) {
                  window.open(item.url, "_blank");
                  if (onClose) onClose();
                } else {
                  onNavigate(item.id);
                }
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                {item.label}
                {item.subLabel && (
                  <span style={{ fontSize: "0.72em", opacity: 0.7, fontStyle: "italic" }}>
                    {item.subLabel}
                  </span>
                )}
              </span>
            </button>
          ))}

          <div
            style={{
              height: "1px",
              background: "#eee",
              margin: "10px 20px",
              flexShrink: 0,
            }}
          ></div>
          <button
            className="sidebar-item"
            onClick={handleHardRefresh}
            style={{ color: "#d63031", flexShrink: 0 }}
          >
            <span className="sidebar-icon">🔄</span>
            {t("hardRefresh", "Hard Refresh")}
          </button>

          <div
            className="sidebar-footer"
            style={{ marginTop: "auto", padding: "20px", flexShrink: 0 }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#7f8c8d",
              }}
            >
              {t("Language", "Language")}:
            </label>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </>
  );
}
