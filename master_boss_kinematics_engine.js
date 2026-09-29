// =========================================================================
// 10 BOSS PURE PROCEDURAL PIXEL ART & MULTI-JOINTED KINEMATICS ENGINE
// 100% Transparent Background, Full Body (Head-to-Toe), Anatomical Perfection.
// =========================================================================

function bossPixDisk(ctx, x, y, r, fill, stroke, core) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.stroke();
  }
  if (core) {
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// -------------------------------------------------------------------------
// 1. ŞEKER DİYARI PRENSESİ (SUGAR PRINCESS) - REWORKED
// - TAM VÜCUT: Ayakkabılar ve bacaklar %100 görünür, etek asla ayakları kapatmaz.
// - KESİNLİKLE 2 KOL: Sol kol belde zarif pozda, Sağ kol lolipop asasını havada tutar.
// - BÜYÜTÜLMÜŞ GÖĞÜS: Dolgun çilek korsajı, dantel dekolte ve altın çilek broşu.
// - YÜKSEK YIRTMAÇLI İPEK ETEK: Kalçadan topuğa kadar açıkta kalan zarif ten bacak, altın halhal ve fuşya fiyonklu topuklu ayakkabı.
// - ARKA PLANDA KESİNLİKLE KALE/ŞATO YOK! %100 ŞEFFAF ARKA PLAN.
// -------------------------------------------------------------------------
function drawBossPixelSugar(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const walkTimer = (en && en.walkTimer) || (time * 0.16);
  const stepPhase = walkTimer * 2.8;
  const floatBob = Math.sin(time * 0.28) * 3.5;
  const sway = Math.sin(stepPhase * 0.5) * 0.04;
  const py = cy + floatBob - r * 0.05; // Yere sığacak şekilde hafif yukarı dengelendi

  ctx.save();
  ctx.translate(x, py);
  ctx.rotate(sway);

  // 1. İkiz Uzun Dalgalı Pembe Saçlar (Arka Katman - Fizikle savrulur, kol gibi durmaz!)
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

  // 2. YÜRÜYEN BACAKLAR & TOPUKLU AYAKKABILAR (TAM VÜCUT - AYAKLAR KESİNLİKLE GÖRÜNÜR)
  const legStepL = Math.sin(stepPhase) * (r * 0.16);
  const legStepR = Math.sin(stepPhase + Math.PI) * (r * 0.16);

  // SOL BACAK (Etek arkasından adım atan zarif bacak)
  const legLX = -r * 0.22;
  const legLY = r * 0.35 + legStepL;
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(legLX, legLY, r * 0.14, r * 0.44); // Bacak
  // Sol Ayakkabı (Topuklu Fuşya Şeker Ayakkabısı)
  ctx.fillStyle = isRaged ? '#ff1744' : '#db2777';
  ctx.fillRect(legLX - 2, legLY + r * 0.42, r * 0.18, r * 0.12);
  ctx.fillStyle = '#facc15'; // Altın toka
  ctx.fillRect(legLX + 1, legLY + r * 0.44, 3, 3);

  // SAĞ BACAK (YIRTMAÇTAN KALÇADAN TOPUĞA AÇIKTA KALAN GÖZ ALICI BACAK)
  const legRX = r * 0.14;
  const legRY = r * 0.25 + legStepR;
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(legRX, legRY, r * 0.16, r * 0.54);
  // Bacak konturu ve gölgesi
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(legRX + r * 0.11, legRY, r * 0.05, r * 0.54);
  // Ayak bileğinde parlayan altın halhal
  ctx.fillStyle = '#facc15';
  ctx.fillRect(legRX - 1, legRY + r * 0.46, r * 0.18, 3.5);
  // Fuşya yüksek topuklu ayakkabı
  ctx.fillStyle = isRaged ? '#ff1744' : '#db2777';
  ctx.fillRect(legRX - 2, legRY + r * 0.52, r * 0.20, r * 0.12);
  // İnce topuk çivisi
  ctx.fillRect(legRX - 2, legRY + r * 0.54, 3, r * 0.08);
  ctx.fillStyle = '#ffffff'; // Işıltı
  ctx.fillRect(legRX + r * 0.04, legRY + r * 0.54, 3, 3);

  // 3. YÜKSEK YIRTMAÇLI İPEK ETEK (High-Slit Skirt - Ayakları asla kapatmaz!)
  const skirtWave = Math.sin(stepPhase + 0.8) * (r * 0.06);
  // Etek koyu fuşya astarı
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, r * 0.16);
  ctx.lineTo(-r * 0.75 + skirtWave, r * 0.66);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.70, legRX - 2, r * 0.32); // Yırtmaç açılışı
  ctx.lineTo(r * 0.28, r * 0.16);
  ctx.closePath();
  ctx.fill();

  // Ana pembe ipek kumaş
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, r * 0.18);
  ctx.lineTo(-r * 0.68 + skirtWave * 0.8, r * 0.62);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.65, legRX, r * 0.30);
  ctx.lineTo(r * 0.25, r * 0.18);
  ctx.closePath();
  ctx.fill();

  // Etek ucundaki altın filigran işlemeler
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-r * 0.68 + skirtWave * 0.8, r * 0.62);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.65, legRX, r * 0.30);
  ctx.stroke();

  // 4. İNCE BEL & BÜYÜTÜLMÜŞ DOLGUN ÇİLEK KORSAJI (ENHANCED BUST)
  // Bel
  ctx.fillStyle = '#9f1239';
  ctx.fillRect(-r * 0.22, -r * 0.06, r * 0.44, r * 0.22);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-r * 0.04, -r * 0.04, r * 0.08, r * 0.18); // Altın korsaj bağcıkları

  // Dolgun Göğüsler (Yuvarlak hatlı, dekolteli, dantel işlemeli)
  ctx.fillStyle = '#be123c';
  // Sol göğüs kavisi
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.14, r * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Sağ göğüs kavisi
  ctx.beginPath();
  ctx.arc(r * 0.12, -r * 0.14, r * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Dekolte beyaz danteli
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.14, r * 0.15, -Math.PI * 0.8, -Math.PI * 0.1);
  ctx.arc(r * 0.12, -r * 0.14, r * 0.15, -Math.PI * 0.9, -Math.PI * 0.2);
  ctx.stroke();
  // Ortada altın çilek broşu
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, -r * 0.12, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. ZARİF BOYUN & ANİME KAFA
  ctx.fillStyle = '#ffedd5';
  ctx.fillRect(-r * 0.06, -r * 0.30, r * 0.12, r * 0.14); // Boyun

  // Kafa
  const headBob = Math.sin(time * 0.28) * (r * 0.02);
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.arc(0, -r * 0.40 + headBob, r * 0.23, 0, Math.PI * 2);
  ctx.fill();

  // Büyük İri Pembe Anime Gözleri
  ctx.fillStyle = '#9d174d';
  ctx.beginPath();
  ctx.ellipse(-r * 0.09, -r * 0.40 + headBob, r * 0.05, r * 0.075, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.09, -r * 0.40 + headBob, r * 0.05, r * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-r * 0.10, -r * 0.42 + headBob, r * 0.025, 0, Math.PI * 2);
  ctx.arc(r * 0.08, -r * 0.42 + headBob, r * 0.025, 0, Math.PI * 2);
  ctx.fill();
  // Pembe Yanak Allığı
  ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.beginPath();
  ctx.arc(-r * 0.13, -r * 0.36 + headBob, 3.5, 0, Math.PI * 2);
  ctx.arc(r * 0.13, -r * 0.36 + headBob, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Ön Kahküller & Saç Tacı
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(0, -r * 0.46 + headBob, r * 0.24, Math.PI, 0);
  ctx.lineTo(r * 0.20, -r * 0.36 + headBob);
  ctx.lineTo(r * 0.08, -r * 0.32 + headBob);
  ctx.lineTo(0, -r * 0.36 + headBob);
  ctx.lineTo(-r * 0.08, -r * 0.32 + headBob);
  ctx.lineTo(-r * 0.20, -r * 0.36 + headBob);
  ctx.closePath();
  ctx.fill();

  // Altın Çilek Tacı
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-r * 0.16, -r * 0.62 + headBob);
  ctx.lineTo(-r * 0.07, -r * 0.54 + headBob);
  ctx.lineTo(0, -r * 0.66 + headBob);
  ctx.lineTo(r * 0.07, -r * 0.54 + headBob);
  ctx.lineTo(r * 0.16, -r * 0.62 + headBob);
  ctx.lineTo(r * 0.10, -r * 0.50 + headBob);
  ctx.lineTo(-r * 0.10, -r * 0.50 + headBob);
  ctx.closePath();
  ctx.fill();

  // =========================================================================
  // KESİNLİKLE 2 KOL MANTIĞI:
  // 1. SOL KOL: Belinde kıvrılmış, zarif duruş (Başka hiçbir nesne yok!)
  // 2. SAĞ KOL: Asayı yukarı doğru tutan tek kol (Başka hiçbir nesne yok!)
  // =========================================================================

  // KOL 1: SOL KOL (Belinde zarif poz - 1. Kol)
  ctx.save();
  ctx.translate(-r * 0.20, -r * 0.14);
  // Omuz fırfırı (Beyaz puf kumaş)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  // Ten kol (Dirsekten bele doğru bükülü)
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = r * 0.09;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-r * 0.14, r * 0.14);
  ctx.lineTo(-r * 0.04, r * 0.24); // El bele dokunur
  ctx.stroke();
  ctx.restore();

  // KOL 2: SAĞ KOL & DÖNEN LOLİPOP ASASI (2. Kol)
  ctx.save();
  ctx.translate(r * 0.20, -r * 0.14);
  // Sağ Omuz fırfırı
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  // Ten kol (Yukarı asaya doğru uzanır)
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = r * 0.09;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(r * 0.18, -r * 0.08);
  ctx.stroke();

  // Asa Tutuş Noktası
  const staffX = r * 0.22;
  const staffY = -r * 0.08;

  // Asa Çubuğu (Beyaz & Kırmızı Çizgili Nane Şekeri)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(staffX, staffY + r * 0.60);
  ctx.lineTo(staffX, staffY - r * 0.42);
  ctx.stroke();
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(staffX, staffY + r * 0.60);
  ctx.lineTo(staffX, staffY - r * 0.42);
  ctx.stroke();
  ctx.setLineDash([]);

  // Dönen Lolipop Başlığı
  const wandSpin = time * 0.18;
  ctx.save();
  ctx.translate(staffX, staffY - r * 0.44);
  ctx.rotate(wandSpin);
  bossPixDisk(ctx, 0, 0, r * 0.22, '#ec4899', '#fbcfe8');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let a = 0; a < 3; a++) {
    const rotA = a * (Math.PI * 2 / 3);
    ctx.arc(0, 0, r * 0.13, rotA, rotA + 1.2);
  }
  ctx.stroke();
  ctx.restore();

  ctx.restore();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 2. KADİM TAŞ TİTANI (STONE TITAN GOLGOTH)
