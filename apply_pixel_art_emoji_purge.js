const fs = require('fs');
const path = require('path');

console.log('=== TOTAL EMOJI PURGE & PIXEL-ART ANIMATED GRAPHIC SYSTEM ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// 1. CRAFTED PIXEL-ART SVG SPRITE REPOSITORY & CSS ANIMATIONS
// =========================================================================
const pixelIconsCss = `
/* =========================================================================
   PIXEL-ART ANIMATED ICON SYSTEM (High-Grade Offline SVG Graphics)
   ========================================================================= */
.px-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: -0.16em;
  width: 1.18em;
  height: 1.18em;
  flex-shrink: 0;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  shape-rendering: crispEdges;
  position: relative;
}
.px-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Micro-Animations */
.px-anim-beat {
  animation: pxBeat 0.9s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}
@keyframes pxBeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.18); }
  28% { transform: scale(1.04); }
  42% { transform: scale(1.14); }
  70% { transform: scale(1); }
}

.px-anim-shimmer {
  animation: pxShimmer 2.2s ease-in-out infinite;
}
@keyframes pxShimmer {
  0%, 100% { filter: drop-shadow(0 0 2px #22d3ee); }
  50% { filter: drop-shadow(0 0 7px #67e8f9) brightness(1.28); }
}

.px-anim-twinkle {
  animation: pxTwinkle 1.8s ease-in-out infinite;
}
@keyframes pxTwinkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(6deg); filter: drop-shadow(0 0 5px #fbbf24); }
}

.px-anim-spin {
  animation: pxSpin 7s linear infinite;
}
@keyframes pxSpin {
  100% { transform: rotate(360deg); }
}

.px-anim-float {
  animation: pxFloat 2s ease-in-out infinite;
}
@keyframes pxFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.px-anim-flame {
  animation: pxFlame 0.35s steps(2) infinite;
}
@keyframes pxFlame {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.12) scaleX(0.92); }
}

.px-anim-zap {
  animation: pxZap 1.5s ease-in-out infinite;
}
@keyframes pxZap {
  0%, 88%, 100% { transform: scale(1); filter: none; }
  90% { transform: scale(1.16) skewX(-4deg); filter: drop-shadow(0 0 6px #facc15); }
  94% { transform: scale(0.96); }
}

.px-anim-glow {
  animation: pxGlow 2.4s ease-in-out infinite;
}
@keyframes pxGlow {
  0%, 100% { filter: drop-shadow(0 0 3px #eab308); }
  50% { filter: drop-shadow(0 0 8px #fde047); }
}
`;

// Insert CSS if not present
if (!content.includes('.px-anim-beat')) {
  content = content.replace('/* Strict In-Menu HUD Isolation', pixelIconsCss + '\n/* Strict In-Menu HUD Isolation');
}

// =========================================================================
// 2. PIXEL-ART JS ENGINE DEFINITIONS
// =========================================================================
const pixelEngineCode = `
// =========================================================================
// BESPOKE PIXEL-ART SVG SPRITE ENGINE (Zero Emojis System)
// =========================================================================
const PX_ICONS = {
  heart: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 5h2v-2h3v2h2v-2h3v2h2v4h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-4z" fill="#dc2626"/><path d="M4 5h2v2h-2zM9 5h2v2h-2z" fill="#fca5a5"/><path d="M2 5h1v4h2v2h2v2h2v-2h2v-2h2v-4h1v-1h-2v-1h-3v1h-1v1h-2v-1h-1v-1h-3v1h-2z" fill="#991b1b" fill-rule="evenodd"/></svg>',
  gem: '<svg viewBox="0 0 16 16" fill="none"><path d="M5 2h6l4 4-7 8-7-8 4-4z" fill="#0891b2"/><path d="M5 2h6l3 4h-12l3-4z" fill="#22d3ee"/><path d="M5 2l-3 4 6 7v-11z" fill="#06b6d4"/><path d="M8 2l3 4-3 7 3-7z" fill="#67e8f9"/><path d="M6 3h2v2h-2z" fill="#ffffff" opacity="0.8"/></svg>',
  star: '<svg viewBox="0 0 16 16" fill="none"><path d="M7 1h2v3h2v2h3v2h-3v2h-2v3h-2v-3h-2v-2h-3v-2h3v-2h2v-3z" fill="#f59e0b"/><path d="M7 3h2v3h2v2h-2v3h-2v-3h-2v-2h2v-3z" fill="#fde047"/><rect x="7" y="6" width="2" height="2" fill="#ffffff"/></svg>',
  swords: '<svg viewBox="0 0 16 16" fill="none"><path d="M1 1h4v2h-2v2h-2zM15 1h-4v2h2v2h2z" fill="#b45309"/><path d="M3 3l10 10-1 1-10-10 1-1zM13 3l-10 10 1 1 10-10-1-1z" fill="#94a3b8"/><path d="M4 2l10 10M12 2l-10 10" stroke="#f8fafc" stroke-width="1"/><rect x="2" y="2" width="2" height="2" fill="#d97706"/><rect x="12" y="2" width="2" height="2" fill="#d97706"/></svg>',
  shield: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2h10v6l-5 6-5-6v-6z" fill="#1e293b"/><path d="M4 3h8v5l-4 5-4-5v-5z" fill="#334155"/><path d="M5 4h6v4l-3 4-3-4v-4z" fill="#3b82f6"/><path d="M7 5h2v5h-2zM6 7h4v1h-4z" fill="#93c5fd"/></svg>',
  lightning: '<svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/><path d="M8 3l-4 5h4l-1 5 5-6h-4l3-4z" fill="#fef08a"/><rect x="7" y="5" width="2" height="2" fill="#ffffff"/></svg>',
  fire: '<svg viewBox="0 0 16 16" fill="none"><path d="M7 2h2v2h2v3h1v4h-1v2h-2v1h-3v-1h-2v-2h-1v-4h1v-3h2v-2h1v-1z" fill="#dc2626"/><path d="M7 4h2v2h1v3h1v3h-1v1h-3v-1h-1v-3h1v-3h-1v-1h1v-1z" fill="#f97316"/><path d="M7 7h2v3h-2z" fill="#fde047"/><rect x="7" y="8" width="2" height="2" fill="#ffffff"/></svg>',
  ice: '<svg viewBox="0 0 16 16" fill="none"><path d="M7 1h2v14h-2zM1 7h14v2h-14zM3 3l10 10-1.4 1.4-10-10zM13 3l-10 10 1.4 1.4 10-10z" fill="#38bdf8"/><rect x="6" y="6" width="4" height="4" fill="#ffffff"/></svg>',
  wind: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 5h8a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4h-8v-2zM4 9h9a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4h-9v-2zM1 13h6a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4h-6v-2z" fill="#bae6fd"/><path d="M3 6h6v1h-6zM5 10h7v1h-7z" fill="#ffffff"/></svg>',
  nature: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2c-4 0-6 4-6 7 0 3 3 5 6 5s6-2 6-5c0-3-2-7-6-7z" fill="#16a34a"/><path d="M8 4c-2 0-4 3-4 5 0 2 2 3 4 3s4-1 4-3c0-2-2-5-4-5z" fill="#22c55e"/><path d="M8 5v6M6 8l2-1 2 1" stroke="#86efac" stroke-width="1"/></svg>',
  water: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2c-1 2-4 6-4 9 0 3 2 4 4 4s4-1 4-4c0-3-3-7-4-9z" fill="#0284c7"/><path d="M7 5c-1 2-2 4-2 6 0 2 1 2 2 2s2 0 2-2c0-2-1-4-2-6z" fill="#38bdf8"/><rect x="6" y="8" width="2" height="2" fill="#ffffff"/></svg>',
  trophy: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2h10v6c0 3-2 5-5 5s-5-2-5-5v-6z" fill="#ca8a04"/><path d="M4 3h8v5c0 2-2 4-4 4s-4-2-4-4v-5z" fill="#facc15"/><path d="M1 4h2v3h-2c-1 0-1-3 0-3zM13 4h2c1 0 1 3 0 3h-2v-3z" fill="#eab308"/><rect x="7" y="13" width="2" height="1" fill="#ca8a04"/><rect x="5" y="14" width="6" height="2" fill="#a16207"/><rect x="7" y="5" width="2" height="2" fill="#ef4444"/></svg>',
  crown: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 12h12v2h-12zM2 4l3 4 3-5 3 5 3-4v8h-12v-8z" fill="#ca8a04"/><path d="M3 6l2 3 3-4 3 4 2-3v5h-10v-5z" fill="#facc15"/><rect x="7" y="10" width="2" height="2" fill="#ef4444"/><rect x="4" y="10" width="1" height="1" fill="#3b82f6"/><rect x="11" y="10" width="1" height="1" fill="#3b82f6"/></svg>',
  wolf: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2l3 5-1 4 3 3 3-3-1-4 3-5-2 1-3 2-3-2-2-1z" fill="#0284c7"/><path d="M4 4l2 3-1 3 3 2 3-2-1-3 2-3-2 1-2 1-2-1-2-1z" fill="#38bdf8"/><rect x="5" y="8" width="2" height="1" fill="#facc15"/><rect x="9" y="8" width="2" height="1" fill="#facc15"/><rect x="7" y="11" width="2" height="1" fill="#0f172a"/></svg>',
  shrine: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 14h12v2h-12zM3 4h10v2h-10zM4 2l4-1 4 1v2h-8v-2z" fill="#64748b"/><path d="M4 6h2v8h-2zM10 6h2v8h-2z" fill="#94a3b8"/><rect x="7" y="8" width="2" height="3" fill="#38bdf8"/><rect x="7" y="12" width="2" height="2" fill="#cbd5e1"/></svg>',
  heroes: '<svg viewBox="0 0 16 16" fill="none"><path d="M4 3h8v6c0 3-2 4-4 4s-4-1-4-4v-6z" fill="#64748b"/><path d="M5 4h6v5c0 2-1 3-3 3s-3-1-3-3v-5z" fill="#94a3b8"/><path d="M2 5l2 2v-3zM14 5l-2 2v-3z" fill="#d97706"/><rect x="6" y="7" width="4" height="2" fill="#0f172a"/><rect x="7.5" y="9" width="1" height="3" fill="#64748b"/></svg>',
  scroll: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="#fef3c7"/><path d="M4 4h7v1h-7zM4 6h8v1h-8zM4 8h6v1h-6zM4 10h7v1h-7z" fill="#78350f"/><circle cx="10" cy="11" r="1.5" fill="#dc2626"/></svg>',
  gear: '<svg viewBox="0 0 16 16" fill="none"><path d="M7 1h2v2h-2zM7 13h2v2h-2zM1 7h2v2h-2zM13 7h2v2h-2zM3 3l2 1-1 1-2-1zM11 11l2 1-1 1-2-1zM11 3l1 2-1 1-1-2zM3 11l1 2-1 1-1-2z" fill="#b45309"/><circle cx="8" cy="8" r="4" fill="#d97706"/><circle cx="8" cy="8" r="2" fill="#1e293b"/></svg>',
  bag: '<svg viewBox="0 0 16 16" fill="none"><path d="M6 3h4v2h-4z" fill="#78350f"/><path d="M3 5h10v8c0 1-1 2-2 2h-6c-1 0-2-1-2-2v-8z" fill="#92400e"/><path d="M4 6h8v3h-8z" fill="#b45309"/><rect x="7" y="8" width="2" height="2" fill="#facc15"/></svg>',
  respec: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4v2l4-3-4-3v2z" fill="#a855f7"/><path d="M7 5a3 3 0 1 1 3 3" stroke="#c084fc" stroke-width="1"/></svg>',
  sound: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 6h3l4-4v12l-4-4h-3v-4z" fill="#f59e0b"/><path d="M12 5c1 1 1 5 0 6" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><path d="M14 3c2 2 2 8 0 10" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/></svg>',
  sound_off: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 6h3l4-4v12l-4-4h-3v-4z" fill="#94a3b8"/><path d="M12 6l3 4M15 6l-3 4" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>',
  haptic: '<svg viewBox="0 0 16 16" fill="none"><rect x="5" y="2" width="6" height="12" rx="1" fill="#64748b"/><rect x="6" y="3" width="4" height="10" fill="#94a3b8"/><path d="M2 5c-1 2-1 4 0 6M14 5c1 2 1 4 0 6" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/></svg>',
  magnet: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2h3v6c0 1 1 2 2 2s2-1 2-2v-6h3v6c0 3-2 5-5 5s-5-2-5-5v-6z" fill="#dc2626"/><rect x="3" y="2" width="3" height="3" fill="#cbd5e1"/><rect x="10" y="2" width="3" height="3" fill="#3b82f6"/><path d="M7 13l2-2-1-1 2-2" stroke="#facc15" stroke-width="1"/></svg>',
  moon: '<svg viewBox="0 0 16 16" fill="none"><path d="M9 2a6 6 0 1 0 5 8 5 5 0 0 1-5-8z" fill="#93c5fd"/><path d="M8 4a4 4 0 0 0 3 5 4 4 0 0 1-3-5z" fill="#bfdbfe"/></svg>',
  skull: '<svg viewBox="0 0 16 16" fill="none"><path d="M4 3h8v6h-1v2h-1v2h-4v-2h-1v-2h-1v-6z" fill="#e2e8f0"/><rect x="5" y="6" width="2" height="3" fill="#0f172a"/><rect x="9" y="6" width="2" height="3" fill="#0f172a"/><rect x="7" y="11" width="2" height="2" fill="#0f172a"/></svg>',
  chest: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 4h12v10h-12z" fill="#78350f"/><path d="M2 4h12v3h-12z" fill="#92400e"/><rect x="2" y="7" width="12" height="1" fill="#facc15"/><rect x="7" y="7" width="2" height="3" fill="#facc15"/><rect x="7.5" y="8" width="1" height="1" fill="#0f172a"/></svg>',
  potion: '<svg viewBox="0 0 16 16" fill="none"><path d="M6 2h4v2h-1v2l4 6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2l4-6v-2h-1v-2z" fill="#065f46"/><path d="M4 10l2-3 2 1 2-1 2 3v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2z" fill="#10b981"/><circle cx="7" cy="11" r="1" fill="#a7f3d0"/></svg>',
  play: '<svg viewBox="0 0 16 16" fill="none"><path d="M4 2l10 6-10 6v-12z" fill="#f59e0b"/><path d="M5 4l7 4-7 4v-8z" fill="#fde047"/></svg>',
  pause: '<svg viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="3" height="12" fill="#38bdf8"/><rect x="10" y="2" width="3" height="12" fill="#38bdf8"/><rect x="4" y="3" width="1" height="10" fill="#ffffff"/><rect x="11" y="3" width="1" height="10" fill="#ffffff"/></svg>',
  sun: '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="4" fill="#f59e0b"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l2 2M11 11l2 2M3 13l2-2M11 5l2-2" stroke="#facc15" stroke-width="1.5"/></svg>',
  dagger: '<svg viewBox="0 0 16 16" fill="none"><path d="M12 2l2 2-7 7-2-2 7-7z" fill="#cbd5e1"/><path d="M13 1l2 2-1 1-2-2 1-1z" fill="#ffffff"/><path d="M4 10l2 2-3 3-1-1 2-4z" fill="#92400e"/><rect x="5" y="9" width="3" height="1" fill="#facc15" transform="rotate(45 5 9)"/></svg>',
  bow: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2c6 0 10 4 10 10l-1 1c0-5-4-9-9-9z" fill="#b45309"/><path d="M3 3l9 9" stroke="#f8fafc" stroke-width="1"/><path d="M5 11l6-6M11 5h-2M11 5v2" stroke="#facc15" stroke-width="1"/></svg>',
  crit: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4 4 1-3 3 1 5-4-2-4 2 1-5-3-3 4-1z" fill="#ef4444"/><path d="M8 3l1.5 3 3 0.7-2.3 2.3 0.7 3.5-2.9-1.5-2.9 1.5 0.7-3.5-2.3-2.3 3-0.7z" fill="#fde047"/></svg>',
  blood: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2c-1 2-4 5-4 8 0 2 2 4 4 4s4-2 4-4c0-3-3-6-4-8z" fill="#991b1b"/><path d="M8 4c-1 1-2 3-2 5 0 1 1 2 2 2s2-1 2-2c0-2-1-4-2-5z" fill="#dc2626"/><rect x="7" y="7" width="1" height="2" fill="#fca5a5"/></svg>',
  dice: '<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#f8fafc"/><circle cx="5" cy="5" r="1" fill="#0f172a"/><circle cx="11" cy="5" r="1" fill="#0f172a"/><circle cx="8" cy="8" r="1" fill="#dc2626"/><circle cx="5" cy="11" r="1" fill="#0f172a"/><circle cx="11" cy="11" r="1" fill="#0f172a"/></svg>',
  target: '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" stroke-width="1.5"/><circle cx="8" cy="8" r="3" stroke="#f8fafc" stroke-width="1.5"/><circle cx="8" cy="8" r="1.5" fill="#ef4444"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#ef4444" stroke-width="1.5"/></svg>'
};

const EMOJI_TO_PX = {
  '❤️': 'heart', '❤': 'heart',
  '⭐': 'star', '🌟': 'star', '✨': 'star',
  '💎': 'gem',
  '⚔️': 'swords', '⚔': 'swords', '🗡️': 'dagger', '🗡': 'dagger',
  '🛡️': 'shield', '🛡': 'shield',
  '⚡': 'lightning', '🌩️': 'lightning', '🌩': 'lightning',
  '🔥': 'fire',
  '❄️': 'ice', '❄': 'ice', '🧊': 'ice',
  '🌪️': 'wind', '🌪': 'wind', '💨': 'wind',
  '🌿': 'nature', '🌱': 'nature', '🍃': 'nature', '🪨': 'shield',
  '💧': 'water', '🌊': 'water',
  '🌑': 'moon', '🌙': 'moon',
  '🏆': 'trophy',
  '👑': 'crown',
  '🏛️': 'shrine', '🏛': 'shrine',
  '👥': 'heroes',
  '📜': 'scroll', '📖': 'scroll',
  '⚙️': 'gear', '⚙': 'gear', '🛠️': 'gear', '🛠': 'gear',
  '🎒': 'bag', '📦': 'chest',
  '🔄': 'respec',
  '🔊': 'sound', '🔇': 'sound_off',
  '📳': 'haptic', '📴': 'haptic',
  '🧲': 'magnet',
  '🐺': 'wolf',
  '💀': 'skull', '☠️': 'skull', '☠': 'skull',
  '🏹': 'bow',
  '🎯': 'target',
  '🎲': 'dice', '🍀': 'dice',
  '🧪': 'potion',
  '▶': 'play', '▶️': 'play',
  '⏸': 'pause', '⏸️': 'pause',
  '☀️': 'sun', '☀': 'sun',
  '💥': 'crit',
  '🩸': 'blood'
};

function renderPixelIcon(key, animClass, size) {
  const k = (EMOJI_TO_PX[key] || key || 'gem').toLowerCase();
  const svg = PX_ICONS[k] || PX_ICONS.gem;
  const anim = animClass || (
    k === 'heart' ? 'px-anim-beat' :
    k === 'gem' ? 'px-anim-shimmer' :
    k === 'star' ? 'px-anim-twinkle' :
    k === 'gear' ? 'px-anim-spin' :
    k === 'fire' ? 'px-anim-flame' :
    k === 'lightning' ? 'px-anim-zap' :
    k === 'trophy' ? 'px-anim-glow' :
    k === 'wind' ? 'px-anim-float' : ''
  );
  const sizeStyle = size ? \`style="width:\${size}px;height:\${size}px;"\` : '';
  return \`<span class="px-icon px-\${k} \${anim}" \${sizeStyle}>\${svg}</span>\`;
}

function cleanEmojiText(text) {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/(\\p{Extended_Pictographic}|\\uD83C[\\uDF00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDD00-\\uDFFF])/gu, '')
             .replace(/\\s{2,}/g, ' ')
             .trim();
}

function replaceEmojisWithPx(html) {
  if (!html || typeof html !== 'string') return html;
  return html.replace(/(\\p{Extended_Pictographic}|\\uD83C[\\uDF00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDD00-\\uDFFF])/gu, (m) => {
    return renderPixelIcon(m);
  });
}
`;

// Insert pixel engine code at start of main script block
if (!content.includes('const PX_ICONS =')) {
  content = content.replace('// --- GÖK TENGRİ & TÜRK MİTOLOJİSİ SES MOTORU', pixelEngineCode + '\n// --- GÖK TENGRİ & TÜRK MİTOLOJİSİ SES MOTORU');
}

// =========================================================================
// 3. STATIC HTML PURGE & PIXEL REPLACEMENTS
// =========================================================================
console.log('Replacing static HTML emojis with pixel icons...');

// Top header counters
content = content.replace('<span class="stat-icon">🏆</span>', '<span class="px-icon px-trophy px-anim-glow">' + 
  '<svg viewBox="0 0 16 16" fill="none"><path d="M3 2h10v6c0 3-2 5-5 5s-5-2-5-5v-6z" fill="#ca8a04"/><path d="M4 3h8v5c0 2-2 4-4 4s-4-2-4-4v-5z" fill="#facc15"/><path d="M1 4h2v3h-2c-1 0-1-3 0-3zM13 4h2c1 0 1 3 0 3h-2v-3z" fill="#eab308"/><rect x="7" y="13" width="2" height="1" fill="#ca8a04"/><rect x="5" y="14" width="6" height="2" fill="#a16207"/><rect x="7" y="5" width="2" height="2" fill="#ef4444"/></svg></span>');

content = content.replace('<span id="crystalBank">💎 0</span>', '<span id="crystalBank"><span class="px-icon px-gem px-anim-shimmer"><svg viewBox="0 0 16 16" fill="none"><path d="M5 2h6l4 4-7 8-7-8 4-4z" fill="#0891b2"/><path d="M5 2h6l3 4h-12l3-4z" fill="#22d3ee"/><path d="M5 2l-3 4 6 7v-11z" fill="#06b6d4"/><path d="M8 2l3 4-3 7 3-7z" fill="#67e8f9"/><path d="M6 3h2v2h-2z" fill="#ffffff" opacity="0.8"/></svg></span> 0</span>');

// KUT Button
content = content.replace('>🏆 KUT</button>', '><span class="px-icon px-trophy px-anim-glow"><svg viewBox="0 0 16 16" fill="none"><path d="M3 2h10v6c0 3-2 5-5 5s-5-2-5-5v-6z" fill="#ca8a04"/><path d="M4 3h8v5c0 2-2 4-4 4s-4-2-4-4v-5z" fill="#facc15"/><path d="M1 4h2v3h-2c-1 0-1-3 0-3zM13 4h2c1 0 1 3 0 3h-2v-3z" fill="#eab308"/><rect x="7" y="13" width="2" height="1" fill="#ca8a04"/><rect x="5" y="14" width="6" height="2" fill="#a16207"/><rect x="7" y="5" width="2" height="2" fill="#ef4444"/></svg></span> KUT</button>');

// Live HUD elements
content = content.replace('<span class="meter-icon">❤️</span>', '<span class="meter-icon"><span class="px-icon px-heart px-anim-beat"><svg viewBox="0 0 16 16" fill="none"><path d="M2 5h2v-2h3v2h2v-2h3v2h2v4h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-4z" fill="#dc2626"/><path d="M4 5h2v2h-2zM9 5h2v2h-2z" fill="#fca5a5"/></svg></span></span>');

content = content.replace('<span class="meter-icon">⭐</span>', '<span class="meter-icon"><span class="px-icon px-star px-anim-twinkle"><svg viewBox="0 0 16 16" fill="none"><path d="M7 1h2v3h2v2h3v2h-3v2h-2v3h-2v-3h-2v-2h-3v-2h3v-2h2v-3z" fill="#f59e0b"/><path d="M7 3h2v3h2v2h-2v3h-2v-3h-2v-2h2v-3z" fill="#fde047"/></svg></span></span>');

content = content.replace('<span id="crystalHud">💎 0</span>', '<span id="crystalHud"><span class="px-icon px-gem px-anim-shimmer"><svg viewBox="0 0 16 16" fill="none"><path d="M5 2h6l4 4-7 8-7-8 4-4z" fill="#0891b2"/><path d="M5 2h6l3 4h-12l3-4z" fill="#22d3ee"/></svg></span> 0</span>');

content = content.replace('<button type="button" id="sfxHudBtn" aria-label="Ses">🔊</button>', '<button type="button" id="sfxHudBtn" aria-label="Ses"><span class="px-icon px-sound"><svg viewBox="0 0 16 16" fill="none"><path d="M3 6h3l4-4v12l-4-4h-3v-4z" fill="#f59e0b"/><path d="M12 5c1 1 1 5 0 6" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><path d="M14 3c2 2 2 8 0 10" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/></svg></span></button>');

content = content.replace('<span class="stance-icon" id="stanceIcon">⚔️</span>', '<span class="stance-icon" id="stanceIcon"><span class="px-icon px-swords"><svg viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10-1 1-10-10 1-1zM13 3l-10 10 1 1 10-10-1-1z" fill="#94a3b8"/></svg></span></span>');

content = content.replace('<span class="dash-icon">💨</span>', '<span class="dash-icon"><span class="px-icon px-wind px-anim-float"><svg viewBox="0 0 16 16" fill="none"><path d="M2 5h8a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4h-8v-2zM4 9h9a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4h-9v-2z" fill="#bae6fd"/></svg></span></span>');

content = content.replace('<span class="ult-icon">⚡</span>', '<span class="ult-icon"><span class="px-icon px-lightning px-anim-zap"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span></span>');

content = content.replace('<div class="menu-brand-icon">⚡</div>', '<div class="menu-brand-icon"><span class="px-icon px-lightning px-anim-zap" style="width:28px;height:28px;"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span></div>');

// Hero Card Attributes
content = content.replace('<span class="rpg-stat-name">❤️ CAN (HP)</span>', '<span class="rpg-stat-name"><span class="px-icon px-heart px-anim-beat"><svg viewBox="0 0 16 16" fill="none"><path d="M2 5h2v-2h3v2h2v-2h3v2h2v4h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-4z" fill="#dc2626"/></svg></span> CAN (HP)</span>');

content = content.replace('<span class="rpg-stat-name">⚡ HIZ</span>', '<span class="rpg-stat-name"><span class="px-icon px-lightning"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span> HIZ</span>');

content = content.replace('<span class="rpg-stat-name">⚔️ HASAR GÜCÜ</span>', '<span class="rpg-stat-name"><span class="px-icon px-swords"><svg viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10-1 1-10-10 1-1zM13 3l-10 10 1 1 10-10-1-1z" fill="#94a3b8"/></svg></span> HASAR GÜCÜ</span>');

content = content.replace('<span class="rpg-stat-name" id="heroStatSpecialLbl">✨ UZMANLIK</span>', '<span class="rpg-stat-name" id="heroStatSpecialLbl"><span class="px-icon px-star"><svg viewBox="0 0 16 16" fill="none"><path d="M7 1h2v3h2v2h3v2h-3v2h-2v3h-2v-3h-2v-2h-3v-2h3v-2h2v-3z" fill="#f59e0b"/></svg></span> UZMANLIK</span>');

content = content.replace('<span>👥 TÜM KAHRAMANLARI LİSTELE</span>', '<span><span class="px-icon px-heroes"><svg viewBox="0 0 16 16" fill="none"><path d="M4 3h8v6c0 3-2 4-4 4s-4-1-4-4v-6z" fill="#94a3b8"/></svg></span> TÜM KAHRAMANLARI LİSTELE</span>');

content = content.replace('<span class="passive-spark">⚡</span>', '<span class="passive-spark"><span class="px-icon px-lightning px-anim-zap"><svg viewBox="0 0 16 16" fill="none"><path d="M9 1l-6 7h5l-2 7 8-9h-5l4-5z" fill="#facc15"/></svg></span></span>');

content = content.replace('<span class="weapon-icon">⚔️</span>', '<span class="weapon-icon"><span class="px-icon px-swords"><svg viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10-1 1-10-10 1-1zM13 3l-10 10 1 1 10-10-1-1z" fill="#94a3b8"/></svg></span></span>');

// Main Action Buttons
content = content.replace('<span>▶ SAVAŞA BAŞLA</span>', '<span><span class="px-icon px-play"><svg viewBox="0 0 16 16" fill="none"><path d="M4 2l10 6-10 6v-12z" fill="#f59e0b"/></svg></span> SAVAŞA BAŞLA</span>');

content = content.replace('<span>☀️ GÜNLÜK RUN</span>', '<span><span class="px-icon px-sun px-anim-spin"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="4" fill="#f59e0b"/></svg></span> GÜNLÜK RUN</span>');

content = content.replace('<span>⚔️ SAVAŞA DEVAM ET</span>', '<span><span class="px-icon px-swords"><svg viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10-1 1-10-10 1-1zM13 3l-10 10 1 1 10-10-1-1z" fill="#94a3b8"/></svg></span> SAVAŞA DEVAM ET</span>');

content = content.replace('🔄 Kristalleri Sıfırla & Geri Al', '<span class="px-icon px-respec"><svg viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4v2l4-3-4-3v2z" fill="#a855f7"/></svg></span> Kristalleri Sıfırla & Geri Al');

content = content.replace('🎒 Kuşanılan Elementler & Sinerjiler', '<span class="px-icon px-bag"><svg viewBox="0 0 16 16" fill="none"><path d="M3 5h10v8c0 1-1 2-2 2h-6c-1 0-2-1-2-2v-8z" fill="#92400e"/></svg></span> Kuşanılan Elementler & Sinerjiler');

// Bottom Navigation items
content = content.replace('<div class="dock-item-icon">👥</div>', '<div class="dock-item-icon"><span class="px-icon px-heroes" style="width:20px;height:20px;"><svg viewBox="0 0 16 16" fill="none"><path d="M4 3h8v6c0 3-2 4-4 4s-4-1-4-4v-6z" fill="#94a3b8"/></svg></span></div>');

content = content.replace('<div class="dock-item-icon">🏛️</div>', '<div class="dock-item-icon"><span class="px-icon px-shrine" style="width:20px;height:20px;"><svg viewBox="0 0 16 16" fill="none"><path d="M2 14h12v2h-12zM3 4h10v2h-10zM4 6h2v8h-2zM10 6h2v8h-2z" fill="#94a3b8"/></svg></span></div>');

content = content.replace('<div class="dock-item-icon">📜</div>', '<div class="dock-item-icon"><span class="px-icon px-scroll" style="width:20px;height:20px;"><svg viewBox="0 0 16 16" fill="none"><path d="M3 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="#fef3c7"/></svg></span></div>');

content = content.replace('<div class="dock-item-icon">⚙️</div>', '<div class="dock-item-icon"><span class="px-icon px-gear px-anim-spin" style="width:20px;height:20px;"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="4" fill="#d97706"/><circle cx="8" cy="8" r="2" fill="#1e293b"/></svg></span></div>');

// Hero card title and indicator cleanups
content = content.replace('id="heroElemIndicator">🌪️ RÜZGAR</div>', 'id="heroElemIndicator"><span class="px-icon px-wind"></span> RÜZGAR</div>');
content = content.replace('id="heroCardTitle">🌪️ BAMSI</span>', 'id="heroCardTitle">BAMSI</span>');

// =========================================================================
// 4. KUT ACHIEVEMENTS OVERHAUL (Remove unicode emojis, render pixel icons)
// =========================================================================
console.log('Overhauling Kut achievements with pixel art icons...');

const newAchievementsDef = `const ACHIEVEMENTS = [
  { id: 'gokboru', icon: 'wolf', title: 'Gökbörü', desc: '500 Canavar Avla', reward: 100, goal: 500 },
  { id: 'yel_muhafizi', icon: 'wind', title: 'Yel Muhafızı', desc: 'Bamsi ile 25 Mermi Savuştur (Parry)', reward: 75, goal: 25 },
  { id: 'ates_hukmu', icon: 'fire', title: 'Ateşin Hükmü', desc: 'İlk Bossu Yok Et', reward: 150, goal: 1 },
  { id: 'yildirim_ustasi', icon: 'lightning', title: 'Yıldırım Ustası', desc: '3 Element Füzyonunu Aç', reward: 120, goal: 3 },
  { id: 'sarsilmaz_alp', icon: 'shield', title: 'Sarsılmaz Alp', desc: '1 Dalgayı Hasar Almadan Temizle', reward: 50, goal: 1 },
  { id: 'hazine_avcisi', icon: 'gem', title: 'Hazine Avcısı', desc: 'Toplam 1000 Kristal Topla', reward: 100, goal: 1000 },
  { id: 'bozkir_hani', icon: 'crown', title: 'Bozkır Hanı', desc: 'Dalga 10 Ulaş', reward: 200, goal: 10 },
  { id: 'gece_hakimi', icon: 'moon', title: 'Karanlığın Sonu', desc: 'Gece Diyarını Tamamla', reward: 250, goal: 1 }
];`;

content = content.replace(/const ACHIEVEMENTS = \[[\s\S]*?\];/, newAchievementsDef);

// Update openAchievementsModal to render icon SVG instead of unicode emoji
const newModalRenderLogic = `function openAchievementsModal() {
  const modal = document.getElementById('achievementsOverlay');
  if (!modal) return;
  const list = document.getElementById('achievementsList');
  if (list) {
    const prog = getAchProgress();
    list.innerHTML = ACHIEVEMENTS.map(a => {
      const cur = prog[a.id] || 0;
      const done = cur >= a.goal;
      const iconSvg = renderPixelIcon(a.icon || 'trophy', 'px-anim-float', 28);
      const gemSvg = renderPixelIcon('gem', 'px-anim-shimmer', 14);
      return \`
        <div class="ach-card \${done ? 'done' : ''}">
          <div style="margin-right:10px;display:flex;align-items:center;">\${iconSvg}</div>
          <div class="ach-info">
            <div class="ach-title">\${a.title}</div>
            <div class="ach-desc">\${a.desc}</div>
            <div class="ach-prog">\${Math.min(cur, a.goal)} / \${a.goal}</div>
          </div>
          <div class="ach-reward">\${gemSvg} \${a.reward}</div>
        </div>
      \`;
    }).join('');
  }
  modal.classList.add('show');
  playSfx('ui', 0.3);
}`;

content = content.replace(/function openAchievementsModal\(\)\s*\{[\s\S]*?playSfx\('ui',\s*0\.3\);\s*\}/, newModalRenderLogic);

// =========================================================================
// 5. CHOICE CARDS & LEVEL-UP ICONS (Convert .emoji span to animated pixel SVG)
// =========================================================================
console.log('Upgrading choice card level-up icons to animated pixel art...');

content = content.replace(
  '`<span class="emoji" style="font-size:38px;margin:4px 0 6px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));">${m.emoji}</span>`',
  '`<div style="font-size:36px;margin:4px 0 6px;display:flex;justify-content:center;">${renderPixelIcon(m.icon || m.emoji || "gem", "px-anim-float", 38)}</div>`'
);

content = content.replace(
  '`<span class="emoji" style="font-size:36px;margin:6px 0;">${s.emoji}</span>`',
  '`<div style="font-size:36px;margin:6px 0;display:flex;justify-content:center;">${renderPixelIcon(s.icon || s.emoji || "star", "px-anim-float", 36)}</div>`'
);

// Ancient tree nodes
content = content.replace(
  'btn.innerHTML = `<div class="tn">${node.emoji} ${displayName}',
  'btn.innerHTML = `<div class="tn">${renderPixelIcon(node.emoji || node.id, "px-anim-float", 16)} ${displayName}'
);

// Relic inspector in pause menu
content = content.replace(
  'chipsContainer.innerHTML = chips.map(c => `<span class="pause-relic-chip">${c.emoji} ${c.name}</span>`).join(\'\');',
  'chipsContainer.innerHTML = chips.map(c => `<span class="pause-relic-chip">${renderPixelIcon(c.emoji, "", 14)} ${c.name}</span>`).join(\'\');'
);

// =========================================================================
// 6. CANVAS FILLTEXT WITH EMOJIS CLEANUP
// =========================================================================
console.log('Cleaning canvas fillText emoji strings...');

content = content.replace("ctx.fillText('🏮 KADİM MİHRAP', sx, floatY - 14);", "ctx.fillText('KADİM MİHRAP', sx, floatY - 14);");
content = content.replace("ctx.fillText('👑 EFSANEVİ SANDIK', d.x, cy - 20);", "ctx.fillText('EFSANEVİ SANDIK', d.x, cy - 20);");
content = content.replace("ctx.fillText('⚡ SERSEMLİK (%300 İNFAZ) ⚡', en.x, cy - en.r - 20 + bob);", "ctx.fillText('SERSEMLİK (%300 İNFAZ)', en.x, cy - en.r - 20 + bob);");
content = content.replace("ctx.fillText('👑 ELİT', en.x, by - 3);", "ctx.fillText('ELİT', en.x, by - 3);");
content = content.replace("ctx.fillText('⚠ KADİM DİYAR HÜKÜMDARI BELİRDİ ⚠', 0, -14);", "ctx.fillText('KADİM DİYAR HÜKÜMDARI BELİRDİ', 0, -14);");

// Replace raw emoji draw with pixel flame on canvas
const canvasFlameDraw = `
    // PROCEDURAL PIXEL FLAME DRAW (Zero emoji)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 6, cy - 8, 12, 16);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(cx - 4, cy - 5, 8, 11);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(cx - 2, cy - 2, 4, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1, cy - 1, 2, 3);
`;
content = content.replace("ctx.fillText('🔥', cx, cy);", canvasFlameDraw);

// =========================================================================
// 7. FLOAT TEXT CLEANUP
// =========================================================================
console.log('Sanitizing spawnFloatText calls from unicode emojis...');

content = content.replace(/'🧲 MIKNATIS İNCİSİ!'/g, "'MIKNATIS İNCİSİ!'");
content = content.replace(/'🧲 KUTUPSAL ÇEKİM!'/g, "'KUTUPSAL ÇEKİM!'");
content = content.replace(/'🧲 MIKNATIS KIYAMETİ!'/g, "'MIKNATIS KIYAMETİ!'");
content = content.replace(/'🧲 MAGNET PEARL!'/g, "'MAGNET PEARL!'");
content = content.replace(/'🧲 POLAR MAGNET!'/g, "'POLAR MAGNET!'");
content = content.replace(/'🧲 MAGNET APOCALYPSE!'/g, "'MAGNET APOCALYPSE!'");

// In spawnFloatText, automatically clean unicode emojis if any string contains them
const floatTextSanitizeHook = `function spawnFloatText(x, y, text, color, mode) {
  if (typeof text === 'string') {
    text = text.replace(/(\\p{Extended_Pictographic}|\\uD83C[\\uDF00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDD00-\\uDFFF])/gu, '').trim();
  }`;

content = content.replace(/function spawnFloatText\(x,\s*y,\s*text,\s*color,\s*mode\)\s*\{/, floatTextSanitizeHook);

// Write updated content back to index.html
fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== OVERHAUL APPLIED TO index.html SUCCESSFULLY ===');
