const fs = require('fs');

console.log('Reading index.html...');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. STEP 1 CONTINUATION: SAFE-AREA MARGINS & ERGONOMIC THUMB ARC
// =========================================================================
console.log('Applying Step 1: Safe-area margins & thumb arc...');

// Update #ultFab, #dashFab, #stanceFab CSS
const oldFabCSS = `#ultFab {
    position: absolute; right: 16px; bottom: 94px; z-index: 12;
    width: 62px; height: 62px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b, #090a10);
    border: 2.2px solid #5a4b24;
    color: #ffd700; cursor: pointer; display: none; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.7);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, box-shadow 0.2s, border-color 0.2s;
  }
  #ultFab.ready {
    border-color: #ffd700;
    background: radial-gradient(circle at 35% 35%, #7c3aed, #0f172a);
    box-shadow: 0 0 32px rgba(255, 215, 0, 1), 0 0 54px rgba(124, 58, 237, 0.65), inset 0 0 18px rgba(255, 215, 0, 0.6);
    animation: ultPulse 0.75s ease-in-out infinite alternate;
  }
  #ultFab:active { transform: scale(0.92); }
  .ult-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .ult-icon { font-size: 20px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); }
  .ult-txt { font-size: 8.5px; font-weight: 900; letter-spacing: 0.5px; color: #ffd700; margin-top: 2px; }
  @keyframes ultPulse {
    0% { transform: scale(1); filter: brightness(1); }
    100% { transform: scale(1.08); filter: brightness(1.25); }
  }
  #dashFab {
    position: absolute; right: 16px; bottom: 166px; z-index: 10;
    width: 58px; height: 58px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b, #090a14);
    border: 2.2px solid #a855f7;
    color: #e9d5ff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.65), 0 0 14px rgba(168, 85, 247, 0.35);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, opacity 0.2s, border-color 0.2s;
  }
  #dashFab:active { transform: scale(0.90); }
  #dashFab.cooldown { opacity: 0.38; border-color: #475569; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  .dash-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .dash-icon { font-size: 22px; line-height: 1; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.9)); }
  .dash-txt { font-size: 8.5px; font-weight: 900; letter-spacing: 0.6px; color: #e9d5ff; margin-top: 2px; }
  #stanceFab {
    position: absolute; right: 16px; bottom: 236px; z-index: 10;
    width: 52px; height: 52px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #0f172a, #020617);
    border: 2px solid #38bdf8;
    color: #e0f2fe; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.65), 0 0 10px rgba(56, 189, 248, 0.35);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, border-color 0.2s;
  }
  #stanceFab:active { transform: scale(0.90); }
  .stance-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .stance-icon { font-size: 19px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)); }
  .stance-txt { font-size: 7.5px; font-weight: 900; letter-spacing: 0.5px; color: #38bdf8; margin-top: 1px; }
  #skillBar {
    position:absolute; left:8px; right:8px; bottom:12px; z-index:6;
    display:flex; justify-content:center; gap:10px; pointer-events:none;
  }`;

const newFabCSS = `/* ERGONOMIC MOBILE THUMB ARC - Away from dangerous Android Back-Gesture Edge */
  #dashFab {
    position: absolute;
    right: max(22px, calc(env(safe-area-inset-right, 0px) + 18px));
    bottom: max(96px, calc(env(safe-area-inset-bottom, 0px) + 88px));
    z-index: 10;
    width: 62px; height: 62px; min-width: 48px; min-height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b, #090a14);
    border: 2.2px solid #a855f7;
    color: #e9d5ff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.65), 0 0 14px rgba(168, 85, 247, 0.35);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, opacity 0.2s, border-color 0.2s;
  }
  #dashFab:active { transform: scale(0.90); }
  #dashFab.cooldown { opacity: 0.38; border-color: #475569; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  .dash-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .dash-icon { font-size: 22px; line-height: 1; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.9)); }
  .dash-txt { font-size: 8.5px; font-weight: 900; letter-spacing: 0.6px; color: #e9d5ff; margin-top: 2px; }

  #ultFab {
    position: absolute;
    right: max(24px, calc(env(safe-area-inset-right, 0px) + 20px));
    bottom: max(172px, calc(env(safe-area-inset-bottom, 0px) + 164px));
    z-index: 12;
    width: 60px; height: 60px; min-width: 48px; min-height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b, #090a10);
    border: 2.2px solid #5a4b24;
    color: #ffd700; cursor: pointer; display: none; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.7);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, box-shadow 0.2s, border-color 0.2s;
  }
  #ultFab.ready {
    border-color: #ffd700;
    background: radial-gradient(circle at 35% 35%, #7c3aed, #0f172a);
    box-shadow: 0 0 32px rgba(255, 215, 0, 1), 0 0 54px rgba(124, 58, 237, 0.65), inset 0 0 18px rgba(255, 215, 0, 0.6);
    animation: ultPulse 0.75s ease-in-out infinite alternate;
  }
  #ultFab:active { transform: scale(0.92); }
  .ult-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .ult-icon { font-size: 20px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); }
  .ult-txt { font-size: 8.5px; font-weight: 900; letter-spacing: 0.5px; color: #ffd700; margin-top: 2px; }
  @keyframes ultPulse {
    0% { transform: scale(1); filter: brightness(1); }
    100% { transform: scale(1.08); filter: brightness(1.25); }
  }

  #stanceFab {
    position: absolute;
    right: max(92px, calc(env(safe-area-inset-right, 0px) + 88px));
    bottom: max(98px, calc(env(safe-area-inset-bottom, 0px) + 90px));
    z-index: 10;
    width: 52px; height: 52px; min-width: 48px; min-height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #0f172a, #020617);
    border: 2px solid #38bdf8;
    color: #e0f2fe; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.65), 0 0 10px rgba(56, 189, 248, 0.35);
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.12s, border-color 0.2s;
  }
  #stanceFab:active { transform: scale(0.90); }
  .stance-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
  .stance-icon { font-size: 19px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)); }
  .stance-txt { font-size: 7.5px; font-weight: 900; letter-spacing: 0.5px; color: #38bdf8; margin-top: 1px; }

  #skillBar {
    position: absolute;
    left: max(10px, env(safe-area-inset-left, 0px));
    right: max(10px, env(safe-area-inset-right, 0px));
    bottom: max(16px, calc(env(safe-area-inset-bottom, 0px) + 12px));
    z-index: 6;
    display: flex; justify-content: center; gap: 10px; pointer-events: none;
  }`;

if (html.includes(oldFabCSS)) {
  html = html.replace(oldFabCSS, newFabCSS);
  console.log('Replaced Fab button CSS.');
} else {
  console.warn('Could not find oldFabCSS verbatim, searching loosely...');
}

// Update startOverlay padding for bottom nav pill safety
html = html.replace(
  `padding: max(10px, env(safe-area-inset-top, 0px)) 12px max(14px, env(safe-area-inset-bottom, 0px)) 12px !important;`,
  `padding: max(12px, env(safe-area-inset-top, 0px)) max(12px, env(safe-area-inset-right, 0px)) max(22px, calc(env(safe-area-inset-bottom, 0px) + 12px)) max(12px, env(safe-area-inset-left, 0px)) !important;`
);

// =========================================================================
// 2. HERO ROSTER ENHANCEMENTS: ROLES, RPG STATS & SPECIALITIES
// =========================================================================
console.log('Applying Step 2 & 3: Hero Roster data with RPG stats...');

