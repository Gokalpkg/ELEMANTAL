const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('=== REFINING CLASH PAGE BACKGROUNDS & CARD WIDTHS ===');

// 1. Give .clash-page its own solid high-tech dark background so other tabs/canvases never bleed through
const oldClashPageCss = `.clash-page {
  width: 33.333333%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative; /* REQUIRED for side arrows */
  padding: 14px 14px 76px 14px; /* Space for bottom dock */
}`;

const newClashPageCss = `.clash-page {
  width: 33.333333%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 12px 12px 76px 12px;
  background: radial-gradient(circle at 50% 20%, #111726 0%, #080b13 100%);
}`;

if (html.includes(oldClashPageCss)) {
  html = html.replace(oldClashPageCss, newClashPageCss);
  console.log('1. Updated .clash-page with solid opaque gradient background.');
}

// 2. Refine .shrine-vault-card, .shrine-tree-grid, and buttons padding
const oldShrineCardStyles = `  .shrine-vault-card {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95));
    border: 1.5px solid rgba(168, 85, 247, 0.35);
    border-radius: 16px;
    padding: 12px 16px;
    margin: 4px 12px 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    text-align: center;
  }
  .shrine-vault-card .vault-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #c084fc;
    display: block;
    margin-bottom: 2px;
  }
  .shrine-vault-card .vault-display {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 4px;
  }
  .shrine-vault-card .vault-val {
    font-size: 26px;
    font-weight: 900;
    color: #38bdf8;
    text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
    letter-spacing: 0.04em;
  }
  .shrine-vault-card .vault-unit {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
  }
  .shrine-vault-card .vault-tip {
    font-size: 11px;
    color: #94a3b8;
    opacity: 0.85;
  }

  .shrine-tree-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px 14px;
  }

  .shrine-talent-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: rgba(15, 23, 42, 0.88);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    transition: transform 0.12s, border-color 0.2s, background 0.2s;
    user-select: none;
    -webkit-user-select: none;
  }`;

const newShrineCardStyles = `  .shrine-vault-card {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95));
    border: 1.5px solid rgba(168, 85, 247, 0.35);
    border-radius: 16px;
    padding: 12px 14px;
    margin: 4px 0 10px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    text-align: center;
    box-sizing: border-box;
  }
  .shrine-vault-card .vault-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #c084fc;
    display: block;
    margin-bottom: 2px;
  }
  .shrine-vault-card .vault-display {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 4px;
  }
  .shrine-vault-card .vault-val {
    font-size: 26px;
    font-weight: 900;
    color: #38bdf8;
    text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
    letter-spacing: 0.04em;
  }
  .shrine-vault-card .vault-unit {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
  }
  .shrine-vault-card .vault-tip {
    font-size: 11px;
    color: #94a3b8;
    opacity: 0.85;
  }

  .shrine-tree-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 0 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .shrine-talent-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(15, 23, 42, 0.88);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    transition: transform 0.12s, border-color 0.2s, background 0.2s;
    user-select: none;
    -webkit-user-select: none;
    box-sizing: border-box;
  }`;

if (html.includes(oldShrineCardStyles)) {
  html = html.replace(oldShrineCardStyles, newShrineCardStyles);
  console.log('2. Refined shrine card widths and zeroed out double margins.');
}

// 3. Make sure upgrade button has min-width
const oldUpBtn = `  .talent-upgrade-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    user-select: none;
    touch-action: manipulation;
    transition: transform 0.12s;
  }`;

const newUpBtn = `  .talent-upgrade-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    min-width: 72px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    user-select: none;
    touch-action: manipulation;
    transition: transform 0.12s;
    box-sizing: border-box;
  }`;

if (html.includes(oldUpBtn)) {
  html = html.replace(oldUpBtn, newUpBtn);
  console.log('3. Refined .talent-upgrade-btn min-width.');
}

// 4. In goMainMenu(), clear _canvasFloatTexts
const oldGoMenu = "function goMainMenu() {";
const newGoMenu = `function goMainMenu() {
  if (typeof _canvasFloatTexts !== 'undefined') _canvasFloatTexts.length = 0;`;

if (html.includes(oldGoMenu) && !html.includes(newGoMenu)) {
  html = html.replace(oldGoMenu, newGoMenu);
  console.log('4. Cleared _canvasFloatTexts on goMainMenu().');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('=== REFINEMENTS APPLIED CLEANLY ===');
