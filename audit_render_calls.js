const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

const rStart = txt.indexOf('function render() {');
const rEnd = txt.indexOf('function loop(', rStart);
const renderBody = txt.substring(rStart, rEnd);

// Standard methods & Math
const builtins = new Set([
  'setTransform','random','clearRect','translate','round','find','fillRect',
  'createRadialGradient','addColorStop','restore','forEach','beginPath','arc',
  'max','min','stroke','rotate','setLineDash','strokeRect','moveTo','lineTo',
  'closePath','ellipse','sin','cos','quadraticCurveTo','abs','hypot','fillText',
  'floor','ceil','roundRect','toUpperCase','save','filter','splice','map','slice',
  'push','pop','shift','unshift','indexOf','includes','some','every','reduce',
  'getContext','createPattern','scale','clip','rect','bezierCurveTo','resetTransform'
]);

const re = /(?:^|[^.a-zA-Z0-9_$])([a-zA-Z0-9_$]+)\s*\(/g;
const calls = new Set();
let m;
while ((m = re.exec(renderBody)) !== null) {
  const fn = m[1];
  if (!['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof'].includes(fn) && !builtins.has(fn)) {
    calls.add(fn);
  }
}

console.log('Top-level user function calls in render():', Array.from(calls));
const missing = [];
calls.forEach(fn => {
  const isDef = txt.includes(`function ${fn}`) ||
                txt.includes(`const ${fn} =`) ||
                txt.includes(`let ${fn} =`) ||
                txt.includes(`var ${fn} =`);
  if (!isDef) {
    missing.push(fn);
  }
});

console.log('ACTUALLY MISSING FROM CODEBASE:', missing);
