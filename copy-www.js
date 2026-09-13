const fs = require('fs');
const path = require('path');
const src = __dirname;
const dst = path.join(__dirname, 'www');
fs.mkdirSync(dst, { recursive: true });
const files = [
  'index.html', 'version.txt',
  'icon.svg', 'icon-192.png', 'icon-512.png'
];
files.forEach((f) => {
  const p = path.join(src, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(dst, f));
});
['audio', 'img'].forEach((dir) => {
  const from = path.join(src, dir);
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, path.join(dst, dir), { recursive: true });
});

function isOurs(name) {
  const n = name.toLowerCase();
  return n.endsWith('.apk') && (
    n.indexOf('element') >= 0 ||
    n === 'app-debug.apk' ||
    n.indexOf('savas') >= 0
  );
}
function rm(file) {
  try { fs.unlinkSync(file); console.log('silindi', file); } catch (e) {}
}
fs.readdirSync(src).forEach((f) => {
  if (isOurs(f)) rm(path.join(src, f));
});
const desk = path.join(require('os').homedir(), 'Desktop');
if (fs.existsSync(desk)) {
  fs.readdirSync(desk).forEach((f) => {
    if (f.toLowerCase() === 'elementsavasi.apk' || f.toLowerCase() === 'elementer.apk') rm(path.join(desk, f));
  });
}
console.log('www hazır');
