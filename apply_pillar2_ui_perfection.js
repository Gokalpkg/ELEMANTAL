const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[Pillar 2 Overhaul] Starting. Original length:', content.length);

// =========================================================================
// 1. ADD CSS STYLES FOR SINGLE-SCREEN 100vh UI, DOCK, CAROUSEL & POLISHED OVERLAYS
// =========================================================================
const customPillar2Styles = `
/* =========================================================================
   PILLAR 2: MASTER UI/UX SINGLE-SCREEN (100vh) NINTENDO/APPLE ELEGANCE
   ========================================================================= */

/* Single Screen Main Menu Container */
#startOverlay.single-screen-menu {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  display: none;
  flex-direction: column !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: env(safe-area-inset-top, 10px) 14px env(safe-area-inset-bottom, 10px) 14px !important;
  box-sizing: border-box !important;
  background: radial-gradient(circle at 50% 25%, rgba(26, 20, 48, 0.95) 0%, rgba(8, 7, 16, 0.98) 100%) !important;
  z-index: 1000 !important;
}
#startOverlay.single-screen-menu.show {
  display: flex !important;
}

/* 1. Header Bar */
.menu-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 420px;
  padding: 4px 6px;
  box-sizing: border-box;
}
.menu-brand-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.menu-brand-icon {
  font-size: 22px;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
  animation: pulseBrandBolt 2s infinite ease-in-out;
}
@keyframes pulseBrandBolt {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
.menu-brand-titles {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.menu-brand-title {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 0.8px;
  margin: 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 40%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.menu-brand-sub {
  font-size: 9px;
  font-weight: 800;
  color: rgba(226, 232, 240, 0.6);
  letter-spacing: 1px;
}
.menu-top-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.menu-stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  color: #f8fafc;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
}
.menu-stat-pill .stat-icon { font-size: 12px; }
.menu-stat-pill .stat-dot { color: rgba(255, 255, 255, 0.3); font-size: 10px; }
.quick-lang-pill {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid #38bdf8;
  color: #38bdf8;
  font-size: 10.5px;
  font-weight: 900;
  padding: 5px 9px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.12s ease;
}
.quick-lang-pill:active { transform: scale(0.92); }

/* 2. Hero Showcase Section */
.hero-showcase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  flex: 1 1 auto;
  justify-content: center;
  gap: 8px;
  margin: 4px 0;
  min-height: 0;
}

/* 8 Mini Badges Row */
.hero-strip-mini {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  width: 100%;
}
.hero-mini-tab {
  background: rgba(15, 23, 42, 0.75);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px 1px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.15s ease;
}
.hero-mini-tab .mini-icon {
  font-size: 14px;
  line-height: 1;
}
.hero-mini-tab .mini-name {
  font-size: 8px;
  font-weight: 800;
  color: #94a3b8;
  white-space: nowrap;
  letter-spacing: 0.2px;
}
.hero-mini-tab.active {
  background: rgba(30, 41, 59, 0.95);
  border-color: var(--hero-accent, #38bdf8);
  box-shadow: 0 0 10px var(--hero-accent-alpha, rgba(56, 189, 248, 0.4));
  transform: translateY(-2px);
}
.hero-mini-tab.active .mini-name {
  color: #ffffff;
  font-weight: 900;
}

/* Main Hero Spotlight Card */
.hero-spotlight-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: rgba(12, 17, 32, 0.92);
  border: 1.5px solid var(--hero-accent, rgba(56, 189, 248, 0.5));
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: border-color 0.25s ease;
}
.hero-carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 48px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  color: #ffffff;
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.12s ease;
  user-select: none;
}
.hero-carousel-nav:active {
  transform: translateY(-50%) scale(0.9);
  background: rgba(30, 41, 59, 1);
}
.hero-carousel-nav.prev { left: -10px; }
.hero-carousel-nav.next { right: -10px; }

.hero-card-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 16px;
}
.hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero-name-h {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--hero-accent, #38bdf8);
}
.hero-selected-tag {
  font-size: 9px;
  font-weight: 900;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.18);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2px 7px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.hero-card-quote {
  font-size: 10px;
  font-style: italic;
  color: #94a3b8;
  line-height: 1.25;
}
.hero-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.hstat-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 4px 6px;
  text-align: center;
  font-size: 9.5px;
  font-weight: 800;
  color: #f1f5f9;
}
.hero-passive-card {
  background: rgba(2, 6, 23, 0.7);
  border-left: 3px solid var(--hero-accent, #38bdf8);
  border-radius: 4px 8px 8px 4px;
  padding: 5px 8px;
  text-align: left;
}
.hero-passive-lbl {
  font-size: 10px;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}
.hero-passive-txt {
  font-size: 9.5px;
  line-height: 1.25;
  color: #cbd5e1;
}
.hero-name-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  background: rgba(15, 23, 42, 0.6);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.hname-lbl {
  font-size: 9px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.5px;
}
.hname-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 11px;
  font-weight: 800;
  color: #f8fafc;
  padding: 2px 4px;
}

/* 3. Action Core (Big Play Button & Daily Run) */
.menu-action-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  gap: 6px;
}
.btn-main-play.pulse-action {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #061c12;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45), inset 0 1.5px 0 rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  user-select: none;
  touch-action: manipulation;
  animation: heroPulseBtn 2.2s infinite ease-in-out;
}
@keyframes heroPulseBtn {
  0%, 100% { box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45); }
  50% { box-shadow: 0 8px 30px rgba(16, 185, 129, 0.75); }
}
.btn-main-play.pulse-action:active {
  transform: scale(0.96);
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
}
.play-icon-glow {
  font-size: 18px;
  line-height: 1;
}
.btn-daily-sub {
  width: 100%;
  height: 36px;
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 10px;
  color: #fef08a;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-daily-sub:active {
  transform: scale(0.97);
  background: rgba(51, 65, 85, 0.95);
}

/* 4. Unified Bottom Dock */
.menu-bottom-dock {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
  max-width: 420px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 6px 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}
.dock-item {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
  border-radius: 8px;
  transition: background 0.15s ease, transform 0.1s ease;
  user-select: none;
}
.dock-item:active {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(0.94);
}
.dock-icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
}
.dock-label {
  font-size: 10px;
  font-weight: 900;
  color: #f1f5f9;
  letter-spacing: 0.2px;
}
.dock-sub {
  font-size: 8px;
  color: #94a3b8;
  font-weight: 600;
}

/* HUD Clutter Elimination */
#sfxHudBtn, #vibHudBtn, #devJumpBtn {
  display: none !important;
}

/* Pause Overlay Polish */
.pause-header-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.pause-header-icon { font-size: 24px; }
.pause-header-title { margin: 0; font-size: 20px; font-weight: 900; color: #f8fafc; }
.pause-quick-sfx-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 360px;
  margin: 10px 0;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 14px;
  border-radius: 12px;
  box-sizing: border-box;
}
.pause-slider { flex: 1; height: 6px; }
.pause-primary-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 360px;
}
.btn-main-resume {
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 900;
  color: #061c12;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  cursor: pointer;
}
.btn-main-resume:active { transform: scale(0.97); }
.btn-restart-sub {
  height: 40px;
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(251, 146, 60, 0.4);
  border-radius: 10px;
  color: #fdba74;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.btn-restart-sub:active { transform: scale(0.97); }
.btn-menu-ghost {
  height: 38px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.btn-menu-ghost:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.05); }

/* Game Over Polish */
.go-header-wrap {
  text-align: center;
  margin-bottom: 12px;
}
.go-skull-icon {
  font-size: 38px;
  animation: goSkullFloat 2s infinite ease-in-out alternate;
}
@keyframes goSkullFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}
.go-title {
  margin: 6px 0 2px;
  font-size: 22px;
  font-weight: 900;
  color: #f87171;
  text-shadow: 0 0 14px rgba(239, 68, 68, 0.5);
}
.go-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}
.go-actions-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 360px;
  margin-top: 14px;
}
.btn-sunak-upgrade {
  height: 44px;
  background: linear-gradient(135deg, #7e22ce 0%, #9333ea 100%);
  border: 1px solid #c084fc;
  border-radius: 12px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.4);
  cursor: pointer;
}
.btn-sunak-upgrade:active { transform: scale(0.97); }
`;

