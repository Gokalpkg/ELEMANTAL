const fs = require('fs');

console.log('Reading index.html for canvas selector fix and pedestal sizing...');
let html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Change generic 'canvas {' to '#gameCanvas {'
const oldCanvasRule = `  canvas {
    display: block; background: #141821; width: 100%; height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }`;

const newCanvasRule = `  #gameCanvas {
    display: block; background: #141821; width: 100%; height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }`;

if (html.includes(oldCanvasRule)) {
  html = html.replace(oldCanvasRule, newCanvasRule);
  console.log('Replaced generic canvas rule with #gameCanvas rule!');
} else {
  console.warn('Could not find oldCanvasRule verbatim, checking loose match...');
  html = html.replace(/\n  canvas\s*\{\s*\n\s*display:\s*block;\s*background:\s*#141821;\s*width:\s*100%;\s*height:\s*100%;/, `\n  #gameCanvas {\n    display: block; background: #141821; width: 100%; height: 100%;`);
}

// 2. Enhance .hero-stage-carousel, .hero-pedestal and .main-hero-canvas sizing
const cssTargetStart = html.indexOf('/* 2. 3-Hero Carousel Stage & Dossier Card');
const cssTargetEnd = html.indexOf('/* 3. Action Core (Big Play Button & Daily Run) */');

if (cssTargetStart !== -1 && cssTargetEnd !== -1) {
  const perfectHeroCSS = `/* 2. 3-Hero Carousel Stage & Dossier Card (Left/Right Silhouettes + Deep RPG Dossier) */
.hero-showcase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  flex: 0 0 auto;
  justify-content: center;
  margin: 1px 0;
  gap: 6px;
}

/* 3-Hero Carousel Stage */
.hero-stage-carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 380px;
  gap: 10px;
  padding: 2px 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y pinch-zoom;
}

.hero-stage-nav {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.92);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.55);
  transition: transform 0.12s, border-color 0.2s, background 0.2s;
  z-index: 5;
  touch-action: manipulation;
}
.hero-stage-nav:active {
  transform: scale(0.88);
  background: rgba(56, 189, 248, 0.35);
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
  width: 72px;
  flex: 0 0 72px;
}

.hero-pedestal.pedestal-left,
.hero-pedestal.pedestal-right {
  opacity: 0.52;
  transform: scale(0.82);
  filter: brightness(0.38) contrast(1.1);
}
.hero-pedestal.pedestal-left:active,
.hero-pedestal.pedestal-right:active {
  transform: scale(0.88);
  opacity: 0.85;
}

.hero-pedestal.pedestal-center {
  opacity: 1;
  transform: scale(1.08);
  z-index: 4;
  width: 104px;
  flex: 0 0 104px;
}

.hero-pedestal-canvas {
  width: 66px !important;
  height: 66px !important;
  max-width: 66px !important;
  max-height: 66px !important;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
  border-radius: 12px;
  display: block;
}

.main-hero-canvas {
  width: 96px !important;
  height: 96px !important;
  max-width: 96px !important;
  max-height: 96px !important;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.75));
  border-radius: 50%;
  position: relative;
  z-index: 2;
  display: block;
}

.pedestal-disc {
  position: absolute;
  bottom: 8px;
  width: 54px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
}
.pedestal-disc.active {
  width: 76px;
  height: 18px;
  bottom: 12px;
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
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #94a3b8;
  margin-top: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

.hero-elem-indicator {
  font-size: 8px;
  font-weight: 900;
  color: var(--hero-accent, #38bdf8);
  background: var(--hero-accent-alpha, rgba(56, 189, 248, 0.18));
  border: 1px solid var(--hero-accent, #38bdf8);
  padding: 1.5px 7px;
  border-radius: 999px;
  letter-spacing: 0.3px;
  white-space: nowrap;
  margin-top: 1px;
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
  border-radius: 14px;
  padding: 7px 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12);
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
  gap: 7px;
}
.hero-name-h {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.4px;
  color: var(--hero-accent, #38bdf8);
}
.hero-role-pill {
  font-size: 7.5px;
  font-weight: 900;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.hero-selected-tag {
  font-size: 7.5px;
  font-weight: 900;
  color: #10b981;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 1.5px 5px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}
.hero-card-subtitle {
  font-size: 9px;
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
  border-radius: 6px;
  padding: 2.5px 7px;
  gap: 6px;
}
.weapon-info-line {
  display: flex;
  align-items: center;
  gap: 4px;
}
.weapon-icon { font-size: 10px; }
.weapon-label {
  font-size: 9px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 0.2px;
}
.hero-quote-inline {
  font-size: 8px;
  font-style: italic;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

/* RPG Stat Progress Bars */
.hero-rpg-bars {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px 8px;
  margin: 1px 0;
}
.rpg-bar-item {
  display: flex;
  flex-direction: column;
  gap: 1.5px;
}
.rpg-bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  font-weight: 800;
}
.rpg-stat-name { color: #94a3b8; }
.rpg-stat-val { color: #f8fafc; font-variant-numeric: tabular-nums; }
.rpg-bar-track {
  width: 100%;
  height: 5px;
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
  border-radius: 3px 5px 5px 3px;
  padding: 3.5px 7px;
  text-align: left;
}
.hero-passive-header {
  display: flex;
  align-items: center;
  gap: 4px;
}
.passive-spark { font-size: 9.5px; line-height: 1; }
.hero-passive-lbl {
  font-size: 8.5px;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.2px;
}
.hero-passive-txt {
  font-size: 8px;
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
  margin-top: 1px;
  padding: 5px 8px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(14, 165, 233, 0.26));
  border: 1.5px solid var(--hero-accent, #38bdf8);
  border-radius: 7px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
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
  html = html.slice(0, cssTargetStart) + perfectHeroCSS + html.slice(cssTargetEnd);
  console.log('Updated Hero Showcase CSS with pixel-perfect pedestal sizing!');
}

console.log('Writing updated index.html...');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
