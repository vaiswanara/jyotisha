import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, "src", "locales");

// src/locales/ ఫోల్డర్‌లోని అన్ని .json ఫైల్స్ చదవడం
const files = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith(".json"));

const allKeys = new Set();
const fileKeysMap = {};
const emptyValuesMap = {};

// ప్రతి ఫైల్ చదివి కీస్ అన్నీ ఒక చోట చేర్చడం
files.forEach((file) => {
  const content = JSON.parse(
    fs.readFileSync(path.join(localesDir, file), "utf-8"),
  );
  const keys = Object.keys(content);
  fileKeysMap[file] = new Set(keys);
  emptyValuesMap[file] = [];

  keys.forEach((key) => {
    allKeys.add(key);
    // అనువాదం ఖాళీగా ఉందేమో చెక్ చేయడం
    if (typeof content[key] === "string" && content[key].trim() === "") {
      emptyValuesMap[file].push(key);
    }
  });
});

console.log(`\nమొత్తం కీవర్డ్స్ (Total unique keys): ${allKeys.size}\n`);

// ఏ ఫైల్‌లో ఏ కీ మిస్ అయ్యిందో చెక్ చేయడం
files.forEach((file) => {
  const missingKeys = [];
  allKeys.forEach((key) => {
    if (!fileKeysMap[file].has(key)) {
      missingKeys.push(key);
    }
  });

  let hasError = false;

  if (missingKeys.length > 0) {
    console.log(
      `❌ ${file} ఫైల్‌లో ${missingKeys.length} కీ(లు) మిస్ అయ్యాయి:`,
    );
    console.log(missingKeys.map((k) => `"${k}"`).join(", "));
    hasError = true;
  }

  if (emptyValuesMap[file].length > 0) {
    console.log(
      `⚠️ ${file} ఫైల్‌లో ${emptyValuesMap[file].length} కీ(ల)కు అనువాదం ఖాళీగా ఉంది (Empty values):`,
    );
    console.log(emptyValuesMap[file].map((k) => `"${k}"`).join(", "));
    hasError = true;
  }

  if (hasError) {
    console.log("--------------------------------------------------");
  } else {
    console.log(`✅ ${file} ఫైల్ పర్ఫెక్ట్‌గా ఉంది. (0 missing, 0 empty)`);
  }
});
