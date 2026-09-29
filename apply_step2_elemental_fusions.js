const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. REFACTOR emitReactionBurst TO ADVANCED FUSION DETONATION ENGINE
// -------------------------------------------------------------
const oldEmitReactionBurst = `function emitReactionBurst(en, label, color, r, dmg, effects, el) {
  spawnFloatText(en.x, en.y - 22, label, color, 'big');
  particles.push({ x: en.x, y: en.y, r: 12, maxR: r + 12, life: 1.2, color: color, lw: 4.5 });
  burst(en.x, en.y, color, 18, 3.8);
  burst(en.x, en.y, '#ffffff', 10, 2.6);
  triggerHitStop(32);
  for (let j = enemies.length - 1; j >= 0; j--) {
    const o = enemies[j];
    if (Math.hypot(o.x - en.x, o.y - en.y) <= r + o.r) {
      takeDamage(o, dmg, el, { noReact: true });
      if (effects) applyAllEffects(o, effects, 0.7);
    }
  }
  pruneDeadEnemies();
  playSfx('explode', 0.28, 440);
  vibrate([18, 24]);
  shake = Math.max(shake, 7.5);
}`;

const newEmitReactionBurst = `function emitReactionBurst(en, label, color, r, dmg, effects, el) {
  // STEP 2: Elemental Fusion Shockwaves & Visual Synergies
  spawnFloatText(en.x, en.y - 28, '⚡ ' + label + ' ⚡', color, 'big');

  // Expanding Multi-Layer Plasma Shockwave Ring
  particles.push({
    x: en.x, y: en.y,
    r: 14, maxR: r * 1.45,
    life: 0.65, maxLife: 0.65,
    color: color,
    type: 'fusion_ring',
    lw: 7.0
  });

  // Secondary Radiant Impact Starburst
  particles.push({
    x: en.x, y: en.y,
    life: 0.85, maxLife: 0.85,
    type: 'starburst',
    r: Math.round(r * 0.75),
    rot: Math.random() * Math.PI * 2
  });

  // Radial Sparks & Elemental Shrapnel
  burst(en.x, en.y, color, 24, 4.5);
  burst(en.x, en.y, '#ffffff', 14, 3.2);

  // Micro-Freeze Hit Stop & Juicy Camera Impact
  triggerHitStop(6);
  triggerScreenFlash(color, 0.34, 130);
  shake = Math.max(shake, 14);
  camKick = Math.max(camKick, 9);
  vibrate([35, 55, 35]);
  playSfx('explode', 0.44, 330);

  // Radial Physical Knockback & Area Damage
  const blastRadius = r * 1.35;
  for (let j = enemies.length - 1; j >= 0; j--) {
    const o = enemies[j];
    const dist = Math.hypot(o.x - en.x, o.y - en.y);
    if (dist <= blastRadius + o.r) {
      takeDamage(o, dmg, el, { noReact: true });
      if (effects) applyAllEffects(o, effects, 0.7);

      // Radial knockback sending mobs flying away from the explosion
      if (o.type !== 'boss' && dist > 1) {
        const kAng = Math.atan2(o.y - en.y, o.x - en.x);
        const kForce = 9.5 * (1 - dist / blastRadius);
        o.vx = Math.cos(kAng) * Math.max(Math.abs(o.vx || 0), kForce);
        o.vy = Math.sin(kAng) * Math.max(Math.abs(o.vy || 0), kForce);
        o.staggerTimer = 0.22;
      }
    }
  }
  pruneDeadEnemies();
}`;

if (html.includes(oldEmitReactionBurst)) {
  html = html.replace(oldEmitReactionBurst, newEmitReactionBurst);
  changes++;
  console.log('[1] Replaced emitReactionBurst with Advanced Fusion Engine');
} else {
  console.warn('[1] Warning: oldEmitReactionBurst not found');
}

// -------------------------------------------------------------
// 2. EXPAND reactionResolver WITH COMPREHENSIVE ELEMENTAL FUSIONS
// -------------------------------------------------------------
const oldReactionResolverResolve = `    if (en.type !== 'boss' && burn && shock && (!en.reactPlasmaAt || now - en.reactPlasmaAt > 1400)) {
      en.reactPlasmaAt = now;
      emitReactionBurst(en, 'PLAZMA ARKI', '#f59e0b', 75, 12, ['shock'], 'storm');
    }`;

