const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. ADD getHeroName AND INPUT EVENT LISTENER
// -------------------------------------------------------------
const oldHeroNameTarget = `function runTitle() {`;
const newHeroNameTarget = `function getHeroName() {
  try {
    const input = document.getElementById('heroNameInput');
    if (input && input.value && input.value.trim()) return input.value.trim();
    const stored = localStorage.getItem('elementer-hero-name');
    if (stored && stored.trim()) return stored.trim();
  } catch (_) {}
  return 'Alp';
}

function runTitle() {`;

if (html.includes(oldHeroNameTarget) && !html.includes('function getHeroName() {')) {
  html = html.replace(oldHeroNameTarget, newHeroNameTarget);
  changes++;
  console.log('[1] Added getHeroName() function');
} else {
  console.log('[1] getHeroName() already present or target not found');
}

// -------------------------------------------------------------
// 2. PURGE REMAINING ASRA OCCURRENCES IN HTML
// -------------------------------------------------------------
if (html.includes(`<div class="asra-speaker-name">🔮 Gezgin Asra'nın Ocağı</div>`)) {
  html = html.replace(
    `<div class="asra-speaker-name">🔮 Gezgin Asra'nın Ocağı</div>`,
    `<div class="asra-speaker-name sanctuary-speaker-name">🔮 Kadim Element Sığınağı</div>`
  );
  changes++;
  console.log('[2] Replaced Asra speaker name');
}

if (html.includes(`alt="Asra"`)) {
  html = html.replace(`alt="Asra"`, `alt="Kadim Sunak"`);
  changes++;
  console.log('[3] Replaced alt="Asra"');
}

if (html.includes(`🔮 Asra'nın Ocağı (Yükselt)`)) {
  html = html.replace(`🔮 Asra'nın Ocağı (Yükselt)`, `🔮 Kadim Sunak (Yükselt)`);
  changes++;
  console.log('[4] Replaced button text Asra\'nın Ocağı');
}

// -------------------------------------------------------------
// 3. TRACK RUN STATS: DMG, MAX CRIT, KILLS, TIME
// -------------------------------------------------------------
const oldEmptyStateRunStats = `  runStats = { sweet:0, weave:0, echo:0 }; afterImg = []; camKick = 0; wasSweetPress = false; weaveNear = false;`;
const newEmptyStateRunStats = `  runStats = {
    sweet: 0, weave: 0, echo: 0,
    totalDmgDealt: 0,
    maxCritHit: 0,
    kills: 0,
    bossKills: 0,
    startTime: performance.now()
  }; afterImg = []; camKick = 0; wasSweetPress = false; weaveNear = false;`;

if (html.includes(oldEmptyStateRunStats)) {
  html = html.replace(oldEmptyStateRunStats, newEmptyStateRunStats);
  changes++;
  console.log('[5] Initialized comprehensive runStats in emptyState');
} else {
  console.warn('[5] Warning: oldEmptyStateRunStats not found');
}

// In takeDamage: track total damage & highest crit hit
const oldTakeDmgStat = `  en.flashT = isCrit ? 6 : 4;
  en.hitDmgRef = dealt;`;

const newTakeDmgStat = `  en.flashT = isCrit ? 6 : 4;
  en.hitDmgRef = dealt;

  // Track run combat metrics for Savaş Raporu
  if (typeof runStats !== 'undefined' && runStats) {
    runStats.totalDmgDealt = (runStats.totalDmgDealt || 0) + dealt;
    if (dealt > (runStats.maxCritHit || 0)) runStats.maxCritHit = dealt;
  }`;

if (html.includes(oldTakeDmgStat)) {
  html = html.replace(oldTakeDmgStat, newTakeDmgStat);
  changes++;
  console.log('[6] Tracked total damage & max crit in takeDamage');
} else {
  console.warn('[6] Warning: oldTakeDmgStat not found');
}

// In killEnemy: track kills & boss kills
const oldKillEnemyStat = `    score += pts;
    killCombo++;`;

