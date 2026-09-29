const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. UPDATE CURSE_CARDS DEFINITIONS WITH HIGH IMPACT DESCRIPTIONS
// -------------------------------------------------------------
const oldCurseCards = `const CURSE_CARDS = [
  { id:'glassCannon', name:'Efsanevi: Cam Top', emoji:'🔮', hint:'+%300 Kritik Hasar & Dash Patlaması! (Maks Can = 1)', apply() { player.maxHp = 1; player.hp = 1; runFlags().glassCannon = true; spawnFloatText(player.x, player.y - 30, 'EFSANEVİ CAM TOP!', '#c084fc', 'big'); } },
  { id:'bloodPact', name:'Efsanevi: Kan Büyüsü', emoji:'🩸', hint:'Büyü soğuma süreleri -%70! (+%15 Can Çalma)', apply() { runFlags().bloodPact = true; spawnFloatText(player.x, player.y - 30, 'KAN BÜYÜSÜ AKTİF!', '#ff1744', 'big'); } },
  { id:'magnetNova', name:'Efsanevi: Mıknatıs Kıyameti', emoji:'🧲', hint:'XP taşları uçarken düşmanlara yıldırım çarpar!', apply() { runFlags().magnetNova = true; spawnFloatText(player.x, player.y - 30, 'MIKNATIS KIYAMETİ!', '#ffd700', 'big'); } },
  { id:'curseMight', name:'Kanlı Güç', emoji:'⚔️', hint:'+%35 hasar · +%15 alınan' },
  { id:'curseGreed', name:'Açgöz Kral', emoji:'💰', hint:'+%50 XP & Kristal' },
  { id:'curseFury', name:'Öfke Patlaması', emoji:'💢', hint:'+%30 atış hızı' }
];`;

const newCurseCards = `const CURSE_CARDS = [
  { id:'glassCannon', name:'Efsanevi: Cam Top', emoji:'🔮', hint:'+%300 Devasa Hasar & Dash Patlaması! (Maks Can = 1)' },
  { id:'bloodPact', name:'Efsanevi: Kan Büyüsü', emoji:'🩸', hint:'Büyü soğuma süreleri -%70! (Vuruş ve katletmede Can Çalma)' },
  { id:'magnetNova', name:'Efsanevi: Mıknatıs Kıyameti', emoji:'🧲', hint:'XP taşları tüm ekrandan çekilirken düşmanlara zincirleme yıldırım yağdırır!' },
  { id:'curseMight', name:'Kanlı Güç', emoji:'⚔️', hint:'+%35 hasar · +%15 alınan' },
  { id:'curseGreed', name:'Açgöz Kral', emoji:'💰', hint:'+%50 XP & Kristal' },
  { id:'curseFury', name:'Öfke Patlaması', emoji:'💢', hint:'+%30 atış hızı' }
];`;

if (html.includes(oldCurseCards)) {
  html = html.replace(oldCurseCards, newCurseCards);
  changes++;
  console.log('[1] Updated CURSE_CARDS definitions');
} else {
  console.warn('[1] Warning: oldCurseCards not found');
}

// -------------------------------------------------------------
// 2. ADD RELICS INTO MOD_POOL AS LEGENDARY CARDS
// -------------------------------------------------------------
const oldModPoolStart = `const MOD_POOL = [
  { id:'overcharge', name:'Hiper Tetik', emoji:'⚡', rarity:'rare', desc:'+%75 Saldırı Hızı! Mermiler makineli tüfek gibi yağar ve her 3 vuruşta elektrik patlaması saçar.' },`;

