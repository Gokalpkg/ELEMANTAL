const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[Step 10 Heroes] Original file length:', content.length);

// =========================================================================
// 1. DATA ARCHITECTURE: HERO_ROSTER & HERO HELPERS
// =========================================================================
const heroRosterCode = `
// =========================================================================
// KAHRAMAN ROSTER'I (TÜRK MİTOLOJİSİ EFSANELERİ: KORHAN, KARAÇOR, BAMSI)
// =========================================================================
const HERO_ROSTER = {
  bamsi: {
    id: 'bamsi',
    name: 'BAMSI',
    title: 'Yelin ve Ruhun Kılıcı',
    badge: '🌪️',
    element: 'wind',
    color: '#38bdf8',
    accentColor: '#0284c7',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.05,
    atkSpeedBonus: 20,
    weapon: 'Kavisli Türk Yatağanı',
    passiveName: 'Yel Kalkanı (Parry)',
    passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',
    quote: '"Yel gibi eser, kılıç gibi biçeriz!"'
  },
  korhan: {
    id: 'korhan',
    name: 'KORHAN',
    title: 'Közün ve Lavın Muhafızı',
    badge: '🌋',
    element: 'fire',
    color: '#ff5722',
    accentColor: '#ff9800',
    hp: 220,
    speed: 3.0,
    dmgMul: 1.15,
    def: 0.20,
    weapon: 'Akkor Volkanik Pala (Yalman)',
    passiveName: 'Volkanik Siper',
    passiveDesc: 'Her %20 can kaybında tüm çevredeki düşmanları fırlatan ve yakan dev bir magma püskürmesi patlatır.',
    quote: '"Közden doğduk, lavla dövüldük!"'
  },
  karacor: {
    id: 'karacor',
    name: 'KARAÇOR',
    title: 'Gecenin ve Hiçliğin İnfazcısı',
    badge: '🌑',
    element: 'void',
    color: '#c084fc',
    accentColor: '#a855f7',
    hp: 130,
    speed: 3.8,
    dmgMul: 1.0,
    critBonus: 25,
    weapon: 'Çift Ruh Çakramı',
    passiveName: 'Gölge İnfazı',
    passiveDesc: 'Dash ile düşmanların içinden geçer ve işaretler. İşaretli hedefe ilk vuruş %300 Kritik İnfaz vurur!',
    quote: '"Gölgede olanı karanlık bile göremez."'
  }
};

let selectedHeroId = 'bamsi';
try {
  const savedHero = localStorage.getItem('elementer-hero');
  if (savedHero && HERO_ROSTER[savedHero]) selectedHeroId = savedHero;
} catch (e) {}

function getSelectedHero() {
  return HERO_ROSTER[selectedHeroId] || HERO_ROSTER.bamsi;
}

function selectHero(heroId) {
  if (!HERO_ROSTER[heroId]) return;
  selectedHeroId = heroId;
  try { localStorage.setItem('elementer-hero', heroId); } catch (e) {}
  updateHeroSelectUI();
  playSfx('confirm', 0.45, heroId === 'korhan' ? 320 : heroId === 'karacor' ? 750 : 540);
  vibrate([25, 40]);
}
`;

// Insert HERO_ROSTER before LOOK_SKINS
const lookSkinsTarget = `const LOOK_SKINS = [`;
if (content.includes(lookSkinsTarget)) {
  content = content.replace(lookSkinsTarget, heroRosterCode + '\n' + lookSkinsTarget);
  console.log('Inserted HERO_ROSTER successfully!');
} else {
  console.error('ERROR: Could not find LOOK_SKINS target');
}

// =========================================================================
// 2. HERO SELECTION UI IN START MENU (HTML & CSS)
// =========================================================================
const heroSelectCss = `
<style>
/* KAHRAMAN SEÇİM VİTRİNİ (HERO SELECTION UI) */
.hero-select-container {
  width: 100%;
  max-width: 360px;
  margin: 8px auto 12px;
  background: rgba(12, 17, 30, 0.90);
  border: 1.5px solid rgba(56, 189, 248, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.55);
}
.hero-select-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.hero-select-heading {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #38bdf8;
  text-transform: uppercase;
}
.hero-tabs-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}
.hero-tab-btn {
  background: rgba(15, 23, 42, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.hero-tab-btn.active {
  border-color: var(--hero-accent, #38bdf8);
  background: rgba(30, 41, 59, 0.95);
  box-shadow: 0 0 12px var(--hero-accent-alpha, rgba(56, 189, 248, 0.35));
  transform: translateY(-2px);
}
.hero-tab-icon {
  font-size: 20px;
  line-height: 1;
}
.hero-tab-name {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #f1f5f9;
}
.hero-info-card {
  background: rgba(10, 14, 26, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  text-align: left;
}
.hero-info-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.hero-info-title {
  font-size: 11px;
  font-weight: 900;
  color: var(--hero-accent, #38bdf8);
  letter-spacing: 0.5px;
}
.hero-info-quote {
  font-size: 9.5px;
  font-style: italic;
  color: #94a3b8;
}
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 6px 0;
  font-size: 10px;
  font-weight: 800;
}
.hero-stat-pill {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 3px 6px;
  text-align: center;
}
.hero-passive-box {
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid var(--hero-accent, #38bdf8);
  border-radius: 0 4px 4px 0;
  padding: 4px 8px;
  margin-top: 4px;
}
.hero-passive-title {
  font-size: 10px;
  font-weight: 900;
  color: #f8fafc;
  margin-bottom: 2px;
}
.hero-passive-desc {
  font-size: 9.5px;
  color: #cbd5e1;
  line-height: 1.35;
}
</style>
`;

