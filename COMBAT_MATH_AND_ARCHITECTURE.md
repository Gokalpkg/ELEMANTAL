# Combat Math, Status Matrix, Special Mechanics, Architecture

Tarih: 2026-09-14  
Oyun: Elementer (`index.html`)  
Hedef: sprint’e girecek sabitler, formüller, event akışı.  
İlgili: `ELEMENTAL_SYNERGY_GDD.md`

Mevcut kancalar (korunacak isimler): `takeDamage`, `markHitDmg`, `applyEffect`, `elemMul`, `fatigueMul`, `activateSkill`, `ENEMY_HP_MUL`, `ENEMY_DMG_MUL`.

---

## 0. Ortak sabitler

```js
const TICK_HZ = 60;
const DT = 1; // mevcut döngü birimi: 1 frame ≈ 1/60 s

const SOFT_K = 1.85;          // bonus yığının yumuşatma katsayısı
const WAVE_DMG_FLAT = 0.22;   // mevcut auto wave eklemesi (taban, softcap dışı)
const CRIT_BASE = 0.10;
const CRIT_MUL = 2.0;
const CRIT_CAP = 0.85;
const ARMOR_BASE = 0.0;       // normal düşman
const ARMOR_ARMORED = 0.45;   // mevcut tank/armored ≈ 0.55 alınan (1-0.45)
const ARMOR_BOSS = 0.18;
const RESIST_FLOOR = 0.35;    // direnç sonrası hasar tabanı (asla %65’ten fazla kesilmez)
const FUSION_WEIGHT_ROOT = 0.55;
const FUSION_WEIGHT_SEC = 0.45;
const FUSION_HYBRID_K = 0.28; // hibrit çarpan tavan katkısı
```

`softMul(linear)` yığılan **çarpan fazlasını** keser; taban hasara uygulanmaz.

```
softMul(linear) = 1 + ln(1 + max(0, linear) * SOFT_K)
```

Örnek: `linear = 0.50` (+%50 eklenti) → `1 + ln(1.925) ≈ 1.655` (+%65 değil +%65.5 yumuşak).  
`linear = 2.00` (+%200) → `1 + ln(4.70) ≈ 2.55` (üç kat değil).

---

## 1. Stat ve hasar formülleri

### 1.1 Pipeline sırası (değiştirme)

```
1  baseDmg
2  + waveFlat
3  * elemScale          // biyom + kök yatırım
4  * fusionMul          // Saf = 1, Hibrit = hibrit formül
5  * skillOrAutoMul     // eklenti / imza / basınç
6  * critMul            // 1 veya CRIT_MUL
7  * resistMul          // zırh, kalkan, shred sonrası
8  * reactionMul        // status matrisinden
9  * situationalMul     // lowHp, flow, pact, curse
10 floor, min 1
```

Kod isimleri:

```js
function computeHitDamage(ctx) {
  const {
    baseDmg, wave, elemId, isSkill, isCrit, isAmbush,
    target, mods, runLock, pressureBand
  } = ctx;

  const waveFlat = isSkill ? 0 : WAVE_DMG_FLAT * wave;
  const elemScale = elemMul(elemId) * fatigueMul(elemId);
  const fusionMul = resolveFusionMul(runLock, elemId);
  const bonusLinear =
    (mods.dmg || 0) / 100 +
    (isSkill ? (mods.skillDmg || 0) / 100 * synMul('skillDmg', 0.35) : 0);
  const skillOrAutoMul = softMul(bonusLinear) * pressureSkillMul(pressureBand);
  const critMul = isAmbush ? ashAmbushCritMul() : (isCrit ? CRIT_MUL : 1);
  const resistMul = resolveResistMul(target, elemId);
  const reactionMul = ReactionResolver.peek(target, elemId);
  const situationalMul = resolveSituational(target, elemId);

  const raw =
    (baseDmg + waveFlat)
    * elemScale
    * fusionMul
    * skillOrAutoMul
    * critMul
    * resistMul
    * reactionMul
    * situationalMul;

  return Math.max(1, Math.round(raw));
}
```

### 1.2 Taban hasar kaynakları

| Kaynak | `baseDmg` | Not |
|---|---|---|
| Auto kök | `AUTO_BASE[root].dmg` | Ateş 6.0 … Toprak 8.4 |
| Auto füzyon leke (her N) | kök tabanı × `0.72` | şekil değişir, taban şişmez |
| Skill | `COMBO_KITS[a_b].dmg` | 5–26 aralığı mevcut |
| DoT tick | `burnTickDmg` / `poisonTickDmg` | kritik yok |
| Reaksiyon burst | `hitDmg * reaction.burstK` | ayrı event, ikinci pipeline değil |

