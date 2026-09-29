const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html length:', html.length);

// =========================================================================
// 1. ADD LOCALIZATION DICTIONARY & BOSS DYNAMIC DIALOGUES SYSTEM
// =========================================================================
const localizationCode = `
// =========================================================================
// BILINGUAL LOCALIZATION & DYNAMIC LORE SYSTEM (TR / EN)
// =========================================================================
const I18N = {
  tr: {
    start_title: 'Element Savaşı',
    start_sub: 'Kay, vur, kombo yarat',
    start_play: '▶ SAVAŞA BAŞLA',
    daily_btn: '☀️ GÜNLÜK RUN',
    settings: '⚙️ Ayarlar',
    element_tree: '🌳 Ağaç',
    asra_hub: '🔮 Asra & Yetenek',
    appearance: '🎨 Görünüm',
    guide: '📖 Rehber',
    asra_title: "🔮 Gezgin Asra'nın Sığınağı",
    asra_quote_0: '"Hoş geldin şövalye... Burası döngülerin ötesinde güvenli bir sığınak. Topladığın kadim kristalleri bana sun; canını, kılıcını ve adımlarını ebediyen perçinleyeyim."',
    asra_quote_1: '"Kadim elementler birbirine fısıldıyor... Ateş ve suyu dengeleyen savaşçı, en karanlık boşluğu bile aydınlatır."',
    asra_crystal_cur: 'Mevcut Kristal:',
    asra_return: 'Savaşa Dön ⚔️',
    game_over_title: '💀 Yenildin',
    game_over_asra: "🔮 Asra'nın Sığınağı (Yükselt)",
    game_over_retry: "Aynı build'le tekrar",
    game_over_restart: 'Yeniden Başlat',
    game_over_menu: 'Ana Menü',
    pause_title: '⏸️ Oyun Durduruldu',
    pause_resume: '▶ SAVAŞA DEVAM ET',
    pause_restart: '🔄 Baştan Başla',
    pause_menu: '🏠 Ana Menü',
    opt_lang: '🌐 Dil / Language',
    opt_shake: '📳 Ekran Sarsıntısı (Screen Shake)',
    opt_dmg: '🎯 Hasar Sayıları (Damage Numbers)',
    shake_full: '%100 (Normal)',
    shake_half: '%50 (Hafif)',
    shake_off: 'KAPALI',
    dmg_all: 'Tümü (All)',
    dmg_crit: 'Yalnızca Kritik',
    dmg_off: 'Kapalı / Off'
  },
  en: {
    start_title: 'Elemental War',
    start_sub: 'Dash, strike, craft combos',
    start_play: '▶ ENTER COMBAT',
    daily_btn: '☀️ DAILY RUN',
    settings: '⚙️ Settings',
    element_tree: '🌳 Element Tree',
    asra_hub: "🔮 Asra's Sanctuary",
    appearance: '🎨 Appearance',
    guide: '📖 Guide',
    asra_title: "🔮 Pilgrim Asra's Sanctuary",
    asra_quote_0: '"Welcome, weary knight... This is a sacred sanctuary beyond the cycle. Offer the primordial crystals you have gathered, and I shall temper your flesh, blade, and strides for eternity."',
    asra_quote_1: '"The ancient elements whisper to one another... He who weaves flame and tide shall pierce even the deepest void."',
    asra_crystal_cur: 'Current Crystals:',
    asra_return: 'Return to Battle ⚔️',
    game_over_title: '💀 Defeated',
    game_over_asra: "🔮 Asra's Sanctuary (Upgrade)",
    game_over_retry: 'Retry Same Build',
    game_over_restart: 'Restart Run',
    game_over_menu: 'Main Menu',
    pause_title: '⏸️ Game Paused',
    pause_resume: '▶ RESUME BATTLE',
    pause_restart: '🔄 Restart',
    pause_menu: '🏠 Main Menu',
    opt_lang: '🌐 Dil / Language',
    opt_shake: '📳 Screen Shake',
    opt_dmg: '🎯 Damage Numbers',
    shake_full: '100% (Normal)',
    shake_half: '50% (Subtle)',
    shake_off: 'OFF',
    dmg_all: 'All',
    dmg_crit: 'Only Crits',
    dmg_off: 'Off'
  }
};

function getGameLang() {
  const m = loadMeta();
  return m.lang || 'tr';
}

function t(key, fallback) {
  const lang = getGameLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N['tr'] && I18N['tr'][key]) || fallback || key;
}

// Boss Dynamic Encounter Dialogues: First Time vs Returning (After Defeats)
const BOSS_LORE_DIALOGUES = {
  stone: {
    tr_first: 'Küstah yabancı! Kadim taşların gazabından kimse sağ çıkamaz!',
    tr_return: 'Yine mi sen ölümlü? Ruhun daha önce burada ezildi, şimdi toprağa karışacaksın!',
    en_first: 'Insolent mortal! None shall withstand the wrath of the primordial monolith!',
    en_return: 'Back again? Your bones crumbled beneath me once; now you shall become dust!'
  },
  lava: {
    tr_first: 'Magmanın derinliklerinden yükselen ateşi tat! Küllerin bile kalmayacak!',
    tr_return: 'Hala yanmaktan bıkmadın mı? Bu kez ruhunu cehennem alevinde eriteceğim!',
    en_first: 'Taste the blaze rising from the magma deep! Not even your ashes shall remain!',
    en_return: 'Have you not burned enough? This time your very soul melts in hellfire!'
  },
  sugar: {
    tr_first: 'Aaa, tatlı bir misafir! Gel seni kristal şekerden bir heykele çevireyim!',
    tr_return: 'Hihihi, yine mi geldin? Bu sefer seni pastamın süsü yapacağım!',
    en_first: 'Ooh, a sweet visitor! Let me turn you into a crystalline sugar statue!',
    en_return: "Tee-hee, back for more candy? This time you'll be the topping on my cake!"
  },
  forest: {
    tr_first: 'Kutsal kökleri kirleten adımların burada son bulacak!',
    tr_return: 'Ormanın gazabından kaçamazsın. Kökler kanına yeniden susadı!',
    en_first: 'Your defiling steps end here upon these sacred boughs!',
    en_return: "You cannot flee the forest's wrath. The roots thirst for your blood once more!"
  },
  water: {
    tr_first: 'Karanlık sazlıkların dibine hoş geldin... Boğulmanın sessizliğini dinle!',
    tr_return: 'Suyun altına gömülenler geri dönemezdi... Seni bu kez dibe hapsedeceğim!',
    en_first: 'Welcome to the abyss of the dark reeds... Hear the silence of drowning!',
    en_return: 'None escape the drowned depths twice... This time I drag you to the bottom forever!'
  },
  ketchup: {
    tr_first: 'Sosu bol, acısı sert bir ziyafete hazır ol! Lezzetim seni ezecek!',
    tr_return: 'Tarifimden kaçamazsın! Bu kez seni sosun içinde pişireceğim!',
    en_first: 'Prepare for a saucy, spicy slaughter! My zest will crush you!',
    en_return: 'No one escapes my secret recipe! Back into the simmering cauldron you go!'
  },
  storm: {
    tr_first: 'Gök yarıldı! Fırtınanın şimşeği kalbini delip geçecek!',
    tr_return: 'Yıldırım aynı yere iki kez düşmez derler... Seni defalarca çarpacağım!',
    en_first: "The heavens shatter! The storm's lightning will pierce your mortal heart!",
    en_return: 'They say lightning never strikes the same place twice... I will prove them wrong!'
  },
  ice: {
    tr_first: 'Buzulların soğuğu kanını donduracak! Burası donmuş cehennem!',
    tr_return: 'Buzdan tabutunu özledin mi? Seni sonsuz ayazda donduracağım!',
    en_first: 'Glacial fury chills your veins! This frozen realm shall be your tomb!',
    en_return: 'Did you miss your icy coffin? I shall preserve your frozen corpse forever!'
  },
  sand: {
    tr_first: 'Kum fırtınası etini kemiğinden ayıracak! Çölün lanetine teslim ol!',
    tr_return: 'Rüzgar küllerini savurdu ama yine geldin. Çöl seni tamamen yutacak!',
    en_first: 'The sandstorm shall scour flesh from bone! Surrender to the desert curse!',
    en_return: 'The dunes scattered your remains once. Now the quicksand swallows you whole!'
  },
  night: {
    tr_first: 'Son durağa ulaştın şövalye. Boşluk senin varlığını silip atacak!',
    tr_return: 'Döngüyü kırmaya çalışman nafile... Karanlık ebedidir, sen sadece bir gölgesin!',
    en_first: 'You have reached the terminus, knight. The void shall erase your existence!',
    en_return: 'Your struggle against the cycle is futile... Darkness is eternal, you are merely a flicker!'
  }
};

function getBossDynamicDialogue(bossType) {
  const lang = getGameLang();
  const m = loadMeta();
  m.bossDeaths = m.bossDeaths || {};
  const deaths = m.bossDeaths[bossType] || 0;
  const entry = BOSS_LORE_DIALOGUES[bossType] || BOSS_LORE_DIALOGUES['stone'];
  if (lang === 'en') {
    return deaths > 0 ? entry.en_return : entry.en_first;
  }
  return deaths > 0 ? entry.tr_return : entry.tr_first;
}

function recordBossDeath(bossType) {
  if (!bossType) return;
  const m = loadMeta();
  m.bossDeaths = m.bossDeaths || {};
  m.bossDeaths[bossType] = (m.bossDeaths[bossType] || 0) + 1;
  saveMeta(m);
}
`;

