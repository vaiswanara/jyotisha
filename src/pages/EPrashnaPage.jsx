import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

const PETAL_AREAS = [
  {
    id: 1,
    coords:
      "1652,1190,1546,1149,1457,1128,1365,1096,1264,1064,1196,1037,1200,992,1204,945,1295,915,1414,877,1501,848,1591,824,1655,805,1729,828,1791,858,1859,896,1903,935,1941,984,1926,1022,1852,1086,1744,1151,1684,1181",
  },
  {
    id: 2,
    coords:
      "1172,1081,1189,1062,1244,1068,1304,1083,1376,1115,1425,1128,1502,1145,1578,1181,1640,1196,1688,1247,1714,1300,1735,1353,1757,1427,1763,1481,1691,1500,1638,1498,1576,1495,1495,1491,1421,1444,1366,1372,1306,1298,1232,1190,1178,1137,1155,1098",
  },
  {
    id: 3,
    coords:
      "1195,1175,1230,1219,1263,1258,1295,1300,1334,1347,1368,1391,1404,1449,1425,1502,1423,1583,1408,1631,1399,1693,1363,1744,1346,1769,1295,1759,1227,1718,1174,1674,1132,1638,1089,1595,1074,1515,1072,1444,1070,1351,1064,1291,1068,1194,1072,1119,1100,1109,1144,1094",
  },
  {
    id: 4,
    coords:
      "1059,1124,1062,1192,1051,1262,1055,1326,1061,1368,1061,1430,1066,1508,1068,1549,1049,1595,1025,1640,977,1691,898,1740,823,1776,772,1704,741,1616,724,1523,736,1476,790,1398,858,1300,919,1217,964,1153,1006,1107,1030,1109",
  },
  {
    id: 5,
    coords:
      "972,1060,987,1081,987,1109,917,1198,857,1270,800,1345,747,1434,707,1481,562,1512,498,1512,430,1512,390,1498,390,1438,405,1360,430,1285,469,1211,515,1187,649,1149,753,1107,874,1062,949,1043",
  },
  {
    id: 6,
    coords:
      "456,1177,364,1128,265,1064,207,996,228,958,296,896,358,852,433,822,498,809,569,830,647,848,743,884,826,915,898,939,953,954,953,994,955,1024,809,1069,736,1100,620,1136,517,1177",
  },
  {
    id: 7,
    coords:
      "458,754,413,684,392,595,386,514,399,487,464,480,522,486,602,482,673,508,721,531,762,595,809,654,836,701,879,752,919,805,955,856,983,892,951,935,836,899,677,845,520,795,479,773",
  },
  {
    id: 8,
    coords:
      "960,841,909,771,851,684,772,573,719,499,715,418,726,338,762,257,794,208,857,223,938,270,991,316,1061,393,1062,457,1059,574,1057,678,1057,767,1062,835,1053,864,1004,884",
  },
  {
    id: 9,
    coords:
      "1072,854,1072,760,1077,625,1083,501,1074,399,1123,340,1193,280,1247,249,1312,217,1340,212,1374,272,1402,350,1419,419,1429,484,1419,522,1336,625,1240,758,1181,845,1145,890,1079,864",
  },
  {
    id: 10,
    coords:
      "1164,888,1217,814,1306,703,1385,584,1453,501,1542,472,1659,459,1735,469,1756,480,1752,542,1737,641,1695,727,1655,790,1544,824,1425,862,1300,903,1200,935",
  },
];
const CENTER_AREA = {
  id: 0,
  coords:
    "994,935,1025,905,1077,894,1115,907,1159,935,1176,984,1159,1032,1121,1073,1049,1086,998,1062,974,1003,974,964",
};

