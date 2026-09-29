const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const idx = txt.indexOf('function render()');
console.log('render starts at:', idx);
console.log(txt.substring(idx, idx + 4000));
