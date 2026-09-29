const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. INJECT STEP 9 SHRINE STYLES
const oldOverlayCss = `.overlay.curse-ov {`;
const newShrineCss = `.overlay.shrine-ov {
  background: radial-gradient(circle at center, rgba(30, 10, 40, 0.94), rgba(5, 5, 12, 0.98));
  border: 2px solid #a855f7;
  box-shadow: 0 0 35px rgba(168, 85, 247, 0.45);
}
.shrine-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.shrine-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 10px #c084fc);
}
.choice-card.shrine-blood {
  border-color: #ef4444;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.35);
  background: linear-gradient(135deg, rgba(69, 10, 10, 0.65), rgba(15, 23, 42, 0.9));
}
.choice-card.shrine-flawless {
  border-color: #ffd700;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.35);
  background: linear-gradient(135deg, rgba(60, 45, 5, 0.65), rgba(15, 23, 42, 0.9));
}
.choice-card.shrine-trial {
  border-color: #c084fc;
  box-shadow: 0 0 16px rgba(192, 132, 252, 0.35);
  background: linear-gradient(135deg, rgba(45, 15, 60, 0.65), rgba(15, 23, 42, 0.9));
}
.flawless-hud-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 800;
  color: #fecaca;
  animation: pulseFlawless 1.2s infinite alternate;
}
@keyframes pulseFlawless {
  from { box-shadow: 0 0 4px rgba(239,68,68,0.4); }
  to { box-shadow: 0 0 12px rgba(239,68,68,0.9); }
}
.overlay.curse-ov {`;

if (html.includes(oldOverlayCss)) {
  html = html.replace(oldOverlayCss, newShrineCss);
  console.log('1. Injected Step 9 Shrine styles!');
} else {
  // Try injecting before </style>
  html = html.replace('</style>', newShrineCss + '\n</style>');
  console.log('1. Injected Step 9 Shrine styles before </style>!');
}

// 2. INJECT SHRINE OVERLAY HTML
const oldCurseOverlayEnd = `      <div class="choice-row" id="curseRow"></div>
      <div class="menu-btns"><button class="btn ghost" id="curseSkipBtn" type="button">Geç</button></div>
    </div>`;

const newShrineOverlayHtml = `      <div class="choice-row" id="curseRow"></div>
      <div class="menu-btns"><button class="btn ghost" id="curseSkipBtn" type="button">Geç</button></div>
    </div>

    <!-- STEP 9: ARENA CURSED SHRINE (RISK & REWARD) MODAL -->
    <div id="shrineOverlay" class="overlay shrine-ov">
      <div class="shrine-header">
        <span class="shrine-icon">🏮</span>
        <h2 style="margin:0;">Kadim Risk & Ödül Mihrabı</h2>
      </div>
      <p id="shrineSubtitle" style="font-size:12px; color:#cbd5e1; margin:6px 0 12px;">Mihrabın kadim enerjisi fısıldıyor... Bedel ödemeye ve kaderini bükmeye cesaretin var mı?</p>
      <div class="choice-row" id="shrineRow"></div>
      <div class="menu-btns" style="margin-top:14px;">
        <button class="btn ghost" id="shrineLeaveBtn" type="button" style="min-width:180px;">Uzaklaş (Mihraba Dokunma)</button>
      </div>
    </div>`;

if (html.includes(oldCurseOverlayEnd)) {
  html = html.replace(oldCurseOverlayEnd, newShrineOverlayHtml);
  console.log('2. Injected shrineOverlay HTML!');
} else {
  console.error('Warning: oldCurseOverlayEnd not found!');
}

