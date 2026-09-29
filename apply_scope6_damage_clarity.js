const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. SCOPE 6: ADVANCED FLOATING DAMAGE NUMBERS CSS (HIERARCHY & CRIT POP)
// -------------------------------------------------------------
const oldCssBlock = `  #floatingTexts { position:absolute; inset:0; pointer-events:none; }
  .float-txt { position:absolute; font-weight:800; font-size:11px; opacity:0.75; text-shadow:0 1px 3px rgba(0,0,0,0.9); animation:floatUp 0.7s ease-out forwards; pointer-events:none; }
  .float-txt.crit { font-weight:900; font-size:23px; opacity:1.0; animation:floatCrit 0.95s cubic-bezier(.22,1,.36,1) forwards; color:#ffd740 !important; text-shadow:0 0 14px rgba(255,215,64,0.9), 0 2px 8px #000; z-index:10; }
  .float-txt.big { font-size:17px; opacity:0.9; }
  .float-txt.kill { font-size:16px; opacity:0.95; animation:floatKill 0.85s cubic-bezier(.22,1,.36,1) forwards; }
  #gameOverText { white-space:pre-line; font-size:13px; }
  @keyframes floatUp { 0% {opacity:1; transform:translateY(0) scale(1.15);} 15% {opacity:1; transform:translateY(-6px) scale(1);} 100% {opacity:0; transform:translateY(-38px) scale(.85);} }
  @keyframes floatCrit { 0% {opacity:1; transform:translateY(0) scale(1.85) rotate(-4deg);} 14% {opacity:1; transform:translateY(-8px) scale(1.2) rotate(2deg);} 100% {opacity:0; transform:translateY(-54px) scale(.75) rotate(0deg);} }
  @keyframes floatBig { 0% {opacity:1; transform:translateY(0) scale(1.4);} 15% {opacity:1; transform:translateY(-6px) scale(1.05);} 100% {opacity:0; transform:translateY(-52px) scale(.8);} }`;

const newCssBlock = `  #floatingTexts { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:9; }
  .float-txt {
    position:absolute;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight:900;
    font-size:14px;
    letter-spacing:-0.2px;
    opacity:1;
    pointer-events:none;
    text-shadow:0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000;
    -webkit-text-stroke:0.8px rgba(0,0,0,0.85);
    animation:floatUp 0.68s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    will-change:transform, opacity;
  }
  .float-txt.dot {
    font-size:11.5px;
    font-weight:800;
    opacity:0.88;
    -webkit-text-stroke:0.5px rgba(0,0,0,0.7);
    text-shadow:0 1px 3px rgba(0,0,0,0.9);
    animation:floatDot 0.6s ease-out forwards;
  }
  .float-txt.crit {
    font-size:24px;
    font-weight:900;
    color:#facc15 !important;
    text-shadow:0 0 16px rgba(250,204,21,0.95), 0 0 8px rgba(245,158,11,0.9), 0 2px 4px #000;
    -webkit-text-stroke:1.6px #000;
    animation:floatCrit 0.95s cubic-bezier(0.2, 1.25, 0.3, 1) forwards;
    z-index:20;
    filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8));
  }
  .float-txt.big {
    font-size:18px;
    font-weight:900;
    letter-spacing:0.5px;
    text-shadow:0 0 12px rgba(255,255,255,0.7), 0 2px 6px #000;
    -webkit-text-stroke:1.2px #000;
    animation:floatBig 0.85s cubic-bezier(0.2, 1.15, 0.35, 1) forwards;
    z-index:15;
  }
  .float-txt.kill {
    font-size:15px;
    font-weight:900;
    color:#e2e8f0;
    -webkit-text-stroke:1.0px #000;
    animation:floatKill 0.75s ease-out forwards;
  }
  #gameOverText { white-space:pre-line; font-size:13px; }
  @keyframes floatUp {
    0% { opacity:0; transform:translate3d(0, 4px, 0) scale(0.75); }
    18% { opacity:1; transform:translate3d(var(--drift-x, 0px), -10px, 0) scale(1.15); }
    35% { transform:translate3d(var(--drift-x, 0px), -16px, 0) scale(1.0); }
    75% { opacity:1; transform:translate3d(var(--drift-x, 0px), -32px, 0) scale(0.92); }
    100% { opacity:0; transform:translate3d(var(--drift-x, 0px), -44px, 0) scale(0.78); }
  }
  @keyframes floatDot {
    0% { opacity:0; transform:translateY(2px) scale(0.8); }
    20% { opacity:1; transform:translateY(-6px) scale(1.05); }
    80% { opacity:0.85; transform:translateY(-22px) scale(0.92); }
    100% { opacity:0; transform:translateY(-32px) scale(0.75); }
  }
  @keyframes floatCrit {
    0% { opacity:0; transform:translate3d(0, 6px, 0) scale(0.5) rotate(-6deg); }
    16% { opacity:1; transform:translate3d(var(--drift-x, 0px), -12px, 0) scale(1.9) rotate(3deg); filter:brightness(1.5); }
    32% { transform:translate3d(var(--drift-x, 0px), -18px, 0) scale(1.35) rotate(-2deg); filter:brightness(1.1); }
    75% { opacity:1; transform:translate3d(var(--drift-x, 0px), -42px, 0) scale(1.08) rotate(0deg); }
    100% { opacity:0; transform:translate3d(var(--drift-x, 0px), -62px, 0) scale(0.72) rotate(0deg); }
  }
  @keyframes floatBig {
    0% { opacity:0; transform:translateY(4px) scale(0.7); }
    18% { opacity:1; transform:translateY(-10px) scale(1.35); }
    80% { opacity:1; transform:translateY(-38px) scale(1.0); }
    100% { opacity:0; transform:translateY(-54px) scale(0.8); }
  }
  @keyframes floatKill {
    0% { opacity:0; transform:scale(0.8); }
    20% { opacity:1; transform:translateY(-8px) scale(1.15); }
    100% { opacity:0; transform:translateY(-36px) scale(0.85); }
  }`;

