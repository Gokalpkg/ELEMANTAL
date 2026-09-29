const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. INJECT STEP 8 CSS STYLES
const oldTreeStyles = `.tree-list { width:100%; max-width:340px; display:flex; flex-direction:column; gap:8px; }`;

const newTreeStyles = `.tree-list { width:100%; max-width:360px; display:flex; flex-direction:column; gap:8px; max-height:48vh; overflow-y:auto; padding-right:4px; }
/* STEP 8: KADİM CEZA PAKTI (HEAT / PACT OF PUNISHMENT) STYLES */
.sunak-tabs {
  width: 100%;
  max-width: 360px;
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.sunak-tab {
  flex: 1;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 800;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.75);
  border: 1.5px solid rgba(168, 85, 247, 0.4);
  color: #cbd5e1;
  transition: all 0.2s ease;
  text-align: center;
}
.sunak-tab.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.35), rgba(239, 68, 68, 0.25));
  border-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.4);
}
.heat-panel {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 48vh;
  overflow-y: auto;
  padding-right: 4px;
}
.heat-summary-card {
  background: linear-gradient(135deg, rgba(40, 10, 15, 0.88), rgba(15, 23, 42, 0.95));
  border: 1.5px solid #ef4444;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}
.heat-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.heat-level-badge {
  font-size: 13px;
  font-weight: 900;
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}
.heat-bonus-val {
  font-size: 12px;
  font-weight: 800;
  color: #ffd700;
}
.heat-title-badge {
  font-size: 11px;
  color: #cbd5e1;
  font-style: italic;
}
.heat-quick-btns {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.heat-quick-btn {
  flex: 1;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #e2e8f0;
  cursor: pointer;
}
.heat-node {
  background: rgba(15, 23, 42, 0.88);
  border: 1.5px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
}
.heat-node.active {
  background: linear-gradient(135deg, rgba(69, 10, 10, 0.5), rgba(30, 27, 75, 0.6));
  border-color: #ef4444;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
}
.heat-node-info {
  flex: 1;
  min-width: 0;
  text-align: left;
}
.heat-node-title {
  font-size: 12px;
  font-weight: 800;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 6px;
}
.heat-node-desc {
  font-size: 10.5px;
  color: #94a3b8;
  margin-top: 2px;
}
.heat-toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #334155;
  position: relative;
  transition: background 0.2s ease;
  flex: 0 0 44px;
  margin-left: 10px;
}
.heat-node.active .heat-toggle-switch {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
}
.heat-toggle-knob {
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #ffffff;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
}
.heat-node.active .heat-toggle-knob {
  transform: translateX(20px);
}`;

if (html.includes(oldTreeStyles)) {
  html = html.replace(oldTreeStyles, newTreeStyles);
  console.log('1. Injected Step 8 Heat Pact styles!');
} else {
  console.error('Warning: oldTreeStyles not found!');
}

// 2. INJECT SUNAK TABS & HEAT PANEL INTO TREEOVERLAY HTML
const oldTreeOverlayHtml = `      <div class="asra-crystal-bar">
        <span class="asra-crystal-label">Mevcut Kristal:</span>
        <span id="treeCrystalLabel" class="asra-crystal-val">0 kristal</span>
      </div>

      <div class="tree-list" id="treeList"></div>`;

const newTreeOverlayHtml = `      <div class="asra-crystal-bar">
        <span class="asra-crystal-label">Mevcut Kristal:</span>
        <span id="treeCrystalLabel" class="asra-crystal-val">0 kristal</span>
      </div>

      <!-- STEP 8: SUNAK TABS (YETENEK AĞACI VS KADİM CEZA PAKTI) -->
      <div class="sunak-tabs">
        <button type="button" class="sunak-tab active" id="tabSunakTree">🔮 Güç Sunakları</button>
        <button type="button" class="sunak-tab" id="tabSunakHeat">⚖️ Ceza Paktı (Isı: <span id="sunakHeatBadge">0</span>)</button>
      </div>

      <div class="tree-list" id="treeList"></div>
      <div class="heat-panel" id="heatPanel" style="display:none;"></div>`;

