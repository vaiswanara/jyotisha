// Study Library Foundation - Demo Data & Abstraction Layer
// Designed for seamless transition to REST/DB API in future phases

export const STUDY_LANGUAGES = [
  {
    id: "kannada",
    slug: "kannada",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    icon: "📚",
    badge: "Active",
    description: "Structured Vedic studies, astrological principles, and philosophy in Kannada.",
    active: true,
    order: 1,
  },
  {
    id: "telugu",
    slug: "telugu",
    name: "Telugu",
    nativeName: "తెలుగు",
    icon: "📖",
    badge: "Active",
    description: "Structured Vedic studies, astrological principles, and philosophy in Telugu.",
    active: true,
    order: 2,
  },
];

export const STUDY_SUBJECTS = [
  // Kannada Subjects
  {
    id: "jyotisha-kn",
    slug: "jyotisha",
    languageSlug: "kannada",
    name: "Jyotisha",
    nativeName: "ಜ್ಯೋತಿಷ್ಯ",
    icon: "✨",
    description: "Foundational principles of Vedic Astrology, Planets, Rashis, and Bhavas.",
    totalCourses: 2,
    active: true,
    order: 1,
  },
  {
    id: "mana-shaastra-kn",
    slug: "mana-shaastra",
    languageSlug: "kannada",
    name: "Mana Shaastra",
    nativeName: "ಮನಃಶಾಸ್ತ್ರ",
    icon: "🧠",
    description: "Vedic Psychology, Mind Philosophy, and Consciousness studies.",
    totalCourses: 1,
    active: true,
    order: 2,
  },
  // Telugu Subjects
  {
    id: "jyotisha-te",
    slug: "jyotisha",
    languageSlug: "telugu",
    name: "Jyotisha",
    nativeName: "జ్యోతిషం",
    icon: "✨",
    description: "Foundational principles of Vedic Astrology, Planets, Rashis, and Bhavas.",
    totalCourses: 2,
    active: true,
    order: 1,
  },
  {
    id: "mana-shaastra-te",
    slug: "mana-shaastra",
    languageSlug: "telugu",
    name: "Mana Shaastra",
    nativeName: "మనఃశాస్త్రం",
    icon: "🧠",
    description: "Vedic Psychology, Mind Philosophy, and Consciousness studies.",
    totalCourses: 1,
    active: true,
    order: 2,
  },
];

export const STUDY_COURSES = [
  // Kannada -> Jyotisha
  {
    id: "c-kn-jyo-01",
    slug: "foundations-of-jyotisha",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    title: "Foundations of Jyotisha",
    nativeTitle: "ಜ್ಯೋತಿಷ್ಯ ಪ್ರವೇಶ (Foundations)",
    description: "Comprehensive introduction to astronomical basics, 12 Rashis, 9 Grahas, and calculation fundamentals.",
    level: "Beginner",
    estimatedHours: "8 Hours",
    totalChapters: 3,
    active: true,
    order: 1,
  },
  {
    id: "c-kn-jyo-02",
    slug: "houses-and-bhavas",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    title: "Houses and Bhavas",
    nativeTitle: "ಭಾವ ವಿಶ್ಲೇಷಣೆ (Houses & Bhavas)",
    description: "In-depth understanding of the 12 Bhavas, Karakatwas, Kendra, Trikona, and Dusthana houses.",
    level: "Intermediate",
    estimatedHours: "10 Hours",
    totalChapters: 3,
    active: true,
    order: 2,
  },
  // Kannada -> Mana Shaastra
  {
    id: "c-kn-ms-01",
    slug: "intro-to-mana-shaastra",
    languageSlug: "kannada",
    subjectSlug: "mana-shaastra",
    title: "Introduction to Mana Shaastra",
    nativeTitle: "ಮನಃಶಾಸ್ತ್ರ ಪರಿಚಯ (Mind Philosophy)",
    description: "Exploring Antahkarana, Manas, Buddhi, Chitta, Ahamkara, and the science of mental tranquility.",
    level: "Beginner",
    estimatedHours: "6 Hours",
    totalChapters: 2,
    active: true,
    order: 1,
  },
  // Telugu -> Jyotisha
  {
    id: "c-te-jyo-01",
    slug: "foundations-of-jyotisha",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    title: "Foundations of Jyotisha",
    nativeTitle: "జ్యోతిష్య ప్రవేశం (Foundations)",
    description: "Comprehensive introduction to astronomical basics, 12 Rashis, 9 Grahas, and calculation fundamentals.",
    level: "Beginner",
    estimatedHours: "8 Hours",
    totalChapters: 3,
    active: true,
    order: 1,
  },
  {
    id: "c-te-jyo-02",
    slug: "houses-and-bhavas",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    title: "Houses and Bhavas",
    nativeTitle: "భావ విశ్లేషణ (Houses & Bhavas)",
    description: "In-depth understanding of the 12 Bhavas, Karakatwas, Kendra, Trikona, and Dusthana houses.",
    level: "Intermediate",
    estimatedHours: "10 Hours",
    totalChapters: 3,
    active: true,
    order: 2,
  },
  // Telugu -> Mana Shaastra
  {
    id: "c-te-ms-01",
    slug: "intro-to-mana-shaastra",
    languageSlug: "telugu",
    subjectSlug: "mana-shaastra",
    title: "Introduction to Mana Shaastra",
    nativeTitle: "మనఃశాస్త్ర పరిచయం (Mind Philosophy)",
    description: "Exploring Antahkarana, Manas, Buddhi, Chitta, Ahamkara, and the science of mental tranquility.",
    level: "Beginner",
    estimatedHours: "6 Hours",
    totalChapters: 2,
    active: true,
    order: 1,
  },
];

