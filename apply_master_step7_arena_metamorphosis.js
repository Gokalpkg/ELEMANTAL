const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. DEFINE MASTER PHASE 2 TRANSITION AND ARENA METAMORPHOSIS ENGINE
const oldPhase2Engine = `// --- STEP 7: BOSS PHASE 2 ARENA METAMORPHOSIS & CATACLYSM ENGINE ---
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
}`;

const newPhase2Engine = `// --- STEP 7: MASTER BOSS PHASE 2 ARENA METAMORPHOSIS & CATACLYSM ENGINE ---
window.arenaFissures = [];

function triggerBossPhase2Transition(boss, biome) {
  if (!boss || boss.phase2) return;
  boss.phase2 = true;
  boss.raged = true;
  boss.speed *= 1.30;
  boss.specialCd = 24; // Immediate aggressive follow-up attack

  const bk = boss.bossType || (biome && biome.key) || 'stone';
  const fCol = (bk === 'lava' || bk === 'stone') ? '#ff3d00' :
               bk === 'ice' ? '#00e5ff' :
               bk === 'storm' ? '#facc15' :
               bk === 'forest' ? '#22c55e' :
               bk === 'sand' ? '#ffd700' :
               bk === 'water' ? '#00b0ff' :
               bk === 'pink' ? '#ff4081' :
               bk === 'night' ? '#c084fc' : '#ff1744';

  // 1. Cinematic Screen & Audio Crunch
  shake = Math.max(shake, 32);
  camKick = Math.max(camKick, 22);
  triggerHitStop(8); // Crisp 8-frame punchy micro-crunch
  triggerScreenFlash(fCol, 0.55, 300);
  vibrate([60, 90, 60, 110]);
  playSfx('explode', 0.55, 180);
  if (typeof synthBlip === 'function') {
    synthBlip('phase2_cue');
    synthBlip('stagger_gong');
  }

  // 2. High-Impact Visual Banner & Floating Text
  const bTitle = boss.title || 'DİYAR LORDU';
  showStreakBanner('⚡ 2. FAZ: ' + bTitle.toUpperCase() + ' GAZABI! ⚡', fCol);
  spawnFloatText(boss.x, boss.y - 56, '🔥 ARENA METAMORFOZU!', fCol, 'big');

  // 3. Guaranteed Arena Metamorphosis
  triggerPhase2ArenaMetamorphosis(boss, biome);

  // 4. Elite Minion Escort
  if (typeof spawnAroundPlayer === 'function') {
    makeEnemy(spawnAroundPlayer(160, 220), 'golem', { isElite: true, titleCol: fCol });
  }
}

function triggerPhase2ArenaMetamorphosis(boss, biome) {
  if (!boss) return;
  const bk = boss.bossType || (biome && biome.key) || 'stone';
  // DYNAMIC ARENA CENTER: Anchored directly around the boss fight, NEVER offscreen!
  const cx = boss.arenaCx || boss.x;
  const cy = boss.arenaCy || boss.y;
  const arenaR = 300;

  // 1. Glowing Jagged Floor Fissures Directly Radiating Beneath the Boss
  window.arenaFissures = [];
  const fissureCount = 16;
  const fCol = (bk === 'lava' || bk === 'stone') ? '#ff3d00' :
               bk === 'ice' ? '#00e5ff' :
               bk === 'storm' ? '#facc15' :
               bk === 'forest' ? '#22c55e' :
               bk === 'sand' ? '#ffd700' :
               bk === 'water' ? '#00b0ff' :
               bk === 'pink' ? '#ff4081' :
               bk === 'night' ? '#c084fc' : '#ff1744';

  for (let f = 0; f < fissureCount; f++) {
    const fAng = (f * Math.PI * 2 / fissureCount) + (Math.random() - 0.5) * 0.3;
    const fLen = 140 + Math.random() * 160;
    const pts = [{ x: cx, y: cy }];
    const segs = 5;
    let curX = cx, curY = cy;
    for (let s = 1; s <= segs; s++) {
      const segLen = fLen / segs;
      const jagAng = fAng + (Math.random() - 0.5) * 0.48;
      curX += Math.cos(jagAng) * segLen;
      curY += Math.sin(jagAng) * segLen;
      pts.push({ x: curX, y: curY });
    }
    window.arenaFissures.push({ pts, color: fCol, width: 2.6 + Math.random() * 1.5 });
  }

  // 2. Shrinking Arena Perimeter Hazard Death Ring (16 visible danger hazards enclosing the fight)
  const ringHazards = 16;
  const hType = (bk === 'lava' || bk === 'stone') ? 'lava' :
                bk === 'ice' ? 'ice' :
                bk === 'storm' ? 'water' :
                bk === 'forest' ? 'bramble' :
                bk === 'sand' ? 'sand' :
                bk === 'ketchup' ? 'ketchup' :
                bk === 'pink' ? 'caramel' :
                bk === 'night' ? 'grav_well' : 'lava';

  for (let rIdx = 0; rIdx < ringHazards; rIdx++) {
    const rAng = (rIdx * Math.PI * 2 / ringHazards);
    const hx = cx + Math.cos(rAng) * arenaR;
    const hy = cy + Math.sin(rAng) * arenaR;
    hazards.push({
      x: hx, y: hy, r: 42,
      type: hType,
      isArenaRing: true,
      until: performance.now() + 60000 // Lasts throughout Phase 2 battle!
    });
    burst(hx, hy, fCol, 12, 3.0);
  }

  // 3. Biome-Specific Signature Arena Cataclysm Hazards
  if (bk === 'stone') {
    // Falling Earthquake Boulders
    for (let k = 0; k < 4; k++) {
      const bAng = k * (Math.PI / 2) + 0.3;
      const bx = cx + Math.cos(bAng) * 140;
      const by = cy + Math.sin(bAng) * 140;
      bossTelegraphs.push({
        kind: 'reticle', x: bx, y: by, r: 48, duration: 45, t: 0, color: '#8d6e63',
        onTrigger: (bt) => {
          burst(bt.x, bt.y, '#8d6e63', 20, 3.8);
          burst(bt.x, bt.y, '#ffd700', 10, 2.2);
          shake = Math.max(shake, 14);
          playSfx('explode', 0.35, 160);
          if (Math.hypot(player.x - bt.x, player.y - bt.y) < bt.r + player.r) damagePlayer(14);
        }
      });
    }
  } else if (bk === 'lava') {
    // Erupting Magma Geysers
    for (let k = 0; k < 4; k++) {
      const ga = k * (Math.PI / 2);
      const gx = cx + Math.cos(ga) * 125;
      const gy = cy + Math.sin(ga) * 125;
      hazards.push({ x: gx, y: gy, r: 36, type: 'lava', until: performance.now() + 20000 });
      burst(gx, gy, '#ff3d00', 14, 3.0);
    }
  } else if (bk === 'water') {
    // 4 Swirling Maelstrom Whirlpools
    for (let k = 0; k < 4; k++) {
      const wa = k * (Math.PI / 2) + 0.4;
      const wx = cx + Math.cos(wa) * 135;
      const wy = cy + Math.sin(wa) * 135;
      hazards.push({ x: wx, y: wy, r: 40, type: 'water', until: performance.now() + 25000 });
      burst(wx, wy, '#00b0ff', 12, 2.8);
    }
  } else if (bk === 'forest') {
    // Thorny Bramble Cross
    for (let k = -2; k <= 2; k++) {
      if (k === 0) continue;
      hazards.push({ x: cx + k * 65, y: cy, r: 28, type: 'bramble', until: performance.now() + 22000 });
      hazards.push({ x: cx, y: cy + k * 65, r: 28, type: 'bramble', until: performance.now() + 22000 });
    }
  } else if (bk === 'ice') {
    // Flash-Frozen Ice Arena
    for (let k = 0; k < 5; k++) {
      const ix = cx + (Math.random() - 0.5) * 230;
      const iy = cy + (Math.random() - 0.5) * 230;
      hazards.push({ x: ix, y: iy, r: 40, type: 'ice', until: performance.now() + 25000 });
      burst(ix, iy, '#00e5ff', 10, 2.5);
    }
  } else if (bk === 'storm') {
    // Overloaded Lightning Strikes
    for (let k = 0; k < 4; k++) {
      const sa = k * (Math.PI / 2) + 0.35;
      const sx = cx + Math.cos(sa) * 150;
      const sy = cy + Math.sin(sa) * 150;
      if (typeof addBolt === 'function') addBolt(sx, sy - 240, sx, sy, '#facc15', 0.5, 4.0);
      burst(sx, sy, '#facc15', 14, 3.2);
    }
  } else if (bk === 'sand') {
    // Quicksand Sinking Pools
    for (let k = 0; k < 4; k++) {
      const sa = k * (Math.PI / 2) + 0.5;
      const sx = cx + Math.cos(sa) * 135;
      const sy = cy + Math.sin(sa) * 135;
      hazards.push({ x: sx, y: sy, r: 38, type: 'sand', until: performance.now() + 22000 });
      burst(sx, sy, '#ffd700', 10, 2.4);
    }
  } else if (bk === 'night') {
    // Cosmic Void Gravity Wells
    for (let k = 0; k < 3; k++) {
      const na = k * (Math.PI * 2 / 3);
      const nx = cx + Math.cos(na) * 130;
      const ny = cy + Math.sin(na) * 130;
      hazards.push({ x: nx, y: ny, r: 40, type: 'grav_well', until: performance.now() + 22000 });
      burst(nx, ny, '#c084fc', 14, 3.2);
    }
  } else if (bk === 'pink') {
    // Sticky Caramel Zones
    for (let k = 0; k < 4; k++) {
      const pa = k * (Math.PI / 2);
      const px = cx + Math.cos(pa) * 130;
      const py = cy + Math.sin(pa) * 130;
      hazards.push({ x: px, y: py, r: 38, type: 'caramel', until: performance.now() + 22000 });
      burst(px, py, '#ff4081', 12, 2.5);
    }
  } else if (bk === 'ketchup') {
    // Boiling Condiment Geysers
    for (let k = 0; k < 4; k++) {
      const ka = k * (Math.PI / 2) + 0.25;
      const kx = cx + Math.cos(ka) * 130;
      const ky = cy + Math.sin(ka) * 130;
      hazards.push({ x: kx, y: ky, r: 38, type: 'ketchup', until: performance.now() + 22000 });
      burst(kx, ky, '#ff1744', 12, 2.5);
    }
  }
}

function triggerPhase2Cataclysm(en, bk) {
  if (!player || player.hp <= 0) return;
  const col = (bk === 'lava' || bk === 'stone') ? '#ff3d00' :
              bk === 'ice' ? '#00e5ff' :
              bk === 'storm' ? '#facc15' :
              bk === 'forest' ? '#22c55e' :
              bk === 'sand' ? '#ffd700' :
              bk === 'water' ? '#00b0ff' :
              bk === 'pink' ? '#ff4081' :
              bk === 'night' ? '#c084fc' : '#ff1744';

  const count = 3;
  for (let k = 0; k < count; k++) {
    const strikeOffsetAng = Math.random() * Math.PI * 2;
    const strikeDist = 20 + Math.random() * 85;
    const sx = player.x + Math.cos(strikeOffsetAng) * strikeDist;
    const sy = player.y + Math.sin(strikeOffsetAng) * strikeDist;
    const delay = 36 + k * 10;

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
          if (typeof addBolt === 'function') addBolt(bt.x, bt.y - 280, bt.x, bt.y, '#fef08a', 0.32, 3.5);
          if (typeof synthBlip === 'function') synthBlip('elem_storm');
        } else if (bk === 'lava' || bk === 'stone') {
          if (typeof synthBlip === 'function') synthBlip('elem_fire');
          hazards.push({ x: bt.x, y: bt.y, r: 24, type: 'lava', until: performance.now() + 3200 });
        } else if (bk === 'ice') {
          if (typeof synthBlip === 'function') synthBlip('elem_water');
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
}`;

