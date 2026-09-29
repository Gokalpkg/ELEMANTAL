const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes("type: 'boss'") || l.includes('type:"boss"') || l.includes("function spawnWave") || l.includes("spawnBoss")) {
    console.log((i+1) + ': ' + l.trim());
  }
});