const TRANSLATIONS = {
  kn: {
    title: "ಶ್ರೀ ಪ್ರಶ್ನಾ ಚಕ್ರ",
    select: "-- ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಆರಿಸಿ --",
    inst1: "ಭಗವಂತನನ್ನು ಸ್ಮರಿಸಿಕೊಂಡು ಈ ಕೆಳಗಿನ ಚಕ್ರದ ದಳಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    inst2: "ಪ್ರತಿಯೊಂದು ದಳವು ವಿಭಿನ್ನ ಫಲಿತಾಂಶವನ್ನು ನೀಡುತ್ತದೆ.",
    reset: "ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ",
    resultLbl: "ಫಲಿತಾಂಶ",
    noResult: "⚠️ ಫಲಿತಾಂಶ ಲಭ್ಯವಿಲ್ಲ",
    tapHint: "👆 ಚಕ್ರದ ದಳದ ಮೇಲೆ ಸ್ಪರ್ಶಿಸಿ",
    selectLabel: "ಪ್ರಶ್ನೆ ಆರಿಸಿ",
    startBtn: "ಪ್ರಾರಂಭಿಸಿ",
  },
  te: {
    title: "శ్రీ ప్రశ్నా చక్రం",
    select: "-- మీ ప్రశ్నను ఎంచుకోండి --",
    inst1: "భగవంతుని స్మరించుకుని ఈ క్రింది చక్ర దళాలపై క్లిక్ చేయండి.",
    inst2: "ప్రతి దళం విభిన్న ఫలితాన్ని ఇస్తుంది.",
    reset: "మరొక ప్రశ్న అడగండి",
    resultLbl: "ఫలితం",
    noResult: "⚠️ ఫలితం అందుబాటులో లేదు",
    tapHint: "👆 చక్ర దళంపై తాకండి",
    selectLabel: "ప్రశ్న ఎంచుకోండి",
    startBtn: "ప్రారంభించండి",
  },
  en: {
    title: "Sri Prashna Chakra",
    select: "-- Select your question --",
    inst1: "Remember the Almighty and click on the petals of the chakra below.",
    inst2: "Each petal gives a different result.",
    reset: "Ask another question",
    resultLbl: "Result",
    noResult: "⚠️ Result not available",
    tapHint: "👆 Tap on a chakra petal",
    selectLabel: "Choose Question",
    startBtn: "Start",
  },
};

