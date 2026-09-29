const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. AUDIO BUS & MASTER LOW-PASS FILTER DEFINITION
const oldAudioCtx = `let AC = null;
let acResuming = false;
function audioCtx() {
  if (!AC) {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) AC = new C();
    } catch (e) {}
  }
  if (AC && (AC.state === 'suspended' || AC.state === 'interrupted') && !acResuming) {
    acResuming = true;
    AC.resume().then(() => { acResuming = false; }).catch(() => { acResuming = false; });
  }
  return AC;
}`;

const newAudioCtx = `let AC = null;
let acResuming = false;
let masterBus = null;
let masterLowpass = null;

function audioCtx() {
  if (!AC) {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) AC = new C();
    } catch (e) {}
  }
  if (AC && (AC.state === 'suspended' || AC.state === 'interrupted') && !acResuming) {
    acResuming = true;
    AC.resume().then(() => { acResuming = false; }).catch(() => { acResuming = false; });
  }
  return AC;
}

function getAudioDest(ctx) {
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
}

// Per-element hit audio throttle for polyphonic clarity
const elemSfxLast = {};
function playElemHit(el) {
  if (!el) return;
  const now = performance.now();
  const last = elemSfxLast[el] || 0;
  if (now - last < 55) return;
  elemSfxLast[el] = now;
  synthBlip('elem_' + el);
}`;

if (html.includes(oldAudioCtx)) {
  html = html.replace(oldAudioCtx, newAudioCtx);
  console.log('1. Successfully patched audioCtx with masterBus, masterLowpass, and playElemHit!');
} else {
  console.log('Warning: oldAudioCtx not found!');
}

// 2. SYNTHBGM UPDATE WITH BOSS PHASE 2 PERCUSSION AND LOW-HP MUFFLE
const oldSynthBgm = `// --- 100% Offline Procedural Dynamic Synth Battle Soundtrack ---
const synthBgm = {
  step: 0,
  nextBeatTime: 0,
  chordIdx: 0,
  chords: [
    [55, 110, 164.81],
    [65.41, 130.81, 196],
    [73.42, 146.83, 220],
    [82.41, 164.81, 246.94]
  ],
  scale: [220, 261.63, 293.66, 329.63, 392, 440, 523.25],
  update(nowMs) {
    if (!running || paused || menuOpen || !sfxOn || sfxVol <= 0.02) return;
    const ctx = audioCtx();
    if (!ctx || ctx.state !== 'running') return;
    const curTime = ctx.currentTime;
    if (curTime < this.nextBeatTime - 0.04) return;

    const currentBoss = enemies && enemies.find(en => en.type === 'boss');
    const isBoss = !!currentBoss;
    const isBossPhase2 = isBoss && (currentBoss.phase === 2 || currentBoss.isPhase2 || (currentBoss.hp / currentBoss.maxHp) <= 0.5);
    const isLowHp = player && player.hp > 0 && player.hp <= player.maxHp * 0.25;
    // Dynamic Phase 2 Boss Music Rush (158 BPM aggressive tempo)
    const baseBpm = isBossPhase2 ? 158 : (isBoss ? 134 : (isLowHp ? 146 : 112));
    const stepDur = 60 / baseBpm / 2;

    if (this.nextBeatTime <= curTime) {
      this.nextBeatTime = curTime + 0.03;
    }

    const t = this.nextBeatTime;
    const step16 = this.step % 16;
    const masterVol = Math.min(0.20, sfxVol * (isBoss ? 0.22 : 0.16));

    // 1. Heavy Synth Sub-Kick
    if (step16 === 0 || step16 === 8 || (isBoss && (step16 === 4 || step16 === 12 || step16 === 14)) || (isLowHp && (step16 % 4 === 0))) {
      try {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = 'sine';
        const startFreq = isLowHp ? 95 : 120;
        kickOsc.frequency.setValueAtTime(startFreq, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.16);
        kickGain.gain.setValueAtTime(masterVol * 1.4, t);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.24);
      } catch (e) {}
    }

    // 2. Dark Atmospheric Bass Drone
    if (step16 === 0 || step16 === 8) {
      if (step16 === 0) this.chordIdx = (this.chordIdx + 1) % this.chords.length;
      try {
        const chord = this.chords[this.chordIdx];
        const bassOsc = ctx.createOscillator();
        const bassFilt = ctx.createBiquadFilter();
        const bassGain = ctx.createGain();
        bassOsc.type = isBoss ? 'sawtooth' : 'triangle';
        bassOsc.frequency.setValueAtTime(chord[0], t);
        bassFilt.type = 'lowpass';
        bassFilt.frequency.setValueAtTime(isBoss ? 480 : 280, t);
        bassFilt.Q.setValueAtTime(2.2, t);
        bassGain.gain.setValueAtTime(masterVol * 0.7, t);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 7);
        bassOsc.connect(bassFilt);
        bassFilt.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + stepDur * 7.5);
      } catch (e) {}
    }

    // 3. Cyber Melodic Arpeggio
    if (step16 % 2 === 0 && !isLowHp) {
      try {
        const noteIdx = (step16 * 3 + this.chordIdx * 2) % this.scale.length;
        const noteFreq = this.scale[noteIdx];
        const arpOsc = ctx.createOscillator();
        const arpFilt = ctx.createBiquadFilter();
        const arpGain = ctx.createGain();
        arpOsc.type = 'sine';
        arpOsc.frequency.setValueAtTime(noteFreq, t);
        arpFilt.type = 'lowpass';
        arpFilt.frequency.setValueAtTime(isBoss ? 1600 : 900, t);
        arpGain.gain.setValueAtTime(masterVol * 0.32, t);
        arpGain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 1.5);
        arpOsc.connect(arpFilt);
        arpFilt.connect(arpGain);
        arpGain.connect(ctx.destination);
        arpOsc.start(t);
        arpOsc.stop(t + stepDur * 1.6);
      } catch (e) {}
    }

    this.step++;
    this.nextBeatTime = t + stepDur;
  }
};`;