// 3. DEFINE STEP 9 CURSED SHRINE ENGINE IN JS
const shrineEngineCode = `// --- STEP 9: ARENA CURSED SHRINES (RISK & REWARD) ENGINE ---
let arenaShrine = null;
let flawlessTimer = 0;

function spawnArenaShrine() {
  if (!player) return;
  const ang = Math.random() * Math.PI * 2;
  const dist = 240 + Math.random() * 120;
  const sx = clampWorldX(player.x + Math.cos(ang) * dist, 80);
  const sy = clampWorldY(player.y + Math.sin(ang) * dist, 80);

  arenaShrine = {
    x: sx,
    y: sy,
    r: 34,
    active: true,
    pulseTimer: 0,
    kind: 'cursed'
  };

  burst(sx, sy, '#c084fc', 20, 3.8);
  burst(sx, sy, '#ffd700', 12, 2.5);
  spawnFloatText(sx, sy - 38, '🏮 Kadim Risk & Ödül Mihrabı Belirdi!', '#c084fc', 'big');
  playSfx('skill', 0.35, 450);
}

function openShrineModal() {
  if (!arenaShrine || !arenaShrine.active || overlayBusy()) return;
  paused = true;
  const ov = document.getElementById('shrineOverlay');
  const row = document.getElementById('shrineRow');
  if (!ov || !row) return;

  row.innerHTML = '';
  const isEn = (typeof getGameLang === 'function' && getGameLang() === 'en');

  // Option 1: Blood Sacrifice
  const bloodCostHp = Math.round(player.hp * 0.40);
  const bloodCard = document.createElement('button');
  bloodCard.type = 'button';
  bloodCard.className = 'choice-card shrine-blood';
  bloodCard.innerHTML = \`
    <span class="emoji">🩸</span>
    <span class="name">\${isEn ? 'Blood Sacrifice' : 'Kan Fedakarlığı'}</span>
    <span class="hint" style="color:#f87171;">-\${bloodCostHp} \${isEn ? 'Current HP' : 'Mevcut Can'}</span>
    <span class="desc" style="font-size:11px; margin-top:4px; color:#ffd700;">➔ +140 💎 \${isEn ? 'Crystals & +1 Free Level Up!' : 'Kristal & +1 Seviye Atlama!'}</span>
  \`;
  bloodCard.addEventListener('click', () => {
    player.hp = Math.max(1, player.hp - bloodCostHp);
    gainCrystals(140, player.x, player.y);
    if (typeof levelUp === 'function') levelUp();
    shake = Math.max(shake, 16);
    triggerScreenFlash('#ef4444', 0.4, 200);
    burst(player.x, player.y, '#ef4444', 24, 4.0);
    playSfx('explode', 0.45, 180);
    vibrate([40, 80]);
    completeShrine();
  });
  row.appendChild(bloodCard);

  // Option 2: Flawless Survival Challenge
  const flawCard = document.createElement('button');
  flawCard.type = 'button';
  flawCard.className = 'choice-card shrine-flawless';
  flawCard.innerHTML = \`
    <span class="emoji">⏱️</span>
    <span class="name">\${isEn ? 'Flawless Survival' : 'Kusursuz Hayatta Kalma'}</span>
    <span class="hint" style="color:#fde047;">\${isEn ? 'Take 0 Damage for 35s' : '35s Boyunca Hiç Hasar Alma!'}</span>
    <span class="desc" style="font-size:11px; margin-top:4px; color:#ffd700;">➔ \${isEn ? 'Full HP Restore & +180 💎 Crystals!' : 'Tam Can Yenileme & +180 💎 Kristal!'}</span>
  \`;
  flawCard.addEventListener('click', () => {
    flawlessTimer = 35 * 60;
    showStreakBanner(isEn ? '⏱️ FLAWLESS TRIAL: TAKE NO DAMAGE (35s)!' : '⏱️ KUSURSUZ İMTİHAN: 35s HASAR ALMA!', '#ffd700');
    triggerScreenFlash('#ffd700', 0.35, 180);
    burst(player.x, player.y, '#ffd700', 20, 3.5);
    playSfx('skill', 0.45, 720);
    vibrate([30, 40, 30]);
    completeShrine();
  });
  row.appendChild(flawCard);

  // Option 3: Trial of Torment (Elite Incursion)
  const trialCard = document.createElement('button');
  trialCard.type = 'button';
  trialCard.className = 'choice-card shrine-trial';
  trialCard.innerHTML = \`
    <span class="emoji">💀</span>
    <span class="name">\${isEn ? 'Trial of Torment' : 'Kıyamet İmtihanı'}</span>
    <span class="hint" style="color:#c084fc;">\${isEn ? 'Spawn 2 Golden Elite Guardians' : '2 Altın Zırhlı Elit Muhafız Çağır!'}</span>
    <span class="desc" style="font-size:11px; margin-top:4px; color:#ffd700;">➔ \${isEn ? 'Slay them for massive crystal loot!' : 'Katlet ve her birinden +100 💎 Kristal kap!'}</span>
  \`;
  trialCard.addEventListener('click', () => {
    if (typeof spawnAroundPlayer === 'function' && typeof makeEnemy === 'function') {
      makeEnemy(spawnAroundPlayer(160, 220), 'tank', { isElite: true, titleCol: '#ffd700', hp: 75 + wave * 12 });
      makeEnemy(spawnAroundPlayer(160, 220), 'specter', { isElite: true, titleCol: '#ffd700', hp: 60 + wave * 10 });
    }
    shake = Math.max(shake, 18);
    triggerScreenFlash('#c084fc', 0.4, 220);
    burst(player.x, player.y, '#c084fc', 24, 4.0);
    playSfx('explode', 0.4, 160);
    vibrate([50, 70]);
    showStreakBanner(isEn ? '⚠️ ELITE GUARDIANS SUMMONED!' : '⚠️ ALTIN MUHAFIZLAR ÇAĞRILDI!', '#ffd700');
    completeShrine();
  });
  row.appendChild(trialCard);

  ov.classList.add('show');
}

function completeShrine() {
  if (arenaShrine) {
    arenaShrine.active = false;
    burst(arenaShrine.x, arenaShrine.y, '#ffd700', 25, 4.0);
  }
  closeShrineModal();
}

function closeShrineModal() {
  const ov = document.getElementById('shrineOverlay');
  if (ov) ov.classList.remove('show');
  paused = false;
}

function drawArenaShrine(ctx, cam, time) {
  if (!arenaShrine) return;
  const sx = arenaShrine.x;
  const sy = arenaShrine.y;
  const isActive = arenaShrine.active;

  ctx.save();

  // 1. Concentric Runic Ground Mandala
  const rPulse = isActive ? (0.65 + Math.sin(time * 0.005) * 0.25) : 0.25;
  ctx.strokeStyle = isActive ? 'rgba(192, 132, 252, ' + rPulse + ')' : 'rgba(100, 116, 139, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sx, sy, arenaShrine.r, 0, Math.PI * 2);
  ctx.stroke();

  if (isActive) {
    ctx.strokeStyle = 'rgba(255, 215, 0, ' + (rPulse * 0.6) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy, arenaShrine.r * 0.65, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Monolith Stone Altar Pedestal
  ctx.fillStyle = isActive ? '#1e1b4b' : '#0f172a';
  ctx.strokeStyle = isActive ? '#a855f7' : '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(sx - 14, sy - 8, 28, 22, 4);
  ctx.fill();
  ctx.stroke();

  // 3. Levitating Mystic Relic Orb
  if (isActive) {
    const floatY = sy - 20 + Math.sin(time * 0.006) * 6;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(sx, floatY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx - 2, floatY - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Floating text prompt
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText('🏮 KADİM MİHRAP', sx, floatY - 14);
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('[Dokun]', sx, floatY - 4);
  } else {
    // Extinguished monument
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(sx, sy - 14, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
`;

