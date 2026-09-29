const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. ADD 'crit_hit' CRUNCH SOUND TO synthBlip
// -------------------------------------------------------------
const oldSynthBlipCritTarget = `    } else if (kind === 'hit') {
      o.type = 'sine';
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
      g.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t); o.stop(t + 0.09);`;

const newSynthBlipCritTarget = `    } else if (kind === 'crit_hit') {
      // Tok metalik kırılma & yüksek frekanslı tok çıtırtı (Crunchy Crit Sound)
      o.type = 'sawtooth';
      f.type = 'bandpass';
      f.frequency.setValueAtTime(3600, t);
      f.frequency.exponentialRampToValueAtTime(800, t + 0.12);
      f.Q.setValueAtTime(3.8, t);
      o.frequency.setValueAtTime(680, t);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.11);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol * 1.5, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      o.start(t); o.stop(t + 0.14);
    } else if (kind === 'hit') {
      o.type = 'sine';
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
      g.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t); o.stop(t + 0.09);`;

if (html.includes(oldSynthBlipCritTarget)) {
  html = html.replace(oldSynthBlipCritTarget, newSynthBlipCritTarget);
  changes++;
  console.log('[1] Added crit_hit crunchy sound to synthBlip');
} else {
  console.warn('[1] Warning: oldSynthBlipCritTarget not found');
}

// -------------------------------------------------------------
// 2. TRIGGER crit_hit SOUND & EXTRA JUICINESS IN takeDamage
// -------------------------------------------------------------
const oldTakeDamageJuice = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Only on Boss crits, NEVER freeze on normal mob hits!)
  if (!opt.quiet) {
    if (en.type === 'boss' && isCrit) {
      triggerHitStop(6);
    }
    shake = Math.max(shake, isCrit ? 4.0 : 1.5);
    if (isCrit) vibrate([15, 25]);
    // Dynamic Elemental Audio Juice
    if (el && typeof playElemHit === 'function') {
      playElemHit(el);
    } else {
      synthBlip('hit');
    }
  }`;

const newTakeDamageJuice = `  // 1. TACTILE HIT-STOP & SCREEN IMPACT JUICE (Only on Boss crits, NEVER freeze on normal mob hits!)
  if (!opt.quiet) {
    if (en.type === 'boss' && isCrit) {
      triggerHitStop(6);
    }
    shake = Math.max(shake, isCrit ? 4.8 : 1.5);
    if (isCrit) {
      vibrate([18, 30]);
      synthBlip('crit_hit');
    }
    // Dynamic Elemental Audio Juice
    if (el && typeof playElemHit === 'function') {
      playElemHit(el);
    } else {
      synthBlip('hit');
    }
  }`;

if (html.includes(oldTakeDamageJuice)) {
  html = html.replace(oldTakeDamageJuice, newTakeDamageJuice);
  changes++;
  console.log('[2] Updated takeDamage with crit_hit audio & tactile vibrate');
} else {
  console.warn('[2] Warning: oldTakeDamageJuice not found');
}

// -------------------------------------------------------------
// 3. PRESERVE EMOJIS IN spawnFloatText
// -------------------------------------------------------------
const oldEmojiStrip = `  let str = String(text || '')
    .replace(/[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{FE00}-\\u{FE0F}]/gu, '')
    .replace(/\\s+/g, ' ')
    .trim();`;

const newEmojiStrip = `  let str = String(text || '').trim();`;

if (html.includes(oldEmojiStrip)) {
  html = html.replace(oldEmojiStrip, newEmojiStrip);
  changes++;
  console.log('[3] Allowed vibrant emojis in spawnFloatText');
} else {
  console.warn('[3] Warning: oldEmojiStrip not found');
}

// -------------------------------------------------------------
// 4. LOW-HP HEARTBEAT & CRIMSON VIGNETTE PULSE IN render()
// -------------------------------------------------------------
const oldJoyRenderHead = `  if (joyActive) {
    ctx.save();
    ctx.translate(shx, shy);`;

const newJoyRenderHead = `  // STEP 3: Tactile Low-HP Heartbeat & Crimson Vignette Pulse (<25% HP)
  if (running && player && player.hp > 0 && player.hp <= player.maxHp * 0.25) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const pulseT = (Math.sin(time * 0.008) + 1) * 0.5; // 0 to 1 pulsing wave
    const alpha = 0.18 + pulseT * 0.22; // 0.18 to 0.40 intense pulse
    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
    vigGrad.addColorStop(0, 'rgba(255, 0, 40, 0)');
    vigGrad.addColorStop(0.7, 'rgba(220, 20, 60, ' + (alpha * 0.6) + ')');
    vigGrad.addColorStop(1, 'rgba(180, 0, 20, ' + alpha + ')');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  if (joyActive) {
    ctx.save();
    ctx.translate(shx, shy);`;

if (html.includes(oldJoyRenderHead)) {
  html = html.replace(oldJoyRenderHead, newJoyRenderHead);
  changes++;
  console.log('[4] Added Low-HP Heartbeat & Crimson Vignette Pulse to render()');
} else {
  console.warn('[4] Warning: oldJoyRenderHead not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 3 patch script. Total successful patches: ${changes}/4`);
