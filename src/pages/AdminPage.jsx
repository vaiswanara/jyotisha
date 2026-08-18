import React, { useState, useEffect, useRef } from "react";
import { API_URL, API_TOKEN, getLessons, saveLessons, getLibrary, saveLibrary, getTicker, saveTicker, getInAppMessages, saveInAppMessage, getStudents, addStudentAdmin, updateStudent, approveStudent, toggleStudentStatus, deleteStudent, getBatches, saveBatch, deleteBatch, getCourses, saveCourse, deleteCourse, getTemplates, saveTemplate, deleteTemplate } from "../services/astrologyApi.js";
import { ALL_CONFIGURABLE_PAGES, getAdminEnabledPages, saveAdminEnabledPages, DEFAULT_ENABLED_PAGE_IDS } from "../utils/appPagesConfig.js";

const COUNTRY_CODES = [
  { code: "+91", country: "India (🇮🇳)" },
  { code: "+1", country: "USA / Canada (🇺🇸)" },
  { code: "+44", country: "United Kingdom (🇬🇧)" },
  { code: "+971", country: "UAE (🇦🇪)" },
  { code: "+61", country: "Australia (🇦🇺)" },
  { code: "+65", country: "Singapore (🇸🇬)" },
  { code: "+49", country: "Germany (🇩🇪)" },
  { code: "+33", country: "France (🇫🇷)" },
  { code: "+977", country: "Nepal (🇳🇵)" },
  { code: "+94", country: "Sri Lanka (🇱🇰)" },
  { code: "+60", country: "Malaysia (🇲🇾)" },
  { code: "+64", country: "New Zealand (🇳🇿)" },
];

