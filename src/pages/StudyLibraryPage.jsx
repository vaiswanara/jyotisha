import React, { useState, useEffect, useMemo } from "react";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import {
  getAllLanguages,
  getLanguageBySlug,
  getSubjectsByLanguage,
  getSubjectBySlug,
  getCoursesBySubject,
  getCourseBySlug,
  getChaptersByCourse,
  getContinueLearningItems,
} from "../data/studyLibraryData.js";

export function StudyLibraryPage({ logoUrl, onNavigate }) {
  // Navigation hierarchy state
  const [selectedLanguageSlug, setSelectedLanguageSlug] = useState(null);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const [activeChapterModal, setActiveChapterModal] = useState(null);

  // Sync with URL query parameters if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      const subj = params.get("subject");
      const crs = params.get("course");
      if (lang) setSelectedLanguageSlug(lang);
      if (subj) setSelectedSubjectSlug(subj);
      if (crs) setSelectedCourseSlug(crs);
    } catch (_) {}
  }, []);

  // Update browser URL query params without reloading
  const updateQueryParams = (lang, subj, crs) => {
    try {
      const url = new URL(window.location);
      url.searchParams.set("page", "StudyLibrary");
      if (lang) url.searchParams.set("lang", lang);
      else url.searchParams.delete("lang");

      if (subj) url.searchParams.set("subject", subj);
      else url.searchParams.delete("subject");

      if (crs) url.searchParams.set("course", crs);
      else url.searchParams.delete("course");

      window.history.pushState({}, "", url);
    } catch (_) {}
  };

  // Handlers for hierarchical navigation
  const handleSelectLanguage = (langSlug) => {
    setSelectedLanguageSlug(langSlug);
    setSelectedSubjectSlug(null);
    setSelectedCourseSlug(null);
    setActiveChapterModal(null);
    updateQueryParams(langSlug, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectSubject = (subjSlug) => {
    setSelectedSubjectSlug(subjSlug);
    setSelectedCourseSlug(null);
    setActiveChapterModal(null);
    updateQueryParams(selectedLanguageSlug, subjSlug, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCourse = (crsSlug) => {
    setSelectedCourseSlug(crsSlug);
    setActiveChapterModal(null);
    updateQueryParams(selectedLanguageSlug, selectedSubjectSlug, crsSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDirectContinue = (item) => {
    setSelectedLanguageSlug(item.languageSlug);
    setSelectedSubjectSlug(item.subjectSlug);
    setSelectedCourseSlug(item.courseSlug);
    setActiveChapterModal(null);
    updateQueryParams(item.languageSlug, item.subjectSlug, item.courseSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setSelectedLanguageSlug(null);
    setSelectedSubjectSlug(null);
    setSelectedCourseSlug(null);
    setActiveChapterModal(null);
    updateQueryParams(null, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Resolved Data
  const languages = useMemo(() => getAllLanguages(), []);
  const currentLanguage = useMemo(
    () => getLanguageBySlug(selectedLanguageSlug),
    [selectedLanguageSlug]
  );
  const subjects = useMemo(
    () => getSubjectsByLanguage(selectedLanguageSlug),
    [selectedLanguageSlug]
  );
  const currentSubject = useMemo(
    () => getSubjectBySlug(selectedLanguageSlug, selectedSubjectSlug),
    [selectedLanguageSlug, selectedSubjectSlug]
  );
  const courses = useMemo(
    () => getCoursesBySubject(selectedLanguageSlug, selectedSubjectSlug),
    [selectedLanguageSlug, selectedSubjectSlug]
  );
  const currentCourse = useMemo(
    () =>
      getCourseBySlug(
        selectedLanguageSlug,
        selectedSubjectSlug,
        selectedCourseSlug
      ),
    [selectedLanguageSlug, selectedSubjectSlug, selectedCourseSlug]
  );
  const chapters = useMemo(
    () =>
      getChaptersByCourse(
        selectedLanguageSlug,
        selectedSubjectSlug,
        selectedCourseSlug
      ),
    [selectedLanguageSlug, selectedSubjectSlug, selectedCourseSlug]
  );
  const continueItems = useMemo(() => getContinueLearningItems(), []);

  // Determine current view level
  const currentView = useMemo(() => {
    if (selectedCourseSlug && currentCourse) return "course";
    if (selectedSubjectSlug && currentSubject) return "subject";
    if (selectedLanguageSlug && currentLanguage) return "language";
    return "landing";
  }, [
    selectedLanguageSlug,
    currentLanguage,
    selectedSubjectSlug,
    currentSubject,
    selectedCourseSlug,
    currentCourse,
  ]);

  return (
    <div className="page study-library-container" style={{ maxWidth: "1120px", margin: "0 auto", paddingBottom: "5rem" }}>
      {/* Header */}
      <HoroscopeHeader logoUrl={logoUrl} title="Study Library" />

      {/* Top Breadcrumbs Trail */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          margin: "0 0 1.5rem 0",
          fontSize: "0.9rem",
          fontWeight: "600",
          color: "#6b6255",
        }}
      >
        <button
          onClick={handleNavigateHome}
          style={{
            background: "none",
            border: "none",
            color: "#8a3b24",
            padding: 0,
            cursor: "pointer",
            fontWeight: "700",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          📚 Study Library
        </button>

        {currentLanguage && (
          <>
            <span style={{ color: "#b39c87" }}>/</span>
            <button
              onClick={() => handleSelectLanguage(currentLanguage.slug)}
              style={{
                background: "none",
                border: "none",
                color: currentView === "language" ? "#2d2419" : "#8a3b24",
                padding: 0,
                cursor: currentView === "language" ? "default" : "pointer",
                fontWeight: currentView === "language" ? "800" : "600",
              }}
            >
              {currentLanguage.name}
            </button>
          </>
        )}

        {currentSubject && (
          <>
            <span style={{ color: "#b39c87" }}>/</span>
            <button
              onClick={() => handleSelectSubject(currentSubject.slug)}
              style={{
                background: "none",
                border: "none",
                color: currentView === "subject" ? "#2d2419" : "#8a3b24",
                padding: 0,
                cursor: currentView === "subject" ? "default" : "pointer",
                fontWeight: currentView === "subject" ? "800" : "600",
              }}
            >
              {currentSubject.name}
            </button>
          </>
        )}

        {currentCourse && (
          <>
            <span style={{ color: "#b39c87" }}>/</span>
            <span style={{ color: "#2d2419", fontWeight: "800" }}>
              {currentCourse.title}
            </span>
          </>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 1. LANDING VIEW (Home of Study Library)                                   */}
      {/* ========================================================================= */}
      {currentView === "landing" && (
        <div>
          {/* Welcome Banner */}
          <div
            style={{
              background: "rgba(255, 253, 248, 0.95)",
              border: "1px solid rgba(122, 83, 48, 0.16)",
              borderRadius: "12px",
              padding: "1.5rem 1.75rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 30px rgba(63, 43, 24, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🏛️</span>
              <h1
                style={{
                  fontSize: "1.65rem",
                  margin: 0,
                  color: "#2d2419",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                Study Library
              </h1>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.95rem",
                color: "#6b6255",
                lineHeight: "1.6",
              }}
            >
              Explore structured learning resources and continue your learning journey across Vedic astrology, mind philosophy, and scriptural studies.
            </p>
          </div>

          {/* SECTION: Continue Learning */}
          <section style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  margin: 0,
                  color: "#2d2419",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⏱️</span> Continue Learning
              </h2>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  color: "#8a3b24",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Demo Progress
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {continueItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255, 253, 248, 0.9)",
                    border: "1px solid rgba(122, 83, 48, 0.16)",
                    borderRadius: "10px",
                    padding: "1.25rem",
                    boxShadow: "0 8px 24px rgba(63, 43, 24, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    {/* Tags row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#f0e6d6",
                          color: "#8a3b24",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {item.languageName}
                      </span>
                      <span
                        style={{
                          background: "#e8efe9",
                          color: "#285b30",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {item.subjectName}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "#8a8071", marginLeft: "auto" }}>
                        {item.lastRead}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "1.1rem",
                        margin: "0 0 0.35rem 0",
                        color: "#2d2419",
                        fontWeight: "700",
                      }}
                    >
                      {item.courseTitle}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "#6b6255", margin: 0 }}>
                      Current: <strong>{item.currentChapterTitle}</strong>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        color: "#6b6255",
                        marginBottom: "6px",
                      }}
                    >
                      <span>Progress</span>
                      <span>{item.progressPercent}%</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "7px",
                        background: "#e6dfd5",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.progressPercent}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #8a3b24, #c96544)",
                          borderRadius: "10px",
                        }}
                      />
                    </div>

                    <button
                      onClick={() => handleDirectContinue(item)}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "#8a3b24",
                        color: "#fffaf2",
                        fontWeight: "700",
                        fontSize: "0.9rem",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(138, 59, 36, 0.2)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>Continue Reading</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Browse by Language */}
          <section>
            <div style={{ marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.2rem",
                  margin: "0 0 0.25rem 0",
                  color: "#2d2419",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🌐</span> Browse by Language
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#6b6255", margin: 0 }}>
                Select a medium of instruction to explore subjects, courses, and structured chapters.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => handleSelectLanguage(lang.slug)}
                  style={{
                    background: "rgba(255, 253, 248, 0.95)",
                    border: "1px solid rgba(122, 83, 48, 0.16)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(63, 43, 24, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.borderColor = "#8a3b24";
                    e.currentTarget.style.boxShadow = "0 14px 30px rgba(138, 59, 36, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(122, 83, 48, 0.16)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(63, 43, 24, 0.05)";
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "1.8rem" }}>{lang.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#2d2419", fontWeight: "700" }}>
                            {lang.name}
                          </h3>
                          <span style={{ fontSize: "0.95rem", color: "#8a3b24", fontWeight: "600" }}>
                            {lang.nativeName}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          background: "#eef5ef",
                          color: "#27ae60",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          border: "1px solid rgba(39, 174, 96, 0.25)",
                        }}
                      >
                        {lang.badge}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#6b6255",
                        lineHeight: "1.5",
                        margin: "0 0 1.25rem 0",
                      }}
                    >
                      {lang.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid rgba(122, 83, 48, 0.1)",
                      fontSize: "0.88rem",
                      fontWeight: "700",
                      color: "#8a3b24",
                    }}
                  >
                    <span>Browse Subjects</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LANGUAGE VIEW (List of Subjects for Selected Language)                */}
      {/* ========================================================================= */}
      {currentView === "language" && currentLanguage && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.75rem" }}>{currentLanguage.icon}</span>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      color: "#2d2419",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}
                  >
                    {currentLanguage.name} ({currentLanguage.nativeName})
                  </h1>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b6255" }}>
                    Select a subject to explore its courses and study chapters.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNavigateHome}
              style={{
                background: "transparent",
                border: "1px solid rgba(138, 59, 36, 0.4)",
                color: "#8a3b24",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ← Back to Languages
            </button>
          </div>

          {/* Subjects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {subjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => handleSelectSubject(subj.slug)}
                style={{
                  background: "rgba(255, 253, 248, 0.95)",
                  border: "1px solid rgba(122, 83, 48, 0.16)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(63, 43, 24, 0.05)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#8a3b24";
                  e.currentTarget.style.boxShadow = "0 14px 30px rgba(138, 59, 36, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(122, 83, 48, 0.16)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(63, 43, 24, 0.05)";
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.6rem" }}>{subj.icon}</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#2d2419", fontWeight: "700" }}>
                          {subj.name}
                        </h3>
                        <span style={{ fontSize: "0.9rem", color: "#8a3b24", fontWeight: "600" }}>
                          {subj.nativeName}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        background: "#f0e6d6",
                        color: "#8a3b24",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {subj.totalCourses} Courses
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b6255",
                      lineHeight: "1.5",
                      margin: "0 0 1.25rem 0",
                    }}
                  >
                    {subj.description}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(122, 83, 48, 0.1)",
                    fontSize: "0.88rem",
                    fontWeight: "700",
                    color: "#8a3b24",
                  }}
                >
                  <span>View Courses</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUBJECT VIEW (List of Courses for Selected Subject)                   */}
      {/* ========================================================================= */}
      {currentView === "subject" && currentSubject && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.75rem" }}>{currentSubject.icon}</span>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      color: "#2d2419",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}
                  >
                    {currentSubject.name} ({currentSubject.nativeName})
                  </h1>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b6255" }}>
                    Medium: <strong>{currentLanguage.name}</strong> • Available structured courses
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectLanguage(currentLanguage.slug)}
              style={{
                background: "transparent",
                border: "1px solid rgba(138, 59, 36, 0.4)",
                color: "#8a3b24",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ← Back to Subjects
            </button>
          </div>

          {/* Courses Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                style={{
                  background: "rgba(255, 253, 248, 0.95)",
                  border: "1px solid rgba(122, 83, 48, 0.16)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 8px 24px rgba(63, 43, 24, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "0.6rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "#f0e6d6",
                        color: "#8a3b24",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {course.level}
                    </span>
                    <span
                      style={{
                        background: "#eef5ef",
                        color: "#285b30",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {course.totalChapters} Chapters
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#8a8071", marginLeft: "auto" }}>
                      ⏱️ {course.estimatedHours}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.2rem",
                      margin: "0 0 0.25rem 0",
                      color: "#2d2419",
                      fontWeight: "700",
                    }}
                  >
                    {course.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "#8a3b24",
                      fontWeight: "600",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {course.nativeTitle}
                  </div>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b6255",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    {course.description}
                  </p>
                </div>

                <button
                  onClick={() => handleSelectCourse(course.slug)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "#8a3b24",
                    color: "#fffaf2",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(138, 59, 36, 0.2)",
                  }}
                >
                  <span>Start Learning / View Course</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COURSE DETAILS & CHAPTER LISTING VIEW                                  */}
      {/* ========================================================================= */}
      {currentView === "course" && currentCourse && (
        <div>
          {/* Course Overview Banner */}
          <div
            style={{
              background: "rgba(255, 253, 248, 0.95)",
              border: "1px solid rgba(122, 83, 48, 0.16)",
              borderRadius: "12px",
              padding: "1.75rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 30px rgba(63, 43, 24, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#f0e6d6",
                    color: "#8a3b24",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}
                >
                  {currentLanguage.name}
                </span>
                <span
                  style={{
                    background: "#e8efe9",
                    color: "#285b30",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}
                >
                  {currentSubject.name}
                </span>
                <span
                  style={{
                    background: "#fdf3e7",
                    color: "#b36b00",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}
                >
                  {currentCourse.level}
                </span>
              </div>

              <button
                onClick={() => handleSelectSubject(currentSubject.slug)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(138, 59, 36, 0.4)",
                  color: "#8a3b24",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                ← Back to Courses
              </button>
            </div>

            <h1
              style={{
                fontSize: "1.6rem",
                margin: "0 0 0.35rem 0",
                color: "#2d2419",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {currentCourse.title}
            </h1>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#8a3b24",
                fontWeight: "600",
                marginBottom: "0.75rem",
              }}
            >
              {currentCourse.nativeTitle}
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6b6255",
                lineHeight: "1.6",
                margin: "0 0 1rem 0",
              }}
            >
              {currentCourse.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                fontSize: "0.85rem",
                color: "#8a8071",
                fontWeight: "600",
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(122, 83, 48, 0.1)",
              }}
            >
              <span>📖 Total Chapters: <strong>{chapters.length}</strong></span>
              <span>⏱️ Total Duration: <strong>{currentCourse.estimatedHours}</strong></span>
            </div>
          </div>

          {/* Chapters List */}
          <div style={{ marginBottom: "1rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                margin: "0 0 0.35rem 0",
                color: "#2d2419",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📑</span> Table of Contents & Chapters
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#6b6255", margin: "0 0 1.25rem 0" }}>
              Click any chapter below to explore the study module outline.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setActiveChapterModal(ch)}
                  style={{
                    background: "rgba(255, 253, 248, 0.95)",
                    border: "1px solid rgba(122, 83, 48, 0.16)",
                    borderRadius: "10px",
                    padding: "1.25rem 1.5rem",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(63, 43, 24, 0.04)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.borderColor = "#8a3b24";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.borderColor = "rgba(122, 83, 48, 0.16)";
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <span
                        style={{
                          background: "#8a3b24",
                          color: "#fffaf2",
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {ch.chapterNumber}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          color: "#2d2419",
                          fontWeight: "700",
                        }}
                      >
                        {ch.title}
                      </h3>
                    </div>

                    <div
                      style={{
                        fontSize: "0.92rem",
                        color: "#8a3b24",
                        fontWeight: "600",
                        marginBottom: "0.3rem",
                        paddingLeft: "34px",
                      }}
                    >
                      {ch.nativeTitle}
                    </div>

                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#6b6255",
                        margin: 0,
                        paddingLeft: "34px",
                        lineHeight: "1.4",
                      }}
                    >
                      {ch.summary}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        background: "#f0e6d6",
                        color: "#8a3b24",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      ⏱️ {ch.estimatedMinutes} min
                    </span>
                    <span
                      style={{
                        color: "#8a3b24",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                      }}
                    >
                      Read →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHAPTER PREVIEW / PHASE 3 PLACEHOLDER MODAL                                */}
      {/* ========================================================================= */}
      {activeChapterModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setActiveChapterModal(null)}
        >
          <div
            style={{
              background: "#fffdf8",
              border: "1px solid rgba(122, 83, 48, 0.2)",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
              boxSizing: "border-box",
              animation: "toast-spring-entry 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Icon & Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>📖</span>
              <span
                style={{
                  background: "#fdf3e7",
                  color: "#b36b00",
                  fontSize: "0.78rem",
                  fontWeight: "800",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(179, 107, 0, 0.3)",
                }}
              >
                Reader Coming in Phase 3
              </span>
            </div>

            <h2
              style={{
                fontSize: "1.35rem",
                color: "#2d2419",
                margin: "0 0 0.35rem 0",
                fontWeight: "700",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {activeChapterModal.title}
            </h2>

            <div
              style={{
                fontSize: "1rem",
                color: "#8a3b24",
                fontWeight: "600",
                marginBottom: "0.85rem",
              }}
            >
              {activeChapterModal.nativeTitle}
            </div>

            <p
              style={{
                fontSize: "0.92rem",
                color: "#6b6255",
                lineHeight: "1.55",
                margin: "0 0 1.25rem 0",
                background: "rgba(240, 230, 214, 0.4)",
                padding: "0.85rem",
                borderRadius: "8px",
                borderLeft: "3px solid #8a3b24",
              }}
            >
              <strong>Summary:</strong> {activeChapterModal.summary}
            </p>

            <div
              style={{
                background: "#fbf9f4",
                border: "1px dashed rgba(122, 83, 48, 0.3)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                fontSize: "0.86rem",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              ✨ <strong>Phase 1 Foundation Active:</strong> The structural hierarchy and course routing are ready. In <strong>Phase 3</strong>, this window will feature the full <em>Digital Book Reader</em> with Markdown study notes, font size controls, bookmarking, text highlighting, and revision mode.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setActiveChapterModal(null)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#8a3b24",
                  color: "#fffaf2",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Close / Back to Chapters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
