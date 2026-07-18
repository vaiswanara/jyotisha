// ============================================================
// QuestionCard.jsx — Reusable WhatsApp-bubble style card
// ============================================================

import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge.jsx";

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function QuestionCard({ question, actions }) {
  const [imgExpanded, setImgExpanded] = useState(false);
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="eq-card">
      {/* ── Header row ── */}
      <div className="eq-card-header">
        <div className="eq-card-meta">
          <span className="eq-card-id">{question.id}</span>
          <span className="eq-card-lesson-code">{question.lessonCode}</span>
        </div>
        <StatusBadge status={question.status} />
      </div>

      {/* ── Question bubble ── */}
      <div className="eq-bubble eq-bubble-sent">
        <p className="eq-bubble-text">{question.question}</p>
        {question.youtubeUrl && (
          <a
            href={question.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eq-yt-link-small"
          >
            🔗 {question.youtubeUrl}
          </a>
        )}
        <span className="eq-bubble-time">{formatDate(question.timestamp)}</span>
      </div>

      {/* ── Attachments ── */}
      {(question.imageData || question.audioData) && (
        <div className="eq-card-attachments">
          {question.imageData && (
            <div className="eq-thumb-wrap" onClick={() => setImgExpanded(!imgExpanded)}>
              <img
                src={question.imageData}
                alt="Attached"
                className={`eq-thumb ${imgExpanded ? "eq-thumb-expanded" : ""}`}
              />
              {!imgExpanded && <span className="eq-thumb-label">📷 Photo</span>}
            </div>
          )}
          {question.audioData && (
            <div className="eq-audio-chip">
              <button
                type="button"
                className="eq-audio-play-btn"
                onClick={toggleAudio}
              >
                {playing ? "⏸" : "▶"} Voice
              </button>
              <audio
                ref={audioRef}
                src={question.audioData}
                onEnded={() => setPlaying(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Approved bubble (coming soon message) ── */}
      {question.status === "Approved" && (
        <div className="eq-bubble eq-bubble-received eq-bubble-approved">
          <p className="eq-bubble-answer-label eq-approved-label">🔵 Question Approved!</p>
          <p className="eq-approved-msg">
            Your question has been reviewed. The answer is being prepared —{" "}
            <strong>coming soon!</strong> 🎓
          </p>
        </div>
      )}

      {/* ── Answer bubble (if answered) ── */}
      {question.status === "Answered" && question.answerUrl && (
        <div className="eq-bubble eq-bubble-received">
          <p className="eq-bubble-answer-label">✅ Answer Available</p>
          <a
            href={question.answerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eq-answer-url-btn"
          >
            ▶ Watch Answer on YouTube
          </a>
        </div>
      )}

      {/* ── Admin action buttons ── */}
      {actions && <div className="eq-card-actions">{actions}</div>}
    </div>
  );
}
