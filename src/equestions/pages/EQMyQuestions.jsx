// ============================================================
// EQMyQuestions.jsx — Student's question history
// WhatsApp chat-thread style listing
// ============================================================

import React, { useEffect } from "react";
import { EQHeader } from "../components/EQHeader.jsx";
import { QuestionCard } from "../components/QuestionCard.jsx";
import { useQuestions } from "../hooks/useQuestions.js";

export function EQMyQuestions({ onBack, onNavigate }) {
  const { questions, refresh } = useQuestions();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="eq-page">
      <EQHeader
        title="My Questions"
        subtitle={`${questions.length} question${questions.length !== 1 ? "s" : ""} submitted`}
        onBack={onBack}
        rightAction={
          <button
            className="eq-header-action-btn"
            onClick={() => onNavigate("submit")}
          >
            ✏️ New
          </button>
        }
      />

      {questions.length === 0 ? (
        <div className="eq-empty-state">
          <div className="eq-empty-icon">💬</div>
          <h3 className="eq-empty-title">No questions yet</h3>
          <p className="eq-empty-desc">
            Submit your first question to get started.
          </p>
          <button
            className="eq-empty-cta"
            onClick={() => onNavigate("submit")}
          >
            ✏️ Submit Question
          </button>
        </div>
      ) : (
        <div className="eq-list">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
