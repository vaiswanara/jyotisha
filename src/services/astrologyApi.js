let resolvedApiUrl = "https://api.vaiswanara.com/api";

if (import.meta.env.DEV) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    resolvedApiUrl = `http://${window.location.hostname}:3000/api`;
  } else {
    resolvedApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }
} else {
  resolvedApiUrl = import.meta.env.VITE_API_URL || "https://api.vaiswanara.com/api";
}

export const API_URL = resolvedApiUrl;

export const API_TOKEN =
  import.meta.env.VITE_API_TOKEN ||
  "0c6ad3f0971928151053d9cf3dcd84578ab7626b39f09f4923d187a0c378d746";

export async function fetchBirthChart(formData) {
  const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
  const ayanamsha = formData.ayanamsha || prefs.ayanamsha_val || "lahiri";

  const params = new URLSearchParams({
    endpoint: "birthchart",
    dob: formData.dob,
    tob: formData.tob,
    latitude: formData.latitude,
    longitude: formData.longitude,
    timezone: formData.timezone,
    ayanamsha: ayanamsha,
    rahu_mode: localStorage.getItem("rahu_mode") || "mean",
    _t: Date.now().toString(),
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "x-api-token": API_TOKEN,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || data.error) {
    throw new Error(data?.error || "Unable to generate horoscope.");
  }

  return data;
}



export async function getLessons() {
  const params = new URLSearchParams({
    endpoint: "get_lessons",
    _t: Date.now().toString(),
  });
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "x-api-token": API_TOKEN,
    },
  });
  return response.json().catch(() => null);
}

export async function saveLessons(lessons, adminPassword) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_TOKEN,
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({
      endpoint: "save_lessons",
      lessons,
    }),
  });
  return response.json().catch(() => null);
}

export async function getLibrary() {
  const params = new URLSearchParams({
    endpoint: "get_library",
    _t: Date.now().toString(),
  });
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "x-api-token": API_TOKEN,
    },
  });
  return response.json().catch(() => null);
}

export async function saveLibrary(library, adminPassword) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_TOKEN,
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({
      endpoint: "save_library",
      library,
    }),
  });
  return response.json().catch(() => null);
}

export async function getTicker() {
  const params = new URLSearchParams({
    endpoint: "get_ticker",
    _t: Date.now().toString(),
  });
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: { Accept: "application/json", "x-api-token": API_TOKEN },
  });
  return response.json().catch(() => null);
}

export async function saveTicker(ticker, adminPassword) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_TOKEN,
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ endpoint: "save_ticker", ticker }),
  });
  return response.json().catch(() => null);
}

export async function getInAppMessages() {
  const params = new URLSearchParams({
    endpoint: "get_in_app_messages",
    _t: Date.now().toString(),
  });
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: { Accept: "application/json", "x-api-token": API_TOKEN },
  });
  return response.json().catch(() => null);
}

export async function saveInAppMessage(messages, adminPassword) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_TOKEN,
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ endpoint: "save_in_app_message", messages }),
  });
  return response.json().catch(() => null);
}


export async function saveSubscribers(subscribers, adminPassword) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_TOKEN,
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({
      endpoint: "save_subscribers",
      subscribers,
    }),
  });
  return response.json().catch(() => null);
}



export async function fetchPrecisionTest(formData) {
  const prefs = JSON.parse(localStorage.getItem("eclock_prefs") || "{}");
  const ayanamsha = formData.ayanamsha || prefs.ayanamsha_val || "lahiri";

  const params = new URLSearchParams({
    endpoint: "precision_test",
    dob: formData.dob,
    tob: formData.tob,
    latitude: formData.latitude,
    longitude: formData.longitude,
    timezone: formData.timezone,
    ayanamsha: ayanamsha,
    rahu_mode: localStorage.getItem("rahu_mode") || "mean",
    _t: Date.now().toString(),
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "x-api-token": API_TOKEN,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || data.error) {
    throw new Error(data?.error || "Unable to fetch comparison data.");
  }

  return data;
}