const oldEmptyStateEnd = `  ambient = [];
  for (let i=0;i<42;i++) ambient.push({ x:originX+Math.random()*MAP_W, y:originY+Math.random()*MAP_H, s:0.4+Math.random()*1.2, a:0.04+Math.random()*0.08, sp:0.15+Math.random()*0.35 });
  seedBiome(0);
}`;

const newEmptyStateEnd = `  ambient = [];
  for (let i=0;i<42;i++) ambient.push({ x:originX+Math.random()*MAP_W, y:originY+Math.random()*MAP_H, s:0.4+Math.random()*1.2, a:0.04+Math.random()*0.08, sp:0.15+Math.random()*0.35 });
  arenaShrine = null;
  flawlessTimer = 0;
  seedBiome(0);
}`;

if (html.includes(oldEmptyStateEnd)) {
  html = html.replace(oldEmptyStateEnd, newEmptyStateEnd);
  console.log('3. Reset arenaShrine and flawlessTimer in emptyState!');
} else {
  console.error('Warning: oldEmptyStateEnd not found!');
}

// 4. INJECT SHRINE ENGINE CODE BEFORE SPAWNWAVE
const oldSpawnWaveStart = `function spawnWave() {`;
if (html.includes(oldSpawnWaveStart)) {
  html = html.replace(oldSpawnWaveStart, shrineEngineCode + '\n' + oldSpawnWaveStart);
  console.log('4. Injected Shrine Engine code into JS!');
} else {
  console.error('Warning: oldSpawnWaveStart not found!');
}

// 5. HOOK SHRINE SPAWN IN SPAWNWAVE
const oldSpawnWaveEnd = `  if (isBossWave) {`;
const newSpawnWaveEnd = `  // STEP 9: SPAWN ARENA CURSED SHRINE (Risk & Reward Altar)
  if (wave >= 2 && (wave % 2 === 0 || Math.random() < 0.45) && !arenaShrine) {
    spawnArenaShrine();
  }

  if (isBossWave) {`;

if (html.includes(oldSpawnWaveEnd)) {
  html = html.replace(oldSpawnWaveEnd, newSpawnWaveEnd);
  console.log('5. Hooked spawnArenaShrine into spawnWave!');
} else {
  console.error('Warning: oldSpawnWaveEnd not found!');
}

// 6. DRAW SHRINE IN RENDER
const oldDrawDecals = `  drawDecals(ctx);`;
const newDrawDecals = `  drawDecals(ctx);
  drawArenaShrine(ctx, cam, time);`;

if (html.includes(oldDrawDecals)) {
  html = html.replace(oldDrawDecals, newDrawDecals);
  console.log('6. Hooked drawArenaShrine in render()!');
} else {
  console.error('Warning: oldDrawDecals not found!');
}