// Full Body: Monolithic fortress shoulders, cyan runes, pillar legs firmly on ground.
// -------------------------------------------------------------------------
function drawBossPixelStone(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepClock = (en && en.stepClock) || (time * 0.14);
  const cycle = stepClock % 1.0;
  const isSurge = cycle > 0.38;
  const stepPhase = stepClock * Math.PI * 2;
  const heaveY = isSurge ? Math.sin(cycle * Math.PI) * 4 : 0;
  const py = cy - heaveY - r * 0.06;

  ctx.save();
  ctx.translate(x, py);

  // 1. Ağır Adım Atan Granit Sütun Bacaklar (Taban tam oturur)
  const legL = Math.sin(stepPhase) * (r * 0.18);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  ctx.fillStyle = '#374151';
  ctx.fillRect(-r * 0.46, r * 0.32 + legL, r * 0.26, r * 0.48);
  ctx.fillRect(r * 0.20, r * 0.32 + legR, r * 0.26, r * 0.48);
  ctx.fillStyle = '#1f2937'; // Granit taban ayaklar
  ctx.fillRect(-r * 0.50, r * 0.74 + legL, r * 0.32, r * 0.16);
  ctx.fillRect(r * 0.18, r * 0.74 + legR, r * 0.32, r * 0.16);

  // 2. Megalitik Gövde & Cyan Rün Çekirdeği
  bossPixDisk(ctx, 0, 0, r * 0.64, '#4b5563', '#1f2937');
  ctx.fillStyle = isRaged ? '#ff1744' : '#00e5ff';
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, -r * 0.05, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 3. Omuz Monolit Kuleleri
  const towerSway = Math.sin(stepPhase) * 2.5;
  ctx.fillStyle = '#374151';
  ctx.fillRect(-r * 0.86, -r * 0.82 + towerSway, r * 0.30, r * 0.62);
  ctx.fillRect(r * 0.56, -r * 0.82 - towerSway, r * 0.30, r * 0.62);
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(-r * 0.88, -r * 0.86 + towerSway, r * 0.34, r * 0.09);
  ctx.fillRect(r * 0.54, -r * 0.86 - towerSway, r * 0.34, r * 0.09);

  // 4. Kafa & Parlayan Göz Yuvaları
  ctx.fillStyle = '#374151';
  ctx.fillRect(-r * 0.22, -r * 0.52, r * 0.44, r * 0.32);
  ctx.fillStyle = isRaged ? '#ff1744' : '#00e5ff';
  ctx.fillRect(-r * 0.15, -r * 0.44, r * 0.09, r * 0.07);
  ctx.fillRect(r * 0.06, -r * 0.44, r * 0.09, r * 0.07);

  // 5. Sallanan Dev Taş Yumruklar
  const armL = Math.sin(stepPhase + Math.PI) * (r * 0.22);
  const armR = Math.sin(stepPhase) * (r * 0.22);
  bossPixDisk(ctx, -r * 0.80, r * 0.20 + armL, r * 0.24, '#374151', '#111827');
  bossPixDisk(ctx, r * 0.80, r * 0.20 + armR, r * 0.24, '#374151', '#111827');

  ctx.restore();
}

