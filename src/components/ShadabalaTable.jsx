import React from "react";
import { useTranslation } from "react-i18next";

const PLANET_NAMES = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Kuja",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
};

export function ShadabalaTable({ shadabala }) {
  const { t } = useTranslation();
  if (!shadabala) return null;

  const order = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];

  return (
    <section className="table-panel">
      <h2>{t("Shadabala", "Shadabala (Planetary Strength)")}</h2>
      <div className="table-scroll" style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table>
          <thead>
            <tr>
              <th>{t("Planet")}</th>
              <th>{t("Sthana")}</th>
              <th>{t("Dig")}</th>
              <th>{t("Kala")}</th>
              <th>{t("Chesta")}</th>
              <th>{t("Naisargika")}</th>
              <th>{t("Drig")}</th>
              <th>{t("Total Rupas")}</th>
            </tr>
          </thead>
          <tbody>
            {order.map((p) => {
              if (!shadabala[p]) return null;
              const d = shadabala[p];
              const pct = Math.min(100, (d.total_rupas / 300) * 100);

              return (
                <tr key={p}>
                  <td data-label={t("Planet")}>
                    <span className="planet-name">{t(p)}</span>
                  </td>
                  <td data-label={t("Sthana")} className="deg-val">
                    {d.sthana_bala}
                  </td>
                  <td data-label={t("Dig")} className="deg-val">
                    {d.dig_bala}
                  </td>
                  <td data-label={t("Kala")} className="deg-val">
                    {d.kala_bala}
                  </td>
                  <td data-label={t("Chesta")} className="deg-val">
                    {d.chesta_bala}
                  </td>
                  <td data-label={t("Naisargika")} className="deg-val">
                    {d.naisargika_bala}
                  </td>
                  <td data-label={t("Drig")} className="deg-val">
                    {d.drig_bala}
                  </td>
                  <td data-label={t("Total Rupas")}>
                    <div className="strength-bar-wrap">
                      <div className="strength-bar">
                        <div
                          className="strength-bar-fill"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="strength-val">{d.total_rupas}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
