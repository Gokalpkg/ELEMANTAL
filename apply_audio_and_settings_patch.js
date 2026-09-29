const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. DYNAMIC BGM TEMPO IN SYNTHBGM (158 BPM on Phase 2!)
const oldBgmBpm = `    const isBoss = enemies && enemies.some(en => en.type === 'boss');
    const isLowHp = player && player.hp > 0 && player.hp <= player.maxHp * 0.25;
    const baseBpm = isBoss ? 134 : isLowHp ? 146 : 112;
    const stepDur = 60 / baseBpm / 2;`;

const newBgmBpm = `    const currentBoss = enemies && enemies.find(en => en.type === 'boss');
    const isBoss = !!currentBoss;
    const isBossPhase2 = isBoss && (currentBoss.phase === 2 || currentBoss.isPhase2 || (currentBoss.hp / currentBoss.maxHp) <= 0.5);
    const isLowHp = player && player.hp > 0 && player.hp <= player.maxHp * 0.25;
    // Dynamic Phase 2 Boss Music Rush (158 BPM aggressive tempo)
    const baseBpm = isBossPhase2 ? 158 : (isBoss ? 134 : (isLowHp ? 146 : 112));
    const stepDur = 60 / baseBpm / 2;`;

if (html.includes(oldBgmBpm)) {
  html = html.replace(oldBgmBpm, newBgmBpm);
  console.log('1. Successfully patched BGM tempo for Phase 2 rush!');
} else {
  console.log('Warning: oldBgmBpm not found!');
}

// 2. BOSS SPLASH DYNAMIC DIALOGUE DRAWING
const oldSplashSub = `    // Subtitle & Phase Description
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eceff1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('❖ ' + bossSplash.subtitle + (bossSplash.phaseTitle ? (' • ' + bossSplash.phaseTitle) : '') + ' ❖', 0, 29);`;

const newSplashSub = `    // Subtitle & Phase Description
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eceff1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('❖ ' + bossSplash.subtitle + (bossSplash.phaseTitle ? (' • ' + bossSplash.phaseTitle) : '') + ' ❖', 0, 29);
    // Dynamic Lore Dialogue line
    if (bossSplash.dialogue) {
      ctx.font = 'italic bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('“' + bossSplash.dialogue + '”', 0, 48);
    }`;

if (html.includes(oldSplashSub)) {
  html = html.replace(oldSplashSub, newSplashSub);
  console.log('2. Successfully patched bossSplash text drawing with dynamic dialogue!');
} else {
  console.log('Warning: oldSplashSub not found!');
}

// 3. SETTINGS UI SYNC & INTERACTION LISTENERS
const oldOpenSettingsEnd = `  document.getElementById('settingsOverlay').classList.add('show');
  playSfx('ui', 0.3);
}`;

const newOpenSettingsEnd = `  syncSettingsUi();
  document.getElementById('settingsOverlay').classList.add('show');
  playSfx('ui', 0.3);
}

function syncSettingsUi() {
  const m = loadMeta();
  const curLang = m.lang || 'tr';
  document.querySelectorAll('.lang-opt-btn').forEach(btn => {
    btn.style.background = btn.dataset.lang === curLang ? '#0284c7' : 'rgba(255,255,255,0.06)';
    btn.style.borderColor = btn.dataset.lang === curLang ? '#38bdf8' : 'rgba(255,255,255,0.15)';
  });
  const curShake = (m.screenShake != null) ? String(m.screenShake) : '1.0';
  document.querySelectorAll('.shake-opt-btn').forEach(btn => {
    btn.style.background = (btn.dataset.shake === curShake || parseFloat(btn.dataset.shake) === parseFloat(curShake)) ? '#0284c7' : 'rgba(255,255,255,0.06)';
    btn.style.borderColor = (btn.dataset.shake === curShake || parseFloat(btn.dataset.shake) === parseFloat(curShake)) ? '#38bdf8' : 'rgba(255,255,255,0.15)';
  });
  const curDmg = m.dmgNumbers || 'all';
  document.querySelectorAll('.dmg-opt-btn').forEach(btn => {
    btn.style.background = btn.dataset.dmg === curDmg ? '#0284c7' : 'rgba(255,255,255,0.06)';
    btn.style.borderColor = btn.dataset.dmg === curDmg ? '#38bdf8' : 'rgba(255,255,255,0.15)';
  });
}

function updateUiTexts() {
  const lang = getGameLang();
  const tr = I18N[lang] || I18N.tr;
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.innerHTML = '<span class="play-icon">▶</span> ' + tr.start_play.replace('▶ ', '');
  const titleEl = document.getElementById('mainHeroTitle');
  if (titleEl) titleEl.textContent = tr.start_title;
  const subEl = document.getElementById('mainHeroSub');
  if (subEl) subEl.textContent = tr.start_sub;
  const asraBtn = document.getElementById('treeFromStartBtn');
  if (asraBtn) asraBtn.textContent = tr.asra_hub;
  const qLang = document.getElementById('quickLangBtn');
  if (qLang) qLang.textContent = lang === 'en' ? '🌐 EN' : '🌐 TR';
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.textContent = tr.pause_resume;
}`;

if (html.includes(oldOpenSettingsEnd)) {
  html = html.replace(oldOpenSettingsEnd, newOpenSettingsEnd);
  console.log('3. Successfully hooked syncSettingsUi into openSettings!');
} else {
  console.log('Warning: oldOpenSettingsEnd not found!');
}

// 4. ATTACH CLICK LISTENERS FOR BUTTONS AT END OF INIT
const oldInitEnd = `const settingsClose = document.getElementById('settingsCloseBtn');
if (settingsClose) settingsClose.addEventListener('click', closeSettings);`;

const newInitEnd = `const settingsClose = document.getElementById('settingsCloseBtn');
if (settingsClose) settingsClose.addEventListener('click', closeSettings);

document.querySelectorAll('.lang-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.lang = btn.dataset.lang;
    saveMeta(m);
    syncSettingsUi();
    updateUiTexts();
    fillTreePanel();
    playSfx('ui', 0.25);
  });
});

document.querySelectorAll('.shake-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.screenShake = parseFloat(btn.dataset.shake);
    saveMeta(m);
    syncSettingsUi();
    playSfx('ui', 0.25);
  });
});

document.querySelectorAll('.dmg-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.dmgNumbers = btn.dataset.dmg;
    saveMeta(m);
    syncSettingsUi();
    playSfx('ui', 0.25);
  });
});

const quickLangBtn = document.getElementById('quickLangBtn');
if (quickLangBtn) {
  quickLangBtn.addEventListener('click', () => {
    const m = loadMeta();
    m.lang = (m.lang === 'en') ? 'tr' : 'en';
    saveMeta(m);
    syncSettingsUi();
    updateUiTexts();
    fillTreePanel();
    playSfx('ui', 0.25);
  });
}
setTimeout(() => { syncSettingsUi(); updateUiTexts(); }, 60);`;

if (html.includes(oldInitEnd)) {
  html = html.replace(oldInitEnd, newInitEnd);
  console.log('4. Successfully attached event listeners for settings and quick language switch!');
} else {
  console.log('Warning: oldInitEnd not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished apply_audio_and_settings_patch.js!');