const newSynthBgm = `// --- 100% Offline Procedural Dynamic Synth Battle Soundtrack ---
const synthBgm = {
  step: 0,
  nextBeatTime: 0,
  chordIdx: 0,
  chords: [
    [55, 110, 164.81],
    [65.41, 130.81, 196],
    [73.42, 146.83, 220],
    [82.41, 164.81, 246.94]
  ],
  scale: [220, 261.63, 293.66, 329.63, 392, 440, 523.25],
  update(nowMs) {
    if (!running || paused || menuOpen || !sfxOn || sfxVol <= 0.02) return;
    const ctx = audioCtx();
    if (!ctx || ctx.state !== 'running') return;
    const curTime = ctx.currentTime;
    if (curTime < this.nextBeatTime - 0.04) return;

    const currentBoss = enemies && enemies.find(en => en.type === 'boss');
    const isBoss = !!currentBoss;
    const isBossPhase2 = isBoss && (currentBoss.phase === 2 || currentBoss.isPhase2 || (currentBoss.hp / currentBoss.maxHp) <= 0.5);
    const isLowHp = player && player.hp > 0 && player.hp <= player.maxHp * 0.25;
    // Dynamic Phase 2 Boss Music Rush (158 BPM aggressive tempo)
    const baseBpm = isBossPhase2 ? 158 : (isBoss ? 134 : (isLowHp ? 146 : 112));
    const stepDur = 60 / baseBpm / 2;

    if (this.nextBeatTime <= curTime) {
      this.nextBeatTime = curTime + 0.03;
    }

    const t = this.nextBeatTime;
    const step16 = this.step % 16;
    const masterVol = Math.min(0.20, sfxVol * (isBossPhase2 ? 0.25 : (isBoss ? 0.22 : 0.16)));
    const dest = getAudioDest(ctx);

    // Dynamic Low-Pass Master Filter: Muffle world during Low-HP Panic (<25% HP)
    if (masterLowpass) {
      const targetCutoff = isLowHp ? 480 : 20000;
      masterLowpass.frequency.setTargetAtTime(targetCutoff, curTime, 0.14);
    }

    // 1. Heavy Synth Sub-Kick (Driving industrial beat on Phase 2!)
    if (step16 === 0 || step16 === 8 || (isBossPhase2 && (step16 === 4 || step16 === 12 || step16 === 14)) || (isBoss && (step16 === 4 || step16 === 12)) || (isLowHp && (step16 % 4 === 0))) {
      try {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = 'sine';
        const startFreq = isLowHp ? 95 : (isBossPhase2 ? 135 : 120);
        kickOsc.frequency.setValueAtTime(startFreq, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.16);
        kickGain.gain.setValueAtTime(masterVol * (isBossPhase2 ? 1.6 : 1.4), t);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        kickOsc.connect(kickGain);
        kickGain.connect(dest);
        kickOsc.start(t);
        kickOsc.stop(t + 0.24);
      } catch (e) {}
    }

    // 2. Dark Atmospheric Bass Drone (Saturated overdrive bite on Phase 2!)
    if (step16 === 0 || step16 === 8 || (isBossPhase2 && step16 === 4)) {
      if (step16 === 0) this.chordIdx = (this.chordIdx + 1) % this.chords.length;
      try {
        const chord = this.chords[this.chordIdx];
        const bassOsc = ctx.createOscillator();
        const bassFilt = ctx.createBiquadFilter();
        const bassGain = ctx.createGain();
        bassOsc.type = (isBossPhase2 || isBoss) ? 'sawtooth' : 'triangle';
        const baseNote = (isBossPhase2 && step16 === 4) ? chord[0] * 1.5 : chord[0];
        bassOsc.frequency.setValueAtTime(baseNote, t);
        bassFilt.type = 'lowpass';
        bassFilt.frequency.setValueAtTime(isBossPhase2 ? 650 : (isBoss ? 480 : 280), t);
        bassFilt.Q.setValueAtTime(isBossPhase2 ? 3.5 : 2.2, t);
        bassGain.gain.setValueAtTime(masterVol * (isBossPhase2 ? 0.9 : 0.7), t);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * (isBossPhase2 ? 4 : 7));
        bassOsc.connect(bassFilt);
        bassFilt.connect(bassGain);
        bassGain.connect(dest);
        bassOsc.start(t);
        bassOsc.stop(t + stepDur * (isBossPhase2 ? 4.2 : 7.5));
      } catch (e) {}
    }

    // 3. Cyber Melodic Arpeggio
    if (step16 % 2 === 0 && !isLowHp) {
      try {
        const noteIdx = (step16 * 3 + this.chordIdx * 2) % this.scale.length;
        const noteFreq = this.scale[noteIdx];
        const arpOsc = ctx.createOscillator();
        const arpFilt = ctx.createBiquadFilter();
        const arpGain = ctx.createGain();
        arpOsc.type = isBossPhase2 ? 'sawtooth' : 'sine';
        arpOsc.frequency.setValueAtTime(noteFreq * (isBossPhase2 ? 2 : 1), t);
        arpFilt.type = 'lowpass';
        arpFilt.frequency.setValueAtTime(isBossPhase2 ? 2200 : (isBoss ? 1600 : 900), t);
        arpGain.gain.setValueAtTime(masterVol * (isBossPhase2 ? 0.26 : 0.32), t);
        arpGain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 1.5);
        arpOsc.connect(arpFilt);
        arpFilt.connect(arpGain);
        arpGain.connect(dest);
        arpOsc.start(t);
        arpOsc.stop(t + stepDur * 1.6);
      } catch (e) {}
    }

    // 4. Boss Phase 2 Cyber Hi-Hat / Metallic Percussion Drive
    if (isBossPhase2 || (isBoss && step16 % 2 === 1)) {
      try {
        const hhOsc = ctx.createOscillator();
        const hhFilt = ctx.createBiquadFilter();
        const hhGain = ctx.createGain();
        hhOsc.type = 'square';
        hhOsc.frequency.setValueAtTime(isBossPhase2 ? 3600 : 2800, t);
        hhFilt.type = 'highpass';
        hhFilt.frequency.setValueAtTime(4200, t);
        const hhVol = masterVol * (isBossPhase2 ? 0.38 : 0.20);
        hhGain.gain.setValueAtTime(hhVol, t);
        hhGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
        hhOsc.connect(hhFilt);
        hhFilt.connect(hhGain);
        hhGain.connect(dest);
        hhOsc.start(t);
        hhOsc.stop(t + 0.04);
      } catch (e) {}
    }

    this.step++;
    this.nextBeatTime = t + stepDur;
  }
};`;