// Insert heroSelectCss into head
const headTarget = `</head>`;
if (content.includes(headTarget)) {
  content = content.replace(headTarget, heroSelectCss + '\n' + headTarget);
  console.log('Inserted hero select styles!');
}

const heroSelectHtml = `
      <!-- KAHRAMAN SEÇİM VİTRİNİ (KORHAN, KARAÇOR, BAMSI) -->
      <div class="hero-select-container" id="heroSelectContainer">
        <div class="hero-select-title-bar">
          <span class="hero-select-heading">⚔️ TÜRK MİTOLOJİSİ KAHRAMANI SEÇ</span>
          <span id="heroSelectedBadge" style="font-size:10px; font-weight:800; color:#38bdf8; background:rgba(56,189,248,0.15); padding:2px 8px; border-radius:10px;">SEÇİLDİ</span>
        </div>
        <div class="hero-tabs-row" id="heroTabsRow">
          <button type="button" class="hero-tab-btn" id="heroTab_bamsi" onclick="selectHero('bamsi')">
            <span class="hero-tab-icon">🌪️</span>
            <span class="hero-tab-name">BAMSI</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_korhan" onclick="selectHero('korhan')">
            <span class="hero-tab-icon">🌋</span>
            <span class="hero-tab-name">KORHAN</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_karacor" onclick="selectHero('karacor')">
            <span class="hero-tab-icon">🌑</span>
            <span class="hero-tab-name">KARAÇOR</span>
          </button>
        </div>
        <div class="hero-info-card" id="heroInfoCard">
          <div class="hero-info-header">
            <span class="hero-info-title" id="heroCardTitle">BAMSI · Yelin Kılıcı</span>
            <span class="hero-info-quote" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</span>
          </div>
          <div class="hero-stats-grid">
            <div class="hero-stat-pill" id="heroStatHp">❤️ CAN: 160</div>
            <div class="hero-stat-pill" id="heroStatSpd">⚡ HIZ: 3.5</div>
            <div class="hero-stat-pill" id="heroStatWep">⚔️ YATAĞAN</div>
          </div>
          <div class="hero-passive-box">
            <div class="hero-passive-title" id="heroPassiveTitle">ÖZEL PASİF: Yel Kalkanı (Parry)</div>
            <div class="hero-passive-desc" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>
          </div>
        </div>
      </div>
`;

// Insert heroSelectHtml before startBtn in startOverlay
const startBtnTarget = `<button class="btn btn-main-play" id="startBtn" type="button">`;
if (content.includes(startBtnTarget)) {
  content = content.replace(startBtnTarget, heroSelectHtml + '\n        ' + startBtnTarget);
  console.log('Inserted hero select HTML into startOverlay!');
} else {
  console.error('ERROR: Could not find startBtnTarget');
}

// Function to update Hero Select UI
const updateHeroSelectUiFn = `
function updateHeroSelectUI() {
  const hero = getSelectedHero();
  ['bamsi', 'korhan', 'karacor'].forEach(id => {
    const btn = document.getElementById('heroTab_' + id);
    if (btn) {
      if (id === hero.id) {
        btn.classList.add('active');
        btn.style.setProperty('--hero-accent', hero.color);
        btn.style.setProperty('--hero-accent-alpha', hero.color + '44');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const card = document.getElementById('heroInfoCard');
  if (card) card.style.setProperty('--hero-accent', hero.color);

  const titleEl = document.getElementById('heroCardTitle');
  if (titleEl) {
    titleEl.textContent = hero.badge + ' ' + hero.name + ' · ' + hero.title;
    titleEl.style.color = hero.color;
  }

  const quoteEl = document.getElementById('heroCardQuote');
  if (quoteEl) quoteEl.textContent = hero.quote;

  const hpEl = document.getElementById('heroStatHp');
  if (hpEl) hpEl.textContent = '❤️ CAN: ' + hero.hp;

  const spdEl = document.getElementById('heroStatSpd');
  if (spdEl) spdEl.textContent = '⚡ HIZ: ' + hero.speed;

  const wepEl = document.getElementById('heroStatWep');
  if (wepEl) wepEl.textContent = '⚔️ ' + (hero.id === 'korhan' ? 'VOLKANİK PALA' : hero.id === 'karacor' ? 'RUH ÇAKRAMI' : 'YATAĞAN');

  const passTitle = document.getElementById('heroPassiveTitle');
  if (passTitle) passTitle.textContent = 'ÖZEL PASİF: ' + hero.passiveName;

  const passDesc = document.getElementById('heroPassiveDesc');
  if (passDesc) passDesc.textContent = hero.passiveDesc;
}
`;

