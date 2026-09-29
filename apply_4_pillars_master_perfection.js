const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[4 Pillars Master] Starting application to index.html, original length:', content.length);

// =========================================================================
// PILLAR 1: EXPAND HERO_ROSTER TO ALL 8 TURKISH MYTHOLOGICAL HEROES
// =========================================================================
const oldRosterTarget = `const HERO_ROSTER = {
  bamsi: {
    id: 'bamsi',
    name: 'BAMSI',
    title: 'Yelin ve Ruhun Kılıcı',
    badge: '🌪️',
    element: 'wind',
    color: '#38bdf8',
    accentColor: '#0284c7',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.05,
    atkSpeedBonus: 20,
    weapon: 'Kavisli Türk Yatağanı',
    passiveName: 'Yel Kalkanı (Parry)',
    passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',
    quote: '"Yel gibi eser, kılıç gibi biçeriz!"'
  },
  korhan: {
    id: 'korhan',
    name: 'KORHAN',
    title: 'Közün ve Lavın Muhafızı',
    badge: '🌋',
    element: 'fire',
    color: '#ff5722',
    accentColor: '#ff9800',
    hp: 220,
    speed: 3.0,
    dmgMul: 1.15,
    def: 0.20,
    weapon: 'Akkor Volkanik Pala (Yalman)',
    passiveName: 'Volkanik Siper',
    passiveDesc: 'Her %20 can kaybında tüm çevredeki düşmanları fırlatan ve yakan dev bir magma püskürmesi patlatır.',
    quote: '"Közden doğduk, lavla dövüldük!"'
  },
  karacor: {
    id: 'karacor',
    name: 'KARAÇOR',
    title: 'Gecenin ve Hiçliğin İnfazcısı',
    badge: '🌑',
    element: 'void',
    color: '#c084fc',
    accentColor: '#a855f7',
    hp: 130,
    speed: 3.8,
    dmgMul: 1.0,
    critBonus: 25,
    weapon: 'Çift Ruh Çakramı',
    passiveName: 'Gölge İnfazı',
    passiveDesc: 'Dash ile düşmanların içinden geçer ve işaretler. İşaretli hedefe ilk vuruş %300 Kritik İnfaz vurur!',
    quote: '"Gölgede olanı karanlık bile göremez."'
  }
};`;

