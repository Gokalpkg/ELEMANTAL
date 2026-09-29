const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('=== APPLYING HERO CAROUSEL IN HEROES TAB & MODERN SHRINE ===');

// =========================================================================
// 1. UPDATE clashPageHeroes HTML (3-PEDESTAL CAROUSEL + DOSSIER CARD)
// =========================================================================
const heroPageStart = html.indexOf('<section class="clash-page" id="clashPageHeroes">');
const heroPageEnd = html.indexOf('<!-- TAB 1: SAVAŞ (BATTLE HUB - DEFAULT) -->', heroPageStart);

if (heroPageStart === -1 || heroPageEnd === -1) {
  console.error('Could not find clashPageHeroes bounds!');
  process.exit(1);
}

const newHeroPageHtml = `<section class="clash-page" id="clashPageHeroes">
            <div class="clash-page-header">
              <div class="clash-header-with-back">
                <h2><span class="px-icon px-heroes"></span> SAVAŞÇILAR</h2>
                <button type="button" class="clash-pill-back-btn" onclick="setClashPage(1)">SAVAŞA GEÇ ›</button>
              </div>
              <p>Sağa/sola kaydırarak Türk alpini seç ve gücünü kuşan</p>
            </div>

            <div class="clash-heroes-scroll">
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
                    <canvas id="rosterHeroCanvas" width="104" height="104" class="main-hero-canvas"></canvas>
                    <div class="hero-elem-indicator" id="heroElemIndicator"><span class="px-icon px-wind"></span> RÜZGAR</div>
                  </div>

                  <!-- Sağ Kaide: Sıradaki Kahraman Silüeti -->
                  <div class="hero-pedestal pedestal-right" id="heroPedestalRight" role="button" aria-label="Sonraki Kahraman">
                    <div class="pedestal-disc"></div>
                    <canvas id="heroSilhouetteRight" width="76" height="76" class="hero-pedestal-canvas"></canvas>
                    <div class="pedestal-name" id="heroPedestalRightName">SONRAKİ</div>
                  </div>

                  <button type="button" class="hero-stage-nav next-nav" id="heroNextBtn" aria-label="Sonraki Kahraman">▶</button>
                </div>

                <!-- Kahraman Dosyası (Hero Dossier) & Nitelik Barları -->
                <div class="hero-dossier-card" id="heroInfoCard">
                  <div class="hero-dossier-header">
                    <div class="hero-title-group">
                      <span class="hero-name-h" id="heroCardTitle"><span class="px-icon px-wind"></span> BAMSI</span>
                      <span class="hero-role-pill" id="heroRolePill">HIZLI YAKIN DÖVÜŞ</span>
                    </div>
                    <span class="hero-selected-tag" id="heroSelectedBadge">AKTİF</span>
                  </div>
                  <div class="hero-card-subtitle" id="heroCardSub">Yelin ve Ruhun Kılıcı</div>

                  <!-- Mitolojik Silah & Söz -->
                  <div class="hero-weapon-box">
                    <div class="weapon-info-line">
                      <span class="weapon-icon"><span class="px-icon px-swords"></span></span>
                      <span class="weapon-label" id="heroStatWep">Kavisli Türk Yatağanı</span>
                    </div>
                    <div class="hero-quote-inline" id="heroCardQuote">"Yel gibi eser, kılıç gibi biçeriz!"</div>
                  </div>

                  <!-- Görsel Nitelik / Stat Barları (HP, Hız, Hasar, Özel) -->
                  <div class="hero-rpg-bars">
                    <div class="rpg-bar-item">
                      <div class="rpg-bar-label">
                        <span class="rpg-stat-name"><span class="px-icon px-heart px-anim-beat"></span> CAN (HP)</span>
                        <span class="rpg-stat-val" id="heroStatHpVal">160</span>
                      </div>
                      <div class="rpg-bar-track">
                        <div class="rpg-bar-fill hp" id="heroStatHpBar" style="width: 64%;"></div>
                      </div>
                    </div>
                    <div class="rpg-bar-item">
                      <div class="rpg-bar-label">
                        <span class="rpg-stat-name"><span class="px-icon px-lightning"></span> HIZ</span>
                        <span class="rpg-stat-val" id="heroStatSpdVal">3.5</span>
                      </div>
                      <div class="rpg-bar-track">
                        <div class="rpg-bar-fill spd" id="heroStatSpdBar" style="width: 83%;"></div>
                      </div>
                    </div>
                    <div class="rpg-bar-item">
                      <div class="rpg-bar-label">
                        <span class="rpg-stat-name"><span class="px-icon px-swords"></span> SALDIRI HASARI</span>
                        <span class="rpg-stat-val" id="heroStatDmgVal">1.05x</span>
                      </div>
                      <div class="rpg-bar-track">
                        <div class="rpg-bar-fill dmg" id="heroStatDmgBar" style="width: 78%;"></div>
                      </div>
                    </div>
                    <div class="rpg-bar-item">
                      <div class="rpg-bar-label">
                        <span class="rpg-stat-name" id="heroStatSpecialLbl"><span class="px-icon px-target"></span> UZMANLIK</span>
                        <span class="rpg-stat-val" id="heroStatSpecialVal">+%25 Savuşturma</span>
                      </div>
                      <div class="rpg-bar-track">
                        <div class="rpg-bar-fill spc" id="heroStatSpecialBar" style="width: 85%;"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Pasif Yetenek & Taktik Bölümü -->
                  <div class="hero-passive-card">
                    <div class="hero-passive-header">
                      <span class="px-icon px-star px-anim-twinkle"></span>
                      <span class="hero-passive-title" id="heroPassiveTitle">ÖZEL PASİF: Yel Kalkanı (Parry)</span>
                    </div>
                    <div class="hero-passive-desc" id="heroPassiveDesc">
                      Saldırı anında kılıca çarpan düşman mermilerini tersine fırlatır (Parry) ve hasar patlaması kazanır.
                    </div>
                  </div>

                  <div class="hero-tactic-tip" id="heroTacticTip">
                    Taktik: Düşmanların mermi yağmuru ortasında kılıcını savurarak mermileri düşmanlara geri fırlat!
                  </div>

                  <!-- Action Play with Hero Button -->
                  <button type="button" class="btn btn-hero-choose" id="chooseHeroActionBtn" onclick="setClashPage(1)">
                    <span class="px-icon px-play"></span> BU KAHRAMANLA SAVAŞA GİR
                  </button>
                </div>
              </section>
            </div>
          </section>\n\n          `;

