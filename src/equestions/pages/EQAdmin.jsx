// ============================================================
// EQAdmin.jsx — Admin Panel (hidden, no auth, prototype)
// 3-step flow:  Pending → Approve → Answered
//
// Approve  → status = "Approved"  (student sees "coming soon")
// Answered → enter YouTube URL   → status = "Answered"
// Reject   → permanently delete from LocalStorage
// ============================================================

import React, { useEffect, useState } from "react";
import { EQHeader } from "../components/EQHeader.jsx";
import { QuestionCard } from "../components/QuestionCard.jsx";
import { useQuestions } from "../hooks/useQuestions.js";

export function EQAdmin({ onBack }) {
  const { questions, editQuestion, removeQuestion, refresh } = useQuestions();
  const [answerUrls, setAnswerUrls] = useState({});
  const [enteringAnswerId, setEnteringAnswerId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    refresh();
  }, []);

  // ── Approve (Pending → Approved) ──────────────────────────
  const handleApprove = (q) => {
    const now = new Date();
    editQuestion(q.id, {
      status: "Approved",
      approvedDate: now.toLocaleDateString("en-IN"),
      approvedTime: now.toLocaleTimeString("en-IN"),
      approvedTimestamp: now.getTime(),
    });
  };

  // ── Answered (Approved → Answered with YouTube URL) ───────
  const handleAnswered = (q) => {
    const url = answerUrls[q.id]?.trim();
    if (!url) {
      alert("Please enter the YouTube Answer URL first.");
      return;
    }
    const now = new Date();
    editQuestion(q.id, {
      status: "Answered",
      answerUrl: url,
      answeredDate: now.toLocaleDateString("en-IN"),
      answeredTime: now.toLocaleTimeString("en-IN"),
      answeredTimestamp: now.getTime(),
    });
    setEnteringAnswerId(null);
    setAnswerUrls((prev) => ({ ...prev, [q.id]: "" }));
  };

  // ── Reject (permanent delete) ─────────────────────────────
  const handleReject = (q) => {
    const confirmed = window.confirm(
      `Reject and permanently delete question "${q.id}"?\n\nThis cannot be undone.`
    );
    if (confirmed) {
      removeQuestion(q.id);
    }
  };

  const filtered =
    filter === "all"
      ? questions
      : questions.filter((q) => q.status === filter);

  const counts = {
    all:      questions.length,
    Pending:  questions.filter((q) => q.status === "Pending").length,
    Approved: questions.filter((q) => q.status === "Approved").length,
    Answered: questions.filter((q) => q.status === "Answered").length,
  };

  return (
    <div className="eq-page">
      <EQHeader
        title="Admin Panel"
        subtitle="Manage student questions"
        onBack={onBack}
      />

      {/* ── Admin badge ── */}
      <div className="eq-admin-badge">
        🔐 Admin Mode · {questions.length} total questions
      </div>

      {/* ── Filter tabs ── */}
      <div className="eq-filter-tabs">
        {[
          { key: "all",      label: `All (${counts.all})` },
          { key: "Pending",  label: `⏳ Pending (${counts.Pending})` },
          { key: "Approved", label: `🔵 Approved (${counts.Approved})` },
          { key: "Answered", label: `✅ Answered (${counts.Answered})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`eq-filter-tab ${filter === tab.key ? "eq-filter-tab-active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="eq-empty-state">
          <div className="eq-empty-icon">📭</div>
          <h3 className="eq-empty-title">No questions here</h3>
          <p className="eq-empty-desc">Nothing to show for this filter.</p>
        </div>
      ) : (
        <div className="eq-list">
          {filtered.map((q) => (
            <div key={q.id} className="eq-admin-card-wrap">
              <QuestionCard question={q} />

              {/* ── Step 1: Pending → Approve or Reject ── */}
              {q.status === "Pending" && (
                <div className="eq-admin-actions">
                  <p className="eq-admin-step-label">Step 1 — Review question</p>
                  <div className="eq-admin-btns">
                    <button
                      className="eq-btn-approve"
                      onClick={() => handleApprove(q)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="eq-btn-reject"
                      onClick={() => handleReject(q)}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Approved → Enter URL → Mark as Answered ── */}
              {q.status === "Approved" && (
                <div className="eq-admin-actions eq-admin-actions-approved">
                  <p className="eq-admin-step-label eq-admin-step-approved">
                    Step 2 — Student notified. Add answer URL when ready.
                  </p>
                  {enteringAnswerId === q.id ? (
                    <div className="eq-approve-form">
                      <input
                        className="eq-input"
                        type="url"
                        placeholder="Paste YouTube Answer URL here..."
                        value={answerUrls[q.id] || ""}
                        onChange={(e) =>
                          setAnswerUrls((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        autoFocus
                      />
                      <div className="eq-approve-form-btns">
                        <button
                          className="eq-btn-answered"
                          onClick={() => handleAnswered(q)}
                        >
                          ✅ Confirm Answered
                        </button>
                        <button
                          className="eq-btn-cancel"
                          onClick={() => setEnteringAnswerId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="eq-admin-btns">
                      <button
                        className="eq-btn-answered"
                        onClick={() => setEnteringAnswerId(q.id)}
                      >
                        🎬 Mark as Answered
                      </button>
                      <button
                        className="eq-btn-reject"
                        onClick={() => handleReject(q)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
