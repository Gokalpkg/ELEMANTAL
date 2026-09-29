const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

console.log('=== APPLYING MASTER GAME DEVELOPER PERFECTION & CLEANING BIOMES ===');

// =========================================================================
// 1. OVERHAUL drawBossArenaFloor (ELIMINATE 9KB OF GEOMETRIC LINES & PENTAGRAMS)
// =========================================================================
const bossFloorStart = content.indexOf('function drawBossArenaFloor(ctx, cam, biome, boss, time) {');
const bossFloorEnd = content.indexOf('function render() {', bossFloorStart);

if (bossFloorStart !== -1 && bossFloorEnd !== -1) {
  const newBossArenaFloor = `function drawBossArenaFloor(ctx, cam, biome, boss, time) {
  if (!boss) return;
  const bk = boss.bossType || (biome && biome.key) || 'stone';
  const theme = BOSS_THEMES[bk] || BOSS_THEMES.stone;
  const isRaged = boss.raged || (boss.hp < boss.maxHp * 0.5) || boss.phase2;
  const cx = boss.arenaCx || boss.x;
  const cy = boss.arenaCy || boss.y;
  const arenaR = 300;
  if (cx + arenaR < cam.x - 40 || cx - arenaR > cam.x + W + 40 || cy + arenaR < cam.y - 40 || cy - arenaR > cam.y + H + 40) return;

  ctx.save();
  // Cinematic Soft Arena Vignette Ring (Zero distracting lines, pure atmospheric framing)
  const grad = ctx.createRadialGradient(cx, cy, arenaR * 0.60, cx, cy, arenaR * 1.05);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.85, isRaged ? 'rgba(239, 68, 68, 0.14)' : 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, isRaged ? 'rgba(220, 38, 38, 0.38)' : 'rgba(0, 0, 0, 0.58)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, arenaR * 1.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}\n\n`;

  content = content.slice(0, bossFloorStart) + newBossArenaFloor + content.slice(bossFloorEnd);
  console.log('1. Replaced drawBossArenaFloor with cinematic clean atmospheric vignette.');
} else {
  console.error('Could not find drawBossArenaFloor bounds!');
}

// =========================================================================
// 2. OVERHAUL drawDecals (REMOVE HARSH CRATER SPOKES & LINES)
// =========================================================================
const oldDecalsStart = content.indexOf('function drawDecals(ctx) {');
const oldDecalsEnd = content.indexOf('function drawBossTelegraphs(ctx, time) {', oldDecalsStart);

if (oldDecalsStart !== -1 && oldDecalsEnd !== -1) {
  const newDecals = `function drawDecals(ctx) {
  if (!decals || decals.length === 0) return;
  ctx.save();
  for (let i = 0; i < decals.length; i++) {
    const d = decals[i];
    const dr = (d.radius || 30) + 10;
    if (d.x < cam.x - dr || d.x > cam.x + W + dr || d.y < cam.y - dr || d.y > cam.y + H + dr) continue;
    const alpha = Math.min(0.20, (d.life / (d.maxLife || 180)) * 0.20);
    if (alpha <= 0.01) continue;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = d.type === 'frost' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.arc(0, 0, (d.radius || 20) * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}\n\n`;

  content = content.slice(0, oldDecalsStart) + newDecals + content.slice(oldDecalsEnd);
  console.log('2. Replaced drawDecals with soft organic impact marks (zero spiky lines).');
} else {
  console.error('Could not find drawDecals bounds!');
}

// =========================================================================
// 3. OVERHAUL drawArenaShrine (REMOVE HARSH 60PX CONCENTRIC RINGS)
// =========================================================================
const oldShrineStart = content.indexOf('function drawArenaShrine(ctx, cam, time) {');
const oldShrineEnd = content.indexOf('function triggerSwarmFormation(formType) {', oldShrineStart);

if (oldShrineStart !== -1 && oldShrineEnd !== -1) {
  const newShrine = `function drawArenaShrine(ctx, cam, time) {
  if (!arenaShrine) return;
  const sr = arenaShrine.r || 60;
  if (arenaShrine.x < cam.x - sr - 20 || arenaShrine.x > cam.x + W + sr + 20 || arenaShrine.y < cam.y - sr - 20 || arenaShrine.y > cam.y + H + sr + 20) return;
  const sx = arenaShrine.x;
  const sy = arenaShrine.y;
  const isActive = arenaShrine.active;

  ctx.save();
  // 1. Subtle, gentle sacred ground ambient
  if (isActive) {
    const rPulse = 0.16 + Math.sin(time * 0.004) * 0.06;
    const aura = ctx.createRadialGradient(sx, sy, 4, sx, sy, 45);
    aura.addColorStop(0, 'rgba(192, 132, 252, ' + rPulse + ')');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(sx, sy, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Monolith Stone Altar Pedestal
  ctx.fillStyle = isActive ? '#1e1b4b' : '#0f172a';
  ctx.strokeStyle = isActive ? '#a855f7' : '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(sx - 14, sy - 8, 28, 20, 4);
  ctx.fill();
  ctx.stroke();

  // 3. Levitating Mystic Relic Orb
  if (isActive) {
    const floatY = sy - 18 + Math.sin(time * 0.006) * 5;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(sx, floatY, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}\n\n`;

  content = content.slice(0, oldShrineStart) + newShrine + content.slice(oldShrineEnd);
  console.log('3. Replaced drawArenaShrine (removed harsh outer circles).');
} else {
  console.error('Could not find drawArenaShrine bounds!');
}

