const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. COMPLETE REWORK OF ANA KARAKTER (MAIN HERO KNIGHT) IN drawHeroPlayer
// Based on Pafta: media_1790028339940.jpg (Hero Assets, Armor, Broadsword, Shield, Walk Cycle)
// =========================================================================
const heroStart = 'function drawHeroPlayer(ctx, px, py, pcy, player, time, sk, hopP) {';
const heroEnd = 'function drawShot(p, color) {';

const newHeroPlayerCode = `function drawHeroPlayer(ctx, px, py, pcy, player, time, sk, hopP) {
  const pcol = visHex(sk.hex, 'char');
  const isMoving = player.moving;
  const faceAng = player.facing || 0;
  const isFacingLeft = Math.cos(faceAng) < 0;

  // 1. Zırhlı Bacaklar Yürüme/Koşma Döngüsü (Hero Movement Cycle - Pafta Image 2)
  const walkSpeed = isMoving ? 0.35 : 0.08;
  const walkPhase = (player.walkTimer || time * walkSpeed);
  const legSwing = isMoving ? Math.sin(walkPhase) * 6 : Math.sin(time * 0.12) * 1.5;
  const bodyBob = isMoving ? Math.abs(Math.cos(walkPhase)) * 2.5 : Math.sin(time * 0.15) * 1.2;
  const cy = pcy - bodyBob;

  ctx.save();

  // Magical Ground Light Aura under player
  const auraG = ctx.createRadialGradient(px, py + 4, 2, px, py + 4, player.r + 14);
  auraG.addColorStop(0, pcol + '44');
  auraG.addColorStop(0.6, pcol + '18');
  auraG.addColorStop(1, 'transparent');
  ctx.fillStyle = auraG;
  ctx.beginPath();
  ctx.arc(px, py + 4, player.r + 14, 0, Math.PI * 2);
  ctx.fill();

  // Dynamic Kill-Streak Aura (Rotating energy)
  if (killCombo >= 5) {
    const streakCol = killCombo >= 25 ? '#ffd700' : killCombo >= 15 ? '#ff1744' : killCombo >= 10 ? '#facc15' : '#ff6b4a';
    const streakR = player.r + 12 + Math.sin(time * 0.3) * 3;
    ctx.strokeStyle = streakCol;
    ctx.shadowColor = streakCol;
    ctx.shadowBlur = 14;
    ctx.lineWidth = killCombo >= 15 ? 3.5 : 2.5;
    ctx.setLineDash(killCombo >= 15 ? [6, 4] : [8, 6]);
    ctx.beginPath();
    ctx.arc(px, py + 2, streakR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }

  // Focus Mode Aura when stationary
  if (!isMoving) {
    const pulse = 1 + Math.sin(time * 0.25) * 0.08;
    ctx.strokeStyle = pcol;
    ctx.shadowColor = pcol;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.65 + Math.sin(time * 0.2) * 0.25;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(px, py + 2, (player.r + 9) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
  }

  // 2. Kırmızı Boyun Atkısı & Pelerin (Red Flowing Scarf - Pafta Image 2)
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.25) * 0.25;
  const capeLen = isMoving ? 20 : 14;
  ctx.fillStyle = '#991b1b'; // Koyu kırmızı astar
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 6, cy + 2);
  ctx.lineTo(px + Math.cos(capeAng - 0.45) * (capeLen + 3), cy + 4 + Math.sin(capeAng - 0.45) * (capeLen * 0.7));
  ctx.lineTo(px + Math.cos(capeAng + 0.45) * (capeLen + 5), cy + 6 + Math.sin(capeAng + 0.45) * (capeLen * 0.7));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ef4444'; // Parlak kırmızı atkı
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 5, cy);
  ctx.lineTo(px + Math.cos(capeAng - 0.3) * capeLen, cy + 3 + Math.sin(capeAng - 0.3) * (capeLen * 0.6));
  ctx.lineTo(px + Math.cos(capeAng + 0.3) * (capeLen + 2), cy + 5 + Math.sin(capeAng + 0.3) * (capeLen * 0.6));
  ctx.closePath();
  ctx.fill();

  // 3. Zırhlı Çizmeli Bacaklar (Armored Boots Walk Cycle)
  const legY = cy + player.r * 0.65;
  const footL_x = px - 5 - legSwing * 0.8;
  const footR_x = px + 5 + legSwing * 0.8;
  const footL_y = legY + Math.max(0, -legSwing * 0.5);
  const footR_y = legY + Math.max(0, legSwing * 0.5);

  // Sol ve Sağ Çizme (Çelik zırh plakaları)
  ctx.fillStyle = '#475569';
  ctx.fillRect(Math.round(footL_x) - 3, Math.round(footL_y), 7, 6);
  ctx.fillRect(Math.round(footR_x) - 3, Math.round(footR_y), 7, 6);
  ctx.fillStyle = '#94a3b8'; // Metalik parlama
  ctx.fillRect(Math.round(footL_x) - 3, Math.round(footL_y), 7, 2);
  ctx.fillRect(Math.round(footR_x) - 3, Math.round(footR_y), 7, 2);

  // 4. Çelik Göğüs Zırhı (Steel Breastplate)
  drawBall3d(px, cy, player.r, '#64748b', 6 + hopP);
  // Zırh ön plakası ve altın toka
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(px, cy + 2, player.r * 0.72, player.r * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Altın Zırh Arması / Çekirdek
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(px, cy + 1, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 5. Çelik Şövalye Miğferi (Visor Knight Helmet - Pafta Image 2)
  const helmY = cy - player.r * 0.45;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(px, helmY, player.r * 0.82, Math.PI, 0);
  ctx.lineTo(px + player.r * 0.82, helmY + player.r * 0.4);
  ctx.lineTo(px - player.r * 0.82, helmY + player.r * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Miğfer Üst Tepe Arması (Helmet Crest / Red Plume)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(px - 2, helmY - player.r * 0.8);
  ctx.lineTo(px + 2, helmY - player.r * 0.8);
  ctx.lineTo(px - Math.cos(faceAng) * 8, helmY - player.r * 1.25);
  ctx.closePath();
  ctx.fill();

  // Vizör Yarığı ve Parlayan Bakış
  const lookX = px + Math.cos(faceAng) * 4;
  const lookY = helmY + Math.sin(faceAng) * 2 + 1;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(Math.round(lookX - 5), Math.round(lookY - 1.5), 10, 3);
  // Vizör içi parıldayan kahraman gözleri (Cyan/White)
  ctx.fillStyle = '#00e5ff';
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 6;
  ctx.fillRect(Math.round(lookX - 3), Math.round(lookY - 1), 2, 2);
  ctx.fillRect(Math.round(lookX + 1), Math.round(lookY - 1), 2, 2);
  ctx.shadowBlur = 0;

  // 6. Kalkan ve Geniş Çelik Kılıç (Broadsword & Round Shield - Pafta Image 2)
  const swordAng = faceAng + (player.atkSlashFx > 0 ? (player.atkSlashFx * 0.2) : 0);
  const swordHandX = px + Math.cos(faceAng + 0.8) * (player.r + 4);
  const swordHandY = cy + Math.sin(faceAng + 0.8) * (player.r + 4);

  // Sağ El: Geniş Çelik Kılıç (Broadsword)
  ctx.save();
  ctx.translate(swordHandX, swordHandY);
  ctx.rotate(swordAng);
  // Kabza & Altın Balçak
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-3, -2, 4, 4);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(1, -5, 3, 10);
  // Çift taraflı çelik kılıç namlusu
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(4, -3);
  ctx.lineTo(22, -2.5);
  ctx.lineTo(26, 0);
  ctx.lineTo(22, 2.5);
  ctx.lineTo(4, 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff'; // Keskin çelik kenar parıltısı
  ctx.fillRect(4, -1, 19, 2);
  ctx.restore();

  // Sol El: Yuvarlak Ahşap-Çelik Kalkan (Round Shield)
  const shieldX = px + Math.cos(faceAng - 0.9) * (player.r + 2);
  const shieldY = cy + Math.sin(faceAng - 0.9) * (player.r + 2);
  ctx.fillStyle = '#1e293b'; // Dış demir çember
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#991b1b'; // Kırmızı kalkan deseni
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b'; // Altın kalkan göbeği (Boss)
  ctx.beginPath();
  ctx.arc(shieldX, shieldY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

`;

