const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `  // FINAL BOOTSTRAP: Start at Main Menu
if (typeof goMainMenu === 'function') {
  goMainMenu();
}`;

const replacement = `  // AUTOMATED COMBAT CAPTURE WITH ZEN FLOOR
  startRun();
  if (typeof pickElement === 'function') {
    pickElement('fire');
    if (typeof closeReward === 'function') closeReward();
  }
  // Spawn test enemies around player to demonstrate clean visual clarity
  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      spawnEnemy(player.x + 80 * Math.cos(i * 1.57), player.y + 80 * Math.sin(i * 1.57), 'crawler');
    }
    showDedeKorkutProphecy("Gök Tengri kılıcına güç versin! Bozkırın alpı yenilmezdir.");
    spawnFloatText(player.x, player.y - 30, 'BLOK! x2', '#38bdf8', true);
    spawnFloatText(player.x + 35, player.y - 50, '185!', '#ffd700', false, true);
  }, 150);`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  console.log('Successfully replaced goMainMenu with automated combat start!');
} else {
  console.error('Target not found in index.html!');
}

fs.writeFileSync('test_combat_view.html', html, 'utf8');
console.log('test_combat_view.html generated.');