// -------------------------------------------------------------------------
// 3. LAV LORDU İFRİT (LAVA LORD IFRIT)
// Full Body: Magma horns, flaming mane, muscular torso, dual glowing swords, clawed feet.
// -------------------------------------------------------------------------
function drawBossPixelLava(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = ((en && en.walkTimer) || (time * 0.18)) * 2.8;
  const floatBob = Math.sin(time * 0.32) * 3.5;
  const py = cy + floatBob - r * 0.06;

  ctx.save();
  ctx.translate(x, py);

  // 1. Dalgalanan Yangın Saçları
  for (let f = -3; f <= 3; f++) {
    const fWave = Math.sin(time * 0.4 + f * 0.8) * (r * 0.15);
    ctx.fillStyle = f % 2 === 0 ? '#ff3d00' : '#ffd600';
    ctx.beginPath();
    ctx.moveTo(f * (r * 0.11), -r * 0.32);
    ctx.lineTo(f * (r * 0.14) + fWave, -r * 0.78);
    ctx.lineTo(f * (r * 0.11) + r * 0.07, -r * 0.32);
    ctx.fill();
  }

  // 2. Adım Atan Kor Zırhlı Bacaklar (Pençeli Tabanlar Görünür)
  const legL = Math.sin(stepPhase) * (r * 0.18);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  ctx.fillStyle = '#3e100c';
  ctx.fillRect(-r * 0.34, r * 0.32 + legL, r * 0.18, r * 0.42);
  ctx.fillRect(r * 0.16, r * 0.32 + legR, r * 0.18, r * 0.42);
  // Pençeli zırhlı botlar
  ctx.fillStyle = '#ff5722';
  ctx.fillRect(-r * 0.38, r * 0.70 + legL, r * 0.24, r * 0.14);
  ctx.fillRect(r * 0.14, r * 0.70 + legR, r * 0.24, r * 0.14);

  // 3. Obsidyen Gövde & Magma Çatlakları
  bossPixDisk(ctx, 0, 0, r * 0.58, '#1f1311', '#7f1d1d');
  ctx.fillStyle = '#ff6d00';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // 4. Kafa & Kıvrık Magma Boynuzları
  ctx.fillStyle = '#3e100c';
  ctx.fillRect(-r * 0.20, -r * 0.46, r * 0.40, r * 0.28);
  // Kıvrık Boynuzlar
  ctx.fillStyle = '#ff3d00';
  ctx.beginPath();
  ctx.moveTo(-r * 0.18, -r * 0.42);
  ctx.quadraticCurveTo(-r * 0.60, -r * 0.68, -r * 0.48, -r * 0.88);
  ctx.lineTo(-r * 0.12, -r * 0.46);
  ctx.moveTo(r * 0.18, -r * 0.42);
  ctx.quadraticCurveTo(r * 0.60, -r * 0.68, r * 0.48, -r * 0.88);
  ctx.lineTo(r * 0.12, -r * 0.46);
  ctx.fill();
  // Gözler
  ctx.fillStyle = '#ffea00';
  ctx.fillRect(-r * 0.12, -r * 0.38, r * 0.07, r * 0.05);
  ctx.fillRect(r * 0.05, -r * 0.38, r * 0.07, r * 0.05);

  // 5. ÇİFT AKKOR ALEV KILICI (2 KILIÇ - 2 KOL)
  const armL = Math.sin(stepPhase + Math.PI) * (r * 0.16);
  const armR = Math.sin(stepPhase) * (r * 0.16);
  // Sol Kılıç
  ctx.save();
  ctx.translate(-r * 0.68, r * 0.08 + armL);
  ctx.rotate(-0.35 + Math.sin(stepPhase) * 0.18);
  ctx.fillStyle = '#ff3d00';
  ctx.shadowColor = '#ffd600';
  ctx.shadowBlur = 10;
  ctx.fillRect(-3.5, -r * 0.78, 7, r * 0.78);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1.5, -r * 0.74, 3, r * 0.68);
  ctx.restore();
  // Sağ Kılıç
  ctx.save();
  ctx.translate(r * 0.68, r * 0.08 + armR);
  ctx.rotate(0.35 - Math.sin(stepPhase) * 0.18);
  ctx.fillStyle = '#ff3d00';
  ctx.shadowColor = '#ffd600';
  ctx.shadowBlur = 10;
  ctx.fillRect(-3.5, -r * 0.78, 7, r * 0.78);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1.5, -r * 0.74, 3, r * 0.68);
  ctx.restore();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 4. DERİNLİK LORDU LEVİATHAN (WATER DRAGON LEVIATHAN)
