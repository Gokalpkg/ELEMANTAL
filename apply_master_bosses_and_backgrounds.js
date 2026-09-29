const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. UPGRADE ALL 10 BOSS VISUAL CORES IN drawCustomAnimatedPixelBoss
// Aligning every boss with the exact design sheets uploaded by the user!
// =========================================================================
const bossBlockStart = '    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı';
const bossBlockEnd = `    ctx.restore();
    return;
  }

  // Fallback to procedural renderer if image is loading`;

const newMasterBossCores = `    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı
    if (bk === 'stone') {
      // 1. KADİM TAŞ TİTANI (Ancient Stone Titan - Pafta Image 1)
      // Runic Granite Body, Tectonic Plume, Glowing Purple/Cyan Runic Core
      const coreY = -scaleH * 0.44;
      const pulse = 0.75 + Math.sin(time * 0.12) * 0.25;
      ctx.save();

      // Runic Granite Chest Core (Glowing Purple with Cyan Veins)
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath(); ctx.arc(0, coreY, 2.8, 0, Math.PI * 2); ctx.fill();

      // Tectonic Plume (Miğferinden ve omuzlarından yükselen mor/cyan duman & rünik partiküller)
      for (let p = 0; p < 4; p++) {
        const pa = time * 0.1 + p * 1.8;
        const px = Math.sin(pa) * (r * 0.4);
        const py = -scaleH * 0.76 - Math.abs(Math.cos(pa)) * 14;
        ctx.fillStyle = (p % 2 === 0) ? 'rgba(168, 85, 247, 0.5)' : 'rgba(0, 229, 255, 0.4)';
        ctx.beginPath(); ctx.arc(px, py, 3.5 + p * 1.8, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Supercharged Runic Core (Cyan/Purple Blazing Horns & Crown)
      if (isRaged) {
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        // Alevli rünik granit boynuzlar
        ctx.moveTo(-12, -scaleH * 0.76); ctx.lineTo(-22, -scaleH * 0.98); ctx.lineTo(-8, -scaleH * 0.84);
        ctx.moveTo(12, -scaleH * 0.76); ctx.lineTo(22, -scaleH * 0.98); ctx.lineTo(8, -scaleH * 0.84);
        ctx.stroke();

        // Rünik Şimşek Arkı
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-16, coreY); ctx.lineTo(-26, coreY - 10); ctx.lineTo(-20, coreY - 20);
        ctx.moveTo(16, coreY); ctx.lineTo(26, coreY - 10); ctx.lineTo(20, coreY - 20);
        ctx.stroke();
      }
      ctx.restore();

    } else if (bk === 'lava') {
      // 2. LAV LORDU İFRİT (Lava Lord - Pafta Image 2)
      // Heavy Obsidian Armor, Magma Heart, Lava Footprints, Blazing Horns
      const heartY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.16) * 0.25;
      ctx.save();

      // Akkor Magma Kalbi (Magma Heart)
      ctx.fillStyle = '#ffd600';
      ctx.shadowColor = '#ff3d00';
      ctx.shadowBlur = 20 * pulse;
      ctx.beginPath();
      ctx.arc(0, heartY, 7.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, heartY, 3.2, 0, Math.PI * 2); ctx.fill();

      // Alevli Ayak İzleri Korları
      ctx.fillStyle = '#ff3d00';
      ctx.fillRect(-r * 0.45, 2, 7, 3);
      ctx.fillRect(r * 0.25, 2, 7, 3);

      // Faz 2: Apocalyptic Flame Formu (Kıyamet Alevi Tacı & Obsidyen Çatlak Lavları)
      if (isRaged) {
        ctx.fillStyle = '#ff9100';
        ctx.shadowColor = '#ff3d00';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(-14, -scaleH * 0.75); ctx.lineTo(-26, -scaleH * 1.02); ctx.lineTo(-7, -scaleH * 0.84);
        ctx.lineTo(0, -scaleH * 1.08);
        ctx.lineTo(7, -scaleH * 0.84); ctx.lineTo(26, -scaleH * 1.02); ctx.lineTo(14, -scaleH * 0.75);
        ctx.closePath();
        ctx.fill();

        // Püsküren lav korları
        for (let s = 0; s < 3; s++) {
          const sa = time * 0.2 + s * 2.2;
          const sx = Math.sin(sa) * (r * 0.6);
          const sy = heartY - 10 - Math.abs(Math.sin(time * 0.25 + s)) * 16;
          ctx.fillStyle = '#ffeb3b';
          ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

    } else if (bk === 'ice') {
      // 3. KUTUP HÜKÜMDARI YETİ (Frost Yeti - Pafta Image 3)
      // Dense Polar Fur, Ice Armor, Torso Glowing Core, Glacial Plume
      const coreY = -scaleH * 0.46;
      const pulse = 0.8 + Math.sin(time * 0.15) * 0.25;
      ctx.save();

      // Işıltılı Donmuş Göğüs Çekirdeği (Glowing Core)
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, coreY, 3.0, 0, Math.PI * 2); ctx.fill();

      // Glacial Plume (Buzul nefesi dumanı)
      for (let g = 0; g < 4; g++) {
        const ga = time * 0.12 + g * 1.6;
        const gx = Math.sin(ga) * (r * 0.35);
        const gy = -scaleH * 0.78 - Math.abs(Math.cos(ga)) * 12;
        ctx.fillStyle = 'rgba(128, 216, 255, 0.5)';
        ctx.beginPath(); ctx.arc(gx, gy, 3.5 + g * 1.8, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Dondurucu Gazap Formu (Buz Taçlı Miğfer & Dönen 3 Buzul Parçası)
      if (isRaged) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#80d8ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(-18, -scaleH * 0.72); ctx.lineTo(-24, -scaleH * 0.95); ctx.lineTo(-9, -scaleH * 0.82);
        ctx.lineTo(0, -scaleH * 1.0); ctx.lineTo(9, -scaleH * 0.82); ctx.lineTo(24, -scaleH * 0.95); ctx.lineTo(18, -scaleH * 0.72);
        ctx.closePath();
        ctx.fill();

        for (let o = 0; o < 3; o++) {
          const oa = time * 0.12 + o * (Math.PI * 2 / 3);
          const ox = Math.cos(oa) * (r * 0.75);
          const oy = coreY + Math.sin(oa) * (r * 0.4);
          ctx.fillStyle = '#80d8ff';
          ctx.beginPath(); ctx.arc(ox, oy, 4.0, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

    } else if (bk === 'water') {
      // 4. DERİNLİK LORDU LEVİATHAN (Water Leviathan - Pafta Image 4)
      // Serpentine Body, Coral Armor, Deep Pearl, Whirlpool Trail
      const pearlY = -scaleH * 0.42;
      const pulse = 0.8 + Math.sin(time * 0.14) * 0.22;
      ctx.save();

      // Derinlik İncisi (Deep Pearl)
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, pearlY, 7.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, pearlY, 3.0, 0, Math.PI * 2); ctx.fill();

      // Yüzerken arkasında bıraktığı su kabarcıkları ve girdap izleri
      for (let w = 0; w < 4; w++) {
        const wa = time * 0.12 + w * 1.5;
        const wx = Math.sin(wa) * (r * 0.85);
        const wy = pearlY - 6 - Math.abs(Math.sin(time * 0.15 + w)) * 16;
        ctx.fillStyle = 'rgba(103, 232, 249, 0.75)';
        ctx.beginPath(); ctx.arc(wx, wy, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Tsunami Lordu Formu (Mercan zırh ışıması & 360 Hidro Halka)
      if (isRaged) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.8;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, pearlY, r * 0.85, -0.9, 0.9);
        ctx.stroke();
      }
      ctx.restore();

    } else if (bk === 'storm') {
      // 5. YILDIRIM TİTANI RAİJİN (Storm Raijin - Pafta Image 3)
      // 5 Taiko Davulu, Aşırı Yüklü Statik Çekirdek, Amaru Formu
      ctx.save();
      const drumCount = 5;
      const drumOrbitR = scaleW * 0.54;
      const drumCenterY = -scaleH * 0.52;
      
      // Taiko Davulları ve Aralarındaki Elektrik Arkları
      for (let td = 0; td < drumCount; td++) {
        const ta = time * 0.09 + td * (Math.PI * 2 / drumCount);
        const tx = Math.cos(ta) * drumOrbitR;
        const ty = drumCenterY + Math.sin(ta) * (scaleH * 0.3);

        // Davul Gövdesi
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#ffd600';
        ctx.shadowBlur = isRaged ? 12 : 8;
        ctx.beginPath();
        ctx.arc(tx, ty, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tomoe Yıldırım Sembolü
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Davullar arası elektrik arkları
        if (isRaged || Math.random() < 0.28) {
          const nextA = time * 0.09 + ((td + 1) % drumCount) * (Math.PI * 2 / drumCount);
          const nx = Math.cos(nextA) * drumOrbitR;
          const ny = drumCenterY + Math.sin(nextA) * (scaleH * 0.3);
          const midX = (tx + nx) * 0.5 + (Math.random() - 0.5) * 8;
          const midY = (ty + ny) * 0.5 + (Math.random() - 0.5) * 8;
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tx, ty); ctx.lineTo(midX, midY); ctx.lineTo(nx, ny);
          ctx.stroke();
        }
      }

      // Aşırı Yüklü Statik Çekirdek (Overcharged Core)
      const coreY = -scaleH * 0.48;
      const pulse = 0.85 + Math.sin(time * 0.22) * 0.25;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 20 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Faz 2: Aşırı Gerilim Formu (Amaru Formu & Cyan Alevli Boynuzlar)
      if (isRaged) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#67e8f9';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-16, -scaleH * 0.78); ctx.lineTo(-24, -scaleH * 1.02); ctx.lineTo(-8, -scaleH * 0.85);
        ctx.lineTo(0, -scaleH * 1.05);
        ctx.lineTo(8, -scaleH * 0.85); ctx.lineTo(24, -scaleH * 1.02); ctx.lineTo(16, -scaleH * 0.78);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'night') {
      // 6. KARANLIK KONTU ARCHON (Night Archon - Pafta Image 4)
      // Core Parlaması, Long Plume & Gölge Tacı, Bat Flocks
      const rubyY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.18) * 0.25;
      ctx.save();
      
      // Long Plume (Ayak altından ve pelerinden süzülen dalgalı mor-siyah hayalet sisi)
      for (let p = 0; p < 4; p++) {
        const pa = time * 0.12 + p * 1.5;
        const px = Math.sin(pa) * (r * 0.5);
        const py = 2 + Math.abs(Math.cos(pa)) * 14;
        ctx.fillStyle = 'rgba(74, 20, 140, 0.55)';
        ctx.beginPath();
        ctx.ellipse(px, py, 6 + p * 2, 4 + p, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vampirik Core Parlaması (Göğüste parlayan fuşya/mor çekirdek)
      ctx.fillStyle = '#f0abfc';
      ctx.shadowColor = '#d500f9';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, rubyY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, rubyY, 2.6, 0, Math.PI * 2); ctx.fill();

      // Faz 2: Gerçek Kan Lordu Formu (Aşırı Yüklü Gölge Tacı & Rünik Parlamalar)
      if (isRaged) {
        ctx.fillStyle = '#9333ea';
        ctx.shadowColor = '#d500f9';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        // 5 uçlu sivri gölge boynuzları
        ctx.moveTo(-16, -scaleH * 0.72); ctx.lineTo(-24, -scaleH * 0.94); ctx.lineTo(-10, -scaleH * 0.82);
        ctx.lineTo(-4, -scaleH * 1.0); ctx.lineTo(0, -scaleH * 0.84); ctx.lineTo(4, -scaleH * 1.0);
        ctx.lineTo(10, -scaleH * 0.82); ctx.lineTo(24, -scaleH * 0.94); ctx.lineTo(16, -scaleH * 0.72);
        ctx.closePath();
        ctx.fill();

        // Kan Damlası Embers
        for (let b = 0; b < 3; b++) {
          const ba = time * 0.15 + b * 2.1;
          const bx = Math.sin(ba) * (r * 0.7);
          const by = rubyY - 8 - Math.abs(Math.sin(time * 0.2 + b)) * 16;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

    } else if (bk === 'forest') {
      // 7. ULU ORMAN RUHU (Dryad - Kadın Doğa Ruhu)
      ctx.save();
      for (let l = 0; l < 5; l++) {
        const la = time * 0.08 + l * (Math.PI * 2 / 5);
        const lx = Math.cos(la) * (r * 1.18);
        const ly = -scaleH * 0.45 + Math.sin(la * 1.5) * (r * 0.55);
        ctx.fillStyle = l % 2 === 0 ? '#4ade80' : '#fde047';
        ctx.shadowColor = '#86efac';
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      // Çiçek Tacı & Orman Kalbi
      ctx.fillStyle = '#a7f3d0';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, -scaleH * 0.48, 5.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (bk === 'pink') {
      // 8. ŞEKER PRENSESİ (Sugar Princess)
      // %100 Saf Şeffaf Canvas, Lolipop Yıldız Asası, Peri Kanatları
      ctx.save();
      const wingFlap = Math.sin(time * 0.35) * 4;
      ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.6, -scaleH * 0.45 + wingFlap, r * 0.35, r * 0.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(r * 0.6, -scaleH * 0.45 - wingFlap, r * 0.35, r * 0.5, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Yıldız Tozu & Kalp Parıltısı
      for (let k = 0; k < 3; k++) {
        const ka = time * 0.1 + k * 2.0;
        const kx = Math.sin(ka) * (r * 0.8);
        const ky = -scaleH * 0.5 - Math.abs(Math.cos(ka)) * 14;
        ctx.fillStyle = '#f472b6';
        ctx.beginPath(); ctx.arc(kx, ky, 2.0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'ketchup') {
      // 9. KETÇAP SAVAŞ LORDU (Ketchup Warlord)
      // Volkanik Ketçap Çekirdeği, Alevli Kılıç, Altın Şişe Kapağı Miğferi
      const coreY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.2) * 0.25;
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 16 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.8 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, coreY, 2.8, 0, Math.PI * 2); ctx.fill();

      // Faz 2: Alevli Hardal Boynuzları
      if (isRaged) {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(-12, -scaleH * 0.75); ctx.lineTo(-20, -scaleH * 0.95); ctx.lineTo(-4, -scaleH * 0.8);
        ctx.moveTo(12, -scaleH * 0.75); ctx.lineTo(20, -scaleH * 0.95); ctx.lineTo(4, -scaleH * 0.8);
        ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'sand') {
      // 10. KUM AKREP FİRAVUNU (Sand Pharaoh)
      // Nemes Başlığı, Zümrüt Zehirli İğne, Altın Çöl Tozu
      ctx.save();
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, -scaleH * 0.82, 5.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, -scaleH * 0.82, 2.0, 0, Math.PI * 2); ctx.fill();

      // Altın kum tozları
      for (let s = 0; s < 3; s++) {
        const sa = time * 0.12 + s * 2.0;
        const sx = Math.sin(sa) * (r * 0.7);
        const sy = -scaleH * 0.5 + Math.cos(sa) * 10;
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }`;

