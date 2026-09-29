const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. DEFINE PHASE 2 ARENA METAMORPHOSIS ENGINE & CATACLYSM
const phase2ArenaEngineCode = `// --- STEP 7: BOSS PHASE 2 ARENA METAMORPHOSIS & CATACLYSM ENGINE ---
window.arenaFissures = [];

function triggerPhase2ArenaMetamorphosis(boss, biome) {
  if (!boss) return;
  const bk = boss.bossType || (biome && biome.key) || 'stone';
  const cx = originX + MAP_W / 2;
  const cy = originY + MAP_H / 2;
  const arenaR = 270;

  // 1. Generate Glowing Arena Floor Fissure Cracks
  window.arenaFissures = [];
  const fissureCount = 12;
  const fCol = (bk === 'lava' || bk === 'stone') ? '#ff3d00' :
               bk === 'ice' ? '#00e5ff' :
               bk === 'storm' ? '#facc15' :
               bk === 'forest' ? '#22c55e' :
               bk === 'night' ? '#c084fc' : '#ff1744';

  for (let f = 0; f < fissureCount; f++) {
    const fAng = (f * Math.PI * 2 / fissureCount) + (Math.random() - 0.5) * 0.25;
    const fLen = 120 + Math.random() * 140;
    const pts = [{ x: cx, y: cy }];
    const segs = 4 + Math.floor(Math.random() * 3);
    let curX = cx, curY = cy;
    for (let s = 1; s <= segs; s++) {
      const segLen = fLen / segs;
      const jagAng = fAng + (Math.random() - 0.5) * 0.45;
      curX += Math.cos(jagAng) * segLen;
      curY += Math.sin(jagAng) * segLen;
      pts.push({ x: curX, y: curY });
    }
    window.arenaFissures.push({ pts, color: fCol, width: 2.2 + Math.random() * 1.5 });
  }

  // 2. Shrink Arena / Spawn Perimeter Hazard Death Ring
  const ringHazards = 8;
  const hType = (bk === 'lava' || bk === 'stone') ? 'lava' :
                bk === 'ice' ? 'ice' :
                bk === 'storm' ? 'water' :
                bk === 'forest' ? 'bramble' :
                bk === 'ketchup' ? 'ketchup' :
                bk === 'pink' ? 'caramel' : 'lava';

  for (let rIdx = 0; rIdx < ringHazards; rIdx++) {
    const rAng = (rIdx * Math.PI * 2 / ringHazards);
    const hx = cx + Math.cos(rAng) * arenaR;
    const hy = cy + Math.sin(rAng) * arenaR;
    hazards.push({
      x: hx, y: hy, r: 38,
      type: hType,
      until: performance.now() + 45000 // Lasts throughout Phase 2 battle!
    });
    burst(hx, hy, fCol, 14, 3.2);
  }

  showStreakBanner('⚡ 2. FAZ: ARENA ÇÖKÜŞÜ!', '#ff1744');
  spawnFloatText(boss.x, boss.y - 52, '🔥 ARENA METAMORFOZU!', '#ff1744', 'big');
  playSfx('explode', 0.55, 200);
}

function triggerPhase2Cataclysm(en, bk) {
  if (!player || player.hp <= 0) return;
  const col = (bk === 'lava' || bk === 'stone') ? '#ff3d00' :
              bk === 'ice' ? '#00e5ff' :
              bk === 'storm' ? '#facc15' :
              bk === 'forest' ? '#22c55e' :
              bk === 'night' ? '#c084fc' : '#ff1744';

  const count = 3;
  for (let k = 0; k < count; k++) {
    const strikeOffsetAng = Math.random() * Math.PI * 2;
    const strikeDist = 20 + Math.random() * 85;
    const sx = player.x + Math.cos(strikeOffsetAng) * strikeDist;
    const sy = player.y + Math.sin(strikeOffsetAng) * strikeDist;
    const delay = 38 + k * 12;

    bossTelegraphs.push({
      kind: 'circle',
      x: sx, y: sy, r: 36,
      duration: delay, t: 0,
      color: col,
      onTrigger: (bt) => {
        shake = Math.max(shake, 12);
        playSfx('explode', 0.35, 180);
        burst(bt.x, bt.y, col, 18, 3.8);
        burst(bt.x, bt.y, '#ffffff', 10, 2.4);

        if (bk === 'storm') {
          addBolt(bt.x, bt.y - 280, bt.x, bt.y, '#fef08a', 0.32, 3.5);
          synthBlip('elem_storm');
        } else if (bk === 'lava' || bk === 'stone') {
          synthBlip('elem_fire');
          hazards.push({ x: bt.x, y: bt.y, r: 24, type: 'lava', until: performance.now() + 3200 });
        } else if (bk === 'ice') {
          synthBlip('elem_water');
          hazards.push({ x: bt.x, y: bt.y, r: 28, type: 'ice', until: performance.now() + 4500 });
        }

        if (Math.hypot(player.x - bt.x, player.y - bt.y) < bt.r + player.r - 4) {
          damagePlayer(en.phase2 ? 14 : 10);
          player.vx += Math.cos(strikeOffsetAng) * 2.5;
          player.vy += Math.sin(strikeOffsetAng) * 2.5;
        }
      }
    });
  }
  playSfx('skill', 0.25, 220);
}
`;

