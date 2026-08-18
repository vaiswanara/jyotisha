import React, { useState, useEffect, useRef } from "react";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
  parseVoiceBirthDetails,
  dispatchVoiceBirthEvent,
  getIndianEnglishVoices,
  getBestIndianVoice,
} from "../services/voiceService.js";

export function VoiceAssistantWidget({ onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");

  // Position & Drag State for Movable Floating Widget
  const [position, setPosition] = useState(() => {
    // Default: bottom-right, well above the status bar / bottom navigation
    if (typeof window !== "undefined") {
      const initX = Math.max(16, window.innerWidth - 75);
      const initY = Math.max(100, window.innerHeight - 190);
      return { x: initX, y: initY };
    }
    return { x: 300, y: 500 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0, hasMoved: false });

  const recognizerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  const isSupported = isSpeechRecognitionSupported();

  // Watch for available voices
  useEffect(() => {
    const updateVoices = () => {
      const indianVoices = getIndianEnglishVoices();
      setAvailableVoices(indianVoices);
      const best = getBestIndianVoice();
      if (best) {
        setSelectedVoiceName(best.name);
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Window resize handler to keep widget in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(Math.max(12, prev.x), window.innerWidth - 66),
        y: Math.min(Math.max(60, prev.y), window.innerHeight - 80),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch (e) {}
      }
      stopSpeaking();
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  // Drag Handlers (Touch & Mouse)
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.hasMoved = true;
    }

    const newX = Math.min(Math.max(12, dragStartRef.current.posX + dx), window.innerWidth - 66);
    const newY = Math.min(Math.max(60, dragStartRef.current.posY + dy), window.innerHeight - 80);

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
      hasMoved: false,
    };
    setIsDragging(true);

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragStartRef.current.hasMoved = true;
      }

      const newX = Math.min(Math.max(12, dragStartRef.current.posX + dx), window.innerWidth - 66);
      const newY = Math.min(Math.max(60, dragStartRef.current.posY + dy), window.innerHeight - 80);
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleButtonClick = () => {
    // If dragged, do not trigger click action
    if (dragStartRef.current.hasMoved) {
      dragStartRef.current.hasMoved = false;
      return;
    }

    if (!isWidgetOpen && !isListening) {
      startListening();
    } else {
      toggleMic();
    }
  };

  const handleCommandExecution = (parsed) => {
    if (!parsed) return;

    setFeedback(parsed.response);

    // Speak response with Indian English accent
    if (isSoundEnabled && isSpeechSynthesisSupported()) {
      setIsSpeaking(true);
      speakText(parsed.response, {
        voiceName: selectedVoiceName,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }

    // Dispatch birth details event to active forms (Horoscope / Match)
    if (parsed.type === "fill_birth_details") {
      dispatchVoiceBirthEvent(parsed);
    }

    // Auto close after 5 seconds
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      if (!isListening) {
        setIsWidgetOpen(false);
      }
    }, 5000);
  };

  const startListening = () => {
    setErrorMsg("");
    setTranscript("");
    setFeedback("");
    stopSpeaking();
    setIsSpeaking(false);

    if (!isSupported) {
      setErrorMsg(
        "Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari."
      );
      setIsWidgetOpen(true);
      return;
    }

    try {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }

      const recognizer = createSpeechRecognizer({
        lang: "en-IN",
        onStart: () => {
          setIsListening(true);
          setIsWidgetOpen(true);
        },
        onResult: ({ final, interim }) => {
          const currentText = final || interim;
          setTranscript(currentText);

          if (final) {
            setIsListening(false);
            const parsed = parseVoiceBirthDetails(final);
            handleCommandExecution(parsed);
          }
        },
        onError: (err) => {
          setIsListening(false);
          if (err === "not-allowed" || err === "permission-denied") {
            setErrorMsg(
              "Microphone permission was denied. Please allow microphone access in your device/browser settings."
            );
          } else if (err === "service-not-allowed" || err === "network") {
            setErrorMsg(
              "Speech service unavailable. Please check your internet connection or dictation settings."
            );
          } else if (err !== "no-speech") {
            setErrorMsg("Speech recognition error. Please tap the mic and speak clearly.");
          }
        },
        onEnd: () => {
          setIsListening(false);
        },
      });

      recognizerRef.current = recognizer;
      recognizer.start();
    } catch (e) {
      console.error("Error starting speech recognizer:", e);
      setIsListening(false);
      setErrorMsg("Could not start speech recognition. Please check microphone permissions.");
      setIsWidgetOpen(true);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Sample birth detail commands
  const sampleCommands = [
    {
      label: "DOB 15 Aug 1995, 2:30 PM, Hyderabad",
      cmd: "Set Date of Birth 15th August 1995, Time 2:30 PM, Place Hyderabad",
    },
    {
      label: "Groom: 12 May 1992, 10 AM, Chennai",
      cmd: "Groom Date of Birth 12 May 1992, Time 10:00 AM, Place Chennai",
    },
    {
      label: "Bride: 18 Aug 1994, 4:15 PM, Mumbai",
      cmd: "Bride Date of Birth 18 August 1994, Time 4:15 PM, Place Mumbai",
    },
    {
      label: "Date: 24 Oct 1998",
      cmd: "Set Date of Birth 24th October 1998",
    },
    {
      label: "Time: 6:45 PM",
      cmd: "Set Time 6:45 PM",
    },
    {
      label: "Place: Bengaluru",
      cmd: "Set Place Bengaluru",
    },
  ];

  // Calculate smart card position near the floating button with viewport constraints
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;
  let cardLeft, cardTop;
  if (typeof window !== "undefined") {
    if (isMobile) {
      cardLeft = Math.max(12, Math.round((window.innerWidth - Math.min(340, window.innerWidth - 24)) / 2));
      cardTop = Math.max(60, Math.min(position.y - 320, window.innerHeight - 440));
      if (cardTop < 60) cardTop = 60;
    } else {
      const isRightSide = position.x > window.innerWidth / 2;
      cardLeft = isRightSide
        ? Math.max(12, position.x - 330)
        : Math.min(position.x + 64, window.innerWidth - 350);
      cardTop = Math.max(60, Math.min(position.y - 200, window.innerHeight - 460));
    }
  } else {
    cardLeft = 20;
    cardTop = 100;
  }

  return (
    <>
      {/* Draggable & Floating Action Button Container */}
      <div
        className="voice-assistant-fab-container"
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1045,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          touchAction: "none",
          userSelect: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <button
          id="va-fab-btn"
          type="button"
          onClick={handleButtonClick}
          title={
            isListening
              ? "Listening (Speak Date, Time, Place)..."
              : "Drag to move or Tap to Speak Birth Details"
          }
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            backgroundColor: isListening ? "#ef4444" : "#f59e0b",
            background: isListening
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#ffffff",
            border: "2.5px solid rgba(255, 255, 255, 0.8)",
            boxShadow: isListening
              ? "0 0 0 8px rgba(239, 68, 68, 0.3), 0 8px 24px rgba(0, 0, 0, 0.35)"
              : "0 6px 20px rgba(245, 158, 11, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            transition: isDragging ? "none" : "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isListening ? "scale(1.1)" : "scale(1)",
            position: "relative",
          }}
        >
          {isListening ? "🎙️" : "🎤"}
        </button>
      </div>

      {/* Floating Card Modal */}
      {isWidgetOpen && (
        <div
          className="voice-assistant-card"
          style={{
            position: "fixed",
            left: `${cardLeft}px`,
            top: `${cardTop}px`,
            width: "min(340px, calc(100vw - 24px))",
            maxHeight: "min(78vh, 460px)",
            backgroundColor: "var(--bg-card, #ffffff)",
            color: "var(--text-primary, #1e293b)",
            borderRadius: "18px",
            boxShadow:
              "0 18px 48px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(245, 158, 11, 0.3)",
            zIndex: 1050,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(245, 158, 11, 0.4)",
            animation: "vaFadeIn 0.22s ease-out",
          }}
        >
          {/* 1. Fixed Card Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              backgroundColor: "rgba(245, 158, 11, 0.04)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🎙️</span>
              <div>
                <strong style={{ fontSize: "14px", display: "block" }}>
                  Voice Birth Details
                </strong>
                <span
                  style={{
                    fontSize: "11px",
                    color: isListening ? "#ef4444" : "#10b981",
                    fontWeight: 600,
                  }}
                >
                  {isListening
                    ? "● Listening to details..."
                    : isSpeaking
                    ? "🔊 Speaking..."
                    : "Ready for Birth Details"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                title={isSoundEnabled ? "Mute Speech" : "Unmute Speech"}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  padding: "2px 4px",
                }}
              >
                {isSoundEnabled ? "🔊" : "🔇"}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  stopSpeaking();
                  setIsWidgetOpen(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "var(--text-muted, #64748b)",
                  marginLeft: "2px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 2. Scrollable Body Area with touch scrolling */}
          <div
            style={{
              padding: "12px 14px",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Transcript / Listening Visualizer */}
            {isListening && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  margin: "4px 0 8px 0",
                  height: "26px",
                }}
              >
                <div className="va-pulse-bar" style={{ animationDelay: "0s" }} />
                <div className="va-pulse-bar" style={{ animationDelay: "0.15s" }} />
                <div className="va-pulse-bar" style={{ animationDelay: "0.3s" }} />
                <div className="va-pulse-bar" style={{ animationDelay: "0.45s" }} />
                <div className="va-pulse-bar" style={{ animationDelay: "0.6s" }} />
              </div>
            )}

            {/* User Spoken Transcript */}
            {transcript && (
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  borderLeft: "3px solid #f59e0b",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "#d97706",
                    display: "block",
                    fontWeight: 700,
                  }}
                >
                  Heard:
                </span>
                "{transcript}"
              </div>
            )}

            {/* Assistant Feedback */}
            {feedback && (
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#047857",
                  fontWeight: 600,
                }}
              >
                ✨ {feedback}
              </div>
            )}

            {/* Error Notice */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#b91c1c",
                  lineHeight: "1.4",
                  border: "1px solid #fecaca",
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Sample Action Chips (2-column compact grid) */}
            <div style={{ marginTop: "4px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted, #64748b)",
                    fontWeight: 600,
                  }}
                >
                  Sample formats:
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#d97706",
                    fontSize: "11px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    fontWeight: 600,
                  }}
                >
                  Help & Guide
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                }}
              >
                {sampleCommands.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(item.cmd);
                      const parsed = parseVoiceBirthDetails(item.cmd);
                      handleCommandExecution(parsed);
                    }}
                    style={{
                      fontSize: "11px",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "var(--text-primary, #334155)",
                      cursor: "pointer",
                      textAlign: "left",
                      lineHeight: "1.3",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Accent Picker */}
            {availableVoices.length > 1 && (
              <div style={{ marginTop: "4px" }}>
                <label
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted, #64748b)",
                    display: "block",
                    marginBottom: "2px",
                  }}
                >
                  Voice Accent:
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  style={{
                    width: "100%",
                    fontSize: "11px",
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0,0,0,0.15)",
                    backgroundColor: "var(--bg-card, #ffffff)",
                    color: "var(--text-primary, #1e293b)",
                  }}
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/Microsoft |Google /g, "")}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 3. Fixed Bottom Action Footer (ALWAYS Visible & Never Cropped) */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              backgroundColor: "rgba(245, 158, 11, 0.04)",
              display: "flex",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={toggleMic}
              style={{
                width: "100%",
                padding: "9px 16px",
                borderRadius: "12px",
                backgroundColor: isListening ? "#ef4444" : "#f59e0b",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: isListening
                  ? "0 4px 12px rgba(239, 68, 68, 0.35)"
                  : "0 4px 12px rgba(245, 158, 11, 0.35)",
              }}
            >
              {isListening ? "🛑 Stop Listening" : "🎙️ Speak Birth Details"}
            </button>
          </div>
        </div>
      )}

      {/* Full Help Modal */}
      {showHelpModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowHelpModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1060,
            padding: "16px",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "520px",
              width: "100%",
              backgroundColor: "var(--bg-card, #ffffff)",
              color: "var(--text-primary, #1e293b)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                paddingBottom: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🎙️ Voice Birth Details Guide (Jataka & Matching)
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "14px",
                fontSize: "12px",
                color: "#92400e",
                lineHeight: "1.5",
              }}
            >
              <strong>📱 Apple iPhone / iPad Voice Guide:</strong>
              <div style={{ marginTop: "4px" }}>
                1. <strong>Enable Dictation:</strong> Ensure <em>iPhone Settings ➔ General ➔ Keyboard ➔ 'Enable Dictation' is ON</em>.<br />
                2. <strong>Microphone Access:</strong> Ensure <em>iPhone Settings ➔ Safari ➔ Microphone</em> is set to <em>Allow</em>.<br />
                3. <strong>Lockdown Mode:</strong> If using iOS Lockdown Mode, ensure web voice access is allowed.
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted, #64748b)",
                marginBottom: "14px",
              }}
            >
              You can speak full birth details in one go or speak individual fields in English:
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>
                    What to say
                  </th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Effect</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Set Date of Birth 15th August 1995, Time 2:30 PM, Place Hyderabad"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Sets DOB, TOB, and City in Jataka chart
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Groom Date of Birth 12 May 1992, Time 10:00 AM, Place Chennai"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Fills Groom's details in Matching page
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Bride Date of Birth 18 August 1994, Time 4:15 PM, Place Mumbai"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Fills Bride's details in Matching page
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Set Date of Birth 24 October 1998"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Updates only Date of Birth
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Set Time 6:45 PM"</b> / <b>"Time 14:30"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Updates only Time of Birth
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <b>"Set Place Bengaluru"</b> / <b>"City Pune"</b>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    Updates Place and coordinates
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Voice Assistant */}
      <style>{`
        @keyframes vaFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .va-pulse-bar {
          width: 4px;
          height: 100%;
          background: #ef4444;
          border-radius: 2px;
          animation: vaBarWave 0.8s ease-in-out infinite alternate;
        }
        @keyframes vaBarWave {
          0% { height: 6px; }
          100% { height: 26px; }
        }
      `}</style>
    </>
  );
}
