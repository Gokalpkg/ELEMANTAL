const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html normalized length:', html.length);

// =========================================================================
// 1. UPDATE drawBossPixelSugar (SUGAR PRINCESS - FAIRY WINGS & MAGIC SCEPTER)
// =========================================================================
const oldSugarStart = 'function drawBossPixelSugar(ctx, x, cy, r, en, time, isRaged, facingLeft) {';
const oldSugarEnd = 'function drawBossPixelStone(ctx, x, cy, r, en, time, isRaged, facingLeft) {';

const newSugarCode = `function drawBossPixelSugar(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const walkTimer = (en && en.walkTimer) || (time * 0.16);
  const stepPhase = walkTimer * 2.8;
  const floatBob = Math.sin(time * 0.28) * 3.5;
  const sway = Math.sin(stepPhase * 0.5) * 0.04;
  const py = cy + floatBob - r * 0.05;

  ctx.save();
  ctx.translate(x, py);
  ctx.rotate(sway);

  // 0. PERİ KANATLARI (FAIRY WINGS — Pafta Image 2 & 3)
  const wingFlap = Math.sin(time * 0.35) * 0.18;
  ctx.save();
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.2;
  // Sol Peri Kanadı
  ctx.beginPath();
  ctx.ellipse(-r * 0.55, -r * 0.35 + wingFlap * 10, r * 0.35, r * 0.55, -0.45 + wingFlap, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Sağ Peri Kanadı
  ctx.beginPath();
  ctx.ellipse(r * 0.55, -r * 0.35 - wingFlap * 10, r * 0.35, r * 0.55, 0.45 - wingFlap, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Kanat ışıltıları
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-r * 0.55, -r * 0.4, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.4, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 1. İkiz Uzun Dalgalı Pembe Saçlar
  const hairWave1 = Math.sin(stepPhase + 0.6) * (r * 0.14);
  const hairWave2 = Math.cos(stepPhase + 0.3) * (r * 0.12);
  ctx.fillStyle = '#be185d';
  ctx.beginPath();
  ctx.ellipse(-r * 0.52 + hairWave1, -r * 0.15, r * 0.18, r * 0.65, -0.22, 0, Math.PI * 2);
  ctx.ellipse(r * 0.52 + hairWave2, -r * 0.15, r * 0.18, r * 0.65, 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(-r * 0.50 + hairWave1, -r * 0.15, r * 0.14, r * 0.58, -0.22, 0, Math.PI * 2);
  ctx.ellipse(r * 0.50 + hairWave2, -r * 0.15, r * 0.14, r * 0.58, 0.22, 0, Math.PI * 2);
  ctx.fill();

  // 2. YÜRÜYEN BACAKLAR & TOPUKLU AYAKKABILAR (TAM VÜCUT - AYAKLAR %100 GÖRÜNÜR)
  const legStepL = Math.sin(stepPhase) * (r * 0.16);
  const legStepR = Math.sin(stepPhase + Math.PI) * (r * 0.16);

  // SOL BACAK
  const legLX = -r * 0.22;
  const legLY = r * 0.35 + legStepL;
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(legLX, legLY, r * 0.14, r * 0.44);
  ctx.fillStyle = isRaged ? '#ff1744' : '#db2777';
  ctx.fillRect(legLX - 2, legLY + r * 0.42, r * 0.18, r * 0.12);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(legLX + 1, legLY + r * 0.44, 3, 3);

  // SAĞ BACAK
  const legRX = r * 0.14;
  const legRY = r * 0.25 + legStepR;
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(legRX, legRY, r * 0.16, r * 0.54);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(legRX + r * 0.11, legRY, r * 0.05, r * 0.54);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(legRX - 1, legRY + r * 0.46, r * 0.18, 3.5);
  ctx.fillStyle = isRaged ? '#ff1744' : '#db2777';
  ctx.fillRect(legRX - 2, legRY + r * 0.52, r * 0.20, r * 0.12);
  ctx.fillRect(legRX - 2, legRY + r * 0.54, 3, r * 0.08);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(legRX + r * 0.04, legRY + r * 0.54, 3, 3);

  // 3. YÜKSEK YIRTMAÇLI İPEK ETEK
  const skirtWave = Math.sin(stepPhase + 0.8) * (r * 0.06);
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, r * 0.16);
  ctx.lineTo(-r * 0.75 + skirtWave, r * 0.66);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.70, legRX - 2, r * 0.32);
  ctx.lineTo(r * 0.28, r * 0.16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, r * 0.18);
  ctx.lineTo(-r * 0.68 + skirtWave * 0.8, r * 0.62);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.65, legRX, r * 0.30);
  ctx.lineTo(r * 0.25, r * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-r * 0.68 + skirtWave * 0.8, r * 0.62);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.65, legRX, r * 0.30);
  ctx.stroke();

  // 4. İNCE BEL & DOLGUN ÇİLEK KORSAJI
  ctx.fillStyle = '#9f1239';
  ctx.fillRect(-r * 0.22, -r * 0.06, r * 0.44, r * 0.22);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-r * 0.04, -r * 0.04, r * 0.08, r * 0.18);

  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.14, r * 0.15, 0, Math.PI * 2);
  ctx.arc(r * 0.12, -r * 0.14, r * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.14, r * 0.15, -Math.PI * 0.8, -Math.PI * 0.1);
  ctx.arc(r * 0.12, -r * 0.14, r * 0.15, -Math.PI * 0.9, -Math.PI * 0.2);
  ctx.stroke();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, -r * 0.12, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. ZARİF BOYUN & ANİME KAFA
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(-r * 0.06, -r * 0.30, r * 0.12, r * 0.14);

  const headBob = Math.sin(time * 0.28) * (r * 0.02);
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.arc(0, -r * 0.40 + headBob, r * 0.23, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9d174d';
  ctx.beginPath();
  ctx.ellipse(-r * 0.09, -r * 0.40 + headBob, r * 0.05, r * 0.075, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.09, -r * 0.40 + headBob, r * 0.05, r * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-r * 0.08, -r * 0.43 + headBob, 2.5, 0, Math.PI * 2);
  ctx.arc(r * 0.10, -r * 0.43 + headBob, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. ALTIN TAÇ
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-r * 0.16, -r * 0.60 + headBob);
  ctx.lineTo(-r * 0.20, -r * 0.74 + headBob);
  ctx.lineTo(-r * 0.08, -r * 0.65 + headBob);
  ctx.lineTo(0, -r * 0.78 + headBob);
  ctx.lineTo(r * 0.08, -r * 0.65 + headBob);
  ctx.lineTo(r * 0.20, -r * 0.74 + headBob);
  ctx.lineTo(r * 0.16, -r * 0.60 + headBob);
  ctx.closePath();
  ctx.fill();

  // 7. SOL KOL (BELDE ZARİF DURUŞ)
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, -r * 0.10);
  ctx.lineTo(-r * 0.38, 0);
  ctx.lineTo(-r * 0.22, r * 0.08);
  ctx.stroke();

  // 8. SAĞ KOL (LOLİPOP ASASINI HAVADA TUTAR)
  const staffSwing = Math.sin(time * 0.25) * 4;
  const handX = r * 0.42;
  const handY = -r * 0.12 + staffSwing;

  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(r * 0.20, -r * 0.10);
  ctx.lineTo(r * 0.34, -r * 0.05 + staffSwing * 0.5);
  ctx.lineTo(handX, handY);
  ctx.stroke();

  // BÜYÜLÜ KALP VE LOLİPOP ASASI (Magic Heart Scepter — Pafta Image 3)
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(handX - 2, handY + r * 0.55);
  ctx.lineTo(handX + 4, handY - r * 0.55);
  ctx.stroke();

  // Asa Başı (Dönen Kalp & Kristal Lolipop)
  const tipX = handX + 4;
  const tipY = handY - r * 0.55;
  ctx.fillStyle = '#ec4899';
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(tipX, tipY, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tipX - 3, tipY - 2, 3, 0, Math.PI * 2);
  ctx.arc(tipX + 3, tipY - 2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

`;

