// ============================================================
// useFaq.js — Custom hook for FAQ (answered questions only)
// ============================================================

import { useState, useCallback } from "react";
import { getFaq } from "../utils/storage.js";

export function useFaq() {
  const [faqItems, setFaqItems] = useState(() => getFaq());

  const refresh = useCallback(() => {
    setFaqItems(getFaq());
  }, []);

  return { faqItems, refresh };
}
