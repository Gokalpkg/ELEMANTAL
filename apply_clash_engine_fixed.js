const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// 1. Rename duplicate heroRosterGrid in heroSelectOverlay
content = content.replace(
  '<div class="hero-roster-grid" id="heroRosterGrid"></div>',
  '<div class="hero-roster-grid" id="heroSelectOverlayGrid"></div>'
);

// 2. Inject clashNavJs right before function goMainMenu()
const clashNavJs = `
// =========================================================================
// CLASH ROYALE 3-SCREEN HORIZONTAL SWIPE & NAVIGATION ENGINE
// =========================================================================
let curClashPage = 1; // 0: Savaşçılar (Sol) | 1: Savaş (Orta) | 2: Güçler (Sağ)

function setClashPage(pageIndex, animate = true) {
  curClashPage = Math.max(0, Math.min(2, pageIndex));
  const track = document.getElementById('clashTrack');
  if (track) {
    track.style.transition = animate ? 'transform 0.36s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
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

function initClashNavigation() {
  // Bind Bottom Dock Tabs
  const bHeroes = document.getElementById('dockBtnHeroes');
  const bBattle = document.getElementById('dockBtnBattle');
  const bShrine = document.getElementById('dockBtnShrine');
  if (bHeroes) bindTouchButton(bHeroes, () => setClashPage(0));
  if (bBattle) bindTouchButton(bBattle, () => setClashPage(1));
  if (bShrine) bindTouchButton(bShrine, () => setClashPage(2));

  // Bind Shrine Sub-Tabs (Tree vs Codex)
  const tabTree = document.getElementById('subTabTreeBtn');
  const tabGuide = document.getElementById('subTabGuideBtn');
  const paneTree = document.getElementById('clashTreePane');
  const paneGuide = document.getElementById('clashGuidePane');
  if (tabTree && tabGuide && paneTree && paneGuide) {
    bindTouchButton(tabTree, () => {
      tabTree.classList.add('active'); tabGuide.classList.remove('active');
      paneTree.style.display = 'block'; paneGuide.style.display = 'none';
    });
    bindTouchButton(tabGuide, () => {
      tabGuide.classList.add('active'); tabTree.classList.remove('active');
      paneGuide.style.display = 'block'; paneTree.style.display = 'none';
    });
  }

  // Horizontal Swipe Detection on Viewport
  const vp = document.getElementById('clashViewport');
  if (vp && !vp._swipeAttached) {
    vp._swipeAttached = true;
    let startX = 0;
    let startY = 0;
    let isTracking = false;

    vp.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isTracking = true;
    }, { passive: true });

    vp.addEventListener('touchend', (e) => {
      if (!isTracking || !e.changedTouches.length) return;
      isTracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // Only handle horizontal swipes (dx > 45px and predominantly horizontal)
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0 && curClashPage < 2) {
          // Swipe Left -> Next Page
          setClashPage(curClashPage + 1);
        } else if (dx > 0 && curClashPage > 0) {
          // Swipe Right -> Prev Page
          setClashPage(curClashPage - 1);
        }
      }
    }, { passive: true });
  }

  // Set default page to 1 (Battle)
  setClashPage(1, false);
}
`;

if (!content.includes('function initClashNavigation')) {
  content = content.replace('function goMainMenu() {', clashNavJs + '\nfunction goMainMenu() {');
  console.log('Injected clashNavJs before goMainMenu.');
}

// 3. Make sure goMainMenu calls initClashNavigation
if (!content.includes('initClashNavigation();')) {
  content = content.replace(
    "document.getElementById('startOverlay').classList.add('show');",
    "document.getElementById('startOverlay').classList.add('show');\n  initClashNavigation();"
  );
  console.log('Added initClashNavigation call to goMainMenu.');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== Clash Engine Fixed & Injected Successfully ===');
