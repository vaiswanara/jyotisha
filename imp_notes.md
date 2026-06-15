Change D1 and D9 fpnt Size

Aa function lona ee values ni maarchandi:

- Planet Font Size: <text x="${x}" y="${y}" font-size="14"... loni 14 ni maarchandi.
- Lagna (Lg) Font Size: font-size="14" fill="#6c5ce7">Lg</text> loni 14 ni maarchandi.
- Line Spacing (Grahalu okadaani kinda okati unte gap): const rowHeight = 17; ee value ni penchithe lines madhya gap peruguthundi, taggisthe gap tagguthundi.
- Side-by-Side Spacing (Grahalu pakka pakkana unte gap): x = colIdx === 0 ? cx + cell / 2 - 16 : cx + cell / 2 + 16; loni 16 (minus inka plus) ni maarchithe grahalu horizontal gaa entha dooram lo undaalo set cheyochu.
- Retrograde (R) / Combust (C) Font Size: Vati daggara unna font-size="6.5" ni maarchi, pakkane unna x+10 inka y-5 lanti offsets thoo adjust chesukovachu.

మిత్రమా, మన అప్లికేషన్‌లోని అన్ని పేజీలకు సంబంధించిన లైవ్ URL ల పూర్తి జాబితా క్రింది పట్టికలో ఇవ్వబడింది.



App.jsx
 లోని 

activePage
 హ్యాండ్లర్ ఆధారంగా ఈ పారామీటర్స్ పని చేస్తాయి.

e-JYOTISHA లైవ్ పేజీల URL ల జాబితా:
పేజీ పేరు (Page Name)	URL పరామీటర్ (Parameter)	లైవ్ URL (Live URL)
Home (ఈ-జ్యోతిషం)	page=Home (లేదా ఏదీ ఇవ్వకున్నా)	https://vaiswanara.com/jyotisha/
Me (నా ప్రొఫైల్)	page=Me	https://vaiswanara.com/jyotisha/?page=Me
e-Jataka (ఈ-జాతకం)	page=e-Jataka	https://vaiswanara.com/jyotisha/?page=e-Jataka
e-Match (ఈ-పొంతన)	page=e-Match లేదా page=Match	https://vaiswanara.com/jyotisha/?page=e-Match
e-Panchanga (ఈ-पंचాంగం)	page=e-Panchanga	https://vaiswanara.com/jyotisha/?page=e-Panchanga
e-Prashna (ఈ-ప్రశ్న)	page=EPrashna లేదా page=echakra	https://vaiswanara.com/jyotisha/?page=EPrashna
Astro Clock (ఆస్ట్రో క్లాక్)	page=EClock లేదా page=e-Clock	https://vaiswanara.com/jyotisha/?page=e-Clock
e-Eclipse (ఈ-గ్రహణం)	page=e-Eclipse	https://vaiswanara.com/jyotisha/?page=e-Eclipse
Profiles (జాతక ప్రొఫైల్స్)	page=Profiles	https://vaiswanara.com/jyotisha/?page=Profiles
e-PATA (ఈ-పాఠాలు)	page=e-PATA	https://vaiswanara.com/jyotisha/?page=e-PATA
Messages (సందేశాలు)	page=Messages	https://vaiswanara.com/jyotisha/?page=Messages
User Guide (యూజర్ గైడ్)	page=Help	https://vaiswanara.com/jyotisha/?page=Help
Settings (సెట్టింగ్స్)	page=Settings	https://vaiswanara.com/jyotisha/?page=Settings
Donate / Support (సహకారం)	page=e-Support	https://vaiswanara.com/jyotisha/?page=e-Support
Install App (ఇన్‌స్టాల్ యాప్)	page=e-Install	https://vaiswanara.com/jyotisha/?page=e-Install
Feedback (అభిప్రాయం)	page=Feedback	https://vaiswanara.com/jyotisha/?page=Feedback
What's New (కొత్త ఫీచర్లు)	page=changelog	https://vaiswanara.com/jyotisha/?page=changelog
Privacy Policy (గోప్యతా విధానం)	page=Privacy	https://vaiswanara.com/jyotisha/?page=Privacy
Precision Test (ప్రిసిషన్ టెస్ట్)	page=PrecisionTest	https://vaiswanara.com/jyotisha/?page=PrecisionTest
Admin Dashboard (అడ్మిన్ ప్యానెల్)	page=Admin	https://vaiswanara.com/jyotisha/?page=Admin
ఈ లింకుల ద్వారా ఏ పేజీనైనా బ్రౌజర్‌లో నేరుగా ఓపెన్ చేయవచ్చు.

https://vaiswanara.com/jyotisha/?page=e-Library