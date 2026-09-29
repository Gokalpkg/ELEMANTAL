const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. ENHANCE takeDamage: Solid White Flash, Hit-Stop, Knockback & Stagger
// -------------------------------------------------------------
const oldTakeDamage = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);
  en.flashT = 4;
  en.hitDmgRef = dealt;
  let out = dealt;`;

const newTakeDamage = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);
  const isCrit = opt.crit || (dealt > raw * 1.25);
  en.flashT = isCrit ? 6 : 4;
  en.hitDmgRef = dealt;

  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Hades / Dead Cells micro-crunch)
  if (!opt.quiet) {
    triggerHitStop(isCrit ? 5 : 2); // 2-frame micro-freeze on hit, 5-frame on crit!
    shake = Math.max(shake, isCrit ? 5.5 : 2.0);
    if (isCrit) vibrate([15, 25]);
  }

  // 2. DIRECTIONAL KNOCKBACK & STAGGER IMPULSE (Mob flinch)
  if (en.type !== 'boss') {
    const srcX = (opt.srcX != null) ? opt.srcX : (player ? player.x : en.x);
    const srcY = (opt.srcY != null) ? opt.srcY : (player ? player.y : en.y);
    const kAng = (opt.hitAngle != null) ? opt.hitAngle : Math.atan2(en.y - srcY, en.x - srcX);
    const kForce = (isCrit ? 6.2 : 3.8) * (en.knockbackResist ? (1 - en.knockbackResist) : 1.0);
    en.vx = Math.cos(kAng) * kForce;
    en.vy = Math.sin(kAng) * kForce;
    en.staggerTimer = isCrit ? 0.18 : 0.10;
  }

  let out = dealt;`;

if (html.includes(oldTakeDamage)) {
  html = html.replace(oldTakeDamage, newTakeDamage);
  console.log('Enhanced takeDamage with Hit-Stop, White Flash & Knockback');
} else {
  console.log('Could not find oldTakeDamage');
}

// -------------------------------------------------------------
// 2. ENEMY MOVEMENT LOOP: STAGGER / REEL CHECK
// -------------------------------------------------------------
const oldEnemyMovementHead = `  enemies.forEach(en => {
    if (en.type === 'boss') {
      updateBossAi(en, dt, player, currentBiome(), now);
      return;
    }
    const stunned = (en.stunUntil && now < en.stunUntil) || (en.rootUntil && now < en.rootUntil && en.type !== 'shaman');`;

const newEnemyMovementHead = `  enemies.forEach(en => {
    if (en.type === 'boss') {
      updateBossAi(en, dt, player, currentBiome(), now);
      return;
    }
    // STAGGER / KNOCKBACK REEL: enemy drifts backward and pathing briefly halts
    if (en.staggerTimer > 0) {
      en.staggerTimer -= dt * (1 / 60);
      if (en.vx || en.vy) {
        tryMove(en, (en.vx || 0) * dt, (en.vy || 0) * dt);
        en.vx = (en.vx || 0) * 0.82;
        en.vy = (en.vy || 0) * 0.82;
      }
      return; // Reeling from impact, cannot advance!
    }
    const stunned = (en.stunUntil && now < en.stunUntil) || (en.rootUntil && now < en.rootUntil && en.type !== 'shaman');`;

if (html.includes(oldEnemyMovementHead)) {
  html = html.replace(oldEnemyMovementHead, newEnemyMovementHead);
  console.log('Added Stagger / Knockback Reel to Enemy Movement Loop');
} else {
  console.log('Could not find oldEnemyMovementHead');
}

// -------------------------------------------------------------
// 3. SOLID WHITE HIT FLASH OVERLAY FOR ALL ENEMIES & BOSSES
// -------------------------------------------------------------
const oldEnemyFlashRender = `    if (en.flashT > 0) {
      en.flashT--;
      if (en.type !== 'boss') {
        ctx.save();
        ctx.globalAlpha = 0.52;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(en.x, cy, en.r + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }`;

const newEnemyFlashRender = `    if (en.flashT > 0) {
      en.flashT--;
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(en.x, cy, en.r + (en.type === 'boss' ? 4 : 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }`;

if (html.includes(oldEnemyFlashRender)) {
  html = html.replace(oldEnemyFlashRender, newEnemyFlashRender);
  console.log('Upgraded Enemy & Boss White Hit Flash to Solid High-Contrast Pop');
} else {
  console.log('Could not find oldEnemyFlashRender');
}

// -------------------------------------------------------------
// 4. DEATH DISSOLVE & ELEMENTAL PIXEL GIBS IN killEnemy
// -------------------------------------------------------------
const oldKillEnemyBurst = `  burst(en.x, en.y, deathCol, isBoss ? 32 : isTank ? 22 : 16, isBoss ? 5.2 : isFast ? 4.5 : 3.6);
  burst(en.x, en.y, '#ffffff', isBoss ? 20 : 8, isBoss ? 4.2 : 2.8);
  splatFloor(en.x, en.y, en.r * (isBoss ? 1.4 : 1.1));`;

const newKillEnemyBurst = `  burst(en.x, en.y, deathCol, isBoss ? 32 : isTank ? 22 : 16, isBoss ? 5.2 : isFast ? 4.5 : 3.6);
  burst(en.x, en.y, '#ffffff', isBoss ? 20 : 8, isBoss ? 4.2 : 2.8);
  splatFloor(en.x, en.y, en.r * (isBoss ? 1.4 : 1.1));

  // ELEMENTAL PIXEL GIBS & DEATH DISSOLVE (Retro shattering pixel debris)
  const gibCount = isBoss ? 28 : isTank ? 18 : 12;
  for (let g = 0; g < gibCount; g++) {
    const ga = Math.random() * Math.PI * 2;
    const gSpd = (isBoss ? 3.5 : 2.0) + Math.random() * (isBoss ? 4.5 : 3.5);
    const gRad = 1.5 + Math.random() * 2.5;
    sparks.push({
      x: en.x + (Math.random() - 0.5) * en.r,
      y: en.y + (Math.random() - 0.5) * en.r,
      vx: Math.cos(ga) * gSpd,
      vy: Math.sin(ga) * gSpd - 0.6,
      r: gRad,
      life: 1.0,
      maxLife: 1.0,
      color: (g % 3 === 0) ? '#ffffff' : (g % 2 === 0) ? deathCol : (en.color || '#ff8a80'),
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3
    });
  }`;

if (html.includes(oldKillEnemyBurst)) {
  html = html.replace(oldKillEnemyBurst, newKillEnemyBurst);
  console.log('Added Elemental Pixel Gibs & Death Dissolve to killEnemy');
} else {
  console.log('Could not find oldKillEnemyBurst');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html with Scope 2 (Hit Feedback & Juice)');
