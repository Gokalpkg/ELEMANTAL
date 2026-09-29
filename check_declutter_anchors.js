const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('1. boss flash exists:', html.includes("ctx.globalCompositeOperation = 'source-atop';"));
console.log('2. render flash arc exists:', html.includes("ctx.arc(en.x, cy, en.r + (en.type === 'boss' ? 4 : 2), 0, Math.PI * 2);"));
console.log('3. pauseOverlay exists:', html.includes('<div id="pauseOverlay" class="overlay pause-ov">'));
console.log('4. pactEl floatText exists:', html.includes("spawnFloatText(player.x, player.y - 44, 'Sözleşme: '"));
console.log('5. pickHistory floatText exists:', html.includes("pickHistory.length + '/6)', e.color);"));
console.log('6. dedeKorkut timer exists:', html.includes("banner.classList.remove('show');\n  }, 4800);"));
