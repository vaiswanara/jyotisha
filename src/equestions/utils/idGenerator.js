// ============================================================
// idGenerator.js — Generates sequential Question IDs
// Format: Q000001, Q000002, Q000003 ...
// ============================================================

import { getQuestions } from "./storage.js";

export function generateQuestionId() {
  const all = getQuestions();
  if (all.length === 0) return "Q000001";

  // Extract numeric parts and find max
  const max = all.reduce((acc, q) => {
    const num = parseInt(q.id.replace("Q", ""), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);

  const next = max + 1;
  return "Q" + String(next).padStart(6, "0");
}
