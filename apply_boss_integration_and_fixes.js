const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. UPDATE getBiomeBossConfig (AUTHENTIC WEAKNESSES & PHASE TITLES FROM SHEETS)
// =========================================================================
const cfgStart = 'function getBiomeBossConfig(biomeKey, wave) {';
const cfgEnd = 'function spawnWave() {';

const newCfgCode = `function getBiomeBossConfig(biomeKey, wave) {
  const bossHpMul = getWaveHpMul(wave);
  const hp1 = Math.round((95 + wave * 26) * bossHpMul);
  const hp2 = Math.round((80 + wave * 22) * bossHpMul);
  switch (biomeKey) {
    case 'stone':
      return {
        title: 'Kadim Taş Titanı',
        phaseTitle: 'Aşırı Yüklü Rünik Çekirdek',
        r: 48,
        bossType: 'stone',
        layers: [
          { need:'nature', name:'Rünik Granit Kabuk', hp: hp1, maxHp: hp1, color:'#8d6e63' },
          { need:'water', name:'Rünik Çekirdek', hp: hp2, maxHp: hp2, color:'#00e5ff' }
        ]
      };
    case 'lava':
      return {
        title: 'Lav Lordu İfrit',
        phaseTitle: 'Kıyamet Alevi Formu',
        r: 46,
        bossType: 'lava',
        layers: [
          { need:'water', name:'Obsidyen Zırh', hp: hp1, maxHp: hp1, color:'#3e2723' },
          { need:'ice', name:'Magma Kalbi', hp: hp2, maxHp: hp2, color:'#ff3d00' }
        ]
      };
    case 'forest':
      return {
        title: 'Ulu Orman Ruhu (Dryad)',
        phaseTitle: 'Çılgın Doğa Gazabı',
        r: 46,
        bossType: 'forest',
        layers: [
          { need:'fire', name:'Dikenli Sarmaşık', hp: hp1, maxHp: hp1, color:'#2e7d32' },
          { need:'storm', name:'Kadim Meşe', hp: hp2, maxHp: hp2, color:'#558b2f' }
        ]
      };
    case 'ice':
      return {
        title: 'Kutup Hükümdarı Yeti',
        phaseTitle: 'Dondurucu Gazap Formu',
        r: 46,
        bossType: 'ice',
        layers: [
          { need:'fire', name:'Kutup Kürkü & Buz Zırhı', hp: hp1, maxHp: hp1, color:'#9be7ff' },
          { need:'storm', name:'Donmuş Çekirdek', hp: hp2, maxHp: hp2, color:'#00e5ff' }
        ]
      };
    case 'storm':
      return {
        title: 'Yıldırım Titanı Raijin',
        phaseTitle: 'Aşırı Gerilim Formu',
        r: 45,
        bossType: 'storm',
        layers: [
          { need:'earth', name:'Statik Bariyer', hp: hp1, maxHp: hp1, color:'#ffd54f' },
          { need:'nature', name:'Yıldırım Çekirdeği', hp: hp2, maxHp: hp2, color:'#00e5ff' }
        ]
      };
    case 'water':
      return {
        title: 'Derinlik Lordu Leviathan',
        phaseTitle: 'Tsunami Lordu Formu',
        r: 48,
        bossType: 'water',
        layers: [
          { need:'storm', name:'Mercan Zırhı', hp: hp1, maxHp: hp1, color:'#26c6da' },
          { need:'fire', name:'Derinlik İncisi', hp: hp2, maxHp: hp2, color:'#0097a7' }
        ]
      };
    case 'sand':
      return {
        title: 'Kum Akrep Firavunu',
        phaseTitle: 'Kum Girdabı Muhafızı',
        r: 48,
        bossType: 'sand',
        layers: [
          { need:'water', name:'Rünlü Kumtaşı Kabuğu', hp: hp1, maxHp: hp1, color:'#ffd54f' },
          { need:'nature', name:'Kadim Kum Obeliski', hp: hp2, maxHp: hp2, color:'#bcaaa4' }
        ]
      };
    case 'night':
      return {
        title: 'Karanlık Kontu Archon',
        phaseTitle: 'Gerçek Kan Lordu Formu',
        r: 46,
        bossType: 'night',
        layers: [
          { need:'fire', name:'Kan Kalkanı', hp: hp1, maxHp: hp1, color:'#d32f2f' },
          { need:'storm', name:'Aşırı Yüklü Gölge Tacı', hp: hp2, maxHp: hp2, color:'#7b1fa2' }
        ]
      };
    case 'pink':
      return {
        title: 'Şeker Prensesi',
        phaseTitle: 'Büyülü Lolipop Hükmü',
        r: 44,
        bossType: 'pink',
        layers: [
          { need:'earth', name:'Pamuk Şeker Pelerini', hp: hp1, maxHp: hp1, color:'#f48fb1' },
          { need:'fire', name:'Kristal Lolipop Tacı', hp: hp2, maxHp: hp2, color:'#ec407a' }
        ]
      };
    case 'ketchup':
    default:
      return {
        title: 'Ketçap Savaş Lordu',
        phaseTitle: 'Kızgın Sos Öfkesi',
        r: 46,
        bossType: 'ketchup',
        layers: [
          { need:'water', name:'Acı Hardal Zırhı', hp: hp1, maxHp: hp1, color:'#fbc02d' },
          { need:'ice', name:'Ketçap Çekirdeği', hp: hp2, maxHp: hp2, color:'#c62828' }
        ]
      };
  }
}

`;

