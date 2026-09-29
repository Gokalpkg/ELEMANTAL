const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\dbcc7751-f574-4c9d-b53d-79c4e11c53b9';

const targets = [
  { file: 'test_clash_battle.html', out: 'screenshot_clash_battle.png' },
  { file: 'test_clash_heroes.html', out: 'screenshot_clash_heroes.png' },
  { file: 'test_clash_shrine.html', out: 'screenshot_clash_shrine.png' }
];

targets.forEach(t => {
  const fileUrl = 'file:///' + path.resolve(__dirname, t.file).replace(/\\/g, '/');
  const outPath = path.join(brainDir, t.out);
  console.log(`Capturing ${t.file} -> ${t.out}...`);
  try {
    const cmd = `"${edgePath}" --headless --disable-gpu --window-size=412,915 --screenshot="${outPath}" "${fileUrl}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Saved ${t.out} (${fs.statSync(outPath).size} bytes)`);
  } catch (err) {
    console.error(`Failed to capture ${t.file}:`, err.message);
  }
});
