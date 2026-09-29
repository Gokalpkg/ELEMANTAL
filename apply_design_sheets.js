const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html normalized length:', html.length);

// =========================================================================
// 1. UPDATE drawBossTelegraphs WITH AUTHENTIC RUNIC DECALS & TELEGRAPHS
// =========================================================================
const oldTelegraphStart = 'function drawBossTelegraphs(ctx, time) {';
const oldTelegraphEnd = 'function drawEnemyShot(p, time) {';

const newTelegraphCode = `function drawVectorRune(ctx, idx, s) {
  ctx.beginPath();
  switch (idx % 12) {
    case 0: // Fehu
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(0, -s * 0.7); ctx.lineTo(s * 0.7, -s);
      ctx.moveTo(0, -s * 0.2); ctx.lineTo(s * 0.7, -s * 0.5);
      break;
    case 1: // Thurisaz
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(0, -s * 0.5); ctx.lineTo(s * 0.7, 0); ctx.lineTo(0, s * 0.5);
      break;
    case 2: // Raidho
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, -s * 0.6); ctx.lineTo(0, -s * 0.2);
      ctx.moveTo(0, -s * 0.2); ctx.lineTo(s * 0.7, s);
      break;
    case 3: // Kenaz
      ctx.moveTo(s * 0.6, -s * 0.7); ctx.lineTo(0, 0); ctx.lineTo(s * 0.6, s * 0.7);
      break;
    case 4: // Gebo
      ctx.moveTo(-s * 0.6, -s * 0.8); ctx.lineTo(s * 0.6, s * 0.8);
      ctx.moveTo(s * 0.6, -s * 0.8); ctx.lineTo(-s * 0.6, s * 0.8);
      break;
    case 5: // Algiz
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(-s * 0.7, -s); ctx.lineTo(0, -s * 0.3); ctx.lineTo(s * 0.7, -s);
      break;
    case 6: // Sowilo (lightning)
      ctx.moveTo(s * 0.4, -s); ctx.lineTo(-s * 0.4, -s * 0.2);
      ctx.lineTo(s * 0.4, s * 0.2); ctx.lineTo(-s * 0.4, s);
      break;
    case 7: // Tiwaz (arrow up)
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(-s * 0.6, -s * 0.4); ctx.lineTo(0, -s); ctx.lineTo(s * 0.6, -s * 0.4);
      break;
    case 8: // Berkana
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, -s * 0.5); ctx.lineTo(0, 0);
      ctx.lineTo(s * 0.6, s * 0.5); ctx.lineTo(0, s);
      break;
    case 9: // Hagalaz
      ctx.moveTo(-s * 0.5, -s); ctx.lineTo(-s * 0.5, s);
      ctx.moveTo(s * 0.5, -s); ctx.lineTo(s * 0.5, s);
      ctx.moveTo(-s * 0.5, -s * 0.3); ctx.lineTo(s * 0.5, s * 0.3);
      break;
    case 10: // Othala
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, -s * 0.3); ctx.lineTo(-s * 0.6, s);
      ctx.moveTo(0, -s); ctx.lineTo(-s * 0.6, -s * 0.3); ctx.lineTo(s * 0.6, s);
      break;
    case 11: // Ansuz
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.moveTo(0, -s * 0.6); ctx.lineTo(s * 0.6, -s * 0.3);
      ctx.moveTo(0, -s * 0.1); ctx.lineTo(s * 0.6, s * 0.2);
      break;
  }
  ctx.stroke();
}

function drawBossTelegraphs(ctx, time) {
  if (!bossTelegraphs || bossTelegraphs.length === 0) return;
  bossTelegraphs.forEach(bt => {
    const progress = Math.min(1, (bt.t || 0) / (bt.duration || 1));
    ctx.save();

    if (bt.kind === 'circle') {
      // =========================================================================
      // 1. RÜNİK UYARI ÇEMBERİ (TELEGRAPHING DECAL) — PAFTADAKİ BİREBİR TASARIM!
      // =========================================================================
      const isFire = bt.color === '#ff3d00' || bt.color === '#ff1744' || bt.color === '#d32f2f';
      const isNature = bt.color === '#2e7d32' || bt.color === '#76ff03' || bt.color === '#00e676';
      const mainCol = bt.color || '#ff1744';
      const runeCol = isFire ? '#ffd54f' : isNature ? '#b9f6ca' : '#ffffff';
      const glowCol = isFire ? '#ff9100' : isNature ? '#69f0ae' : mainCol;

      // A. Dış Alev Dilleri / Diken Yaprakları (Paftadaki dış çeper alevleri)
      const tongueCount = 20;
      const rot = time * 0.02;
      ctx.fillStyle = mainCol;
      ctx.globalAlpha = 0.55 + Math.sin(time * 0.3) * 0.15;
      for (let i = 0; i < tongueCount; i++) {
        const tAng = rot + (i / tongueCount) * Math.PI * 2;
        const wave = Math.sin(time * 0.35 + i * 1.7);
        const tLen = bt.r + 5 + wave * 4;
        const p1x = bt.x + Math.cos(tAng - 0.08) * bt.r;
        const p1y = bt.y + Math.sin(tAng - 0.08) * bt.r;
        const p2x = bt.x + Math.cos(tAng + 0.08) * bt.r;
        const p2y = bt.y + Math.sin(tAng + 0.08) * bt.r;
        const tipX = bt.x + Math.cos(tAng) * tLen;
        const tipY = bt.y + Math.sin(tAng) * tLen;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(p2x, p2y);
        ctx.closePath();
        ctx.fill();
      }

      // B. Çift Konsantrik Rün Çemberi Sınırları
      ctx.strokeStyle = mainCol;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, bt.r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, bt.r - 8, 0, Math.PI * 2);
      ctx.stroke();

      // C. Çember Boyunca Dönen 14 Antik Rün Yazısı (Paftadaki rünler)
      const runeCount = 14;
      const runeRadius = bt.r - 4;
      ctx.strokeStyle = runeCol;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = 0.9;
      for (let i = 0; i < runeCount; i++) {
        const rAng = rot + (i / runeCount) * Math.PI * 2;
        const rx = bt.x + Math.cos(rAng) * runeRadius;
        const ry = bt.y + Math.sin(rAng) * runeRadius;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(rAng + Math.PI / 2);
        drawVectorRune(ctx, i, 3.2);
        ctx.restore();
      }
      ctx.shadowBlur = 0;

      // D. İç Tersine Dönen Kesikli Rün Yolu
      ctx.strokeStyle = runeCol;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, bt.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // E. Genişleyen İç Tehlike Magma / Doğa Dolgusu (Progress Dolumu)
      const fillR = bt.r * progress;
      const radG = ctx.createRadialGradient(bt.x, bt.y, fillR * 0.15, bt.x, bt.y, fillR);
      if (isFire) {
        radG.addColorStop(0, 'rgba(255, 235, 59, 0.75)');
        radG.addColorStop(0.6, 'rgba(255, 87, 34, 0.55)');
        radG.addColorStop(1, 'rgba(211, 47, 47, 0.3)');
      } else if (isNature) {
        radG.addColorStop(0, 'rgba(185, 246, 202, 0.7)');
        radG.addColorStop(0.6, 'rgba(76, 175, 80, 0.5)');
        radG.addColorStop(1, 'rgba(27, 94, 32, 0.3)');
      } else {
        radG.addColorStop(0, '#ffffff');
        radG.addColorStop(0.6, mainCol);
        radG.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = radG;
      ctx.globalAlpha = 0.25 + progress * 0.45;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, fillR, 0, Math.PI * 2);
      ctx.fill();

      // F. Merkez Çekirdek Rünü
      ctx.fillStyle = runeCol;
      ctx.globalAlpha = 0.7 + Math.sin(time * 0.4) * 0.3;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (bt.kind === 'reticle') {
      // =========================================================================
      // 2. DEV KAYA FIRLATMASI HEDEFLEME HALKASI (PLAYER TARGETING RING)
      // Pafta Image 3'teki Güneş / Sivri Dişli Altın Hedefleme Çemberi!
      // =========================================================================
      const retColor = '#ffd54f';
      const retR = bt.r;
      const teethCount = 12;
      const rot = time * 0.035;

      // A. Dış Sivri Güneş Dişleri Çemberi
      ctx.fillStyle = retColor;
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#ffe082';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.85;

      for (let i = 0; i < teethCount; i++) {
        const tAng = rot + (i / teethCount) * Math.PI * 2;
        const toothLen = retR + 7;
        const p1x = bt.x + Math.cos(tAng - 0.12) * retR;
        const p1y = bt.y + Math.sin(tAng - 0.12) * retR;
        const p2x = bt.x + Math.cos(tAng + 0.12) * retR;
        const p2y = bt.y + Math.sin(tAng + 0.12) * retR;
        const tipX = bt.x + Math.cos(tAng) * toothLen;
        const tipY = bt.y + Math.sin(tAng) * toothLen;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(p2x, p2y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // B. Ana Altın Çember
      ctx.strokeStyle = retColor;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, retR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // C. Oyuncuyu Kilitleyen İç Küçülen Takip Halkası
      const lockR = retR * (1.75 - progress * 0.75);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, lockR, 0, Math.PI * 2);
      ctx.stroke();

      // D. Merkez Nişangah (Crosshair)
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bt.x - 9, bt.y); ctx.lineTo(bt.x + 9, bt.y);
      ctx.moveTo(bt.x, bt.y - 9); ctx.lineTo(bt.x, bt.y + 9);
      ctx.stroke();

      // E. Genişleyen Tehdit Dolgusu
      ctx.fillStyle = 'rgba(255, 183, 77, 0.35)';
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, retR * progress, 0, Math.PI * 2);
      ctx.fill();

    } else if (bt.kind === 'line') {
      // =========================================================================
      // 3. ALEV HÜCUMU (CHARGE LINE TELEGRAPH) — PAFTA IMAGE 5'TEKİ BİREBİR TASARIM!
      // Alev mızrağı başı, dalgalanan alev koridoru ve iç akkor lazer hattı!
      // =========================================================================
      const tx = bt.targetX != null ? bt.targetX : (bt.x + Math.cos(bt.angle || 0) * (bt.len || 200));
      const ty = bt.targetY != null ? bt.targetY : (bt.y + Math.sin(bt.angle || 0) * (bt.len || 200));
      const ang = Math.atan2(ty - bt.y, tx - bt.x);
      const len = Math.hypot(tx - bt.x, ty - bt.y);
      const halfW = (bt.w || 32) * 0.5;

      ctx.save();
      ctx.translate(bt.x, bt.y);
      ctx.rotate(ang);

      // A. Alev Koridoru Arka Plan Dolgusu
      const lineG = ctx.createLinearGradient(0, 0, len, 0);
      lineG.addColorStop(0, 'rgba(255, 61, 0, 0.45)');
      lineG.addColorStop(0.7, 'rgba(255, 145, 0, 0.35)');
      lineG.addColorStop(1, 'rgba(255, 235, 59, 0.6)');
      ctx.fillStyle = lineG;
      ctx.globalAlpha = 0.4 + progress * 0.4;

      // Dalgalanan Alev Kenarları (Flaming Wavy Borders)
      ctx.beginPath();
      ctx.moveTo(0, -halfW);
      const steps = 14;
      for (let s = 1; s <= steps; s++) {
        const sx = s * (len / steps);
        const wave = Math.sin(time * 0.4 + s * 0.8) * 4;
        ctx.lineTo(sx, -halfW + wave);
      }
      ctx.lineTo(len, 0);
      for (let s = steps; s >= 0; s--) {
        const sx = s * (len / steps);
        const wave = Math.sin(time * 0.4 + s * 0.8 + Math.PI) * 4;
        ctx.lineTo(sx, halfW + wave);
      }
      ctx.closePath();
      ctx.fill();

      // B. Alevli Ok / Mızrak Başı (Arrowhead Decal)
      ctx.fillStyle = '#ffeb3b';
      ctx.shadowColor = '#ff5722';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(len + 18, 0);
      ctx.lineTo(len - 14, -halfW * 1.5);
      ctx.lineTo(len - 4, 0);
      ctx.lineTo(len - 14, halfW * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // C. Akkor Merkez Çizgisi & İleriye Akan » » » Okları
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, 0);
      ctx.stroke();

      // Koridor boyu akan oklar
      ctx.fillStyle = '#ffffff';
      const arrowCount = 5;
      const arrowShift = (time * 0.1) % 1;
      for (let a = 0; a < arrowCount; a++) {
        const ax = ((a + arrowShift) / arrowCount) * (len - 20);
        ctx.beginPath();
        ctx.moveTo(ax - 6, -6);
        ctx.lineTo(ax, 0);
        ctx.lineTo(ax - 6, 6);
        ctx.stroke();
      }

      ctx.restore();

    } else if (bt.kind === 'fissure') {
      // =========================================================================
      // 4. SİZMİK ZEMİN ÇATLAĞI (SEISMIC CRACK TELEGRAPH) — PAFTA IMAGE 3!
      // Tektonik zemin kırılması, fırlayan kaya parçacıkları ve toz!
      // =========================================================================
      const len = bt.len || 260;
      const ang = bt.angle || 0;
      ctx.save();
      ctx.translate(bt.x, bt.y);
      ctx.rotate(ang);

      // Ana Zemin Kırık Hattı
      ctx.strokeStyle = '#ffb74d';
      ctx.lineWidth = 4.2;
      ctx.shadowColor = '#ffa726';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.85 + Math.sin(time * 0.4) * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const steps = 10;
      const curLen = len * progress;
      for (let s = 1; s <= steps; s++) {
        const sx = s * (curLen / steps);
        const sy = (s % 2 === 0 ? 1 : -1) * (11 + (s % 3) * 5);
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Çatlak Etrafındaki Taş/Moloz Püskürmesi
      ctx.fillStyle = '#8d6e63';
      ctx.globalAlpha = 0.75;
      for (let s = 1; s <= steps; s++) {
        const sx = s * (curLen / steps);
        const sy = (s % 2 === 0 ? 1 : -1) * 14;
        ctx.fillRect(sx - 3, sy - 3, 6, 5);
      }

      ctx.restore();

    } else if (bt.kind === 'cone') {
      // 5. Koni Telegrafı (Buzul Fırtınası & Hardal Alevi)
      const spread = bt.spread || (Math.PI * 0.4);
      const startAng = bt.angle - spread * 0.5;
      const endAng = bt.angle + spread * 0.5;
      const curRange = bt.range * progress;

      ctx.fillStyle = bt.color || '#00e5ff';
      ctx.globalAlpha = 0.16 + progress * 0.24;
      ctx.beginPath();
      ctx.moveTo(bt.x, bt.y);
      ctx.arc(bt.x, bt.y, curRange, startAng, endAng);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = bt.color || '#00e5ff';
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(bt.x, bt.y);
      ctx.arc(bt.x, bt.y, bt.range, startAng, endAng);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  });
}

`;

