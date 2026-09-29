const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

console.log('=== FIXING CLASH NAVIGATION COMPLETELY ===');

// 1. Update Bottom Dock Buttons in HTML with inline onclick
content = content.replace(
  '<button type="button" class="clash-dock-btn" id="dockBtnHeroes" data-page="0">',
  '<button type="button" class="clash-dock-btn" id="dockBtnHeroes" onclick="setClashPage(0)" data-page="0">'
);
content = content.replace(
  '<button type="button" class="clash-dock-btn active" id="dockBtnBattle" data-page="1">',
  '<button type="button" class="clash-dock-btn active" id="dockBtnBattle" onclick="setClashPage(1)" data-page="1">'
);
content = content.replace(
  '<button type="button" class="clash-dock-btn" id="dockBtnShrine" data-page="2">',
  '<button type="button" class="clash-dock-btn" id="dockBtnShrine" onclick="setClashPage(2)" data-page="2">'
);

// 2. Add Left and Right floating navigation arrows on Battle page, and back arrows on Heroes & Shrine pages
// In clashPageBattle:
const battleContentTarget = '<div class="battle-hub-content">';
const battleContentReplacement = `<div class="battle-hub-content">
              <!-- Quick Side Navigation Arrows -->
              <button type="button" class="clash-side-arrow clash-arrow-left" onclick="setClashPage(0)" aria-label="Savaşçılar">
                <span class="arrow-sym">‹</span> <span class="arrow-txt">SAVAŞÇILAR</span>
              </button>
              <button type="button" class="clash-side-arrow clash-arrow-right" onclick="setClashPage(2)" aria-label="Güçler">
                <span class="arrow-txt">GÜÇLER</span> <span class="arrow-sym">›</span>
              </button>`;

if (content.includes(battleContentTarget) && !content.includes('clash-side-arrow')) {
  content = content.replace(battleContentTarget, battleContentReplacement);
  console.log('Added side navigation arrows to Battle Hub.');
}

// In clashPageHeroes header:
const heroesHeaderTarget = `<div class="clash-page-header">
              <h2><span class="px-icon px-heroes"></span> SAVAŞÇILAR</h2>
              <p>Yöneteceğin Türk Alpini seç ve gücünü kuşan</p>
            </div>`;
const heroesHeaderReplacement = `<div class="clash-page-header">
              <div class="clash-header-with-back">
                <h2><span class="px-icon px-heroes"></span> SAVAŞÇILAR</h2>
                <button type="button" class="clash-pill-back-btn" onclick="setClashPage(1)">SAVAŞA DÖN ›</button>
              </div>
              <p>Yöneteceğin Türk Alpini seç ve gücünü kuşan</p>
            </div>`;
if (content.includes(heroesHeaderTarget)) {
  content = content.replace(heroesHeaderTarget, heroesHeaderReplacement);
  console.log('Added back button to Heroes page header.');
}

// In clashPageShrine header:
const shrineHeaderTarget = `<div class="clash-page-header">
              <h2><span class="px-icon px-shrine"></span> GÜÇLER & KADİM SUNAK</h2>
              <p>Kalıcı güçlendirmeler ve element sırları</p>
            </div>`;
const shrineHeaderReplacement = `<div class="clash-page-header">
              <div class="clash-header-with-back">
                <button type="button" class="clash-pill-back-btn" onclick="setClashPage(1)">‹ SAVAŞA DÖN</button>
                <h2><span class="px-icon px-shrine"></span> GÜÇLER & SUNAK</h2>
              </div>
              <p>Kalıcı güçlendirmeler ve element sırları</p>
            </div>`;
if (content.includes(shrineHeaderTarget)) {
  content = content.replace(shrineHeaderTarget, shrineHeaderReplacement);
  console.log('Added back button to Shrine page header.');
}

