import { useTranslation } from "react-i18next";

const PLANET_LABELS = {
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

const VIMSHOTTARI_YEARS = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ketu: 7,
  Venus: 20,
};

const VIMSHOTTARI_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
];

const SOLAR_YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

export function DashaTree({ dashas = [] }) {
  const { t } = useTranslation();
  const normalizedDashas = normalizeDashas(dashas);
  const current = findCurrentDasha(normalizedDashas);

  if (!normalizedDashas.length) {
    return (
      <section className="dasha-panel">
        <h2>{t("Vimshottari Dasha")}</h2>
        <p className="empty-text">{t("dashaUnavailable")}</p>
      </section>
    );
  }

  return (
    <section className="dasha-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t("Dasha Timeline")}</p>
          <h2>{t("Vimshottari Dasha")}</h2>
        </div>
        <span>{new Date().toLocaleDateString("en-IN")}</span>
      </div>

      {current.maha && (
        <div className="current-dasha-card">
          <DashaSummary label={t("Maha Dasha")} item={current.maha} t={t} />
          <DashaSummary label={t("Antar Dasha")} item={current.antar} t={t} />
          <DashaSummary
            label={t("Pratyantar Dasha")}
            item={current.pratyantar}
            t={t}
          />
        </div>
      )}

      <div className="dasha-tree">
        {normalizedDashas.map((maha) => {
          const isCurrentMaha = current.maha?.id === maha.id;

          return (
            <details
              className={`dasha-node maha${isCurrentMaha ? " current" : ""}`}
              key={maha.id}
              open={isCurrentMaha}
            >
              <summary>
                <span>{t(maha.planet)}</span>
                <small>{formatRange(maha.start, maha.end)}</small>
              </summary>

              <div className="dasha-children">
                {maha.antardashas.map((antar) => {
                  const isCurrentAntar = current.antar?.id === antar.id;

                  return (
                    <details
                      className={`dasha-node antar${isCurrentAntar ? " current" : ""}`}
                      key={antar.id}
                      open={isCurrentAntar}
                    >
                      <summary>
                        <span>{t(antar.planet)}</span>
                        <small>Ends {formatDate(antar.end)}</small>
                      </summary>

                      <div className="dasha-children compact">
                        {antar.pratyantaraDashas.map((pratyantar) => (
                          <div
                            className={`dasha-leaf${current.pratyantar?.id === pratyantar.id ? " current" : ""}`}
                            key={pratyantar.id}
                          >
                            <span>{t(pratyantar.planet)}</span>
                            <small>{formatDate(pratyantar.end)}</small>
                          </div>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function DashaSummary({ label, item, t }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{item ? t(item.planet) : "-"}</strong>
      <small>{item ? formatRange(item.start, item.end) : ""}</small>
    </div>
  );
}

export function normalizeDashas(dashas) {
  const normalized = dashas.map((maha, mahaIndex) => ({
    ...maha,
    id: `md-${mahaIndex}`,
    planet: maha.planet || maha.lord,
    start: maha.start,
    end: maha.end,
    balance: maha.balance,
    antardashas: (maha.antardashas || []).map((antar, antarIndex) => ({
      ...antar,
      id: `md-${mahaIndex}-ad-${antarIndex}`,
      planet: antar.planet || antar.lord,
      start: antar.start,
      end: antar.end,
      pratyantaraDashas: (
        antar.pratyantara_dashas ||
        antar.pratyantardashas ||
        []
      ).map((pratyantar, pratyantarIndex) => ({
        ...pratyantar,
        id: `md-${mahaIndex}-ad-${antarIndex}-pd-${pratyantarIndex}`,
        planet: pratyantar.planet || pratyantar.lord,
        start: pratyantar.start,
        end: pratyantar.end,
      })),
    })),
  }));

  return fixFirstMahadashaStart(normalized);
}

function fixFirstMahadashaStart(dashas) {
  if (!dashas.length) {
    return dashas;
  }

  const firstDasha = dashas[0];
  const fullYears = VIMSHOTTARI_YEARS[firstDasha.planet];
  const endDate = parseDate(firstDasha.end);

  if (!fullYears || !endDate) {
    return dashas;
  }

  const theoreticalStartMs = endDate.getTime() - fullYears * SOLAR_YEAR_MS;
  const correctedFirstDasha = {
    ...firstDasha,
    start: formatDateInput(theoreticalStartMs),
    antardashas: generateChildDashas(
      theoreticalStartMs,
      firstDasha.planet,
      fullYears,
      firstDasha.id,
    ),
  };

  return [correctedFirstDasha, ...dashas.slice(1)];
}

function generateChildDashas(startMs, parentLord, parentYears, parentId) {
  const dashas = [];
  let currentStartMs = startMs;
  let startIndex = VIMSHOTTARI_ORDER.indexOf(parentLord);

  if (startIndex === -1) {
    startIndex = 0;
  }

  for (let index = 0; index < VIMSHOTTARI_ORDER.length; index += 1) {
    const planet =
      VIMSHOTTARI_ORDER[(startIndex + index) % VIMSHOTTARI_ORDER.length];
    const durationYears = (parentYears * VIMSHOTTARI_YEARS[planet]) / 120;
    const endMs = currentStartMs + durationYears * SOLAR_YEAR_MS;
    const id = `${parentId}-ad-${index}`;

    dashas.push({
      id,
      planet,
      start: formatDateInput(currentStartMs),
      end: formatDateInput(endMs),
      pratyantaraDashas: generatePratyantaraDashas(
        currentStartMs,
        planet,
        durationYears,
        id,
      ),
    });

    currentStartMs = endMs;
  }

  return dashas;
}

function generatePratyantaraDashas(startMs, antarLord, antarYears, parentId) {
  const dashas = [];
  let currentStartMs = startMs;
  let startIndex = VIMSHOTTARI_ORDER.indexOf(antarLord);

  if (startIndex === -1) {
    startIndex = 0;
  }

  for (let index = 0; index < VIMSHOTTARI_ORDER.length; index += 1) {
    const planet =
      VIMSHOTTARI_ORDER[(startIndex + index) % VIMSHOTTARI_ORDER.length];
    const durationYears = (antarYears * VIMSHOTTARI_YEARS[planet]) / 120;
    const endMs = currentStartMs + durationYears * SOLAR_YEAR_MS;

    dashas.push({
      id: `${parentId}-pd-${index}`,
      planet,
      start: formatDateInput(currentStartMs),
      end: formatDateInput(endMs),
    });

    currentStartMs = endMs;
  }

  return dashas;
}

function findCurrentDasha(dashas) {
  const now = new Date();
  const current = { maha: null, antar: null, pratyantar: null };

  for (const maha of dashas) {
    if (!isDateInRange(now, maha.start, maha.end)) continue;
    current.maha = maha;

    for (const antar of maha.antardashas) {
      if (!isDateInRange(now, antar.start, antar.end)) continue;
      current.antar = antar;

      for (const pratyantar of antar.pratyantaraDashas) {
        if (isDateInRange(now, pratyantar.start, pratyantar.end)) {
          current.pratyantar = pratyantar;
          break;
        }
      }
      break;
    }
    break;
  }

  return current;
}

function isDateInRange(date, start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) {
    return false;
  }

  return date >= startDate && date < endDate;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatPlanet(planet) {
  return PLANET_LABELS[planet] || planet || "-";
}

function formatRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateInput(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
