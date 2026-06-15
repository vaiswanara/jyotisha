import{u as Y,j as t,r as D}from"./vendor-DGJAU7LJ.js";import{L as jt}from"./LocationAutocomplete-BUqDlnxv.js";import{f as bt}from"./index-CIkE80UA.js";import{R as St,P as kt}from"./PredictionPanel-NzCJ0hpO.js";function yt(r){const n=Number(r);if(!Number.isFinite(n))return"-";const e=Math.floor(n),a=(n-e)*60,o=Math.floor(a);return`${e}° ${o.toString().padStart(2,"0")}'`}function $t({planets:r={},hideTitle:n=!1}){const{t:e}=Y(),a=Object.entries(r).filter(([,o])=>o&&o.rashi);return t.jsxs("section",{className:"table-panel",children:[!n&&t.jsx("h2",{children:e("grahaPositions","Graha Positions")}),t.jsx("div",{className:"table-scroll",children:t.jsxs("table",{children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:e("Planet")}),t.jsx("th",{children:e("Degree")}),t.jsx("th",{children:e("Nakshatra")}),t.jsx("th",{children:e("Pada")})]})}),t.jsx("tbody",{children:a.map(([o,g])=>t.jsxs("tr",{children:[t.jsxs("td",{"data-label":e("Planet"),children:[e(o),g.retrograde&&t.jsx("span",{style:{color:"#d35400",fontWeight:"bold",marginLeft:"4px"},title:"Retrograde",children:"R"}),g.combust&&t.jsx("span",{style:{color:"#8e44ad",fontWeight:"bold",marginLeft:"4px"},title:"Combust",children:"C"})]}),t.jsx("td",{"data-label":e("Degree"),children:yt(g.degree)}),t.jsx("td",{"data-label":e("Nakshatra"),children:g.nakshatra?e(g.nakshatra):"-"}),t.jsx("td",{"data-label":e("Pada"),children:g.pada||"-"})]},o))})]})})]})}const dt={Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17,Ketu:7,Venus:20},K=["Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury","Ketu","Venus"],pt=365.2425*24*60*60*1e3;function zt({dashas:r=[]}){const{t:n}=Y(),e=wt(r),a=Rt(e);return e.length?t.jsxs("section",{className:"dasha-panel",children:[t.jsxs("div",{className:"section-heading",children:[t.jsxs("div",{children:[t.jsx("p",{className:"eyebrow",children:n("Dasha Timeline")}),t.jsx("h2",{children:n("Vimshottari Dasha")})]}),t.jsx("span",{children:new Date().toLocaleDateString("en-IN")})]}),a.maha&&t.jsxs("div",{className:"current-dasha-card",children:[t.jsx(ot,{label:n("Maha Dasha"),item:a.maha,t:n}),t.jsx(ot,{label:n("Antar Dasha"),item:a.antar,t:n}),t.jsx(ot,{label:n("Pratyantar Dasha"),item:a.pratyantar,t:n})]}),t.jsx("div",{className:"dasha-tree",children:e.map(o=>{const g=a.maha?.id===o.id;return t.jsxs("details",{className:`dasha-node maha${g?" current":""}`,open:g,children:[t.jsxs("summary",{children:[t.jsx("span",{children:n(o.planet)}),t.jsx("small",{children:vt(o.start,o.end)})]}),t.jsx("div",{className:"dasha-children",children:o.antardashas.map(m=>{const s=a.antar?.id===m.id;return t.jsxs("details",{className:`dasha-node antar${s?" current":""}`,open:s,children:[t.jsxs("summary",{children:[t.jsx("span",{children:n(m.planet)}),t.jsxs("small",{children:["Ends ",tt(m.end)]})]}),t.jsx("div",{className:"dasha-children compact",children:m.pratyantaraDashas.map(f=>t.jsxs("div",{className:`dasha-leaf${a.pratyantar?.id===f.id?" current":""}`,children:[t.jsx("span",{children:n(f.planet)}),t.jsx("small",{children:tt(f.end)})]},f.id))})]},m.id)})})]},o.id)})})]}):t.jsxs("section",{className:"dasha-panel",children:[t.jsx("h2",{children:n("Vimshottari Dasha")}),t.jsx("p",{className:"empty-text",children:n("dashaUnavailable")})]})}function ot({label:r,item:n,t:e}){return t.jsxs("div",{children:[t.jsx("span",{children:r}),t.jsx("strong",{children:n?e(n.planet):"-"}),t.jsx("small",{children:n?vt(n.start,n.end):""})]})}function wt(r){const n=r.map((e,a)=>({...e,id:`md-${a}`,planet:e.planet||e.lord,start:e.start,end:e.end,balance:e.balance,antardashas:(e.antardashas||[]).map((o,g)=>({...o,id:`md-${a}-ad-${g}`,planet:o.planet||o.lord,start:o.start,end:o.end,pratyantaraDashas:(o.pratyantara_dashas||o.pratyantardashas||[]).map((m,s)=>({...m,id:`md-${a}-ad-${g}-pd-${s}`,planet:m.planet||m.lord,start:m.start,end:m.end}))}))}));return Nt(n)}function Nt(r){if(!r.length)return r;const n=r[0],e=dt[n.planet],a=Q(n.end);if(!e||!a)return r;const o=a.getTime()-e*pt;return[{...n,start:U(o),antardashas:At(o,n.planet,e,n.id)},...r.slice(1)]}function At(r,n,e,a){const o=[];let g=r,m=K.indexOf(n);m===-1&&(m=0);for(let s=0;s<K.length;s+=1){const f=K[(m+s)%K.length],h=e*dt[f]/120,v=g+h*pt,p=`${a}-ad-${s}`;o.push({id:p,planet:f,start:U(g),end:U(v),pratyantaraDashas:Dt(g,f,h,p)}),g=v}return o}function Dt(r,n,e,a){const o=[];let g=r,m=K.indexOf(n);m===-1&&(m=0);for(let s=0;s<K.length;s+=1){const f=K[(m+s)%K.length],h=e*dt[f]/120,v=g+h*pt;o.push({id:`${a}-pd-${s}`,planet:f,start:U(g),end:U(v)}),g=v}return o}function Rt(r){const n=new Date,e={maha:null,antar:null,pratyantar:null};for(const a of r)if(it(n,a.start,a.end)){e.maha=a;for(const o of a.antardashas)if(it(n,o.start,o.end)){e.antar=o;for(const g of o.pratyantaraDashas)if(it(n,g.start,g.end)){e.pratyantar=g;break}break}break}return e}function it(r,n,e){const a=Q(n),o=Q(e);return!a||!o?!1:r>=a&&r<o}function Q(r){if(!r)return null;const n=new Date(`${r}T00:00:00`);return Number.isNaN(n.getTime())?null:n}function vt(r,n){return`${tt(r)} - ${tt(n)}`}function tt(r){const n=Q(r);return n?n.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"-"}function U(r){const n=r instanceof Date?r:new Date(r),e=n.getFullYear(),a=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function Pt({shadabala:r}){const{t:n}=Y();if(!r)return null;const e=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];return t.jsxs("section",{className:"table-panel",children:[t.jsx("h2",{children:n("Shadabala","Shadabala (Planetary Strength)")}),t.jsx("div",{className:"table-scroll",style:{overflowX:"auto",maxWidth:"100%"},children:t.jsxs("table",{children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:n("Planet")}),t.jsx("th",{children:n("Sthana")}),t.jsx("th",{children:n("Dig")}),t.jsx("th",{children:n("Kala")}),t.jsx("th",{children:n("Chesta")}),t.jsx("th",{children:n("Naisargika")}),t.jsx("th",{children:n("Drig")}),t.jsx("th",{children:n("Total Rupas")})]})}),t.jsx("tbody",{children:e.map(a=>{if(!r[a])return null;const o=r[a],g=Math.min(100,o.total_rupas/300*100);return t.jsxs("tr",{children:[t.jsx("td",{"data-label":n("Planet"),children:t.jsx("span",{className:"planet-name",children:n(a)})}),t.jsx("td",{"data-label":n("Sthana"),className:"deg-val",children:o.sthana_bala}),t.jsx("td",{"data-label":n("Dig"),className:"deg-val",children:o.dig_bala}),t.jsx("td",{"data-label":n("Kala"),className:"deg-val",children:o.kala_bala}),t.jsx("td",{"data-label":n("Chesta"),className:"deg-val",children:o.chesta_bala}),t.jsx("td",{"data-label":n("Naisargika"),className:"deg-val",children:o.naisargika_bala}),t.jsx("td",{"data-label":n("Drig"),className:"deg-val",children:o.drig_bala}),t.jsx("td",{"data-label":n("Total Rupas"),children:t.jsxs("div",{className:"strength-bar-wrap",children:[t.jsx("div",{className:"strength-bar",children:t.jsx("div",{className:"strength-bar-fill",style:{width:`${g}%`}})}),t.jsx("span",{className:"strength-val",children:o.total_rupas})]})})]},a)})})]})})]})}const _t={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sh"},Tt=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],Ct={1:{rashi:{x:160,y:35},planets:{x:160,y:90}},2:{rashi:{x:80,y:25},planets:{x:80,y:55}},3:{rashi:{x:25,y:80},planets:{x:55,y:80}},4:{rashi:{x:35,y:160},planets:{x:90,y:160}},5:{rashi:{x:25,y:240},planets:{x:55,y:240}},6:{rashi:{x:80,y:295},planets:{x:80,y:265}},7:{rashi:{x:160,y:285},planets:{x:160,y:230}},8:{rashi:{x:240,y:295},planets:{x:240,y:265}},9:{rashi:{x:295,y:240},planets:{x:265,y:240}},10:{rashi:{x:285,y:160},planets:{x:230,y:160}},11:{rashi:{x:295,y:80},planets:{x:265,y:80}},12:{rashi:{x:240,y:25},planets:{x:240,y:55}}};function Wt({ashtakavarga:r,lagnaRashi:n=1}){const{t:e}=Y(),[a,o]=D.useState("Sarva"),[g,m]=D.useState(()=>localStorage.getItem("vaiswanara_chart_style")||"south");if(D.useEffect(()=>{const x=()=>{m(localStorage.getItem("vaiswanara_chart_style")||"south")};return window.addEventListener("vaiswanara_chart_style_changed",x),()=>{window.removeEventListener("vaiswanara_chart_style_changed",x)}},[]),!r)return null;const{prastarashtakavarga:s,sarvashtakavarga:f}=r,h=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"],v=(x,d)=>{const y=d?"SAV":`${e(a)} BAV`;return t.jsxs("div",{className:"south-chart",style:{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gridTemplateRows:"repeat(4, minmax(0, 1fr))",width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"1rem auto 0 auto",border:"2px solid #8e44ad",boxSizing:"border-box"},children:[Tt.flatMap((j,S)=>j.map((l,R)=>{if(l===null)return null;const $=d?x[l]?.points??0:x[l]??0;let N="";return d?N=$>=28?"high":$<20?"low":"":N=$>=5?"high":$<=2?"low":"",t.jsx("div",{className:"south-chart-cell",style:{gridColumn:R+1,gridRow:S+1,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #ccc",minWidth:0,minHeight:0},children:t.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:t.jsx("strong",{className:`akv-pts ${N}`,style:{fontSize:"1.4rem"},children:$})})},`${S}-${R}`)})),t.jsxs("div",{className:"south-chart-center",style:{gridColumn:"2 / 4",gridRow:"2 / 4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",background:"#f9f0ff"},children:[t.jsx("strong",{style:{fontSize:"clamp(14px, 4vw, 20px)"},children:y}),t.jsx("span",{style:{fontSize:"clamp(10px, 3vw, 14px)",marginTop:"4px",color:"#7a6e60"},children:d?e("sarvashtakavarga","(Sarvashtakavarga)"):e("bhinnashtakavarga","(Bhinnashtakavarga)")})]})]})},p=(x,d)=>{const y=d?"SAV":`${e(a)} BAV`,j=n||1,S=[];for(let l=1;l<=12;l++){const R=(j+l-2)%12+1,$=d?x[R]?.points??0:x[R]??0;let N="";d?N=$>=28?"high":$<20?"low":"":N=$>=5?"high":$<=2?"low":"";const _=Ct[l];S.push({houseNum:l,rashiNum:R,pts:$,cls:N,pos:_})}return t.jsx("div",{className:"north-chart","aria-label":`North Indian ${y}`,style:{width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"1rem auto 0 auto",boxSizing:"border-box"},children:t.jsxs("svg",{viewBox:"0 0 320 320",width:"100%",height:"100%",style:{display:"block",background:"#ffffff",border:"2px solid #8e44ad",borderRadius:"8px",boxSizing:"border-box"},children:[t.jsx("rect",{x:"0",y:"0",width:"320",height:"320",fill:"none",stroke:"#8e44ad",strokeWidth:"2"}),t.jsx("line",{x1:"0",y1:"0",x2:"320",y2:"320",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"0",y1:"320",x2:"320",y2:"0",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"160",y1:"0",x2:"0",y2:"160",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"0",y1:"160",x2:"160",y2:"320",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"160",y1:"320",x2:"320",y2:"160",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"320",y1:"160",x2:"160",y2:"0",stroke:"#ccc",strokeWidth:"1.5"}),S.map(({houseNum:l,rashiNum:R,pts:$,cls:N,pos:_})=>{let L="#2c3e50";return N==="high"?L="#27ae60":N==="low"&&(L="#c0392b"),t.jsxs("g",{children:[t.jsx("text",{x:_.rashi.x,y:_.rashi.y,textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"11px",fontWeight:"bold",fill:"#7f8c8d",fontFamily:"sans-serif",userSelect:"none"},children:R}),t.jsx("text",{x:_.planets.x,y:_.planets.y+4,textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"18px",fontWeight:"bold",fill:L,fontFamily:"sans-serif"},children:$})]},l)}),t.jsxs("g",{transform:"translate(160, 160)",children:[t.jsx("rect",{x:"-45",y:"-18",width:"90",height:"36",rx:"4",fill:"#f9f0ff",stroke:"#8e44ad",strokeWidth:"1"}),t.jsx("text",{x:"0",y:"-4",textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"10px",fontWeight:"bold",fill:"#8e44ad",fontFamily:"sans-serif"},children:y}),t.jsx("text",{x:"0",y:"10",textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"9px",fill:"#666",fontFamily:"sans-serif"},children:d?e("sarvashtakavarga","(Sarvashtakavarga)"):e("bhinnashtakavarga","(Bhinnashtakavarga)")})]})]})})};return t.jsxs("section",{className:"table-panel",children:[t.jsx("h2",{children:e("ashtakavarga","Ashtakavarga")}),t.jsxs("div",{className:"akv-planet-tabs",style:{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"15px"},children:[t.jsx("button",{type:"button",className:`akv-tab akv-sarva-btn ${a==="Sarva"?"active":""}`,onClick:()=>o("Sarva"),style:{width:"100%",padding:"12px 16px",fontSize:"15px",fontWeight:"600",borderRadius:"10px",border:"2px solid #e0e0e0",background:a==="Sarva"?"#8e44ad":"#f9f0ff",color:a==="Sarva"?"#fff":"#8e44ad",cursor:"pointer",transition:"all 0.2s ease"},children:e("sarvaTotal","Sarva (Total)")}),t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px",justifyContent:"center"},children:h.map(x=>t.jsx("button",{type:"button",className:`akv-tab akv-planet-btn ${a===x?"active":""}`,onClick:()=>o(x),style:{width:"42px",height:"40px",padding:"0",fontSize:"13px",fontWeight:"600",borderRadius:"8px",border:"2px solid #e0e0e0",background:a===x?"#8e44ad":"#fff",color:a===x?"#fff":"#8e44ad",cursor:"pointer",transition:"all 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center",minWidth:"42px"},title:e(x),children:_t[x]},x))})]}),t.jsx("div",{id:"akv-tables",children:a==="Sarva"?g==="north"?p(f,!0):v(f,!0):g==="north"?p(s[a]||{},!1):v(s[a]||{},!1)})]})}const st=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"],q={Sun:"Surya",Moon:"Chandra",Mars:"Kuja",Mercury:"Budha",Jupiter:"Guru",Venus:"Sukra",Saturn:"Shani",Rahu:"Rahu",Ketu:"Ketu"},Mt={1:"Mars",2:"Venus",3:"Mercury",4:"Moon",5:"Sun",6:"Mercury",7:"Venus",8:"Mars",9:"Jupiter",10:"Saturn",11:"Saturn",12:"Jupiter"};function Lt(r,n){if(r==="Rahu"||r==="Ketu")return"-";let e=[];for(let o=1;o<=12;o++)Mt[o]===r&&e.push(o);return e.length===0?"-":e.map(o=>(o-n+12)%12+1).join(", ")}function Bt(r,n,e){const a=q[r];if(e){let g=e[a]||e[r];if(Array.isArray(g))return g.includes(n)?"Shubha":"Ashubha";if(g&&typeof g=="object")return g[n.toString()]||"Unknown"}const o={Sun:[3,6,10,11],Moon:[1,3,6,7,10,11],Mars:[3,6,11],Mercury:[2,4,6,8,10,11],Jupiter:[2,5,7,9,11],Venus:[1,2,3,4,5,8,9,11,12],Saturn:[3,6,11],Rahu:[3,6,11],Ketu:[3,6,11]};return o[r]?o[r].includes(n)?"Shubha":"Ashubha":"-"}function Vt(r,n,e,a){if(!a)return"-";const o=q[r];let g=a.find(m=>{let s=Object.keys(m).find(f=>f.replace(/^\uFEFF/,"")==="Graha");return s?m[s]===o&&String(m.Gochara)===String(n):!1});return g&&g[e]||"-"}function Et(r,n,e,a,o){const g={Sun:{3:9,6:12,10:4,11:5},Moon:{1:5,3:9,6:12,7:2,10:4,11:8},Mars:{3:12,6:9,11:5},Mercury:{2:5,4:3,6:9,8:1,10:8,11:12},Jupiter:{2:12,5:4,7:3,9:10,11:8},Venus:{1:8,2:7,3:1,4:10,5:9,8:5,9:11,11:6,12:3},Saturn:{3:12,6:9,11:5},Rahu:{3:12,6:9,11:5},Ketu:{3:12,6:9,11:5}},m={};for(let d in g){m[d]={};for(let y in g[d])m[d][g[d][y]]=parseInt(y)}const s={Sun:["Saturn"],Saturn:["Sun"],Moon:["Mercury"],Mercury:["Moon"]};let f=g[r]&&g[r][n],h=!1;if(f||(f=m[r]&&m[r][n],f&&(h=!0)),!f)return{text:"-",color:"#333",hasVedha:!1};let v=(a+f-2)%12+1,p=[],x=s[r]||[];if(Object.entries(e).forEach(([d,y])=>{y===v&&d!==r&&d!=="Ascendant"&&!x.includes(d)&&p.push(o(d,q[d]||d))}),p.length>0){const d=p.join(", ");return h?{text:o("vamaVedhaBy","Vama Vedha by {{planets}}",{planets:d}),color:"#27ae60",hasVedha:!0,isVama:!0}:{text:o("vedhaBy","Vedha by {{planets}}",{planets:d}),color:"#e74c3c",hasVedha:!0,isVama:!1}}return{text:"-",color:"#333",hasVedha:!1}}const Ht=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],lt={Ascendant:"Lg",Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke"},Jt={1:{rashi:{x:160,y:35},planets:{x:160,y:90}},2:{rashi:{x:80,y:25},planets:{x:80,y:55}},3:{rashi:{x:25,y:80},planets:{x:55,y:80}},4:{rashi:{x:35,y:160},planets:{x:90,y:160}},5:{rashi:{x:25,y:240},planets:{x:55,y:240}},6:{rashi:{x:80,y:295},planets:{x:80,y:265}},7:{rashi:{x:160,y:285},planets:{x:160,y:230}},8:{rashi:{x:240,y:295},planets:{x:240,y:265}},9:{rashi:{x:295,y:240},planets:{x:265,y:240}},10:{rashi:{x:285,y:160},planets:{x:230,y:160}},11:{rashi:{x:295,y:80},planets:{x:265,y:80}},12:{rashi:{x:240,y:25},planets:{x:240,y:55}}};function ht(r,n){return Object.entries(r||{}).filter(([e,a])=>Number(a?.rashi)===n).map(([e,a])=>({name:e,label:lt[e]||e,retrograde:!!a.retrograde,combust:!!a.combust}))}function xt({planets:r,title:n,subtitle:e,t:a,borderColor:o,centerBg:g}){const[m,s]=D.useState(()=>localStorage.getItem("vaiswanara_chart_style")||"south");D.useEffect(()=>{const h=()=>{s(localStorage.getItem("vaiswanara_chart_style")||"south")};return window.addEventListener("vaiswanara_chart_style_changed",h),()=>{window.removeEventListener("vaiswanara_chart_style_changed",h)}},[]);const f=(h,v,p)=>{const x=[];for(let y=0;y<h.length;y+=3)x.push(h.slice(y,y+3));return x.map((y,j)=>{let S=p;return x.length===2?S=p-6+j*12:x.length===3?S=p-12+j*12:x.length>3&&(S=p-18+j*12),t.jsx("text",{x:v,y:S,textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"12px",fontFamily:"sans-serif"},children:y.map((l,R)=>{const $=l.retrograde,N=l.combust,_=$?"#d35400":N?"#8e44ad":"#2d3436",L="800",T=a(l.label,l.label);return t.jsxs("tspan",{fill:_,fontWeight:L,dx:R>0?"4px":"0px",children:[T,$&&"R",N&&"c"]},l.name)})},j)})};if(m==="north"){const h=r.Ascendant?.rashi??1,v=[];for(let p=1;p<=12;p++){const x=(h+p-2)%12+1,d=ht(r,x),y=Jt[p];v.push({houseNum:p,rashiNum:x,planetList:d,pos:y})}return t.jsx("div",{className:"north-chart","aria-label":`North Indian ${n}`,style:{width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"0 auto",boxSizing:"border-box"},children:t.jsxs("svg",{viewBox:"0 0 320 320",width:"100%",height:"100%",style:{display:"block",background:"#ffffff",border:`2px solid ${o}`,borderRadius:"8px",boxSizing:"border-box"},children:[t.jsx("rect",{x:"0",y:"0",width:"320",height:"320",fill:"none",stroke:o,strokeWidth:"2"}),t.jsx("line",{x1:"0",y1:"0",x2:"320",y2:"320",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"0",y1:"320",x2:"320",y2:"0",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"160",y1:"0",x2:"0",y2:"160",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"0",y1:"160",x2:"160",y2:"320",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"160",y1:"320",x2:"320",y2:"160",stroke:"#ccc",strokeWidth:"1.5"}),t.jsx("line",{x1:"320",y1:"160",x2:"160",y2:"0",stroke:"#ccc",strokeWidth:"1.5"}),v.map(({houseNum:p,rashiNum:x,planetList:d,pos:y})=>t.jsxs("g",{children:[t.jsx("text",{x:y.rashi.x,y:y.rashi.y,textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"12px",fontWeight:"bold",fill:"#7f8c8d",fontFamily:"sans-serif",userSelect:"none"},children:x}),f(d,y.planets.x,y.planets.y)]},p)),t.jsxs("g",{transform:"translate(160, 160)",children:[t.jsx("rect",{x:"-45",y:"-18",width:"90",height:"36",rx:"4",fill:g,stroke:o,strokeWidth:"1"}),t.jsx("text",{x:"0",y:"-4",textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"10px",fontWeight:"bold",fill:o,fontFamily:"sans-serif"},children:a(n,n)}),t.jsx("text",{x:"0",y:"10",textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"9px",fill:"#666",fontFamily:"sans-serif"},children:e})]})]})})}return t.jsxs("div",{className:"south-chart",style:{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gridTemplateRows:"repeat(4, minmax(0, 1fr))",width:"100%",maxWidth:"320px",aspectRatio:"1 / 1",margin:"0 auto",border:`2px solid ${o}`,boxSizing:"border-box",background:"#fff",boxShadow:"0 4px 10px rgba(0,0,0,0.05)",borderRadius:"4px"},children:[Ht.flatMap((h,v)=>h.map((p,x)=>{if(p===null)return null;const d=ht(r,p),y=d.length;let j="clamp(13px, 4.5vw, 19px)",S="4px";return y===4?(j="clamp(11.5px, 3.5vw, 16px)",S="3px"):y===5?(j="clamp(10px, 3vw, 14px)",S="2px"):y>=6&&(j="clamp(9px, 2.5vw, 12px)",S="1px"),t.jsx("div",{className:"south-chart-cell",style:{gridColumn:x+1,gridRow:v+1,border:"1px solid #e0e0e0",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxSizing:"border-box",minWidth:0,minHeight:0},children:t.jsx("div",{className:"planet-cluster",style:{display:"flex",flexWrap:"wrap",alignContent:"center",justifyContent:"center",gap:S,width:"100%",height:"100%"},children:d.map(l=>t.jsxs("span",{className:`planet-token${l.retrograde?" is-retrograde":""}${l.combust?" is-combust":""}`,style:{fontSize:j,lineHeight:1.1,fontWeight:700,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",justifyContent:"center",width:y>=4?"45%":"auto",color:l.retrograde?"#d35400":l.combust?"#8e44ad":"#2d3436"},children:[a(l.label,l.label),l.retrograde&&t.jsx("sup",{style:{fontSize:"0.65em",color:"#d35400",marginLeft:"1px",fontWeight:"bold"},children:"R"}),l.combust&&t.jsx("sub",{style:{fontSize:"0.65em",color:"#8e44ad",marginLeft:"1px",fontWeight:"bold"},children:"c"})]},l.name))})},`${v}-${x}`)})),t.jsxs("div",{className:"south-chart-center",style:{gridColumn:"2 / 4",gridRow:"2 / 4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",background:g,border:`1px solid ${o}20`},children:[t.jsx("strong",{style:{fontSize:"clamp(14px, 4vw, 20px)",color:o},children:a(n,n)}),t.jsx("span",{style:{fontSize:"clamp(10px, 3vw, 14px)",color:"#666",marginTop:"4px"},children:e})]})]})}function Gt({natalData:r,formData:n}){const{t:e,i18n:a}=Y(),[o,g]=D.useState(()=>{const c=new Date;return`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`}),[m,s]=D.useState(()=>{const c=new Date;return`${String(c.getHours()).padStart(2,"0")}:${String(c.getMinutes()).padStart(2,"0")}`}),f={en:"english",te:"telugu",kn:"kannada",sa:"sanskrit"},[h,v]=D.useState(()=>f[a.language?.split("-")[0]]||"telugu");D.useEffect(()=>{const c=f[a.language?.split("-")[0]];c&&v(c)},[a.language]);const[p,x]=D.useState(null),[d,y]=D.useState(!1),[j,S]=D.useState(""),[l,R]=D.useState(null),[$,N]=D.useState(null),[_,L]=D.useState(st[0]);D.useEffect(()=>{async function c(z){try{const u=await(await fetch(z)).text();return JSON.parse(u)}catch{return null}}async function P(){try{const z="/jyotisha/";let i=await c(`${z}static/Gochara_phala_All_languages.json`);if(i||(i=await c(`${z}jataka/static/Gochara_phala_All_languages.json`)),!i)throw new Error("Gochara_phala_All_languages.json file not found.");R(i);const u=[`${z}static/planet-transit-results.json`,`${z}jataka/static/planet-transit-results.json`,`${z}static/planet_transit_results.json`,`${z}planet-transit-results.json`];let w=null;for(let B of u)if(w=await c(B),w)break;N(w||null)}catch(z){console.error("Failed to load transit JSON files:",z),S("Failed to load Transit Data: "+z.message)}}P()},[]),D.useEffect(()=>{async function c(){if(!(!o||!m)){y(!0),S("");try{const z=await bt({...n,dob:o,tob:m});x(z)}catch(z){S(z.message)}finally{y(!1)}}}const P=setTimeout(()=>{c()},50);return()=>clearTimeout(P)},[o,m,n]);let T=[],V=[];if(!j&&p&&r){const c=r?.planets?.Ascendant?.rashi,P=r?.planets?.Moon?.rashi,z={};if(Object.entries(p.planets||{}).forEach(([i,u])=>{z[i]=u.rashi}),z.Saturn&&P){let i=(z.Saturn-P+12)%12+1;[12,1,2].includes(i)?T.push(e("sadeSatiAlert",`⚠️ Sade Sati (Elinaati Shani) is active! (Shani transiting ${i}H from Natal Moon).`,{st:i})):i===8?T.push(e("ashtamaShaniAlert","⚠️ Ashtama Shani is active! (Shani transiting 8H from Natal Moon).")):i===4&&T.push(e("ardhastamaShaniAlert","⚠️ Ardhastama Shani is active! (Shani transiting 4H from Natal Moon)."))}if(z.Jupiter&&P){let i=(z.Jupiter-P+12)%12+1;[2,5,7,9,11].includes(i)&&T.push(e("guruBalamAlert",`✨ Guru Balam is present! (Guru transiting ${i}H from Natal Moon).`,{gt:i}))}V=st.map(i=>{const u=q[i],w=Lt(i,c),B=r?.planets?.[i]?.rashi,b=p?.planets?.[i]?.rashi,A=B?(B-c+12)%12+1:"-",W=b&&P?(b-P+12)%12+1:"-",X=W!=="-"?Bt(i,W,$):"-";let Z="-";i!=="Rahu"&&i!=="Ketu"&&b&&(Z=r?.ashtakavarga?.prastarashtakavarga?.[i]?.[b]||r?.ashtakavarga?.bav?.[i]?.[b]||"-");const et=W!=="-"?Et(i,W,z,P,e):{text:"-",color:"#333",hasVedha:!1},G=W!=="-"?Vt(i,W,h,l):"-";return{pId:i,pName:u,lordships:w,nPos:A,tPosNM:W,status:X,bavBindus:Z,vedhaInfo:et,phala:G}})}const J=V.filter(c=>c.pId===_);return t.jsxs("div",{className:"transit-tab-container",style:{minWidth:0},children:[t.jsx("style",{children:`
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
      `}),t.jsxs("div",{className:"transit-controls-bar",children:[t.jsxs("h3",{style:{margin:0,color:"#8e44ad",display:"flex",alignItems:"center",gap:"10px"},children:[e("gocharaTransit","Gochara (Transit)"),d&&t.jsx("span",{style:{fontSize:"14px",color:"#e67e22",fontWeight:"normal",fontStyle:"italic"},children:e("updating","Updating...")})]}),t.jsxs("div",{className:"transit-controls-group",children:[t.jsx("div",{className:"transit-input-group",children:t.jsx("input",{type:"date",className:"transit-input",value:o,onChange:c=>g(c.target.value),title:e("date","Date")})}),t.jsx("div",{className:"transit-input-group",children:t.jsx("input",{type:"time",className:"transit-input",value:m,onChange:c=>s(c.target.value),title:e("time","Time")})}),t.jsx("div",{className:"transit-input-group lang-group",style:{display:"none"},children:t.jsxs("select",{className:"transit-input",value:h,onChange:c=>v(c.target.value),title:e("Language","Language"),children:[t.jsx("option",{value:"english",children:e("english","English")}),t.jsx("option",{value:"sanskrit",children:e("sanskrit","Sanskrit")}),t.jsx("option",{value:"telugu",children:e("telugu","Telugu")}),t.jsx("option",{value:"kannada",children:e("kannada","Kannada")})]})})]})]}),j&&t.jsx("div",{className:"message error",children:j}),!j&&p&&t.jsxs("div",{style:{marginTop:"20px",opacity:d?.5:1,transition:"opacity 0.2s ease",pointerEvents:d?"none":"auto"},children:[t.jsxs("div",{className:"transit-charts-row",children:[t.jsxs("div",{className:"transit-chart-card",children:[t.jsx("h3",{className:"natal-header",children:e("natalD1","Natal (D1)")}),t.jsx(xt,{planets:r.planets,title:e("natalChart","Natal Chart"),subtitle:"(D1)",borderColor:"#8e44ad",centerBg:"#f9f0ff",t:e})]}),t.jsxs("div",{className:"transit-chart-card",children:[t.jsx("h3",{className:"transit-header",children:e("transitD1","Transit (D1)")}),t.jsx(xt,{planets:p.planets,title:e("transitChart","Transit Chart"),subtitle:`(D1 on ${o})`,borderColor:"#27ae60",centerBg:"#f0fdf4",t:e})]})]}),T.length>0&&t.jsx("div",{style:{marginBottom:"20px"},children:T.map((c,P)=>t.jsx("div",{style:{background:c.includes("Guru")?"#eafaf1":"#fcf3cf",borderLeft:`5px solid ${c.includes("Guru")?"#27ae60":"#f39c12"}`,padding:"12px 15px",marginBottom:"10px",borderRadius:"8px",color:c.includes("Guru")?"#27ae60":"#d35400",fontSize:"15px"},children:c},P))}),t.jsxs("details",{open:!0,className:"zone-card",children:[t.jsx("summary",{children:t.jsxs("span",{children:["🪐 ",e("transitResults","Transit Results")]})}),t.jsxs("div",{style:{padding:"20px"},children:[t.jsx("div",{className:"transit-planet-tabs",children:st.map(c=>t.jsx("button",{type:"button",onClick:()=>L(c),className:`transit-planet-btn ${_===c?"active":""}`,title:e(q[c]||c),children:e(lt[c]||c,lt[c]||c)},c))}),t.jsx("div",{className:"transit-table-container",style:{marginTop:"20px"},children:t.jsxs("table",{className:"data-table transit-results-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{textAlign:"center",fontSize:"15px"},children:e("Planet","Planet")}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("Lordship","Lordship"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("natalD1","Natal D1"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("natalPos","Natal Pos"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("fromLagna","from Lagna"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("transitPos","Transit Pos"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("fromNatalMoon","from Natal Moon"),")"]})]}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("bavBindus","BAV Bindus"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("inTransitSign","in Transit Sign"),")"]})]}),t.jsx("th",{style:{textAlign:"center",fontSize:"15px"},children:e("transitStatus","Transit Status")}),t.jsxs("th",{style:{textAlign:"center",fontSize:"15px"},children:[e("vedha","Vedha"),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.8em",fontWeight:"normal",opacity:.8},children:["(",e("obstruction","Obstruction"),")"]})]}),t.jsxs("th",{style:{textAlign:"left",fontSize:"15px"},children:[e("transitResults","Transit Results")," (",e(h,h.charAt(0).toUpperCase()+h.slice(1)),")"]})]})}),t.jsx("tbody",{children:J.map((c,P)=>{const z=c.status==="Shubha"?"#27ae60":c.status==="Ashubha"?"#e74c3c":"#555";let i="#333";c.bavBindus!=="-"&&(c.bavBindus>=5?i="#27ae60":c.bavBindus<=3?i="#e74c3c":i="#d35400");let u=c.status==="Shubha"?e("Shubham","Shubham"):c.status==="Ashubha"?e("Ashubham","Ashubham"):e(c.status,c.status),w=u,B=z;return c.vedhaInfo.hasVedha&&(!c.vedhaInfo.isVama&&c.status==="Shubha"?(w=t.jsxs(t.Fragment,{children:[t.jsx("span",{style:{textDecoration:"line-through"},children:u}),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.85em",color:"#e74c3c"},children:["(",e("obstructed","Obstructed"),")"]})]}),B="#7f8c8d"):c.vedhaInfo.isVama&&c.status==="Ashubha"&&(w=t.jsxs(t.Fragment,{children:[t.jsx("span",{style:{textDecoration:"line-through"},children:u}),t.jsx("br",{}),t.jsxs("span",{style:{fontSize:"0.85em",color:"#27ae60"},children:["(",e("obstructed","Obstructed"),")"]})]}),B="#7f8c8d")),t.jsxs("tr",{children:[t.jsx("td",{"data-label":e("Planet","Planet"),children:t.jsx("span",{children:e(c.pId,c.pName)})}),t.jsx("td",{"data-label":e("Lordship","Lordship"),children:t.jsx("span",{children:c.lordships})}),t.jsx("td",{"data-label":e("natalPos","Natal Pos"),children:t.jsx("span",{children:c.nPos})}),t.jsx("td",{"data-label":e("transitPos","Transit Pos"),children:t.jsx("span",{children:c.tPosNM})}),t.jsx("td",{"data-label":e("bavBindus","BAV Bindus"),children:t.jsx("span",{style:{color:i,fontWeight:"bold"},children:c.bavBindus})}),t.jsx("td",{"data-label":e("transitStatus","Transit Status"),children:t.jsx("span",{style:{color:B,fontWeight:"bold"},children:w})}),t.jsx("td",{"data-label":e("vedha","Vedha"),children:t.jsx("span",{style:{color:c.vedhaInfo.color,fontWeight:"bold"},children:c.vedhaInfo.text})}),t.jsx("td",{"data-label":`${e("transitResults","Transit Results")} (${e(h,h.charAt(0).toUpperCase()+h.slice(1))})`,children:t.jsx("span",{children:c.phala})})]},P)})})]})})]})]}),t.jsx(Ot,{natalData:r,transitChart:p,transitDate:o,t:e})]})]})}function Ot({natalData:r,transitChart:n,transitDate:e,t:a}){if(!r||!n||!e)return null;const o=(b,A)=>(b-1+A)%12+1,g=b=>({1:"Mars",2:"Venus",3:"Mercury",4:"Moon",5:"Sun",6:"Mercury",7:"Venus",8:"Mars",9:"Jupiter",10:"Saturn",11:"Saturn",12:"Jupiter"})[b],m=(b,A)=>A?b==="Jupiter"?[o(A,4),o(A,6),o(A,8)]:b==="Saturn"?[o(A,2),o(A,6),o(A,9)]:[]:[],s=(b,A)=>!!(b&&A&&b===A),f=(b,A,W)=>!A||!W?!1:m(b,A).includes(W),h=r.planets?.Ascendant?.rashi,v=r.planets?.Moon?.rashi,p=n.planets?.Jupiter?.rashi,x=n.planets?.Saturn?.rashi;if(!h||!v||!p||!x)return t.jsx("div",{style:{color:"#7f8c8d",fontStyle:"italic",marginTop:"20px"},children:"Data not available for Double Transit analysis."});const d=o(h,6),y=g(d),j=r.planets[y]?.rashi,S=g(h),l=r.planets[S]?.rashi,R=o(h,1),$=o(h,10),N=g(R),_=g($),T=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].filter(b=>r.planets[b]?.rashi===d),V=[{label:a("dt_pos_7","Posited in 7th House"),guru:s(p,d),shani:s(x,d)},{label:a("dt_asp_7","Aspecting 7th House"),guru:f("Jupiter",p,d),shani:f("Saturn",x,d)},{label:a("dt_conj_7_lord","Conjunction with 7th Lord"),guru:s(p,j),shani:s(x,j)},{label:a("dt_asp_7_lord","Aspecting 7th Lord"),guru:f("Jupiter",p,j),shani:f("Saturn",x,j)},{label:a("dt_pos_lagna","Posited in Lagna"),guru:s(p,h),shani:s(x,h)},{label:a("dt_asp_lagna","Aspecting Lagna"),guru:f("Jupiter",p,h),shani:f("Saturn",x,h)},{label:a("dt_conj_lagna_lord","Conjoined with Lagna Lord"),guru:s(p,l),shani:s(x,l)},{label:a("dt_asp_lagna_lord","Aspecting Lagna Lord"),guru:f("Jupiter",p,l),shani:f("Saturn",x,l)},{label:a("dt_pos_moon","Posited in Janma Rashi"),guru:s(p,v),shani:s(x,v)},{label:a("dt_asp_moon","Aspecting Janma Rashi"),guru:f("Jupiter",p,v),shani:f("Saturn",x,v)}],J=wt(r.dashas||[]),c=new Date(`${e}T12:00:00Z`),P=b=>new Date(`${b}T00:00:00Z`);let z=null,i=null,u=null;for(let b of J)if(c>=P(b.start)&&c<P(b.end)){z=b.planet;for(let A of b.antardashas)if(c>=P(A.start)&&c<P(A.end)){i=A.planet;for(let W of A.pratyantaraDashas)if(c>=P(W.start)&&c<P(W.end)){u=W.planet;break}break}break}const w=(b,A)=>!!(b&&A&&b.includes(A)),B=[{label:a("ds_7_lord","7th Lord Dasha"),planets:[y]},{label:a("ds_7_house","Planets in Natal 7th House Dasha"),planets:T},{label:a("ds_venus","Venus (Shukra) Dasha"),planets:["Venus"]},{label:a("ds_2_lord","2nd Lord Dasha"),planets:[N]},{label:a("ds_11_lord","11th Lord Dasha"),planets:[_]}];return t.jsxs("details",{open:!0,className:"zone-card",children:[t.jsx("summary",{children:t.jsx("span",{children:a("double_transit_title","💞 Double Transit (Marriage Yoga Analysis)")})}),t.jsxs("div",{style:{padding:"20px"},children:[t.jsx("h3",{style:{color:"#2c3e50",marginTop:0,marginBottom:"15px",textAlign:"center"},children:a("transit_activation_title","Transit Activation for Marriage")}),t.jsx("div",{style:{overflowX:"auto"},children:t.jsxs("table",{className:"double-transit-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:a("parameter","Parameter")}),t.jsx("th",{className:"center-col",children:a("guru","Guru")}),t.jsx("th",{className:"center-col",children:a("shani","Shani")})]})}),t.jsx("tbody",{children:V.map((b,A)=>t.jsxs("tr",{children:[t.jsx("td",{children:b.label}),t.jsx("td",{className:"center-col",children:b.guru?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[a("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:b.shani?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[a("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})})]},A))})]})}),t.jsx("h3",{style:{color:"#2c3e50",marginTop:0,marginBottom:"15px",textAlign:"center"},children:a("dasha_support_title","Dasha Support for Marriage")}),t.jsxs("div",{style:{background:"#f9f0ff",padding:"12px 15px",borderLeft:"5px solid #8e44ad",borderRadius:"8px",marginBottom:"15px",fontSize:"15px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",textAlign:"center"},children:[t.jsx("span",{style:{color:"#7f8c8d"},children:a("current_dasha_on","Current Dasha (on {0}):").replace("{0}",e)}),t.jsx("br",{}),t.jsx("span",{style:{color:"#c0392b",fontWeight:"bold"},children:z?a(z):"-"})," ","(MD) →"," ",t.jsx("span",{style:{color:"#d35400",fontWeight:"bold"},children:i?a(i):"-"})," ","(AD) →"," ",t.jsx("span",{style:{color:"#e67e22",fontWeight:"bold"},children:u?a(u):"-"})," ","(PD)"]}),t.jsx("div",{style:{overflowX:"auto"},children:t.jsxs("table",{className:"double-transit-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:a("dasha_parameter","Dasha Parameter")}),t.jsx("th",{className:"center-col",children:a("maha","Maha")}),t.jsx("th",{className:"center-col",children:a("antar","Antar")}),t.jsx("th",{className:"center-col",children:a("praty","Praty")})]})}),t.jsx("tbody",{children:B.map((b,A)=>t.jsxs("tr",{children:[t.jsxs("td",{children:[b.label,b.planets&&b.planets.length>0&&t.jsxs("span",{style:{fontSize:"12px",color:"#8e44ad",fontWeight:"bold"},children:[" ","(",b.planets.map(W=>a(W)).join(", "),")"]})]}),t.jsx("td",{className:"center-col",children:w(b.planets,z)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[a("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:w(b.planets,i)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[a("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})}),t.jsx("td",{className:"center-col",children:w(b.planets,u)?t.jsxs("span",{style:{color:"#27ae60",fontWeight:"bold"},children:[a("yes","Yes")," ✓"]}):t.jsx("span",{style:{color:"#ccc"},children:"-"})})]},A))})]})})]})]})}function mt(){const r=new Date,n=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),a=String(r.getDate()).padStart(2,"0");return`${n}-${e}-${a}`}function ft(){const r=new Date,n=String(r.getHours()).padStart(2,"0"),e=String(r.getMinutes()).padStart(2,"0");return`${n}:${e}`}function gt(r={},n){const e={Makha:"Magha",Garija:"Gara",Garaja:"Gara"},a=m=>m?String(m).replace(/S[-.]\s*/gi,"Shukla ").replace(/K[-.]\s*/gi,"Krishna ").split(" ").map(s=>n(e[s]||s)).join(" "):null,o=m=>m?n(e[m]||m):null,g=[a(r.tithi),o(r.vara),o(r.moon_nakshatra),o(r.yoga),o(r.karana)].filter(Boolean);return g.length?g.join(" · "):n("panchangaDetailsWait","Panchanga details will appear here after calculation.")}function Ft(r,n,e,a,o){const m={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"},s={};for(const[p,x]of Object.entries(r)){const d=n?n[p]?.rashi??x.rashi:x.rashi;s[p]={rashi:d,retrograde:x.retrograde,combust:x.combust}}const f=s.Ascendant?.rashi??1;let h=`<svg width="280px" height="280px" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff;">
    <rect width="280" height="280" fill="white" stroke="#8e44ad" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="280" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="280" x2="280" y2="0" stroke="#ccc" stroke-width="1"/>
    <line x1="${280/2}" y1="0" x2="0" y2="${280/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="${280/2}" x2="${280/2}" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="${280/2}" y1="280" x2="280" y2="${280/2}" stroke="#ccc" stroke-width="1"/>
    <line x1="280" y1="${280/2}" x2="${280/2}" y2="0" stroke="#ccc" stroke-width="1"/>`;const v={1:{rashi:{x:140,y:30},planets:{x:140,y:80}},2:{rashi:{x:70,y:22},planets:{x:70,y:48}},3:{rashi:{x:22,y:70},planets:{x:48,y:70}},4:{rashi:{x:30,y:140},planets:{x:80,y:140}},5:{rashi:{x:22,y:210},planets:{x:48,y:210}},6:{rashi:{x:70,y:258},planets:{x:70,y:232}},7:{rashi:{x:140,y:250},planets:{x:140,y:200}},8:{rashi:{x:210,y:258},planets:{x:210,y:232}},9:{rashi:{x:258,y:210},planets:{x:232,y:210}},10:{rashi:{x:250,y:140},planets:{x:200,y:140}},11:{rashi:{x:258,y:70},planets:{x:232,y:70}},12:{rashi:{x:210,y:22},planets:{x:210,y:48}}};for(let p=1;p<=12;p++){const x=(f+p-2)%12+1,d=v[p];h+=`<text x="${d.rashi.x}" y="${d.rashi.y}" font-size="10.5" font-weight="bold" fill="#7f8c8d" text-anchor="middle" dominant-baseline="middle">${x}</text>`;const y=Object.entries(s).filter(([j,S])=>S.rashi===x).map(([j,S])=>({name:j,label:m[j]||j,retrograde:S.retrograde,combust:S.combust}));if(y.length>0){const j=[];for(let l=0;l<y.length;l+=3)j.push(y.slice(l,l+3));j.forEach((l,R)=>{let $=d.planets.y;j.length===2?$=d.planets.y-5+R*10:j.length===3?$=d.planets.y-10+R*10:j.length>3&&($=d.planets.y-15+R*10),l.forEach((N,_)=>{const L=N.retrograde?"#2980b9":N.combust?"#c0392b":"#2c3e50",T=o(N.label);let V=d.planets.x;l.length===2?V=_===0?d.planets.x-12:d.planets.x+12:l.length===3&&(V=_===0?d.planets.x-18:_===1?d.planets.x:d.planets.x+18),h+=`<text x="${V}" y="${$}" font-size="10.5" font-weight="900" fill="${L}" text-anchor="middle" dominant-baseline="middle">${T}`,N.retrograde&&(h+="R"),N.combust&&(h+="c"),h+="</text>"})})}}return h+=`<rect x="95" y="102" width="90" height="36" rx="4" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="140" y="116" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${o(e)}</text>
  <text x="140" y="128" font-size="9" fill="#666" text-anchor="middle">${a}</text>`,h+="</svg>",h}function ut(r,n,e,a,o){if((localStorage.getItem("vaiswanara_chart_style")||"south")==="north")return Ft(r,n,e,a,o);const m=280,s=70,f=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]],h={};for(let d=1;d<=12;d++)h[d]=[];let v=r.Ascendant?.rashi??1;n&&n.Ascendant&&(v=n.Ascendant.rashi);for(const[d,y]of Object.entries(r)){const j=n?n[d]?.rashi??y.rashi:y.rashi;h[j]||(h[j]=[]),h[j].push(d)}let p=`<svg width="${m}px" height="${m}px" viewBox="0 0 ${m} ${m}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;">
    <rect width="${m}" height="${m}" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let d=0;d<=4;d++)p+=`<line x1="${d*s}" y1="0" x2="${d*s}" y2="${m}" stroke="#333" stroke-width="0.8"/>`,p+=`<line x1="0" y1="${d*s}" x2="${m}" y2="${d*s}" stroke="#333" stroke-width="0.8"/>`;p+=`<rect x="${s}" y="${s}" width="${2*s}" height="${2*s}" fill="#fdfcf8" stroke="#111" stroke-width="1.2"/>`,e&&(a?(p+=`<text x="${m/2}" y="${m/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${e}</text>`,p+=`<text x="${m/2}" y="${m/2+12}" font-size="12" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${a}</text>`):p+=`<text x="${m/2}" y="${m/2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${e}</text>`);const x={Sun:"Su",Moon:"Ch",Mars:"Ku",Mercury:"Bu",Jupiter:"Gu",Venus:"Sk",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke",Ascendant:"Lg"};for(let d=0;d<4;d++)for(let y=0;y<4;y++){const j=f[d][y];if(j===null)continue;const S=y*s,l=d*s,R=j===v;R&&(p+=`<rect x="${S+1}" y="${l+1}" width="${s-2}" height="${s-2}" fill="rgba(108, 92, 231, 0.1)"/>`),R&&(p+=`<text x="${S+3}" y="${l+s-4}" font-weight="bold" font-size="14" fill="#6c5ce7">${o("Lg")}</text>`);const $=h[j].filter(N=>N!=="Ascendant");if($.length>0){const _=[];for(let T=0;T<$.length;T+=2)_.push($.slice(T,T+2));const L=l+s/2-(_.length-1)*17/2+5;_.forEach((T,V)=>{const J=L+V*17;T.forEach((c,P)=>{const z=r[c]?.retrograde,i=r[c]?.combust,u=o(x[c]||c),w=z?"#d35400":i?"#8e44ad":"#2d3436",B=i||z?"bold":"normal";let b=S+s/2;T.length===2&&(b=P===0?S+s/2-16:S+s/2+16),p+=`<text x="${b}" y="${J}" font-size="14" font-weight="${B}" text-anchor="middle" fill="${w}">${u}</text>`,z&&(p+=`<text x="${b+10}" y="${J-5}" font-size="6.5" font-weight="bold" fill="#d35400">R</text>`),i&&(p+=`<text x="${b+10}" y="${J+6}" font-size="6.5" font-weight="bold" fill="#8e44ad">C</text>`)})})}}return p+="</svg>",p}function Kt(r,n,e,a,o=!1,g=1){let s=`<svg width="280px" height="280px" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif;background:#fff; width: 100%; height: auto;">
    <rect width="280" height="280" fill="white" stroke="#8e44ad" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="280" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="280" x2="280" y2="0" stroke="#ccc" stroke-width="1"/>
    <line x1="140" y1="0" x2="0" y2="140" stroke="#ccc" stroke-width="1"/>
    <line x1="0" y1="140" x2="140" y2="280" stroke="#ccc" stroke-width="1"/>
    <line x1="140" y1="280" x2="280" y2="140" stroke="#ccc" stroke-width="1"/>
    <line x1="280" y1="140" x2="140" y2="0" stroke="#ccc" stroke-width="1"/>`;const f={1:{rashi:{x:140,y:35},pts:{x:140,y:70}},2:{rashi:{x:70,y:22},pts:{x:70,y:55}},3:{rashi:{x:22,y:70},pts:{x:55,y:70}},4:{rashi:{x:35,y:140},pts:{x:70,y:140}},5:{rashi:{x:22,y:210},pts:{x:55,y:210}},6:{rashi:{x:70,y:258},pts:{x:70,y:225}},7:{rashi:{x:140,y:245},pts:{x:140,y:210}},8:{rashi:{x:210,y:258},pts:{x:210,y:225}},9:{rashi:{x:258,y:210},pts:{x:225,y:210}},10:{rashi:{x:245,y:140},pts:{x:210,y:140}},11:{rashi:{x:258,y:70},pts:{x:225,y:70}},12:{rashi:{x:210,y:22},pts:{x:210,y:55}}};for(let h=1;h<=12;h++){const v=(g+h-2)%12+1,p=f[h];s+=`<text x="${p.rashi.x}" y="${p.rashi.y}" font-size="9" font-weight="bold" fill="#7f8c8d" text-anchor="middle" dominant-baseline="middle">${v}</text>`;const x=o?r[v]?.points??0:r[v]??0;let d="#2d3436";o?x>=28?d="#27ae60":x<20&&(d="#c0392b"):x>=5?d="#27ae60":x<=2&&(d="#c0392b"),s+=`<text x="${p.pts.x}" y="${p.pts.y}" font-size="16" font-weight="bold" fill="${d}" text-anchor="middle" dominant-baseline="middle">${x}</text>`}return s+=`<rect x="95" y="102" width="90" height="36" rx="4" fill="#f9f0ff" stroke="#8e44ad" stroke-width="1"/>
  <text x="140" y="116" font-size="10" font-weight="bold" fill="#8e44ad" text-anchor="middle">${n}</text>
  <text x="140" y="128" font-size="9" fill="#666" text-anchor="middle">${e}</text>`,s+="</svg>",s}function F(r,n,e,a,o=!1,g=1){if(!r)return"";if((localStorage.getItem("vaiswanara_chart_style")||"south")==="north")return Kt(r,n,e,a,o,g);const s=280,f=70,h=[[12,1,2,3],[11,null,null,4],[10,null,null,5],[9,8,7,6]];let v=`<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:sans-serif; width: 100%; height: auto;">
    <rect width="${s}" height="${s}" fill="white" stroke="#111" stroke-width="1.5"/>`;for(let p=0;p<=4;p++)v+=`<line x1="${p*f}" y1="0" x2="${p*f}" y2="${s}" stroke="#333" stroke-width="0.8"/>`,v+=`<line x1="0" y1="${p*f}" x2="${s}" y2="${p*f}" stroke="#333" stroke-width="0.8"/>`;v+=`<rect x="${f}" y="${f}" width="${2*f}" height="${2*f}" fill="#f9f0ff" stroke="#111" stroke-width="1.2"/>`,v+=`<text x="${s/2}" y="${s/2-8}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#444">${n}</text>`,v+=`<text x="${s/2}" y="${s/2+12}" font-size="10" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#666">${e}</text>`;for(let p=0;p<4;p++)for(let x=0;x<4;x++){const d=h[p][x];if(d===null)continue;const y=x*f,j=p*f,S=o?r[d]?.points??0:r[d]??0;let l="#2d3436",R="bold";o?S>=28?l="#27ae60":S<20&&(l="#c0392b"):S>=5?l="#27ae60":S<=2&&(l="#c0392b"),v+=`<text x="${y+f/2}" y="${j+f/2+5}" font-size="20" font-weight="${R}" text-anchor="middle" fill="${l}">${S}</text>`}return v+="</svg>",v}function Xt({logoUrl:r,onNavigate:n}){const{t:e}=Y(),[a,o]=D.useState(()=>{const i=sessionStorage.getItem("vaiswanara_load_profile");if(i)try{const w=JSON.parse(i);if(w&&w.dob)return{name:w.name||"",dob:w.dob,tob:w.tob||"12:00",city:w.city||"",latitude:w.latitude||"",longitude:w.longitude||"",timezone:w.timezone||"5.5",gender:w.gender||"male"}}catch(w){console.error("Failed to parse loaded profile",w)}const u=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");return{name:"",dob:mt(),tob:ft(),city:u?.city||"Bengaluru, India",latitude:u?.latitude||"12.9716",longitude:u?.longitude||"77.5946",timezone:u?.timezone||"5.5",gender:"male"}}),[g,m]=D.useState(!1),[s,f]=D.useState(a),[h,v]=D.useState({}),[p,x]=D.useState("input"),[d,y]=D.useState(""),[j,S]=D.useState("natal"),[l,R]=D.useState(null),[$,N]=D.useState({loading:!1,error:""}),_=D.useRef({}),L=async(i="download")=>{if(l){N({loading:!0,error:""});try{window.html2canvas||await new Promise((M,k)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",C.onload=M,C.onerror=()=>k(new Error("Failed to load html2canvas")),document.head.appendChild(C)}),window.jspdf||await new Promise((M,k)=>{const C=document.createElement("script");C.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",C.onload=M,C.onerror=()=>k(new Error("Failed to load jspdf")),document.head.appendChild(C)});const u=ut(l.planets,null,e("Rasi Chakra"),"(D1)",e),w=ut(l.planets,l.navamsa_d9,e("Navamsha"),"(D9)",e),B=Object.entries(l.planets).filter(([,M])=>M&&M.rashi).map(([M,k])=>{const C=k.retrograde?' <span style="color:#d35400; font-weight:bold;">R</span>':"",O=k.combust?' <span style="color:#8e44ad; font-weight:bold;">C</span>':"";return`
            <tr style="border-bottom: 1px solid #dfe6e9;">
              <td style="padding: 5px 8px; text-align: left; font-weight: bold; color: #2d3436;">${e(M)}${C}${O}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${yt(k.degree)}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${k.nakshatra?e(k.nakshatra):"-"}</td>
              <td style="padding: 5px 8px; text-align: center; color: #2d3436;">${k.pada||"-"}</td>
            </tr>
          `}).join(""),b=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"],A=l.shadabala?b.map(M=>{if(!l.shadabala[M])return"";const k=l.shadabala[M];return`
          <tr style="border-bottom: 1px solid #dfe6e9;">
            <td style="padding: 6px 10px; font-weight: bold; color: #2d3436;">${e(M)}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.sthana_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.dig_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.kala_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.chesta_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.naisargika_bala}</td>
            <td style="padding: 6px 10px; color: #2d3436; text-align: center;">${k.drig_bala}</td>
            <td style="padding: 6px 10px; font-weight: bold; color: #8e44ad; text-align: center;">${k.total_rupas}</td>
          </tr>
        `}).join(""):"";let W="";l.dashas&&(W=`
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            ${l.dashas.map(k=>{const C=k.planet||k.lord||k.name||"-",O=k.end||k.end_date||"-",E=(k.antardashas||[]).map((H,I,at)=>{const nt=H.planet||H.lord||H.name||"-",rt=H.end||H.end_date||"-";return`
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: ${I===at.length-1?"none":"1px dashed #f1f2f6"};">
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
                ${E}
              </div>
            </div>
          `}).join("")}
          </div>
        `);let X="";if(l.ashtakavarga){const M=l.ashtakavarga.sarvashtakavarga||{},k=l.ashtakavarga.prastarashtakavarga||{},C=l.planets?.Ascendant?.rashi??1,O=F(M,"SAV",e("sarvashtakavarga","(Sarvashtakavarga)"),e,!0,C),E=F(k.Sun||{},"Su BAV",e("Sun"),e,!1,C),H=F(k.Moon||{},"Ch BAV",e("Moon"),e,!1,C),I=F(k.Mars||{},"Ku BAV",e("Mars"),e,!1,C),at=F(k.Mercury||{},"Bu BAV",e("Mercury"),e,!1,C),nt=F(k.Jupiter||{},"Gu BAV",e("Jupiter"),e,!1,C),rt=F(k.Venus||{},"Sk BAV",e("Venus"),e,!1,C),ct=F(k.Saturn||{},"Sa BAV",e("Saturn"),e,!1,C);X=`
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;">
            <div>${O}</div>
            <div>${E}</div>
            <div>${H}</div>
            <div>${I}</div>
            <div>${at}</div>
            <div>${nt}</div>
            <div>${rt}</div>
            <div>${ct}</div>
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
          ${r?`<img src="${r}" alt="Logo" style="height: 50px; margin-bottom: 5px;">`:""}
          <h1 style="font-size: 18pt;">${e("personalHoroscope","Personal Horoscope")}</h1>
          <h2 style="font-size: 13pt; margin: 2px 0;">${e("natalChart","Natal Chart")}</h2>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px; font-size: 12pt; color: #2d3436;">
          <div style="font-weight: bold; margin-bottom: 6px;">
            ${a.dob?a.dob.split("-").reverse().join("-"):"-"} &nbsp;&nbsp;&nbsp; ${a.tob} &nbsp;&nbsp;&nbsp; ${a.city?a.city.split(",")[0].trim():"-"}
          </div>
          <div style="font-size: 11pt; color: #34495e;">
            ${gt(l.panchanga,e)}
          </div>
          ${l.meta?.ayanamsha_name?`<div style="font-size: 10pt; color: #7f8c8d; margin-top: 5px;"><strong>Ayanamsha:</strong> ${l.meta.ayanamsha_name} (${l.meta.ayanamsha}°)</div>`:""}
        </div>
        
        <div class="charts-row" style="margin-bottom: 25px; gap: 20px;">
          <div class="chart-col">${u}</div>
          <div class="chart-col">${w}</div>
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
            ${B}
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
        
        ${W}
        
        <div class="footer">
          <span>${e("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${e("Page","Page")} 2</span>
        </div>
      </div>

      <!-- PAGE 3: PLANETARY STRENGTH & ASHTAKAVARGA -->
      <div class="pdf-page">
        <h2 style="color:#2d3436; border-bottom:1.5px solid #2d3436; padding-bottom:5px; margin-bottom:15px; font-size:12pt; text-transform:uppercase; text-align: center;">${e("planetaryStrengthAndAshtakavarga","Planetary Strength & Ashtakavarga")}</h2>
        
        ${l.shadabala?`
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
            ${A}
          </tbody>
        </table>
        `:""}

        ${l.ashtakavarga?`
        <h3 style="color:#2d3436; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 15px 0; text-align: center;">${e("ashtakavarga","Ashtakavarga Charts")}</h3>
        ${X}
        `:""}

        <div class="footer">
          <span>${e("generatedBy","e-Jyotisha")}</span>
          <span style="font-size: 7.5pt; font-weight: normal; color: #b2bec3;">This application is purely for Educational Purposes Only — Not for Commercial Use.</span>
          <span>${e("Page","Page")} 3</span>
        </div>
      </div>

      </div>`,et=window.scrollY;window.scrollTo(0,0);const G=document.createElement("div");G.innerHTML=Z,G.style.position="absolute",G.style.top="0",G.style.left="0",G.style.width="794px",document.body.appendChild(G);try{await new Promise(E=>setTimeout(E,600));const M=G.querySelectorAll(".pdf-page"),k=new window.jspdf.jsPDF({orientation:"portrait",unit:"mm",format:"a4"});for(let E=0;E<M.length;E++){const H=await window.html2canvas(M[E],{scale:2,useCORS:!0,scrollY:0,scrollX:0,windowWidth:794,width:794,height:1122});E>0&&k.addPage();const I=H.toDataURL("image/jpeg",.98);k.addImage(I,"JPEG",0,0,210,297)}const O=`${(a.name||"Horoscope").replace(/[^a-zA-Z0-9_.-]/g,"")}_Horoscope.pdf`;if(i==="share"&&navigator.canShare){const E=k.output("blob"),H=new File([E],O,{type:"application/pdf"});if(navigator.canShare({files:[H]}))try{await navigator.share({title:"Personal Horoscope",text:`Here is the Personal Horoscope report for ${a.name||"myself"} generated via e-Jyotisha.`,files:[H]})}catch(I){I.name!=="AbortError"&&k.save(O)}else alert(e("shareNotSupported","Share feature is not supported on your browser. Downloading instead...")),k.save(O)}else k.save(O)}finally{document.body.removeChild(G),window.scrollTo(0,et)}N({loading:!1,error:""})}catch(u){console.error("PDF Error:",u),N({loading:!1,error:"Failed to generate PDF."})}}},T=async i=>{const u=JSON.stringify(i);if(_.current[u]){R(_.current[u]);return}N({loading:!0,error:""});try{const w=await bt(i);w?.planets&&(w.planets.Rahu&&(w.planets.Rahu.retrograde=!1),w.planets.Ketu&&(w.planets.Ketu.retrograde=!1)),["navamsa_d9","d2","d3","d4","d7","d10","d12","d16","d20","d24","d27","d30","d60"].forEach(b=>{w?.[b]&&(w[b].Rahu&&(w[b].Rahu.retrograde=!1),w[b].Ketu&&(w[b].Ketu.retrograde=!1))}),_.current[u]=w,R(w),N({loading:!1,error:""})}catch(w){N({loading:!1,error:w.message})}};D.useEffect(()=>{T(a)},[]);const V=()=>{const i=JSON.parse(localStorage.getItem("vaiswanara_profiles")||"{}");v(i),f(a),x("input"),y(""),m(!0)},J=i=>{const u=h[i];u&&(f({...s,name:i,dob:u.dob,tob:u.tob,city:u.city,latitude:u.latitude,longitude:u.longitude,timezone:u.timezone,gender:u.gender||"male"}),x("input"))},c=()=>{o(s),m(!1),T(s)},P=()=>{sessionStorage.removeItem("vaiswanara_load_profile");const i=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null");f({name:"",dob:mt(),tob:ft(),city:i?.city||"Bengaluru, India",latitude:i?.latitude||"12.9716",longitude:i?.longitude||"77.5946",timezone:i?.timezone||"5.5",gender:"male"}),x("input")},z=()=>{const i=s.name?.trim();if(!i){alert("Please enter a Name to save this profile.");return}const u={...h},{...w}=s;u[i]=w,localStorage.setItem("vaiswanara_profiles",JSON.stringify(u)),v(u),alert(`Profile "${i}" saved successfully!`)};return t.jsxs("main",{className:"new-horo-page",style:{background:"transparent",minHeight:"100vh"},children:[t.jsx("style",{children:`
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
      `}),t.jsxs("div",{className:"top-bar-card",children:[t.jsxs("div",{className:"top-bar-details",onClick:V,children:[t.jsxs("div",{style:{fontSize:"15px",fontWeight:"bold",color:"#2c3e50",display:"flex",flexDirection:"column",gap:"2px"},children:[t.jsxs("span",{children:["📅 ",a.dob?a.dob.split("-").reverse().join("-"):""]}),t.jsxs("span",{children:["⏰ ",a.tob]})]}),t.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%",marginTop:"3px"},children:["📍 ",a.city]})]}),l&&!$.loading&&t.jsx("div",{className:"view-toggle-container",onClick:i=>i.stopPropagation(),style:{margin:0,width:"auto"},children:t.jsxs("div",{className:"view-toggle",children:[t.jsx("button",{className:`view-toggle-btn ${j==="natal"?"active":""}`,onClick:()=>S("natal"),children:e("Natal","Natal")}),t.jsx("button",{className:`view-toggle-btn ${j==="transit"?"active":""}`,onClick:()=>S("transit"),children:e("Transit","Transit")})]})})]}),t.jsx("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"-8px",marginBottom:"12px"},children:"ℹ️ Click on the card above to change date, time, or location details."}),t.jsxs("section",{className:"workspace",style:{display:"flex",flexDirection:"column",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[$.error&&t.jsx("div",{className:"message error",style:{background:"#fdedec",color:"#c0392b",padding:"15px",borderRadius:"12px",border:"1px solid #f5b7b1",textAlign:"center"},children:$.error}),$.loading&&t.jsxs("div",{className:"message",style:{background:"#ffffff",color:"#2c3e50",padding:"20px",borderRadius:"14px",boxShadow:"0 4px 15px rgba(0,0,0,0.03)",textAlign:"center",border:"1px solid #eaecee",margin:"0 15px"},children:["⏳ ",e("processingWait","Processing...")]}),l&&!$.loading&&t.jsxs(t.Fragment,{children:[j==="natal"&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"charts-table-row",children:[t.jsx(St,{planets:l.planets,navamsa:l.navamsa_d9,d2:l.d2,d3:l.d3,d4:l.d4,d7:l.d7,d10:l.d10,d12:l.d12,d16:l.d16,d20:l.d20,d24:l.d24,d27:l.d27,d30:l.d30,d60:l.d60,d1Footer:t.jsxs("div",{style:{textAlign:"center",fontSize:"12px",color:"#7f8c8d",marginTop:"10px"},children:[t.jsx("strong",{children:"Ayanamsha:"})," ",l?.meta?.ayanamsha_name?`${l.meta.ayanamsha_name} (${l.meta.ayanamsha}°)`:(()=>{const i=JSON.parse(localStorage.getItem("eclock_prefs")||"{}");return{lahiri:"Lahiri (Chitra Paksha)",raman:"Raman",krishnamurti:"Krishnamurti (KP)",yukteshwar:"Sri Yukteshwar",true_citra:"True Citra",fagan_bradley:"Fagan/Bradley",custom:`Custom (${i.ayanamsha_val}°)`}[i.ayanamsha_type||"lahiri"]||"Lahiri"})()]}),d9Footer:t.jsxs("div",{className:"export-panel",children:[t.jsxs("button",{className:"btn-pdf",onClick:()=>L("download"),title:e("downloadPdf","Download PDF Report"),children:[t.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[t.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),t.jsx("polyline",{points:"7 10 12 15 17 10"}),t.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),e("pdf","PDF")]}),t.jsxs("button",{className:"btn-share",onClick:()=>L("share"),title:e("sharePdf","Share PDF Report"),children:[t.jsxs("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",viewBox:"0 0 24 24",children:[t.jsx("circle",{cx:"18",cy:"5",r:"3"}),t.jsx("circle",{cx:"6",cy:"12",r:"3"}),t.jsx("circle",{cx:"18",cy:"19",r:"3"}),t.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),t.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),e("share","Share")]})]})}),t.jsx($t,{planets:l.planets,hideTitle:!0})]}),t.jsx(kt,{title:e("Panchanga","Panchanga"),text:gt(l.panchanga,e)}),t.jsx(zt,{dashas:l.dashas}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",width:"100%"},className:"shadbala-akv-row",children:[t.jsx(Pt,{shadabala:l.shadabala}),t.jsx(Wt,{ashtakavarga:l.ashtakavarga,lagnaRashi:l.planets?.Ascendant?.rashi??1})]})]}),j==="transit"&&t.jsx(Gt,{natalData:l,formData:a})]})]}),g&&t.jsx("div",{className:"popup-container",children:t.jsxs("div",{className:"popup-content",children:[t.jsxs("h3",{style:{marginTop:0,color:"#8e44ad",borderBottom:"2px solid #f1f2f6",paddingBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[t.jsx("span",{children:"✏️ Change Details"}),t.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[t.jsx("button",{type:"button",onClick:P,style:{background:"#ebf5fb",border:"1px solid #3498db",color:"#3498db",padding:"4px 10px",borderRadius:"15px",fontSize:"12px",fontWeight:"bold",cursor:"pointer",minHeight:"auto",lineHeight:"1"},children:e("new","New")}),t.jsx("span",{style:{cursor:"pointer",background:"#f8f9fa",padding:"4px 8px",borderRadius:"50%",fontSize:"14px"},onClick:()=>m(!1),children:"❌"})]})]}),t.jsxs("div",{style:{display:"flex",borderBottom:"1px solid #eaecee",marginBottom:"15px"},children:[t.jsx("button",{className:`popup-tab ${p==="input"?"active":""}`,onClick:()=>x("input"),children:"Manual Entry"}),t.jsx("button",{className:`popup-tab ${p==="profiles"?"active":""}`,onClick:()=>x("profiles"),children:"Saved Profiles"})]}),p==="input"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"15px"},children:[t.jsxs("div",{style:{display:"flex",gap:"15px"},children:[t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:2},children:["Name (to Save Profile):",t.jsx("input",{type:"text",value:s.name||"",onChange:i=>f({...s,name:i.target.value}),placeholder:"Enter name here...",style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe",width:"100%",boxSizing:"border-box"}})]}),t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Gender:",t.jsxs("select",{value:s.gender||"male",onChange:i=>f({...s,gender:i.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe",height:"41px",width:"100%",boxSizing:"border-box"},children:[t.jsx("option",{value:"male",children:"Male"}),t.jsx("option",{value:"female",children:"Female"})]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"15px"},children:[t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Date:",t.jsx("input",{type:"date",value:s.dob,onChange:i=>f({...s,dob:i.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]}),t.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:"6px",fontSize:"14px",fontWeight:"bold",color:"#2c3e50",flex:1},children:["Time:",t.jsx("input",{type:"time",value:s.tob,onChange:i=>f({...s,tob:i.target.value}),style:{padding:"10px",borderRadius:"8px",border:"1px solid #dcdde1",fontSize:"15px",outline:"none",background:"#fdfefe"},required:!0})]})]}),t.jsx(jt,{city:s.city,onLocationSelect:i=>f({...s,city:i.city,latitude:i.latitude,longitude:i.longitude,timezone:i.timezone})}),t.jsxs("details",{style:{marginTop:"-10px",fontSize:"14px",background:"#fdfefe",padding:"12px",borderRadius:"8px",border:"1px solid #eee"},children:[t.jsx("summary",{style:{cursor:"pointer",color:"#3498db",fontWeight:"bold",outline:"none",listStyle:"none"},children:"Manual Coordinates (Lat / Lon / Tz)"}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"10px"},children:[t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lat:",t.jsx("input",{type:"text",name:"latitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:s.latitude||"",onChange:i=>f({...s,latitude:i.target.value})})]}),t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Lon:",t.jsx("input",{type:"text",name:"longitude",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:s.longitude||"",onChange:i=>f({...s,longitude:i.target.value})})]}),t.jsxs("label",{style:{flex:1,fontSize:"0.85rem",color:"#636e72"},children:["Tz:",t.jsx("input",{type:"text",name:"timezone",style:{width:"100%",padding:"8px",marginTop:"4px",borderRadius:"6px",border:"1px solid #ccc",fontSize:"0.95rem",boxSizing:"border-box"},value:s.timezone||"",onChange:i=>f({...s,timezone:i.target.value})})]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"15px",marginTop:"10px"},children:[t.jsx("button",{onClick:z,style:{flex:1,background:"#27ae60",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(39, 174, 96, 0.2)"},title:"Save the current details as a new profile",children:"Save Profile"}),t.jsx("button",{onClick:c,style:{flex:1,background:"linear-gradient(135deg, #8e44ad, #9b59b6)",color:"#fff",padding:"14px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"16px",cursor:"pointer",boxShadow:"0 4px 10px rgba(142, 68, 173, 0.3)"},children:"Apply"})]})]}),p==="profiles"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[t.jsx("input",{type:"text",placeholder:e("searchProfiles","Search profiles..."),value:d,onChange:i=>y(i.target.value),style:{width:"100%",padding:"8px 12px",border:"1px solid #8e44ad",borderRadius:"8px",fontSize:"14px",outline:"none",background:"#fdfefe",boxSizing:"border-box"}}),t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"350px",overflowY:"auto",padding:"5px 0"},children:Object.keys(h).filter(i=>{const u=d.trim().toLowerCase();return u===""||i.toLowerCase().includes(u)||(h[i].city||"").toLowerCase().includes(u)}).length===0?t.jsx("p",{style:{textAlign:"center",color:"#7f8c8d",padding:"20px 0"},children:"No saved profiles found."}):Object.keys(h).filter(i=>{const u=d.trim().toLowerCase();return u===""||i.toLowerCase().includes(u)||(h[i].city||"").toLowerCase().includes(u)}).map(i=>t.jsxs("div",{className:"profile-card",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",textAlign:"left",width:"100%",boxSizing:"border-box"},children:[t.jsxs("div",{onClick:()=>J(i),style:{flex:1,cursor:"pointer",padding:"4px 0",textAlign:"left"},children:[t.jsx("strong",{style:{color:"#2c3e50",fontSize:"15px",display:"block",marginBottom:"4px",textAlign:"left"},children:i}),t.jsxs("div",{style:{fontSize:"13px",color:"#7f8c8d",display:"flex",flexDirection:"column",gap:"4px",textAlign:"left"},children:[t.jsxs("span",{children:["📅 ",h[i].dob?h[i].dob.split("-").reverse().join("-"):""]}),t.jsxs("span",{children:["⏰ ",h[i].tob||""]}),t.jsxs("span",{children:["📍 ",h[i].city?h[i].city.split(",")[0].trim():""]})]})]}),t.jsxs("div",{style:{display:"flex",gap:"8px"},children:[t.jsx("button",{onClick:u=>{u.stopPropagation(),J(i)},title:"Edit",style:{background:"#ebf5fb",border:"1px solid #3498db",color:"#3498db",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"✏️"}),t.jsx("button",{onClick:u=>{if(u.stopPropagation(),window.confirm(`Are you sure you want to delete the profile "${i}"?`)){const w={...h};delete w[i],v(w),localStorage.setItem("vaiswanara_profiles",JSON.stringify(w))}},title:"Delete",style:{background:"#fdedec",border:"1px solid #e74c3c",color:"#e74c3c",borderRadius:"50%",width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"auto",padding:0},children:"🗑️"})]})]},i))})]})]})})]})}export{Xt as HoroscopePageNew};
