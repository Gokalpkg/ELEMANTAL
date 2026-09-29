const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const scripts = [];
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[1]);
}

const mockCtx = {
  save: () => {},
  restore: () => {},
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  quadraticCurveTo: () => {},
  bezierCurveTo: () => {},
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
  measureText: () => ({ width: 50 }),
  strokeText: () => {},
  fillText: () => {},
  drawImage: () => {}
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
        contains: () => false,
        toggle: () => {}
      },
      children: [],
      querySelector: () => null,
      querySelectorAll: () => [],
      getContext: () => mockCtx,
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      removeChild: () => {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 })
    };
  }
  return elements[id];
}

const windowMock = {
  innerWidth: 412,
  innerHeight: 915,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  AudioContext: function() {
    return {
      createGain: () => ({ connect: () => {}, gain: { value: 1, setValueAtTime: () => {} } }),
      createOscillator: () => ({ connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }),
      currentTime: 0,
      destination: {}
    };
  },
  webkitAudioContext: function() { return windowMock.AudioContext(); }
};

class ImageMock { constructor() { this.onload = null; } } 
 const sandbox = { Image: ImageMock, requestAnimationFrame: (cb) => setTimeout(cb, 16), performance: { now: () => Date.now() },
  window: windowMock,
  document: {
    getElementById: getEl,
    createElement: (tag) => getEl('mock_' + tag),
    body: getEl('body'),
    head: getEl('head'),
    documentElement: getEl('html'),
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  },
  navigator: { userAgent: 'Android' },
  location: { reload: () => {} },
  localStorage: windowMock.localStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math,
  Date: Date,
  Array: Array,
  Object: Object,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  JSON: JSON
};
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);

try {
  vm.runInContext(scripts[1], sandbox);
  console.log('Script loaded successfully.');
  
  console.log('Testing updateHeroSelectUI()...');
  sandbox.updateHeroSelectUI();
  console.log('SUCCESS: updateHeroSelectUI() executed without crash!');
  
  console.log('Pedestal Left Name:', elements['heroPedestalLeftName'].textContent);
  console.log('Pedestal Right Name:', elements['heroPedestalRightName'].textContent);
} catch (err) {
  console.error('CRASH in test:', err);
}
