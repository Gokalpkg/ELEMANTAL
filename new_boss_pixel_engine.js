// =========================================================================
// 10 BOSS PURE PROCEDURAL PIXEL-ART ENGINE (SPLASH-ART ACCURATE & DETAILED)
// =========================================================================

// 1. ŞEKER PRENSESİ (Şeker Diyarı Kraliçesi - Splash Art: Seductive Twin-Tail Anime Boss)
function drawBossPixelSugar(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const walkTimer = en.walkTimer || (time * 0.16);
  const stepPhase = walkTimer * 2.8;
  const floatBob = Math.sin(time * 0.28) * 5;
  const sway = Math.sin(stepPhase * 0.5) * 0.05;
  const py = cy + floatBob;
  const dir = facingLeft ? -1 : 1;

  ctx.save();
  ctx.translate(x, py);
  ctx.rotate(sway);

  // 1. İkiz Uzun Pembe Saç Lüleleri (Arka Katman - Rüzgarda ve adımlarla dalgalanır)
  const hairWave1 = Math.sin(stepPhase + 0.6) * (r * 0.12);
  const hairWave2 = Math.cos(stepPhase + 0.3) * (r * 0.10);
  ctx.fillStyle = '#be185d';
  // Sol atkuyruğu arkası
  ctx.beginPath();
  ctx.ellipse(-r * 0.55 + hairWave1, -r * 0.1, r * 0.22, r * 0.68, -0.25, 0, Math.PI * 2);
  ctx.fill();
  // Sağ atkuyruğu arkası
  ctx.beginPath();
  ctx.ellipse(r * 0.55 + hairWave2, -r * 0.1, r * 0.22, r * 0.68, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(-r * 0.52 + hairWave1, -r * 0.1, r * 0.18, r * 0.62, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.52 + hairWave2, -r * 0.1, r * 0.18, r * 0.62, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 2. ADIM ATAN BACAKLAR & YÜKSEK YIRTMAÇLI ETEK (HIGH-SLIT SKIRT)
  // Splash Art Tasarımı: Bir bacak yüksek yırtmaçtan açıkça görünür!
  const legStepL = Math.sin(stepPhase) * (r * 0.18);
  const legStepR = Math.sin(stepPhase + Math.PI) * (r * 0.18);

  // Sol bacak (Etek altından adım atar)
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(-r * 0.30, r * 0.42 + legStepL, r * 0.15, r * 0.42);
  // Sol ayakkabı
  ctx.fillStyle = isRaged ? '#ff1744' : '#d81b60';
  ctx.fillRect(-r * 0.32, r * 0.78 + legStepL, r * 0.18, r * 0.14);

  // Sağ bacak (YIRTMAÇTAN AÇIKTA KALAN GÖZ ALICI BACAK)
  const slitLegX = r * 0.12;
  const slitLegY = r * 0.28 + legStepR;
  // Kalçadan ayak bileğine uzanan ten bacak
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(slitLegX, slitLegY, r * 0.18, r * 0.56);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(slitLegX + r * 0.12, slitLegY, r * 0.06, r * 0.56); // Bacak gölgesi
  // Ayak bileğinde altın halhal
  ctx.fillStyle = '#facc15';
  ctx.fillRect(slitLegX - 1, slitLegY + r * 0.46, r * 0.20, 3);
  // Zarif fuşya topuklu ayakkabı ve çilek fiyonku
  ctx.fillStyle = isRaged ? '#ff1744' : '#d81b60';
  ctx.fillRect(slitLegX - 2, slitLegY + r * 0.52, r * 0.22, r * 0.14);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(slitLegX + r * 0.04, slitLegY + r * 0.54, 3, 3);

  // 3. YIRTMAÇLI KRALİYET ETEĞİ (High-Slit Gown with Strawberry Ribbons & Gold Filigree)
  const skirtWave = Math.sin(stepPhase + 1) * (r * 0.08);
  // Koyu fuşya etek astarı
  ctx.fillStyle = '#880e4f';
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, r * 0.16);
  ctx.lineTo(-r * 0.92 + skirtWave, r * 0.76);
  ctx.quadraticCurveTo(-r * 0.2, r * 0.84, slitLegX, r * 0.36); // Yırtmaç açılışı
  ctx.lineTo(r * 0.35, r * 0.16);
  ctx.closePath();
  ctx.fill();

  // Canlı şeker pembesi ana etek katmanı
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(-r * 0.38, r * 0.18);
  ctx.lineTo(-r * 0.82 + skirtWave * 0.8, r * 0.70);
  ctx.quadraticCurveTo(-r * 0.2, r * 0.76, slitLegX + 2, r * 0.34);
  ctx.lineTo(r * 0.32, r * 0.18);
  ctx.closePath();
  ctx.fill();

  // Etek ucunda altın filigran işlemeler
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-r * 0.82 + skirtWave * 0.8, r * 0.70);
  ctx.quadraticCurveTo(-r * 0.2, r * 0.76, slitLegX + 2, r * 0.34);
  ctx.stroke();

  // Beyaz dantel fırfırları
  ctx.fillStyle = '#ffffff';
  for (let d = -0.7; d <= 0.05; d += 0.22) {
    ctx.beginPath();
    ctx.arc(d * r + skirtWave * 0.8, r * 0.70, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. ÇİLEK KURDELELİ DEKOLTE KORSAJ (Voluptuous Strawberry Ribbon Corset)
  // Bel kemeri ve altın toka
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(-r * 0.34, r * 0.12, r * 0.68, r * 0.09);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-r * 0.10, r * 0.10, r * 0.20, r * 0.13);
  ctx.fillStyle = '#ff1744';
  ctx.fillRect(-r * 0.04, r * 0.12, r * 0.08, r * 0.09);

  // Göğüs korsajı (Pastel pembe ve kırmızı çilek kurdeleleri)
  pixDisk(0, 0, r * 0.44, '#fbcfe8', '#f472b6', '#db2777');
  // Dekolte büst detayı
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.04, r * 0.15, 0, Math.PI * 2);
  ctx.arc(r * 0.12, -r * 0.04, r * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Çilek kurdelesi
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(0, -r * 0.02, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e'; // Çilek yaprağı
  ctx.fillRect(-r * 0.04, -r * 0.08, r * 0.08, 3);

  // 5. SOL KOL & SAĞ KOL (Dev Şeker Kamışı / Lolipop Büyü Asası)
  const armL = Math.sin(stepPhase) * (r * 0.08);
  // Sol Kol
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(-dir * r * 0.50, r * 0.02 + armL, r * 0.15, r * 0.36);
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(-dir * r * 0.54, -r * 0.02 + armL, r * 0.20, r * 0.14); // Omuz fırfırı

  // Sağ Kol & Dev Lolipop Büyü Asası (Candy Cane Scepter)
  const staffX = dir * r * 0.58;
  const staffY = -r * 0.02 - armL;
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(staffX - r * 0.08, staffY, r * 0.16, r * 0.34);
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(staffX - r * 0.10, staffY - r * 0.04, r * 0.20, r * 0.14);

  // Asa Gövdesi (Kırmızı-Beyaz Şeker Kamışı Çubuğu)
  ctx.save();
  ctx.translate(staffX + dir * r * 0.04, staffY - r * 0.32);
  ctx.rotate(dir * 0.18 + Math.sin(time * 0.2) * 0.08);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-r * 0.045, -r * 0.65, r * 0.09, r * 1.6);
  // Kırmızı şeker kamışı sarmalları
  ctx.fillStyle = '#e11d48';
  for (let sw = -0.55; sw < 0.8; sw += 0.22) {
    ctx.fillRect(-r * 0.045, sw * r, r * 0.09, r * 0.08);
  }

  // Devasa Lolipop Başlığı (Döner halkalı spiral çilek nane şekeri)
  const lolY = -r * 0.75;
  ctx.fillStyle = '#be185d';
  ctx.beginPath(); ctx.arc(0, lolY, r * 0.36, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath(); ctx.arc(0, lolY, r * 0.30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, lolY, r * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e11d48';
  ctx.beginPath(); ctx.arc(0, lolY, r * 0.14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath(); ctx.arc(0, lolY, r * 0.06, 0, Math.PI * 2); ctx.fill();

  // Asanın tepesinde parlayan 4 köşeli kristal yıldız
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ff4081';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(0, lolY - r * 0.50);
  ctx.lineTo(r * 0.10, lolY - r * 0.38);
  ctx.lineTo(0, lolY - r * 0.26);
  ctx.lineTo(-r * 0.10, lolY - r * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // 6. GÖZ ALICI ANİME YÜZÜ, KÂKÜLLER VE KRALİYET TACI
  // Ten rengi yüz
  pixDisk(0, -r * 0.38, r * 0.40, '#fffbf5', '#ffedd5', '#fed7aa');

  // Büyük Baştan Çıkarıcı Anime Gözleri (Mor-Fuşya & Kirpikler)
  const eyeCol = isRaged ? '#d50000' : '#880e4f';
  // Göz beyazları
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-r * 0.16, -r * 0.38, r * 0.12, r * 0.16, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.16, -r * 0.38, r * 0.12, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  // Göz bebekleri
  ctx.fillStyle = eyeCol;
  ctx.beginPath();
  ctx.ellipse(-r * 0.15 + (facingLeft ? -2 : 2), -r * 0.38, r * 0.08, r * 0.13, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.15 + (facingLeft ? -2 : 2), -r * 0.38, r * 0.08, r * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  // Çift Işıltı pikselleri
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-r * 0.17, -r * 0.43, 3.5, 3.5);
  ctx.fillRect(r * 0.13, -r * 0.43, 3.5, 3.5);
  ctx.fillRect(-r * 0.13, -r * 0.35, 2, 2);
  ctx.fillRect(r * 0.17, -r * 0.35, 2, 2);
  // Kirpik çizgisi
  ctx.strokeStyle = '#3b0764';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, -r * 0.46); ctx.lineTo(-r * 0.06, -r * 0.44);
  ctx.moveTo(r * 0.06, -r * 0.44); ctx.lineTo(r * 0.28, -r * 0.46);
  ctx.stroke();

  // Allık
  ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
  ctx.fillRect(-r * 0.28, -r * 0.28, r * 0.12, 4);
  ctx.fillRect(r * 0.16, -r * 0.28, r * 0.12, 4);

  // Ön Kâküller
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(-r * 0.38, -r * 0.54);
  ctx.lineTo(-r * 0.18, -r * 0.40);
  ctx.lineTo(0, -r * 0.52);
  ctx.lineTo(r * 0.18, -r * 0.40);
  ctx.lineTo(r * 0.38, -r * 0.54);
  ctx.lineTo(0, -r * 0.66);
  ctx.closePath();
  ctx.fill();

  // 7. ALTIN KRALİYET TACI & DEV YAKUT TAŞI
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, -r * 0.58);
  ctx.lineTo(-r * 0.40, -r * 0.98);
  ctx.lineTo(-r * 0.20, -r * 0.76);
  ctx.lineTo(0, -r * 1.08);
  ctx.lineTo(r * 0.20, -r * 0.76);
  ctx.lineTo(r * 0.40, -r * 0.98);
  ctx.lineTo(r * 0.32, -r * 0.58);
  ctx.closePath();
  ctx.fill();
  // Dev Merkez Yakutu
  ctx.fillStyle = '#e11d48';
  ctx.beginPath(); ctx.arc(0, -r * 0.92, r * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1, -r * 0.94, 2, 2);
  ctx.fillStyle = '#e11d48';
  ctx.beginPath(); ctx.arc(-r * 0.34, -r * 0.86, r * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.34, -r * 0.86, r * 0.05, 0, Math.PI * 2); ctx.fill();

  // 8. Etrafta süzülen sihirli çilekler ve yıldız pırıltıları
  for (let s = 0; s < 4; s++) {
    const spPhase = time * 0.35 + s * 1.6;
    const sx = Math.sin(spPhase) * (r * 1.25);
    const sy = Math.cos(spPhase * 0.8) * (r * 0.9);
    ctx.fillStyle = s % 2 === 0 ? '#f43f5e' : '#fde047';
    ctx.fillRect(sx, sy, 3.5, 3.5);
  }

  ctx.restore();
}

// 2. KADİM TAŞ TİTANI (Splash Art: Megalitik Omuz Kuleleri, Rünik Çekirdek & Tektonik Kaya Dev)
function drawBossPixelStone(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = (en.walkTimer || (time * 0.16)) * 2.2;
  const armSwing = Math.sin(stepPhase) * (r * 0.24);
  const legL = Math.sin(stepPhase) * (r * 0.18);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  const heaveY = Math.abs(Math.sin(stepPhase)) * (r * 0.08);

  ctx.save();
  ctx.translate(x, cy + heaveY);

  // 1. Megalitik Granit Sütun Bacaklar
  pixDisk(-r * 0.44, r * 0.54 + legL, r * 0.32, '#94a3b8', '#475569', '#1e293b');
  pixDisk(r * 0.44, r * 0.54 + legR, r * 0.32, '#94a3b8', '#475569', '#1e293b');

  // 2. Omuzlarda Yükselen Granit Monolit Kuleleri (Splash Art Silüeti)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(-r * 0.70, -r * 0.20);
  ctx.lineTo(-r * 1.35, -r * 1.05);
  ctx.lineTo(-r * 0.40, -r * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(r * 0.70, -r * 0.20);
  ctx.lineTo(r * 1.35, -r * 1.05);
  ctx.lineTo(r * 0.40, -r * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Omuz kulelerindeki cyan rün hatları
  ctx.strokeStyle = isRaged ? '#ffd740' : '#00e5ff';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, -r * 0.45); ctx.lineTo(-r * 1.15, -r * 0.85);
  ctx.moveTo(r * 0.85, -r * 0.45); ctx.lineTo(r * 1.15, -r * 0.85);
  ctx.stroke();

  // 3. Tektonik Gövde Zırhı
  pixDisk(0, 0, r * 0.80, '#cbd5e1', '#64748b', '#1e293b');

  // DÖNEN DEVASA RÜNİK ENERJİ ÇEKİRDEĞİ (Splash Art Merkez Çekirdeği)
  const coreAng = time * 0.15;
  ctx.save();
  ctx.translate(0, r * 0.08);
  ctx.rotate(coreAng);
  ctx.fillStyle = isRaged ? '#ff1744' : '#0284c7';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = isRaged ? '#ffd740' : '#00e5ff';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14;
  ctx.fillRect(-r * 0.20, -r * 0.06, r * 0.40, r * 0.12);
  ctx.fillRect(-r * 0.06, -r * 0.20, r * 0.12, r * 0.40);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.10, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // 4. Sallanan Devasa Kaya Yumruk Kolları
  pixDisk(-r * 1.18, r * 0.18 + armSwing, r * 0.42, '#e2e8f0', '#64748b', '#334155');
  pixDisk(r * 1.18, r * 0.18 - armSwing, r * 0.42, '#e2e8f0', '#64748b', '#334155');

  // 5. Yekpare Granit Miğfer Kafa & Rünik Gözler
  const headNod = Math.sin(stepPhase) * (r * 0.05);
  pixDisk(0, -r * 0.54 + headNod, r * 0.46, '#e2e8f0', '#64748b', '#1e293b');
  // Alın Antik Rünü
  ctx.fillStyle = isRaged ? '#ffd740' : '#00e5ff';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
  ctx.fillRect(-r * 0.06, -r * 0.82 + headNod, r * 0.12, r * 0.12);
  // Göz Yarıkları
  ctx.fillRect(-r * 0.26, -r * 0.56 + headNod, r * 0.20, 5);
  ctx.fillRect(r * 0.06, -r * 0.56 + headNod, r * 0.20, 5);
  ctx.shadowBlur = 0;

  // 6. Yörüngede Dönen 3 Koruyucu Kaya Parçası
  for (let k = 0; k < 3; k++) {
    const oa = time * 0.2 + k * (Math.PI * 2 / 3);
    const ox = Math.cos(oa) * (r * 1.4);
    const oy = Math.sin(oa) * (r * 0.7);
    pixDisk(ox, oy, r * 0.18, '#94a3b8', '#475569', '#1e293b');
    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1.4;
    ctx.strokeRect(ox - 3, oy - 3, 6, 6);
  }

  ctx.restore();
}

// 3. LAV LORDU İFRİT (Splash Art: Akkor Magma Boynuzları, Çift Alev Kılıcı & Obsidyen İblis)
function drawBossPixelLava(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = (en.walkTimer || (time * 0.16)) * 2.6;
  const legL = Math.sin(stepPhase) * (r * 0.18);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  const armL = Math.sin(stepPhase) * (r * 0.25);
  const armR = Math.sin(stepPhase + Math.PI) * (r * 0.25);

  ctx.save();
  ctx.translate(x, cy);

  // 1. Magma Pençeli Ayaklar (Akkor Zemin Basışı)
  pixDisk(-r * 0.42, r * 0.56 + legL, r * 0.28, '#ff5722', '#c2410c', '#431407');
  pixDisk(r * 0.42, r * 0.56 + legR, r * 0.28, '#ff5722', '#c2410c', '#431407');

  // 2. Obsidyen Zırh & Fışkıran Magma Çekirdeği
  pixDisk(0, 0, r * 0.78, '#27120a', '#180a06', '#090302');
  // Kaburgalar Arasından Fışkıran Lav
  ctx.fillStyle = isRaged ? '#ff1744' : '#ff3d00';
  ctx.shadowColor = '#ea580c'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.ellipse(0, -r * 0.02, r * 0.46, r * 0.36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath(); ctx.ellipse(0, -r * 0.02, r * 0.26, r * 0.20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, -r * 0.02, r * 0.12, r * 0.10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // 3. ÇİFT DEV ALEV KILICI (Splash Art: Dual Magma Greatswords)
  // Sol Kılıç
  ctx.save();
  ctx.translate(-r * 0.95, armL);
  ctx.rotate(-0.35 + Math.sin(stepPhase) * 0.2);
  pixDisk(0, 0, r * 0.26, '#ea580c', '#9a3412', '#431407');
  // Kılıç Bıçağı (Alev Saçan Dev Bıçak)
  ctx.fillStyle = '#ff3d00';
  ctx.shadowColor = '#facc15'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-r * 0.12, 0);
  ctx.lineTo(-r * 0.25, -r * 1.15);
  ctx.lineTo(r * 0.12, -r * 1.15);
  ctx.lineTo(r * 0.20, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-r * 0.05, -r * 1.10, r * 0.10, r * 0.95);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Sağ Kılıç
  ctx.save();
  ctx.translate(r * 0.95, armR);
  ctx.rotate(0.35 - Math.sin(stepPhase) * 0.2);
  pixDisk(0, 0, r * 0.26, '#ea580c', '#9a3412', '#431407');
  ctx.fillStyle = '#ff3d00';
  ctx.shadowColor = '#facc15'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-r * 0.20, 0);
  ctx.lineTo(-r * 0.12, -r * 1.15);
  ctx.lineTo(r * 0.25, -r * 1.15);
  ctx.lineTo(r * 0.12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-r * 0.05, -r * 1.10, r * 0.10, r * 0.95);
  ctx.shadowBlur = 0;
  ctx.restore();

  // 4. İBLİS KAFA & DEVASA GERİYE KIVRILAN MAGMA BOYNUZLARI
  pixDisk(0, -r * 0.50, r * 0.44, '#431407', '#1f0904', '#090302');
  // Geriye Kıvrılan Akkor Boynuzlar
  ctx.strokeStyle = isRaged ? '#ff1744' : '#ff5722';
  ctx.lineWidth = Math.max(4, r * 0.24);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, -r * 0.45);
  ctx.quadraticCurveTo(-r * 1.45, -r * 1.1, -r * 1.05, -r * 1.60);
  ctx.moveTo(r * 0.35, -r * 0.45);
  ctx.quadraticCurveTo(r * 1.45, -r * 1.1, r * 1.05, -r * 1.60);
  ctx.stroke();
  // Boynuz Akkor Uçları
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = Math.max(2, r * 0.12);
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, -r * 1.15); ctx.lineTo(-r * 1.05, -r * 1.60);
  ctx.moveTo(r * 0.85, -r * 1.15); ctx.lineTo(r * 1.05, -r * 1.60);
  ctx.stroke();

  // Alevli Sarı Akkor İblis Gözleri
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#ea580c'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-r * 0.20, -r * 0.50, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.20, -r * 0.50, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 4. DERİNLİK LORDU LEVIATHAN (Splash Art: 8 Omur Halkalı Okyanus Su Ejderhası)
function drawBossPixelWater(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const wavePhase = time * 0.26;

  ctx.save();
  ctx.translate(x, cy);

  // 1. 8 OMUR DİLİMLİ SERPENTINE EJDERHA OMURGASI
  for (let s = 7; s >= 1; s--) {
    const sPhase = wavePhase - s * 0.50;
    const sx = (facingLeft ? 1 : -1) * (s * r * 0.34);
    const sy = Math.sin(sPhase) * (r * 0.34);
    const sRad = r * (0.70 - s * 0.07);
    pixDisk(sx, sy, sRad, '#38bdf8', '#0284c7', '#082f49');
    // Sırt Su Yüzgeci
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(sx, sy - sRad);
    ctx.lineTo(sx + (facingLeft ? 1 : -1) * r * 0.18, sy - sRad - r * 0.32);
    ctx.lineTo(sx, sy - sRad * 0.2);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Geniş Pektoral Su Kanatları (Yüzgeçler)
  const finFlap = Math.sin(time * 0.38) * (r * 0.18);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, -r * 0.1);
  ctx.lineTo(-r * 1.30, -r * 0.4 + finFlap);
  ctx.lineTo(-r * 0.70, r * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r * 0.45, -r * 0.1);
  ctx.lineTo(r * 1.30, -r * 0.4 + finFlap);
  ctx.lineTo(r * 0.70, r * 0.35);
  ctx.closePath();
  ctx.fill();

  // 3. Su Ejderhası Başı & Okyanus Safir İncisi
  pixDisk(0, 0, r * 0.76, '#38bdf8', '#0284c7', '#082f49');
  // Alındaki Derinlik İncisi
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(0, -r * 0.28, r * 0.18, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Parlayan Turkuaz Gözler & Ejderha Bıyıkları
  ctx.fillStyle = '#00e5ff';
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-r * 0.24, -r * 0.08, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.24, -r * 0.08, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Dalgalanan su bıyıkları
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-r * 0.30, r * 0.15); ctx.quadraticCurveTo(-r * 0.70, r * 0.45 + finFlap, -r * 0.90, r * 0.25);
  ctx.moveTo(r * 0.30, r * 0.15); ctx.quadraticCurveTo(r * 0.70, r * 0.45 + finFlap, r * 0.90, r * 0.25);
  ctx.stroke();

  ctx.restore();
}

// 5. ULU ORMAN ENTİ (Splash Art: Kadim Meşe Ağacı, Sarmaşık Sakallar & Dev Yaprak Tacı)
function drawBossPixelForest(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = (en.walkTimer || (time * 0.14)) * 2.0;
  const armSwing = Math.sin(stepPhase) * (r * 0.24);
  const rootL = Math.sin(stepPhase) * (r * 0.18);
  const rootR = Math.sin(stepPhase + Math.PI) * (r * 0.18);

  ctx.save();
  ctx.translate(x, cy);

  // 1. Kök Bacaklar (Ahşap Kütük Adımları)
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = Math.max(4, r * 0.26);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.40, r * 0.45); ctx.lineTo(-r * 0.65, r * 0.92 + rootL);
  ctx.moveTo(r * 0.40, r * 0.45); ctx.lineTo(r * 0.65, r * 0.92 + rootR);
  ctx.moveTo(0, r * 0.45); ctx.lineTo(0, r * 0.90 + Math.cos(stepPhase) * (r * 0.14));
  ctx.stroke();

  // 2. Yaşlı Meşe Kütüğü Gövdesi
  pixDisk(0, 0, r * 0.78, '#1b3c0e', '#0d1e07', '#050a03');

  // 3. Sarmaşıklı Kütük Kollar
  ctx.beginPath();
  ctx.moveTo(-r * 0.70, -r * 0.1); ctx.lineTo(-r * 1.25, r * 0.45 + armSwing);
  ctx.moveTo(r * 0.70, -r * 0.1); ctx.lineTo(r * 1.25, r * 0.45 - armSwing);
  ctx.stroke();

  // 4. Devasa Yapraklı Meşe Tacı (Zümrüt Yaprak Demetleri)
  const foliageSway = Math.sin(time * 0.25) * (r * 0.08);
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(-r * 0.60 + foliageSway, -r * 0.75, r * 0.42, 0, Math.PI * 2);
  ctx.arc(r * 0.60 + foliageSway, -r * 0.75, r * 0.42, 0, Math.PI * 2);
  ctx.arc(foliageSway, -r * 1.05, r * 0.50, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(-r * 0.55 + foliageSway, -r * 0.75, r * 0.25, 0, Math.PI * 2);
  ctx.arc(r * 0.55 + foliageSway, -r * 0.75, r * 0.25, 0, Math.PI * 2);
  ctx.arc(foliageSway, -r * 1.05, r * 0.32, 0, Math.PI * 2);
  ctx.fill();

  // 5. Kovukta Parlayan Zümrüt Gözler
  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.10, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.22, -r * 0.10, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 6. KUTUP HÜKÜMDARI YETİ (Splash Art: Knuckle-Walking Buzul Gorili, Don Boynuzları & Kar Kürkü)
function drawBossPixelIce(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = (en.walkTimer || (time * 0.16)) * 2.2;
  const knuckleL = Math.sin(stepPhase) * (r * 0.25);
  const knuckleR = Math.sin(stepPhase + Math.PI) * (r * 0.25);

  ctx.save();
  ctx.translate(x, cy);

  // 1. Knuckle-Walking Dev Buz Yumruk Kolları
  pixDisk(-r * 1.02, r * 0.40 + knuckleL, r * 0.40, '#ffffff', '#e0f2fe', '#38bdf8');
  pixDisk(r * 1.02, r * 0.40 + knuckleR, r * 0.40, '#ffffff', '#e0f2fe', '#38bdf8');

  // 2. Kar Beyazı Heybetli Gövde
  pixDisk(0, 0, r * 0.80, '#ffffff', '#f0f9ff', '#7dd3fc');

  // 3. Kalın Glasiyel Boynuzlar
  ctx.strokeStyle = isRaged ? '#ff1744' : '#0284c7';
  ctx.lineWidth = Math.max(4, r * 0.24);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, -r * 0.40);
  ctx.quadraticCurveTo(-r * 1.40, -r * 0.90, -r * 0.95, -r * 1.45);
  ctx.moveTo(r * 0.45, -r * 0.40);
  ctx.quadraticCurveTo(r * 1.40, -r * 0.90, r * 0.95, -r * 1.45);
  ctx.stroke();

  // 4. Parlayan Dondurucu Kutup Gözleri
  ctx.fillStyle = isRaged ? '#ff1744' : '#0284c7';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.14, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.22, -r * 0.14, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 7. YILDIRIM TİTANI RAİJİN (Splash Art: 6 Dönen Altın Taiko Şimşek Davulu & Fırtına Tanrısı)
function drawBossPixelStorm(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const floatBob = Math.sin(time * 0.28) * 6;

  ctx.save();
  ctx.translate(x, cy + floatBob);

  // 1. DÖNEN 6 ALTIN TAİKO ŞİMŞEK DAVULU (360 Derece Çakan Elektrik Arkları)
  const haloR = r * 1.35;
  for (let k = 0; k < 6; k++) {
    const na = time * 0.18 + k * (Math.PI / 3);
    const nx = Math.cos(na) * haloR;
    const ny = Math.sin(na) * haloR;
    pixDisk(nx, ny, r * 0.24, '#fde047', '#eab308', '#854d0e');
    // Davul içi Tomoe sembolü
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(nx, ny, r * 0.08, 0, Math.PI * 2); ctx.fill();
    // Davullar arası sürekli çakan elektrik arkları
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(nx, ny);
    const nextNa = time * 0.18 + (k + 1) * (Math.PI / 3);
    ctx.lineTo(Math.cos(nextNa) * haloR, Math.sin(nextNa) * haloR);
    ctx.stroke();
  }

  // 2. Fırtına Bulutu Kaidesi
  pixDisk(0, r * 0.50, r * 0.60, '#312e81', '#1e1b4b', '#030712');

  // 3. İlahi Gövde
  pixDisk(0, -r * 0.15, r * 0.66, '#6366f1', '#3730a3', '#1e1b4b');

  // 4. Altın Şimşek Mızrak Kolları
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#facc15'; ctx.shadowBlur = 12;
  ctx.fillRect(-r * 1.05, -r * 0.25, r * 0.16, r * 0.85);
  ctx.fillRect(r * 0.90, -r * 0.25, r * 0.16, r * 0.85);
  ctx.shadowBlur = 0;

  // 5. Plazma Sarı Şimşek Gözleri
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#fde047'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.22, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.22, -r * 0.22, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 8. KUM LORDU KADİM TİTAN (Splash Art: Firavun Altın Zırhı, 6 Bacak & Zehirli Akrep İğnesi)
function drawBossPixelSand(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const scuttle = (en.walkTimer || (time * 0.16)) * 4.0;

  ctx.save();
  ctx.translate(x, cy);

  // 1. 6 Eklemli Tripod Scuttle Bacaklar
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = Math.max(3, r * 0.18);
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const sL = Math.sin(scuttle + i * 1.5) * (r * 0.20);
    const sR = Math.sin(scuttle + i * 1.5 + Math.PI) * (r * 0.20);
    // Sol bacak
    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.2 + i * r * 0.28);
    ctx.lineTo(-r * 0.95, -r * 0.1 + i * r * 0.28 + sL);
    ctx.lineTo(-r * 1.35, r * 0.35 + i * r * 0.28 + sL);
    ctx.stroke();
    // Sağ bacak
    ctx.beginPath();
    ctx.moveTo(r * 0.45, -r * 0.2 + i * r * 0.28);
    ctx.lineTo(r * 0.95, -r * 0.1 + i * r * 0.28 + sR);
    ctx.lineTo(r * 1.35, r * 0.35 + i * r * 0.28 + sR);
    ctx.stroke();
  }

  // 2. Altın Firavun Zırhlı Gövde
  pixDisk(0, 0, r * 0.74, '#fde047', '#d97706', '#78350f');

  // 3. Devasa Firavun Kıskaçları
  const pinch = Math.sin(time * 0.3) * (r * 0.10);
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.45);
  ctx.lineTo(-r * 1.25 + pinch, -r * 1.05);
  ctx.lineTo(-r * 0.80, -r * 0.65);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r * 0.55, -r * 0.45);
  ctx.lineTo(r * 1.25 - pinch, -r * 1.05);
  ctx.lineTo(r * 0.80, -r * 0.65);
  ctx.closePath();
  ctx.fill();

  // 4. Zehirli Altın Akrep Kuyruğu & Zümrüt Zehir Damlası
  const tailSway = Math.sin(time * 0.25) * (r * 0.22);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = Math.max(4, r * 0.24);
  ctx.beginPath();
  ctx.moveTo(0, r * 0.55);
  ctx.quadraticCurveTo(r * 1.30 + tailSway, -r * 0.25, r * 0.45 + tailSway, -r * 1.45);
  ctx.stroke();
  ctx.fillStyle = isRaged ? '#ff1744' : '#22c55e';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(r * 0.40 + tailSway, -r * 1.50, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 9. KARANLIK KONTU ARCHON (Splash Art: Devasa Yarasa Kanatları, Gotik Pelerin & Vampir Lordu)
function drawBossPixelNight(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const flap = Math.sin(time * 0.35) * (r * 0.28);

  ctx.save();
  ctx.translate(x, cy);

  // 1. Devasa Yarasa / İblis Kanatları
  ctx.fillStyle = '#0f051d';
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, 0);
  ctx.quadraticCurveTo(-r * 1.65, -r * 1.25 + flap, -r * 2.35, -r * 0.25 + flap);
  ctx.quadraticCurveTo(-r * 1.45, r * 0.6, -r * 0.35, r * 0.45);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r * 0.35, 0);
  ctx.quadraticCurveTo(r * 1.65, -r * 1.25 + flap, r * 2.35, -r * 0.25 + flap);
  ctx.quadraticCurveTo(r * 1.45, r * 0.6, r * 0.35, r * 0.45);
  ctx.fill();

  // 2. Kan Kırmızısı Astarlı Gotik Pelerin
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(-r * 0.70, -r * 0.65);
  ctx.lineTo(-r * 0.30, 0);
  ctx.lineTo(r * 0.30, 0);
  ctx.lineTo(r * 0.70, -r * 0.65);
  ctx.lineTo(0, r * 0.75);
  ctx.closePath();
  ctx.fill();

  // 3. Gövde & Gotik Miğfer
  pixDisk(0, -r * 0.12, r * 0.66, '#3b0764', '#1e053a', '#090114');

  // 4. Parlayan Kan Kırmızısı Gözler
  ctx.fillStyle = '#ff1744';
  ctx.shadowColor = '#ff1744'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(-r * 0.20, -r * 0.20, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.20, -r * 0.20, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 10. KETÇAP İMPARATORU (Splash Art: Domates Sosu Jölesi, Altın Kapak Tacı & Sıçrayan Soslar)
function drawBossPixelKetchup(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = (en.walkTimer || (time * 0.16)) * 2.8;
  const bounceY = Math.abs(Math.sin(stepPhase)) * (r * 0.18);
  const squashX = 1 + Math.sin(stepPhase) * 0.16;
  const squashY = 1 - Math.sin(stepPhase) * 0.16;

  ctx.save();
  ctx.translate(x, cy - bounceY);
  ctx.scale(squashX, squashY);

  // 1. Jelatin Sos Gövdesi
  pixDisk(0, 0, r * 0.82, '#ef4444', '#b91c1c', '#450a0a');

  // 2. Altın Tırtıklı Şişe Kapağı Tacı
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-r * 0.40, -r * 1.25, r * 0.80, r * 0.48);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-r * 0.50, -r * 0.15, r * 1.00, 5);

  // 3. Fırlayan Damla Sos Kolları
  const armFling = Math.sin(stepPhase) * (r * 0.20);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-r * 0.92, armFling, r * 0.20, 0, Math.PI * 2);
  ctx.arc(r * 0.92, -armFling, r * 0.20, 0, Math.PI * 2);
  ctx.fill();

  // 4. Parlayan Gözler
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.25, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.22, -r * 0.25, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-r * 0.20, -r * 0.25, r * 0.07, 0, Math.PI * 2);
  ctx.arc(r * 0.24, -r * 0.25, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
