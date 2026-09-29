const fs = require('fs');

const htmlPath = 'index.html';
let content = fs.readFileSync(htmlPath, 'utf8');

console.log('=== REFINING ZEN BACKGROUND & VISUAL CLARITY ===');

// 1. Remove micro-noise loop from createBiomeFloorCanvas (eliminates diagonal dotted lines)
const oldNoiseLoop = `  // 3. Gentle Micro-Noise for Textured Pixel Depth (No harsh vectors, no lines)
  for (let i = 0; i < 90; i++) {
    const rx = ((i * 37) % 256);
    const ry = ((i * 73) % 256);
    c.fillStyle = (i % 2 === 0) ? pal.shade : pal.accent;
    c.fillRect(rx, ry, 3, 3);
  }`;

const newCleanFloor = `  // Zero artificial noise or diagonal dotted lines - Pure organic pixel cobblestone`;

if (content.includes(oldNoiseLoop)) {
  content = content.replace(oldNoiseLoop, newCleanFloor);
  console.log('1. Removed micro-noise diagonal dots from floor.');
} else {
  console.log('Micro-noise loop not found or already removed.');
}

// 2. Remove redundant dashed combo range circles that clutter the player's surroundings
const oldComboCircles = `  lockedCombos.forEach((combo, i) => {
    const st = skillState[i];
    if (!st || !st.ready || !combo.range) return;
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.sin(time * 0.14 + i) * 0.06;
    ctx.strokeStyle = visHex(combo.color, 'char');
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 6]);
    ctx.beginPath(); ctx.arc(px, py, combo.range, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  });`;

const newComboCircles = `  // Removed intrusive persistent dashed combo range rings for clean combat clarity`;

if (content.includes(oldComboCircles)) {
  content = content.replace(oldComboCircles, newComboCircles);
  console.log('2. Removed redundant combo range dashed circles.');
} else {
  console.log('Combo circles target not found or already updated.');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('index.html refined successfully.');