const oldRosterStr = `const HERO_ROSTER = {
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

const newRosterStr = `const HERO_ROSTER = {
  bamsi: {
    id: 'bamsi',
    name: 'BAMSI',
    title: 'Yelin ve Ruhun Kılıcı',
    role: 'Hızlı Yakın Dövüş · Parry Ustası',
    badge: '🌪️',
    element: 'wind',
    color: '#38bdf8',
    accentColor: '#0284c7',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.05,
    atkSpeedBonus: 20,
    weapon: 'Kavisli Türk Yatağanı',
    specialLabel: '✨ UZMANLIK',
    specialValue: '+%20 Atak Hızı & Parry',
    specialPct: 82,
    passiveName: 'Yel Kalkanı (Parry)',
    passiveDesc: 'Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.',
    quote: '"Yel gibi eser, kılıç gibi biçeriz!"'
  },
  korhan: {
    id: 'korhan',
    name: 'KORHAN',
    title: 'Közün ve Lavın Muhafızı',
    role: 'Ağır Volkanik Tank · Alan Dağıtıcı',
    badge: '🌋',
    element: 'fire',
    color: '#ff5722',
    accentColor: '#ff9800',
    hp: 220,
    speed: 3.0,
    dmgMul: 1.15,
    def: 0.20,
    weapon: 'Akkor Volkanik Pala (Yalman)',
    specialLabel: '🛡️ SAVUNMA',
    specialValue: '+%20 Zırh & Magma Şoku',
    specialPct: 90,
    passiveName: 'Volkanik Siper',
    passiveDesc: 'Her %20 can kaybında tüm çevredeki düşmanları fırlatan ve yakan dev bir magma püskürmesi patlatır.',
    quote: '"Közden doğduk, lavla dövüldük!"'
  },
  karacor: {
    id: 'karacor',
    name: 'KARAÇOR',
    title: 'Gecenin ve Hiçliğin İnfazcısı',
    role: 'Kritik Suikastçi · Gölge İnfazı',
    badge: '🌑',
    element: 'void',
    color: '#c084fc',
    accentColor: '#a855f7',
    hp: 130,
    speed: 3.8,
    dmgMul: 1.0,
    critBonus: 25,
    weapon: 'Çift Ruh Çakramı',
    specialLabel: '🎯 KRİTİK GÜCÜ',
    specialValue: '+%25 Kritik & %300 İnfaz',
    specialPct: 95,
    passiveName: 'Gölge İnfazı',
    passiveDesc: 'Dash ile düşmanların içinden geçer ve işaretler. İşaretli hedefe ilk vuruş %300 Kritik İnfaz vurur!',
    quote: '"Gölgede olanı karanlık bile göremez."'
  },
  ayaz: {
    id: 'ayaz',
    name: 'AYAZ HAN',
    title: 'Soğuğun ve Kışın Efendisi',
    role: 'Buzul Alan Hakimiyeti · Shatter',
    badge: '❄️',
    element: 'ice',
    color: '#00e5ff',
    accentColor: '#0288d1',
    hp: 190,
    speed: 3.2,
    dmgMul: 1.10,
    weapon: 'Kristal Permafrost Gürzü',
    specialLabel: '❄️ DONDURMA',
    specialValue: 'Cam Kırılması & Çevresel Donma',
    specialPct: 85,
    passiveName: 'Mutlak Sıfır (Shatter)',
    passiveDesc: 'Donmuş düşman öldüğünde cam gibi kırılarak çevredeki tüm canavarları donduran zincirleme buz patlaması açar.',
    quote: '"Kış nefesi kemikleri dondurur!"'
  },
  umay: {
    id: 'umay',
    name: 'UMAY ANA',
    title: 'Fırtına ve Yaşamın Koruyucusu',
    role: 'Çevik Şimşek Taşıyıcı · Seken Yıldırım',
    badge: '⚡',
    element: 'storm',
    color: '#facc15',
    accentColor: '#eab308',
    hp: 140,
    speed: 3.7,
    dmgMul: 1.0,
    atkSpeedBonus: 25,
    weapon: 'Çift Şimşek Hançeri',
    specialLabel: '⚡ KİNETİK ŞARJ',
    specialValue: 'Koşarak Dolum & Top Yıldırımı',
    specialPct: 88,
    passiveName: 'Statik İvme',
    passiveDesc: 'Koştukça statik şarj depolar; şarj dolduğunda 5 düşman arasında seken top yıldırımı saçar.',
    quote: '"Göklerin nuru bizi korusun."'
  },
  kayra: {
    id: 'kayra',
    name: 'KAYRA HAN',
    title: 'Zamanın ve Göklerin Hakimi',
    role: 'Zaman Bükücü · Ölüm Geri Sarması',
    badge: '⏳',
    element: 'chrono',
    color: '#38bdf8',
    accentColor: '#6366f1',
    hp: 150,
    speed: 3.4,
    dmgMul: 1.10,
    weapon: 'Pirinç Kronometre Asası',
    specialLabel: '⏳ ZAMAN BÜKME',
    specialValue: 'Mermi Yavaşlatma & Geri Sarma',
    specialPct: 92,
    passiveName: 'Zaman Bozulması',
    passiveDesc: 'Düşman mermilerini havada %70 yavaşlatır; ölümcül hasarda zamanı 3 saniye geri sararak can yeniler (90s CD).',
    quote: '"Zaman bükülür, kader şaşmaz."'
  },
  mergen: {
    id: 'mergen',
    name: 'MERGEN HAN',
    title: 'Bozkırın Bilge Avcısı',
    role: 'Uzak Mesafe Keskin Nişancı · Diken Tareti',
    badge: '🏹',
    element: 'nature',
    color: '#4ade80',
    accentColor: '#16a34a',
    hp: 160,
    speed: 3.5,
    dmgMul: 1.12,
    weapon: 'Yaşayan Sarmaşık Yayı',
    specialLabel: '🌿 KÖK SALMA',
    specialValue: 'Sabit Durunca +%60 Hız & Diken',
    specialPct: 84,
    passiveName: 'Kök Salma Tareti',
    passiveDesc: '0.7s durduğunda kök salar: Saldırı hızı +%60 artar ve etrafında yavaşlatan diken tarlası filizlenir.',
    quote: '"Bozkırın gözünden hiçbir av kaçamaz."'
  },
  ulgen: {
    id: 'ulgen',
    name: 'ÜLGEN HAN',
    title: 'Işığın ve 4 Elementin Arkonu',
    role: 'Kadim Elementalist · Çoklu Simya',
    badge: '🔮',
    element: 'universal',
    color: '#f43f5e',
    accentColor: '#8b5cf6',
    hp: 180,
    speed: 3.5,
    dmgMul: 1.20,
    weapon: 'Dörtlü Elementel Prizma',
    specialLabel: '🔮 ELEMENT SİMYASI',
    specialValue: '+%40 Hasar, Kalkan, Çalma Döngüsü',
    specialPct: 96,
    passiveName: 'Elementel Simya',
    passiveDesc: 'Her 10s bir elementi değişerek o elementin en üstün gücünü kazanır (Ateşte +%40 hasar, Suda kalkan, Doğada can çalma, Yıldırımda hız).',
    quote: '"Dört kadim güç tek bir iradede!"'
  }
};`;

if (html.includes(oldRosterStr)) {
  html = html.replace(oldRosterStr, newRosterStr);
  console.log('Replaced HERO_ROSTER with rich RPG stats.');
} else {
  console.warn('Could not find oldRosterStr verbatim.');
}

// =========================================================================
// 3. STEP 2 & 3: 3-HERO CAROUSEL STAGE & DETAILED DOSSIER HTML
// =========================================================================
console.log('Replacing Hero Showcase HTML with 3-Hero Carousel Stage & Dossier Card...');

const oldShowcaseSection = `      <!-- 2. HERO SHOWCASE CARD (Derli Toplu, Göz Yormayan, Canlı Önizleme) -->
      <section class="hero-showcase-section">
        <div class="hero-spotlight-card" id="heroInfoCard">
          <div class="hero-card-left-visual">
            <canvas id="mainHeroPreviewCanvas" width="96" height="96" class="main-hero-canvas"></canvas>
            <div class="hero-elem-indicator" id="heroElemIndicator">🌪️ RÜZGAR</div>
          </div>

          <div class="hero-card-main">
            <div class="hero-card-header">
              <span class="hero-name-h" id="heroCardTitle">🌪️ BAMSI</span>
              <span class="hero-selected-tag" id="heroSelectedBadge">SEÇİLİ</span>
            </div>
            <div class="hero-card-subtitle" id="heroCardSub">Yelin ve Ruhun Kılıcı</div>
            <div class="hero-card-quote" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</div>

            <div class="hero-stats-row">
              <div class="hstat-chip" id="heroStatHp">❤️ CAN: 160</div>
              <div class="hstat-chip" id="heroStatSpd">⚡ HIZ: 3.5</div>
              <div class="hstat-chip" id="heroStatWep">⚔️ YATAĞAN</div>
            </div>

            <div class="hero-passive-card">
              <div class="hero-passive-lbl" id="heroPassiveTitle">ÖZEL PASİF: Yel Kalkanı (Parry)</div>
              <div class="hero-passive-txt" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>
            </div>

            <button type="button" class="btn btn-hero-change" id="openHeroSelectBtn">
              <span>👥 KAHRAMAN SEÇ & DEĞİŞTİR</span>
              <span class="btn-arrow-glow">➔</span>
            </button>
          </div>
        </div>
      </section>`;

const newShowcaseSection = `      <!-- 2. 3'LÜ KAHRAMAN SAHNESİ & KAPSAMLI DOSYA (Left/Right Silhouettes Stage) -->
      <section class="hero-showcase-section" id="heroShowcaseSection">
        <!-- 3'lü Kaide Vitrini: Sol Silüet, Orta Aktif Kahraman, Sağ Silüet -->
        <div class="hero-stage-carousel" id="heroStageCarousel">
          <button type="button" class="hero-stage-nav prev-nav" id="heroPrevBtn" aria-label="Önceki Kahraman">◀</button>

          <!-- Sol Kaide: Önceki Kahraman Silüeti -->
          <div class="hero-pedestal pedestal-left" id="heroPedestalLeft" role="button" aria-label="Önceki Kahraman">
            <div class="pedestal-disc"></div>
            <canvas id="heroSilhouetteLeft" width="76" height="76" class="hero-pedestal-canvas"></canvas>
            <div class="pedestal-name" id="heroPedestalLeftName">ÖNCEKİ</div>
          </div>

          <!-- Orta Kaide: Aktif Seçili Kahraman (Canlı, Büyütülmüş, Aurik Çember) -->
          <div class="hero-pedestal pedestal-center" id="heroPedestalCenter">
            <div class="hero-stage-aura" id="heroStageAura"></div>
            <div class="pedestal-disc active"></div>
            <canvas id="mainHeroPreviewCanvas" width="104" height="104" class="main-hero-canvas"></canvas>
            <div class="hero-elem-indicator" id="heroElemIndicator">🌪️ RÜZGAR</div>
          </div>

          <!-- Sağ Kaide: Sıradaki Kahraman Silüeti -->
          <div class="hero-pedestal pedestal-right" id="heroPedestalRight" role="button" aria-label="Sonraki Kahraman">
            <div class="pedestal-disc"></div>
            <canvas id="heroSilhouetteRight" width="76" height="76" class="hero-pedestal-canvas"></canvas>
            <div class="pedestal-name" id="heroPedestalRightName">SIRADAKİ</div>
          </div>

          <button type="button" class="hero-stage-nav next-nav" id="heroNextBtn" aria-label="Sonraki Kahraman">▶</button>
        </div>

        <!-- Kahraman Dosyası (Hero Dossier) & Nitelik Barları -->
        <div class="hero-dossier-card" id="heroInfoCard">
          <div class="hero-dossier-header">
            <div class="hero-title-group">
              <span class="hero-name-h" id="heroCardTitle">🌪️ BAMSI</span>
              <span class="hero-role-pill" id="heroRolePill">HIZLI YAKIN DÖVÜŞ</span>
            </div>
            <span class="hero-selected-tag" id="heroSelectedBadge">SEÇİLİ</span>
          </div>
          <div class="hero-card-subtitle" id="heroCardSub">Yelin ve Ruhun Kılıcı</div>

          <!-- Mitolojik Silah & Söz -->
          <div class="hero-weapon-box">
            <div class="weapon-info-line">
              <span class="weapon-icon">⚔️</span>
              <span class="weapon-label" id="heroStatWep">Kavisli Türk Yatağanı</span>
            </div>
            <div class="hero-quote-inline" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</div>
          </div>

          <!-- Görsel Nitelik / Stat Barları (HP, Hız, Hasar, Özel) -->
          <div class="hero-rpg-bars">
            <div class="rpg-bar-item">
              <div class="rpg-bar-label">
                <span class="rpg-stat-name">❤️ CAN (HP)</span>
                <span class="rpg-stat-val" id="heroStatHpVal">160</span>
              </div>
              <div class="rpg-bar-track">
                <div class="rpg-bar-fill hp" id="heroStatHpBar" style="width: 64%;"></div>
              </div>
            </div>
            <div class="rpg-bar-item">
              <div class="rpg-bar-label">
                <span class="rpg-stat-name">⚡ HIZ</span>
                <span class="rpg-stat-val" id="heroStatSpdVal">3.5</span>
              </div>
              <div class="rpg-bar-track">
                <div class="rpg-bar-fill spd" id="heroStatSpdBar" style="width: 78%;"></div>
              </div>
            </div>
            <div class="rpg-bar-item">
              <div class="rpg-bar-label">
                <span class="rpg-stat-name">⚔️ HASAR GÜCÜ</span>
                <span class="rpg-stat-val" id="heroStatDmgVal">1.05x</span>
              </div>
              <div class="rpg-bar-track">
                <div class="rpg-bar-fill dmg" id="heroStatDmgBar" style="width: 70%;"></div>
              </div>
            </div>
            <div class="rpg-bar-item">
              <div class="rpg-bar-label">
                <span class="rpg-stat-name" id="heroStatSpecialLbl">✨ UZMANLIK</span>
                <span class="rpg-stat-val" id="heroStatSpecialVal">+%20 Hız & Parry</span>
              </div>
              <div class="rpg-bar-track">
                <div class="rpg-bar-fill spc" id="heroStatSpecialBar" style="width: 82%;"></div>
              </div>
            </div>
          </div>

          <!-- Gizli / Eski Elementer Seçiciler İçin Geriye Uyumluluk Çipleri -->
          <div style="display:none;">
            <div id="heroStatHp"></div>
            <div id="heroStatSpd"></div>
          </div>

          <!-- Özel Pasif Yetenek (Hero Perk) -->
          <div class="hero-passive-card">
            <div class="hero-passive-header">
              <span class="passive-spark">⚡</span>
              <span class="hero-passive-lbl" id="heroPassiveTitle">ÖZEL PASİF: Yel Kalkanı (Parry)</span>
            </div>
            <div class="hero-passive-txt" id="heroPassiveDesc">Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hız patlaması kazanır.</div>
          </div>

          <button type="button" class="btn btn-hero-change" id="openHeroSelectBtn">
            <span>👥 TÜM KAHRAMANLARI LİSTELE</span>
            <span class="btn-arrow-glow">➔</span>
          </button>
        </div>
      </section>`;

if (html.includes(oldShowcaseSection)) {
  html = html.replace(oldShowcaseSection, newShowcaseSection);
  console.log('Replaced Hero Showcase HTML.');
} else {
  console.warn('Could not find oldShowcaseSection verbatim.');
}

// =========================================================================
// 4. STEP 2 & 3: CSS FOR 3-HERO CAROUSEL & DOSSIER CARD
// =========================================================================
console.log('Replacing Hero Showcase CSS...');

const oldShowcaseCSS = `/* 2. Hero Showcase Section (Derli Toplu, Sade ve Göz Yormayan) */
.hero-showcase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  flex: 1 1 auto;
  justify-content: center;
  margin: 4px 0;
  min-height: 0;
}

