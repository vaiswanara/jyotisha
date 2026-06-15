import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import "./i18n.js";


// Waking up backend server on Render/free hosting as early as possible
(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "https://api.vaiswanara.com/api";
    const baseUrl = apiUrl.replace(/\/api\/?$/, "");
    fetch(baseUrl, { mode: "no-cors" }).catch(() => {});
  } catch (e) {}
})();


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

