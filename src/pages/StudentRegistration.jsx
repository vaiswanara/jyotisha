import React, { useState, useEffect } from "react";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { registerStudent, getBatches } from "../services/astrologyApi.js";
import { StudentRegistrationChatbot } from "../components/StudentRegistrationChatbot.jsx";

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

export function StudentRegistration({ logoUrl, onNavigate }) {
  const [showChatbot, setShowChatbot] = useState(false);
  const [batchesList, setBatchesList] = useState([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(() => {
    try {
      return localStorage.getItem("vaiswanara_show_registration_form") !== "false";
    } catch (_) {
      return true;
    }
  });

  useEffect(() => {
    const handleRegUpdate = () => {
      try {
        setIsRegistrationOpen(localStorage.getItem("vaiswanara_show_registration_form") !== "false");
      } catch (_) { }
    };
    window.addEventListener("vaiswanara_reg_setting_updated", handleRegUpdate);
    return () => {
      window.removeEventListener("vaiswanara_reg_setting_updated", handleRegUpdate);
    };
  }, []);

  const isBatchCurrentlyActive = (b) => {
    if (!b) return false;
    if (b.isActive === false || b.status === "inactive") return false;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    if (b.start_date && today < b.start_date) {
      return false;
    }
    if (b.end_date && today > b.end_date) {
      return false;
    }
    return true;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    whatsappNumber: "",
    confirmWhatsappNumber: "",
    language: "Kannada",
    batchId: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await getBatches();
        const loadedBatches = (res && res.batches && res.batches.length > 0) ? res.batches : [];
        setBatchesList(loadedBatches);

        // Pick first batch matching default language and active in date range
        const defaultLangBatches = loadedBatches.filter(
          b => (b.language || "").toLowerCase() === "kannada" && isBatchCurrentlyActive(b)
        );
        const firstBatchId = defaultLangBatches[0]?.id || "";
        setFormData(prev => ({ ...prev, batchId: firstBatchId }));
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    }
    loadBatches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "language") {
      // Find first batch for the selected language strictly within active date range
      const langBatches = batchesList.filter(
        b => (b.language || "").toLowerCase() === (value || "").toLowerCase() && isBatchCurrentlyActive(b)
      );
      const nextBatchId = langBatches[0]?.id || "";
      setFormData(prev => ({
        ...prev,
        language: value,
        batchId: nextBatchId
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "First Name is required.";
    }
    if (!formData.lastName.trim()) {
      return "Last Name is required.";
    }

    // Clean WhatsApp number
    const cleanWa = formData.whatsappNumber.replace(/[^0-9]/g, "");
    if (!cleanWa || cleanWa.length < 7 || cleanWa.length > 13) {
      return "Please enter a valid WhatsApp phone number (7-13 digits).";
    }

    const cleanConfirmWa = formData.confirmWhatsappNumber.replace(/[^0-9]/g, "");
    if (!cleanConfirmWa) {
      return "Please confirm your WhatsApp number.";
    }

    if (cleanWa !== cleanConfirmWa) {
      return "WhatsApp numbers do not match. Please verify your phone number.";
    }

    if (!formData.batchId) {
      return `No active batch available for ${formData.language}. Please select a different language or contact administration.`;
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    if (!formData.address.trim()) {
      return "Address is required. Please enter your residential address.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    const selectedBatch = batchesList.find(b => b.id === formData.batchId);
    const batchName = selectedBatch?.name || formData.batchId;

    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      country_code: formData.countryCode,
      whatsapp_number: formData.whatsappNumber.trim(),
      language: formData.language,
      batch_id: formData.batchId,
      batch_name: batchName,
      courses: [batchName],
      email: formData.email.trim(),
      address: formData.address.trim(),
    };

    try {
      const response = await registerStudent(payload);
      if (response && (response.success || response.student)) {
        setSuccessData(response.student || payload);
      } else {
        setErrorMessage(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultLangBatches = batchesList.filter(
      b => (b.language || "").toLowerCase() === "kannada" && (b.isActive !== false && b.status !== "inactive")
    );
    setFormData({
      firstName: "",
      lastName: "",
      countryCode: "+91",
      whatsappNumber: "",
      confirmWhatsappNumber: "",
      language: "Kannada",
      batchId: defaultLangBatches[0]?.id || "",
      email: "",
      address: "",
    });
    setSuccessData(null);
    setErrorMessage("");
  };

  const shareableUrl = `${window.location.origin}${window.location.pathname}?register`;

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      alert("Registration link copied to clipboard: " + shareableUrl);
    }
  };

  return (
    <main className="page student-reg-page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title="Student Registration"
        eyebrow="e-JYOTISHA GURUKULAM"
      />

      <style>{`
        .student-reg-page {
          padding-top: env(safe-area-inset-top);
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-bottom: 3.5rem;
          box-sizing: border-box;
        }

        .student-card {
          background: #ffffff;
          border: 1px solid rgba(138, 59, 36, 0.18);
          border-radius: 16px;
          box-shadow: 0 12px 36px rgba(63, 43, 24, 0.08);
          padding: 2rem;
          margin-top: 1.25rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .student-header-box {
          border-bottom: 1.5px solid #f3e8d9;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .student-header-title h2 {
          color: #7a3a27;
          margin: 0;
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .student-header-title p {
          color: #6b6255;
          margin: 0.35rem 0 0 0;
          font-size: 0.93rem;
          line-height: 1.4;
        }

        .share-url-btn {
          background: #fdf6ec;
          border: 1px solid #e0c8b0;
          color: #7a3a27;
          border-radius: 8px;
          padding: 0.55rem 0.95rem;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          min-height: 40px;
        }

        .share-url-btn:hover {
          background: #7a3a27;
          color: #ffffff;
          border-color: #7a3a27;
        }

        .form-section-title {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #a0523d;
          margin: 1.25rem 0 0.75rem 0;
          padding-bottom: 0.35rem;
          border-bottom: 1px dashed #ead9c6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          color: #3d3128;
          font-weight: 600;
          font-size: 0.92rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.25rem;
        }

        .form-group label .required {
          color: #dc2626;
          font-weight: 700;
          display: inline-block;
          margin-left: 2px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          min-height: 46px;
          padding: 0.7rem 0.9rem;
          border: 1px solid #dcd0c0;
          border-radius: 10px;
          background: #faf7f2;
          font-size: 1rem; /* 16px to prevent auto-zoom on iOS */
          color: #2d2419;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          background: #ffffff;
          border-color: #8a3b24;
          box-shadow: 0 0 0 3.5px rgba(138, 59, 36, 0.14);
        }

        .phone-group {
          display: flex;
          gap: 0.6rem;
          width: 100%;
        }

        .phone-group select {
          flex: 0 0 125px;
          max-width: 135px;
        }

        .phone-group input {
          flex: 1;
          min-width: 0;
        }

        .radio-group, .checkbox-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 2.25rem;
          flex-wrap: wrap;
          margin-top: 0.35rem;
          padding: 0.75rem 1.1rem;
          background: #fdfaf6;
          border: 1px solid #eee4d5;
          border-radius: 10px;
          min-height: 48px;
          box-sizing: border-box;
          width: 100%;
        }

        .simple-option-label {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 0.55rem;
          cursor: pointer;
          user-select: none;
          font-size: 0.96rem;
          font-weight: 500;
          color: #2d2419;
          white-space: nowrap;
        }

        .simple-option-label input {
          accent-color: #8a3b24;
          width: 18px;
          height: 18px;
          margin: 0;
          cursor: pointer;
          flex-shrink: 0;
        }

        .simple-option-label span {
          display: inline-block;
          line-height: 1;
        }

        .error-banner {
          background: #fef2f2;
          border: 1.5px solid #fca5a5;
          color: #991b1b;
          padding: 0.95rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 0.94rem;
          font-weight: 600;
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          line-height: 1.45;
        }

        .submit-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-submit {
          flex: 2;
          min-height: 48px;
          background: linear-gradient(135deg, #8a3b24 0%, #aa492f 100%);
          color: #ffffff;
          border: none;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(138, 59, 36, 0.28);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #78321e 0%, #993f27 100%);
          box-shadow: 0 10px 28px rgba(138, 59, 36, 0.38);
        }

        .btn-submit:active:not(:disabled) {
          transform: scale(0.99);
        }

        .btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-reset {
          flex: 1;
          min-height: 48px;
          background: #f5edd6;
          color: #5c4d3e;
          border: 1px solid #dcd0c0;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          font-size: 0.96rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-reset:hover {
          background: #ebdcb9;
        }

        /* Confirmation Box */
        .confirmation-box {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: 14px;
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .confirmation-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 1.25rem auto;
          box-shadow: 0 8px 22px rgba(16, 185, 129, 0.28);
        }

        .confirmation-box h3 {
          color: #065f46;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .confirmation-box p {
          color: #047857;
          margin: 0 0 1.5rem 0;
          font-size: 0.96rem;
          line-height: 1.45;
        }

        .summary-table {
          width: 100%;
          max-width: 580px;
          margin: 0 auto 1.75rem auto;
          border-collapse: separate;
          border-spacing: 0;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #d1fae5;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          text-align: left;
        }

        .summary-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #ecfdf5;
          font-size: 0.94rem;
        }

        .summary-table tr:last-child td {
          border-bottom: none;
        }

        .summary-table td.label {
          font-weight: 600;
          color: #374151;
          width: 38%;
          background: #f9fafb;
        }

        .summary-table td.value {
          color: #111827;
          font-weight: 500;
          word-break: break-word;
        }

        /* Mobile View Optimizations */
        @media (max-width: 640px) {
          .student-reg-page {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            padding-bottom: 4rem;
          }

          .student-card {
            padding: 1.25rem 1rem;
            border-radius: 14px;
            margin-top: 0.75rem;
          }

          .student-header-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
          }

          .student-header-title h2 {
            font-size: 1.3rem;
          }

          .share-url-btn {
            width: 100%;
            justify-content: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .phone-group select {
            flex: 0 0 105px;
            max-width: 110px;
            font-size: 0.92rem;
            padding-left: 0.5rem;
            padding-right: 0.3rem;
          }

          .radio-group, .checkbox-group {
            gap: 1.75rem;
            padding: 0.65rem 0.9rem;
            min-height: 46px;
          }

          .simple-option-label {
            font-size: 0.92rem;
            gap: 0.45rem;
          }

          .simple-option-label input {
            width: 18px;
            height: 18px;
          }

          .submit-actions {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }

          .btn-submit, .btn-reset {
            width: 100%;
          }

          .confirmation-box {
            padding: 1.5rem 1rem;
          }

          .summary-table td.label {
            width: 45%;
            font-size: 0.88rem;
          }
          .summary-table td.value {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <section className="student-card">
        <div className="student-header-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div className="student-header-title">
            <h2>🎓 Student Registration Form</h2>
            <p>Fill out the form below to enroll in our classes</p>
          </div>
          {isRegistrationOpen && !successData && (
            <button
              type="button"
              id="btn-open-reg-chatbot"
              onClick={() => setShowChatbot(true)}
              style={{
                background: "linear-gradient(135deg, #8a3b24 0%, #a0523d 100%)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "9px 16px",
                borderRadius: "12px",
                fontSize: "0.92rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(138, 59, 36, 0.28)",
                transition: "all 0.2s ease",
              }}
            >
              🤖 Register via Chatbot Assistant
            </button>
          )}
        </div>

        {errorMessage && (() => {
          const isAlready = /already|exist|registered|duplicate/i.test(errorMessage);
          const fullPhone = `${formData.countryCode} ${formData.whatsappNumber}`.trim();
          const matchedBatch = batchesList.find(b => b.id === formData.batchId);
          const rawAdminPhone = matchedBatch?.admin_whatsapp || matchedBatch?.contact_phone || localStorage.getItem("vaiswanara_admin_whatsapp") || "919482094290";
          let adminPhone = String(rawAdminPhone || "").replace(/[^0-9]/g, "");
          if (adminPhone.length === 10) adminPhone = "91" + adminPhone;
          if (adminPhone.startsWith("0") && adminPhone.length === 11) adminPhone = "91" + adminPhone.substring(1);
          if (!adminPhone) adminPhone = "919482094290";

          const msg = `Namaste Admin 🙏, I am trying to register for e-Jyotisha classes with WhatsApp number ${fullPhone}, but it says I am already registered. Please assist me.`;
          const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;

          return (
            <div className="error-banner" role="alert" style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span>⚠️</span>
                <div>
                  {isAlready
                    ? `A student with this WhatsApp number (${fullPhone || "+91 9493371910"}) is already registered. Please Contact the Admin.`
                    : errorMessage}
                </div>
              </div>
              {isAlready && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#ffffff",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "4px",
                    boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
                  }}
                >
                  💬 Contact Admin on WhatsApp
                </a>
              )}
            </div>
          );
        })()}

        {!isRegistrationOpen ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🔒</div>
            <h3 style={{ color: "#7a3a27", marginBottom: "10px", fontSize: "1.35rem", fontWeight: "700" }}>
              Student Registration is Currently Closed
            </h3>
            <p style={{ color: "#6b6255", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: 1.5 }}>
              The registration form has been paused by the administrator. Please check back later or contact the gurukulam administration for upcoming batch details.
            </p>
            {onNavigate && (
              <button
                type="button"
                className="btn-submit"
                onClick={() => onNavigate("Home")}
                style={{ maxWidth: "200px", margin: "0 auto" }}
              >
                Go to Home
              </button>
            )}
          </div>
        ) : successData ? (
          <div className="confirmation-box">
            <div className="confirmation-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering. Your details have been securely recorded.</p>

            <table className="summary-table">
              <tbody>
                {successData.id && (
                  <tr>
                    <td className="label">Registration ID</td>
                    <td className="value"><strong>{successData.id}</strong></td>
                  </tr>
                )}
                <tr>
                  <td className="label">Full Name</td>
                  <td className="value">{successData.first_name || successData.firstName} {successData.last_name || successData.lastName}</td>
                </tr>
                <tr>
                  <td className="label">WhatsApp Number</td>
                  <td className="value">{(successData.country_code || successData.countryCode)} {(successData.whatsapp_number || successData.whatsappNumber)}</td>
                </tr>
                <tr>
                  <td className="label">Medium Language</td>
                  <td className="value">{successData.language}</td>
                </tr>
                <tr>
                  <td className="label">Enrolled Batch</td>
                  <td className="value">
                    <strong>{successData.batch_name || successData.batch_id || successData.batchId || (Array.isArray(successData.courses) ? successData.courses.join(", ") : successData.courses)}</strong>
                  </td>
                </tr>
                {(successData.email) && (
                  <tr>
                    <td className="label">Email Address</td>
                    <td className="value">{successData.email}</td>
                  </tr>
                )}
                {(successData.address) && (
                  <tr>
                    <td className="label">Address</td>
                    <td className="value">{successData.address}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* WhatsApp Actions: Group Joining & Admin Confirmation */}
            {(() => {
              const matchedBatch = batchesList.find(b => b.id === (successData.batch_id || formData.batchId));
              const waGroupLink = matchedBatch?.whatsapp_group_link;
              const batchName = matchedBatch?.name || successData.batch_name || successData.batch_id || "Astrology Batch";
              const studentName = `${successData.first_name || successData.firstName || ""} ${successData.last_name || successData.lastName || ""}`.trim();
              const regId = successData.id || "STU";

              // English pre-filled confirmation message
              const confirmMsg = `Namaste 🙏, My name is ${studentName}. I have registered for ${batchName}. My Registration ID is ${regId}. Please confirm my enrollment.`;
              const encodedMsg = encodeURIComponent(confirmMsg);

              // Admin contact phone from batch, localStorage, or system default (919482094290)
              const rawAdminPhone = matchedBatch?.admin_whatsapp || matchedBatch?.contact_phone || localStorage.getItem("vaiswanara_admin_whatsapp") || "919482094290";
              let adminPhone = String(rawAdminPhone || "").replace(/[^0-9]/g, "");
              if (adminPhone.length === 10) adminPhone = "91" + adminPhone;
              if (adminPhone.startsWith("0") && adminPhone.length === 11) adminPhone = "91" + adminPhone.substring(1);
              if (!adminPhone) adminPhone = "919482094290";

              const adminWaLink = `https://wa.me/${adminPhone}?text=${encodedMsg}`;

              return (
                <div style={{
                  marginTop: "1.5rem",
                  padding: "1.25rem",
                  background: "#f0fdf4",
                  border: "1.5px solid #86efac",
                  borderRadius: "14px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                  <div>
                    <div style={{ fontWeight: "800", color: "#166534", fontSize: "1.05rem", marginBottom: "4px" }}>
                      📲 Next Steps: WhatsApp Group & Confirmation
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#15803d", margin: 0 }}>
                      Join your batch discussion group and send your registration details to the administrator:
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                    {waGroupLink && (
                      <a
                        href={waGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          background: "#25d366",
                          color: "#ffffff",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          fontWeight: "700",
                          fontSize: "14px",
                          textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>💬 Join Batch WhatsApp Group</span>
                        <span>➔</span>
                      </a>
                    )}

                    <a
                      href={adminWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#047857",
                        color: "#ffffff",
                        padding: "11px 20px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        fontSize: "13.5px",
                        textDecoration: "none",
                        boxShadow: "0 4px 10px rgba(4, 120, 87, 0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>📩 Send Confirmation Message to Admin</span>
                      <span>➔</span>
                    </a>
                  </div>
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="btn-submit"
                onClick={handleReset}
                style={{ maxWidth: "250px" }}
              >
                Register Another Student
              </button>
              {onNavigate && (
                <button
                  type="button"
                  className="btn-reset"
                  onClick={() => onNavigate("Home")}
                  style={{ maxWidth: "150px" }}
                >
                  Go to Home
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              {/* First Name */}
              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  placeholder="e.g. Sridhar"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  placeholder="e.g. Sarma"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* WhatsApp Number & Country Code */}
              <div className="form-group">
                <label htmlFor="whatsappNumber">
                  WhatsApp Number <span className="required">*</span>
                </label>
                <div className="phone-group">
                  <select
                    name="countryCode"
                    className="form-select"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.country} value={c.code}>
                        {c.code} {c.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Confirm WhatsApp Number (Consistency Check) */}
              <div className="form-group">
                <label htmlFor="confirmWhatsappNumber">
                  Confirm WhatsApp Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="confirmWhatsappNumber"
                  name="confirmWhatsappNumber"
                  className="form-input"
                  placeholder="Re-enter WhatsApp number for consistency"
                  value={formData.confirmWhatsappNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Language Selection */}
              <div className="form-group full-width">
                <label>
                  Language <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <label className="simple-option-label">
                    <input
                      type="radio"
                      name="language"
                      value="Kannada"
                      checked={formData.language === "Kannada"}
                      onChange={handleInputChange}
                    />
                    <span>Kannada</span>
                  </label>
                  <label className="simple-option-label">
                    <input
                      type="radio"
                      name="language"
                      value="Telugu"
                      checked={formData.language === "Telugu"}
                      onChange={handleInputChange}
                    />
                    <span>Telugu</span>
                  </label>
                </div>
              </div>

              {/* BATCH Select (Filtered by Language and Active Dates) */}
              <div className="form-group full-width">
                <label htmlFor="batchId">
                  BATCH <span className="required">*</span>
                </label>
                {(() => {
                  const filtered = batchesList.filter(
                    b => (b.language || "").toLowerCase() === (formData.language || "").toLowerCase() && isBatchCurrentlyActive(b)
                  );
                  if (filtered.length === 0) {
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <select
                          id="batchId"
                          name="batchId"
                          className="form-select"
                          disabled
                          value=""
                          style={{ background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
                        >
                          <option value="">-- No Active Batches Available for {formData.language} --</option>
                        </select>
                        <div style={{
                          fontSize: "0.86rem",
                          color: "#be123c",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "2px"
                        }}>
                          <span>⚠️</span>
                          <span>Currently no active batches within the valid date range are open for {formData.language}.</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <select
                      id="batchId"
                      name="batchId"
                      className="form-select"
                      value={formData.batchId}
                      onChange={handleInputChange}
                      required
                    >
                      {filtered.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name || b.id} {b.remarks ? `— ${b.remarks}` : ""}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              {/* Email (Optional) */}
              <div className="form-group full-width">
                <label htmlFor="email">
                  Email Address <span style={{ color: "#888", fontWeight: "400" }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g. student@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Address (Mandatory) */}
              <div className="form-group full-width">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter full postal address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

            </div>

            <div className="submit-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={
                  loading ||
                  !formData.batchId ||
                  batchesList.filter(
                    b => (b.language || "").toLowerCase() === (formData.language || "").toLowerCase() && isBatchCurrentlyActive(b)
                  ).length === 0
                }
              >
                {loading ? "Registering..." : "Submit Registration"}
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                disabled={loading}
              >
                Clear Form
              </button>
              <button
                type="button"
                className="btn-share"
                onClick={copyShareLink}
                title="Copy Registration Link to Share"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                🔗 Share Link
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Interactive Admission Chatbot */}
      <StudentRegistrationChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        batchesList={batchesList}
        onApplyToForm={(chatData) => {
          setFormData((prev) => ({
            ...prev,
            ...(chatData.firstName ? { firstName: chatData.firstName } : {}),
            ...(chatData.lastName ? { lastName: chatData.lastName } : {}),
            ...(chatData.countryCode ? { countryCode: chatData.countryCode } : {}),
            ...(chatData.whatsappNumber ? { whatsappNumber: chatData.whatsappNumber, confirmWhatsappNumber: chatData.whatsappNumber } : {}),
            ...(chatData.language ? { language: chatData.language } : {}),
            ...(chatData.batchId ? { batchId: chatData.batchId } : {}),
            ...(chatData.email !== undefined ? { email: chatData.email } : {}),
            ...(chatData.address !== undefined ? { address: chatData.address } : {}),
          }));
        }}
        onRegistrationSuccess={(student) => {
          setSuccessData(student);
          setShowChatbot(false);
        }}
      />
    </main>
  );
}
