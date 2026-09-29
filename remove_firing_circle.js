const fs = require('fs');

const htmlPath = 'index.html';
let content = fs.readFileSync(htmlPath, 'utf8');

const startStr = '// Auto-Attack Range Circle Indicator';
const endStr = 'ctx.restore();\n  }';

const sIdx = content.indexOf(startStr);
if (sIdx !== -1) {
  const eIdx = content.indexOf(endStr, sIdx);
  if (eIdx !== -1) {
    const fullEnd = eIdx + endStr.length;
    content = content.slice(0, sIdx) + '// ZEN COMBAT: Persistent range circle removed for calm battlefield' + content.slice(fullEnd);
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log('firingRadius block successfully excised!');
  } else {
    console.log('endStr not found');
  }
} else {
  console.log('startStr not found');
}
