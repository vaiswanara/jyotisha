import fs from 'fs';
import { philosophyData } from '../src/data/philosophyData.js';

function renderSection(sec, langKey, isFirst) {
  const readCue = langKey === 'te' ? 'చదవండి ▾' : langKey === 'kn' ? 'ಓದಿ ▾' : 'Read ▾';
  const collapseTitle = langKey === 'te' ? 'కుదించడానికి క్లిక్ చేయండి' : langKey === 'kn' ? 'ಕುಗ್ಗಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to collapse';
  const expandTitle = langKey === 'te' ? 'చదవడానికి క్లిక్ చేయండి' : langKey === 'kn' ? 'ಓದಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to expand & read';
  
  let bodyHtml = '';
  sec.paragraphs.forEach(p => {
    bodyHtml += `            <p class="vphilo-p">${p}</p>\n`;
  });
  
  if (sec.bulletPoints && sec.bulletPoints.length > 0) {
    bodyHtml += `            <ul class="vphilo-bullets">\n`;
    sec.bulletPoints.forEach(b => {
      bodyHtml += `                <li>${b}</li>\n`;
    });
    bodyHtml += `            </ul>\n`;
  }
  
  if (sec.highlightQuote) {
    bodyHtml += `            <div class="vphilo-quote">“${sec.highlightQuote}”</div>\n`;
  }
  
  if (sec.extraParagraphs && sec.extraParagraphs.length > 0) {
    sec.extraParagraphs.forEach(ep => {
      bodyHtml += `            <p class="vphilo-p">${ep}</p>\n`;
    });
  }

  const isExpandedClass = isFirst ? ' is-expanded' : ' is-collapsed';
  
  return `        <div class="vphilo-card${isExpandedClass}" id="${langKey}-sec-${sec.id}" data-card-id="${langKey}-sec-${sec.id}">
            <div class="vphilo-card-header" data-toggle="${langKey}-sec-${sec.id}" title="${isFirst ? collapseTitle : expandTitle}">
                <div class="vphilo-card-title-wrap">
                    <span class="vphilo-chevron">▼</span>
                    <h3 class="vphilo-card-title">${sec.title}</h3>
                </div>
                <div class="vphilo-header-right">
                    <span class="vphilo-read-cue">${readCue}</span>
                    <button class="vphilo-copy-btn" title="Copy Section">📋</button>
                </div>
            </div>
            <div class="vphilo-card-body">
${bodyHtml}            </div>
        </div>`;
}

function renderLangTab(langKey, isActive) {
  const data = philosophyData[langKey];
  const tabId = langKey === 'en' ? 'VPhiloEnglish' : langKey === 'kn' ? 'VPhiloKannada' : 'VPhiloTelugu';
  const activeClass = isActive ? ' active' : '';
  
  const hintText = langKey === 'te' 
    ? 'ఏదైనా అంశంపై క్లిక్ చేసి చదవవచ్చు' 
    : langKey === 'kn' 
    ? 'ಯಾವುದೇ ವಿಷಯವನ್ನು ಓದಲು ಅದರ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' 
    : 'Click any topic below to expand & read';

  const countText = langKey === 'te' ? '22 అంశాలు' : langKey === 'kn' ? '22 ವಿಷಯಗಳು' : '22 Topics';
  
  let qListHtml = '';
  data.introQuestions.forEach(q => {
    qListHtml += `            <li>${q}</li>\n`;
  });

  let sectionsHtml = '';
  data.sections.forEach((sec, idx) => {
    sectionsHtml += renderSection(sec, langKey, idx === 0) + '\n';
  });

  let closingHtml = '';
  data.closing.paragraphs.forEach(cp => {
    closingHtml += `            <p class="vphilo-closing-p">${cp}</p>\n`;
  });

  return `    <div id="${tabId}" class="vphilo-tab-content${activeClass}">
        <h2 class="vphilo-page-title">${data.title}</h2>
        <p class="vphilo-page-subtitle">${data.subtitle}</p>

        <!-- Intro Questions Box -->
        <div class="vphilo-intro-card">
            <h3 class="vphilo-intro-qtitle"><span>❓</span> ${data.introQuestionsTitle}</h3>
            <ul class="vphilo-questions-list">
${qListHtml}            </ul>
            <p class="vphilo-intro-statement">${data.introStatement}</p>
        </div>

        <!-- Student Hint Banner with Compact Font Resizer -->
        <div class="vphilo-hint-banner">
            <span class="vphilo-hint-text">💡 ${hintText}</span>
            <div class="vphilo-hint-right">
                <span class="vphilo-hint-count">${countText}</span>
                <div class="vphilo-mini-font-actions">
                    <button class="vphilo-mini-font-btn font-dec" title="Decrease Font Size">A-</button>
                    <button class="vphilo-mini-font-btn font-inc" title="Increase Font Size">A+</button>
                </div>
            </div>
        </div>

        <!-- 22 Sections List -->
        <div class="vphilo-sections-list">
${sectionsHtml}        </div>

        <!-- Closing Message & Guru Sandesham -->
        <div class="vphilo-closing-card">
            <h3 class="vphilo-closing-title"><span>🙏</span> ${data.closing.title}</h3>
${closingHtml}
            <div class="vphilo-mantra-banner">${data.closing.mantra}</div>
            <p class="vphilo-signature">${data.closing.signature}</p>
        </div>
    </div>`;
}