export function EPrashnaPage({ logoUrl }) {
  const { i18n } = useTranslation();
  const langRaw = i18n.language || "en";
  let lang = langRaw.split("-")[0];
  if (!TRANSLATIONS[lang]) lang = "en";
  const T = TRANSLATIONS[lang];

  const [step, setStep] = useState(1);
  const [questionsData, setQuestionsData] = useState([]);
  const [database, setDatabase] = useState([]);
  const [selectedQNo, setSelectedQNo] = useState("");

  const [isSpinning, setIsSpinning] = useState(false);
  const [interactEnabled, setInteractEnabled] = useState(false);
  const [resultText, setResultText] = useState("");
  const [resultKarakaName, setResultKarakaName] = useState("");

  const imgRef = useRef(null);
  const [areasScale, setAreasScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${baseUrl}static/questions_info.json`).then((r) => r.json()),
      fetch(`${baseUrl}static/answers_info.json`).then((r) => r.json()),
    ])
      .then(([qData, aData]) => {
        setQuestionsData(qData);
        setDatabase(aData);
      })
      .catch((err) => console.error("Error loading JSON", err));
  }, []);

  const handleResize = () => {
    if (!imgRef.current || imgRef.current.clientWidth === 0) return;
    const img = imgRef.current;
    if (img.naturalWidth) {
      setAreasScale({
        x: img.clientWidth / img.naturalWidth,
        y: img.clientHeight / img.naturalHeight,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startChakraSpinSequence = () => {
    setIsSpinning(true);
    setInteractEnabled(false);
    setTimeout(() => {
      setIsSpinning(false);
      setInteractEnabled(true);
    }, 5000);
  };

  const startChakra = () => {
    setStep(2);
    setTimeout(() => {
      handleResize();
      startChakraSpinSequence();
    }, 50);
  };

  const resetApp = () => {
    setStep(1);
    setSelectedQNo("");
    setResultText("");
    setResultKarakaName("");
    setInteractEnabled(false);
    setIsSpinning(false);
  };

  const handleClick = (e, num) => {
    e.preventDefault();
    if (!interactEnabled) return;

    if (num === 0) {
      // Center dot clicked -> Re-spin
      startChakraSpinSequence();
      return;
    }

    const resultRow = database.find(
      (item) => item.Q_no === selectedQNo && parseInt(item.karaka_no) === num,
    );

    if (resultRow) {
      setResultKarakaName(resultRow.karaka_name);
      setResultText(
        resultRow.chakra_result[lang] || resultRow.chakra_result["kn"],
      );
    } else {
      setResultKarakaName("");
      setResultText(T.noResult);
    }
    setStep(3);
  };

  const getScaledCoords = (coordsStr) => {
    return coordsStr
      .split(",")
      .map((c, i) =>
        Math.round(c * (i % 2 === 0 ? areasScale.x : areasScale.y)),
      )
      .join(",");
  };

  const currentQData = questionsData.find((q) => q.Q_no === selectedQNo);

  return (
    <main
      className="page"
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <HoroscopeHeader
        logoUrl={logoUrl}
        title="e-PRASHNA"
        eyebrow="e-JYOTISHA"
      />

      <section
        className="workspace"
        style={{
          overflowY: "auto",
          flex: 1,
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            width: "100%",
            maxWidth: "650px",
            marginBottom: "20px",
          }}
        >
          <style>{`
            @keyframes glowPulse { 0%, 100% { text-shadow: 0 0 8px rgba(230, 126, 34, 0.3); } 50% { text-shadow: 0 0 15px rgba(230, 126, 34, 0.8); } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes chakraSpin { from { transform: rotate(0deg); } to { transform: rotate(1800deg); } }
          `}</style>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#7f8c8d",
                    marginBottom: "10px",
                  }}
                >
                  {T.selectLabel}
                </label>
                <select
                  value={selectedQNo}
                  onChange={(e) => setSelectedQNo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    outline: "none",
                    cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  <option value="">{T.select}</option>
                  {questionsData.map((q) => (
                    <option key={q.Q_no} value={q.Q_no}>
                      {q.Q_no}. {q.Chakra_Name[lang] || q.Chakra_Name["kn"]}
                    </option>
                  ))}
                </select>
              </div>

              {selectedQNo && currentQData && (
                <div
                  style={{
                    marginTop: "20px",
                    animation: "fadeInUp 0.4s ease-out",
                  }}
                >
                  <div
                    style={{
                      background: "#fdfefe",
                      border: "1px solid #dce6ee",
                      borderRadius: "8px",
                      padding: "18px",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      color: "#2c3e50",
                      marginBottom: "20px",
                    }}
                  >
                    {currentQData.Chakra_Meaning[lang] ||
                      currentQData.Chakra_Meaning["kn"]}
                  </div>
                  <button
                    onClick={startChakra}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #8e44ad, #732d91)",
                      color: "#fff",
                      border: "none",
                      padding: "16px 20px",
                      borderRadius: "8px",
                      fontSize: "17px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(142, 68, 173, 0.2)",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {T.startBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <div
                style={{
                  background: "#fdfefe",
                  border: "1px solid #dce6ee",
                  borderRadius: "8px",
                  padding: "15px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <span style={{ fontSize: "18px" }}>🙏</span>
                  <span>{T.inst1}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>🌸</span>
                  <span>{T.inst2}</span>
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "460px",
                  margin: "0 auto",
                  aspectRatio: "1 / 1",
                }}
              >
                <img
                  ref={imgRef}
                  src={`${import.meta.env.BASE_URL}icons/chakra.webp`}
                  alt="Sri Prashna Chakra"
                  useMap="#image-map"
                  onLoad={handleResize}
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    console.error("Image not found. Falling back to PNG.");
                    e.currentTarget.src = `${import.meta.env.BASE_URL}static/chakra.png`;
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "50%",
                    boxShadow: "0 10px 38px rgba(74, 20, 0, 0.28)",
                    animation: isSpinning
                      ? "chakraSpin 5s cubic-bezier(0.1, 0.5, 0.2, 1)"
                      : "none",
                    pointerEvents: isSpinning ? "none" : "auto",
                    cursor: isSpinning ? "default" : "pointer",
                  }}
                />

                <map name="image-map">
                  {PETAL_AREAS.map((area) => (
                    <area
                      key={area.id}
                      shape="poly"
                      coords={getScaledCoords(area.coords)}
                      href="#"
                      onClick={(e) => handleClick(e, area.id)}
                      style={{ cursor: isSpinning ? "default" : "pointer" }}
                    />
                  ))}
                  <area
                    shape="poly"
                    coords={getScaledCoords(CENTER_AREA.coords)}
                    href="#"
                    onClick={(e) => handleClick(e, 0)}
                    style={{ cursor: isSpinning ? "default" : "pointer" }}
                  />
                </map>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  color: "#7f8c8d",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                {isSpinning
                  ? "♻️ Chakra is spinning... Please wait."
                  : T.tapHint}
              </p>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #dce6ee",
                  borderRadius: "12px",
                  padding: "30px 20px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #8e44ad, #3498db)",
                  }}
                ></div>

                <div
                  style={{
                    fontSize: "14.5px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#7f8c8d",
                    marginBottom: "20px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ flex: 1, height: "1px", background: "#eaeaea" }}
                  ></span>
                  {T.resultLbl}
                  <span
                    style={{ flex: 1, height: "1px", background: "#eaeaea" }}
                  ></span>
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    lineHeight: "1.8",
                    color: "#2c3e50",
                    textAlign: "center",
                  }}
                >
                  {resultKarakaName && (
                    <strong
                      style={{
                        color: "#8e44ad",
                        fontSize: "1.2em",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      {resultKarakaName}
                    </strong>
                  )}
                  <span>{resultText}</span>
                </div>
              </div>

              <button
                onClick={resetApp}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #8e44ad, #732d91)",
                  color: "#fff",
                  border: "none",
                  padding: "16px 20px",
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(142, 68, 173, 0.2)",
                  marginTop: "25px",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {T.reset}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
