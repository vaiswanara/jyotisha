import React from "react";
import { useTranslation } from "react-i18next";

export function BottomNav({ activePage, onNavigate, profileName }) {
  const { t } = useTranslation();

  const navItems = [
    { id: "Home", icon: "🏠", label: t("Home", "Home") },
    { id: "Me", icon: "👤", label: profileName || t("Me", "Me").replace(/\s*\(.*?\)/, "") },
    { id: "e-Jataka", icon: "📜", label: t("Jataka", "Jataka") },
    { id: "e-Match", icon: "💞", label: t("Match", "Match") },
    { id: "e-PATA", icon: "📖", label: t("e-PATA", "e-PATA") },
    { id: "Settings", icon: "⚙️", label: t("Settings", "Settings") },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-nav-item ${activePage === item.id ? "active" : ""}`}
          onClick={() => onNavigate(item.id)}
          title={item.label}
          aria-label={item.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0px",
          }}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span
            className="bottom-nav-label"
            style={{ fontSize: "11px", fontWeight: "600", lineHeight: "1" }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