const fullHtml = `<div id="vaiswanara-philosophy-container">
    <style>
        #vaiswanara-philosophy-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #2c3e50;
            background-color: #ffffff;
            line-height: 1.8;
            max-width: 860px;
            margin: 0 auto;
            padding: 10px 14px 60px 14px;
            box-sizing: border-box;
        }

        /* Language Tabs Bar */
        .vphilo-tab-wrapper {
            display: flex;
            background-color: #f1f3f5;
            border-radius: 12px;
            padding: 4px;
            gap: 4px;
            margin-bottom: 24px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
        }
        .vphilo-tab-btn {
            flex: 1;
            background: none;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 11px 16px;
            font-size: 15px;
            font-weight: 700;
            color: #495057;
            border-radius: 9px;
            transition: all 0.25s ease;
            text-align: center;
        }
        .vphilo-tab-btn:hover {
            color: #d35400;
            background-color: rgba(255, 255, 255, 0.6);
        }
        .vphilo-tab-btn.active {
            background-color: #ffffff !important;
            color: #d35400 !important;
            box-shadow: 0 2px 8px rgba(211, 84, 0, 0.12) !important;
        }

        /* Tab Content display control */
        .vphilo-tab-content {
            display: none !important;
        }
        .vphilo-tab-content.active {
            display: block !important;
        }

        /* Headings */
        .vphilo-page-title {
            font-size: 24px;
            color: #2c3e50;
            margin: 0 0 8px 0;
            font-weight: 800;
            text-align: center;
            line-height: 1.35;
        }
        .vphilo-page-subtitle {
            font-size: 15px;
            color: #7f8c8d;
            margin: 0 0 22px 0;
            text-align: center;
            font-style: italic;
        }

        /* Intro Box */
        .vphilo-intro-card {
            background: #fff9f5;
            border-left: 4px solid #d35400;
            border-radius: 0 14px 14px 0;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 3px 12px rgba(211, 84, 0, 0.05);
        }
        .vphilo-intro-qtitle {
            font-size: 16px;
            font-weight: 700;
            color: #a0492e;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .vphilo-questions-list {
            list-style: none;
            padding: 0;
            margin: 0 0 14px 0;
        }
        .vphilo-questions-list li {
            font-size: 14.5px;
            line-height: 1.6;
            color: #495057;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            font-style: italic;
        }
        .vphilo-questions-list li::before {
            content: "💬";
            position: absolute;
            left: 0;
            font-size: 11px;
            top: 2px;
        }
        .vphilo-intro-statement {
            font-size: 14.5px;
            line-height: 1.7;
            color: #2b2b2b;
            margin: 0;
            border-top: 1px dashed rgba(211, 84, 0, 0.25);
            padding-top: 12px;
            font-weight: 500;
        }

        /* Hint Banner with Font Controls */
        .vphilo-hint-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff8f2;
            border: 1px solid #f6ded5;
            padding: 6px 12px;
            border-radius: 10px;
            margin-bottom: 14px;
            color: #8c3b00;
            font-size: 12.5px;
            font-weight: 600;
            flex-wrap: wrap;
            gap: 6px;
            box-sizing: border-box;
        }
        .vphilo-hint-text {
            flex: 1;
            min-width: 200px;
            line-height: 1.3;
        }
        .vphilo-hint-right {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .vphilo-hint-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            font-size: 11.5px;
            color: #a0492e;
            background: rgba(160, 73, 46, 0.08);
            padding: 0 8px;
            border-radius: 6px;
            font-weight: 700;
            white-space: nowrap;
            line-height: 1;
        }

        /* Mini Font Resizer */
        .vphilo-mini-font-actions {
            display: inline-flex;
            align-items: center;
            height: 24px;
            gap: 2px;
            background: #ffffff;
            padding: 1px;
            border-radius: 6px;
            border: 1px solid #ebd2c8;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
        }
        .vphilo-mini-font-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            min-width: 24px;
            padding: 0 5px;
            border: none;
            background: transparent;
            color: #7a2b16;
            font-size: 11px;
            font-weight: 800;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            line-height: 1;
            box-sizing: border-box;
        }
        .vphilo-mini-font-btn:hover {
            background: #7a2b16;
            color: #ffffff;
        }

        /* Section Cards */
        .vphilo-card {
            background: #ffffff;
            border-radius: 12px;
            margin-bottom: 12px;
            border: 1.5px solid #edf0f2;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            scroll-margin-top: 75px;
        }
        .vphilo-card:hover {
            border-color: #e5a48d;
            box-shadow: 0 4px 14px rgba(160, 73, 46, 0.08);
            transform: translateY(-1px);
        }
        .vphilo-card.is-expanded {
            border-color: #d35400;
            box-shadow: 0 5px 18px rgba(211, 84, 0, 0.10);
        }

        /* Clickable Header */
        .vphilo-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 15px 18px;
            cursor: pointer;
            user-select: none;
            background: #ffffff;
            transition: background-color 0.2s;
        }
        .vphilo-card.is-expanded .vphilo-card-header {
            background: #fffbf8;
            border-bottom: 1.5px solid #f6ded5;
        }
        .vphilo-card-title-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .vphilo-card-title {
            font-size: 16.5px;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            line-height: 1.4;
            transition: color 0.2s;
        }
        .vphilo-card.is-expanded .vphilo-card-title {
            color: #7a2b16;
        }

        /* Chevron Icon */
        .vphilo-chevron {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #fdf2ed;
            color: #a0492e;
            font-size: 11px;
            font-weight: 800;
            transition: transform 0.25s ease, background-color 0.2s, color 0.2s;
            flex-shrink: 0;
        }
        .vphilo-card.is-expanded .vphilo-chevron {
            background: #a0492e;
            color: #ffffff;
            transform: rotate(180deg);
        }
        .vphilo-card:hover:not(.is-expanded) .vphilo-chevron {
            background: #fce1d4;
        }

        /* Read Cue & Copy button display states */
        .vphilo-header-right {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }
        .vphilo-read-cue {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            font-size: 11px;
            font-weight: 700;
            color: #d35400;
            background: #fff2e6;
            padding: 3px 8px;
            border-radius: 10px;
            border: 1px solid #ffd8b3;
            white-space: nowrap;
        }
        .vphilo-card.is-collapsed .vphilo-read-cue {
            display: inline-flex !important;
        }
        .vphilo-card.is-expanded .vphilo-read-cue {
            display: none !important;
        }
        .vphilo-card:hover .vphilo-read-cue {
            background: #d35400;
            color: #ffffff;
            border-color: #d35400;
        }

        .vphilo-copy-btn {
            background: none;
            border: none;
            color: #adb5bd;
            cursor: pointer;
            font-size: 14px;
            padding: 3px 6px;
            border-radius: 5px;
            transition: all 0.2s;
        }
        .vphilo-card.is-collapsed .vphilo-copy-btn {
            display: none !important;
        }
        .vphilo-card.is-expanded .vphilo-copy-btn {
            display: inline-block !important;
        }
        .vphilo-copy-btn:hover {
            color: #a0492e;
            background: #f8f9fa;
        }

        /* Card Content Body accordion control */
        .vphilo-card-body {
            padding: 20px 20px 22px 20px;
            background: #ffffff;
        }
        .vphilo-card.is-collapsed .vphilo-card-body {
            display: none !important;
        }
        .vphilo-card.is-expanded .vphilo-card-body {
            display: block !important;
        }

        .vphilo-p {
            margin: 0 0 13px 0;
            color: #333333;
            line-height: 1.8;
            text-align: justify;
        }
        .vphilo-p:last-child {
            margin-bottom: 0;
        }

        /* Bullets */
        .vphilo-bullets {
            list-style: none;
            padding: 0;
            margin: 12px 0;
            background: #fcfdfd;
            border-radius: 10px;
            padding: 10px 14px;
            border: 1px solid #eef2f5;
        }
        .vphilo-bullets li {
            padding-left: 20px;
            position: relative;
            margin-bottom: 8px;
            color: #374151;
            line-height: 1.6;
            font-size: 0.98em;
        }
        .vphilo-bullets li:last-child {
            margin-bottom: 0;
        }
        .vphilo-bullets li::before {
            content: "✦";
            position: absolute;
            left: 0;
            color: #d35400;
            font-size: 12px;
            top: 0;
        }

        /* Quote Highlight */
        .vphilo-quote {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border-left: 3px solid #ea580c;
            padding: 12px 16px;
            border-radius: 0 10px 10px 0;
            margin: 14px 0;
            font-weight: 600;
            color: #9a3412;
            font-style: italic;
            line-height: 1.6;
            box-shadow: 0 1px 4px rgba(234, 88, 12, 0.05);
        }

        /* Closing Card */
        .vphilo-closing-card {
            background: linear-gradient(180deg, #ffffff 0%, #fffbf9 100%);
            border-radius: 16px;
            padding: 26px 20px;
            margin-top: 28px;
            border: 2px solid #f6ded5;
            box-shadow: 0 6px 24px rgba(160, 73, 46, 0.06);
        }
        .vphilo-closing-title {
            font-size: 20px;
            font-weight: 800;
            color: #7a2b16;
            margin: 0 0 14px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1.5px solid #f6ded5;
            padding-bottom: 10px;
        }
        .vphilo-closing-p {
            color: #3e2723;
            line-height: 1.8;
            margin-bottom: 12px;
            text-align: justify;
        }
        .vphilo-mantra-banner {
            background: #7a2b16;
            color: #ffffff;
            padding: 14px 18px;
            border-radius: 10px;
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            margin: 20px 0 14px 0;
            letter-spacing: 0.3px;
        }
        .vphilo-signature {
            text-align: right;
            font-size: 16px;
            font-weight: 800;
            color: #a0492e;
            margin-top: 14px;
            font-style: italic;
        }

        @media (max-width: 600px) {
            #vaiswanara-philosophy-container { padding: 8px 6px 40px 6px; }
            .vphilo-tab-btn { padding: 9px 6px; font-size: 13.5px; }
            .vphilo-page-title { font-size: 20px; }
            .vphilo-card-header { padding: 12px 14px; }
            .vphilo-card-body { padding: 14px 14px; }
            .vphilo-card-title { font-size: 15px; }
            .vphilo-p { text-align: left; }
            .vphilo-closing-p { text-align: left; }
        }
    </style>

    <!-- Language Tabs Bar -->
    <div class="vphilo-tab-wrapper">
        <button class="vphilo-tab-btn active" data-tab-target="VPhiloEnglish">English</button>
        <button class="vphilo-tab-btn" data-tab-target="VPhiloKannada">ಕನ್ನಡ</button>
        <button class="vphilo-tab-btn" data-tab-target="VPhiloTelugu">తెలుగు</button>
    </div>

    <!-- English Content Tab (Default Active) -->
${renderLangTab('en', true)}

    <!-- Kannada Content Tab -->
${renderLangTab('kn', false)}

    <!-- Telugu Content Tab -->
${renderLangTab('te', false)}

    <script>
        (function() {
            var currentFontSize = 16;
            var container = document.getElementById("vaiswanara-philosophy-container");
            if (!container) return;

            // Global tab switcher function
            window.vphiloOpenLang = function(tabId, btnEl) {
                var allTabs = container.querySelectorAll(".vphilo-tab-content");
                allTabs.forEach(function(tab) {
                    tab.classList.remove("active");
                });
                var allBtns = container.querySelectorAll(".vphilo-tab-btn");
                allBtns.forEach(function(b) {
                    b.classList.remove("active");
                });

                var target = document.getElementById(tabId);
                if (target) target.classList.add("active");
                if (btnEl) btnEl.classList.add("active");
            };

            // Global accordion toggle function
            window.vphiloToggle = function(cardId) {
                var card = document.getElementById(cardId);
                if (!card) return;
                var parentTab = card.closest(".vphilo-tab-content");
                var isOpening = card.classList.contains("is-collapsed");

                // Collapse all cards in this tab
                if (parentTab) {
                    var tabCards = parentTab.querySelectorAll(".vphilo-card");
                    tabCards.forEach(function(c) {
                        c.classList.remove("is-expanded");
                        c.classList.add("is-collapsed");
                    });
                }

                // If it was collapsed, expand it
                if (isOpening) {
                    card.classList.remove("is-collapsed");
                    card.classList.add("is-expanded");

                    setTimeout(function() {
                        var topOffset = 80;
                        var elemRect = card.getBoundingClientRect().top;
                        var offsetPos = elemRect + window.pageYOffset - topOffset;
                        window.scrollTo({ top: Math.max(0, offsetPos), behavior: "smooth" });
                    }, 80);
                }
            };

            // Global font size adjustment
            window.vphiloAdjustFont = function(delta) {
                currentFontSize += delta;
                if (currentFontSize < 13) currentFontSize = 13;
                if (currentFontSize > 24) currentFontSize = 24;

                var cardBodies = container.querySelectorAll(".vphilo-card-body");
                cardBodies.forEach(function(el) {
                    el.style.fontSize = currentFontSize + "px";
                });
                var closingBodies = container.querySelectorAll(".vphilo-closing-card");
                closingBodies.forEach(function(el) {
                    el.style.fontSize = currentFontSize + "px";
                });
            };

            // Event Delegation on container (100% reliable even if inline onclick is stripped by WordPress)
            container.addEventListener("click", function(e) {
                // Tab button click
                var tabBtn = e.target.closest(".vphilo-tab-btn");
                if (tabBtn) {
                    var targetId = tabBtn.getAttribute("data-tab-target");
                    if (targetId) {
                        window.vphiloOpenLang(targetId, tabBtn);
                        return;
                    }
                }

                // Copy button click
                var copyBtn = e.target.closest(".vphilo-copy-btn");
                if (copyBtn) {
                    e.stopPropagation();
                    var cardEl = copyBtn.closest(".vphilo-card");
                    if (cardEl) {
                        var titleEl = cardEl.querySelector(".vphilo-card-title");
                        var bodyEl = cardEl.querySelector(".vphilo-card-body");
                        var tText = titleEl ? titleEl.innerText : "";
                        var bText = bodyEl ? bodyEl.innerText : "";
                        var fullText = tText + "\\n\\n" + bText + "\\n\\n— Srikanth Dharmavaram (https://vaiswanara.com)";
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(fullText).then(function() {
                                copyBtn.innerText = "✔️";
                                setTimeout(function() { copyBtn.innerText = "📋"; }, 2000);
                            });
                        }
                    }
                    return;
                }

                // Font size buttons
                var fontDec = e.target.closest(".font-dec");
                if (fontDec) {
                    window.vphiloAdjustFont(-1);
                    return;
                }
                var fontInc = e.target.closest(".font-inc");
                if (fontInc) {
                    window.vphiloAdjustFont(1);
                    return;
                }

                // Card header click (accordion toggle)
                var header = e.target.closest(".vphilo-card-header");
                if (header) {
                    var cId = header.getAttribute("data-toggle");
                    if (cId) {
                        window.vphiloToggle(cId);
                        return;
                    }
                }
            });
        })();
    </script>
</div>`;

fs.writeFileSync('./temp/wordpress_philosophy_code.html', fullHtml, 'utf8');
console.log("Successfully generated temp/wordpress_philosophy_code.html with Event Delegation, size:", fullHtml.length, "bytes");
