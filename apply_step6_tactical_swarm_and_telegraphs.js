const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. DRAW DISRUPTOR PROTECTIVE SHIELD AURA AROUND BUFFED MOBS
// -------------------------------------------------------------
const oldDisruptorRender = `  } else if (type === 'disruptor') {
    // Bozucu: Mor kozmik rün aurası
    ctx.save();
    const aPulse = Math.sin(time * 0.18 + en.phase) * 0.15;
    ctx.strokeStyle = 'rgba(168, 85, 247, ' + (0.32 + aPulse) + ')';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(en.x, cy, 115, 0, Math.PI * 2);
    ctx.stroke();
    // Inner orbital rune motes
    for (let rk = 0; rk < 3; rk++) {
      const ma = time * 0.08 + (rk * Math.PI * 2 / 3);
      const mx = en.x + Math.cos(ma) * 38;
      const my = cy + Math.sin(ma) * 22;
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.round(mx - 2), Math.round(my - 2), 4, 4);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }`;

const newDisruptorRender = `  } else if (type === 'disruptor') {
    // Bozucu: Mor kozmik rün aurası
    ctx.save();
    const aPulse = Math.sin(time * 0.18 + en.phase) * 0.15;
    ctx.strokeStyle = 'rgba(168, 85, 247, ' + (0.32 + aPulse) + ')';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(en.x, cy, 115, 0, Math.PI * 2);
    ctx.stroke();
    // Inner orbital rune motes
    for (let rk = 0; rk < 3; rk++) {
      const ma = time * 0.08 + (rk * Math.PI * 2 / 3);
      const mx = en.x + Math.cos(ma) * 38;
      const my = cy + Math.sin(ma) * 22;
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.round(mx - 2), Math.round(my - 2), 4, 4);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // STEP 6: Disruptor Fortification Hex Shield on Buffed Mobs
  if (en.hasDisruptorBuff && en.type !== 'disruptor') {
    ctx.save();
    ctx.strokeStyle = 'rgba(192, 132, 252, ' + (0.45 + Math.sin(time * 0.25) * 0.2) + ')';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 6;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(en.x, cy, en.r + 4.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }`;

if (html.includes(oldDisruptorRender)) {
  html = html.replace(oldDisruptorRender, newDisruptorRender);
  changes++;
  console.log('[1] Added Disruptor Fortification Shield Aura to buffed enemies');
} else {
  console.warn('[1] Warning: oldDisruptorRender not found');
}

// -------------------------------------------------------------
// 2. ENHANCE MARKSMAN LASER TELEGRAPHING WITH EXTENDED BEAM & SOUND CUE
// -------------------------------------------------------------
const oldMarksmanLaserRender = `    // Nişan alma aşamasında kırmızı lazer uyarısı
    if (en.snipeAimT > 0) {
      const aimP = en.snipeAimT / 48;
      ctx.strokeStyle = 'rgba(239, 68, 68, ' + (0.35 + Math.sin(time * 0.4) * 0.3) + ')';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(en.x, cy);
      ctx.lineTo(en.aimX, en.aimY);
      ctx.stroke();
      // Oyuncunun ayağında kırmızı hedef artı göstergesi
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([]);
      ctx.strokeRect(en.aimX - 7, en.aimY - 7, 14, 14);
      ctx.beginPath();
      ctx.moveTo(en.aimX - 10, en.aimY); ctx.lineTo(en.aimX + 10, en.aimY);
      ctx.moveTo(en.aimX, en.aimY - 10); ctx.lineTo(en.aimX, en.aimY + 10);
      ctx.stroke();
    }`;

const newMarksmanLaserRender = `    // Nişan alma aşamasında kırmızı lazer uyarısı
    if (en.snipeAimT > 0) {
      const aimP = en.snipeAimT / 48;
      const isAboutToShoot = en.snipeAimT <= 16;
      const sang = Math.atan2(en.aimY - cy, en.aimX - en.x);
      
      // Uzayan keskin nişancı hedefleme lazer çizgisi
      const beamLen = 420;
      const endX = en.x + Math.cos(sang) * beamLen;
      const endY = cy + Math.sin(sang) * beamLen;

      ctx.save();
      ctx.strokeStyle = isAboutToShoot ? '#ffffff' : ('rgba(239, 68, 68, ' + (0.45 + Math.sin(time * 0.6) * 0.35) + ')');
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = isAboutToShoot ? 12 : 5;
      ctx.lineWidth = isAboutToShoot ? 2.8 : 1.6;
      ctx.setLineDash(isAboutToShoot ? [] : [7, 4]);
      ctx.beginPath();
      ctx.moveTo(en.x, cy);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Kırmızı lazer hedef artı göstergesi
      ctx.strokeStyle = isAboutToShoot ? '#ffffff' : '#ef4444';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
      ctx.strokeRect(en.aimX - 8, en.aimY - 8, 16, 16);
      ctx.beginPath();
      ctx.moveTo(en.aimX - 12, en.aimY); ctx.lineTo(en.aimX + 12, en.aimY);
      ctx.moveTo(en.aimX, en.aimY - 12); ctx.lineTo(en.aimX, en.aimY + 12);
      ctx.stroke();
      ctx.restore();
    }`;

