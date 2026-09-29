const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. REVAMP CLASS_NODES WITH HIGH-IMPACT, BUILD-DEFINING TRAITS
// -------------------------------------------------------------
const oldClassNodes = `const CLASS_NODES = {
  lava: [
    { id: 'lavaT1', name: 'Kor yigin', hint: 'Yakma kalin · kok +%8' },
    { id: 'lavaT2', name: 'Kul topu', hint: 'Ozel atis her 4.' }
  ],
  ocean: [
    { id: 'oceanT1', name: 'Dolu', hint: 'Don esigi 2 stack' },
    { id: 'oceanT2', name: 'Su tabakasi', hint: 'Vurus su lekesi birakir' }
  ],
  thunder: [
    { id: 'thunT1', name: '+1 sicrama', hint: 'Zincir +1 hop' },
    { id: 'thunT2', name: '4 sicrama', hint: 'Zincir hop 4' }
  ],
  sprout: [
    { id: 'sprT1', name: 'Tohum', hint: '1 doga taret' },
    { id: 'sprT2', name: 'Bahce', hint: 'Max 3 taret' }
  ],
  stone: [
    { id: 'stoT1', name: 'Granit Zırh', hint: '+35 Can ve %20 Hasar Azaltımı' },
    { id: 'stoT2', name: 'Deprem', hint: 'Skill alani +16' }
  ],
  shadow: [
    { id: 'shaT1', name: 'Infaz esigi', hint: 'Alcak can bandi %43' },
    { id: 'shaT2', name: 'Goladim', hint: 'Sis CD -4s' }
  ],
  steam: [
    { id: 'stmT1', name: 'Kazan', hint: 'Idle basinc +%25' },
    { id: 'stmT2', name: 'Kritik vana', hint: 'Skill patlamasi genisler' }
  ],
  magnet: [
    { id: 'magT1', name: 'Kutup', hint: 'Auto da kutup basar' },
    { id: 'magT2', name: 'Carpisma', hint: 'Crash hasari +%20' }
  ],
  ash: [
    { id: 'ashT1', name: 'Sis', hint: 'Skill kulekesi buyur' },
    { id: 'ashT2', name: 'Pece', hint: 'Sis CD 12s' }
  ],
  plasma: [
    { id: 'plaT1', name: 'Cizgi', hint: 'Isin kalinlik +2' },
    { id: 'plaT2', name: 'Delme', hint: 'Auto delme +1' }
  ],
  vortex: [
    { id: 'vorT1', name: 'Cekim', hint: 'Pull +1.2' },
    { id: 'vorT2', name: 'Bogma', hint: 'Exec +0.05' }
  ],
  mire: [
    { id: 'mireT1', name: 'Camur', hint: 'Yavas %80' },
    { id: 'mireT2', name: 'Tohum', hint: '1 bataklik taret' }
  ],
  stain: [
    { id: 'stnT1', name: 'Leke yogun', hint: 'Ikincil leke her 4. atis' },
    { id: 'stnT2', name: 'Artik', hint: 'Kok yatirimi +%8' }
  ]
};`;

