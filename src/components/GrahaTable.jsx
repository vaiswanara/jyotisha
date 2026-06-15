import { formatDegree } from "../utils/formatters.js";
import { useTranslation } from "react-i18next";

const PLANET_NAMES = {
  Ascendant: "Lagna",
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Kuja",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
  Rahu: "Rahu",
  Ketu: "Ketu",
};

const RASHI_NAMES = {
  1: "Mesha",
  2: "Vrishabha",
  3: "Mithuna",
  4: "Karkataka",
  5: "Simha",
  6: "Kanya",
  7: "Tula",
  8: "Vrischika",
  9: "Dhanu",
  10: "Makara",
  11: "Kumbha",
  12: "Meena",
};

export function GrahaTable({ planets = {}, hideTitle = false }) {
  const { t } = useTranslation();
  const rows = Object.entries(planets).filter(
    ([, planet]) => planet && planet.rashi,
  );

  return (
    <section className="table-panel">
      {!hideTitle && <h2>{t("grahaPositions", "Graha Positions")}</h2>}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t("Planet")}</th>
              <th>{t("Degree")}</th>
              <th>{t("Nakshatra")}</th>
              <th>{t("Pada")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, planet]) => (
              <tr key={name}>
                <td data-label={t("Planet")}>
                  {t(name)}
                  {planet.retrograde && (
                    <span
                      style={{
                        color: "#d35400",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                      title="Retrograde"
                    >
                      R
                    </span>
                  )}
                  {planet.combust && (
                    <span
                      style={{
                        color: "#8e44ad",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                      title="Combust"
                    >
                      C
                    </span>
                  )}
                </td>
                <td data-label={t("Degree")}>{formatDegree(planet.degree)}</td>
                <td data-label={t("Nakshatra")}>
                  {planet.nakshatra ? t(planet.nakshatra) : "-"}
                </td>
                <td data-label={t("Pada")}>{planet.pada || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