html = html.slice(0, heroPageStart) + newHeroPageHtml + html.slice(heroPageEnd);
console.log('1. Replaced clashPageHeroes with 3-Pedestal Hero Carousel & Dossier.');

// =========================================================================
// 2. UPDATE clashPageShrine HTML (VAULT HEADER, MODERN GRID, CLEAN CODEX)
// =========================================================================
const shrinePageStart = html.indexOf('<section class="clash-page" id="clashPageShrine">');
const shrinePageEnd = html.indexOf('<!-- 3. Fixed Bottom 3-Tab Dock (Clash Royale Style) -->', shrinePageStart);

if (shrinePageStart === -1 || shrinePageEnd === -1) {
  console.error('Could not find clashPageShrine bounds!');
  process.exit(1);
}

const newShrinePageHtml = `<section class="clash-page" id="clashPageShrine">
            <div class="clash-page-header">
              <div class="clash-header-with-back">
                <button type="button" class="clash-pill-back-btn" onclick="setClashPage(1)">‹ SAVAŞA DÖN</button>
                <h2><span class="px-icon px-shrine"></span> KADİM SUNAK</h2>
              </div>
              <p>Topladığın kristallerle kalıcı niteliklerini mühürle</p>
            </div>
            
            <div class="clash-shrine-tabs">
              <button type="button" class="clash-sub-tab active" id="subTabTreeBtn">Kadim Sunak</button>
              <button type="button" class="clash-sub-tab" id="subTabGuideBtn">Sır Kodeksi</button>
            </div>

            <!-- Kadim Kristal Havuzu Göstergesi -->
            <div class="shrine-vault-card">
              <div class="vault-info">
                <span class="vault-label">GÜÇ HAVUZU</span>
                <div class="vault-display">
                  <span class="px-icon px-gem px-anim-shimmer" style="width:24px;height:24px;"></span>
                  <span class="vault-val" id="shrineCrystalVal">0</span>
                  <span class="vault-unit">KRİSTAL</span>
                </div>
              </div>
              <div class="vault-tip">Sunağa kristal adayarak kahramanlarının ebedi gücünü mühürle</div>
            </div>

            <div class="clash-sub-content" id="clashTreePane">
              <div class="shrine-tree-grid" id="treeList">
                <!-- Dynamically populated with modern talent cards -->
              </div>
              <div class="shrine-respec-wrap">
                <button class="btn btn-shrine-respec" id="treeRespecBtn" type="button">
                  <span class="px-icon px-respec px-anim-spin"></span> TÜM KRİSTALLERİ SIFIRLA (%100 İADE)
                </button>
              </div>
            </div>

            <div class="clash-sub-content" id="clashGuidePane" style="display:none;">
              <div class="modern-codex-container">
                <div class="modern-codex-header">
                  <span class="px-icon px-scroll px-anim-float"></span>
                  <span class="codex-title">SÜPER EVRİM FÜZYON REHBERİ</span>
                </div>
                <div class="codex-intro">İki elementi mühürleyip seviye atladığında silahın Kadim Süper Evrim gücüne kavuşur:</div>
                
                <div class="codex-cards-list">
                  <!-- 1. Güneş Alevi -->
                  <div class="codex-card fusion-solar">
                    <div class="fusion-header">
                      <div class="fusion-components">
                        <span class="elem-pill fire"><span class="px-icon px-fire px-anim-flame"></span> ATEŞ</span>
                        <span class="fusion-plus">+</span>
                        <span class="elem-pill nature"><span class="px-icon px-nature"></span> DOĞA</span>
                      </div>
                      <span class="fusion-arrow">➔</span>
                      <div class="fusion-result"><span class="px-icon px-star px-anim-twinkle"></span> GÜNEŞ ALEVİ</div>
                    </div>
                    <div class="fusion-desc">Tüm alanı kavuran güneş patlamaları saçar, hedef alınan düşmanları ve çevresini devamlı yakar.</div>
                  </div>

                  <!-- 2. Mutlak Süperiletken -->
                  <div class="codex-card fusion-electric">
                    <div class="fusion-header">
                      <div class="fusion-components">
                        <span class="elem-pill water"><span class="px-icon px-water"></span> SU</span>
                        <span class="fusion-plus">+</span>
                        <span class="elem-pill lightning"><span class="px-icon px-lightning px-anim-zap"></span> YILDIRIM</span>
                      </div>
                      <span class="fusion-arrow">➔</span>
                      <div class="fusion-result"><span class="px-icon px-star px-anim-twinkle"></span> SÜPERİLETKEN</div>
                    </div>
                    <div class="fusion-desc">Islanan tüm hedeflere anında elektrik zinciri atar; ekrandaki onlarca düşmanı şokla felç eder.</div>
                  </div>

                  <!-- 3. Göktaşı Kıyameti -->
                  <div class="codex-card fusion-meteor">
                    <div class="fusion-header">
                      <div class="fusion-components">
                        <span class="elem-pill earth"><span class="px-icon px-shield"></span> TOPRAK</span>
                        <span class="fusion-plus">+</span>
                        <span class="elem-pill fire"><span class="px-icon px-fire px-anim-flame"></span> ATEŞ</span>
                      </div>
                      <span class="fusion-arrow">➔</span>
                      <div class="fusion-result"><span class="px-icon px-star px-anim-twinkle"></span> GÖKTAŞI KIYAMETİ</div>
                    </div>
                    <div class="fusion-desc">Gökyüzünden alevli magma taşları yağdırır; devasa patlama alanı ve %100 kritik darbe bırakır.</div>
                  </div>

                  <!-- 4. Kara Delik Vorteksi -->
                  <div class="codex-card fusion-void">
                    <div class="fusion-header">
                      <div class="fusion-components">
                        <span class="elem-pill void"><span class="px-icon px-moon"></span> BOŞLUK</span>
                        <span class="fusion-plus">+</span>
                        <span class="elem-pill water"><span class="px-icon px-water"></span> SU</span>
                      </div>
                      <span class="fusion-arrow">➔</span>
                      <div class="fusion-result"><span class="px-icon px-star px-anim-twinkle"></span> KARA DELİK</div>
                    </div>
                    <div class="fusion-desc">Tüm düşman ve tehlikeli mermileri içine çeken yerçekimsel girdap yaratarak hepsini ezer.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>\n\n      `;