// Insert custom styles right before </head> or </style>
if (content.includes('</style>')) {
  content = content.replace('</style>', customPillar2Styles + '\n</style>');
  console.log('Pillar 2: Inserted custom UI CSS styles into <style>');
} else {
  console.error('Pillar 2 Error: Could not find </style>');
}

// =========================================================================
// 2. OVERHAUL HTML FOR #startOverlay (SINGLE SCREEN 100vh)
// =========================================================================
const oldStartOverlayRegex = /<div id="startOverlay"[\s\S]*?<\/div>[\s]*<\/div>[\s]*<\/div>[\s]*<\/div>/;

// Let's locate exact startOverlay block
const startOverlayStart = content.indexOf('<div id="startOverlay"');
const startOverlayEnd = content.indexOf('<div id="elTreeOverlay"');

if (startOverlayStart !== -1 && startOverlayEnd !== -1) {
  const newStartOverlayHTML = `<div id="startOverlay" class="overlay show single-screen-menu">
      <!-- 1. TOP HEADER (Brand + Best Score + Crystal Bank + Language) -->
      <header class="menu-top-bar">
        <div class="menu-brand-wrap">
          <div class="menu-brand-icon">⚡</div>
          <div class="menu-brand-titles">
            <h1 class="menu-brand-title">ELEMENTER</h1>
            <span class="menu-brand-sub">TÜRK MİTOLOJİSİ EFSANELERİ</span>
          </div>
        </div>
        <div class="menu-top-right">
          <div class="menu-stat-pill">
            <span class="stat-icon">🏆</span>
            <span id="bestLabel">Rekor —</span>
            <span class="stat-dot">·</span>
            <span id="crystalBank">💎 0</span>
          </div>
          <button type="button" class="quick-lang-pill" id="quickLangBtn" aria-label="Dil Değiştir">🌐 TR</button>
        </div>
      </header>

      <!-- 2. HERO SHOWCASE CAROUSEL (Center Stage) -->
      <section class="hero-showcase-section">
        <!-- 8 Hero Mini Icon Tabs -->
        <div class="hero-strip-mini" id="heroTabsRow">
          <button type="button" class="hero-mini-tab" id="heroTab_bamsi" onclick="selectHero('bamsi')" title="Bamsı">
            <span class="mini-icon">🌪️</span>
            <span class="mini-name">Bamsı</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_korhan" onclick="selectHero('korhan')" title="Korhan">
            <span class="mini-icon">🌋</span>
            <span class="mini-name">Korhan</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_karacor" onclick="selectHero('karacor')" title="Karaçor">
            <span class="mini-icon">🌑</span>
            <span class="mini-name">Karaçor</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_ayaz" onclick="selectHero('ayaz')" title="Ayaz Han">
            <span class="mini-icon">❄️</span>
            <span class="mini-name">Ayaz</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_umay" onclick="selectHero('umay')" title="Umay Ana">
            <span class="mini-icon">⚡</span>
            <span class="mini-name">Umay</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_kayra" onclick="selectHero('kayra')" title="Kayra Han">
            <span class="mini-icon">⏳</span>
            <span class="mini-name">Kayra</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_mergen" onclick="selectHero('mergen')" title="Mergen Han">
            <span class="mini-icon">🏹</span>
            <span class="mini-name">Mergen</span>
          </button>
          <button type="button" class="hero-mini-tab" id="heroTab_ulgen" onclick="selectHero('ulgen')" title="Ülgen Han">
            <span class="mini-icon">🔮</span>
            <span class="mini-name">Ülgen</span>
          </button>
        </div>

        <!-- Spotlight Card with Left/Right Chevrons -->
        <div class="hero-spotlight-card" id="heroInfoCard">
          <button type="button" class="hero-carousel-nav prev" id="heroPrevBtn" onclick="prevHero()" aria-label="Önceki Kahraman">‹</button>
          <button type="button" class="hero-carousel-nav next" id="heroNextBtn" onclick="nextHero()" aria-label="Sonraki Kahraman">›</button>

          <div class="hero-card-main">
            <div class="hero-card-header">
              <span class="hero-name-h" id="heroCardTitle">🌪️ BAMSI · Yelin ve Ruhun Kılıcı</span>
              <span class="hero-selected-tag" id="heroSelectedBadge">SEÇİLDİ</span>
            </div>
            <div class="hero-card-quote" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</div>

            <div class="hero-stats-row">
              <div class="hstat-chip" id="heroStatHp">❤️ CAN: 160</div>
              <div class="hstat-chip" id="heroStatSpd">⚡ HIZ: 3.5</div>
              <div class="hstat-chip" id="heroStatWep">⚔️ YATAĞAN</div>
            </div>

            <div class="hero-passive-card">
              <div class="hero-passive-lbl" id="heroPassiveTitle">ÖZEL PASİF: Yel Kalkanı (Parry)</div>
              <div class="hero-passive-txt" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>
            </div>

            <div class="hero-name-inline">
              <label for="heroNameInput" class="hname-lbl">⚔️ İSİM:</label>
              <input type="text" id="heroNameInput" maxlength="16" placeholder="Alp" value="" class="hname-input">
            </div>
          </div>
        </div>
      </section>

      <!-- 3. ACTION CORE (Big Play Button & Daily Run) -->
      <section class="menu-action-core">
        <div id="metaGoal" class="menu-goal-pill" style="display:none;"></div>
        <div id="dailyPill" class="menu-goal-pill" style="display:none;"></div>

        <button class="btn btn-main-play pulse-action" id="startBtn" type="button">
          <span class="play-icon-glow">▶</span> SAVAŞA BAŞLA
        </button>
        <button class="btn btn-daily-sub" id="dailyBtn" type="button">
          <span>☀️</span> GÜNLÜK RUN / MÜCADELE
        </button>
        <button class="btn btn-dev-sub" id="devStartBtn" type="button" style="display:none;">
          🛠️ BÖLÜM SEÇİCİ
        </button>
      </section>

      <!-- 4. UNIFIED BOTTOM DOCK (Apple / Nintendo Elegance) -->
      <nav class="menu-bottom-dock" aria-label="Ana Menü Sekmeleri">
        <button type="button" class="dock-item" id="treeFromStartBtn">
          <span class="dock-icon">🏛️</span>
          <span class="dock-label">Kadim Sunak</span>
          <span class="dock-sub">Yükseltmeler</span>
        </button>
        <button type="button" class="dock-item" id="lookFromStartBtn">
          <span class="dock-icon">🎒</span>
          <span class="dock-label">Donanım</span>
          <span class="dock-sub">Kostüm & İz</span>
        </button>
        <button type="button" class="dock-item" id="guideFromStartBtn">
          <span class="dock-icon">📜</span>
          <span class="dock-label">Rehber</span>
          <span class="dock-sub">Kombolar</span>
        </button>
        <button type="button" class="dock-item" id="settingsFromStartBtn">
          <span class="dock-icon">⚙️</span>
          <span class="dock-label">Ayarlar</span>
          <span class="dock-sub">Ses & Dil</span>
        </button>
      </nav>
    </div>

    `;

  content = content.substring(0, startOverlayStart) + newStartOverlayHTML + content.substring(startOverlayEnd);
  console.log('Pillar 2: Successfully replaced #startOverlay with single-screen 100vh layout!');
} else {
  console.error('Pillar 2 Error: Could not locate startOverlay boundaries');
}