// Full Body: Serpentine aquatic dragon head, fin ears, golden eyes, whisker barbels.
// -------------------------------------------------------------------------
function drawBossPixelWater(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const swimPhase = (en && en.swimPhase) || (time * 0.2);
  const undulate = Math.sin(swimPhase) * (r * 0.10);

  ctx.save();
  ctx.translate(x + undulate, cy - r * 0.05);

  // 1. Zırhlı Su Ejderi Başı
  bossPixDisk(ctx, 0, 0, r * 0.62, '#0e7490', '#164e63', '#06b6d4');

  // 2. Yüzgeç Kulaklar (Fins)
  const finWave = Math.sin(time * 0.3) * (r * 0.12);
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, -r * 0.12);
  ctx.lineTo(-r * 0.88 + finWave, -r * 0.38);
  ctx.lineTo(-r * 0.40, r * 0.15);
  ctx.moveTo(r * 0.45, -r * 0.12);
  ctx.lineTo(r * 0.88 - finWave, -r * 0.38);
  ctx.lineTo(r * 0.40, r * 0.15);
  ctx.fill();

  // 3. Parlayan Altın Ejder Gözleri & Bıyıklar
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8;
  ctx.fillRect(-r * 0.24, -r * 0.18, r * 0.12, r * 0.08);
  ctx.fillRect(r * 0.12, -r * 0.18, r * 0.12, r * 0.08);
  ctx.shadowBlur = 0;

  // Dalgalanan ejder bıyıkları
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.14, r * 0.14);
  ctx.quadraticCurveTo(-r * 0.50, r * 0.40 + finWave, -r * 0.80, r * 0.22);
  ctx.moveTo(r * 0.14, r * 0.14);
  ctx.quadraticCurveTo(r * 0.50, r * 0.40 + finWave, r * 0.80, r * 0.22);
  ctx.stroke();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 5. ULU ORMAN KORUYUCUSU (FOREST TREANT)