if (html.includes(oldPhase2Engine)) {
  html = html.replace(oldPhase2Engine, newPhase2Engine);
  console.log('1. Injected Master Phase 2 Transition and Arena Metamorphosis Engine!');
} else {
  console.error('Warning: oldPhase2Engine not found!');
}

// 2. UNIFY PHASE 2 TRIGGER IN UPDATEBOSSAI
const oldUpdateBossPhase2 = `  // 1. Phase 2 / Ara Form Transition Check
  const layersGone = !en.layers || en.layers.length === 0;
  if (!en.phase2 && (layersGone || en.hp < en.maxHp * 0.5)) {
    en.phase2 = true;
    en.raged = true;
    en.speed *= 1.35;
    triggerHitStop(55);
    shake = Math.max(shake, 18);
    vibrate([45, 60, 45, 75]);
    triggerScreenFlash('#ffd740', 0.4, 150);
    playSfx('wave', 0.38);
    burst(en.x, en.y, '#ffd740', 36, 5.2);
    burst(en.x, en.y, '#ffffff', 22, 4.2);
    particles.push({ x: en.x, y: en.y, r: 12, maxR: 140, life: 1.3, color: '#ffd740', lw: 6 });
    particles.push({ x: en.x, y: en.y, r: 6, maxR: 90, life: 1.0, color: '#ffffff', lw: 3 });
    const pTitle = en.phaseTitle || 'ARA FORM: ÖFKE';
    spawnFloatText(en.x, en.y - 48, '⚡ ' + pTitle + ' ⚡', '#ffd740', 'big');
  }`;

