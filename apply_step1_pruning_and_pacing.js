const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. REVAMP UNIV_NODES & CORE_NODES (ELIMINATE WEAK STAT CARDS)
// -------------------------------------------------------------
const oldUnivNodes = `const UNIV_NODES = [
  { id: 'univArea', name: 'Genişletilmiş Alan', hint: 'Yetenek etki alanı devasa +%20 artar!' },
  { id: 'univCd', name: 'Seri Hazırlık', hint: 'Yetenek bekleme süresi -%16 hızlanır!' },
  { id: 'univHp', name: 'Titanyum Gövde', hint: 'Maksimum Can +24 artar ve anında dolar!' },
  { id: 'univMag', name: 'Manyetik Çekim', hint: 'Kristal ve XP toplama yarıçapı +35px genişler!' }
];
const CORE_NODES = [
  { id: 'coreInvest', name: 'Elemental Kudret', hint: 'Temel element hasarın kalıcı +%25 güçlenir!' },
  { id: 'coreTempo', name: 'Hızlı Tetik', hint: 'Tüm otomatik atışların hızı +%20 hızlanır!' },
  { id: 'coreReach', name: 'Keskin Menzil', hint: 'Atış menzili +40px uzağa erişir!' },
  { id: 'coreHp', name: 'Kaya Dayanıklılığı', hint: 'Maksimum Can +30 artar ve yenilenir!' },
  { id: 'coreFocus', name: 'Özel Vuruş Odağı', hint: 'Her 3. atışta bir güçlü özel atış patlatır!' }
];`;

const newUnivNodes = `const UNIV_NODES = [
  { id: 'univArea', name: 'Genişletilmiş Alan', hint: 'Yetenek etki alanı devasa +%28 artar!' },
  { id: 'univCd', name: 'Seri Hazırlık', hint: 'Büyü bekleme süreleri -%20 hızlanır!' },
  { id: 'univHp', name: 'Kutsal Yenilenme', hint: 'Maksimum Can +40 artar ve her saniye +2 Can yenilenir!' },
  { id: 'univMag', name: 'Vorteks Mıknatısı', hint: 'Kristal ve XP çekim yarıçapı +65px genişler!' }
];
const CORE_NODES = [
  { id: 'coreInvest', name: 'Elemental Kudret', hint: 'Temel element hasarın kalıcı +%30 güçlenir!' },
  { id: 'coreTempo', name: 'Hiper Tetik', hint: 'Tüm atışların hızı +%30 hızlanır!' },
  { id: 'coreReach', name: 'Avcı Gözü', hint: 'Atış menzili +60px uzar ve uzaktakilere +%50 hasar vurur!' },
  { id: 'coreHp', name: 'Granit Ruh', hint: 'Maksimum Can +45 artar ve alınan hasarı %15 azaltır!' },
  { id: 'coreFocus', name: 'Özel Vuruş Odağı', hint: 'Her 3. atışta bir devasa şok dalgası patlatır!' }
];`;

if (html.includes(oldUnivNodes)) {
  html = html.replace(oldUnivNodes, newUnivNodes);
  changes++;
  console.log('[1] Revamped UNIV_NODES and CORE_NODES with high-impact traits');
} else {
  console.warn('[1] Warning: oldUnivNodes not found');
}

// Update stoT1 in CLASS_NODES to remove speed penalty
const oldStoT1 = `{ id: 'stoT1', name: 'Kaya et', hint: '+18 can · -%6 hiz' },`;
const newStoT1 = `{ id: 'stoT1', name: 'Granit Zırh', hint: '+35 Can ve %20 Hasar Azaltımı' },`;

if (html.includes(oldStoT1)) {
  html = html.replace(oldStoT1, newStoT1);
  changes++;
  console.log('[2] Removed negative speed debuff from stoT1');
} else {
  console.warn('[2] Warning: oldStoT1 not found');
}