const sIdx1 = html.indexOf(oldSugarStart);
const sIdx2 = html.indexOf(oldSugarEnd);
html = html.slice(0, sIdx1) + newSugarCode + html.slice(sIdx2);
console.log('1. Successfully updated drawBossPixelSugar!');

// =========================================================================
// 2. UPDATE drawBossPixelNight (NIGHT ARCHON - VAMPIRE LORD & BLOOD SCYTHE)
// =========================================================================
const oldNightStart = 'function drawBossPixelNight(ctx, x, cy, r, en, time, isRaged, facingLeft) {';
const oldNightEnd = 'function drawBossPixelKetchup(ctx, x, cy, r, en, time, isRaged, facingLeft) {';

const newNightCode = `function drawBossPixelNight(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  // KARANLIK KONTU ARCHON (NIGHT ARCHON) — PAFTA IMAGE 5!
  const floatBob = Math.sin(time * 0.32) * 5;
  const wingFlap = Math.sin(time * 0.28) * (r * 0.2);

  ctx.save();
  ctx.translate(x, cy + floatBob - r * 0.05);

  // 1. AYAK ALTINDA SÜZÜLEN MOR-SİYAH HAYALET PARTİKÜLLERİ
  ctx.fillStyle = 'rgba(88, 28, 135, 0.45)';
  for (let m = 0; m < 4; m++) {
    const ma = time * 0.15 + m * 1.6;
    const mx = Math.sin(ma) * (r * 0.6);
    const my = r * 0.55 + Math.abs(Math.cos(ma)) * 8;
    ctx.beginPath();
    ctx.arc(mx, my, 5 + m * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. YARASA KANATLARI
  ctx.fillStyle = '#1e1026';
  ctx.strokeStyle = '#581c87';
  ctx.lineWidth = 2.2;
  // Sol Kanat
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, -r * 0.25);
  ctx.lineTo(-r * 1.15, -r * 0.55 + wingFlap);
  ctx.lineTo(-r * 0.90, -r * 0.10);
  ctx.lineTo(-r * 0.70, r * 0.25);
  ctx.lineTo(-r * 0.20, r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sağ Kanat
  ctx.beginPath();
  ctx.moveTo(r * 0.22, -r * 0.25);
  ctx.lineTo(r * 1.15, -r * 0.55 - wingFlap);
  ctx.lineTo(r * 0.90, -r * 0.10);
  ctx.lineTo(r * 0.70, r * 0.25);
  ctx.lineTo(r * 0.20, r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. GOTİK ARİSTOKRAT ROBE & PELERİN
  ctx.fillStyle = '#0f0714';
  ctx.fillRect(-r * 0.32, -r * 0.10, r * 0.64, r * 0.62);

  ctx.fillStyle = '#4c0519';
  ctx.fillRect(-r * 0.14, r * 0.05, r * 0.28, r * 0.45);

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(-r * 0.22, r * 0.45, r * 0.14, r * 0.25);
  ctx.fillRect(r * 0.08, r * 0.45, r * 0.14, r * 0.25);

  // 4. PARLAYAN MOR GÖLGE ÇEKİRDEĞİ
  const corePulse = 0.8 + Math.sin(time * 0.18) * 0.25;
  ctx.save();
  ctx.fillStyle = '#c084fc';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 15 * corePulse;
  ctx.beginPath();
  ctx.arc(0, -r * 0.08, 6.5 * corePulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, -r * 0.08, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 5. KAFA & SOLGUN VAMPİR YÜZÜ
  ctx.fillStyle = '#1e1026';
  ctx.beginPath();
  ctx.arc(0, -r * 0.45, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(0, -r * 0.44, r * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff1744';
  ctx.shadowColor = '#ff1744';
  ctx.shadowBlur = 8;
  ctx.fillRect(-r * 0.10, -r * 0.46, 5, 3);
  ctx.fillRect(r * 0.03, -r * 0.46, 5, 3);
  ctx.shadowBlur = 0;

  // Faz 2: Aşırı Yüklü Gölge Tacı
  if (isRaged) {
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#d8b4fe';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, -r * 0.60);
    ctx.lineTo(-r * 0.24, -r * 0.85);
    ctx.lineTo(-r * 0.08, -r * 0.70);
    ctx.lineTo(0, -r * 0.90);
    ctx.lineTo(r * 0.08, -r * 0.70);
    ctx.lineTo(r * 0.24, -r * 0.85);
    ctx.lineTo(r * 0.18, -r * 0.60);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 6. KAN TIRPANI (Blood Scythe — Pafta 5)
  const scytheX = r * 0.65;
  const scytheY = -r * 0.10;
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(scytheX - 8, scytheY + r * 0.6);
  ctx.lineTo(scytheX + 6, scytheY - r * 0.7);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(scytheX + 6, scytheY - r * 0.7);
  ctx.quadraticCurveTo(scytheX + r * 0.65, scytheY - r * 0.85, scytheX + r * 0.50, scytheY - r * 0.40);
  ctx.quadraticCurveTo(scytheX + r * 0.40, scytheY - r * 0.60, scytheX + 4, scytheY - r * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

`;

