const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

let changes = 0;

// -------------------------------------------------------------
// 1. EXPAND reactionResolver.peek WITH SYNERGY DAMAGE MULTIPLIERS
// -------------------------------------------------------------
const oldPeek = `  peek(en, incomingEl) {
    if (!en) return 1;
    if (statusStore.has(en, 'wet') && incomingEl === 'storm') return 1.55;
    if (statusStore.has(en, 'mark') && incomingEl === 'storm') return 1.25;
    if (statusStore.has(en, 'shock') && incomingEl !== 'storm') {
      return Math.pow(1.18, Math.max(1, en.shockStack || 1));
    }
    return 1;
  },`;

const newPeek = `  peek(en, incomingEl) {
    if (!en) return 1;
    if (statusStore.has(en, 'wet') && incomingEl === 'storm') return 1.60;
    if (statusStore.has(en, 'mark') && (incomingEl === 'fire' || incomingEl === 'storm')) return 1.45;
    if (statusStore.has(en, 'burn') && (incomingEl === 'void' || incomingEl === 'earth')) return 1.40;
    if (statusStore.has(en, 'wet') && incomingEl === 'earth') return 1.45;
    if (statusStore.has(en, 'root') && (incomingEl === 'fire' || incomingEl === 'storm')) return 1.35;
    if (statusStore.has(en, 'shock') && incomingEl !== 'storm') {
      return Math.pow(1.22, Math.max(1, en.shockStack || 1));
    }
    return 1;
  },`;

if (html.includes(oldPeek)) {
  html = html.replace(oldPeek, newPeek);
  changes++;
  console.log('[1] Updated reactionResolver.peek with high-synergy multipliers');
} else {
  console.warn('[1] Warning: oldPeek not found');
}

// -------------------------------------------------------------
// 2. EXPAND reactionResolver.resolve WITH COMPLETE 2-ELEMENT MATRIX
// -------------------------------------------------------------
const oldResolveBlock = `    if (marked && incomingEl === 'void') {
      const pop = Math.max(1, Math.round((en.markStored || 0) * 1.15));
      statusStore.remove(en, 'mark');
      takeDamage(en, pop, 'void', { noReact: true });
      spawnFloatText(en.x, en.y - 20, 'DAMGA ' + pop, '#a855f7', 'big');
      burst(en.x, en.y, '#a855f7', 14, 3.2);
    } else if (marked && incomingEl === 'storm' && (!en.reactRiftAt || now - en.reactRiftAt > 1600)) {
      en.reactRiftAt = now;
      const half = Math.max(1, Math.round((en.markStored || 0) * 0.50));
      en.markStored = Math.max(0, (en.markStored || 0) - half);
      takeDamage(en, half, 'void', { noReact: true });
      spawnFloatText(en.x, en.y - 18, 'YARIK ' + half, '#c084fc');
    }
  }
};`;

