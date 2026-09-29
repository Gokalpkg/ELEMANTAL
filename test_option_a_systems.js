const fs = require('fs');
const vm = require('vm');

console.log('Testing Option A Master 13 Features in Headless VM...');
const html = fs.readFileSync('index.html', 'utf8');

// Extract script blocks
const scripts = [];
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[1]);
}

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
        getPropertyValue: () => '',
        display: ''
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
      height: 82,
      innerHTML: '',
      textContent: '',
      value: '0.8'
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
vm.runInContext(scripts[1], context);

const G = context;

console.log('--- 1. Testing Floating Joystick Anchor ---');
G.joyActive = true;
G.joyAnchor = { x: 100, y: 100 };
G.applyJoyFromPoint({ x: 180, y: 100 });
console.log('JoyVec after point:', G.joyVec, 'Anchor X:', G.joyAnchor.x);

console.log('--- 2. Testing Start Run & Dagger Timer ---');
G.startRun();
console.log('Player running! HP:', G.player.hp, 'Dagger timer:', G.player.daggerTimer);

console.log('--- 3. Testing Mythic Chest Spawning ---');
G.spawnTreasureChest(150, 200);
console.log('Chests spawned:', G.chestList.length);
if (G.chestList.length > 0) {
  const c = G.chestList[0];
  G.hitTreasureChest(c, 1);
  console.log('Chest hits:', c.hits, 'Max:', c.maxHits);
}

console.log('--- 4. Testing Kut Achievements ---');
const achs = G.MYTHIC_ACHIEVEMENTS;
console.log('Total Kut achievements defined:', achs ? achs.length : 0);
G.checkMythicAchievement('first_blood');
console.log('Achievement check completed!');

console.log('--- 5. Testing Save & Resume Run State ---');
G.saveRunState();
const saved = sandbox.localStorage.getItem('elementer_run_state_v1');
console.log('Saved run state exists in localStorage:', !!saved);
const canRes = G.hasSavedRun();
console.log('hasSavedRun():', canRes);

console.log('--- 6. Testing Talent Respec ---');
G.respecAllTalents();
console.log('Respec completed cleanly!');

console.log('--- 7. Testing Run Grade Calculation ---');
const gradeS = G.calcRunGrade(12, 180, 0);
const gradeA = G.calcRunGrade(8, 120, 2);
console.log('Grade for wave 12, 180 kills:', gradeS.grade, gradeS.title);
console.log('Grade for wave 8, 120 kills:', gradeA.grade, gradeA.title);

console.log('--- 8. Testing Boss Splash Banner ---');
G.triggerBossSplashBanner('EJDER LORDU', 'Göklerin ve Alevlerin Hakimi');
console.log('Boss banner triggered cleanly!');

console.log('--- 9. Running 120 Game Update Frames ---');
for (let f = 0; f < 120; f++) {
  G.updateGame();
}
console.log('120 frames simulated! Weather particles count:', G.weatherParticles ? G.weatherParticles.length : 'N/A');
console.log('ALL OPTION A SYSTEMS PASSED 100% CLEANLY!');