const bIdx1 = html.indexOf(bossBlockStart);
const bIdx2 = html.indexOf(bossBlockEnd);
if (bIdx1 !== -1 && bIdx2 !== -1) {
  html = html.slice(0, bIdx1) + newMasterBossCores + '\n\n' + html.slice(bIdx2);
  console.log('1. Successfully upgraded all 10 Boss Cores in drawCustomAnimatedPixelBoss!');
} else {
  console.log('Warning: Boss core block markers not found!');
}

// =========================================================================
// 2. UPGRADE STONE BIOME WORLD FLOOR IN drawUnifiedBiomeWorldFloor
// Granit döşemeler, Sismik Yer Yarığı koridoru, mor & cyan parıldayan rünler!
// =========================================================================
const oldStoneFloorStart = '  } else {\n    // 10. TAŞ DİYARI BİYOMU — PAFTA IMAGE 3';
const oldStoneFloorEnd = '  const vig = ctx.createRadialGradient(';

const newStoneFloor = `  } else {
    // 10. TAŞ DİYARI BİYOMU — PAFTA IMAGE 1 (KADİM TAŞ TİTANI)
    // Sismik Yer Yarığı Koridoru, Megalitik Granit Zemin Plakaları & Rünik Çatlaklar
    ctx.fillStyle = '#0f1118';
    ctx.fillRect(left, top, width, height);

    const stnG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    stnG.addColorStop(0, 'rgba(28, 24, 42, 0.5)');
    stnG.addColorStop(1, 'rgba(10, 11, 16, 0.95)');
    ctx.fillStyle = stnG;
    ctx.fillRect(left, top, width, height);

    // Sismik Yer Yarığı Koridoru (Mor & Cyan ışıyan sismik kırıklar)
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    const crackStep = 240;
    const crackStartX = Math.floor(left / crackStep) * crackStep;
    for (let x = crackStartX; x <= right; x += crackStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + 50, top + (bottom - top) * 0.3);
      ctx.lineTo(x - 30, top + (bottom - top) * 0.6);
      ctx.lineTo(x + 40, bottom);
      ctx.stroke();
    }
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    for (let x = crackStartX; x <= right; x += crackStep) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + 50, top + (bottom - top) * 0.3);
      ctx.lineTo(x - 30, top + (bottom - top) * 0.6);
      ctx.lineTo(x + 40, bottom);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Granit Monolitler & Rünik Granit Taşları
    const oStep = 220;
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
          const mh = 48 + fract * 20;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(mx + mw * 0.4, my + mh - 2, mw * 0.85, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#22202c';
          ctx.beginPath();
          ctx.moveTo(mx + 4, my);
          ctx.lineTo(mx + mw - 3, my + 4);
          ctx.lineTo(mx + mw, my + mh);
          ctx.lineTo(mx, my + mh);
          ctx.closePath();
          ctx.fill();

          const runePulse = 0.7 + Math.sin(time * 0.05 + ox * 0.01) * 0.3;
          ctx.strokeStyle = (fract > 0.7) ? '#a855f7' : '#00e5ff';
          ctx.shadowColor = ctx.strokeStyle;
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

  `;

const sfIdx1 = html.indexOf(oldStoneFloorStart);
const sfIdx2 = html.indexOf(oldStoneFloorEnd);
if (sfIdx1 !== -1 && sfIdx2 !== -1) {
  html = html.slice(0, sfIdx1) + newStoneFloor + html.slice(sfIdx2);
  console.log('2. Successfully upgraded Stone Biome World Floor!');
} else {
  console.log('Warning: Stone floor markers not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