if (html.includes(oldTreeOverlayHtml)) {
  html = html.replace(oldTreeOverlayHtml, newTreeOverlayHtml);
  console.log('2. Injected sunak tabs and heatPanel HTML into treeOverlay!');
} else {
  console.error('Warning: oldTreeOverlayHtml not found!');
}

// 3. DEFINE HEAT PACTS DATA & MANAGEMENT FUNCTIONS IN JS
const heatEngineCode = `// --- STEP 8: KADİM LANETLER / ISI (HEAT) PAKTI (PACT OF PUNISHMENT) ---
const HEAT_PACTS = [
  {
    id: 'bloodSpeed',
    name: '🩸 Kanlı Sürat',
    en_name: '🩸 Blood Velocity',
    heat: 1,
    desc: 'Tüm düşmanlar ve bosslar +%22 daha hızlı hareket eder.',
    en_desc: 'All enemies and bosses move +22% faster.'
  },
  {
    id: 'veilOfShadows',
    name: '🌫️ Kör Dövüş',
    en_name: '🌫️ Veil of Shadows',
    heat: 1,
    desc: 'Görüş alanı daralır, arena karanlık bir sis alanı ile kuşatılır.',
    en_desc: 'Vision range shrinks; dark fog envelops the arena.'
  },
  {
    id: 'titanOverload',
    name: '👑 Elit Hükümdarlar',
    en_name: '👑 Titan Overload',
    heat: 1,
    desc: 'Bosslar ve Elitler +%35 daha fazla cana sahip olur; 2. Faz %60 canda tetiklenir.',
    en_desc: 'Bosses & Elites have +35% more HP; Phase 2 triggers at 60% HP.'
  },
  {
    id: 'glassFate',
    name: '💀 Kırılgan Beden',
    en_name: '💀 Glass Fate',
    heat: 1,
    desc: 'Kahramanın maksimum canı %25 azalır, ancak kritik hasarı +%30 artar.',
    en_desc: 'Hero max HP reduced by 25%, but critical damage increased by +30%.'
  },
  {
    id: 'swarmCalamity',
    name: '🌪️ Felaket Sürüsü',
    en_name: '🌪️ Swarm Calamity',
    heat: 1,
    desc: 'Dalgalarda +%30 daha fazla canavar ürer ve sürü daha agresifleşir.',
    en_desc: 'Waves spawn +30% more monsters with increased aggression.'
  },
  {
    id: 'volatileEarth',
    name: '⚡ Aşırı Yüklü Zemin',
    en_name: '⚡ Volatile Earth',
    heat: 1,
    desc: 'Düşmanlar öldüğünde %25 ihtimalle yerde patlayan küçük lav/şok tuzağı bırakır.',
    en_desc: 'Enemies have 25% chance to leave an exploding hazard trap on death.'
  }
];

function loadHeatPacts() {
  try {
    const raw = localStorage.getItem('elementer_heat_pacts');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveHeatPacts(pacts) {
  try {
    localStorage.setItem('elementer_heat_pacts', JSON.stringify(pacts || {}));
  } catch (e) {}
}

function isPactActive(pactId) {
  const p = loadHeatPacts();
  return !!p[pactId];
}

function getActiveHeat() {
  const p = loadHeatPacts();
  let heat = 0;
  HEAT_PACTS.forEach(hp => {
    if (p[hp.id]) heat += (hp.heat || 1);
  });
  return heat;
}

function getHeatTitle(heat) {
  const isEn = (typeof getGameLang === 'function' && getGameLang() === 'en');
  if (heat <= 0) return isEn ? 'Novice Warrior (Normal)' : 'Çırak Savaşçı (Standart)';
  if (heat <= 2) return isEn ? 'Veteran Rebel (Heat I)' : 'Kıdemli İsyankar (Isı I)';
  if (heat <= 4) return isEn ? 'Ancient Tormentor (Heat II)' : 'Kadim İşkenceci (Isı II)';
  return isEn ? 'Lord of Elemental Ruin (Heat MAX)' : 'Element Kıyametinin Efendisi (Isı MAX)';
}

function updateHeatBadges() {
  const heat = getActiveHeat();
  const badge = document.getElementById('sunakHeatBadge');
  if (badge) badge.textContent = String(heat);
}

function switchSunakTab(tab) {
  const treeList = document.getElementById('treeList');
  const heatPanel = document.getElementById('heatPanel');
  const tabTree = document.getElementById('tabSunakTree');
  const tabHeat = document.getElementById('tabSunakHeat');
  if (tab === 'heat') {
    if (treeList) treeList.style.display = 'none';
    if (heatPanel) heatPanel.style.display = 'flex';
    if (tabTree) tabTree.classList.remove('active');
    if (tabHeat) tabHeat.classList.add('active');
    fillHeatPanel();
  } else {
    if (treeList) treeList.style.display = 'flex';
    if (heatPanel) heatPanel.style.display = 'none';
    if (tabTree) tabTree.classList.add('active');
    if (tabHeat) tabHeat.classList.remove('active');
    fillTreePanel();
  }
}

function fillHeatPanel() {
  const panel = document.getElementById('heatPanel');
  if (!panel) return;
  updateHeatBadges();
  const isEn = (typeof getGameLang === 'function' && getGameLang() === 'en');
  const pacts = loadHeatPacts();
  const heat = getActiveHeat();
  const bonusPct = Math.round(heat * 35);
  const title = getHeatTitle(heat);

  panel.innerHTML = '';

  // Summary Card
  const sumCard = document.createElement('div');
  sumCard.className = 'heat-summary-card';
  sumCard.innerHTML = \`
    <div class="heat-summary-header">
      <div class="heat-level-badge">🔥 \${isEn ? 'HEAT LEVEL' : 'ISI SEVİYESİ'}: \${heat}</div>
      <div class="heat-bonus-val">💎 +\${bonusPct}% \${isEn ? 'Crystals & XP' : 'Kristal & XP'}</div>
    </div>
    <div class="heat-title-badge">👑 \${isEn ? 'Title' : 'Unvan'}: \${title}</div>
    <div class="heat-quick-btns">
      <button type="button" class="heat-quick-btn" id="heatClearAllBtn">\${isEn ? 'Disable All' : 'Tümünü Kapat'}</button>
      <button type="button" class="heat-quick-btn" id="heatMaxAllBtn" style="color:#ef4444; border-color:#ef4444;">\${isEn ? 'MAX HEAT' : 'MAKSİMUM ISI'}</button>
    </div>
  \`;
  panel.appendChild(sumCard);

  // Quick button events
  const clearBtn = sumCard.querySelector('#heatClearAllBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      saveHeatPacts({});
      playSfx('pick', 0.3);
      fillHeatPanel();
    });
  }
  const maxBtn = sumCard.querySelector('#heatMaxAllBtn');
  if (maxBtn) {
    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const allPacts = {};
      HEAT_PACTS.forEach(hp => { allPacts[hp.id] = true; });
      saveHeatPacts(allPacts);
      playSfx('explode', 0.4, 280);
      triggerScreenFlash('#ef4444', 0.25, 120);
      vibrate([40, 60]);
      fillHeatPanel();
    });
  }

  // Pact Toggle Cards
  HEAT_PACTS.forEach(hp => {
    const active = !!pacts[hp.id];
    const name = isEn ? (hp.en_name || hp.name) : hp.name;
    const desc = isEn ? (hp.en_desc || hp.desc) : hp.desc;

    const card = document.createElement('div');
    card.className = 'heat-node' + (active ? ' active' : '');
    card.innerHTML = \`
      <div class="heat-node-info">
        <div class="heat-node-title">\${name} <span style="font-size:10.5px; color:#ffd700;">(+1 Isı · +%35 💎)</span></div>
        <div class="heat-node-desc">\${desc}</div>
      </div>
      <div class="heat-toggle-switch">
        <div class="heat-toggle-knob"></div>
      </div>
    \`;

    card.addEventListener('click', () => {
      const cur = loadHeatPacts();
      cur[hp.id] = !cur[hp.id];
      saveHeatPacts(cur);
      if (cur[hp.id]) {
        playSfx('skill', 0.35, 320);
        vibrate(25);
      } else {
        playSfx('pick', 0.25);
      }
      fillHeatPanel();
    });

    panel.appendChild(card);
  });
}
`;