html = html.slice(0, shrinePageStart) + newShrinePageHtml + html.slice(shrinePageEnd);
console.log('2. Replaced clashPageShrine with modern vault, talent cards, and codex.');

// =========================================================================
// 3. ADD MODERN CSS FOR SHRINE & HERO CAROUSEL
// =========================================================================
const modernCss = `
  /* Modern Shrine & Talent Cards */
  .shrine-vault-card {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95));
    border: 1.5px solid rgba(168, 85, 247, 0.35);
    border-radius: 16px;
    padding: 12px 16px;
    margin: 4px 12px 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    text-align: center;
  }
  .shrine-vault-card .vault-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #c084fc;
    display: block;
    margin-bottom: 2px;
  }
  .shrine-vault-card .vault-display {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 4px;
  }
  .shrine-vault-card .vault-val {
    font-size: 26px;
    font-weight: 900;
    color: #38bdf8;
    text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
    letter-spacing: 0.04em;
  }
  .shrine-vault-card .vault-unit {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
  }
  .shrine-vault-card .vault-tip {
    font-size: 11px;
    color: #94a3b8;
    opacity: 0.85;
  }

  .shrine-tree-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px 14px;
  }

  .shrine-talent-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: rgba(15, 23, 42, 0.88);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    transition: transform 0.12s, border-color 0.2s, background 0.2s;
    user-select: none;
    -webkit-user-select: none;
  }
  .shrine-talent-card.can-afford {
    border-color: rgba(245, 158, 11, 0.3);
    cursor: pointer;
  }
  .shrine-talent-card.can-afford:active {
    transform: scale(0.98);
    background: rgba(30, 41, 59, 0.95);
  }
  .shrine-talent-card.maxed {
    border-color: rgba(234, 179, 8, 0.45);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 27, 75, 0.6));
  }
  .shrine-talent-card.locked {
    opacity: 0.68;
  }

  .talent-icon-badge {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid var(--talent-color, #ffd740);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 14px rgba(255, 215, 64, 0.15);
  }

  .talent-detail {
    flex: 1;
    min-width: 0;
  }
  .talent-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
  }
  .talent-title {
    font-size: 14px;
    font-weight: 800;
    color: #f8fafc;
    letter-spacing: 0.02em;
  }
  .talent-rank-lbl {
    font-size: 11px;
    font-weight: 800;
    color: var(--talent-color, #ffd740);
    background: rgba(255, 255, 255, 0.06);
    padding: 1px 6px;
    border-radius: 6px;
  }
  .talent-pips-bar {
    display: flex;
    gap: 4px;
    margin: 3px 0 5px;
  }
  .talent-pip {
    height: 5px;
    flex: 1;
    max-width: 24px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
  }
  .talent-pip.filled {
    background: var(--talent-color, #ffd740);
    box-shadow: 0 0 6px var(--talent-color, #ffd740);
  }
  .talent-hint {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.3;
  }

  .talent-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .talent-upgrade-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    user-select: none;
    touch-action: manipulation;
    transition: transform 0.12s;
  }
  .talent-upgrade-btn.active {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0b1120;
    font-weight: 900;
    box-shadow: 0 2px 10px rgba(245, 158, 11, 0.4);
  }
  .talent-upgrade-btn.active:active {
    transform: scale(0.92);
  }
  .talent-upgrade-btn.disabled {
    background: rgba(51, 65, 85, 0.5);
    color: #64748b;
    cursor: default;
  }
  .talent-upgrade-btn .btn-cost {
    font-size: 12px;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .talent-upgrade-btn .btn-lbl {
    font-size: 9px;
    letter-spacing: 0.05em;
    opacity: 0.9;
  }
  .talent-max-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(234, 179, 8, 0.15);
    border: 1px solid rgba(234, 179, 8, 0.45);
    color: #fbbf24;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.06em;
  }

  .shrine-respec-wrap {
    text-align: center;
    padding: 10px 14px 16px;
  }
  .btn-shrine-respec {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 340px;
    padding: 12px 18px;
    background: linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(159, 18, 57, 0.35));
    border: 1.5px solid rgba(244, 63, 94, 0.5);
    border-radius: 12px;
    color: #fda4af;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(225, 29, 72, 0.2);
    transition: transform 0.12s, background 0.2s;
  }
  .btn-shrine-respec:active {
    transform: scale(0.96);
    background: linear-gradient(135deg, rgba(225, 29, 72, 0.45), rgba(159, 18, 57, 0.55));
  }

  /* Modern Codex Styling */
  .modern-codex-container {
    padding: 4px 12px 16px;
  }
  .modern-codex-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .codex-title {
    font-size: 14px;
    font-weight: 900;
    color: #ffd740;
    letter-spacing: 0.05em;
  }
  .codex-intro {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  .codex-cards-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .codex-card {
    background: rgba(15, 23, 42, 0.88);
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  }
  .codex-card.fusion-solar { border-color: rgba(245, 158, 11, 0.4); }
  .codex-card.fusion-electric { border-color: rgba(56, 189, 248, 0.4); }
  .codex-card.fusion-meteor { border-color: rgba(239, 68, 68, 0.4); }
  .codex-card.fusion-void { border-color: rgba(192, 132, 252, 0.4); }

  .fusion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    flex-wrap: wrap;
    gap: 6px;
  }
  .fusion-components {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .fusion-plus {
    color: #64748b;
    font-weight: 800;
    font-size: 12px;
  }
  .fusion-arrow {
    color: #ffd740;
    font-weight: 900;
    font-size: 14px;
  }
  .elem-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.08);
  }
  .elem-pill.fire { color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
  .elem-pill.nature { color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
  .elem-pill.water { color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
  .elem-pill.lightning { color: #facc15; border: 1px solid rgba(250, 204, 21, 0.3); }
  .elem-pill.earth { color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3); }
  .elem-pill.void { color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); }

  .fusion-result {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 900;
    color: #fde047;
    background: rgba(253, 224, 71, 0.1);
    border: 1px solid rgba(253, 224, 71, 0.35);
    padding: 3px 8px;
    border-radius: 6px;
  }
  .fusion-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.35;
  }

  .btn-hero-choose {
    width: 100%;
    margin-top: 14px;
    padding: 12px;
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    border: none;
    border-radius: 12px;
    color: #0b1120 !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.12s;
  }
  .btn-hero-choose:active {
    transform: scale(0.96);
  }
`;

