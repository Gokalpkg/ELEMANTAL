const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Hook Korhan Volcanic Bastion into damagePlayer
const targetDamagePlayer = `  player.hp -= dmg;
  if (modLv('mirrorShield') && (!mirrorCd || mirrorCd <= 0)) {`;

const replaceDamagePlayer = `  player.hp -= dmg;

  // KORHAN VOLKANİK SİPER (MAGMA PÜSKÜRMESİ) MEKANİĞİ
  if (player && (player.heroId === 'korhan' || selectedHeroId === 'korhan') && player.hp > 0) {
    player._volcanicAccum = (player._volcanicAccum || 0) + dmg;
    const threshold = player.maxHp * 0.20;
    if (player._volcanicAccum >= threshold) {
      player._volcanicAccum = 0;
      triggerVolcanicEruption(player.x, player.y);
    }
  }

  if (modLv('mirrorShield') && (!mirrorCd || mirrorCd <= 0)) {`;

if (content.includes(targetDamagePlayer)) {
  content = content.replace(targetDamagePlayer, replaceDamagePlayer);
  console.log('Hooked Korhan Volcanic Bastion into damagePlayer!');
} else {
  console.error('ERROR: Could not find targetDamagePlayer');
}

// 2. Hook friendly parried projectile handling into enemyProjectiles loop
const targetEnemyProj = `    if (outOfWorld(p.x, p.y, 24) || circleHitsObs(p.x,p.y,p.r)) {
      enemyProjectiles.splice(i,1); continue;
    }
    const hitR = p.r + player.r;`;

const replaceEnemyProj = `    if (outOfWorld(p.x, p.y, 24) || circleHitsObs(p.x,p.y,p.r)) {
      enemyProjectiles.splice(i,1); continue;
    }

    // BAMSI YANSITILMIŞ DOST MERMİ ETKİLEŞİMİ (PARRIED PROJECTILES)
    if (p.isFriendly) {
      let hitEnemy = false;
      if (enemies && enemies.length) {
        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const en = enemies[ei];
          if (Math.hypot(p.x - en.x, p.y - en.y) < en.r + p.r) {
            const dealt = takeDamage(en, p.dmg || 40, 'wind');
            punchEnemy(en, p.x, p.y, 16, true);
            spawnFloatText(en.x, en.y - 12, '💥' + dealt, '#38bdf8', 'crit');
            burst(p.x, p.y, '#38bdf8', 12, 3.0);
            hitEnemy = true;
            if (en.hp <= 0) killEnemy(ei);
            break;
          }
        }
      }
      if (hitEnemy) {
        enemyProjectiles.splice(i, 1);
        continue;
      }
      continue;
    }

    const hitR = p.r + player.r;`;

if (content.includes(targetEnemyProj)) {
  content = content.replace(targetEnemyProj, replaceEnemyProj);
  console.log('Hooked friendly parried projectile collision into enemyProjectiles!');
} else {
  console.error('ERROR: Could not find targetEnemyProj');
}

// Write back to index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished writing finishing touches to index.html! Length:', content.length);
