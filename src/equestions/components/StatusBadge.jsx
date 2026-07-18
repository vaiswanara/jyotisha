// ============================================================
// StatusBadge.jsx — Color-coded status indicator
// ============================================================

import React from "react";

const STATUS_CONFIG = {
  Pending:  { emoji: "⏳", label: "Pending",  cls: "eq-badge-pending"  },
  Approved: { emoji: "🔵", label: "Approved", cls: "eq-badge-approved-soon" },
  Answered: { emoji: "✅", label: "Answered", cls: "eq-badge-answered" },
  Rejected: { emoji: "❌", label: "Rejected", cls: "eq-badge-rejected" },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`eq-badge ${cfg.cls}`}>
      <span className="eq-badge-emoji">{cfg.emoji}</span>
      <span className="eq-badge-label">{cfg.label}</span>
    </span>
  );
}
