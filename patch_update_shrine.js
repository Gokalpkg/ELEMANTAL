const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

const oldUpdateBlock = `function update(dt, now) {
  // Hit-stop halts animation & motion briefly to accentuate critical strikes
  if (hitStopFrames > 0) {
    hitStopFrames--;
    return;
  }
  time += dt;`;

const newUpdateBlock = `function update(dt, now) {
  // Hit-stop halts animation & motion briefly to accentuate critical strikes
  if (hitStopFrames > 0) {
    hitStopFrames--;
    return;
  }
  time += dt;

  // STEP 9: ARENA SHRINE PROXIMITY CHECK
  if (arenaShrine && arenaShrine.active && player && player.hp > 0) {
    const sDist = Math.hypot(player.x - arenaShrine.x, player.y - arenaShrine.y);
    if (sDist < 52 && !overlayBusy() && !menuOpen) {
      openShrineModal();
    }
  }

  // STEP 9: FLAWLESS TRIAL TICK
  if (flawlessTimer > 0) {
    flawlessTimer -= dt;
    if (flawlessTimer <= 0) {
      flawlessTimer = 0;
      player.hp = player.maxHp;
      gainCrystals(180, player.x, player.y);
      triggerScreenFlash('#ffd700', 0.45, 240);
      showStreakBanner('👑 KUSURSUZ İMTİHAN KAZANILDI! (+180 💎 & Tam Can)', '#ffd700');
      playSfx('legendary', 0.5);
      vibrate([50, 70, 50, 90]);
    }
  }`;

if (html.includes(oldUpdateBlock)) {
  html = html.replace(oldUpdateBlock, newUpdateBlock);
  console.log('Successfully patched update() with shrine proximity and flawless timer!');
} else {
  console.error('Target not found in update()!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