const styleClose = html.indexOf('</style>');
if (styleClose !== -1) {
  html = html.slice(0, styleClose) + '\n' + modernCss + '\n' + html.slice(styleClose);
  console.log('3. Injected modern CSS for Shrine and Hero Carousel.');
}

// =========================================================================
// 4. OVERHAUL fillTreePanel() JAVASCRIPT
// =========================================================================
const treePanelStart = html.indexOf('function fillTreePanel() {');
const treePanelEnd = html.indexOf('function buyTreeNode(id) {', treePanelStart);

if (treePanelStart !== -1 && treePanelEnd !== -1) {
  const newTreePanelCode = `function fillTreePanel() {
  const list = document.getElementById('treeList');
  if (!list) return;
  const m = loadMeta();
  const crystals = m.crystals || 0;
  
  // Update crystal displays
  fillCrystalHud();
  const shrineCrys = document.getElementById('shrineCrystalVal');
  if (shrineCrys) shrineCrys.textContent = crystals.toLocaleString();

  list.innerHTML = '';

  const THEME_COLORS = {
    hp: '#ef4444',
    damage: '#f97316',
    crit: '#eab308',
    dashRecovery: '#38bdf8',
    gold: '#facc15',
    shield: '#60a5fa',
    magnet: '#a855f7',
    speed: '#2dd4bf',
    startMod: '#ec4899'
  };

  META_TREE.forEach(node => {
    const lv = (m.tree && m.tree[node.id]) || 0;
    const maxed = lv >= node.max;
    const cost = maxed ? 0 : node.costs[lv];
    const canAfford = !maxed && crystals >= cost;
    const color = THEME_COLORS[node.id] || '#ffd740';

    const card = document.createElement('div');
    card.className = 'shrine-talent-card' + (maxed ? ' maxed' : (canAfford ? ' can-afford' : ' locked'));
    card.style.setProperty('--talent-color', color);

    // Build Level Pips [■][■][□][□][□]
    let pipsHtml = '';
    for (let i = 0; i < node.max; i++) {
      pipsHtml += '<span class="talent-pip ' + (i < lv ? 'filled' : '') + '"></span>';
    }

    card.innerHTML = \`
      <div class="talent-icon-badge">
        \${renderPixelIcon(node.emoji || node.id, 'px-anim-float', 22)}
      </div>
      <div class="talent-detail">
        <div class="talent-header-row">
          <span class="talent-title">\${node.name}</span>
          <span class="talent-rank-lbl">\${lv}/\${node.max}</span>
        </div>
        <div class="talent-pips-bar">\${pipsHtml}</div>
        <div class="talent-hint">\${node.hint}</div>
      </div>
      <div class="talent-action">
        \${maxed
          ? '<div class="talent-max-badge"><span class="px-icon px-crown"></span> MAKS</div>'
          : '<button type="button" class="talent-upgrade-btn ' + (canAfford ? 'active' : 'disabled') + '" ' + (canAfford ? '' : 'disabled') + '>' +
              '<span class="btn-cost"><span class="px-icon px-gem"></span> ' + cost + '</span>' +
              '<span class="btn-lbl">YÜKSELT</span>' +
            '</button>'
        }
      </div>
    \`;

    if (!maxed && canAfford) {
      bindTouchButton(card, () => buyTreeNode(node.id));
    }

    list.appendChild(card);
  });
}\n\n`;

  html = html.slice(0, treePanelStart) + newTreePanelCode + html.slice(treePanelEnd);
  console.log('4. Overhauled fillTreePanel() with modern talent cards & level pips.');
}

