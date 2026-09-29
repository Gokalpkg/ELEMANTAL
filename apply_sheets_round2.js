const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html normalized length:', html.length);

// =========================================================================
// 1. UPDATE drawBossTelegraphs WITH ICE, STORM, BLOOD DECALS & TELEGRAPHS
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
      ctx.moveTo(-s * 0.6, -s * 0.5); ctx.lineTo(0, -s); ctx.lineTo(s * 0.6, -s * 0.5);
      break;
    case 8: // Berkana
      ctx.moveTo(-s * 0.3, -s); ctx.lineTo(-s * 0.3, s);
      ctx.moveTo(-s * 0.3, -s); ctx.lineTo(s * 0.5, -s * 0.5); ctx.lineTo(-s * 0.3, 0);
      ctx.lineTo(s * 0.5, s * 0.5); ctx.lineTo(-s * 0.3, s);
      break;
    case 9: // Ehwaz
      ctx.moveTo(-s * 0.5, -s); ctx.lineTo(-s * 0.5, s);
      ctx.moveTo(s * 0.5, -s); ctx.lineTo(s * 0.5, s);
      ctx.moveTo(-s * 0.5, -s); ctx.lineTo(0, -s * 0.3); ctx.lineTo(s * 0.5, -s);
      break;
    case 10: // Mannaz
      ctx.moveTo(-s * 0.5, -s); ctx.lineTo(-s * 0.5, s);
      ctx.moveTo(s * 0.5, -s); ctx.lineTo(s * 0.5, s);
      ctx.moveTo(-s * 0.5, -s * 0.8); ctx.lineTo(s * 0.5, 0.8 * s);
      ctx.moveTo(s * 0.5, -s * 0.8); ctx.lineTo(-s * 0.5, 0.8 * s);
      break;
    case 11: // Ingwaz (diamond)
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.6, 0); ctx.closePath();
      break;
  }
  ctx.stroke();
}