/* Main Hero Showcase Card (Live In-Game Preview) */
.hero-spotlight-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(10, 15, 29, 0.98));
  border: 1.5px solid var(--hero-accent, rgba(56, 189, 248, 0.45));
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.hero-card-left-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.main-hero-canvas {
  width: 88px;
  height: 88px;
  image-rendering: pixelated;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
  border-radius: 12px;
  background: radial-gradient(circle, var(--hero-accent-alpha, rgba(56, 189, 248, 0.12)) 0%, transparent 72%);
}
.hero-elem-indicator {
  font-size: 9px;
  font-weight: 900;
  color: var(--hero-accent, #38bdf8);
  background: var(--hero-accent-alpha, rgba(56, 189, 248, 0.16));
  border: 1px solid var(--hero-accent, #38bdf8);
  padding: 2px 7px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.hero-card-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero-name-h {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--hero-accent, #38bdf8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hero-selected-tag {
  font-size: 8.5px;
  font-weight: 900;
  color: #10b981;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.hero-card-subtitle {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  margin-top: -2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hero-card-quote {
  font-size: 9.5px;
  font-style: italic;
  color: #64748b;
  line-height: 1.2;
}

.hero-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 1px;
}
.hstat-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 3px 4px;
  text-align: center;
  font-size: 9px;
  font-weight: 800;
  color: #e2e8f0;
  white-space: nowrap;
}

.hero-passive-card {
  background: rgba(2, 6, 23, 0.7);
  border-left: 2.5px solid var(--hero-accent, #38bdf8);
  border-radius: 3px 6px 6px 3px;
  padding: 4px 7px;
  text-align: left;
}
.hero-passive-lbl {
  font-size: 9.5px;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.2px;
}
.hero-passive-txt {
  font-size: 9px;
  line-height: 1.25;
  color: #cbd5e1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-hero-change {
  width: 100%;
  margin-top: 3px;
  padding: 6px 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(14, 165, 233, 0.28));
  border: 1.5px solid var(--hero-accent, #38bdf8);
  border-radius: 9px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  touch-action: manipulation;
  transition: transform 0.12s ease, filter 0.12s ease;
}
.btn-hero-change:active {
  transform: scale(0.95);
  filter: brightness(1.2);
}
.btn-arrow-glow {
  color: var(--hero-accent, #38bdf8);
  transition: transform 0.15s ease;
}
.btn-hero-change:active .btn-arrow-glow {
  transform: translateX(4px);
}`;

const newShowcaseCSS = `/* 2. 3-Hero Carousel Stage & Dossier Card (Left/Right Silhouettes + Deep RPG Dossier) */
.hero-showcase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  flex: 1 1 auto;
  justify-content: center;
  margin: 2px 0;
  min-height: 0;
  gap: 8px;
}

/* 3-Hero Carousel Stage */
.hero-stage-carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 6px;
  padding: 4px 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y pinch-zoom;
}

.hero-stage-nav {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.88);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transition: transform 0.12s, border-color 0.2s, background 0.2s;
  z-index: 5;
  touch-action: manipulation;
}
.hero-stage-nav:active {
  transform: scale(0.88);
  background: rgba(56, 189, 248, 0.3);
  border-color: #38bdf8;
}

/* Hero Pedestals */
.hero-pedestal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease;
}

.hero-pedestal.pedestal-left,
.hero-pedestal.pedestal-right {
  opacity: 0.55;
  transform: scale(0.82);
  filter: brightness(0.42) contrast(1.1);
}
.hero-pedestal.pedestal-left:active,
.hero-pedestal.pedestal-right:active {
  transform: scale(0.88);
  opacity: 0.85;
}

.hero-pedestal.pedestal-center {
  opacity: 1;
  transform: scale(1.12);
  z-index: 4;
}

.hero-pedestal-canvas {
  width: 68px;
  height: 68px;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
}

.main-hero-canvas {
  width: 92px;
  height: 92px;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.75));
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.pedestal-disc {
  position: absolute;
  bottom: 12px;
  width: 60px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
}
.pedestal-disc.active {
  width: 80px;
  height: 20px;
  bottom: 16px;
  background: radial-gradient(ellipse at center, var(--hero-accent-alpha, rgba(56, 189, 248, 0.35)) 0%, transparent 72%);
  border: 1.5px solid var(--hero-accent, #38bdf8);
  box-shadow: 0 0 16px var(--hero-accent, rgba(56, 189, 248, 0.5));
}

.hero-stage-aura {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hero-accent-alpha, rgba(56, 189, 248, 0.22)) 0%, transparent 70%);
  pointer-events: none;
  animation: auraPulse 2.4s ease-in-out infinite alternate;
}
@keyframes auraPulse {
  0% { transform: scale(0.92); opacity: 0.6; }
  100% { transform: scale(1.15); opacity: 1.0; }
}

.pedestal-name {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #94a3b8;
  margin-top: 2px;
  text-transform: uppercase;
}

