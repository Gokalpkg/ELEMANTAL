const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. DAMAGE FLOAT TEXT STYLING (REDUCE CLUTTER, ENHANCE CRITS)
// =========================================================================
const oldFloatCss = `.float-txt { position:absolute; font-weight:900; font-size:15px; text-shadow:0 1px 4px #000, 0 0 8px rgba(0,0,0,0.6); animation:floatUp 0.85s cubic-bezier(.22,1,.36,1) forwards; pointer-events:none; }
  .float-txt.crit { font-size:22px; animation:floatCrit 0.9s cubic-bezier(.22,1,.36,1) forwards; color:#ffd740 !important; text-shadow:0 0 12px rgba(255,215,64,0.7), 0 2px 6px #000; }
  .float-txt.big { font-size:20px; animation:floatBig 1s cubic-bezier(.22,1,.36,1) forwards; }
  .float-txt.kill { font-size:17px; animation:floatKill 0.95s cubic-bezier(.22,1,.36,1) forwards; }`;

const newFloatCss = `.float-txt { position:absolute; font-weight:800; font-size:11px; opacity:0.75; text-shadow:0 1px 3px rgba(0,0,0,0.9); animation:floatUp 0.7s ease-out forwards; pointer-events:none; }
  .float-txt.crit { font-weight:900; font-size:23px; opacity:1.0; animation:floatCrit 0.95s cubic-bezier(.22,1,.36,1) forwards; color:#ffd740 !important; text-shadow:0 0 14px rgba(255,215,64,0.9), 0 2px 8px #000; z-index:10; }
  .float-txt.big { font-size:17px; opacity:0.9; }
  .float-txt.kill { font-size:16px; opacity:0.95; animation:floatKill 0.85s cubic-bezier(.22,1,.36,1) forwards; }`;

if (html.includes(oldFloatCss)) {
  html = html.replace(oldFloatCss, newFloatCss);
  console.log('1. Successfully updated float-txt CSS for reduced clutter & enhanced crits!');
} else {
  console.log('Warning: oldFloatCss not found!');
}

// In spawnFloatText, prune excess text elements to prevent DOM flooding
const oldSpawnFloatCont = `  const cont = document.getElementById('floatingTexts');
  if (cont) cont.appendChild(el);
  setTimeout(() => el.remove(), isCrit ? 900 : 850);`;

const newSpawnFloatCont = `  const cont = document.getElementById('floatingTexts');
  if (cont) {
    if (!isCrit && !isKill && cont.childElementCount > 16) {
      const first = cont.firstElementChild;
      if (first) first.remove();
    }
    cont.appendChild(el);
  }
  setTimeout(() => el.remove(), isCrit ? 950 : 700);`;

if (html.includes(oldSpawnFloatCont)) {
  html = html.replace(oldSpawnFloatCont, newSpawnFloatCont);
  console.log('2. Successfully pruned excess floating texts in spawnFloatText!');
} else {
  console.log('Warning: oldSpawnFloatCont not found!');
}

// =========================================================================
// 2. SMOOTH CAMERA TRACKING (EXPONENTIAL LERP)
// =========================================================================
const oldCamLogic = `  const tx = player.x - W * 0.5;
  const ty = player.y - H * 0.46;
  const follow = 1 - Math.pow(0.86, Math.max(0.35, dt || 1));
  cam.x += (tx - cam.x) * follow;
  cam.y += (ty - cam.y) * follow;`;

const newCamLogic = `  const tx = player.x - W * 0.5;
  const ty = player.y - H * 0.46;
  // Cinematic smooth camera tracking (exponential lerp, eliminating micro-stutters)
  const lerpFactor = 1 - Math.exp(-9.0 * Math.max(0.008, Math.min(0.05, (dt || 1) * 0.016)));
  cam.x += (tx - cam.x) * lerpFactor;
  cam.y += (ty - cam.y) * lerpFactor;`;

if (html.includes(oldCamLogic)) {
  html = html.replace(oldCamLogic, newCamLogic);
  console.log('3. Successfully implemented cinematic smooth camera lerp in updateCam!');
} else {
  console.log('Warning: oldCamLogic not found!');
}