// 3. Add CSS for side arrows, back buttons, and pointer-events protection
const newNavCss = `
/* ========================================================================= */
/* CLASH ROYALE NAVIGATION ARROWS & DOCK POINTER FIX                        */
/* ========================================================================= */
.clash-dock-btn * {
  pointer-events: none !important;
}

.clash-side-arrow {
  position: absolute;
  top: 48%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.88);
  border: 1.5px solid rgba(251, 191, 36, 0.4);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 900;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  z-index: 30;
  backdrop-filter: blur(8px);
  transition: all 0.18s ease;
}

.clash-side-arrow:active {
  transform: translateY(-50%) scale(0.92);
  background: rgba(245, 158, 11, 0.35);
  border-color: #f59e0b;
}

.clash-arrow-left {
  left: 8px;
}

.clash-arrow-right {
  right: 8px;
}

.arrow-sym {
  font-size: 16px;
  line-height: 1;
  color: #fde047;
}

.arrow-txt {
  font-size: 10px;
  letter-spacing: 0.5px;
}

.clash-header-with-back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
}

.clash-pill-back-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fde047;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clash-pill-back-btn:active {
  transform: scale(0.95);
  background: rgba(245, 158, 11, 0.25);
}
`;

if (!content.includes('.clash-side-arrow {')) {
  content = content.replace('/* Fixed Bottom Dock */', newNavCss + '\n/* Fixed Bottom Dock */');
  console.log('Added Navigation CSS.');
}

// 4. Robust JS Navigation Engine
const oldNavEngineStart = content.indexOf('// CLASH ROYALE 3-SCREEN HORIZONTAL SWIPE & NAVIGATION ENGINE');
const oldNavEngineEnd = content.indexOf('function goMainMenu() {');

const newNavEngine = `// CLASH ROYALE 3-SCREEN HORIZONTAL SWIPE & NAVIGATION ENGINE
// =========================================================================
let curClashPage = 1; // 0: Savaşçılar (Sol) | 1: Savaş (Orta) | 2: Güçler (Sağ)

function setClashPage(pageIndex, animate = true) {
  curClashPage = Math.max(0, Math.min(2, pageIndex));
  const track = document.getElementById('clashTrack');
  if (track) {
    track.style.transition = animate ? 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'none';
    track.style.transform = 'translateX(-' + (curClashPage * 33.333333) + '%)';
  }

  // Update Bottom Dock Active State
  const dockBtns = [
    document.getElementById('dockBtnHeroes'),
    document.getElementById('dockBtnBattle'),
    document.getElementById('dockBtnShrine')
  ];
  dockBtns.forEach((btn, idx) => {
    if (btn) btn.classList.toggle('active', idx === curClashPage);
  });

  // Populate dynamic data on entering page
  if (curClashPage === 0) {
    if (typeof renderHeroRosterCards === 'function') renderHeroRosterCards();
  } else if (curClashPage === 1) {
    if (typeof updateHeroShowcase === 'function') updateHeroShowcase();
  } else if (curClashPage === 2) {
    if (typeof fillTreePanel === 'function') fillTreePanel();
  }
}

// Expose globally to window
window.setClashPage = setClashPage;

function initClashNavigation() {
  // Bind Bottom Dock Tabs with immediate response
  const dockMap = [
    { id: 'dockBtnHeroes', page: 0 },
    { id: 'dockBtnBattle', page: 1 },
    { id: 'dockBtnShrine', page: 2 }
  ];

  dockMap.forEach(({ id, page }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.onclick = (e) => {
      e.preventDefault();
      setClashPage(page);
    };
    btn.ontouchstart = (e) => {
      e.preventDefault();
      setClashPage(page);
    };
  });

  // Bind Shrine Sub-Tabs (Tree vs Codex)
  const tabTree = document.getElementById('subTabTreeBtn');
  const tabGuide = document.getElementById('subTabGuideBtn');
  const paneTree = document.getElementById('clashTreePane');
  const paneGuide = document.getElementById('clashGuidePane');
  if (tabTree && tabGuide && paneTree && paneGuide) {
    const showTree = (e) => {
      if (e) e.preventDefault();
      tabTree.classList.add('active'); tabGuide.classList.remove('active');
      paneTree.style.display = 'block'; paneGuide.style.display = 'none';
    };
    const showGuide = (e) => {
      if (e) e.preventDefault();
      tabGuide.classList.add('active'); tabTree.classList.remove('active');
      paneGuide.style.display = 'block'; paneTree.style.display = 'none';
    };
    tabTree.onclick = showTree; tabTree.ontouchstart = showTree;
    tabGuide.onclick = showGuide; tabGuide.ontouchstart = showGuide;
  }

  // Global Screen Swipe Detection for startOverlay
  const ov = document.getElementById('startOverlay');
  if (ov && !ov._clashSwipeBound) {
    ov._clashSwipeBound = true;
    let startX = 0;
    let startY = 0;
    let isTracking = false;

    ov.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      // Do not intercept if touching a button or interactive control
      if (e.target.closest('button') || e.target.closest('.clash-bottom-dock')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isTracking = true;
    }, { passive: true });

    ov.addEventListener('touchend', (e) => {
      if (!isTracking || !e.changedTouches || !e.changedTouches.length) return;
      isTracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // Horizontal swipe: > 35px and more horizontal than vertical
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 0.8) {
        if (dx < 0 && curClashPage < 2) {
          // Swiped Left -> Reveal right page
          setClashPage(curClashPage + 1);
        } else if (dx > 0 && curClashPage > 0) {
          // Swiped Right -> Reveal left page
          setClashPage(curClashPage - 1);
        }
      }
    }, { passive: true });
  }

  // Ensure default page is 1 (Battle Hub)
  setClashPage(1, false);
}

window.initClashNavigation = initClashNavigation;
`;

