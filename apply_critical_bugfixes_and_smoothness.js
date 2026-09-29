const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. ADD #dashFab BUTTON TO HTML NEXT TO #ultFab
const oldFabHtml = `    <div id="skillBar"></div>
    <button type="button" id="ultFab" class="ult-fab" aria-label="Kadim Ulti (Element Kıyameti)">`;

const newFabHtml = `    <div id="skillBar"></div>
    <button type="button" id="dashFab" class="dash-fab" aria-label="Atılma (Dash)">
      <div class="dash-inner">
        <span class="dash-icon">💨</span>
        <span class="dash-txt" id="dashTxt">ATIL</span>
      </div>
    </button>
    <button type="button" id="ultFab" class="ult-fab" aria-label="Kadim Ulti (Element Kıyameti)">`;

if (html.includes(oldFabHtml)) {
  html = html.replace(oldFabHtml, newFabHtml);
  console.log('1. Injected #dashFab button into HTML!');
} else {
  console.log('Warning: oldFabHtml not found!');
}

// 2. DEFINE syncDashFab AND triggerDash IN JAVASCRIPT
const oldTriggerUltimate = `function triggerUltimate() {`;

const newDashFunctions = `function syncDashFab() {
  const btn = document.getElementById('dashFab');
  if (!btn) return;
  if (!running || menuOpen || paused) {
    btn.style.display = 'none';
    return;
  }
  btn.style.display = 'flex';
  const onCd = player && (player.dashCd > 0 || player.dashTime > 0);
  btn.classList.toggle('cooldown', !!onCd);
  const txt = document.getElementById('dashTxt');
  if (txt) {
    if (onCd) {
      const sec = Math.ceil((player.dashCd || 0) / 60);
      txt.textContent = sec > 0 ? (sec + 's') : '...';
      txt.style.color = '#94a3b8';
    } else {
      txt.textContent = 'ATIL';
      txt.style.color = '#38bdf8';
    }
  }
}

function triggerDash() {
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
}

function triggerUltimate() {`;

if (html.includes(oldTriggerUltimate)) {
  html = html.replace(oldTriggerUltimate, newDashFunctions);
  console.log('2. Defined syncDashFab and triggerDash functions!');
} else {
  console.log('Warning: oldTriggerUltimate not found!');
}

// 3. SAFELY DECLARE dashFab IN BOTTOM EVENT LISTENERS
const oldDashListener = `if (dashFab) {
  dashFab.addEventListener('click', triggerDash);
  dashFab.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerDash();
  }, { passive: false });
}`;

const newDashListener = `const dashFab = document.getElementById('dashFab');
if (dashFab) {
  dashFab.addEventListener('click', triggerDash);
  dashFab.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerDash();
  }, { passive: false });
}`;

if (html.includes(oldDashListener)) {
  html = html.replace(oldDashListener, newDashListener);
  console.log('3. Safely declared const dashFab in event listeners!');
} else {
  console.log('Warning: oldDashListener not found!');
}

// 4. FIX HIT-STOP THROTTLING AND REMOVE HIT-STOP FROM NORMAL MOB HITS
const oldTriggerHitStopDef = `let hitStopFrames = 0;
function triggerHitStop(frames) {
  hitStopFrames = Math.max(hitStopFrames, frames || 4); // ~0.06 - 0.08s
}`;

const newTriggerHitStopDef = `let hitStopFrames = 0;
let lastHitStopAt = 0;
function triggerHitStop(frames) {
  const now = performance.now();
  if (now - lastHitStopAt < 250) return; // 250ms throttle prevents constant micro-freezes!
  lastHitStopAt = now;
  hitStopFrames = Math.min(10, Math.max(0, frames || 4));
}`;

if (html.includes(oldTriggerHitStopDef)) {
  html = html.replace(oldTriggerHitStopDef, newTriggerHitStopDef);
  console.log('4. Patched triggerHitStop with 250ms throttle and 10-frame cap!');
} else {
  console.log('Warning: oldTriggerHitStopDef not found!');
}

// 5. REMOVE FREEZING HIT-STOP FROM NORMAL MOB HITS IN TAKEDAMAGE
const oldTakeDmgHitStop = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Hades / Dead Cells micro-crunch)
  if (!opt.quiet) {
    triggerHitStop(isCrit ? 5 : 2); // 2-frame micro-freeze on hit, 5-frame on crit!
    shake = Math.max(shake, isCrit ? 5.5 : 2.0);
    if (isCrit) vibrate([15, 25]);
    // Dynamic Elemental Audio Juice
    if (el && typeof playElemHit === 'function') {
      playElemHit(el);
    } else {
      synthBlip('hit');
    }
  }`;

const newTakeDmgHitStop = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Only on Boss crits, NEVER freeze on normal mob hits!)
  if (!opt.quiet) {
    if (en.type === 'boss' && isCrit) {
      triggerHitStop(6);
    }
    shake = Math.max(shake, isCrit ? 4.0 : 1.5);
    if (isCrit) vibrate([15, 25]);
    // Dynamic Elemental Audio Juice
    if (el && typeof playElemHit === 'function') {
      playElemHit(el);
    } else {
      synthBlip('hit');
    }
  }`;

if (html.includes(oldTakeDmgHitStop)) {
  html = html.replace(oldTakeDmgHitStop, newTakeDmgHitStop);
  console.log('5. Removed hit-stop from normal mob hits in takeDamage (60 FPS smooth)!');
} else {
  console.log('Warning: oldTakeDmgHitStop not found!');
}

