import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import "./i18n.js";
// Handle chunk/module load failures (which happen when we update the app and old hashes are missing)
window.addEventListener("error", (event) => {
  const target = event.target || {};
  if (target.tagName === "SCRIPT" || target.tagName === "LINK") {
    const src = target.src || target.href || "";
    if (src.includes("/assets/")) {
      console.warn("Resource load failed. Reloading to get the latest version...", src);
      window.location.reload();
    }
  }
}, true);

window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason || {};
  const errorText = String(error.message || error);
  if (
    errorText.includes("ChunkLoadError") ||
    errorText.includes("Loading chunk") ||
    errorText.includes("Failed to fetch dynamically imported module") ||
    error.name === "ChunkLoadError"
  ) {
    event.preventDefault();
    console.warn("Dynamic import failed. Reloading to get the latest version...", errorText);
    window.location.reload();
  }
});



// Waking up backend server on Render/free hosting as early as possible
(async () => {
  try {
    const backendType = import.meta.env.VITE_BACKEND_TYPE || "php";
    const apiUrl = import.meta.env.VITE_API_URL || (
      backendType === "node"
        ? "https://api.vaiswanara.com/api"
        : "https://vaiswanara.com/jyotisha_php_api/index.php"
    );
    const baseUrl = apiUrl.replace(/\/api\/?$/, "");
    fetch(baseUrl, { mode: "no-cors" }).catch(() => {});
  } catch (e) {}
})();

// Initialize Google Analytics if VITE_GA_ID is set
const gaId = import.meta.env.VITE_GA_ID;
if (gaId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || document.referrer.includes("android-app://");
  window.gtag("config", gaId, {
    app_mode: isStandalone ? "standalone" : "browser",
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

