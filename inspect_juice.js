const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const sIdx = txt.indexOf('function triggerHitStop');
console.log(txt.substring(sIdx, sIdx + 1200));

const fIdx = txt.indexOf('function spawnFloatText(');
console.log(txt.substring(fIdx, fIdx + 1000));
