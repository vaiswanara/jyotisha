import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";
import { triggerDownload } from "../utils/downloadHelper.js";

export function ProfilesPage({ logoUrl, onNavigate }) {
  const [profiles, setProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadProfiles();
  }, []);

  function loadProfiles() {
    const saved = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    setProfiles(saved);
  }

  function handleDelete(name) {
    if (!window.confirm(t("confirmDelete", { name }))) return;
    const updated = { ...profiles };
    delete updated[name];
    localStorage.setItem("vaiswanara_profiles", JSON.stringify(updated));
    setProfiles(updated);
  }

  function handleLoadAndEdit(name) {
    sessionStorage.setItem(
      "vaiswanara_load_profile",
      JSON.stringify(profiles[name]),
    );
    onNavigate("e-Jataka");
  }

  function handleExport() {
    if (Object.keys(profiles).length === 0) {
      alert(t("noProfilesBackup"));
      return;
    }
    const exportData = {
      version: "2.0",
      exported: new Date().toISOString(),
      profiles,
    };
    triggerDownload(
      JSON.stringify(exportData, null, 2),
      "vaiswanara_profiles_backup.json",
    );
  }

  function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const incoming = parsed.profiles || parsed;
        if (typeof incoming !== "object" || Array.isArray(incoming))
          throw new Error("Invalid backup format");

        const cleanProfiles = {};
        for (const key in incoming) {
          if (typeof incoming[key] === "object" && incoming[key] !== null) {
            const { tab, ...rest } = incoming[key];
            cleanProfiles[key] = rest;
          }
        }
        const existing = JSON.parse(
          localStorage.getItem("vaiswanara_profiles") || "{}",
        );
        localStorage.setItem(
          "vaiswanara_profiles",
          JSON.stringify({ ...existing, ...cleanProfiles }),
        );
        alert(t("importSuccess", { count: Object.keys(cleanProfiles).length }));
        loadProfiles();
      } catch (err) {
        alert(t("importFailed") + err.message);
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  return (
    <main className="page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("profiles")}
        eyebrow="e-JYOTISHA"
        subtitle={t("manageProfilesDesc")}
      />
      <section
        className="workspace"
        style={{
          gridTemplateColumns: "1fr",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        }}
      >
        <div className="form-panel" style={{ position: "static" }}>
          {/* Row 1: Heading */}
          <h2 style={{ margin: "0 0 10px 0" }}>{t("savedProfiles")}</h2>

          {/* Row 2: Search Field */}
          <input
            type="text"
            placeholder={t("searchProfiles", "Search profiles...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              padding: "0.5rem 1rem",
              border: "1px solid #eadfce",
              borderRadius: "4px",
              fontSize: "0.85rem",
              background: "#fffdf8",
              color: "#333",
              outline: "none",
              marginBottom: "10px",
            }}
          />

          {/* Row 3: Action Buttons — equal-width, one row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("vaiswanara_load_profile");
                onNavigate("e-Jataka");
              }}
              style={{
                background: "#8e44ad",
                padding: "0.5rem 0.75rem",
                minHeight: "auto",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t("new", "New")}
            </button>
            <button
              type="button"
              onClick={handleExport}
              style={{
                background: "#2873a8",
                padding: "0.5rem 0.75rem",
                minHeight: "auto",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t("exportJson")}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={{
                background: "#27ae60",
                padding: "0.5rem 0.75rem",
                minHeight: "auto",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t("import")}
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </div>
          {Object.keys(profiles).length === 0 ? (
            <p style={{ color: "#857869", marginTop: "20px" }}>
              {t("noSavedProfiles")}
            </p>
          ) : (
            <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
              {(() => {
                const filteredNames = Object.keys(profiles)
                  .filter((name) => {
                    const p = profiles[name] || {};
                    const query = searchQuery.trim().toLowerCase();
                    if (!query) return true;
                    const nameMatch = name.toLowerCase().includes(query);
                    const cityMatch = p.city && p.city.toLowerCase().includes(query);
                    const dobMatch = p.dob && p.dob.toLowerCase().includes(query);
                    return nameMatch || cityMatch || dobMatch;
                  })
                  .sort();

                if (filteredNames.length === 0) {
                  return (
                    <p style={{ color: "#857869", marginTop: "20px" }}>
                      {t("noMatchingProfiles", "No matching profiles found.")}
                    </p>
                  );
                }

                return filteredNames.map((name) => {
                  const p = profiles[name];
                  return (
                    <div
                      key={name}
                      style={{
                        background: "#fffdf8",
                        border: "1px solid #eadfce",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {/* Left: Profile Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#8a3b24",
                            fontSize: "1rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#857869", marginTop: "3px" }}>
                          {p.dob}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#857869" }}>
                          {p.tob}
                        </div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "#857869",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {(p.city || t("manualCoords")).split(",")[0].trim()}
                        </div>
                      </div>

                      {/* Right: Icon Buttons */}
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button
                          type="button"
                          title={t("loadEdit")}
                          onClick={() => handleLoadAndEdit(name)}
                          style={{
                            background: "#2873a8",
                            border: "none",
                            borderRadius: "6px",
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            padding: 0,
                            minHeight: "auto",
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          title={t("delete")}
                          onClick={() => handleDelete(name)}
                          style={{
                            background: "#c0392b",
                            border: "none",
                            borderRadius: "6px",
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            padding: 0,
                            minHeight: "auto",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </section>

      <footer
        className="no-print"
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "13px",
          color: "#7f8c8d",
          marginTop: "auto",
        }}
      >
        <button
          onClick={() => onNavigate("Privacy")}
          style={{
            background: "none",
            border: "none",
            color: "#3498db",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "13px",
            padding: 0,
          }}
        >
          {t("Privacy", "Privacy Policy")}
        </button>
      </footer>
    </main>
  );
}