// Full Body: Ancient oak body, leafy branch crown, gnarled root legs, floral staff.
// -------------------------------------------------------------------------
function drawBossPixelForest(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = ((en && en.walkTimer) || (time * 0.14)) * 2.8;
  const sway = Math.sin(stepPhase) * 0.05;

  ctx.save();
  ctx.translate(x, cy - r * 0.06);
  ctx.rotate(sway);

  // 1. Ağır Kütük Bacaklar & Ayaklar
  const legL = Math.sin(stepPhase) * (r * 0.16);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.16);
  ctx.fillStyle = '#3f2e18';
  ctx.fillRect(-r * 0.40, r * 0.32 + legL, r * 0.24, r * 0.44);
  ctx.fillRect(r * 0.16, r * 0.32 + legR, r * 0.24, r * 0.44);
  ctx.fillStyle = '#271b0d'; // Kök ayaklar
  ctx.fillRect(-r * 0.44, r * 0.72 + legL, r * 0.30, r * 0.14);
  ctx.fillRect(r * 0.14, r * 0.72 + legR, r * 0.30, r * 0.14);

  // 2. Yosunlu Meşe Gövdesi & Yeşil Rün
  bossPixDisk(ctx, 0, 0, r * 0.64, '#543d22', '#271b0d', '#15803d');

  // 3. Dal Boynuzlar & Zümrüt Yaprak Taç
  ctx.fillStyle = '#3f2e18';
  ctx.beginPath();
  ctx.moveTo(-r * 0.24, -r * 0.42);
  ctx.lineTo(-r * 0.70, -r * 0.88);
  ctx.lineTo(-r * 0.50, -r * 0.50);
  ctx.moveTo(r * 0.24, -r * 0.42);
  ctx.lineTo(r * 0.70, -r * 0.88);
  ctx.lineTo(r * 0.50, -r * 0.50);
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(-r * 0.68, -r * 0.85, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.68, -r * 0.85, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // 4. Gözler
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(-r * 0.15, -r * 0.20, r * 0.09, r * 0.07);
  ctx.fillRect(r * 0.06, -r * 0.20, r * 0.09, r * 0.07);

  // 5. Çiçekli Ulu Doğa Asası
  ctx.strokeStyle = '#271b0d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(r * 0.62, r * 0.55);
  ctx.lineTo(r * 0.62, -r * 0.80);
  ctx.stroke();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(r * 0.62, -r * 0.82, r * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 6. KUTUP HÜKÜMDARI YETİ (ICE YETI)
// Full Body: White shaggy fur, glacial horns, claws, snow paws on ground.
// -------------------------------------------------------------------------
function drawBossPixelIce(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = ((en && en.walkTimer) || (time * 0.16)) * 2.8;
  const heaveY = Math.sin(stepPhase) * 3.5;

  ctx.save();
  ctx.translate(x, cy + heaveY - r * 0.06);

  // 1. Güçlü Bacaklar & Kar Pençeleri (Yere Basar)
  const legL = Math.sin(stepPhase) * (r * 0.18);
  const legR = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-r * 0.44, r * 0.36 + legL, r * 0.26, r * 0.42);
  ctx.fillRect(r * 0.18, r * 0.36 + legR, r * 0.26, r * 0.42);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-r * 0.48, r * 0.74 + legL, r * 0.32, r * 0.14);
  ctx.fillRect(r * 0.16, r * 0.74 + legR, r * 0.32, r * 0.14);

  // 2. Shaggy Beyaz Kürk Gövde
  bossPixDisk(ctx, 0, 0, r * 0.72, '#e2e8f0', '#94a3b8');

  // 3. Buz Boynuzları
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, -r * 0.42);
  ctx.lineTo(-r * 0.78, -r * 0.80);
  ctx.lineTo(-r * 0.22, -r * 0.55);
  ctx.moveTo(r * 0.32, -r * 0.42);
  ctx.lineTo(r * 0.78, -r * 0.80);
  ctx.lineTo(r * 0.22, -r * 0.55);
  ctx.fill();

  // 4. Kükreyen Ağız & Mavi Gözler
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-r * 0.18, -r * 0.14, r * 0.36, r * 0.22);
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(-r * 0.14, -r * 0.28, r * 0.08, r * 0.06);
  ctx.fillRect(r * 0.06, -r * 0.28, r * 0.08, r * 0.06);

  // 5. Pençeli Buz Yumrukları (2 Kol)
  const armL = Math.sin(stepPhase + Math.PI) * (r * 0.18);
  const armR = Math.sin(stepPhase) * (r * 0.18);
  bossPixDisk(ctx, -r * 0.82, r * 0.12 + armL, r * 0.24, '#38bdf8', '#0284c7');
  bossPixDisk(ctx, r * 0.82, r * 0.12 + armR, r * 0.24, '#38bdf8', '#0284c7');

  ctx.restore();
}

