const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Ensure standard line endings for matching
const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('Original index.html lines:', html.split('\n').length);

// -------------------------------------------------------------
// 1. HERO NAME INPUT IN START SCREEN & ASRA REMOVAL FROM HTML
// -------------------------------------------------------------

// In Start Screen: Insert Hero Name card before the start button
const startBtnTarget = `<button class="btn btn-main-play" id="startBtn" type="button">`;
const heroNameCardHtml = `<div class="hero-name-card" style="width:100%; max-width:320px; margin:0 auto 10px; text-align:left; background:rgba(15,23,42,0.75); border:1px solid #38bdf8; border-radius:10px; padding:10px 14px; box-shadow:0 0 14px rgba(56,189,248,0.2);">
        <label for="heroNameInput" style="display:block; font-size:11px; font-weight:800; color:#38bdf8; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">⚔️ Kahraman İsmi (Hero Name)</label>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="text" id="heroNameInput" maxlength="16" placeholder="Alp" value="" style="flex:1; background:#0b1120; border:1px solid #0284c7; border-radius:6px; padding:8px 10px; color:#f8fafc; font-size:14px; font-weight:bold; outline:none; text-shadow:0 0 8px rgba(56,189,248,0.4);">
        </div>
      </div>\n      ` + startBtnTarget;

if (html.includes(startBtnTarget) && !html.includes('heroNameInput')) {
  html = html.replace(startBtnTarget, heroNameCardHtml);
  console.log('Added hero name card to start screen');
}

// Replace Asra button in menu-sub-row
html = html.replace(
  `<button class="btn btn-sub" id="treeFromStartBtn" type="button" style="border-color:#c084fc; color:#e9d5ff;">🔮 Asra & Yetenek</button>`,
  `<button class="btn btn-sub" id="treeFromStartBtn" type="button" style="border-color:#c084fc; color:#e9d5ff;">🔮 Kadim Sunak</button>`
);

// Replace Asra Game Over button
html = html.replace(
  `<button class="btn" id="asraFromOverBtn" type="button" style="background:linear-gradient(135deg,#7e22ce,#a855f7);border-color:#d8b4fe;color:#fff;font-weight:bold;">🔮 Asra'nın Sığınağı (Yükselt)</button>`,
  `<button class="btn" id="asraFromOverBtn" type="button" style="background:linear-gradient(135deg,#7e22ce,#a855f7);border-color:#d8b4fe;color:#fff;font-weight:bold;">🔮 Kadim Sunak (Yükselt)</button>`
);

// Replace Asra hub overlay with Kadim Sunak overlay
const oldTreeOverlayTarget = `<div id="treeOverlay" class="overlay tree-ov asra-hub-overlay">
      <div class="asra-hub-card">
        <div class="asra-hub-portrait-wrap">
          <img src="img/ui-dialogue-system.jpg" alt="Asra" class="asra-hub-portrait">
        </div>
        <div class="asra-hub-dialogue-box">
          <div class="asra-speaker-name">🔮 Gezgin Asra'nın Ocağı</div>
          <div class="asra-dialogue-quote">"Her döngü seni biraz daha biler Gökalp... Topladığın kadim kristalleri bana sun; canını, kılıcını ve adımlarını ebediyen perçinleyeyim."</div>
        </div>
      </div>
      <div class="asra-crystal-bar">
        <span class="asra-crystal-label">Mevcut Kristal:</span>
        <span id="treeCrystalLabel" class="asra-crystal-val">0 kristal</span>
      </div>`;