// =========================================================================
// 5. UPDATE updateHeroSelectUI() TO SYNC BOTH TABS PERFECTLY
// =========================================================================
const heroSelectUiStart = html.indexOf('function updateHeroSelectUI() {');
const heroSelectUiEnd = html.indexOf('// =========================================================================\n// 8 MYTHOLOGICAL TURKIC ACHIEVEMENTS', heroSelectUiStart);

if (heroSelectUiStart !== -1 && heroSelectUiEnd !== -1) {
  const newHeroSelectUiCode = `function updateHeroSelectUI() {
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
    card.style.transform = 'scale(0.98)';
    setTimeout(() => { if (card) card.style.transform = 'scale(1)'; }, 100);
  }
  const showcase = document.getElementById('heroShowcaseSection');
  if (showcase) {
    showcase.style.setProperty('--hero-accent', hero.color);
    showcase.style.setProperty('--hero-accent-alpha', hero.color + '33');
  }

  // 2. Hero Details (Title, Subtitle, Quote, Indicator)
  const titleEl = document.getElementById('heroCardTitle');
  if (titleEl) {
    titleEl.innerHTML = renderPixelIcon(hero.badge || hero.element || 'wind') + ' ' + hero.name;
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
    elemInd.innerHTML = renderPixelIcon(hero.badge || hero.element || 'wind') + ' ' + (hero.element ? hero.element.toUpperCase() : 'TEMEL');
    elemInd.style.borderColor = hero.color;
    elemInd.style.color = hero.color;
  }

  // 3. Mitolojik Silah & Stat Barları (With spring transition)
  const wepEl = document.getElementById('heroStatWep');
  if (wepEl) wepEl.textContent = hero.weapon || 'Kılıç';

  const hpVal = document.getElementById('heroStatHpVal');
  if (hpVal) hpVal.textContent = hero.hp;
  const hpBar = document.getElementById('heroStatHpBar');
  if (hpBar) {
    hpBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    hpBar.style.width = Math.min(100, Math.round((hero.hp / 240) * 100)) + '%';
  }

  const spdVal = document.getElementById('heroStatSpdVal');
  if (spdVal) spdVal.textContent = hero.speed.toFixed(1);
  const spdBar = document.getElementById('heroStatSpdBar');
  if (spdBar) {
    spdBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    spdBar.style.width = Math.min(100, Math.round((hero.speed / 4.2) * 100)) + '%';
  }

  const dmgVal = document.getElementById('heroStatDmgVal');
  if (dmgVal) dmgVal.textContent = (hero.dmgMul ? hero.dmgMul.toFixed(2) + 'x' : '1.00x');
  const dmgBar = document.getElementById('heroStatDmgBar');
  if (dmgBar) {
    dmgBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    dmgBar.style.width = Math.min(100, Math.round(((hero.dmgMul || 1.0) / 1.35) * 100)) + '%';
  }

  const spcLbl = document.getElementById('heroStatSpecialLbl');
  if (spcLbl) spcLbl.textContent = hero.specialLabel || 'UZMANLIK';
  const spcVal = document.getElementById('heroStatSpecialVal');
  if (spcVal) spcVal.textContent = hero.specialValue || '+%15 Güç';
  const spcBar = document.getElementById('heroStatSpecialBar');
  if (spcBar) {
    spcBar.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    spcBar.style.width = (hero.specialPct || 80) + '%';
  }

  // 4. Pasif Yetenek & Taktiksel Rehber
  const passTitle = document.getElementById('heroPassiveTitle');
  if (passTitle) passTitle.textContent = 'ÖZEL PASİF: ' + hero.passiveName;

  const passDesc = document.getElementById('heroPassiveDesc');
  if (passDesc) passDesc.textContent = hero.passiveDesc;

  const tacticEl = document.getElementById('heroTacticTip');
  if (tacticEl) {
    tacticEl.textContent = hero.tacticTip || 'Taktik: Düşmanların etrafında dönerek element kombolarını birleştir!';
  }

  // 5. Render Center Hero (Canlı & Animasyonlu) in both Tab 0 and Tab 1
  const mainCvs = document.getElementById('mainHeroPreviewCanvas');
  if (mainCvs) renderHeroThumbnail(mainCvs, hero.id);
  const rosterCvs = document.getElementById('rosterHeroCanvas');
  if (rosterCvs) renderHeroThumbnail(rosterCvs, hero.id);

  // 6. Render Left & Right Pedestal Silhouettes
  const leftCvs = document.getElementById('heroSilhouetteLeft');
  if (leftCvs) renderHeroSilhouetteThumbnail(leftCvs, prevHeroKey);
  const leftName = document.getElementById('heroPedestalLeftName');
  if (leftName) leftName.textContent = '‹ ' + prevHeroObj.name;

  const rightCvs = document.getElementById('heroSilhouetteRight');
  if (rightCvs) renderHeroSilhouetteThumbnail(rightCvs, nextHeroKey);
  const rightName = document.getElementById('heroPedestalRightName');
  if (rightName) rightName.textContent = nextHeroObj.name + ' ›';
}\n\n`;

  html = html.slice(0, heroSelectUiStart) + newHeroSelectUiCode + html.slice(heroSelectUiEnd);
  console.log('5. Updated updateHeroSelectUI() to synchronize both tabs.');
}

