const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. UPDATE BUILD_ID TO MASTER V10
const oldBuildId = `const BUILD_ID = '20260921Q';`;
const newBuildId = `const BUILD_ID = '20260923-MASTER-V10';`;

if (html.includes(oldBuildId)) {
  html = html.replace(oldBuildId, newBuildId);
  console.log('1. Updated BUILD_ID to 20260923-MASTER-V10!');
} else {
  console.error('Warning: oldBuildId not found!');
}

// 2. ADD SHRINE OVERLAY TO HANDLEMOBILEBACKBUTTON
const oldBackBtnLogic = `  if (document.getElementById('treeOverlay') && document.getElementById('treeOverlay').classList.contains('show')) {
    closeTree();
    return true;
  }`;

const newBackBtnLogic = `  if (document.getElementById('shrineOverlay') && document.getElementById('shrineOverlay').classList.contains('show')) {
    closeShrineModal();
    return true;
  }
  if (document.getElementById('treeOverlay') && document.getElementById('treeOverlay').classList.contains('show')) {
    closeTree();
    return true;
  }`;

if (html.includes(oldBackBtnLogic)) {
  html = html.replace(oldBackBtnLogic, newBackBtnLogic);
  console.log('2. Added shrineOverlay to handleMobileBackButton()!');
} else {
  console.error('Warning: oldBackBtnLogic not found!');
}

// 3. INJECT MASTER EDITION BADGE IN MAIN MENU (STARTOVERLAY)
const oldStartBtn = `<button class="btn btn-main-play" id="startBtn" type="button">`;
const newStartBtn = `<div class="master-version-pill" style="font-size:11px; font-weight:800; color:#38bdf8; text-align:center; margin-bottom:8px; letter-spacing:0.5px; opacity:0.92; text-shadow:0 0 10px rgba(56,189,248,0.5);">
          ⚡ MASTER EDİSYON v10.0 · 110-SAAT HARDCORE ROGUELITE
        </div>
        <button class="btn btn-main-play" id="startBtn" type="button">`;

if (html.includes(oldStartBtn)) {
  html = html.replace(oldStartBtn, newStartBtn);
  console.log('3. Injected Master Edition badge into main menu!');
} else {
  console.error('Warning: oldStartBtn not found!');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('version.txt', '20260923-MASTER-V10\n', 'utf8');
console.log('Step 10 Master Final applied successfully!');
