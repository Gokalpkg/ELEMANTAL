const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('--- AUDITING index.html ---');
console.log('File size:', content.length, 'bytes');

// 1. Script compilation
const scriptMatches = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
console.log('Script blocks count:', scriptMatches ? scriptMatches.length : 0);

if (scriptMatches) {
  scriptMatches.forEach((s, idx) => {
    const code = s.replace(/^<script[\s\S]*?>/i, '').replace(/<\/script>$/i, '');
    try {
      new Function(code);
      console.log(`Script block ${idx + 1} (${code.split('\n').length} lines): Syntax OK!`);
    } catch (e) {
      console.error(`Script block ${idx + 1} ERROR:`, e.message);
    }
  });
}

// 2. Check for common bug patterns:
// - unbalanced save/restore in functions
const fnRegex = /function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g;
let match;
const funcs = [];
while ((match = fnRegex.exec(content)) !== null) {
  funcs.push({ name: match[1], index: match.index });
}
console.log('Total functions found:', funcs.length);

// 3. Check save/restore balance in the entire script
const saves = (content.match(/ctx\.save\(\)/g) || []).length;
const restores = (content.match(/ctx\.restore\(\)/g) || []).length;
console.log(`ctx.save() count: ${saves}, ctx.restore() count: ${restores}`);
if (saves !== restores) {
  console.warn(`WARNING: ctx.save (${saves}) does not match ctx.restore (${restores})! Diff: ${saves - restores}`);
} else {
  console.log('ctx.save/restore balance is PERFECT!');
}

// 4. Check BIOMES configuration
console.log('\n--- Checking BIOMES & Boss Configs ---');
const biomeStart = content.indexOf('const BIOMES =');
if (biomeStart !== -1) {
  const biomeEnd = content.indexOf('];', biomeStart);
  console.log('BIOMES found around index:', biomeStart);
}

// 5. Check HUD & Health Bar elements
console.log('\n--- Checking HUD Elements ---');
['health-bar', 'hp-bar', 'pause-btn', 'joystick', 'hud'].forEach(id => {
  console.log(`Contains "${id}":`, content.includes(id));
});