// =========================================================================
// 6. UPDATE initHeroCarouselStage() GESTURES & PREVENT CLASH CONFLICT
// =========================================================================
const carouselInitStart = html.indexOf('function initHeroCarouselStage() {');
const carouselInitEnd = html.indexOf('// =========================================================================\n// CLASH ROYALE 3-SCREEN HORIZONTAL SWIPE', carouselInitStart);

if (carouselInitStart !== -1 && carouselInitEnd !== -1) {
  const newCarouselInitCode = `function initHeroCarouselStage() {
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const pedLeft = document.getElementById('heroPedestalLeft');
  const pedRight = document.getElementById('heroPedestalRight');
  const stage = document.getElementById('heroStageCarousel');
  const showcase = document.getElementById('heroShowcaseSection');

  if (prevBtn) bindTouchButton(prevBtn, () => prevHero());
  if (nextBtn) bindTouchButton(nextBtn, () => nextHero());
  if (pedLeft) bindTouchButton(pedLeft, () => prevHero());
  if (pedRight) bindTouchButton(pedRight, () => nextHero());

  const targetEl = stage || showcase;
  if (targetEl && !targetEl._swipeBound) {
    targetEl._swipeBound = true;
    let startX = 0;
    let startY = 0;
    targetEl.addEventListener('touchstart', e => {
      if (e.touches && e.touches[0]) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    targetEl.addEventListener('touchend', e => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 0.9) {
        if (dx < 0) nextHero();
        else prevHero();
      }
    }, { passive: true });
  }
}\n\n`;

  html = html.slice(0, carouselInitStart) + newCarouselInitCode + html.slice(carouselInitEnd);
  console.log('6. Updated initHeroCarouselStage() with responsive touch swipe.');
}