const newClassNodes = `const CLASS_NODES = {
  lava: [
    { id: 'lavaT1', name: 'Cehennem Kıvılcımı', hint: 'Kalıcı yakma etkisi ve elemental hasar +%40 güçlenir!' },
    { id: 'lavaT2', name: 'Lav Topu İnfilakı', hint: 'Her 3. atışta devasa patlayan lav küresi fırlatır!' }
  ],
  ocean: [
    { id: 'oceanT1', name: 'Mutlak Sıfır', hint: 'Dondurma eşiği 2 yüke düşer, düşmanlar anında donar!' },
    { id: 'oceanT2', name: 'Tsunami Dalgası', hint: 'Her vuruş devasa su dalgası bırakır ve düşmanları ıslatır!' }
  ],
  thunder: [
    { id: 'thunT1', name: 'Zincirleme Yıldırım', hint: 'Yıldırım mermileri fazladan +2 hedefe seker!' },
    { id: 'thunT2', name: 'Kıyamet Fırtınası', hint: 'Yıldırımlar 5 hedefe seker ve hedefleri sersemletir!' }
  ],
  sprout: [
    { id: 'sprT1', name: 'Canlı Filiz Tareti', hint: 'Yanında otomatik zehir dikeni fırlatan Doğa Tareti doğar!' },
    { id: 'sprT2', name: 'Sarmaşık Bahçesi', hint: 'Aynı anda 3 adet otomatik taret savaş alanını korur!' }
  ],
  stone: [
    { id: 'stoT1', name: 'Granit Zırh', hint: '+45 Can artışı ve alınan tüm hasarları %25 azaltır!' },
    { id: 'stoT2', name: 'Tektonik Deprem', hint: 'Yetenek etki alanı +%35 genişler ve şok dalgası yayar!' }
  ],
  shadow: [
    { id: 'shaT1', name: 'Gölge İnfazı', hint: 'Canı %45 altındaki tüm düşmanları anında yok eder!' },
    { id: 'shaT2', name: 'Karanlık Örtü', hint: 'Gölge pelerini bekleme süresi yarıya iner ve sıyrılma sağlar!' }
  ],
  steam: [
    { id: 'stmT1', name: 'Yüksek Basınçlı Kazan', hint: 'Saldırı gücü ve büyü hızı +%40 patlama yaşar!' },
    { id: 'stmT2', name: 'Aşırı Isınmış İnfilak', hint: 'Buhar patlama yarıçapı 2 katına çıkar ve zırh eritir!' }
  ],
  magnet: [
    { id: 'magT1', name: 'Manyetik Kutup', hint: 'Tüm atışlar düşmanları birbirine çeken manyetik kutup yükler!' },
    { id: 'magT2', name: 'Hiper Çarpışma', hint: 'Birbirine çarpan düşmanlar +%50 şok dalgası hasarı alır!' }
  ],
  ash: [
    { id: 'ashT1', name: 'Boğucu Kül Sisi', hint: 'Yetenekler devasa kül bulutu bırakır, içindekiler körleşir!' },
    { id: 'ashT2', name: 'Kül Zırhı', hint: 'Kül bulutu içindeyken %40 hasarsızlık ve hız kazanırsın!' }
  ],
  plasma: [
    { id: 'plaT1', name: 'Plazma Işını', hint: 'Işın genişliği 2 katına çıkar ve arkadaki tüm hedefleri kavurur!' },
    { id: 'plaT2', name: 'Sonsuz Delici', hint: 'Mermiler tüm düşmanları ve engelleri delip geçer!' }
  ],
  vortex: [
    { id: 'vorT1', name: 'Kozmik Girdap', hint: 'Girdap çekim gücü ve etki yarıçapı +%70 genişler!' },
    { id: 'vorT2', name: 'Girdap İnfazı', hint: 'Girdaba çekilen zayıf düşmanlar parçalanarak yok olur!' }
  ],
  mire: [
    { id: 'mireT1', name: 'Zehirli Balçık', hint: 'Düşmanları %80 yavaşlatır ve saniye başı asit hasarı verir!' },
    { id: 'mireT2', name: 'Bataklık Bekçisi', hint: 'Yere devasa asit püskürten Bataklık Tareti diker!' }
  ],
  stain: [
    { id: 'stnT1', name: 'Kaotik Reaksiyon', hint: 'Her 3. atış çift elemental reaksiyon lekesi saçar!' },
    { id: 'stnT2', name: 'Saf Kudret', hint: 'Temel element hasarın kalıcı +%45 devasa güçlenir!' }
  ]
};`;

if (html.includes(oldClassNodes)) {
  html = html.replace(oldClassNodes, newClassNodes);
  changes++;
  console.log('[1] Replaced CLASS_NODES with impactful build traits');
} else {
  console.warn('[1] Warning: oldClassNodes not found');
}

