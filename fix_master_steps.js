const fs = require('fs');

console.log('Reading index.html...');
let html = fs.readFileSync('index.html', 'utf8');

// Ensure html uses LF
html = html.replace(/\r\n/g, '\n');

// 1. Find .hero-showcase-section block in CSS
const cssStart = html.indexOf('/* 2. Hero Showcase Section (Derli Toplu, Sade ve Göz Yormayan) */');
const cssEnd = html.indexOf('/* 3. Action Core (Big Play Button & Daily Run) */');

console.log('cssStart:', cssStart, 'cssEnd:', cssEnd);

if (cssStart !== -1 && cssEnd !== -1) {
  const newShowcaseCSS = `/* 2. 3-Hero Carousel Stage & Dossier Card (Left/Right Silhouettes + Deep RPG Dossier) */
.hero-showcase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  flex: 1 1 auto;
  justify-content: center;
  margin: 2px 0;
  min-height: 0;
  gap: 8px;
}

/* 3-Hero Carousel Stage */
.hero-stage-carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 6px;
  padding: 4px 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y pinch-zoom;
}

.hero-stage-nav {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.88);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transition: transform 0.12s, border-color 0.2s, background 0.2s;
  z-index: 5;
  touch-action: manipulation;
}
.hero-stage-nav:active {
  transform: scale(0.88);
  background: rgba(56, 189, 248, 0.3);
  border-color: #38bdf8;
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
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease;
}

.hero-pedestal.pedestal-left,
.hero-pedestal.pedestal-right {
  opacity: 0.55;
  transform: scale(0.82);
  filter: brightness(0.42) contrast(1.1);
}
.hero-pedestal.pedestal-left:active,
.hero-pedestal.pedestal-right:active {
  transform: scale(0.88);
  opacity: 0.85;
}

.hero-pedestal.pedestal-center {
  opacity: 1;
  transform: scale(1.12);
  z-index: 4;
}

.hero-pedestal-canvas {
  width: 68px;
  height: 68px;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
}

.main-hero-canvas {
  width: 92px;
  height: 92px;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.75));
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.pedestal-disc {
  position: absolute;
  bottom: 12px;
  width: 60px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
}
.pedestal-disc.active {
  width: 80px;
  height: 20px;
  bottom: 16px;
  background: radial-gradient(ellipse at center, var(--hero-accent-alpha, rgba(56, 189, 248, 0.35)) 0%, transparent 72%);
  border: 1.5px solid var(--hero-accent, #38bdf8);
  box-shadow: 0 0 16px var(--hero-accent, rgba(56, 189, 248, 0.5));
}

.hero-stage-aura {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hero-accent-alpha, rgba(56, 189, 248, 0.22)) 0%, transparent 70%);
  pointer-events: none;
  animation: auraPulse 2.4s ease-in-out infinite alternate;
}
@keyframes auraPulse {
  0% { transform: scale(0.92); opacity: 0.6; }
  100% { transform: scale(1.15); opacity: 1.0; }
}

.pedestal-name {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #94a3b8;
  margin-top: 2px;
  text-transform: uppercase;
}

.hero-elem-indicator {
  font-size: 8.5px;
  font-weight: 900;
  color: var(--hero-accent, #38bdf8);
  background: var(--hero-accent-alpha, rgba(56, 189, 248, 0.18));
  border: 1px solid var(--hero-accent, #38bdf8);
  padding: 1.5px 8px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  margin-top: 2px;
  position: relative;
  z-index: 3;
}

/* Detailed Hero Dossier Card */
.hero-dossier-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(8, 12, 22, 0.98));
  border: 1.5px solid var(--hero-accent, rgba(56, 189, 248, 0.45));
  border-radius: 15px;
  padding: 8px 12px;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  color: var(--hero-accent, #38bdf8);
}
.hero-role-pill {
  font-size: 8px;
  font-weight: 900;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 1.5px 6px;
  border-radius: 5px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.hero-selected-tag {
  font-size: 8px;
  font-weight: 900;
  color: #10b981;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 2px 6px;
  border-radius: 5px;
  letter-spacing: 0.3px;
}
.hero-card-subtitle {
  font-size: 9.5px;
  font-weight: 700;
  color: #94a3b8;
  margin-top: -3px;
}

/* Mythological Weapon & Quote Box */
.hero-weapon-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 3px 8px;
  gap: 8px;
}
.weapon-info-line {
  display: flex;
  align-items: center;
  gap: 5px;
}
.weapon-icon { font-size: 11px; }
.weapon-label {
  font-size: 9.5px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 0.2px;
}
.hero-quote-inline {
  font-size: 8.5px;
  font-style: italic;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

/* RPG Stat Progress Bars */
.hero-rpg-bars {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px 10px;
  margin: 1px 0;
}
.rpg-bar-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.rpg-bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8.5px;
  font-weight: 800;
}
.rpg-stat-name { color: #94a3b8; }
.rpg-stat-val { color: #f8fafc; font-variant-numeric: tabular-nums; }
.rpg-bar-track {
  width: 100%;
  height: 6px;
  background: #090d16;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.rpg-bar-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.rpg-bar-fill.hp { background: linear-gradient(90deg, #dc2626, #ef4444); box-shadow: 0 0 6px rgba(239,68,68,0.5); }
.rpg-bar-fill.spd { background: linear-gradient(90deg, #0284c7, #38bdf8); box-shadow: 0 0 6px rgba(56,189,248,0.5); }
.rpg-bar-fill.dmg { background: linear-gradient(90deg, #d97706, #f59e0b); box-shadow: 0 0 6px rgba(245,158,11,0.5); }
.rpg-bar-fill.spc { background: linear-gradient(90deg, #9333ea, #c084fc); box-shadow: 0 0 6px rgba(192,132,252,0.5); }

/* Passive Card */
.hero-passive-card {
  background: rgba(2, 6, 23, 0.7);
  border-left: 2.5px solid var(--hero-accent, #38bdf8);
  border-radius: 3px 6px 6px 3px;
  padding: 4px 8px;
  text-align: left;
}
.hero-passive-header {
  display: flex;
  align-items: center;
  gap: 4px;
}
.passive-spark { font-size: 10px; line-height: 1; }
.hero-passive-lbl {
  font-size: 9px;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.2px;
}
.hero-passive-txt {
  font-size: 8.5px;
  line-height: 1.25;
  color: #cbd5e1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 1px;
}

.btn-hero-change {
  width: 100%;
  margin-top: 2px;
  padding: 6px 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(14, 165, 233, 0.26));
  border: 1.5px solid var(--hero-accent, #38bdf8);
  border-radius: 8px;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  touch-action: manipulation;
  transition: transform 0.12s ease, filter 0.12s ease;
}
.btn-hero-change:active {
  transform: scale(0.96);
  filter: brightness(1.2);
}
.btn-arrow-glow {
  color: var(--hero-accent, #38bdf8);
  transition: transform 0.15s ease;
}
.btn-hero-change:active .btn-arrow-glow {
  transform: translateX(4px);
}

`;
  html = html.slice(0, cssStart) + newShowcaseCSS + html.slice(cssEnd);
  console.log('Successfully replaced Hero Showcase CSS!');
}

