import React from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

export function FeedbackPage({ logoUrl, onNavigate }) {
  const { t } = useTranslation();

  return (
    <main
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("Feedback", "Feedback")}
        eyebrow="e-JYOTISHA"
        subtitle={t(
          "desc_feedback",
          "Share your thoughts, report issues, or suggest new features to help us improve.",
        )}
      />

      <section
        className="workspace"
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdVOpQZavD8K9Yja9lGdXTPgsOJU09p17ZdJZc8eX5PWdtRJw/viewform?embedded=true"
            style={{ border: "none", width: "100%", height: "100%", flex: 1 }}
            title="Feedback Form"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
          >
            Loading...
          </iframe>
        </div>
      </section>
    </main>
  );
}