// -------------------------------------------------------------------------
// 7. YILDIRIM TİTANI RAİJİN (STORM / RAIJIN)
// Full Body: 6 rotating Taiko drums, golden horns, twin drumsticks, thunder robes.
// -------------------------------------------------------------------------
function drawBossPixelStorm(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const floatBob = Math.sin(time * 0.35) * 5;

  ctx.save();
  ctx.translate(x, cy + floatBob - r * 0.05);

  // 1. ARKADA SÜZÜLEN 6 TAIKO ŞİMŞEK DAVULU HALESİ
  for (let k = 0; k < 6; k++) {
    const da = time * 0.08 + k * (Math.PI * 2 / 6);
    const dx = Math.cos(da) * (r * 1.10);
    const dy = Math.sin(da) * (r * 0.80) - r * 0.12;
    bossPixDisk(ctx, dx, dy, r * 0.17, '#854d0e', '#facc15', '#00e5ff');
  }

  // 2. Samuray Zırhlı Gövde & Robeler
  bossPixDisk(ctx, 0, 0, r * 0.58, '#4338ca', '#312e81', '#fbbf24');

  // 3. Altın Boynuzlar & Parlayan Şimşek Gözleri
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, -r * 0.42); ctx.lineTo(-r * 0.52, -r * 0.82); ctx.lineTo(-r * 0.12, -r * 0.52);
  ctx.moveTo(r * 0.22, -r * 0.42); ctx.lineTo(r * 0.52, -r * 0.82); ctx.lineTo(r * 0.12, -r * 0.52);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 10;
  ctx.fillRect(-r * 0.14, -r * 0.30, r * 0.08, r * 0.06);
  ctx.fillRect(r * 0.06, -r * 0.30, r * 0.08, r * 0.06);
  ctx.shadowBlur = 0;

  // 4. ÇİFTE ALTIN BAGETLER (2 Kol - 2 Baget)
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, r * 0.12); ctx.lineTo(-r * 0.80, -r * 0.12);
  ctx.moveTo(r * 0.42, r * 0.12); ctx.lineTo(r * 0.80, -r * 0.12);
  ctx.stroke();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 8. ÇÖL FİRAVUNU AKREP KRAL (SAND LORD / SCORPION PHARAOH)
