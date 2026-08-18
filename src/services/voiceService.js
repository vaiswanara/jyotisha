// Voice Assistant Service for Jyotisha v2.0
// Focused exclusively on Voice Input for Date of Birth, Time of Birth, and Place of Birth in Jataka & Matching pages.
// Full cross-browser support: Chrome, Edge, Safari (iOS & macOS), Android Chrome, PWA.

export const isSpeechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition
  );
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== "undefined" && "speechSynthesis" in window;
};

// Common Indian city coordinates lookup for instantaneous offline voice accuracy
const COMMON_CITIES = {
  hyderabad: { city: "Hyderabad, Telangana, India", latitude: "17.3850", longitude: "78.4867", timezone: "5.5" },
  secunderabad: { city: "Secunderabad, Telangana, India", latitude: "17.4399", longitude: "78.4983", timezone: "5.5" },
  bengaluru: { city: "Bengaluru, Karnataka, India", latitude: "12.9716", longitude: "77.5946", timezone: "5.5" },
  bangalore: { city: "Bengaluru, Karnataka, India", latitude: "12.9716", longitude: "77.5946", timezone: "5.5" },
  chennai: { city: "Chennai, Tamil Nadu, India", latitude: "13.0827", longitude: "80.2707", timezone: "5.5" },
  madras: { city: "Chennai, Tamil Nadu, India", latitude: "13.0827", longitude: "80.2707", timezone: "5.5" },
  mumbai: { city: "Mumbai, Maharashtra, India", latitude: "19.0760", longitude: "72.8777", timezone: "5.5" },
  bombay: { city: "Mumbai, Maharashtra, India", latitude: "19.0760", longitude: "72.8777", timezone: "5.5" },
  delhi: { city: "New Delhi, Delhi, India", latitude: "28.6139", longitude: "77.2090", timezone: "5.5" },
  "new delhi": { city: "New Delhi, Delhi, India", latitude: "28.6139", longitude: "77.2090", timezone: "5.5" },
  kolkata: { city: "Kolkata, West Bengal, India", latitude: "22.5726", longitude: "88.3639", timezone: "5.5" },
  calcutta: { city: "Kolkata, West Bengal, India", latitude: "22.5726", longitude: "88.3639", timezone: "5.5" },
  pune: { city: "Pune, Maharashtra, India", latitude: "18.5204", longitude: "73.8567", timezone: "5.5" },
  ahmedabad: { city: "Ahmedabad, Gujarat, India", latitude: "23.0225", longitude: "72.5714", timezone: "5.5" },
  visakhapatnam: { city: "Visakhapatnam, Andhra Pradesh, India", latitude: "17.6868", longitude: "83.2185", timezone: "5.5" },
  vizag: { city: "Visakhapatnam, Andhra Pradesh, India", latitude: "17.6868", longitude: "83.2185", timezone: "5.5" },
  vijayawada: { city: "Vijayawada, Andhra Pradesh, India", latitude: "16.5062", longitude: "80.6480", timezone: "5.5" },
  tirupati: { city: "Tirupati, Andhra Pradesh, India", latitude: "13.6288", longitude: "79.4192", timezone: "5.5" },
  guntur: { city: "Guntur, Andhra Pradesh, India", latitude: "16.3067", longitude: "80.4365", timezone: "5.5" },
  warangal: { city: "Warangal, Telangana, India", latitude: "17.9689", longitude: "79.5941", timezone: "5.5" },
  rajahmundry: { city: "Rajahmundry, Andhra Pradesh, India", latitude: "17.0005", longitude: "81.8040", timezone: "5.5" },
  kakinada: { city: "Kakinada, Andhra Pradesh, India", latitude: "16.9891", longitude: "82.2475", timezone: "5.5" },
  nellore: { city: "Nellore, Andhra Pradesh, India", latitude: "14.4426", longitude: "79.9865", timezone: "5.5" },
  kurnool: { city: "Kurnool, Andhra Pradesh, India", latitude: "15.8281", longitude: "78.0373", timezone: "5.5" },
  kadapa: { city: "Kadapa, Andhra Pradesh, India", latitude: "14.4673", longitude: "78.8242", timezone: "5.5" },
  mysuru: { city: "Mysuru, Karnataka, India", latitude: "12.2958", longitude: "76.6394", timezone: "5.5" },
  mysore: { city: "Mysuru, Karnataka, India", latitude: "12.2958", longitude: "76.6394", timezone: "5.5" },
  coimbatore: { city: "Coimbatore, Tamil Nadu, India", latitude: "11.0168", longitude: "76.9558", timezone: "5.5" },
  madurai: { city: "Madurai, Tamil Nadu, India", latitude: "9.9252", longitude: "78.1198", timezone: "5.5" },
  kochi: { city: "Kochi, Kerala, India", latitude: "9.9312", longitude: "76.2673", timezone: "5.5" },
  cochin: { city: "Kochi, Kerala, India", latitude: "9.9312", longitude: "76.2673", timezone: "5.5" },
  trivandrum: { city: "Thiruvananthapuram, Kerala, India", latitude: "8.5241", longitude: "76.9366", timezone: "5.5" },
  thiruvananthapuram: { city: "Thiruvananthapuram, Kerala, India", latitude: "8.5241", longitude: "76.9366", timezone: "5.5" },
  jaipur: { city: "Jaipur, Rajasthan, India", latitude: "26.9124", longitude: "75.7873", timezone: "5.5" },
  lucknow: { city: "Lucknow, Uttar Pradesh, India", latitude: "26.8467", longitude: "80.9462", timezone: "5.5" },
  varanasi: { city: "Varanasi, Uttar Pradesh, India", latitude: "25.3176", longitude: "82.9739", timezone: "5.5" },
  patna: { city: "Patna, Bihar, India", latitude: "25.5941", longitude: "85.1376", timezone: "5.5" },
  bhopal: { city: "Bhopal, Madhya Pradesh, India", latitude: "23.2599", longitude: "77.4126", timezone: "5.5" },
  nagpur: { city: "Nagpur, Maharashtra, India", latitude: "21.1458", longitude: "79.0882", timezone: "5.5" },
  london: { city: "London, UK", latitude: "51.5074", longitude: "-0.1278", timezone: "0" },
  "new york": { city: "New York, USA", latitude: "40.7128", longitude: "-74.0060", timezone: "-5" },
  chicago: { city: "Chicago, USA", latitude: "41.8781", longitude: "-87.6298", timezone: "-6" },
  dubai: { city: "Dubai, UAE", latitude: "25.2048", longitude: "55.2708", timezone: "4" },
  singapore: { city: "Singapore", latitude: "1.3521", longitude: "103.8198", timezone: "8" },
};

