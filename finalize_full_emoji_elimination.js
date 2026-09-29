const fs = require('fs');
const path = require('path');

console.log('=== RUNNING FINAL COMPREHENSIVE EMOJI ERADICATION & PIXEL ART INTEGRATION ===');

const htmlPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// 1. Canvas procedural pixel magnet drop
const oldCanvasMagnet = `    // Mini icon
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧲', d.x, cy);`;

const newCanvasMagnet = `    // Procedural crisp pixel horseshoe magnet
    ctx.fillStyle = '#dc2626'; // Red pole
    ctx.fillRect(d.x - 4, cy - 4, 3, 5);
    ctx.fillStyle = '#3b82f6'; // Blue pole
    ctx.fillRect(d.x + 1, cy - 4, 3, 5);
    ctx.fillStyle = '#f8fafc'; // Silver tips
    ctx.fillRect(d.x - 4, cy - 5, 3, 1.5);
    ctx.fillRect(d.x + 1, cy - 5, 3, 1.5);
    ctx.fillStyle = '#dc2626'; // Arch
    ctx.fillRect(d.x - 3, cy + 1, 6, 3);`;

if (content.includes(oldCanvasMagnet)) {
  content = content.replace(oldCanvasMagnet, newCanvasMagnet);
  console.log('Replaced canvas magnet drop with procedural pixel magnet.');
} else {
  content = content.replace("ctx.fillText('🧲', d.x, cy);", `
    ctx.fillStyle = '#dc2626'; ctx.fillRect(d.x - 4, cy - 4, 3, 5);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(d.x + 1, cy - 4, 3, 5);
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(d.x - 4, cy - 5, 3, 1.5); ctx.fillRect(d.x + 1, cy - 5, 3, 1.5);
    ctx.fillStyle = '#dc2626'; ctx.fillRect(d.x - 3, cy + 1, 6, 3);
  `);
  console.log('Replaced ctx.fillText magnet with procedural pixel magnet.');
}

// 2. Static HTML cleanups
const htmlReplacements = [
  ['<button type="button" id="vibHudBtn" aria-label="Titreşim">📳</button>', '<button type="button" id="vibHudBtn" aria-label="Titreşim"><span class="px-icon px-haptic"></span></button>'],
  ['🌪️ Taktik: Mermileri', 'Taktik: Mermileri'],
  ['<span>☀️</span> GÜNLÜK RUN / MÜCADELE', '<span class="px-icon px-sun px-anim-spin"></span> GÜNLÜK RUN'],
  ['⚖️ Ceza Paktı', 'Ceza Paktı'],
  ['🔮 Kadim Element Sığınağı', 'Kadim Element Sığınağı'],
  ['<b style="color:#fde047;">🌟 GÜNEŞ ALEVİ</b>: <span style="color:#94a3b8;">🔥 Ateş + 🌿 Doğa</span>', '<b style="color:#fde047;"><span class="px-icon px-star"></span> GÜNEŞ ALEVİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-fire"></span> Ateş + <span class="px-icon px-nature"></span> Doğa</span>'],
  ['<b style="color:#38bdf8;">🌟 MUTLAK SÜPERİLETKEN</b>: <span style="color:#94a3b8;">💧 Su + ⚡ Yıldırım</span>', '<b style="color:#38bdf8;"><span class="px-icon px-star"></span> MUTLAK SÜPERİLETKEN</b>: <span style="color:#94a3b8;"><span class="px-icon px-water"></span> Su + <span class="px-icon px-lightning"></span> Yıldırım</span>'],
  ['<b style="color:#fb923c;">🌟 GÖKTAŞI KIYAMETİ</b>: <span style="color:#94a3b8;">🪨 Toprak + 🔥 Ateş</span>', '<b style="color:#fb923c;"><span class="px-icon px-star"></span> GÖKTAŞI KIYAMETİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-shield"></span> Toprak + <span class="px-icon px-fire"></span> Ateş</span>'],
  ['<b style="color:#c084fc;">🌟 KARA DELİK VORTEKSİ</b>: <span style="color:#94a3b8;">🌑 Boşluk + 💧 Su</span>', '<b style="color:#c084fc;"><span class="px-icon px-star"></span> KARA DELİK VORTEKSİ</b>: <span style="color:#94a3b8;"><span class="px-icon px-moon"></span> Boşluk + <span class="px-icon px-water"></span> Su</span>'],
  ['<span class="guide-chip">🔥 Yakma</span>', '<span class="guide-chip"><span class="px-icon px-fire"></span> Yakma</span>'],
  ['<span class="guide-chip">🪨 Stun</span>', '<span class="guide-chip"><span class="px-icon px-shield"></span> Stun</span>'],
  ['<span class="guide-chip">⚡ Şok</span>', '<span class="guide-chip"><span class="px-icon px-lightning"></span> Şok</span>'],
  ['<p>Dalgada ve boss’ta 💎 kristal düşer', '<p>Dalgada ve boss’ta <span class="px-icon px-gem"></span> kristal düşer'],
  ['<h2 id="levelUpTitle">⭐ Seviye atladın!</h2>', '<h2 id="levelUpTitle"><span class="px-icon px-star px-anim-twinkle"></span> Seviye atladın!</h2>'],
  ['<button type="button" class="reroll-card-btn" data-reroll>🔄 Yenile', '<button type="button" class="reroll-card-btn" data-reroll><span class="px-icon px-respec"></span> Yenile'],
  ['<h2>✨ Efsanevi Eklenti</h2>', '<h2><span class="px-icon px-star px-anim-twinkle"></span> Efsanevi Eklenti</h2>'],
  ['<h2>⚜️ İmza Yeteneği</h2>', '<h2><span class="px-icon px-swords"></span> İmza Yeteneği</h2>']
];

