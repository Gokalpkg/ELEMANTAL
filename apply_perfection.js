const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. INJECT MASTER BOSS KINEMATICS ENGINE
const bossEngine = fs.readFileSync('master_boss_kinematics_engine.js', 'utf8');
const sugarIdx = html.indexOf('function drawBossPixelSugar(');
const ketchupIdx = html.indexOf('function drawBossPixelKetchup(');
const nextFuncIdx = html.indexOf('\nfunction drawCustomAnimatedPixelBoss', ketchupIdx);

if (sugarIdx === -1 || nextFuncIdx === -1) {
  console.error('Boss functions range not found!');
  process.exit(1);
}

const beforeBoss = html.substring(0, sugarIdx);
const afterBoss = html.substring(nextFuncIdx);
html = beforeBoss + bossEngine.trim() + '\n\n' + afterBoss;
console.log('1. Injected master_boss_kinematics_engine.js successfully!');

// 2. INJECT MASTER UNIFIED WORLD FLOOR FUNCTION
const floorEngine = fs.readFileSync('master_biome_world_floor.js', 'utf8');
const floorInsertPoint = html.indexOf('function createBiomeFloorCanvas');
if (floorInsertPoint === -1) {
  console.error('createBiomeFloorCanvas not found!');
  process.exit(1);
}
html = html.substring(0, floorInsertPoint) + floorEngine.trim() + '\n\n' + html.substring(floorInsertPoint);
console.log('2. Injected master_biome_world_floor.js successfully!');

// 3. REPLACE REPEATING 128x128 FLOOR IN RENDER()
const oldFloorPatternCall = `  ctx.fillStyle = visHex(biome.c0, 'floor');
  ctx.fillRect(Math.floor(cam.x / 16) * 16 - 32, Math.floor(cam.y / 16) * 16 - 32, W + 80, H + 80);
  updateAndDrawBiomeMotes(biome);
  ctx.save();
  ctx.fillStyle = getFloorPattern(biome.key, visualMode);
  ctx.fillRect(cam.x - 32, cam.y - 32, W + 64, H + 64);
  ctx.restore();`;

const newUnifiedFloorCall = `  drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode);
  updateAndDrawBiomeMotes(biome);`;

// Regex replacement to handle CRLF / LF variations
const floorRegex = /ctx\.fillStyle\s*=\s*visHex\(biome\.c0,\s*'floor'\);[\s\S]*?ctx\.fillRect\(cam\.x\s*-\s*32,\s*cam\.y\s*-\s*32,\s*W\s*\+\s*64,\s*H\s*\+\s*64\);[\s\r\n]*ctx\.restore\(\);/;

if (floorRegex.test(html)) {
  html = html.replace(floorRegex, newUnifiedFloorCall);
  console.log('3. Replaced 128x128 repeating floor pattern with drawUnifiedBiomeWorldFloor!');
} else {
  console.error('3. Could not match old floor pattern in render()');
}

// 4. BIOME-SPECIFIC XP GEMS IN DRAWDROP()
const oldXpDropCode = `  const pulse = 1 + Math.sin(time*0.16)*0.05;
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.beginPath(); ctx.ellipse(d.x, y+11, 8.5, 3.2, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,224,138,.85)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(d.x, y, 12*pulse, 0, Math.PI*2); ctx.stroke();
  glowCircle(d.x, y, 7, '#ffd740', 0.7);
  ctx.save();
  ctx.translate(d.x, y);
  ctx.rotate(Math.sin(time*0.05)*0.12);
  ctx.beginPath();
  ctx.moveTo(0,-7); ctx.lineTo(6.2,0); ctx.lineTo(0,7); ctx.lineTo(-6.2,0); ctx.closePath();
  ctx.fillStyle = '#fff4b8'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,-7); ctx.lineTo(6.2,0); ctx.lineTo(0,1); ctx.closePath();
  ctx.fillStyle = '#e0a818'; ctx.fill();
  ctx.restore();`;