// Filter Indian English voices (Prioritizing Indian Female voices)
export function getIndianEnglishVoices() {
  if (!isSpeechSynthesisSupported()) return [];
  const allVoices = window.speechSynthesis.getVoices();

  const indianVoices = allVoices.filter((v) => {
    const lang = (v.lang || "").toLowerCase();
    const name = (v.name || "").toLowerCase();
    return (
      lang === "en-in" ||
      lang === "en_in" ||
      name.includes("india") ||
      name.includes("neerja") ||
      name.includes("heera") ||
      name.includes("veena") ||
      name.includes("sangeeta") ||
      name.includes("aditi") ||
      name.includes("swara") ||
      name.includes("prabhat") ||
      name.includes("ravi") ||
      name.includes("rishi")
    );
  });

  return indianVoices.length > 0 ? indianVoices : allVoices;
}

// Get the best Indian English Female voice
export function getBestIndianVoice() {
  const allVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!allVoices || allVoices.length === 0) return null;

  // 1. Highest Priority: Microsoft Neerja (Natural Online Female Indian English)
  const neerja = allVoices.find((v) => v.name.toLowerCase().includes("neerja"));
  if (neerja) return neerja;

  // 2. Microsoft Heera (Windows Indian English Female)
  const heera = allVoices.find((v) => v.name.toLowerCase().includes("heera"));
  if (heera) return heera;

  // 3. Apple Veena (macOS / iOS Indian English Female)
  const veena = allVoices.find((v) => v.name.toLowerCase().includes("veena"));
  if (veena) return veena;

  // 4. Sangeeta, Aditi, Swara, Priya (Other Indian Female voices)
  const otherIndianFemale = allVoices.find((v) => {
    const n = v.name.toLowerCase();
    return n.includes("sangeeta") || n.includes("aditi") || n.includes("swara") || n.includes("priya");
  });
  if (otherIndianFemale) return otherIndianFemale;

  // 5. Any en-IN voice labeled as female or not explicitly male
  const indianFemale = allVoices.find((v) => {
    const l = (v.lang || "").toLowerCase();
    const n = v.name.toLowerCase();
    const isIndian = l === "en-in" || l === "en_in" || n.includes("india");
    const isMale = n.includes("male") || n.includes("prabhat") || n.includes("ravi") || n.includes("rishi") || n.includes("david");
    return isIndian && !isMale;
  });
  if (indianFemale) return indianFemale;

  // 6. Any available Indian voice
  const anyIndian = allVoices.find((v) => {
    const l = (v.lang || "").toLowerCase();
    const n = v.name.toLowerCase();
    return l === "en-in" || l === "en_in" || n.includes("india");
  });
  if (anyIndian) return anyIndian;

  // 7. General English Female Voice fallback (Zira / Samantha / Karen / Google Female)
  const englishFemale = allVoices.find((v) => {
    const n = v.name.toLowerCase();
    return n.includes("zira") || n.includes("samantha") || n.includes("karen") || n.includes("female");
  });
  if (englishFemale) return englishFemale;

  return allVoices[0] || null;
}

