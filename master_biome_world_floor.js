// =========================================================================
// MASTER UNIFIED BIOME WORLD FLOOR RENDERER
// Replaces the 128x128 repeating grid pattern with a cohesive, grand,
// atmospheric world arena. Zero repeating seams, zero square tiles!
// =========================================================================

function drawUnifiedBiomeWorldFloor(ctx, cam, W, H, biome, time, visualMode) {
  const bk = (biome && biome.key) || 'stone';
  const left = cam.x - 32;
  const top = cam.y - 32;
  const right = cam.x + W + 32;
  const bottom = cam.y + H + 32;
  const width = right - left;
  const height = bottom - top;

  ctx.save();

  if (bk === 'lava') {
    // =========================================================================
    // 1. LAV ÇUKURU: KATRAN SİYAHI BAZALT & İNCE AKKOR MAGMA DAMARLARI
    // ÇÖZÜM: Zemin kesinlikle kırmızı DEĞİL! Koyu kömür/obsidyen (#0a080d)
    // Böylece kırmızı canavarlar ve lav lordu zeminde parıl parıl parlar!
    // =========================================================================
    // Koyu bazalt ana zemin
    ctx.fillStyle = '#0a080d';
    ctx.fillRect(left, top, width, height);

    // Koyu volkanik duman gradyanı (Hafif soluk derinlik)
    const radG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.2, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.8);
    radG.addColorStop(0, 'rgba(16, 12, 22, 0.4)');
    radG.addColorStop(1, 'rgba(6, 4, 8, 0.95)');
    ctx.fillStyle = radG;
    ctx.fillRect(left, top, width, height);

    // Dünya koordinatlarında sürekli akan organik magma yarıkları (KARE KARE DEĞİL!)
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#ff5722';
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    // Dünya koordinatlarında 320px aralıklarla akan nehir benzeri eğriler
    const startWX = Math.floor(left / 320) * 320;
    const endWX = Math.ceil(right / 320) * 320;
    for (let wx = startWX; wx <= endWX; wx += 320) {
      const offsetX = Math.sin(wx * 0.003) * 60;
      ctx.moveTo(wx + offsetX, top);
      for (let wy = top; wy <= bottom; wy += 40) {
        const wiggle = Math.sin(wy * 0.015 + wx * 0.01) * 35 + Math.cos(wy * 0.03) * 15;
        ctx.lineTo(wx + offsetX + wiggle, wy);
      }
    }
    ctx.stroke();

    // İnce akkor çekirdek çizgisi (Sarı/Beyaz kızgın hat)
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#ffd54f';
    ctx.shadowColor = '#ffe082';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Volkanik soğumuş bazalt levha detayları (Seyrek dağılmış, sabit dünya koordinatları)
    ctx.fillStyle = '#14111a';
    const gridStep = 180;
    const gStartX = Math.floor(left / gridStep) * gridStep;
    const gStartY = Math.floor(top / gridStep) * gridStep;
    for (let gx = gStartX; gx <= right; gx += gridStep) {
      for (let gy = gStartY; gy <= bottom; gy += gridStep) {
        const seed = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.45) {
          const px = gx + fract * 90;
          const py = gy + (1 - fract) * 90;
          const pr = 18 + fract * 24;
          ctx.beginPath();
          ctx.ellipse(px, py, pr, pr * 0.65, fract * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

  } else if (bk === 'water') {
    // =========================================================================
    // 2. SU BİYOMU: DERİN OKYANUS/GÖLET MAVİSİ, HAREKETLİ KAUSTİKLER & NİLÜFERLER
    // =========================================================================
    ctx.fillStyle = '#021e36';
    ctx.fillRect(left, top, width, height);

    // Derin su radyal gölgelendirmesi
    const watG = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.15, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.85);
    watG.addColorStop(0, 'rgba(4, 42, 74, 0.45)');
    watG.addColorStop(1, 'rgba(1, 15, 28, 0.95)');
    ctx.fillStyle = watG;
    ctx.fillRect(left, top, width, height);

    // Akışkan su kaustik ağları (Dünya koordinatlarında yumuşak dalgalanma)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const wStep = 240;
    const wStartX = Math.floor(left / wStep) * wStep;
    const wStartY = Math.floor(top / wStep) * wStep;
    for (let x = wStartX; x <= right; x += wStep) {
      for (let y = wStartY; y <= bottom; y += wStep) {
        const waveShift = Math.sin(time * 0.05 + x * 0.008 + y * 0.008) * 16;
        ctx.moveTo(x + waveShift, y);
        ctx.bezierCurveTo(x + 50 + waveShift, y + 30, x + 90, y + 80 + waveShift, x + 120, y + 110);
      }
    }
    ctx.stroke();

    // Doğal Nilüfer Yaprakları & Lotus Çiçekleri (Sabit dünya koordinatlarında)
    for (let x = wStartX; x <= right; x += 190) {
      for (let y = wStartY; y <= bottom; y += 190) {
        const seed = Math.sin(x * 9.123 + y * 45.67) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.42) {
          const lx = x + fract * 110;
          const ly = y + (1 - fract) * 110;
          const lr = 14 + fract * 10;
          // Nilüfer yaprağı
          ctx.fillStyle = '#065f46';
          ctx.beginPath();
          ctx.arc(lx, ly, lr, 0.35, Math.PI * 2 - 0.25);
          ctx.lineTo(lx, ly);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(lx, ly, lr * 0.8, 0.4, Math.PI * 2 - 0.3);
          ctx.lineTo(lx, ly);
          ctx.closePath();
          ctx.fill();
          // Pembe lotus çiçeği
          if (fract > 0.72) {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(lx + 2, ly - 2, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(lx + 2, ly - 2, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

  } else if (bk === 'pink') {
    // =========================================================================
    // 3. ŞEKER BİYOMU: PASTEL ÇİLEK KREMASI, GOFRET YOLLAR & SPRINKLES
    // =========================================================================
    ctx.fillStyle = '#260818';
    ctx.fillRect(left, top, width, height);

    // Kremamsı dalga akıntıları
    ctx.fillStyle = 'rgba(74, 14, 46, 0.45)';
    ctx.beginPath();
    const pStep = 220;
    const pStartX = Math.floor(left / pStep) * pStep;
    for (let x = pStartX; x <= right; x += pStep) {
      const wave = Math.sin(x * 0.005) * 40;
      ctx.ellipse(x + wave, top + (bottom - top) * 0.5, 90, (bottom - top) * 0.55, 0.3, 0, Math.PI * 2);
    }
    ctx.fill();

    // Renkli Şeker Sprinkles (Sabit dünya koordinatlarında serpili)
    const sColors = ['#f472b6', '#38bdf8', '#facc15', '#4ade80', '#ffffff'];
    const sStep = 90;
    const sStartX = Math.floor(left / sStep) * sStep;
    const sStartY = Math.floor(top / sStep) * sStep;
    for (let x = sStartX; x <= right; x += sStep) {
      for (let y = sStartY; y <= bottom; y += sStep) {
        const seed = Math.sin(x * 17.89 + y * 91.23) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.35) {
          const sx = x + fract * 70;
          const sy = y + (1 - fract) * 70;
          const cIdx = Math.floor(fract * sColors.length);
          ctx.fillStyle = sColors[cIdx];
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(fract * Math.PI * 2);
          ctx.fillRect(-4, -1.5, 8, 3);
          ctx.restore();
        }
      }
    }

  } else if (bk === 'forest') {
    // =========================================================================
    // 4. ORMAN BİYOMU: ZENGİN KOYU ZÜMRÜT TOPRAK, BUDANMIŞ KÖKLER & ÇİÇEKLER
    // =========================================================================
    ctx.fillStyle = '#061a0f';
    ctx.fillRect(left, top, width, height);

    // Toprak derinlik gradyanı
    ctx.fillStyle = 'rgba(10, 44, 26, 0.4)';
    const fStep = 260;
    const fStartX = Math.floor(left / fStep) * fStep;
    const fStartY = Math.floor(top / fStep) * fStep;
    for (let x = fStartX; x <= right; x += fStep) {
      for (let y = fStartY; y <= bottom; y += fStep) {
        ctx.beginPath();
        ctx.ellipse(x + 40, y + 40, 80, 50, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Toprağı saran devasa ağaç kökleri
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let x = fStartX; x <= right; x += 280) {
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 80, top + (bottom - top) * 0.4, x - 60, top + (bottom - top) * 0.7, x + 50, bottom);
    }
    ctx.stroke();

    // Parlayan orman yabani çiçekleri
    const flwColors = ['#4ade80', '#60a5fa', '#f472b6', '#fde047'];
    for (let x = fStartX; x <= right; x += 110) {
      for (let y = fStartY; y <= bottom; y += 110) {
        const seed = Math.sin(x * 31.45 + y * 67.89) * 43758.5453;
        const fract = seed - Math.floor(seed);
        if (fract > 0.5) {
          const fx = x + fract * 90;
          const fy = y + (1 - fract) * 90;
          ctx.fillStyle = flwColors[Math.floor(fract * flwColors.length)];
          ctx.beginPath();
          ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

  } else if (bk === 'ice') {
    // =========================================================================
    // 5. BUZ BİYOMU: DERİN DERİN BUZUL KOBALTI & PRİZMATİK KRİSTAL ÇATLAKLAR
    // =========================================================================
    ctx.fillStyle = '#061828';
    ctx.fillRect(left, top, width, height);

    // Buzul derinlik gölgeleri
    ctx.fillStyle = 'rgba(12, 40, 68, 0.45)';
    ctx.fillRect(left, top, width, height);

    // Prizmatik buz yarıkları
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const iStep = 280;
    const iStartX = Math.floor(left / iStep) * iStep;
    for (let x = iStartX; x <= right; x += iStep) {
      ctx.moveTo(x, top);
      ctx.lineTo(x + 90, top + (bottom - top) * 0.45);
      ctx.lineTo(x + 30, top + (bottom - top) * 0.75);
      ctx.lineTo(x + 120, bottom);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  } else if (bk === 'storm') {
    // =========================================================================
    // 6. FIRTINA BİYOMU: İYONİZE MOR BAZALT & STATİK ELEKTRİK YARIKLARI
    // =========================================================================
    ctx.fillStyle = '#0f0a1c';
    ctx.fillRect(left, top, width, height);

    // Elektrik arkı zemin çatlakları
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ffd600';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const stStep = 270;
    const stStartX = Math.floor(left / stStep) * stStep;
    for (let x = stStartX; x <= right; x += stStep) {
      ctx.moveTo(x, top);
      ctx.lineTo(x + 50, top + 100);
      ctx.lineTo(x - 20, top + 220);
      ctx.lineTo(x + 70, bottom);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  } else if (bk === 'sand') {
    // =========================================================================
    // 7. KUM BİYOMU: AKŞAMÜSTÜ ALTIN ÇÖL KUMULLARI & HİYEROGLİFLİ TAŞLAR
    // =========================================================================
    ctx.fillStyle = '#1e1608';
    ctx.fillRect(left, top, width, height);

    // Dalgalanan çöl rüzgarı şeritleri
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    const sdStep = 200;
    const sdStartX = Math.floor(left / sdStep) * sdStep;
    for (let x = sdStartX; x <= right; x += sdStep) {
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 60, top + (bottom - top) * 0.5, x - 60, top + (bottom - top) * 0.8, x + 40, bottom);
    }
    ctx.stroke();

  } else if (bk === 'night') {
    // =========================================================================
    // 8. GECE BİYOMU: GOTİK GECE YARISI MERMERİ & KIZIL RÜN MÜHÜRLERİ
    // =========================================================================
    ctx.fillStyle = '#0a0814';
    ctx.fillRect(left, top, width, height);

    // Gotik mermer levha kesimleri (Geniş dünya boyutunda)
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
    ctx.lineWidth = 2;
    const nStep = 240;
    const nStartX = Math.floor(left / nStep) * nStep;
    const nStartY = Math.floor(top / nStep) * nStep;
    for (let x = nStartX; x <= right; x += nStep) {
      ctx.beginPath();
      ctx.moveTo(x, top); ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    for (let y = nStartY; y <= bottom; y += nStep) {
      ctx.beginPath();
      ctx.moveTo(left, y); ctx.lineTo(right, y);
      ctx.stroke();
    }

  } else if (bk === 'ketchup') {
    // =========================================================================
    // 9. KETÇAP BİYOMU: AMERİKAN DİNER DÖŞEMESİ & HARDAL ŞERİTLERİ
    // =========================================================================
    ctx.fillStyle = '#18100c';
    ctx.fillRect(left, top, width, height);

    // Hardal ve ketçap akıntıları
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.14)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    const kStep = 240;
    const kStartX = Math.floor(left / kStep) * kStep;
    for (let x = kStartX; x <= right; x += kStep) {
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + 50, top + 150, x - 40, top + 320, x + 60, bottom);
    }
    ctx.stroke();

  } else {
    // =========================================================================
    // 10. TAŞ BİYOMU (DEFAULT): ANTİK TAPINAK MEGALİTLERİ & CYAN RÜN TABLETLER
    // =========================================================================
    ctx.fillStyle = '#0c1018';
    ctx.fillRect(left, top, width, height);

    // Antik Megalit Karolar
    ctx.strokeStyle = '#182230';
    ctx.lineWidth = 2.5;
    const stnStep = 220;
    const stnStartX = Math.floor(left / stnStep) * stnStep;
    const stnStartY = Math.floor(top / stnStep) * stnStep;
    for (let x = stnStartX; x <= right; x += stnStep) {
      ctx.beginPath();
      ctx.moveTo(x, top); ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    for (let y = stnStartY; y <= bottom; y += stnStep) {
      ctx.beginPath();
      ctx.moveTo(left, y); ctx.lineTo(right, y);
      ctx.stroke();
    }

    // Cyan Rünik Glifler
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6;
    for (let x = stnStartX; x <= right; x += stnStep) {
      for (let y = stnStartY; y <= bottom; y += stnStep) {
        ctx.fillRect(x + 18, y + 18, 6, 6);
      }
    }
    ctx.shadowBlur = 0;
  }

  // Dış Ekran Sinematik Yumuşak Karartma Vignette (Köşelerde derinlik)
  const vig = ctx.createRadialGradient(cam.x + W * 0.5, cam.y + H * 0.5, W * 0.35, cam.x + W * 0.5, cam.y + H * 0.5, W * 0.95);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(2, 3, 6, 0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(left, top, width, height);

  ctx.restore();
}
