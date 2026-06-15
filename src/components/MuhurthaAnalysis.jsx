import React, { useState, useEffect } from "react";

export default function MuhurthaAnalysis() {
  const [profiles, setProfiles] = useState({});
  const [selectedProfile, setSelectedProfile] = useState("");
  const [profileData, setProfileData] = useState(null);

  // Load profiles from localStorage on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    try {
      const savedProfiles = JSON.parse(
        localStorage.getItem("panchanga_profiles") || "{}",
      );
      setProfiles(savedProfiles);
    } catch (e) {
      console.error("Failed to load panchanga_profiles:", e);
    }
  };

  const handleProfileChange = (e) => {
    const name = e.target.value;
    setSelectedProfile(name);
    if (name && profiles[name]) {
      setProfileData(profiles[name]);
    } else {
      setProfileData(null);
    }
  };

  const handleDeleteProfile = () => {
    if (!selectedProfile) return;
    if (
      window.confirm(`Are you sure you want to delete "${selectedProfile}"?`)
    ) {
      const updatedProfiles = { ...profiles };
      delete updatedProfiles[selectedProfile];
      localStorage.setItem(
        "panchanga_profiles",
        JSON.stringify(updatedProfiles),
      );
      setProfiles(updatedProfiles);
      setSelectedProfile("");
      setProfileData(null);
    }
  };

  const getFilteredKeys = (row) => {
    return Object.keys(row).filter((k) => !k.endsWith("_is_good"));
  };

  return (
    <div
      className="card"
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "100%",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <h3
        className="section-title"
        style={{
          color: "#8e44ad",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
          marginTop: 0,
        }}
      >
        Saved Muhurtha Profiles
      </h3>

      <div
        className="profile-bar"
        style={{
          display: "flex",
          gap: "10px",
          background: "#f9f0ff",
          padding: "15px",
          borderRadius: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={selectedProfile}
          onChange={handleProfileChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <option value="">-- Select Saved Profile --</option>
          {Object.keys(profiles).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {selectedProfile && (
          <button
            onClick={handleDeleteProfile}
            style={{
              background: "#e74c3c",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Delete
          </button>
        )}
      </div>

      {profileData && profileData.rows && profileData.rows.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              marginBottom: "15px",
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "6px",
              border: "1px solid #ddd",
              color: "#2c3e50",
            }}
          >
            <strong>Location:</strong>{" "}
            {profileData.location?.city || "Manual Coords"} (Lat:{" "}
            {profileData.location?.lat}, Lon: {profileData.location?.lon})
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  {getFilteredKeys(profileData.rows[0]).map((k) => (
                    <th
                      key={k}
                      style={{
                        background: "#8e44ad",
                        color: "white",
                        padding: "8px",
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {k.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profileData.rows.map((row, index) => (
                  <tr key={index}>
                    {getFilteredKeys(row).map((k) => {
                      let dataKey = Object.prototype.hasOwnProperty.call(row, k)
                        ? k
                        : k.replace(/ /g, "_");
                      let goodKey = k.replace(/ /g, "_") + "_is_good";

                      let isGood = row[goodKey] === true;
                      let isAsthgDanger = k === "Asthg" && row[dataKey] !== "-";
                      let isAshtama =
                        k.includes("Chandra Balam") &&
                        row[dataKey] === "Ashtama";

                      let cellStyle = {
                        padding: "8px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      };

                      if (isGood) {
                        cellStyle.background = "#eafaf1";
                        cellStyle.color = "#1e8449";
                        cellStyle.fontWeight = "bold";
                      } else if (isAsthgDanger || isAshtama) {
                        cellStyle.background = "#fdedec";
                        cellStyle.color = "#c0392b";
                        cellStyle.fontWeight = "bold";
                      }

                      return (
                        <td key={k} style={cellStyle}>
                          {row[dataKey] !== undefined ? row[dataKey] : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
