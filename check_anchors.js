const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('clashPageHeroes exists:', html.includes('id="clashPageHeroes"'));
console.log('clashPageShrine exists:', html.includes('id="clashPageShrine"'));
console.log('fillTreePanel exists:', html.includes('function fillTreePanel()'));
console.log('updateHeroSelectUI exists:', html.includes('function updateHeroSelectUI()'));
console.log('initHeroCarouselStage exists:', html.includes('function initHeroCarouselStage()'));
console.log('initClashNavigation exists:', html.includes('function initClashNavigation()'));
