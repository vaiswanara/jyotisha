import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { philosophyData } from "../data/philosophyData.js";

export function MyPhilosophy({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();

  // Detect current language or default to telugu/english
  const [currentLang, setCurrentLang] = useState(() => {
    const current = i18n.language?.split("-")[0] || "te";
    return philosophyData[current] ? current : "te";
  });

  const [fontSize, setFontSize] = useState(16); // Base reading font size in px
  const [selectedTag, setSelectedTag] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedSectionId, setCopiedSectionId] = useState(null);

  const data = philosophyData[currentLang] || philosophyData.en;

  // Single active accordion mode: Only first section (id: 1) is expanded initially
  const [activeSectionId, setActiveSectionId] = useState(1);

  const containerRef = useRef(null);

  // Sync language with global i18n if user changes global language
  useEffect(() => {
    const lang = i18n.language?.split("-")[0];
    if (lang && philosophyData[lang]) {
      setCurrentLang(lang);
    }
  }, [i18n.language]);

  // Reset to first section when language changes
  useEffect(() => {
    setActiveSectionId(1);
  }, [currentLang]);

  // Reading progress and scroll top listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter sections by tag if selected
  const filteredSections = useMemo(() => {
    return data.sections.filter((sec) => {
      return selectedTag === "all" || sec.tag === selectedTag;
    });
  }, [data, selectedTag]);

  // Unique tags for filter pills
  const allTags = useMemo(() => {
    const tags = new Set();
    data.sections.forEach((sec) => {
      if (sec.tag) tags.add(sec.tag);
    });
    return Array.from(tags);
  }, [data]);

  // Toggle single section with auto-scroll to the beginning of the expanded section
  const handleSectionClick = (id) => {
    const isOpening = activeSectionId !== id;
    setActiveSectionId((prev) => (prev === id ? null : id));

    if (isOpening) {
      // Small timeout ensures previous section collapses in DOM first before calculating scroll position
      setTimeout(() => {
        const el = document.getElementById(`philosophy-section-${id}`);
        if (el) {
          const topOffset = 65; // Offset below the app top bar
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - topOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  const handleCopySection = (e, section) => {
    e.stopPropagation(); // prevent accordion toggle when clicking copy
    const textToCopy = `${section.title}\n\n${section.paragraphs.join("\n\n")}${
      section.bulletPoints ? "\n\n• " + section.bulletPoints.join("\n• ") : ""
    }${section.highlightQuote ? "\n\n“" + section.highlightQuote + "”" : ""}${
      section.extraParagraphs ? "\n\n" + section.extraParagraphs.join("\n\n") : ""
    }\n\n— Srikanth Dharmavaram (e-JYOTISHA)`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedSectionId(section.id);
      setTimeout(() => setCopiedSectionId(null), 2500);
    });
  };

  return (
    <div className="page my-philosophy-page" ref={containerRef}>
      {/* Top Reading Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "4px",
          width: `${readingProgress}%`,
          background: "linear-gradient(90deg, #d35400, #e67e22, #f39c12)",
          zIndex: 1001,
          transition: "width 0.1s ease-out",
        }}
      />

      <style>{`
        .my-philosophy-page {
          max-width: 920px;
          margin: 0 auto;
          padding: 16px 14px 80px 14px;
          color: #2c3e50;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        /* Top Language Switcher Tabs */
        .philo-lang-tabs {
          display: flex;
          background: #f1f3f5;
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
          margin-bottom: 20px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .philo-lang-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: #495057;
          font-size: 14px;
          font-weight: 700;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .philo-lang-btn:hover {
          color: #d35400;
          background: rgba(255, 255, 255, 0.6);
        }
        .philo-lang-btn.active {
          background: #ffffff;
          color: #a0492e;
          box-shadow: 0 2px 8px rgba(111, 42, 24, 0.12);
        }

        /* Intro Questions Box */
        .philo-intro-card {
          background: #fff9f5;
          border-left: 4px solid #d35400;
          border-radius: 0 16px 16px 0;
          padding: 22px 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(211, 84, 0, 0.06);
        }
        .philo-intro-qtitle {
          font-size: 17px;
          font-weight: 700;
          color: #a0492e;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .philo-questions-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }
        .philo-questions-list li {
          font-size: 15px;
          line-height: 1.6;
          color: #495057;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-style: italic;
        }
        .philo-questions-list li::before {
          content: "💬";
          position: absolute;
          left: 0;
          font-size: 12px;
          top: 3px;
        }
        .philo-intro-statement {
          font-size: 15px;
          line-height: 1.7;
          color: #2b2b2b;
          margin: 0;
          border-top: 1px dashed rgba(211, 84, 0, 0.25);
          padding-top: 12px;
          font-weight: 500;
        }

        /* Tag Filter Chips */
        .philo-tags-bar {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding: 4px 2px 14px 2px;
          margin-bottom: 16px;
          scrollbar-width: thin;
        }
        .philo-tag-chip {
          white-space: nowrap;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #dee2e6;
          background: #ffffff;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s;
        }
        .philo-tag-chip:hover {
          border-color: #a0492e;
          color: #a0492e;
        }
        .philo-tag-chip.active {
          background: #a0492e;
          color: #ffffff;
          border-color: #a0492e;
          box-shadow: 0 2px 6px rgba(160, 73, 46, 0.25);
        }

        /* Student Guide Tip Banner + Cute Mini Font Buttons */
        .philo-hint-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff8f2;
          border: 1px solid #f6ded5;
          padding: 6px 12px;
          border-radius: 10px;
          margin-bottom: 14px;
          color: #8c3b00;
          font-size: 12.5px;
          font-weight: 600;
          flex-wrap: wrap;
          gap: 6px;
          box-sizing: border-box;
        }
        .philo-hint-text {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 200px;
          line-height: 1.3;
        }
        .philo-hint-right {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .philo-hint-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          font-size: 11.5px;
          color: #a0492e;
          background: rgba(160, 73, 46, 0.08);
          padding: 0 8px;
          border-radius: 6px;
          font-weight: 700;
          white-space: nowrap;
          box-sizing: border-box;
          line-height: 1;
        }

        /* Snug & Compact Font Size Controls */
        .philo-mini-font-actions {
          display: inline-flex;
          align-items: center;
          height: 24px;
          gap: 2px;
          background: #ffffff;
          padding: 1px;
          border-radius: 6px;
          border: 1px solid #ebd2c8;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }
        .philo-mini-font-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          min-width: 24px;
          padding: 0 5px;
          border: none;
          background: transparent;
          color: #7a2b16;
          font-size: 11px;
          font-weight: 800;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1;
          box-sizing: border-box;
        }
        .philo-mini-font-btn:hover:not(:disabled) {
          background: #7a2b16;
          color: #ffffff;
        }
        .philo-mini-font-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* Section Cards */
        .philo-section-card {
          background: #ffffff;
          border-radius: 14px;
          margin-bottom: 12px;
          border: 1.5px solid #edf0f2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          scroll-margin-top: 65px;
        }
        .philo-section-card:hover {
          border-color: #e5a48d;
          box-shadow: 0 4px 16px rgba(160, 73, 46, 0.08);
          transform: translateY(-1px);
        }
        .philo-section-card.is-expanded {
          border-color: #d35400;
          box-shadow: 0 6px 20px rgba(211, 84, 0, 0.10);
        }

        /* Clickable Accordion Header */
        .philo-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          cursor: pointer;
          user-select: none;
          background: #ffffff;
          transition: background-color 0.2s;
        }
        .philo-section-card.is-expanded .philo-card-header {
          background: #fffbf8;
          border-bottom: 1.5px solid #f6ded5;
        }

        .philo-card-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .philo-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .philo-section-card.is-expanded .philo-card-title {
          color: #7a2b16;
        }

        /* Chevron indicator */
        .philo-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fdf2ed;
          color: #a0492e;
          font-size: 12px;
          font-weight: 800;
          transition: transform 0.25s ease, background-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .philo-section-card.is-expanded .philo-chevron {
          background: #a0492e;
          color: #ffffff;
          transform: rotate(180deg);
        }
        .philo-section-card:hover:not(.is-expanded) .philo-chevron {
          background: #fce1d4;
        }

        /* "Click to Read" Action Cue on Collapsed State */
        .philo-read-cue {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #d35400;
          background: #fff2e6;
          padding: 4px 10px;
          border-radius: 12px;
          transition: all 0.2s;
          border: 1px solid #ffd8b3;
          white-space: nowrap;
        }
        .philo-section-card:hover .philo-read-cue {
          background: #d35400;
          color: #ffffff;
          border-color: #d35400;
        }

        .philo-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .philo-copy-btn {
          background: none;
          border: none;
          color: #adb5bd;
          cursor: pointer;
          font-size: 15px;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .philo-copy-btn:hover {
          color: #a0492e;
          background: #f8f9fa;
        }

        /* Card Body (Accordion Content) */
        .philo-card-body {
          padding: 22px 22px 24px 22px;
          background: #ffffff;
          animation: philoFadeIn 0.28s ease;
        }
        @keyframes philoFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .philo-paragraph {
          margin: 0 0 14px 0;
          color: #333333;
          line-height: 1.8;
          text-align: justify;
        }
        .philo-paragraph:last-child {
          margin-bottom: 0;
        }

        /* Bullet Points */
        .philo-bullets-list {
          list-style: none;
          padding: 0;
          margin: 14px 0;
          background: #fcfdfd;
          border-radius: 12px;
          padding: 12px 16px;
          border: 1px solid #eef2f5;
        }
        .philo-bullets-list li {
          padding-left: 24px;
          position: relative;
          margin-bottom: 10px;
          color: #374151;
          line-height: 1.65;
          font-size: 0.98em;
        }
        .philo-bullets-list li:last-child {
          margin-bottom: 0;
        }
        .philo-bullets-list li::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: #d35400;
          font-size: 13px;
          top: 0px;
        }

        /* Highlight Quote in Section */
        .philo-quote-highlight {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-left: 3px solid #ea580c;
          padding: 14px 18px;
          border-radius: 0 12px 12px 0;
          margin: 16px 0;
          font-weight: 600;
          color: #9a3412;
          font-style: italic;
          line-height: 1.65;
          box-shadow: 0 2px 8px rgba(234, 88, 12, 0.06);
        }

        /* Closing Card */
        .philo-closing-card {
          background: linear-gradient(180deg, #ffffff 0%, #fffbf9 100%);
          border-radius: 20px;
          padding: 30px 24px;
          margin-top: 30px;
          border: 2px solid #f6ded5;
          box-shadow: 0 8px 30px rgba(160, 73, 46, 0.08);
          position: relative;
        }
        .philo-closing-title {
          font-size: 22px;
          font-weight: 800;
          color: #7a2b16;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid #f6ded5;
          padding-bottom: 12px;
        }
        .philo-closing-p {
          color: #3e2723;
          line-height: 1.85;
          margin-bottom: 14px;
          text-align: justify;
        }
        .philo-mantra-banner {
          background: #7a2b16;
          color: #ffffff;
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          margin: 24px 0 16px 0;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 14px rgba(122, 43, 22, 0.25);
        }
        .philo-signature {
          text-align: right;
          font-size: 17px;
          font-weight: 800;
          color: #a0492e;
          margin-top: 16px;
          font-style: italic;
        }

        /* Floating Action Buttons */
        .philo-fab-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 99;
        }
        .philo-fab {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #a0492e;
          color: #fff;
          border: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .philo-fab:hover {
          transform: scale(1.08);
          background: #7a2b16;
        }

        @media (max-width: 600px) {
          .my-philosophy-page {
            padding: 12px 10px 70px 10px;
          }
          .philo-lang-btn {
            font-size: 13px;
            padding: 9px 4px;
          }
          .philo-hint-banner {
            padding: 8px 10px;
          }
          .philo-hint-text {
            font-size: 12px;
          }
          .philo-card-header {
            padding: 14px 14px;
          }
          .philo-card-body {
            padding: 16px 14px;
          }
          .philo-card-title {
            font-size: 15px;
          }
          .philo-read-cue {
            font-size: 10px;
            padding: 3px 6px;
          }
          .philo-paragraph {
            text-align: left;
          }
        }
      `}</style>

      {/* Top Language Switcher Tabs */}
      <nav className="philo-lang-tabs" aria-label="Language selection">
        <button
          className={`philo-lang-btn ${currentLang === "en" ? "active" : ""}`}
          onClick={() => setCurrentLang("en")}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>
        <button
          className={`philo-lang-btn ${currentLang === "kn" ? "active" : ""}`}
          onClick={() => setCurrentLang("kn")}
        >
          <span>🚩</span>
          <span>ಕನ್ನಡ (Kannada)</span>
        </button>
        <button
          className={`philo-lang-btn ${currentLang === "te" ? "active" : ""}`}
          onClick={() => setCurrentLang("te")}
        >
          <span>🪔</span>
          <span>తెలుగు (Telugu)</span>
        </button>
      </nav>

      {/* Intro Questions Box */}
      <div className="philo-intro-card">
        <h2 className="philo-intro-qtitle">
          <span>❓</span>
          <span>{data.introQuestionsTitle}</span>
        </h2>
        <ul className="philo-questions-list">
          {data.introQuestions.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
        <p className="philo-intro-statement">{data.introStatement}</p>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="philo-tags-bar">
          <button
            className={`philo-tag-chip ${selectedTag === "all" ? "active" : ""}`}
            onClick={() => setSelectedTag("all")}
          >
            {currentLang === "te" ? "అన్ని అంశాలు (All)" : currentLang === "kn" ? "ಎಲ್ಲಾ ವಿಷಯಗಳು (All)" : "All Topics"}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`philo-tag-chip ${selectedTag === tag ? "active" : ""}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Student Hint Banner + Compact Cute Font Controls */}
      <div className="philo-hint-banner">
        <span className="philo-hint-text">
          💡 {currentLang === "te"
            ? "ఏదైనా అంశంపై క్లిక్ చేసి చదవవచ్చు"
            : currentLang === "kn"
            ? "ಯಾವುದೇ ವಿಷಯವನ್ನು ಓದಲು ಅದರ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ"
            : "Click any topic below to expand & read"}
        </span>
        <div className="philo-hint-right">
          <span className="philo-hint-count">
            {filteredSections.length} {currentLang === "te" ? "అంశాలు" : currentLang === "kn" ? "ವಿಷಯಗಳು" : "Topics"}
          </span>

          {/* Cute Mini Font Size Controls */}
          <div className="philo-mini-font-actions">
            <button
              className="philo-mini-font-btn"
              onClick={() => setFontSize((prev) => (prev > 13 ? prev - 1 : prev))}
              title="Decrease Font Size"
              disabled={fontSize <= 13}
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              className="philo-mini-font-btn"
              onClick={() => setFontSize((prev) => (prev < 24 ? prev + 1 : prev))}
              title="Increase Font Size"
              disabled={fontSize >= 24}
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main Sections List (Single Active Accordion Mode) */}
      <main className="philo-sections-container">
        {filteredSections.map((sec) => {
          const isExpanded = activeSectionId === sec.id;

          return (
            <article
              key={sec.id}
              id={`philosophy-section-${sec.id}`}
              className={`philo-section-card ${isExpanded ? "is-expanded" : "is-collapsed"}`}
            >
              {/* Clickable Header without tag at end */}
              <header
                className="philo-card-header"
                onClick={() => handleSectionClick(sec.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSectionClick(sec.id);
                  }
                }}
                aria-expanded={isExpanded}
                title={
                  isExpanded
                    ? currentLang === "te"
                      ? "కుదించడానికి క్లిక్ చేయండి"
                      : currentLang === "kn"
                      ? "ಕುಗ್ಗಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ"
                      : "Click to collapse"
                    : currentLang === "te"
                    ? "చదవడానికి క్లిక్ చేయండి"
                    : currentLang === "kn"
                    ? "ಓದಲು ಕ್ಲಿಕ್ ಮಾಡಿ"
                    : "Click to expand & read"
                }
              >
                <div className="philo-card-title-wrap">
                  <span className="philo-chevron">
                    ▼
                  </span>
                  <h3 className="philo-card-title">{sec.title}</h3>
                </div>

                <div className="philo-header-right">
                  {!isExpanded && (
                    <span className="philo-read-cue">
                      {currentLang === "te"
                        ? "చదవండి ▾"
                        : currentLang === "kn"
                        ? "ಓದಿ ▾"
                        : "Read ▾"}
                    </span>
                  )}
                  {isExpanded && (
                    <button
                      className="philo-copy-btn"
                      onClick={(e) => handleCopySection(e, sec)}
                      title={copiedSectionId === sec.id ? "Copied!" : "Copy Section"}
                    >
                      {copiedSectionId === sec.id ? "✔️" : "📋"}
                    </button>
                  )}
                </div>
              </header>

              {/* Accordion Content Body */}
              {isExpanded && (
                <div className="philo-card-body" style={{ fontSize: `${fontSize}px` }}>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="philo-paragraph">
                      {p}
                    </p>
                  ))}

                  {sec.bulletPoints && (
                    <ul className="philo-bullets-list">
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {sec.highlightQuote && (
                    <div className="philo-quote-highlight">
                      “{sec.highlightQuote}”
                    </div>
                  )}

                  {sec.extraParagraphs &&
                    sec.extraParagraphs.map((ep, epIdx) => (
                      <p key={epIdx} className="philo-paragraph">
                        {ep}
                      </p>
                    ))}
                </div>
              )}
            </article>
          );
        })}

        {/* Closing & Guru Sandesham Section */}
        {selectedTag === "all" && (
          <section className="philo-closing-card" id="philosophy-closing">
            <h2 className="philo-closing-title">
              <span>🙏</span>
              <span>{data.closing.title}</span>
            </h2>
            <div style={{ fontSize: `${fontSize}px` }}>
              {data.closing.paragraphs.map((cp, cIdx) => (
                <p key={cIdx} className="philo-closing-p">
                  {cp}
                </p>
              ))}

              <div className="philo-mantra-banner">
                {data.closing.mantra}
              </div>

              <p className="philo-signature">{data.closing.signature}</p>
            </div>
          </section>
        )}
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <div className="philo-fab-container">
          <button
            className="philo-fab"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Scroll to Top"
          >
            ↑
          </button>
        </div>
      )}
    </div>
  );
}

export default MyPhilosophy;