const full8HeroRosterReplacement = `const HERO_ROSTER = {
  bamsi: {
    id: 'bamsi',
    name: 'BAMSI',
    title: 'Yelin ve Ruhun Kılıcı',
    badge: '🌪️',
    element: 'wind',
    color: '#38bdf8',
    accentColor: '#0284c7',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.05,
    atkSpeedBonus: 20,
    weapon: 'Kavisli Türk Yatağanı',
    passiveName: 'Yel Kalkanı (Parry)',
    passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',
    quote: '"Yel gibi eser, kılıç gibi biçeriz!"'
  },
  korhan: {
    id: 'korhan',
    name: 'KORHAN',
    title: 'Közün ve Lavın Muhafızı',
    badge: '🌋',
    element: 'fire',
    color: '#ff5722',
    accentColor: '#ff9800',
    hp: 220,
    speed: 3.0,
    dmgMul: 1.15,
    def: 0.20,
    weapon: 'Akkor Volkanik Pala (Yalman)',
    passiveName: 'Volkanik Siper',
    passiveDesc: 'Her %20 can kaybında tüm çevredeki düşmanları fırlatan ve yakan dev bir magma püskürmesi patlatır.',
    quote: '"Közden doğduk, lavla dövüldük!"'
  },
  karacor: {
    id: 'karacor',
    name: 'KARAÇOR',
    title: 'Gecenin ve Hiçliğin İnfazcısı',
    badge: '🌑',
    element: 'void',
    color: '#c084fc',
    accentColor: '#a855f7',
    hp: 130,
    speed: 3.8,
    dmgMul: 1.0,
    critBonus: 25,
    weapon: 'Çift Ruh Çakramı',
    passiveName: 'Gölge İnfazı',
    passiveDesc: 'Dash ile düşmanların içinden geçer ve işaretler. İşaretli hedefe ilk vuruş %300 Kritik İnfaz vurur!',
    quote: '"Gölgede olanı karanlık bile göremez."'
  },
  ayaz: {
    id: 'ayaz',
    name: 'AYAZ HAN',
    title: 'Soğuğun ve Kışın Efendisi',
    badge: '❄️',
    element: 'ice',
    color: '#00e5ff',
    accentColor: '#0288d1',
    hp: 190,
    speed: 3.2,
    dmgMul: 1.10,
    weapon: 'Kristal Permafrost Gürzü',
    passiveName: 'Mutlak Sıfır (Shatter)',
    passiveDesc: 'Donmuş düşman öldüğünde cam gibi kırılarak çevredeki tüm canavarları donduran zincirleme buz patlaması açar.',
    quote: '"Kış nefesi kemikleri dondurur!"'
  },
  umay: {
    id: 'umay',
    name: 'UMAY ANA',
    title: 'Fırtına ve Yaşamın Koruyucusu',
    badge: '⚡',
    element: 'storm',
    color: '#facc15',
    accentColor: '#eab308',
    hp: 140,
    speed: 3.7,
    dmgMul: 1.0,
    atkSpeedBonus: 25,
    weapon: 'Çift Şimşek Hançeri',
    passiveName: 'Statik İvme',
    passiveDesc: 'Koştukça statik şarj depolar; şarj dolduğunda 5 düşman arasında seken top yıldırımı saçar.',
    quote: '"Göklerin nuru bizi korusun."'
  },
  kayra: {
    id: 'kayra',
    name: 'KAYRA HAN',
    title: 'Zamanın ve Göklerin Hakimi',
    badge: '⏳',
    element: 'chrono',
    color: '#38bdf8',
    accentColor: '#6366f1',
    hp: 150,
    speed: 3.4,
    dmgMul: 1.10,
    weapon: 'Pirinç Kronometre Asası',
    passiveName: 'Zaman Bozulması',
    passiveDesc: 'Düşman mermilerini havada %70 yavaşlatır; ölümcül hasarda zamanı 3 saniye geri sararak can yeniler (90s CD).',
    quote: '"Zaman bükülür, kader şaşmaz."'
  },
  mergen: {
    id: 'mergen',
    name: 'MERGEN HAN',
    title: 'Bozkırın Bilge Avcısı',
    badge: '🏹',
    element: 'nature',
    color: '#4ade80',
    accentColor: '#16a34a',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.12,
    weapon: 'Yaşayan Sarmaşık Yayı',
    passiveName: 'Kök Salma Tareti',
    passiveDesc: '0.7s durduğunda kök salar: Saldırı hızı +%60 artar ve etrafında yavaşlatan diken tarlası filizlenir.',
    quote: '"Bozkırın gözünden hiçbir av kaçamaz."'
  },
  ulgen: {
    id: 'ulgen',
    name: 'ÜLGEN HAN',
    title: 'Işığın ve 4 Elementin Arkonu',
    badge: '🔮',
    element: 'universal',
    color: '#f43f5e',
    accentColor: '#8b5cf6',
    hp: 180,
    speed: 3.5,
    dmgMul: 1.20,
    weapon: 'Dörtlü Elementel Prizma',
    passiveName: 'Elementel Simya',
    passiveDesc: 'Her 10s bir elementi değişerek o elementin en üstün gücünü kazanır (Ateşte +%40 hasar, Suda kalkan, Doğada can çalma, Yıldırımda hız).',
    quote: '"Dört kadim güç tek bir iradede!"'
  }
};`;

if (content.includes(oldRosterTarget)) {
  content = content.replace(oldRosterTarget, full8HeroRosterReplacement);
  console.log('Pillar 1: Expanded HERO_ROSTER to all 8 heroes!');
} else {
  console.error('ERROR: Could not find oldRosterTarget');
}