const telegraphIdx1 = html.indexOf(oldTelegraphStart);
const telegraphIdx2 = html.indexOf(oldTelegraphEnd);
if (telegraphIdx1 === -1 || telegraphIdx2 === -1) {
  console.error('Failed to locate drawBossTelegraphs!');
  process.exit(1);
}
html = html.slice(0, telegraphIdx1) + newTelegraphCode + html.slice(telegraphIdx2);
console.log('1. Successfully replaced drawBossTelegraphs!');

// =========================================================================
// 2. UPDATE drawEnemyShot FOR PAFTA PROJECTILES
// =========================================================================
const oldRockStart = "  if (p.kind === 'rock_fist') {";
const oldVenomStart = "  if (p.kind === 'venom_needle') {";

const newProjectiles = `  if (p.kind === 'rock_fist') {
    // Dev Kaya & Kaya Parçacıkları (Pafta Image 3'teki kırıklı kaya fırlatması)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang + time * 0.15);
    const rad = p.r || 8;
    ctx.fillStyle = '#6d4c41';
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-rad, -rad * 0.4);
    ctx.lineTo(-rad * 0.3, -rad);
    ctx.lineTo(rad * 0.8, -rad * 0.7);
    ctx.lineTo(rad, rad * 0.2);
    ctx.lineTo(rad * 0.4, rad);
    ctx.lineTo(-rad * 0.6, rad * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Kaya iç çatlakları
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-rad * 0.3, -rad * 0.3); ctx.lineTo(0, 0); ctx.lineTo(rad * 0.4, rad * 0.3);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === 'toxic_spore') {
    // Zehirli Spor Sarmalı (Pafta Image 2'deki arkasında yeşil spor kuyruğu bırakan mermi)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.shadowColor = '#76ff03';
    ctx.shadowBlur = 10;
    // Arkadaki kuyruk
    ctx.fillStyle = 'rgba(118, 255, 3, 0.35)';
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(-14, -4);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();
    // Ön spor gövdesi
    ctx.fillStyle = '#b9f6ca';
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, (p.r || 6) * 1.2, p.r || 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Zehir damlacığı çekirdeği
    ctx.fillStyle = '#00e676';
    ctx.beginPath(); ctx.arc(1.5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
  if (p.kind === 'ball_lightning') {
    // Statik Küre / Orbital Küre Mayınları (Pafta Image 1'deki dönen orbital uydulu şimşek küresi)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = '#ffd600';
    ctx.shadowBlur = 12;
    // Ana elektrik küresi
    ctx.fillStyle = '#fff9c4';
    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, p.r || 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Etrafında dönen 3 adet orbital enerji uydusu
    const orbCount = 3;
    const orbDist = (p.r || 7) + 6;
    const orbRot = time * 0.12;
    ctx.fillStyle = '#00e5ff';
    for (let o = 0; o < orbCount; o++) {
      const oa = orbRot + (o / orbCount) * Math.PI * 2;
      const ox = Math.cos(oa) * orbDist;
      const oy = Math.sin(oa) * orbDist;
      ctx.beginPath();
      ctx.arc(ox, oy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
  if (p.kind === 'hydro_wave') {
    // Tsunami Dalgaları (Pafta Image 1'deki beyaz köpük tepeli okyanus dalgası)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.shadowColor = '#00b0ff';
    ctx.shadowBlur = 10;
    // Dalga gövdesi
    ctx.fillStyle = '#0288d1';
    ctx.strokeStyle = '#01579b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.quadraticCurveTo(0, -14, -10, -10);
    ctx.quadraticCurveTo(-4, 0, -10, 10);
    ctx.quadraticCurveTo(0, 14, 12, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Dalga tepesindeki beyaz köpük tarağı
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(10, -2, 3, 0, Math.PI * 2);
    ctx.arc(6, -8, 2.5, 0, Math.PI * 2);
    ctx.arc(6, 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
`;