export function AdminPage({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminData, setAdminData] = useState({});
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [filterPlaylist, setFilterPlaylist] = useState("");

  // Sub-tab for Batches & Lessons Tab
  const [lessonSubTab, setLessonSubTab] = useState("batches"); // "batches" | "lessons"

  // Courses & Batches State
  const [coursesList, setCoursesList] = useState([]);
  const [courseForm, setCourseForm] = useState({ id: "", code: "", title: "", language: "Kannada", description: "" });
  const [isEditingCourse, setIsEditingCourse] = useState(false);

  const [batchesList, setBatchesList] = useState([]);
  const [batchForm, setBatchForm] = useState({ id: "", name: "", language: "Kannada", start_date: "", end_date: "", remarks: "", whatsapp_group_link: "", google_meet_link: "", status: "active", isActive: true });
  const [isEditingBatch, setIsEditingBatch] = useState(false);

  // Message Templates State
  const [templatesList, setTemplatesList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showManageTemplatesModal, setShowManageTemplatesModal] = useState(false);
  const [tplForm, setTplForm] = useState({ id: "", name: "", title: "", content: "", description: "" });
  const [isEditingTpl, setIsEditingTpl] = useState(false);
  const [tplSearch, setTplSearch] = useState("");

  // Direct WhatsApp Messaging State
  const [waTargetMode, setWaTargetMode] = useState("individual"); // "individual" | "batch"
  const [selectedWaStudentId, setSelectedWaStudentId] = useState("");
  const [selectedWaBatchId, setSelectedWaBatchId] = useState("");
  const [waMessageText, setWaMessageText] = useState("");
  const [selectedWaTemplateId, setSelectedWaTemplateId] = useState("");
  const [waLog, setWaLog] = useState([]);
  const [waStudentSearch, setWaStudentSearch] = useState("");
  const [isWaSearchDropdownOpen, setIsWaSearchDropdownOpen] = useState(false);

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

  // Lesson Share Modal State
  const shareTextareaRef = useRef(null);
  const tplTextareaRef = useRef(null);
  const waTextareaRef = useRef(null);
  const msgBodyTextareaRef = useRef(null);

  const [shareLessonModalData, setShareLessonModalData] = useState(null); // lesson object
  const [shareLessonTemplateId, setShareLessonTemplateId] = useState("telugu_lesson_std");
  const [shareLessonCustomText, setShareLessonCustomText] = useState("");
  const [shareLessonStudentId, setShareLessonStudentId] = useState("");
  const [shareLessonCopied, setShareLessonCopied] = useState(false);

  // General App & Page Visibility State
  const [adminEnabledPages, setAdminEnabledPages] = useState(getAdminEnabledPages);

  const handleTogglePageVisibility = (pageId) => {
    setAdminEnabledPages((prev) => {
      const next = prev.includes(pageId) ? prev.filter((p) => p !== pageId) : [...prev, pageId];
      saveAdminEnabledPages(next);
      return next;
    });
  };

  const handleSelectAllPages = () => {
    const all = DEFAULT_ENABLED_PAGE_IDS;
    setAdminEnabledPages(all);
    saveAdminEnabledPages(all);
    setMessage({ type: "success", text: "✅ All features and pages enabled for Students!" });
  };

  const handleDeselectAllPages = () => {
    const empty = [];
    setAdminEnabledPages(empty);
    saveAdminEnabledPages(empty);
    setMessage({ type: "success", text: "⚠️ All optional features hidden from Students." });
  };

  const handleResetPageVisibility = () => {
    localStorage.removeItem("vaiswanara_admin_enabled_pages");
    setAdminEnabledPages(DEFAULT_ENABLED_PAGE_IDS);
    window.dispatchEvent(new Event("vaiswanara_admin_config_updated"));
    setMessage({ type: "success", text: "✅ Reset page visibility settings to default!" });
  };

  // Voice Query Topics State
  const [voiceTopics, setVoiceTopics] = useState([]);
  const [voiceTopicForm, setVoiceTopicForm] = useState({ id: "", name: "", icon: "🎓" });
  const [isEditingVoiceTopic, setIsEditingVoiceTopic] = useState(false);
  const [voiceTopicFilter, setVoiceTopicFilter] = useState("");

  // Custom Placeholders State & CSV Loader
  const [customPlaceholders, setCustomPlaceholders] = useState([
    { key: "meet_url", value: "https://meet.google.com/yee-uppj-for" },
    { key: "jyotisha_url", value: "https://vaiswanara.com/jyotisha" },
  ]);

  const parseCSVPlaceholders = (csvText) => {
    if (!csvText) return [];
    const lines = csvText.split(/\r?\n/);
    const result = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(",");
      if (parts.length >= 2) {
        const k = parts[0].trim().replace(/^["']|["']$/g, "");
        const v = parts.slice(1).join(",").trim().replace(/^["']|["']$/g, "");
        if (k && k !== "key") {
          result.push({ key: k, value: v });
        }
      }
    }
    return result;
  };

  const fetchCustomPlaceholders = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}static/custom_placeholders.csv?_t=${Date.now()}`);
      if (res.ok) {
        const text = await res.text();
        const parsed = parseCSVPlaceholders(text);
        if (parsed.length > 0) setCustomPlaceholders(parsed);
      }
    } catch (e) {
      console.warn("Failed to fetch custom_placeholders.csv", e);
    }
  };

  const handleCustomPlaceholdersCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSVPlaceholders(text);
      if (parsed.length > 0) {
        setCustomPlaceholders((prev) => {
          const merged = [...prev];
          parsed.forEach((item) => {
            const idx = merged.findIndex((m) => m.key === item.key);
            if (idx >= 0) merged[idx] = item;
            else merged.push(item);
          });
          return merged;
        });
        setMessage({ type: "success", text: `✅ Loaded ${parsed.length} custom placeholders from CSV!` });
      } else {
        setMessage({ type: "error", text: "❌ Could not parse any key,value pairs from CSV file." });
      }
    };
    reader.readAsText(file);
  };

  const exportCustomPlaceholdersCSV = () => {
    if (!customPlaceholders || customPlaceholders.length === 0) {
      setMessage({ type: "error", text: "⚠️ No custom placeholders to export." });
      return;
    }
    let csvContent = "key,value\n";
    customPlaceholders.forEach(({ key, value }) => {
      const cleanKey = `"${(key || "").replace(/"/g, '""')}"`;
      const cleanVal = `"${(value || "").replace(/"/g, '""')}"`;
      csvContent += `${cleanKey},${cleanVal}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `custom_placeholders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage({ type: "success", text: "✅ Custom placeholders CSV exported successfully!" });
  };

  const exportTemplatesJSON = () => {
    if (!templatesList || templatesList.length === 0) {
      setMessage({ type: "error", text: "⚠️ No templates to export." });
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templatesList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `templates_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMessage({ type: "success", text: "✅ Message templates exported successfully!" });
  };

  const handleImportTemplatesFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let imported = [];
        if (file.name.endsWith(".json")) {
          imported = JSON.parse(text);
          if (!Array.isArray(imported)) {
            imported = imported.templates || [];
          }
        } else if (file.name.endsWith(".csv")) {
          const lines = text.split(/\r?\n/);
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(",");
            if (parts.length >= 2) {
              imported.push({
                id: parts[0].trim(),
                name: parts[1].trim(),
                content: parts.slice(2).join(",").trim() || parts[1].trim()
              });
            }
          }
        }
        if (Array.isArray(imported) && imported.length > 0) {
          setTemplatesList((prev) => {
            const merged = [...prev];
            imported.forEach((item) => {
              if (item.id && !merged.some((m) => m.id === item.id)) {
                merged.push(item);
              }
            });
            return merged;
          });
          setMessage({ type: "success", text: `✅ Loaded ${imported.length} templates successfully!` });
        } else {
          setMessage({ type: "error", text: "❌ Could not parse templates from file." });
        }
      } catch (err) {
        setMessage({ type: "error", text: `❌ Failed to import templates: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const insertPlaceholderAtCursor = (tag, targetType = "share") => {
    let target = targetType;
    if (typeof targetType === "boolean") {
      target = targetType ? "tpl" : "share";
    }

    let el = null;
    if (target === "tpl") el = tplTextareaRef.current;
    else if (target === "wa") el = waTextareaRef.current;
    else if (target === "msgBody") el = msgBodyTextareaRef.current;
    else el = shareTextareaRef.current;

    if (target === "msgBody") {
      if (!el) {
        setAlertForm((prev) => ({ ...prev, body: (prev.body || "") + tag }));
        return;
      }
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const prevText = alertForm.body || "";
      const newText = prevText.substring(0, start) + tag + prevText.substring(end);
      setAlertForm((prev) => ({ ...prev, body: newText }));
      setTimeout(() => {
        el.focus();
        const newCursorPos = start + tag.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
      return;
    }

    if (target === "wa") {
      if (!el) {
        setWaMessageText((prev) => (prev || "") + tag);
        return;
      }
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const prevText = waMessageText || "";
      const newText = prevText.substring(0, start) + tag + prevText.substring(end);
      setWaMessageText(newText);
      setTimeout(() => {
        el.focus();
        const newCursorPos = start + tag.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
      return;
    }

    if (target === "tpl") {
      if (!el) {
        setTplForm((prev) => ({ ...prev, content: (prev.content || "") + tag }));
        return;
      }
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const prevText = tplForm.content || "";
      const newText = prevText.substring(0, start) + tag + prevText.substring(end);
      setTplForm((prev) => ({ ...prev, content: newText }));
      setTimeout(() => {
        el.focus();
        const newCursorPos = start + tag.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      if (!el) {
        setShareLessonCustomText((prev) => (prev || "") + tag);
        setShareLessonTemplateId("custom");
        return;
      }
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const prevText = shareLessonCustomText || "";
      const newText = prevText.substring(0, start) + tag + prevText.substring(end);
      setShareLessonCustomText(newText);
      setShareLessonTemplateId("custom");
      setTimeout(() => {
        el.focus();
        const newCursorPos = start + tag.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const DEFAULT_PRESET_TEMPLATES = [
    {
      id: "telugu_lesson_std",
      name: "🌸 తెలుగు పాఠం ప్రామాణికం (Lesson Telugu Standard)",
      title: "జ్యోతిష్య తరగతి పాఠం",
      content: `🌸 *జ్యోతిష్య తరగతి పాఠం (Jyotisha Class Lesson)* 🌸\n📚 *కోర్సు/ప్లేలిస్ట్:* {playlist}\n🎥 *పాఠం శీర్షిక:* {title}\n\n📺 *యూట్యూబ్ వీడియో (YouTube Link):* {videoUrl}\n📄 *పిడిఎఫ్ నోట్స్ (PDF Notes):* {pdfLink}\n\nHari Om 🙏`,
      description: "పాఠాల వాట్సాప్ షేరింగ్ కోసం తెలుగు ప్రామాణిక టెంప్లేట్",
    },
    {
      id: "english_lesson_std",
      name: "📚 Lesson English Standard",
      title: "Jyotisha Class Lesson",
      content: `📚 *Course:* {playlist}\n📖 *Lesson:* {title}\n\n▶️ *Watch Video:* {videoUrl}\n📄 *PDF Notes:* {pdfLink}\n\nHappy Learning! 🌟`,
      description: "Standard English lesson share template with video & pdf placeholders",
    },
    {
      id: "compact_lesson_share",
      name: "⚡ సంక్షిప్త పాఠం లింకులు (Compact Lesson Share)",
      title: "Lesson Quick Links",
      content: `*Lesson:* {title} ({playlist})\n🎥 {videoUrl}\n📄 {pdfLink}`,
      description: "Quick compact links for lesson video and notes",
    },
  ];

  const formatLessonShareMessage = (templateText, lesson) => {
    if (!templateText) return "";
    let result = templateText;
    if (lesson) {
      const videoUrl = lesson.videoId ? `https://youtu.be/${lesson.videoId}` : "";
      const pdfLinkStr = lesson.pdfLink && lesson.pdfLink.trim() ? lesson.pdfLink.trim() : "(పిడిఎఫ్ నోట్స్ లింక్ లేదు)";
      result = result
        .replace(/\{title\}/g, lesson.title || "")
        .replace(/\{playlist\}/g, lesson.playlist || "")
        .replace(/\{videoId\}/g, lesson.videoId || "")
        .replace(/\{videoUrl\}/g, videoUrl)
        .replace(/\{pdfLink\}/g, pdfLinkStr);
    }
    if (Array.isArray(customPlaceholders)) {
      customPlaceholders.forEach(({ key, value }) => {
        if (key) {
          const regex = new RegExp(`\\{${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\}`, "g");
          result = result.replace(regex, value || "");
        }
      });
    }
    return result;
  };

  const handleOpenShareLessonModal = (lesson) => {
    setShareLessonModalData(lesson);
    const initialTpl = templatesList.find((t) => t.id === "telugu_lesson_std") || templatesList[0] || DEFAULT_PRESET_TEMPLATES[0];
    setShareLessonTemplateId(initialTpl ? initialTpl.id : "custom");
    setShareLessonCustomText(initialTpl ? initialTpl.content : "");
    setShareLessonStudentId("");
    setShareLessonCopied(false);
  };

  const handleSelectShareLessonTemplate = (tplId) => {
    setShareLessonTemplateId(tplId);
    if (tplId === "custom") return;
    const selectedTpl = templatesList.find((t) => t.id === tplId);
    if (selectedTpl) {
      setShareLessonCustomText(selectedTpl.content);
    }
  };

  const handleShareLessonGroup = () => {
    if (!shareLessonModalData) return;
    const text = formatLessonShareMessage(shareLessonCustomText, shareLessonModalData);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShareLessonIndividual = () => {
    if (!shareLessonModalData) return;
    const text = formatLessonShareMessage(shareLessonCustomText, shareLessonModalData);
    let phone = "";
    if (shareLessonStudentId) {
      const st = students.find((s) => String(s.id) === String(shareLessonStudentId));
      if (st) {
        phone = formatWhatsAppPhone(st.whatsapp_number, st.country_code);
      }
    }
    let url = "";
    if (phone) {
      url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    }
    window.open(url, "_blank");
  };

  const handleCopyShareLessonText = () => {
    if (!shareLessonModalData) return;
    const text = formatLessonShareMessage(shareLessonCustomText, shareLessonModalData);
    navigator.clipboard.writeText(text);
    setShareLessonCopied(true);
    setTimeout(() => setShareLessonCopied(false), 2500);
  };

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

  // In-App Messages Form State
  const [inAppMessages, setInAppMessages] = useState([]);
  const [inAppFormId, setInAppFormId] = useState("");

  const [inAppDates, setInAppDates] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    })(),
    isActive: true,
  });
  const [isEditingInApp, setIsEditingInApp] = useState(false);
  const [loadingInApp, setLoadingInApp] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [hasActionLink, setHasActionLink] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState("messages");

  // Students state
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("ALL"); // ALL | PENDING | APPROVED | DEACTIVATED
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = Add mode, student = Edit mode
  const [stuForm, setStuForm] = useState({ first_name: "", last_name: "", whatsapp_number: "", country_code: "+91", language: "Kannada", courses: ["Jyotisha", "ManaShastra"], email: "", address: "" });
  const [stuSaving, setStuSaving] = useState(false);
  const [stuFormErr, setStuFormErr] = useState("");



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

  const fetchInAppMessagesList = async () => {
    try {
      const data = await getInAppMessages();
      if (Array.isArray(data)) {
        setInAppMessages(data);
      } else {
        throw new Error("No in-app messages from API");
      }
    } catch (err) {
      console.warn("API in-app messages fetch failed, falling back to static", err);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}static/in_app_messages.json?_t=${Date.now()}`);
        if (!res.ok) throw new Error("Static in-app messages not found");
        const data = await res.json();
        if (Array.isArray(data)) {
          setInAppMessages(data);
        }
      } catch (staticErr) {
        console.error("Static in-app messages fallback failed", staticErr);
      }
    }
  };

  const fetchCoursesList = async () => {
    try {
      const res = await getCourses();
      if (res && res.courses) setCoursesList(res.courses);
    } catch (e) {
      console.warn("Failed to fetch courses:", e);
    }
  };

  const fetchBatchesList = async () => {
    try {
      const res = await getBatches();
      if (res && res.batches) setBatchesList(res.batches);
    } catch (e) {
      console.warn("Failed to fetch batches:", e);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;
    try {
      const cId = courseForm.id.trim() || courseForm.code.trim().toUpperCase() || courseForm.title.trim().toUpperCase();
      const cData = { ...courseForm, id: cId };
      await saveCourse(cData);
      setMessage({ type: "success", text: `✅ Course ${isEditingCourse ? 'updated' : 'added'} successfully!` });
      setCourseForm({ id: "", code: "", title: "", language: "Kannada", description: "" });
      setIsEditingCourse(false);
      fetchCoursesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const handleEditCourse = (c) => {
    setCourseForm(c);
    setIsEditingCourse(true);
  };

  const handleDeleteCourseClick = async (id) => {
    if (!window.confirm(`Are you sure you want to delete course "${id}"?`)) return;
    try {
      await deleteCourse(id);
      setMessage({ type: "success", text: "✅ Course deleted successfully!" });
      fetchCoursesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    if (!batchForm.name.trim()) return;
    try {
      const bId = batchForm.id.trim() || batchForm.name.trim().replace(/\s+/g, '-').toUpperCase();
      const bData = {
        ...batchForm,
        id: bId,
        isActive: batchForm.status === "active" || batchForm.isActive === true
      };
      await saveBatch(bData);
      setMessage({ type: "success", text: `✅ Batch ${isEditingBatch ? 'updated' : 'created'} successfully!` });
      setBatchForm({ id: "", name: "", language: "Kannada", start_date: "", end_date: "", remarks: "", whatsapp_group_link: "", google_meet_link: "", status: "active", isActive: true });
      setIsEditingBatch(false);
      fetchBatchesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const handleEditBatch = (b) => {
    setBatchForm({
      id: b.id || "",
      name: b.name || "",
      language: b.language || "Kannada",
      start_date: b.start_date || "",
      end_date: b.end_date || "",
      remarks: b.remarks || "",
      whatsapp_group_link: b.whatsapp_group_link || "",
      google_meet_link: b.google_meet_link || "",
      status: b.status || (b.isActive !== false ? "active" : "inactive"),
      isActive: b.isActive !== false,
    });
    setIsEditingBatch(true);
  };

  const handleDeleteBatchClick = async (id) => {
    if (!window.confirm(`Are you sure you want to delete batch "${id}"?`)) return;
    try {
      await deleteBatch(id);
      setMessage({ type: "success", text: "✅ Batch deleted successfully!" });
      fetchBatchesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const fetchTemplatesList = async () => {
    try {
      const res = await getTemplates();
      let fetched = (res && res.templates) ? res.templates : [];
      const combined = [...fetched];
      DEFAULT_PRESET_TEMPLATES.forEach((preset) => {
        if (!combined.some((t) => t.id === preset.id || t.name === preset.name)) {
          combined.push(preset);
        }
      });
      setTemplatesList(combined);
    } catch (e) {
      console.warn("Failed to fetch templates:", e);
      setTemplatesList(DEFAULT_PRESET_TEMPLATES);
    }
  };

  const fetchVoiceTopicsList = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem("vaiswanara_query_topics") || "null");
      if (Array.isArray(saved) && saved.length > 0) {
        setVoiceTopics(saved);
        return;
      }
    } catch (_) {}

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}static/query_topics.json?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVoiceTopics(data);
          return;
        }
      }
    } catch (_) {}

    setVoiceTopics([
      { id: "class_doubt", name: "Gurukulam Live Class Doubt", icon: "🎓" },
      { id: "horoscope", name: "Horoscope (Janma Kundali) Analysis", icon: "📜" },
      { id: "dasha_bhukti", name: "Dasha & Antardasha Predictions", icon: "⏳" },
      { id: "gochara_transit", name: "Planetary Transit (Gochara) & Remedies", icon: "🪐" },
      { id: "muhurtha", name: "Muhurtha (Auspicious Timing) Query", icon: "⏰" },
      { id: "prashna_shastra", name: "Prashna Shastra (Horary) Query", icon: "☸️" },
      { id: "retrograde_combustion", name: "Retrograde (Vakra) & Combust Planets", icon: "🔄" },
      { id: "match_compatibility", name: "Kundali Matching & Dosha Parihara", icon: "💞" },
      { id: "general_astrology", name: "General Astrology / Siddhanta Doubt", icon: "☀️" },
    ]);
  };

  const handleSaveVoiceTopic = (e) => {
    e.preventDefault();
    if (!voiceTopicForm.name.trim()) return;
    const tId = (voiceTopicForm.id.trim() || voiceTopicForm.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")).replace(/^_+|_+$/g, "");
    const updatedTopic = {
      id: tId || `topic_${Date.now()}`,
      name: voiceTopicForm.name.trim(),
      icon: voiceTopicForm.icon.trim() || "🎓",
    };

    let updatedList;
    if (isEditingVoiceTopic) {
      updatedList = voiceTopics.map((t) => (t.id === voiceTopicForm.id ? updatedTopic : t));
    } else {
      updatedList = [...voiceTopics, updatedTopic];
    }

    setVoiceTopics(updatedList);
    try {
      localStorage.setItem("vaiswanara_query_topics", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("vaiswanara_query_topics_updated"));
    } catch (_) {}

    setMessage({ type: "success", text: `✅ Voice Query Topic ${isEditingVoiceTopic ? "updated" : "added"} successfully!` });
    setVoiceTopicForm({ id: "", name: "", icon: "🎓" });
    setIsEditingVoiceTopic(false);
  };

  const handleEditVoiceTopic = (t) => {
    setVoiceTopicForm(t);
    setIsEditingVoiceTopic(true);
  };

  const handleDeleteVoiceTopic = (id) => {
    if (!window.confirm("Are you sure you want to delete this Query Topic?")) return;
    const updatedList = voiceTopics.filter((t) => t.id !== id);
    setVoiceTopics(updatedList);
    try {
      localStorage.setItem("vaiswanara_query_topics", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("vaiswanara_query_topics_updated"));
    } catch (_) {}
    setMessage({ type: "success", text: "✅ Query Topic removed successfully!" });
  };

  const handleMoveVoiceTopic = (index, dir) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= voiceTopics.length) return;
    const newList = [...voiceTopics];
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setVoiceTopics(newList);
    try {
      localStorage.setItem("vaiswanara_query_topics", JSON.stringify(newList));
      window.dispatchEvent(new Event("vaiswanara_query_topics_updated"));
    } catch (_) {}
  };

  const handleResetVoiceTopics = () => {
    if (!window.confirm("Reset all Voice Query Topics to default?")) return;
    localStorage.removeItem("vaiswanara_query_topics");
    window.dispatchEvent(new Event("vaiswanara_query_topics_updated"));
    fetchVoiceTopicsList();
    setMessage({ type: "success", text: "✅ Reset to default query topics successfully!" });
  };

  const handleDownloadVoiceTopicsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(voiceTopics, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "query_topics.json");
    dlAnchorElem.click();
    dlAnchorElem.remove();
  };

  const handleImportVoiceTopicsJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVoiceTopics(parsed);
          localStorage.setItem("vaiswanara_query_topics", JSON.stringify(parsed));
          window.dispatchEvent(new Event("vaiswanara_query_topics_updated"));
          setMessage({ type: "success", text: `✅ Successfully imported ${parsed.length} query topics!` });
        } else {
          setMessage({ type: "error", text: "❌ Invalid JSON: Expected an array of topic objects." });
        }
      } catch (err) {
        setMessage({ type: "error", text: `❌ Import failed: ${err.message}` });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSelectTemplate = (tplId) => {
    setSelectedTemplateId(tplId);
    if (!tplId) return;
    const tpl = templatesList.find(t => t.id === tplId);
    if (tpl) {
      setAlertForm(prev => ({
        ...prev,
        title: tpl.title || tpl.name || prev.title,
        body: tpl.content || prev.body
      }));
      setMessage({ type: "success", text: `⚡ Loaded template "${tpl.name}" into message form.` });
    }
  };

  const handleSaveTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!tplForm.name.trim() || !tplForm.content.trim()) return;
    try {
      await saveTemplate(tplForm);
      setMessage({ type: "success", text: `✅ Template ${isEditingTpl ? 'updated' : 'created'} successfully!` });
      setTplForm({ id: "", name: "", title: "", content: "", description: "" });
      setIsEditingTpl(false);
      fetchTemplatesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const handleEditTemplate = (tpl) => {
    setTplForm(tpl);
    setIsEditingTpl(true);
    setShowManageTemplatesModal(true);
  };

  const handleDeleteTemplateClick = async (id) => {
    if (!window.confirm(`Are you sure you want to delete template "${id}"?`)) return;
    try {
      await deleteTemplate(id);
      setMessage({ type: "success", text: "✅ Template deleted successfully!" });
      fetchTemplatesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const isStudentInBatch = (student, batch) => {
    if (!student || !batch) return false;
    if (Array.isArray(student.batches) && student.batches.includes(batch.id)) return true;
    if (student.batch_id && (student.batch_id === batch.id || student.batch_id === batch.name)) return true;
    if (Array.isArray(student.courses) && (student.courses.includes(batch.name) || student.courses.includes(batch.id))) return true;
    return false;
  };

  const formatWhatsAppPhone = (phoneStr, codeStr) => {
    let clean = (phoneStr || "").replace(/[^0-9]/g, "");
    if (!clean) return "";
    let code = (codeStr || "+91").replace(/[^0-9]/g, "");
    if (!code) code = "91";
    if (clean.length === 10) return code + clean;
    if (clean.length > 10 && clean.startsWith(code)) return clean;
    return clean;
  };

  const replaceMessagePlaceholders = (text, student, batch) => {
    if (!text) return "";
    let result = text;

    // Use selected student, first student in list, or sample preview fallback
    const st = student || (students && students.length > 0 ? students[0] : null) || {
      first_name: "రాము",
      last_name: "శర్మ",
      whatsapp_number: "+91 9876543210",
      language: "తెలుగు",
      courses: ["జ్యోతిష్య ప్రాథమికం"],
      batch_id: "JYOTISHA-2025"
    };

    const fullName = `${st.first_name || ""} ${st.last_name || ""}`.trim() || "రాము శర్మ";
    result = result
      .replace(/\{student_name\}/g, fullName)
      .replace(/\{first_name\}/g, st.first_name || "రాము")
      .replace(/\{last_name\}/g, st.last_name || "శర్మ")
      .replace(/\{whatsapp_number\}/g, st.whatsapp_number || "+91 9876543210")
      .replace(/\{language\}/g, st.language || "తెలుగు")
      .replace(/\{course\}/g, Array.isArray(st.courses) ? st.courses.join(", ") : (st.courses || "జ్యోతిష్య ప్రాథమికం"))
      .replace(/\{batch_id\}/g, st.batch_id || "JYOTISHA-2025");

    // Use selected batch, first batch in list, or sample preview fallback
    const bt = batch || (batchesList && batchesList.length > 0 ? batchesList[0] : null) || {
      name: "జ్యోతిష తరగతులు 2025",
      id: st.batch_id || "JYOTISHA-2025",
      course_id: "JYOTISHA",
      whatsapp_group_link: "https://chat.whatsapp.com/SampleGroupLink"
    };

    result = result
      .replace(/\{batch_name\}/g, bt.name || bt.id || "జ్యోతిష తరగతులు 2025")
      .replace(/\{batch_id\}/g, bt.id || "JYOTISHA-2025")
      .replace(/\{course_name\}/g, bt.course_id || bt.course_name || "జ్యోతిష్య ప్రాథమికం")
      .replace(/\{whatsapp_group_link\}/g, bt.whatsapp_group_link || "https://chat.whatsapp.com/SampleGroupLink");

    // Replace custom placeholders from CSV / state
    if (Array.isArray(customPlaceholders)) {
      customPlaceholders.forEach(({ key, value }) => {
        if (key) {
          const regex = new RegExp(`\\{${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\}`, "g");
          result = result.replace(regex, value || "");
        }
      });
    }
    return result;
  };

  const handleOpenIndividualWhatsApp = (studentObj, customMsg) => {
    const msgText = customMsg !== undefined ? customMsg : waMessageText;
    const finalMsg = replaceMessagePlaceholders(msgText, studentObj);
    const cleanPhone = formatWhatsAppPhone(studentObj.whatsapp_number, studentObj.country_code);
    let url = "";
    if (cleanPhone) {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(finalMsg)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(finalMsg)}`;
    }
    window.open(url, "_blank");
    setWaLog(prev => [{ time: new Date().toLocaleTimeString(), type: "Individual", target: `${studentObj.first_name} ${studentObj.last_name} (${cleanPhone})`, msg: finalMsg }, ...prev]);
  };

  const handleOpenGroupShareWhatsApp = (batchObj, customMsg) => {
    const msgText = customMsg !== undefined ? customMsg : waMessageText;
    const finalMsg = replaceMessagePlaceholders(msgText, null, batchObj);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, "_blank");
    setWaLog(prev => [{ time: new Date().toLocaleTimeString(), type: "Group Share", target: batchObj ? batchObj.name : "WhatsApp Group", msg: finalMsg }, ...prev]);
  };

  const handleSelectWaTemplateInComposer = (tplId) => {
    setSelectedWaTemplateId(tplId);
    if (!tplId) return;
    const tpl = templatesList.find(t => t.id === tplId);
    if (tpl) {
      setWaMessageText(tpl.content || "");
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
        setAdminData({});
        setIsLoggedIn(true);
        sessionStorage.setItem("admin_pwd", pwd);
        setMessage(null);
        await fetchLessonsList();
        await fetchCoursesList();
        await fetchBatchesList();
        await fetchTemplatesList();
        await fetchCustomPlaceholders();
        await fetchLibraryList();
        await fetchTickerList();
        if (data.inAppMessages) {
          setInAppMessages(data.inAppMessages);
        } else {
          await fetchInAppMessagesList();
        }
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
    setAdminData({});
    setLessons([]);
    setLibrary([]);
    setTickerList([]);
    setTickerForm({ id: "", startDate: "", endDate: "", updates: [] });
    setTickerUpdatesText("");
    setIsEditingTicker(false);
    setLoadingTicker(false);
    setInAppMessages([]);
    setInAppFormId("");
    setInAppDates({
      startDate: new Date().toISOString().split("T")[0],
      endDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split("T")[0];
      })(),
      isActive: true,
    });
    setIsEditingInApp(false);
    setLoadingInApp(false);
    setForceRefresh(false);
    setHasActionLink(false);
  };

  const handleCombinedSubmit = async (e) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.body) {
      setMessage({ type: "error", text: "Title and Body are required!" });
      return;
    }

    setLoading(true);
    let successMessageParts = [];
    let isError = false;

    const targetUrl = hasActionLink ? alertForm.url.trim() : "";

    // Save In-App Message
    setLoadingInApp(true);
    const messageId = inAppFormId || `inapp_${Date.now()}`;
    const newMsg = {
      id: messageId,
      title: alertForm.title.trim(),
      body: alertForm.body.trim(),
      url: targetUrl,
      startDate: inAppDates.startDate,
      endDate: inAppDates.endDate,
      isActive: inAppDates.isActive,
      forceRefresh: forceRefresh,
    };

    let updatedMsgs = [];
    if (isEditingInApp) {
      updatedMsgs = inAppMessages.map((m) => (m.id === inAppFormId ? newMsg : m));
    } else {
      updatedMsgs = [newMsg, ...inAppMessages];
    }

    try {
      const res = await saveInAppMessage(updatedMsgs, password);
      if (res && res.status === "success") {
        setInAppMessages(updatedMsgs);
        successMessageParts.push("In-App message saved successfully");

        setIsEditingInApp(false);
        setInAppFormId("");
        setInAppDates({
          startDate: new Date().toISOString().split("T")[0],
          endDate: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 7);
            return d.toISOString().split("T")[0];
          })(),
          isActive: true,
        });
        setForceRefresh(false);
        setHasActionLink(false);
      } else {
        isError = true;
        setMessage({ type: "error", text: res?.error || "Failed to save In-App message." });
      }
    } catch (err) {
      isError = true;
      setMessage({ type: "error", text: "❌ Failed to save In-App message." });
    }
    setLoadingInApp(false);

    if (!isError) {
      setMessage({ type: "success", text: `✅ ${successMessageParts.join(" & ")}!` });
      if (!isEditingInApp) {
        setAlertForm({
          title: "",
          body: "",
          url: import.meta.env.BASE_URL,
          is_important: false,
        });
        setForceRefresh(false);
        setHasActionLink(false);
      }
    }
    setLoading(false);
  };

  const handleEditCombined = (msg) => {
    setIsEditingInApp(true);
    setInAppFormId(msg.id);
    setAlertForm({
      title: msg.title || "",
      body: msg.body || "",
      url: msg.url || "",
      is_important: false,
    });
    setInAppDates({
      startDate: msg.startDate || new Date().toISOString().split("T")[0],
      endDate: msg.endDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      isActive: msg.isActive !== undefined ? msg.isActive : true,
    });
    setForceRefresh(msg.forceRefresh || false);
    const hasLink = msg.url && msg.url.trim() !== "" && msg.url.trim() !== "/" && msg.url.trim() !== import.meta.env.BASE_URL;
    setHasActionLink(!!hasLink);
  };

  const handleDeleteInApp = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this in-app message?")) return;

    const updatedMsgs = inAppMessages.filter((m) => m.id !== msgId);
    setLoadingInApp(true);
    try {
      const res = await saveInAppMessage(updatedMsgs, password);
      if (res && res.status === "success") {
        setInAppMessages(updatedMsgs);
        setMessage({ type: "success", text: "✅ In-App message deleted successfully!" });
      } else {
        setMessage({ type: "error", text: res?.error || "Failed to delete message." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to delete message." });
    }
    setLoadingInApp(false);
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
    const headers = ["id", "title", "author", "language", "subject", "subcategory", "description", "sourceType", "thumbnail", "readLink", "pdfLink", "createdDate", "isVisibility"];
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

  // ── Students helpers ──────────────────────────────────────────────────────
  const BLANK_STU = { first_name: "", last_name: "", whatsapp_number: "", country_code: "+91", language: "Kannada", batch_id: "JK-2026-OCT", email: "", address: "" };

  const fetchStudentsList = async () => {
    setLoadingStudents(true);
    try {
      const data = await getStudents(password);
      setStudents(Array.isArray(data) ? data : (data?.students || []));
    } catch (err) {
      setMessage({ type: "error", text: `❌ Could not load students: ${err.message}` });
    }
    setLoadingStudents(false);
  };

  const isBatchCurrentlyActive = (b) => {
    if (!b) return false;
    if (b.isActive === false || b.status === "inactive") return false;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    if (b.start_date && today < b.start_date) return false;
    if (b.end_date && today > b.end_date) return false;
    return true;
  };

  const openAddModal = () => {
    setEditingStudent(null);
    const defaultBatch = batchesList.find(b => (b.language || "").toLowerCase() === "kannada" && isBatchCurrentlyActive(b))?.id || (batchesList[0]?.id || "");
    setStuForm({
      ...BLANK_STU,
      language: "Kannada",
      batch_id: defaultBatch,
      batches: defaultBatch ? [defaultBatch] : [],
    });
    setStuFormErr("");
    setShowAddStudentForm(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    const stuLang = student.language || "Kannada";
    let initialBatches = [];
    if (Array.isArray(student.batches) && student.batches.length > 0) {
      initialBatches = [...student.batches];
    } else if (student.batch_id) {
      initialBatches = [student.batch_id];
    } else if (Array.isArray(student.courses) && student.courses.length > 0) {
      initialBatches = student.courses.map(c => batchesList.find(b => b.name === c || b.id === c)?.id || c).filter(Boolean);
    }
    if (initialBatches.length === 0 && batchesList.length > 0) {
      const matchBatch = batchesList.find(b => (b.language || "").toLowerCase() === stuLang.toLowerCase() && isBatchCurrentlyActive(b)) || batchesList[0];
      if (matchBatch) initialBatches = [matchBatch.id];
    }

    setStuForm({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      whatsapp_number: student.whatsapp_number || "",
      country_code: student.country_code || "+91",
      language: stuLang,
      batch_id: initialBatches[0] || "",
      batches: initialBatches,
      email: student.email || "",
      address: student.address || "",
    });
    setStuFormErr("");
    setShowAddStudentForm(true);
  };

  const handleStudentModalSave = async () => {
    if (!stuForm.first_name.trim()) { setStuFormErr("First Name is required."); return; }
    if (!stuForm.last_name.trim()) { setStuFormErr("Last Name is required."); return; }
    if (!stuForm.whatsapp_number.trim()) { setStuFormErr("WhatsApp number is required."); return; }
    const selectedBatches = Array.isArray(stuForm.batches) ? stuForm.batches : (stuForm.batch_id ? [stuForm.batch_id] : []);
    if (selectedBatches.length === 0) { setStuFormErr("Please select at least one assigned batch."); return; }

    setStuSaving(true);
    setStuFormErr("");
    try {
      const batchNames = selectedBatches.map(bId => batchesList.find(b => b.id === bId)?.name || bId);
      const savePayload = {
        ...stuForm,
        batch_id: selectedBatches[0] || "",
        batches: selectedBatches,
        courses: batchNames,
      };
      if (editingStudent) {
        await updateStudent({ student_id: editingStudent.id, ...savePayload });
        setStudents((prev) => prev.map((s) => s.id === editingStudent.id ? { ...s, ...savePayload } : s));
        setMessage({ type: "success", text: "✅ Student updated successfully!" });
      } else {
        const res = await addStudentAdmin(savePayload);
        if (res?.student) setStudents((prev) => [...prev, res.student]);
        else fetchStudentsList();
        setMessage({ type: "success", text: "✅ Student added successfully!" });
      }
      setShowAddStudentForm(false);
    } catch (err) {
      setStuFormErr(err.message);
    }
    setStuSaving(false);
  };

  const [showRegFormSetting, setShowRegFormSetting] = useState(() => {
    try {
      return localStorage.getItem("vaiswanara_show_registration_form") !== "false";
    } catch (_) {
      return true;
    }
  });

  const handleToggleShowRegForm = (enabled) => {
    setShowRegFormSetting(enabled);
    try {
      localStorage.setItem("vaiswanara_show_registration_form", enabled ? "true" : "false");
      window.dispatchEvent(new Event("vaiswanara_reg_setting_updated"));
    } catch (e) {
      console.error("Failed to save reg setting", e);
    }
    setMessage({
      type: "success",
      text: enabled ? "✅ Student Registration Form is now visible in Sidebar & Home screen." : "⚠️ Student Registration Form is now hidden and disabled in App."
    });
  };

  const handleShareRegForm = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?register`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setMessage({
        type: "success",
        text: `🔗 Student Registration Form URL copied to clipboard: ${shareUrl}`
      });
    } else {
      prompt("Copy Registration Link:", shareUrl);
    }
  };

  const [adminWaNumber, setAdminWaNumber] = useState(() => {
    try {
      return localStorage.getItem("vaiswanara_admin_whatsapp") || "919482094290";
    } catch (_) {
      return "919482094290";
    }
  });

  const handleSaveAdminWaNumber = (num) => {
    setAdminWaNumber(num);
    try {
      let clean = String(num || "").replace(/[^0-9]/g, "");
      if (clean.length === 10) clean = "91" + clean;
      localStorage.setItem("vaiswanara_admin_whatsapp", clean || "919482094290");
    } catch (_) { }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      await approveStudent({ student_id: studentId });
      setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, status: "activated" } : s));
      setMessage({ type: "success", text: "✅ Student approved and activated!" });
    } catch (err) {
      setMessage({ type: "error", text: `❌ Approve failed: ${err.message}` });
    }
  };

  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    const newStatus = (currentStatus === "deactivated") ? "activated" : "deactivated";
    setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, status: newStatus } : s));
    try {
      await toggleStudentStatus({ student_id: studentId });
    } catch (err) {
      setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, status: currentStatus } : s));
      setMessage({ type: "error", text: `❌ Status toggle failed: ${err.message}` });
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm(`Are you sure you want to delete student ${studentId}?`)) return;
    try {
      await deleteStudent({ student_id: studentId });
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setMessage({ type: "success", text: "✅ Student deleted successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: `❌ Delete failed: ${err.message}` });
    }
  };

  const exportStudentsCSV = () => {
    if (students.length === 0) return;
    const headers = ["ID", "First Name", "Last Name", "WhatsApp", "Language", "Courses", "Email", "Address", "Status", "Registered On"];
    const rows = students.map((s) => [
      s.id || "",
      s.first_name || "",
      s.last_name || "",
      `${s.country_code || "+91"}${s.whatsapp_number || ""}`,
      s.language || "",
      Array.isArray(s.courses) ? s.courses.join("; ") : (s.courses || ""),
      s.email || "",
      (s.address || "").replace(/\n/g, " "),
      s.status || "pending",
      s.created_at || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const countAll = students.length;
  const countPending = students.filter((s) => (s.status || "pending") === "pending").length;
  const countApproved = students.filter((s) => s.status === "activated" || s.status === "approved").length;
  const countDeactivated = students.filter((s) => s.status === "deactivated").length;

  const _sq = studentSearch.toLowerCase();
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !_sq ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(_sq) ||
      (s.whatsapp_number || "").includes(_sq) ||
      (s.id || "").toLowerCase().includes(_sq) ||
      (s.language || "").toLowerCase().includes(_sq) ||
      (s.status || "").toLowerCase().includes(_sq) ||
      (Array.isArray(s.courses) ? s.courses.join(" ") : (s.courses || "")).toLowerCase().includes(_sq);

    if (!matchesSearch) return false;

    const st = s.status || "pending";
    if (studentStatusFilter === "PENDING") return st === "pending";
    if (studentStatusFilter === "APPROVED") return st === "activated" || st === "approved";
    if (studentStatusFilter === "DEACTIVATED") return st === "deactivated";
    return true; // ALL
  });

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
        padding: "30px 10px 120px 10px",
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
          margin-bottom: 0;
          overflow: hidden;
        }
        .admin-tabs-nav {
          display: flex;
          gap: 0;
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 12px 12px 0 0;
          padding: 12px 16px 0 16px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .admin-tab-btn {
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 10px 18px 12px 18px;
          font-size: 13.5px;
          font-weight: 600;
          color: #7f8c8d;
          cursor: pointer;
          white-space: nowrap;
          border-radius: 6px 6px 0 0;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }
        .admin-tab-btn:hover {
          color: #2c3e50;
          background: #f8f9fa;
        }
        .admin-tab-btn.active {
          color: #8e44ad;
          border-bottom-color: #8e44ad;
          background: #fdf7ff;
        }
        .admin-tab-badge {
          background: #e9ecef;
          color: #555;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
          line-height: 1.4;
        }
        .admin-tab-btn.active .admin-tab-badge {
          background: #e8d5f5;
          color: #8e44ad;
        }
        .admin-subtabs-nav {
          display: flex;
          gap: 10px;
          background: #f8fafc;
          border-bottom: 1.5px solid #e2e8f0;
          padding: 12px 20px;
          flex-wrap: wrap;
          align-items: center;
        }
        .admin-subtab-btn {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 20px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .admin-subtab-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #94a3b8;
        }
        .admin-subtab-btn.active {
          background: #8e44ad;
          color: #ffffff;
          border-color: #8e44ad;
          box-shadow: 0 2px 8px rgba(142, 68, 173, 0.25);
        }
        .admin-subtab-btn.active .admin-tab-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        .admin-tab-panel {
          background: #fff;
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
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
          maxWidth: "100%",
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


        {/* ── Main Tab Navigation (4 Clear Categorized Tabs) ── */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn${activeTab === "general" ? " active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            ⚙️ General
            <span className="admin-tab-badge" style={{ background: "#e0e7ff", color: "#4338ca" }}>
              {adminEnabledPages.length}
            </span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn${["messages", "whatsapp", "templates", "tickers"].includes(activeTab) ? " active" : ""}`}
            onClick={() => {
              if (!["messages", "whatsapp", "templates", "tickers"].includes(activeTab)) {
                setActiveTab("messages");
              }
            }}
          >
            📣 Messages
            <span className="admin-tab-badge">
              {inAppMessages.length + templatesList.length + tickerList.length}
            </span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn${["students", "lessons", "library"].includes(activeTab) ? " active" : ""}`}
            onClick={() => {
              if (!["students", "lessons", "library"].includes(activeTab)) {
                setActiveTab("students");
                if (students.length === 0) fetchStudentsList();
              }
            }}
          >
            📖 e-PATA
            <span className="admin-tab-badge">
              {students.length + batchesList.length + lessons.length + library.length}
            </span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn${activeTab === "voice_topics" ? " active" : ""}`}
            onClick={() => {
              setActiveTab("voice_topics");
              if (voiceTopics.length === 0) fetchVoiceTopicsList();
            }}
          >
            🎙️ Voice Topics
            <span className="admin-tab-badge" style={{ background: "#fed7aa", color: "#c2410c" }}>
              {voiceTopics.length || 9}
            </span>
          </button>
        </div>

        {/* ── Sub-Tab Navigation for 📣 Messages ── */}
        {["messages", "whatsapp", "templates", "tickers"].includes(activeTab) && (
          <div className="admin-subtabs-nav">
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "messages" ? " active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              📩 In-App Messages
              <span className="admin-tab-badge">{inAppMessages.length}</span>
            </button>
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "whatsapp" ? " active" : ""}`}
              onClick={() => {
                setActiveTab("whatsapp");
                if (students.length === 0) fetchStudentsList();
                if (batchesList.length === 0) fetchBatchesList();
                if (templatesList.length === 0) fetchTemplatesList();
              }}
            >
              💬 WhatsApp Direct
              <span className="admin-tab-badge" style={{ background: "#dcfce7", color: "#15803d", fontSize: "10.5px" }}>
                FREE
              </span>
            </button>
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "templates" ? " active" : ""}`}
              onClick={() => {
                setActiveTab("templates");
                if (templatesList.length === 0) fetchTemplatesList();
              }}
            >
              📋 Templates
              <span className="admin-tab-badge">{templatesList.length}</span>
            </button>
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "tickers" ? " active" : ""}`}
              onClick={() => setActiveTab("tickers")}
            >
              🛎️ Tickers
              <span className="admin-tab-badge">{tickerList.length}</span>
            </button>
          </div>
        )}

        {/* ── Sub-Tab Navigation for 📖 e-PATA ── */}
        {["students", "lessons", "library"].includes(activeTab) && (
          <div className="admin-subtabs-nav">
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "students" ? " active" : ""}`}
              onClick={() => {
                setActiveTab("students");
                if (students.length === 0) fetchStudentsList();
              }}
            >
              🎓 Students
              <span className="admin-tab-badge">{students.length}</span>
            </button>
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "lessons" ? " active" : ""}`}
              onClick={() => {
                setActiveTab("lessons");
                if (batchesList.length === 0) fetchBatchesList();
              }}
            >
              👥 Batches & Lessons
              <span className="admin-tab-badge">{batchesList.length + lessons.length}</span>
            </button>
            <button
              type="button"
              className={`admin-subtab-btn${activeTab === "library" ? " active" : ""}`}
              onClick={() => setActiveTab("library")}
            >
              📚 e-Library
              <span className="admin-tab-badge">{library.length}</span>
            </button>
          </div>
        )}

        {/* ── Tab Panels ── */}
        <div className="admin-tab-panel">
          {/* ── GENERAL TAB ── */}
          {activeTab === "general" && (
            <div className="admin-card-body">
              {/* Header Bar */}
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5rem" }}>⚙️</span> General App Settings & Feature Visibility
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
                  Master controls to decide which features are globally enabled for Students across the Sidebar, Home Screen, and User Settings.
                </p>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                    border: "1.5px solid #c7d2fe",
                    borderRadius: "12px",
                    padding: "14px 18px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#4338ca", textTransform: "uppercase" }}>
                    Enabled Features
                  </div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#312e81", marginTop: "4px" }}>
                    {adminEnabledPages.length} <span style={{ fontSize: "1rem", fontWeight: "600", color: "#6366f1" }}>/ {ALL_CONFIGURABLE_PAGES.length}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: showRegFormSetting ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                    border: showRegFormSetting ? "1.5px solid #86efac" : "1.5px solid #fca5a5",
                    borderRadius: "12px",
                    padding: "14px 18px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "700", color: showRegFormSetting ? "#166534" : "#991b1b", textTransform: "uppercase" }}>
                    Registration Form
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: showRegFormSetting ? "#14532d" : "#7f1d1d", marginTop: "6px" }}>
                    {showRegFormSetting ? "🟢 Enabled (Open)" : "🔴 Hidden (Disabled)"}
                  </div>
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                    border: "1.5px solid #fed7aa",
                    borderRadius: "12px",
                    padding: "14px 18px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#9a3412", textTransform: "uppercase" }}>
                    Admin WhatsApp Phone
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#7c2d12", marginTop: "6px" }}>
                    +{adminWaNumber}
                  </div>
                </div>
              </div>

              {/* 🛡️ Section 1: Visibility of Sidebar & Home Screen Pages */}
              <div
                style={{
                  background: "#ffffff",
                  border: "2px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontSize: "1.1rem", fontWeight: "700" }}>
                      🛡️ Visibility of Sidebar/Home Screen Pages
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#64748b" }}>
                      Check items to make them visible to students. Unchecked items are hidden across Sidebar, Home cards, and Student Settings.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleSelectAllPages}
                      style={{ padding: "6px 14px", fontSize: "12.5px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
                    >
                      ☑️ Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllPages}
                      style={{ padding: "6px 14px", fontSize: "12.5px", background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
                    >
                      ⬜ Deselect All
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPageVisibility}
                      style={{ padding: "6px 14px", fontSize: "12.5px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
                    >
                      🔄 Reset Defaults
                    </button>
                  </div>
                </div>

                {/* Grid of Page Checkbox Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                  {ALL_CONFIGURABLE_PAGES.map((page) => {
                    const isEnabled = adminEnabledPages.includes(page.id);
                    return (
                      <div
                        key={page.id}
                        onClick={() => handleTogglePageVisibility(page.id)}
                        style={{
                          background: isEnabled ? "#f8fafc" : "#fafafa",
                          border: isEnabled ? "1.5px solid #3b82f6" : "1px dashed #cbd5e1",
                          borderRadius: "10px",
                          padding: "12px 14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          opacity: isEnabled ? 1 : 0.65,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "1.5rem" }}>{page.icon}</span>
                          <div>
                            <div style={{ fontSize: "0.92rem", fontWeight: "700", color: isEnabled ? "#0f172a" : "#64748b" }}>
                              {page.label}
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                              {page.desc}
                            </div>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => {}} // handled by parent div onClick
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#3b82f6",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🎓 Section 2: Student Registration Form Setting */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.8rem" }}>🎓</span>
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", color: "#1e293b", fontSize: "1rem", fontWeight: "700" }}>
                      Public Student Registration Form
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#64748b" }}>
                      Enable or disable the online registration form link on Home and Sidebar.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleShowRegForm(!showRegFormSetting)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "8px",
                      border: "none",
                      background: showRegFormSetting ? "#16a34a" : "#dc2626",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {showRegFormSetting ? "🟢 Form Enabled" : "🔴 Form Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareRegForm}
                    style={{ padding: "8px 14px", fontSize: "12.5px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>

              {/* 📱 Section 3: WhatsApp Admin Number Setting */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.8rem" }}>📱</span>
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", color: "#1e293b", fontSize: "1rem", fontWeight: "700" }}>
                      Guru / Admin WhatsApp Phone Number
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#64748b" }}>
                      Default number for student queries, registrations, and direct support.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ width: "180px", fontWeight: "700", color: "#166534" }}
                    value={adminWaNumber}
                    onChange={(e) => handleSaveAdminWaNumber(e.target.value)}
                    placeholder="919482094290"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === "messages" && (
            <div className="admin-card-body">
              {/* ⚡ Quick Message Template Loader Bar */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 100%)",
                  border: "1px solid #e9d5ff",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  boxShadow: "0 2px 8px rgba(107, 17, 112, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
                  <span style={{ fontSize: "1.4rem" }}>⚡</span>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#6b1170", marginBottom: "4px" }}>
                      Quick Template Loader:
                    </label>
                    <select
                      className="admin-input"
                      style={{ padding: "8px 12px", fontSize: "13.5px", background: "#ffffff", borderColor: "#d8b4fe", color: "#4c1d95", fontWeight: "600" }}
                      value={selectedTemplateId}
                      onChange={(e) => handleSelectTemplate(e.target.value)}
                    >
                      <option value="">-- Pick a Message Template --</option>
                      {templatesList.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          📋 {tpl.name} {tpl.description ? `(${tpl.description})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("templates")}
                  style={{
                    background: "#6b1170",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(107, 17, 112, 0.2)"
                  }}
                >
                  ⚙️ Manage Templates ({templatesList.length})
                </button>
              </div>

              <form onSubmit={handleCombinedSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label className="admin-label">Message Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={alertForm.title}
                    onChange={(e) =>
                      setAlertForm({ ...alertForm, title: e.target.value })
                    }
                    placeholder="Ex: Summer Special Class Announcement"
                    required
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="admin-label" style={{ margin: 0 }}>Message Body</label>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      కర్సర్ ఉన్న చోట అమర్చడానికి క్లిక్ చేయండి:
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                    {[
                      { tag: "{student_name}", label: "విద్యార్థి పేరు" },
                      { tag: "{first_name}", label: "పేరు" },
                      { tag: "{course}", label: "కోర్సు" },
                      { tag: "{batch_id}", label: "బ్యాచ్ ID" },
                    ].map((p) => (
                      <button
                        key={p.tag}
                        type="button"
                        onClick={() => insertPlaceholderAtCursor(p.tag, "msgBody")}
                        style={{
                          padding: "3px 8px",
                          fontSize: "11.5px",
                          fontFamily: "monospace",
                          fontWeight: "600",
                          background: "#e0f2fe",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        title={`${p.tag} (${p.label})`}
                      >
                        + {p.tag}
                      </button>
                    ))}
                    {customPlaceholders.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => insertPlaceholderAtCursor(`{${c.key}}`, "msgBody")}
                        style={{
                          padding: "3px 8px",
                          fontSize: "11.5px",
                          fontFamily: "monospace",
                          fontWeight: "600",
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        title={`{${c.key}} -> ${c.value}`}
                      >
                        + {`{${c.key}}`}
                      </button>
                    ))}
                  </div>

                  <textarea
                    ref={msgBodyTextareaRef}
                    className="admin-input"
                    rows="3"
                    value={alertForm.body}
                    onChange={(e) =>
                      setAlertForm({ ...alertForm, body: e.target.value })
                    }
                    placeholder="Ex: Detailed notes, rules, schedules etc..."
                    required
                  ></textarea>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <input
                      type="checkbox"
                      id="has_action_link"
                      checked={hasActionLink}
                      onChange={(e) => setHasActionLink(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <label htmlFor="has_action_link" style={{ margin: 0, cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#2c3e50" }}>
                      🔗 Add Action Link / Target URL
                    </label>
                  </div>
                  {hasActionLink && (
                    <input
                      type="text"
                      className="admin-input"
                      value={alertForm.url}
                      onChange={(e) =>
                        setAlertForm({ ...alertForm, url: e.target.value })
                      }
                      placeholder="Ex: https://..."
                      required={hasActionLink}
                    />
                  )}
                </div>

                {/* Live In-App Announcement Message Preview */}
                {(alertForm.title || alertForm.body) && (
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px dashed #cbd5e1", marginBottom: "20px" }}>
                    <span style={{ fontSize: "11.5px", color: "#6b1170", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      📢 Live Announcement Preview (Real Data & Custom Placeholders Replaced):
                    </span>
                    <div style={{ background: "#ffffff", border: "1px solid #e9d5ff", borderRadius: "10px", padding: "16px", boxShadow: "0 2px 8px rgba(107, 17, 112, 0.05)" }}>
                      {alertForm.title && (
                        <h4 style={{ margin: "0 0 8px 0", color: "#4c1d95", fontSize: "1.05rem", fontWeight: "700" }}>
                          {replaceMessagePlaceholders(alertForm.title, students[0] || null)}
                        </h4>
                      )}
                      {alertForm.body && (
                        <div style={{ fontSize: "13.5px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                          {replaceMessagePlaceholders(alertForm.body, students[0] || null)}
                        </div>
                      )}
                      {hasActionLink && alertForm.url && (
                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f1f5f9", fontSize: "12.5px", color: "#6b1170", fontWeight: "600" }}>
                          🔗 Action Link: <span style={{ textDecoration: "underline" }}>{replaceMessagePlaceholders(alertForm.url, students[0] || null)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Behavior Settings */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "#fff5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #fed7d7",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="force_refresh"
                    checked={forceRefresh}
                    onChange={(e) => setForceRefresh(e.target.checked)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#e53e3e",
                      margin: 0,
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="force_refresh"
                    style={{
                      margin: 0,
                      cursor: "pointer",
                      color: "#c53030",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    ⚡ Perform Hard Refresh on Dismiss (forces reload to fetch new code/fix blank screens)
                  </label>
                </div>

                {/* In-App message configurations */}
                <div style={{ background: "#f0f6ff", padding: "20px 15px", borderRadius: "8px", border: "1px solid #d4e6f1", marginBottom: "25px" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#2980b9", fontSize: "14.5px" }}>In-App Message Settings</h4>
                  <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label" style={{ color: "#2c3e50" }}>Start Date</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={inAppDates.startDate}
                        onChange={(e) =>
                          setInAppDates({ ...inAppDates, startDate: e.target.value })
                        }
                        required={true}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label" style={{ color: "#2c3e50" }}>End Date</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={inAppDates.endDate}
                        onChange={(e) =>
                          setInAppDates({ ...inAppDates, endDate: e.target.value })
                        }
                        required={true}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="in_app_active_combined"
                      checked={inAppDates.isActive}
                      onChange={(e) =>
                        setInAppDates({ ...inAppDates, isActive: e.target.checked })
                      }
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#2980b9" }}
                    />
                    <label htmlFor="in_app_active_combined" style={{ margin: 0, cursor: "pointer", fontWeight: "600", fontSize: "13.5px", color: "#2980b9" }}>
                      🚀 Set In-App Message as Active (visible immediately if today is within dates)
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    disabled={loading || loadingInApp}
                    className="admin-btn"
                    style={{ flex: 1 }}
                  >
                    {loading || loadingInApp ? "Processing..." : isEditingInApp ? "💾 Save Changes" : "🚀 Send / Publish Message"}
                  </button>
                  {isEditingInApp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingInApp(false);
                        setAlertForm({
                          title: "",
                          body: "",
                          url: import.meta.env.BASE_URL,
                          is_important: false,
                        });
                        setDeliveryChannels({ inApp: true, push: false });
                        setInAppFormId("");
                        setInAppDates({
                          startDate: new Date().toISOString().split("T")[0],
                          endDate: (() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 7);
                            return d.toISOString().split("T")[0];
                          })(),
                          isActive: true,
                        });
                      }}
                      className="admin-btn"
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "auto"
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* List of Messages */}
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#34495e", fontSize: "16px", marginBottom: "15px" }}>Current In-App Messages</h3>
                {inAppMessages.length === 0 ? (
                  <p style={{ color: "#7f8c8d", fontSize: "14px", fontStyle: "italic" }}>No in-app messages created yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {inAppMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          padding: "15px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: msg.isActive ? "#fcf8f2" : "#f8f9fa",
                          opacity: msg.isActive ? 1 : 0.7,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <div>
                            <span
                              style={{
                                background: msg.isActive ? "#e67e22" : "#7f8c8d",
                                color: "#fff",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                marginRight: "8px",
                              }}
                            >
                              {msg.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                            <span style={{ fontSize: "12px", color: "#7f8c8d" }}>
                              📅 {msg.startDate} to {msg.endDate}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => handleEditCombined(msg)}
                              style={{
                                background: "#3498db",
                                color: "#fff",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteInApp(msg.id)}
                              style={{
                                background: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        <h4 style={{ margin: "5px 0", color: "#2c3e50" }}>{msg.title}</h4>
                        <p style={{ margin: 0, fontSize: "13.5px", color: "#555", whiteSpace: "pre-wrap" }}>{msg.body}</p>
                        {msg.url && (
                          <div style={{ marginTop: "8px", fontSize: "12px" }}>
                            🔗 Link: <a href={msg.url} target="_blank" rel="noreferrer" style={{ color: "#8e44ad" }}>{msg.url}</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TICKERS TAB ── */}
          {activeTab === "tickers" && (
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
                      value={tickerForm.startDate?.substring(0, 10) || ""}
                      onChange={e => setTickerForm(prev => ({ ...prev, startDate: e.target.value }))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "bold", marginBottom: "4px" }}>End Date (IST):</label>
                    <input
                      type="date"
                      value={tickerForm.endDate?.substring(0, 10) || ""}
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
                      const updatesArr = tickerUpdatesText.split('\n').map(s => s.trim()).filter(Boolean);
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
          )}

          {/* ── BATCHES & LESSONS TAB ── */}
          {activeTab === "lessons" && (
            <div className="admin-card-body">
              {/* ── Sub Tabs (Batches | Lessons) ── */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => { setLessonSubTab("batches"); if (batchesList.length === 0) fetchBatchesList(); }}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: lessonSubTab === "batches" ? "#8e44ad" : "#f1f5f9",
                    color: lessonSubTab === "batches" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: lessonSubTab === "batches" ? "0 2px 6px rgba(142, 68, 173, 0.2)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  👥 Batches ({batchesList.length})
                </button>

                <button
                  type="button"
                  onClick={() => setLessonSubTab("lessons")}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: lessonSubTab === "lessons" ? "#8e44ad" : "#f1f5f9",
                    color: lessonSubTab === "lessons" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: lessonSubTab === "lessons" ? "0 2px 6px rgba(142, 68, 173, 0.2)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  📖 Lessons ({lessons.length})
                </button>
              </div>

              {/* ── 1. BATCHES SUB-TAB ── */}
              {lessonSubTab === "batches" && (
                <div>
                  <form onSubmit={handleSaveBatch} style={{ marginBottom: "25px", background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#2c3e50" }}>
                      {isEditingBatch ? "✏️ Edit Batch" : "➕ Create New Batch"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      <div>
                        <label className="admin-label">Batch ID *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. JK-2026-OCT"
                          value={batchForm.id}
                          disabled={isEditingBatch}
                          onChange={(e) => setBatchForm({ ...batchForm, id: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-label">Batch Name *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Jyotisha Kannada - October 2026 Batch"
                          value={batchForm.name}
                          onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-label">Language *</label>
                        <select
                          className="admin-input"
                          value={batchForm.language || "Kannada"}
                          onChange={(e) => setBatchForm({ ...batchForm, language: e.target.value })}
                        >
                          <option value="Kannada">Kannada</option>
                          <option value="Telugu">Telugu</option>
                          <option value="English">English</option>
                          <option value="Sanskrit">Sanskrit</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      <div>
                        <label className="admin-label">Start Date</label>
                        <input
                          type="date"
                          className="admin-input"
                          value={batchForm.start_date || ""}
                          onChange={(e) => setBatchForm({ ...batchForm, start_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">End Date</label>
                        <input
                          type="date"
                          className="admin-input"
                          value={batchForm.end_date || ""}
                          onChange={(e) => setBatchForm({ ...batchForm, end_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Status</label>
                        <select
                          className="admin-input"
                          value={batchForm.status || (batchForm.isActive !== false ? "active" : "inactive")}
                          onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value, isActive: e.target.value === "active" })}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      <div>
                        <label className="admin-label">WhatsApp Group Link (Optional)</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://chat.whatsapp.com/..."
                          value={batchForm.whatsapp_group_link || ""}
                          onChange={(e) => setBatchForm({ ...batchForm, whatsapp_group_link: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Google Meet Link (Optional)</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://meet.google.com/..."
                          value={batchForm.google_meet_link || ""}
                          onChange={(e) => setBatchForm({ ...batchForm, google_meet_link: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label className="admin-label">Remarks / Description (Optional)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Regular Kannada Jyotisha batch"
                        value={batchForm.remarks || ""}
                        onChange={(e) => setBatchForm({ ...batchForm, remarks: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" className="admin-btn admin-btn-success" style={{ padding: "8px 20px" }}>
                        {isEditingBatch ? "Update Batch" : "Save Batch"}
                      </button>
                      {isEditingBatch && (
                        <button
                          type="button"
                          className="admin-btn"
                          style={{ background: "#7f8c8d", padding: "8px 16px" }}
                          onClick={() => {
                            setBatchForm({ id: "", name: "", language: "Kannada", start_date: "", end_date: "", remarks: "", whatsapp_group_link: "", google_meet_link: "", status: "active", isActive: true });
                            setIsEditingBatch(false);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <h3 style={{ color: "#2c3e50", fontSize: "16px", marginBottom: "14px" }}>Available Batches</h3>
                  {batchesList.length === 0 ? (
                    <p style={{ color: "#7f8c8d" }}>No batches created yet.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
                      {batchesList.map((b) => (
                        <div key={b.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              🌐 {b.language || "Kannada"}
                            </span>
                            <span style={{ background: (b.status === "active" || b.isActive !== false) ? "#d1fae5" : "#fee2e2", color: (b.status === "active" || b.isActive !== false) ? "#047857" : "#b91c1c", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              {((b.status || (b.isActive !== false ? "active" : "inactive"))).toUpperCase()}
                            </span>
                          </div>
                          <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>{b.name}</h4>
                          <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 8px 0" }}>ID: <strong>{b.id}</strong></p>
                          {b.remarks && (
                            <p style={{ fontSize: "0.82rem", color: "#475569", margin: "0 0 8px 0", fontStyle: "italic" }}>
                              {b.remarks}
                            </p>
                          )}
                          {(b.start_date || b.end_date) && (
                            <p style={{ fontSize: "0.8rem", color: "#475569", margin: "0 0 10px 0" }}>
                              📅 {b.start_date || "N/A"} to {b.end_date || "N/A"}
                            </p>
                          )}
                          {b.whatsapp_group_link && (
                            <p style={{ fontSize: "0.8rem", margin: "0 0 8px 0" }}>
                              💬 Group: <a href={b.whatsapp_group_link} target="_blank" rel="noreferrer" style={{ color: "#059669", fontWeight: "bold" }}>Open WhatsApp Link</a>
                            </p>
                          )}
                          {b.google_meet_link && (
                            <p style={{ fontSize: "0.8rem", margin: "0 0 12px 0" }}>
                              📹 Meet: <a href={b.google_meet_link} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: "bold" }}>Open Google Meet</a>
                            </p>
                          )}

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => handleEditBatch(b)}
                              style={{ padding: "4px 10px", fontSize: "12px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBatchClick(b.id)}
                              style={{ padding: "4px 10px", fontSize: "12px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── 2. LESSONS SUB-TAB ── */}
              {lessonSubTab === "lessons" && (
                <>
                  {/* Add / Edit Lesson Form */}
                  <form onSubmit={handleSaveLesson} style={{ marginBottom: "30px", background: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#2c3e50" }}>
                      {editingLessonId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                      <div>
                        <label className="admin-label">Playlist / Batch Name</label>
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
                          <option value="">-- Select Batch / Playlist --</option>
                          {batchesList.map((b) => (
                            <option key={b.id} value={b.name || b.id}>
                              👥 Batch: {b.name} ({b.id})
                            </option>
                          ))}
                          {uniquePlaylists.filter(p => !batchesList.some(b => (b.name === p || b.id === p))).map((p) => (
                            <option key={p} value={p}>
                              📺 Playlist: {p}
                            </option>
                          ))}
                          <option value="__NEW__">➕ Create Custom Playlist...</option>
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
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px", background: "#eafaf1", padding: "15px", borderRadius: "8px", border: "1px solid #b9e7c9", alignItems: "center" }}>
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
                                  <button
                                    type="button"
                                    onClick={() => handleOpenShareLessonModal(lesson)}
                                    className="admin-btn"
                                    style={{ padding: "5px 10px", fontSize: "12px", background: "#27ae60", color: "#fff", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                    title="వాట్సాప్ ద్వారా షేర్ చేయండి"
                                  >
                                    Share
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
                </>
              )}
            </div>
          )}

          {/* ── E-LIBRARY TAB ── */}
          {activeTab === "library" && (
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
                        setBookForm({
                          title: "", author: "", language: "", subject: "",
                          subcategory: "", description: "", sourceType: "archive",
                          thumbnail: "", readLink: "", pdfLink: "",
                          createdDate: new Date().toISOString().split("T")[0], isVisibility: true
                        });
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
          )}

          {/* ── STUDENTS TAB ── */}
          {activeTab === "students" && (
            <div className="admin-card-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                  marginBottom: "20px",
                  paddingBottom: "15px",
                  borderBottom: "1px solid #e9ecef",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "1.3rem" }}>
                    🎓 Registered Students Directory
                  </h3>
                  <p style={{ margin: "4px 0 0 0", color: "#7f8c8d", fontSize: "13.5px" }}>
                    Manage and view all enrolled students.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  {/* Display Registration Form Toggle Checkbox */}
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: showRegFormSetting ? "#ecfdf5" : "#fef2f2",
                      border: showRegFormSetting ? "1.5px solid #10b981" : "1.5px solid #ef4444",
                      color: showRegFormSetting ? "#065f46" : "#991b1b",
                      padding: "7px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "700",
                      userSelect: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease",
                    }}
                    title="Enable or disable Student Registration Form across Sidebar, Home screen, and URL"
                  >
                    <input
                      type="checkbox"
                      checked={showRegFormSetting}
                      onChange={(e) => handleToggleShowRegForm(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#10b981" }}
                    />
                    <span>Display Registration form</span>
                  </label>

                  {/* Admin WhatsApp Number Field */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#f8fafc",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12.5px"
                    }}
                    title="Set Admin WhatsApp Number (e.g. 919876543210) for receiving student registration notifications"
                  >
                    <span style={{ color: "#475569", fontWeight: "700" }}>📱 Admin WA:</span>
                    <input
                      type="text"
                      placeholder="e.g. 919876543210"
                      value={adminWaNumber}
                      onChange={(e) => handleSaveAdminWaNumber(e.target.value)}
                      style={{
                        width: "130px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "1px solid #94a3b8",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Share Form Button (Placed right before + Add button) */}
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={handleShareRegForm}
                    style={{
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      padding: "9px 15px",
                      fontSize: "13px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)"
                    }}
                    title="Copy Student Registration Form URL to clipboard"
                  >
                    🔗 Share Form
                  </button>

                  <button
                    type="button"
                    className="admin-btn admin-btn-success"
                    onClick={openAddModal}
                    style={{ padding: "9px 15px", fontSize: "13px" }}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={fetchStudentsList}
                    disabled={loadingStudents}
                    style={{ background: "#34495e", padding: "9px 15px", fontSize: "13px" }}
                  >
                    {loadingStudents ? "Loading..." : "Refresh"}
                  </button>
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={exportStudentsCSV}
                    disabled={students.length === 0}
                    style={{ background: "#2980b9", padding: "9px 15px", fontSize: "13px" }}
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="🔍 Search by name, WhatsApp, ID, course, language..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ marginBottom: "14px" }}
                />

                {/* Status Filter Pills Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                    padding: "6px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                >
                  {[
                    { id: "ALL", label: "ALL", count: countAll, bg: "#5c5cfd" },
                    { id: "PENDING", label: "PENDING", count: countPending, bg: "#d97706" },
                    { id: "APPROVED", label: "APPROVED", count: countApproved, bg: "#059669" },
                    { id: "DEACTIVATED", label: "DEACTIVATED", count: countDeactivated, bg: "#dc2626" },
                  ].map((tab) => {
                    const active = studentStatusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStudentStatusFilter(tab.id)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: active ? "none" : "1px solid #e2e8f0",
                          background: active ? tab.bg : "#ffffff",
                          color: active ? "#ffffff" : "#475569",
                          fontWeight: active ? "700" : "600",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          boxShadow: active ? "0 2px 6px rgba(0, 0, 0, 0.15)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <span>{tab.label}</span>
                        <span
                          style={{
                            background: active ? "rgba(255, 255, 255, 0.25)" : "#f1f5f9",
                            color: active ? "#ffffff" : "#64748b",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "1px 6px",
                            borderRadius: "10px",
                            minWidth: "16px",
                            textAlign: "center",
                          }}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredStudents.length > 0 ? (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>WhatsApp</th>
                        <th>Language</th>
                        <th>Assigned Batches</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Time</th>
                        <th style={{ minWidth: "220px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => {
                        const cleanWa = (student.whatsapp_number || "").replace(/[^0-9]/g, "");
                        const fullWa = `${student.country_code || "+91"} ${student.whatsapp_number || ""}`;
                        const waLink = cleanWa ? `https://wa.me/${cleanWa}` : null;
                        const stuBatches = Array.isArray(student.batches) && student.batches.length > 0
                          ? student.batches
                          : (student.batch_id ? [student.batch_id] : (Array.isArray(student.courses) ? student.courses : [student.courses]));
                        return (
                          <tr key={student.id || student.whatsapp_number}>
                            <td>
                              <strong style={{ color: "#8e44ad", fontSize: "13px" }}>
                                {student.id || "STU-NEW"}
                              </strong>
                            </td>
                            <td><strong>{student.first_name} {student.last_name}</strong></td>
                            <td>
                              <span>{fullWa}</span>
                            </td>
                            <td>
                              <span style={{ background: "#fcf3cf", color: "#7d6608", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                                {student.language}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {stuBatches.filter(Boolean).map((bId) => {
                                  const bObj = batchesList.find(b => b.id === bId || b.name === bId);
                                  const label = bObj?.name || bId;
                                  return (
                                    <span
                                      key={bId}
                                      style={{
                                        background: "#f3e8ff",
                                        color: "#6b21a8",
                                        padding: "3px 8px",
                                        borderRadius: "6px",
                                        fontSize: "11.5px",
                                        fontWeight: "700",
                                        border: "1px solid #e9d5ff",
                                        display: "inline-block"
                                      }}
                                      title={`Batch ID: ${bObj?.id || bId}`}
                                    >
                                      🏷️ {label}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td>
                              {(() => {
                                const st = student.status || "pending";
                                let bg = "#fef9e7", col = "#b7950b";
                                if (st === "activated") { bg = "#e8f8f5"; col = "#117864"; }
                                else if (st === "deactivated") { bg = "#fadbd8"; col = "#78281f"; }
                                return (
                                  <span style={{ background: bg, color: col, padding: "3px 8px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "700", textTransform: "capitalize" }}>
                                    {st}
                                  </span>
                                );
                              })()}
                            </td>
                            <td>{student.email || "-"}</td>
                            <td style={{ fontSize: "12px", color: "#7f8c8d" }}>
                              {student.created_at ? new Date(student.created_at).toLocaleString() : "-"}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ padding: "3px 8px", fontSize: "11.5px", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer", background: "#25D366", color: "#fff", textDecoration: "none", display: "inline-block" }}
                                    title="Chat on WhatsApp"
                                  >
                                    Chat
                                  </a>
                                )}
                                {(student.status === "pending" || !student.status) && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveStudent(student.id)}
                                    style={{ padding: "3px 8px", fontSize: "11.5px", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer", background: "#27ae60", color: "#fff" }}
                                    title="Approve student"
                                  >
                                    Approve
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openEditModal(student)}
                                  style={{ padding: "3px 8px", fontSize: "11.5px", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer", background: "#3498db", color: "#fff" }}
                                  title="Edit student details"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStudentStatus(student.id, student.status)}
                                  style={{ padding: "3px 8px", fontSize: "11.5px", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer", background: student.status === "deactivated" ? "#27ae60" : "#e67e22", color: "#fff" }}
                                  title={student.status === "deactivated" ? "Activate student" : "Deactivate student"}
                                >
                                  {student.status === "deactivated" ? "Activate" : "Deactivate"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(student.id)}
                                  style={{ padding: "3px 8px", fontSize: "11.5px", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer", background: "#e74c3c", color: "#fff" }}
                                  title="Delete student permanently"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#7f8c8d" }}>
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}>🎓</span>
                  {loadingStudents ? "Loading students..." : studentSearch ? "No students matched your search." : "No registered students yet. Click Refresh to load."}
                </div>
              )}
            </div>
          )}

          {/* ── WHATSAPP DIRECT TAB ── */}
          {activeTab === "whatsapp" && (
            <div className="admin-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.35rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🟢</span> Direct WhatsApp Messaging
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "#64748b" }}>
                    Send direct WhatsApp messages to individual students or share announcements to WhatsApp groups with 100% free deep links.
                  </p>
                </div>
                <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "700", border: "1px solid #86efac" }}>
                  ✓ 100% Free wa.me Deep Links
                </span>
              </div>

              {/* Mode Selection Tabs (Individual vs Batch) */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => setWaTargetMode("individual")}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: waTargetMode === "individual" ? "#059669" : "#f1f5f9",
                    color: waTargetMode === "individual" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: waTargetMode === "individual" ? "0 2px 6px rgba(5, 150, 105, 0.25)" : "none"
                  }}
                >
                  👤 Specific Student
                </button>
                <button
                  type="button"
                  onClick={() => setWaTargetMode("batch")}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: waTargetMode === "batch" ? "#059669" : "#f1f5f9",
                    color: waTargetMode === "batch" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: waTargetMode === "batch" ? "0 2px 6px rgba(5, 150, 105, 0.25)" : "none"
                  }}
                >
                  👥 Specific Batch Group
                </button>
              </div>

              {/* Mode 1: Individual Student */}
              {waTargetMode === "individual" && (
                <div style={{ display: "grid", gap: "20px" }}>
                  {/* Searchable Student Selector */}
                  <div style={{ position: "relative" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Select Student * (Type to search by Name, Phone, ID or Batch)
                    </label>

                    {(() => {
                      const selectedStu = students.find(s => (s.id || s.whatsapp_number) === selectedWaStudentId);

                      if (selectedStu) {
                        const formatted = formatWhatsAppPhone(selectedStu.whatsapp_number, selectedStu.country_code);
                        return (
                          <div style={{ padding: "14px 18px", background: "#f0fdf4", border: "2px solid #86efac", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", boxShadow: "0 2px 8px rgba(22, 101, 52, 0.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "800" }}>
                                👤
                              </div>
                              <div>
                                <h4 style={{ margin: 0, color: "#166534", fontSize: "1rem", fontWeight: "700" }}>
                                  {selectedStu.first_name} {selectedStu.last_name}
                                </h4>
                                <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap", fontSize: "12.5px" }}>
                                  <span style={{ color: "#15803d", fontWeight: "600" }}>📱 +{formatted}</span>
                                  <span style={{ color: "#047857", background: "#bbf7d0", padding: "1px 6px", borderRadius: "4px", fontWeight: "700", fontSize: "11px" }}>
                                    ID: {selectedStu.id || "STU"}
                                  </span>
                                  {selectedStu.batch_id && (
                                    <span style={{ color: "#4c1d95", background: "#f3e8ff", padding: "1px 6px", borderRadius: "4px", fontWeight: "700", fontSize: "11px" }}>
                                      Batch: {selectedStu.batch_id}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedWaStudentId("");
                                setWaStudentSearch("");
                                setIsWaSearchDropdownOpen(true);
                              }}
                              style={{ padding: "6px 14px", fontSize: "12.5px", background: "#ffffff", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "8px", cursor: "pointer", fontWeight: "700", transition: "all 0.2s" }}
                            >
                              ✕ Change Student
                            </button>
                          </div>
                        );
                      }

                      // Filter students based on search input
                      const filteredStudents = students.filter(s => {
                        const term = waStudentSearch.toLowerCase().trim();
                        if (!term) return true;
                        const fullName = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
                        const phone = (s.whatsapp_number || "").toLowerCase();
                        const fullPhone = (s.full_phone || "").toLowerCase();
                        const id = (s.id || "").toLowerCase();
                        const batch = (s.batch_id || "").toLowerCase();
                        return fullName.includes(term) || phone.includes(term) || fullPhone.includes(term) || id.includes(term) || batch.includes(term);
                      });

                      return (
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              className="admin-input"
                              placeholder="🔍 Type student name, phone number, ID or batch (e.g. Srikanth, 94820)..."
                              value={waStudentSearch}
                              onFocus={() => setIsWaSearchDropdownOpen(true)}
                              onChange={(e) => {
                                setWaStudentSearch(e.target.value);
                                setIsWaSearchDropdownOpen(true);
                              }}
                              style={{ paddingRight: "40px", background: "#ffffff", borderColor: "#cbd5e1" }}
                            />
                            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none", fontSize: "14px" }}>
                              ▼
                            </span>
                          </div>

                          {/* Filtered Dropdown Results List */}
                          {isWaSearchDropdownOpen && (
                            <>
                              <div
                                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                                onClick={() => setIsWaSearchDropdownOpen(false)}
                              ></div>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  right: 0,
                                  marginTop: "6px",
                                  background: "#ffffff",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "12px",
                                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                                  maxHeight: "280px",
                                  overflowY: "auto",
                                  zIndex: 100,
                                }}
                              >
                                {filteredStudents.length === 0 ? (
                                  <div style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic", fontSize: "13px" }}>
                                    No students matching "{waStudentSearch}"
                                  </div>
                                ) : (
                                  filteredStudents.map((s) => {
                                    const formatted = formatWhatsAppPhone(s.whatsapp_number, s.country_code);
                                    return (
                                      <div
                                        key={s.id || s.whatsapp_number}
                                        onClick={() => {
                                          setSelectedWaStudentId(s.id || s.whatsapp_number);
                                          setIsWaSearchDropdownOpen(false);
                                        }}
                                        style={{
                                          padding: "12px 16px",
                                          borderBottom: "1px solid #f1f5f9",
                                          cursor: "pointer",
                                          transition: "background 0.15s",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = "#f0fdf4"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
                                      >
                                        <div>
                                          <strong style={{ color: "#0f172a", fontSize: "14px" }}>
                                            {s.first_name} {s.last_name}
                                          </strong>
                                          <span style={{ fontSize: "12.5px", color: "#166534", marginLeft: "10px", fontWeight: "600" }}>
                                            📱 +{formatted}
                                          </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                          <span style={{ fontSize: "11px", background: "#e2e8f0", color: "#475569", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                                            {s.id || "STU"}
                                          </span>
                                          {s.batch_id && (
                                            <span style={{ fontSize: "11px", background: "#f3e8ff", color: "#6b21a8", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                                              {s.batch_id}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Template Selector */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Use Reusable Message Template (Optional)
                    </label>
                    <select
                      className="admin-input"
                      value={selectedWaTemplateId}
                      onChange={(e) => handleSelectWaTemplateInComposer(e.target.value)}
                      style={{ background: "#ffffff" }}
                    >
                      <option value="">-- Custom Message (Type below) --</option>
                      {templatesList.map((t) => (
                        <option key={t.id} value={t.id}>
                          📋 {t.name} {t.description ? `(${t.description})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", margin: 0 }}>
                        Message Content *
                      </label>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        కర్సర్ ఉన్న చోట అమర్చడానికి క్లిక్ చేయండి:
                      </span>
                    </div>

                    <div style={{ marginTop: "6px", marginBottom: "8px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Insert Tag:</span>
                      {["first_name", "last_name", "student_name", "course", "batch_id", "whatsapp_number"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(`{${tag}}`, "wa")}
                          style={{ padding: "3px 8px", fontSize: "11.5px", background: "#f0fdf4", color: "#047857", border: "1px solid #86efac", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                          title={`{${tag}}`}
                        >
                          +{tag}
                        </button>
                      ))}
                      {customPlaceholders.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(`{${c.key}}`, "wa")}
                          style={{
                            padding: "3px 8px",
                            fontSize: "11.5px",
                            fontFamily: "monospace",
                            fontWeight: "600",
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          title={`{${c.key}} -> ${c.value}`}
                        >
                          + {`{${c.key}}`}
                        </button>
                      ))}
                    </div>

                    <textarea
                      ref={waTextareaRef}
                      rows="5"
                      className="admin-input"
                      value={waMessageText}
                      onChange={(e) => setWaMessageText(e.target.value)}
                      placeholder="Enter WhatsApp message..."
                      style={{ fontFamily: "inherit" }}
                    ></textarea>
                  </div>

                  {/* Live Message Preview */}
                  {selectedWaStudentId && waMessageText && (
                    <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                      <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                        💬 WhatsApp Live Message Preview (Real Data Replaced):
                      </span>
                      {(() => {
                        const selectedStu = students.find(s => (s.id || s.whatsapp_number) === selectedWaStudentId);
                        const previewMsg = replaceMessagePlaceholders(waMessageText, selectedStu);
                        return (
                          <div style={{ background: "#dcfce7", color: "#0f172a", padding: "14px 16px", borderRadius: "10px", fontSize: "13.5px", whiteSpace: "pre-line", border: "1px solid #86efac", lineHeight: 1.5 }}>
                            {previewMsg}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Launch WhatsApp Button */}
                  {(() => {
                    const selectedStu = students.find(s => (s.id || s.whatsapp_number) === selectedWaStudentId);
                    return (
                      <button
                        type="button"
                        disabled={!selectedStu}
                        onClick={() => handleOpenIndividualWhatsApp(selectedStu)}
                        style={{
                          padding: "14px",
                          borderRadius: "10px",
                          border: "none",
                          background: selectedStu ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#cbd5e1",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontSize: "15px",
                          cursor: selectedStu ? "pointer" : "not-allowed",
                          boxShadow: selectedStu ? "0 4px 12px rgba(5, 150, 105, 0.25)" : "none"
                        }}
                      >
                        🟢 Open WhatsApp Direct Chat (wa.me)
                      </button>
                    );
                  })()}
                </div>
              )}

              {/* Mode 2: Batch Group Broadcast */}
              {waTargetMode === "batch" && (
                <div style={{ display: "grid", gap: "20px" }}>
                  {/* Select Batch */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Select Batch Group *
                    </label>
                    <select
                      className="admin-input"
                      value={selectedWaBatchId}
                      onChange={(e) => setSelectedWaBatchId(e.target.value)}
                      style={{ background: "#ffffff", borderColor: "#cbd5e1" }}
                    >
                      <option value="">-- Select Batch --</option>
                      {batchesList.map((b) => {
                        const count = students.filter(s => isStudentInBatch(s, b)).length;
                        return (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.id}) — {count} Students
                          </option>
                        );
                      })}
                    </select>

                    {(() => {
                      const selectedBatch = batchesList.find(b => b.id === selectedWaBatchId);
                      if (!selectedBatch) return null;
                      return (
                        <div style={{ marginTop: "12px", padding: "12px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <strong style={{ color: "#1e40af", fontSize: "14px" }}>{selectedBatch.name} ({selectedBatch.id})</strong>
                            <span style={{ fontSize: "13px", color: "#1d4ed8", marginLeft: "10px" }}>Course: {selectedBatch.course_id}</span>
                          </div>
                          {selectedBatch.whatsapp_group_link && (
                            <a
                              href={selectedBatch.whatsapp_group_link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: "6px 14px", fontSize: "12.5px", background: "#059669", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "700" }}
                            >
                              🔗 Open Saved WhatsApp Group Chat
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Template Selector */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Use Reusable Message Template (Optional)
                    </label>
                    <select
                      className="admin-input"
                      value={selectedWaTemplateId}
                      onChange={(e) => handleSelectWaTemplateInComposer(e.target.value)}
                      style={{ background: "#ffffff" }}
                    >
                      <option value="">-- Custom Message (Type below) --</option>
                      {templatesList.map((t) => (
                        <option key={t.id} value={t.id}>
                          📋 {t.name} {t.description ? `(${t.description})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", margin: 0 }}>
                        Batch Announcement Message Content *
                      </label>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        కర్సర్ ఉన్న చోట అమర్చడానికి క్లిక్ చేయండి:
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                      {[
                        { tag: "{batch_name}", label: "బ్యాచ్ పేరు" },
                        { tag: "{batch_id}", label: "బ్యాచ్ ID" },
                        { tag: "{course_name}", label: "కోర్సు" },
                        { tag: "{whatsapp_group_link}", label: "గ్రూప్ లింక్" },
                        { tag: "{first_name}", label: "విద్యార్థి పేరు" },
                        { tag: "{student_name}", label: "పూర్తి పేరు" },
                      ].map((p) => (
                        <button
                          key={p.tag}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(p.tag, "wa")}
                          style={{
                            padding: "3px 8px",
                            fontSize: "11.5px",
                            fontFamily: "monospace",
                            fontWeight: "600",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            border: "1px solid #bae6fd",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          title={`${p.tag} (${p.label})`}
                        >
                          + {p.tag}
                        </button>
                      ))}
                      {customPlaceholders.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(`{${c.key}}`, "wa")}
                          style={{
                            padding: "3px 8px",
                            fontSize: "11.5px",
                            fontFamily: "monospace",
                            fontWeight: "600",
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          title={`{${c.key}} -> ${c.value}`}
                        >
                          + {`{${c.key}}`}
                        </button>
                      ))}
                    </div>

                    <textarea
                      ref={waTextareaRef}
                      rows="5"
                      className="admin-input"
                      value={waMessageText}
                      onChange={(e) => setWaMessageText(e.target.value)}
                      placeholder="Enter announcement message for the batch..."
                      style={{ fontFamily: "inherit" }}
                    ></textarea>
                  </div>

                  {/* Live Message Preview */}
                  {waMessageText && (
                    <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                      <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                        💬 WhatsApp Live Message Preview (Real Data Replaced):
                      </span>
                      {(() => {
                        const selectedBatch = batchesList.find(b => b.id === selectedWaBatchId);
                        const previewMsg = replaceMessagePlaceholders(waMessageText, null, selectedBatch);
                        return (
                          <div style={{ background: "#dcfce7", color: "#0f172a", padding: "14px 16px", borderRadius: "10px", fontSize: "13.5px", whiteSpace: "pre-line", border: "1px solid #86efac", lineHeight: 1.5 }}>
                            {previewMsg}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Batch Actions */}
                  <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "grid", gap: "14px" }}>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a" }}>
                      🚀 Choose Group Message Dispatch Method:
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                      <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h5 style={{ margin: "0 0 6px 0", color: "#059669", fontSize: "14px" }}>
                            📢 Method 1: Share to WhatsApp Group
                          </h5>
                          <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                            Opens WhatsApp Share window with pre-filled announcement. Select your WhatsApp group to post in 1-Click.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenGroupShareWhatsApp(batchesList.find(b => b.id === selectedWaBatchId))}
                          style={{ marginTop: "14px", padding: "10px", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13.5px" }}
                        >
                          📢 Share Message to WhatsApp Group
                        </button>
                      </div>

                      {(() => {
                        const selectedBatch = batchesList.find(b => b.id === selectedWaBatchId);
                        if (!selectedBatch?.whatsapp_group_link) return null;
                        return (
                          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                              <h5 style={{ margin: "0 0 6px 0", color: "#2563eb", fontSize: "14px" }}>
                                🔗 Method 2: Open Direct Group Chat
                              </h5>
                              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                                Launches the saved WhatsApp Group Link for <strong>{selectedBatch.name}</strong>.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => window.open(selectedBatch.whatsapp_group_link, "_blank")}
                              style={{ marginTop: "14px", padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13.5px" }}
                            >
                              🔗 Open Group Chat Room
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Member-by-Member Queue */}
                  {selectedWaBatchId && (() => {
                    const currentBatchObj = batchesList.find(b => b.id === selectedWaBatchId);
                    const batchStudents = students.filter(s => isStudentInBatch(s, currentBatchObj));
                    return (
                      <div style={{ marginTop: "10px" }}>
                        <h4 style={{ fontSize: "15px", color: "#0f172a", marginBottom: "12px" }}>
                          📋 Batch Members Direct Send Queue ({batchStudents.length} Students)
                        </h4>
                        <div style={{ display: "grid", gap: "8px" }}>
                          {batchStudents.map(st => {
                            const formatted = formatWhatsAppPhone(st.whatsapp_number, st.country_code);
                            return (
                              <div key={st.id || st.whatsapp_number} style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                <div>
                                  <strong style={{ color: "#334155" }}>{st.first_name} {st.last_name}</strong> ({st.id || "STU"})
                                  <span style={{ color: "#64748b", fontSize: "12.5px", marginLeft: "10px" }}>📱 +{formatted}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenIndividualWhatsApp(st, waMessageText)}
                                  style={{ padding: "6px 12px", background: "#25D366", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
                                >
                                  🟢 Send WhatsApp
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* WhatsApp Launch Audit History */}
              {waLog.length > 0 && (
                <div style={{ marginTop: "30px", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0, fontSize: "14px", color: "#475569" }}>📜 Recent WhatsApp Links Launched (Session History)</h4>
                    <button
                      type="button"
                      onClick={() => setWaLog([])}
                      style={{ padding: "3px 8px", fontSize: "11px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Clear Log
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto" }}>
                    {waLog.map((log, idx) => (
                      <div key={idx} style={{ fontSize: "12px", color: "#334155", background: "#ffffff", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                        <span style={{ color: "#64748b", fontWeight: "600" }}>[{log.time}]</span> <strong>{log.type}</strong> ➔ {log.target}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TEMPLATES TAB ── */}
          {activeTab === "templates" && (
            <div className="admin-card-body">
              {/* Header Bar */}
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📋</span> Reusable Message Templates
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
                  Manage pre-written notification and class reminder templates for WhatsApp and In-App messaging.
                </p>
              </div>

              {/* Action Toolbar Row */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "24px"
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTplForm({ id: "", name: "", title: "", content: "", description: "" });
                      setIsEditingTpl(false);
                      setShowManageTemplatesModal(true);
                    }}
                    className="admin-btn admin-btn-success"
                    style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "700" }}
                  >
                    ➕ Create New Template
                  </button>

                  <button
                    type="button"
                    onClick={() => document.getElementById("templates-import-file-input").click()}
                    className="admin-btn"
                    style={{ padding: "8px 14px", fontSize: "12.5px", background: "#3b82f6", color: "#ffffff", fontWeight: "600" }}
                  >
                    📥 Import Templates
                  </button>
                  <input
                    id="templates-import-file-input"
                    type="file"
                    accept=".json,.csv"
                    onChange={handleImportTemplatesFile}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    onClick={exportTemplatesJSON}
                    className="admin-btn"
                    style={{ padding: "8px 14px", fontSize: "12.5px", background: "#0284c7", color: "#ffffff", fontWeight: "600" }}
                  >
                    📤 Export Templates
                  </button>

                  <button
                    type="button"
                    onClick={() => document.getElementById("templates-placeholders-csv-input").click()}
                    className="admin-btn"
                    style={{ padding: "8px 14px", fontSize: "12.5px", background: "#6366f1", color: "#ffffff", fontWeight: "600" }}
                  >
                    📥 Import Placeholders
                  </button>
                  <input
                    id="templates-placeholders-csv-input"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCustomPlaceholdersCSVUpload}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    onClick={exportCustomPlaceholdersCSV}
                    className="admin-btn"
                    style={{ padding: "8px 14px", fontSize: "12.5px", background: "#8b5cf6", color: "#ffffff", fontWeight: "600" }}
                  >
                    📤 Export Placeholders
                  </button>
                </div>

                <div style={{ minWidth: "200px" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="🔍 Search templates..."
                    value={tplSearch}
                    onChange={(e) => setTplSearch(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Templates Cards Grid */}
              {(() => {
                const filtered = templatesList.filter(t =>
                  (t.name || "").toLowerCase().includes(tplSearch.toLowerCase()) ||
                  (t.description || "").toLowerCase().includes(tplSearch.toLowerCase()) ||
                  (t.content || "").toLowerCase().includes(tplSearch.toLowerCase()) ||
                  (t.id || "").toLowerCase().includes(tplSearch.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div style={{ textAlign: "center", padding: "50px 20px", color: "#64748b" }}>
                      <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>📋</span>
                      <h4 style={{ margin: "0 0 8px 0", color: "#334155" }}>
                        {tplSearch ? "No templates match your search query." : "No message templates created yet."}
                      </h4>
                      <p style={{ margin: 0, fontSize: "13.5px" }}>
                        Click <strong>"+ Create New Template"</strong> to add your first reusable message template.
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {filtered.map((tpl) => (
                      <div
                        key={tpl.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "20px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div>
                          {/* Card Top Badge & Actions */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ background: "#f3e8ff", color: "#6b21a8", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "6px", letterSpacing: "0.5px" }}>
                              {tpl.id}
                            </span>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                type="button"
                                onClick={() => handleEditTemplate(tpl)}
                                style={{ padding: "4px 10px", fontSize: "12px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                                title="Edit Template"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTemplateClick(tpl.id)}
                                style={{ padding: "4px 10px", fontSize: "12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                                title="Delete Template"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>

                          {/* Template Name & Description */}
                          <h4 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", color: "#1e1b4b", fontWeight: "700" }}>
                            {tpl.name}
                          </h4>
                          {tpl.description && (
                            <p style={{ margin: "0 0 12px 0", fontSize: "12.5px", color: "#64748b", fontStyle: "italic" }}>
                              🏷️ {tpl.description}
                            </p>
                          )}
                          {tpl.title && (
                            <div style={{ fontSize: "12px", color: "#4c1d95", fontWeight: "700", marginBottom: "8px", background: "#faf5ff", padding: "4px 8px", borderRadius: "6px", display: "inline-block" }}>
                              📌 Title: {tpl.title}
                            </div>
                          )}

                          {/* Content Box */}
                          <pre
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderRadius: "10px",
                              padding: "12px 14px",
                              fontSize: "13px",
                              color: "#334155",
                              whiteSpace: "pre-wrap",
                              fontFamily: "inherit",
                              margin: "8px 0 16px 0",
                              maxHeight: "160px",
                              overflowY: "auto",
                              lineHeight: 1.5,
                            }}
                          >
                            {tpl.content}
                          </pre>
                        </div>

                        {/* Quick Use Action Buttons */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              handleSelectTemplate(tpl.id);
                              setActiveTab("messages");
                            }}
                            style={{
                              padding: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#fdf4ff",
                              color: "#7e22ce",
                              border: "1px solid #e9d5ff",
                              borderRadius: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            ⚡ Use in Messages
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectWaTemplateInComposer(tpl.id);
                              setActiveTab("whatsapp");
                            }}
                            style={{
                              padding: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#f0fdf4",
                              color: "#15803d",
                              border: "1px solid #bbf7d0",
                              borderRadius: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            🟢 Use in WhatsApp
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── VOICE QUERY TOPICS TAB ── */}
          {activeTab === "voice_topics" && (
            <div className="admin-card-body">
              {/* Header Bar */}
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🎙️</span> Voice Query Topics & WhatsApp Settings
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
                  Customize the question categories shown to students in the <strong>e-Voice Query</strong> speech-to-text page.
                </p>
              </div>

              {/* Admin WhatsApp Number Config Box */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  border: "1.5px solid #fed7aa",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "280px" }}>
                  <span style={{ fontSize: "1.8rem" }}>📱</span>
                  <div>
                    <h4 style={{ margin: 0, color: "#9a3412", fontSize: "1rem", fontWeight: "700" }}>
                      Destination WhatsApp Number for Voice Queries
                    </h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "#c2410c" }}>
                      Students' dictated voice queries will be dispatched directly to this WhatsApp number.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ width: "170px", background: "#ffffff", fontWeight: "700", color: "#15803d" }}
                    value={adminWaNumber}
                    onChange={(e) => handleSaveAdminWaNumber(e.target.value)}
                    placeholder="919482094290"
                  />
                  <span style={{ fontSize: "12px", color: "#166534", fontWeight: "700", background: "#dcfce7", padding: "6px 12px", borderRadius: "8px" }}>
                    ✔️ Auto-Saved
                  </span>
                </div>
              </div>

              {/* Action Toolbar Row */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTopicForm({ id: "", name: "", icon: "🎓" });
                      setIsEditingVoiceTopic(false);
                    }}
                    className="admin-btn admin-btn-success"
                    style={{ background: "#d35400", borderColor: "#b84700" }}
                  >
                    ➕ Add New Query Topic
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadVoiceTopicsJSON}
                    className="admin-btn admin-btn-secondary"
                  >
                    📥 Download JSON
                  </button>
                  <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", margin: 0 }}>
                    📤 Import JSON
                    <input type="file" accept=".json" onChange={handleImportVoiceTopicsJSON} style={{ display: "none" }} />
                  </label>
                  <button
                    type="button"
                    onClick={handleResetVoiceTopics}
                    className="admin-btn admin-btn-secondary"
                    style={{ color: "#c0392b" }}
                  >
                    🔄 Reset Defaults
                  </button>
                </div>

                <div style={{ minWidth: "220px" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="🔍 Filter topics..."
                    value={voiceTopicFilter}
                    onChange={(e) => setVoiceTopicFilter(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Add / Edit Topic Form */}
              <div
                style={{
                  background: "#ffffff",
                  border: "2px solid #fdba74",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 16px rgba(211, 84, 0, 0.08)",
                }}
              >
                <h4 style={{ margin: "0 0 14px 0", color: "#8a3b24", fontSize: "1.05rem", fontWeight: "700" }}>
                  {isEditingVoiceTopic ? "✏️ Edit Query Topic" : "➕ Create New Query Topic"}
                </h4>

                <form onSubmit={handleSaveVoiceTopic}>
                  <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        Icon *
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ textAlign: "center", fontSize: "1.3rem" }}
                        value={voiceTopicForm.icon}
                        onChange={(e) => setVoiceTopicForm({ ...voiceTopicForm, icon: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        Topic Display Name * (English)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Navamsha Chart Analysis"
                        value={voiceTopicForm.name}
                        onChange={(e) => setVoiceTopicForm({ ...voiceTopicForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        Unique Identifier (ID)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. navamsha_analysis"
                        value={voiceTopicForm.id}
                        onChange={(e) => setVoiceTopicForm({ ...voiceTopicForm, id: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Quick Emoji Selection Chips */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Quick Icons:</span>
                    {["🎓", "📜", "⏳", "🪐", "⏰", "☸️", "🔄", "💞", "☀️", "🕉️", "🔮", "📖", "🌙", "⭐"].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setVoiceTopicForm({ ...voiceTopicForm, icon: em })}
                        style={{
                          background: voiceTopicForm.icon === em ? "#ffedd5" : "#f1f5f9",
                          border: voiceTopicForm.icon === em ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      className="admin-btn admin-btn-success"
                      style={{ background: "#d35400", borderColor: "#b84700", padding: "10px 24px" }}
                    >
                      {isEditingVoiceTopic ? "💾 Update Topic" : "➕ Add Topic"}
                    </button>
                    {isEditingVoiceTopic && (
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceTopicForm({ id: "", name: "", icon: "🎓" });
                          setIsEditingVoiceTopic(false);
                        }}
                        className="admin-btn admin-btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Topics Table / Cards Grid */}
              <div style={{ display: "grid", gap: "10px" }}>
                {voiceTopics
                  .filter((t) => !voiceTopicFilter || t.name.toLowerCase().includes(voiceTopicFilter.toLowerCase()) || t.id.toLowerCase().includes(voiceTopicFilter.toLowerCase()))
                  .map((topic, idx) => (
                    <div
                      key={topic.id || idx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <span style={{ fontSize: "1.8rem", width: "42px", height: "42px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                          {topic.icon || "🎓"}
                        </span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: "700" }}>
                            {topic.name}
                          </h4>
                          <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>
                            ID: {topic.id}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleMoveVoiceTopic(idx, -1)}
                          disabled={idx === 0}
                          style={{ padding: "6px 10px", fontSize: "12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}
                          title="Move Up"
                        >
                          ⬆️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveVoiceTopic(idx, 1)}
                          disabled={idx === voiceTopics.length - 1}
                          style={{ padding: "6px 10px", fontSize: "12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: idx === voiceTopics.length - 1 ? "default" : "pointer", opacity: idx === voiceTopics.length - 1 ? 0.4 : 1 }}
                          title="Move Down"
                        >
                          ⬇️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditVoiceTopic(topic)}
                          style={{ padding: "6px 12px", fontSize: "12.5px", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVoiceTopic(topic.id)}
                          style={{ padding: "6px 12px", fontSize: "12.5px", background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Student Add / Edit Modal ── */}
        {showAddStudentForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddStudentForm(false); }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 24px",
                  background: "linear-gradient(135deg, #4a154b 0%, #6b1170 100%)",
                  color: "#ffffff",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>{editingStudent ? "✏️" : "🎓"}</span>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", letterSpacing: "0.2px" }}>
                    {editingStudent ? `Edit Student — ${editingStudent.id}` : "Add New Student"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddStudentForm(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#ffffff",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px" }}>
                {stuFormErr && (
                  <div
                    style={{
                      background: "#fef2f2",
                      borderLeft: "4px solid #ef4444",
                      color: "#991b1b",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      fontSize: "13.5px",
                      fontWeight: "600",
                    }}
                  >
                    ⚠️ {stuFormErr}
                  </div>
                )}

                {/* Name Row */}
                <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                      First Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      value={stuForm.first_name}
                      onChange={(e) => setStuForm({ ...stuForm, first_name: e.target.value })}
                      placeholder="e.g. Bhavana"
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      value={stuForm.last_name}
                      onChange={(e) => setStuForm({ ...stuForm, last_name: e.target.value })}
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                {/* WhatsApp Row */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
                  <div style={{ width: "135px" }}>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                      Country Code
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "10px 10px",
                        fontSize: "13.5px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        boxSizing: "border-box",
                        fontWeight: "600",
                        color: "#475569",
                        background: "#ffffff",
                      }}
                      value={stuForm.country_code}
                      onChange={(e) => setStuForm({ ...stuForm, country_code: e.target.value })}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} {c.country.split(' ')[0]}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                      WhatsApp Number <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      value={stuForm.whatsapp_number}
                      onChange={(e) => setStuForm({ ...stuForm, whatsapp_number: e.target.value })}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Language Selector Cards */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "13px", color: "#334155" }}>
                    Preferred Language
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Kannada", "Telugu"].map((lang) => {
                      const selected = stuForm.language === lang;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            const langBatches = batchesList.filter(b => (b.language || "").toLowerCase() === lang.toLowerCase() && isBatchCurrentlyActive(b));
                            const nextBatchId = langBatches[0]?.id || "";
                            setStuForm({ ...stuForm, language: lang, batch_id: nextBatchId });
                          }}
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: selected ? "2px solid #6b1170" : "1px solid #cbd5e1",
                            background: selected ? "#fdf4ff" : "#f8fafc",
                            color: selected ? "#6b1170" : "#475569",
                            fontWeight: selected ? "700" : "600",
                            fontSize: "13.5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            boxShadow: selected ? "0 2px 8px rgba(107, 17, 112, 0.15)" : "none",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>{selected ? "✓" : "🌐"}</span>
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Multi-Batch Selection Section */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ display: "block", fontWeight: "700", fontSize: "13px", color: "#334155", margin: 0 }}>
                      Assigned Batches (Select One or More) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <span style={{ fontSize: "12px", color: "#6b1170", fontWeight: "700", background: "#f3e8ff", padding: "2px 8px", borderRadius: "10px" }}>
                      {(stuForm.batches || []).length} Selected
                    </span>
                  </div>

                  {batchesList.length === 0 ? (
                    <div style={{ padding: "12px", background: "#fef2f2", color: "#991b1b", borderRadius: "8px", fontSize: "13px" }}>
                      ⚠️ No batches created yet. Please create a batch first under Batches & Lessons tab.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", background: "#fafafa" }}>
                      {batchesList.map((b) => {
                        const isSelected = (stuForm.batches || []).includes(b.id);
                        const isLangMatch = (b.language || "").toLowerCase() === (stuForm.language || "").toLowerCase();
                        return (
                          <div
                            key={b.id}
                            onClick={() => {
                              const cur = stuForm.batches || [];
                              const next = isSelected ? cur.filter(id => id !== b.id) : [...cur, b.id];
                              setStuForm({
                                ...stuForm,
                                batches: next,
                                batch_id: next[0] || "",
                              });
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: isSelected ? "1.5px solid #6b1170" : "1px solid #e2e8f0",
                              background: isSelected ? "#fdf4ff" : "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#6b1170" }}
                              />
                              <div>
                                <strong style={{ fontSize: "13.5px", color: isSelected ? "#4a154b" : "#1e293b", display: "block" }}>
                                  {b.name || b.id}
                                </strong>
                                <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                                  ID: {b.id} {b.remarks ? `• ${b.remarks}` : ""}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", background: isLangMatch ? "#dbeafe" : "#f1f5f9", color: isLangMatch ? "#1d4ed8" : "#64748b" }}>
                                {b.language}
                              </span>
                              {b.isActive === false && (
                                <span style={{ fontSize: "10.5px", fontWeight: "700", padding: "2px 5px", borderRadius: "4px", background: "#fee2e2", color: "#dc2626" }}>
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    value={stuForm.email}
                    onChange={(e) => setStuForm({ ...stuForm, email: e.target.value })}
                    placeholder="student@example.com"
                  />
                </div>

                {/* Address */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", fontSize: "13px", color: "#334155" }}>
                    Address
                  </label>
                  <textarea
                    rows="2"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    value={stuForm.address}
                    onChange={(e) => setStuForm({ ...stuForm, address: e.target.value })}
                    placeholder="City, State, Country..."
                  ></textarea>
                </div>

                {/* Modal Action Buttons */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowAddStudentForm(false)}
                    style={{
                      padding: "10px 20px",
                      background: "#f1f5f9",
                      color: "#475569",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStudentModalSave}
                    disabled={stuSaving || !stuForm.batch_id}
                    style={{
                      padding: "10px 24px",
                      background: (stuSaving || !stuForm.batch_id) ? "#94a3b8" : "linear-gradient(135deg, #4a154b 0%, #6b1170 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: (stuSaving || !stuForm.batch_id) ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      boxShadow: (stuSaving || !stuForm.batch_id) ? "none" : "0 4px 12px rgba(107, 17, 112, 0.25)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {stuSaving ? "Saving..." : (editingStudent ? "Update Student" : "Save Student")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Manage Message Templates Modal ── */}
        {showManageTemplatesModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowManageTemplatesModal(false); }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 24px",
                  background: "linear-gradient(135deg, #6b1170 0%, #4a154b 100%)",
                  color: "#ffffff",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>📋</span>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700", color: "#ffffff" }}>
                    Manage Message Templates
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManageTemplatesModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#ffffff",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px" }}>
                {/* Form to Create/Edit Template */}
                <form onSubmit={handleSaveTemplateSubmit} style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
                  <h4 style={{ margin: "0 0 14px 0", color: "#4c1d95" }}>
                    {isEditingTpl ? `✏️ Edit Template (${tplForm.id})` : "➕ Create New Template"}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>Template Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Sunday Class Reminder"
                        value={tplForm.name}
                        onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>Announcement Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Sunday Class Reminder"
                        value={tplForm.title}
                        onChange={(e) => setTplForm({ ...tplForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>Description / Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. For Sunday live classes"
                      value={tplForm.description}
                      onChange={(e) => setTplForm({ ...tplForm, description: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12.5px", fontWeight: "700", margin: 0 }}>Message Content *</label>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>క్లిక్ చేసి కర్సర్ వద్ద అమర్చండి:</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" }}>
                      {["{title}", "{playlist}", "{videoId}", "{videoUrl}", "{pdfLink}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(tag, true)}
                          style={{
                            padding: "2px 7px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            fontWeight: "600",
                            background: "#ede9fe",
                            color: "#6d28d9",
                            border: "1px solid #ddd6fe",
                            borderRadius: "5px",
                            cursor: "pointer"
                          }}
                        >
                          + {tag}
                        </button>
                      ))}
                      {customPlaceholders.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => insertPlaceholderAtCursor(`{${c.key}}`, true)}
                          style={{
                            padding: "2px 7px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            fontWeight: "600",
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                            borderRadius: "5px",
                            cursor: "pointer"
                          }}
                          title={`Value: ${c.value}`}
                        >
                          + {`{${c.key}}`}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => document.getElementById("manage-tpl-placeholders-csv-file").click()}
                        style={{ padding: "6px 12px", fontSize: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "5px" }}
                      >
                        📥 Import Custom Placeholders CSV
                      </button>
                      <input
                        id="manage-tpl-placeholders-csv-file"
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleCustomPlaceholdersCSVUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                    <textarea
                      ref={tplTextareaRef}
                      rows="4"
                      className="admin-input"
                      placeholder="Enter announcement text body..."
                      value={tplForm.content}
                      onChange={(e) => setTplForm({ ...tplForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="admin-btn admin-btn-success" style={{ padding: "8px 18px" }}>
                      {isEditingTpl ? "Update Template" : "Save Template"}
                    </button>
                    {isEditingTpl && (
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ background: "#7f8c8d", padding: "8px 16px" }}
                        onClick={() => {
                          setTplForm({ id: "", name: "", title: "", content: "", description: "" });
                          setIsEditingTpl(false);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── SHARE LESSON MODAL ── */}
        {shareLessonModalData && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px"
            }}
            onClick={() => setShareLessonModalData(null)}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "24px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                      📚 {shareLessonModalData.playlist}
                    </span>
                    {shareLessonModalData.videoId && (
                      <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                        🎥 YouTube: {shareLessonModalData.videoId}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>
                    Share Lesson: {shareLessonModalData.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShareLessonModalData(null)}
                  style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748b", lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Template Selector */}
                <div>
                  <label className="admin-label" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155" }}>
                    Select Message Template (టెంప్లేట్ ఎంచుకోండి)
                  </label>
                  <select
                    className="admin-input"
                    value={shareLessonTemplateId}
                    onChange={(e) => handleSelectShareLessonTemplate(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    {templatesList.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                    ))}
                    <option value="custom">✍️ Custom Message (సొంత టెక్స్ట్)</option>
                  </select>
                </div>

                {/* Template Editor */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="admin-label" style={{ fontWeight: "600", color: "#334155", margin: 0 }}>
                      Edit Template Text / Placeholders
                    </label>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      కర్సర్ ఉన్న చోట అమర్చడానికి క్లిక్ చేయండి:
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                    {[
                      { tag: "{title}", label: "పాఠం పేరు" },
                      { tag: "{playlist}", label: "కోర్సు" },
                      { tag: "{videoId}", label: "వీడియో ID" },
                      { tag: "{videoUrl}", label: "యూట్యూబ్ లింక్" },
                      { tag: "{pdfLink}", label: "PDF నోట్స్" },
                    ].map((p) => (
                      <button
                        key={p.tag}
                        type="button"
                        onClick={() => insertPlaceholderAtCursor(p.tag, false)}
                        style={{
                          padding: "3px 8px",
                          fontSize: "11.5px",
                          fontFamily: "monospace",
                          fontWeight: "600",
                          background: "#e0f2fe",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        title={`${p.tag} (${p.label}) - కర్సర్ ఉన్న చోట అమర్చబడుతుంది`}
                      >
                        + {p.tag}
                      </button>
                    ))}
                    {customPlaceholders.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => insertPlaceholderAtCursor(`{${c.key}}`, false)}
                        style={{
                          padding: "3px 8px",
                          fontSize: "11.5px",
                          fontFamily: "monospace",
                          fontWeight: "600",
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        title={`{${c.key}} -> ${c.value}`}
                      >
                        + {`{${c.key}}`}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => document.getElementById("share-modal-placeholders-csv-file").click()}
                      style={{ padding: "5px 12px", fontSize: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      📥 Import Custom Placeholders CSV
                    </button>
                    <button
                      type="button"
                      onClick={exportCustomPlaceholdersCSV}
                      style={{ padding: "5px 12px", fontSize: "12px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      📤 Export Custom Placeholders CSV
                    </button>
                    <input
                      id="share-modal-placeholders-csv-file"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleCustomPlaceholdersCSVUpload}
                      style={{ display: "none" }}
                    />
                  </div>

                  <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => document.getElementById("share-modal-placeholders-csv-file").click()}
                      style={{ padding: "5px 12px", fontSize: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      📥 Import Custom Placeholders CSV
                    </button>
                    <input
                      id="share-modal-placeholders-csv-file"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleCustomPlaceholdersCSVUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <textarea
                    ref={shareTextareaRef}
                    rows="4"
                    className="admin-input"
                    value={shareLessonCustomText}
                    onChange={(e) => {
                      setShareLessonCustomText(e.target.value);
                      setShareLessonTemplateId("custom");
                    }}
                    style={{ fontFamily: "monospace", fontSize: "13px", padding: "10px", borderRadius: "8px" }}
                  />
                </div>

                {/* Live Message Preview */}
                <div>
                  <label className="admin-label" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#15803d" }}>
                    💬 Real-time WhatsApp Message Preview (ప్రత్యక్ష సమాచారం ప్రివ్యూ)
                  </label>
                  <div
                    style={{
                      background: "#e7f5e8",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                      padding: "14px",
                      color: "#14532d",
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                      fontSize: "13.5px",
                      lineHeight: "1.5",
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)"
                    }}
                  >
                    {formatLessonShareMessage(shareLessonCustomText, shareLessonModalData)}
                  </div>
                </div>

                {/* Target Student Picker */}
                <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <label className="admin-label" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155" }}>
                    Select Student for Individual Share (ఐచ్ఛికం - వ్యక్తిగత విద్యార్థి ఎంపిక)
                  </label>
                  <select
                    className="admin-input"
                    value={shareLessonStudentId}
                    onChange={(e) => setShareLessonStudentId(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px" }}
                  >
                    <option value="">-- Direct WhatsApp Share (No specific student selected) --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        👤 {s.first_name} {s.last_name} ({s.whatsapp_number || "No Phone"}) - {s.courses?.join(", ") || "No Course"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "8px" }}>
                  <button
                    type="button"
                    onClick={handleShareLessonGroup}
                    className="admin-btn"
                    style={{
                      flex: 1,
                      minWidth: "180px",
                      padding: "10px 16px",
                      background: "#25D366",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "13.5px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    💬 Share to WhatsApp Group / Chat
                  </button>

                  {shareLessonStudentId && (
                    <button
                      type="button"
                      onClick={handleShareLessonIndividual}
                      className="admin-btn"
                      style={{
                        padding: "10px 16px",
                        background: "#0284c7",
                        color: "#ffffff",
                        fontWeight: "700",
                        fontSize: "13.5px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      👤 Send to Student
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyShareLessonText}
                    className="admin-btn"
                    style={{
                      padding: "10px 16px",
                      background: shareLessonCopied ? "#16a34a" : "#475569",
                      color: "#ffffff",
                      fontWeight: "600",
                      fontSize: "13.5px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    {shareLessonCopied ? "✓ Copied!" : "📋 Copy Text"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
