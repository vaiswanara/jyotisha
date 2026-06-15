import{u as Ne,r as L,j as e}from"./vendor-DGJAU7LJ.js";import{L as ze}from"./LocationAutocomplete-BUqDlnxv.js";import{P as Ce,R as he}from"./PredictionPanel-NzCJ0hpO.js";import{A as Ae,a as Re}from"./index-CIkE80UA.js";const ee=[{n:1,name:"Ashwini",gana:"Deva",nadi:"Aadi",yoni:"Horse"},{n:2,name:"Bharani",gana:"Manushya",nadi:"Madhya",yoni:"Elephant"},{n:3,name:"Krittika",gana:"Rakshasa",nadi:"Antya",yoni:"Sheep"},{n:4,name:"Rohini",gana:"Manushya",nadi:"Aadi",yoni:"Serpent"},{n:5,name:"Mrigashira",gana:"Deva",nadi:"Madhya",yoni:"Serpent"},{n:6,name:"Arudra",gana:"Manushya",nadi:"Antya",yoni:"Dog"},{n:7,name:"Punarvasu",gana:"Deva",nadi:"Aadi",yoni:"Cat"},{n:8,name:"Pushya",gana:"Deva",nadi:"Madhya",yoni:"Sheep"},{n:9,name:"Ashlesha",gana:"Rakshasa",nadi:"Antya",yoni:"Cat"},{n:10,name:"Magha",gana:"Rakshasa",nadi:"Aadi",yoni:"Rat"},{n:11,name:"Purva Phalguni",gana:"Manushya",nadi:"Madhya",yoni:"Rat"},{n:12,name:"Uttara Phalguni",gana:"Manushya",nadi:"Antya",yoni:"Cow"},{n:13,name:"Hasta",gana:"Deva",nadi:"Aadi",yoni:"Buffalo"},{n:14,name:"Chitra",gana:"Rakshasa",nadi:"Madhya",yoni:"Tiger"},{n:15,name:"Swati",gana:"Deva",nadi:"Antya",yoni:"Buffalo"},{n:16,name:"Vishakha",gana:"Rakshasa",nadi:"Aadi",yoni:"Tiger"},{n:17,name:"Anuradha",gana:"Deva",nadi:"Madhya",yoni:"Deer"},{n:18,name:"Jyeshtha",gana:"Rakshasa",nadi:"Antya",yoni:"Deer"},{n:19,name:"Mula",gana:"Rakshasa",nadi:"Aadi",yoni:"Dog"},{n:20,name:"Purva Ashadha",gana:"Manushya",nadi:"Madhya",yoni:"Monkey"},{n:21,name:"Uttara Ashadha",gana:"Manushya",nadi:"Antya",yoni:"Mongoose"},{n:22,name:"Shravana",gana:"Deva",nadi:"Aadi",yoni:"Monkey"},{n:23,name:"Dhanishta",gana:"Rakshasa",nadi:"Madhya",yoni:"Lion"},{n:24,name:"Shatabhisha",gana:"Rakshasa",nadi:"Antya",yoni:"Horse"},{n:25,name:"Purva Bhadrapada",gana:"Manushya",nadi:"Aadi",yoni:"Lion"},{n:26,name:"Uttara Bhadrapada",gana:"Manushya",nadi:"Madhya",yoni:"Cow"},{n:27,name:"Revati",gana:"Deva",nadi:"Antya",yoni:"Elephant"}],re=["","Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"],ie=[null,"Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"],xe={Horse:"Ashwa",Elephant:"Gaja",Sheep:"Mesha",Serpent:"Sarpa",Dog:"Shwana",Cat:"Marjara",Rat:"Mushaka",Cow:"Govu",Buffalo:"Mahisha",Tiger:"Vyaghra",Deer:"Mriga",Monkey:"Vanara",Mongoose:"Nakula",Lion:"Simha"},ge={Horse:"Horse",Elephant:"Elephant",Sheep:"Sheep",Serpent:"Serpent",Dog:"Dog",Cat:"Cat",Rat:"Rat",Cow:"Cow",Buffalo:"Buffalo",Tiger:"Tiger",Deer:"Deer",Monkey:"Monkey",Mongoose:"Lion",Lion:"Mongoose"},me={Horse:"Buffalo",Buffalo:"Horse",Dog:"Deer",Deer:"Dog",Rat:"Cat",Cat:"Rat",Cow:"Tiger",Tiger:"Cow",Elephant:"Lion",Lion:"Elephant",Sheep:"Mongoose",Mongoose:"Sheep",Monkey:"Serpent",Serpent:"Monkey"},fe={Sun:{Moon:1,Mars:1,Jupiter:1,Mercury:0,Venus:-1,Saturn:-1},Moon:{Sun:1,Mercury:1,Mars:0,Jupiter:0,Venus:0,Saturn:0},Mars:{Sun:1,Moon:1,Jupiter:1,Venus:0,Saturn:0,Mercury:-1},Mercury:{Sun:1,Venus:1,Mars:0,Jupiter:0,Saturn:0,Moon:-1},Jupiter:{Sun:1,Moon:1,Mars:1,Saturn:0,Mercury:-1,Venus:-1},Venus:{Mercury:1,Saturn:1,Mars:0,Jupiter:0,Sun:-1,Moon:-1},Saturn:{Mercury:1,Venus:1,Jupiter:0,Sun:-1,Moon:-1,Mars:-1}},be=new Set([2,4,6,8,9]),se=["","Janma","Sampat","Vipat","Kshema","Pratyari","Sadhaka","Vadha","Mitra","Parama Mitra"],ue={1:"Kshatriya",2:"Vaishya",3:"Shudra",4:"Brahmin",5:"Kshatriya",6:"Vaishya",7:"Shudra",8:"Brahmin",9:"Kshatriya",10:"Vaishya",11:"Shudra",12:"Brahmin"},ye={Brahmin:4,Kshatriya:3,Vaishya:2,Shudra:1},we={1:"Chatushpada",2:"Chatushpada",3:"Manava",4:"Jalachara",5:"Vanachara",6:"Manava",7:"Manava",8:"Keeta",9:"Manava",10:"Chatushpada",11:"Manava",12:"Jalachara"};function ve(c){const o=String(c||"").trim().toLowerCase(),g={ardra:"Arudra",arudra:"Arudra",dhanishtha:"Dhanishta",dhanishta:"Dhanishta","purva bhadra":"Purva Bhadrapada","uttara bhadra":"Uttara Bhadrapada"}[o]||ee.find(p=>p.name.toLowerCase()===o)?.name;return ee.find(p=>p.name===g)||null}function ke(c,o){return Math.ceil(((c-1)*4+o)/9)}function Se(c,o){const a=ee.findIndex(p=>p.name.toLowerCase()===c.toLowerCase());if(a===-1)return null;const g=a%3;return g===0?["Aadi","Madhya","Antya","Antya"][o-1]:g===1?["Madhya","Aadi","Aadi","Madhya"][o-1]:g===2?["Antya","Antya","Madhya","Aadi"][o-1]:null}function je(c,o){if(!c||!o)return 0;if(c===o)return 5;const a=fe[c]?.[o]??0,g=fe[o]?.[c]??0;return a===1&&g===1?5:a===1&&g===0||a===0&&g===1?4:a===0&&g===0?3:a===1&&g===-1||a===-1&&g===1?1:a===0&&g===-1||a===-1&&g===0?.5:0}const Y={Sun:"Surya",Moon:"Chandra",Mars:"Kuja",Mercury:"Budha",Jupiter:"Guru",Venus:"Shukra",Saturn:"Shani"};function $e(c,o){const a=c.boy?.moon?.nakshatra,g=parseInt(c.boy?.moon?.pada||1,10),p=c.girl?.moon?.nakshatra,O=parseInt(c.girl?.moon?.pada||1,10),r=ve(a),i=ve(p);if(!r||!i)return null;const n=c.boy?.chart?.navamsa_d9?.Moon?.rashi||((r.n-1)*4+(g-1))%12+1,k=c.girl?.chart?.navamsa_d9?.Moon?.rashi||((i.n-1)*4+(O-1))%12+1,w=ke(r.n,g),l=ke(i.n,O),f=[],s=[];let x=0;const b=ue[w],$=ue[l],M=ye[b]||1,A=ye[$]||1,T=M>=A?1:0;f.push({name:"Varna",what:"Work & Spiritual Compatibility",max:1,score:T,boyVal:o?o(b):b,girlVal:o?o($):$});const R=we[w],N=we[l];let v=0;R===N?v=2:(R==="Manava"&&N==="Jalachara"||R==="Jalachara"&&N==="Manava")&&(v=1),f.push({name:"Vashya",what:"Dominance & Influence",max:2,score:v,boyVal:o?o(R):R,girlVal:o?o(N):N});const D=(i.n-r.n+27)%27+1,m=(r.n-i.n+27)%27+1,z=(D-1)%9+1,u=(m-1)%9+1,G=be.has(z),B=be.has(u),J=G&&B?3:G||B?1.5:0;f.push({name:"Tara",what:"Destiny & Health",max:3,score:J,boyVal:o?o(se[z]):se[z],girlVal:o?o(se[u]):se[u]});const U=xe[r.yoni]||r.yoni,q=xe[i.yoni]||i.yoni;let K=2;r.yoni===i.yoni?K=4:ge[r.yoni]===i.yoni||ge[i.yoni]===r.yoni?K=3:(me[r.yoni]===i.yoni||me[i.yoni]===r.yoni)&&(K=0),f.push({name:"Yoni",what:"Physical Compatibility",max:4,score:K,boyVal:o?o(U):U,girlVal:o?o(q):q});const j=ie[w],W=ie[l],S=je(j,W);let te=o?o(j):j,Z=o?o(W):W,ae=S;if(S<3&&n&&k){const y=ie[n],h=ie[k],P=je(y,h);te+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${o?o(y):y})</span>`,Z+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${o?o(h):h})</span>`,ae+=`<br><span style="font-size:0.8rem; color:#27ae60;">(Amsha: ${P})</span>`,P>=4&&s.push(`<strong>Amsha Maitri:</strong> Navamsha Moon-sign lords (${Y[y]} and ${Y[h]}) are friendly.`)}f.push({name:"Graha Maitri",what:"Mental Compatibility",max:5,score:S,scoreDisplay:ae,boyVal:te,girlVal:Z});let Q=0;r.gana===i.gana?Q=6:r.gana==="Deva"&&i.gana==="Manushya"?Q=5:r.gana==="Manushya"&&i.gana==="Deva"&&(Q=4),f.push({name:"Gana",what:"Nature & Temperament",max:6,score:Q,boyVal:o?o(r.gana):r.gana,girlVal:o?o(i.gana):i.gana});const t=(l-w+12)%12+1,d=(w-l+12)%12+1,E=w!==l&&[[2,12],[5,9],[6,8]].some(([y,h])=>t===y&&d===h||t===h&&d===y);let I=w===l||!E?7:0;if(E&&(j===W||S>=4)){const y=j===W?Y[j]||j:`${Y[j]||j} & ${Y[W]||W}`;s.push(`<strong>Bhakoot Dosha Cancellation:</strong> Cancelled because sign lords (${y}) are friendly or identical.`),I=7}f.push({name:"Bhakoot",what:"Wealth & Harmony",max:7,score:I,boyVal:o?o(re[w]):re[w],girlVal:o?o(re[l]):re[l]});const _=r.nadi===i.nadi;let H=_?0:8,X=o?o(r.nadi):r.nadi,oe=o?o(i.nadi):i.nadi;if(_){const y=Se(r.name,g),h=Se(i.name,O);y&&h&&(X+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${o?o(y):y})</span>`,oe+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${o?o(h):h})</span>`,y!==h&&s.push(`<strong>Amsha Nadi:</strong> Boy and Girl share ${r.nadi} Nadi, but their Pada-based Amsha Nadis are different (${y} vs ${h}).`)),r.n===i.n&&g===O?s.push(`<strong>Same Nakshatra & Pada:</strong> Both share the same Nakshatra (${o?o(r.name):r.name}) and Pada (${g}), meaning they share the same Nadi energy. Nadi Dosha cancellation is not applicable here, and a detailed chart match by an experienced astrologer is recommended.`):r.n===i.n&&g!==O?(s.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they share the same Nakshatra (${o?o(r.name):r.name}) but have different quarters (Padas).`),H=8):w!==l&&j===W?(s.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis but identical Rashi lords (${Y[j]||j}).`),H=8):w!==l&&S>=4&&(s.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis and their Rashi lords (${Y[j]||j} and ${Y[W]||W}) are friendly.`),H=8)}return f.push({name:"Nadi",what:"Health & Progeny",max:8,score:H,boyVal:X,girlVal:oe}),f.forEach(y=>x+=y.score),f.reverse(),{totalScore:x,maxScore:36,percentage:Math.round(x/36*100),compatibility:x>=27?"Excellent":x>=18?"Good":x>=10?"Average":"Low",kutas:f,exceptions:s}}function Me(){try{const c=JSON.parse(localStorage.getItem("vaiswanara_default_location"));if(c)return c}catch{}return{latitude:"13.13",longitude:"78.8",timezone:"5.5",city:""}}function ce(){const c=new Date,o=c.getFullYear(),a=String(c.getMonth()+1).padStart(2,"0"),g=String(c.getDate()).padStart(2,"0");return`${o}-${a}-${g}`}function pe(){const c=new Date,o=String(c.getHours()).padStart(2,"0"),a=String(c.getMinutes()).padStart(2,"0");return`${o}:${a}`}function Te({logoUrl:c,onNavigate:o}){const{t:a,i18n:g}=Ne(),[p,O]=L.useState(()=>({name:a("groom"),dob:ce(),tob:pe(),...Me()})),[r,i]=L.useState(()=>({name:a("bride"),dob:ce(),tob:pe(),...Me()})),[n,k]=L.useState(null),[w,l]=L.useState({loading:!1,error:""}),f=L.useRef(null),s=L.useRef({}),[x,b]=L.useState({isOpen:!1,type:"boy"}),[$,M]=L.useState("input"),[A,T]=L.useState("birth"),[R,N]=L.useState(!1),[v,D]=L.useState({boyNak:"Ashwini",boyPada:1,girlNak:"Ashwini",girlPada:1}),[m,z]=L.useState({}),[u,G]=L.useState({}),[B,J]=L.useState(""),U=t=>{const d=JSON.parse(localStorage.getItem("vaiswanara_profiles")||"{}");G(d),z(t==="boy"?p:r),M("input"),J(""),b({isOpen:!0,type:t})},q=t=>{const d=u[t];d&&(z({...m,name:t,dob:d.dob,tob:d.tob,city:d.city,latitude:d.latitude,longitude:d.longitude,timezone:d.timezone}),M("input"))},K=()=>{x.type==="boy"?O(m):i(m),b({isOpen:!1,type:"boy"})},j=()=>{const t=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");z({name:"",dob:ce(),tob:pe(),city:t?.city||"Bengaluru, India",latitude:t?.latitude||"12.9716",longitude:t?.longitude||"77.5946",timezone:t?.timezone||"5.5"}),M("input")},W=()=>{const t=m.name?.trim();if(!t||t===a("groom")||t===a("bride"))return alert("Please enter a specific Name to save this profile.");const d={...u};d[t]={...m,gender:x.type==="boy"?"male":"female"},localStorage.setItem("vaiswanara_profiles",JSON.stringify(d)),G(d),alert(`Profile "${t}" saved successfully!`)},S=t=>{if(!t)return t;let d=a("Amsha");if(d==="Amsha"&&!g.language.startsWith("en")){const C=g.language.split("-")[0];C==="te"?d="అంశ":C==="kn"&&(d="ಅಂಶ")}return String(t).replace(/\bAmsha\b/gi,d)};async function te(){const t=JSON.stringify({boyData:p,girlData:r});if(s.current[t]){k(s.current[t]),setTimeout(()=>{f.current?.scrollIntoView({behavior:"smooth",block:"start"})},100);return}const C=JSON.parse(localStorage.getItem("eclock_prefs")||"{}").ayanamsha_val||"lahiri";l({loading:!0,error:""});try{const E=new URLSearchParams({endpoint:"match",boy_dob:p.dob,boy_tob:p.tob,boy_latitude:p.latitude,boy_longitude:p.longitude,boy_timezone:p.timezone,girl_dob:r.dob,girl_tob:r.tob,girl_latitude:r.latitude,girl_longitude:r.longitude,girl_timezone:r.timezone,ayanamsha:C,rahu_mode:localStorage.getItem("rahu_mode")||"mean"}),_=await(await fetch(`${Ae}?${E.toString()}`,{method:"GET",headers:{"x-api-token":Re}})).json();if(_.error)throw new Error(_.error);const H=$e(_,a);if(!H)throw new Error("Unable to parse Nakshatra/Moon data from API response.");const X={raw:_,match:H};s.current[t]=X,k(X),l({loading:!1,error:""}),setTimeout(()=>{f.current?.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(E){l({loading:!1,error:E.message})}}const Z=t=>{T(t),k(null),t==="nakshatra"&&N(!0)};function ae(t,d,C,E){l({loading:!0,error:""});try{const I={boy:{moon:{nakshatra:t,pada:parseInt(d,10)},chart:null},girl:{moon:{nakshatra:C,pada:parseInt(E,10)},chart:null}},_=$e(I,a);if(!_)throw new Error("Unable to calculate compatibility for selected Nakshatras.");k({raw:I,match:_,isNakshatraOnly:!0}),l({loading:!1,error:""}),setTimeout(()=>{f.current?.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(I){l({loading:!1,error:I.message})}}async function Q(t="download"){if(n){l({loading:!0,error:""});try{window.html2canvas||await new Promise((h,P)=>{const V=document.createElement("script");V.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",V.onload=h,V.onerror=()=>P(new Error("Failed to load html2canvas")),document.head.appendChild(V)}),window.jspdf||await new Promise((h,P)=>{const V=document.createElement("script");V.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",V.onload=h,V.onerror=()=>P(new Error("Failed to load jspdf")),document.head.appendChild(V)});let d="",C="",E="",I="";n.isNakshatraOnly||(d=le(n.raw.boy.chart.planets,null,a("Rasi Chakra"),"(D1)",a),C=le(n.raw.boy.chart.planets,n.raw.boy.chart.navamsa_d9,a("Navamsha"),"(D9)",a),E=le(n.raw.girl.chart.planets,null,a("Rasi Chakra"),"(D1)",a),I=le(n.raw.girl.chart.planets,n.raw.girl.chart.navamsa_d9,a("Navamsha"),"(D9)",a));const _=n.match.kutas.map((h,P)=>`
        <div style="display: flex; align-items: stretch; border-bottom: ${P===n.match.kutas.length-1?"none":"1px solid #dfe6e9"}; background: ${h.score===0?"#fdedec":"transparent"};">
          <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; flex-direction: column; justify-content: center;">
            <strong style="color: #2d3436;">${a(h.name)}</strong>
          </div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${S(h.boyVal)}</div></div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${S(h.girlVal)}</div></div>
          <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; align-items: center; justify-content: center; color: #2d3436;">${h.max}</div>
          <div style="flex: 1; padding: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10.5pt; text-align: center; color: ${h.score===0?"#c0392b":h.score>h.max/2?"#27ae60":"#f39c12"};"><div>${S(h.scoreDisplay)||h.score}</div></div>
        </div>
      `).join(""),H=n.match.exceptions.length>0||n.isNakshatraOnly?`<div style="background: ${n.match.exceptions.length>0?"#fffbeb":"#f8f9fa"}; border-left: 5px solid ${n.match.exceptions.length>0?"#f59e0b":"#bdc3c7"}; padding:15px; border-radius:4px; margin-bottom:20px;">
            <h4 style="color: ${n.match.exceptions.length>0?"#b45309":"#7f8c8d"}; margin:0 0 8px 0; font-size:11pt">${a("exceptionsNoted")}</h4>
            ${n.match.exceptions.length>0?`
            <ul style="color:#92400e; margin:0; padding-left:20px; font-size:9pt; line-height:1.5; word-wrap:break-word; word-break:break-word;">
              ${n.match.exceptions.map(h=>`<li>${S(h)}</li>`).join("")}
            </ul>
            `:`
            <div style="color:#7f8c8d; font-size:9pt; font-style:italic; padding-left:5px;">${a("noExceptionsNoted","No exceptions or special rules noted for this match.")}</div>
            `}
           </div>`:"",X=`
      <style>
        * { box-sizing: border-box; }
        .pdf-page { width: 794px; height: 1122px; padding: 40px; box-sizing: border-box; background: #fff; position: relative; font-family: 'Poppins', sans-serif; color: #2d3436; -webkit-text-size-adjust: none; }
        .header { text-align: center; border-bottom: 2px solid #2d3436; padding-bottom: 15px; margin-bottom: 20px; }
        .header img { height: 60px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 19pt; color: #2d3436; text-transform: uppercase; }
        .header h2 { margin: 5px 0; font-size: 14pt; color: #6c5ce7; font-weight: 600; }
        .details-grid { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
        .details-box { flex: 1; padding: 15px; border: 1px solid #dcdde1; border-radius: 8px; background: #f8f9fa; font-size: 10pt; line-height: 1.6; word-wrap: break-word; word-break: break-word; }
        .details-box h3 { margin: 0 0 10px 0; color: #2d3436; font-size: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 5px; text-transform: uppercase; }
        .flex-table-wrapper { border: 1.5px solid #2d3436; border-radius: 8px; overflow: hidden; margin-bottom: 20px; font-size: 9pt; width: 100%; display: flex; flex-direction: column; }
        .charts-row { display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; width: 100%; }
        .chart-col { width: 280px; display: flex; flex-direction: column; align-items: center; }
        .chart-col svg { width: 280px !important; height: 280px !important; display: block; }
        .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #dcdde1; padding-top: 8px; font-size: 8pt; color: #b2bec3; display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
      </style>
      <div id="pdf-render-wrapper" style="position: absolute; top: 0; left: 0; width: 794px; z-index: -9999; background: #fff;">
      
      <!-- PAGE 1: MATCH RESULTS -->
      <div class="pdf-page">
        <div class="header">
          ${c?`<img src="${c}" alt="Logo">`:""}
          <h1>${a("marriageCompatibility")}</h1>
          <h2>${a("ashtakutaResults")}</h2>
          ${!n.isNakshatraOnly&&n.raw?.ayanamsha?`<div style="font-size:10pt; color:#7f8c8d; margin-top:5px;">Ayanamsha: ${n.raw.ayanamsha}</div>`:""}
        </div>
        <div class="details-grid">
          <div class="details-box" style="border-top: 4px solid #3498db;">
            <h3 style="color:#2980b9;"> ${a("boy")}: ${p.name||a("groom")}</h3>
            ${n.isNakshatraOnly?`
            <div><strong>${a("nakshatraDataMode","Nakshatra Mode")}</strong></div>
            `:`
            <div><strong>${a("dateOfBirth")}:</strong> ${p.dob?p.dob.split("-").reverse().join("-"):"-"} &middot; ${p.tob}</div>
            <div><strong>${a("place","Place")}:</strong> ${p.city?p.city.split(",")[0]:"-"}</div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${a(n.raw.boy?.moon?.nakshatra||"-")}-${S(n.raw.boy?.moon?.pada)||"-"}, ${S(n.match.kutas.find(h=>h.name==="Bhakoot")?.boyVal)||"-"}
            </div>
          </div>
          <div class="details-box" style="border-top: 4px solid #e74c3c;">
            <h3 style="color:#c0392b;"> ${a("girl")}: ${r.name||a("bride")}</h3>
            ${n.isNakshatraOnly?`
            <div><strong>${a("nakshatraDataMode","Nakshatra Mode")}</strong></div>
            `:`
            <div><strong>${a("dateOfBirth")}:</strong> ${r.dob?r.dob.split("-").reverse().join("-"):"-"} &middot; ${r.tob}</div>
            <div><strong>${a("place","Place")}:</strong> ${r.city?r.city.split(",")[0]:"-"}</div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${a(n.raw.girl?.moon?.nakshatra||"-")}-${S(n.raw.girl?.moon?.pada)||"-"}, ${S(n.match.kutas.find(h=>h.name==="Bhakoot")?.girlVal)||"-"}
            </div>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-around; align-items:center; padding:10px 15px; background:#f8f9fa; border:1px solid #dcdde1; border-radius:6px; margin-bottom:15px;">
          <div style="font-size:11pt; color:#2d3436; font-weight:600;">${a("totalAshtakutaScore")}</div>
          <div style="font-size:16pt; font-weight:bold; color:${n.match.totalScore>=18?"#27ae60":"#c0392b"}">
            ${n.match.totalScore} <span style="font-size:11pt; color:#7f8c8d">/ 36</span>
          </div>
          <div style="font-size:11pt; font-weight:600; color:${n.match.totalScore>=18?"#27ae60":"#c0392b"};">
            ${a("compatibility")} ${a(n.match.compatibility)} (${n.match.percentage}%)
          </div>
        </div>

        <div class="flex-table-wrapper">
          <div style="display: flex; align-items: stretch; background: #f1f2f6; border-bottom: 1.5px solid #2d3436; font-weight: 700; font-size: 8.5pt; text-transform: uppercase; color: #2d3436;">
            <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9;">${a("kootaFactor")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${a("boy")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${a("girl")}</div>
            <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${a("max")}</div>
            <div style="flex: 1; padding: 8px; text-align: center;">${a("score")}</div>
          </div>
          ${_}
        </div>
        ${H}

        <div class="footer">
          <span>${a("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${a("Page","Page")} 1</span>
        </div>
      </div>
      
      ${n.isNakshatraOnly?"":`
      <!-- PAGE 2: CHARTS -->
      <div class="pdf-page">
        <div style="text-align:center; font-size:16pt; font-weight:bold; margin-bottom:25px; text-transform:uppercase; color:#2d3436; border-bottom:2px solid #2d3436; padding-bottom:10px;">${a("horoscopeCharts","Horoscope Charts")}</div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#2980b9; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;"> ${p.name||a("groom")}</div>
        <div class="charts-row">
          <div class="chart-col">${d}</div>
          <div class="chart-col">${C}</div>
        </div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#c0392b; margin-top:25px; margin-bottom:15px; border-top:1px dashed #ccc; padding-top:25px; text-transform:uppercase; letter-spacing:1px;"> ${r.name||a("bride")}</div>
        <div class="charts-row">
          <div class="chart-col">${E}</div>
          <div class="chart-col">${I}</div>
        </div>
        
        <div class="footer">
          <span>${a("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${a("Page","Page")} 2</span>
        </div>
      </div>
      `}
      </div>`,oe=window.scrollY;window.scrollTo(0,0);const y=document.createElement("div");y.innerHTML=X,y.style.position="absolute",y.style.top="0",y.style.left="0",y.style.width="794px",document.body.appendChild(y);try{await new Promise(F=>setTimeout(F,600));const h=y.querySelectorAll(".pdf-page"),P=new window.jspdf.jsPDF({orientation:"portrait",unit:"mm",format:"a4"});for(let F=0;F<h.length;F++){const ne=await window.html2canvas(h[F],{scale:2,useCORS:!0,scrollY:0,scrollX:0,windowWidth:794,width:794,height:1122});F>0&&P.addPage();const de=ne.toDataURL("image/jpeg",.98);P.addImage(de,"JPEG",0,0,210,297)}const V=`${p.name||"Boy"}_${r.name||"Girl"}_Match.pdf`.replace(/[^a-zA-Z0-9_.-]/g,"");if(t==="share"&&navigator.canShare){const F=P.output("blob"),ne=new File([F],V,{type:"application/pdf"});if(navigator.canShare({files:[ne]}))try{await navigator.share({title:"Marriage Compatibility",text:"Here is the Ashtakuta Match report generated via e-Jyotisha.",files:[ne]})}catch(de){de.name!=="AbortError"&&P.save(V)}else alert(a("shareNotSupported","Share feature is not supported on your browser. Downloading instead...")),P.save(V)}else P.save(V)}finally{document.body.removeChild(y),window.scrollTo(0,oe)}l({loading:!1,error:""})}catch(d){console.error("PDF Error:",d),l({loading:!1,error:"Failed to generate PDF."})}}}return e.jsxs("main",{className:"new-horo-page",style:{background:"transparent",minHeight:"100vh"},children:[e.jsx("style",{children:`
  
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

        /* Layout overrides for new Match page */
        html, body, #root, .app-shell {
          background: #f5f6f8 !important;
        }
        .new-horo-page {
          padding: 15px !important;
          margin: 0 auto !important;
          width: 100% !important;
          max-width: 1200px !important;
          box-sizing: border-box !important;
        }
        @media (max-width: 860px) {
          .new-horo-page { 
            padding-top: calc(env(safe-area-inset-top, 0px) + 8px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        @media (max-width: 768px) {
          .new-horo-page { 
            width: 100% !important; 
            padding: 10px !important; 
            padding-top: calc(env(safe-area-inset-top, 0px) + 8px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        
        /* Modern Cards */
        .new-horo-page .score-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 24px !important;
          margin-bottom: 20px !important;
          text-align: center !important;
        }
        .new-horo-page .exceptions-card {
          background: #fffbeb !important;
          border-left: 5px solid #f59e0b !important;
          padding: 16px !important;
          border-radius: 10px !important;
          margin-bottom: 20px !important;
          text-align: left !important;
        }
        .new-horo-page .table-panel {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }
        
        .new-horo-page .match-info-summary {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          gap: 15px !important;
          margin-bottom: 20px !important;
          width: 100% !important;
        }
        .new-horo-page .match-info-card {
          flex: 1 !important;
          background: #fdfefe !important;
          border: 1px solid #eaecee !important;
          border-radius: 12px !important;
          padding: 15px !important;
          text-align: center !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .new-horo-page .match-info-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }
        .new-horo-page .match-info-card.boy {
          border-top: 3px solid #3498db !important;
        }
        .new-horo-page .match-info-card.girl {
          border-top: 3px solid #e74c3c !important;
        }
        .new-horo-page .match-info-title {
          font-size: 13px !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin-bottom: 8px !important;
        }
        .new-horo-page .match-info-title.boy {
          color: #3498db !important;
        }
        .new-horo-page .match-info-title.girl {
          color: #e74c3c !important;
        }
        .new-horo-page .match-info-value {
          font-size: 18px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          line-height: 1.3 !important;
        }
        .new-horo-page .match-info-sub {
          font-size: 15px !important;
          color: #7f8c8d !important;
          margin-top: 4px !important;
          font-weight: 600 !important;
        }
        @media (max-width: 600px) {
          .new-horo-page .match-info-summary {
            gap: 8px !important;
          }
          .new-horo-page .match-info-card {
            padding: 10px 5px !important;
          }
          .new-horo-page .match-info-title {
            font-size: 11px !important;
            margin-bottom: 4px !important;
          }
          .new-horo-page .match-info-value {
            font-size: 14px !important;
          }
          .new-horo-page .match-info-sub {
            font-size: 12px !important;
          }
        }
        .new-horo-page .chart-card {
          flex: 1;
          min-width: 300px;
          border: 1px solid #eaecee !important;
          padding: 20px !important;
          border-radius: 14px !important;
          background: #ffffff !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .chart-card.boy {
          border-top: 4px solid #3498db !important;
        }
        .new-horo-page .chart-card.girl {
          border-top: 4px solid #e74c3c !important;
        }
        
        .new-horo-page .match-charts-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 10px;
          width: 100%;
        }
        
        /* Typography */
        .new-horo-page h2 {
          font-weight: 600 !important;
          font-size: 18px !important;
          color: #2c3e50 !important;
          margin: 0 0 15px 0 !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding-bottom: 12px !important;
          text-align: left !important;
        }
        .new-horo-page h3 {
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #2c3e50 !important;
          margin: 0 0 15px 0 !important;
        }

        /* Results table */
        .new-horo-page .table-scroll {
          overflow-x: auto !important; 
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
          border-radius: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .new-horo-page table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 0 !important;
        }
        .new-horo-page th {
          font-size: 13px !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 10px 14px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          background: #fdfefe !important;
          white-space: nowrap !important;
        }
        .new-horo-page td {
          font-size: 13px !important;
          color: #2c3e50 !important;
          padding: 8px 14px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          text-align: left !important;
          white-space: nowrap !important;
        }

                /* Ashtakuta Table Mobile Fix */

        .new-horo-page .table-scroll {
          width: 100%;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch;
        }
       .new-horo-page .ashtakuta-table {
          width: 100% !important;
          table-layout: auto !important;
        }

        .new-horo-page .ashtakuta-table th:nth-child(4),
        .new-horo-page .ashtakuta-table td:nth-child(4),
        .new-horo-page .ashtakuta-table th:nth-child(5),
        .new-horo-page .ashtakuta-table td:nth-child(5) {
          text-align: center !important;
          width: 50px;
        }

        .ashtakuta-table {
          min-width: 0 !important;
          width: 100% !important;
        } 

        
          


       .new-horo-page .ashtakuta-table th,
        .new-horo-page .ashtakuta-table td {
          white-space: nowrap;
        }

        .new-horo-page .ashtakuta-table th:first-child,
        .new-horo-page .ashtakuta-table td:first-child {
          width: 90px;
        } 
        
        .new-horo-page .ashtakuta-table .text-center {
          text-align: center !important;
        }
        
        /* Buttons */
        .new-horo-page .export-panel {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-bottom: 5px !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .btn-pdf,
        .new-horo-page .btn-share {
          color: #fff !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          width: auto !important;
          transition: all 0.2s ease !important;
        }
        .new-horo-page .btn-pdf {
          background: #d63031 !important;
        }
        .new-horo-page .btn-pdf:hover {
          background: #c0392b !important;
        }
        .new-horo-page .btn-share {
          background: #27ae60 !important;
        }
        .new-horo-page .btn-share:hover {
          background: #219653 !important;
        }

        /* Mobile Responsive Adjustments for Match Page */
        @media (max-width: 768px) {
          .new-horo-page .export-panel {
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          .new-horo-page .btn-pdf,
          .new-horo-page .btn-share {
            flex: 0 1 auto !important;
            width: auto !important;
            min-width: unset !important;
            justify-content: center !important;
          }
          .new-horo-page .table-panel {
            padding: 15px 10px !important;
            border-radius: 12px !important;
          }
          .new-horo-page th {
            padding: 8px 6px !important;
            font-size: 12px !important;
          }
          .new-horo-page td {
            padding: 8px 6px !important;
            font-size: 12px !important;
          }
          .new-horo-page .ashtakuta-table th:first-child,
          .new-horo-page .ashtakuta-table td:first-child {
            width: 75px !important;
          }
          .new-horo-page .ashtakuta-table th:nth-child(4),
          .new-horo-page .ashtakuta-table td:nth-child(4),
          .new-horo-page .ashtakuta-table th:nth-child(5),
          .new-horo-page .ashtakuta-table td:nth-child(5) {
            width: 40px !important;
          }
          
          
          .new-horo-page .chart-card {
            padding: 15px 10px !important;
            min-width: 100% !important;
            border-radius: 12px !important;
            margin-bottom: 5px !important;
          }
          .new-horo-page .chart-card h3 {
            font-size: 16px !important;
            margin-bottom: 15px !important;
          }
          .new-horo-page .score-card {
            padding: 20px 15px !important;
          }
          .new-horo-page .score-card > div:nth-child(2) {
            font-size: 2.8rem !important;
          }
          .new-horo-page .match-charts-container {
            grid-template-columns: 1fr !important;
          }
        
        }

          /* Top Bar Card */
          .new-horo-page .top-bar-card {
            background: #ffffff !important;
            padding: 12px 16px !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #eaecee !important;
            border-radius: 14px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
            margin-bottom: 15px;
            width: 100% !important;
            box-sizing: border-box !important;
            gap: 12px;
          }
          .new-horo-page .top-bar-details {
            display: flex;
            flex-direction: column;
            flex: 1;
            cursor: pointer;
            min-width: 0;
            transition: transform 0.1s ease-in-out;
            padding: 8px;
            border-radius: 8px;
          }
          .new-horo-page .top-bar-details:hover {
            background: #f8f9fa;
          }
          .new-horo-page .top-bar-details:active {
            transform: scale(0.98);
          }
          .new-horo-page .top-bar-divider {
            width: 1px;
            background: #eaecee;
            align-self: stretch;
            margin: 0 5px;
          }

          /* Popup Styles */
          .new-horo-page .popup-container {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 1000;
            display: flex; justify-content: center; align-items: center;
            padding: 20px; backdrop-filter: blur(4px);
          }
          .new-horo-page .popup-content {
            background: #fff; padding: 30px; border-radius: 16px;
            width: 100%; max-width: 650px; max-height: 90vh;
            overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          @media (max-width: 768px) {
            .new-horo-page .popup-container { padding: 15px; }
            .new-horo-page .popup-content { padding: 20px; max-width: 100%; }
          }
          .new-horo-page .popup-tab {
            flex: 1;
            padding: 12px 10px;
            border: none;
            background: transparent;
            font-weight: 600;
            font-size: 15px;
            color: #7f8c8d;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .new-horo-page .popup-tab.active {
            color: #8e44ad;
            border-bottom: 2px solid #8e44ad;
          }
          .new-horo-page .profile-card {
            padding: 12px;
            border: 1px solid #eaecee;
            border-radius: 10px;
            cursor: pointer;
            background: #fdfefe;
            transition: background 0.2s;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .new-horo-page .profile-card:hover {
            background: #f5f6f8;
          }

          .kuta-description {
            font-size: 0.75rem;
            color: #7f8c8d;
            line-height: 1.3;
          }

          

          @media (max-width: 1024px) {
            .kuta-description {
            display: none;
          }
        } 
      `}),e.jsxs("section",{className:"workspace",style:{display:"flex",flexDirection:"column",gap:"12px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[A==="birth"?e.jsxs("div",{className:"top-bar-card",children:[e.jsxs("div",{className:"top-bar-details",onClick:()=>U("boy"),children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#3498db",marginBottom:"4px"},children:p.name||a("groom")}),e.jsxs("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsxs("span",{children:["📅 ",p.dob?p.dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",p.tob]})]})]}),e.jsx("div",{className:"top-bar-divider"}),e.jsxs("div",{className:"top-bar-details",onClick:()=>U("girl"),style:{alignItems:"flex-end",textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#e74c3c",marginBottom:"4px"},children:r.name||a("bride")}),e.jsxs("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px",alignItems:"flex-end"},children:[e.jsxs("span",{children:["📅 ",r.dob?r.dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",r.tob]})]})]})]}):e.jsxs("div",{className:"top-bar-card",onClick:()=>N(!0),children:[e.jsxs("div",{className:"top-bar-details",children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#3498db",marginBottom:"4px"},children:p.name||a("groom")}),e.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:e.jsxs("span",{children:["🌸 ",a(v.boyNak),"-",v.boyPada]})})]}),e.jsx("div",{className:"top-bar-divider"}),e.jsxs("div",{className:"top-bar-details",style:{alignItems:"flex-end",textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#e74c3c",marginBottom:"4px"},children:r.name||a("bride")}),e.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px",alignItems:"flex-end"},children:e.jsxs("span",{children:["🌸 ",a(v.girlNak),"-",v.girlPada]})})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"},children:[e.jsx("div",{style:{fontSize:"12px",color:"#7f8c8d",flex:1},children:A==="birth"?"ℹ️ Click on the Groom's or Bride's card above to change their birth date, time, or location details.":"ℹ️ Click on the card above to change Nakshatra details."}),e.jsxs("div",{className:"match-mode-toggle",style:{display:"flex",background:"#eaecee",padding:"3px",borderRadius:"8px",gap:"2px",flexShrink:0},children:[e.jsx("button",{onClick:()=>Z("birth"),title:a("birthDataMode","Date Mode"),style:{width:"36px",height:"36px",borderRadius:"6px",border:"none",background:A==="birth"?"#ffffff":"transparent",fontSize:"19px",cursor:"pointer",boxShadow:A==="birth"?"0 1px 4px rgba(0,0,0,0.12)":"none",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",padding:0,minHeight:"auto"},children:"📅"}),e.jsx("button",{onClick:()=>Z("nakshatra"),title:a("nakshatraDataMode","Nakshatra Mode"),style:{width:"36px",height:"36px",borderRadius:"6px",border:"none",background:A==="nakshatra"?"#ffffff":"transparent",fontSize:"19px",cursor:"pointer",boxShadow:A==="nakshatra"?"0 1px 4px rgba(0,0,0,0.12)":"none",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",padding:0,minHeight:"auto"},children:"⭐"})]})]}),A==="birth"&&e.jsxs("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"-8px",marginBottom:"10px"},children:[e.jsx("strong",{children:"Ayanamsha:"})," ",n?.raw?.ayanamsha||(()=>{const t=JSON.parse(localStorage.getItem("eclock_prefs")||"{}");return{lahiri:"Lahiri (Chitra Paksha)",raman:"Raman",krishnamurti:"Krishnamurti (KP)",yukteshwar:"Sri Yukteshwar",true_citra:"True Citra",fagan_bradley:"Fagan/Bradley",custom:`Custom (${t.ayanamsha_val}°)`}[t.ayanamsha_type||"lahiri"]||"Lahiri"})()]}),A==="birth"?e.jsx("button",{onClick:te,disabled:w.loading,style:{width:"100%",padding:"14px",borderRadius:"12px",background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",border:"none",fontWeight:"bold",fontSize:"16px",cursor:w.loading?"not-allowed":"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)",marginBottom:"5px",opacity:w.loading?.8:1,transition:"transform 0.2s ease"},children:w.loading?"⏳ "+a("processingMatch","Processing Match..."):"✨ "+a("calcAshtakutaMatch","Calculate Compatibility Match")}):e.jsx("button",{onClick:()=>N(!0),style:{width:"100%",padding:"14px",borderRadius:"12px",background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)",marginBottom:"5px",transition:"transform 0.2s ease"},children:"✨ "+a("selectNakshatrasAndCalc","Select Nakshatras & Calculate")}),e.jsxs("div",{className:"results-area",ref:f,style:{marginTop:"10px",height:"auto",overflow:"visible",flexShrink:0,display:"flex",flexDirection:"column",gap:"15px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[w.error&&e.jsx("div",{className:"message error",style:{background:"#fdedec",color:"#c0392b",padding:"15px",borderRadius:"12px",border:"1px solid #f5b7b1",textAlign:"center"},children:w.error}),w.loading&&e.jsxs("div",{className:"message",style:{background:"#ffffff",color:"#2c3e50",padding:"20px",borderRadius:"14px",boxShadow:"0 4px 15px rgba(0,0,0,0.03)",textAlign:"center",border:"1px solid #eaecee"},children:["⏳ ",a("processingMatch","Processing Match Compatibility...")]}),!n&&!w.loading&&e.jsx(Ce,{title:a("readyForMatch","Ready for Compatibility Check"),text:a("enterMatchDetailsDesc","Enter birth details for both Boy and Girl to generate the Ashtakuta Marriage Compatibility report.")}),n&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"export-panel",children:[e.jsxs("button",{className:"btn-pdf",onClick:()=>Q("download"),children:[e.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),a("pdf","PDF")]}),e.jsxs("button",{className:"btn-share",onClick:()=>Q("share"),children:[e.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),a("share","Share")]})]}),e.jsxs("div",{className:"score-card",children:[e.jsx("h3",{style:{margin:"0 0 10px 0",color:"#7f8c8d"},children:a("totalAshtakutaScore","Total Ashtakuta Score")}),e.jsxs("div",{style:{fontSize:"3.5rem",fontWeight:"bold",color:n.match.totalScore>=18?"#27ae60":"#c0392b",lineHeight:"1.1"},children:[n.match.totalScore," ",e.jsx("span",{style:{fontSize:"1.5rem",color:"#bdc3c7"},children:"/ 36"})]}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"600",marginTop:"10px",color:n.match.totalScore>=18?"#27ae60":"#c0392b"},children:[a("compatibility","Compatibility:")," ",a(n.match.compatibility)," (",n.match.percentage,"%)"]})]}),e.jsxs("section",{className:"table-panel",children:[e.jsxs("div",{className:"match-info-summary",style:{marginTop:"5px"},children:[e.jsxs("div",{className:"match-info-card boy",children:[e.jsx("div",{className:"match-info-title boy",children:p.name||a("groom","Groom")}),e.jsxs("div",{className:"match-info-value",children:[a(n.raw.boy?.moon?.nakshatra||"-"),"-",S(n.raw.boy?.moon?.pada)||"-"]}),e.jsx("div",{className:"match-info-sub",children:S(n.match.kutas.find(t=>t.name==="Bhakoot")?.boyVal)||"-"})]}),e.jsxs("div",{className:"match-info-card girl",children:[e.jsx("div",{className:"match-info-title girl",children:r.name||a("bride","Bride")}),e.jsxs("div",{className:"match-info-value",children:[a(n.raw.girl?.moon?.nakshatra||"-"),"-",S(n.raw.girl?.moon?.pada)||"-"]}),e.jsx("div",{className:"match-info-sub",children:S(n.match.kutas.find(t=>t.name==="Bhakoot")?.girlVal)||"-"})]})]}),e.jsx("h2",{children:a("ashtakutaResults","Ashtakuta Results")}),e.jsx("div",{className:"table-scroll",children:e.jsxs("table",{className:"ashtakuta-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Koota"}),e.jsx("th",{style:{color:"#3498db",textAlign:"center"},children:"Boy"}),e.jsx("th",{style:{color:"#e74c3c",textAlign:"center"},children:"Girl"}),e.jsx("th",{className:"text-center",children:"Max"}),e.jsx("th",{className:"text-center",children:"Score"})]})}),e.jsx("tbody",{children:n.match.kutas.map(t=>e.jsxs("tr",{style:{backgroundColor:t.score===0?"#fdedec":"transparent"},children:[e.jsx("td",{"data-label":a("kootaFactor","Koota (Factor)"),children:e.jsx("strong",{style:{color:"#2c3e50"},children:a(t.name)})}),e.jsx("td",{style:{textAlign:"center",fontWeight:"600"},dangerouslySetInnerHTML:{__html:S(t.boyVal)?.replace(/\bAmsha:\s*/gi,"")}}),e.jsx("td",{style:{textAlign:"center",fontWeight:"600"},dangerouslySetInnerHTML:{__html:S(t.girlVal)?.replace(/\bAmsha:\s*/gi,"")}}),e.jsx("td",{style:{color:"#7f8c8d",textAlign:"center"},children:t.max}),e.jsx("td",{style:{fontWeight:"bold",fontSize:"1.1rem",textAlign:"center",color:t.score>t.max/2?"#27ae60":t.score===0?"#c0392b":"#f39c12"},dangerouslySetInnerHTML:{__html:S(t.scoreDisplay)?.replace(/\bAmsha:\s*/gi,"")||t.score}})]},t.name))})]})})]}),(n.match.exceptions.length>0||n.isNakshatraOnly)&&e.jsxs("div",{className:"exceptions-card",style:{background:n.match.exceptions.length>0?"#fffbeb":"#f8f9fa",borderLeft:n.match.exceptions.length>0?"5px solid #f59e0b":"5px solid #bdc3c7",padding:"16px",borderRadius:"10px",marginBottom:"20px",textAlign:"left"},children:[e.jsxs("h4",{style:{color:n.match.exceptions.length>0?"#b45309":"#7f8c8d",margin:"0 0 8px 0",fontWeight:"bold"},children:["⚠️"," ",a("exceptionsNoted","Exceptions / Special Rules Noted")]}),n.match.exceptions.length>0?e.jsx("ul",{style:{color:"#92400e",margin:0,paddingLeft:"20px",fontSize:"0.9rem",lineHeight:"1.6"},children:n.match.exceptions.map((t,d)=>e.jsx("li",{dangerouslySetInnerHTML:{__html:S(t)}},d))}):e.jsx("div",{style:{color:"#7f8c8d",fontSize:"0.9rem",fontStyle:"italic",paddingLeft:"5px"},children:a("noExceptionsNoted","No exceptions or special rules noted for this match.")})]}),!n.isNakshatraOnly&&e.jsxs("div",{className:"match-charts-container",children:[n.raw.boy?.chart?.planets&&e.jsxs("div",{className:"chart-card boy",children:[e.jsxs("h3",{style:{textAlign:"center",color:"#3498db",margin:"0 0 20px 0"},children:[p.name||a("groom","Groom")," -"," ",a("Charts","Charts")]}),e.jsx(he,{planets:n.raw.boy.chart.planets,navamsa:n.raw.boy.chart.navamsa_d9||{}})]}),n.raw.girl?.chart?.planets&&e.jsxs("div",{className:"chart-card girl",children:[e.jsxs("h3",{style:{textAlign:"center",color:"#e74c3c",margin:"0 0 20px 0"},children:[r.name||a("bride","Bride")," -"," ",a("Charts","Charts")]}),e.jsx(he,{planets:n.raw.girl.chart.planets,navamsa:n.raw.girl.chart.navamsa_d9||{}})]})]})]})]})]}),R&&e.jsx("div",{className:"popup-container",children:e.jsxs("div",{className:"popup-content",style:{maxWidth:"500px"},children:[e.jsxs("h3",{style:{marginTop:0,color:"#8e44ad",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{children:["🌸 ",a("selectNakshatraPada","Select Nakshatra & Pada")]}),e.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>N(!1),children:"❌"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[e.jsxs("div",{style:{padding:"12px",border:"1px solid #eaecee",borderRadius:"10px",background:"#f8f9fa",borderLeft:"4px solid #3498db"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#3498db",marginBottom:"10px"},children:p.name||a("groom","Groom")}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsxs("div",{style:{flex:2},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Nakshatra:"}),e.jsx("select",{value:v.boyNak,onChange:t=>D({...v,boyNak:t.target.value}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:ee.map(t=>e.jsxs("option",{value:t.name,children:[t.n,". ",a(t.name)]},t.n))})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Pada:"}),e.jsx("select",{value:v.boyPada,onChange:t=>D({...v,boyPada:parseInt(t.target.value,10)}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:[1,2,3,4].map(t=>e.jsx("option",{value:t,children:t},t))})]})]})]}),e.jsxs("div",{style:{padding:"12px",border:"1px solid #eaecee",borderRadius:"10px",background:"#f8f9fa",borderLeft:"4px solid #e74c3c"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#e74c3c",marginBottom:"10px"},children:r.name||a("bride","Bride")}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsxs("div",{style:{flex:2},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Nakshatra:"}),e.jsx("select",{value:v.girlNak,onChange:t=>D({...v,girlNak:t.target.value}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:ee.map(t=>e.jsxs("option",{value:t.name,children:[t.n,". ",a(t.name)]},t.n))})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Pada:"}),e.jsx("select",{value:v.girlPada,onChange:t=>D({...v,girlPada:parseInt(t.target.value,10)}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:[1,2,3,4].map(t=>e.jsx("option",{value:t,children:t},t))})]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[e.jsx("button",{onClick:()=>N(!1),style:{flex:1,background:"#bdc3c7",color:"#fff",padding:"12px",borderRadius:"8px",border:"none",fontWeight:"bold",fontSize:"15px",cursor:"pointer"},children:"Cancel"}),e.jsx("button",{onClick:()=>{ae(v.boyNak,v.boyPada,v.girlNak,v.girlPada),N(!1)},style:{flex:1,background:"#8e44ad",color:"#fff",padding:"12px",borderRadius:"8px",border:"none",fontWeight:"bold",fontSize:"15px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.2)"},children:"OK"})]})]})]})}),x.isOpen&&e.jsx("div",{className:"popup-container",children:e.jsxs("div",{className:"popup-content",children:[e.jsxs("h3",{style:{marginTop:0,color:x.type==="boy"?"#3498db":"#e74c3c",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{children:["✏️"," ",x.type==="boy"?a("boyDetails","Boy Details"):a("girlDetails","Girl Details")]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[e.jsx("button",{type:"button",onClick:j,style:{background:"#ebf5fb",border:`1px solid ${x.type==="boy"?"#3498db":"#e74c3c"}`,color:x.type==="boy"?"#3498db":"#e74c3c",padding:"4px 10px",borderRadius:"15px",fontSize:"12px",fontWeight:"bold",cursor:"pointer",minHeight:"auto",lineHeight:"1"},children:a("new","New")}),e.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>b({...x,isOpen:!1}),children:"❌"})]})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid #eaecee",marginBottom:"15px"},children:[e.jsx("button",{className:`popup-tab ${$==="input"?"active":""}`,onClick:()=>M("input"),children:"Manual Entry"}),e.jsx("button",{className:`popup-tab ${$==="profiles"?"active":""}`,onClick:()=>M("profiles"),children:"Saved Profiles"})]}),$==="input"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"15px"},children:[e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50"},children:["Name (to Save Profile):",e.jsx("input",{type:"text",value:m.name||"",onChange:t=>z({...m,name:t.target.value}),placeholder:"Enter name here...",style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"}})]}),e.jsxs("div",{style:{display:"flex",gap:"15px"},children:[e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Date:",e.jsx("input",{type:"date",value:m.dob||"",onChange:t=>z({...m,dob:t.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]}),e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Time:",e.jsx("input",{type:"time",value:m.tob||"",onChange:t=>z({...m,tob:t.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]})]}),e.jsx(ze,{city:m.city,onLocationSelect:t=>z({...m,city:t.city,latitude:t.latitude,longitude:t.longitude,timezone:t.timezone})}),e.jsxs("details",{style:{marginTop:"-10px",fontSize:"14px",background:"#fdfefe",padding:"12px",borderRadius:"8px",border:"1px solid #eee"},children:[e.jsx("summary",{style:{cursor:"pointer",color:"#3498db",fontWeight:"bold",outline:"none",listStyle:"none"},children:"Manual Coordinates (Lat / Lon / Tz)"}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"10px"},children:[e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lat:",e.jsx("input",{type:"text",name:"latitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:m.latitude||"",onChange:t=>z({...m,latitude:t.target.value})})]}),e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lon:",e.jsx("input",{type:"text",name:"longitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:m.longitude||"",onChange:t=>z({...m,longitude:t.target.value})})]}),e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Tz:",e.jsx("input",{type:"text",name:"timezone",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:m.timezone||"",onChange:t=>z({...m,timezone:t.target.value})})]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[e.jsx("button",{onClick:W,style:{flex:1,background:"#27ae60",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(39, 174, 96, 0.2)"},title:"Save the current details as a new profile",children:"Save Profile"}),e.jsx("button",{onClick:K,style:{flex:1,background:x.type==="boy"?"#3498db":"#e74c3c",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:x.type==="boy"?"0 4px 10px rgba(52, 152, 219, 0.3)":"0 4px 10px rgba(231, 76, 60, 0.3)"},children:"Apply"})]})]}),$==="profiles"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("input",{type:"text",placeholder:a("searchProfiles","Search profiles..."),value:B,onChange:t=>J(t.target.value),style:{width:"100%",padding:"8px 12px",border:`1px solid ${x.type==="boy"?"#3498db":"#e74c3c"}`,borderRadius:"8px",fontSize:"14px",outline:"none",background:"#fdfefe",boxSizing:"border-box"}}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"350px",overflowY:"auto",padding:"5px 0"},children:Object.keys(u).filter(t=>{const d=x.type==="boy"?u[t].gender!=="female":u[t].gender==="female",C=B.trim()===""||t.toLowerCase().includes(B.toLowerCase())||(u[t].city||"").toLowerCase().includes(B.toLowerCase());return d&&C}).length===0?e.jsxs("p",{style:{textAlign:"center",color:"#7f8c8d",padding:"20px 0"},children:["No saved profiles found for"," ",x.type==="boy"?"Boy":"Girl","."]}):Object.keys(u).filter(t=>{const d=x.type==="boy"?u[t].gender!=="female":u[t].gender==="female",C=B.trim()===""||t.toLowerCase().includes(B.toLowerCase())||(u[t].city||"").toLowerCase().includes(B.toLowerCase());return d&&C}).map(t=>e.jsxs("div",{className:"profile-card",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",textAlign:"left",width:"100%",boxSizing:"border-box"},children:[e.jsxs("div",{onClick:()=>q(t),style:{flex:1,cursor:"pointer",padding:"4px 0",textAlign:"left"},children:[e.jsx("strong",{style:{color:x.type==="boy"?"#3498db":"#e74c3c",fontSize:"15px",display:"block",marginBottom:"4px",textAlign:"left"},children:t}),e.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",display:"flex",flexDirection:"column",gap:"4px",textAlign:"left"},children:[e.jsxs("span",{children:["📅 ",u[t].dob?u[t].dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",u[t].tob||""]}),e.jsxs("span",{children:["📍 ",u[t].city?u[t].city.split(",")[0].trim():u[t].city||a("manualCoords","Manual Coords")]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginLeft:"10px"},children:[e.jsx("button",{onClick:d=>{d.stopPropagation(),q(t)},title:"Edit",style:{background:"#ebf5fb",border:`1px solid ${x.type==="boy"?"#3498db":"#e74c3c"}`,color:x.type==="boy"?"#3498db":"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"✏️"}),e.jsx("button",{onClick:d=>{if(d.stopPropagation(),window.confirm(`Are you sure you want to delete the profile "${t}"?`)){const C={...u};delete C[t],G(C),localStorage.setItem("vaiswanara_profiles",JSON.stringify(C))}},title:"Delete",style:{background:"#fdedec",border:"1px solid #e74c3c",color:"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"🗑️"})]})]},t))})]})]})})]})}function De(c,o,a,g,p){const r={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"},i={};for(const[l,f]of Object.entries(c)){const s=o?o[l]?.rashi??f.rashi:f.rashi;i[l]={rashi:s,retrograde:f.retrograde,combust:f.combust}}const n=i.Ascendant?.rashi??1;let k=`<svg width="280px" height="280px" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff;">
    <rect width="280" height="280" fill="white" stroke="#8e44ad" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="280" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="280" x2="280" y2="0" stroke="#ccc" stroke-width="1"/>
    <line x1="${280/2}" y1="0" x2="0" y2="${280/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${280/2}" x2="${280/2}" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="${280/2}" y1="280" x2="280" y2="${280/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="280" y1="${280/2}" x2="${280/2}" y2="0" stroke="#ccc" stroke-width="1"/>`;const w={1:{rashi:{x:140,y:30},planets:{x:140,y:80}},2:{rashi:{x:70,y:22},planets:{x:70,y:48}},3:{rashi:{x:22,y:70},planets:{x:48,y:70}},4:{rashi:{x:30,y:140},planets:{x:80,y:140}},5:{rashi:{x:22,y:210},planets:{x:48,y:210}},6:{rashi:{x:70,y:258},planets:{x:70,y:232}},7:{rashi:{x:140,y:250},planets:{x:140,y:200}},8:{rashi:{x:210,y:258},planets:{x:210,y:232}},9:{rashi:{x:258,y:210},planets:{x:232,y:210}},10:{rashi:{x:250,y:140},planets:{x:200,y:140}},11:{rashi:{x:258,y:70},planets:{x:232,y:70}},12:{rashi:{x:210,y:22},planets:{x:210,y:48}}};for(let l=1;l<=12;l++){const f=(n+l-2)%12+1,s=w[l];k+=`<text x="${s.rashi.x}" y="${s.rashi.y}" font-size="10.5" font-weight="bold" fill="#7f8c8d" text-anchor="middle" dominant-baseline="middle">${f}</text>`;const x=Object.entries(i).filter(([b,$])=>$.rashi===f).map(([b,$])=>({name:b,label:r[b]||b,retrograde:$.retrograde,combust:$.combust}));if(x.length>0){const b=[];for(let M=0;M<x.length;M+=3)b.push(x.slice(M,M+3));b.forEach((M,A)=>{let T=s.planets.y;b.length===2?T=s.planets.y-5+A*10:b.length===3?T=s.planets.y-10+A*10:b.length>3&&(T=s.planets.y-15+A*10),M.forEach((R,N)=>{const v=R.retrograde?"#2980b9":R.combust?"#c0392b":"#2c3e50",D=p(R.label);let m=s.planets.x;M.length===2?m=N===0?s.planets.x-12:s.planets.x+12:M.length===3&&(m=N===0?s.planets.x-18:N===1?s.planets.x:s.planets.x+18),k+=`<text x="${m}" y="${T}" font-size="10.5" font-weight="900" fill="${v}" text-anchor="middle" dominant-baseline="middle">${D}`,R.retrograde&&(k+="R"),R.combust&&(k+="c"),k+="</text>"})})}}return k+=`<rect x="95" y="102" width="90" height="36" rx="4" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="140" y="116" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${p(a)}</text>
  <text x="140" y="128" font-size="9" fill="#666" text-anchor="middle">${g}</text>`,k+="</svg>",k}function le(c,o,a,g,p){if((localStorage.getItem("vaiswanara_chart_style")||"south")==="north")return De(c,o,a,g,p);const r=280,i=70,n=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],k={};for(let s=1;s<=12;s++)k[s]=[];let w=c.Ascendant?.rashi??1;o&&o.Ascendant&&(w=o.Ascendant.rashi);for(const[s,x]of Object.entries(c)){const b=o?o[s]?.rashi??x.rashi:x.rashi;k[b]||(k[b]=[]),k[b].push(s)}let l=`<svg width="${r}px" height="${r}px" viewBox="0 0 ${r} ${r}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;">
    <rect width="${r}" height="${r}" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let s=0;s<=4;s++)l+=`<line x1="${s*i}" y1="0" x2="${s*i}" y2="${r}" stroke="#333" stroke-width="0.8"/>`,l+=`<line x1="0" y1="${s*i}" x2="${r}" y2="${s*i}" stroke="#333" stroke-width="0.8"/>`;l+=`<rect x="${i}" y="${i}" width="${2*i}" height="${2*i}" fill="#fdfcf8" stroke="#111" stroke-width="1.2"/>`,a&&(g?(l+=`<text x="${r/2}" y="${r/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${a}</text>`,l+=`<text x="${r/2}" y="${r/2+12}" font-size="12" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${g}</text>`):l+=`<text x="${r/2}" y="${r/2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${a}</text>`);const f={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"};for(let s=0;s<4;s++)for(let x=0;x<4;x++){const b=n[s][x];if(b===null)continue;const $=x*i,M=s*i,A=b===w;A&&(l+=`<rect x="${$+1}" y="${M+1}" width="${i-2}" height="${i-2}" fill="rgba(108, 92, 231, 0.1)"/>`),A&&(l+=`<text x="${$+3}" y="${M+i-4}" font-weight="bold" font-size="14" fill="#6c5ce7">${p("Lg")}</text>`);const T=k[b].filter(R=>R!=="Ascendant");if(T.length>0){const N=[];for(let D=0;D<T.length;D+=2)N.push(T.slice(D,D+2));const v=M+i/2-(N.length-1)*17/2+5;N.forEach((D,m)=>{const z=v+m*17;D.forEach((u,G)=>{const B=c[u]?.retrograde,J=c[u]?.combust,U=p(f[u]||u),q=B?"#d35400":J?"#8e44ad":"#2d3436",K=J||B?"bold":"normal";let j=$+i/2;D.length===2&&(j=G===0?$+i/2-16:$+i/2+16),l+=`<text x="${j}" y="${z}" font-size="14" font-weight="${K}" text-anchor="middle" fill="${q}">${U}</text>`,B&&(l+=`<text x="${j+10}" y="${z-5}" font-size="6.5" font-weight="bold" fill="#d35400">R</text>`),J&&(l+=`<text x="${j+10}" y="${z+6}" font-size="6.5" font-weight="bold" fill="#8e44ad">C</text>`)})})}}return l+="</svg>",l}export{Te as MatchPage};
