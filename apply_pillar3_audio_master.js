const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[Pillar 3 Audio Master] Starting overhaul. Original length:', content.length);

// =========================================================================
// 1. MASTER AUDIO ARCHITECTURE: COMPRESSOR + LOWPASS + SUB-BASS + FOLEY
// =========================================================================
const oldAudioDestTarget = `function getAudioDest(ctx) {
  if (!masterBus || masterBus.context !== ctx) {
    masterBus = ctx.createGain();
    masterLowpass = ctx.createBiquadFilter();
    masterLowpass.type = 'lowpass';
    masterLowpass.frequency.setValueAtTime(20000, ctx.currentTime);
    masterLowpass.Q.setValueAtTime(0.7, ctx.currentTime);
    masterBus.connect(masterLowpass);
    masterLowpass.connect(ctx.destination);
  }
  return masterBus;
}`;

const newAudioDestReplacement = `let masterCompressor = null;

function getAudioDest(ctx) {
  if (!masterBus || masterBus.context !== ctx) {
    masterBus = ctx.createGain();
    masterLowpass = ctx.createBiquadFilter();
    masterLowpass.type = 'lowpass';
    masterLowpass.frequency.setValueAtTime(20000, ctx.currentTime);
    masterLowpass.Q.setValueAtTime(0.7, ctx.currentTime);

    // Studio-grade Master Dynamics Compressor to prevent mobile DAC clipping
    masterCompressor = ctx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-14, ctx.currentTime);
    masterCompressor.knee.setValueAtTime(20, ctx.currentTime);
    masterCompressor.ratio.setValueAtTime(8, ctx.currentTime);
    masterCompressor.attack.setValueAtTime(0.003, ctx.currentTime);
    masterCompressor.release.setValueAtTime(0.18, ctx.currentTime);

    masterBus.connect(masterLowpass);
    masterLowpass.connect(masterCompressor);
    masterCompressor.connect(ctx.destination);
  }
  return masterBus;
}`;

if (content.includes(oldAudioDestTarget)) {
  content = content.replace(oldAudioDestTarget, newAudioDestReplacement);
  console.log('Pillar 3: Upgraded getAudioDest with studio DynamicsCompressorNode!');
} else {
  console.warn('Pillar 3 Warning: Could not find old getAudioDest');
}

// =========================================================================
// 2. VISCERAL SUB-BASS, BASS DROP & HERO ATTACK FOLEY ENGINE
// =========================================================================
const oldPunchySubBassStart = `// =========================================================================
// PUNCHY STUDIO AUDIO ENGINE (SUB-BASS & FOLEY SYNTHESIS)
// =========================================================================`;

const newSubBassAndFoleyEngine = `// =========================================================================
// PUNCHY STUDIO AUDIO ENGINE (SUB-BASS & FOLEY SYNTHESIS - MASTER SUITE)
// =========================================================================
function playPunchySubBass(freq, duration, intensity, overload) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const dur = duration || 0.16;

    // Fast transient punch (frequency sweep)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(overload ? 220 : 150, t);
    filter.frequency.exponentialRampToValueAtTime(42, t + dur);

    osc.type = 'sine';
    osc.frequency.setValueAtTime((freq || 68) * 1.6, t);
    osc.frequency.exponentialRampToValueAtTime(34, t + dur);

    const v = Math.min(1.0, (intensity || 0.42) * sfxVol * 1.25);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(v, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch(e) {}
}

function playBassDrop(freq, duration, intensity) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const dur = duration || 1.1;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, t);
    filter.frequency.exponentialRampToValueAtTime(35, t + dur);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq || 92, t);
    osc.frequency.exponentialRampToValueAtTime(26, t + dur);

    const v = Math.min(1.0, (intensity || 0.65) * sfxVol);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(v, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch(e) {}
}

function playMetallicRing(freq, isParry) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);

    const mults = isParry ? [1.0, 1.414, 2.0, 3.14, 4.5] : [1.0, 2.14, 3.42];
    mults.forEach((mul, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime((freq || 1200) * mul, t);
      const v = (isParry ? 0.35 : 0.22) / (i + 1) * sfxVol;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(v, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (isParry ? 0.28 : 0.16) + i * 0.04);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + (isParry ? 0.32 : 0.22));
    });
  } catch(e) {}
}

function playTactileClick(type) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const f = ctx.createBiquadFilter();

    f.type = 'bandpass';
    f.frequency.setValueAtTime(type === 'high' ? 1400 : 750, t);
    f.Q.setValueAtTime(1.8, t);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(type === 'high' ? 620 : 340, t);
    osc.frequency.exponentialRampToValueAtTime(type === 'high' ? 240 : 110, t + 0.04);

    const v = (type === 'high' ? 0.32 : 0.28) * sfxVol;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(v, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    osc.connect(f);
    f.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.05);
  } catch(e) {}
}

// =========================================================================
// BESPOKE 8-HERO ATTACK & WEAPON FOLEY SYNTHESIS
// =========================================================================
function playHeroAttackSfx(heroId) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const h = heroId || (selectedHeroId || 'bamsi');

    if (h === 'bamsi') {
      // Çelik Yatağan rüzgar yarığı & metal tınısı
      playMetallicRing(1350, false);
      synthBlip('dash_whoosh');
    } else if (h === 'korhan') {
      // Ağır akkor volkanik pala homurtusu & magma çıtırtısı
      playPunchySubBass(54, 0.16, 0.40);
      synthBlip('elem_fire');
    } else if (h === 'karacor') {
      // Çift ruh çakramı fısıltısı & gölge vızıltısı
      synthBlip('elem_void');
      playMetallicRing(1850, false);
    } else if (h === 'ayaz') {
      // Kristal buz gürzü ağırlığı & çıtırtı
      playPunchySubBass(62, 0.14, 0.35);
      synthBlip('elem_water');
    } else if (h === 'umay') {
      // Çift şimşek hançeri yüksek voltaj zıplaması
      synthBlip('elem_storm');
      playMetallicRing(1650, false);
    } else if (h === 'kayra') {
      // Kronometre asası çark mekaniği & tıkırtı
      playTactileClick('high');
      synthBlip('pick');
    } else if (h === 'mergen') {
      // Organik yay teli fırlaması & ahşap tok vuruş
      synthBlip('elem_nature');
      playPunchySubBass(72, 0.11, 0.30);
    } else if (h === 'ulgen') {
      // Kozmik dört element pirizması arpej
      synthBlip('legendary');
    } else {
      synthBlip('dash_whoosh');
    }
  } catch(e) {}
}`;