if (html.includes(oldCssBlock)) {
  html = html.replace(oldCssBlock, newCssBlock);
  changes++;
  console.log('[1] Replaced Floating Text CSS with Pop & Shake and Typography Hierarchy');
} else {
  console.warn('[1] Warning: oldCssBlock not found');
}

// -------------------------------------------------------------
// 2. SCOPE 6: CASCADING FOUNTAIN ARC TRAJECTORY IN spawnFloatText
// -------------------------------------------------------------
const oldSpawnFloat = `function spawnFloatText(x,y,text,color,type) {
  const dmgPref = getDmgNumbersSetting();
  if (dmgPref === 'off') return;
  const isCritCheck = type === 'crit' || (typeof text === 'string' && text.startsWith('!')) || color === '#ffd740';
  if (dmgPref === 'crit' && !isCritCheck && type !== 'kill' && type !== 'big') return;
  let str = String(text || '')
    .replace(/[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{FE00}-\\u{FE0F}]/gu, '')
    .replace(/\\s+/g, ' ')
    .trim();
  if (!str) return;

  const el = document.createElement('div');
  const isCrit = type === 'crit' || str.startsWith('!') || color === '#ffd740';
  const isKill = type === 'kill';
  const isBig = type === 'big' || str.length > 8;
  
  el.className = 'float-txt' + (isCrit ? ' crit' : isKill ? ' kill' : isBig ? ' big' : '');
  el.textContent = str;
  el.style.color = color || '#fff';
  
  const rect = canvas.getBoundingClientRect();
  // Cascading scatter: staggered upward-fanning trajectory
  const cascadeSeed = performance.now() * 0.01;
  const scatterX = Math.sin(cascadeSeed) * 18;
  const scatterY = -Math.abs(Math.cos(cascadeSeed)) * 12 - (isCrit ? 8 : 0);
  el.style.left = ((toSX(x + scatterX) / W) * rect.width) + 'px';
  el.style.top = ((toSY(y + scatterY) / H) * rect.height) + 'px';
  
  const cont = document.getElementById('floatingTexts');
  if (cont) {
    if (!isCrit && !isKill && cont.childElementCount > 16) {
      const first = cont.firstElementChild;
      if (first) first.remove();
    }
    cont.appendChild(el);
  }
  setTimeout(() => el.remove(), isCrit ? 950 : 700);
}`;

const newSpawnFloat = `let _floatCascadeIndex = 0;
function spawnFloatText(x,y,text,color,type) {
  const dmgPref = getDmgNumbersSetting();
  if (dmgPref === 'off') return;
  const isCritCheck = type === 'crit' || (typeof text === 'string' && text.startsWith('!')) || color === '#ffd740' || color === '#ffd700';
  if (dmgPref === 'crit' && !isCritCheck && type !== 'kill' && type !== 'big') return;
  let str = String(text || '')
    .replace(/[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{FE00}-\\u{FE0F}]/gu, '')
    .replace(/\\s+/g, ' ')
    .trim();
  if (!str) return;

  const el = document.createElement('div');
  const isCrit = type === 'crit' || str.startsWith('!') || color === '#ffd740' || color === '#ffd700';
  const isKill = type === 'kill';
  const isBig = type === 'big' || str.length > 8;
  const isDot = type === 'dot' || type === 'small';
  
  el.className = 'float-txt' + (isCrit ? ' crit' : isKill ? ' kill' : isBig ? ' big' : isDot ? ' dot' : ' normal');
  el.textContent = str;
  el.style.color = isCrit ? '#ffd700' : (color || '#fff');
  
  const rect = canvas.getBoundingClientRect();
  // SCOPE 6: Cascading Fanning Arc Trajectory
  // Rotates through 7 staggered fountain slots (-28px to +28px) so damage numbers cascade in a clean arc
  _floatCascadeIndex = (_floatCascadeIndex + 1) % 7;
  const arcAngles = [-0.7, 0.7, -0.4, 0.4, -0.95, 0.95, 0];
  const arcAng = arcAngles[_floatCascadeIndex];
  const arcDist = isCrit ? 26 : 18;
  const scatterX = Math.sin(arcAng) * arcDist;
  const scatterY = -Math.cos(arcAng) * (arcDist * 0.7) - (isCrit ? 10 : 4);

  el.style.setProperty('--drift-x', (scatterX * 0.85) + 'px');
  el.style.left = ((toSX(x + scatterX) / W) * rect.width) + 'px';
  el.style.top = ((toSY(y + scatterY) / H) * rect.height) + 'px';
  
  const cont = document.getElementById('floatingTexts');
  if (cont) {
    // Keep DOM clean & fast: Max 20 active float elements on screen
    while (cont.childElementCount >= 20) {
      if (cont.firstElementChild) cont.firstElementChild.remove();
      else break;
    }
    cont.appendChild(el);
  }
  setTimeout(() => el.remove(), isCrit ? 950 : isBig ? 850 : 680);
}`;

