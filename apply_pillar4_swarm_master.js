const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[Pillar 4 Swarm Master] Starting overhaul. Original length:', content.length);

// =========================================================================
// 1. HAZARD RENDERING: ADD TELEGRAPH_RING AND TELEGRAPH_LINE
// =========================================================================
const oldHazardRenderMarker = `} else if (h.type === 'bramble') {`;

const newTelegraphRenderCode = `} else if (h.type === 'telegraph_ring') {
      // 1. DAİRESEL TEHLİKE TELGRAFI (KUŞATMA ÇEMBERİ VE ALAN SALDIRILARI)
      const p = Math.max(0, Math.min(1, (h.until - now) / (h.dur || 1200)));
      const curR = h.r * (1 - p * 0.25);
      ctx.strokeStyle = h.color || 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(h.x, h.y, curR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.beginPath();
      ctx.arc(h.x, h.y, curR, 0, Math.PI * 2);
      ctx.fill();
    } else if (h.type === 'telegraph_line') {
      // 2. ÇİZGİSEL HÜCUM KORİDORU TELGRAFI (PHALANX CHARGE CORRIDOR)
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot || 0);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.fillRect(-h.w / 2, 0, h.w, h.len);
      ctx.strokeStyle = h.color || 'rgba(239, 68, 68, 0.80)';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(-h.w / 2, 0, h.w, h.len);
      ctx.setLineDash([]);
      // Directional arrow chevrons along corridor
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      for (let cy = 40; cy < h.len; cy += 80) {
        ctx.beginPath();
        ctx.moveTo(0, cy + 18);
        ctx.lineTo(-12, cy);
        ctx.lineTo(12, cy);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (h.type === 'bramble') {`;

if (content.includes(oldHazardRenderMarker)) {
  content = content.replace(oldHazardRenderMarker, newTelegraphRenderCode);
  console.log('Pillar 4: Added telegraph_ring and telegraph_line into hazard rendering loop!');
} else {
  console.warn('Pillar 4 Warning: Could not find oldHazardRenderMarker');
}

// =========================================================================
// 2. UPGRADE triggerSwarmFormation WITH TELEGRAPHED DANGER PHASES
// =========================================================================
const oldTriggerSwarmFormationTarget = `function triggerSwarmFormation(formType) {
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
}`;

