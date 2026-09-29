const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const heroes = ['ayaz', 'umay', 'mergen', 'ulgen'];
const lines = content.split('\n');

heroes.forEach(h => {
  console.log(`\n=== References to Hero: ${h} ===`);
  lines.forEach((l, i) => {
    if (l.includes(h)) {
      console.log(`Line ${i + 1}: ${l.trim().substring(0, 110)}`);
    }
  });
});