const newKillEnemyStat = `    score += pts;
    if (typeof runStats !== 'undefined' && runStats) {
      runStats.kills = (runStats.kills || 0) + 1;
      if (en.type === 'boss') runStats.bossKills = (runStats.bossKills || 0) + 1;
    }
    killCombo++;`;

if (html.includes(oldKillEnemyStat)) {
  html = html.replace(oldKillEnemyStat, newKillEnemyStat);
  changes++;
  console.log('[7] Tracked kills and bossKills in killEnemy');
} else {
  console.warn('[7] Warning: oldKillEnemyStat not found');
}

// -------------------------------------------------------------
// 4. REWRITE finishRun WITH HIGH IMPACT SAVAŞ RAPORU
// -------------------------------------------------------------
const oldFinishRunRecap = `  document.getElementById('gameOverText').innerHTML =
    '<div style="font-size:14px; font-weight:900; color:#ffd700; margin-bottom:6px;">SAVAŞ RAPORU</div>' +
    '<div style="line-height:1.6; font-size:12px;">' +
    'Ölüm: <b style="color:#ff8a80;">' + why + '</b><br>' +
    'Dalga: <b>' + wave + '</b> · ' + currentBiome().name + (endlessMode ? ' · Sonsuz' : '') + '<br>' +
    'Skor: <b>' + score + '</b>' + (m.bestScore <= score ? ' · YENİ REKOR' : '') + '<br>' +
    'Akış: ' + flowPeak + ' · Seri x' + maxStreak + '<br>' +
    'Kristal: +' + (runCrystals + (pity || 0)) +
    (title ? '<br>Unvan: ' + title : '') +
    '</div>';`;

const newFinishRunRecap = `  const durationMs = Math.max(1000, performance.now() - ((runStats && runStats.startTime) || performance.now()));
  const totalSec = Math.floor(durationMs / 1000);
  const timeFormatted = Math.floor(totalSec / 60) + 'dk ' + (totalSec % 60) + 'sn';
  const heroNameVal = getHeroName();
  const totalDmgFmt = ((runStats && runStats.totalDmgDealt) || 0).toLocaleString();
  const maxCritFmt = ((runStats && runStats.maxCritHit) || 0).toLocaleString();
  const killsCount = (runStats && runStats.kills) || 0;
  const bossCount = (runStats && runStats.bossKills) || 0;
  const earnedCrystals = runCrystals + (pity || 0);
  const isNewRecord = (score > (m.bestScore || 0));

  let relicBadgesHtml = '';
  if (runFlags().glassCannon || (player && player.cursed === 'glassCannon')) relicBadgesHtml += '<span class="relic-hud-badge glass">🔮 CAM TOP</span>';
  if (runFlags().bloodPact || (player && player.cursed === 'bloodPact')) relicBadgesHtml += '<span class="relic-hud-badge blood">🩸 KAN BÜYÜSÜ</span>';
  if (runFlags().magnetNova || (player && player.cursed === 'magnetNova')) relicBadgesHtml += '<span class="relic-hud-badge magnet">🧲 MIKNATIS KIYAMETİ</span>';

  document.getElementById('gameOverText').innerHTML =
    '<div class="recap-card">' +
      '<div class="recap-hero-badge">' +
        '<span class="hero-name">⚔️ ' + heroNameVal + '</span>' +
        '<span class="hero-title">' + (title || 'Kadim Elementalist') + '</span>' +
      '</div>' +
      (relicBadgesHtml ? '<div class="recap-relics">' + relicBadgesHtml + '</div>' : '') +
      '<div class="recap-grid">' +
        '<div class="recap-stat">' +
          '<span class="stat-icon">⏱️</span>' +
          '<div class="stat-meta">' +
            '<span class="stat-val">Dalga ' + wave + '</span>' +
            '<span class="stat-sub">' + timeFormatted + ' · ' + currentBiome().name + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="recap-stat">' +
          '<span class="stat-icon">💥</span>' +
          '<div class="stat-meta">' +
            '<span class="stat-val">' + totalDmgFmt + '</span>' +
            '<span class="stat-sub">Toplam Hasar</span>' +
          '</div>' +
        '</div>' +
        '<div class="recap-stat">' +
          '<span class="stat-icon">🎯</span>' +
          '<div class="stat-meta">' +
            '<span class="stat-val">' + maxCritFmt + '!</span>' +
            '<span class="stat-sub">En Yüksek Kritik</span>' +
          '</div>' +
        '</div>' +
        '<div class="recap-stat">' +
          '<span class="stat-icon">💀</span>' +
          '<div class="stat-meta">' +
            '<span class="stat-val">' + killsCount + ' / ' + bossCount + '</span>' +
            '<span class="stat-sub">Düşman / Boss</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="recap-reward-box">' +
        '<div class="recap-reward-line">' +
          '<span>💎 Kadim Kristal:</span>' +
          '<b style="color:#c084fc; font-size:14.5px;">+' + earnedCrystals + ' 💎</b>' +
        '</div>' +
        '<div class="recap-reward-line">' +
          '<span>🏆 Skor:</span>' +
          '<b style="color:#ffd700;">' + score.toLocaleString() + (isNewRecord ? ' 👑 YENİ REKOR!' : '') + '</b>' +
        '</div>' +
        (why ? '<div class="recap-death-line">Ölüm: <i>' + why + '</i></div>' : '') +
      '</div>' +
    '</div>';`;