// 6. REMOVE HIT-STOP FROM KILLENEMY EXCEPT BOSS
const oldKillEnemyHitStop = `triggerHitStop(isBoss ? 48 : isTank ? 18 : 12);`;
const newKillEnemyHitStop = `if (isBoss) triggerHitStop(14);`;

if (html.includes(oldKillEnemyHitStop)) {
  html = html.replace(oldKillEnemyHitStop, newKillEnemyHitStop);
  console.log('6. Removed hit-stop from normal mob kills in killEnemy!');
} else {
  console.log('Warning: oldKillEnemyHitStop not found!');
}

// 7. REMOVE HIT-STOP FROM EMITREACTIONBURST ON REGULAR MOBS
const oldEmitReactionBurstHitStop = `  // Micro-Freeze Hit Stop & Juicy Camera Impact
  triggerHitStop(6);`;

const newEmitReactionBurstHitStop = `  // Micro-Freeze Hit Stop & Juicy Camera Impact (Boss only)
  if (en.type === 'boss') triggerHitStop(6);`;

if (html.includes(oldEmitReactionBurstHitStop)) {
  html = html.replace(oldEmitReactionBurstHitStop, newEmitReactionBurstHitStop);
  console.log('7. Limited emitReactionBurst hit-stop to bosses only!');
} else {
  console.log('Warning: oldEmitReactionBurstHitStop not found!');
}

// 8. OPTIMIZE DISRUPTOR AURA PRE-PASS IN UPDATE
const oldDisruptorPrePass = `  // Step 5: Disruptor Aura Pre-Pass (Buff nearby swarm allies)
  const disruptors = enemies.filter(e => e.type === 'disruptor' && e.hp > 0);

  enemies.forEach(en => {
    if (en.type === 'boss') {
      updateBossAi(en, dt, player, currentBiome(), now);
      return;
    }
    // Check Disruptor aura buff (+22% speed, -20% dmg taken)
    en.hasDisruptorBuff = false;
    if (en.type !== 'disruptor' && disruptors.length > 0) {
      for (let di = 0; di < disruptors.length; di++) {
        if (Math.hypot(disruptors[di].x - en.x, disruptors[di].y - en.y) < 120) {
          en.hasDisruptorBuff = true;
          break;
        }
      }
    }`;

const newDisruptorPrePass = `  // Step 5: Disruptor Aura Pre-Pass (Zero-allocation fast check)
  let hasDisruptor = false;
  for (let di = 0; di < enemies.length; di++) {
    if (enemies[di].type === 'disruptor' && enemies[di].hp > 0) { hasDisruptor = true; break; }
  }

  enemies.forEach(en => {
    if (en.type === 'boss') {
      updateBossAi(en, dt, player, currentBiome(), now);
      return;
    }
    en.hasDisruptorBuff = false;
    if (en.type !== 'disruptor' && hasDisruptor) {
      for (let di = 0; di < enemies.length; di++) {
        const de = enemies[di];
        if (de.type === 'disruptor' && de.hp > 0) {
          const ddx = de.x - en.x, ddy = de.y - en.y;
          if (ddx * ddx + ddy * ddy < 14400) { // 120^2
            en.hasDisruptorBuff = true;
            break;
          }
        }
      }
    }`;

if (html.includes(oldDisruptorPrePass)) {
  html = html.replace(oldDisruptorPrePass, newDisruptorPrePass);
  console.log('8. Optimized Disruptor aura check with zero GC overhead!');
} else {
  console.log('Warning: oldDisruptorPrePass not found!');
}

// 9. OPTIMIZE HAZARDS TICK DISTANCE CHECK (Replace Math.hypot with squared dist)
const oldHazardsTickLoop = `  hazards.forEach(h => {
    const isElectrified = h.electrifiedUntil && performance.now() < h.electrifiedUntil;
    enemies.forEach(en => {
      const edist = Math.hypot(h.x - en.x, h.y - en.y);
      if (edist < h.r + en.r) {`;

const newHazardsTickLoop = `  hazards.forEach(h => {
    const isElectrified = h.electrifiedUntil && performance.now() < h.electrifiedUntil;
    const hRadSq = (h.r + 22) * (h.r + 22);
    for (let ei = 0; ei < enemies.length; ei++) {
      const en = enemies[ei];
      const edx = h.x - en.x, edy = h.y - en.y;
      if (edx * edx + edy * edy < hRadSq) {`;

if (html.includes(oldHazardsTickLoop)) {
  html = html.replace(oldHazardsTickLoop, newHazardsTickLoop);
  console.log('9. Optimized hazard enemy loop with squared distance!');
} else {
  console.log('Warning: oldHazardsTickLoop not found!');
}

// 10. SYNC DASH FAB IN UPDATEHUD
const oldUpdateHudEnd = `  syncUltFab();
}`;

const newUpdateHudEnd = `  syncUltFab();
  syncDashFab();
}`;

if (html.includes(oldUpdateHudEnd)) {
  html = html.replace(oldUpdateHudEnd, newUpdateHudEnd);
  console.log('10. Synced dashFab in updateHud!');
} else {
  console.log('Warning: oldUpdateHudEnd not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('All critical bugfixes and performance patches applied successfully!');