// =========================================================================
// PILLAR 1: ADD BESPOKE PIXEL SPRITES FOR AYAZ, UMAY, KAYRA, MERGEN, ULGEN
// =========================================================================
const newHeroRenderers = `
// =========================================================================
// 4. AYAZ HAN — SOĞUĞUN VE KIŞIN EFENDİSİ (CRYSTALLINE ICE LORD)
// =========================================================================
function drawHeroAyaz(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  // 1. Kristalize Buz Pelerini (Frozen Icicle Mantle)
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.2) * 0.25;
  const capeLen = isMoving ? 22 : 16;
  ctx.save();
  ctx.fillStyle = 'rgba(2, 136, 209, 0.7)';
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 6, cy + 2);
  ctx.lineTo(px + Math.cos(capeAng - 0.35) * (capeLen + 3), cy + 4 + Math.sin(capeAng - 0.35) * (capeLen * 0.6));
  ctx.lineTo(px + Math.cos(capeAng + 0.35) * (capeLen + 4), cy + 6 + Math.sin(capeAng + 0.35) * (capeLen * 0.6));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 5, cy);
  ctx.lineTo(px + Math.cos(capeAng - 0.2) * capeLen, cy + 3 + Math.sin(capeAng - 0.2) * (capeLen * 0.5));
  ctx.lineTo(px + Math.cos(capeAng + 0.2) * (capeLen + 2), cy + 5 + Math.sin(capeAng + 0.2) * (capeLen * 0.5));
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Çizmeler
  const footL_x = px - 5 - legSwing * 0.7;
  const footR_x = px + 5 + legSwing * 0.7;
  ctx.fillStyle = '#01579b';
  ctx.fillRect(footL_x - 3, cy + 10, 6, 5);
  ctx.fillRect(footR_x - 3, cy + 10, 6, 5);
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(footL_x - 1, cy + 11, 2, 2);
  ctx.fillRect(footR_x - 1, cy + 11, 2, 2);

  // 3. Kristal Zırhlı Gövde
  ctx.fillStyle = '#0288d1';
  ctx.beginPath(); ctx.ellipse(px, cy + 2, 10, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1.6; ctx.stroke();

  // 4. Sivri Buz Sarkıtı Omuzluklar
  ctx.fillStyle = '#b2ebf2';
  ctx.beginPath();
  ctx.moveTo(px - 14, cy - 2); ctx.lineTo(px - 7, cy - 8); ctx.lineTo(px - 5, cy + 2);
  ctx.moveTo(px + 14, cy - 2); ctx.lineTo(px + 7, cy - 8); ctx.lineTo(px + 5, cy + 2);
  ctx.fill();

  // 5. Buz Tacı Miğfer & Mavi Parlayan Gözler
  ctx.fillStyle = '#006064';
  ctx.beginPath(); ctx.arc(px, cy - 8, 7.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(px - 6, cy - 11); ctx.lineTo(px - 4, cy - 18); ctx.lineTo(px - 2, cy - 11);
  ctx.moveTo(px, cy - 11); ctx.lineTo(px, cy - 20); ctx.lineTo(px + 2, cy - 11);
  ctx.moveTo(px + 2, cy - 11); ctx.lineTo(px + 4, cy - 18); ctx.lineTo(px + 6, cy - 11);
  ctx.fill();
  const lookX = Math.cos(faceAng) * 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + lookX - 3.5, cy - 9, 3, 2);
  ctx.fillRect(px + lookX + 1.5, cy - 9, 3, 2);

  // 6. Kristal Permafrost Gürzü
  ctx.save();
  const maceAng = isAttacking ? faceAng + Math.sin(time * 0.8) * 1.0 : faceAng + Math.PI * 0.7;
  ctx.translate(px, cy + 1); ctx.rotate(maceAng);
  ctx.fillStyle = '#455a64'; ctx.fillRect(4, -2, 18, 4); // Sap
  ctx.fillStyle = '#00e5ff'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(22, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// =========================================================================
// 5. UMAY ANA — FIRTINA VE YAŞAMIN KORUYUCUSU (RADIANT STORM VALKYRIE)
// =========================================================================
function drawHeroUmay(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  // 1. Altın Şimşek Şeritleri & Kanat Halesi
  ctx.save();
  const wingPulse = Math.sin(time * 0.3) * 3;
  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.2;
  // Sol Altın Kanat
  ctx.beginPath();
  ctx.moveTo(px - 4, cy); ctx.quadraticCurveTo(px - 18, cy - 12 - wingPulse, px - 22, cy - 4);
  ctx.stroke();
  // Sağ Altın Kanat
  ctx.beginPath();
  ctx.moveTo(px + 4, cy); ctx.quadraticCurveTo(px + 18, cy - 12 - wingPulse, px + 22, cy - 4);
  ctx.stroke();
  ctx.restore();

  // 2. Çizmeler
  const footL_x = px - 4 - legSwing * 0.8;
  const footR_x = px + 4 + legSwing * 0.8;
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(footL_x - 2, cy + 10, 4, 5);
  ctx.fillRect(footR_x - 2, cy + 10, 4, 5);

  // 3. Altın Göğüs Zırhı & İpek Akış
  ctx.fillStyle = '#eab308';
  ctx.beginPath(); ctx.ellipse(px, cy + 2, 8.5, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.4; ctx.stroke();

  // 4. Taç & Yüz
  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.arc(px, cy - 7, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(px - 5, cy - 12, 10, 3); // Altın Diadem Taç
  const lookX = Math.cos(faceAng) * 2;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + lookX - 3, cy - 7, 2, 2);
  ctx.fillRect(px + lookX + 1.5, cy - 7, 2, 2);

  // 5. Çift Şimşek Hançerleri
  const dRot = isAttacking ? time * 0.9 : time * 0.3;
  for (let hi = -1; hi <= 1; hi += 2) {
    ctx.save();
    ctx.translate(px + hi * 12, cy + Math.sin(dRot + hi) * 4);
    ctx.rotate(faceAng + hi * 0.3);
    ctx.fillStyle = '#fde047'; ctx.fillRect(-1, -6, 2.5, 12);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-0.5, -8, 1.5, 3);
    ctx.restore();
  }
}

// =========================================================================
// 6. KAYRA HAN — ZAMANIN VE GÖKLERİN HAKİMİ (CHRONOMANCER ARCHON)
// =========================================================================
function drawHeroKayra(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  // 1. Dönen Pirinç Zaman Çarkı (Rotating Clockwork Gear Aura)
  ctx.save();
  ctx.translate(px, cy + 1);
  ctx.rotate(time * 0.12);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // 2. Gök Cübbesi
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.ellipse(px, cy + 3, 9, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4338ca'; ctx.lineWidth = 1.5; ctx.stroke();

  // 3. Bilge Başlığı & Ak Sakal
  ctx.fillStyle = '#312e81';
  ctx.beginPath(); ctx.arc(px, cy - 7, 7.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f8fafc'; // Ak sakal
  ctx.beginPath();
  ctx.moveTo(px - 4, cy - 4); ctx.lineTo(px, cy + 3); ctx.lineTo(px + 4, cy - 4);
  ctx.fill();

  // 4. Pirinç Kronometre Asası
  ctx.save();
  const staffAng = isAttacking ? faceAng + Math.sin(time * 0.7) * 0.8 : faceAng + Math.PI * 0.75;
  ctx.translate(px, cy + 1); ctx.rotate(staffAng);
  ctx.fillStyle = '#78350f'; ctx.fillRect(4, -1.5, 22, 3); // Asa gövdesi
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(26, 0, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(26, 0, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// =========================================================================
// 7. MERGEN HAN — BOZKIRIN BİLGE AVCISI (PRIMAL NOMAD ARCHER)
// =========================================================================
function drawHeroMergen(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  const isAttacking = pState === PLAYER_STATE.ATTACK;
  // 1. Deri Avcı Yeleği & Yeşil Pelerin
  ctx.save();
  const capeAng = faceAng + Math.PI + Math.sin(time * 0.25) * 0.2;
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.moveTo(px - Math.cos(faceAng) * 5, cy + 1);
  ctx.lineTo(px + Math.cos(capeAng - 0.3) * 18, cy + 4 + Math.sin(capeAng - 0.3) * 9);
  ctx.lineTo(px + Math.cos(capeAng + 0.3) * 19, cy + 6 + Math.sin(capeAng + 0.3) * 9);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  // 2. Çizmeler & Gövde
  const footL_x = px - 4 - legSwing * 0.8;
  const footR_x = px + 4 + legSwing * 0.8;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(footL_x - 2, cy + 10, 4, 5);
  ctx.fillRect(footR_x - 2, cy + 10, 4, 5);
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.ellipse(px, cy + 2, 8.5, 9, 0, 0, Math.PI * 2); ctx.fill();

  // 3. Boynuzlu Avcı Başlığı
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(px, cy - 7, 7, 0, Math.PI * 2); ctx.fill();
  // Geyik Boynuzları
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(px - 5, cy - 11); ctx.lineTo(px - 10, cy - 17); ctx.lineTo(px - 13, cy - 15);
  ctx.moveTo(px + 5, cy - 11); ctx.lineTo(px + 10, cy - 17); ctx.lineTo(px + 13, cy - 15);
  ctx.stroke();

  // 4. Yaşayan Sarmaşık Yayı (Composite Bow)
  ctx.save();
  ctx.translate(px, cy + 1); ctx.rotate(faceAng);
  ctx.strokeStyle = '#15803d'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(10, 0, 10, -Math.PI * 0.45, Math.PI * 0.45); ctx.stroke();
  ctx.strokeStyle = '#86efac'; ctx.lineWidth = 1.0;
  ctx.beginPath(); ctx.moveTo(10 + Math.cos(-Math.PI * 0.45) * 10, Math.sin(-Math.PI * 0.45) * 10);
  ctx.lineTo(isAttacking ? 2 : 7, 0); // Kiriş çekme
  ctx.lineTo(10 + Math.cos(Math.PI * 0.45) * 10, Math.sin(Math.PI * 0.45) * 10);
  ctx.stroke();
  ctx.restore();
}

// =========================================================================
// 8. ÜLGEN HAN — IŞIĞIN VE 4 ELEMENTİN ARKONU (PRIME ELEMENTAL ARCHON)
// =========================================================================
function drawHeroUlgen(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing) {
  // 1. Havada Süzülen Enerji Bedeni (Levitating Energy Body)
  const floatBob = Math.sin(time * 0.25) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath(); ctx.arc(px, cy + floatBob, 12, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(px, cy + floatBob, 8, 10, 0, 0, Math.PI * 2); ctx.fill();

  // Baş & Işık Halesi
  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(px, cy + floatBob - 8, 9, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(px, cy + floatBob - 8, 6, 0, Math.PI * 2); ctx.fill();

  // 2. YÖRÜNGEDE DÖNEN 4 ANA ELEMENT KÜRESİ (ATEŞ, SU, DOĞA, YILDIRIM)
  const orbCols = ['#ff3d00', '#00b0ff', '#22c55e', '#facc15'];
  const orbDist = 20;
  const rot = time * 0.2;
  for (let oi = 0; oi < 4; oi++) {
    const oAng = rot + oi * (Math.PI / 2);
    const ox = px + Math.cos(oAng) * orbDist;
    const oy = cy + floatBob + Math.sin(oAng) * (orbDist * 0.45);
    ctx.fillStyle = orbCols[oi];
    ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ox, oy, 1.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
`;

