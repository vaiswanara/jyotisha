const backendType = import.meta.env.VITE_BACKEND_TYPE || "php";

let resolvedApiUrl = "";

if (import.meta.env.DEV) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    resolvedApiUrl = `http://${window.location.hostname}:3000/api`;
  } else {
    resolvedApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }
} else {
  if (import.meta.env.VITE_API_URL) {
    resolvedApiUrl = import.meta.env.VITE_API_URL;
  } else {
    resolvedApiUrl = backendType === "node"
      ? "https://api.vaiswanara.com/api"
      : "https://vaiswanara.com/jyotisha_php_api/index.php";
  }
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
      admin_password: adminPassword,
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
      admin_password: adminPassword,
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
    body: JSON.stringify({ endpoint: "save_ticker", admin_password: adminPassword, ticker }),
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
    body: JSON.stringify({ endpoint: "save_in_app_message", admin_password: adminPassword, messages }),
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

export async function getStudents(password) {
  const params = new URLSearchParams({
    endpoint: "get_students",
    pwd: password || "",
    _t: Date.now().toString(),
  });
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "x-api-token": API_TOKEN,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || (data && data.success === false)) {
    throw new Error(data?.message || data?.error || "Failed to fetch students.");
  }
  return data;
}

async function _studentPost(endpoint, payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-token": API_TOKEN },
    body: JSON.stringify({ endpoint, ...payload }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || (data && data.success === false)) {
    throw new Error(data?.message || data?.error || "Request failed.");
  }
  return data;
}

export const addStudentAdmin     = (d) => _studentPost("add_student_admin",     d);
export const updateStudent       = (d) => _studentPost("update_student",        d);
export const approveStudent      = (d) => _studentPost("approve_student",       d);
export const toggleStudentStatus = (d) => _studentPost("toggle_student_status", d);
export const deleteStudent       = (d) => _studentPost("delete_student",       d);

export async function registerStudent(studentData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": API_TOKEN,
      },
      body: JSON.stringify({
        endpoint: "register_student",
        ...studentData,
      }),
    });

    const data = await response.json().catch(() => null);

    return data || { success: true, message: "Registration successful!" };
  } catch (error) {
    throw error;
  }
}

export async function getBatches() {
  try {
    const params = new URLSearchParams({
      endpoint: "get_batches",
      _t: Date.now().toString(),
    });
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "x-api-token": API_TOKEN,
      },
    });
    const data = await response.json().catch(() => null);
    if (data && Array.isArray(data.batches) && data.batches.length > 0) {
      return data;
    }
    // Fallback to static batches file
    const staticRes = await fetch(`${import.meta.env.BASE_URL}static/batches.json`).catch(() => null);
    if (staticRes && staticRes.ok) {
      const staticBatches = await staticRes.json().catch(() => []);
      if (Array.isArray(staticBatches) && staticBatches.length > 0) {
        return { success: true, batches: staticBatches };
      }
    }
    return data || { success: true, batches: [] };
  } catch (error) {
    try {
      const staticRes = await fetch(`${import.meta.env.BASE_URL}static/batches.json`);
      if (staticRes.ok) {
        const staticBatches = await staticRes.json();
        return { success: true, batches: staticBatches };
      }
    } catch (e) {}
    return { success: true, batches: [] };
  }
}

export const saveBatch   = (batchData) => _studentPost("save_batch", batchData);
export const saveBatches = (batches)   => _studentPost("save_batches", { batches });
export const deleteBatch = (id)        => _studentPost("delete_batch", { id });

export async function getCourses() {
  try {
    const params = new URLSearchParams({
      endpoint: "get_courses",
      _t: Date.now().toString(),
    });
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "x-api-token": API_TOKEN,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || (data && data.success === false)) {
      return { success: true, courses: [] };
    }
    return data || { success: true, courses: [] };
  } catch (error) {
    return { success: true, courses: [] };
  }
}

export const saveCourse  = (courseData) => _studentPost("save_course", courseData);
export const saveCourses = (courses)    => _studentPost("save_courses", { courses });
export const deleteCourse = (id)         => _studentPost("delete_course", { id });

export async function getTemplates() {
  try {
    const params = new URLSearchParams({
      endpoint: "get_templates",
      _t: Date.now().toString(),
    });
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "x-api-token": API_TOKEN,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || (data && data.success === false)) {
      return { success: true, templates: [] };
    }
    return data || { success: true, templates: [] };
  } catch (error) {
    return { success: true, templates: [] };
  }
}

export const saveTemplate   = (tplData) => _studentPost("save_template", tplData);
export const deleteTemplate = (id)      => _studentPost("delete_template", { id });




