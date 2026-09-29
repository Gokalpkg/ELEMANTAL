const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. SCOPE 4: RUN TILT & FOOTSTEP DUST IN drawHeroPlayer
// -------------------------------------------------------------
const oldDrawHeroSetup = `  // 1. Zırhlı Bacaklar Yürüme/Koşma Döngüsü (Hero Movement Cycle - FSM State Driven)
  const pState = player.state || (isMoving ? PLAYER_STATE.RUN : PLAYER_STATE.IDLE);
  const isHurt = pState === PLAYER_STATE.HURT;
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isRunning = pState === PLAYER_STATE.RUN;`;

const newDrawHeroSetup = `  // 1. Zırhlı Bacaklar Yürüme/Koşma Döngüsü (Hero Movement Cycle - FSM State Driven)
  const pState = player.state || (isMoving ? PLAYER_STATE.RUN : PLAYER_STATE.IDLE);
  const isHurt = pState === PLAYER_STATE.HURT;
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isRunning = pState === PLAYER_STATE.RUN;

  // RUN TILT (Koşu Eğimi: 6-7 derece ileri eğilme açısı)
  const runTiltAngle = isRunning ? (isFacingLeft ? -0.11 : 0.11) : 0;

  // FOOTSTEP DUST PUFFS (Ayak Tozu: Adım atarken arkaya fırlayan toz pikselleri)
  if (isRunning && Math.random() < 0.28) {
    sparks.push({
      x: px + (Math.random() - 0.5) * 8,
      y: py + 7,
      vx: -Math.cos(faceAng) * (1.2 + Math.random()),
      vy: -0.25 - Math.random() * 0.35,
      r: 1.2,
      life: 0.4,
      maxLife: 0.4,
      color: '#94a3b8',
      rot: 0,
      vr: 0
    });
  }`;

if (html.includes(oldDrawHeroSetup)) {
  html = html.replace(oldDrawHeroSetup, newDrawHeroSetup);
  console.log('Added Run Tilt and Footstep Dust to drawHeroPlayer');
} else {
  console.log('Could not find oldDrawHeroSetup');
}

// Apply tilt angle in drawHeroPlayer right before drawing the hero head/body
const oldHeroBodyStart = `  // 2. Kırmızı Boyun Atkısı & Pelerin (Red Flowing Scarf - Pafta Image 2)`;
const newHeroBodyStart = `  // Apply Run Tilt to Character Stance
  if (runTiltAngle !== 0) {
    ctx.translate(px, cy);
    ctx.rotate(runTiltAngle);
    ctx.translate(-px, -cy);
  }

  // 2. Kırmızı Boyun Atkısı & Pelerin (Red Flowing Scarf - Pafta Image 2)`;

if (html.includes(oldHeroBodyStart)) {
  html = html.replace(oldHeroBodyStart, newHeroBodyStart);
  console.log('Applied Run Tilt transform to hero stance');
} else {
  console.log('Could not find oldHeroBodyStart');
}

// -------------------------------------------------------------
// 2. SCOPE 4: LOW HP HEARTBEAT VIGNETTE (< 25% HP)
// -------------------------------------------------------------
const oldVignetteBlock = `  const vg = ctx.createRadialGradient(W * 0.5, H * 0.46, 70, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(0.7, 'rgba(0,0,0,0.08)');
  vg.addColorStop(1, biome.key==='forest' ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);`;

const newVignetteBlock = `  const vg = ctx.createRadialGradient(W * 0.5, H * 0.46, 70, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(0.7, 'rgba(0,0,0,0.08)');
  vg.addColorStop(1, biome.key==='forest' ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // CRITICAL LOW HP HEARTBEAT PULSE VIGNETTE (< 25% HP Panic)
  if (player && player.hp > 0 && player.maxHp > 0) {
    const hpRatio = player.hp / player.maxHp;
    if (hpRatio <= 0.28) {
      const beatPulse = Math.abs(Math.sin(time * 0.16));
      const panicIntensity = (1 - hpRatio / 0.28) * (0.35 + beatPulse * 0.35);
      const lowHpG = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.22, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
      lowHpG.addColorStop(0, 'rgba(0,0,0,0)');
      lowHpG.addColorStop(0.65, 'rgba(185, 28, 28, ' + (panicIntensity * 0.45) + ')');
      lowHpG.addColorStop(1, 'rgba(220, 38, 38, ' + panicIntensity + ')');
      ctx.fillStyle = lowHpG;
      ctx.fillRect(0, 0, W, H);
    }
  }`;

if (html.includes(oldVignetteBlock)) {
  html = html.replace(oldVignetteBlock, newVignetteBlock);
  console.log('Added Critical Low HP Heartbeat Vignette');
} else {
  console.log('Could not find oldVignetteBlock');
}

// -------------------------------------------------------------
// 3. SCOPE 5: GAME CHANGER EFSANEVİ RELICS IN CURSE_CARDS
// -------------------------------------------------------------
const oldCurseCards = `const CURSE_CARDS = [
  { id:'curseMight', name:'Kanlı Güç', emoji:'🩸', hint:'+%25 hasar · +%15 alınan' },
  { id:'curseGlass', name:'Cam Top', emoji:'🪞', hint:'+%16 hız · -18 can' },
  { id:'curseGreed', name:'Açgöz', emoji:'💰', hint:'+%35 XP · dalga sonu can yok' },
  { id:'curseFury', name:'Öfke', emoji:'💢', hint:'+%20 atış hızı' }
];`;