// =========================================================================
// 3. ENHANCE KADİM SUNAK (treeOverlay) WITH 3 TABS (SUNAKLAR, PAKTLAR, ELEMENT AĞACI)
// =========================================================================
const oldSunakTabs = `<div class="sunak-tabs">
        <button type="button" class="sunak-tab active" id="tabSunakTree">🔮 Güç Sunakları</button>
        <button type="button" class="sunak-tab" id="tabSunakHeat">⚖️ Ceza Paktı (Isı: <span id="sunakHeatBadge">0</span>)</button>
      </div>`;

const newSunakTabs = `<div class="sunak-tabs">
        <button type="button" class="sunak-tab active" id="tabSunakTree">🔮 Güç Sunakları</button>
        <button type="button" class="sunak-tab" id="tabSunakHeat">⚖️ Ceza Paktı (Isı: <span id="sunakHeatBadge">0</span>)</button>
        <button type="button" class="sunak-tab" id="tabSunakElTree">🌳 Element Ağacı</button>
      </div>`;

if (content.includes(oldSunakTabs)) {
  content = content.replace(oldSunakTabs, newSunakTabs);
  console.log('Pillar 2: Added tabSunakElTree to treeOverlay sunak-tabs!');
}

// Ensure heatPanel has elTreeHubPanel next to it
const targetHeatPanel = '<div class="heat-panel" id="heatPanel" style="display:none;"></div>';
const replacementPanels = `<div class="heat-panel" id="heatPanel" style="display:none;"></div>
      <div class="eltree-hub-panel" id="elTreeHubPanel" style="display:none; width:100%; max-width:400px; flex-direction:column; gap:10px;">
        <div class="el-tabs" style="margin-bottom:4px;">
          <button type="button" class="el-tab on" id="hubElTabRun" data-tab="run">Bu run</button>
          <button type="button" class="el-tab" id="hubElTabAtlas" data-tab="atlas">Atlas</button>
        </div>
        <div class="el-path" id="hubElPathStrip" aria-label="Seçim yolu"></div>
        <div class="el-focus-row" id="hubElFocusRow"></div>
        <div class="el-combo-grid" id="hubElComboGrid"></div>
        <div class="el-detail" id="hubElDetail"></div>
        <div class="el-sig-row" id="hubElSigRow"></div>
      </div>`;