// -------------------------------------------------------------
// 2. TUNE applyClassNode VALUES ACCORDINGLY
// -------------------------------------------------------------
const oldApplyClassNode = `  if (id === 'univArea' || id === 'stoT2') player.mods.skillArea = (player.mods.skillArea || 0) + (id === 'stoT2' ? 28 : 25);
  else if (id === 'univCd') player.mods.skillCd = (player.mods.skillCd || 0) + 20;
  else if (id === 'univHp') { player.maxHp += 40; player.hp += 40; player.mods.regen = (player.mods.regen || 0) + 2; }
  else if (id === 'univMag') f.magnetPx = (f.magnetPx || 0) + 65;
  else if (id === 'coreInvest' || id === 'lavaT1' || id === 'stnT2') runLock.rootNodes = (runLock.rootNodes || 0) + 3;
  else if (id === 'coreTempo') f.atkSpeed = (f.atkSpeed || 0) + 30;
  else if (id === 'coreReach') player.mods.reach = (player.mods.reach || 0) + 60;
  else if (id === 'coreHp') { player.maxHp += 45; player.hp += 45; f.dmgResist = (f.dmgResist || 0) + 0.15; }
  else if (id === 'coreFocus' || id === 'lavaT2') f.specialEvery = 3;
  else if (id === 'oceanT1') f.freezeAt = 2;
  else if (id === 'oceanT2') f.waterSheet = 1;
  else if (id === 'thunT1') f.chainHops = (f.chainHops || 0) + 1;
  else if (id === 'thunT2') f.chainHops = 4;
  else if (id === 'sprT1') spawnClassTurret(player.x + 36, player.y - 8, 'nature');
  else if (id === 'sprT2') { f.turretMax = 3; spawnClassTurret(player.x - 28, player.y + 10, 'nature'); }
  else if (id === 'stoT1') { player.maxHp += 35; player.hp += 35; f.dmgResist = (f.dmgResist || 0) + 0.20; }
  else if (id === 'shaT1') f.execBand = 0.43;
  else if (id === 'shaT2' || id === 'ashT2') f.veilCd = 12000;
  else if (id === 'stmT1') f.steamIdle = 1.25;
  else if (id === 'stmT2') f.steamBurstR = 110;
  else if (id === 'magT1') f.autoPole = 1;
  else if (id === 'magT2') f.crashMul = 1.2;
  else if (id === 'ashT1') f.ashMist = 1;
  else if (id === 'plaT1') f.beamW = 2;
  else if (id === 'plaT2') f.pierce = 1;
  else if (id === 'vorT1') f.pull = 1.2;
  else if (id === 'vorT2') f.exec = 0.05;
  else if (id === 'mireT1') f.mudSlow = 0.80;
  else if (id === 'mireT2') spawnClassTurret(player.x + 24, player.y + 16, 'earth');
  else if (id === 'stnT1') f.stainEvery = 4;`;

