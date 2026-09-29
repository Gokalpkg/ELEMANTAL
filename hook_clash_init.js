const fs = require('fs');
let txt = fs.readFileSync('index.html', 'utf8');

const targetRegex = /document\.getElementById\('startOverlay'\)\.classList\.add\('show'\);/;

if (txt.includes('initClashNavigation()')) {
  console.log('initClashNavigation already in index.html!');
} else {
  txt = txt.replace(targetRegex, "document.getElementById('startOverlay').classList.add('show');\n  if (typeof initClashNavigation === 'function') initClashNavigation();");
  fs.writeFileSync('index.html', txt, 'utf8');
  console.log('Hooked initClashNavigation successfully!');
}
