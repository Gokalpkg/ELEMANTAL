const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. ADD STAGGER BAR TO BOSSHUD HTML
// -------------------------------------------------------------
const oldBossHudHtml = `<div id="bossHud">
      <div class="bn" id="bossName">Dalga Lordu</div>
      <div id="bossLayers"></div>
      <div class="bb"><div class="bf" id="bossFill"></div></div>
    </div>`;

const newBossHudHtml = `<div id="bossHud">
      <div class="bn" id="bossName">Dalga Lordu</div>
      <div id="bossLayers"></div>
      <div class="bb"><div class="bf" id="bossFill"></div></div>
      <div class="bb stagger-bar" style="height:4px; margin-top:3px; background:#0b1120; border-color:#d97706; border-radius:99px; overflow:hidden;"><div class="bf" id="bossStaggerFill" style="height:100%; width:0%; background:linear-gradient(90deg, #facc15, #f59e0b); box-shadow:0 0 6px rgba(250,204,21,0.6); transition:width 0.15s ease-out;"></div></div>
    </div>`;

if (html.includes(oldBossHudHtml)) {
  html = html.replace(oldBossHudHtml, newBossHudHtml);
  console.log('Added Stagger Bar to bossHud HTML');
} else {
  console.log('Could not find oldBossHudHtml');
}

// -------------------------------------------------------------
// 2. UPDATE fillBossHud TO UPDATE STAGGER BAR
// -------------------------------------------------------------
const oldFillBossHud = `function fillBossHud(boss) {
  const bh = document.getElementById('bossHud');
  if (!bh) return;
  bh.classList.toggle('show', !!boss);
  if (!boss) return;
  const nm = document.getElementById('bossName');
  if (nm) nm.textContent = (wagerHard ? 'Bahis · ' : '') + (boss.title || 'Dalga Lordu');
  const ly = document.getElementById('bossLayers');
  if (ly) {
    ly.innerHTML = (boss.layers || []).map(L => {
      const em = L.need && ELEMENTS[L.need] ? ELEMENTS[L.need].emoji : '';
      const w = Math.max(0, L.hp / (L.maxHp || 1) * 100);
      return \`<div class="bl"><span>\${em} \${L.name}</span><div class="bb layer"><div class="bf" style="width:\${w}%;background:\${L.color}"></div></div></div>\`;
    }).join('');
  }
  const fill = document.getElementById('bossFill');
  if (fill) fill.style.width = Math.max(0, boss.hp / boss.maxHp * 100) + '%';
}`;

const newFillBossHud = `function fillBossHud(boss) {
  const bh = document.getElementById('bossHud');
  if (!bh) return;
  bh.classList.toggle('show', !!boss);
  if (!boss) return;
  const isStaggered = boss.fsmState === 'staggered';
  const nm = document.getElementById('bossName');
  if (nm) nm.textContent = (wagerHard ? 'Bahis · ' : '') + (boss.title || 'Dalga Lordu') + (isStaggered ? ' ⚡ [SERSEMLİK / %200 KRİTİK!]' : '');
  const ly = document.getElementById('bossLayers');
  if (ly) {
    ly.innerHTML = (boss.layers || []).map(L => {
      const em = L.need && ELEMENTS[L.need] ? ELEMENTS[L.need].emoji : '';
      const w = Math.max(0, L.hp / (L.maxHp || 1) * 100);
      return \`<div class="bl"><span>\${em} \${L.name}</span><div class="bb layer"><div class="bf" style="width:\${w}%;background:\${L.color}"></div></div></div>\`;
    }).join('');
  }
  const fill = document.getElementById('bossFill');
  if (fill) fill.style.width = Math.max(0, boss.hp / boss.maxHp * 100) + '%';

  // Stagger / Duruş Barı
  const sFill = document.getElementById('bossStaggerFill');
  if (sFill) {
    const sPct = Math.min(100, Math.max(0, ((boss.posture || 0) / (boss.maxPosture || 200)) * 100));
    sFill.style.width = sPct + '%';
    sFill.style.background = isStaggered ? 'linear-gradient(90deg, #38bdf8, #ffffff)' : 'linear-gradient(90deg, #facc15, #f59e0b)';
  }
}`;

if (html.includes(oldFillBossHud)) {
  html = html.replace(oldFillBossHud, newFillBossHud);
  console.log('Updated fillBossHud with Stagger Bar logic');
} else {
  console.log('Could not find oldFillBossHud');
}

