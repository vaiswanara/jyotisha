// ============================================================
// EQuestionsPage.jsx — e-Questions Module Entry Point
// Internal view router: home | submit | myQuestions | faq | admin
// ============================================================

import React, { useState } from "react";
import "./styles/equestions.css";

import { EQHome } from "./pages/EQHome.jsx";
import { EQSubmit } from "./pages/EQSubmit.jsx";
import { EQMyQuestions } from "./pages/EQMyQuestions.jsx";
import { EQFaq } from "./pages/EQFaq.jsx";
import { EQAdmin } from "./pages/EQAdmin.jsx";

const VIEWS = {
  home: "home",
  submit: "submit",
  myQuestions: "myQuestions",
  faq: "faq",
  admin: "admin",
};

export function EQuestionsPage({ onNavigate, startView }) {
  const [view, setView] = useState(startView || VIEWS.home);

  const goTo = (v) => setView(v);
  const goHome = () => setView(VIEWS.home);

  return (
    <div className="eq-wrapper">
      {view === VIEWS.home && (
        <EQHome onNavigate={goTo} />
      )}

      {view === VIEWS.submit && (
        <EQSubmit
          onBack={goHome}
          onNavigate={goTo}
        />
      )}

      {view === VIEWS.myQuestions && (
        <EQMyQuestions
          onBack={goHome}
          onNavigate={goTo}
        />
      )}

      {view === VIEWS.faq && (
        <EQFaq onBack={goHome} />
      )}

      {view === VIEWS.admin && (
        <EQAdmin onBack={goHome} />
      )}
    </div>
  );
}
