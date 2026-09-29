const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

console.log('=== FIXING OVERLAY FAB VISIBILITY ===');

// 1. Add CSS :has() and body.overlay-active rules
const fabHidingCss = `
/* Modern CSS :has() and class-based hiding of in-game buttons during any overlay */
body:has(.overlay.show) #stanceFab,
body:has(.overlay.show) #dashFab,
body:has(.overlay.show) #ultFab,
body:has(.overlay.show) #pauseBtn,
body:has(.overlay.show) #skillBar,
body.overlay-active #stanceFab,
body.overlay-active #dashFab,
body.overlay-active #ultFab,
body.overlay-active #pauseBtn,
body.overlay-active #skillBar,
body.in-menu #stanceFab,
body.in-menu #dashFab,
body.in-menu #ultFab,
body.in-menu #pauseBtn,
body.in-menu #skillBar {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
}
`;

c = c.replace('/* Strict In-Menu HUD Isolation', fabHidingCss + '\n/* Strict In-Menu HUD Isolation');

// 2. In loop(), maintain body.overlay-active class
const loopOverlaySyncOld = `if (document.body.classList.contains('in-menu') || overlayVisible('heroSelectOverlay')) {`;
const loopOverlaySyncNew = `document.body.classList.toggle('overlay-active', typeof overlayBusy === 'function' && (overlayBusy() || !running));
  if (document.body.classList.contains('in-menu') || overlayVisible('heroSelectOverlay')) {`;

c = c.replace(loopOverlaySyncOld, loopOverlaySyncNew);

fs.writeFileSync('index.html', c, 'utf8');
console.log('✓ Successfully isolated FABs during overlays.');
