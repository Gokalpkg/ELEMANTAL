const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. Hook kills tracking in killEnemy
const oldScoreLine = `    const pts = en.type==='boss' ? 80+wave*8 : en.type==='tank' ? 18 : 10 + wave;
    score += pts;`;

const newScoreLine = `    const pts = en.type==='boss' ? 80+wave*8 : en.type==='tank' ? 18 : 10 + wave;
    score += pts;
    if (typeof runStats !== 'undefined' && runStats) {
      runStats.kills = (runStats.kills || 0) + 1;
      if (en.type === 'boss') runStats.bossKills = (runStats.bossKills || 0) + 1;
    }`;

if (html.includes(oldScoreLine)) {
  html = html.replace(oldScoreLine, newScoreLine);
  console.log('[1] Hooked runStats.kills and bossKills in killEnemy');
} else {
  console.log('[1] Warning: oldScoreLine not found');
}

// 2. Initialize heroNameInput right before requestAnimationFrame(loop)
const oldLoopTarget = `requestAnimationFrame(loop);
})();`;

const newLoopTarget = `try {
  const hInput = document.getElementById('heroNameInput');
  if (hInput) {
    const saved = localStorage.getItem('elementer-hero-name');
    if (saved) hInput.value = saved;
    hInput.addEventListener('input', () => {
      try { localStorage.setItem('elementer-hero-name', hInput.value.trim() || 'Alp'); } catch (_) {}
    });
  }
} catch (_) {}

requestAnimationFrame(loop);
})();`;

if (html.includes(oldLoopTarget)) {
  html = html.replace(oldLoopTarget, newLoopTarget);
  console.log('[2] Initialized heroNameInput binding before loop');
} else {
  console.log('[2] Warning: oldLoopTarget not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully completed finish_scope7.js');
