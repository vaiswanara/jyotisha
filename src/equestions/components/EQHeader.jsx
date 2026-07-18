// ============================================================
// EQHeader.jsx — Internal sub-page header with back button
// ============================================================

import React from "react";

export function EQHeader({ title, subtitle, onBack, rightAction }) {
  return (
    <div className="eq-header">
      <div className="eq-header-left">
        {onBack && (
          <button className="eq-back-btn" onClick={onBack} aria-label="Go back">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className="eq-header-titles">
          <h2 className="eq-header-title">{title}</h2>
          {subtitle && <p className="eq-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div className="eq-header-right">{rightAction}</div>}
    </div>
  );
}
