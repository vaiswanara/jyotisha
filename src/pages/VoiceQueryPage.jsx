import React, { useState, useEffect, useRef } from "react";
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  requestMicrophoneAccess,
} from "../services/voiceService.js";

const DEFAULT_ADMIN_PHONE = "919482094290";

const FALLBACK_TOPICS = [
  { id: "class_doubt", name: "Gurukulam Live Class Doubt", icon: "🎓" },
  { id: "horoscope", name: "Horoscope (Janma Kundali) Analysis", icon: "📜" },
  { id: "dasha_bhukti", name: "Dasha & Antardasha Predictions", icon: "⏳" },
  { id: "gochara_transit", name: "Planetary Transit (Gochara) & Remedies", icon: "🪐" },
  { id: "muhurtha", name: "Muhurtha (Auspicious Timing) Query", icon: "⏰" },
  { id: "prashna_shastra", name: "Prashna Shastra (Horary) Query", icon: "☸️" },
  { id: "retrograde_combustion", name: "Retrograde (Vakra) & Combust Planets", icon: "🔄" },
  { id: "match_compatibility", name: "Kundali Matching & Dosha Parihara", icon: "💞" },
  { id: "general_astrology", name: "General Astrology / Siddhanta Doubt", icon: "☀️" },
];

export function VoiceQueryPage({ logoUrl, onNavigate }) {
  // Voice Recognition Language State (Kannada is the first and default)
  const [speechLang, setSpeechLang] = useState("kn-IN");

  // Student & Query Details
  const [studentName, setStudentName] = useState(() => {
    try {
      const meProfile = JSON.parse(localStorage.getItem("me_page_profile") || "null");
      if (meProfile && meProfile.name) return meProfile.name;
      return localStorage.getItem("vaiswanara_voice_student_name") || "";
    } catch (_) {
      return "";
    }
  });

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [topics, setTopics] = useState(FALLBACK_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState("class_doubt");

  // Voice Recording & Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedToast, setCopiedToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const isSpeechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Load Batches from static/batches.json
  useEffect(() => {
    let isMounted = true;
    fetch("./static/batches.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load batches");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBatches(data);
          setSelectedBatchId(data[0].id || data[0].name);
        }
      })
      .catch(() => {
        if (isMounted) {
          const fallback = [{ id: "JK-2026-OCT", name: "Jyotisha Gurukulam (LIVE)", remarks: "Kannada" }];
          setBatches(fallback);
          setSelectedBatchId(fallback[0].id);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Query Topics dynamically from localStorage, static/query_topics.json, or fallback
  useEffect(() => {
    const loadTopics = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("vaiswanara_query_topics") || "null");
        if (Array.isArray(saved) && saved.length > 0) {
          setTopics(saved);
          setSelectedTopicId((prev) => (saved.some((t) => t.id === prev) ? prev : saved[0].id));
          return;
        }
      } catch (_) { }

      fetch("./static/query_topics.json")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load query topics");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTopics(data);
            setSelectedTopicId((prev) => (data.some((t) => t.id === prev) ? prev : data[0].id));
          }
        })
        .catch(() => {
          setTopics(FALLBACK_TOPICS);
        });
    };

    loadTopics();
    window.addEventListener("vaiswanara_query_topics_updated", loadTopics);
    return () => {
      window.removeEventListener("vaiswanara_query_topics_updated", loadTopics);
    };
  }, []);

  // Save student name to localStorage
  useEffect(() => {
    if (studentName.trim()) {
      try {
        localStorage.setItem("vaiswanara_voice_student_name", studentName.trim());
      } catch (_) { }
    }
  }, [studentName]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecordingSession();
    };
  }, []);

  // Start Voice Recognition Session
  const startRecordingSession = async () => {
    setErrorMessage("");
    if (!isSpeechSupported) {
      setErrorMessage(
        "Voice recognition is not supported in this browser. You can type directly below."
      );
      return;
    }

    const isIOS =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // 1. Explicitly request microphone stream first on mobile/Safari (unlocks WebKit speech sandbox)
    try {
      await requestMicrophoneAccess();
    } catch (micErr) {
      console.warn("Microphone access check failed:", micErr);
      if (micErr?.name === "NotAllowedError" || micErr?.name === "PermissionDeniedError") {
        setErrorMessage(
          "Microphone permission was blocked. Please tap the lock/settings icon in the browser address bar and allow Microphone access."
        );
        return;
      }
    }

    // 2. Initialize unified speech recognizer from voiceService
    try {
      const recognition = createSpeechRecognizer({
        lang: speechLang,
        continuous: true,
        onStart: () => {
          setIsRecording(true);
          setIsPaused(false);
          setErrorMessage("");
        },
        onResult: ({ final, interim }) => {
          if (final) {
            setFinalText((prev) => (prev ? prev.trim() + " " + final.trim() : final.trim()));
          }
          setInterimText(interim || "");
        },
        onError: (errorCode) => {
          console.warn("Speech recognition error:", errorCode);
          if (errorCode === "not-allowed" || errorCode === "permission-denied") {
            setErrorMessage(
              "Microphone permission was denied. Please allow microphone access in your browser / iOS settings."
            );
            stopRecordingSession();
          } else if (errorCode === "service-not-allowed") {
            if (isIOS || isSafari) {
              setErrorMessage(
                "💡 Note for iPhone / Safari users: Direct voice recognition is best supported on Android & Chrome. On iPhone, please type your question directly in the box below."
              );
              textareaRef.current?.focus();
            } else {
              setErrorMessage(
                "Speech recognition service is not allowed by your system. Please check device permissions or type directly."
              );
            }
            stopRecordingSession();
          } else if (errorCode === "no-speech") {
            // Normal gap in speech, do not stop
          } else {
            setErrorMessage(`Audio status: ${errorCode}`);
          }
        },
        onEnd: () => {
          // Auto-restart if user has not explicitly stopped (smooth continuous dictation on iOS single-utterance mode)
          if (recognitionRef.current && isRecordingRef.current && !isPausedRef.current) {
            try {
              recognition.start();
            } catch (_) { }
          } else {
            if (!isRecordingRef.current) {
              setIsRecording(false);
            }
          }
        },
      });

      if (!recognition) {
        setErrorMessage("Could not initialize speech recognition.");
        return;
      }

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech start error:", err);
      setErrorMessage("Could not start microphone session.");
      setIsRecording(false);
    }
  };

  const stopRecordingSession = () => {
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try {
        rec.stop();
      } catch (_) { }
    }
    setIsRecording(false);
    setIsPaused(false);
    setInterimText("");
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecordingSession();
    } else {
      startRecordingSession();
    }
  };

  const handleClear = () => {
    if (finalText.trim() && window.confirm("Are you sure you want to clear the recorded question?")) {
      setFinalText("");
      setInterimText("");
      setRecordingSeconds(0);
      setErrorMessage("");
    }
  };

  // Format Duration in MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Construct Formatted WhatsApp Message (English labels & keywords)
  const getFormattedMessage = () => {
    const selectedTopicObj = topics.find((t) => t.id === selectedTopicId) || topics[0];
    const topicLabel = selectedTopicObj ? `${selectedTopicObj.icon ? selectedTopicObj.icon + " " : ""}${selectedTopicObj.name}` : "General Astrology Doubt";

    const activeBatchObj = batches.find((b) => b.id === selectedBatchId);
    const batchLabel = activeBatchObj ? activeBatchObj.name || activeBatchObj.id : selectedBatchId || "Vedic Gurukulam";

    const dateStr = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const questionContent = finalText.trim() || (interimText ? `[Live dictation]: ${interimText.trim()}` : "(Question text empty)");

    return `☀️ *e-PATA - Student Query*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Student Name:* ${studentName.trim() || "Vedic Student"}
📚 *Batch / Course:* ${batchLabel}
🏷️ *Topic:* ${topicLabel}
📅 *Date & Time:* ${dateStr}

🎙️ *Spoken Doubt / Question:*
"${questionContent}"
━━━━━━━━━━━━━━━━━━━
_Sent via e-JYOTISHA Voice Assistant_`;
  };

  // Dispatch to WhatsApp
  const handleSendToWhatsApp = () => {
    if (!finalText.trim() && !interimText.trim()) {
      alert("Please speak or type your question before sending.");
      return;
    }

    if (!studentName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (isRecording) {
      stopRecordingSession();
    }

    const activeBatchObj = batches.find((b) => b.id === selectedBatchId);
    const rawAdminPhone =
      activeBatchObj?.admin_whatsapp ||
      activeBatchObj?.contact_phone ||
      localStorage.getItem("vaiswanara_admin_whatsapp") ||
      DEFAULT_ADMIN_PHONE;

    const cleanPhone = rawAdminPhone.replace(/[^0-9]/g, "");
    const formattedMsg = getFormattedMessage();
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedMsg)}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
    setShowConfirmModal(false);
  };

  // Copy Formatted Message to Clipboard
  const handleCopyText = async () => {
    const formattedMsg = getFormattedMessage();
    try {
      await navigator.clipboard.writeText(formattedMsg);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (_) {
      alert("Message copied to clipboard!");
    }
  };

  // Get question label in the selected voice language
  const getQuestionLabel = () => {
    if (speechLang === "kn-IN") {
      return "ನಿಮ್ಮ ಪ್ರಶ್ನೆ (ಧ್ವನಿ ಅಥವಾ ಎಡಿಟ್ ಮಾಡಿ):";
    }
    return "మీ సందేహం (వాయిస్ టైపింగ్ లేదా సవరణ చేయవచ్చు):";
  };

  const getQuestionPlaceholder = () => {
    if (speechLang === "kn-IN") {
      return "ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ...";
    }
    return "మైక్ బటన్ నొక్కి మాట్లాడండి లేదా నేరుగా ఇక్కడ టైప్ చేయండి...";
  };

  return (
    <main className="page">
      <section
        className="workspace"
        style={{
          padding: "16px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
          paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
          display: "block",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div className="voice-query-page">
          <style>{`
        .voice-query-page {
          max-width: 880px;
          margin: 0 auto;
          padding: 0 0 30px 0;
          font-family: inherit;
          color: #2c3e50;
        }
        .vq-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, #fff9f0 0%, #fff2dc 100%);
          border: 1px solid rgba(218, 165, 32, 0.35);
          border-radius: 18px;
          padding: 18px 24px;
          margin-bottom: 22px;
          box-shadow: 0 4px 20px rgba(184, 115, 51, 0.08);
          position: relative;
          overflow: hidden;
        }
        .vq-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to bottom, #d35400, #f39c12);
        }
        .vq-header-icon {
          font-size: 38px;
          width: 62px;
          height: 62px;
          background: linear-gradient(135deg, #d35400, #e67e22);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(211, 84, 0, 0.25);
          flex-shrink: 0;
        }
        .vq-header-text h1 {
          margin: 0 0 4px 0;
          font-size: 1.45rem;
          color: #8a3b24;
          font-weight: 800;
          letter-spacing: -0.3px;
        }
        .vq-header-text p {
          margin: 0;
          font-size: 0.92rem;
          color: #665243;
          line-height: 1.4;
        }

        /* Glassmorphic Container Cards */
        .vq-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(218, 165, 32, 0.25);
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }
        .vq-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #8a3b24;
          margin-top: 0;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px dashed rgba(218, 165, 32, 0.3);
          padding-bottom: 8px;
        }

        /* Language Switcher Tabs */
        .lang-pills {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .lang-pill-btn {
          flex: 1;
          min-width: 0;
          background: #fdfaf6;
          border: 2px solid #e0cfb8;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          color: #4a3b32;
          font-weight: 700;
          box-sizing: border-box;
          text-align: center;
        }
        .lang-pill-btn:hover {
          background: #fff4e5;
          border-color: #d35400;
        }
        .lang-pill-btn.active {
          background: linear-gradient(135deg, #8a3b24, #b84f28);
          color: #ffffff;
          border-color: #8a3b24;
          box-shadow: 0 4px 14px rgba(138, 59, 36, 0.25);
        }
        .lang-pill-btn .lang-name {
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
          margin-bottom: 12px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.86rem;
          font-weight: 700;
          color: #5c4333;
        }
        .form-group input,
        .form-group select {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #dcd1c2;
          background: #faf8f5;
          font-size: 0.95rem;
          color: #2c3e50;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #8a3b24;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(138, 59, 36, 0.12);
        }

        /* Voice Recording Studio Hero Area */
        .recording-studio {
          background: radial-gradient(circle at center, #ffffff 0%, #fff8ee 100%);
          border: 2px solid rgba(218, 165, 32, 0.35);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          position: relative;
          box-shadow: 0 8px 30px rgba(184, 115, 51, 0.07);
        }
        .mic-button-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 15px 0 20px 0;
          position: relative;
        }
        .mic-btn {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d35400 0%, #e67e22 100%);
          border: 4px solid #ffffff;
          box-shadow: 0 8px 25px rgba(211, 84, 0, 0.35);
          color: #ffffff;
          font-size: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          z-index: 2;
        }
        .mic-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 30px rgba(211, 84, 0, 0.45);
        }
        .mic-btn.recording {
          background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
          animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
          0% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.6), 0 8px 25px rgba(192, 57, 43, 0.4);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(231, 76, 60, 0), 0 8px 25px rgba(192, 57, 43, 0.4);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0), 0 8px 25px rgba(192, 57, 43, 0.4);
          }
        }
        .wave-rings {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 2px solid rgba(230, 126, 34, 0.4);
          animation: wave-expand 2s infinite ease-out;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes wave-expand {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .recording-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #e0cfb8;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #8a3b24;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          margin-bottom: 12px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7f8c8d;
        }
        .status-dot.active {
          background: #e74c3c;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Transcription Textarea */
        .transcription-box {
          width: 100%;
          min-height: 140px;
          border-radius: 12px;
          border: 1.5px solid #dcd1c2;
          background: #fdfaf6;
          padding: 14px 16px;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #2c3e50;
          box-sizing: border-box;
          resize: vertical;
          font-family: inherit;
        }
        .transcription-box:focus {
          outline: none;
          border-color: #d35400;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(211, 84, 0, 0.12);
        }
        .live-interim-preview {
          background: rgba(255, 243, 205, 0.75);
          border-left: 4px solid #f39c12;
          padding: 8px 12px;
          margin-top: 8px;
          border-radius: 4px;
          font-size: 0.95rem;
          font-style: italic;
          color: #856404;
          text-align: left;
        }

        /* Action Buttons */
        .controls-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
        }
        .btn-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-secondary {
          background: #f5efe6;
          color: #5c4333;
          border: 1px solid #dcd1c2;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: #ede3d4;
          border-color: #b89d82;
        }
        .btn-whatsapp-main {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 14px 28px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          width: 100%;
          margin-top: 10px;
        }
        .btn-whatsapp-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.45);
        }

        /* Formatted Message Preview Box */
        .preview-box {
          background: #f7f9f7;
          border: 1.5px dashed #25d366;
          border-radius: 12px;
          padding: 16px;
          font-family: monospace, sans-serif;
          white-space: pre-wrap;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #1b4332;
          max-height: 220px;
          overflow-y: auto;
        }

        /* Toast Feedback */
        .toast-notify {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #27ae60;
          color: #fff;
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          z-index: 99999;
          animation: fade-in-up 0.3s ease;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 15px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        /* Tips Accordion */
        .tips-panel {
          background: #fdfaf6;
          border-left: 4px solid #8a3b24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 0.88rem;
          color: #665243;
        }
        .tips-panel ul {
          margin: 6px 0 0 0;
          padding-left: 18px;
        }
        .tips-panel li {
          margin-bottom: 4px;
        }
      `}</style>

      {/* ── Page Header (English) ── */}
      <div className="vq-header">
        <div className="vq-header-icon">🎙️</div>
        <div className="vq-header-text">
          <h1>e-Voice Query</h1>
          <p>
            Speak your astrology questions in Kannada or Telugu — automatically transcribed and dispatched to Guru via WhatsApp.
          </p>
        </div>
      </div>

      {/* ── Language Switcher Section (Kannada 1st/default, Telugu 2nd) ── */}
      <div className="vq-card">
        <div className="vq-card-title">
          <span>🗣️</span>
          <span>Select Voice Recognition Language</span>
        </div>
        <div className="lang-pills">
          <button
            type="button"
            className={`lang-pill-btn ${speechLang === "kn-IN" ? "active" : ""}`}
            onClick={() => {
              if (isRecording) stopRecordingSession();
              setSpeechLang("kn-IN");
            }}
          >
            <span className="lang-name">Kannada</span>
          </button>

          <button
            type="button"
            className={`lang-pill-btn ${speechLang === "te-IN" ? "active" : ""}`}
            onClick={() => {
              if (isRecording) stopRecordingSession();
              setSpeechLang("te-IN");
            }}
          >
            <span className="lang-name">Telugu</span>
          </button>
        </div>
      </div>

      {/* ── Student Information & Batch (English) ── */}
      <div className="vq-card">
        <div className="vq-card-title">
          <span>👤</span>
          <span>Student Details & Query Topic</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="studentNameInput">Student Name*</label>
            <input
              id="studentNameInput"
              type="text"
              placeholder="e.g. Sri Krishna"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="batchSelect">Batch / Course</label>
            <select
              id="batchSelect"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              {batches.map((b) => (
                <option key={b.id || b.name} value={b.id || b.name}>
                  {b.name || b.id} {b.language ? `(${b.language})` : ""}
                </option>
              ))}
              <option value="General Student">General Student</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="topicSelect">Query Topic (Configurable)</label>
            <select
              id="topicSelect"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.icon ? `${topic.icon} ` : ""}{topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Voice Dictation Studio ── */}
      <div className="recording-studio">
        <div className="recording-status-badge">
          <span className={`status-dot ${isRecording ? "active" : ""}`}></span>
          <span>
            {isRecording
              ? `Listening... (${formatTime(recordingSeconds)})`
              : "Tap Mic to Start Speaking"}
          </span>
          <span style={{ fontSize: "0.82rem", opacity: 0.85, marginLeft: "4px" }}>
            [{speechLang === "kn-IN" ? "ಕನ್ನಡ" : "తెలుగు"}]
          </span>
        </div>

        <div className="mic-button-wrapper">
          {isRecording && <div className="wave-rings"></div>}
          <button
            type="button"
            className={`mic-btn ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
            title={isRecording ? "Stop Recording" : "Start Speaking"}
          >
            {isRecording ? "⏹️" : "🎙️"}
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              color: "#c0392b",
              background: "#fadbd8",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.88rem",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Live interim speech subtitle */}
        {interimText && (
          <div className="live-interim-preview">
            <span>🗣️ Live: </span>
            <span>"{interimText}"</span>
          </div>
        )}

        {/* Spoken Text Editor Box - Label in selected language */}
        <div style={{ marginTop: "15px", textAlign: "left" }}>
          <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "#5c4333", display: "block", marginBottom: "6px" }}>
            {getQuestionLabel()}
          </label>
          <textarea
            ref={textareaRef}
            className="transcription-box"
            rows="5"
            placeholder={getQuestionPlaceholder()}
            value={finalText}
            onChange={(e) => setFinalText(e.target.value)}
          />
        </div>

        {/* Controls Toolbar */}
        <div className="controls-toolbar">
          <div className="btn-group">
            {finalText.trim() && (
              <button type="button" className="btn-secondary" onClick={handleClear}>
                🗑️ Clear
              </button>
            )}
          </div>

          <div style={{ fontSize: "0.85rem", color: "#7f8c8d", fontWeight: 600 }}>
            {finalText.trim() ? `${finalText.trim().split(/\s+/).length} words` : "0 words"}
          </div>
        </div>
      </div>

      {/* ── Formatted WhatsApp Preview & Dispatch ── */}
      <div className="vq-card" style={{ marginTop: "20px" }}>
        <div className="vq-card-title">
          <span>💬</span>
          <span>WhatsApp Message Preview</span>
        </div>

        <div className="preview-box">{getFormattedMessage()}</div>

        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-whatsapp-main"
            onClick={() => setShowConfirmModal(true)}
          >
            <span>📲</span>
            <span>Send to Guru on WhatsApp</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center", padding: "10px" }}
            onClick={handleCopyText}
          >
            📋 Copy Formatted Text
          </button>
        </div>
      </div>

      {/* ── Help & Tips Panel (English) ── */}
      <div className="tips-panel">
        <strong>💡 Tips for Best Voice Accuracy:</strong>
        <ul>
          <li>Speak clearly at a normal pace in a quiet environment.</li>
          <li>You can easily review and edit the transcribed text in the box before dispatching.</li>
          <li>For optimal speech recognition, Google Chrome and Microsoft Edge on Android and Desktop are recommended.</li>
        </ul>
      </div>

      {/* ── Confirmation Modal (English) ── */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>☀️</div>
            <h3 style={{ color: "#8a3b24", margin: "0 0 10px 0" }}>
              Confirm WhatsApp Message
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#665243", lineHeight: 1.5, marginBottom: "16px" }}>
              This question will be opened in WhatsApp to Guru (+91 94820 94290).
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-whatsapp-main"
                style={{ flex: 1.5, margin: 0, padding: "10px" }}
                onClick={handleSendToWhatsApp}
              >
                <span>🚀 Send via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

        {/* ── Copied Toast ── */}
        {copiedToast && (
          <div className="toast-notify">
            ✔️ Message copied to clipboard!
          </div>
        )}
        </div>
      </section>
    </main>
  );
}

export default VoiceQueryPage;