const nIdx1 = html.indexOf(oldNightStart);
const nIdx2 = html.indexOf(oldNightEnd);
html = html.slice(0, nIdx1) + newNightCode + html.slice(nIdx2);
console.log('2. Successfully updated drawBossPixelNight!');

// =========================================================================
// 3. UPDATE drawBossPixelKetchup (KETCHUP WARLORD - SERIOUS GOTHIC KNIGHT)
// =========================================================================
const oldKetchupStart = 'function drawBossPixelKetchup(ctx, x, cy, r, en, time, isRaged, facingLeft) {';
const oldKetchupEnd = 'const BOSS_PIXEL_SPRITES = {};';

const newKetchupCode = `function drawBossPixelKetchup(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  // KETÇAP SAVAŞ LORDU (KETCHUP WARLORD) — PAFTA IMAGE 4!
  const stepPhase = ((en && en.walkTimer) || (time * 0.16)) * 2.8;
  const heaveY = Math.abs(Math.sin(stepPhase)) * 2.5;

  ctx.save();
  ctx.translate(x, cy - heaveY - r * 0.05);

  // 1. UZUN BORDO AT KUYRUĞU SORGUR (Long Plume)
  const plumeWave = Math.sin(stepPhase + 0.4) * 8;
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(-r * 0.15, -r * 0.85);
  ctx.quadraticCurveTo(-r * 0.70 + plumeWave, -r * 0.95, -r * 1.05 + plumeWave, -r * 0.65);
  ctx.quadraticCurveTo(-r * 0.65 + plumeWave, -r * 0.75, -r * 0.10, -r * 0.75);
  ctx.closePath();
  ctx.fill();

  // 2. BACAKLAR & DEMİR ÇİZMELER (Adımlarda Ketçap Sıçrar)
  const legL = Math.sin(stepPhase) * (r * 0.2);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.2);

  ctx.fillStyle = '#450a0a';
  ctx.fillRect(-r * 0.42, r * 0.35 + legL, r * 0.26, r * 0.45);
  ctx.fillRect(r * 0.16, r * 0.35 + legR, r * 0.26, r * 0.45);

  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-r * 0.48, r * 0.74 + legL, r * 0.34, r * 0.14);
  ctx.fillRect(r * 0.14, r * 0.74 + legR, r * 0.34, r * 0.14);

  // Sıçrayan ketçap sosu
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-r * 0.52, r * 0.84 + legL, 6, 3);
  ctx.fillRect(r * 0.38, r * 0.84 + legR, 6, 3);

  // 3. GÖVDE & GOTİK PLAKA ZIRH
  bossPixDisk(ctx, 0, 0, r * 0.66, '#7f1d1d', '#450a0a', '#991b1b');

  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.2); ctx.lineTo(0, r * 0.15); ctx.lineTo(r * 0.42, -r * 0.2);
  ctx.stroke();

  // 4. PARLAYAN KETÇAP ÇEKİRDEĞİ (Core Parlaması)
  const corePulse = 0.8 + Math.sin(time * 0.2) * 0.25;
  ctx.save();
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 14 * corePulse;
  ctx.beginPath();
  ctx.arc(0, -r * 0.05, 7.5 * corePulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, -r * 0.05, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 5. MİĞFER & PARLAYAN GÖZ VİZÖRÜ
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(0, -r * 0.52, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-r * 0.18, -r * 0.56, r * 0.36, 6);

  ctx.fillStyle = isRaged ? '#ef4444' : '#f59e0b';
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 8;
  ctx.fillRect(-r * 0.12, -r * 0.55, 6, 3);
  ctx.fillRect(r * 0.04, -r * 0.55, 6, 3);
  ctx.shadowBlur = 0;

  // Faz 2: Miğferden çıkan alevli rünik boynuzlar
  if (isRaged) {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, -r * 0.65); ctx.lineTo(-r * 0.45, -r * 0.95); ctx.lineTo(-r * 0.10, -r * 0.72);
    ctx.moveTo(r * 0.18, -r * 0.65); ctx.lineTo(r * 0.45, -r * 0.95); ctx.lineTo(r * 0.10, -r * 0.72);
    ctx.fill();
  }

  // 6. SOL KOL (ZIRHLI OMUZLUK)
  const armL = Math.sin(stepPhase + Math.PI) * (r * 0.14);
  bossPixDisk(ctx, -r * 0.72, -r * 0.10 + armL, r * 0.22, '#7f1d1d', '#450a0a');

  // 7. SAĞ KOL & ALEVLİ DEV KILIÇ (Alevli Dev Kılıç — Pafta 4)
  const armR = Math.sin(stepPhase) * (r * 0.14);
  bossPixDisk(ctx, r * 0.65, -r * 0.05 + armR, r * 0.20, '#7f1d1d', '#450a0a');

  const swordX = r * 0.85;
  const swordY = r * 0.15 + armR;
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(swordX - 10, swordY + 6);
  ctx.lineTo(swordX + 8, swordY - 6);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(swordX - 4, swordY + 4);
  ctx.lineTo(swordX + 18, swordY - 28);
  ctx.lineTo(swordX + 26, swordY - 26);
  ctx.lineTo(swordX + 6, swordY + 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Kılıç Alevi
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(swordX + 12, swordY - 16);
  ctx.lineTo(swordX + 28, swordY - 34);
  ctx.lineTo(swordX + 22, swordY - 20);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

`;