// Request explicit microphone access (unlocks WebKit/iOS speech recognition sandbox)
export async function requestMicrophoneAccess() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return true;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Immediately release the test tracks so SpeechRecognition has full microphone control
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn("Microphone access request:", err);
    throw err;
  }
}

// Create Speech Recognizer configured for Kannada, Telugu, English (with iOS Safari & PWA support)
export function createSpeechRecognizer({ onResult, onError, onEnd, onStart, lang = "en-IN", continuous = false }) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognizer = new SpeechRecognition();

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  recognizer.lang = lang;
  // WebKit on iOS and Safari throws 'service-not-allowed' if continuous is true
  recognizer.continuous = (isIOS || isSafari) ? false : continuous;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onstart = () => {
    if (onStart) onStart();
  };

  recognizer.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (onResult) {
      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        rawEvent: event,
      });
    }
  };

  recognizer.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    if (onError) onError(event.error, event);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}

// Global active audio reference for speech playback
let activeAudioInstance = null;
let audioPlayQueue = [];
let isAudioQueuePlaying = false;

// Detect language script from text
export function detectTextLanguage(text) {
  if (!text) return "en-IN";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN"; // Kannada Unicode range
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu Unicode range
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Devanagari / Hindi Unicode range
  return "en-IN";
}

// Split text into natural sentence chunks for smooth audio synthesis (< 150 chars per chunk)
function splitTextIntoTTSChunks(text) {
  if (!text) return [];
  const rawSentences = text.split(/([.,!?।\n\r]+)/g);
  const chunks = [];
  let current = "";

  for (let part of rawSentences) {
    if (!part) continue;
    if ((current + part).length < 140) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      // If a single part is itself very long, split by words
      if (part.length >= 140) {
        const words = part.split(/\s+/);
        let wordChunk = "";
        for (let w of words) {
          if ((wordChunk + " " + w).length < 140) {
            wordChunk += (wordChunk ? " " : "") + w;
          } else {
            if (wordChunk.trim()) chunks.push(wordChunk.trim());
            wordChunk = w;
          }
        }
        if (wordChunk.trim()) current = wordChunk;
        else current = "";
      } else {
        current = part;
      }
    }
  }
  if (current.trim()) {
    chunks.push(current.trim());
  }
  return chunks.filter((c) => c.length > 0);
}

