import React, { useState, useEffect } from "react";
import { LocationAutocomplete } from "./LocationAutocomplete.jsx";
import { useTranslation } from "react-i18next";

export function MatchDetailsForm({
  boyData,
  girlData,
  onBoyChange,
  onGirlChange,
  onSubmit,
  loading,
}) {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState({});
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    type: "boy",
  });
  const [popupTab, setPopupTab] = useState("input");
  const [editFormData, setEditFormData] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    setProfiles(saved);
    if (!popupConfig.isOpen) {
      setSearchQuery("");
    }
  }, [popupConfig.isOpen]);

  const handleOpenPopup = (type) => {
    setEditFormData(type === "boy" ? boyData : girlData);
    setPopupTab("input");
    setSearchQuery("");
    setPopupConfig({ isOpen: true, type });
  };

  const handleProfileSelect = (name) => {
    const p = profiles[name];
    if (p) {
      setEditFormData({
        ...editFormData,
        name: name,
        dob: p.dob || editFormData.dob,
        tob: p.tob || editFormData.tob,
        city: p.city || "",
        latitude: p.latitude || editFormData.latitude,
        longitude: p.longitude || editFormData.longitude,
        timezone: p.timezone || editFormData.timezone,
      });
      setPopupTab("input");
    }
  };

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleNewDetails = () => {
    const savedLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location") || "null",
    );
    setEditFormData({
      name: "",
      dob: getTodayDate(),
      tob: getCurrentTime(),
      city: savedLoc?.city || "Bengaluru, India",
      latitude: savedLoc?.latitude || "12.9716",
      longitude: savedLoc?.longitude || "77.5946",
      timezone: savedLoc?.timezone || "5.5",
    });
    setPopupTab("input");
  };

  const handleApplyPopup = () => {
    if (popupConfig.type === "boy") {
      onBoyChange(editFormData);
    } else {
      onGirlChange(editFormData);
    }
    setPopupConfig({ isOpen: false, type: "boy" });
  };

  const handleSaveProfile = () => {
    const profileName = editFormData.name?.trim();
    if (
      !profileName ||
      profileName === t("groom") ||
      profileName === t("bride")
    ) {
      alert("Please enter a specific Name to save this profile.");
      return;
    }
    const currentProfiles = { ...profiles };
    currentProfiles[profileName] = {
      ...editFormData,
      gender: popupConfig.type === "boy" ? "male" : "female",
    };
    localStorage.setItem(
      "vaiswanara_profiles",
      JSON.stringify(currentProfiles),
    );
    setProfiles(currentProfiles);
    alert(`Profile "${profileName}" saved successfully!`);
  };

  const filteredProfiles = Object.keys(profiles).filter((name) => {
    const matchesGender = popupConfig.type === "boy"
      ? profiles[name].gender !== "female"
      : profiles[name].gender === "female";
    const matchesSearch = searchQuery.trim() === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profiles[name].city || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSearch;
  });

  return (
    <div style={{ marginBottom: "20px" }}>
      <style>{`
        .top-bar-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #eaecee;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          margin-bottom: 15px;
          width: 100%;
          box-sizing: border-box;
          gap: 12px;
        }
        .top-bar-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          cursor: pointer;
          min-width: 0;
          transition: transform 0.1s ease-in-out;
          padding: 8px;
          border-radius: 8px;
        }
        .top-bar-details:hover {
          background: #f8f9fa;
        }
        .top-bar-details:active {
          transform: scale(0.98);
        }
        .top-bar-divider {
          width: 1px;
          background: #eaecee;
          align-self: stretch;
          margin: 0 5px;
        }
        
        .btn-submit-match {
          background: linear-gradient(135deg, #8e44ad, #9b59b6);
          color: white;
          padding: 14px 28px;
          font-size: 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.3);
          transition: all 0.2s ease;
          width: 100%;
          display: block;
        }
        .btn-submit-match:hover {
          background: linear-gradient(135deg, #7a3a92, #8e44ad);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(142, 68, 173, 0.4);
        }
        .btn-submit-match:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .popup-container {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); z-index: 1000;
          display: flex; justify-content: center; align-items: center;
          padding: 20px; backdrop-filter: blur(4px);
        }
        .popup-content {
          background: #fff; padding: 30px; border-radius: 16px;
          width: 100%; max-width: 650px; max-height: 90vh;
          overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .popup-container { padding: 15px; }
          .popup-content { padding: 20px; }
        }
        .popup-tab {
          flex: 1;
          padding: 12px 10px;
          border: none;
          background: transparent;
          font-weight: 600;
          font-size: 15px;
          color: #7f8c8d;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .popup-tab.active {
          color: #8e44ad;
          border-bottom: 2px solid #8e44ad;
        }
        .profile-card {
          padding: 12px;
          border: 1px solid #eaecee;
          border-radius: 10px;
          cursor: pointer;
          background: #fdfefe;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-card:hover {
          background: #f5f6f8;
        }
        
        .match-form-input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #dcdde1;
          font-size: 15px;
          outline: none;
          background: #fdfefe;
          box-sizing: border-box;
        }
        .match-form-input:focus {
          border-color: #8e44ad;
          box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
        }
        .match-form-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          font-weight: bold;
          color: #2c3e50;
        }
      `}</style>

      {/* TOP BAR */}
      <div className="top-bar-card">
        <div className="top-bar-details" onClick={() => handleOpenPopup("boy")}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#3498db",
              marginBottom: "4px",
            }}
          >
             {boyData.name || t("groom")}
          </div>
          <div
            style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50" }}
          >
            📅 {boyData.dob}{" "}
            <span style={{ color: "#bdc3c7", margin: "0 4px" }}>|</span> ⏰{" "}
            {boyData.tob}
          </div>
        </div>

        <div className="top-bar-divider"></div>

        <div
          className="top-bar-details"
          onClick={() => handleOpenPopup("girl")}
          style={{ alignItems: "flex-end", textAlign: "right" }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#e74c3c",
              marginBottom: "4px",
            }}
          >
             {girlData.name || t("bride")}
          </div>
          <div
            style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50" }}
          >
            📅 {girlData.dob}{" "}
            <span style={{ color: "#bdc3c7", margin: "0 4px" }}>|</span> ⏰{" "}
            {girlData.tob}
          </div>
        </div>
      </div>

      {/* CALCULATE BUTTON */}
      <button
        type="button"
        className="btn-submit-match"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading
          ? "⏳ " + t("processingMatch", "Processing Match...")
          : "✨ " + t("calcAshtakutaMatch", "Calculate Compatibility Match")}
      </button>

      {/* POPUP MODAL */}
      {popupConfig.isOpen && (
        <div
          className="popup-container"
          onClick={() => setPopupConfig({ ...popupConfig, isOpen: false })}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3
              style={{
                marginTop: 0,
                color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                borderBottom: "2px solid #f1f2f6",
                paddingBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                ✏️{" "}
                {popupConfig.type === "boy"
                  ? t("boyDetails", "Boy Details")
                  : t("girlDetails", "Girl Details")}
              </span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleNewDetails}
                  style={{
                    background: "#ebf5fb",
                    border: `1px solid ${popupConfig.type === "boy" ? "#3498db" : "#e74c3c"}`,
                    color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    minHeight: "auto",
                    lineHeight: "1",
                  }}
                >
                  {t("new", "New")}
                </button>
                <span
                  style={{
                    cursor: "pointer",
                    background: "#f8f9fa",
                    padding: "4px 8px",
                    borderRadius: "50%",
                    fontSize: "14px",
                    color: "#333",
                  }}
                  onClick={() =>
                    setPopupConfig({ ...popupConfig, isOpen: false })
                  }
                >
                  ❌
                </span>
              </div>
            </h3>

            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #eaecee",
                marginBottom: "15px",
              }}
            >
              <button
                className={`popup-tab ${popupTab === "input" ? "active" : ""}`}
                onClick={() => setPopupTab("input")}
              >
                Manual Entry
              </button>
              <button
                className={`popup-tab ${popupTab === "profiles" ? "active" : ""}`}
                onClick={() => setPopupTab("profiles")}
              >
                Saved Profiles
              </button>
            </div>

            {popupTab === "input" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <label className="match-form-label">
                  Name (to Save Profile):
                  <input
                    type="text"
                    value={editFormData.name || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    placeholder="Enter name here..."
                    className="match-form-input"
                  />
                </label>
                <div style={{ display: "flex", gap: "15px" }}>
                  <label className="match-form-label" style={{ flex: 1 }}>
                    Date:
                    <input
                      type="date"
                      value={editFormData.dob || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dob: e.target.value,
                        })
                      }
                      className="match-form-input"
                      required
                    />
                  </label>
                  <label className="match-form-label" style={{ flex: 1 }}>
                    Time:
                    <input
                      type="time"
                      value={editFormData.tob || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          tob: e.target.value,
                        })
                      }
                      className="match-form-input"
                      required
                    />
                  </label>
                </div>

                <LocationAutocomplete
                  city={editFormData.city}
                  onLocationSelect={(loc) =>
                    setEditFormData({
                      ...editFormData,
                      city: loc.city,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      timezone: loc.timezone,
                    })
                  }
                />

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "15px",
                    paddingTop: "15px",
                  }}
                >
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1,
                      background: "#27ae60",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(39, 174, 96, 0.2)",
                    }}
                    title="Save the current details as a new profile"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={handleApplyPopup}
                    style={{
                      flex: 1,
                      background:
                        popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow:
                        popupConfig.type === "boy"
                          ? "0 4px 10px rgba(52, 152, 219, 0.3)"
                          : "0 4px 10px rgba(231, 76, 60, 0.3)",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {popupTab === "profiles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder={t("searchProfiles", "Search profiles...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dcdde1",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "#fdfefe",
                    boxSizing: "border-box",
                    marginBottom: "5px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    padding: "5px 0",
                  }}
                >
                  {filteredProfiles.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#7f8c8d",
                        padding: "20px 0",
                      }}
                    >
                      No saved profiles found for{" "}
                      {popupConfig.type === "boy" ? "Boy" : "Girl"}.
                    </p>
                  ) : (
                    filteredProfiles.map((name) => (
                      <div
                        key={name}
                        className="profile-card"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          onClick={() => handleProfileSelect(name)}
                          style={{ flex: 1, cursor: "pointer", padding: "4px 0", textAlign: "left" }}
                        >
                          <strong
                            style={{
                              color:
                                popupConfig.type === "boy"
                                  ? "#3498db"
                                  : "#e74c3c",
                              fontSize: "15px",
                              display: "block",
                              marginBottom: "4px",
                              textAlign: "left",
                            }}
                          >
                            {name}
                          </strong>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#7f8c8d",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              textAlign: "left",
                            }}
                          >
                            <span>📅 {profiles[name].dob ? profiles[name].dob.split('-').reverse().join('-') : ''}</span>
                            <span>⏰ {profiles[name].tob || ''}</span>
                            <span>📍 {profiles[name].city ? profiles[name].city.split(',')[0].trim() : (profiles[name].city || t("manualCoords", "Manual Coords"))}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProfileSelect(name);
                            }}
                            title="Edit"
                            style={{
                              background: "#ebf5fb",
                              border: `1px solid ${popupConfig.type === "boy" ? "#3498db" : "#e74c3c"}`,
                              color: popupConfig.type === "boy" ? "#3498db" : "#e74c3c",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              cursor: "pointer",
                              fontSize: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: "auto",
                              padding: 0,
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Are you sure you want to delete the profile "${name}"?`,
                                )
                              ) {
                                const currentProfiles = { ...profiles };
                                delete currentProfiles[name];
                                setProfiles(currentProfiles);
                                localStorage.setItem(
                                  "vaiswanara_profiles",
                                  JSON.stringify(currentProfiles),
                                );
                              }
                            }}
                            title="Delete"
                            style={{
                              background: "#fdedec",
                              border: "1px solid #e74c3c",
                              color: "#e74c3c",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              cursor: "pointer",
                              fontSize: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: "auto",
                              padding: 0,
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
