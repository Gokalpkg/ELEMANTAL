const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. MAKEENEMY: ADD MARKSMAN, DISRUPTOR, AND SHIELD BEARER STATS
const oldMakeEnemyStats = `  const hpBase = type==='swarmer' ? 22 :
                 type==='golem' ? 95 :
                 type==='behemoth' ? 82 :
                 type==='specter' ? 52 :
                 type==='tank'||type==='armored' ? 70 :
                 type==='bearer' ? 58 :
                 type==='fast' ? 28 :
                 type==='shooter' ? 32 :
                 type==='exploder' ? 26 :
                 type==='slime' ? 42 :
                 type==='leech' ? 30 :
                 type==='shaman' ? 48 :
                 type==='boss' ? 140 : 34;`;

const newMakeEnemyStats = `  const hpBase = type==='swarmer' ? 22 :
                 type==='golem' ? 95 :
                 type==='behemoth' ? 82 :
                 type==='specter' ? 52 :
                 type==='tank'||type==='armored' ? 70 :
                 type==='bearer' ? 68 :
                 type==='marksman' ? 36 :
                 type==='disruptor' ? 58 :
                 type==='fast' ? 28 :
                 type==='shooter' ? 32 :
                 type==='exploder' ? 26 :
                 type==='slime' ? 42 :
                 type==='leech' ? 30 :
                 type==='shaman' ? 48 :
                 type==='boss' ? 140 : 34;`;

if (html.includes(oldMakeEnemyStats)) {
  html = html.replace(oldMakeEnemyStats, newMakeEnemyStats);
  console.log('1. Patched hpBase in makeEnemy!');
} else {
  console.log('Warning: oldMakeEnemyStats not found!');
}

const oldMakeEnemyRadius = `type==='armored'?23: type==='bearer'?22: type==='fast'?9.5: type==='shooter'?13: type==='exploder'?14: type==='slime'?17: type==='leech'?12: type==='shaman'?16: type==='boss'?32:14.5;`;

const newMakeEnemyRadius = `type==='armored'?23: type==='bearer'?22: type==='marksman'?13.5: type==='disruptor'?18.5: type==='fast'?9.5: type==='shooter'?13: type==='exploder'?14: type==='slime'?17: type==='leech'?12: type==='shaman'?16: type==='boss'?32:14.5;`;

if (html.includes(oldMakeEnemyRadius)) {
  html = html.replace(oldMakeEnemyRadius, newMakeEnemyRadius);
  console.log('2. Patched radius in makeEnemy!');
} else {
  console.log('Warning: oldMakeEnemyRadius not found!');
}

const oldMakeEnemySpeed = `type==='bearer'?0.48:
                type==='shooter'?0.80:`;

const newMakeEnemySpeed = `type==='bearer'?0.52:
                type==='marksman'?0.74:
                type==='disruptor'?0.62:
                type==='shooter'?0.80:`;

if (html.includes(oldMakeEnemySpeed)) {
  html = html.replace(oldMakeEnemySpeed, newMakeEnemySpeed);
  console.log('3. Patched speed in makeEnemy!');
} else {
  console.log('Warning: oldMakeEnemySpeed not found!');
}

// 2. MAKEENEMY: INITIALIZE ROLES TIMERS AND FLAGS
const oldMakeEnemyEnd = `  en.hp = hp;
  en.maxHp = hp;
  if (en.isElite) {`;

const newMakeEnemyEnd = `  en.hp = hp;
  en.maxHp = hp;
  if (type === 'bearer') {
    en.shieldActive = true;
    en.facingAngle = 0;
    en.shieldBlocked = 0;
  } else if (type === 'marksman') {
    en.sniperTimer = 130 + Math.random() * 50;
    en.snipeAimT = 0;
    en.aimX = 0;
    en.aimY = 0;
  } else if (type === 'disruptor') {
    en.disruptTimer = 180 + Math.random() * 60;
    en.auraPulse = 0;
  }
  if (en.isElite) {`;

