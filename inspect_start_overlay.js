const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const idx = txt.indexOf('id="startOverlay"');
console.log('--- startOverlay ---');
console.log(txt.substring(idx - 100, idx + 600));

console.log('--- startOverlay End ---');
const idxEnd = txt.indexOf('<!-- ACHIEVEMENTS MODAL');
console.log(txt.substring(idxEnd - 300, idxEnd + 200));
