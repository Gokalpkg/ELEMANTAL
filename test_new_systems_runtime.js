const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  // Create test server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
  });

  const port = await new Promise((resolve) => {
    server.listen(0, () => resolve(server.address().port));
  });
  console.log(`Test server running on port ${port}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--user-data-dir=' + __dirname + '\\.chrome_tmp_test',
    '--disable-gpu',
    '--window-size=600,900'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9227/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  if (!page || !page.webSocketDebuggerUrl) {
    console.error('No page target found');
    chrome.kill();
    server.close();
    process.exit(1);
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let msgId = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const browserErrors = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      if (msg.params.type === 'error') {
        browserErrors.push(text);
        console.error('[BROWSER ERROR]', text);
      } else {
        console.log('[BROWSER LOG]', text);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const text = msg.params.exceptionDetails.text + (msg.params.exceptionDetails.exception ? ' ' + JSON.stringify(msg.params.exceptionDetails.exception) : '');
      browserErrors.push(text);
      console.error('[BROWSER EXCEPTION]', text);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Navigating to game page...');
  await send('Page.navigate', { url: `http://localhost:${port}/` });

  await new Promise(r => setTimeout(r, 2000));

  // Run comprehensive test inside the page
  console.log('Evaluating game test suite...');
  const testResults = await send('Runtime.evaluate', {
    expression: `(async () => {
      const results = [];
      function assert(cond, name, details='') {
        results.push({ name, pass: !!cond, details });
        if (!cond) console.error('FAIL:', name, details);
        else console.log('PASS:', name);
      }

      try {
        const G = window._game;
        assert(!!G, 'window._game is defined');

        // 1. Check MOD_POOL contains all 10 new perks
        const requiredMods = [
          'aegisBubble', 'seedSpreader', 'loadedDice', 'guillotine',
          'orbitBoomerang', 'focalLens', 'chronosSiphon', 'deathPact',
          'bloodTithe', 'polarityShift'
        ];
        requiredMods.forEach(id => {
          const found = G.MOD_POOL.find(m => m.id === id);
          assert(!!found, 'MOD_POOL has ' + id, found ? ('maxLv=' + found.maxLv) : 'NOT FOUND');
        });

        // 2. Start game
        if (typeof window.startRun === 'function') {
          window.startRun('fire');
        } else if (document.getElementById('startBtn')) {
          document.getElementById('startBtn').click();
        }

        const player = G.getPlayer();
        assert(!!player, 'Player initialized');

        // 3. Test applyMod for each new mod
        requiredMods.forEach(id => {
          const mod = G.MOD_POOL.find(m => m.id === id);
          const initialLv = player.mods[id] || 0;
          G.applyMod(mod);
          assert((player.mods[id] || 0) === initialLv + 1, 'applyMod worked for ' + id);
        });

        // 4. Test aegisBubble mechanic
        player.mods['aegisBubble'] = 3; // 10s cooldown
        G.setAegisTimer(11000);
        G.setAegisReady(true);
        const initialHp = player.hp;
        G.damagePlayer(20);
        assert(player.hp === initialHp, 'Aegis Bubble blocked 100% damage', 'HP remained ' + player.hp);
        assert(!G.getAegisReady(), 'Aegis Bubble was consumed on hit');

        // 5. Test bloodTithe mechanic
        player.mods['bloodTithe'] = 1;
        player.hp = player.maxHp;
        // Overheal reserve
        player._bloodTitheReserve = player.maxHp * 0.22;
        player.hp = 10;
        // Fatal damage
        G.damagePlayer(50);
        assert(player.hp > 0, 'Blood Tithe prevented fatal blow and resurrected', 'HP: ' + player.hp);
        assert(player.invuln > 0, 'Blood Tithe gave invulnerability frames', 'Invuln: ' + player.invuln);

        // 6. Test guillotine mechanic
        player.mods['guillotine'] = 8; // 20% execute
        const dummyMob = {
          x: player.x + 50,
          y: player.y,
          hp: 18,
          maxHp: 100,
          alive: true,
          r: 15,
          type: 'crawler',
          tier: 'normal'
        };
        G.getEnemies().push(dummyMob);
        G.takeDamage(dummyMob, 5, player.x, player.y, false);
        assert(dummyMob.hp <= 0 || !dummyMob.alive, 'Guillotine instantly executed mob below 20% HP');

        // 7. Test focalLens distance scaling
        player.mods['focalLens'] = 8; // +60% max
        const closeMob = { x: player.x + 10, y: player.y, hp: 1000, maxHp: 1000, alive: true, r: 15, type: 'golem' };
        const farMob = { x: player.x + 600, y: player.y, hp: 1000, maxHp: 1000, alive: true, r: 15, type: 'golem' };
        G.getEnemies().push(closeMob, farMob);
        const dmgClose = G.takeDamage(closeMob, 100, player.x, player.y, false);
        const dmgFar = G.takeDamage(farMob, 100, player.x, player.y, false);
        assert(dmgFar > dmgClose, 'Focal Lens deals more damage at distance', 'Close: ' + dmgClose + ', Far: ' + dmgFar);

        // 8. Test loadedDice in showModPick
        player.mods['loadedDice'] = 1;
        G.showModPick();
        const rerollBtn = document.getElementById('loadedDiceRerollBtn');
        assert(!!rerollBtn, 'Loaded Dice reroll button rendered in showModPick');
        if (rerollBtn) {
          rerollBtn.click();
          assert(true, 'Loaded Dice reroll button clickable without error');
        }
        // Close modal by clicking first choice card
        const card = document.querySelector('.mod-pick-card');
        if (card) card.click();

        // 9. Test Respec Shrine spawn and interaction
        G.setRespecShrine({
          x: player.x,
          y: player.y,
          r: 50,
          stayTimer: 59,
          active: true
        });
        // Set player with some mods
        player.mods['orbitBoomerang'] = 4;
        player.mods['deathPact'] = 2;
        const totalLvBefore = Object.values(player.mods).reduce((a, b) => a + b, 0);
        assert(totalLvBefore > 0, 'Player has mods before respec: ' + totalLvBefore);

        // Advance update by a tick (dt=1.5 frame) to trigger respec shrine
        G.update(1.5, performance.now());
        const totalLvAfter = Object.values(player.mods).reduce((a, b) => a + b, 0);
        assert(totalLvAfter === 0, 'Respec shrine reset all player mods to 0', 'After: ' + totalLvAfter);
        assert(G.getPendingRespecPicks() > 0, 'Respec shrine refunded picks: ' + G.getPendingRespecPicks());

        // 10. Test orbitBoomerang return trajectory
        const curPlayer = G.getPlayer();
        curPlayer.mods['orbitBoomerang'] = 8;
        const proj = {
          x: curPlayer.x + 80,
          y: curPlayer.y,
          ox: curPlayer.x,
          oy: curPlayer.y,
          vx: 5,
          vy: 0,
          maxDist: 60,
          dmg: 10,
          r: 6,
          el: 'wind',
          color: '#38bdf8'
        };
        const pList = G.getPlayerProjectiles();
        pList.push(proj);
        // Run update for a few frames to clear any hitStop and trigger shotTooFar & boomerang return
        for (let f = 0; f < 5; f++) {
          G.update(1.0, performance.now());
        }
        assert(proj._returning === true, 'Orbit Boomerang initiated return flight', JSON.stringify({ returning: proj._returning, vx: proj.vx }));

        // 11. Test Pause Menu Augment Codex Cards
        const modOv = document.getElementById('modOverlay');
        if (modOv) modOv.classList.remove('show');
        curPlayer.mods['aegisBubble'] = 2;
        curPlayer.mods['guillotine'] = 5;
        curPlayer.mods['bloodTithe'] = 1;
        G.togglePause();
        const pauseGrid = document.getElementById('pauseModCardsGrid');
        assert(!!pauseGrid, 'pauseModCardsGrid element exists');
        const cards = pauseGrid.querySelectorAll('.pause-mod-card');
        assert(cards.length >= 3, 'Pause menu rendered detailed mod cards', 'Cards count: ' + cards.length);
        const modCountEl = document.getElementById('pauseModCount');
        assert(modCountEl && parseInt(modCountEl.textContent) >= 3, 'Mod count header matches active mods', 'Count: ' + (modCountEl ? modCountEl.textContent : 'null'));
        if (typeof window.togglePauseModCodex === 'function') {
          window.togglePauseModCodex();
          assert(true, 'togglePauseModCodex executed without error');
        }

        return { success: true, results };
      } catch (err) {
        return { success: false, error: err.stack || err.message, results };
      }
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Test results:', JSON.stringify(testResults, null, 2));

  // Take screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('chrome_systems_test_result.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved chrome_systems_test_result.png');

  ws.close();
  chrome.kill();
  server.close();

  if (browserErrors.length > 0) {
    console.error('Browser reported errors:', browserErrors);
  }
}

run().catch(e => {
  console.error('Fatal error running test:', e);
  process.exit(1);
});