// 2. Find createBiomeFloorCanvas block
const biomeFnStart = html.indexOf('function createBiomeFloorCanvas(biomeKey, visualMode) {');
const biomeFnEnd = html.indexOf('function getFloorPattern(biomeKey, visualMode) {');

console.log('biomeFnStart:', biomeFnStart, 'biomeFnEnd:', biomeFnEnd);

if (biomeFnStart !== -1 && biomeFnEnd !== -1) {
  const newBiomeCanvasFunction = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  // 256x256 Seamless Organic Procedural Terrain Engine - NO CHECKERBOARDS, NO HARD TILES
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 256;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = true;

  const bk = biomeKey || 'stone';
  const pRect = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h)); };

  if (bk === 'sand') {
    // === 1. KESİNTİSİZ ÇÖL KUMULLARI (SEAMLESS ORGANIC DUNES & GOLDEN SANDS) ===
    // Deep warm desert sands with sweeping continuous wind dunes - ZERO SQUARE TILES
    pRect(0, 0, 256, 256, '#180f06');

    // Smooth organic sweeping dune waves
    c.fillStyle = '#221509';
    c.beginPath();
    c.moveTo(0, 48); c.bezierCurveTo(80, 20, 160, 78, 256, 44);
    c.lineTo(256, 134); c.bezierCurveTo(180, 160, 90, 110, 0, 138);
    c.closePath(); c.fill();

    c.fillStyle = '#2d1c0c';
    c.beginPath();
    c.moveTo(0, 138); c.bezierCurveTo(90, 110, 180, 160, 256, 134);
    c.lineTo(256, 218); c.bezierCurveTo(170, 240, 80, 190, 0, 224);
    c.closePath(); c.fill();

    c.fillStyle = '#36220f';
    c.beginPath();
    c.moveTo(0, 224); c.bezierCurveTo(80, 190, 170, 240, 256, 218);
    c.lineTo(256, 256); c.lineTo(0, 256);
    c.closePath(); c.fill();

    // Wind ripples across the dunes (sinuous desert drift lines)
    c.strokeStyle = '#b45309';
    c.lineWidth = 1.2;
    c.globalAlpha = 0.45;
    for (let y = 16; y < 256; y += 28) {
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(64, y - 10, 128, y + 12, 192, y - 8);
      c.bezierCurveTo(220, y - 14, 240, y + 4, 256, y);
      c.stroke();
    }
    c.globalAlpha = 1.0;

    // Glowing ancient Tamga symbols buried in sand
    [[48, 54], [182, 86], [96, 170], [214, 210]].forEach(([rx, ry], i) => {
      c.fillStyle = '#451a03';
      c.beginPath(); c.arc(rx, ry, 10, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#d97706';
      c.lineWidth = 1.5;
      c.beginPath(); c.arc(rx, ry, 9, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#facc15';
      c.fillRect(rx - 1, ry - 4, 2, 8);
      c.fillRect(rx - 4, ry - 1, 8, 2);
    });

  } else if (bk === 'ice') {
    // === 2. KESİNTİSİZ KUTUP BUZULU (SEAMLESS POLAR PERMAFROST & GLACIAL CREVASSES) ===
    // Pure frozen tundra with translucent glacial fissures and frost stars - ZERO TILES
    pRect(0, 0, 256, 256, '#030d18');

    // Smooth organic permafrost fields
    c.fillStyle = '#06172a';
    c.beginPath();
    c.ellipse(72, 78, 88, 54, 0.25, 0, Math.PI * 2);
    c.ellipse(190, 176, 92, 58, -0.3, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#0a233d';
    c.beginPath();
    c.ellipse(78, 72, 58, 36, 0.25, 0, Math.PI * 2);
    c.ellipse(184, 170, 60, 38, -0.3, 0, Math.PI * 2);
    c.fill();

    // Glacial crystalline fissures branching across the ice
    c.strokeStyle = '#0284c7';
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(0, 92); c.lineTo(64, 82); c.lineTo(128, 120); c.lineTo(192, 90); c.lineTo(256, 104);
    c.moveTo(112, 0); c.lineTo(120, 88); c.lineTo(92, 168); c.lineTo(128, 256);
    c.moveTo(64, 82); c.lineTo(48, 160); c.lineTo(84, 230);
    c.stroke();

    c.strokeStyle = '#7dd3fc';
    c.lineWidth = 1.0;
    c.beginPath();
    c.moveTo(0, 92); c.lineTo(64, 82); c.lineTo(128, 120); c.lineTo(192, 90); c.lineTo(256, 104);
    c.moveTo(112, 0); c.lineTo(120, 88); c.lineTo(92, 168); c.lineTo(128, 256);
    c.stroke();

    // Luminous ice crystals / snow crystals
    [[48, 40], [184, 44], [84, 148], [208, 156], [40, 216], [160, 224]].forEach(([kx, ky]) => {
      c.fillStyle = 'rgba(224, 242, 254, 0.7)';
      c.fillRect(kx - 4, ky, 9, 1);
      c.fillRect(kx, ky - 4, 1, 9);
      c.fillStyle = '#ffffff';
      c.fillRect(kx - 1, ky - 1, 3, 3);
    });

  } else if (bk === 'lava') {
    // === 3. KESİNTİSİZ VOLKANİK BAZALT & AKKOR LAV DAMARLARI (SEAMLESS BASALT BEDROCK) ===
    pRect(0, 0, 256, 256, '#08080c');

    c.fillStyle = '#111218';
    c.beginPath();
    c.ellipse(64, 68, 64, 48, 0.2, 0, Math.PI * 2);
    c.ellipse(192, 64, 58, 44, -0.3, 0, Math.PI * 2);
    c.ellipse(72, 192, 60, 48, -0.2, 0, Math.PI * 2);
    c.ellipse(196, 192, 64, 48, 0.3, 0, Math.PI * 2);
    c.fill();

    // Flowing interconnected glowing magma rivers
    c.strokeStyle = '#7f1d1d';
    c.lineWidth = 18;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    c.strokeStyle = '#ea580c';
    c.lineWidth = 10;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    c.strokeStyle = '#facc15';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    // Molten magma core caldera at crossroads
    c.fillStyle = '#ea580c';
    c.beginPath(); c.arc(128, 128, 20, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fef08a';
    c.beginPath(); c.arc(128, 128, 10, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(128, 128, 4, 0, Math.PI * 2); c.fill();

    // Magma vents & fiery embers
    [[48, 124], [104, 120], [156, 136], [212, 128], [124, 64], [132, 192]].forEach(([bx, by]) => {
      c.fillStyle = '#ffedd5';
      c.fillRect(bx - 3, by - 3, 6, 6);
      c.fillStyle = '#ffffff';
      c.fillRect(bx - 1, by - 1, 3, 3);
    });

  } else if (bk === 'forest') {
    // === 4. KESİNTİSİZ SİSLİ ORMAN (SEAMLESS LUSH EARTH & CANOPY MOSS) ===
    pRect(0, 0, 256, 256, '#051108');

    c.fillStyle = '#081e0f';
    c.beginPath();
    c.ellipse(72, 80, 80, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 176, 76, 56, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0e2e18';
    c.beginPath();
    c.ellipse(76, 72, 52, 32, 0.2, 0, Math.PI * 2);
    c.ellipse(180, 168, 48, 36, -0.3, 0, Math.PI * 2);
    c.fill();

    // Natural roots winding across the earth
    c.strokeStyle = '#3e2723';
    c.lineWidth = 3.6;
    c.beginPath();
    c.moveTo(0, 48); c.bezierCurveTo(80, 72, 128, 24, 196, 76); c.lineTo(256, 64);
    c.moveTo(152, 0); c.bezierCurveTo(136, 96, 172, 164, 128, 256);
    c.stroke();
    c.strokeStyle = '#5d4037';
    c.lineWidth = 1.6;
    c.stroke();

    // Moss clusters & forest floor flora
    [[24, 28], [96, 32], [216, 36], [48, 144], [148, 116], [232, 136], [84, 224], [176, 228]].forEach(([tx, ty]) => {
      c.fillStyle = '#16a34a';
      c.fillRect(tx, ty, 3, 6);
      c.fillStyle = '#22c55e';
      c.fillRect(tx - 1, ty + 1, 2, 4);
      c.fillStyle = '#4ade80';
      c.fillRect(tx + 2, ty + 2, 2, 3);
    });

    // Wildflower dots
    [[36, 96, '#ef4444'], [172, 44, '#facc15'], [208, 104, '#38bdf8'], [68, 188, '#f472b6'], [124, 164, '#ffffff'], [220, 196, '#fbbf24']].forEach(([fx, fy, fcol]) => {
      c.fillStyle = fcol;
      c.beginPath(); c.arc(fx, fy, 2.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fef08a';
      c.fillRect(fx - 0.5, fy - 0.5, 1, 1);
    });

  } else if (bk === 'water') {
    // === 5. KESİNTİSİZ TURKUAZ LAGÜN & NİLÜFERLER (SEAMLESS AQUATIC BASIN) ===
    pRect(0, 0, 256, 256, '#021320');

    c.fillStyle = '#05243b';
    c.beginPath();
    c.ellipse(72, 80, 96, 56, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 176, 92, 60, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#08375c';
    c.beginPath();
    c.ellipse(76, 72, 60, 36, 0.2, 0, Math.PI * 2);
    c.ellipse(180, 168, 56, 36, -0.3, 0, Math.PI * 2);
    c.fill();

    // Gentle aquatic water ripples
    c.strokeStyle = '#0284c7';
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(0, 88); c.bezierCurveTo(72, 52, 148, 124, 256, 76);
    c.moveTo(0, 192); c.bezierCurveTo(92, 232, 168, 156, 256, 196);
    c.moveTo(96, 0); c.bezierCurveTo(64, 96, 144, 176, 88, 256);
    c.stroke();

    // Organic Lilypads & Lotus Flowers
    [[52, 52, 14], [196, 56, 15], [84, 148, 13], [208, 164, 16], [44, 216, 12], [148, 224, 14]].forEach(([lx, ly, lr]) => {
      c.fillStyle = '#14532d';
      c.beginPath(); c.arc(lx, ly + 1, lr, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(lx, ly, lr, 0.35, Math.PI * 2 - 0.35);
      c.lineTo(lx, ly);
      c.closePath();
      c.fill();
    });
    // Blooming lotus blooms
    [[52, 52], [208, 164], [148, 224]].forEach(([fx, fy]) => {
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(fx, fy, 4, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(fx, fy, 2, 0, Math.PI * 2); c.fill();
    });

  } else if (bk === 'pink') {
    // === 6. KESİNTİSİZ ŞEKER DİYARI (SMOOTH CANDY VELVET - NO WAFFLE GRID) ===
    // Beautiful continuous confectionary bedrock with sweet swirls and sprinkles - ZERO GRID LINES
    pRect(0, 0, 256, 256, '#200817');

    c.fillStyle = '#2c0c20';
    c.beginPath();
    c.ellipse(72, 72, 88, 56, 0.25, 0, Math.PI * 2);
    c.ellipse(184, 184, 92, 60, -0.3, 0, Math.PI * 2);
    c.fill();

    // Smooth flowing sugar glaze swirls
    c.strokeStyle = '#4a1532';
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(0, 80); c.bezierCurveTo(70, 50, 140, 110, 256, 80);
    c.moveTo(0, 180); c.bezierCurveTo(80, 220, 160, 150, 256, 190);
    c.stroke();
    c.strokeStyle = '#701a4e';
    c.lineWidth = 6;
    c.stroke();

    // Giant sugar glaze rosettes
    [[64, 64], [192, 64], [64, 192], [192, 192]].forEach(([lx, ly]) => {
      c.fillStyle = '#be185d';
      c.beginPath(); c.arc(lx, ly, 14, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(lx, ly, 10, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(lx, ly, 6, 0, Math.PI * 2); c.fill();
    });

    // Candied sprinkles scattered naturally
    [[28, 36, '#38bdf8'], [96, 20, '#facc15'], [160, 32, '#4ade80'], [228, 24, '#f43f5e'],
     [24, 120, '#c084fc'], [88, 152, '#38bdf8'], [156, 124, '#facc15'], [232, 144, '#fb7185'],
     [32, 232, '#4ade80'], [104, 228, '#c084fc'], [164, 240, '#38bdf8'], [224, 220, '#fde047']].forEach(([sx, sy, col]) => {
      c.fillStyle = col;
      c.fillRect(sx, sy, 5, 2);
      c.fillStyle = '#ffffff';
      c.fillRect(sx, sy, 1, 1);
    });

  } else if (bk === 'ketchup') {
    // === 7. KESİNTİSİZ KETÇAP VADİSİ (DARK MARBLE & SAUCE DRIZZLE - NO CHECKERBOARD TILES) ===
    // Continuous rich dark burgundy bedrock with organic sauce pools - ZERO SQUARES
    pRect(0, 0, 256, 256, '#120406');

    c.fillStyle = '#1c070a';
    c.beginPath();
    c.ellipse(72, 72, 84, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(184, 184, 88, 56, -0.2, 0, Math.PI * 2);
    c.fill();

    // Organic ketchup lakes
    [[72, 72, 36, 22], [192, 88, 32, 20], [88, 188, 38, 24], [204, 204, 30, 18], [128, 136, 28, 18]].forEach(([px, py, pw, ph]) => {
      c.fillStyle = '#7f1d1d';
      c.beginPath(); c.ellipse(px, py + 2, pw * 0.52, ph * 0.52, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#dc2626';
      c.beginPath(); c.ellipse(px, py, pw * 0.48, ph * 0.48, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f87171';
      c.beginPath(); c.ellipse(px - 3, py - 3, pw * 0.22, ph * 0.22, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.fillRect(px - 4, py - 4, 3, 3);
    });

    // Golden mustard ribbons
    c.strokeStyle = '#eab308';
    c.lineWidth = 2.8;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(44, 116); c.bezierCurveTo(68, 92, 84, 136, 108, 104);
    c.moveTo(164, 176); c.bezierCurveTo(188, 152, 208, 196, 236, 168);
    c.stroke();

  } else if (bk === 'storm') {
    // === 8. KESİNTİSİZ FIRTINA TEPESİ (SEAMLESS HIGH-VOLTAGE BEDROCK) ===
    pRect(0, 0, 256, 256, '#060814');

    c.fillStyle = '#0c1024';
    c.beginPath();
    c.ellipse(72, 84, 88, 56, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 172, 84, 56, -0.3, 0, Math.PI * 2);
    c.fill();

    // Branching high-voltage lightning cracks
    c.strokeStyle = '#312e81';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(0, 68); c.lineTo(56, 76); c.lineTo(96, 40); c.lineTo(164, 84); c.lineTo(216, 56); c.lineTo(256, 68);
    c.moveTo(128, 0); c.lineTo(112, 84); c.lineTo(156, 152); c.lineTo(104, 208); c.lineTo(120, 256);
    c.stroke();

    c.strokeStyle = '#00e5ff';
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(0, 68); c.lineTo(56, 76); c.lineTo(96, 40); c.lineTo(164, 84); c.lineTo(216, 56); c.lineTo(256, 68);
    c.moveTo(128, 0); c.lineTo(112, 84); c.lineTo(156, 152); c.lineTo(104, 208); c.lineTo(120, 256);
    c.stroke();

    c.strokeStyle = '#ffffff';
    c.lineWidth = 1.0;
    c.stroke();

    // Voltage arc sparks
    [[56, 76], [164, 84], [156, 152], [216, 56], [104, 208]].forEach(([zx, zy]) => {
      c.fillStyle = '#fde047';
      c.fillRect(zx - 3, zy - 3, 7, 7);
      c.fillStyle = '#ffffff';
      c.fillRect(zx - 1, zy - 1, 3, 3);
    });

  } else {
    // === 9. KESİNTİSİZ TAŞ / GECE DİYARI (ANCIENT GRANITE & RUNIC BEDROCK - ZERO TILES) ===
    pRect(0, 0, 256, 256, '#090d14');

    c.fillStyle = '#111822';
    c.beginPath();
    c.ellipse(72, 76, 84, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(184, 180, 88, 56, -0.2, 0, Math.PI * 2);
    c.fill();

    // Organic stone weathering cracks
    c.strokeStyle = '#1e293b';
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(36, 20); c.lineTo(68, 52); c.lineTo(92, 44);
    c.moveTo(152, 36); c.lineTo(176, 72); c.lineTo(224, 64);
    c.moveTo(24, 120); c.lineTo(52, 156);
    c.moveTo(136, 196); c.lineTo(172, 228); c.lineTo(208, 220);
    c.stroke();

    // Ancient Cyan Turkish Runic Tamgas embedded in bedrock
    [[48, 32], [168, 44], [44, 136], [128, 112], [176, 200]].forEach(([rx, ry], i) => {
      c.fillStyle = '#0f172a';
      c.beginPath(); c.arc(rx, ry, 11, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#0284c7';
      c.lineWidth = 1.4;
      c.beginPath(); c.arc(rx, ry, 10, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#00e5ff';
      c.fillRect(rx - 1, ry - 6, 2, 12);
      c.fillRect(rx - 6, ry - 1, 12, 2);
      c.fillStyle = '#ffffff';
      c.fillRect(rx - 2, ry - 2, 4, 4);
    });

    // Subtle ancient moss tufts
    [[124, 28], [128, 80], [84, 132], [180, 144], [112, 224]].forEach(([mx, my]) => {
      c.fillStyle = '#14532d';
      c.fillRect(mx, my, 5, 4);
      c.fillStyle = '#22c55e';
      c.fillRect(mx + 1, my + 1, 3, 2);
    });
  }

  return cv;
}

`;
  html = html.slice(0, biomeFnStart) + newBiomeCanvasFunction + html.slice(biomeFnEnd);
  console.log('Successfully replaced createBiomeFloorCanvas with 256x256 seamless organic procedural terrain!');
}

console.log('Writing updated index.html...');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
