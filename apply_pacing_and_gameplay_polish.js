const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. STREAMLINE ONWAVECLEARED: REMOVE BREATH OVERLAY MODAL INTERRUPTION & UNIFY FLOW
const oldBossClearFlow = `      // Nefes ekranı varsa aç, yoksa sonraki dalgaya geç
      const br = document.getElementById('breathOverlay');
      if (br) {
        br.classList.add('show');
        return;
      }

      wave = clearedWave + 1;
      applyWaveUnlocks();
      spawnWave();
      ensureEnemiesSpawned();
      paused = false;
      return;
    }

    // Pre-boss merchant (Dalga 3 ve Dalga 7'de açılır - gereksiz duraksamaları engeller)
    if (clearedWave === 3 || clearedWave === 7) {
      if (clearedWave > 1 && lockedCombos.length < 3 && !pendingElement) {
        pendingRewards.unshift('element');
      }
      openMerchant();
      return;
    }

    wave = clearedWave + 1;
    applyWaveUnlocks();
    // Scope 5: Relic / Curse Shrines at milestone waves (4, 7, 10)
    const wantCurse = (wave === 4 || wave === 7 || wave === 10);
    if (wantCurse) pendingRewards.push('curse');
    spawnWave();
    ensureEnemiesSpawned();
    spawnFloatText(player.x, player.y - 24, 'Dalga ' + wave, '#f1c40f');
    playSfx('wave', 0.28);
    if (wantCurse || (pendingRewards && pendingRewards.length)) {
      paused = true;
      flushReward();
      return;
    }
    paused = false;`;

const newBossClearFlow = `      // KESİNTİSİZ AKICI PACING: Nefes ekranı molası kaldırıldı (Risk/Ödül artık arenadaki Mihraplarla organik işliyor)
      wave = clearedWave + 1;
      applyWaveUnlocks();
      spawnWave();
      ensureEnemiesSpawned();
      paused = false;
      return;
    }

    // Tüccar sadece Dalga 5'te (Büyük Ara Dinlenme) açılır, her 2 dalgada bir duraksatmaz
    if (clearedWave === 5) {
      openMerchant();
      return;
    }

    wave = clearedWave + 1;
    applyWaveUnlocks();
    spawnWave();
    ensureEnemiesSpawned();
    spawnFloatText(player.x, player.y - 24, 'Dalga ' + wave, '#f1c40f');
    playSfx('wave', 0.28);
    if (pendingRewards && pendingRewards.length) {
      paused = true;
      flushReward();
      return;
    }
    paused = false;`;

if (html.includes(oldBossClearFlow)) {
  html = html.replace(oldBossClearFlow, newBossClearFlow);
  console.log('1. Streamlined onWaveCleared: removed breathOverlay interruption and unified high-octane flow!');
} else {
  console.error('Warning: oldBossClearFlow not found!');
}

// 2. TACTILE BALANCE: ENSURE MARKSMAN SNIPER BEAM HAS HIGH-CONTRAST LASER & AUDIBLE CHARGE
const oldSniperAimCode = `    if (en.type === 'marksman') {
      en.sniperTimer = (en.sniperTimer || 140) - dt;
      if (en.snipeAimT > 0) {
        // Hedefe kilitlenme: Oyuncuyu hafif gecikmeyle takip eder (dash ile kaçılabilir)
        en.aimX += (player.x - en.aimX) * 0.10;
        en.aimY += (player.y - en.aimY) * 0.10;
        en.snipeAimT -= dt;
        if (en.snipeAimT <= 0) {
          const sang = Math.atan2(en.aimY - en.y, en.aimX - en.x);
          enemyProjectiles.push({
            x: en.x, y: en.y,
            vx: Math.cos(sang) * 7.5, vy: Math.sin(sang) * 7.5,
            r: 5.5, dmg: 7 + Math.round(wave * 0.9),
            ox: en.x, oy: en.y, maxDist: 480,
            color: '#ff1744', glow: '#ff5252', kind: 'sniper_bolt'
          });
          playSfx('shoot', 0.38, 900);
          burst(en.x, en.y, '#ff1744', 6, 2.5);
          en.sniperTimer = 160 + Math.random() * 60;
        }
      } else if (en.sniperTimer <= 0 && dist < 360) {
        en.snipeAimT = 65; // 65 kare (~1s) nişan alma süresi — oyuncu uyarılır ve dash atmaya fırsat bulur
        en.aimX = player.x;
        en.aimY = player.y;
        playSfx('tick', 0.25);
      }
    }`;

const newSniperAimCode = `    if (en.type === 'marksman') {
      en.sniperTimer = (en.sniperTimer || 140) - dt;
      if (en.snipeAimT > 0) {
        // Hedefe kilitlenme: Oyuncuyu takip eden yüksek kontrastlı lazer çizgisi (dash ile kaçılabilir)
        en.aimX += (player.x - en.aimX) * 0.085;
        en.aimY += (player.y - en.aimY) * 0.085;
        en.snipeAimT -= dt;
        if (en.snipeAimT <= 0) {
          const sang = Math.atan2(en.aimY - en.y, en.aimX - en.x);
          enemyProjectiles.push({
            x: en.x, y: en.y,
            vx: Math.cos(sang) * 8.2, vy: Math.sin(sang) * 8.2,
            r: 5.5, dmg: 8 + Math.round(wave * 0.9),
            ox: en.x, oy: en.y, maxDist: 520,
            color: '#ff1744', glow: '#ff5252', kind: 'sniper_bolt'
          });
          playSfx('shoot', 0.42, 950);
          burst(en.x, en.y, '#ff1744', 8, 3.0);
          en.sniperTimer = 150 + Math.random() * 50;
        }
      } else if (en.sniperTimer <= 0 && dist < 380) {
        en.snipeAimT = 60; // 60 kare (tam 1 sn) telegraphed nişan alma
        en.aimX = player.x;
        en.aimY = player.y;
        playSfx('tick', 0.28, 880);
      }
    }`;

if (html.includes(oldSniperAimCode)) {
  html = html.replace(oldSniperAimCode, newSniperAimCode);
  console.log('2. Tuned Marksman sniper telegraph & audio juice!');
} else {
  console.error('Warning: oldSniperAimCode not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Pacing and gameplay polish applied successfully!');
