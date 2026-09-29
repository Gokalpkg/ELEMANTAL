const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const shadowLines = [];
lines.forEach((l, i) => {
  if (l.includes('shadowBlur')) {
    shadowLines.push({ line: i + 1, content: l.trim() });
  }
});

console.log(`Found ${shadowLines.length} lines with shadowBlur.`);
// Group by context
const contexts = {};
shadowLines.forEach(item => {
  // get surrounding 5 lines
  const start = Math.max(0, item.line - 6);
  const chunk = lines.slice(start, item.line + 2).join('\n');
  const funcMatch = chunk.match(/function\s+([a-zA-Z0-9_]+)/g);
  const funcName = funcMatch ? funcMatch[funcMatch.length - 1] : 'unknown';
  contexts[funcName] = (contexts[funcName] || 0) + 1;
});

console.log('ShadowBlur by function context:', contexts);
console.log('\nFirst 20 lines:');
shadowLines.slice(0, 20).forEach(x => console.log(`L${x.line}: ${x.content}`));
