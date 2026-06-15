export const NAKSHATRAS = [
  { n: 1, name: "Ashwini", gana: "Deva", nadi: "Aadi", yoni: "Horse" },
  { n: 2, name: "Bharani", gana: "Manushya", nadi: "Madhya", yoni: "Elephant" },
  { n: 3, name: "Krittika", gana: "Rakshasa", nadi: "Antya", yoni: "Sheep" },
  { n: 4, name: "Rohini", gana: "Manushya", nadi: "Aadi", yoni: "Serpent" },
  { n: 5, name: "Mrigashira", gana: "Deva", nadi: "Madhya", yoni: "Serpent" },
  { n: 6, name: "Arudra", gana: "Manushya", nadi: "Antya", yoni: "Dog" },
  { n: 7, name: "Punarvasu", gana: "Deva", nadi: "Aadi", yoni: "Cat" },
  { n: 8, name: "Pushya", gana: "Deva", nadi: "Madhya", yoni: "Sheep" },
  { n: 9, name: "Ashlesha", gana: "Rakshasa", nadi: "Antya", yoni: "Cat" },
  { n: 10, name: "Magha", gana: "Rakshasa", nadi: "Aadi", yoni: "Rat" },
  {
    n: 11,
    name: "Purva Phalguni",
    gana: "Manushya",
    nadi: "Madhya",
    yoni: "Rat",
  },
  {
    n: 12,
    name: "Uttara Phalguni",
    gana: "Manushya",
    nadi: "Antya",
    yoni: "Cow",
  },
  { n: 13, name: "Hasta", gana: "Deva", nadi: "Aadi", yoni: "Buffalo" },
  { n: 14, name: "Chitra", gana: "Rakshasa", nadi: "Madhya", yoni: "Tiger" },
  { n: 15, name: "Swati", gana: "Deva", nadi: "Antya", yoni: "Buffalo" },
  { n: 16, name: "Vishakha", gana: "Rakshasa", nadi: "Aadi", yoni: "Tiger" },
  { n: 17, name: "Anuradha", gana: "Deva", nadi: "Madhya", yoni: "Deer" },
  { n: 18, name: "Jyeshtha", gana: "Rakshasa", nadi: "Antya", yoni: "Deer" },
  { n: 19, name: "Mula", gana: "Rakshasa", nadi: "Aadi", yoni: "Dog" },
  {
    n: 20,
    name: "Purva Ashadha",
    gana: "Manushya",
    nadi: "Madhya",
    yoni: "Monkey",
  },
  {
    n: 21,
    name: "Uttara Ashadha",
    gana: "Manushya",
    nadi: "Antya",
    yoni: "Mongoose",
  },
  { n: 22, name: "Shravana", gana: "Deva", nadi: "Aadi", yoni: "Monkey" },
  { n: 23, name: "Dhanishta", gana: "Rakshasa", nadi: "Madhya", yoni: "Lion" },
  {
    n: 24,
    name: "Shatabhisha",
    gana: "Rakshasa",
    nadi: "Antya",
    yoni: "Horse",
  },
  {
    n: 25,
    name: "Purva Bhadrapada",
    gana: "Manushya",
    nadi: "Aadi",
    yoni: "Lion",
  },
  {
    n: 26,
    name: "Uttara Bhadrapada",
    gana: "Manushya",
    nadi: "Madhya",
    yoni: "Cow",
  },
  { n: 27, name: "Revati", gana: "Deva", nadi: "Antya", yoni: "Elephant" },
];

