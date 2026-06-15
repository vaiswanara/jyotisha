import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { getLibrary } from "../services/astrologyApi.js";
import defaultLibraryData from "../data/library.json";

export function ELibraryPage({ logoUrl }) {
  const { t } = useTranslation();
  const [libraryData, setLibraryData] = useState(() => {
    try {
      const cached = localStorage.getItem("elibrary_books_cache");
      return cached ? JSON.parse(cached) : defaultLibraryData;
    } catch (e) {
      return defaultLibraryData;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  // Helper to parse book URLs based on sourceType
  const parseBookLinks = (book) => {
    if (!book) return { viewUrl: "#", downloadUrl: "#" };

    if (book.sourceType === "gdrive") {
      const url = book.pdfLink || book.readLink || "";
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const fileId = match[1];
        return {
          viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        };
      }
      if (url.length === 33 || (!url.includes("/") && url.length > 15)) {
        return {
          viewUrl: `https://drive.google.com/file/d/${url}/view`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${url}`,
        };
      }
      return { viewUrl: url, downloadUrl: url };
    }

    return {
      viewUrl: book.readLink || book.pdfLink || "#",
      downloadUrl: book.pdfLink || "#",
    };
  };

  // Helper to resolve cover/thumbnail URL with automatic archive.org fallback
  const getBookThumbnailUrl = (book) => {
    if (!book) return null;
    if (book.thumbnail) return book.thumbnail;

    if (book.sourceType === "archive") {
      const linkToParse = book.readLink || book.pdfLink || "";
      const match = linkToParse.match(/details\/([a-zA-Z0-9_-]+)/) || linkToParse.match(/download\/([a-zA-Z0-9_-]+)/) || linkToParse.match(/items\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://archive.org/services/img/${match[1]}`;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchLibrary = async () => {
      let loadedBooks = [];
      try {
        const data = await getLibrary();
        if (data && Array.isArray(data)) {
          loadedBooks = data;
          localStorage.setItem("elibrary_books_cache", JSON.stringify(loadedBooks));
        } else {
          throw new Error("No books returned from API");
        }
      } catch (err) {
        console.warn("API library fetch failed, falling back to static file:", err);
        try {
          const res = await fetch(`${import.meta.env.BASE_URL}static/library.json`);
          if (!res.ok) throw new Error("Failed to load static library file.");
          const data = await res.json();
          loadedBooks = Array.isArray(data) ? data : (data.library || []);
          localStorage.setItem("elibrary_books_cache", JSON.stringify(loadedBooks));
        } catch (staticErr) {
          console.error("Static library fallback fetch failed:", staticErr);
          const cached = localStorage.getItem("elibrary_books_cache");
          if (cached) {
            try {
              loadedBooks = JSON.parse(cached);
            } catch (e) {}
          } else {
            setError("Could not load library books. Please refresh or try again later.");
            setLoading(false);
            return;
          }
        }
      }
      setLibraryData(loadedBooks);
      setLoading(false);
    };

    fetchLibrary();
  }, []);

  // Filter visible items and sort libraryData by createdDate (latest first)
  const sortedLibraryData = useMemo(() => {
    const visibleData = libraryData.filter((book) => book.isVisibility !== false);
    return [...visibleData].sort((a, b) => {
      const dateA = a.createdDate ? new Date(a.createdDate) : new Date(0);
      const dateB = b.createdDate ? new Date(b.createdDate) : new Date(0);
      return dateB - dateA;
    });
  }, [libraryData]);


  // 1. Dynamic Languages List (From actual JSON data)
  const languages = useMemo(() => {
    const langs = new Set(sortedLibraryData.map((book) => book.language).filter(Boolean));
    return ["All", ...Array.from(langs)];
  }, [sortedLibraryData]);

  // 2. Dynamic Subjects List (From actual JSON data)
  const subjects = useMemo(() => {
    const subjs = new Set(sortedLibraryData.map((book) => book.subject).filter(Boolean));
    return ["All", ...Array.from(subjs)];
  }, [sortedLibraryData]);

  // 3. Dynamic Subcategories list based on selected subject
  const subcategories = useMemo(() => {
    let filtered = sortedLibraryData;
    if (selectedSubject !== "All") {
      filtered = sortedLibraryData.filter((book) => book.subject === selectedSubject);
    }
    const subcats = new Set(filtered.map((book) => book.subcategory).filter(Boolean));
    return ["All", ...Array.from(subcats)];
  }, [selectedSubject, sortedLibraryData]);

  // Reset subcategory if subject changes and the previous subcategory is no longer relevant
  React.useEffect(() => {
    setSelectedSubcategory("All");
  }, [selectedSubject]);

  // 4. Recently Added Books (Top 4 latest books)
  const recentlyAddedBooks = useMemo(() => {
    return sortedLibraryData.slice(0, 4);
  }, [sortedLibraryData]);

  // 5. Main Filtered Books list
  const filteredBooks = useMemo(() => {
    return sortedLibraryData.filter((book) => {
      // Search Box Filter
      const matchSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Language Filter
      const matchLanguage =
        selectedLanguage === "All" || book.language === selectedLanguage;

      // Subject Filter
      const matchSubject =
        selectedSubject === "All" || book.subject === selectedSubject;

      // Subcategory Filter
      const matchSubcategory =
        selectedSubcategory === "All" || book.subcategory === selectedSubcategory;

      return matchSearch && matchLanguage && matchSubject && matchSubcategory;
    });
  }, [searchQuery, selectedLanguage, selectedSubject, selectedSubcategory, sortedLibraryData]);

  // Dynamic gradients for book covers if thumbnail is empty
  const getSubjectCoverGradient = (subject) => {
    switch (subject?.toLowerCase()) {
      case "astrology":
        return "linear-gradient(135deg, #8e44ad, #3498db)";
      case "psychology":
        return "linear-gradient(135deg, #16a085, #2ecc71)";
      case "vedas":
        return "linear-gradient(135deg, #d35400, #f1c40f)";
      case "upanishads":
        return "linear-gradient(135deg, #c0392b, #e67e22)";
      case "sanskrit":
        return "linear-gradient(135deg, #2980b9, #34495e)";
      case "dharma":
        return "linear-gradient(135deg, #e67e22, #c0392b)";
      default:
        return "linear-gradient(135deg, #7f8c8d, #95a5a6)";
    }
  };

  const getSubjectColor = (subj) => {
    switch (subj?.toLowerCase()) {
      case "astrology": return "#8e44ad";
      case "psychology": return "#16a085";
      case "vedas": return "#d35400";
      case "upanishads": return "#c0392b";
      case "sanskrit": return "#2980b9";
      case "dharma": return "#e67e22";
      default: return "#7f8c8d";
    }
  };

  return (
    <main
      className="page"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <style>{`
        .library-section {
          padding: 20px;
          padding-top: calc(env(safe-area-inset-top, 0px) + 10px);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .filter-panel {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .search-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 2;
          min-width: 260px;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          transition: border-color 0.2s;
        }
        .search-input:focus {
          border-color: #8e44ad;
        }

        .dropdown-select {
          flex: 1;
          min-width: 150px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          background: #fff;
          cursor: pointer;
        }

        .pills-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          scrollbar-width: none; /* Firefox */
        }
        .pills-container::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }

        .pill-item {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
          background: #fdfefe;
          color: #555;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .pill-item:hover {
          background: #f5f6fa;
        }
        .pill-item.active {
          background: #8e44ad;
          color: #fff;
          border-color: #8e44ad;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.2);
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          width: 100%;
        }

        .book-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eef0f3;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .book-info {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }

        .book-title {
          font-size: 16px;
          fontWeight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .book-author {
          font-size: 13px;
          color: #7f8c8d;
          margin: 0;
          font-style: italic;
        }

        .badges-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .book-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .actions-row {
          display: flex;
          gap: 10px;
          border-top: 1px solid #f2f4f8;
          padding: 12px 18px;
          background: #fafbfc;
        }

        .action-btn {
          flex: 1;
          padding: 9px;
          font-size: 13px;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-view {
          background: #fff;
          border: 1px solid #cbd5e0;
          color: #4a5568;
        }
        .btn-view:hover {
          background: #edf2f7;
          border-color: #a0aec0;
        }
        .btn-download {
          background: #8e44ad;
          border: 1px solid #8e44ad;
          color: #fff;
        }
        .btn-download:hover {
          background: #732d91;
          border-color: #732d91;
        }

        .featured-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e67e22;
          font-size: 18px;
          margin: 0 0 15px 0;
          font-weight: bold;
        }

        .recently-added-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 15px;
          width: 100%;
        }

        .recently-added-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eef0f3;
          box-shadow: 0 3px 10px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .recently-added-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .recently-added-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }

        .recently-added-title {
          font-size: 14px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .recently-added-author {
          font-size: 12px;
          color: #7f8c8d;
          margin: 0;
          font-style: italic;
        }

        .recently-added-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .recently-added-actions {
          display: flex;
          gap: 8px;
          border-top: 1px solid #f2f4f8;
          padding: 8px 12px;
          background: #fafbfc;
        }

        @media (max-width: 480px) {
          .library-section {
            padding: 10px;
          }
          .filter-panel {
            padding: 12px;
            border-radius: 12px;
          }
          .search-row {
            flex-direction: column;
            gap: 10px;
          }
          .search-input, .dropdown-select {
            width: 100%;
          }
          .books-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .recently-added-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("e-Library", "e-Library")}
        eyebrow="e-JYOTISHA"
        subtitle={t("librarySubtitle", "Vaiswanara Digital Library for Students")}
      />

      <section className="library-section">
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#8e44ad", fontWeight: "bold", fontSize: "1.1rem" }}>
            ⏳ {t("loadingLibrary", "Loading library books...")}
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#e74c3c", fontWeight: "bold", fontSize: "1.1rem" }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Dynamic Filters Panel */}
            <div className="filter-panel">
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder={t("searchPlaceholder", "Search by title, author, description...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Language Selector Dropdown */}
            <select
              className="dropdown-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="All">{t("All Languages", "All Languages")}</option>
              {languages.filter((l) => l !== "All").map((lang) => (
                <option key={lang} value={lang}>
                  {t(lang, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter Pills */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#666", marginBottom: "8px" }}>
              {t("Subject", "Subject")}
            </div>
            <div className="pills-container">
              <button
                className={`pill-item ${selectedSubject === "All" ? "active" : ""}`}
                onClick={() => setSelectedSubject("All")}
              >
                {t("All Subjects", "All Subjects")}
              </button>
              {subjects.filter((s) => s !== "All").map((subj) => (
                <button
                  key={subj}
                  className={`pill-item ${selectedSubject === subj ? "active" : ""}`}
                  onClick={() => setSelectedSubject(subj)}
                >
                  {t(subj, subj)}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter Pills (Dynamic based on selected Subject) */}
          {subcategories.length > 1 && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#666", marginBottom: "8px" }}>
                {t("Subcategory", "Subcategory")}
              </div>
              <div className="pills-container">
                <button
                  className={`pill-item ${selectedSubcategory === "All" ? "active" : ""}`}
                  onClick={() => setSelectedSubcategory("All")}
                >
                  {t("All", "All")}
                </button>
                {subcategories.filter((sc) => sc !== "All").map((subcat) => (
                  <button
                    key={subcat}
                    className={`pill-item ${selectedSubcategory === subcat ? "active" : ""}`}
                    onClick={() => setSelectedSubcategory(subcat)}
                  >
                    {t(subcat, subcat)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Catalog Library Books List */}
        <h2 style={{ fontSize: "18px", color: "#2c3e50", fontWeight: "bold", marginBottom: "15px" }}>
          📚 {t("Catalog", "Books Catalog")} ({filteredBooks.length})
        </h2>

        {filteredBooks.length === 0 ? (
          <div
            style={{
              padding: "50px 20px",
              textAlign: "center",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #eee",
              color: "#7f8c8d",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <h3>{t("No Results Found", "No Results Found")}</h3>
            <p>{t("noResultsLibraryDesc", "Try adjusting your search queries or category filters.")}</p>
          </div>
        ) : (
          <div className="books-grid" style={{ marginBottom: "35px" }}>
            {filteredBooks.map((book) => {
              const urls = parseBookLinks(book);
              const bookThumbnail = getBookThumbnailUrl(book);
              return (
                <div className="book-card" key={book.id}>
                  {/* Render Book Cover */}
                  {bookThumbnail ? (
                    <img
                      src={bookThumbnail}
                      alt={book.title}
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: bookThumbnail ? "none" : "flex",
                      width: "100%",
                      height: "220px",
                      background: getSubjectCoverGradient(book.subject),
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "20px",
                      boxSizing: "border-box",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "11px", textTransform: "uppercase", opacity: 0.8, fontWeight: "bold" }}>
                      {t(book.subject)}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", margin: "10px 0" }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.9 }}>
                      {book.author}
                    </div>
                  </div>

                  <div className="book-info">
                    <div className="badges-row">
                      <span
                        className="badge-pill"
                        style={{ background: "#ebf5fb", color: "#2980b9" }}
                      >
                        {t(book.language, book.language)}
                      </span>
                      <span
                        className="badge-pill"
                        style={{
                          background: `${getSubjectColor(book.subject)}15`,
                          color: getSubjectColor(book.subject),
                        }}
                      >
                        {t(book.subject, book.subject)}
                      </span>
                      {book.subcategory && (
                        <span
                          className="badge-pill"
                          style={{ background: "#f5f6fa", color: "#7f8c8d" }}
                        >
                          {t(book.subcategory, book.subcategory)}
                        </span>
                      )}
                    </div>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{t("Author", "Author")}: {book.author}</p>
                    <p className="book-desc">{book.description}</p>
                  </div>

                  <div className="actions-row">
                    <a
                      href={urls.viewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn btn-download"
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      📖 {t("viewDownload", "View / Download")}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Featured Section (Recently Added) - DISPLAYED AT THE BOTTOM */}
        {selectedSubject === "All" && selectedLanguage === "All" && searchQuery === "" && recentlyAddedBooks.length > 0 && (
          <div style={{ marginTop: "40px", borderTop: "1px dashed #ddd", paddingTop: "30px", marginBottom: "20px" }}>
            <h2 className="featured-header" style={{ color: "#7f8c8d", fontSize: "16px" }}>
              ✨ {t("Recently Added", "Recently Added")}
            </h2>
            <div className="recently-added-grid">
              {recentlyAddedBooks.map((book) => {
                const urls = parseBookLinks(book);
                const bookThumbnail = getBookThumbnailUrl(book);
                return (
                  <div className="recently-added-card" key={`featured-${book.id}`}>
                    {/* Render Book Cover - Smaller Height */}
                    {bookThumbnail ? (
                      <img
                        src={bookThumbnail}
                        alt={book.title}
                        style={{ width: "100%", height: "160px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display: bookThumbnail ? "none" : "flex",
                        width: "100%",
                        height: "160px",
                        background: getSubjectCoverGradient(book.subject),
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "12px",
                        boxSizing: "border-box",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "9px", textTransform: "uppercase", opacity: 0.8, fontWeight: "bold" }}>
                        {t(book.subject)}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 0" }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: "9px", fontStyle: "italic", opacity: 0.9 }}>
                        {book.author}
                      </div>
                    </div>

                    <div className="recently-added-info">
                      <div className="badges-row" style={{ gap: "4px" }}>
                        <span
                          className="badge-pill"
                          style={{ background: "#ebf5fb", color: "#2980b9", fontSize: "9px", padding: "2px 6px" }}
                        >
                          {t(book.language, book.language)}
                        </span>
                        <span
                          className="badge-pill"
                          style={{
                            background: `${getSubjectColor(book.subject)}15`,
                            color: getSubjectColor(book.subject),
                            fontSize: "9px",
                            padding: "2px 6px"
                          }}
                        >
                          {t(book.subject, book.subject)}
                        </span>
                      </div>
                      <h3 className="recently-added-title">{book.title}</h3>
                      <p className="recently-added-author" style={{ fontSize: "11px", margin: 0 }}>{t("Author", "Author")}: {book.author}</p>
                      <p className="recently-added-desc">{book.description}</p>
                    </div>

                    <div className="actions-row">
                      <a
                        href={urls.viewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="action-btn btn-download"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        📖 {t("viewDownload", "View / Download")}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </>
        )}
      </section>
    </main>
  );
}
