const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. ADD HIT-STOP SYSTEM & PLAYER FINITE STATE MACHINE DEFINITIONS
// =========================================================================
const updateFnStart = 'function update(dt, now) {';

const newUpdateFnHeader = `// Global Hit-Stop (Game-Feel Micro-Freeze on Impacts - Hades/Dead Cells style)
let hitStopFrames = 0;
function triggerHitStop(frames) {
  hitStopFrames = Math.max(hitStopFrames, frames || 4); // ~0.06 - 0.08s
}

const PLAYER_STATE = {
  IDLE: 'idle',
  RUN: 'run',
  ATTACK: 'attack',
  HURT: 'hurt'
};

function update(dt, now) {
  // Hit-stop halts animation & motion briefly to accentuate critical strikes
  if (hitStopFrames > 0) {
    hitStopFrames--;
    return;
  }
  time += dt;

  // Update Player Finite State Machine (FSM)
  if (player.recoilT > 0) {
    player.state = PLAYER_STATE.HURT;
    player.recoilT -= dt;
    if (player.hurtDir != null) {
      tryMove(player, -Math.cos(player.hurtDir) * 1.5 * dt, -Math.sin(player.hurtDir) * 1.5 * dt);
    }
  } else if (player.atkSlashFx > 0) {
    player.state = PLAYER_STATE.ATTACK;
    player.atkSlashFx -= dt;
  } else if (player.moving) {
    player.state = PLAYER_STATE.RUN;
  } else {
    player.state = PLAYER_STATE.IDLE;
  }`;

if (html.includes(updateFnStart)) {
  html = html.replace(updateFnStart, newUpdateFnHeader);
  console.log('1. Successfully added Hit-Stop and Player FSM to update function!');
} else {
  console.log('Warning: updateFnStart not found!');
}

// =========================================================================
// 2. TRIGGER HIT-STOP ON PLAYER HIT & CRITICAL STRIKES
// =========================================================================
const oldDmgHit = '  player.recoilT = 14;';
const newDmgHit = `  player.recoilT = 14;
  triggerHitStop(5); // 5 frames micro-freeze on player damage`;

if (html.includes(oldDmgHit)) {
  html = html.replace(oldDmgHit, newDmgHit);
  console.log('2. Successfully triggered Hit-Stop on damagePlayer!');
} else {
  console.log('Warning: oldDmgHit not found!');
}

// Trigger Hit-stop on Boss hits / Critical hits in takeDamage
const oldTakeDmg = '  if (crit) {';
const newTakeDmg = `  if (crit) {
    triggerHitStop(3); // 3 frames micro-freeze on critical hit`;

if (html.includes(oldTakeDmg)) {
  html = html.replace(oldTakeDmg, newTakeDmg);
  console.log('3. Successfully triggered Hit-Stop on critical hits!');
} else {
  console.log('Warning: oldTakeDmg not found!');
}

// =========================================================================
// 3. SYNC drawHeroPlayer ANIMATIONS EXACTLY TO player.state (FSM)
// Eliminates moonwalking & animation overlapping!
// =========================================================================
const oldHeroFsmBlock = `  // 1. Zırhlı Bacaklar Yürüme/Koşma Döngüsü (Hero Movement Cycle - Pafta Image 2)
  const walkSpeed = isMoving ? 0.35 : 0.08;
  const walkPhase = (player.walkTimer || time * walkSpeed);
  const legSwing = isMoving ? Math.sin(walkPhase) * 6 : Math.sin(time * 0.12) * 1.5;
  const bodyBob = isMoving ? Math.abs(Math.cos(walkPhase)) * 2.5 : Math.sin(time * 0.15) * 1.2;
  const cy = pcy - bodyBob;`;

const newHeroFsmBlock = `  // 1. Zırhlı Bacaklar Yürüme/Koşma Döngüsü (Hero Movement Cycle - FSM State Driven)
  const pState = player.state || (isMoving ? PLAYER_STATE.RUN : PLAYER_STATE.IDLE);
  const isHurt = pState === PLAYER_STATE.HURT;
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isRunning = pState === PLAYER_STATE.RUN;

  // Leg swing strictly active only when running; frozen/braced during attack & hurt
  const walkSpeed = isRunning ? 0.35 : 0.08;
  const walkPhase = (player.walkTimer || time * walkSpeed);
  const legSwing = isRunning ? Math.sin(walkPhase) * 6.5 : (isHurt ? -3 : 0);
  const bodyBob = isRunning ? Math.abs(Math.cos(walkPhase)) * 2.5 : (isAttacking ? 1.0 : Math.sin(time * 0.15) * 1.0);
  const cy = pcy - bodyBob + (isHurt ? 2 : 0);`;

if (html.includes(oldHeroFsmBlock)) {
  html = html.replace(oldHeroFsmBlock, newHeroFsmBlock);
  console.log('4. Successfully connected drawHeroPlayer to State Machine (FSM)!');
} else {
  console.log('Warning: oldHeroFsmBlock not found!');
}

// Sword swing in drawHeroPlayer strictly linked to isAttacking state
const oldSwordAng = '  const swordAng = faceAng + (player.atkSlashFx > 0 ? (player.atkSlashFx * 0.2) : 0);';
const newSwordAng = `  const combo = player.comboStep || 1;
  const attackSwingOffset = isAttacking ? (combo === 2 ? -0.8 : 0.9) * Math.sin(player.atkSlashFx * 0.35) : 0;
  const swordAng = faceAng + attackSwingOffset;`;

if (html.includes(oldSwordAng)) {
  html = html.replace(oldSwordAng, newSwordAng);
  console.log('5. Successfully connected sword swing to Attack State & Combo!');
} else {
  console.log('Warning: oldSwordAng not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