const newUpdateBossPhase2 = `  // 1. Guaranteed Master Phase 2 Transition Check
  const layersGone = !en.layers || en.layers.length === 0;
  if (!en.phase2 && (layersGone || en.hp <= en.maxHp * 0.5)) {
    triggerBossPhase2Transition(en, biome);
  }`;

if (html.includes(oldUpdateBossPhase2)) {
  html = html.replace(oldUpdateBossPhase2, newUpdateBossPhase2);
  console.log('2. Patched updateBossAi with triggerBossPhase2Transition!');
} else {
  console.error('Warning: oldUpdateBossPhase2 not found!');
}

// 3. UNIFY PHASE 2 TRIGGER IN TAKEDAMAGE
const oldTakeDmgPhase2 = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
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
      triggerPhase2ArenaMetamorphosis(en, currentBiome());
      if (typeof spawnAroundPlayer === 'function') {
        makeEnemy(spawnAroundPlayer(160, 220), 'golem', { isElite: true, titleCol: '#ffd700' });
        makeEnemy(spawnAroundPlayer(160, 220), 'golem');
      }
    }`;

const newTakeDmgPhase2 = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      triggerBossPhase2Transition(en, currentBiome());
    }`;

if (html.includes(oldTakeDmgPhase2)) {
  html = html.replace(oldTakeDmgPhase2, newTakeDmgPhase2);
  console.log('3. Patched takeDamage with triggerBossPhase2Transition!');
} else {
  console.error('Warning: oldTakeDmgPhase2 not found!');
}

