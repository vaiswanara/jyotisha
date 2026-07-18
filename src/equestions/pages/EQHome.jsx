// ============================================================
// EQHome.jsx — e-Questions Home Screen
// ============================================================

import React from "react";

export function EQHome({ onNavigate }) {
  const menuItems = [
    {
      view: "submit",
      icon: "✏️",
      label: "Submit Question",
      desc: "Ask your doubt about a lesson",
      cls: "eq-home-btn-primary",
    },
    {
      view: "myQuestions",
      icon: "📋",
      label: "My Questions",
      desc: "View your submitted questions",
      cls: "eq-home-btn-secondary",
    },
    {
      view: "faq",
      icon: "💡",
      label: "FAQ",
      desc: "Browse answered questions",
      cls: "eq-home-btn-secondary",
    },
  ];

  return (
    <div className="eq-home">
      {/* ── Simple flat header ── */}
      <div className="eq-home-flat-header">
        <h1 className="eq-home-title">e-Questions</h1>
        <p className="eq-home-tagline">Ask your doubts. Get answers.</p>
      </div>

      {/* ── Menu buttons ── */}
      <div className="eq-home-menu">
        {menuItems.map((item) => (
          <button
            key={item.view}
            className={`eq-home-menu-btn ${item.cls}`}
            onClick={() => onNavigate(item.view)}
          >
            <span className="eq-home-menu-icon">{item.icon}</span>
            <div className="eq-home-menu-text">
              <span className="eq-home-menu-label">{item.label}</span>
              <span className="eq-home-menu-desc">{item.desc}</span>
            </div>
            <span className="eq-home-menu-arrow">›</span>
          </button>
        ))}
      </div>

      {/* ── Bottom info ── */}
      <p className="eq-home-footer">
        All questions are stored in this device only.
      </p>
    </div>
  );
}
