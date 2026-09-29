const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const idx = txt.indexOf('function startRun(');
console.log(txt.substring(idx, idx + 1500));