if (html.includes(oldMakeEnemyEnd)) {
  html = html.replace(oldMakeEnemyEnd, newMakeEnemyEnd);
  console.log('4. Patched role properties in makeEnemy!');
} else {
  console.log('Warning: oldMakeEnemyEnd not found!');
}

// 3. TAKEDAMAGE: DIRECTIONAL SHIELD BLOCK & DISRUPTOR FORTIFICATION
const oldTakeDmgStart = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);`;

const newTakeDmgStart = `function takeDamage(en, raw, el, opt) {
  opt = opt || {};
  let dealt = markHitDmg(en, raw, el);

  // STEP 5: DIRECTIONAL SHIELD BLOCK (Kalkan Taşıyıcı / Bulwark)
  if (en.type === 'bearer' && en.shieldActive && !opt.ignoreShield) {
    const srcX = (opt.srcX != null) ? opt.srcX : (player ? player.x : en.x);
    const srcY = (opt.srcY != null) ? opt.srcY : (player ? player.y : en.y);
    const attackAngle = Math.atan2(srcY - en.y, srcX - en.x);
    const facingAngle = en.facingAngle != null ? en.facingAngle : (player ? Math.atan2(player.y - en.y, player.x - en.x) : 0);
    let diff = Math.abs(attackAngle - facingAngle);
    while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
    // If incoming hit hits the front 130-degree arc (< ~1.15 rads)
    if (diff < 1.15) {
      dealt = Math.max(1, Math.round(dealt * 0.15)); // 85% Damage Block!
      en.shieldBlocked = 12;
      playSfx('block', 0.42, 100);
      shake = Math.max(shake, 3.5);
      burst(en.x + Math.cos(facingAngle) * (en.r + 4), en.y + Math.sin(facingAngle) * (en.r + 4), '#38bdf8', 10, 3.0);
      spawnFloatText(en.x, en.y - 24, '🛡️ BLOK!', '#38bdf8', 'small');
    }
  }

  // STEP 5: DISRUPTOR FORTIFICATION AURA (-20% damage if shielded by nearby Disruptor)
  if (en.hasDisruptorBuff && en.type !== 'disruptor') {
    dealt = Math.max(1, Math.round(dealt * 0.80));
  }`;

if (html.includes(oldTakeDmgStart)) {
  html = html.replace(oldTakeDmgStart, newTakeDmgStart);
  console.log('5. Patched takeDamage with directional shield and disruptor aura!');
} else {
  console.log('Warning: oldTakeDmgStart not found!');
}

// 4. ENEMY UPDATE LOOP: SWARM FLOCKING, MARKSMAN, DISRUPTOR, AND BEARER AI
const oldEnemyLoopStart = `  enemies.forEach(en => {
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
    }`;

const newEnemyLoopStart = `  // Step 5: Disruptor Aura Pre-Pass (Buff nearby swarm allies)
  const disruptors = enemies.filter(e => e.type === 'disruptor' && e.hp > 0);

  enemies.forEach(en => {
    if (en.type === 'boss') {
      updateBossAi(en, dt, player, currentBiome(), now);
      return;
    }
    // Check Disruptor aura buff (+22% speed, -20% dmg taken)
    en.hasDisruptorBuff = false;
    if (en.type !== 'disruptor' && disruptors.length > 0) {
      for (let di = 0; di < disruptors.length; di++) {
        if (Math.hypot(disruptors[di].x - en.x, disruptors[di].y - en.y) < 120) {
          en.hasDisruptorBuff = true;
          break;
        }
      }
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
    }`;

if (html.includes(oldEnemyLoopStart)) {
  html = html.replace(oldEnemyLoopStart, newEnemyLoopStart);
  console.log('6. Patched enemy loop start with Disruptor aura pre-pass!');
} else {
  console.log('Warning: oldEnemyLoopStart not found!');
}

// 5. ENEMY STEERING & BEHAVIOR: FLOCKING PINCER & ROLE AI
const oldEnemySteering = `    let goalX = player.x, goalY = player.y;
    if (en.type === 'shaman' && en.summoned) {
      goalX = en.x - dx; goalY = en.y - dy;
    } else if (en.type === 'shooter' && !(en.cover && en.cover.hp > 0)) {
      if (dist < 118) { goalX = en.x - dx; goalY = en.y - dy; }
    }
    const st = villagerStep(en, goalX, goalY);
    const spdH = spd * (st.flee ? 1.35 : 1);`;

const newEnemySteering = `    let goalX = player.x, goalY = player.y;

    // STEP 5: SWARM FLOCKING & ENCIRCLEMENT (Boids pincer behavior)
    const isMeleeMob = (en.type === 'swarmer' || en.type === 'walker' || en.type === 'fast' || en.type === 'slime' || en.type === 'bearer' || en.type === 'golem');
    if (isMeleeMob && dist > 50) {
      const flankDir = ((en.phase || 0) > Math.PI) ? 1 : -1;
      const flankAng = flankDir * 0.62; // ~35 deg tangential flanking pincer
      const baseAng = Math.atan2(player.y - en.y, player.x - en.x);
      const targetAng = baseAng + flankAng;
      const tDist = Math.max(16, dist - 18);
      goalX = en.x + Math.cos(targetAng) * tDist;
      goalY = en.y + Math.sin(targetAng) * tDist;
    }

    if (en.type === 'shaman' && en.summoned) {
      goalX = en.x - dx; goalY = en.y - dy;
    } else if (en.type === 'shooter' && !(en.cover && en.cover.hp > 0)) {
      if (dist < 118) { goalX = en.x - dx; goalY = en.y - dy; }
    } else if (en.type === 'marksman') {
      // Keskin Nişancı: 200-300px ideal menzilini korur, yaklaşırsa geri kaçar
      if (dist < 170) {
        goalX = en.x - dx; goalY = en.y - dy;
      } else if (dist > 290) {
        goalX = player.x; goalY = player.y;
      } else {
        // Yanlara strafe yapar
        const strafeDir = ((en.phase || 0) > Math.PI) ? 1 : -1;
        goalX = en.x + Math.cos(Math.atan2(dy, dx) + Math.PI / 2 * strafeDir) * 60;
        goalY = en.y + Math.sin(Math.atan2(dy, dx) + Math.PI / 2 * strafeDir) * 60;
      }
    } else if (en.type === 'disruptor') {
      // Bozucu: Orta mesafede (160-220px) havada süzülür
      if (dist < 140) {
        goalX = en.x - dx; goalY = en.y - dy;
      } else if (dist > 230) {
        goalX = player.x; goalY = player.y;
      }
    }

    const st = villagerStep(en, goalX, goalY);
    const speedAuraMul = en.hasDisruptorBuff ? 1.22 : 1.0;
    const spdH = spd * (st.flee ? 1.35 : 1) * speedAuraMul;

    // STEP 5: SHIELD BEARER FACING & BLOCK TIMER
    if (en.type === 'bearer') {
      en.facingAngle = Math.atan2(player.y - en.y, player.x - en.x);
      if (en.shieldBlocked > 0) en.shieldBlocked -= dt;
    }

    // STEP 5: MARKSMAN CHARGE & SNIPER BEAM
    if (en.type === 'marksman') {
      en.sniperTimer = (en.sniperTimer || 140) - dt;
      if (en.snipeAimT > 0) {
        // Hedefe kilitlenme: Oyuncuyu hafif gecikmeyle takip eder (dash ile kaçılabilir)
        en.aimX += (player.x - en.aimX) * 0.10;
        en.aimY += (player.y - en.aimY) * 0.10;
        en.snipeAimT -= dt;
        if (en.snipeAimT <= 0) {
          const sang = Math.atan2(en.aimY - en.y, en.aimX - en.x);
          enemyProjectiles.push({
            x: en.x, y: en.y,
            vx: Math.cos(sang) * 7.5, vy: Math.sin(sang) * 7.5,
            r: 5.5, dmg: 7 + Math.round(wave * 0.6),
            ox: en.x, oy: en.y, maxDist: 420,
            kind: 'marksman_beam', face: sang
          });
          playSfx('skill', 0.32, 180);
          shake = Math.max(shake, 3.2);
          burst(en.x, en.y, '#ef4444', 8, 2.8);
        }
      } else if (en.sniperTimer <= 0 && dist >= 90 && dist <= 380) {
        en.snipeAimT = 48; // ~0.8 sn kırmızı lazer uyarısı
        en.sniperTimer = 200 + Math.random() * 60;
        en.aimX = player.x;
        en.aimY = player.y;
        synthBlip('charge');
      }
    }

    // STEP 5: DISRUPTOR GRAV-WELL VORTEX SUMMON
    if (en.type === 'disruptor') {
      en.disruptTimer = (en.disruptTimer || 180) - dt;
      if (en.disruptTimer <= 0 && dist < 320) {
        en.disruptTimer = 300 + Math.random() * 80;
        hazards.push({
          x: player.x, y: player.y, r: 46,
          type: 'grav_well',
          until: performance.now() + 4000
        });
        burst(player.x, player.y, '#a855f7', 18, 3.4);
        spawnFloatText(en.x, en.y - 26, '🌌 Çekim Girdabı!', '#c084fc');
        playSfx('wave', 0.35, 280);
      }
    }`;

if (html.includes(oldEnemySteering)) {
  html = html.replace(oldEnemySteering, newEnemySteering);
  console.log('7. Patched enemy steering with Swarm Boids, Marksman snipe, and Disruptor grav-well!');
} else {
  console.log('Warning: oldEnemySteering not found!');
}

// 6. HAZARDS: GRAV-WELL INTERACTION & EXPIRATION CLEANUP
const oldHazardInteraction = `      if (h.type === 'ketchup') { player.vx *= 1.12; player.vy *= 1.12; if (Math.random() < 0.25) burst(player.x, player.y, '#e53935', 2, 1); }
      if (h.type === 'bramble') { player.vx *= 0.78; player.vy *= 0.78; if (Math.random() < 0.05 && player.invuln <= 0 && shieldOn <= 0) damagePlayer(1); }`;

const newHazardInteraction = `      if (h.type === 'ketchup') { player.vx *= 1.12; player.vy *= 1.12; if (Math.random() < 0.25) burst(player.x, player.y, '#e53935', 2, 1); }
      if (h.type === 'bramble') { player.vx *= 0.78; player.vy *= 0.78; if (Math.random() < 0.05 && player.invuln <= 0 && shieldOn <= 0) damagePlayer(1); }
      if (h.type === 'grav_well') {
        player.slowUntil = Math.max(player.slowUntil || 0, performance.now() + 300);
        player.vx *= 0.75; player.vy *= 0.75;
        const gdx = h.x - player.x, gdy = h.y - player.y;
        const gd = Math.hypot(gdx, gdy) || 1;
        tryMove(player, (gdx / gd) * 0.95 * dt, (gdy / gd) * 0.95 * dt);
        if (Math.random() < 0.2) burst(player.x, player.y, '#c084fc', 2, 1.2);
      }`;

if (html.includes(oldHazardInteraction)) {
  html = html.replace(oldHazardInteraction, newHazardInteraction);
  console.log('8. Patched grav_well interaction in hazards.forEach!');
} else {
  console.log('Warning: oldHazardInteraction not found!');
}

// Clean up expired hazards with h.until
const oldHazardCleanup = `  const nowMark = performance.now();
  for (let i = groundMarks.length - 1; i >= 0; i--) {
    if (groundMarks[i].until < nowMark) groundMarks.splice(i, 1);
  }`;

const newHazardCleanup = `  const nowMark = performance.now();
  for (let i = groundMarks.length - 1; i >= 0; i--) {
    if (groundMarks[i].until < nowMark) groundMarks.splice(i, 1);
  }
  for (let i = hazards.length - 1; i >= 0; i--) {
    if (hazards[i].until && hazards[i].until < nowMark) hazards.splice(i, 1);
  }`;

if (html.includes(oldHazardCleanup)) {
  html = html.replace(oldHazardCleanup, newHazardCleanup);
  console.log('9. Patched temporary hazard expiration cleanup!');
} else {
  console.log('Warning: oldHazardCleanup not found!');
}

// 7. DRAWING: DRAW BEARER SHIELD, MARKSMAN LASER, AND DISRUPTOR AURA
const oldDrawBiomeEnemyEnd = `  ctx.restore();
  return cy;
}

// 8. Hero Player (Chibi Elementalist Champion)`;

const newDrawBiomeEnemyEnd = `  // STEP 5: VISUAL DRAWING FOR SPECIAL ENEMY ROLES
  if (type === 'bearer') {
    // Kalkan Taşıyıcı: Yöne doğru kıvrılan neon enerji kalkanı
    const fa = en.facingAngle != null ? en.facingAngle : Math.atan2(player.y - en.y, player.x - en.x);
    ctx.save();
    ctx.strokeStyle = (en.shieldBlocked && en.shieldBlocked > 0) ? '#ffffff' : '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = (en.shieldBlocked && en.shieldBlocked > 0) ? 14 : 7;
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(en.x, cy, en.r + 5, fa - 0.95, fa + 0.95);
    ctx.stroke();
    // Inner shield glow line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(en.x, cy, en.r + 3.5, fa - 0.70, fa + 0.70);
    ctx.stroke();
    ctx.restore();
  } else if (type === 'marksman') {
    // Keskin Nişancı: Siber kırmızı hedefleme gözü
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 8;
    ctx.fillRect(Math.round(en.x - 3), Math.round(cy - 4), 6, 4);
    ctx.shadowBlur = 0;
    // Nişan alma aşamasında kırmızı lazer uyarısı
    if (en.snipeAimT > 0) {
      const aimP = en.snipeAimT / 48;
      ctx.strokeStyle = 'rgba(239, 68, 68, ' + (0.35 + Math.sin(time * 0.4) * 0.3) + ')';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(en.x, cy);
      ctx.lineTo(en.aimX, en.aimY);
      ctx.stroke();
      // Oyuncunun ayağında kırmızı hedef artı göstergesi
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([]);
      ctx.strokeRect(en.aimX - 7, en.aimY - 7, 14, 14);
      ctx.beginPath();
      ctx.moveTo(en.aimX - 10, en.aimY); ctx.lineTo(en.aimX + 10, en.aimY);
      ctx.moveTo(en.aimX, en.aimY - 10); ctx.lineTo(en.aimX, en.aimY + 10);
      ctx.stroke();
    }
    ctx.restore();
  } else if (type === 'disruptor') {
    // Bozucu: Mor kozmik rün aurası
    ctx.save();
    const aPulse = Math.sin(time * 0.18 + en.phase) * 0.15;
    ctx.strokeStyle = 'rgba(168, 85, 247, ' + (0.32 + aPulse) + ')';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(en.x, cy, 115, 0, Math.PI * 2);
    ctx.stroke();
    // Inner orbital rune motes
    for (let rk = 0; rk < 3; rk++) {
      const ma = time * 0.08 + (rk * Math.PI * 2 / 3);
      const mx = en.x + Math.cos(ma) * 38;
      const my = cy + Math.sin(ma) * 22;
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.round(mx - 2), Math.round(my - 2), 4, 4);
    }
    ctx.restore();
  }

  ctx.restore();
  return cy;
}

// 8. Hero Player (Chibi Elementalist Champion)`;

if (html.includes(oldDrawBiomeEnemyEnd)) {
  html = html.replace(oldDrawBiomeEnemyEnd, newDrawBiomeEnemyEnd);
  console.log('10. Patched drawBiomeEnemy with Shield Bearer, Marksman laser, and Disruptor aura visuals!');
} else {
  console.log('Warning: oldDrawBiomeEnemyEnd not found!');
}

// 8. DRAWING: DRAW GRAV-WELL IN HAZARDS
const oldDrawHazardsEnd = `      ctx.strokeStyle = '#ff3d00';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }`;

const newDrawHazardsEnd = `      ctx.strokeStyle = '#ff3d00';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    } else if (h.type === 'grav_well') {
      // ÇEKİM GİRDABI (GRAVITATIONAL WELL - STEP 5)
      ctx.fillStyle = 'rgba(88, 28, 135, 0.40)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kozmik girdap spirali
      const rot = time * 0.12;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 8;
      for (let arm = 0; arm < 3; arm++) {
        const sa = rot + (arm * Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.quadraticCurveTo(
          h.x + Math.cos(sa + 0.6) * (h.r * 0.7),
          h.y + Math.sin(sa + 0.6) * (h.r * 0.45),
          h.x + Math.cos(sa + 1.2) * h.r,
          h.y + Math.sin(sa + 1.2) * (h.r * 0.65)
        );
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // Core singularity
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }`;

if (html.includes(oldDrawHazardsEnd)) {
  html = html.replace(oldDrawHazardsEnd, newDrawHazardsEnd);
  console.log('11. Patched grav_well drawing in hazards render loop!');
} else {
  console.log('Warning: oldDrawHazardsEnd not found!');
}

// 9. DRAWENEMYSHOT: DRAW MARKSMAN_BEAM
const oldDrawEnemyShot = `  if (p.kind === 'icicle') {
    ctx.save();
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6;
    drawPixSprite(p.x, p.y, ang, SPR_ICICLE, ['#80deea', '#e0f7fa', '#ffffff']);
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }`;

const newDrawEnemyShot = `  if (p.kind === 'marksman_beam') {
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));
    ctx.rotate(ang);
    ctx.fillStyle = '#ff1744';
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 10;
    ctx.fillRect(-12, -2, 24, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -1, 16, 2);
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
  if (p.kind === 'icicle') {
    ctx.save();
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6;
    drawPixSprite(p.x, p.y, ang, SPR_ICICLE, ['#80deea', '#e0f7fa', '#ffffff']);
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }`;

if (html.includes(oldDrawEnemyShot)) {
  html = html.replace(oldDrawEnemyShot, newDrawEnemyShot);
  console.log('12. Patched marksman_beam in drawEnemyShot!');
} else {
  console.log('Warning: oldDrawEnemyShot not found!');
}

// 10. SPAWNWAVE: ADD MARKSMAN, BEARER, AND DISRUPTOR TO WAVE POOL
const oldSpawnWavePool = `    if (isBig) {
      const bigPool = ['tank', 'golem', 'behemoth', 'specter'];
      type = bigPool[(Math.random() * bigPool.length) | 0];
    } else {
      const smallPool = wave === 1
        ? ['swarmer', 'fast', 'slime']
        : wave <= 3
        ? ['swarmer', 'fast', 'shooter', 'slime']
        : ['swarmer', 'fast', 'shooter', 'exploder', 'slime', 'shaman'];
      type = smallPool[(Math.random() * smallPool.length) | 0];
    }`;

const newSpawnWavePool = `    if (isBig) {
      const bigPool = ['tank', 'golem', 'behemoth', 'specter', 'bearer', 'disruptor'];
      type = bigPool[(Math.random() * bigPool.length) | 0];
    } else {
      const smallPool = wave === 1
        ? ['swarmer', 'fast', 'slime']
        : wave <= 3
        ? ['swarmer', 'fast', 'shooter', 'slime', 'marksman']
        : ['swarmer', 'fast', 'shooter', 'exploder', 'slime', 'shaman', 'marksman', 'bearer', 'disruptor'];
      type = smallPool[(Math.random() * smallPool.length) | 0];
    }`;

if (html.includes(oldSpawnWavePool)) {
  html = html.replace(oldSpawnWavePool, newSpawnWavePool);
  console.log('13. Patched spawnWave pool with new tactical enemy roles!');
} else {
  console.log('Warning: oldSpawnWavePool not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 5 applied successfully!');