const newModPoolStart = `const MOD_POOL = [
  { id:'glassCannon', name:'Efsanevi: Cam Top', emoji:'🔮', rarity:'legendary', desc:'+%300 Hasar & Dash Patlaması! (Maksimum Can = 1)', isRelic:true },
  { id:'bloodPactRelic', name:'Efsanevi: Kan Büyüsü', emoji:'🩸', rarity:'legendary', desc:'Büyü bekleme süreleri -%70! Her vuruş ve katletmede Can Çalma', isRelic:true },
  { id:'magnetNova', name:'Efsanevi: Mıknatıs Kıyameti', emoji:'🧲', rarity:'legendary', desc:'XP taşları devasa menzilden çekilir ve düşmanlara zincirleme yıldırım indirir!', isRelic:true },
  { id:'overcharge', name:'Hiper Tetik', emoji:'⚡', rarity:'rare', desc:'+%75 Saldırı Hızı! Mermiler makineli tüfek gibi yağar ve her 3 vuruşta elektrik patlaması saçar.' },`;

if (html.includes(oldModPoolStart)) {
  html = html.replace(oldModPoolStart, newModPoolStart);
  changes++;
  console.log('[2] Added Efsanevi Relics into MOD_POOL');
} else {
  console.warn('[2] Warning: oldModPoolStart not found');
}

// -------------------------------------------------------------
// 3. ENHANCE applyCurse AND applyMod FOR RELICS
// -------------------------------------------------------------
const oldApplyCurse = `function applyCurse(c) {
  if (!c) return;
  player.cursed = c.id;
  if (c.id === 'curseMight') { player.curseDmg = 1.25; player.curseTaken = 1.15; }
  if (c.id === 'curseGlass') {
    player.mods.move = (player.mods.move || 0) + 1;
    player.maxHp = Math.max(40, player.maxHp - 18);
    player.hp = Math.min(player.hp, player.maxHp);
  }
  if (c.id === 'curseGreed') { player.mods.xpGain = (player.mods.xpGain || 0) + 35; player.curseTaken = 1.12; }
  if (c.id === 'curseFury') { player.mods.atkSpeed = (player.mods.atkSpeed || 0) + 20; }
  spawnFloatText(player.x, player.y - 24, c.name, '#e74c3c');
  playSfx('hit', 0.35);
  updateHud();
}`;

const newApplyCurse = `function applyCurse(c) {
  if (!c) return;
  player.cursed = c.id;
  if (!runLock.flags) runLock.flags = {};
  if (c.id === 'glassCannon') {
    player.maxHp = 1;
    player.hp = 1;
    runLock.flags.glassCannon = true;
    triggerScreenFlash('#c084fc', 0.5, 250);
    spawnFloatText(player.x, player.y - 32, '🔮 EFSANEVİ CAM TOP! (4x HASAR)', '#c084fc', 'big');
  } else if (c.id === 'bloodPact') {
    runLock.flags.bloodPact = true;
    triggerScreenFlash('#ff1744', 0.45, 220);
    spawnFloatText(player.x, player.y - 32, '🩸 KAN BÜYÜSÜ! (-%70 CD)', '#ff1744', 'big');
  } else if (c.id === 'magnetNova') {
    runLock.flags.magnetNova = true;
    triggerScreenFlash('#ffd700', 0.45, 220);
    spawnFloatText(player.x, player.y - 32, '🧲 MIKNATIS KIYAMETİ!', '#ffd700', 'big');
  } else {
    if (c.id === 'curseMight') { player.curseDmg = 1.35; player.curseTaken = 1.15; }
    if (c.id === 'curseGlass') {
      player.mods.move = (player.mods.move || 0) + 1;
      player.maxHp = Math.max(40, player.maxHp - 18);
      player.hp = Math.min(player.hp, player.maxHp);
    }
    if (c.id === 'curseGreed') { player.mods.xpGain = (player.mods.xpGain || 0) + 50; player.curseTaken = 1.12; }
    if (c.id === 'curseFury') { player.mods.atkSpeed = (player.mods.atkSpeed || 0) + 30; }
    spawnFloatText(player.x, player.y - 24, c.name, '#e74c3c');
  }
  playSfx('skill', 0.55, 600);
  vibrate([40, 80, 40]);
  updateHud();
}`;