if (html.includes(oldSynthBgm)) {
  html = html.replace(oldSynthBgm, newSynthBgm);
  console.log('2. Successfully patched synthBgm with driving hi-hats, bass bite, and low-HP master low-pass!');
} else {
  console.log('Warning: oldSynthBgm not found!');
}

// 3. EXPAND SYNTHBLIP WITH ELEMENTAL HITS, FUSION DETONATION, AND STAGGER GONG
const oldSynthBlip = `function synthBlip(kind) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2400;
    o.connect(f); f.connect(g); g.connect(ctx.destination);
    const vol = Math.max(0.02, sfxVol * 0.18);
    g.gain.setValueAtTime(0.0001, t);
    if (kind === 'kill') {
      o.type = 'triangle';
      const p = 220 + Math.min(280, (typeof killCombo === 'number' ? killCombo : 0) * 25);
      o.frequency.setValueAtTime(p, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(80, p * 0.45), t + 0.16);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(t); o.stop(t + 0.19);
    } else if (kind === 'hit') {
      o.type = 'sine';
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
      g.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t); o.stop(t + 0.09);
    } else if (kind === 'pick') {
      o.type = 'sine';
      // Müzikal tırmanan gam: Do - Re - Mi - Fa - Sol - La - Si - Do - Re - Mi - Sol
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51, 1567.98, 2093.00];
      const idx = Math.min(notes.length - 1, window._gemStreak || 0);
      const n = notes[idx];
      f.frequency.value = 3600;
      o.frequency.setValueAtTime(n, t);
      o.frequency.exponentialRampToValueAtTime(n * 1.015, t + 0.02);
      o.frequency.setValueAtTime(n, t + 0.03);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * 0.95, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.start(t); o.stop(t + 0.15);
    } else if (kind === 'heartbeat') {
      o.type = 'sine';
      f.frequency.value = 600;
      o.frequency.setValueAtTime(65, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * 1.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    } else if (kind === 'level') {
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
    }
  } catch (e) {}
}`;