// Insert updateHeroSelectUI after goMainMenu
const goMainMenuTarget = `function goMainMenu() {`;
if (content.includes(goMainMenuTarget)) {
  content = content.replace(goMainMenuTarget, updateHeroSelectUiFn + '\n' + goMainMenuTarget);
  console.log('Inserted updateHeroSelectUI function!');
}

// Call updateHeroSelectUI inside goMainMenu()
const goMainMenuCallTarget = `syncDevModeUI();`;
if (content.includes(goMainMenuCallTarget)) {
  content = content.replace(goMainMenuCallTarget, goMainMenuCallTarget + '\n  updateHeroSelectUI();');
  console.log('Hooked updateHeroSelectUI into goMainMenu!');
}

// Also call updateHeroSelectUI on page load
const pageLoadTarget = `buildSkillButtons();`;
if (content.includes(pageLoadTarget)) {
  content = content.replace(pageLoadTarget, pageLoadTarget + '\nupdateHeroSelectUI();');
  console.log('Hooked updateHeroSelectUI on page load!');
}

// =========================================================================
// 3. APPLY HERO STATS IN emptyState()
// =========================================================================
const emptyStatePlayerTarget = `player = { x:originX + MAP_W/2, y:originY + MAP_H/2, r:16, hp:148, maxHp:148, speed:3.38, invuln:0, moving:false, vx:0, vy:0, facing: -Math.PI/2, mods:{ atkSpeed:0, dmg:0, shield:0, move:0, vamp:0, magnet:0, skillDur:0, haste:0, rock:0, pierce:0, crit:0, skillCd:0, skillArea:0, ember:0, wide:0, reflect:0, greedy:0 }, level:1, xp:0, xpNeed: xpToNext(1), slowUntil:0 };`;

const emptyStatePlayerReplacement = `const currentHero = getSelectedHero();
  const baseHp = currentHero.hp || 160;
  const baseSpeed = currentHero.speed || 3.4;
  player = {
    x: originX + MAP_W / 2,
    y: originY + MAP_H / 2,
    r: 16,
    heroId: currentHero.id,
    hp: baseHp,
    maxHp: baseHp,
    speed: baseSpeed,
    invuln: 0,
    moving: false,
    vx: 0,
    vy: 0,
    facing: -Math.PI / 2,
    mods: { atkSpeed: 0, dmg: 0, shield: 0, move: 0, vamp: 0, magnet: 0, skillDur: 0, haste: 0, rock: 0, pierce: 0, crit: currentHero.critBonus || 0, skillCd: 0, skillArea: 0, ember: 0, wide: 0, reflect: 0, greedy: 0 },
    level: 1,
    xp: 0,
    xpNeed: xpToNext(1),
    slowUntil: 0
  };`;

if (content.includes(emptyStatePlayerTarget)) {
  content = content.replace(emptyStatePlayerTarget, emptyStatePlayerReplacement);
  console.log('emptyState updated with dynamic hero stats!');
} else {
  console.error('ERROR: Could not find emptyStatePlayerTarget');
}