### 1.3 Element skalası

Mevcut `elemMul(el)` biyom tablosu **aynı kalır** (0.58–1.38).  
Üzerine kök yatırımı:

```
rootInvest = 1 + 0.08 * rootNodeCount        // T1/T2 Saf veya füzyon T1
elemScale  = elemMul(el) * fatigueMul(el) * rootInvest
fatigueMul(el) = 1 - min(1, elemFatigue[el]/100) * 0.48   // mevcut
```

`void` biyom satırı yoksa `1.0` (mevcut fallback).

### 1.4 Kritik

```
critChance = min(CRIT_CAP,
  CRIT_BASE
  + mods.crit/100 * synMul('crit', 0.40)
  + (killCombo >= 10 ? 0.15 : killCombo >= 5 ? 0.08 : 0)
  + (isAmbush ? 1.0 : 0)          // gizlilik çıkışı: roll atlanır, kesin crit
)
critMul = isCrit ? CRIT_MUL : 1.0
```

Kül gizlilik çıkışı: `isAmbush = true` → `critChance` yok sayılır, `critMul = ashAmbushCritMul()` (§3.2).  
DoT ve çevre hasarı kritik atamaz.

### 1.5 Direnç

```
armor = target.armor            // 0 | 0.45 armored | 0.18 boss
armor = max(0, armor - target.shred)     // toprak aşınması
resistMul = max(RESIST_FLOOR, 1 - armor)

// kalkan (mevcut)
if (target.shieldEl === elemId) resistMul *= 0.40
else if (SHIELD_WEAK[target.shieldEl] === elemId) resistMul *= 1.48
```

`armored` tipi bugün `dealt * 0.55` ile gidiyor; yeni modelde `armor = 0.45` aynı net.

### 1.6 Füzyon çarpanı — toplanmaz, hibrit yumuşar

**Yanlış:** `fireDmg + waterDmg`.  
**Doğru:** tek mermi, tek `baseDmg`, çarpanlar ağırlıklı + hibrit bonus.

```
scaleRoot = elemMul(root) * fatigueMul(root)
scaleSec  = elemMul(sec)  * fatigueMul(sec)

blend = FUSION_WEIGHT_ROOT * scaleRoot + FUSION_WEIGHT_SEC * scaleSec

// hibrit: iki ölçek birbirine yaklaştıkça bonus (çarpım, toplam değil)
harmony = 1 - abs(scaleRoot - scaleSec) / max(scaleRoot + scaleSec, 0.001)
hybrid  = 1 + FUSION_HYBRID_K * harmony          // 1.00 .. 1.28

fusionMul =
  if path === 'pure':  1.12                        // Saf omurga prim
  if hit.el === root:  blend * hybrid * 1.00
  if hit.el === sec:   blend * hybrid * 0.86       // leke vuruşu daha zayıf
  else:                1.00
```

Skill (mevcut satırın hedef hali):

```
dmgMul =
  (elemMul(a)*0.55 + elemMul(b)*0.45)
  * (fatigueMul(a)*0.5 + fatigueMul(b)*0.5)
  * hybrid
  * splitFlow
  * softMul(skillDmgLinear)
```

Saf Yol’da `b === a`, `harmony = 1`, `hybrid = 1.28` **verilmez**; Saf prim düz `1.12` (hibrit 1.28 ile yarışmasın).

### 1.7 Ölçeklenme eğrisi (T1 → T3)

Yığılan kaynaklar `linear`’a toplanır, `softMul` ile geçer.

| Kaynak | `linear` katkısı | Softcap öncesi tavan |
|---|---|---|
| eklenti dmg / skillDmg | `mods.x / 100` | kart başına 0.12 |
| graft | 0.10 | 1 graft |
| sig | 0.12 | 1 sig |
| basınç kritik band | 0.20 (skill only) | — |
| flow > 40 | `min(0.12, (flow-40)*0.0018)` | mevcut, softcap dışı (küçük) |

Geç oyun kontrolü:

```
expectedDps(t3) / expectedDps(t1)  ≈  2.4 .. 2.8
enemyHp(t3) / enemyHp(t1)          ≈  4 * hpScale(wave)
```

