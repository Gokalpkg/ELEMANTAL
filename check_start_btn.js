const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

let pos = 0;
while ((pos = txt.indexOf('startBtn', pos)) !== -1) {
  console.log('Pos:', pos, txt.substring(pos - 30, pos + 100).replace(/\n/g, ' '));
  pos += 8;
}