for (const [target, repl] of htmlReplacements) {
  if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log('Applied replacement for: ' + target.slice(0, 30));
  }
}

// 3. Update the .emoji rendering sites
content = content.replace('icons: ea.emoji + eb.emoji,', 'icons: renderPixelIcon(ea.key || ea.id) + renderPixelIcon(eb.key || eb.id),');
content = content.replace('btn.textContent = e.emoji;', 'btn.innerHTML = renderPixelIcon(e.key || e.id || e.emoji);');
content = content.replace("box.innerHTML = '<div class=\"ed-title\">' + (e ? e.emoji + ' ' + e.name : 'Element') + '</div>'", "box.innerHTML = '<div class=\"ed-title\">' + (e ? renderPixelIcon(e.key || e.id) + ' ' + e.name : 'Element') + '</div>'");
content = content.replace("? ('İmza yolu: ' + sigs.map(s => s.emoji + ' ' + s.name).join(' · '))", "? ('İmza yolu: ' + sigs.map(s => renderPixelIcon(s.id || s.emoji) + ' ' + s.name).join(' · '))");
content = content.replace("btn.innerHTML = '<span class=\"emoji\">' + k.emoji + '</span>", "btn.innerHTML = '<span class=\"emoji\">' + renderPixelIcon(k.id || k.emoji) + '</span>");
content = content.replace("btn.innerHTML = '<span class=\"emoji\">' + c.emoji + '</span>", "btn.innerHTML = '<span class=\"emoji\">' + renderPixelIcon(c.id || c.emoji) + '</span>");
content = content.replace("card.innerHTML = `<span class=\"emoji\">${w.emoji}</span>", "card.innerHTML = `<span class=\"emoji\">${renderPixelIcon(w.id || w.emoji)}</span>");
content = content.replace("return `<span class=\"mod-chip\">${mark}${m.emoji} ${fmtModStack(m, shown)}</span>`;", "return `<span class=\"mod-chip\">${mark}${renderPixelIcon(m.id || m.emoji, '', 14)} ${fmtModStack(m, shown)}</span>`;");

// 4. Clean unicode emojis from text definitions (hero badges, ult titles, boss descriptions, streak banners)
console.log('Cleaning unicode emojis from text definitions...');

