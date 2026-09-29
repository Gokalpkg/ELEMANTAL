const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. ADD DECAL SYSTEM
// -------------------------------------------------------------
const decalSystemCode = `
// =========================================================================
// DECAL SYSTEM (Non-colliding environmental impact marks with fading opacity)
// =========================================================================
const decals = [];

function spawnDecal(x, y, type, radius, durationSec) {
  decals.push({
    x, y,
    type: type || 'scorch',
    radius: radius || 36,
    maxLife: durationSec || 7.0,
    life: durationSec || 7.0,
    rot: Math.random() * Math.PI * 2
  });
}

function updateDecals(dt) {
  for (let i = decals.length - 1; i >= 0; i--) {
    decals[i].life -= dt;
    if (decals[i].life <= 0) {
      decals.splice(i, 1);
    }
  }
}

function drawDecals(ctx) {
  if (!decals || decals.length === 0) return;
  ctx.save();
  for (let i = 0; i < decals.length; i++) {
    const d = decals[i];
    const alpha = Math.min(1.0, d.life / (d.maxLife * 0.45)) * 0.7;
    if (alpha <= 0.01) continue;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    ctx.globalAlpha = alpha;
    if (d.type === 'crater') {
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2.5;
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * d.radius * 1.15, Math.sin(a) * d.radius * 1.15);
        ctx.stroke();
      }
    } else if (d.type === 'scorch') {
      ctx.fillStyle = '#1c0a00';
      ctx.beginPath();
      ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, d.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    } else if (d.type === 'frost') {
      ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e0f7fa';
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * d.radius, Math.sin(a) * d.radius);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}
`;

if (!html.includes('const decals = [];')) {
  // Insert before drawBossTelegraphs
  html = html.replace('function drawBossTelegraphs(ctx, time) {', decalSystemCode + '\nfunction drawBossTelegraphs(ctx, time) {');
  console.log('Added DecalSystem');
}

// -------------------------------------------------------------
// 2. REFACTOR BACKGROUND TO TILEMAP + PARALLAX + LIGHTING
// -------------------------------------------------------------
const oldFloorFuncStart = `// =========================================================================
// MASTER UNIFIED BIOME WORLD FLOOR RENDERER
// Replaces the 128x128 repeating grid pattern with a cohesive, grand,
// atmospheric world arena. Zero repeating seams, zero square tiles!
// =========================================================================

function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {`;

const oldFloorFuncEnd = `  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(2, 3, 6, 0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(left, top, width, height);

  ctx.restore();
}`;

const newBackgroundCode = `// =========================================================================
// TILEMAP & MULTI-LAYER PARALLAX ENVIRONMENT SYSTEM
// Seamless repeating pixel art tiles, midground atmospheric depth,
// and cinematic multiply vignette lighting.
// =========================================================================

function drawBiomeTileFloor(ctx, cam, W, H, biome, time, visualMode) {
  const bk = (biome && biome.key) || 'stone';
  const pat = getFloorPattern(bk, visualMode);

  ctx.save();
  // Layer 1: Seamless repeating floor tiles aligned with world coordinates
  if (pat) {
    ctx.fillStyle = pat;
    ctx.fillRect(cam.x - 60, cam.y - 60, W + 120, H + 120);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cam.x, cam.y, W, H);
  }
  ctx.restore();
}

function drawParallaxAtmosphere(ctx, cam, W, H, biome, time) {
  const bk = (biome && biome.key) || 'stone';
  ctx.save();

  // Layer 2: Ethereal atmospheric particles drifting with 0.4x camera parallax
  const paraX = cam.x * 0.4;
  const paraY = cam.y * 0.4;
  const drift = time * 0.4;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const ax = cam.x + ((Math.sin(seed + drift * 0.02) * 0.5 + 0.5) * W * 1.2 - W * 0.1) - paraX * 0.15;
    const ay = cam.y + ((Math.cos(seed * 0.8 + drift * 0.015) * 0.5 + 0.5) * H * 1.2 - H * 0.1) - paraY * 0.15;
    const pSize = 3 + (i % 3) * 2;
    const pAlpha = 0.18 + Math.sin(time * 0.05 + i) * 0.08;

    ctx.fillStyle = bk === 'lava' ? '#ff5722' : bk === 'ice' ? '#80deea' : bk === 'forest' ? '#69f0ae' : bk === 'night' ? '#c084fc' : '#e2e8f0';
    ctx.globalAlpha = pAlpha;
    ctx.beginPath();
    ctx.arc(ax, ay, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Layer 3: Multiply Vignette / Global Lighting Overlay
  const vig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.28, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.88);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.65, 'rgba(0, 0, 0, 0.18)');
  vig.addColorStop(1, 'rgba(3, 7, 18, 0.72)');
  ctx.fillStyle = vig;
  ctx.fillRect(cam.x - 40, cam.y - 40, W + 80, H + 80);

  ctx.restore();
}`;

const startIdx = html.indexOf(oldFloorFuncStart);
const endIdx = html.indexOf(oldFloorFuncEnd);

if (startIdx !== -1 && endIdx !== -1) {
  html = html.substring(0, startIdx) + newBackgroundCode + html.substring(endIdx + oldFloorFuncEnd.length);
  console.log('Replaced drawUnifiedBiomeWorldFloor with Tilemap + Parallax Background');
} else {
  console.log('Could not find exact floor function bounds:', startIdx, endIdx);
}

// Update floor call in render loop
html = html.replace(
  `drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode);
  updateAndDrawBiomeMotes(biome);`,
  `drawBiomeTileFloor(ctx, cam, W, H, biome, time, visualMode);
  drawDecals(ctx);
  drawParallaxAtmosphere(ctx, cam, W, H, biome, time);
  updateAndDrawBiomeMotes(biome);`
);

