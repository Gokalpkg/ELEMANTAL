const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

console.log('=== DEEP SYSTEMS AUDIT ===\n');

// 1. Audio: check all playSfx calls vs SFX definition
console.log('--- 1. Audio SFX Check ---');
const playSfxCalls = new Set();
const sfxRegex = /playSfx\(['"]([^'"]+)['"]/g;
let m;
while ((m = sfxRegex.exec(content)) !== null) {
  playSfxCalls.add(m[1]);
}
console.log('SFX types called in code:', Array.from(playSfxCalls));

// Find sound synthesis or SFX dictionary
const sfxDefIdx = content.indexOf('function playSfx');
if (sfxDefIdx !== -1) {
  const sfxChunk = content.substring(sfxDefIdx, sfxDefIdx + 3000);
  console.log('playSfx implementation found');
}

// 2. Bosses: check all 10 bosses
console.log('\n--- 2. Boss Types & Handlers ---');
const bossTypes = [
  'titan', 'ifrit', 'sugar', 'treant', 'leviathan', 
  'ketchup', 'raijin', 'yeti', 'sandTitan', 'archon'
];
bossTypes.forEach(bt => {
  const count = (content.match(new RegExp('\\b' + bt + '\\b', 'g')) || []).length;
  console.log(`Boss '${bt}' occurrences: ${count}`);
});

// 3. Check for any undefined variables in loops/renders
console.log('\n--- 3. Canvas & Render Exceptions ---');
const renderFnIdx = content.indexOf('function render()');
if (renderFnIdx !== -1) {
  console.log('render() function found at index', renderFnIdx);
}

// 4. Check Dev Wave Selector
console.log('\n--- 4. Dev Wave Selector ---');
const devSelectIdx = content.indexOf('openDevSelect');
console.log('openDevSelect found:', devSelectIdx !== -1);

// 5. Check Combos & Synergies completeness
console.log('\n--- 5. Combo Kits Completeness ---');
const comboIdx = content.indexOf('const COMBO_KITS =');
if (comboIdx !== -1) {
  const comboEnd = content.indexOf('};', comboIdx);
  const chunk = content.substring(comboIdx, comboEnd + 2);
  const comboKeys = chunk.match(/['"][a-z]+_[a-z]+['"]/g) || [];
  console.log('Defined combo pairs count:', comboKeys.length);
}

// 6. Check Heroes passives & abilities
console.log('\n--- 6. Heroes Passive Implementations ---');
const heroes = ['bamsi', 'korhan', 'karacor', 'ayaz', 'umay', 'kayra', 'mergen', 'ulgen'];
heroes.forEach(h => {
  const count = (content.match(new RegExp('\\b' + h + '\\b', 'g')) || []).length;
  console.log(`Hero '${h}' occurrences: ${count}`);
});