// 7. INTERACTION CHECK AND FLAWLESS TICK IN UPDATE LOOP
const oldUpdateStart = `function update(dt, now) {
  if (!running || paused) return;`;

const newUpdateStart = `function update(dt, now) {
  if (!running || paused) return;

  // STEP 9: ARENA SHRINE PROXIMITY CHECK
  if (arenaShrine && arenaShrine.active && player && player.hp > 0) {
    const sDist = Math.hypot(player.x - arenaShrine.x, player.y - arenaShrine.y);
    if (sDist < 52 && !overlayBusy() && !menuOpen) {
      openShrineModal();
    }
  }

  // STEP 9: FLAWLESS TRIAL TICK
  if (flawlessTimer > 0) {
    flawlessTimer -= dt;
    if (flawlessTimer <= 0) {
      flawlessTimer = 0;
      player.hp = player.maxHp;
      gainCrystals(180, player.x, player.y);
      triggerScreenFlash('#ffd700', 0.45, 240);
      showStreakBanner('👑 KUSURSUZ İMTİHAN KAZANILDI! (+180 💎 & Tam Can)', '#ffd700');
      playSfx('legendary', 0.5);
      vibrate([50, 70, 50, 90]);
    }
  }`;

if (html.includes(oldUpdateStart)) {
  html = html.replace(oldUpdateStart, newUpdateStart);
  console.log('7. Hooked shrine proximity & flawless timer in update()!');
} else {
  console.error('Warning: oldUpdateStart not found!');
}

// 8. BREAK FLAWLESS CHALLENGE ON PLAYER DAMAGE
const oldDamagePlayerHurt = `  player.invuln = 56;
  player.recoilT = 14;`;

const newDamagePlayerHurt = `  // STEP 9: Break Flawless Challenge on damage
  if (flawlessTimer > 0) {
    flawlessTimer = 0;
    spawnFloatText(player.x, player.y - 36, '❌ Kusursuz İmtihan Bozuldu!', '#ef4444');
    playSfx('hurt', 0.4);
    vibrate([40, 80]);
  }
  player.invuln = 56;
  player.recoilT = 14;`;

if (html.includes(oldDamagePlayerHurt)) {
  html = html.replace(oldDamagePlayerHurt, newDamagePlayerHurt);
  console.log('8. Hooked flawless trial failure in damagePlayer()!');
} else {
  console.error('Warning: oldDamagePlayerHurt not found!');
}

// 9. UPDATE HUD WITH FLAWLESS TRIAL COUNTDOWN
const oldUpdateHudStreak = `  const sl = document.getElementById('streakLabel');
  if (sl) sl.textContent = (streakOn ? '✦ Seri  ' : '') + (killCombo >= 3 ? ('x' + killCombo) : '');`;

const newUpdateHudStreak = `  const sl = document.getElementById('streakLabel');
  if (sl) {
    if (flawlessTimer > 0) {
      const sLeft = Math.ceil(flawlessTimer / 60);
      sl.innerHTML = '<span class="flawless-hud-badge">⏱️ Kusursuz: ' + sLeft + 's</span>';
    } else {
      sl.textContent = (streakOn ? '✦ Seri  ' : '') + (killCombo >= 3 ? ('x' + killCombo) : '');
    }
  }`;

if (html.includes(oldUpdateHudStreak)) {
  html = html.replace(oldUpdateHudStreak, newUpdateHudStreak);
  console.log('9. Hooked flawless timer countdown in updateHud()!');
} else {
  console.error('Warning: oldUpdateHudStreak not found!');
}

// 10. RECOGNIZE SHRINE OVERLAY IN OVERLAYBUSY AND ATTACH LEAVE BUTTON
const oldOverlayBusy = `|| overlayVisible('curseOverlay')`;
const newOverlayBusy = `|| overlayVisible('curseOverlay')
|| overlayVisible('shrineOverlay')`;

if (html.includes(oldOverlayBusy)) {
  html = html.replace(oldOverlayBusy, newOverlayBusy);
  console.log('10A. Added shrineOverlay to overlayBusy()!');
} else {
  console.error('Warning: oldOverlayBusy not found!');
}

const oldInitCloseBtns = `const dashFab = document.getElementById('dashFab');`;
const newInitCloseBtns = `const shrineLeaveBtn = document.getElementById('shrineLeaveBtn');
if (shrineLeaveBtn) shrineLeaveBtn.addEventListener('click', closeShrineModal);

const dashFab = document.getElementById('dashFab');`;

if (html.includes(oldInitCloseBtns)) {
  html = html.replace(oldInitCloseBtns, newInitCloseBtns);
  console.log('10B. Attached shrineLeaveBtn click listener in init!');
} else {
  console.error('Warning: oldInitCloseBtns not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 9 applied successfully!');