const newSynthBlip = `function synthBlip(kind) {
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
    g.gain.setValueAtTime(0.0001, t);

    // --- 1. ELEMENTAL COMBAT HIT SFX ---
    if (kind === 'elem_fire') {
      // Sizzling flame whoosh & fiery roar
      o.type = 'sawtooth';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1400, t);
      f.frequency.exponentialRampToValueAtTime(260, t + 0.13);
      f.Q.setValueAtTime(3.2, t);
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(75, t + 0.13);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.15, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.start(t); o.stop(t + 0.15);
    } else if (kind === 'elem_water') {
      // Fluid bubble pop & droplet splash
      o.type = 'sine';
      f.type = 'lowpass';
      f.frequency.setValueAtTime(1900, t);
      o.frequency.setValueAtTime(680, t);
      o.frequency.exponentialRampToValueAtTime(210, t + 0.09);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.0, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.10);
      o.start(t); o.stop(t + 0.11);
    } else if (kind === 'elem_storm') {
      // Tok elektrik cızırtısı & high-voltage crackle
      o.type = 'square';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(2200, t);
      f.frequency.exponentialRampToValueAtTime(800, t + 0.08);
      f.Q.setValueAtTime(2.5, t);
      o.frequency.setValueAtTime(1100, t);
      o.frequency.setValueAtTime(450, t + 0.02);
      o.frequency.setValueAtTime(880, t + 0.04);
      o.frequency.setValueAtTime(160, t + 0.06);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.05, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t); o.stop(t + 0.09);
    } else if (kind === 'elem_earth') {
      // Ağır granit & sismik yumruk
      o.type = 'triangle';
      f.type = 'lowpass';
      f.frequency.setValueAtTime(450, t);
      f.frequency.exponentialRampToValueAtTime(90, t + 0.16);
      o.frequency.setValueAtTime(165, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.5, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
      o.start(t); o.stop(t + 0.18);
    } else if (kind === 'elem_nature') {
      // Organik zehir kırbacı & çiy patlaması
      o.type = 'sawtooth';
      f.type = 'lowpass';
      f.frequency.setValueAtTime(1100, t);
      o.frequency.setValueAtTime(480, t);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.10);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 0.9, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      o.start(t); o.stop(t + 0.12);
    } else if (kind === 'elem_void') {
      // Kozmik gravitasyonel uğultu & abyss warp
      o.type = 'sine';
      f.type = 'lowpass';
      f.frequency.setValueAtTime(800, t);
      o.frequency.setValueAtTime(260, t);
      o.frequency.exponentialRampToValueAtTime(50, t + 0.22);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      o.start(t); o.stop(t + 0.25);
    } else if (kind === 'fusion_detonation') {
      // Elemental Füzyon Reaksiyon Patlaması
      o.type = 'triangle';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1600, t);
      f.frequency.exponentialRampToValueAtTime(180, t + 0.25);
      f.Q.setValueAtTime(1.8, t);
      o.frequency.setValueAtTime(340, t);
      o.frequency.exponentialRampToValueAtTime(65, t + 0.24);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.6, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.start(t); o.stop(t + 0.29);
    } else if (kind === 'stagger_gong') {
      // Epik Kadim Pirinç Tapınak Çanı / Gongu (Inharmonic Resonant Modes)
      const gongModes = [
        { ratio: 1.000, gain: 0.85, dur: 2.2 },
        { ratio: 1.482, gain: 0.65, dur: 1.8 },
        { ratio: 2.091, gain: 0.48, dur: 1.3 },
        { ratio: 2.763, gain: 0.32, dur: 0.9 },
        { ratio: 3.428, gain: 0.22, dur: 0.6 },
        { ratio: 4.812, gain: 0.18, dur: 0.35 }
      ];
      const baseFreq = 138.6; // C#3 gong
      gongModes.forEach(m => {
        try {
          const mOsc = ctx.createOscillator();
          const mGain = ctx.createGain();
          const mFilt = ctx.createBiquadFilter();
          mOsc.type = 'sine';
          mOsc.frequency.setValueAtTime(baseFreq * m.ratio, t);
          mFilt.type = 'lowpass';
          mFilt.frequency.setValueAtTime(2800, t);
          mGain.gain.setValueAtTime(0.0001, t);
          mGain.gain.linearRampToValueAtTime(vol * m.gain * 1.8, t + 0.008);
          mGain.gain.exponentialRampToValueAtTime(0.0001, t + m.dur);
          mOsc.connect(mFilt);
          mFilt.connect(mGain);
          mGain.connect(dest);
          mOsc.start(t);
          mOsc.stop(t + m.dur + 0.02);
        } catch(_) {}
      });
      // Initial heavy hammer strike transient
      o.type = 'triangle';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1800, t);
      o.frequency.setValueAtTime(260, t);
      o.frequency.exponentialRampToValueAtTime(60, t + 0.12);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.4, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.start(t); o.stop(t + 0.15);
    } else if (kind === 'kill') {
      o.type = 'triangle';
      const p = 220 + Math.min(280, (typeof killCombo === 'number' ? killCombo : 0) * 25);
      o.frequency.setValueAtTime(p, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(80, p * 0.45), t + 0.16);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(t); o.stop(t + 0.19);
    } else if (kind === 'hit') {
      o.type = 'sine';
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
      g.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t); o.stop(t + 0.09);
    } else if (kind === 'pick') {
      o.type = 'sine';
      // Müzikal tırmanan gam: Do - Re - Mi - Fa - Sol - La - Si - Do - Re - Mi - Sol
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51, 1567.98, 2093.00];
      const idx = Math.min(notes.length - 1, window._gemStreak || 0);
      const n = notes[idx];
      f.frequency.value = 3600;
      o.frequency.setValueAtTime(n, t);
      o.frequency.exponentialRampToValueAtTime(n * 1.015, t + 0.02);
      o.frequency.setValueAtTime(n, t + 0.03);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * 0.95, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.start(t); o.stop(t + 0.15);
    } else if (kind === 'heartbeat') {
      // Connect directly to destination so heartbeat punches cleanly through low-pass muffle!
      g.disconnect();
      g.connect(ctx.destination);
      o.type = 'sine';
      f.frequency.value = 600;
      o.frequency.setValueAtTime(65, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * 1.6, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    } else if (kind === 'level') {
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
          gn.connect(dest);
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
    }
  } catch (e) {}
}`;

