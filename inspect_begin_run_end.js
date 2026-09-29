const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const idx = txt.indexOf('function beginRunWithKit(');
console.log(txt.substring(idx + 1500, idx + 3000));
