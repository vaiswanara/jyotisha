"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VedicAstroEngine_1 = require("./engine/VedicAstroEngine");
const constants_1 = require("./engine/constants");
// ఒక ఉదాహరణ జాతక వివరాలు (ఉదా: బెంగళూరు)
const year = 1982;
const month = 2; // February
const day = 16;
const hour = 12;
const minute = 15;
const timezone = 5.5; // IST
const latitude = 13.9716;
const longitude = 78.5946;
console.log(`\nTesting birth chart for: ${year}-${month}-${day} ${hour}:${minute} at Lat: ${latitude}, Lon: ${longitude}, TZ: ${timezone}`);
const engine = VedicAstroEngine_1.VedicAstroEngine.fromBirthData(year, month, day, hour, minute, timezone, "lahiri");
console.log(`Using Engine: ${engine.isUsingSwetest() ? "Swiss Ephemeris (Swetest)" : "Math Fallback"}`);
console.log(`Ayanamsha: ${engine.getAyanamshaName()} (${engine.getAyanamsha().toFixed(6)})`);
const planets = engine.calculateAll(latitude, longitude);
// భావాలు మరియు నవాంశ గణన
const lagnaRashi = planets[constants_1.Planet.Ascendant]?.rashi ?? 1;
const navamsa = engine.calcNavamsa(planets);
console.log("\n--- Planetary Positions ---");
const displayData = Object.entries(planets).map(([planet, data]) => ({
    Planet: planet,
    Longitude: data?.longitude.toFixed(4),
    Rashi: data?.rashi_name,
    Degree: data?.degree.toFixed(4),
    Nakshatra: `${data?.nakshatra} (P${data?.pada})`,
    Navamsa: navamsa[planet]?.rashi_name,
    Retrograde: data?.retrograde ? "Yes" : "No",
    Combust: data?.combust ? "Yes" : "No",
    House: data?.house,
}));
console.table(displayData);
// పంచాంగం వివరాలు
const sunLon = planets[constants_1.Planet.Sun]?.longitude ?? 0;
const moonLon = planets[constants_1.Planet.Moon]?.longitude ?? 0;
const panchanga = engine.calcPanchanga(sunLon, moonLon);
console.log("\n--- Panchanga Details ---");
console.log(`Tithi:      ${panchanga.tithi} (${panchanga.paksha})`);
console.log(`Vaara:      ${panchanga.vara}`);
console.log(`Nakshatra:  ${panchanga.moon_nakshatra} (Pada ${panchanga.moon_pada})`);
console.log(`Yoga:       ${panchanga.yoga}`);
console.log(`Karana:     ${panchanga.karana}`);
// వింశోత్తరి దశ వివరాలు (Vimshottari Dasha)
const moonData = planets[constants_1.Planet.Moon];
if (moonData) {
    const dobStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dashas = engine.calcVimshottariDasha(moonData.nak_index, moonData.deg_in_nak, dobStr);
    console.log("\n--- Dasha Balance ---");
    console.log(`${dashas[0].planet} Maha Dasha balance at birth: ${dashas[0].years} years`);
    console.log("\n--- Vimshottari Dasha (MahaDasha-Antardasha) ---");
    for (const md of dashas) {
        for (const ad of md.antardashas) {
            console.log(`${md.planet}-${ad.planet} (${ad.start} to ${ad.end})`);
        }
        console.log("-------------------------------------------------");
    }
}
console.log("\nTest Completed successfully!");