// Speak out text supporting Kannada, Telugu, Hindi, and Indian English with high-quality native audio
export function speakText(text, { lang = null, voiceName = null, onEnd, onError } = {}) {
  stopSpeaking();

  if (!text || typeof text !== "string" || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = text.trim();
  const targetLang = (lang || detectTextLanguage(cleanText)).toLowerCase();
  const langCode = targetLang.startsWith("kn")
    ? "kn"
    : targetLang.startsWith("te")
    ? "te"
    : targetLang.startsWith("hi")
    ? "hi"
    : "en";

  // For Kannada, Telugu, and Hindi, use high-fidelity natural Google TTS Audio stream
  // which works 100% on Windows, Mac, Android, and iOS without needing local voice packs
  if (langCode === "kn" || langCode === "te" || langCode === "hi") {
    const chunks = splitTextIntoTTSChunks(cleanText);
    if (chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    let chunkIndex = 0;
    isAudioQueuePlaying = true;

    const playNextChunk = () => {
      if (!isAudioQueuePlaying) return;
      if (chunkIndex >= chunks.length) {
        isAudioQueuePlaying = false;
        activeAudioInstance = null;
        if (onEnd) onEnd();
        return;
      }

      const chunk = chunks[chunkIndex];
      chunkIndex++;

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(chunk)}`;
      const audio = new Audio(url);
      activeAudioInstance = audio;

      audio.onended = () => {
        playNextChunk();
      };

      audio.onerror = (e) => {
        console.warn("TTS Audio error, falling back to Web Speech API:", e);
        // Fallback to browser SpeechSynthesis if audio stream fails
        fallbackWebSpeechSpeak(cleanText, targetLang, { onEnd, onError });
      };

      audio.play().catch((err) => {
        console.warn("Audio autoplay blocked or failed, trying Web Speech API:", err);
        fallbackWebSpeechSpeak(cleanText, targetLang, { onEnd, onError });
      });
    };

    playNextChunk();
    return;
  }

  // Fallback / English default Web Speech API
  fallbackWebSpeechSpeak(cleanText, targetLang, { voiceName, onEnd, onError });
}

// Fallback browser SpeechSynthesis implementation
function fallbackWebSpeechSpeak(text, targetLang, { voiceName = null, onEnd, onError } = {}) {
  if (!isSpeechSynthesisSupported()) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const allVoices = window.speechSynthesis.getVoices() || [];
    let chosenVoice = null;

    if (voiceName) {
      chosenVoice = allVoices.find((v) => v.name === voiceName);
    }
    if (!chosenVoice) {
      if (targetLang.startsWith("kn")) {
        chosenVoice = allVoices.find(
          (v) => (v.lang || "").toLowerCase().includes("kn") || (v.name || "").toLowerCase().includes("kannada")
        );
      } else if (targetLang.startsWith("te")) {
        chosenVoice = allVoices.find(
          (v) => (v.lang || "").toLowerCase().includes("te") || (v.name || "").toLowerCase().includes("telugu")
        );
      } else {
        chosenVoice = getBestIndianVoice();
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Web Speech synthesis error:", e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Failed to speak text:", err);
    if (onEnd) onEnd();
  }
}

// Stop all ongoing TTS speech immediately
export function stopSpeaking() {
  isAudioQueuePlaying = false;
  if (activeAudioInstance) {
    try {
      activeAudioInstance.pause();
      activeAudioInstance.currentTime = 0;
    } catch (_) {}
    activeAudioInstance = null;
  }
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

// --- Month Mapping Helper ---
const MONTHS_MAP = {
  january: "01", jan: "01",
  february: "02", feb: "02",
  march: "03", mar: "03",
  april: "04", apr: "04",
  may: "05",
  june: "06", jun: "06",
  july: "07", jul: "07",
  august: "08", aug: "08",
  september: "09", sep: "09", sept: "09",
  october: "10", oct: "10",
  november: "11", nov: "11",
  december: "12", dec: "12",
};

// Helper to extract Date (YYYY-MM-DD) from spoken text
function extractDate(text) {
  const clean = text.toLowerCase().replace(/,/g, " ");

  // 1. Match: "15th August 1995" / "15 August 1995" / "15 Aug 1995"
  const dmyRegex = /(\b[0-3]?\d)(?:st|nd|rd|th)?\s+(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\d{4})\b/i;
  const dmyMatch = clean.match(dmyRegex);
  if (dmyMatch) {
    const day = String(dmyMatch[1]).padStart(2, "0");
    const month = MONTHS_MAP[dmyMatch[2].toLowerCase()];
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 2. Match: "August 15th 1995" / "August 15 1995"
  const mdyRegex = /(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\b[0-3]?\d)(?:st|nd|rd|th)?\s+(\d{4})\b/i;
  const mdyMatch = clean.match(mdyRegex);
  if (mdyMatch) {
    const month = MONTHS_MAP[mdyMatch[1].toLowerCase()];
    const day = String(mdyMatch[2]).padStart(2, "0");
    const year = mdyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 3. Match: "15/08/1995" or "15-08-1995" or "15.08.1995"
  const slashRegex = /\b([0-3]?\d)[/.-]([0-1]?\d)[/.-](\d{4})\b/;
  const slashMatch = clean.match(slashRegex);
  if (slashMatch) {
    const day = String(slashMatch[1]).padStart(2, "0");
    const month = String(slashMatch[2]).padStart(2, "0");
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 4. Match: "1995-08-15" (ISO)
  const isoRegex = /\b(\d{4})[-/]([0-1]?\d)[-/]([0-3]?\d)\b/;
  const isoMatch = clean.match(isoRegex);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = String(isoMatch[2]).padStart(2, "0");
    const day = String(isoMatch[3]).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}

// Helper to extract Time (HH:MM in 24h format) from spoken text
function extractTime(text) {
  const clean = text.toLowerCase();

  // 1. Match: "2:30 PM" / "02:30 AM" / "2 30 PM" / "2.30 PM"
  const time12Regex = /\b(\d{1,2})[:.\s](\d{2})\s*(am|pm)\b/i;
  const time12Match = clean.match(time12Regex);
  if (time12Match) {
    let hours = parseInt(time12Match[1], 10);
    const minutes = String(time12Match[2]).padStart(2, "0");
    const meridiem = time12Match[3].toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // 2. Match: "2 PM" / "10 AM"
  const hour12Regex = /\b(\d{1,2})\s*(am|pm)\b/i;
  const hour12Match = clean.match(hour12Regex);
  if (hour12Match) {
    let hours = parseInt(hour12Match[1], 10);
    const meridiem = hour12Match[2].toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:00`;
  }

  // 3. Match: "14:30" / "09:15" (24h format)
  const time24Regex = /\b([0-2]?\d):([0-5]\d)\b/;
  const time24Match = clean.match(time24Regex);
  if (time24Match) {
    const hours = String(time24Match[1]).padStart(2, "0");
    const minutes = String(time24Match[2]).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // 4. Natural keywords: "morning 9", "evening 6:30", "night 10"
  const natEveRegex = /(?:evening|night|afternoon)\s+(\d{1,2})(?:[:.](\d{2}))?/i;
  const eveMatch = clean.match(natEveRegex);
  if (eveMatch) {
    let hours = parseInt(eveMatch[1], 10);
    const minutes = eveMatch[2] ? String(eveMatch[2]).padStart(2, "0") : "00";
    if (hours < 12) hours += 12;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  const natMornRegex = /(?:morning)\s+(\d{1,2})(?:[:.](\d{2}))?/i;
  const mornMatch = clean.match(natMornRegex);
  if (mornMatch) {
    let hours = parseInt(mornMatch[1], 10);
    const minutes = mornMatch[2] ? String(mornMatch[2]).padStart(2, "0") : "00";
    if (hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  return null;
}

// Helper to extract Place / City and lookup coordinates
function extractPlace(text) {
  const clean = text.toLowerCase();

  // Check known cities first
  for (const [key, info] of Object.entries(COMMON_CITIES)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(clean)) {
      return info;
    }
  }

  // Extract from phrases like "place is Hyderabad", "city Chennai", "born in Pune", "location Tirupati"
  const placeRegex = /(?:place is|place|city is|city|location is|location|born in|in|at)\s+([a-zA-Z\s]{3,25})/i;
  const match = clean.match(placeRegex);
  if (match) {
    const candidate = match[1].trim().split(/\s+(?:time|date|dob|tob|hours|am|pm|groom|bride)\b/i)[0].trim();
    if (candidate && candidate.length >= 3) {
      const lowerCand = candidate.toLowerCase();
      if (COMMON_CITIES[lowerCand]) {
        return COMMON_CITIES[lowerCand];
      }
      return {
        city: candidate.charAt(0).toUpperCase() + candidate.slice(1) + ", India",
        latitude: "",
        longitude: "",
        timezone: "5.5",
      };
    }
  }

  return null;
}

// Helper to detect target: "groom", "bride", or "jataka"
function detectTarget(text) {
  const clean = text.toLowerCase();
  if (/\b(groom|boy|male|first person|man|husband)\b/i.test(clean)) {
    return "groom";
  }
  if (/\b(bride|girl|female|second person|woman|wife)\b/i.test(clean)) {
    return "bride";
  }
  return "jataka";
}

// Main Voice Command Parser exclusively for Birth Details (DOB, TOB, Place)
export function parseVoiceBirthDetails(text) {
  if (!text || typeof text !== "string") return null;

  const target = detectTarget(text);
  const dob = extractDate(text);
  const tob = extractTime(text);
  const placeObj = extractPlace(text);

  const hasAnyData = Boolean(dob || tob || placeObj);

  if (!hasAnyData) {
    return {
      type: "unknown",
      query: text,
      response:
        "Please speak your birth details. For example: 'Set Date of Birth 15th August 1995, Time 2:30 PM, Place Hyderabad'.",
    };
  }

  // Construct confirmation message
  const parts = [];
  if (dob) {
    const [y, m, d] = dob.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mStr = monthNames[parseInt(m, 10) - 1];
    parts.push(`Date of birth: ${d} ${mStr} ${y}`);
  }
  if (tob) {
    const [h, min] = tob.split(":");
    let hNum = parseInt(h, 10);
    const meridiem = hNum >= 12 ? "PM" : "AM";
    if (hNum > 12) hNum -= 12;
    if (hNum === 0) hNum = 12;
    parts.push(`Time: ${hNum}:${min} ${meridiem}`);
  }
  if (placeObj && placeObj.city) {
    parts.push(`Place: ${placeObj.city.split(",")[0]}`);
  }

  const targetLabel = target === "groom" ? "Groom " : target === "bride" ? "Bride " : "";
  const response = `${targetLabel}${parts.join(", ")}. Updated successfully.`;

  return {
    type: "fill_birth_details",
    target: target, // "jataka" | "groom" | "bride"
    data: {
      dob: dob || null,
      tob: tob || null,
      city: placeObj ? placeObj.city : null,
      latitude: placeObj ? placeObj.latitude : null,
      longitude: placeObj ? placeObj.longitude : null,
      timezone: placeObj ? placeObj.timezone : null,
    },
    response: response,
  };
}

// Dispatch event so active pages (Horoscope / Match) receive updates automatically
export function dispatchVoiceBirthEvent(parsedResult) {
  if (typeof window !== "undefined" && parsedResult && parsedResult.type === "fill_birth_details") {
    window.dispatchEvent(
      new CustomEvent("vaiswanara_voice_birth_input", {
        detail: parsedResult,
      })
    );
  }
}