// Full Body: Pharaoh Nemes headdress, twin golden pincers, arching venom stinger tail, scuttling legs.
// -------------------------------------------------------------------------
function drawBossPixelSand(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const scuttle = Math.sin(time * 0.4) * (r * 0.07);

  ctx.save();
  ctx.translate(x + scuttle, cy - r * 0.05);

  // 1. TEPEDEN KIVRILAN AKREP KUYRUĞU & ZEHİR İĞNESİ
  const tailWave = Math.sin(time * 0.25) * (r * 0.10);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 7.5;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.22);
  ctx.quadraticCurveTo(-r * 0.60 + tailWave, -r * 0.42, 0, -r * 0.88);
  ctx.stroke();
  // Zümrüt Zehir İğnesi
  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(-4, -r * 0.88); ctx.lineTo(8, -r * 0.98); ctx.lineTo(4, -r * 0.84);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 2. Altın Çöl Kitini Gövde & Bacaklar
  bossPixDisk(ctx, 0, 0, r * 0.58, '#d97706', '#78350f', '#facc15');

  // 3. Mısır Firavun Nemes Başlığı (Mavi-Altın Şeritler)
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(-r * 0.32, -r * 0.50, r * 0.64, r * 0.32);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-r * 0.32, -r * 0.40, r * 0.64, 3.5);

  // 4. ÇİFT DEV ALTIN KISKAÇ (2 Kıskaç - 2 Kol)
  const pincerSnap = Math.abs(Math.sin(time * 0.3)) * 0.28;
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(-r * 0.80, 0, r * 0.24, -0.8 + pincerSnap, 0.8 - pincerSnap);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.80, 0, r * 0.24, Math.PI - 0.8 + pincerSnap, Math.PI + 0.8 - pincerSnap);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------------------
// 9. KARANLIK KONTU ARCHON (NIGHT / VAMPIRE ARCHON)
// Full Body: Billowing bat-wing gothic cape, ruby brooch, silver hair, sharp claws, gothic boots.
// -------------------------------------------------------------------------
function drawBossPixelNight(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const wingFlap = Math.sin(time * 0.3) * (r * 0.15);

  ctx.save();
  ctx.translate(x, cy - r * 0.05);

  // 1. YARASA KANATLI GOTİK PELERİN (BAT-WING CAPE)
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.moveTo(-r * 0.24, -r * 0.32);
  ctx.lineTo(-r * 1.10, -r * 0.18 + wingFlap);
  ctx.lineTo(-r * 0.80, r * 0.52);
  ctx.lineTo(-r * 0.42, r * 0.22);
  ctx.lineTo(0, r * 0.62);
  ctx.lineTo(r * 0.42, r * 0.22);
  ctx.lineTo(r * 0.80, r * 0.52);
  ctx.lineTo(r * 1.10, -r * 0.18 - wingFlap);
  ctx.lineTo(r * 0.24, -r * 0.32);
  ctx.closePath();
  ctx.fill();

  // Kızıl Astar
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(-r * 0.18, -r * 0.22);
  ctx.lineTo(-r * 0.60, r * 0.42);
  ctx.lineTo(0, r * 0.18);
  ctx.lineTo(r * 0.60, r * 0.42);
  ctx.lineTo(r * 0.18, -r * 0.22);
  ctx.closePath();
  ctx.fill();

  // 2. Aristokrat Gövde & Yakut Broş
  bossPixDisk(ctx, 0, 0, r * 0.42, '#1e1b4b', '#000000');
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-r * 0.07, -r * 0.10, r * 0.14, r * 0.14);

  // 3. Gümüş Saçlar & Kırmızı Gözler
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(-r * 0.16, -r * 0.44, r * 0.32, r * 0.26);
  ctx.fillStyle = '#ff1744';
  ctx.shadowColor = '#ff1744';
  ctx.shadowBlur = 8;
  ctx.fillRect(-r * 0.11, -r * 0.34, r * 0.07, r * 0.05);
  ctx.fillRect(r * 0.04, -r * 0.34, r * 0.07, r * 0.05);
  ctx.shadowBlur = 0;

  // 4. Gotik Botlar (Yere basar)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-r * 0.20, r * 0.50, r * 0.14, r * 0.22);
  ctx.fillRect(r * 0.06, r * 0.50, r * 0.14, r * 0.22);

  ctx.restore();
}

