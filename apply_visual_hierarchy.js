const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. FLOOR DESATURATION & MATTE CONTRAST DAMPING
// -------------------------------------------------------------
const oldFloorPatternDraw = `function drawBiomeTileFloor(ctx, cam, W, H, biome, time, visualMode) {
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
}`;

const newFloorPatternDraw = `function drawBiomeTileFloor(ctx, cam, W, H, biome, time, visualMode) {
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
  // MATTE DESATURATION OVERLAY: Damps background vibrancy by ~30% with a deep matte tint
  // Ensures pixel art characters, enemies, and glowing neon VFX strictly float in foreground!
  ctx.fillStyle = 'rgba(7, 10, 19, 0.32)';
  ctx.fillRect(cam.x - 60, cam.y - 60, W + 120, H + 120);
  ctx.restore();
}`;

if (html.includes(oldFloorPatternDraw)) {
  html = html.replace(oldFloorPatternDraw, newFloorPatternDraw);
  console.log('Applied Floor Desaturation & Contrast Damping');
} else {
  console.log('Could not find exact floor draw function');
}

// -------------------------------------------------------------
// 2. HERO DROP SHADOW & RIM LIGHT / READABILITY AURA
// -------------------------------------------------------------
const oldHeroBodyBob = `  const bodyBob = isRunning ? Math.abs(Math.cos(walkPhase)) * 2.5 : (isAttacking ? 1.0 : Math.sin(time * 0.15) * 1.0);
  const cy = pcy - bodyBob + (isHurt ? 2 : 0);

  ctx.save();

  // Magical Ground Light Aura under player`;

const newHeroBodyBob = `  const bodyBob = isRunning ? Math.abs(Math.cos(walkPhase)) * 2.5 : (isAttacking ? 1.0 : Math.sin(time * 0.15) * 1.0);
  const cy = pcy - bodyBob + (isHurt ? 2 : 0);

  // 1. SOFT ELLIPTICAL DROP SHADOW UNDER HERO FEET
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
  ctx.beginPath();
  ctx.ellipse(px, py + 7, player.r + 4, (player.r + 4) * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. HERO RIM LIGHT & READABILITY HALO (Instantly pops hero out in 60-mob swarm)
  ctx.save();
  const rimG = ctx.createRadialGradient(px, cy, player.r * 0.4, px, cy, player.r + 9);
  rimG.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
  rimG.addColorStop(0.7, 'rgba(56, 189, 248, 0.16)');
  rimG.addColorStop(1, 'transparent');
  ctx.fillStyle = rimG;
  ctx.beginPath();
  ctx.arc(px, cy, player.r + 9, 0, Math.PI * 2);
  ctx.fill();
  // Crisp outer rim ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.3;
  ctx.globalAlpha = 0.55 + Math.sin(time * 0.2) * 0.15;
  ctx.beginPath();
  ctx.arc(px, cy, player.r + 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();

  // Magical Ground Light Aura under player`;

if (html.includes(oldHeroBodyBob)) {
  html = html.replace(oldHeroBodyBob, newHeroBodyBob);
  console.log('Applied Hero Drop Shadow and Rim Light Aura');
} else {
  console.log('Could not find hero bodyBob target in drawHeroPlayer');
}

// -------------------------------------------------------------
// 3. ENEMY PROJECTILE UNIVERSAL DANGER HAZARD RING & BLACK OUTLINE
// -------------------------------------------------------------
const oldDrawEnemyShotHead = `function drawEnemyShot(p, time) {
  const ang = p.face != null ? p.face : Math.atan2(p.vy || 0, p.vx || 0);`;

const newDrawEnemyShotHead = `function drawEnemyShot(p, time) {
  // UNIVERSAL ENEMY THREAT INDICATOR: Crimson/Magenta danger aura & thick dark contrast border
  // Guarantees all enemy projectiles are immediately distinguishable from player spells!
  ctx.save();
  const dPulse = 1.0 + Math.sin(time * 0.32 + (p.ox || 0) * 0.05) * 0.14;
  const dRad = (p.r || 6.5) * dPulse;
  
  // 1. Thick dark outline
  ctx.strokeStyle = '#050505';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(p.x, p.y, dRad + 1.2, 0, Math.PI * 2);
  ctx.stroke();

  // 2. High-contrast neon Crimson/Magenta hazard threat aura
  ctx.shadowColor = '#ff0055';
  ctx.shadowBlur = 9;
  ctx.strokeStyle = '#ff0055';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(p.x, p.y, dRad + 2.8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  const ang = p.face != null ? p.face : Math.atan2(p.vy || 0, p.vx || 0);`;

if (html.includes(oldDrawEnemyShotHead)) {
  html = html.replace(oldDrawEnemyShotHead, newDrawEnemyShotHead);
  console.log('Applied Universal Enemy Projectile Danger Standard');
} else {
  console.log('Could not find drawEnemyShot head');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html with Visual Hierarchy Polish');