// 4. FIX ARENA CENTER IN DRAWBOSSARENAFLOOR
const oldDrawArenaFloorStart = `function drawBossArenaFloor(ctx, cam, biome, boss, time) {
  if (!boss) return;
  const bk = boss.bossType || (biome && biome.key) || 'stone';
  const theme = BOSS_THEMES[bk] || BOSS_THEMES.stone;
  const isRaged = boss.raged || (boss.hp < boss.maxHp * 0.5) || boss.phase2;
  const themeCol = isRaged ? '#ff1744' : theme.main;
  const glowCol = isRaged ? '#ff5252' : theme.glow;
  const bx = boss.x;
  const by = boss.y;

  // 1. Grand Ancient Arena Floor Mandala at Map Center
  const cx = originX + MAP_W / 2;
  const cy = originY + MAP_H / 2;
  const arenaR = 280;`;

const newDrawArenaFloorStart = `function drawBossArenaFloor(ctx, cam, biome, boss, time) {
  if (!boss) return;
  const bk = boss.bossType || (biome && biome.key) || 'stone';
  const theme = BOSS_THEMES[bk] || BOSS_THEMES.stone;
  const isRaged = boss.raged || (boss.hp < boss.maxHp * 0.5) || boss.phase2;
  const themeCol = isRaged ? '#ff1744' : theme.main;
  const glowCol = isRaged ? '#ff5252' : theme.glow;
  const bx = boss.x;
  const by = boss.y;

  // DYNAMIC ARENA FLOOR MANDALA: Rendered right around the boss fight, completely visible!
  const cx = boss.arenaCx || boss.x;
  const cy = boss.arenaCy || boss.y;
  const arenaR = 300;`;