const newTriggerSwarmFormationReplacement = `function triggerSwarmFormation(formType) {
  if (!player || !enemies) return;
  const biome = currentBiome();
  const themeCol = (biome && biome.accent) || '#ff1744';

  if (formType === 'encirclement') {
    // 1. KUŞATMA ÇEMBERİ (360° ENCIRCLEMENT WITH TELEGRAPHED DANGER RING)
    showStreakBanner('⚡ KUŞATMA ÇEMBERİ! DIŞARI KAÇ! ⚡', '#ffd700');
    triggerScreenFlash('#ffd700', 0.35, 200);
    playSfx('charge', 0.6);
    shake = Math.max(shake, 10);
    vibrate([40, 60, 40]);

    const targetX = player.x;
    const targetY = player.y;
    const r = 320;

    // Visual Telegraphed Danger Ring on Ground (1.1s Warning before emergence)
    if (hazards) {
      hazards.push({
        x: targetX, y: targetY, r: r,
        type: 'telegraph_ring',
        color: '#f59e0b',
        dur: 1100,
        until: performance.now() + 1100
      });
    }

    setTimeout(() => {
      if (!running || paused) return;
      const count = Math.min(28, 20 + Math.floor(wave * 0.8));
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const ex = targetX + Math.cos(ang) * r;
        const ey = targetY + Math.sin(ang) * r;
        spawnSingleEnemy(ex, ey, 'fast');
      }
      playPunchySubBass(60, 0.25, 0.45, true);
    }, 1000);

  } else if (formType === 'phalanx') {
    // 2. HÜCUM SÜVARİ HATTI (PHALANX CHARGE LINE WITH TELEGRAPHED CORRIDOR)
    showStreakBanner('⚔️ HÜCUM HATTI YAKLAŞIYOR! ⚔️', '#ff3d00');
    playSfx('laser_charge', 0.6);
    shake = Math.max(shake, 8);

    const lineDir = Math.random() < 0.5 ? 'horiz' : 'vert';
    const count = 12;

    if (lineDir === 'horiz') {
      const spawnY = player.y - 340;
      if (hazards) {
        hazards.push({
          x: player.x, y: spawnY,
          w: 480, len: 680, rot: 0,
          type: 'telegraph_line',
          color: '#ef4444',
          dur: 1000,
          until: performance.now() + 1000
        });
      }
      setTimeout(() => {
        if (!running || paused) return;
        for (let i = 0; i < count; i++) {
          const ex = player.x - 220 + i * 40;
          spawnSingleEnemy(ex, spawnY, 'tank');
        }
        playPunchySubBass(52, 0.35, 0.55, true);
      }, 950);

    } else {
      const spawnX = player.x - 340;
      if (hazards) {
        hazards.push({
          x: spawnX, y: player.y,
          w: 480, len: 680, rot: Math.PI / 2,
          type: 'telegraph_line',
          color: '#ef4444',
          dur: 1000,
          until: performance.now() + 1000
        });
      }
      setTimeout(() => {
        if (!running || paused) return;
        for (let i = 0; i < count; i++) {
          const ey = player.y - 220 + i * 40;
          spawnSingleEnemy(spawnX, ey, 'fast');
        }
        playPunchySubBass(55, 0.30, 0.50, true);
      }, 950);
    }

  } else if (formType === 'spiral') {
    // 3. PUSUCU GİRDAP (SPIRAL AMBUSH SWARM WITH 4 RUNIC TELEGAPH NODES)
    showStreakBanner('🌪️ GİRDAP PUSUSU! 🌪️', '#c084fc');
    playSfx('skill', 0.5);
    const corners = [
      { x: player.x - 280, y: player.y - 280 },
      { x: player.x + 280, y: player.y - 280 },
      { x: player.x - 280, y: player.y + 280 },
      { x: player.x + 280, y: player.y + 280 }
    ];

    if (hazards) {
      corners.forEach(c => {
        hazards.push({
          x: c.x, y: c.y, r: 65,
          type: 'telegraph_ring',
          color: '#c084fc',
          dur: 900,
          until: performance.now() + 900
        });
      });
    }

    setTimeout(() => {
      if (!running || paused) return;
      corners.forEach(c => {
        for (let k = 0; k < 5; k++) {
          spawnSingleEnemy(c.x + (Math.random()-0.5)*30, c.y + (Math.random()-0.5)*30, 'shooter');
        }
      });
      playPunchySubBass(65, 0.20, 0.40);
    }, 850);
  }
}`;

if (content.includes(oldTriggerSwarmFormationTarget)) {
  content = content.replace(oldTriggerSwarmFormationTarget, newTriggerSwarmFormationReplacement);
  console.log('Pillar 4: Upgraded triggerSwarmFormation with telegraphed ground warnings & sound drops!');
} else {
  console.warn('Pillar 4 Warning: Could not find oldTriggerSwarmFormationTarget');
}

// =========================================================================
// 3. ENHANCE KUSURSUZ SIYRILMA (CLOSE DODGE TIME DILATION & SPEED BURST)
// =========================================================================
const oldDodgeTarget = `if (bDist < (bp.r || 6) + player.r + 14 && !bp._dodged) {
          bp._dodged = true;
          spawnFloatText(player.x, player.y - 28, '⚡ KUSURSUZ SIYRILMA!', '#38bdf8', 'small');
          burst(player.x, player.y, '#38bdf8', 10, 3.0);
          player.dashCd = Math.round(player.dashCd * 0.4); // 60% Dash CD refund!
          vibrate([20, 35]);
          playSfx('confirm', 0.35, 600);
          break;
        }`;

