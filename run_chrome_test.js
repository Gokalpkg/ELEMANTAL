const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + __dirname + '\\.chrome_tmp',
    '--disable-gpu',
    '--window-size=400,800',
    'http://localhost:8090/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  if (!page || !page.webSocketDebuggerUrl) {
    chrome.kill();
    return;
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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER LOG]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');

  await new Promise(r => setTimeout(r, 1000));

  // Click start battle
  console.log('Clicking start...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("clashBattleBtn") ? document.getElementById("clashBattleBtn").click() : document.getElementById("startBtn").click()'
  });

  await new Promise(r => setTimeout(r, 1000));

  // Now click the first choice-card in #choiceRow
  console.log('Clicking first element card...');
  const cardClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('#choiceRow .choice-card');
      console.log('Cards found:', cards.length);
      if (cards.length > 0) {
        cards[0].click();
        return 'Clicked card 0';
      }
      return 'No cards found';
    })()`
  });
  console.log('cardClick:', cardClick.result.value);

  // Wait 2 seconds for gameplay
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot of battle!
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('chrome_battle_live.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved chrome_battle_live.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