export const STUDY_CHAPTERS = [
  // Kannada -> Foundations of Jyotisha
  {
    id: "ch-kn-jyo-01-01",
    courseId: "c-kn-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 1,
    title: "Chapter 1 — Introduction to Vedic Astrology",
    nativeTitle: "ಅಧ್ಯಾಯ ೧ — ಜ್ಯೋತಿಷ್ಯ ಶಾಸ್ತ್ರ ಪರಿಚಯ ಮತ್ತು ಇತಿಹಾಸ",
    summary: "Historical overview, Vedanga Jyotisha roots, and understanding the celestial sphere.",
    estimatedMinutes: 15,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-kn-jyo-01-02",
    courseId: "c-kn-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 2,
    title: "Chapter 2 — The Zodiac and the 12 Rashis",
    nativeTitle: "ಅಧ್ಯಾಯ ೨ — ರಾశి ಚಕ್ರ ಮತ್ತು ೧೨ ರಾశిಗಳ ಗುಣಲಕ್ಷಣಗಳು",
    summary: "Detailed breakdown of Aries to Pisces, elements, modalities, and rulers.",
    estimatedMinutes: 20,
    order: 2,
    status: "Published",
  },
  {
    id: "ch-kn-jyo-01-03",
    courseId: "c-kn-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 3,
    title: "Chapter 3 — Understanding the Grahas and Planetary Nature",
    nativeTitle: "ಅಧ್ಯಾಯ ೩ — ನವಗ್ರಹಗಳು ಮತ್ತು ಗ್ರಹ ಕಾರಕತ್ವಗಳು",
    summary: "Attributes, exaltation, debilitation, friendly, and enemy planetary relationships.",
    estimatedMinutes: 25,
    order: 3,
    status: "Published",
  },

  // Kannada -> Houses and Bhavas
  {
    id: "ch-kn-jyo-02-01",
    courseId: "c-kn-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 1,
    title: "Chapter 1 — The Ascendant and Tanu Bhava (1st House)",
    nativeTitle: "ಅಧ್ಯಾಯ ೧ — ಲಗ್ನ ಮತ್ತು ತನು ಭಾವ (ಪ್ರಥಮ ಭಾವ)",
    summary: "Significance of the 1st House, physical body, vitality, and life path.",
    estimatedMinutes: 18,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-kn-jyo-02-02",
    courseId: "c-kn-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 2,
    title: "Chapter 2 — Kendra and Trikona Houses (Pillars of Chart)",
    nativeTitle: "ಅಧ್ಯಾಯ ೨ — ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣ ಭಾವಗಳ ಮಹತ್ವ",
    summary: "The auspicious houses (1, 4, 7, 10 and 1, 5, 9) and Lakshmi-Vishnu sthanas.",
    estimatedMinutes: 22,
    order: 2,
    status: "Published",
  },
  {
    id: "ch-kn-jyo-02-03",
    courseId: "c-kn-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "kannada",
    subjectSlug: "jyotisha",
    chapterNumber: 3,
    title: "Chapter 3 — Dusthanas, Upachayas, and Marakas",
    nativeTitle: "ಅಧ್ಯಾಯ ೩ — ದುಃಸ್ಥಾನಗಳು, ಉಪಚಯ ಮತ್ತು ಮಾರಕ ಭಾವಗಳು",
    summary: "Handling complex houses (6, 8, 12) and growth houses (3, 6, 10, 11).",
    estimatedMinutes: 20,
    order: 3,
    status: "Published",
  },

  // Kannada -> Mana Shaastra
  {
    id: "ch-kn-ms-01-01",
    courseId: "c-kn-ms-01",
    courseSlug: "intro-to-mana-shaastra",
    languageSlug: "kannada",
    subjectSlug: "mana-shaastra",
    chapterNumber: 1,
    title: "Chapter 1 — Antahkarana Chatushtaya (The Fourfold Mind)",
    nativeTitle: "ಅಧ್ಯಾಯ ೧ — ಅಂತಃಕರಣ ಚತುಷ್ಟಯ (ಮನಸ್ಸು, ಬುದ್ಧಿ, ಚಿತ್ತ, ಅಹಂಕಾರ)",
    summary: "Understanding the Vedic model of human cognition and psychological makeup.",
    estimatedMinutes: 20,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-kn-ms-01-02",
    courseId: "c-kn-ms-01",
    courseSlug: "intro-to-mana-shaastra",
    languageSlug: "kannada",
    subjectSlug: "mana-shaastra",
    chapterNumber: 2,
    title: "Chapter 2 — The Tri-Gunas and Mental Temperament",
    nativeTitle: "ಅಧ್ಯಾಯ ೨ — ತ್ರಿಗುಣಗಳು ಮತ್ತು ಮಾನಸಿಕ ಸ್ವಭಾವ",
    summary: "Sattva, Rajas, Tamas in daily perception, habit loops, and emotional balance.",
    estimatedMinutes: 25,
    order: 2,
    status: "Published",
  },

  // Telugu -> Foundations of Jyotisha
  {
    id: "ch-te-jyo-01-01",
    courseId: "c-te-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 1,
    title: "Chapter 1 — Introduction to Vedic Astrology",
    nativeTitle: "అధ్యాయం 1 — జ్యోతిష్య శాస్త్ర పరిచయం మరియు మూల సూత్రాలు",
    summary: "Historical overview, Vedanga Jyotisha roots, and understanding the celestial sphere.",
    estimatedMinutes: 15,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-te-jyo-01-02",
    courseId: "c-te-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 2,
    title: "Chapter 2 — The Zodiac and the 12 Rashis",
    nativeTitle: "అధ్యాయం 2 — రాశి చక్రం మరియు 12 రాశుల లక్షణాలు",
    summary: "Detailed breakdown of Aries to Pisces, elements, modalities, and rulers.",
    estimatedMinutes: 20,
    order: 2,
    status: "Published",
  },
  {
    id: "ch-te-jyo-01-03",
    courseId: "c-te-jyo-01",
    courseSlug: "foundations-of-jyotisha",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 3,
    title: "Chapter 3 — Understanding the Grahas and Planetary Nature",
    nativeTitle: "అధ్యాయం 3 — నవగ్రహాలు మరియు గ్రహ కారకత్వాలు",
    summary: "Attributes, exaltation, debilitation, friendly, and enemy planetary relationships.",
    estimatedMinutes: 25,
    order: 3,
    status: "Published",
  },

  // Telugu -> Houses and Bhavas
  {
    id: "ch-te-jyo-02-01",
    courseId: "c-te-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 1,
    title: "Chapter 1 — The Ascendant and Tanu Bhava (1st House)",
    nativeTitle: "అధ్యాయం 1 — లగ్నం మరియు తను భావం (ప్రథమ భావం)",
    summary: "Significance of the 1st House, physical body, vitality, and life path.",
    estimatedMinutes: 18,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-te-jyo-02-02",
    courseId: "c-te-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 2,
    title: "Chapter 2 — Kendra and Trikona Houses (Pillars of Chart)",
    nativeTitle: "అధ్యాయం 2 — కేంద్ర మరియు త్రికోణ భావాల ప్రాముఖ్యత",
    summary: "The auspicious houses (1, 4, 7, 10 and 1, 5, 9) and Lakshmi-Vishnu sthanas.",
    estimatedMinutes: 22,
    order: 2,
    status: "Published",
  },
  {
    id: "ch-te-jyo-02-03",
    courseId: "c-te-jyo-02",
    courseSlug: "houses-and-bhavas",
    languageSlug: "telugu",
    subjectSlug: "jyotisha",
    chapterNumber: 3,
    title: "Chapter 3 — Dusthanas, Upachayas, and Marakas",
    nativeTitle: "అధ్యాయం 3 — దుఃస్థానాలు, ఉపచయ మరియు మారక భావాలు",
    summary: "Handling complex houses (6, 8, 12) and growth houses (3, 6, 10, 11).",
    estimatedMinutes: 20,
    order: 3,
    status: "Published",
  },

  // Telugu -> Mana Shaastra
  {
    id: "ch-te-ms-01-01",
    courseId: "c-te-ms-01",
    courseSlug: "intro-to-mana-shaastra",
    languageSlug: "telugu",
    subjectSlug: "mana-shaastra",
    chapterNumber: 1,
    title: "Chapter 1 — Antahkarana Chatushtaya (The Fourfold Mind)",
    nativeTitle: "అధ్యాయం 1 — అంతఃకరణ చతుష్టయం (మనస్సు, బుద్ధి, చిత్తం, అహంకారం)",
    summary: "Understanding the Vedic model of human cognition and psychological makeup.",
    estimatedMinutes: 20,
    order: 1,
    status: "Published",
  },
  {
    id: "ch-te-ms-01-02",
    courseId: "c-te-ms-01",
    courseSlug: "intro-to-mana-shaastra",
    languageSlug: "telugu",
    subjectSlug: "mana-shaastra",
    chapterNumber: 2,
    title: "Chapter 2 — The Tri-Gunas and Mental Temperament",
    nativeTitle: "అధ్యాయం 2 — త్రిగుణాలు మరియు మానసిక స్వభావం",
    summary: "Sattva, Rajas, Tamas in daily perception, habit loops, and emotional balance.",
    estimatedMinutes: 25,
    order: 2,
    status: "Published",
  },
];