// =========================================================================
// 4. REMOVE FOREST 1.08 SCALE & DISTORTION IN RENDER
// =========================================================================
const forestScaleCode = `  if (biome.key === 'forest') {
    ctx.translate(player.x, player.y);
    ctx.scale(1.08, 1.08);
    ctx.translate(-player.x, -player.y);
  }`;

if (content.includes(forestScaleCode)) {
  content = content.replace(forestScaleCode, '  // Forest scale zoom removed for consistent stable camera');
  console.log('4. Removed forest 1.08x scale camera distortion.');
}

// =========================================================================
// 5. CLEAN WINDS RECTANGLES & LINES
// =========================================================================
const oldWindsCode = `  winds.forEach(w => {
    if (w.x + w.w < cullL || w.x > cullR || w.y + w.h < cullT || w.y > cullB) return;
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#a8d8ff';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = '#d6f0ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const px = w.x + ((time * 2.4 * w.str + i * 40) % w.w);
      const py = w.y + w.h * (0.2 + i * 0.15);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + w.dx * 22, py + w.dy * 22);
      ctx.stroke();
    }
    ctx.restore();
  });`;

const newWindsCode = `  // Gentle ambient wind specks without intrusive blue boxes or lines
  winds.forEach(w => {
    if (w.x + w.w < cullL || w.x > cullR || w.y + w.h < cullT || w.y > cullB) return;
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#bae6fd';
    for (let i = 0; i < 3; i++) {
      const px = w.x + ((time * 1.5 * w.str + i * 50) % w.w);
      const py = w.y + w.h * (0.3 + i * 0.2);
      ctx.fillRect(px, py, 3, 2);
    }
    ctx.restore();
  });`;

if (content.includes(oldWindsCode)) {
  content = content.replace(oldWindsCode, newWindsCode);
  console.log('5. Replaced wind rectangular boxes with gentle specks.');
}

// =========================================================================
// 6. CLEAN DRAWENVDEBRIS (REMOVE GEYSER CLUTTER)
// =========================================================================
const oldEnvDebrisCall = `  // Çevresel Piksel-Art Kırıntı & Zemin Efektleri
  drawEnvDebris();`;
const newEnvDebrisCall = `  // Background clutter removed to ensure 100% pure biome ground integrity`;

if (content.includes(oldEnvDebrisCall)) {
  content = content.replace(oldEnvDebrisCall, newEnvDebrisCall);
  console.log('6. Disabled intrusive background debris clutter.');
}

// =========================================================================
// 7. CLEAN INVISIBLE VARIATION SELECTORS FROM STRINGS
// =========================================================================
content = content.replace(/'️ BAŞLANGIÇ BARİYERİ'/g, "'BAŞLANGIÇ BARİYERİ'");
content = content.replace(/'️ ÇÖL OBELİSKİ!'/g, "'ÇÖL OBELİSKİ!'");
content = content.replace(/'️ DESERT OBELISK!'/g, "'DESERT OBELISK!'");
content = content.replace(/'️ STARTING BARRIER'/g, "'STARTING BARRIER'");
console.log('7. Cleaned invisible variation selectors from string constants.');

// =========================================================================
// 8. RICH COHESIVE 10 BIOMES PALETTES
// =========================================================================
const oldPalettes = `  const PALETTES = {
    stone:   { base: '#101522', shade: '#161d2e', accent: '#0c101b' },
    forest:  { base: '#071f14', shade: '#0b2b1c', accent: '#05160e' },
    water:   { base: '#071828', shade: '#0b2238', accent: '#05111d' },
    ice:     { base: '#081d2e', shade: '#0d273d', accent: '#051421' },
    sand:    { base: '#22180d', shade: '#2a1f12', accent: '#1a1208' },
    lava:    { base: '#180e0c', shade: '#201411', accent: '#120908' },
    storm:   { base: '#111024', shade: '#171630', accent: '#0c0b1a' },
    night:   { base: '#0c0a18', shade: '#120f22', accent: '#080611' },
    pink:    { base: '#1f0f1a', shade: '#281522', accent: '#170a13' },
    ketchup: { base: '#1c0a0d', shade: '#240e12', accent: '#140608' }
  };`;

const newPalettes = `  const PALETTES = {
    stone:   { base: '#0f1420', shade: '#141c2c', accent: '#0a0d16' },
    forest:  { base: '#06180f', shade: '#0a2417', accent: '#04100a' },
    water:   { base: '#061422', shade: '#0a1e32', accent: '#040e18' },
    ice:     { base: '#071826', shade: '#0b2234', accent: '#04101c' },
    sand:    { base: '#1a120a', shade: '#241a0e', accent: '#120c06' },
    lava:    { base: '#140a08', shade: '#1c100d', accent: '#0e0605' },
    storm:   { base: '#0d0c1c', shade: '#141228', accent: '#080714' },
    night:   { base: '#0a0816', shade: '#100d20', accent: '#060510' },
    pink:    { base: '#160a12', shade: '#200f1c', accent: '#0e060c' },
    ketchup: { base: '#16080a', shade: '#200c0f', accent: '#0e0406' }
  };`;

if (content.includes(oldPalettes)) {
  content = content.replace(oldPalettes, newPalettes);
  console.log('8. Enhanced all 10 biome palettes to deep, cohesive, high-art tones.');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== MASTER DEVELOPER PERFECTION APPLIED CLEANLY ===');
