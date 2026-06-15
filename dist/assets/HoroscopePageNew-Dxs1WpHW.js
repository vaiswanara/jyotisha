import{u as I,j as t,r as N}from"./vendor-DGJAU7LJ.js";import{L as wt}from"./LocationAutocomplete-BUqDlnxv.js";import{f as ut}from"./index-4QWafhvJ.js";import{R as vt,P as jt}from"./PredictionPanel-BT-zOPsO.js";function ft(o){const a=Number(o);if(!Number.isFinite(a))return"-";const e=Math.floor(a),n=(a-e)*60,i=Math.floor(n);return`${e}° ${i.toString().padStart(2,"0")}'`}function St({planets:o={},hideTitle:a=!1}){const{t:e}=I(),n=Object.entries(o).filter(([,i])=>i&&i.rashi);return t.jsxs("section",{className:"table-panel",children:[!a&&t.jsx("h2",{children:e("grahaPositions","Graha Positions")}),t.jsx("div",{className:"table-scroll",children:t.jsxs("table",{children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:e("Planet")}),t.jsx("th",{children:e("Degree")}),t.jsx("th",{children:e("Nakshatra")}),t.jsx("th",{children:e("Pada")})]})}),t.jsx("tbody",{children:n.map(([i,d])=>t.jsxs("tr",{children:[t.jsxs("td",{"data-label":e("Planet"),children:[e(i),d.retrograde&&t.jsx("span",{style:{color:"#d35400",fontWeight:"bold",marginLeft:"4px"},title:"Retrograde",children:"R"}),d.combust&&t.jsx("span",{style:{color:"#8e44ad",fontWeight:"bold",marginLeft:"4px"},title:"Combust",children:"C"})]}),t.jsx("td",{"data-label":e("Degree"),children:ft(d.degree)}),t.jsx("td",{"data-label":e("Nakshatra"),children:d.nakshatra?e(d.nakshatra):"-"}),t.jsx("td",{"data-label":e("Pada"),children:d.pada||"-"})]},i))})]})})]})}const dt={Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17,Ketu:7,Venus:20},K=["Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury","Ketu","Venus"],pt=365.2425*24*60*60*1e3;function kt({dashas:o=[]}){const{t:a}=I(),e=bt(o),n=Dt(e);return e.length?t.jsxs("section",{className:"dasha-panel",children:[t.jsxs("div",{className:"section-heading",children:[t.jsxs("div",{children:[t.jsx("p",{className:"eyebrow",children:a("Dasha Timeline")}),t.jsx("h2",{children:a("Vimshottari Dasha")})]}),t.jsx("span",{children:new Date().toLocaleDateString("en-IN")})]}),n.maha&&t.jsxs("div",{className:"current-dasha-card",children:[t.jsx(ot,{label:a("Maha Dasha"),item:n.maha,t:a}),t.jsx(ot,{label:a("Antar Dasha"),item:n.antar,t:a}),t.jsx(ot,{label:a("Pratyantar Dasha"),item:n.pratyantar,t:a})]}),t.jsx("div",{className:"dasha-tree",children:e.map(i=>{const d=n.maha?.id===i.id;return t.jsxs("details",{className:`dasha-node maha${d?" current":""}`,open:d,children:[t.jsxs("summary",{children:[t.jsx("span",{children:a(i.planet)}),t.jsx("small",{children:yt(i.start,i.end)})]}),t.jsx("div",{className:"dasha-children",children:i.antardashas.map(c=>{const p=n.antar?.id===c.id;return t.jsxs("details",{className:`dasha-node antar${p?" current":""}`,open:p,children:[t.jsxs("summary",{children:[t.jsx("span",{children:a(c.planet)}),t.jsxs("small",{children:["Ends ",tt(c.end)]})]}),t.jsx("div",{className:"dasha-children compact",children:c.pratyantaraDashas.map(l=>t.jsxs("div",{className:`dasha-leaf${n.pratyantar?.id===l.id?" current":""}`,children:[t.jsx("span",{children:a(l.planet)}),t.jsx("small",{children:tt(l.end)})]},l.id))})]},c.id)})})]},i.id)})})]}):t.jsxs("section",{className:"dasha-panel",children:[t.jsx("h2",{children:a("Vimshottari Dasha")}),t.jsx("p",{className:"empty-text",children:a("dashaUnavailable")})]})}function ot({label:o,item:a,t:e}){return t.jsxs("div",{children:[t.jsx("span",{children:o}),t.jsx("strong",{children:a?e(a.planet):"-"}),t.jsx("small",{children:a?yt(a.start,a.end):""})]})}function bt(o){const a=o.map((e,n)=>({...e,id:`md-${n}`,planet:e.planet||e.lord,start:e.start,end:e.end,balance:e.balance,antardashas:(e.antardashas||[]).map((i,d)=>({...i,id:`md-${n}-ad-${d}`,planet:i.planet||i.lord,start:i.start,end:i.end,pratyantaraDashas:(i.pratyantara_dashas||i.pratyantardashas||[]).map((c,p)=>({...c,id:`md-${n}-ad-${d}-pd-${p}`,planet:c.planet||c.lord,start:c.start,end:c.end}))}))}));return $t(a)}function $t(o){if(!o.length)return o;const a=o[0],e=dt[a.planet],n=Q(a.end);if(!e||!n)return o;const i=n.getTime()-e*pt;return[{...a,start:U(i),antardashas:zt(i,a.planet,e,a.id)},...o.slice(1)]}function zt(o,a,e,n){const i=[];let d=o,c=K.indexOf(a);c===-1&&(c=0);for(let p=0;p<K.length;p+=1){const l=K[(c+p)%K.length],h=e*dt[l]/120,y=d+h*pt,w=`${n}-ad-${p}`;i.push({id:w,planet:l,start:U(d),end:U(y),pratyantaraDashas:Nt(d,l,h,w)}),d=y}return i}function Nt(o,a,e,n){const i=[];let d=o,c=K.indexOf(a);c===-1&&(c=0);for(let p=0;p<K.length;p+=1){const l=K[(c+p)%K.length],h=e*dt[l]/120,y=d+h*pt;i.push({id:`${n}-pd-${p}`,planet:l,start:U(d),end:U(y)}),d=y}return i}function Dt(o){const a=new Date,e={maha:null,antar:null,pratyantar:null};for(const n of o)if(it(a,n.start,n.end)){e.maha=n;for(const i of n.antardashas)if(it(a,i.start,i.end)){e.antar=i;for(const d of i.pratyantaraDashas)if(it(a,d.start,d.end)){e.pratyantar=d;break}break}break}return e}function it(o,a,e){const n=Q(a),i=Q(e);return!n||!i?!1:o>=n&&o<i}function Q(o){if(!o)return null;const a=new Date(`${o}T00:00:00`);return Number.isNaN(a.getTime())?null:a}function yt(o,a){return`${tt(o)} - ${tt(a)}`}function tt(o){const a=Q(o);return a?a.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"-"}function U(o){const a=o instanceof Date?o:new Date(o),e=a.getFullYear(),n=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${e}-${n}-${i}`}function At({shadabala:o}){const{t:a}=I();if(!o)return null;const e=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];return t.jsxs("section",{className:"table-panel",children:[t.jsx("h2",{children:a("Shadabala","Shadabala (Planetary Strength)")}),t.jsx("div",{className:"table-scroll",style:{overflowX:"auto",maxWidth:"100%"},children:t.jsxs("table",{children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:a("Planet")}),t.jsx("th",{children:a("Sthana")}),t.jsx("th",{children:a("Dig")}),t.jsx("th",{children:a("Kala")}),t.jsx("th",{children:a("Chesta")}),t.jsx("th",{children:a("Naisargika")}),t.jsx("th",{children:a("Drig")}),t.jsx("th",{children:a("Total Rupas")})]})}),t.jsx("tbody",{children:e.map(n=>{if(!o[n])return null;const i=o[n],d=Math.min(100,i.total_rupas/300*100);return t.jsxs("tr",{children:[t.jsx("td",{"data-label":a("Planet"),children:t.jsx("span",{className:"planet-name",children:a(n)})}),t.jsx("td",{"data-label":a("Sthana"),className:"deg-val",children:i.sthana_bala}),t.jsx("td",{"data-label":a("Dig"),className:"deg-val",children:i.dig_bala}),t.jsx("td",{"data-label":a("Kala"),className:"deg-val",children:i.kala_bala}),t.jsx("td",{"data-label":a("Chesta"),className:"deg-val",children:i.chesta_bala}),t.jsx("td",{"data-label":a("Naisargika"),className:"deg-val",children:i.naisargika_bala}),t.jsx("td",{"data-label":a("Drig"),className:"deg-val",children:i.drig_bala}),t.jsx("td",{"data-label":a("Total Rupas"),children:t.jsxs("div",{className:"strength-bar-wrap",children:[t.jsx("div",{className:"strength-bar",children:t.jsx("div",{className:"strength-bar-fill",style:{width:`${d}%`}})}),t.jsx("span",{className:"strength-val",children:i.total_rupas})]})})]},n)})})]})})]})}const Tt={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sh"},Pt=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]];function Ct({ashtakavarga:o}){const{t:a}=I(),[e,n]=N.useState("Sarva");if(!o)return null;const{prastarashtakavarga:i,sarvashtakavarga:d}=o,c=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"],p=(l,h)=>{const y=h?"SAV":`${a(e)} BAV`;return t.jsxs("div",{className:"south-chart",style:{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gridTemplateRows:"repeat(4, minmax(0, 1fr))",width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"1rem auto 0 auto",border:"2px solid #8e44ad",boxSizing:"border-box"},children:[Pt.flatMap((w,u)=>w.map((b,v)=>{if(b===null)return null;const k=h?l[b]?.points??0:l[b]??0;let A="";return h?A=k>=28?"high":k<20?"low":"":A=k>=5?"high":k<=2?"low":"",t.jsx("div",{className:"south-chart-cell",style:{gridColumn:v+1,gridRow:u+1,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #ccc",minWidth:0,minHeight:0},children:t.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:t.jsx("strong",{className:`akv-pts ${A}`,style:{fontSize:"1.4rem"},children:k})})},`${u}-${v}`)})),t.jsxs("div",{className:"south-chart-center",style:{gridColumn:"2 / 4",gridRow:"2 / 4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",background:"#f9f0ff"},children:[t.jsx("strong",{style:{fontSize:"clamp(14px, 4vw, 20px)"},children:y}),t.jsx("span",{style:{fontSize:"clamp(10px, 3vw, 14px)",marginTop:"4px",color:"#7a6e60"},children:h?a("sarvashtakavarga","(Sarvashtakavarga)"):a("bhinnashtakavarga","(Bhinnashtakavarga)")})]})]})};return t.jsxs("section",{className:"table-panel",children:[t.jsx("h2",{children:a("ashtakavarga","Ashtakavarga")}),t.jsxs("div",{className:"akv-planet-tabs",style:{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"15px"},children:[t.jsx("button",{type:"button",className:`akv-tab akv-sarva-btn ${e==="Sarva"?"active":""}`,onClick:()=>n("Sarva"),style:{width:"100%",padding:"12px 16px",fontSize:"15px",fontWeight:"600",borderRadius:"10px",border:"2px solid #e0e0e0",background:e==="Sarva"?"#8e44ad":"#f9f0ff",color:e==="Sarva"?"#fff":"#8e44ad",cursor:"pointer",transition:"all 0.2s ease"},children:a("sarvaTotal","Sarva (Total)")}),t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px",justifyContent:"center"},children:c.map(l=>t.jsx("button",{type:"button",className:`akv-tab akv-planet-btn ${e===l?"active":""}`,onClick:()=>n(l),style:{width:"42px",height:"40px",padding:"0",fontSize:"13px",fontWeight:"600",borderRadius:"8px",border:"2px solid #e0e0e0",background:e===l?"#8e44ad":"#fff",color:e===l?"#fff":"#8e44ad",cursor:"pointer",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",minWidth:"42px"},title:a(l),children:Tt[l]},l))})]}),t.jsx("div",{id:"akv-tables",children:e==="Sarva"?p(d,!0):p(i[e]||{},!1)})]})}const st=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"],q={Sun:"Surya",Moon:"Chandra",Mars:"Kuja",Mercury:"Budha",Jupiter:"Guru",Venus:"Sukra",Saturn:"Shani",Rahu:"Rahu",Ketu:"Ketu"},Rt={1:"Mars",2:"Venus",3:"Mercury",4:"Moon",5:"Sun",6:"Mercury",7:"Venus",8:"Mars",9:"Jupiter",10:"Saturn",11:"Saturn",12:"Jupiter"};function Mt(o,a){if(o==="Rahu"||o==="Ketu")return"-";let e=[];for(let i=1;i<=12;i++)Rt[i]===o&&e.push(i);return e.length===0?"-":e.map(i=>(i-a+12)%12+1).join(", ")}function _t(o,a,e){const n=q[o];if(e){let d=e[n]||e[o];if(Array.isArray(d))return d.includes(a)?"Shubha":"Ashubha";if(d&&typeof d=="object")return d[a.toString()]||"Unknown"}const i={Sun:[3,6,10,11],Moon:[1,3,6,7,10,11],Mars:[3,6,11],Mercury:[2,4,6,8,10,11],Jupiter:[2,5,7,9,11],Venus:[1,2,3,4,5,8,9,11,12],Saturn:[3,6,11],Rahu:[3,6,11],Ketu:[3,6,11]};return i[o]?i[o].includes(a)?"Shubha":"Ashubha":"-"}function Lt(o,a,e,n){if(!n)return"-";const i=q[o];let d=n.find(c=>{let p=Object.keys(c).find(l=>l.replace(/^\uFEFF/,"")==="Graha");return p?c[p]===i&&String(c.Gochara)===String(a):!1});return d&&d[e]||"-"}function Bt(o,a,e,n,i){const d={Sun:{3:9,6:12,10:4,11:5},Moon:{1:5,3:9,6:12,7:2,10:4,11:8},Mars:{3:12,6:9,11:5},Mercury:{2:5,4:3,6:9,8:1,10:8,11:12},Jupiter:{2:12,5:4,7:3,9:10,11:8},Venus:{1:8,2:7,3:1,4:10,5:9,8:5,9:11,11:6,12:3},Saturn:{3:12,6:9,11:5},Rahu:{3:12,6:9,11:5},Ketu:{3:12,6:9,11:5}},c={};for(let b in d){c[b]={};for(let v in d[b])c[b][d[b][v]]=parseInt(v)}const p={Sun:["Saturn"],Saturn:["Sun"],Moon:["Mercury"],Mercury:["Moon"]};let l=d[o]&&d[o][a],h=!1;if(l||(l=c[o]&&c[o][a],l&&(h=!0)),!l)return{text:"-",color:"#333",hasVedha:!1};let y=(n+l-2)%12+1,w=[],u=p[o]||[];if(Object.entries(e).forEach(([b,v])=>{v===y&&b!==o&&b!=="Ascendant"&&!u.includes(b)&&w.push(i(b,q[b]||b))}),w.length>0){const b=w.join(", ");return h?{text:i("vamaVedhaBy","Vama Vedha by {{planets}}",{planets:b}),color:"#27ae60",hasVedha:!0,isVama:!0}:{text:i("vedhaBy","Vedha by {{planets}}",{planets:b}),color:"#e74c3c",hasVedha:!0,isVama:!1}}return{text:"-",color:"#333",hasVedha:!1}}const Wt=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],lt={Ascendant:"Lg",Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke"};function Vt(o,a){return Object.entries(o||{}).filter(([e,n])=>Number(n?.rashi)===a).map(([e,n])=>({name:e,label:lt[e]||e,retrograde:!!n.retrograde,combust:!!n.combust}))}function ct({planets:o,title:a,subtitle:e,t:n,borderColor:i,centerBg:d}){return t.jsxs("div",{className:"south-chart",style:{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gridTemplateRows:"repeat(4, minmax(0, 1fr))",width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"0 auto",border:`2px solid ${i}`,boxSizing:"border-box",background:"#fff",boxShadow:"0 4px 10px rgba(0,0,0,0.05)",borderRadius:"4px"},children:[Wt.flatMap((c,p)=>c.map((l,h)=>{if(l===null)return null;const y=Vt(o,l),w=y.length;let u="clamp(13px, 4.5vw, 19px)",b="4px";return w===4?(u="clamp(11.5px, 3.5vw, 16px)",b="3px"):w===5?(u="clamp(10px, 3vw, 14px)",b="2px"):w>=6&&(u="clamp(9px, 2.5vw, 12px)",b="1px"),t.jsx("div",{className:"south-chart-cell",style:{gridColumn:h+1,gridRow:p+1,border:"1px solid #e0e0e0",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxSizing:"border-box",minWidth:0,minHeight:0},children:t.jsx("div",{className:"planet-cluster",style:{display:"flex",flexWrap:"wrap",alignContent:"center",justifyContent:"center",gap:b,width:"100%",height:"100%"},children:y.map(v=>t.jsxs("span",{className:`planet-token${v.retrograde?" is-retrograde":""}${v.combust?" is-combust":""}`,style:{fontSize:u,lineHeight:1.1,fontWeight:700,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",justifyContent:"center",width:w>=4?"45%":"auto",color:v.retrograde?"#d35400":v.combust?"#8e44ad":"#2d3436"},children:[n(v.label,v.label),v.retrograde&&t.jsx("sup",{style:{fontSize:"0.65em",color:"#d35400",marginLeft:"1px",fontWeight:"bold"},children:"R"}),v.combust&&t.jsx("sub",{style:{fontSize:"0.65em",color:"#8e44ad",marginLeft:"1px",fontWeight:"bold"},children:"c"})]},v.name))})},`${p}-${h}`)})),t.jsxs("div",{className:"south-chart-center",style:{gridColumn:"2 / 4",gridRow:"2 / 4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",background:d,border:`1px solid ${i}20`},children:[t.jsx("strong",{style:{fontSize:"clamp(14px, 4vw, 20px)",color:i},children:n(a,a)}),t.jsx("span",{style:{fontSize:"clamp(10px, 3vw, 14px)",color:"#666",marginTop:"4px"},children:e})]})]})}function Et({natalData:o,formData:a}){const{t:e,i18n:n}=I(),[i,d]=N.useState(()=>{const s=new Date;return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`}),[c,p]=N.useState(()=>{const s=new Date;return`${String(s.getHours()).padStart(2,"0")}:${String(s.getMinutes()).padStart(2,"0")}`}),l={en:"english",te:"telugu",kn:"kannada",sa:"sanskrit"},[h,y]=N.useState(()=>l[n.language?.split("-")[0]]||"telugu");N.useEffect(()=>{const s=l[n.language?.split("-")[0]];s&&y(s)},[n.language]);const[w,u]=N.useState(null),[b,v]=N.useState(!1),[k,A]=N.useState(""),[m,E]=N.useState(null),[L,R]=N.useState(null),[H,M]=N.useState(st[0]);N.useEffect(()=>{async function s(S){try{const x=await(await fetch(S)).text();return JSON.parse(x)}catch{return null}}async function z(){try{const S="/jyotisha/";let r=await s(`${S}static/Gochara_phala_All_languages.json`);if(r||(r=await s(`${S}jataka/static/Gochara_phala_All_languages.json`)),!r)throw new Error("Gochara_phala_All_languages.json file not found.");E(r);const x=[`${S}static/planet-transit-results.json`,`${S}jataka/static/planet-transit-results.json`,`${S}static/planet_transit_results.json`,`${S}planet-transit-results.json`];let g=null;for(let T of x)if(g=await s(T),g)break;R(g||null)}catch(S){console.error("Failed to load transit JSON files:",S),A("Failed to load Transit Data: "+S.message)}}z()},[]),N.useEffect(()=>{async function s(){if(!(!i||!c)){v(!0),A("");try{const S=await ut({...a,dob:i,tob:c});u(S)}catch(S){A(S.message)}finally{v(!1)}}}const z=setTimeout(()=>{s()},50);return()=>clearTimeout(z)},[i,c,a]);let _=[],J=[];if(!k&&w&&o){const s=o?.planets?.Ascendant?.rashi,z=o?.planets?.Moon?.rashi,S={};if(Object.entries(w.planets||{}).forEach(([r,x])=>{S[r]=x.rashi}),S.Saturn&&z){let r=(S.Saturn-z+12)%12+1;[12,1,2].includes(r)?_.push(e("sadeSatiAlert",`⚠️ Sade Sati (Elinaati Shani) is active! (Shani transiting ${r}H from Natal Moon).`,{st:r})):r===8?_.push(e("ashtamaShaniAlert","⚠️ Ashtama Shani is active! (Shani transiting 8H from Natal Moon).")):r===4&&_.push(e("ardhastamaShaniAlert","⚠️ Ardhastama Shani is active! (Shani transiting 4H from Natal Moon)."))}if(S.Jupiter&&z){let r=(S.Jupiter-z+12)%12+1;[2,5,7,9,11].includes(r)&&_.push(e("guruBalamAlert",`✨ Guru Balam is present! (Guru transiting ${r}H from Natal Moon).`,{gt:r}))}J=st.map(r=>{const x=q[r],g=Mt(r,s),T=o?.planets?.[r]?.rashi,f=w?.planets?.[r]?.rashi,$=T?(T-s+12)%12+1:"-",D=f&&z?(f-z+12)%12+1:"-",X=D!=="-"?_t(r,D,L):"-";let Z="-";r!=="Rahu"&&r!=="Ketu"&&f&&(Z=o?.ashtakavarga?.prastarashtakavarga?.[r]?.[f]||o?.ashtakavarga?.bav?.[r]?.[f]||"-");const et=D!=="-"?Bt(r,D,S,z,e):{text:"-",color:"#333",hasVedha:!1},G=D!=="-"?Lt(r,D,h,m):"-";return{pId:r,pName:x,lordships:g,nPos:$,tPosNM:D,status:X,bavBindus:Z,vedhaInfo:et,phala:G}})}const V=J.filter(s=>s.pId===H);return t.jsxs("div",{className:"transit-tab-container",style:{minWidth:0},children:[t.jsx("style",{children:`
        .transit-controls-bar {
          position: -webkit-sticky;
          position: sticky;
          top: calc(env(safe-area-inset-top, 0px) + 48px);
          z-index: 95;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .transit-controls-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .transit-input-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8f9fa;
          padding: 2px 4px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }
        .transit-input-group:focus-within {
          border-color: #8e44ad;
          box-shadow: 0 0 0 2px rgba(142,68,173,0.15);
          background: #fff;
        }
        .transit-input {
          border: none;
          background: transparent;
          font-size: 14px;
          color: #2c3e50;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          width: 100%;
        }
        .transit-input[type="date"], .transit-input[type="time"] {
          font-family: monospace;
          font-size: 13px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .transit-controls-bar {
            padding: 4px;
            gap: 8px;
            justify-content: center;
          }
          .transit-controls-group {
            width: 100%;
            justify-content: space-between;
            gap: 6px;
          }
          .transit-input-group {
            flex: 1;
            min-width: calc(50% - 3px);
            justify-content: center;
            padding: 2px;
          }
          .transit-input-group.lang-group {
            min-width: 100%;
          }
        }

        /* Header corrections inside sticky control bar */
        .new-horo-page .transit-controls-bar h3 {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          color: #8e44ad !important;
          font-size: 16px !important;
        }

        /* Transit Dual Charts Grid and Card Layout */
        .new-horo-page .transit-charts-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
          align-items: start !important;
          box-sizing: border-box !important;
          margin-bottom: 25px !important;
        }
        .new-horo-page .transit-chart-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 15px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }
        .new-horo-page .transit-chart-card h3.natal-header {
          color: #8e44ad !important;
        }
        .new-horo-page .transit-chart-card h3.transit-header {
          color: #27ae60 !important;
        }
        @media (max-width: 768px) {
          .new-horo-page .transit-charts-row {
            grid-template-columns: 1fr !important;
          }
        }

        /* Accordion Zone Cards */
        .new-horo-page .zone-card {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          margin-bottom: 25px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .zone-card summary {
          padding: 16px 20px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #2c3e50 !important;
          cursor: pointer !important;
          outline: none !important;
          list-style: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          user-select: none !important;
          white-space: normal !important;
          word-break: break-word !important;
        }
        .new-horo-page .zone-card summary::-webkit-details-marker {
          display: none !important;
        }
        .new-horo-page .zone-card summary::after {
          content: '▼' !important;
          font-size: 10px !important;
          color: #7f8c8d !important;
          transition: transform 0.2s ease !important;
        }
        .new-horo-page .zone-card[open] summary::after {
          transform: rotate(180deg) !important;
        }

        /* Planet selection tabs container */
        .new-horo-page .transit-planet-tabs {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          justify-content: safe center !important;
          gap: 6px !important;
          padding: 5px 0 !important;
          width: 100% !important;
          margin-bottom: 15px !important;
          scrollbar-width: none !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .new-horo-page .transit-planet-tabs::-webkit-scrollbar {
          display: none !important;
        }

        /* Small circular buttons for Planet selection */
        .new-horo-page .transit-planet-btn {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          padding: 0 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          border-radius: 50% !important;
          border: 1px solid #eaecee !important;
          background: #f8f9fa !important;
          color: #4a5568 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          flex-shrink: 0 !important;
        }
        .new-horo-page .transit-planet-btn:hover {
          border-color: #8e44ad !important;
          background: #f9f0ff !important;
          color: #8e44ad !important;
        }
        .new-horo-page .transit-planet-btn.active {
          background: #8e44ad !important;
          color: #ffffff !important;
          border-color: #8e44ad !important;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.25) !important;
        }

        /* Card Layout for Transit Results table on all screens */
        .new-horo-page .transit-results-table, 
        .new-horo-page .transit-results-table tbody, 
        .new-horo-page .transit-results-table tr {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .new-horo-page .transit-results-table thead {
          display: none !important;
        }
        .new-horo-page .transit-results-table tr {
          margin-bottom: 20px !important;
          border: 1px solid #eaecee !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          overflow: hidden !important;
          background: #fff !important;
        }
        .new-horo-page .transit-results-table td {
          display: grid !important;
          grid-template-columns: 140px 1fr !important;
          gap: 15px !important;
          align-items: center !important;
          border: none !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding: 10px 15px !important;
          text-align: left !important;
          width: 100% !important;
          box-sizing: border-box !important;
          white-space: normal !important;
        }
        .new-horo-page .transit-results-table td::before {
          content: attr(data-label) !important;
          display: block !important;
          font-weight: 600 !important;
          color: #7f8c8d !important;
          font-size: 13px !important;
          word-break: break-word !important;
        }
        .new-horo-page .transit-results-table td > span {
          display: block !important;
          word-break: break-word !important;
          color: #2c3e50 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }
        .new-horo-page .transit-results-table td:first-child {
          background: #fdfefe !important;
          border-bottom: 1px solid #f1f2f6 !important;
        }
        .new-horo-page .transit-results-table td:first-child > span {
          font-size: 15px !important;
          color: #8e44ad !important;
          font-weight: 700 !important;
        }
        .new-horo-page .transit-results-table td:last-child {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          border-bottom: none !important;
          background: #fdfefe !important;
          padding: 15px !important;
          gap: 8px !important;
        }
        .new-horo-page .transit-results-table td:last-child::before {
          content: attr(data-label) !important;
          color: #8e44ad !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #f1f2f6 !important;
          padding-bottom: 6px !important;
          width: 100% !important;
        }
        .new-horo-page .transit-results-table td:last-child > span {
          text-align: justify !important;
          line-height: 1.6 !important;
          font-weight: normal !important;
          width: 100% !important;
        }
        @media (max-width: 600px) {
          .new-horo-page .transit-results-table td {
            grid-template-columns: 120px 1fr !important;
            gap: 10px !important;
            padding: 10px 12px !important;
          }
          .new-horo-page .transit-results-table td::before {
            font-size: 12px !important;
          }
          .new-horo-page .transit-results-table td > span {
            font-size: 13px !important;
          }
        }

        /* Double Transit and Dasha Support Tables */
        .new-horo-page .double-transit-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-bottom: 25px !important;
          background: #fff !important;
          border: 1px solid #eaecee !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .new-horo-page .double-transit-table th {
          background: #fdfefe !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          padding: 10px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: 1px solid #f1f2f6 !important;
          font-size: 13px !important;
        }
        .new-horo-page .double-transit-table th:last-child {
          border-right: none !important;
        }
        .new-horo-page .double-transit-table td {
          padding: 10px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: 1px solid #f1f2f6 !important;
          font-size: 13px !important;
          color: #2c3e50 !important;
          white-space: normal !important;
        }
        .new-horo-page .double-transit-table td:last-child {
          border-right: none !important;
        }
        .new-horo-page .double-transit-table tr:last-child td {
          border-bottom: none !important;
        }
        .new-horo-page .double-transit-table th.center-col,
        .new-horo-page .double-transit-table td.center-col {
          text-align: center !important;
          width: 80px !important;
        }
      `}),t.jsxs("div",{className:"transit-controls-bar",children:[t.jsxs("h3",{style:{margin:0,color:"#8e44ad",display:"flex",alignItems:"center",gap:"10px"},children:[e("gocharaTransit","Gochara (Transit)"),b&&t.jsx("span",{style:{fontSize:"14px",color:"#e67e22",fontWeight:"normal",fontStyle:"italic"},children:e("updating","Updating...")})]}),t.jsxs("div",{className:"transit-controls-group",children:[t.jsx("div",{className:"transit-input-group",children:t.jsx("input",{type:"date",className:"transit-input",value:i,onChange:s=>d(s.target.value),title:e("date","Date")})}),t.jsx("div",{className:"transit-input-group",children:t.jsx("input",{type:"time",className:"transit-input",value:c,onChange:s=>p(s.target.value),title:e("time","Time")})}),t.jsx("div",{className:"transit-input-group lang-group",style:{display:"none"},children:t.jsxs("select",{className:"transit-input",value:h,onChange:s=>y(s.target.value),title:e("Language","Language"),children:[t.jsx("option",{value:"english",children:e("english","English")}),t.jsx("option",{value:"sanskrit",children:e("sanskrit","Sanskrit")}),t.jsx("option",{value:"telugu",children:e("telugu","Telugu")}),t.jsx("option",{value:"kannada",children:e("kannada","Kannada")})]})})]})]}),k&&t.jsx("div",{className:"message error",children:k}),!k&&w&&t.jsxs("div",{style:{marginTop:"20px",opacity:b?.5:1,transition:"opacity 0.2s ease",pointerEvents:b?"none":"auto"},children:[t.jsxs("div",{className:"transit-charts-row",children:[t.jsxs("div",{className:"transit-chart-card",children:[t.jsx("h3",{className:"natal-header",children:e("natalD1","Natal (D1)")}),t.jsx(ct,{planets:o.planets,title:e("natalChart","Natal Chart"),subtitle:"(D1)",borderColor:"#8e44ad",centerBg:"#f9f0ff",t:e})]}),t.jsxs("div",{className:"transit-chart-card",children:[t.jsx("h3",{className:"transit-header",children:e("transitD1","Transit (D1)")}),t.jsx(ct,{planets:w.planets,title:e("transitChart","Transit Chart"),subtitle:`(D1 on ${i})`,borderColor:"#27ae60",centerBg:"#f0fdf4",t:e})]})]}),_.length>0&&t.jsx("div",{style:{marginBottom:"20px"},children:_.map((s,z)=>t.jsx("div",{style:{background:s.includes("Guru")?"#eafaf1":"#fcf3cf",borderLeft:`5px solid ${s.includes("Guru")?"#27ae60":"#f39c12"}`,padding:"12px 15px",marginBottom:"10px",borderRadius:"8px",color:s.includes("Guru")?"#27ae60":"#d35400",fontSize:"15px"},children:s},z))}),t.jsxs("details",{open:!0,className:"zone-card",children:[t.jsx("summary",{children:t.jsxs("span",{children:["🪐 ",e("transitResults","Transit Results")]})}),t.jsxs("div",{style:{padding:"20px"},children:[t.jsx("div",{className:"transit-planet-tabs",children:st.map(s=>t.jsx("button",{type:"button",onClick:()=>M(s),className:`transit-planet-btn ${H===s?"active":""}`,title:e(q[s]||s),children:e(lt[s]||s,lt[s]||s)},s))}),t.jsx("div",{className:"transit-table-container",style:{marginTop:"20px"},children:t.jsxs("table",{className:"data-table transit-results-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{textAlign:"center",fontSize:"15px"},children:e("Planet","Planet")}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("Lordship","Lordship"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("natalD1","Natal D1"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("natalPos","Natal Pos"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("fromLagna","from Lagna"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("transitPos","Transit Pos"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("fromNatalMoon","from Natal Moon"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("bavBindus","BAV Bindus"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("inTransitSign","in Transit Sign"),")"]})]}),t.jsx("th",{style:{textAlign:"center",fontSize:"15px"},children:e("transitStatus","Transit Status")}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("vedha","Vedha"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("obstruction","Obstruction"),")"]})]}),t.jsxs("th",{style:{textAlign:"left",fontSize:"15px"},children:[e("transitResults","Transit Results")," (",e(h,h.charAt(0).toUpperCase()+h.slice(1)),")"]})]})}),t.jsx("tbody",{children:V.map((s,z)=>{const S=s.status==="Shubha"?"#27ae60":s.status==="Ashubha"?"#e74c3c":"#555";let r="#333";s.bavBindus!=="-"&&(s.bavBindus>=5?r="#27ae60":s.bavBindus<=3?r="#e74c3c":r="#d35400");let x=s.status==="Shubha"?e("Shubham","Shubham"):s.status==="Ashubha"?e("Ashubham","Ashubham"):e(s.status,s.status),g=x,T=S;return s.vedhaInfo.hasVedha&&(!s.vedhaInfo.isVama&&s.status==="Shubha"?(g=t.jsxs(t.Fragment,{children:[t.jsx("span",{style:{textDecoration:"line-through"},children:x}),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.85em",color:"#e74c3c"},children:["(",e("obstructed","Obstructed"),")"]})]}),T="#7f8c8d"):s.vedhaInfo.isVama&&s.status==="Ashubha"&&(g=t.jsxs(t.Fragment,{children:[t.jsx("span",{style:{textDecoration:"line-through"},children:x}),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.85em",color:"#27ae60"},children:["(",e("obstructed","Obstructed"),")"]})]}),T="#7f8c8d")),t.jsxs("tr",{children:[t.jsx("td",{"data-label":e("Planet","Planet"),children:t.jsx("span",{children:e(s.pId,s.pName)})}),t.jsx("td",{"data-label":e("Lordship","Lordship"),children:t.jsx("span",{children:s.lordships})}),t.jsx("td",{"data-label":e("natalPos","Natal Pos"),children:t.jsx("span",{children:s.nPos})}),t.jsx("td",{"data-label":e("transitPos","Transit Pos"),children:t.jsx("span",{children:s.tPosNM})}),t.jsx("td",{"data-label":e("bavBindus","BAV Bindus"),children:t.jsx("span",{style:{color:r,fontWeight:"bold"},children:s.bavBindus})}),t.jsx("td",{"data-label":e("transitStatus","Transit Status"),children:t.jsx("span",{style:{color:T,fontWeight:"bold"},children:g})}),t.jsx("td",{"data-label":e("vedha","Vedha"),children:t.jsx("span",{style:{color:s.vedhaInfo.color,fontWeight:"bold"},children:s.vedhaInfo.text})}),t.jsx("td",{"data-label":`${e("transitResults","Transit Results")} (${e(h,h.charAt(0).toUpperCase()+h.slice(1))})`,children:t.jsx("span",{children:s.phala})})]},z)})})]})})]})]}),t.jsx(Ht,{natalData:o,transitChart:w,transitDate:i,t:e})]})]})}function Ht({natalData:o,transitChart:a,transitDate:e,t:n}){if(!o||!a||!e)return null;const i=(f,$)=>(f-1+$)%12+1,d=f=>({1:"Mars",2:"Venus",3:"Mercury",4:"Moon",5:"Sun",6:"Mercury",7:"Venus",8:"Mars",9:"Jupiter",10:"Saturn",11:"Saturn",12:"Jupiter"})[f],c=(f,$)=>$?f==="Jupiter"?[i($,4),i($,6),i($,8)]:f==="Saturn"?[i($,2),i($,6),i($,9)]:[]:[],p=(f,$)=>!!(f&&$&&f===$),l=(f,$,D)=>!$||!D?!1:c(f,$).includes(D),h=o.planets?.Ascendant?.rashi,y=o.planets?.Moon?.rashi,w=a.planets?.Jupiter?.rashi,u=a.planets?.Saturn?.rashi;if(!h||!y||!w||!u)return t.jsx("div",{style:{color:"#7f8c8d",fontStyle:"italic",marginTop:"20px"},children:"Data not available for Double Transit analysis."});const b=i(h,6),v=d(b),k=o.planets[v]?.rashi,A=d(h),m=o.planets[A]?.rashi,E=i(h,1),L=i(h,10),R=d(E),H=d(L),_=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].filter(f=>o.planets[f]?.rashi===b),J=[{label:n("dt_pos_7","Posited in 7th House"),guru:p(w,b),shani:p(u,b)},{label:n("dt_asp_7","Aspecting 7th House"),guru:l("Jupiter",w,b),shani:l("Saturn",u,b)},{label:n("dt_conj_7_lord","Conjunction with 7th Lord"),guru:p(w,k),shani:p(u,k)},{label:n("dt_asp_7_lord","Aspecting 7th Lord"),guru:l("Jupiter",w,k),shani:l("Saturn",u,k)},{label:n("dt_pos_lagna","Posited in Lagna"),guru:p(w,h),shani:p(u,h)},{label:n("dt_asp_lagna","Aspecting Lagna"),guru:l("Jupiter",w,h),shani:l("Saturn",u,h)},{label:n("dt_conj_lagna_lord","Conjoined with Lagna Lord"),guru:p(w,m),shani:p(u,m)},{label:n("dt_asp_lagna_lord","Aspecting Lagna Lord"),guru:l("Jupiter",w,m),shani:l("Saturn",u,m)},{label:n("dt_pos_moon","Posited in Janma Rashi"),guru:p(w,y),shani:p(u,y)},{label:n("dt_asp_moon","Aspecting Janma Rashi"),guru:l("Jupiter",w,y),shani:l("Saturn",u,y)}],V=bt(o.dashas||[]),s=new Date(`${e}T12:00:00Z`),z=f=>new Date(`${f}T00:00:00Z`);let S=null,r=null,x=null;for(let f of V)if(s>=z(f.start)&&s<z(f.end)){S=f.planet;for(let $ of f.antardashas)if(s>=z($.start)&&s<z($.end)){r=$.planet;for(let D of $.pratyantaraDashas)if(s>=z(D.start)&&s<z(D.end)){x=D.planet;break}break}break}const g=(f,$)=>!!(f&&$&&f.includes($)),T=[{label:n("ds_7_lord","7th Lord Dasha"),planets:[v]},{label:n("ds_7_house","Planets in Natal 7th House Dasha"),planets:_},{label:n("ds_venus","Venus (Shukra) Dasha"),planets:["Venus"]},{label:n("ds_2_lord","2nd Lord Dasha"),planets:[R]},{label:n("ds_11_lord","11th Lord Dasha"),planets:[H]}];return t.jsxs("details",{open:!0,className:"zone-card",children:[t.jsx("summary",{children:t.jsx("span",{children:n("double_transit_title","💞 Double Transit (Marriage Yoga Analysis)")})}),t.jsxs("div",{style:{padding:"20px"},children:[t.jsx("h3",{style:{color:"#2c3e50",marginTop:0,marginBottom:"15px",textAlign:"center"},children:n("transit_activation_title","Transit Activation for Marriage")}),t.jsx("div",{style:{overflowX:"auto"},children:t.jsxs("table",{className:"double-transit-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:n("parameter","Parameter")}),t.jsx("th",{className:"center-col",children:n("guru","Guru")}),t.jsx("th",{className:"center-col",children:n("shani","Shani")})]})}),t.jsx("tbody",{children:J.map((f,$)=>t.jsxs("tr",{children:[t.jsx("td",{children:f.label}),t.jsx("td",{className:"center-col",children:f.guru?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[n("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:f.shani?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[n("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})})]},$))})]})}),t.jsx("h3",{style:{color:"#2c3e50",marginTop:0,marginBottom:"15px",textAlign:"center"},children:n("dasha_support_title","Dasha Support for Marriage")}),t.jsxs("div",{style:{background:"#f9f0ff",padding:"12px 15px",borderLeft:"5px solid #8e44ad",borderRadius:"8px",marginBottom:"15px",fontSize:"15px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",textAlign:"center"},children:[t.jsx("span",{style:{color:"#7f8c8d"},children:n("current_dasha_on","Current Dasha (on {0}):").replace("{0}",e)}),t.jsx("br",{}),t.jsx("span",{style:{color:"#c0392b",fontWeight:"bold"},children:S?n(S):"-"})," ","(MD) →"," ",t.jsx("span",{style:{color:"#d35400",fontWeight:"bold"},children:r?n(r):"-"})," ","(AD) →"," ",t.jsx("span",{style:{color:"#e67e22",fontWeight:"bold"},children:x?n(x):"-"})," ","(PD)"]}),t.jsx("div",{style:{overflowX:"auto"},children:t.jsxs("table",{className:"double-transit-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:n("dasha_parameter","Dasha Parameter")}),t.jsx("th",{className:"center-col",children:n("maha","Maha")}),t.jsx("th",{className:"center-col",children:n("antar","Antar")}),t.jsx("th",{className:"center-col",children:n("praty","Praty")})]})}),t.jsx("tbody",{children:T.map((f,$)=>t.jsxs("tr",{children:[t.jsxs("td",{children:[f.label,f.planets&&f.planets.length>0&&t.jsxs("span",{style:{fontSize:"12px",color:"#8e44ad",fontWeight:"bold"},children:[" ","(",f.planets.map(D=>n(D)).join(", "),")"]})]}),t.jsx("td",{className:"center-col",children:g(f.planets,S)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[n("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:g(f.planets,r)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[n("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:g(f.planets,x)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[n("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})})]},$))})]})})]})]})}function ht(){const o=new Date,a=o.getFullYear(),e=String(o.getMonth()+1).padStart(2,"0"),n=String(o.getDate()).padStart(2,"0");return`${a}-${e}-${n}`}function xt(){const o=new Date,a=String(o.getHours()).padStart(2,"0"),e=String(o.getMinutes()).padStart(2,"0");return`${a}:${e}`}function mt(o={},a){const e={Makha:"Magha",Garija:"Gara",Garaja:"Gara"},n=c=>c?String(c).replace(/S[-.]\s*/gi,"Shukla ").replace(/K[-.]\s*/gi,"Krishna ").split(" ").map(p=>a(e[p]||p)).join(" "):null,i=c=>c?a(e[c]||c):null,d=[n(o.tithi),i(o.vara),i(o.moon_nakshatra),i(o.yoga),i(o.karana)].filter(Boolean);return d.length?d.join(" · "):a("panchangaDetailsWait","Panchanga details will appear here after calculation.")}function gt(o,a,e,n,i){const p=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],l={};for(let u=1;u<=12;u++)l[u]=[];let h=o.Ascendant?.rashi??1;a&&a.Ascendant&&(h=a.Ascendant.rashi);for(const[u,b]of Object.entries(o)){const v=a?a[u]?.rashi??b.rashi:b.rashi;l[v]||(l[v]=[]),l[v].push(u)}let y=`<svg width="280px" height="280px" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;">
    <rect width="280" height="280" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let u=0;u<=4;u++)y+=`<line x1="${u*70}" y1="0" x2="${u*70}" y2="280" stroke="#333" stroke-width="0.8"/>`,y+=`<line x1="0" y1="${u*70}" x2="280" y2="${u*70}" stroke="#333" stroke-width="0.8"/>`;y+='<rect x="70" y="70" width="140" height="140" fill="#fdfcf8" stroke="#111" stroke-width="1.2"/>',e&&(n?(y+=`<text x="${280/2}" y="${280/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${e}</text>`,y+=`<text x="${280/2}" y="${280/2+12}" font-size="12" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${n}</text>`):y+=`<text x="${280/2}" y="${280/2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${e}</text>`);const w={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"};for(let u=0;u<4;u++)for(let b=0;b<4;b++){const v=p[u][b];if(v===null)continue;const k=b*70,A=u*70,m=v===h;m&&(y+=`<rect x="${k+1}" y="${A+1}" width="68" height="68" fill="rgba(108, 92, 231, 0.1)"/>`),m&&(y+=`<text x="${k+3}" y="${A+70-4}" font-weight="bold" font-size="14" fill="#6c5ce7">${i("Lg")}</text>`);const E=l[v].filter(L=>L!=="Ascendant");if(E.length>0){const R=[];for(let M=0;M<E.length;M+=2)R.push(E.slice(M,M+2));const H=A+70/2-(R.length-1)*17/2+5;R.forEach((M,_)=>{const J=H+_*17;M.forEach((V,s)=>{const z=o[V]?.retrograde,S=o[V]?.combust,r=i(w[V]||V),x=z?"#d35400":S?"#8e44ad":"#2d3436",g=S||z?"bold":"normal";let T=k+70/2;M.length===2&&(T=s===0?k+70/2-16:k+70/2+16),y+=`<text x="${T}" y="${J}" font-size="14" font-weight="${g}" text-anchor="middle" fill="${x}">${r}</text>`,z&&(y+=`<text x="${T+10}" y="${J-5}" font-size="6.5" font-weight="bold" fill="#d35400">R</text>`),S&&(y+=`<text x="${T+10}" y="${J+6}" font-size="6.5" font-weight="bold" fill="#8e44ad">C</text>`)})})}}return y+="</svg>",y}function F(o,a,e,n,i=!1){if(!o)return"";const d=280,c=70,p=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]];let l=`<svg viewBox="0 0 ${d} ${d}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif; width: 100%; height: auto;">
    <rect width="${d}" height="${d}" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let h=0;h<=4;h++)l+=`<line x1="${h*c}" y1="0" x2="${h*c}" y2="${d}" stroke="#333" stroke-width="0.8"/>`,l+=`<line x1="0" y1="${h*c}" x2="${d}" y2="${h*c}" stroke="#333" stroke-width="0.8"/>`;l+=`<rect x="${c}" y="${c}" width="${2*c}" height="${2*c}" fill="#f9f0ff" stroke="#111" stroke-width="1.2"/>`,l+=`<text x="${d/2}" y="${d/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${a}</text>`,l+=`<text x="${d/2}" y="${d/2+12}" font-size="10" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${e}</text>`;for(let h=0;h<4;h++)for(let y=0;y<4;y++){const w=p[h][y];if(w===null)continue;const u=y*c,b=h*c,v=i?o[w]?.points??0:o[w]??0;let k="#2d3436",A="bold";i?v>=28?k="#27ae60":v<20&&(k="#c0392b"):v>=5?k="#27ae60":v<=2&&(k="#c0392b"),l+=`<text x="${u+c/2}" y="${b+c/2+5}" font-size="20" font-weight="${A}" text-anchor="middle" fill="${k}">${v}</text>`}return l+="</svg>",l}function Yt({logoUrl:o,onNavigate:a}){const{t:e}=I(),[n,i]=N.useState(()=>{const r=sessionStorage.getItem("vaiswanara_load_profile");if(r)try{const g=JSON.parse(r);if(g&&g.dob)return{name:g.name||"",dob:g.dob,tob:g.tob||"12:00",city:g.city||"",latitude:g.latitude||"",longitude:g.longitude||"",timezone:g.timezone||"5.5",gender:g.gender||"male"}}catch(g){console.error("Failed to parse loaded profile",g)}const x=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");return{name:"",dob:ht(),tob:xt(),city:x?.city||"Bengaluru, India",latitude:x?.latitude||"12.9716",longitude:x?.longitude||"77.5946",timezone:x?.timezone||"5.5",gender:"male"}}),[d,c]=N.useState(!1),[p,l]=N.useState(n),[h,y]=N.useState({}),[w,u]=N.useState("input"),[b,v]=N.useState(""),[k,A]=N.useState("natal"),[m,E]=N.useState(null),[L,R]=N.useState({loading:!1,error:""}),H=N.useRef({}),M=async(r="download")=>{if(m){R({loading:!0,error:""});try{window.html2canvas||await new Promise((P,j)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",C.onload=P,C.onerror=()=>j(new Error("Failed to load html2canvas")),document.head.appendChild(C)}),window.jspdf||await new Promise((P,j)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",C.onload=P,C.onerror=()=>j(new Error("Failed to load jspdf")),document.head.appendChild(C)});const x=gt(m.planets,null,e("Rasi Chakra"),"(D1)",e),g=gt(m.planets,m.navamsa_d9,e("Navamsha"),"(D9)",e),T=Object.entries(m.planets).filter(([,P])=>P&&P.rashi).map(([P,j])=>{const C=j.retrograde?' <span style="color:#d35400; font-weight:bold;">R</span>':"",O=j.combust?' <span style="color:#8e44ad; font-weight:bold;">C</span>':"";return`
            <tr style="border-bottom: 1px solid #dfe6e9;">
              <td style="padding: 5px 8px; text-align: left; font-weight: bold; color: #2d3436;">${e(P)}${C}${O}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${ft(j.degree)}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${j.nakshatra?e(j.nakshatra):"-"}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${j.pada||"-"}</td>
            </tr>
          `}).join(""),f=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"],$=m.shadabala?f.map(P=>{if(!m.shadabala[P])return"";const j=m.shadabala[P];return`
          <tr style="border-bottom: 1px solid #dfe6e9;">
            <td style="padding: 6px 10px; font-weight: bold; color: #2d3436;">${e(P)}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.sthana_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.dig_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.kala_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.chesta_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.naisargika_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${j.drig_bala}</td>
            <td style="padding: 6px 10px; font-weight: bold; color: #8e44ad; text-align: center;">${j.total_rupas}</td>
          </tr>
        `}).join(""):"";let D="";m.dashas&&(D=`
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            ${m.dashas.map(j=>{const C=j.planet||j.lord||j.name||"-",O=j.end||j.end_date||"-",B=(j.antardashas||[]).map((W,Y,at)=>{const nt=W.planet||W.lord||W.name||"-",rt=W.end||W.end_date||"-";return`
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: ${Y===at.length-1?"none":"1px dashed #f1f2f6"};">
                <span>${e(nt)}</span>
                <span style="color: #7f8c8d;">${rt}</span>
              </div>
            `}).join("");return`
            <div style="border: 1px solid #dfe6e9; border-radius: 6px; overflow: hidden; background: #fff; font-size: 8.5pt; display: flex; flex-direction: column;">
              <div style="background: #f1f2f6; padding: 6px 10px; display: flex; justify-content: space-between; font-weight: bold; color: #2d3436; border-bottom: 1px solid #dfe6e9;">
                <span>${e(C)}</span>
                <span>${O}</span>
              </div>
              <div style="padding: 4px 10px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                ${B}
              </div>
            </div>
          `}).join("")}
          </div>
        `);let X="";if(m.ashtakavarga){const P=m.ashtakavarga.sarvashtakavarga||{},j=m.ashtakavarga.prastarashtakavarga||{},C=F(P,"SAV",e("sarvashtakavarga","(Sarvashtakavarga)"),e,!0),O=F(j.Sun||{},"Su BAV",e("Sun"),e,!1),B=F(j.Moon||{},"Ch BAV",e("Moon"),e,!1),W=F(j.Mars||{},"Ku BAV",e("Mars"),e,!1),Y=F(j.Mercury||{},"Bu BAV",e("Mercury"),e,!1),at=F(j.Jupiter||{},"Gu BAV",e("Jupiter"),e,!1),nt=F(j.Venus||{},"Sk BAV",e("Venus"),e,!1),rt=F(j.Saturn||{},"Sa BAV",e("Saturn"),e,!1);X=`
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;">
            <div>${C}</div>
            <div>${O}</div>
            <div>${B}</div>
            <div>${W}</div>
            <div>${Y}</div>
            <div>${at}</div>
            <div>${nt}</div>
            <div>${rt}</div>
          </div>
        `}const Z=`
      <style>
        * { box-sizing: border-box; }
        .pdf-page { width: 794px; height: 1122px; padding: 40px; box-sizing: border-box; background: #fff; position: relative; font-family: 'Poppins', sans-serif; color: #2d3436; -webkit-text-size-adjust: none; }
        .header { text-align: center; border-bottom: 2px solid #2d3436; padding-bottom: 15px; margin-bottom: 20px; }
        .header img { height: 60px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 19pt; color: #2d3436; text-transform: uppercase; }
        .header h2 { margin: 5px 0; font-size: 14pt; color: #8e44ad; font-weight: 600; }
        .charts-row { display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; width: 100%; }
        .chart-col { width: 280px; display: flex; flex-direction: column; align-items: center; }
        .chart-col svg { width: 280px !important; height: 280px !important; display: block; }
        .pdf-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
        .pdf-table th { background: #f1f2f6; padding: 8px 12px; font-weight: bold; text-align: left; color: #2d3436; border-bottom: 1.5px solid #2d3436; }
        .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #dcdde1; padding-top: 8px; font-size: 8pt; color: #b2bec3; display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
      </style>
      <div id="pdf-render-wrapper" style="position: absolute; top: 0; left: 0; width: 794px; z-index: -9999; background: #fff;">
      
      <!-- PAGE 1: CHARTS & BIRTH DETAILS -->
      <div class="pdf-page">
        <div class="header" style="padding-bottom: 10px; margin-bottom: 15px;">
          ${o?`<img src="${o}" alt="Logo" style="height: 50px; margin-bottom: 5px;">`:""}
          <h1 style="font-size: 18pt;">${e("personalHoroscope","Personal Horoscope")}</h1>
          <h2 style="font-size: 13pt; margin: 2px 0;">${e("natalChart","Natal Chart")}</h2>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px; font-size: 12pt; color: #2d3436;">
          <div style="font-weight: bold; margin-bottom: 6px;">
            ${n.dob?n.dob.split("-").reverse().join("-"):"-"} &nbsp;&nbsp;&nbsp; ${n.tob} &nbsp;&nbsp;&nbsp; ${n.city?n.city.split(",")[0].trim():"-"}
          </div>
          <div style="font-size: 11pt; color: #34495e;">
            ${mt(m.panchanga,e)}
          </div>
          ${m.meta?.ayanamsha_name?`<div style="font-size: 10pt; color: #7f8c8d; margin-top: 5px;"><strong>Ayanamsha:</strong> ${m.meta.ayanamsha_name} (${m.meta.ayanamsha}°)</div>`:""}
        </div>
        
        <div class="charts-row" style="margin-bottom: 25px; gap: 20px;">
          <div class="chart-col">${x}</div>
          <div class="chart-col">${g}</div>
        </div>

        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:10px; font-size:12pt; text-transform:uppercase; text-align: center;">${e("grahaPositions","Graha Positions")}</h2>
        <table class="pdf-table">
          <thead>
            <tr>
              <th style="width: 25%; padding: 6px 8px;">${e("Planet")}</th>
              <th style="width: 25%; text-align: center; padding: 6px 8px;">${e("Degree")}</th>
              <th style="width: 30%; text-align: center; padding: 6px 8px;">${e("Nakshatra")}</th>
              <th style="width: 20%; text-align: center; padding: 6px 8px;">${e("Pada")}</th>
            </tr>
          </thead>
          <tbody>
            ${T}
          </tbody>
        </table>

        <div class="footer">
          <span>${e("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${e("Page","Page")} 1</span>
        </div>
      </div>

      <!-- PAGE 2: VIMSHOTTARI DASHA -->
      <div class="pdf-page">
        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:15px; font-size:12pt; text-transform:uppercase; text-align: center;">${e("vimshottariDasha","Vimshottari Dasha (MD & AD)")}</h2>
        
        ${D}
        
        <div class="footer">
          <span>${e("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${e("Page","Page")} 2</span>
        </div>
      </div>

      <!-- PAGE 3: PLANETARY STRENGTH & ASHTAKAVARGA -->
      <div class="pdf-page">
        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:15px; font-size:12pt; text-transform:uppercase; text-align: center;">${e("planetaryStrengthAndAshtakavarga","Planetary Strength & Ashtakavarga")}</h2>
        
        ${m.shadabala?`
        <h3 style="color:#2d3436; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; text-align: center;">${e("Shadabala","Shadabala Strength")}</h3>
        <table class="pdf-table" style="font-size: 8.5pt; margin-bottom: 45px;">
          <thead>
            <tr>
              <th>${e("Planet")}</th>
              <th style="text-align: center;">${e("Sthana")}</th>
              <th style="text-align: center;">${e("Dig")}</th>
              <th style="text-align: center;">${e("Kala")}</th>
              <th style="text-align: center;">${e("Chesta")}</th>
              <th style="text-align: center;">${e("Naisargika")}</th>
              <th style="text-align: center;">${e("Drig")}</th>
              <th style="text-align: center;">${e("Total")}</th>
            </tr>
          </thead>
          <tbody>
            ${$}
          </tbody>
        </table>
        `:""}

        ${m.ashtakavarga?`
        <h3 style="color:#2d3436; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 15px 0; text-align: center;">${e("ashtakavarga","Ashtakavarga Charts")}</h3>
        ${X}
        `:""}

        <div class="footer">
          <span>${e("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${e("Page","Page")} 3</span>
        </div>
      </div>

      </div>`,et=window.scrollY;window.scrollTo(0,0);const G=document.createElement("div");G.innerHTML=Z,G.style.position="absolute",G.style.top="0",G.style.left="0",G.style.width="794px",document.body.appendChild(G);try{await new Promise(B=>setTimeout(B,600));const P=G.querySelectorAll(".pdf-page"),j=new window.jspdf.jsPDF({orientation:"portrait",unit:"mm",format:"a4"});for(let B=0;B<P.length;B++){const W=await window.html2canvas(P[B],{scale:2,useCORS:!0,scrollY:0,scrollX:0,windowWidth:794,width:794,height:1122});B>0&&j.addPage();const Y=W.toDataURL("image/jpeg",.98);j.addImage(Y,"JPEG",0,0,210,297)}const O=`${(n.name||"Horoscope").replace(/[^a-zA-Z0-9_.-]/g,"")}_Horoscope.pdf`;if(r==="share"&&navigator.canShare){const B=j.output("blob"),W=new File([B],O,{type:"application/pdf"});if(navigator.canShare({files:[W]}))try{await navigator.share({title:"Personal Horoscope",text:`Here is the Personal Horoscope report for ${n.name||"myself"} generated via e-Jyotisha.`,files:[W]})}catch(Y){Y.name!=="AbortError"&&j.save(O)}else alert(e("shareNotSupported","Share feature is not supported on your browser. Downloading instead...")),j.save(O)}else j.save(O)}finally{document.body.removeChild(G),window.scrollTo(0,et)}R({loading:!1,error:""})}catch(x){console.error("PDF Error:",x),R({loading:!1,error:"Failed to generate PDF."})}}},_=async r=>{const x=JSON.stringify(r);if(H.current[x]){E(H.current[x]);return}R({loading:!0,error:""});try{const g=await ut(r);g?.planets&&(g.planets.Rahu&&(g.planets.Rahu.retrograde=!1),g.planets.Ketu&&(g.planets.Ketu.retrograde=!1)),["navamsa_d9","d2","d3","d4","d7","d10","d12","d16","d20","d24","d27","d30","d60"].forEach(f=>{g?.[f]&&(g[f].Rahu&&(g[f].Rahu.retrograde=!1),g[f].Ketu&&(g[f].Ketu.retrograde=!1))}),H.current[x]=g,E(g),R({loading:!1,error:""})}catch(g){R({loading:!1,error:g.message})}};N.useEffect(()=>{_(n)},[]);const J=()=>{const r=JSON.parse(localStorage.getItem("vaiswanara_profiles")||"{}");y(r),l(n),u("input"),v(""),c(!0)},V=r=>{const x=h[r];x&&(l({...p,name:r,dob:x.dob,tob:x.tob,city:x.city,latitude:x.latitude,longitude:x.longitude,timezone:x.timezone,gender:x.gender||"male"}),u("input"))},s=()=>{i(p),c(!1),_(p)},z=()=>{sessionStorage.removeItem("vaiswanara_load_profile");const r=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");l({name:"",dob:ht(),tob:xt(),city:r?.city||"Bengaluru, India",latitude:r?.latitude||"12.9716",longitude:r?.longitude||"77.5946",timezone:r?.timezone||"5.5",gender:"male"}),u("input")},S=()=>{const r=p.name?.trim();if(!r){alert("Please enter a Name to save this profile.");return}const x={...h},{...g}=p;x[r]=g,localStorage.setItem("vaiswanara_profiles",JSON.stringify(x)),y(x),alert(`Profile "${r}" saved successfully!`)};return t.jsxs("main",{className:"new-horo-page",style:{background:"transparent",minHeight:"100vh"},children:[t.jsx("style",{children:`
        /* Flat layout overrides for new horoscope page */
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
        @media (max-width: 1024px) {
          .new-horo-page { width: 95% !important; }
        }
        @media (max-width: 860px) {
          .new-horo-page { 
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        @media (max-width: 768px) {
          .new-horo-page { 
            width: 100% !important; 
            padding: 10px !important; 
            padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; 
          }
        }
        .new-horo-page .workspace {
          padding: 0 !important;
          margin: 0 !important;
          gap: 15px !important;
          width: 100% !important;
        }

        /* Responsive Layout for Charts & Tables */
        .new-horo-page .charts-table-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
          align-items: start !important;
        }
        
        .new-horo-page .shadbala-akv-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 15px !important;
          width: 100% !important;
        }
        
        /* Unwrap RashiChart to make D1 and D9 direct grid items */
        .new-horo-page .charts-table-row > .chart-panel {
          display: contents !important;
        }
        .new-horo-page .charts-table-row > .chart-panel > div {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 10px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          max-width: none !important;
          box-sizing: border-box !important;
        }
        
        .new-horo-page .charts-table-row .table-panel {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }
        
        .new-horo-page .charts-table-row .table-panel .table-scroll {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow-y: auto !important;
        }
        
        .new-horo-page .charts-table-row .table-panel table {
          height: 100% !important;
        }
        
        @media (max-width: 1024px) {
          .new-horo-page .charts-table-row,
          .new-horo-page .shadbala-akv-row {
            grid-template-columns: 1fr !important;
          }
          .new-horo-page .charts-table-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .new-horo-page .charts-table-row > .table-panel {
            grid-column: 1 / -1 !important;
          }
          .new-horo-page .charts-table-row .table-panel {
            height: auto !important;
          }
          .new-horo-page .charts-table-row .table-panel .table-scroll {
            flex: initial !important;
            overflow-y: initial !important;
          }
          .new-horo-page .charts-table-row .table-panel table {
            height: auto !important;
          }
        }
        
        @media (max-width: 768px) {
          .new-horo-page .charts-table-row {
            grid-template-columns: 1fr !important;
          }
          .new-horo-page .charts-table-row > .table-panel {
            grid-column: auto !important;
          }
          .new-horo-page th {
            padding: 6px 8px !important;
            font-size: 12px !important;
          }
          .new-horo-page td {
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
        }

        /* CARD STYLES */
        .new-horo-page .table-panel,
        .new-horo-page .prediction-panel,
        .new-horo-page .chart-panel {
          background: #ffffff !important;
          border: 1px solid #eaecee !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
          padding: 16px 10px !important;
          margin: 0 !important;
          border-radius: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        .new-horo-page .prediction-panel {
          padding: 16px 10px !important;
        }

        /* Dasha panel specific overrides to remove card styling */
        .new-horo-page .dasha-panel {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* TYPOGRAPHY */
        .new-horo-page h2, .new-horo-page h3 {
          font-weight: 600 !important;
          font-size: 18px !important;
          color: #2c3e50 !important;
          background: transparent !important;
          padding: 0 0 12px 0 !important;
          margin: 0 !important;
          margin-bottom: 15px !important;
          text-align: left !important;
          text-transform: none !important;
          border-bottom: 1px solid #f1f2f6 !important;
        }

        .new-horo-page .prediction-panel {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 8px !important;
        }
        .new-horo-page .prediction-panel h2 {
          min-width: fit-content !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          border-bottom: none !important;
          white-space: nowrap !important;
          flex-shrink: 0 !important;
        }
        .new-horo-page .prediction-panel p {
          font-size: 14px !important;
          padding: 0 !important;
          margin: 0 !important;
          text-align: left !important;
          border-bottom: none !important;
          color: #34495e !important;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .new-horo-page .prediction-panel {
            flex-direction: column !important;
          }
          .new-horo-page .prediction-panel h2 {
            margin-bottom: 12px !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #f1f2f6 !important;
          }
        }
        .new-horo-page .dasha-panel .section-heading p.eyebrow,
        .new-horo-page .dasha-panel .section-heading span {
          display: none !important;
        }
        .new-horo-page .dasha-panel .section-heading {
          margin-bottom: 0 !important;
          display: block !important;
        }
        .new-horo-page .dasha-panel .section-heading h2 {
          border-bottom: 1px solid #f1f2f6 !important;
        }
        
        /* Charts spacing */
        .new-horo-page .chart-panel {
          gap: 12px !important;
          padding: 16px 10px !important;
        }
        .new-horo-page .south-chart {
          margin: 0 auto !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .new-horo-page .akv-planet-tabs {
          margin: 8px 0 15px 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .new-horo-page .akv-sarva-btn {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
          border: 2px solid #e0e0e0 !important;
          background: #f9f0ff !important;
          color: #8e44ad !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        .new-horo-page .akv-sarva-btn.active {
          background: #8e44ad !important;
          color: #fff !important;
          border-color: #8e44ad !important;
        }
        .new-horo-page .akv-sarva-btn:hover {
          border-color: #8e44ad !important;
          background: #f5e6ff !important;
        }
        .new-horo-page .akv-sarva-btn.active:hover {
          background: #7a3a92 !important;
        }
        .new-horo-page .akv-planet-tabs > div {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          justify-content: center !important;
        }
        .new-horo-page .akv-planet-btn {
          width: 42px !important;
          height: 40px !important;
          min-width: 42px !important;
          padding: 0 !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          border: 2px solid #e0e0e0 !important;
          background: #fff !important;
          color: #8e44ad !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .new-horo-page .akv-planet-btn.active {
          background: #8e44ad !important;
          color: #fff !important;
          border-color: #8e44ad !important;
        }
        .new-horo-page .akv-planet-btn:hover {
          border-color: #8e44ad !important;
          background: #f5e6ff !important;
        }
        .new-horo-page .akv-planet-btn.active:hover {
          background: #7a3a92 !important;
        }
        @media (max-width: 500px) {
          .new-horo-page .akv-planet-btn {
            width: 38px !important;
            height: 36px !important;
            min-width: 38px !important;
            font-size: 12px !important;
          }
        }

        /* TABLES */
        .new-horo-page .table-scroll {
          overflow-x: auto !important; 
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .new-horo-page table {
          width: auto !important;
          table-layout: auto !important;
          border-collapse: collapse !important;
          margin: 0 !important;
          min-width: unset !important;
          display: table !important;
        }
        .new-horo-page th {
          font-size: 13px !important;
          color: #7f8c8d !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 6px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: none !important;
          border-left: none !important;
          border-top: none !important;
          background: #fdfefe !important;
          white-space: nowrap !important;
          width: auto !important;
          display: table-cell !important;
        }
        .new-horo-page td {
          font-size: 13px !important;
          color: #2c3e50 !important;
          padding: 4px 12px !important;
          border-bottom: 1px solid #f1f2f6 !important;
          border-right: none !important;
          border-left: none !important;
          border-top: none !important;
          text-align: left !important;
          white-space: nowrap !important;
          width: auto !important;
          display: table-cell !important;
        }
        
        /* Shadbala visual bar */
        .new-horo-page .strength-bar {
          display: block !important;
          height: 6px !important;
          background: #ecf0f1 !important;
          border-radius: 4px !important;
          margin-bottom: 4px !important;
        }
        .new-horo-page .strength-bar-fill {
          height: 100% !important;
          background: #8e44ad !important;
          border-radius: 4px !important;
        }
        .new-horo-page .strength-val {
          font-weight: 600 !important;
          font-size: 13px !important;
          color: #2c3e50 !important;
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
          flex-wrap: wrap;
        }
        
        .new-horo-page .top-bar-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          cursor: pointer;
          min-width: 0;
          transition: transform 0.1s ease-in-out;
        }
        .new-horo-page .top-bar-details:active {
          transform: scale(0.98);
        }

        @media (max-width: 600px) {
          .new-horo-page .top-bar-card {
            padding: 8px 12px !important;
            margin-bottom: 12px !important;
          }
          .new-horo-page .view-toggle-btn {
            height: 20px !important;
            padding: 0 8px !important;
            font-size: 9px !important;
            border-radius: 10px !important;
          }
        }

        /* STATUS BADGES for Graha */
        .new-horo-page td span[title="Retrograde"] {
          background: #e74c3c !important;
          color: #fff !important;
          padding: 2px 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          text-decoration: none !important;
          margin-left: 6px !important;
        }
        .new-horo-page td span[title="Combust"] {
          background: #f39c12 !important;
          color: #fff !important;
          padding: 2px 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          text-decoration: none !important;
          margin-left: 6px !important;
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

        /* View Toggle Switch */
        .new-horo-page .view-toggle-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
          margin-top: 5px;
          width: 100%;
        }
        .new-horo-page .view-toggle {
          display: inline-flex;
          background: #f1f2f6;
          border-radius: 14px;
          padding: 2px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
        }
        .new-horo-page .view-toggle-btn {
          height: 24px !important;
          padding: 0 12px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7f8c8d;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .new-horo-page .view-toggle-btn.active {
          background: #ffffff;
          color: #8e44ad;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          transform: scale(1.02);
        }

        /* PDF and Share Buttons styling */
        .new-horo-page .export-panel {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-top: 15px !important;
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
        }
      `}),t.jsxs("div",{className:"top-bar-card",children:[t.jsxs("div",{className:"top-bar-details",onClick:J,children:[t.jsxs("div",{style:{fontSize:"15px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:[t.jsxs("span",{children:["📅 ",n.dob?n.dob.split("-").reverse().join("-"):""]}),t.jsxs("span",{children:["⏰ ",n.tob]})]}),t.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%",marginTop:"3px"},children:["📍 ",n.city]})]}),m&&!L.loading&&t.jsx("div",{className:"view-toggle-container",onClick:r=>r.stopPropagation(),style:{margin:0,width:"auto"},children:t.jsxs("div",{className:"view-toggle",children:[t.jsx("button",{className:`view-toggle-btn ${k==="natal"?"active":""}`,onClick:()=>A("natal"),children:e("Natal","Natal")}),t.jsx("button",{className:`view-toggle-btn ${k==="transit"?"active":""}`,onClick:()=>A("transit"),children:e("Transit","Transit")})]})})]}),t.jsx("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"-8px",marginBottom:"12px"},children:"ℹ️ Click on the card above to change date, time, or location details."}),t.jsxs("section",{className:"workspace",style:{display:"flex",flexDirection:"column",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[L.error&&t.jsx("div",{className:"message error",style:{background:"#fdedec",color:"#c0392b",padding:"15px",borderRadius:"12px",border:"1px solid #f5b7b1",textAlign:"center"},children:L.error}),L.loading&&t.jsxs("div",{className:"message",style:{background:"#ffffff",color:"#2c3e50",padding:"20px",borderRadius:"14px",boxShadow:"0 4px 15px rgba(0,0,0,0.03)",textAlign:"center",border:"1px solid #eaecee",margin:"0 15px"},children:["⏳ ",e("processingWait","Processing...")]}),m&&!L.loading&&t.jsxs(t.Fragment,{children:[k==="natal"&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"charts-table-row",children:[t.jsx(vt,{planets:m.planets,navamsa:m.navamsa_d9,d2:m.d2,d3:m.d3,d4:m.d4,d7:m.d7,d10:m.d10,d12:m.d12,d16:m.d16,d20:m.d20,d24:m.d24,d27:m.d27,d30:m.d30,d60:m.d60,d1Footer:t.jsxs("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"10px"},children:[t.jsx("strong",{children:"Ayanamsha:"})," ",m?.meta?.ayanamsha_name?`${m.meta.ayanamsha_name} (${m.meta.ayanamsha}°)`:(()=>{const r=JSON.parse(localStorage.getItem("eclock_prefs")||"{}");return{lahiri:"Lahiri (Chitra Paksha)",raman:"Raman",krishnamurti:"Krishnamurti (KP)",yukteshwar:"Sri Yukteshwar",true_citra:"True Citra",fagan_bradley:"Fagan/Bradley",custom:`Custom (${r.ayanamsha_val}°)`}[r.ayanamsha_type||"lahiri"]||"Lahiri"})()]}),d9Footer:t.jsxs("div",{className:"export-panel",children:[t.jsxs("button",{className:"btn-pdf",onClick:()=>M("download"),title:e("downloadPdf","Download PDF Report"),children:[t.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[t.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),t.jsx("polyline",{points:"7 10 12 15 17 10"}),t.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),e("pdf","PDF")]}),t.jsxs("button",{className:"btn-share",onClick:()=>M("share"),title:e("sharePdf","Share PDF Report"),children:[t.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[t.jsx("circle",{cx:"18",cy:"5",r:"3"}),t.jsx("circle",{cx:"6",cy:"12",r:"3"}),t.jsx("circle",{cx:"18",cy:"19",r:"3"}),t.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),t.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),e("share","Share")]})]})}),t.jsx(St,{planets:m.planets,hideTitle:!0})]}),t.jsx(jt,{title:e("Panchanga","Panchanga"),text:mt(m.panchanga,e)}),t.jsx(kt,{dashas:m.dashas}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",width:"100%"},className:"shadbala-akv-row",children:[t.jsx(At,{shadabala:m.shadabala}),t.jsx(Ct,{ashtakavarga:m.ashtakavarga})]})]}),k==="transit"&&t.jsx(Et,{natalData:m,formData:n})]})]}),d&&t.jsx("div",{className:"popup-container",children:t.jsxs("div",{className:"popup-content",children:[t.jsxs("h3",{style:{marginTop:0,color:"#8e44ad",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[t.jsx("span",{children:"✏️ Change Details"}),t.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[t.jsx("button",{type:"button",onClick:z,style:{background:"#ebf5fb",border:"1px solid #3498db",color:"#3498db",padding:"4px 10px",borderRadius:"15px",fontSize:"12px",fontWeight:"bold",cursor:"pointer",minHeight:"auto",lineHeight:"1"},children:e("new","New")}),t.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>c(!1),children:"❌"})]})]}),t.jsxs("div",{style:{display:"flex",borderBottom:"1px solid #eaecee",marginBottom:"15px"},children:[t.jsx("button",{className:`popup-tab ${w==="input"?"active":""}`,onClick:()=>u("input"),children:"Manual Entry"}),t.jsx("button",{className:`popup-tab ${w==="profiles"?"active":""}`,onClick:()=>u("profiles"),children:"Saved Profiles"})]}),w==="input"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"15px"},children:[t.jsxs("div",{style:{display:"flex",gap:"15px"},children:[t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:2},children:["Name (to Save Profile):",t.jsx("input",{type:"text",value:p.name||"",onChange:r=>l({...p,name:r.target.value}),placeholder:"Enter name here...",style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe",width:"100%",boxSizing:"border-box"}})]}),t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Gender:",t.jsxs("select",{value:p.gender||"male",onChange:r=>l({...p,gender:r.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe",height:"41px",width:"100%",boxSizing:"border-box"},children:[t.jsx("option",{value:"male",children:"Male"}),t.jsx("option",{value:"female",children:"Female"})]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"15px"},children:[t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Date:",t.jsx("input",{type:"date",value:p.dob,onChange:r=>l({...p,dob:r.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]}),t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Time:",t.jsx("input",{type:"time",value:p.tob,onChange:r=>l({...p,tob:r.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]})]}),t.jsx(wt,{city:p.city,onLocationSelect:r=>l({...p,city:r.city,latitude:r.latitude,longitude:r.longitude,timezone:r.timezone})}),t.jsxs("details",{style:{marginTop:"-10px",fontSize:"14px",background:"#fdfefe",padding:"12px",borderRadius:"8px",border:"1px solid #eee"},children:[t.jsx("summary",{style:{cursor:"pointer",color:"#3498db",fontWeight:"bold",outline:"none",listStyle:"none"},children:"Manual Coordinates (Lat / Lon / Tz)"}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"10px"},children:[t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lat:",t.jsx("input",{type:"text",name:"latitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:p.latitude||"",onChange:r=>l({...p,latitude:r.target.value})})]}),t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lon:",t.jsx("input",{type:"text",name:"longitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:p.longitude||"",onChange:r=>l({...p,longitude:r.target.value})})]}),t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Tz:",t.jsx("input",{type:"text",name:"timezone",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:p.timezone||"",onChange:r=>l({...p,timezone:r.target.value})})]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[t.jsx("button",{onClick:S,style:{flex:1,background:"#27ae60",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(39, 174, 96, 0.2)"},title:"Save the current details as a new profile",children:"Save Profile"}),t.jsx("button",{onClick:s,style:{flex:1,background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)"},children:"Apply"})]})]}),w==="profiles"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[t.jsx("input",{type:"text",placeholder:e("searchProfiles","Search profiles..."),value:b,onChange:r=>v(r.target.value),style:{width:"100%",padding:"8px 12px",border:"1px solid #8e44ad",borderRadius:"8px",fontSize:"14px",outline:"none",background:"#fdfefe",boxSizing:"border-box"}}),t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"350px",overflowY:"auto",padding:"5px 0"},children:Object.keys(h).filter(r=>{const x=b.trim().toLowerCase();return x===""||r.toLowerCase().includes(x)||(h[r].city||"").toLowerCase().includes(x)}).length===0?t.jsx("p",{style:{textAlign:"center",color:"#7f8c8d",padding:"20px 0"},children:"No saved profiles found."}):Object.keys(h).filter(r=>{const x=b.trim().toLowerCase();return x===""||r.toLowerCase().includes(x)||(h[r].city||"").toLowerCase().includes(x)}).map(r=>t.jsxs("div",{className:"profile-card",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",textAlign:"left",width:"100%",boxSizing:"border-box"},children:[t.jsxs("div",{onClick:()=>V(r),style:{flex:1,cursor:"pointer",padding:"4px 0",textAlign:"left"},children:[t.jsx("strong",{style:{color:"#2c3e50",fontSize:"15px",display:"block",marginBottom:"4px",textAlign:"left"},children:r}),t.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",display:"flex",flexDirection:"column",gap:"4px",textAlign:"left"},children:[t.jsxs("span",{children:["📅 ",h[r].dob?h[r].dob.split("-").reverse().join("-"):""]}),t.jsxs("span",{children:["⏰ ",h[r].tob||""]}),t.jsxs("span",{children:["📍 ",h[r].city?h[r].city.split(",")[0].trim():""]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"8px"},children:[t.jsx("button",{onClick:x=>{x.stopPropagation(),V(r)},title:"Edit",style:{background:"#ebf5fb",border:"1px solid #3498db",color:"#3498db",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"✏️"}),t.jsx("button",{onClick:x=>{if(x.stopPropagation(),window.confirm(`Are you sure you want to delete the profile "${r}"?`)){const g={...h};delete g[r],y(g),localStorage.setItem("vaiswanara_profiles",JSON.stringify(g))}},title:"Delete",style:{background:"#fdedec",border:"1px solid #e74c3c",color:"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"🗑️"})]})]},r))})]})]})})]})}export{Yt as HoroscopePageNew};
