const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. DEFINE TRIGGERENVREACTION ENGINE
const envReactionEngineCode = `// --- STEP 6: ELEMENTAL ENVIRONMENTAL REACTION ENGINE ---
const envReactionLast = {};
function triggerEnvReaction(x, y, el, power) {
  if (!el || !hazards || hazards.length === 0) return;
  const now = performance.now();
  power = power || 20;

  for (let i = hazards.length - 1; i >= 0; i--) {
    const h = hazards[i];
    const dist = Math.hypot(h.x - x, h.y - y);
    if (dist > h.r + 34) continue;

    const rKey = (h.id || i) + '_' + el;
    if (envReactionLast[rKey] && now - envReactionLast[rKey] < 450) continue;
    envReactionLast[rKey] = now;

    // 1. STORM ON WATER PUDDLE -> ELECTRIFIED CONDUCTIVE PUDDLE
    if (h.type === 'water' && el === 'storm') {
      h.electrifiedUntil = now + 4200;
      synthBlip('elem_storm');
      playSfx('skill', 0.35, 180);
      shake = Math.max(shake, 6);
      burst(h.x, h.y, '#facc15', 24, 4.0);
      burst(h.x, h.y, '#38bdf8', 16, 3.0);
      spawnFloatText(h.x, h.y - 20, '⚡ İLETKEN SU HAVUZU!', '#fde047', 'crit');
      // Chain shock all enemies in puddle immediately
      enemies.forEach(en => {
        if (Math.hypot(en.x - h.x, en.y - h.y) < h.r + en.r + 18) {
          const dealtS = takeDamage(en, Math.round(28 + wave * 4), 'storm', { quiet: true });
          applyEffect(en, 'shock', 2.0);
          en.stunUntil = Math.max(en.stunUntil || 0, now + 1200);
          addBolt(h.x, h.y, en.x, en.y, '#fde047', 0.28, 2.8);
          spawnFloatText(en.x, en.y - 12, '⚡ -' + dealtS, '#facc15');
        }
      });
      pruneDeadEnemies();
    }

    // 2. FIRE ON WATER / ICE -> SCALDING STEAM CLOUD
    else if ((h.type === 'water' || h.type === 'ice') && el === 'fire') {
      const origR = h.r;
      h.r = Math.max(16, h.r * 0.7);
      if (h.r <= 18) {
        hazards.splice(i, 1);
      }
      zones.push({
        x: h.x, y: h.y, r: origR * 1.35,
        life: 3.5, maxLife: 3.5,
        tick: 0, tickMax: 18,
        dmg: Math.round(14 + wave * 2.2),
        el: 'fire',
        type: 'steam_cloud',
        effects: ['burn', 'slow']
      });
      synthBlip('elem_fire');
      playSfx('wave', 0.35, 200);
      burst(h.x, h.y, '#e0f2fe', 26, 4.2);
      burst(h.x, h.y, '#f8fafc', 18, 3.0);
      spawnFloatText(h.x, h.y - 20, '💨 BUHARLAŞMA İNFİLAKI!', '#e0f2fe', 'big');
      shake = Math.max(shake, 7);
    }

    // 3. ICE / FREEZE ON WATER -> SOLID ICE GLACIATION
    else if (h.type === 'water' && (el === 'water' || el === 'ice')) {
      h.type = 'ice';
      h.r = Math.min(85, h.r * 1.2);
      h.until = now + 7000;
      synthBlip('elem_water');
      playSfx('skill', 0.3, 150);
      burst(h.x, h.y, '#38bdf8', 20, 3.8);
      burst(h.x, h.y, '#ffffff', 14, 2.5);
      spawnFloatText(h.x, h.y - 20, '❄️ DONMUŞ BUZ PİSTİ!', '#38bdf8', 'crit');
      enemies.forEach(en => {
        if (Math.hypot(en.x - h.x, en.y - h.y) < h.r + en.r) {
          applyEffect(en, 'slow', 3.0);
          en.frozenOnIce = now + 4000;
        }
      });
    }

    // 4. FIRE ON BRAMBLE / FOREST / SLIME / CARAMEL -> WILDFIRE INFERNO
    else if ((h.type === 'bramble' || h.type === 'forest' || h.type === 'slime' || h.type === 'caramel') && el === 'fire') {
      h.type = 'lava';
      h.r = Math.min(80, h.r * 1.25);
      h.until = now + 5000;
      synthBlip('elem_fire');
      playSfx('explode', 0.38, 220);
      burst(h.x, h.y, '#ff4500', 25, 4.5);
      burst(h.x, h.y, '#ffea00', 16, 3.0);
      spawnFloatText(h.x, h.y - 20, '🔥 ÇEVRESEL ALEV SIÇRAMASI!', '#ff4500', 'crit');
      shake = Math.max(shake, 8);
      // Chain ignite nearby flammable hazards within 95px
      for (let j = hazards.length - 1; j >= 0; j--) {
        if (j === i) continue;
        const hj = hazards[j];
        if ((hj.type === 'bramble' || hj.type === 'slime') && Math.hypot(hj.x - h.x, hj.y - h.y) < 95) {
          hj.type = 'lava';
          hj.until = now + 4000;
          burst(hj.x, hj.y, '#ff5722', 14, 3.0);
        }
      }
    }

    // 5. EARTH ON LAVA -> OBSIDIAN ERUPTION
    else if (h.type === 'lava' && el === 'earth') {
      h.type = 'stone';
      h.until = now + 5000;
      synthBlip('elem_earth');
      playSfx('explode', 0.42, 250);
      shake = Math.max(shake, 11);
      burst(h.x, h.y, '#78716c', 28, 4.8);
      burst(h.x, h.y, '#f59e0b', 18, 3.6);
      spawnFloatText(h.x, h.y - 24, '🪨 OBSİDİYEN İNFİLAKI!', '#fbbf24', 'big');
      for (let j = enemies.length - 1; j >= 0; j--) {
        const en = enemies[j];
        if (Math.hypot(en.x - h.x, en.y - h.y) < h.r + en.r + 35) {
          const dealtOb = takeDamage(en, Math.round(35 + wave * 5), 'earth', { quiet: true });
          applyEffect(en, 'stun', 1.5);
          spawnFloatText(en.x, en.y - 12, '💥 -' + dealtOb, '#fbbf24');
        }
      }
      pruneDeadEnemies();
    }
  }
}
`;