// Demonstration data for Continue Learning section
export const DEMO_CONTINUE_LEARNING = [
  {
    id: "cont-01",
    courseTitle: "Foundations of Jyotisha",
    languageName: "Kannada",
    languageSlug: "kannada",
    subjectName: "Jyotisha",
    subjectSlug: "jyotisha",
    courseSlug: "foundations-of-jyotisha",
    currentChapterTitle: "Chapter 3 — Understanding the Grahas",
    currentChapterNumber: 3,
    progressPercent: 35,
    lastRead: "2 days ago",
  },
  {
    id: "cont-02",
    courseTitle: "Introduction to Mana Shaastra",
    languageName: "Telugu",
    languageSlug: "telugu",
    subjectName: "Mana Shaastra",
    subjectSlug: "mana-shaastra",
    courseSlug: "intro-to-mana-shaastra",
    currentChapterTitle: "Chapter 1 — Antahkarana Chatushtaya",
    currentChapterNumber: 1,
    progressPercent: 20,
    lastRead: "Yesterday",
  },
];

// Clean Service Helpers
export function getAllLanguages() {
  return STUDY_LANGUAGES.filter((l) => l.active).sort((a, b) => a.order - b.order);
}

export function getLanguageBySlug(slug) {
  if (!slug) return null;
  return STUDY_LANGUAGES.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getSubjectsByLanguage(languageSlug) {
  if (!languageSlug) return [];
  return STUDY_SUBJECTS.filter(
    (s) => s.languageSlug.toLowerCase() === languageSlug.toLowerCase() && s.active
  ).sort((a, b) => a.order - b.order);
}

export function getSubjectBySlug(languageSlug, subjectSlug) {
  if (!languageSlug || !subjectSlug) return null;
  return (
    STUDY_SUBJECTS.find(
      (s) =>
        s.languageSlug.toLowerCase() === languageSlug.toLowerCase() &&
        s.slug.toLowerCase() === subjectSlug.toLowerCase()
    ) || null
  );
}

export function getCoursesBySubject(languageSlug, subjectSlug) {
  if (!languageSlug || !subjectSlug) return [];
  return STUDY_COURSES.filter(
    (c) =>
      c.languageSlug.toLowerCase() === languageSlug.toLowerCase() &&
      c.subjectSlug.toLowerCase() === subjectSlug.toLowerCase() &&
      c.active
  ).sort((a, b) => a.order - b.order);
}

export function getCourseBySlug(languageSlug, subjectSlug, courseSlug) {
  if (!languageSlug || !subjectSlug || !courseSlug) return null;
  return (
    STUDY_COURSES.find(
      (c) =>
        c.languageSlug.toLowerCase() === languageSlug.toLowerCase() &&
        c.subjectSlug.toLowerCase() === subjectSlug.toLowerCase() &&
        c.slug.toLowerCase() === courseSlug.toLowerCase()
    ) || null
  );
}

export function getChaptersByCourse(languageSlug, subjectSlug, courseSlug) {
  if (!languageSlug || !subjectSlug || !courseSlug) return [];
  return STUDY_CHAPTERS.filter(
    (ch) =>
      ch.languageSlug.toLowerCase() === languageSlug.toLowerCase() &&
      ch.subjectSlug.toLowerCase() === subjectSlug.toLowerCase() &&
      ch.courseSlug.toLowerCase() === courseSlug.toLowerCase()
  ).sort((a, b) => a.order - b.order);
}

export function getContinueLearningItems() {
  return DEMO_CONTINUE_LEARNING;
}