if (oldNavEngineStart !== -1 && oldNavEngineEnd !== -1) {
  content = content.slice(0, oldNavEngineStart) + newNavEngine + '\n\n' + content.slice(oldNavEngineEnd);
  console.log('Replaced clashNavJs with robust engine.');
} else {
  console.error('Could not find bounds of old clashNavJs!');
}

// 5. Ensure goMainMenu calls initClashNavigation
const oldGoMainMenu = `function goMainMenu() {
  initHeroCarouselStage();
  running = false; paused = false; menuOpen = false;
  document.body.classList.add('in-menu');
  emptyState();
  buildSkillButtons();
  updateHud();
  hideAllOverlays();
  fillBestLabel();
  fillMetaGoal();
  fillCrystalHud();
  syncDevModeUI();
  updateHeroSelectUI();
  document.getElementById('startOverlay').classList.add('show');
}`;

const newGoMainMenu = `function goMainMenu() {
  initHeroCarouselStage();
  running = false; paused = false; menuOpen = false;
  document.body.classList.add('in-menu');
  emptyState();
  buildSkillButtons();
  updateHud();
  hideAllOverlays();
  fillBestLabel();
  fillMetaGoal();
  fillCrystalHud();
  syncDevModeUI();
  updateHeroSelectUI();
  document.getElementById('startOverlay').classList.add('show');
  if (typeof initClashNavigation === 'function') initClashNavigation();
}`;

if (content.includes(oldGoMainMenu)) {
  content = content.replace(oldGoMainMenu, newGoMainMenu);
  console.log('Added initClashNavigation call inside goMainMenu.');
} else {
  console.log('goMainMenu already modified or not found exact string.');
}

// 6. Also ensure final bootstrap calls initClashNavigation()
const finalBootTarget = `if (typeof goMainMenu === 'function') {
  goMainMenu();
}`;
const finalBootReplacement = `if (typeof goMainMenu === 'function') {
  goMainMenu();
}
if (typeof initClashNavigation === 'function') {
  initClashNavigation();
}`;

if (content.includes(finalBootTarget) && !content.includes('initClashNavigation();\nrequestAnimationFrame')) {
  content = content.replace(finalBootTarget, finalBootReplacement);
  console.log('Added initClashNavigation to final bootstrap.');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== FIX COMPLETED SUCCESSFULLY ===');
