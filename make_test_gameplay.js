const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject auto-start after 400ms for gameplay screenshot
html = html.replace('requestAnimationFrame(loop);', `
setTimeout(() => {
  if (typeof startRun === 'function') {
    startRun();
    console.log('Automated run started for screenshot capture!');
  }
}, 300);
requestAnimationFrame(loop);`);

fs.writeFileSync('test_gameplay.html', html, 'utf8');
console.log('test_gameplay.html written.');