if (content.includes(targetHeatPanel) && !content.includes('id="elTreeHubPanel"')) {
  content = content.replace(targetHeatPanel, replacementPanels);
  console.log('Pillar 2: Added elTreeHubPanel into treeOverlay!');
}

// =========================================================================
// 4. OVERHAUL PAUSE OVERLAY ACTIONS & QUICK SOUND CONTROLS
// =========================================================================
const pauseOverlayStart = content.indexOf('<div id="pauseOverlay"');
const pauseOverlayEnd = content.indexOf('<div id="continueOverlay"');

if (pauseOverlayStart !== -1 && pauseOverlayEnd !== -1) {
  const newPauseOverlayHTML = `<div id="pauseOverlay" class="overlay pause-ov">
      <div class="pause-header-wrap">
        <span class="pause-header-icon">⏸️</span>
        <h2 class="pause-header-title">Oyun Durduruldu</h2>
      </div>

      <div class="pause-stat-grid">
        <div class="pause-stat-box">
          <div class="pstat-lab">🌊 DALGA</div>
          <div class="pstat-val" id="pauseWave">Dalga 1</div>
        </div>
        <div class="pause-stat-box">
          <div class="pstat-lab">🏆 PUAN</div>
          <div class="pstat-val" id="pauseScore">0</div>
        </div>
        <div class="pause-stat-box">
          <div class="pstat-lab">💎 KRİSTAL</div>
          <div class="pstat-val" id="pauseCrystals">0</div>
        </div>
        <div class="pause-stat-box">
          <div class="pstat-lab">⚡ AKIŞ</div>
          <div class="pstat-val" id="pauseRank">D</div>
        </div>
      </div>

      <div class="pause-inventory-card">
        <div class="pause-sec-title">📊 Karakter Nitelikleri</div>
        <div class="pause-attrs-grid" id="pauseHeroAttrs"></div>
      </div>
      
      <div class="pause-inventory-card">
        <div class="pause-sec-title">🔮 Aktif Kombolar & Eserler</div>
        <div id="pauseComboList" class="pause-grid"></div>
        <div id="pauseModList" class="pause-grid" style="margin-top:6px;"></div>
      </div>

      <div class="pause-quick-sfx-bar">
        <button class="btn ghost" id="sfxPauseBtn" type="button" style="width:auto;padding:6px 10px;" aria-label="Ses">🔊</button>
        <input id="sfxVol" type="range" min="0" max="100" value="70" class="pause-slider" aria-label="Ses seviyesi">
        <button class="btn ghost" id="vibPauseBtn" type="button" style="width:auto;padding:6px 10px;" aria-label="Titreşim">📳</button>
      </div>

      <div class="pause-primary-actions">
        <button class="btn btn-main-resume" id="resumeBtn" type="button">▶ SAVAŞA DEVAM ET</button>
        <button class="btn btn-restart-sub" id="restartFromPauseBtn" type="button">🔄 Yeniden Başla</button>
        <button class="btn btn-menu-ghost" id="menuFromPauseBtn" type="button">🏠 Ana Menü</button>
      </div>
    </div>

    `;

  content = content.substring(0, pauseOverlayStart) + newPauseOverlayHTML + content.substring(pauseOverlayEnd);
  console.log('Pillar 2: Streamlined #pauseOverlay with 3 primary action buttons!');
}