const oldOpenTreeFunc = `function openTree(origin) {`;
if (html.includes(oldOpenTreeFunc)) {
  html = html.replace(oldOpenTreeFunc, heatEngineCode + '\n' + oldOpenTreeFunc);
  console.log('3. Injected Heat Pacts logic into JS!');
} else {
  console.error('Warning: oldOpenTreeFunc not found!');
}

// 4. ATTACH TAB LISTENERS AND SYNC BADGES IN OPENTREE / CLOSE TREE
const oldFillTreePanelEnd = `  META_TREE.forEach(node => {`;
const newFillTreePanelEnd = `  updateHeatBadges();
  META_TREE.forEach(node => {`;

if (html.includes(oldFillTreePanelEnd)) {
  html = html.replace(oldFillTreePanelEnd, newFillTreePanelEnd);
  console.log('4. Synced heat badges in fillTreePanel!');
} else {
  console.error('Warning: oldFillTreePanelEnd not found!');
}

// 5. ATTACH TAB CLICK LISTENERS IN INIT
const oldInitEventSection = `const dashFab = document.getElementById('dashFab');`;
const newInitEventSection = `// Tab listeners for Kadim Sunak
const tabTreeBtn = document.getElementById('tabSunakTree');
if (tabTreeBtn) tabTreeBtn.addEventListener('click', () => switchSunakTab('tree'));
const tabHeatBtn = document.getElementById('tabSunakHeat');
if (tabHeatBtn) tabHeatBtn.addEventListener('click', () => switchSunakTab('heat'));

const dashFab = document.getElementById('dashFab');`;