// Boss descriptions & titles
content = content.replace(/desc:\s*'Lv\s*(\d+)\s*·\s*👑\s*(\d+)\.\s*Boss/g, "desc: 'Lv $1 · $2. Boss");
content = content.replace(/\$\{p\.isBoss \? '👑 ' : ''\}/g, '');
content = content.replace(/👑\s*BOSS BÖLÜMÜ/g, 'BOSS BÖLÜMÜ');
content = content.replace(/👑\s*SAF FÜZYON/g, 'SAF FÜZYON');
content = content.replace(/👑\s*1\. Boss/g, '1. Boss');
content = content.replace(/👑\s*2\. Boss/g, '2. Boss');
content = content.replace(/👑\s*3\. Boss/g, '3. Boss');
content = content.replace(/👑\s*4\. Boss/g, '4. Boss');
content = content.replace(/👑\s*5\. Boss/g, '5. Boss');
content = content.replace(/👑\s*6\. Boss/g, '6. Boss');
content = content.replace(/👑\s*7\. Boss/g, '7. Boss');
content = content.replace(/👑\s*8\. Boss/g, '8. Boss');
content = content.replace(/👑\s*9\. Boss/g, '9. Boss');
content = content.replace(/👑\s*10\. Final Boss/g, '10. Final Boss');

// Ult titles
content = content.replace("let ultTitle = '👑 ELEMENT KIYAMETİ!';", "let ultTitle = 'ELEMENT KIYAMETİ!';");
content = content.replace("ultTitle = '🔥 CEHENNEM KIYAMETİ!';", "ultTitle = 'CEHENNEM KIYAMETİ!';");
content = content.replace("ultTitle = '❄️ MUTLAK SIFIR BUZ DEVRİ!';", "ultTitle = 'MUTLAK SIFIR BUZ DEVRİ!';");
content = content.replace("ultTitle = '⚡ GÖKSEL YILDIRIM GAZABI!';", "ultTitle = 'GÖKSEL YILDIRIM GAZABI!';");
content = content.replace("ultTitle = '🌿 GAİA DİRİLİŞİ!';", "ultTitle = 'GAİA DİRİLİŞİ!';");
content = content.replace("ultTitle = '🪨 TEKTONİK KITA ÇÖKÜŞÜ!';", "ultTitle = 'TEKTONİK KITA ÇÖKÜŞÜ!';");
content = content.replace("ultTitle = '🌀 KOZMİK OLAY UFKU!';", "ultTitle = 'KOZMİK OLAY UFKU!';");

// Relic & Perk definitions
content = content.replace(/name:\s*'⚡ İyon Çekirdeği'/g, "name: 'İyon Çekirdeği'");
content = content.replace(/name:\s*'🌋 Kül Tareti'/g, "name: 'Kül Tareti'");
content = content.replace(/name:\s*'🌀 Çöküş Yarığı'/g, "name: 'Çöküş Yarığı'");
content = content.replace(/name:\s*'🧪 Asit Bataklığı'/g, "name: 'Asit Bataklığı'");
content = content.replace(/name:\s*'🔥 Magma Tareti'/g, "name: 'Magma Tareti'");
content = content.replace(/name:\s*'⚡ Yıldırım Girdabı'/g, "name: 'Yıldırım Girdabı'");
content = content.replace(/name:\s*'🌸 Kadim Filiz Bahçesi'/g, "name: 'Kadim Filiz Bahçesi'");
content = content.replace(/name:\s*'🗡️ Gölge Ufku'/g, "name: 'Gölge Ufku'");

// Daily run strings
content = content.replace("? ('☀️ Günlük tamam · yarın yeni diyar')", "? ('Günlük tamam · yarın yeni diyar')");
content = content.replace(": ('☀️ Bugün: ' + (b ? b.name : '?') + ' · +12 💎 bonus');", ": ('Bugün: ' + (b ? b.name : '?') + ' · +12 Kristal bonus');");

// Hero badges: replace with clean string keys
content = content.replace("badge: '🌪️',", "badge: 'wind',");
content = content.replace("badge: '🌋',", "badge: 'fire',");
content = content.replace("badge: '🌑',", "badge: 'shadow',");
content = content.replace("badge: '❄️',", "badge: 'ice',");
content = content.replace("badge: '⚡',", "badge: 'lightning',");
content = content.replace("badge: '⏳',", "badge: 'gear',");
content = content.replace("badge: '🏹',", "badge: 'nature',");
content = content.replace("badge: '🔮',", "badge: 'shrine',");

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('=== FINAL REPLACEMENTS WRITTEN TO index.html ===');
