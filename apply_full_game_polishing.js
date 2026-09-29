const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. ADVANCED 3-HIT COMBO IN firePlayerProjectile & pushAutoShot
// Pafta: media_1790028339940.jpg (Attack Combo - 3 hit, Slash VFX, Recoil)
// =========================================================================
const oldFireProj = `function firePlayerProjectile() {
  const auto = currentAuto();
  const isSniperStance = modLv('sniper') > 0 && !player.moving;
  const autoRange = (auto.range || AUTO_X) * (isSniperStance ? 2.0 : 1.0);
  let target = nearestEnemyInRange(autoRange);`;

const newFireProj = `function firePlayerProjectile() {
  const auto = currentAuto();
  const isSniperStance = modLv('sniper') > 0 && !player.moving;
  const autoRange = (auto.range || AUTO_X) * (isSniperStance ? 2.0 : 1.0);
  let target = nearestEnemyInRange(autoRange);

  // 3-Hit Kılıç Kombo Döngüsü (Pafta: Attack Combo - 3 hit)
  const now = performance.now();
  if (player.lastAttackTime && (now - player.lastAttackTime > 1200)) {
    player.comboStep = 0;
  }
  player.lastAttackTime = now;
  player.comboStep = ((player.comboStep || 0) % 3) + 1;
  player.atkSlashFx = 16;`;

if (html.includes(oldFireProj)) {
  html = html.replace(oldFireProj, newFireProj);
  console.log('1. Successfully added 3-Hit Combo tracking to firePlayerProjectile!');
} else {
  console.log('Warning: oldFireProj not found!');
}

const oldPushAutoShot = `function pushAutoShot(ang, auto, extra) {
  const spd = (extra && extra.speed) || auto.speed;
  const r = (extra && extra.r) || auto.r;
  const dmg = (extra && extra.dmg) || auto.dmg;
  const isAnti = modLv('antimatter') > 0;
  playerProjectiles.push({
    x: player.x + Math.cos(ang)*10, y: player.y + Math.sin(ang)*10,
    vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
    r: isAnti ? r + 2 : r, dmg,
    color: isAnti ? '#c084fc' : ((extra && extra.color) || auto.color),
    effects: extra && extra.effects ? extra.effects : auto.effects,
    life: 1,
    pierce: isAnti ? 999 : (pierceCount() + (extra && extra.pierce ? extra.pierce : 0)),
    ricochet: extra && extra.ricochet != null ? extra.ricochet : (modValue('ricochet') || 0),
    home: extra && extra.home,
    face: ang,
    hit: new Set(),
    ox: player.x, oy: player.y,
    maxDist: (extra && extra.range != null ? extra.range : (auto.range || AUTO_X)) * (modLv('sniper') > 0 && !player.moving ? 2.0 : 1.0),
    el: extra && extra.el,
    fuse: extra && extra.fuse,
    special: extra && extra.special,
    targetEn: extra && extra.targetEn,
    ambushMul: extra && extra.ambushMul
  });
}`;

const newPushAutoShot = `function pushAutoShot(ang, auto, extra) {
  const spd = (extra && extra.speed) || auto.speed;
  const r = (extra && extra.r) || auto.r;
  const dmg = (extra && extra.dmg) || auto.dmg;
  const isAnti = modLv('antimatter') > 0;
  const combo = player.comboStep || 1;
  playerProjectiles.push({
    x: player.x + Math.cos(ang)*10, y: player.y + Math.sin(ang)*10,
    vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
    r: isAnti ? r + 2 : r, dmg,
    color: isAnti ? '#c084fc' : ((extra && extra.color) || auto.color),
    effects: extra && extra.effects ? extra.effects : auto.effects,
    life: 1,
    pierce: isAnti ? 999 : (pierceCount() + (extra && extra.pierce ? extra.pierce : 0)),
    ricochet: extra && extra.ricochet != null ? extra.ricochet : (modValue('ricochet') || 0),
    home: extra && extra.home,
    face: ang,
    comboStep: combo,
    hit: new Set(),
    ox: player.x, oy: player.y,
    maxDist: (extra && extra.range != null ? extra.range : (auto.range || AUTO_X)) * (modLv('sniper') > 0 && !player.moving ? 2.0 : 1.0),
    el: extra && extra.el,
    fuse: extra && extra.fuse,
    special: extra && extra.special,
    targetEn: extra && extra.targetEn,
    ambushMul: extra && extra.ambushMul
  });
}`;

if (html.includes(oldPushAutoShot)) {
  html = html.replace(oldPushAutoShot, newPushAutoShot);
  console.log('2. Successfully passed comboStep to pushAutoShot!');
} else {
  console.log('Warning: oldPushAutoShot not found!');
}

