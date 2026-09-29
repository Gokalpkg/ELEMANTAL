const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. ADD SKID TURNAROUND PUFFS & LOW HP HEARTBEAT AUDIO IN UPDATE
// -------------------------------------------------------------
const oldPlayerFacingUpdate = `  if (player.moving) player.facing = Math.atan2(player.vy, player.vx);`;

const newPlayerFacingUpdate = `  if (player.moving) {
    const prevFaceX = Math.cos(player.facing || 0);
    player.facing = Math.atan2(player.vy, player.vx);
    const newFaceX = Math.cos(player.facing);

    // SKID TURNAROUND DUST PUFFS (Sharp direction flip)
    if (Math.sign(prevFaceX) !== Math.sign(newFaceX) && Math.abs(player.vx) > 1.2) {
      for (let s = 0; s < 4; s++) {
        sparks.push({
          x: player.x + (Math.random() - 0.5) * 10,
          y: player.y + 7,
          vx: -Math.cos(player.facing) * (1.8 + Math.random() * 1.5),
          vy: -0.3 - Math.random() * 0.4,
          r: 1.6,
          life: 0.42,
          maxLife: 0.42,
          color: '#cbd5e1',
          rot: 0,
          vr: 0
        });
      }
    }
  }

  // LOW HP CRITICAL HEARTBEAT AUDIO PULSE (< 25% HP Panic)
  if (player && player.hp > 0 && player.maxHp > 0) {
    const hpRatio = player.hp / player.maxHp;
    if (hpRatio <= 0.25) {
      if (!window._lastLowHpThump || now - window._lastLowHpThump > 1050) {
        window._lastLowHpThump = now;
        synthBlip('heartbeat');
        if (typeof vibOn !== 'undefined' && vibOn) vibrate([20, 30]);
      }
    }
  }`;

if (html.includes(oldPlayerFacingUpdate)) {
  html = html.replace(oldPlayerFacingUpdate, newPlayerFacingUpdate);
  console.log('Added Skid Turnaround puffs & Low HP heartbeat audio in update');
} else {
  console.log('Could not find oldPlayerFacingUpdate');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with Scope 4 (Micro-Mechanics)');
