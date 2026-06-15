import React from "react";
import { DailyPanchanga } from "./DailyPanchanga.jsx";

export default function Panchanga() {
  return (
    <div
      className="content-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <DailyPanchanga />
    </div>
  );
}