// -------------------------------------------------------------
// 2. UPDATE applyClassNode EFFECTS FOR REVAMPED NODES
// -------------------------------------------------------------
const oldApplyNodesBlock = `  if (id === 'univArea' || id === 'stoT2') player.mods.skillArea = (player.mods.skillArea || 0) + (id === 'stoT2' ? 24 : 20);
  else if (id === 'univCd') player.mods.skillCd = (player.mods.skillCd || 0) + 16;
  else if (id === 'univHp') { player.maxHp += 24; player.hp += 24; }
  else if (id === 'univMag') f.magnetPx = (f.magnetPx || 0) + 35;
  else if (id === 'coreInvest' || id === 'lavaT1' || id === 'stnT2') runLock.rootNodes = (runLock.rootNodes || 0) + 2;
  else if (id === 'coreTempo') f.atkSpeed = (f.atkSpeed || 0) + 20;
  else if (id === 'coreReach') player.mods.reach = (player.mods.reach || 0) + 40;
  else if (id === 'coreHp') { player.maxHp += 30; player.hp += 30; }
  else if (id === 'coreFocus' || id === 'lavaT2') f.specialEvery = 3;
  else if (id === 'oceanT1') f.freezeAt = 2;
  else if (id === 'oceanT2') f.waterSheet = 1;
  else if (id === 'thunT1') f.chainHops = (f.chainHops || 0) + 1;
  else if (id === 'thunT2') f.chainHops = 4;
  else if (id === 'sprT1') spawnClassTurret(player.x + 36, player.y - 8, 'nature');
  else if (id === 'sprT2') { f.turretMax = 3; spawnClassTurret(player.x - 28, player.y + 10, 'nature'); }
  else if (id === 'stoT1') { player.maxHp += 18; player.hp += 18; player.speed *= 0.94; }`;

const newApplyNodesBlock = `  if (id === 'univArea' || id === 'stoT2') player.mods.skillArea = (player.mods.skillArea || 0) + (id === 'stoT2' ? 28 : 25);
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
  else if (id === 'stoT1') { player.maxHp += 35; player.hp += 35; f.dmgResist = (f.dmgResist || 0) + 0.20; }`;

if (html.includes(oldApplyNodesBlock)) {
  html = html.replace(oldApplyNodesBlock, newApplyNodesBlock);
  changes++;
  console.log('[3] Updated applyClassNode logic with buffs');
} else {
  console.warn('[3] Warning: oldApplyNodesBlock not found');
}

// -------------------------------------------------------------
// 3. PASSIVE LEVEL-UP STAT SCALING IN gainXp
// -------------------------------------------------------------
const oldLevelUpStatTarget = `    player.xp -= player.xpNeed;
    player.level++;
    player.xpNeed = xpToNext(player.level);`;

const newLevelUpStatTarget = `    player.xp -= player.xpNeed;
    player.level++;
    player.xpNeed = xpToNext(player.level);

    // STEP 1: Organic Passive Stat Scaling (+5 Max HP, +0.8% Speed every level)
    // Eliminates the need for filler stat cards in upgrade pools
    player.maxHp = Math.round(player.maxHp + 5);
    player.hp = Math.min(player.maxHp, player.hp + 5);
    player.speed = player.speed * 1.008;`;

if (html.includes(oldLevelUpStatTarget)) {
  html = html.replace(oldLevelUpStatTarget, newLevelUpStatTarget);
  changes++;
  console.log('[4] Added Organic Passive Stat Scaling to gainXp');
} else {
  console.warn('[4] Warning: oldLevelUpStatTarget not found');
}

// -------------------------------------------------------------
// 4. STREAMLINED WAVE CLEAR PACING (SMOOTH FLOW STATE)
// -------------------------------------------------------------
// Reduce merchant frequency to milestone preparation waves (waves 3, 7) instead of every odd wave
const oldMerchantCondition = `    // Pre-boss merchant (her boss öncesi hazırlık dalgası sonunda tüccar açılır)
    if (clearedWave % 2 === 1) {`;

const newMerchantCondition = `    // Pre-boss merchant (Dalga 3 ve Dalga 7'de açılır - gereksiz duraksamaları engeller)
    if (clearedWave === 3 || clearedWave === 7) {`;

if (html.includes(oldMerchantCondition)) {
  html = html.replace(oldMerchantCondition, newMerchantCondition);
  changes++;
  console.log('[5] Tuned Merchant appearance to milestone waves (3 & 7)');
} else {
  console.warn('[5] Warning: oldMerchantCondition not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 1 apply script. Total successful patches: ${changes}/5`);