Hasar eklentisi sınırsız toplanırsa `softMul(3.0) ≈ 2.95`. 4x düşman canı + yumuşak hasar = geç oyun tek vuruşta erimez.

`waveFlat` softcap **dışında** kalır (mevcut `+ wave * 0.22`); geç dalgada taban yavaş büyür.

---

## 2. Durum etkileri ve reaksiyon matrisi

### 2.1 Altı status (hedef model)

Hepsi `StatusStore` üzerinde. Süre `ms`. Boss çarpanı: CC `0.25`, DoT `0.70`, damga `1.00`.

| id | Element | Stack | Tick | Combat etkisi | Tavan |
|---|---|---|---|---|---|
| `burn` | Ateş | 1–5 (boss 3) | 0.50 s | `tick = 0.22 * hitDmgRef * stack` | 5 |
| `wet` | Su | 1 (yenile) | yok | `moveMul = 0.70` (boss 0.85); şok/reaksiyon kapısı | 1 |
| `shock` | Elektrik | 1–3 | yok | sonraki vuruş `* 1.18` / stack; ıslakken zincir | 3 |
| `root` | Doğa | 1 | yok | `moveMul = 0` (boss: 0.85, 0.35 s); `shred += 0.12` | 1 |
| `poison` | Doğa | 1–4 | 0.75 s | `tick = 0.14 * hitDmgRef * stack`; `shred += 0.04*stack` | 4 |
| `shred` | Toprak | 0–0.40 | yok | `armor -= shred` | 0.40 |
| `stun` | Toprak | 1 | yok | hareket/atış yok; boss 0.45 s tavan | 1 |
| `mark` | Karanlık | birikir | yok | `stored += 0.22 * dealt`; patlatınca `stored * 1.15` | `0.35 * maxHp` |
| `blind` | Karanlık (alt) | 1 | yok | nişan yarıçapı −40%, 1.6 s | 1 |

Doğa auto mevcut `lifesteal` yerine: **vuruşta `poison`**, skill kökte `root`. Can çalma eklenti/skill’de kalır (`applyEffect('lifesteal')`).

Gölge Damgası varsayılan: **biriktir-patlat**. Körlük Saf Gölge T2 veya `void` skill’de.

### 2.2 Uygulama

```js
StatusStore.apply(en, statusId, { power, srcEl, hitDmgRef })
// sonra
ReactionResolver.resolve(en, incomingEl, hitCtx)
```

Reaksiyon **vuruş hasarından sonra**, aynı frame. `reactionMul` peek’i vuruştan **önce** okunur (ıslak+elektrik ×1.55 gibi); consume reaksiyonlar peek’te `1.0` döner, burst ayrı event’tir.

### 2.3 Çapraz reaksiyon tablosu

Satır = hedefte **önceden duran** status. Sütun = bu vuruşun elementi.  
`keep` = ikisi de kalır. `consume A` = A silinir. `burst` = anlık alan/hasar.

| Üst \ Vuruş | Ateş | Su | Elektrik | Doğa | Toprak | Karanlık |
|---|---|---|---|---|---|---|
| **Yanma** | stack+1, keep | **Buhar patlaması**: consume burn+wet; `burstK=0.90`, `r=54` | keep; yakma tick `*1.10` (kızgın iletken) | keep; zehir tick `*1.15` (yanıcı özsu) | **Kül zone** 1.2 s, `r=40`, consume değil | keep; `mark.stored += burnTick*2` |
| **Islak** | **Buhar patlaması** (aynı) | süre yenile, keep | **Süperiletken**: `reactionMul=1.55`, zincir +2, consume değil | **Bataklık**: `moveMul=0.50`, `root +0.40s` | **Çamur**: `shred+0.10`, `moveMul=0.55` | **Girdap leke**: `mark.stored * 1.20` |
| **Şok** | keep | ıslak uygula + şok keep | stack+1; `reactionMul=1.18^stack` | keep; kök varken zincir yarıçap +20 | **Ark zırh**: `shred+0.08` | **Yarık**: `reactionMul=1.25`, mark patlat %50 |
| **Kök / Zehir** | yanıcı özsu (üstte) | bataklık (üstte) | zincir +20 r | stack zehir / kök yenile | **Diken kilit**: stun 0.20 s (boss yok) | `mark.stored += poisonLeft*0.5` |
| **Aşınma / Stun** | keep | çamur (üstte) | ark zırh (üstte) | diken kilit (üstte) | shred+0.08, stun yenile (tavan) | keep; mark tavan `*1.10` |
| **Damga** | stored+= , keep | stored*1.20 | yarık %50 patlat | stored+=zehir | tavan*1.10 | **Patlat**: `burst = stored*1.15`, consume mark |

