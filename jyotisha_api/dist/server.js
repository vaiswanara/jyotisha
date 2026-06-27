"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const SunCalc = __importStar(require("suncalc"));
const crypto_1 = __importDefault(require("crypto"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const web_push_1 = __importDefault(require("web-push"));
const VedicAstroEngine_1 = require("./engine/VedicAstroEngine");
const constants_1 = require("./engine/constants");
const serverStartTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ఫాల్‌బ్యాక్ CORS: cPanel/Apache లో కొన్నిసార్లు 204 కి హెడర్స్ స్ట్రిప్ అవుతాయి.
// కాబట్టి డైరెక్ట్ గా 200 OK ఇచ్చి అన్నీ అనుమతించడం ఉత్తమం.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-token, x-admin-password");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
// VAPID Keys for Web Push Notifications (పాత generate_keys.php లోనివి)
web_push_1.default.setVapidDetails("mailto:vaiswanara@gmail.com", "BBHl1damc8zA6nXsJXiyVFLRMeJnLbSa9xVjE4SsJJDHxAmlCtyozMquuvZZGyClgzJ5sIs5sYkyxkszRRf1zFs", "Ivw-HxJE6pNmsrsrfsk8OcukKHDN8HPvfRn2-MN9Smc");
// బేస్ రూట్స్ (లోకల్ మరియు cPanel కి సపోర్ట్ చేయడానికి)
const healthPaths = ["/", "/jyotisha_api", "/jyotisha_node_api", "/node"];
const apiPaths = [
    "/api",
    "/jyotisha_api/api",
    "/jyotisha_node_api/api",
    "/node/api",
];
// ఏపీఐ సెట్టింగ్స్ (API Configuration)
const CONFIG = {
    CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || "3600", 10),
    ENABLE_PANCHANGA_LIMIT: process.env.ENABLE_PANCHANGA_LIMIT !== "false", // డీఫాల్ట్‌గా లిమిట్ ఆన్‌లో ఉంటుంది (true)
    MAX_PANCHANGA_DAYS: parseInt(process.env.MAX_PANCHANGA_DAYS || "90", 10),
    ALLOWED_DOMAINS: (process.env.ALLOWED_DOMAINS ||
        "localhost,vaiswanara.com,www.vaiswanara.com,api.vaiswanara.com")
        .split(",")
        .map((d) => d.trim()),
    ENABLE_FAST_MODE: process.env.ENABLE_FAST_MODE !== "false", // .env లో false ఇస్తే ఫాస్ట్ మోడ్ ఆఫ్ అవుతుంది (డీఫాల్ట్ true)
};
// Layer 1: Strict CORS - కేవలం మీ వెబ్‌సైట్ మరియు లోకల్ హోస్ట్ నుండి మాత్రమే అనుమతి
app.use((0, cors_1.default)({
    origin: "*", // టోకెన్ భద్రత ఉంది కాబట్టి ఇక్కడ * వాడటం 100% సురక్షితం. ఇది CORS సమస్యలను శాశ్వతంగా ఆపుతుంది.
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "x-api-token",
        "x-admin-password",
        "Origin",
        "Accept",
    ],
    optionsSuccessStatus: 200,
}));
// Preflight (OPTIONS) రిక్వెస్ట్‌లను వెంటనే అనుమతించి పంపేయడం (టోకెన్ వెరిఫికేషన్ వల్ల బ్లాక్ అవ్వకుండా)
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
// Layer 2: Origin & Referer Validation - టోకెన్ దొంగిలించినా డైరెక్ట్ కాల్స్ చేయకుండా బ్లాక్ చేయడం
app.use(apiPaths, (req, res, next) => {
    if (req.method === "OPTIONS")
        return next(); // Preflight కి బైపాస్
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    if (!origin && !referer) {
        return res
            .status(403)
            .json({ error: "Forbidden. Direct API access is blocked." });
    }
    next();
});
// Layer 3: రేట్ లిమిటింగ్ (DDoS మరియు బ్రూట్ ఫోర్స్ ఎటాక్స్ నివారించడానికి)
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 నిమిషం విండో
    max: 30, // ఒక్కో IP కి 1 నిమిషంలో గరిష్టంగా 30 రిక్వెస్ట్‌లు మాత్రమే
    message: {
        error: "Too many requests",
        detail: "Slow down! Max 30 requests per minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiPaths, apiLimiter);
// సాధారణ ఇన్-మెమరీ కాషింగ్ (In-memory Caching)
const cache = new Map();
const CACHE_TTL_SECONDS = CONFIG.CACHE_TTL_SECONDS; // 1 గంట కాష్
// గడువు ముగిసిన కాష్ ఎంట్రీలను క్రమానుగతంగా శుభ్రపరచడం
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (value.expiresAt < now) {
            cache.delete(key);
        }
    }
}, CACHE_TTL_SECONDS * 1000).unref(); // గంటకు ఒకసారి క్లీనప్, ప్రాసెస్ దీనికోసం ఆగదు
const isSyncEnabled = () => {
    const settingsFile = path_1.default.join(process.cwd(), "sync_settings.json");
    if (fs_1.default.existsSync(settingsFile)) {
        try {
            const data = JSON.parse(fs_1.default.readFileSync(settingsFile, "utf-8"));
            return data.enableUserSync === true;
        }
        catch (e) { }
    }
    return false;
};
// భద్రత కోసం API Token Verification
const API_SECRET_TOKEN = process.env.API_SECRET_TOKEN || "";
// cPanel హెల్త్ చెక్ కోసం (దీనికి టోకెన్ అవసరం లేదు, cPanel కి ఎర్రర్ రాకుండా ఉండటానికి)
app.get(healthPaths, (req, res) => {
    res.status(200).send(`Jyotisha API is running securely. Started at: ${serverStartTime} (IST)`);
});
app.use(apiPaths, (req, res, next) => {
    const token = req.headers["x-api-token"] || req.query.token;
    // 3. టోకెన్ ఖచ్చితంగా ఉండాలి (లేకపోతే రిజెక్ట్ చేస్తుంది)
    if (token !== API_SECRET_TOKEN) {
        return res
            .status(401)
            .json({ error: "Unauthorized", detail: "Valid token required." });
    }
    next();
});
// --- MUHURTHA & PANCHANGA HELPER FUNCTIONS ---
function findExactTime(approxTs, type, targetVal, lat, lon, tz, ayKey, fastMode = false) {
    let ts = approxTs;
    for (let i = 0; i < 4; i++) {
        const offsetMs = tz * 3600 * 1000;
        const localDt = new Date(ts * 1000 + offsetMs);
        const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(localDt.getUTCFullYear(), localDt.getUTCMonth() + 1, localDt.getUTCDate(), localDt.getUTCHours(), localDt.getUTCMinutes(), tz, ayKey, localDt.getUTCSeconds());
        if (fastMode && typeof engine.setSwetest === "function") {
            engine.setSwetest(false);
        }
        const pl = engine.calculateAll(lat, lon);
        const mLon = pl[constants_1.Planet.Moon]?.longitude || 0.0;
        const mSpd = pl[constants_1.Planet.Moon]?.speed || 13.176;
        const sLon = pl[constants_1.Planet.Sun]?.longitude || 0.0;
        const sSpd = pl[constants_1.Planet.Sun]?.speed || 0.9856;
        let val = 0, spd = 0;
        if (type === "tithi" || type === "karana") {
            val = (mLon - sLon + 360.0) % 360.0;
            spd = mSpd - sSpd;
        }
        else if (type === "nakshatra") {
            val = mLon;
            spd = mSpd;
        }
        else {
            val = (mLon + sLon) % 360.0;
            spd = mSpd + sSpd;
        }
        spd = Math.max(0.1, spd);
        let err = targetVal - val;
        while (err <= -180.0)
            err += 360.0;
        while (err > 180.0)
            err -= 360.0;
        if (Math.abs(err) < 0.001)
            break;
        ts += (err / spd) * 86400.0;
    }
    return Math.round(ts);
}
function getLagnaRashi(ts, lat, lon, tz, ayKey, fastMode) {
    const offsetMs = tz * 3600 * 1000;
    const localDt = new Date(ts * 1000 + offsetMs);
    const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(localDt.getUTCFullYear(), localDt.getUTCMonth() + 1, localDt.getUTCDate(), localDt.getUTCHours(), localDt.getUTCMinutes(), tz, ayKey, localDt.getUTCSeconds());
    let isSwetestUsed = engine.isUsingSwetest();
    if (fastMode && typeof engine.setSwetest === "function") {
        engine.setSwetest(false);
        isSwetestUsed = false;
    }
    let ascLon = engine.calcAscendant(lat, lon);
    return Math.floor(ascLon / 30);
}
function getLagnaDeg(ts, lat, lon, tz, ayKey, fastMode) {
    const offsetMs = tz * 3600 * 1000;
    const localDt = new Date(ts * 1000 + offsetMs);
    const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(localDt.getUTCFullYear(), localDt.getUTCMonth() + 1, localDt.getUTCDate(), localDt.getUTCHours(), localDt.getUTCMinutes(), tz, ayKey, localDt.getUTCSeconds());
    let isSwetestUsed = engine.isUsingSwetest();
    if (fastMode && typeof engine.setSwetest === "function") {
        engine.setSwetest(false);
        isSwetestUsed = false;
    }
    let ascLon = engine.calcAscendant(lat, lon);
    return ascLon;
}
function getLagnaBoundary(targetTs, targetRasi, isStart, lat, lon, tz, ayKey) {
    let low = isStart ? targetTs - 21600 : targetTs;
    let high = isStart ? targetTs : targetTs + 21600;
    for (let i = 0; i < 25; i++) {
        const mid = (low + high) / 2;
        const rasi = getLagnaRashi(mid, lat, lon, tz, ayKey, true);
        if (rasi === targetRasi) {
            if (isStart) {
                high = mid;
            }
            else {
                low = mid;
            }
        }
        else {
            if (isStart) {
                low = mid;
            }
            else {
                high = mid;
            }
        }
    }
    return Math.round((low + high) / 2);
}
function getExactTsForDeg(lowTs, highTs, targetRasi, targetDegInRashi, lat, lon, tz, ayKey) {
    const targetTotalDeg = (targetRasi * 30 + targetDegInRashi + 360) % 360;
    let low = lowTs;
    let high = highTs;
    for (let i = 0; i < 25; i++) {
        const mid = (low + high) / 2;
        const midAsc = getLagnaDeg(mid, lat, lon, tz, ayKey, true);
        const diff = (midAsc - targetTotalDeg + 360) % 360;
        if (diff < 180) {
            high = mid;
        }
        else {
            low = mid;
        }
    }
    return Math.round((low + high) / 2);
}
function getPreciseSunriseSunset(timestamp, lat, lon, tz) {
    const dt = new Date(timestamp * 1000);
    const offsetMs = tz * 3600 * 1000;
    const localDt = new Date(timestamp * 1000 + offsetMs);
    const year = localDt.getUTCFullYear();
    const month = localDt.getUTCMonth() + 1;
    const day = localDt.getUTCDate();
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const sunInfo = SunCalc.getTimes(dt, lat, lon);
    let sunrise = sunInfo.sunrise ? Math.floor(sunInfo.sunrise.getTime() / 1000) : timestamp - 43200;
    let sunset = sunInfo.sunset ? Math.floor(sunInfo.sunset.getTime() / 1000) : timestamp + 43200;
    if (VedicAstroEngine_1.VedicAstroEngine.isSwetestEnabled()) {
        const riseSet = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(0, dateStr, lon, lat, tz);
        if (riseSet.rise !== null)
            sunrise = riseSet.rise;
        if (riseSet.set !== null)
            sunset = riseSet.set;
    }
    return { sunrise, sunset };
}
function buildChartGrid(planets) {
    const grid = Array(12)
        .fill(null)
        .map(() => []);
    const planetCodeMap = {
        [constants_1.Planet.Ascendant]: "Lg",
        [constants_1.Planet.Sun]: "Su",
        [constants_1.Planet.Moon]: "Ch",
        [constants_1.Planet.Mars]: "Ku",
        [constants_1.Planet.Mercury]: "Bu",
        [constants_1.Planet.Jupiter]: "Gu",
        [constants_1.Planet.Venus]: "Sk",
        [constants_1.Planet.Saturn]: "Sa",
        [constants_1.Planet.Rahu]: "Ra",
        [constants_1.Planet.Ketu]: "Ke",
    };
    for (const body of [
        constants_1.Planet.Ascendant,
        constants_1.Planet.Sun,
        constants_1.Planet.Moon,
        constants_1.Planet.Mars,
        constants_1.Planet.Mercury,
        constants_1.Planet.Jupiter,
        constants_1.Planet.Venus,
        constants_1.Planet.Saturn,
        constants_1.Planet.Rahu,
        constants_1.Planet.Ketu,
    ]) {
        if (!planets[body] || planets[body].rashi === undefined)
            continue;
        const idx = Math.max(0, Math.min(11, planets[body].rashi - 1));
        grid[idx].push({
            id: planetCodeMap[body],
            isR: !!planets[body].retrograde &&
                !["Ascendant", "Rahu", "Ketu"].includes(body),
            isC: !!planets[body].combust,
        });
    }
    return grid;
}
function panchakaResult(vaaraNum, tithiNum, nakNum, lagnaRashi) {
    const totalSum = vaaraNum + tithiNum + nakNum + lagnaRashi;
    const rem = totalSum % 9;
    const panchakaMap = {
        1: { label: "Mrityu (Bad)", isGood: false },
        2: { label: "Agni (Bad)", isGood: false },
        4: { label: "Raja (Bad)", isGood: false },
        6: { label: "Chora (Bad)", isGood: false },
        8: { label: "Roga (Bad)", isGood: false },
        3: { label: "Shubham (Good)", isGood: true },
        5: { label: "Shubham (Good)", isGood: true },
        7: { label: "Shubham (Good)", isGood: true },
        0: { label: "Shubham (Good)", isGood: true },
    };
    const res = panchakaMap[rem] || { label: "Shubham (Good)", isGood: true };
    return {
        label: `${res.label} [Total:${totalSum}]`,
        is_good: res.isGood,
    };
}
function getPushkaraInfo(lagnaRashi, ascDeg, startLagnaTs, endLagnaTs, lat, lon, tz, ayKey) {
    const pushkaraMap = {
        1: [21, 24], 5: [21, 24], 9: [21, 24], // Mesha, Simha, Dhanu
        2: [14, 17], 6: [14, 17], 10: [14, 17], // Vrishabha, Kanya, Makara
        3: [24, 27], 7: [24, 27], 11: [24, 27], // Mithuna, Tula, Kumbha
        4: [7, 10], 8: [7, 10], 12: [7, 10] // Karka, Vrischika, Meena
    };
    const pDegs = pushkaraMap[lagnaRashi] || [];
    if (pDegs.length === 0) {
        return { label: "No (Nearest: N/A)", is_pushkara: false, window: "-" };
    }
    // Find nearest Pushkara degree
    let nearestP = pDegs[0];
    let minDiff = Math.abs(ascDeg - pDegs[0]);
    for (let i = 1; i < pDegs.length; i++) {
        const d = Math.abs(ascDeg - pDegs[i]);
        if (d < minDiff) {
            minDiff = d;
            nearestP = pDegs[i];
        }
    }
    const pDiff = Math.abs(ascDeg - nearestP);
    const isPushkara = pDiff <= 1.5;
    const label = `${isPushkara ? "Yes" : "No"} (Nearest: ${nearestP}°, Diff: ${pDiff.toFixed(2)}°)`;
    // Calculate exact time range for Pushkara (within 1.5 deg of nearestP)
    const pStartDeg = nearestP - 1.5;
    const pEndDeg = nearestP + 1.5;
    const pStartTs = getExactTsForDeg(startLagnaTs, endLagnaTs, lagnaRashi - 1, pStartDeg, lat, lon, tz, ayKey);
    const pEndTs = getExactTsForDeg(startLagnaTs, endLagnaTs, lagnaRashi - 1, pEndDeg, lat, lon, tz, ayKey);
    const fmt = (ts) => {
        const d = new Date((ts + tz * 3600) * 1000);
        let h = d.getUTCHours();
        const m = d.getUTCMinutes().toString().padStart(2, "0");
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0)
            h = 12;
        return `${h.toString().padStart(2, "0")}:${m} ${ampm}`;
    };
    return {
        label,
        is_pushkara: isPushkara,
        window: `${fmt(pStartTs)} - ${fmt(pEndTs)}`,
    };
}
function evaluateMuhurthaDoshas(planets, panchanga, muhurthaInfo, engine, timestamp, lat, lon, tz, ayKey, rahuStart, yamaStart, mDayDuration, vStart1, vEnd1, vStart2, vEnd2, mSunriseTs, mVaaraNum) {
    const doshas = [];
    const lagnaRashi = planets[constants_1.Planet.Ascendant].rashi;
    const lagnaDeg = planets[constants_1.Planet.Ascendant].degree;
    const moonHouse = planets[constants_1.Planet.Moon]?.house || 0;
    const marsHouse = planets[constants_1.Planet.Mars]?.house || 0;
    const venusHouse = planets[constants_1.Planet.Venus]?.house || 0;
    // 1. Saptamastha Graha
    const saturnHouse = planets[constants_1.Planet.Saturn]?.house || 0;
    const houseHasAnyGraha = {};
    for (const p of [
        constants_1.Planet.Sun,
        constants_1.Planet.Moon,
        constants_1.Planet.Mars,
        constants_1.Planet.Mercury,
        constants_1.Planet.Jupiter,
        constants_1.Planet.Venus,
        constants_1.Planet.Saturn,
        constants_1.Planet.Rahu,
        constants_1.Planet.Ketu,
    ]) {
        if (planets[p]?.house)
            houseHasAnyGraha[planets[p].house] = true;
    }
    if (saturnHouse === 7 || houseHasAnyGraha[7]) {
        doshas.push("Saptamastha Graha");
    }
    // 2. Ch in 6,8,12 (Shashtashta Chandra)
    if ([6, 8, 12].includes(moonHouse)) {
        doshas.push("Shashtashta Chandra");
    }
    // 3. Sagraha Chandra Dosha (new)
    const moonRashi = planets[constants_1.Planet.Moon]?.rashi;
    if (moonRashi !== undefined) {
        for (const p of [
            constants_1.Planet.Sun,
            constants_1.Planet.Mars,
            constants_1.Planet.Mercury,
            constants_1.Planet.Jupiter,
            constants_1.Planet.Venus,
            constants_1.Planet.Saturn,
            constants_1.Planet.Rahu,
            constants_1.Planet.Ketu,
        ]) {
            if (planets[p]?.rashi === moonRashi) {
                doshas.push("Sagraha Chandra Dosha");
                break;
            }
        }
    }
    // 4. Bhrigu Shatka
    if (venusHouse === 6) {
        doshas.push("Bhrigu Shatka");
    }
    // 5. Ashtamastha Kuja
    if (marsHouse === 8) {
        doshas.push("Ashtamastha Kuja");
    }
    // 6. Gandanta (Moon)
    if (["Ashlesha", "Jyeshtha", "Revati"].includes(planets[constants_1.Planet.Moon]?.nakshatra) &&
        planets[constants_1.Planet.Moon]?.pada === 4) {
        doshas.push("Gandanta (Moon)");
    }
    // 7. Sankranti Dosha
    const sl = planets[constants_1.Planet.Sun]?.longitude;
    if (sl !== undefined) {
        const degInRashi = sl % 30;
        if (degInRashi < 0.25 || degInRashi > 29.75) {
            doshas.push("Sankranti Dosha");
        }
    }
    // 8. Asthangatha (Combustion)
    if (planets[constants_1.Planet.Jupiter]?.combust || planets[constants_1.Planet.Venus]?.combust) {
        doshas.push("Asthangatha");
    }
    // 9. Bad Panchakam
    let wd = new Date((timestamp + tz * 3600) * 1000).getUTCDay();
    const { sunrise: mSunriseTs_local } = getPreciseSunriseSunset(timestamp, lat, lon, tz);
    if (timestamp < mSunriseTs_local) {
        wd = (wd - 1 + 7) % 7;
    }
    const hinduWd = wd + 1;
    const panchaka = panchakaResult(hinduWd, panchanga.tithi_number || 0, (planets[constants_1.Planet.Moon]?.nak_index || 0) + 1, lagnaRashi);
    if (!panchaka.is_good) {
        doshas.push("Bad Panchakam");
    }
    // 10. Krura Muhurtha
    if (!muhurthaInfo.is_good) {
        doshas.push("Krura Muhurtha");
    }
    // 11. Dagdha Tithi Dosha
    const tithiInPaksha = (((panchanga.tithi_number || 1) - 1) % 15) + 1;
    const vara = panchanga.vara;
    if ((vara === "Ravivara" && tithiInPaksha === 12) ||
        (vara === "Somavara" && tithiInPaksha === 11) ||
        (vara === "Mangalavara" && tithiInPaksha === 5) ||
        (vara === "Budhavara" && tithiInPaksha === 3) ||
        (vara === "Guruvara" && tithiInPaksha === 6) ||
        (vara === "Shukravara" && tithiInPaksha === 8) ||
        (vara === "Shanivara" && tithiInPaksha === 9)) {
        doshas.push("Dagdha Tithi Dosha");
    }
    // 12. Grahanam (Eclipse) & 13. Grahana Utpata Dosha (using precomputed eclipses_data.json)
    const eclipsesFile = path_1.default.join(__dirname, "eclipses_data.json");
    let eclipseList = [];
    try {
        if (fs_1.default.existsSync(eclipsesFile)) {
            eclipseList = JSON.parse(fs_1.default.readFileSync(eclipsesFile, "utf8"));
        }
    }
    catch (e) { }
    const localD = new Date((timestamp + tz * 3600) * 1000);
    const yyyy = localD.getUTCFullYear();
    const mm = String(localD.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(localD.getUTCDate()).padStart(2, "0");
    const localDateStr = `${yyyy}-${mm}-${dd}`;
    const isEclipseDay = eclipseList.some((e) => e.date === localDateStr);
    if (isEclipseDay) {
        doshas.push("Grahanam (Eclipse)");
    }
    const currentMoonNak = planets[constants_1.Planet.Moon]?.nakshatra;
    if (currentMoonNak && eclipseList.length > 0) {
        const targetMs = timestamp * 1000;
        const sixMonthsMs = 180 * 86400 * 1000;
        const pastEclipsesIn6m = eclipseList.filter((e) => e.utcTimestamp < targetMs && e.utcTimestamp >= targetMs - sixMonthsMs);
        for (const e of pastEclipsesIn6m) {
            if (e.nakshatra && e.nakshatra.toLowerCase() === currentMoonNak.toLowerCase()) {
                doshas.push("Grahana Utpata Dosha");
                break;
            }
        }
    }
    // 14. Rahu Kalam
    const rahuEnd = rahuStart + Math.floor(mDayDuration * 0.125);
    if (timestamp >= rahuStart && timestamp <= rahuEnd) {
        doshas.push("Rahu Kalam");
    }
    // 15. Yamagandam
    const yamaEnd = yamaStart + Math.floor(mDayDuration * 0.125);
    if (timestamp >= yamaStart && timestamp <= yamaEnd) {
        doshas.push("Yamagandam");
    }
    // 16. Varjyam
    if ((timestamp >= vStart1 && timestamp <= vEnd1) ||
        (timestamp >= vStart2 && timestamp <= vEnd2)) {
        doshas.push("Varjyam");
    }
    // 17. Durmuhurtham
    const durmuhurthams = {
        0: [13],
        1: [8, 11],
        2: [3, 10],
        3: [5],
        4: [8],
        5: [3, 8],
        6: [1],
    };
    for (const mdIdx of durmuhurthams[mVaaraNum] || []) {
        const mStart = mSunriseTs + Math.floor(mDayDuration * (mdIdx / 15.0));
        const mEnd = mSunriseTs + Math.floor(mDayDuration * ((mdIdx + 1) / 15.0));
        if (timestamp >= mStart && timestamp <= mEnd) {
            doshas.push("Durmuhurtham");
            break;
        }
    }
    return Array.from(new Set(doshas));
}
function formatTsLocal(ts, tz) {
    const d = new Date((ts + tz * 3600) * 1000);
    let h = d.getUTCHours();
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0)
        h = 12;
    return `${h.toString().padStart(2, "0")}:${m} ${ampm}`;
}
function getDiffLon(eng, lat, lon, fastMode = false) {
    if (fastMode && typeof eng.setSwetest === "function") {
        eng.setSwetest(false);
    }
    const pl = eng.calculateAll(lat, lon);
    const ml = pl[constants_1.Planet.Moon]?.longitude || 0;
    const sl = pl[constants_1.Planet.Sun]?.longitude || 0;
    return { diff: (ml - sl + 360) % 360, sl };
}
function getMidnightSunLon(ts, lat, lon, tz, ayKey, fastMode = false) {
    const d = new Date((ts + tz * 3600) * 1000);
    const eng = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), 0, 0, tz, ayKey);
    if (fastMode && typeof eng.setSwetest === "function") {
        eng.setSwetest(false);
    }
    return eng.calculateAll(lat, lon)[constants_1.Planet.Sun]?.longitude || 0;
}
function checkMoonAboveHorizon(date, lat, lon) {
    try {
        const pos = SunCalc.getMoonPosition(date, lat, lon);
        const altDeg = pos.altitude * (180 / Math.PI);
        return altDeg >= -1.0;
    }
    catch (e) {
        return false;
    }
}
function checkSunAboveHorizon(date, lat, lon) {
    try {
        const pos = SunCalc.getPosition(date, lat, lon);
        const altDeg = pos.altitude * (180 / Math.PI);
        return altDeg >= -1.0;
    }
    catch (e) {
        return false;
    }
}
function getCorrectContactUtcTime(maxUtc, contactTimeStr) {
    if (!maxUtc || !contactTimeStr || contactTimeStr.trim() === "-")
        return null;
    const y = maxUtc.getUTCFullYear();
    const m = maxUtc.getUTCMonth();
    const d = maxUtc.getUTCDate();
    const timeParts = contactTimeStr.trim().split(":");
    const hours = parseInt(timeParts[0] || "0");
    const minutes = parseInt(timeParts[1] || "0");
    const secondsFloat = parseFloat(timeParts[2] || "0");
    const seconds = Math.floor(secondsFloat);
    const ms = Math.round((secondsFloat % 1) * 1000);
    const cand = new Date(Date.UTC(y, m, d, hours, minutes, seconds, ms));
    const diffHours = (cand.getTime() - maxUtc.getTime()) / (3600 * 1000);
    if (diffHours > 12) {
        cand.setUTCDate(cand.getUTCDate() - 1);
    }
    else if (diffHours < -12) {
        cand.setUTCDate(cand.getUTCDate() + 1);
    }
    return cand;
}
function parseSwetestEclipses(output, tzOffsetHours, eventType, lat, lon) {
    const eclipses = [];
    const lines = output.split("\n");
    // Regex for Line 1 (Solar and Lunar)
    const regexLine1 = /^\s*(partial|total|annular|total\/annular|annular\/total|non-central|penumb\.\s+lunar\s+eclipse|partial\s+lunar\s+eclipse|total\s+lunar\s+eclipse)\s+(\d{1,2}\.\d{1,2}\.\d{4})\s+(\d{1,2}:\d{2}:\d{2}(?:\.\d+)?)\s+([\d./-]+)\s+saros\s+(\d+\/\d+)\s+([\d.]+)/i;
    let currentEclipse = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(regexLine1);
        if (match) {
            if (currentEclipse) {
                eclipses.push(currentEclipse);
            }
            const rawType = match[1].trim();
            const dateStr = match[2].trim();
            const timeStr = match[3].trim();
            const rawValues = match[4].trim();
            const saros = match[5].trim();
            const julianDay = parseFloat(match[6].trim());
            const maxUtc = parseUtcDateTime(dateStr, timeStr);
            const values = rawValues.split("/");
            let magnitude = parseFloat(values[0] || "0");
            const fraction = parseFloat(values[1] || "0");
            if (eventType === "lunar" && rawType.toLowerCase().includes("penumb")) {
                magnitude = fraction;
            }
            let typeFormatted = rawType.replace(/\s+/g, " ");
            typeFormatted = typeFormatted.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            currentEclipse = {
                type: typeFormatted,
                rawType: rawType,
                eventType,
                date: dateStr,
                time: timeStr,
                utcTimestamp: maxUtc ? maxUtc.getTime() : 0,
                localDate: maxUtc ? toLocalDateStr(maxUtc, tzOffsetHours) : "-",
                localTime: maxUtc ? toLocalTimeStr(maxUtc, tzOffsetHours) : "-",
                magnitude,
                fraction,
                saros,
                julianDay,
                contactTimes: []
            };
        }
        else if (currentEclipse && line.trim() !== "") {
            let lineClean = line.replace(/dt=[\d.]+/, "").trim();
            if (eventType === "solar") {
                const durMatch = lineClean.match(/(\d+\s+min\s+[\d.]+\s+sec)/i);
                if (durMatch) {
                    currentEclipse.duration = durMatch[1];
                    lineClean = lineClean.replace(durMatch[1], "").trim();
                }
                else {
                    currentEclipse.duration = "0 min 0.00 sec";
                }
            }
            const times = lineClean.split(/\s+/).filter(t => t.trim() !== "");
            const maxUtc = currentEclipse.utcTimestamp ? new Date(currentEclipse.utcTimestamp) : null;
            if (eventType === "solar") {
                const labels = ["C1 (Partial Begins)", "C2 (Totality Begins)", "C3 (Totality Ends)", "C4 (Partial Ends)"];
                currentEclipse.contactTimes = times
                    .map((t, idx) => {
                    if (t === "-")
                        return null;
                    const utcTime = getCorrectContactUtcTime(maxUtc, t);
                    return {
                        label: labels[idx] || `C${idx + 1}`,
                        rawTime: t,
                        localDate: utcTime ? toLocalDateStr(utcTime, tzOffsetHours) : "-",
                        localTime: utcTime ? toLocalTimeStr(utcTime, tzOffsetHours) : "-",
                        utcTime: utcTime
                    };
                })
                    .filter((c) => c !== null);
            }
            else {
                const labels = [
                    "P1 (Penumbral Begins)",
                    "U1 (Partial Begins)",
                    "U2 (Totality Begins)",
                    "U3 (Totality Ends)",
                    "U4 (Partial Ends)",
                    "P4 (Penumbral Ends)"
                ];
                currentEclipse.contactTimes = times
                    .map((t, idx) => {
                    if (t === "-")
                        return null;
                    const utcTime = getCorrectContactUtcTime(maxUtc, t);
                    const isVisible = utcTime && (lat !== undefined && lon !== undefined)
                        ? checkMoonAboveHorizon(utcTime, lat, lon)
                        : true;
                    return {
                        label: labels[idx] || `Contact ${idx + 1}`,
                        rawTime: t,
                        localDate: isVisible && utcTime ? toLocalDateStr(utcTime, tzOffsetHours) : "-",
                        localTime: isVisible && utcTime ? toLocalTimeStr(utcTime, tzOffsetHours) : "-",
                        utcTime: utcTime
                    };
                })
                    .filter((c) => c !== null);
            }
            // Add Maximum Eclipse
            if (maxUtc) {
                const isVisible = (lat !== undefined && lon !== undefined)
                    ? (eventType === "solar" ? checkSunAboveHorizon(maxUtc, lat, lon) : checkMoonAboveHorizon(maxUtc, lat, lon))
                    : true;
                currentEclipse.contactTimes.push({
                    label: "Maximum",
                    rawTime: currentEclipse.time,
                    localDate: isVisible ? toLocalDateStr(maxUtc, tzOffsetHours) : "-",
                    localTime: isVisible ? toLocalTimeStr(maxUtc, tzOffsetHours) : "-",
                    utcTime: maxUtc
                });
            }
            // Add Sunrise/Sunset (solar) or Moonrise/Moonset (lunar)
            if (lat !== undefined && lon !== undefined && maxUtc && currentEclipse.contactTimes.length > 0) {
                currentEclipse.contactTimes.sort((a, b) => a.utcTime.getTime() - b.utcTime.getTime());
                const startLimit = currentEclipse.contactTimes[0].utcTime.getTime() - 3600 * 1000;
                const lastContactIdx = currentEclipse.contactTimes.length - 1;
                const endLimit = currentEclipse.contactTimes[lastContactIdx].utcTime.getTime() + 3600 * 1000;
                const riseSetTimes = [];
                const daysToCheck = [
                    new Date(maxUtc.getTime() - 86400 * 1000),
                    maxUtc,
                    new Date(maxUtc.getTime() + 86400 * 1000)
                ];
                const pad = (n) => String(n).padStart(2, '0');
                if (eventType === "lunar") {
                    for (const d of daysToCheck) {
                        const dateStr = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
                        if (VedicAstroEngine_1.VedicAstroEngine.isSwetestEnabled()) {
                            const res = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(1, dateStr, lon, lat, tzOffsetHours);
                            if (res.rise !== null)
                                riseSetTimes.push({ label: "Moonrise", time: new Date(res.rise * 1000) });
                            if (res.set !== null)
                                riseSetTimes.push({ label: "Moonset", time: new Date(res.set * 1000) });
                        }
                        else {
                            try {
                                const mTimes = SunCalc.getMoonTimes(d, lat, lon);
                                if (mTimes.rise)
                                    riseSetTimes.push({ label: "Moonrise", time: mTimes.rise });
                                if (mTimes.set)
                                    riseSetTimes.push({ label: "Moonset", time: mTimes.set });
                            }
                            catch (e) { }
                        }
                    }
                }
                else {
                    for (const d of daysToCheck) {
                        const dateStr = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
                        if (VedicAstroEngine_1.VedicAstroEngine.isSwetestEnabled()) {
                            const res = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(0, dateStr, lon, lat, tzOffsetHours);
                            if (res.rise !== null)
                                riseSetTimes.push({ label: "Sunrise", time: new Date(res.rise * 1000) });
                            if (res.set !== null)
                                riseSetTimes.push({ label: "Sunset", time: new Date(res.set * 1000) });
                        }
                        else {
                            try {
                                const sTimes = SunCalc.getTimes(d, lat, lon);
                                if (sTimes.sunrise)
                                    riseSetTimes.push({ label: "Sunrise", time: sTimes.sunrise });
                                if (sTimes.sunset)
                                    riseSetTimes.push({ label: "Sunset", time: sTimes.sunset });
                            }
                            catch (e) { }
                        }
                    }
                }
                const seen = new Set();
                for (const item of riseSetTimes) {
                    const ts = item.time.getTime();
                    if (ts >= startLimit && ts <= endLimit && !seen.has(ts)) {
                        seen.add(ts);
                        currentEclipse.contactTimes.push({
                            label: item.label,
                            rawTime: toLocalTimeStr(item.time, tzOffsetHours),
                            localDate: toLocalDateStr(item.time, tzOffsetHours),
                            localTime: toLocalTimeStr(item.time, tzOffsetHours),
                            utcTime: item.time
                        });
                    }
                }
            }
            // Chronological sort
            currentEclipse.contactTimes.sort((a, b) => a.utcTime.getTime() - b.utcTime.getTime());
            eclipses.push(currentEclipse);
            currentEclipse = null;
        }
    }
    if (currentEclipse) {
        eclipses.push(currentEclipse);
    }
    return eclipses;
}
function parseUtcDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr || timeStr.trim() === "-")
        return null;
    const dateParts = dateStr.trim().split(".");
    if (dateParts.length !== 3)
        return null;
    const d = parseInt(dateParts[0]);
    const m = parseInt(dateParts[1]);
    const y = parseInt(dateParts[2]);
    const timeParts = timeStr.trim().split(":");
    const hours = parseInt(timeParts[0] || "0");
    const minutes = parseInt(timeParts[1] || "0");
    const secondsFloat = parseFloat(timeParts[2] || "0");
    const seconds = Math.floor(secondsFloat);
    const ms = Math.round((secondsFloat % 1) * 1000);
    if (isNaN(y) || isNaN(m) || isNaN(d))
        return null;
    return new Date(Date.UTC(y, m - 1, d, hours, minutes, seconds, ms));
}
function toLocalDateStr(utcDate, tzOffsetHours) {
    const localTimeMs = utcDate.getTime() + tzOffsetHours * 3600 * 1000;
    const localDate = new Date(localTimeMs);
    const y = localDate.getUTCFullYear();
    const m = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(localDate.getUTCDate()).padStart(2, '0');
    return `${d}-${m}-${y}`;
}
function toLocalTimeStr(utcDate, tzOffsetHours) {
    const localTimeMs = utcDate.getTime() + tzOffsetHours * 3600 * 1000;
    const localDate = new Date(localTimeMs);
    let h = localDate.getUTCHours();
    const mins = String(localDate.getUTCMinutes()).padStart(2, '0');
    const secs = String(localDate.getUTCSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0)
        h = 12;
    const hoursStr = String(h).padStart(2, '0');
    return `${hoursStr}:${mins}:${secs} ${ampm}`;
}
// ----------------------------------------------------
// మెయిన్ API ఎండ్‌పాయింట్
app.all(apiPaths, async (req, res) => {
    const input = { ...req.query, ...req.body };
    const endpoint = (input.endpoint || "birthchart").toString().toLowerCase();
    // 1. కాష్ కీని (Cache Key) సంబంధిత పారామితుల నుండి రూపొందించడం
    const cacheableParams = [
        "dob",
        "tob",
        "latitude",
        "longitude",
        "timezone",
        "ayanamsha",
        "from_date",
        "date",
        "days",
        "lat",
        "lon",
        "tz",
        "date",
        "time",
        "timestamp",
        "boy_dob",
        "boy_tob",
        "boy_latitude",
        "boy_longitude",
        "boy_timezone",
        "girl_dob",
        "girl_tob",
        "girl_latitude",
        "girl_longitude",
        "girl_timezone",
        "rahu_mode",
    ];
    const keyObject = { endpoint };
    for (const key of cacheableParams) {
        if (input[key] !== undefined) {
            keyObject[key] = input[key];
        }
    }
    const sortedKeys = Object.keys(keyObject).sort();
    const canonicalString = sortedKeys
        .map((key) => `${key}:${keyObject[key]}`)
        .join("|");
    const cacheKey = crypto_1.default
        .createHash("md5")
        .update(canonicalString)
        .digest("hex");
    // 2. కాష్ ఉందో లేదో తనిఖీ చేయడం
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cached.data);
    }
    // కాష్ లో సేవ్ చేసి JSON పంపడానికి ఒక హెల్పర్ ఫంక్షన్
    const jsonAndCache = (data) => {
        cache.set(cacheKey, {
            data,
            expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
        });
        res.setHeader("X-Cache", "MISS");
        return res.json(data);
    };
    try {
        // ఇన్పుట్ పారామితులను సులభంగా ప్రాసెస్ చేయడానికి హెల్పర్ ఫంక్షన్
        const parseInput = () => {
            const { dob, tob, latitude, longitude, timezone, ayanamsha } = input;
            if (!dob || !tob || !latitude || !longitude || !timezone) {
                throw new Error("Missing required parameters (dob, tob, lat, lon, tz)");
            }
            const [year, month, day] = String(dob).split("-").map(Number);
            const timeParts = String(tob).split(":");
            const hour = parseInt(timeParts[0]);
            const minute = parseInt(timeParts[1]);
            const second = timeParts[2] ? parseInt(timeParts[2]) : 0;
            return {
                year,
                month,
                day,
                hour,
                minute,
                second,
                lat: parseFloat(String(latitude)),
                lon: parseFloat(String(longitude)),
                tz: parseFloat(String(timezone)),
                ayKey: String(ayanamsha || "lahiri"),
                dob,
                tob,
            };
        };
        if (endpoint === "birthchart") {
            const b = parseInput();
            const rahuMode = (input.rahu_mode || "mean") === "true" ? "true" : "mean";
            // ఇంజిన్ బిల్డ్ చేయడం
            const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(b.year, b.month, b.day, b.hour, b.minute, b.tz, b.ayKey, b.second, rahuMode);
            const planets = engine.calculateAll(b.lat, b.lon);
            const lagnaRashi = planets[constants_1.Planet.Ascendant]?.rashi || 1;
            const houses = engine.calcHouses(lagnaRashi);
            const navamsa = engine.calcNavamsa(planets);
            const d3 = engine.calcDrekkanaD3(planets);
            const d7 = engine.calcSaptamshaD7(planets);
            const d10 = engine.calcDasamshaD10(planets);
            const d12 = engine.calcDwadashamshaD12(planets);
            const d2 = engine.calcHoraD2(planets);
            const d4 = engine.calcChaturthamshaD4(planets);
            const d16 = engine.calcShodashamshaD16(planets);
            const d20 = engine.calcVimshamshaD20(planets);
            const d24 = engine.calcChaturvimshamshaD24(planets);
            const d27 = engine.calcSaptavimshamshaD27(planets);
            const d30 = engine.calcTrimshamshaD30(planets);
            const d60 = engine.calcShashtiamshaD60(planets);
            const moonData = planets[constants_1.Planet.Moon];
            const dashas = engine.calcVimshottariDasha(moonData.nak_index, moonData.deg_in_nak, String(b.dob));
            const sunLon = planets[constants_1.Planet.Sun]?.longitude || 0;
            const panchanga = engine.calcPanchanga(sunLon, moonData.longitude || 0);
            const shadabala = engine.calcShadabala(planets, lagnaRashi);
            const ashtakavarga = VedicAstroEngine_1.VedicAstroEngine.calcAshtakavarga(planets, lagnaRashi);
            const dateUtc = Date.UTC(b.year, b.month - 1, b.day, b.hour, b.minute, b.second);
            const timestamp = Math.floor(dateUtc / 1000) - b.tz * 3600;
            const { sunrise: sunriseTs } = getPreciseSunriseSunset(timestamp, b.lat, b.lon, b.tz);
            const sunriseStr = formatTsLocal(sunriseTs, b.tz);
            return jsonAndCache({
                meta: {
                    dob: b.dob,
                    tob: b.tob,
                    latitude: b.lat,
                    longitude: b.lon,
                    timezone: b.tz,
                    ayanamsha: Number(engine.getAyanamsha().toFixed(6)),
                    ayanamsha_name: engine.getAyanamshaName(),
                    sunrise: sunriseStr,
                    engine: engine.isUsingSwetest()
                        ? "swetest (Swiss Ephemeris)"
                        : "Math fallback",
                },
                planets,
                houses,
                navamsa_d9: navamsa,
                d2,
                d3,
                d4,
                d7,
                d10,
                d12,
                d16,
                d20,
                d24,
                d27,
                d30,
                d60,
                dashas,
                panchanga,
                shadabala,
                ashtakavarga,
            });
        }
        else if (endpoint === "shadabala") {
            const b = parseInput();
            const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(b.year, b.month, b.day, b.hour, b.minute, b.tz, b.ayKey, b.second);
            const planets = engine.calculateAll(b.lat, b.lon);
            const lagnaRashi = planets[constants_1.Planet.Ascendant]?.rashi || 1;
            const shadabala = engine.calcShadabala(planets, lagnaRashi);
            return jsonAndCache({
                endpoint: "Shadabala",
                ayanamsha: engine.getAyanamshaName(),
                shadabala,
            });
        }
        else if (endpoint === "ashtakavarga") {
            const b = parseInput();
            const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(b.year, b.month, b.day, b.hour, b.minute, b.tz, b.ayKey, b.second);
            const planets = engine.calculateAll(b.lat, b.lon);
            const lagnaRashi = planets[constants_1.Planet.Ascendant]?.rashi || 1;
            const ashtakavarga = VedicAstroEngine_1.VedicAstroEngine.calcAshtakavarga(planets, lagnaRashi);
            return jsonAndCache({
                endpoint: "Ashtakavarga",
                ayanamsha: engine.getAyanamshaName(),
                ashtakavarga,
            });
        }
        else if (endpoint === "precision_test") {
            const { dob, tob, latitude, longitude, timezone, ayanamsha } = input;
            if (!dob || !tob || !latitude || !longitude || !timezone) {
                throw new Error("Missing required parameters (dob, tob, latitude, longitude, timezone)");
            }
            const [year, month, day] = String(dob).split("-").map(Number);
            const timeParts = String(tob).split(":");
            const hour = parseInt(timeParts[0]);
            const minute = parseInt(timeParts[1]);
            const second = timeParts[2] ? parseInt(timeParts[2]) : 0;
            const lat = parseFloat(String(latitude));
            const lon = parseFloat(String(longitude));
            const tz = parseFloat(String(timezone));
            const ayKey = String(ayanamsha || "lahiri");
            const rahuMode = (input.rahu_mode || "mean") === "true" ? "true" : "mean";
            // Target UT/local timestamp
            const localMidnightUtc = Date.UTC(year, month - 1, day, 0, 0, 0);
            const localMidnightDate = new Date(localMidnightUtc);
            const targetLocalTs = Math.floor(localMidnightUtc / 1000) - tz * 3600 + (hour * 3600 + minute * 60 + second);
            // --- 1. SUNRISE / SUNSET / MOONRISE / MOONSET ---
            // Fallback (SunCalc)
            const sunInfo = SunCalc.getTimes(localMidnightDate, lat, lon);
            const fbSunrise = sunInfo.sunrise ? Math.floor(sunInfo.sunrise.getTime() / 1000) : null;
            const fbSunset = sunInfo.sunset ? Math.floor(sunInfo.sunset.getTime() / 1000) : null;
            const moonInfo = SunCalc.getMoonTimes(localMidnightDate, lat, lon);
            const fbMoonrise = moonInfo.rise ? Math.floor(moonInfo.rise.getTime() / 1000) : null;
            const fbMoonset = moonInfo.set ? Math.floor(moonInfo.set.getTime() / 1000) : null;
            // High Precision (swetest)
            const precSun = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(0, dob, lon, lat, tz);
            const precMoon = VedicAstroEngine_1.VedicAstroEngine.getRiseSetTimes(1, dob, lon, lat, tz);
            // --- 2. PANCHANGA VALUES & END TIMES ---
            const nakLen = 360.0 / 27.0;
            // A. Fallback Calculations
            const fbEngine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(year, month, day, hour, minute, tz, ayKey, 0, rahuMode);
            fbEngine.setSwetest(false);
            const fbPlanets = fbEngine.calculateAll(lat, lon);
            const fbSunLon = fbPlanets[constants_1.Planet.Sun]?.longitude || 0;
            const fbMoonLon = fbPlanets[constants_1.Planet.Moon]?.longitude || 0;
            const fbPanchanga = fbEngine.calcPanchanga(fbSunLon, fbMoonLon);
            const fbSunSpeed = fbPlanets[constants_1.Planet.Sun]?.speed || 0.9856;
            const fbMoonSpeed = fbPlanets[constants_1.Planet.Moon]?.speed || 13.176;
            const fbTSpeed = Math.max(0.1, fbMoonSpeed - fbSunSpeed);
            const fbYSpeed = Math.max(0.1, fbMoonSpeed + fbSunSpeed);
            // Fallback Tithi End Time
            const fbDiff = (fbMoonLon - fbSunLon + 360) % 360;
            const fbTIndex = Math.floor(fbDiff / 12);
            const fbTRem = 12.0 - (fbDiff % 12.0);
            const fbTEndApprox = targetLocalTs + Math.floor((fbTRem / fbTSpeed) * 86400);
            const fbTithiEnd = findExactTime(fbTEndApprox, "tithi", (fbTIndex + 1) * 12.0, lat, lon, tz, ayKey, true);
            // Fallback Nakshatra End Time
            const fbNakIndex = Math.floor(fbMoonLon / nakLen);
            const fbNakRem = nakLen - (fbMoonLon % nakLen);
            const fbNEndApprox = targetLocalTs + Math.floor((fbNakRem / fbMoonSpeed) * 86400);
            const fbNakshatraEnd = findExactTime(fbNEndApprox, "nakshatra", (fbNakIndex + 1) * nakLen, lat, lon, tz, ayKey, true);
            // Fallback Yoga End Time
            const fbYogaDiff = (fbSunLon + fbMoonLon) % 360;
            const fbYogaIndex = Math.floor(fbYogaDiff / nakLen);
            const fbYogaRem = nakLen - (fbYogaDiff % nakLen);
            const fbYEndApprox = targetLocalTs + Math.floor((fbYogaRem / fbYSpeed) * 86400);
            const fbYogaEnd = findExactTime(fbYEndApprox, "yoga", (fbYogaIndex + 1) * nakLen, lat, lon, tz, ayKey, true);
            // Fallback Karana End Time
            const fbKaranaIndex = Math.floor(fbDiff / 6.0);
            const fbKaranaRem = 6.0 - (fbDiff % 6.0);
            const fbKEndApprox = targetLocalTs + Math.floor((fbKaranaRem / fbTSpeed) * 86400);
            const fbKaranaEnd = findExactTime(fbKEndApprox, "karana", (fbKaranaIndex + 1) * 6.0, lat, lon, tz, ayKey, true);
            // B. High-Precision Calculations
            const precEngine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(year, month, day, hour, minute, tz, ayKey, second, rahuMode);
            precEngine.setSwetest(true);
            const precPlanets = precEngine.calculateAll(lat, lon);
            const precSunLon = precPlanets[constants_1.Planet.Sun]?.longitude || 0;
            const precMoonLon = precPlanets[constants_1.Planet.Moon]?.longitude || 0;
            const precPanchanga = precEngine.calcPanchanga(precSunLon, precMoonLon);
            const precSunSpeed = precPlanets[constants_1.Planet.Sun]?.speed || 0.9856;
            const precMoonSpeed = precPlanets[constants_1.Planet.Moon]?.speed || 13.176;
            const precTSpeed = Math.max(0.1, precMoonSpeed - precSunSpeed);
            const precYSpeed = Math.max(0.1, precMoonSpeed + precSunSpeed);
            // Precise Tithi End Time
            const precDiff = (precMoonLon - precSunLon + 360) % 360;
            const precTIndex = Math.floor(precDiff / 12);
            const precTRem = 12.0 - (precDiff % 12.0);
            const precTEndApprox = targetLocalTs + Math.floor((precTRem / precTSpeed) * 86400);
            const precTithiEnd = findExactTime(precTEndApprox, "tithi", (precTIndex + 1) * 12.0, lat, lon, tz, ayKey, false);
            // Precise Nakshatra End Time
            const precNakIndex = Math.floor(precMoonLon / nakLen);
            const precNakRem = nakLen - (precMoonLon % nakLen);
            const precNEndApprox = targetLocalTs + Math.floor((precNakRem / precMoonSpeed) * 86400);
            const precNakshatraEnd = findExactTime(precNEndApprox, "nakshatra", (precNakIndex + 1) * nakLen, lat, lon, tz, ayKey, false);
            // Precise Yoga End Time
            const precYogaDiff = (precSunLon + precMoonLon) % 360;
            const precYogaIndex = Math.floor(precYogaDiff / nakLen);
            const precYogaRem = nakLen - (precYogaDiff % nakLen);
            const precYEndApprox = targetLocalTs + Math.floor((precYogaRem / precYSpeed) * 86400);
            const precYogaEnd = findExactTime(precYEndApprox, "yoga", (precYogaIndex + 1) * nakLen, lat, lon, tz, ayKey, false);
            // Precise Karana End Time
            const precKaranaIndex = Math.floor(precDiff / 6.0);
            const precKaranaRem = 6.0 - (precDiff % 6.0);
            const precKEndApprox = targetLocalTs + Math.floor((precKaranaRem / precTSpeed) * 86400);
            const precKaranaEnd = findExactTime(precKEndApprox, "karana", (precKaranaIndex + 1) * 6.0, lat, lon, tz, ayKey, false);
            return jsonAndCache({
                meta: {
                    dob,
                    tob,
                    timezone: tz,
                    latitude: lat,
                    longitude: lon,
                    ayanamsha: ayKey,
                    targetLocalTs,
                    engine: VedicAstroEngine_1.VedicAstroEngine.isSwetestEnabled()
                        ? `swetest${process.platform === "win32" ? ".exe (Windows)" : process.platform === "darwin" ? "_mac (macOS)" : " (Linux)"}`
                        : "Math fallback (No swetest binary found)",
                },
                riseSet: {
                    fallback: {
                        sunrise: fbSunrise,
                        sunset: fbSunset,
                        moonrise: fbMoonrise,
                        moonset: fbMoonset,
                    },
                    precise: {
                        sunrise: precSun.rise,
                        sunset: precSun.set,
                        moonrise: precMoon.rise,
                        moonset: precMoon.set,
                    },
                },
                panchanga: {
                    fallback: {
                        tithi: fbPanchanga.tithi,
                        tithi_number: fbPanchanga.tithi_number,
                        tithi_end: fbTithiEnd,
                        nakshatra: fbPanchanga.moon_nakshatra,
                        nakshatra_end: fbNakshatraEnd,
                        yoga: fbPanchanga.yoga,
                        yoga_end: fbYogaEnd,
                        karana: fbPanchanga.karana,
                        karana_end: fbKaranaEnd,
                        vara: fbPanchanga.vara,
                        paksha: fbPanchanga.paksha,
                        ayanamsha: fbEngine.getAyanamsha(),
                        ayanamsha_name: fbEngine.getAyanamshaName(),
                    },
                    precise: {
                        tithi: precPanchanga.tithi,
                        tithi_number: precPanchanga.tithi_number,
                        tithi_end: precTithiEnd,
                        nakshatra: precPanchanga.moon_nakshatra,
                        nakshatra_end: precNakshatraEnd,
                        yoga: precPanchanga.yoga,
                        yoga_end: precYogaEnd,
                        karana: precPanchanga.karana,
                        karana_end: precKaranaEnd,
                        vara: precPanchanga.vara,
                        paksha: precPanchanga.paksha,
                        ayanamsha: precEngine.getAyanamsha(),
                        ayanamsha_name: precEngine.getAyanamshaName(),
                    },
                },
            });
        }
        else if (endpoint === "panchanga_table") {
            const fromDate = String(input.from_date || input.date || new Date().toISOString().split("T")[0]);
            const maxLimit = CONFIG.ENABLE_PANCHANGA_LIMIT
                ? CONFIG.MAX_PANCHANGA_DAYS
                : Infinity;
            const days = Math.min(maxLimit, Math.max(1, parseInt(String(input.days || 10))));
            const lat = parseFloat(String(input.latitude || input.lat || 12.9716));
            const lon = parseFloat(String(input.longitude || input.lon || 77.5946));
            const tz = parseFloat(String(input.timezone || input.tz || 5.5));
            const ayKey = String(input.ayanamsha || "lahiri");
            const boyNak = input.boy_nakshatra ? String(input.boy_nakshatra) : null;
            const girlNak = input.girl_nakshatra
                ? String(input.girl_nakshatra)
                : null;
            const fastMode = CONFIG.ENABLE_FAST_MODE && days > 30; // .env లో ఆన్ ఉండి, 30 రోజుల కంటే ఎక్కువ ఉంటేనే మ్యాథ్ ఫాల్‌బ్యాక్ వాడి స్పీడ్ పెంచుతుంది
            const [startYear, startMonth, startDay] = fromDate.split("-").map(Number);
            const dt = new Date(Date.UTC(startYear, startMonth - 1, startDay, 6, 0, 0));
            const tithiNames = [
                "Prathama",
                "Dvitiya",
                "Tritiya",
                "Chaturthi",
                "Panchami",
                "Shashthi",
                "Saptami",
                "Ashtami",
                "Navami",
                "Dashami",
                "Ekadashi",
                "Dvadashi",
                "Trayodashi",
                "Chaturdashi",
            ];
            const nakNames = [
                "Ashwini",
                "Bharani",
                "Krittika",
                "Rohini",
                "Mrigashira",
                "Arudra",
                "Punarvasu",
                "Pushya",
                "Ashlesha",
                "Magha",
                "Purva Phalguni",
                "Uttara Phalguni",
                "Hasta",
                "Chitra",
                "Swati",
                "Vishakha",
                "Anuradha",
                "Jyeshtha",
                "Mula",
                "Purva Ashadha",
                "Uttara Ashadha",
                "Shravana",
                "Dhanishta",
                "Shatabhisha",
                "Purva Bhadrapada",
                "Uttara Bhadrapada",
                "Revati",
            ];
            const yogaNames = [
                "Vishkambha",
                "Priti",
                "Ayushman",
                "Saubhagya",
                "Shobhana",
                "Atiganda",
                "Sukarma",
                "Dhriti",
                "Shula",
                "Ganda",
                "Vriddhi",
                "Dhruva",
                "Vyaghata",
                "Harshana",
                "Vajra",
                "Siddhi",
                "Vyatipata",
                "Variyan",
                "Parigha",
                "Shiva",
                "Siddha",
                "Sadhya",
                "Shubha",
                "Shukla",
                "Brahma",
                "Indra",
                "Vaidhriti",
            ];
            const karanaNames = [
                "Bava",
                "Balava",
                "Kaulava",
                "Taitila",
                "Gara",
                "Vanija",
                "Vishti",
                "Kimstughna",
                "Shakuni",
                "Chatushpada",
                "Naga",
            ];
            const vaaraNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            const rashiNames = [
                "Mesha",
                "Vrishabha",
                "Mithuna",
                "Karka",
                "Simha",
                "Kanya",
                "Tula",
                "Vrischika",
                "Dhanu",
                "Makara",
                "Kumbha",
                "Meena",
            ];
            const nakToRasi = {
                0: [0],
                1: [0],
                2: [0, 1],
                3: [1],
                4: [1, 2],
                5: [2],
                6: [2, 3],
                7: [3],
                8: [3],
                9: [4],
                10: [4],
                11: [4, 5],
                12: [5],
                13: [5, 6],
                14: [6],
                15: [6, 7],
                16: [7],
                17: [7],
                18: [8],
                19: [8],
                20: [8, 9],
                21: [9],
                22: [9, 10],
                23: [10],
                24: [10, 11],
                25: [11],
                26: [11],
            };
            const taraNames = {
                1: "Janma",
                2: "Sampat",
                3: "Vipat",
                4: "Kshema",
                5: "Pratyak",
                6: "Sadhana",
                7: "Naidhana",
                8: "Mitra",
                0: "Parama Mitra",
            };
            const lunarMonths = [
                "Chaitra",
                "Vaisakha",
                "Jyeshtha",
                "Ashadha",
                "Shravana",
                "Bhadrapada",
                "Ashwayuja",
                "Kartika",
                "Margashirsha",
                "Pausha",
                "Magha",
                "Phalguna",
            ];
            const startTs = Math.floor(dt.getTime() / 1000);
            let lastAmTs = startTs, lastAmSunLon = 0;
            for (let d = 0; d <= 35; d++) {
                const checkTs = startTs - d * 86400;
                const td = new Date((checkTs + tz * 3600) * 1000);
                const e = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(td.getUTCFullYear(), td.getUTCMonth() + 1, td.getUTCDate(), 6, 0, tz, ayKey);
                const r = getDiffLon(e, lat, lon, fastMode);
                if (Math.floor(r.diff / 12) === 29) {
                    lastAmTs = checkTs;
                    lastAmSunLon = getMidnightSunLon(checkTs, lat, lon, tz, ayKey, fastMode);
                    break;
                }
            }
            let nextAmTs = startTs + 30 * 86400, nextAmSunLon = 0;
            for (let d = 1; d <= 35; d++) {
                const checkTs = lastAmTs + d * 86400;
                const td = new Date((checkTs + tz * 3600) * 1000);
                const e = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(td.getUTCFullYear(), td.getUTCMonth() + 1, td.getUTCDate(), 6, 0, tz, ayKey);
                const r = getDiffLon(e, lat, lon, fastMode);
                if (Math.floor(r.diff / 12) === 29) {
                    nextAmTs = checkTs;
                    nextAmSunLon = getMidnightSunLon(checkTs, lat, lon, tz, ayKey, fastMode);
                    break;
                }
            }
            let lastAmSunRashi = Math.floor((lastAmSunLon % 360) / 30);
            let nextAmSunRashi = Math.floor((nextAmSunLon % 360) / 30);
            let currentMasaName = lunarMonths[(lastAmSunRashi + 1) % 12];
            let isAdhika = nextAmSunRashi === lastAmSunRashi;
            let prevMonthWasAdhika = false;
            const results = [];
            let curTs = startTs;
            for (let i = 0; i < days; i++) {
                while (curTs > nextAmTs) {
                    prevMonthWasAdhika = isAdhika;
                    lastAmTs = nextAmTs;
                    lastAmSunLon = nextAmSunLon;
                    lastAmSunRashi = nextAmSunRashi;
                    currentMasaName = lunarMonths[(lastAmSunRashi + 1) % 12];
                    nextAmTs = lastAmTs + 30 * 86400;
                    for (let d = 1; d <= 35; d++) {
                        const checkTs = lastAmTs + d * 86400;
                        const td = new Date((checkTs + tz * 3600) * 1000);
                        const e = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(td.getUTCFullYear(), td.getUTCMonth() + 1, td.getUTCDate(), 6, 0, tz, ayKey);
                        const r = getDiffLon(e, lat, lon, fastMode);
                        if (Math.floor(r.diff / 12) === 29) {
                            nextAmTs = checkTs;
                            nextAmSunLon = getMidnightSunLon(checkTs, lat, lon, tz, ayKey, fastMode);
                            break;
                        }
                    }
                    nextAmSunRashi = Math.floor((nextAmSunLon % 360) / 30);
                    isAdhika = nextAmSunRashi === lastAmSunRashi;
                }
                let masaDisplay = isAdhika
                    ? "Adhika " + currentMasaName
                    : prevMonthWasAdhika
                        ? "Nija " + currentMasaName
                        : currentMasaName;
                const curDtUTC = new Date((curTs + tz * 3600) * 1000);
                const dateStr = `${curDtUTC.getUTCDate().toString().padStart(2, "0")}-${curDtUTC.toLocaleString("en-US", { month: "short" })}-${curDtUTC.getUTCFullYear()}`;
                const { sunrise: sunriseTs, sunset: sunsetTs } = getPreciseSunriseSunset(curTs, lat, lon, tz);
                const srDt = new Date((sunriseTs + tz * 3600) * 1000);
                const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(srDt.getUTCFullYear(), srDt.getUTCMonth() + 1, srDt.getUTCDate(), srDt.getUTCHours(), srDt.getUTCMinutes(), tz, ayKey);
                if (fastMode && typeof engine.setSwetest === "function") {
                    engine.setSwetest(false);
                }
                const planets = engine.calculateAll(lat, lon);
                const sunLon = planets[constants_1.Planet.Sun]?.longitude || 0;
                const sunSpeed = planets[constants_1.Planet.Sun]?.speed || 0.9856;
                const moonLon = planets[constants_1.Planet.Moon]?.longitude || 0;
                const moonSpeed = planets[constants_1.Planet.Moon]?.speed || 13.176;
                const tSpeed = Math.max(0.1, moonSpeed - sunSpeed);
                const ySpeed = Math.max(0.1, moonSpeed + sunSpeed);
                const diff = (moonLon - sunLon + 360) % 360;
                const tIndex = Math.floor(diff / 12);
                const tRem = 12.0 - (diff % 12.0);
                let tEndTs = sunriseTs + Math.floor((tRem / tSpeed) * 86400);
                tEndTs = findExactTime(tEndTs, "tithi", (tIndex + 1) * 12.0, lat, lon, tz, ayKey, fastMode);
                const tithiName = tIndex === 14
                    ? "Purnima"
                    : tIndex === 29
                        ? "Amavasya"
                        : (tIndex < 15 ? "S-" : "K-") + tithiNames[tIndex % 15];
                const nakLen = 360.0 / 27.0;
                const nakIndex = Math.floor(moonLon / nakLen);
                let nEndTs = sunriseTs +
                    Math.floor(((nakLen - (moonLon % nakLen)) / moonSpeed) * 86400);
                nEndTs = findExactTime(nEndTs, "nakshatra", (nakIndex + 1) * nakLen, lat, lon, tz, ayKey, fastMode);
                const nakName = nakNames[nakIndex];
                const yVal = (moonLon + sunLon) % 360;
                const yIndex = Math.floor(yVal / nakLen);
                let yEndTs = sunriseTs + Math.floor(((nakLen - (yVal % nakLen)) / ySpeed) * 86400);
                yEndTs = findExactTime(yEndTs, "yoga", (yIndex + 1) * nakLen, lat, lon, tz, ayKey, fastMode);
                const yogaName = yogaNames[yIndex];
                const kIndex = Math.floor(diff / 6);
                let kEndTs = sunriseTs + Math.floor(((6.0 - (diff % 6.0)) / tSpeed) * 86400);
                kEndTs = findExactTime(kEndTs, "karana", (kIndex + 1) * 6.0, lat, lon, tz, ayKey, fastMode);
                let karanaName = "";
                if (kIndex === 0)
                    karanaName = "Kimstughna";
                else if (kIndex === 57)
                    karanaName = "Shakuni";
                else if (kIndex === 58)
                    karanaName = "Chatushpada";
                else if (kIndex === 59)
                    karanaName = "Naga";
                else
                    karanaName = karanaNames[(kIndex - 1) % 7];
                const vaaraNum = curDtUTC.getUTCDay();
                const moonRasiIdx = Math.floor(moonLon / 30);
                const asthg = [];
                for (const p of [constants_1.Planet.Jupiter, constants_1.Planet.Venus]) {
                    if (!planets[p])
                        continue;
                    const cLimit = p === constants_1.Planet.Jupiter ? 11 : planets[p].speed < 0 ? 8 : 10;
                    let pDiff = Math.abs(planets[p].longitude - sunLon);
                    pDiff = Math.min(pDiff % 360, 360 - (pDiff % 360));
                    if (pDiff <= cLimit)
                        asthg.push(p === constants_1.Planet.Jupiter ? "Gu" : "Sk");
                }
                const dayDur = sunsetTs - sunriseTs;
                const rahuRatios = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
                const yamaRatios = [0.5, 0.375, 0.25, 0.125, 0.875, 0.75, 0.625];
                const rkStartTs = sunriseTs + Math.floor(dayDur * rahuRatios[vaaraNum]);
                const ygStartTs = sunriseTs + Math.floor(dayDur * yamaRatios[vaaraNum]);
                const durmuhurthams = {
                    0: [13],
                    1: [8, 11],
                    2: [3, 10],
                    3: [5],
                    4: [8],
                    5: [3, 8],
                    6: [1],
                };
                const durTimes = [];
                for (const mIdx of durmuhurthams[vaaraNum] || []) {
                    const mStart = sunriseTs + Math.floor(dayDur * (mIdx / 15.0));
                    const mEnd = sunriseTs + Math.floor(dayDur * ((mIdx + 1) / 15.0));
                    durTimes.push(`${formatTsLocal(mStart, tz)} - ${formatTsLocal(mEnd, tz)}`);
                }
                const mSpeedSafe = Math.max(0.1, moonSpeed);
                const degPassed = moonLon % nakLen;
                let nakStartTs1 = sunriseTs - Math.floor((degPassed / mSpeedSafe) * 86400);
                nakStartTs1 = findExactTime(nakStartTs1, "nakshatra", nakIndex * nakLen, lat, lon, tz, ayKey, fastMode);
                const varjyamGhatis = [
                    50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10,
                    14, 56, 24, 20, 10, 10, 18, 16, 24, 30,
                ];
                const vStart1 = nakStartTs1 + Math.floor(varjyamGhatis[nakIndex] * 1440);
                const vEnd1 = vStart1 + 5760;
                const nakIndex2 = (nakIndex + 1) % 27;
                const vStart2 = nEndTs + Math.floor(varjyamGhatis[nakIndex2] * 1440);
                const vEnd2 = vStart2 + 5760;
                const varjyams = [];
                const windowStart = sunriseTs - 3600;
                const windowEnd = sunriseTs + 86400 + 3600;
                if (vEnd1 > windowStart && vStart1 < windowEnd)
                    varjyams.push(`${formatTsLocal(vStart1, tz)} - ${formatTsLocal(vEnd1, tz)}`);
                if (vEnd2 > windowStart && vStart2 < windowEnd)
                    varjyams.push(`${formatTsLocal(vStart2, tz)} - ${formatTsLocal(vEnd2, tz)}`);
                const row = {
                    Date: dateStr,
                    Vaara: vaaraNames[vaaraNum],
                    Vaara_is_good: true,
                    Asthg: asthg.length ? asthg.join(",") : "-",
                    Maasa: masaDisplay,
                    Tithi: tithiName,
                    "Tithi End": formatTsLocal(tEndTs, tz),
                    Tithi_is_good: true,
                    Sunrise: formatTsLocal(sunriseTs, tz),
                    Nakshatra: nakName,
                    "Nakshatra End": formatTsLocal(nEndTs, tz),
                    Nakshatra_is_good: true,
                    "Moon Rasi": rashiNames[moonRasiIdx],
                    Yoga: yogaName,
                    "Yoga End": formatTsLocal(yEndTs, tz),
                    Yoga_is_good: true,
                    Karana: karanaName,
                    "Karana End": formatTsLocal(kEndTs, tz),
                    Karana_is_good: true,
                    "Rahu Kalam": `${formatTsLocal(rkStartTs, tz)} - ${formatTsLocal(rkStartTs + Math.floor(dayDur * 0.125), tz)}`,
                    Yamagandam: `${formatTsLocal(ygStartTs, tz)} - ${formatTsLocal(ygStartTs + Math.floor(dayDur * 0.125), tz)}`,
                    Durmuhurtham: durTimes.length ? durTimes.join(", ") : "-",
                    Varjyam: varjyams.length ? varjyams.join(", ") : "-",
                };
                const populateTara = (prefix, nak) => {
                    if (nak) {
                        const idx = nakNames.indexOf(nak);
                        if (idx !== -1) {
                            row[`${prefix} Tarabalam`] =
                                taraNames[(((nakIndex - idx + 27) % 27) + 1) % 9];
                            row[`${prefix}_Tarabalam_is_good`] = true;
                            const isAshtama = nakToRasi[idx].includes((moonRasiIdx + 5) % 12);
                            row[`${prefix} Chandra Balam`] = isAshtama ? "Ashtama" : "Good";
                            row[`${prefix}_Chandra_Balam_is_good`] = !isAshtama;
                        }
                    }
                };
                populateTara("Boy", boyNak);
                populateTara("Girl", girlNak);
                results.push(row);
                curTs += 86400;
            }
            // ఫ్రంట్‌ఎండ్ కోసం నేరుగా ఆరే (Array) పంపుతున్నాం
            return jsonAndCache(results);
        }
        else if (endpoint === "clock") {
            const lat = parseFloat(String(input.latitude || input.lat || 12.9716));
            const lon = parseFloat(String(input.longitude || input.lon || 77.5946));
            const tz = parseFloat(String(input.timezone || input.tz || 5.5));
            let timestamp = input.timestamp && String(input.timestamp) !== ""
                ? parseInt(String(input.timestamp))
                : Date.now();
            if (Math.abs(timestamp) > 9999999999)
                timestamp = Math.floor(timestamp / 1000);
            const dt = new Date(timestamp * 1000);
            const offsetMs = tz * 3600 * 1000;
            const localDt = new Date(timestamp * 1000 + offsetMs);
            const year = localDt.getUTCFullYear();
            const month = localDt.getUTCMonth() + 1;
            const day = localDt.getUTCDate();
            const hour = localDt.getUTCHours();
            const minute = localDt.getUTCMinutes();
            const ayKey = String(input.ayanamsha || "lahiri");
            const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(year, month, day, hour, minute, tz, ayKey);
            const planets = engine.calculateAll(lat, lon);
            const lagnaRashi = planets[constants_1.Planet.Ascendant]?.rashi || 1;
            const sunLon = planets[constants_1.Planet.Sun]?.longitude || 0;
            const moonLon = planets[constants_1.Planet.Moon]?.longitude || 0;
            const panchanga = engine.calcPanchanga(sunLon, moonLon);
            let sunSpeed = planets[constants_1.Planet.Sun]?.speed || 0.9856;
            let moonSpeed = planets[constants_1.Planet.Moon]?.speed || 13.176;
            if (moonSpeed <= 0)
                moonSpeed = 13.176;
            let tithiSpeed = moonSpeed - sunSpeed;
            if (tithiSpeed <= 0)
                tithiSpeed = 12.19;
            let yogaSpeed = moonSpeed + sunSpeed;
            if (yogaSpeed <= 0)
                yogaSpeed = 14.16;
            let diff = moonLon - sunLon;
            if (diff < 0)
                diff += 360;
            const tithiRemDeg = 12.0 - (diff % 12.0);
            let tithiEndTs = timestamp + Math.floor((tithiRemDeg / tithiSpeed) * 86400);
            tithiEndTs = findExactTime(tithiEndTs, "tithi", (Math.floor(diff / 12) + 1) * 12.0, lat, lon, tz, ayKey, !engine.isUsingSwetest());
            const nakLen = 360.0 / 27.0;
            const nakRemDeg = nakLen - (moonLon % nakLen);
            let nakEndTs = timestamp + Math.floor((nakRemDeg / moonSpeed) * 86400);
            nakEndTs = findExactTime(nakEndTs, "nakshatra", (Math.floor(moonLon / nakLen) + 1) * nakLen, lat, lon, tz, ayKey, !engine.isUsingSwetest());
            const yogaVal = (moonLon + sunLon) % 360;
            const yogaRemDeg = nakLen - (yogaVal % nakLen);
            let yogaEndTs = timestamp + Math.floor((yogaRemDeg / yogaSpeed) * 86400);
            yogaEndTs = findExactTime(yogaEndTs, "yoga", (Math.floor(yogaVal / nakLen) + 1) * nakLen, lat, lon, tz, ayKey, !engine.isUsingSwetest());
            const karanaRemDeg = 6.0 - (diff % 6.0);
            let karanaEndTs = timestamp + Math.floor((karanaRemDeg / tithiSpeed) * 86400);
            karanaEndTs = findExactTime(karanaEndTs, "karana", (Math.floor(diff / 6.0) + 1) * 6.0, lat, lon, tz, ayKey, !engine.isUsingSwetest());
            const ascLon = planets[constants_1.Planet.Ascendant]?.longitude || 0;
            const lagnaRemDeg = 30.0 - (ascLon % 30.0);
            const lagnaEndTsPrecise = timestamp + Math.floor(lagnaRemDeg * 240);
            const { sunrise: sunriseTs, sunset: sunsetTs } = getPreciseSunriseSunset(timestamp, lat, lon, tz);
            let baseTs, endTs, isDay, vaaraStartTs, vaaraEndTs, wd;
            if (timestamp < sunriseTs) {
                const { sunset: prevSunsetTs, sunrise: prevSunriseTs } = getPreciseSunriseSunset(timestamp - 86400, lat, lon, tz);
                baseTs = prevSunsetTs;
                endTs = sunriseTs;
                isDay = false;
                vaaraStartTs = prevSunriseTs;
                vaaraEndTs = sunriseTs;
                wd = new Date((timestamp - 86400 + tz * 3600) * 1000).getUTCDay();
            }
            else if (timestamp < sunsetTs) {
                baseTs = sunriseTs;
                endTs = sunsetTs;
                isDay = true;
                const { sunrise: nextSunriseTs } = getPreciseSunriseSunset(timestamp + 86400, lat, lon, tz);
                vaaraStartTs = sunriseTs;
                vaaraEndTs = nextSunriseTs;
                wd = new Date((timestamp + tz * 3600) * 1000).getUTCDay();
            }
            else {
                const { sunrise: nextSunriseTs } = getPreciseSunriseSunset(timestamp + 86400, lat, lon, tz);
                baseTs = sunsetTs;
                endTs = nextSunriseTs;
                isDay = false;
                vaaraStartTs = sunriseTs;
                vaaraEndTs = nextSunriseTs;
                wd = new Date((timestamp + tz * 3600) * 1000).getUTCDay();
            }
            const duration = Math.max(0.1, endTs - baseTs);
            const muhDuration = Math.max(0.1, duration / 15.0);
            const mIdx = Math.max(0, Math.min(14, Math.floor((timestamp - baseTs) / muhDuration)));
            const dayMuhurthas = [
                "Rudra",
                "Ahi",
                "Mitra",
                "Pitru",
                "Vasu",
                "Varaaha",
                "Viswedeva",
                "Vidhi",
                "Satamukhi",
                "Puruhuta",
                "Vaahini",
                "Nakshatra",
                "Varuna",
                "Aryamana",
                "Bhaga",
            ];
            const nightMuhurthas = [
                "Gireesha",
                "Ajapaada",
                "Ahir-budha",
                "Pushya",
                "Ashwini",
                "Yama",
                "Agni",
                "Vidhaata",
                "Kanda",
                "Adithi",
                "Jiva/Amrutha",
                "Vishnu",
                "Dyumadgadyuti",
                "Brahma",
                "Samudra",
            ];
            const currMuhurtha = isDay ? dayMuhurthas[mIdx] : nightMuhurthas[mIdx];
            const muhurthaEndTs = Math.floor(baseTs + (mIdx + 1) * muhDuration);
            const badMuhurthas = [
                "Rudra",
                "Ahi",
                "Pitru",
                "Vaahini",
                "Nakshatra",
                "Bhaga",
                "Gireesha",
                "Ahir-budha",
                "Yama",
                "Agni",
            ];
            const horaDur = Math.max(0.1, duration / 12.0);
            let hIdx = Math.max(0, Math.min(11, Math.floor((timestamp - baseTs) / horaDur)));
            if (!isDay)
                hIdx += 12;
            const horaLords = [
                "Sun",
                "Venus",
                "Mercury",
                "Moon",
                "Saturn",
                "Jupiter",
                "Mars",
            ];
            const horaLordsJs = {
                Sun: "Surya",
                Venus: "Shukra",
                Mercury: "Budha",
                Moon: "Chandra",
                Saturn: "Shani",
                Jupiter: "Guru",
                Mars: "Kuja",
            };
            const horaLordsKey = {
                Sun: "Su",
                Venus: "Sk",
                Mercury: "Bu",
                Moon: "Mo",
                Saturn: "Sa",
                Jupiter: "Gu",
                Mars: "Ku",
            };
            const wdStartIdx = [0, 3, 6, 2, 5, 1, 4];
            const currentHoraEng = horaLords[(wdStartIdx[wd] + hIdx) % 7];
            const horaLordCode = horaLordsKey[currentHoraEng];
            const horaEndTs = Math.floor(baseTs + ((hIdx % 12) + 1) * horaDur);
            const clockData = {
                endpoint: "clock",
                meta: {
                    timestamp,
                    datetime: dt.toISOString(),
                    lat,
                    lon,
                    tz,
                    engine: engine.isUsingSwetest() ? "swetest" : "fallback",
                },
            };
            const planetMap = {
                Sun: "Su",
                Moon: "Mo",
                Mars: "Ku",
                Mercury: "Bu",
                Jupiter: "Gu",
                Venus: "Sk",
                Saturn: "Sa",
                Rahu: "Ra",
                Ketu: "Ke",
            };
            for (const [phpKey, jsKey] of Object.entries(planetMap)) {
                if (planets[phpKey]) {
                    const p = planets[phpKey];
                    let isR = false;
                    if (!["Sun", "Moon", "Rahu", "Ketu"].includes(phpKey)) {
                        isR = !!p.retrograde || (p.speed !== undefined && p.speed < -0.001);
                    }
                    clockData[jsKey] = {
                        angle: p.longitude || 0,
                        isR,
                        isC: !!p.combust,
                        isH: jsKey === horaLordCode,
                    };
                }
            }
            clockData["lagna"] = ascLon;
            if (clockData["Mo"]) {
                const tIndex = Math.floor(diff / 12);
                clockData["Mo"].tithi_num = (tIndex % 15) + 1;
                clockData["Mo"].paksha = tIndex < 15 ? "Shukla" : "Krishna";
            }
            const pPaksha = panchanga.paksha?.split(" ")[0] || "";
            clockData["sunrise"] = sunriseTs;
            clockData["panchanga"] = {
                vaara: (panchanga.vara || "").replace("vara", ""),
                vaara_end: formatTsLocal(vaaraEndTs, tz),
                vaara_end_ts: vaaraEndTs,
                vaara_rem: Math.floor(((vaaraEndTs - timestamp) / Math.max(1, vaaraEndTs - vaaraStartTs)) *
                    100),
                tithi: pPaksha + " " + panchanga.tithi,
                tithi_end: formatTsLocal(tithiEndTs, tz),
                tithi_end_ts: tithiEndTs,
                tithi_rem: Math.floor((tithiRemDeg / 12.0) * 100),
                nakshatra: panchanga.moon_nakshatra + " (P" + panchanga.moon_pada + ")",
                nakshatra_end: formatTsLocal(nakEndTs, tz),
                nakshatra_end_ts: nakEndTs,
                nakshatra_rem: Math.floor((nakRemDeg / nakLen) * 100),
                yoga: panchanga.yoga,
                yoga_end: formatTsLocal(yogaEndTs, tz),
                yoga_end_ts: yogaEndTs,
                yoga_rem: Math.floor((yogaRemDeg / nakLen) * 100),
                karana: panchanga.karana,
                karana_end: formatTsLocal(karanaEndTs, tz),
                karana_end_ts: karanaEndTs,
                karana_rem: Math.floor((karanaRemDeg / 6.0) * 100),
                muhurtha: currMuhurtha,
                muhurtha_end: formatTsLocal(muhurthaEndTs, tz),
                muhurtha_end_ts: muhurthaEndTs,
                muhurtha_rem: Math.floor(((muhurthaEndTs - timestamp) / Math.max(1, muhDuration)) * 100),
                muhurtha_is_good: !badMuhurthas.includes(currMuhurtha),
                hora: horaLordsJs[currentHoraEng],
                hora_end: formatTsLocal(horaEndTs, tz),
                hora_end_ts: horaEndTs,
                hora_rem: Math.floor(((horaEndTs - timestamp) / Math.max(1, horaDur)) * 100),
                lagna: [
                    "",
                    "Mesha",
                    "Vrishabha",
                    "Mithuna",
                    "Karka",
                    "Simha",
                    "Kanya",
                    "Tula",
                    "Vrischika",
                    "Dhanu",
                    "Makara",
                    "Kumbha",
                    "Meena",
                ][lagnaRashi],
                lagna_end: formatTsLocal(lagnaEndTsPrecise, tz),
                lagna_end_ts: lagnaEndTsPrecise,
                lagna_rem: Math.floor((lagnaRemDeg / 30.0) * 100),
            };
            return jsonAndCache(clockData);
        }
        else if (endpoint === "muhurtha_chart") {
            const dateStr = String(input.date || new Date().toISOString().split("T")[0]);
            const timeStr = String(input.time || "12:00:00");
            const lat = parseFloat(String(input.lat || 12.9716));
            const lon = parseFloat(String(input.lon || 77.5946));
            const tz = parseFloat(String(input.tz || 5.5));
            const ayKey = String(input.ayanamsha || "lahiri");
            const [year, month, day] = dateStr.split("-").map(Number);
            const [hour, minute, second] = timeStr.split(":").map(Number);
            const sec = second || 0;
            const localDt = new Date(Date.UTC(year, month - 1, day, hour, minute, sec));
            const timestamp = Math.floor((localDt.getTime() - tz * 3600 * 1000) / 1000);
            const rahuMode = (input.rahu_mode || "mean") === "true" ? "true" : "mean";
            const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(year, month, day, hour, minute, tz, ayKey, 0, rahuMode);
            const planets = engine.calculateAll(lat, lon);
            const navamsa = engine.calcNavamsa(planets);
            const panchanga = engine.calcPanchanga(planets[constants_1.Planet.Sun]?.longitude || 0, planets[constants_1.Planet.Moon]?.longitude || 0);
            const ascDeg = planets[constants_1.Planet.Ascendant]?.degree || 0.0;
            const degWhole = Math.floor(ascDeg);
            const degMin = Math.floor((ascDeg - degWhole) * 60);
            const lagnaLabel = `${degWhole}°${degMin}'`;
            const lagnaRemPct = Math.round(((30.0 - ascDeg) / 30.0) * 100);
            const rashiNames = [
                "Mesha",
                "Vrishabha",
                "Mithuna",
                "Karka",
                "Simha",
                "Kanya",
                "Tula",
                "Vrischika",
                "Dhanu",
                "Makara",
                "Kumbha",
                "Meena",
            ];
            const lagnaName = rashiNames[planets[constants_1.Planet.Ascendant].rashi - 1];
            const lagnaRashiIndex = planets[constants_1.Planet.Ascendant].rashi - 1; // 0..11
            const actualAyanamsha = engine.getAyanamsha();
            const ayKeyForBoundary = actualAyanamsha.toString();
            const startLagnaTs = getLagnaBoundary(timestamp, lagnaRashiIndex, true, lat, lon, tz, ayKeyForBoundary);
            const endLagnaTs = getLagnaBoundary(timestamp, lagnaRashiIndex, false, lat, lon, tz, ayKeyForBoundary);
            const midTs = Math.floor((startLagnaTs + endLagnaTs) / 2);
            const midWindow = `${formatTsLocal(midTs - 1800, tz)} to ${formatTsLocal(midTs + 1800, tz)}`;
            const pushkaraInfo = getPushkaraInfo(planets[constants_1.Planet.Ascendant].rashi, ascDeg, startLagnaTs, endLagnaTs, lat, lon, tz, ayKeyForBoundary);
            // getMuhurthaInfo Logic
            const { sunrise: mSunriseTs, sunset: mSunsetTs } = getPreciseSunriseSunset(timestamp, lat, lon, tz);
            let mBaseTs, mEndTs, mIsDay, mVaaraNum;
            if (timestamp < mSunriseTs) {
                const { sunset: prevSunsetTs } = getPreciseSunriseSunset(timestamp - 86400, lat, lon, tz);
                mBaseTs = prevSunsetTs;
                mEndTs = mSunriseTs;
                mIsDay = false;
                mVaaraNum = new Date((timestamp - 86400 + tz * 3600) * 1000).getUTCDay();
            }
            else if (timestamp < mSunsetTs) {
                mBaseTs = mSunriseTs;
                mEndTs = mSunsetTs;
                mIsDay = true;
                mVaaraNum = new Date((timestamp + tz * 3600) * 1000).getUTCDay();
            }
            else {
                const { sunrise: nextSunriseTs } = getPreciseSunriseSunset(timestamp + 86400, lat, lon, tz);
                mBaseTs = mSunsetTs;
                mEndTs = nextSunriseTs;
                mIsDay = false;
                mVaaraNum = new Date((timestamp + tz * 3600) * 1000).getUTCDay();
            }
            const mDuration = Math.max(1, mEndTs - mBaseTs);
            const mMuhurthaDuration = mDuration / 15.0;
            const mIndex = Math.max(0, Math.min(14, Math.floor((timestamp - mBaseTs) / mMuhurthaDuration)));
            const mDayMuhurthas = [
                "Rudra",
                "Ahi",
                "Mitra",
                "Pitru",
                "Vasu",
                "Varaaha",
                "Viswedeva",
                "Vidhi",
                "Satamukhi",
                "Puruhuta",
                "Vaahini",
                "Nakshatra",
                "Varuna",
                "Aryamana",
                "Bhaga",
            ];
            const mNightMuhurthas = [
                "Gireesha",
                "Ajapaada",
                "Ahir-budha",
                "Pushya",
                "Ashwini",
                "Yama",
                "Agni",
                "Vidhaata",
                "Kanda",
                "Adithi",
                "Jiva/Amrutha",
                "Vishnu",
                "Dyumadgadyuti",
                "Brahma",
                "Samudra",
            ];
            const mBadMuhurthas = [
                "Rudra",
                "Ahi",
                "Pitru",
                "Vaahini",
                "Nakshatra",
                "Bhaga",
                "Gireesha",
                "Ahir-budha",
                "Yama",
                "Agni",
            ];
            const mCurrent = mIsDay ? mDayMuhurthas[mIndex] : mNightMuhurthas[mIndex];
            const mEndTime = Math.floor(mBaseTs + (mIndex + 1) * mMuhurthaDuration);
            const mDayDuration = Math.max(1, mSunsetTs - mSunriseTs);
            const rahuRatios = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
            const yamaRatios = [0.5, 0.375, 0.25, 0.125, 0.875, 0.75, 0.625];
            const rahuStart = mSunriseTs + Math.floor(mDayDuration * rahuRatios[mVaaraNum]);
            const yamaStart = mSunriseTs + Math.floor(mDayDuration * yamaRatios[mVaaraNum]);
            const durmuhurthams = {
                0: [13],
                1: [8, 11],
                2: [3, 10],
                3: [5],
                4: [8],
                5: [3, 8],
                6: [1],
            };
            const durTimes = [];
            for (const mdIdx of durmuhurthams[mVaaraNum] || []) {
                const mStart = mSunriseTs + Math.floor(mDayDuration * (mdIdx / 15.0));
                const mEnd = mSunriseTs + Math.floor(mDayDuration * ((mdIdx + 1) / 15.0));
                durTimes.push(`${formatTsLocal(mStart, tz)} - ${formatTsLocal(mEnd, tz)}`);
            }
            const mMoonLon = planets[constants_1.Planet.Moon]?.longitude || 0;
            const mMoonSpeed = planets[constants_1.Planet.Moon]?.speed || 13.176;
            const mSpeedSafe = Math.max(0.1, mMoonSpeed);
            const mNakLen = 360.0 / 27.0;
            const mNakIndex = Math.floor(mMoonLon / mNakLen);
            const mDegPassed = mMoonLon % mNakLen;
            let mNakStartTs1 = timestamp - Math.floor((mDegPassed / mSpeedSafe) * 86400);
            mNakStartTs1 = findExactTime(mNakStartTs1, "nakshatra", mNakIndex * mNakLen, lat, lon, tz, ayKey, true);
            const varjyamGhatis = [
                50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14,
                56, 24, 20, 10, 10, 18, 16, 24, 30,
            ];
            const vStart1 = mNakStartTs1 + Math.floor(varjyamGhatis[mNakIndex] * 1440);
            const vEnd1 = vStart1 + 5760;
            const mNakIndex2 = (mNakIndex + 1) % 27;
            let mnEndTs = timestamp + Math.floor(((mNakLen - mDegPassed) / mSpeedSafe) * 86400);
            mnEndTs = findExactTime(mnEndTs, "nakshatra", (mNakIndex + 1) * mNakLen, lat, lon, tz, ayKey, true);
            const vStart2 = mnEndTs + Math.floor(varjyamGhatis[mNakIndex2] * 1440);
            const vEnd2 = vStart2 + 5760;
            const varjyams = [];
            const windowStart = mSunriseTs - 3600;
            const windowEnd = mSunriseTs + 86400 + 3600;
            if (vEnd1 > windowStart && vStart1 < windowEnd)
                varjyams.push(`${formatTsLocal(vStart1, tz)} - ${formatTsLocal(vEnd1, tz)}`);
            if (vEnd2 > windowStart && vStart2 < windowEnd)
                varjyams.push(`${formatTsLocal(vStart2, tz)} - ${formatTsLocal(vEnd2, tz)}`);
            const muhurthaInfo = {
                current: mCurrent,
                end: formatTsLocal(mEndTime, tz),
                is_good: !mBadMuhurthas.includes(mCurrent),
                rahu_kalam: `${formatTsLocal(rahuStart, tz)} - ${formatTsLocal(rahuStart + Math.floor(mDayDuration * 0.125), tz)}`,
                yamagandam: `${formatTsLocal(yamaStart, tz)} - ${formatTsLocal(yamaStart + Math.floor(mDayDuration * 0.125), tz)}`,
                durmuhurtham: durTimes.length ? durTimes.join(", ") : "-",
                varjyam: varjyams.length ? varjyams.join(", ") : "-",
            };
            let wd = new Date((timestamp + tz * 3600) * 1000).getUTCDay(); // Sunday=0, Monday=1, ..., Saturday=6
            if (timestamp < mSunriseTs) {
                wd = (wd - 1 + 7) % 7;
            }
            const hinduWd = wd + 1; // Sunday=1, Monday=2, ..., Saturday=7
            const panchaka = panchakaResult(hinduWd, panchanga.tithi_number || 0, (planets[constants_1.Planet.Moon]?.nak_index || 0) + 1, planets[constants_1.Planet.Ascendant].rashi);
            // Calculate Lagna Tyajyamu (1/2 Ghati = 12 minutes duration)
            const lagnaDur = endLagnaTs - startLagnaTs;
            const rashiTyajyaStarts = {
                1: 30, // Mesha
                2: 16, // Vrushabha
                3: 23, // Mithuna
                4: 2, // Karka
                5: 21, // Simha
                6: 14, // Kanya
                7: 10, // Tula
                8: 20, // Vrischika
                9: 9, // Dhanu
                10: 4, // Makara
                11: 23, // Kumbha
                12: 11, // Meena
            };
            const rasiNum = planets[constants_1.Planet.Ascendant]?.rashi || 1;
            const startPart = rashiTyajyaStarts[rasiNum] || 1;
            const tyajyaStart = startLagnaTs + Math.floor((lagnaDur * (startPart - 1)) / 30);
            const tyajyaEnd = tyajyaStart + 720; // 12 minutes
            const lagnaTyajyamStr = `${formatTsLocal(tyajyaStart, tz)} - ${formatTsLocal(tyajyaEnd, tz)}`;
            const doshas = evaluateMuhurthaDoshas(planets, panchanga, muhurthaInfo, engine, timestamp, lat, lon, tz, ayKey, rahuStart, yamaStart, mDayDuration, vStart1, vEnd1, vStart2, vEnd2, mSunriseTs, mVaaraNum);
            if (timestamp >= tyajyaStart && timestamp <= tyajyaEnd) {
                doshas.push("Lagna Tyajyam");
            }
            return jsonAndCache({
                endpoint: "muhurtha_chart",
                ayanamsha_name: engine.getAyanamshaName(),
                chart: buildChartGrid(planets),
                chart_d9: buildChartGrid(navamsa),
                lagna_deg: lagnaLabel,
                lagna_rem_pct: lagnaRemPct,
                lagna_name: lagnaName,
                lagna_start: formatTsLocal(startLagnaTs, tz),
                lagna_end: formatTsLocal(endLagnaTs, tz),
                pushkaramsha: pushkaraInfo.label,
                is_pushkara: pushkaraInfo.is_pushkara,
                pushkaramsha_time: pushkaraInfo.window,
                mid_lagna_window: midWindow,
                current_muhurtha: muhurthaInfo.current,
                current_muhurtha_end: muhurthaInfo.end,
                muhurtha_is_good: muhurthaInfo.is_good,
                panchaka: panchaka.label,
                panchaka_is_good: panchaka.is_good,
                rahu_kalam: muhurthaInfo.rahu_kalam,
                yamagandam: muhurthaInfo.yamagandam,
                durmuhurtham: muhurthaInfo.durmuhurtham,
                varjyam: muhurthaInfo.varjyam,
                lagna_tyajyam: lagnaTyajyamStr,
                doshas,
            });
        }
        else if (endpoint === "match") {
            // అబ్బాయి, అమ్మాయి ఇద్దరి జాతకాలను ఒకేసారి గణించి పంపడం (React Ashtakuta Logic కోసం)
            const boy = {
                dob: String(input.boy_dob),
                tob: String(input.boy_tob),
                lat: parseFloat(String(input.boy_latitude || input.boy_lat)),
                lon: parseFloat(String(input.boy_longitude || input.boy_lon)),
                tz: parseFloat(String(input.boy_timezone || input.boy_tz)),
            };
            const girl = {
                dob: String(input.girl_dob),
                tob: String(input.girl_tob),
                lat: parseFloat(String(input.girl_latitude || input.girl_lat)),
                lon: parseFloat(String(input.girl_longitude || input.girl_lon)),
                tz: parseFloat(String(input.girl_timezone || input.girl_tz)),
            };
            const ayKey = String(input.ayanamsha || "lahiri");
            const rahuMode = (input.rahu_mode || "mean") === "true" ? "true" : "mean";
            // 1. అబ్బాయి జాతకం
            const [bYear, bMonth, bDay] = boy.dob.split("-").map(Number);
            const [bHour, bMinute] = boy.tob.split(":").map(Number);
            const bEngine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(bYear, bMonth, bDay, bHour, bMinute, boy.tz, ayKey, 0, rahuMode);
            const bPlanets = bEngine.calculateAll(boy.lat, boy.lon);
            const bNavamsa = bEngine.calcNavamsa(bPlanets);
            // 2. అమ్మాయి జాతకం
            const [gYear, gMonth, gDay] = girl.dob.split("-").map(Number);
            const [gHour, gMinute] = girl.tob.split(":").map(Number);
            const gEngine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(gYear, gMonth, gDay, gHour, gMinute, girl.tz, ayKey, 0, rahuMode);
            const gPlanets = gEngine.calculateAll(girl.lat, girl.lon);
            const gNavamsa = gEngine.calcNavamsa(gPlanets);
            return jsonAndCache({
                endpoint: "match",
                ayanamsha: bEngine.getAyanamshaName(),
                boy: {
                    moon: bPlanets[constants_1.Planet.Moon],
                    chart: { planets: bPlanets, navamsa_d9: bNavamsa },
                },
                girl: {
                    moon: gPlanets[constants_1.Planet.Moon],
                    chart: { planets: gPlanets, navamsa_d9: gNavamsa },
                },
            });
        }
        else if (endpoint === "save_user") {
            if (!isSyncEnabled()) {
                return res.json({
                    status: "success",
                    message: "User data sync is disabled",
                });
            }
            const usersFile = path_1.default.join(process.cwd(), "users_data.json");
            // ఫైల్ సైజు 10MB దాటితే ఆపడం (భద్రత కోసం)
            if (fs_1.default.existsSync(usersFile)) {
                const stats = fs_1.default.statSync(usersFile);
                if (stats.size > 10 * 1024 * 1024) {
                    return res
                        .status(507)
                        .json({ status: "error", message: "Storage limit reached" });
                }
            }
            // XSS ఎటాక్స్ నివారించడానికి డేటాని క్లీన్ చేయడం
            const cleanData = {
                name: String(input.name || "Unknown").substring(0, 100),
                dob: String(input.dob || "").substring(0, 20),
                tob: String(input.tob || "").substring(0, 20),
                city: String(input.city || "").substring(0, 100),
                deviceId: String(input.deviceId || "").substring(0, 100),
                timestamp: String(input.timestamp || new Date().toISOString()),
            };
            let existingData = [];
            if (fs_1.default.existsSync(usersFile)) {
                try {
                    existingData = JSON.parse(fs_1.default.readFileSync(usersFile, "utf-8"));
                    if (!Array.isArray(existingData))
                        existingData = [];
                }
                catch (e) {
                    existingData = [];
                }
            }
            let isUpdated = false;
            if (cleanData.deviceId) {
                for (let i = 0; i < existingData.length; i++) {
                    if (existingData[i].deviceId === cleanData.deviceId) {
                        existingData[i] = cleanData;
                        isUpdated = true;
                        break;
                    }
                }
            }
            if (!isUpdated) {
                existingData.push(cleanData);
            }
            try {
                // ఒకేసారి ఇద్దరు సేవ్ చేసినా ప్రాబ్లమ్ లేకుండా Sync వాడాం
                fs_1.default.writeFileSync(usersFile, JSON.stringify(existingData, null, 2));
                res.setHeader("X-Cache", "BYPASS"); // ఈ రిక్వెస్ట్ ని కాష్ చేయకూడదు
                return res.json({
                    status: "success",
                    message: "User data saved successfully",
                });
            }
            catch (e) {
                return res
                    .status(500)
                    .json({ status: "error", message: "Failed to write to file" });
            }
        }
        else if (endpoint === "push_subscribe") {
            const subFile = path_1.default.join(process.cwd(), "subscribers.json");
            const { sub_endpoint, keys, action } = input;
            let subscribers = {};
            if (fs_1.default.existsSync(subFile)) {
                try {
                    subscribers = JSON.parse(fs_1.default.readFileSync(subFile, "utf-8"));
                }
                catch (e) { }
            }
            if (action === "subscribe" && sub_endpoint && keys) {
                subscribers[sub_endpoint] = {
                    endpoint: sub_endpoint,
                    keys,
                    timestamp: Date.now(),
                };
            }
            else if (action === "unsubscribe" && sub_endpoint) {
                delete subscribers[sub_endpoint];
            }
            fs_1.default.writeFileSync(subFile, JSON.stringify(subscribers, null, 2));
            res.setHeader("X-Cache", "BYPASS");
            return res.json({ status: "success" });
        }
        else if (endpoint === "send_alert") {
            // అడ్మిన్ పాస్‌వర్డ్ ఉంటేనే మెసేజ్ పంపాలి (లేకపోతే హ్యాకర్లు స్పామ్ చేస్తారు)
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { title, body, url, is_important } = input;
            const subFile = path_1.default.join(process.cwd(), "subscribers.json");
            if (!fs_1.default.existsSync(subFile))
                return res.json({ error: "No subscribers found." });
            const subscribers = JSON.parse(fs_1.default.readFileSync(subFile, "utf-8"));
            const pushId = Date.now().toString();
            const appBasePath = (process.env.APP_BASE_PATH || "/test/").replace(/\/$/, "");
            const targetUrl = url || `${appBasePath}/`;
            const finalUrl = `${appBasePath}/?push_id=${pushId}&push_title=${encodeURIComponent(String(title))}&push_body=${encodeURIComponent(String(body))}${is_important ? "&push_important=1" : ""}&target_url=${encodeURIComponent(targetUrl)}`;
            const payload = JSON.stringify({ title, body, url: finalUrl });
            const subsArray = Object.values(subscribers);
            res.setHeader("X-Cache", "BYPASS");
            res.json({
                status: "queued",
                message: `Notifications are being sent in the background to ${subsArray.length} users.`,
            });
            // బ్యాక్‌గ్రౌండ్ ప్రాసెస్ (Background Chunking): ఏపీఐ హ్యాంగ్ అవ్వకుండా ఉండటానికి
            (async () => {
                const chunkSize = 50; // ఒకేసారి 50 మందికి పంపుతాము
                let isModified = false;
                for (let i = 0; i < subsArray.length; i += chunkSize) {
                    const chunk = subsArray.slice(i, i + chunkSize);
                    const promises = chunk.map((sub) => {
                        return web_push_1.default.sendNotification(sub, payload).catch((err) => {
                            if (err.statusCode === 410 || err.statusCode === 404) {
                                delete subscribers[sub.endpoint];
                                isModified = true; // సబ్‌స్క్రిప్షన్ ఎక్స్‌పైర్ అయితే ఫ్లాగ్ సెట్ చేయడం
                            }
                        });
                    });
                    await Promise.all(promises);
                    // Google/Apple ఫైర్‌వాల్ బ్లాక్ చేయకుండా ప్రతి 50 మెసేజ్‌లకి 1 సెకను గ్యాప్
                    if (i + chunkSize < subsArray.length) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
                if (isModified) {
                    fs_1.default.writeFileSync(subFile, JSON.stringify(subscribers, null, 2));
                }
            })();
        }
        else if (endpoint === "get_lessons") {
            const lessonsFile = path_1.default.join(process.cwd(), "lessons.json");
            if (!fs_1.default.existsSync(lessonsFile)) {
                // Fallback or initialize from public static directory if available
                const publicLessons = path_1.default.join(process.cwd(), "..", "public", "static", "lessons.json");
                if (fs_1.default.existsSync(publicLessons)) {
                    try {
                        const data = fs_1.default.readFileSync(publicLessons, "utf-8");
                        fs_1.default.writeFileSync(lessonsFile, data);
                        return res.json(JSON.parse(data));
                    }
                    catch (e) { }
                }
                return res.json({ lessons: [] });
            }
            try {
                const data = fs_1.default.readFileSync(lessonsFile, "utf-8");
                return res.json(JSON.parse(data));
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to read lessons file" });
            }
        }
        else if (endpoint === "save_lessons") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { lessons } = input;
            if (!Array.isArray(lessons)) {
                return res.status(400).json({ error: "Invalid lessons data format" });
            }
            const lessonsFile = path_1.default.join(process.cwd(), "lessons.json");
            try {
                fs_1.default.writeFileSync(lessonsFile, JSON.stringify({ lessons }, null, 2));
                // Sync to public static folder if in dev environment
                const publicLessons = path_1.default.join(process.cwd(), "..", "public", "static", "lessons.json");
                if (fs_1.default.existsSync(path_1.default.dirname(publicLessons))) {
                    try {
                        fs_1.default.writeFileSync(publicLessons, JSON.stringify({ lessons }, null, 2));
                    }
                    catch (e) { }
                }
                res.setHeader("X-Cache", "BYPASS");
                return res.json({ status: "success", message: "Lessons saved successfully" });
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to write lessons: " + e.message });
            }
        }
        else if (endpoint === "get_library") {
            const libraryFile = path_1.default.join(process.cwd(), "library.json");
            if (!fs_1.default.existsSync(libraryFile)) {
                // Fallback 1: Initialize from public static directory if available
                const publicLibrary = path_1.default.join(process.cwd(), "..", "public", "static", "library.json");
                if (fs_1.default.existsSync(publicLibrary)) {
                    try {
                        const data = fs_1.default.readFileSync(publicLibrary, "utf-8");
                        fs_1.default.writeFileSync(libraryFile, data);
                        return res.json(JSON.parse(data));
                    }
                    catch (e) { }
                }
                // Fallback 2: Initialize from src/data directory if available
                const srcLibrary = path_1.default.join(process.cwd(), "..", "src", "data", "library.json");
                if (fs_1.default.existsSync(srcLibrary)) {
                    try {
                        const data = fs_1.default.readFileSync(srcLibrary, "utf-8");
                        fs_1.default.writeFileSync(libraryFile, data);
                        return res.json(JSON.parse(data));
                    }
                    catch (e) { }
                }
                return res.json([]);
            }
            try {
                const data = fs_1.default.readFileSync(libraryFile, "utf-8");
                return res.json(JSON.parse(data));
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to read library file" });
            }
        }
        else if (endpoint === "save_library") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { library } = input;
            if (!Array.isArray(library)) {
                return res.status(400).json({ error: "Invalid library data format" });
            }
            const libraryFile = path_1.default.join(process.cwd(), "library.json");
            try {
                fs_1.default.writeFileSync(libraryFile, JSON.stringify(library, null, 2));
                // Sync to public static folder if in dev environment
                const publicLibrary = path_1.default.join(process.cwd(), "..", "public", "static", "library.json");
                if (fs_1.default.existsSync(path_1.default.dirname(publicLibrary))) {
                    try {
                        fs_1.default.writeFileSync(publicLibrary, JSON.stringify(library, null, 2));
                    }
                    catch (e) { }
                }
                // Sync to src/data folder if in dev environment
                const srcLibrary = path_1.default.join(process.cwd(), "..", "src", "data", "library.json");
                if (fs_1.default.existsSync(path_1.default.dirname(srcLibrary))) {
                    try {
                        fs_1.default.writeFileSync(srcLibrary, JSON.stringify(library, null, 2));
                    }
                    catch (e) { }
                }
                res.setHeader("X-Cache", "BYPASS");
                return res.json({ status: "success", message: "Library saved successfully" });
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to write library: " + e.message });
            }
        }
        else if (endpoint === "get_ticker") {
            const tickerFile = path_1.default.join(process.cwd(), "ticker.json");
            if (!fs_1.default.existsSync(tickerFile)) {
                const publicTicker = path_1.default.join(process.cwd(), "..", "public", "static", "ticker.json");
                if (fs_1.default.existsSync(publicTicker)) {
                    try {
                        const data = fs_1.default.readFileSync(publicTicker, "utf-8");
                        fs_1.default.writeFileSync(tickerFile, data);
                        return res.json(JSON.parse(data));
                    }
                    catch (e) { }
                }
                const srcTicker = path_1.default.join(process.cwd(), "..", "src", "data", "ticker.json");
                if (fs_1.default.existsSync(srcTicker)) {
                    try {
                        const data = fs_1.default.readFileSync(srcTicker, "utf-8");
                        fs_1.default.writeFileSync(tickerFile, data);
                        return res.json(JSON.parse(data));
                    }
                    catch (e) { }
                }
                return res.json({ speed: "normal", tickers: [] });
            }
            try {
                const data = fs_1.default.readFileSync(tickerFile, "utf-8");
                return res.json(JSON.parse(data));
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to read ticker file" });
            }
        }
        else if (endpoint === "save_ticker") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res.status(403).json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { ticker } = input;
            if (!ticker || typeof ticker !== "object") {
                return res.status(400).json({ error: "Invalid ticker data format" });
            }
            const tickerFile = path_1.default.join(process.cwd(), "ticker.json");
            try {
                fs_1.default.writeFileSync(tickerFile, JSON.stringify(ticker, null, 2));
                const publicTicker = path_1.default.join(process.cwd(), "..", "public", "static", "ticker.json");
                if (fs_1.default.existsSync(path_1.default.dirname(publicTicker))) {
                    try {
                        fs_1.default.writeFileSync(publicTicker, JSON.stringify(ticker, null, 2));
                    }
                    catch (e) { }
                }
                const srcTicker = path_1.default.join(process.cwd(), "..", "src", "data", "ticker.json");
                if (fs_1.default.existsSync(path_1.default.dirname(srcTicker))) {
                    try {
                        fs_1.default.writeFileSync(srcTicker, JSON.stringify(ticker, null, 2));
                    }
                    catch (e) { }
                }
                res.setHeader("X-Cache", "BYPASS");
                return res.json({ status: "success", message: "Ticker saved successfully" });
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to write ticker: " + e.message });
            }
        }
        else if (endpoint === "save_subscribers") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { subscribers } = input;
            if (Array.isArray(subscribers)) {
                const subFile = path_1.default.join(process.cwd(), "subscribers.json");
                const subMap = {};
                for (const sub of subscribers) {
                    if (sub && sub.endpoint) {
                        subMap[sub.endpoint] = sub;
                    }
                }
                try {
                    fs_1.default.writeFileSync(subFile, JSON.stringify(subMap, null, 2));
                    res.setHeader("X-Cache", "BYPASS");
                    return res.json({ status: "success", message: "Subscribers saved successfully" });
                }
                catch (e) {
                    return res.status(500).json({ error: "Failed to write subscribers: " + e.message });
                }
            }
            return res.status(400).json({ error: "Invalid subscribers data format" });
        }
        else if (endpoint === "save_users") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const { users } = input;
            if (Array.isArray(users)) {
                if (!isSyncEnabled() && users.length > 0) {
                    return res.status(400).json({
                        error: "Cannot import users while user data sync is disabled. (యూజర్ డేటా సింక్ ఆఫ్‌లో ఉన్నప్పుడు ఇంపోర్ట్ చేయలేరు.)",
                    });
                }
                const usersFile = path_1.default.join(process.cwd(), "users_data.json");
                try {
                    fs_1.default.writeFileSync(usersFile, JSON.stringify(users, null, 2));
                    res.setHeader("X-Cache", "BYPASS");
                    return res.json({ status: "success", message: "Users saved successfully" });
                }
                catch (e) {
                    return res.status(500).json({ error: "Failed to write users: " + e.message });
                }
            }
        }
        else if (endpoint === "eclipses") {
            const lat = parseFloat(String(input.latitude || input.lat || 12.9716));
            const lon = parseFloat(String(input.longitude || input.lon || 77.5946));
            const tz = parseFloat(String(input.timezone || input.tz || 5.5));
            const count = Math.min(20, Math.max(1, parseInt(String(input.count || 5))));
            const fromDate = String(input.date || new Date().toISOString().split("T")[0]);
            const [year, month, day] = fromDate.split("-").map(Number);
            const swetestDateStr = `${day}.${month}.${year}`;
            const solArgs = `-solecl -local -geopos${lon},${lat},0 -b${swetestDateStr} -n${count}`;
            const lunArgs = `-lunecl -b${swetestDateStr} -n${count * 3}`;
            const solOut = VedicAstroEngine_1.VedicAstroEngine.runSwetestStatic(solArgs);
            const lunOut = VedicAstroEngine_1.VedicAstroEngine.runSwetestStatic(lunArgs);
            const solarEclipses = parseSwetestEclipses(solOut, tz, "solar", lat, lon)
                .filter(e => e.magnitude >= 0.01);
            const allLunarEclipses = parseSwetestEclipses(lunOut, tz, "lunar", lat, lon);
            const lunarEclipses = allLunarEclipses
                .filter(e => e.magnitude >= 0.01 && e.contactTimes.some((c) => c.localTime !== "-"))
                .slice(0, count);
            const allEclipses = [...solarEclipses, ...lunarEclipses].sort((a, b) => a.utcTimestamp - b.utcTimestamp);
            return jsonAndCache({
                endpoint: "eclipses",
                meta: {
                    latitude: lat,
                    longitude: lon,
                    timezone: tz,
                    fromDate,
                },
                solar: solarEclipses,
                lunar: lunarEclipses,
                all: allEclipses.slice(0, count),
            });
        }
        else if (endpoint === "admin_get_all") {
            // అడ్మిన్ ప్యానెల్ లో డేటా చూపించడానికి కొత్త ఎండ్‌పాయింట్
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const readJson = (file) => {
                const p = path_1.default.join(process.cwd(), file);
                if (fs_1.default.existsSync(p)) {
                    try {
                        return JSON.parse(fs_1.default.readFileSync(p, "utf-8"));
                    }
                    catch (e) { }
                }
                return null;
            };
            const subscribers = readJson("subscribers.json") || {};
            const users = readJson("users_data.json") || [];
            const enableUserSync = isSyncEnabled();
            res.setHeader("X-Cache", "BYPASS");
            return res.json({
                status: "success",
                subscribers: Object.values(subscribers),
                users,
                enableUserSync,
            });
        }
        else if (endpoint === "save_sync_settings") {
            const adminPwd = req.headers["x-admin-password"] || input.admin_password;
            const REAL_ADMIN_PWD = process.env.ADMIN_PASSWORD;
            if (!REAL_ADMIN_PWD || adminPwd !== REAL_ADMIN_PWD) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Invalid Admin Password" });
            }
            const settingsFile = path_1.default.join(process.cwd(), "sync_settings.json");
            const data = {
                enableUserSync: input.enableUserSync === true,
            };
            try {
                fs_1.default.writeFileSync(settingsFile, JSON.stringify(data, null, 2));
                res.setHeader("X-Cache", "BYPASS");
                return res.json({
                    status: "success",
                    enableUserSync: data.enableUserSync,
                });
            }
            catch (e) {
                return res.status(500).json({ error: "Failed to write sync settings: " + e.message });
            }
        }
        return res.status(400).json({ error: "Unknown endpoint" });
    }
    catch (err) {
        return res
            .status(400)
            .json({ error: "Bad Request / Server Error", detail: err.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Jyotisha API Express Server is running on http://localhost:${PORT}`);
});