const projIdx1 = html.indexOf(oldRockStart);
const projIdx2 = html.indexOf(oldVenomStart);
if (projIdx1 === -1 || projIdx2 === -1) {
  console.error('Failed to locate projectile code in drawEnemyShot!');
  process.exit(1);
}
html = html.slice(0, projIdx1) + newProjectiles + html.slice(projIdx2);
console.log('2. Successfully updated projectiles in drawEnemyShot!');

// =========================================================================
// 3. UPDATE hazards.forEach WITH ROOT TRAPS AND MOLTEN LAVA TRAILS
// =========================================================================
const hazardsAnchor = '  hazards.forEach(h => {\n    drawGroundShadow(h.x + 3, h.y + 8, h.r * 0.95, h.r * 0.42);';
const hazardsEndAnchor = '  // Boss İmza Saldırı Zemin Telegrafları (Hades Stili Uyarı Alanları)';

const newHazards = `  hazards.forEach(h => {
    drawGroundShadow(h.x + 3, h.y + 8, h.r * 0.95, h.r * 0.42);
    ctx.save();

    if (h.type === 'bramble') {
      // =========================================================================
      // SARMAŞIK KAPANI (ROOT TRAP - KAPAN KLAN) — PAFTA IMAGE 2!
      // Yerden fırlayan 8 adet kıvrımlı ahşap kök pençesi ve yeşil yapraklar!
      // =========================================================================
      const rootCount = 8;
      const rootR = h.r;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';

      // 1. Zemin Yosun/Kök Ağı
      ctx.fillStyle = 'rgba(27, 94, 32, 0.45)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, rootR, rootR * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Yerden Yükselip İçeri Bükülen Kadim Kökler (Gnarled Wooden Roots)
      for (let rIdx = 0; rIdx < rootCount; rIdx++) {
        const rAng = (rIdx / rootCount) * Math.PI * 2 + (h.x * 0.01);
        const rBaseX = h.x + Math.cos(rAng) * (rootR * 0.35);
        const rBaseY = h.y + Math.sin(rAng) * (rootR * 0.25);
        const rMidX = h.x + Math.cos(rAng) * (rootR * 0.85);
        const rMidY = h.y + Math.sin(rAng) * (rootR * 0.6) - 10;
        const rTipX = h.x + Math.cos(rAng + 0.3) * (rootR * 0.45);
        const rTipY = h.y + Math.sin(rAng + 0.3) * (rootR * 0.3) - 18;

        // Kök Gövdesi (Koyu Meşe)
        ctx.strokeStyle = '#271b12';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(rBaseX, rBaseY);
        ctx.quadraticCurveTo(rMidX, rMidY, rTipX, rTipY);
        ctx.stroke();

        // Kök Kabuk Işığı (Açık Ahşap)
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(rBaseX, rBaseY - 1);
        ctx.quadraticCurveTo(rMidX, rMidY - 1, rTipX, rTipY - 1);
        ctx.stroke();

        // Kök Ucundaki Dikenli Yaprak
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(rTipX, rTipY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (h.type === 'lava') {
      // =========================================================================
      // HÜCUM LAV İZİ & MAGMA HAVUZU (DASH LAVA TRAIL) — PAFTA IMAGE 5!
      // Fokurdayan magma, kırık bazalt kabuk ve parlayan akkor alev damarları!
      // =========================================================================
      // 1. Dış Soğumuş Bazalt Kabuğu
      ctx.fillStyle = '#1c0a06';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Akkor Magma Dolgusu (Molten Core)
      const lavaG = ctx.createRadialGradient(h.x, h.y, 2, h.x, h.y, h.r * 0.85);
      lavaG.addColorStop(0, '#fff9c4');
      lavaG.addColorStop(0.35, '#ffd54f');
      lavaG.addColorStop(0.7, '#ff3d00');
      lavaG.addColorStop(1, 'rgba(191, 54, 12, 0.4)');
      ctx.fillStyle = lavaG;
      ctx.shadowColor = '#ff3d00';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r * 0.82, h.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Yüzen Bazalt Kabuk Adacıkları
      ctx.fillStyle = '#26120c';
      ctx.fillRect(h.x - h.r * 0.4, h.y - 3, h.r * 0.35, 5);
      ctx.fillRect(h.x + h.r * 0.1, h.y - 4, h.r * 0.32, 6);

      // 4. Uçuşan Minik Lav Korları
      ctx.fillStyle = '#ffeb3b';
      const sparkCount = 3;
      for (let s = 0; s < sparkCount; s++) {
        const sAng = time * 0.1 + s * 2.1;
        const sx = h.x + Math.sin(sAng) * (h.r * 0.5);
        const sy = h.y - 6 - Math.abs(Math.sin(time * 0.15 + s)) * 12;
        ctx.fillRect(sx, sy, 2, 2);
      }

    } else {
      // Genel Elemental Zemin Havuzu
      ctx.beginPath(); ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI*2);
      const hFill = h.type==='water' ? '#2471a3' :
                    h.type==='storm' ? '#7d6a1a' :
                    h.type==='ice' ? '#5dade2' :
                    h.type==='sand' ? '#c9a66b' :
                    h.type==='night' ? '#5b4a8a' :
                    h.type==='caramel' ? '#ec407a' :
                    h.type==='ketchup' ? '#b71c1c' : '#1e8449';
      const hStroke = h.type==='water' ? '#5dade2' :
                      h.type==='storm' ? '#f4d03f' :
                      h.type==='ice' ? '#d6f4ff' :
                      h.type==='sand' ? '#f5deb3' :
                      h.type==='night' ? '#b39ddb' :
                      h.type==='caramel' ? '#f48fb1' :
                      h.type==='ketchup' ? '#ff5252' : '#3ddc84';
      ctx.fillStyle = visHex(hFill, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.globalAlpha = 0.45 + Math.sin(time*0.08)*0.08;
      ctx.fill();
      ctx.globalAlpha = 0.75; ctx.strokeStyle = visHex(hStroke, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.lineWidth = 2.2; ctx.stroke();
    }
    ctx.restore();
  });\n\n`;

