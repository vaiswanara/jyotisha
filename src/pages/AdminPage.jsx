import React, { useState, useEffect } from "react";
import { API_URL, API_TOKEN, getLessons, saveLessons, saveSubscribers, getLibrary, saveLibrary, getTicker, saveTicker } from "../services/astrologyApi.js";
export function AdminPage({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminData, setAdminData] = useState({ subscribers: [] });
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [filterPlaylist, setFilterPlaylist] = useState("");

  // Send Alert Form State
  const [alertForm, setAlertForm] = useState({
    title: "",
    body: "",
    url: import.meta.env.BASE_URL,
    is_important: false,
  });

  // e-PATA Lesson Form State
  const [editingLessonId, setEditingLessonId] = useState(null); // null for Add, lesson.id for Edit
  const [isCreatingNewPlaylist, setIsCreatingNewPlaylist] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    playlist: "",
    title: "",
    videoId: "",
    pdfLink: "",
    status: "ON",
  });
  // e-Library Form State
  const [library, setLibrary] = useState([]);
  const [tickerList, setTickerList] = useState([]);
  const [tickerForm, setTickerForm] = useState({ id: "", startDate: "", endDate: "", updates: [] });
  const [tickerUpdatesText, setTickerUpdatesText] = useState("");
  const [loadingTicker, setLoadingTicker] = useState(false);
  const [isEditingTicker, setIsEditingTicker] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState("normal");
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    language: "",
    subject: "",
    subcategory: "",
    description: "",
    sourceType: "archive",
    thumbnail: "",
    readLink: "",
    pdfLink: "",
    createdDate: new Date().toISOString().split("T")[0],
    isVisibility: true,
  });

  const [deletePrompt, setDeletePrompt] = useState({
    isOpen: false,
    type: "", // "subscribers" or "users"
    passwordInput: "",
  });

  useEffect(() => {
    const savedPwd = sessionStorage.getItem("admin_pwd");
    if (savedPwd) {
      setPassword(savedPwd);
      setIsLoggedIn(true);
      fetchAdminData(savedPwd);
    }
  }, []);

  const fetchLessonsList = async () => {
    try {
      const data = await getLessons();
      if (data && Array.isArray(data.lessons) && data.lessons.length > 0) {
        setLessons(data.lessons);
      } else {
        // API లో lessons.json లేకపోతే static file నుండి load చేయడం
        throw new Error("No lessons from API, trying static fallback");
      }
    } catch (err) {
      console.warn("API lessons fetch failed, falling back to static file:", err);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}static/lessons.json`);
        if (!res.ok) throw new Error("Static lessons file not found");
        const data = await res.json();
        if (data && Array.isArray(data.lessons)) {
          setLessons(data.lessons);
        }
      } catch (staticErr) {
        console.error("Static lessons fallback also failed:", staticErr);
        setMessage({ type: "error", text: "⚠️ Could not load lessons from API or static file." });
      }
    }
  };

  const fetchTickerList = async () => {
    try {
      const data = await getTicker();
      if (data && typeof data === "object") {
        const list = Array.isArray(data.tickers) ? data.tickers : [];
        setTickerList(list);
        setTickerSpeed(data.speed || "normal");
        if (list.length > 0) {
          setTickerForm(list[0]);
          setTickerUpdatesText((list[0].updates || []).join('\n'));
          setIsEditingTicker(true);
        } else {
          setTickerForm({ id: "default", startDate: "", endDate: "", updates: [] });
          setTickerUpdatesText("");
          setIsEditingTicker(false);
        }
      } else {
        throw new Error("No ticker data from API");
      }
    } catch (err) {
      console.warn("API ticker fetch failed, falling back to static", err);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}static/ticker.json?_t=${Date.now()}`);
        if (!res.ok) throw new Error("Static ticker not found");
        const data = await res.json();
        if (data && typeof data === "object") {
          const list = Array.isArray(data.tickers) ? data.tickers : [];
          setTickerList(list);
          setTickerSpeed(data.speed || "normal");
          if (list.length > 0) {
            setTickerForm(list[0]);
            setTickerUpdatesText((list[0].updates || []).join('\n'));
            setIsEditingTicker(true);
          }
        }
      } catch (staticErr) {
        console.error("Static ticker fallback failed", staticErr);
        setMessage({ type: "error", text: "⚠️ Could not load ticker data." });
      }
    }
  };

  const fetchLibraryList = async () => {
    try {
      const data = await getLibrary();
      if (data && Array.isArray(data)) {
        setLibrary(data);
      } else {
        throw new Error("No library books from API");
      }
    } catch (err) {
      console.warn("API library fetch failed, falling back to static file:", err);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}static/library.json`);
        if (!res.ok) throw new Error("Static library file not found");
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.library || []);
        setLibrary(list);
      } catch (staticErr) {
        console.error("Static library fallback also failed:", staticErr);
        setMessage({ type: "error", text: "⚠️ Could not load library books from API or static file." });
      }
    }
  };

  const fetchAdminData = async (pwd) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": API_TOKEN,
          "x-admin-password": pwd,
        },
        body: JSON.stringify({ endpoint: "admin_get_all" }),
      });

      if (res.status === 403) {
        setIsLoggedIn(false);
        sessionStorage.removeItem("admin_pwd");
        setMessage({ type: "error", text: "❌ Invalid Password!" });
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.status === "success") {
        setAdminData({
          subscribers: data.subscribers || [],
        });
        setIsLoggedIn(true);
        sessionStorage.setItem("admin_pwd", pwd);
        setMessage(null);
        await fetchLessonsList();
        await fetchLibraryList();
        await fetchTickerList();
      } else {
        setMessage({ type: "error", text: "❌ Error loading data." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Network Error." });
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchAdminData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pwd");
    setIsLoggedIn(false);
    setPassword("");
    setAdminData({ subscribers: [] });
    setLessons([]);
    setLibrary([]);
    setTickerList([]);
    setTickerForm({ id: "", startDate: "", endDate: "", updates: [] });
    setTickerUpdatesText("");
    setIsEditingTicker(false);
    setLoadingTicker(false);
  };



  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.body) {
      setMessage({ type: "error", text: "Title and Body are required!" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": API_TOKEN,
          "x-admin-password": password,
        },
        body: JSON.stringify({
          endpoint: "send_alert",
          ...alertForm,
        }),
      });
      const data = await res.json();
      if (data.status === "success" || data.status === "queued") {
        setMessage({
          type: "success",
          text: `✅ ${data.message || "Alert queued successfully!"}`,
        });
        setAlertForm({
          title: "",
          body: "",
          url: import.meta.env.BASE_URL,
          is_important: false,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send alert.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to send alert." });
    }
    setLoading(false);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.playlist || !lessonForm.title || !lessonForm.videoId) {
      setMessage({ type: "error", text: "Playlist, Title, and Video ID are required!" });
      return;
    }

    const videoIdClean = lessonForm.videoId.trim();
    const playlistClean = lessonForm.playlist.trim();
    const lessonId = `${playlistClean}_${videoIdClean}`;
    const thumbnail = `https://img.youtube.com/vi/${videoIdClean}/mqdefault.jpg`;

    const newLesson = {
      id: lessonId,
      playlist: playlistClean,
      title: lessonForm.title.trim(),
      videoId: videoIdClean,
      pdfLink: lessonForm.pdfLink.trim(),
      thumbnail,
      status: lessonForm.status,
    };

    let updatedLessons = [];
    if (editingLessonId) {
      updatedLessons = lessons.map((l) => (l.id === editingLessonId ? newLesson : l));
    } else {
      if (lessons.some((l) => l.id === lessonId)) {
        setMessage({ type: "error", text: "A lesson with this Playlist and Video ID already exists!" });
        return;
      }
      updatedLessons = [...lessons, newLesson];
    }

    setLoading(true);
    try {
      const res = await saveLessons(updatedLessons, password);
      if (res && res.status === "success") {
        setLessons(updatedLessons);
        setEditingLessonId(null);
        setIsCreatingNewPlaylist(false);
        setLessonForm({
          playlist: "",
          title: "",
          videoId: "",
          pdfLink: "",
          status: "ON",
        });
        setMessage({ type: "success", text: "✅ Lesson saved successfully!" });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to save lesson." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to save lesson." });
    }
    setLoading(false);
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setIsCreatingNewPlaylist(false);
    setLessonForm({
      playlist: lesson.playlist || "",
      title: lesson.title || "",
      videoId: lesson.videoId || "",
      pdfLink: lesson.pdfLink || "",
      status: lesson.status || "ON",
    });
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    const updatedLessons = lessons.filter((l) => l.id !== lessonId);
    setLoading(true);
    try {
      const res = await saveLessons(updatedLessons, password);
      if (res && res.status === "success") {
        setLessons(updatedLessons);
        setMessage({ type: "success", text: "✅ Lesson deleted successfully!" });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to delete lesson." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to delete lesson." });
    }
    setLoading(false);
  };

  const handleMoveLesson = async (lessonId, direction) => {
    const currentFiltered = filterPlaylist ? lessons.filter((l) => l.playlist === filterPlaylist) : lessons;
    const displayList = [...currentFiltered].reverse();
    const dIndex = displayList.findIndex((l) => l.id === lessonId);
    if (dIndex === -1) return;

    let targetId = null;
    if (direction === "up" && dIndex > 0) {
      targetId = displayList[dIndex - 1].id;
    } else if (direction === "down" && dIndex < displayList.length - 1) {
      targetId = displayList[dIndex + 1].id;
    } else {
      return;
    }

    const idx1 = lessons.findIndex((l) => l.id === lessonId);
    const idx2 = lessons.findIndex((l) => l.id === targetId);
    if (idx1 === -1 || idx2 === -1) return;

    const newLessons = [...lessons];
    [newLessons[idx1], newLessons[idx2]] = [newLessons[idx2], newLessons[idx1]];

    setLoading(true);
    try {
      const res = await saveLessons(newLessons, password);
      if (res && res.status === "success") {
        setLessons(newLessons);
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to update lesson order." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to update lesson order." });
    }
    setLoading(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ lessons }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lessons_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportLessonsCSV = () => {
    const headers = ["playlist", "title", "videoId", "pdfLink", "status"];
    const rows = lessons.map(l => [
      l.playlist || "",
      l.title || "",
      l.videoId || "",
      l.pdfLink || "",
      l.status || "ON"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `lessons_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleCSVImport = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, '').trim());
    const parsedLessons = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cells = [];
      let currentCell = "";
      let insideQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          cells.push(currentCell.trim());
          currentCell = "";
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());

      const row = cells.map(val => val.replace(/^["']|["']$/g, '').replace(/""/g, '"'));

      const playlist = row[headers.indexOf("playlist")] || "";
      const title = row[headers.indexOf("title")] || "";
      const videoId = (row[headers.indexOf("videoId")] || "").replace(/^'/, "");
      const pdfLink = row[headers.indexOf("pdfLink")] || "";
      const status = row[headers.indexOf("status")] || "ON";

      if (!playlist || !videoId || !title) continue;

      const id = `${playlist}_${videoId}`;
      const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      parsedLessons.push({
        id,
        playlist,
        title,
        videoId,
        pdfLink,
        thumbnail,
        status
      });
    }
    return parsedLessons;
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        let imported = [];

        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          imported = parsed.lessons || parsed;
          if (!Array.isArray(imported)) {
            throw new Error("Invalid JSON format. Expected an array of lessons.");
          }
        } else if (file.name.endsWith(".csv")) {
          imported = handleCSVImport(text);
          if (imported.length === 0) {
            throw new Error("No valid rows found in CSV.");
          }
        } else {
          throw new Error("Unsupported file format. Please upload .json or .csv.");
        }

        if (!window.confirm(`Are you sure you want to import ${imported.length} lessons? This will replace current lessons.`)) return;

        setLoading(true);
        const res = await saveLessons(imported, password);
        if (res && res.status === "success") {
          setLessons(imported);
          setMessage({ type: "success", text: `✅ Successfully imported ${imported.length} lessons!` });
        } else {
          setMessage({ type: "error", text: res?.error || "Failed to save imported lessons." });
        }
      } catch (err) {
        setMessage({ type: "error", text: `❌ Import failed: ${err.message}` });
      }
      setLoading(false);
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleImportSubscribersFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const imported = JSON.parse(text);
        const list = Array.isArray(imported) ? imported : (imported.subscribers || []);
        if (!Array.isArray(list)) {
          throw new Error("Invalid JSON format. Expected an array of subscribers.");
        }

        if (!window.confirm(`Are you sure you want to import ${list.length} subscribers? This will replace current subscribers.`)) return;

        setLoading(true);
        const res = await saveSubscribers(list, password);
        if (res && res.status === "success") {
          setAdminData(prev => ({ ...prev, subscribers: list }));
          setMessage({ type: "success", text: `✅ Successfully imported ${list.length} subscribers!` });
        } else {
          setMessage({ type: "error", text: res?.error || "Failed to save imported subscribers." });
        }
      } catch (err) {
        setMessage({ type: "error", text: `❌ Import failed: ${err.message}` });
      }
      setLoading(false);
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleDeleteSubscribers = () => {
    setDeletePrompt({
      isOpen: true,
      type: "subscribers",
      passwordInput: "",
    });
  };



  const handleConfirmDelete = async () => {
    if (deletePrompt.passwordInput !== password) {
      alert("❌ Incorrect Admin Password!");
      return;
    }

    const type = deletePrompt.type;
    setDeletePrompt({ isOpen: false, type: "", passwordInput: "" });

    setLoading(true);
    try {
      if (type === "subscribers") {
        const res = await saveSubscribers([], password);
        if (res && res.status === "success") {
          setAdminData(prev => ({ ...prev, subscribers: [] }));
          setMessage({ type: "success", text: "✅ Successfully deleted all subscribers!" });
        } else {
          setMessage({ type: "error", text: res?.error || "Failed to delete subscribers." });
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ Failed to delete ${type}.` });
    }
    setLoading(false);
  };

  // ─── e-Library Handlers ────────────────────────────────────────────────────

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author || !bookForm.language || !bookForm.subject) {
      setMessage({ type: "error", text: "Title, Author, Language, and Subject are required!" });
      return;
    }

    let updatedLibrary;
    if (editingBookId !== null) {
      updatedLibrary = library.map((b) =>
        b.id === editingBookId ? { ...bookForm, id: editingBookId } : b
      );
    } else {
      const maxId = library.length > 0 ? Math.max(...library.map((b) => b.id || 0)) : 0;
      const newBook = { ...bookForm, id: maxId + 1 };
      updatedLibrary = [...library, newBook];
    }

    setLoading(true);
    try {
      const res = await saveLibrary(updatedLibrary, password);
      if (res && res.status === "success") {
        setLibrary(updatedLibrary);
        setEditingBookId(null);
        setBookForm({
          title: "", author: "", language: "", subject: "",
          subcategory: "", description: "", sourceType: "archive",
          thumbnail: "", readLink: "", pdfLink: "",
          createdDate: new Date().toISOString().split("T")[0],
          isVisibility: true,
        });
        setMessage({ type: "success", text: editingBookId !== null ? "✅ Book updated successfully!" : "✅ Book added successfully!" });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to save book." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to save book." });
    }
    setLoading(false);
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      language: book.language || "",
      subject: book.subject || "",
      subcategory: book.subcategory || "",
      description: book.description || "",
      sourceType: book.sourceType || "archive",
      thumbnail: book.thumbnail || "",
      readLink: book.readLink || "",
      pdfLink: book.pdfLink || "",
      createdDate: book.createdDate || new Date().toISOString().split("T")[0],
      isVisibility: book.isVisibility !== false,
    });
    // Scroll to form
    setTimeout(() => document.getElementById("library-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    const updatedLibrary = library.filter((b) => b.id !== bookId);
    setLoading(true);
    try {
      const res = await saveLibrary(updatedLibrary, password);
      if (res && res.status === "success") {
        setLibrary(updatedLibrary);
        setMessage({ type: "success", text: "✅ Book deleted successfully!" });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to delete book." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to delete book." });
    }
    setLoading(false);
  };

  const handleToggleBookVisibility = async (bookId) => {
    const updatedLibrary = library.map((b) =>
      b.id === bookId ? { ...b, isVisibility: !b.isVisibility } : b
    );
    setLoading(true);
    try {
      const res = await saveLibrary(updatedLibrary, password);
      if (res && res.status === "success") {
        setLibrary(updatedLibrary);
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to update visibility." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to update visibility." });
    }
    setLoading(false);
  };

  const handleMoveBook = async (bookId, direction) => {
    const idx = library.findIndex((b) => b.id === bookId);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= library.length) return;
    const newLibrary = [...library];
    [newLibrary[idx], newLibrary[newIdx]] = [newLibrary[newIdx], newLibrary[idx]];
    setLoading(true);
    try {
      const res = await saveLibrary(newLibrary, password);
      if (res && res.status === "success") {
        setLibrary(newLibrary);
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to reorder books." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to reorder books." });
    }
    setLoading(false);
  };

  const handleSortBooks = async (field, order) => {
    const sorted = [...library].sort((a, b) => {
      const aVal = (a[field] || "").toString().toLowerCase();
      const bVal = (b[field] || "").toString().toLowerCase();
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
    setLoading(true);
    try {
      const res = await saveLibrary(sorted, password);
      if (res && res.status === "success") {
        setLibrary(sorted);
        setMessage({ type: "success", text: `✅ Books sorted by ${field} (${order})!` });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to sort books." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to sort books." });
    }
    setLoading(false);
  };

  const handleExportLibraryJSON = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `library_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleExportLibraryCSV = () => {
    const headers = ["id","title","author","language","subject","subcategory","description","sourceType","thumbnail","readLink","pdfLink","createdDate","isVisibility"];
    const rows = library.map(b => headers.map(h => `"${String(b[h] ?? "").replace(/"/g, '""')}"`));
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `library_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleImportLibraryFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        let imported = [];
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          imported = Array.isArray(parsed) ? parsed : (parsed.library || []);
          if (!Array.isArray(imported)) throw new Error("Invalid JSON format.");
        } else if (file.name.endsWith(".csv")) {
          const lines = text.split(/\r?\n/);
          if (lines.length < 2) throw new Error("Empty CSV file.");
          const hdrs = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cells = []; let cur = ""; let inQ = false;
            for (const ch of line) {
              if (ch === '"') inQ = !inQ;
              else if (ch === ',' && !inQ) { cells.push(cur); cur = ""; }
              else cur += ch;
            }
            cells.push(cur);
            const row = {};
            hdrs.forEach((h, idx) => {
              let val = (cells[idx] || "").replace(/^"|"$/g, "").replace(/""/g, '"');
              if (h === "id") val = parseInt(val, 10) || (i);
              if (h === "isVisibility") val = val !== "false";
              row[h] = val;
            });
            if (row.title) imported.push(row);
          }
          if (imported.length === 0) throw new Error("No valid rows found in CSV.");
        } else {
          throw new Error("Unsupported format. Use .json or .csv");
        }
        if (!window.confirm(`Import ${imported.length} books? This will replace current library.`)) return;
        setLoading(true);
        const res = await saveLibrary(imported, password);
        if (res && res.status === "success") {
          setLibrary(imported);
          setMessage({ type: "success", text: `✅ Successfully imported ${imported.length} books!` });
        } else {
          setMessage({ type: "error", text: res?.error || "Failed to import library." });
        }
      } catch (err) {
        setMessage({ type: "error", text: `❌ Import failed: ${err.message}` });
      }
      setLoading(false);
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  // ─── General Utilities ─────────────────────────────────────────────────────

  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const uniquePlaylists = Array.from(new Set(lessons.map((l) => l.playlist))).filter(Boolean);
  const filteredLessons = filterPlaylist ? lessons.filter((l) => l.playlist === filterPlaylist) : lessons;

  if (!isLoggedIn) {
    return (
      <div
        className="page"
        style={{
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f7f6",
        }}
      >
        <form
          className="form-panel"
          onSubmit={handleLogin}
          style={{
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            padding: "40px 30px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              color: "#2c3e50",
              marginTop: 0,
              marginBottom: "25px",
              fontSize: "1.8rem",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                display: "block",
                marginBottom: "10px",
              }}
            >
              🔒
            </span>
            Admin Access
          </h2>
          {message && (
            <div
              style={{
                background: message.type === "error" ? "#fadbd8" : "#eafaf1",
                color: message.type === "error" ? "#c0392b" : "#27ae60",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {message.text}
            </div>
          )}
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #dce1e6",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#8e44ad")}
            onBlur={(e) => (e.target.style.borderColor = "#dce1e6")}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#8e44ad",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#732d91")}
            onMouseOut={(e) => (e.target.style.background = "#8e44ad")}
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        padding: "30px 20px 120px 20px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 30px)",
        background: "#f4f7f6",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .admin-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border: 1px solid #e9ecef;
          margin-bottom: 25px;
          overflow: hidden;
        }
        .admin-card summary {
          background: #fdfefe;
          padding: 18px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          cursor: pointer;
          outline: none;
          border-bottom: 1px solid #e9ecef;
          transition: background 0.2s;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-card summary::-webkit-details-marker {
          display: none;
        }
        .admin-card summary:hover {
          background: #f8f9fa;
        }
        .admin-card-body {
          padding: 24px;
        }
        .admin-table-wrapper {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #e9ecef;
          border-radius: 8px;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .admin-table th {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          padding: 14px 16px;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
          color: #495057;
          font-weight: 700;
          box-shadow: 0 2px 2px -1px rgba(0,0,0,0.05);
          z-index: 10;
        }
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e9ecef;
          color: #495057;
        }
        .admin-table tr:hover {
          background: #fbfbfc;
        }
        .admin-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .admin-input:focus {
          border-color: #8e44ad;
          box-shadow: 0 0 0 3px rgba(142,68,173,0.1);
          outline: none;
        }
        .admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #8e44ad;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-btn:hover {
          background: #732d91;
          transform: translateY(-1px);
        }
        .admin-btn-danger {
          background: #e74c3c;
        }
        .admin-btn-danger:hover {
          background: #c0392b;
        }
        .admin-btn-success {
          background: #27ae60;
        }
        .admin-btn-success:hover {
          background: #219653;
        }
        .admin-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #34495e;
          font-size: 14px;
        }
      `}</style>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ margin: 0, color: "#2c3e50", fontSize: "2rem" }}>
            <span style={{ marginRight: "10px" }}>⚙️</span>
            Admin Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="admin-btn admin-btn-danger"
            style={{ padding: "10px 20px" }}
          >
            Logout
          </button>
        </div>

        {message && (
          <div
            style={{
              background: message.type === "error" ? "#fadbd8" : "#eafaf1",
              color: message.type === "error" ? "#c0392b" : "#27ae60",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
              border: `1px solid ${message.type === "error" ? "#f1b8b3" : "#b9e7c9"}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Push Notifications Section */}
        <details className="admin-card" open>
          <summary>
            <span>🔔 Push Notifications (Alerts)</span>
          </summary>
          <div className="admin-card-body">
            <form onSubmit={handleSendAlert}>
              <div style={{ marginBottom: "20px" }}>
                <label className="admin-label">Notification Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={alertForm.title}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, title: e.target.value })
                  }
                  placeholder="Ex: New App Update Available!"
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label className="admin-label">Message Body</label>
                <textarea
                  className="admin-input"
                  rows="3"
                  value={alertForm.body}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, body: e.target.value })
                  }
                  placeholder="Ex: Check out the newly added Muhurtha features in the app..."
                  required
                ></textarea>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label className="admin-label">Target URL (Optional)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={alertForm.url}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, url: e.target.value })
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#fff9f2",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #fdebd0",
                  marginBottom: "25px",
                }}
              >
                <input
                  type="checkbox"
                  id="is_important"
                  checked={alertForm.is_important}
                  onChange={(e) =>
                    setAlertForm({
                      ...alertForm,
                      is_important: e.target.checked,
                    })
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                    accentColor: "#d35400",
                    margin: 0,
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="is_important"
                  style={{
                    margin: 0,
                    cursor: "pointer",
                    color: "#d35400",
                    fontWeight: "600",
                    fontSize: "14.5px",
                  }}
                >
                  📌 Mark as Important (Save to Inbox)
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn"
                style={{ width: "100%" }}
              >
                {loading ? "Sending..." : "🚀 Send Alert Now"}
              </button>
            </form>
          </div>
        </details>

        {/* ---------- Ticker Management ---------- */}
        <details className="admin-card">
          <summary>
            <span>🛎️ Ticker Management (Multiple Announcements)</span>
            <span
              style={{
                background: "#e9ecef",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              Total: {tickerList.length}
            </span>
          </summary>
          <div className="admin-card-body">
            
            {/* Global Speed Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "12px", background: "#fcf3cf", borderRadius: "6px", border: "1px solid #f9e79f" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#7d6608" }}>⚡ Ticker Scrolling Speed:</span>
              <select
                value={tickerSpeed}
                onChange={async (e) => {
                  const newSpeed = e.target.value;
                  setTickerSpeed(newSpeed);
                  setLoadingTicker(true);
                  const payload = { speed: newSpeed, tickers: tickerList };
                  const res = await saveTicker(payload, password);
                  if (res && res.status === "success") {
                    localStorage.setItem("vaiswanara_ticker_cache", JSON.stringify(payload));
                    setMessage({ type: "success", text: "⚡ Speed setting saved successfully" });
                    window.dispatchEvent(new CustomEvent("vaiswanara_ticker_updated"));
                  } else {
                    setMessage({ type: "error", text: `❌ Failed to save speed: ${res?.error || "unknown"}` });
                  }
                  setLoadingTicker(false);
                }}
                style={{ padding: "6px 10px", fontSize: "13.5px", borderRadius: "4px", border: "1px solid #d4ac0d", cursor: "pointer", background: "#fff" }}
                disabled={loadingTicker}
              >
                <option value="fast">🚀 Fast (High Speed)</option>
                <option value="normal">🔄 Normal (Default)</option>
                <option value="slow">🐢 Slow (Easy Reading)</option>
              </select>
            </div>

            {/* Tickers List */}
            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ color: "#34495e", fontSize: "16px", marginBottom: "10px" }}>Current Active & Scheduled Tickers</h3>
              {tickerList.length === 0 ? (
                <p style={{ color: "#7f8c8d", fontSize: "14px", fontStyle: "italic" }}>No ticker announcements defined yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                    <thead>
                      <tr style={{ background: "#f2f4f4", textAlign: "left" }}>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Ticker ID</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Start Date</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>End Date</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Updates</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: "130px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickerList.map((t, idx) => (
                        <tr key={idx} style={{ background: tickerForm.id === t.id ? "#ebf5fb" : "transparent" }}>
                          <td style={{ padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>{t.id}</td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>{t.startDate}</td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>{t.endDate}</td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            <ul style={{ margin: 0, paddingLeft: "16px" }}>
                              {(t.updates || []).map((u, uIdx) => (
                                <li key={uIdx}>{u}</li>
                              ))}
                            </ul>
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            <button
                              onClick={() => {
                                setTickerForm(t);
                                setTickerUpdatesText((t.updates || []).join('\n'));
                                setIsEditingTicker(true);
                                setMessage(null);
                              }}
                              style={{ padding: "3px 8px", marginRight: "5px", background: "#3498db", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Are you sure you want to delete ticker "${t.id}"?`)) return;
                                setLoadingTicker(true);
                                const updatedList = tickerList.filter(item => item.id !== t.id);
                                const payload = { speed: tickerSpeed, tickers: updatedList };
                                const res = await saveTicker(payload, password);
                                if (res && res.status === "success") {
                                  setTickerList(updatedList);
                                  localStorage.setItem("vaiswanara_ticker_cache", JSON.stringify(payload));
                                  setMessage({ type: "success", text: "✅ Ticker deleted successfully" });
                                  window.dispatchEvent(new CustomEvent("vaiswanara_ticker_updated"));
                                  if (tickerForm.id === t.id) {
                                    setTickerForm({ id: "", startDate: "", endDate: "", updates: [] });
                                    setTickerUpdatesText("");
                                    setIsEditingTicker(false);
                                  }
                                } else {
                                  setMessage({ type: "error", text: `❌ Failed to delete ticker: ${res?.error || "unknown"}` });
                                }
                                setLoadingTicker(false);
                              }}
                              style={{ padding: "3px 8px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Form */}
            <div style={{ background: "#f8f9f9", padding: "15px", borderRadius: "6px", border: "1px solid #eaeded" }}>
              <h3 style={{ color: "#2c3e50", fontSize: "15px", marginTop: 0, marginBottom: "15px" }}>
                {isEditingTicker ? `✏️ Edit Ticker Announcement (${tickerForm.id})` : "➕ Add New Ticker Announcement"}
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "bold", marginBottom: "4px" }}>Ticker ID:</label>
                  <input
                    type="text"
                    value={tickerForm.id || ""}
                    onChange={e => setTickerForm(prev => ({ ...prev, id: e.target.value.trim().replace(/\s+/g, '_') }))}
                    readOnly={isEditingTicker}
                    placeholder="e.g. library_launch"
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "bold", marginBottom: "4px" }}>Start Date (IST):</label>
                  <input
                    type="date"
                    value={tickerForm.startDate?.substring(0,10) || ""}
                    onChange={e => setTickerForm(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "bold", marginBottom: "4px" }}>End Date (IST):</label>
                  <input
                    type="date"
                    value={tickerForm.endDate?.substring(0,10) || ""}
                    onChange={e => setTickerForm(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "bold", marginBottom: "4px" }}>Announcements (One per line):</label>
                <textarea
                  rows={4}
                  value={tickerUpdatesText}
                  onChange={e => setTickerUpdatesText(e.target.value)}
                  placeholder="📚 New! e-Library added — access free PDF books
  🎓 e-PATA: New lessons added"
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical", fontFamily: "inherit", fontSize: "13.5px" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={async () => {
                    if (!tickerForm.id) {
                      setMessage({ type: "error", text: "❌ Ticker ID is required!" });
                      return;
                    }
                    if (!tickerForm.startDate || !tickerForm.endDate) {
                      setMessage({ type: "error", text: "❌ Start Date and End Date are required!" });
                      return;
                    }
                    const updatesArr = tickerUpdatesText.split('\n').map(s=>s.trim()).filter(Boolean);
                    if (updatesArr.length === 0) {
                      setMessage({ type: "error", text: "❌ Please enter at least one announcement line!" });
                      return;
                    }
                    
                    setLoadingTicker(true);
                    const newTickerItem = {
                      id: tickerForm.id,
                      startDate: tickerForm.startDate,
                      endDate: tickerForm.endDate,
                      updates: updatesArr
                    };

                    let updatedList = [];
                    if (isEditingTicker) {
                      updatedList = tickerList.map(item => item.id === tickerForm.id ? newTickerItem : item);
                    } else {
                      if (tickerList.some(item => item.id === tickerForm.id)) {
                        setMessage({ type: "error", text: `❌ A ticker with ID "${tickerForm.id}" already exists!` });
                        setLoadingTicker(false);
                        return;
                      }
                      updatedList = [...tickerList, newTickerItem];
                    }

                    const payload = { speed: tickerSpeed, tickers: updatedList };
                    const res = await saveTicker(payload, password);
                    if (res && res.status === "success") {
                      setTickerList(updatedList);
                      localStorage.setItem("vaiswanara_ticker_cache", JSON.stringify(payload));
                      setMessage({ type: "success", text: `✅ Ticker "${tickerForm.id}" saved successfully!` });
                      window.dispatchEvent(new CustomEvent("vaiswanara_ticker_updated"));
                      setIsEditingTicker(true);
                    } else {
                      setMessage({ type: "error", text: `❌ Failed to save ticker: ${res?.error || "unknown"}` });
                    }
                    setLoadingTicker(false);
                  }}
                  disabled={loadingTicker}
                  style={{ padding: "8px 16px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {loadingTicker ? "Saving..." : isEditingTicker ? "Save Updates" : "Add Announcement"}
                </button>
                
                <button
                  onClick={() => {
                    setTickerForm({ id: "", startDate: "", endDate: "", updates: [] });
                    setTickerUpdatesText("");
                    setIsEditingTicker(false);
                    setMessage(null);
                  }}
                  style={{ padding: "8px 16px", background: "#7f8c8d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Clear / New Ticker
                </button>
              </div>
            </div>
          </div>
        </details>

        {/* e-PATA Lessons Management Section */}
        <details className="admin-card">
          <summary>
            <span>📖 e-PATA Management (Lessons)</span>
            <span
              style={{
                background: "#e9ecef",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              Total: {lessons.length}
            </span>
          </summary>
          <div className="admin-card-body">
            {/* Add / Edit Lesson Form */}
            <form onSubmit={handleSaveLesson} style={{ marginBottom: "30px", background: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#2c3e50" }}>
                {editingLessonId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label className="admin-label">Playlist Name</label>
                  <select
                    className="admin-input"
                    value={isCreatingNewPlaylist ? "__NEW__" : lessonForm.playlist}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__NEW__") {
                        setIsCreatingNewPlaylist(true);
                        setLessonForm({ ...lessonForm, playlist: "" });
                      } else {
                        setIsCreatingNewPlaylist(false);
                        setLessonForm({ ...lessonForm, playlist: val });
                      }
                    }}
                    required={!isCreatingNewPlaylist}
                  >
                    <option value="">-- Select Playlist --</option>
                    {uniquePlaylists.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="__NEW__">➕ Create New Playlist...</option>
                  </select>
                  {isCreatingNewPlaylist && (
                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginTop: "8px" }}
                      value={lessonForm.playlist}
                      onChange={(e) => setLessonForm({ ...lessonForm, playlist: e.target.value })}
                      placeholder="Enter New Playlist Name"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="admin-label">Video ID (YouTube)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={lessonForm.videoId}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoId: e.target.value })}
                    placeholder="Ex: QSoXOqu8Z8E"
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label className="admin-label">Lesson Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Ex: KA01: Course Introduction & Syllabus"
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                  <label className="admin-label">PDF Notes Link (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={lessonForm.pdfLink}
                    onChange={(e) => setLessonForm({ ...lessonForm, pdfLink: e.target.value })}
                    placeholder="Ex: https://drive.google.com/file/d/..."
                  />
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-input"
                    value={lessonForm.status}
                    onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value })}
                  >
                    <option value="ON">ON (Visible)</option>
                    <option value="OFF">OFF (Hidden)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                  {editingLessonId ? "Update Lesson" : "Add Lesson"}
                </button>
                {editingLessonId && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm({ playlist: "", title: "", videoId: "", pdfLink: "", status: "ON" });
                      setIsCreatingNewPlaylist(false);
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Import / Export Tools */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px", background: "#eafaf1", padding: "15px", borderRadius: "8px", border: "1px solid #b9e7c9" }}>
              <button onClick={handleExportJSON} className="admin-btn admin-btn-success" style={{ fontSize: "13px", padding: "8px 16px" }}>
                📤 Export JSON
              </button>
              <button onClick={exportLessonsCSV} className="admin-btn admin-btn-success" style={{ fontSize: "13px", padding: "8px 16px" }}>
                📤 Export CSV
              </button>
              <button onClick={() => document.getElementById("lessons-import-file").click()} className="admin-btn" style={{ fontSize: "13px", padding: "8px 16px", background: "#f39c12" }}>
                📥 Import JSON / CSV
              </button>
              <input
                id="lessons-import-file"
                type="file"
                accept=".json,.csv"
                onChange={handleImportFile}
                style={{ display: "none" }}
              />
            </div>

            {/* Lessons List Table */}
            {lessons.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "1.1rem" }}>📋 Lessons List</h3>
                <select
                  className="admin-input"
                  style={{ width: "auto", minWidth: "200px", padding: "8px 12px" }}
                  value={filterPlaylist}
                  onChange={(e) => setFilterPlaylist(e.target.value)}
                >
                  <option value="">-- All Playlists --</option>
                  {uniquePlaylists.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {filteredLessons.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "200px" }}>Playlist</th>
                      <th>Title</th>
                      <th style={{ width: "120px" }}>Video ID</th>
                      <th style={{ width: "80px" }}>Status</th>
                      <th style={{ width: "280px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredLessons].reverse().map((lesson, idx, arr) => (
                      <tr key={lesson.id} style={{ opacity: lesson.status === "OFF" ? 0.6 : 1 }}>
                        <td style={{ fontWeight: "600", fontSize: "13px" }}>{lesson.playlist}</td>
                        <td>
                          <div style={{ fontWeight: "bold", color: "#2c3e50" }}>{lesson.title}</div>
                          {lesson.pdfLink && (
                            <a href={lesson.pdfLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#d35400", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
                              📄 Notes Link
                            </a>
                          )}
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: "13px" }}>{lesson.videoId}</td>
                        <td>
                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#fff",
                            background: lesson.status === "ON" ? "#27ae60" : "#7f8c8d"
                          }}>
                            {lesson.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(lesson.id, "up")}
                              disabled={idx === 0 || loading}
                              className="admin-btn"
                              title="Move Up"
                              style={{ padding: "5px 8px", fontSize: "12px", background: (idx === 0 || loading) ? "#bdc3c7" : "#f39c12", cursor: (idx === 0 || loading) ? "not-allowed" : "pointer" }}
                            >
                              ⬆️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(lesson.id, "down")}
                              disabled={idx === arr.length - 1 || loading}
                              className="admin-btn"
                              title="Move Down"
                              style={{ padding: "5px 8px", fontSize: "12px", background: (idx === arr.length - 1 || loading) ? "#bdc3c7" : "#f39c12", cursor: (idx === arr.length - 1 || loading) ? "not-allowed" : "pointer" }}
                            >
                              ⬇️
                            </button>
                            <button
                              onClick={() => handleEditLesson(lesson)}
                              className="admin-btn"
                              style={{ padding: "5px 10px", fontSize: "12px", background: "#3498db" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="admin-btn admin-btn-danger"
                              style={{ padding: "5px 10px", fontSize: "12px" }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#7f8c8d" }}>{lessons.length > 0 ? "No lessons match this playlist." : "No lessons found yet."}</p>
            )}
          </div>
        </details>

        {/* e-Library Management Section */}
        <details className="admin-card">
          <summary>
            <span>📚 e-Library Management (Books)</span>
            <span style={{ background: "#e9ecef", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
              Total: {library.length}
            </span>
          </summary>
          <div className="admin-card-body">

            {/* Add / Edit Book Form */}
            <form id="library-form-section" onSubmit={handleSaveBook} style={{ marginBottom: "30px", background: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
              <h3 style={{ marginTop: 0, marginBottom: "18px", color: "#2c3e50" }}>
                {editingBookId !== null ? "✏️ Edit Book" : "➕ Add New Book"}
              </h3>

              {/* Row 1: Title */}
              <div style={{ marginBottom: "14px" }}>
                <label className="admin-label">Title *</label>
                <input type="text" className="admin-input" value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="Ex: ನಿರ್ಣಯ ಸಿಂಧು (Nirnaya Sindhu)" required />
              </div>

              {/* Row 2: Author + Language */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="admin-label">Author *</label>
                  <input type="text" className="admin-input" value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="Ex: Sesha Navaratna" required />
                </div>
                <div>
                  <label className="admin-label">Language *</label>
                  <select className="admin-input" value={bookForm.language}
                    onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })} required>
                    <option value="">-- Select Language --</option>
                    <option>Kannada</option>
                    <option>Telugu</option>
                    <option>Sanskrit</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Malayalam</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Subject + Subcategory */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="admin-label">Subject *</label>
                  <input type="text" className="admin-input" value={bookForm.subject}
                    onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                    placeholder="Ex: Dharma, Astrology, Vedas..." required />
                </div>
                <div>
                  <label className="admin-label">Subcategory</label>
                  <input type="text" className="admin-input" value={bookForm.subcategory}
                    onChange={(e) => setBookForm({ ...bookForm, subcategory: e.target.value })}
                    placeholder="Ex: Scriptures, Basics, Jatakam..." />
                </div>
              </div>

              {/* Row 4: Description */}
              <div style={{ marginBottom: "14px" }}>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" rows="3" value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="Short description of the book..." />
              </div>

              {/* Row 5: Source Type + Created Date + Visibility */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="admin-label">Source Type</label>
                  <select className="admin-input" value={bookForm.sourceType}
                    onChange={(e) => setBookForm({ ...bookForm, sourceType: e.target.value })}>
                    <option value="archive">Archive.org</option>
                    <option value="gdrive">Google Drive</option>
                    <option value="direct">Direct URL</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Created Date</label>
                  <input type="date" className="admin-input" value={bookForm.createdDate}
                    onChange={(e) => setBookForm({ ...bookForm, createdDate: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Visibility</label>
                  <select className="admin-input" value={bookForm.isVisibility ? "true" : "false"}
                    onChange={(e) => setBookForm({ ...bookForm, isVisibility: e.target.value === "true" })}>
                    <option value="true">✅ Visible (Public)</option>
                    <option value="false">🚫 Hidden</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Thumbnail */}
              <div style={{ marginBottom: "14px" }}>
                <label className="admin-label">Thumbnail URL</label>
                <input type="text" className="admin-input" value={bookForm.thumbnail}
                  onChange={(e) => setBookForm({ ...bookForm, thumbnail: e.target.value })}
                  placeholder="Ex: https://archive.org/services/img/nirnaya-sindhu" />
              </div>

              {/* Row 7: Read Link */}
              <div style={{ marginBottom: "14px" }}>
                <label className="admin-label">Read / View Link</label>
                <input type="text" className="admin-input" value={bookForm.readLink}
                  onChange={(e) => setBookForm({ ...bookForm, readLink: e.target.value })}
                  placeholder="Ex: https://archive.org/details/nirnaya-sindhu" />
              </div>

              {/* Row 8: PDF Link */}
              <div style={{ marginBottom: "20px" }}>
                <label className="admin-label">PDF Download Link</label>
                <input type="text" className="admin-input" value={bookForm.pdfLink}
                  onChange={(e) => setBookForm({ ...bookForm, pdfLink: e.target.value })}
                  placeholder="Ex: https://dn790002.ca.archive.org/...pdf" />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                  {editingBookId !== null ? "💾 Update Book" : "➕ Add Book"}
                </button>
                {editingBookId !== null && (
                  <button type="button" className="admin-btn admin-btn-danger"
                    onClick={() => {
                      setEditingBookId(null);
                      setBookForm({ title: "", author: "", language: "", subject: "",
                        subcategory: "", description: "", sourceType: "archive",
                        thumbnail: "", readLink: "", pdfLink: "",
                        createdDate: new Date().toISOString().split("T")[0], isVisibility: true });
                    }}
                    style={{ flex: 1 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Sort + Export/Import Toolbar */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "20px", background: "#eafaf1", padding: "14px", borderRadius: "8px", border: "1px solid #b9e7c9" }}>
              <span style={{ fontWeight: 700, color: "#27ae60", fontSize: "13px", marginRight: "4px" }}>🔃 Sort:</span>
              <button onClick={() => handleSortBooks("title", "asc")} className="admin-btn admin-btn-success" style={{ fontSize: "12px", padding: "6px 12px" }}>Title A→Z</button>
              <button onClick={() => handleSortBooks("title", "desc")} className="admin-btn admin-btn-success" style={{ fontSize: "12px", padding: "6px 12px" }}>Title Z→A</button>
              <button onClick={() => handleSortBooks("subject", "asc")} className="admin-btn admin-btn-success" style={{ fontSize: "12px", padding: "6px 12px" }}>Subject</button>
              <button onClick={() => handleSortBooks("language", "asc")} className="admin-btn admin-btn-success" style={{ fontSize: "12px", padding: "6px 12px" }}>Language</button>
              <button onClick={() => handleSortBooks("createdDate", "desc")} className="admin-btn admin-btn-success" style={{ fontSize: "12px", padding: "6px 12px" }}>Newest First</button>
              <span style={{ flex: 1 }} />
              <button onClick={handleExportLibraryJSON} className="admin-btn" style={{ fontSize: "12px", padding: "6px 12px", background: "#2980b9" }}>📤 Export JSON</button>
              <button onClick={handleExportLibraryCSV} className="admin-btn" style={{ fontSize: "12px", padding: "6px 12px", background: "#2980b9" }}>📤 Export CSV</button>
              <button onClick={() => document.getElementById("library-import-file").click()} className="admin-btn" style={{ fontSize: "12px", padding: "6px 12px", background: "#f39c12" }}>📥 Import</button>
              <input id="library-import-file" type="file" accept=".json,.csv" onChange={handleImportLibraryFile} style={{ display: "none" }} />
            </div>

            {/* Books Table */}
            {library.length > 0 ? (
              <div className="admin-table-wrapper" style={{ maxHeight: "500px" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "42px" }}>Move</th>
                      <th>Title & Author</th>
                      <th style={{ width: "90px" }}>Language</th>
                      <th style={{ width: "100px" }}>Subject</th>
                      <th style={{ width: "80px" }}>Visible</th>
                      <th style={{ width: "200px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {library.map((book, idx) => (
                      <tr key={book.id} style={{ opacity: book.isVisibility ? 1 : 0.55 }}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <button type="button" onClick={() => handleMoveBook(book.id, "up")}
                              disabled={idx === 0 || loading} className="admin-btn"
                              title="Move Up"
                              style={{ padding: "3px 6px", fontSize: "11px", background: idx === 0 ? "#bdc3c7" : "#f39c12", cursor: idx === 0 ? "not-allowed" : "pointer" }}>⬆️</button>
                            <button type="button" onClick={() => handleMoveBook(book.id, "down")}
                              disabled={idx === library.length - 1 || loading} className="admin-btn"
                              title="Move Down"
                              style={{ padding: "3px 6px", fontSize: "11px", background: idx === library.length - 1 ? "#bdc3c7" : "#f39c12", cursor: idx === library.length - 1 ? "not-allowed" : "pointer" }}>⬇️</button>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "14px", lineHeight: 1.3 }}>{book.title}</div>
                          <div style={{ color: "#7f8c8d", fontSize: "12px", marginTop: "3px" }}>{book.author}</div>
                          {book.pdfLink && (
                            <a href={book.pdfLink} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: "11px", color: "#d35400", textDecoration: "none", marginTop: "4px", display: "inline-block" }}>📄 PDF</a>
                          )}
                        </td>
                        <td><span style={{ fontSize: "12px", fontWeight: 600 }}>{book.language}</span></td>
                        <td>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "#8e44ad" }}>{book.subject}</div>
                          {book.subcategory && <div style={{ fontSize: "11px", color: "#7f8c8d" }}>{book.subcategory}</div>}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button type="button"
                            onClick={() => handleToggleBookVisibility(book.id)}
                            title={book.isVisibility ? "Click to Hide" : "Click to Show"}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              fontSize: "20px", lineHeight: 1,
                            }}>
                            {book.isVisibility ? "✅" : "🚫"}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => handleEditBook(book)} className="admin-btn"
                              style={{ padding: "5px 10px", fontSize: "12px", background: "#3498db" }}>Edit</button>
                            <button onClick={() => handleDeleteBook(book.id)} className="admin-btn admin-btn-danger"
                              style={{ padding: "5px 10px", fontSize: "12px" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#7f8c8d" }}>No books found yet. Add one above!</p>
            )}
          </div>
        </details>

        {/* Subscribers Section */}
        <details className="admin-card">
          <summary>
            <span>👥 Subscribers Management</span>
            <span
              style={{
                background: "#e9ecef",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              Total: {adminData.subscribers.length}
            </span>
          </summary>
          <div className="admin-card-body">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              <button
                onClick={() =>
                  exportJSON(
                    adminData.subscribers,
                    `subscribers_${new Date().toISOString().split("T")[0]}.json`,
                  )
                }
                className="admin-btn admin-btn-success"
                style={{ padding: "10px 20px" }}
              >
                📤 Export JSON
              </button>
              <button
                onClick={() => document.getElementById("subscribers-import-file").click()}
                className="admin-btn"
                style={{ padding: "10px 20px", background: "#f39c12" }}
              >
                📥 Import JSON
              </button>
              <input
                id="subscribers-import-file"
                type="file"
                accept=".json"
                onChange={handleImportSubscribersFile}
                style={{ display: "none" }}
              />
              {adminData.subscribers.length > 0 && (
                <button
                  onClick={handleDeleteSubscribers}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: "10px 20px" }}
                >
                  🗑️ Delete All
                </button>
              )}
            </div>

            {adminData.subscribers.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>#</th>
                      <th style={{ width: "200px" }}>Date</th>
                      <th>Endpoint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...adminData.subscribers].reverse().map((sub, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {sub.timestamp
                            ? new Date(sub.timestamp).toLocaleString()
                            : "Unknown"}
                        </td>
                        <td
                          style={{
                            color: "#7f8c8d",
                            wordBreak: "break-all",
                            fontSize: "13px",
                          }}
                        >
                          {sub.endpoint.substring(0, 50)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#7f8c8d" }}>No subscribers found yet.</p>
            )}
          </div>
        </details>


      </div>

      {/* Delete Confirmation Password Modal */}
      {deletePrompt.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px 24px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#e74c3c", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.3rem" }}>
              ⚠️ Confirm Deletion
            </h3>
            <p style={{ color: "#555", fontSize: "14.5px", lineHeight: "1.5", marginBottom: "20px" }}>
              Are you sure you want to delete all <strong>{deletePrompt.type}</strong>? This action cannot be undone. Please enter your Admin Password:
            </p>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={deletePrompt.passwordInput}
              onChange={(e) => setDeletePrompt({ ...deletePrompt, passwordInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirmDelete();
                }
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "15px",
                marginBottom: "25px",
                boxSizing: "border-box",
                outline: "none",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleConfirmDelete}
                className="admin-btn admin-btn-danger"
                style={{ flex: 1, padding: "12px" }}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeletePrompt({ isOpen: false, type: "", passwordInput: "" })}
                className="admin-btn"
                style={{ flex: 1, padding: "12px", background: "#7f8c8d" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