// =========================================================================
// 3. DASH GHOST TRAILS, I-FRAMES & DASH RECOVERY
// =========================================================================
const oldDashMovement = `  // --- DASH HAREKETİ VE COOLDOWN ---
  if (player.dashTime > 0) {
    player.dashTime -= dt * 16.67;
    player.invuln = Math.max(player.invuln, 8);
    const dSpd = player.speed * 3.8;
    tryMove(player, (player.dashDirX || 0) * dSpd * dt, (player.dashDirY || 0) * dSpd * dt);
    if (Math.random() < 0.6) {
      particles.push({
        x: player.x, y: player.y, r: 10, maxR: 18,
        life: 0.28, color: '#c084fc'
      });
    }
  }
  if (player.dashCd > 0) {
    player.dashCd -= dt * 16.67;
    if (player.dashCd <= 0) syncDashFab();
  }`;

const newDashMovement = `  // --- DASH HAREKETİ VE COOLDOWN ---
  if (player.dashTime > 0) {
    player.dashTime -= dt * 16.67;
    player.invuln = Math.max(player.invuln, 22); // Full i-frame invulnerability window
    const dSpd = player.speed * 4.2;
    tryMove(player, (player.dashDirX || 0) * dSpd * dt, (player.dashDirY || 0) * dSpd * dt);
    
    // Ghost Trail: spawn high-fidelity afterimage silhouettes during dash
    afterImg.push({
      x: player.x,
      y: player.y,
      facing: player.facing,
      life: 0.85,
      hex: Math.random() < 0.5 ? '#c084fc' : '#38bdf8',
      isGhost: true
    });
    if (afterImg.length > 22) afterImg.shift();

    if (Math.random() < 0.7) {
      particles.push({
        x: player.x + (Math.random() - 0.5) * 10,
        y: player.y + (Math.random() - 0.5) * 10,
        r: 8, maxR: 16,
        life: 0.32, color: '#c084fc'
      });
    }
  }
  if (player.dashCd > 0) {
    const cdRecov = 1 + (treeLv('dashRecovery') * 0.12);
    player.dashCd -= dt * 16.67 * cdRecov;
    if (player.dashCd <= 0) syncDashFab();
  }`;

if (html.includes(oldDashMovement)) {
  html = html.replace(oldDashMovement, newDashMovement);
  console.log('4. Successfully updated dash movement with ghost trails, i-frames and recovery!');
} else {
  console.log('Warning: oldDashMovement not found!');
}

// =========================================================================
// 4. AFTERIMAGE RENDERING (GHOST SILHOUETTES) & PLAYER I-FRAME BLINK
// =========================================================================
const oldAfterImgDraw = `  afterImg.forEach(a => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, a.life) * 0.28;
    drawBall3d(a.x, a.y, player.r * 0.92, visHex(a.hex || sk.hex, 'char'), 5);
    ctx.restore();
  });
  const pcol = visHex(sk.hex, 'char');
  const hopP = player.moving ? Math.abs(Math.sin(time * 0.38)) * 2.4 : 0;
  const pcy = py - 7 - hopP;
  ctx.save();
  if (ashHidden) ctx.globalAlpha = 0.36;`;

const newAfterImgDraw = `  afterImg.forEach(a => {
    ctx.save();
    if (a.isGhost) {
      ctx.globalAlpha = Math.max(0, a.life) * 0.55;
      ctx.shadowColor = a.hex || '#c084fc';
      ctx.shadowBlur = 10;
      drawHeroPlayer(ctx, a.x, a.y, a.y - 7, { ...player, facing: a.facing, state: PLAYER_STATE.RUN, atkSlashFx: 0 }, time, { hex: a.hex || '#c084fc' }, 0);
    } else {
      ctx.globalAlpha = Math.max(0, a.life) * 0.28;
      drawBall3d(a.x, a.y, player.r * 0.92, visHex(a.hex || sk.hex, 'char'), 5);
    }
    ctx.restore();
  });
  const pcol = visHex(sk.hex, 'char');
  const hopP = player.moving ? Math.abs(Math.sin(time * 0.38)) * 2.4 : 0;
  const pcy = py - 7 - hopP;
  ctx.save();
  if (ashHidden) ctx.globalAlpha = 0.36;
  // I-Frame Sprite Blinking (invulnerability feedback on dash & hurt)
  if (player.invuln > 0 && Math.floor(time * 16) % 2 === 0) {
    ctx.globalAlpha *= 0.32;
  }`;

