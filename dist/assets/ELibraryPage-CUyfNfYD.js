import{u as E,r as s,R as _,j as t}from"./vendor-DGJAU7LJ.js";import{H as W}from"./HoroscopeHeader-CBUfKXBR.js";import{d as I}from"./index-4QWafhvJ.js";const L=[{title:"ನಿರ್ಣಯ ಸಿಂಧು (Nirnaya Sindhu)",author:"ಶೇಷ ನವರತ್ನ (Sesha Navaratna)",language:"Kannada",subject:"Dharma",subcategory:"Scriptures",description:"ಹಿಂದೂ ಧರ್ಮಶಾಸ್ತ್ರದಲ್ಲಿ विभिन्न ವ್ರತಗಳು, ಹಬ್ಬಗಳು ಮತ್ತು ಕಾಲ ನಿರ್ಣಯದ ನಿಯಮಗಳನ್ನು ವಿವರಿಸುವ ಪ್ರಮುಖ ಗ್ರಂಥ.",sourceType:"archive",thumbnail:"https://archive.org/services/img/nirnaya-sindhu",readLink:"https://archive.org/details/nirnaya-sindhu",pdfLink:"https://dn790002.ca.archive.org/0/items/nirnaya-sindhu/Nirnaya%20Sindhu_text.pdf",createdDate:"2026-06-08",isVisibility:!0,id:1},{id:2,title:"ಬೃಹಜ್ಞಾತಕ (Brihat Jataka)",author:"ಕದಿರಿ ಶ್ರೀನಿವಾಸ ಶರ್ಮಾ (Kadiri Srinivasa Sharma)",language:"Kannada",subject:"Astrology",subcategory:"Basics",description:"ಮಹರ್ಷಿ ವರಾಹಮಿಹಿರಾಚಾರ್ಯರ ಬೃಹಜ್ಜಾತಕ ಗ್ರಂಥದ ಕನ್ನಡ ವಿವರಣಾತ್ಮಕ ಗ್ರಂಥ.",sourceType:"archive",thumbnail:"https://archive.org/services/img/in.ernet.dli.2015.382024",readLink:"https://ia802905.us.archive.org/3/items/in.ernet.dli.2015.382024/2015.382024.Bruhadjataka.pdf",pdfLink:"https://ia802905.us.archive.org/3/items/in.ernet.dli.2015.382024/2015.382024.Bruhadjataka.pdf",createdDate:"2026-06-08",isVisibility:!0},{id:3,title:"సారావళి (Saravali)",author:"జనమంచి శేషాద్రి శర్మ (Janamanchi Sheshaadri Sharma)",language:"Telugu",subject:"Astrology",subcategory:"Jatakam",description:"Comprehensive guide to predictive astrology and horoscopic analysis.",sourceType:"archive",thumbnail:"",readLink:"https://dn721900.ca.archive.org/0/items/in.ernet.dli.2015.491556/2015.491556.saaraavali_text.pdf",pdfLink:"https://dn721900.ca.archive.org/0/items/in.ernet.dli.2015.491556/2015.491556.saaraavali_text.pdf",createdDate:"2026-06-07",isVisibility:!0},{id:4,title:"Rigveda Purusha Sukta Bhashya",author:"Traditional Scholars",language:"English",subject:"Vedas",subcategory:"Rigveda",description:"English translation and commentary of the famous Purusha Sukta from the Rigveda, detailing cosmic creation.",sourceType:"archive",thumbnail:"",readLink:"https://archive.org/details/purushasukta00unse",pdfLink:"https://archive.org/download/purushasukta00unse/purushasukta00unse.pdf",createdDate:"2026-06-06",isVisibility:!1},{id:5,title:"ఈశోపనిషత్తు భాష్యము (Ishopanishad)",author:"శ్రీ ఆది శంకరాచార్యులు (Adi Shankaracharya)",language:"Telugu",subject:"Upanishads",subcategory:"Isha",description:"ఈశోపనిషత్తుకు శ్రీ ఆది శంకరాచార్యుల సంస్కృత భాష్యానికి సులభమైన తెలుగు అనువాదం.",sourceType:"gdrive",thumbnail:"",readLink:"https://drive.google.com/file/d/1QrStUvWxYzAbCdEfGhIjKlMnOpQrStU/view?usp=sharing",pdfLink:"https://drive.google.com/file/d/1QrStUvWxYzAbCdEfGhIjKlMnOpQrStU/view?usp=sharing",createdDate:"2026-06-05",isVisibility:!1},{id:6,title:"సంస్కృత వ్యాకరణ ప్రవేశిక (Sanskrit Grammar)",author:"వైశ్వానర (Vaiswanara)",language:"Telugu",subject:"Sanskrit",subcategory:"Grammar",description:"సంస్కృత భాష నేర్చుకోవడానికి కావలసిన ప్రాథమిక సంధులు, సమాసాలు మరియు విభక్తుల సులభమైన వివరణ.",sourceType:"gdrive",thumbnail:"",readLink:"https://drive.google.com/file/d/1UvWxYzAbCdEfGhIjKlMnOpQrStUvWxY/view?usp=sharing",pdfLink:"https://drive.google.com/file/d/1UvWxYzAbCdEfGhIjKlMnOpQrStUvWxY/view?usp=sharing",createdDate:"2026-06-04",isVisibility:!1}];function O({logoUrl:N}){const{t:i}=E(),[b,z]=s.useState(()=>{try{const e=localStorage.getItem("elibrary_books_cache");return e?JSON.parse(e):L}catch{return L}}),[m,y]=s.useState(!0),[h,D]=s.useState(""),[c,C]=s.useState(""),[p,T]=s.useState("All"),[o,w]=s.useState("All"),[u,x]=s.useState("All"),v=e=>{if(!e)return{viewUrl:"#",downloadUrl:"#"};if(e.sourceType==="gdrive"){const a=e.pdfLink||e.readLink||"",r=a.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(r&&r[1]){const l=r[1];return{viewUrl:`https://drive.google.com/file/d/${l}/view`,downloadUrl:`https://drive.google.com/uc?export=download&id=${l}`}}return a.length===33||!a.includes("/")&&a.length>15?{viewUrl:`https://drive.google.com/file/d/${a}/view`,downloadUrl:`https://drive.google.com/uc?export=download&id=${a}`}:{viewUrl:a,downloadUrl:a}}return{viewUrl:e.readLink||e.pdfLink||"#",downloadUrl:e.pdfLink||"#"}},j=e=>{if(!e)return null;if(e.thumbnail)return e.thumbnail;if(e.sourceType==="archive"){const a=e.readLink||e.pdfLink||"",r=a.match(/details\/([a-zA-Z0-9_-]+)/)||a.match(/download\/([a-zA-Z0-9_-]+)/)||a.match(/items\/([a-zA-Z0-9_-]+)/);if(r&&r[1])return`https://archive.org/services/img/${r[1]}`}return null};s.useEffect(()=>{(async()=>{let a=[];try{const r=await I();if(r&&Array.isArray(r))a=r,localStorage.setItem("elibrary_books_cache",JSON.stringify(a));else throw new Error("No books returned from API")}catch(r){console.warn("API library fetch failed, falling back to static file:",r);try{const l=await fetch("/jyotisha/static/library.json");if(!l.ok)throw new Error("Failed to load static library file.");const d=await l.json();a=Array.isArray(d)?d:d.library||[],localStorage.setItem("elibrary_books_cache",JSON.stringify(a))}catch(l){console.error("Static library fallback fetch failed:",l);const d=localStorage.getItem("elibrary_books_cache");if(d)try{a=JSON.parse(d)}catch{}else{D("Could not load library books. Please refresh or try again later."),y(!1);return}}}z(a),y(!1)})()},[]);const n=s.useMemo(()=>[...b.filter(a=>a.isVisibility!==!1)].sort((a,r)=>{const l=a.createdDate?new Date(a.createdDate):new Date(0);return(r.createdDate?new Date(r.createdDate):new Date(0))-l}),[b]),B=s.useMemo(()=>{const e=new Set(n.map(a=>a.language).filter(Boolean));return["All",...Array.from(e)]},[n]),U=s.useMemo(()=>{const e=new Set(n.map(a=>a.subject).filter(Boolean));return["All",...Array.from(e)]},[n]),S=s.useMemo(()=>{let e=n;o!=="All"&&(e=n.filter(r=>r.subject===o));const a=new Set(e.map(r=>r.subcategory).filter(Boolean));return["All",...Array.from(a)]},[o,n]);_.useEffect(()=>{x("All")},[o]);const A=s.useMemo(()=>n.slice(0,4),[n]),f=s.useMemo(()=>n.filter(e=>{const a=!c||e.title.toLowerCase().includes(c.toLowerCase())||e.author.toLowerCase().includes(c.toLowerCase())||e.description.toLowerCase().includes(c.toLowerCase()),r=p==="All"||e.language===p,l=o==="All"||e.subject===o,d=u==="All"||e.subcategory===u;return a&&r&&l&&d}),[c,p,o,u,n]),k=e=>{switch(e?.toLowerCase()){case"astrology":return"linear-gradient(135deg, #8e44ad, #3498db)";case"psychology":return"linear-gradient(135deg, #16a085, #2ecc71)";case"vedas":return"linear-gradient(135deg, #d35400, #f1c40f)";case"upanishads":return"linear-gradient(135deg, #c0392b, #e67e22)";case"sanskrit":return"linear-gradient(135deg, #2980b9, #34495e)";case"dharma":return"linear-gradient(135deg, #e67e22, #c0392b)";default:return"linear-gradient(135deg, #7f8c8d, #95a5a6)"}},g=e=>{switch(e?.toLowerCase()){case"astrology":return"#8e44ad";case"psychology":return"#16a085";case"vedas":return"#d35400";case"upanishads":return"#c0392b";case"sanskrit":return"#2980b9";case"dharma":return"#e67e22";default:return"#7f8c8d"}};return t.jsxs("main",{className:"page",style:{display:"flex",flexDirection:"column",minHeight:"100vh"},children:[t.jsx("style",{children:`
        .library-section {
          padding: 20px;
          padding-top: calc(env(safe-area-inset-top, 0px) + 10px);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .filter-panel {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .search-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 2;
          min-width: 260px;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          transition: border-color 0.2s;
        }
        .search-input:focus {
          border-color: #8e44ad;
        }

        .dropdown-select {
          flex: 1;
          min-width: 150px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          background: #fff;
          cursor: pointer;
        }

        .pills-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          scrollbar-width: none; /* Firefox */
        }
        .pills-container::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }

        .pill-item {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
          background: #fdfefe;
          color: #555;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .pill-item:hover {
          background: #f5f6fa;
        }
        .pill-item.active {
          background: #8e44ad;
          color: #fff;
          border-color: #8e44ad;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.2);
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          width: 100%;
        }

        .book-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eef0f3;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .book-info {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }

        .book-title {
          font-size: 16px;
          fontWeight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .book-author {
          font-size: 13px;
          color: #7f8c8d;
          margin: 0;
          font-style: italic;
        }

        .badges-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .book-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .actions-row {
          display: flex;
          gap: 10px;
          border-top: 1px solid #f2f4f8;
          padding: 12px 18px;
          background: #fafbfc;
        }

        .action-btn {
          flex: 1;
          padding: 9px;
          font-size: 13px;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-view {
          background: #fff;
          border: 1px solid #cbd5e0;
          color: #4a5568;
        }
        .btn-view:hover {
          background: #edf2f7;
          border-color: #a0aec0;
        }
        .btn-download {
          background: #8e44ad;
          border: 1px solid #8e44ad;
          color: #fff;
        }
        .btn-download:hover {
          background: #732d91;
          border-color: #732d91;
        }

        .featured-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e67e22;
          font-size: 18px;
          margin: 0 0 15px 0;
          font-weight: bold;
        }

        .recently-added-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 15px;
          width: 100%;
        }

        .recently-added-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eef0f3;
          box-shadow: 0 3px 10px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .recently-added-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .recently-added-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }

        .recently-added-title {
          font-size: 14px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .recently-added-author {
          font-size: 12px;
          color: #7f8c8d;
          margin: 0;
          font-style: italic;
        }

        .recently-added-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .recently-added-actions {
          display: flex;
          gap: 8px;
          border-top: 1px solid #f2f4f8;
          padding: 8px 12px;
          background: #fafbfc;
        }

        @media (max-width: 480px) {
          .library-section {
            padding: 10px;
          }
          .filter-panel {
            padding: 12px;
            border-radius: 12px;
          }
          .search-row {
            flex-direction: column;
            gap: 10px;
          }
          .search-input, .dropdown-select {
            width: 100%;
          }
          .books-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .recently-added-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}),t.jsx(W,{logoUrl:N,title:i("e-Library","e-Library"),eyebrow:"e-JYOTISHA",subtitle:i("librarySubtitle","Vaiswanara Digital Library for Students")}),t.jsxs("section",{className:"library-section",children:[m&&t.jsxs("div",{style:{textAlign:"center",padding:"40px 20px",color:"#8e44ad",fontWeight:"bold",fontSize:"1.1rem"},children:["⏳ ",i("loadingLibrary","Loading library books...")]}),h&&t.jsxs("div",{style:{textAlign:"center",padding:"40px 20px",color:"#e74c3c",fontWeight:"bold",fontSize:"1.1rem"},children:["⚠️ ",h]}),!m&&!h&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"filter-panel",children:[t.jsxs("div",{className:"search-row",children:[t.jsx("input",{type:"text",className:"search-input",placeholder:i("searchPlaceholder","Search by title, author, description..."),value:c,onChange:e=>C(e.target.value)}),t.jsxs("select",{className:"dropdown-select",value:p,onChange:e=>T(e.target.value),children:[t.jsx("option",{value:"All",children:i("All Languages","All Languages")}),B.filter(e=>e!=="All").map(e=>t.jsx("option",{value:e,children:i(e,e)},e))]})]}),t.jsxs("div",{children:[t.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#666",marginBottom:"8px"},children:i("Subject","Subject")}),t.jsxs("div",{className:"pills-container",children:[t.jsx("button",{className:`pill-item ${o==="All"?"active":""}`,onClick:()=>w("All"),children:i("All Subjects","All Subjects")}),U.filter(e=>e!=="All").map(e=>t.jsx("button",{className:`pill-item ${o===e?"active":""}`,onClick:()=>w(e),children:i(e,e)},e))]})]}),S.length>1&&t.jsxs("div",{children:[t.jsx("div",{style:{fontSize:"13px",fontWeight:"bold",color:"#666",marginBottom:"8px"},children:i("Subcategory","Subcategory")}),t.jsxs("div",{className:"pills-container",children:[t.jsx("button",{className:`pill-item ${u==="All"?"active":""}`,onClick:()=>x("All"),children:i("All","All")}),S.filter(e=>e!=="All").map(e=>t.jsx("button",{className:`pill-item ${u===e?"active":""}`,onClick:()=>x(e),children:i(e,e)},e))]})]})]}),t.jsxs("h2",{style:{fontSize:"18px",color:"#2c3e50",fontWeight:"bold",marginBottom:"15px"},children:["📚 ",i("Catalog","Books Catalog")," (",f.length,")"]}),f.length===0?t.jsxs("div",{style:{padding:"50px 20px",textAlign:"center",background:"#fff",borderRadius:"12px",border:"1px solid #eee",color:"#7f8c8d"},children:[t.jsx("div",{style:{fontSize:"40px",marginBottom:"10px"},children:"📭"}),t.jsx("h3",{children:i("No Results Found","No Results Found")}),t.jsx("p",{children:i("noResultsLibraryDesc","Try adjusting your search queries or category filters.")})]}):t.jsx("div",{className:"books-grid",style:{marginBottom:"35px"},children:f.map(e=>{const a=v(e),r=j(e);return t.jsxs("div",{className:"book-card",children:[r?t.jsx("img",{src:r,alt:e.title,style:{width:"100%",height:"220px",objectFit:"cover"},onError:l=>{l.target.style.display="none",l.target.nextSibling.style.display="flex"}}):null,t.jsxs("div",{style:{display:r?"none":"flex",width:"100%",height:"220px",background:k(e.subject),flexDirection:"column",justifyContent:"space-between",padding:"20px",boxSizing:"border-box",color:"#fff",textAlign:"center"},children:[t.jsx("div",{style:{fontSize:"11px",textTransform:"uppercase",opacity:.8,fontWeight:"bold"},children:i(e.subject)}),t.jsx("div",{style:{fontSize:"15px",fontWeight:"bold",margin:"10px 0"},children:e.title}),t.jsx("div",{style:{fontSize:"11px",fontStyle:"italic",opacity:.9},children:e.author})]}),t.jsxs("div",{className:"book-info",children:[t.jsxs("div",{className:"badges-row",children:[t.jsx("span",{className:"badge-pill",style:{background:"#ebf5fb",color:"#2980b9"},children:i(e.language,e.language)}),t.jsx("span",{className:"badge-pill",style:{background:`${g(e.subject)}15`,color:g(e.subject)},children:i(e.subject,e.subject)}),e.subcategory&&t.jsx("span",{className:"badge-pill",style:{background:"#f5f6fa",color:"#7f8c8d"},children:i(e.subcategory,e.subcategory)})]}),t.jsx("h3",{className:"book-title",children:e.title}),t.jsxs("p",{className:"book-author",children:[i("Author","Author"),": ",e.author]}),t.jsx("p",{className:"book-desc",children:e.description})]}),t.jsx("div",{className:"actions-row",children:t.jsxs("a",{href:a.viewUrl,target:"_blank",rel:"noreferrer",className:"action-btn btn-download",style:{textAlign:"center",width:"100%"},children:["📖 ",i("viewDownload","View / Download")]})})]},e.id)})}),o==="All"&&p==="All"&&c===""&&A.length>0&&t.jsxs("div",{style:{marginTop:"40px",borderTop:"1px dashed #ddd",paddingTop:"30px",marginBottom:"20px"},children:[t.jsxs("h2",{className:"featured-header",style:{color:"#7f8c8d",fontSize:"16px"},children:["✨ ",i("Recently Added","Recently Added")]}),t.jsx("div",{className:"recently-added-grid",children:A.map(e=>{const a=v(e),r=j(e);return t.jsxs("div",{className:"recently-added-card",children:[r?t.jsx("img",{src:r,alt:e.title,style:{width:"100%",height:"160px",objectFit:"cover"},onError:l=>{l.target.style.display="none",l.target.nextSibling.style.display="flex"}}):null,t.jsxs("div",{style:{display:r?"none":"flex",width:"100%",height:"160px",background:k(e.subject),flexDirection:"column",justifyContent:"space-between",padding:"12px",boxSizing:"border-box",color:"#fff",textAlign:"center"},children:[t.jsx("div",{style:{fontSize:"9px",textTransform:"uppercase",opacity:.8,fontWeight:"bold"},children:i(e.subject)}),t.jsx("div",{style:{fontSize:"12px",fontWeight:"bold",margin:"5px 0"},children:e.title}),t.jsx("div",{style:{fontSize:"9px",fontStyle:"italic",opacity:.9},children:e.author})]}),t.jsxs("div",{className:"recently-added-info",children:[t.jsxs("div",{className:"badges-row",style:{gap:"4px"},children:[t.jsx("span",{className:"badge-pill",style:{background:"#ebf5fb",color:"#2980b9",fontSize:"9px",padding:"2px 6px"},children:i(e.language,e.language)}),t.jsx("span",{className:"badge-pill",style:{background:`${g(e.subject)}15`,color:g(e.subject),fontSize:"9px",padding:"2px 6px"},children:i(e.subject,e.subject)})]}),t.jsx("h3",{className:"recently-added-title",children:e.title}),t.jsxs("p",{className:"recently-added-author",style:{fontSize:"11px",margin:0},children:[i("Author","Author"),": ",e.author]}),t.jsx("p",{className:"recently-added-desc",children:e.description})]}),t.jsx("div",{className:"actions-row",children:t.jsxs("a",{href:a.viewUrl,target:"_blank",rel:"noreferrer",className:"action-btn btn-download",style:{textAlign:"center",width:"100%"},children:["📖 ",i("viewDownload","View / Download")]})})]},`featured-${e.id}`)})})]})]})]})]})}export{O as ELibraryPage};
