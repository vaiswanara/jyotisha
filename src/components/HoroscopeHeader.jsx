export function HoroscopeHeader({ logoUrl, title, subtitle, eyebrow }) {
  if (!subtitle) return null;

  return (
    <div
      style={{
        padding: "10px 20px",
        marginBottom: "10px",
        textAlign: "center",
        color: "#636e72",
        fontSize: "0.95rem",
        fontStyle: "italic",
      }}
    >
      {subtitle}
    </div>
  );
}