const hIdx1 = html.indexOf(heroStart);
const hIdx2 = html.indexOf(heroEnd);
if (hIdx1 !== -1 && hIdx2 !== -1) {
  html = html.slice(0, hIdx1) + newHeroPlayerCode + html.slice(hIdx2);
  console.log('1. Successfully reworked Main Hero Player into full Knight with Broadsword & Shield!');
} else {
  console.log('Warning: Hero player function markers not found!');
}

// =========================================================================
// 2. KILIÇ KESME İZİ (SLASH TRAIL VFX) & DARBE PARTİKÜLLERİ IN drawShot
// Based on Pafta: media_1790028339940.jpg (Slash Trail, Impact Particles)
// =========================================================================
const oldDrawShotStart = 'function drawShot(p, color) {';
const oldDrawShotEnd = 'function drawSkillShot(p, time) {';

const newDrawShotCode = `function drawShot(p, color) {
  const c = visHex(color || p.color, 'shot');
  const ang = p.face != null ? p.face : Math.atan2(p.vy || 0, p.vx || 0);
  const spd = Math.hypot(p.vx || 0, p.vy || 0);

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Kılıç Kesme İzi (Curved Crescent Slash Trail - Pafta Image 2)
  const slashRadius = Math.max(12, (p.r || 6) * 2.2);
  const trailAng = ang;

  // Hilal Şeklinde Kavisli Kılıç Kesme Arkı
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(trailAng);

  // Dış Alevli / Kan Kırmızısı Kavis
  ctx.strokeStyle = '#ef4444';
  ctx.shadowColor = '#ff1744';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();

  // İç Akkor Çelik Keskinlik İzi
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius * 0.95, -Math.PI * 0.28, Math.PI * 0.28);
  ctx.stroke();

  // Elemental Renk Kaplaması
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, slashRadius * 1.05, -Math.PI * 0.32, Math.PI * 0.32);
  ctx.stroke();
  ctx.restore();

  // Darbe Partikülleri (Impact Particles & Motion Crumbs)
  if (spd > 0.3) {
    for (let i = 1; i <= 3; i++) {
      const px = Math.round(p.x - (p.vx || 0) * i * 0.7);
      const py = Math.round(p.y - (p.vy || 0) * i * 0.7);
      ctx.globalAlpha = 0.45 - i * 0.12;
      ctx.fillStyle = (i === 1) ? '#ffffff' : '#ef4444';
      ctx.fillRect(px - 1, py - 1, 3, 3);
    }
  }

  ctx.restore();
}

`;