const newApplyClassNode = `  if (id === 'univArea' || id === 'stoT2') player.mods.skillArea = (player.mods.skillArea || 0) + (id === 'stoT2' ? 35 : 28);
  else if (id === 'univCd') player.mods.skillCd = (player.mods.skillCd || 0) + 20;
  else if (id === 'univHp') { player.maxHp += 40; player.hp += 40; player.mods.regen = (player.mods.regen || 0) + 2; }
  else if (id === 'univMag') f.magnetPx = (f.magnetPx || 0) + 65;
  else if (id === 'coreInvest' || id === 'lavaT1' || id === 'stnT2') runLock.rootNodes = (runLock.rootNodes || 0) + 4;
  else if (id === 'coreTempo') f.atkSpeed = (f.atkSpeed || 0) + 30;
  else if (id === 'coreReach') player.mods.reach = (player.mods.reach || 0) + 60;
  else if (id === 'coreHp') { player.maxHp += 45; player.hp += 45; f.dmgResist = (f.dmgResist || 0) + 0.15; }
  else if (id === 'coreFocus' || id === 'lavaT2') f.specialEvery = 3;
  else if (id === 'oceanT1') f.freezeAt = 2;
  else if (id === 'oceanT2') f.waterSheet = 1;
  else if (id === 'thunT1') f.chainHops = (f.chainHops || 0) + 2;
  else if (id === 'thunT2') f.chainHops = 5;
  else if (id === 'sprT1') spawnClassTurret(player.x + 36, player.y - 8, 'nature');
  else if (id === 'sprT2') { f.turretMax = 3; spawnClassTurret(player.x - 28, player.y + 10, 'nature'); }
  else if (id === 'stoT1') { player.maxHp += 45; player.hp += 45; f.dmgResist = (f.dmgResist || 0) + 0.25; }
  else if (id === 'shaT1') f.execBand = 0.45;
  else if (id === 'shaT2' || id === 'ashT2') f.veilCd = 8000;
  else if (id === 'stmT1') f.steamIdle = 1.40;
  else if (id === 'stmT2') f.steamBurstR = 140;
  else if (id === 'magT1') f.autoPole = 1;
  else if (id === 'magT2') f.crashMul = 1.5;
  else if (id === 'ashT1') f.ashMist = 1;
  else if (id === 'plaT1') f.beamW = 3;
  else if (id === 'plaT2') f.pierce = 2;
  else if (id === 'vorT1') f.pull = 1.7;
  else if (id === 'vorT2') f.exec = 0.08;
  else if (id === 'mireT1') f.mudSlow = 0.80;
  else if (id === 'mireT2') spawnClassTurret(player.x + 24, player.y + 16, 'earth');
  else if (id === 'stnT1') f.stainEvery = 3;`;

if (html.includes(oldApplyClassNode)) {
  html = html.replace(oldApplyClassNode, newApplyClassNode);
  changes++;
  console.log('[2] Updated applyClassNode stats');
} else {
  console.warn('[2] Warning: oldApplyClassNode not found');
}

// -------------------------------------------------------------
// 3. ZERO-FREEZE ON WAVE CLEAR (FLUID GEM COLLECTION)
// -------------------------------------------------------------
const oldWaveEndCheck = `  if (running && enemies.length === 0 && !overlayBusy() && !menuOpen && breathLeft <= 0) {
    if (!hasBossLoot) {
      if (!paused) paused = true;
      if (!waveTimer) scheduleWaveClear(360);
    } else {
      drops.forEach(d => {
        if (d.isBossChest) {
          d._autoTimer = (d._autoTimer || 180) - dt;
          if (d._autoTimer <= 0) {
            d.forceMagnet = true;
          }
        }
      });
      if (drops.some(d => d.isBossChest && d._autoTimer <= -120)) {
        if (!paused) paused = true;
        if (!waveTimer) scheduleWaveClear(200);
      }
    }
  }`;

const newWaveEndCheck = `  if (running && enemies.length === 0 && !overlayBusy() && !menuOpen && breathLeft <= 0) {
    if (!hasBossLoot) {
      // Kesintisiz akış: Oyun donmaz, kristal ve XP akmaya devam eder, 180ms sonra yeni dalga devreye girer
      if (!waveTimer) scheduleWaveClear(180);
    } else {
      drops.forEach(d => {
        if (d.isBossChest) {
          d._autoTimer = (d._autoTimer || 180) - dt;
          if (d._autoTimer <= 0) {
            d.forceMagnet = true;
          }
        }
      });
      if (drops.some(d => d.isBossChest && d._autoTimer <= -120)) {
        if (!waveTimer) scheduleWaveClear(120);
      }
    }
  }`;

if (html.includes(oldWaveEndCheck)) {
  html = html.replace(oldWaveEndCheck, newWaveEndCheck);
  changes++;
  console.log('[3] Removed premature freeze on normal wave clears');
} else {
  console.warn('[3] Warning: oldWaveEndCheck not found');
}

