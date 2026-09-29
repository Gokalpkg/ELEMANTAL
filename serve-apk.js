const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const apkPath = path.join(os.homedir(), 'Desktop', 'Elementer-Yeni.apk');
const fallbackPath = path.join(os.homedir(), 'Desktop', 'ElementSavas-debug.apk');
const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/download' || req.url.endsWith('.apk')) {
    const finalPath = fs.existsSync(apkPath) ? apkPath : fallbackPath;
    if (!fs.existsSync(finalPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('APK dosyası bulunamadı.');
    }
    const stat = fs.statSync(finalPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="Elementer-Yeni.apk"'
    });
    return fs.createReadStream(finalPath).pipe(res);
  }

  // Web UI
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Elementer: Türk Mitolojisi - Master Güncelleme</title>
      <style>
        body { background: #080c16; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px 16px; margin: 0; }
        .card { background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%); max-width: 440px; margin: 0 auto; padding: 26px 20px; border-radius: 24px; border: 1.5px solid #38bdf8; box-shadow: 0 12px 36px rgba(56,189,248,0.25); }
        h1 { font-size: 22px; color: #facc15; margin-bottom: 6px; }
        .tag { display: inline-block; background: #0369a1; color: #e0f2fe; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        .list { text-align: left; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 14px 16px; margin-bottom: 22px; font-size: 13px; line-height: 1.6; color: #cbd5e1; }
        .list b { color: #38bdf8; }
        .btn { display: block; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; text-decoration: none; font-weight: 900; font-size: 17px; padding: 15px 24px; border-radius: 14px; box-shadow: 0 4px 18px rgba(2,132,199,0.5); border: 1px solid #38bdf8; }
        .btn:active { transform: scale(0.97); }
        .ver { font-size: 11px; color: #94a3b8; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🌪️ Elementer: Efsaneler</h1>
        <div class="tag">11 Adımlık Master Sürüm</div>
        <div class="list">
          👥 <b>3'lü Sahne Karakter Vitrini:</b> Ortada seçili kahraman, sağda ve solda karanlık silüetler, dokunmatik kaydırma.<br>
          📜 <b>Kapsamlı Kahraman Dosyası:</b> Rol pill, silah, özel pasif kuralı ve 4 RPG stat barı (HP, Hız, Dmg, Uzmanlık).<br>
          🗺️ <b>Kesintisiz Organik Biyomlar:</b> Kare kiremitlerden kurtulundu; 256x256 kum tepeleri, permafrost ve akan lav.<br>
          ⚡ <b>Akıllı Hit-Stop:</b> Boss savaşlarında 220ms akıllı soğuma ve 4 frame tavan ile kasma sıfırlandı.<br>
          👑 <b>Sade Altın Unvan Bandı:</b> Ekranı karartan 3s mektup kutusu yerine savaş alanını 100% açık bırakan üst unvan bandı.<br>
          📱 <b>Ergonomik Başparmak Kavisi:</b> Atılma, Ulti ve Duruş tuşları Android geri jestinden güvenli bölgeye taşındı.
        </div>
        <a href="/download" class="btn">📲 GÜNCEL APK'YI İNDİR (63.5 MB)</a>
        <div class="ver">Dosya: Elementer-Yeni.apk</div>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu aktif: http://localhost:${PORT}`);
});
