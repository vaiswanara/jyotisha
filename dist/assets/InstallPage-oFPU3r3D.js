import{u as d,j as e}from"./vendor-DGJAU7LJ.js";import{H as c}from"./HoroscopeHeader-CBUfKXBR.js";function m({logoUrl:l,isInstallable:n,isIosEligible:p,onInstallClick:r,onNavigate:o,pushEnabled:s,pushLoading:i,onEnablePush:a}){const{t}=d();return e.jsxs("main",{className:"page",children:[e.jsx(c,{logoUrl:l,title:t("installAppTitle","Install e-JYOTISHA"),eyebrow:"e-JYOTISHA",subtitle:t("installAppDesc","Install the app on your device for quick access.")}),e.jsxs("section",{className:"workspace",style:{display:"block",paddingTop:"calc(env(safe-area-inset-top, 0px) + 20px)",paddingBottom:"50px"},children:[e.jsx("style",{children:`
          .install-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.04);
            border: 1px solid #eaecee;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .install-card h3 {
            color: #2c3e50;
            margin-top: 0;
            border-bottom: 2px solid #f1f2f6;
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.3rem;
          }
          .install-step {
            display: flex;
            gap: 15px;
            margin-bottom: 18px;
            align-items: flex-start;
          }
          .step-number {
            background: #ebf5fb;
            color: #3498db;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
            font-size: 0.9rem;
          }
          .step-text {
            color: #4a5568;
            font-size: 1.05rem;
            line-height: 1.5;
            margin: 0;
          }
          .highlight-box {
            background: #fdf5e6;
            border-left: 4px solid #f39c12;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #d35400;
            font-size: 0.95rem;
            line-height: 1.5;
          }
          .install-btn-hover {
            transition: transform 0.2s ease;
          }
          .install-btn-hover:hover {
            transform: translateY(-2px);
          }
        `}),e.jsxs("div",{style:{textAlign:"center",marginBottom:"30px",padding:"0 15px"},children:[e.jsx("h2",{style:{color:"#2c3e50",fontSize:"1.8rem",margin:"0 0 10px 0"},children:t("getTheApp","Get the e-JYOTISHA App")}),e.jsx("p",{style:{color:"#7f8c8d",fontSize:"1.1rem",margin:0},children:t("installBenefits","Install on your device for offline access, faster loading, and a full-screen experience.")})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"25px",maxWidth:"1000px",margin:"0 auto",padding:"0 15px"},children:[e.jsxs("div",{className:"install-card",children:[e.jsxs("h3",{children:[e.jsx("span",{role:"img","aria-label":"Android",style:{fontSize:"1.5rem"},children:"📱"})," ",t("androidInstall","Android / Chrome")]}),n?e.jsxs("div",{style:{textAlign:"center",padding:"30px 0",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"},children:[e.jsx("div",{role:"img","aria-label":"Sparkles",style:{fontSize:"50px",marginBottom:"15px"},children:"✨"}),e.jsx("h4",{style:{color:"#27ae60",margin:"0 0 20px 0",fontSize:"1.2rem"},children:t("androidInstallReady","App is ready to be installed!")}),e.jsxs("button",{className:"install-btn-hover",onClick:r,style:{background:"#27ae60",color:"#fff",border:"none",padding:"14px 24px",borderRadius:"10px",fontSize:"1.1rem",fontWeight:"bold",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 4px 15px rgba(39, 174, 96, 0.3)"},children:[e.jsx("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})}),t("installApp","Install App")]})]}):e.jsxs("div",{children:[e.jsx("div",{className:"highlight-box",children:t("androidManualNotice","Automatic install button is not available. Please follow these simple manual steps:")}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsxs("p",{className:"step-text",children:[t("androidStep1","Tap the browser menu icon "),e.jsx("strong",{style:{fontSize:"1.2rem",verticalAlign:"middle"},children:"⋮"}),t("androidStep1Suffix"," at the top right of your screen.")]})]}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsxs("p",{className:"step-text",children:[t("androidStep2","Select ")," ",e.jsx("strong",{children:t("androidInstallApp",'"Install App"')})," ",t("or","or")," ",e.jsx("strong",{children:t("androidAddToHome",'"Add to Home screen"')}),"."]})]}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("p",{className:"step-text",children:t("androidStep3","Follow the on-screen prompt to confirm installation.")})]})]})]}),e.jsxs("div",{className:"install-card",children:[e.jsxs("h3",{children:[e.jsx("span",{role:"img","aria-label":"Apple",style:{fontSize:"1.5rem"},children:"🍎"})," ",t("iosInstall","iPhone / iPad (Safari)")]}),e.jsx("div",{className:"highlight-box",style:{background:"#ebf5fb",borderLeftColor:"#3498db",color:"#2980b9"},children:t("iosNotice","You must open this website in the Safari browser to install it on iOS devices.")}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsxs("p",{className:"step-text",children:[t("iosInstallStep1","Tap the Share button "),e.jsxs("svg",{style:{verticalAlign:"middle",margin:"0 5px",color:"#3498db"},width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"}),e.jsx("polyline",{points:"16 6 12 2 8 6"}),e.jsx("line",{x1:"12",y1:"2",x2:"12",y2:"15"})]}),t("iosInstallStep1Suffix"," at the bottom of your screen.")]})]}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsxs("p",{className:"step-text",children:[t("iosInstallStep2","Scroll down the menu and tap on "),e.jsx("strong",{style:{color:"#2d3436"},children:t("iosInstallAddHome",'"Add to Home Screen"')}),e.jsxs("svg",{style:{verticalAlign:"middle",margin:"0 5px",color:"#2d3436"},width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"16"}),e.jsx("line",{x1:"8",y1:"12",x2:"16",y2:"12"})]}),"."]})]}),e.jsxs("div",{className:"install-step",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("p",{className:"step-text",children:t("iosInstallStep3",'Tap "Add" at the top right to complete the installation.')})]})]})]}),e.jsx("div",{style:{maxWidth:"1000px",margin:"30px auto 0",padding:"0 15px"},children:e.jsxs("div",{className:"install-card",style:{textAlign:"center",alignItems:"center",padding:"35px 20px"},children:[e.jsx("h2",{style:{color:"#8e44ad",marginBottom:"15px"},children:t("dailyAlertsTitle","Daily Alerts (Push Notifications)")}),e.jsx("p",{style:{color:"#7f8c8d",fontSize:"1.1rem",marginBottom:"25px"},children:t("dailyAlertsDesc","Enable daily notifications for Panchanga and important astrological alerts directly to your device.")}),e.jsxs("button",{type:"button",onClick:a,disabled:i,style:{background:s?"#e74c3c":"#8e44ad",color:"#fff",border:"none",padding:"12px 24px",borderRadius:"8px",fontSize:"1.1rem",fontWeight:"bold",cursor:i?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:"8px",boxShadow:"0 4px 10px rgba(0,0,0,0.15)",opacity:i?.7:1},children:[e.jsx("span",{style:{fontSize:"1.2rem"},children:s?"🔕":"🔔"}),i?t("pleaseWait","Please wait..."):s?t("disableAlerts","Disable Alerts"):t("enableAlerts","Enable Daily Alerts")]})]})})]}),e.jsx("footer",{className:"no-print",style:{textAlign:"center",padding:"20px",fontSize:"13px",color:"#7f8c8d",marginTop:"auto"},children:e.jsx("button",{onClick:()=>o("Privacy"),style:{background:"none",border:"none",color:"#3498db",textDecoration:"underline",cursor:"pointer",fontSize:"13px",padding:0},children:t("Privacy","Privacy Policy")})})]})}export{m as InstallPage};
