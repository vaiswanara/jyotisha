// ============================================================
// useQuestions.js — Custom hook for questions state
// ============================================================

import { useState, useCallback } from "react";
import {
  getQuestions,
  saveQuestion,
  updateQuestion,
  deleteQuestion,
} from "../utils/storage.js";

export function useQuestions() {
  const [questions, setQuestions] = useState(() => getQuestions());

  const refresh = useCallback(() => {
    setQuestions(getQuestions());
  }, []);

  const addQuestion = useCallback((question) => {
    const ok = saveQuestion(question);
    if (ok) setQuestions(getQuestions());
    return ok;
  }, []);

  const editQuestion = useCallback((id, changes) => {
    const ok = updateQuestion(id, changes);
    if (ok) setQuestions(getQuestions());
    return ok;
  }, []);

  const removeQuestion = useCallback((id) => {
    const ok = deleteQuestion(id);
    if (ok) setQuestions(getQuestions());
    return ok;
  }, []);

  return { questions, addQuestion, editQuestion, removeQuestion, refresh };
}