// =========================================================================
// 7. PREVENT CLASH VIEWPORT SWIPE FROM CONFLICTING WITH HERO CAROUSEL
// =========================================================================
const oldSwipeExclusion = "if (e.target.closest('.clash-bottom-dock')) return;";
const newSwipeExclusion = "if (e.target.closest('.clash-bottom-dock') || e.target.closest('#heroStageCarousel') || e.target.closest('#heroInfoCard')) return;";

if (html.includes(oldSwipeExclusion)) {
  html = html.replace(oldSwipeExclusion, newSwipeExclusion);
  console.log('7. Protected hero carousel from clash viewport swipe collision.');
}

// In setClashPage, ensure updateHeroSelectUI is called on page 0
const oldPage0Call = "if (typeof renderHeroRosterCards === 'function') renderHeroRosterCards();";
const newPage0Call = "if (typeof updateHeroSelectUI === 'function') updateHeroSelectUI(); if (typeof initHeroCarouselStage === 'function') initHeroCarouselStage();";
if (html.includes(oldPage0Call)) {
  html = html.replace(oldPage0Call, newPage0Call);
  console.log('8. setClashPage now triggers updateHeroSelectUI on page 0.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('=== HERO CAROUSEL & MODERN SHRINE SUCCESSFULLY APPLIED ===');