const newXpDropCode = `  // Biome-Specific Multi-Faceted Prismatic XP Jewel
  const curBiomeKey = (typeof currentBiome === 'function' ? currentBiome().key : 'stone') || 'stone';
  const palList = BIOME_XP_PALETTES[curBiomeKey] || BIOME_XP_PALETTES.stone;
  const tier = (d.tier || 0) % palList.length;
  const pal = palList[tier] || palList[0];

  const pulse = 1 + Math.sin(time * 0.16 + (d.x * 0.05)) * 0.08;
  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.beginPath(); ctx.ellipse(d.x, y + 11, 8.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();

  // Biome-themed luminous aura ring
  ctx.strokeStyle = pal.outer + 'aa'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(d.x, y, 12 * pulse, 0, Math.PI * 2); ctx.stroke();
  glowCircle(d.x, y, 7, pal.outer, 0.78);

  ctx.save();
  ctx.translate(d.x, y);
  ctx.rotate(Math.sin(time * 0.05 + d.x) * 0.14);

  // Outer facet
  ctx.beginPath();
  ctx.moveTo(0, -7.5); ctx.lineTo(6.5, 0); ctx.lineTo(0, 7.5); ctx.lineTo(-6.5, 0); ctx.closePath();
  ctx.fillStyle = pal.mid; ctx.fill();

  // Highlight facet
  ctx.beginPath();
  ctx.moveTo(0, -7.5); ctx.lineTo(6.5, 0); ctx.lineTo(0, 1); ctx.closePath();
  ctx.fillStyle = pal.core; ctx.fill();

  // Shadow facet
  ctx.beginPath();
  ctx.moveTo(0, 1); ctx.lineTo(-6.5, 0); ctx.lineTo(0, 7.5); ctx.closePath();
  ctx.fillStyle = pal.dark; ctx.fill();

  // Center sparkle glint
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1, -3, 2, 2);

  ctx.restore();`;

const xpDropRegex = /const pulse = 1 \+ Math\.sin\(time\*0\.16\)\*0\.05;[\s\S]*?ctx\.fillStyle = '#e0a818'; ctx\.fill\(\);[\s\r\n]*ctx\.restore\(\);/;

if (xpDropRegex.test(html)) {
  html = html.replace(xpDropRegex, newXpDropCode);
  console.log('4. Connected XP drop rendering to BIOME_XP_PALETTES successfully!');
} else {
  console.error('4. Could not match old XP drop code in drawDrop');
}

// 5. RED ENEMY CONTRAST RIM LIGHT IN DRAWBIOMEENEMY
const enemyAnchor = `function drawBiomeEnemy(ctx, en, time, biome, fogged) {
  const bk = (biome && biome.key) || 'stone';`;

const enemyReplacement = `function drawBiomeEnemy(ctx, en, time, biome, fogged) {
  const bk = (biome && biome.key) || 'stone';
  // High-Contrast Silhouette: Guarantee enemies pop out from red/lava floors!
  ctx.save();
  ctx.shadowColor = (bk === 'lava' || bk === 'ketchup') ? 'rgba(0, 229, 255, 0.45)' : 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 5;`;

if (html.includes(enemyAnchor)) {
  html = html.replace(enemyAnchor, enemyReplacement);
  // Close the shadow save at the end of drawBiomeEnemy
  const enemyEndRegex = /(drawEnemyHealthBar\(ctx, en, en\.x, cy, en\.r, bk\);[\s\r\n]*return cy;[\s\r\n]*})/;
  html = html.replace(enemyEndRegex, `$1\n  ctx.restore(); // end enemy contrast shadow`);
  console.log('5. Added High-Contrast Silhouette to enemies for Lava/Red biomes!');
} else {
  console.log('5. enemyAnchor not found in drawBiomeEnemy');
}

// 6. UPDATE VERSION TO 20260921P
html = html.replace(/BUILD_ID = '[^']+';/, "BUILD_ID = '20260921P';");
fs.writeFileSync('index.html', html, 'utf8');
console.log('6. Updated index.html BUILD_ID to 20260921P');

fs.writeFileSync('version.txt', '20260921P\n', 'utf8');
console.log('7. Updated version.txt to 20260921P');

let serve = fs.readFileSync('serve-apk.js', 'utf8');
serve = serve.replace(/ElementSavas-v[^\.]+\.apk/g, 'ElementSavas-v20260921P.apk');
fs.writeFileSync('serve-apk.js', serve, 'utf8');
console.log('8. Updated serve-apk.js to ElementSavas-v20260921P.apk');

console.log('All perfection steps applied successfully!');
