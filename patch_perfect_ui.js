const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

console.log('=== REFINING UI, PEDESTALS & INITIALIZATION ===');

// 1. Fix devMode to false by default (hides BÖLÜM SEÇİCİ)
content = content.replace('let devMode = true;', 'let devMode = false;');
console.log('✓ Disabled devMode by default.');

// 2. Remove accidental goMainMenu() inside hitStopUntil
content = content.replace(`      // BOOTSTRAP: Initialize start screen and hero stage on launch
if (typeof goMainMenu === 'function') {
  goMainMenu();
}
requestAnimationFrame(loop);`, `requestAnimationFrame(loop);`);
console.log('✓ Cleaned up loop hitStop bootstrap placement.');

// 3. Put goMainMenu() at the actual bottom of the script
if (!content.includes('// FINAL BOOTSTRAP: Start at Main Menu')) {
  content = content.replace(`requestAnimationFrame(loop);
})();`, `// FINAL BOOTSTRAP: Start at Main Menu
if (typeof goMainMenu === 'function') {
  goMainMenu();
}
requestAnimationFrame(loop);
})();`);
  console.log('✓ Placed goMainMenu() at the true script bootstrap point.');
}

// 4. Fix Brand Title "ELEMENTER" visibility in CSS
const brandTitleOld = `.menu-brand-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 40%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`;

const brandTitleNew = `.menu-brand-title {
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 1.2px;
  margin: 0;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
}`;

content = content.replace(brandTitleOld, brandTitleNew);

// 5. Update renderHeroSilhouetteThumbnail to reliably draw hero sprites with rich elemental aura
const silEngineOldRegex = /function renderHeroSilhouetteThumbnail\(cvs,\s*heroId\)[\s\S]*?ctx\.restore\(\);\s*\}/;

const silEngineNew = `function renderHeroSilhouetteThumbnail(cvs, heroId) {
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
  // 1. Ambient element glow backplate
  const aura = ctx.createRadialGradient(px, cy, 2, px, cy, 28);
  aura.addColorStop(0, hero.color + '55');
  aura.addColorStop(0.7, hero.color + '18');
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(px, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  // 2. Pedestal ground shadow & ring
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(px, py + 12, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = hero.color + '77';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(px, py + 12, 16, 5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Draw hero model scaled for silhouette preview
  ctx.translate(px, py);
  ctx.scale(1.05, 1.05);
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

  const dummySkin = { hex: hero.color };
  if (typeof drawHeroPlayer === 'function') {
    ctx.save();
    ctx.globalAlpha = 0.85;
    drawHeroPlayer(ctx, px, py, cy, dummyPlayer, performance.now() * 0.002, dummySkin, 0);
    ctx.restore();
  }
  ctx.restore();
}`;

content = content.replace(silEngineOldRegex, silEngineNew);

// 6. In animation loop, also re-render left and right silhouettes so they animate live
const loopHeroAnimRegex = /if \(mainCvs && overlayVisible\('startOverlay'\)\) \{\s*renderHeroThumbnail\(mainCvs, selectedHeroId, animT\);\s*\}/;

const loopHeroAnimNew = `if (mainCvs && overlayVisible('startOverlay')) {
          renderHeroThumbnail(mainCvs, selectedHeroId, animT);
          const curIdx = HERO_CYCLE_KEYS.indexOf(selectedHeroId);
          const prevHeroKey = HERO_CYCLE_KEYS[(curIdx - 1 + HERO_CYCLE_KEYS.length) % HERO_CYCLE_KEYS.length];
          const nextHeroKey = HERO_CYCLE_KEYS[(curIdx + 1) % HERO_CYCLE_KEYS.length];
          const leftCvs = document.getElementById('heroSilhouetteLeft');
          if (leftCvs) renderHeroSilhouetteThumbnail(leftCvs, prevHeroKey);
          const rightCvs = document.getElementById('heroSilhouetteRight');
          if (rightCvs) renderHeroSilhouetteThumbnail(rightCvs, nextHeroKey);
        }`;

content = content.replace(loopHeroAnimRegex, loopHeroAnimNew);

// 7. Refine Bottom Dock CSS to fit neatly on 360-400px mobile screens without clipping Ayarlar
const bottomDockCssOld = /\.menu-bottom-dock\s*\{[\s\S]*?\.dock-item\s*\{[\s\S]*?\}/;

const bottomDockCssNew = `.menu-bottom-dock {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 390px;
  gap: 6px;
  padding: 4px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-sizing: border-box;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 2px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.1s, background 0.15s, color 0.15s;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.dock-item:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}
.dock-item .dock-icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
}
.dock-item .dock-label {
  font-size: 10px;
  font-weight: 800;
  color: #f1f5f9;
  white-space: nowrap;
  letter-spacing: 0.2px;
}
.dock-item .dock-sub {
  font-size: 7.5px;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap;
}`;

content = content.replace(bottomDockCssOld, bottomDockCssNew);

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('SUCCESS: Refinements applied successfully!');