Özel kural: **Buhar patlaması** Ateş↔Su çift yönlü, aynı formül. İki status yoksa tetiklenmez (sadece ıslak veya sadece yanma yetmez — ikisi birden gerekir). Su vuruşu yanık hedefe `wet` uygular **sonra** reaksiyon bakar.

```
steamBurstDmg = 0.90 * max(hitDmg, burnTickDmg * burn.stack)
steamBurstR   = 54
steamStun     = 0.35   // boss 0
```

Şok peek (mevcut `markHitDmg` 1.28 yerine):

```
shockPeek = wet ? 1.55 : pow(1.18, shock.stack)
```

Eski düz `* 1.28` kalkar; ıslak yoksa 1 stack ≈ 1.18, 3 stack ≈ 1.64.

---

## 3. Özel mekanik matematiği

### 3.1 Buhar basınç barı (`steamPressure` 0–100)

Yalnızca füzyon sınıfı `steam`. Saf Ateş/Su bar **almaz**.

```js
const PRESS_HIT_AUTO = 3.0;
const PRESS_HIT_SKILL = 14.0;
const PRESS_BURN_TICK = 1.0;
const PRESS_WET_APPLY = 2.0;
const PRESS_IDLE_GAIN = 4.0;     // /s, 1.5s hasarsız sonra
const PRESS_ON_HURT = -8.0;
const PRESS_DECAY_BELOW = 20;    // 20’nin altında yavaş sızma yok; üstünde
const PRESS_DECAY_PER_S = 2.2;   // combat’ta, idle gain yokken
const BURST_R = 90;
const BURST_STUN = 0.60;
```

Dolum:

```
onAutoHit:      pressure += PRESS_HIT_AUTO
onSkillHit:     pressure += PRESS_HIT_SKILL
onBurnTick:     pressure += PRESS_BURN_TICK
onWetApply:     pressure += PRESS_WET_APPLY
onHurt:         pressure += PRESS_ON_HURT
if (timeSinceHurt >= 1.5) pressure += PRESS_IDLE_GAIN * dtSec
else if (pressure > PRESS_DECAY_BELOW) pressure -= PRESS_DECAY_PER_S * dtSec
pressure = clamp(pressure, 0, 100)
```

Eşik:

| Band | Aralık | `pressureSkillMul` | Extra |
|---|---|---|---|
| low | 0–39 | 1.00 | koni mermi siler (mevcut) |
| mid | 40–79 | 1.12 | koni genişlik ×1.25; her 3. auto mikro koni |
| crit | 80–99 | 1.00 | sonraki skill **burst**; sonra `pressure = 25` |
| over | 100 | 0.70 auto interval, 3.0 s | self 2 hp / 0.5 s; bitince `pressure = 40` |

Burst (80–99 skill):

```
burstDmg = skillBaseDmg * (1.35 + pressure/100 * 0.40)   // 1.35 .. 1.75
burstR   = BURST_R
burstStun = BURST_STUN
```

Mevcut tatlı-nokta basıncı (`pressure` 11.4–16.6, skill consume) **Buhar sınıfında kapanır**; diğer path’lerde eski bar kalabilir. İki sistem aynı HUD’u paylaşmaz: Buhar’da `steamPressure`, diğerlerinde eski `pressure`.

### 3.2 Kül gizlilik (`ashVeil`)

```js
const ASH_VEIL_DUR = 1.60;      // s
const ASH_VEIL_CD  = 16.0;
const ASH_MOVE_MUL = 1.10;
const ASH_DETECT_R = 52;        // px, elit/shooter
const ASH_DETECT_R_BOSS = 90;
const ASH_DETECT_R_TESLA = 120; // tesla / zincir deşifre
const ASH_AMBUSH_CRIT = 2.35;
const ASH_MIST_DETECT_MUL = 0.55;
const ASH_MIST_FIRST_MUL = 1.55; // sis, gizlilik değil
```

Görünmezken:

```
player.moveSpeed *= ASH_MOVE_MUL
player.ashHidden = true
brokenIf: damageTaken || skillUsed || autoFired
notBrokenIf: move
```

Tespit:

