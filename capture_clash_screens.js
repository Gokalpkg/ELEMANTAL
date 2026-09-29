const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// For battle screen capture (Center - Page 1)
let battleHtml = html
  .replace('<div class="clash-track" id="clashTrack">', '<div class="clash-track" id="clashTrack" style="transform: translateX(-33.333333%) !important;">');
fs.writeFileSync('test_clash_battle.html', battleHtml, 'utf8');

// For heroes screen capture (Left - Page 0)
let heroesHtml = html
  .replace('<button type="button" class="clash-dock-btn active" id="dockBtnBattle"', '<button type="button" class="clash-dock-btn" id="dockBtnBattle"')
  .replace('<button type="button" class="clash-dock-btn" id="dockBtnHeroes"', '<button type="button" class="clash-dock-btn active" id="dockBtnHeroes"')
  .replace('<div class="clash-track" id="clashTrack">', '<div class="clash-track" id="clashTrack" style="transform: translateX(0%) !important;">')
  .replace('let curClashPage = 1;', 'let curClashPage = 0;');
fs.writeFileSync('test_clash_heroes.html', heroesHtml, 'utf8');

// For shrine screen capture (Right - Page 2)
let shrineHtml = html
  .replace('<button type="button" class="clash-dock-btn active" id="dockBtnBattle"', '<button type="button" class="clash-dock-btn" id="dockBtnBattle"')
  .replace('<button type="button" class="clash-dock-btn" id="dockBtnShrine"', '<button type="button" class="clash-dock-btn active" id="dockBtnShrine"')
  .replace('<div class="clash-track" id="clashTrack">', '<div class="clash-track" id="clashTrack" style="transform: translateX(-66.666666%) !important;">')
  .replace('let curClashPage = 1;', 'let curClashPage = 2;');
fs.writeFileSync('test_clash_shrine.html', shrineHtml, 'utf8');

console.log('Capture test HTML files created with inline transform!');
