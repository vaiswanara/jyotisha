// Centralized list of all configurable features / pages in Jyotisha App

export const ALL_CONFIGURABLE_PAGES = [
  { id: "Sankalpa", label: "e-Sankalpa", icon: "☀️", desc: "Daily Sankalpa Sanketa" },
  { id: "e-Jataka", label: "e-Jataka", icon: "📜", desc: "Horoscope & Kundali Charts" },
  { id: "e-Match", label: "e-Match", icon: "💞", desc: "Kundali Matching & Compatibility" },
  { id: "GotraMatch", label: "e-Gotra", icon: "🧬", desc: "Gotra Compatibility (Beta)" },
  { id: "e-Panchanga", label: "e-Panchanga", icon: "🗓️", desc: "Daily Vedic Panchangam" },
  { id: "echakra", label: "e-Prashna", icon: "☸️", desc: "Horary / Prashna Shastra Chart" },
  { id: "e-Clock", label: "e-Clock", icon: "🕒", desc: "Real-time Astro Clock" },
  { id: "Profiles", label: "e-Profiles", icon: "👥", desc: "Saved Birth Charts & Horoscopes" },
  { id: "e-PATA", label: "e-PATA", icon: "📖", desc: "Gurukulam Video Lessons" },
  { id: "e-Library", label: "e-Library", icon: "📚", desc: "Digital Astrology E-Library" },
  { id: "VoiceQuery", label: "e-Voice Query", icon: "🎙️", desc: "Speech-to-WhatsApp Assistant" },
  { id: "StudentRegistration", label: "Student Registration", icon: "🎓", desc: "Online Batch Enrollment" },
  { id: "PrecisionTest", label: "Precision Test", icon: "🔬", desc: "Calculation Accuracy Tester" },
  { id: "Help", label: "Help & FAQ", icon: "📖", desc: "FAQ & User Guide" },
  { id: "e-Support", label: "Support & Donate", icon: "🤝", desc: "Dakshina & Contributions" },
  { id: "Privacy", label: "Privacy Policy", icon: "🛡️", desc: "Privacy & Terms of Service" },
  { id: "e-Install", label: "Install App", icon: "📲", desc: "PWA Home Screen Installation" },
  { id: "Feedback", label: "Feedback", icon: "📝", desc: "User Feedback & Bug Reports" },
];

export const MANDATORY_SYSTEM_PAGES = ["Home", "Me", "Settings"];

export const DEFAULT_ENABLED_PAGE_IDS = ALL_CONFIGURABLE_PAGES.map((p) => p.id);

export function getAdminEnabledPages() {
  try {
    const raw = localStorage.getItem("vaiswanara_admin_enabled_pages");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return DEFAULT_ENABLED_PAGE_IDS;
}

export function saveAdminEnabledPages(pagesList) {
  try {
    localStorage.setItem("vaiswanara_admin_enabled_pages", JSON.stringify(pagesList));
    window.dispatchEvent(new Event("vaiswanara_admin_config_updated"));
  } catch (_) {}
}

export function isPageAllowedByAdmin(pageId) {
  if (MANDATORY_SYSTEM_PAGES.includes(pageId)) return true;
  const adminPages = getAdminEnabledPages();
  return adminPages.includes(pageId);
}