if (html.includes(oldInitEventSection)) {
  html = html.replace(oldInitEventSection, newInitEventSection);
  console.log('5. Attached sunak tab click listeners in init!');
} else {
  console.error('Warning: oldInitEventSection not found!');
}

// 6. APPLY HEAT MULTIPLIER TO GAINCRYSTALS
const oldGainCrystals = `function gainCrystals(n, x, y) {
  let amt = Math.max(1, n | 0);
  if (Math.random() * 100 < treeLv('gold') * 2) amt *= 2;
  const m = loadMeta();
  m.crystals = (m.crystals || 0) + amt;
  saveMeta(m);
  runCrystals = (runCrystals || 0) + amt;
  if (x != null) spawnFloatText(x, y, '+' + amt + ' 💎', '#c9a0ff');
  fillCrystalHud();
}`;

const newGainCrystals = `function gainCrystals(n, x, y) {
  let amt = Math.max(1, n | 0);
  if (Math.random() * 100 < treeLv('gold') * 2) amt *= 2;
  const heat = (typeof getActiveHeat === 'function') ? getActiveHeat() : 0;
  if (heat > 0) {
    const heatMul = 1 + (heat * 0.35);
    amt = Math.round(amt * heatMul);
  }
  const m = loadMeta();
  m.crystals = (m.crystals || 0) + amt;
  saveMeta(m);
  runCrystals = (runCrystals || 0) + amt;
  if (x != null) {
    if (heat > 0) {
      spawnFloatText(x, y, '+' + amt + ' 💎 (🔥 Isı ' + heat + ')', '#ffd700');
    } else {
      spawnFloatText(x, y, '+' + amt + ' 💎', '#c9a0ff');
    }
  }
  fillCrystalHud();
}`;