const RASHI_NAMES = [
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
];
const RASHI_LORDS = [
  null,
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

const YONI_MAP = {
  Horse: "Ashwa",
  Elephant: "Gaja",
  Sheep: "Mesha",
  Serpent: "Sarpa",
  Dog: "Shwana",
  Cat: "Marjara",
  Rat: "Mushaka",
  Cow: "Govu",
  Buffalo: "Mahisha",
  Tiger: "Vyaghra",
  Deer: "Mriga",
  Monkey: "Vanara",
  Mongoose: "Nakula",
  Lion: "Simha",
};

const YONI_FRIENDS = {
  Horse: "Horse",
  Elephant: "Elephant",
  Sheep: "Sheep",
  Serpent: "Serpent",
  Dog: "Dog",
  Cat: "Cat",
  Rat: "Rat",
  Cow: "Cow",
  Buffalo: "Buffalo",
  Tiger: "Tiger",
  Deer: "Deer",
  Monkey: "Monkey",
  Mongoose: "Lion",
  Lion: "Mongoose",
};
const YONI_ENEMIES = {
  Horse: "Buffalo",
  Buffalo: "Horse",
  Dog: "Deer",
  Deer: "Dog",
  Rat: "Cat",
  Cat: "Rat",
  Cow: "Tiger",
  Tiger: "Cow",
  Elephant: "Lion",
  Lion: "Elephant",
  Sheep: "Mongoose",
  Mongoose: "Sheep",
  Monkey: "Serpent",
  Serpent: "Monkey",
};

const PLANET_REL = {
  Sun: { Moon: 1, Mars: 1, Jupiter: 1, Mercury: 0, Venus: -1, Saturn: -1 },
  Moon: { Sun: 1, Mercury: 1, Mars: 0, Jupiter: 0, Venus: 0, Saturn: 0 },
  Mars: { Sun: 1, Moon: 1, Jupiter: 1, Venus: 0, Saturn: 0, Mercury: -1 },
  Mercury: { Sun: 1, Venus: 1, Mars: 0, Jupiter: 0, Saturn: 0, Moon: -1 },
  Jupiter: { Sun: 1, Moon: 1, Mars: 1, Saturn: 0, Mercury: -1, Venus: -1 },
  Venus: { Mercury: 1, Saturn: 1, Mars: 0, Jupiter: 0, Sun: -1, Moon: -1 },
  Saturn: { Mercury: 1, Venus: 1, Jupiter: 0, Sun: -1, Moon: -1, Mars: -1 },
};

const TARA_GOOD = new Set([2, 4, 6, 8, 9]);
const TARA_NAMES = [
  "",
  "Janma",
  "Sampat",
  "Vipat",
  "Kshema",
  "Pratyari",
  "Sadhaka",
  "Vadha",
  "Mitra",
  "Parama Mitra"
];

const VARNA_MAP = {
  1: "Kshatriya",
  2: "Vaishya",
  3: "Shudra",
  4: "Brahmin",
  5: "Kshatriya",
  6: "Vaishya",
  7: "Shudra",
  8: "Brahmin",
  9: "Kshatriya",
  10: "Vaishya",
  11: "Shudra",
  12: "Brahmin",
};
const VARNA_RANK = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
const VASHYA_MAP = {
  1: "Chatushpada",
  2: "Chatushpada",
  3: "Manava",
  4: "Jalachara",
  5: "Vanachara",
  6: "Manava",
  7: "Manava",
  8: "Keeta",
  9: "Manava",
  10: "Chatushpada",
  11: "Manava",
  12: "Jalachara",
};

function normalizeNakshatra(name) {
  const key = String(name || "")
    .trim()
    .toLowerCase();
  const aliases = {
    ardra: "Arudra",
    arudra: "Arudra",
    dhanishtha: "Dhanishta",
    dhanishta: "Dhanishta",
    "purva bhadra": "Purva Bhadrapada",
    "uttara bhadra": "Uttara Bhadrapada",
  };
  const target =
    aliases[key] || NAKSHATRAS.find((n) => n.name.toLowerCase() === key)?.name;
  return NAKSHATRAS.find((n) => n.name === target) || null;
}

function getRashi(nakNum, pada) {
  return Math.ceil(((nakNum - 1) * 4 + pada) / 9);
}

function getAmshaNadi(nak, pada) {
  const idx = NAKSHATRAS.findIndex(
    (n) => n.name.toLowerCase() === nak.toLowerCase(),
  );
  if (idx === -1) return null;
  const group = idx % 3;
  if (group === 0) return ["Aadi", "Madhya", "Antya", "Antya"][pada - 1];
  if (group === 1) return ["Madhya", "Aadi", "Aadi", "Madhya"][pada - 1];
  if (group === 2) return ["Antya", "Antya", "Madhya", "Aadi"][pada - 1];
  return null;
}

function calcMaitriScore(l1, l2) {
  if (!l1 || !l2) return 0;
  if (l1 === l2) return 5;
  const r1 = PLANET_REL[l1]?.[l2] ?? 0;
  const r2 = PLANET_REL[l2]?.[l1] ?? 0;
  if (r1 === 1 && r2 === 1) return 5;
  if ((r1 === 1 && r2 === 0) || (r1 === 0 && r2 === 1)) return 4;
  if (r1 === 0 && r2 === 0) return 3;
  if ((r1 === 1 && r2 === -1) || (r1 === -1 && r2 === 1)) return 1;
  if ((r1 === 0 && r2 === -1) || (r1 === -1 && r2 === 0)) return 0.5;
  return 0;
}

const sanskritPlanets = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Kuja",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
};