// In main update loop: updateDecals(dt)
if (!html.includes('updateDecals(dt);')) {
  html = html.replace('updateShake(dt);', 'updateShake(dt);\n  updateDecals(dt);');
  console.log('Added updateDecals(dt) to update loop');
}

// -------------------------------------------------------------
// 3. HERO NAME PERSISTENCE IN BEGINRUNWITHKIT
// -------------------------------------------------------------
const oldBeginRun = `function beginRunWithKit(kitId, isDaily) {
  resetJoystick();
  lastBuild = null;
  const kit = START_KITS.find(k => k.id === kitId) || START_KITS[0];`;

const newBeginRun = `function beginRunWithKit(kitId, isDaily) {
  resetJoystick();
  lastBuild = null;
  const heroInput = document.getElementById('heroNameInput');
  const chosenName = (heroInput && heroInput.value && heroInput.value.trim()) ? heroInput.value.trim() : 'Alp';
  const curMeta = loadMeta();
  curMeta.heroName = chosenName;
  saveMeta(curMeta);
  const kit = START_KITS.find(k => k.id === kitId) || START_KITS[0];`;

if (html.includes(oldBeginRun)) {
  html = html.replace(oldBeginRun, newBeginRun);
  console.log('Saved heroName in beginRunWithKit');
}

// Populate hero name input on load/start
const oldInitStart = `function openStartScreen() {`;
if (html.includes(oldInitStart)) {
  html = html.replace(oldInitStart, `function openStartScreen() {
  const hInput = document.getElementById('heroNameInput');
  if (hInput) hInput.value = loadMeta().heroName || 'Alp';`);
  console.log('Populated heroNameInput in openStartScreen');
}

// -------------------------------------------------------------
// 4. AUTOATTACK RANGE CIRCLE INDICATOR AROUND PLAYER
// -------------------------------------------------------------
// When modLv('sniper') > 0 or normal, draw the range circle matching autoRange (~130)
const oldPlayerIndicator = `  if (!player.moving && enemies.length > 0) {
    ctx.save();
    const sniperOn = modLv('sniper') > 0;
    ctx.strokeStyle = sniperOn ? 'rgba(255, 215, 64, 0.65)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = sniperOn ? 2 : 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(px, pcy, player.r + 7 + Math.sin(time * 0.22) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }`;

const newPlayerIndicator = `  // Auto-Attack Range Circle Indicator (Halved to ~130px matching auto-attack firing radius)
  {
    ctx.save();
    const autoShot = currentAutoShot();
    const isSniper = modLv('sniper') > 0 && !player.moving;
    const firingRadius = (autoShot.range || AUTO_X) * (isSniper ? 1.6 : 1.0);
    ctx.strokeStyle = isSniper ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(px, py, firingRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }`;

if (html.includes(oldPlayerIndicator)) {
  html = html.replace(oldPlayerIndicator, newPlayerIndicator);
  console.log('Updated player range indicator circle to ~130px');
}

// -------------------------------------------------------------
// 5. BOSS FSM & MOVEMENT LOCKING (NO MOONWALKING / SLIDING)
// -------------------------------------------------------------
const oldBossAiHead = `function updateBossAi(en, dt, player, biome, now) {
  const bk = en.bossType || (biome && biome.key) || 'stone';`;

const newBossAiHead = `function updateBossAi(en, dt, player, biome, now) {
  const bk = en.bossType || (biome && biome.key) || 'stone';

  // STRICT BOSS FSM: 'move' | 'telegraph' | 'attack' | 'recovery'
  en.fsmState = en.fsmState || 'move';

  // ZERO VELOCITY LOCK: Boss feet are completely pinned to ground during telegraph, attack, and recovery!
  if (en.fsmState !== 'move') {
    en.vx = 0;
    en.vy = 0;
    en.moving = false;

    if (en.fsmState === 'telegraph') {
      en.fsmTimer = (en.fsmTimer || 0) - dt;
      // Weapon charging particles
      if (Math.random() < 0.4) {
        const cAng = Math.random() * Math.PI * 2;
        const cDist = en.r + 16;
        particles.push({
          x: en.x + Math.cos(cAng) * cDist,
          y: en.y + Math.sin(cAng) * cDist,
          vx: -Math.cos(cAng) * 2.2,
          vy: -Math.sin(cAng) * 2.2,
          r: 3, maxR: 1, life: 0.35, color: '#ff3d00', lw: 2
        });
      }
      if (en.fsmTimer <= 0) {
        en.fsmState = 'attack';
        en.fsmTimer = 0.35;
        if (typeof en.onAttackImpact === 'function') {
          en.onAttackImpact();
          en.onAttackImpact = null;
        }
      }
      return;
    } else if (en.fsmState === 'attack') {
      en.fsmTimer = (en.fsmTimer || 0) - dt;
      if (en.fsmTimer <= 0) {
        en.fsmState = 'recovery';
        en.fsmTimer = 0.35;
      }
      return;
    } else if (en.fsmState === 'recovery') {
      en.fsmTimer = (en.fsmTimer || 0) - dt;
      if (en.fsmTimer <= 0) {
        en.fsmState = 'move';
        en.specialCd = en.phase2 ? 2.4 : 3.6;
      }
      return;
    }
  }`;

if (html.includes(oldBossAiHead)) {
  html = html.replace(oldBossAiHead, newBossAiHead);
  console.log('Added strict FSM movement lock to updateBossAi');
}

// Write back
if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html part 2');