```
detected = dist(enemy, player) <= detectR
detectR  = boss ? ASH_DETECT_R_BOSS
         : (hasTesla || hasChain) ? ASH_DETECT_R_TESLA
         : ASH_DETECT_R
if (inAshMist) detectR *= ASH_MIST_DETECT_MUL
```

Tespit edilince gizlilik kırılır, ambush hakkı **yanmaz**.

Çıkış ilk vuruşu (kırılma nedeni auto ise):

```
isAmbush = true
critMul  = ASH_AMBUSH_CRIT          // 2.35, normal crit 2.0 yerine
// roll yok
ashVeil.spent = true
```

Boss’ta `critMul = 1.20` (ambush kısılır). İnfaz eşiği **yok** (Gölge işi).

### 3.3 Manyetizma çarpışma

```js
const POLE_LIFE = 5.0;
const POLE_MAX = 8;
const COLLIDE_R = 28;
const CRASH_STUN = 0.25;
const CRASH_K = 0.55;
```

Kütle vekili (sprite r):

```
mass(en) = (en.r / 14.5) ^ 2
// tank≈2.5, fast≈0.39, boss çarpışmaz
```

Zıt kutup, `dist < COLLIDE_R`:

```
relSpeed = hypot(v1x-v2x, v1y-v2y)
reduced  = (massA * massB) / (massA + massB)     // reduced mass
crashDmg = skillDmg * CRASH_K * (0.65 + 0.35 * clamp(relSpeed / 3.2, 0, 1.4))
         * (0.75 + 0.25 * reduced)
```

Aynı kutup: `force = 10 * (1.2 / max(dist, 12))`, elite 0.6, boss 0.

Oyuncu alanı: kök `storm` → `toPlayer`; kök `earth` → alan merkezi.

---

## 4. Yazılım mimarisi

Katmanlar `index.html` IIFE içinde düz fonksiyon olarak başlar; isimler ileride dosyaya bölünür. Unity/Godot eşlemesi parantezde.

### 4.1 Veri (ScriptableObject / tablo)

```js
// data/elements.json  →  ELEMENTS
ElementDef {
  id: 'fire' | 'water' | 'storm' | 'nature' | 'earth' | 'void',
  statusId: 'burn' | 'wet' | 'shock' | 'poison' | 'shred' | 'mark',
  autoBase: { interval, speed, dmg, r, range, specialEvery, special },
  color, name
}

// data/combos.json  →  COMBO_KITS
SkillDef {
  id: 'fire_water',
  kind, dmg, range, cd, extra,
  applyStatus: ['burn','wet'],
  fusionClass: 'steam' | null
}

// data/reactions.json
ReactionDef {
  id: 'steamBurst',
  needStatus: ['burn','wet'],
  incomingEl: 'fire' | 'water' | '*',
  consume: ['burn','wet'],
  peekMul: 1.0,
  burstK: 0.90,
  burstR: 54
}

PathDef { id, root, secondary, fusionClass, nodes[], graftSlot }
```

`IElementalSkill` (JS’de duck type):

```js
IElementalSkill = {
  id, kind,
  canActivate(runLock, now),
  buildPayload(runLock, mods),     // → SkillDef + dmg
  onHit(hitCtx),
  onTick?(dt, world)
}
```

### 4.2 Servisler

```
RunLock            kök / ikincil / path / graft
FusionResolver     pair → fusionClass, fusionMul
StatusStore        apply / tick / peek
ReactionResolver   peek + resolve + emit
DamagePipeline     computeHitDamage
SynergyManager     kart süzgeci, graft kapısı
SteamGauge         steamPressure
AshVeil            gizlilik
MagnetSystem       kutup / çarpışma
```

### 4.3 FusionResolver (pseudo)

```js
const FUSION_CLASS = {
  'fire+water': 'steam',
  'earth+storm': 'magnet',
  'earth+fire': 'ash',
  'fire+storm': 'plasma',
  'water+void': 'vortex',
  'earth+water': 'mire'
};

function FusionResolver.resolve(runLock) {
  if (!runLock.secondary) return { classId: 'pure_' + runLock.root, fusionMulFn };
  const key = [runLock.root, runLock.secondary].sort().join('+');
  return { classId: FUSION_CLASS[key] || 'stain', fusionMulFn };
}

function fusionMulFn(hitEl) {
  // §1.6
}
```

### 4.4 Mermi event akışı

