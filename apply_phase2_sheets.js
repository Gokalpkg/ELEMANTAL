const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. UPDATE RAIJIN & ARCHON RENDERING IN drawCustomAnimatedPixelBoss
// =========================================================================
const oldStormNightPattern = `    } else if (bk === 'storm') {
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

    }`;

const newStormNightPattern = `    } else if (bk === 'storm') {
      // 5. Yıldırım Titanı Raijin: 5 Taiko Davulu & Aşırı Yüklü Statik Çekirdek (Pafta Image 3)
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

        // Tomoe Yıldırım Sembolü (İç merkez)
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Davullar arası elektrik arkları (Aşırı Gerilim Formunda)
        if (isRaged || Math.random() < 0.25) {
          const nextA = time * 0.09 + ((td + 1) % drumCount) * (Math.PI * 2 / drumCount);
          const nx = Math.cos(nextA) * drumOrbitR;
          const ny = drumCenterY + Math.sin(nextA) * (scaleH * 0.3);
          const midX = (tx + nx) * 0.5 + (Math.random() - 0.5) * 8;
          const midY = (ty + ny) * 0.5 + (Math.random() - 0.5) * 8;
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(midX, midY);
          ctx.lineTo(nx, ny);
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
      // 9. Karanlık Kontu Archon: Core Parlaması, Long Plume & Gölge Tacı (Pafta Image 4)
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

    }`;

const idx1 = html.indexOf(oldStormNightPattern);
if (idx1 !== -1) {
  html = html.slice(0, idx1) + newStormNightPattern + html.slice(idx1 + oldStormNightPattern.length);
  console.log('1. Successfully enhanced Raijin and Archon boss rendering!');
} else {
  console.log('Warning: oldStormNightPattern not found!');
}

// =========================================================================
// 2. ENHANCE RAIJIN & ARCHON ATTACKS (STATIC ORB MINES & BAT SWARM NOVA)
// =========================================================================
const oldStormAtk = `      } else {
        // Attack B: Dönen Statik Küre Mayınları
        spawnFloatText(en.x, en.y - 36, 'Statik Küreler!', '#00e5ff');
        burst(en.x, en.y, '#00e5ff', 16, 3.5);
        playSfx('skill2', 0.25, 420);
        const novaN = en.phase2 ? 8 : 5;
        for (let k = 0; k < novaN; k++) {
          const na = (Math.PI * 2 / novaN) * k;
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(na) * 2.8, vy: Math.sin(na) * 2.8,
            r: 7, dmg: 7, ox: en.x, oy: en.y, maxDist: 240,
            kind: 'ball_lightning', rot: 0
          });
        }
      }`;

const newStormAtk = `      } else {
        // Attack B: Statik Küre Mayınları Saldırı Dizisi (Pafta Image 3)
        spawnFloatText(en.x, en.y - 36, 'Statik Mayınlar!', '#00e5ff');
        burst(en.x, en.y, '#00e5ff', 20, 3.8);
        playSfx('skill2', 0.25, 420);
        // 360 Nova Telegraf Dairesi
        bossTelegraphs.push({
          kind: 'circle', x: en.x, y: en.y, r: 120,
          duration: 35, t: 0, color: '#00e5ff',
          onTrigger: (bt) => {
            shake = Math.max(shake, 12);
            playSfx('explode', 0.3, 440);
            const mineN = en.phase2 ? 8 : 6;
            for (let k = 0; k < mineN; k++) {
              const na = (Math.PI * 2 / mineN) * k;
              const mx = en.x + Math.cos(na) * 75;
              const my = en.y + Math.sin(na) * 75;
              hazards.push({ x: mx, y: my, r: 36, type: 'static_orb', until: performance.now() + 4500 });
              burst(mx, my, '#00e5ff', 10, 2.5);
            }
          }
        });
        const novaN = en.phase2 ? 8 : 5;
        for (let k = 0; k < novaN; k++) {
          const na = (Math.PI * 2 / novaN) * k;
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(na) * 3.0, vy: Math.sin(na) * 3.0,
            r: 7.5, dmg: 8, ox: en.x, oy: en.y, maxDist: 260,
            kind: 'ball_lightning', rot: 0
          });
        }
      }`;

