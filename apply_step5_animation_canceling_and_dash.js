const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. ADD dash_whoosh SOUND PROFILE TO synthBlip
// -------------------------------------------------------------
const oldSynthBlipTarget = `    } else if (kind === 'hit') {
      o.type = 'sine';`;

const newSynthBlipTarget = `    } else if (kind === 'dash_whoosh') {
      // Aerodinamik hava yarığı & rüzgar süpürmesi (Hades/Dead Cells Dash Whoosh)
      o.type = 'sawtooth';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1800, t);
      f.frequency.exponentialRampToValueAtTime(320, t + 0.16);
      f.Q.setValueAtTime(3.2, t);
      o.frequency.setValueAtTime(420, t);
      o.frequency.exponentialRampToValueAtTime(110, t + 0.15);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.35, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
      o.start(t); o.stop(t + 0.18);
    } else if (kind === 'hit') {
      o.type = 'sine';`;

if (html.includes(oldSynthBlipTarget)) {
  html = html.replace(oldSynthBlipTarget, newSynthBlipTarget);
  changes++;
  console.log('[1] Added dash_whoosh audio profile to synthBlip');
} else {
  console.warn('[1] Warning: oldSynthBlipTarget not found');
}

// -------------------------------------------------------------
// 2. ENHANCE triggerDash WITH ANIMATION CANCELING & PRO-IFRAMES
// -------------------------------------------------------------
const oldTriggerDash = `function triggerDash() {
  if (!running || paused || menuOpen || !player || player.hp <= 0) return;
  if (player.dashCd > 0 || player.dashTime > 0) return;

  let dx = (typeof joyVec !== 'undefined' && joyVec) ? joyVec.x : 0;
  let dy = (typeof joyVec !== 'undefined' && joyVec) ? joyVec.y : 0;
  if (Math.hypot(dx, dy) < 0.12) {
    const fAng = player.facing != null ? player.facing : -Math.PI / 2;
    dx = Math.cos(fAng);
    dy = Math.sin(fAng);
  }
  const len = Math.hypot(dx, dy) || 1;
  player.dashDirX = dx / len;
  player.dashDirY = dy / len;
  player.dashTime = 14;
  const cdRecov = 1 + (treeLv('dashRecovery') * 0.12);
  player.dashCd = Math.round(55 / cdRecov);
  player.invuln = Math.max(player.invuln || 0, 24);

  playSfx('dash', 0.35, 120);
  burst(player.x, player.y, '#38bdf8', 12, 3.2);
  vibrate(25);
  syncDashFab();
}`;

const newTriggerDash = `function triggerDash() {
  if (!running || paused || menuOpen || !player || player.hp <= 0) return;
  if (player.dashCd > 0 || player.dashTime > 0) return;

  // STEP 5: ANIMATION CANCELING - Instantly breaks attack delay, cast lock & flinch
  player.castLock = 0;
  player.attackWindup = 0;
  player.staggerTimer = 0;
  if (typeof player.state !== 'undefined') player.state = PLAYER_STATE.DASH;

  let dx = (typeof joyVec !== 'undefined' && joyVec) ? joyVec.x : 0;
  let dy = (typeof joyVec !== 'undefined' && joyVec) ? joyVec.y : 0;
  if (Math.hypot(dx, dy) < 0.12) {
    const fAng = player.facing != null ? player.facing : -Math.PI / 2;
    dx = Math.cos(fAng);
    dy = Math.sin(fAng);
  }
  const len = Math.hypot(dx, dy) || 1;
  player.dashDirX = dx / len;
  player.dashDirY = dy / len;
  player.dashTime = 13; // 13 frames (~216ms) of crisp, snappy dash
  const cdRecov = 1 + (treeLv('dashRecovery') * 0.12);
  player.dashCd = Math.round(48 / cdRecov); // ~0.8s cooldown
  player.invuln = Math.max(player.invuln || 0, 20); // 20 frames i-frames (full dash + 7 frames buffer)

  playSfx('dash', 0.42, 140);
  synthBlip('dash_whoosh');
  burst(player.x, player.y, '#38bdf8', 14, 3.8);
  burst(player.x, player.y, '#ffffff', 8, 2.5);
  vibrate(25);
  syncDashFab();
}`;

if (html.includes(oldTriggerDash)) {
  html = html.replace(oldTriggerDash, newTriggerDash);
  changes++;
  console.log('[2] Upgraded triggerDash with Animation Canceling & i-Frames');
} else {
  console.warn('[2] Warning: oldTriggerDash not found');
}