// Insert localization and boss lore functions right after loadMeta/saveMeta
const loadMetaAnchor = `function saveMeta(m) {
  try { localStorage.setItem('elementer-meta', JSON.stringify(m)); } catch (e) {}
}`;

if (html.includes(loadMetaAnchor)) {
  html = html.replace(loadMetaAnchor, loadMetaAnchor + '\n' + localizationCode);
  console.log('1. Successfully inserted I18N and Boss Lore System!');
} else {
  console.log('Warning: loadMetaAnchor not found!');
}

// =========================================================================
// 2. ACCESSIBILITY SETTINGS (SCREEN SHAKE MULTIPLIER & DAMAGE NUMBERS FILTER)
// =========================================================================
const shakeHelper = `
function getShakeMultiplier() {
  const m = loadMeta();
  return (m.screenShake != null) ? m.screenShake : 1.0;
}
function getDmgNumbersSetting() {
  const m = loadMeta();
  return m.dmgNumbers || 'all'; // 'all', 'crit', 'off'
}
`;

html = html.replace('function saveMeta(m) {', shakeHelper + '\nfunction saveMeta(m) {');

// In render(), apply getShakeMultiplier() to shake
const oldShakeApply = `  const shx = shake ? (Math.random()-0.5)*shake : 0;
  const shy = shake ? (Math.random()-0.5)*shake : 0;`;