// Insert newHeroRenderers before drawHeroPlayer
const drawHeroKorhanTarget = `function drawHeroKorhan(`;
if (content.includes(drawHeroKorhanTarget)) {
  content = content.replace(drawHeroKorhanTarget, newHeroRenderers + '\n' + drawHeroKorhanTarget);
  console.log('Pillar 1: Inserted bespoke renderers for Ayaz, Umay, Kayra, Mergen, Ulgen!');
} else {
  console.error('ERROR: Could not find drawHeroKorhanTarget');
}

// Update drawHeroPlayer dispatch to include all 8 heroes
const dispatchTarget = `  if (curHeroId === 'korhan') {
    drawHeroKorhan(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'karacor') {
    drawHeroKaracor(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'bamsi') {
    drawHeroBamsi(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  }`;

const dispatchReplacement = `  if (curHeroId === 'korhan') {
    drawHeroKorhan(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'karacor') {
    drawHeroKaracor(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'bamsi') {
    drawHeroBamsi(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'ayaz') {
    drawHeroAyaz(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'umay') {
    drawHeroUmay(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'kayra') {
    drawHeroKayra(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'mergen') {
    drawHeroMergen(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  } else if (curHeroId === 'ulgen') {
    drawHeroUlgen(ctx, px, py, cy, player, time, hopP, isMoving, faceAng, isFacingLeft, pState, legSwing);
    return;
  }`;