// -------------------------------------------------------------
// 3. FIX FRAME DECAY BUG & ADD NEAR-MISS DODGE REWARD IN UPDATE
// -------------------------------------------------------------
const oldDashUpdateBlock = `  // --- DASH HAREKETİ VE COOLDOWN ---
  if (player.dashTime > 0) {
    player.dashTime -= dt * 16.67;
    player.invuln = Math.max(player.invuln, 22); // Full i-frame invulnerability window
    const dSpd = player.speed * 4.2;
    tryMove(player, (player.dashDirX || 0) * dSpd * dt, (player.dashDirY || 0) * dSpd * dt);
    
    // Glass Cannon Relic Explosion on Dash
    if (runFlags().glassCannon && Math.random() < 0.25) {
      damageEnemiesInRadius(player.x, player.y, 75, 45, ['burn'], 1.5, 'fire');
      burst(player.x, player.y, '#c084fc', 8, 3.0);
    }
    // Ghost Trail: spawn high-fidelity afterimage silhouettes during dash
    afterImg.push({
      x: player.x,
      y: player.y,
      facing: player.facing,
      life: 0.85,
      hex: Math.random() < 0.5 ? '#c084fc' : '#38bdf8',
      isGhost: true
    });
    if (afterImg.length > 22) afterImg.shift();

    if (Math.random() < 0.7) {
      particles.push({
        x: player.x + (Math.random() - 0.5) * 10,
        y: player.y + (Math.random() - 0.5) * 10,
        r: 8, maxR: 16,
        life: 0.32, color: '#c084fc'
      });
    }
  }
  if (player.dashCd > 0) {
    const cdRecov = 1 + (treeLv('dashRecovery') * 0.12);
    player.dashCd -= dt * 16.67 * cdRecov;
    if (player.dashCd <= 0) syncDashFab();
  }`;

const newDashUpdateBlock = `  // --- STEP 5: PRO-LEVEL DASH MOTION, I-FRAMES & NEAR-MISS REWARD ---
  if (player.dashTime > 0) {
    player.dashTime = Math.max(0, player.dashTime - dt);
    player.invuln = Math.max(player.invuln || 0, 18); // Continuous i-frame invulnerability
    const dSpd = player.speed * 4.2;
    tryMove(player, (player.dashDirX || 0) * dSpd * dt, (player.dashDirY || 0) * dSpd * dt);
    
    // Glass Cannon Relic Explosion on Dash
    if (runFlags().glassCannon && Math.random() < 0.25) {
      damageEnemiesInRadius(player.x, player.y, 75, 45, ['burn'], 1.5, 'fire');
      burst(player.x, player.y, '#c084fc', 8, 3.0);
    }
    // Ghost Trail: spawn high-fidelity afterimage silhouettes during dash
    afterImg.push({
      x: player.x,
      y: player.y,
      facing: player.facing,
      life: 0.85,
      hex: Math.random() < 0.5 ? '#c084fc' : '#38bdf8',
      isGhost: true
    });
    if (afterImg.length > 22) afterImg.shift();

    if (Math.random() < 0.7) {
      particles.push({
        x: player.x + (Math.random() - 0.5) * 10,
        y: player.y + (Math.random() - 0.5) * 10,
        r: 8, maxR: 16,
        life: 0.32, color: '#c084fc'
      });
    }

    // PERFECT DODGE / NEAR-MISS REWARD (Kusursuz Sıyrılma)
    if (enemyProjectiles && enemyProjectiles.length) {
      for (let bi = 0; bi < enemyProjectiles.length; bi++) {
        const bp = enemyProjectiles[bi];
        const bDist = Math.hypot(bp.x - player.x, bp.y - player.y);
        if (bDist < (bp.r || 6) + player.r + 14 && !bp._dodged) {
          bp._dodged = true;
          spawnFloatText(player.x, player.y - 28, '⚡ KUSURSUZ SIYRILMA!', '#38bdf8', 'small');
          burst(player.x, player.y, '#38bdf8', 10, 3.0);
          player.dashCd = Math.round(player.dashCd * 0.4); // 60% Dash CD refund!
          vibrate([20, 35]);
          playSfx('confirm', 0.35, 600);
          break;
        }
      }
    }
  }
  if (player.dashCd > 0) {
    const cdRecov = 1 + (treeLv('dashRecovery') * 0.12);
    player.dashCd = Math.max(0, player.dashCd - dt * cdRecov);
    if (player.dashCd <= 0) syncDashFab();
  }`;

if (html.includes(oldDashUpdateBlock)) {
  html = html.replace(oldDashUpdateBlock, newDashUpdateBlock);
  changes++;
  console.log('[3] Fixed dash frame decay & added Near-Miss Dodge Reward in update');
} else {
  console.warn('[3] Warning: oldDashUpdateBlock not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 5 patch script. Total successful patches: ${changes}/3`);