const newTreeOverlayHtml = `<div id="treeOverlay" class="overlay tree-ov sanctuary-hub-overlay">
      <div class="sanctuary-hub-card" style="width:100%; max-width:380px; display:flex; align-items:center; gap:12px; background:rgba(30,27,75,0.7); border:1.5px solid #a855f7; border-radius:14px; padding:10px 14px; box-shadow:0 0 18px rgba(168,85,247,0.35);">
        <div class="sanctuary-hub-emblem" style="width:52px; height:52px; flex:0 0 52px; border-radius:12px; background:radial-gradient(circle,#a855f7,#4c1d95); display:flex; align-items:center; justify-content:center; font-size:26px; border:1px solid #e9d5ff; box-shadow:0 0 10px rgba(168,85,247,0.6);">
          🔮
        </div>
        <div class="sanctuary-hub-dialogue-box" style="flex:1; min-width:0; text-align:left;">
          <div class="sanctuary-speaker-name" style="font-size:13px; font-weight:900; color:#facc15; letter-spacing:0.5px; margin-bottom:2px;">🔮 Kadim Element Sığınağı</div>
          <div class="sanctuary-dialogue-quote" style="font-size:11px; color:#e2e8f0; line-height:1.35; font-style:italic;">"Kadim elementler kahramanın çağrısına yanıt veriyor... Kristallerini sunağa ada ve gücünü ebedileştir."</div>
        </div>
      </div>
      <div class="sanctuary-crystal-bar" style="width:100%; max-width:380px; display:flex; align-items:center; justify-content:space-between; background:rgba(15,23,42,0.8); border:1px solid #64748b; border-radius:10px; padding:8px 14px; margin:6px 0; font-weight:700; font-size:13px;">
        <span class="sanctuary-crystal-label" style="color:#94a3b8;">Mevcut Kristal:</span>
        <span id="treeCrystalLabel" class="sanctuary-crystal-val" style="color:#c084fc; font-size:14px; text-shadow:0 0 8px rgba(192,132,252,0.6);">0 kristal</span>
      </div>`;

if (html.includes(oldTreeOverlayTarget)) {
  html = html.replace(oldTreeOverlayTarget, newTreeOverlayHtml);
  console.log('Replaced treeOverlay with Sanctuary overlay');
}

// -------------------------------------------------------------
// 2. I18N DICTIONARY & HERO NAME RESOLUTION
// -------------------------------------------------------------
html = html.replace(/asra_hub:\s*'🔮 Asra & Yetenek'/g, "asra_hub: '🔮 Kadim Sunak'");
html = html.replace(/asra_title:\s*"🔮 Gezgin Asra'nın Sığınağı"/g, 'asra_title: "🔮 Kadim Element Sığınağı"');
html = html.replace(/game_over_asra:\s*"🔮 Asra'nın Sığınağı \(Yükselt\)"/g, 'game_over_asra: "🔮 Kadim Sunak (Yükselt)"');
html = html.replace(/asra_hub:\s*"🔮 Asra's Sanctuary"/g, 'asra_hub: "🔮 Ancient Sanctuary"');
html = html.replace(/asra_title:\s*"🔮 Pilgrim Asra's Sanctuary"/g, 'asra_title: "🔮 Ancient Elemental Sanctuary"');
html = html.replace(/game_over_asra:\s*"🔮 Asra's Sanctuary \(Upgrade\)"/g, 'game_over_asra: "🔮 Ancient Altar (Upgrade)"');

// Replace fillTreePanel dialogue and speaker references
html = html.replace(
  `const spkEl = document.querySelector('.asra-speaker-name');
  if (spkEl) spkEl.textContent = isEn ? "🔮 Pilgrim Asra's Sanctuary" : "🔮 Gezgin Asra'nın Sığınağı";
  const quoteEl = document.querySelector('.asra-dialogue-quote');
  if (quoteEl) quoteEl.textContent = isEn
    ? '"Welcome, weary knight... This is a sacred sanctuary beyond the cycle. Offer the primordial crystals you have gathered, and I shall temper your flesh, blade, and strides for eternity."'
    : '"Her döngü seni biraz daha biler Gökalp... Topladığın kadim kristalleri bana sun; canını, kılıcını ve adımlarını ebediyen perçinleyeyim."';
  const cLab = document.querySelector('.asra-crystal-label');`,
  `const spkEl = document.querySelector('.sanctuary-speaker-name') || document.querySelector('.asra-speaker-name');
  const heroName = getHeroName();
  if (spkEl) spkEl.textContent = isEn ? "🔮 Ancient Elemental Sanctuary" : "🔮 Kadim Element Sığınağı";
  const quoteEl = document.querySelector('.sanctuary-dialogue-quote') || document.querySelector('.asra-dialogue-quote');
  if (quoteEl) quoteEl.textContent = isEn
    ? ('"The primordial elements answer your call, ' + heroName + '... Offer your crystals to the sacred altar to forge your eternity."')
    : ('"Kadim elementler senin çağrına yanıt veriyor ' + heroName + '... Topladığın kristalleri sunağa ada ve gücünü ebediyen mühürle."');
  const cLab = document.querySelector('.sanctuary-crystal-label') || document.querySelector('.asra-crystal-label');`
);