if (html.includes(oldSynthBlip)) {
  html = html.replace(oldSynthBlip, newSynthBlip);
  console.log('3. Successfully patched synthBlip with elemental hits, fusion detonation, and stagger gong!');
} else {
  console.log('Warning: oldSynthBlip not found!');
}

// 4. CALL ELEMENTAL HIT SOUNDS IN TAKEDAMAGE
const oldTakeDmgFeedback = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Hades / Dead Cells micro-crunch)
  if (!opt.quiet) {
    triggerHitStop(isCrit ? 5 : 2); // 2-frame micro-freeze on hit, 5-frame on crit!
    shake = Math.max(shake, isCrit ? 5.5 : 2.0);
    if (isCrit) vibrate([15, 25]);
  }`;

const newTakeDmgFeedback = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Hades / Dead Cells micro-crunch)
  if (!opt.quiet) {
    triggerHitStop(isCrit ? 5 : 2); // 2-frame micro-freeze on hit, 5-frame on crit!
    shake = Math.max(shake, isCrit ? 5.5 : 2.0);
    if (isCrit) vibrate([15, 25]);
    // Dynamic Elemental Audio Juice
    if (el && typeof playElemHit === 'function') {
      playElemHit(el);
    } else {
      synthBlip('hit');
    }
  }`;

