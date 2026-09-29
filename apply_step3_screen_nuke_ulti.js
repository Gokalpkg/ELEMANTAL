const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. ADD #ultFab BUTTON IN HTML RIGHT AFTER #skillBar
// -------------------------------------------------------------
const oldSkillBarHtml = `<div id="skillBar"></div>`;
const newSkillBarHtml = `<div id="skillBar"></div>
    <button type="button" id="ultFab" class="ult-fab" aria-label="Kadim Ulti (Element Kıyameti)">
      <div class="ult-inner">
        <span class="ult-icon">⚡</span>
        <span class="ult-txt" id="ultTxt">%0</span>
      </div>
    </button>`;

if (html.includes(oldSkillBarHtml) && !html.includes('id="ultFab"')) {
  html = html.replace(oldSkillBarHtml, newSkillBarHtml);
  changes++;
  console.log('[1] Added #ultFab button markup into HTML');
} else {
  console.log('[1] #ultFab markup already exists or target not found');
}

// -------------------------------------------------------------
// 2. ENHANCE #ultFab CSS STYLING WITH GLOWING RADIAL DESIGN
// -------------------------------------------------------------
const oldUltFabCss = `  #ultFab {
    position: absolute; right: 14px; bottom: 84px; z-index: 8;
    width: 62px; height: 62px; border-radius: 50%;
    background: #0f121b; border: 2px solid #5a4b24;
    color: #ffd700; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.6);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, box-shadow 0.15s, border-color 0.2s;
  }
  #ultFab.ready {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.8), inset 0 0 12px rgba(255, 215, 0, 0.4);
    animation: ultPulse 1s ease-in-out infinite alternate;
  }`;

const newUltFabCss = `  #ultFab {
    position: absolute; right: 16px; bottom: 94px; z-index: 12;
    width: 62px; height: 62px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b, #090a10);
    border: 2.2px solid #5a4b24;
    color: #ffd700; cursor: pointer; display: none; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.7);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, box-shadow 0.2s, border-color 0.2s;
  }
  #ultFab.ready {
    border-color: #ffd700;
    background: radial-gradient(circle at 35% 35%, #581c87, #0f172a);
    box-shadow: 0 0 28px rgba(255, 215, 0, 0.9), inset 0 0 16px rgba(255, 215, 0, 0.5);
    animation: ultPulse 0.9s ease-in-out infinite alternate;
  }`;

if (html.includes(oldUltFabCss)) {
  html = html.replace(oldUltFabCss, newUltFabCss);
  changes++;
  console.log('[2] Updated #ultFab CSS styling');
} else {
  console.warn('[2] Warning: oldUltFabCss not found');
}

// -------------------------------------------------------------
// 3. IMPLEMENT syncUltFab() AND triggerUltimate()
// -------------------------------------------------------------
const oldUltFunctions = `function syncUltFab() {
  // KALDIRILDI: Nihai yetenek devre dışı
  syncDashFab();
  if (ultFab) ultFab.style.display = 'none';
}

const dashFab = document.getElementById('dashFab');
function syncDashFab() {
  // KALDIRILDI: Dash özelliği devre dışı
  if (dashFab) dashFab.style.display = 'none';
}

function triggerDash() {
  // KALDIRILDI: Dash özelliği devre dışı
  return;
}

function triggerUltimate() {
  // KALDIRILDI: Nihai yetenek devre dışı
  return;
}`;