const hazIdx1 = html.indexOf(hazardsAnchor);
const hazIdx2 = html.indexOf(hazardsEndAnchor);
if (hazIdx1 === -1 || hazIdx2 === -1) {
  console.error('Failed to locate hazards rendering in index.html!');
  process.exit(1);
}
html = html.slice(0, hazIdx1) + newHazards + html.slice(hazIdx2);
console.log('3. Successfully updated hazards.forEach!');

// =========================================================================
// 4. UPDATE drawUnifiedBiomeWorldFloor (ENTIRE FUNCTION - 100% CLEAN & SAFE)
// =========================================================================
const floorFuncStart = 'function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {';
const floorFuncEnd = 'function createBiomeFloorCanvas(biomeKey, visualMode) {';

const newFloorFunction = `function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {
  const bk = (biome && biome.key) || 'stone';
  const left = cam.x - 32;
  const top = cam.y - 32;
  const right = cam.x + W + 32;
  const bottom = cam.y + H + 32;
  const width = right - left;
  const height = bottom - top;

  ctx.save();

  if (bk === 'lava') {
    // =========================================================================
    // 1. LAV ÇUKURU BİYOMU — PAFTA IMAGE 4 & 5!
    // Koyu bazalt, akan organik magma nehirleri ve parlayan volkanik yarıklar!
    // =========================================================================
    ctx.fillStyle = '#09070c';
    ctx.fillRect(left, top, width, height);

    // Koyu volkanik duman gradyanı
    const radG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.2, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.8);
    radG.addColorStop(0, 'rgba(18, 10, 20, 0.4)');
    radG.addColorStop(1, 'rgba(5, 3, 8, 0.95)');
    ctx.fillStyle = radG;
    ctx.fillRect(left, top, width, height);

    // Akan Akkor Magma Nehirleri (Çok katmanlı sıcaklık gradyanı)
    const startWX = Math.floor(left / 320) * 320;
    const endWX = Math.ceil(right / 320) * 320;

    // Dış kor/kabuk kenarı
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#bf360c';
    ctx.beginPath();
    for (let wx = startWX; wx <= endWX; wx += 320) {
      const offsetX = Math.sin(wx * 0.003) * 60;
      ctx.moveTo(wx + offsetX, top);
      for (let wy = top; wy <= bottom; wy += 40) {
        const wiggle = Math.sin(wy * 0.015 + wx * 0.01) * 35 + Math.cos(wy * 0.03) * 15;
        ctx.lineTo(wx + offsetX + wiggle, wy);
      }
    }
    ctx.stroke();

    // Akkor erimiş magma orta katmanı
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ff5722';
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let wx = startWX; wx <= endWX; wx += 320) {
      const offsetX = Math.sin(wx * 0.003) * 60;
      ctx.moveTo(wx + offsetX, top);
      for (let wy = top; wy <= bottom; wy += 40) {
        const wiggle = Math.sin(wy * 0.015 + wx * 0.01) * 35 + Math.cos(wy * 0.03) * 15;
        ctx.lineTo(wx + offsetX + wiggle, wy);
      }
    }
    ctx.stroke();

    // Beyaz/Sarı kızgın çekirdek hattı
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#fff9c4';
    ctx.shadowColor = '#ffd54f';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Volkanik soğumuş bazalt levha detayları
    ctx.fillStyle = '#14111a';
    const gridStep = 180;
    const gStartX = Math.floor(left / gridStep) * gridStep;
    const gStartY = Math.floor(top / gridStep) * gridStep;
    for (let gx = gStartX; gx <= right; gx += gridStep) {
      for (let gy = gStartY; gy <= bottom; gy += gridStep) {
        const seed = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.45) {
          const px = gx + fract * 90;
          const py = gy + (1 - fract) * 90;
          const pr = 18 + fract * 24;
          ctx.beginPath();
          ctx.ellipse(px, py, pr, pr * 0.65, fract * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

  } else if (bk === 'water') {
    // =========================================================================
    // 2. OKYANUS & DERİN BATAKLIK BİYOMU — PAFTA IMAGE 1!
    // Derin safir okyanus, pembe/turkuaz mercan resifleri ve baloncuklar!
    // =========================================================================
    ctx.fillStyle = '#02182b';
    ctx.fillRect(left, top, width, height);

    const watG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    watG.addColorStop(0, 'rgba(4, 46, 82, 0.45)');
    watG.addColorStop(1, 'rgba(1, 14, 26, 0.95)');
    ctx.fillStyle = watG;
    ctx.fillRect(left, top, width, height);

    // Işık Kırılması (Su altı kaustik ağları)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const wStep = 240;
    const wStartX = Math.floor(left / wStep) * wStep;
    const wStartY = Math.floor(top / wStep) * wStep;
    for (let x = wStartX; x <= right; x += wStep) {
      for (let y = wStartY; y <= bottom; y += wStep) {
        const waveShift = Math.sin(time * 0.05 + x * 0.008 + y * 0.008) * 16;
        ctx.moveTo(x + waveShift, y);
        ctx.bezierCurveTo(x + 50 + waveShift, y + 30, x + 90, y + 80 + waveShift, x + 120, y + 110);
      }
    }
    ctx.stroke();

    // Rengarenk Mercan Resifleri (Pafta Image 1'deki Pembe, Turuncu ve Turkuaz Mercanlar!)
    for (let x = wStartX; x <= right; x += 200) {
      for (let y = wStartY; y <= bottom; y += 200) {
        const seed = Math.sin(x * 13.45 + y * 57.89) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.38) {
          const cx = x + fract * 100;
          const cy = y + (1 - fract) * 100;
          const coralCol = fract > 0.72 ? '#f43f5e' : fract > 0.52 ? '#00e5ff' : '#ff9800';
          const branchH = 18 + fract * 14;

          ctx.strokeStyle = coralCol;
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = coralCol;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy - branchH);
          ctx.moveTo(cx, cy - branchH * 0.4);
          ctx.lineTo(cx - 10, cy - branchH * 0.85);
          ctx.lineTo(cx - 14, cy - branchH);
          ctx.moveTo(cx, cy - branchH * 0.55);
          ctx.lineTo(cx + 10, cy - branchH * 0.9);
          ctx.lineTo(cx + 12, cy - branchH * 1.1);
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy - branchH, 2, 0, Math.PI * 2);
          ctx.arc(cx - 14, cy - branchH, 1.8, 0, Math.PI * 2);
          ctx.arc(cx + 12, cy - branchH * 1.1, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Yükselen Su Baloncukları (Rising Bubble Streams)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    for (let b = 0; b < 16; b++) {
      const bAng = time * 0.05 + b * 1.4;
      const bx = left + (((b * 137.5) % width));
      const by = top + ((height - (time * 0.8 + b * 45) % height));
      const bRad = 2.5 + (b % 3) * 1.5;
      ctx.beginPath();
      ctx.arc(bx + Math.sin(bAng) * 8, by, bRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

  } else if (bk === 'pink') {
    // 3. ŞEKER BİYOMU: Pastel çilek kreması & sprinkles
    ctx.fillStyle = '#260818';
    ctx.fillRect(left, top, width, height);

    ctx.fillStyle = 'rgba(74, 14, 46, 0.45)';
    ctx.beginPath();
    const pStep = 220;
    const pStartX = Math.floor(left / pStep) * pStep;
    for (let x = pStartX; x <= right; x += pStep) {
      const wave = Math.sin(x * 0.005) * 40;
      ctx.ellipse(x + wave, top + (bottom - top) * 0.5, 90, (bottom - top) * 0.55, 0.3, 0, Math.PI * 2);
    }
    ctx.fill();

    const sColors = ['#f472b6', '#38bdf8', '#facc15', '#4ade80', '#ffffff'];
    const sStep = 90;
    const sStartX = Math.floor(left / sStep) * sStep;
    const sStartY = Math.floor(top / sStep) * sStep;
    for (let x = sStartX; x <= right; x += sStep) {
      for (let y = sStartY; y <= bottom; y += sStep) {
        const seed = Math.sin(x * 17.89 + y * 91.23) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.35) {
          const sx = x + fract * 70;
          const sy = y + (1 - fract) * 70;
          const cIdx = Math.floor(fract * sColors.length);
          ctx.fillStyle = sColors[cIdx];
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(fract * Math.PI * 2);
          ctx.fillRect(-4, -1.5, 8, 3);
          ctx.restore();
        }
      }
    }

  } else if (bk === 'forest') {
    // =========================================================================
    // 4. BÜYÜLÜ ORMAN BİYOMU — PAFTA IMAGE 2!
    // Kadim ağaç kökleri, parlayan biyolüminesans mantarlar (mavi/turuncu/mor) ve ateş böcekleri!
    // =========================================================================
    ctx.fillStyle = '#05180e';
    ctx.fillRect(left, top, width, height);

    const forG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    forG.addColorStop(0, 'rgba(8, 38, 22, 0.4)');
    forG.addColorStop(1, 'rgba(3, 16, 9, 0.95)');
    ctx.fillStyle = forG;
    ctx.fillRect(left, top, width, height);

    // Kadim Kıvrımlı Ağaç Kökleri
    ctx.strokeStyle = '#271b12';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    const fStep = 260;
    const fStartX = Math.floor(left / fStep) * fStep;
    const fStartY = Math.floor(top / fStep) * fStep;
    for (let x = fStartX; x <= right; x += fStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 90, top + (bottom - top) * 0.35, x - 70, top + (bottom - top) * 0.7, x + 60, bottom);
      ctx.stroke();
    }

    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 4;
    for (let x = fStartX; x <= right; x += fStep) {
      ctx.beginPath();
      ctx.moveTo(x + 2, top);
      ctx.bezierCurveTo(x + 92, top + (bottom - top) * 0.35, x - 68, top + (bottom - top) * 0.7, x + 62, bottom);
      ctx.stroke();
    }

    // Parlayan Biyolüminesans Mantarlar (Mavi, Turuncu, Mor)
    const mStep = 180;
    const mStartX = Math.floor(left / mStep) * mStep;
    const mStartY = Math.floor(top / mStep) * mStep;
    for (let mx = mStartX; mx <= right; mx += mStep) {
      for (let my = mStartY; my <= bottom; my += mStep) {
        const seed = Math.sin(mx * 19.31 + my * 71.49) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.38) {
          const px = mx + fract * 90;
          const py = my + (1 - fract) * 90;
          const mColor = fract > 0.72 ? '#00e5ff' : fract > 0.52 ? '#ff9800' : '#d500f9';
          const glowColor = fract > 0.72 ? '#80d8ff' : fract > 0.52 ? '#ffd54f' : '#ea80fc';
          const mSize = 6 + fract * 5;

          const mG = ctx.createRadialGradient(px, py, 1, px, py, mSize * 3);
          mG.addColorStop(0, glowColor);
          mG.addColorStop(0.4, mColor);
          mG.addColorStop(1, 'transparent');
          ctx.fillStyle = mG;
          ctx.globalAlpha = 0.45 + Math.sin(time * 0.06 + px * 0.02) * 0.2;
          ctx.beginPath();
          ctx.arc(px, py, mSize * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#e8f5e9';
          ctx.globalAlpha = 0.85;
          ctx.fillRect(px - 1.5, py, 3, mSize);

          ctx.fillStyle = mColor;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(px, py, mSize, Math.PI, 0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px - 2, py - mSize * 0.5, 1.5, 0, Math.PI * 2);
          ctx.arc(px + 2, py - mSize * 0.3, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Uçuşan Ateş Böcekleri
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 6;
    for (let i = 0; i < 14; i++) {
      const fAng = time * 0.04 + i * 1.8;
      const fx = left + ((Math.sin(fAng * 0.7 + i) * 0.5 + 0.5) * width);
      const fy = top + ((Math.cos(fAng * 0.5 + i * 2) * 0.5 + 0.5) * height);
      const fPulse = 0.5 + Math.sin(time * 0.15 + i * 3) * 0.45;
      ctx.globalAlpha = fPulse;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

  } else if (bk === 'ice') {
    // 5. BUZ BİYOMU: Prizmatik kristal çatlaklar
    ctx.fillStyle = '#061828';
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const iStep = 280;
    const iStartX = Math.floor(left / iStep) * iStep;
    for (let x = iStartX; x <= right; x += iStep) {
      ctx.moveTo(x, top);
      ctx.lineTo(x + 90, top + (bottom - top) * 0.45);
      ctx.lineTo(x + 30, top + (bottom - top) * 0.75);
      ctx.lineTo(x + 120, bottom);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  } else if (bk === 'storm') {
    // 6. FIRTINA BİYOMU: Elektrik arkı çatlakları
    ctx.fillStyle = '#0f0a1c';
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ffd600';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const stStep = 270;
    const stStartX = Math.floor(left / stStep) * stStep;
    for (let x = stStartX; x <= right; x += stStep) {
      ctx.moveTo(x, top);
      ctx.lineTo(x + 50, top + 100);
      ctx.lineTo(x - 20, top + 220);
      ctx.lineTo(x + 70, bottom);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  } else if (bk === 'sand') {
    // 7. KUM BİYOMU: Altın çöl kumulları
    ctx.fillStyle = '#1e1608';
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    const sdStep = 200;
    const sdStartX = Math.floor(left / sdStep) * sdStep;
    for (let x = sdStartX; x <= right; x += sdStep) {
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 60, top + (bottom - top) * 0.5, x - 60, top + (bottom - top) * 0.8, x + 40, bottom);
    }
    ctx.stroke();

  } else if (bk === 'night') {
    // 8. GECE BİYOMU: Gotik gece yarısı mermeri
    ctx.fillStyle = '#0a0814';
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
    ctx.lineWidth = 2;
    const nStep = 240;
    const nStartX = Math.floor(left / nStep) * nStep;
    const nStartY = Math.floor(top / nStep) * nStep;
    for (let x = nStartX; x <= right; x += nStep) {
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    }
    for (let y = nStartY; y <= bottom; y += nStep) {
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }

  } else if (bk === 'ketchup') {
    // 9. KETÇAP BİYOMU: Retro Diner & Hardal Şeritleri
    ctx.fillStyle = '#18100c';
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.14)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    const kStep = 240;
    const kStartX = Math.floor(left / kStep) * kStep;
    for (let x = kStartX; x <= right; x += kStep) {
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 50, top + 150, x - 40, top + 320, x + 60, bottom);
    }
    ctx.stroke();

  } else {
    // =========================================================================
    // 10. TAŞ DİYARI BİYOMU — PAFTA IMAGE 3!
    // Mor/Alacakaranlık kayalık gökyüzü, rünlü dikilitaşlar (menhirler) ve granit bloklar!
    // =========================================================================
    ctx.fillStyle = '#12111d';
    ctx.fillRect(left, top, width, height);

    const stnG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.2, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    stnG.addColorStop(0, 'rgba(28, 25, 46, 0.45)');
    stnG.addColorStop(1, 'rgba(10, 9, 16, 0.95)');
    ctx.fillStyle = stnG;
    ctx.fillRect(left, top, width, height);

    // Kadim Granit Zemin Plakaları ve Çatlaklar
    ctx.strokeStyle = '#1e1c2e';
    ctx.lineWidth = 3;
    const stnStep = 240;
    const stnStartX = Math.floor(left / stnStep) * stnStep;
    const stnStartY = Math.floor(top / stnStep) * stnStep;
    for (let x = stnStartX; x <= right; x += stnStep) {
      ctx.beginPath();
      ctx.moveTo(x, top); ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    for (let y = stnStartY; y <= bottom; y += stnStep) {
      ctx.beginPath();
      ctx.moveTo(left, y); ctx.lineTo(right, y);
      ctx.stroke();
    }

    // Kadim Dikilitaşlar (Runic Menhirs / Obelisks — Pafta Image 3)
    const oStep = 260;
    const oStartX = Math.floor(left / oStep) * oStep;
    const oStartY = Math.floor(top / oStep) * oStep;
    for (let ox = oStartX; ox <= right; ox += oStep) {
      for (let oy = oStartY; oy <= bottom; oy += oStep) {
        const seed = Math.sin(ox * 14.73 + oy * 83.21) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.42) {
          const mx = ox + fract * 90;
          const my = oy + (1 - fract) * 90;
          const mw = 22 + fract * 10;
          const mh = 50 + fract * 22;

          // Zemin Gölgesi
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(mx + mw * 0.4, my + mh - 2, mw * 0.85, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Taş Gövdesi
          ctx.fillStyle = '#252233';
          ctx.beginPath();
          ctx.moveTo(mx + 4, my);
          ctx.lineTo(mx + mw - 3, my + 4);
          ctx.lineTo(mx + mw, my + mh);
          ctx.lineTo(mx, my + mh);
          ctx.closePath();
          ctx.fill();

          // Sol Işıklı Kenar
          ctx.strokeStyle = '#3e3954';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(mx + 4, my);
          ctx.lineTo(mx, my + mh);
          ctx.stroke();

          // Sağ Gölgeli Kenar
          ctx.fillStyle = '#181622';
          ctx.beginPath();
          ctx.moveTo(mx + mw * 0.65, my + 2);
          ctx.lineTo(mx + mw - 3, my + 4);
          ctx.lineTo(mx + mw, my + mh);
          ctx.lineTo(mx + mw * 0.65, my + mh);
          ctx.closePath();
          ctx.fill();

          // Dikey Parlayan Cyan/Yeşil Rünler (Pafta Image 3)
          const runePulse = 0.7 + Math.sin(time * 0.05 + ox * 0.01) * 0.3;
          ctx.strokeStyle = '#00e5ff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 8 * runePulse;
          ctx.lineWidth = 2;
          ctx.globalAlpha = runePulse;

          const runeCount = 3;
          for (let rIdx = 0; rIdx < runeCount; rIdx++) {
            const rY = my + 14 + rIdx * 14;
            const rX = mx + mw * 0.35;
            ctx.save();
            ctx.translate(rX, rY);
            drawVectorRune(ctx, Math.floor(fract * 10) + rIdx, 2.8);
            ctx.restore();
          }
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Ayaktaki Taş Kırıntıları
          ctx.fillStyle = '#363248';
          ctx.fillRect(mx - 5, my + mh - 5, 8, 6);
          ctx.fillStyle = '#221f2f';
          ctx.fillRect(mx + mw - 2, my + mh - 7, 10, 8);
        }
      }
    }
  }

  // Dış Ekran Sinematik Yumuşak Karartma Vignette
  const vig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.35, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.95);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(2, 3, 6, 0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(left, top, width, height);

  ctx.restore();
}

`;

