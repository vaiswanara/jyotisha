// ============================================================
// EQSubmit.jsx — Submit Question Form (WhatsApp compose style)
// ============================================================

import React, { useState } from "react";
import { EQHeader } from "../components/EQHeader.jsx";
import { ImageUpload } from "../components/ImageUpload.jsx";
import { VoiceRecorder } from "../components/VoiceRecorder.jsx";
import { useQuestions } from "../hooks/useQuestions.js";
import { generateQuestionId } from "../utils/idGenerator.js";

const LESSON_CODE_RE = /^[A-Z]{2}\d{2,3}$/i;

export function EQSubmit({ onBack, onNavigate }) {
  const { addQuestion } = useQuestions();

  const [lessonCode, setLessonCode] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [imageData, setImageData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const code = lessonCode.trim().toUpperCase();
    if (!code) {
      e.lessonCode = "Lesson Code is required. Example: KA01, TE25";
    } else if (!LESSON_CODE_RE.test(code)) {
      e.lessonCode = "Format: 2 letters + 2-3 digits. Example: KA01, TE25, MS55";
    }
    if (!questionText.trim()) {
      e.question = "Please enter your question.";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    const now = new Date();
    const question = {
      id: generateQuestionId(),
      lessonCode: lessonCode.trim().toUpperCase(),
      question: questionText.trim(),
      imageData: imageData || null,
      audioData: audioData || null,
      youtubeUrl: youtubeUrl.trim() || "",
      status: "Pending",
      answerUrl: "",
      createdDate: now.toLocaleDateString("en-IN"),
      createdTime: now.toLocaleTimeString("en-IN"),
      timestamp: now.getTime(),
    };

    const ok = addQuestion(question);

    setTimeout(() => {
      setSubmitting(false);
      if (ok) {
        onNavigate("myQuestions");
      } else {
        alert("Failed to save question. Please try again.");
      }
    }, 400);
  };

  const setField = (setter, field) => (val) => {
    setter(val);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="eq-page">
      <EQHeader
        title="Submit Question"
        subtitle="Ask your doubt about a lesson"
        onBack={onBack}
      />

      <form className="eq-form" onSubmit={handleSubmit} noValidate>
        {/* Lesson Code */}
        <div className="eq-field">
          <label className="eq-label" htmlFor="eq-lesson-code">
            Lesson Code <span className="eq-required">*</span>
          </label>
          <input
            id="eq-lesson-code"
            className={`eq-input ${errors.lessonCode ? "eq-input-error" : ""}`}
            type="text"
            placeholder="e.g. KA01, TE25, MS55"
            value={lessonCode}
            onChange={(e) => setField(setLessonCode, "lessonCode")(e.target.value)}
            maxLength={6}
            autoCapitalize="characters"
          />
          {errors.lessonCode && (
            <span className="eq-error-msg">{errors.lessonCode}</span>
          )}
        </div>

        {/* Question */}
        <div className="eq-field">
          <label className="eq-label" htmlFor="eq-question">
            Your Question <span className="eq-required">*</span>
          </label>
          <textarea
            id="eq-question"
            className={`eq-textarea ${errors.question ? "eq-input-error" : ""}`}
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => setField(setQuestionText, "question")(e.target.value)}
            rows={4}
          />
          {errors.question && (
            <span className="eq-error-msg">{errors.question}</span>
          )}
        </div>

        {/* Optional Image */}
        <div className="eq-field">
          <label className="eq-label">Photo (Optional)</label>
          <ImageUpload value={imageData} onChange={setImageData} />
        </div>

        {/* Optional Voice */}
        <div className="eq-field">
          <label className="eq-label">Voice Recording (Optional)</label>
          <VoiceRecorder value={audioData} onChange={setAudioData} />
        </div>

        {/* Optional YouTube URL */}
        <div className="eq-field">
          <label className="eq-label" htmlFor="eq-yt-url">
            Reference YouTube URL (Optional)
          </label>
          <input
            id="eq-yt-url"
            className="eq-input"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="eq-submit-btn"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "✉️ Submit Question"}
        </button>
      </form>
    </div>
  );
}