if (html.includes(oldFinishRunRecap)) {
  html = html.replace(oldFinishRunRecap, newFinishRunRecap);
  changes++;
  console.log('[8] Replaced finishRun recap with visual RPG Recap Card');
} else {
  console.warn('[8] Warning: oldFinishRunRecap not found');
}

// -------------------------------------------------------------
// 5. CSS STYLING FOR RECAP CARD
// -------------------------------------------------------------
const oldRecapCssTarget = `</style>`;
const newRecapCss = `
.recap-card {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recap-hero-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}
.recap-hero-badge .hero-name {
  font-size: 14px;
  font-weight: 900;
  color: #38bdf8;
  letter-spacing: 0.5px;
}
.recap-hero-badge .hero-title {
  font-size: 11px;
  font-weight: 700;
  color: #fbbf24;
}
.recap-relics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}
.recap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.recap-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 10px;
}
.recap-stat .stat-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}
.recap-stat .stat-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
}
.recap-stat .stat-val {
  font-size: 13px;
  font-weight: 900;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recap-stat .stat-sub {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
}
.recap-reward-box {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9));
  border: 1px solid #a855f7;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}
.recap-reward-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recap-death-line {
  font-size: 11px;
  color: #f87171;
  text-align: center;
  margin-top: 4px;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 4px;
}
</style>`;

if (html.includes(oldRecapCssTarget)) {
  html = html.replace(oldRecapCssTarget, newRecapCss);
  changes++;
  console.log('[9] Added Recap Card CSS');
} else {
  console.warn('[9] Warning: oldRecapCssTarget not found');
}

// -------------------------------------------------------------
// 6. HERO NAME INPUT PERSISTENCE INITIALIZATION
// -------------------------------------------------------------
const oldInitEnd = `window.addEventListener('load', () => {`;
const newInitEnd = `window.addEventListener('load', () => {
  const hInput = document.getElementById('heroNameInput');
  if (hInput) {
    try {
      const saved = localStorage.getItem('elementer-hero-name');
      if (saved) hInput.value = saved;
    } catch (_) {}
    hInput.addEventListener('input', () => {
      try {
        localStorage.setItem('elementer-hero-name', hInput.value.trim() || 'Alp');
      } catch (_) {}
    });
  }`;

if (html.includes(oldInitEnd)) {
  html = html.replace(oldInitEnd, newInitEnd);
  changes++;
  console.log('[10] Added Hero Name Input persistence on load');
} else {
  console.warn('[10] Warning: oldInitEnd not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Scope 7 apply script. Total successful patches: ${changes}`);
