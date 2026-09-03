import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getLessons } from "../services/astrologyApi.js";
import { triggerDownload } from "../utils/downloadHelper.js";

export function EpataPage({ logoUrl, onNavigate }) {
  const { t, i18n } = useTranslation();
  // Try loading initial state from local storage cache for instant rendering
  const [lessons, setLessons] = useState(() => {
    try {
      const cached = localStorage.getItem("epata_lessons_cache");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const cached = localStorage.getItem("epata_lessons_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        return [...new Set(parsed.map((l) => l.playlist))];
      }
    } catch (e) {}
    return [];
  });

  const [selectedPlaylist, setSelectedPlaylist] = useState(() => {
    try {
      const savedPl = localStorage.getItem("epata_last_playlist");
      if (savedPl) return savedPl;
      const cached = localStorage.getItem("epata_lessons_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const uniquePlaylists = [...new Set(parsed.map((l) => l.playlist))];
        const isTelugu = i18n?.language?.startsWith("te");
        return uniquePlaylists.find((p) =>
          isTelugu ? p.includes("తెలుగు") : p.includes("ಕನ್ನಡ"),
        ) || uniquePlaylists[0] || "";
      }
    } catch (e) {}
    return "";
  });

  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem("epata_lessons_cache");
      return !cached; // only show loader on first visit when cache is empty
    } catch (e) {
      return true;
    }
  });

  const [error, setError] = useState("");
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState({});
  const playerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const [bookmarks, setBookmarks] = useState({});
  const [showPdfOnly, setShowPdfOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const playNextRef = useRef(null);

  // Export User Data (Progress, Bookmarks, Preferences)
  const handleExportData = () => {
    const progressData = JSON.parse(
      localStorage.getItem("epata_progress") || "{}",
    );
    const bookmarksData = JSON.parse(
      localStorage.getItem("epata_bookmarks") || "{}",
    );
    const lastPlaylist = localStorage.getItem("epata_last_playlist") || "";

    const hasProgress = Object.keys(progressData).length > 0;
    const hasBookmarks = Object.keys(bookmarksData).length > 0;

    if (!hasProgress && !hasBookmarks) {
      alert(t("noDataToBackup", "No e-PATA watch progress or bookmarks found on this device to backup! (మీరు ఇంకా ఏ పాఠాలనూ చూడలేదు లేదా బుక్‌మార్క్ చేయలేదు)"));
      return;
    }

    const exportData = {
      epata_progress: progressData,
      epata_bookmarks: bookmarksData,
      epata_last_playlist: lastPlaylist,
    };
    triggerDownload(
      JSON.stringify(exportData, null, 2),
      `epata_backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
  };

  // Import User Data
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.epata_progress) {
          localStorage.setItem(
            "epata_progress",
            JSON.stringify(parsed.epata_progress),
          );
          setProgress(parsed.epata_progress);
        }
        if (parsed.epata_bookmarks) {
          localStorage.setItem(
            "epata_bookmarks",
            JSON.stringify(parsed.epata_bookmarks),
          );
          setBookmarks(parsed.epata_bookmarks);
        }
        if (parsed.epata_last_playlist !== undefined) {
          localStorage.setItem(
            "epata_last_playlist",
            parsed.epata_last_playlist,
          );
          setSelectedPlaylist(parsed.epata_last_playlist);
        }
        alert(t("importSuccess", "Data imported successfully!"));
      } catch (err) {
        alert(t("importFailed", "Failed to import data: ") + err.message);
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchLessons = async () => {
      let loadedLessons = [];
      try {
        // Try fetching lessons dynamically from the backend API first
        const data = await getLessons();
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.lessons) ? data.lessons : null);
        if (list && list.length > 0) {
          loadedLessons = list;
          // Cache the lessons in localStorage
          localStorage.setItem("epata_lessons_cache", JSON.stringify(loadedLessons));
        } else {
          throw new Error("No lessons returned from API");
        }
      } catch (err) {
        console.warn(
          "API lessons fetch failed, falling back to static file:",
          err,
        );
        // Fallback: fetch from the static JSON file
        try {
          const res = await fetch(
            `${import.meta.env.BASE_URL}static/lessons.json`,
          );
          if (!res.ok) throw new Error("Failed to load static lessons file.");
          const data = await res.json();
          loadedLessons = Array.isArray(data) ? data : (data?.lessons || []);
          localStorage.setItem("epata_lessons_cache", JSON.stringify(loadedLessons));
        } catch (staticErr) {
          console.error("Static lessons fallback fetch failed:", staticErr);
          // If we fail to fetch but we have cached data, don't show error, just keep the cached data
          const cached = localStorage.getItem("epata_lessons_cache");
          if (cached) {
            try {
              loadedLessons = JSON.parse(cached);
            } catch (e) {}
          } else {
            setError(
              "Could not load e-PATA lessons. Please check the lessons.json configuration.",
            );
            setLoading(false);
            return;
          }
        }
      }

      setLessons(loadedLessons);

      // Extract unique playlists
      const uniquePlaylists = [
        ...new Set(loadedLessons.map((l) => l.playlist)),
      ];
      setPlaylists(uniquePlaylists);

      // Default to matching language playlist based on i18n settings
      const isTelugu = i18n.language?.startsWith("te");
      const savedPl = localStorage.getItem("epata_last_playlist");
      const defaultPl =
        savedPl && uniquePlaylists.includes(savedPl)
          ? savedPl
          : uniquePlaylists.find((p) =>
              isTelugu ? p.includes("తెలుగు") : p.includes("ಕನ್ನಡ"),
            ) || uniquePlaylists[0];

      if (defaultPl) setSelectedPlaylist(defaultPl);
      setLoading(false);
    };

    fetchLessons();
  }, [i18n.language]);

  // Save selected playlist to localStorage
  useEffect(() => {
    if (selectedPlaylist) {
      localStorage.setItem("epata_last_playlist", selectedPlaylist);
    }
  }, [selectedPlaylist]);

  // Load watch progress and YouTube API
  useEffect(() => {
    try {
      const saved = localStorage.getItem("epata_progress");
      if (saved) setProgress(JSON.parse(saved));
      const savedBookmarks = localStorage.getItem("epata_bookmarks");
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    } catch (e) {}

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Reset selected lesson when playlist changes
  useEffect(() => {
    setSelectedLessonId("");
  }, [selectedPlaylist, showFavoritesOnly]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const updateProgress = (videoId, time, duration) => {
    if (!videoId || !duration) return;
    setProgress((prev) => {
      const isWatched = time / duration > 0.9 || prev[videoId]?.watched;
      const updated = {
        ...prev,
        [videoId]: { lastPosition: time, duration, watched: isWatched },
      };
      localStorage.setItem("epata_progress", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (activeVideo) {
      const initPlayer = () => {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {}
          playerRef.current = null;
        }

        // StrictMode Fix: Ensure target div exists before creating player
        const container = document.getElementById("epata-yt-player-container");
        if (container) {
          container.innerHTML = '<div id="epata-yt-player"></div>';
        }

        const savedProgress = progress[activeVideo];
        const startSeconds = savedProgress?.lastPosition
          ? Math.floor(savedProgress.lastPosition)
          : 0;

        playerRef.current = new window.YT.Player("epata-yt-player", {
          height: "100%",
          width: "100%",
          host: "https://www.youtube-nocookie.com",
          videoId: activeVideo,
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            start: startSeconds,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === (window.YT?.PlayerState?.PLAYING ?? 1)) {
                if (progressTimerRef.current)
                  clearInterval(progressTimerRef.current);
                progressTimerRef.current = setInterval(() => {
                  if (playerRef.current?.getCurrentTime) {
                    updateProgress(
                      activeVideo,
                      playerRef.current.getCurrentTime(),
                      playerRef.current.getDuration(),
                    );
                  }
                }, 5000);
              } else {
                if (progressTimerRef.current)
                  clearInterval(progressTimerRef.current);
                if (playerRef.current?.getCurrentTime) {
                  updateProgress(
                    activeVideo,
                    playerRef.current.getCurrentTime(),
                    playerRef.current.getDuration(),
                  );
                }
                if (event.data === (window.YT?.PlayerState?.ENDED ?? 0)) {
                  updateProgress(
                    activeVideo,
                    playerRef.current.getDuration(),
                    playerRef.current.getDuration(),
                  );
                  if (playNextRef.current) playNextRef.current();
                }
              }
            },
          },
        });
      };

      if (window.YT && window.YT.Player) initPlayer();
      else window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  const handleCloseVideo = () => {
    if (playerRef.current?.getCurrentTime) {
      updateProgress(
        activeVideo,
        playerRef.current.getCurrentTime(),
        playerRef.current.getDuration(),
      );
    }
    setActiveVideo(null);
  };

  const toggleBookmark = (e, videoId) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const updated = { ...prev };
      if (updated[videoId]) delete updated[videoId];
      else updated[videoId] = true;
      localStorage.setItem("epata_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const lessonsForPlaylist = showFavoritesOnly
    ? lessons.filter((l) => l.status === "ON" && bookmarks[l.videoId])
    : lessons.filter(
        (l) => l.status === "ON" && l.playlist === selectedPlaylist,
      );

  const baseFilteredLessons = lessonsForPlaylist.filter((l) => {
    const matchSearch = l.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchLesson = selectedLessonId ? l.id === selectedLessonId : true;
    const matchPdf = showPdfOnly ? !!l.pdfLink : true;
    return matchSearch && matchLesson && matchPdf;
  });

  const filteredLessons =
    sortOrder === "desc"
      ? [...baseFilteredLessons].reverse()
      : baseFilteredLessons;

  // Calculate Course Progress
  const totalLessons = lessonsForPlaylist.length;
  const watchedLessons = lessonsForPlaylist.filter(
    (l) => progress[l.videoId]?.watched,
  ).length;
  const courseProgressPercent =
    totalLessons === 0 ? 0 : Math.round((watchedLessons / totalLessons) * 100);

  // Next / Previous Video Logic
  const currentVideoIndex = filteredLessons.findIndex(
    (l) => l.videoId === activeVideo,
  );
  const hasPrev = currentVideoIndex > 0;
  const hasNext =
    currentVideoIndex !== -1 && currentVideoIndex < filteredLessons.length - 1;

  const playPrev = (e) => {
    if (e) e.stopPropagation();
    if (hasPrev) setActiveVideo(filteredLessons[currentVideoIndex - 1].videoId);
  };
  const playNext = (e) => {
    if (e) e.stopPropagation();
    if (hasNext) setActiveVideo(filteredLessons[currentVideoIndex + 1].videoId);
  };

  useEffect(() => {
    playNextRef.current = playNext;
  });

  return (
    <main className="page">
      <section
        className="workspace"
        style={{
          padding: "15px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 15px)",
          paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
          display: "block",
        }}
      >
        <style>{`
          .epata-wrapper { display: flex; flex-direction: column; width: 100%; max-width: 1400px; margin: 0 auto; }
          .epata-controls-container { display: flex; flex-direction: column; gap: 15px; margin: 0 auto 25px auto; width: 100%; max-width: 1000px; }
          .epata-controls-row { display: flex; gap: 15px; flex-wrap: nowrap; width: 100%; align-items: center; justify-content: center; }
          .epata-select-row { display: flex; gap: 15px; flex-wrap: nowrap; width: 100%; align-items: center; justify-content: center; }
          .epata-divider { width: 100%; border: none; border-top: 1px dashed #dcdde1; margin: 0 0 25px 0; }
          .epata-search-wrapper { flex: 1; display: flex; min-width: 0; gap: 10px; }
          .epata-search { flex: 1; padding: 12px 18px; border-radius: 10px; border: 1px solid #8e44ad; font-size: 1rem; box-sizing: border-box; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(142,68,173,0.1); }
          .epata-search:focus { border-color: #8e44ad; box-shadow: 0 0 0 3px rgba(142,68,173,0.15); }
          .epata-select { flex: 1; min-width: 0; padding: 12px 35px 12px 15px; border-radius: 10px; border: 1px solid #dcdde1; font-size: 0.95rem; font-weight: 600; color: #2d3436; background: #fff; outline: none; cursor: pointer; transition: border-color 0.3s; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="%238e44ad" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>'); background-repeat: no-repeat; background-position: right 10px center; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
         .epata-select:focus { border-color: #8e44ad; box-shadow: 0 0 0 3px rgba(142,68,173,0.1); }
          .epata-search-btn { flex-shrink: 0; width: 56px; min-height: 56px; background: #f8f9fa; color: #6c3483; border: 1px solid #dcdde1; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s; gap: 2px; padding: 6px 4px; }
          .epata-search-btn:active { transform: scale(0.95); background: #f0e6fa; }
          .epata-search-close-btn { flex-shrink: 0; width: 52px; height: 52px; background: #e74c3c; color: #fff; border: none; border-radius: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 8px rgba(231,76,60,0.3); transition: transform 0.1s; font-size: 34px; line-height: 1; }
          .epata-search-close-btn:active { transform: scale(0.95); }
          .epata-filter-btn { flex-shrink: 0; width: 56px; min-height: 56px; background: #f8f9fa; color: #2d3436; border: 1px solid #dcdde1; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: all 0.3s; font-size: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); gap: 2px; padding: 6px 4px; }
          .epata-filter-btn.active { background: #f39c12; color: #fff; border-color: #f39c12; box-shadow: 0 4px 8px rgba(243,156,18,0.3); }
          .epata-btn-label { font-size: 9px; font-weight: 600; line-height: 1; text-align: center; letter-spacing: 0.2px; opacity: 0.75; white-space: nowrap; }
          .epata-filter-btn.active .epata-btn-label { opacity: 1; }
          .epata-bookmark-btn { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.5); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 10; font-size: 16px; transition: transform 0.2s, background 0.3s; }
          .epata-bookmark-btn:hover { transform: scale(1.1); background: rgba(0,0,0,0.8); }
          .epata-bookmark-btn.active { background: rgba(241, 196, 15, 0.9); }
          .epata-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; width: 100%; }
          @media (min-width: 769px) {
            .hide-on-desktop { display: none !important; }
          }
          @media (max-width: 768px) {
            .epata-controls-container { gap: 10px; margin-bottom: 20px; }
            .epata-controls-row { gap: 10px; }
            .epata-select-row { flex-direction: column; gap: 10px; width: 100%; }
            .epata-select-row .epata-select { width: 100%; flex: none; }
            .epata-select { padding: 10px 28px 10px 10px; font-size: 0.9rem; border-radius: 8px; }
            .epata-search { padding: 10px 15px; border-radius: 8px; }
            .epata-search-btn, .epata-search-close-btn { width: 50px; min-height: 50px; border-radius: 8px; }
            .epata-search-btn { font-size: 17px; }
            .epata-filter-btn { width: 50px; min-height: 50px; border-radius: 8px; font-size: 17px; }
            .epata-btn-label { font-size: 8px; }
            .epata-search-close-btn { font-size: 28px; }
            .epata-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
            .hide-on-mobile { display: none !important; }
          }
          .epata-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #f1f2f6; transition: transform 0.2s; display: flex; flex-direction: column; }
          .epata-card:active { transform: scale(0.98); }
          .epata-thumb-container { position: relative; width: 100%; aspect-ratio: 16/9; background: #2d3436; cursor: pointer; overflow: hidden; }
          .epata-thumb { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: transform 0.3s, opacity 0.3s; }
          .epata-thumb-container:hover .epata-thumb { transform: scale(1.05); opacity: 1; }
          .epata-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background: rgba(220, 38, 38, 0.9); border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
          .epata-play-btn::after { content: ''; width: 0; height: 0; border-style: solid; border-width: 10px 0 10px 16px; border-color: transparent transparent transparent #fff; margin-left: 4px; }
          .epata-details { padding: 15px; display: flex; flex-direction: column; flex: 1; }
          .epata-title { font-size: 1rem; font-weight: 700; color: #2d3436; margin: 0 0 15px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .epata-pdf-btn { align-self: flex-start; margin-top: auto; display: inline-flex; align-items: center; gap: 6px; background: #fdf5e6; color: #d35400; border: 1px solid #f39c12; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
          .epata-pdf-btn:hover { background: #f39c12; color: #fff; }
          .epata-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 9999; display: flex; justify-content: center; align-items: center; flex-direction: column; backdrop-filter: blur(5px); }
          .epata-modal-close { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 24px; border: none; cursor: pointer; transition: background 0.3s; }
          .epata-modal-close:hover { background: #e74c3c; }
          .epata-iframe-container { width: 100%; max-width: 900px; aspect-ratio: 16/9; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden; width: 95%; }
          .epata-watched-badge { position: absolute; top: 10px; right: 10px; background: #27ae60; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .epata-progress-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: rgba(0,0,0,0.5); z-index: 10; }
          .epata-progress-fill { height: 100%; background: #e74c3c; transition: width 0.3s; }
          .epata-course-progress-container { width: 100%; max-width: 1000px; margin: 0 auto 10px auto; background: #f1f2f6; border-radius: 8px; overflow: hidden; height: 6px; position: relative; }
          .epata-course-progress-bar { height: 100%; background: #27ae60; transition: width 0.3s ease; }
          .epata-course-progress-text { text-align: center; font-size: 0.85rem; color: #636e72; margin-bottom: 20px; font-weight: 600; }
          .epata-modal-controls { display: flex; justify-content: center; gap: 20px; margin-top: 15px; width: 100%; max-width: 900px; }
          .epata-nav-btn { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background 0.3s; display: flex; align-items: center; gap: 8px; font-weight: bold; }
          .epata-nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.4); }
          .epata-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        `}</style>

        {loading && (
          <div className="message">{t("loading", "Loading lessons...")}</div>
        )}
        {error && <div className="message error">{error}</div>}

        {!loading && !error && (
          <div className="epata-wrapper">
            <div className="epata-controls-container">
              <div className="epata-controls-row">
                <div
                  className={`epata-search-wrapper ${!isSearchOpen ? "hide-on-mobile" : ""}`}
                >
                  <input
                    type="text"
                    ref={searchInputRef}
                    className="epata-search"
                    placeholder={t(
                      "searchLessons",
                      "Search lessons by title...",
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="epata-search-close-btn hide-on-desktop"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    &times;
                  </button>
                </div>

                <button
                  className={`epata-filter-btn ${showFavoritesOnly ? "active" : ""} ${isSearchOpen ? "hide-on-mobile" : ""}`}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  title={t("showFavoritesOnly", "Show Favorites Only")}
                >
                  ⭐
                  <span className="epata-btn-label">{t("favLabel", "Fav")}</span>
                </button>

                <button
                  className={`epata-filter-btn ${showPdfOnly ? "active" : ""} ${isSearchOpen ? "hide-on-mobile" : ""}`}
                  onClick={() => setShowPdfOnly(!showPdfOnly)}
                  title={t("showPdfOnly", "Show PDFs Only")}
                >
                  📄
                  <span className="epata-btn-label">{t("notesLabel", "Notes")}</span>
                </button>

                <button
                  className={`epata-filter-btn ${sortOrder === "desc" ? "active" : ""} ${isSearchOpen ? "hide-on-mobile" : ""}`}
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  title={
                    sortOrder === "asc"
                      ? t("sortByNewest", "Sort: Newest First")
                      : t("sortByOldest", "Sort: Oldest First")
                  }
                >
                  {sortOrder === "asc" ? "⬆️" : "⬇️"}
                  <span className="epata-btn-label">{sortOrder === "asc" ? t("ascLabel", "Asc") : t("descLabel", "Desc")}</span>
                </button>

                <button
                  className={`epata-filter-btn ${isSearchOpen ? "hide-on-mobile" : ""}`}
                  onClick={handleExportData}
                  title={t("exportData", "Export Data")}
                >
                  📤
                  <span className="epata-btn-label">{t("exportLabel", "Export")}</span>
                </button>

                <button
                  className={`epata-filter-btn ${isSearchOpen ? "hide-on-mobile" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  title={t("importData", "Import Data")}
                >
                  📥
                  <span className="epata-btn-label">{t("importLabel", "Import")}</span>
                </button>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImportData}
                  style={{ display: "none" }}
                />

                {!isSearchOpen && (
                  <button
                    className="epata-search-btn hide-on-desktop"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span className="epata-btn-label">{t("searchLabel", "Search")}</span>
                  </button>
                )}
              </div>

              <div
                className={`epata-select-row ${isSearchOpen ? "hide-on-mobile" : ""}`}
              >
                <select
                  className="epata-select"
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  disabled={showFavoritesOnly}
                >
                  {playlists.map((pl) => (
                    <option key={pl} value={pl}>
                      {pl}
                    </option>
                  ))}
                </select>

                <select
                  className="epata-select"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                >
                  <option value="">
                    {t("allLessons", "-- All Lessons --")}
                  </option>
                  {lessonsForPlaylist.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {totalLessons > 0 && (
              <>
                <div className="epata-course-progress-container">
                  <div
                    className="epata-course-progress-bar"
                    style={{ width: `${courseProgressPercent}%` }}
                  ></div>
                </div>
                <div className="epata-course-progress-text">
                  {watchedLessons} / {totalLessons}{" "}
                  {t("lessonsCompleted", "Lessons Completed")} (
                  {courseProgressPercent}%)
                </div>
              </>
            )}

            <hr className="epata-divider" />

            {filteredLessons.length === 0 ? (
              <div className="message">
                {t("noLessonsFound", "No lessons found.")}
              </div>
            ) : (
              <div className="epata-grid">
                {filteredLessons.map((lesson) => {
                  const vidProgress = progress[lesson.videoId];
                  const percent = vidProgress?.duration
                    ? Math.min(
                        100,
                        (vidProgress.lastPosition / vidProgress.duration) * 100,
                      )
                    : 0;
                  const isWatched = vidProgress?.watched;

                  return (
                    <div className="epata-card" key={lesson.id}>
                      <div
                        className="epata-thumb-container"
                        onClick={() => setActiveVideo(lesson.videoId)}
                      >
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="epata-thumb"
                        />
                        <div className="epata-play-btn"></div>

                        <div
                          className={`epata-bookmark-btn ${bookmarks[lesson.videoId] ? "active" : ""}`}
                          onClick={(e) => toggleBookmark(e, lesson.videoId)}
                          title={
                            bookmarks[lesson.videoId]
                              ? t("removeBookmark", "Remove from Favorites")
                              : t("addBookmark", "Add to Favorites")
                          }
                        >
                          {bookmarks[lesson.videoId] ? "⭐" : "☆"}
                        </div>

                        {isWatched && (
                          <div className="epata-watched-badge">
                            ✓ {t("Watched", "Watched")}
                          </div>
                        )}
                        {percent > 0 && !isWatched && (
                          <div className="epata-progress-bar">
                            <div
                              className="epata-progress-fill"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="epata-details">
                        <h4 className="epata-title">{lesson.title}</h4>
                        {lesson.pdfLink && (
                          <a
                            href={lesson.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="epata-pdf-btn"
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download Notes
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {activeVideo && (
        <div className="epata-modal" onClick={handleCloseVideo}>
          <button className="epata-modal-close" onClick={handleCloseVideo}>
            &times;
          </button>
          <div
            className="epata-iframe-container"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative" }}
          >
            <div
              id="epata-yt-player-container"
              style={{ width: "100%", height: "100%" }}
            >
              <div id="epata-yt-player"></div>
            </div>
          </div>
          <div
            className="epata-modal-controls"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="epata-nav-btn"
              disabled={!hasPrev}
              onClick={playPrev}
            >
              &larr; {t("Previous", "Previous")}
            </button>
            <button
              className="epata-nav-btn"
              disabled={!hasNext}
              onClick={playNext}
            >
              {t("Next", "Next")} &rarr;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
