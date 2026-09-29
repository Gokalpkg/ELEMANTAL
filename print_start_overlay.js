const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const sIdx = txt.indexOf('<!-- CLASH ROYALE STYLE 3-SCREEN HORIZONTAL MENU -->');
const eIdx = txt.indexOf('<!-- ACHIEVEMENTS MODAL');
console.log(txt.substring(sIdx, eIdx));