const kIdx1 = html.indexOf(oldKetchupStart);
const kIdx2 = html.indexOf(oldKetchupEnd);
html = html.slice(0, kIdx1) + newKetchupCode + html.slice(kIdx2);
console.log('3. Successfully updated drawBossPixelKetchup!');

// =========================================================================
// 4. UPDATE hazards.forEach WITH STICKY CARAMEL POND AND KETCHUP SLIDE
// =========================================================================
const oldHazardStart = 'hazards.forEach(h => {\n    drawGroundShadow(h.x + 3, h.y + 8, h.r * 0.95, h.r * 0.42);';
const oldHazardEnd = '  drawBossTelegraphs(ctx, time);';

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
      // HÜCUM BUZ İZİ & DONMUŞ KRİSTAL ZEMİN — PAFTA 2
      ctx.fillStyle = 'rgba(6, 24, 40, 0.65)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

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
      // ELEKTRİKLİ ZEMİN ÇATLAĞI & STATİK ARK İZİ — PAFTA 3
      ctx.fillStyle = 'rgba(15, 10, 28, 0.6)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(h.x - h.r * 0.3, h.y - 6); ctx.lineTo(h.x, h.y - 12);
      ctx.moveTo(h.x + h.r * 0.2, h.y + 7); ctx.lineTo(h.x + h.r * 0.5, h.y + 11);
      ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (h.type === 'water') {
      // GİRDAP ALAN EFEKTİ — PAFTA 4
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
      // KAN TUZU TUZAĞI & KAN GİRDABI — PAFTA 5
      ctx.fillStyle = 'rgba(20, 8, 14, 0.7)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      const sqSize = h.r * 0.7;
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 10;
      ctx.strokeRect(h.x - sqSize, h.y - sqSize * 0.5, sqSize * 2, sqSize);

      ctx.fillStyle = 'rgba(183, 28, 28, 0.45)';
      ctx.fillRect(h.x - sqSize + 2, h.y - sqSize * 0.5 + 2, sqSize * 2 - 4, sqSize - 4);
      ctx.shadowBlur = 0;

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
      });

    } else if (h.type === 'caramel') {
      // =========================================================================
      // YAPIŞKAN KARAMEL GÖLETİ (STICKY CARAMEL POND) — PAFTA IMAGE 2!
      // =========================================================================
      ctx.fillStyle = 'rgba(180, 83, 9, 0.7)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let cr = 3; cr <= h.r * 0.8; cr += 3.5) {
        const theta = cr * 0.2 + time * 0.05;
        const cx = h.x + Math.cos(theta) * cr;
        const cy = h.y + Math.sin(theta) * (cr * 0.55);
        if (cr === 3) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

    } else if (h.type === 'ketchup') {
      // =========================================================================
      // KAYGAN KETÇAP ŞERİDİ (WARLORD KETCHUP SLIDE) — PAFTA IMAGE 4!
      // =========================================================================
      ctx.fillStyle = 'rgba(185, 28, 28, 0.75)';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(h.x, h.y, h.r, h.r * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(h.x - h.r * 0.3, h.y - 3, 4, 3);
      ctx.fillRect(h.x + h.r * 0.2, h.y + 2, 5, 3);

    } else {
      ctx.beginPath(); ctx.ellipse(h.x, h.y, h.r, h.r * 0.55, 0, 0, Math.PI*2);
      const hFill = h.type==='sand' ? '#c9a66b' : '#1e8449';
      const hStroke = h.type==='sand' ? '#f5deb3' : '#3ddc84';
      ctx.fillStyle = visHex(hFill, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.globalAlpha = 0.45 + Math.sin(time*0.08)*0.08;
      ctx.fill();
      ctx.globalAlpha = 0.75; ctx.strokeStyle = visHex(hStroke, visualMode==='ketchup' ? 'floor' : 'char');
      ctx.lineWidth = 2.2; ctx.stroke();
    }
    ctx.restore();
  });

  drawBossTelegraphs(ctx, time);`;

const hIdx1 = html.indexOf(oldHazardStart);
const hIdx2 = html.indexOf(oldHazardEnd);
html = html.slice(0, hIdx1) + newHazardCode + html.slice(hIdx2 + oldHazardEnd.length);
console.log('4. Successfully updated hazards.forEach with Caramel Pond and Ketchup Slide!');

// =========================================================================
// 5. UPDATE drawUnifiedBiomeWorldFloor (ALL 10 BIOMES WITH COMPLETE SET PIECES)
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
    // 3. BÜYÜLÜ ŞEKER KRALLIĞI — PAFTA IMAGE 2!
    ctx.fillStyle = '#2d091e';
    ctx.fillRect(left, top, width, height);

    const pG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    pG.addColorStop(0, 'rgba(92, 18, 58, 0.45)');
    pG.addColorStop(1, 'rgba(25, 4, 16, 0.95)');
    ctx.fillStyle = pG;
    ctx.fillRect(left, top, width, height);

    // Pamuk Şeker Tepeleri
    ctx.fillStyle = 'rgba(244, 114, 182, 0.18)';
    const pkStep = 220;
    const pkStartX = Math.floor(left / pkStep) * pkStep;
    for (let x = pkStartX; x <= right; x += pkStep) {
      ctx.beginPath();
      ctx.ellipse(x + 50, top + (bottom - top) * 0.5, 110, (bottom - top) * 0.45, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lolipop Sütunları & Baloncuklu Karamel Göletleri (Pafta 2)
    const lpStep = 200;
    const lpStartX = Math.floor(left / lpStep) * lpStep;
    const lpStartY = Math.floor(top / lpStep) * lpStep;
    for (let lx = lpStartX; lx <= right; lx += lpStep) {
      for (let ly = lpStartY; ly <= bottom; ly += lpStep) {
        const seed = Math.sin(lx * 23.45 + ly * 87.65) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.45) {
          const px = lx + fract * 80;
          const py = ly + (1 - fract) * 80;

          if (fract > 0.72) {
            // Lolipop Sütunu / Ağacı
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath(); ctx.ellipse(px, py + 24, 14, 5, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(px - 3, py - 10, 6, 34);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(px - 3, py - 4, 6, 5);
            ctx.fillRect(px - 3, py + 10, 6, 5);

            const lCol = fract > 0.85 ? '#ec4899' : '#06b6d4';
            ctx.fillStyle = lCol;
            ctx.beginPath(); ctx.arc(px, py - 16, 16, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(px, py - 16, 10, 0, Math.PI * 1.5);
            ctx.stroke();
          } else {
            // Baloncuklu Karamel Göleti
            ctx.fillStyle = 'rgba(180, 83, 9, 0.45)';
            ctx.beginPath();
            ctx.ellipse(px, py, 26, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath(); ctx.arc(px + 4, py - 2, 4, 0, Math.PI * 2); ctx.fill();
          }
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

    // Biyolüminesans Mantarlar
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
    // 5. BUZUL DAĞLARI BİYOMU — PAFTA 2 (KUTUP HÜKÜMDARI YETİ)
    ctx.fillStyle = '#061320';
    ctx.fillRect(left, top, width, height);

    const iceG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    iceG.addColorStop(0, 'rgba(8, 32, 54, 0.45)');
    iceG.addColorStop(1, 'rgba(3, 10, 18, 0.95)');
    ctx.fillStyle = iceG;
    ctx.fillRect(left, top, width, height);

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

    // Sivri Prizmatik Dev Buz Kristalleri
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

          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(spX, spY + 2, spW * 1.2, 5, 0, 0, Math.PI * 2);
          ctx.fill();

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

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#80d8ff';
    ctx.shadowBlur = 4;
    for (let s = 0; s < 18; s++) {
      const sx = left + (((s * 97 + time * 20) % width));
      const sy = top + (((s * 73 + time * 35) % height));
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

  } else if (bk === 'storm') {
    // 6. FIRTINA TEPELERİ BİYOMU — PAFTA 3 (YILDIRIM TİTANI RAİJİN)
    ctx.fillStyle = '#0c0b16';
    ctx.fillRect(left, top, width, height);

    const stmG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    stmG.addColorStop(0, 'rgba(26, 20, 52, 0.45)');
    stmG.addColorStop(1, 'rgba(8, 7, 14, 0.95)');
    ctx.fillStyle = stmG;
    ctx.fillRect(left, top, width, height);

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

    // Sivri Altın Şimşek Kristalleri & Antik Harabe Sütunları
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
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath(); ctx.ellipse(px + 8, py + 28, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#2d283e';
            ctx.fillRect(px, py - 10, 16, 38);
            ctx.fillStyle = '#443d5c';
            ctx.fillRect(px - 3, py - 14, 22, 5);
            ctx.fillRect(px - 3, py + 25, 22, 5);
          } else {
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
    // 8. KAN VADİSİ BİYOMU — PAFTA 5 (BLOOD VALLEY BIOME ASSETS)
    ctx.fillStyle = '#100609';
    ctx.fillRect(left, top, width, height);

    const bldG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    bldG.addColorStop(0, 'rgba(42, 10, 18, 0.5)');
    bldG.addColorStop(1, 'rgba(12, 3, 6, 0.95)');
    ctx.fillStyle = bldG;
    ctx.fillRect(left, top, width, height);

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
          // RÜNLÜ KAN ALTARI
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.beginPath(); ctx.ellipse(px, py + 12, 34, 12, 0, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = '#2b1b22';
          ctx.beginPath();
          ctx.ellipse(px, py + 8, 30, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#3f222d';
          ctx.beginPath();
          ctx.ellipse(px, py, 22, 7, 0, 0, Math.PI * 2);
          ctx.fill();

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
          // YARASA KAFATASI SÜTUNU
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.beginPath(); ctx.ellipse(px, py + 26, 12, 5, 0, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = '#26171d';
          ctx.fillRect(px - 6, py - 16, 12, 40);

          ctx.fillStyle = '#ded5d8';
          ctx.beginPath();
          ctx.arc(px, py - 20, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(px - 5, py - 23); ctx.lineTo(px - 9, py - 30); ctx.lineTo(px - 2, py - 24);
          ctx.moveTo(px + 5, py - 23); ctx.lineTo(px + 9, py - 30); ctx.lineTo(px + 2, py - 24);
          ctx.fill();

          ctx.fillStyle = '#ff1744';
          ctx.fillRect(px - 3, py - 20, 2, 2);
          ctx.fillRect(px + 1, py - 20, 2, 2);

        } else if (fract > 0.32) {
          // SİVRİ KAN TUZU KRİSTALLERİ
          ctx.fillStyle = '#dc2626';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(px, py - 16); ctx.lineTo(px + 6, py); ctx.lineTo(px - 6, py); ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Uçuşan Yarasa Siluetleri
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

  } else if (bk === 'ketchup') {
    // 9. SOS ARENASI BİYOMU — PAFTA IMAGE 4 (KETÇAP SAVAŞ LORDU)
    ctx.fillStyle = '#1a0608';
    ctx.fillRect(left, top, width, height);

    const ktG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    ktG.addColorStop(0, 'rgba(69, 10, 10, 0.55)');
    ktG.addColorStop(1, 'rgba(18, 3, 4, 0.98)');
    ctx.fillStyle = ktG;
    ctx.fillRect(left, top, width, height);

    // Kaynayan Ketçap & Hardal Nehirleri
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 16;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 14;
    const kStep = 240;
    const kStartX = Math.floor(left / kStep) * kStep;
    for (let x = kStartX; x <= right; x += kStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 60, top + 140, x - 50, top + 300, x + 40, bottom);
      ctx.stroke();
    }
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 5;
    for (let x = kStartX; x <= right; x += kStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 60, top + 140, x - 50, top + 300, x + 40, bottom);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Dairesel Taş Arena Zemin Plakaları
    const arStep = 220;
    const arStartX = Math.floor(left / arStep) * arStep;
    const arStartY = Math.floor(top / arStep) * arStep;
    for (let ax = arStartX; ax <= right; ax += arStep) {
      for (let ay = arStartY; ay <= bottom; ay += arStep) {
        const seed = Math.sin(ax * 19.81 + ay * 62.43) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.55) {
          const px = ax + fract * 70;
          const py = ay + (1 - fract) * 70;
          ctx.fillStyle = '#291417';
          ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#450a0a';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

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
html = html.slice(0, floorIdx1) + newFloorFunction + html.slice(floorIdx2);
console.log('5. Successfully updated drawUnifiedBiomeWorldFloor with Candy Kingdom and Sauce Arena!');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Round 3 design sheets applied successfully! New file size:', html.length);
