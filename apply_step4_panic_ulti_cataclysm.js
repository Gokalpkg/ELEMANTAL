const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. UPDATE CSS FOR #ultFab.ready TO PROMINENT PULSING GLOW
// -------------------------------------------------------------
const oldUltCss = `  #ultFab.ready {
    border-color: #ffd700;
    background: radial-gradient(circle at 35% 35%, #581c87, #0f172a);
    box-shadow: 0 0 28px rgba(255, 215, 0, 0.9), inset 0 0 16px rgba(255, 215, 0, 0.5);
    animation: ultPulse 0.9s ease-in-out infinite alternate;
  }`;

const newUltCss = `  #ultFab.ready {
    border-color: #ffd700;
    background: radial-gradient(circle at 35% 35%, #7c3aed, #0f172a);
    box-shadow: 0 0 32px rgba(255, 215, 0, 1), 0 0 54px rgba(124, 58, 237, 0.65), inset 0 0 18px rgba(255, 215, 0, 0.6);
    animation: ultPulse 0.75s ease-in-out infinite alternate;
  }`;

if (html.includes(oldUltCss)) {
  html = html.replace(oldUltCss, newUltCss);
  changes++;
  console.log('[1] Updated #ultFab.ready CSS glow');
} else {
  console.warn('[1] Warning: oldUltCss not found');
}

// -------------------------------------------------------------
// 2. CELESTIAL AUDIO NOTIFICATION WHEN ULTI IS READY (2 PLACES)
// -------------------------------------------------------------
const oldUltReadyHit = `    if (ultEnergy >= MAX_ULT_ENERGY) {
      spawnFloatText(player.x, player.y - 36, '⚡ NİHAİ GÜÇ HAZIR! ⚡', '#ffd700', 'big');
      playSfx('skill', 0.4, 780);
      vibrate([35, 50, 35]);
    }`;

const newUltReadyHit = `    if (ultEnergy >= MAX_ULT_ENERGY) {
      spawnFloatText(player.x, player.y - 36, '⚡ KADİM ULTİ HAZIR! ⚡', '#ffd700', 'big');
      synthBlip('legendary');
      playSfx('skill', 0.45, 880);
      vibrate([40, 60, 40]);
    }`;

if (html.includes(oldUltReadyHit)) {
  html = html.replace(oldUltReadyHit, newUltReadyHit);
  changes++;
  console.log('[2] Added legendary celestial fanfare to ultEnergy hit gain');
} else {
  console.warn('[2] Warning: oldUltReadyHit not found');
}

const oldUltReadyKill = `    if (ultEnergy >= MAX_ULT_ENERGY) {
      spawnFloatText(player.x, player.y - 36, '⚡ NİHAİ GÜÇ HAZIR! ⚡', '#ffd700', 'big');
      playSfx('skill', 0.4, 780);
      vibrate([35, 50, 35]);
    }`;

// Check if kill site has the same or different
const oldKillSite = `if (typeof ultEnergy !== 'undefined' && ultEnergy < MAX_ULT_ENERGY) {
      ultEnergy = Math.min(MAX_ULT_ENERGY, ultEnergy + (en.type === 'boss' ? 25 : 3.5));
      if (ultEnergy >= MAX_ULT_ENERGY) {
        spawnFloatText(player.x, player.y - 36, '⚡ NİHAİ GÜÇ HAZIR! ⚡', '#ffd700', 'big');
        playSfx('skill', 0.4, 780);
        vibrate([35, 50, 35]);
      }
      syncUltFab();
    }`;

const newKillSite = `if (typeof ultEnergy !== 'undefined' && ultEnergy < MAX_ULT_ENERGY) {
      ultEnergy = Math.min(MAX_ULT_ENERGY, ultEnergy + (en.type === 'boss' ? 25 : 3.5));
      if (ultEnergy >= MAX_ULT_ENERGY) {
        spawnFloatText(player.x, player.y - 36, '⚡ KADİM ULTİ HAZIR! ⚡', '#ffd700', 'big');
        synthBlip('legendary');
        playSfx('skill', 0.45, 880);
        vibrate([40, 60, 40]);
      }
      syncUltFab();
    }`;

