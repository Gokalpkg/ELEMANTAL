const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// 1. NEUTRALIZE ALL NON-ZERO ctx.shadowBlur ASSIGNMENTS
const shadowMatches = content.match(/ctx\.shadowBlur\s*=\s*([^0;\n]+);/g);
console.log('Replacing non-zero shadowBlur assignments, count:', shadowMatches ? shadowMatches.length : 0);
content = content.replace(/ctx\.shadowBlur\s*=\s*([^0;\n]+);/g, 'ctx.shadowBlur = 0; /* 60fps */');

// 2. REPLACE spawnFloatText WITH CANVAS-NATIVE BATCHER
const spawnFloatTarget = `let _floatCascadeIndex = 0;
function spawnFloatText(x,y,text,color,type) {
  const dmgPref = getDmgNumbersSetting();
  if (dmgPref === 'off') return;
  const isCritCheck = type === 'crit' || (typeof text === 'string' && text.startsWith('!')) || color === '#ffd740' || color === '#ffd700';
  if (dmgPref === 'crit' && !isCritCheck && type !== 'kill' && type !== 'big') return;
  let str = String(text || '').trim();
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

const canvasFloatReplacement = `const _canvasFloatTexts = [];
let _floatCascadeIndex = 0;

function spawnFloatText(x, y, text, color, type) {
  const dmgPref = getDmgNumbersSetting();
  if (dmgPref === 'off') return;
  const isCritCheck = type === 'crit' || (typeof text === 'string' && text.startsWith('!')) || color === '#ffd740' || color === '#ffd700';
  if (dmgPref === 'crit' && !isCritCheck && type !== 'kill' && type !== 'big') return;
  let str = String(text || '').trim();
  if (!str) return;

  const isCrit = type === 'crit' || str.startsWith('!') || color === '#ffd740' || color === '#ffd700';
  const isKill = type === 'kill';
  const isBig = type === 'big' || str.length > 8;
  const isDot = type === 'dot' || type === 'small';

  const now = performance.now();
  // Aggregate rapid consecutive hits on nearly identical location (within 28px and 160ms)
  for (let i = _canvasFloatTexts.length - 1; i >= Math.max(0, _canvasFloatTexts.length - 6); i--) {
    const prev = _canvasFloatTexts[i];
    if (Math.hypot(prev.x - x, prev.y - y) < 28 && (now - prev.birth < 160) && !isCrit && prev.type !== 'kill') {
      const pNum = parseInt(prev.text.replace(/[^0-9]/g, ''), 10);
      const cNum = parseInt(str.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(pNum) && !isNaN(cNum)) {
        prev.text = '-' + (pNum + cNum);
        prev.curLife = prev.maxLife;
        prev.vy = -1.1;
        prev.scale = Math.min(1.4, prev.scale + 0.12);
        return;
      }
    }
  }

  // Strictly cap active float texts to 16 for zero-DOM, buttery smooth 60 FPS
  if (_canvasFloatTexts.length >= 16) {
    _canvasFloatTexts.shift();
  }

  // Fanning arc trajectory
  _floatCascadeIndex = (_floatCascadeIndex + 1) % 7;
  const arcAngles = [-0.65, 0.65, -0.35, 0.35, -0.9, 0.9, 0];
  const arcAng = arcAngles[_floatCascadeIndex];
  const arcDist = isCrit ? 22 : 14;
  const scatterX = Math.sin(arcAng) * arcDist;
  const scatterY = -Math.cos(arcAng) * (arcDist * 0.6) - (isCrit ? 8 : 4);

  const durationFrames = isCrit ? 46 : isBig ? 42 : isKill ? 44 : 32;

  _canvasFloatTexts.push({
    x: x + scatterX,
    y: y + scatterY,
    text: str,
    color: isCrit ? '#ffd700' : (color || '#ffffff'),
    type: type || 'normal',
    isCrit: isCrit,
    birth: now,
    curLife: durationFrames,
    maxLife: durationFrames,
    scale: isCrit ? 1.35 : isBig ? 1.25 : 1.0,
    vy: isCrit ? -1.3 : -0.95
  });
}