const newCurseCards = `const CURSE_CARDS = [
  { id:'glassCannon', name:'Efsanevi: Cam Top', emoji:'🔮', hint:'+%300 Kritik Hasar & Dash Patlaması! (Maks Can = 1)', apply() { player.maxHp = 1; player.hp = 1; runFlags().glassCannon = true; spawnFloatText(player.x, player.y - 30, 'EFSANEVİ CAM TOP!', '#c084fc', 'big'); } },
  { id:'bloodPact', name:'Efsanevi: Kan Büyüsü', emoji:'🩸', hint:'Büyü soğuma süreleri -%70! (+%15 Can Çalma)', apply() { runFlags().bloodPact = true; spawnFloatText(player.x, player.y - 30, 'KAN BÜYÜSÜ AKTİF!', '#ff1744', 'big'); } },
  { id:'magnetNova', name:'Efsanevi: Mıknatıs Kıyameti', emoji:'🧲', hint:'XP taşları uçarken düşmanlara yıldırım çarpar!', apply() { runFlags().magnetNova = true; spawnFloatText(player.x, player.y - 30, 'MIKNATIS KIYAMETİ!', '#ffd700', 'big'); } },
  { id:'curseMight', name:'Kanlı Güç', emoji:'⚔️', hint:'+%35 hasar · +%15 alınan' },
  { id:'curseGreed', name:'Açgöz Kral', emoji:'💰', hint:'+%50 XP & Kristal' },
  { id:'curseFury', name:'Öfke Patlaması', emoji:'💢', hint:'+%30 atış hızı' }
];`;

if (html.includes(oldCurseCards)) {
  html = html.replace(oldCurseCards, newCurseCards);
  console.log('Added Game Changer Relics to CURSE_CARDS');
} else {
  console.log('Could not find oldCurseCards');
}

// Hook Glass Cannon dash explosion in dash movement
const oldDashExplosionTarget = `    // Ghost Trail: spawn high-fidelity afterimage silhouettes during dash`;
const newDashExplosionTarget = `    // Glass Cannon Relic Explosion on Dash
    if (runFlags().glassCannon && Math.random() < 0.25) {
      damageEnemiesInRadius(player.x, player.y, 75, 45, ['burn'], 1.5, 'fire');
      burst(player.x, player.y, '#c084fc', 8, 3.0);
    }
    // Ghost Trail: spawn high-fidelity afterimage silhouettes during dash`;

if (html.includes(oldDashExplosionTarget)) {
  html = html.replace(oldDashExplosionTarget, newDashExplosionTarget);
  console.log('Hooked Glass Cannon dash explosion');
} else {
  console.log('Could not find oldDashExplosionTarget');
}

// Hook Magnet Cataclysm in pullPickup
const oldPullPickupTarget = `function pullPickup(p, py, range, dt) {`;
const newPullPickupTarget = `function pullPickup(p, py, range, dt) {
  // Magnet Cataclysm Relic: Shock nearby enemies as gems fly to player
  if (runFlags().magnetNova && Math.random() < 0.08) {
    const nearEn = nearestEnemyInRange(140);
    if (nearEn) {
      takeDamage(nearEn, 14, 'storm', { quiet: true });
      sparks.push({ x: nearEn.x, y: nearEn.y, vx: 0, vy: -1, r: 2, life: 0.2, maxLife: 0.2, color: '#ffd700', rot: 0, vr: 0 });
    }
  }`;

if (html.includes(oldPullPickupTarget)) {
  html = html.replace(oldPullPickupTarget, newPullPickupTarget);
  console.log('Hooked Magnet Cataclysm in pullPickup');
} else {
  console.log('Could not find oldPullPickupTarget');
}

// -------------------------------------------------------------
// 4. SCOPE 6: CASCADING DAMAGE NUMBERS WITH POP & SHAKE
// -------------------------------------------------------------
// Enhance floatCrit keyframes and float-txt.crit CSS
html = html.replace(
  `@keyframes floatCrit { 0% {opacity:1; transform:translateY(0) scale(1.6);} 12% {opacity:1; transform:translateY(-4px) scale(1.1);} 100% {opacity:0; transform:translateY(-48px) scale(.8);} }`,
  `@keyframes floatCrit { 0% {opacity:1; transform:translateY(0) scale(1.85) rotate(-4deg);} 14% {opacity:1; transform:translateY(-8px) scale(1.2) rotate(2deg);} 100% {opacity:0; transform:translateY(-54px) scale(.75) rotate(0deg);} }`
);

// In spawnFloatText, add cascade staggered position
const oldSpawnFloatScatter = `  const rect = canvas.getBoundingClientRect();
  const scatterX = (Math.random() - 0.5) * 14;
  const scatterY = (Math.random() - 0.5) * 6;`;

const newSpawnFloatScatter = `  const rect = canvas.getBoundingClientRect();
  // Cascading scatter: staggered upward-fanning trajectory
  const cascadeSeed = performance.now() * 0.01;
  const scatterX = Math.sin(cascadeSeed) * 18;
  const scatterY = -Math.abs(Math.cos(cascadeSeed)) * 12 - (isCrit ? 8 : 0);`;

if (html.includes(oldSpawnFloatScatter)) {
  html = html.replace(oldSpawnFloatScatter, newSpawnFloatScatter);
  console.log('Enhanced spawnFloatText with Cascading trajectory');
} else {
  console.log('Could not find oldSpawnFloatScatter');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html with Scopes 4, 5, and 6');
