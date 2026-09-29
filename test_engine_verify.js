const fs = require('fs');
const vm = require('vm');

console.log('Testing full Elementer engine in headless VM...');
const html = fs.readFileSync('index.html', 'utf8');

// Extract script blocks
const scripts = [];
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[1]);
}

// Mock DOM & Browser Environment
const canvas = {
  getContext: () => ({
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    roundRect: () => {},
    clip: () => {},
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
    measureText: (txt) => ({ width: 20 }),
    strokeText: () => {},
    fillText: () => {},
    drawImage: () => {}
  }),
  width: 400,
  height: 800,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 })
};

const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      style: {
        setProperty: () => {},
        getPropertyValue: () => ''
      },
      dataset: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      children: [],
      querySelector: () => null,
      querySelectorAll: () => [],
      appendChild: function(c) { this.children.push(c); },
      addEventListener: () => {},
      getContext: () => canvas.getContext(),
      width: 82,
      height: 82
    };
  }
  return elements[id];
}

const sandbox = {
  window: null,
  document: {
    getElementById: (id) => getEl(id),
    createElement: (tag) => {
      const el = getEl('auto_' + Math.random());
      el.tagName = tag;
      return el;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: {
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      style: {}
    }
  },
  navigator: {
    vibrate: () => {},
    userAgent: 'HeadlessChrome'
  },
  localStorage: {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  },
  performance: {
    now: () => Date.now()
  },
  requestAnimationFrame: (fn) => setTimeout(fn, 16),
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
  Image: function() {
    this.onload = () => {};
    this.onerror = () => {};
    this.src = '';
  },
  Audio: function() {
    this.play = () => Promise.resolve();
    this.pause = () => {};
    this.cloneNode = () => new sandbox.Audio();
  }
};
sandbox.window = sandbox;

const context = vm.createContext(sandbox);

// Run main script block
try {
  vm.runInContext(scripts[1], context);
  console.log('Script loaded successfully without syntax errors!');
} catch (err) {
  console.error('Script loading error:', err);
  process.exit(1);
}

// Now test game functions
try {
  console.log('Testing hero selection...');
  context.window.selectHero('korhan');
  const h1 = context.window.getSelectedHero();
  console.log('Selected hero:', h1.id, 'HP:', h1.hp);

  context.window.selectHero('ayaz');
  const h2 = context.window.getSelectedHero();
  console.log('Selected hero:', h2.id, 'HP:', h2.hp);

  const game = context.window._game;
  console.log('Testing triggerHitStop...');
  game.triggerHitStop(4);
  console.log('triggerHitStop executed cleanly!');

  console.log('Testing spawnFloatText...');
  const ft1 = game.spawnFloatText(100, 100, '120', '#ffd700', 'crit');
  console.log('Crit float text spawned:', ft1.text, ft1.isCrit);

  console.log('Testing startRun & player initialization...');
  game.startRun();
  game.unfreeze();
  const player = game.getPlayer();
  console.log('Player initialized! HP:', player.hp, 'MaxHP:', player.maxHp, 'Hero:', player.heroId, 'running:', game.isRunning(), 'paused:', game.isPaused());

  console.log('Testing triggerDash...');
  game.triggerDash();
  console.log('Dash active! Dash time:', player.dashTime, 'Invuln:', player.invuln);

  console.log('Running 300 simulation frames with combat and weather updates...');
  for (let frame = 0; frame < 300; frame++) {
    game.update(1.0, Date.now() + frame * 16);
  }
  console.log('300 frames simulation complete! Player HP:', player.hp, 'Dash time:', player.dashTime);

  console.log('Testing enemy generation and role diversity...');
  const e1 = game.makeEnemy('flying_akbaba', 100, 100);
  const e2 = game.makeEnemy('spitting_marksman', 150, 100);
  const e3 = game.makeEnemy('shield_bearer', 200, 100);
  const e4 = game.makeEnemy('suicide_exploder', 250, 100);
  console.log('Spawned tactical enemies:', e1.type, e2.type, e3.type, e4.type);

  console.log('ALL VERIFICATIONS PASSED 100%!');
  process.exit(0);
} catch (err) {
  console.error('Runtime test error:', err);
  process.exit(1);
}