if (content.includes(dispatchTarget)) {
  content = content.replace(dispatchTarget, dispatchReplacement);
  console.log('Pillar 1: Updated drawHeroPlayer dispatch to all 8 heroes!');
} else {
  console.error('ERROR: Could not find dispatchTarget');
}

// =========================================================================
// PILLAR 1: ADD PASSIVE MECHANICS FOR AYAZ, UMAY, KAYRA, MERGEN, ULGEN
// =========================================================================
const updatePassivesTarget = `  // --- STEP 5: PRO-LEVEL DASH MOTION, I-FRAMES & NEAR-MISS REWARD ---`;
const newPassivesCode = `  // =========================================================================
  // TÜRK MİTOLOJİSİ KAHRAMAN PASİFLERİ (AYAZ, UMAY, KAYRA, MERGEN, ÜLGEN)
  // =========================================================================
  const hId = (player && player.heroId) || selectedHeroId;

  // 1. UMAY ANA: STATİK İVME ŞARJI (Koştukça şarj birikir, 100 olunca top yıldırım fırlar)
  if (hId === 'umay' && player.moving) {
    player._umayCharge = Math.min(100, (player._umayCharge || 0) + dt * 1.8);
    if (player._umayCharge >= 100 && !player._umayReady) {
      player._umayReady = true;
      spawnFloatText(player.x, player.y - 24, '⚡ YILDIRIM ŞARJI HAZIR!', '#facc15', 'big');
      playSfx('confirm', 0.4, 880);
    }
  }

  // 2. MERGEN HAN: KÖK SALMA TARETİ (0.7s durunca +%60 AtkSpeed & Diken Tarlası)
  if (hId === 'mergen') {
    if (!player.moving) {
      player._mergenRootTimer = (player._mergenRootTimer || 0) + dt;
      if (player._mergenRootTimer > 42) { // ~0.7s
        if (!player._mergenRooted) {
          player._mergenRooted = true;
          spawnFloatText(player.x, player.y - 24, '🏹 KÖK SALINDI (+%60 HIZ)!', '#4ade80', 'big');
          playSfx('skill', 0.35, 620);
        }
        player.mods.atkSpeed = 60;
        // Diken tarlası aurası
        if (Math.random() < 0.15) {
          spawnElemStain(player.x + (Math.random()-0.5)*40, player.y + (Math.random()-0.5)*40, 24, 'nature', 60);
        }
      }
    } else {
      player._mergenRootTimer = 0;
      if (player._mergenRooted) {
        player._mergenRooted = false;
        player.mods.atkSpeed = 0;
      }
    }
  }

  // 3. ÜLGEN HAN: ELEMENTEL SİMYA (Her 10 saniyede bir element dönüşümü)
  if (hId === 'ulgen') {
    player._ulgenCycleTimer = (player._ulgenCycleTimer || 0) + dt;
    if (player._ulgenCycleTimer >= 600) { // 10 saniye
      player._ulgenCycleTimer = 0;
      const elements = ['fire', 'water', 'nature', 'storm'];
      player._ulgenModeIdx = ((player._ulgenModeIdx || 0) + 1) % elements.length;
      const curEl = elements[player._ulgenModeIdx];
      const elLabels = { fire: '🔥 ATEŞ (+%40 HASAR)', water: '💧 SU (KALKAN)', nature: '🌿 DOĞA (CAN ÇALMA)', storm: '⚡ YILDIRIM (HIZ)' };
      spawnFloatText(player.x, player.y - 26, elLabels[curEl], '#f43f5e', 'big');
      playSfx('legendary', 0.4);
      if (curEl === 'water') shieldOn = Math.max(shieldOn || 0, 1);
    }
  }
`;