if (html.includes(oldGainCrystals)) {
  html = html.replace(oldGainCrystals, newGainCrystals);
  console.log('6. Applied Heat pact crystal multiplier (+35% per Heat)!');
} else {
  console.error('Warning: oldGainCrystals not found!');
}

// 7. HOOK HEAT PACTS INTO GAMEPLAY (EMPTYSTATE, SPAWNWAVE, MOB SPEED, VEIL OF SHADOWS)
// A. Glass Fate in emptyState
const oldEmptyStateGlass = `  player.curseDmg = 1; player.curseTaken = 1; player.cursed = null;`;
const newEmptyStateGlass = `  player.curseDmg = 1; player.curseTaken = 1; player.cursed = null;
  if (typeof isPactActive === 'function' && isPactActive('glassFate')) {
    player.hp = Math.round(player.hp * 0.75);
    player.maxHp = player.hp;
  }`;

if (html.includes(oldEmptyStateGlass)) {
  html = html.replace(oldEmptyStateGlass, newEmptyStateGlass);
  console.log('7A. Hooked glassFate in emptyState!');
} else {
  console.error('Warning: oldEmptyStateGlass not found!');
}

// B. Swarm Calamity & Titan Overload in spawnWave
const oldSpawnWaveCounts = `  const count = isBossWave
    ? (wave <= 4 ? 6 : 8)
    : (wave === 1 ? 16 : wave <= 3 ? 15 : wave <= 6 ? 16 : Math.min(18 + Math.floor((wave-6)*0.75), 26));`;

const newSpawnWaveCounts = `  let baseCount = isBossWave
    ? (wave <= 4 ? 6 : 8)
    : (wave === 1 ? 16 : wave <= 3 ? 15 : wave <= 6 ? 16 : Math.min(18 + Math.floor((wave-6)*0.75), 26));
  if (typeof isPactActive === 'function' && isPactActive('swarmCalamity')) {
    baseCount = Math.round(baseCount * 1.30);
  }
  const count = baseCount;`;

if (html.includes(oldSpawnWaveCounts)) {
  html = html.replace(oldSpawnWaveCounts, newSpawnWaveCounts);
  console.log('7B. Hooked swarmCalamity mob count in spawnWave!');
} else {
  console.error('Warning: oldSpawnWaveCounts not found!');
}

// C. Boss HP and Speed in spawnWave
const oldSpawnBossHp = `    const bossBaseHp = 190 + wave * 45;`;
const newSpawnBossHp = `    const isOverload = (typeof isPactActive === 'function' && isPactActive('titanOverload'));
    const isFastPact = (typeof isPactActive === 'function' && isPactActive('bloodSpeed'));
    const bossBaseHp = Math.round((190 + wave * 45) * (isOverload ? 1.35 : 1.0));`;

if (html.includes(oldSpawnBossHp)) {
  html = html.replace(oldSpawnBossHp, newSpawnBossHp);
  console.log('7C. Hooked titanOverload boss HP in spawnWave!');
} else {
  console.error('Warning: oldSpawnBossHp not found!');
}

const oldSpawnBossSpeed = `      speed: 1.55 + wave * 0.018, shootTimer: 48, raged:false, ring:0,`;
const newSpawnBossSpeed = `      speed: (1.55 + wave * 0.018) * (isFastPact ? 1.22 : 1.0), shootTimer: 48, raged:false, ring:0,`;

if (html.includes(oldSpawnBossSpeed)) {
  html = html.replace(oldSpawnBossSpeed, newSpawnBossSpeed);
  console.log('7D. Hooked bloodSpeed boss speed in spawnWave!');
} else {
  console.error('Warning: oldSpawnBossSpeed not found!');
}