// =========================================================================
// 5. POLISH GAME OVER OVERLAY (CLEAN RECAP & 3 PROMINENT ACTIONS)
// =========================================================================
const gameOverOverlayStart = content.indexOf('<div id="gameOverOverlay"');
const gameOverOverlayEnd = content.indexOf('</div>\n  </div>\n</div>\n\n<script>');

if (gameOverOverlayStart !== -1 && gameOverOverlayEnd !== -1) {
  const newGameOverOverlayHTML = `<div id="gameOverOverlay" class="overlay game-over-ov">
      <div class="go-header-wrap">
        <div class="go-skull-icon">💀</div>
        <h2 id="gameOverTitle" class="go-title">Savaş Sona Erdi</h2>
        <p id="gameOverText" class="go-sub"></p>
      </div>

      <div class="menu-btns go-actions-row">
        <button class="btn btn-main-play" id="restartBtn" type="button">⚔️ TEKRAR SAVAŞ</button>
        <button class="btn btn-sunak-upgrade" id="asraFromOverBtn" type="button">🏛️ KADİM SUNAK (GELİŞTİR)</button>
        <button class="btn btn-menu-ghost" id="menuFromOverBtn" type="button">🏠 Ana Menü</button>
      </div>
    </div>`;

  content = content.substring(0, gameOverOverlayStart) + newGameOverOverlayHTML + content.substring(gameOverOverlayEnd);
  console.log('Pillar 2: Streamlined #gameOverOverlay with clean header & clear actions!');
}