const newShakeApply = `  const effShake = shake * getShakeMultiplier();
  const shx = effShake ? (Math.random()-0.5)*effShake : 0;
  const shy = effShake ? (Math.random()-0.5)*effShake : 0;`;

if (html.includes(oldShakeApply)) {
  html = html.replace(oldShakeApply, newShakeApply);
  console.log('2. Successfully applied shake multiplier to render loop!');
} else {
  console.log('Warning: oldShakeApply not found!');
}

// In spawnFloatText(), check getDmgNumbersSetting()
const oldSpawnFloatStart = `function spawnFloatText(x,y,text,color,type) {
  let str = String(text || '')`;

const newSpawnFloatStart = `function spawnFloatText(x,y,text,color,type) {
  const dmgPref = getDmgNumbersSetting();
  if (dmgPref === 'off') return;
  const isCritCheck = type === 'crit' || (typeof text === 'string' && text.startsWith('!')) || color === '#ffd740';
  if (dmgPref === 'crit' && !isCritCheck && type !== 'kill' && type !== 'big') return;
  let str = String(text || '')`;

if (html.includes(oldSpawnFloatStart)) {
  html = html.replace(oldSpawnFloatStart, newSpawnFloatStart);
  console.log('3. Successfully hooked damage numbers preference to spawnFloatText!');
} else {
  console.log('Warning: oldSpawnFloatStart not found!');
}