// -------------------------------------------------------------
// 3. HOOK STAGGER LOGIC INTO takeDamage
// -------------------------------------------------------------
const oldTakeDamageBossPhase = `    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {`;

const newTakeDamageBossStagger = `    // BOSS POSTURE & STAGGER SYSTEM
    if (en.type === 'boss') {
      en.maxPosture = en.maxPosture || Math.round(en.maxHp * 0.42);
      en.lastHitTime = performance.now();

      // If already staggered: 2.2x EXECUTION DAMAGE + GUARANTEED CRIT!
      if (en.fsmState === 'staggered') {
        dealt = Math.round(dealt * 2.2);
        spawnFloatText(en.x, en.y - 24, '⚡ İNFAZ! ' + dealt, '#facc15', 'big');
        shake = Math.max(shake, 14);
        camKick = Math.max(camKick, 10);
        playSfx('skill', 0.4, 750);
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
          spawnFloatText(en.x, en.y - 48, '⚡ SERSEMLİK! (%200 İNFAZ) ⚡', '#facc15', 'big');
        }
      }
    }

    if (en.type === 'boss' && !en.phase2 && en.hp > 0 && en.hp <= en.maxHp * 0.5) {`;

if (html.includes(oldTakeDamageBossPhase)) {
  html = html.replace(oldTakeDamageBossPhase, newTakeDamageBossStagger);
  console.log('Hooked Posture & Stagger into takeDamage');
} else {
  console.log('Could not find oldTakeDamageBossPhase');
}

// -------------------------------------------------------------
// 4. UPDATE updateBossAi FOR STAGGERED FSM STATE & DECAY
// -------------------------------------------------------------
const oldBossFsmLock = `    if (en.fsmState === 'telegraph') {`;

const newBossFsmStagger = `    if (en.fsmState === 'staggered') {
      en.vx = 0;
      en.vy = 0;
      en.moving = false;
      en.squashScale = 0.72; // Kneeling
      en.staggerTimer -= dt * (1 / 60);
      if (Math.random() < 0.3) {
        burst(en.x + (Math.random() - 0.5) * en.r, en.y + (Math.random() - 0.5) * en.r, '#facc15', 2, 1.2);
      }
      if (en.staggerTimer <= 0) {
        en.fsmState = 'move';
        en.squashScale = 1.0;
        en.specialCd = 1.6;
        burst(en.x, en.y, '#ffffff', 14, 3.0);
        spawnFloatText(en.x, en.y - 30, 'Toparlandı!', '#94a3b8');
      }
      return;
    }

    if (en.fsmState === 'telegraph') {`;

if (html.includes(oldBossFsmLock)) {
  html = html.replace(oldBossFsmLock, newBossFsmStagger);
  console.log('Added staggered FSM handling in updateBossAi');
} else {
  console.log('Could not find oldBossFsmLock');
}

// In updateBossAi: add posture decay if untouched for 3.5s
const oldBossAiReturn = `  // 1. Phase 2 / Ara Form Transition Check`;
const newBossAiPostureDecay = `  // Posture decay when player plays passively
  if (en.posture > 0 && performance.now() - (en.lastHitTime || 0) > 3500) {
    en.posture = Math.max(0, en.posture - dt * 25);
  }

  // 1. Phase 2 / Ara Form Transition Check`;

if (html.includes(oldBossAiReturn)) {
  html = html.replace(oldBossAiReturn, newBossAiPostureDecay);
  console.log('Added posture decay in updateBossAi');
}

// -------------------------------------------------------------
// 5. BOSS STAGGER FLOATING TEXT / ICON RENDER
// -------------------------------------------------------------
const oldBossRenderCall = `    if (en.type === 'boss') {
      cy = drawBiomeBoss(ctx, en.x, en.y, en.r, en, time, biome, fogged);
    }`;

const newBossRenderCall = `    if (en.type === 'boss') {
      cy = drawBiomeBoss(ctx, en.x, en.y, en.r, en, time, biome, fogged);
      if (en.fsmState === 'staggered') {
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.font = '900 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        const bob = Math.sin(time * 0.4) * 3;
        ctx.fillText('⚡ SERSEMLEDİ (%200 HASAR) ⚡', en.x, cy - en.r - 18 + bob);
        ctx.restore();
      }
    }`;

if (html.includes(oldBossRenderCall)) {
  html = html.replace(oldBossRenderCall, newBossRenderCall);
  console.log('Added Stagger text above Boss head');
} else {
  console.log('Could not find oldBossRenderCall');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html with Scope 3 (Boss Stagger System)');