const floorIdx1 = html.indexOf(floorFuncStart);
const floorIdx2 = html.indexOf(floorFuncEnd);
if (floorIdx1 === -1 || floorIdx2 === -1) {
  console.error('Failed to locate drawUnifiedBiomeWorldFloor in index.html!');
  process.exit(1);
}
html = html.slice(0, floorIdx1) + newFloorFunction + html.slice(floorIdx2);
console.log('4. Successfully replaced entire drawUnifiedBiomeWorldFloor!');

// =========================================================================
// 5. UPDATE drawCustomAnimatedPixelBoss WITH CHEST CORES AND SPRITE FX
// =========================================================================
const oldDrawBossImage = '    ctx.drawImage(img, Math.round(drawX), Math.round(drawY), Math.round(scaleW), Math.round(scaleH));\n    ctx.restore();\n    return;';

const newDrawBossImage = `    ctx.drawImage(img, Math.round(drawX), Math.round(drawY), Math.round(scaleW), Math.round(scaleH));

    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı
    if (bk === 'stone') {
      // Kadim Taş Titanı: Parlayan Rünik Çekirdek (Pafta Image 1 & 3)
      const coreY = -scaleH * 0.44;
      const pulse = 0.75 + Math.sin(time * 0.12) * 0.25;
      ctx.save();
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 5.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, coreY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (bk === 'lava') {
      // Lav Lordu İfrit: Yanan Magma Kalbi (Pafta Image 4 & 5)
      const heartY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.16) * 0.25;
      ctx.save();
      ctx.fillStyle = '#ffd600';
      ctx.shadowColor = '#ff3d00';
      ctx.shadowBlur = 16 * pulse;
      ctx.beginPath();
      ctx.arc(0, heartY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, heartY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (bk === 'forest') {
      // Ulu Orman Ruhu: Süzülen Doğa Yaprakları & Peri Tozları (Pafta Image 2)
      ctx.save();
      for (let l = 0; l < 4; l++) {
        const la = time * 0.08 + l * (Math.PI / 2);
        const lx = Math.cos(la) * (r * 1.15);
        const ly = -scaleH * 0.45 + Math.sin(la * 1.5) * (r * 0.55);
        ctx.fillStyle = l % 2 === 0 ? '#4ade80' : '#fde047';
        ctx.shadowColor = '#86efac';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (bk === 'storm') {
      // Yıldırım Titanı Raijin: Şimşek Arkları (Pafta Image 1)
      if (Math.random() < 0.45) {
        ctx.save();
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#ffd600';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.8;
        const saX = (Math.random() - 0.5) * r * 1.2;
        const saY = -scaleH * 0.5 + (Math.random() - 0.5) * scaleH * 0.4;
        ctx.beginPath();
        ctx.moveTo(saX, saY);
        ctx.lineTo(saX + (Math.random() - 0.5) * 16, saY + (Math.random() - 0.5) * 16);
        ctx.lineTo(saX + (Math.random() - 0.5) * 24, saY + (Math.random() - 0.5) * 24);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
    return;`;

const bossDrawIdx = html.indexOf(oldDrawBossImage);
if (bossDrawIdx === -1) {
  console.error('Failed to locate drawCustomAnimatedPixelBoss image draw!');
  process.exit(1);
}
html = html.slice(0, bossDrawIdx) + newDrawBossImage + html.slice(bossDrawIdx + oldDrawBossImage.length);
console.log('5. Successfully updated drawCustomAnimatedPixelBoss!');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('All 5 major design sheet components applied successfully! File size:', html.length);
