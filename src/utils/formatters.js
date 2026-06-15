export function formatDegree(value) {
  const degree = Number(value);

  if (!Number.isFinite(degree)) {
    return "-";
  }

  const degInt = Math.floor(degree);
  const mFloat = (degree - degInt) * 60;
  const mint = Math.floor(mFloat);

  return `${degInt}° ${mint.toString().padStart(2, "0")}'`;
}

export function formatLongitude(value) {
  const longitude = Number(value);

  if (!Number.isFinite(longitude)) {
    return "-";
  }

  return `${longitude.toFixed(4)}°`;
}

export function getLocalDateStr(tzOffset = -new Date().getTimezoneOffset() / 60) {
  const now = new Date();
  const offsetMs = parseFloat(tzOffset) * 60 * 60 * 1000;
  const localTimeMs = now.getTime() + offsetMs;
  const localDate = new Date(localTimeMs);
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