const oldUpdateBossAiStart = `function updateBossAi(en, dt, player, biome, now) {
  const bk = en.bossType || (biome && biome.key) || 'stone';`;

const newUpdateBossAiStart = phase2ArenaEngineCode + `\nfunction updateBossAi(en, dt, player, biome, now) {
  const bk = en.bossType || (biome && biome.key) || 'stone';

  // STEP 7: PHASE 2 PERIODIC ARENA ENVIRONMENTAL CATACLYSM
  if (en.phase2 || en.raged || (en.hp / en.maxHp <= 0.5)) {
    en.phase2CataclysmTimer = (en.phase2CataclysmTimer || 180) - dt;
    if (en.phase2CataclysmTimer <= 0) {
      en.phase2CataclysmTimer = 220 + Math.random() * 60; // Every 3.5-4.5s
      triggerPhase2Cataclysm(en, bk);
    }
  }`;

if (html.includes(oldUpdateBossAiStart)) {
  html = html.replace(oldUpdateBossAiStart, newUpdateBossAiStart);
  console.log('1. Injected Phase 2 Arena Metamorphosis Engine and periodic cataclysm strikes!');
} else {
  console.log('Warning: oldUpdateBossAiStart not found!');
}

// 2. TRIGGER METAMORPHOSIS IN TAKEDAMAGE ON PHASE 2
const oldPhase2TakeDmg = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      en.phase2 = true;
      en.raged = true;
      en.speed *= 1.30;
      shake = Math.max(shake, 22);
      camKick = Math.max(camKick, 16);
      triggerHitStop(50);
      triggerScreenFlash('#ff1744', 0.45, 240);
      spawnFloatText(en.x, en.y - 48, '🔥 2. FAZ: ÖFKE!', '#ff1744', 'big');
      synthBlip('stagger_gong');
      synthBlip('phase2_cue');
      playSfx('explode', 0.45, 180);
      vibrate([40, 60, 40, 80]);`;

const newPhase2TakeDmg = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      en.phase2 = true;
      en.raged = true;
      en.speed *= 1.30;
      shake = Math.max(shake, 28);
      camKick = Math.max(camKick, 20);
      triggerHitStop(55);
      triggerScreenFlash('#ff1744', 0.55, 300);
      spawnFloatText(en.x, en.y - 48, '🔥 2. FAZ: ARENA ÇÖKÜŞÜ!', '#ff1744', 'big');
      synthBlip('stagger_gong');
      synthBlip('phase2_cue');
      playSfx('explode', 0.55, 180);
      vibrate([50, 80, 50, 100]);
      triggerPhase2ArenaMetamorphosis(en, currentBiome());`;

if (html.includes(oldPhase2TakeDmg)) {
  html = html.replace(oldPhase2TakeDmg, newPhase2TakeDmg);
  console.log('2. Patched takeDamage with triggerPhase2ArenaMetamorphosis!');
} else {
  console.log('Warning: oldPhase2TakeDmg not found!');
}

// 3. DRAW GLOWING FISSURES IN DRAWBOSSARENAFLOOR
const oldDrawBossArenaFloorStart = `  // 12 Battle Markers around perimeter
  const pRot = time * 0.004;
  for (let p = 0; p < 12; p++) {
    const ang = pRot + (p * Math.PI / 6);
    const px = cx + Math.cos(ang) * arenaR;
    const py = cy + Math.sin(ang) * arenaR;
    ctx.fillStyle = themeCol + (isRaged ? '55' : '33');
    ctx.fillRect(px - 2, py - 2, 4, 4);
    ctx.fillStyle = '#ffffff44';
    ctx.fillRect(px - 1, py - 1, 2, 2);
  }`;

