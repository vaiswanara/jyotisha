import { LocationAutocomplete } from "./LocationAutocomplete.jsx";
import { useTranslation } from "react-i18next";
import { saveUserData } from "../services/astrologyApi.js";

export function BirthDetailsForm({
  formData,
  loading,
  onChange,
  onSubmit,
  onNavigate,
}) {
  const { t } = useTranslation();
  function updateField(field, value) {
    onChange({ ...formData, [field]: value });
  }

  function handleSaveProfile() {
    if (!formData.name) {
      alert("Please enter a Name to save this profile.");
      return;
    }
    const profiles = JSON.parse(
      localStorage.getItem("vaiswanara_profiles") || "{}",
    );
    const updated = { ...profiles, [formData.name]: formData };
    localStorage.setItem("vaiswanara_profiles", JSON.stringify(updated));
    alert(`Profile "${formData.name}" saved!`);
  }

  function handleSubmit(event) {
    // యూజర్‌ని గుర్తించడానికి డివైస్ ఐడీ లేకపోతే క్రియేట్ చేయడం
    let deviceId = localStorage.getItem("vaiswanara_device_id");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("vaiswanara_device_id", deviceId);
    }

    // Node.js API కి డేటా సైలెంట్ గా పంపడం
    saveUserData({
      name: formData.name || "Unknown",
      dob: formData.dob,
      tob: formData.tob,
      city: formData.city || "",
      deviceId: deviceId,
    });

    if (onSubmit) onSubmit(event);
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>{t("birthDetails")}</h2>
        <button
          type="button"
          onClick={() => onNavigate("Profiles")}
          title={t("profiles")}
          style={{
            background: "#f8f9fa",
            border: "1px solid #dcdde1",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          👥
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <label style={{ flex: 1, minWidth: 0 }}>
          {t("name")}
          <input
            autoFocus
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder={t("optional")}
          />
        </label>

        <label style={{ flex: 1, minWidth: 0 }}>
          {t("gender")}
          <select
            value={formData.gender || "male"}
            onChange={(event) => updateField("gender", event.target.value)}
          >
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <label style={{ flex: 1, minWidth: 0 }}>
          {t("date")}
          <input
            type="date"
            required
            value={formData.dob}
            onChange={(event) => updateField("dob", event.target.value)}
          />
        </label>

        <label style={{ flex: 1, minWidth: 0 }}>
          {t("time")}
          <input
            type="time"
            required
            value={formData.tob}
            onChange={(event) => updateField("tob", event.target.value)}
          />
        </label>
      </div>

      <LocationAutocomplete
        city={formData.city}
        onLocationSelect={(locData) => {
          onChange({
            ...formData,
            city: locData.city,
            latitude: locData.latitude,
            longitude: locData.longitude,
            timezone: locData.timezone,
          });
        }}
      />

      <details
        style={{
          marginTop: "-10px",
          marginBottom: "15px",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            color: "#3498db",
            fontSize: "12.5px",
            fontWeight: "600",
            outline: "none",
            listStyle: "none",
          }}
        >
          {t("manualCoords")}
        </summary>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <label style={{ flex: 1, minWidth: 0, fontSize: "12px" }}>
            {t("latitude")}
            <input
              required
              inputMode="decimal"
              value={formData.latitude}
              onChange={(event) => updateField("latitude", event.target.value)}
              placeholder="17.3850"
              style={{ padding: "6px", fontSize: "13px", marginTop: "4px" }}
            />
          </label>

          <label style={{ flex: 1, minWidth: 0, fontSize: "12px" }}>
            {t("longitude")}
            <input
              required
              inputMode="decimal"
              value={formData.longitude}
              onChange={(event) => updateField("longitude", event.target.value)}
              placeholder="78.4867"
              style={{ padding: "6px", fontSize: "13px", marginTop: "4px" }}
            />
          </label>

          <label style={{ width: "65px", minWidth: 0, fontSize: "12px" }}>
            {t("tz", "Tz")}
            <input
              required
              inputMode="decimal"
              value={formData.timezone}
              onChange={(event) => updateField("timezone", event.target.value)}
              placeholder="5.5"
              style={{ padding: "6px", fontSize: "13px", marginTop: "4px" }}
            />
          </label>
        </div>
      </details>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        <button
          type="button"
          onClick={handleSaveProfile}
          style={{
            flex: 1,
            background: "#27ae60",
            padding: "0.5rem",
            fontSize: "0.85rem",
            minHeight: "36px",
            borderRadius: "6px",
          }}
          title="Save to Profiles"
        >
          {t("save")}
        </button>
        <button
          type="button"
          onClick={() => onNavigate("Profiles")}
          style={{
            flex: 1,
            background: "#2873a8",
            padding: "0.5rem",
            fontSize: "0.85rem",
            minHeight: "36px",
            borderRadius: "6px",
          }}
          title="Manage Profiles"
        >
          {t("profiles")}
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.5rem",
            fontSize: "0.85rem",
            minHeight: "36px",
            borderRadius: "6px",
          }}
        >
          {loading ? t("processingWait") : t("generate")}
        </button>
      </div>
    </form>
  );
}
