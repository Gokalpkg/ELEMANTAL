const fs = require('fs');
const html = fs.readFileSync('test_clash_shrine.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Toprak') || l.includes('Boss x1.5')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
