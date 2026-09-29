const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('=== APPLYING HIT FLASH FIX, PAUSE MENU REDESIGN & COMBAT DECLUTTER ===');

// =========================================================================
// 1. ELIMINATE WHITE SQUARE ON BOSS / GOLEM HIT (drawBiomeBoss)
// =========================================================================
const oldBossFlash = `    // Fast GPU Hit Flash without offscreen buffer filter lag
    if (en.flashT > 0 || (en.invuln && en.invuln > 0)) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = (en.type === 'boss') ? (en.flashT % 2 === 0 ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 215, 64, 0.85)') : 'rgba(255, 255, 255, 0.65)';
      ctx.fillRect(Math.round(drawX), Math.round(drawY), Math.round(scaleW), Math.round(scaleH));
      ctx.restore();
    }`;

const newBossFlash = `    // Organic Hit Impact: Zero opaque white squares or blocking rectangles
    if (en.flashT > 0 || (en.invuln && en.invuln > 0)) {
      ctx.save();
      const flashAlpha = Math.min(0.75, (en.flashT || 4) * 0.12);
      ctx.strokeStyle = (en.flashT % 2 === 0) ? \`rgba(255, 255, 255, \${flashAlpha})\` : \`rgba(254, 240, 138, \${flashAlpha})\`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -scaleH * 0.42, r * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }`;

if (html.includes(oldBossFlash)) {
  html = html.replace(oldBossFlash, newBossFlash);
  console.log('1. Replaced broken boss fillRect hit flash with organic glowing rim arc.');
} else {
  console.error('Could not find oldBossFlash in index.html!');
}

// =========================================================================
// 2. ELIMINATE WHITE DISK OVER ENEMIES / GOLEM IN render()
// =========================================================================
const oldRenderFlash = `    if (en.flashT > 0) {
      en.flashT--;
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 0; /* 60fps */
      ctx.beginPath();
      ctx.arc(en.x, cy, en.r + (en.type === 'boss' ? 4 : 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }`;

const newRenderFlash = `    if (en.flashT > 0) {
      en.flashT--;
      // Subtle, clean rim-glow feedback (NO opaque white fill blocking pixel art)
      ctx.save();
      const flashAlpha = Math.min(0.65, en.flashT * 0.12);
      ctx.strokeStyle = (en.flashT % 2 === 0) ? \`rgba(255, 255, 255, \${flashAlpha})\` : \`rgba(254, 240, 138, \${flashAlpha})\`;
      ctx.lineWidth = en.type === 'boss' ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(en.x, cy, en.r + (en.type === 'boss' ? 3 : 1.5), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }`;

if (html.includes(oldRenderFlash)) {
  html = html.replace(oldRenderFlash, newRenderFlash);
  console.log('2. Removed solid white circle fill in render(), replaced with crisp rim stroke.');
} else {
  console.error('Could not find oldRenderFlash in index.html!');
}

// =========================================================================
// 3. OVERHAUL PAUSE OVERLAY (CLEAN, MODERN, FROSTED GLASS MODAL)
// =========================================================================
const pauseStart = html.indexOf('<div id="pauseOverlay" class="overlay pause-ov">');
const pauseEnd = html.indexOf('<div id="continueOverlay"', pauseStart);