const idxAtk1 = html.indexOf(oldStormAtk);
if (idxAtk1 !== -1) {
  html = html.slice(0, idxAtk1) + newStormAtk + html.slice(idxAtk1 + oldStormAtk.length);
  console.log('2. Successfully enhanced Raijin Static Orb Mine attacks!');
} else {
  console.log('Warning: oldStormAtk not found!');
}

const oldNightAtk = `      } else {
        // Attack B: Sülük Yarasa Sürüsü
        spawnFloatText(en.x, en.y - 36, 'Sülük Yarasalar!', '#d500f9');
        playSfx('skill2', 0.24, 400);
        const batN = en.phase2 ? 8 : 5;
        for (let k = 0; k < batN; k++) {
          const bAng = (Math.PI * 2 / batN) * k;
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(bAng) * 2.6, vy: Math.sin(bAng) * 2.6,
            r: 5.5, dmg: 6, ox: en.x, oy: en.y, maxDist: 220,
            kind: 'bat', face: bAng, bossRef: en
          });
        }
      }`;

const newNightAtk = `      } else {
        // Attack B: Yarasa Sürüsü Nova & Kesikli Mor Daire (Pafta Image 4)
        spawnFloatText(en.x, en.y - 36, 'Yarasa Sürüsü Nova!', '#d500f9');
        playSfx('skill2', 0.24, 400);
        // Kesikli Mor Telegraf Dairesi
        bossTelegraphs.push({
          kind: 'circle', x: player.x, y: player.y, r: 65,
          duration: 38, t: 0, color: '#d500f9',
          onTrigger: (bt) => {
            burst(bt.x, bt.y, '#d500f9', 22, 4.0);
            burst(bt.x, bt.y, '#ff1744', 14, 2.8);
            shake = Math.max(shake, 10);
            if (Math.hypot(player.x - bt.x, player.y - bt.y) < bt.r) {
              damagePlayer(en.phase2 ? 12 : 9);
              spawnFloatText(player.x, player.y - 20, 'Sülük Isırığı!', '#d500f9');
            }
          }
        });
        const batN = en.phase2 ? 10 : 6;
        for (let k = 0; k < batN; k++) {
          const bAng = (Math.PI * 2 / batN) * k;
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(bAng) * 2.8, vy: Math.sin(bAng) * 2.8,
            r: 6.0, dmg: 7, ox: en.x, oy: en.y, maxDist: 240,
            kind: 'bat', face: bAng, bossRef: en
          });
        }
      }`;

const idxAtk2 = html.indexOf(oldNightAtk);
if (idxAtk2 !== -1) {
  html = html.slice(0, idxAtk2) + newNightAtk + html.slice(idxAtk2 + oldNightAtk.length);
  console.log('3. Successfully enhanced Archon Bat Swarm Nova attacks!');
} else {
  console.log('Warning: oldNightAtk not found!');
}

// =========================================================================
// 3. ENHANCE BIOME PARTICLES FOR NIGHT (BLOOD VALLEY ASSETS & PARTICLES)
// =========================================================================
const oldMotesPattern = `    ctx.fillStyle = biome.key === 'lava' ? '#ff7a36' : biome.key === 'forest' ? '#5cd685' : biome.key === 'ice' ? '#bce8ff' : biome.key === 'storm' ? '#ffe853' : biome.accent;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
    ctx.fill();`;

const newMotesPattern = `    if (biome.key === 'night') {
      // Kan Damlası & Mor Sis (Pafta Image 1)
      ctx.fillStyle = (i % 2 === 0) ? '#dc2626' : '#a855f7';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 1.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = biome.key === 'lava' ? '#ff7a36' : biome.key === 'forest' ? '#5cd685' : biome.key === 'ice' ? '#bce8ff' : biome.key === 'storm' ? '#ffe853' : biome.accent;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }`;

const idxMotes = html.indexOf(oldMotesPattern);
if (idxMotes !== -1) {
  html = html.slice(0, idxMotes) + newMotesPattern + html.slice(idxMotes + oldMotesPattern.length);
  console.log('4. Successfully added Blood Valley particles to biome motes!');
} else {
  console.log('Warning: oldMotesPattern not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html! New length:', html.length);