// =========================================================================
// 4. BESPOKE PIXEL ART SPRITES FOR KORHAN, KARAÇOR & BAMSI
// =========================================================================
const bespokeHeroRenderers = `
// =========================================================================
// 1. KORHAN — KÖZÜN VE LAVIN MUHAFIZI (HEAVY MOLTEN BRAWLER)
// =========================================================================
function drawHeroKorhan(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isHurt = pState === PLAYER_STATE.HURT;

  // 1. Alevli Köz Pelerini (Molten Fiery War Cape)
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.22) * 0.28;
  const capeLen = isMoving ? 24 : 17;
  ctx.save();
  ctx.fillStyle = '#7c2d12'; // Koyu yanık bazalt taban
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 7, cy + 2);
  ctx.lineTo(px + Math.cos(capeAng - 0.4) * (capeLen + 4), cy + 5 + Math.sin(capeAng - 0.4) * (capeLen * 0.65));
  ctx.lineTo(px + Math.cos(capeAng + 0.4) * (capeLen + 6), cy + 7 + Math.sin(capeAng + 0.4) * (capeLen * 0.65));
  ctx.closePath();
  ctx.fill();

  // Akkor Alev Astarı (Glowing Lava Flame)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 6, cy);
  ctx.lineTo(px + Math.cos(capeAng - 0.25) * capeLen, cy + 3 + Math.sin(capeAng - 0.25) * (capeLen * 0.55));
  ctx.lineTo(px + Math.cos(capeAng + 0.25) * (capeLen + 2), cy + 5 + Math.sin(capeAng + 0.25) * (capeLen * 0.55));
  ctx.closePath();
  ctx.fill();

  // Parlayan köz kıvılcımları
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + Math.cos(capeAng) * (capeLen - 2), cy + 4, 2.5, 2.5);
  ctx.restore();

  // 2. Ağır Zırhlı Çizmeler (Heavy Basalt Greaves)
  const footL_x = px - 6 - legSwing * 0.7;
  const footR_x = px + 6 + legSwing * 0.7;
  const footY = cy + 11;
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(footL_x - 3, footY, 6, 5);
  ctx.fillRect(footR_x - 3, footY, 6, 5);
  // Lav Çatlakları Botlarda
  ctx.fillStyle = '#f97316';
  ctx.fillRect(footL_x - 1, footY + 1, 3, 2);
  ctx.fillRect(footR_x - 1, footY + 1, 3, 2);

  // 3. Volkanik Zırhlı Gövde (Cracked Magma Plate)
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.ellipse(px, cy + 2, 11, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Göğüsteki Parlayan Volkanik Lav Çatlakları (Pulsing Magma Heart)
  const lavaPulse = Math.sin(time * 0.3) * 0.2 + 0.8;
  ctx.fillStyle = '#ff3d00';
  ctx.globalAlpha = lavaPulse;
  ctx.fillRect(px - 4, cy - 2, 8, 3);
  ctx.fillRect(px - 2, cy + 1, 4, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px - 1, cy - 1, 3, 2);
  ctx.globalAlpha = 1.0;

  // 4. Masif Bazalt Omuzluklar (Massive Volcanic Pauldrons)
  ctx.fillStyle = '#44403c';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.2;
  // Sol Omuzluk
  ctx.beginPath();
  ctx.moveTo(px - 14, cy - 3);
  ctx.lineTo(px - 7, cy - 7);
  ctx.lineTo(px - 5, cy + 1);
  ctx.lineTo(px - 12, cy + 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Sağ Omuzluk
  ctx.beginPath();
  ctx.moveTo(px + 14, cy - 3);
  ctx.lineTo(px + 7, cy - 7);
  ctx.lineTo(px + 5, cy + 1);
  ctx.lineTo(px + 12, cy + 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. Miğfer & Savaş Başlığı (Volcanic Horned Helmet)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(px, cy - 8, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Kızgın Köz Siper Gözlüğü (Visor Slit)
  ctx.fillStyle = '#f97316';
  const lookOffX = Math.cos(faceAng) * 2.5;
  ctx.fillRect(px + lookOffX - 4, cy - 9, 8, 2.5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + lookOffX - 2, cy - 9, 4, 1.5);

  // Volkanik Boynuzlar
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(px - 6, cy - 12); ctx.lineTo(px - 11, cy - 18); ctx.lineTo(px - 3, cy - 13);
  ctx.moveTo(px + 6, cy - 12); ctx.lineTo(px + 11, cy - 18); ctx.lineTo(px + 3, cy - 13);
  ctx.fill();

  // 6. DEVASE İKİ ELLİ VOLKANİK PALA (YALMAN KILIÇ)
  ctx.save();
  const swordAng = isAttacking ? faceAng + Math.sin(time * 0.8) * 0.8 : faceAng + Math.PI * 0.75;
  ctx.translate(px, cy + 1);
  ctx.rotate(swordAng);

  // Kılıç Namlusu (Akkor Volkanik Çelik)
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(6, -3, 26, 6);
  // Yalman Genişletilmiş Kesici Ağzı
  ctx.beginPath();
  ctx.moveTo(22, -4);
  ctx.lineTo(34, 0);
  ctx.lineTo(22, 4);
  ctx.closePath();
  ctx.fillStyle = '#ff3d00';
  ctx.fill();

  // Kılıç Sırtındaki Magma Oluğu
  ctx.fillStyle = '#f97316';
  ctx.fillRect(8, -1, 18, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(14, -0.5, 8, 1);

  // Kılıç Kabzası ve Balçak
  ctx.fillStyle = '#78350f';
  ctx.fillRect(3, -5, 3, 10);
  ctx.fillStyle = '#44403c';
  ctx.fillRect(-4, -2, 7, 4);
  ctx.restore();
}

// =========================================================================
// 2. KARAÇOR — GECENİN VE HİÇLİĞİN İNFAZCISI (VOID SHADOW ASSASSIN)
// =========================================================================
function drawHeroKaracor(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isHurt = pState === PLAYER_STATE.HURT;

  // 1. Gece Karası Yırtık Pelerin & Gölge Dumanı
  ctx.save();
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.3) * 0.35;
  const capeLen = isMoving ? 26 : 18;

  // Gölge Duman Halesi
  ctx.fillStyle = 'rgba(88, 28, 135, 0.45)';
  ctx.beginPath();
  ctx.arc(px, cy + 4, 14, 0, Math.PI * 2);
  ctx.fill();

  // Yırtık Pelerin Kuyrukları
  ctx.fillStyle = '#0f172a';
  for (let t = -1; t <= 1; t++) {
    const tAng = capeAng + t * 0.32;
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px + Math.cos(tAng) * (capeLen + (t === 0 ? 6 : 0)), cy + 4 + Math.sin(tAng) * (capeLen * 0.7));
    ctx.lineTo(px + Math.cos(tAng + 0.18) * (capeLen - 3), cy + 6 + Math.sin(tAng + 0.18) * (capeLen * 0.7));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. Çevik Gece Çizmeleri (Stealth Boots)
  const footL_x = px - 4 - legSwing * 0.85;
  const footR_x = px + 4 + legSwing * 0.85;
  const footY = cy + 10;
  ctx.fillStyle = '#030712';
  ctx.fillRect(footL_x - 2, footY, 4, 5);
  ctx.fillRect(footR_x - 2, footY, 4, 5);

  // 3. Karanlık Suikastçı Cübbesi (Shadow Robes)
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.ellipse(px, cy + 2, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3b0764';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Mor Efsun Kuşağı
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(px - 6, cy + 3, 12, 2.5);

  // 4. Gölge Kapüşonu & PARLAYAN YARIK MOR GÖZLER
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(px, cy - 7, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Kapüşon Ucu
  ctx.beginPath();
  ctx.moveTo(px - 6, cy - 10);
  ctx.lineTo(px, cy - 16);
  ctx.lineTo(px + 6, cy - 10);
  ctx.closePath();
  ctx.fill();

  // Mor Parlayan İnfaz Gözleri (Sinister Glowing Eyes)
  const lookOffX = Math.cos(faceAng) * 2.2;
  const eyeBlink = Math.sin(time * 0.2) > 0.96 ? 0.2 : 1.0;
  ctx.fillStyle = '#c084fc';
  ctx.globalAlpha = eyeBlink;
  // Sol Yarık Göz
  ctx.fillRect(px + lookOffX - 4, cy - 8, 2.5, 2.5);
  // Sağ Yarık Göz
  ctx.fillRect(px + lookOffX + 1.5, cy - 8, 2.5, 2.5);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + lookOffX - 3, cy - 7.5, 1, 1);
  ctx.fillRect(px + lookOffX + 2.5, cy - 7.5, 1, 1);
  ctx.globalAlpha = 1.0;

  // 5. YÖRÜNGEDE DÖNEN ÇİFT RUH ÇAKRAMI (ORBITING SHADOW SHURIKENS)
  const chakramDist = 18;
  const chakramRot = time * 0.28;
  for (let ci = 0; ci < 2; ci++) {
    const cAng = chakramRot + ci * Math.PI;
    const cx = px + Math.cos(cAng) * chakramDist;
    const cy_pos = cy + Math.sin(cAng) * (chakramDist * 0.45);

    ctx.save();
    ctx.translate(cx, cy_pos);
    ctx.rotate(time * 0.6 + ci);
    // 4 Kanatlı Mor Ruh Çakramı
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(2, 0); ctx.lineTo(6, 0); ctx.lineTo(1, 2);
    ctx.lineTo(3, 6); ctx.lineTo(0, 3); ctx.lineTo(-3, 6); ctx.lineTo(-1, 2);
    ctx.lineTo(-6, 0); ctx.lineTo(-2, 0);
    ctx.closePath();
    ctx.fill();

    // Çakram Akkor Mor Çekirdeği
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// =========================================================================
// 3. BAMSI — YELİN VE RUHUN KILIÇ USTASI (TURKIC WIND SWORDSMAN)
// =========================================================================
function drawHeroBamsi(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  const isHurt = pState === PLAYER_STATE.HURT;

  // 1. Rüzgarda Dalgalanan Göçebe İpek Kaftanı (Flowing Azure/Wind Caftan)
  ctx.save();
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.25) * 0.22;
  const capeLen = isMoving ? 22 : 15;

  ctx.fillStyle = '#0369a1'; // Koyu gök mavisi astar
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 6, cy + 1);
  ctx.lineTo(px + Math.cos(capeAng - 0.35) * (capeLen + 3), cy + 4 + Math.sin(capeAng - 0.35) * (capeLen * 0.6));
  ctx.lineTo(px + Math.cos(capeAng + 0.35) * (capeLen + 4), cy + 6 + Math.sin(capeAng + 0.35) * (capeLen * 0.6));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#38bdf8'; // Parlak gök mavisi kaftan
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 5, cy);
  ctx.lineTo(px + Math.cos(capeAng - 0.2) * capeLen, cy + 3 + Math.sin(capeAng - 0.2) * (capeLen * 0.5));
  ctx.lineTo(px + Math.cos(capeAng + 0.2) * (capeLen + 2), cy + 5 + Math.sin(capeAng + 0.2) * (capeLen * 0.5));
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Deri Süvari Çizmeleri (Nomadic Riding Boots)
  const footL_x = px - 5 - legSwing * 0.8;
  const footR_x = px + 5 + legSwing * 0.8;
  const footY = cy + 10;
  ctx.fillStyle = '#451a03'; // Koyu deri
  ctx.fillRect(footL_x - 2.5, footY, 5, 5);
  ctx.fillRect(footR_x - 2.5, footY, 5, 5);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(footL_x - 1, footY + 1, 2, 2);
  ctx.fillRect(footR_x - 1, footY + 1, 2, 2);

  // 3. Türk Savaşçı Zırhı & Deri Yelek (Leather Scale Vest)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(px, cy + 2, 9, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Altın İşlemeli Alp Kemeri (Golden Girdle)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px - 6, cy + 3, 12, 2.5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px - 1.5, cy + 2.5, 3, 3.5);

  // 4. GELENEKSEL TÜRKMEN BÖRKÜ (TURKIC BÖRK HAT)
  // Börk Kürk Kenarlığı
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(px, cy - 6, 8.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Börk Tepe Kumaşı (Yana Eğik Kırmızı/Gök Başlık)
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(px - 7, cy - 7);
  ctx.quadraticCurveTo(px, cy - 17, px + 5, cy - 14); // Hafif yana eğik
  ctx.lineTo(px + 7, cy - 7);
  ctx.closePath();
  ctx.fill();

  // Börk Tüyü / Tepelik
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(px + 4, cy - 14);
  ctx.lineTo(px + 8, cy - 18);
  ctx.stroke();

  // Alp Yüzü & Kararlı Bakışlar
  const lookOffX = Math.cos(faceAng) * 2.2;
  ctx.fillStyle = '#fed7aa'; // Ten
  ctx.fillRect(px + lookOffX - 4, cy - 5, 8, 4);
  // Alp Bıyığı
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(px + lookOffX - 4, cy - 2, 8, 1.5);
  // Gözler
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + lookOffX - 3, cy - 4.5, 2, 1.5);
  ctx.fillRect(px + lookOffX + 1.5, cy - 4.5, 2, 1.5);

  // 5. PARILDAYAN KAVİSLİ TÜRK YATAĞANI (CURVED TURKIC YATAGAN)
  ctx.save();
  const swordSwing = isAttacking ? faceAng + Math.sin(time * 0.9) * 1.1 : faceAng + Math.PI * 0.65;
  ctx.translate(px, cy + 1);
  ctx.rotate(swordSwing);

  // Yatağan Kavisli Çelik Namlusu
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(3, 0);
  ctx.quadraticCurveTo(14, -3, 24, 2); // Karakteristik S-kavisi / içe kavis
  ctx.stroke();

  // Akkor Çelik Keskinlik İzi
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(5, -0.5);
  ctx.quadraticCurveTo(14, -2.5, 22, 1.5);
  ctx.stroke();

  // Kemik/Fildişi Kabza Kulakları (Yatagan Ear Pommel)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-2, -3, 4, 6);
  ctx.fillStyle = '#f59e0b'; // Altın balçak
  ctx.fillRect(2, -2.5, 2, 5);

  // Kılıç Ucundaki Rüzgar Parıltısı
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(22, 1, 2, 2);
  ctx.restore();
}
`;