if (pauseStart !== -1 && pauseEnd !== -1) {
  const newPauseHtml = `<div id="pauseOverlay" class="overlay pause-ov">
      <div class="pause-modal-card">
        <!-- 1. Header with Pause Icon -->
        <div class="pause-card-header">
          <div class="pause-header-badge"><span class="px-icon px-pause"></span></div>
          <h2>OYUN DURDURULDU</h2>
        </div>

        <!-- 2. Clean 3-Metric Bar (Dalga, Puan, Kristal) -->
        <div class="pause-metrics-row">
          <div class="pause-metric-item">
            <span class="pmetric-lbl">DALGA</span>
            <span class="pmetric-val" id="pauseWave">1</span>
          </div>
          <div class="pause-metric-item">
            <span class="pmetric-lbl">PUAN</span>
            <span class="pmetric-val" id="pauseScore">0</span>
          </div>
          <div class="pause-metric-item">
            <span class="pmetric-lbl">KRİSTAL</span>
            <span class="pmetric-val" id="pauseCrystals"><span class="px-icon px-gem px-anim-shimmer"></span> 0</span>
          </div>
        </div>

        <!-- 3. Active Elements & Artifacts Compact Pill Strip -->
        <div class="pause-compact-loadout">
          <div class="loadout-title">KUŞANILAN GÜÇLER</div>
          <div class="pause-loadout-chips" id="pauseRelicChips">
            <!-- Render active elements as glowing compact badges -->
          </div>
        </div>

        <!-- 4. Quick Audio & Haptic Toggle Pill -->
        <div class="pause-quick-settings">
          <button type="button" class="pause-setting-toggle" id="sfxPauseBtn" aria-label="Ses">
            <span class="px-icon px-sound"></span> SES
          </button>
          <button type="button" class="pause-setting-toggle" id="vibPauseBtn" aria-label="Titreşim">
            <span class="px-icon px-haptic"></span> TİTREŞİM
          </button>
        </div>

        <!-- 5. Big Clear Primary Actions -->
        <div class="pause-actions-stack">
          <button class="btn btn-pause-resume" id="resumeBtn" type="button">
            <span class="px-icon px-play"></span> SAVAŞA DEVAM ET
          </button>
          <button class="btn btn-pause-restart" id="restartFromPauseBtn" type="button">
            <span class="px-icon px-respec"></span> YENİDEN BAŞLA
          </button>
          <button class="btn btn-pause-menu" id="menuFromPauseBtn" type="button">
            <span class="px-icon px-shrine"></span> ANA MENÜYE DÖN
          </button>
        </div>
      </div>
    </div>\n\n    `;

  html = html.slice(0, pauseStart) + newPauseHtml + html.slice(pauseEnd);
  console.log('3. Replaced pauseOverlay with clean, modern, centered frosted glass card.');
}

// =========================================================================
// 4. ADD MODERN PAUSE CSS
// =========================================================================
const modernPauseCss = `
  /* Modern Compact Frosted Glass Pause Modal */
  .pause-ov {
    background: rgba(3, 7, 18, 0.85) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 16px !important;
    box-sizing: border-box;
  }
  .pause-modal-card {
    width: 100%;
    max-width: 360px;
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.98));
    border: 1.5px solid rgba(255, 215, 64, 0.25);
    border-radius: 20px;
    padding: 20px 18px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6), inset 0 0 16px rgba(255, 215, 64, 0.05);
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pause-card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .pause-header-badge {
    width: 32px;
    height: 32px;
    background: rgba(245, 158, 11, 0.2);
    border: 1px solid #ffd740;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pause-card-header h2 {
    font-size: 17px;
    font-weight: 900;
    color: #f8fafc;
    letter-spacing: 0.05em;
    margin: 0;
  }
  .pause-metrics-row {
    display: flex;
    justify-content: space-around;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 10px 8px;
  }
  .pause-metric-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .pmetric-lbl {
    font-size: 10px;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.08em;
  }
  .pmetric-val {
    font-size: 15px;
    font-weight: 900;
    color: #ffd740;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .pause-compact-loadout {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 8px 10px;
    text-align: left;
  }
  .loadout-title {
    font-size: 10px;
    font-weight: 800;
    color: #c084fc;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .pause-loadout-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 80px;
    overflow-y: auto;
  }
  .pause-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  .pause-quick-settings {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  .pause-setting-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
  .pause-setting-toggle:active {
    background: rgba(245, 158, 11, 0.25);
    border-color: #ffd740;
  }
  .pause-actions-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
  }
  .btn-pause-resume {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    border: none;
    border-radius: 12px;
    color: #0b1120 !important;
    font-size: 14px !important;
    font-weight: 900 !important;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-pause-resume:active { transform: scale(0.96); }
  .btn-pause-restart {
    width: 100%;
    padding: 10px;
    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(251, 146, 60, 0.4) !important;
    border-radius: 10px;
    color: #fdba74 !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .btn-pause-restart:active { transform: scale(0.96); }
  .btn-pause-menu {
    width: 100%;
    padding: 10px;
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 10px;
    color: #94a3b8 !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .btn-pause-menu:active { transform: scale(0.96); background: rgba(255, 255, 255, 0.04); }
`;

const styleClose = html.indexOf('</style>');
if (styleClose !== -1) {
  html = html.slice(0, styleClose) + '\n' + modernPauseCss + '\n' + html.slice(styleClose);
  console.log('4. Injected modern pause overlay CSS.');
}

// =========================================================================
// 5. UPDATE renderPauseInventory() JAVASCRIPT
// =========================================================================
const renderPauseStart = html.indexOf('function renderPauseInventory() {');
const renderPauseEnd = html.indexOf('// =========================================================================\n// ELEMENTER: 22 MASTER ÖZELLİK', renderPauseStart);

