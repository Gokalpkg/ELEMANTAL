const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('=== COMPREHENSIVE AUDIT OF INDEX.HTML ===');

// 1. Find all HTML buttons with ID
const buttonTagRegex = /<button\b([^>]*)>/gi;
const allButtons = [];
let match;
while ((match = buttonTagRegex.exec(content)) !== null) {
  const attrs = match[1];
  const idMatch = attrs.match(/id=["']([^"']+)["']/i);
  const classMatch = attrs.match(/class=["']([^"']+)["']/i);
  allButtons.push({
    id: idMatch ? idMatch[1] : null,
    className: classMatch ? classMatch[1] : '',
    raw: match[0],
    index: match.index
  });
}

console.log(`Total <button> tags found in HTML: ${allButtons.length}`);

// 2. Separate into static HTML buttons and dynamically generated buttons
const mainScriptIndex = content.lastIndexOf('<script');
const htmlContent = content.substring(0, mainScriptIndex);
const scriptContent = content.substring(mainScriptIndex);

const staticButtons = allButtons.filter(b => b.index < mainScriptIndex);
console.log(`Static HTML buttons before main <script>: ${staticButtons.length}`);

// Check which static buttons have event listeners or bindTouchButton
const unhandledButtons = [];
const handledButtons = [];

staticButtons.forEach(b => {
  if (!b.id) {
    unhandledButtons.push({ ...b, reason: 'NO ID' });
    return;
  }
  const id = b.id;
  const re = new RegExp(`['"\`]${id}['"\`]|getElementById\\(['"\`]${id}['"\`]|querySelector\\(['"\`]#${id}['"\`]`, 'i');
  if (re.test(scriptContent)) {
    handledButtons.push(id);
  } else {
    unhandledButtons.push({ id, className: b.className, reason: 'NO SCRIPT REFERENCE' });
  }
});

console.log(`Handled static buttons count: ${handledButtons.length}`);
console.log(`Unhandled static buttons count: ${unhandledButtons.length}`);
if (unhandledButtons.length > 0) {
  console.log('Unhandled buttons details:', JSON.stringify(unhandledButtons, null, 2));
}

// 3. Check overlays and their close buttons
console.log('\n--- Checking Overlays ---');
const overlayRegex = /<div\b[^>]*\bid=["']([^"']+)["'][^>]*\bclass=["'][^"']*\boverlay\b[^"']*["']|<div\b[^>]*\bclass=["'][^"']*\boverlay\b[^"']*["'][^>]*\bid=["']([^"']+)["']/gi;
const overlays = [];
while ((match = overlayRegex.exec(htmlContent)) !== null) {
  overlays.push(match[1] || match[2]);
}
console.log(`Total overlays found: ${overlays.length}`, overlays);

overlays.forEach(ovId => {
  const hasRef = scriptContent.includes(ovId);
  console.log(`Overlay ${ovId}: referenced in script = ${hasRef}`);
});

// 4. Check all dynamically created buttons in script
console.log('\n--- Checking Dynamic Buttons & Delegated Handlers ---');
const dynamicBtnMatches = scriptContent.match(/createElement\(['"]button['"]\)|<button/gi);
console.log(`Dynamic button creations / templates: ${dynamicBtnMatches ? dynamicBtnMatches.length : 0}`);

// 5. Check bindTouchButton calls
const bindMatches = scriptContent.match(/bindTouchButton\s*\([^)]+\)/g);
console.log(`Total bindTouchButton calls: ${bindMatches ? bindMatches.length : 0}`);

// 6. Check joystick touch exclusions
console.log('\n--- Checking Joystick Touch Exclusions ---');
const joystickIndex = scriptContent.indexOf('function setupTouchControls');
if (joystickIndex !== -1) {
  const joystickChunk = scriptContent.substring(joystickIndex, joystickIndex + 2500);
  console.log('Touch exclusion snippet:');
  const exclMatch = joystickChunk.match(/closest\([^)]+\)/g);
  console.log(exclMatch);
}

// 7. Check for potential runtime crash points
console.log('\n--- Checking for Potential Runtime Issues ---');
// Uncaught errors in event listeners, unclosed brackets, etc.
try {
  const scriptOnly = scriptContent.replace(/^<script[\s\S]*?>/i, '').replace(/<\/script>[\s\S]*$/i, '');
  new Function(scriptOnly);
  console.log('Main script syntax check: PASSED (No syntax errors)');
} catch (e) {
  console.error('Main script syntax check: FAILED!', e.message);
}