if (html.includes(oldKillSite)) {
  html = html.replace(oldKillSite, newKillSite);
  changes++;
  console.log('[3] Added legendary celestial fanfare to ultEnergy kill gain');
} else {
  console.warn('[3] Warning: oldKillSite not found');
}

// -------------------------------------------------------------
// 3. COMPLETE ELEMENTAL ADAPTATION OF triggerUltimate
// -------------------------------------------------------------
const oldTriggerUltimate = `function triggerUltimate() {
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

const newTriggerUltimate = `function triggerUltimate() {
  if (!running || paused || menuOpen) return;
  if (ultEnergy < MAX_ULT_ENERGY) {
    const pct = Math.floor((ultEnergy / MAX_ULT_ENERGY) * 100);
    spawnFloatText(player.x, player.y - 28, 'Ulti %' + pct + ' (Henüz Dolmadı)', '#94a3b8', 'small');
    playSfx('hit', 0.2, 300);
    vibrate(15);
    return;
  }

  // STEP 4: ELEMENT-ADAPTIVE SCREEN NUKE & RESCUE PANIC BUTTON
  ultEnergy = 0;
  syncUltFab();

  // Root Element Identification
  const rootEl = (runLock && runLock.root) || (player && player.el) || 'fire';
  const elData = ELEMENTS[rootEl] || ELEMENTS.fire;
  const themeCol = elData.color || '#ffd700';

  // 1. Invulnerability Window (1.8 Seconds i-Frames on Panic Activation)
  if (player) {
    player.invuln = Math.max(player.invuln || 0, 110);
  }

  // 2. Audio & Screen Visual Juice
  playSfx('explode', 0.70, 200);
  synthBlip('phase2_cue');
  synthBlip('fusion_detonation');
  triggerScreenFlash(themeCol, 0.75, 320);
  shake = Math.max(shake, 28);
  camKick = 20;
  vibrate([80, 120, 80, 200]);
  triggerHitStop(16); // 16 frames epic impact freeze

  // 3. Dynamic Elemental Banner & Announcement
  let ultTitle = '👑 ELEMENT KIYAMETİ!';
  let ultDesc = '💥 TÜM EKRAN İNFİLAKI!';
  if (rootEl === 'fire') {
    ultTitle = '🔥 CEHENNEM KIYAMETİ!';
    ultDesc = '🌋 MAGMA İNFİLAKI & KALICI ALEV!';
    spawnElemStain(player.x, player.y, 160, 'fire', 320);
  } else if (rootEl === 'water') {
    ultTitle = '❄️ MUTLAK SIFIR BUZ DEVRİ!';
    ultDesc = '🧊 HER ŞEY BUZ KESTİ!';
  } else if (rootEl === 'storm') {
    ultTitle = '⚡ GÖKSEL YILDIRIM GAZABI!';
    ultDesc = '🌩️ ŞİMŞEK FIRTINASI!';
  } else if (rootEl === 'nature') {
    ultTitle = '🌿 GAİA DİRİLİŞİ!';
    ultDesc = '🌸 +%50 CAN & DOĞA TUFANI!';
    if (player) {
      const healAmt = Math.round(player.maxHp * 0.50);
      player.hp = Math.min(player.maxHp, player.hp + healAmt);
      spawnFloatText(player.x, player.y - 20, '+' + healAmt + ' CAN DİRİLİŞ!', '#4ade80', 'big');
    }
  } else if (rootEl === 'earth') {
    ultTitle = '🪨 TEKTONİK KITA ÇÖKÜŞÜ!';
    ultDesc = '🏔️ DEPREM & ZIRH PARÇALAMA!';
  } else if (rootEl === 'void') {
    ultTitle = '🌀 KOZMİK OLAY UFKU!';
    ultDesc = '🌌 KARA DELİK İNFAZI!';
    spawnElemStain(player.x, player.y, 140, 'void', 300);
  }

  showStreakBanner(ultTitle, themeCol);
  spawnFloatText(player.x, player.y - 42, ultDesc, themeCol, 'crit');

  // 4. Delete All Enemy Projectiles (Complete Bullet Clearing)
  const clearedCount = enemyProjectiles ? enemyProjectiles.length : 0;
  if (enemyProjectiles && enemyProjectiles.length) {
    enemyProjectiles.forEach(p => {
      burst(p.x, p.y, themeCol, 8, 2.5);
      sparks.push({ x: p.x, y: p.y, vx: 0, vy: -1.5, r: 2.2, life: 0.35, maxLife: 0.35, color: themeCol, rot: 0, vr: 0 });
    });
    enemyProjectiles = [];
  }
  if (clearedCount > 0) {
    spawnFloatText(player.x, player.y - 18, '🛡️ ' + clearedCount + ' Mermi Silindi!', '#38bdf8', 'small');
  }

  // 5. Expanding Multi-Layer Elemental Shockwaves (R = 540px Screen Nuke)
  particles.push({
    x: player.x, y: player.y,
    r: 20, maxR: 540,
    life: 1.2, maxLife: 1.2,
    color: themeCol,
    type: 'fusion_ring',
    lw: 12.0
  });
  particles.push({
    x: player.x, y: player.y,
    r: 30, maxR: 420,
    life: 1.0, maxLife: 1.0,
    color: '#ffffff',
    type: 'fusion_ring',
    lw: 8.0
  });
  particles.push({
    x: player.x, y: player.y,
    life: 1.3, maxLife: 1.3,
    type: 'mushroom',
    scale: 2.6
  });
  burst(player.x, player.y, themeCol, 40, 6.0);
  burst(player.x, player.y, '#ffffff', 24, 4.5);

  // 6. Cataclysmic Damage & Elemental Status Effects to ALL Enemies on screen
  const nukeDmg = Math.round(160 + wave * 25);
  const now = performance.now();
  for (let j = enemies.length - 1; j >= 0; j--) {
    const en = enemies[j];
    const dist = Math.hypot(en.x - player.x, en.y - player.y);
    if (dist <= 560) {
      takeDamage(en, nukeDmg, rootEl, { crit: true });

      // Elemental Specific Debuffs
      if (rootEl === 'water') {
        en.stunUntil = Math.max(en.stunUntil || 0, now + 2500); // 2.5s Freeze
        en.slowFactor = 0.35;
        statusStore.addShred(en, 0.20);
      } else if (rootEl === 'earth') {
        en.stunUntil = Math.max(en.stunUntil || 0, now + 3200); // 3.2s Stun
        statusStore.addShred(en, 0.40); // 40% Armor Shred
      } else if (rootEl === 'nature') {
        en.rootUntil = Math.max(en.rootUntil || 0, now + 2800); // 2.8s Root
      } else if (rootEl === 'void') {
        if (en.type !== 'boss' && en.hp / en.maxHp < 0.35) {
          // Instant Execute
          takeDamage(en, en.hp + 20, 'void', { noReact: true });
          spawnFloatText(en.x, en.y - 24, '☠️ KARADELİK İNFAZI!', '#c084fc', 'big');
        }
      }

      // Radial Knockback
      if (en.type !== 'boss') {
        const ang = Math.atan2(en.y - player.y, en.x - player.x);
        en.vx = Math.cos(ang) * 16;
        en.vy = Math.sin(ang) * 16;
        en.staggerTimer = 0.55;
      }
    }
  }
  pruneDeadEnemies();
}`;

if (html.includes(oldTriggerUltimate)) {
  html = html.replace(oldTriggerUltimate, newTriggerUltimate);
  changes++;
  console.log('[4] Implemented Element-Adaptive Screen Nuke in triggerUltimate');
} else {
  console.warn('[4] Warning: oldTriggerUltimate not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 4 patch script. Total successful patches: ${changes}/4`);