// =========================================================================
// 3. DYNAMIC AUDIO (SYNTHBLIP: CHARGE, LEGENDARY, PHASE2 & BGM PHASE 2 TEMPO)
// =========================================================================
const oldSynthBlipCases = `    } else if (kind === 'level') {
      o.type = 'triangle';
      o.frequency.setValueAtTime(440, t);
      o.frequency.setValueAtTime(554, t + 0.08);
      o.frequency.setValueAtTime(659, t + 0.16);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.start(t); o.stop(t + 0.33);
    }`;

const newSynthBlipCases = `    } else if (kind === 'level') {
      o.type = 'triangle';
      o.frequency.setValueAtTime(440, t);
      o.frequency.setValueAtTime(554, t + 0.08);
      o.frequency.setValueAtTime(659, t + 0.16);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.start(t); o.stop(t + 0.33);
    } else if (kind === 'charge') {
      // Boss heavy attack telegraph - rising tension laser/slam charge
      o.type = 'sawtooth';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(280, t);
      f.frequency.exponentialRampToValueAtTime(1200, t + 0.36);
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(520, t + 0.36);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.1, t + 0.30);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.40);
      o.start(t); o.stop(t + 0.41);
    } else if (kind === 'legendary') {
      // Gacha / Legendary / Upgrade fanfare chime (Pentatonic Celestial Arpeggio)
      const penta = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      penta.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gn = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.055);
          gn.gain.setValueAtTime(0.0001, t + idx * 0.055);
          gn.gain.linearRampToValueAtTime(vol * 0.85, t + idx * 0.055 + 0.01);
          gn.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.055 + 0.35);
          osc.connect(gn);
          gn.connect(ctx.destination);
          osc.start(t + idx * 0.055);
          osc.stop(t + idx * 0.055 + 0.38);
        } catch(_) {}
      });
    } else if (kind === 'phase2_cue') {
      // Deep warhorn / aggressive brass roar for Phase 2 entry
      o.type = 'sawtooth';
      f.type = 'lowpass';
      f.frequency.setValueAtTime(550, t);
      o.frequency.setValueAtTime(80, t);
      o.frequency.exponentialRampToValueAtTime(120, t + 0.12);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.45);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.5, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.start(t); o.stop(t + 0.58);
    }`;

if (html.includes(oldSynthBlipCases)) {
  html = html.replace(oldSynthBlipCases, newSynthBlipCases);
  console.log('4. Successfully added charge, legendary, and phase2 audio cues to synthBlip!');
} else {
  console.log('Warning: oldSynthBlipCases not found!');
}

// In BGM: accelerate tempo & switch to aggressive tone when boss is in Phase 2!
const oldBgmStep = `    const isBoss = enemies.some(e => e.type === 'boss');
    const isLowHp = player && player.hp > 0 && (player.hp / player.maxHp <= 0.25);
    const stepDur = isBoss ? 0.125 : 0.145; // 120 vs 103 BPM`;

