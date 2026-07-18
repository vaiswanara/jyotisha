// ============================================================
// ImageUpload.jsx — Optional image picker with preview
// ============================================================

import React, { useRef } from "react";

export function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="eq-image-upload">
      {!value ? (
        <button
          type="button"
          className="eq-image-pick-btn"
          onClick={() => inputRef.current?.click()}
        >
          <span className="eq-icon">📷</span>
          <span>Attach Photo</span>
        </button>
      ) : (
        <div className="eq-image-preview-wrap">
          <img src={value} alt="Preview" className="eq-image-preview" />
          <button
            type="button"
            className="eq-image-remove-btn"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
