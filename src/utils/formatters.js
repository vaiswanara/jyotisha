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
