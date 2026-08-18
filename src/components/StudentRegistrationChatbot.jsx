import React, { useState, useEffect, useRef } from "react";
import { registerStudent } from "../services/astrologyApi.js";

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

export function StudentRegistrationChatbot({
  isOpen,
  onClose,
  batchesList = [],
  onApplyToForm,
  onRegistrationSuccess,
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  // steps: name -> phone -> confirmPhone -> language -> batch -> email -> address -> review -> success
  const [currentStep, setCurrentStep] = useState("name");
  const [collectedData, setCollectedData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    whatsappNumber: "",
    confirmWhatsappNumber: "",
    language: "Kannada",
    batchId: "",
    batchName: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [alreadyRegisteredError, setAlreadyRegisteredError] = useState(null); // { phone, adminWaLink }

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on step change
  useEffect(() => {
    if (
      isOpen &&
      currentStep !== "language" &&
      currentStep !== "batch" &&
      currentStep !== "review" &&
      currentStep !== "success"
    ) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [currentStep, isOpen]);

  // Initialize greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = {
        id: "msg-1",
        sender: "bot",
        text: "Namaste! 🙏 Welcome to e-Jyotisha Academy. I am your Admission Assistant. May I know your Full Name?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([initialGreeting]);
    }
  }, [isOpen]);

  const addBotMessage = (text, options = null) => {
    const newMsg = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text,
      options,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const addUserMessage = (text) => {
    const newMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const isBatchActive = (b) => {
    if (!b || b.isActive === false || b.status === "inactive") return false;
    const today = new Date().toISOString().split("T")[0];
    if (b.start_date && today < b.start_date) return false;
    if (b.end_date && today > b.end_date) return false;
    return true;
  };

  const getAdminWaLink = (phone) => {
    const matchedBatch = batchesList.find((b) => b.id === collectedData.batchId);
    const rawAdminPhone =
      matchedBatch?.admin_whatsapp ||
      matchedBatch?.contact_phone ||
      localStorage.getItem("vaiswanara_admin_whatsapp") ||
      "919482094290";
    let adminPhone = String(rawAdminPhone || "").replace(/[^0-9]/g, "");
    if (adminPhone.length === 10) adminPhone = "91" + adminPhone;
    if (adminPhone.startsWith("0") && adminPhone.length === 11) adminPhone = "91" + adminPhone.substring(1);
    if (!adminPhone) adminPhone = "919482094290";

    const formattedPhone = `${collectedData.countryCode} ${phone || collectedData.whatsappNumber}`.trim();
    const msg = `Namaste Admin 🙏, I am trying to register for e-Jyotisha classes with WhatsApp number ${formattedPhone}, but it says I am already registered. Please assist me.`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleSend = (overrideText = null) => {
    const textToSend = (overrideText !== null ? overrideText : inputText).trim();
    if (!textToSend && currentStep !== "email") return;

    setErrorText("");
    setAlreadyRegisteredError(null);
    if (overrideText === null) {
      setInputText("");
    }

    if (textToSend) {
      addUserMessage(textToSend);
    }

    // Step Processing Logic
    setTimeout(() => {
      processStep(textToSend);
    }, 400);
  };

  const processStep = (text) => {
    switch (currentStep) {
      case "name": {
        const parts = text.split(/\s+/);
        let first = parts[0] || "";
        let last = parts.slice(1).join(" ") || "";
        if (!last) {
          last = "Sharma";
        }
        first = first.charAt(0).toUpperCase() + first.slice(1);
        last = last.charAt(0).toUpperCase() + last.slice(1);

        setCollectedData((prev) => ({ ...prev, firstName: first, lastName: last }));
        setCurrentStep("phone");

        addBotMessage(
          `Pleasure to meet you, ${first}! 📱 Please enter your WhatsApp Mobile Number for class updates:`
        );
        break;
      }

      case "phone": {
        const cleanNumber = text.replace(/[^0-9]/g, "");
        if (cleanNumber.length < 7 || cleanNumber.length > 13) {
          setErrorText("Please enter a valid phone number (7 to 13 digits).");
          addBotMessage("⚠️ Please enter a valid WhatsApp number (e.g. 9876543210):");
          return;
        }

        setCollectedData((prev) => ({
          ...prev,
          whatsappNumber: cleanNumber,
        }));
        setCurrentStep("confirmPhone");

        addBotMessage("🔐 Please re-enter your WhatsApp number to confirm:");
        break;
      }

      case "confirmPhone": {
        const cleanConfirm = text.replace(/[^0-9]/g, "");
        if (cleanConfirm !== collectedData.whatsappNumber) {
          setErrorText("WhatsApp numbers do not match.");
          addBotMessage(
            `⚠️ The numbers do not match (${collectedData.whatsappNumber} vs ${cleanConfirm}). Please re-enter your WhatsApp number to confirm:`
          );
          return;
        }

        setCollectedData((prev) => ({
          ...prev,
          confirmWhatsappNumber: cleanConfirm,
        }));
        setCurrentStep("language");

        addBotMessage("Thank you! 📚 Which language course would you like to enroll in?", {
          type: "buttons",
          items: ["Kannada", "Telugu"], // ONLY Kannada and Telugu
        });
        break;
      }

      case "language": {
        const lang = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        if (lang !== "Kannada" && lang !== "Telugu") {
          addBotMessage("Please choose either Kannada or Telugu:", {
            type: "buttons",
            items: ["Kannada", "Telugu"],
          });
          return;
        }

        const activeLangBatches = batchesList.filter(
          (b) => (b.language || "").toLowerCase() === lang.toLowerCase() && isBatchActive(b)
        );

        setCollectedData((prev) => ({
          ...prev,
          language: lang,
          batchId: activeLangBatches[0]?.id || "",
          batchName: activeLangBatches[0]?.name || "",
        }));

        if (activeLangBatches.length === 0) {
          addBotMessage(
            `Currently there are no active batches open for ${lang}. Please choose another language or contact administration:`,
            {
              type: "buttons",
              items: ["Kannada", "Telugu"],
            }
          );
          return;
        }

        setCurrentStep("batch");
        addBotMessage(
          `Here are the available active batches for ${lang}. Please select your preferred batch:`,
          {
            type: "batches",
            items: activeLangBatches,
          }
        );
        break;
      }

      case "email": {
        const isSkip = text.toLowerCase() === "skip" || !text;
        let emailVal = "";
        if (!isSkip) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(text)) {
            setErrorText("Please enter a valid email or type 'skip'.");
            addBotMessage("⚠️ Invalid email format. Please enter a valid email address (or type 'skip'):");
            return;
          }
          emailVal = text;
        }

        setCollectedData((prev) => ({ ...prev, email: emailVal }));
        setCurrentStep("address");

        addBotMessage("Got it! 📍 Please enter your residential Address / City (Required):");
        break;
      }

      case "address": {
        const addressVal = text.trim();
        if (!addressVal || addressVal.toLowerCase() === "skip") {
          setErrorText("Address is required. Please provide your residential address.");
          addBotMessage("⚠️ Address is mandatory for student records. Please enter your residential address or city:");
          return;
        }

        const finalData = {
          ...collectedData,
          address: addressVal,
        };
        setCollectedData(finalData);
        setCurrentStep("review");

        addBotMessage(
          "🌟 Excellent! Please review your registration details and confirm below:"
        );
        break;
      }

      default:
        break;
    }
  };

  const handleSelectLanguage = (lang) => {
    addUserMessage(lang);
    setTimeout(() => {
      processStep(lang);
    }, 300);
  };

  const handleSelectBatch = (batch) => {
    addUserMessage(`${batch.name || batch.id}`);
    setCollectedData((prev) => ({
      ...prev,
      batchId: batch.id,
      batchName: batch.name || batch.id,
    }));
    setCurrentStep("email");

    setTimeout(() => {
      addBotMessage("Thank you! ✉️ Please provide your Email Address (or click 'Skip' below):");
    }, 400);
  };

  const handleFinalSubmit = async () => {
    if (!collectedData.address || !collectedData.address.trim()) {
      setErrorText("Address is required.");
      addBotMessage("⚠️ Address is required. Please provide your residential address:");
      setCurrentStep("address");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");
    setAlreadyRegisteredError(null);

    const payload = {
      first_name: collectedData.firstName.trim(),
      last_name: collectedData.lastName.trim(),
      country_code: collectedData.countryCode,
      whatsapp_number: collectedData.whatsappNumber.trim(),
      language: collectedData.language,
      batch_id: collectedData.batchId,
      batch_name: collectedData.batchName,
      courses: [collectedData.batchName || collectedData.batchId],
      email: collectedData.email.trim(),
      address: collectedData.address.trim(),
    };

    try {
      const response = await registerStudent(payload);
      if (response && (response.success || response.student)) {
        const studentInfo = response.student || payload;
        setCurrentStep("success");
        addBotMessage(`🎉 Congratulations ${collectedData.firstName}! Your registration has been submitted successfully!`);
        if (onRegistrationSuccess) {
          onRegistrationSuccess(studentInfo);
        }
      } else {
        const errorMsgStr = response?.message || response?.error || "Registration failed.";
        const isAlready =
          /already|exist|registered|duplicate/i.test(errorMsgStr) ||
          response?.already_registered === true;

        if (isAlready) {
          const fullPhone = `${collectedData.countryCode} ${collectedData.whatsappNumber}`;
          const waLink = getAdminWaLink(collectedData.whatsappNumber);
          setAlreadyRegisteredError({
            phone: fullPhone,
            adminWaLink: waLink,
          });
          addBotMessage(
            `⚠️ A student with this WhatsApp number (${fullPhone}) is already registered. Please Contact the Admin below:`,
            {
              type: "admin_whatsapp",
              link: waLink,
              phone: fullPhone,
            }
          );
        } else {
          setErrorText(errorMsgStr);
          addBotMessage(`⚠️ ${errorMsgStr}`);
        }
      }
    } catch (err) {
      console.error("Chatbot registration submit error:", err);
      const errMsg = err.message || "";
      const isAlready = /already|exist|registered|duplicate/i.test(errMsg);

      if (isAlready) {
        const fullPhone = `${collectedData.countryCode} ${collectedData.whatsappNumber}`;
        const waLink = getAdminWaLink(collectedData.whatsappNumber);
        setAlreadyRegisteredError({
          phone: fullPhone,
          adminWaLink: waLink,
        });
        addBotMessage(
          `⚠️ A student with this WhatsApp number (${fullPhone}) is already registered. Please Contact the Admin below:`,
          {
            type: "admin_whatsapp",
            link: waLink,
            phone: fullPhone,
          }
        );
      } else {
        setErrorText(errMsg || "An error occurred during submission.");
        addBotMessage("⚠️ Network error while submitting. You can click 'Copy Details to Main Form' to submit via the main form.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyToForm = () => {
    if (onApplyToForm) {
      onApplyToForm(collectedData);
    }
    onClose();
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep("name");
    setCollectedData({
      firstName: "",
      lastName: "",
      countryCode: "+91",
      whatsappNumber: "",
      confirmWhatsappNumber: "",
      language: "Kannada",
      batchId: "",
      batchName: "",
      email: "",
      address: "",
    });
    setErrorText("");
    setAlreadyRegisteredError(null);
    const initialGreeting = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: "Namaste! 🙏 Welcome to e-Jyotisha Academy. I am your Admission Assistant. May I know your Full Name?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([initialGreeting]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="chatbot-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(35, 23, 16, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="chatbot-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "85vh",
          maxHeight: "680px",
          backgroundColor: "#fffdfa",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(138, 59, 36, 0.25), 0 0 0 1px rgba(138, 59, 36, 0.15)",
          animation: "botScaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid #ead9c6",
        }}
      >
        {/* Chatbot Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #8a3b24 0%, #a0523d 100%)",
            color: "#ffffff",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(138, 59, 36, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                border: "1.5px solid rgba(255, 255, 255, 0.4)",
              }}
            >
              🤖
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", letterSpacing: "0.3px" }}>
                Admission Chatbot
              </h3>
              <span style={{ fontSize: "12px", opacity: 0.9, display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                Online & Ready
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleRestart}
              title="Restart Conversation"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              🔄 Reset
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close Chatbot"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: "#faf7f2",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                animation: "msgSlide 0.2s ease-out",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "11px 15px",
                  borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  backgroundColor: msg.sender === "user" ? "#8a3b24" : "#ffffff",
                  color: msg.sender === "user" ? "#ffffff" : "#2d2419",
                  boxShadow: msg.sender === "user" ? "0 4px 12px rgba(138, 59, 36, 0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                  border: msg.sender === "user" ? "none" : "1px solid #ead9c6",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>

              {/* Language Selection Buttons (Kannada / Telugu Only) */}
              {msg.options && msg.options.type === "buttons" && currentStep === "language" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                  {msg.options.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelectLanguage(item)}
                      style={{
                        backgroundColor: "#f5edd6",
                        border: "2px solid #d97706",
                        color: "#8a3b24",
                        padding: "8px 18px",
                        borderRadius: "20px",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(217, 119, 6, 0.2)",
                        transition: "all 0.2s",
                      }}
                    >
                      {item === "Kannada" ? "🟡 Kannada (ಕನ್ನಡ)" : "🔵 Telugu (తెలుగు)"}
                    </button>
                  ))}
                </div>
              )}

              {/* Batch Selection Cards */}
              {msg.options && msg.options.type === "batches" && currentStep === "batch" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", width: "100%" }}>
                  {msg.options.items.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBatch(b)}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #8a3b24",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(138, 59, 36, 0.1)",
                        transition: "transform 0.15s, box-shadow 0.15s",
                      }}
                    >
                      <div style={{ fontWeight: "700", color: "#8a3b24", fontSize: "14px" }}>
                        🎯 {b.name || b.id}
                      </div>
                      {b.days_time && (
                        <div style={{ fontSize: "12px", color: "#5c4d3e", marginTop: "3px" }}>
                          🕒 {b.days_time}
                        </div>
                      )}
                      {b.start_date && (
                        <div style={{ fontSize: "11px", color: "#7a6a57", marginTop: "2px" }}>
                          📅 Starts: {b.start_date}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Admin WhatsApp Button when Already Registered */}
              {msg.options && msg.options.type === "admin_whatsapp" && (
                <div style={{ marginTop: "10px", width: "100%" }}>
                  <a
                    href={msg.options.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#25D366",
                      color: "#ffffff",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "14px",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                    }}
                  >
                    💬 Contact Admin on WhatsApp
                  </a>
                </div>
              )}

              <span
                style={{
                  fontSize: "10px",
                  color: "#9e9182",
                  marginTop: "3px",
                  padding: "0 4px",
                }}
              >
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Review Summary Card */}
          {currentStep === "review" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #8a3b24",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 6px 20px rgba(138, 59, 36, 0.15)",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "15px",
                  color: "#8a3b24",
                  borderBottom: "1px dashed #ead9c6",
                  paddingBottom: "8px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                📋 Registration Summary
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "6px 10px", fontSize: "13px" }}>
                <span style={{ color: "#7a6a57", fontWeight: "600" }}>Name:</span>
                <span style={{ color: "#2d2419", fontWeight: "700" }}>
                  {collectedData.firstName} {collectedData.lastName}
                </span>

                <span style={{ color: "#7a6a57", fontWeight: "600" }}>WhatsApp:</span>
                <span style={{ color: "#2d2419", fontWeight: "700" }}>
                  {collectedData.countryCode} {collectedData.whatsappNumber}
                </span>

                <span style={{ color: "#7a6a57", fontWeight: "600" }}>Language:</span>
                <span style={{ color: "#2d2419" }}>{collectedData.language}</span>

                <span style={{ color: "#7a6a57", fontWeight: "600" }}>Batch:</span>
                <span style={{ color: "#8a3b24", fontWeight: "700" }}>
                  {collectedData.batchName || collectedData.batchId}
                </span>

                {collectedData.email && (
                  <>
                    <span style={{ color: "#7a6a57", fontWeight: "600" }}>Email:</span>
                    <span style={{ color: "#2d2419" }}>{collectedData.email}</span>
                  </>
                )}

                <span style={{ color: "#7a6a57", fontWeight: "600" }}>Address:</span>
                <span style={{ color: "#2d2419", fontWeight: "700" }}>
                  {collectedData.address}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#8a3b24",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "11px 16px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(138, 59, 36, 0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  {isSubmitting ? "Submitting Registration..." : "✅ Confirm & Submit Registration"}
                </button>

                <button
                  type="button"
                  onClick={handleApplyToForm}
                  style={{
                    backgroundColor: "#f5edd6",
                    color: "#5c4d3e",
                    border: "1px solid #dcd0c0",
                    borderRadius: "10px",
                    padding: "9px 16px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  📝 Copy Details to Main Form
                </button>
              </div>
            </div>
          )}

          {/* Success Box */}
          {currentStep === "success" && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "2px solid #86efac",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  margin: "0 auto 10px auto",
                }}
              >
                ✓
              </div>
              <h4 style={{ margin: "0 0 6px 0", color: "#065f46", fontSize: "16px" }}>
                Registration Completed!
              </h4>
              <p style={{ fontSize: "13px", color: "#047857", margin: "0 0 14px 0" }}>
                Your student profile has been submitted to the gurukulam administration.
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 20px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Already Registered Alert Box */}
        {alreadyRegisteredError && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              padding: "12px 16px",
              fontSize: "13px",
              borderTop: "1.5px solid #f87171",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <div>
                <strong>A student with this WhatsApp number ({alreadyRegisteredError.phone}) is already registered.</strong>
                <div style={{ color: "#7f1d1d", marginTop: "2px" }}>Please Contact the Admin:</div>
              </div>
            </div>
            <a
              href={alreadyRegisteredError.adminWaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#25D366",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                maxWidth: "260px",
              }}
            >
              💬 Contact Admin on WhatsApp
            </a>
          </div>
        )}

        {/* Generic Error Alert */}
        {errorText && !alreadyRegisteredError && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              padding: "8px 14px",
              fontSize: "12px",
              borderTop: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>⚠️</span>
            <span>{errorText}</span>
          </div>
        )}

        {/* Quick Skip Button for Email step ONLY */}
        {currentStep === "email" && (
          <div
            style={{
              padding: "6px 14px",
              backgroundColor: "#f5edd6",
              borderTop: "1px solid #ead9c6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "11px", color: "#7a6a57" }}>
              Optional Step:
            </span>
            <button
              type="button"
              onClick={() => handleSend("skip")}
              style={{
                background: "transparent",
                border: "1px solid #d97706",
                color: "#8a3b24",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Skip email ➔
            </button>
          </div>
        )}

        {/* Input Bar */}
        {currentStep !== "language" && currentStep !== "review" && currentStep !== "success" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #ead9c6",
              backgroundColor: "#ffffff",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {/* Country code prefix if in phone step */}
            {(currentStep === "phone" || currentStep === "confirmPhone") && (
              <select
                value={collectedData.countryCode}
                onChange={(e) => setCollectedData((prev) => ({ ...prev, countryCode: e.target.value }))}
                style={{
                  padding: "8px 4px",
                  borderRadius: "8px",
                  border: "1px solid #dcd0c0",
                  backgroundColor: "#faf7f2",
                  fontSize: "13px",
                  color: "#2d2419",
                  maxWidth: "90px",
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            )}

            <input
              ref={inputRef}
              type={currentStep === "phone" || currentStep === "confirmPhone" ? "tel" : "text"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentStep === "name"
                  ? "Type your full name (e.g. Sridhar Sharma)..."
                  : currentStep === "phone"
                  ? "Type your WhatsApp number..."
                  : currentStep === "confirmPhone"
                  ? "Re-enter WhatsApp number to confirm..."
                  : currentStep === "email"
                  ? "Type your email (or 'skip')..."
                  : currentStep === "address"
                  ? "Enter full address / city (Mandatory)..."
                  : "Type a message..."
              }
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "20px",
                border: "1px solid #dcd0c0",
                backgroundColor: "#faf7f2",
                fontSize: "14px",
                color: "#2d2419",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim() && currentStep !== "email"}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#8a3b24",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                opacity: !inputText.trim() && currentStep !== "email" ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              ➤
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes botScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