export function calculateAshtakuta(apiData, t) {
  const boyNakStr = apiData.boy?.moon?.nakshatra;
  const boyPada = parseInt(apiData.boy?.moon?.pada || 1, 10);

  const girlNakStr = apiData.girl?.moon?.nakshatra;
  const girlPada = parseInt(apiData.girl?.moon?.pada || 1, 10);

  const bMeta = normalizeNakshatra(boyNakStr);
  const gMeta = normalizeNakshatra(girlNakStr);

  if (!bMeta || !gMeta) return null;

  const boyD9Rashi = apiData.boy?.chart?.navamsa_d9?.Moon?.rashi || (((bMeta.n - 1) * 4 + (boyPada - 1)) % 12 + 1);
  const girlD9Rashi = apiData.girl?.chart?.navamsa_d9?.Moon?.rashi || (((gMeta.n - 1) * 4 + (girlPada - 1)) % 12 + 1);

  const bRashi = getRashi(bMeta.n, boyPada);
  const gRashi = getRashi(gMeta.n, girlPada);

  const kutas = [];
  const exceptions = [];
  let totalScore = 0;

  // 1. Varna (1 point)
  const bVarna = VARNA_MAP[bRashi];
  const gVarna = VARNA_MAP[gRashi];
  const bVarnaRank = VARNA_RANK[bVarna] || 1;
  const gVarnaRank = VARNA_RANK[gVarna] || 1;
  const varnaScore = bVarnaRank >= gVarnaRank ? 1 : 0;
  kutas.push({
    name: "Varna",
    what: "Work & Spiritual Compatibility",
    max: 1,
    score: varnaScore,
    boyVal: t ? t(bVarna) : bVarna,
    girlVal: t ? t(gVarna) : gVarna,
  });

  // 2. Vashya (2 points)
  const bVashya = VASHYA_MAP[bRashi];
  const gVashya = VASHYA_MAP[gRashi];
  let vashyaScore = 0;
  if (bVashya === gVashya) vashyaScore = 2;
  else if (
    (bVashya === "Manava" && gVashya === "Jalachara") ||
    (bVashya === "Jalachara" && gVashya === "Manava")
  )
    vashyaScore = 1;
  kutas.push({
    name: "Vashya",
    what: "Dominance & Influence",
    max: 2,
    score: vashyaScore,
    boyVal: t ? t(bVashya) : bVashya,
    girlVal: t ? t(gVashya) : gVashya,
  });

  // 3. Tara (3 points)
  const fwd = ((gMeta.n - bMeta.n + 27) % 27) + 1;
  const bwd = ((bMeta.n - gMeta.n + 27) % 27) + 1;
  const boyTara = ((fwd - 1) % 9) + 1;
  const girlTara = ((bwd - 1) % 9) + 1;
  const bTaraGood = TARA_GOOD.has(boyTara);
  const gTaraGood = TARA_GOOD.has(girlTara);
  const taraScore =
    bTaraGood && gTaraGood ? 3 : bTaraGood || gTaraGood ? 1.5 : 0;
  kutas.push({
    name: "Tara",
    what: "Destiny & Health",
    max: 3,
    score: taraScore,
    boyVal: t ? t(TARA_NAMES[boyTara]) : TARA_NAMES[boyTara],
    girlVal: t ? t(TARA_NAMES[girlTara]) : TARA_NAMES[girlTara],
  });

  // 4. Yoni (4 points)
  const bYoniSan = YONI_MAP[bMeta.yoni] || bMeta.yoni;
  const gYoniSan = YONI_MAP[gMeta.yoni] || gMeta.yoni;
  let yoniScore = 2;
  if (bMeta.yoni === gMeta.yoni) yoniScore = 4;
  else if (
    YONI_FRIENDS[bMeta.yoni] === gMeta.yoni ||
    YONI_FRIENDS[gMeta.yoni] === bMeta.yoni
  )
    yoniScore = 3;
  else if (
    YONI_ENEMIES[bMeta.yoni] === gMeta.yoni ||
    YONI_ENEMIES[gMeta.yoni] === bMeta.yoni
  )
    yoniScore = 0;
  kutas.push({
    name: "Yoni",
    what: "Physical Compatibility",
    max: 4,
    score: yoniScore,
    boyVal: t ? t(bYoniSan) : bYoniSan,
    girlVal: t ? t(gYoniSan) : gYoniSan,
  });

  // 5. Graha Maitri (5 points)
  const bLord = RASHI_LORDS[bRashi];
  const gLord = RASHI_LORDS[gRashi];
  const maitriScore = calcMaitriScore(bLord, gLord);
  let maitriBVal = t ? t(bLord) : bLord;
  let maitriGVal = t ? t(gLord) : gLord;
  let maitriScoreDisplay = maitriScore;

  if (maitriScore < 3 && boyD9Rashi && girlD9Rashi) {
    const bD9Lord = RASHI_LORDS[boyD9Rashi];
    const gD9Lord = RASHI_LORDS[girlD9Rashi];
    const amshaScore = calcMaitriScore(bD9Lord, gD9Lord);
    maitriBVal += `<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${t ? t(bD9Lord) : bD9Lord})</span>`;
    maitriGVal += `<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${t ? t(gD9Lord) : gD9Lord})</span>`;
    maitriScoreDisplay += `<br><span style="font-size:0.8rem; color:#27ae60;">(Amsha: ${amshaScore})</span>`;
    if (amshaScore >= 4) {
      exceptions.push(
        `<strong>Amsha Maitri:</strong> Navamsha Moon-sign lords (${sanskritPlanets[bD9Lord]} and ${sanskritPlanets[gD9Lord]}) are friendly.`,
      );
    }
  }
  kutas.push({
    name: "Graha Maitri",
    what: "Mental Compatibility",
    max: 5,
    score: maitriScore,
    scoreDisplay: maitriScoreDisplay,
    boyVal: maitriBVal,
    girlVal: maitriGVal,
  });

  // 6. Gana (6 points)
  let ganaScore = 0;
  if (bMeta.gana === gMeta.gana) ganaScore = 6;
  else if (bMeta.gana === "Deva" && gMeta.gana === "Manushya") ganaScore = 5;
  else if (bMeta.gana === "Manushya" && gMeta.gana === "Deva") ganaScore = 4;
  kutas.push({
    name: "Gana",
    what: "Nature & Temperament",
    max: 6,
    score: ganaScore,
    boyVal: t ? t(bMeta.gana) : bMeta.gana,
    girlVal: t ? t(gMeta.gana) : gMeta.gana,
  });

  // 7. Bhakoot (7 points)
  const distFwd = ((gRashi - bRashi + 12) % 12) + 1;
  const distBwd = ((bRashi - gRashi + 12) % 12) + 1;
  const badPairs = [
    [2, 12],
    [5, 9],
    [6, 8],
  ];
  const isBadBhakoot =
    bRashi !== gRashi &&
    badPairs.some(
      ([a, b]) =>
        (distFwd === a && distBwd === b) || (distFwd === b && distBwd === a),
    );
  let bhakootScore = bRashi === gRashi || !isBadBhakoot ? 7 : 0;
  if (isBadBhakoot && (bLord === gLord || maitriScore >= 4)) {
    const lordName = bLord === gLord ? (sanskritPlanets[bLord] || bLord) : `${sanskritPlanets[bLord] || bLord} & ${sanskritPlanets[gLord] || gLord}`;
    exceptions.push(
      `<strong>Bhakoot Dosha Cancellation:</strong> Cancelled because sign lords (${lordName}) are friendly or identical.`,
    );
    bhakootScore = 7;
  }
  kutas.push({
    name: "Bhakoot",
    what: "Wealth & Harmony",
    max: 7,
    score: bhakootScore,
    boyVal: t ? t(RASHI_NAMES[bRashi]) : RASHI_NAMES[bRashi],
    girlVal: t ? t(RASHI_NAMES[gRashi]) : RASHI_NAMES[gRashi],
  });

  // 8. Nadi (8 points)
  const isNadiDosha = bMeta.nadi === gMeta.nadi;
  let nadiScore = isNadiDosha ? 0 : 8;
  let nadiBVal = t ? t(bMeta.nadi) : bMeta.nadi;
  let nadiGVal = t ? t(gMeta.nadi) : gMeta.nadi;

  if (isNadiDosha) {
    const bAmsha = getAmshaNadi(bMeta.name, boyPada);
    const gAmsha = getAmshaNadi(gMeta.name, girlPada);
    if (bAmsha && gAmsha) {
      nadiBVal += `<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${t ? t(bAmsha) : bAmsha})</span>`;
      nadiGVal += `<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${t ? t(gAmsha) : gAmsha})</span>`;
      if (bAmsha !== gAmsha) {
        exceptions.push(
          `<strong>Amsha Nadi:</strong> Boy and Girl share ${bMeta.nadi} Nadi, but their Pada-based Amsha Nadis are different (${bAmsha} vs ${gAmsha}).`,
        );
      }
    }
    
    // Cancellation rules
    if (bMeta.n === gMeta.n && boyPada === girlPada) {
      exceptions.push(
        `<strong>Same Nakshatra & Pada:</strong> Both share the same Nakshatra (${t ? t(bMeta.name) : bMeta.name}) and Pada (${boyPada}), meaning they share the same Nadi energy. Nadi Dosha cancellation is not applicable here, and a detailed chart match by an experienced astrologer is recommended.`,
      );
    } else if (bMeta.n === gMeta.n && boyPada !== girlPada) {
      exceptions.push(
        `<strong>Nadi Dosha Cancellation:</strong> Cancelled because they share the same Nakshatra (${t ? t(bMeta.name) : bMeta.name}) but have different quarters (Padas).`,
      );
      nadiScore = 8;
    } else if (bRashi !== gRashi && bLord === gLord) {
      exceptions.push(
        `<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis but identical Rashi lords (${sanskritPlanets[bLord] || bLord}).`,
      );
      nadiScore = 8;
    } else if (bRashi !== gRashi && maitriScore >= 4) {
      exceptions.push(
        `<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis and their Rashi lords (${sanskritPlanets[bLord] || bLord} and ${sanskritPlanets[gLord] || gLord}) are friendly.`,
      );
      nadiScore = 8;
    }
  }
  kutas.push({
    name: "Nadi",
    what: "Health & Progeny",
    max: 8,
    score: nadiScore,
    boyVal: nadiBVal,
    girlVal: nadiGVal,
  });

  kutas.forEach((k) => (totalScore += k.score));
  kutas.reverse();

  return {
    totalScore,
    maxScore: 36,
    percentage: Math.round((totalScore / 36) * 100),
    compatibility:
      totalScore >= 27
        ? "Excellent"
        : totalScore >= 18
          ? "Good"
          : totalScore >= 10
            ? "Average"
            : "Low",
    kutas,
    exceptions,
  };
}