function drawCanvasFloatTexts(ctx) {
  if (!_canvasFloatTexts.length) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = _canvasFloatTexts.length - 1; i >= 0; i--) {
    const ft = _canvasFloatTexts[i];
    ft.curLife--;
    ft.y += ft.vy;
    ft.vy *= 0.94;
    if (ft.curLife <= 0) {
      _canvasFloatTexts.splice(i, 1);
      continue;
    }
    const alpha = Math.min(1.0, ft.curLife / (ft.maxLife * 0.28));
    ctx.globalAlpha = alpha;
    const baseSize = ft.isCrit ? 14 : (ft.type === 'big' || ft.type === 'kill') ? 13 : 11;
    ctx.font = '900 ' + Math.round(baseSize * ft.scale) + 'px "Courier New", Courier, monospace';
    // Crisp 2.4px dark outline for crystal-clear readability over any background or boss
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.lineWidth = 2.4;
    ctx.strokeText(ft.text, Math.round(ft.x), Math.round(ft.y));
    // Crisp colored fill
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
  }
  ctx.restore();
}`;

if (content.includes(spawnFloatTarget)) {
  content = content.replace(spawnFloatTarget, canvasFloatReplacement);
  console.log('spawnFloatText replaced with canvas-native batcher!');
} else {
  console.error('ERROR: Could not find spawnFloatTarget in index.html');
}

// 3. HOOK drawCanvasFloatTexts INTO render() BEFORE ctx.restore()
const renderRestoreTarget = `  crystals.forEach(g => {
    const y = pickupY(g);
    pixDisk(g.x, y, 6, '#f3e5ff', '#b388ff', '#6a1b9a');
  });
  ctx.restore();`;

const renderRestoreReplacement = `  crystals.forEach(g => {
    const y = pickupY(g);
    pixDisk(g.x, y, 6, '#f3e5ff', '#b388ff', '#6a1b9a');
  });
  // Canvas-Native Damage Numbers (Zero DOM lag, crystal clear readability)
  drawCanvasFloatTexts(ctx);
  ctx.restore();`;

if (content.includes(renderRestoreTarget)) {
  content = content.replace(renderRestoreTarget, renderRestoreReplacement);
  console.log('drawCanvasFloatTexts hooked into render() successfully!');
} else {
  console.error('ERROR: Could not find renderRestoreTarget');
}

// 4. RESET _canvasFloatTexts IN emptyState()
const emptyStateTarget = `function emptyState() {
  if (typeof statusStore !== 'undefined') statusStore.clearAll();`;
const emptyStateReplacement = `function emptyState() {
  if (typeof _canvasFloatTexts !== 'undefined') _canvasFloatTexts.length = 0;
  if (typeof statusStore !== 'undefined') statusStore.clearAll();`;

if (content.includes(emptyStateTarget)) {
  content = content.replace(emptyStateTarget, emptyStateReplacement);
  console.log('emptyState updated with _canvasFloatTexts cleanup!');
} else {
  console.error('ERROR: Could not find emptyStateTarget');
}

// 5. OVERHAUL drawShot FOR HIGH-CONTRAST BULLET HEAD SILHOUETTE & VISIBILITY
const drawShotTarget = `function drawShot(p, color) {
  // Frustum culling: skip off-screen projectiles immediately
  if (p.x < cam.x - 70 || p.x > cam.x + W + 70 || p.y < cam.y - 70 || p.y > cam.y + H + 70) return;
  const c = visHex(color || p.color, 'shot');
  const ang = p.face != null ? p.face : Math.atan2(p.vy || 0, p.vx || 0);
  const spd = Math.hypot(p.vx || 0, p.vy || 0);
  const combo = p.comboStep || 1;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Kılıç Kesme İzi (3-Hit Combo Slash Trail - Pafta Image 2)
  // Hit 1: Geniş Yatay Kavis, Hit 2: Çapraz Kavis, Hit 3: İleri Delici İki Kat Geniş Kavis!
  const slashRadius = Math.max(13, (p.r || 6) * (combo === 3 ? 2.6 : 2.2));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(ang);

  const arcSpread = combo === 3 ? Math.PI * 0.45 : combo === 2 ? Math.PI * 0.38 : Math.PI * 0.32;
  const arcTilt = combo === 2 ? 0.2 : combo === 1 ? -0.1 : 0;

  // Dış Alevli / Kan Kırmızısı Kavis
  ctx.strokeStyle = combo === 3 ? '#ff1744' : '#ef4444';
  ctx.shadowColor = combo === 3 ? '#ff5252' : '#ff1744';
  ctx.shadowBlur = 0; /* 60fps */
  ctx.lineWidth = combo === 3 ? 5.2 : 4.0;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius, -arcSpread + arcTilt, arcSpread + arcTilt);
  ctx.stroke();

  // İç Akkor Çelik Keskinlik İzi
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = combo === 3 ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius * 0.94, (-arcSpread + arcTilt) * 0.75, (arcSpread + arcTilt) * 0.75);
  ctx.stroke();

  // Elemental Renk Kaplaması
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius * 1.05, -arcSpread * 0.85 + arcTilt, arcSpread * 0.85 + arcTilt);
  ctx.stroke();
  ctx.restore();

  // Darbe Partikülleri (Impact Particles & Motion Crumbs)
  if (spd > 0.3) {
    const crumbN = combo === 3 ? 5 : 3;
    for (let i = 1; i <= crumbN; i++) {
      const px = Math.round(p.x - (p.vx || 0) * i * 0.65);
      const py = Math.round(p.y - (p.vy || 0) * i * 0.65);
      ctx.globalAlpha = 0.5 - i * 0.09;
      ctx.fillStyle = (i === 1) ? '#ffffff' : (combo === 3 ? '#ffd700' : '#ef4444');
      ctx.fillRect(px - 1, py - 1, 3, 3);
    }
  }

  ctx.restore();
}`;

const drawShotReplacement = `function drawShot(p, color) {
  // Frustum culling: skip off-screen projectiles immediately
  if (p.x < cam.x - 70 || p.x > cam.x + W + 70 || p.y < cam.y - 70 || p.y > cam.y + H + 70) return;
  const c = visHex(color || p.color, 'shot');
  const ang = p.face != null ? p.face : Math.atan2(p.vy || 0, p.vx || 0);
  const spd = Math.hypot(p.vx || 0, p.vy || 0);
  const combo = p.comboStep || 1;
  const r = Math.max(7, (p.r || 6) * (combo === 3 ? 1.5 : 1.2));

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(p.x), Math.round(p.y));
  ctx.rotate(ang);

  // 1. DUAL STREAMLINED SPEED TAIL (Aerodynamic flight trajectory)
  const tailLen = Math.max(12, r * (combo === 3 ? 2.4 : 1.8));
  ctx.strokeStyle = c;
  ctx.lineWidth = combo === 3 ? 3.2 : 2.0;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.35);
  ctx.lineTo(-tailLen, 0);
  ctx.lineTo(0, r * 0.35);
  ctx.stroke();

  // Inner White Tracer Core
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = combo === 3 ? 1.8 : 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.18);
  ctx.lineTo(-tailLen * 0.7, 0);
  ctx.lineTo(0, r * 0.18);
  ctx.stroke();

  // 2. COMBO 3 WIDE POWER CRESCENT WINGS
  if (combo === 3) {
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
  }

  // 3. HIGH-CONTRAST BULLET HEAD SILHOUETTE (Diamond Penetrator Head)
  // Layer A: Crisp Dark Outer Border (Instantly pops out on ANY terrain)
  ctx.fillStyle = '#060811';
  ctx.beginPath();
  ctx.moveTo(r + 3, 0); // Tip
  ctx.lineTo(-r * 0.4, -r * 0.85); // Top wing
  ctx.lineTo(-r * 0.2, 0); // Inset
  ctx.lineTo(-r * 0.4, r * 0.85); // Bottom wing
  ctx.closePath();
  ctx.fill();

  // Layer B: Vibrant Elemental Hull
  ctx.fillStyle = combo === 3 ? '#ff3d00' : c;
  ctx.beginPath();
  ctx.moveTo(r + 1.5, 0);
  ctx.lineTo(-r * 0.3, -r * 0.65);
  ctx.lineTo(-r * 0.1, 0);
  ctx.lineTo(-r * 0.3, r * 0.65);
  ctx.closePath();
  ctx.fill();

  // Layer C: Radiant White-Hot Diamond Tip
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(r + 1.5, 0);
  ctx.lineTo(0, -r * 0.3);
  ctx.lineTo(-r * 0.2, 0);
  ctx.lineTo(0, r * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Motion Crumbs (Clean low-particle flight dust)
  if (spd > 0.5 && Math.random() < 0.4) {
    sparks.push({
      x: p.x - (p.vx || 0) * 0.5,
      y: p.y - (p.vy || 0) * 0.5,
      vx: -(p.vx || 0) * 0.08,
      vy: -(p.vy || 0) * 0.08,
      r: 1.5,
      life: 0.18,
      maxLife: 0.18,
      color: combo === 3 ? '#ffd700' : c
    });
  }
}`;

if (content.includes(drawShotTarget)) {
  content = content.replace(drawShotTarget, drawShotReplacement);
  console.log('drawShot replaced with high-contrast diamond projectile system!');
} else {
  console.log('Checking partial drawShotTarget match...');
  const idx = content.indexOf('function drawShot(p, color)');
  if (idx !== -1) {
    const endIdx = content.indexOf('function drawSkillShot(p, time)');
    const oldFn = content.substring(idx, endIdx).trim();
    content = content.replace(oldFn, drawShotReplacement);
    console.log('drawShot replaced by slice search successfully!');
  } else {
    console.error('ERROR: Could not find function drawShot(p, color)');
  }
}

// 6. BOSS FLOATING TEXT POSITION & CRISP HIT FLASH IN COLLISION
const hitEnemyTarget = `        punchEnemy(en, p.x, p.y, crited ? 18 : 10, crited);
        onPlayerHitEnemy(en, { crit: crited, el: p.el, heavy: p.el === 'earth' || p.el === 'fire' });
        if (crited) {
          spawnFloatText(en.x, en.y - 14, dealt + '!', '#ffd700', 'crit');
          playSfx('skill', 0.35, 680);
        } else {
          spawnFloatText(en.x, en.y - 10, '-' + dealt, p.color);
        }`;

const hitEnemyReplacement = `        punchEnemy(en, p.x, p.y, crited ? 18 : 10, crited);
        onPlayerHitEnemy(en, { crit: crited, el: p.el, heavy: p.el === 'earth' || p.el === 'fire' });
        en.flashT = 3; // Crisp hit flash feedback
        // 4-point impact star spark
        sparks.push({
          x: p.x, y: p.y,
          vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
          r: 2.8, life: 0.18, maxLife: 0.18,
          color: '#ffffff'
        });
        // Position damage text cleanly: For bosses, offset to shoulder so face/body is NEVER obscured!
        const floatTx = en.type === 'boss' ? (en.x + en.r * 0.72) : en.x;
        const floatTy = en.type === 'boss' ? (en.y - en.r - 20) : (en.y - 12);
        if (crited) {
          spawnFloatText(floatTx, floatTy, dealt + '!', '#ffd700', 'crit');
          playSfx('skill', 0.35, 680);
        } else {
          spawnFloatText(floatTx, floatTy, '-' + dealt, p.color);
        }`;

if (content.includes(hitEnemyTarget)) {
  content = content.replace(hitEnemyTarget, hitEnemyReplacement);
  console.log('Player projectile collision updated with boss text offset and hit sparks!');
} else {
  console.error('ERROR: Could not find hitEnemyTarget');
}

// 7. SKILL SHOT BOSS FLOATING TEXT POSITION & CRISP HIT FLASH
const skillHitTarget = `        spawnFloatText(en.x, en.y-10, '-'+dealt, p.color);`;
const skillHitReplacement = `        en.flashT = 3;
        const sFloatTx = en.type === 'boss' ? (en.x + en.r * 0.72) : en.x;
        const sFloatTy = en.type === 'boss' ? (en.y - en.r - 20) : (en.y - 12);
        spawnFloatText(sFloatTx, sFloatTy, '-' + dealt, p.color);`;

if (content.includes(skillHitTarget)) {
  content = content.replace(skillHitTarget, skillHitReplacement);
  console.log('Skill shot hit text offset for bosses updated!');
} else {
  console.error('ERROR: Could not find skillHitTarget');
}

// 8. FRUSTUM CULLING FOR STAINS & CAP AT 35
const stainsTarget = `  stains.forEach(s => {
    ctx.save();
    ctx.translate(Math.round(s.x), Math.round(s.y));`;

const stainsReplacement = `  stains.forEach(s => {
    if (s.x < cullL || s.x > cullR || s.y < cullT || s.y > cullB) return;
    ctx.save();
    ctx.translate(Math.round(s.x), Math.round(s.y));`;

if (content.includes(stainsTarget)) {
  content = content.replace(stainsTarget, stainsReplacement);
  console.log('Stains frustum culling applied!');
} else {
  console.error('ERROR: Could not find stainsTarget');
}

// Cap stains to 35
content = content.replace(/while\s*\(\s*stains\.length\s*>\s*120\s*\)\s*stains\.shift\(\);/g, 'while (stains.length > 35) stains.shift();');

// 9. CAP PARTICLES TO 45 AND SPARKS TO 50
content = content.replace(/if\s*\(\s*particles\.length\s*>\s*120\s*\)\s*particles\.splice\(0,\s*particles\.length\s*-\s*120\);/g, 'if (particles.length > 45) particles.splice(0, particles.length - 45);');
content = content.replace(/if\s*\(\s*sparks\.length\s*>\s*150\s*\)\s*sparks\.splice\(0,\s*sparks\.length\s*-\s*150\);/g, 'if (sparks.length > 50) sparks.splice(0, sparks.length - 50);');

// 10. CLAMP DELTA TIME IN loop(ts)
const dtTarget = `let dt = Math.min(2, (now - lastTime) / 16.67);`;
const dtReplacement = `let dt = Math.max(0.4, Math.min(1.6, (now - lastTime) / 16.67));`;
if (content.includes(dtTarget)) {
  content = content.replace(dtTarget, dtReplacement);
  console.log('Loop delta time clamped smoothly between 0.4 and 1.6!');
} else {
  console.error('ERROR: Could not find dtTarget');
}

// Write back to index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully wrote updated index.html! New length:', content.length);
