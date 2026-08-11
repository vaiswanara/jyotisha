import React, { useState, useEffect } from "react";
import { API_URL, API_TOKEN, getLessons, saveLessons, getLibrary, saveLibrary, getTicker, saveTicker, getInAppMessages, saveInAppMessage, getStudents, addStudentAdmin, updateStudent, approveStudent, toggleStudentStatus, deleteStudent, getBatches, saveBatch, deleteBatch, getCourses, saveCourse, deleteCourse, getTemplates, saveTemplate, deleteTemplate } from "../services/astrologyApi.js";

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

  // Sub-tab for Course/Lessons Tab
  const [lessonSubTab, setLessonSubTab] = useState("lessons"); // "courses" | "batches" | "lessons"

  // Courses & Batches State
  const [coursesList, setCoursesList] = useState([]);
  const [courseForm, setCourseForm] = useState({ id: "", code: "", title: "", language: "Kannada", description: "" });
  const [isEditingCourse, setIsEditingCourse] = useState(false);

  const [batchesList, setBatchesList] = useState([]);
  const [batchForm, setBatchForm] = useState({ id: "", name: "", course_id: "Jyotisha", start_date: "", end_date: "", whatsapp_group_link: "", status: "active" });
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
      const bId = batchForm.id.trim() || `${batchForm.course_id}-${new Date().getFullYear()}`;
      const bData = { ...batchForm, id: bId };
      await saveBatch(bData);
      setMessage({ type: "success", text: `✅ Batch ${isEditingBatch ? 'updated' : 'created'} successfully!` });
      setBatchForm({ id: "", name: "", course_id: coursesList[0]?.id || "Jyotisha", start_date: "", end_date: "", whatsapp_group_link: "", status: "active" });
      setIsEditingBatch(false);
      fetchBatchesList();
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  const handleEditBatch = (b) => {
    setBatchForm(b);
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
      if (res && res.templates) setTemplatesList(res.templates);
    } catch (e) {
      console.warn("Failed to fetch templates:", e);
    }
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
    if (student.batch_id && student.batch_id === batch.id) return true;
    if (!student.batch_id && Array.isArray(student.courses) && batch.course_id) {
      return student.courses.includes(batch.course_id);
    }
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
    if (student) {
      const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim();
      result = result
        .replace(/\{student_name\}/g, fullName)
        .replace(/\{first_name\}/g, student.first_name || "")
        .replace(/\{last_name\}/g, student.last_name || "")
        .replace(/\{whatsapp_number\}/g, student.whatsapp_number || "")
        .replace(/\{language\}/g, student.language || "")
        .replace(/\{course\}/g, Array.isArray(student.courses) ? student.courses.join(", ") : (student.courses || ""))
        .replace(/\{batch_id\}/g, student.batch_id || "");
    }
    if (batch) {
      result = result
        .replace(/\{batch_name\}/g, batch.name || batch.id || "")
        .replace(/\{batch_id\}/g, batch.id || "")
        .replace(/\{course_name\}/g, batch.course_id || batch.course_name || "")
        .replace(/\{whatsapp_group_link\}/g, batch.whatsapp_group_link || "");
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
  const BLANK_STU = { first_name: "", last_name: "", whatsapp_number: "", country_code: "+91", language: "Kannada", courses: ["Jyotisha"], batch_id: "JK-2026-OCT", email: "", address: "" };

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

  const openAddModal = () => {
    setEditingStudent(null);
    setStuForm({
      ...BLANK_STU,
      batch_id: batchesList[0]?.id || "JK-2026-OCT"
    });
    setStuFormErr("");
    setShowAddStudentForm(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    const stuBatch = student.batch_id || (Array.isArray(student.batches) ? student.batches[0] : "") || (batchesList[0]?.id || "JK-2026-OCT");
    setStuForm({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      whatsapp_number: student.whatsapp_number || "",
      country_code: student.country_code || "+91",
      language: student.language || "Kannada",
      courses: Array.isArray(student.courses) ? [...student.courses] : ["Jyotisha"],
      batch_id: stuBatch,
      email: student.email || "",
      address: student.address || "",
    });
    setStuFormErr("");
    setShowAddStudentForm(true);
  };

  const handleStuCourseToggle = (course) => {
    setStuForm((prev) => {
      const nextCourses = prev.courses.includes(course)
        ? prev.courses.filter((c) => c !== course)
        : [...prev.courses, course];

      const primaryCourse = nextCourses[0] || "Jyotisha";
      const matchingBatch = batchesList.find(b =>
        b.course_id === primaryCourse || b.course_name === primaryCourse
      );
      return {
        ...prev,
        courses: nextCourses,
        batch_id: matchingBatch?.id || prev.batch_id || batchesList[0]?.id || ""
      };
    });
  };

  const handleStudentModalSave = async () => {
    if (!stuForm.first_name.trim()) { setStuFormErr("First Name is required."); return; }
    if (!stuForm.last_name.trim()) { setStuFormErr("Last Name is required."); return; }
    if (!stuForm.whatsapp_number.trim()) { setStuFormErr("WhatsApp number is required."); return; }
    if (stuForm.courses.length === 0) { setStuFormErr("Select at least one course."); return; }
    if (!stuForm.batch_id) { setStuFormErr("Please select an assigned batch."); return; }

    setStuSaving(true);
    setStuFormErr("");
    try {
      if (editingStudent) {
        await updateStudent({ student_id: editingStudent.id, ...stuForm });
        setStudents((prev) => prev.map((s) => s.id === editingStudent.id ? { ...s, ...stuForm } : s));
        setMessage({ type: "success", text: "✅ Student updated successfully!" });
      } else {
        const res = await addStudentAdmin(stuForm);
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


        {/* ── Tab Navigation ── */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn${activeTab === "messages" ? " active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            📣 Messages
            <span className="admin-tab-badge">{inAppMessages.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "tickers" ? " active" : ""}`}
            onClick={() => setActiveTab("tickers")}
          >
            🛎️ Tickers
            <span className="admin-tab-badge">{tickerList.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "lessons" ? " active" : ""}`}
            onClick={() => setActiveTab("lessons")}
          >
            📖 Course/Lessons
            <span className="admin-tab-badge">{lessons.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "library" ? " active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            📚 e-Library
            <span className="admin-tab-badge">{library.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "students" ? " active" : ""}`}
            onClick={() => { setActiveTab("students"); if (students.length === 0) fetchStudentsList(); }}
          >
            🎓 Students
            <span className="admin-tab-badge">{students.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "templates" ? " active" : ""}`}
            onClick={() => {
              setActiveTab("templates");
              if (templatesList.length === 0) fetchTemplatesList();
            }}
          >
            📋 Templates
            <span className="admin-tab-badge">{templatesList.length}</span>
          </button>
          <button
            className={`admin-tab-btn${activeTab === "whatsapp" ? " active" : ""}`}
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
        </div>

        {/* ── Tab Panels ── */}
        <div className="admin-tab-panel">
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
                  <label className="admin-label">Message Body</label>
                  <textarea
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

          {/* ── COURSE/LESSONS TAB ── */}
          {activeTab === "lessons" && (
            <div className="admin-card-body">
              {/* ── Sub Tabs (Courses | Batches | Lessons) ── */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => { setLessonSubTab("courses"); if (coursesList.length === 0) fetchCoursesList(); }}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: lessonSubTab === "courses" ? "#8e44ad" : "#f1f5f9",
                    color: lessonSubTab === "courses" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: lessonSubTab === "courses" ? "0 2px 6px rgba(142, 68, 173, 0.2)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  📚 Courses ({coursesList.length})
                </button>

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

              {/* ── 1. COURSES SUB-TAB ── */}
              {lessonSubTab === "courses" && (
                <div>
                  <form onSubmit={handleSaveCourse} style={{ marginBottom: "25px", background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#2c3e50" }}>
                      {isEditingCourse ? "✏️ Edit Course" : "➕ Add New Course"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      <div>
                        <label className="admin-label">Course ID *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Jyotisha"
                          value={courseForm.id}
                          disabled={isEditingCourse}
                          onChange={(e) => setCourseForm({ ...courseForm, id: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-label">Course Code *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. JK"
                          value={courseForm.code}
                          onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-label">Language *</label>
                        <select
                          className="admin-input"
                          value={courseForm.language}
                          onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })}
                        >
                          <option value="Kannada">Kannada</option>
                          <option value="Telugu">Telugu</option>
                          <option value="English">English</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                      <label className="admin-label">Course Title *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Jyotisha - Kannada"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label className="admin-label">Description</label>
                      <textarea
                        className="admin-input"
                        rows="2"
                        placeholder="Comprehensive Vedic Astrology Course..."
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" className="admin-btn admin-btn-success" style={{ padding: "8px 20px" }}>
                        {isEditingCourse ? "Update Course" : "Save Course"}
                      </button>
                      {isEditingCourse && (
                        <button
                          type="button"
                          className="admin-btn"
                          style={{ background: "#7f8c8d", padding: "8px 16px" }}
                          onClick={() => {
                            setCourseForm({ id: "", code: "", title: "", language: "Kannada", description: "" });
                            setIsEditingCourse(false);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <h3 style={{ color: "#2c3e50", fontSize: "16px", marginBottom: "14px" }}>Available Courses</h3>
                  {coursesList.length === 0 ? (
                    <p style={{ color: "#7f8c8d" }}>No courses created yet.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
                      {coursesList.map((c) => (
                        <div key={c.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              CODE: {c.code || c.id}
                            </span>
                            <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              {c.language || "Kannada"}
                            </span>
                          </div>
                          <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>{c.title} ({c.id})</h4>
                          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 14px 0" }}>{c.description || "No description provided."}</p>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => handleEditCourse(c)}
                              style={{ padding: "4px 10px", fontSize: "12px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCourseClick(c.id)}
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

              {/* ── 2. BATCHES SUB-TAB ── */}
              {lessonSubTab === "batches" && (
                <div>
                  <form onSubmit={handleSaveBatch} style={{ marginBottom: "25px", background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#2c3e50" }}>
                      {isEditingBatch ? "✏️ Edit Batch" : "➕ Create New Batch"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
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
                          placeholder="e.g. Jyotisha Kannada Oct 2026 Batch"
                          value={batchForm.name}
                          onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-label">Course *</label>
                        <select
                          className="admin-input"
                          value={batchForm.course_id}
                          onChange={(e) => setBatchForm({ ...batchForm, course_id: e.target.value })}
                          required
                        >
                          {coursesList.length > 0 ? (
                            coursesList.map(c => <option key={c.id} value={c.id}>{c.title} ({c.id})</option>)
                          ) : (
                            <>
                              <option value="Jyotisha">Jyotisha (JK)</option>
                              <option value="ManaShastra">ManaShastra (MS)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      <div>
                        <label className="admin-label">Start Date</label>
                        <input
                          type="date"
                          className="admin-input"
                          value={batchForm.start_date}
                          onChange={(e) => setBatchForm({ ...batchForm, start_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">End Date</label>
                        <input
                          type="date"
                          className="admin-input"
                          value={batchForm.end_date}
                          onChange={(e) => setBatchForm({ ...batchForm, end_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Status</label>
                        <select
                          className="admin-input"
                          value={batchForm.status || "active"}
                          onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value })}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label className="admin-label">WhatsApp Group Link (Optional)</label>
                      <input
                        type="url"
                        className="admin-input"
                        placeholder="https://chat.whatsapp.com/..."
                        value={batchForm.whatsapp_group_link || ""}
                        onChange={(e) => setBatchForm({ ...batchForm, whatsapp_group_link: e.target.value })}
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
                            setBatchForm({ id: "", name: "", course_id: "Jyotisha", start_date: "", end_date: "", whatsapp_group_link: "", status: "active" });
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
                            <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              COURSE: {b.course_id || b.course_name}
                            </span>
                            <span style={{ background: b.status === "active" ? "#d1fae5" : "#fee2e2", color: b.status === "active" ? "#047857" : "#b91c1c", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                              {(b.status || "active").toUpperCase()}
                            </span>
                          </div>
                          <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>{b.name}</h4>
                          <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 8px 0" }}>ID: <strong>{b.id}</strong></p>
                          {(b.start_date || b.end_date) && (
                            <p style={{ fontSize: "0.8rem", color: "#475569", margin: "0 0 10px 0" }}>
                              📅 {b.start_date || "N/A"} to {b.end_date || "N/A"}
                            </p>
                          )}
                          {b.whatsapp_group_link && (
                            <p style={{ fontSize: "0.8rem", margin: "0 0 12px 0" }}>
                              💬 Group: <a href={b.whatsapp_group_link} target="_blank" rel="noreferrer" style={{ color: "#059669", fontWeight: "bold" }}>Open WhatsApp Link</a>
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

              {/* ── 3. LESSONS SUB-TAB ── */}
              {lessonSubTab === "lessons" && (
                <>
                  {/* Add / Edit Lesson Form */}
                  <form onSubmit={handleSaveLesson} style={{ marginBottom: "30px", background: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#2c3e50" }}>
                  {editingLessonId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label className="admin-label">Course / Playlist Name</label>
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
                      <option value="">-- Select Course / Playlist --</option>
                      {coursesList.map((c) => (
                        <option key={c.id} value={c.title || c.id}>
                          📚 Course: {c.title} ({c.id})
                        </option>
                      ))}
                      {uniquePlaylists.filter(p => !coursesList.some(c => (c.title === p || c.id === p))).map((p) => (
                        <option key={p} value={p}>
                          📺 Playlist: {p}
                        </option>
                      ))}
                      <option value="__NEW__">➕ Create Custom Course / Playlist...</option>
                    </select>
                    {isCreatingNewPlaylist && (
                      <input
                        type="text"
                        className="admin-input"
                        style={{ marginTop: "8px" }}
                        value={lessonForm.playlist}
                        onChange={(e) => setLessonForm({ ...lessonForm, playlist: e.target.value })}
                        placeholder="Enter New Course / Playlist Name"
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
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
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
                        <th>Courses</th>
                        <th>Batch</th>
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
                        const bId = student.batch_id || (Array.isArray(student.batches) ? student.batches[0] : "") || "-";
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
                                {Array.isArray(student.courses) ? student.courses.map((c) => (
                                  <span key={c} style={{ background: "#e8f8f5", color: "#117864", padding: "3px 8px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "600" }}>{c}</span>
                                )) : <span style={{ fontSize: "12px" }}>{student.courses}</span>}
                              </div>
                            </td>
                            <td>
                              <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "700" }}>
                                {bId}
                              </span>
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
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Message Content *
                    </label>
                    <textarea
                      rows="5"
                      className="admin-input"
                      value={waMessageText}
                      onChange={(e) => setWaMessageText(e.target.value)}
                      placeholder="Enter WhatsApp message..."
                      style={{ fontFamily: "inherit" }}
                    ></textarea>
                    <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Insert Tag:</span>
                      {["first_name", "last_name", "student_name", "course", "batch_id"].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setWaMessageText(prev => prev + ` {${tag}}`)}
                          style={{ padding: "3px 8px", fontSize: "11.5px", background: "#f0fdf4", color: "#047857", border: "1px solid #86efac", borderRadius: "4px", cursor: "pointer", fontWeight: "700" }}
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
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
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Batch Announcement Message Content *
                    </label>
                    <textarea
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "16px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.5rem" }}>📋</span> Reusable Message Templates
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "#64748b" }}>
                    Manage pre-written notification and class reminder templates for WhatsApp and In-App messaging.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="🔍 Search templates..."
                    value={tplSearch}
                    onChange={(e) => setTplSearch(e.target.value)}
                    style={{ padding: "8px 14px", fontSize: "13.5px", width: "220px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTplForm({ id: "", name: "", title: "", content: "", description: "" });
                      setIsEditingTpl(false);
                      setShowManageTemplatesModal(true);
                    }}
                    className="admin-btn admin-btn-success"
                    style={{ padding: "9px 18px", fontSize: "13.5px" }}
                  >
                    + Create New Template
                  </button>
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
                          onClick={() => setStuForm({ ...stuForm, language: lang })}
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

                {/* Courses Selector Cards */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "13px", color: "#334155" }}>
                    Course Selection <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Jyotisha", "ManaShastra"].map((course) => {
                      const checked = stuForm.courses.includes(course);
                      return (
                        <button
                          key={course}
                          type="button"
                          onClick={() => handleStuCourseToggle(course)}
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: checked ? "2px solid #0d9488" : "1px solid #cbd5e1",
                            background: checked ? "#f0fdf4" : "#f8fafc",
                            color: checked ? "#0f766e" : "#475569",
                            fontWeight: checked ? "700" : "600",
                            fontSize: "13.5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            boxShadow: checked ? "0 2px 8px rgba(13, 148, 136, 0.15)" : "none",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>{checked ? "☑" : "☐"}</span>
                          {course}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Batch Selection */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "13px", color: "#334155" }}>
                    Assigned Batch <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: "600"
                    }}
                    value={stuForm.batch_id || ""}
                    onChange={(e) => setStuForm({ ...stuForm, batch_id: e.target.value })}
                  >
                    <option value="">Select Batch</option>
                    {batchesList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name || b.id} ({b.id})
                      </option>
                    ))}
                  </select>
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
                    disabled={stuSaving}
                    style={{
                      padding: "10px 24px",
                      background: stuSaving ? "#94a3b8" : "linear-gradient(135deg, #4a154b 0%, #6b1170 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: stuSaving ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      boxShadow: "0 4px 12px rgba(107, 17, 112, 0.25)",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {stuSaving ? "Saving..." : editingStudent ? "Save Changes" : "Add Student"}
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
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>Message Content *</label>
                    <textarea
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

                {/* Templates Directory List */}
                <h4 style={{ color: "#334155", margin: "0 0 12px 0" }}>Saved Message Templates</h4>
                {templatesList.length === 0 ? (
                  <p style={{ color: "#64748b", fontStyle: "italic" }}>No templates saved yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {templatesList.map((tpl) => (
                      <div
                        key={tpl.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "10px",
                          padding: "14px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "14px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <strong style={{ color: "#5b21b6", fontSize: "14px" }}>{tpl.name}</strong>
                            <span style={{ background: "#f3e8ff", color: "#6b21a8", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>
                              {tpl.id}
                            </span>
                          </div>
                          {tpl.description && (
                            <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#64748b" }}>{tpl.description}</p>
                          )}
                          <pre style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px", color: "#334155", margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                            {tpl.content}
                          </pre>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleEditTemplate(tpl)}
                            style={{ padding: "4px 10px", fontSize: "12px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTemplateClick(tpl.id)}
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
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