const newBgmStep = `    const currentBoss = enemies.find(e => e.type === 'boss');
    const isBoss = !!currentBoss;
    const isBossPhase2 = isBoss && (currentBoss.phase === 2 || currentBoss.isPhase2 || (currentBoss.hp / currentBoss.maxHp) <= 0.5);
    const isLowHp = player && player.hp > 0 && (player.hp / player.maxHp <= 0.25);
    // Dynamic tempo: normal (103 BPM), boss (120 BPM), boss Phase 2 (150 BPM intense rush!)
    const stepDur = isBossPhase2 ? 0.098 : (isBoss ? 0.125 : 0.145);`;

if (html.includes(oldBgmStep)) {
  html = html.replace(oldBgmStep, newBgmStep);
  console.log('5. Successfully connected dynamic Phase 2 tempo acceleration to BGM!');
} else {
  console.log('Warning: oldBgmStep not found!');
}

// Trigger synthBlip('charge') when boss charges slam or aim
const oldSlamTrigger = `    if (en.slamT > 0) {`;
const newSlamTrigger = `    if (en.slamT > 0) {
      if (en.slamT === 90) synthBlip('charge');`;

if (html.includes(oldSlamTrigger)) {
  html = html.replace(oldSlamTrigger, newSlamTrigger);
  console.log('6. Successfully hooked telegraph charge audio cue to boss slam!');
} else {
  console.log('Warning: oldSlamTrigger not found!');
}

// =========================================================================
// 4. DYNAMIC BOSS INTRO BANNER WITH LORE DIALOGUE & DEATH TRACKING
// =========================================================================
const oldBossSpawnSplash = `    bossSplash = {
      title: cfg.title || 'DİYAR LORDU',
      phaseTitle: cfg.phaseTitle || '',
      subtitle: (biome.name || 'Diyar') + ' Hükümdarı',
      biomeKey: biome.key || 'stone',
      color: (biome && biome.accent) || '#ffd700',
      t: 140,
      maxT: 140
    };
    spawnFloatText(player.x, player.y - 48, '⚡ ' + cfg.title + ' BELİRDİ! ⚡', (biome && biome.accent) || '#ffd700', 'big');`;

const newBossSpawnSplash = `    const dynamicDialogue = getBossDynamicDialogue(cfg.bossType || biome.key);
    bossSplash = {
      title: cfg.title || 'DİYAR LORDU',
      phaseTitle: cfg.phaseTitle || '',
      subtitle: (biome.name || 'Diyar') + (getGameLang() === 'en' ? ' Sovereign' : ' Hükümdarı'),
      dialogue: dynamicDialogue,
      biomeKey: biome.key || 'stone',
      color: (biome && biome.accent) || '#ffd700',
      t: 180,
      maxT: 180
    };
    spawnFloatText(player.x, player.y - 48, '⚡ ' + cfg.title + ' ⚡', (biome && biome.accent) || '#ffd700', 'big');`;

if (html.includes(oldBossSpawnSplash)) {
  html = html.replace(oldBossSpawnSplash, newBossSpawnSplash);
  console.log('7. Successfully integrated dynamic boss lore dialogues into spawnWave!');
} else {
  console.log('Warning: oldBossSpawnSplash not found!');
}

// In drawBossSplash, render the dynamic boss dialogue line
const oldDrawBossSplash = `  // 2. Alt Başlık (Diyar Bilgisi)
  ctx.font = '700 13px system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(bossSplash.subtitle, cx, cy + 18);`;

const newDrawBossSplash = `  // 2. Alt Başlık (Diyar Bilgisi)
  ctx.font = '700 13px system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(bossSplash.subtitle, cx, cy + 18);

  // 3. Dinamik Boss Repliği (İlk Karşılaşma vs Tekrar Geliş)
  if (bossSplash.dialogue) {
    ctx.font = 'italic 600 11px system-ui, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('“' + bossSplash.dialogue + '”', cx, cy + 34);
  }`;

if (html.includes(oldDrawBossSplash)) {
  html = html.replace(oldDrawBossSplash, newDrawBossSplash);
  console.log('8. Successfully rendered dynamic boss dialogue in drawBossSplash!');
} else {
  console.log('Warning: oldDrawBossSplash not found!');
}

