const fs = require('fs');

const htmlPath = 'index.html';
let content = fs.readFileSync(htmlPath, 'utf8');

const heroCardCss = `
/* ========================================================================= */
/* HERO ROSTER CARDS CSS (CLASH ROYALE STYLE HERO SELECTION)                */
/* ========================================================================= */
.hero-roster-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 2px 24px 2px;
}

.hero-roster-card {
  background: linear-gradient(135deg, rgba(22, 30, 48, 0.95), rgba(13, 17, 28, 0.98));
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px 14px 14px 14px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
  transition: all 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.hero-roster-card.selected {
  border-color: var(--hero-accent, #fbbf24);
  background: linear-gradient(135deg, rgba(30, 43, 72, 0.96), rgba(16, 24, 42, 0.98));
  box-shadow: 0 0 24px var(--hero-accent-glow, rgba(251, 191, 36, 0.35)), 0 8px 24px rgba(0, 0, 0, 0.6);
}

.hero-card-active-tag {
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.8px;
  padding: 3px 9px;
  border-radius: 8px;
  background: var(--hero-accent, #f59e0b);
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.hero-roster-card.selected .hero-card-active-tag {
  display: block;
}

.hero-card-canvas-wrap {
  width: 82px;
  height: 82px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
}

.hero-roster-canvas {
  width: 82px;
  height: 82px;
  display: block;
  image-rendering: pixelated;
}

.hero-card-badge-name {
  font-size: 16px;
  font-weight: 900;
  color: #f8fafc;
  text-align: center;
  margin: 0 0 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: 0.5px;
}

.hero-card-sub-title {
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
}

.hero-card-mini-stats {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.hero-mini-stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  color: #e2e8f0;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-card-passive-box {
  background: rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-left: 3.5px solid var(--hero-accent, #38bdf8);
}

.hero-card-passive-h {
  font-size: 11px;
  font-weight: 800;
  color: #fde047;
  margin-bottom: 3px;
  letter-spacing: 0.3px;
}

.hero-card-passive-d {
  font-size: 11px;
  color: #cbd5e1;
  line-height: 1.4;
}

.hero-card-select-btn {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-roster-card.selected .hero-card-select-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-color: #fde047;
  color: #0f172a;
  font-weight: 900;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}
`;

if (!content.includes('.hero-roster-card {')) {
  content = content.replace('/* Fixed Bottom Dock */', heroCardCss + '\n/* Fixed Bottom Dock */');
  fs.writeFileSync(htmlPath, content, 'utf8');
  console.log('Hero roster cards CSS injected successfully!');
} else {
  console.log('Hero roster cards CSS already present.');
}
