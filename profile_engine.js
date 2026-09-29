const fs = require('fs');
const vm = require('vm');

console.log('Loading index.html for profiling and error checking...');
const html = fs.readFileSync('index.html', 'utf8');

const scripts = [];
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[1]);
}

// Full mock canvas context
const ctxCallCounts = {};
function trackCtx(name) {
  ctxCallCounts[name] = (ctxCallCounts[name] || 0) + 1;
}

const mockCtx = {
  save: () => trackCtx('save'),
  restore: () => trackCtx('restore'),
  beginPath: () => trackCtx('beginPath'),
  closePath: () => trackCtx('closePath'),
  moveTo: () => trackCtx('moveTo'),
  lineTo: () => trackCtx('lineTo'),
  quadraticCurveTo: () => trackCtx('quadraticCurveTo'),
  bezierCurveTo: () => trackCtx('bezierCurveTo'),
  arc: () => trackCtx('arc'),
  ellipse: () => trackCtx('ellipse'),
  fill: () => trackCtx('fill'),
  stroke: () => trackCtx('stroke'),
  strokeRect: () => trackCtx('strokeRect'),
  fillRect: () => trackCtx('fillRect'),
  clearRect: () => trackCtx('clearRect'),
  translate: () => trackCtx('translate'),
  scale: () => trackCtx('scale'),
  rotate: () => trackCtx('rotate'),
  setTransform: () => trackCtx('setTransform'),
  setLineDash: () => trackCtx('setLineDash'),
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  createPattern: () => ({}),
  measureText: (txt) => ({ width: (txt || '').length * 8 }),
  strokeText: () => trackCtx('strokeText'),
  fillText: () => trackCtx('fillText'),
  drawImage: () => trackCtx('drawImage')
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
      removeChild: function() {},
      addEventListener: () => {},
      getContext: () => mockCtx,
      width: 400,
      height: 800,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 })
    };
  }
  return elements[id];
}

const errorsLogged = [];
const consoleProxy = {
  log: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => {
    errorsLogged.push(args.join(' '));
    console.error('CAPTURE ERROR:', ...args);
  }
};

const sandbox = {
  window: null,
  document: {
    getElementById: (id) => getEl(id),
    createElement: (tag) => {
      const el = getEl('elem_' + Math.random().toString(36).substring(2));
      el.tagName = tag;
      return el;
    },
    querySelector: (sel) => null,
    querySelectorAll: (sel) => [],
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
    userAgent: 'Android Chrome Mobile'
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
  requestAnimationFrame: () => {},
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
  setInterval: () => {},
  clearInterval: () => {},
  console: consoleProxy,
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

const hook = `
window.__runStressTest = function() {
  selectHero('ayaz');
  startRun();
  running = true;
  paused = false;

  console.log('Injecting combat stress test entities...');
  for (let i = 0; i < 50; i++) {
    enemies.push({
      x: 200 + (Math.random() - 0.5) * 300,
      y: 300 + (Math.random() - 0.5) * 300,
      r: 14,
      hp: 100,
      maxHp: 100,
      type: 'skel',
      subType: 'normal',
      speed: 1.5,
      vx: 0,
      vy: 0,
      angle: 0,
      frozen: 0,
      burning: 0,
      poison: 0,
      shocked: 0,
      stun: 0,
      windSlow: 0,
      bleed: 0,
      elite: i % 5 === 0,
      eliteAffixes: i % 5 === 0 ? ['shield'] : [],
      aggro: true,
      dead: false,
      fsm: { state: 'CHASE', timer: 0 }
    });
  }

  for (let i = 0; i < 40; i++) {
    playerProjectiles.push({
      x: 200 + Math.random() * 50,
      y: 400 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 5,
      vy: -6,
      r: 6,
      dmg: 25,
      elem: 'fire',
      life: 80,
      maxLife: 80,
      fromPlayer: true
    });
  }

  for (let i = 0; i < 20; i++) {
    hazards.push({
      x: 200 + Math.random() * 100,
      y: 350 + Math.random() * 100,
      r: 30,
      type: 'fire_ground',
      timer: 120,
      maxTimer: 120,
      elem: 'fire'
    });
  }

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: 200,
      y: 400,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 30,
      maxLife: 30,
      color: '#ff4400',
      r: 3
    });
  }

  console.log('Running 300 frames of update() and render()...');
  const startTime = Date.now();
  let totalUpdateMs = 0;
  let totalRenderMs = 0;

  for (let f = 0; f < 300; f++) {
    const t0 = Date.now();
    try {
      update(1.0, startTime + f * 16.6);
    } catch (err) {
      console.error('Frame ' + f + ' UPDATE EXCEPTION:', err.message, err.stack);
    }
    const t1 = Date.now();
    totalUpdateMs += (t1 - t0);

    try {
      render();
    } catch (err) {
      console.error('Frame ' + f + ' RENDER EXCEPTION:', err.message, err.stack);
    }
    const t2 = Date.now();
    totalRenderMs += (t2 - t1);
  }

  const elapsed = Date.now() - startTime;
  console.log('=== BENCHMARK RESULTS ===');
  console.log('Total 300 frames executed in: ' + elapsed + ' ms');
  console.log('Average update time: ' + (totalUpdateMs / 300).toFixed(3) + ' ms/frame');
  console.log('Average render time: ' + (totalRenderMs / 300).toFixed(3) + ' ms/frame');
};
`;

// Insert hook right before `window._game = {` inside the IIFE
const patchedScript = scripts[1].replace('window._game = {', hook + '\nwindow._game = {');

console.log('Evaluating script in VM...');
vm.runInContext(patchedScript, context);
console.log('Script loaded. Calling __runStressTest()...');

sandbox.window.__runStressTest();

console.log('Errors logged during simulation:', errorsLogged.length);
if (errorsLogged.length > 0) {
  console.log('First 5 errors:', errorsLogged.slice(0, 5));
}
console.log('Top Canvas Context calls:');
console.log(Object.entries(ctxCallCounts).sort((a,b) => b[1] - a[1]).slice(0, 10));

if (errorsLogged.length === 0) {
  console.log('SUCCESS: ZERO ERRORS in full 300-frame combat simulation!');
  process.exit(0);
} else {
  console.error('FAILED: Errors detected during simulation.');
  process.exit(1);
}