function drawBossTelegraphs(ctx, time) {
  if (!bossTelegraphs || bossTelegraphs.length === 0) return;
  bossTelegraphs.forEach(bt => {
    const progress = Math.min(1, (bt.t || 0) / (bt.duration || 1));
    ctx.save();

    if (bt.kind === 'circle' || bt.kind === 'blood_trap') {
      // =========================================================================
      // 1. RÜNİK UYARI ÇEMBERLERİ (ATEŞ, DOĞA, BUZ, FIRTINA, SU, KAN VADİSİ)
      // =========================================================================
      const isFire = bt.color === '#ff3d00' || bt.color === '#ff1744' || bt.color === '#d32f2f';
      const isNature = bt.color === '#2e7d32' || bt.color === '#76ff03' || bt.color === '#00e676';
      const isIce = bt.color === '#00e5ff' || bt.color === '#4fc3f7' || bt.color === '#9be7ff' || bt.color === '#0288d1';
      const isStorm = bt.color === '#fbc02d' || bt.color === '#ffd54f' || bt.color === '#ffd600';
      const isWater = bt.color === '#1e88e5' || bt.color === '#26c6da' || bt.color === '#0288d1';
      const isBlood = bt.color === '#b71c1c' || bt.color === '#880e4f' || bt.kind === 'blood_trap';

      const mainCol = isBlood ? '#b71c1c' : isIce ? '#00e5ff' : isStorm ? '#ffd600' : isWater ? '#00b0ff' : (bt.color || '#ff1744');
      const runeCol = isFire ? '#ffd54f' : isNature ? '#b9f6ca' : isIce ? '#e0f7fa' : isStorm ? '#fff9c4' : isWater ? '#e0f7fa' : isBlood ? '#ff8a80' : '#ffffff';
      const glowCol = isFire ? '#ff9100' : isNature ? '#69f0ae' : isIce ? '#00e5ff' : isStorm ? '#ffd600' : isWater ? '#00e5ff' : isBlood ? '#ff1744' : mainCol;

      // A. Dış Diller / Dişler / Yarasa Kanatları / Kar Kristalleri
      const tongueCount = isIce ? 16 : isStorm ? 18 : isBlood ? 12 : 20;
      const rot = time * (isBlood ? -0.02 : 0.02);
      ctx.fillStyle = mainCol;
      ctx.globalAlpha = 0.55 + Math.sin(time * 0.3) * 0.15;

      for (let i = 0; i < tongueCount; i++) {
        const tAng = rot + (i / tongueCount) * Math.PI * 2;
        const wave = Math.sin(time * 0.35 + i * 1.7);
        const tLen = bt.r + (isIce ? 8 : isBlood ? 6 : 5) + wave * 4;

        if (isBlood) {
          // Yarasa silueti dişi
          const bx = bt.x + Math.cos(tAng) * tLen;
          const by = bt.y + Math.sin(tAng) * tLen;
          ctx.beginPath();
          ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (isIce) {
          // Sivri prizmatik buz dişi
          const p1x = bt.x + Math.cos(tAng - 0.06) * bt.r;
          const p1y = bt.y + Math.sin(tAng - 0.06) * bt.r;
          const p2x = bt.x + Math.cos(tAng + 0.06) * bt.r;
          const p2y = bt.y + Math.sin(tAng + 0.06) * bt.r;
          const tipX = bt.x + Math.cos(tAng) * tLen;
          const tipY = bt.y + Math.sin(tAng) * tLen;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y); ctx.lineTo(tipX, tipY); ctx.lineTo(p2x, p2y); ctx.closePath();
          ctx.fill();
        } else {
          const p1x = bt.x + Math.cos(tAng - 0.08) * bt.r;
          const p1y = bt.y + Math.sin(tAng - 0.08) * bt.r;
          const p2x = bt.x + Math.cos(tAng + 0.08) * bt.r;
          const p2y = bt.y + Math.sin(tAng + 0.08) * bt.r;
          const tipX = bt.x + Math.cos(tAng) * tLen;
          const tipY = bt.y + Math.sin(tAng) * tLen;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y); ctx.lineTo(tipX, tipY); ctx.lineTo(p2x, p2y); ctx.closePath();
          ctx.fill();
        }
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

      // C. Çember Boyunca Dönen Antik Rün Yazıları
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

      // E. Genişleyen İç Tehlike Dolgusu (Progress)
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
      } else if (isIce) {
        radG.addColorStop(0, 'rgba(224, 247, 250, 0.8)');
        radG.addColorStop(0.6, 'rgba(0, 229, 255, 0.5)');
        radG.addColorStop(1, 'rgba(2, 136, 209, 0.3)');
      } else if (isStorm) {
        radG.addColorStop(0, 'rgba(255, 249, 196, 0.85)');
        radG.addColorStop(0.6, 'rgba(255, 214, 0, 0.55)');
        radG.addColorStop(1, 'rgba(245, 127, 23, 0.3)');
      } else if (isBlood) {
        radG.addColorStop(0, 'rgba(255, 23, 68, 0.8)');
        radG.addColorStop(0.6, 'rgba(183, 28, 28, 0.55)');
        radG.addColorStop(1, 'rgba(74, 20, 140, 0.35)');
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

      // F. Merkez Çekirdek
      ctx.fillStyle = runeCol;
      ctx.globalAlpha = 0.7 + Math.sin(time * 0.4) * 0.3;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (bt.kind === 'reticle') {
      // 2. DEV KAYA / BUZ SARKITI FIRLATMASI HEDEFLEME HALKASI
      const retColor = '#ffd54f';
      const retR = bt.r;
      const teethCount = 12;
      const rot = time * 0.035;

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

      ctx.beginPath();
      ctx.arc(bt.x, bt.y, retR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, retR * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bt.x - retR * 1.15, bt.y); ctx.lineTo(bt.x + retR * 1.15, bt.y);
      ctx.moveTo(bt.x, bt.y - retR * 1.15); ctx.lineTo(bt.x, bt.y + retR * 1.15);
      ctx.stroke();

      const fillR = retR * progress;
      ctx.fillStyle = 'rgba(255, 179, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, fillR, 0, Math.PI * 2);
      ctx.fill();

    } else if (bt.kind === 'line') {
      // 3. HÜCUM HATTI (CHARGE LINE) TELEGRAFI
      const isFire = bt.color === '#ff3d00' || bt.color === '#ff5722' || bt.color === '#ff1744';
      const isIce = bt.color === '#00e5ff' || bt.color === '#4fc3f7' || bt.color === '#9be7ff';
      const isStorm = bt.color === '#ffd600' || bt.color === '#ffd54f' || bt.color === '#fbc02d';
      const isWater = bt.color === '#1e88e5' || bt.color === '#00b0ff';

      const arrowColor = isIce ? '#00e5ff' : isStorm ? '#ffd600' : isWater ? '#00e5ff' : isFire ? '#ff3d00' : (bt.color || '#ff1744');
      const glowColor = isIce ? '#80d8ff' : isStorm ? '#fff9c4' : isWater ? '#80d8ff' : '#ff9100';

      const lineLen = bt.length || 320;
      const halfW = (bt.width || 44) * 0.5;
      const angle = bt.angle || 0;

      ctx.translate(bt.x, bt.y);
      ctx.rotate(angle);

      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.8;

      ctx.beginPath();
      ctx.moveTo(0, -halfW); ctx.lineTo(lineLen - halfW * 1.5, -halfW);
      ctx.moveTo(0, halfW); ctx.lineTo(lineLen - halfW * 1.5, halfW);
      ctx.stroke();

      ctx.fillStyle = arrowColor;
      ctx.beginPath();
      ctx.moveTo(lineLen - halfW * 1.5, -halfW * 1.8);
      ctx.lineTo(lineLen + halfW * 0.6, 0);
      ctx.lineTo(lineLen - halfW * 1.5, halfW * 1.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const fillW = lineLen * progress;
      const lineG = ctx.createLinearGradient(0, 0, fillW, 0);
      if (isIce) {
        lineG.addColorStop(0, 'rgba(2, 136, 209, 0.2)');
        lineG.addColorStop(1, 'rgba(0, 229, 255, 0.65)');
      } else if (isStorm) {
        lineG.addColorStop(0, 'rgba(245, 127, 23, 0.2)');
        lineG.addColorStop(1, 'rgba(255, 214, 0, 0.7)');
      } else if (isWater) {
        lineG.addColorStop(0, 'rgba(1, 87, 155, 0.2)');
        lineG.addColorStop(1, 'rgba(0, 176, 255, 0.65)');
      } else {
        lineG.addColorStop(0, 'rgba(211, 47, 47, 0.2)');
        lineG.addColorStop(1, 'rgba(255, 235, 59, 0.65)');
      }
      ctx.fillStyle = lineG;
      ctx.fillRect(0, -halfW * 0.9, fillW, halfW * 1.8);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(fillW, 0);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (bt.kind === 'fissure') {
      // 4. SİSMİK ZEMİN ÇATLAĞI
      const angle = bt.angle || 0;
      const len = bt.length || 240;
      ctx.translate(bt.x, bt.y);
      ctx.rotate(angle);

      ctx.strokeStyle = '#1a1822';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const segs = 10;
      const segLen = len / segs;
      for (let s = 1; s <= segs; s++) {
        const segProgress = s / segs;
        if (segProgress > progress) break;
        const zx = s * segLen;
        const zy = Math.sin(s * 1.8) * 8;
        ctx.lineTo(zx, zy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let s = 1; s <= segs; s++) {
        const segProgress = s / segs;
        if (segProgress > progress) break;
        const zx = s * segLen;
        const zy = Math.sin(s * 1.8) * 8;
        ctx.lineTo(zx, zy);
      }
      ctx.stroke();

    } else {
      // Varsayılan uyarı
      ctx.strokeStyle = bt.color || '#ff1744';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, bt.r || 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  });
}

function drawEnemyShot(p, time) {`;

const idx1 = html.indexOf(oldTelegraphStart);
const idx2 = html.indexOf(oldTelegraphEnd);
if (idx1 === -1 || idx2 === -1) {
  console.error('Failed to locate drawBossTelegraphs in index.html!');
  process.exit(1);
}
html = html.slice(0, idx1) + newTelegraphCode + html.slice(idx2 + oldTelegraphEnd.length);
console.log('1. Successfully updated drawBossTelegraphs with authentic multi-element decals!');

// =========================================================================
// 2. UPDATE PROJECTILES IN drawEnemyShot (Icicles, Lightning Javelin, Bat Swarm)
// =========================================================================
const oldLollipop = `  if (p.kind === 'lollipop_bomb') {
    const rot = p.rot || (time * 0.2);
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));
    ctx.rotate(rot);
    ctx.shadowColor = '#ec407a';
    ctx.shadowBlur = 10;
    pixDisk(0, 0, p.r || 9, '#f48fb1', '#ec407a', '#c2185b');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
    return;
  }`;

const newLollipopAndProjectiles = `  if (p.kind === 'lollipop_bomb') {
    const rot = p.rot || (time * 0.2);
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));
    ctx.rotate(rot);
    ctx.shadowColor = '#ec407a';
    ctx.shadowBlur = 10;
    pixDisk(0, 0, p.r || 9, '#f48fb1', '#ec407a', '#c2185b');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === 'icicle_shard') {
    // DEV BUZ SARKITI / PRIZMATIK BUZ KRİSTALİ (Pafta 2 - Kutup Hükümdarı Yeti)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 12;
    // Prizmatik sivri buz sarkıtı
    ctx.fillStyle = '#e0f7fa';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-10, -6);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Kristal iç faset çizgileri
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(14, 0); ctx.lineTo(-6, 0);
    ctx.stroke();
    // Uçuşan kar parçacığı
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-12, -3, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-14, 3, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
  if (p.kind === 'lightning_javelin') {
    // STATİK ŞİMŞEK MIZRAĞI / ZİKZAK ARK (Pafta 3 - Yıldırım Titanı Raijin)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.shadowColor = '#ffd600';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, 0); ctx.lineTo(6, -5); ctx.lineTo(2, 4); ctx.lineTo(-8, -4); ctx.lineTo(-14, 0);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(14, 0); ctx.lineTo(6, -5); ctx.lineTo(2, 4); ctx.lineTo(-8, -4); ctx.lineTo(-14, 0);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }
  if (p.kind === 'bat_swarm' || p.kind === 'blood_drop') {
    // KAN DAMLASI & YARASA SÜRÜSÜ (Pafta 5 - Kan Vadisi / Karanlık Kontu)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 10;
    // Kanat çırpan yarasa formu
    const wingY = Math.sin(time * 0.4) * 4;
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.quadraticCurveTo(0, -7 + wingY, -6, -10 + wingY);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-6, 10 - wingY);
    ctx.quadraticCurveTo(0, 7 - wingY, 6, 0);
    ctx.closePath();
    ctx.fill();
    // Kırmızı parlayan yarasa gözü / kan çekirdeği
    ctx.fillStyle = '#ff1744';
    ctx.beginPath(); ctx.arc(2, -1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    return;
  }`;

const pIdx = html.indexOf(oldLollipop);
if (pIdx === -1) {
  console.error('Failed to locate lollipop_bomb in drawEnemyShot!');
  process.exit(1);
}
html = html.slice(0, pIdx) + newLollipopAndProjectiles + html.slice(pIdx + oldLollipop.length);
console.log('2. Successfully updated projectiles in drawEnemyShot!');

// =========================================================================
// 3. UPDATE hazards.forEach WITH AUTHENTIC BIOME TRAPS (ICE, STORM, WATER, BLOOD)
// =========================================================================
const oldHazardStart = `hazards.forEach(h => {
    drawGroundShadow(h.x + 3, h.y + 8, h.r * 0.95, h.r * 0.42);`;
const oldHazardEnd = `  // Boss İmza Saldırı Zemin Telegrafları (Hades Stili Uyarı Alanları)
  drawBossTelegraphs(ctx, time);`;

const newHazardCode = `hazards.forEach(h => {
    drawGroundShadow(h.x + 3, h.y + 8, h.r * 0.95, h.r * 0.42);
    ctx.save();

    if (h.type === 'bramble') {
      // SARMAŞIK KAPANI (ROOT TRAP - KAPAN KLAN) — PAFTA IMAGE 2
      const rootCount = 8;
      const rootR = h.r;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';

      ctx.fillStyle = 'rgba(27, 94, 32, 0.45)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, rootR, rootR * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let rIdx = 0; rIdx < rootCount; rIdx++) {
        const rAng = (rIdx / rootCount) * Math.PI * 2 + (h.x * 0.01);
        const rBaseX = h.x + Math.cos(rAng) * (rootR * 0.35);
        const rBaseY = h.y + Math.sin(rAng) * (rootR * 0.25);
        const rMidX = h.x + Math.cos(rAng) * (rootR * 0.85);
        const rMidY = h.y + Math.sin(rAng) * (rootR * 0.6) - 10;
        const rTipX = h.x + Math.cos(rAng + 0.3) * (rootR * 0.45);
        const rTipY = h.y + Math.sin(rAng + 0.3) * (rootR * 0.3) - 18;

        ctx.strokeStyle = '#271b12';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(rBaseX, rBaseY);
        ctx.quadraticCurveTo(rMidX, rMidY, rTipX, rTipY);
        ctx.stroke();

        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(rBaseX, rBaseY - 1);
        ctx.quadraticCurveTo(rMidX, rMidY - 1, rTipX, rTipY - 1);
        ctx.stroke();

        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(rTipX, rTipY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (h.type === 'lava') {
      // HÜCUM LAV İZİ & MAGMA HAVUZU — PAFTA IMAGE 5
      ctx.fillStyle = '#1c0a06';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.fillStyle = '#26120c';
      ctx.fillRect(h.x - h.r * 0.4, h.y - 3, h.r * 0.35, 5);
      ctx.fillRect(h.x + h.r * 0.1, h.y - 4, h.r * 0.32, 6);

      ctx.fillStyle = '#ffeb3b';
      for (let s = 0; s < 3; s++) {
        const sAng = time * 0.1 + s * 2.1;
        const sx = h.x + Math.sin(sAng) * (h.r * 0.5);
        const sy = h.y - 6 - Math.abs(Math.sin(time * 0.15 + s)) * 12;
        ctx.fillRect(sx, sy, 2, 2);
      }

    } else if (h.type === 'ice') {
      // =========================================================================
      // HÜCUM BUZ İZİ & DONMUŞ KRİSTAL ZEMİN (DASH FROST TRAIL) — PAFTA 2!
      // =========================================================================
      ctx.fillStyle = 'rgba(6, 24, 40, 0.65)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Don tabakası ve buz kristalleri
      const iceG = ctx.createRadialGradient(h.x, h.y, 2, h.x, h.y, h.r * 0.85);
      iceG.addColorStop(0, '#e0f7fa');
      iceG.addColorStop(0.4, '#80d8ff');
      iceG.addColorStop(0.8, '#0288d1');
      iceG.addColorStop(1, 'transparent');
      ctx.fillStyle = iceG;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r * 0.85, h.r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Yerden fırlayan 3D prizmatik buz kristalleri (Pafta 2)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.4;
      for (let c = 0; c < 4; c++) {
        const ca = c * (Math.PI / 2) + 0.4;
        const cx = h.x + Math.cos(ca) * (h.r * 0.45);
        const cy = h.y + Math.sin(ca) * (h.r * 0.25);
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx + 4, cy);
        ctx.lineTo(cx - 4, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

    } else if (h.type === 'storm') {
      // =========================================================================
      // ELEKTRİKLİ ZEMİN ÇATLAĞI & STATİK ARK İZİ (SHOCK TRAIL) — PAFTA 3!
      // =========================================================================
      ctx.fillStyle = 'rgba(15, 10, 28, 0.6)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kavrulmuş zemin ve altın/cyan statik arklar
      ctx.strokeStyle = '#ffd600';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#ffd600';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(h.x - h.r * 0.8, h.y);
      ctx.lineTo(h.x - h.r * 0.3, h.y - 6);
      ctx.lineTo(h.x + h.r * 0.2, h.y + 7);
      ctx.lineTo(h.x + h.r * 0.8, h.y);
      ctx.stroke();

      // Mavi ark çatalları
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(h.x - h.r * 0.3, h.y - 6); ctx.lineTo(h.x, h.y - 12);
      ctx.moveTo(h.x + h.r * 0.2, h.y + 7); ctx.lineTo(h.x + h.r * 0.5, h.y + 11);
      ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (h.type === 'water') {
      // =========================================================================
      // GİRDAP ALAN EFEKTİ (HYDRO WHIRLPOOL) — PAFTA 4!
      // =========================================================================
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(time * 0.08);

      const wg = ctx.createRadialGradient(0, 0, 2, 0, 0, h.r);
      wg.addColorStop(0, '#01579b');
      wg.addColorStop(0.5, '#0288d1');
      wg.addColorStop(0.8, '#4fc3f7');
      wg.addColorStop(1, 'transparent');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.ellipse(0, 0, h.r, h.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spiral beyaz köpük kolları
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 3; s++) {
        const sa = s * (Math.PI * 2 / 3);
        ctx.beginPath();
        for (let rStep = 4; rStep <= h.r * 0.85; rStep += 4) {
          const theta = sa + rStep * 0.15;
          const sx = Math.cos(theta) * rStep;
          const sy = Math.sin(theta) * (rStep * 0.6);
          if (rStep === 4) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.restore();

    } else if (h.type === 'night') {
      // =========================================================================
      // KAN TUZU TUZAĞI & KAN GİRDABI (BLOOD SALT TRAP) — PAFTA 5!
      // Kırmızı rünik kare taban + ortasından yükselen sivri kan tuzu kristalleri!
      // =========================================================================
      ctx.fillStyle = 'rgba(20, 8, 14, 0.7)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kan Altarı / Tuzak Rünik Kare Tabanı (Pafta 5)
      const sqSize = h.r * 0.7;
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 10;
      ctx.strokeRect(h.x - sqSize, h.y - sqSize * 0.5, sqSize * 2, sqSize);

      ctx.fillStyle = 'rgba(183, 28, 28, 0.45)';
      ctx.fillRect(h.x - sqSize + 2, h.y - sqSize * 0.5 + 2, sqSize * 2 - 4, sqSize - 4);
      ctx.shadowBlur = 0;

      // Yerden fırlayan 5 adet kızıl sivri Kan Tuzu Kristalleri (Pafta 5)
      ctx.fillStyle = '#ff1744';
      ctx.strokeStyle = '#b71c1c';
      ctx.lineWidth = 1.2;
      const crystalOffsets = [-12, -6, 0, 6, 12];
      const crystalHeights = [10, 16, 20, 14, 9];
      crystalOffsets.forEach((cxOff, i) => {
        const cX = h.x + cxOff;
        const cY = h.y + 2;
        const cH = crystalHeights[i];
        ctx.beginPath();
        ctx.moveTo(cX, cY - cH);
        ctx.lineTo(cX + 3.5, cY);
        ctx.lineTo(cX - 3.5, cY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Kristal ışıltısı
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cX - 1, cY - cH + 2, 2, 4);
        ctx.fillStyle = '#ff1744';
      });

    } else {
      // Genel Elemental Zemin Havuzu
      ctx.beginPath(); ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI*2);
      const hFill = h.type==='sand' ? '#c9a66b' :
                    h.type==='caramel' ? '#ec407a' :
                    h.type==='ketchup' ? '#b71c1c' : '#1e8449';
      const hStroke = h.type==='sand' ? '#f5deb3' :
                      h.type==='caramel' ? '#f48fb1' :
                      h.type==='ketchup' ? '#ff5252' : '#3ddc84';
      ctx.fillStyle = visHex(hFill, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.globalAlpha = 0.45 + Math.sin(time*0.08)*0.08;
      ctx.fill();
      ctx.globalAlpha = 0.75; ctx.strokeStyle = visHex(hStroke, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.lineWidth = 2.2; ctx.stroke();
    }
    ctx.restore();
  });

  // Boss İmza Saldırı Zemin Telegrafları (Hades Stili Uyarı Alanları)
  drawBossTelegraphs(ctx, time);`;

const hIdx1 = html.indexOf(oldHazardStart);
const hIdx2 = html.indexOf(oldHazardEnd);
if (hIdx1 === -1 || hIdx2 === -1) {
  console.error('Failed to locate hazards.forEach in index.html!');
  process.exit(1);
}
html = html.slice(0, hIdx1) + newHazardCode + html.slice(hIdx2 + oldHazardEnd.length);
console.log('3. Successfully updated hazards.forEach with Ice, Storm, Water, and Blood Salt traps!');

// =========================================================================
// 4. UPDATE drawUnifiedBiomeWorldFloor (GLACIAL MOUNTAINS, STORM PEAKS, BLOOD VALLEY)
// =========================================================================
const floorFuncStart = 'function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {';
const floorFuncEnd = 'function createBiomeFloorCanvas(biomeKey, visualMode) {';

const newFloorFunction = `function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {
  const bk = (biome && biome.key) || 'stone';
  const left = cam.x;
  const top = cam.y;
  const right = cam.x + W;
  const bottom = cam.y + H;
  const width = W;
  const height = H;

  ctx.save();

  if (bk === 'lava') {
    // 1. VOLKANİK BİYOM — PAFTA IMAGE 5
    ctx.fillStyle = '#0a0606';
    ctx.fillRect(left, top, width, height);

    const bG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.1, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    bG.addColorStop(0, 'rgba(28, 12, 10, 0.45)');
    bG.addColorStop(1, 'rgba(10, 4, 4, 0.95)');
    ctx.fillStyle = bG;
    ctx.fillRect(left, top, width, height);

    const lStep = 240;
    const lStartX = Math.floor(left / lStep) * lStep;
    ctx.lineCap = 'round';

    ctx.strokeStyle = '#ff3d00';
    ctx.lineWidth = 14;
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 18;
    for (let x = lStartX; x <= right; x += lStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 70, top + (bottom - top) * 0.35, x - 50, top + (bottom - top) * 0.7, x + 40, bottom);
      ctx.stroke();
    }

    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#ffea00';
    ctx.shadowBlur = 10;
    for (let x = lStartX; x <= right; x += lStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 70, top + (bottom - top) * 0.35, x - 50, top + (bottom - top) * 0.7, x + 40, bottom);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

  } else if (bk === 'water') {
    // 2. OKYANUS & DERİNLİK RESİFİ BİYOMU — PAFTA 4
    ctx.fillStyle = '#03141f';
    ctx.fillRect(left, top, width, height);

    const wG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.1, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.9);
    wG.addColorStop(0, 'rgba(4, 38, 58, 0.45)');
    wG.addColorStop(1, 'rgba(2, 12, 20, 0.95)');
    ctx.fillStyle = wG;
    ctx.fillRect(left, top, width, height);

    // Mercan Resifleri (Pembe, Turkuaz, Kehribar - Pafta 4)
    const cStep = 180;
    const cStartX = Math.floor(left / cStep) * cStep;
    const cStartY = Math.floor(top / cStep) * cStep;
    for (let cx = cStartX; cx <= right; cx += cStep) {
      for (let cy = cStartY; cy <= bottom; cy += cStep) {
        const seed = Math.sin(cx * 12.9898 + cy * 78.233) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.4) {
          const px = cx + fract * 90;
          const py = cy + (1 - fract) * 90;
          const coralColor = fract > 0.7 ? '#f43f5e' : fract > 0.5 ? '#06b6d4' : '#f59e0b';
          const size = 10 + fract * 14;

          ctx.fillStyle = coralColor;
          ctx.beginPath();
          ctx.arc(px, py, size * 0.35, 0, Math.PI * 2);
          ctx.arc(px - size * 0.35, py - size * 0.35, size * 0.25, 0, Math.PI * 2);
          ctx.arc(px + size * 0.35, py - size * 0.35, size * 0.25, 0, Math.PI * 2);
          ctx.arc(px, py - size * 0.65, size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Yükselen Su Kabarcıkları
    ctx.fillStyle = 'rgba(103, 232, 249, 0.4)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
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
    // 3. ŞEKER BİYOMU
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
    // 4. BÜYÜLÜ ORMAN BİYOMU — PAFTA IMAGE 2
    ctx.fillStyle = '#05180e';
    ctx.fillRect(left, top, width, height);

    const forG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    forG.addColorStop(0, 'rgba(8, 38, 22, 0.4)');
    forG.addColorStop(1, 'rgba(3, 16, 9, 0.95)');
    ctx.fillStyle = forG;
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = '#271b12';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    const fStep = 260;
    const fStartX = Math.floor(left / fStep) * fStep;
    for (let x = fStartX; x <= right; x += fStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 90, top + (bottom - top) * 0.35, x - 70, top + (bottom - top) * 0.7, x + 60, bottom);
      ctx.stroke();
    }

    // Biyolüminesans Mantarlar (Cyan, Turuncu, Mor)
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
    // =========================================================================
    // 5. BUZUL DAĞLARI BİYOMU — PAFTA 2 (KUTUP HÜKÜMDARI YETİ)
    // Sivri prizmatik dev buz kristalleri (Ice Spires), karlı çatlaklar ve kar taneleri!
    // =========================================================================
    ctx.fillStyle = '#061320';
    ctx.fillRect(left, top, width, height);

    const iceG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    iceG.addColorStop(0, 'rgba(8, 32, 54, 0.45)');
    iceG.addColorStop(1, 'rgba(3, 10, 18, 0.95)');
    ctx.fillStyle = iceG;
    ctx.fillRect(left, top, width, height);

    // Zemin Kar & Buz Çatlakları
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    const iStep = 240;
    const iStartX = Math.floor(left / iStep) * iStep;
    for (let x = iStartX; x <= right; x += iStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + 60, top + (bottom - top) * 0.4);
      ctx.lineTo(x - 30, top + (bottom - top) * 0.7);
      ctx.lineTo(x + 50, bottom);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Sivri Prizmatik Dev Buz Kristalleri (Ice Spires — Pafta 2)
    const isStep = 200;
    const isStartX = Math.floor(left / isStep) * isStep;
    const isStartY = Math.floor(top / isStep) * isStep;
    for (let ix = isStartX; ix <= right; ix += isStep) {
      for (let iy = isStartY; iy <= bottom; iy += isStep) {
        const seed = Math.sin(ix * 13.37 + iy * 67.89) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.4) {
          const spX = ix + fract * 80;
          const spY = iy + (1 - fract) * 80;
          const spH = 26 + fract * 22;
          const spW = 10 + fract * 8;

          // Kristal taban gölgesi
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(spX, spY + 2, spW * 1.2, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Buz kristali gövdesi (Sol faset: Cyan, Sağ faset: Derin Mavi, Üst faset: Beyaz)
          ctx.fillStyle = '#00e5ff';
          ctx.beginPath();
          ctx.moveTo(spX, spY - spH);
          ctx.lineTo(spX - spW * 0.5, spY);
          ctx.lineTo(spX, spY + 3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#0288d1';
          ctx.beginPath();
          ctx.moveTo(spX, spY - spH);
          ctx.lineTo(spX + spW * 0.5, spY);
          ctx.lineTo(spX, spY + 3);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(spX, spY - spH); ctx.lineTo(spX, spY + 3);
          ctx.stroke();
        }
      }
    }

    // Uçuşan Kar Taneleri (Snowfall)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#80d8ff';
    ctx.shadowBlur = 4;
    for (let s = 0; s < 18; s++) {
      const sAng = time * 0.03 + s * 1.5;
      const sx = left + (((s * 97 + time * 20) % width));
      const sy = top + (((s * 73 + time * 35) % height));
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

  } else if (bk === 'storm') {
    // =========================================================================
    // 6. FIRTINA TEPELERİ BİYOMU — PAFTA 3 (YILDIRIM TİTANI RAİJİN)
    // Sivri altın şimşek kristalleri, antik tapınak harabe sütunları ve elektrik arkları!
    // =========================================================================
    ctx.fillStyle = '#0c0b16';
    ctx.fillRect(left, top, width, height);

    const stmG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    stmG.addColorStop(0, 'rgba(26, 20, 52, 0.45)');
    stmG.addColorStop(1, 'rgba(8, 7, 14, 0.95)');
    ctx.fillStyle = stmG;
    ctx.fillRect(left, top, width, height);

    // Zemin Statik Çatlakları
    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#ffd600';
    ctx.shadowBlur = 9;
    const stStep = 250;
    const stStartX = Math.floor(left / stStep) * stStep;
    for (let x = stStartX; x <= right; x += stStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + 40, top + 90);
      ctx.lineTo(x - 30, top + 210);
      ctx.lineTo(x + 50, bottom);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Sivri Altın Şimşek Kristalleri & Antik Harabe Sütunları (Pafta 3)
    const stColStep = 220;
    const stColStartX = Math.floor(left / stColStep) * stColStep;
    const stColStartY = Math.floor(top / stColStep) * stColStep;
    for (let sx = stColStartX; sx <= right; sx += stColStep) {
      for (let sy = stColStartY; sy <= bottom; sy += stColStep) {
        const seed = Math.sin(sx * 15.71 + sy * 53.19) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.45) {
          const px = sx + fract * 80;
          const py = sy + (1 - fract) * 80;

          if (fract > 0.72) {
            // Antik Harabe Taş Sütun (Pafta 3)
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath(); ctx.ellipse(px + 8, py + 28, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#2d283e';
            ctx.fillRect(px, py - 10, 16, 38);
            ctx.fillStyle = '#443d5c';
            ctx.fillRect(px - 3, py - 14, 22, 5); // Sütun başlığı
            ctx.fillRect(px - 3, py + 25, 22, 5); // Sütun tabanı
          } else {
            // Sivri Altın Şimşek Kristali (Pafta 3)
            const kH = 24 + fract * 18;
            const kW = 10 + fract * 6;
            ctx.fillStyle = '#ffd54f';
            ctx.shadowColor = '#ffd600';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(px, py - kH);
            ctx.lineTo(px - kW * 0.5, py);
            ctx.lineTo(px + kW * 0.5, py);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

  } else if (bk === 'sand') {
    // 7. KUM BİYOMU
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
    // =========================================================================
    // 8. KAN VADİSİ BİYOMU — PAFTA 5 (BLOOD VALLEY BIOME ASSETS)
    // Rünlü Kan Altarı, Yarasa Kafatası Sütunları, Kan Lambası, Çeşme, Kan Tuzu!
    // =========================================================================
    ctx.fillStyle = '#100609';
    ctx.fillRect(left, top, width, height);

    const bldG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    bldG.addColorStop(0, 'rgba(42, 10, 18, 0.5)');
    bldG.addColorStop(1, 'rgba(12, 3, 6, 0.95)');
    ctx.fillStyle = bldG;
    ctx.fillRect(left, top, width, height);

    // Biyom Hazır Yapıları (Kan Altarı, Yarasa Sütunları, Kan Lambaları — Pafta 5)
    const bvStep = 240;
    const bvStartX = Math.floor(left / bvStep) * bvStep;
    const bvStartY = Math.floor(top / bvStep) * bvStep;

    for (let bx = bvStartX; bx <= right; bx += bvStep) {
      for (let by = bvStartY; by <= bottom; by += bvStep) {
        const seed = Math.sin(bx * 17.13 + by * 43.71) * 43758.5453;
        const fract = seed - Math.floor(seed);
        const px = bx + fract * 90;
        const py = by + (1 - fract) * 90;

        if (fract > 0.68) {
          // 1. RÜNLÜ KAN ALTARI (Runic Blood Altar — Pafta 5)
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.beginPath(); ctx.ellipse(px, py + 12, 34, 12, 0, 0, Math.PI * 2); ctx.fill();

          // Taş Basamaklı Platform
          ctx.fillStyle = '#2b1b22';
          ctx.beginPath();
          ctx.ellipse(px, py + 8, 30, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#3f222d';
          ctx.beginPath();
          ctx.ellipse(px, py, 22, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Kırmızı Parlayan Pentagram / Kan Rünü (Pafta 5)
          ctx.strokeStyle = '#ff1744';
          ctx.shadowColor = '#ff1744';
          ctx.shadowBlur = 10;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            const pAng = p * (Math.PI * 4 / 5) - Math.PI / 2;
            const pxPos = px + Math.cos(pAng) * 14;
            const pyPos = py + Math.sin(pAng) * 5;
            if (p === 0) ctx.moveTo(pxPos, pyPos); else ctx.lineTo(pxPos, pyPos);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.shadowBlur = 0;

        } else if (fract > 0.48) {
          // 2. YARASA KAFATASI SÜTUNU (Bat Skull Column — Pafta 5)
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.beginPath(); ctx.ellipse(px, py + 26, 12, 5, 0, 0, Math.PI * 2); ctx.fill();

          // Taş Kolon
          ctx.fillStyle = '#26171d';
          ctx.fillRect(px - 6, py - 16, 12, 40);

          // Tepedeki Boynuzlu Yarasa Kafatası Oyması (Pafta 5)
          ctx.fillStyle = '#ded5d8';
          ctx.beginPath();
          ctx.arc(px, py - 20, 6, 0, Math.PI * 2);
          ctx.fill();
          // Kulaklar / Boynuzlar
          ctx.beginPath();
          ctx.moveTo(px - 5, py - 23); ctx.lineTo(px - 9, py - 30); ctx.lineTo(px - 2, py - 24);
          ctx.moveTo(px + 5, py - 23); ctx.lineTo(px + 9, py - 30); ctx.lineTo(px + 2, py - 24);
          ctx.fill();
          // Kırmızı Gözler
          ctx.fillStyle = '#ff1744';
          ctx.fillRect(px - 3, py - 20, 2, 2);
          ctx.fillRect(px + 1, py - 20, 2, 2);

        } else if (fract > 0.32) {
          // 3. SİVRİ KAN TUZU KRİSTALLERİ (Blood Salt Trap Crystals — Pafta 5)
          ctx.fillStyle = '#dc2626';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(px, py - 16); ctx.lineTo(px + 6, py); ctx.lineTo(px - 6, py); ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(px - 8, py - 11); ctx.lineTo(px - 3, py); ctx.lineTo(px - 12, py); ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Uçuşan Yarasa Siluetleri (Bat Silhouette Particles — Pafta 5)
    ctx.fillStyle = '#0f0508';
    for (let b = 0; b < 10; b++) {
      const bSpeed = time * 0.05 + b * 2.2;
      const bX = left + (((b * 120 + time * 35) % (width + 60)) - 30);
      const bY = top + (((b * 80 + Math.sin(bSpeed) * 30) % height));
      const bFlap = Math.sin(time * 0.3 + b) * 3;

      ctx.beginPath();
      ctx.moveTo(bX, bY);
      ctx.quadraticCurveTo(bX - 4, bY - 6 + bFlap, bX - 8, bY - 4 + bFlap);
      ctx.lineTo(bX - 3, bY);
      ctx.lineTo(bX - 8, bY + 4 - bFlap);
      ctx.quadraticCurveTo(bX - 4, bY + 6 - bFlap, bX, bY);
      ctx.fill();
    }

    // Mor Sis Partikülleri (Purple Mist Particles — Pafta 5)
    ctx.fillStyle = 'rgba(147, 51, 234, 0.08)';
    for (let m = 0; m < 8; m++) {
      const mx = left + (((m * 160 + time * 12) % width));
      const my = top + (((m * 90 + Math.cos(time * 0.02 + m) * 20) % height));
      ctx.beginPath();
      ctx.ellipse(mx, my, 45, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (bk === 'ketchup') {
    // 9. KETÇAP BİYOMU
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
    // 10. TAŞ DİYARI BİYOMU — PAFTA IMAGE 3
    ctx.fillStyle = '#12111d';
    ctx.fillRect(left, top, width, height);

    const stnG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.2, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    stnG.addColorStop(0, 'rgba(28, 25, 46, 0.45)');
    stnG.addColorStop(1, 'rgba(10, 9, 16, 0.95)');
    ctx.fillStyle = stnG;
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = '#1e1c2e';
    ctx.lineWidth = 3;
    const stnStep = 240;
    const stnStartX = Math.floor(left / stnStep) * stnStep;
    const stnStartY = Math.floor(top / stnStep) * stnStep;
    for (let x = stnStartX; x <= right; x += stnStep) {
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    }
    for (let y = stnStartY; y <= bottom; y += stnStep) {
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }

    // Kadim Dikilitaşlar (Menhirler)
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

          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(mx + mw * 0.4, my + mh - 2, mw * 0.85, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#252233';
          ctx.beginPath();
          ctx.moveTo(mx + 4, my);
          ctx.lineTo(mx + mw - 3, my + 4);
          ctx.lineTo(mx + mw, my + mh);
          ctx.lineTo(mx, my + mh);
          ctx.closePath();
          ctx.fill();

          const runePulse = 0.7 + Math.sin(time * 0.05 + ox * 0.01) * 0.3;
          ctx.strokeStyle = '#00e5ff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 8 * runePulse;
          ctx.lineWidth = 2;
          ctx.globalAlpha = runePulse;

          for (let rIdx = 0; rIdx < 3; rIdx++) {
            const rY = my + 14 + rIdx * 14;
            const rX = mx + mw * 0.35;
            ctx.save();
            ctx.translate(rX, rY);
            drawVectorRune(ctx, Math.floor(fract * 10) + rIdx, 2.8);
            ctx.restore();
          }
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
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
console.log('4. Successfully replaced entire drawUnifiedBiomeWorldFloor with Ice, Storm, and Blood Valley assets!');

// =========================================================================
// 5. UPDATE drawCustomAnimatedPixelBoss WITH FROST YETI, RAIJIN, LEVIATHAN, BLOOD LORD CORES
// =========================================================================
const oldBossCoreAnchor = `    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı
    if (bk === 'stone') {`;

const newBossCoreCode = `    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı
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
    } else if (bk === 'ice') {
      // Kutup Hükümdarı Yeti: Donmuş Çekirdek & Faz 2 Aşırı Yüklü Rünler (Pafta 2)
      const coreY = -scaleH * 0.46;
      const pulse = 0.8 + Math.sin(time * 0.15) * 0.25;
      ctx.save();
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 16 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, coreY, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Faz 2: Aşırı Yüklü Donmuş Çekirdek — Dönen 3 Rünlü Buzul Parçası (Pafta 2)
      if (isRaged) {
        for (let o = 0; o < 3; o++) {
          const oa = time * 0.1 + o * (Math.PI * 2 / 3);
          const ox = Math.cos(oa) * (r * 0.7);
          const oy = coreY + Math.sin(oa) * (r * 0.35);
          ctx.fillStyle = '#00e5ff';
          ctx.beginPath();
          ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (bk === 'storm') {
      // Yıldırım Titanı Raijin: Sırtında 5 Tomoe Şimşek Davulu & Overcharged Runic Core (Pafta 3)
      ctx.save();
      // 5 adet dönen Taiko şimşek davulu
      for (let td = 0; td < 5; td++) {
        const ta = time * 0.08 + td * (Math.PI * 2 / 5);
        const tx = Math.cos(ta) * (scaleW * 0.52);
        const ty = -scaleH * 0.5 + Math.sin(ta) * (scaleH * 0.28);
        ctx.fillStyle = '#854d0e';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ffd600';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(tx, ty, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Faz 2: Aşırı Gerilim Rünik Çekirdek (Pafta 3)
      const coreY = -scaleH * 0.48;
      const pulse = 0.85 + Math.sin(time * 0.2) * 0.25;
      ctx.fillStyle = '#fff9c4';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

    } else if (bk === 'water') {
      // Derinlik Lordu Leviathan: Kızıl Mercan Boynuzları & Derinlik İncisi (Pafta 4)
      const pearlY = -scaleH * 0.42;
      const pulse = 0.8 + Math.sin(time * 0.14) * 0.22;
      ctx.save();
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 15 * pulse;
      ctx.beginPath();
      ctx.arc(0, pearlY, 6.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, pearlY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Su kabarcıkları ve sıçrama moteleri (Pafta 4)
      for (let w = 0; w < 3; w++) {
        const wa = time * 0.12 + w * 2.1;
        const wx = Math.sin(wa) * (r * 0.85);
        const wy = pearlY - 8 - Math.abs(Math.sin(time * 0.15 + w)) * 14;
        ctx.fillStyle = 'rgba(103, 232, 249, 0.7)';
        ctx.beginPath(); ctx.arc(wx, wy, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'night') {
      // Karanlık Kontu / Kan Vadisi Lordu: Yakut Kan Rünü & Yarasa Aurası (Pafta 5)
      const rubyY = -scaleH * 0.46;
      ctx.save();
      ctx.fillStyle = '#ff1744';
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, rubyY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Uçuşan 2 minik yarasa silueti
      for (let b = 0; b < 2; b++) {
        const ba = time * 0.1 + b * Math.PI;
        const bx = Math.cos(ba) * (r * 0.95);
        const by = rubyY + Math.sin(ba * 2) * (r * 0.35);
        ctx.fillStyle = '#111827';
        ctx.fillRect(bx - 2, by - 1, 4, 2);
      }
      ctx.restore();`;

const bossCoreIdx = html.indexOf(oldBossCoreAnchor);
if (bossCoreIdx === -1) {
  console.error('Failed to locate boss core anchor in index.html!');
  process.exit(1);
}
html = html.slice(0, bossCoreIdx) + newBossCoreCode + html.slice(bossCoreIdx + oldBossCoreAnchor.length);
console.log('5. Successfully updated drawCustomAnimatedPixelBoss with all elemental cores and Faz 2 effects!');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Round 2 design sheets applied successfully! New file size:', html.length);