if (html.includes(oldAfterImgDraw)) {
  html = html.replace(oldAfterImgDraw, newAfterImgDraw);
  console.log('5. Successfully added ghost silhouette rendering and i-frame blinking!');
} else {
  console.log('Warning: oldAfterImgDraw not found!');
}

// =========================================================================
// 5. FRUSTUM CULLING IN DRAWSHOT
// =========================================================================
const oldDrawShotStart = `function drawShot(p, color) {
  const c = visHex(color || p.color, 'shot');`;

const newDrawShotStart = `function drawShot(p, color) {
  // Frustum culling: skip off-screen projectiles immediately
  if (p.x < cam.x - 70 || p.x > cam.x + W + 70 || p.y < cam.y - 70 || p.y > cam.y + H + 70) return;
  const c = visHex(color || p.color, 'shot');`;

if (html.includes(oldDrawShotStart)) {
  html = html.replace(oldDrawShotStart, newDrawShotStart);
  console.log('6. Successfully added frustum culling to drawShot!');
} else {
  console.log('Warning: oldDrawShotStart not found!');
}

// =========================================================================
// 6. ROGUELITE META TREE (PERMANENT DAMAGE, CRIT, DASH RECOVERY)
// =========================================================================
const oldMetaTree = `const META_TREE = [
  { id:'hp', name:'Kalın Başlangıç', emoji:'❤️', max:5, costs:[32, 48, 68, 92, 120], hint:'Başlangıç canı +%5 / seviye' },
  { id:'gold', name:'Çifte Kristal', emoji:'✨', max:3, costs:[40, 65, 100], hint:'Kristalin %2 / seviye ikiye katlanma şansı' },
  { id:'shield', name:'Başlangıç Bariyeri', emoji:'🛡️', max:3, costs:[50, 85, 130], hint:'Koşu başında koruyucu enerji kalkanı verir' },
  { id:'magnet', name:'Uzak Mıknatıs', emoji:'🧲', max:4, costs:[35, 60, 95, 140], hint:'Kalıcı XP ve kristal çekme menzili +18px / seviye' },
  { id:'speed', name:'Hızlı Adımlar', emoji:'👟', max:3, costs:[45, 75, 115], hint:'Kalıcı hareket hızı +%4 / seviye' },
  { id:'startMod', name:'Hazır Eklenti', emoji:'🎁', max:1, costs:[150], hint:'Run başında 1 eklenti seçme hakkı' }
];`;

const newMetaTree = `const META_TREE = [
  { id:'hp', name:'Demir Beden', emoji:'❤️', max:5, costs:[32, 48, 68, 92, 120], hint:'Başlangıç canı +%5 / seviye' },
  { id:'damage', name:'Kadim Bıçak', emoji:'⚔️', max:5, costs:[35, 55, 80, 110, 150], hint:'Kalıcı saldırı hasarı +%6 / seviye' },
  { id:'crit', name:'Kritik Sezgi', emoji:'🎯', max:3, costs:[45, 75, 120], hint:'Kalıcı kritik vuruş şansı +%3 / seviye' },
  { id:'dashRecovery', name:'Çevik Hamle', emoji:'⚡', max:3, costs:[40, 70, 110], hint:'Dash bekleme süresini %12 hızlandırır' },
  { id:'gold', name:'Çifte Kristal', emoji:'✨', max:3, costs:[40, 65, 100], hint:'Kristalin %2 / seviye ikiye katlanma şansı' },
  { id:'shield', name:'Ruh Bariyeri', emoji:'🛡️', max:3, costs:[50, 85, 130], hint:'Koşu başında koruyucu enerji kalkanı verir' },
  { id:'magnet', name:'Uzak Mıknatıs', emoji:'🧲', max:4, costs:[35, 60, 95, 140], hint:'Kalıcı XP ve kristal çekme menzili +18px / seviye' },
  { id:'speed', name:'Hızlı Adımlar', emoji:'👟', max:3, costs:[45, 75, 115], hint:'Kalıcı hareket hızı +%4 / seviye' },
  { id:'startMod', name:'Gezginin Hediyesi', emoji:'🎁', max:1, costs:[150], hint:'Run başında 1 eklenti seçme hakkı' }
];`;

if (html.includes(oldMetaTree)) {
  html = html.replace(oldMetaTree, newMetaTree);
  console.log('7. Successfully expanded META_TREE with damage, crit & dashRecovery!');
} else {
  console.log('Warning: oldMetaTree not found!');
}