// Insert bespokeHeroRenderers before drawHeroPlayer
const drawHeroPlayerTarget = `function drawHeroPlayer(ctx, px, py, pcy, player, time, sk, hopP) {`;
if (content.includes(drawHeroPlayerTarget)) {
  content = content.replace(drawHeroPlayerTarget, bespokeHeroRenderers + '\n' + drawHeroPlayerTarget);
  console.log('Inserted bespoke hero renderers (Korhan, Karaçor, Bamsı)!');
} else {
  console.error('ERROR: Could not find drawHeroPlayer target');
}

// Modify drawHeroPlayer to dispatch to specific hero renderer
const heroDispatchTarget = `  // 2. Kırmızı Boyun Atkısı & Pelerin (Red Flowing Scarf - Pafta Image 2)`;
const heroDispatchCode = `  // =========================================================================
  // DISPATCH TO SELECTED HERO RENDERER (BAMSI, KORHAN, KARAÇOR)
  // =========================================================================
  const curHeroId = (player && player.heroId) || selectedHeroId || 'bamsi';
  if (curHeroId === 'korhan') {
    drawHeroKorhan(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'karacor') {
    drawHeroKaracor(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'bamsi') {
    drawHeroBamsi(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  }

  // Fallback to legacy chibi player
  // 2. Kırmızı Boyun Atkısı & Pelerin (Red Flowing Scarf - Pafta Image 2)`;