const cfgIdx1 = html.indexOf(cfgStart);
const cfgIdx2 = html.indexOf(cfgEnd);
html = html.slice(0, cfgIdx1) + newCfgCode + html.slice(cfgIdx2);
console.log('1. Successfully updated getBiomeBossConfig!');

// =========================================================================
// 2. FIX PAUSE BUTTON CSS (BIGGER HITBOX, HIGH Z-INDEX, INSTANT RESPONSE)
// =========================================================================
const oldPauseCss = `  .pause-btn {
    position:absolute;
    right: max(10px, env(safe-area-inset-right, 0px));
    top: max(10px, env(safe-area-inset-top, 0px));
    z-index:12;
    width:44px; height:44px; border-radius:12px; border:1px solid rgba(255,255,255,0.22);
    background:rgba(20,24,34,0.95); color:#eee; font-size:18px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    /* no blur */ transition:transform .12s;
  }
  .pause-btn:active { transform:scale(0.9); }`;

const newPauseCss = `  .pause-btn {
    position:absolute;
    right: max(10px, env(safe-area-inset-right, 0px));
    top: max(10px, env(safe-area-inset-top, 0px));
    z-index:99;
    width:50px; height:50px; border-radius:14px; border:2px solid rgba(255,255,255,0.3);
    background:rgba(20,24,34,0.96); color:#eee; font-size:22px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.55);
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    transition:transform .12s;
  }
  .pause-btn:active { transform:scale(0.88); background:rgba(40,48,68,0.98); }`;

const cssIdx = html.indexOf(oldPauseCss);
if (cssIdx !== -1) {
  html = html.slice(0, cssIdx) + newPauseCss + html.slice(cssIdx + oldPauseCss.length);
  console.log('2. Successfully updated .pause-btn CSS!');
}

// =========================================================================
// 3. FIX PAUSE BUTTON JAVASCRIPT LISTENER (POINTERDOWN FOR INSTANT MOBILE RESPONSE)
// =========================================================================
const oldPauseJs = `let pauseTouchHandled = false;
pauseBtn.addEventListener('touchend', e => {
  e.preventDefault();
  e.stopPropagation();
  pauseTouchHandled = true;
  togglePause();
  setTimeout(() => { pauseTouchHandled = false; }, 400);
}, {passive:false});
pauseBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (pauseTouchHandled) return;
  togglePause();
});`;

const newPauseJs = `let pauseTouchHandled = false;
pauseBtn.addEventListener('pointerdown', e => {
  e.preventDefault();
  e.stopPropagation();
  pauseTouchHandled = true;
  togglePause();
  setTimeout(() => { pauseTouchHandled = false; }, 300);
});
pauseBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (pauseTouchHandled) return;
  togglePause();
});`;

const jsIdx = html.indexOf(oldPauseJs);
if (jsIdx !== -1) {
  html = html.slice(0, jsIdx) + newPauseJs + html.slice(jsIdx + oldPauseJs.length);
  console.log('3. Successfully updated pauseBtn JS listener to pointerdown!');
}

// =========================================================================
// 4. DETAIL AND COMBINE ALL 10 BOSS CORES IN drawCustomAnimatedPixelBoss
// =========================================================================
const bossCoreStart = '    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı';
const bossCoreEnd = `    ctx.restore();
    return;
  }

  // Fallback to procedural renderer if image is loading`;