// Record boss death on player defeat
const oldRecordDeath = `  if (!deathReason) setDeathReason('Yakın hasar');
  if (player.hp <= 0) { player.hp = 0; updateHud(); offerContinue(); }`;

const newRecordDeath = `  if (!deathReason) setDeathReason('Yakın hasar');
  if (player.hp <= 0) {
    player.hp = 0;
    const activeBoss = enemies.find(e => e.type === 'boss');
    if (activeBoss) recordBossDeath(activeBoss.bossType || currentBiome().key);
    updateHud();
    offerContinue();
  }`;

if (html.includes(oldRecordDeath)) {
  html = html.replace(oldRecordDeath, newRecordDeath);
  console.log('9. Successfully recorded boss deaths in damagePlayer!');
} else {
  console.log('Warning: oldRecordDeath not found!');
}

// =========================================================================
// 5. SETTINGS OVERLAY ENHANCEMENTS (LANGUAGE, SCREEN SHAKE, DAMAGE NUMBERS)
// =========================================================================
const oldSettingsHeader = `    <div id="settingsOverlay" class="overlay settings-ov">
      <h2>⚙️ Oyun Ayarları</h2>
      
      <div class="pause-inventory-card" style="margin-top:8px; width:100%; max-width:380px;">`;

const newSettingsHeader = `    <div id="settingsOverlay" class="overlay settings-ov">
      <h2>⚙️ Oyun Ayarları / Settings</h2>

      <div class="pause-inventory-card" style="margin-top:8px; width:100%; max-width:380px;">
        <div class="pause-sec-title">🌐 Dil / Language</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button type="button" class="btn lang-opt-btn" data-lang="tr" style="flex:1; padding:8px 10px; font-weight:800; border-color:#38bdf8;">🇹🇷 Türkçe</button>
          <button type="button" class="btn lang-opt-btn" data-lang="en" style="flex:1; padding:8px 10px; font-weight:800; border-color:#38bdf8;">🇬🇧 English</button>
        </div>
      </div>

      <div class="pause-inventory-card" style="margin-top:10px; width:100%; max-width:380px;">
        <div class="pause-sec-title">👁️ Erişilebilirlik (Accessibility)</div>
        <div style="margin-top:8px;">
          <div style="font-size:12px; font-weight:700; margin-bottom:5px; color:#cbd5e1;">📳 Ekran Sarsıntısı (Screen Shake):</div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn shake-opt-btn" data-shake="1.0" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">%100</button>
            <button type="button" class="btn shake-opt-btn" data-shake="0.5" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">%50</button>
            <button type="button" class="btn shake-opt-btn" data-shake="0.0" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">KAPALI</button>
          </div>
        </div>
        <div style="margin-top:12px;">
          <div style="font-size:12px; font-weight:700; margin-bottom:5px; color:#cbd5e1;">🎯 Hasar Sayıları (Damage Numbers):</div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn dmg-opt-btn" data-dmg="all" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">Tümü</button>
            <button type="button" class="btn dmg-opt-btn" data-dmg="crit" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">Yalnız Kritik</button>
            <button type="button" class="btn dmg-opt-btn" data-dmg="off" style="flex:1; padding:7px 4px; font-size:11px; font-weight:800;">Kapalı</button>
          </div>
        </div>
      </div>

      <div class="pause-inventory-card" style="margin-top:10px; width:100%; max-width:380px;">`;

if (html.includes(oldSettingsHeader)) {
  html = html.replace(oldSettingsHeader, newSettingsHeader);
  console.log('10. Successfully added Language, Shake, and Damage Numbers to Settings UI!');
} else {
  console.log('Warning: oldSettingsHeader not found!');
}

// Quick Language Switcher on Start Overlay
const oldStartHero = `      <div class="menu-hero">
        <div class="menu-badge-icon">⚔️</div>
        <h2 class="menu-hero-title">Element Savaşı</h2>
        <div class="menu-hero-sub">Kay, vur, kombo yarat</div>
      </div>`;