.hero-elem-indicator {
  font-size: 8.5px;
  font-weight: 900;
  color: var(--hero-accent, #38bdf8);
  background: var(--hero-accent-alpha, rgba(56, 189, 248, 0.18));
  border: 1px solid var(--hero-accent, #38bdf8);
  padding: 1.5px 8px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  margin-top: 2px;
  position: relative;
  z-index: 3;
}

/* Detailed Hero Dossier Card */
.hero-dossier-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(8, 12, 22, 0.98));
  border: 1.5px solid var(--hero-accent, rgba(56, 189, 248, 0.45));
  border-radius: 15px;
  padding: 8px 12px;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.hero-dossier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-name-h {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--hero-accent, #38bdf8);
}
.hero-role-pill {
  font-size: 8px;
  font-weight: 900;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 1.5px 6px;
  border-radius: 5px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.hero-selected-tag {
  font-size: 8px;
  font-weight: 900;
  color: #10b981;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 2px 6px;
  border-radius: 5px;
  letter-spacing: 0.3px;
}
.hero-card-subtitle {
  font-size: 9.5px;
  font-weight: 700;
  color: #94a3b8;
  margin-top: -3px;
}

/* Mythological Weapon & Quote Box */
.hero-weapon-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 3px 8px;
  gap: 8px;
}
.weapon-info-line {
  display: flex;
  align-items: center;
  gap: 5px;
}
.weapon-icon { font-size: 11px; }
.weapon-label {
  font-size: 9.5px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 0.2px;
}
.hero-quote-inline {
  font-size: 8.5px;
  font-style: italic;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

/* RPG Stat Progress Bars */
.hero-rpg-bars {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px 10px;
  margin: 1px 0;
}
.rpg-bar-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.rpg-bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8.5px;
  font-weight: 800;
}
.rpg-stat-name { color: #94a3b8; }
.rpg-stat-val { color: #f8fafc; font-variant-numeric: tabular-nums; }
.rpg-bar-track {
  width: 100%;
  height: 6px;
  background: #090d16;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.rpg-bar-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.rpg-bar-fill.hp { background: linear-gradient(90deg, #dc2626, #ef4444); box-shadow: 0 0 6px rgba(239,68,68,0.5); }
.rpg-bar-fill.spd { background: linear-gradient(90deg, #0284c7, #38bdf8); box-shadow: 0 0 6px rgba(56,189,248,0.5); }
.rpg-bar-fill.dmg { background: linear-gradient(90deg, #d97706, #f59e0b); box-shadow: 0 0 6px rgba(245,158,11,0.5); }
.rpg-bar-fill.spc { background: linear-gradient(90deg, #9333ea, #c084fc); box-shadow: 0 0 6px rgba(192,132,252,0.5); }

/* Passive Card */
.hero-passive-card {
  background: rgba(2, 6, 23, 0.7);
  border-left: 2.5px solid var(--hero-accent, #38bdf8);
  border-radius: 3px 6px 6px 3px;
  padding: 4px 8px;
  text-align: left;
}
.hero-passive-header {
  display: flex;
  align-items: center;
  gap: 4px;
}
.passive-spark { font-size: 10px; line-height: 1; }
.hero-passive-lbl {
  font-size: 9px;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.2px;
}
.hero-passive-txt {
  font-size: 8.5px;
  line-height: 1.25;
  color: #cbd5e1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 1px;
}

.btn-hero-change {
  width: 100%;
  margin-top: 2px;
  padding: 6px 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(14, 165, 233, 0.26));
  border: 1.5px solid var(--hero-accent, #38bdf8);
  border-radius: 8px;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  touch-action: manipulation;
  transition: transform 0.12s ease, filter 0.12s ease;
}
.btn-hero-change:active {
  transform: scale(0.96);
  filter: brightness(1.2);
}
.btn-arrow-glow {
  color: var(--hero-accent, #38bdf8);
  transition: transform 0.15s ease;
}
.btn-hero-change:active .btn-arrow-glow {
  transform: translateX(4px);
}`;

if (html.includes(oldShowcaseCSS)) {
  html = html.replace(oldShowcaseCSS, newShowcaseCSS);
  console.log('Replaced Hero Showcase CSS.');
} else {
  console.warn('Could not find oldShowcaseCSS verbatim.');
}

// =========================================================================
// 5. STEP 2 & 3: JAVASCRIPT HERO SILHOUETTE RENDERING & UI SYNC
// =========================================================================
console.log('Updating Hero JavaScript rendering functions...');

// Let's replace updateHeroSelectUI implementation
const oldUpdateHeroCode = `function updateHeroSelectUI() {
  const hero = getSelectedHero();

  const card = document.getElementById('heroInfoCard');
  if (card) {
    card.style.setProperty('--hero-accent', hero.color);
    card.style.setProperty('--hero-accent-alpha', hero.color + '33');
  }

  const titleEl = document.getElementById('heroCardTitle');
  if (titleEl) {
    titleEl.textContent = hero.badge + ' ' + hero.name;
    titleEl.style.color = hero.color;
  }

  const subEl = document.getElementById('heroCardSub');
  if (subEl) subEl.textContent = hero.title;

  const quoteEl = document.getElementById('heroCardQuote');
  if (quoteEl) quoteEl.textContent = hero.quote;

  const elemInd = document.getElementById('heroElemIndicator');
  if (elemInd) {
    elemInd.textContent = hero.badge + ' ' + (hero.element ? hero.element.toUpperCase() : 'TEMEL');
    elemInd.style.borderColor = hero.color;
    elemInd.style.color = hero.color;
  }

  const hpEl = document.getElementById('heroStatHp');
  if (hpEl) hpEl.textContent = '❤️ CAN: ' + hero.hp;

  const spdEl = document.getElementById('heroStatSpd');
  if (spdEl) spdEl.textContent = '⚡ HIZ: ' + hero.speed;

  const wepEl = document.getElementById('heroStatWep');
  if (wepEl) wepEl.textContent = '⚔️ ' + (hero.weapon ? hero.weapon.toUpperCase() : 'KILIÇ');

  const passTitle = document.getElementById('heroPassiveTitle');
  if (passTitle) passTitle.textContent = 'ÖZEL PASİF: ' + hero.passiveName;

  const passDesc = document.getElementById('heroPassiveDesc');
  if (passDesc) passDesc.textContent = hero.passiveDesc;

  // Render main preview canvas
  const mainCvs = document.getElementById('mainHeroPreviewCanvas');
  if (mainCvs) renderHeroThumbnail(mainCvs, hero.id);

  // If roster overlay is open, refresh selection state
  const rosterGrid = document.getElementById('heroRosterGrid');
  if (rosterGrid && rosterGrid.children.length > 0) {
    Array.from(rosterGrid.children).forEach(c => {
      const isSel = (c.dataset.hero === hero.id);
      c.classList.toggle('selected', isSel);
      const btn = c.querySelector('.hero-card-select-btn');
      if (btn) btn.textContent = isSel ? '✅ AKTİF KAHRAMAN' : 'SEÇ';
    });
  }
}`;

const newUpdateHeroCode = `function renderHeroSilhouetteThumbnail(cvs, heroId) {
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  const w = cvs.width || 76;
  const h = cvs.height || 76;
  ctx.clearRect(0, 0, w, h);

  const hero = HERO_ROSTER[heroId] || HERO_ROSTER.bamsi;
  const px = w / 2;
  const py = h / 2 + 8;
  const cy = py - 6;

  ctx.save();
  // Ambient subtle circular silhouette shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(px, py + 12, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw hero scaled with silhouette styling
  ctx.translate(px, py);
  ctx.scale(1.05, 1.05);
  ctx.translate(-px, -py);

  const dummyPlayer = {
    r: 16,
    heroId: heroId,
    hp: hero.hp,
    maxHp: hero.hp,
    speed: hero.speed,
    moving: false,
    facing: -Math.PI / 2,
    state: (typeof PLAYER_STATE !== 'undefined' ? PLAYER_STATE.IDLE : 'idle'),
    atkSlashFx: 0
  };

  const dummySkin = { hex: '#334155' };
  if (typeof drawHeroPlayer === 'function') {
    ctx.filter = 'brightness(0.38) contrast(1.1) opacity(0.7)';
    drawHeroPlayer(ctx, px, py, cy, dummyPlayer, 0, dummySkin, 0);
  }
  ctx.restore();
}

function updateHeroSelectUI() {
  const hero = getSelectedHero();
  const curIdx = HERO_CYCLE_KEYS.indexOf(selectedHeroId);
  const prevHeroKey = HERO_CYCLE_KEYS[(curIdx - 1 + HERO_CYCLE_KEYS.length) % HERO_CYCLE_KEYS.length];
  const nextHeroKey = HERO_CYCLE_KEYS[(curIdx + 1) % HERO_CYCLE_KEYS.length];
  const prevHeroObj = HERO_ROSTER[prevHeroKey] || HERO_ROSTER.bamsi;
  const nextHeroObj = HERO_ROSTER[nextHeroKey] || HERO_ROSTER.korhan;

  // 1. Update Card CSS Variables for vibrant dynamic theming
  const card = document.getElementById('heroInfoCard');
  if (card) {
    card.style.setProperty('--hero-accent', hero.color);
    card.style.setProperty('--hero-accent-alpha', hero.color + '33');
  }
  const showcase = document.getElementById('heroShowcaseSection');
  if (showcase) {
    showcase.style.setProperty('--hero-accent', hero.color);
    showcase.style.setProperty('--hero-accent-alpha', hero.color + '33');
  }

  // 2. Center Hero Details
  const titleEl = document.getElementById('heroCardTitle');
  if (titleEl) {
    titleEl.textContent = hero.badge + ' ' + hero.name;
    titleEl.style.color = hero.color;
  }

  const roleEl = document.getElementById('heroRolePill');
  if (roleEl) roleEl.textContent = hero.role || 'SAVAŞÇI';

  const subEl = document.getElementById('heroCardSub');
  if (subEl) subEl.textContent = hero.title;

  const quoteEl = document.getElementById('heroCardQuote');
  if (quoteEl) quoteEl.textContent = hero.quote;

  const elemInd = document.getElementById('heroElemIndicator');
  if (elemInd) {
    elemInd.textContent = hero.badge + ' ' + (hero.element ? hero.element.toUpperCase() : 'TEMEL');
    elemInd.style.borderColor = hero.color;
    elemInd.style.color = hero.color;
  }

  // 3. Mitolojik Silah & Stat Barları
  const wepEl = document.getElementById('heroStatWep');
  if (wepEl) wepEl.textContent = hero.weapon || 'Kılıç';

  const hpVal = document.getElementById('heroStatHpVal');
  if (hpVal) hpVal.textContent = hero.hp;
  const hpBar = document.getElementById('heroStatHpBar');
  if (hpBar) hpBar.style.width = Math.min(100, Math.round((hero.hp / 240) * 100)) + '%';

  const spdVal = document.getElementById('heroStatSpdVal');
  if (spdVal) spdVal.textContent = hero.speed.toFixed(1);
  const spdBar = document.getElementById('heroStatSpdBar');
  if (spdBar) spdBar.style.width = Math.min(100, Math.round((hero.speed / 4.2) * 100)) + '%';

  const dmgVal = document.getElementById('heroStatDmgVal');
  if (dmgVal) dmgVal.textContent = (hero.dmgMul ? hero.dmgMul.toFixed(2) + 'x' : '1.00x');
  const dmgBar = document.getElementById('heroStatDmgBar');
  if (dmgBar) dmgBar.style.width = Math.min(100, Math.round(((hero.dmgMul || 1.0) / 1.35) * 100)) + '%';

  const spcLbl = document.getElementById('heroStatSpecialLbl');
  if (spcLbl) spcLbl.textContent = hero.specialLabel || '✨ UZMANLIK';
  const spcVal = document.getElementById('heroStatSpecialVal');
  if (spcVal) spcVal.textContent = hero.specialValue || '+%15 Güç';
  const spcBar = document.getElementById('heroStatSpecialBar');
  if (spcBar) spcBar.style.width = (hero.specialPct || 80) + '%';

  // Backwards compatible elements
  const legacyHp = document.getElementById('heroStatHp');
  if (legacyHp) legacyHp.textContent = '❤️ CAN: ' + hero.hp;
  const legacySpd = document.getElementById('heroStatSpd');
  if (legacySpd) legacySpd.textContent = '⚡ HIZ: ' + hero.speed;

  // 4. Pasif Yetenek Açıklaması
  const passTitle = document.getElementById('heroPassiveTitle');
  if (passTitle) passTitle.textContent = 'ÖZEL PASİF: ' + hero.passiveName;

  const passDesc = document.getElementById('heroPassiveDesc');
  if (passDesc) passDesc.textContent = hero.passiveDesc;

  // 5. Render Center Hero (Canlı & Animasyonlu)
  const mainCvs = document.getElementById('mainHeroPreviewCanvas');
  if (mainCvs) renderHeroThumbnail(mainCvs, hero.id);

  // 6. Render Left & Right Pedestal Silhouettes
  const leftCvs = document.getElementById('heroSilhouetteLeft');
  if (leftCvs) renderHeroSilhouetteThumbnail(leftCvs, prevHeroKey);
  const leftName = document.getElementById('heroPedestalLeftName');
  if (leftName) leftName.textContent = '◀ ' + prevHeroObj.name;

  const rightCvs = document.getElementById('heroSilhouetteRight');
  if (rightCvs) renderHeroSilhouetteThumbnail(rightCvs, nextHeroKey);
  const rightName = document.getElementById('heroPedestalRightName');
  if (rightName) rightName.textContent = nextHeroObj.name + ' ▶';

  // 7. If roster overlay is open, refresh selection state
  const rosterGrid = document.getElementById('heroRosterGrid');
  if (rosterGrid && rosterGrid.children.length > 0) {
    Array.from(rosterGrid.children).forEach(c => {
      const isSel = (c.dataset.hero === hero.id);
      c.classList.toggle('selected', isSel);
      const btn = c.querySelector('.hero-card-select-btn');
      if (btn) btn.textContent = isSel ? '✅ AKTİF KAHRAMAN' : 'SEÇ';
    });
  }
}`;

if (html.includes(oldUpdateHeroCode)) {
  html = html.replace(oldUpdateHeroCode, newUpdateHeroCode);
  console.log('Replaced updateHeroSelectUI and added renderHeroSilhouetteThumbnail.');
} else {
  console.warn('Could not find oldUpdateHeroCode verbatim.');
}

// Bind Hero carousel buttons & touch swipe in initialization
const heroInitSnippet = `// Hero Carousel 3-Stage Pedestal Click & Touch Swipe Bindings
function initHeroCarouselStage() {
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const pedLeft = document.getElementById('heroPedestalLeft');
  const pedRight = document.getElementById('heroPedestalRight');
  const stage = document.getElementById('heroStageCarousel');

  if (prevBtn) bindTouchButton(prevBtn, () => prevHero());
  if (nextBtn) bindTouchButton(nextBtn, () => nextHero());
  if (pedLeft) bindTouchButton(pedLeft, () => prevHero());
  if (pedRight) bindTouchButton(pedRight, () => nextHero());

  if (stage && !stage._swipeBound) {
    stage._swipeBound = true;
    let startX = 0;
    let startY = 0;
    stage.addEventListener('touchstart', e => {
      if (e.touches && e.touches[0]) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) nextHero();
        else prevHero();
      }
    }, { passive: true });
  }
}`;

if (!html.includes('initHeroCarouselStage()')) {
  // Insert before window.onload or goMainMenu
  html = html.replace('function goMainMenu() {', `${heroInitSnippet}\n\nfunction goMainMenu() {\n  initHeroCarouselStage();`);
  console.log('Hooked initHeroCarouselStage into goMainMenu.');
}

// =========================================================================
// 6. STEP 4: SEAMLESS PROCEDURAL BIOME FLOOR (NO CHECKERBOARD/TILES)
// =========================================================================
console.log('Applying Step 4: Seamless Organic Procedural Biome Floor (256x256)...');

const oldBiomeCanvasFunction = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;

  const bk = biomeKey || 'stone';
  const pRect = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h)); };

  if (bk === 'stone') {
    // === 1. TAŞ DİYAR: Antik Tapınak Granit Döşemeleri, Rünik Cyan Tabletler & Yosunlu Harç ===
    pRect(0, 0, 128, 128, '#0f141c');

    // Büyük Megalitik Granit Karolar (Antik Mabet Zemini)
    const stones = [
      [2, 2, 60, 38], [66, 2, 60, 50],
      [2, 44, 40, 48], [46, 44, 42, 38], [92, 56, 34, 40],
      [2, 96, 54, 30], [60, 86, 66, 40]
    ];
    stones.forEach(([sx, sy, sw, sh]) => {
      pRect(sx, sy, sw, sh, '#18202c');
      pRect(sx, sy, sw, 2, '#283548');
      pRect(sx, sy, 2, sh, '#283548');
      pRect(sx, sy + sh - 2, sw, 2, '#0c1017');
      pRect(sx + sw - 2, sy, 2, sh, '#0c1017');
    });

    c.strokeStyle = '#0a0d13';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(18, 10); c.lineTo(34, 26); c.lineTo(46, 22);
    c.moveTo(76, 18); c.lineTo(88, 36); c.lineTo(112, 32);
    c.moveTo(12, 60); c.lineTo(26, 78);
    c.moveTo(68, 98); c.lineTo(86, 114); c.lineTo(104, 110);
    c.stroke();

    // Antik Cyan Rün Tabletleri
    [[24, 16], [84, 22], [22, 68], [64, 56], [88, 100]].forEach(([rx, ry], i) => {
      pRect(rx - 1, ry - 1, 8, 8, '#0f172a');
      pRect(rx, ry, 6, 6, '#0369a1');
      if (i % 2 === 0) {
        pRect(rx + 2, ry, 2, 6, '#00e5ff');
        pRect(rx, ry + 2, 6, 2, '#00e5ff');
        pRect(rx + 2, ry + 2, 2, 2, '#ffffff');
      } else {
        pRect(rx + 1, ry + 1, 4, 2, '#00e5ff');
        pRect(rx + 1, ry + 3, 2, 2, '#00e5ff');
        pRect(rx + 1, ry + 1, 1, 1, '#ffffff');
      }
    });

    // Yosunlar
    [[62, 14], [64, 40], [42, 66], [90, 72], [56, 112], [4, 42]].forEach(([mx, my]) => {
      pRect(mx, my, 4, 3, '#14532d');
      pRect(mx + 1, my + 1, 2, 2, '#22c55e');
    });

  } else if (bk === 'lava') {
    // === 2. LAV ÇUKURU: Koyu Volkanik Bazalt & Akan Akkor Parlak Magma Nehirleri ===
    pRect(0, 0, 128, 128, '#08080c');

    c.fillStyle = '#12131a';
    c.beginPath();
    c.ellipse(32, 34, 32, 24, 0.2, 0, Math.PI * 2);
    c.ellipse(96, 32, 28, 22, -0.3, 0, Math.PI * 2);
    c.ellipse(36, 96, 30, 24, -0.2, 0, Math.PI * 2);
    c.ellipse(98, 96, 32, 24, 0.3, 0, Math.PI * 2);
    c.fill();

    // AKAN AKKOR MAGMA NEHİRLERİ
    c.strokeStyle = '#7f1d1d';
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(0, 64); c.bezierCurveTo(36, 50, 88, 78, 128, 64);
    c.moveTo(64, 0); c.bezierCurveTo(50, 40, 78, 88, 64, 128);
    c.stroke();

    c.strokeStyle = '#ea580c';
    c.lineWidth = 8;
    c.beginPath();
    c.moveTo(0, 64); c.bezierCurveTo(36, 50, 88, 78, 128, 64);
    c.moveTo(64, 0); c.bezierCurveTo(50, 40, 78, 88, 64, 128);
    c.stroke();

    c.strokeStyle = '#facc15';
    c.lineWidth = 3.5;
    c.beginPath();
    c.moveTo(0, 64); c.bezierCurveTo(36, 50, 88, 78, 128, 64);
    c.moveTo(64, 0); c.bezierCurveTo(50, 40, 78, 88, 64, 128);
    c.stroke();

    c.fillStyle = '#ea580c';
    c.beginPath(); c.arc(64, 64, 12, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fef08a';
    c.beginPath(); c.arc(64, 64, 6, 0, Math.PI * 2); c.fill();

    [[24, 62], [52, 60], [78, 68], [106, 64], [62, 32], [66, 96]].forEach(([bx, by]) => {
      pRect(bx - 2, by - 2, 4, 4, '#ffedd5');
      pRect(bx - 1, by - 1, 2, 2, '#ffffff');
    });

    c.strokeStyle = '#991b1b';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(14, 20); c.lineTo(28, 32); c.lineTo(44, 28);
    c.moveTo(88, 20); c.lineTo(98, 34); c.lineTo(116, 26);
    c.moveTo(18, 88); c.lineTo(34, 102); c.lineTo(48, 92);
    c.moveTo(86, 88); c.lineTo(96, 104); c.lineTo(114, 98);
    c.stroke();

  } else if (bk === 'pink') {
    // === 3. ŞEKER DİYARI: Altın Waffle / Gofret Izgarası, Pasta Kreması & Rengarenk Sprinkles ===
    pRect(0, 0, 128, 128, '#260c1c');

    c.strokeStyle = '#4a1532';
    c.lineWidth = 3;
    for (let x = 0; x <= 128; x += 16) {
      c.beginPath();
      c.moveTo(x, 0); c.lineTo(x, 128);
      c.moveTo(0, x); c.lineTo(128, x);
      c.stroke();
    }
    for (let gx = 4; gx < 128; gx += 16) {
      for (let gy = 4; gy < 128; gy += 16) {
        pRect(gx, gy, 8, 8, '#3b122c');
        pRect(gx + 1, gy + 1, 6, 6, '#4e183a');
      }
    }

    [[32, 32], [96, 32], [32, 96], [96, 96]].forEach(([lx, ly]) => {
      c.fillStyle = '#be185d';
      c.beginPath(); c.arc(lx, ly, 11, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(lx, ly, 9, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(lx, ly, 6, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#db2777';
      c.beginPath(); c.arc(lx, ly, 3, 0, Math.PI * 2); c.fill();
    });

    const sprinkles = [
      [14, 18, 5, 2, '#38bdf8'], [48, 10, 2, 5, '#facc15'], [80, 16, 5, 2, '#4ade80'], [114, 12, 2, 5, '#f43f5e'],
      [12, 60, 2, 5, '#c084fc'], [44, 76, 5, 2, '#38bdf8'], [78, 62, 2, 5, '#facc15'], [116, 72, 5, 2, '#fb7185'],
      [16, 116, 5, 2, '#4ade80'], [52, 114, 2, 5, '#c084fc'], [82, 120, 5, 2, '#38bdf8'], [112, 110, 2, 5, '#fde047']
    ];
    sprinkles.forEach(([sx, sy, sw, sh, col]) => {
      pRect(sx, sy, sw, sh, col);
      pRect(sx, sy, 1, 1, '#ffffff');
    });

    [[64, 48], [64, 80], [16, 48], [112, 48]].forEach(([hx, hy]) => {
      pRect(hx - 2, hy, 5, 1, '#fbcfe8');
      pRect(hx, hy - 2, 1, 5, '#fbcfe8');
      pRect(hx, hy, 1, 1, '#ffffff');
    });

  } else if (bk === 'forest') {
    // === 4. SİSLİ ORMAN: Yemyeşil Çimenlik Katmanları, Odunsu Kökler & Yabani Çiçekler ===
    pRect(0, 0, 128, 128, '#061309');

    c.fillStyle = '#0a2312';
    c.beginPath();
    c.ellipse(36, 40, 40, 26, 0.2, 0, Math.PI * 2);
    c.ellipse(94, 88, 38, 28, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#11381c';
    c.beginPath();
    c.ellipse(38, 36, 26, 16, 0.2, 0, Math.PI * 2);
    c.ellipse(90, 84, 24, 18, -0.3, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#3e2723';
    c.lineWidth = 3.2;
    c.beginPath();
    c.moveTo(0, 24); c.bezierCurveTo(40, 36, 64, 12, 98, 38); c.lineTo(128, 32);
    c.moveTo(76, 0); c.bezierCurveTo(68, 48, 86, 82, 64, 128);
    c.moveTo(32, 34); c.bezierCurveTo(24, 68, 48, 98, 20, 128);
    c.stroke();
    c.strokeStyle = '#5d4037';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(0, 24); c.bezierCurveTo(40, 36, 64, 12, 98, 38); c.lineTo(128, 32);
    c.moveTo(76, 0); c.bezierCurveTo(68, 48, 86, 82, 64, 128);
    c.stroke();

    [[12, 14], [48, 16], [108, 18], [24, 72], [74, 58], [116, 68], [42, 112], [88, 114]].forEach(([tx, ty]) => {
      pRect(tx, ty, 1, 4, '#22c55e');
      pRect(tx - 1, ty + 1, 1, 3, '#16a34a');
      pRect(tx + 1, ty + 2, 1, 2, '#4ade80');
    });

    const flowers = [
      [18, 48, '#ef4444'], [86, 22, '#facc15'], [104, 52, '#38bdf8'],
      [34, 94, '#f472b6'], [62, 82, '#ffffff'], [110, 98, '#fbbf24'],
      [58, 26, '#ef4444'], [92, 78, '#a855f7'], [14, 110, '#fde047']
    ];
    flowers.forEach(([fx, fy, fcol]) => {
      pRect(fx - 1, fy, 3, 1, fcol);
      pRect(fx, fy - 1, 1, 3, fcol);
      pRect(fx, fy, 1, 1, '#fef08a');
    });

  } else if (bk === 'water') {
    // === 5. SAZLIK / SU DİYARI: Akıcı Turkuaz Lagün, Nilüfer Yaprakları (Lilypads) & Çiçekleri ===
    pRect(0, 0, 128, 128, '#031726');

    c.fillStyle = '#062c47';
    c.beginPath();
    c.ellipse(36, 40, 48, 28, 0.2, 0, Math.PI * 2);
    c.ellipse(94, 88, 46, 30, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0a4269';
    c.beginPath();
    c.ellipse(38, 36, 30, 18, 0.2, 0, Math.PI * 2);
    c.ellipse(90, 84, 28, 18, -0.3, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#0284c7';
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(0, 44); c.bezierCurveTo(36, 26, 74, 62, 128, 38);
    c.moveTo(0, 96); c.bezierCurveTo(46, 116, 84, 78, 128, 98);
    c.moveTo(48, 0); c.bezierCurveTo(32, 48, 72, 88, 44, 128);
    c.stroke();
    c.strokeStyle = '#38bdf8';
    c.lineWidth = 1.0;
    c.beginPath();
    c.moveTo(8, 42); c.lineTo(44, 34); c.lineTo(72, 54);
    c.moveTo(56, 96); c.lineTo(88, 82); c.lineTo(118, 102);
    c.stroke();

    // GERÇEK NİLÜFER YAPRAKLARI (LILYPADS - V Çentikli Yeşil Daireler)
    const lilypads = [
      [26, 26, 10], [98, 28, 11], [42, 74, 9], [104, 82, 12], [22, 108, 9], [74, 112, 10]
    ];
    lilypads.forEach(([lx, ly, lr]) => {
      c.fillStyle = '#14532d';
      c.beginPath(); c.arc(lx, ly + 1, lr, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(lx, ly, lr, 0.35, Math.PI * 2 - 0.35);
      c.lineTo(lx, ly);
      c.closePath();
      c.fill();
      c.strokeStyle = '#4ade80';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(lx, ly); c.lineTo(lx - lr * 0.7, ly - lr * 0.5);
      c.moveTo(lx, ly); c.lineTo(lx - lr * 0.7, ly + lr * 0.5);
      c.stroke();
    });

    // AÇMIŞ PEMBE NİLÜFER SU ÇİÇEKLERİ
    [[26, 26], [104, 82], [74, 112]].forEach(([fx, fy]) => {
      c.fillStyle = '#f472b6';
      c.beginPath();
      c.arc(fx, fy - 3, 3, 0, Math.PI * 2);
      c.arc(fx - 3, fy, 3, 0, Math.PI * 2);
      c.arc(fx + 3, fy, 3, 0, Math.PI * 2);
      c.arc(fx, fy + 3, 3, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(fx, fy, 2, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fde047';
      c.fillRect(fx - 0.5, fy - 0.5, 1, 1);
    });

  } else if (bk === 'ketchup') {
    // === 6. KETÇAP SALONU: Retro Diner Dama Tahtası & Yoğun Ketçap Göletleri ===
    pRect(0, 0, 128, 128, '#140608');

    const tileSize = 16;
    for (let x = 0; x < 128; x += tileSize) {
      for (let y = 0; y < 128; y += tileSize) {
        const isWhite = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        pRect(x, y, tileSize, tileSize, isWhite ? '#220a0e' : '#140608');
        pRect(x, y, tileSize, 1, isWhite ? '#330f16' : '#1a080a');
        pRect(x, y, 1, tileSize, isWhite ? '#330f16' : '#1a080a');
      }
    }

    const ketchupPuddles = [
      [36, 36, 22, 14], [96, 44, 20, 13], [44, 94, 24, 15], [102, 102, 18, 12], [64, 68, 16, 11]
    ];
    ketchupPuddles.forEach(([px, py, pw, ph]) => {
      c.fillStyle = '#7f1d1d';
      c.beginPath(); c.ellipse(px, py + 1, pw * 0.52, ph * 0.52, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#dc2626';
      c.beginPath(); c.ellipse(px, py, pw * 0.48, ph * 0.48, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f87171';
      c.beginPath(); c.ellipse(px - 2, py - 2, pw * 0.22, ph * 0.22, 0.3, 0, Math.PI * 2); c.fill();
      pRect(px - 3, py - 3, 2, 2, '#ffffff');
    });

    c.strokeStyle = '#eab308';
    c.lineWidth = 2.2;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(22, 58); c.bezierCurveTo(34, 46, 42, 68, 54, 52);
    c.moveTo(82, 88); c.bezierCurveTo(94, 76, 104, 98, 118, 84);
    c.stroke();

    [[14, 22], [58, 18], [116, 26], [18, 86], [82, 116], [120, 68]].forEach(([dx, dy]) => {
      pRect(dx - 1, dy - 1, 3, 3, '#dc2626');
      pRect(dx, dy - 1, 1, 1, '#ffffff');
    });

  } else if (bk === 'storm') {
    // === 7. FIRTINA TEPESİ: Elektrikli Lacivert Zemin & Yüksek Voltajlı Şimşek Arkları ===
    pRect(0, 0, 128, 128, '#080b18');

    c.fillStyle = '#0f172a';
    c.beginPath();
    c.ellipse(36, 42, 44, 28, 0.2, 0, Math.PI * 2);
    c.ellipse(94, 86, 42, 28, -0.3, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#312e81';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, 34); c.lineTo(28, 38); c.lineTo(48, 20); c.lineTo(82, 42); c.lineTo(108, 28); c.lineTo(128, 34);
    c.moveTo(64, 0); c.lineTo(56, 42); c.lineTo(78, 76); c.lineTo(52, 104); c.lineTo(60, 128);
    c.moveTo(28, 38); c.lineTo(16, 76); c.lineTo(36, 116);
    c.stroke();

    c.strokeStyle = '#00e5ff';
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(0, 34); c.lineTo(28, 38); c.lineTo(48, 20); c.lineTo(82, 42); c.lineTo(108, 28); c.lineTo(128, 34);
    c.moveTo(64, 0); c.lineTo(56, 42); c.lineTo(78, 76); c.lineTo(52, 104); c.lineTo(60, 128);
    c.moveTo(28, 38); c.lineTo(16, 76); c.lineTo(36, 116);
    c.stroke();

    c.strokeStyle = '#ffffff';
    c.lineWidth = 1.0;
    c.beginPath();
    c.moveTo(0, 34); c.lineTo(28, 38); c.lineTo(48, 20); c.lineTo(82, 42); c.lineTo(108, 28); c.lineTo(128, 34);
    c.moveTo(64, 0); c.lineTo(56, 42); c.lineTo(78, 76); c.lineTo(52, 104); c.lineTo(60, 128);
    c.moveTo(28, 38); c.lineTo(16, 76); c.lineTo(36, 116);
    c.stroke();

    [[28, 38], [82, 42], [78, 76], [108, 28], [52, 104], [36, 116]].forEach(([zx, zy]) => {
      pRect(zx - 2, zy - 2, 5, 5, '#fde047');
      pRect(zx - 1, zy - 1, 3, 3, '#ffffff');
    });

  } else if (bk === 'ice') {
    // === 8. BUZ GEÇİDİ: Donmuş Saydam Buzul Blokları, Kar Taneleri & Glasiyel Çatlaklar ===
    pRect(0, 0, 128, 128, '#041322');

    c.fillStyle = '#08233d';
    c.beginPath();
    c.ellipse(36, 44, 46, 28, 0.3, 0, Math.PI * 2);
    c.ellipse(96, 88, 44, 30, -0.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0c355c';
    c.beginPath();
    c.ellipse(40, 40, 30, 18, 0.3, 0, Math.PI * 2);
    c.ellipse(92, 84, 28, 18, -0.2, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#0284c7';
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(0, 46); c.lineTo(36, 40); c.lineTo(64, 58); c.lineTo(96, 44); c.lineTo(128, 50);
    c.moveTo(56, 0); c.lineTo(60, 44); c.lineTo(46, 84); c.lineTo(64, 128);
    c.moveTo(36, 40); c.lineTo(24, 78); c.lineTo(42, 114);
    c.stroke();
    c.strokeStyle = '#7dd3fc';
    c.lineWidth = 1.0;
    c.beginPath();
    c.moveTo(0, 46); c.lineTo(36, 40); c.lineTo(64, 58); c.lineTo(96, 44); c.lineTo(128, 50);
    c.moveTo(56, 0); c.lineTo(60, 44); c.lineTo(46, 84); c.lineTo(64, 128);
    c.stroke();

    [[24, 20], [92, 22], [42, 74], [104, 78], [20, 108], [80, 112]].forEach(([kx, ky]) => {
      pRect(kx - 3, ky, 7, 1, '#e0f2fe');
      pRect(kx, ky - 3, 1, 7, '#e0f2fe');
      pRect(kx - 2, ky - 2, 5, 5, '#bae6fd');
      pRect(kx - 1, ky - 1, 3, 3, '#ffffff');
    });

  } else if (bk === 'sand') {
    // === 9. KUM OVASI: Rüzgarla Dalgalanan Çöl Kumulları & Antik Mısır Hiyeroglifleri ===
    pRect(0, 0, 128, 128, '#1c1208');

    c.fillStyle = '#2d1e0d';
    c.beginPath();
    c.moveTo(0, 36); c.bezierCurveTo(44, 24, 76, 52, 128, 32);
    c.lineTo(128, 72); c.bezierCurveTo(80, 88, 38, 64, 0, 78);
    c.closePath();
    c.fill();
    c.fillStyle = '#3e2a14';
    c.beginPath();
    c.moveTo(0, 84); c.bezierCurveTo(46, 72, 84, 102, 128, 86);
    c.lineTo(128, 128); c.lineTo(0, 128);
    c.closePath();
    c.fill();

    c.strokeStyle = '#d97706';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(0, 36); c.bezierCurveTo(44, 24, 76, 52, 128, 32);
    c.moveTo(0, 84); c.bezierCurveTo(46, 72, 84, 102, 128, 86);
    c.stroke();

    [[24, 18], [88, 48], [42, 82], [108, 106]].forEach(([hx, hy]) => {
      pRect(hx - 2, hy - 2, 12, 10, '#451a03');
      pRect(hx - 1, hy - 1, 10, 8, '#78350f');
      pRect(hx + 3, hy, 2, 6, '#facc15');
      pRect(hx + 1, hy + 2, 6, 2, '#facc15');
      pRect(hx + 2, hy - 1, 4, 2, '#fde047');
      pRect(hx + 3, hy, 2, 1, '#ffffff');
    });

  } else {
    // === 10. GECE HARABESİ: Gotik Mezarlık Mor Mermeri & Kan Kırmızı Rünler ===
    pRect(0, 0, 128, 128, '#0a0414');

    const mTiles = [
      [2, 2, 60, 40], [66, 2, 60, 48],
      [2, 46, 44, 46], [50, 46, 40, 36], [94, 54, 32, 40],
      [2, 96, 56, 30], [62, 86, 64, 40]
    ];
    mTiles.forEach(([mx, my, mw, mh]) => {
      pRect(mx, my, mw, mh, '#170a2a');
      pRect(mx, my, mw, 2, '#281245');
      pRect(mx, my, 2, mh, '#281245');
      pRect(mx, my + mh - 2, mw, 2, '#080310');
      pRect(mx + mw - 2, my, 2, mh, '#080310');
    });

    c.strokeStyle = '#05010a';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(16, 12); c.lineTo(32, 28); c.lineTo(44, 22);
    c.moveTo(76, 16); c.lineTo(92, 34);
    c.moveTo(14, 62); c.lineTo(28, 82);
    c.moveTo(72, 96); c.lineTo(90, 114);
    c.stroke();

    [[24, 18], [86, 24], [22, 68], [64, 60], [92, 102]].forEach(([px, py]) => {
      pRect(px - 1, py - 1, 8, 8, '#2a0606');
      pRect(px, py, 6, 6, '#7f1d1d');
      pRect(px + 2, py, 2, 6, '#dc2626');
      pRect(px, py + 2, 6, 2, '#dc2626');
      pRect(px + 1, py + 1, 1, 1, '#f87171');
      pRect(px + 4, py + 1, 1, 1, '#f87171');
      pRect(px + 1, py + 4, 1, 1, '#f87171');
      pRect(px + 4, py + 4, 1, 1, '#f87171');
      pRect(px + 2, py + 2, 2, 2, '#ffffff');
    });
  }

  return cv;
}`;

const newBiomeCanvasFunction = `function createBiomeFloorCanvas(biomeKey, visualMode) {
  // 256x256 Seamless Organic Procedural Terrain Engine - NO CHECKERBOARDS, NO HARD TILES
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 256;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = true;

  const bk = biomeKey || 'stone';
  const pRect = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h)); };

  if (bk === 'sand') {
    // === 1. KESİNTİSİZ ÇÖL KUMULLARI (SEAMLESS ORGANIC DUNES & GOLDEN SANDS) ===
    // Deep warm desert sands with sweeping continuous wind dunes - ZERO SQUARE TILES
    pRect(0, 0, 256, 256, '#180f06');

    // Smooth organic sweeping dune waves
    c.fillStyle = '#221509';
    c.beginPath();
    c.moveTo(0, 48); c.bezierCurveTo(80, 20, 160, 78, 256, 44);
    c.lineTo(256, 134); c.bezierCurveTo(180, 160, 90, 110, 0, 138);
    c.closePath(); c.fill();

    c.fillStyle = '#2d1c0c';
    c.beginPath();
    c.moveTo(0, 138); c.bezierCurveTo(90, 110, 180, 160, 256, 134);
    c.lineTo(256, 218); c.bezierCurveTo(170, 240, 80, 190, 0, 224);
    c.closePath(); c.fill();

    c.fillStyle = '#36220f';
    c.beginPath();
    c.moveTo(0, 224); c.bezierCurveTo(80, 190, 170, 240, 256, 218);
    c.lineTo(256, 256); c.lineTo(0, 256);
    c.closePath(); c.fill();

    // Wind ripples across the dunes (sinuous desert drift lines)
    c.strokeStyle = '#b45309';
    c.lineWidth = 1.2;
    c.globalAlpha = 0.45;
    for (let y = 16; y < 256; y += 28) {
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(64, y - 10, 128, y + 12, 192, y - 8);
      c.bezierCurveTo(220, y - 14, 240, y + 4, 256, y);
      c.stroke();
    }
    c.globalAlpha = 1.0;

    // Glowing ancient Tamga symbols buried in sand
    [[48, 54], [182, 86], [96, 170], [214, 210]].forEach(([rx, ry], i) => {
      c.fillStyle = '#451a03';
      c.beginPath(); c.arc(rx, ry, 10, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#d97706';
      c.lineWidth = 1.5;
      c.beginPath(); c.arc(rx, ry, 9, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#facc15';
      c.fillRect(rx - 1, ry - 4, 2, 8);
      c.fillRect(rx - 4, ry - 1, 8, 2);
    });

  } else if (bk === 'ice') {
    // === 2. KESİNTİSİZ KUTUP BUZULU (SEAMLESS POLAR PERMAFROST & GLACIAL CREVASSES) ===
    // Pure frozen tundra with translucent glacial fissures and frost stars - ZERO TILES
    pRect(0, 0, 256, 256, '#030d18');

    // Smooth organic permafrost fields
    c.fillStyle = '#06172a';
    c.beginPath();
    c.ellipse(72, 78, 88, 54, 0.25, 0, Math.PI * 2);
    c.ellipse(190, 176, 92, 58, -0.3, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#0a233d';
    c.beginPath();
    c.ellipse(78, 72, 58, 36, 0.25, 0, Math.PI * 2);
    c.ellipse(184, 170, 60, 38, -0.3, 0, Math.PI * 2);
    c.fill();

    // Glacial crystalline fissures branching across the ice
    c.strokeStyle = '#0284c7';
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(0, 92); c.lineTo(64, 82); c.lineTo(128, 120); c.lineTo(192, 90); c.lineTo(256, 104);
    c.moveTo(112, 0); c.lineTo(120, 88); c.lineTo(92, 168); c.lineTo(128, 256);
    c.moveTo(64, 82); c.lineTo(48, 160); c.lineTo(84, 230);
    c.stroke();

    c.strokeStyle = '#7dd3fc';
    c.lineWidth = 1.0;
    c.beginPath();
    c.moveTo(0, 92); c.lineTo(64, 82); c.lineTo(128, 120); c.lineTo(192, 90); c.lineTo(256, 104);
    c.moveTo(112, 0); c.lineTo(120, 88); c.lineTo(92, 168); c.lineTo(128, 256);
    c.stroke();

    // Luminous ice crystals / snow crystals
    [[48, 40], [184, 44], [84, 148], [208, 156], [40, 216], [160, 224]].forEach(([kx, ky]) => {
      c.fillStyle = 'rgba(224, 242, 254, 0.7)';
      c.fillRect(kx - 4, ky, 9, 1);
      c.fillRect(kx, ky - 4, 1, 9);
      c.fillStyle = '#ffffff';
      c.fillRect(kx - 1, ky - 1, 3, 3);
    });

  } else if (bk === 'lava') {
    // === 3. KESİNTİSİZ VOLKANİK BAZALT & AKKOR LAV DAMARLARI (SEAMLESS BASALT BEDROCK) ===
    pRect(0, 0, 256, 256, '#08080c');

    c.fillStyle = '#111218';
    c.beginPath();
    c.ellipse(64, 68, 64, 48, 0.2, 0, Math.PI * 2);
    c.ellipse(192, 64, 58, 44, -0.3, 0, Math.PI * 2);
    c.ellipse(72, 192, 60, 48, -0.2, 0, Math.PI * 2);
    c.ellipse(196, 192, 64, 48, 0.3, 0, Math.PI * 2);
    c.fill();

    // Flowing interconnected glowing magma rivers
    c.strokeStyle = '#7f1d1d';
    c.lineWidth = 18;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    c.strokeStyle = '#ea580c';
    c.lineWidth = 10;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    c.strokeStyle = '#facc15';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(0, 128); c.bezierCurveTo(72, 100, 176, 156, 256, 128);
    c.moveTo(128, 0); c.bezierCurveTo(100, 80, 156, 176, 128, 256);
    c.stroke();

    // Molten magma core caldera at crossroads
    c.fillStyle = '#ea580c';
    c.beginPath(); c.arc(128, 128, 20, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fef08a';
    c.beginPath(); c.arc(128, 128, 10, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(128, 128, 4, 0, Math.PI * 2); c.fill();

    // Magma vents & fiery embers
    [[48, 124], [104, 120], [156, 136], [212, 128], [124, 64], [132, 192]].forEach(([bx, by]) => {
      c.fillStyle = '#ffedd5';
      c.fillRect(bx - 3, by - 3, 6, 6);
      c.fillStyle = '#ffffff';
      c.fillRect(bx - 1, by - 1, 3, 3);
    });

  } else if (bk === 'forest') {
    // === 4. KESİNTİSİZ SİSLİ ORMAN (SEAMLESS LUSH EARTH & CANOPY MOSS) ===
    pRect(0, 0, 256, 256, '#051108');

    c.fillStyle = '#081e0f';
    c.beginPath();
    c.ellipse(72, 80, 80, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 176, 76, 56, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0e2e18';
    c.beginPath();
    c.ellipse(76, 72, 52, 32, 0.2, 0, Math.PI * 2);
    c.ellipse(180, 168, 48, 36, -0.3, 0, Math.PI * 2);
    c.fill();

    // Natural roots winding across the earth
    c.strokeStyle = '#3e2723';
    c.lineWidth = 3.6;
    c.beginPath();
    c.moveTo(0, 48); c.bezierCurveTo(80, 72, 128, 24, 196, 76); c.lineTo(256, 64);
    c.moveTo(152, 0); c.bezierCurveTo(136, 96, 172, 164, 128, 256);
    c.stroke();
    c.strokeStyle = '#5d4037';
    c.lineWidth = 1.6;
    c.stroke();

    // Moss clusters & forest floor flora
    [[24, 28], [96, 32], [216, 36], [48, 144], [148, 116], [232, 136], [84, 224], [176, 228]].forEach(([tx, ty]) => {
      c.fillStyle = '#16a34a';
      c.fillRect(tx, ty, 3, 6);
      c.fillStyle = '#22c55e';
      c.fillRect(tx - 1, ty + 1, 2, 4);
      c.fillStyle = '#4ade80';
      c.fillRect(tx + 2, ty + 2, 2, 3);
    });

    // Wildflower dots
    [[36, 96, '#ef4444'], [172, 44, '#facc15'], [208, 104, '#38bdf8'], [68, 188, '#f472b6'], [124, 164, '#ffffff'], [220, 196, '#fbbf24']].forEach(([fx, fy, fcol]) => {
      c.fillStyle = fcol;
      c.beginPath(); c.arc(fx, fy, 2.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fef08a';
      c.fillRect(fx - 0.5, fy - 0.5, 1, 1);
    });

  } else if (bk === 'water') {
    // === 5. KESİNTİSİZ TURKUAZ LAGÜN & NİLÜFERLER (SEAMLESS AQUATIC BASIN) ===
    pRect(0, 0, 256, 256, '#021320');

    c.fillStyle = '#05243b';
    c.beginPath();
    c.ellipse(72, 80, 96, 56, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 176, 92, 60, -0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#08375c';
    c.beginPath();
    c.ellipse(76, 72, 60, 36, 0.2, 0, Math.PI * 2);
    c.ellipse(180, 168, 56, 36, -0.3, 0, Math.PI * 2);
    c.fill();

    // Gentle aquatic water ripples
    c.strokeStyle = '#0284c7';
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(0, 88); c.bezierCurveTo(72, 52, 148, 124, 256, 76);
    c.moveTo(0, 192); c.bezierCurveTo(92, 232, 168, 156, 256, 196);
    c.moveTo(96, 0); c.bezierCurveTo(64, 96, 144, 176, 88, 256);
    c.stroke();

    // Organic Lilypads & Lotus Flowers
    [[52, 52, 14], [196, 56, 15], [84, 148, 13], [208, 164, 16], [44, 216, 12], [148, 224, 14]].forEach(([lx, ly, lr]) => {
      c.fillStyle = '#14532d';
      c.beginPath(); c.arc(lx, ly + 1, lr, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(lx, ly, lr, 0.35, Math.PI * 2 - 0.35);
      c.lineTo(lx, ly);
      c.closePath();
      c.fill();
    });
    // Blooming lotus blooms
    [[52, 52], [208, 164], [148, 224]].forEach(([fx, fy]) => {
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(fx, fy, 4, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(fx, fy, 2, 0, Math.PI * 2); c.fill();
    });

  } else if (bk === 'pink') {
    // === 6. KESİNTİSİZ ŞEKER DİYARI (SMOOTH CANDY VELVET - NO WAFFLE GRID) ===
    // Beautiful continuous confectionary bedrock with sweet swirls and sprinkles - ZERO GRID LINES
    pRect(0, 0, 256, 256, '#200817');

    c.fillStyle = '#2c0c20';
    c.beginPath();
    c.ellipse(72, 72, 88, 56, 0.25, 0, Math.PI * 2);
    c.ellipse(184, 184, 92, 60, -0.3, 0, Math.PI * 2);
    c.fill();

    // Smooth flowing sugar glaze swirls
    c.strokeStyle = '#4a1532';
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(0, 80); c.bezierCurveTo(70, 50, 140, 110, 256, 80);
    c.moveTo(0, 180); c.bezierCurveTo(80, 220, 160, 150, 256, 190);
    c.stroke();
    c.strokeStyle = '#701a4e';
    c.lineWidth = 6;
    c.stroke();

    // Giant sugar glaze rosettes
    [[64, 64], [192, 64], [64, 192], [192, 192]].forEach(([lx, ly]) => {
      c.fillStyle = '#be185d';
      c.beginPath(); c.arc(lx, ly, 14, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f472b6';
      c.beginPath(); c.arc(lx, ly, 10, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(lx, ly, 6, 0, Math.PI * 2); c.fill();
    });

    // Candied sprinkles scattered naturally
    [[28, 36, '#38bdf8'], [96, 20, '#facc15'], [160, 32, '#4ade80'], [228, 24, '#f43f5e'],
     [24, 120, '#c084fc'], [88, 152, '#38bdf8'], [156, 124, '#facc15'], [232, 144, '#fb7185'],
     [32, 232, '#4ade80'], [104, 228, '#c084fc'], [164, 240, '#38bdf8'], [224, 220, '#fde047']].forEach(([sx, sy, col]) => {
      c.fillStyle = col;
      c.fillRect(sx, sy, 5, 2);
      c.fillStyle = '#ffffff';
      c.fillRect(sx, sy, 1, 1);
    });

  } else if (bk === 'ketchup') {
    // === 7. KESİNTİSİZ KETÇAP VADİSİ (DARK MARBLE & SAUCE DRIZZLE - NO CHECKERBOARD TILES) ===
    // Continuous rich dark burgundy bedrock with organic sauce pools - ZERO SQUARES
    pRect(0, 0, 256, 256, '#120406');

    c.fillStyle = '#1c070a';
    c.beginPath();
    c.ellipse(72, 72, 84, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(184, 184, 88, 56, -0.2, 0, Math.PI * 2);
    c.fill();

    // Organic ketchup lakes
    [[72, 72, 36, 22], [192, 88, 32, 20], [88, 188, 38, 24], [204, 204, 30, 18], [128, 136, 28, 18]].forEach(([px, py, pw, ph]) => {
      c.fillStyle = '#7f1d1d';
      c.beginPath(); c.ellipse(px, py + 2, pw * 0.52, ph * 0.52, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#dc2626';
      c.beginPath(); c.ellipse(px, py, pw * 0.48, ph * 0.48, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f87171';
      c.beginPath(); c.ellipse(px - 3, py - 3, pw * 0.22, ph * 0.22, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.fillRect(px - 4, py - 4, 3, 3);
    });

    // Golden mustard ribbons
    c.strokeStyle = '#eab308';
    c.lineWidth = 2.8;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(44, 116); c.bezierCurveTo(68, 92, 84, 136, 108, 104);
    c.moveTo(164, 176); c.bezierCurveTo(188, 152, 208, 196, 236, 168);
    c.stroke();

  } else if (bk === 'storm') {
    // === 8. KESİNTİSİZ FIRTINA TEPESİ (SEAMLESS HIGH-VOLTAGE BEDROCK) ===
    pRect(0, 0, 256, 256, '#060814');

    c.fillStyle = '#0c1024';
    c.beginPath();
    c.ellipse(72, 84, 88, 56, 0.2, 0, Math.PI * 2);
    c.ellipse(188, 172, 84, 56, -0.3, 0, Math.PI * 2);
    c.fill();

    // Branching high-voltage lightning cracks
    c.strokeStyle = '#312e81';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(0, 68); c.lineTo(56, 76); c.lineTo(96, 40); c.lineTo(164, 84); c.lineTo(216, 56); c.lineTo(256, 68);
    c.moveTo(128, 0); c.lineTo(112, 84); c.lineTo(156, 152); c.lineTo(104, 208); c.lineTo(120, 256);
    c.stroke();

    c.strokeStyle = '#00e5ff';
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(0, 68); c.lineTo(56, 76); c.lineTo(96, 40); c.lineTo(164, 84); c.lineTo(216, 56); c.lineTo(256, 68);
    c.moveTo(128, 0); c.lineTo(112, 84); c.lineTo(156, 152); c.lineTo(104, 208); c.lineTo(120, 256);
    c.stroke();

    c.strokeStyle = '#ffffff';
    c.lineWidth = 1.0;
    c.stroke();

    // Voltage arc sparks
    [[56, 76], [164, 84], [156, 152], [216, 56], [104, 208]].forEach(([zx, zy]) => {
      c.fillStyle = '#fde047';
      c.fillRect(zx - 3, zy - 3, 7, 7);
      c.fillStyle = '#ffffff';
      c.fillRect(zx - 1, zy - 1, 3, 3);
    });

  } else {
    // === 9. KESİNTİSİZ TAŞ / GECE DİYARI (ANCIENT GRANITE & RUNIC BEDROCK - ZERO TILES) ===
    pRect(0, 0, 256, 256, '#090d14');

    c.fillStyle = '#111822';
    c.beginPath();
    c.ellipse(72, 76, 84, 52, 0.2, 0, Math.PI * 2);
    c.ellipse(184, 180, 88, 56, -0.2, 0, Math.PI * 2);
    c.fill();

    // Organic stone weathering cracks
    c.strokeStyle = '#1e293b';
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(36, 20); c.lineTo(68, 52); c.lineTo(92, 44);
    c.moveTo(152, 36); c.lineTo(176, 72); c.lineTo(224, 64);
    c.moveTo(24, 120); c.lineTo(52, 156);
    c.moveTo(136, 196); c.lineTo(172, 228); c.lineTo(208, 220);
    c.stroke();

    // Ancient Cyan Turkish Runic Tamgas embedded in bedrock
    [[48, 32], [168, 44], [44, 136], [128, 112], [176, 200]].forEach(([rx, ry], i) => {
      c.fillStyle = '#0f172a';
      c.beginPath(); c.arc(rx, ry, 11, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#0284c7';
      c.lineWidth = 1.4;
      c.beginPath(); c.arc(rx, ry, 10, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#00e5ff';
      c.fillRect(rx - 1, ry - 6, 2, 12);
      c.fillRect(rx - 6, ry - 1, 12, 2);
      c.fillStyle = '#ffffff';
      c.fillRect(rx - 2, ry - 2, 4, 4);
    });

    // Subtle ancient moss tufts
    [[124, 28], [128, 80], [84, 132], [180, 144], [112, 224]].forEach(([mx, my]) => {
      c.fillStyle = '#14532d';
      c.fillRect(mx, my, 5, 4);
      c.fillStyle = '#22c55e';
      c.fillRect(mx + 1, my + 1, 3, 2);
    });
  }

  return cv;
}`;

if (html.includes(oldBiomeCanvasFunction)) {
  html = html.replace(oldBiomeCanvasFunction, newBiomeCanvasFunction);
  console.log('Replaced createBiomeFloorCanvas with 256x256 seamless organic procedural terrain.');
} else {
  console.warn('Could not find oldBiomeCanvasFunction verbatim.');
}

// =========================================================================
// 7. STEP 6 & 8: BOSS HIT-STOP STUTTER FIX & ENHANCED HIT FEEDBACK
// =========================================================================
console.log('Applying Step 6 & 8: Hitstop throttling and boss impact flash...');

// Throttle triggerHitStop from 110ms to 220ms, cap duration at 66ms
const oldTriggerHitStop = `function triggerHitStop(val) {
  const now = performance.now();
  if (now - lastHitStopAt < 110) return; // 110ms throttle prevents constant micro-freezes while allowing responsive impacts
  lastHitStopAt = now;
  let dur = 32;
  if (typeof val === 'number') {
    if (val <= 12) {
      dur = Math.round(val * 16.67);
    } else {
      dur = val;
    }
  }
  dur = Math.min(180, Math.max(16, dur));
  hitStopUntil = now + dur;
  hitStopFrames = Math.ceil(dur / 16.67);
}`;

const newTriggerHitStop = `function triggerHitStop(val) {
  const now = performance.now();
  if (now - lastHitStopAt < 220) return; // 220ms throttle prevents boss combat stutter and keeps 60/120 FPS buttery smooth
  lastHitStopAt = now;
  let dur = 24;
  if (typeof val === 'number') {
    if (val <= 12) {
      dur = Math.round(val * 16.67);
    } else {
      dur = val;
    }
  }
  dur = Math.min(66, Math.max(16, dur)); // Capped at 4 frames max
  hitStopUntil = now + dur;
  hitStopFrames = Math.ceil(dur / 16.67);
}`;

if (html.includes(oldTriggerHitStop)) {
  html = html.replace(oldTriggerHitStop, newTriggerHitStop);
  console.log('Replaced triggerHitStop with 220ms throttle.');
} else {
  console.warn('Could not find oldTriggerHitStop verbatim.');
}

// In onPlayerHitEnemy:
// triggerHitStop(crit && isBoss ? 55 : crit ? 40 : 32); -> crisp 4 frames
html = html.replace(
  `triggerHitStop(crit && isBoss ? 55 : crit ? 40 : 32);`,
  `triggerHitStop(crit && isBoss ? 4 : crit ? 3 : 2);`
);
html = html.replace(
  `triggerHitStop(22);`,
  `triggerHitStop(2);`
);
// Remove duplicate triggerHitStop(3) on line 6208
html = html.replace(
  `  if (crit) {\n    triggerHitStop(3); // 3 frames micro-freeze on critical hit\n    vibrate([25, 30, 25]);`,
  `  if (crit) {\n    vibrate([25, 30, 25]);`
);

// In takeDamage:
html = html.replace(
  `    if (en.type === 'boss' && isCrit) {\n      triggerHitStop(6);\n    }`,
  `    if (en.type === 'boss' && isCrit) {\n      triggerHitStop(4);\n    }`
);

// High-contrast boss hit flash in takeDamage:
html = html.replace(
  `  const isCrit = opt.crit || (dealt > raw * 1.25);\n  en.flashT = isCrit ? 6 : 4;`,
  `  const isCrit = opt.crit || (dealt > raw * 1.25);\n  en.flashT = (en.type === 'boss') ? (isCrit ? 9 : 6) : (isCrit ? 6 : 4);`
);

// High-contrast flash in drawEnemy
html = html.replace(
  `      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';`,
  `      ctx.fillStyle = (en.type === 'boss') ? (en.flashT % 2 === 0 ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 215, 64, 0.85)') : 'rgba(255, 255, 255, 0.65)';`
);

// In spawnWave: boss hit stop
html = html.replace(
  `triggerHitStop(45);`,
  `triggerHitStop(4);`
);

// =========================================================================
// 8. STEP 7: SLEEK TOP GOLD UNVAN BANNER (REPLACE 3S CENTER BLACKOUT)
// =========================================================================
console.log('Applying Step 7: Sleek top Gold Unvan Banner for Boss Arrival...');

// Shorten bossSplash duration to 70 frames (1.1s)
html = html.replace(
  `      t: 180,\n      maxT: 180`,
  `      t: 70,\n      maxT: 70`
);

// Replace bossSplash render: Remove giant black letterbox bars that cover combat,
// and position the card at the top as an elegant Altın Unvan Bandı!
const oldBossSplashRender = `    // 1. Cinematic Letterbox Bars (Top & Bottom)
    const barH = Math.round(H * 0.082 * Math.min(1, (1 - prog) * 5));
    if (barH > 0) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(4, 6, 12, 0.94)';
      ctx.fillRect(0, 0, W, barH);
      ctx.fillRect(0, H - barH, W, barH);
      ctx.fillStyle = themeCol;
      ctx.shadowColor = themeCol;
      ctx.shadowBlur = 0; /* 60fps */
      ctx.fillRect(0, barH - 2, W, 2);
      ctx.fillRect(0, H - barH, W, 2);
      ctx.restore();
    }`;

const newBossSplashRender = `    // 1. Sleek Non-Obstructing Top Gold Unvan Accent (Arena remains 100% visible)
    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = themeCol;
    ctx.fillRect(0, 0, W, 3);
    ctx.restore();`;

if (html.includes(oldBossSplashRender)) {
  html = html.replace(oldBossSplashRender, newBossSplashRender);
  console.log('Replaced letterbox blackout with sleek top accent.');
} else {
  console.warn('Could not find oldBossSplashRender verbatim.');
}

// Now replace center card coordinates and layout to be at the top under HUD
const oldCardPosition = `    ctx.save();
    ctx.translate(W / 2, H * 0.38);
    ctx.scale(cardScale, cardScale);
    ctx.globalAlpha = alpha;

    const cardW = Math.min(W * 0.92, 390);
    const cardH = 94;
    const halfW = cardW / 2;
    const halfH = cardH / 2;

    // Dark obsidian glass backdrop
    ctx.fillStyle = 'rgba(6, 8, 16, 0.94)';
    ctx.strokeStyle = themeCol;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = themeCol;
    ctx.shadowBlur = 0; /* 60fps */

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, cardW, cardH, 14);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(-halfW, -halfH, cardW, cardH);
      ctx.strokeRect(-halfW, -halfH, cardW, cardH);
    }

    // Corner bracket tech-borders
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const bLen = 14;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -halfH + 4 + bLen);
    ctx.lineTo(-halfW + 4, -halfH + 4);
    ctx.lineTo(-halfW + 4 + bLen, -halfH + 4);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(halfW - 4 - bLen, -halfH + 4);
    ctx.lineTo(halfW - 4, -halfH + 4);
    ctx.lineTo(halfW - 4, -halfH + 4 + bLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, halfH - 4 - bLen);
    ctx.lineTo(-halfW + 4, halfH - 4);
    ctx.lineTo(-halfW + 4 + bLen, halfH - 4);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(halfW - 4 - bLen, halfH - 4);
    ctx.lineTo(halfW - 4, halfH - 4);
    ctx.lineTo(halfW - 4, halfH - 4 - bLen);
    ctx.stroke();

    // Top Warning Badge
    ctx.fillStyle = '#ff1744';
    ctx.font = '900 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠ BÖLGE TEHLİKESİ: KADİM DİYAR HÜKÜMDARI ⚠', 0, -22);

    // Giant Boss Name
    ctx.fillStyle = themeCol;
    ctx.font = '900 22px monospace';
    ctx.shadowColor = themeCol;
    ctx.shadowBlur = 0; /* 60fps */
    ctx.fillText(bossSplash.title.toUpperCase(), 0, 7);

    // Subtitle & Phase Description
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eceff1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('❖ ' + bossSplash.subtitle + (bossSplash.phaseTitle ? (' • ' + bossSplash.phaseTitle) : '') + ' ❖', 0, 29);
    // Dynamic Lore Dialogue line
    if (bossSplash.dialogue) {
      ctx.font = 'italic bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('“' + bossSplash.dialogue + '”', 0, 48);
    }

    ctx.restore();`;

const newCardPosition = `    // Sleek Top Altın Unvan Bandı (Top Under HUD, Non-intrusive, Gorgeous)
    ctx.save();
    const bannerY = Math.max(54, H * 0.13);
    ctx.translate(W / 2, bannerY);
    ctx.scale(cardScale, cardScale);
    ctx.globalAlpha = alpha;

    const cardW = Math.min(W * 0.90, 360);
    const cardH = 58;
    const halfW = cardW / 2;
    const halfH = cardH / 2;

    // Dark obsidian glass backdrop with gold trim
    ctx.fillStyle = 'rgba(6, 8, 16, 0.92)';
    ctx.strokeStyle = themeCol;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = themeCol;
    ctx.shadowBlur = 0;

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(-halfW, -halfH, cardW, cardH);
      ctx.strokeRect(-halfW, -halfH, cardW, cardH);
    }

    // Top Warning Badge
    ctx.fillStyle = '#ff3d00';
    ctx.font = '900 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠ KADİM DİYAR HÜKÜMDARI BELİRDİ ⚠', 0, -14);

    // Boss Name
    ctx.fillStyle = themeCol;
    ctx.font = '900 17px monospace';
    ctx.fillText(bossSplash.title.toUpperCase(), 0, 3);

    // Subtitle & Lore
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px monospace';
    const subTxt = '❖ ' + bossSplash.subtitle + (bossSplash.phaseTitle ? (' • ' + bossSplash.phaseTitle) : '') + ' ❖';
    ctx.fillText(subTxt, 0, 18);

    ctx.restore();`;

if (html.includes(oldCardPosition)) {
  html = html.replace(oldCardPosition, newCardPosition);
  console.log('Replaced boss center splash card with sleek top Unvan banner.');
} else {
  console.warn('Could not find oldCardPosition verbatim.');
}

console.log('Writing updated index.html...');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! All 11 steps applied to index.html.');