if (renderPauseStart !== -1 && renderPauseEnd !== -1) {
  const newRenderPauseCode = `function renderPauseInventory() {
  const pWave = document.getElementById('pauseWave');
  if (pWave) pWave.textContent = 'Dalga ' + (wave || 1);
  const pScore = document.getElementById('pauseScore');
  if (pScore) pScore.textContent = Number(score || 0).toLocaleString();
  const pCryst = document.getElementById('pauseCrystals');
  if (pCryst) pCryst.innerHTML = renderPixelIcon('gem', 'px-anim-shimmer', 14) + ' ' + (runCrystals || 0);

  // Compact loadout chips (Elements & Relics)
  const chipsEl = document.getElementById('pauseRelicChips');
  if (chipsEl) {
    let chipsHtml = '';
    // 1. Equipped Elements
    if (typeof pickHistory !== 'undefined' && pickHistory.length > 0) {
      pickHistory.forEach(elKey => {
        const elObj = ELEMENTS[elKey];
        if (elObj) {
          chipsHtml += '<span class="pause-chip elem" style="border-color:' + elObj.color + '; color:' + elObj.color + '">' +
            renderPixelIcon(elObj.emoji || elKey, '', 14) + ' ' + elObj.name +
          '</span>';
        }
      });
    }
    // 2. Active Relic Mods
    if (typeof MOD_POOL !== 'undefined') {
      const activeMods = MOD_POOL.filter(m => (typeof modLv === 'function' ? modLv(m.id) : 0) > 0);
      activeMods.forEach(m => {
        chipsHtml += '<span class="pause-chip relic">' +
          renderPixelIcon(m.id || m.emoji, '', 14) + ' ' + m.name +
        '</span>';
      });
    }
    chipsEl.innerHTML = chipsHtml || '<span style="font-size:11px;color:#64748b;font-style:italic;">Henüz bir güç kuşanılmadı.</span>';
  }
}\n\n`;

  html = html.slice(0, renderPauseStart) + newRenderPauseCode + html.slice(renderPauseEnd);
  console.log('5. Updated renderPauseInventory() to match modern pause card.');
}

// =========================================================================
// 6. COMBAT DECLUTTER: REMOVE FLOATING "SÖZLEŞME" & "ELEMENT (1/6)" ON PLAYER
// =========================================================================
const oldPactFloat = `  if (pactEl && ELEMENTS[pactEl]) {
    spawnFloatText(player.x, player.y - 44, 'Sözleşme: ' + ELEMENTS[pactEl].name + ' x2 → Boss x1.5', ELEMENTS[pactEl].color);
  }`;
const newPactFloat = `  // Removed floating pact text to keep player combat field clean and uncluttered`;

if (html.includes(oldPactFloat)) {
  html = html.replace(oldPactFloat, newPactFloat);
  console.log('6. Removed intrusive "Sözleşme" text from battlefield.');
}

const oldPickFloat = `spawnFloatText(player.x, player.y - 28, e.name + ' (' + pickHistory.length + '/6)', e.color);`;
const newPickFloat = `// Removed floating element name on player to maintain combat visual clarity`;

if (html.includes(oldPickFloat)) {
  html = html.replace(oldPickFloat, newPickFloat);
  console.log('7. Removed intrusive "Element (1/6)" text from battlefield.');
}

// =========================================================================
// 7. COMBAT DECLUTTER: SHORTEN DEDE KORKUT BANNER & HIDE QUEST HUD IN RUN
// =========================================================================
const oldDedeTimer = `banner.classList.remove('show');
  }, 4800);`;
const newDedeTimer = `banner.classList.remove('show');
  }, 2200);`;

if (html.includes(oldDedeTimer)) {
  html = html.replace(oldDedeTimer, newDedeTimer);
  console.log('8. Shortened Dede Korkut banner display to 2.2s so it does not block the combat view.');
}

// Hide questHud and devJumpBtn in CSS during combat to eliminate visual clutter
const declutterCss = `
  #questHud {
    display: none !important; /* Visual declutter: keeps upper combat area crystal clear */
  }
  .dede-korkut-banner {
    top: max(8px, env(safe-area-inset-top, 0px)) !important;
    padding: 6px 12px !important;
    max-width: 320px !important;
  }
  .dede-korkut-name {
    font-size: 11px !important;
  }
  .dede-korkut-text {
    font-size: 11px !important;
    line-height: 1.25 !important;
  }
`;

const styleCloseAgain = html.indexOf('</style>');
if (styleCloseAgain !== -1) {
  html = html.slice(0, styleCloseAgain) + '\n' + declutterCss + '\n' + html.slice(styleCloseAgain);
  console.log('9. Injected combat declutter CSS.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('=== FIXES & POLISH SUCCESSFULLY APPLIED ===');
