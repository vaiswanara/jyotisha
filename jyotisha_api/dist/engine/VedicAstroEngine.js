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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VedicAstroEngine = void 0;
/**
 * Vedic Astrology Engine - TypeScript Port
 * Ported from astro_engine.php and VedicAstroCoreTrait.php
 */
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const constants_1 = require("./constants");
class VedicAstroEngine {
    julianDay;
    useSwetest;
    ayanamsha = 0;
    ayanamshaName;
    utDateStr;
    utTimeStr;
    static exePath = null;
    static ephePath = null;
    static initialized = false;
    rahuMode = "mean";
    constructor(julianDay, utDateStr = null, utTimeStr = null, ayanamshaKey = "lahiri", rahuMode = "mean") {
        this.julianDay = julianDay;
        this.utDateStr = utDateStr;
        this.utTimeStr = utTimeStr;
        this.ayanamshaName = ayanamshaKey;
        this.rahuMode = rahuMode;
        VedicAstroEngine.initPaths();
        this.useSwetest = VedicAstroEngine.exePath !== null;
        const ayCode = constants_1.AYANAMSHA_LIST[ayanamshaKey]?.code ?? "1";
        const customVal = parseFloat(ayanamshaKey);
        if (!isNaN(customVal) && !constants_1.AYANAMSHA_LIST[ayanamshaKey]) {
            this.ayanamsha = customVal;
            this.useSwetest = false;
        }
        else {
            if (this.useSwetest && utDateStr) {
                const ayCalc = this.calcAyanamshaViaSwetest(ayCode);
                if (ayCalc !== null) {
                    this.ayanamsha = ayCalc;
                }
            }
            if (!this.ayanamsha || this.ayanamsha < 20) {
                this.ayanamsha = this.calcLahiriAyanamshaFallback(julianDay);
            }
        }
    }
    static isSwetestEnabled() {
        this.initPaths();
        return this.exePath !== null;
    }
    static initPaths() {
        if (this.initialized)
            return;
        // ఫైల్ 'jyotisha_api/engine/' లేదా కంపైల్ అయిన 'jyotisha_api/dist/engine/' ఎక్కడ ఉన్నా సరిగ్గా పనిచేసేలా
        let rootDir = path.join(__dirname, "..");
        if (path.basename(rootDir) === "dist") {
            rootDir = path.join(rootDir, "..");
        }
        const swetestCandidates = [];
        if (process.platform === "win32") {
            swetestCandidates.push(path.join(rootDir, "swetest.exe"));
        }
        else if (process.platform === "darwin") {
            swetestCandidates.push(path.join(rootDir, "swetest_mac"));
        }
        else {
            swetestCandidates.push(path.join(rootDir, "swetest"));
        }
        for (const candidate of swetestCandidates) {
            if (fs.existsSync(candidate)) {
                this.exePath = candidate;
                break;
            }
        }
        this.ephePath = path.join(rootDir, "ephe");
        this.initialized = true;
    }
    static toJulianDay(year, month, day, hour, minute, timezone, second = 0) {
        let utHour = hour + (minute + second / 60.0) / 60.0 - timezone;
        if (utHour < 0) {
            utHour += 24;
            day--;
        }
        if (utHour >= 24) {
            utHour -= 24;
            day++;
        }
        if (month <= 2) {
            year--;
            month += 12;
        }
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);
        return (Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1)) +
            day +
            B -
            1524.5 +
            utHour / 24.0);
    }
    static fromBirthData(year, month, day, hour, minute, timezone, ayanamshaKey = "lahiri", second = 0, rahuMode = "mean") {
        let utHour = hour + (minute + second / 60.0) / 60.0 - timezone;
        let utDay = day;
        let utMon = month;
        let utYear = year;
        if (utHour < 0) {
            utHour += 24;
            utDay--;
        }
        if (utHour >= 24) {
            utHour -= 24;
            utDay++;
        }
        if (utDay < 1) {
            utMon--;
            if (utMon < 1) {
                utMon = 12;
                utYear--;
            }
            utDay = new Date(utYear, utMon, 0).getDate(); // Gets total days in the previous month
        }
        const jd = this.toJulianDay(year, month, day, hour, minute, timezone, second);
        const utDateStr = `${utDay}.${utMon}.${utYear}`;
        const utH = Math.floor(utHour);
        const utM = Math.floor((utHour - utH) * 60);
        const utS = Math.floor(((utHour - utH) * 60 - utM) * 60);
        // Pad single digits with zero (e.g., 9 becomes 09)
        const utTimeStr = `${utH.toString().padStart(2, "0")}:${utM
            .toString()
            .padStart(2, "0")}:${utS.toString().padStart(2, "0")}`;
        return new VedicAstroEngine(jd, utDateStr, utTimeStr, ayanamshaKey, rahuMode);
    }
    static runSwetestStatic(args) {
        VedicAstroEngine.initPaths();
        if (!VedicAstroEngine.exePath)
            return "";
        const epheArg = `-edir${VedicAstroEngine.ephePath}${path.sep}`;
        const cmd = `"${VedicAstroEngine.exePath}" ${epheArg} ${args}`;
        try {
            const execEnv = { ...process.env };
            if (process.platform === "linux" && VedicAstroEngine.exePath) {
                execEnv.LD_LIBRARY_PATH = path.dirname(VedicAstroEngine.exePath);
            }
            return (0, child_process_1.execSync)(cmd, { env: execEnv, encoding: "utf8", stdio: "pipe" });
        }
        catch (error) {
            return error.stdout ? error.stdout.toString() : "";
        }
    }
    runSwetest(args) {
        return VedicAstroEngine.runSwetestStatic(args);
    }
    static getRiseSetTimes(planet, dateStr, // YYYY-MM-DD
    lon, lat, timezone) {
        VedicAstroEngine.initPaths();
        if (!VedicAstroEngine.exePath) {
            return { rise: null, set: null };
        }
        const [y, m, d] = dateStr.trim().split("-").map(Number);
        const prevDate = new Date(Date.UTC(y, m - 1, d) - 86400 * 1000);
        const startDay = prevDate.getUTCDate();
        const startMonth = prevDate.getUTCMonth() + 1;
        const startYear = prevDate.getUTCFullYear();
        const swetestDateStr = `${startDay}.${startMonth}.${startYear}`;
        const args = `-b${swetestDateStr} -geopos${lon},${lat},0 -rise -p${planet} -n3`;
        const out = VedicAstroEngine.runSwetestStatic(args);
        const lines = out.split("\n");
        const localStartTs = Math.floor(Date.UTC(y, m - 1, d) / 1000) - timezone * 3600;
        const localEndTs = localStartTs + 86400;
        let riseTs = null;
        let setTs = null;
        for (const line of lines) {
            if (!line.includes("rise") || !line.includes("set"))
                continue;
            const setIndex = line.indexOf("set");
            const regex = /(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}(?:\.\d+)?)/g;
            let match;
            while ((match = regex.exec(line)) !== null) {
                const matchIndex = match.index;
                const matchDay = parseInt(match[1]);
                const matchMonth = parseInt(match[2]);
                const matchYear = parseInt(match[3]);
                const matchHour = parseInt(match[4]);
                const matchMinute = parseInt(match[5]);
                const matchSecond = parseFloat(match[6]);
                const eventUtc = Date.UTC(matchYear, matchMonth - 1, matchDay, matchHour, matchMinute, Math.floor(matchSecond), Math.round((matchSecond % 1) * 1000));
                const eventTs = Math.floor(eventUtc / 1000);
                if (eventTs >= localStartTs && eventTs < localEndTs) {
                    if (matchIndex < setIndex) {
                        riseTs = eventTs;
                    }
                    else {
                        setTs = eventTs;
                    }
                }
            }
        }
        return { rise: riseTs, set: setTs };
    }
    calcAyanamshaViaSwetest(ayCode = "1") {
        if (!this.utDateStr || !this.utTimeStr)
            return null;
        const out = this.runSwetest(`-b${this.utDateStr} -ut${this.utTimeStr} -ay${ayCode}`);
        const lines = out.split("\n");
        for (const line of lines) {
            if (line.toLowerCase().includes("ayanam")) {
                const matches = line.match(/(\d+\.?\d*)/g);
                if (matches) {
                    for (let i = 0; i < matches.length; i++) {
                        const n = parseFloat(matches[i]);
                        if (n >= 20 && n <= 30) {
                            const deg = n;
                            const min = matches[i + 1] ? parseFloat(matches[i + 1]) : 0;
                            const sec = matches[i + 2] ? parseFloat(matches[i + 2]) : 0;
                            if (min < 60 && sec < 60) {
                                return deg + min / 60 + sec / 3600;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    calcLahiriAyanamshaFallback(jd) {
        const T = (jd - 2415020.0) / 36525.0;
        const ay = 22.46045 + ((50.290966 + 0.0222226 * T) * T) / 3600.0;
        return ((ay % 360) + 360) % 360;
    }
    getAyanamsha() {
        return this.ayanamsha;
    }
    getAyanamshaName() {
        const customVal = parseFloat(this.ayanamshaName);
        if (!isNaN(customVal) && !constants_1.AYANAMSHA_LIST[this.ayanamshaName]) {
            return "User Defined (" + customVal + "°)";
        }
        return constants_1.AYANAMSHA_LIST[this.ayanamshaName]?.label ?? this.ayanamshaName;
    }
    isUsingSwetest() {
        return this.useSwetest;
    }
    setSwetest(val) {
        this.useSwetest = val && VedicAstroEngine.exePath !== null;
    }
    calcPlanetViaSwetest(planetCode) {
        if (!this.utDateStr || !this.utTimeStr)
            return null;
        const out = this.runSwetest(`-b${this.utDateStr} -ut${this.utTimeStr} -p${planetCode} -fls -eswe`);
        const lines = out.split("\n").reverse();
        for (const line of lines) {
            const trimmed = line.trim();
            const match = trimmed.match(/^(\d+\.\d+)\s+([-\d.]+)/);
            if (match) {
                const tropLon = parseFloat(match[1]);
                const speed = parseFloat(match[2]);
                const sidLon = (((tropLon - this.ayanamsha) % 360) + 360) % 360;
                return { longitude: sidLon, speed };
            }
        }
        return null;
    }
    calcAscendantViaSwetest(latitude, longitude) {
        if (!this.utDateStr || !this.utTimeStr)
            return null;
        const out = this.runSwetest(`-b${this.utDateStr} -ut${this.utTimeStr} -house${longitude},${latitude},W`);
        let tropAsc = null;
        const lines = out.split("\n");
        for (const line of lines) {
            if (/^Ascendant/i.test(line)) {
                const matches = line.match(/(\d+\.?\d*)/g);
                if (matches) {
                    for (let i = 0; i < matches.length; i++) {
                        const deg = parseFloat(matches[i]);
                        if (deg >= 0 && deg < 360) {
                            const min = matches[i + 1] ? parseFloat(matches[i + 1]) : 0;
                            const sec = matches[i + 2] ? parseFloat(matches[i + 2]) : 0;
                            if (min < 60 && sec < 60) {
                                tropAsc = deg + min / 60 + sec / 3600;
                                break;
                            }
                        }
                    }
                }
                if (tropAsc !== null)
                    break;
            }
        }
        if (tropAsc === null)
            return null;
        return (((tropAsc - this.ayanamsha) % 360) + 360) % 360;
    }
    fmod360(val) {
        return ((val % 360) + 360) % 360;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180.0);
    }
    rad2deg(rad) {
        return rad * (180.0 / Math.PI);
    }
    toSidereal(trop) {
        return this.fmod360(trop - this.ayanamsha);
    }
    getRashi(lon) {
        return Math.floor(lon / 30) + 1;
    }
    getDegInRashi(lon) {
        return lon % 30;
    }
    getNakInfo(sidLon) {
        const nakLen = 360.0 / 27.0;
        const idx = Math.min(26, Math.floor(sidLon / nakLen));
        const posInNak = sidLon % nakLen;
        const pada = Math.min(4, Math.floor(posInNak / (nakLen / 4)) + 1);
        return {
            nakshatra: constants_1.NAKSHATRAS[idx].name,
            lord: constants_1.NAKSHATRAS[idx].lord,
            pada: pada,
            index: idx,
            deg_in_nak: posInNak,
        };
    }
    calcPlanetFallback(planetName) {
        const T = (this.julianDay - 2451545.0) / 36525.0;
        let L0, M, C, Lp, Mp, D, F, lon, L;
        switch (planetName) {
            case constants_1.Planet.Sun:
                L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
                M = this.deg2rad(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
                C =
                    (1.914602 - 0.004817 * T) * Math.sin(M) +
                        (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
                        0.000289 * Math.sin(3 * M);
                return { trop_lon: this.fmod360(L0 + C), speed: 1.0 };
            case constants_1.Planet.Moon:
                Lp = 218.3165 + 481267.8813 * T;
                M = this.deg2rad(357.5291 + 35999.0503 * T);
                Mp = this.deg2rad(134.9634 + 477198.8676 * T);
                D = this.deg2rad(297.8502 + 445267.1115 * T);
                F = this.deg2rad(93.272 + 483202.0175 * T);
                lon =
                    Lp +
                        6.2888 * Math.sin(Mp) +
                        1.274 * Math.sin(2 * D - Mp) +
                        0.6583 * Math.sin(2 * D) +
                        0.2136 * Math.sin(2 * Mp) -
                        0.1851 * Math.sin(M) -
                        0.1143 * Math.sin(2 * F) +
                        0.0588 * Math.sin(2 * D - 2 * Mp) +
                        0.0572 * Math.sin(2 * D - M - Mp) +
                        0.0533 * Math.sin(2 * D + Mp) +
                        0.041 * Math.sin(2 * D - M);
                return { trop_lon: this.fmod360(lon), speed: 13.2 };
            case constants_1.Planet.Mars:
                L = 355.433 + 19140.2993 * T + 0.000261 * T * T;
                M = this.deg2rad(19.373 + 19139.8585 * T);
                lon =
                    L +
                        10.6912 * Math.sin(M) +
                        0.6228 * Math.sin(2 * M) +
                        0.0503 * Math.sin(3 * M);
                return { trop_lon: this.fmod360(lon), speed: 0.52 };
            case constants_1.Planet.Mercury:
                L = 252.2509 + 149472.6746 * T;
                M = this.deg2rad(174.7948 + 149472.5153 * T);
                lon =
                    L +
                        23.4405 * Math.sin(M) +
                        2.9818 * Math.sin(2 * M) +
                        0.5255 * Math.sin(3 * M) +
                        0.1058 * Math.sin(4 * M);
                return { trop_lon: this.fmod360(lon), speed: 1.38 };
            case constants_1.Planet.Jupiter:
                L = 34.351 + 3034.9057 * T - 0.00008501 * T * T;
                M = this.deg2rad(20.0202 + 3034.6626 * T);
                lon =
                    L +
                        5.5549 * Math.sin(M) +
                        0.1683 * Math.sin(2 * M) +
                        0.0071 * Math.sin(3 * M);
                return { trop_lon: this.fmod360(lon), speed: 0.083 };
            case constants_1.Planet.Venus:
                L = 181.9798 + 58517.8156 * T;
                M = this.deg2rad(212.2606 + 58517.8039 * T);
                lon = L + 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2 * M);
                return { trop_lon: this.fmod360(lon), speed: 1.6 };
            case constants_1.Planet.Saturn:
                L = 50.0774 + 1222.1138 * T + 0.00021004 * T * T;
                M = this.deg2rad(317.0207 + 1221.5515 * T);
                lon =
                    L +
                        6.3585 * Math.sin(M) +
                        0.1914 * Math.sin(2 * M) +
                        0.0087 * Math.sin(3 * M);
                return { trop_lon: this.fmod360(lon), speed: 0.034 };
            case constants_1.Planet.Rahu:
                lon =
                    125.0445 - 1934.1363 * T + 0.0020754 * T * T + 0.00000215 * T * T * T;
                return { trop_lon: this.fmod360(lon), speed: -0.053 };
        }
        return null;
    }
    buildPlanetEntry(sidLon, speed, lagnaRashi) {
        const rashi = this.getRashi(sidLon);
        const deg = this.getDegInRashi(sidLon);
        const nak = this.getNakInfo(sidLon);
        const house = ((rashi - lagnaRashi + 12) % 12) + 1;
        return {
            longitude: sidLon,
            rashi: rashi,
            rashi_name: constants_1.RASHI_NAMES[rashi - 1].en,
            degree: deg,
            nakshatra: nak.nakshatra,
            pada: nak.pada,
            nak_lord: nak.lord,
            nak_index: nak.index,
            deg_in_nak: nak.deg_in_nak,
            retrograde: speed < 0,
            speed: speed,
            house: house,
        };
    }
    calcAscendant(latitude, longitude) {
        if (this.useSwetest && this.utDateStr) {
            const ascSid = this.calcAscendantViaSwetest(latitude, longitude);
            if (ascSid !== null && ascSid > 0) {
                return this.fmod360(ascSid);
            }
        }
        const T = (this.julianDay - 2451545.0) / 36525.0;
        const GMST = 280.46061837 +
            360.98564736629 * (this.julianDay - 2451545.0) +
            0.000387933 * T * T;
        let LST = this.fmod360(GMST + longitude);
        const eps = this.deg2rad(23.439292 - 0.013004 * T);
        const lat = this.deg2rad(latitude);
        const E = this.deg2rad(LST);
        const y = -Math.cos(E);
        const x = Math.sin(E) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps);
        let asc = this.rad2deg(Math.atan2(y, x));
        asc = this.fmod360(asc);
        return this.toSidereal(asc);
    }
    calculateAll(latitude, longitude) {
        const ascSid = this.calcAscendant(latitude, longitude);
        const lagnaRashi = this.getRashi(ascSid);
        const planets = {};
        planets[constants_1.Planet.Ascendant] = {
            ...this.buildPlanetEntry(ascSid, 0, lagnaRashi),
            house: 1,
        };
        const corePlanets = [
            constants_1.Planet.Sun,
            constants_1.Planet.Moon,
            constants_1.Planet.Mars,
            constants_1.Planet.Mercury,
            constants_1.Planet.Jupiter,
            constants_1.Planet.Venus,
            constants_1.Planet.Saturn,
            constants_1.Planet.Rahu,
        ];
        for (const pname of corePlanets) {
            let calculated = false;
            if (this.useSwetest && this.utDateStr) {
                let code = constants_1.SWE_CODE[pname];
                if (pname === constants_1.Planet.Rahu) {
                    code = this.rahuMode === "true" ? "t" : "m";
                }
                if (code) {
                    const data = this.calcPlanetViaSwetest(code);
                    if (data) {
                        const sidLon = this.fmod360(data.longitude);
                        planets[pname] = this.buildPlanetEntry(sidLon, data.speed, lagnaRashi);
                        calculated = true;
                    }
                }
            }
            if (!calculated) {
                const fb = this.calcPlanetFallback(pname);
                if (fb) {
                    const sidLon = this.toSidereal(fb.trop_lon);
                    planets[pname] = this.buildPlanetEntry(sidLon, fb.speed, lagnaRashi);
                }
            }
        }
        if (planets[constants_1.Planet.Rahu]) {
            // వేద జ్యోతిష్యం ప్రకారం రాహువు ఎల్లప్పుడూ వక్రగతిలోనే ఉంటాడు
            planets[constants_1.Planet.Rahu].retrograde = true;
            const ketuLon = this.fmod360(planets[constants_1.Planet.Rahu].longitude + 180);
            planets[constants_1.Planet.Ketu] = {
                ...this.buildPlanetEntry(ketuLon, planets[constants_1.Planet.Rahu].speed, lagnaRashi),
                retrograde: true,
            };
        }
        // Combustion Calculation (Asta)
        const sunLon = planets[constants_1.Planet.Sun]?.longitude ?? 0;
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            p.combust = false;
            if ([
                constants_1.Planet.Sun,
                constants_1.Planet.Moon,
                constants_1.Planet.Rahu,
                constants_1.Planet.Ketu,
                constants_1.Planet.Ascendant,
            ].includes(name))
                continue;
            let limit = 0;
            if (name === constants_1.Planet.Mars)
                limit = 17;
            else if (name === constants_1.Planet.Jupiter)
                limit = 11;
            else if (name === constants_1.Planet.Saturn)
                limit = 15;
            else if (name === constants_1.Planet.Mercury)
                limit = p.retrograde ? 12 : 14;
            else if (name === constants_1.Planet.Venus)
                limit = p.retrograde ? 8 : 10;
            let diff = Math.abs(p.longitude - sunLon);
            if (diff > 180)
                diff = 360 - diff;
            if (diff <= limit)
                p.combust = true;
        }
        return planets;
    }
    calcHouses(lagnaRashi) {
        const houses = {};
        for (let i = 1; i <= 12; i++) {
            const r = ((lagnaRashi - 1 + i - 1) % 12) + 1;
            houses[i] = {
                rashi: r,
                rashi_name: constants_1.RASHI_NAMES[r - 1].en,
                degree: 0,
            };
        }
        return houses;
    }
    calcNavamsa(planets) {
        const nav = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const navIdx = Math.floor(p.degree / (30.0 / 9.0));
            let start = 0;
            if ([0, 4, 8].includes(ri))
                start = 0;
            else if ([1, 5, 9].includes(ri))
                start = 9;
            else if ([2, 6, 10].includes(ri))
                start = 6;
            else
                start = 3;
            const navRashi = ((start + navIdx) % 12) + 1;
            nav[name] = { rashi: navRashi, rashi_name: constants_1.RASHI_NAMES[navRashi - 1].en };
        }
        if (nav[constants_1.Planet.Rahu]) {
            const rahuRashi = nav[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            nav[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return nav;
    }
    calcDrekkanaD3(planets) {
        const d3 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 10.0); // 0, 1, 2
            let shift = 0;
            if (idx === 1)
                shift = 4;
            else if (idx === 2)
                shift = 8;
            const d3Rashi = ((ri + shift) % 12) + 1;
            d3[name] = { rashi: d3Rashi, rashi_name: constants_1.RASHI_NAMES[d3Rashi - 1].en };
        }
        if (d3[constants_1.Planet.Rahu]) {
            const rahuRashi = d3[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d3[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d3;
    }
    calcSaptamshaD7(planets) {
        const d7 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / (30.0 / 7.0)); // 0 to 6
            const isOdd = (p.rashi % 2) !== 0;
            const start = isOdd ? ri : (ri + 6);
            const d7Rashi = ((start + idx) % 12) + 1;
            d7[name] = { rashi: d7Rashi, rashi_name: constants_1.RASHI_NAMES[d7Rashi - 1].en };
        }
        if (d7[constants_1.Planet.Rahu]) {
            const rahuRashi = d7[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d7[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d7;
    }
    calcDasamshaD10(planets) {
        const d10 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 3.0); // 0 to 9
            const isOdd = (p.rashi % 2) !== 0;
            const start = isOdd ? ri : (ri + 8);
            const d10Rashi = ((start + idx) % 12) + 1;
            d10[name] = { rashi: d10Rashi, rashi_name: constants_1.RASHI_NAMES[d10Rashi - 1].en };
        }
        if (d10[constants_1.Planet.Rahu]) {
            const rahuRashi = d10[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d10[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d10;
    }
    calcDwadashamshaD12(planets) {
        const d12 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 2.5); // 0 to 11
            const d12Rashi = ((ri + idx) % 12) + 1;
            d12[name] = { rashi: d12Rashi, rashi_name: constants_1.RASHI_NAMES[d12Rashi - 1].en };
        }
        if (d12[constants_1.Planet.Rahu]) {
            const rahuRashi = d12[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d12[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d12;
    }
    calcHoraD2(planets) {
        const d2 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const isOdd = (p.rashi % 2) !== 0;
            let d2Rashi = 4; // Cancer (Moon's Hora) default
            if (isOdd) {
                d2Rashi = p.degree < 15 ? 5 : 4; // Leo (Sun) first 15, then Cancer (Moon)
            }
            else {
                d2Rashi = p.degree < 15 ? 4 : 5; // Cancer (Moon) first 15, then Leo (Sun)
            }
            d2[name] = { rashi: d2Rashi, rashi_name: constants_1.RASHI_NAMES[d2Rashi - 1].en };
        }
        if (d2[constants_1.Planet.Rahu]) {
            const rahuRashi = d2[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d2[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d2;
    }
    calcChaturthamshaD4(planets) {
        const d4 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 7.5); // 0, 1, 2, 3
            const d4Rashi = ((ri + idx * 3) % 12) + 1;
            d4[name] = { rashi: d4Rashi, rashi_name: constants_1.RASHI_NAMES[d4Rashi - 1].en };
        }
        if (d4[constants_1.Planet.Rahu]) {
            const rahuRashi = d4[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d4[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d4;
    }
    calcShodashamshaD16(planets) {
        const d16 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 1.875); // 0 to 15
            let start = 0;
            if ([0, 3, 6, 9].includes(ri)) { // Movable: Aries, Cancer, Libra, Capricorn
                start = 0; // Aries (1)
            }
            else if ([1, 4, 7, 10].includes(ri)) { // Fixed: Taurus, Leo, Scorpio, Aquarius
                start = 4; // Leo (5)
            }
            else { // Dual: Gemini, Virgo, Sagittarius, Pisces
                start = 8; // Sagittarius (9)
            }
            const d16Rashi = ((start + idx) % 12) + 1;
            d16[name] = { rashi: d16Rashi, rashi_name: constants_1.RASHI_NAMES[d16Rashi - 1].en };
        }
        if (d16[constants_1.Planet.Rahu]) {
            const rahuRashi = d16[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d16[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d16;
    }
    calcVimshamshaD20(planets) {
        const d20 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 1.5); // 0 to 19
            let start = 0;
            if ([0, 3, 6, 9].includes(ri)) { // Movable
                start = 0; // Aries (1)
            }
            else if ([1, 4, 7, 10].includes(ri)) { // Fixed
                start = 8; // Sagittarius (9)
            }
            else { // Dual
                start = 4; // Leo (5)
            }
            const d20Rashi = ((start + idx) % 12) + 1;
            d20[name] = { rashi: d20Rashi, rashi_name: constants_1.RASHI_NAMES[d20Rashi - 1].en };
        }
        if (d20[constants_1.Planet.Rahu]) {
            const rahuRashi = d20[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d20[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d20;
    }
    calcChaturvimshamshaD24(planets) {
        const d24 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const isOdd = (p.rashi % 2) !== 0;
            const idx = Math.floor(p.degree / 1.25); // 0 to 23
            const start = isOdd ? 4 : 3; // odd: Leo (5), even: Cancer (4)
            const d24Rashi = ((start + idx) % 12) + 1;
            d24[name] = { rashi: d24Rashi, rashi_name: constants_1.RASHI_NAMES[d24Rashi - 1].en };
        }
        if (d24[constants_1.Planet.Rahu]) {
            const rahuRashi = d24[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d24[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d24;
    }
    calcSaptavimshamshaD27(planets) {
        const d27 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / (10.0 / 9.0)); // 0 to 26
            let start = 0;
            if ([0, 4, 8].includes(ri)) { // Fiery
                start = 0; // Aries (1)
            }
            else if ([1, 5, 9].includes(ri)) { // Earthy
                start = 9; // Capricorn (10)
            }
            else if ([2, 6, 10].includes(ri)) { // Airy
                start = 6; // Libra (7)
            }
            else { // Watery
                start = 3; // Cancer (4)
            }
            const d27Rashi = ((start + idx) % 12) + 1;
            d27[name] = { rashi: d27Rashi, rashi_name: constants_1.RASHI_NAMES[d27Rashi - 1].en };
        }
        if (d27[constants_1.Planet.Rahu]) {
            const rahuRashi = d27[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d27[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d27;
    }
    calcTrimshamshaD30(planets) {
        const d30 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const isOdd = (p.rashi % 2) !== 0;
            const deg = p.degree;
            let d30Rashi = 1;
            if (isOdd) {
                if (deg < 5)
                    d30Rashi = 1; // Mars - Aries
                else if (deg < 10)
                    d30Rashi = 11; // Saturn - Aquarius
                else if (deg < 18)
                    d30Rashi = 9; // Jupiter - Sagittarius
                else if (deg < 25)
                    d30Rashi = 3; // Mercury - Gemini
                else
                    d30Rashi = 7; // Venus - Libra
            }
            else {
                if (deg < 5)
                    d30Rashi = 2; // Venus - Taurus
                else if (deg < 12)
                    d30Rashi = 6; // Mercury - Virgo
                else if (deg < 20)
                    d30Rashi = 12; // Jupiter - Pisces
                else if (deg < 25)
                    d30Rashi = 10; // Saturn - Capricorn
                else
                    d30Rashi = 8; // Mars - Scorpio
            }
            d30[name] = { rashi: d30Rashi, rashi_name: constants_1.RASHI_NAMES[d30Rashi - 1].en };
        }
        return d30;
    }
    calcShashtiamshaD60(planets) {
        const d60 = {};
        for (const [key, p] of Object.entries(planets)) {
            const name = key;
            if (!p)
                continue;
            const ri = p.rashi - 1;
            const idx = Math.floor(p.degree / 0.5); // 0 to 59
            const d60Rashi = ((ri + idx) % 12) + 1;
            d60[name] = { rashi: d60Rashi, rashi_name: constants_1.RASHI_NAMES[d60Rashi - 1].en };
        }
        if (d60[constants_1.Planet.Rahu]) {
            const rahuRashi = d60[constants_1.Planet.Rahu].rashi;
            const ketuRashi = ((rahuRashi - 1 + 6) % 12) + 1;
            d60[constants_1.Planet.Ketu] = { rashi: ketuRashi, rashi_name: constants_1.RASHI_NAMES[ketuRashi - 1].en };
        }
        return d60;
    }
    addDaysToDateStr(dateStr, days) {
        const d = new Date(dateStr);
        d.setUTCDate(d.getUTCDate() + Math.round(days));
        return d.toISOString().split("T")[0];
    }
    calcVimshottariDasha(moonNakIndex, degInNak, birthDate) {
        const nakLen = 360.0 / 27.0;
        const elapsed = degInNak / nakLen;
        const birthLord = constants_1.NAKSHATRAS[moonNakIndex % 27].lord;
        const lordPos = constants_1.DASHA_ORDER.indexOf(birthLord);
        const totalYears = constants_1.DASHA_YEARS[birthLord];
        const elapsedYears = totalYears * elapsed;
        const yearsLeft = totalYears - elapsedYears;
        const dashas = [];
        const dobStr = new Date(birthDate).toISOString().split("T")[0];
        // Theoretical start of the first dasha
        const theoreticalStart = this.addDaysToDateStr(dobStr, -elapsedYears * 365.25);
        let curDate = dobStr;
        let endDate = this.addDaysToDateStr(curDate, yearsLeft * 365.25);
        const firstDasha = {
            planet: birthLord,
            start: curDate,
            end: endDate,
            years: Number(yearsLeft.toFixed(4)),
            antardashas: this.calcAntardasha(birthLord, theoreticalStart, dobStr),
        };
        dashas.push(firstDasha);
        curDate = endDate;
        for (let i = 1; i <= 8; i++) {
            const lord = constants_1.DASHA_ORDER[(lordPos + i) % 9];
            const years = constants_1.DASHA_YEARS[lord];
            endDate = this.addDaysToDateStr(curDate, years * 365.25);
            dashas.push({
                planet: lord,
                start: curDate,
                end: endDate,
                years: years,
                antardashas: this.calcAntardasha(lord, curDate, curDate),
            });
            curDate = endDate;
        }
        return dashas;
    }
    calcAntardasha(mahaLord, theoreticalStart, clampDate) {
        const totalYears = constants_1.DASHA_YEARS[mahaLord];
        const startPos = constants_1.DASHA_ORDER.indexOf(mahaLord);
        let theoreticalCurDate = new Date(theoreticalStart).toISOString().split("T")[0];
        const antardashas = [];
        for (let i = 0; i < 9; i++) {
            const lord = constants_1.DASHA_ORDER[(startPos + i) % 9];
            const antarYears = (totalYears * constants_1.DASHA_YEARS[lord]) / 120.0;
            const endDate = this.addDaysToDateStr(theoreticalCurDate, antarYears * 365.25);
            if (new Date(endDate) > new Date(clampDate)) {
                let actualStart = theoreticalCurDate;
                if (new Date(theoreticalCurDate) < new Date(clampDate)) {
                    actualStart = clampDate;
                }
                const diffDays = (new Date(endDate).getTime() - new Date(actualStart).getTime()) / 86400000;
                const actualYears = diffDays / 365.25;
                antardashas.push({
                    planet: lord,
                    start: actualStart,
                    end: endDate,
                    years: Number(actualYears.toFixed(4)),
                    pratyantara_dashas: this.calcPratyantara(mahaLord, lord, theoreticalCurDate, clampDate),
                });
            }
            theoreticalCurDate = endDate;
        }
        return antardashas;
    }
    calcPratyantara(mahaLord, antarLord, theoreticalStart, clampDate) {
        const mahaTotalYears = constants_1.DASHA_YEARS[mahaLord];
        const antarTotalYears = (mahaTotalYears * constants_1.DASHA_YEARS[antarLord]) / 120.0;
        const startPos = constants_1.DASHA_ORDER.indexOf(antarLord);
        let theoreticalCurDate = new Date(theoreticalStart).toISOString().split("T")[0];
        const pratyantaras = [];
        for (let i = 0; i < 9; i++) {
            const lord = constants_1.DASHA_ORDER[(startPos + i) % 9];
            const pratDays = Math.round((antarTotalYears * 365.25 * constants_1.DASHA_YEARS[lord]) / 120.0);
            const endDate = this.addDaysToDateStr(theoreticalCurDate, pratDays);
            if (new Date(endDate) > new Date(clampDate)) {
                let actualStart = theoreticalCurDate;
                if (new Date(theoreticalCurDate) < new Date(clampDate)) {
                    actualStart = clampDate;
                }
                const actualDays = Math.round((new Date(endDate).getTime() - new Date(actualStart).getTime()) / 86400000);
                pratyantaras.push({
                    planet: lord,
                    start: actualStart,
                    end: endDate,
                    days: actualDays,
                });
            }
            theoreticalCurDate = endDate;
        }
        return pratyantaras;
    }
    calcPanchanga(sunLon, moonLon) {
        const diff = this.fmod360(moonLon - sunLon);
        const tithi = Math.floor(diff / 12) + 1;
        const tithiNames = [
            "",
            "Pratipada",
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
            "Dwadashi",
            "Trayodashi",
            "Chaturdashi",
            "Purnima",
            "K.Pratipada",
            "K.Dvitiya",
            "K.Tritiya",
            "K.Chaturthi",
            "K.Panchami",
            "K.Shashthi",
            "K.Saptami",
            "K.Ashtami",
            "K.Navami",
            "K.Dashami",
            "K.Ekadashi",
            "K.Dwadashi",
            "K.Trayodashi",
            "K.Chaturdashi",
            "Amavasya",
        ];
        const yogaIdx = Math.floor(this.fmod360(sunLon + moonLon) / (360 / 27.0));
        const yogaNames = [
            "Vishkambha",
            "Priti",
            "Ayushman",
            "Saubhagya",
            "Shobhana",
            "Atiganda",
            "Sukarman",
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
        const kIndex = Math.floor(diff / 6);
        const movableKaranas = [
            "Bava",
            "Balava",
            "Kaulava",
            "Taitila",
            "Gara",
            "Vanija",
            "Vishti",
        ];
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
            karanaName = movableKaranas[(kIndex - 1) % 7];
        const varaNames = [
            "Ravivara",
            "Somavara",
            "Mangalavara",
            "Budhavara",
            "Guruvara",
            "Shukravara",
            "Shanivara",
        ];
        const vara = Math.floor(this.julianDay + 1.5) % 7;
        const paksha = diff < 180 ? "Shukla (Waxing)" : "Krishna (Waning)";
        const moonNak = this.getNakInfo(moonLon);
        return {
            tithi: tithiNames[tithi] ?? `Tithi ${tithi}`,
            tithi_number: tithi,
            paksha: paksha,
            yoga: yogaNames[Math.min(yogaIdx, 26)],
            karana: karanaName,
            vara: varaNames[vara],
            moon_nakshatra: moonNak.nakshatra,
            moon_pada: moonNak.pada,
        };
    }
    calcShadabala(planets, lagnaRashi) {
        const exaltDeg = {
            [constants_1.Planet.Sun]: 10,
            [constants_1.Planet.Moon]: 33,
            [constants_1.Planet.Mars]: 298,
            [constants_1.Planet.Mercury]: 165,
            [constants_1.Planet.Jupiter]: 95,
            [constants_1.Planet.Venus]: 357,
            [constants_1.Planet.Saturn]: 200,
            [constants_1.Planet.Rahu]: 60,
            [constants_1.Planet.Ketu]: 240,
        };
        const exaltRashi = {
            [constants_1.Planet.Sun]: 1,
            [constants_1.Planet.Moon]: 2,
            [constants_1.Planet.Mars]: 10,
            [constants_1.Planet.Mercury]: 6,
            [constants_1.Planet.Jupiter]: 4,
            [constants_1.Planet.Venus]: 12,
            [constants_1.Planet.Saturn]: 7,
            [constants_1.Planet.Rahu]: 2,
            [constants_1.Planet.Ketu]: 8,
        };
        const debilRashi = {
            [constants_1.Planet.Sun]: 7,
            [constants_1.Planet.Moon]: 8,
            [constants_1.Planet.Mars]: 4,
            [constants_1.Planet.Mercury]: 12,
            [constants_1.Planet.Jupiter]: 10,
            [constants_1.Planet.Venus]: 6,
            [constants_1.Planet.Saturn]: 1,
            [constants_1.Planet.Rahu]: 8,
            [constants_1.Planet.Ketu]: 2,
        };
        const mtRashi = {
            [constants_1.Planet.Sun]: 5,
            [constants_1.Planet.Moon]: 2,
            [constants_1.Planet.Mars]: 1,
            [constants_1.Planet.Mercury]: 6,
            [constants_1.Planet.Jupiter]: 9,
            [constants_1.Planet.Venus]: 7,
            [constants_1.Planet.Saturn]: 11,
        };
        const ownRashi = {
            [constants_1.Planet.Sun]: [5],
            [constants_1.Planet.Moon]: [4],
            [constants_1.Planet.Mars]: [1, 8],
            [constants_1.Planet.Mercury]: [3, 6],
            [constants_1.Planet.Jupiter]: [9, 12],
            [constants_1.Planet.Venus]: [2, 7],
            [constants_1.Planet.Saturn]: [10, 11],
        };
        const natFriendScore = {
            [constants_1.Planet.Sun]: {
                [constants_1.Planet.Moon]: "friend",
                [constants_1.Planet.Mars]: "friend",
                [constants_1.Planet.Jupiter]: "friend",
                [constants_1.Planet.Mercury]: "neutral",
                [constants_1.Planet.Venus]: "enemy",
                [constants_1.Planet.Saturn]: "enemy",
                [constants_1.Planet.Rahu]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Moon]: {
                [constants_1.Planet.Sun]: "friend",
                [constants_1.Planet.Mercury]: "friend",
                [constants_1.Planet.Mars]: "neutral",
                [constants_1.Planet.Jupiter]: "neutral",
                [constants_1.Planet.Venus]: "neutral",
                [constants_1.Planet.Saturn]: "neutral",
                [constants_1.Planet.Rahu]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Mars]: {
                [constants_1.Planet.Sun]: "friend",
                [constants_1.Planet.Moon]: "friend",
                [constants_1.Planet.Jupiter]: "friend",
                [constants_1.Planet.Venus]: "neutral",
                [constants_1.Planet.Saturn]: "neutral",
                [constants_1.Planet.Mercury]: "enemy",
                [constants_1.Planet.Rahu]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Mercury]: {
                [constants_1.Planet.Sun]: "friend",
                [constants_1.Planet.Venus]: "friend",
                [constants_1.Planet.Rahu]: "neutral",
                [constants_1.Planet.Mars]: "neutral",
                [constants_1.Planet.Jupiter]: "neutral",
                [constants_1.Planet.Saturn]: "neutral",
                [constants_1.Planet.Moon]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Jupiter]: {
                [constants_1.Planet.Sun]: "friend",
                [constants_1.Planet.Moon]: "friend",
                [constants_1.Planet.Mars]: "friend",
                [constants_1.Planet.Saturn]: "neutral",
                [constants_1.Planet.Mercury]: "enemy",
                [constants_1.Planet.Venus]: "enemy",
                [constants_1.Planet.Rahu]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Venus]: {
                [constants_1.Planet.Mercury]: "friend",
                [constants_1.Planet.Saturn]: "friend",
                [constants_1.Planet.Mars]: "neutral",
                [constants_1.Planet.Jupiter]: "neutral",
                [constants_1.Planet.Rahu]: "neutral",
                [constants_1.Planet.Sun]: "enemy",
                [constants_1.Planet.Moon]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
            [constants_1.Planet.Saturn]: {
                [constants_1.Planet.Mercury]: "friend",
                [constants_1.Planet.Venus]: "friend",
                [constants_1.Planet.Rahu]: "friend",
                [constants_1.Planet.Jupiter]: "neutral",
                [constants_1.Planet.Sun]: "enemy",
                [constants_1.Planet.Moon]: "enemy",
                [constants_1.Planet.Mars]: "enemy",
                [constants_1.Planet.Ketu]: "enemy",
            },
        };
        const naisargikaStrength = {
            [constants_1.Planet.Sun]: 60,
            [constants_1.Planet.Moon]: 51.43,
            [constants_1.Planet.Venus]: 42.86,
            [constants_1.Planet.Jupiter]: 34.29,
            [constants_1.Planet.Mercury]: 25.71,
            [constants_1.Planet.Mars]: 17.14,
            [constants_1.Planet.Saturn]: 8.57,
            [constants_1.Planet.Rahu]: 5,
            [constants_1.Planet.Ketu]: 5,
        };
        const results = {};
        const grahas = [
            constants_1.Planet.Sun,
            constants_1.Planet.Moon,
            constants_1.Planet.Mars,
            constants_1.Planet.Mercury,
            constants_1.Planet.Jupiter,
            constants_1.Planet.Venus,
            constants_1.Planet.Saturn,
        ];
        for (const p of grahas) {
            const pData = planets[p];
            if (!pData)
                continue;
            let sthana = 0;
            const pRashi = pData.rashi;
            const uchhaFull = exaltDeg[p] ?? 0;
            const actualDeg = pData.longitude;
            const uchhaAngle = Math.min(this.fmod360(Math.abs(actualDeg - uchhaFull)), this.fmod360(360 - Math.abs(actualDeg - uchhaFull)));
            sthana += Math.max(0, (180 - uchhaAngle) / 3.0);
            if (pRashi === exaltRashi[p])
                sthana += 45;
            else if (mtRashi[p] === pRashi)
                sthana += 37.5;
            else if (ownRashi[p]?.includes(pRashi))
                sthana += 30;
            else if (pRashi === debilRashi[p])
                sthana += 0;
            else
                sthana += 15;
            const digBestHouse = {
                [constants_1.Planet.Sun]: 10,
                [constants_1.Planet.Moon]: 4,
                [constants_1.Planet.Mars]: 7,
                [constants_1.Planet.Mercury]: 1,
                [constants_1.Planet.Jupiter]: 10,
                [constants_1.Planet.Venus]: 4,
                [constants_1.Planet.Saturn]: 7,
            };
            const hDiff = Math.min(Math.abs(pData.house - (digBestHouse[p] ?? 1)), 12 - Math.abs(pData.house - (digBestHouse[p] ?? 1)));
            const digBala = Math.max(0, 60 - hDiff * 5);
            let kalaBala = 0;
            const isDay = true; // Based on traditional fallback default
            if ([constants_1.Planet.Sun, constants_1.Planet.Jupiter, constants_1.Planet.Saturn].includes(p))
                kalaBala += isDay ? 15 : 5;
            if ([constants_1.Planet.Moon, constants_1.Planet.Venus, constants_1.Planet.Mars].includes(p))
                kalaBala += isDay ? 5 : 15;
            if (p === constants_1.Planet.Mercury)
                kalaBala += 7.5;
            const tithiDiff = this.fmod360((planets[constants_1.Planet.Moon]?.longitude ?? 0) -
                (planets[constants_1.Planet.Sun]?.longitude ?? 0));
            const pakshaBala = tithiDiff < 180
                ? (tithiDiff / 180.0) * 60
                : ((360 - tithiDiff) / 180.0) * 60;
            kalaBala += [
                constants_1.Planet.Moon,
                constants_1.Planet.Mercury,
                constants_1.Planet.Jupiter,
                constants_1.Planet.Venus,
            ].includes(p)
                ? pakshaBala
                : 60 - pakshaBala;
            const mSpeed = {
                [constants_1.Planet.Sun]: 1.0,
                [constants_1.Planet.Moon]: 13.176,
                [constants_1.Planet.Mars]: 0.524,
                [constants_1.Planet.Mercury]: 1.383,
                [constants_1.Planet.Jupiter]: 0.083,
                [constants_1.Planet.Venus]: 1.6,
                [constants_1.Planet.Saturn]: 0.033,
            };
            const chestaBala = pData.retrograde
                ? 60
                : Math.min(60, (Math.abs(pData.speed) / Math.max(mSpeed[p] ?? 1.0, 0.001)) * 30);
            const naisargika = naisargikaStrength[p] ?? 15;
            let drigBala = 0;
            for (const asp of grahas) {
                if (asp === p || !planets[asp])
                    continue;
                const houseDiff = (planets[asp].house - pData.house + 12) % 12;
                let aspScore = houseDiff === 6
                    ? 1
                    : [2, 4, 8, 10].includes(houseDiff)
                        ? 0.5
                        : [3, 9].includes(houseDiff)
                            ? 0.75
                            : 0;
                const rel = natFriendScore[p]?.[asp] ?? "neutral";
                if (aspScore > 0)
                    drigBala +=
                        aspScore * (rel === "friend" ? 1 : rel === "enemy" ? -1 : 0) * 15;
            }
            drigBala = Math.max(0, drigBala + 30);
            const total = sthana + digBala + kalaBala + chestaBala + naisargika + drigBala;
            results[p] = {
                sthana_bala: Number(sthana.toFixed(2)),
                dig_bala: Number(digBala.toFixed(2)),
                kala_bala: Number(kalaBala.toFixed(2)),
                chesta_bala: Number(chestaBala.toFixed(2)),
                naisargika_bala: Number(naisargika.toFixed(2)),
                drig_bala: Number(drigBala.toFixed(2)),
                total_rupas: Number(total.toFixed(2)),
                virupas: Math.round(total * 60),
                strength: total >= 150 ? "Strong" : total >= 90 ? "Medium" : "Weak",
            };
        }
        return results;
    }
    static calcAshtakavarga(planets, lagnaRashi) {
        const beneficPositions = {
            Sun: {
                Sun: [1, 2, 4, 7, 8, 9, 10, 11],
                Moon: [3, 6, 10, 11],
                Mars: [1, 2, 4, 7, 8, 9, 10, 11],
                Mercury: [3, 5, 6, 9, 10, 11, 12],
                Jupiter: [5, 6, 9, 11],
                Venus: [6, 7, 12],
                Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
                Lagna: [3, 4, 6, 10, 11, 12],
            },
            Moon: {
                Sun: [3, 6, 7, 8, 10, 11],
                Moon: [1, 3, 6, 7, 10, 11],
                Mars: [2, 3, 5, 6, 9, 10, 11],
                Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
                Jupiter: [1, 4, 7, 8, 10, 11, 12],
                Venus: [3, 4, 5, 7, 9, 10, 11],
                Saturn: [3, 5, 6, 11],
                Lagna: [3, 6, 10, 11],
            },
            Mars: {
                Sun: [3, 5, 6, 10, 11],
                Moon: [3, 6, 11],
                Mars: [1, 2, 4, 7, 8, 10, 11],
                Mercury: [3, 5, 6, 11],
                Jupiter: [6, 10, 11, 12],
                Venus: [6, 8, 11, 12],
                Saturn: [1, 4, 7, 8, 9, 10, 11],
                Lagna: [1, 3, 6, 10, 11],
            },
            Mercury: {
                Sun: [5, 6, 9, 11, 12],
                Moon: [2, 4, 6, 8, 10, 11],
                Mars: [1, 2, 4, 7, 8, 9, 10, 11],
                Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
                Jupiter: [6, 8, 11, 12],
                Venus: [1, 2, 3, 4, 5, 8, 9, 11],
                Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
                Lagna: [1, 2, 4, 6, 8, 10, 11],
            },
            Jupiter: {
                Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
                Moon: [2, 5, 7, 9, 11],
                Mars: [1, 2, 4, 7, 8, 10, 11],
                Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
                Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
                Venus: [2, 5, 6, 9, 10, 11],
                Saturn: [3, 5, 6, 12],
                Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
            },
            Venus: {
                Sun: [8, 11, 12],
                Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
                Mars: [3, 4, 6, 9, 11, 12],
                Mercury: [3, 5, 6, 9, 11],
                Jupiter: [5, 8, 9, 10, 11],
                Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
                Saturn: [3, 4, 5, 8, 9, 10, 11],
                Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
            },
            Saturn: {
                Sun: [1, 2, 4, 7, 8, 10, 11],
                Moon: [3, 6, 11],
                Mars: [3, 5, 6, 10, 11, 12],
                Mercury: [6, 8, 9, 10, 11, 12],
                Jupiter: [5, 6, 11, 12],
                Venus: [6, 11, 12],
                Saturn: [3, 5, 6, 11],
                Lagna: [1, 3, 4, 6, 10, 11],
            },
        };
        const subjects = [
            "Sun",
            "Moon",
            "Mars",
            "Mercury",
            "Jupiter",
            "Venus",
            "Saturn",
        ];
        const sourceRashis = { Lagna: lagnaRashi };
        for (const subject of subjects)
            if (planets[subject])
                sourceRashis[subject] = planets[subject].rashi;
        const prastara = {};
        const sarva = {};
        for (let house = 1; house <= 12; house++)
            sarva[house] = { points: 0 };
        for (const subject of subjects) {
            prastara[subject] = {};
            for (let house = 1; house <= 12; house++)
                prastara[subject][house] = 0;
            for (const contributor of [
                "Sun",
                "Moon",
                "Mars",
                "Mercury",
                "Jupiter",
                "Venus",
                "Saturn",
                "Lagna",
            ]) {
                if (!(contributor in sourceRashis))
                    continue;
                const fromRashi = sourceRashis[contributor];
                const allowedOffsets = beneficPositions[subject]?.[contributor] || [];
                for (let house = 1; house <= 12; house++) {
                    if (allowedOffsets.includes(((house - fromRashi + 12) % 12) + 1)) {
                        prastara[subject][house]++;
                        sarva[house].points++;
                    }
                }
            }
        }
        const planetBeneficPoints = {};
        for (const subject of subjects)
            planetBeneficPoints[subject] =
                prastara[subject][sourceRashis[subject]] || 0;
        return {
            prastarashtakavarga: prastara,
            sarvashtakavarga: sarva,
            planet_benefic_pts: planetBeneficPoints,
        };
    }
}
exports.VedicAstroEngine = VedicAstroEngine;