if (html.includes(oldTakeDmgFeedback)) {
  html = html.replace(oldTakeDmgFeedback, newTakeDmgFeedback);
  console.log('4. Successfully patched takeDamage with dynamic elemental hit sounds!');
} else {
  console.log('Warning: oldTakeDmgFeedback not found!');
}

// 5. STAGGER GONG ON POSTURE BREAK & 300% EXECUTION CRIT
const oldPostureBreak = `      // If already staggered: 3.0x EXECUTION DAMAGE + HUGE CRITICAL HIT!
      if (en.fsmState === 'staggered') {
        dealt = Math.round(dealt * 3.0);
        spawnFloatText(en.x, en.y - 28, '💥 %300 İNFAZ! ' + dealt, '#ffd700', 'crit');
        shake = Math.max(shake, 18);
        camKick = Math.max(camKick, 12);
        triggerHitStop(8);
        vibrate([35, 55]);
        burst(en.x, en.y, '#ffd700', 16, 4.0);
        burst(en.x, en.y, '#ffffff', 10, 2.5);
        playSfx('explode', 0.45, 380);
      } else {
        // Build up posture
        en.posture = (en.posture || 0) + (dealt * (isCrit ? 1.6 : 1.0));
        if (en.posture >= en.maxPosture) {
          // TRIGGER STAGGER!
          en.fsmState = 'staggered';
          en.staggerTimer = 2.4; // 2.4 seconds vulnerability
          en.posture = 0;
          en.vx = 0;
          en.vy = 0;
          en.squashScale = 0.72; // Slumps / kneels
          triggerHitStop(18); // Heavy crunch
          shake = Math.max(shake, 18);
          triggerScreenFlash('#facc15', 0.4, 150);
          vibrate([50, 80, 50, 100]);
          synthBlip('phase2_cue');
          playSfx('explode', 0.45, 260);
          burst(en.x, en.y, '#facc15', 30, 4.5);
          burst(en.x, en.y, '#ffffff', 18, 3.2);
          spawnFloatText(en.x, en.y - 48, '⚡ SERSEMLİK! (%300 İNFAZ) ⚡', '#ffd700', 'big');
        }
      }`;