const oldDamageEnemiesInRadius = `function damageEnemiesInRadius(x, y, r, dmg, effect, power, el) {
  el = el || lastElemUsed;
  for (let j=enemies.length-1;j>=0;j--) {
    const en = enemies[j];
    if (Math.hypot(en.x-x, en.y-y) <= r + en.r) {
      const dealt = takeDamage(en, dmg, el);
      spawnFloatText(en.x, en.y-10, '-'+dealt, '#f1c40f');
      applyAllEffects(en, effect, power||1);
    }
  }
  pruneDeadEnemies();
}`;

const newDamageEnemiesInRadius = envReactionEngineCode + `
function damageEnemiesInRadius(x, y, r, dmg, effect, power, el) {
  el = el || lastElemUsed;
  triggerEnvReaction(x, y, el, dmg);
  for (let j=enemies.length-1;j>=0;j--) {
    const en = enemies[j];
    if (Math.hypot(en.x-x, en.y-y) <= r + en.r) {
      const dealt = takeDamage(en, dmg, el);
      spawnFloatText(en.x, en.y-10, '-'+dealt, '#f1c40f');
      applyAllEffects(en, effect, power||1);
    }
  }
  pruneDeadEnemies();
}`;

if (html.includes(oldDamageEnemiesInRadius)) {
  html = html.replace(oldDamageEnemiesInRadius, newDamageEnemiesInRadius);
  console.log('1. Injected triggerEnvReaction and updated damageEnemiesInRadius!');
} else {
  console.log('Warning: oldDamageEnemiesInRadius not found!');
}

