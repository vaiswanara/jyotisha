import React from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

export function InstallPage({
  logoUrl,
  isInstallable,
  isIosEligible,
  onInstallClick,
  onNavigate,
  pushEnabled,
  pushLoading,
  onEnablePush,
}) {
  const { t } = useTranslation();

  return (
    <main className="page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("installAppTitle", "Install e-JYOTISHA")}
        eyebrow="e-JYOTISHA"
        subtitle={t(
          "installAppDesc",
          "Install the app on your device for quick access.",
        )}
      />

      <section
        className="workspace"
        style={{
          display: "block",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
          paddingBottom: "50px",
        }}
      >
        <style>{`
          .install-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.04);
            border: 1px solid #eaecee;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .install-card h3 {
            color: #2c3e50;
            margin-top: 0;
            border-bottom: 2px solid #f1f2f6;
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.3rem;
          }
          .install-step {
            display: flex;
            gap: 15px;
            margin-bottom: 18px;
            align-items: flex-start;
          }
          .step-number {
            background: #ebf5fb;
            color: #3498db;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
            font-size: 0.9rem;
          }
          .step-text {
            color: #4a5568;
            font-size: 1.05rem;
            line-height: 1.5;
            margin: 0;
          }
          .highlight-box {
            background: #fdf5e6;
            border-left: 4px solid #f39c12;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #d35400;
            font-size: 0.95rem;
            line-height: 1.5;
          }
          .install-btn-hover {
            transition: transform 0.2s ease;
          }
          .install-btn-hover:hover {
            transform: translateY(-2px);
          }
        `}</style>

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            padding: "0 15px",
          }}
        >
          <h2
            style={{
              color: "#2c3e50",
              fontSize: "1.8rem",
              margin: "0 0 10px 0",
            }}
          >
            {t("getTheApp", "Get the e-JYOTISHA App")}
          </h2>
          <p style={{ color: "#7f8c8d", fontSize: "1.1rem", margin: 0 }}>
            {t(
              "installBenefits",
              "Install on your device for offline access, faster loading, and a full-screen experience.",
            )}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 15px",
          }}
        >
          {/* Android Card */}
          <div className="install-card">
            <h3>
              <span
                role="img"
                aria-label="Android"
                style={{ fontSize: "1.5rem" }}
              >
                📱
              </span>{" "}
              {t("androidInstall", "Android / Chrome")}
            </h3>

            {isInstallable ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  role="img"
                  aria-label="Sparkles"
                  style={{ fontSize: "50px", marginBottom: "15px" }}
                >
                  ✨
                </div>
                <h4
                  style={{
                    color: "#27ae60",
                    margin: "0 0 20px 0",
                    fontSize: "1.2rem",
                  }}
                >
                  {t("androidInstallReady", "App is ready to be installed!")}
                </h4>
                <button
                  className="install-btn-hover"
                  onClick={onInstallClick}
                  style={{
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    padding: "14px 24px",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  {t("installApp", "Install App")}
                </button>
              </div>
            ) : (
              <div>
                <div className="highlight-box">
                  {t(
                    "androidManualNotice",
                    "Automatic install button is not available. Please follow these simple manual steps:",
                  )}
                </div>
                <div className="install-step">
                  <div className="step-number">1</div>
                  <p className="step-text">
                    {t("androidStep1", "Tap the browser menu icon ")}
                    <strong
                      style={{ fontSize: "1.2rem", verticalAlign: "middle" }}
                    >
                      ⋮
                    </strong>
                    {t(
                      "androidStep1Suffix",
                      " at the top right of your screen.",
                    )}
                  </p>
                </div>
                <div className="install-step">
                  <div className="step-number">2</div>
                  <p className="step-text">
                    {t("androidStep2", "Select ")}{" "}
                    <strong>{t("androidInstallApp", '"Install App"')}</strong>{" "}
                    {t("or", "or")}{" "}
                    <strong>
                      {t("androidAddToHome", '"Add to Home screen"')}
                    </strong>
                    .
                  </p>
                </div>
                <div className="install-step">
                  <div className="step-number">3</div>
                  <p className="step-text">
                    {t(
                      "androidStep3",
                      "Follow the on-screen prompt to confirm installation.",
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* iOS Card */}
          <div className="install-card">
            <h3>
              <span
                role="img"
                aria-label="Apple"
                style={{ fontSize: "1.5rem" }}
              >
                🍎
              </span>{" "}
              {t("iosInstall", "iPhone / iPad (Safari)")}
            </h3>
            <div
              className="highlight-box"
              style={{
                background: "#ebf5fb",
                borderLeftColor: "#3498db",
                color: "#2980b9",
              }}
            >
              {t(
                "iosNotice",
                "You must open this website in the Safari browser to install it on iOS devices.",
              )}
            </div>

            <div className="install-step">
              <div className="step-number">1</div>
              <p className="step-text">
                {t("iosInstallStep1", "Tap the Share button ")}
                <svg
                  style={{
                    verticalAlign: "middle",
                    margin: "0 5px",
                    color: "#3498db",
                  }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                {t("iosInstallStep1Suffix", " at the bottom of your screen.")}
              </p>
            </div>
            <div className="install-step">
              <div className="step-number">2</div>
              <p className="step-text">
                {t("iosInstallStep2", "Scroll down the menu and tap on ")}
                <strong style={{ color: "#2d3436" }}>
                  {t("iosInstallAddHome", '"Add to Home Screen"')}
                </strong>
                <svg
                  style={{
                    verticalAlign: "middle",
                    margin: "0 5px",
                    color: "#2d3436",
                  }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                .
              </p>
            </div>
            <div className="install-step">
              <div className="step-number">3</div>
              <p className="step-text">
                {t(
                  "iosInstallStep3",
                  'Tap "Add" at the top right to complete the installation.',
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Alerts Card */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "30px auto 0",
            padding: "0 15px",
          }}
        >
          <div
            className="install-card"
            style={{
              textAlign: "center",
              alignItems: "center",
              padding: "35px 20px",
            }}
          >
            <h2 style={{ color: "#8e44ad", marginBottom: "15px" }}>
              {t("dailyAlertsTitle", "Daily Alerts (Push Notifications)")}
            </h2>
            <p
              style={{
                color: "#7f8c8d",
                fontSize: "1.1rem",
                marginBottom: "25px",
              }}
            >
              {t(
                "dailyAlertsDesc",
                "Enable daily notifications for Panchanga and important astrological alerts directly to your device.",
              )}
            </p>
            <button
              type="button"
              onClick={onEnablePush}
              disabled={pushLoading}
              style={{
                background: pushEnabled ? "#e74c3c" : "#8e44ad",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: pushLoading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                opacity: pushLoading ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>
                {pushEnabled ? "🔕" : "🔔"}
              </span>
              {pushLoading
                ? t("pleaseWait", "Please wait...")
                : pushEnabled
                  ? t("disableAlerts", "Disable Alerts")
                  : t("enableAlerts", "Enable Daily Alerts")}
            </button>
          </div>
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