if (content.includes(heroDispatchTarget)) {
  content = content.replace(heroDispatchTarget, heroDispatchCode);
  console.log('Hooked hero dispatch into drawHeroPlayer!');
} else {
  console.error('ERROR: Could not find heroDispatchTarget');
}

// =========================================================================
// 5. GAMEPLAY MECHANIC 1: KORHAN'S VOLCANIC BASTION (MAGMA ERUPTION)
// =========================================================================
const damagePlayerTarget = `function damagePlayer(dmg, type) {`;
const volcanicBastionCode = `
function triggerVolcanicEruption(x, y) {
  shake = Math.max(shake, 14);
  camKick = Math.max(camKick, 10);
  spawnFloatText(x, y - 28, '🌋 VOLKANİK SİPER!', '#ff3d00', 'big');
  playSfx('explode', 0.6, 240);
  vibrate([40, 60, 40, 80]);

  // Expanding Molten Shockwave Ring
  particles.push({
    x, y,
    r: 12, maxR: 150,
    life: 0.6, maxLife: 0.6,
    color: '#ff3d00',
    type: 'fusion_ring',
    lw: 6.0
  });

  // Lava sparks
  burst(x, y, '#ff5722', 24, 4.2);
  burst(x, y, '#ffd700', 16, 3.0);

  // Damage & knock back all enemies in 150px
  if (typeof damageEnemiesInRadius === 'function') {
    damageEnemiesInRadius(x, y, 150, Math.round(player.maxHp * 0.45), ['burn'], 2.0, 'fire');
  }

  // Knock back enemies
  if (enemies && enemies.length) {
    enemies.forEach(en => {
      const d = Math.hypot(en.x - x, en.y - y);
      if (d < 160 && d > 1) {
        punchEnemy(en, x, y, 24, true);
      }
    });
  }

  // Leave 3 magma pools
  if (typeof spawnElemStain === 'function') {
    for (let p = 0; p < 3; p++) {
      const pAng = Math.random() * Math.PI * 2;
      const pDist = 20 + Math.random() * 50;
      spawnElemStain(x + Math.cos(pAng) * pDist, y + Math.sin(pAng) * pDist, 34, 'fire', 120);
    }
  }
}
`;

