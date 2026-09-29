const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

const oldMetaTree = `const META_TREE = [
  { id:'hp', name:'Demir Beden', emoji:'❤️', max:5, costs:[32, 48, 68, 92, 120], hint:'Başlangıç canı +%5 / seviye' },
  { id:'damage', name:'Kadim Bıçak', emoji:'⚔️', max:5, costs:[35, 55, 80, 110, 150], hint:'Kalıcı saldırı hasarı +%6 / seviye' },
  { id:'crit', name:'Kritik Sezgi', emoji:'🎯', max:3, costs:[45, 75, 120], hint:'Kalıcı kritik vuruş şansı +%3 / seviye' },
  { id:'dashRecovery', name:'Çevik Hamle', emoji:'⚡', max:3, costs:[40, 70, 110], hint:'Dash bekleme süresini %12 hızlandırır' },
  { id:'gold', name:'Çifte Kristal', emoji:'✨', max:3, costs:[40, 65, 100], hint:'Kristalin %2 / seviye ikiye katlanma şansı' },
  { id:'shield', name:'Ruh Bariyeri', emoji:'🛡️', max:3, costs:[50, 85, 130], hint:'Koşu başında koruyucu enerji kalkanı verir' },
  { id:'magnet', name:'Uzak Mıknatıs', emoji:'🧲', max:4, costs:[35, 60, 95, 140], hint:'Kalıcı XP ve kristal çekme menzili +18px / seviye' },
  { id:'speed', name:'Hızlı Adımlar', emoji:'👟', max:3, costs:[45, 75, 115], hint:'Kalıcı hareket hızı +%4 / seviye' },
  { id:'startMod', name:'Gezginin Hediyesi', emoji:'🎁', max:1, costs:[150], hint:'Run başında 1 eklenti seçme hakkı' }
];`;

const newMetaTree = `const META_TREE = [
  { id:'hp', name:'Demir Beden', en_name:'Iron Vigor', emoji:'❤️', max:5, costs:[32, 48, 68, 92, 120], hint:'Başlangıç canı +%5 / seviye', en_hint:'Max starting HP +5% / rank' },
  { id:'damage', name:'Kadim Bıçak', en_name:'Primordial Blade', emoji:'⚔️', max:5, costs:[35, 55, 80, 110, 150], hint:'Kalıcı saldırı hasarı +%6 / seviye', en_hint:'Permanent attack damage +6% / rank' },
  { id:'crit', name:'Kritik Sezgi', en_name:'Keen Insight', emoji:'🎯', max:3, costs:[45, 75, 120], hint:'Kalıcı kritik vuruş şansı +%3 / seviye', en_hint:'Permanent critical strike chance +3% / rank' },
  { id:'dashRecovery', name:'Çevik Hamle', en_name:'Swift Cadence', emoji:'⚡', max:3, costs:[40, 70, 110], hint:'Dash bekleme süresini %12 hızlandırır', en_hint:'Dash cooldown recovers 12% faster / rank' },
  { id:'gold', name:'Çifte Kristal', en_name:'Crystal Resonance', emoji:'✨', max:3, costs:[40, 65, 100], hint:'Kristalin %2 / seviye ikiye katlanma şansı', en_hint:'+2% chance per rank to duplicate gathered crystals' },
  { id:'shield', name:'Ruh Bariyeri', en_name:'Spirit Aegis', emoji:'🛡️', max:3, costs:[50, 85, 130], hint:'Koşu başında koruyucu enerji kalkanı verir', en_hint:'Grants an arcane protective barrier at run start' },
  { id:'magnet', name:'Uzak Mıknatıs', en_name:'Astral Magnet', emoji:'🧲', max:4, costs:[35, 60, 95, 140], hint:'Kalıcı XP ve kristal çekme menzili +18px / seviye', en_hint:'Orb and crystal attraction radius +18px / rank' },
  { id:'speed', name:'Hızlı Adımlar', en_name:'Wind Strider', emoji:'👟', max:3, costs:[45, 75, 115], hint:'Kalıcı hareket hızı +%4 / seviye', en_hint:'Permanent movement speed +4% / rank' },
  { id:'startMod', name:'Gezginin Hediyesi', en_name:"Pilgrim's Boon", emoji:'🎁', max:1, costs:[150], hint:'Run başında 1 eklenti seçme hakkı', en_hint:'Select 1 free artifact relic at run start' }
];`;