if (content.includes(updatePassivesTarget)) {
  content = content.replace(updatePassivesTarget, newPassivesCode + '\n  ' + updatePassivesTarget);
  console.log('Pillar 1: Inserted update loop passives for Umay, Mergen, Ulgen!');
} else {
  console.error('ERROR: Could not find updatePassivesTarget');
}

// Hook Kayra Han fatal damage rewind in damagePlayer
const kayraRewindTarget = `  player.hp -= dmg;`;
const kayraRewindCode = `  // KAYRA HAN: ZAMAN GERİ SARMA (Ölümcül Hasardan Kurtulma - 90s CD)
  if ((player.heroId === 'kayra' || selectedHeroId === 'kayra') && player.hp - dmg <= 0 && (!player._kayraCd || performance.now() > player._kayraCd)) {
    player._kayraCd = performance.now() + 90000;
    player.hp = Math.round(player.maxHp * 0.65);
    player.invuln = 120; // 2s dokunulmazlık
    triggerScreenFlash('#38bdf8', 0.5, 300);
    spawnFloatText(player.x, player.y - 32, '⏳ ZAMAN GERİ SARILDI!', '#38bdf8', 'big');
    playSfx('legendary', 0.6);
    shake = Math.max(shake, 14);
    // Push away enemies
    if (enemies && enemies.length) {
      enemies.forEach(en => {
        if (Math.hypot(en.x - player.x, en.y - player.y) < 220) punchEnemy(en, player.x, player.y, 28, true);
      });
    }
    return;
  }

  player.hp -= dmg;`;

if (content.includes(kayraRewindTarget)) {
  content = content.replace(kayraRewindTarget, kayraRewindCode);
  console.log('Pillar 1: Hooked Kayra Han Chrono Rewind into damagePlayer!');
}

// =========================================================================
// PILLAR 2: MINIMALIST & NINTENDO/APPLE ELEGANT MENU UI
// =========================================================================
// Replace hero selection tabs with 8-hero carousel buttons
const heroTabsRowTarget = `<div class="hero-tabs-row" id="heroTabsRow">
          <button type="button" class="hero-tab-btn" id="heroTab_bamsi" onclick="selectHero('bamsi')">
            <span class="hero-tab-icon">🌪️</span>
            <span class="hero-tab-name">BAMSI</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_korhan" onclick="selectHero('korhan')">
            <span class="hero-tab-icon">🌋</span>
            <span class="hero-tab-name">KORHAN</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_karacor" onclick="selectHero('karacor')">
            <span class="hero-tab-icon">🌑</span>
            <span class="hero-tab-name">KARAÇOR</span>
          </button>
        </div>`;