const dsIdx1 = html.indexOf(oldDrawShotStart);
const dsIdx2 = html.indexOf(oldDrawShotEnd);
if (dsIdx1 !== -1 && dsIdx2 !== -1) {
  html = html.slice(0, dsIdx1) + newDrawShotCode + html.slice(dsIdx2);
  console.log('2. Successfully reworked Slash Trail VFX in drawShot!');
} else {
  console.log('Warning: drawShot markers not found!');
}

// =========================================================================
// 3. UFAK DÜŞMANLARIN (MOBLAR) CANLI YÜRÜYÜŞ & KANAT ÇIRPIŞ ANİMASYONLARI
// Adım atan bacaklar, çırpınan kanatlar, kıvranan minik sülükler
// =========================================================================
const mobRoleStart = '    // Swarmer / Slime\n    const squash = Math.sin(time * 0.28 + en.phase);\n    lift = 3 + Math.abs(squash) * 3.5;\n    drawGroundShadow(en.x + 2, en.y + en.r * 0.52, en.r * (1.18 + squash * 0.18), en.r * 0.28);';

const newMobRoleCode = `    // Swarmer / Slime / Mob Yürüyüş Animasyonu (Adım atan bacaklar & çırpınış)
    const squash = Math.sin(time * 0.32 + en.phase);
    lift = 3 + Math.abs(squash) * 3.8;
    drawGroundShadow(en.x + 2, en.y + en.r * 0.52, en.r * (1.18 + squash * 0.18), en.r * 0.28);

    // Minik yürüyüş bacakları (mob ayakları adımlarla hareket eder)
    const legW = Math.sin(time * 0.4 + en.phase) * (en.r * 0.4);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(en.x - en.r * 0.45 - legW, en.y + en.r * 0.2, 3, 4);
    ctx.fillRect(en.x + en.r * 0.25 + legW, en.y + en.r * 0.2, 3, 4);`;

const mbIdx = html.indexOf(mobRoleStart);
if (mbIdx !== -1) {
  html = html.slice(0, mbIdx) + newMobRoleCode + html.slice(mbIdx + mobRoleStart.length);
  console.log('3. Successfully added animated stepping legs to mob swarmers!');
} else {
  console.log('Warning: mobRoleStart not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
