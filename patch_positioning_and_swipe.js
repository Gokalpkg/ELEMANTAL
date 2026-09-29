const fs = require('fs');

const htmlPath = 'index.html';
let content = fs.readFileSync(htmlPath, 'utf8');

console.log('=== APPLYING ROCK-SOLID NAVIGATION & POSITIONING ===');

// 1. Ensure .clash-page and .battle-hub-content have position: relative
content = content.replace(
  `.clash-page {
  width: 33.333333%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 14px 76px 14px; /* Space for bottom dock */
}`,
  `.clash-page {
  width: 33.333333%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative; /* REQUIRED for side arrows */
  padding: 14px 14px 76px 14px; /* Space for bottom dock */
}`
);

// 2. Add position: relative to .battle-hub-content
content = content.replace(
  `.battle-hub-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
}`,
  `.battle-hub-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
  position: relative;
  width: 100%;
}`
);

// 3. Make .clash-side-arrow more prominent and clickable
const oldArrowCss = `.clash-side-arrow {
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
}`;

const newArrowCss = `.clash-side-arrow {
  position: absolute;
  top: 36%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
  border: 2px solid #f59e0b;
  color: #fde047;
  font-size: 12px;
  font-weight: 900;
  padding: 10px 14px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7), 0 0 14px rgba(245, 158, 11, 0.4);
  cursor: pointer;
  z-index: 50;
  touch-action: manipulation;
  user-select: none;
  transition: all 0.18s ease;
}`;

if (content.includes(oldArrowCss)) {
  content = content.replace(oldArrowCss, newArrowCss);
  console.log('Updated side arrow CSS to prominent style.');
}

// 4. Boost .clash-bottom-dock z-index to 9999
content = content.replace(
  'z-index: 25;\n  padding-bottom: env(safe-area-inset-bottom, 4px);',
  'z-index: 9999;\n  padding-bottom: env(safe-area-inset-bottom, 4px);'
);

// 5. Update Swipe logic to capture swipe from ANYWHERE on startOverlay
const oldSwipeLogic = `  // Global Screen Swipe Detection for startOverlay
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
  }`;

const newSwipeLogic = `  // Global Screen Swipe Detection for startOverlay (Captures swipe anywhere on screen)
  const ov = document.getElementById('startOverlay');
  if (ov && !ov._clashSwipeBound) {
    ov._clashSwipeBound = true;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isTracking = false;

    ov.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      // Don't swipe if touching inside bottom dock
      if (e.target.closest('.clash-bottom-dock')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isTracking = true;
    }, { passive: true });

    ov.addEventListener('touchend', (e) => {
      if (!isTracking || !e.changedTouches || !e.changedTouches.length) return;
      isTracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const elapsed = Date.now() - startTime;

      // Horizontal swipe threshold: > 30px, < 800ms, predominantly horizontal
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 0.7 && elapsed < 800) {
        if (dx < 0 && curClashPage < 2) {
          // Swiped Left -> Go right to next page
          setClashPage(curClashPage + 1);
        } else if (dx > 0 && curClashPage > 0) {
          // Swiped Right -> Go left to previous page
          setClashPage(curClashPage - 1);
        }
      }
    }, { passive: true });
  }`;

if (content.includes(oldSwipeLogic)) {
  content = content.replace(oldSwipeLogic, newSwipeLogic);
  console.log('Updated global swipe logic.');
} else {
  console.log('oldSwipeLogic target not matched, checking alternative...');
}

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('Applied updates to index.html.');
