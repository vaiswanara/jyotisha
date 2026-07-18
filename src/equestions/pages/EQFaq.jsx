// ============================================================
// EQFaq.jsx — Frequently Asked Questions (Answered only)
// No student information displayed
// ============================================================

import React, { useEffect, useState } from "react";
import { EQHeader } from "../components/EQHeader.jsx";
import { useFaq } from "../hooks/useFaq.js";

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EQFaq({ onBack }) {
  const { faqItems, refresh } = useFaq();
  const [search, setSearch] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  const filtered = faqItems.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.lessonCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="eq-page">
      <EQHeader
        title="FAQ"
        subtitle="Answered questions from students"
        onBack={onBack}
      />

      {/* Search bar */}
      <div className="eq-search-wrap">
        <span className="eq-search-icon">🔍</span>
        <input
          className="eq-search-input"
          type="text"
          placeholder="Search questions or lesson codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="eq-empty-state">
          <div className="eq-empty-icon">💡</div>
          <h3 className="eq-empty-title">
            {search ? "No results found" : "No answered questions yet"}
          </h3>
          <p className="eq-empty-desc">
            {search
              ? "Try a different search term."
              : "Check back later — answered questions will appear here."}
          </p>
        </div>
      ) : (
        <div className="eq-list">
          {filtered.map((q) => (
            <div key={q.id} className="eq-faq-card">
              <div className="eq-faq-meta">
                <span className="eq-faq-lesson">{q.lessonCode}</span>
                <span className="eq-faq-date">{formatDate(q.timestamp)}</span>
              </div>
              {/* Question bubble */}
              <div className="eq-bubble eq-bubble-sent">
                <p className="eq-bubble-text">{q.question}</p>
              </div>
              {/* Answer bubble */}
              <div className="eq-bubble eq-bubble-received">
                <p className="eq-bubble-answer-label">✅ Answer</p>
                <a
                  href={q.answerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eq-answer-url-btn"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