// Replace the sub-bass section
const subBassRegex = /\/\/ =========================================================================[\s\S]*?function playMetallicRing\(freq\) \{[\s\S]*?\}\s*\}\s*catch\(e\) \{\}\s*\}/;

if (subBassRegex.test(content)) {
  content = content.replace(subBassRegex, newSubBassAndFoleyEngine);
  console.log('Pillar 3: Successfully replaced Sub-Bass and Foley engine with master 8-hero suite!');
} else {
  console.warn('Pillar 3 Warning: subBassRegex did not match');
}

// =========================================================================
// 3. ENHANCE synthBlip WITH boss_roar, close_dodge & ENRICHED BLIPS
// =========================================================================
const oldSynthBlipStart = `function synthBlip(kind) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2400;
    o.connect(f); f.connect(g); g.connect(dest);
    const vol = Math.max(0.02, sfxVol * 0.18);
    g.gain.setValueAtTime(0.0001, t);`;

const newSynthBlipStart = `function synthBlip(kind) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2400;
    o.connect(f); f.connect(g); g.connect(dest);
    const vol = Math.max(0.02, sfxVol * 0.22);
    g.gain.setValueAtTime(0.0001, t);

    // --- 0. BOSS ROAR & INTIMIDATION HORN ---
    if (kind === 'boss_roar') {
      // Dual detuned saw waves for terrifying guttural phasing
      [52, 56].forEach((rf, i) => {
        try {
          const rOsc = ctx.createOscillator();
          const rGain = ctx.createGain();
          const rFilt = ctx.createBiquadFilter();
          rOsc.type = 'sawtooth';
          rOsc.frequency.setValueAtTime(rf, t);
          rOsc.frequency.exponentialRampToValueAtTime(rf * 1.8, t + 0.35);
          rOsc.frequency.exponentialRampToValueAtTime(rf * 0.6, t + 0.95);
          rFilt.type = 'lowpass';
          rFilt.frequency.setValueAtTime(140, t);
          rFilt.frequency.exponentialRampToValueAtTime(750, t + 0.35);
          rFilt.frequency.exponentialRampToValueAtTime(90, t + 0.95);
          rFilt.Q.setValueAtTime(3.5, t);
          rGain.gain.setValueAtTime(0.0001, t);
          rGain.gain.linearRampToValueAtTime(vol * 1.8, t + 0.12);
          rGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.98);
          rOsc.connect(rFilt);
          rFilt.connect(rGain);
          rGain.connect(dest);
          rOsc.start(t);
          rOsc.stop(t + 1.0);
        } catch(_) {}
      });
      playPunchySubBass(48, 0.65, 0.75, true);
      return;
    } else if (kind === 'close_dodge') {
      // Satisfying near-miss whoosh with musical chime
      o.type = 'sine';
      o.frequency.setValueAtTime(880, t);
      o.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 0.85, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.start(t); o.stop(t + 0.15);
      return;
    }`;