const heroTabsRowReplacement = `<div class="hero-tabs-row" id="heroTabsRow" style="grid-template-columns: repeat(4, 1fr); gap: 5px;">
          <button type="button" class="hero-tab-btn" id="heroTab_bamsi" onclick="selectHero('bamsi')">
            <span class="hero-tab-icon">🌪️</span>
            <span class="hero-tab-name">BAMSI</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_korhan" onclick="selectHero('korhan')">
            <span class="hero-tab-icon">🌋</span>
            <span class="hero-tab-name">KORHAN</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_karacor" onclick="selectHero('karacor')">
            <span class="hero-tab-icon">🌑</span>
            <span class="hero-tab-name">KARAÇOR</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_ayaz" onclick="selectHero('ayaz')">
            <span class="hero-tab-icon">❄️</span>
            <span class="hero-tab-name">AYAZ</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_umay" onclick="selectHero('umay')">
            <span class="hero-tab-icon">⚡</span>
            <span class="hero-tab-name">UMAY</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_kayra" onclick="selectHero('kayra')">
            <span class="hero-tab-icon">⏳</span>
            <span class="hero-tab-name">KAYRA</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_mergen" onclick="selectHero('mergen')">
            <span class="hero-tab-icon">🏹</span>
            <span class="hero-tab-name">MERGEN</span>
          </button>
          <button type="button" class="hero-tab-btn" id="heroTab_ulgen" onclick="selectHero('ulgen')">
            <span class="hero-tab-icon">🔮</span>
            <span class="hero-tab-name">ÜLGEN</span>
          </button>
        </div>`;

if (content.includes(heroTabsRowTarget)) {
  content = content.replace(heroTabsRowTarget, heroTabsRowReplacement);
  console.log('Pillar 2: Updated hero tabs row with all 8 heroes in 4x2 grid!');
}

// Update updateHeroSelectUI to support all 8 heroes
const updateUiHeroListTarget = `['bamsi', 'korhan', 'karacor'].forEach(id => {`;
const updateUiHeroListReplacement = `['bamsi', 'korhan', 'karacor', 'ayaz', 'umay', 'kayra', 'mergen', 'ulgen'].forEach(id => {`;
if (content.includes(updateUiHeroListTarget)) {
  content = content.replace(updateUiHeroListTarget, updateUiHeroListReplacement);
  console.log('Pillar 2: updateHeroSelectUI updated for 8 heroes!');
}

// =========================================================================
// PILLAR 3: PUNCHY STUDIO AUDIO & SUB-BASS FOLEY
// =========================================================================
const punchyAudioCode = `
// =========================================================================
// PUNCHY STUDIO AUDIO ENGINE (SUB-BASS & FOLEY SYNTHESIS)
// =========================================================================
function playPunchySubBass(freq, duration, intensity) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, t);
    filter.frequency.exponentialRampToValueAtTime(45, t + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq || 65, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + duration);

    const v = Math.min(1.0, (intensity || 0.4) * sfxVol);
    gain.gain.setValueAtTime(v, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + duration);
  } catch(e) {}
}

function playMetallicRing(freq) {
  try {
    const ctx = audioCtx();
    if (!ctx || !sfxOn || sfxVol <= 0.02) return;
    const t = ctx.currentTime;
    const dest = getAudioDest(ctx);

    [1.0, 2.14, 3.42].forEach((mul, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime((freq || 1200) * mul, t);
      const v = (0.2 / (i + 1)) * sfxVol;
      gain.gain.setValueAtTime(v, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16 + i * 0.05);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch(e) {}
}
`;

// Insert punchyAudioCode before synthBlip
const synthBlipTarget = `function synthBlip(kind) {`;
if (content.includes(synthBlipTarget)) {
  content = content.replace(synthBlipTarget, punchyAudioCode + '\n' + synthBlipTarget);
  console.log('Pillar 3: Inserted Punchy Studio Audio Engine!');
}

// Hook sub-bass into projectile hit
const hookHitSubBassTarget = `punchEnemy(en, p.x, p.y, crited ? 18 : 10, crited);`;
const hookHitSubBassReplacement = `punchEnemy(en, p.x, p.y, crited ? 18 : 10, crited);
        playPunchySubBass(crited ? 75 : 55, 0.14, crited ? 0.45 : 0.28);`;

