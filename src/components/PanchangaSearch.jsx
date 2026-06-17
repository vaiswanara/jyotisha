import React, { useState, useEffect, useRef } from "react";
import { LocationAutocomplete } from "./LocationAutocomplete.jsx";
import { useTranslation } from "react-i18next";
import { getLocalDateStr } from "../utils/formatters.js";


const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Arudra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

function getDefaultLocation() {
  try {
    const savedLoc = JSON.parse(
      localStorage.getItem("vaiswanara_default_location"),
    );
    if (savedLoc)
      return {
        city: savedLoc.city || "",
        latitude: savedLoc.latitude,
        longitude: savedLoc.longitude,
        timezone: savedLoc.timezone,
      };
  } catch (e) {}
  return { city: "", latitude: "13.13", longitude: "78.8", timezone: "5.5" };
}

export default function PanchangaSearch() {
  const { t } = useTranslation();
  const defaultLoc = getDefaultLocation();
  const [formData, setFormData] = useState({
    exportName: "Panchanga",
    date: getLocalDateStr(defaultLoc.timezone),
    days: 10,
    city: defaultLoc.city,
    latitude: defaultLoc.latitude,
    longitude: defaultLoc.longitude,
    timezone: defaultLoc.timezone,
    boyCheck: false,
    boyNakshatra: "",
    girlCheck: false,
    girlNakshatra: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [originalResults, setOriginalResults] = useState([]);
  const [results, setResults] = useState([]);
  const [prefs, setPrefs] = useState({});
  const [isPanShudhiActive, setIsPanShudhiActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

  const csvRef = useRef(null);

  useEffect(() => {
    try {
      const loadedPrefs = JSON.parse(
        localStorage.getItem("eclock_prefs") || "{}",
      );
      setPrefs(loadedPrefs);
    } catch (e) {
      console.error("Failed to load eclock_prefs:", e);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatTimeWithNextDay = (timeStr, sunriseStr) => {
    if (!timeStr || timeStr === "-" || timeStr.includes("+")) return timeStr;
    const parseMins = (t) => {
      const m = String(t).match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return null;
      let h = parseInt(m[1], 10);
      if (h === 12) h = m[3].toUpperCase() === "AM" ? 0 : 12;
      else if (m[3].toUpperCase() === "PM") h += 12;
      return h * 60 + parseInt(m[2], 10);
    };
    const tMins = parseMins(timeStr);
    const srMins = parseMins(sunriseStr);
    if (tMins !== null && srMins !== null && tMins < srMins) {
      return `+${timeStr}`;
    }
    return timeStr;
  };

  const formatRangeWithNextDay = (rangeStr, sunriseStr) => {
    if (!rangeStr || rangeStr === "-") return "-";
    return rangeStr
      .split(", ")
      .map((range) =>
        range
          .split(" - ")
          .map((t) => formatTimeWithNextDay(t.trim(), sunriseStr))
          .join(" - "),
      )
      .join(", ");
  };

  const evaluatePanShudhiFlags = (dataArray, preferences) => {
    if (!dataArray || !Array.isArray(dataArray)) return dataArray;
    const isGood = (val, arr) =>
      Array.isArray(arr) ? arr.includes(val) : false;

    return dataArray.map((row) => {
      const newRow = { ...row };

      // టేబుల్ లో మాసం కోసం రీప్లేస్మెంట్
      if (newRow.Maasa) {
        newRow.Maasa = String(newRow.Maasa).replace("Magha", "Maaga");
      }

      const sr = newRow.Sunrise;
      if (sr) {
        if (newRow["Tithi End"])
          newRow["Tithi End"] = newRow["Tithi End"]
            .split(" / ")
            .map((t) => formatTimeWithNextDay(t, sr))
            .join(" / ");
        if (newRow["Nakshatra End"])
          newRow["Nakshatra End"] = newRow["Nakshatra End"]
            .split(" / ")
            .map((t) => formatTimeWithNextDay(t, sr))
            .join(" / ");
        if (newRow["Yoga End"])
          newRow["Yoga End"] = newRow["Yoga End"]
            .split(" / ")
            .map((t) => formatTimeWithNextDay(t, sr))
            .join(" / ");
        if (newRow["Karana End"])
          newRow["Karana End"] = newRow["Karana End"]
            .split(" / ")
            .map((t) => formatTimeWithNextDay(t, sr))
            .join(" / ");
        if (newRow["Rahu Kalam"])
          newRow["Rahu Kalam"] = formatRangeWithNextDay(
            newRow["Rahu Kalam"],
            sr,
          );
        if (newRow["Yamagandam"])
          newRow["Yamagandam"] = formatRangeWithNextDay(
            newRow["Yamagandam"],
            sr,
          );
        if (newRow["Durmuhurtham"])
          newRow["Durmuhurtham"] = formatRangeWithNextDay(
            newRow["Durmuhurtham"],
            sr,
          );
        if (newRow["Varjyam"])
          newRow["Varjyam"] = formatRangeWithNextDay(newRow["Varjyam"], sr);
      }

      if (newRow.Maasa !== undefined)
        newRow.Maasa_is_good = isGood(newRow.Maasa, preferences.maasa);
      if (newRow.Vaara !== undefined)
        newRow.Vaara_is_good = isGood(newRow.Vaara, preferences.vaara);
      if (newRow.Tithi !== undefined) {
        const firstTithi = String(newRow.Tithi).split(" / ")[0];
        let tCheck = firstTithi
          .replace("Shukla ", "S-")
          .replace("Krishna ", "K-");
        newRow.Tithi_is_good =
          isGood(tCheck, preferences.tithi) ||
          isGood(firstTithi, preferences.tithi);
      }
      if (newRow.Nakshatra !== undefined) {
        const firstNak = String(newRow.Nakshatra).split(" / ")[0];
        newRow.Nakshatra_is_good = isGood(firstNak, preferences.nakshatra);
      }
      if (newRow.Yoga !== undefined) {
        const firstYoga = String(newRow.Yoga).split(" / ")[0];
        newRow.Yoga_is_good = isGood(firstYoga, preferences.yoga);
      }
      if (newRow.Karana !== undefined) {
        const firstKarana = String(newRow.Karana).split(" / ")[0];
        newRow.Karana_is_good = isGood(firstKarana, preferences.karana);
      }

      if (newRow["Boy Tarabalam"])
        newRow.Boy_Tarabalam_is_good = isGood(
          newRow["Boy Tarabalam"],
          preferences.tarabalam,
        );
      if (newRow["Girl Tarabalam"])
        newRow.Girl_Tarabalam_is_good = isGood(
          newRow["Girl Tarabalam"],
          preferences.tarabalam,
        );

      return newRow;
    });
  };

  const calculatePanchanga = async () => {
    if (!formData.date || !formData.latitude) {
      alert("Please provide Date and Location details.");
      return;
    }

    const maxDays = Number(import.meta.env.VITE_MAX_PANCHANGA_DAYS) || 50;
    if (formData.days > maxDays) {
      alert(`Please select ${maxDays} days or less!`);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        endpoint: "panchanga_table",
        date: formData.date,
        days: formData.days,
        lat: formData.latitude,
        lon: formData.longitude,
        tz: formData.timezone,
        _t: Date.now(),
      });

      if (formData.boyCheck && formData.boyNakshatra)
        params.append("boy_nakshatra", formData.boyNakshatra);
      if (formData.girlCheck && formData.girlNakshatra)
        params.append("girl_nakshatra", formData.girlNakshatra);

      // Using the absolute proxy path to avoid routing issues
      const res = await fetch(`${import.meta.env.BASE_URL}proxy.php?${params.toString()}`);
      const text = await res.text();

      if (!res.ok) {
        throw new Error(
          `Server Error (${res.status}): ${text || res.statusText}`,
        );
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Raw response from server:", text);
        throw new Error(
          "Invalid JSON response from server. Check the browser console for details.",
        );
      }

      if (data.error) throw new Error(data.error);

      let loadedPrefs = {};
      try {
        loadedPrefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
        setPrefs(loadedPrefs);
      } catch (e) {
        console.warn("Could not parse eclock_prefs", e);
      }
      data = evaluatePanShudhiFlags(data, loadedPrefs);
      setOriginalResults(data);
      setResults(data);
      setIsPanShudhiActive(false);
      setSelectedRows(new Set());
      setIsAllSelected(false);
    } catch (error) {
      console.error("Calculation Error: ", error);
      alert("Failed to calculate. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = (e) => {
    const checked = e.target.checked;
    setIsAllSelected(checked);
    if (checked) {
      setSelectedRows(new Set(results.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleRowSelect = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
      setIsAllSelected(false);
    } else {
      newSelected.add(index);
      if (newSelected.size === results.length) {
        setIsAllSelected(true);
      }
    }
    setSelectedRows(newSelected);
  };

  const filterPanShudhi = () => {
    if (isPanShudhiActive) {
      setResults([...originalResults]);
      setIsPanShudhiActive(false);
    } else {
      const filtered = originalResults.filter(
        (row) =>
          row.Vaara_is_good === true &&
          row.Tithi_is_good === true &&
          row.Nakshatra_is_good === true &&
          row.Yoga_is_good === true &&
          row.Karana_is_good === true,
      );
      if (filtered.length === 0) {
        alert(
          "No dates match the strict Pan Shudhi criteria in the selected range!",
        );
        return;
      }
      setResults(filtered);
      setIsPanShudhiActive(true);
    }
    setSelectedRows(new Set());
    setIsAllSelected(false);
  };

  const saveSelectedDates = () => {
    if (selectedRows.size === 0) {
      alert("Please select at least one date from the table!");
      return;
    }
    let profileName = formData.exportName.trim() || "Panchanga";
    const selectedData = Array.from(selectedRows).map((idx) => results[idx]);

    const locationObj = {
      city: formData.city || "",
      lat: formData.latitude || "",
      lon: formData.longitude || "",
      tz: formData.timezone || "",
    };

    let savedProfiles = JSON.parse(
      localStorage.getItem("panchanga_profiles") || "{}",
    );

    if (savedProfiles[profileName]) {
      const overwrite = window.confirm(
        `Profile "${profileName}" already exists.\n\nClick OK to OVERWRITE entirely.\nClick Cancel to APPEND new records.`,
      );
      if (overwrite) {
        savedProfiles[profileName] = {
          rows: selectedData,
          location: locationObj,
        };
        alert(`Profile "${profileName}" overwritten successfully!`);
      } else {
        const existingData = Array.isArray(savedProfiles[profileName].rows)
          ? savedProfiles[profileName].rows
          : savedProfiles[profileName] || [];
        let addedCount = 0;
        selectedData.forEach((newRow) => {
          if (!existingData.some((row) => row.Date === newRow.Date)) {
            existingData.push(newRow);
            addedCount++;
          }
        });
        existingData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        savedProfiles[profileName] = {
          rows: existingData,
          location: savedProfiles[profileName].location || locationObj,
        };
        alert(`Added ${addedCount} new dates to "${profileName}".`);
      }
    } else {
      savedProfiles[profileName] = {
        rows: selectedData,
        location: locationObj,
      };
      alert(
        `Profile "${profileName}" saved successfully with ${selectedData.length} records!`,
      );
    }
    localStorage.setItem("panchanga_profiles", JSON.stringify(savedProfiles));
  };

  const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportJSON = () => {
    if (!results.length) return;
    const exportObj = {
      rows: results,
      location: {
        city: formData.city || "",
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        timezone: formData.timezone || "",
      },
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    downloadFile(
      dataStr,
      `${formData.exportName || "Panchanga"}.json`,
      "application/json",
    );
  };

  const exportCSV = () => {
    if (!results.length) return;
    const csvRows = [keys.map((h) => `"${h}"`).join(",")];
    results.forEach((row) => {
      const values = keys.map((header) => {
        let dataKey = Object.prototype.hasOwnProperty.call(row, header)
          ? header
          : header.replace(/ /g, "_");
        return `"${row[dataKey] !== undefined ? row[dataKey] : ""}"`;
      });
      csvRows.push(values.join(","));
    });
    downloadFile(
      csvRows.join("\n"),
      `${formData.exportName || "Panchanga"}.csv`,
      "text/csv",
    );
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        if (lines.length < 2) {
          alert("CSV file is empty or invalid.");
          return;
        }
        const headers = lines[0]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.replace(/^"|"$/g, "").trim());
        const parsedData = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"'));
          const obj = {};
          headers.forEach((header, j) => {
            obj[header.replace(/ /g, "_")] = currentLine[j];
            obj[header] = currentLine[j];
          });
          parsedData.push(obj);
        }

        if (
          results.length > 0 &&
          window.confirm(
            "Do you want to MERGE this CSV with the currently displayed table?\n\nClick OK to MERGE.\nClick Cancel to REPLACE.",
          )
        ) {
          const merged = [...results];
          let added = 0;
          parsedData.forEach((row) => {
            if (!merged.some((r) => r.Date === row.Date)) {
              merged.push(row);
              added++;
            }
          });
          merged.sort((a, b) => new Date(a.Date) - new Date(b.Date));
          setResults(merged);
          setOriginalResults(merged);
          setIsPanShudhiActive(false);
          setSelectedRows(new Set());
          setIsAllSelected(false);
          alert(`Merged ${added} records from CSV successfully!`);
        } else {
          setResults(parsedData);
          setOriginalResults(parsedData);
          setIsPanShudhiActive(false);
          setSelectedRows(new Set());
          setIsAllSelected(false);
          alert("CSV Imported Successfully!");
        }
      } catch (error) {
        console.error(error);
        alert("Error parsing CSV file!");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  const desiredOrder =
    prefs?.panchanga_columns?.length > 0
      ? prefs.panchanga_columns
      : [
          "Date",
          "Vaara",
          "Asthg",
          "Maasa",
          "Tithi",
          "Tithi End",
          "Sunrise",
          "Nakshatra",
          "Nakshatra End",
          "Moon Rasi",
          "Yoga",
          "Yoga End",
          "Karana",
          "Karana End",
          "Rahu Kalam",
          "Yamagandam",
          "Durmuhurtham",
          "Varjyam",
          "Boy Tarabalam",
          "Boy Chandra Balam",
          "Girl Tarabalam",
          "Girl Chandra Balam",
        ];

  const availableKeys = results.length > 0 ? Object.keys(results[0]) : [];
  const keys = desiredOrder
    .map((k) => k.replace(/_/g, " "))
    .filter(
      (k) =>
        availableKeys.includes(k) ||
        availableKeys.includes(k.replace(/ /g, "_")),
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          className="section-title"
          style={{
            color: "#8e44ad",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
            marginTop: "0",
          }}
        >
          {t("panchangaSearch", "Panchanga Search")}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div className="input-group">
            <label>{t("profileExportName", "Profile/Export Name")}:</label>
            <input
              type="text"
              name="exportName"
              value={formData.exportName}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div className="input-group">
            <label>{t("startDate", "Start Date")}:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div className="input-group">
            <label>{t("numberOfDays", "Number of Days")}:</label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              min="1"
              max="30"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            alignItems: "start",
          }}
        >
          <div>
            <div className="input-group">
              <LocationAutocomplete
                city={formData.city}
                onLocationSelect={(locData) => {
                  setFormData((prev) => ({
                    ...prev,
                    city: locData.city,
                    latitude: locData.latitude,
                    longitude: locData.longitude,
                    timezone: locData.timezone,
                  }));
                }}
              />
            </div>

            <details
              style={{
                fontSize: "14px",
                background: "#fdfefe",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #eee",
                marginTop: "15px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  color: "#3498db",
                  fontWeight: "bold",
                  outline: "none",
                  listStyle: "none",
                }}
              >
                {t("manualCoordsExt", "Manual Coordinates (Lat / Lon / Tz)")}
              </summary>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="input-group"
                  style={{ flex: 1, minWidth: "80px", marginBottom: "0" }}
                >
                  <label>{t("lat", "Lat")}:</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
                <div
                  className="input-group"
                  style={{ flex: 1, minWidth: "80px", marginBottom: "0" }}
                >
                  <label>{t("lon", "Lon")}:</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
                <div
                  className="input-group"
                  style={{ flex: 1, minWidth: "80px", marginBottom: "0" }}
                >
                  <label>{t("tz", "Tz")}:</label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
              </div>
            </details>
          </div>

          <div>
            <div
              style={{
                padding: "20px",
                borderRadius: "8px",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "#fffcf9",
                borderLeft: "4px solid #f39c12",
                borderTop: "1px solid #eee",
                borderRight: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  color: "#2c3e50",
                  fontSize: "14.5px",
                  marginBottom: "15px",
                  display: "block",
                  marginTop: "0",
                }}
              >
                {t("tarabalamOptional", "Tarabalam & Chandra Balam (Optional)")}
                :
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="boyCheck"
                    checked={formData.boyCheck}
                    onChange={handleInputChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      margin: "0",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#3498db",
                      minWidth: "40px",
                      fontSize: "15px",
                    }}
                  >
                    {t("boy", "Boy")}
                  </span>
                  {formData.boyCheck && (
                    <select
                      name="boyNakshatra"
                      value={formData.boyNakshatra}
                      onChange={handleInputChange}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        flex: 1,
                        outline: "none",
                        fontSize: "14px",
                        background: "#fff",
                      }}
                    >
                      <option value="">
                        {t("selectNakshatra", "-- Select Nakshatra --")}
                      </option>
                      {NAKSHATRAS.map((n) => (
                        <option key={n} value={n}>
                          {t(n)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    name="girlCheck"
                    checked={formData.girlCheck}
                    onChange={handleInputChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      margin: "0",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#e74c3c",
                      minWidth: "40px",
                      fontSize: "15px",
                    }}
                  >
                    {t("girl", "Girl")}
                  </span>
                  {formData.girlCheck && (
                    <select
                      name="girlNakshatra"
                      value={formData.girlNakshatra}
                      onChange={handleInputChange}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        flex: 1,
                        outline: "none",
                        fontSize: "14px",
                        background: "#fff",
                      }}
                    >
                      <option value="">
                        {t("selectNakshatra", "-- Select Nakshatra --")}
                      </option>
                      {NAKSHATRAS.map((n) => (
                        <option key={n} value={n}>
                          {t(n)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            className="btn-primary"
            onClick={calculatePanchanga}
            disabled={isLoading}
            style={{
              padding: "12px 30px",
              background: "#8e44ad",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            {isLoading
              ? t("calculating", "Calculating...")
              : t("calcPanchanga", "Calculate Panchanga")}
          </button>
        </div>
      </div>

      <div
        className="results-area"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {results.length === 0 && !isLoading && (
          <div
            className="card"
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#7f8c8d",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem" }}>
              {t(
                "enterSearchDetails",
                "Enter search details and click Calculate Panchanga to view results.",
              )}
            </p>
          </div>
        )}

        {isLoading && (
          <div
            className="card"
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#8e44ad",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
              {t(
                "calculatingPanchangaWait",
                "Calculating Panchanga... Please wait.",
              )}
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div
            className="card"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-primary"
                onClick={filterPanShudhi}
                style={{
                  width: "auto",
                  background: isPanShudhiActive ? "#e67e22" : "#9b59b6",
                  padding: "8px 15px",
                  margin: "0",
                }}
              >
                {isPanShudhiActive
                  ? t("showAll", "Show All")
                  : t("panShudhi", "Pan Shudhi")}
              </button>
              <button
                className="btn-primary"
                onClick={saveSelectedDates}
                style={{
                  width: "auto",
                  background: "#8e44ad",
                  padding: "8px 15px",
                  margin: "0",
                }}
              >
                {t("saveTable", "Save Table")}
              </button>
              <button
                className="btn-primary"
                onClick={exportJSON}
                style={{
                  width: "auto",
                  background: "#3498db",
                  padding: "8px 15px",
                  margin: "0",
                }}
              >
                {t("exportJSON", "Export JSON")}
              </button>
              <button
                className="btn-primary"
                onClick={exportCSV}
                style={{
                  width: "auto",
                  background: "#27ae60",
                  padding: "8px 15px",
                  margin: "0",
                }}
              >
                {t("exportCSV", "Export CSV")}
              </button>
              <button
                className="btn-primary"
                onClick={() => csvRef.current.click()}
                style={{
                  width: "auto",
                  background: "#2ecc71",
                  padding: "8px 15px",
                  margin: "0",
                }}
              >
                {t("importCSV", "Import CSV")}
              </button>
              <input
                type="file"
                accept=".csv"
                ref={csvRef}
                style={{ display: "none" }}
                onChange={handleImportCSV}
              />
            </div>
            <div style={{ maxHeight: "450px", overflow: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#8e44ad",
                        color: "white",
                        padding: "8px",
                        border: "1px solid #ddd",
                        width: "60px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          margin: "0",
                        }}
                      />
                    </th>
                    {keys.map((k) => (
                      <th
                        key={k}
                        style={{
                          background: "#8e44ad",
                          color: "white",
                          padding: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {k.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.has(index)}
                          onChange={() => toggleRowSelect(index)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            margin: "0",
                          }}
                        />
                      </td>
                      {keys.map((k) => {
                        let dataKey = Object.prototype.hasOwnProperty.call(
                          row,
                          k,
                        )
                          ? k
                          : k.replace(/ /g, "_");
                        let goodKey = k.replace(/ /g, "_") + "_is_good";

                        let isGood = row[goodKey] === true;
                        let isAsthgDanger =
                          k === "Asthg" && row[dataKey] !== "-";
                        let isAshtama =
                          k.includes("Chandra Balam") &&
                          row[dataKey] === "Ashtama";

                        let cellStyle = {
                          padding: "8px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        };

                        if (isGood) {
                          cellStyle.background = "#eafaf1";
                          cellStyle.color = "#1e8449";
                          cellStyle.fontWeight = "bold";
                          cellStyle.borderColor = "#2ecc71";
                        } else if (isAsthgDanger || isAshtama) {
                          cellStyle.background = "#fdedec";
                          cellStyle.color = "#c0392b";
                          cellStyle.fontWeight = "bold";
                          cellStyle.borderColor = "#e74c3c";
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
            {/* Display location details below the generated table */}
            <div style={{ padding: "10px 15px", fontSize: "11px", color: "#7f8c8d", fontStyle: "italic", borderTop: "1px solid #eee", textAlign: "left" }}>
              Location: <strong>{formData.city || "N/A"}</strong> (Lat: {formData.latitude || "N/A"}, Lon: {formData.longitude || "N/A"}, TZ: {formData.timezone || "N/A"})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