if (html.includes(oldApplyCurse)) {
  html = html.replace(oldApplyCurse, newApplyCurse);
  changes++;
  console.log('[3] Enhanced applyCurse for Relics');
} else {
  console.warn('[3] Warning: oldApplyCurse not found');
}

// Enhance applyMod to also activate relics
const oldApplyMod = `function applyMod(m) {
  if (!player.mods) player.mods = {};
  player.mods[m.id] = (player.mods[m.id] || 0) + 1;
  spawnFloatText(player.x, player.y-24, m.name + ' Kuşandı! ✨', '#ffd740');
  playSfx('pick', 0.45);
  closeReward();
}`;

const newApplyMod = `function applyMod(m) {
  if (!player.mods) player.mods = {};
  player.mods[m.id] = (player.mods[m.id] || 0) + 1;
  if (!runLock.flags) runLock.flags = {};

  if (m.id === 'glassCannon') {
    player.maxHp = 1;
    player.hp = 1;
    runLock.flags.glassCannon = true;
    player.cursed = 'glassCannon';
    triggerScreenFlash('#c084fc', 0.5, 250);
    spawnFloatText(player.x, player.y - 32, '🔮 EFSANEVİ CAM TOP! (4x HASAR)', '#c084fc', 'big');
  } else if (m.id === 'bloodPactRelic' || m.id === 'bloodPact') {
    runLock.flags.bloodPact = true;
    player.cursed = 'bloodPact';
    triggerScreenFlash('#ff1744', 0.45, 220);
    spawnFloatText(player.x, player.y - 32, '🩸 KAN BÜYÜSÜ! (-%70 CD)', '#ff1744', 'big');
  } else if (m.id === 'magnetNova') {
    runLock.flags.magnetNova = true;
    player.cursed = 'magnetNova';
    triggerScreenFlash('#ffd700', 0.45, 220);
    spawnFloatText(player.x, player.y - 32, '🧲 MIKNATIS KIYAMETİ!', '#ffd700', 'big');
  } else {
    spawnFloatText(player.x, player.y-24, m.name + ' Kuşandı! ✨', '#ffd740');
  }

  playSfx('pick', 0.45);
  updateHud();
  closeReward();
}`;

if (html.includes(oldApplyMod)) {
  html = html.replace(oldApplyMod, newApplyMod);
  changes++;
  console.log('[4] Enhanced applyMod for Relics');
} else {
  console.warn('[4] Warning: oldApplyMod not found');
}

// -------------------------------------------------------------
// 4. CURSE / RELIC SHRINE AT WAVES 4, 7, 10
// -------------------------------------------------------------
const oldWantCurse = `    const wantCurse = (wave === 10);`;
const newWantCurse = `    // Scope 5: Relic / Curse Shrines at milestone waves (4, 7, 10)
    const wantCurse = (wave === 4 || wave === 7 || wave === 10);`;

if (html.includes(oldWantCurse)) {
  html = html.replace(oldWantCurse, newWantCurse);
  changes++;
  console.log('[5] Set Relic Shrines at Waves 4, 7, 10');
} else {
  console.warn('[5] Warning: oldWantCurse not found');
}

// -------------------------------------------------------------
// 5. COMBAT DAMAGE: 4x DAMAGE FOR GLASS CANNON IN markHitDmg
// -------------------------------------------------------------
const oldMarkHitDmgEnd = `  if (player && player.curseDmg && player.curseDmg !== 1) dealt = Math.round(dealt * player.curseDmg);
  if (player && player.hp / player.maxHp <= 0.22) dealt = Math.round(dealt * 1.14);
  if (flow > 40) dealt = Math.round(dealt * (1 + Math.min(0.12, (flow - 40) * 0.0018)));
  return dealt;`;