// =========================================================================
// 6. JAVASCRIPT HELPERS: prevHero(), nextHero(), switchSunakTab('eltree')
// =========================================================================
const heroCarouselHelpers = `
// =========================================================================
// HERO CAROUSEL NAVIGATION (PREV / NEXT CHEVRONS)
// =========================================================================
const HERO_CYCLE_KEYS = ['bamsi', 'korhan', 'karacor', 'ayaz', 'umay', 'kayra', 'mergen', 'ulgen'];

function prevHero() {
  const curIdx = HERO_CYCLE_KEYS.indexOf(selectedHeroId);
  const nextIdx = (curIdx - 1 + HERO_CYCLE_KEYS.length) % HERO_CYCLE_KEYS.length;
  selectHero(HERO_CYCLE_KEYS[nextIdx]);
}

function nextHero() {
  const curIdx = HERO_CYCLE_KEYS.indexOf(selectedHeroId);
  const nextIdx = (curIdx + 1) % HERO_CYCLE_KEYS.length;
  selectHero(HERO_CYCLE_KEYS[nextIdx]);
}
`;

// Insert hero carousel helpers after selectHero function
const selectHeroEndTarget = `vibrate([25, 40]);
}`;

if (content.includes(selectHeroEndTarget)) {
  content = content.replace(selectHeroEndTarget, selectHeroEndTarget + '\n' + heroCarouselHelpers);
  console.log('Pillar 2: Inserted prevHero() and nextHero() helper functions!');
}

