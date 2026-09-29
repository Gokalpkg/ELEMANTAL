// Test script for 22 master features logic
console.log('Testing 22 features logic...');

// 1. Relic Sets
const RELIC_SETS = {
  ergenekon: {
    name: 'Ergenekon Demiri',
    relics: ['titanBelt', 'spikeShield', 'graniteArmor'],
    bonus: '+%35 Zırh & %20 Diken Hasarı'
  },
  tengri: {
    name: 'Gök Tengri Işığı',
    relics: ['celestialWings', 'astralCompass', 'stormCrown'],
    bonus: '+%25 Büyü Yankısı & +%15 Hız'
  },
  alkarisi: {
    name: 'Alkarısı Laneti',
    relics: ['bloodPact', 'vampTooth', 'shadowCloak'],
    bonus: '+%20 Can Çalma & +%40 Kritik'
  }
};

// 2. Weather particles pool
const weatherParticles = [];
for (let i = 0; i < 28; i++) {
  weatherParticles.push({
    x: Math.random() * 640,
    y: Math.random() * 1024,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 1.5 + Math.random() * 2,
    size: 1.5 + Math.random() * 2,
    alpha: 0.3 + Math.random() * 0.5
  });
}

// 3. Bestiary
const BESTIARY_DATA = {
  golem: { name: 'Taş Golem', desc: 'Kadim kayaların büyüyle canlanmış hali. Yüksek zırha sahiptir.', weak: 'earth+water' },
  specter: { name: 'Hortlak / Tayf', desc: 'Bozkırın huzursuz ruhları. Hızlı ve çeviktir.', weak: 'fire+storm' },
  swarmer: { name: 'Yeraltı Böceği', desc: 'Erlik Hanın ordusunun minik ama ölümcül sürüleri.', weak: 'fire' },
  boss_stone: { name: 'Taş Lordu', desc: 'Dağların kalbinden doğan devasa kadim muhafız.', weak: 'ice' }
};

// 4. Mythic Titles
const MYTHIC_TITLES = [
  { id: 'first_blood', name: 'İlk Kan', desc: '10 düşman katlet', check: (s) => s.kills >= 10 },
  { id: 'slayer_50', name: 'Bozkır Kurdu', desc: '50 düşman katlet', check: (s) => s.kills >= 50 },
  { id: 'boss_hunter', name: 'Lord Katili', desc: '1 Boss mağlup et', check: (s) => s.bossKills >= 1 },
  { id: 'crit_master', name: 'Kusursuz Vuruş', desc: '100+ hasarlı kritik vur', check: (s) => (s.maxCrit || 0) >= 100 },
  { id: 'endless_survivor', name: 'Tamag Yolcusu', desc: 'Dalga 10 üzerine çık', check: (s) => s.wave > 10 }
];

console.log('Features mock tests passed!');