// -------------------------------------------------------------------------
// 10. KETÇAP İMPARATORU (KETCHUP EMPEROR)
// Full Body: Fast-food monarch, sesame crown, royal mantle with fur trim, golden fry scepter, sauce boots.
// -------------------------------------------------------------------------
function drawBossPixelKetchup(ctx, x, cy, r, en, time, isRaged, facingLeft) {
  const stepPhase = ((en && en.walkTimer) || (time * 0.16)) * 2.8;
  const bounceY = Math.abs(Math.sin(stepPhase)) * (r * 0.14);
  const squashX = 1 + Math.sin(stepPhase) * 0.10;
  const squashY = 1 - Math.sin(stepPhase) * 0.10;

  ctx.save();
  ctx.translate(x, cy - bounceY - r * 0.05);
  ctx.scale(squashX, squashY);

  // 1. Kraliyet Pelerini
  const capeWave = Math.sin(stepPhase) * (r * 0.12);
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.22);
  ctx.lineTo(-r * 0.88 + capeWave, r * 0.60);
  ctx.lineTo(r * 0.88 + capeWave, r * 0.60);
  ctx.lineTo(r * 0.42, -r * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff'; // Samur kürk yakası
  ctx.fillRect(-r * 0.48, -r * 0.26, r * 0.96, r * 0.10);

  // 2. Jelatin Gövde & Hardal Kemeri
  bossPixDisk(ctx, 0, 0, r * 0.68, '#ef4444', '#b91c1c');
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-r * 0.46, r * 0.04, r * 0.92, r * 0.12);

  // 3. Altın Şişe Kapağı Tacı & Susam Mücevherleri
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, -r * 0.55);
  ctx.lineTo(-r * 0.38, -r * 0.86);
  ctx.lineTo(-r * 0.18, -r * 0.70);
  ctx.lineTo(0, -r * 0.92);
  ctx.lineTo(r * 0.18, -r * 0.70);
  ctx.lineTo(r * 0.38, -r * 0.86);
  ctx.lineTo(r * 0.35, -r * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-r * 0.16, -r * 0.68, 3, 4);
  ctx.fillRect(0, -r * 0.78, 3, 4);
  ctx.fillRect(r * 0.14, -r * 0.68, 3, 4);

  // 4. Parlayan Gözler
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-r * 0.16, -r * 0.26, r * 0.10, 0, Math.PI * 2);
  ctx.arc(r * 0.16, -r * 0.26, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-r * 0.14, -r * 0.26, r * 0.05, 0, Math.PI * 2);
  ctx.arc(r * 0.18, -r * 0.26, r * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // 5. Altın Patates Kızartması Asası (2 Kol - 1 Asa)
  const armSwing = Math.sin(stepPhase) * (r * 0.14);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(r * 0.58, r * 0.40 + armSwing);
  ctx.lineTo(r * 0.78, -r * 0.60 + armSwing);
  ctx.stroke();
  bossPixDisk(ctx, r * 0.78, -r * 0.62 + armSwing, r * 0.16, '#ef4444', '#facc15');

  // 6. Sos Botları (Yere Basan Ayaklar)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-r * 0.32, r * 0.58, r * 0.22, r * 0.16);
  ctx.fillRect(r * 0.10, r * 0.58, r * 0.22, r * 0.16);

  ctx.restore();
}
