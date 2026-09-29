const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const scripts = [];
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[1]);
}

const saveStacks = [];
let currentFrame = 0;
let savesThisFrame = 0;
let restoresThisFrame = 0;

const mockCtx = {
  save: () => {
    savesThisFrame++;
    // record caller stack
    const err = new Error();
    saveStacks.push(err.stack);
  },
  restore: () => {
    restoresThisFrame++;
    if (saveStacks.length > 0) {
      saveStacks.pop();
    }
  },
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  arc: () => {},
  ellipse: () => {},
  fill: () => {},
  stroke: () => {},
  strokeRect: () => {},
  fillRect: () => {},
  clearRect: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  setTransform: () => {},
  setLineDash: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  createPattern: () => ({}),
  measureText: (txt) => ({ width: (txt || '').length * 8 }),
  strokeText: () => {},
  fillText: () => {},
  drawImage: () => {}
};

const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      style: { setProperty: () => {}, getPropertyValue: () => '' },
      dataset: {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
      children: [],
      querySelector: () => null,
      querySelectorAll: () => [],
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      getContext: () => mockCtx,
      width: 400,
      height: 800,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 })
    };
  }
  return elements[id];
}

const sandbox = {
  window: null,
  document: {
    getElementById: (id) => getEl(id),
    createElement: (tag) => {
      const el = getEl('elem_' + Math.random().toString(36).substring(2));
      el.tagName = tag;
      return el;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: {
      classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
      style: {}
    }
  },
  navigator: { vibrate: () => {}, userAgent: 'Android Chrome Mobile' },
  localStorage: {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame: () => {},
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
  setInterval: () => {},
  clearInterval: () => {},
  console: console,
  Math: Math,
  Date: Date,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  addEventListener: () => {},
  removeEventListener: () => {},
  Image: function() { this.onload = () => {}; this.onerror = () => {}; this.src = ''; },
  Audio: function() { this.play = () => Promise.resolve(); this.pause = () => {}; this.cloneNode = () => new sandbox.Audio(); }
};
sandbox.window = sandbox;

const context = vm.createContext(sandbox);

const hook = `
window.__runSingleFrame = function() {
  selectHero('ayaz');
  startRun();
  running = true;
  paused = false;

  for (let i = 0; i < 10; i++) {
    enemies.push({
      x: 200, y: 300, r: 14, hp: 100, maxHp: 100, type: 'skel', subType: 'normal',
      speed: 1.5, vx: 0, vy: 0, angle: 0, frozen: 0, burning: 0, poison: 0,
      shocked: 0, stun: 0, windSlow: 0, bleed: 0, elite: false, eliteAffixes: [],
      aggro: true, dead: false, fsm: { state: 'CHASE', timer: 0 }
    });
  }

  update(1.0, Date.now());
  render();
};
`;

const patchedScript = scripts[1].replace('window._game = {', hook + '\nwindow._game = {');
vm.runInContext(patchedScript, context);

savesThisFrame = 0;
restoresThisFrame = 0;
saveStacks.length = 0;

sandbox.window.__runSingleFrame();

console.log('Single frame saves:', savesThisFrame, 'restores:', restoresThisFrame);
console.log('Unrestored saves remaining:', saveStacks.length);

if (saveStacks.length > 0) {
  console.log('Remaining unrestored call stacks:');
  saveStacks.forEach((st, idx) => {
    console.log(`\n--- Stack ${idx + 1} ---`);
    console.log(st.split('\n').slice(1, 6).join('\n'));
  });
}