// 2. CALL TRIGGERENVREACTION IN TAKEDAMAGE & EMITREACTIONBURST
const oldTakeDamageEnd = `  if (!opt.quiet && !opt.noReact && el) {
    const rKey = (en.id || '') + '_' + el;`;

const newTakeDamageEnd = `  // Step 6: Environmental Hazard Reaction Trigger
  if (el) triggerEnvReaction(en.x, en.y, el, dealt);

  // Step 6: Glacial Shatter - +30% Shatter Damage on Ice!
  if (en.onIce) {
    dealt = Math.round(dealt * 1.30);
    spawnFloatText(en.x, en.y - 20, '❄️ KIRILMA! ' + dealt, '#38bdf8', 'crit');
    burst(en.x, en.y, '#38bdf8', 8, 2.5);
  }

  if (!opt.quiet && !opt.noReact && el) {
    const rKey = (en.id || '') + '_' + el;`;

if (html.includes(oldTakeDamageEnd)) {
  html = html.replace(oldTakeDamageEnd, newTakeDamageEnd);
  console.log('2. Patched takeDamage with triggerEnvReaction and Glacial Shatter!');
} else {
  console.log('Warning: oldTakeDamageEnd not found!');
}

const oldEmitReactionBurst = `function emitReactionBurst(en, label, color, r, dmg, effects, el) {
  // STEP 2: Elemental Fusion Shockwaves & Visual Synergies
  spawnFloatText(en.x, en.y - 28, '⚡ ' + label + ' ⚡', color, 'big');`;

const newEmitReactionBurst = `function emitReactionBurst(en, label, color, r, dmg, effects, el) {
  // STEP 6: Environmental Reaction Propagation
  if (el) triggerEnvReaction(en.x, en.y, el, dmg);
  // STEP 2: Elemental Fusion Shockwaves & Visual Synergies
  spawnFloatText(en.x, en.y - 28, '⚡ ' + label + ' ⚡', color, 'big');`;

if (html.includes(oldEmitReactionBurst)) {
  html = html.replace(oldEmitReactionBurst, newEmitReactionBurst);
  console.log('3. Patched emitReactionBurst with environmental propagation!');
} else {
  console.log('Warning: oldEmitReactionBurst not found!');
}

// 3. HAZARDS TICK IN UPDATE: ELECTRIFIED WATER SHOCK & ICE SLIPPING
const oldHazardTick = `  hazards.forEach(h => {
    enemies.forEach(en => {
      if (h.type === 'water' && Math.hypot(h.x-en.x, h.y-en.y) < h.r + en.r) {
        en.slowUntil = Math.max(en.slowUntil||0, performance.now() + 500);
        en.slowFactor = 0.5;
        en.wetUntil = Math.max(en.wetUntil||0, performance.now() + 500);
      }
    });`;

const newHazardTick = `  hazards.forEach(h => {
    const isElectrified = h.electrifiedUntil && performance.now() < h.electrifiedUntil;
    enemies.forEach(en => {
      const edist = Math.hypot(h.x - en.x, h.y - en.y);
      if (edist < h.r + en.r) {
        if (h.type === 'ice') {
          en.onIce = true;
          en.vx = (en.vx || 0) * 1.04;
          en.vy = (en.vy || 0) * 1.04;
        }
        if (h.type === 'water') {
          en.slowUntil = Math.max(en.slowUntil||0, performance.now() + 500);
          en.slowFactor = 0.5;
          en.wetUntil = Math.max(en.wetUntil||0, performance.now() + 1200);
          if (isElectrified && (time % 14 < 1)) {
            const ezap = takeDamage(en, Math.round(9 + wave * 1.2), 'storm', { quiet: true });
            spawnFloatText(en.x, en.y - 10, '⚡ -' + ezap, '#facc15', 'small');
            applyEffect(en, 'shock', 1.0);
            burst(en.x, en.y, '#fde047', 4, 1.8);
          }
        }
      }
    });`;

if (html.includes(oldHazardTick)) {
  html = html.replace(oldHazardTick, newHazardTick);
  console.log('4. Patched hazards.forEach tick with electrified water shock and ice slip!');
} else {
  console.log('Warning: oldHazardTick not found!');
}