const newResolveBlock = `    if (marked && incomingEl === 'void') {
      const pop = Math.max(1, Math.round((en.markStored || 0) * 1.25));
      statusStore.remove(en, 'mark');
      takeDamage(en, pop, 'void', { noReact: true });
      spawnFloatText(en.x, en.y - 20, 'DAMGA ' + pop, '#a855f7', 'big');
      burst(en.x, en.y, '#a855f7', 16, 3.5);
    } else if (marked && incomingEl === 'storm' && (!en.reactRiftAt || now - en.reactRiftAt > 1600)) {
      en.reactRiftAt = now;
      const half = Math.max(1, Math.round((en.markStored || 0) * 0.50));
      en.markStored = Math.max(0, (en.markStored || 0) - half);
      takeDamage(en, half, 'void', { noReact: true });
      spawnFloatText(en.x, en.y - 18, 'YARIK ' + half, '#c084fc');
    }

    // Singularity Collapse: Burn + Void (or Marked + Fire)
    if (((burn && incomingEl === 'void') || (marked && incomingEl === 'fire')) && (!en.reactSingularityAt || now - en.reactSingularityAt > 1400)) {
      en.reactSingularityAt = now;
      emitReactionBurst(en, 'SÜPERNOVA ÇÖKÜŞÜ', '#c084fc', 95, Math.max(22, Math.round(dealt * 1.55)), ['burn'], 'void');
      enemies.forEach(o => {
        const d = Math.hypot(o.x - en.x, o.y - en.y);
        if (d > 0 && d < 140 && o.type !== 'boss') {
          o.vx = (en.x - o.x) / d * 10;
          o.vy = (en.y - o.y) / d * 10;
          o.staggerTimer = 0.25;
        }
      });
      spawnElemStain(en.x, en.y, 80, 'void', 240);
    }

    // Verdant Bloom: Wet + Nature (or Rooted + Water)
    if (((wet && incomingEl === 'nature') || (rooted && incomingEl === 'water')) && (!en.reactBloomAt || now - en.reactBloomAt > 1400)) {
      en.reactBloomAt = now;
      emitReactionBurst(en, 'CANLI FİLİZLENME', '#22c55e', 80, Math.max(16, Math.round(dealt * 1.25)), ['slow', 'root'], 'nature');
      player.hp = Math.min(player.maxHp, player.hp + 6);
      spawnFloatText(player.x, player.y - 20, '+6 CAN', '#4ade80');
      for (let s = 0; s < 5; s++) {
        const ang = Math.random() * Math.PI * 2;
        sparks.push({
          x: en.x, y: en.y,
          vx: Math.cos(ang) * 4.5, vy: Math.sin(ang) * 4.5,
          r: 3, life: 0.45, maxLife: 0.45, color: '#86efac', rot: 0, vr: 0
        });
      }
    }

    // Magnetic Overload: Shock + Earth
    if (shock && incomingEl === 'earth' && (!en.reactMagnetAt || now - en.reactMagnetAt > 1400)) {
      en.reactMagnetAt = now;
      emitReactionBurst(en, 'MANYETİK ŞOK', '#eab308', 85, Math.max(20, Math.round(dealt * 1.35)), ['stun'], 'storm');
      statusStore.addShred(en, 0.25);
      enemies.forEach(o => {
        const d = Math.hypot(o.x - en.x, o.y - en.y);
        if (d > 0 && d < 120 && o.type !== 'boss') {
          o.vx = (en.x - o.x) / d * 9;
          o.vy = (en.y - o.y) / d * 9;
          o.stunUntil = Math.max(o.stunUntil || 0, now + 400);
        }
      });
    }

    // Galvanic Thorns: Rooted + Storm
    if (rooted && incomingEl === 'storm' && (!en.reactGalvanicAt || now - en.reactGalvanicAt > 1400)) {
      en.reactGalvanicAt = now;
      emitReactionBurst(en, 'GALVANİK DİKEN', '#a3e635', 80, Math.max(18, Math.round(dealt * 1.25)), ['shock'], 'storm');
      chainLightning(en, Math.max(14, Math.round(dealt * 0.8)), 6, 190, '#a3e635', 'shock');
    }

    // Abyssal Maelstrom: Wet + Void
    if (wet && incomingEl === 'void' && (!en.reactAbyssAt || now - en.reactAbyssAt > 1500)) {
      en.reactAbyssAt = now;
      emitReactionBurst(en, 'HİÇLİK GİRDABI', '#06b6d4', 90, Math.max(20, Math.round(dealt * 1.3)), ['slow'], 'void');
      en.slowFactor = Math.min(en.slowFactor || 1, 0.35);
      if (en.type !== 'boss' && en.hp / en.maxHp < 0.25) {
        takeDamage(en, en.hp + 10, 'void', { noReact: true });
        spawnFloatText(en.x, en.y - 24, '☠️ İNFAZ!', '#a855f7', 'big');
      }
    }

    // Gravitational Crush: Marked + Earth
    if (marked && incomingEl === 'earth' && (!en.reactCrushAt || now - en.reactCrushAt > 1500)) {
      en.reactCrushAt = now;
      emitReactionBurst(en, 'YERÇEKİMİ EZMESİ', '#8b5cf6', 85, Math.max(22, Math.round(dealt * 1.45)), ['stun'], 'earth');
      en.stunUntil = Math.max(en.stunUntil || 0, now + 650);
      statusStore.addShred(en, 0.30);
    }
  }
};`;

if (html.includes(oldResolveBlock)) {
  html = html.replace(oldResolveBlock, newResolveBlock);
  changes++;
  console.log('[2] Added Singularity Collapse, Verdant Bloom, Magnetic Overload, Galvanic Thorns, Abyssal Maelstrom, and Gravitational Crush');
} else {
  console.warn('[2] Warning: oldResolveBlock not found');
}

