import React, { useState, useEffect } from "react";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { registerStudent, getBatches } from "../services/astrologyApi.js";

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
  const [batchesList, setBatchesList] = useState([
    { id: "JK-2026-OCT", name: "Jyotisha Kannada - October 2026 Batch", course_id: "Jyotisha" },
    { id: "MS-2026", name: "Mana Shastra - 2026 Batch", course_id: "ManaShastra" }
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    whatsappNumber: "",
    confirmWhatsappNumber: "",
    language: "Kannada",
    courses: ["Jyotisha"],
    batchId: "JK-2026-OCT",
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
        if (res && res.batches && res.batches.length > 0) {
          setBatchesList(res.batches);
          if (res.batches[0]?.id) {
            setFormData(prev => ({ ...prev, batchId: prev.batchId || res.batches[0].id }));
          }
        }
      } catch (err) {
        console.warn("Using default fallback batches:", err);
      }
    }
    loadBatches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleCourseSelectionChange = (e) => {
    const selectedCourseVal = e.target.value;
    let selectedCoursesArray = ["Jyotisha"];
    if (selectedCourseVal === "ManaShastra") {
      selectedCoursesArray = ["ManaShastra"];
    } else if (selectedCourseVal === "Both") {
      selectedCoursesArray = ["Jyotisha", "ManaShastra"];
    }

    // Auto-pick first matching batch for the newly selected course
    const matchingBatch = batchesList.find(b =>
      b.course_id === selectedCourseVal || b.course_name === selectedCourseVal || selectedCourseVal === "Both"
    );
    const nextBatchId = matchingBatch?.id || batchesList[0]?.id || "";

    setFormData(prev => ({
      ...prev,
      courses: selectedCoursesArray,
      batchId: nextBatchId
    }));
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

    if (!formData.courses || formData.courses.length === 0) {
      return "Please select at least one course (Jyotisha or ManaShastra).";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }
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

    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      country_code: formData.countryCode,
      whatsapp_number: formData.whatsappNumber.trim(),
      language: formData.language,
      courses: formData.courses,
      batch_id: formData.batchId,
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
    setFormData({
      firstName: "",
      lastName: "",
      countryCode: "+91",
      whatsappNumber: "",
      confirmWhatsappNumber: "",
      language: "Kannada",
      courses: ["Jyotisha", "ManaShastra"],
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
        <div className="student-header-box">
          <div className="student-header-title">
            <h2>🎓 Student Registration Form</h2>
            <p>Fill out the form below to enroll in our classes</p>
          </div>
          <button
            type="button"
            className="share-url-btn"
            onClick={copyShareLink}
            title="Copy Registration Link"
          >
            🔗 Share Link
          </button>
        </div>

        {errorMessage && (
          <div className="error-banner" role="alert">
            <span>⚠️</span>
            <div>{errorMessage}</div>
          </div>
        )}

        {successData ? (
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
                  <td className="label">Selected Courses</td>
                  <td className="value">
                    {Array.isArray(successData.courses)
                      ? successData.courses.join(", ")
                      : successData.courses}
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

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
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
                  placeholder="e.g. Anjaneyulu"
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
                  placeholder="e.g. Sharma"
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

              {/* COURSE Select */}
              <div className="form-group">
                <label htmlFor="courseSelect">
                  COURSE <span className="required">*</span>
                </label>
                <select
                  id="courseSelect"
                  name="courseSelect"
                  className="form-select"
                  value={
                    formData.courses.length > 1
                      ? "Both"
                      : formData.courses[0] || "Jyotisha"
                  }
                  onChange={handleCourseSelectionChange}
                >
                  <option value="Jyotisha">Jyotisha - Kannada (JK)</option>
                  <option value="ManaShastra">Mana Shastra (MS)</option>
                  <option value="Both">Both Courses (Jyotisha + ManaShastra)</option>
                </select>
              </div>

              {/* BATCH Select */}
              <div className="form-group">
                <label htmlFor="batchId">
                  BATCH <span className="required">*</span>
                </label>
                <select
                  id="batchId"
                  name="batchId"
                  className="form-select"
                  value={formData.batchId}
                  onChange={handleInputChange}
                >
                  {batchesList
                    .filter(b => {
                      const cur = formData.courses.length > 1 ? "Both" : formData.courses[0];
                      if (cur === "Both") return true;
                      return b.course_id === cur || b.course_name === cur || !b.course_id;
                    })
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name || b.id}
                      </option>
                    ))}
                </select>
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

              {/* Address */}
              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter full postal address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

            </div>

            <div className="submit-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
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
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