if (content.includes(oldSynthBlipStart)) {
  content = content.replace(oldSynthBlipStart, newSynthBlipStart);
  console.log('Pillar 3: Enhanced synthBlip with boss_roar and close_dodge!');
} else {
  console.warn('Pillar 3 Warning: Could not find oldSynthBlipStart');
}

// =========================================================================
// 4. HOOK playHeroAttackSfx INTO firePlayerProjectile
// =========================================================================
const fireProjTarget = `player.lastAttackTime = now;
  player.comboStep = ((player.comboStep || 0) % 3) + 1;
  player.atkSlashFx = 16;`;

const fireProjReplacement = `player.lastAttackTime = now;
  player.comboStep = ((player.comboStep || 0) % 3) + 1;
  player.atkSlashFx = 16;
  if (typeof playHeroAttackSfx === 'function') {
    playHeroAttackSfx(selectedHeroId);
  }`;

if (content.includes(fireProjTarget) && !content.includes('playHeroAttackSfx(selectedHeroId)')) {
  content = content.replace(fireProjTarget, fireProjReplacement);
  console.log('Pillar 3: Hooked playHeroAttackSfx into firePlayerProjectile!');
}

// =========================================================================
// 5. HOOK boss_roar AND playBassDrop INTO spawnWave BOSS SECTION
// =========================================================================
const bossWaveTarget = `if (isBossWave) {
    const cfg = getBiomeBossConfig(biome.key, wave);`;

const bossWaveReplacement = `if (isBossWave) {
    if (typeof synthBlip === 'function') synthBlip('boss_roar');
    if (typeof playBassDrop === 'function') playBassDrop(80, 1.2, 0.7);
    const cfg = getBiomeBossConfig(biome.key, wave);`;

if (content.includes(bossWaveTarget) && !content.includes("synthBlip('boss_roar')")) {
  content = content.replace(bossWaveTarget, bossWaveReplacement);
  console.log('Pillar 3: Hooked boss_roar and playBassDrop into spawnWave!');
}

// =========================================================================
// 6. LOW-HP DYNAMIC AUDIO MUFFLE (LOWPASS FILTERING)
// =========================================================================
const lowHpTarget = `// LOW HP CRITICAL HEARTBEAT AUDIO PULSE (< 25% HP Panic)
  if (player && player.hp > 0 && player.maxHp > 0) {
    const hpRatio = player.hp / player.maxHp;
    if (hpRatio <= 0.25) {
      if (!window._lastLowHpThump || now - window._lastLowHpThump > 1050) {
        window._lastLowHpThump = now;
        synthBlip('heartbeat');
        if (typeof vibOn !== 'undefined' && vibOn) vibrate([20, 30]);
      }
    }
  }`;

const lowHpReplacement = `// LOW HP CRITICAL HEARTBEAT AUDIO PULSE & ADRENALINE MUFFLE
  if (player && player.hp > 0 && player.maxHp > 0) {
    const hpRatio = player.hp / player.maxHp;
    const ctx = audioCtx();
    if (hpRatio <= 0.25) {
      if (masterLowpass && ctx) {
        masterLowpass.frequency.setTargetAtTime(1100, ctx.currentTime, 0.15);
      }
      if (!window._lastLowHpThump || now - window._lastLowHpThump > 1050) {
        window._lastLowHpThump = now;
        synthBlip('heartbeat');
        if (typeof vibOn !== 'undefined' && vibOn) vibrate([20, 30]);
      }
    } else {
      if (masterLowpass && ctx && masterLowpass.frequency.value < 18000) {
        masterLowpass.frequency.setTargetAtTime(20000, ctx.currentTime, 0.25);
      }
    }
  }`;

if (content.includes(lowHpTarget)) {
  content = content.replace(lowHpTarget, lowHpReplacement);
  console.log('Pillar 3: Added dynamic Low-HP Audio Muffling!');
}

// =========================================================================
// 7. HOOK TACTILE CLICKS INTO UI BUTTONS
// =========================================================================
const playSfxUiTarget = `function playSfx(name, vol, gap) {
  if (!sfxOn || sfxVol <= 0.02) return;
  unlockSfx();`;

const playSfxUiReplacement = `function playSfx(name, vol, gap) {
  if (!sfxOn || sfxVol <= 0.02) return;
  unlockSfx();
  // Tactile instant fallback synthesis for UI & ticks
  if (name === 'tick' || name === 'ui') {
    if (typeof playTactileClick === 'function') playTactileClick(name === 'ui' ? 'high' : 'low');
  }`;

if (content.includes(playSfxUiTarget) && !content.includes('playTactileClick')) {
  content = content.replace(playSfxUiTarget, playSfxUiReplacement);
  console.log('Pillar 3: Hooked playTactileClick into playSfx for UI sounds!');
}

// Write the updated file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('[Pillar 3 Audio Master] Completed successfully. New length:', content.length);