// -------------------------------------------------------------
// 4. FIX DOUBLE EXECUTION BUG IN onWaveCleared ON BOSS VICTORY
// -------------------------------------------------------------
const oldBossClearedFlow = `    if (isBossCleared) {
      paused = true;
      resetJoystick();
      spawnFloatText(player.x, player.y - 36, 'Zafer! Boss Mağlup 👑', '#ffd740');
      playSfx('wave', 0.32);

      // Boss Zafer Ödülü: Eğer bekleyen element henüz seçilmediyse ödül kuyruğuna ekle
      if (pendingElement && lockedCombos.length < 3) {
        pendingRewards.unshift('element');
      }

      // Boss zaferinden sonra bekleyen ödül varsa önce ödülü aç
      if (pendingRewards && pendingRewards.length) {
        flushReward();
        return;
      }

      // KESİNTİSİZ AKICI PACING: Nefes ekranı molası kaldırıldı (Risk/Ödül artık arenadaki Mihraplarla organik işliyor)
      wave = clearedWave + 1;
      applyWaveUnlocks();
      spawnWave();
      ensureEnemiesSpawned();
      paused = false;
      return;
    }`;

const newBossClearedFlow = `    if (isBossCleared) {
      resetJoystick();
      spawnFloatText(player.x, player.y - 36, 'Zafer! Boss Mağlup 👑', '#ffd740');
      playSfx('wave', 0.32);

      // Boss Zafer Ödülü: Eğer bekleyen element henüz seçilmediyse ödül kuyruğuna ekle
      if (pendingElement && lockedCombos.length < 3) {
        pendingRewards.unshift('element');
      }

      // KESİNTİSİZ AKICI PACING: Yeni dalga anında hazırlanır ve düşmanlar oluşturulur
      wave = clearedWave + 1;
      applyWaveUnlocks();
      spawnWave();
      ensureEnemiesSpawned();

      // Boss zaferinden sonra bekleyen ödül varsa önce ödül seçim ekranını aç
      // Kart seçildiği anda closeReward() doğrudan oyuna döner (çift onWaveCleared tetiklenmez!)
      if (pendingRewards && pendingRewards.length) {
        paused = true;
        flushReward();
        return;
      }

      paused = false;
      return;
    }`;

if (html.includes(oldBossClearedFlow)) {
  html = html.replace(oldBossClearedFlow, newBossClearedFlow);
  changes++;
  console.log('[4] Fixed double onWaveCleared bug on boss clear');
} else {
  console.warn('[4] Warning: oldBossClearedFlow not found');
}

// -------------------------------------------------------------
// 5. INSTANT RESUME IN closeReward() AND FASTER scheduleWaveClear
// -------------------------------------------------------------
const oldCloseReward = `  paused = false;
  syncRerollFab();
  if (running && enemies && enemies.length === 0 && !overlayBusy()) {
    paused = true;
    scheduleWaveClear(240);
  }`;

const newCloseReward = `  paused = false;
  syncRerollFab();
  if (running && enemies && enemies.length === 0 && !overlayBusy()) {
    scheduleWaveClear(60);
  }`;

if (html.includes(oldCloseReward)) {
  html = html.replace(oldCloseReward, newCloseReward);
  changes++;
  console.log('[5] Instant resume in closeReward()');
} else {
  console.warn('[5] Warning: oldCloseReward not found');
}

const oldScheduleDef = `function scheduleWaveClear(ms) {
  if (waveTimer) clearTimeout(waveTimer);
  waveTimer = setTimeout(() => { try { onWaveCleared(); } catch (e) { console.error(e); } }, ms == null ? 320 : ms);
}`;

const newScheduleDef = `function scheduleWaveClear(ms) {
  if (waveTimer) clearTimeout(waveTimer);
  waveTimer = setTimeout(() => { try { onWaveCleared(); } catch (e) { console.error(e); } }, ms == null ? 180 : ms);
}`;

if (html.includes(oldScheduleDef)) {
  html = html.replace(oldScheduleDef, newScheduleDef);
  changes++;
  console.log('[6] Snappy default delay in scheduleWaveClear');
} else {
  console.warn('[6] Warning: oldScheduleDef not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 1 patch script. Total successful patches: ${changes}/6`);