// 4. DRAWING: ELECTRIFIED WATER CRACKLE & STEAM CLOUD
const oldDrawWaterHazard = `    } else if (h.type === 'water') {
      // GİRDAP ALAN EFEKTİ — PAFTA 4
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(time * 0.08);

      const wg = ctx.createRadialGradient(0, 0, 2, 0, 0, h.r);
      wg.addColorStop(0, '#01579b');
      wg.addColorStop(0.5, '#0288d1');
      wg.addColorStop(0.8, '#4fc3f7');
      wg.addColorStop(1, 'transparent');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.ellipse(0, 0, h.r, h.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();`;

const newDrawWaterHazard = `    } else if (h.type === 'water') {
      // GİRDAP ALAN EFEKTİ & İLETKEN ELEKTRİK (STEP 6)
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(time * 0.08);

      const isElectrified = h.electrifiedUntil && performance.now() < h.electrifiedUntil;
      const wg = ctx.createRadialGradient(0, 0, 2, 0, 0, h.r);
      if (isElectrified) {
        wg.addColorStop(0, '#fef08a');
        wg.addColorStop(0.4, '#0284c7');
        wg.addColorStop(0.8, '#38bdf8');
        wg.addColorStop(1, 'transparent');
      } else {
        wg.addColorStop(0, '#01579b');
        wg.addColorStop(0.5, '#0288d1');
        wg.addColorStop(0.8, '#4fc3f7');
        wg.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.ellipse(0, 0, h.r, h.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // İletken havuz elektrik kıvılcımları
      if (isElectrified) {
        ctx.strokeStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2.4;
        for (let a = 0; a < 3; a++) {
          const lAng = (a * Math.PI * 2 / 3) + Math.sin(time * 0.4 + a) * 0.4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(lAng) * (h.r * 0.45) + (Math.random()-0.5)*8, Math.sin(lAng) * (h.r * 0.3) + (Math.random()-0.5)*8);
          ctx.lineTo(Math.cos(lAng) * (h.r * 0.85), Math.sin(lAng) * (h.r * 0.52));
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }`;

if (html.includes(oldDrawWaterHazard)) {
  html = html.replace(oldDrawWaterHazard, newDrawWaterHazard);
  console.log('5. Patched water hazard drawing with electrified lightning arcs!');
} else {
  console.log('Warning: oldDrawWaterHazard not found!');
}

// 5. DRAWING: STEAM CLOUD IN ZONES.FOREACH
const oldDrawZonesThorn = `  zones.forEach(z => {
    if (z.type === 'thorn') {`;

const newDrawZonesThorn = `  zones.forEach(z => {
    if (z.type === 'steam_cloud') {
      // ─── BUHAR BULUTU (SCALDING STEAM CLOUD - STEP 6) ───
      ctx.save();
      const pAlpha = Math.min(1.0, z.life / (z.maxLife || 3.5));
      const sGrad = ctx.createRadialGradient(z.x, z.y, 4, z.x, z.y, z.r);
      sGrad.addColorStop(0, 'rgba(241, 245, 249, ' + (0.55 * pAlpha) + ')');
      sGrad.addColorStop(0.6, 'rgba(186, 230, 253, ' + (0.35 * pAlpha) + ')');
      sGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
      ctx.fill();
      for (let sp = 0; sp < 4; sp++) {
        const pa = time * 0.08 + (sp * Math.PI / 2);
        const px = z.x + Math.cos(pa) * (z.r * 0.45);
        const py = z.y + Math.sin(pa) * (z.r * 0.45);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.28 * pAlpha) + ')';
        ctx.beginPath();
        ctx.arc(px, py, z.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (z.type === 'thorn') {`;

if (html.includes(oldDrawZonesThorn)) {
  html = html.replace(oldDrawZonesThorn, newDrawZonesThorn);
  console.log('6. Patched steam_cloud drawing in zones.forEach!');
} else {
  console.log('Warning: oldDrawZonesThorn not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 6 applied successfully!');
