import { VedicAstroEngine } from "./engine/VedicAstroEngine";
import { Planet } from "./engine/constants";

// ఒక ఉదాహరణ జాతక వివరాలు (ఉదా: బెంగళూరు)
const year = 2013;
const month = 4; // April
const day = 30;
const hour = 4;
const minute = 30;
const timezone = 5.5; // IST
const latitude = 13.9716;
const longitude = 78.5946;

console.log(
  `\nTesting birth chart for: ${year}-${month}-${day} ${hour}:${minute} at Lat: ${latitude}, Lon: ${longitude}, TZ: ${timezone}`,
);

const engine = VedicAstroEngine.fromBirthData(
  year,
  month,
  day,
  hour,
  minute,
  timezone,
  "lahiri",
);

console.log(
  `Using Engine: ${engine.isUsingSwetest() ? "Swiss Ephemeris (Swetest)" : "Math Fallback"}`,
);
console.log(
  `Ayanamsha: ${engine.getAyanamshaName()} (${engine.getAyanamsha().toFixed(6)})`,
);

const planets = engine.calculateAll(latitude, longitude);

// భావాలు మరియు నవాంశ గణన
const lagnaRashi = planets[Planet.Ascendant]?.rashi ?? 1;
const navamsa = engine.calcNavamsa(planets);

console.log("\n--- Planetary Positions ---");

const displayData = Object.entries(planets).map(([planet, data]) => ({
  Planet: planet,
  Longitude: data?.longitude.toFixed(4),
  Rashi: data?.rashi_name,
  Degree: data?.degree.toFixed(4),
  Nakshatra: `${data?.nakshatra} (P${data?.pada})`,
  Navamsa: navamsa[planet as Planet]?.rashi_name,
  Retrograde: data?.retrograde ? "Yes" : "No",
  Combust: data?.combust ? "Yes" : "No",
  House: data?.house,
}));

console.table(displayData);

// పంచాంగం వివరాలు
const sunLon = planets[Planet.Sun]?.longitude ?? 0;
const moonLon = planets[Planet.Moon]?.longitude ?? 0;
const panchanga = engine.calcPanchanga(sunLon, moonLon);

console.log("\n--- Panchanga Details ---");
console.log(`Tithi:      ${panchanga.tithi} (${panchanga.paksha})`);
console.log(`Vaara:      ${panchanga.vara}`);
console.log(
  `Nakshatra:  ${panchanga.moon_nakshatra} (Pada ${panchanga.moon_pada})`,
);
console.log(`Yoga:       ${panchanga.yoga}`);
console.log(`Karana:     ${panchanga.karana}`);

console.log("\nTest Completed successfully!");