if (content.includes(damagePlayerTarget)) {
  content = content.replace(damagePlayerTarget, volcanicBastionCode + '\n' + damagePlayerTarget);
  console.log('Inserted triggerVolcanicEruption!');
}

// Hook into damagePlayer for Korhan's 20% HP loss trigger
const damagePlayerDmgTarget = `player.hp -= eff;`;
const damagePlayerDmgReplacement = `player.hp -= eff;
  // KORHAN VOLKANİK SİPER MEKANİĞİ
  if (player && (player.heroId === 'korhan' || selectedHeroId === 'korhan') && player.hp > 0) {
    player._volcanicAccum = (player._volcanicAccum || 0) + eff;
    const threshold = player.maxHp * 0.20;
    if (player._volcanicAccum >= threshold) {
      player._volcanicAccum = 0;
      triggerVolcanicEruption(player.x, player.y);
    }
  }`;

if (content.includes(damagePlayerDmgTarget)) {
  content = content.replace(damagePlayerDmgTarget, damagePlayerDmgReplacement);
  console.log('Hooked Korhan Volcanic Bastion into damagePlayer!');
} else {
  console.error('ERROR: Could not find damagePlayerDmgTarget');
}

// =========================================================================
// 6. GAMEPLAY MECHANIC 2: KARAÇOR'S SHADOW STEP & 300% EXECUTE
// =========================================================================
const dashUpdateTarget = `if (player.dashTime > 0) {`;
const dashUpdateReplacement = `if (player.dashTime > 0) {
    // KARAÇOR GÖLGE ADIMI MEKANİĞİ (Düşmanların içinden geçip Ölüm İmi bırakma)
    if (player.heroId === 'karacor' || selectedHeroId === 'karacor') {
      if (enemies && enemies.length) {
        for (let ei = 0; ei < enemies.length; ei++) {
          const en = enemies[ei];
          if (Math.hypot(en.x - player.x, en.y - player.y) < player.r + en.r + 14 && !en._shadowMarked) {
            en._shadowMarked = true;
            en._shadowMarkUntil = performance.now() + 4500;
            spawnFloatText(en.x, en.y - 18, '🌑 GÖLGE İMİ', '#c084fc', 'small');
            sparks.push({ x: en.x, y: en.y, r: 3, life: 0.25, maxLife: 0.25, color: '#c084fc' });
            playSfx('skill', 0.25, 900);
          }
        }
      }
    }`;

if (content.includes(dashUpdateTarget)) {
  content = content.replace(dashUpdateTarget, dashUpdateReplacement);
  console.log('Hooked Karaçor Shadow Step into player dash!');
} else {
  console.error('ERROR: Could not find dashUpdateTarget');
}

// Hook into projectile hit for 300% execute
const projCritTarget = `if (crited) {`;
const projCritReplacement = `// KARAÇOR %300 GÖLGE İNFAZI
        if ((player.heroId === 'karacor' || selectedHeroId === 'karacor') && en._shadowMarked && performance.now() < (en._shadowMarkUntil || 0)) {
          en._shadowMarked = false;
          dealt = Math.round(dealt * 3.0);
          crited = true;
          spawnFloatText(en.x, en.y - 24, '💥 İNFAZ! -' + dealt, '#a855f7', 'big');
          playSfx('skill', 0.5, 420);
          player.dashCd = Math.round((player.dashCd || 0) * 0.5); // %50 Dash CD iadesi
          burst(en.x, en.y, '#c084fc', 16, 3.8);
        }
        if (crited) {`;