// Wire treeLv('damage') into auto & projectile damage
const oldPackDmg = `let packDmg = Math.round((sh.dmg != null ? sh.dmg : (auto.dmg || 10)) * (1 + (modValue('dmg') || 0) / 100));`;
const newPackDmg = `let packDmg = Math.round((sh.dmg != null ? sh.dmg : (auto.dmg || 10)) * (1 + (modValue('dmg') || 0) / 100) * (1 + treeLv('damage') * 0.06));`;

if (html.includes(oldPackDmg)) {
  html = html.replace(oldPackDmg, newPackDmg);
  console.log('8. Successfully connected treeLv("damage") to player projectile damage!');
} else {
  console.log('Warning: oldPackDmg not found!');
}

// Wire treeLv('crit') into critChancePct
const oldCritChance = `  const comboB = killCombo >= 10 ? 15 : killCombo >= 5 ? 8 : 0;
  return Math.min(CRIT_CAP, CRIT_BASE + crBonus + comboB);`;

const newCritChance = `  const comboB = killCombo >= 10 ? 15 : killCombo >= 5 ? 8 : 0;
  const treeCrit = treeLv('crit') * 3;
  return Math.min(CRIT_CAP, CRIT_BASE + crBonus + comboB + treeCrit);`;

if (html.includes(oldCritChance)) {
  html = html.replace(oldCritChance, newCritChance);
  console.log('9. Successfully connected treeLv("crit") to critChancePct!');
} else {
  console.log('Warning: oldCritChance not found!');
}

// =========================================================================
// 7. ASRA MERCHANT HUB UI (DIALOGUE & ROGUELITE UPGRADE PORTAL)
// =========================================================================
const oldTreeOverlay = `    <div id="treeOverlay" class="overlay tree-ov">
      <h2>💎 Yetenek Ağacı</h2>
      <p id="treeCrystalLabel" style="font-size:13px;opacity:.85;margin:0 0 8px;">0 kristal</p>
      <p style="font-size:12px;opacity:.7;margin:0 0 8px;">Her run’da toplanır, ölümde kalır. Kötü turda bile kristal kasarsın.</p>
      <div class="tree-list" id="treeList"></div>
      <div class="menu-btns">
        <button class="btn" id="treeCloseBtn" type="button">Tamam</button>
      </div>
    </div>`;

const newTreeOverlay = `    <div id="treeOverlay" class="overlay tree-ov asra-hub-overlay">
      <div class="asra-hub-card">
        <div class="asra-hub-portrait-wrap">
          <img src="img/ui-dialogue-system.jpg" alt="Asra" class="asra-hub-portrait">
        </div>
        <div class="asra-hub-dialogue-box">
          <div class="asra-speaker-name">🔮 Gezgin Asra'nın Ocağı</div>
          <div class="asra-dialogue-quote">"Her döngü seni biraz daha biler Gökalp... Topladığın kadim kristalleri bana sun; canını, kılıcını ve adımlarını ebediyen perçinleyeyim."</div>
        </div>
      </div>

      <div class="asra-crystal-bar">
        <span class="asra-crystal-label">Mevcut Kristal:</span>
        <span id="treeCrystalLabel" class="asra-crystal-val">0 kristal</span>
      </div>

      <div class="tree-list" id="treeList"></div>
      <div class="menu-btns" style="margin-top:12px;">
        <button class="btn btn-main-play" id="treeCloseBtn" type="button" style="min-width:180px;">Savaşa Dön ⚔️</button>
      </div>
    </div>`;

if (html.includes(oldTreeOverlay)) {
  html = html.replace(oldTreeOverlay, newTreeOverlay);
  console.log('10. Successfully replaced treeOverlay with Asra Hub Dialogue & Upgrade UI!');
} else {
  console.log('Warning: oldTreeOverlay not found!');
}