const newUltFunctions = `function syncUltFab() {
  const el = document.getElementById('ultFab');
  if (!el) return;
  if (!running || menuOpen || paused) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'flex';
  const pct = Math.floor(Math.min(100, (ultEnergy / MAX_ULT_ENERGY) * 100));
  const txt = document.getElementById('ultTxt');
  const isReady = ultEnergy >= MAX_ULT_ENERGY;
  el.classList.toggle('ready', isReady);
  if (txt) {
    txt.textContent = isReady ? 'ULTİ!' : ('%' + pct);
    txt.style.color = isReady ? '#ffd700' : '#94a3b8';
  }
}

function triggerUltimate() {
  if (!running || paused || menuOpen) return;
  if (ultEnergy < MAX_ULT_ENERGY) {
    const pct = Math.floor((ultEnergy / MAX_ULT_ENERGY) * 100);
    spawnFloatText(player.x, player.y - 28, 'Ulti %' + pct + ' (Henüz Dolmadı)', '#94a3b8', 'small');
    playSfx('hit', 0.2, 300);
    vibrate(15);
    return;
  }

  // STEP 3: ACTIVATE SCREEN NUKE / ELEMENTAL CATACLYSM
  ultEnergy = 0;
  syncUltFab();

  // 1. Audio & Screen Visual Juice
  playSfx('explode', 0.65, 240);
  synthBlip('phase2_cue');
  triggerScreenFlash('#ffffff', 0.7, 300);
  shake = Math.max(shake, 26);
  camKick = 18;
  vibrate([60, 100, 60, 180]);
  triggerHitStop(16); // 16 frames epic impact freeze

  // 2. Banner & Float Text
  showStreakBanner('👑 ELEMENT KIYAMETİ!', '#ffd700');
  spawnFloatText(player.x, player.y - 42, '💥 TÜM EKRAN İNFİLAKI!', '#ffd700', 'crit');

  // 3. Delete All Enemy Projectiles (Screen Clear / Panic Relief)
  const clearedCount = enemyProjectiles ? enemyProjectiles.length : 0;
  if (enemyProjectiles && enemyProjectiles.length) {
    enemyProjectiles.forEach(p => {
      burst(p.x, p.y, '#ffd700', 8, 2.5);
      sparks.push({ x: p.x, y: p.y, vx: 0, vy: -1.5, r: 2.2, life: 0.35, maxLife: 0.35, color: '#facc15', rot: 0, vr: 0 });
    });
    enemyProjectiles = [];
  }
  if (clearedCount > 0) {
    spawnFloatText(player.x, player.y - 18, '🛡️ ' + clearedCount + ' Mermi Yok Edildi!', '#38bdf8', 'small');
  }

  // 4. Expanding Multi-Layer Shockwave (R = 520px Screen Nuke)
  particles.push({
    x: player.x, y: player.y,
    r: 20, maxR: 520,
    life: 1.1, maxLife: 1.1,
    color: '#ffd700',
    type: 'fusion_ring',
    lw: 10.0
  });
  particles.push({
    x: player.x, y: player.y,
    r: 30, maxR: 380,
    life: 0.9, maxLife: 0.9,
    color: '#c084fc',
    type: 'fusion_ring',
    lw: 8.0
  });
  particles.push({
    x: player.x, y: player.y,
    life: 1.2, maxLife: 1.2,
    type: 'mushroom',
    scale: 2.4
  });
  burst(player.x, player.y, '#ffd700', 36, 5.5);
  burst(player.x, player.y, '#ffffff', 20, 4.0);

  // 5. Deal Cataclysmic Damage to ALL Enemies on screen & Radial Knockback
  const nukeDmg = Math.round(140 + wave * 22);
  for (let j = enemies.length - 1; j >= 0; j--) {
    const en = enemies[j];
    const dist = Math.hypot(en.x - player.x, en.y - player.y);
    if (dist <= 540) {
      takeDamage(en, nukeDmg, 'storm', { crit: true });
      if (en.type !== 'boss') {
        const ang = Math.atan2(en.y - player.y, en.x - player.x);
        en.vx = Math.cos(ang) * 14;
        en.vy = Math.sin(ang) * 14;
        en.staggerTimer = 0.45;
      }
    }
  }
  pruneDeadEnemies();
}`;

if (html.includes(oldUltFunctions)) {
  html = html.replace(oldUltFunctions, newUltFunctions);
  changes++;
  console.log('[3] Implemented syncUltFab and triggerUltimate Screen Nuke');
} else {
  console.warn('[3] Warning: oldUltFunctions not found');
}

// -------------------------------------------------------------
// 4. AWARD ULT ENERGY ON ENEMY KILLS
// -------------------------------------------------------------
const oldKillEnemyStatTarget = `    if (typeof runStats !== 'undefined' && runStats) {
      runStats.kills = (runStats.kills || 0) + 1;
      if (en.type === 'boss') runStats.bossKills = (runStats.bossKills || 0) + 1;
    }`;

const newKillEnemyStatTarget = `    if (typeof runStats !== 'undefined' && runStats) {
      runStats.kills = (runStats.kills || 0) + 1;
      if (en.type === 'boss') runStats.bossKills = (runStats.bossKills || 0) + 1;
    }
    // STEP 3: Ult Energy on Kills (+3.5 for mob, +25 for boss)
    if (typeof ultEnergy !== 'undefined' && ultEnergy < MAX_ULT_ENERGY) {
      ultEnergy = Math.min(MAX_ULT_ENERGY, ultEnergy + (en.type === 'boss' ? 25 : 3.5));
      if (ultEnergy >= MAX_ULT_ENERGY) {
        spawnFloatText(player.x, player.y - 36, '⚡ KADİM ULTİ HAZIR! ⚡', '#ffd700', 'big');
        playSfx('skill', 0.4, 780);
        vibrate([35, 50, 35]);
      }
      syncUltFab();
    }`;

if (html.includes(oldKillEnemyStatTarget)) {
  html = html.replace(oldKillEnemyStatTarget, newKillEnemyStatTarget);
  changes++;
  console.log('[4] Hooked Ult Energy charge on kills in killEnemy');
} else {
  console.warn('[4] Warning: oldKillEnemyStatTarget not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 3 apply script. Total successful patches: ${changes}`);