const newMarkHitDmgEnd = `  if (player && player.curseDmg && player.curseDmg !== 1) dealt = Math.round(dealt * player.curseDmg);
  if (player && player.hp / player.maxHp <= 0.22) dealt = Math.round(dealt * 1.14);
  if (flow > 40) dealt = Math.round(dealt * (1 + Math.min(0.12, (flow - 40) * 0.0018)));

  // SCOPE 5: Efsanevi Cam Top (Glass Cannon) 4.0x Devasa Hasar Çarpanı!
  if (runFlags().glassCannon || (player && player.cursed === 'glassCannon')) {
    dealt = Math.round(dealt * 4.0);
  }
  return dealt;`;

if (html.includes(oldMarkHitDmgEnd)) {
  html = html.replace(oldMarkHitDmgEnd, newMarkHitDmgEnd);
  changes++;
  console.log('[6] Hooked 4.0x damage in markHitDmg for Glass Cannon');
} else {
  console.warn('[6] Warning: oldMarkHitDmgEnd not found');
}

// -------------------------------------------------------------
// 6. LIFESTEAL & VAMPIRISM IN takeDamage AND killEnemy
// -------------------------------------------------------------
const oldTakeDamageStart = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);`;

const newTakeDamageStart = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);

  // SCOPE 5: Efsanevi Kan Büyüsü (Blood Pact) Vuruş Başı Can Çalma (Lifesteal)
  if ((runFlags().bloodPact || (player && player.cursed === 'bloodPact')) && player && player.hp < player.maxHp) {
    player.hp = Math.min(player.maxHp, player.hp + 1.8);
    if (Math.random() < 0.15) {
      burst(player.x, player.y, '#ef4444', 3, 1.2);
    }
  }`;

if (html.includes(oldTakeDamageStart)) {
  html = html.replace(oldTakeDamageStart, newTakeDamageStart);
  changes++;
  console.log('[7] Hooked Hit Lifesteal in takeDamage for Blood Pact');
} else {
  console.warn('[7] Warning: oldTakeDamageStart not found');
}

// Kill Lifesteal in killEnemy
const oldKillEnemyPts = `    en._dead = true;
    const pts = en.type==='boss' ? 80+wave*8 : en.type==='tank' ? 18 : 10 + wave;
    score += pts;`;

const newKillEnemyPts = `    en._dead = true;
    const pts = en.type==='boss' ? 80+wave*8 : en.type==='tank' ? 18 : 10 + wave;
    score += pts;

    // SCOPE 5: Efsanevi Kan Büyüsü (Blood Pact) Katletmede Can Çalma
    if ((runFlags().bloodPact || (player && player.cursed === 'bloodPact')) && player && player.hp < player.maxHp) {
      player.hp = Math.min(player.maxHp, player.hp + 4.5);
      if (Math.random() < 0.35) {
        spawnFloatText(player.x, player.y - 22, '+4.5 Can', '#22c55e', 'small');
        burst(player.x, player.y, '#ef4444', 4, 1.5);
      }
    }`;

if (html.includes(oldKillEnemyPts)) {
  html = html.replace(oldKillEnemyPts, newKillEnemyPts);
  changes++;
  console.log('[8] Hooked Kill Lifesteal in killEnemy for Blood Pact');
} else {
  console.warn('[8] Warning: oldKillEnemyPts not found');
}

// -------------------------------------------------------------
// 7. COOLDOWN REDUCTION IN skillCdMul & auto fire
// -------------------------------------------------------------
const oldSkillCdMul = `function skillCdMul() {
  const raw = (player && player.mods && player.mods.skillCd) || 0;
  return 1 + raw / 100 * synMul('skillCd', 0.32) + (playerSig && playerSig.id === 'cdPlus' ? 0.16 : 0);
}`;

const newSkillCdMul = `function skillCdMul() {
  const raw = (player && player.mods && player.mods.skillCd) || 0;
  let mul = 1 + raw / 100 * synMul('skillCd', 0.32) + (playerSig && playerSig.id === 'cdPlus' ? 0.16 : 0);
  // SCOPE 5: Efsanevi Kan Büyüsü (Blood Pact) -%70 Soğuma Süresi (3.33x Hızlı Dolum)
  if (runFlags().bloodPact || (player && player.cursed === 'bloodPact')) {
    mul *= 3.33;
  }
  return mul;
}`;