if (html.includes(oldMarksmanLaserRender)) {
  html = html.replace(oldMarksmanLaserRender, newMarksmanLaserRender);
  changes++;
  console.log('[2] Enhanced Marksman red laser telegraph beam and lock-on visuals');
} else {
  console.warn('[2] Warning: oldMarksmanLaserRender not found');
}

// -------------------------------------------------------------
// 3. MARKSMAN LOCK-ON AUDIO CUE ON LAST 250MS BEFORE SHOT
// -------------------------------------------------------------
const oldMarksmanAiBlock = `    // STEP 5: MARKSMAN CHARGE & SNIPER BEAM
    if (en.type === 'marksman') {
      en.sniperTimer = (en.sniperTimer || 140) - dt;
      if (en.snipeAimT > 0) {
        // Hedefe kilitlenme: Oyuncuyu hafif gecikmeyle takip eder (dash ile kaçılabilir)
        en.aimX += (player.x - en.aimX) * 0.10;
        en.aimY += (player.y - en.aimY) * 0.10;
        en.snipeAimT -= dt;
        if (en.snipeAimT <= 0) {`;

const newMarksmanAiBlock = `    // STEP 5: MARKSMAN CHARGE & SNIPER BEAM
    if (en.type === 'marksman') {
      en.sniperTimer = (en.sniperTimer || 140) - dt;
      if (en.snipeAimT > 0) {
        // Hedefe kilitlenme: Oyuncuyu hafif gecikmeyle takip eder (dash ile kaçılabilir)
        en.aimX += (player.x - en.aimX) * 0.10;
        en.aimY += (player.y - en.aimY) * 0.10;
        if (en.snipeAimT <= 16 && !en._warnedShoot) {
          en._warnedShoot = true;
          synthBlip('hit'); // 250ms sharp lock-on audio warning
        }
        en.snipeAimT -= dt;
        if (en.snipeAimT <= 0) {
          en._warnedShoot = false;`;

if (html.includes(oldMarksmanAiBlock)) {
  html = html.replace(oldMarksmanAiBlock, newMarksmanAiBlock);
  changes++;
  console.log('[3] Added 250ms lock-on audio cue before marksman fires');
} else {
  console.warn('[3] Warning: oldMarksmanAiBlock not found');
}

// -------------------------------------------------------------
// 4. SHIELD BEARER BLOCK RICOCHET SPARKS IN takeDamage
// -------------------------------------------------------------
const oldBearerBlockJuice = `      dealt = Math.max(1, Math.round(dealt * 0.15)); // 85% Damage Block!
      en.shieldBlocked = 12;
      playSfx('block', 0.42, 100);
      shake = Math.max(shake, 3.5);
      burst(en.x + Math.cos(facingAngle) * (en.r + 4), en.y + Math.sin(facingAngle) * (en.r + 4), '#38bdf8', 10, 3.0);
      spawnFloatText(en.x, en.y - 24, '🛡️ BLOK!', '#38bdf8', 'small');`;

const newBearerBlockJuice = `      dealt = Math.max(1, Math.round(dealt * 0.15)); // 85% Damage Block!
      en.shieldBlocked = 14;
      playSfx('block', 0.50, 100);
      shake = Math.max(shake, 4.0);
      const bX = en.x + Math.cos(facingAngle) * (en.r + 5);
      const bY = en.y + Math.sin(facingAngle) * (en.r + 5);
      burst(bX, bY, '#38bdf8', 12, 3.5);
      burst(bX, bY, '#ffffff', 6, 2.0);
      // Directional ricochet sparks bouncing backward
      for (let rs = 0; rs < 4; rs++) {
        const rAng = facingAngle + Math.PI + (Math.random() - 0.5) * 0.8;
        sparks.push({ x: bX, y: bY, vx: Math.cos(rAng) * 4.5, vy: Math.sin(rAng) * 4.5, r: 2.5, life: 0.3, maxLife: 0.3, color: '#38bdf8', rot: 0, vr: 0 });
      }
      spawnFloatText(en.x, en.y - 24, '🛡️ BLOK!', '#38bdf8', 'small');`;

if (html.includes(oldBearerBlockJuice)) {
  html = html.replace(oldBearerBlockJuice, newBearerBlockJuice);
  changes++;
  console.log('[4] Added ricochet spark bounce to Shield Bearer blocks');
} else {
  console.warn('[4] Warning: oldBearerBlockJuice not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 6 patch script. Total successful patches: ${changes}/4`);
