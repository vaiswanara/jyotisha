// ============================================================
// storage.js — e-Questions Data Abstraction Layer
// ============================================================
// All LocalStorage reads/writes go through here.
// To upgrade to v2 (Cloudinary + Server): replace only
// the internals of these functions. UI never changes.
// ============================================================

const KEYS = {
  QUESTIONS: "eq_questions",
  SETTINGS: "eq_settings",
};

// ── Helpers ──────────────────────────────────────────────────

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ── Questions ────────────────────────────────────────────────

export function getQuestions() {
  return readJSON(KEYS.QUESTIONS);
}

export function saveQuestion(question) {
  const all = getQuestions();
  all.unshift(question); // newest first
  return writeJSON(KEYS.QUESTIONS, all);
}

export function updateQuestion(id, changes) {
  const all = getQuestions();
  const idx = all.findIndex((q) => q.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...changes };
  return writeJSON(KEYS.QUESTIONS, all);
}

export function deleteQuestion(id) {
  const all = getQuestions().filter((q) => q.id !== id);
  return writeJSON(KEYS.QUESTIONS, all);
}

// ── FAQ (answered questions only) ───────────────────────────

export function getFaq() {
  return getQuestions().filter((q) => q.status === "Answered");
}

// ── Settings ─────────────────────────────────────────────────

export function getSetting(key, defaultValue = null) {
  try {
    const settings = JSON.parse(
      localStorage.getItem(KEYS.SETTINGS) || "{}"
    );
    return key in settings ? settings[key] : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setSetting(key, value) {
  try {
    const settings = JSON.parse(
      localStorage.getItem(KEYS.SETTINGS) || "{}"
    );
    settings[key] = value;
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