if (html.includes(oldSkillCdMul)) {
  html = html.replace(oldSkillCdMul, newSkillCdMul);
  changes++;
  console.log('[9] Hooked 70% CD reduction in skillCdMul for Blood Pact');
} else {
  console.warn('[9] Warning: oldSkillCdMul not found');
}

// Auto fire interval speedup
const oldFireInterval = `    let iv = currentAuto().interval * as * moveMul * overchargeMod;
    if (typeof activeFusionClass === 'function' && activeFusionClass() === 'steam' && steamBand() === 'over') iv *= 0.7;`;

const newFireInterval = `    let iv = currentAuto().interval * as * moveMul * overchargeMod;
    if (runFlags().bloodPact || (player && player.cursed === 'bloodPact')) iv *= 0.6;
    if (typeof activeFusionClass === 'function' && activeFusionClass() === 'steam' && steamBand() === 'over') iv *= 0.7;`;

if (html.includes(oldFireInterval)) {
  html = html.replace(oldFireInterval, newFireInterval);
  changes++;
  console.log('[10] Hooked faster attack speed for Blood Pact');
} else {
  console.warn('[10] Warning: oldFireInterval not found');
}

// -------------------------------------------------------------
// 8. MAGNET NOVA: ENHANCED MAGNET RANGE & FLYING GEM LIGHTNING
// -------------------------------------------------------------
const oldMagnetRange = `function magnetRange() {
  let r = 78 + (modValue('magnet') || 0) * synMul('magnet', 0.4) + (runFlags().magnetPx || 0);
  r += treeLv('magnet') * 18;
  if (player && player.hp / player.maxHp <= 0.25) r += 72;
  r += flow * 0.55;
  return r;
}`;

const newMagnetRange = `function magnetRange() {
  let r = 78 + (modValue('magnet') || 0) * synMul('magnet', 0.4) + (runFlags().magnetPx || 0);
  r += treeLv('magnet') * 18;
  if (player && player.hp / player.maxHp <= 0.25) r += 72;
  r += flow * 0.55;
  // SCOPE 5: Efsanevi Mıknatıs Kıyameti (Magnet Nova) devasa çekim alanı (+180px)
  if (runFlags().magnetNova || (player && player.cursed === 'magnetNova')) {
    r += 180;
  }
  return r;
}`;

if (html.includes(oldMagnetRange)) {
  html = html.replace(oldMagnetRange, newMagnetRange);
  changes++;
  console.log('[11] Enhanced magnetRange for Magnet Nova');
} else {
  console.warn('[11] Warning: oldMagnetRange not found');
}

// Enhanced lightning arc from flying gems to nearby enemies in pullPickup
const oldPullPickup = `function pullPickup(p, py, range, dt) {
  // Magnet Cataclysm Relic: Shock nearby enemies as gems fly to player
  if (runFlags().magnetNova && Math.random() < 0.08) {
    const nearEn = nearestEnemyInRange(140);
    if (nearEn) {
      takeDamage(nearEn, 14, 'storm', { quiet: true });
      sparks.push({ x: nearEn.x, y: nearEn.y, vx: 0, vy: -1, r: 2, life: 0.2, maxLife: 0.2, color: '#ffd700', rot: 0, vr: 0 });
    }
  }`;

const newPullPickup = `function pullPickup(p, py, range, dt) {
  // SCOPE 5: Efsanevi Mıknatıs Kıyameti (Magnet Nova) Zincirleme Yıldırım
  if ((runFlags().magnetNova || (player && player.cursed === 'magnetNova')) && enemies && enemies.length > 0 && Math.random() < 0.16) {
    for (let eIdx = 0; eIdx < enemies.length; eIdx++) {
      const en = enemies[eIdx];
      const distToGem = Math.hypot(en.x - p.x, en.y - py);
      if (distToGem < 130) {
        takeDamage(en, 24, 'storm', { quiet: true });
        // Visual electric lightning beam connecting flying gem and enemy
        for (let s = 0; s < 4; s++) {
          const t = s / 3;
          sparks.push({
            x: p.x + (en.x - p.x) * t + (Math.random() - 0.5) * 6,
            y: py + (en.y - py) * t + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: 1.8,
            life: 0.18,
            maxLife: 0.18,
            color: '#38bdf8',
            rot: 0,
            vr: 0
          });
        }
        break;
      }
    }
  }`;