const newDrawBossArenaFloorStart = `  // 12 Battle Markers around perimeter
  const pRot = time * 0.004;
  for (let p = 0; p < 12; p++) {
    const ang = pRot + (p * Math.PI / 6);
    const px = cx + Math.cos(ang) * arenaR;
    const py = cy + Math.sin(ang) * arenaR;
    ctx.fillStyle = themeCol + (isRaged ? '55' : '33');
    ctx.fillRect(px - 2, py - 2, 4, 4);
    ctx.fillStyle = '#ffffff44';
    ctx.fillRect(px - 1, py - 1, 2, 2);
  }

  // STEP 7: GLOWING JAGGED ARENA FISSURES (Phase 2 Cataclysm Ground Cracks)
  if (isRaged && window.arenaFissures && window.arenaFissures.length > 0) {
    ctx.save();
    const fPulse = 0.65 + Math.sin(time * 0.25) * 0.25;
    ctx.shadowColor = glowCol;
    ctx.shadowBlur = 12;
    for (let fi = 0; fi < window.arenaFissures.length; fi++) {
      const fiss = window.arenaFissures[fi];
      ctx.strokeStyle = fiss.color;
      ctx.globalAlpha = fPulse;
      ctx.lineWidth = fiss.width;
      ctx.beginPath();
      for (let pi = 0; pi < fiss.pts.length; pi++) {
        if (pi === 0) ctx.moveTo(fiss.pts[pi].x, fiss.pts[pi].y);
        else ctx.lineTo(fiss.pts[pi].x, fiss.pts[pi].y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }`;

if (html.includes(oldDrawBossArenaFloorStart)) {
  html = html.replace(oldDrawBossArenaFloorStart, newDrawBossArenaFloorStart);
  console.log('3. Patched drawBossArenaFloor with glowing jagged fissure cracks!');
} else {
  console.log('Warning: oldDrawBossArenaFloorStart not found!');
}

// 4. DRAW CATACLYSMIC RAGE VIGNETTE IN DRAWPARALLAXATMOSPHERE
const oldParallaxVig = `  // Layer 3: Multiply Vignette / Global Lighting Overlay
  const vig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.28, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.88);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.65, 'rgba(0, 0, 0, 0.18)');
  vig.addColorStop(1, 'rgba(3, 7, 18, 0.72)');
  ctx.fillStyle = vig;
  ctx.fillRect(cam.x - 40, cam.y - 40, W + 80, H + 80);

  ctx.restore();`;

const newParallaxVig = `  // Layer 3: Multiply Vignette / Global Lighting Overlay
  const vig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.28, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.88);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.65, 'rgba(0, 0, 0, 0.18)');
  vig.addColorStop(1, 'rgba(3, 7, 18, 0.72)');
  ctx.fillStyle = vig;
  ctx.fillRect(cam.x - 40, cam.y - 40, W + 80, H + 80);

  // STEP 7: PHASE 2 CATACLYSMIC RAGE VIGNETTE (Atmospheric red/elemental aura)
  const currentBoss = enemies && enemies.find(en => en.type === 'boss');
  if (currentBoss && (currentBoss.phase2 || currentBoss.raged || (currentBoss.hp / currentBoss.maxHp <= 0.5))) {
    const rageVig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.20, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.90);
    const pAlpha = 0.38 + Math.sin(time * 0.22) * 0.12;
    rageVig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rageVig.addColorStop(0.55, 'rgba(185, 28, 28, ' + (0.24 * pAlpha) + ')');
    rageVig.addColorStop(1, 'rgba(69, 10, 10, ' + (0.78 * pAlpha) + ')');
    ctx.fillStyle = rageVig;
    ctx.fillRect(cam.x - 40, cam.y - 40, W + 80, H + 80);
  }

  ctx.restore();`;

if (html.includes(oldParallaxVig)) {
  html = html.replace(oldParallaxVig, newParallaxVig);
  console.log('4. Patched drawParallaxAtmosphere with Phase 2 Cataclysmic Rage Vignette!');
} else {
  console.log('Warning: oldParallaxVig not found!');
}

// 5. RESET ARENA FISSURES ON RUN START / SPAWNWAVE
const oldResetGameFissures = `  bossTelegraphs = [];
  obstacles = []; hazards = []; drops = []; xpGems = []; bolts = []; crystals = [];`;

const newResetGameFissures = `  bossTelegraphs = [];
  window.arenaFissures = [];
  obstacles = []; hazards = []; drops = []; xpGems = []; bolts = []; crystals = [];`;

if (html.includes(oldResetGameFissures)) {
  html = html.replace(oldResetGameFissures, newResetGameFissures);
  console.log('5. Patched resetGame to clear arenaFissures!');
} else {
  console.log('Warning: oldResetGameFissures not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 7 applied successfully!');