if (content.includes(projCritTarget)) {
  content = content.replace(projCritTarget, projCritReplacement);
  console.log('Hooked Karaçor 300% Execute into projectile hit!');
} else {
  console.error('ERROR: Could not find projCritTarget');
}

// Draw purple shadow mark above marked enemies in render
const enemyHpBarTarget = `const bw = Math.max(22, en.r * (en.type === 'boss' ? 2.4 : 1.8));`;
const enemyHpBarReplacement = `if (en._shadowMarked && performance.now() < (en._shadowMarkUntil || 0)) {
      ctx.save();
      ctx.fillStyle = '#c084fc';
      ctx.font = '900 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🌑 İM', en.x, cy - en.r - 22);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(en.x, cy, en.r + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    const bw = Math.max(22, en.r * (en.type === 'boss' ? 2.4 : 1.8));`;

if (content.includes(enemyHpBarTarget)) {
  content = content.replace(enemyHpBarTarget, enemyHpBarReplacement);
  console.log('Hooked shadow mark drawing above marked enemies!');
} else {
  console.error('ERROR: Could not find enemyHpBarTarget');
}

// =========================================================================
// 7. GAMEPLAY MECHANIC 3: BAMSI'S BULLET DEFLECTION PARRY (MERMİ YANSITMA)
// =========================================================================
const updateAtkSlashTarget = `player.atkSlashFx -= dt;`;
const updateAtkSlashReplacement = `player.atkSlashFx -= dt;
    // BAMSI YATAĞAN İLE MERMİ YANSITMA (PARRY) MEKANİĞİ
    if ((player.heroId === 'bamsi' || selectedHeroId === 'bamsi') && enemyProjectiles && enemyProjectiles.length) {
      const parryReach = player.r + 32;
      for (let bi = enemyProjectiles.length - 1; bi >= 0; bi--) {
        const bp = enemyProjectiles[bi];
        if (!bp._parried && Math.hypot(bp.x - player.x, bp.y - player.y) < parryReach + (bp.r || 6)) {
          bp._parried = true;
          bp.isFriendly = true; // Artık düşmanları vurur!
          bp.vx = -(bp.vx || 1) * 1.6;
          bp.vy = -(bp.vy || 1) * 1.6;
          bp.color = '#38bdf8';
          bp.dmg = Math.round(currentAutoShot().dmg * 2.2);
          spawnFloatText(player.x, player.y - 24, '⚔️ SAVUŞTURMA (PARRY)!', '#38bdf8', 'big');
          playSfx('block', 0.6, 950);
          vibrate([35, 50]);
          player.speedBoostUntil = performance.now() + 1400; // Hız patlaması
          burst(bp.x, bp.y, '#38bdf8', 12, 3.4);
        }
      }
    }`;

if (content.includes(updateAtkSlashTarget)) {
  content = content.replace(updateAtkSlashTarget, updateAtkSlashReplacement);
  console.log('Hooked Bamsı Parry into player.atkSlashFx in update()!');
} else {
  console.error('ERROR: Could not find updateAtkSlashTarget');
}

// Handle friendly deflected projectile hitting enemies in enemyProjectiles update
const enemyProjUpdateTarget = `if (Math.hypot(p.x - player.x, p.y - player.y) < player.r + p.r) {`;
const enemyProjUpdateReplacement = `if (p.isFriendly) {
      // Yansıtılmış mermi: Düşmanları arar ve biçer
      let hitEnemy = false;
      for (let ei = enemies.length - 1; ei >= 0; ei--) {
        const en = enemies[ei];
        if (Math.hypot(p.x - en.x, p.y - en.y) < en.r + p.r) {
          const dealt = takeDamage(en, p.dmg || 35, 'wind');
          punchEnemy(en, p.x, p.y, 16, true);
          spawnFloatText(en.x, en.y - 12, '💥' + dealt, '#38bdf8', 'crit');
          burst(p.x, p.y, '#38bdf8', 10, 2.8);
          hitEnemy = true;
          break;
        }
      }
      if (hitEnemy) {
        enemyProjectiles.splice(i, 1);
        continue;
      }
      continue;
    }
    if (Math.hypot(p.x - player.x, p.y - player.y) < player.r + p.r) {`;

if (content.includes(enemyProjUpdateTarget)) {
  content = content.replace(enemyProjUpdateTarget, enemyProjUpdateReplacement);
  console.log('Hooked friendly deflected projectiles damage to enemies!');
} else {
  console.error('ERROR: Could not find enemyProjUpdateTarget');
}

// Write the updated content back to index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('[Step 10 Heroes] Successfully updated index.html! New length:', content.length);