if (html.includes(oldPullPickup)) {
  html = html.replace(oldPullPickup, newPullPickup);
  changes++;
  console.log('[12] Hooked high-fidelity flying gem lightning in pullPickup');
} else {
  console.warn('[12] Warning: oldPullPickup not found');
}

// -------------------------------------------------------------
// 9. RELIC VISUAL AURAS IN drawHeroPlayer
// -------------------------------------------------------------
const oldHeroShieldEnd = `  // Sol El: Yuvarlak Ahşap-Çelik Kalkan (Round Shield)
  const shieldX = px + Math.cos(faceAng - 0.9) * (player.r + 2);
  const shieldY = cy + Math.sin(faceAng - 0.9) * (player.r + 2);
  ctx.fillStyle = '#1e293b'; // Dış demir çember
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#991b1b'; // Kırmızı kalkan deseni
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b'; // Altın kalkan göbeği (Boss)
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}`;

const newHeroShieldEnd = `  // Sol El: Yuvarlak Ahşap-Çelik Kalkan (Round Shield)
  const shieldX = px + Math.cos(faceAng - 0.9) * (player.r + 2);
  const shieldY = cy + Math.sin(faceAng - 0.9) * (player.r + 2);
  ctx.fillStyle = '#1e293b'; // Dış demir çember
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#991b1b'; // Kırmızı kalkan deseni
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b'; // Altın kalkan göbeği (Boss)
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // SCOPE 5: RELIC VISUAL AURA SYSTEM (Efsanevi Yadigarların Ekranda Görsel İmzası)
  const isGlass = runFlags().glassCannon || (player && player.cursed === 'glassCannon');
  const isBlood = runFlags().bloodPact || (player && player.cursed === 'bloodPact');
  const isMagnet = runFlags().magnetNova || (player && player.cursed === 'magnetNova');

  if (isGlass) {
    // Cam Top: Violet crystalline astral orbiting runes & pulse ring
    ctx.strokeStyle = 'rgba(192, 132, 252, ' + (0.55 + 0.3 * Math.sin(time * 0.16)) + ')';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(px, cy, player.r + 12 + Math.sin(time * 0.22) * 2, 0, Math.PI * 2);
    ctx.stroke();
    for (let k = 0; k < 3; k++) {
      const orbAng = time * 0.08 + k * (Math.PI * 2 / 3);
      const ox = px + Math.cos(orbAng) * (player.r + 14);
      const oy = cy + Math.sin(orbAng) * (player.r + 14) * 0.65;
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (isBlood) {
    // Kan Büyüsü: Swirling crimson blood mist & vampiric aura
    ctx.strokeStyle = 'rgba(239, 68, 68, ' + (0.55 + 0.35 * Math.sin(time * 0.18)) + ')';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(px, cy, player.r + 10 + Math.cos(time * 0.2) * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    if (Math.random() < 0.18) {
      sparks.push({
        x: px + (Math.random() - 0.5) * 16,
        y: cy + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.8 - Math.random() * 0.8,
        r: 1.6, life: 0.3, maxLife: 0.3, color: '#ff1744', rot: 0, vr: 0
      });
    }
  }

  if (isMagnet) {
    // Mıknatıs Kıyameti: Golden electric magnetic field rings
    ctx.strokeStyle = 'rgba(250, 204, 21, ' + (0.55 + 0.35 * Math.sin(time * 0.25)) + ')';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(px, cy, player.r + 14 + Math.sin(time * 0.3) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}`;