const newBossCores = `    // Paftalara göre Boss İçi Özel Çekirdek & Efekt Renderı
    if (bk === 'stone') {
      // 1. Kadim Taş Titanı: Mor Rünik Çekirdek & Tektonik Plume (Pafta Image 1)
      const coreY = -scaleH * 0.44;
      const pulse = 0.75 + Math.sin(time * 0.12) * 0.25;
      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 16 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, coreY, 2.5, 0, Math.PI * 2); ctx.fill();

      // Tektonik Plume (Başından yükselen mor duman/parıltı)
      for (let p = 0; p < 3; p++) {
        const pa = time * 0.1 + p * 2.0;
        const px = Math.sin(pa) * (r * 0.35);
        const py = -scaleH * 0.75 - Math.abs(Math.cos(pa)) * 12;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.beginPath(); ctx.arc(px, py, 4 + p * 2, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Rünik Parlamalar & Taç
      if (isRaged) {
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -scaleH * 0.78); ctx.lineTo(-18, -scaleH * 0.95);
        ctx.moveTo(10, -scaleH * 0.78); ctx.lineTo(18, -scaleH * 0.95);
        ctx.stroke();
      }
      ctx.restore();

    } else if (bk === 'lava') {
      // 2. Lav Lordu İfrit: Magma Kalbi & Alevli Taç (Pafta Image 2)
      const heartY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.16) * 0.25;
      ctx.save();
      ctx.fillStyle = '#ffd600';
      ctx.shadowColor = '#ff3d00';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, heartY, 7.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, heartY, 3, 0, Math.PI * 2); ctx.fill();

      // Alevli Ayak İzleri Partikülleri
      ctx.fillStyle = '#ff3d00';
      ctx.fillRect(-r * 0.4, 2, 6, 3);
      ctx.fillRect(r * 0.2, 2, 6, 3);

      // Faz 2: Kıyamet Alevi Formu (Başında alevli taç)
      if (isRaged) {
        ctx.fillStyle = '#ff9100';
        ctx.shadowColor = '#ff3d00';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(-14, -scaleH * 0.75); ctx.lineTo(-24, -scaleH * 0.98); ctx.lineTo(-6, -scaleH * 0.82);
        ctx.lineTo(0, -scaleH * 1.02);
        ctx.lineTo(6, -scaleH * 0.82); ctx.lineTo(24, -scaleH * 0.98); ctx.lineTo(14, -scaleH * 0.75);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'ice') {
      // 3. Kutup Hükümdarı Yeti: Işıltılı Çekirdek & Glacial Plume (Pafta Image 3)
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
      ctx.beginPath(); ctx.arc(0, coreY, 2.8, 0, Math.PI * 2); ctx.fill();

      // Glacial Plume (Buz nefesi dumanı)
      for (let g = 0; g < 3; g++) {
        const ga = time * 0.12 + g * 1.8;
        const gx = Math.sin(ga) * (r * 0.3);
        const gy = -scaleH * 0.78 - Math.abs(Math.cos(ga)) * 10;
        ctx.fillStyle = 'rgba(128, 216, 255, 0.45)';
        ctx.beginPath(); ctx.arc(gx, gy, 3.5 + g * 2, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Dondurucu Gazap Formu (Buz Taçlı Miğfer & Dönen 3 Buzul Parçası)
      if (isRaged) {
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(-16, -scaleH * 0.72); ctx.lineTo(-22, -scaleH * 0.92); ctx.lineTo(-8, -scaleH * 0.80);
        ctx.lineTo(0, -scaleH * 0.96); ctx.lineTo(8, -scaleH * 0.80); ctx.lineTo(22, -scaleH * 0.92); ctx.lineTo(16, -scaleH * 0.72);
        ctx.closePath();
        ctx.fill();

        for (let o = 0; o < 3; o++) {
          const oa = time * 0.1 + o * (Math.PI * 2 / 3);
          const ox = Math.cos(oa) * (r * 0.7);
          const oy = coreY + Math.sin(oa) * (r * 0.35);
          ctx.fillStyle = '#80d8ff';
          ctx.beginPath(); ctx.arc(ox, oy, 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

    } else if (bk === 'water') {
      // 4. Derinlik Lordu Leviathan: Mercan Zırhı & Derinlik İncisi (Pafta Image 4)
      const pearlY = -scaleH * 0.42;
      const pulse = 0.8 + Math.sin(time * 0.14) * 0.22;
      ctx.save();
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 15 * pulse;
      ctx.beginPath();
      ctx.arc(0, pearlY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, pearlY, 2.8, 0, Math.PI * 2); ctx.fill();

      // Su kabarcıkları ve sıçramalar
      for (let w = 0; w < 4; w++) {
        const wa = time * 0.12 + w * 1.5;
        const wx = Math.sin(wa) * (r * 0.85);
        const wy = pearlY - 6 - Math.abs(Math.sin(time * 0.15 + w)) * 14;
        ctx.fillStyle = 'rgba(103, 232, 249, 0.7)';
        ctx.beginPath(); ctx.arc(wx, wy, 2, 0, Math.PI * 2); ctx.fill();
      }

      // Faz 2: Tsunami Lordu Formu (Parlayan mercan zırh aurası)
      if (isRaged) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, pearlY, r * 0.8, -0.8, 0.8);
        ctx.stroke();
      }
      ctx.restore();

    } else if (bk === 'storm') {
      // 5. Yıldırım Titanı Raijin: 5 Taiko Davulu & Aşırı Gerilim
      ctx.save();
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

      const coreY = -scaleH * 0.48;
      const pulse = 0.85 + Math.sin(time * 0.2) * 0.25;
      ctx.fillStyle = '#fff9c4';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 18 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.0 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (bk === 'forest') {
      // 6. Ulu Orman Ruhu: Peri Tozları & Süzülen Yapraklar
      ctx.save();
      for (let l = 0; l < 4; l++) {
        const la = time * 0.08 + l * (Math.PI / 2);
        const lx = Math.cos(la) * (r * 1.15);
        const ly = -scaleH * 0.45 + Math.sin(la * 1.5) * (r * 0.55);
        ctx.fillStyle = l % 2 === 0 ? '#4ade80' : '#fde047';
        ctx.shadowColor = '#86efac';
        ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(lx, ly, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'pink') {
      // 7. Şeker Prensesi: Peri Kanatları & Kalp Motesi
      ctx.save();
      const wingFlap = Math.sin(time * 0.35) * 4;
      ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.6, -scaleH * 0.45 + wingFlap, r * 0.35, r * 0.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(r * 0.6, -scaleH * 0.45 - wingFlap, r * 0.35, r * 0.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (bk === 'ketchup') {
      // 8. Ketçap Savaş Lordu: Volkanik Ketçap Çekirdeği & Alevli Kılıç
      const coreY = -scaleH * 0.48;
      const pulse = 0.8 + Math.sin(time * 0.2) * 0.25;
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 15 * pulse;
      ctx.beginPath();
      ctx.arc(0, coreY, 6.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, coreY, 2.8, 0, Math.PI * 2); ctx.fill();

      // Faz 2: Alevli Boynuzlar
      if (isRaged) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-12, -scaleH * 0.75); ctx.lineTo(-20, -scaleH * 0.95); ctx.lineTo(-4, -scaleH * 0.8);
        ctx.moveTo(12, -scaleH * 0.75); ctx.lineTo(20, -scaleH * 0.95); ctx.lineTo(4, -scaleH * 0.8);
        ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'night') {
      // 9. Karanlık Kontu Archon: Mor Gölge Çekirdeği & Gölge Tacı
      const rubyY = -scaleH * 0.46;
      ctx.save();
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, rubyY, 6.0, 0, Math.PI * 2);
      ctx.fill();

      if (isRaged) {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(-14, -scaleH * 0.72); ctx.lineTo(-20, -scaleH * 0.90); ctx.lineTo(-6, -scaleH * 0.80);
        ctx.lineTo(0, -scaleH * 0.95); ctx.lineTo(6, -scaleH * 0.80); ctx.lineTo(20, -scaleH * 0.90); ctx.lineTo(14, -scaleH * 0.72);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

    } else if (bk === 'sand') {
      // 10. Kum Akrep Firavunu: Altın Çöl Tozu & Zümrüt Zehir
      ctx.save();
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, -scaleH * 0.8, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }`;

const bcIdx1 = html.indexOf(bossCoreStart);
const bcIdx2 = html.indexOf(bossCoreEnd);
if (bcIdx1 !== -1 && bcIdx2 !== -1) {
  html = html.slice(0, bcIdx1) + newBossCores + '\n\n' + html.slice(bcIdx2);
  console.log('4. Successfully detailed and combined all 10 boss cores in drawCustomAnimatedPixelBoss!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
