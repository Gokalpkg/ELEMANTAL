const fs = require('fs');
const path = require('path');

console.log('=== COMMENCING 100% EXHAUSTIVE EMOJI PURGE & PIXEL-ART UPGRADE ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// List of specific string replacements
const stringReplacements = [
  // Static HTML modals & buttons
  ['<button type="button" id="devJumpBtn" aria-label="Geliştirici Bölüm Seç">🛠️ BÖLÜM</button>', '<button type="button" id="devJumpBtn" aria-label="Geliştirici Bölüm Seç"><span class="px-icon px-gear"></span> BÖLÜM</button>'],
  ['<button type="button" class="quick-lang-pill" id="quickLangBtn" aria-label="Dil Değiştir">🌐 TR</button>', '<button type="button" class="quick-lang-pill" id="quickLangBtn" aria-label="Dil Değiştir">TR</button>'],
  ['<span class="dock-icon">👥</span>', '<span class="dock-icon"><span class="px-icon px-heroes"></span></span>'],
  ['<span class="dock-icon">🏛️</span>', '<span class="dock-icon"><span class="px-icon px-shrine"></span></span>'],
  ['<span class="dock-icon">📜</span>', '<span class="dock-icon"><span class="px-icon px-scroll"></span></span>'],
  ['<span class="dock-icon">⚙️</span>', '<span class="dock-icon"><span class="px-icon px-gear px-anim-spin"></span></span>'],
  ['<h2>🏆 Mitolojik Başarımlar (Kut & Töre)</h2>', '<h2><span class="px-icon px-trophy px-anim-glow"></span> Mitolojik Başarımlar (Kut & Töre)</h2>'],
  ['<span class="hero-modal-badge">👑</span>', '<span class="hero-modal-badge"><span class="px-icon px-crown"></span></span>'],
  ['<div class="hero-crystal-pill">💎 <span id="heroSelectCrystalCount">0</span></div>', '<div class="hero-crystal-pill"><span class="px-icon px-gem px-anim-shimmer"></span> <span id="heroSelectCrystalCount">0</span></div>'],
  ['<h2>🌳 Element Ağacı</h2>', '<h2><span class="px-icon px-nature"></span> Element Ağacı</h2>'],
  ['<div class="asra-speaker-name sanctuary-speaker-name">🔮 Kadim Element Sığınağı</div>', '<div class="asra-speaker-name sanctuary-speaker-name"><span class="px-icon px-shrine"></span> Kadim Element Sığınağı</div>'],
  ['<button type="button" class="sunak-tab active" id="tabSunakTree">🔮 Güç Sunakları</button>', '<button type="button" class="sunak-tab active" id="tabSunakTree"><span class="px-icon px-shrine"></span> Güç Sunakları</button>'],
  ['<button type="button" class="sunak-tab" id="tabSunakElTree">🌳 Element Ağacı</button>', '<button type="button" class="sunak-tab" id="tabSunakElTree"><span class="px-icon px-nature"></span> Element Ağacı</button>'],
  ['<button class="btn btn-main-play" id="treeCloseBtn" type="button" style="min-width:180px;">Savaşa Dön ⚔️</button>', '<button class="btn btn-main-play" id="treeCloseBtn" type="button" style="min-width:180px;">Savaşa Dön</button>'],
  ['<div class="go-skull-icon">💀</div>', '<div class="go-skull-icon"><span class="px-icon px-skull" style="width:48px;height:48px;"></span></div>'],
  ['<button class="btn btn-main-play" id="restartBtn" type="button">⚔️ TEKRAR SAVAŞ</button>', '<button class="btn btn-main-play" id="restartBtn" type="button"><span class="px-icon px-swords"></span> TEKRAR SAVAŞ</button>'],
  ['<button class="btn btn-sunak-upgrade" id="asraFromOverBtn" type="button">🏛️ KADİM SUNAK (GELİŞTİR)</button>', '<button class="btn btn-sunak-upgrade" id="asraFromOverBtn" type="button"><span class="px-icon px-shrine"></span> KADİM SUNAK</button>'],
  ['🛠️ Bölüm & Boss Seçici', 'Bölüm & Boss Seçici'],
  ['👑 Boss Bölümleri Rehberi', 'Boss Bölümleri Rehberi'],
  ['👑 Sadece Boss Bölümleri (10)', 'Sadece Boss Bölümleri (10)'],
  ['🛠️ BÖLÜM SEÇİCİ', 'BÖLÜM SEÇİCİ'],

  // Game over / End of run stats
  ['<span class="stat-icon">⏱️</span>', '<span class="stat-icon"><span class="px-icon px-gear"></span></span>'],
  ['<span class="stat-icon">💥</span>', '<span class="stat-icon"><span class="px-icon px-crit"></span></span>'],
  ['<span class="stat-icon">🎯</span>', '<span class="stat-icon"><span class="px-icon px-target"></span></span>'],
  ['<span class="stat-icon">💀</span>', '<span class="stat-icon"><span class="px-icon px-skull"></span></span>'],
  ['<span>💎 Kadim Kristal:</span>', '<span><span class="px-icon px-gem px-anim-shimmer"></span> Kadim Kristal:</span>'],
  ['<span style="color:#fde047;font-weight:800;font-size:11.5px;">🏛️ KADİM SUNAK İPUCU:</span>', '<span style="color:#fde047;font-weight:800;font-size:11.5px;"><span class="px-icon px-shrine"></span> KADİM SUNAK İPUCU:</span>'],
  ['<span>🏆 Skor:</span>', '<span><span class="px-icon px-trophy px-anim-glow"></span> Skor:</span>'],
  ['isNewRecord ? \' 👑 YENİ REKOR!\' : \'\'', 'isNewRecord ? \' YENİ REKOR!\' : \'\''],
  ['\'<span class="hero-name">⚔️ \' + heroNameVal + \'</span>\'', '\'<span class="hero-name">\' + heroNameVal + \'</span>\''],

  // Skill lock icon
  ['<span class="sk-icon">🔒</span>', '<span class="sk-icon"><span class="px-icon px-shield"></span></span>'],
  ['icon.textContent = \'🔒\';', 'icon.innerHTML = renderPixelIcon(\'shield\');'],

  // Settings / Sound / Haptic
  ["sfxBtn.textContent = sfxMuted ? '🔇' : '🔊';", "sfxBtn.innerHTML = sfxMuted ? renderPixelIcon('sound_off') : renderPixelIcon('sound');"],
  ["settingsSfxBtn.textContent = sfxMuted ? '🔇' : '🔊';", "settingsSfxBtn.innerHTML = sfxMuted ? renderPixelIcon('sound_off') : renderPixelIcon('sound');"],
  ["vibBtn.textContent = vibEnabled ? '📳 Açık' : '📴 Kapalı';", "vibBtn.innerHTML = renderPixelIcon('haptic') + (vibEnabled ? ' Açık' : ' Kapalı');"],
  ["settingsVibBtn.textContent = vibEnabled ? '📳 Açık' : '📴 Kapalı';", "settingsVibBtn.innerHTML = renderPixelIcon('haptic') + (vibEnabled ? ' Açık' : ' Kapalı');"],
  ["ecoBtn.textContent = window.batteryEcoMode ? '🔋 Açık (%50 Tasarruf)' : '⚡ Kapalı';", "ecoBtn.innerHTML = (window.batteryEcoMode ? renderPixelIcon('gear') + ' Açık (%50 Tasarruf)' : renderPixelIcon('lightning') + ' Kapalı');"],

  // Reroll button
  ["fab.textContent = '🔄 Yenile · ' + (rerollsLeft || 0);", "fab.innerHTML = renderPixelIcon('respec') + ' Yenile (' + (rerollsLeft || 0) + ')';"],
  ["btn.textContent = `🔄 Yenile (${rerollsLeft || 0})`;", "btn.innerHTML = `${renderPixelIcon('respec')} Yenile (${rerollsLeft || 0})`;"],

  // Hero titles & quotes
  ["'🐺 TENGRİ BİZİMLE!'", "'TENGRİ BİZİMLE!'"],
  ["'🔥 KÜL OLUN!'", "'KÜL OLUN!'"],
  ["'🏹 ALPLAR ASLA YENİLMEZ!'", "'ALPLAR ASLA YENİLMEZ!'"],
  ["specialLabel: '✨ UZMANLIK'", "specialLabel: 'UZMANLIK'"],
  ["specialLabel: '🛡️ SAVUNMA'", "specialLabel: 'SAVUNMA'"],
  ["specialLabel: '🎯 KRİTİK GÜCÜ'", "specialLabel: 'KRİTİK GÜCÜ'"],
  ["specialLabel: '❄️ DONDURMA'", "specialLabel: 'DONDURMA'"],
  ["specialLabel: '⚡ KİNETİK ŞARJ'", "specialLabel: 'KİNETİK ŞARJ'"],
  ["specialLabel: '⏳ ZAMAN BÜKME'", "specialLabel: 'ZAMAN BÜKME'"],
  ["specialLabel: '🌿 KÖK SALMA'", "specialLabel: 'KÖK SALMA'"],
  ["specialLabel: '🔮 ELEMENT SİMYASI'", "specialLabel: 'ELEMENT SİMYASI'"],
  ["name: '🌟 GÜNEŞ ALEVİ'", "name: 'GÜNEŞ ALEVİ'"],
  ["name: '🌟 MUTLAK SÜPERİLETKEN'", "name: 'MUTLAK SÜPERİLETKEN'"],
  ["name: '🌟 GÖKTAŞI KIYAMETİ'", "name: 'GÖKTAŞI KIYAMETİ'"],
  ["name: '🌟 KARA DELİK VORTEKSİ'", "name: 'KARA DELİK VORTEKSİ'"],

  // Barks / Titles
  ["bonusTitle: '🛡️ ERGENEKON KORUMASI'", "bonusTitle: 'ERGENEKON KORUMASI'"],
  ["bonusTitle: '⚡ GÖK TENGRİ GAZABI'", "bonusTitle: 'GÖK TENGRİ GAZABI'"],
  ["bonusTitle: '🩸 ALKARISI LANETİ'", "bonusTitle: 'ALKARISI LANETİ'"],
  ["title: '👑 GÖK TENGRI'", "title: 'GÖK TENGRI'"],
  ["title: '🏹 ALP'", "title: 'ALP'"],

  // Canvas text
  ["ctx.fillText('⚠ DALGIÇ', x, y - r * 0.6);", "ctx.fillText('DALGIÇ', x, y - r * 0.6);"],
  ["ctx.fillText('🌑 İM', en.x, cy - en.r - 22);", "ctx.fillText('İM', en.x, cy - en.r - 22);"]
];

for (const [target, replacement] of stringReplacements) {
  if (content.includes(target)) {
    content = content.replace(target, replacement);
  }
}

// Global Hook into showStreakBanner to strip any unicode emojis
const bannerHook = `function showStreakBanner(title, color) {
  if (typeof title === 'string') {
    title = title.replace(/(\\p{Extended_Pictographic}|\\uD83C[\\uDF00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDD00-\\uDFFF])/gu, '').replace(/\\s{2,}/g, ' ').trim();
  }`;

content = content.replace(/function showStreakBanner\(title,\s*color\)\s*\{/, bannerHook);

// Also clean translation dictionary from unicode emojis
console.log('Sanitizing translation dictionaries...');
const transDictMatch = content.match(/const TR_STRINGS\s*=\s*\{[\s\S]*?\};/);
if (transDictMatch) {
  const cleanedDict = transDictMatch[0].replace(/(\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/gu, '');
  content = content.replace(transDictMatch[0], cleanedDict);
}

// Clean choice cards attribute lists
content = content.replace(
  '<div class="attr-item"><span class="attr-icon">❤️</span>',
  '<div class="attr-item"><span class="attr-icon">' + '<span class="px-icon px-heart px-anim-beat"><svg viewBox="0 0 16 16" fill="none"><path d="M2 5h2v-2h3v2h2v-2h3v2h2v4h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-4z" fill="#dc2626"/></svg></span>' + '</span>'
);
content = content.replace(
  '<div class="attr-item"><span class="attr-icon">🏹</span>',
  '<div class="attr-item"><span class="attr-icon">' + '<span class="px-icon px-bow"><svg viewBox="0 0 16 16" fill="none"><path d="M3 2c6 0 10 4 10 10l-1 1c0-5-4-9-9-9z" fill="#b45309"/></svg></span>' + '</span>'
);
content = content.replace(
  '<div class="attr-item"><span class="attr-icon">🏃</span>',
  '<div class="attr-item"><span class="attr-icon">' + '<span class="px-icon px-lightning"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span>' + '</span>'
);
content = content.replace(
  '<div class="attr-item"><span class="attr-icon">🩸</span>',
  '<div class="attr-item"><span class="attr-icon">' + '<span class="px-icon px-blood"><svg viewBox="0 0 16 16" fill="none"><path d="M8 2c-1 2-4 5-4 8 0 2 2 4 4 4s4-2 4-4c0-3-3-6-4-8z" fill="#dc2626"/></svg></span>' + '</span>'
);

// Clean up remaining choice card badge texts
content = content.replace('🟡 EFSANEVİ FÜZYON', 'EFSANEVİ FÜZYON');
content = content.replace('⚪ PAS GEÇ', 'PAS GEÇ');
content = content.replace('🟡 EFSANEVİ', 'EFSANEVİ');
content = content.replace('🟣 NADİR', 'NADİR');
content = content.replace('🟢 YAYGIN', 'YAYGIN');

// Replace any remaining raw crystal texts
content = content.replace(/💎\s*(\d+)\s*kristal/gi, '$1 kristal');
content = content.replace(/\+(\d+)\s*💎/g, '+$1 kristal');

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== FULL PURGE COMPLETED ===');