// -------------------------------------------------------------
// 3. POLISH GRAFT_DEFS DESCRIPTIONS & IMPACT
// -------------------------------------------------------------
const oldGraftDefs = `const GRAFT_DEFS = {
  steam:   { id: 'ionCore', name: 'Iyon Cekirdegi', hint: 'Basincli skill kutup basar, carpismalar sertlesir' },
  ash:     { id: 'ashFertilizer', name: 'Kul Gubre', hint: 'Lav/sis alaninda kul taret dogar' },
  magnet:  { id: 'ironRoot', name: 'Iletken Kok', hint: 'Carpisan kutuplar kok birakir' },
  plasma:  { id: 'collapseRift', name: 'Cokus Yarigi', hint: 'Plazma ucunda mini girdap' },
  vortex:  { id: 'ashHorizon', name: 'Kul Ufku', hint: 'Girdap bitince kul sisi' },
  mire:    { id: 'ashFertilizer', name: 'Gubre Bataklik', hint: 'Camurda tohum taret' },
  stain:   { id: 'ionCore', name: 'Artik Iyon', hint: 'Skill kutup basar' },
  lava:    { id: 'ashFertilizer', name: 'Kul Gubre', hint: 'Alev havuzunda taret' },
  ocean:   { id: 'ionCore', name: 'Iyon Cekirdegi', hint: 'Islak skill kutup basar' },
  thunder: { id: 'collapseRift', name: 'Cokus Yarigi', hint: 'Yildirim ucunda cekim' },
  sprout:  { id: 'ashFertilizer', name: 'Gubre Filiz', hint: 'Ek taret tohumu' },
  stone:   { id: 'ironRoot', name: 'Iletken Kok', hint: 'Ezme kok birakir' },
  shadow:  { id: 'ashHorizon', name: 'Kul Ufku', hint: 'Cekim alani sis birakir' }
};`;

const newGraftDefs = `const GRAFT_DEFS = {
  steam:   { id: 'ionCore', name: '⚡ İyon Çekirdeği', hint: 'Buhar yetenekleri düşmanlara manyetik kutup basar, çarpışmalar 2 kat güçlenir!' },
  ash:     { id: 'ashFertilizer', name: '🌋 Kül Tareti', hint: 'Lav ve sis alanlarında otomatik alev püskürten Kadim Kül Tareti doğar!' },
  magnet:  { id: 'ironRoot', name: '🌿 Manyetik Kök', hint: 'Birbirine çarpan düşmanlar köklenir ve hareket edemez!' },
  plasma:  { id: 'collapseRift', name: '🌀 Çöküş Yarığı', hint: 'Plazma patlama merkezinde tüm düşmanları içine çeken mini kara delik açılır!' },
  vortex:  { id: 'ashHorizon', name: '💨 Kül Ufku', hint: 'Girdap bittiğinde tüm alanı kör edip zırh eriten devasa kül sisi patlar!' },
  mire:    { id: 'ashFertilizer', name: '🧪 Asit Bataklığı', hint: 'Çamur alanında düşmanlara sürekli asit saçan Zehir Tareti filizlenir!' },
  stain:   { id: 'ionCore', name: '⚡ Reaksiyon Çekirdeği', hint: 'Tüm yetenekler manyetik şok dalgası yayar!' },
  lava:    { id: 'ashFertilizer', name: '🔥 Magma Tareti', hint: 'Alev havuzunda lav püskürten cehennem tareti diker!' },
  ocean:   { id: 'ionCore', name: '❄️ İletken Donma', hint: 'Islanan ve donan düşmanlar manyetik kutup kazanır, birbirine çarpar!' },
  thunder: { id: 'collapseRift', name: '⚡ Yıldırım Girdabı', hint: 'Yıldırımların vurduğu merkezde düşmanları toplayan elektrik girdabı doğar!' },
  sprout:  { id: 'ashFertilizer', name: '🌸 Kadim Filiz Bahçesi', hint: 'Savaş alanında fazladan +2 otomatik Doğa tareti yeşerir!' },
  stone:   { id: 'ironRoot', name: '🪨 Tektonik Kök', hint: 'Yeri sarsan darbeler düşmanları 1.5 saniye kökleyip hareketsiz bırakır!' },
  shadow:  { id: 'ashHorizon', name: '🗡️ Gölge Ufku', hint: 'Karanlık alandaki tüm düşmanlara otomatik infaz hasarı indirir!' }
};`;

if (html.includes(oldGraftDefs)) {
  html = html.replace(oldGraftDefs, newGraftDefs);
  changes++;
  console.log('[3] Polished GRAFT_DEFS cards');
} else {
  console.warn('[3] Warning: oldGraftDefs not found');
}

if (isCrlf) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\nCompleted Step 2 patch script. Total successful patches: ${changes}/3`);