// -------------------------------------------------------------
// 3. AUTOATTACK RANGE HALVING (AUTO_X = 130) & STRICT RANGE LOCK
// -------------------------------------------------------------
html = html.replace(/const AUTO_X = 250;/g, 'const AUTO_X = 130;');

// Update ELEMENT_AUTO_SHOTS with tight, half-range values
const oldAutoShots = `const ELEMENT_AUTO_SHOTS = {
  fire:   { interval: 16, speed: 8.8, dmg: 7.6, r: 5.4, range: 260, effect: 'burn' },
  water:  { interval: 20, speed: 8.6, dmg: 6.6, r: 5.8, range: 320, effect: 'slow' },
  earth:  { interval: 26, speed: 6.2, dmg: 10.8, r: 7.8, range: 230, effect: 'stun' },
  nature: { interval: 19, speed: 7.6, dmg: 6.2, r: 5.6, range: 275, effect: 'lifesteal' },
  storm:  { interval: 14, speed: 11.2, dmg: 6.4, r: 4.2, range: 295, effect: 'shock' },
  void:   { interval: 18, speed: 8.2, dmg: 8.8, r: 6.5, range: 270, effect: 'pull' }
};`;

const newAutoShots = `const ELEMENT_AUTO_SHOTS = {
  fire:   { interval: 16, speed: 8.8, dmg: 7.6, r: 5.4, range: 130, effect: 'burn' },
  water:  { interval: 20, speed: 8.6, dmg: 6.6, r: 5.8, range: 145, effect: 'slow' },
  earth:  { interval: 26, speed: 6.2, dmg: 10.8, r: 7.8, range: 115, effect: 'stun' },
  nature: { interval: 19, speed: 7.6, dmg: 6.2, r: 5.6, range: 135, effect: 'lifesteal' },
  storm:  { interval: 14, speed: 11.2, dmg: 6.4, r: 4.2, range: 140, effect: 'shock' },
  void:   { interval: 18, speed: 8.2, dmg: 8.8, r: 6.5, range: 130, effect: 'pull' }
};`;

if (html.includes(oldAutoShots)) {
  html = html.replace(oldAutoShots, newAutoShots);
  console.log('Updated ELEMENT_AUTO_SHOTS ranges to ~130');
}

// In fireAutoShot(): STRICT RANGE CHECK (Do NOT fallback to nearestEnemy() across the whole map)
const oldFireAutoTarget = `  const autoRange = (auto.range || AUTO_X) * (isSniperStance ? 2.0 : 1.0);
  let target = nearestEnemyInRange(autoRange);
  if (!target && enemies.length) {
    target = nearestEnemy();
  }
  if (!target) return;`;

const newFireAutoTarget = `  const autoRange = (auto.range || AUTO_X) * (isSniperStance ? 1.6 : 1.0);
  let target = nearestEnemyInRange(autoRange);
  // STRICT RANGE LOCK: Never auto-target or shoot enemies outside autoRange!
  if (!target) return;`;

if (html.includes(oldFireAutoTarget)) {
  html = html.replace(oldFireAutoTarget, newFireAutoTarget);
  console.log('Fixed fireAutoShot target locking to strictly in range');
}

// -------------------------------------------------------------
// 4. RESTORE CRLF IF NEEDED AND WRITE
// -------------------------------------------------------------
if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html part 1');
