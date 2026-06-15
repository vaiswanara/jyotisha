import{u as W,r as c,j as e}from"./vendor-DGJAU7LJ.js";import{L as D}from"./LocationAutocomplete-BUqDlnxv.js";import{A as V,a as B}from"./index-4QWafhvJ.js";const G={solar:{C1:"Partial eclipse begins. The Moon's edge first touches the Sun's disk.",C2:"Totality/Annularity begins. For total/annular eclipses, the Sun is fully covered (total) or forms a ring of fire (annular).",C3:"Totality/Annularity ends. The Sun begins to emerge from behind the Moon.",C4:"Partial eclipse ends. The Moon's disk completely leaves the Sun's disk.",Maximum:"The instant when the Moon covers the maximum area of the Sun's disk.",Sunrise:"The time when the Sun rises above the horizon at this location.",Sunset:"The time when the Sun sets below the horizon at this location."},lunar:{P1:"Penumbral eclipse begins. The Moon enters Earth's outer shadow (penumbra) and starts to dim.",U1:"Partial eclipse begins. The Moon enters Earth's inner shadow (umbra); a dark bite appears.",U2:"Totality begins. The Moon is completely inside the Earth's umbral shadow, turning blood-red.",U3:"Totality ends. The Moon starts to exit the Earth's umbral shadow.",U4:"Partial eclipse ends. The Moon is fully out of the Earth's umbra.",P4:"Penumbral eclipse ends. The Moon exits the Earth's penumbra, returning to normal brightness.",Maximum:"The instant when the Moon is closest to the center of the Earth's shadow.",Moonrise:"The time when the Moon rises above the horizon at this location.",Moonset:"The time when the Moon sets below the horizon at this location."}};function $({type:i,magnitude:o}){const r=i.toLowerCase().includes("total"),n=i.toLowerCase().includes("annular"),d=(1-Math.min(1,o))*80;return e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px",margin:"0 auto"},children:[e.jsxs("svg",{width:"120",height:"120",viewBox:"0 0 150 150",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sunGlowL",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"#fff8e7"}),e.jsx("stop",{offset:"60%",stopColor:"#ffd35c"}),e.jsx("stop",{offset:"90%",stopColor:"#ff9a00"}),e.jsx("stop",{offset:"100%",stopColor:"#ff4500"})]}),e.jsxs("radialGradient",{id:"coronaGlowL",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"55%",stopColor:"rgba(255,255,255,1)"}),e.jsx("stop",{offset:"70%",stopColor:"rgba(255,220,150,0.8)"}),e.jsx("stop",{offset:"85%",stopColor:"rgba(255,140,0,0.4)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(255,69,0,0)"})]})]}),r&&e.jsx("circle",{cx:"75",cy:"75",r:"65",fill:"url(#coronaGlowL)",style:{animation:"eclipsePulse 3s infinite ease-in-out"}}),e.jsx("circle",{cx:"75",cy:"75",r:"45",fill:"url(#sunGlowL)"}),r?e.jsx("circle",{cx:"75",cy:"75",r:"45.5",fill:"#3a3540"}):n?e.jsx("circle",{cx:"75",cy:"75",r:"40",fill:"#3a3540"}):e.jsx("circle",{cx:75+d,cy:"75",r:"45",fill:"#3a3540"})]}),e.jsx("style",{children:`
        @keyframes eclipsePulse {
          0% { transform: scale(0.97); opacity: 0.85; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(0.97); opacity: 0.85; }
        }
      `})]})}function _({type:i,magnitude:o}){const r=i.toLowerCase().includes("total"),n=i.toLowerCase().includes("partial"),d=i.toLowerCase().includes("penumb"),s=(1-Math.min(1,o))*80;return e.jsx("div",{style:{position:"relative",width:"120px",height:"120px",margin:"0 auto"},children:e.jsxs("svg",{width:"120",height:"120",viewBox:"0 0 150 150",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"moonBrightL",cx:"30%",cy:"30%",r:"70%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ffffff"}),e.jsx("stop",{offset:"70%",stopColor:"#e2e8f0"}),e.jsx("stop",{offset:"100%",stopColor:"#94a3b8"})]}),e.jsxs("radialGradient",{id:"bloodMoonL",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ff7c5c"}),e.jsx("stop",{offset:"70%",stopColor:"#b91c1c"}),e.jsx("stop",{offset:"100%",stopColor:"#450a0a"})]}),e.jsxs("radialGradient",{id:"earthUmbraL",cx:"50%",cy:"50%",r:"50%",children:[e.jsx("stop",{offset:"70%",stopColor:"rgba(30,10,10,0.95)"}),e.jsx("stop",{offset:"90%",stopColor:"rgba(75,10,10,0.75)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(0,0,0,0)"})]})]}),e.jsx("circle",{cx:"75",cy:"75",r:"45",fill:"url(#moonBrightL)"}),r&&e.jsx("circle",{cx:"75",cy:"75",r:"45",fill:"url(#bloodMoonL)",opacity:"0.9"}),r?e.jsx("circle",{cx:"75",cy:"75",r:"48",fill:"url(#earthUmbraL)",opacity:"0.85"}):n?e.jsxs(e.Fragment,{children:[e.jsx("circle",{cx:"75",cy:"75",r:"45",fill:"url(#bloodMoonL)",opacity:Math.min(1,o)*.8}),e.jsx("circle",{cx:75-s,cy:"75",r:"48",fill:"url(#earthUmbraL)",opacity:"0.9"})]}):d?e.jsx("circle",{cx:"75",cy:"75",r:"45",fill:"#000",opacity:Math.min(.35,o*.35)}):null,e.jsx("circle",{cx:"50",cy:"55",r:"6",fill:"#000",opacity:"0.08"}),e.jsx("circle",{cx:"95",cy:"65",r:"8",fill:"#000",opacity:"0.06"}),e.jsx("circle",{cx:"65",cy:"95",r:"10",fill:"#000",opacity:"0.07"}),e.jsx("circle",{cx:"80",cy:"45",r:"4",fill:"#000",opacity:"0.08"})]})})}function R({logoUrl:i,embedded:o=!1}){const{t:r}=W(),n=(a,t)=>{const l=a.toLowerCase().replace(/[^a-z0-9]/g,"");return l==="partial"&&t==="solar"?r("PartialSolarEclipse","Partial Solar Eclipse"):l==="total"&&t==="solar"?r("TotalSolarEclipse","Total Solar Eclipse"):l==="annular"&&t==="solar"?r("AnnularSolarEclipse","Annular Solar Eclipse"):{partiallunareclipse:r("PartialLunarEclipse","Partial Lunar Eclipse"),penumblunareclipse:r("PenumbralLunarEclipse","Penumbral Lunar Eclipse"),totallunareclipse:r("TotalLunarEclipse","Total Lunar Eclipse"),totalannular:r("TotalAnnularSolarEclipse","Total/Annular Solar Eclipse"),annulartotal:r("AnnularTotalSolarEclipse","Annular/Total Solar Eclipse"),noncentral:r("NonCentralSolarEclipse","Non-Central Solar Eclipse")}[l]||a},d=a=>{const t=a.trim();return t.startsWith("P1")?r("P1Label","P1 (Penumbral Begins)"):t.startsWith("U1")?r("U1Label","U1 (Partial Begins)"):t.startsWith("U2")?r("U2Label","U2 (Totality Begins)"):t.startsWith("U3")?r("U3Label","U3 (Totality Ends)"):t.startsWith("U4")?r("U4Label","U4 (Partial Ends)"):t.startsWith("P4")?r("P4Label","P4 (Penumbral Ends)"):t.startsWith("C1")?r("C1Label","C1 (Partial Begins)"):t.startsWith("C2")?r("C2Label","C2 (Totality Begins)"):t.startsWith("C3")?r("C3Label","C3 (Totality Ends)"):t.startsWith("C4")?r("C4Label","C4 (Partial Ends)"):t==="Maximum"?r("MaximumLabel","Maximum"):t==="Moonrise"?r("MoonriseLabel","Moonrise"):t==="Moonset"?r("MoonsetLabel","Moonset"):t==="Sunrise"?r("SunriseLabel","Sunrise"):t==="Sunset"?r("SunsetLabel","Sunset"):a},[s,h]=c.useState(()=>{const a=JSON.parse(localStorage.getItem("vaiswanara_default_location")||"null"),t=new Date,l=g=>String(g).padStart(2,"0");return{date:`${t.getFullYear()}-${l(t.getMonth()+1)}-${l(t.getDate())}`,city:a?.city||"Bengaluru, Karnataka",latitude:a?.latitude||12.9716,longitude:a?.longitude||77.5946,timezone:a?.timezone||5.5,count:6}}),[x,L]=c.useState("all"),[E,b]=c.useState(!1),[m,S]=c.useState(null),[y,j]=c.useState(null),T=a=>{h(t=>({...t,city:a.city,latitude:a.latitude,longitude:a.longitude,timezone:a.timezone}))},C=async()=>{b(!0),j(null);try{const a=new URLSearchParams({endpoint:"eclipses",latitude:s.latitude,longitude:s.longitude,timezone:s.timezone,date:s.date,count:s.count,_t:Date.now()}),l=await(await fetch(`${V}?${a.toString()}`,{headers:{Accept:"application/json","x-api-token":B}})).json();if(l.error)throw new Error(l.error);S(l)}catch(a){console.error(a),j(a.message||"Failed to load eclipse calculations.")}finally{b(!1)}};c.useEffect(()=>{C()},[s.latitude,s.longitude,s.date,s.count]);const w=()=>m?x==="solar"?m.solar||[]:x==="lunar"?m.lunar||[]:m.all||[]:[],N=["Moonrise","Moonset","Sunrise","Sunset"],k=a=>a.contactTimes.some(t=>t.localTime!=="-"&&!N.some(l=>t.label.startsWith(l))),z=[{id:"all",label:r("AllEclipses","All Eclipses")},{id:"solar",label:r("SolarEclipsesOnly","Solar Eclipses")},{id:"lunar",label:r("LunarEclipsesOnly","Lunar Eclipses")}];return e.jsxs("main",{className:"eclipse-page",style:{minHeight:"100vh",background:"transparent"},children:[e.jsx("style",{children:`
        .eclipse-page {
          padding: 0;
          margin: 0;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Page Header ────────────────────────────── */
        .ecl-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(122, 83, 48, 0.14);
          background: rgba(255, 253, 248, 0.9);
        }
        .ecl-header-logo {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .ecl-header-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.1rem, 2.4vw, 1.6rem);
          font-weight: 700;
          color: #2d2419;
          margin: 0 0 0.2rem;
        }
        .ecl-header-sub {
          font-size: 0.82rem;
          color: #6b6255;
          margin: 0;
        }
        .ecl-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a3b24;
          margin: 0 0 0.3rem;
        }

        /* ── Workspace ──────────────────────────────── */
        .ecl-workspace {
          padding: 1.25rem 1.5rem;
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        /* When inside PanchangaPage tab — use full width, no outer limit */
        .ecl-workspace.ecl-embedded {
          max-width: 100%;
          padding: 0.85rem 0.5rem;
        }

        /* ── Controls panel ─────────────────────────── */
        .ecl-controls {
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(122, 83, 48, 0.16);
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(63, 43, 24, 0.07);
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .ecl-controls-row {
          display: grid;
          grid-template-columns: 1fr 180px 160px;
          gap: 1rem;
          align-items: end;
        }
        /* Place field: let LocationAutocomplete fill its column */
        .ecl-field-place {
          display: flex;
          flex-direction: column;
        }
        /* On tablet / mobile, stack into two columns then one */
        @media (max-width: 700px) {
          .ecl-controls-row {
            grid-template-columns: 1fr 1fr;
          }
          .ecl-field-place {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 440px) {
          .ecl-controls-row {
            grid-template-columns: 1fr;
          }
        }
        .ecl-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .ecl-field label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #51483d;
        }
        .ecl-meta-row {
          font-size: 0.78rem;
          color: #857869;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 0.25rem;
        }

        /* ── Tab bar ────────────────────────────────── */
        .ecl-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid rgba(138, 59, 36, 0.12);
          padding-bottom: 0;
        }
        .ecl-tab {
          padding: 0.5rem 1.1rem;
          border-radius: 8px 8px 0 0;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          background: transparent;
          color: #857869;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          min-height: auto;
          width: auto;
        }
        .ecl-tab.active {
          background: rgba(138, 59, 36, 0.08);
          color: #8a3b24;
          border-bottom: 2px solid #8a3b24;
        }
        .ecl-tab:hover:not(.active) {
          background: rgba(138, 59, 36, 0.05);
          color: #6b4030;
        }

        /* ── Cards grid ─────────────────────────────── */
        .ecl-grid {
          display: grid;
          /* 3 columns on desktop, shrinks on smaller screens */
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
        }
        @media (max-width: 1100px) {
          .ecl-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .ecl-grid { grid-template-columns: 1fr; }
        }

        /* ── Individual card ────────────────────────── */
        .ecl-card {
          background: rgba(255, 253, 248, 0.92);
          border: 1px solid rgba(122, 83, 48, 0.16);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(63, 43, 24, 0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ecl-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(63, 43, 24, 0.12);
        }
        .ecl-card-stripe {
          height: 4px;
          flex-shrink: 0;
        }
        .ecl-card-body {
          padding: 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1;
        }

        /* ── Card top row: info + badge ─────────────── */
        .ecl-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ecl-card-type-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 0.25rem;
        }
        .ecl-card-name {
          font-size: 1rem;
          font-weight: 700;
          color: #2d2419;
          margin: 0 0 0.2rem;
        }
        .ecl-card-saros {
          font-size: 0.75rem;
          color: #857869;
        }
        .ecl-card-date {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2d2419;
          text-align: right;
          white-space: nowrap;
        }

        /* ── Visibility badge ───────────────────────── */
        .ecl-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.28rem 0.65rem;
          border-radius: 20px;
          margin-top: 0.3rem;
          white-space: nowrap;
        }
        .ecl-badge.visible {
          background: rgba(47, 125, 66, 0.12);
          color: #2f7d42;
          border: 1px solid rgba(47, 125, 66, 0.28);
        }
        .ecl-badge.not-visible {
          background: rgba(122, 83, 48, 0.1);
          color: #857869;
          border: 1px solid rgba(122, 83, 48, 0.2);
        }

        /* ── SVG visualizer box ─────────────────────── */
        .ecl-visual-box {
          background: rgba(247, 242, 232, 0.7);
          border: 1px solid rgba(122, 83, 48, 0.12);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ecl-visual-type-text {
          font-size: 0.8rem;
          color: #6b6255;
          font-weight: 600;
          text-align: center;
        }

        /* ── Timeline section ───────────────────────── */
        .ecl-timeline-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #8a3b24;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.5rem;
        }
        .ecl-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .ecl-timeline-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          padding: 0.4rem 0.6rem;
          background: rgba(247, 242, 232, 0.5);
          border-radius: 6px;
          border: 1px solid rgba(122, 83, 48, 0.08);
          cursor: help;
          transition: background 0.12s ease;
        }
        .ecl-timeline-row:hover {
          background: rgba(138, 59, 36, 0.06);
        }
        .ecl-timeline-phase {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #51483d;
          font-weight: 600;
        }
        .ecl-phase-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ecl-timeline-time {
          font-weight: 700;
          color: #2d2419;
          white-space: nowrap;
        }
        .ecl-timeline-time.dim {
          color: #b0a090;
          font-weight: 600;
        }

        /* ── Notice boxes ───────────────────────────── */
        .ecl-notice {
          font-size: 0.76rem;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          line-height: 1.45;
        }
        .ecl-notice.warning {
          background: #fff7df;
          border: 1px solid #ead79e;
          color: #5f4a19;
        }
        .ecl-notice.success {
          background: rgba(47, 125, 66, 0.07);
          border: 1px solid rgba(47, 125, 66, 0.2);
          color: #2f5e38;
        }

        /* ── Loading ────────────────────────────────── */
        .ecl-loading {
          text-align: center;
          padding: 3rem 1rem;
          color: #8a3b24;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .ecl-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(138, 59, 36, 0.15);
          border-top-color: #8a3b24;
          border-radius: 50%;
          animation: eclSpin 0.9s infinite linear;
        }
        @keyframes eclSpin { to { transform: rotate(360deg); } }

        /* ── Error ──────────────────────────────────── */
        .ecl-error {
          background: #fff0ed;
          border: 1px solid #edb7ab;
          color: #8a2f21;
          border-radius: 10px;
          padding: 0.9rem 1.1rem;
          font-size: 0.88rem;
        }

        /* ── Empty state ────────────────────────────── */
        .ecl-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2.5rem;
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(122, 83, 48, 0.14);
          border-radius: 10px;
          color: #857869;
          font-size: 0.9rem;
        }

        /* ── Mobile ─────────────────────────────────── */
        @media (max-width: 860px) {
          .ecl-workspace {
            padding: 0.85rem;
            padding-bottom: calc(5.5rem + env(safe-area-inset-bottom));
          }
          .ecl-workspace.ecl-embedded {
            padding-bottom: 1rem;
          }
          .ecl-header {
            padding: 1rem 0.85rem;
          }
        }
        @media (max-width: 560px) {
          .ecl-controls-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}),!o&&e.jsxs("header",{className:"ecl-header",children:[i&&e.jsx("img",{src:i,alt:"Logo",className:"ecl-header-logo"}),e.jsxs("div",{children:[e.jsx("p",{className:"ecl-eyebrow",children:"e-Jyotisha"}),e.jsx("h1",{className:"ecl-header-title",children:r("EclipseCentralTitle","Eclipse Central")}),e.jsx("p",{className:"ecl-header-sub",children:r("EclipseCentralSubtitle","Upcoming solar & lunar eclipses with precise local timings.")})]})]}),e.jsxs("div",{className:`ecl-workspace${o?" ecl-embedded":""}`,children:[e.jsxs("div",{className:"ecl-controls",children:[e.jsxs("div",{className:"ecl-controls-row",children:[e.jsx("div",{className:"ecl-field ecl-field-place",children:e.jsx(D,{city:s.city,onLocationSelect:T})}),e.jsxs("div",{className:"ecl-field",children:[e.jsx("label",{children:r("SearchStartDate","Search From Date")}),e.jsx("input",{type:"date",value:s.date,onChange:a=>h(t=>({...t,date:a.target.value}))})]}),e.jsxs("div",{className:"ecl-field",children:[e.jsx("label",{children:r("EclipseCount","Number of Eclipses")}),e.jsxs("select",{value:s.count,onChange:a=>h(t=>({...t,count:parseInt(a.target.value)})),children:[e.jsx("option",{value:"3",children:"3"}),e.jsx("option",{value:"5",children:"5"}),e.jsx("option",{value:"8",children:"8"}),e.jsx("option",{value:"12",children:"12"}),e.jsx("option",{value:"16",children:"16"})]})]})]}),e.jsxs("div",{className:"ecl-meta-row",children:[e.jsxs("span",{children:["Lat: ",s.latitude,"°"]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Lon: ",s.longitude,"°"]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["UTC +",s.timezone]})]})]}),e.jsx("div",{className:"ecl-tabs",children:z.map(a=>e.jsx("button",{className:`ecl-tab${x===a.id?" active":""}`,onClick:()=>L(a.id),children:a.label},a.id))}),y&&e.jsxs("div",{className:"ecl-error",children:["❌ ",y]}),E?e.jsxs("div",{className:"ecl-loading",children:[e.jsx("div",{className:"ecl-spinner"}),e.jsx("p",{style:{margin:0,fontWeight:600,fontSize:"0.9rem"},children:r("CalculatingEclipses","Calculating upcoming eclipses…")})]}):e.jsx("div",{className:"ecl-grid",children:w().length===0?e.jsx("div",{className:"ecl-empty",children:r("NoEclipsesFound","No upcoming eclipses found for the selected options.")}):w().map((a,t)=>{const l=a.eventType==="solar",u=k(a),g=l?"linear-gradient(90deg, #ffd35c, #ff9a00)":"linear-gradient(90deg, #c0392b, #8a3b24)",M=l?"#c07000":"#8a3b24";return e.jsxs("div",{className:"ecl-card",children:[e.jsx("div",{className:"ecl-card-stripe",style:{background:g}}),e.jsxs("div",{className:"ecl-card-body",children:[e.jsxs("div",{className:"ecl-card-top",children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("p",{className:"ecl-card-type-label",style:{color:M},children:l?r("SolarEclipseLabel","☀️ Solar Eclipse"):r("LunarEclipseLabel","🌑 Lunar Eclipse")}),e.jsx("p",{className:"ecl-card-name",children:n(a.type,a.eventType)}),e.jsx("p",{className:"ecl-card-saros",children:r("SarosSeries","Saros {{saros}}",{saros:a.saros})})]}),e.jsxs("div",{style:{textAlign:"right",flexShrink:0},children:[e.jsx("div",{className:"ecl-card-date",children:a.localDate}),e.jsx("span",{className:`ecl-badge ${u?"visible":"not-visible"}`,children:u?r("VisibleLabel","✓ Visible"):r("NotVisibleLabel","✗ Not Visible")})]})]}),e.jsxs("div",{className:"ecl-visual-box",children:[l?e.jsx($,{type:a.type,magnitude:a.magnitude}):e.jsx(_,{type:a.type,magnitude:a.magnitude}),e.jsxs("div",{className:"ecl-visual-type-text",children:[n(a.type,a.eventType),e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.72rem",color:"#b0a090"},children:r("MagnitudePercent","{{percent}}% magnitude",{percent:Math.round(a.magnitude*100)})})]})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"ecl-timeline-label",children:["⏱ ",r("EclipseTimeline","Visibility Timeline")]}),e.jsx("div",{className:"ecl-timeline-list",children:a.contactTimes.map((p,P)=>{const v=p.label.split(" ")[0],A=G[a.eventType]?.[v]||p.label,f=p.localTime!=="-",U=r(`${a.eventType}_${v}_explanation`,A);return e.jsxs("div",{className:"ecl-timeline-row",title:U,children:[e.jsxs("span",{className:"ecl-timeline-phase",children:[e.jsx("span",{className:"ecl-phase-dot",style:{background:f?"#2f7d42":"#d6c4b0"}}),d(p.label)]}),e.jsx("span",{className:`ecl-timeline-time${f?"":" dim"}`,children:f?p.localTime.replace(/:\d{2}\s/," "):r("NotVisibleLabel","✗ Not Visible")})]},P)})})]}),a.eventType==="lunar"&&a.type.toLowerCase().includes("penumb")&&a.magnitude<.01&&e.jsxs("div",{className:"ecl-notice warning",children:["⚠️ ",e.jsx("strong",{children:r("AlmostLunarEclipseTitle","Almost Lunar Eclipse:")})," ",r("AlmostLunarEclipseDesc","The Moon barely grazes Earth's outer shadow. The effect is invisible to the naked eye — some sources list this as a near-miss.")]}),a.eventType==="solar"&&a.duration&&a.duration!=="0 min 0.00 sec"&&e.jsxs("div",{className:"ecl-notice success",children:["⏳ ",r("TotalityDuration","Totality Duration:")," ",e.jsx("strong",{children:a.duration})]})]})]},t)})})]})]})}export{R as EclipsePage};