const newReactionResolverResolve = `    if (en.type !== 'boss' && burn && shock && (!en.reactPlasmaAt || now - en.reactPlasmaAt > 1400)) {
      en.reactPlasmaAt = now;
      emitReactionBurst(en, 'PLAZMA İNFİLAKI', '#f59e0b', 85, Math.max(16, Math.round(dealt * 1.1)), ['shock'], 'storm');
      chainLightning(en, Math.max(14, Math.round(dealt * 0.75)), 5, 200, '#f59e0b', 'shock');
    }

    // Magma Fissure: Burn + Earth
    if (burn && incomingEl === 'earth' && (!en.reactMagmaAt || now - en.reactMagmaAt > 1400)) {
      en.reactMagmaAt = now;
      noteFx('steam');
      emitReactionBurst(en, 'MAGMA DEPREMİ', '#ef4444', 80, Math.max(18, Math.round(dealt * 1.25)), ['burn', 'stun'], 'fire');
      spawnElemStain(en.x, en.y, 75, 'fire', 220);
    }

    // Shatter Frost: Wet/Slow + Earth
    if ((wet || (en.slowFactor && en.slowFactor < 0.7)) && incomingEl === 'earth' && (!en.reactShatterAt || now - en.reactShatterAt > 1500)) {
      en.reactShatterAt = now;
      emitReactionBurst(en, 'KRİSTAL KIRILMA', '#38bdf8', 75, Math.max(20, Math.round(dealt * 1.4)), ['slow'], 'water');
      // Flying ice shrapnel
      for (let s = 0; s < 8; s++) {
        const sAng = s * (Math.PI * 2 / 8) + (Math.random() - 0.5) * 0.3;
        sparks.push({
          x: en.x, y: en.y,
          vx: Math.cos(sAng) * (4 + Math.random() * 3),
          vy: Math.sin(sAng) * (4 + Math.random() * 3),
          r: 2.2, life: 0.35, maxLife: 0.35, color: '#e0f2fe', rot: 0, vr: 0
        });
      }
    }`;

if (html.includes(oldReactionResolverResolve)) {
  html = html.replace(oldReactionResolverResolve, newReactionResolverResolve);
  changes++;
  console.log('[2] Expanded reactionResolver with Magma Fissure and Shatter Frost synergies');
} else {
  console.warn('[2] Warning: oldReactionResolverResolve not found');
}

// -------------------------------------------------------------
// 3. RENDER pt.type === 'fusion_ring' IN PARTICLES DRAW LOOP
// -------------------------------------------------------------
const oldParticleRender = `    if (pt.type === 'starburst' || pt.type === 'impact') {
      drawPixelImpactBurst(pt.x, pt.y, (pt.r || 16) / 16, pt.rot || 0, a);
      return;
    }`;

const newParticleRender = `    if (pt.type === 'starburst' || pt.type === 'impact') {
      drawPixelImpactBurst(pt.x, pt.y, (pt.r || 16) / 16, pt.rot || 0, a);
      return;
    }
    if (pt.type === 'fusion_ring') {
      const prog = 1 - Math.max(0, pt.life / (pt.maxLife || 1));
      const curR = (pt.r || 10) + ((pt.maxR || 85) - (pt.r || 10)) * prog;
      ctx.save();
      // Outer colored neon shockwave
      ctx.globalAlpha = a * 0.88;
      ctx.shadowColor = pt.color || '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = pt.color || '#38bdf8';
      ctx.lineWidth = Math.max(2.0, (pt.lw || 6) * (1 - prog * 0.55));
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, curR, 0, Math.PI * 2);
      ctx.stroke();

      // Inner intense core white laser shockwave ring
      ctx.shadowBlur = 0;
      ctx.globalAlpha = a * 0.95;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1.2, (pt.lw || 6) * 0.35 * (1 - prog * 0.5));
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1, curR - 2.5), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }`;

if (html.includes(oldParticleRender)) {
  html = html.replace(oldParticleRender, newParticleRender);
  changes++;
  console.log('[3] Added multi-layer plasma shockwave rendering in particle loop');
} else {
  console.warn('[3] Warning: oldParticleRender not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 2 apply script. Total successful patches: ${changes}/3`);
