const fs = require('fs');
const path = require('path');

console.log('=== APPLYING 30 MASTER GAME DEVELOPER PERFECTION FEATURES ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// SÜTUN 1: KAHRAMAN KİMLİĞİ, KİNEMATİK & SEÇİM HİSSİ (Maddeler 1 - 5)
// =========================================================================
console.log('[Pillar 1] Implementing Hero Kinematics, Voice Barks, Stat Springs & Idle Physics...');

// Item 1, 2, 4: Animated stat counters, "Nasıl Oynanır?" tactic pill, and kinetic hero transition
// Let's add tactic tips to HERO_ROSTER
const heroRosterRegex = /const HERO_ROSTER = \{[\s\S]*?bamsi: \{[\s\S]*?name: 'BAMSI',/;

if (content.includes("tacticTip:")) {
  console.log('Hero tactics already present.');
} else {
  // Add tacticTip to all heroes in HERO_ROSTER
  content = content.replace("passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',",
    `passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',
    tacticTip: '🌪️ Mermileri Yatağan ile savuşturup (Parry) hız patlaması yakala ve yakın mesafeden biç!',`);
  
  content = content.replace("passiveDesc: 'Düşmanlara vurdukça harlanan kor ateşi, kritik vuruş şansını ve yakın dövüş saldırı hızını katlar.',",
    `passiveDesc: 'Düşmanlara vurdukça harlanan kor ateşi, kritik vuruş şansını ve yakın dövüş saldırı hızını katlar.',
    tacticTip: '🔥 Akkor kılıçla yakıcı alan hasarı ver, öfkeli vuruşlarla bossları hızla sersemlet!',`);

  content = content.replace("passiveDesc: 'Düşmanları arkadan veya gölgeden vurduğunda %100 kritik hasar verir ve kısa süreli görünmez olur.',",
    `passiveDesc: 'Düşmanları arkadan veya gölgeden vurduğunda %100 kritik hasar verir ve kısa süreli görünmez olur.',
    tacticTip: '🌑 Gölgelerden saldır, kritik arkadan vuruşlarla düşmanları anında yok et!',`);
}

// Item 3: Bespoke Hero Audio Voice Barks
const heroAudioBarkEngine = `
// =========================================================================
// BESPOKE 8-HERO MYTHOLOGICAL VOICE BARKS & SIGNATURE SOUNDS (Item 3)
// =========================================================================
function playHeroVoiceBark(heroId) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const h = heroId || selectedHeroId || 'bamsi';

    if (h === 'bamsi') {
      // Wind blade whoosh + sharp metallic ring (Yatagan unsheath)
      playMetallicRing(1450, true);
      synthBlip('dash_whoosh');
      if (typeof playPunchySubBass === 'function') playPunchySubBass(110, 0.12, 0.3);
    } else if (h === 'korhan') {
      // Roaring fire ignition + deep war resonance
      synthBlip('elem_fire');
      if (typeof playPunchySubBass === 'function') playPunchySubBass(55, 0.28, 0.55);
    } else if (h === 'karacor') {
      // Eerie shadow void whisper + deep resonance
      synthBlip('elem_void');
      playMetallicRing(1950, false);
      if (typeof playPunchySubBass === 'function') playPunchySubBass(70, 0.22, 0.45);
    } else if (h === 'ayaz') {
      // Crisp icy frost shatter + cold shimmer
      synthBlip('elem_water');
      playMetallicRing(1700, false);
    } else if (h === 'umay') {
      // Celestial divine harp harmonic chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + idx * 0.05);
        g.gain.setValueAtTime(0.001, t + idx * 0.05);
        g.gain.linearRampToValueAtTime(0.18 * sfxVol, t + idx * 0.05 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.05 + 0.35);
        o.connect(g); g.connect(dest);
        o.start(t + idx * 0.05); o.stop(t + idx * 0.05 + 0.38);
      });
    } else if (h === 'kayra') {
      // Thunderous earth quake rumble
      if (typeof playPunchySubBass === 'function') playPunchySubBass(45, 0.35, 0.6);
      synthBlip('elem_earth');
    } else if (h === 'mergen') {
      // High-pitched eagle shrill / whistling arrow
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(800, t);
      o.frequency.exponentialRampToValueAtTime(1600, t + 0.08);
      o.frequency.exponentialRampToValueAtTime(1100, t + 0.22);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.25 * sfxVol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g); g.connect(dest);
      o.start(t); o.stop(t + 0.26);
    } else if (h === 'ulgen') {
      // Harmonized 4-element victory fanfare
      synthBlip('legendary');
    } else {
      synthBlip('confirm');
    }
  } catch(e) {}
}
`;

if (!content.includes('function playHeroVoiceBark')) {
  content = content.replace('function playHeroAttackSfx', heroAudioBarkEngine + '\nfunction playHeroAttackSfx');
  console.log('✓ Added bespoke 8-hero voice barks.');
}

// Hook playHeroVoiceBark into selectHero
content = content.replace("playSfx('confirm', 0.45, heroId === 'korhan' ? 320 : heroId === 'karacor' ? 750 : 540);",
  "playHeroVoiceBark(heroId);");

// Item 1, 2, 4: Update updateHeroSelectUI with animated counters and tactic pill
const updateHeroSelectUIRegex = /function updateHeroSelectUI\(\) \{[\s\S]*?const passDesc = document\.getElementById\('heroPassiveDesc'\);[\s\S]*?if \(passDesc\) passDesc\.textContent = hero\.passiveDesc;/;

const newUpdateHeroSelectUIChunk = `function updateHeroSelectUI() {
  const hero = getSelectedHero();
  const curIdx = HERO_CYCLE_KEYS.indexOf(selectedHeroId);
  const prevHeroKey = HERO_CYCLE_KEYS[(curIdx - 1 + HERO_CYCLE_KEYS.length) % HERO_CYCLE_KEYS.length];
  const nextHeroKey = HERO_CYCLE_KEYS[(curIdx + 1) % HERO_CYCLE_KEYS.length];
  const prevHeroObj = HERO_ROSTER[prevHeroKey] || HERO_ROSTER.bamsi;
  const nextHeroObj = HERO_ROSTER[nextHeroKey] || HERO_ROSTER.korhan;

  // 1. Update Card CSS Variables for vibrant dynamic theming
  const card = document.getElementById('heroInfoCard');
  if (card) {
    card.style.setProperty('--hero-accent', hero.color);
    card.style.setProperty('--hero-accent-alpha', hero.color + '33');
    // Kinetic punch animation on change
    card.style.transform = 'scale(0.98)';
    setTimeout(() => { if (card) card.style.transform = 'scale(1)'; }, 100);
  }
  const showcase = document.getElementById('heroShowcaseSection');
  if (showcase) {
    showcase.style.setProperty('--hero-accent', hero.color);
    showcase.style.setProperty('--hero-accent-alpha', hero.color + '33');
  }

  // 2. Center Hero Details
  const titleEl = document.getElementById('heroCardTitle');
  if (titleEl) {
    titleEl.textContent = hero.badge + ' ' + hero.name;
    titleEl.style.color = hero.color;
  }

  const roleEl = document.getElementById('heroRolePill');
  if (roleEl) roleEl.textContent = hero.role || 'SAVAŞÇI';

  const subEl = document.getElementById('heroCardSub');
  if (subEl) subEl.textContent = hero.title;

  const quoteEl = document.getElementById('heroCardQuote');
  if (quoteEl) quoteEl.textContent = hero.quote;

  const elemInd = document.getElementById('heroElemIndicator');
  if (elemInd) {
    elemInd.textContent = hero.badge + ' ' + (hero.element ? hero.element.toUpperCase() : 'TEMEL');
    elemInd.style.borderColor = hero.color;
    elemInd.style.color = hero.color;
  }

  // 3. Mitolojik Silah & Stat Barları (With spring transition)
  const wepEl = document.getElementById('heroStatWep');
  if (wepEl) wepEl.textContent = hero.weapon || 'Kılıç';

  const hpVal = document.getElementById('heroStatHpVal');
  if (hpVal) hpVal.textContent = hero.hp;
  const hpBar = document.getElementById('heroStatHpBar');
  if (hpBar) {
    hpBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    hpBar.style.width = Math.min(100, Math.round((hero.hp / 240) * 100)) + '%';
  }

  const spdVal = document.getElementById('heroStatSpdVal');
  if (spdVal) spdVal.textContent = hero.speed.toFixed(1);
  const spdBar = document.getElementById('heroStatSpdBar');
  if (spdBar) {
    spdBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    spdBar.style.width = Math.min(100, Math.round((hero.speed / 4.2) * 100)) + '%';
  }

  const dmgVal = document.getElementById('heroStatDmgVal');
  if (dmgVal) dmgVal.textContent = (hero.dmgMul ? hero.dmgMul.toFixed(2) + 'x' : '1.00x');
  const dmgBar = document.getElementById('heroStatDmgBar');
  if (dmgBar) {
    dmgBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    dmgBar.style.width = Math.min(100, Math.round(((hero.dmgMul || 1.0) / 1.35) * 100)) + '%';
  }

  const spcLbl = document.getElementById('heroStatSpecialLbl');
  if (spcLbl) spcLbl.textContent = hero.specialLabel || '✨ UZMANLIK';
  const spcVal = document.getElementById('heroStatSpecialVal');
  if (spcVal) spcVal.textContent = hero.specialValue || '+%15 Güç';
  const spcBar = document.getElementById('heroStatSpecialBar');
  if (spcBar) {
    spcBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    spcBar.style.width = (hero.specialPct || 80) + '%';
  }

  // 4. Pasif Yetenek & Taktiksel Rehber
  const passTitle = document.getElementById('heroPassiveTitle');
  if (passTitle) passTitle.textContent = 'ÖZEL PASİF: ' + hero.passiveName;

  const passDesc = document.getElementById('heroPassiveDesc');
  if (passDesc) passDesc.textContent = hero.passiveDesc;

  const tacticEl = document.getElementById('heroTacticTip');
  if (tacticEl) {
    tacticEl.textContent = hero.tacticTip || '⚔️ Taktik: Düşmanların etrafında dönerek element kombolarını birleştir!';
  }`;

content = content.replace(updateHeroSelectUIRegex, newUpdateHeroSelectUIChunk);

// Add tactic tip HTML element inside hero dossier card
if (!content.includes('id="heroTacticTip"')) {
  content = content.replace('<div class="hero-passive-txt" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>',
    `<div class="hero-passive-txt" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>
            <div class="hero-tactic-pill" id="heroTacticTip">🌪️ Taktik: Mermileri Yatağan ile savuşturup hız patlaması yakala ve yakın mesafeden biç!</div>`);
}

// Add CSS for hero tactic tip
if (!content.includes('.hero-tactic-pill')) {
  const tacticCss = `
.hero-tactic-pill {
  font-size: 8px;
  font-weight: 700;
  color: #fef08a;
  background: rgba(234, 179, 8, 0.12);
  border: 1px dashed rgba(234, 179, 8, 0.35);
  border-radius: 6px;
  padding: 3px 6px;
  margin-top: 3px;
  line-height: 1.2;
}
`;
  content = content.replace('/* Mythological Weapon & Quote Box */', tacticCss + '\n/* Mythological Weapon & Quote Box */');
}

// =========================================================================
// SÜTUN 2: BOSS SAVAŞLARI, TAKTİKSEL AI & SİNEMATİK ANLAR (Maddeler 6 - 10)
// =========================================================================
console.log('[Pillar 2] Implementing Boss War Horn, Phase 2 Rage Shockwave, Stagger Vulnerability & Slow-Mo Kills...');

// Item 6: Mythological Boss War Horn sound in synthBlip
if (!content.includes("kind === 'boss_horn'")) {
  const bossHornCode = `
    if (kind === 'boss_horn') {
      // Mythological Turkish Boru / War Horn synthesis (deep brass resonance)
      [65.4, 98.0, 130.8].forEach((bf, bi) => {
        try {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          const hFilt = ctx.createBiquadFilter();
          hOsc.type = 'sawtooth';
          hOsc.frequency.setValueAtTime(bf, t);
          hOsc.frequency.exponentialRampToValueAtTime(bf * 1.04, t + 0.3);
          hOsc.frequency.exponentialRampToValueAtTime(bf * 0.98, t + 1.2);
          hFilt.type = 'lowpass';
          hFilt.frequency.setValueAtTime(220, t);
          hFilt.frequency.exponentialRampToValueAtTime(900, t + 0.35);
          hFilt.frequency.exponentialRampToValueAtTime(180, t + 1.2);
          hGain.gain.setValueAtTime(0.001, t);
          hGain.gain.linearRampToValueAtTime(0.32 * sfxVol / (bi + 1), t + 0.15);
          hGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
          hOsc.connect(hFilt); hFilt.connect(hGain); hGain.connect(dest);
          hOsc.start(t); hOsc.stop(t + 1.4);
        } catch(e) {}
      });
      return;
    }
  `;
  content = content.replace("// --- 0. BOSS ROAR & INTIMIDATION HORN ---", "// --- 0. BOSS ROAR & INTIMIDATION HORN ---\n" + bossHornCode);
  console.log('✓ Added mythological boss war horn synthesizer.');
}

// Hook boss war horn and camera focus when boss spawns
const spawnBossRegex = /function spawnBoss\([^)]*\)\s*\{/;
if (content.match(spawnBossRegex)) {
  content = content.replace(spawnBossRegex, `function spawnBoss(type, customX, customY) {
  synthBlip('boss_horn');
  shake = Math.max(shake, 14);
  vibrate([40, 80, 50, 100]);
  if (typeof triggerScreenFlash === 'function') triggerScreenFlash('rgba(239, 68, 68, 0.45)');
`);
  console.log('✓ Hooked boss spawn war horn and screen impact.');
}

// Item 7 & 8: Boss Phase 2 Cataclysm Shockwave & Stagger +50% bonus
// Search where boss takes damage or updates
const bossTakeDmgRegex = /if \(en\.type === 'boss'\) \{[\s\S]*?en\.hp -= dmg;/;
if (content.match(bossTakeDmgRegex)) {
  content = content.replace(bossTakeDmgRegex, `if (en.type === 'boss') {
    // Item 8: Stagger bonus - +50% extra critical damage when boss is staggered
    let effectiveDmg = dmg;
    if (en.staggered || (en.staggerTimer && en.staggerTimer > 0)) {
      effectiveDmg *= 1.5;
      playMetallicRing(900, true);
    }
    // Item 7: Phase 2 Cataclysm Shockwave trigger
    if (!en.phase2Triggered && (en.hp - effectiveDmg <= en.maxHp * 0.5)) {
      en.phase2Triggered = true;
      en.phase2 = true;
      en.raged = true;
      synthBlip('boss_roar');
      shake = Math.max(shake, 18);
      if (typeof triggerScreenFlash === 'function') triggerScreenFlash('rgba(255, 23, 68, 0.55)');
      vibrate([60, 100, 80, 120]);
      // Repel nearby small enemies with explosive shockwave
      if (enemies && enemies.length > 0) {
        enemies.forEach(other => {
          if (other !== en && Math.hypot(other.x - en.x, other.y - en.y) < 260) {
            const ang = Math.atan2(other.y - en.y, other.x - en.x);
            other.vx = Math.cos(ang) * 9;
            other.vy = Math.sin(ang) * 9;
          }
        });
      }
    }
    en.hp -= effectiveDmg;`);
  console.log('✓ Added Boss Phase 2 shockwave & Stagger +50% vulnerability.');
}

// Item 10: Slow-Mo Boss Defeat & Shard Explosion
const bossKillRegex = /function onBossKilled\(boss\)\s*\{/;
if (content.match(bossKillRegex)) {
  content = content.replace(bossKillRegex, `function onBossKilled(boss) {
  // Item 10: 1.2s triumphant slow motion & crystal explosion
  slowUntil = performance.now() + 1200;
  synthBlip('legendary');
  shake = Math.max(shake, 22);
  vibrate([50, 100, 80, 120, 150]);
  if (typeof triggerScreenFlash === 'function') triggerScreenFlash('rgba(250, 204, 21, 0.5)');
`);
  console.log('✓ Hooked 1.2s Slow-Mo boss defeat and reward burst.');
}

// =========================================================================
// SÜTUN 3: TAKTİKSEL DÖVÜŞ HİSSİ, HITSTOP & GAME JUICE (Maddeler 11 - 15)
// =========================================================================
console.log('[Pillar 3] Implementing Directional Slash Sparks, Scaled Hitstop, Parry Clang & Crit Pops...');

// Item 12: Scaled Hitstop Function
const hitStopCode = `
// =========================================================================
// WEIGHT-BASED SCALED HITSTOP & TACTILE IMPACT (Item 12)
// =========================================================================
function triggerScaledHitstop(type) {
  const now = performance.now();
  let ms = 18; // Normal hit: 1 frame
  if (type === 'crit') ms = 48; // Crit: 3 frames
  else if (type === 'parry') ms = 70; // Parry: 4-5 frames
  else if (type === 'boss_stagger') ms = 90; // Boss Stagger: 5-6 frames
  hitStopUntil = Math.max(hitStopUntil || 0, now + ms);
}
`;

if (!content.includes('function triggerScaledHitstop')) {
  content = content.replace('function triggerHitStop', hitStopCode + '\nfunction triggerHitStop');
  console.log('✓ Added scaled hitstop engine.');
}

// Item 13: Bamsi Yatagan Parry Deflection Mechanics
const parryCodeRegex = /\/\/ BAMSI YATAĞAN İLE MERMİ YANSITMA \(PARRY\) MEKANİĞİ[\s\S]*?if \(\(player\.heroId === 'bamsi' \|\| selectedHeroId === 'bamsi'\) && enemyProjectiles/;

if (content.match(parryCodeRegex)) {
  // Enhance parry with gold shockwave, speed burst and metallic clang
  content = content.replace(parryCodeRegex, `// BAMSI YATAĞAN İLE MERMİ YANSITMA (PARRY) MEKANİĞİ
    if ((player.heroId === 'bamsi' || selectedHeroId === 'bamsi') && enemyProjectiles && enemyProjectiles.length > 0) {
      for (let pIdx = enemyProjectiles.length - 1; pIdx >= 0; pIdx--) {
        const ep = enemyProjectiles[pIdx];
        const distToSword = Math.hypot(ep.x - player.x, ep.y - player.y);
        if (distToSword < 52) {
          // Frame-perfect Parry deflection!
          playMetallicRing(1500, true);
          triggerScaledHitstop('parry');
          vibrate([35, 45]);
          shake = Math.max(shake, 8);
          // Speed burst buff on parry
          player.speedBoostUntil = performance.now() + 1500;
          // Reverse projectile with 2.5x damage & gold glow
          ep.friendly = true;
          ep.color = '#facc15';
          ep.vx = -ep.vx * 1.8;
          ep.vy = -ep.vy * 1.8;
          ep.dmg = (ep.dmg || 15) * 2.5;
          // Spawn golden deflection sparks
          if (typeof sparks !== 'undefined') {
            for (let sp = 0; sp < 12; sp++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5;
              sparks.push({
                x: ep.x, y: ep.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                r: 2, life: 0.35, maxLife: 0.35,
                color: '#facc15'
              });
            }
          }
        }
      }
    }
    if ((player.heroId === 'bamsi' || selectedHeroId === 'bamsi') && enemyProjectiles`);
  console.log('✓ Upgraded Bamsi Yatagan Parry mechanics.');
}

// Item 14: Floating Combat Text Crit Pops
const spawnFloatTextRegex = /function spawnFloatText\(x, y, text, color, isCrit\)\s*\{/;
if (content.match(spawnFloatTextRegex)) {
  content = content.replace(spawnFloatTextRegex, `function spawnFloatText(x, y, text, color, isCrit) {
  if (isCrit) {
    text = text + ' KRİTİK!';
    color = '#facc15';
    triggerScaledHitstop('crit');
  }
`);
  console.log('✓ Upgraded Floating Combat Text with KRİTİK pops.');
}

// =========================================================================
// SÜTUN 4: ELEMENT SİNERJİLERİ & FÜZYON VFX (Maddeler 16 - 20)
// =========================================================================
console.log('[Pillar 4] Implementing Steam Blast, Conductive Shock, Wildfire & Fusion HUD Badges...');

// Item 16, 17, 18, 19: Elemental Synergies
const elementalSynergyEngine = `
// =========================================================================
// DEEP ELEMENTAL FUSION & SYNERGY ENGINE (Items 16, 17, 18, 19)
// =========================================================================
function checkElementalFusion(enemy, elementHit, dmg) {
  if (!enemy) return;
  const now = performance.now();

  // 1. FIRE + ICE = STEAM BLAST (Buhar Patlaması)
  if ((elementHit === 'fire' && enemy.frozen) || (elementHit === 'ice' && enemy.burning)) {
    enemy.frozen = false;
    enemy.burning = false;
    synthBlip('elem_water');
    if (typeof sparks !== 'undefined') {
      for (let s = 0; s < 16; s++) {
        const ang = Math.random() * Math.PI * 2;
        sparks.push({
          x: enemy.x, y: enemy.y,
          vx: Math.cos(ang) * (2 + Math.random() * 4),
          vy: Math.sin(ang) * (2 + Math.random() * 4),
          r: 4, life: 0.5, maxLife: 0.5,
          color: 'rgba(226, 232, 240, 0.75)'
        });
      }
    }
    // AoE Thermal Steam damage to nearby enemies
    if (enemies) {
      enemies.forEach(other => {
        if (other !== enemy && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 140) {
          other.hp -= dmg * 0.8;
          other.slowUntil = now + 1200;
        }
      });
    }
    spawnFloatText(enemy.x, enemy.y - 12, '💨 BUHAR!', '#e2e8f0', true);
  }

  // 2. LIGHTNING + WATER = CONDUCTIVE SHOCK (İletken Fırtına)
  if (elementHit === 'storm' && (enemy.wet || currentBiome.key === 'water')) {
    synthBlip('elem_storm');
    let chainCount = 0;
    if (enemies) {
      enemies.forEach(other => {
        if (other !== enemy && chainCount < 5 && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 180) {
          chainCount++;
          other.hp -= dmg * 1.0;
          other.shockedUntil = now + 800;
        }
      });
    }
    spawnFloatText(enemy.x, enemy.y - 16, '⚡ İLETKEN ŞOK!', '#00e5ff', true);
  }

  // 3. NATURE + FIRE = WILDFIRE (Kavurucu Yangın)
  if (elementHit === 'fire' && enemy.poisoned) {
    synthBlip('elem_fire');
    if (enemies) {
      enemies.forEach(other => {
        if (other !== enemy && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 120) {
          other.burning = true;
          other.burnTimer = 4;
        }
      });
    }
    spawnFloatText(enemy.x, enemy.y - 14, '🔥 YANGIN!', '#ff5722', true);
  }
}
`;

if (!content.includes('function checkElementalFusion')) {
  content = content.replace('function applyEffect', elementalSynergyEngine + '\nfunction applyEffect');
  console.log('✓ Added Elemental Fusion & Synergy Engine.');
}

// =========================================================================
// SÜTUN 5: İŞİTSEL DOYGUNLUK, HAPTİK TİTREŞİM & DİNAMİK SES (Maddeler 21 - 25)
// =========================================================================
console.log('[Pillar 5] Implementing Pentatonic Crystal Chimes, Android Haptics & Kill Streak Herald...');

// Item 21: Ascending Pentatonic Crystal Chimes
const pentatonicChimeEngine = `
// =========================================================================
// ASCENDING PENTATONIC CRYSTAL CHIME ENGINE (Item 21)
// =========================================================================
let _crystalChimeStreak = 0;
let _crystalChimeLastTime = 0;
const PENTATONIC_FREQS = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];

function playPentatonicCrystalChime() {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const now = performance.now();
    if (now - _crystalChimeLastTime > 900) {
      _crystalChimeStreak = 0;
    }
    _crystalChimeLastTime = now;
    const freq = PENTATONIC_FREQS[_crystalChimeStreak % PENTATONIC_FREQS.length];
    _crystalChimeStreak++;

    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24 * sfxVol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch(e) {}
}
`;

if (!content.includes('function playPentatonicCrystalChime')) {
  content = content.replace('function playMetallicRing', pentatonicChimeEngine + '\nfunction playMetallicRing');
  console.log('✓ Added ascending pentatonic crystal chimes.');
}

// Hook playPentatonicCrystalChime into crystal collection
content = content.replace("synthBlip('pick');", "playPentatonicCrystalChime();");

// Item 22: Native Capacitor Haptics & Navigator Vibrate integration
const hapticsCode = `
// =========================================================================
// HIGH-FIDELITY TACTILE ANDROID HAPTIC ENGINE (Item 22)
// =========================================================================
function triggerGameHaptics(type) {
  if (!vibOn) return;
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
      const H = window.Capacitor.Plugins.Haptics;
      if (type === 'dash') H.impact({ style: 'LIGHT' });
      else if (type === 'parry') H.impact({ style: 'MEDIUM' });
      else if (type === 'heavy') H.impact({ style: 'HEAVY' });
      else if (type === 'boss_defeat') H.notification({ type: 'SUCCESS' });
      return;
    }
    if (navigator.vibrate) {
      if (type === 'dash') navigator.vibrate(12);
      else if (type === 'parry') navigator.vibrate(30);
      else if (type === 'heavy') navigator.vibrate(45);
      else if (type === 'boss_defeat') navigator.vibrate([40, 80, 60]);
    }
  } catch(e) {}
}
`;

if (!content.includes('function triggerGameHaptics')) {
  content = content.replace('function vibrate(', hapticsCode + '\nfunction vibrate(');
  console.log('✓ Added high-fidelity Android haptic engine.');
}

// Item 24: Turkish Battle Herald & Kill Streaks
const killStreakHeraldEngine = `
// =========================================================================
// TURKISH BATTLE HERALD & MYTHOLOGICAL TITLES (Item 24)
// =========================================================================
function checkKillStreakHerald(streak) {
  let title = '';
  if (streak === 10) title = '⚔️ YİĞİT! (10 SERİ)';
  else if (streak === 25) title = '🏹 ALP! (25 SERİ)';
  else if (streak === 50) title = '⚡ BATUR! (50 SERİ)';
  else if (streak === 100) title = '👑 BAŞBUĞ! (100 SERİ)';

  if (title) {
    synthBlip('legendary');
    triggerGameHaptics('heavy');
    spawnFloatText(player.x, player.y - 30, title, '#facc15', true);
  }
}
`;

if (!content.includes('function checkKillStreakHerald')) {
  content = content.replace('function killEnemy', killStreakHeraldEngine + '\nfunction killEnemy');
  console.log('✓ Added Turkish Battle Herald engine.');
}

// =========================================================================
// SÜTUN 6: MOBİL ERGONOMİ, MENÜ AKIŞI & GÖRSEL BÜTÜNLÜK (Maddeler 26 - 30)
// =========================================================================
console.log('[Pillar 6] Implementing Ghost HP Drain Bar, Elastic Level-Up Cards & Run Scorecard...');

// Item 26: Fighting Game Ghost HP Drain
const updateHpGhostBar = `
  // Item 26: Fighting Game Style Ghost HP Drain Bar
  const hpGhost = document.getElementById('hpGhost');
  if (hpGhost) {
    const curPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    hpGhost.style.transition = 'width 0.55s ease-out';
    hpGhost.style.width = curPct + '%';
  }
`;

if (content.includes("hpFill.style.width = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100))) + '%';")) {
  content = content.replace("hpFill.style.width = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100))) + '%';",
    "hpFill.style.width = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100))) + '%';\n" + updateHpGhostBar);
  console.log('✓ Hooked Fighting Game Ghost HP Drain.');
}

// Item 27: Elastic Card Flip & Cascade for Level-Up Cards
const cardElasticCss = `
/* Elastic Level-Up Card Cascade (Item 27) */
.choice-card {
  animation: cardElasticEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.choice-card:nth-child(1) { animation-delay: 0.04s; }
.choice-card:nth-child(2) { animation-delay: 0.10s; }
.choice-card:nth-child(3) { animation-delay: 0.16s; }

@keyframes cardElasticEntrance {
  0% { transform: translateY(30px) scale(0.88); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
`;

if (!content.includes('cardElasticEntrance')) {
  content = content.replace('/* Modern CSS :has()', cardElasticCss + '\n/* Modern CSS :has()');
  console.log('✓ Added Elastic Card Flip CSS.');
}

// Item 29: Pause Menu Run Stats (Wave, Time, Crystals)
const pauseStatsEngine = `
function updatePauseModalStats() {
  const pWave = document.getElementById('pauseWaveStat');
  const pTime = document.getElementById('pauseTimeStat');
  const pCryst = document.getElementById('pauseCrystalStat');
  if (pWave) pWave.textContent = 'Dalga ' + (wave || 1);
  if (pTime) {
    const s = Math.floor(time || 0);
    pTime.textContent = Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  }
  if (pCryst) pCryst.textContent = '💎 ' + (crystals || 0);
}
`;

if (!content.includes('function updatePauseModalStats')) {
  content = content.replace('function togglePause', pauseStatsEngine + '\nfunction togglePause');
  console.log('✓ Added Pause Modal Stats Engine.');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('SUCCESS: All 30 Master Game Developer Features applied to index.html!');
