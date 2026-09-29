const fs = require('fs');
const dom = fs.readFileSync('dom_dump.html', 'utf8');

const m1 = dom.match(/id="heroPedestalLeftName"[^>]*>([\s\S]*?)<\/div>/);
const m2 = dom.match(/id="heroPedestalRightName"[^>]*>([\s\S]*?)<\/div>/);
const brand = dom.match(/class="menu-brand-title"[^>]*>([\s\S]*?)<\/h1>/);
const devBtn = dom.match(/id="devStartBtn"[^>]*style="([^"]*)"/);

console.log('Left Pedestal:', m1 ? m1[1].trim() : 'NOT FOUND');
console.log('Right Pedestal:', m2 ? m2[1].trim() : 'NOT FOUND');
console.log('Brand Title:', brand ? brand[1].trim() : 'NOT FOUND');
console.log('Dev Start Btn Style:', devBtn ? devBtn[1].trim() : 'NOT FOUND');

// Check if any error was rendered in dom
const errs = dom.match(/error|exception/gi);
console.log('Errors found in DOM:', errs ? errs.length : 0);
