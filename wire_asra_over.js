const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

const oldTreeFns = `function openTree() {
  document.getElementById('startOverlay').classList.remove('show');
  fillTreePanel();
  document.getElementById('treeOverlay').classList.add('show');
}
function closeTree() {
  document.getElementById('treeOverlay').classList.remove('show');
  fillCrystalHud();
  fillMetaGoal();
  document.getElementById('startOverlay').classList.add('show');
}`;

const newTreeFns = `let _treeOrigin = 'start';
function openTree(origin) {
  _treeOrigin = origin || 'start';
  document.getElementById('startOverlay').classList.remove('show');
  const gOv = document.getElementById('gameOverOverlay');
  if (gOv) gOv.classList.remove('show');
  fillTreePanel();
  document.getElementById('treeOverlay').classList.add('show');
}
function closeTree() {
  document.getElementById('treeOverlay').classList.remove('show');
  fillCrystalHud();
  fillMetaGoal();
  if (_treeOrigin === 'over') {
    const gOv = document.getElementById('gameOverOverlay');
    if (gOv) gOv.classList.add('show');
  } else {
    document.getElementById('startOverlay').classList.add('show');
  }
}`;

if (html.includes(oldTreeFns)) {
  html = html.replace(oldTreeFns, newTreeFns);
  console.log('1. Successfully updated openTree and closeTree with origin tracking!');
} else {
  console.log('Warning: oldTreeFns not found!');
}

const oldOverBtn = `document.getElementById('menuFromOverBtn').addEventListener('click', goMainMenu);`;
const newOverBtn = `const asraOverBtn = document.getElementById('asraFromOverBtn');
if (asraOverBtn) {
  asraOverBtn.addEventListener('click', () => openTree('over'));
}
document.getElementById('menuFromOverBtn').addEventListener('click', goMainMenu);`;

if (html.includes(oldOverBtn)) {
  html = html.replace(oldOverBtn, newOverBtn);
  console.log('2. Successfully connected asraFromOverBtn to openTree("over")!');
} else {
  console.log('Warning: oldOverBtn not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished updating wire_asra_over.js!');
