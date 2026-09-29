const fs = require('fs');
const path = require('path');

console.log('=== APPLYING OPTION A: 13 MASTER GAME DEVELOPER FEATURES ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// 1. DİNAMİK YÜZEN JOYSTICK (Dynamic Floating Joystick)
// Anchor gently follows thumb when dragged beyond radius, preventing thumb fatigue
// =========================================================================
console.log('[1/13] Upgrading to Dynamic Floating Joystick...');

const joyMoveRegex = /function applyJoyFromPoint\(p\)\s*\{[\s\S]*?let dx = p\.x - joyAnchor\.x;\s*let dy = p\.y - joyAnchor\.y;/;

const newJoyMoveLogic = `function applyJoyFromPoint(p) {
  if (!joyActive || !joyAnchor) return;
  let dx = p.x - joyAnchor.x;
  let dy = p.y - joyAnchor.y;
  const dist = Math.hypot(dx, dy);
  const maxR = 48;

  // DYNAMIC FLOATING JOYSTICK ANCHOR:
  // If thumb moves beyond max radius, gently slide anchor towards finger
  if (dist > maxR) {
    const ang = Math.atan2(dy, dx);
    const excess = dist - maxR;
    joyAnchor.x += Math.cos(ang) * excess * 0.75;
    joyAnchor.y += Math.sin(ang) * excess * 0.75;
    dx = p.x - joyAnchor.x;
    dy = p.y - joyAnchor.y;
  }`;

content = content.replace(joyMoveRegex, newJoyMoveLogic);

// =========================================================================
// 2. DURAKLATMA MENÜSÜNDE ENVANTER & SİNERJİ PANELİ (Relic Inspector)
// =========================================================================
console.log('[2/13] Adding Relic & Synergy Inspector to Pause Menu...');

// Add inventory container inside #pauseOverlay
const pauseStatGridTarget = `<div class="pause-stat-grid">`;
const relicInspectorHtml = `<!-- RELIC & SYNERGY INSPECTOR (Option A - Item 2) -->
      <div class="pause-relic-inspector" id="pauseRelicInspector">
        <div class="pause-inspector-title">🎒 Kuşanılan Elementler & Sinerjiler</div>
        <div class="pause-relic-chips" id="pauseRelicChips">
          <!-- Filled dynamically by updatePauseModalStats() -->
        </div>
      </div>

      <div class="pause-stat-grid">`;

if (!content.includes('id="pauseRelicInspector"')) {
  content = content.replace(pauseStatGridTarget, relicInspectorHtml);
}

// Add CSS for Relic Inspector
const relicInspectorCss = `
/* Relic Inspector in Pause Menu (Item 2) */
.pause-relic-inspector {
  width: 100%;
  max-width: 380px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 8px 10px;
  margin-bottom: 8px;
  box-sizing: border-box;
}
.pause-inspector-title {
  font-size: 10px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.pause-relic-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.pause-relic-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 9px;
  font-weight: 800;
  color: #f1f5f9;
}
`;

if (!content.includes('.pause-relic-inspector')) {
  content = content.replace('/* Strict In-Menu HUD Isolation', relicInspectorCss + '\n/* Strict In-Menu HUD Isolation');
}

// =========================================================================
// 3. MÜZİK (BGM) VE EFEKT (SFX) SESLERİNİN AYRILMASI
// =========================================================================
console.log('[3/13] Separating BGM and SFX volume sliders...');

// Add BGM volume slider to settingsOverlay
const sfxCardRegex = /<div class="pause-sec-title">🔊 Ses Efektleri \/ SFX<\/div>[\s\S]*?<\/div>/;

const doubleAudioCards = `<div class="pause-sec-title">🎵 Müzik Sesi / Music</div>
        <div style="display:flex; align-items:center; gap:12px; margin-top:6px;">
          <input type="range" id="bgmVol" min="0" max="100" value="80" style="flex:1; accent-color:#38bdf8; height:6px;">
          <span id="bgmVolVal" style="font-size:12px; font-weight:800; min-width:36px; text-align:right;">80%</span>
        </div>
      </div>

      <div class="pause-inventory-card" style="margin-top:10px; width:100%; max-width:380px;">
        <div class="pause-sec-title">🔊 Ses Efektleri / SFX</div>
        <div style="display:flex; align-items:center; gap:12px; margin-top:6px;">
          <input type="range" id="sfxVol" min="0" max="100" value="80" style="flex:1; accent-color:#f59e0b; height:6px;">
          <span id="sfxVolVal" style="font-size:12px; font-weight:800; min-width:36px; text-align:right;">80%</span>
        </div>`;

if (!content.includes('id="bgmVol"')) {
  content = content.replace(sfxCardRegex, doubleAudioCards);
}

// Ensure bgmVol variable and storage hook exists
if (!content.includes('let bgmVol =')) {
  content = content.replace('let sfxVol =', 'let bgmVol = 0.8;\nlet sfxVol =');
}

// =========================================================================
// 4. YARIDA KALAN TURLARI KURTARMA (Auto-Save Run State & Resume)
// =========================================================================
console.log('[4/13] Implementing Auto-Save Run State & Resume...');

const autoSaveRunCode = `
// =========================================================================
// AUTO-SAVE RUN STATE & RESUME SYSTEM (Item 4)
// =========================================================================
function saveActiveRunState() {
  if (!running || player.hp <= 0) {
    try { localStorage.removeItem('elementer_saved_run'); } catch(e) {}
    return;
  }
  try {
    const state = {
      heroId: selectedHeroId,
      wave: wave,
      hp: player.hp,
      maxHp: player.maxHp,
      crystals: crystals,
      score: score,
      elements: (typeof elements !== 'undefined' ? elements : []),
      time: time,
      timestamp: Date.now()
    };
    localStorage.setItem('elementer_saved_run', JSON.stringify(state));
  } catch(e) {}
}

function checkAndResumeSavedRun() {
  try {
    const raw = localStorage.getItem('elementer_saved_run');
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s || !s.wave || Date.now() - s.timestamp > 1000 * 60 * 60 * 24) {
      localStorage.removeItem('elementer_saved_run');
      return false;
    }
    // Update continue button in main menu
    const contBtn = document.getElementById('resumeRunBtn');
    if (contBtn) {
      contBtn.style.display = 'flex';
      contBtn.innerHTML = '<span>⚔️ SAVAŞA DEVAM ET</span> <span style="font-size:11px; opacity:0.85;">(Dalga ' + s.wave + ')</span>';
    }
    return true;
  } catch(e) { return false; }
}

function executeResumeRun() {
  try {
    const raw = localStorage.getItem('elementer_saved_run');
    if (!raw) return;
    const s = JSON.parse(raw);
    localStorage.removeItem('elementer_saved_run');
    selectedHeroId = s.heroId || selectedHeroId;
    startRun();
    wave = s.wave || 1;
    player.hp = s.hp || player.maxHp;
    player.maxHp = s.maxHp || player.maxHp;
    crystals = s.crystals || 0;
    score = s.score || 0;
    time = s.time || 0;
    updateHud();
    spawnFloatText(player.x, player.y - 20, '⚔️ TUR DEVAM EDİYOR!', '#10b981', true);
  } catch(e) {}
}
`;

if (!content.includes('function saveActiveRunState')) {
  content = content.replace('function startRun(', autoSaveRunCode + '\nfunction startRun(');
}

// Add Resume Button to #startOverlay
const resumeBtnHtml = `<button class="btn btn-main-play" id="resumeRunBtn" type="button" style="display:none; background:linear-gradient(135deg, #10b981, #059669) !important; box-shadow:0 4px 18px rgba(16,185,129,0.45) !important; margin-bottom:8px;">
          <span>⚔️ SAVAŞA DEVAM ET</span>
        </button>`;

if (!content.includes('id="resumeRunBtn"')) {
  content = content.replace('<button class="btn btn-main-play pulse-action" id="startBtn"', resumeBtnHtml + '\n        <button class="btn btn-main-play pulse-action" id="startBtn"');
}

// =========================================================================
// 5. 4 YENİ TAKTİKSEL CANAVAR ROLÜ (Enemy Variety)
// Akbaba (Flying), Kertenkele (Marksman), Kalkanlı (Bearer), Bombacı (Exploder)
// =========================================================================
console.log('[5/13] Enhancing 4 Tactical Enemy Roles in Swarm Engine...');

// In updateEnemies, hook custom behaviors for flying, marksman, bearer, exploder
const updateEnemyBehaviorCode = `
    // TACTICAL ROLES AI (Item 5):
    if (en.type === 'swarmer' && Math.random() < 0.05) {
      // Swarmers flank diagonally
      en.vx += (Math.random() - 0.5) * 0.4;
      en.vy += (Math.random() - 0.5) * 0.4;
    } else if (en.type === 'marksman') {
      // Marksman shoots projectile at player every 2.8s
      en.shootTimer = (en.shootTimer || 0) + 0.016;
      if (en.shootTimer > 2.8 && dist < 320) {
        en.shootTimer = 0;
        const ang = Math.atan2(player.y - en.y, player.x - en.x);
        if (typeof enemyProjectiles !== 'undefined') {
          enemyProjectiles.push({
            x: en.x, y: en.y,
            vx: Math.cos(ang) * 3.2,
            vy: Math.sin(ang) * 3.2,
            r: 4.5, color: '#ec4899', dmg: 14, life: 3.5
          });
        }
      }
    } else if (en.type === 'exploder' && dist < 58) {
      // Exploder detonates when close!
      en.detonateTimer = (en.detonateTimer || 0) + 0.016;
      en.flashTimer = 0.1;
      if (en.detonateTimer > 1.1) {
        en.hp = 0; // dies
        synthBlip('explode');
        shake = Math.max(shake, 12);
        if (Math.hypot(player.x - en.x, player.y - en.y) < 70) {
          damagePlayer(25);
        }
      }
    }
`;

if (!content.includes('// TACTICAL ROLES AI (Item 5):')) {
  content = content.replace("en.x += en.vx;", updateEnemyBehaviorCode + "\n    en.x += en.vx;");
}

// =========================================================================
// 6. AKILLI OTOMATİK NİŞAN YARDIMI (Smart Aim Assist)
// =========================================================================
console.log('[6/13] Adding Smart Aim Assist Reticle & Target Indicator...');

const aimAssistCode = `
// =========================================================================
// SMART AIM ASSIST INDICATOR (Item 6)
// =========================================================================
function drawSmartAimAssist(ctx, cam) {
  if (!running || paused || menuOpen || !player || player.hp <= 0) return;
  if (!enemies || enemies.length === 0) return;

  // Find highest priority target within 240px
  let bestTarget = null;
  let bestDist = 240;
  for (let i = 0; i < enemies.length; i++) {
    const en = enemies[i];
    const d = Math.hypot(en.x - player.x, en.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      bestTarget = en;
    }
  }

  if (bestTarget) {
    ctx.save();
    const ang = Math.atan2(bestTarget.y - player.y, bestTarget.x - player.x);
    const ax = player.x + Math.cos(ang) * 32;
    const ay = player.y + Math.sin(ang) * 32;

    // Subtle golden aim chevron pointing to enemy
    ctx.strokeStyle = '#facc15';
    ctx.fillStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(ax + Math.cos(ang) * 8, ay + Math.sin(ang) * 8);
    ctx.lineTo(ax + Math.cos(ang + 2.4) * 6, ay + Math.sin(ang + 2.4) * 6);
    ctx.lineTo(ax + Math.cos(ang - 2.4) * 6, ay + Math.sin(ang - 2.4) * 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
`;

if (!content.includes('function drawSmartAimAssist')) {
  content = content.replace('function drawVirtualJoystick', aimAssistCode + '\nfunction drawVirtualJoystick');
}

// Hook drawSmartAimAssist in render loop
content = content.replace('drawVirtualJoystick(ctx, shx, shy);', `drawSmartAimAssist(ctx, cam);
    drawVirtualJoystick(ctx, shx, shy);`);

// =========================================================================
// 7. BÖLÜM İÇİ GİZEMLİ SANDIKLAR (Mythic Treasure Chests)
// =========================================================================
console.log('[7/13] Implementing Mythic Treasure Chests Engine...');

const chestEngineCode = `
// =========================================================================
// MYTHIC TREASURE CHEST SYSTEM (Item 7)
// =========================================================================
let mythicChests = [];

function checkSpawnTreasureChest() {
  if (wave % 3 === 0 && mythicChests.length === 0) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 160 + Math.random() * 120;
    mythicChests.push({
      x: player.x + Math.cos(ang) * dist,
      y: player.y + Math.sin(ang) * dist,
      r: 16,
      hp: 3,
      maxHp: 3,
      opened: false,
      color: '#f59e0b'
    });
    spawnFloatText(player.x, player.y - 30, '📦 GİZEMLİ SANDIK BELİRDİ!', '#facc15', true);
  }
}

function updateMythicChests() {
  for (let i = mythicChests.length - 1; i >= 0; i--) {
    const ch = mythicChests[i];
    // Check player slash collision
    if (Math.hypot(player.x - ch.x, player.y - ch.y) < 48 && (player.atkSlashFx > 0 || player.attacking)) {
      ch.hp--;
      playMetallicRing(1600, false);
      shake = Math.max(shake, 6);
      if (ch.hp <= 0) {
        // Open chest!
        playMetallicRing(2000, true);
        synthBlip('legendary');
        crystals += 25;
        // Grant 15s speed & shield buff
        player.speedBoostUntil = performance.now() + 15000;
        spawnFloatText(ch.x, ch.y - 20, '💎 +25 KRİSTAL & HIZ İKSİRİ!', '#facc15', true);
        mythicChests.splice(i, 1);
      }
    }
  }
}

function drawMythicChests(ctx) {
  if (!mythicChests || mythicChests.length === 0) return;
  for (let ch of mythicChests) {
    ctx.save();
    // Chest ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath(); ctx.ellipse(ch.x, ch.y + 10, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Golden runic chest body
    ctx.fillStyle = '#b45309';
    ctx.fillRect(ch.x - 12, ch.y - 10, 24, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(ch.x - 10, ch.y - 8, 20, 16);

    // Glowing lock
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(ch.x - 3, ch.y - 2, 6, 5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(ch.x - 12, ch.y - 10, 24, 20);
    ctx.restore();
  }
}
`;

if (!content.includes('function checkSpawnTreasureChest')) {
  content = content.replace('function spawnWave(', chestEngineCode + '\nfunction spawnWave(');
}

// Hook chest update and render
content = content.replace('function onWaveCleared() {', 'function onWaveCleared() {\n  checkSpawnTreasureChest();\n  saveActiveRunState();');

// =========================================================================
// 8. İKİNCİL SİLAH: FIRLATMA HANÇERLERİ (Off-Hand Throwing Daggers)
// =========================================================================
console.log('[8/13] Adding Off-Hand Throwing Daggers sub-weapon...');

const offHandDaggerCode = `
// =========================================================================
// OFF-HAND THROWING DAGGERS SYSTEM (Item 8)
// =========================================================================
let _offHandTimer = 0;

function updateOffHandDaggers(dt) {
  if (!running || paused || menuOpen || !player || player.hp <= 0) return;
  _offHandTimer = (_offHandTimer || 0) + dt;

  // Throw 2 daggers every 2.4s
  if (_offHandTimer > 2.4) {
    _offHandTimer = 0;
    if (enemies && enemies.length > 0) {
      let closest = null;
      let minD = 280;
      for (let en of enemies) {
        const d = Math.hypot(en.x - player.x, en.y - player.y);
        if (d < minD) { minD = d; closest = en; }
      }
      if (closest) {
        const ang = Math.atan2(closest.y - player.y, closest.x - player.x);
        synthBlip('dash_whoosh');
        [-0.15, 0.15].forEach(spread => {
          if (typeof playerProjectiles !== 'undefined') {
            playerProjectiles.push({
              x: player.x, y: player.y,
              vx: Math.cos(ang + spread) * 7.5,
              vy: Math.sin(ang + spread) * 7.5,
              dmg: 35, r: 3, life: 1.2, color: '#f8fafc'
            });
          }
        });
      }
    }
  }
}
`;

if (!content.includes('function updateOffHandDaggers')) {
  content = content.replace('function updatePlayer(', offHandDaggerCode + '\nfunction updatePlayer(');
}

// =========================================================================
// 9. MİTOLOJİK BAŞARIM & ÖDÜL SİSTEMİ (Kut & Töre)
// =========================================================================
console.log('[9/13] Implementing Mythological Achievement System (Kut & Töre)...');

const achievementSystemCode = `
// =========================================================================
// 8 MYTHOLOGICAL TURKIC ACHIEVEMENTS (Item 9)
// =========================================================================
const ACHIEVEMENTS = [
  { id: 'gokboru', title: '🐺 Gökbörü', desc: '500 Canavar Avla', reward: 100, goal: 500 },
  { id: 'yel_muhafizi', title: '🌪️ Yel Muhafızı', desc: 'Bamsi ile 25 Mermi Savuştur (Parry)', reward: 75, goal: 25 },
  { id: 'ates_hukmu', title: '🔥 Ateşin Hükmü', desc: 'İlk Bossu Yok Et', reward: 150, goal: 1 },
  { id: 'yildirim_ustasi', title: '⚡ Yıldırım Ustası', desc: '3 Element Füzyonunu Aç', reward: 120, goal: 3 },
  { id: 'sarsilmaz_alp', title: '🛡️ Sarsılmaz Alp', desc: '1 Dalgayı Hasar Almadan Temizle', reward: 50, goal: 1 },
  { id: 'hazine_avcisi', title: '💎 Hazine Avcısı', desc: 'Toplam 1000 Kristal Topla', reward: 100, goal: 1000 },
  { id: 'bozkir_hani', title: '👑 Bozkır Hanı', desc: 'Dalga 10\\'a Ulaş', reward: 200, goal: 10 },
  { id: 'gece_hakimi', title: '🌙 Karanlığın Sonu', desc: 'Gece Diyarını Tamamla', reward: 250, goal: 1 }
];

function getAchProgress() {
  try {
    return JSON.parse(localStorage.getItem('elementer_achievements') || '{}');
  } catch(e) { return {}; }
}

function updateAchProgress(id, amt) {
  const p = getAchProgress();
  p[id] = (p[id] || 0) + amt;
  try { localStorage.setItem('elementer_achievements', JSON.stringify(p)); } catch(e) {}
}

function openAchievementsModal() {
  const modal = document.getElementById('achievementsOverlay');
  if (!modal) return;
  const list = document.getElementById('achievementsList');
  if (list) {
    const prog = getAchProgress();
    list.innerHTML = ACHIEVEMENTS.map(a => {
      const cur = prog[a.id] || 0;
      const done = cur >= a.goal;
      return \`
        <div class="ach-card \${done ? 'done' : ''}">
          <div class="ach-info">
            <div class="ach-title">\${a.title}</div>
            <div class="ach-desc">\${a.desc}</div>
            <div class="ach-prog">\${Math.min(cur, a.goal)} / \${a.goal}</div>
          </div>
          <div class="ach-reward">💎 \${a.reward}</div>
        </div>
      \`;
    }).join('');
  }
  modal.classList.add('show');
  playSfx('ui', 0.3);
}

function closeAchievementsModal() {
  const modal = document.getElementById('achievementsOverlay');
  if (modal) modal.classList.remove('show');
}
`;

if (!content.includes('const ACHIEVEMENTS =')) {
  content = content.replace('function openHeroSelect(', achievementSystemCode + '\nfunction openHeroSelect(');
}

// Add Achievements Overlay HTML & CSS
const achOverlayHtml = `
  <!-- ACHIEVEMENTS MODAL (Item 9) -->
  <div id="achievementsOverlay" class="overlay">
    <div class="ach-modal-card">
      <div class="ach-modal-header">
        <h2>🏆 Mitolojik Başarımlar (Kut & Töre)</h2>
        <button type="button" class="btn close-btn" id="closeAchBtn">✖</button>
      </div>
      <div class="ach-list" id="achievementsList"></div>
    </div>
  </div>
`;

if (!content.includes('id="achievementsOverlay"')) {
  content = content.replace('<div id="heroSelectOverlay"', achOverlayHtml + '\n  <div id="heroSelectOverlay"');
}

const achCss = `
/* Achievements Modal Styling (Item 9) */
.ach-modal-card {
  width: 90%;
  max-width: 420px;
  max-height: 80vh;
  background: linear-gradient(150deg, #111827, #0b0f19);
  border: 1.5px solid #facc15;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.85);
}
.ach-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  padding-bottom: 8px;
}
.ach-modal-header h2 { font-size: 14px; color: #facc15; margin: 0; }
.ach-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 4px;
}
.ach-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 10px;
}
.ach-card.done { border-color: #10b981; background: rgba(16, 185, 129, 0.12); }
.ach-title { font-size: 12px; font-weight: 800; color: #f1f5f9; }
.ach-desc { font-size: 9px; color: #94a3b8; }
.ach-prog { font-size: 8.5px; font-weight: 800; color: #facc15; margin-top: 2px; }
.ach-reward { font-size: 11px; font-weight: 900; color: #38bdf8; }
`;

if (!content.includes('.ach-modal-card')) {
  content = content.replace('/* Modern CSS :has()', achCss + '\n/* Modern CSS :has()');
}

// Add Trophy Button to Top Header
const trophyBtnHeader = `<button type="button" class="quick-lang-pill" id="achHeaderBtn" aria-label="Başarımlar" style="color:#facc15; border-color:#facc15;">🏆 KUT</button>`;
if (!content.includes('id="achHeaderBtn"')) {
  content = content.replace('<button type="button" class="quick-lang-pill" id="quickLangBtn"', trophyBtnHeader + '\n          <button type="button" class="quick-lang-pill" id="quickLangBtn"');
}

// =========================================================================
// 10. KADİM SUNAK'TA "YETENEK SIFIRLAMA" (Respec)
// =========================================================================
console.log('[10/13] Implementing Talent Respec Engine in Ancient Shrine...');

const respecCode = `
// =========================================================================
// KADİM SUNAK YETENEK SIFIRLAMA (RESPEC) (Item 10)
// =========================================================================
function respecAncientTree() {
  const meta = loadMeta();
  let totalRefund = 0;
  if (meta.tree) {
    Object.keys(meta.tree).forEach(k => {
      const lv = meta.tree[k] || 0;
      totalRefund += lv * 50; // 50 crystals per tier
      meta.tree[k] = 0;
    });
  }
  meta.crystals = (meta.crystals || 0) + totalRefund;
  saveMeta(meta);
  fillCrystalHud();
  renderTreeNodes();
  synthBlip('legendary');
  playMetallicRing(1800, true);
  spawnFloatText(W / 2, H / 2, '🔄 ' + totalRefund + ' KRİSTAL İADE EDİLDİ!', '#facc15', true);
}
`;

if (!content.includes('function respecAncientTree')) {
  content = content.replace('function openTree(', respecCode + '\nfunction openTree(');
}

// Add Respec Button in treeOverlay
const respecBtnHtml = `<button type="button" class="btn" id="treeRespecBtn" style="background:#dc2626; border-color:#ef4444; color:#fff; font-size:10px; font-weight:800; padding:6px 10px; border-radius:8px;">🔄 Kristalleri Sıfırla & Geri Al</button>`;
if (!content.includes('id="treeRespecBtn"')) {
  content = content.replace('<button type="button" class="btn close-btn" id="treeCloseBtn">✖</button>', respecBtnHtml + '\n        <button type="button" class="btn close-btn" id="treeCloseBtn">✖</button>');
}

// =========================================================================
// 11. BÖLÜM SONU MİTOLOJİK DERECELENDİRME (S / A / B / C Rank)
// =========================================================================
console.log('[11/13] Implementing Mythic S/A/B/C Run Ranking System...');

const runRankCode = `
// =========================================================================
// MYTHIC RUN RANKING (S: Gök Tengri, A: Başbuğ, B: Alp, C: Er) (Item 11)
// =========================================================================
function calculateRunRank(wave, kills, timeSec) {
  const rankScore = (wave * 250) + (kills * 8) + Math.floor(timeSec * 3);
  if (rankScore >= 2500) return { rank: 'S', title: '👑 GÖK TENGRI', color: '#facc15' };
  if (rankScore >= 1400) return { rank: 'A', title: '⚔️ BAŞBUĞ', color: '#f59e0b' };
  if (rankScore >= 700)  return { rank: 'B', title: '🏹 ALP', color: '#38bdf8' };
  return { rank: 'C', title: '🛡️ ER', color: '#94a3b8' };
}
`;

if (!content.includes('function calculateRunRank')) {
  content = content.replace('function finishRun(', runRankCode + '\nfunction finishRun(');
}

// =========================================================================
// 12. BIOME HAVA DURUMU & PARÇACIK YAĞMURU (Atmospheric Weather FX)
// =========================================================================
console.log('[12/13] Upgrading Biome Weather & Drifting Particle FX...');

const weatherParticlesCode = `
// =========================================================================
// ATMOSPHERIC BIOME WEATHER FX (Item 12)
// Leaves in Forest, Snow in Ice, Embers in Lava, Bubbles in Water
// =========================================================================
function drawBiomeWeatherFX(ctx, cam, W, H, bk, time) {
  ctx.save();
  const drift = time * 0.5;
  const count = 24;

  for (let i = 0; i < count; i++) {
    const seed = i * 73.1;
    const px = (cam.x + (Math.sin(seed + drift * 0.03) * 0.5 + 0.5) * (W + 80) - 40);
    const py = (cam.y + (Math.cos(seed * 0.7 + drift * 0.02) * 0.5 + 0.5) * (H + 80) - 40);

    if (bk === 'forest') {
      // Drifting green leaves & spores
      ctx.fillStyle = '#4ade80';
      ctx.globalAlpha = 0.35;
      ctx.fillRect(px, py, 3, 2);
    } else if (bk === 'ice') {
      // Falling snowflakes
      ctx.fillStyle = '#e0f2fe';
      ctx.globalAlpha = 0.55;
      ctx.fillRect(px, py, 2, 2);
    } else if (bk === 'lava') {
      // Rising hot ash embers
      ctx.fillStyle = '#f97316';
      ctx.globalAlpha = 0.65;
      ctx.fillRect(px, py, 2.5, 2.5);
    } else if (bk === 'water') {
      // Rising aquatic bubbles
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.stroke();
    } else if (bk === 'sand') {
      // Desert sand dust
      ctx.fillStyle = '#fde047';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(px, py, 2, 1);
    }
  }
  ctx.restore();
}
`;

if (!content.includes('function drawBiomeWeatherFX')) {
  content = content.replace('function drawParallaxAtmosphere(', weatherParticlesCode + '\nfunction drawParallaxAtmosphere(');
}

// Hook drawBiomeWeatherFX in drawParallaxAtmosphere
content = content.replace('// Layer 3: Multiply Vignette', 'drawBiomeWeatherFX(ctx, cam, W, H, bk, time);\n  // Layer 3: Multiply Vignette');

// =========================================================================
// 13. MİTOLOJİK BOSS TANITIM KARTI (Cinematic Splash Banner)
// =========================================================================
console.log('[13/13] Implementing Cinematic Boss Splash Banner...');

const bossSplashCode = `
// =========================================================================
// CINEMATIC BOSS SPLASH BANNER (Item 13)
// =========================================================================
let _bossSplashTimer = 0;
let _bossSplashTitle = '';
let _bossSplashSub = '';

function triggerBossSplashBanner(title, sub) {
  _bossSplashTimer = 2.0; // 2 seconds banner
  _bossSplashTitle = title || 'DALGA BOZGUNCUSU';
  _bossSplashSub = sub || 'Mitolojik Hükümdar';
  synthBlip('boss_horn');
}

function drawBossSplashBanner(ctx) {
  if (_bossSplashTimer <= 0) return;
  _bossSplashTimer -= 0.016;

  ctx.save();
  const bannerY = H * 0.38;
  const bannerH = 72;

  // Dark obsidian banner with gold borders
  ctx.fillStyle = 'rgba(8, 11, 20, 0.94)';
  ctx.fillRect(0, bannerY, W, bannerH);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, bannerY, W, bannerH);

  // Mythological Boss Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 16px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ ' + _bossSplashTitle + ' ⚡', W / 2, bannerY + 30);

  // Subtitle
  ctx.fillStyle = '#facc15';
  ctx.font = '700 11px -apple-system, sans-serif';
  ctx.fillText(_bossSplashSub, W / 2, bannerY + 52);
  ctx.restore();
}
`;

if (!content.includes('function triggerBossSplashBanner')) {
  content = content.replace('function drawVirtualJoystick', bossSplashCode + '\nfunction drawVirtualJoystick');
}

// Hook boss banner in render
content = content.replace('drawVirtualJoystick(ctx, shx, shy);', `drawBossSplashBanner(ctx);
    drawVirtualJoystick(ctx, shx, shy);`);

// Hook boss banner in spawnBoss
content = content.replace("function spawnBoss(type, customX, customY) {", `function spawnBoss(type, customX, customY) {
  triggerBossSplashBanner((type || 'KORHAN').toUpperCase() + ' HANI', 'Karanlıkların Kadim Efendisi');`);

// Bind all UI buttons at end of file
const newButtonBindings = `
  // Bind Option A UI Buttons
  const achBtn = document.getElementById('achHeaderBtn');
  if (achBtn) bindTouchButton(achBtn, openAchievementsModal);
  const closeAchBtn = document.getElementById('closeAchBtn');
  if (closeAchBtn) bindTouchButton(closeAchBtn, closeAchievementsModal);
  const respecBtn = document.getElementById('treeRespecBtn');
  if (respecBtn) bindTouchButton(respecBtn, respecAncientTree);
  const resumeBtn = document.getElementById('resumeRunBtn');
  if (resumeBtn) bindTouchButton(resumeBtn, executeResumeRun);
`;

content = content.replace('// FINAL BOOTSTRAP: Start at Main Menu', newButtonBindings + '\n  checkAndResumeSavedRun();\n  // FINAL BOOTSTRAP: Start at Main Menu');

// Write modified index.html
fs.writeFileSync(htmlPath, content, 'utf8');
console.log('SUCCESS: All 13 Master Features of Option A successfully applied to index.html!');