if (html.includes(oldHeroShieldEnd)) {
  html = html.replace(oldHeroShieldEnd, newHeroShieldEnd);
  changes++;
  console.log('[13] Hooked Relic Visual Auras in drawHeroPlayer');
} else {
  console.warn('[13] Warning: oldHeroShieldEnd not found');
}

// -------------------------------------------------------------
// 10. HUD RELIC BAR HTML, CSS & updateHud DISPLAY
// -------------------------------------------------------------
// Add relic hud bar in HTML right after hud-bars-row
const oldHudBarsRow = `        <div class="meter-pill wave-pill" id="hudWavePill">
          <span class="meter-val" id="waveLabel">Dalga 1</span>
        </div>
      </div>`;

const newHudBarsRow = `        <div class="meter-pill wave-pill" id="hudWavePill">
          <span class="meter-val" id="waveLabel">Dalga 1</span>
        </div>
      </div>
      <div id="relicHudBar" class="relic-hud-bar" style="display:none;"></div>`;

if (html.includes(oldHudBarsRow)) {
  html = html.replace(oldHudBarsRow, newHudBarsRow);
  changes++;
  console.log('[14] Added #relicHudBar in HTML');
} else {
  console.warn('[14] Warning: oldHudBarsRow not found');
}

// Add CSS styling for relicHudBar
const oldCssEnd = `</style>`;
const relicCss = `
.relic-hud-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 5px;
  align-items: center;
  pointer-events: none;
}
.relic-hud-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.6);
  animation: relicPulse 2s infinite ease-in-out;
}
.relic-hud-badge.glass {
  background: rgba(88, 28, 135, 0.75);
  border: 1px solid #c084fc;
  color: #f3e8ff;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
}
.relic-hud-badge.blood {
  background: rgba(127, 29, 29, 0.75);
  border: 1px solid #ef4444;
  color: #fee2e2;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.45);
}
.relic-hud-badge.magnet {
  background: rgba(113, 63, 18, 0.75);
  border: 1px solid #facc15;
  color: #fef08a;
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.45);
}
@keyframes relicPulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.04); filter: brightness(1.22); }
}
</style>`;

if (html.includes(oldCssEnd)) {
  html = html.replace(oldCssEnd, relicCss);
  changes++;
  console.log('[15] Added Relic HUD CSS');
} else {
  console.warn('[15] Warning: </style> not found');
}

// Update updateHud to show active relic badges
const oldUpdateHudTail = `  fillBossHud(enemies.find(e => e.type === 'boss'));`;
const newUpdateHudTail = `  fillBossHud(enemies.find(e => e.type === 'boss'));

  // SCOPE 5: Update Relic HUD Badges
  const relicBar = document.getElementById('relicHudBar');
  if (relicBar) {
    const isGlass = runFlags().glassCannon || (player && player.cursed === 'glassCannon');
    const isBlood = runFlags().bloodPact || (player && player.cursed === 'bloodPact');
    const isMagnet = runFlags().magnetNova || (player && player.cursed === 'magnetNova');
    if (isGlass || isBlood || isMagnet) {
      relicBar.style.display = 'flex';
      let badges = '';
      if (isGlass) badges += '<span class="relic-hud-badge glass">🔮 CAM TOP (4x DMG)</span>';
      if (isBlood) badges += '<span class="relic-hud-badge blood">🩸 KAN BÜYÜSÜ (-%70 CD)</span>';
      if (isMagnet) badges += '<span class="relic-hud-badge magnet">🧲 MIKNATIS KIYAMETİ</span>';
      relicBar.innerHTML = badges;
    } else {
      relicBar.style.display = 'none';
    }
  }`;

if (html.includes(oldUpdateHudTail)) {
  html = html.replace(oldUpdateHudTail, newUpdateHudTail);
  changes++;
  console.log('[16] Hooked active relic badge rendering in updateHud');
} else {
  console.warn('[16] Warning: oldUpdateHudTail not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Scope 5 apply script. Total successful patches: ${changes}/16`);
