const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. UPDATE BOSSHUD HTML: PROMINENT STAGGER BAR WITH LABEL & %
// -------------------------------------------------------------
const oldBossHudBlock = `<div id="bossHud">
      <div class="bn" id="bossName">Dalga Lordu</div>
      <div id="bossLayers"></div>
      <div class="bb"><div class="bf" id="bossFill"></div></div>
      <div class="bb stagger-bar" style="height:4px; margin-top:3px; background:#0b1120; border-color:#d97706; border-radius:99px; overflow:hidden;"><div class="bf" id="bossStaggerFill" style="height:100%; width:0%; background:linear-gradient(90deg, #facc15, #f59e0b); box-shadow:0 0 6px rgba(250,204,21,0.6); transition:width 0.15s ease-out;"></div></div>
    </div>`;

const newBossHudBlock = `<div id="bossHud">
      <div class="bn" id="bossName">Dalga Lordu</div>
      <div id="bossLayers"></div>
      <div class="bb" style="height:10px; border-width:1.5px;"><div class="bf" id="bossFill"></div></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; padding:0 3px;">
        <span id="staggerLabel" style="font-size:9px; font-weight:900; color:#facc15; letter-spacing:0.5px;">⚡ DURUŞ (POSTURE)</span>
        <span id="staggerVal" style="font-size:9px; font-weight:900; color:#facc15;">0%</span>
      </div>
      <div class="bb stagger-bar" style="height:6px; margin-top:2px; background:#0b1120; border:1px solid #d97706; border-radius:99px; overflow:hidden;"><div class="bf" id="bossStaggerFill" style="height:100%; width:0%; background:linear-gradient(90deg, #facc15, #f59e0b); box-shadow:0 0 8px rgba(250,204,21,0.8); transition:width 0.12s ease-out;"></div></div>
    </div>`;

if (html.includes(oldBossHudBlock)) {
  html = html.replace(oldBossHudBlock, newBossHudBlock);
  console.log('Updated bossHud HTML with prominent Stagger labels and bar');
} else {
  console.log('Could not find oldBossHudBlock');
}

// -------------------------------------------------------------
// 2. ENHANCE fillBossHud WITH PROMINENT STAGGER FEEDBACK
// -------------------------------------------------------------
const oldFillBossHudCall = `function fillBossHud(boss) {
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

const newFillBossHudCall = `function fillBossHud(boss) {
  const bh = document.getElementById('bossHud');
  if (!bh) return;
  bh.classList.toggle('show', !!boss);
  if (!boss) return;
  const isStaggered = boss.fsmState === 'staggered';
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

  // Stagger / Duruş Barı
  const sFill = document.getElementById('bossStaggerFill');
  const sLabel = document.getElementById('staggerLabel');
  const sVal = document.getElementById('staggerVal');
  const maxPost = boss.maxPosture || 200;
  const curPost = boss.posture || 0;
  const sPct = Math.min(100, Math.max(0, Math.round((curPost / maxPost) * 100)));

  if (sFill) {
    if (isStaggered) {
      const stagRatio = Math.max(0, (boss.staggerTimer || 0) / 2.4);
      sFill.style.width = Math.round(stagRatio * 100) + '%';
      sFill.style.background = 'linear-gradient(90deg, #38bdf8, #ffffff)';
      sFill.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.9)';
    } else {
      sFill.style.width = sPct + '%';
      sFill.style.background = sPct > 75 ? 'linear-gradient(90deg, #ef4444, #f59e0b)' : 'linear-gradient(90deg, #facc15, #f59e0b)';
      sFill.style.boxShadow = sPct > 75 ? '0 0 10px rgba(239, 68, 68, 0.8)' : '0 0 6px rgba(250, 204, 21, 0.6)';
    }
  }
  if (sLabel) {
    sLabel.textContent = isStaggered ? '💥 SERSEMLEME! (%300 İNFAZ)' : (sPct > 75 ? '⚠️ KIRILMAK ÜZERE!' : '⚡ DURUŞ (POSTURE)');
    sLabel.style.color = isStaggered ? '#38bdf8' : (sPct > 75 ? '#ef4444' : '#facc15');
  }
  if (sVal) {
    sVal.textContent = isStaggered ? Math.max(0, (boss.staggerTimer || 0)).toFixed(1) + 's' : sPct + '%';
    sVal.style.color = isStaggered ? '#38bdf8' : (sPct > 75 ? '#ef4444' : '#facc15');
  }
}`;

if (html.includes(oldFillBossHudCall)) {
  html = html.replace(oldFillBossHudCall, newFillBossHudCall);
  console.log('Enhanced fillBossHud with live countdown and danger states');
} else {
  console.log('Could not find oldFillBossHudCall');
}

// -------------------------------------------------------------
// 3. 3.0x EXECUTION DAMAGE IN takeDamage
// -------------------------------------------------------------
const oldStaggerExecution = `      // If already staggered: 2.2x EXECUTION DAMAGE + GUARANTEED CRIT!
      if (en.fsmState === 'staggered') {
        dealt = Math.round(dealt * 2.2);
        spawnFloatText(en.x, en.y - 24, '⚡ İNFAZ! ' + dealt, '#facc15', 'big');
        shake = Math.max(shake, 14);
        camKick = Math.max(camKick, 10);
        playSfx('skill', 0.4, 750);
      }`;

const newStaggerExecution = `      // If already staggered: 3.0x EXECUTION DAMAGE + HUGE CRITICAL HIT!
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
      }`;

if (html.includes(oldStaggerExecution)) {
  html = html.replace(oldStaggerExecution, newStaggerExecution);
  console.log('Upgraded execution damage to 3.0x in takeDamage');
} else {
  console.log('Could not find oldStaggerExecution');
}

// -------------------------------------------------------------
// 4. ORBITING DAZE STARS & CINEMATIC STAGGER RENDER
// -------------------------------------------------------------
const oldBossStaggerRender = `      if (en.fsmState === 'staggered') {
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.font = '900 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        const bob = Math.sin(time * 0.4) * 3;
        ctx.fillText('⚡ SERSEMLEDİ (%200 HASAR) ⚡', en.x, cy - en.r - 18 + bob);
        ctx.restore();
      }`;

const newBossStaggerRender = `      if (en.fsmState === 'staggered') {
        ctx.save();
        // 3 Orbiting Daze Stars / Golden Runes
        const starCount = 3;
        const starDist = en.r + 14;
        const starAngle = time * 0.25;
        for (let s = 0; s < starCount; s++) {
          const sa = starAngle + (s / starCount) * Math.PI * 2;
          const sx = en.x + Math.cos(sa) * starDist;
          const sy = cy - en.r * 0.6 + Math.sin(sa) * (starDist * 0.38);
          ctx.fillStyle = '#ffd700';
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(sx, sy, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
        // Pulsing Stagger Sign
        ctx.fillStyle = '#38bdf8';
        ctx.font = '900 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        const bob = Math.sin(time * 0.4) * 3;
        ctx.fillText('⚡ SERSEMLİK (%300 İNFAZ) ⚡', en.x, cy - en.r - 20 + bob);
        ctx.restore();
      }`;

if (html.includes(oldBossStaggerRender)) {
  html = html.replace(oldBossStaggerRender, newBossStaggerRender);
  console.log('Added Orbiting Daze Stars in Boss Stagger Render');
} else {
  console.log('Could not find oldBossStaggerRender');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote index.html with Cinematic Boss Stagger');