```
Projectile.update
  → overlap(enemy)
  → HitEvent {
      src: 'auto'|'skill'|'dot'|'crash'|'burst',
      el, baseDmg, isSkill, isAmbush,
      target, projectile
    }
  → reactionMul = ReactionResolver.peek(target, el)
  → dealt = DamagePipeline.compute(HitEvent)
  → target.hp -= dealt                 // takeDamage / markHitDmg
  → StatusStore.apply(skill.statuses)
  → ReactionResolver.resolve(target, el, { dealt })
       → maybe emit BurstEvent (yeni HitEvent src:'burst', crit yok)
  → SteamGauge / AshVeil / MagnetSystem.onHit
  → pruneDead
```

Mevcut kanca eşlemesi:

| Yeni | Eski |
|---|---|
| `DamagePipeline.compute` | `p.dmg` + crit + `takeDamage` + `markHitDmg` |
| `StatusStore.apply` | `applyEffect` |
| `ReactionResolver.resolve` | `tryReactions` (genişlet) |
| `FusionResolver` | `comboInfo` / `AUTO_FUSE` / `pairKey` |
| `SynergyManager` | `elTree` + `pendingRewards` |

`tryReactions` bugün varsa içine tablo id’leri eklenir; yeni if-ormanı yazılmaz.

### 4.5 StatusStore çekirdek

```js
function StatusStore() {
  this.map = new WeakMap(); // enemy → { burn, wet, shock, ... }
}

StatusStore.prototype.get = function(en) {
  if (!this.map.has(en)) this.map.set(en, {});
  return this.map.get(en);
};

StatusStore.prototype.apply = function(en, id, opt) {
  const s = this.get(en);
  const def = STATUS_DEFS[id];
  const slot = s[id] || { id, stack: 0, until: 0, stored: 0 };
  slot.stack = Math.min(def.stackCap, slot.stack + (def.stackOnApply || 1));
  slot.until = now() + def.durMs * (opt.power || 1) * ccMul(en);
  if (id === 'mark') slot.stored = Math.min(def.storeCap(en), slot.stored + 0.22 * (opt.dealt || 0));
  s[id] = slot;
};

StatusStore.prototype.tick = function(en, dtSec) {
  // burn / poison DoT → DamagePipeline src:'dot'
};
```

### 4.6 ReactionResolver çekirdek

```js
function ReactionResolver.peek(en, incomingEl) {
  const s = statusStore.get(en);
  if (s.wet && incomingEl === 'storm') return 1.55;
  if (s.shock && incomingEl !== 'storm') return Math.pow(1.18, s.shock.stack);
  if (s.mark && incomingEl === 'storm') return 1.25;
  return 1.0;
}

function ReactionResolver.resolve(en, incomingEl, hit) {
  const rules = REACTION_TABLE.filter(r => match(r, en, incomingEl));
  rules.forEach(r => {
    if (r.consume) r.consume.forEach(id => statusStore.remove(en, id));
    if (r.burstK) emitBurst(en, hit.dealt * r.burstK, r.burstR, r.id);
  });
}
```

### 4.7 Sprint dilimleri (kod sırası)

1. `STATUS_DEFS` + `StatusStore` — `applyEffect` içini yönlendir.  
2. `REACTION_TABLE` + peek’i `markHitDmg`’ye bağla.  
3. `computeHitDamage` — auto/skill tek fonksiyon.  
4. `fusionMul` — `activateSkill` / `currentAuto` içindeki ham çarpımı değiştir.  
5. `softMul` — eklenti yığını.  
6. `SteamGauge` / `AshVeil` / `MagnetSystem` — sınıf kilitliyken aç.  
7. `SynergyManager` — Lv5 kavşak + graft (GDD).

Restart: `statusStore.clearAll()`, `steamPressure=0`, `ashVeil.reset()`, `magnet.clearPoles()`. Reklamla devam bunları **korur**.

---

## 5. Mevcut koddan sapma listesi

| Eski | Yeni |
|---|---|
| Auto `fuse.dmg` düz toplanır gibi | hibrit `blend * hybrid` |
| `markHitDmg` şok ×1.28 her vuruş | ıslak ×1.55 veya `1.18^stack` |
| Doğa auto lifesteal | auto poison; lifesteal eklenti |
| Tek `pressure` tatlı nokta | Buhar’da ayrı `steamPressure` |
| `tryReactions` dağınık | tablo |
| Hasar eklentisi linear | `softMul` |

Bu belge formül kaynağıdır. Sayı değişince yalnızca buradaki sabitler ve tablo satırları güncellenir.