// Add CSS styling for Asra Hub Dialogue & Cards
const treeListCssMarker = `.tree-ov { justify-content:flex-start; padding-top:14px; overflow-y:auto; -webkit-overflow-scrolling:touch; }`;
const asraHubCss = `.tree-ov { justify-content:flex-start; padding-top:14px; overflow-y:auto; -webkit-overflow-scrolling:touch; }
  .asra-hub-card { width:100%; max-width:380px; display:flex; align-items:center; gap:12px; background:linear-gradient(135deg, rgba(30,27,75,0.92), rgba(15,23,42,0.95)); border:2px solid #a855f7; border-radius:14px; padding:10px 14px; margin-bottom:12px; box-shadow:0 0 16px rgba(168,85,247,0.35); }
  .asra-hub-portrait-wrap { width:58px; height:58px; flex:0 0 58px; border-radius:10px; overflow:hidden; border:2px solid #c084fc; box-shadow:0 0 8px #a855f7; }
  .asra-hub-portrait { width:100%; height:100%; object-fit:cover; display:block; }
  .asra-hub-dialogue-box { flex:1; min-width:0; text-align:left; }
  .asra-speaker-name { font-size:13px; font-weight:900; color:#facc15; letter-spacing:0.5px; margin-bottom:3px; }
  .asra-dialogue-quote { font-size:11px; color:#e2e8f0; line-height:1.35; font-style:italic; }
  .asra-crystal-bar { width:100%; max-width:380px; display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.55); border:1px solid rgba(192,132,252,0.4); border-radius:8px; padding:6px 14px; margin-bottom:10px; font-weight:800; font-size:13px; }
  .asra-crystal-label { color:#94a3b8; }
  .asra-crystal-val { color:#c084fc; font-size:14px; text-shadow:0 0 8px rgba(192,132,252,0.6); }`;

if (html.includes(treeListCssMarker)) {
  html = html.replace(treeListCssMarker, asraHubCss);
  console.log('11. Successfully added Asra Hub CSS styles!');
} else {
  console.log('Warning: treeListCssMarker not found!');
}

// Update Start Overlay button to "🔮 Asra & Yetenek"
const oldTreeStartBtn = `<button class="btn btn-sub" id="treeFromStartBtn" type="button">💎 Yetenek</button>`;
const newTreeStartBtn = `<button class="btn btn-sub" id="treeFromStartBtn" type="button" style="border-color:#c084fc; color:#e9d5ff;">🔮 Asra & Yetenek</button>`;

if (html.includes(oldTreeStartBtn)) {
  html = html.replace(oldTreeStartBtn, newTreeStartBtn);
  console.log('12. Successfully updated start menu button to Asra & Yetenek!');
} else {
  console.log('Warning: oldTreeStartBtn not found!');
}

// Add Asra Hub shortcut directly to Game Over overlay so player can spend crystals on defeat
const oldGameOverBtns = `<div class="menu-btns">
        <button class="btn" id="retryBuildBtn" type="button">Aynı build’le tekrar</button>
        <button class="btn" id="restartBtn">Yeniden Başlat</button>
        <button class="btn ghost" id="menuFromOverBtn">Ana Menü</button>
      </div>`;

const newGameOverBtns = `<div class="menu-btns">
        <button class="btn" id="asraFromOverBtn" type="button" style="background:linear-gradient(135deg,#7e22ce,#9333ea); border:1px solid #c084fc; color:#fff; font-weight:900; box-shadow:0 0 14px rgba(168,85,247,0.4);">🔮 Asra'nın Ocağı (Yükselt)</button>
        <button class="btn" id="retryBuildBtn" type="button">Aynı build’le tekrar</button>
        <button class="btn" id="restartBtn">Yeniden Başlat</button>
        <button class="btn ghost" id="menuFromOverBtn">Ana Menü</button>
      </div>`;

if (html.includes(oldGameOverBtns)) {
  html = html.replace(oldGameOverBtns, newGameOverBtns);
  console.log('13. Successfully added Asra Hub button to Game Over overlay!');
} else {
  console.log('Warning: oldGameOverBtns not found!');
}

// Add event listener for asraFromOverBtn
const oldOverInitMarker = `document.getElementById('menuFromOverBtn').addEventListener('click', () => {`;
const newOverInitMarker = `const asraOverBtn = document.getElementById('asraFromOverBtn');
  if (asraOverBtn) {
    asraOverBtn.addEventListener('click', () => {
      document.getElementById('gameOverOverlay').classList.remove('show');
      openTree();
    });
  }
  document.getElementById('menuFromOverBtn').addEventListener('click', () => {`;

if (html.includes(oldOverInitMarker)) {
  html = html.replace(oldOverInitMarker, newOverInitMarker);
  console.log('14. Successfully wired asraFromOverBtn event listener!');
} else {
  console.log('Warning: oldOverInitMarker not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