// D. Mob movement speed in update loop
const oldMobSpdDef = `    const spd = en.speed * (slowed ? en.slowFactor : 1) * timeSlow;`;
const newMobSpdDef = `    const heatSpeedMul = (typeof isPactActive === 'function' && isPactActive('bloodSpeed')) ? 1.22 : 1.0;
    const spd = en.speed * (slowed ? en.slowFactor : 1) * timeSlow * heatSpeedMul;`;

if (html.includes(oldMobSpdDef)) {
  html = html.replace(oldMobSpdDef, newMobSpdDef);
  console.log('7E. Hooked bloodSpeed mob speed in update loop!');
} else {
  console.error('Warning: oldMobSpdDef not found!');
}

// E. Volatile Earth death traps in killEnemy
const oldKillEnemySplat = `  splatFloor(en.x, en.y, en.r * (isBoss ? 1.4 : 1.1));`;
const newKillEnemySplat = `  splatFloor(en.x, en.y, en.r * (isBoss ? 1.4 : 1.1));
  if (typeof isPactActive === 'function' && isPactActive('volatileEarth') && Math.random() < 0.25) {
    hazards.push({
      x: en.x, y: en.y, r: 24,
      type: 'lava',
      until: performance.now() + 3200
    });
    burst(en.x, en.y, '#ff3d00', 8, 2.2);
  }`;

if (html.includes(oldKillEnemySplat)) {
  html = html.replace(oldKillEnemySplat, newKillEnemySplat);
  console.log('7F. Hooked volatileEarth death traps in killEnemy!');
} else {
  console.error('Warning: oldKillEnemySplat not found!');
}

// F. Veil of Shadows in drawParallaxAtmosphere
const oldDrawParallaxEnd = `  // STEP 7: PHASE 2 CATACLYSMIC RAGE VIGNETTE (Atmospheric red/elemental aura)`;
const newDrawParallaxEnd = `  // STEP 8: VEIL OF SHADOWS (KÖR DÖVÜŞ) HEAT PACT DARK SHADOW VIGNETTE
  if (typeof isPactActive === 'function' && isPactActive('veilOfShadows')) {
    const shadowVig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.16, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.55);
    shadowVig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowVig.addColorStop(0.5, 'rgba(5, 5, 12, 0.45)');
    shadowVig.addColorStop(1, 'rgba(2, 2, 8, 0.94)');
    ctx.fillStyle = shadowVig;
    ctx.fillRect(cam.x - 40, cam.y - 40, W + 80, H + 80);
  }

  // STEP 7: PHASE 2 CATACLYSMIC RAGE VIGNETTE (Atmospheric red/elemental aura)`;

if (html.includes(oldDrawParallaxEnd)) {
  html = html.replace(oldDrawParallaxEnd, newDrawParallaxEnd);
  console.log('7G. Hooked veilOfShadows dark vignette in drawParallaxAtmosphere!');
} else {
  console.error('Warning: oldDrawParallaxEnd not found!');
}

// G. Display Heat in waveLabel inside updateHud
const oldWaveLabelHud = `  const waveLabel = document.getElementById('waveLabel');
  if (waveLabel) waveLabel.textContent = 'Dalga ' + wave + ' · ' + currentBiome().name;`;

const newWaveLabelHud = `  const waveLabel = document.getElementById('waveLabel');
  if (waveLabel) {
    const curHeat = (typeof getActiveHeat === 'function') ? getActiveHeat() : 0;
    waveLabel.textContent = 'Dalga ' + wave + ' · ' + currentBiome().name + (curHeat > 0 ? (' · 🔥 ISI ' + curHeat) : '');
  }`;

if (html.includes(oldWaveLabelHud)) {
  html = html.replace(oldWaveLabelHud, newWaveLabelHud);
  console.log('7H. Displayed active Heat badge in updateHud waveLabel!');
} else {
  console.error('Warning: oldWaveLabelHud not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 8 applied successfully!');
