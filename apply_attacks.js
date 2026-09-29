const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Sugar Princess (pink): Lolipop Yağmuru + Spiral Pastel Star Burst & Shrapnel
html = html.replace(
  /(spawnFloatText\(en\.x,\s*en\.y\s*-\s*36,\s*'Lolipop Yağmuru!',\s*'#f06292'\);[\s\r\n]+playSfx\('skill',\s*0\.24,\s*380\);)/,
  `$1
        // Touhou / Soul Knight: Spiral Pastel Star Barrage from Princess Wand
        const starCount = en.phase2 ? 12 : 8;
        for (let s = 0; s < starCount; s++) {
          const sAng = atAng + (s * (Math.PI * 2 / starCount));
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(sAng) * 3.4, vy: Math.sin(sAng) * 3.4,
            r: 7.0, dmg: en.phase2 ? 10 : 8, ox: en.x, oy: en.y, maxDist: 280,
            kind: 'sugar_crystal', face: sAng
          });
        }`
);
console.log('1. Sugar Princess enhanced!');

// 2. Ketchup Emperor (ketchup): Acı Hardal Alevi + Spiral Sos Volley
html = html.replace(
  /(spawnFloatText\(en\.x,\s*en\.y\s*-\s*36,\s*'Acı Hardal Alevi!',\s*'#fbc02d'\);[\s\r\n]+playSfx\('skill',\s*0\.26,\s*320\);)/,
  `$1
        // Double Spiral Sauce Volley
        const sauceCount = en.phase2 ? 10 : 6;
        for (let sc = 0; sc < sauceCount; sc++) {
          const scAng = atAng + (sc * (Math.PI * 2 / sauceCount));
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(scAng) * 3.5, vy: Math.sin(scAng) * 3.5,
            r: 7.5, dmg: en.phase2 ? 10 : 8, ox: en.x, oy: en.y, maxDist: 260,
            kind: (sc % 2 === 0 ? 'sauce_pump' : 'mustard_fire'), face: scAng
          });
        }`
);
console.log('2. Ketchup Emperor enhanced!');

// 3. Leviathan (water): 💥 YÜZEYE ÇIKTI! + 12-Way Tidal Shockwave
html = html.replace(
  /(spawnFloatText\(en\.x,\s*en\.y\s*-\s*36,\s*'💥 YÜZEYE ÇIKTI!',\s*'#00e5ff'\);[\s\r\n]+playSfx\('explode',\s*0\.42,\s*180\);)/,
  `$1
        // Leviathan 12-Way Tidal Shockwave
        for (let w = 0; w < 12; w++) {
          const wAng = w * (Math.PI * 2 / 12);
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(wAng) * 3.3, vy: Math.sin(wAng) * 3.3,
            r: 7.0, dmg: en.phase2 ? 11 : 8, ox: en.x, oy: en.y, maxDist: 260,
            kind: 'tsunami', face: wAng
          });
        }`
);
console.log('3. Leviathan enhanced!');

// 4. Raijin (storm): Statik Küreler + 8-Way Thunder Orb Ring
html = html.replace(
  /(spawnFloatText\(en\.x,\s*en\.y\s*-\s*36,\s*'Statik Küreler!',\s*'#ffd600'\);[\s\r\n]+playSfx\('skill',\s*0\.28,\s*480\);)/,
  `$1
        // Raijin 8-Way Lightning Ring
        const boltCount = en.phase2 ? 10 : 8;
        for (let b = 0; b < boltCount; b++) {
          const bAng = atAng + (b * (Math.PI * 2 / boltCount));
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(bAng) * 3.8, vy: Math.sin(bAng) * 3.8,
            r: 6.5, dmg: en.phase2 ? 11 : 9, ox: en.x, oy: en.y, maxDist: 270,
            kind: 'static_field', face: bAng
          });
        }`
);
console.log('4. Raijin enhanced!');

// 5. Lava Lord (lava): Alev Hücumu + 5-Way Hellfire Fan
html = html.replace(
  /(spawnFloatText\(en\.x,\s*en\.y\s*-\s*36,\s*'Alev Hücumu!',\s*'#ff3d00'\);[\s\r\n]+playSfx\('skill',\s*0\.32,\s*190\);)/,
  `$1
        // Lava Lord 5-Way Hellfire Fan
        for (let f = -2; f <= 2; f++) {
          const fAng = atAng + f * 0.28;
          enemyProjectiles.push({
            x: en.x, y: en.y, vx: Math.cos(fAng) * 3.6, vy: Math.sin(fAng) * 3.6,
            r: 8.0, dmg: en.phase2 ? 12 : 9, ox: en.x, oy: en.y, maxDist: 250,
            kind: 'magma', face: fAng
          });
        }`
);
console.log('5. Lava Lord enhanced!');

fs.writeFileSync('index.html', html, 'utf8');
console.log('All boss attack enhancements written successfully!');