if (html.includes(oldDrawArenaFloorStart)) {
  html = html.replace(oldDrawArenaFloorStart, newDrawArenaFloorStart);
  console.log('4. Patched drawBossArenaFloor to use dynamic boss arena coordinates!');
} else {
  console.error('Warning: oldDrawArenaFloorStart not found!');
}

// 5. ANCHOR ARENA CENTER WHEN BOSS IS SPAWNED IN SPAWNWAVE
const oldSpawnBoss = `    makeEnemy(placeAway(), 'boss', {
      speed: 1.55 + wave * 0.018, shootTimer: 48, raged:false, ring:0,
      hp: bossBaseHp, maxHp: bossBaseHp, r: cfg.r, slamCd: 70,
      title: cfg.title, phaseTitle: cfg.phaseTitle, bossType: cfg.bossType,
      layers: cfg.layers,
      peelFx: 0,
      specialCd: 52,
      dashT: 0, dashVx: 0, dashVy: 0,
      burrowT: 0,
      phase2: false
    });`;

const newSpawnBoss = `    const bBoss = makeEnemy(placeAway(), 'boss', {
      speed: 1.55 + wave * 0.018, shootTimer: 48, raged:false, ring:0,
      hp: bossBaseHp, maxHp: bossBaseHp, r: cfg.r, slamCd: 70,
      title: cfg.title, phaseTitle: cfg.phaseTitle, bossType: cfg.bossType,
      layers: cfg.layers,
      peelFx: 0,
      specialCd: 52,
      dashT: 0, dashVx: 0, dashVy: 0,
      burrowT: 0,
      phase2: false
    });
    if (bBoss) {
      bBoss.arenaCx = bBoss.x;
      bBoss.arenaCy = bBoss.y;
    }`;

if (html.includes(oldSpawnBoss)) {
  html = html.replace(oldSpawnBoss, newSpawnBoss);
  console.log('5. Anchored arenaCx/arenaCy when boss spawns in spawnWave!');
} else {
  console.error('Warning: oldSpawnBoss not found!');
}

// 6. CLEAR ARENA FISSURES AND ARENA HAZARDS ON BOSS KILL
const oldBossKillFlash = `  if (isBoss) {
    triggerScreenFlash('#ffd740', 0.45, 180);`;

const newBossKillFlash = `  if (isBoss) {
    window.arenaFissures = [];
    hazards = hazards.filter(h => !h.isArenaRing);
    triggerScreenFlash('#ffd740', 0.45, 180);`;

if (html.includes(oldBossKillFlash)) {
  html = html.replace(oldBossKillFlash, newBossKillFlash);
  console.log('6. Cleared arenaFissures and arena ring hazards in killEnemy!');
} else {
  console.error('Warning: oldBossKillFlash not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Master Step 7 applied successfully!');