if (content.includes(hookHitSubBassTarget)) {
  content = content.replace(hookHitSubBassTarget, hookHitSubBassReplacement);
  console.log('Pillar 3: Hooked Punchy Sub-Bass into projectile hits!');
}

// =========================================================================
// PILLAR 4: TACTICAL ENEMY SWARM FORMATIONS & PACING ENGINE
// =========================================================================
const swarmFormationCode = `
// =========================================================================
// TACTICAL ENEMY SWARM FORMATIONS (KUŞATMA ÇEMBERİ, HÜCUM HATTI, GİRDAP)
// =========================================================================
function triggerSwarmFormation(formType) {
  if (!player || !enemies) return;
  const biome = currentBiome();
  const themeCol = (biome && biome.accent) || '#ff1744';

  if (formType === 'encirclement') {
    // 1. KUŞATMA ÇEMBERİ (ENCIRCLEMENT RING)
    showStreakBanner('⚡ KUŞATMA ÇEMBERİ! DIŞARI KAÇ! ⚡', '#ffd700');
    triggerScreenFlash('#ffd700', 0.35, 200);
    playSfx('charge', 0.6);
    shake = Math.max(shake, 10);
    vibrate([40, 60, 40]);

    const count = Math.min(28, 20 + Math.floor(wave * 0.8));
    const r = 320;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2;
      const ex = player.x + Math.cos(ang) * r;
      const ey = player.y + Math.sin(ang) * r;
      spawnSingleEnemy(ex, ey, 'fast');
    }
  } else if (formType === 'phalanx') {
    // 2. HÜCUM SÜVARİ HATTI (PHALANX CHARGE LINE)
    showStreakBanner('⚔️ HÜCUM HATTI YAKLAŞIYOR! ⚔️', '#ff3d00');
    playSfx('laser_charge', 0.6);
    shake = Math.max(shake, 8);

    const lineDir = Math.random() < 0.5 ? 'horiz' : 'vert';
    const count = 12;
    if (lineDir === 'horiz') {
      const spawnY = player.y - 340;
      for (let i = 0; i < count; i++) {
        const ex = player.x - 220 + i * 40;
        spawnSingleEnemy(ex, spawnY, 'tank');
      }
    } else {
      const spawnX = player.x - 340;
      for (let i = 0; i < count; i++) {
        const ey = player.y - 220 + i * 40;
        spawnSingleEnemy(spawnX, ey, 'fast');
      }
    }
  } else if (formType === 'spiral') {
    // 3. PUSUCU GİRDAP (SPIRAL AMBUSH)
    showStreakBanner('🌪️ GİRDAP PUSUSU! 🌪️', '#c084fc');
    playSfx('skill', 0.5);
    const corners = [
      { x: player.x - 280, y: player.y - 280 },
      { x: player.x + 280, y: player.y - 280 },
      { x: player.x - 280, y: player.y + 280 },
      { x: player.x + 280, y: player.y + 280 }
    ];
    corners.forEach(c => {
      for (let k = 0; k < 5; k++) {
        spawnSingleEnemy(c.x + (Math.random()-0.5)*30, c.y + (Math.random()-0.5)*30, 'shooter');
      }
    });
  }
}
`;

// Insert swarmFormationCode before spawnWave
const spawnWaveTarget = `function spawnWave() {`;
if (content.includes(spawnWaveTarget)) {
  content = content.replace(spawnWaveTarget, swarmFormationCode + '\n' + spawnWaveTarget);
  console.log('Pillar 4: Inserted Tactical Enemy Swarm Formations!');
}

// Hook dynamic swarm trigger into spawnWave
const spawnWaveHookTarget = `const count = baseCount;`;
const spawnWaveHookReplacement = `const count = baseCount;
  // Taktiksel Sürü Formasyon Tetikleyicisi (Wave 3, 5, 7, 9)
  if (!isBossWave && wave >= 3 && Math.random() < 0.45) {
    const fTypes = ['encirclement', 'phalanx', 'spiral'];
    const chosenForm = fTypes[Math.floor(Math.random() * fTypes.length)];
    setTimeout(() => {
      if (running && !paused) triggerSwarmFormation(chosenForm);
    }, 1800);
  }`;

if (content.includes(spawnWaveHookTarget)) {
  content = content.replace(spawnWaveHookTarget, spawnWaveHookReplacement);
  console.log('Pillar 4: Hooked tactical swarm formations into spawnWave!');
}

// Write back to index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('[4 Pillars Master] Successfully wrote updated index.html! New length:', content.length);
