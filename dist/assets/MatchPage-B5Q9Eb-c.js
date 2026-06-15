import{u as Ne,r as A,j as e}from"./vendor-DGJAU7LJ.js";import{L as ze}from"./LocationAutocomplete-BUqDlnxv.js";import{P as Ce,R as he}from"./PredictionPanel-BT-zOPsO.js";import{A as Ae,a as De}from"./index-4QWafhvJ.js";const ee=[{n:1,name:"Ashwini",gana:"Deva",nadi:"Aadi",yoni:"Horse"},{n:2,name:"Bharani",gana:"Manushya",nadi:"Madhya",yoni:"Elephant"},{n:3,name:"Krittika",gana:"Rakshasa",nadi:"Antya",yoni:"Sheep"},{n:4,name:"Rohini",gana:"Manushya",nadi:"Aadi",yoni:"Serpent"},{n:5,name:"Mrigashira",gana:"Deva",nadi:"Madhya",yoni:"Serpent"},{n:6,name:"Arudra",gana:"Manushya",nadi:"Antya",yoni:"Dog"},{n:7,name:"Punarvasu",gana:"Deva",nadi:"Aadi",yoni:"Cat"},{n:8,name:"Pushya",gana:"Deva",nadi:"Madhya",yoni:"Sheep"},{n:9,name:"Ashlesha",gana:"Rakshasa",nadi:"Antya",yoni:"Cat"},{n:10,name:"Magha",gana:"Rakshasa",nadi:"Aadi",yoni:"Rat"},{n:11,name:"Purva Phalguni",gana:"Manushya",nadi:"Madhya",yoni:"Rat"},{n:12,name:"Uttara Phalguni",gana:"Manushya",nadi:"Antya",yoni:"Cow"},{n:13,name:"Hasta",gana:"Deva",nadi:"Aadi",yoni:"Buffalo"},{n:14,name:"Chitra",gana:"Rakshasa",nadi:"Madhya",yoni:"Tiger"},{n:15,name:"Swati",gana:"Deva",nadi:"Antya",yoni:"Buffalo"},{n:16,name:"Vishakha",gana:"Rakshasa",nadi:"Aadi",yoni:"Tiger"},{n:17,name:"Anuradha",gana:"Deva",nadi:"Madhya",yoni:"Deer"},{n:18,name:"Jyeshtha",gana:"Rakshasa",nadi:"Antya",yoni:"Deer"},{n:19,name:"Mula",gana:"Rakshasa",nadi:"Aadi",yoni:"Dog"},{n:20,name:"Purva Ashadha",gana:"Manushya",nadi:"Madhya",yoni:"Monkey"},{n:21,name:"Uttara Ashadha",gana:"Manushya",nadi:"Antya",yoni:"Mongoose"},{n:22,name:"Shravana",gana:"Deva",nadi:"Aadi",yoni:"Monkey"},{n:23,name:"Dhanishta",gana:"Rakshasa",nadi:"Madhya",yoni:"Lion"},{n:24,name:"Shatabhisha",gana:"Rakshasa",nadi:"Antya",yoni:"Horse"},{n:25,name:"Purva Bhadrapada",gana:"Manushya",nadi:"Aadi",yoni:"Lion"},{n:26,name:"Uttara Bhadrapada",gana:"Manushya",nadi:"Madhya",yoni:"Cow"},{n:27,name:"Revati",gana:"Deva",nadi:"Antya",yoni:"Elephant"}],re=["","Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"],ie=[null,"Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"],xe={Horse:"Ashwa",Elephant:"Gaja",Sheep:"Mesha",Serpent:"Sarpa",Dog:"Shwana",Cat:"Marjara",Rat:"Mushaka",Cow:"Govu",Buffalo:"Mahisha",Tiger:"Vyaghra",Deer:"Mriga",Monkey:"Vanara",Mongoose:"Nakula",Lion:"Simha"},ge={Horse:"Horse",Elephant:"Elephant",Sheep:"Sheep",Serpent:"Serpent",Dog:"Dog",Cat:"Cat",Rat:"Rat",Cow:"Cow",Buffalo:"Buffalo",Tiger:"Tiger",Deer:"Deer",Monkey:"Monkey",Mongoose:"Lion",Lion:"Mongoose"},me={Horse:"Buffalo",Buffalo:"Horse",Dog:"Deer",Deer:"Dog",Rat:"Cat",Cat:"Rat",Cow:"Tiger",Tiger:"Cow",Elephant:"Lion",Lion:"Elephant",Sheep:"Mongoose",Mongoose:"Sheep",Monkey:"Serpent",Serpent:"Monkey"},fe={Sun:{Moon:1,Mars:1,Jupiter:1,Mercury:0,Venus:-1,Saturn:-1},Moon:{Sun:1,Mercury:1,Mars:0,Jupiter:0,Venus:0,Saturn:0},Mars:{Sun:1,Moon:1,Jupiter:1,Venus:0,Saturn:0,Mercury:-1},Mercury:{Sun:1,Venus:1,Mars:0,Jupiter:0,Saturn:0,Moon:-1},Jupiter:{Sun:1,Moon:1,Mars:1,Saturn:0,Mercury:-1,Venus:-1},Venus:{Mercury:1,Saturn:1,Mars:0,Jupiter:0,Sun:-1,Moon:-1},Saturn:{Mercury:1,Venus:1,Jupiter:0,Sun:-1,Moon:-1,Mars:-1}},be=new Set([2,4,6,8,9]),se=["","Janma","Sampat","Vipat","Kshema","Pratyari","Sadhaka","Vadha","Mitra","Parama Mitra"],ue={1:"Kshatriya",2:"Vaishya",3:"Shudra",4:"Brahmin",5:"Kshatriya",6:"Vaishya",7:"Shudra",8:"Brahmin",9:"Kshatriya",10:"Vaishya",11:"Shudra",12:"Brahmin"},ye={Brahmin:4,Kshatriya:3,Vaishya:2,Shudra:1},we={1:"Chatushpada",2:"Chatushpada",3:"Manava",4:"Jalachara",5:"Vanachara",6:"Manava",7:"Manava",8:"Keeta",9:"Manava",10:"Chatushpada",11:"Manava",12:"Jalachara"};function ve(l){const n=String(l||"").trim().toLowerCase(),x={ardra:"Arudra",arudra:"Arudra",dhanishtha:"Dhanishta",dhanishta:"Dhanishta","purva bhadra":"Purva Bhadrapada","uttara bhadra":"Uttara Bhadrapada"}[n]||ee.find(p=>p.name.toLowerCase()===n)?.name;return ee.find(p=>p.name===x)||null}function ke(l,n){return Math.ceil(((l-1)*4+n)/9)}function Se(l,n){const t=ee.findIndex(p=>p.name.toLowerCase()===l.toLowerCase());if(t===-1)return null;const x=t%3;return x===0?["Aadi","Madhya","Antya","Antya"][n-1]:x===1?["Madhya","Aadi","Aadi","Madhya"][n-1]:x===2?["Antya","Antya","Madhya","Aadi"][n-1]:null}function je(l,n){if(!l||!n)return 0;if(l===n)return 5;const t=fe[l]?.[n]??0,x=fe[n]?.[l]??0;return t===1&&x===1?5:t===1&&x===0||t===0&&x===1?4:t===0&&x===0?3:t===1&&x===-1||t===-1&&x===1?1:t===0&&x===-1||t===-1&&x===0?.5:0}const K={Sun:"Surya",Moon:"Chandra",Mars:"Kuja",Mercury:"Budha",Jupiter:"Guru",Venus:"Shukra",Saturn:"Shani"};function Me(l,n){const t=l.boy?.moon?.nakshatra,x=parseInt(l.boy?.moon?.pada||1,10),p=l.girl?.moon?.nakshatra,H=parseInt(l.girl?.moon?.pada||1,10),r=ve(t),m=ve(p);if(!r||!m)return null;const o=l.boy?.chart?.navamsa_d9?.Moon?.rashi||((r.n-1)*4+(x-1))%12+1,W=l.girl?.chart?.navamsa_d9?.Moon?.rashi||((m.n-1)*4+(H-1))%12+1,c=ke(r.n,x),u=ke(m.n,H),d=[],v=[];let h=0;const D=ue[c],R=ue[u],E=ye[D]||1,$=ye[R]||1,Q=E>=$?1:0;d.push({name:"Varna",what:"Work & Spiritual Compatibility",max:1,score:Q,boyVal:n?n(D):D,girlVal:n?n(R):R});const V=we[c],N=we[u];let g=0;V===N?g=2:(V==="Manava"&&N==="Jalachara"||V==="Jalachara"&&N==="Manava")&&(g=1),d.push({name:"Vashya",what:"Dominance & Influence",max:2,score:g,boyVal:n?n(V):V,girlVal:n?n(N):N});const G=(m.n-r.n+27)%27+1,b=(r.n-m.n+27)%27+1,k=(G-1)%9+1,y=(b-1)%9+1,I=be.has(k),z=be.has(y),X=I&&z?3:I||z?1.5:0;d.push({name:"Tara",what:"Destiny & Health",max:3,score:X,boyVal:n?n(se[k]):se[k],girlVal:n?n(se[y]):se[y]});const F=xe[r.yoni]||r.yoni,Y=xe[m.yoni]||m.yoni;let L=2;r.yoni===m.yoni?L=4:ge[r.yoni]===m.yoni||ge[m.yoni]===r.yoni?L=3:(me[r.yoni]===m.yoni||me[m.yoni]===r.yoni)&&(L=0),d.push({name:"Yoni",what:"Physical Compatibility",max:4,score:L,boyVal:n?n(F):F,girlVal:n?n(Y):Y});const j=ie[c],P=ie[u],w=je(j,P);let ae=n?n(j):j,Z=n?n(P):P,te=w;if(w<3&&o&&W){const f=ie[o],s=ie[W],M=je(f,s);ae+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${n?n(f):f})</span>`,Z+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(D9: ${n?n(s):s})</span>`,te+=`<br><span style="font-size:0.8rem; color:#27ae60;">(Amsha: ${M})</span>`,M>=4&&v.push(`<strong>Amsha Maitri:</strong> Navamsha Moon-sign lords (${K[f]} and ${K[s]}) are friendly.`)}d.push({name:"Graha Maitri",what:"Mental Compatibility",max:5,score:w,scoreDisplay:te,boyVal:ae,girlVal:Z});let U=0;r.gana===m.gana?U=6:r.gana==="Deva"&&m.gana==="Manushya"?U=5:r.gana==="Manushya"&&m.gana==="Deva"&&(U=4),d.push({name:"Gana",what:"Nature & Temperament",max:6,score:U,boyVal:n?n(r.gana):r.gana,girlVal:n?n(m.gana):m.gana});const a=(u-c+12)%12+1,i=(c-u+12)%12+1,T=c!==u&&[[2,12],[5,9],[6,8]].some(([f,s])=>a===f&&i===s||a===s&&i===f);let _=c===u||!T?7:0;if(T&&(j===P||w>=4)){const f=j===P?K[j]||j:`${K[j]||j} & ${K[P]||P}`;v.push(`<strong>Bhakoot Dosha Cancellation:</strong> Cancelled because sign lords (${f}) are friendly or identical.`),_=7}d.push({name:"Bhakoot",what:"Wealth & Harmony",max:7,score:_,boyVal:n?n(re[c]):re[c],girlVal:n?n(re[u]):re[u]});const B=r.nadi===m.nadi;let O=B?0:8,q=n?n(r.nadi):r.nadi,oe=n?n(m.nadi):m.nadi;if(B){const f=Se(r.name,x),s=Se(m.name,H);f&&s&&(q+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${n?n(f):f})</span>`,oe+=`<br><span style="font-size:0.8rem; color:#7f8c8d;">(Amsha: ${n?n(s):s})</span>`,f!==s&&v.push(`<strong>Amsha Nadi:</strong> Boy and Girl share ${r.nadi} Nadi, but their Pada-based Amsha Nadis are different (${f} vs ${s}).`)),r.n===m.n&&x===H?v.push(`<strong>Same Nakshatra & Pada:</strong> Both share the same Nakshatra (${n?n(r.name):r.name}) and Pada (${x}), meaning they share the same Nadi energy. Nadi Dosha cancellation is not applicable here, and a detailed chart match by an experienced astrologer is recommended.`):r.n===m.n&&x!==H?(v.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they share the same Nakshatra (${n?n(r.name):r.name}) but have different quarters (Padas).`),O=8):c!==u&&j===P?(v.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis but identical Rashi lords (${K[j]||j}).`),O=8):c!==u&&w>=4&&(v.push(`<strong>Nadi Dosha Cancellation:</strong> Cancelled because they have different Rashis and their Rashi lords (${K[j]||j} and ${K[P]||P}) are friendly.`),O=8)}return d.push({name:"Nadi",what:"Health & Progeny",max:8,score:O,boyVal:q,girlVal:oe}),d.forEach(f=>h+=f.score),d.reverse(),{totalScore:h,maxScore:36,percentage:Math.round(h/36*100),compatibility:h>=27?"Excellent":h>=18?"Good":h>=10?"Average":"Low",kutas:d,exceptions:v}}function $e(){try{const l=JSON.parse(localStorage.getItem("vaiswanara_default_location"));if(l)return l}catch{}return{latitude:"13.13",longitude:"78.8",timezone:"5.5",city:""}}function pe(){const l=new Date,n=l.getFullYear(),t=String(l.getMonth()+1).padStart(2,"0"),x=String(l.getDate()).padStart(2,"0");return`${n}-${t}-${x}`}function ce(){const l=new Date,n=String(l.getHours()).padStart(2,"0"),t=String(l.getMinutes()).padStart(2,"0");return`${n}:${t}`}function Le({logoUrl:l,onNavigate:n}){const{t,i18n:x}=Ne(),[p,H]=A.useState(()=>({name:t("groom"),dob:pe(),tob:ce(),...$e()})),[r,m]=A.useState(()=>({name:t("bride"),dob:pe(),tob:ce(),...$e()})),[o,W]=A.useState(null),[c,u]=A.useState({loading:!1,error:""}),d=A.useRef(null),v=A.useRef({}),[h,D]=A.useState({isOpen:!1,type:"boy"}),[R,E]=A.useState("input"),[$,Q]=A.useState("birth"),[V,N]=A.useState(!1),[g,G]=A.useState({boyNak:"Ashwini",boyPada:1,girlNak:"Ashwini",girlPada:1}),[b,k]=A.useState({}),[y,I]=A.useState({}),[z,X]=A.useState(""),F=a=>{const i=JSON.parse(localStorage.getItem("vaiswanara_profiles")||"{}");I(i),k(a==="boy"?p:r),E("input"),X(""),D({isOpen:!0,type:a})},Y=a=>{const i=y[a];i&&(k({...b,name:a,dob:i.dob,tob:i.tob,city:i.city,latitude:i.latitude,longitude:i.longitude,timezone:i.timezone}),E("input"))},L=()=>{h.type==="boy"?H(b):m(b),D({isOpen:!1,type:"boy"})},j=()=>{const a=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");k({name:"",dob:pe(),tob:ce(),city:a?.city||"Bengaluru, India",latitude:a?.latitude||"12.9716",longitude:a?.longitude||"77.5946",timezone:a?.timezone||"5.5"}),E("input")},P=()=>{const a=b.name?.trim();if(!a||a===t("groom")||a===t("bride"))return alert("Please enter a specific Name to save this profile.");const i={...y};i[a]={...b,gender:h.type==="boy"?"male":"female"},localStorage.setItem("vaiswanara_profiles",JSON.stringify(i)),I(i),alert(`Profile "${a}" saved successfully!`)},w=a=>{if(!a)return a;let i=t("Amsha");if(i==="Amsha"&&!x.language.startsWith("en")){const S=x.language.split("-")[0];S==="te"?i="అంశ":S==="kn"&&(i="ಅಂಶ")}return String(a).replace(/\bAmsha\b/gi,i)};async function ae(){const a=JSON.stringify({boyData:p,girlData:r});if(v.current[a]){W(v.current[a]),setTimeout(()=>{d.current?.scrollIntoView({behavior:"smooth",block:"start"})},100);return}const S=JSON.parse(localStorage.getItem("eclock_prefs")||"{}").ayanamsha_val||"lahiri";u({loading:!0,error:""});try{const T=new URLSearchParams({endpoint:"match",boy_dob:p.dob,boy_tob:p.tob,boy_latitude:p.latitude,boy_longitude:p.longitude,boy_timezone:p.timezone,girl_dob:r.dob,girl_tob:r.tob,girl_latitude:r.latitude,girl_longitude:r.longitude,girl_timezone:r.timezone,ayanamsha:S,rahu_mode:localStorage.getItem("rahu_mode")||"mean"}),B=await(await fetch(`${Ae}?${T.toString()}`,{method:"GET",headers:{"x-api-token":De}})).json();if(B.error)throw new Error(B.error);const O=Me(B,t);if(!O)throw new Error("Unable to parse Nakshatra/Moon data from API response.");const q={raw:B,match:O};v.current[a]=q,W(q),u({loading:!1,error:""}),setTimeout(()=>{d.current?.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(T){u({loading:!1,error:T.message})}}const Z=a=>{Q(a),W(null),a==="nakshatra"&&N(!0)};function te(a,i,S,T){u({loading:!0,error:""});try{const _={boy:{moon:{nakshatra:a,pada:parseInt(i,10)},chart:null},girl:{moon:{nakshatra:S,pada:parseInt(T,10)},chart:null}},B=Me(_,t);if(!B)throw new Error("Unable to calculate compatibility for selected Nakshatras.");W({raw:_,match:B,isNakshatraOnly:!0}),u({loading:!1,error:""}),setTimeout(()=>{d.current?.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(_){u({loading:!1,error:_.message})}}async function U(a="download"){if(o){u({loading:!0,error:""});try{window.html2canvas||await new Promise((s,M)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",C.onload=s,C.onerror=()=>M(new Error("Failed to load html2canvas")),document.head.appendChild(C)}),window.jspdf||await new Promise((s,M)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",C.onload=s,C.onerror=()=>M(new Error("Failed to load jspdf")),document.head.appendChild(C)});let i="",S="",T="",_="";o.isNakshatraOnly||(i=le(o.raw.boy.chart.planets,null,t("Rasi Chakra"),"(D1)",t),S=le(o.raw.boy.chart.planets,o.raw.boy.chart.navamsa_d9,t("Navamsha"),"(D9)",t),T=le(o.raw.girl.chart.planets,null,t("Rasi Chakra"),"(D1)",t),_=le(o.raw.girl.chart.planets,o.raw.girl.chart.navamsa_d9,t("Navamsha"),"(D9)",t));const B=o.match.kutas.map((s,M)=>`
        <div style="display: flex; align-items: stretch; border-bottom: ${M===o.match.kutas.length-1?"none":"1px solid #dfe6e9"}; background: ${s.score===0?"#fdedec":"transparent"};">
          <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; flex-direction: column; justify-content: center;">
            <strong style="color: #2d3436;">${t(s.name)}</strong>
          </div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${w(s.boyVal)}</div></div>
          <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; word-break: break-word; display: flex; align-items: center; justify-content: center; text-align: center;"><div>${w(s.girlVal)}</div></div>
          <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; display: flex; align-items: center; justify-content: center; color: #2d3436;">${s.max}</div>
          <div style="flex: 1; padding: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10.5pt; text-align: center; color: ${s.score===0?"#c0392b":s.score>s.max/2?"#27ae60":"#f39c12"};"><div>${w(s.scoreDisplay)||s.score}</div></div>
        </div>
      `).join(""),O=o.match.exceptions.length>0||o.isNakshatraOnly?`<div style="background: ${o.match.exceptions.length>0?"#fffbeb":"#f8f9fa"}; border-left: 5px solid ${o.match.exceptions.length>0?"#f59e0b":"#bdc3c7"}; padding:15px; border-radius:4px; margin-bottom:20px;">
            <h4 style="color: ${o.match.exceptions.length>0?"#b45309":"#7f8c8d"}; margin:0 0 8px 0; font-size:11pt">${t("exceptionsNoted")}</h4>
            ${o.match.exceptions.length>0?`
            <ul style="color:#92400e; margin:0; padding-left:20px; font-size:9pt; line-height:1.5; word-wrap:break-word; word-break:break-word;">
              ${o.match.exceptions.map(s=>`<li>${w(s)}</li>`).join("")}
            </ul>
            `:`
            <div style="color:#7f8c8d; font-size:9pt; font-style:italic; padding-left:5px;">${t("noExceptionsNoted","No exceptions or special rules noted for this match.")}</div>
            `}
           </div>`:"",q=`
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
          ${l?`<img src="${l}" alt="Logo">`:""}
          <h1>${t("marriageCompatibility")}</h1>
          <h2>${t("ashtakutaResults")}</h2>
          ${!o.isNakshatraOnly&&o.raw?.ayanamsha?`<div style="font-size:10pt; color:#7f8c8d; margin-top:5px;">Ayanamsha: ${o.raw.ayanamsha}</div>`:""}
        </div>
        <div class="details-grid">
          <div class="details-box" style="border-top: 4px solid #3498db;">
            <h3 style="color:#2980b9;"> ${t("boy")}: ${p.name||t("groom")}</h3>
            ${o.isNakshatraOnly?`
            <div><strong>${t("nakshatraDataMode","Nakshatra Mode")}</strong></div>
            `:`
            <div><strong>${t("dateOfBirth")}:</strong> ${p.dob?p.dob.split("-").reverse().join("-"):"-"} &middot; ${p.tob}</div>
            <div><strong>${t("place","Place")}:</strong> ${p.city?p.city.split(",")[0]:"-"}</div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${t(o.raw.boy?.moon?.nakshatra||"-")}-${w(o.raw.boy?.moon?.pada)||"-"}, ${w(o.match.kutas.find(s=>s.name==="Bhakoot")?.boyVal)||"-"}
            </div>
          </div>
          <div class="details-box" style="border-top: 4px solid #e74c3c;">
            <h3 style="color:#c0392b;"> ${t("girl")}: ${r.name||t("bride")}</h3>
            ${o.isNakshatraOnly?`
            <div><strong>${t("nakshatraDataMode","Nakshatra Mode")}</strong></div>
            `:`
            <div><strong>${t("dateOfBirth")}:</strong> ${r.dob?r.dob.split("-").reverse().join("-"):"-"} &middot; ${r.tob}</div>
            <div><strong>${t("place","Place")}:</strong> ${r.city?r.city.split(",")[0]:"-"}</div>
            `}
            <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #ccc; font-weight: 600; color: #2d3436;">
              ${t(o.raw.girl?.moon?.nakshatra||"-")}-${w(o.raw.girl?.moon?.pada)||"-"}, ${w(o.match.kutas.find(s=>s.name==="Bhakoot")?.girlVal)||"-"}
            </div>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-around; align-items:center; padding:10px 15px; background:#f8f9fa; border:1px solid #dcdde1; border-radius:6px; margin-bottom:15px;">
          <div style="font-size:11pt; color:#2d3436; font-weight:600;">${t("totalAshtakutaScore")}</div>
          <div style="font-size:16pt; font-weight:bold; color:${o.match.totalScore>=18?"#27ae60":"#c0392b"}">
            ${o.match.totalScore} <span style="font-size:11pt; color:#7f8c8d">/ 36</span>
          </div>
          <div style="font-size:11pt; font-weight:600; color:${o.match.totalScore>=18?"#27ae60":"#c0392b"};">
            ${t("compatibility")} ${t(o.match.compatibility)} (${o.match.percentage}%)
          </div>
        </div>

        <div class="flex-table-wrapper">
          <div style="display: flex; align-items: stretch; background: #f1f2f6; border-bottom: 1.5px solid #2d3436; font-weight: 700; font-size: 8.5pt; text-transform: uppercase; color: #2d3436;">
            <div style="flex: 3; padding: 8px; border-right: 1px solid #dfe6e9;">${t("kootaFactor")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("boy")}</div>
            <div style="flex: 2.5; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("girl")}</div>
            <div style="flex: 1; padding: 8px; border-right: 1px solid #dfe6e9; text-align: center;">${t("max")}</div>
            <div style="flex: 1; padding: 8px; text-align: center;">${t("score")}</div>
          </div>
          ${B}
        </div>
        ${O}

        <div class="footer">
          <span>${t("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page","Page")} 1</span>
        </div>
      </div>
      
      ${o.isNakshatraOnly?"":`
      <!-- PAGE 2: CHARTS -->
      <div class="pdf-page">
        <div style="text-align:center; font-size:16pt; font-weight:bold; margin-bottom:25px; text-transform:uppercase; color:#2d3436; border-bottom:2px solid #2d3436; padding-bottom:10px;">${t("horoscopeCharts","Horoscope Charts")}</div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#2980b9; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;"> ${p.name||t("groom")}</div>
        <div class="charts-row">
          <div class="chart-col">${i}</div>
          <div class="chart-col">${S}</div>
        </div>
        
        <div style="text-align:center; font-size:14pt; font-weight:bold; color:#c0392b; margin-top:25px; margin-bottom:15px; border-top:1px dashed #ccc; padding-top:25px; text-transform:uppercase; letter-spacing:1px;"> ${r.name||t("bride")}</div>
        <div class="charts-row">
          <div class="chart-col">${T}</div>
          <div class="chart-col">${_}</div>
        </div>
        
        <div class="footer">
          <span>${t("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${t("Page","Page")} 2</span>
        </div>
      </div>
      `}
      </div>`,oe=window.scrollY;window.scrollTo(0,0);const f=document.createElement("div");f.innerHTML=q,f.style.position="absolute",f.style.top="0",f.style.left="0",f.style.width="794px",document.body.appendChild(f);try{await new Promise(J=>setTimeout(J,600));const s=f.querySelectorAll(".pdf-page"),M=new window.jspdf.jsPDF({orientation:"portrait",unit:"mm",format:"a4"});for(let J=0;J<s.length;J++){const ne=await window.html2canvas(s[J],{scale:2,useCORS:!0,scrollY:0,scrollX:0,windowWidth:794,width:794,height:1122});J>0&&M.addPage();const de=ne.toDataURL("image/jpeg",.98);M.addImage(de,"JPEG",0,0,210,297)}const C=`${p.name||"Boy"}_${r.name||"Girl"}_Match.pdf`.replace(/[^a-zA-Z0-9_.-]/g,"");if(a==="share"&&navigator.canShare){const J=M.output("blob"),ne=new File([J],C,{type:"application/pdf"});if(navigator.canShare({files:[ne]}))try{await navigator.share({title:"Marriage Compatibility",text:"Here is the Ashtakuta Match report generated via e-Jyotisha.",files:[ne]})}catch(de){de.name!=="AbortError"&&M.save(C)}else alert(t("shareNotSupported","Share feature is not supported on your browser. Downloading instead...")),M.save(C)}else M.save(C)}finally{document.body.removeChild(f),window.scrollTo(0,oe)}u({loading:!1,error:""})}catch(i){console.error("PDF Error:",i),u({loading:!1,error:"Failed to generate PDF."})}}}return e.jsxs("main",{className:"new-horo-page",style:{background:"transparent",minHeight:"100vh"},children:[e.jsx("style",{children:`
  
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
      `}),e.jsxs("section",{className:"workspace",style:{display:"flex",flexDirection:"column",gap:"12px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[$==="birth"?e.jsxs("div",{className:"top-bar-card",children:[e.jsxs("div",{className:"top-bar-details",onClick:()=>F("boy"),children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#3498db",marginBottom:"4px"},children:p.name||t("groom")}),e.jsxs("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsxs("span",{children:["📅 ",p.dob?p.dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",p.tob]})]})]}),e.jsx("div",{className:"top-bar-divider"}),e.jsxs("div",{className:"top-bar-details",onClick:()=>F("girl"),style:{alignItems:"flex-end",textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#e74c3c",marginBottom:"4px"},children:r.name||t("bride")}),e.jsxs("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px",alignItems:"flex-end"},children:[e.jsxs("span",{children:["📅 ",r.dob?r.dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",r.tob]})]})]})]}):e.jsxs("div",{className:"top-bar-card",onClick:()=>N(!0),children:[e.jsxs("div",{className:"top-bar-details",children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#3498db",marginBottom:"4px"},children:p.name||t("groom")}),e.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:e.jsxs("span",{children:["🌸 ",t(g.boyNak),"-",g.boyPada]})})]}),e.jsx("div",{className:"top-bar-divider"}),e.jsxs("div",{className:"top-bar-details",style:{alignItems:"flex-end",textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#e74c3c",marginBottom:"4px"},children:r.name||t("bride")}),e.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px",alignItems:"flex-end"},children:e.jsxs("span",{children:["🌸 ",t(g.girlNak),"-",g.girlPada]})})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"},children:[e.jsx("div",{style:{fontSize:"12px",color:"#7f8c8d",flex:1},children:$==="birth"?"ℹ️ Click on the Groom's or Bride's card above to change their birth date, time, or location details.":"ℹ️ Click on the card above to change Nakshatra details."}),e.jsxs("div",{className:"match-mode-toggle",style:{display:"flex",background:"#eaecee",padding:"3px",borderRadius:"8px",gap:"2px",flexShrink:0},children:[e.jsx("button",{onClick:()=>Z("birth"),title:t("birthDataMode","Date Mode"),style:{width:"36px",height:"36px",borderRadius:"6px",border:"none",background:$==="birth"?"#ffffff":"transparent",fontSize:"19px",cursor:"pointer",boxShadow:$==="birth"?"0 1px 4px rgba(0,0,0,0.12)":"none",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",padding:0,minHeight:"auto"},children:"📅"}),e.jsx("button",{onClick:()=>Z("nakshatra"),title:t("nakshatraDataMode","Nakshatra Mode"),style:{width:"36px",height:"36px",borderRadius:"6px",border:"none",background:$==="nakshatra"?"#ffffff":"transparent",fontSize:"19px",cursor:"pointer",boxShadow:$==="nakshatra"?"0 1px 4px rgba(0,0,0,0.12)":"none",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",padding:0,minHeight:"auto"},children:"⭐"})]})]}),$==="birth"&&e.jsxs("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"-8px",marginBottom:"10px"},children:[e.jsx("strong",{children:"Ayanamsha:"})," ",o?.raw?.ayanamsha||(()=>{const a=JSON.parse(localStorage.getItem("eclock_prefs")||"{}");return{lahiri:"Lahiri (Chitra Paksha)",raman:"Raman",krishnamurti:"Krishnamurti (KP)",yukteshwar:"Sri Yukteshwar",true_citra:"True Citra",fagan_bradley:"Fagan/Bradley",custom:`Custom (${a.ayanamsha_val}°)`}[a.ayanamsha_type||"lahiri"]||"Lahiri"})()]}),$==="birth"?e.jsx("button",{onClick:ae,disabled:c.loading,style:{width:"100%",padding:"14px",borderRadius:"12px",background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",border:"none",fontWeight:"bold",fontSize:"16px",cursor:c.loading?"not-allowed":"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)",marginBottom:"5px",opacity:c.loading?.8:1,transition:"transform 0.2s ease"},children:c.loading?"⏳ "+t("processingMatch","Processing Match..."):"✨ "+t("calcAshtakutaMatch","Calculate Compatibility Match")}):e.jsx("button",{onClick:()=>N(!0),style:{width:"100%",padding:"14px",borderRadius:"12px",background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)",marginBottom:"5px",transition:"transform 0.2s ease"},children:"✨ "+t("selectNakshatrasAndCalc","Select Nakshatras & Calculate")}),e.jsxs("div",{className:"results-area",ref:d,style:{marginTop:"10px",height:"auto",overflow:"visible",flexShrink:0,display:"flex",flexDirection:"column",gap:"15px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[c.error&&e.jsx("div",{className:"message error",style:{background:"#fdedec",color:"#c0392b",padding:"15px",borderRadius:"12px",border:"1px solid #f5b7b1",textAlign:"center"},children:c.error}),c.loading&&e.jsxs("div",{className:"message",style:{background:"#ffffff",color:"#2c3e50",padding:"20px",borderRadius:"14px",boxShadow:"0 4px 15px rgba(0,0,0,0.03)",textAlign:"center",border:"1px solid #eaecee"},children:["⏳ ",t("processingMatch","Processing Match Compatibility...")]}),!o&&!c.loading&&e.jsx(Ce,{title:t("readyForMatch","Ready for Compatibility Check"),text:t("enterMatchDetailsDesc","Enter birth details for both Boy and Girl to generate the Ashtakuta Marriage Compatibility report.")}),o&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"export-panel",children:[e.jsxs("button",{className:"btn-pdf",onClick:()=>U("download"),children:[e.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),t("pdf","PDF")]}),e.jsxs("button",{className:"btn-share",onClick:()=>U("share"),children:[e.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),t("share","Share")]})]}),e.jsxs("div",{className:"score-card",children:[e.jsx("h3",{style:{margin:"0 0 10px 0",color:"#7f8c8d"},children:t("totalAshtakutaScore","Total Ashtakuta Score")}),e.jsxs("div",{style:{fontSize:"3.5rem",fontWeight:"bold",color:o.match.totalScore>=18?"#27ae60":"#c0392b",lineHeight:"1.1"},children:[o.match.totalScore," ",e.jsx("span",{style:{fontSize:"1.5rem",color:"#bdc3c7"},children:"/ 36"})]}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"600",marginTop:"10px",color:o.match.totalScore>=18?"#27ae60":"#c0392b"},children:[t("compatibility","Compatibility:")," ",t(o.match.compatibility)," (",o.match.percentage,"%)"]})]}),e.jsxs("section",{className:"table-panel",children:[e.jsxs("div",{className:"match-info-summary",style:{marginTop:"5px"},children:[e.jsxs("div",{className:"match-info-card boy",children:[e.jsx("div",{className:"match-info-title boy",children:p.name||t("groom","Groom")}),e.jsxs("div",{className:"match-info-value",children:[t(o.raw.boy?.moon?.nakshatra||"-"),"-",w(o.raw.boy?.moon?.pada)||"-"]}),e.jsx("div",{className:"match-info-sub",children:w(o.match.kutas.find(a=>a.name==="Bhakoot")?.boyVal)||"-"})]}),e.jsxs("div",{className:"match-info-card girl",children:[e.jsx("div",{className:"match-info-title girl",children:r.name||t("bride","Bride")}),e.jsxs("div",{className:"match-info-value",children:[t(o.raw.girl?.moon?.nakshatra||"-"),"-",w(o.raw.girl?.moon?.pada)||"-"]}),e.jsx("div",{className:"match-info-sub",children:w(o.match.kutas.find(a=>a.name==="Bhakoot")?.girlVal)||"-"})]})]}),e.jsx("h2",{children:t("ashtakutaResults","Ashtakuta Results")}),e.jsx("div",{className:"table-scroll",children:e.jsxs("table",{className:"ashtakuta-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Koota"}),e.jsx("th",{style:{color:"#3498db",textAlign:"center"},children:"Boy"}),e.jsx("th",{style:{color:"#e74c3c",textAlign:"center"},children:"Girl"}),e.jsx("th",{className:"text-center",children:"Max"}),e.jsx("th",{className:"text-center",children:"Score"})]})}),e.jsx("tbody",{children:o.match.kutas.map(a=>e.jsxs("tr",{style:{backgroundColor:a.score===0?"#fdedec":"transparent"},children:[e.jsx("td",{"data-label":t("kootaFactor","Koota (Factor)"),children:e.jsx("strong",{style:{color:"#2c3e50"},children:t(a.name)})}),e.jsx("td",{style:{textAlign:"center",fontWeight:"600"},dangerouslySetInnerHTML:{__html:w(a.boyVal)?.replace(/\bAmsha:\s*/gi,"")}}),e.jsx("td",{style:{textAlign:"center",fontWeight:"600"},dangerouslySetInnerHTML:{__html:w(a.girlVal)?.replace(/\bAmsha:\s*/gi,"")}}),e.jsx("td",{style:{color:"#7f8c8d",textAlign:"center"},children:a.max}),e.jsx("td",{style:{fontWeight:"bold",fontSize:"1.1rem",textAlign:"center",color:a.score>a.max/2?"#27ae60":a.score===0?"#c0392b":"#f39c12"},dangerouslySetInnerHTML:{__html:w(a.scoreDisplay)?.replace(/\bAmsha:\s*/gi,"")||a.score}})]},a.name))})]})})]}),(o.match.exceptions.length>0||o.isNakshatraOnly)&&e.jsxs("div",{className:"exceptions-card",style:{background:o.match.exceptions.length>0?"#fffbeb":"#f8f9fa",borderLeft:o.match.exceptions.length>0?"5px solid #f59e0b":"5px solid #bdc3c7",padding:"16px",borderRadius:"10px",marginBottom:"20px",textAlign:"left"},children:[e.jsxs("h4",{style:{color:o.match.exceptions.length>0?"#b45309":"#7f8c8d",margin:"0 0 8px 0",fontWeight:"bold"},children:["⚠️"," ",t("exceptionsNoted","Exceptions / Special Rules Noted")]}),o.match.exceptions.length>0?e.jsx("ul",{style:{color:"#92400e",margin:0,paddingLeft:"20px",fontSize:"0.9rem",lineHeight:"1.6"},children:o.match.exceptions.map((a,i)=>e.jsx("li",{dangerouslySetInnerHTML:{__html:w(a)}},i))}):e.jsx("div",{style:{color:"#7f8c8d",fontSize:"0.9rem",fontStyle:"italic",paddingLeft:"5px"},children:t("noExceptionsNoted","No exceptions or special rules noted for this match.")})]}),!o.isNakshatraOnly&&e.jsxs("div",{className:"match-charts-container",children:[o.raw.boy?.chart?.planets&&e.jsxs("div",{className:"chart-card boy",children:[e.jsxs("h3",{style:{textAlign:"center",color:"#3498db",margin:"0 0 20px 0"},children:[p.name||t("groom","Groom")," -"," ",t("Charts","Charts")]}),e.jsx(he,{planets:o.raw.boy.chart.planets,navamsa:o.raw.boy.chart.navamsa_d9||{}})]}),o.raw.girl?.chart?.planets&&e.jsxs("div",{className:"chart-card girl",children:[e.jsxs("h3",{style:{textAlign:"center",color:"#e74c3c",margin:"0 0 20px 0"},children:[r.name||t("bride","Bride")," -"," ",t("Charts","Charts")]}),e.jsx(he,{planets:o.raw.girl.chart.planets,navamsa:o.raw.girl.chart.navamsa_d9||{}})]})]})]})]})]}),V&&e.jsx("div",{className:"popup-container",children:e.jsxs("div",{className:"popup-content",style:{maxWidth:"500px"},children:[e.jsxs("h3",{style:{marginTop:0,color:"#8e44ad",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{children:["🌸 ",t("selectNakshatraPada","Select Nakshatra & Pada")]}),e.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>N(!1),children:"❌"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[e.jsxs("div",{style:{padding:"12px",border:"1px solid #eaecee",borderRadius:"10px",background:"#f8f9fa",borderLeft:"4px solid #3498db"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#3498db",marginBottom:"10px"},children:p.name||t("groom","Groom")}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsxs("div",{style:{flex:2},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Nakshatra:"}),e.jsx("select",{value:g.boyNak,onChange:a=>G({...g,boyNak:a.target.value}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:ee.map(a=>e.jsxs("option",{value:a.name,children:[a.n,". ",t(a.name)]},a.n))})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Pada:"}),e.jsx("select",{value:g.boyPada,onChange:a=>G({...g,boyPada:parseInt(a.target.value,10)}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:[1,2,3,4].map(a=>e.jsx("option",{value:a,children:a},a))})]})]})]}),e.jsxs("div",{style:{padding:"12px",border:"1px solid #eaecee",borderRadius:"10px",background:"#f8f9fa",borderLeft:"4px solid #e74c3c"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#e74c3c",marginBottom:"10px"},children:r.name||t("bride","Bride")}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsxs("div",{style:{flex:2},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Nakshatra:"}),e.jsx("select",{value:g.girlNak,onChange:a=>G({...g,girlNak:a.target.value}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:ee.map(a=>e.jsxs("option",{value:a.name,children:[a.n,". ",t(a.name)]},a.n))})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{fontSize:"12px",color:"#7f8c8d",display:"block",marginBottom:"4px"},children:"Pada:"}),e.jsx("select",{value:g.girlPada,onChange:a=>G({...g,girlPada:parseInt(a.target.value,10)}),style:{width:"100%",padding:"8px",borderRadius:"6px",border:"1px solid #dcdde1",background:"#fff"},children:[1,2,3,4].map(a=>e.jsx("option",{value:a,children:a},a))})]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[e.jsx("button",{onClick:()=>N(!1),style:{flex:1,background:"#bdc3c7",color:"#fff",padding:"12px",borderRadius:"8px",border:"none",fontWeight:"bold",fontSize:"15px",cursor:"pointer"},children:"Cancel"}),e.jsx("button",{onClick:()=>{te(g.boyNak,g.boyPada,g.girlNak,g.girlPada),N(!1)},style:{flex:1,background:"#8e44ad",color:"#fff",padding:"12px",borderRadius:"8px",border:"none",fontWeight:"bold",fontSize:"15px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.2)"},children:"OK"})]})]})]})}),h.isOpen&&e.jsx("div",{className:"popup-container",children:e.jsxs("div",{className:"popup-content",children:[e.jsxs("h3",{style:{marginTop:0,color:h.type==="boy"?"#3498db":"#e74c3c",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{children:["✏️"," ",h.type==="boy"?t("boyDetails","Boy Details"):t("girlDetails","Girl Details")]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[e.jsx("button",{type:"button",onClick:j,style:{background:"#ebf5fb",border:`1px solid ${h.type==="boy"?"#3498db":"#e74c3c"}`,color:h.type==="boy"?"#3498db":"#e74c3c",padding:"4px 10px",borderRadius:"15px",fontSize:"12px",fontWeight:"bold",cursor:"pointer",minHeight:"auto",lineHeight:"1"},children:t("new","New")}),e.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>D({...h,isOpen:!1}),children:"❌"})]})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid #eaecee",marginBottom:"15px"},children:[e.jsx("button",{className:`popup-tab ${R==="input"?"active":""}`,onClick:()=>E("input"),children:"Manual Entry"}),e.jsx("button",{className:`popup-tab ${R==="profiles"?"active":""}`,onClick:()=>E("profiles"),children:"Saved Profiles"})]}),R==="input"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"15px"},children:[e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50"},children:["Name (to Save Profile):",e.jsx("input",{type:"text",value:b.name||"",onChange:a=>k({...b,name:a.target.value}),placeholder:"Enter name here...",style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"}})]}),e.jsxs("div",{style:{display:"flex",gap:"15px"},children:[e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Date:",e.jsx("input",{type:"date",value:b.dob||"",onChange:a=>k({...b,dob:a.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]}),e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Time:",e.jsx("input",{type:"time",value:b.tob||"",onChange:a=>k({...b,tob:a.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]})]}),e.jsx(ze,{city:b.city,onLocationSelect:a=>k({...b,city:a.city,latitude:a.latitude,longitude:a.longitude,timezone:a.timezone})}),e.jsxs("details",{style:{marginTop:"-10px",fontSize:"14px",background:"#fdfefe",padding:"12px",borderRadius:"8px",border:"1px solid #eee"},children:[e.jsx("summary",{style:{cursor:"pointer",color:"#3498db",fontWeight:"bold",outline:"none",listStyle:"none"},children:"Manual Coordinates (Lat / Lon / Tz)"}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"10px"},children:[e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lat:",e.jsx("input",{type:"text",name:"latitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:b.latitude||"",onChange:a=>k({...b,latitude:a.target.value})})]}),e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lon:",e.jsx("input",{type:"text",name:"longitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:b.longitude||"",onChange:a=>k({...b,longitude:a.target.value})})]}),e.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Tz:",e.jsx("input",{type:"text",name:"timezone",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:b.timezone||"",onChange:a=>k({...b,timezone:a.target.value})})]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[e.jsx("button",{onClick:P,style:{flex:1,background:"#27ae60",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(39, 174, 96, 0.2)"},title:"Save the current details as a new profile",children:"Save Profile"}),e.jsx("button",{onClick:L,style:{flex:1,background:h.type==="boy"?"#3498db":"#e74c3c",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:h.type==="boy"?"0 4px 10px rgba(52, 152, 219, 0.3)":"0 4px 10px rgba(231, 76, 60, 0.3)"},children:"Apply"})]})]}),R==="profiles"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("input",{type:"text",placeholder:t("searchProfiles","Search profiles..."),value:z,onChange:a=>X(a.target.value),style:{width:"100%",padding:"8px 12px",border:`1px solid ${h.type==="boy"?"#3498db":"#e74c3c"}`,borderRadius:"8px",fontSize:"14px",outline:"none",background:"#fdfefe",boxSizing:"border-box"}}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"350px",overflowY:"auto",padding:"5px 0"},children:Object.keys(y).filter(a=>{const i=h.type==="boy"?y[a].gender!=="female":y[a].gender==="female",S=z.trim()===""||a.toLowerCase().includes(z.toLowerCase())||(y[a].city||"").toLowerCase().includes(z.toLowerCase());return i&&S}).length===0?e.jsxs("p",{style:{textAlign:"center",color:"#7f8c8d",padding:"20px 0"},children:["No saved profiles found for"," ",h.type==="boy"?"Boy":"Girl","."]}):Object.keys(y).filter(a=>{const i=h.type==="boy"?y[a].gender!=="female":y[a].gender==="female",S=z.trim()===""||a.toLowerCase().includes(z.toLowerCase())||(y[a].city||"").toLowerCase().includes(z.toLowerCase());return i&&S}).map(a=>e.jsxs("div",{className:"profile-card",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",textAlign:"left",width:"100%",boxSizing:"border-box"},children:[e.jsxs("div",{onClick:()=>Y(a),style:{flex:1,cursor:"pointer",padding:"4px 0",textAlign:"left"},children:[e.jsx("strong",{style:{color:h.type==="boy"?"#3498db":"#e74c3c",fontSize:"15px",display:"block",marginBottom:"4px",textAlign:"left"},children:a}),e.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",display:"flex",flexDirection:"column",gap:"4px",textAlign:"left"},children:[e.jsxs("span",{children:["📅 ",y[a].dob?y[a].dob.split("-").reverse().join("-"):""]}),e.jsxs("span",{children:["⏰ ",y[a].tob||""]}),e.jsxs("span",{children:["📍 ",y[a].city?y[a].city.split(",")[0].trim():y[a].city||t("manualCoords","Manual Coords")]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginLeft:"10px"},children:[e.jsx("button",{onClick:i=>{i.stopPropagation(),Y(a)},title:"Edit",style:{background:"#ebf5fb",border:`1px solid ${h.type==="boy"?"#3498db":"#e74c3c"}`,color:h.type==="boy"?"#3498db":"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"✏️"}),e.jsx("button",{onClick:i=>{if(i.stopPropagation(),window.confirm(`Are you sure you want to delete the profile "${a}"?`)){const S={...y};delete S[a],I(S),localStorage.setItem("vaiswanara_profiles",JSON.stringify(S))}},title:"Delete",style:{background:"#fdedec",border:"1px solid #e74c3c",color:"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"🗑️"})]})]},a))})]})]})})]})}function le(l,n,t,x,p){const m=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],o={};for(let d=1;d<=12;d++)o[d]=[];let W=l.Ascendant?.rashi??1;n&&n.Ascendant&&(W=n.Ascendant.rashi);for(const[d,v]of Object.entries(l)){const h=n?n[d]?.rashi??v.rashi:v.rashi;o[h]||(o[h]=[]),o[h].push(d)}let c=`<svg width="280px" height="280px" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;">
    <rect width="280" height="280" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let d=0;d<=4;d++)c+=`<line x1="${d*70}" y1="0" x2="${d*70}" y2="280" stroke="#333" stroke-width="0.8"/>`,c+=`<line x1="0" y1="${d*70}" x2="280" y2="${d*70}" stroke="#333" stroke-width="0.8"/>`;c+='<rect x="70" y="70" width="140" height="140" fill="#fdfcf8" stroke="#111" stroke-width="1.2"/>',t&&(x?(c+=`<text x="${280/2}" y="${280/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${t}</text>`,c+=`<text x="${280/2}" y="${280/2+12}" font-size="12" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${x}</text>`):c+=`<text x="${280/2}" y="${280/2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${t}</text>`);const u={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"};for(let d=0;d<4;d++)for(let v=0;v<4;v++){const h=m[d][v];if(h===null)continue;const D=v*70,R=d*70,E=h===W;E&&(c+=`<rect x="${D+1}" y="${R+1}" width="68" height="68" fill="rgba(108, 92, 231, 0.1)"/>`),E&&(c+=`<text x="${D+3}" y="${R+70-4}" font-weight="bold" font-size="14" fill="#6c5ce7">${p("Lg")}</text>`);const $=o[h].filter(Q=>Q!=="Ascendant");if($.length>0){const V=[];for(let g=0;g<$.length;g+=2)V.push($.slice(g,g+2));const N=R+70/2-(V.length-1)*17/2+5;V.forEach((g,G)=>{const b=N+G*17;g.forEach((k,y)=>{const I=l[k]?.retrograde,z=l[k]?.combust,X=p(u[k]||k),F=I?"#d35400":z?"#8e44ad":"#2d3436",Y=z||I?"bold":"normal";let L=D+70/2;g.length===2&&(L=y===0?D+70/2-16:D+70/2+16),c+=`<text x="${L}" y="${b}" font-size="14" font-weight="${Y}" text-anchor="middle" fill="${F}">${X}</text>`,I&&(c+=`<text x="${L+10}" y="${b-5}" font-size="6.5" font-weight="bold" fill="#d35400">R</text>`),z&&(c+=`<text x="${L+10}" y="${b+6}" font-size="6.5" font-weight="bold" fill="#8e44ad">C</text>`)})})}}return c+="</svg>",c}export{Le as MatchPage};