// Update switchSunakTab to support 'eltree'
const oldSwitchSunakTab = `function switchSunakTab(tab) {
  const treeList = document.getElementById('treeList');
  const heatPanel = document.getElementById('heatPanel');
  const tabTree = document.getElementById('tabSunakTree');
  const tabHeat = document.getElementById('tabSunakHeat');
  if (tab === 'heat') {
    if (treeList) treeList.style.display = 'none';
    if (heatPanel) heatPanel.style.display = 'flex';
    if (tabTree) tabTree.classList.remove('active');
    if (tabHeat) tabHeat.classList.add('active');
    fillHeatPanel();
  } else {
    if (treeList) treeList.style.display = 'flex';
    if (heatPanel) heatPanel.style.display = 'none';
    if (tabTree) tabTree.classList.add('active');
    if (tabHeat) tabHeat.classList.remove('active');
    fillTreePanel();
  }
}`;

const newSwitchSunakTab = `function switchSunakTab(tab) {
  const treeList = document.getElementById('treeList');
  const heatPanel = document.getElementById('heatPanel');
  const elPanel = document.getElementById('elTreeHubPanel');
  const tabTree = document.getElementById('tabSunakTree');
  const tabHeat = document.getElementById('tabSunakHeat');
  const tabEl = document.getElementById('tabSunakElTree');

  if (tab === 'heat') {
    if (treeList) treeList.style.display = 'none';
    if (elPanel) elPanel.style.display = 'none';
    if (heatPanel) heatPanel.style.display = 'flex';
    if (tabTree) tabTree.classList.remove('active');
    if (tabEl) tabEl.classList.remove('active');
    if (tabHeat) tabHeat.classList.add('active');
    fillHeatPanel();
  } else if (tab === 'eltree') {
    if (treeList) treeList.style.display = 'none';
    if (heatPanel) heatPanel.style.display = 'none';
    if (elPanel) elPanel.style.display = 'flex';
    if (tabTree) tabTree.classList.remove('active');
    if (tabHeat) tabHeat.classList.remove('active');
    if (tabEl) tabEl.classList.add('active');
    syncHubElTree();
  } else {
    if (treeList) treeList.style.display = 'flex';
    if (heatPanel) heatPanel.style.display = 'none';
    if (elPanel) elPanel.style.display = 'none';
    if (tabTree) tabTree.classList.add('active');
    if (tabHeat) tabHeat.classList.remove('active');
    if (tabEl) tabEl.classList.remove('active');
    fillTreePanel();
  }
}

function syncHubElTree() {
  fillElTreeBody();
  // Copy rendered content to hub container if needed
  const hubGrid = document.getElementById('hubElComboGrid');
  const origGrid = document.getElementById('elComboGrid');
  if (hubGrid && origGrid) hubGrid.innerHTML = origGrid.innerHTML;
  const hubDetail = document.getElementById('hubElDetail');
  const origDetail = document.getElementById('elDetail');
  if (hubDetail && origDetail) hubDetail.innerHTML = origDetail.innerHTML;
}`;

if (content.includes(oldSwitchSunakTab)) {
  content = content.replace(oldSwitchSunakTab, newSwitchSunakTab);
  console.log('Pillar 2: Updated switchSunakTab to support tabSunakElTree!');
}

// Add event listener for tabSunakElTree in script initialization
const tabSunakInitTarget = `if (tabHeatBtn) tabHeatBtn.addEventListener('click', () => switchSunakTab('heat'));`;
const tabSunakInitAddition = `if (tabHeatBtn) tabHeatBtn.addEventListener('click', () => switchSunakTab('heat'));
  const tabElBtn = document.getElementById('tabSunakElTree');
  if (tabElBtn) tabElBtn.addEventListener('click', () => switchSunakTab('eltree'));`;

if (content.includes(tabSunakInitTarget) && !content.includes('tabSunakElTree')) {
  content = content.replace(tabSunakInitTarget, tabSunakInitAddition);
  console.log('Pillar 2: Wired tabSunakElTree click event listener!');
}

// Write the updated content back
fs.writeFileSync(filePath, content, 'utf8');
console.log('[Pillar 2 Overhaul] Completed successfully. New length:', content.length);