html = html.replace(oldMetaTree, newMetaTree);

const oldFillTree = `function fillTreePanel() {
  const list = document.getElementById('treeList');
  if (!list) return;
  fillCrystalHud();
  const m = loadMeta();
  const tree = m.tree || {};
  list.innerHTML = '';
  META_TREE.forEach(node => {
    const lv = tree[node.id] || 0;
    const maxed = lv >= node.max;
    const cost = maxed ? 0 : node.costs[lv];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tree-node';
    btn.disabled = maxed || (m.crystals || 0) < cost;
    btn.innerHTML = \`<div class="tn">\${node.emoji} \${node.name} · \${lv}/\${node.max}</div><div class="th">\${node.hint}</div><div class="tc">\${maxed ? 'Maks' : cost + ' kristal'}</div>\`;
    btn.addEventListener('click', () => buyTreeNode(node.id));
    list.appendChild(btn);
  });
}`;

const newFillTree = `function fillTreePanel() {
  const list = document.getElementById('treeList');
  if (!list) return;
  fillCrystalHud();
  const m = loadMeta();
  const lang = getGameLang();
  const isEn = (lang === 'en');
  const tree = m.tree || {};
  list.innerHTML = '';

  // Update Asra Sanctuary UI headers & dialogue
  const spkEl = document.querySelector('.asra-speaker-name');
  if (spkEl) spkEl.textContent = isEn ? "🔮 Pilgrim Asra's Sanctuary" : "🔮 Gezgin Asra'nın Sığınağı";
  const quoteEl = document.querySelector('.asra-dialogue-quote');
  if (quoteEl) quoteEl.textContent = isEn
    ? '"Welcome, weary knight... This is a sacred sanctuary beyond the cycle. Offer the primordial crystals you have gathered, and I shall temper your flesh, blade, and strides for eternity."'
    : '"Her döngü seni biraz daha biler Gökalp... Topladığın kadim kristalleri bana sun; canını, kılıcını ve adımlarını ebediyen perçinleyeyim."';
  const cLab = document.querySelector('.asra-crystal-label');
  if (cLab) cLab.textContent = isEn ? 'Current Crystals:' : 'Mevcut Kristal:';
  const cBtn = document.getElementById('treeCloseBtn');
  if (cBtn) cBtn.textContent = isEn ? 'Return to Battle ⚔️' : 'Savaşa Dön ⚔️';

  META_TREE.forEach(node => {
    const lv = tree[node.id] || 0;
    const maxed = lv >= node.max;
    const cost = maxed ? 0 : node.costs[lv];
    const displayName = isEn ? (node.en_name || node.name) : node.name;
    const displayHint = isEn ? (node.en_hint || node.hint) : node.hint;
    const maxText = isEn ? 'Max' : 'Maks';
    const costUnit = isEn ? 'crystals' : 'kristal';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tree-node';
    btn.disabled = maxed || (m.crystals || 0) < cost;
    btn.innerHTML = \`<div class="tn">\${node.emoji} \${displayName} · \${lv}/\${node.max}</div><div class="th">\${displayHint}</div><div class="tc">\${maxed ? maxText : cost + ' ' + costUnit}</div>\`;
    btn.addEventListener('click', () => buyTreeNode(node.id));
    list.appendChild(btn);
  });
}`;

html = html.replace(oldFillTree, newFillTree);

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully added bilingual support to META_TREE and Asra Sanctuary Hub!');