const newDodgeReplacement = `if (bDist < (bp.r || 6) + player.r + 14 && !bp._dodged) {
          bp._dodged = true;
          spawnFloatText(player.x, player.y - 28, '⚡ KUSURSUZ SIYRILMA!', '#38bdf8', 'small');
          burst(player.x, player.y, '#38bdf8', 12, 3.4);
          player.dashCd = Math.round((player.dashCd || 0) * 0.35); // 65% Dash CD refund!
          player.speedBoostUntil = performance.now() + 1400; // +30% Instant speed burst!
          timeDodgeTimer = 10; // Micro slow-mo bullet-time satisfaction!
          if (typeof synthBlip === 'function') synthBlip('close_dodge');
          vibrate([20, 35]);
          break;
        }`;

if (content.includes(oldDodgeTarget)) {
  content = content.replace(oldDodgeTarget, newDodgeReplacement);
  console.log('Pillar 4: Enhanced Close Dodge with slow-mo time dilation & speed burst!');
} else {
  console.warn('Pillar 4 Warning: Could not find oldDodgeTarget');
}

// =========================================================================
// 4. SOFT BOID SEPARATION ENHANCEMENT (PREVENT COLLAPSED ENEMY STACKS)
// =========================================================================
const oldFlockingTarget = `// STEP 5: SWARM FLOCKING & ENCIRCLEMENT (Boids pincer behavior)
    const isMeleeMob = (en.type === 'swarmer' || en.type === 'walker' || en.type === 'fast' || en.type === 'slime' || en.type === 'bearer' || en.type === 'golem');
    if (isMeleeMob && dist > 50) {
      const flankDir = ((en.phase || 0) > Math.PI) ? 1 : -1;
      const flankAng = flankDir * 0.62; // ~35 deg tangential flanking pincer
      const baseAng = Math.atan2(player.y - en.y, player.x - en.x);
      const targetAng = baseAng + flankAng;
      const tDist = Math.max(16, dist - 18);
      goalX = en.x + Math.cos(targetAng) * tDist;
      goalY = en.y + Math.sin(targetAng) * tDist;
    }`;

const newFlockingReplacement = `// STEP 5: SWARM FLOCKING & ENCIRCLEMENT (Boids pincer behavior & soft separation)
    const isMeleeMob = (en.type === 'swarmer' || en.type === 'walker' || en.type === 'fast' || en.type === 'slime' || en.type === 'bearer' || en.type === 'golem');
    if (isMeleeMob && dist > 50) {
      const flankDir = ((en.phase || 0) > Math.PI) ? 1 : -1;
      const flankAng = flankDir * 0.62; // ~35 deg tangential flanking pincer
      const baseAng = Math.atan2(player.y - en.y, player.x - en.x);
      const targetAng = baseAng + flankAng;
      const tDist = Math.max(16, dist - 18);
      goalX = en.x + Math.cos(targetAng) * tDist;
      goalY = en.y + Math.sin(targetAng) * tDist;
    }
    // Soft Boid Repulsion from nearby packmates within 28px
    if (enemies && dist > 35) {
      for (let oi = 0; oi < Math.min(enemies.length, 12); oi++) {
        const other = enemies[oi];
        if (other && other !== en && other.hp > 0) {
          const odx = en.x - other.x;
          const ody = en.y - other.y;
          const oDist = Math.hypot(odx, ody) || 1;
          if (oDist < 26) {
            goalX += (odx / oDist) * 12;
            goalY += (ody / oDist) * 12;
          }
        }
      }
    }`;

if (content.includes(oldFlockingTarget)) {
  content = content.replace(oldFlockingTarget, newFlockingReplacement);
  console.log('Pillar 4: Enhanced Boid flocking & soft packmate separation!');
} else {
  console.warn('Pillar 4 Warning: Could not find oldFlockingTarget');
}

// Write the updated file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('[Pillar 4 Swarm Master] Completed successfully. New length:', content.length);