const newPostureBreak = `      // If already staggered: 3.0x EXECUTION DAMAGE + HUGE CRITICAL HIT!
      if (en.fsmState === 'staggered') {
        dealt = Math.round(dealt * 3.0);
        spawnFloatText(en.x, en.y - 28, '💥 %300 İNFAZ! ' + dealt, '#ffd700', 'crit');
        shake = Math.max(shake, 18);
        camKick = Math.max(camKick, 12);
        triggerHitStop(8);
        vibrate([35, 55]);
        burst(en.x, en.y, '#ffd700', 16, 4.0);
        burst(en.x, en.y, '#ffffff', 10, 2.5);
        playSfx('explode', 0.45, 380);
        synthBlip('stagger_gong');
      } else {
        // Build up posture
        en.posture = (en.posture || 0) + (dealt * (isCrit ? 1.6 : 1.0));
        if (en.posture >= en.maxPosture) {
          // TRIGGER STAGGER!
          en.fsmState = 'staggered';
          en.staggerTimer = 2.4; // 2.4 seconds vulnerability
          en.posture = 0;
          en.vx = 0;
          en.vy = 0;
          en.squashScale = 0.72; // Slumps / kneels
          triggerHitStop(18); // Heavy crunch
          shake = Math.max(shake, 18);
          triggerScreenFlash('#facc15', 0.4, 150);
          vibrate([50, 80, 50, 100]);
          synthBlip('stagger_gong');
          playSfx('explode', 0.45, 260);
          burst(en.x, en.y, '#facc15', 30, 4.5);
          burst(en.x, en.y, '#ffffff', 18, 3.2);
          spawnFloatText(en.x, en.y - 48, '⚡ SERSEMLİK! (%300 İNFAZ) ⚡', '#ffd700', 'big');
        }
      }`;

if (html.includes(oldPostureBreak)) {
  html = html.replace(oldPostureBreak, newPostureBreak);
  console.log('5. Successfully patched boss posture break & 300% execution with stagger_gong!');
} else {
  console.log('Warning: oldPostureBreak not found!');
}

// 6. BOSS PHASE 2 RAGE ENTRY SFX
const oldBossPhase2TakeDmg = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      en.phase2 = true;
      en.raged = true;
      en.speed *= 1.30;
      shake = Math.max(shake, 22);
      camKick = Math.max(camKick, 16);
      triggerHitStop(50);
      triggerScreenFlash('#ff1744', 0.45, 240);
      spawnFloatText(en.x, en.y - 48, '🔥 2. FAZ: ÖFKE!', '#ff1744', 'big');
      playSfx('explode', 0.45, 180);
      vibrate([40, 60, 40, 80]);`;

const newBossPhase2TakeDmg = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      en.phase2 = true;
      en.raged = true;
      en.speed *= 1.30;
      shake = Math.max(shake, 22);
      camKick = Math.max(camKick, 16);
      triggerHitStop(50);
      triggerScreenFlash('#ff1744', 0.45, 240);
      spawnFloatText(en.x, en.y - 48, '🔥 2. FAZ: ÖFKE!', '#ff1744', 'big');
      synthBlip('stagger_gong');
      synthBlip('phase2_cue');
      playSfx('explode', 0.45, 180);
      vibrate([40, 60, 40, 80]);`;

if (html.includes(oldBossPhase2TakeDmg)) {
  html = html.replace(oldBossPhase2TakeDmg, newBossPhase2TakeDmg);
  console.log('6. Successfully patched boss Phase 2 entry with stagger_gong & phase2_cue!');
} else {
  console.log('Warning: oldBossPhase2TakeDmg not found!');
}

// 7. EMITREACTIONBURST FUSION DETONATION AUDIO
const oldEmitReactionBurstAudio = `  // Micro-Freeze Hit Stop & Juicy Camera Impact
  triggerHitStop(6);
  triggerScreenFlash(color, 0.34, 130);
  shake = Math.max(shake, 14);
  camKick = Math.max(camKick, 9);
  vibrate([35, 55, 35]);
  playSfx('explode', 0.44, 330);`;

const newEmitReactionBurstAudio = `  // Micro-Freeze Hit Stop & Juicy Camera Impact
  triggerHitStop(6);
  triggerScreenFlash(color, 0.34, 130);
  shake = Math.max(shake, 14);
  camKick = Math.max(camKick, 9);
  vibrate([35, 55, 35]);
  playSfx('explode', 0.44, 330);
  synthBlip('fusion_detonation');`;

if (html.includes(oldEmitReactionBurstAudio)) {
  html = html.replace(oldEmitReactionBurstAudio, newEmitReactionBurstAudio);
  console.log('7. Successfully patched emitReactionBurst with fusion_detonation sound!');
} else {
  console.log('Warning: oldEmitReactionBurstAudio not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 4 patches applied successfully to index.html!');
