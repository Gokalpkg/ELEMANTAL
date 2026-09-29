const fs = require('fs');
const path = require('path');

console.log('=== APPLYING CLASH ROYALE 3-TAB MENU & ZEN ARKA PLAN SYSTEM ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// 1. ZEN ARKA PLAN: CREATEBIOMEFLOORCANVAS & DRAWPARALLAXATMOSPHERE
// =========================================================================
console.log('[1] Overhauling floor canvas rendering to tranquil Zen Pixel Art...');

// Locate createBiomeFloorCanvas function
const oldCreateFloorCanvasStart = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const c = cv.getContext('2d');
  const bk = biomeKey || 'stone';`;

const newCreateFloorCanvas = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const c = cv.getContext('2d');
  const bk = biomeKey || 'stone';

  // =========================================================================
  // ZEN HARMONIC PIXEL GROUND (Zero Distracting Lines, Pure Cohesive Art)
  // =========================================================================
  const PALETTES = {
    stone:   { base: '#101522', shade: '#161d2e', accent: '#0c101b' },
    forest:  { base: '#071f14', shade: '#0b2b1c', accent: '#05160e' },
    water:   { base: '#071828', shade: '#0b2238', accent: '#05111d' },
    ice:     { base: '#081d2e', shade: '#0d273d', accent: '#051421' },
    sand:    { base: '#22180d', shade: '#2a1f12', accent: '#1a1208' },
    lava:    { base: '#180e0c', shade: '#201411', accent: '#120908' },
    storm:   { base: '#111024', shade: '#171630', accent: '#0c0b1a' },
    night:   { base: '#0c0a18', shade: '#120f22', accent: '#080611' },
    pink:    { base: '#1f0f1a', shade: '#281522', accent: '#170a13' },
    ketchup: { base: '#1c0a0d', shade: '#240e12', accent: '#140608' }
  };

  const pal = PALETTES[bk] || PALETTES.stone;

  // 1. Base Uniform Tone
  c.fillStyle = pal.base;
  c.fillRect(0, 0, 256, 256);

  // 2. Subtle, Peaceful Organic Pixel Cobble / Soil Grid (32x32 blocks with gentle ±2% variation)
  for (let y = 0; y < 256; y += 32) {
    for (let x = 0; x < 256; x += 32) {
      const seed = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      if (seed > 0.45) {
        c.fillStyle = pal.shade;
        c.fillRect(x + 2, y + 2, 28, 28);
      } else if (seed < -0.35) {
        c.fillStyle = pal.accent;
        c.fillRect(x + 2, y + 2, 28, 28);
      }
    }
  }

  // 3. Gentle Micro-Noise for Textured Pixel Depth (No harsh vectors, no lines)
  for (let i = 0; i < 90; i++) {
    const rx = ((i * 37) % 256);
    const ry = ((i * 73) % 256);
    c.fillStyle = (i % 2 === 0) ? pal.shade : pal.accent;
    c.fillRect(rx, ry, 3, 3);
  }

  return cv;
}`;

// Find start and end of createBiomeFloorCanvas
const floorIdx = content.indexOf('function createBiomeFloorCanvas(biomeKey, visualMode) {');
const nextFuncIdx = content.indexOf('function getFloorPattern(biomeKey, visualMode) {');

if (floorIdx !== -1 && nextFuncIdx !== -1) {
  content = content.slice(0, floorIdx) + newCreateFloorCanvas + '\n\n' + content.slice(nextFuncIdx);
  console.log('  -> createBiomeFloorCanvas replaced with tranquil Zen Pixel Art.');
} else {
  console.error('  -> Could not locate createBiomeFloorCanvas bounds!');
}

// 2. PARALLAX ATMOSPHERE: REMOVE 18 GIANT DRIFTING BALLS
console.log('[2] Calming Parallax Atmosphere (Eliminating distracting floating balls)...');
const oldParallaxBalls = `  const count = 18;
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const ax = cam.x + ((Math.sin(seed + drift * 0.02) * 0.5 + 0.5) * W * 1.2 - W * 0.1) - paraX * 0.15;
    const ay = cam.y + ((Math.cos(seed * 0.8 + drift * 0.015) * 0.5 + 0.5) * H * 1.2 - H * 0.1) - paraY * 0.15;
    const pSize = 3 + (i % 3) * 2;
    const pAlpha = 0.18 + Math.sin(time * 0.05 + i) * 0.08;

    ctx.fillStyle = bk === 'lava' ? '#ff5722' : bk === 'ice' ? '#80deea' : bk === 'forest' ? '#69f0ae' : bk === 'night' ? '#c084fc' : '#e2e8f0';
    ctx.globalAlpha = pAlpha;
    ctx.beginPath();
    ctx.arc(ax, ay, pSize, 0, Math.PI * 2);
    ctx.fill();
  }`;

const newParallaxBalls = `  // CALM ZEN ATMOSPHERE: Oversized floating balls removed to keep combat field 100% readable.`;

if (content.includes(oldParallaxBalls)) {
  content = content.replace(oldParallaxBalls, newParallaxBalls);
  console.log('  -> Parallax floating balls removed successfully.');
}

// 3. COMBAT HUD: HIDE STANCE FAB
console.log('[3] Hiding Stance FAB to declutter combat screen...');
content = content.replace(
  `.stance-fab {`,
  `.stance-fab { display: none !important;`
);

// =========================================================================
// 4. CLASH ROYALE STYLE 3-SCREEN HORIZONTAL MAIN MENU
// =========================================================================
console.log('[4] Injecting Clash Royale 3-Screen Layout HTML & CSS...');

const clashMenuHtml = `
    <!-- CLASH ROYALE STYLE 3-SCREEN HORIZONTAL MENU -->
    <div id="startOverlay" class="overlay show clash-menu-overlay">
      <!-- 1. Top Persistent Brand & Metric Bar -->
      <header class="clash-top-bar">
        <div class="clash-brand">
          <span class="px-icon px-lightning px-anim-zap" style="width:22px;height:22px;"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span>
          <span class="clash-brand-name">ELEMENTER</span>
        </div>
        <div class="clash-top-right">
          <div class="clash-stat-pill">
            <span class="px-icon px-trophy px-anim-glow"></span>
            <span id="bestLabel">Rekor —</span>
            <span class="stat-dot">·</span>
            <span id="crystalBank"><span class="px-icon px-gem px-anim-shimmer"></span> 0</span>
          </div>
          <button type="button" class="clash-btn-kut" id="achHeaderBtn" aria-label="Kut Başarımları">
            <span class="px-icon px-trophy px-anim-glow"></span> KUT
          </button>
          <button type="button" class="clash-btn-gear" id="settingsFromStartBtn" aria-label="Ayarlar">
            <span class="px-icon px-gear px-anim-spin" style="width:18px;height:18px;"></span>
          </button>
        </div>
      </header>

      <!-- 2. Horizontal Paging Viewport -->
      <div class="clash-viewport" id="clashViewport">
        <div class="clash-track" id="clashTrack">

          <!-- TAB 0: SAVAŞÇILAR (HEROES ROSTER) -->
          <section class="clash-page" id="clashPageHeroes">
            <div class="clash-page-header">
              <h2><span class="px-icon px-heroes"></span> SAVAŞÇILAR</h2>
              <p>Yöneteceğin Türk Alpini seç ve gücünü kuşan</p>
            </div>
            <div class="clash-heroes-scroll">
              <div class="hero-roster-grid" id="heroRosterGrid">
                <!-- Populated dynamically by renderHeroRosterCards() -->
              </div>
            </div>
          </section>

          <!-- TAB 1: SAVAŞ (BATTLE HUB - DEFAULT) -->
          <section class="clash-page active" id="clashPageBattle">
            <div class="battle-hub-content">
              <!-- Selected Hero Floating Pedestal -->
              <div class="battle-stage-wrap">
                <div class="hero-stage-aura" id="heroStageAura"></div>
                <div class="pedestal-disc active"></div>
                <canvas id="mainHeroPreviewCanvas" width="112" height="112" class="main-hero-canvas"></canvas>
                <div class="battle-elem-badge" id="heroElemIndicator"><span class="px-icon px-wind"></span> RÜZGAR</div>
              </div>

              <!-- Hero Info Title -->
              <div class="battle-hero-text">
                <div class="battle-hero-title-row">
                  <span class="battle-hero-name" id="heroCardTitle">BAMSI</span>
                  <span class="battle-hero-tag" id="heroRolePill">HIZLI YAKIN DÖVÜŞ</span>
                </div>
                <div class="battle-hero-sub" id="heroCardSub">Yelin ve Ruhun Kılıcı</div>
                <div class="battle-hero-quote" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</div>
              </div>

              <!-- Action Core: Big Play & Daily -->
              <div class="battle-action-core">
                <button class="btn btn-main-play pulse-action" id="startBtn" type="button">
                  <span class="play-icon-glow"><span class="px-icon px-play"></span></span> SAVAŞA BAŞLA
                </button>
                <button class="btn btn-daily-sub" id="dailyBtn" type="button">
                  <span class="px-icon px-sun px-anim-spin"></span> GÜNLÜK RUN
                </button>
                <button class="btn btn-main-play" id="resumeRunBtn" type="button" style="display:none; background:linear-gradient(135deg, #10b981, #059669) !important;">
                  <span><span class="px-icon px-swords"></span> SAVAŞA DEVAM ET</span>
                </button>
                <button class="btn btn-dev-sub" id="devStartBtn" type="button" style="display:none;">
                  BÖLÜM SEÇİCİ
                </button>
                <div id="metaGoal" class="menu-goal-pill" style="display:none;"></div>
                <div id="dailyPill" class="menu-goal-pill" style="display:none;"></div>
              </div>
            </div>
          </section>

          <!-- TAB 2: GÜÇLER & KADİM SUNAK -->
          <section class="clash-page" id="clashPageShrine">
            <div class="clash-page-header">
              <h2><span class="px-icon px-shrine"></span> GÜÇLER & KADİM SUNAK</h2>
              <p>Kalıcı güçlendirmeler ve element sırları</p>
            </div>
            
            <div class="clash-shrine-tabs">
              <button type="button" class="clash-sub-tab active" id="subTabTreeBtn">Kadim Sunak</button>
              <button type="button" class="clash-sub-tab" id="subTabGuideBtn">Sır Kodeksi</button>
            </div>

            <div class="clash-sub-content" id="clashTreePane">
              <div class="tree-list" id="treeList">
                <!-- Populated dynamically by fillTreePanel() -->
              </div>
              <div style="text-align:center; padding: 14px 0 8px;">
                <button class="btn btn-tree-respec" id="treeRespecBtn" type="button">
                  <span class="px-icon px-respec"></span> KRİSTALLERİ SIFIRLA (%100 İADE)
                </button>
              </div>
            </div>

            <div class="clash-sub-content" id="clashGuidePane" style="display:none;">
              <div class="clash-codex-box">
                <div class="codex-h"><span class="px-icon px-scroll"></span> SÜPER EVRİM REHBERİ</div>
                <p class="codex-p">İki uyumlu elementi birleştirip seviye atladığında silahın Süper Evrim kazanır:</p>
                <div class="codex-entry">
                  <b style="color:#fde047;"><span class="px-icon px-star"></span> GÜNEŞ ALEVİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-fire"></span> Ateş + <span class="px-icon px-nature"></span> Doğa</span>
                </div>
                <div class="codex-entry">
                  <b style="color:#38bdf8;"><span class="px-icon px-star"></span> MUTLAK SÜPERİLETKEN</b>: <span style="color:#94a3b8;"><span class="px-icon px-water"></span> Su + <span class="px-icon px-lightning"></span> Yıldırım</span>
                </div>
                <div class="codex-entry">
                  <b style="color:#fb923c;"><span class="px-icon px-star"></span> GÖKTAŞI KIYAMETİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-shield"></span> Toprak + <span class="px-icon px-fire"></span> Ateş</span>
                </div>
                <div class="codex-entry">
                  <b style="color:#c084fc;"><span class="px-icon px-star"></span> KARA DELİK VORTEKSİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-moon"></span> Boşluk + <span class="px-icon px-water"></span> Su</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <!-- 3. Fixed Bottom 3-Tab Dock (Clash Royale Style) -->
      <nav class="clash-bottom-dock" aria-label="Ana Menü Sekmeleri">
        <button type="button" class="clash-dock-btn" id="dockBtnHeroes" data-page="0">
          <span class="dock-btn-icon"><span class="px-icon px-heroes"></span></span>
          <span class="dock-btn-txt">SAVAŞÇILAR</span>
        </button>
        <button type="button" class="clash-dock-btn active" id="dockBtnBattle" data-page="1">
          <span class="dock-btn-icon"><span class="px-icon px-swords"></span></span>
          <span class="dock-btn-txt">SAVAŞ</span>
        </button>
        <button type="button" class="clash-dock-btn" id="dockBtnShrine" data-page="2">
          <span class="dock-btn-icon"><span class="px-icon px-shrine"></span></span>
          <span class="dock-btn-txt">GÜÇLER</span>
        </button>
      </nav>
    </div>
`;

// Replace startOverlay in HTML
const startOverlayStart = content.indexOf('<div id="startOverlay"');
const startOverlayEnd = content.indexOf('<!-- ACHIEVEMENTS MODAL (Item 9) -->');

if (startOverlayStart !== -1 && startOverlayEnd !== -1) {
  content = content.slice(0, startOverlayStart) + clashMenuHtml + '\n' + content.slice(startOverlayEnd);
  console.log('  -> startOverlay replaced with Clash Royale 3-Screen HTML structure.');
} else {
  console.error('  -> Could not find startOverlay bounds!');
}

// Add Clash Royale CSS
const clashCss = `
/* ========================================================================= */
/* CLASH ROYALE STYLE 3-SCREEN HORIZONTAL VIEWPORT & DOCK CSS                */
/* ========================================================================= */
.clash-menu-overlay {
  position: absolute;
  inset: 0;
  display: flex !important;
  flex-direction: column;
  background: radial-gradient(circle at 50% 25%, #151b2b 0%, #080b13 100%) !important;
  overflow: hidden !important;
  z-index: 100;
  user-select: none;
  padding: 0 !important;
}

.clash-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  height: 50px;
  flex-shrink: 0;
  background: rgba(10, 14, 24, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  z-index: 20;
}

.clash-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clash-brand-name {
  font-size: 15px;
  font-weight: 900;
  color: #fbbf24;
  letter-spacing: 1px;
}

.clash-top-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clash-stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: #e2e8f0;
}

.clash-btn-kut {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(202, 138, 4, 0.15));
  border: 1px solid #facc15;
  color: #fde047;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.clash-btn-gear {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
}

/* 3-Screen Viewport & Track */
.clash-viewport {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.clash-track {
  display: flex;
  width: 300%;
  height: 100%;
  transform: translateX(-33.333333%); /* Default to Center Battle */
  transition: transform 0.36s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.clash-page {
  width: 33.333333%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 14px 76px 14px; /* Space for bottom dock */
}

.clash-page-header {
  text-align: center;
  margin-bottom: 12px;
}

.clash-page-header h2 {
  font-size: 16px;
  font-weight: 900;
  color: #f8fafc;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.clash-page-header p {
  font-size: 11px;
  color: #94a3b8;
  margin: 3px 0 0;
}

/* Battle Hub (Center Screen) */
.battle-hub-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
}

.battle-stage-wrap {
  position: relative;
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.battle-elem-badge {
  position: absolute;
  bottom: -6px;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid #38bdf8;
  color: #38bdf8;
  font-size: 10px;
  font-weight: 800;
  border-radius: 12px;
  padding: 2px 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  gap: 4px;
}

.battle-hero-text {
  text-align: center;
  margin: 10px 0;
}

.battle-hero-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.battle-hero-name {
  font-size: 20px;
  font-weight: 900;
  color: #f8fafc;
  letter-spacing: 1px;
}

.battle-hero-tag {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid #38bdf8;
  color: #38bdf8;
  border-radius: 6px;
}

.battle-hero-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.battle-hero-quote {
  font-size: 11px;
  font-style: italic;
  color: #fef08a;
  margin-top: 4px;
  opacity: 0.9;
}

.battle-action-core {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Heroes Screen (Left) */
.clash-heroes-scroll {
  flex: 1;
  overflow-y: auto;
}

/* Shrine & Codex Screen (Right) */
.clash-shrine-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  background: rgba(0,0,0,0.3);
  padding: 4px;
  border-radius: 12px;
}

.clash-sub-tab {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.clash-sub-tab.active {
  background: #f59e0b;
  color: #0f172a;
}

.clash-codex-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
}

.codex-h {
  font-size: 13px;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.codex-p {
  font-size: 11px;
  color: #cbd5e1;
  margin: 0 0 10px;
  line-height: 1.4;
}

.codex-entry {
  background: rgba(255,255,255,0.04);
  border-left: 3px solid #38bdf8;
  padding: 6px 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 11px;
}

/* Fixed Bottom Dock */
.clash-bottom-dock {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(10, 14, 26, 0.96);
  border-top: 1.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.6);
  z-index: 25;
  padding-bottom: env(safe-area-inset-bottom, 4px);
}

.clash-dock-btn {
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.22s ease;
  position: relative;
}

.clash-dock-btn.active {
  color: #fbbf24;
}

.clash-dock-btn.active::after {
  content: '';
  position: absolute;
  top: 0;
  width: 44px;
  height: 3px;
  background: #f59e0b;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 2px 8px #f59e0b;
}

.dock-btn-icon {
  font-size: 18px;
}

.dock-btn-txt {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
`;

content = content.replace('/* Dede Korkut Prophetic Banner (Pillar 3) */', clashCss + '\n/* Dede Korkut Prophetic Banner (Pillar 3) */');

// =========================================================================
// 5. CLASH NAVIGATION JS ENGINE & SWIPE GESTURES
// =========================================================================
console.log('[5] Injecting Clash Navigation JS Engine & Touch Swipe handlers...');

const clashNavJs = `
// =========================================================================
// CLASH ROYALE 3-SCREEN HORIZONTAL SWIPE & NAVIGATION ENGINE
// =========================================================================
let curClashPage = 1; // 0: Heroes | 1: Battle (Default) | 2: Shrine/Powers

function setClashPage(pageIndex, animate = true) {
  curClashPage = Math.max(0, Math.min(2, pageIndex));
  const track = document.getElementById('clashTrack');
  if (track) {
    track.style.transition = animate ? 'transform 0.36s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    track.style.transform = 'translateX(-' + (curClashPage * 33.333333) + '%)';
  }

  // Update Bottom Dock Active State
  const dockBtns = [
    document.getElementById('dockBtnHeroes'),
    document.getElementById('dockBtnBattle'),
    document.getElementById('dockBtnShrine')
  ];
  dockBtns.forEach((btn, idx) => {
    if (btn) btn.classList.toggle('active', idx === curClashPage);
  });

  // Populate dynamic data on entering page
  if (curClashPage === 0) {
    if (typeof renderHeroRosterCards === 'function') renderHeroRosterCards();
  } else if (curClashPage === 1) {
    if (typeof updateHeroShowcase === 'function') updateHeroShowcase();
  } else if (curClashPage === 2) {
    if (typeof fillTreePanel === 'function') fillTreePanel();
  }
}

function initClashNavigation() {
  // Bind Bottom Dock Tabs
  const bHeroes = document.getElementById('dockBtnHeroes');
  const bBattle = document.getElementById('dockBtnBattle');
  const bShrine = document.getElementById('dockBtnShrine');
  if (bHeroes) bindTouchButton(bHeroes, () => setClashPage(0));
  if (bBattle) bindTouchButton(bBattle, () => setClashPage(1));
  if (bShrine) bindTouchButton(bShrine, () => setClashPage(2));

  // Bind Shrine Sub-Tabs (Tree vs Codex)
  const tabTree = document.getElementById('subTabTreeBtn');
  const tabGuide = document.getElementById('subTabGuideBtn');
  const paneTree = document.getElementById('clashTreePane');
  const paneGuide = document.getElementById('clashGuidePane');
  if (tabTree && tabGuide && paneTree && paneGuide) {
    bindTouchButton(tabTree, () => {
      tabTree.classList.add('active'); tabGuide.classList.remove('active');
      paneTree.style.display = 'block'; paneGuide.style.display = 'none';
    });
    bindTouchButton(tabGuide, () => {
      tabGuide.classList.add('active'); tabTree.classList.remove('active');
      paneGuide.style.display = 'block'; paneTree.style.display = 'none';
    });
  }

  // Horizontal Swipe Detection on Viewport
  const vp = document.getElementById('clashViewport');
  if (vp) {
    let startX = 0;
    let startY = 0;
    let isTracking = false;

    vp.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isTracking = true;
    }, { passive: true });

    vp.addEventListener('touchend', (e) => {
      if (!isTracking || !e.changedTouches.length) return;
      isTracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // Only handle horizontal swipes (dx > 45px and predominantly horizontal)
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0 && curClashPage < 2) {
          // Swipe Left -> Next Page
          setClashPage(curClashPage + 1);
        } else if (dx > 0 && curClashPage > 0) {
          // Swipe Right -> Prev Page
          setClashPage(curClashPage - 1);
        }
      }
    }, { passive: true });
  }

  // Set default page
  setClashPage(1, false);
}
`;

content = content.replace('// --- GÖK TENGRİ & TÜRK MİTOLOJİSİ SES MOTORU', clashNavJs + '\n// --- GÖK TENGRİ & TÜRK MİTOLOJİSİ SES MOTORU');

// Call initClashNavigation in goMainMenu
content = content.replace(
  `document.getElementById('startOverlay').classList.add('show');`,
  `document.getElementById('startOverlay').classList.add('show');\n  if (typeof initClashNavigation === 'function') initClashNavigation();`
);

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== CLASH ROYALE & ZEN BACKGROUND INTEGRATION COMPLETE ===');