// =========================================================================
// 2. ENHANCE 3-HIT SLASH TRAIL VFX IN drawShot
// =========================================================================
const oldDrawShotStart = 'function drawShot(p, color) {';
const oldDrawShotEnd = 'function drawSkillShot(p, time) {';

const new3HitDrawShot = `function drawShot(p, color) {
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
  ctx.shadowBlur = combo === 3 ? 14 : 9;
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
}

`;

const ds1 = html.indexOf(oldDrawShotStart);
const ds2 = html.indexOf(oldDrawShotEnd);
if (ds1 !== -1 && ds2 !== -1) {
  html = html.slice(0, ds1) + new3HitDrawShot + html.slice(ds2);
  console.log('3. Successfully upgraded drawShot to authentic 3-hit combo visual arcs!');
} else {
  console.log('Warning: drawShot bounds not found!');
}

// =========================================================================
// 3. RECOIL VISUAL FLASH & RETRACTION IN damagePlayer
// Pafta: media_1790028339940.jpg (Recoil on damage)
// =========================================================================
const oldDmgCall = '  player.invuln = 56;';
const newDmgCall = `  player.invuln = 56;
  player.recoilT = 14;`;

if (html.includes(oldDmgCall)) {
  html = html.replace(oldDmgCall, newDmgCall);
  console.log('4. Successfully added recoilT to damagePlayer!');
} else {
  console.log('Warning: oldDmgCall not found!');
}

// =========================================================================
// 4. MEDIEVAL FANTASY HUD UPGRADE (HEALTH BAR & MANA/XP BAR)
// Pafta: media_1790028339940.jpg (Hero Health Bar with Heart Orb & Ornate Metallic Frame)
// =========================================================================
const oldMeterCss = `  .meter-pill {
    flex:1; display:flex; align-items:center; gap:6px;
    background:rgba(20,24,34,0.85); border:1px solid rgba(255,255,255,0.08);
    border-radius:999px; padding:3px 8px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
    min-width:0;
  }
  .meter-icon { font-size:11px; line-height:1; }
  .meter-track { flex:1; height:9px; background:#141720; border-radius:999px; overflow:hidden; position:relative; }
  .meter-fill { height:100%; border-radius:inherit; transition: width 0.18s ease; }
  .meter-fill.hp-fill { background:linear-gradient(90deg,#ff4d5a,#ff8a80); box-shadow:0 0 6px rgba(255,77,90,.4); }
  .meter-fill.xp-fill { background:linear-gradient(90deg,#ffd740,#ffe082); box-shadow:0 0 6px rgba(255,215,64,.4); }
  .meter-val { font-size:10px; font-weight:800; color:#fff; min-width:32px; text-align:right; font-variant-numeric: tabular-nums; }
  .meter-sub { font-size:9px; opacity:0.75; font-weight:700; margin-left:-2px; }
  .meter-pill.wave-pill { flex: 0 0 auto; min-width: 58px; justify-content: center; background: rgba(30, 36, 52, 0.9); border-color: rgba(255, 215, 64, 0.3); }`;

const newMeterCss = `  .meter-pill {
    flex:1; display:flex; align-items:center; gap:7px;
    background: linear-gradient(180deg, #1e293b, #0f172a);
    border: 2px solid #475569;
    border-radius: 12px; padding: 4px 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
    min-width:0;
  }
  .meter-icon { font-size:14px; line-height:1; filter: drop-shadow(0 0 4px rgba(255,23,68,0.6)); }
  .meter-track { flex:1; height:12px; background:#090d16; border-radius:6px; overflow:hidden; position:relative; border: 1px solid #1e293b; }
  .meter-fill { height:100%; border-radius:inherit; transition: width 0.18s ease; }
  .meter-fill.hp-fill { background: linear-gradient(90deg, #991b1b, #ef4444, #f87171); box-shadow: 0 0 8px rgba(239,68,68,0.6); }
  .meter-fill.xp-fill { background: linear-gradient(90deg, #0369a1, #0284c7, #38bdf8); box-shadow: 0 0 8px rgba(56,189,248,0.6); }
  .meter-val { font-size:11px; font-weight:900; color:#fff; min-width:34px; text-align:right; font-variant-numeric: tabular-nums; text-shadow: 0 1px 2px #000; }
  .meter-sub { font-size:10px; opacity:0.85; font-weight:800; margin-left:-2px; color:#38bdf8; }
  .meter-pill.wave-pill { flex: 0 0 auto; min-width: 64px; justify-content: center; background: linear-gradient(180deg, #272115, #14110b); border: 2px solid #b45309; }`;

if (html.includes(oldMeterCss)) {
  html = html.replace(oldMeterCss, newMeterCss);
  console.log('5. Successfully upgraded HUD Health Bar & Mana Bar to fantasy medieval design!');
} else {
  console.log('Warning: oldMeterCss not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
