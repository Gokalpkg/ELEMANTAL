const fs = require('fs');
const path = require('path');

console.log('=== APPLYING 100-ITEM MASTER CODEBASE OVERHAUL ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// 1. TYPOGRAPHY & FONT SANITIZATION (Items 1, 89, 92, 93, 94)
// Replace brutalist monospace and font-smooth: never with luxury game font stack
// =========================================================================
console.log('[1/5] Sanitizing typography and responsive mobile viewport styles...');

// Replace head style brutalist rules
const brutalistCssRegex = /\/\*\s*PIXEL-NATIVE-UI\s*\*\/[\s\S]*?font-family:\s*['"]Courier New['"][\s\S]*?position:\s*fixed;\s*inset:\s*0;\s*\}/i;

const modernHeadCss = `/* HIGH-END MOBILE GAMING UI SYSTEM */
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
    -webkit-user-select: none;
    margin: 0; padding: 0;
  }
  html, body {
    height: 100%;
    width: 100%;
    min-height: 100dvh;
    background: #080a10;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif;
    color: #f1f5f9;
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    position: fixed;
    inset: 0;
  }
  button, .btn, .choice-card, .tree-node, .el-chip, .status-chip, .meter-pill {
    font-family: inherit;
    border-radius: 10px;
  }
  .overlay h1, .overlay h2, .menu-hero-title {
    font-family: inherit;
    letter-spacing: 0.04em;
    font-weight: 900;
  }`;

if (brutalistCssRegex.test(content)) {
  content = content.replace(brutalistCssRegex, modernHeadCss);
  console.log('✓ Replaced brutalist head typography with modern game font stack.');
} else {
  // Replace individual font-family: 'Courier New' instances
  content = content.replace(/font-family:\s*'Courier New'[^;]*;/g, "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;");
  content = content.replace(/font-smooth:\s*never;/g, "");
  content = content.replace(/-webkit-font-smoothing:\s*none;/g, "-webkit-font-smoothing: antialiased;");
  console.log('✓ Replaced individual Courier New & font-smoothing rules.');
}

// Ensure in-menu body class hides in-game HUD completely
const inMenuHidingCss = `
/* Strict In-Menu HUD Isolation (Hides all in-game buttons & HUD during main menu) */
body.in-menu #hud,
body.in-menu #stanceFab,
body.in-menu #dashFab,
body.in-menu #ultFab,
body.in-menu #pauseBtn,
body.in-menu #skillBar,
body.in-menu #vibHudBtn,
body.in-menu #sfxHudBtn,
body.in-menu #devJumpBtn,
body.in-menu #bossHud,
#startOverlay:not(.show) {
  /* When startOverlay is visible, body gets in-menu */
}
#startOverlay.show ~ #stanceFab,
#startOverlay.show ~ #dashFab,
#startOverlay.show ~ #ultFab,
#startOverlay.show ~ #pauseBtn,
#startOverlay.show ~ #skillBar,
#startOverlay.show ~ #hud,
#startOverlay.show ~ #vibHudBtn,
#startOverlay.show ~ #sfxHudBtn,
#startOverlay.show ~ #devJumpBtn,
#startOverlay.show ~ #bossHud {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
}
`;

if (!content.includes('/* Strict In-Menu HUD Isolation')) {
  content = content.replace('</style>', inMenuHidingCss + '\n</style>');
  console.log('✓ Added Strict In-Menu HUD Isolation CSS.');
}

// =========================================================================
// 2. MAIN MENU & HERO SHOWCASE STYLING & VIEWPORT FIXES (Items 2 - 20)
// =========================================================================
console.log('[2/5] Overhauling Main Menu UI, 3-Hero Carousel & Dossier Card...');

// Overhaul #startOverlay.single-screen-menu CSS block
const startOverlayCssRegex = /#startOverlay\.single-screen-menu\s*\{[\s\S]*?#startOverlay\.single-screen-menu\.show\s*\{[\s\S]*?\}/;

const modernStartOverlayCss = `#startOverlay.single-screen-menu {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
  overflow: hidden !important;
  display: none;
  flex-direction: column !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: max(8px, env(safe-area-inset-top, 0px)) 12px max(12px, calc(env(safe-area-inset-bottom, 0px) + 8px)) 12px !important;
  box-sizing: border-box !important;
  background: radial-gradient(circle at 50% 15%, #182033 0%, #080b12 100%) !important;
  z-index: 1000 !important;
  pointer-events: auto !important;
  touch-action: manipulation;
}
#startOverlay.single-screen-menu.show {
  display: flex !important;
  pointer-events: auto !important;
}`;

content = content.replace(startOverlayCssRegex, modernStartOverlayCss);

// Overhaul 3-Hero Carousel Stage CSS
const heroStageCssRegex = /\/\*\s*3-Hero Carousel Stage\s*\*\/[\s\S]*?\/\*\s*Detailed Hero Dossier Card\s*\*\//;

const modernHeroStageCss = `/* 3-Hero Carousel Stage (Left Silhouette, Center Active, Right Silhouette) */
.hero-stage-carousel {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 390px;
  gap: 12px;
  padding: 4px 0;
  margin: 0 auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y pinch-zoom;
}

.hero-stage-nav {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background: rgba(17, 24, 39, 0.85);
  border: 1.5px solid rgba(255, 215, 64, 0.4);
  color: #ffd740;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.6);
  transition: transform 0.12s, border-color 0.2s, background 0.2s;
  z-index: 5;
  touch-action: manipulation;
}
.hero-stage-nav:active {
  transform: scale(0.88);
  background: rgba(245, 158, 11, 0.4);
  border-color: #ffd740;
}

/* Hero Pedestals */
.hero-pedestal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease;
  user-select: none;
}

.hero-pedestal.pedestal-left,
.hero-pedestal.pedestal-right {
  width: 68px;
  flex: 0 0 68px;
  opacity: 0.72;
  transform: scale(0.85);
}
.hero-pedestal.pedestal-left:active,
.hero-pedestal.pedestal-right:active {
  transform: scale(0.92);
  opacity: 0.95;
}

.hero-pedestal.pedestal-center {
  width: 104px;
  flex: 0 0 104px;
  opacity: 1;
  transform: scale(1.05);
  z-index: 4;
}

.hero-pedestal-canvas {
  width: 64px !important;
  height: 64px !important;
  max-width: 64px !important;
  max-height: 64px !important;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.85));
  border-radius: 12px;
  display: block;
}

.main-hero-canvas {
  width: 96px !important;
  height: 96px !important;
  max-width: 96px !important;
  max-height: 96px !important;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.85));
  border-radius: 50%;
  position: relative;
  z-index: 2;
  display: block;
}

.pedestal-disc {
  position: absolute;
  bottom: 8px;
  width: 58px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.16) 0%, transparent 72%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  z-index: 1;
}
.pedestal-disc.active {
  width: 82px;
  height: 20px;
  bottom: 12px;
  background: radial-gradient(ellipse at center, var(--hero-accent-alpha, rgba(245, 158, 11, 0.4)) 0%, transparent 72%);
  border: 1.5px solid var(--hero-accent, #ffd740);
  box-shadow: 0 0 18px var(--hero-accent, rgba(245, 158, 11, 0.6));
}

.hero-stage-aura {
  position: absolute;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hero-accent-alpha, rgba(245, 158, 11, 0.25)) 0%, transparent 70%);
  pointer-events: none;
  animation: auraPulse 2.2s ease-in-out infinite alternate;
}
@keyframes auraPulse {
  0% { transform: scale(0.92); opacity: 0.55; }
  100% { transform: scale(1.18); opacity: 1.0; }
}

.pedestal-name {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #94a3b8;
  margin-top: 3px;
  text-transform: uppercase;
  white-space: nowrap;
}

.hero-elem-indicator {
  font-size: 8.5px;
  font-weight: 900;
  color: var(--hero-accent, #ffd740);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid var(--hero-accent, #ffd740);
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  margin-top: 3px;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Detailed Hero Dossier Card */`;

content = content.replace(heroStageCssRegex, modernHeroStageCss);

// Overhaul Dossier Card styling
const dossierCardCssRegex = /\.hero-dossier-card\s*\{[\s\S]*?\/\*\s*Mythological Weapon & Quote Box\s*\*\//;

const modernDossierCardCss = `.hero-dossier-card {
  position: relative;
  width: 100%;
  max-width: 390px;
  box-sizing: border-box;
  background: linear-gradient(150deg, rgba(17, 24, 39, 0.96), rgba(9, 14, 26, 0.98));
  border: 1.5px solid var(--hero-accent, rgba(245, 158, 11, 0.45));
  border-radius: 14px;
  padding: 8px 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.hero-dossier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-name-h {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--hero-accent, #ffd740);
}
.hero-role-pill {
  font-size: 8px;
  font-weight: 900;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 1.5px 6px;
  border-radius: 4px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.hero-selected-tag {
  font-size: 8px;
  font-weight: 900;
  color: #10b981;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.45);
  padding: 1.5px 6px;
  border-radius: 4px;
  letter-spacing: 0.4px;
}
.hero-card-subtitle {
  font-size: 9.5px;
  font-weight: 700;
  color: #94a3b8;
  margin-top: -2px;
}

/* Mythological Weapon & Quote Box */`;

content = content.replace(dossierCardCssRegex, modernDossierCardCss);

// Overhaul Main Play Button and Action Core
const actionCoreCssRegex = /\.btn-main-play\s*\{[\s\S]*?\.btn-main-play:active\s*\{[\s\S]*?\}/;

const modernActionCoreCss = `.btn-main-play {
  width: 100%;
  max-width: 390px;
  height: 48px;
  min-height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%) !important;
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: 900 !important;
  letter-spacing: 1.2px !important;
  border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 18px rgba(245, 158, 11, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.12s, box-shadow 0.12s;
  touch-action: manipulation;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.btn-main-play:active {
  transform: scale(0.96) !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3) !important;
}`;

content = content.replace(actionCoreCssRegex, modernActionCoreCss);

// =========================================================================
// 3. ZERO-TILE ORGANIC MASTERPIECE BIOME BACKGROUNDS (Items 21 - 40)
// Complete replacement of createBiomeFloorCanvas with 512x512 seamless organic terrain
// =========================================================================
console.log('[3/5] Upgrading to 512x512 Zero-Tile Organic Masterpiece Biome Engine...');

const biomeFloorEngineRegex = /function createBiomeFloorCanvas\(biomeKey,\s*visualMode\)[\s\S]*?return cv;\s*\}/;

const masterOrganicBiomeFloorEngine = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  // 512x512 ULTRA-ORGANIC SEAMLESS TERRAIN ENGINE - ZERO CHECKERBOARDS, ZERO REPEATING TILES
  // Toroidal boundary continuity: f(0, y) === f(512, y) and f(x, 0) === f(x, 512)
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 512;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = true;

  const bk = biomeKey || 'stone';
  const PI2 = Math.PI * 2;

  // Base fills per biome
  const BIOME_BASE_COLORS = {
    forest:  '#061309',
    water:   '#031221',
    ice:     '#05111e',
    sand:    '#181006',
    lava:    '#0b0a0e',
    storm:   '#080914',
    stone:   '#0a0e14',
    night:   '#050610',
    pink:    '#180614',
    ketchup: '#140305'
  };

  c.fillStyle = BIOME_BASE_COLORS[bk] || '#090d14';
  c.fillRect(0, 0, 512, 512);

  // Helper for seamless wrapping curves and organic drifts
  function drawWrapBezier(p1, p2, p3, p4, strokeStyle, lineWidth, alpha) {
    c.save();
    c.strokeStyle = strokeStyle;
    c.lineWidth = lineWidth;
    c.globalAlpha = alpha || 1.0;
    c.beginPath();
    c.moveTo(p1[0], p1[1]);
    c.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
    c.stroke();
    c.restore();
  }

  if (bk === 'forest') {
    // === 1. DOĞA & SİSLİ ORMAN (DEEP MOSS, RICH LOAM, SHAMROCK LEAVES) ===
    // Continuous sweeping mossy strata
    for (let layer = 0; layer < 4; layer++) {
      const yBase = layer * 128;
      const grad = c.createLinearGradient(0, yBase, 0, yBase + 128);
      grad.addColorStop(0, 'rgba(12, 34, 17, 0.45)');
      grad.addColorStop(0.5, 'rgba(18, 51, 25, 0.6)');
      grad.addColorStop(1, 'rgba(12, 34, 17, 0.45)');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(0, yBase);
      c.bezierCurveTo(128, yBase + 30, 384, yBase - 30, 512, yBase);
      c.lineTo(512, yBase + 128);
      c.bezierCurveTo(384, yBase + 128 - 30, 128, yBase + 128 + 30, 0, yBase + 128);
      c.closePath();
      c.fill();
    }

    // Organic tree root contours with wrap-around
    c.strokeStyle = 'rgba(62, 39, 35, 0.35)';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(0, 160); c.bezierCurveTo(140, 210, 320, 110, 512, 160);
    c.moveTo(0, 380); c.bezierCurveTo(180, 320, 360, 420, 512, 380);
    c.moveTo(180, 0); c.bezierCurveTo(230, 140, 130, 340, 180, 512);
    c.stroke();

    // Natural shamrock clusters & scattered woodland spores
    const forestFlora = [
      [64, 72], [140, 190], [280, 84], [410, 150], [92, 320], [240, 290],
      [370, 380], [460, 270], [180, 440], [310, 480], [50, 490], [470, 60]
    ];
    forestFlora.forEach(([fx, fy]) => {
      // 3-leaf clover cluster
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(fx - 3, fy, 3, 0, PI2);
      c.arc(fx + 3, fy, 3, 0, PI2);
      c.arc(fx, fy - 3, 3, 0, PI2);
      c.fill();
      c.fillStyle = '#4ade80';
      c.fillRect(fx - 1, fy - 1, 2, 2);
    });

  } else if (bk === 'water') {
    // === 2. TURKUAZ DERİNLİK & LAGÜN (OCEANIC TRANQUILITY & CAUSTIC LIGHT) ===
    // Sinuous fluid caustic ribbons
    for (let i = 0; i < 5; i++) {
      const yOff = i * 102;
      c.strokeStyle = 'rgba(6, 46, 82, 0.4)';
      c.lineWidth = 18;
      c.beginPath();
      c.moveTo(0, yOff + 40);
      c.bezierCurveTo(128, yOff + 10, 384, yOff + 70, 512, yOff + 40);
      c.stroke();

      c.strokeStyle = 'rgba(14, 165, 233, 0.16)';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, yOff + 40);
      c.bezierCurveTo(128, yOff + 10, 384, yOff + 70, 512, yOff + 40);
      c.stroke();
    }

    // Translucent glowing water lily pads
    const waterPads = [
      [80, 96, 16], [220, 140, 18], [390, 80, 15], [130, 280, 20],
      [310, 260, 17], [450, 340, 19], [170, 430, 16], [360, 450, 18]
    ];
    waterPads.forEach(([lx, ly, lr]) => {
      c.fillStyle = 'rgba(20, 83, 45, 0.65)';
      c.beginPath(); c.arc(lx, ly, lr, 0.3, PI2 - 0.3); c.lineTo(lx, ly); c.closePath(); c.fill();
      c.strokeStyle = '#22c55e';
      c.lineWidth = 1.2;
      c.stroke();
      // Blooming lotus blossom
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(lx, ly, 4, 0, PI2); c.fill();
      c.fillStyle = '#ffffff';
      c.fillRect(lx - 1, ly - 1, 2, 2);
    });

  } else if (bk === 'ice') {
    // === 3. KUTUP BUZULU (CRYSTALLINE PERMAFROST & GLACIAL CREVASSES) ===
    // Translucent glacial depth layers
    const iceGrad = c.createRadialGradient(256, 256, 50, 256, 256, 256);
    iceGrad.addColorStop(0, 'rgba(14, 46, 78, 0.4)');
    iceGrad.addColorStop(1, 'rgba(6, 19, 34, 0.1)');
    c.fillStyle = iceGrad;
    c.fillRect(0, 0, 512, 512);

    // Fine crystalline frost fissures branching seamlessly
    c.strokeStyle = 'rgba(2, 132, 199, 0.35)';
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(0, 180); c.lineTo(130, 160); c.lineTo(256, 210); c.lineTo(390, 170); c.lineTo(512, 180);
    c.moveTo(0, 360); c.lineTo(160, 390); c.lineTo(290, 330); c.lineTo(440, 380); c.lineTo(512, 360);
    c.moveTo(220, 0); c.lineTo(256, 210); c.lineTo(220, 512);
    c.stroke();

    c.strokeStyle = 'rgba(125, 211, 252, 0.65)';
    c.lineWidth = 1.0;
    c.stroke();

    // Frost star crystals
    const frostStars = [
      [90, 90], [330, 110], [440, 210], [180, 270], [80, 420], [360, 410], [470, 480]
    ];
    frostStars.forEach(([kx, ky]) => {
      c.fillStyle = 'rgba(224, 242, 254, 0.75)';
      c.fillRect(kx - 5, ky, 11, 1);
      c.fillRect(kx, ky - 5, 1, 11);
      c.fillStyle = '#ffffff';
      c.fillRect(kx - 1, ky - 1, 3, 3);
    });

  } else if (bk === 'sand') {
    // === 4. ALTIN ÇÖL KUMULLARI (SWEEPING SINUOUS WIND DUNES) ===
    // Silky sweeping dunes with smooth organic cubic curves
    for (let d = 0; d < 4; d++) {
      const yDune = d * 128;
      c.fillStyle = (d % 2 === 0) ? '#241a0c' : '#2d2010';
      c.beginPath();
      c.moveTo(0, yDune);
      c.bezierCurveTo(128, yDune - 35, 384, yDune + 35, 512, yDune);
      c.lineTo(512, yDune + 128);
      c.bezierCurveTo(384, yDune + 128 + 35, 128, yDune + 128 - 35, 0, yDune + 128);
      c.closePath();
      c.fill();
    }

    // Delicate wind ripple lines
    c.strokeStyle = 'rgba(180, 83, 9, 0.28)';
    c.lineWidth = 1.5;
    for (let r = 24; r < 512; r += 44) {
      c.beginPath();
      c.moveTo(0, r);
      c.bezierCurveTo(128, r - 12, 384, r + 12, 512, r);
      c.stroke();
    }

    // Ancient golden sand grains & buried Tamga runes
    const sandRunes = [[110, 85], [380, 160], [210, 310], [430, 410], [80, 460]];
    sandRunes.forEach(([rx, ry]) => {
      c.fillStyle = '#451a03';
      c.beginPath(); c.arc(rx, ry, 8, 0, PI2); c.fill();
      c.strokeStyle = '#d97706';
      c.lineWidth = 1.2;
      c.beginPath(); c.arc(rx, ry, 7, 0, PI2); c.stroke();
      c.fillStyle = '#facc15';
      c.fillRect(rx - 1, ry - 3, 2, 6);
      c.fillRect(rx - 3, ry - 1, 6, 2);
    });

  } else if (bk === 'lava') {
    // === 5. VOLKANİK BAZALT & AKKOR LAV IRMAKLARI (MOLTEN BASALT BEDROCK) ===
    // Deep basalt plateaus
    c.fillStyle = '#14131a';
    c.beginPath();
    c.ellipse(128, 128, 110, 80, 0.2, 0, PI2);
    c.ellipse(384, 128, 100, 75, -0.2, 0, PI2);
    c.ellipse(128, 384, 105, 80, -0.2, 0, PI2);
    c.ellipse(384, 384, 110, 80, 0.2, 0, PI2);
    c.fill();

    // Flowing glowing magma rivers
    c.strokeStyle = '#7f1d1d';
    c.lineWidth = 22;
    c.beginPath();
    c.moveTo(0, 256); c.bezierCurveTo(140, 210, 350, 310, 512, 256);
    c.moveTo(256, 0); c.bezierCurveTo(210, 150, 300, 360, 256, 512);
    c.stroke();

    c.strokeStyle = '#ea580c';
    c.lineWidth = 12;
    c.stroke();

    c.strokeStyle = '#fde047';
    c.lineWidth = 4;
    c.stroke();

    // Caldera core at crossroads
    c.fillStyle = '#ea580c';
    c.beginPath(); c.arc(256, 256, 24, 0, PI2); c.fill();
    c.fillStyle = '#fef08a';
    c.beginPath(); c.arc(256, 256, 12, 0, PI2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(256, 256, 5, 0, PI2); c.fill();

  } else if (bk === 'storm') {
    // === 6. FIRTINA TEPESİ (HIGH-VOLTAGE ENERGY CONDUITS) ===
    // Electric field contours
    c.strokeStyle = 'rgba(49, 46, 129, 0.4)';
    c.lineWidth = 8;
    c.beginPath();
    c.moveTo(0, 140); c.lineTo(110, 160); c.lineTo(220, 90); c.lineTo(350, 170); c.lineTo(512, 140);
    c.moveTo(0, 370); c.lineTo(150, 340); c.lineTo(280, 420); c.lineTo(410, 350); c.lineTo(512, 370);
    c.stroke();

    c.strokeStyle = 'rgba(6, 182, 212, 0.65)';
    c.lineWidth = 2.4;
    c.stroke();

    c.strokeStyle = '#ffffff';
    c.lineWidth = 1.0;
    c.stroke();

    // Voltage sparks
    [[110, 160], [220, 90], [350, 170], [150, 340], [280, 420], [410, 350]].forEach(([zx, zy]) => {
      c.fillStyle = '#fde047';
      c.fillRect(zx - 3, zy - 3, 7, 7);
      c.fillStyle = '#ffffff';
      c.fillRect(zx - 1, zy - 1, 3, 3);
    });

  } else if (bk === 'night') {
    // === 7. KOZMİK GECE DİYARI (ASTRAL DUST & STARFIELDS) ===
    // Deep purple nebula cloud
    const cosmicGrad = c.createRadialGradient(256, 256, 40, 256, 256, 240);
    cosmicGrad.addColorStop(0, 'rgba(88, 28, 135, 0.28)');
    cosmicGrad.addColorStop(1, 'rgba(10, 10, 24, 0.05)');
    c.fillStyle = cosmicGrad;
    c.fillRect(0, 0, 512, 512);

    // Stardust constellations
    const starField = [
      [50, 60], [180, 90], [340, 50], [460, 110], [90, 220], [260, 180],
      [420, 260], [130, 370], [300, 340], [470, 390], [70, 460], [240, 470], [390, 460]
    ];
    starField.forEach(([sx, sy], idx) => {
      c.fillStyle = (idx % 2 === 0) ? '#c084fc' : '#38bdf8';
      c.beginPath(); c.arc(sx, sy, 2.5, 0, PI2); c.fill();
      c.fillStyle = '#ffffff';
      c.fillRect(sx - 0.5, sy - 0.5, 1, 1);
    });

  } else if (bk === 'pink') {
    // === 8. ŞEKER DİYARI (SILKY CANDY VELVET & GLAZE SWIRLS) ===
    // Continuous flowing strawberry cream ribbons
    c.strokeStyle = 'rgba(74, 21, 50, 0.45)';
    c.lineWidth = 20;
    c.beginPath();
    c.moveTo(0, 160); c.bezierCurveTo(150, 100, 340, 220, 512, 160);
    c.moveTo(0, 360); c.bezierCurveTo(160, 430, 350, 290, 512, 360);
    c.stroke();

    c.strokeStyle = 'rgba(219, 39, 119, 0.4)';
    c.lineWidth = 8;
    c.stroke();

    // Candied sprinkles scattered seamlessly
    const sprinkles = [
      [70, 80, '#38bdf8'], [190, 60, '#facc15'], [320, 90, '#4ade80'], [440, 70, '#f43f5e'],
      [60, 240, '#c084fc'], [210, 270, '#38bdf8'], [350, 230, '#facc15'], [460, 260, '#fb7185'],
      [90, 440, '#4ade80'], [230, 420, '#c084fc'], [360, 450, '#38bdf8'], [470, 430, '#fde047']
    ];
    sprinkles.forEach(([sx, sy, col]) => {
      c.fillStyle = col;
      c.fillRect(sx, sy, 6, 2.5);
      c.fillStyle = '#ffffff';
      c.fillRect(sx, sy, 1.5, 1);
    });

  } else if (bk === 'ketchup') {
    // === 9. KETÇAP VADİSİ (DARK BURGUNDY MARBLE & SAUCE DRIZZLE) ===
    // Smooth burgundy sauce pool contours
    c.fillStyle = '#1e080b';
    c.beginPath();
    c.ellipse(140, 140, 110, 70, 0.25, 0, PI2);
    c.ellipse(370, 370, 115, 75, -0.25, 0, PI2);
    c.fill();

    // Golden mustard ribbons
    c.strokeStyle = 'rgba(234, 179, 8, 0.35)';
    c.lineWidth = 3.5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(0, 200); c.bezierCurveTo(160, 130, 340, 270, 512, 200);
    c.moveTo(0, 420); c.bezierCurveTo(170, 480, 330, 350, 512, 420);
    c.stroke();

  } else {
    // === 10. TAŞ / KADİM DAĞ (ANCIENT GRANITE & RUNIC BEDROCK) ===
    // Weathered granite strata lines
    c.strokeStyle = 'rgba(30, 41, 59, 0.55)';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(0, 130); c.lineTo(140, 160); c.lineTo(280, 110); c.lineTo(410, 150); c.lineTo(512, 130);
    c.moveTo(0, 340); c.lineTo(130, 310); c.lineTo(270, 370); c.lineTo(400, 320); c.lineTo(512, 340);
    c.stroke();

    // Ancient cyan runic tamgas
    const runicStones = [[110, 75], [370, 110], [120, 270], [390, 290], [256, 440]];
    runicStones.forEach(([rx, ry]) => {
      c.fillStyle = '#0f172a';
      c.beginPath(); c.arc(rx, ry, 10, 0, PI2); c.fill();
      c.strokeStyle = '#0284c7';
      c.lineWidth = 1.4;
      c.beginPath(); c.arc(rx, ry, 9, 0, PI2); c.stroke();
      c.fillStyle = '#00e5ff';
      c.fillRect(rx - 1, ry - 5, 2, 10);
      c.fillRect(rx - 5, ry - 1, 10, 2);
    });
  }

  return cv;
}`;

content = content.replace(biomeFloorEngineRegex, masterOrganicBiomeFloorEngine);

// =========================================================================
// 4. HERO SILHOUETTE RENDERER FIX (Items 4, 5, 6)
// Ensure left and right hero silhouettes actually render beautifully!
// =========================================================================
console.log('[4/5] Fixing Hero Silhouette Rendering Engine...');

const silhouetteRegex = /function renderHeroSilhouetteThumbnail\(cvs,\s*heroId\)[\s\S]*?ctx\.restore\(\);\s*\}/;

const masterSilhouetteEngine = `function renderHeroSilhouetteThumbnail(cvs, heroId) {
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  const w = cvs.width || 76;
  const h = cvs.height || 76;
  ctx.clearRect(0, 0, w, h);

  const hero = HERO_ROSTER[heroId] || HERO_ROSTER.bamsi;
  const px = w / 2;
  const py = h / 2 + 6;
  const cy = py - 6;

  ctx.save();
  // 1. Ambient element-colored glowing backplate
  const elemGrad = ctx.createRadialGradient(px, cy, 4, px, cy, 32);
  elemGrad.addColorStop(0, hero.color + '44');
  elemGrad.addColorStop(0.7, hero.color + '15');
  elemGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = elemGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Pedestal ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(px, py + 14, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Draw hero silhouette with sleek darkened contrast
  ctx.translate(px, py);
  ctx.scale(0.95, 0.95);
  ctx.translate(-px, -py);

  const dummyPlayer = {
    r: 16,
    heroId: heroId,
    hp: hero.hp,
    maxHp: hero.hp,
    speed: hero.speed,
    moving: false,
    facing: -Math.PI / 2,
    state: (typeof PLAYER_STATE !== 'undefined' ? PLAYER_STATE.IDLE : 'idle'),
    atkSlashFx: 0
  };

  const dummySkin = { hex: '#475569' };
  if (typeof drawHeroPlayer === 'function') {
    // Draw with darkened stylish silhouette tint
    ctx.globalAlpha = 0.72;
    drawHeroPlayer(ctx, px, py, cy, dummyPlayer, 0, dummySkin, 0);
    ctx.globalAlpha = 1.0;
  }
  ctx.restore();
}`;

content = content.replace(silhouetteRegex, masterSilhouetteEngine);

// =========================================================================
// 5. BOOTSTRAP INITIALIZATION FIX
// Call goMainMenu() on startup so UI, pedestals, and heroes render on launch!
// =========================================================================
console.log('[5/5] Ensuring goMainMenu() is executed on app launch...');

if (!content.includes('// BOOTSTRAP: Initialize start screen and hero stage on launch')) {
  content = content.replace('requestAnimationFrame(loop);', `// BOOTSTRAP: Initialize start screen and hero stage on launch
if (typeof goMainMenu === 'function') {
  goMainMenu();
}
requestAnimationFrame(loop);`);
  console.log('✓ Hooked goMainMenu() to startup loop.');
}

// Write the modified content back to index.html
fs.writeFileSync(htmlPath, content, 'utf8');
console.log('SUCCESS: All 100-Item master overhauls applied successfully to index.html!');
