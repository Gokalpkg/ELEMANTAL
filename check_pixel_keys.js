const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const re = /renderPixelIcon\(\s*['"]([^'"]+)['"]/g;
const keys = new Set();
let m;
while ((m = re.exec(txt)) !== null) {
  keys.add(m[1]);
}

const pxIcons = new Set();
const pxRe = /([a-z0-9_-]+):\s*'<svg/gi;
while ((m = pxRe.exec(txt)) !== null) {
  pxIcons.add(m[1].toLowerCase());
}

console.log('Keys used in renderPixelIcon:');
keys.forEach(k => {
  const has = pxIcons.has(k.toLowerCase());
  console.log(`  ${k}: ${has ? 'FOUND' : 'MISSING (Fallback to gem)'}`);
});