const newStartHero = `      <div style="display:flex; justify-content:flex-end; width:100%; max-width:360px; margin-bottom:2px;">
        <button type="button" class="btn btn-sub" id="quickLangBtn" style="padding:4px 10px; font-size:11px; font-weight:900; border-color:#38bdf8; background:rgba(56,189,248,0.15); width:auto;">🌐 TR ⇄ EN</button>
      </div>
      <div class="menu-hero">
        <div class="menu-badge-icon">⚔️</div>
        <h2 class="menu-hero-title" id="mainHeroTitle">Element Savaşı</h2>
        <div class="menu-hero-sub" id="mainHeroSub">Kay, vur, kombo yarat</div>
      </div>`;

if (html.includes(oldStartHero)) {
  html = html.replace(oldStartHero, newStartHero);
  console.log('11. Successfully added quick language toggle to start screen!');
} else {
  console.log('Warning: oldStartHero not found!');
}

// =========================================================================
// 6. WIRE EVENT LISTENERS FOR ACCESSIBILITY & LOCALIZATION
// =========================================================================
const settingsListenersMarker = `document.getElementById('settingsCloseBtn').addEventListener('click', () => {`;

const newSettingsListeners = `function syncSettingsUi() {
  const m = loadMeta();
  const curLang = m.lang || 'tr';
  document.querySelectorAll('.lang-opt-btn').forEach(btn => {
    btn.style.background = btn.dataset.lang === curLang ? '#0284c7' : 'rgba(255,255,255,0.06)';
  });
  const curShake = (m.screenShake != null) ? String(m.screenShake) : '1.0';
  document.querySelectorAll('.shake-opt-btn').forEach(btn => {
    btn.style.background = btn.dataset.shake === curShake ? '#0284c7' : 'rgba(255,255,255,0.06)';
  });
  const curDmg = m.dmgNumbers || 'all';
  document.querySelectorAll('.dmg-opt-btn').forEach(btn => {
    btn.style.background = btn.dataset.dmg === curDmg ? '#0284c7' : 'rgba(255,255,255,0.06)';
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
  if (qLang) qLang.textContent = lang === 'en' ? '🌐 EN (English)' : '🌐 TR (Türkçe)';
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.textContent = tr.pause_resume;
}

document.querySelectorAll('.lang-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.lang = btn.dataset.lang;
    saveMeta(m);
    syncSettingsUi();
    updateUiTexts();
    fillTreePanel();
  });
});

document.querySelectorAll('.shake-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.screenShake = parseFloat(btn.dataset.shake);
    saveMeta(m);
    syncSettingsUi();
  });
});

document.querySelectorAll('.dmg-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = loadMeta();
    m.dmgNumbers = btn.dataset.dmg;
    saveMeta(m);
    syncSettingsUi();
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
  });
}

// Initial sync
setTimeout(() => { syncSettingsUi(); updateUiTexts(); }, 50);

document.getElementById('settingsCloseBtn').addEventListener('click', () => {`;

if (html.includes(settingsListenersMarker)) {
  html = html.replace(settingsListenersMarker, newSettingsListeners);
  console.log('12. Successfully wired event listeners for settings and localization!');
} else {
  console.log('Warning: settingsListenersMarker not found!');
}

// Play synthBlip('legendary') when buying a tree node
const oldBuyTreeNodeSfx = `  playSfx('pick', 0.4);`;
const newBuyTreeNodeSfx = `  synthBlip('legendary');
  playSfx('pick', 0.4);`;

if (html.includes(oldBuyTreeNodeSfx)) {
  html = html.replace(oldBuyTreeNodeSfx, newBuyTreeNodeSfx);
  console.log('13. Successfully hooked legendary fanfare to Asra Sanctuary purchases!');
} else {
  console.log('Warning: oldBuyTreeNodeSfx not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished apply_bilingual_audio_hub.js! New length:', html.length);