if (html.includes(oldSpawnFloat)) {
  html = html.replace(oldSpawnFloat, newSpawnFloat);
  changes++;
  console.log('[2] Updated spawnFloatText with 7-Slot Fanning Arc and DOM Limiter');
} else {
  console.warn('[2] Warning: oldSpawnFloat not found');
}

// -------------------------------------------------------------
// 3. SCOPE 6: DOT DAMAGE BATCHING FOR BURN & POISON
// -------------------------------------------------------------
const oldDotLoop = `  enemies.forEach(en => {
    if (en.burnUntil && now < en.burnUntil) {
      en.burnTick = (en.burnTick || 0) - dt;
      if (en.burnTick <= 0) {
        const burnDmg = Math.max(1, Math.round((en.hitDmgRef || 8) * 0.22 * (en.burnStack || 1) + (modValue('ember') || 0) + synN('ember')));
        takeDamage(en, burnDmg, 'fire', { quiet: true, noReact: true });
        en.burnTick = synN('ember') ? 24 : 30;
        spawnFloatText(en.x, en.y-10, '-' + burnDmg, '#ff8a65');
        burst(en.x, en.y, '#ff8a65', 3, 1.2);
      }
    }
    if (en.poisonUntil && now < en.poisonUntil) {
      en.poisonTick = (en.poisonTick || 0) - dt;
      if (en.poisonTick <= 0) {
        const poiDmg = Math.max(1, Math.round((en.hitDmgRef || 8) * 0.14 * (en.poisonStack || 1)));
        takeDamage(en, poiDmg, 'nature', { quiet: true, noReact: true });
        en.poisonTick = 45;
        spawnFloatText(en.x, en.y-8, '-' + poiDmg, '#84cc16');
      }
    }
  });`;

const newDotLoop = `  enemies.forEach(en => {
    if (en.burnUntil && now < en.burnUntil) {
      en.burnTick = (en.burnTick || 0) - dt;
      if (en.burnTick <= 0) {
        const burnDmg = Math.max(1, Math.round((en.hitDmgRef || 8) * 0.22 * (en.burnStack || 1) + (modValue('ember') || 0) + synN('ember')));
        takeDamage(en, burnDmg, 'fire', { quiet: true, noReact: true });
        en.burnTick = synN('ember') ? 24 : 30;
        
        // SCOPE 6: DOT Batching (Hasar Birleştirme) - Ekranı temiz tutup tok hasar basar
        en._burnBatch = (en._burnBatch || 0) + burnDmg;
        en._burnBatchTimer = (en._burnBatchTimer || 0) + 1;
        if (en._burnBatchTimer >= 2 || en._burnBatch >= 12) {
          spawnFloatText(en.x, en.y - 10, '-' + en._burnBatch, '#ff8a65', 'dot');
          en._burnBatch = 0;
          en._burnBatchTimer = 0;
        }
        burst(en.x, en.y, '#ff8a65', 3, 1.2);
      }
    }
    if (en.poisonUntil && now < en.poisonUntil) {
      en.poisonTick = (en.poisonTick || 0) - dt;
      if (en.poisonTick <= 0) {
        const poiDmg = Math.max(1, Math.round((en.hitDmgRef || 8) * 0.14 * (en.poisonStack || 1)));
        takeDamage(en, poiDmg, 'nature', { quiet: true, noReact: true });
        en.poisonTick = 45;

        // SCOPE 6: Poison DOT Batching
        en._poiBatch = (en._poiBatch || 0) + poiDmg;
        en._poiBatchTimer = (en._poiBatchTimer || 0) + 1;
        if (en._poiBatchTimer >= 2 || en._poiBatch >= 10) {
          spawnFloatText(en.x, en.y - 8, '-' + en._poiBatch, '#84cc16', 'dot');
          en._poiBatch = 0;
          en._poiBatchTimer = 0;
        }
      }
    }
  });`;

if (html.includes(oldDotLoop)) {
  html = html.replace(oldDotLoop, newDotLoop);
  changes++;
  console.log('[3] Applied DOT Damage Batching to Burn and Poison ticks');
} else {
  console.warn('[3] Warning: oldDotLoop not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Scope 6 apply script. Total successful patches: ${changes}/3`);
